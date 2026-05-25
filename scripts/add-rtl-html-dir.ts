#!/usr/bin/env node
/**
 * Patch les 42 templates etec-*.ts pour ajouter dir="rtl" si lang="ar".
 * Remplace toutes les occurrences de :
 *   <html lang="${data.language || 'fr'}">
 * par :
 *   <html lang="${data.language || 'fr'}" dir="${data.language === 'ar' ? 'rtl' : 'ltr'}">
 *
 * Usage:
 *   npx tsx scripts/add-rtl-html-dir.ts --dry-run
 *   npx tsx scripts/add-rtl-html-dir.ts --apply
 */

import { readFileSync, writeFileSync } from 'node:fs'
import { glob } from 'glob'

const isDryRun = process.argv.includes('--dry-run')
const isApply  = process.argv.includes('--apply')

if (!isDryRun && !isApply) {
  console.error('Usage: --dry-run | --apply')
  process.exit(1)
}

// Pattern : <html lang="${data.language || 'fr'}"> (avec variantes de quotes)
const HTML_TAG_RE = /<html\s+lang="\$\{data\.language\s*\|\|\s*['"]fr['"]\}"(\s*)>/g

const REPLACEMENT = '<html lang="${data.language || \'fr\'}" dir="${data.language === \'ar\' ? \'rtl\' : \'ltr\'}"$1>'

async function main() {
  const files = await glob('src/lib/templates/etec-*.ts', { cwd: process.cwd() })
  console.log(`Found ${files.length} template files`)

  let changedCount = 0
  let skipCount   = 0
  let totalMatches = 0

  for (const file of files.sort()) {
    const original = readFileSync(file, 'utf-8')
    const matches = original.match(HTML_TAG_RE)
    if (!matches) {
      skipCount++
      console.log(`[SKIP] ${file} (no match)`)
      continue
    }
    totalMatches += matches.length
    if (isDryRun) {
      console.log(`[WOULD WRITE] ${file} (${matches.length} match${matches.length > 1 ? 'es' : ''})`)
    } else {
      const next = original.replace(HTML_TAG_RE, REPLACEMENT)
      writeFileSync(file, next, 'utf-8')
      console.log(`[WRITE] ${file} (${matches.length} match${matches.length > 1 ? 'es' : ''})`)
    }
    changedCount++
  }

  console.log(`\n${changedCount}/${files.length} files ${isApply ? 'modified' : 'would be modified'}`)
  console.log(`${skipCount} skipped (no match)`)
  console.log(`${totalMatches} total <html> tags patched`)
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})
