'use client'

import { useEditorStore } from './store'
import type { Device } from '@/types/editor'

const DEVICES: { key: Device; icon: string; label: string }[] = [
  { key: 'desktop', icon: '🖥', label: 'Desktop' },
  { key: 'tablet',  icon: '💻', label: 'Tablet' },
  { key: 'mobile',  icon: '📱', label: 'Mobile' },
]

export default function DeviceSwitcher() {
  const device = useEditorStore(s => s.device)
  const setDevice = useEditorStore(s => s.setDevice)

  return (
    <div className="flex gap-1 bg-gray-100 p-1 rounded-lg">
      {DEVICES.map(d => (
        <button
          key={d.key}
          onClick={() => setDevice(d.key)}
          title={d.label}
          className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${
            device === d.key
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-400 hover:text-gray-600'
          }`}
        >
          {d.icon} {d.label}
        </button>
      ))}
    </div>
  )
}
