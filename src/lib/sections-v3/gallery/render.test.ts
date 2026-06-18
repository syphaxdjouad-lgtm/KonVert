import { describe, it, expect } from 'vitest'
import { renderGallery } from './render'
import { softTokens } from '@/lib/styles/soft/tokens'
import type { V3PageData } from '@/types/v3'

const data: V3PageData = {
  styleId: 'soft',
  tone: 'auto',
  product: { title: 'X', description: '' },
  images: ['a.jpg', 'b.jpg', 'c.jpg', 'd.jpg', 'e.jpg'],
  copy: {},
}

describe('renderGallery', () => {
  it('renders all images from pool', () => {
    const html = renderGallery(data, softTokens)
    for (const img of data.images) expect(html).toContain(img)
  })
  it('uses horizontal scroll markup', () => {
    const html = renderGallery(data, softTokens)
    expect(html).toContain('overflow-x:auto')
  })
  it('renders nothing useful when no images', () => {
    const empty = renderGallery({ ...data, images: [] }, softTokens)
    expect(empty).toBeDefined()
    // ne crash pas même sans image
  })
  it('applies token colors via inline style', () => {
    const html = renderGallery(data, softTokens)
    expect(html).toContain(softTokens.colors.bg)
  })
  it('applies token radius on slides', () => {
    const html = renderGallery(data, softTokens)
    expect(html).toContain(softTokens.radius.image)
  })
  it('applies token gap on track', () => {
    const html = renderGallery(data, softTokens)
    expect(html).toContain(softTokens.spacing.gap)
  })
  it('contains section heading', () => {
    const html = renderGallery(data, softTokens)
    expect(html).toContain('Tous les angles')
  })
  it('escapes product title in alt attribute', () => {
    const dangerous = renderGallery(
      { ...data, product: { title: '<script>', description: '' } },
      softTokens,
    )
    // Le titre est échappé dans les attributs alt des images
    expect(dangerous).toContain('&lt;script&gt;')
    // Aucune balise <script src=...> ou balise script avec src — le seul <script> autorisé
    // est le script inline interne (IntersectionObserver galerie). On vérifie que le titre
    // n'est PAS injecté brut dans un attribut src= ou comme texte HTML non échappé.
    expect(dangerous).not.toContain('alt="<script>')
    expect(dangerous).not.toContain('alt=\'<script>')
  })

  // Sprint 2 T2 — nouveaux tests dot pagination + counter
  it('T2 : contient les dot indicators (v3-gallery__dots)', () => {
    const html = renderGallery(data, softTokens)
    expect(html).toContain('v3-gallery__dots')
    expect(html).toContain('v3-gallery__dot')
  })

  it('T2 : contient le counter overlay sur le 1er slide (1 / N)', () => {
    const html = renderGallery(data, softTokens)
    expect(html).toContain('kvt-gallery-counter')
    expect(html).toContain(`1 / ${data.images.length}`)
  })

  it('T2 : scroll-snap-type mandatory présent sur le track', () => {
    const html = renderGallery(data, softTokens)
    expect(html).toContain('scroll-snap-type:x mandatory')
  })

  it('T2 : touch-action:pan-x présent pour swipe mobile', () => {
    const html = renderGallery(data, softTokens)
    expect(html).toContain('touch-action:pan-x')
  })

  it('T2 : nombre de dots = nombre d\'images', () => {
    const html = renderGallery(data, softTokens)
    const dotMatches = html.match(/class="v3-gallery__dot"/g) ?? []
    expect(dotMatches.length).toBe(data.images.length)
  })

  it('T2 : 1er dot opaque (opacity:1), les suivants discrets (opacity:0.25)', () => {
    const html = renderGallery(data, softTokens)
    // Le premier dot a opacity:1
    expect(html).toMatch(/v3-gallery__dot[^>]*opacity:1/)
    // Au moins un dot a opacity:0.25
    expect(html).toMatch(/v3-gallery__dot[^>]*opacity:0\.25/)
  })
})
