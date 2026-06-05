/**
 * renderQuantitySelector — bloc HTML + JS inline pour sélecteur quantité +/–
 *
 * Génère un widget autonome sans dépendance externe. Le JS est inline car les
 * pages générées sont des HTML statiques servies sans framework React.
 *
 * Props (via QuantitySelectorOptions) :
 *   - value      : valeur initiale (défaut 1)
 *   - min        : min (défaut 1)
 *   - max        : max (défaut 99)
 *   - disabled   : rend le widget inactif
 *   - size       : 'compact' (40px) | 'default' (48px) | 'large' (56px)
 *   - accentColor: couleur boutons (reprend l'accent du template)
 *   - id         : identifiant unique pour éviter les conflits si rendu 2x
 *
 * A11y : label visible, aria-label +/–, keyboard ArrowUp/Down,
 *        focus visible, role spinbutton.
 *
 * Integration : appelé dans renderTrustBadgesPayment, hero buy-box des
 * templates etec-*, et StickyAddToCartMobile.
 */

export type QuantitySize = 'compact' | 'default' | 'large'

export interface QuantitySelectorOptions {
  value?:       number
  min?:         number
  max?:         number
  disabled?:    boolean
  size?:        QuantitySize
  accentColor?: string
  textColor?:   string
  bgColor?:     string
  borderColor?: string
  fontFamily?:  string
  /** ID unique (pour éviter conflits si le composant est rendu plusieurs fois) */
  id?:          string
  /** Label visible au-dessus (ex: "Quantité"). Vide = pas de label. */
  label?:       string
}

const HEIGHT_MAP: Record<QuantitySize, string> = {
  compact: '40px',
  default: '48px',
  large:   '56px',
}

const FONT_SIZE_MAP: Record<QuantitySize, string> = {
  compact: '14px',
  default: '16px',
  large:   '18px',
}

const BTN_WIDTH_MAP: Record<QuantitySize, string> = {
  compact: '40px',
  default: '48px',
  large:   '56px',
}

const INPUT_WIDTH_MAP: Record<QuantitySize, string> = {
  compact: '44px',
  default: '52px',
  large:   '60px',
}

