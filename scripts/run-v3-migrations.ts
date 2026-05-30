#!/usr/bin/env tsx
/**
 * One-shot script — applique les 2 migrations V3 sur Supabase prod.
 * Utilise pg (déjà installé) + DATABASE_URL env var.
 *
 * Usage : DATABASE_URL=postgres://... tsx scripts/run-v3-migrations.ts
 *
 * Idempotent : les 2 SQL utilisent IF NOT EXISTS / ON CONFLICT / DROP IF EXISTS.
 * Safe à re-run.
 */
import { Client } from 'pg'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

const DATABASE_URL = process.env.DATABASE_URL
if (!DATABASE_URL) {
  console.error('❌ DATABASE_URL env var manquante')
  process.exit(1)
}

const MIGRATIONS = [
  '20260526_konvert_product_images_bucket.sql',
  '20260526_pages_v3_columns.sql',
]

const VERIFY_QUERIES = {
  columns: `
    select column_name, data_type
    from information_schema.columns
    where table_name = 'pages'
      and column_name in ('style_id', 'section_order_v3', 'v3_migrated_at')
    order by column_name
  `,
  bucket: `
    select id, name, public, file_size_limit
    from storage.buckets
    where id = 'konvert-product-images'
  `,
  policies: `
    select policyname
    from pg_policies
    where tablename = 'objects'
      and policyname like 'konvert-product-images%'
    order by policyname
  `,
}

async function main() {
  const client = new Client({ connectionString: DATABASE_URL, ssl: { rejectUnauthorized: false } })
  await client.connect()
  console.log('✅ Connected to Supabase\n')

  // ─── Run migrations ──────────────────────────────────────────────────────
  for (const file of MIGRATIONS) {
    const path = join(process.cwd(), 'supabase', 'migrations', file)
    const sql = readFileSync(path, 'utf-8')
    console.log(`▶ Running ${file}...`)
    try {
      await client.query(sql)
      console.log(`  ✅ OK\n`)
    } catch (err) {
      console.error(`  ❌ FAILED:`, err instanceof Error ? err.message : err)
      await client.end()
      process.exit(1)
    }
  }

  // ─── Verify ──────────────────────────────────────────────────────────────
  console.log('━━━ Verification post-migration ━━━\n')

  const cols = await client.query(VERIFY_QUERIES.columns)
  console.log(`📋 Colonnes V3 sur table pages (${cols.rowCount}/3 attendues) :`)
  cols.rows.forEach((r: { column_name: string; data_type: string }) =>
    console.log(`   • ${r.column_name} (${r.data_type})`),
  )

  const bucket = await client.query(VERIFY_QUERIES.bucket)
  console.log(`\n🪣 Bucket storage (${bucket.rowCount}/1 attendu) :`)
  bucket.rows.forEach((r: { id: string; public: boolean; file_size_limit: number }) =>
    console.log(`   • ${r.id} · public=${r.public} · limit=${r.file_size_limit / 1024 / 1024}MB`),
  )

  const policies = await client.query(VERIFY_QUERIES.policies)
  console.log(`\n🔐 Policies RLS (${policies.rowCount}/4 attendues) :`)
  policies.rows.forEach((r: { policyname: string }) => console.log(`   • ${r.policyname}`))

  await client.end()

  // ─── Summary ─────────────────────────────────────────────────────────────
  const ok = cols.rowCount === 3 && bucket.rowCount === 1 && policies.rowCount === 4
  console.log(`\n${ok ? '✅ MIGRATIONS V3 OK' : '⚠️  Vérifie manuellement'}`)
  process.exit(ok ? 0 : 2)
}

main().catch((err) => {
  console.error('💥 Fatal:', err)
  process.exit(1)
})
