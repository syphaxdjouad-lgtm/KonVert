'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  templateEtecBlue,
  templateEtecNoir,
  templateEtecRose,
  templateEtecSage,
  templateEtecBeauty,
  templateEtecStyle,
  templateEtecShopz,
  templateEtecVelvety,
  templateEtecPrime,
  templateEtecCasa,
  templateEtecPet,
  templateEtecGadget,
} from '@/lib/templates'
import type { LandingPageData } from '@/types'

// ---------------------------------------------------------------------------
// Sample data — images adaptées à la niche de chaque template
// ---------------------------------------------------------------------------

const SAMPLE_BLUE: LandingPageData = {
  product_name: 'ProRunner X5 Carbon',
  headline: 'Les chaussures qui transforment ta course',
  subtitle: 'Technologie carbone ultra-légère. Amorti réactif breveté. Approuvé par 12 000 athlètes dans 47 pays.',
  cta: 'Commander maintenant — Livraison offerte',
  urgency: '⚡ Stock limité — Il reste 23 paires en taille 42',
  benefits: [
    'Semelle carbone ultra-légère (-40% vs chaussure standard)',
    'Amorti réactif breveté — énergie restituée à chaque foulée',
    'Mesh respirant technique 360° — pieds au frais même à effort max',
    'Semelle antidérapante tout terrain — grip parfait sur toutes surfaces',
    'Conçu avec des podologues — adapté à toutes les morphologies de pied',
  ],
  faq: [
    { question: 'Quelle taille choisir ?', answer: 'Prenez votre taille habituelle. En cas de doute entre deux tailles, prenez la plus grande.' },
    { question: 'Délai de livraison ?', answer: 'Livraison express en 2–4 jours ouvrés. Expédition le jour même avant 14h.' },
    { question: 'Retours ?', answer: 'Retours acceptés sous 30 jours. Remboursement complet sous 5 jours.' },
  ],
  price: '79',
  original_price: '129',
  images: [
    'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80',
    'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=800&q=80',
    'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800&q=80',
    'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&q=80',
  ],
}

const SAMPLE_NOIR: LandingPageData = {
  product_name: 'Phantom Watch X',
  headline: 'L\'heure n\'attend pas. Et vous non plus.',
  subtitle: 'Mouvement automatique suisse. Boîtier titane 42mm. Verre saphir anti-reflets. Édition limitée à 500 exemplaires.',
  cta: 'Réserver la mienne — Stock limité',
  urgency: '🖤 Édition limitée — 47 pièces restantes',
  benefits: [
    'Mouvement automatique certifié COSC — précision Swiss Made',
    'Boîtier titane grade 5 — ultra-léger, anti-allergie',
    'Verre saphir 3 couches anti-reflets — lisibilité parfaite',
    'Étanchéité 200m — conçu pour l\'aventure et le prestige',
    'Bracelet cuir vegan premium — confort toute la journée',
  ],
  faq: [
    { question: 'Garantie ?', answer: 'Garantie 3 ans pièces et main d\'œuvre. Service après-vente dédié.' },
    { question: 'Livraison ?', answer: 'Livraison sécurisée en écrin premium sous 5–7 jours ouvrés.' },
    { question: 'Retours ?', answer: 'Retours acceptés sous 14 jours si produit intact.' },
  ],
  price: '899',
  original_price: '1299',
  images: [
    'https://images.unsplash.com/photo-1547996160-81dfa63595aa?w=800&q=80',
    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80',
    'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800&q=80',
    'https://images.unsplash.com/photo-1434056886845-dac89ffe9b56?w=800&q=80',
  ],
}

