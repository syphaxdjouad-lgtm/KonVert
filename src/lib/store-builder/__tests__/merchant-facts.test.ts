import { describe, it, expect } from 'vitest'
import { merchantFactsSchema } from '../merchant-facts'

describe('merchantFactsSchema', () => {
  it('accepte un objet vide (tous les champs sont optionnels)', () => {
    expect(merchantFactsSchema.safeParse({}).success).toBe(true)
  })

  it('accepte un objet complet valide', () => {
    const result = merchantFactsSchema.safeParse({
      processing_delay: '24h ouvrées',
      shipping_delay: '3 à 5 jours',
      return_policy: 'Retour gratuit sous 30 jours',
      warranty_duration: '2 ans',
      support_response_time: 'sous 24h',
      payment_methods: ['Carte bancaire', 'PayPal'],
      brand_name: 'Atelier Nova',
    })
    expect(result.success).toBe(true)
  })

  it('rejette une clé additionnelle inconnue (.strict())', () => {
    const result = merchantFactsSchema.safeParse({ processing_delay: '24h', extra: 'nope' })
    expect(result.success).toBe(false)
  })

  it('rejette une chaîne vide sur un champ optionnel renseigné', () => {
    expect(merchantFactsSchema.safeParse({ brand_name: '' }).success).toBe(false)
  })
})
