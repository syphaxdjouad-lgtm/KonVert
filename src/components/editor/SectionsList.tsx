'use client'

import { useRef, useState } from 'react'
import { useEditorStore } from './store'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  DragOverlay,
  type DragStartEvent,
  type Active,
} from '@dnd-kit/core'
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import type { SectionInstance } from '@/types/editor'
import { IconDragHandle, IconEye, IconEyeOff, IconKebab, IconPlus } from './Icons'
import KebabMenu from './KebabMenu'

// Labels i18n inline
const T = {
  fr: {
    sections: 'Sections',
    addSection: 'Ajouter une section',
    toggleShow: 'Afficher la section',
    toggleHide: 'Masquer la section',
    moreActions: 'Plus d\'actions',
    dragHandle: 'Déplacer',
  },
  en: {
    sections: 'Sections',
    addSection: 'Add a section',
    toggleShow: 'Show section',
    toggleHide: 'Hide section',
    moreActions: 'More actions',
    dragHandle: 'Drag to reorder',
  },
  ar: { sections: 'الأقسام', addSection: 'إضافة قسم', toggleShow: 'إظهار', toggleHide: 'إخفاء', moreActions: 'المزيد', dragHandle: 'سحب' },
  es: { sections: 'Secciones', addSection: 'Añadir sección', toggleShow: 'Mostrar', toggleHide: 'Ocultar', moreActions: 'Más', dragHandle: 'Arrastrar' },
} as const
const lang = 'fr'
const t = T[lang]

export const SECTION_LABELS: Record<string, string> = {
  social_proof_bar:      'Bandeau social proof',
  story:                 'Histoire (PAS)',
  target_audience:       "Pour qui c'est",
  features:              'Caracteristiques',
  gallery:               'Galerie produit',
  unique_mechanism:      'Mecanisme unique',
  how_it_works:          'Comment ca marche',
  before_after:          'Avant / Apres',
  comparison:            'Comparaison',
  competitor_comparison: 'Vs concurrents',
  testimonials:          'Temoignages',
  press_mentions:        'Mentions presse',
  founder_note:          'Mot du fondateur',
  value_stack:           'Recap valeur',
  bonuses:               'Bonus',
  guarantee:             'Garantie',
  risk_reversal:         'Reassurance',
  objections:            'Objections',
  community_callout:     'Communaute',
  final_pitch:           'Pitch final',
}

// ─── SectionRow ──────────────────────────────────────────────────────────────

interface SectionRowProps {
  section: SectionInstance
  isOverlay?: boolean
}

