import { describe, it, expect } from 'vitest'
import { renderQuantitySelector } from '../QuantitySelector'

describe('renderQuantitySelector', () => {
  it('retourne un HTML non vide avec valeur par défaut = 1', () => {
    const html = renderQuantitySelector()
    expect(html.trim().length).toBeGreaterThan(0)
    expect(html).toContain('value="1"')
  })

  it('respecte min et max passés en props', () => {
    const html = renderQuantitySelector({ value: 3, min: 2, max: 10 })
    expect(html).toContain('value="3"')
    expect(html).toContain('min="2"')
    expect(html).toContain('max="10"')
    expect(html).toContain('aria-valuemin="2"')
    expect(html).toContain('aria-valuemax="10"')
  })

  it('bouton - est disabled quand value = min', () => {
    const html = renderQuantitySelector({ value: 1, min: 1 })
    // Le bouton décrement doit avoir disabled
    const decSection = html.split('id="qty-sel-dec"')[1]?.split('>')[0] ?? ''
    expect(decSection).toContain('disabled')
  })

  it('bouton + est disabled quand value = max', () => {
    const html = renderQuantitySelector({ value: 99, min: 1, max: 99 })
    const incSection = html.split('id="qty-sel-inc"')[1]?.split('>')[0] ?? ''
    expect(incSection).toContain('disabled')
  })

  it('inclut aria-labels a11y sur les boutons', () => {
    const html = renderQuantitySelector()
    expect(html).toContain('aria-label="Diminuer la quantité"')
    expect(html).toContain('aria-label="Augmenter la quantité"')
    expect(html).toContain('role="spinbutton"')
  })

  it('size compact génère height 40px', () => {
    const html = renderQuantitySelector({ size: 'compact' })
    expect(html).toContain('height:40px')
  })

  it('size large génère height 56px', () => {
    const html = renderQuantitySelector({ size: 'large' })
    expect(html).toContain('height:56px')
  })

  it('size default génère height 48px', () => {
    const html = renderQuantitySelector({ size: 'default' })
    expect(html).toContain('height:48px')
  })

  it('disabled=true désactive le widget via opacity', () => {
    const html = renderQuantitySelector({ disabled: true })
    expect(html).toContain('opacity:0.45;pointer-events:none;')
  })

  it('label visible quand passé en prop', () => {
    const html = renderQuantitySelector({ label: 'Quantité' })
    expect(html).toContain('Quantité')
    // label visible, pas hidden
    expect(html).not.toContain('width:1px;height:1px')
  })

  it('inclut le script JS inline avec clamp et update', () => {
    const html = renderQuantitySelector()
    expect(html).toContain('function clamp')
    expect(html).toContain('function update')
    expect(html).toContain('qty:change')
  })

  it('id unique permet deux instances sans conflit', () => {
    const html1 = renderQuantitySelector({ id: 'qty-main' })
    const html2 = renderQuantitySelector({ id: 'qty-sticky' })
    expect(html1).toContain('id="qty-main-input"')
    expect(html2).toContain('id="qty-sticky-input"')
    expect(html1).not.toContain('qty-sticky')
    expect(html2).not.toContain('qty-main-')
  })
})
