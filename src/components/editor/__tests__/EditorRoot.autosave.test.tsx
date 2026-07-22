// @vitest-environment jsdom
//
// Reproduit puis verrouille le fix du bug prod (fix/editor-autosave-ejects-on-open) :
// ouvrir une page existante déclenchait un auto-save fantôme ~3s après le
// montage (hydratation → sectionData/visualSettings changent de référence →
// l'effet auto-save de EditorRoot se relance après que son garde "1er run"
// ait déjà été consommé) qui, combiné au router.push inconditionnel de
// savePage, éjectait l'utilisateur vers /dashboard/pages avant qu'il ait pu
// éditer quoi que ce soit.
//
// Couche B (ce fichier) — l'ouverture/hydratation d'une page ne doit JAMAIS
// déclencher onSave à elle seule.
// Couche A (ce fichier) — un vrai changement utilisateur post-hydratation
// déclenche bien l'auto-save, mais avec { redirect: false }.

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { render, cleanup, act } from '@testing-library/react'
import React from 'react'
import EditorRoot from '../EditorRoot'
import { useEditorStore } from '../store'
import type { LandingPageData } from '@/types'
import type { SectionInstance } from '@/types/editor'

afterEach(() => {
  cleanup()
  vi.useRealTimers()
})

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

// Page existante, avec _editor_state déjà présent (comme une page sauvée
// depuis C2+), pour matcher le chemin "reopen depuis mes pages" exact du bug.
const existingSectionOrder: SectionInstance[] = [
  { id: 'sec-1', key: 'features', visible: true },
]

const existingJsonContent: LandingPageData & {
  _template_slug?: string
  _editor_state?: unknown
} = {
  headline: 'Mon super produit',
  subtitle: 'Sous-titre',
  benefits: ['Rapide', 'Fiable'],
  faq: [],
  cta: 'Acheter',
  urgency: 'Stock limité',
  product_name: 'SuperGadget',
  features: [{ icon: 'check', title: 'Feature 1', description: 'Desc' }],
  _template_slug: 'etec-blue',
  _editor_state: {
    sectionOrder: existingSectionOrder,
    visualSettings: {},
    globalStyles: {},
  },
}

describe('EditorRoot — auto-save vs hydratation (bug prod C2)', () => {
  beforeEach(resetStore)

  it("n'appelle PAS onSave du seul fait d'ouvrir/hydrater une page existante (Couche B)", async () => {
    vi.useFakeTimers()
    const onSave = vi.fn().mockResolvedValue(undefined)

    render(
      <EditorRoot
        jsonContent={existingJsonContent}
        defaultTemplateId="etec-blue"
        onSave={onSave}
        saving={false}
      />
    )

    // Debounce auto-save = 3000ms. On avance largement au-delà.
    await act(async () => {
      await vi.advanceTimersByTimeAsync(5000)
    })

    expect(onSave).not.toHaveBeenCalled()
  })

  it('appelle onSave avec { redirect: false } après un vrai changement utilisateur post-hydratation (Couche A)', async () => {
    vi.useFakeTimers()
    const onSave = vi.fn().mockResolvedValue(undefined)

    render(
      <EditorRoot
        jsonContent={existingJsonContent}
        defaultTemplateId="etec-blue"
        onSave={onSave}
        saving={false}
      />
    )

    // Laisse l'hydratation se stabiliser sans déclencher l'auto-save.
    await act(async () => {
      await vi.advanceTimersByTimeAsync(0)
    })
    expect(onSave).not.toHaveBeenCalled()

    // Vrai changement utilisateur (ex: édition d'un champ de section).
    await act(async () => {
      useEditorStore.getState().updateSectionField('sec-1', 'title', 'Nouveau titre')
    })

    await act(async () => {
      await vi.advanceTimersByTimeAsync(3100)
    })

    expect(onSave).toHaveBeenCalledTimes(1)
    const [, , options] = onSave.mock.calls[0] as [string, object, { redirect: boolean } | undefined]
    expect(options).toEqual({ redirect: false })
  })
})
