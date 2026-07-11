import { timingSafeEqual } from 'crypto'

// Extrait de 3 copies identiques (cf audit C-02, AUDIT_FABLE5.md) :
// api/email/preview, api/cron/preview-emails, api/cron/trial-emails.
//
// Comparaison timing-safe pour secrets internes (CRON_SECRET, etc). Le check
// de longueur avant timingSafeEqual évite un throw (Node exige des buffers de
// même taille) — mais fuite en théorie la longueur du secret via le timing du
// early-return. Acceptable ici : ces secrets sont générés côté serveur et
// jamais dérivés d'une valeur utilisateur devinable par essais successifs.
export function safeCompare(a: string, b: string): boolean {
  if (a.length !== b.length) return false
  return timingSafeEqual(Buffer.from(a), Buffer.from(b))
}
