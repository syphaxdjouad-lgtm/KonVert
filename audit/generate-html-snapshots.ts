/**
 * QA Script — Génère les fichiers HTML statiques des 5 templates cibles PR#16
 * Usage : npx tsx --tsconfig tsconfig.json audit/generate-html-snapshots.ts
 */

import fs from 'fs'
import path from 'path'
import { renderTemplate } from '../src/lib/templates/index'
import { mockLandingDataFull } from '../src/lib/templates/__fixtures__/mock-landing-data-full'

process.env.NEXT_PUBLIC_APP_URL = 'http://localhost:3000'

const OUT_DIR = path.resolve(__dirname, 'screenshots/pr16/html')
fs.mkdirSync(OUT_DIR, { recursive: true })

const TEMPLATES = ['etec-beauty', 'etec-jewel', 'etec-techcase', 'etec-natural', 'etec-streetz']

for (const templateId of TEMPLATES) {
  const html = renderTemplate(templateId, mockLandingDataFull)
  const outPath = path.join(OUT_DIR, `${templateId}.html`)
  fs.writeFileSync(outPath, html, 'utf-8')
  console.log(`Written: ${outPath} (${(html.length / 1024).toFixed(1)}KB)`)
}

console.log('\nDone.')
