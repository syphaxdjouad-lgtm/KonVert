/**
 * Batch outreach pages — génère en masse des previews KONVERT à partir
 * d'une liste d'URLs produit, pour l'outreach "results-first" (on envoie
 * au prospect sa page produit déjà refaite par l'IA).
 *
 * Réutilise le code prod tel quel : scraper cascade (Firecrawl/ScrapingBee/
 * BrightData/fetch) → generateLandingPage (DeepSeek) → templateEtecBlue.
 * Insère directement dans `public_previews` via supabaseAdmin (service_role) —
 * on ne passe PAS par /api/generate/public pour éviter le captcha Turnstile
 * (pensé pour du trafic public non authentifié, pas pour un script interne)
 * et la contrainte "1 preview active par email" (ici on génère un email
 * synthétique unique par ligne, cf `syntheticEmailFor`).
 *
 * Usage :
 *   npx tsx scripts/batch-outreach-pages.ts <input.txt|input.csv> [output.csv]
 *
 *   - input : un fichier texte avec 1 URL produit par ligne (les lignes vides
 *     ou commençant par # sont ignorées). Un simple .csv à une colonne marche
 *     aussi tel quel.
 *   - output (optionnel) : chemin du CSV résultat.
 *     Défaut : scripts/output/batch-outreach-<timestamp>.csv
 *
 * Exemple :
 *   npx tsx scripts/batch-outreach-pages.ts scripts/outreach-urls.example.txt
 *
 * Env vars requises (dans .env.local à la racine du repo) :
 *   - NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY  (insert preview)
 *   - DEEPSEEK_API_KEY                                     (génération copy)
 *   - Au moins un provider scraper : FIRECRAWL_API_KEY,
 *     SCRAPINGBEE_API_KEY, ou BRIGHTDATA_API_TOKEN + BRIGHTDATA_ZONE
 *   - NEXT_PUBLIC_APP_URL (optionnel, défaut https://konvertpilot.com)
 *     utilisée uniquement pour construire l'URL de preview partageable.
 *
 * Throttle : traitement strictement séquentiel (pas de Promise.all) + pause
 * entre chaque ligne. DeepSeek prend ~18-22s/génération et le scraping
 * AliExpress via Bright Data 50-65s — sur un Mac 8 Go de RAM, du parallèle
 * ferait exploser la mémoire (Puppeteer/Firecrawl sont déjà lourds un par un).
 *
 * Chaque ligne est isolée dans son propre try/catch : une URL qui échoue
 * (scraping bloqué, hallucination détectée, DeepSeek down...) est loggée en
 * "error" dans le CSV de sortie et n'interrompt pas le reste du batch.
 */

import { config } from 'dotenv'
import { resolve } from 'path'
import { mkdir, readFile, writeFile } from 'fs/promises'
import { existsSync } from 'fs'

config({ path: resolve(process.cwd(), '.env.local') })

import { scrapeProduct, cleanProduct, looksHallucinated, ScrapeError } from '../src/lib/scraper'
import { generateLandingPage } from '../src/lib/generation/generate'
import { sanitizeDeep } from '../src/lib/security/sanitize'
import { templateEtecBlue } from '../src/lib/templates/etec-blue'
import { getSupabaseAdmin } from '../src/lib/supabase/admin'
import type { ScrapedProduct } from '../src/types'

// Pause entre 2 générations — laisse respirer le Mac (8 Go RAM) entre deux
// runs de scraper/DeepSeek plutôt que d'enchaîner en boucle serrée.
const THROTTLE_MS = 3000

// Preview outreach : conservée 30 jours (vs 7j pour l'offre publique) car le
// cycle de relance commerciale outbound est plus long qu'un lead self-serve.
const PREVIEW_TTL_DAYS = 30

type RowStatus = 'ok' | 'error'

interface ResultRow {
  url_source: string
  titre_produit: string
  url_preview_partageable: string
  statut: RowStatus
  erreur: string
}

function csvEscape(value: string): string {
  if (/[",\n]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`
  }
  return value
}

function toCsv(rows: ResultRow[]): string {
  const header = ['url_source', 'titre_produit', 'url_preview_partageable', 'statut', 'erreur']
  const lines = [header.join(',')]
  for (const r of rows) {
    lines.push(
      [r.url_source, r.titre_produit, r.url_preview_partageable, r.statut, r.erreur]
        .map(csvEscape)
        .join(',')
    )
  }
  return lines.join('\n') + '\n'
}

async function readUrls(inputPath: string): Promise<string[]> {
  const raw = await readFile(inputPath, 'utf-8')
  return raw
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0 && !line.startsWith('#'))
    // Tolère un CSV à une colonne : on prend juste le premier champ.
    .map((line) => line.split(',')[0]?.trim() ?? line)
    .filter((url) => url.length > 0)
}

