import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { sendEmail } from '@/lib/email'
import { emailDay3, emailDay7, emailDay10, emailDay13, emailDay14 } from '@/lib/email/templates'

// Jours où on envoie un email de trial
const TRIAL_DAYS = [3, 7, 10, 13, 14] as const
type TrialDay = typeof TRIAL_DAYS[number]

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

function getEmailForDay(day: TrialDay, name: string) {
  switch (day) {
    case 3:  return emailDay3(name)
    case 7:  return emailDay7(name)
    case 10: return emailDay10(name)
    case 13: return emailDay13(name)
    case 14: return emailDay14(name)
  }
}

// Protection cron : vérifie le header Vercel
function isAuthorized(req: NextRequest) {
  const secret = req.headers.get('authorization')
  return secret === `Bearer ${process.env.CRON_SECRET}`
}

export async function GET(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  }

  const now = new Date()
  let sent = 0
  let errors = 0

  // Récupérer tous les users en trial (plan = null ou trial, pas encore abonnés)
  // On suppose que trial_started_at et trial_emails_sent existent dans la table users
  // SQL migration à lancer une fois dans Supabase:
  // ALTER TABLE users ADD COLUMN IF NOT EXISTS trial_started_at timestamptz DEFAULT now();
  // ALTER TABLE users ADD COLUMN IF NOT EXISTS trial_emails_sent integer[] DEFAULT '{}';
  const { data: users, error } = await supabaseAdmin
    .from('users')
    .select('id, email, name, trial_started_at, trial_emails_sent, plan')
    .not('trial_started_at', 'is', null)
    .in('plan', ['starter', null])  // pas encore payant ou sur plan starter trial
    .limit(500)

  if (error) {
    console.error('[cron/trial-emails] Supabase error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  for (const user of users ?? []) {
    if (!user.email || !user.trial_started_at) continue

    const trialStart = new Date(user.trial_started_at)
    const daysPassed = Math.floor((now.getTime() - trialStart.getTime()) / (1000 * 60 * 60 * 24))
    const emailsSent: number[] = user.trial_emails_sent ?? []

    // Trouver quel email doit être envoyé aujourd'hui
    const dayToSend = TRIAL_DAYS.find(
      (d) => d <= daysPassed && !emailsSent.includes(d)
    )
    if (!dayToSend) continue

    try {
      const name = user.name ?? user.email.split('@')[0]
      const { subject, html } = getEmailForDay(dayToSend as TrialDay, name)
      await sendEmail({ to: user.email, subject, html })

      // Marquer l'email comme envoyé
      await supabaseAdmin
        .from('users')
        .update({ trial_emails_sent: [...emailsSent, dayToSend] })
        .eq('id', user.id)

      sent++
    } catch (err) {
      console.error(`[cron/trial-emails] Erreur user ${user.id}:`, err)
      errors++
    }
  }

  return NextResponse.json({ sent, errors, checked: users?.length ?? 0 })
}
