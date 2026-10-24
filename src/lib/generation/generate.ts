// Génération de landing pages via DeepSeek (deepseek-chat).
// L'API DeepSeek est compatible OpenAI ; on utilise fetch direct, pas de SDK
// nécessaire. Le prompt caching est automatique côté serveur DeepSeek (~80%
// de réduction sur les tokens cachés au 2e appel dans la fenêtre).
//
// Le dossier reste nommé "anthropic/" pour ne pas casser les imports — la
// migration est transparente pour les appelants (route /api/generate, etc.).
//
// PROMPT_VERSION v2.0-enriched-2026-06-05
// Auteur : MINATO
// Hypothèse : ajouter 5 champs CRO (photo_descriptions, payment_methods,
//   press_logos, stock_signal, bundle_offer) pour atteindre parité PageFly/GemPages.
// Coût additionnel estimé : +280 tokens input system + ~420 tokens output
//   → +0.00007 €/req sur DeepSeek (deepseek-chat $0.27/1M input, $1.10/1M output)
//   → +23% output tokens vs v1 — sous le seuil d'alerte +30%.
// Feature-flag : KONVERT_PROMPT_VERSION=v1 pour forcer ancien comportement.

import type { ScrapedProduct, LandingPageData } from '@/types'
import { cleanProductName, sanitizeTitleFallback } from './product-name'
import type { ProductType } from '@/lib/templates'
import type { SectionKey } from '@/lib/templates/sections'
import { detectProductType } from '@/lib/templates/detect-product-type'
import { getSectionPolicy, policyToLegacyKeys, type SectionPolicy } from './section-policy'
import { detectLangDrift } from './lang-drift'

// Champ LandingPageData vidé par chaque SectionKey legacy quand la section est
// "discouraged" par la policy — renderRichSections/SECTION_RENDERERS skippent
// déjà une section dont le champ correspondant est absent/vide (cf sections.ts),
// donc vider le champ suffit à empêcher le rendu, sans toucher au renderer.
// `gallery` est piloté par le nombre d'images scrapées (>= 8), pas un champ
// texte généré par l'IA — rien à stripper ici sans casser le hero.
const LEGACY_KEY_TO_DATA_FIELD: Partial<Record<SectionKey, keyof LandingPageData>> = {
  social_proof_bar:      'social_proof',
  story:                 'story',
  target_audience:       'target_audience',
  features:              'features',
  unique_mechanism:      'unique_mechanism',
  how_it_works:          'how_it_works',
  before_after:          'before_after',
  comparison:            'comparison',
  competitor_comparison: 'competitor_comparison',
  testimonials:          'testimonials',
  press_mentions:        'press_mentions',
  founder_note:          'founder_note',
  value_stack:           'value_stack',
  bonuses:               'bonuses',
  guarantee:             'guarantee',
  trust_badges_payment:  'payment_methods',
  risk_reversal:         'risk_reversal',
  objections:            'objections',
  community_callout:     'community_callout',
  final_pitch:           'final_pitch',
}

// Défense en profondeur (Task 4) : même si DeepSeek ignore la consigne de
// ciblage produit du prompt, on supprime déterministiquement les sections
// discouraged réellement présentes dans la sortie parsée avant de retourner.
// Exportée pour les tests unitaires / vérification — ne pas appeler directement depuis le front.
export function stripDiscouragedSections(data: LandingPageData, policy: SectionPolicy): void {
  const discouragedLegacyKeys = policyToLegacyKeys(policy.discouraged)
  for (const key of discouragedLegacyKeys) {
    const field = LEGACY_KEY_TO_DATA_FIELD[key]
    if (field) delete (data as unknown as Record<string, unknown>)[field]
  }
}

// ─── Sanitization ───────────────────────────────────────────────────────────

// Escape les caractères HTML dangereux. Les templates injectent les champs
// via `${...}` sans escape ; sans cette sanitization, un produit scrapé
// contenant un payload (ou une dérive du LLM) pourrait XSS la preview /
// la page publiée chez le client (Shopify/Woo).
function escapeHtml(s: string): string {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
}

function safeImageUrl(url: string): boolean {
  return typeof url === 'string' && /^https?:\/\//i.test(url)
}

import { ALLOWED_LANGS, LANGUAGE_NAMES } from '@/lib/i18n/languages'

function clampRating(n: unknown): number {
  const v = typeof n === 'number' ? n : Number(n)
  if (!Number.isFinite(v)) return 5
  return Math.min(5, Math.max(1, Math.round(v * 10) / 10))
}

// Normalise un prix en string numérique pur ("29.99", "1499", "0.99").
// Les templates font tous parseFloat(price)/+price → un prix qui contient
// "€", "29,99", "29.99€" etc. produit NaN et casse le rendu (€NaN affiché,
// calculs de réduction NaN, etc.). On force ici un format universel.
export function normalizePrice(p: string | number | null | undefined): string | undefined {
  if (p == null || p === '') return undefined
  const cleaned = String(p)
    .replace(/[^\d,.\-]/g, '') // retire €, $, £, espaces, lettres…
    .replace(/,/g, '.')        // virgule décimale → point
    .replace(/^\.+/, '')       // retire les points en début
    .trim()
  if (!cleaned) return undefined
  // Si plusieurs points (ex: "1.299.99"), garde le dernier comme décimal
  const parts = cleaned.split('.')
  const normalized = parts.length > 1
    ? parts.slice(0, -1).join('') + '.' + parts[parts.length - 1]
    : cleaned
  const n = parseFloat(normalized)
  if (!Number.isFinite(n) || n < 0) return undefined
  return String(n)
}

