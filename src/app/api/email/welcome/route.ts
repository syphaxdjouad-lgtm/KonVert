import { NextRequest, NextResponse } from 'next/server'
import { sendEmail } from '@/lib/email'
import { emailWelcome } from '@/lib/email/templates'

export async function POST(req: NextRequest) {
  // Protection : uniquement appelable en interne
  const internalSecret = req.headers.get('x-internal-secret')
  if (internalSecret !== process.env.CRON_SECRET) {
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
    // Ne pas bloquer le signup si l'email échoue
    console.error('[email/welcome]', err)
    return NextResponse.json({ sent: false }, { status: 200 })
  }
}
