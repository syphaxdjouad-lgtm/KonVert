'use client'

interface TextFieldProps {
  value: string
  onChange: (value: string) => void
  label: string
  helpText?: string
  error?: string
  disabled?: boolean
}

export function TextField({ value, onChange, label, helpText, error, disabled }: TextFieldProps) {
  return (
    <label style={{ display: 'block', marginBottom: '12px' }}>
      <span style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '4px' }}>{label}</span>
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        disabled={disabled}
        aria-invalid={!!error}
        style={{
          width: '100%',
          padding: '8px 10px',
          border: `1px solid ${error ? '#E53935' : '#E0E0E0'}`,
          borderRadius: '6px',
          fontSize: '13px',
          background: disabled ? '#F5F5F5' : '#FFF',
        }}
      />
      {helpText && !error && <span style={{ fontSize: '11px', color: '#888', display: 'block', marginTop: '2px' }}>{helpText}</span>}
      {error && <span style={{ fontSize: '11px', color: '#E53935', display: 'block', marginTop: '2px' }}>{error}</span>}
    </label>
  )
}
