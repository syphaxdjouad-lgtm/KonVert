'use client'

import { useEffect, useState } from 'react'
import { useEditorStore } from './store'
import { IconX, IconImage } from './Icons'
import { SECTION_LABELS } from './SectionsList'

// Labels i18n inline
const T = {
  fr: {
    editing: 'Editer',
    titleLabel: 'Titre',
    titlePlaceholder: 'Titre de la section',
    subtitleLabel: 'Sous-titre',
    subtitlePlaceholder: 'Description courte...',
    imageLabel: 'Image principale',
    imagePlaceholder: 'Cliquer pour uploader',
    imageHint: 'Upload complet en C2',
    apply: 'Appliquer',
    cancel: 'Annuler',
    c2Badge: 'Upload complet en C2',
  },
  en: {
    editing: 'Edit',
    titleLabel: 'Title',
    titlePlaceholder: 'Section title',
    subtitleLabel: 'Subtitle',
    subtitlePlaceholder: 'Short description...',
    imageLabel: 'Main image',
    imagePlaceholder: 'Click to upload',
    imageHint: 'Full upload in C2',
    apply: 'Apply',
    cancel: 'Cancel',
    c2Badge: 'Full upload in C2',
  },
  ar: { editing: 'تعديل', titleLabel: 'العنوان', titlePlaceholder: 'عنوان القسم', subtitleLabel: 'العنوان الفرعي', subtitlePlaceholder: 'وصف قصير...', imageLabel: 'الصورة الرئيسية', imagePlaceholder: 'انقر للرفع', imageHint: 'C2', apply: 'تطبيق', cancel: 'إلغاء', c2Badge: 'رفع كامل في C2' },
  es: { editing: 'Editar', titleLabel: 'Título', titlePlaceholder: 'Título de sección', subtitleLabel: 'Subtítulo', subtitlePlaceholder: 'Descripción corta...', imageLabel: 'Imagen principal', imagePlaceholder: 'Clic para subir', imageHint: 'Upload completo en C2', apply: 'Aplicar', cancel: 'Cancelar', c2Badge: 'Upload completo en C2' },
} as const
const lang = 'fr'
const t = T[lang]

const TOPBAR_H = 52