// Email synthétique unique par ligne — contourne l'index unique partiel
// `public_previews_email_active_uniq` (1 preview active par email) sans
// jamais toucher une vraie adresse prospect à ce stade de l'outreach.
function syntheticEmailFor(url: string, index: number): string {
  const slug = url
    .replace(/^https?:\/\//, '')
    .replace(/[^a-z0-9]+/gi, '-')
    .toLowerCase()
    .slice(0, 40)
  return `outreach+${Date.now()}-${index}-${slug}@konvertpilot.com`
}

function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms))
}

async function processUrl(url: string, index: number): Promise<ResultRow> {
  const base: ResultRow = {
    url_source: url,
    titre_produit: '',
    url_preview_partageable: '',
    statut: 'error',
    erreur: '',
  }

  try {
    const raw: ScrapedProduct = await scrapeProduct(url)
    const product = cleanProduct(raw)

    const hall = looksHallucinated(product)
    if (hall.fake) {
      base.erreur = `Produit rejeté (${hall.reason ?? 'raison inconnue'})`
      return base
    }

    base.titre_produit = product.title

    const rawLandingPageData = await generateLandingPage(product, {
      language: 'fr',
      tone: 'persuasif',
    })
    const landingPageData = sanitizeDeep(rawLandingPageData)
    const html = templateEtecBlue(landingPageData)

    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + PREVIEW_TTL_DAYS)

    const supabaseAdmin = getSupabaseAdmin()
    const { data: preview, error: dbError } = await supabaseAdmin
      .from('public_previews')
      .insert({
        email: syntheticEmailFor(url, index),
        name: null,
        product_title: product.title,
        html_content: html,
        landing_page_data: landingPageData,
        expires_at: expiresAt.toISOString(),
        converted: false,
      })
      .select('id')
      .single()

    if (dbError || !preview) {
      base.erreur = `Erreur DB : ${dbError?.message ?? 'insert a échoué'}`
      return base
    }

    const appUrl = (process.env.NEXT_PUBLIC_APP_URL || 'https://konvertpilot.com').replace(/\/$/, '')
    base.url_preview_partageable = `${appUrl}/preview/${preview.id}`
    base.statut = 'ok'
    return base
  } catch (err) {
    if (err instanceof ScrapeError) {
      base.erreur = `Scraping échoué : ${err.message}`
    } else {
      base.erreur = err instanceof Error ? err.message : 'Erreur inconnue'
    }
    return base
  }
}

async function main() {
  const inputPath = process.argv[2]
  if (!inputPath) {
    console.error('Usage: npx tsx scripts/batch-outreach-pages.ts <input.txt> [output.csv]')
    process.exit(1)
  }
  if (!existsSync(inputPath)) {
    console.error(`Fichier introuvable : ${inputPath}`)
    process.exit(1)
  }

  const outputPath =
    process.argv[3] ||
    resolve(process.cwd(), `scripts/output/batch-outreach-${Date.now()}.csv`)

  const urls = await readUrls(inputPath)
  if (urls.length === 0) {
    console.error('Aucune URL trouvée dans le fichier d\'entrée.')
    process.exit(1)
  }

  console.log(`KONVERT — Batch outreach pages`)
  console.log(`Input   : ${inputPath} (${urls.length} URL${urls.length > 1 ? 's' : ''})`)
  console.log(`Output  : ${outputPath}`)
  console.log(`Throttle: ${THROTTLE_MS}ms entre chaque génération, séquentiel\n`)

  const results: ResultRow[] = []

  for (let i = 0; i < urls.length; i++) {
    const url = urls[i]!
    console.log(`[${i + 1}/${urls.length}] ${url}`)
    const t0 = Date.now()

    const row = await processUrl(url, i)
    results.push(row)

    const dur = ((Date.now() - t0) / 1000).toFixed(1)
    if (row.statut === 'ok') {
      console.log(`  ✓ OK en ${dur}s — ${row.titre_produit}`)
      console.log(`  → ${row.url_preview_partageable}`)
    } else {
      console.log(`  ✗ ÉCHEC en ${dur}s — ${row.erreur}`)
    }

    // Pas de throttle après la dernière ligne.
    if (i < urls.length - 1) {
      await sleep(THROTTLE_MS)
    }
  }

  await mkdir(resolve(process.cwd(), 'scripts/output'), { recursive: true })
  await writeFile(outputPath, toCsv(results), 'utf-8')

  const okCount = results.filter((r) => r.statut === 'ok').length
  console.log(`\n${okCount}/${results.length} pages générées avec succès.`)
  console.log(`Résultats : ${outputPath}`)

  if (okCount < results.length) {
    process.exitCode = 1
  }
}

main().catch((err) => {
  console.error('ERREUR FATALE:', err)
  process.exit(1)
})
