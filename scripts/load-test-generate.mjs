#!/usr/bin/env node
/**
 * Test de charge `/api/generate/public` — 10 requêtes simultanées.
 *
 * Mesure :
 *   - latence p50 / p95 / max
 *   - taux de succès vs 429 (rate limit) vs 5xx (erreur)
 *   - quota daily check
 *
 * Usage :
 *   node scripts/load-test-generate.mjs                          # konvertpilot.com
 *   BASE_URL=http://localhost:3000 node scripts/load-test-generate.mjs
 *   N=20 node scripts/load-test-generate.mjs                     # 20 reqs au lieu de 10
 *
 * Note : `/api/generate/public` consomme du quota DeepSeek réel — l'endpoint
 * a un rate limit côté Turnstile + IP. À tourner en dehors des heures de
 * trafic pour éviter d'impacter les vrais users.
 */

const BASE_URL = process.env.BASE_URL || 'https://konvertpilot.com'
const N = parseInt(process.env.N || '10', 10)

// Un échantillon d'URLs produit publiques — l'endpoint accepte du scrape réel,
// mais on peut aussi tester avec un payload manuel pour éviter de cramer du
// quota Firecrawl. Ici on bascule en mode manuel via productData.
const PAYLOADS = Array.from({ length: N }).map((_, i) => ({
  email: `loadtest+${Date.now()}-${i}@konvert.test`,
  productData: {
    title: `Produit test ${i}`,
    description: 'Description courte pour test de charge.',
    price: '29,99 €',
    images: [],
    bullets: ['Point 1', 'Point 2', 'Point 3'],
  },
  templateId: 'noir',
  lang: 'fr',
}))

async function runOne(payload, idx) {
  const t0 = performance.now()
  try {
    const res = await fetch(`${BASE_URL}/api/generate/public`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'KONVERT-LoadTest/1.0',
      },
      body: JSON.stringify(payload),
    })
    const elapsed = performance.now() - t0
    let bodyPreview = ''
    try {
      const text = await res.text()
      bodyPreview = text.slice(0, 120)
    } catch {}
    return {
      idx,
      status: res.status,
      ok: res.ok,
      elapsed_ms: Math.round(elapsed),
      body_preview: bodyPreview,
    }
  } catch (err) {
    return {
      idx,
      status: 0,
      ok: false,
      elapsed_ms: Math.round(performance.now() - t0),
      error: err instanceof Error ? err.message : String(err),
    }
  }
}

function percentile(sorted, p) {
  if (sorted.length === 0) return 0
  const i = Math.min(sorted.length - 1, Math.floor((p / 100) * sorted.length))
  return sorted[i]
}

;(async () => {
  console.log(`▶ Load test ${N} reqs concurrent → ${BASE_URL}/api/generate/public\n`)
  const t0 = performance.now()
  const results = await Promise.all(PAYLOADS.map((p, i) => runOne(p, i)))
  const totalElapsed = Math.round(performance.now() - t0)

  const byStatus = results.reduce((acc, r) => {
    acc[r.status] = (acc[r.status] || 0) + 1
    return acc
  }, {})

  const latencies = results.map((r) => r.elapsed_ms).sort((a, b) => a - b)
  const ok = results.filter((r) => r.ok).length
  const rateLimited = byStatus[429] || 0
  const serverErrors = results.filter((r) => r.status >= 500).length

  console.log('─── Résultats ──────────────────────────────────────')
  console.log(`Total wall time     : ${totalElapsed} ms`)
  console.log(`OK (2xx)            : ${ok} / ${N}`)
  console.log(`Rate limited (429)  : ${rateLimited}`)
  console.log(`Server errors (5xx) : ${serverErrors}`)
  console.log(`Par status code     : ${JSON.stringify(byStatus)}`)
  console.log('')
  console.log('Latence (ms)')
  console.log(`  p50 : ${percentile(latencies, 50)}`)
  console.log(`  p95 : ${percentile(latencies, 95)}`)
  console.log(`  max : ${Math.max(...latencies)}`)
  console.log('')
  console.log('─── Détail par requête ─────────────────────────────')
  results.forEach((r) => {
    const marker = r.ok ? '✓' : r.status === 429 ? '⏱' : '✗'
    console.log(
      `${marker} #${String(r.idx).padStart(2, '0')}  status=${r.status}  ${String(r.elapsed_ms).padStart(5)}ms  ${r.body_preview || r.error || ''}`
    )
  })

  console.log('')
  if (serverErrors > 0) {
    console.log('🚨 Des 5xx ont été retournées — investiguer Sentry avant launch.')
    process.exit(1)
  }
  if (ok === 0 && rateLimited > 0) {
    console.log('⚠ Toutes les reqs rate-limitées — vérifier que le rate limit est calibré pour le launch (100+ users simultanés attendus J0).')
  }
  console.log('✓ Test charge terminé sans incident bloquant.')
})()