// Exportée pour les tests unitaires — ne pas appeler directement depuis le front.
export function sanitizeLandingPageData(d: LandingPageData): LandingPageData {
  const lang = typeof d.language === 'string' && ALLOWED_LANGS.has(d.language) ? d.language : 'fr'

  const out: LandingPageData = {
    headline:       escapeHtml(d.headline ?? ''),
    subtitle:       escapeHtml(d.subtitle ?? ''),
    benefits:       (d.benefits ?? []).map(escapeHtml),
    faq:            (d.faq ?? []).map(f => ({
      question: escapeHtml(f.question ?? ''),
      answer:   escapeHtml(f.answer   ?? ''),
    })),
    cta:            escapeHtml(d.cta ?? ''),
    urgency:        escapeHtml(d.urgency ?? ''),
    product_name:   escapeHtml(d.product_name ?? ''),
    price:          normalizePrice(d.price),
    original_price: normalizePrice(d.original_price),
    images:         (d.images ?? []).filter(safeImageUrl),
    language:       lang,
    category:       d.category ? escapeHtml(d.category) : undefined,
    product_type:   d.product_type ? escapeHtml(d.product_type) : undefined,
  }

  if (d.story) {
    out.story = {
      problem:        escapeHtml(d.story.problem ?? ''),
      agitation:      escapeHtml(d.story.agitation ?? ''),
      solution:       escapeHtml(d.story.solution ?? ''),
      transformation: escapeHtml(d.story.transformation ?? ''),
    }
  }

  if (Array.isArray(d.testimonials)) {
    out.testimonials = d.testimonials.map(t => ({
      name:    escapeHtml(t.name ?? ''),
      rating:  clampRating(t.rating),
      text:    escapeHtml(t.text ?? ''),
      variant: t.variant ? escapeHtml(t.variant) : undefined,
    }))
  }

  if (d.comparison) {
    out.comparison = {
      without_title: escapeHtml(d.comparison.without_title ?? ''),
      without:       (d.comparison.without ?? []).map(escapeHtml),
      with_title:    escapeHtml(d.comparison.with_title ?? ''),
      with:          (d.comparison.with ?? []).map(escapeHtml),
    }
  }

  if (d.guarantee) {
    out.guarantee = {
      title:       escapeHtml(d.guarantee.title ?? ''),
      description: escapeHtml(d.guarantee.description ?? ''),
      duration:    escapeHtml(d.guarantee.duration ?? ''),
    }
  }

  if (d.social_proof) {
    out.social_proof = {
      customers: escapeHtml(d.social_proof.customers ?? ''),
      rating:    escapeHtml(d.social_proof.rating ?? ''),
      sold:      escapeHtml(d.social_proof.sold ?? ''),
    }
  }

  if (Array.isArray(d.bonuses)) {
    out.bonuses = d.bonuses.map(b => ({
      title:       escapeHtml(b.title ?? ''),
      description: escapeHtml(b.description ?? ''),
      value:       escapeHtml(b.value ?? ''),
    }))
  }

  // ─── Sections enrichies DTC 2026 (chantier A) ──────────────────────────────

  if (Array.isArray(d.hero_badges)) {
    out.hero_badges = d.hero_badges.map(escapeHtml).filter(Boolean)
  }

  if (Array.isArray(d.target_audience)) {
    out.target_audience = d.target_audience.map(a => ({
      profile: escapeHtml(a.profile ?? ''),
      pain:    escapeHtml(a.pain ?? ''),
    }))
  }

  if (d.unique_mechanism) {
    out.unique_mechanism = {
      name:        escapeHtml(d.unique_mechanism.name ?? ''),
      description: escapeHtml(d.unique_mechanism.description ?? ''),
      proof:       escapeHtml(d.unique_mechanism.proof ?? ''),
    }
  }

  if (Array.isArray(d.features)) {
    out.features = d.features.map(f => ({
      icon:        escapeHtml(f.icon ?? '✨'),
      title:       escapeHtml(f.title ?? ''),
      description: escapeHtml(f.description ?? ''),
    }))
  }

  if (Array.isArray(d.how_it_works)) {
    out.how_it_works = d.how_it_works.map((s, i) => ({
      step:        typeof s.step === 'number' ? s.step : i + 1,
      title:       escapeHtml(s.title ?? ''),
      description: escapeHtml(s.description ?? ''),
    }))
  }

  if (Array.isArray(d.before_after)) {
    out.before_after = d.before_after.map(ba => ({
      before: escapeHtml(ba.before ?? ''),
      after:  escapeHtml(ba.after ?? ''),
    }))
  }

  if (d.competitor_comparison) {
    const cc = d.competitor_comparison
    out.competitor_comparison = {
      criteria: (cc.criteria ?? []).map(escapeHtml),
      us: {
        name:   escapeHtml(cc.us?.name ?? ''),
        values: (cc.us?.values ?? []).map(escapeHtml),
      },
      them: (cc.them ?? []).map(t => ({
        name:   escapeHtml(t.name ?? ''),
        values: (t.values ?? []).map(escapeHtml),
      })),
    }
  }

  // press_mentions — guardrail v2.1 : même whitelist que press_logos.
  // press_mentions est un string[] (vs press_logos qui est { publication, quote_short? }[]).
  if (Array.isArray(d.press_mentions)) {
    out.press_mentions = d.press_mentions
      .filter(s => typeof s === 'string' && s.trim().length > 0)
      .filter(s => PRESS_LOGOS_WHITELIST.has(s.toLowerCase().trim()))
      .slice(0, 3)
      .map(escapeHtml)
  }

  if (d.founder_note) {
    out.founder_note = {
      name:    escapeHtml(d.founder_note.name ?? ''),
      role:    escapeHtml(d.founder_note.role ?? ''),
      message: escapeHtml(d.founder_note.message ?? ''),
    }
  }

  if (d.value_stack) {
    out.value_stack = {
      items:   (d.value_stack.items ?? []).map(it => ({
        label: escapeHtml(it.label ?? ''),
        value: escapeHtml(it.value ?? ''),
      })),
      total:   escapeHtml(d.value_stack.total ?? ''),
      you_pay: escapeHtml(d.value_stack.you_pay ?? ''),
      savings: escapeHtml(d.value_stack.savings ?? ''),
    }
  }

  if (Array.isArray(d.risk_reversal)) {
    out.risk_reversal = d.risk_reversal.map(r => ({
      icon:        escapeHtml(r.icon ?? '✓'),
      title:       escapeHtml(r.title ?? ''),
      description: escapeHtml(r.description ?? ''),
    }))
  }

  if (Array.isArray(d.objections)) {
    out.objections = d.objections.map(o => ({
      objection: escapeHtml(o.objection ?? ''),
      response:  escapeHtml(o.response ?? ''),
    }))
  }

  if (d.community_callout) {
    out.community_callout = {
      title:       escapeHtml(d.community_callout.title ?? ''),
      description: escapeHtml(d.community_callout.description ?? ''),
      cta:         escapeHtml(d.community_callout.cta ?? ''),
    }
  }

  if (typeof d.final_pitch === 'string') {
    out.final_pitch = escapeHtml(d.final_pitch)
  }

  // ─── Champs CRO enrichis v2 ─────────────────────────────────────────────

  // photo_descriptions
  if (Array.isArray(d.photo_descriptions)) {
    const VALID_SENTIMENTS = new Set(['before', 'during', 'after', 'lifestyle'])
    out.photo_descriptions = d.photo_descriptions
      .filter(
        (p): p is NonNullable<(typeof d.photo_descriptions)>[number] =>
          p != null &&
          typeof p.context === 'string' &&
          typeof p.customer_first_name === 'string' &&
          VALID_SENTIMENTS.has(p.sentiment),
      )
      .map(p => ({
        context: escapeHtml(p.context.slice(0, 200)),
        customer_first_name: escapeHtml(p.customer_first_name.slice(0, 40)),
        sentiment: p.sentiment,
      }))
  }

  // payment_methods
  const VALID_PAYMENT_METHODS = new Set([
    'visa', 'mastercard', 'amex', 'paypal', 'apple_pay', 'google_pay', 'klarna', 'alma',
  ])
  if (Array.isArray(d.payment_methods) && d.payment_methods.length > 0) {
    const filtered = d.payment_methods.filter(m => VALID_PAYMENT_METHODS.has(m))
    // Si le LLM retourne des valeurs inconnues → on garde le défaut safe
    out.payment_methods = filtered.length > 0
      ? (filtered as LandingPageData['payment_methods'])
      : ['visa', 'mastercard', 'paypal', 'apple_pay']
  } else if (USE_V2_PROMPT) {
    // v2 : toujours fournir un défaut si absent (ANNA attend ce champ)
    out.payment_methods = ['visa', 'mastercard', 'paypal', 'apple_pay']
  }

  // press_logos — guardrail v2.1 : whitelist brand-based stricte
  // Toute publication hors PRESS_LOGOS_WHITELIST est strippée silencieusement.
  // Si le LLM hallucine "Parenting France" ou autre, on n'affiche jamais.
  if (Array.isArray(d.press_logos)) {
    out.press_logos = d.press_logos
      .filter(
        (p): p is NonNullable<(typeof d.press_logos)>[number] =>
          p != null && typeof p.publication === 'string' && p.publication.trim().length > 0,
      )
      .filter(p => PRESS_LOGOS_WHITELIST.has(p.publication.toLowerCase().trim()))
      .slice(0, 3)
      .map(p => ({
        publication: escapeHtml(p.publication.slice(0, 80)),
        ...(typeof p.quote_short === 'string' && p.quote_short.trim().length > 0
          ? { quote_short: escapeHtml(p.quote_short.slice(0, 80)) }
          : {}),
      }))
  }

  // stock_signal
  if (d.stock_signal != null) {
    const VALID_STOCK_TYPES = new Set([
      'limited_stock', 'high_demand', 'back_in_stock', 'limited_time',
    ])
    if (
      d.stock_signal.type != null &&
      VALID_STOCK_TYPES.has(d.stock_signal.type) &&
      typeof d.stock_signal.message === 'string' &&
      typeof d.stock_signal.cta_intensifier === 'string'
    ) {
      out.stock_signal = {
        type: d.stock_signal.type,
        message: escapeHtml(d.stock_signal.message.slice(0, 100)),
        cta_intensifier: escapeHtml(d.stock_signal.cta_intensifier.slice(0, 60)),
      }
    } else {
      out.stock_signal = null
    }
  } else if (d.stock_signal === null) {
    out.stock_signal = null
  }

  // bundle_offer
  if (d.bundle_offer != null) {
    if (
      typeof d.bundle_offer.title === 'string' &&
      typeof d.bundle_offer.description === 'string' &&
      Array.isArray(d.bundle_offer.products_to_pair) &&
      typeof d.bundle_offer.discount_label === 'string'
    ) {
      out.bundle_offer = {
        title: escapeHtml(d.bundle_offer.title.slice(0, 80)),
        description: escapeHtml(d.bundle_offer.description.slice(0, 300)),
        products_to_pair: d.bundle_offer.products_to_pair
          .filter((p): p is string => typeof p === 'string' && p.trim().length > 0)
          .slice(0, 5)
          .map(p => escapeHtml(p.slice(0, 80))),
        discount_label: escapeHtml(d.bundle_offer.discount_label.slice(0, 60)),
      }
    } else {
      out.bundle_offer = null
    }
  } else if (d.bundle_offer === null) {
    out.bundle_offer = null
  }

  return out
}

