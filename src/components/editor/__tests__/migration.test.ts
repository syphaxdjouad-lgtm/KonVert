import { describe, it, expect } from 'vitest'
import { hydrateFromPage } from '../store'
import { mockLandingDataFull } from '@/lib/templates/__fixtures__/mock-landing-data-full'
import { DEFAULT_ORDER } from '@/lib/templates/sections'
import type { SectionInstance } from '@/types/editor'

describe('hydrateFromPage (migration big bang)', () => {
  it('legacy page sans _editor_state : hydrate defaults depuis DEFAULT_ORDER', () => {
    const jsonContent = {
      ...mockLandingDataFull,
      _template_slug: 'etec-blue',
    }
    const state = hydrateFromPage(jsonContent)
    expect(state.templateId).toBe('etec-blue')
    expect(state.sectionOrder).toHaveLength(DEFAULT_ORDER.length)
    const storyInstance = state.sectionOrder.find(s => s.key === 'story')
    expect(storyInstance?.visible).toBe(true)
  })

  it('legacy page sans _template_slug : fallback etec-blue', () => {
    const jsonContent = { ...mockLandingDataFull }
    const state = hydrateFromPage(jsonContent)
    expect(state.templateId).toBe('etec-blue')
  })

  it('page recente avec _editor_state : preserve sectionOrder + settings', () => {
    const customSections: SectionInstance[] = [
      { id: 'custom-1', key: 'story', visible: true },
      { id: 'custom-2', key: 'testimonials', visible: false },
    ]
    const jsonContent = {
      ...mockLandingDataFull,
      _template_slug: 'etec-noir',
      _editor_state: {
        sectionOrder: customSections,
        visualSettings: { 'custom-1': { padding: 'lg' as const } },
        globalStyles: { primary: '#FF6B35' },
      },
    }
    const state = hydrateFromPage(jsonContent)
    expect(state.templateId).toBe('etec-noir')
    expect(state.sectionOrder).toEqual(customSections)
    expect(state.visualSettings['custom-1']?.padding).toBe('lg')
    expect(state.globalStyles.primary).toBe('#FF6B35')
  })

  it('chaque SectionInstance recoit un id unique non vide', () => {
    const jsonContent = { ...mockLandingDataFull, _template_slug: 'etec-blue' }
    const state = hydrateFromPage(jsonContent)
    const ids = state.sectionOrder.map(s => s.id)
    expect(new Set(ids).size).toBe(ids.length)
    expect(ids.every(id => id.length > 0)).toBe(true)
  })
})
