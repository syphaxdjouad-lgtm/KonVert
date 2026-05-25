'use client'

import { useEditorStore } from './store'
import SectionsList from './SectionsList'

export default function PanelLeft() {
  const panelMode = useEditorStore(s => s.panelMode)

  return (
    <div className="w-80 bg-gray-50 border-r border-gray-200 overflow-y-auto flex-shrink-0">
      {panelMode === 'sections' && <SectionsList />}
      {panelMode === 'blocks' && (
        <div className="p-4 text-sm text-gray-500">
          Bibliothèque de blocks à venir (chantier C4)
        </div>
      )}
      {panelMode === 'styles' && (
        <div className="p-4 text-sm text-gray-500">
          Palette globale à venir (chantier C5)
        </div>
      )}
      {panelMode === 'settings' && (
        <div className="p-4 text-sm text-gray-500">
          Réglages page à venir
        </div>
      )}
    </div>
  )
}
