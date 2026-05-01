import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json()
    if (!email || typeof email !== 'string') {
      return NextResponse.json({ error: 'Email requis' }, { status: 400 })
    }

    const normalizedEmail = email.toLowerCase().trim()

    // Marquer comme désabonné dans public_previews (séquence preview)
    await supabaseAdmin
      .from('public_previews')
      .update({ converted: true }) // stoppe la séquence email
      .eq('email', normalizedEmail)
      .eq('converted', false)

    // Marquer dans users si compte existant
    await supabaseAdmin
      .from('users')
      .update({ trial_emails_sent: [-1] }) // sentinel : -1 = désabonné
      .eq('email', normalizedEmail)

    return NextResponse.json({ unsubscribed: true })
  } catch (err) {
    console.error('[email/unsubscribe]', err)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
