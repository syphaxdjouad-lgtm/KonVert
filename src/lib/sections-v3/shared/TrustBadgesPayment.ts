/**
 * renderTrustBadgesPayment — section HTML statique "Moyens de paiement acceptés"
 *
 * Génère un bloc SVG inline pour 8 méthodes paiement. Pas d'images externes,
 * pas de dépendance — rendu offline, LCP-friendly, a11y WCAG AA.
 *
 * Usage dans les templates etec-* :
 *   renderTrustBadgesPayment({ methods: data.payment_methods, theme })
 *
 * Intégration renderRichSections :
 *   Ajouté comme section 'trust_badges_payment' juste après 'guarantee'.
 */

export type PaymentMethod =
  | 'visa'
  | 'mastercard'
  | 'amex'
  | 'paypal'
  | 'apple_pay'
  | 'google_pay'
  | 'klarna'
  | 'alma'

export type TrustBadgesVariant = 'compact' | 'labeled' | 'footer'

export interface TrustBadgesOptions {
  methods?: PaymentMethod[]
  variant?: TrustBadgesVariant
  accentColor?: string
  bg?: string
  border?: string
  fontFamily?: string
}

const DEFAULT_METHODS: PaymentMethod[] = ['visa', 'mastercard', 'paypal', 'apple_pay']

// ─── SVG inline pour chaque méthode ───────────────────────────────────────────
// Formes vectorielles simplifiées fidèles aux logotypes officiels.
// Viewbox 38×24 = ratio carte bancaire standard.

const SVG_VISA = `<svg viewBox="0 0 38 24" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Visa">
  <rect width="38" height="24" rx="4" fill="#1A1F71"/>
  <path d="M15.2 16.8H13l1.36-8.4h2.2L15.2 16.8zm-4.08-8.4l-2.1 5.76-.25-1.25-.74-3.72s-.09-.79-1.04-.79H4l-.04.22s.9.19 1.95.82l1.62 6.16h2.28L13.4 8.4H11.12zm13.24 0l-2.02 8.4h-2.1l2.02-8.4h2.1zm7.5 0c-.82 0-1.6.22-2.06.42l-.28 1.7s.76-.3 1.77-.3c.56 0 .98.16.96.64-.02.42-.64.5-1.1.66-1.06.34-2.2 1.02-2.16 2.44.04 1.54 1.18 2.34 2.62 2.34.68 0 1.28-.14 1.86-.36l.3-1.66s-.54.24-1.1.24c-.52 0-.94-.22-.94-.7 0-.46.42-.7.96-.9.82-.3 1.82-.82 1.8-2.2-.02-1.46-1.06-2.32-2.63-2.32z" fill="white"/>
</svg>`

const SVG_MASTERCARD = `<svg viewBox="0 0 38 24" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Mastercard">
  <rect width="38" height="24" rx="4" fill="#252525"/>
  <circle cx="15" cy="12" r="7" fill="#EB001B"/>
  <circle cx="23" cy="12" r="7" fill="#F79E1B"/>
  <path d="M19 6.8a7 7 0 0 1 0 10.4A7 7 0 0 1 19 6.8z" fill="#FF5F00"/>
</svg>`

const SVG_AMEX = `<svg viewBox="0 0 38 24" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="American Express">
  <rect width="38" height="24" rx="4" fill="#2557D6"/>
  <path d="M7 9.5h2.4l.4 1 .4-1H22v.6l-.4-.6h2.6l.8 2.2V9.5H28v5H25.4l-.4-.9v.9H22l-.4-.9H21l-.4.9H18v-.6c-.46.4-1.1.6-1.8.6H14l-.4-.9H13l-.4.9H10L9 13.4l-1 1.1H7V9.5zm2.6.8L8 13.2h1.5l.3-.8H11l.3.8H13v-2.5l-1 2.5h-.8L10.2 11v2.2H9.2l-.28-.8H7.7L7.4 14H6.4l1.2-3.7h1.6zm9.8 0v.7h-2.3v.6H22v.7h-2.9v.7H22v.7h-3.8V10.3H22zm3 0h2.4c.6 0 1 .3 1 .8 0 .4-.2.6-.5.7.3.1.5.4.5.8V14h-1.1v-.5c0-.3-.1-.5-.5-.5h-1.2V14h-1v-3.7zm-10 .4l-.5 1.5h1l-.5-1.5zm10.1.4v.6h1.2c.2 0 .3-.1.3-.3 0-.2-.1-.3-.3-.3h-1.2z" fill="white"/>
</svg>`

