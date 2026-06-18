import { describe, it, expect } from 'vitest'
import { renderFaq } from './render'
import { softTokens } from '@/lib/styles/soft/tokens'
import type { V3PageData } from '@/types/v3'

const base: V3PageData = {
  styleId: 'soft',
  tone: 'auto',
  product: { title: 'X', description: '' },
  images: [],
  copy: {},
}

describe('renderFaq', () => {
  it('renders all faq entries', () => {
    const faq = [
      { q: 'Q1', a: 'A1' },
      { q: 'Q2', a: 'A2' },
    ]
    const html = renderFaq({ ...base, copy: { faq } }, softTokens)
    expect(html).toContain('Q1')
    expect(html).toContain('A1')
    expect(html).toContain('Q2')
  })

  it('renders default faq when none provided', () => {
    const html = renderFaq(base, softTokens)
    expect(html).toContain('Questions fréquentes')
  })

  it('uses details/summary HTML for accordion', () => {
    const html = renderFaq({ ...base, copy: { faq: [{ q: 'Q', a: 'A' }] } }, softTokens)
    expect(html).toContain('<details')
    expect(html).toContain('<summary')
  })

  // Sprint 3 T4 — animation CSS max-height + icône +/×
  it('injects kvt-faq CSS classes for animation', () => {
    const html = renderFaq({ ...base, copy: { faq: [{ q: 'Q', a: 'A' }] } }, softTokens)
    expect(html).toContain('kvt-faq-body')
    expect(html).toContain('kvt-faq-icon')
  })

  it('includes grid-template-rows transition for smooth open/close', () => {
    const html = renderFaq({ ...base, copy: { faq: [{ q: 'Q', a: 'A' }] } }, softTokens)
    expect(html).toContain('grid-template-rows')
    expect(html).toContain('transition')
  })

  it('includes details[open] selector for open state icon rotation', () => {
    const html = renderFaq({ ...base, copy: { faq: [{ q: 'Q', a: 'A' }] } }, softTokens)
    expect(html).toContain('details[open]')
    expect(html).toContain('rotate(45deg)')
  })

  it('includes prefers-reduced-motion guard', () => {
    const html = renderFaq({ ...base, copy: { faq: [{ q: 'Q', a: 'A' }] } }, softTokens)
    expect(html).toContain('prefers-reduced-motion')
  })

  it('uses durationShort token from motion', () => {
    const html = renderFaq({ ...base, copy: { faq: [{ q: 'Q', a: 'A' }] } }, softTokens)
    expect(html).toContain(softTokens.motion.durationShort)
  })
})
