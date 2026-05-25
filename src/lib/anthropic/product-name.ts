import type { ProductType } from '@/lib/templates'

// Nettoyage et traduction du nom produit avant génération de la landing.
//
// Les titres scrapés (surtout AliExpress) sont du SEO stuffing dégueulasse :
// "HXAO hauts courts sans manche petit haut tank top femme bralette sport yoga
// fitness coton respirant". Si on laisse passer ça comme product_name, le
// rendu de la landing est immonde et la cohérence template/produit foire
// (cf bug "Velvety = skincare mais produit = vêtement").
//
// Stratégie en 2 couches :
// 1. Mini-call DeepSeek dédié au titre : reformule en nom commercial court
//    + traduit dans la langue cible. Coût ~$0.0001, latence ~500-800ms.
//    Lancé en parallèle de l'appel principal donc 0 impact perçu.
// 2. Fallback déterministe si le mini-call échoue (timeout, 429, JSON cassé) :
//    nettoyage regex-based pour au moins retirer le pire du stuffing.
//
// La version finale du product_name override la sortie du LLM principal
// (qui peut dériver) pour garantir cohérence + propreté + bonne langue.
//
// Le `category` renvoyé sert aussi à valider le matching template :
// si on détecte "Mode·Vêtements" mais que le template choisi est "Velvety
// (Skincare)", on peut warn l'utilisateur (cf screenshot du bug).
const LANGUAGE_NAMES: Record<string, string> = {
  fr: 'français',
  en: 'English',
  es: 'español',
  de: 'Deutsch',
  it: 'italiano',
  pt: 'português',
  nl: 'Nederlands',
  ar: 'العربية',
  zh: '中文',
}

// Mots-clés stuffés ultra-fréquents dans les titres AliExpress, en plusieurs
// langues. La liste est volontairement courte : on ne veut pas un nettoyage
// trop agressif qui supprime des mots essentiels du produit. Le vrai cleanup
// vient du LLM ; ce fallback ne fait que limiter les dégâts.
const STUFFING_PATTERNS = [
  /\b(hot\s*sale|new\s*arrival|drop\s*shipping|free\s*shipping|fast\s*shipping)\b/gi,
  /\b(high\s*quality|top\s*quality|premium\s*quality)\b/gi,
  /\b(unisex|men|women|female|male|lady|ladies|gentlemen)\s+(men|women|female|male|lady|ladies)\b/gi,
  /\b(2023|2024|2025|2026)\b/g,
  /\b(wholesale|retail|oem|odm)\b/gi,
  /\s*\|\s*.*$/, // tout ce qui suit un pipe (souvent du keyword stuffing pur)
]

export interface CleanedProductName {
  name: string
  category: string
  product_type: ProductType | null
}

const VALID_PRODUCT_TYPES: ProductType[] = [
  'skincare', 'beauty', 'wellness', 'tech', 'jewelry',
  'home', 'fashion', 'pet', 'luxury', 'universal',
]

// Fallback déterministe — appelé uniquement si le mini-call LLM échoue.
// Garde l'intégrité du produit (on ne devine pas, on nettoie juste).
export function sanitizeTitleFallback(rawTitle: string | null | undefined): string {
  if (!rawTitle || typeof rawTitle !== 'string') return 'Produit'

  let s = rawTitle.trim()

  // Retire les patterns de stuffing les plus courants
  for (const pattern of STUFFING_PATTERNS) {
    s = s.replace(pattern, ' ')
  }

  // Collapse whitespace + retire ponctuation excessive
  s = s
    .replace(/\s+/g, ' ')
    .replace(/[,;]\s*[,;]+/g, ',')
    .replace(/^\W+|\W+$/g, '')
    .trim()

  // Si tout est en CAPS (ALL CAPS = typique AliExpress) → Title Case
  // On ne touche pas aux acronymes de marque (≤ 4 lettres) en début.
  if (s === s.toUpperCase() && s.length > 8) {
    s = s
      .toLowerCase()
      .replace(/(?:^|\s)(\S)/g, (_, c) => ' ' + c.toUpperCase())
      .trim()
  }

  // Coupe à 60 chars en respectant les mots (pas de césure en plein milieu)
  if (s.length > 60) {
    s = s.slice(0, 60)
    const lastSpace = s.lastIndexOf(' ')
    if (lastSpace > 30) s = s.slice(0, lastSpace)
    s = s.trim()
  }

  return s || 'Produit'
}

