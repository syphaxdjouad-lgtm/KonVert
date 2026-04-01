import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get('token')
  if (!token) return NextResponse.json({ valid: false })

  const { data } = await supabase
    .from('invitations')
    .select('id, email, used, expires_at')
    .eq('token', token)
    .single()

  if (!data) return NextResponse.json({ valid: false })
  if (data.used) return NextResponse.json({ valid: false, reason: 'used' })
  if (new Date(data.expires_at) < new Date()) return NextResponse.json({ valid: false, reason: 'expired' })

  return NextResponse.json({ valid: true, email: data.email })
}

export async function POST(req: NextRequest) {
  const { token } = await req.json()
  if (!token) return NextResponse.json({ error: 'Token manquant' }, { status: 400 })

  const { error } = await supabase
    .from('invitations')
    .update({ used: true })
    .eq('token', token)
    .eq('used', false)

  if (error) return NextResponse.json({ error: 'Token invalide' }, { status: 400 })
  return NextResponse.json({ success: true })
}
