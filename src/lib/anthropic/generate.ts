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

  if (Array.isArray(d.press_mentions)) {
    out.press_mentions = d.press_mentions.map(escapeHtml).filter(Boolean)
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

  // press_logos
  if (Array.isArray(d.press_logos)) {
    out.press_logos = d.press_logos
      .filter(
        (p): p is NonNullable<(typeof d.press_logos)>[number] =>
          p != null && typeof p.publication === 'string' && p.publication.trim().length > 0,
      )
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
const buildSystemPrompt = (language: string): string => {
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

  const V2_RULES_BLOCK = USE_V2_PROMPT ? `
26. photo_descriptions : 3 à 6 entrées. Décris une scène photo réaliste UGC pour chaque sentiment (before, during, after, lifestyle). Genre + âge apparent + contexte + lumière. Ces descriptions servent de prompts pour générateur d'images ou d'alt-text de placeholders.
27. payment_methods : sélectionne parmi ["visa","mastercard","amex","paypal","apple_pay","google_pay","klarna","alma"]. Beauty/mode → ajoute "klarna" ou "alma". Tech → "apple_pay" en priorité. Si tu ne peux pas inférer la catégorie, retourne ["visa","mastercard","paypal","apple_pay"].
28. press_logos : RÈGLE STRICTE ZÉRO TOLÉRANCE — retourne [] par défaut, TOUJOURS.
    N'ajoute une publication QUE si les DEUX conditions sont réunies :
    (a) la marque est une DTC mondialement établie (> 5 000 avis clients sur le produit)
        ET ressort comme couverte historiquement par cette publication,
    OU (b) le nom exact de la publication apparaît littéralement dans la
        description produit fournie ("As seen in...", "Featured in...").
    La publication DOIT figurer dans cette liste exacte (sinon → []) :
    ["Vogue", "Elle", "Marie Claire", "Allure", "Harper's Bazaar", "Glamour",
     "Cosmopolitan", "Grazia", "Elle Décoration", "Marie Claire Maison", "AD",
     "Côté Maison", "Madame Figaro", "Le Figaro Madame", "Forbes", "TechCrunch",
     "The Verge", "Wired", "Fast Company", "GQ", "Business of Fashion",
     "Refinery29", "Women's Health", "Yoga Journal", "30 Millions d'Amis",
     "Le Monde", "Le Figaro", "Les Echos"].
    INTERDIT ABSOLU pour : tout produit AliExpress, dropshipping no-name,
    boutique < 5 000 avis → press_logos = [] obligatoire.
    En cas de doute minimal → []. Mieux vaut [] qu'halluciner.
    Max 3 entrées si tu en mets.
29. stock_signal : "limited_stock" si produit saisonnier/tendance/édition limitée. "high_demand" si produit viral/bestseller. "back_in_stock" si indisponible puis revenu (utilise si la description le suggère). "limited_time" uniquement si une promotion réelle est mentionnée. null si aucun signal d'urgence plausible. Ne jamais inventer de stock fictif non justifié.
30. bundle_offer : propose 1 bundle logique si la catégorie est beauty/wellness/pet/mode/déco (2-3 produits complémentaires sensés). Retourne null si le produit est standalone et sans complémentaire évident (ex: un casque audio seul, un ustensile unique).` : ''

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
    "string — badge court 1-3 mots (ex: 'Made in France', 'Cruelty-free', 'Livraison 48h', 'Cosmos Organic')",
    "string", "string"
  ],
  "story": {
    "problem": "string — situation douloureuse vécue par le client (1-2 phrases)",
    "agitation": "string — amplifie la frustration, ce qui se passe si rien ne change (1-2 phrases)",
    "solution": "string — comment le produit résout le problème, mécanisme (2-3 phrases)",
    "transformation": "string — la nouvelle réalité du client après usage (1-2 phrases)"
  },
  "target_audience": [
    { "profile": "ex: 'Les actives 30-45 ans'", "pain": "douleur principale en 1 phrase courte" },
    { "profile": "string", "pain": "string" },
    { "profile": "string", "pain": "string" }
  ],
  "features": [
    { "icon": "emoji 1 caractère (ex: '🌿')", "title": "2-3 mots", "description": "1 phrase max 12 mots" },
    { "icon": "string", "title": "string", "description": "string" },
    { "icon": "string", "title": "string", "description": "string" },
    { "icon": "string", "title": "string", "description": "string" },
    { "icon": "string", "title": "string", "description": "string" },
    { "icon": "string", "title": "string", "description": "string" }
  ],
  "unique_mechanism": {
    "name": "string — nom court du mécanisme/technologie (ex: 'Bio-Stim Complex', 'TripleAction Formula')",
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
    { "before": "ex: 'Peau terne, fatiguée, ridules visibles dès 6h'", "after": "ex: 'Peau éclatante, lissée, hydratée toute la journée'" },
    { "before": "string", "after": "string" },
    { "before": "string", "after": "string" }
  ],
  "comparison": {
    "without_title": "ex: 'Sans [produit]'",
    "without": ["frustration 1", "frustration 2", "frustration 3", "frustration 4"],
    "with_title": "ex: 'Avec [produit]'",
    "with": ["bénéfice 1", "bénéfice 2", "bénéfice 3", "bénéfice 4"]
  },
  "competitor_comparison": {
    "criteria": ["Prix", "Ingrédients naturels", "Résultats visibles", "Garantie", "Avis clients"],
    "us": { "name": "Notre produit", "values": ["29€", "100%", "14 jours", "30 jours", "4.8/5"] },
    "them": [
      { "name": "Concurrent A (nom générique : 'Marque pharmacie')", "values": ["49€", "60%", "6 semaines", "14 jours", "3.9/5"] },
      { "name": "Concurrent B (nom générique : 'Marque luxe')", "values": ["89€", "80%", "1 mois", "Aucune", "4.2/5"] }
    ]
  },
  "social_proof": {
    "customers": "string — ex: '12 847 clients satisfaits' (chiffre réaliste, pas rond)",
    "rating": "string — ex: '4.8/5 sur 2 341 avis vérifiés'",
    "sold": "string — ex: '3 200+ commandes ce mois-ci'"
  },
  "press_mentions": [
    "string — nom de média réaliste (ex: 'Vogue', 'Marie Claire', 'Forbes', 'Le Figaro Madame')",
    "string", "string", "string", "string"
  ],
  "testimonials": [
    { "name": "Prénom + initiale", "rating": 5, "text": "2-3 phrases, détail concret, émotion vraie", "variant": "variante choisie si pertinent" },
    { "name": "string", "rating": 5, "text": "string", "variant": "string" },
    { "name": "string", "rating": 4, "text": "string", "variant": "string" }
  ],
  "founder_note": {
    "name": "string — prénom + nom du fondateur (cohérent culture cible)",
    "role": "string — ex: 'Fondatrice & CEO'",
    "message": "3-4 phrases — pourquoi j'ai créé ce produit, mon histoire personnelle, ma promesse au client"
  },
  "value_stack": {
    "items": [
      { "label": "Produit principal", "value": "ex: '79€'" },
      { "label": "Bonus 1", "value": "ex: '29€'" },
      { "label": "Bonus 2", "value": "ex: '19€'" },
      { "label": "Bonus 3", "value": "ex: '15€'" }
    ],
    "total": "ex: '142€'",
    "you_pay": "ex: '49€'",
    "savings": "ex: '93€ d\\'économie aujourd\\'hui'"
  },
  "guarantee": {
    "title": "ex: 'Satisfait ou remboursé'",
    "description": "explication courte (1-2 phrases)",
    "duration": "ex: '30 jours'"
  },
  "risk_reversal": [
    { "icon": "🚚", "title": "Livraison rapide", "description": "ex: 'Expédié sous 24h, livré en 2-4 jours'" },
    { "icon": "↩️", "title": "Retour facile", "description": "ex: 'Retour gratuit pendant 30 jours'" },
    { "icon": "💬", "title": "Support 7/7", "description": "ex: 'Réponse en moins de 2h, par email ou chat'" }
  ],
  "bonuses": [
    { "title": "bonus 1", "description": "courte description", "value": "ex: '29€'" },
    { "title": "string", "description": "string", "value": "string" },
    { "title": "string", "description": "string", "value": "string" }
  ],
  "objections": [
    { "objection": "objection émotionnelle (ex: 'J\\'ai déjà essayé 10 produits sans résultat')", "response": "réponse rassurante 2-3 phrases qui désamorce" },
    { "objection": "string", "response": "string" },
    { "objection": "string", "response": "string" },
    { "objection": "string", "response": "string" },
    { "objection": "string", "response": "string" }
  ],
  "community_callout": {
    "title": "ex: 'Rejoignez 12 000+ membres sur Instagram'",
    "description": "1 phrase qui invite à rejoindre la communauté",
    "cta": "ex: '@marquename' ou 'Suivez-nous'"
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

const buildUserPrompt = (product: ScrapedProduct, tone: string, priceLine: string, language = 'fr'): string => {
  const toneInstruction = TONE_INSTRUCTIONS[tone] || TONE_INSTRUCTIONS['persuasif']
  const langName = LANGUAGE_NAMES[language] || 'français'
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
0. ANCRAGE PRODUIT — RÈGLE ABSOLUE : Tu ne peux PAS inventer une catégorie de produit. Le "product_name" que tu retournes doit décrire EXACTEMENT le produit fourni dans "Nom" ci-dessus (tu peux reformuler/raccourcir, pas changer la nature). Si "Nom" parle d'un blender, ne pas écrire un sérum. Si "Nom" parle d'une montre, ne pas écrire un parfum. TOUS les contenus (story, benefits, testimonials, FAQ, features, mécanisme, comparatif concurrents, objections, fondateur, etc.) doivent rester cohérents avec ce produit réel — interdit d'inventer des ingrédients, des matériaux ou des cas d'usage qui ne correspondent pas au produit.

1. Le headline doit créer une IMAGE MENTALE FORTE et toucher un désir profond, pas décrire le produit
2. hero_badges : 3 badges courts de confiance (origine, certification, livraison) cohérents avec le produit
3. Le storytelling (story) suit PAS : problème vécu → agitation émotionnelle → solution avec mécanisme → transformation
4. target_audience : 3 profils ICP distincts (âge/situation/besoin) avec leur douleur principale
5. Les 5 bénéfices : verbe d'action, orientés résultat/transformation, 15 mots max
6. features : 6 features concrètes avec icône emoji pertinente (matériau, technologie, ergonomie, garantie...)
7. unique_mechanism : nomme la technologie/ingrédient/technique unique qui justifie POURQUOI ça marche, avec une preuve concrète
8. how_it_works : 4 étapes claires (achat → utilisation → résultat) en mots du client
9. before_after : 3 paires concrètes — état douloureux AVANT → état désirable APRÈS
10. comparison : "Avec / Sans" 4 points symétriques, bénéfices concrets vs frustrations réelles
11. competitor_comparison : 5 critères + nous + 2 concurrents GÉNÉRIQUES (pas de vraies marques, type "Marque pharmacie", "Marque luxe", "Marque drugstore") — toujours nous gagnant sur ≥3 critères sans tricher
12. social_proof : chiffres précis et crédibles (jamais ronds : 12 847 plutôt que 12 000)
13. press_mentions : MÊME RÈGLE QUE press_logos (cf. règle 28). Liste vide [] par défaut.
    Ne mentionne que des publications mondialement reconnues qui ont réellement couvert la marque
    (DTC > 5 000 avis OU nom dans la description). 0 à 3 entrées max. Mieux vaut [] qu'halluciner.
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
28. press_logos : ANTI-HALLUCINATION — liste uniquement les publications qui couvrent vraiment la niche du produit. En cas de doute → retourne []. Max 5 entrées. quote_short optionnel, max 80 chars.
29. stock_signal : évalue l'urgence appropriée (limited_stock / high_demand / back_in_stock / limited_time). Si aucun signal plausible → retourne null avec type: null.
30. bundle_offer : beauty/wellness/pet/mode/déco → propose 1 bundle sensé (2-3 produits complémentaires). Standalone ou sans complémentaire évident → retourne null.` : ''}

CRITIQUE : Remplis TOUS les champs du schema JSON, même si tu dois inventer du contenu plausible. Les champs vides cassent le rendu de la landing.

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
export const PROMPT_VERSION = 'v2.1-brand-based-2026-06-11'
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
          { role: 'user', content: buildUserPrompt(product, tone, priceLine, language) },
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

  let data: LandingPageData
  try {
    data = JSON.parse(cleaned) as LandingPageData
  } catch {
    throw new Error('JSON invalide reçu de DeepSeek — réessaie')
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

  data.language = language

  return sanitizeLandingPageData(data)
}