export function renderQuantitySelector(options: QuantitySelectorOptions = {}): string {
  const {
    value       = 1,
    min         = 1,
    max         = 99,
    disabled    = false,
    size        = 'default',
    accentColor = '#1A1A1A',
    textColor   = '#1A1A1A',
    bgColor     = '#FFFFFF',
    borderColor = '#D1D5DB',
    fontFamily  = 'Inter,sans-serif',
    id          = 'qty-sel',
    label       = '',
  } = options

  const h  = HEIGHT_MAP[size]
  const fs = FONT_SIZE_MAP[size]
  const bw = BTN_WIDTH_MAP[size]
  const iw = INPUT_WIDTH_MAP[size]

  const disabledAttr  = disabled ? ' disabled' : ''
  const disabledStyle = disabled ? 'opacity:0.45;pointer-events:none;' : ''

  const labelHtml = label
    ? `<label for="${id}-input" style="display:block;font-size:12px;font-weight:600;color:${textColor};font-family:${fontFamily};margin-bottom:6px;text-transform:uppercase;letter-spacing:0.07em;">${label}</label>`
    : `<label for="${id}-input" style="position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap;">Quantité</label>`

  // Focus visible ring injecté via <style>
  const styleTag = `<style>
    #${id}-dec:focus-visible,
    #${id}-inc:focus-visible { outline: 2px solid ${accentColor}; outline-offset: 2px; }
    #${id}-input:focus-visible { outline: 2px solid ${accentColor}; outline-offset: 1px; }
    @media (prefers-reduced-motion: reduce) {
      #${id}-dec, #${id}-inc { transition: none !important; }
    }
  </style>`

  // Script inline — vanilla JS, IIFE pour isolation du scope
  const script = `<script>
(function(){
  var id = '${id}';
  var min = ${min};
  var max = ${max};
  var input = document.getElementById(id + '-input');
  var dec   = document.getElementById(id + '-dec');
  var inc   = document.getElementById(id + '-inc');
  if (!input || !dec || !inc) return;

  function clamp(v) { return Math.min(max, Math.max(min, v)); }

  function update(val) {
    input.value = clamp(val);
    dec.disabled = parseInt(input.value) <= min;
    inc.disabled = parseInt(input.value) >= max;
    dec.setAttribute('aria-disabled', String(parseInt(input.value) <= min));
    inc.setAttribute('aria-disabled', String(parseInt(input.value) >= max));
    input.dispatchEvent(new CustomEvent('qty:change', { bubbles: true, detail: { value: parseInt(input.value) } }));
  }

  dec.addEventListener('click', function() { update(parseInt(input.value) - 1); });
  inc.addEventListener('click', function() { update(parseInt(input.value) + 1); });

  input.addEventListener('change', function() {
    var v = parseInt(this.value);
    if (isNaN(v)) v = min;
    update(v);
  });

  input.addEventListener('keydown', function(e) {
    if (e.key === 'ArrowUp')   { e.preventDefault(); update(parseInt(input.value) + 1); }
    if (e.key === 'ArrowDown') { e.preventDefault(); update(parseInt(input.value) - 1); }
  });

  // Init — set correct disabled state
  update(parseInt(input.value) || min);
})();
<\/script>`

  return `${styleTag}
<div style="position:relative;${disabledStyle}font-family:${fontFamily};">
  ${labelHtml}
  <div role="group" aria-label="Sélecteur de quantité"
    style="display:inline-flex;align-items:center;height:${h};border:1px solid ${borderColor};border-radius:8px;overflow:hidden;background:${bgColor};">

    <button
      id="${id}-dec"
      type="button"
      aria-label="Diminuer la quantité"
      ${value <= min ? 'disabled' : ''}
      ${disabledAttr}
      style="width:${bw};height:100%;background:none;border:none;border-right:1px solid ${borderColor};cursor:pointer;display:flex;align-items:center;justify-content:center;color:${textColor};font-size:${fs};font-weight:500;transition:background .15s;flex-shrink:0;"
      onmouseenter="if(!this.disabled)this.style.background='rgba(0,0,0,0.04)'"
      onmouseleave="this.style.background='none'"
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" aria-hidden="true">
        <line x1="5" y1="12" x2="19" y2="12"/>
      </svg>
    </button>

    <input
      id="${id}-input"
      type="number"
      inputmode="numeric"
      role="spinbutton"
      aria-valuenow="${value}"
      aria-valuemin="${min}"
      aria-valuemax="${max}"
      aria-label="Quantité"
      value="${value}"
      min="${min}"
      max="${max}"
      ${disabledAttr}
      style="width:${iw};height:100%;border:none;text-align:center;font-size:${fs};font-weight:600;color:${textColor};background:${bgColor};font-family:${fontFamily};-moz-appearance:textfield;"
    >

    <button
      id="${id}-inc"
      type="button"
      aria-label="Augmenter la quantité"
      ${value >= max ? 'disabled' : ''}
      ${disabledAttr}
      style="width:${bw};height:100%;background:none;border:none;border-left:1px solid ${borderColor};cursor:pointer;display:flex;align-items:center;justify-content:center;color:${textColor};font-size:${fs};font-weight:500;transition:background .15s;flex-shrink:0;"
      onmouseenter="if(!this.disabled)this.style.background='rgba(0,0,0,0.04)'"
      onmouseleave="this.style.background='none'"
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" aria-hidden="true">
        <line x1="12" y1="5" x2="12" y2="19"/>
        <line x1="5" y1="12" x2="19" y2="12"/>
      </svg>
    </button>
  </div>
</div>
${script}`
}
