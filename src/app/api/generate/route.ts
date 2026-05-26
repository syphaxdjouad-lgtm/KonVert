import { NextRequest, NextResponse } from 'next/server'
import { generateLandingPage, GENERATION_MODEL } from '@/lib/anthropic/generate'
import { scrapeProduct, cleanProduct, looksHallucinated, ScrapeError } from '@/lib/scraper'
import { MOCK_PRODUCT } from '@/lib/mock/product'
import { createClient } from '@/lib/supabase/server'
import { validateScrapeUrl } from '@/lib/security/url-allow'
import { renderPageV3 } from '@/lib/sections-v3/render-page'
import { suggestStyle } from '@/lib/styles/auto-pick'
import { autoPickTone } from '@/lib/ai/auto-pick-tone'
import { TONE_PROMPTS } from '@/lib/ai/tone-prompts'
import type { ScrapedProduct } from '@/types'
import type { V3PageData, CopyTone } from '@/types/v3'
import type { StyleId } from '@/lib/styles/types'

// Vercel Pro + Fluid Compute = 90s — Bright Data AliExpress 50-65s + DeepSeek 18-22s
export const maxDuration = 90

// ─── V3 helpers ──────────────────────────────────────────────────────────────

/**
 * Builds the system prompt for V3 copy generation.
 * Injects the resolved tone instruction so DeepSeek output matches the brand voice.
 * The tone 'auto' must be resolved to a concrete tone BEFORE calling this function.
 */
function buildV3SystemPrompt(args: {
  tone: Exclude<CopyTone, 'auto'>
  product: { title: string; description: string; category?: string }
}): string {
  const toneInstruction = TONE_PROMPTS[args.tone] || TONE_PROMPTS.friendly

  return `Tu es un copywriter DTC premium niveau Allbirds/Mejuri/Glossier.

${toneInstruction}

Produit à valoriser :
- Titre : ${args.product.title}
- Description source : ${args.product.description}
${args.product.category ? `- Catégorie : ${args.product.category}` : ''}

Génère un JSON STRICT respectant la structure suivante :

{
  "hero": { "tagline": "≤8 mots, accroche émotionnelle", "subtagline": "≤12 mots, complément" },
  "why_we_love": "3-4 lignes d'émotion authentique, JAMAIS de superlatifs creux",
  "features": [
    { "name": "Nom propriétaire si possible (ex: TENCEL™)", "description": "≤15 mots, bénéfice concret", "isPropriety": false }
  ],
  "best_for": ["3-4 cas d'usage concrets, ≤2 mots chacun"],
  "materials": [
    { "name": "Matériau", "benefit": "≤12 mots", "confidence": 0.0 }
  ],
  "care": "1 phrase d'entretien, chaleureuse",
  "faq": [
    { "q": "Question simple ?", "a": "Réponse directe ≤25 mots" }
  ],
  "manifesto": {
    "headline": "≤6 mots, statement brand",
    "pillars": ["Pilier 1 court", "Pilier 2 court", "Pilier 3 court"]
  }
}

Règles :
- AUCUN emoji
- AUCUN superlatif creux ("incroyable", "unique", "exceptionnel" sans preuve)
- features : 3-5 features max, mots propriétaires bienvenus dans name (style "SoftFit™", "PureBlend")
- best_for : 3-4 cas d'usage, ≤2 mots chacun
- materials : 2-4 matériaux, confidence honest (0.9 = explicite dans desc, 0.4 = inféré)
- faq : 4-5 questions
- Retourne UNIQUEMENT le JSON, aucun texte avant/après`.trim()
}

/**
 * Raw DeepSeek V3 JSON output shape — reflects only what the prompt asks for.
 * All fields are optional defensively (partial responses are acceptable).
 */
interface DeepSeekV3Output {
  hero?: { tagline: string; subtagline: string }
  why_we_love?: string
  features?: Array<{ name: string; description: string; isPropriety?: boolean }>
  best_for?: string[]
  materials?: Array<{ name: string; benefit: string; confidence: number }>
  care?: string
  faq?: Array<{ q: string; a: string }>
  manifesto?: { headline: string; pillars: string[] }
  press_quote?: { quote: string; source: string }
  reviews_summary?: string
  how_it_works?: Array<{ step: number; title: string; description: string }>
}

/**
 * Calls DeepSeek to generate V3 DTC copy.
 * Reuses the same API key and timeout strategy as the legacy path.
 */
async function callDeepSeekV3(systemPrompt: string): Promise<DeepSeekV3Output> {
  const apiKey = process.env.DEEPSEEK_API_KEY
  if (!apiKey) throw new Error('DEEPSEEK_API_KEY manquante dans les variables d\'environnement')

  const doFetch = () =>
    fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        max_tokens: 4096,
        response_format: { type: 'json_object' },
        messages: [{ role: 'system', content: systemPrompt }],
      }),
      signal: AbortSignal.timeout(50000),
    })

  let res = await doFetch()
  if (!res.ok && (res.status === 429 || res.status >= 500)) {
    await new Promise(r => setTimeout(r, 800))
    res = await doFetch()
  }
  if (!res.ok) {
    const txt = await res.text().catch(() => '')
    throw new Error(`DeepSeek V3 ${res.status} : ${txt.slice(0, 200)}`)
  }

  interface _DSResponse { choices: { message: { content: string } }[] }
  const json = await res.json() as _DSResponse
  const raw = json.choices[0]?.message?.content ?? ''
  const cleaned = raw
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/```\s*$/i, '')
    .trim()

  try {
    return JSON.parse(cleaned) as DeepSeekV3Output
  } catch {
    throw new Error('JSON V3 invalide reçu de DeepSeek — réessaie')
  }
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

    // Vérification et incrément atomique du quota via fonction SQL (FOR UPDATE)
    // Évite la race condition : deux requêtes simultanées ne peuvent pas dépasser le quota
    const { data: quotaOk, error: quotaError } = await supabase
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
        await supabase.rpc('decrement_quota', { p_user_id: user.id })
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

    // ─── V3 path ───────────────────────────────────────────────────────────────
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
      const systemPrompt = buildV3SystemPrompt({
        tone: resolvedTone,
        product: {
          title: product.title,
          description: product.description,
        },
      })

      let aiOutput: DeepSeekV3Output
      try {
        aiOutput = await callDeepSeekV3(systemPrompt)
      } catch (genErr) {
        await rollbackQuota()
        throw genErr
      }

      // 4. Assemble V3PageData — images can be overridden by the caller.
      const v3Data: V3PageData = {
        styleId,
        tone: resolvedTone,
        product: {
          title: product.title,
          description: product.description,
          price: product.price ?? undefined,
          rating: product.rating != null
            ? { value: product.rating, count: product.reviews_count ?? 0 }
            : undefined,
          variants: product.variants.map(v => ({ name: v.name })),
        },
        images: (body.images as string[] | undefined) ?? product.images,
        copy: {
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
        },
      }

      // 5. Render HTML and return.
      const html = renderPageV3(styleId, v3Data)

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

    // ─── Legacy path (engine !== 'v3') — untouched ─────────────────────────────
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
    console.error('[/api/generate]', message)
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
