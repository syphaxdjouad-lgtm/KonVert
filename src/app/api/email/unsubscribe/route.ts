import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { verifyUnsubscribeToken } from '@/lib/email/unsubscribe-token'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function unsubscribeEmail(email: string) {
  const normalizedEmail = email.toLowerCase().trim()

  // Sentinelle -1 sur emails_sent : c'est la convention que cron/preview-emails
  // checke (route.ts:81). On NE TOUCHE PAS au champ converted — il sert à
  // tracker les vraies conversions (signup post-preview), pas les désabonnements.
  // Mettre converted=true ici (ancien comportement) faussait les futures stats
  // de taux de conversion essai → signup.
  await supabaseAdmin
    .from('public_previews')
    .update({ emails_sent: [-1] })
    .eq('email', normalizedEmail)

  // Sentinelle -1 sur users.trial_emails_sent pour la séquence trial post-signup.
  // Le row peut ne pas exister si l'user n'a jamais signup — UPDATE no-op silencieux,
  // c'est OK : le check anti-resubscribe ci-dessous se base sur public_previews.
  await supabaseAdmin
    .from('users')
    .update({ trial_emails_sent: [-1] })
    .eq('email', normalizedEmail)

  return normalizedEmail
}

export async function POST(req: NextRequest) {
  try {
    const { email, token } = await req.json()
    if (!email || typeof email !== 'string' || !token || typeof token !== 'string') {
      return NextResponse.json({ error: 'Email et token requis' }, { status: 400 })
    }
    if (!verifyUnsubscribeToken(email, token)) {
      return NextResponse.json({ error: 'Token invalide' }, { status: 403 })
    }
    await unsubscribeEmail(email)
    return NextResponse.json({ unsubscribed: true })
  } catch (err) {
    console.error('[email/unsubscribe]', err)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

// One-click unsubscribe via lien email (RFC 8058 List-Unsubscribe-Post compatible).
// Le token signé HMAC permet de désabonner directement sans formulaire.
export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url)
    const email = url.searchParams.get('email')
    const token = url.searchParams.get('token')
    if (!email || !token) {
      return NextResponse.json({ error: 'Paramètres manquants' }, { status: 400 })
    }
    if (!verifyUnsubscribeToken(email, token)) {
      return NextResponse.json({ error: 'Token invalide' }, { status: 403 })
    }
    await unsubscribeEmail(email)
    const appUrl = (process.env.NEXT_PUBLIC_APP_URL || 'https://konvert.app').trim()
    return NextResponse.redirect(`${appUrl}/unsubscribe?ok=1`, { status: 303 })
  } catch (err) {
    console.error('[email/unsubscribe GET]', err)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
