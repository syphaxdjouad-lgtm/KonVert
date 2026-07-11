// Escape HTML standard pour interpolation dans du texte ou un attribut HTML.
// Extrait de 15+ copies quasi-identiques dans src/lib/sections-v3/*/render.tsx
// (cf audit C-02, AUDIT_FABLE5.md) — comportement conservé à l'identique
// (échappe & < > " dans cet ordre, & en premier pour ne pas double-encoder).
//
// Ne pas confondre avec escapeHtmlText (src/lib/security/sanitize.ts) qui
// échappe volontairement PAS le `&` pour préserver l'affichage de titres
// produit du type "Marshall & sons" côté scraper/génération IA.
export function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}
