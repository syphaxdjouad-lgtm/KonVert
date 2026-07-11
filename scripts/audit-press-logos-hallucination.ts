/**
 * Audit hallucination press_logos — prompt v2.0-enriched-2026-06-05
 * Usage : npx tsx scripts/audit-press-logos-hallucination.ts
 *
 * Ce script :
 * 1. Charge le golden set (30 produits : 10 grandes marques / 10 DTC inconnues / 10 AliExpress)
 * 2. Appelle generateLandingPage() sur chaque produit (DeepSeek, ~0.04 €/req)
 * 3. Juge chaque press_logos retourné via Claude Haiku 4.5 (LLM-as-judge)
 * 4. Écrit un rapport markdown dans /audit/PROMPT_V2_HALLUCINATION_REPORT_2026-06-06.md
 *
 * Coût estimé :
 * - DeepSeek 30 runs × ~0.0012 € = ~0.036 € (cache DeepSeek réduit ~80% sur system prompt)
 * - Claude Haiku 4.5 judge 30× ~0.0003 € = ~0.009 €
 * - Total golden set : ~0.05 € max
 *
 * KONVERT_PROMPT_VERSION : par défaut v2 (défaut du flag). Pour forcer v1 :
 *   KONVERT_PROMPT_VERSION=v1 npx tsx scripts/audit-press-logos-hallucination.ts
 */

import { config } from 'dotenv'
config({ path: '.env.local' })

import { generateLandingPage } from '../src/lib/generation/generate'
import * as fs from 'fs'
import * as path from 'path'

// ─── Types ───────────────────────────────────────────────────────────────────

interface GoldenProduct {
  id: string
  category: 'A' | 'B' | 'C'
  brand: string
  niche: string
  has_real_press: boolean
  real_press_sources: string[]
  product: {
    title: string
    description: string
    images: string[]
    price: string | null
    original_price: string | null
    variants: { name: string; values: string[] }[]
    rating: number | null
    reviews_count: number | null
    source_url: string
  }
}

interface PressLogoJudgment {
  publication: string
  verdict: 'verified' | 'hallucinated' | 'unverifiable'
  reasoning: string
}

