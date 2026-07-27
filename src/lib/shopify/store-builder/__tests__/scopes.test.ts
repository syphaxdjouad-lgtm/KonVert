import { describe, it, expect } from 'vitest'
import { hasRequiredStoreBuilderScopes, hasReadOrdersScope, missingStoreBuilderScopes, parseScopes } from '../scopes'

describe('parseScopes', () => {
  it('parse une liste CSV en Set, en trimant les espaces', () => {
    expect(parseScopes('write_themes, write_products ,read_products')).toEqual(
      new Set(['write_themes', 'write_products', 'read_products'])
    )
  })

  it('renvoie un Set vide pour null/undefined/chaîne vide', () => {
    expect(parseScopes(null)).toEqual(new Set())
    expect(parseScopes(undefined)).toEqual(new Set())
    expect(parseScopes('')).toEqual(new Set())
  })
})

describe('hasRequiredStoreBuilderScopes', () => {
  it('true quand les 3 scopes requis sont présents (ordre indifférent)', () => {
    expect(hasRequiredStoreBuilderScopes('read_products,write_themes,write_products')).toBe(true)
  })

  it('true quand des scopes supplémentaires non requis sont présents', () => {
    expect(
      hasRequiredStoreBuilderScopes('write_themes,write_products,read_products,write_script_tags')
    ).toBe(true)
  })

  it('false si un seul scope requis manque', () => {
    expect(hasRequiredStoreBuilderScopes('write_themes,write_products')).toBe(false)
  })

  it('false pour null/undefined/chaîne vide (connexion jamais autorisée avec les bons scopes)', () => {
    expect(hasRequiredStoreBuilderScopes(null)).toBe(false)
    expect(hasRequiredStoreBuilderScopes(undefined)).toBe(false)
    expect(hasRequiredStoreBuilderScopes('')).toBe(false)
  })

  it("false pour les scopes du page-builder seuls (pas de régression croisée)", () => {
    expect(hasRequiredStoreBuilderScopes('write_pages,read_pages,write_content,read_content')).toBe(false)
  })
})

describe('missingStoreBuilderScopes', () => {
  it('renvoie la liste exacte des scopes manquants', () => {
    expect(missingStoreBuilderScopes('write_themes')).toEqual(['write_products', 'read_products'])
  })

  it('renvoie un tableau vide si tout est présent', () => {
    expect(missingStoreBuilderScopes('write_themes,write_products,read_products')).toEqual([])
  })
})

describe('hasReadOrdersScope', () => {
  it('true quand read_orders est présent', () => {
    expect(hasReadOrdersScope('write_themes,write_products,read_products,read_orders')).toBe(true)
  })

  it('false quand read_orders est absent (cas standard post-connect initial)', () => {
    expect(hasReadOrdersScope('write_themes,write_products,read_products')).toBe(false)
  })

  it('false pour null/undefined/chaîne vide', () => {
    expect(hasReadOrdersScope(null)).toBe(false)
    expect(hasReadOrdersScope(undefined)).toBe(false)
    expect(hasReadOrdersScope('')).toBe(false)
  })
})
