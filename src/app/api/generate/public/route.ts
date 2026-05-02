import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { generateLandingPage } from '@/lib/anthropic/generate'
import { scrapeProduct, cleanProduct } from '@/lib/scraper'
import { MOCK_PRODUCT } from '@/lib/mock/product'
import { templateEtecBlue } from '@/lib/templates/etec-blue'
import { validateScrapeUrl } from '@/lib/security/url-allow'
import { verifyTurnstile } from '@/lib/security/turnstile'
import type { ScrapedProduct } from '@/types'

// Service role — la table public_previews n'est plus exposée via la clé anon (RLS lock)
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

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
      product = productInput
    } else {
      product = MOCK_PRODUCT
    }

    if (!product.title) {
      return NextResponse.json({ error: 'Données produit invalides' }, { status: 400 })
    }

    // Génération IA
    const landingPageData = await generateLandingPage(product, {
      language: body.language || 'fr',
      tone: body.tone || 'persuasif',
    })

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
    }).catch(() => {})

    return NextResponse.json({
      success: true,
      preview_id: preview.id,
      product_title: product.title,
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Erreur inconnue'
    console.error('[generate/public]', message)

    if (message.includes('JSON') || message.includes('parse')) {
      return NextResponse.json(
        { error: 'La génération IA a retourné un format invalide. Réessaie.' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { error: 'Une erreur est survenue lors de la génération. Réessaie.' },
      { status: 500 }
    )
  }
}
