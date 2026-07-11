import { describe, it, expect } from 'vitest'
import { renderReviews } from './render'
import { softTokens } from '@/lib/styles/soft/tokens'
import type { V3PageData, V3Review } from '@/types/v3'

const base: V3PageData = {
  styleId: 'soft',
  tone: 'auto',
  product: { title: 'Sac en cuir vintage', description: '' },
  images: ['hero.jpg'],
  copy: {},
}

// Helpers
function makeReview(overrides: Partial<V3Review> = {}): V3Review {
  return {
    author: 'Marie L.',
    initials: 'ML',
    rating: 5,
    title: 'Parfait !',
    text: 'Qualité au rendez-vous, je recommande.',
    date: 'il y a 3 jours',
    verified: true,
    ...overrides,
  }
}

describe('renderReviews', () => {
  // Cas 0 — reviews undefined → section absente (shouldRenderSection retourne false,
  // mais renderReviews lui-même renvoie '' si reviews manquent).
  it('Cas 0 : reviews=undefined → renvoie chaîne vide', () => {
    const html = renderReviews({ ...base, copy: {} }, softTokens)
    expect(html).toBe('')
  })

  // Cas 1 — reviews=[] → section absente (même garde)
  it('Cas 1 : reviews=[] → renvoie chaîne vide', () => {
    const html = renderReviews({ ...base, copy: { reviews: [] } }, softTokens)
    expect(html).toBe('')
  })

  // Sprint 4 T6 — seuil relevé de 3 à 5 (KISAME QW-3).
  // 4 reviews ou moins → section absente (grid trop creuse sur mobile).
  it('Cas limite : 2 reviews → renvoie chaîne vide (seuil = 5)', () => {
    const html = renderReviews(
      { ...base, copy: { reviews: [makeReview(), makeReview()] } },
      softTokens,
    )
    expect(html).toBe('')
  })

  it('Cas limite bis : 4 reviews → renvoie chaîne vide (seuil = 5)', () => {
    const reviews = Array.from({ length: 4 }, () => makeReview())
    const html = renderReviews({ ...base, copy: { reviews } }, softTokens)
    expect(html).toBe('')
  })

  // Cas 2 — 5 reviews sans photo_url (seuil minimum) → section présente
  it('Cas 2 : 5 reviews sans photo_url → section présente, aucune balise img UGC', () => {
    const reviews = Array.from({ length: 5 }, (_, i) =>
      makeReview({ author: `User ${i}`, initials: `U${i}`, rating: 5 })
    )
    const html = renderReviews({ ...base, copy: { reviews } }, softTokens)

    // La section est rendue
    expect(html).toContain('kvt-reviews')
    expect(html).toContain('kvt-reviews__grid')

    // Les 5 auteurs apparaissent
    reviews.forEach(r => expect(html).toContain(r.author))

    // Aucune balise img UGC (pas de photo_url)
    // Les seuls img présents seraient des avatars, mais notre renderer n'utilise
    // que des div gradient pour les avatars quand photo_url est absent
    const imgTags = html.match(/<img[^>]+src="http/g) ?? []
    expect(imgTags.length).toBe(0)
  })

  // Cas 3 — mix 6 reviews dont 2 avec photo_url → grid mixte
  it('Cas 3 : 6 reviews dont 2 avec photo_url → grid mixte, UGC photos présentes', () => {
    const reviews: V3Review[] = [
      makeReview({ author: 'Alice', initials: 'AL', photo_url: 'https://cdn.example.com/ugc1.jpg' }),
      makeReview({ author: 'Bob', initials: 'BO' }),
      makeReview({ author: 'Clara', initials: 'CL', photo_url: 'https://cdn.example.com/ugc2.jpg' }),
      makeReview({ author: 'David', initials: 'DA' }),
      makeReview({ author: 'Eva', initials: 'EV', rating: 4 }),
      makeReview({ author: 'Fred', initials: 'FR', verified: false }),
    ]
    const html = renderReviews({ ...base, copy: { reviews } }, softTokens)

    // Section présente
    expect(html).toContain('kvt-reviews')

    // Tous les auteurs
    reviews.forEach(r => expect(html).toContain(r.author))

    // Les 2 reviews avec photo_url contiennent une balise img avec cette URL
    expect(html).toContain('ugc1.jpg')
    expect(html).toContain('ugc2.jpg')

    // Les 4 sans photo n'ont pas d'img UGC (vérification partielle : au moins les 2 UGC présentes)
    const ugcImgCount = (html.match(/ugc\d+\.jpg/g) ?? []).length
    expect(ugcImgCount).toBeGreaterThanOrEqual(2)
  })

  // Vérifications supplémentaires sur le rendu riche (summary bar, distribution, filtres)
  // Seuil 5 obligatoire depuis Sprint 4 T6
  it('rendu riche : summary bar avec note moyenne, distribution et filtres présents', () => {
    const reviews = [
      makeReview({ rating: 5 }),
      makeReview({ rating: 5 }),
      makeReview({ rating: 4 }),
      makeReview({ rating: 5 }),
      makeReview({ rating: 4 }),
    ]
    const html = renderReviews({ ...base, copy: { reviews } }, softTokens)

    // Summary bar
    expect(html).toContain('Avis clients')
    expect(html).toContain('Ce qu\'ils en disent.')

    // Filtres chips
    expect(html).toContain('Tous')
    expect(html).toContain('Avec photos')
    expect(html).toContain('5 étoiles')
    expect(html).toContain('Vérifiés')

    // Distribution des étoiles (les barres de 5 → 1)
    expect(html).toContain('avis vérifiés')
  })

  // Sprint 4 — T4 : 5 reviews sans photo_url (valeur exacte du brief)
  it('Sprint 4 T4 : 5 reviews sans photo_url → section présente, aucune balise img UGC', () => {
    const reviews = Array.from({ length: 5 }, (_, i) =>
      makeReview({ author: `User ${i}`, initials: `U${i}`, rating: 5 })
    )
    const html = renderReviews({ ...base, copy: { reviews } }, softTokens)

    expect(html).toContain('kvt-reviews')
    reviews.forEach(r => expect(html).toContain(r.author))
    // Aucune balise img avec URL http (pas de photo_url → pas de bloc UGC)
    const ugcImgs = html.match(/<img[^>]+src="http/g) ?? []
    expect(ugcImgs.length).toBe(0)
  })

  // Sprint 4 — T5 : 6 reviews dont 2 avec photo_url (valeur exacte du brief)
  it('Sprint 4 T5 : 6 reviews dont 2 photo_url → 2 cards avec img UGC + 4 sans', () => {
    const reviews = [
      makeReview({ author: 'Alice',  initials: 'AL', photo_url: 'https://cdn.example.com/ugcA.jpg' }),
      makeReview({ author: 'Bruno',  initials: 'BR' }),
      makeReview({ author: 'Carla',  initials: 'CA', photo_url: 'https://cdn.example.com/ugcB.jpg' }),
      makeReview({ author: 'Denis',  initials: 'DE' }),
      makeReview({ author: 'Elise',  initials: 'EL', rating: 4 }),
      makeReview({ author: 'Fabien', initials: 'FA', verified: false }),
    ]
    const html = renderReviews({ ...base, copy: { reviews } }, softTokens)

    expect(html).toContain('kvt-reviews')
    reviews.forEach(r => expect(html).toContain(r.author))

    // Les 2 reviews avec photo_url sont rendues avec leurs images
    expect(html).toContain('ugcA.jpg')
    expect(html).toContain('ugcB.jpg')

    // Exactement 2 références UGC dans le HTML (pas davantage)
    const ugcCount = (html.match(/ugc[AB]\.jpg/g) ?? []).length
    expect(ugcCount).toBe(2)
  })

  it('utilise les tokens couleurs (bgAlt, star, border)', () => {
    const reviews = Array.from({ length: 5 }, () => makeReview())
    const html = renderReviews({ ...base, copy: { reviews } }, softTokens)

    // bgAlt pour le fond de section
    expect(html).toContain(softTokens.colors.bgAlt)
    // star pour les étoiles
    expect(html).toContain(softTokens.colors.star)
  })

  it('échappe les caractères HTML dans le texte et le titre des reviews', () => {
    const reviews = [
      makeReview({ title: '<b>Excellent</b>', text: 'Super & rapide' }),
      makeReview(),
      makeReview(),
      makeReview(),
      makeReview(),
    ]
    const html = renderReviews({ ...base, copy: { reviews } }, softTokens)
    expect(html).toContain('&lt;b&gt;Excellent&lt;/b&gt;')
    expect(html).toContain('Super &amp; rapide')
  })
})
