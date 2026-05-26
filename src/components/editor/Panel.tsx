'use client'

import { useEffect, useRef } from 'react'
import { useEditorStore } from './store'
import SectionsList from './SectionsList'
import { IconX, IconSearch, IconPlus } from './Icons'

// Labels i18n inline
const T = {
  fr: { title: 'Sections', close: 'Fermer le panel', searchPlaceholder: 'Rechercher...', addSection: 'Ajouter une section' },
  en: { title: 'Sections', close: 'Close panel', searchPlaceholder: 'Search...', addSection: 'Add a section' },
  ar: { title: 'الأقسام', close: 'إغلاق', searchPlaceholder: 'بحث...', addSection: 'إضافة قسم' },
  es: { title: 'Secciones', close: 'Cerrar panel', searchPlaceholder: 'Buscar...', addSection: 'Añadir sección' },
} as const
const lang = 'fr'
const t = T[lang]

const TOPBAR_H = 52
const PANEL_W = 320

export default function Panel() {
  const panelOpen = useEditorStore(s => s.panelOpen)
  const setPanelOpen = useEditorStore(s => s.setPanelOpen)
  const sectionOrder = useEditorStore(s => s.sectionOrder)
  const searchRef = useRef<HTMLInputElement>(null)

  // ESC closes panel (priority 3 in cascade — lower than kebab and subpanel)
  useEffect(() => {
    if (!panelOpen) return
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setPanelOpen(false)
      }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [panelOpen, setPanelOpen])

  // Focus search when panel opens
  useEffect(() => {
    if (panelOpen) {
      setTimeout(() => searchRef.current?.focus(), 300)
    }
  }, [panelOpen])

  return (
    <div
      role="region"
      aria-label={t.title}
      aria-hidden={!panelOpen}
      style={{
        position: 'fixed',
        left: 0,
        top: TOPBAR_H,
        width: PANEL_W,
        height: `calc(100vh - ${TOPBAR_H}px)`,
        background: '#FFFFFF',
        borderRight: '1px solid #EDE8DF',
        boxShadow: '4px 0 24px rgba(0,0,0,0.04), 1px 0 4px rgba(0,0,0,0.03)',
        zIndex: 300,
        display: 'flex',
        flexDirection: 'column',
        transform: panelOpen ? 'translateX(0)' : 'translateX(-100%)',
        transition: 'transform 280ms cubic-bezier(0.4, 0, 0.2, 1)',
        willChange: 'transform',
      }}
    >
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '18px 16px 0 20px',
        flexShrink: 0,
      }}>
        <div>
          <span style={{ fontSize: 15, fontWeight: 600, color: '#2D2D2D', letterSpacing: '-0.01em' }}>
            {t.title}
          </span>
          <span style={{ fontSize: 12, fontWeight: 400, color: '#8B8680', marginLeft: 6 }}>
            {sectionOrder.length}
          </span>
        </div>
        <button
          onClick={() => setPanelOpen(false)}
          aria-label={t.close}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 30,
            height: 30,
            borderRadius: 6,
            color: '#8B8680',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            transition: 'background 120ms ease, color 120ms ease',
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#FAFAF7'; (e.currentTarget as HTMLElement).style.color = '#2D2D2D' }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'none'; (e.currentTarget as HTMLElement).style.color = '#8B8680' }}
        >
          <IconX size={14} />
        </button>
      </div>

      {/* Search */}
      <div style={{ padding: '12px 16px', flexShrink: 0, position: 'relative' }}>
        <span style={{
          position: 'absolute',
          left: 28,
          top: '50%',
          transform: 'translateY(-50%)',
          color: '#C4BFB9',
          pointerEvents: 'none',
          display: 'flex',
        }}>
          <IconSearch size={14} />
        </span>
        <input
          ref={searchRef}
          type="search"
          placeholder={t.searchPlaceholder}
          aria-label={t.searchPlaceholder}
          style={{
            width: '100%',
            height: 34,
            background: '#FAFAF7',
            border: '1px solid #DDD8CF',
            borderRadius: 6,
            fontSize: 13,
            color: '#2D2D2D',
            padding: '0 12px 0 34px',
            outline: 'none',
            fontFamily: 'inherit',
            transition: 'border-color 150ms ease',
          }}
          onFocus={e => { (e.target as HTMLInputElement).style.borderColor = '#A8B5A0' }}
          onBlur={e => { (e.target as HTMLInputElement).style.borderColor = '#DDD8CF' }}
        />
      </div>

      {/* Sections list */}
      <SectionsList />

      {/* Footer — Add section */}
      <div style={{
        flexShrink: 0,
        borderTop: '1px solid #EDE8DF',
        padding: '10px 12px',
      }}>
        <button
          aria-label={t.addSection}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            width: '100%',
            height: 38,
            padding: '0 12px',
            fontSize: 13,
            fontWeight: 500,
            color: '#A8B5A0',
            borderRadius: 8,
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontFamily: 'inherit',
            transition: 'background 120ms ease',
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#EEF2EC' }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'none' }}
        >
          <IconPlus size={14} />
          {t.addSection}
        </button>
      </div>
    </div>
  )
}
