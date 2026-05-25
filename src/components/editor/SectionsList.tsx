'use client'

import { useEditorStore } from './store'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core'
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import type { SectionInstance } from '@/types/editor'

const SECTION_LABELS: Record<string, string> = {
  social_proof_bar:      'Bandeau social proof',
  story:                 "Histoire (PAS)",
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

function SectionRow({ section }: { section: SectionInstance }) {
  const toggleVisible = useEditorStore(s => s.toggleVisible)
  const removeSection = useEditorStore(s => s.removeSection)
  const setSelectedSection = useEditorStore(s => s.setSelectedSection)
  const selectedSectionId = useEditorStore(s => s.selectedSectionId)

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: section.id,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  const label = SECTION_LABELS[section.key] ?? section.key
  const isSelected = selectedSectionId === section.id

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-2 px-2 py-2 rounded-md border ${
        isSelected ? 'border-purple-500 bg-purple-50' : 'border-gray-200 bg-white hover:border-gray-300'
      }`}
    >
      <button
        {...attributes}
        {...listeners}
        aria-label="Drag handle"
        className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-700 text-base"
      >
        ⋮⋮
      </button>

      <button
        onClick={() => setSelectedSection(section.id)}
        aria-label={`Selectionner ${label}`}
        className={`flex-1 text-left text-sm font-medium ${section.visible ? 'text-gray-900' : 'text-gray-500 opacity-50'}`}
      >
        {label}
      </button>

      <button
        onClick={() => toggleVisible(section.id)}
        aria-label="Toggle visibility"
        title={section.visible ? 'Masquer la section' : 'Afficher la section'}
        className="w-7 h-7 rounded-md text-gray-500 hover:text-gray-800 hover:bg-gray-100 flex items-center justify-center text-sm"
      >
        {section.visible ? '👁' : '🚫'}
      </button>

      <button
        onClick={() => {
          if (confirm(`Supprimer la section "${label}" ?`)) removeSection(section.id)
        }}
        aria-label="Supprimer"
        title="Supprimer la section"
        className="w-7 h-7 rounded-md text-gray-400 hover:text-red-600 hover:bg-red-50 flex items-center justify-center text-sm"
      >
        🗑
      </button>
    </div>
  )
}

export default function SectionsList() {
  const sectionOrder = useEditorStore(s => s.sectionOrder)
  const moveSection = useEditorStore(s => s.moveSection)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  )

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (!over || active.id === over.id) return
    const fromIndex = sectionOrder.findIndex(s => s.id === active.id)
    const toIndex = sectionOrder.findIndex(s => s.id === over.id)
    if (fromIndex === -1 || toIndex === -1) return
    moveSection(fromIndex, toIndex)
  }

  return (
    <div className="flex flex-col gap-1 p-2">
      <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2 px-1">
        Sections ({sectionOrder.length})
      </h3>
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={sectionOrder.map(s => s.id)} strategy={verticalListSortingStrategy}>
          {sectionOrder.map(section => (
            <SectionRow key={section.id} section={section} />
          ))}
        </SortableContext>
      </DndContext>
    </div>
  )
}
