import type { ProductType } from './index'

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
