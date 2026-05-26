// @vitest-environment jsdom
import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, cleanup } from '@testing-library/react'
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
      panelOpen: false,
      subPanelEditOpen: false,
      editingSectionId: null,
      editForm: { title: '', subtitle: '' },
    })
  })

  afterEach(() => {
    cleanup()
  })

  it('rend une row par section (via bouton eye toggle)', () => {
    render(React.createElement(SectionsList))
    const toggles = screen.getAllByRole('button', { name: /masquer|afficher/i })
    expect(toggles).toHaveLength(3)
  })

  it('toggle visible au clic sur le bouton eye', () => {
    render(React.createElement(SectionsList))
    const toggles = screen.getAllByRole('button', { name: /masquer|afficher/i })
    // id1 est visible → masquer
    fireEvent.click(toggles[0])
    const updated = useEditorStore.getState().sectionOrder.find(s => s.id === 'id1')
    expect(updated?.visible).toBe(false)
  })

  it('toggle inverse marche (section invisible → visible)', () => {
    render(React.createElement(SectionsList))
    const toggles = screen.getAllByRole('button', { name: /masquer|afficher/i })
    // id3 est invisible → afficher
    fireEvent.click(toggles[2])
    const updated = useEditorStore.getState().sectionOrder.find(s => s.id === 'id3')
    expect(updated?.visible).toBe(true)
  })

  it('selectionne la section au clic sur le label', () => {
    render(React.createElement(SectionsList))
    const labels = screen.getAllByRole('button', { name: /selectionner/i })
    fireEvent.click(labels[2])
    expect(useEditorStore.getState().selectedSectionId).toBe('id3')
  })

  it('clic label ouvre le panel', () => {
    render(React.createElement(SectionsList))
    const labels = screen.getAllByRole('button', { name: /selectionner/i })
    fireEvent.click(labels[0])
    expect(useEditorStore.getState().panelOpen).toBe(true)
  })

  it('bouton kebab est present pour chaque section', () => {
    render(React.createElement(SectionsList))
    const kebabs = screen.getAllByRole('button', { name: /plus d.actions/i })
    expect(kebabs).toHaveLength(3)
  })

  it('rend les labels corrects', () => {
    render(React.createElement(SectionsList))
    expect(screen.getByRole('button', { name: /Selectionner Bandeau social proof/i })).toBeDefined()
    expect(screen.getByRole('button', { name: /Selectionner Histoire/i })).toBeDefined()
    expect(screen.getByRole('button', { name: /Selectionner Temoignages/i })).toBeDefined()
  })
})
