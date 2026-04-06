import { anthropic } from '@/lib/anthropic'
import type { ScrapedProduct, LandingPageData } from '@/types'

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

const buildSystemPrompt = (language: string): string => {
  const langName = LANGUAGE_NAMES[language] || 'français'
  return `Tu es un copywriter e-commerce expert en conversion, spécialisé dans la création de landing pages haute performance pour le dropshipping et l'e-commerce.

Ton style :
- Titres percutants qui parlent au désir profond du client, pas aux features
- Bénéfices orientés résultat (ce que ça change dans la vie du client)
- Urgence authentique, jamais artificielle ou mensongère
- Ton direct, humain, sans jargon corporate

IMPORTANT : Tu dois générer TOUT le contenu textuel en ${langName}. Chaque mot du JSON doit être en ${langName}.

Tu réponds UNIQUEMENT avec un JSON valide, sans markdown, sans explication.`
}

const buildUserPrompt = (product: ScrapedProduct, tone: string): string => {
  const toneInstruction = TONE_INSTRUCTIONS[tone] || TONE_INSTRUCTIONS['persuasif']
  return `
Génère une landing page de vente complète pour ce produit e-commerce.

TON DE RÉDACTION : ${toneInstruction}

DONNÉES PRODUIT :
- Nom : ${product.title}
- Description : ${product.description}
- Prix de vente : ${product.price ? `${product.price}€` : 'non défini'}
- Prix original / barré : ${product.original_price ? `${product.original_price}€` : 'non défini'}
- Note clients : ${product.rating ? `${product.rating}/5 (${product.reviews_count?.toLocaleString()} avis)` : 'non disponible'}
- Variantes : ${product.variants.map(v => `${v.name}: ${v.values.join(', ')}`).join(' | ')}

RÈGLES DE GÉNÉRATION :
1. Le headline doit créer une image mentale forte, pas décrire le produit
2. Les 5 bénéfices : commence par le verbe d'action, maximum 15 mots chacun
3. La FAQ : anticipe les vraies objections d'achat (pas de livraison, garantie, compatibilité...)
4. Le CTA : verbe d'action + bénéfice immédiat (ex: "Je commande maintenant — livré en 5j")
5. L'urgence : utilise le prix barré si disponible, sinon stock limité

Réponds avec ce JSON exact (sans markdown) :
{
  "headline": "string — accroche principale, max 12 mots, percutante",
  "subtitle": "string — développe la promesse, max 20 mots",
  "benefits": [
    "string — bénéfice 1",
    "string — bénéfice 2",
    "string — bénéfice 3",
    "string — bénéfice 4",
    "string — bénéfice 5"
  ],
  "faq": [
    { "question": "string", "answer": "string — réponse rassurante, 2-3 phrases max" },
    { "question": "string", "answer": "string" },
    { "question": "string", "answer": "string" },
    { "question": "string", "answer": "string" },
    { "question": "string", "answer": "string" }
  ],
  "cta": "string — texte du bouton principal, max 8 mots",
  "urgency": "string — texte d'urgence court, max 12 mots",
  "product_name": "string — nom commercial court du produit",
  "price": "${product.price || ''}",
  "original_price": "${product.original_price || ''}"
}
`
}

export async function generateLandingPage(
  product: ScrapedProduct,
  options: { language?: string; tone?: string } = {}
): Promise<LandingPageData> {
  const language = options.language || 'fr'
  const tone = options.tone || 'persuasif'

  const message = await anthropic.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 1500,
    system: buildSystemPrompt(language),
    messages: [
      {
        role: 'user',
        content: buildUserPrompt(product, tone),
      },
    ],
  })

  const raw = message.content[0].type === 'text' ? message.content[0].text : ''

  // Nettoyer le JSON si Claude a quand même ajouté du markdown
  const cleaned = raw
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/```\s*$/i, '')
    .trim()

  const data = JSON.parse(cleaned) as LandingPageData

  // Ajouter les images du produit si disponibles
  if (product.images?.length > 0) {
    data.images = product.images
  }

  return data
}
