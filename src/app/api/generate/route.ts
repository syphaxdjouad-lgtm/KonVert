import { NextRequest, NextResponse } from 'next/server'
import { generateLandingPage, GENERATION_MODEL } from '@/lib/anthropic/generate'
import { scrapeProduct, cleanProduct, looksHallucinated, ScrapeError } from '@/lib/scraper'
import { MOCK_PRODUCT } from '@/lib/mock/product'
import { createClient } from '@/lib/supabase/server'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { validateScrapeUrl } from '@/lib/security/url-allow'
import { rateLimitAsync } from '@/lib/security/ratelimit'
import { renderPageV3 } from '@/lib/sections-v3/render-page'
import { suggestStyle } from '@/lib/styles/auto-pick'
import { autoPickTone } from '@/lib/ai/auto-pick-tone'
import { TONE_PROMPTS } from '@/lib/ai/tone-prompts'
import { generateV3Copy } from '@/lib/ai/deepseek-v3'
import type { DeepSeekV3Output } from '@/lib/ai/v3-schema'
import type { ScrapedProduct } from '@/types'
import type { V3PageData, CopyTone } from '@/types/v3'
import type { StyleId } from '@/lib/styles/types'
import { resolveLanguage, languageName } from '@/lib/i18n/languages'

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
  brand?: string
  product: { title: string; description: string; category?: string }
  language: string
}): string {
  const toneInstruction = TONE_PROMPTS[args.tone] || TONE_PROMPTS.friendly
  const brandLine = args.brand
    ? `- Nom de marque : ${args.brand} (à utiliser tel quel dans hero + manifesto)`
    : `- Nom de marque : NON FOURNI — invente un nom court, élégant, cohérent avec le produit (ex: "Atelier Forêt" pour cuir artisanal, "Velura" pour skincare, "Halo" pour bijoux)`
  const langName = languageName(args.language)

  return `Tu es un copywriter DTC premium niveau Allbirds/Mejuri/Glossier.

LANGUE DE SORTIE : ${langName}. TOUT le contenu textuel des champs JSON (brand, hero, why_we_love, features, best_for, materials, care, faq, manifesto, press_quote, reviews_summary, how_it_works) doit être rédigé EXCLUSIVEMENT en ${langName}. Les noms propres de marques inventées peuvent rester latins. Les clés JSON restent en anglais (ne pas traduire).

${toneInstruction}

Produit à valoriser :
- Titre : ${args.product.title}
- Description source : ${args.product.description}
${args.product.category ? `- Catégorie : ${args.product.category}` : ''}
${brandLine}

OBLIGATOIRE : génère TOUTES les 13 sections ci-dessous, AUCUNE ne doit être omise. Une page sans press_quote / reviews_summary / how_it_works / reviews paraît vide et amateur.

JSON STRICT à produire :

{
  "brand": "Nom de marque court (2-40 chars), tel que fourni ou inventé",
  "hero": { "tagline": "≤8 mots, accroche émotionnelle", "subtagline": "≤12 mots, complément" },
  "why_we_love": "3-4 lignes d'émotion authentique, JAMAIS de superlatifs creux",
  "features": [
    { "name": "Nom propriétaire si possible (ex: TENCEL™, SoftFit™)", "description": "≤15 mots, bénéfice concret", "isPropriety": false }
  ],
  "best_for": ["3-4 items, chacun est une PROMESSE CLIENT ≤6 mots, formulée avec un verbe ou un adjectif actionnable. EXEMPLES écouteurs : 'Appels clairs en open space', 'Running sans fil qui glisse', 'Concerts sans fatiguer les oreilles'. EXEMPLES mode : 'Confort toute la journée', 'Séchage rapide après le sport', 'Style casual sans effort'. EXEMPLES beauté : 'Peau hydratée dès la 1re nuit', 'Routine simplifiée en 3 gestes'. JAMAIS : mot générique seul sans bénéfice ('Musique', 'Sport', 'Travel', 'Confort', 'Mode'). OBLIGATOIRE : chaque item en ${langName}, jamais en anglais — même pour les mots courts (pas 'Sport', pas 'Travel', pas 'Music')."],
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
  },
  "press_quote": { "quote": "Citation presse crédible ≤20 mots", "source": "Nom du média (ex: Vogue, GQ, Monocle, ELLE, Forbes)" },
  "reviews_summary": "Résumé reviews 2-3 phrases (note moyenne + bénéfice clé + nombre d'avis)",
  "how_it_works": [
    { "step": 1, "title": "≤4 mots", "description": "≤15 mots" },
    { "step": 2, "title": "≤4 mots", "description": "≤15 mots" },
    { "step": 3, "title": "≤4 mots", "description": "≤15 mots" }
  ],
  "reviews": [
    {
      "author": "Prénom N. (ex: Marie L., Thomas D., Sarah M., Adrien P.) — noms génériques français/internationaux, JAMAIS de célébrité ni de marque tierce",
      "initials": "2 lettres majuscules (ex: ML, TD)",
      "rating": 5,
      "title": "Courte accroche entre guillemets ≤8 mots",
      "text": "Avis authentique 2-3 phrases, bénéfice concret, ton naturel",
      "date": "Texte français naturel : 'il y a 3 jours', 'la semaine dernière', 'il y a 2 semaines', 'il y a 1 mois'",
      "photo_url": "URL image optionnelle — UNIQUEMENT https://images.unsplash.com/... ou https://cdn.shopify.com/... Pour 1 ou 2 reviews max, choisis une photo générique et pertinente (personne en train d'utiliser ce type de produit). Pour les autres reviews, mets null.",
      "variant": "Variante si produit multi-variantes (ex: 'Noir mat'), sinon null",
      "verified": true
    }
  ],
  "stock_signal": {
    "label": "Phrase courte SANS chiffre (ex: 'Stock limité', 'Dernières pièces disponibles', 'Ne tardez pas')",
    "tone": "low"
  },
  "variants_meta": [
    { "name": "Nom de la variante (identique à la liste des variantes)", "recommended": false },
    { "name": "Meilleure variante", "recommended": true }
  ]
}

Règles :
- AUCUN emoji
- AUCUN superlatif creux ("incroyable", "unique", "exceptionnel" sans preuve)
- features : 3-5 features, mots propriétaires bienvenus dans name (style "SoftFit™", "PureBlend")
- best_for : 3-4 promesses client ≤6 mots avec verbe/adjectif actionnable, JAMAIS un mot générique seul ("Musique", "Sport", "Travel", "Mode", "Confort"). Exemples valides : "Appels clairs en open space", "Peau hydratée dès la 1re nuit". Exemples invalides : "Musique", "Sport", "Confort".
- materials : 2-4 matériaux, confidence honest (0.9 = explicite dans desc, 0.4 = inféré)
- faq : 4-5 questions
- press_quote : invente une citation presse crédible (média réel, ton sobre)
- reviews_summary : invente un résumé reviews crédible (4.7/5 sur 2400 avis style)
- how_it_works : 3 étapes du parcours produit (de la commande à l'usage)
- reviews : EXACTEMENT 5 avis clients, jamais moins. rating 4 ou 5 pour 80% des avis (crédible mais positif). verified: true pour la majorité. photo_url : propose une URL https://images.unsplash.com/... générique et pertinente sur 1 ou 2 reviews maximum (montre une personne utilisant ce type de produit) — JAMAIS une vraie marque, JAMAIS une célébrité, JAMAIS une URL inventée en dehors de unsplash.com ou cdn.shopify.com. Mets null sur les autres. Noms d'auteurs : prénoms français/internationaux courants + initiale nom (ex: Marie L., Thomas D., Sarah M., Adrien P., Camille V., Lucas M.) — JAMAIS de célébrité, JAMAIS de nom de marque tierce. Texte de l'avis en ${langName}, bénéfice concret, ton naturel de vrai client.
- stock_signal : génère ce champ UNIQUEMENT si le titre ou la description produit évoque explicitement un article populaire, en édition limitée, ou saisonnier. label DOIT être une phrase courte SANS aucun chiffre (ex: "Stock limité", "Dernières pièces disponibles", "Commandez avant rupture"). tone = "critical" pour les articles très saisonniers, "low" pour le reste. Si aucun indice de scarcité dans les données produit → omets complètement le champ stock_signal (null / absent).
- variants_meta : si le produit a des variantes, liste-les TOUTES dans le même ordre avec recommended:true sur UNE SEULE (celle qui offre le meilleur rapport qualité/prix ou la plus populaire). Si une seule variante ou aucune variante → omets ce champ.
- LANGUE STRICTE : TOUTE valeur string doit être en ${langName}, y compris les champs de ≤2 mots (best_for, manifesto.pillars, features.name). DeepSeek tend à sortir des mots en anglais sur les champs courts — c'est INTERDIT.
- Retourne UNIQUEMENT le JSON, aucun texte avant/après`.trim()
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
    // amplification ~ $1-2 cramés). Ce limiter est indépendant du quota et
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
      // brand = user-provided via body.brand. Si absent, DeepSeek invente un
      // nom de marque cohérent (instruction dans le prompt).
      const brand = typeof body.brand === 'string' && body.brand.trim().length >= 2
        ? body.brand.trim().slice(0, 40)
        : undefined
      const systemPrompt = buildV3SystemPrompt({
        tone: resolvedTone,
        brand,
        product: {
          title: product.title,
          description: product.description,
        },
        language: resolveLanguage(body.language),
      })

      let aiOutput: DeepSeekV3Output
      try {
        aiOutput = await generateV3Copy(systemPrompt)
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
          reviews: aiOutput.reviews?.map(r => ({
            ...r,
            photo_url: sanitizePhotoUrl(r.photo_url),
            variant: r.variant ?? undefined,
          })),
          // Sprint 4 T4 — stock_signal sans chiffre
          stock_signal: sanitizedStockSignal,
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
