/**
 * Applique les 2 migrations SQL J-2 directement contre Supabase via une
 * connexion postgres. Nécessite SUPABASE_DB_URL dans .env.local OU se rabat
 * sur l'API REST Supabase + une fonction `exec_sql` temporaire.
 *
 * Usage : npx tsx scripts/apply-migration.ts
 */

import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { config } from 'node:process'
// dotenv n'est pas dispo : on lit .env.local à la main
import { readFileSync as read } from 'node:fs'

function loadEnv() {
  try {
    const txt = read(join(process.cwd(), '.env.local'), 'utf-8')
    txt.split('\n').forEach(line => {
      const m = line.match(/^([A-Z0-9_]+)=(.*)$/)
      if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^['"]|['"]$/g, '')
    })
  } catch { /* ignore */ }
}

loadEnv()

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE_KEY
const DB_URL = process.env.SUPABASE_DB_URL || process.env.DATABASE_URL

const migrations = [
  'supabase/migrations/20260503_quota_rollback.sql',
  'supabase/migrations/20260503_pages_images_bucket.sql',
]

async function viaPg(sql: string, file: string) {
  if (!DB_URL) throw new Error('SUPABASE_DB_URL manquant')
  const { Client } = await import('pg')
  const c = new Client({ connectionString: DB_URL, ssl: { rejectUnauthorized: false } })
  await c.connect()
  try {
    await c.query(sql)
    console.log(`✅ ${file} appliquée via pg`)
  } finally {
    await c.end()
  }
}

async function viaPgMeta(sql: string, file: string) {
  if (!SUPABASE_URL || !SERVICE_ROLE) throw new Error('SUPABASE_URL / SERVICE_ROLE manquants')
  // Endpoint pg-meta interne Supabase (utilisé par Studio). Demande l'access
  // token Management — impossible avec service_role seul. On laisse comme
  // simple fallback informatif.
  throw new Error('pg-meta indisponible avec service_role : utilise SUPABASE_DB_URL ou Studio.')
}

async function main() {
  if (!SUPABASE_URL) { console.error('❌ NEXT_PUBLIC_SUPABASE_URL manquant'); process.exit(1) }
  console.log(`Cible : ${SUPABASE_URL}`)
  console.log(`Méthode : ${DB_URL ? 'pg (direct)' : 'pg-meta (REST)'}\n`)

  for (const file of migrations) {
    const sql = readFileSync(join(process.cwd(), file), 'utf-8')
    console.log(`▶ ${file} (${sql.length} octets)`)
    try {
      if (DB_URL) await viaPg(sql, file)
      else await viaPgMeta(sql, file)
    } catch (e) {
      console.error(`❌ ${file} : ${e instanceof Error ? e.message : e}`)
      process.exitCode = 1
    }
  }
}

main()
