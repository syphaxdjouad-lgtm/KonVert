'use client'

export interface SelectOption {
  value: string
  label: string
}

interface SelectFieldProps {
  value: string
  onChange: (value: string) => void
  label: string
  options: SelectOption[]
  helpText?: string
  error?: string
  disabled?: boolean
}

export function SelectField({ value, onChange, label, options, helpText, error, disabled }: SelectFieldProps) {
  return (
    <label style={{ display: 'block', marginBottom: '12px' }}>
      <span style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '4px' }}>{label}</span>
      <select
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
      >
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
      {helpText && !error && <span style={{ fontSize: '11px', color: '#888', display: 'block', marginTop: '2px' }}>{helpText}</span>}
      {error && <span style={{ fontSize: '11px', color: '#E53935', display: 'block', marginTop: '2px' }}>{error}</span>}
    </label>
  )
}
