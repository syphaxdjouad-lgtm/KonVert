import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { generateLandingPage } from '@/lib/anthropic/generate'
import { scrapeProduct, cleanProduct, looksHallucinated } from '@/lib/scraper'
import { MOCK_PRODUCT } from '@/lib/mock/product'
import { templateEtecBlue } from '@/lib/templates/etec-blue'
import { validateScrapeUrl } from '@/lib/security/url-allow'
import { verifyTurnstile } from '@/lib/security/turnstile'
import { sanitizeDeep } from '@/lib/security/sanitize'
import type { ScrapedProduct } from '@/types'

// Limite anti-abus sur productInput manuel : DeepSeek se fait facturer au token,
// 16 KB de "produit" couvre largement un titre + description + variants normaux
// et bloque la prompt injection à 500 KB (cf audit Madara P1-02).
const MAX_PRODUCT_INPUT_BYTES = 16 * 1024

// Vercel Pro + Fluid Compute = 90s — Bright Data AliExpress 50-65s + DeepSeek 18-22s
export const maxDuration = 90

// Génération publique — 1 page gratuite sans compte
// Stocke la preview en base avec expiration 7 jours
export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}))

    const { email, name, url, product: productInput, turnstileToken } = body

    if (!email || typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Email invalide' }, { status: 400 })
    }

    // Captcha — bloque les bots avant la facture LLM. Bypass automatique
    // si TURNSTILE_SECRET_KEY n'est pas configurée (dev local / preview).
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? null
    const captcha = await verifyTurnstile(turnstileToken, ip)
    if (!captcha.ok) {
      return NextResponse.json({ error: captcha.error || 'Captcha invalide' }, { status: 400 })
    }

    // Anti-resubscribe : si une preview de cet email contient la sentinelle -1
    // dans emails_sent, l'utilisateur s'est explicitement désabonné via
    // /api/email/unsubscribe. On refuse de regénérer pour ne pas relancer la
    // séquence d'emails (sinon désabonnement contournable en attendant
    // l'expiration de la preview).
    const { data: unsubscribed } = await supabaseAdmin
      .from('public_previews')
      .select('id')
      .eq('email', email.toLowerCase())
      .contains('emails_sent', [-1])
      .limit(1)
      .maybeSingle()

    if (unsubscribed) {
      return NextResponse.json(
        { error: 'Cet email s\'est désabonné. Contacte support@konvertpilot.com pour réactiver.' },
        { status: 410 }
      )
    }

    // Rate limiting : 1 génération par email actif (preview non-expirée)
    const { data: existing } = await supabaseAdmin
      .from('public_previews')
      .select('id')
      .eq('email', email.toLowerCase())
      .gte('expires_at', new Date().toISOString())
      .maybeSingle()

    if (existing) {
      return NextResponse.json(
        { error: 'Une page a déjà été générée pour cet email.', preview_id: existing.id },
        { status: 409 }
      )
    }

    // Récupération du produit
    let product: ScrapedProduct

    if (url) {
      // Anti-SSRF — même whitelist que /api/scrape (sinon route ouverte SSRF Puppeteer)
      const check = validateScrapeUrl(url)
      if (!check.ok) {
        return NextResponse.json({ error: check.error }, { status: check.status })
      }
      const raw = await scrapeProduct(check.parsed.toString())
      product = cleanProduct(raw)
    } else if (productInput) {
      // Garde-fou taille : un productInput >16KB est forcément un abus
      // (titre + description normaux = quelques centaines d'octets max).
      const inputSize = JSON.stringify(productInput).length
      if (inputSize > MAX_PRODUCT_INPUT_BYTES) {
        return NextResponse.json(
          { error: 'Données produit trop volumineuses.' },
          { status: 413 }
        )
      }
      // cleanProduct escape <>"' dans title/description et filtre les URLs
      // d'images qui ne sont pas http(s) — sans ça, productInput.title peut
      // contenir <script> et finir réinjecté tel quel dans le HTML servi à
      // /preview/[id] (template fait du string-concat sans escape).
      product = cleanProduct(productInput as ScrapedProduct)
      // Fallback image générique si la saisie manuelle n'a pas fourni d'URL
      // image. Le template + le LLM ont besoin d'au moins une image pour
      // produire un visuel cohérent — l'user pourra remplacer dans l'éditeur.
      if (!product.images || product.images.length === 0) {
        product.images = [
          'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80',
        ]
      }
    } else {
      product = MOCK_PRODUCT
    }

    // Anti-hallucination — check titre uniquement (les images sont gérées
    // par le fallback ci-dessus + le check imagesOk en aval pour les URLs).
    // Évite que DeepSeek génère du contenu pourri à partir d'un titre vide
    // ou d'un payload purement adverse, sans bloquer la saisie manuelle.
    if (productInput || url) {
      const hall = looksHallucinated(product)
      // Si la seule raison est "aucune image" et qu'on est en mode saisie
      // manuelle, on l'a déjà mitigée avec le fallback : on ignore.
      if (hall.fake && !(productInput && hall.reason === 'aucune image produit valide')) {
        return NextResponse.json(
          { error: `Données produit invalides (${hall.reason}).` },
          { status: 400 }
        )
      }
    }

    const titleOk = !!product.title && product.title.trim().length >= 3
    const imagesOk = product.images.length >= 1
    if (!titleOk || !imagesOk) {
      return NextResponse.json(
        { error: 'Données produit invalides ou incomplètes.' },
        { status: 400 }
      )
    }

    // Génération IA
    const rawLandingPageData = await generateLandingPage(product, {
      language: body.language || 'fr',
      tone: body.tone || 'persuasif',
    })

    // Defense-in-depth contre une éventuelle prompt injection : DeepSeek peut
    // recopier du HTML adverse depuis description/title même après cleanProduct
    // (le LLM est libre de réécrire). On escape récursivement TOUTES les strings
    // de l'output avant qu'elles n'atteignent le template ou la DB.
    const landingPageData = sanitizeDeep(rawLandingPageData)

    // Rendu HTML avec le template blue (défaut pour la page gratuite)
    const html = templateEtecBlue(landingPageData)

    // Expiration dans 7 jours
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + 7)

    // Stockage en base (service_role — la table est lockée pour anon)
    const { data: preview, error: dbError } = await supabaseAdmin
      .from('public_previews')
      .insert({
        email: email.toLowerCase(),
        name: name || null,
        product_title: product.title,
        html_content: html,
        landing_page_data: landingPageData,
        expires_at: expiresAt.toISOString(),
        converted: false,
      })
      .select('id')
      .single()

    // Race condition : 2 requêtes simultanées passent toutes deux le SELECT initial.
    // L'index unique partiel `public_previews_email_active_uniq` (migration 20260425)
    // bloque la 2e au niveau DB → on convertit en 409 propre.
    if (dbError?.code === '23505') {
      const { data: dup } = await supabaseAdmin
        .from('public_previews')
        .select('id')
        .eq('email', email.toLowerCase())
        .gte('expires_at', new Date().toISOString())
        .maybeSingle()
      return NextResponse.json(
        { error: 'Une page a déjà été générée pour cet email.', preview_id: dup?.id },
        { status: 409 }
      )
    }

    if (dbError || !preview) {
      console.error('[generate/public] DB error:', dbError?.message)
      return NextResponse.json({ error: 'Erreur lors de la sauvegarde.' }, { status: 500 })
    }

    // Email J+0 — livraison immédiate (fire & forget)
    // AbortSignal.timeout évite qu'une socket reste ouverte indéfiniment si
    // /api/email/preview ne répond jamais (perf audit P-05).
    fetch(`${req.nextUrl.origin}/api/email/preview`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-internal-secret': process.env.CRON_SECRET || '',
      },
      body: JSON.stringify({
        email: email.toLowerCase(),
        name: name || email.split('@')[0],
        preview_id: preview.id,
        product_title: product.title,
        step: 0,
      }),
      signal: AbortSignal.timeout(10_000),
    }).catch(() => {})

    return NextResponse.json({
      success: true,
      preview_id: preview.id,
      product_title: product.title,
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Erreur inconnue'
    console.error('[generate/public]', message)
    const Sentry = await import('@sentry/nextjs').catch(() => null)
    Sentry?.captureException(err, { tags: { route: 'api/generate/public' } })

    if (message.includes('JSON') || message.includes('parse')) {
      return NextResponse.json(
        { error: 'La génération IA a retourné un format invalide. Réessaie.' },
        { status: 500 }
      )
    }

    // Scraping bloqué (anti-bot / cloudflare / toutes méthodes ratées) :
    // message actionnable pour que l'user comprenne et bascule sur la
    // saisie manuelle plutôt que de réessayer en boucle.
    if (message.includes('Scraping impossible') || message.includes('toutes les méthodes')) {
      return NextResponse.json(
        {
          error: 'Ce site bloque les robots (Cloudflare/anti-bot). Essaie une URL AliExpress, Etsy ou Shopify, ou bascule en "Saisie manuelle".',
          code: 'SCRAPER_BLOCKED',
        },
        { status: 502 }
      )
    }

    return NextResponse.json(
      { error: 'Une erreur est survenue lors de la génération. Réessaie ou utilise la saisie manuelle.' },
      { status: 500 }
    )
  }
}
