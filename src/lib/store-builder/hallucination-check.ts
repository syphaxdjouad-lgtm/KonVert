import type { MerchantFacts } from './merchant-facts'
import type { StoreBuilderOutput } from './schema'

// ─── Détection d'hallucination — règles (cf. spec §7.3) ─────────────────────
//
// Non-bloquant en prod (log + dashboard, jamais un crash ou un refus de
// génération) mais BLOQUANT en CI sur le golden set (cf. spec §7.4). Fonction
// pure, testable sans réseau — scanne les champs texte de la sortie validée
// et flag tout ce qui ressemble à une hallucination malgré les guardrails
// structurels du schéma.

export type FlagSeverity = 'critical' | 'warning'

export interface Flag {
  field: string
  pattern: string
  excerpt: string
  severity: FlagSeverity
}

const KNOWN_BRANDS = [
  'shein', 'temu', 'amazon', 'sephora', 'apple', 'samsung', 'anker', 'jbl',
  'nyx', "l'oréal", 'loreal', 'nike', 'adidas', 'aliexpress', 'alibaba',
  'zara', 'shopify plus',
]

interface FieldToScan {
  field: string
  text: string
}

function collectFields(output: StoreBuilderOutput): FieldToScan[] {
  const fields: FieldToScan[] = [
    { field: 'description_html', text: output.description_html },
    { field: 'founder_story.story_html', text: output.founder_story.story_html },
    { field: 'exit_intent.text_html', text: output.exit_intent.text_html },
  ]

  output.faq.forEach((item, i) => fields.push({ field: `faq[${i}].answer_html`, text: item.answer_html }))
  output.guarantees.forEach((item, i) => fields.push({ field: `guarantees[${i}].text_html`, text: item.text_html }))
  output.comparison_table.rows.forEach((row, i) => {
    if (row.us_text) fields.push({ field: `comparison_table.rows[${i}].us_text`, text: row.us_text })
    if (row.them_text) fields.push({ field: `comparison_table.rows[${i}].them_text`, text: row.them_text })
  })

  return fields
}

// Le check "marque concurrente réelle" (cf. spec §7.3, tableau ligne 5) est
// volontairement scopé au SEUL texte libre de `comparison_table` (`them_text`
// + `them_column_label`, ce dernier étant déjà protégé par enum donc ne
// devrait jamais matcher en pratique) — PAS à tous les champs. Une mention
// légitime de moyen de paiement réel ("carte bancaire, PayPal, Apple Pay",
// cf. system prompt RÈGLE 3) dans description/FAQ/guarantees ne doit jamais
// être confondue avec un dénigrement nominatif de concurrent.
function collectComparisonThemFields(output: StoreBuilderOutput): FieldToScan[] {
  const fields: FieldToScan[] = [
    { field: 'comparison_table.them_column_label', text: output.comparison_table.them_column_label },
  ]
  output.comparison_table.rows.forEach((row, i) => {
    if (row.them_text) fields.push({ field: `comparison_table.rows[${i}].them_text`, text: row.them_text })
  })
  return fields
}

function excerptAround(text: string, index: number, length: number): string {
  const start = Math.max(0, index - 20)
  const end = Math.min(text.length, index + length + 20)
  return text.slice(start, end).trim()
}

/** Positions [start, end) de chaque gabarit `[...]` présent dans le texte. */
function bracketSpans(text: string): Array<[number, number]> {
  const spans: Array<[number, number]> = []
  const pattern = /\[[^\]]*\]/g
  let match: RegExpExecArray | null
  while ((match = pattern.exec(text)) !== null) {
    spans.push([match.index, match.index + match[0].length])
  }
  return spans
}

function isInsideAnySpan(index: number, spans: Array<[number, number]>): boolean {
  return spans.some(([start, end]) => index >= start && index < end)
}

/**
 * Scanne la sortie validée du générateur à la recherche de patterns
 * caractéristiques d'une hallucination réglementaire (R5), même si le schéma
 * structurel devrait déjà l'exclure. Défense en profondeur — `merchantFacts`
 * et `sourceDescription` servent à disculper les valeurs légitimement
 * fournies par le marchand ou reprises fidèlement du scrape (RÈGLE 3).
 */