// ─── Whitelist press_logos / press_mentions ──────────────────────────────────
//
// Liste canonique de publications presse autorisées. Toute publication hors de
// cette liste est strippée par le sanitizer, indépendamment de ce que le LLM
// retourne. Défense en profondeur contre les hallucinations brand-based
// (cf. audit 2026-06-06 : 58.5% hallucination sur golden set).
//
// Normalisation : .toLowerCase().trim() avant comparaison.
// Mise à jour : passage obligatoire revue MADARA + OROCHIMARU avant ajout.
const PRESS_LOGOS_WHITELIST: ReadonlySet<string> = new Set([
  // Mode / Beauté FR + intl
  'vogue', 'elle', 'marie claire', 'allure', "harper's bazaar", 'glamour',
  'cosmopolitan', 'grazia', 'madame figaro', 'le figaro madame', 'refinery29',
  // Déco / Maison
  'elle décoration', 'marie claire maison', 'ad', 'côté maison',
  // Tech / Business
  'forbes', 'techcrunch', 'the verge', 'wired', 'fast company',
  'business of fashion', 'gq',
  // Sport / Wellness
  "women's health", 'yoga journal',
  // Animaux
  "30 millions d'amis",
  // Presse généraliste FR
  'le monde', 'le figaro', 'les echos',
])

// ─── Prompts ────────────────────────────────────────────────────────────────

// LANGUAGE_NAMES / ALLOWED_LANGS importés depuis @/lib/i18n/languages

