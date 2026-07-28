import type { ProductType } from './index'
import { TEMPLATES } from './index'

// Mots-clés FR/EN par type. Volontairement simple : pas un classifier ML, juste
// un matching keyword. Si rien ne match → retourne null (= on ne fait pas de
// recommandation, l'user choisit librement).

const KEYWORDS: Record<Exclude<ProductType, 'universal'>, string[]> = {
  skincare: [
    'serum', 'sérum', 'cream', 'crème', 'creme', 'lotion', 'moisturizer', 'hydratant',
    'cleanser', 'nettoyant', 'toner', 'tonique', 'mask', 'masque', 'exfoliant',
    'soin', 'skincare', 'face care', 'anti-age', 'anti-aging', 'wrinkle', 'rides',
    'acne', 'acné', 'sunscreen', 'spf', 'retinol', 'rétinol', 'hyaluronic', 'hyaluronique',
    'collagen', 'collagène', 'peptide', 'niacinamide',
  ],
  beauty: [
    'lipstick', 'rouge à lèvres', 'mascara', 'eyeliner', 'foundation', 'fond de teint',
    'blush', 'highlighter', 'palette', 'eyeshadow', 'fard', 'powder', 'poudre',
    'makeup', 'maquillage', 'shampoo', 'shampoing', 'conditioner', 'après-shampoing',
    'hair', 'cheveux', 'parfum', 'perfume', 'fragrance', 'eau de toilette',
    'nail polish', 'vernis', 'manicure',
  ],
  wellness: [
    'supplement', 'supplément', 'vitamin', 'vitamine', 'mineral', 'minéraux',
    'probiotic', 'probiotique', 'collagen powder', 'protein', 'protéine',
    'magnesium', 'magnésium', 'omega', 'oméga', 'turmeric', 'curcuma',
    'ashwagandha', 'spirulina', 'spiruline', 'multivitamin', 'capsule', 'gélule',
    'tablet', 'comprimé', 'powder mix', 'energy drink', 'pre-workout',
    'wellness', 'bien-être', 'nutrition', 'detox', 'sleep aid', 'sommeil',
  ],
  tech: [
    'phone', 'smartphone', 'iphone', 'samsung', 'tablet', 'ipad', 'laptop',
    'ordinateur', 'écran', 'screen', 'monitor', 'keyboard', 'clavier',
    'mouse', 'souris', 'headphone', 'écouteur', 'casque audio', 'earbud',
    'bluetooth', 'wireless', 'sans fil', 'speaker', 'enceinte',
    'charger', 'chargeur', 'cable', 'câble', 'adapter', 'adaptateur',
    'usb-c', 'lightning', 'thunderbolt',
    'smartwatch', 'montre connectée', 'gps watch',
    'camera', 'caméra', 'webcam', 'drone',
    'powerbank', 'batterie externe', 'gadget', 'electronic', 'électronique',
    'gaming', 'console', 'controller', 'manette',
  ],
  jewelry: [
    'necklace', 'collier', 'bracelet', 'ring', 'bague', 'anneau',
    'earring', 'boucle d\'oreille', 'pendant', 'pendentif',
    'jewelry', 'jewellery', 'bijou', 'bijoux', 'gold', 'or 18k', 'silver',
    'argent 925', 'platinum', 'platine', 'diamond', 'diamant',
    'gemstone', 'pierre précieuse', 'sapphire', 'saphir', 'ruby', 'rubis',
    'emerald', 'émeraude', 'pearl', 'perle',
  ],
  home: [
    'sofa', 'canapé', 'chair', 'chaise', 'table', 'desk', 'bureau',
    'bed', 'lit', 'mattress', 'matelas', 'pillow', 'oreiller', 'cushion', 'coussin',
    'lamp', 'lampe', 'light fixture', 'luminaire', 'rug', 'tapis', 'carpet',
    'curtain', 'rideau', 'vase', 'frame', 'cadre', 'mirror', 'miroir',
    'decoration', 'décoration', 'home decor', 'wall art', 'art mural',
    'kitchenware', 'ustensile', 'cookware', 'casserole', 'pan', 'poêle',
    'plate', 'assiette', 'mug', 'tasse', 'glass', 'verre',
    'storage', 'rangement', 'shelf', 'étagère', 'cabinet', 'armoire',
    'ceramic', 'céramique', 'pottery', 'poterie', 'wooden', 'en bois',
  ],
  fashion: [
    't-shirt', 'tshirt', 'shirt', 'chemise', 'blouse',
    'dress', 'robe', 'skirt', 'jupe', 'pants', 'pantalon', 'jeans',
    'shorts', 'sweater', 'pull', 'hoodie', 'sweat',
    'jacket', 'veste', 'coat', 'manteau', 'blazer',
    'shoes', 'chaussures', 'sneakers', 'baskets', 'boots', 'bottes',
    'heels', 'talons', 'sandal', 'sandale',
    'bag', 'sac', 'handbag', 'sac à main', 'backpack', 'sac à dos',
    'wallet', 'portefeuille', 'belt', 'ceinture',
    'sunglasses', 'lunettes de soleil', 'hat', 'chapeau', 'cap', 'casquette',
    'scarf', 'écharpe', 'foulard', 'glove', 'gant',
    'fashion', 'mode', 'streetwear', 'apparel', 'vêtement', 'clothing',
    'lingerie', 'underwear', 'sous-vêtement', 'sock', 'chaussette',
  ],
  pet: [
    'dog', 'chien', 'puppy', 'chiot', 'cat', 'chat', 'kitten', 'chaton',
    'pet', 'animal de compagnie', 'leash', 'laisse', 'collar', 'collier chien',
    'pet food', 'croquette', 'kibble', 'pet bed', 'panier chien',
    'cat litter', 'litière', 'aquarium', 'fish tank',
    'bird cage', 'cage oiseau', 'hamster', 'rabbit', 'lapin',
    'pet toy', 'jouet chien', 'pet grooming', 'toilettage',
  ],
  luxury: [
    'luxury', 'luxe', 'haute couture', 'designer', 'limited edition',
    'édition limitée', 'premium', 'haut de gamme', 'exclusive', 'exclusif',
    'artisan', 'handcrafted', 'fait main', 'high-end',
  ],
}