export default function SubPanelEdit() {
  const subPanelEditOpen = useEditorStore(s => s.subPanelEditOpen)
  const editingSectionId = useEditorStore(s => s.editingSectionId)
  const editForm = useEditorStore(s => s.editForm)
  const setSubPanelEditOpen = useEditorStore(s => s.setSubPanelEditOpen)
  const setEditForm = useEditorStore(s => s.setEditForm)

  // editingSectionId is an instance uuid — we look up the section key via sectionOrder
  const sectionOrder = useEditorStore(s => s.sectionOrder)
  const editingSection = editingSectionId ? sectionOrder.find(s => s.id === editingSectionId) : undefined
  const sectionLabel = editingSection ? (SECTION_LABELS[editingSection.key] ?? editingSection.key) : (editingSectionId ?? '')

  // Local draft state — applied only on "Appliquer"
  const [draft, setDraft] = useState({ title: editForm.title, subtitle: editForm.subtitle })

  // Sync draft when a new section opens for editing
  useEffect(() => {
    if (subPanelEditOpen) {
      setDraft({ title: editForm.title, subtitle: editForm.subtitle })
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editingSectionId, subPanelEditOpen])

  // ESC closes this sub-panel (priority 2 in cascade)
  useEffect(() => {
    if (!subPanelEditOpen) return
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        e.stopPropagation()
        setSubPanelEditOpen(false)
      }
    }
    document.addEventListener('keydown', onKeyDown, { capture: true })
    return () => document.removeEventListener('keydown', onKeyDown, { capture: true })
  }, [subPanelEditOpen, setSubPanelEditOpen])

  function handleApply() {
    setEditForm(draft)
    // C1: just log. Real save comes in C2.
    console.log('[SubPanelEdit] Apply', { sectionId: editingSectionId, draft })
    setSubPanelEditOpen(false)
  }

  function handleCancel() {
    setDraft({ title: editForm.title, subtitle: editForm.subtitle })
    setSubPanelEditOpen(false)
  }

  return (
    <div
      aria-label={`${t.editing} : ${sectionLabel}`}
      role="dialog"
      aria-modal="true"
      style={{
        position: 'fixed',
        right: 0,
        top: TOPBAR_H,
        width: 320,
        height: `calc(100vh - ${TOPBAR_H}px)`,
        background: '#FFFFFF',
        borderLeft: '1px solid #EDE8DF',
        boxShadow: '-4px 0 24px rgba(0,0,0,0.05), -1px 0 4px rgba(0,0,0,0.03)',
        zIndex: 300,
        display: 'flex',
        flexDirection: 'column',
        transform: subPanelEditOpen ? 'translateX(0)' : 'translateX(100%)',
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
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <span style={{
            fontSize: 10,
            fontWeight: 500,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: '#C4BFB9',
          }}>
            {t.editing}
          </span>
          <span style={{
            fontSize: 15,
            fontWeight: 600,
            color: '#2D2D2D',
            letterSpacing: '-0.01em',
          }}>
            {sectionLabel || '—'}
          </span>
        </div>
        <button
          onClick={handleCancel}
          aria-label="Fermer"
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
          <IconX size={15} />
        </button>
      </div>

      {/* Divider */}
      <div style={{ height: 1, background: '#EDE8DF', margin: '14px 20px 0' }} />

      {/* Body */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '20px 20px 24px',
        display: 'flex',
        flexDirection: 'column',
        gap: 20,
      }}>
        {/* Title field */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <label
            htmlFor="edit-title"
            style={{ fontSize: 12, fontWeight: 500, color: '#8B8680', letterSpacing: '0.01em' }}
          >
            {t.titleLabel}
          </label>
          <input
            id="edit-title"
            type="text"
            value={draft.title}
            onChange={e => setDraft(d => ({ ...d, title: e.target.value }))}
            placeholder={t.titlePlaceholder}
            style={{
              width: '100%',
              height: 38,
              background: '#FAFAF7',
              border: '1px solid #DDD8CF',
              borderRadius: 6,
              fontSize: 14,
              color: '#2D2D2D',
              padding: '0 12px',
              outline: 'none',
              fontFamily: 'inherit',
              transition: 'border-color 150ms ease',
            }}
            onFocus={e => { (e.target as HTMLInputElement).style.borderColor = '#A8B5A0'; (e.target as HTMLInputElement).style.background = '#FFFFFF' }}
            onBlur={e => { (e.target as HTMLInputElement).style.borderColor = '#DDD8CF'; (e.target as HTMLInputElement).style.background = '#FAFAF7' }}
          />
        </div>

        {/* Subtitle field */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <label
            htmlFor="edit-subtitle"
            style={{ fontSize: 12, fontWeight: 500, color: '#8B8680', letterSpacing: '0.01em' }}
          >
            {t.subtitleLabel}
          </label>
          <textarea
            id="edit-subtitle"
            value={draft.subtitle}
            onChange={e => setDraft(d => ({ ...d, subtitle: e.target.value }))}
            placeholder={t.subtitlePlaceholder}
            rows={4}
            style={{
              width: '100%',
              minHeight: 100,
              background: '#FAFAF7',
              border: '1px solid #DDD8CF',
              borderRadius: 6,
              fontSize: 14,
              color: '#2D2D2D',
              padding: '10px 12px',
              outline: 'none',
              resize: 'vertical',
              lineHeight: 1.6,
              fontFamily: 'inherit',
              transition: 'border-color 150ms ease',
            }}
            onFocus={e => { (e.target as HTMLTextAreaElement).style.borderColor = '#A8B5A0'; (e.target as HTMLTextAreaElement).style.background = '#FFFFFF' }}
            onBlur={e => { (e.target as HTMLTextAreaElement).style.borderColor = '#DDD8CF'; (e.target as HTMLTextAreaElement).style.background = '#FAFAF7' }}
          />
        </div>

        {/* Image placeholder */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <label style={{ fontSize: 12, fontWeight: 500, color: '#8B8680', letterSpacing: '0.01em' }}>
              {t.imageLabel}
            </label>
            {/* C2 badge */}
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 5,
              fontSize: 11,
              fontWeight: 500,
              color: '#C4BFB9',
              background: '#FAFAF7',
              border: '1px solid #EDE8DF',
              borderRadius: 4,
              padding: '3px 8px',
            }}>
              {t.c2Badge}
            </span>
          </div>
          <div
            role="button"
            tabIndex={0}
            aria-label={t.imagePlaceholder}
            style={{
              width: '100%',
              height: 80,
              background: '#FAFAF7',
              border: '1px dashed #DDD8CF',
              borderRadius: 6,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              fontSize: 13,
              color: '#C4BFB9',
              cursor: 'pointer',
              transition: 'border-color 150ms ease, background 150ms ease',
            }}
            onMouseEnter={e => {
              const el = e.currentTarget as HTMLElement
              el.style.borderColor = '#A8B5A0'
              el.style.background = '#EEF2EC'
              el.style.color = '#A8B5A0'
            }}
            onMouseLeave={e => {
              const el = e.currentTarget as HTMLElement
              el.style.borderColor = '#DDD8CF'
              el.style.background = '#FAFAF7'
              el.style.color = '#C4BFB9'
            }}
          >
            <IconImage size={16} />
            {t.imagePlaceholder}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{
        flexShrink: 0,
        borderTop: '1px solid #EDE8DF',
        padding: '14px 20px',
        display: 'flex',
        gap: 8,
      }}>
        <button
          onClick={handleApply}
          style={{
            flex: 1,
            height: 38,
            background: '#2D2D2D',
            color: '#FFFFFF',
            fontSize: 13,
            fontWeight: 500,
            borderRadius: 8,
            border: 'none',
            cursor: 'pointer',
            fontFamily: 'inherit',
            transition: 'background 150ms ease',
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = '#3D3D3D' }}
          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = '#2D2D2D' }}
        >
          {t.apply}
        </button>
        <button
          onClick={handleCancel}
          style={{
            height: 38,
            padding: '0 16px',
            fontSize: 13,
            fontWeight: 400,
            color: '#8B8680',
            border: '1px solid #DDD8CF',
            borderRadius: 8,
            background: 'none',
            cursor: 'pointer',
            fontFamily: 'inherit',
            transition: 'background 150ms ease, border-color 150ms ease',
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = '#F5F1EB'; (e.currentTarget as HTMLButtonElement).style.borderColor = '#A8B5A0' }}
          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'none'; (e.currentTarget as HTMLButtonElement).style.borderColor = '#DDD8CF' }}
        >
          {t.cancel}
        </button>
      </div>
    </div>
  )
}