export function detectSuspiciousClaims(
  output: StoreBuilderOutput,
  sourceDescription: string,
  merchantFacts?: MerchantFacts,
): Flag[] {
  const flags: Flag[] = []
  const fields = collectFields(output)
  const lowerSource = sourceDescription.toLowerCase()

  const socialProofNumberPattern = /\d[\d\s]*(clients?|commandes?|avis|ventes?|acheteurs?)\b/i
  const fakeRatingPattern = /\d(\.\d)?\s*\/\s*5\b|\d+\s*%\s*(satisfait|efficace|résultat)/i
  const certificationPattern = /\bIP\d{2}\b|Bluetooth\s?\d|ISO\s?\d+|\bCE\b/g
  const promoPattern = /code\s*promo|-\d+\s*%|réduction\s*de\s*\d+/i
  const bareDelayPattern = /\d+\s*(jours?|ans?|mois|heures?)\b/gi

  for (const { field, text } of fields) {
    const socialProofMatch = socialProofNumberPattern.exec(text)
    if (socialProofMatch) {
      flags.push({
        field,
        pattern: 'social_proof_number',
        excerpt: excerptAround(text, socialProofMatch.index, socialProofMatch[0].length),
        severity: 'critical',
      })
    }

    const ratingMatch = fakeRatingPattern.exec(text)
    if (ratingMatch) {
      flags.push({
        field,
        pattern: 'fake_rating_or_efficacy',
        excerpt: excerptAround(text, ratingMatch.index, ratingMatch[0].length),
        severity: 'critical',
      })
    }

    let certMatch: RegExpExecArray | null
    certificationPattern.lastIndex = 0
    while ((certMatch = certificationPattern.exec(text)) !== null) {
      if (!lowerSource.includes(certMatch[0].toLowerCase())) {
        flags.push({
          field,
          pattern: 'unsourced_certification',
          excerpt: excerptAround(text, certMatch.index, certMatch[0].length),
          severity: 'critical',
        })
      }
    }

    const promoMatch = promoPattern.exec(text)
    if (promoMatch) {
      flags.push({
        field,
        pattern: 'unfunded_promo',
        excerpt: excerptAround(text, promoMatch.index, promoMatch[0].length),
        severity: 'critical',
      })
    }

    const spans = bracketSpans(text)
    let delayMatch: RegExpExecArray | null
    bareDelayPattern.lastIndex = 0
    while ((delayMatch = bareDelayPattern.exec(text)) !== null) {
      const around = excerptAround(text, delayMatch.index, delayMatch[0].length)
      if (isInsideAnySpan(delayMatch.index, spans)) continue // gabarit à trous légitime (ex. "[délai réel, ex. 14 jours]")

      const isFromMerchantFacts = merchantFactsContains(merchantFacts, delayMatch[0])
      if (!isFromMerchantFacts) {
        flags.push({
          field,
          pattern: 'bare_delay_without_placeholder',
          excerpt: around,
          severity: 'warning',
        })
      }
    }
  }

  for (const { field, text } of collectComparisonThemFields(output)) {
    const lowerText = text.toLowerCase()
    for (const brand of KNOWN_BRANDS) {
      if (lowerText.includes(brand)) {
        flags.push({
          field,
          pattern: 'real_competitor_brand',
          excerpt: excerptAround(text, lowerText.indexOf(brand), brand.length),
          severity: 'critical',
        })
      }
    }
  }

  return flags
}

function merchantFactsContains(merchantFacts: MerchantFacts | undefined, needle: string): boolean {
  if (!merchantFacts) return false
  const haystack = [
    merchantFacts.processing_delay,
    merchantFacts.shipping_delay,
    merchantFacts.return_policy,
    merchantFacts.warranty_duration,
    merchantFacts.support_response_time,
  ]
    .filter((v): v is string => Boolean(v))
    .join(' ')
    .toLowerCase()
  return haystack.includes(needle.toLowerCase())
}
