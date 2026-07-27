'use client'

import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { IconEdit, IconCopy, IconTrash } from './Icons'

// Labels i18n inline
const T = {
  fr: { edit: 'Editer', duplicate: 'Dupliquer', delete: 'Supprimer' },
  en: { edit: 'Edit', duplicate: 'Duplicate', delete: 'Delete' },
  ar: { edit: 'تعديل', duplicate: 'نسخ', delete: 'حذف' },
  es: { edit: 'Editar', duplicate: 'Duplicar', delete: 'Eliminar' },
} as const
const lang = 'fr'
const t = T[lang]

interface KebabMenuProps {
  sectionLabel: string
  anchorRef: React.RefObject<HTMLButtonElement | null>
  isOpen: boolean
  onClose: () => void
  onEdit: () => void
  onDuplicate: () => void
  onDelete: () => void
}

export default function KebabMenu({
  sectionLabel,
  anchorRef,
  isOpen,
  onClose,
  onEdit,
  onDuplicate,
  onDelete,
}: KebabMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null)

  // Close on ESC
  useEffect(() => {
    if (!isOpen) return
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        e.stopPropagation()
        onClose()
      }
    }
    document.addEventListener('keydown', onKeyDown, { capture: true })
    return () => document.removeEventListener('keydown', onKeyDown, { capture: true })
  }, [isOpen, onClose])

  // Close on click outside
  useEffect(() => {
    if (!isOpen) return
    function onClickOutside(e: MouseEvent) {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target as Node) &&
        anchorRef.current &&
        !anchorRef.current.contains(e.target as Node)
      ) {
        onClose()
      }
    }
    // Use mousedown so it fires before click events
    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [isOpen, onClose, anchorRef])

  // Position menu relative to anchor button. Lire anchorRef.current pendant
  // le render (comme le faisait l'ancienne getMenuStyle() appelée inline
  // dans le JSX) n'est pas fiable — le ref appartient à un autre composant
  // et React ne garantit pas sa valeur à jour avant le commit. On la lit
  // dans un useLayoutEffect (avant paint, pas de flash) et on stocke le
  // résultat en state.
  const [menuStyle, setMenuStyle] = useState<React.CSSProperties>({ display: 'none' })

  useLayoutEffect(() => {
    function computeMenuStyle() {
      if (!isOpen || !anchorRef.current) {
        setMenuStyle({ display: 'none' })
        return
      }
      const rect = anchorRef.current.getBoundingClientRect()
      setMenuStyle({
        position: 'fixed',
        top: rect.bottom + 4,
        right: window.innerWidth - rect.right,
        minWidth: 188,
      })
    }
    computeMenuStyle()
  }, [isOpen, anchorRef])

  return (
    <>
      {/* Invisible overlay to catch outside clicks (before the menu, z below) */}
      {isOpen && (
        <div
          aria-hidden="true"
          style={{ position: 'fixed', inset: 0, zIndex: 599 }}
          onMouseDown={onClose}
        />
      )}
      <div
        ref={menuRef}
        role="menu"
        aria-label={`Menu ${sectionLabel}`}
        style={{
          ...menuStyle,
          background: '#FFFFFF',
          border: '1px solid #EDE8DF',
          borderRadius: 8,
          boxShadow: '0 8px 32px rgba(0,0,0,0.10), 0 2px 8px rgba(0,0,0,0.06)',
          zIndex: 600,
          padding: '4px 0',
          opacity: isOpen ? 1 : 0,
          transform: isOpen ? 'scale(1) translateY(0)' : 'scale(0.96) translateY(-4px)',
          transformOrigin: 'top right',
          transition: 'opacity 140ms ease, transform 140ms ease',
          pointerEvents: isOpen ? 'all' : 'none',
        }}
      >
        <button
          role="menuitem"
          onClick={() => { onEdit(); onClose() }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            width: '100%',
            height: 34,
            padding: '0 14px',
            fontSize: 13,
            fontWeight: 400,
            color: '#2D2D2D',
            background: 'none',
            border: 'none',
            textAlign: 'left',
            cursor: 'pointer',
            fontFamily: 'inherit',
            transition: 'background 100ms ease',
          }}
          onMouseEnter={e => (e.currentTarget.style.background = '#FAFAF7')}
          onMouseLeave={e => (e.currentTarget.style.background = 'none')}
        >
          <IconEdit size={14} />
          {t.edit}
        </button>

        <button
          role="menuitem"
          onClick={() => { onDuplicate(); onClose() }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            width: '100%',
            height: 34,
            padding: '0 14px',
            fontSize: 13,
            fontWeight: 400,
            color: '#2D2D2D',
            background: 'none',
            border: 'none',
            textAlign: 'left',
            cursor: 'pointer',
            fontFamily: 'inherit',
            transition: 'background 100ms ease',
          }}
          onMouseEnter={e => (e.currentTarget.style.background = '#FAFAF7')}
          onMouseLeave={e => (e.currentTarget.style.background = 'none')}
        >
          <IconCopy size={14} />
          {t.duplicate}
        </button>

        {/* Separator */}
        <div style={{ height: 1, background: '#EDE8DF', margin: '4px 0' }} role="separator" />

        <button
          role="menuitem"
          onClick={() => { onDelete(); onClose() }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            width: '100%',
            height: 34,
            padding: '0 14px',
            fontSize: 13,
            fontWeight: 400,
            color: '#D9534F',
            background: 'none',
            border: 'none',
            textAlign: 'left',
            cursor: 'pointer',
            fontFamily: 'inherit',
            transition: 'background 100ms ease, color 100ms ease',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = '#FEF2F2' }}
          onMouseLeave={e => { e.currentTarget.style.background = 'none' }}
        >
          <IconTrash size={14} />
          {t.delete}
        </button>
      </div>
    </>
  )
}