export function detectProductType(input: {
  title?: string | null
  description?: string | null
}): ProductType | null {
  const haystack = `${input.title || ''} ${input.description || ''}`.toLowerCase()
  if (haystack.trim().length < 4) return null

  // Score chaque type par nombre de matches
  const scores: Partial<Record<ProductType, number>> = {}
  for (const [type, keywords] of Object.entries(KEYWORDS) as [ProductType, string[]][]) {
    let score = 0
    for (const kw of keywords) {
      // Match en mot entier sur les mots courts (3-5 chars) pour éviter "or" dans
      // "for", "more", etc. Sinon substring match.
      if (kw.length <= 5) {
        const re = new RegExp(`(^|[^\\p{L}])${escapeRegex(kw)}([^\\p{L}]|$)`, 'iu')
        if (re.test(haystack)) score++
      } else if (haystack.includes(kw)) {
        score++
      }
    }
    if (score > 0) scores[type] = score
  }

  const entries = Object.entries(scores) as [ProductType, number][]
  if (entries.length === 0) return null

  // Retourne le type avec le score max. Égalité → ordre du dict (skincare > beauty > wellness > tech...).
  entries.sort((a, b) => b[1] - a[1])
  return entries[0][0]
}

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

// ─── Suggestion de template pour le wizard (liste curée à 11 — Phase 2) ───
//
// Distincte de detectProductType()/ProductType ci-dessus (qui restent
// inchangés, utilisés ailleurs pour le check de mismatch template/produit).
// Ajoute 2 buckets locaux ('sport', 'organic') absents de ProductType, pour
// que etec-energy et etec-natural soient effectivement suggérés — sans quoi
// ils retomberaient tous les deux sur 'wellness'/'home'.
const SUGGESTION_EXTRA_KEYWORDS: Record<'sport' | 'organic', string[]> = {
  sport: [
    'fitness', 'musculation', 'muscu', 'entrainement', 'entraînement', 'training',
    'workout', 'running', 'course a pied', 'course à pied', 'yoga', 'gym',
    'salle de sport', 'sport', 'crossfit', 'exercice', 'exercise',
    'resistance band', 'bande de résistance', 'haltere', 'haltère', 'dumbbell',
    'protein shaker', 'shaker', 'jump rope', 'corde a sauter', 'corde à sauter',
  ],
  organic: [
    'bio', 'biologique', 'organic', 'naturel', 'natural', 'vegan', 'végane',
    'cruelty-free', 'zero dechet', 'zéro déchet', 'zero waste', 'argile',
    'clay', 'sauge', 'sage', 'eco-responsable', 'éco-responsable', 'ecologique',
    'écologique', 'sustainable', 'durable', 'compostable', 'biodegradable',
    'biodégradable', 'plante', 'plant-based',
  ],
}

