import { describe, it, expect } from 'vitest'
import { renderPageV3 } from './render-page'
import type { V3PageData } from '@/types/v3'

// Chantier éditeur (point 2 — sélection de section bidirectionnelle) :
// chaque <section> rendue en V3 doit porter un data-section-id stable
// (= sa V3SectionKey) pour que PreviewIframe/SectionsList puissent
// sélectionner/scroller dessus. Attribut statique — aucun script ici
// (cf PreviewIframe.tsx pour l'injection du script d'édition, côté client
// uniquement).

const data: V3PageData = {
  styleId: 'soft', tone: 'auto',
  product: { title: 'Sac vintage', description: '' },
  images: ['a.jpg'],
  copy: {},
}

describe('renderPageV3 — data-section-id (éditeur, sélection de section)', () => {
  it('chaque section rendue porte data-section-id="<key>"', () => {
    const html = renderPageV3('soft', data, ['hero', 'gallery'])
    expect(html).toContain('data-section-id="hero"')
    expect(html).toContain('data-section-id="gallery"')
  })

  it('id="main-content" et data-section-id cohabitent sur la 1ère section', () => {
    const html = renderPageV3('soft', data, ['hero', 'gallery'])
    expect(html).toMatch(/<section[^>]*\bid="main-content"[^>]*\bdata-section-id="hero"/)
  })

  it('les sections suivantes n\'ont pas id="main-content"', () => {
    const html = renderPageV3('soft', data, ['hero', 'gallery'])
    const galleryTag = html.match(/<section[^>]*data-section-id="gallery"[^>]*>/)?.[0] ?? ''
    expect(galleryTag).not.toContain('main-content')
  })

  it('les sections filtrées par shouldRenderSection (data absente) ne cassent pas la correspondance clé/section', () => {
    // sans images -> gallery est filtree (shouldRenderSection) mais hero
    // doit rester correctement identifiee (pas de décalage d'index)
    const noImages = { ...data, images: [] }
    const html = renderPageV3('soft', noImages, ['hero', 'gallery'])
    expect(html).toContain('data-section-id="hero"')
    expect(html).not.toContain('data-section-id="gallery"')
  })

  it('data-section-id est present meme sans editMode (statique, inerte)', () => {
    const html = renderPageV3('soft', data, ['hero'])
    // Pas de script d'édition injecté ici — c'est PreviewIframe qui l'ajoute
    // côté client, jamais dans le html canonique (publié/sauvegardé).
    expect(html).not.toContain('__kvtV3EditInjected')
  })
})
