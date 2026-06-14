'use client'

interface ImageFieldProps {
  value: string
  onChange: (value: string) => void
  label: string
  helpText?: string
  error?: string
  disabled?: boolean
}

function isValidUrl(value: string): boolean {
  return value.startsWith('http://') || value.startsWith('https://')
}

export function ImageField({ value, onChange, label, helpText, error, disabled }: ImageFieldProps) {
  return (
    <div style={{ display: 'block', marginBottom: '12px' }}>
      <label style={{ display: 'block' }}>
        <span style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '4px' }}>
          {label}{' '}
          <span style={{ fontSize: '10px', color: '#888', fontWeight: 400, marginLeft: '4px' }}>
            (URL — upload en C3)
          </span>
        </span>
        <input
          type="text"
          placeholder="https://..."
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
      </label>
      {isValidUrl(value) && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={value}
          alt="preview"
          style={{
            display: 'block',
            marginTop: '6px',
            maxWidth: '100%',
            maxHeight: '120px',
            borderRadius: '6px',
            border: '1px solid #E0E0E0',
            objectFit: 'cover',
          }}
        />
      )}
      {helpText && !error && <span style={{ fontSize: '11px', color: '#888', display: 'block', marginTop: '2px' }}>{helpText}</span>}
      {error && <span style={{ fontSize: '11px', color: '#E53935', display: 'block', marginTop: '2px' }}>{error}</span>}
    </div>
  )
}
