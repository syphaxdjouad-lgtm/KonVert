// @vitest-environment jsdom
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { render, screen, fireEvent, cleanup } from '@testing-library/react'
import React from 'react'
import SubPanelEdit from '../SubPanelEdit'
import { useEditorStore } from '../store'
import type { SectionKey } from '@/lib/templates/sections'

const baseState = {
  subPanelEditOpen: true,
  editingSectionId: 'id-story',
  editForm: { title: 'Titre initial', subtitle: 'Sous-titre initial' },
  sectionOrder: [{ id: 'id-story', key: 'story' as SectionKey, visible: true }],
  selectedSectionId: 'id-story',
  panelOpen: true,
  panelMode: 'sections' as const,
  device: 'desktop' as const,
  templateId: 'etec-blue',
  landingData: { headline: '', subtitle: '', benefits: [], faq: [], cta: '', urgency: '', product_name: '' },
  visualSettings: {},
  globalStyles: {},
}

describe('SubPanelEdit', () => {
  beforeEach(() => {
    useEditorStore.setState({ ...baseState })
  })

  afterEach(() => {
    cleanup()
  })

  it('affiche le label de la section en cours d\'edition', () => {
    render(React.createElement(SubPanelEdit))
    // La section 'story' a le label 'Histoire (PAS)'
    expect(screen.getByText(/histoire/i)).toBeDefined()
  })

  it('le champ title est pre-rempli avec editForm.title', () => {
    render(React.createElement(SubPanelEdit))
    // Utilise l'id direct du champ
    const input = document.getElementById('edit-title') as HTMLInputElement
    expect(input).toBeTruthy()
    expect(input.value).toBe('Titre initial')
  })

  it('modification du champ title met a jour le draft local', () => {
    render(React.createElement(SubPanelEdit))
    const input = document.getElementById('edit-title') as HTMLInputElement
    fireEvent.change(input, { target: { value: 'Nouveau titre' } })
    expect(input.value).toBe('Nouveau titre')
    // le store n'est pas encore mis a jour (draft local)
    expect(useEditorStore.getState().editForm.title).toBe('Titre initial')
  })

  it('click Appliquer persiste dans le store et ferme le sub-panel', () => {
    render(React.createElement(SubPanelEdit))
    const input = document.getElementById('edit-title') as HTMLInputElement
    fireEvent.change(input, { target: { value: 'Nouveau titre' } })
    fireEvent.click(screen.getByRole('button', { name: /appliquer/i }))
    expect(useEditorStore.getState().editForm.title).toBe('Nouveau titre')
    expect(useEditorStore.getState().subPanelEditOpen).toBe(false)
  })

  it('click Annuler ne persiste pas et ferme le sub-panel', () => {
    render(React.createElement(SubPanelEdit))
    const input = document.getElementById('edit-title') as HTMLInputElement
    fireEvent.change(input, { target: { value: 'Modif non saved' } })
    // Annuler a name="Annuler" — on utilise l'aria-label qui matche le texte du bouton
    const cancelBtn = screen.getAllByRole('button').find(b => b.textContent?.trim() === 'Annuler')
    expect(cancelBtn).toBeTruthy()
    fireEvent.click(cancelBtn!)
    // store inchange
    expect(useEditorStore.getState().editForm.title).toBe('Titre initial')
    expect(useEditorStore.getState().subPanelEditOpen).toBe(false)
  })

  it('ESC ferme le sub-panel', () => {
    render(React.createElement(SubPanelEdit))
    fireEvent.keyDown(document, { key: 'Escape' })
    expect(useEditorStore.getState().subPanelEditOpen).toBe(false)
  })

  it('le panel est visuellement cache quand subPanelEditOpen=false', () => {
    useEditorStore.setState({ subPanelEditOpen: false })
    render(React.createElement(SubPanelEdit))
    const panel = screen.getByRole('dialog')
    expect((panel as HTMLElement).style.transform).toContain('translateX(100%)')
  })

  it('le panel est visible quand subPanelEditOpen=true', () => {
    render(React.createElement(SubPanelEdit))
    const panel = screen.getByRole('dialog')
    expect((panel as HTMLElement).style.transform).toBe('translateX(0)')
  })
})
