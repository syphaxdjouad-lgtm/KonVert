#!/usr/bin/env node
/**
 * Script de refactor des 41 templates etec-*.ts pour remplacer les 6 appels
 * individuels (renderStorySection, renderSocialProofBar, ...) par un seul
 * appel à renderRichSections(data, THEME_NAME).
 *
 * Usage:
 *   npx tsx scripts/refactor-templates-rich-sections.ts --dry-run
 *   npx tsx scripts/refactor-templates-rich-sections.ts --apply
 */

import { readFileSync, writeFileSync } from 'node:fs'
import { glob } from 'glob'

const isDryRun = process.argv.includes('--dry-run')
const isApply  = process.argv.includes('--apply')

if (!isDryRun && !isApply) {
  console.error('Usage: npx tsx scripts/refactor-templates-rich-sections.ts --dry-run | --apply')
  process.exit(1)
}

// Regex pour matcher le bloc d'imports depuis './sections' (capture le contenu des {})
const IMPORT_BLOCK_RE = /import\s*\{([^}]*)\}\s*from\s*['"]\.\/sections['"]/

// Regex pour matcher la séquence des 6 appels dans l'ordre canonique.
// \s+ entre les appels gère aussi bien \n que \n\n (etec-blue a des lignes vides)
// Le backreference \1 garantit que le même nom de thème est utilisé pour les 6 appels.
const CALLS_RE = /\$\{renderSocialProofBar\(data,\s*(\w+)\)\}\s+\$\{renderStorySection\(data,\s*\1\)\}\s+\$\{renderComparisonSection\(data,\s*\1\)\}\s+\$\{renderTestimonialsSection\(data,\s*\1\)\}\s+\$\{renderBonusesSection\(data,\s*\1\)\}\s+\$\{renderGuaranteeSection\(data,\s*\1\)\}/g

const V1_IMPORTS = [
  'renderStorySection',
  'renderSocialProofBar',
  'renderTestimonialsSection',
  'renderComparisonSection',
  'renderBonusesSection',
  'renderGuaranteeSection',
]

function refactorFile(filepath: string): { changed: boolean; next: string; diff: string[] } {
  const original = readFileSync(filepath, 'utf-8')
  let next = original
  const diff: string[] = []

  // 1. Remplacer les imports : retirer les 6 V1, ajouter renderRichSections
  next = next.replace(IMPORT_BLOCK_RE, (_, contents: string) => {
    const items = contents
      .split(',')
      .map(s => s.trim())
      .filter(Boolean)
    const remaining = items.filter(
      name => !V1_IMPORTS.includes(name.replace(/^type\s+/, '').trim()),
    )
    if (!remaining.includes('renderRichSections')) {
      remaining.unshift('renderRichSections')
    }
    diff.push(`imports: ${items.length} → ${remaining.length}`)
    return `import {\n  ${remaining.join(',\n  ')},\n} from './sections'`
  })

  // 2. Remplacer les 6 appels par 1 seul
  next = next.replace(CALLS_RE, (_, themeName: string) => {
    diff.push(`calls: 6 → 1 (theme=${themeName})`)
    return `\${renderRichSections(data, ${themeName})}`
  })

  return { changed: next !== original, next, diff }
}

async function main() {
  const files = await glob('src/lib/templates/etec-*.ts', { cwd: process.cwd() })
  console.log(`Found ${files.length} template files\n`)

  let changedCount = 0
  for (const file of files.sort()) {
    const { changed, next, diff } = refactorFile(file)
    if (changed) {
      changedCount++
      const action = isApply ? 'WRITE' : 'WOULD WRITE'
      console.log(`[${action}] ${file}`)
      diff.forEach(d => console.log(`  ${d}`))
      if (isApply) {
        writeFileSync(file, next, 'utf-8')
      }
    } else {
      console.log(`[SKIP] ${file} (no match)`)
    }
  }

  console.log(`\n${changedCount}/${files.length} files ${isApply ? 'modified' : 'would be modified'}`)
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})
