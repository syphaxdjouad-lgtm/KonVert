import { describe, it, expect } from 'vitest'
import { suggestTemplateForProduct, SUGGESTED_TEMPLATE_BY_TYPE } from '../detect-product-type'
import { TEMPLATES } from '../index'

// Couvre la fonction de suggestion dédiée au wizard step 5 (liste curée à 11
// templates). Distincte des tests de detectProductType()/ProductType (non
// modifiés par ce chantier).

describe('suggestTemplateForProduct — mapping par type détecté', () => {
  it('tech → etec-pulse', () => {
    const s = suggestTemplateForProduct({
      title: 'Ecouteurs bluetooth sans fil',
      description: 'Casque audio wireless charge rapide usb-c',
    })
    expect(s?.templateId).toBe('etec-pulse')
  })

  it('skincare → etec-velvety', () => {
    const s = suggestTemplateForProduct({
      title: 'Sérum hydratant anti-age',
      description: 'Soin visage rétinol, réduit les rides, sans parfum',
    })
    expect(s?.templateId).toBe('etec-velvety')
  })

  it('beauty → etec-blusho', () => {
    const s = suggestTemplateForProduct({
      title: 'Rouge à lèvres mat longue tenue',
      description: 'Palette fard à paupières, mascara, maquillage professionnel',
    })
    expect(s?.templateId).toBe('etec-blusho')
  })

  it('wellness → etec-prime', () => {
    const s = suggestTemplateForProduct({
      title: 'Complément vitamine magnésium',
      description: 'Gélule probiotique, multivitamine, nutrition quotidienne',
    })
    expect(s?.templateId).toBe('etec-prime')
  })

  it('fashion → etec-style', () => {
    const s = suggestTemplateForProduct({
      title: 'Robe streetwear pour femme',
      description: 'Mode urbaine, veste et jean coupe moderne',
    })
    expect(s?.templateId).toBe('etec-style')
  })

  it('jewelry → etec-gold', () => {
    const s = suggestTemplateForProduct({
      title: 'Collier bijoux en argent 925',
      description: 'Bracelet et boucle d\'oreille assortis, joaillerie fine',
    })
    expect(s?.templateId).toBe('etec-gold')
  })

  it('luxury → etec-gold', () => {
    const s = suggestTemplateForProduct({
      title: 'Édition limitée haute couture',
      description: 'Pièce exclusive designer, fait main, haut de gamme',
    })
    expect(s?.templateId).toBe('etec-gold')
  })

  it('home → etec-casa', () => {
    const s = suggestTemplateForProduct({
      title: 'Canapé et table basse salon',
      description: 'Décoration intérieure, chaise et coussin assortis',
    })
    expect(s?.templateId).toBe('etec-casa')
  })

  it('pet → etec-pet', () => {
    const s = suggestTemplateForProduct({
      title: 'Laisse pour chien',
      description: 'Croquette pour chat, jouet chien, panier chien confortable',
    })
    expect(s?.templateId).toBe('etec-pet')
  })

  it('sport → etec-energy', () => {
    const s = suggestTemplateForProduct({
      title: 'Corde à sauter fitness',
      description: 'Musculation, entrainement crossfit, séance gym intensive',
    })
    expect(s?.templateId).toBe('etec-energy')
  })

  it('organic → etec-natural', () => {
    const s = suggestTemplateForProduct({
      title: 'Savon bio naturel vegan',
      description: 'Cruelty-free, zéro déchet, argile durable et compostable',
    })
    expect(s?.templateId).toBe('etec-natural')
  })

  it('aucun signal exploitable → null (comme detectProductType)', () => {
    expect(suggestTemplateForProduct({ title: '', description: '' })).toBeNull()
    expect(suggestTemplateForProduct({ title: 'ab' })).toBeNull()
    // Texte volontairement dénué de tout mot-clé produit connu (aucun des
    // buckets sport/organic/ProductType) pour garantir 0 collision fortuite.
    expect(suggestTemplateForProduct({
      title: 'Xyzzy qwerty flibbertigibbet',
      description: 'zzznonematchingzzz plugh wibble',
    })).toBeNull()
  })

  it('accent renvoyé = accent du template registre TEMPLATES', () => {
    const s = suggestTemplateForProduct({ title: 'Ecouteurs bluetooth wireless' })
    const expected = TEMPLATES.find(t => t.id === 'etec-pulse')?.accent ?? null
    expect(s?.accent).toBe(expected)
    expect(s?.accent).not.toBeNull()
  })
})

describe('suggestTemplateForProduct — priorité sport/organic (demande founder)', () => {
  it('égalité de score sport vs wellness → sport gagne (etec-energy)', () => {
    // 'fitness' (sport) et 'wellness' (wellness) matchent chacun 1 mot-clé —
    // égalité de score, sport doit gagner le départage (déclaré en premier).
    const s = suggestTemplateForProduct({ title: 'fitness wellness' })
    expect(s?.type).toBe('sport')
    expect(s?.templateId).toBe('etec-energy')
  })

  it('égalité de score organic vs home → organic gagne (etec-natural)', () => {
    // 'argile' (organic) et 'decoration' (home) matchent chacun 1 mot-clé —
    // égalité de score, organic doit gagner le départage (déclaré en premier).
    const s = suggestTemplateForProduct({ title: 'argile decoration' })
    expect(s?.type).toBe('organic')
    expect(s?.templateId).toBe('etec-natural')
  })
})

describe('SUGGESTED_TEMPLATE_BY_TYPE — couvre les 11 templates curés', () => {
  it('chaque template cible existe bien dans le registre TEMPLATES', () => {
    for (const templateId of Object.values(SUGGESTED_TEMPLATE_BY_TYPE)) {
      expect(TEMPLATES.some(t => t.id === templateId)).toBe(true)
    }
  })
})