const SAMPLE_ROSE: LandingPageData = {
  product_name: 'Velvet Glow Serum',
  headline: 'Ta peau mérite le meilleur',
  subtitle: 'Sérum éclat à l\'acide hyaluronique et vitamine C. Testé dermatologiquement. Résultats visibles en 14 jours.',
  cta: 'Adopter le Velvet Glow →',
  urgency: '💕 -30% ce weekend seulement — offre limitée',
  benefits: [
    'Acide hyaluronique triple poids — hydratation 72h',
    'Vitamine C stabilisée 15% — éclat et anti-taches',
    'Niacinamide 5% — pores resserrés, teint unifié',
    'Testé dermatologiquement — convient aux peaux sensibles',
    'Formule vegan & cruelty-free — certifiée ECOCERT',
  ],
  faq: [
    { question: 'Convient aux peaux sensibles ?', answer: 'Oui, notre formule est testée dermatologiquement et convient à tous les types de peau.' },
    { question: 'Résultats en combien de temps ?', answer: 'Première amélioration visible en 7 jours. Résultats optimaux en 28 jours.' },
    { question: 'Satisfait ou remboursé ?', answer: '30 jours pour changer d\'avis. Remboursement complet, aucune question posée.' },
  ],
  price: '49',
  original_price: '79',
  images: [
    'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800&q=80',
    'https://images.unsplash.com/photo-1612817288484-6f916006741a?w=800&q=80',
    'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&q=80',
    'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=800&q=80',
  ],
}

const SAMPLE_SAGE: LandingPageData = {
  product_name: 'Pure Roots Detox',
  headline: 'Retourne à l\'essentiel. La nature sait ce qui est bon pour toi.',
  subtitle: 'Complément alimentaire 100% bio. 23 plantes adaptogènes. Certifié Agriculture Biologique Europe.',
  cta: 'Commencer ma cure detox →',
  urgency: '🌿 Livraison offerte dès 2 boîtes',
  benefits: [
    '23 plantes adaptogènes bio — sélectionnées par des phytothérapeutes',
    'Certifié Agriculture Biologique Europe — aucun pesticide',
    'Gélules végétales — convient aux vegans et végétariens',
    'Fabriqué en France — contrôle qualité à chaque étape',
    'Sans gluten, sans lactose, sans OGM — pour tous',
  ],
  faq: [
    { question: 'Durée d\'une cure ?', answer: 'Cure recommandée de 3 mois pour des résultats durables. Peut se prendre en continu.' },
    { question: 'Effets secondaires ?', answer: 'Aucun effet secondaire connu. Consultez votre médecin si vous êtes sous traitement.' },
    { question: 'Livraison ?', answer: 'Livraison en 3–5 jours ouvrés. Offerte dès 2 boîtes commandées.' },
  ],
  price: '39',
  original_price: '59',
  images: [
    'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&q=80',
    'https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=800&q=80',
    'https://images.unsplash.com/photo-1466637574441-749b8f19452f?w=800&q=80',
    'https://images.unsplash.com/photo-1490818387583-1baba5e638af?w=800&q=80',
  ],
}

const SAMPLE_HAIRGLOW: LandingPageData = {
  product_name: 'LuxHair Pro',
  headline: 'Des cheveux transformés, une confiance retrouvée',
  subtitle: 'Formule kératine premium enrichie aux huiles botaniques. Sans sulfates, sans parabènes. Résultats visibles en 7 jours.',
  cta: 'Découvrir la routine — Livraison offerte',
  urgency: '🌿 Édition limitée — Stock faible',
  benefits: [
    'Formule kératine premium — lissage naturel durable',
    'Huiles botaniques bio — argan, ricin, jojoba',
    'Sans sulfates, sans parabènes — respecte le cuir chevelu',
    'Résultats visibles en 7 jours — testé et approuvé',
    'Convient à tous les types de cheveux — même colorés',
  ],
  faq: [
    { question: 'Convient aux cheveux colorés ?', answer: 'Oui, notre formule est spécialement conçue pour respecter les cheveux colorés et traités chimiquement.' },
    { question: 'Délai de livraison ?', answer: 'Livraison express en 2–3 jours ouvrés. Expédition le jour même avant 14h.' },
    { question: 'Garantie satisfait ou remboursé ?', answer: 'Satisfait ou remboursé sous 30 jours. Aucune question posée.' },
  ],
  price: '49',
  original_price: '79',
  images: [
    'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&q=80',
    'https://images.unsplash.com/photo-1560869713-7d0a29430803?w=800&q=80',
    'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=800&q=80',
    'https://images.unsplash.com/photo-1519415387722-a1c3bbef716c?w=800&q=80',
    'https://images.unsplash.com/photo-1519735777090-ec97162dc266?w=800&q=80',
  ],
}

