'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { useEditorStore } from './store'
import { renderTemplate } from '@/lib/templates'

const DEVICE_WIDTHS = {
  desktop: '100%',
  tablet:  '768px',
  mobile:  '390px',
}

export default function PreviewIframe() {
  const templateId = useEditorStore(s => s.templateId)
  const landingData = useEditorStore(s => s.landingData)
  const sectionOrder = useEditorStore(s => s.sectionOrder)
  const device = useEditorStore(s => s.device)

  // srcdoc calcule avec debounce 200ms pour eviter les re-renders a chaque
  // keystroke quand on editera depuis le panel droit (C2).
  const [srcdoc, setSrcdoc] = useState<string>('')
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const renderInputs = useMemo(() => ({
    templateId, landingData, sectionOrder,
  }), [templateId, landingData, sectionOrder])

  useEffect(() => {
    if (!templateId) return
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      try {
        const html = renderTemplate(templateId, landingData, { sectionOrder })
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

  return (
    <div className="flex-1 bg-gray-100 overflow-hidden flex items-center justify-center p-4">
      <div
        data-testid="preview-wrapper"
        className="bg-white shadow-lg overflow-hidden transition-all duration-200"
        style={{
          width: DEVICE_WIDTHS[device],
          maxWidth: '100%',
          height: '100%',
          maxHeight: '100%',
        }}
      >
        <iframe
          srcDoc={srcdoc}
          sandbox="allow-scripts allow-same-origin"
          className="w-full h-full border-0"
          title="Preview"
        />
      </div>
    </div>
  )
}
