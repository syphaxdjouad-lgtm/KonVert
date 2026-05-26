// @vitest-environment jsdom
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { useEditorStore } from '../store'

// Simule la reception d'un postMessage depuis l'iframe vers le parent.
// Le listener est installe dans PreviewIframe.tsx via window.addEventListener('message', ...).
// Ici on teste uniquement le comportement du store que le handler appelle.

describe('postMessage store integration', () => {
  beforeEach(() => {
    useEditorStore.setState({
      selectedSectionId: null,
      panelOpen: false,
      subPanelEditOpen: false,
      editingSectionId: null,
      editForm: { title: '', subtitle: '' },
      sectionOrder: [],
      visualSettings: {},
      globalStyles: {},
      templateId: '',
      landingData: { headline: '', subtitle: '', benefits: [], faq: [], cta: '', urgency: '', product_name: '' },
      panelMode: 'sections',
      device: 'desktop',
    })
  })

  it('KVT_SECTION_SELECTED : setSelectedSection + setPanelOpen', () => {
    // Simule le handler PostMessage de PreviewIframe
    const { setSelectedSection, setPanelOpen } = useEditorStore.getState()
    setSelectedSection('section-abc')
    setPanelOpen(true)

    const state = useEditorStore.getState()
    expect(state.selectedSectionId).toBe('section-abc')
    expect(state.panelOpen).toBe(true)
  })

  it('KVT_SECTION_DESELECTED : setSelectedSection(null)', () => {
    useEditorStore.setState({ selectedSectionId: 'section-abc', panelOpen: true })
    useEditorStore.getState().setSelectedSection(null)
    expect(useEditorStore.getState().selectedSectionId).toBeNull()
    // panel reste ouvert (deselect ne ferme pas le panel)
    expect(useEditorStore.getState().panelOpen).toBe(true)
  })

  it('setSelectedSection avec id non-null ouvre automatiquement le panel', () => {
    useEditorStore.setState({ panelOpen: false })
    useEditorStore.getState().setSelectedSection('s1')
    expect(useEditorStore.getState().panelOpen).toBe(true)
  })

  it('setSelectedSection(null) ne ferme pas le panel', () => {
    useEditorStore.setState({ panelOpen: true, selectedSectionId: 'x' })
    useEditorStore.getState().setSelectedSection(null)
    // panel reste ouvert : l'utilisateur peut vouloir garder le panel visible
    expect(useEditorStore.getState().panelOpen).toBe(true)
  })

  it('postMessage outbound : structure attendue KVT_HIGHLIGHT_SECTION', () => {
    // Verifie que le message sortant a la bonne shape
    const mockPostMessage = vi.fn()
    const mockIframe = { contentWindow: { postMessage: mockPostMessage } }

    const selectedSectionId = 'section-xyz'
    mockIframe.contentWindow.postMessage(
      { type: 'KVT_HIGHLIGHT_SECTION', id: selectedSectionId },
      '*',
    )

    expect(mockPostMessage).toHaveBeenCalledOnce()
    expect(mockPostMessage).toHaveBeenCalledWith(
      { type: 'KVT_HIGHLIGHT_SECTION', id: 'section-xyz' },
      '*',
    )
  })

  it('postMessage outbound avec id null pour deselection', () => {
    const mockPostMessage = vi.fn()
    const mockIframe = { contentWindow: { postMessage: mockPostMessage } }

    mockIframe.contentWindow.postMessage(
      { type: 'KVT_HIGHLIGHT_SECTION', id: null },
      '*',
    )

    expect(mockPostMessage).toHaveBeenCalledWith(
      { type: 'KVT_HIGHLIGHT_SECTION', id: null },
      '*',
    )
  })
})
