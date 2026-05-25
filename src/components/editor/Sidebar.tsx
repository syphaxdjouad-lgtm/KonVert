'use client'

import { useEditorStore } from './store'
import type { PanelMode } from '@/types/editor'

interface IconButton {
  mode: PanelMode
  icon: string
  label: string
  disabled?: boolean  // C1 : seul "sections" est actif
}

const BUTTONS: IconButton[] = [
  { mode: 'sections', icon: '📑', label: 'Sections' },
  { mode: 'blocks',   icon: '🧩', label: 'Blocks (C4)',   disabled: true },
  { mode: 'styles',   icon: '🎨', label: 'Styles (C5)',   disabled: true },
  { mode: 'settings', icon: '⚙️', label: 'Settings (C2)', disabled: true },
]

export default function Sidebar() {
  const panelMode = useEditorStore(s => s.panelMode)
  const setPanelMode = useEditorStore(s => s.setPanelMode)

  return (
    <aside className="flex flex-col items-center gap-2 bg-gray-900 py-3 px-2 w-12 flex-shrink-0">
      {BUTTONS.map(btn => (
        <button
          key={btn.mode}
          onClick={() => !btn.disabled && setPanelMode(btn.mode)}
          disabled={btn.disabled}
          title={btn.label}
          className={`w-8 h-8 rounded-md flex items-center justify-center text-base transition-all ${
            btn.disabled
              ? 'opacity-30 cursor-not-allowed'
              : panelMode === btn.mode
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-gray-400 hover:bg-gray-800 hover:text-white'
          }`}
        >
          {btn.icon}
        </button>
      ))}
    </aside>
  )
}