const SVG_PAYPAL = `<svg viewBox="0 0 38 24" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="PayPal">
  <rect width="38" height="24" rx="4" fill="#F7F9FC" stroke="#E8E8ED" stroke-width="0.5"/>
  <path d="M22.5 8.5c.3 1.8-.8 3.8-2.5 4.5-.2 0-.3.1-.5.1h-1.8l-.5 3H15l1.8-9.5h3.2c1.2 0 2.2.7 2.5 1.9z" fill="#009BE1"/>
  <path d="M24.5 8.1c.3 1.8-.8 3.8-2.5 4.5-.2 0-.3.1-.5.1h-1.8l-.5 3H17l1.8-9.5h3.2c1.2 0 2.2.7 2.5 1.9z" fill="#012169"/>
  <path d="M17.8 16.3l.5-3h1.8c.2 0 .3 0 .5-.1 1.7-.7 2.8-2.7 2.5-4.5l1.4.1c.3 1.9-.9 4-2.7 4.7-.2.1-.4.1-.6.1h-1.6l-.5 2.7h-1.3z" fill="#001C64"/>
</svg>`

const SVG_APPLE_PAY = `<svg viewBox="0 0 38 24" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Apple Pay">
  <rect width="38" height="24" rx="4" fill="#1A1A1A"/>
  <path d="M14.5 9.4c-.3.4-.9.7-1.4.6-.1-.5.2-1.1.5-1.5.3-.4.9-.7 1.4-.7.1.6-.1 1.1-.5 1.6zm.5.8c-.8 0-1.5.5-1.9.5-.4 0-1-.4-1.7-.4-1.2.1-2.3.7-3 1.9-.6 1.2-.8 3 .2 4.3.5.7 1.1 1.3 1.9 1.3.7 0 1-.5 1.8-.5.8 0 1.1.5 1.9.5.8 0 1.3-.7 1.8-1.3.4-.5.5-1 .6-1.1-.9-.3-1.6-1.2-1.6-2.2 0-1 .5-1.8 1.3-2.2-.5-.7-1.2-1.1-1.3-1.1-.7 0-1.1.3-2 .3zm8.2-1.7v9.5h-1.4v-3.2h-2v3.2H18v-9.5h1.8v3.9h2V8.5h1.4z" fill="white"/>
</svg>`

const SVG_GOOGLE_PAY = `<svg viewBox="0 0 38 24" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Google Pay">
  <rect width="38" height="24" rx="4" fill="#F7F9FC" stroke="#E8E8ED" stroke-width="0.5"/>
  <path d="M17.8 12v2.2H17V8.6h2.1c.5 0 1 .2 1.3.5.4.4.6.8.6 1.3s-.2.9-.6 1.3c-.3.3-.8.5-1.3.5H17.8zm0-2.8v2.2h1.3c.3 0 .6-.1.8-.3.4-.4.4-1 0-1.4-.2-.2-.5-.3-.8-.3h-1.3zm5 .8c.5 0 .9.1 1.2.4.3.3.5.7.5 1.2V17H23v-.7h-.1c-.3.4-.7.6-1.2.6-.4 0-.8-.1-1.1-.4-.3-.2-.4-.6-.4-1 0-.4.1-.8.5-1 .3-.3.8-.4 1.3-.4.5 0 .8.1 1.1.2v-.2c0-.3-.1-.5-.3-.7-.2-.2-.5-.3-.8-.3-.4 0-.8.2-1 .5l-.8-.5c.4-.6 1-.8 1.8-.8zm-.2 4.3c.2 0 .4-.1.6-.2.2-.1.3-.3.3-.5 0-.1-.1-.3-.3-.4-.2-.1-.4-.2-.6-.2-.4 0-.7.1-.9.2-.2.2-.3.4-.3.6 0 .2.1.4.3.5.2.1.5.2.9 0 0 0 0 0 0 0zm4.2-4.2L25 14l-1.8-3.9H22l2.3 5-.1.3c-.2.5-.7.7-1.1.7-.2 0-.3 0-.5-.1l-.2.8c.2.1.5.1.7.1.9 0 1.5-.4 1.9-1.4l2.1-5.3h-1.3z" fill="#3C4043"/>
</svg>`

const SVG_KLARNA = `<svg viewBox="0 0 38 24" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Klarna">
  <rect width="38" height="24" rx="4" fill="#FFB3C7"/>
  <path d="M22.5 8.4h-1.8v7.2h1.8V8.4zm-5.2 0h-1.9v7.2h1.9V8.4zm-2.6 0h-1.8c0 1.5-.7 2.8-1.9 3.6l-.7.5 2.7 3.1h2.3l-2.5-2.8c1.1-1.1 1.9-2.7 1.9-4.4zm10.5 5c-.6 0-1 .4-1 1s.4 1 1 1 1-.4 1-1-.4-1-1-1z" fill="#17120F"/>
</svg>`

