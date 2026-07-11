'use client'

import { HexColorPicker } from 'react-colorful'

interface ColorFieldProps {
  value: string
  onChange: (value: string) => void
  label: string
  helpText?: string
  error?: string
  disabled?: boolean
}

export function ColorField({ value, onChange, label, helpText, error, disabled }: ColorFieldProps) {
  return (
    <div style={{ display: 'block', marginBottom: '12px' }}>
      <span style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '4px' }}>{label}</span>
      <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
        <div style={{ pointerEvents: disabled ? 'none' : 'auto', opacity: disabled ? 0.5 : 1 }}>
          <HexColorPicker color={value || '#000000'} onChange={onChange} style={{ width: '100px', height: '100px' }} />
        </div>
        <label style={{ flex: 1 }}>
          <input
            type="text"
            value={value}
            onChange={e => onChange(e.target.value)}
            disabled={disabled}
            aria-invalid={!!error}
            aria-label={`${label} hex`}
            placeholder="#000000"
            style={{
              width: '100%',
              padding: '8px 10px',
              border: `1px solid ${error ? '#E53935' : '#E0E0E0'}`,
              borderRadius: '6px',
              fontSize: '13px',
              fontFamily: 'monospace',
              background: disabled ? '#F5F5F5' : '#FFF',
            }}
          />
        </label>
      </div>
      {helpText && !error && <span style={{ fontSize: '11px', color: '#888', display: 'block', marginTop: '2px' }}>{helpText}</span>}
      {error && <span style={{ fontSize: '11px', color: '#E53935', display: 'block', marginTop: '2px' }}>{error}</span>}
    </div>
  )
}
