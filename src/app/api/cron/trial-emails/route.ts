import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/admin'
import * as Sentry from '@sentry/nextjs'
import { sendEmail } from '@/lib/email'
import { emailDay1, emailDay3, emailDay7, emailDay10, emailDay12, emailDay13, emailDay14 } from '@/lib/email/templates'
import { safeCompare } from '@/lib/security/safe-compare'

// Vercel Pro = 60s, Hobby = 10s. Sans cette ligne, Vercel coupait le cron
// silencieusement à mi-batch (~10s) et les emails de la fin n'étaient jamais
// envoyés — sans alerte. 60s couvre 500 users à ~100ms par envoi.
export const maxDuration = 60
export const runtime = 'nodejs'

// Jours où on envoie un email de trial
const TRIAL_DAYS = [1, 3, 7, 10, 12, 13, 14] as const
type TrialDay = typeof TRIAL_DAYS[number]


function getEmailForDay(day: TrialDay, name: string) {
  switch (day) {
    case 1:  return emailDay1(name)
    case 3:  return emailDay3(name)
    case 7:  return emailDay7(name)
    case 10: return emailDay10(name)
    case 12: return emailDay12(name)
    case 13: return emailDay13(name)
    case 14: return emailDay14(name)
  }
}

// Protection cron : vérifie le header Vercel
function isAuthorized(req: NextRequest): boolean {
  const cronSecret = process.env.CRON_SECRET
  if (!cronSecret) return false  // variable non configurée → bloquer systématiquement
  const header = req.headers.get('authorization') ?? ''
  return safeCompare(header, `Bearer ${cronSecret}`)
}

export async function GET(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  }

  const now = new Date()
  let sent = 0
  let errors = 0

  // Récupérer tous les users en trial — UNIQUEMENT les non-payants.
  // Filtre 'free' / null : 'starter' est un plan PAYANT (39€/mois), il ne doit
  // PAS recevoir d'email "ton trial expire" — sinon spam des abonnés Starter.
  // SQL migration à lancer une fois dans Supabase:
  // ALTER TABLE users ADD COLUMN IF NOT EXISTS trial_started_at timestamptz DEFAULT now();
  // ALTER TABLE users ADD COLUMN IF NOT EXISTS trial_emails_sent integer[] DEFAULT '{}';
  const { data: users, error } = await supabaseAdmin
    .from('users')
    .select('id, email, name, trial_started_at, trial_emails_sent, plan')
    .not('trial_started_at', 'is', null)
    .or('plan.is.null,plan.eq.free')
    .limit(500)

  if (error) {
    console.error('[cron/trial-emails] Supabase error:', error.message)
    Sentry.captureException(error, { tags: { cron: 'trial-emails', phase: 'fetch' } })
    return NextResponse.json({ error: 'Erreur lors de la récupération des utilisateurs en trial.' }, { status: 500 })
  }

  for (const user of users ?? []) {
    if (!user.email || !user.trial_started_at) continue

    const trialStart = new Date(user.trial_started_at)
    const daysPassed = Math.floor((now.getTime() - trialStart.getTime()) / (1000 * 60 * 60 * 24))
    const emailsSent: number[] = user.trial_emails_sent ?? []

    // -1 = désabonné via /unsubscribe
    if (emailsSent.includes(-1)) continue

    // Trouver quel email doit être envoyé aujourd'hui
    const dayToSend = TRIAL_DAYS.find(
      (d) => d <= daysPassed && !emailsSent.includes(d)
    )
    if (!dayToSend) continue

    try {
      const name = user.name ?? user.email.split('@')[0]
      const { subject, html } = getEmailForDay(dayToSend as TrialDay, name)

      // Marquer AVANT d'envoyer — évite les doublons si l'update échoue après envoi
      const { error: updateErr } = await supabaseAdmin
        .from('users')
        .update({ trial_emails_sent: [...emailsSent, dayToSend] })
        .eq('id', user.id)

      if (updateErr) throw updateErr

      await sendEmail({ to: user.email, subject, html })
      sent++
    } catch (err) {
      console.error(`[cron/trial-emails] Erreur user ${user.id}:`, err)
      Sentry.captureException(err, {
        tags: { cron: 'trial-emails', phase: 'send' },
        extra: { user_id: user.id, day: dayToSend },
      })
      errors++
    }
  }

  // Si > 5% du batch a échoué, on remonte un message Sentry pour qu'on soit alerté.
  // Au-dessous de ce seuil, c'est probablement des bounces individuels (email
  // périmé, Resend rate limit transitoire) — pas un incident infra.
  if (errors > 0 && errors / Math.max(1, users?.length ?? 1) > 0.05) {
    Sentry.captureMessage('[cron/trial-emails] taux d\'erreur élevé', {
      level: 'error',
      extra: { sent, errors, checked: users?.length ?? 0 },
    })
  }

  return NextResponse.json({ sent, errors, checked: users?.length ?? 0 })
}
