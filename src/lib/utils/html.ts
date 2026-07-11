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

// Escape dédié aux valeurs interpolées dans un attribut HTML (ex: src="${url}").
// escapeHtml échappe déjà le `"` (suffisant pour un attribut délimité par des
// guillemets doubles), mais PAS l'apostrophe `'` — un template mal formé ou un
// attribut délimité par des guillemets simples resterait cassable. escapeAttr
// échappe donc en plus `'` pour couvrir les deux cas (cf audit SEC-03,
// AUDIT_FABLE5.md — src="${v.image}" interpolé sans échappement d'attribut).
export function escapeAttr(s: string): string {
  return escapeHtml(s).replace(/'/g, '&#39;')
}
