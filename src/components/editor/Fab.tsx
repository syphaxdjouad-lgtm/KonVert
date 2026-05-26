'use client'

import { useEditorStore } from './store'
import { IconSections } from './Icons'

// Labels i18n inline
const T = {
  fr: { tooltip: 'Sections' },
  en: { tooltip: 'Sections' },
  ar: { tooltip: 'الأقسام' },
  es: { tooltip: 'Secciones' },
} as const
const lang = 'fr'
const t = T[lang]

export default function Fab() {
  const panelOpen = useEditorStore(s => s.panelOpen)
  const setPanelOpen = useEditorStore(s => s.setPanelOpen)

  return (
    <>
      {/* FAB button — 44px, position fixed left:16px, vertically centered */}
      <button
        aria-label={t.tooltip}
        aria-expanded={panelOpen}
        onClick={() => setPanelOpen(!panelOpen)}
        className={[
          'fab',
          panelOpen ? 'open' : '',
        ].filter(Boolean).join(' ')}
        style={{
          position: 'fixed',
          left: 16,
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 200,
          width: 44,
          height: 44,
          background: panelOpen ? '#EEF2EC' : '#FFFFFF',
          border: `1px solid ${panelOpen ? 'rgba(168,181,160,0.4)' : '#EDE8DF'}`,
          borderRadius: 10,
          boxShadow: '0 2px 12px rgba(0,0,0,0.06), 0 1px 4px rgba(0,0,0,0.04)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: panelOpen ? '#A8B5A0' : '#8B8680',
          cursor: 'pointer',
          transition: 'background 150ms ease, color 150ms ease, box-shadow 200ms ease, left 280ms cubic-bezier(0.4,0,0.2,1)',
        }}
      >
        <IconSections size={18} />
      </button>

      {/* Tooltip */}
      <span
        aria-hidden="true"
        style={{
          position: 'fixed',
          left: 68,
          top: '50%',
          transform: 'translateY(-50%)',
          background: '#2D2D2D',
          color: '#FFFFFF',
          fontSize: 12,
          fontWeight: 500,
          padding: '5px 10px',
          borderRadius: 6,
          whiteSpace: 'nowrap',
          pointerEvents: 'none',
          zIndex: 201,
          opacity: 0,
          // Tooltip is shown via CSS hover on the parent — handled by global styles
          display: 'none',
        }}
      >
        {t.tooltip}
      </span>
    </>
  )
}