const TONE_INSTRUCTIONS: Record<string, string> = {
  persuasif: 'Ton persuasif : crée de l\'émotion, joue sur les désirs et la peur de manquer, pousse à l\'action immédiate.',
  premium: 'Ton premium et luxueux : langage élégant, valorise l\'exclusivité et la qualité supérieure, prix justifié par l\'excellence.',
  fun: 'Ton fun et décalé : léger, plein d\'énergie, utilise des formules originales, rend le produit désirable et cool.',
  informatif: 'Ton informatif et rassurant : pédagogue, faits concrets, chiffres précis, répond aux objections avec des preuves.',
}

// System prompt + schéma JSON sont 100% statiques pour une langue donnée
// → DeepSeek les met en cache automatiquement côté serveur (TTL ~heures).
// Au 2e appel, ~80% des tokens d'input sont facturés à 10% du prix.
//
// ARCHITECTURE CACHE :
// - buildSystemPrompt(language) retourne un string PUREMENT STATIQUE pour
//   une langue donnée. Aucun userId, aucune date, aucun contexte user ne
//   doit jamais être injecté ici — tout ça va dans buildUserPrompt().
// - Côté DeepSeek, le cache est activé automatiquement dès que le même
//   system prompt est renvoyé dans les ~heures. Pas de header à ajouter.
//
// Bug C (drift langue — investigation 2026-07-28/08-08) : sur langue non-FR
// (ex arabe), les champs headline→social_proof revenaient SYSTÉMATIQUEMENT
// en français malgré la consigne explicite, alors que les champs plus tardifs
// du même JSON (guarantee→final_pitch) suivaient la consigne ~50% du temps.
// Repro locale (harness jetable, 8 runs baseline) : 64/64 = 100% drift FR sur
// les champs précoces. Isolation par A/B testé sur 4 conditions :
//   - neutraliser le bloc few-shot FR (486-513 legacy)     → 0% d'effet
//   - neutraliser SEULEMENT le schema JSON ci-dessous       → drift tombe à 0%
//   - traduire SEULEMENT les règles 0-13 (buildUserPrompt)  → 0% d'effet
//   - neutraliser schema + règles ensemble                  → 83% (pire que schema seul)
// Cause isolée : le schema JSON qui suit contenait des exemples de COPY
// littéraux en français ("ex: 'Les actives 30-45 ans'", "ex: 'Sans [produit]'",
// "Prix, Ingrédients naturels...", "Notre produit", "Marque pharmacie"...) —
// ces exemples ancrent le modèle en français pour les champs correspondants,
// indépendamment de la consigne de langue. Fix : les exemples de COPY
// littéraux ont été retirés/rendus structurels (langue-agnostiques) ;
// les DESCRIPTIONS méta (instructions sur le format attendu) restent en
// français — elles n'influencent pas la langue de sortie (prouvé par le test
// "règles 0-13 traduites seules → 0% d'effet"). Les règles 0-13 de
// buildUserPrompt n'ont volontairement PAS été touchées (inefficace seul,
// contre-productif combiné).
export const buildSystemPrompt = (language: string): string => {
  const langName = LANGUAGE_NAMES[language] || 'français'

  // Partie enrichie v2 : 5 nouveaux champs CRO.
  // Séparée en constante pour pouvoir A/B tester v1 vs v2 via feature-flag.
  const V2_SCHEMA_BLOCK = USE_V2_PROMPT ? `
  "photo_descriptions": [
    {
      "context": "description visuelle en 1 phrase (genre apparent, âge, contexte d'usage, lumière) — ex: 'Femme 30-35 ans applique la crème devant le miroir de la salle de bain, lumière naturelle matinale'",
      "customer_first_name": "prénom cohérent langue cible",
      "sentiment": "before | during | after | lifestyle"
    }
  ],
  "payment_methods": ["visa", "mastercard", "paypal", "apple_pay"],
  "press_logos": [
    { "publication": "Vogue", "quote_short": "Citation max 80 chars — OPTIONNEL" }
  ],
  "stock_signal": {
    "type": "limited_stock | high_demand | back_in_stock | limited_time | null",
    "message": "ex: 'Plus que 12 en stock' — max 100 chars",
    "cta_intensifier": "ex: 'Commandez maintenant' — max 60 chars"
  },
  "bundle_offer": {
    "title": "ex: 'Routine complète' — max 80 chars",
    "description": "1-2 phrases",
    "products_to_pair": ["Nom produit complémentaire 1", "Nom produit 2"],
    "discount_label": "ex: '-15% sur le bundle' — max 60 chars"
  }` : ''

  // Note : les règles 26-30 (photo_descriptions/payment_methods/press_logos/
  // stock_signal/bundle_offer) sont définies plus bas, inline dans le prompt
  // (cf. USE_V2_PROMPT ? ... vers la ligne 690) — c'est cette version qui est
  // réellement interpolée. Un bloc V2_RULES_BLOCK dupliquant ces mêmes règles
  // existait ici mais n'était jamais interpolé dans le prompt final (variable
  // assignée puis jamais lue) ; supprimé pour éviter la confusion entre les
  // deux versions du guardrail anti-hallucination press_logos.

  return `Tu es un copywriter e-commerce d'élite, spécialiste de la conversion sur les landing pages produit (DTC, dropshipping, marques digitales).

Tu maîtrises les frameworks éprouvés :
- PAS (Problème — Agitation — Solution) pour accrocher
- AIDA (Attention — Intérêt — Désir — Action) pour structurer
- Les 7 leviers de Cialdini (réciprocité, engagement, preuve sociale, autorité, sympathie, rareté, unité)
- StoryBrand : le client est le héros, le produit est le guide

Ton style :
- Titres qui parlent au DÉSIR PROFOND du client, jamais aux features
- Bénéfices orientés transformation : ce que la vie du client devient
- Mécanisme expliqué quand pertinent (POURQUOI ça marche)
- Urgence authentique, jamais artificielle ou mensongère
- Témoignages réalistes : prénom + initiale, détail concret, émotion vraie
- Ton direct, humain, zéro jargon corporate
- Variation des longueurs de phrases (rythme oral)

Tu connais les biais cognitifs : aversion à la perte, ancrage de prix, preuve sociale, effet de halo, paradoxe du choix.

IMPORTANT : Tu génères TOUT le contenu textuel en ${langName}. Chaque mot du JSON doit être en ${langName}, témoignages et noms inclus (utilise des prénoms cohérents avec la langue/culture cible).

Tu réponds UNIQUEMENT avec un JSON valide, sans markdown, sans explication, sans texte avant ou après.

═══════════════════════════════════════════════
FEW-SHOT EXAMPLES — calibration ton DTC-grade
(extraits, pas à copier — juste le registre visé)
═══════════════════════════════════════════════

NICHE BEAUTÉ (sérum visage) — HEADLINES À ÉVITER vs PRIVILÉGIER :
ÉVITER : "Découvrez notre sérum révolutionnaire aux actifs naturels"
PRIVILÉGIER : "La peau qu'on vous a dit impossible à avoir après 35 ans"
ÉVITER testimonial : "Super produit, très satisfaite !"
PRIVILÉGIER testimonial : "J'ai arrêté de me cacher derrière le fond de teint — pour la première fois depuis mes 30 ans."

NICHE MODE (sneakers) — HEADLINES :
ÉVITER : "Des sneakers confortables et stylées pour toutes vos sorties"
PRIVILÉGIER : "Enfilez-les, oubliez-les. Pensez à autre chose."
photo_description UGC exemple : "Femme 25-30 ans, jean wide-leg + sneaker blanc, terrasse café Paris, lumière dorée fin de journée, sourire naturel non posé"

NICHE DÉCO (bougie artisanale) :
ÉVITER : "Bougies de qualité supérieure pour votre intérieur"
PRIVILÉGIER : "Le dimanche soir qu'on cherchait depuis toujours"
bundle_offer exemple : { "title": "Rituel Maison", "description": "Parce qu'une atmosphère se crée par couches.", "products_to_pair": ["Diffuseur céramique", "Spray textile lin"], "discount_label": "-12% sur les 3" }

NICHE TECH (accessoire smartphone) — press_logos CORRECT vs INCORRECT :
CORRECT : ["Wired", "TechCrunch", "The Verge"] — couvrent l'accessoire tech
INCORRECT : ["Vogue", "Marie Claire"] — ne couvrent pas les accessoires smartphone
NICHE INCONNUE (boutique Shopify < 5000 avis OU AliExpress) :
press_logos = [] OBLIGATOIRE. Aucune publication ne couvre les marques no-name.
press_mentions = [] OBLIGATOIRE pour la même raison.
═══════════════════════════════════════════════

Tu réponds avec ce JSON exact (sans markdown, sans commentaire) :
{
  "headline": "string — accroche principale, max 12 mots, image mentale forte",
  "subtitle": "string — développe la promesse, max 20 mots",
  "hero_badges": [
    "string — badge court 1-3 mots exprimant un argument de confiance (origine, certification, livraison)",
    "string", "string"
  ],
  "story": {
    "problem": "string — situation douloureuse vécue par le client (1-2 phrases)",
    "agitation": "string — amplifie la frustration, ce qui se passe si rien ne change (1-2 phrases)",
    "solution": "string — comment le produit résout le problème, mécanisme (2-3 phrases)",
    "transformation": "string — la nouvelle réalité du client après usage (1-2 phrases)"
  },
  "target_audience": [
    { "profile": "description démographique courte du profil client", "pain": "douleur principale en 1 phrase courte" },
    { "profile": "string", "pain": "string" },
    { "profile": "string", "pain": "string" }
  ],
  "features": [
    { "icon": "emoji 1 caractère pertinent", "title": "2-3 mots", "description": "1 phrase max 12 mots" },
    { "icon": "string", "title": "string", "description": "string" },
    { "icon": "string", "title": "string", "description": "string" },
    { "icon": "string", "title": "string", "description": "string" },
    { "icon": "string", "title": "string", "description": "string" },
    { "icon": "string", "title": "string", "description": "string" }
  ],
  "unique_mechanism": {
    "name": "string — nom court du mécanisme/technologie, invente un nom propriétaire court",
    "description": "2-3 phrases : ce qui rend ce produit unique, le POURQUOI ça marche, ingrédient/technique différenciante",
    "proof": "1 phrase de preuve concrète (étude, brevet, % d'efficacité, certification)"
  },
  "how_it_works": [
    { "step": 1, "title": "string — 2-3 mots", "description": "1 phrase max 15 mots" },
    { "step": 2, "title": "string", "description": "string" },
    { "step": 3, "title": "string", "description": "string" },
    { "step": 4, "title": "string", "description": "string" }
  ],
  "before_after": [
    { "before": "état douloureux avant usage, 1 phrase concrète", "after": "état désirable après usage, 1 phrase concrète" },
    { "before": "string", "after": "string" },
    { "before": "string", "after": "string" }
  ],
  "comparison": {
    "without_title": "titre court négatif (2-4 mots)",
    "without": ["frustration 1", "frustration 2", "frustration 3", "frustration 4"],
    "with_title": "titre court positif (2-4 mots)",
    "with": ["bénéfice 1", "bénéfice 2", "bénéfice 3", "bénéfice 4"]
  },
  "competitor_comparison": {
    "criteria": ["critère de comparaison 1", "critère 2", "critère 3", "critère 4", "critère 5"],
    "us": { "name": "nom du produit/marque", "values": ["valeur 1", "valeur 2", "valeur 3", "valeur 4", "valeur 5"] },
    "them": [
      { "name": "nom de concurrent générique par type (SANS vraie marque)", "values": ["valeur 1", "valeur 2", "valeur 3", "valeur 4", "valeur 5"] },
      { "name": "nom de concurrent générique par type (SANS vraie marque)", "values": ["valeur 1", "valeur 2", "valeur 3", "valeur 4", "valeur 5"] }
    ]
  },
  "social_proof": {
    "customers": "string — nombre de clients satisfaits, chiffre réaliste non arrondi",
    "rating": "string — note moyenne sur 5 + nombre d'avis vérifiés",
    "sold": "string — volume de commandes récentes"
  },
  "press_mentions": [
    "string — nom de média réaliste et pertinent pour la catégorie produit",
    "string", "string", "string", "string"
  ],
  "testimonials": [
    { "name": "Prénom + initiale", "rating": 5, "text": "2-3 phrases, détail concret, émotion vraie", "variant": "variante choisie si pertinent" },
    { "name": "string", "rating": 5, "text": "string", "variant": "string" },
    { "name": "string", "rating": 4, "text": "string", "variant": "string" }
  ],
  "founder_note": {
    "name": "string — prénom + nom du fondateur (cohérent culture cible)",
    "role": "string — titre/fonction du fondateur",
    "message": "3-4 phrases — pourquoi j'ai créé ce produit, mon histoire personnelle, ma promesse au client"
  },
  "value_stack": {
    "items": [
      { "label": "produit principal", "value": "montant" },
      { "label": "bonus 1", "value": "montant" },
      { "label": "bonus 2", "value": "montant" },
      { "label": "bonus 3", "value": "montant" }
    ],
    "total": "montant total",
    "you_pay": "montant final",
    "savings": "montant économisé"
  },
  "guarantee": {
    "title": "titre court de garantie",
    "description": "explication courte (1-2 phrases)",
    "duration": "durée de la garantie"
  },
  "risk_reversal": [
    { "icon": "🚚", "title": "titre court (livraison)", "description": "1 phrase concrète" },
    { "icon": "↩️", "title": "titre court (retour)", "description": "1 phrase concrète" },
    { "icon": "💬", "title": "titre court (support)", "description": "1 phrase concrète" }
  ],
  "bonuses": [
    { "title": "bonus 1", "description": "courte description", "value": "montant" },
    { "title": "string", "description": "string", "value": "string" },
    { "title": "string", "description": "string", "value": "string" }
  ],
  "objections": [
    { "objection": "objection émotionnelle réaliste du client", "response": "réponse rassurante 2-3 phrases qui désamorce" },
    { "objection": "string", "response": "string" },
    { "objection": "string", "response": "string" },
    { "objection": "string", "response": "string" },
    { "objection": "string", "response": "string" }
  ],
  "community_callout": {
    "title": "titre engageant d'invitation à la communauté",
    "description": "1 phrase qui invite à rejoindre la communauté",
    "cta": "court appel à l'action"
  },
  "faq": [
    { "question": "string", "answer": "réponse rassurante, 2-3 phrases max" },
    { "question": "string", "answer": "string" },
    { "question": "string", "answer": "string" },
    { "question": "string", "answer": "string" },
    { "question": "string", "answer": "string" }
  ],
  "final_pitch": "string — paragraphe de fermeture émotionnel, 3-4 phrases, qui résume la transformation promise et invite à passer à l'action MAINTENANT",
  "cta": "verbe d'action + bénéfice, max 8 mots",
  "urgency": "urgence authentique courte, max 12 mots",
  "product_name": "nom commercial court du produit"${V2_SCHEMA_BLOCK ? ',' : ''}
${V2_SCHEMA_BLOCK}
}`
}

