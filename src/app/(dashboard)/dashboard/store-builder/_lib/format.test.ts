import { describe, it, expect } from 'vitest'
import {
  scoreBand,
  bandLabel,
  formatPercent,
  formatPValue,
  daysSince,
  daysRemainingInTest,
  hasStoreBuilderScopes,
  hasReadOrdersScope,
  normalizeShopDomain,
  auditCriterionGroup,
  htmlToParagraphs,
} from './format'

describe('scoreBand', () => {
  it('rouge sous 50', () => {
    expect(scoreBand(0)).toBe('red')
    expect(scoreBand(49.9)).toBe('red')
  })
  it('orange entre 50 et 75 inclus', () => {
    expect(scoreBand(50)).toBe('orange')
    expect(scoreBand(75)).toBe('orange')
  })
  it('vert au-dessus de 75', () => {
    expect(scoreBand(75.1)).toBe('green')
    expect(scoreBand(100)).toBe('green')
  })
})

describe('bandLabel', () => {
  it('renvoie un libellé FR pour chaque bande', () => {
    expect(bandLabel('red')).toMatch(/améliorer/i)
    expect(bandLabel('orange')).toBeTruthy()
    expect(bandLabel('green')).toBeTruthy()
  })
})

describe('formatPercent', () => {
  it('formate un ratio en pourcentage', () => {
    expect(formatPercent(0.1234, 2)).toBe('12.34%')
    expect(formatPercent(1)).toBe('100.0%')
  })
  it('gère les valeurs non finies', () => {
    expect(formatPercent(NaN)).toBe('—')
  })
})

describe('formatPValue', () => {
  it('formate normalement au-dessus de 0.001', () => {
    expect(formatPValue(0.0421)).toBe('p = 0.042')
  })
  it('affiche p < 0.001 en dessous du seuil', () => {
    expect(formatPValue(0.0001)).toBe('p < 0.001')
  })
})

describe('daysSince / daysRemainingInTest', () => {
  it('calcule les jours écoulés', () => {
    const start = new Date('2026-07-01T00:00:00Z')
    const now = new Date('2026-07-08T00:00:00Z')
    expect(daysSince(start.toISOString(), now)).toBe(7)
  })
  it('plafonne les jours restants à 0 après le max', () => {
    const start = new Date('2026-06-01T00:00:00Z')
    const now = new Date('2026-07-15T00:00:00Z')
    expect(daysRemainingInTest(start.toISOString(), now)).toBe(0)
  })
  it('calcule les jours restants avant 30j', () => {
    const start = new Date('2026-07-01T00:00:00Z')
    const now = new Date('2026-07-08T00:00:00Z')
    expect(daysRemainingInTest(start.toISOString(), now)).toBe(23)
  })
})

describe('hasStoreBuilderScopes', () => {
  it('vrai si les 3 scopes requis sont présents', () => {
    expect(hasStoreBuilderScopes('write_themes,write_products,read_products')).toBe(true)
    expect(hasStoreBuilderScopes('read_products, write_themes , write_products')).toBe(true)
  })
  it('faux si un scope manque', () => {
    expect(hasStoreBuilderScopes('write_themes,read_products')).toBe(false)
    expect(hasStoreBuilderScopes('')).toBe(false)
  })
})

describe('hasReadOrdersScope', () => {
  it('détecte read_orders', () => {
    expect(hasReadOrdersScope('write_themes,read_orders')).toBe(true)
    expect(hasReadOrdersScope('write_themes')).toBe(false)
  })
})

describe('normalizeShopDomain', () => {
  it('accepte un sous-domaine nu', () => {
    expect(normalizeShopDomain('ma-boutique')).toBe('ma-boutique.myshopify.com')
  })
  it('accepte une URL complète', () => {
    expect(normalizeShopDomain('https://ma-boutique.myshopify.com/admin')).toBe('ma-boutique.myshopify.com')
  })
  it('rejette un format invalide', () => {
    expect(normalizeShopDomain('')).toBeNull()
    expect(normalizeShopDomain('ma boutique!!')).toBeNull()
  })
})

describe('auditCriterionGroup', () => {
  it('groupe 1 pour les ids 1-6', () => {
    expect(auditCriterionGroup(1)).toBe(1)
    expect(auditCriterionGroup(6)).toBe(1)
  })
  it('groupe 2 pour les ids 7-12', () => {
    expect(auditCriterionGroup(7)).toBe(2)
    expect(auditCriterionGroup(12)).toBe(2)
  })
  it('groupe 3 pour les ids 13-18', () => {
    expect(auditCriterionGroup(13)).toBe(3)
    expect(auditCriterionGroup(18)).toBe(3)
  })
})

describe('htmlToParagraphs', () => {
  it('découpe des paragraphes <p> en texte brut', () => {
    expect(htmlToParagraphs('<p>Bonjour</p><p>Le monde</p>')).toEqual(['Bonjour', 'Le monde'])
  })
  it('décode les entités HTML de base', () => {
    expect(htmlToParagraphs('<p>Trucs &amp; astuces &mdash;</p>'.replace('&mdash;', ''))).toEqual(['Trucs & astuces'])
  })
  it('ignore les paragraphes vides', () => {
    expect(htmlToParagraphs('<p>Un</p><p></p><p>Deux</p>')).toEqual(['Un', 'Deux'])
  })
})