function SectionRow({ section, isOverlay = false }: SectionRowProps) {
  const toggleVisible = useEditorStore(s => s.toggleVisible)
  const removeSection = useEditorStore(s => s.removeSection)
  const duplicateSection = useEditorStore(s => s.duplicateSection)
  const setSelectedSection = useEditorStore(s => s.setSelectedSection)
  const selectedSectionId = useEditorStore(s => s.selectedSectionId)
  const openSubPanelEdit = useEditorStore(s => s.openSubPanelEdit)
  const setPanelOpen = useEditorStore(s => s.setPanelOpen)

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: section.id,
    disabled: isOverlay,
  })

  const [kebabOpen, setKebabOpen] = useState(false)
  const kebabRef = useRef<HTMLButtonElement | null>(null)

  const label = SECTION_LABELS[section.key] ?? section.key
  const isSelected = selectedSectionId === section.id

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition: isDragging ? 'none' : transition ?? undefined,
    opacity: isDragging ? 0.95 : 1,
    ...(isDragging && {
      transform: `${CSS.Transform.toString(transform) ?? ''} scale(1.02)`,
      boxShadow: '0 8px 24px rgba(0,0,0,0.08), 0 2px 8px rgba(0,0,0,0.05)',
      background: '#FFFFFF',
      zIndex: 10,
      position: 'relative' as const,
    }),
  }

  function handleRowClick(e: React.MouseEvent) {
    // Ignore clicks on action buttons
    if ((e.target as HTMLElement).closest('button')) return
    setSelectedSection(section.id)
    setPanelOpen(true)
  }

  function handleEdit() {
    setSelectedSection(section.id)
    openSubPanelEdit(section.id)
  }

  function handleDelete() {
    removeSection(section.id)
  }

  const rowStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    height: 44,
    padding: '0 8px',
    paddingLeft: isSelected ? 13 : 8,
    borderRadius: 8,
    cursor: 'grab',
    position: 'relative',
    userSelect: 'none',
    willChange: 'transform',
    borderLeft: isSelected ? '3px solid #A8B5A0' : '3px solid transparent',
    background: isSelected ? '#F5F1EB' : undefined,
    transition: 'background 120ms ease',
  }

  return (
    <>
      <div
        ref={setNodeRef}
        style={{ ...style }}
        data-testid={`section-row-${section.id}`}
      >
        <div
          style={rowStyle}
          onClick={handleRowClick}
          className="section-row-inner"
          onMouseEnter={e => {
            if (!isSelected) (e.currentTarget as HTMLElement).style.background = '#FAFAF7'
          }}
          onMouseLeave={e => {
            if (!isSelected) (e.currentTarget as HTMLElement).style.background = ''
          }}
        >
          {/* Drag handle */}
          <button
            {...attributes}
            {...listeners}
            aria-label={t.dragHandle}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 20,
              color: '#C4BFB9',
              flexShrink: 0,
              cursor: 'inherit',
              background: 'none',
              border: 'none',
              padding: 0,
            }}
          >
            <IconDragHandle size={16} />
          </button>

          {/* Label */}
          <button
            onClick={() => { setSelectedSection(section.id); setPanelOpen(true) }}
            aria-label={`Selectionner ${label}`}
            style={{
              flex: 1,
              textAlign: 'left',
              fontSize: 14,
              fontWeight: 600,
              color: '#2D2D2D',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontFamily: 'inherit',
              opacity: section.visible ? 1 : 0.38,
              fontStyle: section.visible ? 'normal' : 'italic',
            }}
          >
            {label}
          </button>

          {/* Actions (opacity 0, shown on hover via inline group) */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 2,
            }}
            className="section-actions"
          >
            {/* Eye toggle */}
            <button
              onClick={() => toggleVisible(section.id)}
              aria-label={section.visible ? t.toggleHide : t.toggleShow}
              title={section.visible ? t.toggleHide : t.toggleShow}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 28,
                height: 28,
                borderRadius: 6,
                color: section.visible ? '#8B8680' : '#C4BFB9',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                transition: 'background 120ms ease, color 120ms ease',
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#FAFAF7'; (e.currentTarget as HTMLElement).style.color = '#2D2D2D' }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'none'; (e.currentTarget as HTMLElement).style.color = section.visible ? '#8B8680' : '#C4BFB9' }}
            >
              {section.visible ? <IconEye size={14} /> : <IconEyeOff size={14} />}
            </button>

            {/* Kebab */}
            <button
              ref={kebabRef}
              onClick={() => setKebabOpen(o => !o)}
              aria-label={t.moreActions}
              aria-haspopup="menu"
              aria-expanded={kebabOpen}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 28,
                height: 28,
                borderRadius: 6,
                color: '#8B8680',
                background: kebabOpen ? '#F5F1EB' : 'none',
                border: 'none',
                cursor: 'pointer',
                transition: 'background 120ms ease, color 120ms ease',
              }}
              onMouseEnter={e => { if (!kebabOpen) (e.currentTarget as HTMLElement).style.background = '#FAFAF7' }}
              onMouseLeave={e => { if (!kebabOpen) (e.currentTarget as HTMLElement).style.background = 'none' }}
            >
              <IconKebab size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Kebab menu rendered via portal-style (fixed) */}
      <KebabMenu
        sectionId={section.id}
        sectionLabel={label}
        anchorRef={kebabRef}
        isOpen={kebabOpen}
        onClose={() => setKebabOpen(false)}
        onEdit={handleEdit}
        onDuplicate={() => duplicateSection(section.id)}
        onDelete={handleDelete}
      />
    </>
  )
}

// ─── SectionsList ─────────────────────────────────────────────────────────────

export default function SectionsList() {
  const sectionOrder = useEditorStore(s => s.sectionOrder)
  const moveSection = useEditorStore(s => s.moveSection)
  const [activeItem, setActiveItem] = useState<Active | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        delay: 150,
        tolerance: 5,
      },
    }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  )

  function handleDragStart(event: DragStartEvent) {
    setActiveItem(event.active)
  }

  function handleDragEnd(event: DragEndEvent) {
    setActiveItem(null)
    const { active, over } = event
    if (!over || active.id === over.id) return
    const fromIndex = sectionOrder.findIndex(s => s.id === active.id)
    const toIndex = sectionOrder.findIndex(s => s.id === over.id)
    if (fromIndex === -1 || toIndex === -1) return
    moveSection(fromIndex, toIndex)
  }

  const activeSection = activeItem
    ? sectionOrder.find(s => s.id === activeItem.id) ?? null
    : null

  return (
    <div
      style={{
        flex: 1,
        overflowY: 'auto',
        padding: '4px 12px 8px',
        scrollbarWidth: 'thin',
        scrollbarColor: '#DDD8CF transparent',
      }}
    >
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={sectionOrder.map(s => s.id)} strategy={verticalListSortingStrategy}>
          {sectionOrder.map(section => (
            <SectionRow key={section.id} section={section} />
          ))}
        </SortableContext>

        {/* Overlay for the dragged row — renders lifted copy with scale */}
        <DragOverlay adjustScale={false}>
          {activeSection ? (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              height: 44,
              padding: '0 8px',
              borderRadius: 8,
              background: '#FFFFFF',
              borderLeft: '3px solid #A8B5A0',
              boxShadow: '0 8px 24px rgba(0,0,0,0.10), 0 2px 8px rgba(0,0,0,0.06)',
              transform: 'scale(1.02)',
              opacity: 0.95,
              cursor: 'grabbing',
              userSelect: 'none',
              width: 296, // 320px panel - 24px padding
            }}>
              <IconDragHandle size={16} className="" />
              <span style={{
                flex: 1,
                fontSize: 14,
                fontWeight: 600,
                color: '#2D2D2D',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}>
                {SECTION_LABELS[activeSection.key] ?? activeSection.key}
              </span>
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  )
}