const SAMPLE_STYLEPRO: LandingPageData = {
  product_name: 'Style Studio',
  headline: 'Discover your style with a professional stylist',
  subtitle: 'Your personal fashion consultant who understands your vision and brings it to life. Join 34K+ members.',
  cta: 'Start your journey',
  urgency: '✨ Limited spots available this month',
  benefits: [
    'Ongoing support from certified stylists',
    'Expert advice tailored to your body type',
    'Personalized shopping assistance',
    'Complete wardrobe revitalization',
    'Exclusive brand partnerships — BOSS, Paco, WM',
  ],
  faq: [
    { question: 'How does the consultation work?', answer: 'Book your initial session online. Your stylist will analyze your style goals and create a personalized fashion plan.' },
    { question: 'Can I cancel anytime?', answer: 'Yes. Cancel your membership at any time from your account settings. No commitment required.' },
    { question: 'What styles do you cover?', answer: 'From casual to elegant, sportswear to techwear — our team covers all styles and occasions.' },
  ],
  price: '89',
  original_price: '149',
  images: [
    'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=80',
    'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=800&q=80',
    'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=800&q=80',
    'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=800&q=80',
    'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&q=80',
  ],
}

const SAMPLE_VELVETY: LandingPageData = {
  product_name: 'Velvety Glow Ritual',
  headline: 'Your skin deserves nature\'s finest',
  subtitle: 'Botanical skincare crafted with 100% organic actives. Dermatologist-tested. Cruelty-free. Designed for your daily glow ritual.',
  cta: 'Discover the ritual →',
  urgency: '🌿 Free delivery from 2 products ordered',
  benefits: [
    'Formulated with 100% certified organic ingredients — no parabens, no sulfates, no compromise.',
    'Dermatologist-tested and adapted to all skin types, including sensitive and reactive skin.',
    'Ready-to-use ritual — just one step for radiant, moisturized skin every morning.',
    'Made from plant-based actives sourced from sustainable, cruelty-free farms.',
    'Biodegradable packaging — our commitment to your skin and to the planet.',
  ],
  faq: [
    { question: 'Is it suitable for sensitive skin?', answer: 'Yes. All our formulas are dermatologist-tested and free from common irritants. Perfect for reactive and sensitive skin types.' },
    { question: 'When will I see results?', answer: 'Most customers notice a difference in skin texture and radiance after 7–14 days of consistent use.' },
    { question: 'Are products cruelty-free?', answer: 'Absolutely. We are PETA certified cruelty-free. We never test on animals and source only from ethical suppliers.' },
  ],
  price: '34.90',
  original_price: '49.90',
  images: [
    'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=800&q=80',
    'https://images.unsplash.com/photo-1526045612212-70caf35c14df?w=800&q=80',
    'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=800&q=80',
    'https://images.unsplash.com/photo-1585842378054-ee2e52f94ba2?w=800&q=80',
  ],
}

const SAMPLE_PRIME: LandingPageData = {
  product_name: 'Daily Prime Formula',
  headline: 'Feel extraordinary. Every single day.',
  subtitle: '75 science-backed nutrients in one daily supplement. No guesswork, no compromise — just everything your body needs to thrive.',
  cta: 'Start Your Transformation →',
  urgency: '🔥 Save 20% on first order · Free shipping · Cancel anytime',
  benefits: [
    'Clinically dosed — no proprietary blends, ever',
    '75 nutrients in one capsule — simplify your routine',
    'Third-party tested for purity and potency',
    'Ships in sustainable, plastic-neutral packaging',
    'Backed by a 30-day money-back guarantee',
  ],
  faq: [
    { question: 'When will I see results?', answer: 'Most users notice improved energy and focus within 7–14 days. Optimal results are typically seen after 30–60 days of consistent use.' },
    { question: 'Is it safe with medications?', answer: 'Our formula is generally well-tolerated. However, consult your healthcare provider if you take any medications or have underlying conditions.' },
    { question: 'Can I cancel my subscription?', answer: 'Yes, you can cancel anytime before your next billing date with no fees. We offer a 30-day money-back guarantee no questions asked.' },
  ],
  price: '79',
  original_price: '99',
  images: [
    'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&q=80',
    'https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?w=800&q=80',
    'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&q=80',
    'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&q=80',
  ],
}

