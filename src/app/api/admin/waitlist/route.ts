import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// Protection admin basique par secret header
function isAdmin(req: NextRequest) {
  const secret = req.headers.get('x-admin-secret')
  return secret === (process.env.ADMIN_SECRET || 'konvert-admin-2026')
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

  const { email, waitlist_id } = await req.json()
  if (!email) return NextResponse.json({ error: 'Email requis' }, { status: 400 })

  // Crée l'invitation
  const { data: invitation, error } = await supabase
    .from('invitations')
    .insert({ email: email.toLowerCase(), waitlist_id })
    .select()
    .single()

  if (error) throw error

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
