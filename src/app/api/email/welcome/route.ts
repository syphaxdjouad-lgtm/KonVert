import { NextRequest, NextResponse } from 'next/server'
import { timingSafeEqual } from 'crypto'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { sendEmail } from '@/lib/email'
import { emailWelcome } from '@/lib/email/templates'

function safeCompare(a: string, b: string): boolean {
  if (a.length !== b.length) return false
  return timingSafeEqual(Buffer.from(a), Buffer.from(b))
}

async function isAuthorized(req: NextRequest): Promise<boolean> {
  // Autorisé si CRON_SECRET valide (appels internes serveur-à-serveur)
  const internalSecret = req.headers.get('x-internal-secret') || ''
  const cronSecret = process.env.CRON_SECRET || ''
  if (cronSecret && safeCompare(internalSecret, cronSecret)) return true

  // Autorisé si session Supabase valide (appel depuis signup côté client)
  try {
    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { cookies: { getAll: () => cookieStore.getAll(), setAll: () => {} } }
    )
    const { data: { user } } = await supabase.auth.getUser()
    return !!user
  } catch {
    return false
  }
}

export async function POST(req: NextRequest) {
  if (!(await isAuthorized(req))) {
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
    console.error('[email/welcome]', err)
    return NextResponse.json({ sent: false, error: 'Email send failed' }, { status: 500 })
  }
}
