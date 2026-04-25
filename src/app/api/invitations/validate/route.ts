import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// Format UUID — bloque le brute-force de tokens malformés.
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get('token')
  if (!token || !UUID_RE.test(token)) return NextResponse.json({ valid: false })

  const { data, error } = await supabase
    .from('invitations')
    .select('id, email, used, expires_at')
    .eq('token', token)
    .maybeSingle()

  if (error || !data) return NextResponse.json({ valid: false })
  if (data.used) return NextResponse.json({ valid: false, reason: 'used' })
  if (new Date(data.expires_at) < new Date()) return NextResponse.json({ valid: false, reason: 'expired' })

  return NextResponse.json({ valid: true, email: data.email })
}

// Marque l'invitation comme used — uniquement si un compte auth.users existe
// avec l'email de l'invitation (preuve que le signup a réussi).
// Sinon n'importe qui pouvait brûler un token leaké.
export async function POST(req: NextRequest) {
  const { token } = await req.json().catch(() => ({}))

  if (!token || typeof token !== 'string' || !UUID_RE.test(token)) {
    return NextResponse.json({ error: 'Token invalide' }, { status: 400 })
  }

  const { data: invitation } = await supabase
    .from('invitations')
    .select('id, email, used, expires_at')
    .eq('token', token)
    .maybeSingle()

  if (!invitation || invitation.used) {
    return NextResponse.json({ error: 'Token invalide' }, { status: 400 })
  }
  if (new Date(invitation.expires_at) < new Date()) {
    return NextResponse.json({ error: 'Token expiré' }, { status: 400 })
  }

  // Vérifier qu'un compte Supabase Auth existe avec l'email de l'invitation.
  // listUsers paginé — on filtre ensuite par email (case-insensitive).
  const target = invitation.email.toLowerCase()
  let userExists = false
  for (let page = 1; page <= 5 && !userExists; page++) {
    const { data, error } = await supabase.auth.admin.listUsers({ page, perPage: 200 })
    if (error || !data?.users?.length) break
    userExists = data.users.some(u => (u.email || '').toLowerCase() === target)
    if (data.users.length < 200) break
  }

  if (!userExists) {
    return NextResponse.json({ error: 'Compte introuvable' }, { status: 403 })
  }

  const { error } = await supabase
    .from('invitations')
    .update({ used: true })
    .eq('id', invitation.id)
    .eq('used', false)

  if (error) return NextResponse.json({ error: 'Token invalide' }, { status: 400 })
  return NextResponse.json({ success: true })
}
