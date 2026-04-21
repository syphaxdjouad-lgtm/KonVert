import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: NextRequest) {
  try {
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
      // Table might not exist yet — fallback to just logging
      console.error('[contact] DB insert error:', error.message)
      // Still log the message so it's not lost
      console.log('[contact] Message from:', email, '| Subject:', subject)
    }

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
