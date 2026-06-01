'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { useEditorStore } from './store'
import { renderTemplate } from '@/lib/templates'

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
  const device = useEditorStore(s => s.device)
  const selectedSectionId = useEditorStore(s => s.selectedSectionId)
  const setSelectedSection = useEditorStore(s => s.setSelectedSection)
  const setPanelOpen = useEditorStore(s => s.setPanelOpen)

  const iframeRef = useRef<HTMLIFrameElement>(null)
  const [srcdoc, setSrcdoc] = useState<string>('')
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Compute render inputs — memoized to debounce only real changes
  const renderInputs = useMemo(() => ({
    templateId, landingData, sectionOrder,
  }), [templateId, landingData, sectionOrder])

  useEffect(() => {
    if (!templateId) return
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      try {
        const html = renderTemplate(templateId, landingData, {
          sectionOrder,
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
