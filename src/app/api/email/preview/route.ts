import { NextRequest, NextResponse } from 'next/server'
import { sendEmail } from '@/lib/email'
import {
  emailPreviewDelivery,
  emailPreviewDay1,
  emailPreviewDay3,
  emailPreviewDay5,
  emailPreviewDay7,
} from '@/lib/email/preview-templates'

type PreviewStep = 0 | 1 | 3 | 5 | 7

export async function POST(req: NextRequest) {
  // Protection : uniquement appelable en interne (fire-and-forget depuis /api/generate/public)
  const internalSecret = req.headers.get('x-internal-secret')
  if (internalSecret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  }

  try {
    const { email, name, preview_id, product_title, step } = await req.json()

    if (!email || !preview_id || step === undefined) {
      return NextResponse.json({ error: 'Paramètres manquants' }, { status: 400 })
    }

    const displayName = name || email.split('@')[0]
    const previewUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'https://konvert.app'}/preview/${preview_id}`

    let emailContent: { subject: string; html: string }

    switch (step as PreviewStep) {
      case 0:
        emailContent = emailPreviewDelivery(displayName, previewUrl, product_title)
        break
      case 1:
        emailContent = emailPreviewDay1(displayName, previewUrl, product_title)
        break
      case 3:
        emailContent = emailPreviewDay3(displayName, previewUrl, product_title)
        break
      case 5:
        emailContent = emailPreviewDay5(displayName, previewUrl)
        break
      case 7:
        emailContent = emailPreviewDay7(displayName, previewUrl, product_title)
        break
      default:
        return NextResponse.json({ error: 'Step invalide' }, { status: 400 })
    }

    await sendEmail({
      to: email,
      subject: emailContent.subject,
      html: emailContent.html,
      from: 'KONVERT <hello@konvert.app>',
    })

    return NextResponse.json({ sent: true })
  } catch (err) {
    console.error('[email/preview]', err)
    return NextResponse.json({ sent: false }, { status: 200 })
  }
}
