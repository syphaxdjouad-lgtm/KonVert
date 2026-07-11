import { NextRequest, NextResponse } from 'next/server'
import { renderTemplate } from '@/lib/templates'
import type { LandingPageData } from '@/types'

// Route interne de test uniquement — rendu server-side d'un template
// à partir d'un payload JSON. Jamais exposée en prod.
// Utilisée par les specs Playwright E2E sections-rich.spec.ts.

export async function POST(req: NextRequest) {
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'Not available in prod' }, { status: 404 })
  }

  let body: { templateId: string; data: LandingPageData }
  try {
    body = (await req.json()) as { templateId: string; data: LandingPageData }
  } catch {
    return NextResponse.json({ error: 'invalid_json' }, { status: 400 })
  }
  const { templateId, data } = body

  const html = renderTemplate(templateId, data)

  return new NextResponse(html, {
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  })
}
