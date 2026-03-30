import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

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

  // Générer le HTML du rapport
  const html = buildReportHtml({
    workspace,
    pages: list,
    stats: { totalViews, totalClicks, published, total: list.length },
    generatedAt: new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }),
  })

  return new NextResponse(html, {
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Content-Disposition': `inline; filename="rapport-${workspace.name.replace(/\s+/g, '-')}.html"`,
    },
  })
}

function buildReportHtml({ workspace, pages, stats, generatedAt }: any): string {
  const brandColor = workspace.brand_color || '#7c3aed'
  const brandName  = workspace.brand_name || 'KONVERT'

  const pagesRows = pages.map((p: any) => `
    <tr>
      <td style="padding:10px 12px;border-bottom:1px solid #f0f0f0;font-size:13px;color:#111;max-width:250px">
        <div style="font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${p.title || 'Sans titre'}</div>
        ${p.published_url ? `<div style="font-size:11px;color:#888;margin-top:2px">${p.published_url}</div>` : ''}
      </td>
      <td style="padding:10px 12px;border-bottom:1px solid #f0f0f0;text-align:center">
        <span style="font-size:11px;font-weight:700;padding:2px 8px;border-radius:20px;background:${p.status === 'published' ? '#dcfce7' : '#f3f4f6'};color:${p.status === 'published' ? '#16a34a' : '#6b7280'}">
          ${p.status === 'published' ? 'Publié' : 'Brouillon'}
        </span>
      </td>
      <td style="padding:10px 12px;border-bottom:1px solid #f0f0f0;text-align:right;font-weight:700;font-size:13px">${(p.views || 0).toLocaleString('fr-FR')}</td>
      <td style="padding:10px 12px;border-bottom:1px solid #f0f0f0;text-align:right;font-weight:700;font-size:13px;color:${brandColor}">${(p.cta_clicks || 0).toLocaleString('fr-FR')}</td>
      <td style="padding:10px 12px;border-bottom:1px solid #f0f0f0;text-align:right;font-size:12px;color:#888">${new Date(p.created_at).toLocaleDateString('fr-FR')}</td>
    </tr>
  `).join('')

  return `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>Rapport — ${workspace.client_name || workspace.name}</title>
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
      ${workspace.client_name ? `Client : ${workspace.client_name}` : workspace.name}
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
    <span style="font-size:12px;color:#aaa">Rapport généré par ${brandName}</span>
    <button class="no-print" onclick="window.print()"
      style="background:${brandColor};color:white;border:none;padding:8px 20px;border-radius:8px;font-weight:700;font-size:12px;cursor:pointer">
      Imprimer / Exporter PDF
    </button>
  </div>

</div>
</body>
</html>`
}