const SAMPLE_CASA: LandingPageData = {
  product_name: 'Bougie Aromatique Handmade',
  headline: 'Un intérieur qui sent bon — l\'art de vivre à la française',
  subtitle: 'Cires végétales, huiles essentielles pures, mèche coton 100% naturel. Fabriqué à la main en Provence. Livraison offerte.',
  cta: 'Commander maintenant — Livraison offerte',
  urgency: '🏡 Stock limité — Édition Automne',
  benefits: [
    'Cire de soja 100% végétale — aucune paraffine, aucun produit chimique',
    'Huiles essentielles pures de Provence — senteur naturelle et authentique',
    'Mèche coton certifiée — combustion propre sans suie',
    'Coulée et moulée à la main — chaque bougie est unique',
    'Contenant réutilisable — pot céramique artisanal fait main',
  ],
  faq: [
    { question: 'Durée de combustion ?', answer: 'Entre 40 et 60 heures selon la taille choisie. La cire de soja brûle plus lentement que la paraffine.' },
    { question: 'Les senteurs sont-elles naturelles ?', answer: 'Oui, uniquement des huiles essentielles pures. Aucun parfum synthétique, aucun perturbateur endocrinien.' },
    { question: 'Livraison et retours ?', answer: 'Livraison soignée sous 3–5 jours. Retours acceptés sous 14 jours si produit non utilisé.' },
  ],
  price: '34',
  original_price: '49',
  images: [
    'https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=800&q=80',
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
    'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=800&q=80',
    'https://images.unsplash.com/photo-1567016432779-094069958ea5?w=800&q=80',
  ],
}

const SAMPLE_PET: LandingPageData = {
  product_name: 'Collar Premium ProFlex',
  headline: 'Le collier que ton chien mérite vraiment',
  subtitle: 'Nylon militaire ultra-résistant, boucle aluminium anti-rouille, réflecteurs sécurité 360°. Confort toute la journée, durabilité à vie.',
  cta: 'Commander le mien →',
  urgency: '🐾 Livraison offerte dès 2 articles',
  benefits: [
    'Nylon militaire grade 2000D — résiste aux tractions les plus fortes',
    'Boucle aluminium traité anti-corrosion — ne se casse jamais',
    'Réflecteurs 360° intégrés — visible dans l\'obscurité totale',
    'Largeur 2.5cm — parfait pour toutes les tailles de cou',
    'Lavable en machine — hygiène garantie sans effort',
  ],
  faq: [
    { question: 'Quelle taille pour mon chien ?', answer: 'Mesurez le tour de cou et ajoutez 3cm. Notre guide de tailles est disponible en fiche produit.' },
    { question: 'Résiste-t-il à l\'eau ?', answer: 'Oui, le nylon militaire est hydrofuge. Séchage rapide en moins de 2 heures.' },
    { question: 'Garantie ?', answer: 'Garantie à vie contre les défauts de fabrication. Si ça casse, on remplace.' },
  ],
  price: '24',
  original_price: '39',
  images: [
    'https://images.unsplash.com/photo-1601758124510-52d02ddb7cbd?w=800&q=80',
    'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=800&q=80',
    'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=800&q=80',
    'https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=800&q=80',
  ],
}

const SAMPLE_GADGET: LandingPageData = {
  product_name: 'NovaPad Pro X',
  headline: 'La tablette repensée pour les créatifs.',
  subtitle: 'Écran OLED 120Hz, stylet magnétique inclus, autonomie 18h. Légère comme une feuille, puissante comme un studio.',
  cta: 'Précommander — 20% de réduction',
  urgency: '⚡ Offre de lancement — 72h restantes',
  benefits: [
    'Écran OLED 2K 120Hz — couleurs parfaites, fluidité absolue',
    'Stylet magnétique inclus — 4096 niveaux de pression, latence 9ms',
    'Autonomie 18h — travaille toute la journée sans recharger',
    'Puce A-Pro M3 — performance studio, chaleur zéro',
    '1.2kg seulement — léger comme un carnet de notes',
  ],
  faq: [
    { question: 'Compatibilité stylet ?', answer: 'Le stylet NovaPen 3.0 est inclus. Compatible avec les anciens modèles NovaPen 2.x.' },
    { question: 'Mise à jour logiciel ?', answer: '5 ans de mises à jour garanties. Support matériel 7 ans.' },
    { question: 'Retours ?', answer: '30 jours d\'essai. Retour gratuit, remboursement sous 48h.' },
  ],
  price: '649',
  original_price: '849',
  images: [
    'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&q=80',
    'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=800&q=80',
    'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=800&q=80',
    'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=800&q=80',
  ],
}

