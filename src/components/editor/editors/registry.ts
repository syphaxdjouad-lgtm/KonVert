// Registry centralisé des 21 section editors (chantier C2 — D2 reco ANNA).
// Chaque entry déclare les groupes + fields éditables pour une SectionKey.
//
// Conventions :
// - field.target='data' (défaut) → mute landingData via updateSectionField
// - field.target='visualSettings' → mute visualSettings via updateVisualSetting
// - field.key nested paths supportés : "features.0.title"

import type { SectionSchema } from './schemas'
import type { SectionKey } from '@/lib/templates/sections'

const STYLE_GROUP_PADDING_BG_ALIGN = {
  title: 'Style',
  fields: [
    { key: 'padding', type: 'density' as const, label: 'Densité', target: 'visualSettings' as const },
    { key: 'bgColor', type: 'color' as const, label: 'Fond', target: 'visualSettings' as const },
    { key: 'alignment', type: 'select' as const, label: 'Alignement', target: 'visualSettings' as const, options: [
      { value: 'left', label: 'Gauche' },
      { value: 'center', label: 'Centre' },
      { value: 'right', label: 'Droite' },
    ] },
  ],
}

const STYLE_GROUP_PADDING_ONLY = {
  title: 'Style',
  fields: [
    { key: 'padding', type: 'density' as const, label: 'Densité', target: 'visualSettings' as const },
  ],
}

const RATING_OPTIONS = [
  { value: '5', label: '5 étoiles' },
  { value: '4', label: '4 étoiles' },
  { value: '3', label: '3 étoiles' },
  { value: '2', label: '2 étoiles' },
  { value: '1', label: '1 étoile' },
]

