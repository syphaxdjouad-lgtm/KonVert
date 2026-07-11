import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { supabaseAdmin as supabase } from '@/lib/supabase/admin'

// Protection admin — comparaison timing-safe pour éviter les timing attacks.
// On hash les deux secrets en SHA-256 avant compare : longueur identique,
// pas de leak de la longueur du secret (le `&& length === length` précédent
// court-circuitait après timingSafeEqual et faisait fuiter cette info).
function isAdmin(req: NextRequest) {
  const secret = req.headers.get('x-admin-secret')
  const expected = process.env.ADMIN_SECRET
  if (!secret || !expected) return false
  const a = crypto.createHash('sha256').update(secret).digest()
  const b = crypto.createHash('sha256').update(expected).digest()
  return crypto.timingSafeEqual(a, b)
}

export async function GET(req: NextRequest) {
  if (!isAdmin(req)) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

  const { data: waitlist } = await supabase
    .from('waitlist')
    .select('*')
    .order('created_at', { ascending: false })

  const { data: invitations } = await supabase
    .from('invitations')
    .select('*')
    .order('created_at', { ascending: false })

  return NextResponse.json({ waitlist: waitlist || [], invitations: invitations || [] })
}

export async function POST(req: NextRequest) {
  if (!isAdmin(req)) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

  let body: { email?: string; waitlist_id?: string }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'invalid_json' }, { status: 400 })
  }
  const { email, waitlist_id } = body
  if (!email) return NextResponse.json({ error: 'Email requis' }, { status: 400 })

  // Crée l'invitation
  const { data: invitation, error } = await supabase
    .from('invitations')
    .insert({ email: email.toLowerCase(), waitlist_id })
    .select()
    .single()

  if (error) {
    console.error('[/api/admin/waitlist] invitation error:', error.message)
    return NextResponse.json({ error: 'Erreur lors de la création de l\'invitation' }, { status: 500 })
  }

  // Met à jour le statut dans la waitlist
  if (waitlist_id) {
    await supabase
      .from('waitlist')
      .update({ status: 'invited', invited_at: new Date().toISOString() })
      .eq('id', waitlist_id)
  }

  const inviteUrl = `${process.env.NEXT_PUBLIC_APP_URL}/signup?token=${invitation.token}`
  return NextResponse.json({ success: true, token: invitation.token, url: inviteUrl })
}
