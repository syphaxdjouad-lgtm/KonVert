// @vitest-environment jsdom

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, waitFor } from '@testing-library/react'
import PreviewIframe from '../PreviewIframe'
import { useEditorStore } from '../store'
import { mockLandingDataFull } from '@/lib/templates/__fixtures__/mock-landing-data-full'
import { DEFAULT_ORDER } from '@/lib/templates/sections'
import { v4 as uuidv4 } from 'uuid'
import React from 'react'

describe('PreviewIframe', () => {
  beforeEach(() => {
    useEditorStore.setState({
      templateId: 'etec-blue',
      landingData: mockLandingDataFull,
      sectionOrder: DEFAULT_ORDER.map(key => ({
        id: uuidv4(),
        key,
        visible: true,
      })),
      visualSettings: {},
      globalStyles: {},
      device: 'desktop',
    })
  })

  it('rend un <iframe> dans le DOM', () => {
    render(React.createElement(PreviewIframe))
    const iframe = document.querySelector('iframe')
    expect(iframe).toBeTruthy()
  })

  it('definit srcdoc avec le rendu de renderTemplate apres le debounce', async () => {
    vi.useFakeTimers()
    render(React.createElement(PreviewIframe))
    const iframe = document.querySelector('iframe')!
    vi.advanceTimersByTime(250)
    vi.useRealTimers()
    await waitFor(() => {
      expect(iframe.getAttribute('srcdoc') || iframe.getAttribute('srcDoc')).toContain('<!DOCTYPE html')
    })
  })

  it('change la largeur selon le device', () => {
    useEditorStore.setState({ device: 'mobile' })
    render(React.createElement(PreviewIframe))
    const wrapper = document.querySelector('[data-testid="preview-wrapper"]')
    expect(wrapper?.getAttribute('style')).toContain('390px')
  })
})
