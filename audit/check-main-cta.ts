/**
 * QA Script — Audit #main-cta sur 5 templates etec (PR #16)
 * Utilise la fixture officielle mockLandingDataFull et renderTemplate centralisé
 * Usage : npx tsx --tsconfig tsconfig.json audit/check-main-cta.ts
 */

import { renderTemplate } from '../src/lib/templates/index'
import { mockLandingDataFull } from '../src/lib/templates/__fixtures__/mock-landing-data-full'

process.env.NEXT_PUBLIC_APP_URL = 'http://localhost:3000'

const TEMPLATES_TO_TEST = [
  'etec-beauty',
  'etec-jewel',
  'etec-techcase',
  'etec-natural',
  'etec-streetz',
]

// Audit étendu sur les 43 templates
const ALL_ETEC_TEMPLATES = [
  'etec-agency','etec-artisan','etec-aura','etec-beauty','etec-blue',
  'etec-blusho','etec-boost','etec-casa','etec-cosmetix','etec-electro',
  'etec-ella','etec-energy','etec-gadget','etec-glow','etec-glowup',
  'etec-gold','etec-homestyle','etec-hue','etec-interior','etec-jewel',
  'etec-luxe','etec-natural','etec-noir','etec-nordic','etec-outfit',
  'etec-pet','etec-platina','etec-poterie','etec-prestige','etec-prime',
  'etec-pulse','etec-quarter','etec-rose','etec-sage','etec-shopz',
  'etec-solo','etec-starter','etec-streetz','etec-style','etec-supreme',
  'etec-techcase','etec-trendy','etec-velvety',
]

interface TemplateResult {
  template: string
  hasMainCta: boolean
  mainCtaIdCount: number
  hasStickyBarHtml: boolean
  stickyWillWork: boolean
  hasTrustBadges: boolean
  buttonCount: number
  htmlLength: number
  error?: string
}

function analyzeHtml(templateId: string, html: string): TemplateResult {
  const hasMainCta =
    html.includes('id="main-cta"') ||
    html.includes("id='main-cta'")

  const mainCtaIdCount = (html.match(/id=["']main-cta["']/g) || []).length
  const hasStickyBarHtml = html.includes('kvt-sticky-cta')
  const stickyWillWork = hasStickyBarHtml && hasMainCta
  const hasTrustBadges =
    html.includes('kvt-trust') ||
    html.includes('visa') ||
    html.includes('mastercard') ||
    html.includes('paypal')
  const buttonCount = (html.match(/<button/gi) || []).length

  return {
    template: templateId,
    hasMainCta,
    mainCtaIdCount,
    hasStickyBarHtml,
    stickyWillWork,
    hasTrustBadges,
    buttonCount,
    htmlLength: html.length,
  }
}

async function main() {
  console.log('\n=== QA AUDIT PR#16 — Vérification #main-cta sur 43 templates etec ===\n')

  // 1. Audit des 5 templates du smoke test
  console.log('--- SMOKE TEMPLATES (5) ---\n')
  const smokeResults: TemplateResult[] = []

  for (const templateId of TEMPLATES_TO_TEST) {
    try {
      const html = renderTemplate(templateId, mockLandingDataFull)
      smokeResults.push(analyzeHtml(templateId, html))
    } catch (err) {
      smokeResults.push({
        template: templateId,
        hasMainCta: false,
        mainCtaIdCount: 0,
        hasStickyBarHtml: false,
        stickyWillWork: false,
        hasTrustBadges: false,
        buttonCount: 0,
        htmlLength: 0,
        error: String(err).substring(0, 300),
      })
    }
  }

  for (const r of smokeResults) {
    if (r.error) {
      console.log(`${r.template}: ERROR — ${r.error}`)
    } else {
      const status = r.hasMainCta ? 'OK' : 'MISSING'
      const stickyStatus = r.stickyWillWork ? 'WORKS' : (r.hasStickyBarHtml ? 'INJECTED-BUT-BROKEN' : 'NOT-INJECTED')
      console.log(`${r.template}:`)
      console.log(`  #main-cta: ${status} (count: ${r.mainCtaIdCount})`)
      console.log(`  sticky bar injected: ${r.hasStickyBarHtml}`)
      console.log(`  sticky will work: ${stickyStatus}`)
      console.log(`  trust badges: ${r.hasTrustBadges}`)
      console.log(`  button count: ${r.buttonCount}`)
      console.log(`  html size: ${(r.htmlLength / 1024).toFixed(1)}KB`)
    }
    console.log()
  }

  // 2. Audit exhaustif sur les 43 templates
  console.log('\n--- AUDIT EXHAUSTIF 43/43 ---\n')
  let withId = 0
  let withoutId = 0
  let withStickyInjected = 0
  let errors = 0
  const missingIdTemplates: string[] = []
  const errorTemplates: string[] = []

  for (const templateId of ALL_ETEC_TEMPLATES) {
    try {
      const html = renderTemplate(templateId, mockLandingDataFull)
      const r = analyzeHtml(templateId, html)
      if (r.hasMainCta) {
        withId++
        console.log(`  ${templateId}: HAS main-cta`)
      } else {
        withoutId++
        missingIdTemplates.push(templateId)
        if (r.hasStickyBarHtml) withStickyInjected++
        console.log(`  ${templateId}: MISSING main-cta | sticky=${r.hasStickyBarHtml} | trust=${r.hasTrustBadges}`)
      }
    } catch (err) {
      errors++
      errorTemplates.push(templateId)
      console.log(`  ${templateId}: ERROR — ${String(err).substring(0, 100)}`)
    }
  }

  console.log(`\n=== RÉSUMÉ ===`)
  console.log(`Templates avec id="main-cta": ${withId}/43`)
  console.log(`Templates SANS id="main-cta": ${withoutId}/43`)
  console.log(`Templates avec sticky injecté mais ID manquant: ${withStickyInjected}`)
  console.log(`Erreurs de rendu: ${errors}`)
  if (missingIdTemplates.length > 0) {
    console.log(`\nTemplates sans main-cta (${missingIdTemplates.length}):`)
    missingIdTemplates.forEach(t => console.log(`  - ${t}`))
  }
  if (errorTemplates.length > 0) {
    console.log(`\nTemplates en erreur (${errorTemplates.length}):`)
    errorTemplates.forEach(t => console.log(`  - ${t}`))
  }
}

main().catch(console.error)
