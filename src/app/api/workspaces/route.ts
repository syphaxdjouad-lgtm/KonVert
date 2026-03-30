import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// GET  /api/workspaces — liste les workspaces de l'utilisateur
export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })

  const { data, error } = await supabase
    .from('workspaces')
    .select(`
      *,
      pages:pages(count),
      stores:stores(count),
      members:workspace_members(count)
    `)
    .eq('owner_id', user.id)
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ data })
}

// POST /api/workspaces — créer un workspace
export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })

  // Vérifier plan Agency
  const { data: profile } = await supabase
    .from('users')
    .select('plan')
    .eq('id', user.id)
    .single()

  if (profile?.plan !== 'agency') {
    return NextResponse.json(
      { error: 'Le mode Agence est réservé au plan Agency — upgrade requis' },
      { status: 403 }
    )
  }

  const body = await req.json()
  const { name, client_name, client_email, brand_name, brand_color } = body

  if (!name) return NextResponse.json({ error: 'Nom du workspace requis' }, { status: 400 })

  const { data, error } = await supabase
    .from('workspaces')
    .insert({ owner_id: user.id, name, client_name, client_email, brand_name, brand_color })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ data }, { status: 201 })
}
