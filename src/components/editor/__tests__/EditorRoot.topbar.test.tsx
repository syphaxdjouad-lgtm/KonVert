// @vitest-environment jsdom
//
// Verrouille la réintégration du titre éditable + du dropdown Publier dans
// la topbar interne d'EditorRoot (fix/editor-fullscreen-panel-overlap).
// Avant ce fix, ces deux éléments vivaient dans un wrapper au-dessus
// d'EditorRoot dans /dashboard/new/page.tsx — devenu invisible/inaccessible
// une fois EditorRoot passé en position:fixed plein écran. Ce test garantit
// qu'ils restent fonctionnels une fois câblés via props.

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { render, fireEvent, screen, cleanup } from '@testing-library/react'
import React from 'react'
import EditorRoot from '../EditorRoot'
import { useEditorStore } from '../store'

afterEach(cleanup)

function resetStore() {
  useEditorStore.setState({
    templateId: '',
    landingData: {
      headline: '', subtitle: '', benefits: [], faq: [],
      cta: '', urgency: '', product_name: '',
    },
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
    staticHtml: '',
  })
}

const stores = [
  { id: 'store-1', name: 'Ma boutique Shopify', platform: 'shopify' },
  { id: 'store-2', name: 'Mon site Woo', platform: 'woocommerce' },
]

describe('EditorRoot — topbar (retour, titre, publier)', () => {
  beforeEach(resetStore)

  it('appelle onBack (pas window.history.back) au clic sur Retour quand fourni', () => {
    const onBack = vi.fn()
    const historyBackSpy = vi.spyOn(window.history, 'back').mockImplementation(() => {})

    render(<EditorRoot onBack={onBack} />)

    fireEvent.click(screen.getByLabelText('Retour'))

    expect(onBack).toHaveBeenCalledTimes(1)
    expect(historyBackSpy).not.toHaveBeenCalled()
    historyBackSpy.mockRestore()
  })

  it('fallback sur window.history.back() quand onBack est absent', () => {
    const historyBackSpy = vi.spyOn(window.history, 'back').mockImplementation(() => {})

    render(<EditorRoot />)
    fireEvent.click(screen.getByLabelText('Retour'))

    expect(historyBackSpy).toHaveBeenCalledTimes(1)
    historyBackSpy.mockRestore()
  })

  it('le titre est éditable et appelle onTitleChange quand fourni', () => {
    const onTitleChange = vi.fn()
    render(<EditorRoot title="Ma page produit" onTitleChange={onTitleChange} />)

    const input = screen.getByLabelText('Titre de la page') as HTMLInputElement
    expect(input.value).toBe('Ma page produit')
    expect(input.readOnly).toBe(false)

    fireEvent.change(input, { target: { value: 'Nouveau titre' } })
    expect(onTitleChange).toHaveBeenCalledWith('Nouveau titre')
  })

  it('le titre passe en lecture seule sans onTitleChange (usage isolé)', () => {
    render(<EditorRoot />)
    const input = screen.getByLabelText('Titre de la page') as HTMLInputElement
    expect(input.readOnly).toBe(true)
  })

  it("n'affiche pas le bouton Publier sans prop publish", () => {
    render(<EditorRoot />)
    expect(screen.queryByText('Publier')).toBeNull()
  })

  it("n'affiche pas le bouton Publier si aucun store ou pas de pageId", () => {
    const onPublish = vi.fn()
    const { rerender } = render(
      <EditorRoot publish={{ stores: [], pageId: 'page-1', open: false, onOpenChange: vi.fn(), publishingId: null, onPublish }} />
    )
    expect(screen.queryByText('Publier')).toBeNull()

    rerender(
      <EditorRoot publish={{ stores, pageId: null, open: false, onOpenChange: vi.fn(), publishingId: null, onPublish }} />
    )
    expect(screen.queryByText('Publier')).toBeNull()
  })

  it('ouvre le dropdown et déclenche onPublish avec le store choisi', () => {
    const onOpenChange = vi.fn()
    const onPublish = vi.fn()

    const { rerender } = render(
      <EditorRoot publish={{ stores, pageId: 'page-1', open: false, onOpenChange, publishingId: null, onPublish }} />
    )

    fireEvent.click(screen.getByText('Publier'))
    expect(onOpenChange).toHaveBeenCalledWith(true)

    // Simule l'ouverture pilotée par le parent (comme /dashboard/new/page.tsx)
    rerender(
      <EditorRoot publish={{ stores, pageId: 'page-1', open: true, onOpenChange, publishingId: null, onPublish }} />
    )

    fireEvent.click(screen.getByText('Ma boutique Shopify'))
    expect(onPublish).toHaveBeenCalledWith(stores[0])
  })
})
