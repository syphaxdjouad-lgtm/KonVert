import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin as supabase } from '@/lib/supabase/admin'
import { rateLimitAsync } from '@/lib/security/ratelimit'

export async function POST(req: NextRequest) {
  try {
    // Rate limit (5 inscriptions / 10 min / IP). Empêche un bot d'énumérer
    // des emails ou de spammer la waitlist J0.
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
      || req.headers.get('x-real-ip')
      || 'unknown'
    const rl = await rateLimitAsync(`waitlist:${ip}`, 5, 600_000)
    if (!rl.allowed) {
      const retryAfter = Math.ceil(rl.retryAfterMs / 1000)
      return NextResponse.json(
        { error: 'Trop de tentatives. Réessaie plus tard.' },
        { status: 429, headers: { 'Retry-After': String(retryAfter) } }
      )
    }

    const { email, name, context } = await req.json()
    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Email invalide' }, { status: 400 })
    }

    const { error } = await supabase
      .from('waitlist')
      .insert({ email: email.toLowerCase().trim(), name, context })

    // Email enumeration : on ne distingue pas en sortie un email déjà inscrit
    // d'un nouvel email. Le client reçoit le même 201 dans les deux cas, ce
    // qui empêche un attaquant de tester l'existence d'un email via la réponse.
    if (error && error.code !== '23505') {
      throw error
    }

    return NextResponse.json({ message: 'success' }, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
