'use client'

import { useEffect, useCallback, useRef } from 'react'
import { useEditorStore, hydrateFromPage } from './store'
import Fab from './Fab'
import Panel from './Panel'
import SubPanelEdit from './SubPanelEdit'
import PreviewIframe from './PreviewIframe'
import DeviceSwitcher from './DeviceSwitcher'
import { IconArrowLeft, IconSave, IconCheckCircle } from './Icons'
import type { LandingPageData } from '@/types'
import type { SectionInstance, VisualSettings, GlobalStyles } from '@/types/editor'

// Labels i18n inline
const T = {
  fr: { back: 'Retour', save: 'Sauvegarder', saved: 'Sauvegardé', saving: '...', editor: 'Konvert' },
  en: { back: 'Back', save: 'Save', saved: 'Saved', saving: '...', editor: 'Konvert' },
  ar: { back: 'رجوع', save: 'حفظ', saved: 'تم الحفظ', saving: '...', editor: 'Konvert' },
  es: { back: 'Volver', save: 'Guardar', saved: 'Guardado', saving: '...', editor: 'Konvert' },
} as const
const lang = 'fr'
const t = T[lang]

const TOPBAR_H = 52

interface Props {
  jsonContent?: LandingPageData & {
    _template_slug?: string
    _editor_state?: unknown
  }
  defaultTemplateId?: string
  // V3 — html déjà rendu serveur. Si présent, PreviewIframe l'utilise direct
  // au lieu d'appeler renderTemplate côté client (qui ne connaît pas V3).
  staticHtml?: string
  onSave?: (html: string, jsonForDb: object) => Promise<void>
  saving?: boolean
}

const V3_STYLE_IDS = new Set([
  'soft', 'editorial', 'apple-clean', 'luxe-noir', 'organic',
  'brutalist', 'warm-neutral', 'minimal-mono', 'vibrant', 'bold',
])