// Mini-call DeepSeek dédié au product_name. ~250 input tokens, ~40 output.
// Coût négligeable, latence courte. Toujours lancé en parallèle de l'appel
// principal pour ne pas alourdir le temps de réponse perçu.
export async function cleanProductName(
  rawTitle: string,
  language: string,
  apiKey: string
): Promise<CleanedProductName> {
  if (!rawTitle || rawTitle.trim().length < 3) {
    return { name: sanitizeTitleFallback(rawTitle), category: '', product_type: null }
  }

  const langName = LANGUAGE_NAMES[language] || 'français'

  // Prompt système 100% statique → DeepSeek le met en cache automatiquement.
  const systemPrompt = `Tu es un expert e-commerce qui nettoie et reformule les titres produits scrapés (AliExpress, Amazon, Shopify…) en noms commerciaux courts et clairs.

Tu reçois un titre brut souvent pollué par :
- du keyword stuffing SEO (ex: "tank top femme bralette sport yoga fitness coton respirant")
- des codes marques obscures (ex: "HXAO", "YUNKE", "KUEGOU")
- du multilingue mélangé (anglais + chinois translittéré + français)
- de la mise en majuscules abusive

Tu produis :
1. "name" : un NOM COMMERCIAL court, 3 à 7 mots maximum, qui décrit clairement la NATURE RÉELLE du produit. Tu peux garder le code marque si court (≤4 lettres) et placé en suffixe. Pas de keyword stuffing, pas de listes, pas de tirets/pipes/séparateurs.
2. "category" : 1 à 3 mots décrivant la CATÉGORIE produit générique (ex: "Lingerie", "Soin visage", "Cuisine", "Outils jardin", "Bijoux", "Mode femme", "Tech audio").
3. "product_type" : tu choisis EXACTEMENT UNE valeur dans cette liste fermée — c'est le type de template recommandé :
   - "skincare" : sérums, crèmes visage, soins peau, anti-âge, masques
   - "beauty" : maquillage, rouge à lèvres, parfum, soin cheveux
   - "wellness" : compléments alimentaires, vitamines, protéines, sport/fitness
   - "tech" : électronique, gadgets, audio, smartphones, accessoires high-tech
   - "jewelry" : bijoux, colliers, bracelets, bagues, montres bijou
   - "home" : meubles, déco, cuisine, ustensiles, linge de maison
   - "fashion" : vêtements, chaussures, sacs, lingerie, accessoires mode
   - "pet" : produits pour animaux de compagnie
   - "luxury" : produits luxe haut de gamme (uniquement si nature luxe explicite)
   - "universal" : si vraiment hors de ces catégories ou indéterminé

RÈGLE ABSOLUE : tu ne CHANGES PAS la nature du produit. Si l'input parle d'un soutien-gorge, l'output décrit un soutien-gorge — pas un t-shirt, pas un parfum. Si tu doutes de ce qu'est l'objet, garde les mots-clés les plus spécifiques du titre original.

IMPORTANT : "name" et "category" doivent être rédigés en ${langName}. Si le titre brut est dans une autre langue, tu traduis vers ${langName}. "product_type" est TOUJOURS en anglais (c'est un enum technique).

Tu réponds UNIQUEMENT avec ce JSON (sans markdown, sans commentaire) :
{ "name": "string", "category": "string", "product_type": "string" }`

  const userPrompt = `Titre brut à nettoyer :
"""
${rawTitle.slice(0, 500)}
"""

Langue cible : ${langName}

Reformule en nom commercial propre + catégorie générique.`

  try {
    const res = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        max_tokens: 120,
        temperature: 0.3, // bas pour rester ancré au titre brut
        response_format: { type: 'json_object' },
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
      }),
      // 8s suffit largement pour un mini-call. Si DeepSeek met plus, fallback.
      signal: AbortSignal.timeout(8000),
    })

    if (!res.ok) {
      return { name: sanitizeTitleFallback(rawTitle), category: '', product_type: null }
    }

    const json = await res.json() as { choices?: { message?: { content?: string } }[] }
    const raw = json.choices?.[0]?.message?.content ?? ''
    const cleaned = raw
      .replace(/^```json\s*/i, '')
      .replace(/^```\s*/i, '')
      .replace(/```\s*$/i, '')
      .trim()

    const parsed = JSON.parse(cleaned) as {
      name?: unknown
      category?: unknown
      product_type?: unknown
    }
    const name = typeof parsed.name === 'string' ? parsed.name.trim() : ''
    const category = typeof parsed.category === 'string' ? parsed.category.trim() : ''

    // product_type doit appartenir à l'enum fermé ProductType. Si le LLM
    // sort autre chose ("clothing", "vetement", "FASHION"), on tente une
    // normalisation puis fallback null si vraiment inconnu (= pas de warning).
    const rawType = typeof parsed.product_type === 'string'
      ? parsed.product_type.trim().toLowerCase()
      : ''
    const product_type: ProductType | null = VALID_PRODUCT_TYPES.includes(rawType as ProductType)
      ? (rawType as ProductType)
      : null

    // Garde-fou anti-dérive : si le LLM a sorti un nom complètement déconnecté
    // du titre (aucun mot-clé en commun ≥ 4 chars), on préfère le fallback.
    if (!name || name.length < 2 || !hasMinimalOverlap(rawTitle, name)) {
      return { name: sanitizeTitleFallback(rawTitle), category, product_type }
    }

    // Coupe défensive — le LLM peut occasionnellement dépasser
    const safeName = name.length > 80 ? name.slice(0, 80).trim() : name

    return { name: safeName, category, product_type }
  } catch {
    return { name: sanitizeTitleFallback(rawTitle), category: '', product_type: null }
  }
}

// Vérifie qu'au moins un mot significatif (≥ 4 chars, hors stop words triviaux)
// du titre brut se retrouve dans le nom propre. Évite la dérive sémantique
// (LLM qui sort "Sérum visage" depuis un titre "Blender mixeur 1500W").
// Désactive le check si le titre est trop court (< 8 chars) car overlap impossible.
function hasMinimalOverlap(rawTitle: string, cleanName: string): boolean {
  if (rawTitle.length < 8) return true

  const normalize = (s: string) =>
    s
      .toLowerCase()
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '') // retire accents
      .replace(/[^a-z0-9\s]/g, ' ')
      .split(/\s+/)
      .filter(w => w.length >= 4)

  const rawTokens = new Set(normalize(rawTitle))
  const cleanTokens = normalize(cleanName)

  // Tolère un overlap léger : 1 token significatif partagé suffit.
  // Le LLM est libre de reformuler tant qu'il reste ancré sur AU MOINS un
  // mot-clé du produit réel.
  return cleanTokens.some(t => rawTokens.has(t))
}