// Policy injectée dans buildUserPrompt — jamais dans buildSystemPrompt (qui doit
// rester 100% statique par langue pour le prompt caching DeepSeek, cf en-tête
// du fichier). `productType` sert uniquement à l'affichage de la consigne.
export type PromptSectionPolicy = SectionPolicy & { productType: ProductType | null }

export const buildUserPrompt = (
  product: ScrapedProduct,
  tone: string,
  priceLine: string,
  language = 'fr',
  policy?: PromptSectionPolicy,
): string => {
  const toneInstruction = TONE_INSTRUCTIONS[tone] || TONE_INSTRUCTIONS['persuasif']
  const langName = LANGUAGE_NAMES[language] || 'français'
  // Ciblage produit (adaptive sections) : guide DeepSeek vers le socle de
  // sections pertinent pour ce type de produit. Non-bloquant — un strip
  // côté serveur (generateLandingPage) rattrape les sections discouraged
  // que l'IA générerait quand même (cf section-policy.ts).
  const policyBlock = policy ? `

CIBLAGE PRODUIT (type: ${policy.productType ?? 'non détecté — socle universel'}) :
- Sections à REMPLIR en priorité : ${policyToLegacyKeys(policy.recommended).join(', ') || 'aucune contrainte'}
- Sections à NE PAS générer (hors-sujet pour ce produit) : ${policyToLegacyKeys(policy.discouraged).join(', ') || 'aucune'}
- Vise entre ${policy.min} et ${policy.max} sections au total. Tu peux retirer une section du socle si non pertinente, ou en ajouter une hors socle si le produit le justifie clairement.` : ''
  return `Génère une landing page de vente complète et haute conversion pour ce produit e-commerce.

TON DE RÉDACTION : ${toneInstruction}

DONNÉES PRODUIT :
- Nom : ${product.title}
- Description : ${product.description}
- Prix de vente : ${product.price ? `${product.price}€` : 'non défini'}
- Prix original / barré : ${product.original_price ? `${product.original_price}€` : 'non défini'}
- Note clients : ${product.rating ? `${product.rating}/5 (${product.reviews_count?.toLocaleString()} avis)` : 'non disponible'}
- Variantes : ${product.variants.map(v => `${v.name}: ${v.values.join(', ')}`).join(' | ') || 'aucune'}

RÈGLES DE GÉNÉRATION :
0. PRODUCT ANCHOR — ABSOLUTE RULE: never invent a different product category. "product_name" must exactly describe the product given in "Nom" above (you may rephrase/shorten, never change its nature). ALL content (story, benefits, testimonials, FAQ, features, mechanism, competitor comparison, objections, founder note, etc.) must stay strictly consistent with this real product — never invent ingredients, materials, or use cases that don't match it.

1. headline: create a STRONG MENTAL IMAGE and touch a deep desire, never just describe the product
2. hero_badges: 3 short trust badges (origin, certification, shipping) relevant to the product
3. story: follow PAS — problem experienced → emotional agitation → solution with mechanism → transformation
4. target_audience: 3 distinct ICP profiles (age/situation/need) with their main pain point
5. benefits: action verb, transformation/result oriented, max 15 words each
6. features: 6 concrete features with a relevant emoji icon (material, technology, ergonomics, warranty...)
7. unique_mechanism: name the unique technology/ingredient/technique that explains WHY it works, with concrete proof
8. how_it_works: 4 clear steps (purchase → use → result) in the customer's own words
9. before_after: 3 concrete pairs — painful BEFORE state → desirable AFTER state
10. comparison: "With / Without" — 4 symmetric points, concrete benefits vs real frustrations
11. competitor_comparison: 5 criteria + us + 2 GENERIC competitors (no real brand names, just a type/category) — we win on ≥3 criteria without cheating
12. social_proof: precise, credible, non-round numbers
13. press_mentions: SAME RULE as press_logos (see rule 28). Empty [] by default.
    Only mention globally recognized publications that genuinely covered the brand
    (DTC brand with > 5,000 reviews, OR the publication's name is explicitly in the description). 0 to 3 entries max. Prefer [] over hallucinating.
14. Témoignages : 3 prénoms cohérents avec la langue cible, détails concrets (pas générique), émotion vraie
15. founder_note : prénom+nom de fondateur cohérent culture cible, message personnel et authentique (3-4 phrases)
16. value_stack : produit + 3 bonus listés, total > prix final, économie chiffrée mise en avant
17. Garantie : rassure sans inventer (satisfait ou remboursé classique)
18. risk_reversal : 3 réassurances pratiques (livraison, retour, support) avec icônes emoji
19. 3 bonus à valeur perçue (guides, accessoires digitaux, support, accès communauté…)
20. objections : 5 objections d'achat ÉMOTIONNELLES (pas factuelles type FAQ) avec réponse qui désamorce
21. community_callout : invite à suivre sur réseaux (Instagram/TikTok), titre engageant
22. FAQ : 5 VRAIES objections factuelles (livraison, garantie, compatibilité, durabilité, comment ça marche)
23. final_pitch : paragraphe de fermeture émotionnel qui résume la transformation et incite à l'action MAINTENANT
24. CTA : verbe d'action + bénéfice immédiat
25. Urgence : ${priceLine}
${USE_V2_PROMPT ? `26. photo_descriptions : 3 à 6 descriptions UGC (genre apparent + âge + contexte + lumière). Couvre au moins 1 "before", 1 "during", 1 "after". Prénoms cohérents avec ${langName}.
27. payment_methods : beauty/wellness → inclure "klarna" ou "alma". Tech premium → "apple_pay" en priorité. Défaut minimum : ["visa","mastercard","paypal","apple_pay"].
28. press_logos : cf. règle 28 du system prompt — ZÉRO TOLÉRANCE, retourne [] par défaut. N'ajoute QUE si DTC > 5 000 avis + dans la whitelist, OU si le nom exact de la publication est dans la description. Max 3 entrées. En cas de doute → [].
29. stock_signal : évalue l'urgence appropriée (limited_stock / high_demand / back_in_stock / limited_time). Si aucun signal plausible → retourne null avec type: null.
30. bundle_offer : beauty/wellness/pet/mode/déco → propose 1 bundle sensé (2-3 produits complémentaires). Standalone ou sans complémentaire évident → retourne null.` : ''}
${policyBlock}

CRITIQUE : Remplis TOUS les champs du schema JSON, même si tu dois inventer du contenu plausible — sauf exclusion explicite par la consigne de ciblage produit ci-dessus, si présente, auquel cas tu omets ou laisses vide la section exclue. Les champs vides cassent le rendu de la landing sur les sections attendues.

RAPPEL CRITIQUE DE LANGUE : headline, subtitle, target_audience, features, unique_mechanism, how_it_works, comparison et social_proof DOIVENT être rédigés en ${langName}, sans AUCUNE exception, y compris les tout premiers mots générés. Ne bascule JAMAIS vers le français pour ces champs si ${langName} n'est pas le français.

Renvoie UNIQUEMENT le JSON, rien d'autre.`
}

