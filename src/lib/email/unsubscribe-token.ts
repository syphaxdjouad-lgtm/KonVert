import { createHmac, timingSafeEqual } from 'node:crypto'

const SECRET = process.env.ENCRYPTION_KEY || ''

function sign(email: string): string {
  return createHmac('sha256', SECRET)
    .update(email.toLowerCase().trim())
    .digest('base64url')
}

export function generateUnsubscribeToken(email: string): string {
  if (!SECRET) throw new Error('ENCRYPTION_KEY missing — cannot sign unsubscribe token')
  return sign(email)
}

export function verifyUnsubscribeToken(email: string, token: string): boolean {
  if (!SECRET || !email || !token) return false
  try {
    const expected = sign(email)
    const a = Buffer.from(expected)
    const b = Buffer.from(token)
    if (a.length !== b.length) return false
    return timingSafeEqual(a, b)
  } catch {
    return false
  }
}
