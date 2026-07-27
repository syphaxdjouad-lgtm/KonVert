// @vitest-environment jsdom

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { render, waitFor, fireEvent, cleanup } from '@testing-library/react'
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
      selectedSectionId: null,
      panelOpen: false,
      subPanelEditOpen: false,
      editingSectionId: null,
      editForm: { title: '', subtitle: '' },
      panelMode: 'sections',
    })
  })

  // Sans cleanup, chaque render() laisse son PreviewIframe (et son listener
  // window 'message') monté — les tests de postMessage ci-dessous en
  // interfèrent silencieusement les uns avec les autres.
  afterEach(() => {
    cleanup()
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

  it('cable visualSettings : bgColor injectee dans le srcdoc apres debounce (chantier C2)', async () => {
    const firstSectionId = useEditorStore.getState().sectionOrder[0]!.id
    useEditorStore.setState({
      visualSettings: { [firstSectionId]: { bgColor: '#ABCDEF' } },
    })
    vi.useFakeTimers()
    render(React.createElement(PreviewIframe))
    const iframe = document.querySelector('iframe')!
    vi.advanceTimersByTime(250)
    vi.useRealTimers()
    await waitFor(() => {
      const srcdoc = iframe.getAttribute('srcdoc') || iframe.getAttribute('srcDoc') || ''
      expect(srcdoc.toLowerCase()).toContain('#abcdef')
    })
  })

  // ─── Chantier éditeur — sélection de section bidirectionnelle ──────────────

  // window.postMessage() sur soi-meme est peu fiable en jsdom (origin/timing) —
  // on dispatche directement le MessageEvent que le handler onMessage de
  // PreviewIframe consomme (meme approche que le postMessage.test.ts existant,
  // qui teste le store plutot que le vrai canal postMessage async).
  function dispatchKvtMessage(data: unknown) {
    window.dispatchEvent(new MessageEvent('message', { data, origin: window.location.origin }))
  }

  it('KVT_SECTION_SELECTED (postMessage depuis le canvas) ouvre PanelRight, pas seulement la liste', () => {
    render(React.createElement(PreviewIframe))
    dispatchKvtMessage({ type: 'KVT_SECTION_SELECTED', id: 'sec-1' })

    const state = useEditorStore.getState()
    expect(state.selectedSectionId).toBe('sec-1')
    expect(state.subPanelEditOpen).toBe(true)
    expect(state.editingSectionId).toBe('sec-1')
    expect(state.panelOpen).toBe(true)
  })

  it('KVT_SECTION_DESELECTED reset selectedSectionId', () => {
    useEditorStore.setState({ selectedSectionId: 'sec-1' })
    render(React.createElement(PreviewIframe))
    dispatchKvtMessage({ type: 'KVT_SECTION_DESELECTED' })
    expect(useEditorStore.getState().selectedSectionId).toBeNull()
  })

  it('ignore les messages dont le type ne fait pas partie du protocole KVT', () => {
    render(React.createElement(PreviewIframe))
    dispatchKvtMessage({ type: 'SOMETHING_ELSE', id: 'x' })
    expect(useEditorStore.getState().selectedSectionId).toBeNull()
  })

  it('path V3 (staticHtml) : le script d\'edition kvt est injecte dans le srcdoc', async () => {
    useEditorStore.setState({
      templateId: 'apple-clean', // styleId V3
      staticHtml: '<!doctype html><html><body><section data-section-id="hero">Hero</section></body></html>',
    })
    render(React.createElement(PreviewIframe))
    const iframe = document.querySelector('iframe')!
    await waitFor(() => {
      const srcdoc = iframe.getAttribute('srcdoc') || iframe.getAttribute('srcDoc') || ''
      expect(srcdoc).toContain('__kvtV3EditInjected')
      expect(srcdoc).toContain('data-section-id')
      // injecte avant </body>, pas apres
      expect(srcdoc.indexOf('__kvtV3EditInjected')).toBeLessThan(srcdoc.indexOf('</body>'))
    })
  })

  it('rejoue KVT_HIGHLIGHT_SECTION au chargement de l\'iframe (queue si pas encore chargee)', () => {
    useEditorStore.setState({ selectedSectionId: 'sec-42' })
    render(React.createElement(PreviewIframe))
    const iframe = document.querySelector('iframe')!
    const postMessageSpy = vi.fn()
    Object.defineProperty(iframe, 'contentWindow', {
      value: { postMessage: postMessageSpy },
      configurable: true,
    })
    fireEvent.load(iframe)
    expect(postMessageSpy).toHaveBeenCalledWith(
      { type: 'KVT_HIGHLIGHT_SECTION', id: 'sec-42' },
      expect.any(String),
    )
  })
})
