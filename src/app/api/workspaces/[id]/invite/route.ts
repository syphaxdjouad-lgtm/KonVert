import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createClient as createAdmin } from '@supabase/supabase-js'

const supabaseAdmin = createAdmin(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// POST /api/workspaces/[id]/invite
// Body: { email, role }
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id: workspaceId } = await params

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })

  // Vérifier que l'utilisateur est bien le owner
  const { data: workspace } = await supabase
    .from('workspaces')
    .select('id, name, owner_id')
    .eq('id', workspaceId)
    .eq('owner_id', user.id)
    .single()

  if (!workspace) return NextResponse.json({ error: 'Workspace introuvable' }, { status: 404 })

  const { email, role = 'viewer' } = await req.json()
  if (!email || typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: 'Email invalide' }, { status: 400 })
  }

  const allowedRoles = ['viewer', 'editor', 'admin']
  if (!allowedRoles.includes(role)) {
    return NextResponse.json({ error: 'Rôle invalide' }, { status: 400 })
  }

  // Email normalisé pour matcher la policy RLS lower(email).
  const normalizedEmail = email.trim().toLowerCase()

  const { data: member, error } = await supabaseAdmin
    .from('workspace_members')
    .upsert(
      { workspace_id: workspaceId, email: normalizedEmail, role, status: 'pending' },
      { onConflict: 'workspace_id,email' }
    )
    .select()
    .single()

  if (error) {
    console.error('[invite POST]', error.message)
    return NextResponse.json({ error: 'Erreur lors de l\'invitation' }, { status: 500 })
  }

  // Envoyer l'email d'invitation via Supabase Auth
  try {
    await supabaseAdmin.auth.admin.inviteUserByEmail(normalizedEmail, {
      redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?workspace=${workspaceId}`,
      data: { workspace_name: workspace.name, role },
    })
  } catch (err) {
    // L'invitation DB est créée même si l'email échoue
    console.warn('[invite] Email send failed:', err)
  }

  return NextResponse.json({ data: member }, { status: 201 })
}

// GET /api/workspaces/[id]/invite — liste les membres
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id: workspaceId } = await params

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })

  // Vérifier que l'utilisateur est le owner du workspace avant de lister les membres
  const { data: workspace } = await supabase
    .from('workspaces')
    .select('id')
    .eq('id', workspaceId)
    .eq('owner_id', user.id)
    .maybeSingle()

  if (!workspace) return NextResponse.json({ error: 'Workspace introuvable' }, { status: 404 })

  const { data } = await supabase
    .from('workspace_members')
    .select('*')
    .eq('workspace_id', workspaceId)
    .order('invited_at', { ascending: false })

  return NextResponse.json({ data: data || [] })
}
