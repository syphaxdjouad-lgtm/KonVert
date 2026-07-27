// Store Builder — harness d'éval golden set (spec MINATO §7.4, checklist de ship).
//
// ⚠️ NON EXÉCUTÉ dans cet environnement de dev (pas de réseau/DEEPSEEK_API_KEY
// disponible ici). À lancer par le founder avec une vraie clé DeepSeek :
//
//   DEEPSEEK_API_KEY=sk-... npx tsx scripts/eval-store-builder.ts
//
// Lit eval/golden-set/store-builder-product-template.json (5 cas, 3 verticals),
// génère le contenu Store Builder pour chacun, puis applique les critères
// bloquants §7.2 + non-bloquants §7.3 de la spec. Affiche un résumé pass/fail
// et le détail de chaque flag — ne modifie rien, ne pousse rien.

import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import {
  generateStoreBuilderContent,
  detectSuspiciousClaims,
  buildStoreBuilderOutputSchema,
  type Vertical,
} from '../src/lib/store-builder'
import type { ScrapedProduct } from '../src/types'
import type { MerchantFacts } from '../src/lib/store-builder/merchant-facts'

interface GoldenCase {
  id: string
  notes_annotateur: string
  input: {
    vertical: Vertical
    product: ScrapedProduct
    merchant_facts?: MerchantFacts
  }
}

interface GoldenSetFile {
  cases: GoldenCase[]
}

const GOLDEN_SET_PATH = join(__dirname, '../eval/golden-set/store-builder-product-template.json')
const LATENCY_P95_TARGET_MS = 20_000

async function main() {
  if (!process.env.DEEPSEEK_API_KEY) {
    console.error('❌ DEEPSEEK_API_KEY manquante — impossible de lancer l\'éval golden set.')
    process.exit(1)
  }

  const raw = readFileSync(GOLDEN_SET_PATH, 'utf-8')
  const { cases } = JSON.parse(raw) as GoldenSetFile

  const latencies: number[] = []
  let criticalFlagCount = 0
  let schemaFailCount = 0

  for (const testCase of cases) {
    const { vertical, product, merchant_facts: merchantFacts } = testCase.input
    console.log(`\n─── ${testCase.id} (${vertical}) ───`)
    console.log(`   ${testCase.notes_annotateur}`)

    const start = Date.now()
    const { output, usedFallback, usage } = await generateStoreBuilderContent(product, vertical, merchantFacts)
    const durationMs = Date.now() - start
    latencies.push(durationMs)

    console.log(`   latence: ${durationMs}ms | fallback: ${usedFallback} | tokens: ${JSON.stringify(usage)}`)

    const schema = buildStoreBuilderOutputSchema(vertical)
    const schemaResult = schema.safeParse(output)
    if (!schemaResult.success) {
      schemaFailCount++
      console.error('   ❌ ÉCHEC schéma Zod:', schemaResult.error.flatten())
    } else {
      console.log('   ✅ schéma Zod valide')
    }

    const flags = detectSuspiciousClaims(output, product.description, merchantFacts)
    const critical = flags.filter((f) => f.severity === 'critical')
    criticalFlagCount += critical.length
    if (critical.length > 0) {
      console.error(`   ❌ ${critical.length} flag(s) critique(s):`)
      for (const flag of critical) {
        console.error(`      - [${flag.pattern}] ${flag.field}: "${flag.excerpt}"`)
      }
    } else {
      console.log('   ✅ aucun flag critique')
    }
  }

  const sorted = [...latencies].sort((a, b) => a - b)
  const p95Index = Math.min(sorted.length - 1, Math.ceil(sorted.length * 0.95) - 1)
  const p95 = sorted[p95Index] ?? 0

  console.log('\n═══ Résumé ═══')
  console.log(`Cas testés       : ${cases.length}`)
  console.log(`Échecs schéma    : ${schemaFailCount}`)
  console.log(`Flags critiques  : ${criticalFlagCount}`)
  console.log(`Latence p95      : ${p95}ms (cible < ${LATENCY_P95_TARGET_MS}ms)`)

  const ship = schemaFailCount === 0 && criticalFlagCount === 0 && p95 < LATENCY_P95_TARGET_MS
  console.log(`\nDécision de ship : ${ship ? '✅ GO' : '❌ NO-GO — voir détails ci-dessus'}`)
  process.exit(ship ? 0 : 1)
}

main().catch((err) => {
  console.error('Erreur fatale eval-store-builder:', err)
  process.exit(1)
})
