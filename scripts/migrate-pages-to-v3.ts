#!/usr/bin/env tsx
/**
 * Migrate pages from legacy templates to V3 styles.
 *
 * Usage:
 *   tsx scripts/migrate-pages-to-v3.ts             # dry-run par défaut
 *   tsx scripts/migrate-pages-to-v3.ts --apply     # vraie écriture
 *
 * Variables d'environnement requises :
 *   SUPABASE_URL ou NEXT_PUBLIC_SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY
 *
 * Prérequis :
 *   - Migration SQL 20260526_pages_v3_columns.sql appliquée
 *   - Mappings dans src/lib/migration/ committés (Task 8.1)
 */

import { createClient } from '@supabase/supabase-js'
import { mapLegacyToStyle } from '../src/lib/migration/legacy-to-v3'
import { mapV2SectionsToV3 } from '../src/lib/migration/section-v2-to-v3'

const APPLY = process.argv.includes('--apply')

const SUPABASE_URL = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error('Missing SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY env vars')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
})

interface PageRow {
  id: string
  template_id: string | null
  section_order: string[] | null
  style_id: string | null
}

async function main() {
  console.log(`\n${'─'.repeat(60)}`)
  console.log(`Konvert V3 migration script`)
  console.log(`Mode: ${APPLY ? 'APPLY (writing to DB)' : 'DRY-RUN (no writes)'}`)
  console.log(`${'─'.repeat(60)}\n`)

  const { data: pages, error } = await supabase
    .from('pages')
    .select('id, template_id, section_order, style_id')

  if (error) {
    console.error('Failed to fetch pages:', error.message)
    process.exit(1)
  }

  const rows = (pages ?? []) as PageRow[]
  console.log(`Found ${rows.length} pages in DB.\n`)

  let migrated = 0
  let skipped = 0
  let errors = 0

  for (const page of rows) {
    if (page.style_id) {
      skipped++
      continue
    }
    if (!page.template_id) {
      console.warn(`Page ${page.id} has no template_id, skipping`)
      skipped++
      continue
    }

    const styleId = mapLegacyToStyle(page.template_id)
    const v3Sections = page.section_order
      ? mapV2SectionsToV3(page.section_order)
      : null

    console.log(`${page.id.slice(0, 8)} : ${page.template_id} → ${styleId}`)
    if (v3Sections) {
      const preview = v3Sections.slice(0, 5).join(', ')
      const suffix = v3Sections.length > 5 ? '...' : ''
      console.log(`           sections: ${v3Sections.length} (${preview}${suffix})`)
    }

    if (APPLY) {
      const { error: upErr } = await supabase
        .from('pages')
        .update({
          style_id: styleId,
          section_order_v3: v3Sections,
          v3_migrated_at: new Date().toISOString(),
        })
        .eq('id', page.id)

      if (upErr) {
        console.error(`           ${upErr.message}`)
        errors++
      } else {
        migrated++
      }
    } else {
      migrated++
    }
  }

  console.log(`\n${'─'.repeat(60)}`)
  console.log(`Summary :`)
  console.log(`  ${APPLY ? 'Migrated' : 'Would migrate'} : ${migrated}`)
  console.log(`  Skipped (already V3 or no template_id) : ${skipped}`)
  if (errors > 0) console.log(`  Errors : ${errors}`)
  console.log(`${'─'.repeat(60)}\n`)

  if (!APPLY) {
    console.log(`To execute the migration, run:`)
    console.log(`  tsx scripts/migrate-pages-to-v3.ts --apply\n`)
  }

  process.exit(errors > 0 ? 1 : 0)
}

main().catch((e: unknown) => {
  console.error('Fatal:', e)
  process.exit(1)
})
