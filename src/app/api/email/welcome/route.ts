import { NextRequest, NextResponse } from 'next/server'
import { timingSafeEqual } from 'crypto'
import { sendEmail } from '@/lib/email'
import { emailWelcome } from '@/lib/email/templates'

function safeCompare(a: string, b: string): boolean {
  if (a.length !== b.length) return false
  return timingSafeEqual(Buffer.from(a), Buffer.from(b))
}

export async function POST(req: NextRequest) {
  // Protection : uniquement appelable en interne
  const internalSecret = req.headers.get('x-internal-secret') || ''
  const cronSecret = process.env.CRON_SECRET || ''
  if (!cronSecret || !safeCompare(internalSecret, cronSecret)) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  }

  try {
    const { email, name } = await req.json()
    if (!email || !name) {
      return NextResponse.json({ error: 'email et name requis' }, { status: 400 })
    }

    const { subject, html } = emailWelcome(name)
    await sendEmail({ to: email, subject, html })

    return NextResponse.json({ sent: true })
  } catch (err) {
    // 500 pour Sentry — le caller (signup) est en fire-and-forget, donc le user
    // n'est pas bloqué. Mais on a besoin de remonter les pannes Resend.
    console.error('[email/welcome]', err)
    return NextResponse.json({ sent: false, error: 'Email send failed' }, { status: 500 })
  }
}
