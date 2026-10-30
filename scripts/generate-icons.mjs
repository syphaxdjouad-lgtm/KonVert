// Régénère toutes les icônes (onglet, Google, iOS, PWA) depuis src/app/icon.svg.
// Usage : node scripts/generate-icons.mjs   (nécessite ImageMagick pour le .ico)
import sharp from 'sharp'
import { readFileSync, writeFileSync, mkdtempSync, rmSync } from 'node:fs'
import { execFileSync } from 'node:child_process'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

const svg = readFileSync('src/app/icon.svg', 'utf8')
// iOS / Android / Google arrondissent eux-mêmes : version plein cadre, sans coins transparents.
const fullBleed = Buffer.from(svg.replace('rx="12"', 'rx="0"'))
const rounded = Buffer.from(svg)

const png = (src, size) => sharp(src, { density: 1200 }).resize(size, size).png().toBuffer()

const outputs = [
  ['src/app/apple-icon.png', fullBleed, 180],
  ['public/apple-touch-icon.png', fullBleed, 180],
  ['public/icon-192.png', fullBleed, 192],
  ['public/icon-512.png', fullBleed, 512],
  ['public/favicon.png', rounded, 48],
]
for (const [file, src, size] of outputs) writeFileSync(file, await png(src, size))

// favicon.ico multi-tailles (16/32/48) — Google exige un multiple de 48 px.
const dir = mkdtempSync(join(tmpdir(), 'kvt-ico-'))
const sizes = [16, 32, 48]
const files = []
for (const s of sizes) {
  const f = join(dir, `${s}.png`)
  writeFileSync(f, await png(rounded, s))
  files.push(f)
}
execFileSync('magick', [...files, 'src/app/favicon.ico'])
rmSync(dir, { recursive: true })
console.log('Icônes régénérées depuis src/app/icon.svg')
