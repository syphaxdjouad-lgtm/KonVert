import { NextRequest, NextResponse } from 'next/server'
import { generateLandingPage, GENERATION_MODEL } from '@/lib/generation/generate'
import { scrapeProduct, cleanProduct, looksHallucinated, ScrapeError } from '@/lib/scraper'
import { MOCK_PRODUCT } from '@/lib/mock/product'
import { createClient } from '@/lib/supabase/server'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { validateScrapeUrl } from '@/lib/security/url-allow'
import { rateLimitAsync } from '@/lib/security/ratelimit'
import { renderPageV3 } from '@/lib/sections-v3/render-page'
import { DEFAULT_SECTION_ORDER_V3, type V3SectionKey } from '@/lib/sections-v3'
import { suggestStyle } from '@/lib/styles/auto-pick'
import { autoPickTone } from '@/lib/ai/auto-pick-tone'
import { generateV3Copy } from '@/lib/ai/deepseek-v3'
import { deriveInitials } from '@/lib/reviews/derive-initials'
import { sanitizeDeep } from '@/lib/security/sanitize'
import type { DeepSeekV3Output } from '@/lib/ai/v3-schema'
import type { ScrapedProduct } from '@/types'
import type { V3PageData, CopyTone } from '@/types/v3'
import type { StyleId } from '@/lib/styles/types'
import { resolveLanguage } from '@/lib/i18n/languages'
import { buildV3SystemPrompt } from './prompt-v3'
import { detectProductType } from '@/lib/templates/detect-product-type'
import { getSectionPolicy, policyToV3Keys } from '@/lib/generation/section-policy'

// Vercel Pro + Fluid Compute = 90s — Bright Data AliExpress 50-65s + DeepSeek 18-22s
export const maxDuration = 90

