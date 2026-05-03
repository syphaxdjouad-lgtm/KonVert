import { NextRequest, NextResponse } from 'next/server'
import { timingSafeEqual } from 'crypto'
import { createClient } from '@supabase/supabase-js'
import { sendEmail } from '@/lib/email'
import {
  emailPreviewDay1,
  emailPreviewDay3,
  emailPreviewDay5,
  emailPreviewDay7,
} from '@/lib/email/preview-templates'

// Jours de la séquence preview (J+0 est envoyé immédiatement à la génération)
const PREVIEW_DAYS = [1, 3, 5, 7] as const
type PreviewDay = typeof PREVIEW_DAYS[number]

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

function getEmailForDay(
  day: PreviewDay,
  name: string,
  previewUrl: string,
  productTitle: string
) {
  switch (day) {
    case 1: return emailPreviewDay1(name, previewUrl, productTitle)
    case 3: return emailPreviewDay3(name, previewUrl, productTitle)
    case 5: return emailPreviewDay5(name, previewUrl)
    case 7: return emailPreviewDay7(name, previewUrl, productTitle)
  }
}

function safeCompare(a: string, b: string): boolean {
  if (a.length !== b.length) return false
  return timingSafeEqual(Buffer.from(a), Buffer.from(b))
}

function isAuthorized(req: NextRequest): boolean {
  const cronSecret = process.env.CRON_SECRET
  if (!cronSecret) return false
  const header = req.headers.get('authorization') ?? ''
  return safeCompare(header, `Bearer ${cronSecret}`)
}

export async function GET(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  }

  const now = new Date()
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://konvert.app'
  let sent = 0
  let errors = 0
  let skipped = 0

  // Récupère toutes les previews actives non converties
  const { data: previews, error } = await supabaseAdmin
    .from('public_previews')
    .select('id, email, name, product_title, emails_sent, created_at, expires_at, converted')
    .eq('converted', false)
    .gt('expires_at', now.toISOString())
    .limit(500)

  if (error) {
    console.error('[cron/preview-emails] Supabase error:', error.message)
    return NextResponse.json({ error: 'Erreur Supabase' }, { status: 500 })
  }

  for (const preview of previews ?? []) {
    if (!preview.email || !preview.created_at) { skipped++; continue }

    const createdAt = new Date(preview.created_at)
    const daysPassed = Math.floor((now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24))
    const emailsSent: number[] = preview.emails_sent ?? []

    // Sentinel -1 : utilisateur désinscrit via /unsubscribe → on n'envoie plus rien.
    // Aligne le comportement sur cron/trial-emails (même convention RGPD).
    if (emailsSent.includes(-1)) { skipped++; continue }

    // Trouver quel email envoyer aujourd'hui
    const dayToSend = PREVIEW_DAYS.find(
      (d) => d <= daysPassed && !emailsSent.includes(d)
    )

    if (!dayToSend) { skipped++; continue }

    try {
      const name = preview.name || preview.email.split('@')[0]
      const previewUrl = `${appUrl}/preview/${preview.id}`
      const { subject, html } = getEmailForDay(dayToSend as PreviewDay, name, previewUrl, preview.product_title)

      // Marquer AVANT d'envoyer pour éviter les doublons
      const { error: updateErr } = await supabaseAdmin
        .from('public_previews')
        .update({ emails_sent: [...emailsSent, dayToSend] })
        .eq('id', preview.id)

      if (updateErr) throw updateErr

      await sendEmail({
        to: preview.email,
        subject,
        html,
        from: 'KONVERT <hello@konvert.app>',
      })

      sent++
    } catch (err) {
      console.error(`[cron/preview-emails] Erreur preview ${preview.id}:`, err)
      errors++
    }
  }

  // Nettoyage des previews expirées (suppression douce — optionnel)
  // On laisse la data en base pour les stats

  return NextResponse.json({
    sent,
    errors,
    skipped,
    checked: previews?.length ?? 0,
  })
}
