import crypto from 'crypto'
import type { NextRequest } from 'next/server'

// Extrait de 4 copies identiques (cf audit C-02, AUDIT_FABLE5.md) :
// api/admin/waitlist, api/scrape/diagnostic, api/health/deep,
// api/admin/stripe-preflight.
//
// Comparaison timing-safe pour éviter les timing attacks. On hash les deux
// secrets en SHA-256 avant compare : longueur identique, pas de leak de la
// longueur du secret via un éventuel court-circuit d'un `===` naïf.
export function isAdmin(req: NextRequest): boolean {
  const provided = req.headers.get('x-admin-secret')
  const expected = process.env.ADMIN_SECRET
  if (!provided || !expected) return false
  const a = crypto.createHash('sha256').update(provided).digest()
  const b = crypto.createHash('sha256').update(expected).digest()
  return crypto.timingSafeEqual(a, b)
}
