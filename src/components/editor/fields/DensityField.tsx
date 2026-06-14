'use client'

import { SelectField } from './SelectField'

interface DensityFieldProps {
  value: string
  onChange: (value: 'sm' | 'md' | 'lg') => void
  label: string
  helpText?: string
  error?: string
  disabled?: boolean
}

const DENSITY_OPTIONS = [
  { value: 'sm', label: 'Compact (60px)' },
  { value: 'md', label: 'Normal (80px)' },
  { value: 'lg', label: 'Spacieux (120px)' },
]

export function DensityField({ value, onChange, label, helpText, error, disabled }: DensityFieldProps) {
  return (
    <SelectField
      value={value || 'md'}
      onChange={(v) => onChange(v as 'sm' | 'md' | 'lg')}
      label={label}
      options={DENSITY_OPTIONS}
      helpText={helpText}
      error={error}
      disabled={disabled}
    />
  )
}
