import { NextRequest, NextResponse } from 'next/server'
import { createClient as createServerClient } from '@/lib/supabase/server'
import { createClient } from '@supabase/supabase-js'

// Service role — écriture tracking sans auth utilisateur
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

/* ─────────────────────────────────────────────────────────────────
   HASH visitor_id → variante A ou B (déterministe)
───────────────────────────────────────────────────────────────── */
function assignVariant(visitorId: string): 'A' | 'B' {
  let hash = 0
  for (let i = 0; i < visitorId.length; i++) {
    hash = ((hash << 5) - hash) + visitorId.charCodeAt(i)
    hash |= 0
  }
  return Math.abs(hash) % 2 === 0 ? 'A' : 'B'
}

/* ─────────────────────────────────────────────────────────────────
   GET /api/ab?page_id=xxx&visitor_id=yyy
   Retourne : { variant: 'A'|'B', variant_id: string, test_id: string }
   Utilisé par la page publique pour savoir quelle version servir.
───────────────────────────────────────────────────────────────── */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const page_id    = searchParams.get('page_id')
  const visitor_id = searchParams.get('visitor_id')

  if (!page_id || !visitor_id) {
    return NextResponse.json({ error: 'page_id et visitor_id requis' }, { status: 400 })
  }

  // Chercher un test actif pour cette page (uniquement les tests en cours, pas en pause)
  const { data: test } = await supabaseAdmin
    .from('ab_tests')
    .select('id, status')
    .eq('page_id', page_id)
    .eq('status', 'running')
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  if (!test) {
    return NextResponse.json({ error: 'Aucun test actif' }, { status: 404 })
  }

  const variantLetter = assignVariant(visitor_id)

  const { data: variant } = await supabaseAdmin
    .from('ab_variants')
    .select('id, variant')
    .eq('ab_test_id', test.id)
    .eq('variant', variantLetter)
    .maybeSingle()

  if (!variant) {
    return NextResponse.json({ error: 'Variante introuvable' }, { status: 404 })
  }

  return NextResponse.json({
    variant: variantLetter,
    variant_id: variant.id,
    test_id: test.id,
  })
}

/* ─────────────────────────────────────────────────────────────────
   POST /api/ab
   actions :
     log     → { variant_id, visitor_id, event_type }
     create  → { page_id, variant_b_content }        (auth)
     winner  → { test_id, winner }                   (auth)
     status  → { test_id, status }                   (auth)
───────────────────────────────────────────────────────────────── */
export async function POST(req: NextRequest) {
  const body = await req.json()
  const { action } = body

  /* ── Log event (public) ───────────────────────────────────────── */
  if (action === 'log') {
    const { variant_id, visitor_id, event_type } = body

    if (!variant_id || !visitor_id || !event_type) {
      return NextResponse.json({ error: 'Champs manquants' }, { status: 400 })
    }

    const allowed: string[] = ['view', 'click', 'conversion']
    if (!allowed.includes(event_type)) {
      return NextResponse.json({ error: 'event_type invalide' }, { status: 400 })
    }

    // Éviter les doublons : un visiteur = un event view par variant
    if (event_type === 'view') {
      const { data: existing } = await supabaseAdmin
        .from('ab_events')
        .select('id')
        .eq('variant_id', variant_id)
        .eq('visitor_id', visitor_id)
        .eq('event_type', 'view')
        .maybeSingle()

      if (existing) {
        return NextResponse.json({ ok: true, skipped: true })
      }
    }

    await supabaseAdmin.from('ab_events').insert({ variant_id, visitor_id, event_type })

    // Incrémenter le compteur dénormalisé
    const rpcMap: Record<string, string> = {
      view:       'increment_ab_vues',
      click:      'increment_ab_clics',
      conversion: 'increment_ab_conversions',
    }
    await supabaseAdmin.rpc(rpcMap[event_type], { p_variant_id: variant_id })

    return NextResponse.json({ ok: true })
  }

  /* ── Actions authentifiées ─────────────────────────────────────── */
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })

  /* ── Créer un test A/B ─────────────────────────────────────────── */
  if (action === 'create') {
    const { page_id, variant_b_content } = body

    if (!page_id) {
      return NextResponse.json({ error: 'page_id requis' }, { status: 400 })
    }

    // Vérifier que la page appartient à l'utilisateur
    const { data: page } = await supabase
      .from('pages')
      .select('id, html_content, json_content')
      .eq('id', page_id)
      .eq('user_id', user.id)
      .maybeSingle()

    if (!page) {
      return NextResponse.json({ error: 'Page introuvable' }, { status: 404 })
    }

    // Vérifier qu'il n'y a pas déjà un test actif
    const { data: existing } = await supabase
      .from('ab_tests')
      .select('id')
      .eq('page_id', page_id)
      .in('status', ['running', 'paused'])
      .maybeSingle()

    if (existing) {
      return NextResponse.json({ error: 'Un test est déjà en cours pour cette page' }, { status: 409 })
    }

    // Créer le test
    const { data: test, error: testErr } = await supabaseAdmin
      .from('ab_tests')
      .insert({ page_id, status: 'running' })
      .select()
      .single()

    if (testErr || !test) {
      return NextResponse.json({ error: 'Erreur création test' }, { status: 500 })
    }

    // Créer variante A (contenu actuel de la page)
    await supabaseAdmin.from('ab_variants').insert({
      ab_test_id:   test.id,
      variant:      'A',
      page_content: { html: page.html_content, json: page.json_content },
    })

    // Créer variante B (contenu fourni ou copie de A)
    await supabaseAdmin.from('ab_variants').insert({
      ab_test_id:   test.id,
      variant:      'B',
      page_content: variant_b_content ?? { html: page.html_content, json: page.json_content },
    })

    return NextResponse.json({ ok: true, test_id: test.id })
  }

  /* ── Déclarer un gagnant ───────────────────────────────────────── */
  if (action === 'winner') {
    const { test_id, winner } = body

    if (!test_id || !['A', 'B'].includes(winner)) {
      return NextResponse.json({ error: 'test_id et winner (A|B) requis' }, { status: 400 })
    }

    // Vérifier que ce test appartient bien à l'utilisateur courant
    const { data: ownedTest } = await supabase
      .from('ab_tests')
      .select('id, pages!inner(user_id)')
      .eq('id', test_id)
      .eq('pages.user_id', user.id)
      .maybeSingle()

    if (!ownedTest) {
      return NextResponse.json({ error: 'Test introuvable' }, { status: 404 })
    }

    await supabaseAdmin
      .from('ab_tests')
      .update({ status: 'completed', winner })
      .eq('id', test_id)

    return NextResponse.json({ ok: true })
  }

  /* ── Mettre à jour le statut ───────────────────────────────────── */
  if (action === 'status') {
    const { test_id, status } = body
    const allowed = ['running', 'paused', 'completed']

    if (!test_id || !allowed.includes(status)) {
      return NextResponse.json({ error: 'test_id et status valide requis' }, { status: 400 })
    }

    // Vérifier que ce test appartient bien à l'utilisateur courant
    const { data: ownedTest } = await supabase
      .from('ab_tests')
      .select('id, pages!inner(user_id)')
      .eq('id', test_id)
      .eq('pages.user_id', user.id)
      .maybeSingle()

    if (!ownedTest) {
      return NextResponse.json({ error: 'Test introuvable' }, { status: 404 })
    }

    await supabaseAdmin
      .from('ab_tests')
      .update({ status })
      .eq('id', test_id)

    return NextResponse.json({ ok: true })
  }

  return NextResponse.json({ error: 'Action inconnue' }, { status: 400 })
}
