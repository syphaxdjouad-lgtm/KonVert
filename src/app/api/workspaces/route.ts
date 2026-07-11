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

  if (error) {
    console.error('[/api/workspaces GET]', error.message)
    return NextResponse.json({ error: 'Erreur lors de la récupération des workspaces.' }, { status: 500 })
  }
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

  let body: {
    name?: string
    client_name?: string
    client_email?: string
    brand_name?: string
    brand_color?: string
  }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'invalid_json' }, { status: 400 })
  }
  const { name, client_name, client_email, brand_name, brand_color } = body

  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    return NextResponse.json({ error: 'Nom du workspace requis' }, { status: 400 })
  }

  // Longueur max sur les champs texte pour éviter la pollution DB
  if (name.length > 100 || (client_name && client_name.length > 100) || (brand_name && brand_name.length > 100)) {
    return NextResponse.json({ error: 'Champs trop longs (max 100 caractères)' }, { status: 400 })
  }

  // Validation email basique
  if (client_email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(client_email)) {
    return NextResponse.json({ error: 'Email client invalide' }, { status: 400 })
  }

  // Validation brand_color — uniquement hex ou rgb() pour éviter l'injection CSS/XSS
  if (brand_color && !/^#[0-9a-fA-F]{3,6}$/.test(brand_color) && !/^rgba?\(\s*\d+\s*,\s*\d+\s*,\s*\d+(\s*,\s*[\d.]+)?\s*\)$/.test(brand_color)) {
    return NextResponse.json({ error: 'Couleur invalide — utilise un format hex (#ffffff) ou rgb()' }, { status: 400 })
  }

  const { data, error } = await supabase
    .from('workspaces')
    .insert({ owner_id: user.id, name, client_name, client_email, brand_name, brand_color })
    .select()
    .single()

  if (error) {
    console.error('[/api/workspaces POST]', error.message)
    return NextResponse.json({ error: 'Erreur lors de la création du workspace.' }, { status: 500 })
  }
  return NextResponse.json({ data }, { status: 201 })
}
