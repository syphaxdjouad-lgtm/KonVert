'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { useEditorStore } from './store'
import { renderTemplate } from '@/lib/templates'
import { createClient } from '@/lib/supabase/client'

// postMessage types (strict discriminated union)
type KvtMessageIn =
  | { type: 'KVT_SECTION_SELECTED'; id: string }
  | { type: 'KVT_SECTION_DESELECTED' }

type KvtMessageOut =
  | { type: 'KVT_HIGHLIGHT_SECTION'; id: string | null }

const DEVICE_WIDTHS: Record<string, string> = {
  desktop: '100%',
  tablet:  '768px',
  mobile:  '390px',
}

// Styles V3 — rendus côté serveur via renderPageV3 (sections-v3/render-page).
// PreviewIframe NE PEUT PAS les rendre côté client (renderTemplate legacy
// connaît uniquement les etec-*). Quand templateId matche un V3 styleId,
// on fetch directement le html_content sauvegardé en DB (via /api/pages/[id]).
const V3_STYLE_IDS = new Set([
  'soft', 'editorial', 'apple-clean', 'luxe-noir', 'organic',
  'brutalist', 'warm-neutral', 'minimal-mono', 'vibrant', 'bold',
])

function isKvtMessage(data: unknown): data is KvtMessageIn {
  if (!data || typeof data !== 'object') return false
  const d = data as Record<string, unknown>
  return (
    d['type'] === 'KVT_SECTION_SELECTED' ||
    d['type'] === 'KVT_SECTION_DESELECTED'
  )
}

export default function PreviewIframe() {
  const templateId = useEditorStore(s => s.templateId)
  const landingData = useEditorStore(s => s.landingData)
  const sectionOrder = useEditorStore(s => s.sectionOrder)
  const visualSettings = useEditorStore(s => s.visualSettings)
  const device = useEditorStore(s => s.device)
  const staticHtml = useEditorStore(s => s.staticHtml)
  const selectedSectionId = useEditorStore(s => s.selectedSectionId)
  const setSelectedSection = useEditorStore(s => s.setSelectedSection)
  const setPanelOpen = useEditorStore(s => s.setPanelOpen)

  const iframeRef = useRef<HTMLIFrameElement>(null)
  const [srcdoc, setSrcdoc] = useState<string>('')
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Compute render inputs — memoized to debounce only real changes
  // C2 : visualSettings inclus pour re-render quand on tweak padding/bg/align
  const renderInputs = useMemo(() => ({
    templateId, landingData, sectionOrder, visualSettings, staticHtml,
  }), [templateId, landingData, sectionOrder, visualSettings, staticHtml])

  useEffect(() => {
    if (!templateId) return

    // ─── Path V3 — html rendu serveur (renderPageV3) ───────────────────────
    // renderTemplate côté client ne connaît pas les styleId V3 (apple-clean, etc.)
    // 1er essai : staticHtml du store (passé via EditorRoot prop après generate)
    // Fallback : fetch html_content depuis Supabase via page_id de l'URL
    if (V3_STYLE_IDS.has(templateId)) {
      if (staticHtml) {
        setSrcdoc(staticHtml)
        return
      }
      const pageIdMatch = typeof window !== 'undefined'
        ? new URLSearchParams(window.location.search).get('page_id')
        : null
      if (!pageIdMatch) {
        setSrcdoc(`<!doctype html><html><body style="font-family:system-ui;padding:60px 40px;text-align:center;color:#5c5c7a;background:#faf9ff">
          <h2 style="color:#1a1a2e;margin-bottom:12px">Style V3 — ${templateId}</h2>
          <p style="font-size:14px;line-height:1.6">Génère la page pour voir le rendu V3 (serveur).</p>
        </body></html>`)
        return
      }
      // Fetch le html_content directement depuis Supabase (RLS filtre par user)
      const supabase = createClient()
      supabase
        .from('pages')
        .select('html_content')
        .eq('id', pageIdMatch)
        .single()
        .then(({ data, error }: { data: { html_content?: string } | null; error: unknown }) => {
          if (!error && data?.html_content) {
            setSrcdoc(data.html_content)
          } else {
            setSrcdoc(`<!doctype html><html><body style="font-family:system-ui;padding:60px 40px;text-align:center;color:#5c5c7a">
              <h2>Style V3 — ${templateId}</h2>
              <p>Aperçu live indisponible. Clique <strong>Publier</strong> pour voir ta page en ligne.</p>
            </body></html>`)
          }
        })
      return
    }

    // ─── Path legacy — renderTemplate côté client (inchangé) ───────────────
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      try {
        const html = renderTemplate(templateId, landingData, {
          sectionOrder,
          visualSettings,
          editMode: true,
        })
        setSrcdoc(html)
      } catch (err) {
        console.error('[PreviewIframe] renderTemplate failed', err)
      }
    }, 200)
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [renderInputs])

  // Listen to postMessage from iframe (KVT_SECTION_SELECTED / DESELECTED)
  useEffect(() => {
    function onMessage(e: MessageEvent) {
      if (e.origin !== window.location.origin) return
      if (!isKvtMessage(e.data)) return
      if (e.data.type === 'KVT_SECTION_SELECTED') {
        setSelectedSection(e.data.id)
        setPanelOpen(true)
      } else if (e.data.type === 'KVT_SECTION_DESELECTED') {
        setSelectedSection(null)
      }
    }
    window.addEventListener('message', onMessage)
    return () => window.removeEventListener('message', onMessage)
  }, [setSelectedSection, setPanelOpen])

  // Send highlight to iframe whenever selectedSectionId changes
  useEffect(() => {
    const msg: KvtMessageOut = { type: 'KVT_HIGHLIGHT_SECTION', id: selectedSectionId }
    iframeRef.current?.contentWindow?.postMessage(msg, window.location.origin)
  }, [selectedSectionId])

  return (
    <div
      style={{
        flex: 1,
        background: '#F0EDE8',
        overflow: 'hidden',
        overflowY: 'auto',
        position: 'relative',
      }}
    >
      <div
        data-testid="preview-wrapper"
        style={{
          margin: '0 auto',
          background: '#FFFFFF',
          minHeight: '100%',
          maxWidth: DEVICE_WIDTHS[device] ?? '100%',
          boxShadow: device !== 'desktop' ? '0 0 0 1px #EDE8DF' : 'none',
          transition: 'max-width 320ms cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        <iframe
          ref={iframeRef}
          srcDoc={srcdoc}
          sandbox="allow-scripts allow-same-origin"
          style={{
            width: '100%',
            height: '100%',
            minHeight: '100vh',
            border: 0,
            display: 'block',
          }}
          title="Preview"
        />
      </div>
    </div>
  )
}