// ---------------------------------------------------------------------------
// Templates registry
// ---------------------------------------------------------------------------

const TEMPLATES = [
  {
    id: 'etec-blue',
    name: 'ETEC Blue',
    tagline: 'Tech · Sport · Universel',
    desc: 'Design épuré fond blanc cassé et bleu électrique. Idéal pour les produits tech, sport et lifestyle universel. Le template le plus polyvalent.',
    accent: '#0057FF',
    badgeBg: '#0057FF',
    badge: 'Populaire',
    cvr: '4.9%',
    niches: ['Tech', 'Sport', 'Accessoires', 'Universel'],
    fn: templateEtecBlue,
    sample: SAMPLE_BLUE,
    preview: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80',
  },
  {
    id: 'etec-noir',
    name: 'ETEC Noir',
    tagline: 'Montres · Électronique · Luxe Dark',
    desc: 'Fond sombre profond, contrastes parfaits. Positionne instantanément le produit comme haut de gamme. Parfait pour montres, électronique et gaming.',
    accent: '#7C3AED',
    badgeBg: '#7C3AED',
    badge: 'Premium',
    cvr: '4.7%',
    niches: ['Montres', 'Électronique', 'Gaming', 'Auto'],
    fn: templateEtecNoir,
    sample: SAMPLE_NOIR,
    preview: 'https://images.unsplash.com/photo-1547996160-81dfa63595aa?w=600&q=80',
  },
  {
    id: 'etec-rose',
    name: 'ETEC Rose',
    tagline: 'Beauté · Skincare · Makeup',
    desc: 'Tons rose chauds et féminins. Galerie produit et avis UGC mis en avant. Maximise les ventes dans l\'univers beauté et skincare.',
    accent: '#D63370',
    badgeBg: '#D63370',
    badge: 'Top CVR',
    cvr: '5.8%',
    niches: ['Beauté', 'Skincare', 'Makeup', 'Femme'],
    fn: templateEtecRose,
    sample: SAMPLE_ROSE,
    preview: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&q=80',
  },
  {
    id: 'etec-sage',
    name: 'ETEC Sage',
    tagline: 'Bio · Organic · Bien-être',
    desc: 'Vert forêt naturel, tons organiques, certifications visibles. Inspire confiance. Parfait pour les produits bio, compléments alimentaires et bien-être.',
    accent: '#2D6A4F',
    badgeBg: '#2D6A4F',
    badge: 'Bio',
    cvr: '4.3%',
    niches: ['Bio', 'Alimentation', 'Cosmétiques naturels', 'Bien-être'],
    fn: templateEtecSage,
    sample: SAMPLE_SAGE,
    preview: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&q=80',
  },
  {
    id: 'etec-beauty',
    name: 'Hair Glow',
    tagline: 'Hair Care · Capillaire · Beauté Premium',
    desc: 'Design élégant tons crème et orange brûlé inspiré des meilleures marques hair care. Sections produit, bienfaits, témoignages et routine capillaire.',
    accent: '#E8622A',
    badgeBg: '#E8622A',
    badge: 'Hair Care',
    cvr: '5.2%',
    niches: ['Hair Care', 'Capillaire', 'Beauté', 'Organic'],
    fn: templateEtecBeauty,
    sample: SAMPLE_HAIRGLOW,
    preview: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&q=80',
  },
  {
    id: 'etec-shopz',
    name: 'Shopz',
    tagline: 'E-commerce · Clothing · Mode Urbaine',
    desc: 'Page produit e-commerce complète style Shopz. Galerie interactive, sélecteur couleur/taille, avis avec barres de distribution, section "You might like" et footer dark.',
    accent: '#1A5C30',
    badgeBg: '#1A5C30',
    badge: 'E-commerce',
    cvr: '5.6%',
    niches: ['Clothing', 'E-commerce', 'Mode', 'Streetwear'],
    fn: templateEtecShopz,
    sample: SAMPLE_BLUE,
    preview: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=600&q=80',
  },
  {
    id: 'etec-style',
    name: 'Style Pro',
    tagline: 'Fashion · Personal Styling · Mode',
    desc: 'Minimaliste et élégant, fond beige caramel et blanc. Inspiré des meilleurs sites de personal styling. Parfait pour mode, conseil en image et lifestyle premium.',
    accent: '#C9B49A',
    badgeBg: '#C9B49A',
    badge: 'Fashion',
    cvr: '4.8%',
    niches: ['Mode', 'Fashion', 'Lifestyle', 'Luxe'],
    fn: templateEtecStyle,
    sample: SAMPLE_STYLEPRO,
    preview: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&q=80',
  },
  {
    id: 'etec-velvety',
    name: 'Velvety',
    tagline: 'Skincare · Botanique · Organic Premium',
    desc: 'Design botanique élégant fond crème et vert forêt. Grille produits avec filtres, témoignages slider et capture newsletter. Idéal pour skincare, cosmétiques bio et bien-être.',
    accent: '#4A7C59',
    badgeBg: '#4A7C59',
    badge: 'Skincare',
    cvr: '5.1%',
    niches: ['Skincare', 'Bio', 'Beauté', 'Organic'],
    fn: templateEtecVelvety,
    sample: SAMPLE_VELVETY,
    preview: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=600&q=80',
  },
  {
    id: 'etec-prime',
    name: 'Prime',
    tagline: 'Supplements · Health · DTC Premium',
    desc: 'Landing page premium style AG1 / Hims. Dark hero fond noir, accents lime électrique, ingrédients transparents avec doses cliniques. Pour compléments, nutrition et santé DTC.',
    accent: '#3CB043',
    badgeBg: '#3CB043',
    badge: 'Health',
    cvr: '5.4%',
    niches: ['Supplements', 'Santé', 'Health', 'DTC'],
    fn: templateEtecPrime,
    sample: SAMPLE_PRIME,
    preview: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&q=80',
  },
  {
    id: 'etec-casa',
    name: 'Casa',
    tagline: 'Maison · Déco · Artisanat Premium',
    desc: 'Design élégant inspiré des grandes maisons de déco. Serif Garamond, tons terre cuite et sable, galerie lifestyle asymétrique. Idéal pour bougies, linge de maison, artisanat.',
    accent: '#B5541B',
    badgeBg: '#B5541B',
    badge: 'Maison',
    cvr: '4.8%',
    niches: ['Maison', 'Déco', 'Artisanat', 'Lifestyle'],
    fn: templateEtecCasa,
    sample: SAMPLE_CASA,
    preview: 'https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=600&q=80',
  },
  {
    id: 'etec-pet',
    name: 'Pet',
    tagline: 'Animaux · Pet Care · Well-being',
    desc: 'Template chaleureux orange & brun pour produits animaux. Galerie interactive, sélecteur de taille, section "media logos", avis avec espèce de l\'animal. Pour colliers, snacks, accessoires.',
    accent: '#E8722A',
    badgeBg: '#E8722A',
    badge: 'Animaux',
    cvr: '4.6%',
    niches: ['Animaux', 'Pet Care', 'Accessoires', 'Bien-être'],
    fn: templateEtecPet,
    sample: SAMPLE_PET,
    preview: 'https://images.unsplash.com/photo-1601758124510-52d02ddb7cbd?w=600&q=80',
  },
  {
    id: 'etec-gadget',
    name: 'Gadget',
    tagline: 'Tech · Électronique · Apple Style',
    desc: 'Design Apple-inspired ultra-clean. Glassmorphism nav, hero split product, specs grid sombre, color picker, tableau comparatif. Pour smartphones, tablettes, gadgets et électronique.',
    accent: '#0066CC',
    badgeBg: '#0066CC',
    badge: 'Tech',
    cvr: '5.0%',
    niches: ['Tech', 'Électronique', 'Gadgets', 'High-tech'],
    fn: templateEtecGadget,
    sample: SAMPLE_GADGET,
    preview: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&q=80',
  },
]

