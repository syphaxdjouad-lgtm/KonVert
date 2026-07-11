import { NextRequest, NextResponse } from 'next/server'
import * as Sentry from '@sentry/nextjs'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { rateLimitAsync } from '@/lib/security/ratelimit'
import { sendEmail } from '@/lib/email'
import { escapeHtmlText } from '@/lib/security/sanitize'

const TEAM_EMAIL = process.env.CONTACT_TEAM_EMAIL || 'hello@konvertpilot.com'

export async function POST(req: NextRequest) {
  try {
    // Rate limit (3 messages / 5 min / IP). Endpoint public sans Turnstile —
    // sans throttle, J0 ProductHunt = vague de bots qui inondent
    // contact_messages + génèrent du bruit Sentry.
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
      || req.headers.get('x-real-ip')
      || 'unknown'
    const rl = await rateLimitAsync(`contact:${ip}`, 3, 300_000)
    if (!rl.allowed) {
      const retryAfter = Math.ceil(rl.retryAfterMs / 1000)
      return NextResponse.json(
        { error: 'Trop de messages envoyés. Réessaie plus tard.' },
        { status: 429, headers: { 'Retry-After': String(retryAfter) } }
      )
    }

    const { name, email, subject, message } = await req.json()

    if (!name || !email || !subject || !message) {
      return NextResponse.json({ error: 'Tous les champs sont requis' }, { status: 400 })
    }

    // Validation email basique
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Email invalide' }, { status: 400 })
    }

    // Limiter la taille des champs
    if (name.length > 200 || email.length > 200 || subject.length > 200 || message.length > 5000) {
      return NextResponse.json({ error: 'Champ trop long' }, { status: 400 })
    }

    const trimmedName    = name.trim()
    const trimmedEmail   = email.trim().toLowerCase()
    const trimmedSubject = subject.trim()
    const trimmedMessage = message.trim()

    // Stocker en DB
    const { error } = await supabaseAdmin.from('contact_messages').insert({
      name: trimmedName,
      email: trimmedEmail,
      subject: trimmedSubject,
      message: trimmedMessage,
    })

    if (error) {
      // L'email est PII — on ne le mettait PAS dans Sentry direct (scrubber le
      // masque), mais un `console.log` brut allait dans Vercel logs en clair
      // (audit Explore + Sasori P0-9). On capture l'event Sentry SANS le PII
      // brut (le scrubber ferait le job côté Sentry mais autant être propre
      // côté code aussi : on log juste un hash de l'email pour dédup analytics).
      console.error('[contact] DB insert error:', error.message)
      Sentry.captureMessage('[contact] DB insert failed', {
        level: 'error',
        extra: {
          domain: trimmedEmail.split('@')[1] ?? 'unknown',
          subject_len: trimmedSubject.length,
          message_len: trimmedMessage.length,
        },
      })
      // Le message n'a pas été persisté — on ne peut pas garantir qu'il sera
      // traité (SEC-05). On renvoie une vraie erreur plutôt qu'un faux ok:true.
      return NextResponse.json(
        { error: 'Erreur lors de l\'envoi. Réessaie ou écris directement à hello@konvertpilot.com.' },
        { status: 500 }
      )
    }

    // Notifier l'équipe par email — avant ça, seule la table contact_messages
    // recevait la demande (personne n'était notifié en temps réel, cf SEC-05).
    // Best-effort : un échec Resend ne doit pas faire échouer la requête
    // puisque le message est déjà stocké en DB.
    try {
      await sendEmail({
        to: TEAM_EMAIL,
        subject: `[Contact] ${trimmedSubject}`,
        html: `
          <p><strong>Nom :</strong> ${escapeHtmlText(trimmedName)}</p>
          <p><strong>Email :</strong> ${escapeHtmlText(trimmedEmail)}</p>
          <p><strong>Sujet :</strong> ${escapeHtmlText(trimmedSubject)}</p>
          <p><strong>Message :</strong></p>
          <p>${escapeHtmlText(trimmedMessage).replace(/\n/g, '<br>')}</p>
        `,
      })
    } catch (emailErr) {
      console.error('[contact] team notification email failed:', emailErr)
      Sentry.captureMessage('[contact] team notification email failed', { level: 'warning' })
    }

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
