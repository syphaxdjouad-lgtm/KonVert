import type { LandingPageData } from '@/types'

// Fixture utilisée par les tests Vitest et Playwright — les 19 sections
// (hors hero_badges qui reste dans le hero) sont remplies avec des données
// réalistes pour tester le rendu nominal complet.

export const mockLandingDataFull: LandingPageData = {
  headline: 'Le sérum qui transforme votre peau en 14 jours',
  subtitle: 'Concentré botanique haute performance, certifié Cosmos Organic',
  benefits: [
    'Réduit les rides visibles de 32%',
    'Hydratation longue durée 24h',
    'Texture légère non grasse',
    'Sans parfum ni perturbateurs',
    '100% origine naturelle',
  ],
  faq: [
    { question: 'Convient-il aux peaux sensibles ?', answer: 'Oui, testé dermatologiquement.' },
    { question: 'Quel délai de livraison ?', answer: '48h en France, 5j en Europe.' },
  ],
  cta: 'Commander maintenant',
  urgency: 'Stock limité — plus que 23 unités',
  product_name: 'Sérum Renaissance',
  price: '49',
  original_price: '79',
  images: [
    'https://cdn.shopify.com/serum-1.jpg',
    'https://cdn.shopify.com/serum-2.jpg',
    'https://cdn.shopify.com/serum-3.jpg',
    'https://cdn.shopify.com/serum-4.jpg',
    'https://cdn.shopify.com/serum-5.jpg',
    'https://cdn.shopify.com/serum-6.jpg',
    'https://cdn.shopify.com/serum-7.jpg',
    'https://cdn.shopify.com/serum-8.jpg',
  ],
  language: 'fr',

  hero_badges: ['Cosmos Organic', 'Made in France', 'Cruelty free'],

  story: {
    problem: 'Votre peau perd 1% de collagène par an après 25 ans',
    agitation: 'Les crèmes classiques effleurent la surface sans rien réparer en profondeur',
    solution: 'Un complexe peptide+vitamine C stabilisé qui stimule la production de collagène',
    transformation: 'Une peau ferme, lumineuse, qui rajeunit visiblement en quelques semaines',
  },

  target_audience: [
    { profile: 'Femme 30-45 ans active', pain: 'Premiers signes du temps malgré une bonne hygiène' },
    { profile: 'Peau mixte à sensible', pain: 'Difficile de trouver un soin efficace sans irriter' },
    { profile: 'Routine minimaliste', pain: 'Veut UN produit qui fait tout sans empiler 5 couches' },
  ],

  unique_mechanism: {
    name: 'Bio-Stim Complex™',
    description: 'Combinaison brevetée de peptides marins + vitamine C encapsulée libérée progressivement',
    proof: 'Étude clinique 2024 sur 87 femmes : +41% de fermeté en 28 jours',
  },

  features: [
    { icon: '🌿', title: 'Botanique', description: 'Extrait de centella asiatica + acide hyaluronique végétal' },
    { icon: '⚡', title: 'Pénétration rapide', description: 'Texture huile sèche absorbée en 30 secondes' },
    { icon: '🛡', title: 'Stable', description: 'Vitamine C protégée par capsule liposomale, ne s\'oxyde pas' },
    { icon: '💧', title: 'Hydratation 24h', description: 'Acide hyaluronique 3 poids moléculaires différents' },
    { icon: '✨', title: 'Éclat visible', description: 'Teint unifié et lumineux dès la première semaine' },
    { icon: '🌱', title: 'Clean', description: 'Sans silicones, sans parabens, sans perturbateurs endocriniens' },
  ],

  how_it_works: [
    { step: 1, title: 'Nettoyer', description: 'Sur peau propre, matin et soir' },
    { step: 2, title: 'Appliquer', description: '3-4 gouttes sur le visage et le cou' },
    { step: 3, title: 'Masser', description: 'Mouvements doux ascendants jusqu\'à pénétration' },
    { step: 4, title: 'Hydrater', description: 'Compléter avec votre crème habituelle' },
  ],

  before_after: [
    { before: 'Peau terne, rides marquées au coin des yeux', after: 'Peau lumineuse, ridules atténuées' },
    { before: 'Pores dilatés et teint irrégulier', after: 'Grain de peau affiné, teint unifié' },
  ],

  comparison: {
    without_title: 'Sans Sérum Renaissance',
    without: [
      'Rides qui se creusent année après année',
      'Peau qui tire, sensation d\'inconfort',
      'Teint terne malgré le maquillage',
      'Multiples produits empilés sans résultat',
    ],
    with_title: 'Avec Sérum Renaissance',
    with: [
      'Rides visiblement atténuées en 14 jours',
      'Peau souple et confortable du matin au soir',
      'Teint éclatant naturellement, sans fond de teint',
      'UN seul produit qui remplace 3 étapes',
    ],
  },

  competitor_comparison: {
    criteria: ['Origine naturelle', 'Étude clinique', 'Prix par cure', 'Sans parfum', 'Made in France'],
    us: { name: 'Sérum Renaissance', values: ['100%', 'Oui (87 femmes)', '49€', 'Oui', 'Oui'] },
    them: [
      { name: 'Marque A (luxe)', values: ['60%', 'Non', '180€', 'Non', 'Non'] },
      { name: 'Marque B (pharma)', values: ['40%', 'Oui', '35€', 'Oui', 'Non'] },
    ],
  },

  social_proof: { customers: '12 480 +', rating: '4,8 / 5', sold: '847 cette semaine' },

  press_mentions: ['Vogue', 'Elle', 'Marie Claire', 'Cosmopolitan', 'L\'Express Styles'],

  testimonials: [
    { name: 'Sophie L.', rating: 5, text: 'Ma peau n\'a jamais été aussi belle. Adopté pour la vie.', variant: 'Achat 30ml' },
    { name: 'Camille R.', rating: 5, text: 'Résultats visibles en 10 jours. Je recommande à toutes mes amies.', variant: 'Achat cure 3 mois' },
    { name: 'Émilie B.', rating: 4, text: 'Très bon produit, texture agréable. Effet flash dès la 1re application.', variant: 'Achat 30ml' },
  ],

  founder_note: {
    name: 'Léa Moreau',
    role: 'Fondatrice & formulatrice',
    message: 'J\'ai créé ce sérum après 8 ans en labo cosmétique : un seul soin qui fait vraiment ce qu\'il promet, sans compromis sur la naturalité.',
  },

  guarantee: { title: 'Satisfait ou remboursé', description: 'Si après 30 jours vous ne voyez aucune différence, on vous rembourse sans question.', duration: '30 jours' },

  risk_reversal: [
    { icon: '🚚', title: 'Livraison gratuite', description: 'Dès 50€ d\'achat partout en Europe' },
    { icon: '↩', title: 'Retour offert', description: '30 jours pour changer d\'avis, retour sans frais' },
    { icon: '💬', title: 'Support 7/7', description: 'Une conseillère beauté répond en moins de 2h' },
  ],

  bonuses: [
    { title: 'Mini contour des yeux', description: '15ml offert pour cibler le regard', value: '29€' },
    { title: 'Routine personnalisée', description: 'Diagnostic + protocole 4 semaines par notre formulatrice', value: '49€' },
    { title: 'Pochette signature', description: 'Pochette satin pour transporter votre sérum', value: '15€' },
  ],

  value_stack: {
    items: [
      { label: 'Sérum Renaissance 30ml', value: '79€' },
      { label: 'Mini contour des yeux', value: '29€' },
      { label: 'Routine personnalisée', value: '49€' },
      { label: 'Pochette signature', value: '15€' },
    ],
    total: '172€',
    you_pay: '49€',
    savings: '123€',
  },

  objections: [
    { objection: 'C\'est cher pour un sérum', response: 'À 49€ pour 2 mois d\'utilisation, ça revient à 0,80€/jour — moins qu\'un café.' },
    { objection: 'J\'ai déjà essayé plein de sérums sans résultat', response: 'Notre complexe Bio-Stim est breveté, étudié cliniquement sur 87 femmes : +41% de fermeté mesurés en 28 jours.' },
    { objection: 'Et si ça ne marche pas sur ma peau ?', response: '30 jours pour le tester, remboursé sans condition si vous n\'êtes pas convaincue.' },
    { objection: 'Je n\'ai pas le temps pour une routine complexe', response: 'Une seule application matin OU soir suffit — c\'est la routine la plus simple du marché.' },
    { objection: 'C\'est vraiment naturel ou c\'est du marketing ?', response: 'Certifié Cosmos Organic par Ecocert, ingrédients tracés à la source, formule publiée intégralement sur notre site.' },
  ],

  community_callout: {
    title: 'Rejoignez les 12 000 femmes de la communauté',
    description: 'Astuces beauté, rituels saisonniers, accès aux nouveautés en avant-première',
    cta: 'Suivre sur Instagram',
  },

  final_pitch: 'Votre peau le mérite. Notre sérum est conçu pour la transformer, pas pour la masquer. Commandez aujourd\'hui, recevez demain, voyez la différence dans 14 jours.',
}
