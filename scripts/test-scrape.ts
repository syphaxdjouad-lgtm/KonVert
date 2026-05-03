/**
 * Smoke test du scraper KONVERT
 *
 * Usage :
 *   npx tsx scripts/test-scrape.ts "https://www.aliexpress.com/item/123.html"
 *   npx tsx scripts/test-scrape.ts "https://www.amazon.fr/dp/B0XXXXXXXX"
 *
 * Affiche : méthode utilisée (Firecrawl/fetch+JSON-LD/meta), erreurs détaillées,
 * et le produit nettoyé prêt pour la génération.
 */

import { config } from 'dotenv'
import { resolve } from 'path'

config({ path: resolve(process.cwd(), '.env.local') })

import { scrapeProduct, cleanProduct, looksHallucinated, ScrapeError } from '../src/lib/scraper'

async function main() {
  const url = process.argv[2]
  if (!url) {
    console.error('Usage: npx tsx scripts/test-scrape.ts <url>')
    process.exit(1)
  }

  console.log(`\n🔍 Test scraping : ${url}\n`)
  console.log(`FIRECRAWL_API_KEY : ${process.env.FIRECRAWL_API_KEY ? '✓ présent' : '✗ ABSENT'}\n`)

  const t0 = Date.now()
  try {
    const raw = await scrapeProduct(url)
    const product = cleanProduct(raw)
    const dur = ((Date.now() - t0) / 1000).toFixed(1)

    console.log(`\n✅ Scraping réussi en ${dur}s\n`)
    console.log(`Titre        : ${product.title}`)
    console.log(`Description  : ${product.description.slice(0, 120)}...`)
    console.log(`Prix         : ${product.price ?? '∅'}`)
    console.log(`Prix barré   : ${product.original_price ?? '∅'}`)
    console.log(`Images       : ${product.images.length} (${product.images.slice(0, 2).join(', ')}...)`)
    console.log(`Note         : ${product.rating ?? '∅'} (${product.reviews_count ?? 0} avis)`)

    const halluc = looksHallucinated(product)
    if (halluc.fake) {
      console.log(`\n⚠️  Données suspectes : ${halluc.reason}`)
    } else {
      console.log(`\n✓ Données validées (pas d'hallucination détectée)`)
    }
  } catch (err) {
    const dur = ((Date.now() - t0) / 1000).toFixed(1)
    console.error(`\n❌ Échec scraping en ${dur}s\n`)
    if (err instanceof ScrapeError) {
      console.error(`Erreur globale : ${err.message}`)
      console.error(`Détail        :`)
      Object.entries(err.detail).forEach(([k, v]) => console.error(`  - ${k}: ${v}`))
    } else {
      console.error(err)
    }
    process.exit(1)
  }
}

main()
