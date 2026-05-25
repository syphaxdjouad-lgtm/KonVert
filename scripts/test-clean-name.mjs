// Test live du mini-call DeepSeek qui nettoie les titres AliExpress.
// Usage : node scripts/test-clean-name.mjs
//
// Lance 6 cases représentatives (stuffing AliExpress, ALL CAPS, multilingue,
// dérive sémantique, traduction FR/EN/ES) et imprime input/output + latence.
// Pas un test automatisé — vérification manuelle de la qualité de sortie.

import { config } from 'dotenv'
import { cleanProductName } from '../src/lib/anthropic/product-name.ts'

config({ path: '.env.local' })

const apiKey = process.env.DEEPSEEK_API_KEY
if (!apiKey) {
  console.error('DEEPSEEK_API_KEY manquante dans .env.local')
  process.exit(1)
}

const cases = [
  {
    label: 'Bralette AliExpress (FR)',
    raw: 'HXAO hauts courts sans manche petit haut tank top femme bralette sport YOGA fitness coton respirant',
    language: 'fr',
  },
  {
    label: 'Blender ALL CAPS (FR)',
    raw: 'BLENDER MIXEUR PROFESSIONNEL 1500W ACIER INOX SMOOTHIE JUICE HOT SALE FREE SHIPPING',
    language: 'fr',
  },
  {
    label: 'Serum skincare (EN)',
    raw: 'KSEO sérum vitamine C anti-âge éclat peau visage soin hydratant skincare beauty face cream wrinkle anti-aging',
    language: 'en',
  },
  {
    label: 'Montre stuffing (ES)',
    raw: 'YUNKE Reloj Hombre Deportivo Impermeable Luxury Watch Men Sport Waterproof Quartz 2024 Hot Sale',
    language: 'es',
  },
  {
    label: 'Titre déjà propre (FR)',
    raw: 'Corset bustier dos nu',
    language: 'fr',
  },
  {
    label: 'Multilingue mélangé (FR)',
    raw: '不锈钢 Stainless Steel Water Bottle 500ml Sport Gym Fitness Eco-friendly BPA Free',
    language: 'fr',
  },
]

console.log('\n=== Test clean product names ===\n')

for (const c of cases) {
  const start = Date.now()
  try {
    const result = await cleanProductName(c.raw, c.language, apiKey)
    const ms = Date.now() - start
    console.log(`[${c.label}] ${ms}ms`)
    console.log(`  IN  : ${c.raw}`)
    console.log(`  OUT : name="${result.name}" | category="${result.category}" | product_type=${result.product_type}`)
    console.log()
  } catch (err) {
    console.error(`[${c.label}] ERREUR :`, err.message)
  }
}
