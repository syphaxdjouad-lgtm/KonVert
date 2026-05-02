// Génération de landing pages via DeepSeek (deepseek-chat).
// L'API DeepSeek est compatible OpenAI ; on utilise fetch direct, pas de SDK
// nécessaire. Le prompt caching est automatique côté serveur DeepSeek (~80%
// de réduction sur les tokens cachés au 2e appel dans la fenêtre).
//
// Le dossier reste nommé "anthropic/" pour ne pas casser les imports — la
// migration est transparente pour les appelants (route /api/generate, etc.).

import type { ScrapedProduct, LandingPageData } from '@/types'

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

const ALLOWED_LANGS = new Set(['fr', 'en', 'es', 'de', 'it', 'pt', 'nl', 'ar'])

function clampRating(n: unknown): number {
  const v = typeof n === 'number' ? n : Number(n)
  if (!Number.isFinite(v)) return 5
  return Math.min(5, Math.max(1, Math.round(v * 10) / 10))
}

function sanitizeLandingPageData(d: LandingPageData): LandingPageData {
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
    price:          d.price ? escapeHtml(d.price) : d.price,
    original_price: d.original_price ? escapeHtml(d.original_price) : d.original_price,
    images:         (d.images ?? []).filter(safeImageUrl),
    language:       lang,
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

  return out
}

// ─── Prompts ────────────────────────────────────────────────────────────────

const LANGUAGE_NAMES: Record<string, string> = {
  fr: 'français',
  en: 'English',
  es: 'español',
  de: 'Deutsch',
  it: 'italiano',
  pt: 'português',
  nl: 'Nederlands',
  ar: 'العربية',
}

const TONE_INSTRUCTIONS: Record<string, string> = {
  persuasif: 'Ton persuasif : crée de l\'émotion, joue sur les désirs et la peur de manquer, pousse à l\'action immédiate.',
  premium: 'Ton premium et luxueux : langage élégant, valorise l\'exclusivité et la qualité supérieure, prix justifié par l\'excellence.',
  fun: 'Ton fun et décalé : léger, plein d\'énergie, utilise des formules originales, rend le produit désirable et cool.',
  informatif: 'Ton informatif et rassurant : pédagogue, faits concrets, chiffres précis, répond aux objections avec des preuves.',
}

// System prompt + schéma JSON sont 100% statiques pour une langue donnée
// → DeepSeek les met en cache automatiquement côté serveur (TTL ~heures).
// Au 2e appel, ~80% des tokens d'input sont facturés à 10% du prix.
const buildSystemPrompt = (language: string): string => {
  const langName = LANGUAGE_NAMES[language] || 'français'
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

Tu réponds avec ce JSON exact (sans markdown, sans commentaire) :
{
  "headline": "string — accroche principale, max 12 mots, image mentale forte",
  "subtitle": "string — développe la promesse, max 20 mots",
  "story": {
    "problem": "string — situation douloureuse vécue par le client (1-2 phrases)",
    "agitation": "string — amplifie la frustration, ce qui se passe si rien ne change (1-2 phrases)",
    "solution": "string — comment le produit résout le problème, mécanisme (2-3 phrases)",
    "transformation": "string — la nouvelle réalité du client après usage (1-2 phrases)"
  },
  "benefits": [
    "string — bénéfice 1 (verbe d'action, transformation, max 15 mots)",
    "string", "string", "string", "string"
  ],
  "social_proof": {
    "customers": "string — ex: '12 847 clients satisfaits' (chiffre réaliste, pas rond)",
    "rating": "string — ex: '4.8/5 sur 2 341 avis vérifiés'",
    "sold": "string — ex: '3 200+ commandes ce mois-ci'"
  },
  "testimonials": [
    { "name": "Prénom + initiale", "rating": 5, "text": "2-3 phrases, détail concret, émotion vraie", "variant": "variante choisie si pertinent" },
    { "name": "string", "rating": 5, "text": "string", "variant": "string" },
    { "name": "string", "rating": 4, "text": "string", "variant": "string" }
  ],
  "comparison": {
    "without_title": "ex: 'Sans [produit]'",
    "without": ["frustration 1", "frustration 2", "frustration 3", "frustration 4"],
    "with_title": "ex: 'Avec [produit]'",
    "with": ["bénéfice 1", "bénéfice 2", "bénéfice 3", "bénéfice 4"]
  },
  "guarantee": {
    "title": "ex: 'Satisfait ou remboursé'",
    "description": "explication courte (1-2 phrases)",
    "duration": "ex: '30 jours'"
  },
  "bonuses": [
    { "title": "bonus 1", "description": "courte description", "value": "ex: '29€'" },
    { "title": "string", "description": "string", "value": "string" },
    { "title": "string", "description": "string", "value": "string" }
  ],
  "faq": [
    { "question": "string", "answer": "réponse rassurante, 2-3 phrases max" },
    { "question": "string", "answer": "string" },
    { "question": "string", "answer": "string" },
    { "question": "string", "answer": "string" },
    { "question": "string", "answer": "string" }
  ],
  "cta": "verbe d'action + bénéfice, max 8 mots",
  "urgency": "urgence authentique courte, max 12 mots",
  "product_name": "nom commercial court du produit"
}`
}

const buildUserPrompt = (product: ScrapedProduct, tone: string, priceLine: string): string => {
  const toneInstruction = TONE_INSTRUCTIONS[tone] || TONE_INSTRUCTIONS['persuasif']
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
1. Le headline doit créer une IMAGE MENTALE FORTE et toucher un désir profond, pas décrire le produit
2. Le storytelling (story) suit PAS : problème vécu → agitation émotionnelle → solution avec mécanisme → transformation
3. Les 5 bénéfices : verbe d'action, orientés résultat/transformation, 15 mots max
4. Social proof : chiffres précis et crédibles (jamais ronds : 12 847 plutôt que 12 000)
5. Témoignages : 3 prénoms cohérents avec la langue cible, détails concrets (pas générique), émotion vraie, lien avec une variante si pertinent
6. Comparaison "Avec / Sans" : 4 points symétriques, bénéfices concrets vs frustrations réelles
7. Garantie : rassure sans inventer (satisfait ou remboursé classique)
8. 3 bonus à valeur perçue (guides, accessoires digitaux, support, accès communauté…)
9. FAQ : VRAIES objections d'achat (livraison, garantie, compatibilité, durabilité, comment ça marche)
10. CTA : verbe d'action + bénéfice immédiat
11. Urgence : ${priceLine}

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

  const res = await fetch('https://api.deepseek.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: GENERATION_MODEL,
      max_tokens: 4000,
      // Mode JSON natif — DeepSeek garantit un JSON parsable et évite le markdown.
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: buildSystemPrompt(language) },
        { role: 'user', content: buildUserPrompt(product, tone, priceLine) },
      ],
    }),
  })

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

  // Forcer prix depuis les données scrapées (le LLM peut dériver)
  if (product.price) data.price = product.price
  if (product.original_price) data.original_price = product.original_price

  if (product.images?.length > 0) {
    data.images = product.images
  }

  data.language = language

  return sanitizeLandingPageData(data)
}
