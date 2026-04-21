import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { jsPDF } from 'jspdf'

// GET /api/workspaces/[id]/report — génère les données du rapport PDF
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id: workspaceId } = await params

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })

  const { data: workspace } = await supabase
    .from('workspaces')
    .select('*')
    .eq('id', workspaceId)
    .eq('owner_id', user.id)
    .single()

  if (!workspace) return NextResponse.json({ error: 'Workspace introuvable' }, { status: 404 })

  // Pages + stats
  const { data: pages } = await supabase
    .from('pages')
    .select('id, title, status, views, cta_clicks, created_at, published_url')
    .eq('workspace_id', workspaceId)
    .order('views', { ascending: false })

  const list = pages || []
  const totalViews  = list.reduce((s, p) => s + (p.views || 0), 0)
  const totalClicks = list.reduce((s, p) => s + (p.cta_clicks || 0), 0)
  const published   = list.filter(p => p.status === 'published').length

  const reportData = {
    workspace,
    pages: list,
    stats: { totalViews, totalClicks, published, total: list.length },
    generatedAt: new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }),
  }

  const format = req.nextUrl.searchParams.get('format')

  if (format === 'pdf') {
    const pdfBytes = buildReportPdf(reportData)
    return new NextResponse(pdfBytes, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="rapport-${workspace.name.replace(/\s+/g, '-')}.pdf"`,
      },
    })
  }

  const html = buildReportHtml(reportData)
  return new NextResponse(html, {
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Content-Disposition': `inline; filename="rapport-${workspace.name.replace(/\s+/g, '-')}.html"`,
    },
  })
}

/** Échappe les caractères HTML spéciaux pour prévenir les injections XSS */
function esc(str: unknown): string {
  if (str == null) return ''
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
}

/** Valide qu'une valeur est une couleur CSS sûre (hex ou rgb) */
function safeCssColor(value: unknown, fallback: string): string {
  if (typeof value !== 'string') return fallback
  // Accepter uniquement hex (#xxx ou #xxxxxx) ou rgb()/rgba()
  if (/^#[0-9a-fA-F]{3,6}$/.test(value)) return value
  if (/^rgba?\(\s*\d+\s*,\s*\d+\s*,\s*\d+(\s*,\s*[\d.]+)?\s*\)$/.test(value)) return value
  return fallback
}

function buildReportHtml({ workspace, pages, stats, generatedAt }: any): string {
  const brandColor = safeCssColor(workspace.brand_color, '#7c3aed')
  const brandName  = esc(workspace.brand_name) || 'KONVERT'

  const pagesRows = pages.map((p: any) => `
    <tr>
      <td style="padding:10px 12px;border-bottom:1px solid #f0f0f0;font-size:13px;color:#111;max-width:250px">
        <div style="font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${esc(p.title) || 'Sans titre'}</div>
        ${p.published_url ? `<div style="font-size:11px;color:#888;margin-top:2px">${esc(p.published_url)}</div>` : ''}
      </td>
      <td style="padding:10px 12px;border-bottom:1px solid #f0f0f0;text-align:center">
        <span style="font-size:11px;font-weight:700;padding:2px 8px;border-radius:20px;background:${p.status === 'published' ? '#dcfce7' : '#f3f4f6'};color:${p.status === 'published' ? '#16a34a' : '#6b7280'}">
          ${p.status === 'published' ? 'Publié' : 'Brouillon'}
        </span>
      </td>
      <td style="padding:10px 12px;border-bottom:1px solid #f0f0f0;text-align:right;font-weight:700;font-size:13px">${(p.views || 0).toLocaleString('fr-FR')}</td>
      <td style="padding:10px 12px;border-bottom:1px solid #f0f0f0;text-align:right;font-weight:700;font-size:13px;color:${brandColor}">${(p.cta_clicks || 0).toLocaleString('fr-FR')}</td>
      <td style="padding:10px 12px;border-bottom:1px solid #f0f0f0;text-align:right;font-size:12px;color:#888">${esc(new Date(p.created_at).toLocaleDateString('fr-FR'))}</td>
    </tr>
  `).join('')

  return `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>Rapport — ${esc(workspace.client_name || workspace.name)}</title>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #f8f8f8; color: #333; }
  .page { max-width: 800px; margin: 0 auto; background: #fff; min-height: 100vh; }
  @media print {
    body { background: white; }
    .page { max-width: 100%; }
    .no-print { display: none; }
  }
</style>
</head>
<body>
<div class="page">

  <!-- Header -->
  <div style="background:${brandColor};padding:40px 48px;color:white">
    <div style="font-size:24px;font-weight:900;letter-spacing:-0.5px">${brandName}</div>
    <div style="font-size:32px;font-weight:900;margin-top:16px">Rapport de performance</div>
    <div style="font-size:16px;opacity:0.8;margin-top:6px">
      ${workspace.client_name ? `Client : ${esc(workspace.client_name)}` : esc(workspace.name)}
    </div>
    <div style="font-size:13px;opacity:0.6;margin-top:4px">Généré le ${generatedAt}</div>
  </div>

  <!-- Stats -->
  <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:0;border-bottom:1px solid #eee">
    ${[
      { label: 'Pages créées',   value: stats.total },
      { label: 'Pages publiées', value: stats.published },
      { label: 'Vues totales',   value: stats.totalViews.toLocaleString('fr-FR') },
      { label: 'Clics CTA',      value: stats.totalClicks.toLocaleString('fr-FR') },
    ].map(s => `
      <div style="padding:28px 24px;text-align:center;border-right:1px solid #eee">
        <div style="font-size:32px;font-weight:900;color:${brandColor}">${s.value}</div>
        <div style="font-size:12px;color:#888;font-weight:600;margin-top:4px;text-transform:uppercase;letter-spacing:0.5px">${s.label}</div>
      </div>
    `).join('')}
  </div>

  <!-- Tableau pages -->
  <div style="padding:32px 48px">
    <div style="font-size:16px;font-weight:800;color:#111;margin-bottom:16px">Détail des pages</div>
    ${pages.length === 0 ? '<p style="color:#888;font-size:13px">Aucune page dans ce workspace</p>' : `
    <table style="width:100%;border-collapse:collapse">
      <thead>
        <tr style="background:#f8f8f8">
          <th style="padding:10px 12px;text-align:left;font-size:11px;font-weight:700;color:#888;text-transform:uppercase;letter-spacing:0.5px">Page</th>
          <th style="padding:10px 12px;text-align:center;font-size:11px;font-weight:700;color:#888;text-transform:uppercase">Statut</th>
          <th style="padding:10px 12px;text-align:right;font-size:11px;font-weight:700;color:#888;text-transform:uppercase">Vues</th>
          <th style="padding:10px 12px;text-align:right;font-size:11px;font-weight:700;color:#888;text-transform:uppercase">Clics CTA</th>
          <th style="padding:10px 12px;text-align:right;font-size:11px;font-weight:700;color:#888;text-transform:uppercase">Date</th>
        </tr>
      </thead>
      <tbody>${pagesRows}</tbody>
    </table>
    `}
  </div>

  <!-- Footer -->
  <div style="padding:24px 48px;border-top:1px solid #eee;display:flex;justify-content:space-between;align-items:center">
    <span style="font-size:12px;color:#aaa">Rapport généré par ${brandName} via KONVERT</span>
    <button class="no-print" onclick="window.print()"
      style="background:${brandColor};color:white;border:none;padding:8px 20px;border-radius:8px;font-weight:700;font-size:12px;cursor:pointer">
      Imprimer / Exporter PDF
    </button>
  </div>

</div>
</body>
</html>`
}

/* ─── PDF GENERATION ──────────────────────────────────────────────────── */

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace('#', '')
  const n = parseInt(h.length === 3 ? h.split('').map(c => c + c).join('') : h, 16)
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
}

function buildReportPdf({ workspace, pages, stats, generatedAt }: any): ArrayBuffer {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
  const brandHex = safeCssColor(workspace.brand_color, '#7c3aed')
  const brand = hexToRgb(brandHex)
  const brandName = workspace.brand_name || 'KONVERT'
  const clientName = workspace.client_name || workspace.name
  const W = 210
  const margin = 20
  let y = 0

  // ── Header band ──
  doc.setFillColor(brand[0], brand[1], brand[2])
  doc.rect(0, 0, W, 52, 'F')
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(20)
  doc.setFont('helvetica', 'bold')
  doc.text(brandName, margin, 18)
  doc.setFontSize(14)
  doc.text('Rapport de performance', margin, 30)
  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.text(`Client : ${clientName}`, margin, 39)
  doc.setFontSize(8)
  doc.text(`Généré le ${generatedAt}`, margin, 46)
  y = 62

  // ── Stats boxes ──
  const statItems = [
    { label: 'Pages créées', value: String(stats.total) },
    { label: 'Publiées', value: String(stats.published) },
    { label: 'Vues totales', value: stats.totalViews.toLocaleString('fr-FR') },
    { label: 'Clics CTA', value: stats.totalClicks.toLocaleString('fr-FR') },
  ]
  const boxW = (W - margin * 2 - 12) / 4
  statItems.forEach((s, i) => {
    const x = margin + i * (boxW + 4)
    doc.setFillColor(248, 248, 248)
    doc.roundedRect(x, y, boxW, 22, 2, 2, 'F')
    doc.setTextColor(brand[0], brand[1], brand[2])
    doc.setFontSize(16)
    doc.setFont('helvetica', 'bold')
    doc.text(s.value, x + boxW / 2, y + 10, { align: 'center' })
    doc.setTextColor(130, 130, 130)
    doc.setFontSize(7)
    doc.setFont('helvetica', 'normal')
    doc.text(s.label.toUpperCase(), x + boxW / 2, y + 18, { align: 'center' })
  })
  y += 32

  // ── Table header ──
  doc.setFontSize(12)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(30, 30, 30)
  doc.text('Détail des pages', margin, y)
  y += 8

  const cols = [
    { label: 'Page', x: margin, w: 70, align: 'left' as const },
    { label: 'Statut', x: margin + 72, w: 28, align: 'center' as const },
    { label: 'Vues', x: margin + 102, w: 25, align: 'right' as const },
    { label: 'Clics', x: margin + 129, w: 25, align: 'right' as const },
    { label: 'Date', x: margin + 156, w: 24, align: 'right' as const },
  ]

  // Header row
  doc.setFillColor(245, 245, 245)
  doc.rect(margin, y, W - margin * 2, 8, 'F')
  doc.setFontSize(7)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(130, 130, 130)
  cols.forEach(c => {
    const tx = c.align === 'right' ? c.x + c.w : c.align === 'center' ? c.x + c.w / 2 : c.x + 2
    doc.text(c.label.toUpperCase(), tx, y + 5.5, { align: c.align })
  })
  y += 10

  // Data rows
  doc.setFontSize(8)
  doc.setFont('helvetica', 'normal')
  pages.forEach((p: any) => {
    if (y > 270) {
      doc.addPage()
      y = 20
    }
    doc.setTextColor(30, 30, 30)
    const title = (p.title || 'Sans titre').substring(0, 45)
    doc.text(title, cols[0].x + 2, y + 4)

    const status = p.status === 'published' ? 'Publié' : 'Brouillon'
    doc.setTextColor(p.status === 'published' ? 22 : 107, p.status === 'published' ? 163 : 114, p.status === 'published' ? 74 : 128)
    doc.text(status, cols[1].x + cols[1].w / 2, y + 4, { align: 'center' })

    doc.setTextColor(30, 30, 30)
    doc.text(String(p.views || 0), cols[2].x + cols[2].w, y + 4, { align: 'right' })

    doc.setTextColor(brand[0], brand[1], brand[2])
    doc.text(String(p.cta_clicks || 0), cols[3].x + cols[3].w, y + 4, { align: 'right' })

    doc.setTextColor(160, 160, 160)
    doc.text(new Date(p.created_at).toLocaleDateString('fr-FR'), cols[4].x + cols[4].w, y + 4, { align: 'right' })

    doc.setDrawColor(240, 240, 240)
    doc.line(margin, y + 7, W - margin, y + 7)
    y += 9
  })

  if (pages.length === 0) {
    doc.setTextColor(160, 160, 160)
    doc.text('Aucune page dans ce workspace', margin + 2, y + 4)
    y += 10
  }

  // ── Footer ──
  const pageCount = doc.getNumberOfPages()
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i)
    doc.setFontSize(7)
    doc.setTextColor(180, 180, 180)
    doc.text(`Rapport ${brandName} via KONVERT — Page ${i}/${pageCount}`, W / 2, 290, { align: 'center' })
  }

  return doc.output('arraybuffer')
}