// ─── Appel API ──────────────────────────────────────────────────────────────

interface DeepSeekResponse {
  choices: { message: { content: string } }[]
  usage: {
    prompt_tokens: number
    completion_tokens: number
    total_tokens: number
    prompt_cache_hit_tokens?: number
    prompt_cache_miss_tokens?: number
  }
}

// ─── Versioning prompt ──────────────────────────────────────────────────────
// KONVERT_PROMPT_VERSION=v1 → ancien schema sans champs CRO enrichis.
// Non défini ou =v2 → schema v2 (défaut).
export const PROMPT_VERSION = 'v2.2-brand-based-reviews-gate-2026-06-14'
const USE_V2_PROMPT = (process.env.KONVERT_PROMPT_VERSION ?? 'v2') !== 'v1'

export const GENERATION_MODEL = 'deepseek-chat'

export async function generateLandingPage(
  product: ScrapedProduct,
  options: { language?: string; tone?: string } = {}
): Promise<LandingPageData> {
  const apiKey = process.env.DEEPSEEK_API_KEY
  if (!apiKey) {
    throw new Error('DEEPSEEK_API_KEY manquante dans les variables d\'environnement')
  }

  const language = options.language || 'fr'
  const tone = options.tone || 'persuasif'
  const priceLine = product.original_price
    ? 'utilise le prix barré comme ancrage et mentionne l\'économie réalisée'
    : 'évoque un stock limité ou une fin de promotion proche, sans mentir'

  // Adaptive sections — socle de sections par type de produit détecté (cf
  // section-policy.ts). Aucune nouvelle détection : on réutilise detectProductType,
  // déjà utilisé pour le style/tone auto-pick. Injecté dans buildUserPrompt
  // uniquement (jamais buildSystemPrompt, qui doit rester statique pour le cache).
  const detectedProductType = detectProductType({ title: product.title, description: product.description })
  const priceNum = product.price ? parseFloat(product.price) : undefined
  const sectionPolicy: PromptSectionPolicy = {
    productType: detectedProductType,
    ...getSectionPolicy({
      productType: detectedProductType,
      price: Number.isFinite(priceNum) ? priceNum : undefined,
    }),
  }

  // Retry 1x sur 429 / 5xx — DeepSeek peut être flaky en pic
  // Timeout 50s (au-dessous de Vercel maxDuration 60s) pour laisser une marge
  const callDeepSeek = async (): Promise<Response> => {
    return fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: GENERATION_MODEL,
        // 8000 tokens car le schema enrichi (19 sections chantier A + bonus)
        // peut dépasser 4000 tokens en sortie sur les produits complexes.
        max_tokens: 8000,
        // Mode JSON natif — DeepSeek garantit un JSON parsable et évite le markdown.
        response_format: { type: 'json_object' },
        messages: [
          { role: 'system', content: buildSystemPrompt(language) },
          { role: 'user', content: buildUserPrompt(product, tone, priceLine, language, sectionPolicy) },
        ],
      }),
      signal: AbortSignal.timeout(50000),
    })
  }

  // Mini-call dédié au nettoyage + traduction du nom produit, lancé en
  // parallèle de l'appel principal → zéro latence ajoutée (le mini-call
  // est ~10x plus rapide que l'appel principal, donc résolu avant le main).
  // Évite que le titre AliExpress brut ("HXAO hauts courts sans manche petit
  // haut tank top femme bralette sport yoga fitness coton respirant") se
  // retrouve tel quel comme product_name dans la landing rendue.
  const cleanNamePromise = cleanProductName(product.title, language, apiKey)
    .catch(() => ({
      name: sanitizeTitleFallback(product.title),
      category: '',
      product_type: null as null,
    }))

  // Un appel DeepSeek complet : fetch (avec son propre retry 429/5xx) + parse.
  // Isolé pour pouvoir être rejoué tel quel par le filet anti-drift-langue
  // ci-dessous (Bug C — cf commentaire buildSystemPrompt).
  const generateOnce = async (): Promise<LandingPageData> => {
    let res = await callDeepSeek()
    if (!res.ok && (res.status === 429 || res.status >= 500)) {
      // Backoff 800ms puis retry une seule fois
      await new Promise(r => setTimeout(r, 800))
      res = await callDeepSeek()
    }

    if (!res.ok) {
      const errText = await res.text().catch(() => '')
      throw new Error(`DeepSeek ${res.status} : ${errText.slice(0, 200)}`)
    }

    const json = await res.json() as DeepSeekResponse
    const raw = json.choices[0]?.message?.content ?? ''

    // Nettoyage défensif au cas où le LLM ajouterait quand même un ```json
    const cleaned = raw
      .replace(/^```json\s*/i, '')
      .replace(/^```\s*/i, '')
      .replace(/```\s*$/i, '')
      .trim()

    try {
      return JSON.parse(cleaned) as LandingPageData
    } catch {
      throw new Error('JSON invalide reçu de DeepSeek — réessaie')
    }
  }

  let data = await generateOnce()

  // ─── Filet anti-drift-langue (Bug C) ───────────────────────────────────
  // Neutraliser le prompt (schema JSON + règles 0-13 + rappel explicite,
  // cf buildSystemPrompt/buildUserPrompt) réduit le drift FR de 100% → 25%
  // mesuré sur ~30 runs réels (langue arabe, produit TV) mais ne l'élimine
  // pas — DeepSeek "décide" parfois tôt dans la génération de rester en
  // français malgré la consigne, de façon stochastique. On détecte le drift
  // sur headline+subtitle (premiers champs générés, les plus touchés) et on
  // relance UNE fois l'appel complet si besoin. Cap à 1 retry : la génération
  // prend ~20s et le scrape ~50s sous maxDuration 90s — pas de marge pour plus.
  // Si le retry échoue aussi → on accepte quand même la sortie (ne jamais
  // bloquer l'utilisateur) mais on logue un warning + Sentry pour visibilité
  // prod (tag phase: 'lang_drift').
  const MAX_LANG_DRIFT_RETRIES = 1
  let langDriftRetries = 0
  while (
    langDriftRetries < MAX_LANG_DRIFT_RETRIES &&
    detectLangDrift(`${data.headline ?? ''} ${data.subtitle ?? ''}`, language)
  ) {
    langDriftRetries++
    console.warn(`[generateLandingPage] drift langue détecté (${language}) — retry ${langDriftRetries}/${MAX_LANG_DRIFT_RETRIES}`)
    data = await generateOnce()
  }
  if (detectLangDrift(`${data.headline ?? ''} ${data.subtitle ?? ''}`, language)) {
    console.warn(`[generateLandingPage] drift langue toujours présent après ${langDriftRetries} retry(s) (${language}) — sortie acceptée quand même`)
    // try/catch : le monitoring ne doit jamais faire échouer une génération
    // réussie (hors runtime Next, captureMessage peut être absent).
    try {
      const Sentry = await import('@sentry/nextjs').catch(() => null)
      Sentry?.captureMessage?.('Drift langue persistant après retries', {
        level: 'warning',
        tags: { phase: 'lang_drift' },
        extra: { language, retriesUsed: langDriftRetries, productTitle: product.title },
      })
    } catch { /* monitoring best-effort */ }
  }

  // Forcer le nom produit depuis le mini-call dédié : version propre (sans
  // stuffing AliExpress), traduite dans la langue cible, et ancrée sur le
  // titre brut (garde-fou anti-dérive sémantique côté product-name.ts).
  // Le clean name override la sortie du LLM principal qui peut dériver, et
  // garantit qu'on ne ré-injecte pas non plus le titre brut tel quel.
  const cleanResult = await cleanNamePromise
  if (cleanResult.name) data.product_name = cleanResult.name
  if (cleanResult.category) data.category = cleanResult.category
  if (cleanResult.product_type) data.product_type = cleanResult.product_type

  // Prix : on garde les valeurs scrapées (chiffres, pas de problème de langue
  // ni de dérive). Le LLM peut occasionnellement les inventer.
  if (product.price) data.price = product.price
  if (product.original_price) data.original_price = product.original_price

  if (product.images?.length > 0) {
    data.images = product.images
  }

  // ─── Gate v2.2 : reviews_count < 5000 → press_logos/mentions = [] ───────
  // Défense en profondeur côté code : même si DeepSeek ignore la règle 28
  // brand-based ("DTC > 5000 avis"), on stripe systématiquement les
  // publications presse pour les boutiques no-name / dropshipping AliExpress.
  // Whitelist seule (sanitizeLandingPageData) laisse passer Vogue/Marie Claire
  // sans connaître la notoriété de la marque — ce gate la connaît.
  // Threshold 5000 aligné sur la règle prompt v2.1 (cf. PROMPT_VERSION).
  const SMALL_BRAND_THRESHOLD = 5000
  if (
    product.reviews_count != null &&
    product.reviews_count < SMALL_BRAND_THRESHOLD
  ) {
    data.press_logos = []
    data.press_mentions = []
  }

  data.language = language

  // Adaptive sections — garde-fou serveur : strip les sections discouraged
  // réellement présentes, indépendamment de ce que DeepSeek a produit.
  stripDiscouragedSections(data, sectionPolicy)

  return sanitizeLandingPageData(data)
}
