// @vitest-environment jsdom

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { render, fireEvent, screen, cleanup } from '@testing-library/react'
import React from 'react'
import { PanelRight } from '../PanelRight'
import { useEditorStore } from '../store'
import type { LandingPageData } from '@/types'
import type { SectionInstance } from '@/types/editor'

afterEach(cleanup)

const baseLandingData = {
  headline: 'H',
  subtitle: 'S',
  benefits: [],
  faq: [],
  cta: 'CTA',
  urgency: 'U',
  product_name: 'P',
  story: {
    hero_title: 'Titre story',
    problem: 'Problème ici',
    agitation: 'Agitation ici',
    solution: 'Solution',
    transformation: 'Transformation',
  },
} as unknown as LandingPageData

const sectionOrder: SectionInstance[] = [
  { id: 'id1', key: 'story', visible: true },
]

function resetStore() {
  useEditorStore.setState({
    templateId: '',
    landingData: baseLandingData,
    sectionOrder,
    visualSettings: {},
    globalStyles: {},
    sectionData: {},
    saveStatus: 'idle',
    lastSavedAt: null,
    selectedSectionId: null,
    panelMode: 'sections',
    device: 'desktop',
    panelOpen: false,
    subPanelEditOpen: false,
    editingSectionId: null,
    editForm: { title: '', subtitle: '' },
  })
}

describe('PanelRight', () => {
  beforeEach(resetStore)

  it('subPanelEditOpen=false → translateX(100%) (slide out)', () => {
    render(<PanelRight />)
    const panel = screen.getByTestId('panel-right')
    expect(panel.getAttribute('style')).toContain('translateX(100%)')
  })

  it('subPanelEditOpen=true → translateX(0) (slide in)', () => {
    useEditorStore.setState({ subPanelEditOpen: true })
    render(<PanelRight />)
    const panel = screen.getByTestId('panel-right')
    expect(panel.getAttribute('style')).toContain('translateX(0)')
  })

  it('editingSectionId="id1" + section story → labels du schema visibles', () => {
    useEditorStore.setState({ subPanelEditOpen: true, editingSectionId: 'id1' })
    render(<PanelRight />)
    expect(screen.getByText('Histoire (PAS)')).toBeTruthy()
    expect(screen.getByText('Titre')).toBeTruthy()
  })

  it('clic bouton fermer → setSubPanelEditOpen(false)', () => {
    useEditorStore.setState({ subPanelEditOpen: true, editingSectionId: 'id1' })
    const spy = vi.spyOn(useEditorStore.getState(), 'setSubPanelEditOpen')
    render(<PanelRight />)
    fireEvent.click(screen.getByLabelText('Fermer le panel'))
    expect(spy).toHaveBeenCalledWith(false)
    spy.mockRestore()
  })

  it('saveStatus="saved" + lastSavedAt → texte "Sauvegardé à HH:MM" visible', () => {
    const fixedDate = new Date(2026, 5, 14, 10, 30)
    useEditorStore.setState({ subPanelEditOpen: true, editingSectionId: 'id1', saveStatus: 'saved', lastSavedAt: fixedDate })
    render(<PanelRight />)
    expect(screen.getByText(/Sauvegardé à/)).toBeTruthy()
  })

  it('saveStatus="error" → bouton "réessayer" visible', () => {
    useEditorStore.setState({ subPanelEditOpen: true, editingSectionId: 'id1', saveStatus: 'error' })
    render(<PanelRight />)
    expect(screen.getByText(/réessayer/)).toBeTruthy()
  })
})
