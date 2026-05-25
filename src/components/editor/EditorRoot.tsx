'use client'

import { useEffect, useState } from 'react'
import { useEditorStore, hydrateFromPage } from './store'
import Sidebar from './Sidebar'
import PanelLeft from './PanelLeft'
import PreviewIframe from './PreviewIframe'
import DeviceSwitcher from './DeviceSwitcher'
import type { LandingPageData } from '@/types'

interface Props {
  // pages.json_content deja parse. Peut etre :
  // - undefined (nouvelle page)
  // - LandingPageData legacy (sans _editor_state)
  // - LandingPageData enrichi de _template_slug et _editor_state (page recente)
  jsonContent?: LandingPageData & {
    _template_slug?: string
    _editor_state?: unknown
  }
  // Template par defaut si jsonContent absent.
  defaultTemplateId?: string
  // Callback save appele avec le HTML rendu et le json complet pour DB.
  onSave?: (html: string, jsonForDb: object) => Promise<void>
  saving?: boolean
}

export default function EditorRoot({ jsonContent, defaultTemplateId = 'etec-blue', onSave, saving }: Props) {
  const hydrate = useEditorStore(s => s.hydrate)
  const templateId = useEditorStore(s => s.templateId)
  const landingData = useEditorStore(s => s.landingData)
  const sectionOrder = useEditorStore(s => s.sectionOrder)
  const visualSettings = useEditorStore(s => s.visualSettings)
  const globalStyles = useEditorStore(s => s.globalStyles)

  const [legacyWarningSent, setLegacyWarningSent] = useState(false)

  // Hydrate au mount uniquement
  useEffect(() => {
    if (jsonContent) {
      const state = hydrateFromPage(jsonContent as LandingPageData & {
        _template_slug?: string
        _editor_state?: {
          sectionOrder?: typeof sectionOrder
          visualSettings?: typeof visualSettings
          globalStyles?: typeof globalStyles
        }
      })
      hydrate(state)
      // Log Sentry warning si page legacy (sans _editor_state)
      if (!jsonContent._editor_state && !legacyWarningSent) {
        try {
          const w = window as typeof window & { Sentry?: { captureMessage: (m: string, opts: { level: string }) => void } }
          if (typeof window !== 'undefined' && w.Sentry) {
            w.Sentry.captureMessage('editor.legacy_page_opened', { level: 'warning' })
          }
        } catch {
          // noop
        }
        setLegacyWarningSent(true)
      }
    } else {
      // Nouvelle page : init avec defaultTemplateId et data vide.
      // La data sera hydratee par la page parente apres /api/generate.
      hydrate({
        templateId: defaultTemplateId,
        landingData: {
          headline: '', subtitle: '', benefits: [], faq: [],
          cta: '', urgency: '', product_name: '',
        },
        sectionOrder: [],
        visualSettings: {},
        globalStyles: {},
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function handleSave() {
    if (!onSave) return
    const { renderTemplate } = await import('@/lib/templates')
    const html = renderTemplate(templateId, landingData, { sectionOrder, visualSettings, globalStyles })
    const jsonForDb = {
      ...landingData,
      _template_slug: templateId,
      _editor_state: { sectionOrder, visualSettings, globalStyles },
    }
    await onSave(html, jsonForDb)
  }

  return (
    <div className="flex flex-col h-full bg-gray-100">
      {/* Topbar */}
      <div className="flex items-center justify-between bg-white border-b border-gray-200 px-4 h-12 flex-shrink-0">
        <div className="text-sm font-bold text-gray-700">Konvert Editor</div>
        <div className="flex items-center gap-3">
          <DeviceSwitcher />
          {onSave && (
            <button
              onClick={handleSave}
              disabled={saving}
              className="text-xs font-bold px-4 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-700 text-white disabled:opacity-50"
            >
              {saving ? '...' : 'Sauvegarder'}
            </button>
          )}
        </div>
      </div>

      {/* Body : sidebar + panel + preview */}
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <PanelLeft />
        <PreviewIframe />
      </div>
    </div>
  )
}
