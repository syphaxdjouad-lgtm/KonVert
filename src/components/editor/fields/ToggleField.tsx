'use client'

interface ToggleFieldProps {
  value: boolean
  onChange: (value: boolean) => void
  label: string
  helpText?: string
  error?: string
  disabled?: boolean
}

export function ToggleField({ value, onChange, label, helpText, error, disabled }: ToggleFieldProps) {
  return (
    <div style={{ display: 'block', marginBottom: '12px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '12px', fontWeight: 600 }}>{label}</span>
        <button
          type="button"
          role="switch"
          aria-checked={value}
          aria-label={label}
          onClick={() => !disabled && onChange(!value)}
          disabled={disabled}
          style={{
            position: 'relative',
            width: '36px',
            height: '20px',
            borderRadius: '999px',
            border: 0,
            cursor: disabled ? 'not-allowed' : 'pointer',
            background: value ? '#1a7' : '#CCC',
            transition: 'background 160ms',
            padding: 0,
            opacity: disabled ? 0.5 : 1,
          }}
        >
          <span
            style={{
              position: 'absolute',
              top: '2px',
              left: value ? '18px' : '2px',
              width: '16px',
              height: '16px',
              background: '#FFF',
              borderRadius: '50%',
              transition: 'left 160ms',
            }}
          />
        </button>
      </div>
      {helpText && !error && <span style={{ fontSize: '11px', color: '#888', display: 'block', marginTop: '2px' }}>{helpText}</span>}
      {error && <span style={{ fontSize: '11px', color: '#E53935', display: 'block', marginTop: '2px' }}>{error}</span>}
    </div>
  )
}
