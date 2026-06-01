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

  // Autorisé si Bearer token valide dans Authorization header.
  // Le signup client passe son access_token fraîchement créé ici car les
  // cookies Supabase ne sont pas encore propagés au moment du fetch post-signup.
  const authHeader = req.headers.get('authorization') || ''
  if (authHeader.startsWith('Bearer ')) {
    const token = authHeader.slice(7)
    if (token) {
      try {
        const supabase = createServerClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
          { cookies: { getAll: () => [], setAll: () => {} } }
        )
        const { data: { user } } = await supabase.auth.getUser(token)
        if (user) return true
      } catch {
        // token invalide → continue vers cookie check
      }
    }
  }

  // Autorisé si session Supabase valide via cookies (autres contextes)
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
    const { email, name: rawName } = await req.json()
    if (!email) {
      return NextResponse.json({ error: 'email requis' }, { status: 400 })
    }
    // name est optionnel — fallback sur la partie locale de l'email pour
    // ne pas bloquer le signup quand le champ prénom est vide
    const name = rawName || email.split('@')[0]

    const { subject, html } = emailWelcome(name)
    await sendEmail({ to: email, subject, html })

    return NextResponse.json({ sent: true })
  } catch (err) {
    console.error('[email/welcome]', err)
    return NextResponse.json({ sent: false, error: 'Email send failed' }, { status: 500 })
  }
}