export const SECTION_REGISTRY: SectionSchema[] = [
  {
    sectionKey: 'social_proof_bar',
    groups: [
      {
        title: 'Contenu',
        fields: [
          { key: 'social_proof.rating', type: 'select', label: 'Note', options: RATING_OPTIONS },
          { key: 'social_proof.count', type: 'text', label: 'Nb avis (ex: 12 540)' },
          { key: 'social_proof.label', type: 'text', label: 'Label' },
        ],
      },
    ],
  },
  {
    sectionKey: 'story',
    groups: [
      {
        title: 'Contenu',
        fields: [
          { key: 'story.hero_title', type: 'text', label: 'Titre' },
          { key: 'story.problem', type: 'textarea', label: 'Problème' },
          { key: 'story.solution', type: 'textarea', label: 'Solution' },
          { key: 'story.transformation', type: 'textarea', label: 'Transformation' },
        ],
      },
      STYLE_GROUP_PADDING_BG_ALIGN,
    ],
  },
  {
    sectionKey: 'target_audience',
    groups: [
      {
        title: 'Contenu',
        fields: [
          { key: 'target_audience.0.profile', type: 'text', label: 'Profil 1' },
          { key: 'target_audience.0.pain', type: 'textarea', label: 'Douleur 1' },
          { key: 'target_audience.1.profile', type: 'text', label: 'Profil 2' },
          { key: 'target_audience.1.pain', type: 'textarea', label: 'Douleur 2' },
          { key: 'target_audience.2.profile', type: 'text', label: 'Profil 3' },
          { key: 'target_audience.2.pain', type: 'textarea', label: 'Douleur 3' },
        ],
      },
      STYLE_GROUP_PADDING_ONLY,
    ],
  },
  {
    sectionKey: 'features',
    groups: [
      {
        title: 'Contenu',
        fields: [
          { key: 'features.0.title', type: 'text', label: 'Feature 1 — titre' },
          { key: 'features.0.description', type: 'textarea', label: 'Feature 1 — description' },
          { key: 'features.1.title', type: 'text', label: 'Feature 2 — titre' },
          { key: 'features.1.description', type: 'textarea', label: 'Feature 2 — description' },
          { key: 'features.2.title', type: 'text', label: 'Feature 3 — titre' },
          { key: 'features.2.description', type: 'textarea', label: 'Feature 3 — description' },
          { key: 'features.3.title', type: 'text', label: 'Feature 4 — titre' },
          { key: 'features.3.description', type: 'textarea', label: 'Feature 4 — description' },
        ],
      },
      STYLE_GROUP_PADDING_BG_ALIGN,
    ],
  },
  {
    sectionKey: 'gallery',
    groups: [
      {
        title: 'Images',
        fields: Array.from({ length: 8 }, (_, i) => ({
          key: `images.${i}`,
          type: 'image' as const,
          label: `Image ${i + 1}`,
        })),
      },
      STYLE_GROUP_PADDING_ONLY,
    ],
  },
  {
    sectionKey: 'unique_mechanism',
    groups: [
      {
        title: 'Contenu',
        fields: [
          { key: 'unique_mechanism.title', type: 'text', label: 'Titre' },
          { key: 'unique_mechanism.description', type: 'textarea', label: 'Description' },
        ],
      },
      STYLE_GROUP_PADDING_BG_ALIGN,
    ],
  },
  {
    sectionKey: 'how_it_works',
    groups: [
      {
        title: 'Étapes',
        fields: [
          { key: 'how_it_works.0.step', type: 'text', label: 'Étape 1 — titre' },
          { key: 'how_it_works.0.description', type: 'textarea', label: 'Étape 1 — description' },
          { key: 'how_it_works.1.step', type: 'text', label: 'Étape 2 — titre' },
          { key: 'how_it_works.1.description', type: 'textarea', label: 'Étape 2 — description' },
          { key: 'how_it_works.2.step', type: 'text', label: 'Étape 3 — titre' },
          { key: 'how_it_works.2.description', type: 'textarea', label: 'Étape 3 — description' },
        ],
      },
      STYLE_GROUP_PADDING_ONLY,
    ],
  },
  {
    sectionKey: 'before_after',
    groups: [
      {
        title: 'Contenu',
        fields: [
          { key: 'before_after.0.before_label', type: 'text', label: 'Label "Avant"' },
          { key: 'before_after.0.before_image', type: 'image', label: 'Image "Avant"' },
          { key: 'before_after.0.after_label', type: 'text', label: 'Label "Après"' },
          { key: 'before_after.0.after_image', type: 'image', label: 'Image "Après"' },
        ],
      },
    ],
  },
  {
    sectionKey: 'comparison',
    groups: [
      {
        title: 'Contenu',
        fields: [
          { key: 'comparison.title', type: 'text', label: 'Titre' },
          { key: 'comparison.our_product', type: 'text', label: 'Notre produit (label)' },
          { key: 'comparison.competitor', type: 'text', label: 'Concurrent (label)' },
        ],
      },
      STYLE_GROUP_PADDING_BG_ALIGN,
    ],
  },
  {
    sectionKey: 'competitor_comparison',
    groups: [
      {
        title: 'Contenu',
        fields: [
          { key: 'competitor_comparison.title', type: 'text', label: 'Titre' },
        ],
      },
      STYLE_GROUP_PADDING_ONLY,
    ],
  },
  {
    sectionKey: 'testimonials',
    groups: [
      {
        title: 'Avis',
        fields: [
          { key: 'testimonials.0.name', type: 'text', label: 'Avis 1 — nom' },
          { key: 'testimonials.0.text', type: 'textarea', label: 'Avis 1 — texte' },
          { key: 'testimonials.0.rating', type: 'select', label: 'Avis 1 — note', options: RATING_OPTIONS },
          { key: 'testimonials.0.avatar', type: 'image', label: 'Avis 1 — avatar' },
          { key: 'testimonials.1.name', type: 'text', label: 'Avis 2 — nom' },
          { key: 'testimonials.1.text', type: 'textarea', label: 'Avis 2 — texte' },
          { key: 'testimonials.1.rating', type: 'select', label: 'Avis 2 — note', options: RATING_OPTIONS },
          { key: 'testimonials.1.avatar', type: 'image', label: 'Avis 2 — avatar' },
          { key: 'testimonials.2.name', type: 'text', label: 'Avis 3 — nom' },
          { key: 'testimonials.2.text', type: 'textarea', label: 'Avis 3 — texte' },
          { key: 'testimonials.2.rating', type: 'select', label: 'Avis 3 — note', options: RATING_OPTIONS },
          { key: 'testimonials.2.avatar', type: 'image', label: 'Avis 3 — avatar' },
        ],
      },
      STYLE_GROUP_PADDING_ONLY,
    ],
  },
  {
    sectionKey: 'press_mentions',
    groups: [
      {
        title: 'Mentions presse',
        fields: [
          { key: 'press_mentions.0', type: 'text', label: 'Mention 1' },
          { key: 'press_mentions.1', type: 'text', label: 'Mention 2' },
          { key: 'press_mentions.2', type: 'text', label: 'Mention 3' },
        ],
      },
    ],
  },
  {
    sectionKey: 'founder_note',
    groups: [
      {
        title: 'Contenu',
        fields: [
          { key: 'founder_note.name', type: 'text', label: 'Nom du fondateur' },
          { key: 'founder_note.message', type: 'textarea', label: 'Message', rows: 6 },
          { key: 'founder_note.avatar', type: 'image', label: 'Avatar' },
        ],
      },
    ],
  },
  {
    sectionKey: 'value_stack',
    groups: [
      {
        title: 'Contenu',
        fields: [
          { key: 'value_stack.title', type: 'text', label: 'Titre' },
          { key: 'value_stack.items.0.label', type: 'text', label: 'Item 1 — label' },
          { key: 'value_stack.items.0.value', type: 'text', label: 'Item 1 — valeur' },
          { key: 'value_stack.items.1.label', type: 'text', label: 'Item 2 — label' },
          { key: 'value_stack.items.1.value', type: 'text', label: 'Item 2 — valeur' },
          { key: 'value_stack.items.2.label', type: 'text', label: 'Item 3 — label' },
          { key: 'value_stack.items.2.value', type: 'text', label: 'Item 3 — valeur' },
        ],
      },
    ],
  },
  {
    sectionKey: 'bonuses',
    groups: [
      {
        title: 'Bonus',
        fields: [
          { key: 'bonuses.0.title', type: 'text', label: 'Bonus 1 — titre' },
          { key: 'bonuses.0.description', type: 'textarea', label: 'Bonus 1 — description' },
          { key: 'bonuses.0.image', type: 'image', label: 'Bonus 1 — image' },
          { key: 'bonuses.1.title', type: 'text', label: 'Bonus 2 — titre' },
          { key: 'bonuses.1.description', type: 'textarea', label: 'Bonus 2 — description' },
          { key: 'bonuses.1.image', type: 'image', label: 'Bonus 2 — image' },
        ],
      },
    ],
  },
  {
    sectionKey: 'guarantee',
    groups: [
      {
        title: 'Contenu',
        fields: [
          { key: 'guarantee.title', type: 'text', label: 'Titre' },
          { key: 'guarantee.description', type: 'textarea', label: 'Description' },
          { key: 'guarantee.duration', type: 'text', label: 'Durée (ex: 30 jours)' },
        ],
      },
      STYLE_GROUP_PADDING_BG_ALIGN,
    ],
  },
  {
    sectionKey: 'trust_badges_payment',
    groups: [
      {
        title: 'Moyens de paiement',
        fields: [
          { key: 'payment_methods', type: 'text', label: 'Liste (séparée par virgule)', helpText: 'visa, mastercard, paypal, apple_pay…' },
        ],
      },
      {
        title: 'Style',
        fields: [
          { key: 'alignment', type: 'select', label: 'Alignement', target: 'visualSettings', options: [
            { value: 'left', label: 'Gauche' },
            { value: 'center', label: 'Centre' },
            { value: 'right', label: 'Droite' },
          ] },
        ],
      },
    ],
  },
  {
    sectionKey: 'risk_reversal',
    groups: [
      {
        title: 'Contenu',
        fields: [
          { key: 'risk_reversal.0.title', type: 'text', label: 'Argument 1 — titre' },
          { key: 'risk_reversal.0.description', type: 'textarea', label: 'Argument 1 — description' },
          { key: 'risk_reversal.1.title', type: 'text', label: 'Argument 2 — titre' },
          { key: 'risk_reversal.1.description', type: 'textarea', label: 'Argument 2 — description' },
          { key: 'risk_reversal.2.title', type: 'text', label: 'Argument 3 — titre' },
          { key: 'risk_reversal.2.description', type: 'textarea', label: 'Argument 3 — description' },
        ],
      },
    ],
  },
  {
    sectionKey: 'objections',
    groups: [
      {
        title: 'Objections',
        fields: [
          { key: 'objections.0.question', type: 'text', label: 'Q1' },
          { key: 'objections.0.answer', type: 'textarea', label: 'R1' },
          { key: 'objections.1.question', type: 'text', label: 'Q2' },
          { key: 'objections.1.answer', type: 'textarea', label: 'R2' },
          { key: 'objections.2.question', type: 'text', label: 'Q3' },
          { key: 'objections.2.answer', type: 'textarea', label: 'R3' },
          { key: 'objections.3.question', type: 'text', label: 'Q4' },
          { key: 'objections.3.answer', type: 'textarea', label: 'R4' },
        ],
      },
    ],
  },
  {
    sectionKey: 'community_callout',
    groups: [
      {
        title: 'Contenu',
        fields: [
          { key: 'community_callout.title', type: 'text', label: 'Titre' },
          { key: 'community_callout.description', type: 'textarea', label: 'Description' },
          { key: 'community_callout.cta_label', type: 'text', label: 'CTA' },
        ],
      },
    ],
  },
  {
    sectionKey: 'final_pitch',
    groups: [
      {
        title: 'Contenu',
        fields: [
          { key: 'final_pitch.title', type: 'text', label: 'Titre' },
          { key: 'final_pitch.urgency', type: 'textarea', label: 'Urgence' },
          { key: 'final_pitch.cta_label', type: 'text', label: 'CTA' },
        ],
      },
      STYLE_GROUP_PADDING_BG_ALIGN,
    ],
  },
]

// Helper : lookup schema by sectionKey
export function getSectionSchema(sectionKey: SectionKey): SectionSchema | undefined {
  return SECTION_REGISTRY.find(s => s.sectionKey === sectionKey)
}
