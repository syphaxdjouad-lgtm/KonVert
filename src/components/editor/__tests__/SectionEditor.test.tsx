// @vitest-environment jsdom

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, fireEvent, screen, cleanup } from '@testing-library/react'
import React from 'react'
import { SectionEditor } from '../SectionEditor'
import { useEditorStore } from '../store'
import type { LandingPageData } from '@/types'

afterEach(cleanup)

// Cast volontaire — le schema C2 référence story.hero_title (planifié) mais
// le type LandingPageData.story n'inclut pas encore hero_title. Le rendering
// est tolérant aux undefined via getNestedValue.
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
    solution: 'Solution ici',
    transformation: 'Transformation ici',
  },
} as unknown as LandingPageData

describe('SectionEditor', () => {
  beforeEach(() => {
    useEditorStore.setState({
      templateId: '',
      landingData: baseLandingData,
      sectionOrder: [],
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
  })

  it('rend les labels du schema story', () => {
    render(<SectionEditor sectionId="sec-1" sectionKey="story" />)
    // Le schema story a "Titre", "Problème", "Solution", "Transformation"
    expect(screen.getByText('Titre')).toBeTruthy()
    expect(screen.getByText('Problème')).toBeTruthy()
  })

  it('changement TextField → updateSectionField appelé avec bon path', () => {
    const updateSpy = vi.spyOn(useEditorStore.getState(), 'updateSectionField')
    render(<SectionEditor sectionId="sec-1" sectionKey="story" />)
    const titleInput = screen.getAllByRole('textbox')[0] as HTMLInputElement
    fireEvent.change(titleInput, { target: { value: 'Nouveau titre' } })
    expect(updateSpy).toHaveBeenCalledWith('sec-1', 'story.hero_title', 'Nouveau titre')
    updateSpy.mockRestore()
  })

  it('section inconnue → message "Editor non disponible"', () => {
    render(<SectionEditor sectionId="sec-x" sectionKey={'inconnue' as never} />)
    expect(screen.getByText(/Editor non disponible/)).toBeTruthy()
  })

  it('field target=visualSettings → updateVisualSetting appelé (pas updateSectionField)', () => {
    const updateVisualSpy = vi.spyOn(useEditorStore.getState(), 'updateVisualSetting')
    const updateFieldSpy = vi.spyOn(useEditorStore.getState(), 'updateSectionField')
    render(<SectionEditor sectionId="sec-1" sectionKey="story" />)
    // Le schema story a un group Style avec padding (density) — sélecteur "Densité"
    // Trouvons le combobox density
    const combos = screen.getAllByRole('combobox') as HTMLSelectElement[]
    // Premier combo = "Densité" (density), 2e = alignment
    const densityCombo = combos[0]
    fireEvent.change(densityCombo, { target: { value: 'lg' } })
    expect(updateVisualSpy).toHaveBeenCalledWith('sec-1', { padding: 'lg' })
    expect(updateFieldSpy).not.toHaveBeenCalled()
    updateVisualSpy.mockRestore()
    updateFieldSpy.mockRestore()
  })
})
