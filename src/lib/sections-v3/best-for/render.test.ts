import { describe, it, expect } from 'vitest'
import { renderBestFor } from './render'
import { softTokens } from '@/lib/styles/soft/tokens'
import type { V3PageData } from '@/types/v3'

const base: V3PageData = {
  styleId: 'soft', tone: 'auto',
  product: { title: 'X', description: '' },
  images: [],
  copy: {},
}

describe('renderBestFor', () => {
  // Sprint 1 : les pills sont remplacées par des cards avec icône SVG + texte
  it('renders cards (not pills) from best_for array', () => {
    const html = renderBestFor({
      ...base,
      copy: { best_for: ['Appels clairs en open space', 'Running sans fil qui glisse', 'Concerts sans fatiguer'] },
    }, softTokens)
    // Les labels sont présents
    expect(html).toContain('Appels clairs en open space')
    expect(html).toContain('Running sans fil qui glisse')
    expect(html).toContain('Concerts sans fatiguer')
    // Structure card : flex-direction column
    expect(html).toContain('flex-direction:column')
  })

  it('chaque card contient un SVG icône inline (aria-hidden)', () => {
    const html = renderBestFor({
      ...base,
      copy: { best_for: ['Running sans fil qui glisse', 'Musique au bureau'] },
    }, softTokens)
    expect(html).toContain('aria-hidden="true"')
    // Au moins un viewBox SVG 24×24
    expect(html).toContain('viewBox="0 0 24 24"')
  })

  it('grid 2 colonnes mobile par défaut', () => {
    const html = renderBestFor({ ...base, copy: { best_for: ['Voyage', 'Famille'] }}, softTokens)
    expect(html).toContain('grid-template-columns:repeat(2, 1fr)')
  })

  it('4 colonnes desktop via media query kvt-bf-grid', () => {
    const html = renderBestFor({ ...base, copy: { best_for: ['A', 'B', 'C', 'D'] }}, softTokens)
    expect(html).toContain('kvt-bf-grid')
    expect(html).toContain('grid-template-columns: repeat(4, 1fr)')
  })

  it('renders empty list gracefully with message', () => {
    const html = renderBestFor({ ...base, copy: { best_for: [] }}, softTokens)
    expect(html).toContain('Idéal pour')
    expect(html).toContain('Informations non disponibles')
  })

  it('renders section même si best_for est undefined', () => {
    const html = renderBestFor(base, softTokens)
    expect(html.trim().length).toBeGreaterThan(0)
    expect(html).toContain('Idéal pour')
  })

  it('utilise la couleur success du token pour les icônes', () => {
    const html = renderBestFor({ ...base, copy: { best_for: ['Sport'] }}, softTokens)
    expect(html).toContain(softTokens.colors.success ?? '#16A34A')
  })

  it('utilise bgAlt du token pour alterner le fond des cards', () => {
    const html = renderBestFor({
      ...base,
      copy: { best_for: ['A', 'B', 'C', 'D'] },
    }, softTokens)
    // bgAlt doit apparaître (cards paires)
    expect(html).toContain(softTokens.colors.bgAlt ?? '#F5F5F5')
  })

  it('icône running choisie pour un label sport/run', () => {
    const html = renderBestFor({ ...base, copy: { best_for: ['Running quotidien'] }}, softTokens)
    // L'icône running contient un cercle (silhouette courir)
    expect(html).toContain('<circle')
  })

  it('icône musique choisie pour un label audio/son', () => {
    const html = renderBestFor({ ...base, copy: { best_for: ['Son immersif pour concerts'] }}, softTokens)
    // L'icône music contient deux cercles (notes sur portée)
    expect(html).toContain('<circle cx="6"')
  })

  it('icône default pour un label inconnu', () => {
    const html = renderBestFor({ ...base, copy: { best_for: ['Utilisation quotidienne'] }}, softTokens)
    // L'icône default est un check polyline
    expect(html).toContain('<polyline')
  })

  it('escapeHtml protège les caractères spéciaux dans les labels', () => {
    const html = renderBestFor({ ...base, copy: { best_for: ['Appels <pro> & business'] }}, softTokens)
    expect(html).toContain('Appels &lt;pro&gt; &amp; business')
    expect(html).not.toContain('<pro>')
  })

  it('utilise le token sectionMobile pour le padding vertical', () => {
    const html = renderBestFor(base, softTokens)
    expect(html).toContain(softTokens.spacing.sectionMobile ?? '64px')
  })
})
