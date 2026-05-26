'use client'

import { useEditorStore } from './store'
import type { Device } from '@/types/editor'
import { IconDesktop, IconTablet, IconMobile } from './Icons'

// Labels i18n inline
const T = {
  fr: { desktop: 'Bureau', tablet: 'Tablette', mobile: 'Mobile' },
  en: { desktop: 'Desktop', tablet: 'Tablet', mobile: 'Mobile' },
  ar: { desktop: 'سطح المكتب', tablet: 'جهاز لوحي', mobile: 'جوال' },
  es: { desktop: 'Escritorio', tablet: 'Tableta', mobile: 'Móvil' },
} as const
const lang = 'fr'
const t = T[lang]

const DEVICES: { key: Device; label: string; Icon: React.FC<{ size?: number; className?: string }> }[] = [
  { key: 'desktop', label: t.desktop, Icon: IconDesktop },
  { key: 'tablet',  label: t.tablet,  Icon: IconTablet },
  { key: 'mobile',  label: t.mobile,  Icon: IconMobile },
]

export default function DeviceSwitcher() {
  const device = useEditorStore(s => s.device)
  const setDevice = useEditorStore(s => s.setDevice)

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: 2,
      background: '#FAFAF7',
      border: '1px solid #EDE8DF',
      borderRadius: 8,
      padding: 3,
    }}>
      {DEVICES.map(({ key, label, Icon }) => {
        const isActive = device === key
        return (
          <button
            key={key}
            onClick={() => setDevice(key)}
            title={label}
            aria-label={label}
            aria-pressed={isActive}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 36,
              height: 30,
              borderRadius: 6,
              color: isActive ? '#2D2D2D' : '#8B8680',
              background: isActive ? '#FFFFFF' : 'none',
              border: 'none',
              cursor: 'pointer',
              boxShadow: isActive ? '0 1px 4px rgba(0,0,0,0.06)' : 'none',
              transition: 'background 150ms ease, color 150ms ease',
            }}
            onMouseEnter={e => { if (!isActive) { (e.currentTarget as HTMLElement).style.color = '#2D2D2D'; (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.8)' } }}
            onMouseLeave={e => { if (!isActive) { (e.currentTarget as HTMLElement).style.color = '#8B8680'; (e.currentTarget as HTMLElement).style.background = 'none' } }}
          >
            <Icon size={16} />
          </button>
        )
      })}
    </div>
  )
}