// Template curé (parmi les 11 de la liste STYLES du wizard) associé à chaque
// type détecté. 'universal' (ou aucun match) → etec-solo, le passe-partout
// dont l'accent s'adapte au produit (cf suggestTemplateForProduct + etec-solo.ts).
export const SUGGESTED_TEMPLATE_BY_TYPE: Record<string, string> = {
  sport: 'etec-energy',
  organic: 'etec-natural',
  tech: 'etec-pulse',
  skincare: 'etec-velvety',
  beauty: 'etec-blusho',
  wellness: 'etec-prime',
  fashion: 'etec-style',
  jewelry: 'etec-gold',
  luxury: 'etec-gold',
  home: 'etec-casa',
  pet: 'etec-pet',
  universal: 'etec-solo',
}

export interface TemplateSuggestion {
  /** Clé gagnante du mapping (un ProductType existant, ou 'sport'/'organic'). */
  type: string
  templateId: string
  /** Accent du template registre — sert notamment à coloriser etec-solo. */
  accent: string | null
}

/**
 * Suggère un template parmi les 11 curés du wizard (step 5) + son accent,
 * à partir du titre/description produit. Priorité : 'sport' et 'organic'
 * sont testés AVANT les buckets ProductType standards (wellness/home) pour
 * gagner les égalités de score — cf demande founder (etec-energy / etec-natural
 * doivent pouvoir sortir gagnants sur du contenu fitness/bio).
 * Retourne null si aucun signal exploitable (comme detectProductType).
 */
export function suggestTemplateForProduct(input: {
  title?: string | null
  description?: string | null
}): TemplateSuggestion | null {
  const haystack = `${input.title || ''} ${input.description || ''}`.toLowerCase()
  if (haystack.trim().length < 4) return null

  // Ordre d'insertion = ordre de priorité en cas d'égalité de score (Array.sort
  // est stable) : sport/organic déclarés avant les buckets KEYWORDS standards.
  const buckets: Record<string, string[]> = {
    sport: SUGGESTION_EXTRA_KEYWORDS.sport,
    organic: SUGGESTION_EXTRA_KEYWORDS.organic,
    ...KEYWORDS,
  }

  const scores: Record<string, number> = {}
  for (const [type, keywords] of Object.entries(buckets)) {
    let score = 0
    for (const kw of keywords) {
      if (kw.length <= 5) {
        const re = new RegExp(`(^|[^\\p{L}])${escapeRegex(kw)}([^\\p{L}]|$)`, 'iu')
        if (re.test(haystack)) score++
      } else if (haystack.includes(kw)) {
        score++
      }
    }
    if (score > 0) scores[type] = score
  }

  const entries = Object.entries(scores)
  if (entries.length === 0) return null

  entries.sort((a, b) => b[1] - a[1])
  const winner = entries[0][0]
  const templateId = SUGGESTED_TEMPLATE_BY_TYPE[winner] || 'etec-solo'
  const accent = TEMPLATES.find(t => t.id === templateId)?.accent ?? null
  return { type: winner, templateId, accent }
}
