import { NextRequest, NextResponse } from 'next/server'
import { sendEmail } from '@/lib/email'
import { emailWelcome } from '@/lib/email/templates'
import { rateLimitAsync } from '@/lib/security/ratelimit'

// Endpoint public — pas d'auth requise (envoi d'un seul email de bienvenue,
// aucune donnée sensible exposée). Protégé par rate-limit strict par IP
// (3 req/h) pour limiter l'abus du quota Resend. Le bearer token Supabase
// n'est pas fiable au moment du fetch post-signup (session pas encore hydratée
// côté serveur en mode "Confirm email" → 401 systématique).

export async function POST(req: NextRequest) {
  // Rate-limit : 3 welcome emails par IP par heure
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'
  const rl = await rateLimitAsync(`welcome:${ip}`, 3, 60 * 60 * 1000)
  if (!rl.allowed) {
    return NextResponse.json({ error: 'Trop de requêtes' }, { status: 429 })
  }

  try {
    const body = await req.json()
    const email: unknown = body?.email
    const rawName: unknown = body?.name

    if (typeof email !== 'string' || !email.includes('@')) {
      return NextResponse.json({ error: 'email invalide' }, { status: 400 })
    }

    // name est optionnel — fallback sur la partie locale de l'email
    const name = typeof rawName === 'string' && rawName.trim()
      ? rawName.trim()
      : email.split('@')[0]

    const { subject, html } = emailWelcome(name)
    await sendEmail({ to: email, subject, html })

    return NextResponse.json({ sent: true })
  } catch (err) {
    console.error('[email/welcome]', err)
    return NextResponse.json({ sent: false, error: 'Email send failed' }, { status: 500 })
  }
}