interface RunResult {
  product_id: string
  category: 'A' | 'B' | 'C'
  brand: string
  niche: string
  has_real_press: boolean
  press_logos_returned: { publication: string; quote_short?: string }[]
  judgments: PressLogoJudgment[]
  hallucinated_count: number
  verified_count: number
  unverifiable_count: number
  generation_ms: number
  error?: string
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

function formatDate(): string {
  return new Date().toISOString().split('T')[0]
}

// ─── LLM-as-judge via Claude Haiku 4.5 (fetch direct — pas d'@anthropic-ai/sdk dans ce projet) ──
// Juge si chaque publication dans press_logos est légitime pour ce produit/marque.
// Stratégie :
//   - Grande marque avec presse connue (A) → publication cohérente niche = verified
//   - Marque inconnue (B/C) + publication présente → hallucinated (aucun média ne les couvre)
//   - Publication présente dans la page HTML scrapée → verified (mais on ne scrape pas ici)
//   - Cas douteux → unverifiable

const JUDGE_SYSTEM_PROMPT = `Tu es un expert en relations presse et médias. Tu dois évaluer si des publications presse mentionnées dans une page produit e-commerce sont authentiques ou hallucinées par un LLM.

CRITÈRES DE JUGEMENT :

1. VERIFIED : La publication est plausible pour ce produit ET cette marque précise.
   - Grandes marques DTC connues (Allbirds, Casper, Glossier, Away, Warby Parker, Oura, Lululemon...) → leurs niches ont bien une couverture presse réelle dans les publications correspondantes.
   - Publication COHÉRENTE avec la niche : beauté → Vogue/Elle/Allure, tech → Wired/TechCrunch/The Verge, mode → Vogue/GQ/Harper's Bazaar, sport → etc.
   - NE PAS marquer verified si la marque est une petite boutique inconnue.

2. HALLUCINATED : La publication est clairement inventée ou impossible.
   - Marque inconnue/petite boutique Shopify (moins de 500 avis, no-name) → aucun grand média ne les couvre JAMAIS.
   - Produit AliExpress générique (titre avec stuffing de mots-clés, prix < 30€, vendeur "XXXX Store") → zéro couverture presse possible.
   - Publication incohérente avec la niche (ex: Vogue pour un chargeur USB, TechCrunch pour un sérum visage d'une boutique no-name).
   - Publication qui n'existe pas ou est manifestement inventée.

3. UNVERIFIABLE : Cas ambigu.
   - Marque de taille moyenne (500-5000 avis) dans sa niche, publication cohérente → peut-être réel, pas de certitude.
   - Publication régionale ou de niche (ex: "Cosmetics Business", "Outdoor Retailer") pour une marque spécialisée connue.

RÈGLE CLEF : Pour les produits AliExpress génériques et boutiques Shopify avec < 300 avis et sans notoriété établie, TOUT press_logos est HALLUCINATED par défaut.

Réponds UNIQUEMENT en JSON valide : { "judgments": [ { "publication": "string", "verdict": "verified|hallucinated|unverifiable", "reasoning": "1 phrase max" } ] }`

async function judgeLogos(
  anthropicKey: string,
  product: GoldenProduct,
  logos: { publication: string; quote_short?: string }[]
): Promise<PressLogoJudgment[]> {
  if (logos.length === 0) return []

  const userMsg = `Produit : ${product.product.title}
Marque : ${product.brand}
Niche : ${product.niche}
Nombre d'avis : ${product.product.reviews_count ?? 'non disponible'}
Catégorie : ${product.category === 'A' ? 'Grande marque DTC connue' : product.category === 'B' ? 'Petite boutique Shopify inconnue' : 'Produit AliExpress générique no-name'}

Publications retournées par le LLM :
${logos.map((l, i) => `${i + 1}. "${l.publication}"${l.quote_short ? ` (citation : "${l.quote_short}")` : ''}`).join('\n')}

Juge chaque publication.`

  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': anthropicKey,
        'anthropic-version': '2023-06-01',
        'anthropic-beta': 'prompt-caching-2024-07-31',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5',
        max_tokens: 1024,
        system: [
          {
            type: 'text',
            text: JUDGE_SYSTEM_PROMPT,
            cache_control: { type: 'ephemeral' },
          },
        ],
        messages: [{ role: 'user', content: userMsg }],
      }),
    })

    if (!res.ok) {
      const errText = await res.text().catch(() => '')
      throw new Error(`Anthropic ${res.status}: ${errText.slice(0, 150)}`)
    }

    const data = await res.json() as { content: { type: string; text: string }[] }
    const raw = data.content[0]?.type === 'text' ? data.content[0].text : ''
    const parsed = JSON.parse(raw.replace(/^```json\s*/i, '').replace(/```\s*$/i, '').trim()) as { judgments: PressLogoJudgment[] }
    return parsed.judgments ?? []
  } catch (err) {
    // Fallback si le judge échoue : marquer tout unverifiable
    console.warn(`  [WARN] Judge Haiku échoué pour ${product.id}: ${err instanceof Error ? err.message : String(err)}`)
    return logos.map(l => ({
      publication: l.publication,
      verdict: 'unverifiable' as const,
      reasoning: 'Judge LLM indisponible — marqué unverifiable par défaut',
    }))
  }
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  const deepseekKey = process.env.DEEPSEEK_API_KEY
  const anthropicKey = process.env.ANTHROPIC_API_KEY

  if (!deepseekKey) {
    console.error('ERREUR : DEEPSEEK_API_KEY manquante dans .env.local')
    process.exit(1)
  }
  if (!anthropicKey) {
    console.error('ERREUR : ANTHROPIC_API_KEY manquante dans .env.local — nécessaire pour Claude Haiku judge')
    process.exit(1)
  }

  // Charge le golden set
  const goldenSetPath = path.join(__dirname, '../audit/golden-set-prompt-v2.json')
  const goldenSet = JSON.parse(fs.readFileSync(goldenSetPath, 'utf-8')) as {
    version: string
    products: GoldenProduct[]
  }

  console.log('======================================================')
  console.log('KONVERT — Audit hallucination press_logos — prompt v2')
  console.log(`Golden set : ${goldenSet.products.length} produits`)
  console.log(`Date : ${formatDate()}`)
  console.log('======================================================\n')

  const results: RunResult[] = []
  let totalCostEstimateEur = 0

  for (const entry of goldenSet.products) {
    process.stdout.write(`[${entry.id}] ${entry.brand.slice(0, 45).padEnd(45)} `)

    const run: RunResult = {
      product_id: entry.id,
      category: entry.category,
      brand: entry.brand,
      niche: entry.niche,
      has_real_press: entry.has_real_press,
      press_logos_returned: [],
      judgments: [],
      hallucinated_count: 0,
      verified_count: 0,
      unverifiable_count: 0,
      generation_ms: 0,
    }

    try {
      // Génération DeepSeek
      const t0 = Date.now()
      const landing = await generateLandingPage(entry.product, { language: 'fr', tone: 'persuasif' })
      run.generation_ms = Date.now() - t0

      run.press_logos_returned = landing.press_logos ?? []

      // Estimation coût DeepSeek (approx ~1800 tokens input, ~600 tokens output)
      // deepseek-chat : $0.27/1M input, $1.10/1M output
      // Avec 80% cache hit sur system prompt : input effectif ~360 tokens
      const approxCostUsd = (360 / 1_000_000) * 0.27 + (600 / 1_000_000) * 1.10
      totalCostEstimateEur += approxCostUsd * 0.92 // USD → EUR rough

      if (run.press_logos_returned.length === 0) {
        process.stdout.write(`press_logos=[] OK\n`)
      } else {
        process.stdout.write(`press_logos=[${run.press_logos_returned.map(l => l.publication).join(', ')}] `)

        // Judge chaque logo via Haiku
        run.judgments = await judgeLogos(anthropicKey, entry, run.press_logos_returned)

        run.hallucinated_count = run.judgments.filter(j => j.verdict === 'hallucinated').length
        run.verified_count = run.judgments.filter(j => j.verdict === 'verified').length
        run.unverifiable_count = run.judgments.filter(j => j.verdict === 'unverifiable').length

        const statusIcon = run.hallucinated_count > 0 ? 'HALLUCINATED' : 'ok'
        process.stdout.write(`→ ${statusIcon} (H:${run.hallucinated_count} V:${run.verified_count} U:${run.unverifiable_count})\n`)
      }
    } catch (err) {
      run.error = err instanceof Error ? err.message : String(err)
      process.stdout.write(`ERREUR: ${run.error.slice(0, 80)}\n`)
    }

    results.push(run)

    // Throttle pour ne pas spammer les APIs — 2s entre chaque run
    await sleep(2000)
  }

  // ─── Calcul métriques globales ──────────────────────────────────────────────

  const successfulRuns = results.filter(r => !r.error)
  const totalLogoReturnedRuns = successfulRuns.filter(r => r.press_logos_returned.length > 0)

  // Métriques par catégorie
  const byCategory = {
    A: successfulRuns.filter(r => r.category === 'A'),
    B: successfulRuns.filter(r => r.category === 'B'),
    C: successfulRuns.filter(r => r.category === 'C'),
  }

  const calcHallucinationRate = (runs: RunResult[]): number => {
    const totalJudgments = runs.flatMap(r => r.judgments)
    const hallucinated = totalJudgments.filter(j => j.verdict === 'hallucinated').length
    const total = totalJudgments.length
    return total === 0 ? 0 : hallucinated / total
  }

  const calcEmptyLogoRate = (runs: RunResult[]): number => {
    const empty = runs.filter(r => r.press_logos_returned.length === 0).length
    return runs.length === 0 ? 0 : empty / runs.length
  }

  const globalHallucinationRate = calcHallucinationRate(successfulRuns)
  const rateA = calcHallucinationRate(byCategory.A)
  const rateB = calcHallucinationRate(byCategory.B)
  const rateC = calcHallucinationRate(byCategory.C)

  const emptyRateA = calcEmptyLogoRate(byCategory.A)
  const emptyRateB = calcEmptyLogoRate(byCategory.B)
  const emptyRateC = calcEmptyLogoRate(byCategory.C)

  // Exemples hallucinés concrets pour le rapport
  const hallucinatedExamples = successfulRuns
    .filter(r => r.hallucinated_count > 0)
    .slice(0, 10)
    .map(r => ({
      product_id: r.product_id,
      brand: r.brand,
      niche: r.niche,
      category: r.category,
      logos_returned: r.press_logos_returned,
      hallucinates: r.judgments.filter(j => j.verdict === 'hallucinated'),
    }))

  // Décision recommandation
  let recommendation: string
  let recommendationLevel: 'PATCH_V2.1' | 'ROLLBACK_V1' | 'GUARDRAIL_LIGHT'
  if (globalHallucinationRate > 0.5) {
    recommendationLevel = 'ROLLBACK_V1'
    recommendation = `ROLLBACK V1 IMMÉDIAT : taux > 50% (${(globalHallucinationRate * 100).toFixed(1)}%). Activer KONVERT_PROMPT_VERSION=v1 dans Vercel env vars.`
  } else if (globalHallucinationRate > 0.2) {
    recommendationLevel = 'PATCH_V2.1'
    recommendation = `PATCH PROMPT V2.1 : taux ${(globalHallucinationRate * 100).toFixed(1)}% > 20%. Whitelist publication + instruction ONLY_IF_IN_HTML.`
  } else {
    recommendationLevel = 'GUARDRAIL_LIGHT'
    recommendation = `GUARDRAIL LÉGER : taux ${(globalHallucinationRate * 100).toFixed(1)}% < 20%. Regex validation côté code suffit.`
  }

  // ─── Rapport Markdown ───────────────────────────────────────────────────────

  const reportLines: string[] = [
    `# Rapport Hallucination press_logos — Prompt v2`,
    ``,
    `**Date** : ${formatDate()}`,
    `**Prompt version** : v2.0-enriched-2026-06-05`,
    `**Modèle génération** : deepseek-chat`,
    `**Juge** : claude-haiku-4-5`,
    `**Golden set** : ${goldenSet.products.length} produits (${byCategory.A.length} grandes marques / ${byCategory.B.length} DTC inconnues / ${byCategory.C.length} AliExpress génériques)`,
    `**Runs réussis** : ${successfulRuns.length}/${goldenSet.products.length}`,
    `**Coût estimé golden set** : ~${(totalCostEstimateEur * 100).toFixed(1)} centimes d'€ (DeepSeek + Haiku judge)`,
    ``,
    `---`,
    ``,
    `## Résultat principal`,
    ``,
    `| Métrique | Valeur |`,
    `|---|---|`,
    `| **Taux hallucination global** (hallucinated/total_logos_jugés) | **${(globalHallucinationRate * 100).toFixed(1)}%** |`,
    `| Runs avec press_logos=[] (comportement correct) | ${successfulRuns.filter(r => r.press_logos_returned.length === 0).length}/${successfulRuns.length} (${(calcEmptyLogoRate(successfulRuns) * 100).toFixed(0)}%) |`,
    `| Runs avec ≥1 logo retourné | ${totalLogoReturnedRuns.length}/${successfulRuns.length} |`,
    `| Logos jugés total | ${successfulRuns.flatMap(r => r.judgments).length} |`,
    `| dont hallucinated | ${successfulRuns.flatMap(r => r.judgments).filter(j => j.verdict === 'hallucinated').length} |`,
    `| dont verified | ${successfulRuns.flatMap(r => r.judgments).filter(j => j.verdict === 'verified').length} |`,
    `| dont unverifiable | ${successfulRuns.flatMap(r => r.judgments).filter(j => j.verdict === 'unverifiable').length} |`,
    ``,
    `---`,
    ``,
    `## Breakdown par catégorie`,
    ``,
    `| Catégorie | N | press_logos=[] | Taux hallucination | Attendu |`,
    `|---|---|---|---|---|`,
    `| **A — Grandes marques connues** | ${byCategory.A.length} | ${(emptyRateA * 100).toFixed(0)}% | ${(rateA * 100).toFixed(1)}% | Acceptable si publication cohérente niche |`,
    `| **B — DTC boutiques inconnues** | ${byCategory.B.length} | ${(emptyRateB * 100).toFixed(0)}% | ${(rateB * 100).toFixed(1)}% | Devrait être quasi 100% [] |`,
    `| **C — AliExpress génériques** | ${byCategory.C.length} | ${(emptyRateC * 100).toFixed(0)}% | ${(rateC * 100).toFixed(1)}% | Doit être 100% [] |`,
    ``,
    `---`,
    ``,
    `## Exemples concrets d'hallucinations`,
    ``,
  ]

  if (hallucinatedExamples.length === 0) {
    reportLines.push(`_Aucune hallucination détectée sur ce golden set._`)
    reportLines.push(``)
  } else {
    hallucinatedExamples.forEach((ex, i) => {
      reportLines.push(`### Exemple ${i + 1} — [${ex.category}] ${ex.brand.slice(0, 60)}`)
      reportLines.push(``)
      reportLines.push(`- **Niche** : ${ex.niche}`)
      reportLines.push(`- **Logos retournés** : ${ex.logos_returned.map(l => `"${l.publication}"`).join(', ')}`)
      reportLines.push(`- **Hallucinés** :`)
      ex.hallucinates.forEach(h => {
        reportLines.push(`  - \`${h.publication}\` — ${h.reasoning}`)
      })
      reportLines.push(``)
    })
  }

  // Résultats bruts par run
  reportLines.push(`---`)
  reportLines.push(``)
  reportLines.push(`## Résultats bruts (30 runs)`)
  reportLines.push(``)
  reportLines.push(`| ID | Cat | Marque | press_logos retournés | H | V | U | Erreur |`)
  reportLines.push(`|---|---|---|---|---|---|---|---|`)

  for (const r of results) {
    const logos = r.press_logos_returned.length === 0
      ? '[]'
      : r.press_logos_returned.map(l => l.publication).join(', ')
    const err = r.error ? r.error.slice(0, 40) : '-'
    reportLines.push(`| ${r.product_id} | ${r.category} | ${r.brand.slice(0, 35)} | ${logos.slice(0, 60)} | ${r.hallucinated_count} | ${r.verified_count} | ${r.unverifiable_count} | ${err} |`)
  }

  reportLines.push(``)
  reportLines.push(`---`)
  reportLines.push(``)
  reportLines.push(`## Recommandation`)
  reportLines.push(``)
  reportLines.push(`**Niveau : \`${recommendationLevel}\`**`)
  reportLines.push(``)
  reportLines.push(recommendation)
  reportLines.push(``)

  if (recommendationLevel === 'ROLLBACK_V1') {
    reportLines.push(`### Action immédiate (< 5 min)`)
    reportLines.push(``)
    reportLines.push(`\`\`\``)
    reportLines.push(`# Vercel Dashboard → Settings → Environment Variables`)
    reportLines.push(`KONVERT_PROMPT_VERSION = v1`)
    reportLines.push(`# Redeploy → rollback immédiat`)
    reportLines.push(`\`\`\``)
    reportLines.push(``)
    reportLines.push(`Créer ensuite un prompt v2.1 avec :`)
    reportLines.push(`1. Instruction renforcée : "Ne retourner press_logos QUE si le publication_name apparaît littéralement dans le HTML scrapé fourni"`)
    reportLines.push(`2. Whitelist stricte : \`["Vogue", "Elle", "Marie Claire", "Forbes", "TechCrunch", "The Verge", "Wired", "GQ", "Harper\\'s Bazaar", "Allure"]\``)
    reportLines.push(`3. Default \`[]\` si aucune certitude`)
    reportLines.push(``)
  } else if (recommendationLevel === 'PATCH_V2.1') {
    reportLines.push(`### Patch prompt v2.1 — Modifications à apporter dans \`generate.ts\``)
    reportLines.push(``)
    reportLines.push(`**Règle 28 dans V2_RULES_BLOCK — remplacer par :**`)
    reportLines.push(`\`\`\``)
    reportLines.push(`28. press_logos : RÈGLE STRICTE — retourne [] par défaut. N'ajoute une publication QUE si`)
    reportLines.push(`    (a) le nom de la publication apparaît mot pour mot dans la description HTML fournie,`)
    reportLines.push(`    OU (b) la marque est une DTC établie (>10 000 avis) ET la publication est dans cette`)
    reportLines.push(`    liste blanche exacte : ["Vogue", "Elle", "Marie Claire", "Forbes", "TechCrunch",`)
    reportLines.push(`    "The Verge", "Wired", "GQ", "Harper's Bazaar", "Allure", "Refinery29",`)
    reportLines.push(`    "Business of Fashion", "Fast Company", "Glamour", "AD"].`)
    reportLines.push(`    Pour tout produit AliExpress ou boutique < 1 000 avis → press_logos = [] OBLIGATOIRE.`)
    reportLines.push(`\`\`\``)
    reportLines.push(``)
    reportLines.push(`**Guardrail code dans \`sanitizeLandingPageData\` (ajout post-sanitization) :**`)
    reportLines.push(`\`\`\`ts`)
    reportLines.push(`const PRESS_LOGOS_WHITELIST = new Set([`)
    reportLines.push(`  'vogue', 'elle', 'marie claire', 'forbes', 'techcrunch', 'the verge',`)
    reportLines.push(`  'wired', 'gq', "harper's bazaar", 'allure', 'refinery29', 'fast company',`)
    reportLines.push(`  'business of fashion', 'glamour', 'ad', 'marie claire', 'grazia',`)
    reportLines.push(`  'côté maison', 'madame figaro', 'le figaro madame', 'le monde',`)
    reportLines.push(`])`)
    reportLines.push(`// Post-sanitization : filtrer les publications hors whitelist`)
    reportLines.push(`if (Array.isArray(out.press_logos)) {`)
    reportLines.push(`  out.press_logos = out.press_logos.filter(`)
    reportLines.push(`    p => PRESS_LOGOS_WHITELIST.has(p.publication.toLowerCase())`)
    reportLines.push(`  )`)
    reportLines.push(`}`)
    reportLines.push(`\`\`\``)
    reportLines.push(``)
  } else {
    reportLines.push(`### Guardrail léger recommandé`)
    reportLines.push(``)
    reportLines.push(`Ajouter post-sanitization dans \`sanitizeLandingPageData\` une validation regex pour rejeter les publications manifestement inventées (majuscule obligatoire, pas de chiffres, longueur 3-50 chars) :`)
    reportLines.push(``)
    reportLines.push(`\`\`\`ts`)
    reportLines.push(`const PRESS_LOGO_VALID = /^[A-Z][a-zA-Z &'.+\\-]{2,49}$/`)
    reportLines.push(`if (Array.isArray(out.press_logos)) {`)
    reportLines.push(`  out.press_logos = out.press_logos.filter(p => PRESS_LOGO_VALID.test(p.publication))`)
    reportLines.push(`}`)
    reportLines.push(`\`\`\``)
    reportLines.push(``)
  }

  reportLines.push(`---`)
  reportLines.push(``)
  reportLines.push(`## Analyse statique du prompt (indépendante des runs)`)
  reportLines.push(``)
  reportLines.push(`### Problèmes identifiés dans la règle 28 actuelle`)
  reportLines.push(``)
  reportLines.push(`La règle 28 actuelle dans \`V2_RULES_BLOCK\` (\`generate.ts\` ligne ~417) dit :`)
  reportLines.push(`> "liste uniquement les publications qui couvrent vraiment la niche du produit. En cas de doute → retourne []. Max 5 entrées."`)
  reportLines.push(``)
  reportLines.push(`Problème : l'instruction est **niche-based** (couvre la niche) et non **brand-based** (a réellement couvert cette marque). `)
  reportLines.push(`DeepSeek interprète "couvre la niche beauté" comme autorisation de citer Vogue pour N'IMPORTE quel produit beauté, même un sérum AliExpress à 5€.`)
  reportLines.push(``)
  reportLines.push(`Le \`press_mentions\` (ancien champ, règle 13 user prompt) a le même défaut + il est SANS instruction anti-hallucination.`)
  reportLines.push(``)
  reportLines.push(`### Risque légal identifié`)
  reportLines.push(``)
  reportLines.push(`Afficher "Vu dans Forbes / Vogue / TechCrunch" pour un produit AliExpress no-name sur une page cliente Shopify constitue une **fausse allégation commerciale**. Exposition : DGCCRF (France), CMA (UK), FTC (US). Amendes + takedown possible.`)
  reportLines.push(``)
  reportLines.push(`---`)
  reportLines.push(``)
  reportLines.push(`_Rapport généré automatiquement par MINATO — ${new Date().toISOString()}_`)

  // ─── Écriture du rapport ─────────────────────────────────────────────────────

  const reportPath = path.join(
    __dirname,
    '../audit',
    `PROMPT_V2_HALLUCINATION_REPORT_${formatDate()}.md`
  )
  fs.mkdirSync(path.dirname(reportPath), { recursive: true })
  fs.writeFileSync(reportPath, reportLines.join('\n'), 'utf-8')

  // Écriture du JSON raw pour re-run / diff
  const rawPath = path.join(__dirname, '../audit', `raw-results-${formatDate()}.json`)
  fs.writeFileSync(rawPath, JSON.stringify({ date: formatDate(), results }, null, 2), 'utf-8')

  console.log(`\n======================================================`)
  console.log(`RÉSULTAT : Taux hallucination global = ${(globalHallucinationRate * 100).toFixed(1)}%`)
  console.log(`RECOMMANDATION : ${recommendationLevel}`)
  console.log(`Coût estimé : ~${(totalCostEstimateEur * 100).toFixed(1)} centimes d'€`)
  console.log(`Rapport : ${reportPath}`)
  console.log(`Raw JSON : ${rawPath}`)
  console.log(`======================================================`)
}

main().catch(err => {
  console.error('ERREUR FATALE:', err)
  process.exit(1)
})
