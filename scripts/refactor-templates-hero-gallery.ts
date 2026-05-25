#!/usr/bin/env node
/**
 * Script de refactor des 42 templates etec-*.ts pour cabler la galerie hero.
 * Trouve le pattern <img ... src="${imgs[0]}" ...> dans le hero, conserve l'id
 * existant (souvent "mi1") ou en ajoute un nouveau (kvt-hero-img-${slug}),
 * et insere ${renderHeroThumbs(...)} juste apres. Met aussi a jour l'import.
 *
 * Usage:
 *   npx tsx scripts/refactor-templates-hero-gallery.ts --dry-run
 *   npx tsx scripts/refactor-templates-hero-gallery.ts --apply
 */

import { readFileSync, writeFileSync } from 'node:fs'
import { glob } from 'glob'
import path from 'node:path'

const isDryRun = process.argv.includes('--dry-run')
const isApply  = process.argv.includes('--apply')

if (!isDryRun && !isApply) {
  console.error('Usage: --dry-run | --apply')
  process.exit(1)
}

const IMG_TAG_RE = /<img\s+([^>]*?)src="\$\{(?:imgs|_real)\[0\]\}"([^>]*)>/

const IMPORT_BLOCK_RE = /import\s*\{([^}]*)\}\s*from\s*['"]\.\/sections['"]/

const THEME_FROM_RICH_RE = /renderRichSections\(data,\s*(\w+)\)/

function deriveSourceArrayExpr(match: string): string {
  if (match.includes('_real[0]')) return '_real'
  return 'imgs'
}

function findImgId(beforeSrc: string, afterSrc: string): string | null {
  const idMatch = (beforeSrc + ' ' + afterSrc).match(/\bid="([^"]+)"/)
  return idMatch ? idMatch[1] : null
}

function refactorContent(original: string, slug: string): { changed: boolean; next: string; diff: string[] } {
  const diff: string[] = []
  let next = original

  const imgMatch = next.match(IMG_TAG_RE)
  if (!imgMatch) {
    diff.push('no <img src="${imgs[0]}"> hero pattern found')
    return { changed: false, next, diff }
  }

  const fullTag = imgMatch[0]
  const beforeSrc = imgMatch[1] ?? ''
  const afterSrc = imgMatch[2] ?? ''
  const sourceArr = deriveSourceArrayExpr(fullTag)

  let mainImgId = findImgId(beforeSrc, afterSrc)
  let replacementTag = fullTag

  if (!mainImgId) {
    mainImgId = `kvt-hero-img-${slug}`
    // Inject id at the beginning of the tag attributes
    replacementTag = `<img id="${mainImgId}" ${beforeSrc.trim()} src="\${${sourceArr}[0]}"${afterSrc}>`.replace(/\s+/g, ' ').replace('> ', '>')
    // Cleaner reconstruction
    replacementTag = `<img id="${mainImgId}" ${beforeSrc}src="\${${sourceArr}[0]}"${afterSrc}>`
    diff.push(`id added: ${mainImgId}`)
  } else {
    diff.push(`id existant reuse: ${mainImgId}`)
  }

  const themeMatch = next.match(THEME_FROM_RICH_RE)
  const themeName = themeMatch?.[1] ?? 'DEFAULT_THEME'
  diff.push(`theme: ${themeName}`)

  const thumbsCall = `\${renderHeroThumbs(_real ?? imgs ?? [], ${themeName}, '${mainImgId}')}`
  const replacement = `${replacementTag}\n      ${thumbsCall}`

  next = next.replace(fullTag, replacement)

  const importMatch = next.match(IMPORT_BLOCK_RE)
  if (!importMatch) {
    diff.push('WARNING: aucun import depuis ./sections trouve')
  } else {
    const items = importMatch[1].split(',').map(s => s.trim()).filter(Boolean)
    if (!items.includes('renderHeroThumbs')) {
      items.push('renderHeroThumbs')
      next = next.replace(
        IMPORT_BLOCK_RE,
        `import {\n  ${items.join(',\n  ')},\n} from './sections'`,
      )
      diff.push('import: +renderHeroThumbs')
    } else {
      diff.push('import: renderHeroThumbs already present')
    }
  }

  return { changed: next !== original, next, diff }
}

async function main() {
  const files = await glob('src/lib/templates/etec-*.ts', { cwd: process.cwd() })
  console.log(`Found ${files.length} template files\n`)

  let changedCount = 0
  let skipCount   = 0

  for (const file of files.sort()) {
    const original = readFileSync(file, 'utf-8')
    const slug = path.basename(file, '.ts')
    const { changed, next, diff } = refactorContent(original, slug)

    if (changed) {
      changedCount++
      const action = isApply ? 'WRITE' : 'WOULD WRITE'
      console.log(`[${action}] ${file}`)
      diff.forEach(d => console.log(`  ${d}`))
      if (isApply) {
        writeFileSync(file, next, 'utf-8')
      }
    } else {
      skipCount++
      console.log(`[SKIP] ${file}`)
      diff.forEach(d => console.log(`  ${d}`))
    }
  }

  console.log(`\n${changedCount}/${files.length} files ${isApply ? 'modified' : 'would be modified'}`)
  console.log(`${skipCount} skipped (no match) — a traiter manuellement si necessaire`)
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})
