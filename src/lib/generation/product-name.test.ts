import { describe, it, expect } from 'vitest'
import { sanitizeTitleFallback } from './product-name'

describe('sanitizeTitleFallback', () => {
  it('retire le keyword stuffing AliExpress typique', () => {
    const raw = 'HXAO hauts courts sans manche petit haut tank top femme bralette sport YOGA fitness coton respirant'
    const cleaned = sanitizeTitleFallback(raw)
    // On ne demande pas un nom parfait au fallback, juste plus court et lisible
    expect(cleaned.length).toBeLessThanOrEqual(60)
    expect(cleaned).not.toMatch(/yoga.*fitness.*coton/i) // stuffing parti
  })

  it('normalise les titres ALL CAPS en Title Case', () => {
    const raw = 'BLENDER MIXEUR PROFESSIONNEL 1500W ACIER INOX'
    const cleaned = sanitizeTitleFallback(raw)
    expect(cleaned).toMatch(/[a-z]/) // au moins une minuscule
    expect(cleaned).toMatch(/^[A-Z]/) // commence par une majuscule
  })

  it('coupe à 60 chars en respectant les mots (pas de césure au milieu)', () => {
    const raw = 'Produit super génial avec plein de caractéristiques amazing et incroyable pour vraiment révolutionner ta vie quotidienne'
    const cleaned = sanitizeTitleFallback(raw)
    expect(cleaned.length).toBeLessThanOrEqual(60)
    // La sortie est un préfixe du titre brut sur une frontière de mot
    expect(raw.startsWith(cleaned)).toBe(true)
    expect(cleaned.endsWith(' ')).toBe(false)
  })

  it('garde les titres déjà propres intacts', () => {
    const raw = 'Corset bustier dos nu'
    const cleaned = sanitizeTitleFallback(raw)
    expect(cleaned).toBe('Corset bustier dos nu')
  })

  it('retire les patterns "free shipping" / "hot sale" / "2024"', () => {
    const raw = 'Tank Top Femme Hot Sale Free Shipping 2024 High Quality'
    const cleaned = sanitizeTitleFallback(raw)
    expect(cleaned).not.toMatch(/hot sale/i)
    expect(cleaned).not.toMatch(/free shipping/i)
    expect(cleaned).not.toMatch(/2024/)
    expect(cleaned).not.toMatch(/high quality/i)
  })

  it('coupe ce qui suit un pipe (stuffing pur)', () => {
    const raw = 'Sérum vitamine C anti-âge | skincare beauty face cream wrinkle'
    const cleaned = sanitizeTitleFallback(raw)
    expect(cleaned).toBe('Sérum vitamine C anti-âge')
  })

  it('gère les inputs vides ou non-string sans crash', () => {
    expect(sanitizeTitleFallback('')).toBe('Produit')
    expect(sanitizeTitleFallback(null as unknown as string)).toBe('Produit')
    expect(sanitizeTitleFallback(undefined as unknown as string)).toBe('Produit')
  })
})
