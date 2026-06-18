import type { V3PageData } from '@/types/v3'
import type { StyleTokens } from '@/lib/styles/types'

const DEFAULT_FAQ: Array<{ q: string; a: string }> = [
  { q: 'Combien de temps pour la livraison ?', a: '24 à 48h ouvrées en France.' },
  { q: 'Puis-je retourner le produit ?', a: 'Oui, sous 30 jours, retour gratuit.' },
]

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

export function renderFaq(data: V3PageData, tokens: StyleTokens): string {
  const items = data.copy.faq ?? DEFAULT_FAQ

  // Sprint 3 T4 — animation max-height CSS pure sur <details>
  // L'astuce : on anime .kvt-faq-answer avec max-height 0 → max-height 2000px
  // + grid-template-rows 0fr → 1fr pour que la transition soit douce sans JS.
  // La rotation 45° du + produit le × sans changer de caractère.
  // prefers-reduced-motion: reduce → transition:none (guard obligatoire).
  const faqStyles = `
<style>
  .kvt-faq-details { border-bottom:1px solid ${tokens.colors.border} }
  .kvt-faq-summary {
    cursor:pointer;
    font-family:${tokens.fonts.body};font-weight:600;
    color:${tokens.colors.text};font-size:17px;
    list-style:none;display:flex;justify-content:space-between;
    align-items:center;padding:24px 0;user-select:none
  }
  .kvt-faq-summary::-webkit-details-marker { display:none }
  .kvt-faq-icon {
    color:${tokens.colors.accent};font-size:24px;font-weight:300;
    line-height:1;flex-shrink:0;margin-left:16px;
    display:inline-block;
    transition:transform ${tokens.motion.durationShort} ${tokens.motion.easeSpring}
  }
  .kvt-faq-details[open] .kvt-faq-icon {
    transform:rotate(45deg)
  }
  .kvt-faq-body {
    display:grid;
    grid-template-rows:0fr;
    transition:grid-template-rows ${tokens.motion.durationShort} ${tokens.motion.easeSpring}
  }
  .kvt-faq-details[open] .kvt-faq-body {
    grid-template-rows:1fr
  }
  .kvt-faq-inner {
    overflow:hidden
  }
  .kvt-faq-inner p {
    margin:0;
    padding-bottom:24px;
    color:${tokens.colors.textMuted};
    line-height:1.6
  }
  @media (prefers-reduced-motion:reduce) {
    .kvt-faq-icon,
    .kvt-faq-body {
      transition:none
    }
  }
</style>`.trim()

  const list = items
    .map(
      (f) => `
    <details class="kvt-faq-details">
      <summary class="kvt-faq-summary">
        ${escapeHtml(f.q)}
        <span class="kvt-faq-icon" aria-hidden="true">+</span>
      </summary>
      <div class="kvt-faq-body">
        <div class="kvt-faq-inner">
          <p>${escapeHtml(f.a)}</p>
        </div>
      </div>
    </details>`,
    )
    .join('')

  return `
<section style="background:${tokens.colors.surface};padding:${tokens.spacing.section} 24px">
  ${faqStyles}
  <div style="max-width:720px;margin:0 auto">
    <h2 style="font-family:${tokens.fonts.heading};font-size:clamp(28px,3vw,40px);color:${tokens.colors.text};margin:0 0 24px;font-weight:400">Questions fréquentes</h2>
    ${list}
  </div>
</section>`.trim()
}
