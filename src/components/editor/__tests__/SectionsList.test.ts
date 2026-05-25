// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import SectionsList from '../SectionsList'
import { useEditorStore } from '../store'
import type { SectionInstance } from '@/types/editor'
import React from 'react'

const fakeSections: SectionInstance[] = [
  { id: 'id1', key: 'social_proof_bar', visible: true },
  { id: 'id2', key: 'story', visible: true },
  { id: 'id3', key: 'testimonials', visible: false },
]

describe('SectionsList', () => {
  beforeEach(() => {
    useEditorStore.setState({
      sectionOrder: [...fakeSections],
      selectedSectionId: null,
    })
    // Stub confirm() pour les tests de suppression
    global.confirm = () => true
  })

  it('rend une row par section', () => {
    render(React.createElement(SectionsList))
    const toggles = screen.getAllByRole('button', { name: /Toggle visibility/i })
    expect(toggles).toHaveLength(3)
  })

  it('toggle visible au clic sur le bouton visibility', () => {
    render(React.createElement(SectionsList))
    const toggles = screen.getAllByRole('button', { name: /Toggle visibility/i })
    fireEvent.click(toggles[0])
    const updated = useEditorStore.getState().sectionOrder.find(s => s.id === 'id1')
    expect(updated?.visible).toBe(false)
  })

  it('supprime au clic sur le bouton supprimer (confirm = true)', () => {
    render(React.createElement(SectionsList))
    const removeButtons = screen.getAllByRole('button', { name: /Supprimer/i })
    fireEvent.click(removeButtons[1])
    const order = useEditorStore.getState().sectionOrder
    expect(order).toHaveLength(2)
    expect(order.map(s => s.id)).toEqual(['id1', 'id3'])
  })

  it('selectionne la section au clic sur le label', () => {
    render(React.createElement(SectionsList))
    const labels = screen.getAllByRole('button', { name: /Selectionner/i })
    fireEvent.click(labels[2])
    expect(useEditorStore.getState().selectedSectionId).toBe('id3')
  })

  it('affiche une opacite reduite pour les sections invisibles', () => {
    render(React.createElement(SectionsList))
    const labels = screen.getAllByRole('button', { name: /Selectionner/i })
    expect(labels[2].className).toContain('opacity-50')
  })
})
