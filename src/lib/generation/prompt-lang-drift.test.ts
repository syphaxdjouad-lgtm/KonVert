import { describe, it, expect } from 'vitest'
import { buildSystemPrompt, buildUserPrompt } from './generate'
import type { ScrapedProduct } from '@/types'

// Bug C — repro locale (harness jetable, hors repo) : sur langue non-FR
// (arabe testé), les champs headline→social_proof revenaient massivement en
// français malgré la consigne explicite, à cause d'exemples de COPY
// littéraux en français codés en dur dans le schema JSON du system prompt.
//
// Isolation A/B, mesurée sur le VRAI code (pas des répliques en mémoire —
// celles-ci se sont révélées peu fiables sur petit échantillon) :
//   baseline (rien touché)                              : 100% drift précoce
//   schema JSON neutralisé seul                          :  73% drift
//   schema + règles 0-13 traduites en anglais             :  51% drift
//   schema + règles + rappel langue explicite en fin de   :  25% drift
//     prompt (combinaison retenue, shippée ici)
// Aucune combinaison de prompt engineering seul n'atteint ~0% — DeepSeek
// garde un résidu de drift stochastique sur génération créative longue en
// arabe. Le filet de sécurité (retry automatique sur détection de drift,
// cf lang-drift.ts + generateLandingPage) complète ce fix pour viser <10%
// en sortie finale.
//
// Ces tests verrouillent : (1) le schema ne contient plus les exemples de
// copy FR fautifs, (2) les règles 0-13 sont bien en anglais (neutralisées),
// (3) le rappel de langue explicite est présent, (4) rien n'est cassé
// structurellement (clés JSON, interpolation produit).

describe('buildSystemPrompt — schema JSON neutralisé (fix Bug C)', () => {
  const FORBIDDEN_SCHEMA_EXAMPLES = [
    "ex: 'Les actives 30-45 ans'",
    "ex: 'Sans [produit]'",
    "ex: 'Avec [produit]'",
    "Prix\", \"Ingrédients naturels", // ancien tableau criteria FR en dur
    '"Notre produit"',
    "Marque pharmacie",
    "Marque luxe",
    "ex: '12 847 clients satisfaits'",
    "ex: '4.8/5 sur 2 341 avis vérifiés'",
    "ex: 'Made in France', 'Cruelty-free', 'Livraison 48h', 'Cosmos Organic'",
    "ex: 'Peau terne, fatiguée, ridules visibles dès 6h'",
    "ex: 'Satisfait ou remboursé'",
    "ex: 'Rejoignez 12 000+ membres sur Instagram'",
  ]

  it('ne contient plus aucun exemple de copy FR en dur (headline→social_proof et au-delà)', () => {
    const prompt = buildSystemPrompt('ar')
    for (const forbidden of FORBIDDEN_SCHEMA_EXAMPLES) {
      expect(prompt, `résidu fautif trouvé dans le schema : "${forbidden}"`).not.toContain(forbidden)
    }
  })

  it('conserve la consigne explicite de langue cible', () => {
    const prompt = buildSystemPrompt('ar')
    expect(prompt).toContain('Tu génères TOUT le contenu textuel en')
    expect(prompt).toContain('العربية')
  })

  it('conserve tous les champs structurels du schema (rien cassé côté clés JSON)', () => {
    const prompt = buildSystemPrompt('ar')
    for (const key of [
      '"headline"', '"subtitle"', '"target_audience"', '"features"',
      '"unique_mechanism"', '"how_it_works"', '"comparison"', '"competitor_comparison"',
      '"social_proof"', '"testimonials"', '"guarantee"', '"objections"',
      '"faq"', '"final_pitch"',
    ]) {
      expect(prompt, `clé manquante : ${key}`).toContain(key)
    }
  })

  it('regression FR : le prompt reste généré sans erreur pour la langue par défaut', () => {
    expect(() => buildSystemPrompt('fr')).not.toThrow()
    expect(buildSystemPrompt('fr')).toContain('en français')
  })
})

describe('buildUserPrompt — règles 0-13 neutralisées (EN) + rappel langue explicite', () => {
  const PRODUCT: ScrapedProduct = {
    title: 'Xiaomi Smart TV 55 pouces 4K UHD',
    description: 'Téléviseur intelligent 55 pouces, résolution 4K UHD, HDR10+, son Dolby Audio.',
    images: [],
    price: '349',
    original_price: '449',
    variants: [],
    rating: 4.6,
    reviews_count: 3120,
    source_url: 'https://example.com/tv',
  }

  it('règles 0-13 traduites en anglais (neutralisation confirmée par harness A/B)', () => {
    const prompt = buildUserPrompt(PRODUCT, 'persuasif', 'stock limité', 'ar')
    expect(prompt).toContain('PRODUCT ANCHOR — ABSOLUTE RULE')
    expect(prompt).toContain('competitor_comparison: 5 criteria + us + 2 GENERIC competitors')
    // Les anciens exemples de copy FR (règle 11) ont disparu avec la traduction
    expect(prompt).not.toContain('Marque pharmacie')
  })

  it('rappel de langue explicite présent en fin de prompt, avec la langue cible interpolée', () => {
    const prompt = buildUserPrompt(PRODUCT, 'persuasif', 'stock limité', 'ar')
    expect(prompt).toContain('RAPPEL CRITIQUE DE LANGUE')
    expect(prompt).toContain('headline, subtitle, target_audience, features, unique_mechanism, how_it_works, comparison et social_proof')
    expect(prompt).toContain('العربية')
  })

  it('ne throw jamais et reste correctement interpolé avec les données produit', () => {
    const prompt = buildUserPrompt(PRODUCT, 'persuasif', 'stock limité', 'ar')
    expect(prompt).toContain('Xiaomi Smart TV 55 pouces 4K UHD')
    expect(prompt).toContain('349€')
  })

  it('regression FR : rappel de langue cohérent pour la langue par défaut', () => {
    const prompt = buildUserPrompt(PRODUCT, 'persuasif', 'stock limité', 'fr')
    expect(prompt).toContain('RAPPEL CRITIQUE DE LANGUE')
    expect(prompt).toContain('en français')
  })
})