const SVG_ALMA = `<svg viewBox="0 0 38 24" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Alma">
  <rect width="38" height="24" rx="4" fill="#FA5022"/>
  <text x="7" y="15.5" font-family="Arial,sans-serif" font-size="9" font-weight="700" fill="white" letter-spacing="-0.3">alma</text>
  <text x="19" y="13.5" font-family="Arial,sans-serif" font-size="6.5" fill="rgba(255,255,255,0.85)">3x 4x</text>
</svg>`

const SVG_MAP: Record<PaymentMethod, string> = {
  visa:        SVG_VISA,
  mastercard:  SVG_MASTERCARD,
  amex:        SVG_AMEX,
  paypal:      SVG_PAYPAL,
  apple_pay:   SVG_APPLE_PAY,
  google_pay:  SVG_GOOGLE_PAY,
  klarna:      SVG_KLARNA,
  alma:        SVG_ALMA,
}

const LABELS: Record<PaymentMethod, string> = {
  visa:        'Visa',
  mastercard:  'Mastercard',
  amex:        'Amex',
  paypal:      'PayPal',
  apple_pay:   'Apple Pay',
  google_pay:  'Google Pay',
  klarna:      'Klarna',
  alma:        'Alma',
}

// ─── Rendu principal ──────────────────────────────────────────────────────────

export function renderTrustBadgesPayment(options: TrustBadgesOptions = {}): string {
  const {
    methods       = DEFAULT_METHODS,
    variant       = 'footer',
    accentColor   = '#6B7280',
    bg            = '#F9FAFB',
    border        = '#E5E7EB',
    fontFamily    = 'Inter,sans-serif',
  } = options

  // Filtre les méthodes invalides
  const validMethods = methods.filter((m): m is PaymentMethod => m in SVG_MAP)
  const effective = validMethods.length > 0 ? validMethods : DEFAULT_METHODS

  if (variant === 'compact') {
    // Compact : juste les icônes SVG en ligne, sans texte
    const badges = effective.map(m => `
      <div style="width:48px;height:30px;display:inline-flex;align-items:center;justify-content:center;border-radius:4px;overflow:hidden;border:1px solid ${border};" title="${LABELS[m]}">
        ${SVG_MAP[m]}
      </div>`).join('')

    return `
<div role="group" aria-label="Moyens de paiement acceptés"
  style="display:flex;flex-wrap:wrap;align-items:center;gap:6px;padding:12px 0;font-family:${fontFamily};">
  ${badges}
</div>`
  }

  if (variant === 'labeled') {
    // Labeled : icône + texte sous chaque
    const badges = effective.map(m => `
      <div style="display:flex;flex-direction:column;align-items:center;gap:4px;">
        <div style="width:52px;height:33px;border-radius:5px;overflow:hidden;border:1px solid ${border};box-shadow:0 1px 3px rgba(0,0,0,0.06);">
          ${SVG_MAP[m]}
        </div>
        <span style="font-size:10px;color:${accentColor};font-family:${fontFamily};">${LABELS[m]}</span>
      </div>`).join('')

    return `
<section style="background:${bg};padding:20px 24px;font-family:${fontFamily};">
  <div style="max-width:680px;margin:0 auto;">
    <p style="font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.1em;color:${accentColor};margin-bottom:14px;text-align:center;">
      Paiement 100% sécurisé
    </p>
    <div role="group" aria-label="Moyens de paiement acceptés"
      style="display:flex;flex-wrap:wrap;align-items:flex-start;justify-content:center;gap:12px;">
      ${badges}
    </div>
  </div>
</section>`
  }

  // footer (default) : bande horizontale discrète en bas de page
  const lockIcon = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="${accentColor}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>`

  const badges = effective.map(m => `
    <div style="width:44px;height:28px;display:inline-flex;align-items:center;justify-content:center;border-radius:4px;overflow:hidden;border:1px solid ${border};" title="${LABELS[m]}">
      ${SVG_MAP[m]}
    </div>`).join('')

  return `
<section style="background:${bg};border-top:1px solid ${border};padding:16px 24px;font-family:${fontFamily};">
  <div style="max-width:1100px;margin:0 auto;display:flex;flex-wrap:wrap;align-items:center;justify-content:center;gap:10px 20px;">
    <div style="display:flex;align-items:center;gap:6px;color:${accentColor};font-size:12px;font-weight:500;">
      ${lockIcon}
      <span>Paiement sécurisé</span>
    </div>
    <div role="group" aria-label="Moyens de paiement acceptés"
      style="display:flex;flex-wrap:wrap;align-items:center;gap:6px;">
      ${badges}
    </div>
  </div>
</section>`
}