// ---------------------------------------------------------------------------
// Modal fullscreen preview
// ---------------------------------------------------------------------------

function TemplateModal({ t, onClose }: { t: typeof TEMPLATES[0]; onClose: () => void }) {
  const html = t.fn(t.sample)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col"
      style={{ background: 'rgba(5,5,12,0.94)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="flex items-center justify-between px-6 py-4 flex-shrink-0" style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h2 className="text-white font-black text-lg">{t.name}</h2>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full text-white" style={{ background: t.badgeBg }}>
              {t.badge}
            </span>
          </div>
          <p className="text-sm" style={{ color: 'rgba(255,255,255,0.45)' }}>{t.tagline}</p>
        </div>
        <div className="flex items-center gap-3">
          <a
            href="/signup"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-white text-sm font-bold transition-opacity hover:opacity-90"
            style={{ background: t.accent }}
          >
            Utiliser ce template →
          </a>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full flex items-center justify-center text-lg transition-all"
            style={{ color: 'rgba(255,255,255,0.5)', background: 'transparent' }}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = '#fff' }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(255,255,255,0.5)' }}
          >
            ✕
          </button>
        </div>
      </div>
      <div className="flex-1 overflow-hidden">
        <iframe
          srcDoc={html}
          title={t.name}
          style={{ width: '100%', height: '100%', border: 'none', display: 'block' }}
          sandbox="allow-scripts allow-popups"
        />
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Template card
// ---------------------------------------------------------------------------

function TemplateCard({ t, onOpen }: { t: typeof TEMPLATES[0]; onOpen: (t: typeof TEMPLATES[0]) => void }) {
  return (
    <div
      className="group cursor-pointer rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1.5"
      style={{ border: '1px solid #eaeaea', background: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}
      onClick={() => onOpen(t)}
      onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 16px 40px rgba(0,0,0,0.10)' }}
      onMouseLeave={(e) => { e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.04)' }}
    >
      {/* Preview */}
      <div className="relative" style={{ height: '240px', overflow: 'hidden', background: '#f3f3f3' }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={t.preview}
          alt={`Preview ${t.name}`}
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform 0.4s ease' }}
          className="group-hover:scale-105"
        />
        <div
          className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200"
          style={{ background: 'rgba(0,0,0,0.4)' }}
        >
          <span className="bg-white text-gray-900 font-bold text-sm px-5 py-2.5 rounded-full">
            Voir en plein écran
          </span>
        </div>
        <span className="absolute top-3 left-3 text-[11px] font-bold px-2.5 py-1 rounded-full text-white" style={{ background: t.badgeBg }}>
          {t.badge}
        </span>
        <span className="absolute bottom-3 right-3 text-[11px] font-bold px-2.5 py-1 rounded-full text-white" style={{ background: 'rgba(0,0,0,0.55)' }}>
          CVR moy. {t.cvr}
        </span>
      </div>

      {/* Info */}
      <div className="p-5">
        <div className="flex items-start justify-between gap-2 mb-2">
          <div>
            <h3 className="font-black text-gray-900 text-base">{t.name}</h3>
            <p className="text-xs font-medium mt-0.5" style={{ color: t.accent }}>
              {t.tagline}
            </p>
          </div>
          <div className="w-4 h-4 rounded-full flex-shrink-0 mt-0.5" style={{ background: t.accent }} />
        </div>
        <p className="text-sm text-gray-500 mb-4 line-clamp-2">{t.desc}</p>
        <div className="flex gap-1.5 flex-wrap mb-4">
          {t.niches.map(n => (
            <span key={n} className="text-xs px-2 py-0.5 rounded-md text-gray-500" style={{ background: '#f5f5f5' }}>
              {n}
            </span>
          ))}
        </div>
        <button
          className="w-full py-2.5 rounded-xl text-sm font-bold transition-all duration-200"
          style={{ background: `${t.accent}18`, color: t.accent, border: `2px solid ${t.accent}30` }}
          onMouseEnter={(e) => { e.currentTarget.style.background = t.accent; e.currentTarget.style.color = '#fff' }}
          onMouseLeave={(e) => { e.currentTarget.style.background = `${t.accent}18`; e.currentTarget.style.color = t.accent }}
          onClick={(e) => { e.stopPropagation(); onOpen(t) }}
        >
          Utiliser ce template
        </button>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function TemplatesPage() {
  const router = useRouter()
  const [selected, setSelected] = useState<typeof TEMPLATES[0] | null>(null)
  const [activeFilter, setActiveFilter] = useState('Tous')

  const FILTERS = ['Tous', 'Tech', 'Beauté', 'Bio', 'Luxe', 'Fashion', 'Hair Care', 'Skincare', 'Health', 'Maison', 'Animaux', 'Électronique']

  const filtered = TEMPLATES.filter(t => {
    if (activeFilter === 'Tous') return true
    return t.niches.some(n => n.toLowerCase().includes(activeFilter.toLowerCase()))
  })

  return (
    <main>
      {selected && <TemplateModal t={selected} onClose={() => setSelected(null)} />}

      {/* HERO */}
      <section className="pt-32 pb-16 px-6" style={{ background: '#f8f7ff' }}>
        <div className="max-w-4xl mx-auto text-center">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-1.5 text-sm font-medium mb-8 transition-all mx-auto"
            style={{ color: '#9ca3af' }}
            onMouseEnter={e => { e.currentTarget.style.color = '#5B47F5' }}
            onMouseLeave={e => { e.currentTarget.style.color = '#9ca3af' }}
          >
            ← Retour
          </button>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm mb-6" style={{ background: 'rgba(91,71,245,0.08)', border: '1px solid rgba(91,71,245,0.15)', color: '#5B47F5' }}>
            12 templates · chaque niche a son design
          </div>
          <h1 className="text-5xl sm:text-6xl font-black leading-tight tracking-tight mb-5" style={{ color: '#0f0f1a' }}>
            Le bon design pour{' '}
            <span style={{ color: '#5B47F5' }}>chaque niche.</span>
          </h1>
          <p className="text-lg max-w-2xl mx-auto mb-10" style={{ color: '#6b7280' }}>
            Chaque template est inspiré des meilleures landing pages mondiales,
            optimisé pour convertir dans sa niche spécifique.
          </p>
          <div className="flex gap-2 flex-wrap justify-center">
            {FILTERS.map(tab => (
              <button
                key={tab}
                onClick={() => setActiveFilter(tab)}
                className="px-4 py-2 rounded-full text-sm font-medium border transition-all duration-200"
                style={{
                  background: activeFilter === tab ? '#5B47F5' : '#fff',
                  color: activeFilter === tab ? '#fff' : '#6b7280',
                  borderColor: activeFilter === tab ? '#5B47F5' : '#e5e7eb',
                }}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* GRID */}
      <section className="bg-white py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <p className="text-sm text-gray-400 mb-8">
            {filtered.length} template{filtered.length > 1 ? 's' : ''} — cliquez pour voir en plein écran avec données réelles par niche
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map(t => (
              <TemplateCard key={t.id} t={t} onOpen={setSelected} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 text-center" style={{ background: '#0f0f1a' }}>
        <div className="max-w-xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-black text-white mb-4 leading-tight">
            Tous les templates inclus dans le plan{' '}
            <span style={{ color: '#5B47F5' }}>Pro.</span>
          </h2>
          <p className="text-base mb-8" style={{ color: 'rgba(255,255,255,0.45)' }}>
            Accédez aux 12 templates, aux mises à jour futures et aux nouveaux designs dès leur sortie.
          </p>
          <a
            href="/signup"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl text-base font-bold text-white transition-all duration-200 hover:opacity-90 hover:-translate-y-0.5"
            style={{ background: '#5B47F5' }}
          >
            Commencer l&apos;essai gratuit →
          </a>
          <p className="mt-4 text-sm" style={{ color: 'rgba(255,255,255,0.25)' }}>
            14 jours gratuits &nbsp;·&nbsp; Aucune CB &nbsp;·&nbsp; Annulez quand vous voulez
          </p>
        </div>
      </section>
    </main>
  )
}
