// @vitest-environment jsdom

import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, fireEvent, screen, cleanup } from '@testing-library/react'
import React from 'react'

afterEach(cleanup)
import {
  TextField,
  TextAreaField,
  ImageField,
  ColorField,
  ToggleField,
  SelectField,
  DensityField,
} from '../../fields'

describe('TextField', () => {
  it('rend le label', () => {
    render(<TextField value="" onChange={() => {}} label="Titre" />)
    expect(screen.getByText('Titre')).toBeTruthy()
  })

  it('appelle onChange avec la nouvelle valeur', () => {
    const onChange = vi.fn()
    render(<TextField value="" onChange={onChange} label="Titre" />)
    const input = screen.getByRole('textbox') as HTMLInputElement
    fireEvent.change(input, { target: { value: 'Bonjour' } })
    expect(onChange).toHaveBeenCalledWith('Bonjour')
  })

  it('disabled rend le champ disabled', () => {
    render(<TextField value="" onChange={() => {}} label="Titre" disabled />)
    expect((screen.getByRole('textbox') as HTMLInputElement).disabled).toBe(true)
  })

  it('error affiche le message', () => {
    render(<TextField value="" onChange={() => {}} label="Titre" error="Champ requis" />)
    expect(screen.getByText('Champ requis')).toBeTruthy()
  })
})

describe('TextAreaField', () => {
  it('rend le label', () => {
    render(<TextAreaField value="" onChange={() => {}} label="Description" />)
    expect(screen.getByText('Description')).toBeTruthy()
  })

  it('appelle onChange avec la nouvelle valeur', () => {
    const onChange = vi.fn()
    render(<TextAreaField value="" onChange={onChange} label="Description" />)
    const ta = screen.getByRole('textbox') as HTMLTextAreaElement
    fireEvent.change(ta, { target: { value: 'Texte long' } })
    expect(onChange).toHaveBeenCalledWith('Texte long')
  })

  it('rows par defaut à 4', () => {
    render(<TextAreaField value="" onChange={() => {}} label="Desc" />)
    expect((screen.getByRole('textbox') as HTMLTextAreaElement).rows).toBe(4)
  })

  it('disabled rend le champ disabled', () => {
    render(<TextAreaField value="" onChange={() => {}} label="Desc" disabled />)
    expect((screen.getByRole('textbox') as HTMLTextAreaElement).disabled).toBe(true)
  })
})

describe('ImageField', () => {
  it('rend le label avec badge "URL"', () => {
    render(<ImageField value="" onChange={() => {}} label="Image hero" />)
    expect(screen.getByText('Image hero')).toBeTruthy()
    expect(screen.getByText(/URL/)).toBeTruthy()
  })

  it('URL valide → preview <img> visible', () => {
    render(<ImageField value="https://example.com/cat.jpg" onChange={() => {}} label="Image" />)
    const img = screen.getByAltText('preview') as HTMLImageElement
    expect(img.src).toBe('https://example.com/cat.jpg')
  })

  it('URL vide → pas de preview', () => {
    render(<ImageField value="" onChange={() => {}} label="Image" />)
    expect(screen.queryByAltText('preview')).toBeNull()
  })

  it('appelle onChange avec la nouvelle URL', () => {
    const onChange = vi.fn()
    render(<ImageField value="" onChange={onChange} label="Image" />)
    const input = screen.getByRole('textbox') as HTMLInputElement
    fireEvent.change(input, { target: { value: 'https://x.com/img.png' } })
    expect(onChange).toHaveBeenCalledWith('https://x.com/img.png')
  })
})

describe('ColorField', () => {
  it('rend le label', () => {
    render(<ColorField value="#FF0000" onChange={() => {}} label="Couleur fond" />)
    expect(screen.getByText('Couleur fond')).toBeTruthy()
  })

  it('appelle onChange avec hex via input texte', () => {
    const onChange = vi.fn()
    render(<ColorField value="#000000" onChange={onChange} label="Couleur" />)
    const input = screen.getByLabelText(/hex/i) as HTMLInputElement
    fireEvent.change(input, { target: { value: '#FF0000' } })
    expect(onChange).toHaveBeenCalledWith('#FF0000')
  })

  it('rend le picker HexColorPicker (react-colorful)', () => {
    const { container } = render(<ColorField value="#000000" onChange={() => {}} label="Couleur" />)
    expect(container.querySelector('.react-colorful')).toBeTruthy()
  })
})

describe('ToggleField', () => {
  it('rend le label avec aria role=switch', () => {
    render(<ToggleField value={false} onChange={() => {}} label="Afficher badge" />)
    expect(screen.getByRole('switch')).toBeTruthy()
    expect(screen.getByText('Afficher badge')).toBeTruthy()
  })

  it('aria-checked reflete value', () => {
    render(<ToggleField value={true} onChange={() => {}} label="Switch" />)
    expect(screen.getByRole('switch').getAttribute('aria-checked')).toBe('true')
  })

  it('clic toggle onChange(!value)', () => {
    const onChange = vi.fn()
    render(<ToggleField value={false} onChange={onChange} label="Switch" />)
    fireEvent.click(screen.getByRole('switch'))
    expect(onChange).toHaveBeenCalledWith(true)
  })

  it('disabled ne trigger pas onChange au clic', () => {
    const onChange = vi.fn()
    render(<ToggleField value={false} onChange={onChange} label="Switch" disabled />)
    fireEvent.click(screen.getByRole('switch'))
    expect(onChange).not.toHaveBeenCalled()
  })
})

describe('SelectField', () => {
  const options = [{ value: 'a', label: 'A' }, { value: 'b', label: 'B' }]

  it('rend les options', () => {
    render(<SelectField value="a" onChange={() => {}} label="Choix" options={options} />)
    expect(screen.getByRole('option', { name: 'A' })).toBeTruthy()
    expect(screen.getByRole('option', { name: 'B' })).toBeTruthy()
  })

  it('appelle onChange avec la valeur selectionnee', () => {
    const onChange = vi.fn()
    render(<SelectField value="a" onChange={onChange} label="Choix" options={options} />)
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'b' } })
    expect(onChange).toHaveBeenCalledWith('b')
  })

  it('disabled rend le select disabled', () => {
    render(<SelectField value="a" onChange={() => {}} label="Choix" options={options} disabled />)
    expect((screen.getByRole('combobox') as HTMLSelectElement).disabled).toBe(true)
  })
})

describe('DensityField', () => {
  it('rend les 3 options sm/md/lg', () => {
    render(<DensityField value="md" onChange={() => {}} label="Padding" />)
    expect(screen.getByText(/Compact \(60px\)/)).toBeTruthy()
    expect(screen.getByText(/Normal \(80px\)/)).toBeTruthy()
    expect(screen.getByText(/Spacieux \(120px\)/)).toBeTruthy()
  })

  it('appelle onChange avec sm/md/lg', () => {
    const onChange = vi.fn()
    render(<DensityField value="md" onChange={onChange} label="Padding" />)
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'lg' } })
    expect(onChange).toHaveBeenCalledWith('lg')
  })
})