// ─── Adaptive sections (V3) ────────────────────────────────────────────────
// Garde-fou de rendu indépendant de l'IA : retire les sections discouraged de
// l'ordre par défaut puis tronque à `max`, en priorisant les sections
// recommandées par la policy. Appliqué même si DeepSeek ignore la consigne du
// system prompt (le schema V3 impose de toujours produire les 13 champs JSON).
function buildV3SectionOrder(
  recommended: V3SectionKey[],
  discouraged: V3SectionKey[],
  max: number,
): V3SectionKey[] {
  const discouragedSet = new Set(discouraged)
  const remaining = DEFAULT_SECTION_ORDER_V3.filter(key => !discouragedSet.has(key))
  if (remaining.length <= max) return remaining

  const recommendedSet = new Set(recommended)
  const prioritized = remaining.filter(key => recommendedSet.has(key))
  const rest = remaining.filter(key => !recommendedSet.has(key))
  return [...prioritized, ...rest].slice(0, max)
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}))

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    // Auth obligatoire — pas de génération sans compte
    if (!user) {
      return NextResponse.json({ error: 'Authentification requise' }, { status: 401 })
    }

    // Rate limit burst (5 générations / minute / user). Le quota DB bloque
    // déjà l'abus mensuel (75/300/9999 selon plan) mais sans throttle un user
    // Pro peut burst 300 appels DeepSeek en quelques secondes (cost
    // amplification ~ $1-2 crames). Ce limiter est indépendant du quota et
    // protège la facture DeepSeek en cas de script abusif.
    const rl = await rateLimitAsync(`generate:${user.id}`, 5, 60_000)
    if (!rl.allowed) {
      const retryAfter = Math.ceil(rl.retryAfterMs / 1000)
      return NextResponse.json(
        { error: `Trop de générations simultanées. Réessaie dans ${retryAfter}s.` },
        { status: 429, headers: { 'Retry-After': String(retryAfter) } }
      )
    }

    // Vérification et incrément atomique du quota via fonction SQL (FOR UPDATE)
    // Évite la race condition : deux requêtes simultanées ne peuvent pas dépasser le quota.
    // On utilise supabaseAdmin (service_role) car la fonction SQL est révoquée
    // du rôle `authenticated` depuis la migration 20260531_grants_hardening —
    // elle ne doit être appelable que côté serveur, jamais via le client SDK.
    const { data: quotaOk, error: quotaError } = await supabaseAdmin
      .rpc('check_and_increment_quota', { p_user_id: user.id })

    if (quotaError) {
      console.error('[/api/generate] quota RPC error:', quotaError.message)
      return NextResponse.json({ error: 'Erreur lors de la vérification du quota.' }, { status: 500 })
    }

    if (!quotaOk) {
      return NextResponse.json(
        { error: 'Quota mensuel atteint. Upgrade ton plan pour continuer.' },
        { status: 429 }
      )
    }

    let product: ScrapedProduct
    // Helper : rollback quota si la génération échoue après l'incrément.
    // Sans ça, un timeout DeepSeek consomme 1 page sans rien produire.
    // Si le rollback lui-même échoue, on remonte à Sentry — sans alerte, le
    // quota du user reste perdu définitivement et il viendra réclamer au support.
    const rollbackQuota = async () => {
      try {
        // Idem check_and_increment_quota : appel via service_role
        // (migration 20260531_grants_hardening).
        await supabaseAdmin.rpc('decrement_quota', { p_user_id: user.id })
      } catch (rbErr) {
        console.error('[/api/generate] decrement_quota échoué:', rbErr)
        const Sentry = await import('@sentry/nextjs').catch(() => null)
        Sentry?.captureException(rbErr, {
          level: 'error',
          tags: { route: 'api/generate', phase: 'rollback_quota' },
          extra: { user_id: user.id },
        })
      }
    }

    if (body.url) {
      // Mode scraping réel depuis une URL — anti-SSRF via whitelist e-commerce
      const check = validateScrapeUrl(body.url)
      if (!check.ok) {
        await rollbackQuota()
        return NextResponse.json({ error: check.error }, { status: check.status })
      }
      try {
        const raw = await scrapeProduct(check.parsed.toString())
        product = cleanProduct(raw)
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'erreur inconnue'
        const detail = err instanceof ScrapeError ? err.detail : undefined
        console.warn('[/api/generate] scraping échoué:', msg, detail)
        await rollbackQuota()
        // Message court côté UI (le détail technique part en debug pour Sentry).
        // Sur AliExpress/Amazon, c'est presque toujours un anti-bot ou un
        // timeout > 22s — pas un bug de notre côté.
        const isTimeout = /timeout|aborted/i.test(msg)
        const userMsg = isTimeout
          ? `Le site a été trop lent à répondre (anti-bot AliExpress/Amazon). Bascule en saisie manuelle — c'est plus rapide pour ce type d'URL.`
          : `Scraping impossible (${msg.slice(0, 80)}). Bascule en saisie manuelle.`
        return NextResponse.json(
          {
            error: userMsg,
            needsManualInput: true,
            partialData: { title: '', description: '', price: '', images: [] },
            debug: detail,
          },
          { status: 422 }
        )
      }

      // Anti-hallucination : si Firecrawl a inventé des données génériques
      // ("Women Summer Dress" + image 150x150.gif), on rejette plutôt que
      // de polluer la génération DeepSeek et l'éditeur.
      // EXCEPTION : si product.partial === true, on a déjà fait du best-effort
      // côté scraper — on ne ré-applique pas ce filtre (qui rejetterait
      // souvent un titre = nom de domaine légitimement parti en partial).
      if (!product.partial) {
        const check2 = looksHallucinated(product)
        if (check2.fake) {
          console.warn('[/api/generate] données hallucinées:', check2.reason)
          await rollbackQuota()
          return NextResponse.json(
            {
              error: `Cette URL n'a pas pu être scrapée correctement (${check2.reason}). AliExpress et Amazon bloquent souvent les scrapers — utilise la saisie manuelle pour ce produit.`,
            },
            { status: 422 }
          )
        }
      }
    } else {
      // Produit fourni directement (saisie manuelle wizard) ou mock.
      // On passe par cleanProduct pour normaliser le prix saisi à la main
      // (peut contenir "€", virgule, espaces) — sinon les templates affichent €NaN.
      product = body.product ? cleanProduct(body.product) : MOCK_PRODUCT
    }

    // Garde-fou anti-hallucination : sans titre exploitable et/ou sans
    // image, DeepSeek n'a rien à se mettre sous la dent → il se rabat sur
    // les exemples du prompt et invente du contenu (cf bug "blender →
    // skincare"). Mieux vaut basculer l'user en saisie manuelle.
    const titleOk = !!product.title && product.title.trim().length >= 3
    const imagesOk = !body.url || product.images.length >= 1
    if (!titleOk || !imagesOk) {
      await rollbackQuota()
      const reason = !titleOk
        ? 'le titre n\'a pas pu être extrait'
        : 'aucune image produit n\'a été récupérée'
      return NextResponse.json(
        {
          error: `Scraping insuffisant — ${reason}. Bascule en saisie manuelle pour ce produit (URL souvent bloquée par anti-bot).`,
          needsManualInput: true,
          partialData: {
            title: product.title || '',
            description: product.description || '',
            price: product.price || '',
            images: product.images || [],
          },
        },
        { status: 422 }
      )
    }

    // ─── V3 path ────────────────────────────────────────────────
    // Activated when `engine === 'v3'` is explicitly passed in the request body.
    // Everything below is additive — legacy callers (no engine field) are unaffected.
    if (body.engine === 'v3') {
      // 1. Resolve styleId — honour explicit user choice, otherwise auto-pick.
      const priceNum = product.price ? parseFloat(product.price) : undefined
      const styleId: StyleId = (body.styleId as StyleId | undefined) ?? suggestStyle({
        title: product.title,
        description: product.description,
        price: Number.isFinite(priceNum) ? priceNum : undefined,
      })

      // 2. Resolve tone — 'auto' and missing both trigger autoPickTone.
      // autoPickTone() is typed as CopyTone (which includes 'auto') but its
      // implementation never returns 'auto'. We cast the fallback explicitly
      // to Exclude<CopyTone, 'auto'> to satisfy the type constraint without
      // modifying the upstream function signature.
      const CONCRETE_TONES = new Set<string>(['friendly', 'premium', 'bold', 'storytelling', 'educational'])
      const rawToneValue = body.tone as string | undefined
      const pickedTone = autoPickTone({
        title: product.title,
        description: product.description,
        price: Number.isFinite(priceNum) ? priceNum : undefined,
      }) as Exclude<CopyTone, 'auto'>
      const resolvedTone: Exclude<CopyTone, 'auto'> =
        rawToneValue && CONCRETE_TONES.has(rawToneValue)
          ? (rawToneValue as Exclude<CopyTone, 'auto'>)
          : pickedTone

      // 3. Build system prompt + call DeepSeek.
      // brand = user-provided via body.brand. Si absent, DeepSeek invente un
      // nom de marque cohérent (instruction dans le prompt).
      const brand = typeof body.brand === 'string' && body.brand.trim().length >= 2
        ? body.brand.trim().slice(0, 40)
        : undefined

      // Adaptive sections — même détection/policy que le path legacy (Task 4),
      // mappée vers les V3SectionKey. Guide le system prompt ET pilote le
      // sectionOrder passé à renderPageV3 plus bas (garde-fou indépendant de l'IA).
      const detectedProductType = detectProductType({ title: product.title, description: product.description })
      const sectionPolicy = getSectionPolicy({
        productType: detectedProductType,
        price: Number.isFinite(priceNum) ? priceNum : undefined,
      })
      const v3Recommended = policyToV3Keys(sectionPolicy.recommended)
      const v3Discouraged = policyToV3Keys(sectionPolicy.discouraged)

      const systemPrompt = buildV3SystemPrompt({
        tone: resolvedTone,
        brand,
        product: {
          title: product.title,
          description: product.description,
        },
        language: resolveLanguage(body.language),
        policy: {
          productType: detectedProductType,
          recommended: v3Recommended,
          discouraged: v3Discouraged,
          min: sectionPolicy.min,
          max: sectionPolicy.max,
        },
      })

      let aiOutput: DeepSeekV3Output
      try {
        const rawAiOutput = await generateV3Copy(systemPrompt)
        // Defense-in-depth contre une éventuelle prompt injection : DeepSeek peut
        // recopier du HTML adverse depuis title/description même après cleanProduct
        // (le LLM est libre de réécrire). Même traitement que /api/generate/public
        // (cf sanitizeDeep) — on escape récursivement TOUTES les strings de l'output
        // avant qu'elles n'atteignent v3Data / le renderer / la DB.
        aiOutput = sanitizeDeep(rawAiOutput)
      } catch (genErr) {
        await rollbackQuota()
        throw genErr
      }

      // 4. Assemble V3PageData — images can be overridden by the caller.
      // Sprint 4 T6 — whitelist domaines autorisés pour photo_url reviews
      // Seuls Unsplash et Shopify CDN sont acceptés (images génériques safe).
      // Toute autre URL (marque inventée, NSFW, copyright) → undefined.
      const PHOTO_URL_WHITELIST = /^https:\/\/(images\.unsplash\.com|cdn\.shopify\.com)\//i
      function sanitizePhotoUrl(url: unknown): string | undefined {
        if (typeof url !== 'string' || !url) return undefined
        return PHOTO_URL_WHITELIST.test(url) ? url : undefined
      }

      // Sprint 4 T4 — gate anti-count : si le LLM produit un label avec chiffre
      // (ex: "Seulement 3 unités"), on strip ou on supprime le stock_signal.
      // Défense en profondeur contre dérive LLM malgré l'instruction SANS chiffre.
      const DIGIT_REGEX = /\d/
      const rawStockSignal = aiOutput.stock_signal
      const sanitizedStockSignal = rawStockSignal
        ? DIGIT_REGEX.test(rawStockSignal.label)
          ? undefined  // label contient un chiffre → on supprime le signal entier
          : rawStockSignal
        : undefined

      const v3Data: V3PageData = {
        styleId,
        tone: resolvedTone,
        // Pilote à la fois <html lang>/dir="rtl" et les libellés d'habillage
        // (CTA, nav, FAQ par défaut...) dans renderPageV3 — cf ui-labels.ts.
        language: resolveLanguage(body.language),
        product: {
          title: product.title,
          description: product.description,
          price: product.price ?? undefined,
          rating: product.rating != null
            ? { value: product.rating, count: product.reviews_count ?? 0 }
            : undefined,
          // Sprint 4 T5 — mapper le champ recommended depuis le LLM.
          // Avant ce fix, route.ts ne mappait que v.name → le badge "Recommandé"
          // du composant compare-variants n'était jamais affiché en prod.
          // aiOutput.variants_meta[idx].recommended vs product.variants : les variants
          // produits viennent du scraper (noms réels) et la recommandation vient du LLM.
          // Le LLM renvoie recommended dans les items de compare_variants directement.
          variants: product.variants.map((v, idx) => ({
            name: v.name,
            recommended: (aiOutput as unknown as { variants_meta?: Array<{ recommended?: boolean }> })
              .variants_meta?.[idx]?.recommended ?? false,
          })),
        },
        images: (body.images as string[] | undefined) ?? product.images,
        copy: {
          brand: brand || aiOutput.brand,
          hero: aiOutput.hero,
          why_we_love: aiOutput.why_we_love,
          features: aiOutput.features,
          best_for: aiOutput.best_for,
          materials: aiOutput.materials,
          care: aiOutput.care,
          faq: aiOutput.faq?.map(f => ({ q: f.q, a: f.a })),
          manifesto: aiOutput.manifesto,
          press_quote: aiOutput.press_quote,
          reviews_summary: aiOutput.reviews_summary,
          how_it_works: aiOutput.how_it_works,
          // Sprint 2+4 — reviews avec photo_url whitelist Unsplash/Shopify CDN.
          // Les URLs hors-whitelist sont supprimées (copyright/marques/URLs inventées).
          // `initials` : jamais celle envoyée par le LLM (repro locale
          // 2026-07-28 — format arabe hors-schema, intermittent en prod) —
          // toujours dérivée server-side depuis `author`, Unicode-safe.
          reviews: aiOutput.reviews?.map(r => ({
            ...r,
            initials: deriveInitials(r.author),
            photo_url: sanitizePhotoUrl(r.photo_url),
            variant: r.variant ?? undefined,
          })),
          // Sprint 4 T4 — stock_signal sans chiffre
          stock_signal: sanitizedStockSignal,
        },
      }

      // 5. Render HTML and return.
      // Adaptive sections — garde-fou de rendu : sectionOrder filtré (discouraged
      // retirés) et tronqué à sectionPolicy.max, indépendamment de ce que
      // DeepSeek a produit (cf buildV3SectionOrder plus haut).
      const sectionOrder = buildV3SectionOrder(v3Recommended, v3Discouraged, sectionPolicy.max)
      const html = renderPageV3(styleId, v3Data, sectionOrder)

      return NextResponse.json({
        html,
        data: v3Data,
        engine: 'v3',
        partial: product.partial === true,
        warning: product.scrape_warning,
        meta: {
          model: 'deepseek-chat',
          styleId,
          tone: resolvedTone,
          product_source: body.url ? 'scraped' : body.product ? 'provided' : 'mock',
        },
      })
    }

    // ─── Legacy path (engine !== 'v3') — untouched ────────────────────────────
    let landingPage
    try {
      landingPage = await generateLandingPage(product, {
        language: body.language,
        tone: body.tone,
      })
    } catch (genErr) {
      // Rollback : DeepSeek timeout ou JSON invalide → ne pas brûler le quota.
      await rollbackQuota()
      throw genErr
    }

    return NextResponse.json({
      success: true,
      data: landingPage,
      // partial: true signale au front que le scrape était incomplet et que
      // l'user devrait jeter un œil au résultat. Le wizard affiche un
      // bandeau warning non-bloquant au-dessus de l'éditeur.
      partial: product.partial === true,
      warning: product.scrape_warning,
      meta: {
        model: GENERATION_MODEL,
        product_source: body.url ? 'scraped' : body.product ? 'provided' : 'mock',
      },
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Erreur inconnue'
    const stack = err instanceof Error ? (err.stack || '').split('\n').slice(0, 6).join(' | ') : ''
    console.error('[/api/generate]', message, stack)
    const Sentry = await import('@sentry/nextjs').catch(() => null)
    Sentry?.captureException(err, { tags: { route: 'api/generate' } })

    // JSON parse error = Claude a retourné du texte invalide
    if (message.includes('JSON') || message.includes('parse')) {
      return NextResponse.json(
        { error: 'La génération IA a retourné un format invalide. Réessaie.' },
        { status: 500 }
      )
    }

    // Ne jamais exposer les détails internes en prod
    return NextResponse.json(
      { error: 'Une erreur est survenue lors de la génération. Réessaie.' },
      { status: 500 }
    )
  }
}
