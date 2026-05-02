// Smoke test : appelle directement generateLandingPage() (code prod)
// avec le mock product. Vérifie que la migration DeepSeek fonctionne.
// Usage : npx tsx scripts/test-generate.ts

import { config } from 'dotenv'
config({ path: '.env.local' })

import { generateLandingPage, GENERATION_MODEL } from '../src/lib/anthropic/generate'
import { MOCK_PRODUCT } from '../src/lib/mock/product'

async function main() {
  console.log(`KONVERT — Smoke test génération`)
  console.log(`Modèle : ${GENERATION_MODEL}`)
  console.log(`Produit : ${MOCK_PRODUCT.title}\n`)

  const start = Date.now()
  const data = await generateLandingPage(MOCK_PRODUCT, { language: 'fr', tone: 'persuasif' })
  const ms = Date.now() - start

  console.log(`✓ Généré en ${ms}ms\n`)
  console.log('headline    :', data.headline)
  console.log('subtitle    :', data.subtitle)
  console.log('cta         :', data.cta)
  console.log('urgency     :', data.urgency)
  console.log('story       :', data.story ? '✓' : '✗')
  console.log('benefits    :', data.benefits?.length, 'items')
  console.log('testimonials:', data.testimonials?.length, 'items')
  console.log('comparison  :', data.comparison ? '✓' : '✗')
  console.log('guarantee   :', data.guarantee ? '✓' : '✗')
  console.log('social_proof:', data.social_proof ? '✓' : '✗')
  console.log('bonuses     :', data.bonuses?.length, 'items')
  console.log('faq         :', data.faq?.length, 'items')
  console.log('language    :', data.language)
  console.log('price       :', data.price)
  console.log('original_pr :', data.original_price)
}

main().catch(err => { console.error('ERREUR:', err); process.exit(1) })