export default function EditorRoot({ jsonContent, defaultTemplateId = 'etec-blue', staticHtml, onSave, saving }: Props) {
  const hydrate = useEditorStore(s => s.hydrate)
  const setStaticHtml = useEditorStore(s => s.setStaticHtml)
  const templateId = useEditorStore(s => s.templateId)
  const landingData = useEditorStore(s => s.landingData)
  const sectionOrder = useEditorStore(s => s.sectionOrder)
  const visualSettings = useEditorStore(s => s.visualSettings)
  const globalStyles = useEditorStore(s => s.globalStyles)
  const storeStaticHtml = useEditorStore(s => s.staticHtml)
  const panelOpen = useEditorStore(s => s.panelOpen)
  const setPanelOpen = useEditorStore(s => s.setPanelOpen)
  // C2 — auto-save trigger
  const sectionData = useEditorStore(s => s.sectionData)
  const scheduleAutoSave = useEditorStore(s => s.scheduleAutoSave)

  // Hydrate on mount only
  useEffect(() => {
    if (jsonContent) {
      const state = hydrateFromPage(jsonContent as LandingPageData & {
        _template_slug?: string
        _editor_state?: {
          sectionOrder?: SectionInstance[]
          visualSettings?: VisualSettings
          globalStyles?: GlobalStyles
        }
      })
      hydrate(state)
    } else {
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

  // Sync staticHtml prop → store (re-runs si prop change après autosave)
  useEffect(() => {
    if (staticHtml) setStaticHtml(staticHtml)
  }, [staticHtml, setStaticHtml])

  // C2 — auto-save 3s après dernier changement sectionData ou visualSettings.
  // Skip le mount initial (hydrate → setState ne doit pas déclencher save).
  const isInitialAutoSaveMount = useRef(true)
  useEffect(() => {
    if (isInitialAutoSaveMount.current) {
      isInitialAutoSaveMount.current = false
      return
    }
    if (!onSave) return
    scheduleAutoSave('', async (jsonForDb) => {
      // V3 : pas de render côté client — reuse storeStaticHtml
      let html: string
      if (V3_STYLE_IDS.has(templateId)) {
        html = storeStaticHtml || staticHtml || ''
        if (!html) return
      } else {
        const { renderTemplate } = await import('@/lib/templates')
        html = renderTemplate(templateId, landingData, { sectionOrder, visualSettings, globalStyles })
      }
      await onSave(html, jsonForDb)
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sectionData, visualSettings])

  async function handleSave() {
    if (!onSave) return
    // V3 — renderTemplate côté client ne sait pas rendre les styleId V3.
    // On utilise le html déjà rendu serveur (staticHtml du store ou prop).
    let html: string
    if (V3_STYLE_IDS.has(templateId)) {
      html = storeStaticHtml || staticHtml || ''
      if (!html) {
        console.warn('[EditorRoot] V3 save: pas de staticHtml dispo, save annulé')
        return
      }
    } else {
      const { renderTemplate } = await import('@/lib/templates')
      html = renderTemplate(templateId, landingData, { sectionOrder, visualSettings, globalStyles })
    }
    const jsonForDb = {
      ...landingData,
      _template_slug: templateId,
      _editor_state: { sectionOrder, visualSettings, globalStyles },
    }
    await onSave(html, jsonForDb)
  }

  // Close panel when clicking outside (on preview area) — handled via postMessage
  // KVT_SECTION_DESELECTED doesn't close panel (user may want panel open).
  // Explicit close = ESC or X button in Panel.

  // Laptop: when panel is open, shift FAB position via CSS (done via inline style
  // on FAB component based on panelOpen state + media query in globals).
  // We expose panelOpen as data-attribute on the app shell for CSS targeting.

  const onClickPreviewBackground = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    // Only close if clicking directly on the preview background (not the iframe content)
    if (e.target === e.currentTarget) {
      setPanelOpen(false)
    }
  }, [setPanelOpen])

  return (
    <div
      data-panel-open={panelOpen ? 'true' : 'false'}
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        background: '#FAFAF7',
        fontFamily: 'Inter, -apple-system, sans-serif',
        WebkitFontSmoothing: 'antialiased',
        overflow: 'hidden',
      }}
    >
      {/* ── TOPBAR ─────────────────────────────────────────── */}
      <header
        style={{
          height: TOPBAR_H,
          background: '#FFFFFF',
          borderBottom: '1px solid #EDE8DF',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 20px',
          flexShrink: 0,
          zIndex: 400,
          position: 'relative',
        }}
      >
        {/* Left: back + product name */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button
            aria-label={t.back}
            onClick={() => window.history.back()}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              color: '#8B8680',
              fontSize: 13,
              fontWeight: 400,
              padding: '6px 8px',
              borderRadius: 6,
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontFamily: 'inherit',
              transition: 'color 150ms ease, background 150ms ease',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#2D2D2D'; (e.currentTarget as HTMLElement).style.background = '#FAFAF7' }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = '#8B8680'; (e.currentTarget as HTMLElement).style.background = 'none' }}
          >
            <IconArrowLeft size={14} />
            {t.back}
          </button>

          <div style={{ width: 1, height: 18, background: '#EDE8DF' }} aria-hidden="true" />

          <span
            style={{
              fontFamily: '\'Playfair Display\', Georgia, serif',
              fontSize: 16,
              fontStyle: 'italic',
              fontWeight: 400,
              color: '#2D2D2D',
              maxWidth: 200,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {landingData.product_name || t.editor}
          </span>
        </div>

        {/* Center: device switcher */}
        <DeviceSwitcher />

        {/* Right: save button */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {onSave && (
            <button
              onClick={handleSave}
              disabled={saving}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                fontSize: 13,
                fontWeight: 500,
                color: saving ? '#A8B5A0' : '#2D2D2D',
                border: `1px solid ${saving ? '#A8B5A0' : '#DDD8CF'}`,
                padding: '7px 14px',
                borderRadius: 8,
                background: 'none',
                cursor: saving ? 'not-allowed' : 'pointer',
                fontFamily: 'inherit',
                transition: 'background 150ms ease, border-color 150ms ease',
                opacity: saving ? 0.7 : 1,
              }}
              onMouseEnter={e => { if (!saving) { (e.currentTarget as HTMLButtonElement).style.background = '#F5F1EB'; (e.currentTarget as HTMLButtonElement).style.borderColor = '#A8B5A0' } }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'none'; (e.currentTarget as HTMLButtonElement).style.borderColor = '#DDD8CF' }}
            >
              {saving
                ? <><IconCheckCircle size={14} />{t.saving}</>
                : <><IconSave size={14} />{t.save}</>
              }
            </button>
          )}
        </div>
      </header>

      {/* ── WORKSPACE ────────────────────────────────────────── */}
      <div
        style={{
          flex: 1,
          position: 'relative',
          overflow: 'hidden',
          background: '#F0EDE8',
        }}
      >
        {/* Preview (full-bleed, behind panel overlay) */}
        <div
          style={{ width: '100%', height: '100%' }}
          onClick={onClickPreviewBackground}
        >
          <PreviewIframe />
        </div>

        {/* FAB — fixed, vertically centered */}
        <Fab />

        {/* Panel slide-in — overlay on preview */}
        <Panel />

        {/* Sub-panel Edit — slide from right */}
        <SubPanelEdit />
      </div>
    </div>
  )
}
