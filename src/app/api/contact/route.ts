import { NextRequest, NextResponse } from 'next/server'
import * as Sentry from '@sentry/nextjs'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { rateLimitAsync } from '@/lib/security/ratelimit'

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

    // Stocker en DB
    const { error } = await supabaseAdmin.from('contact_messages').insert({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      subject: subject.trim(),
      message: message.trim(),
    })

    if (error) {
      // L'email est PII — on ne le mettait PAS dans Sentry direct (scrubber le
      // masque), mais un `console.log` brut allait dans Vercel logs en clair
      // (audit Explore + Sasori P0-9). On capture l'event Sentry SANS le PII
      // brut (le scrubber ferait le job côté Sentry mais autant être propre
      // côté code aussi : on log juste un hash de l'email pour dédup analytics).
      console.error('[contact] DB insert error:', error.message)
      Sentry.captureMessage('[contact] DB insert failed — fallback log', {
        level: 'warning',
        extra: {
          domain: email.split('@')[1] ?? 'unknown',
          subject_len: subject.length,
          message_len: message.length,
        },
      })
    }

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
