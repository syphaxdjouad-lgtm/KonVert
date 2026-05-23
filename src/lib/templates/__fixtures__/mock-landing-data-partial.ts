import type { LandingPageData } from '@/types'

// Fixture pour tester le comportement A-skip — données partielles, 50% des
// sections enrichies absentes. Permet de vérifier que renderRichSections
// skippe silencieusement et ne génère pas de HTML vide ni de "undefined".

export const mockLandingDataPartial: LandingPageData = {
  headline: 'Le sérum qui transforme votre peau en 14 jours',
  subtitle: 'Concentré botanique haute performance',
  benefits: ['Réduit les rides', 'Hydratation 24h', 'Texture légère'],
  faq: [{ question: 'Convient peaux sensibles ?', answer: 'Oui.' }],
  cta: 'Commander',
  urgency: 'Stock limité',
  product_name: 'Sérum Renaissance',
  price: '49',
  images: ['https://cdn.shopify.com/serum-1.jpg'],
  language: 'fr',

  // Présentes : ~10 sections
  social_proof: { customers: '12 480 +', rating: '4,8 / 5', sold: '847 cette semaine' },
  story: { problem: 'Peau qui vieillit', agitation: 'Crèmes inefficaces', solution: 'Sérum Bio-Stim', transformation: 'Peau ferme' },
  features: [
    { icon: '🌿', title: 'Botanique', description: 'Centella asiatica' },
    { icon: '⚡', title: 'Pénétration rapide', description: 'Absorbé en 30s' },
  ],
  testimonials: [
    { name: 'Sophie L.', rating: 5, text: 'Adopté pour la vie.' },
  ],
  guarantee: { title: 'Satisfait ou remboursé', description: 'Retour facile', duration: '30 jours' },
  bonuses: [{ title: 'Pochette', description: 'Offerte', value: '15€' }],
  comparison: { without_title: 'Sans', without: ['Rides'], with_title: 'Avec', with: ['Peau lisse'] },

  // Absentes : target_audience, unique_mechanism, how_it_works, before_after,
  // competitor_comparison, press_mentions, founder_note, value_stack,
  // risk_reversal, objections, community_callout, final_pitch, hero_badges
}
