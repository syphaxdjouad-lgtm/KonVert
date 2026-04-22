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
  templateEtecBlusho,
  templateEtecCasa,
  templateEtecPet,
  templateEtecGadget,
  templateEtecAura,
  templateEtecLuxe,
  templateEtecPulse,
  templateEtecNordic,
  templateEtecCosmetix,
  templateEtecTrendy,
  templateEtecSolo,
  templateEtecPrestige,
  templateEtecGlow,
  templateEtecGold,
  templateEtecEnergy,
  templateEtecHomestyle,
  templateEtecJewel,
  templateEtecTechcase,
  templateEtecArtisan,
  templateEtecOutfit,
  templateEtecElla,
  templateEtecStarter,
  templateEtecGlowup,
  templateEtecHue,
  templateEtecInterior,
  templateEtecPlatina,
  templateEtecStreetz,
  templateEtecPoterie,
  templateEtecElectro,
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

const SAMPLE_BLUSHO: LandingPageData = {
  product_name: 'AquaGlow Hydrating Mist',
  headline: 'Ta peau mérite cette brume.',
  subtitle: 'Hydratation instantanée, fini mat, formule clean. 97% d\'ingrédients d\'origine naturelle.',
  cta: 'Ajouter au panier',
  urgency: '🌿 Édition limitée — Il en reste 89',
  benefits: [
    'Hydratation instantanée 72h — peau douce toute la journée',
    'Formule clean & vegan — 0 paraben, 0 silicone',
    'Fini mat non-gras — parfait sous le maquillage',
    'Spray micro-fin — application uniforme en 1 pression',
    'Flacon recyclable 100% — beauté responsable',
  ],
  faq: [
    { question: 'Pour quel type de peau ?', answer: 'Convient à tous les types de peau, y compris les peaux sensibles.' },
    { question: 'Combien de temps dure un flacon ?', answer: 'Environ 6-8 semaines à raison de 2 applications par jour.' },
    { question: 'Retours ?', answer: '30 jours satisfait ou remboursé.' },
  ],
  price: '29',
  original_price: '45',
  images: [
    'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=800&q=80',
    'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800&q=80',
    'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=800&q=80',
  ],
}

const SAMPLE_AURA: LandingPageData = {
  product_name: 'Lavender Dream Diffuser',
  headline: 'Transforme ton intérieur en sanctuaire.',
  subtitle: 'Diffuseur ultrasonique + huile de lavande bio offerte. Ambiance zen en 30 secondes.',
  cta: 'Découvrir — Livraison offerte',
  urgency: '🔮 Offre de lancement — Huile offerte avec chaque commande',
  benefits: [
    'Ultrasonique silencieux — 22dB, parfait pour dormir',
    'Autonomie 12h — remplissez une fois, profitez toute la nuit',
    'Lumière LED 7 couleurs — ambiance personnalisable',
    'Arrêt automatique — sécurité totale, zéro risque',
    'Huile de lavande bio offerte — prêt à utiliser dès la livraison',
  ],
  faq: [
    { question: 'Quelle surface couvre-t-il ?', answer: 'Efficace jusqu\'à 40m². Parfait pour chambre ou salon.' },
    { question: 'Quelles huiles utiliser ?', answer: 'Toutes les huiles essentielles pures. Ne jamais utiliser d\'huiles parfumées synthétiques.' },
    { question: 'Retours ?', answer: '30 jours satisfait ou remboursé. Retour gratuit.' },
  ],
  price: '39',
  original_price: '59',
  images: [
    'https://images.unsplash.com/photo-1602928321679-560bb453f190?w=800&q=80',
    'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=800&q=80',
  ],
}

const SAMPLE_LUXE: LandingPageData = {
  product_name: 'Eternal Ring — Or 18K',
  headline: 'Un bijou qui traverse le temps.',
  subtitle: 'Or 18K massif, diamant naturel certifié GIA. Gravure personnalisée offerte.',
  cta: 'Réserver — Gravure offerte',
  urgency: '💎 Pièce numérotée — Édition limitée à 200 exemplaires',
  benefits: [
    'Or 18K massif — qualité joaillière certifiée',
    'Diamant naturel GIA — traçabilité et authenticité garanties',
    'Gravure personnalisée offerte — votre message, votre histoire',
    'Écrin premium et certificat inclus — prêt à offrir',
    'Garantie à vie — polissage et entretien gratuits',
  ],
  faq: [
    { question: 'Comment connaître ma taille ?', answer: 'Guide de taille inclus. En cas de doute, échange gratuit.' },
    { question: 'Livraison sécurisée ?', answer: 'Colissimo signature avec assurance incluse. Discret et sécurisé.' },
    { question: 'Retours ?', answer: '30 jours pour changer d\'avis. Remboursement intégral.' },
  ],
  price: '890',
  original_price: '1290',
  images: [
    'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&q=80',
    'https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=800&q=80',
  ],
}

const SAMPLE_PULSE: LandingPageData = {
  product_name: 'NeonBuds Pro X',
  headline: 'Le son du futur, dans tes oreilles.',
  subtitle: 'ANC hybride, 48h d\'autonomie, LED RGB personnalisable. Design cyberpunk.',
  cta: 'Précommander -30%',
  urgency: '⚡ Précommande ouverte — 72h restantes au prix de lancement',
  benefits: [
    'ANC hybride 4 micros — silence absolu, partout',
    '48h d\'autonomie totale — 12h par charge, boîtier 4x',
    'LED RGB personnalisable — affiche ta couleur via l\'app',
    'Bluetooth 5.4 multipoint — 2 appareils simultanés',
    'Résistance IPX5 — pluie, sport, transpiration, aucun problème',
  ],
  faq: [
    { question: 'Compatible avec tous les appareils ?', answer: 'Oui, Bluetooth universel. iOS, Android, PC, Mac.' },
    { question: 'Comment personnaliser les LED ?', answer: 'Via l\'app NeonBuds — 16 millions de couleurs, patterns animés.' },
    { question: 'Retours ?', answer: '30 jours satisfait ou remboursé.' },
  ],
  price: '89',
  original_price: '129',
  images: [
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80',
    'https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=800&q=80',
  ],
}

const SAMPLE_NORDIC: LandingPageData = {
  product_name: 'Oslo Ceramic Mug',
  headline: 'La tasse qui change ton rituel café.',
  subtitle: 'Céramique artisanale scandinave. Double paroi isolante. Garde ton café chaud 2h.',
  cta: 'Commander — Livraison offerte',
  urgency: '🏔️ Série limitée — Production artisanale',
  benefits: [
    'Double paroi céramique — café chaud 2h, mains fraîches',
    'Fabriquée à la main au Danemark — chaque pièce est unique',
    'Design minimaliste scandinave — s\'intègre dans tous les intérieurs',
    'Contenance 350ml — la taille parfaite pour un latte',
    'Emballage zéro plastique — livré dans sa boîte kraft recyclée',
  ],
  faq: [
    { question: 'Passe au lave-vaisselle ?', answer: 'Oui, compatible lave-vaisselle et micro-ondes.' },
    { question: 'Livraison ?', answer: 'Expédition sous 48h. Livraison soignée en 3-5 jours.' },
    { question: 'Retours ?', answer: '14 jours pour retourner si produit intact.' },
  ],
  price: '34',
  original_price: '49',
  images: [
    'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=800&q=80',
    'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&q=80',
  ],
}

const SAMPLE_COSMETIX: LandingPageData = {
  product_name: 'BioRadiance Sérum C+E',
  headline: 'Le sérum qui réveille ton éclat.',
  subtitle: 'Vitamine C 15% + Vitamine E + Acide Hyaluronique. Testé sous contrôle dermatologique.',
  cta: 'Ajouter au panier',
  urgency: '🧪 Testé cliniquement — Résultats visibles en 14 jours',
  benefits: [
    'Vitamine C stable 15% — éclat visible dès 14 jours',
    'Acide hyaluronique 3 poids — hydratation multi-couches',
    'Formule clean certifiée — sans paraben, sans silicone, vegan',
    'Flacon airless opaque — protège les actifs de l\'oxydation',
    'Fabriqué en France — laboratoire certifié ISO 22716',
  ],
  faq: [
    { question: 'Pour quel type de peau ?', answer: 'Convient à tous les types de peau. Faire un test au pli du coude si peau très sensible.' },
    { question: 'Matin ou soir ?', answer: 'Le matin sous la crème de jour pour booster l\'éclat et protéger des radicaux libres.' },
    { question: 'Retours ?', answer: '30 jours satisfait ou remboursé.' },
  ],
  price: '38',
  original_price: '55',
  images: [
    'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&q=80',
    'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=800&q=80',
  ],
}

const SAMPLE_TRENDY: LandingPageData = {
  product_name: 'UrbanTech Hoodie V2',
  headline: 'Le hoodie qui te suit partout.',
  subtitle: 'Coton bio 320gsm, coupe oversize, poche tech zippée. Le streetwear responsable.',
  cta: 'Choisir ma taille',
  urgency: '🔥 Drop limité — Réassort dans 3 semaines',
  benefits: [
    'Coton bio certifié GOTS 320gsm — épais sans être lourd',
    'Coupe oversize unisexe — confort de jour comme de nuit',
    'Poche tech zippée intérieure — smartphone en sécurité',
    'Teinture sans eau — 80% d\'eau économisée vs teinture classique',
    'Broderie ton-sur-ton — détail discret, qualité visible',
  ],
  faq: [
    { question: 'Guide des tailles ?', answer: 'Coupe oversize. Si vous hésitez, prenez votre taille habituelle.' },
    { question: 'Entretien ?', answer: 'Machine 30°C, séchage à plat. Pas de sèche-linge pour préserver les fibres.' },
    { question: 'Retours ?', answer: 'Échange gratuit sous 14 jours. Retour prépayé inclus.' },
  ],
  price: '59',
  original_price: '89',
  images: [
    'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&q=80',
    'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=800&q=80',
  ],
}

const SAMPLE_SOLO: LandingPageData = {
  product_name: 'AeroBottle Titan',
  headline: 'La gourde qui change tout.',
  subtitle: 'Inox double paroi, 24h froid / 12h chaud, 750ml. Garantie à vie.',
  cta: 'Commander la mienne',
  urgency: '🎯 1 produit. 47 000 clients. 4.8/5 étoiles.',
  benefits: [
    'Double paroi inox — 24h froid, 12h chaud, condensation zéro',
    'Bouchon anti-fuite breveté — dans le sac sans stress',
    'Revêtement anti-rayures — reste neuve après des mois d\'utilisation',
    '750ml capacité — la taille idéale pour la journée entière',
    'Garantie à vie — on remplace, pas de questions posées',
  ],
  faq: [
    { question: 'Passe au lave-vaisselle ?', answer: 'Oui, 100% compatible lave-vaisselle.' },
    { question: 'Les boissons gazeuses ?', answer: 'Oui, le bouchon est conçu pour supporter la pression.' },
    { question: 'Retours ?', answer: '30 jours pour tester. Retour gratuit si elle ne vous convient pas.' },
  ],
  price: '34',
  original_price: '49',
  images: [
    'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800&q=80',
    'https://images.unsplash.com/photo-1523362628745-0c100150b504?w=800&q=80',
  ],
}

const SAMPLE_PRESTIGE: LandingPageData = {
  product_name: 'Maison Noire — Bougie 220g',
  headline: 'Un parfum qui raconte une histoire.',
  subtitle: 'Cire de soja, mèche coton, parfum de Grasse. 60h de combustion. Fabriqué en France.',
  cta: 'Commander — Coffret offert',
  urgency: '🏆 Édition limitée — 500 pièces numérotées',
  benefits: [
    'Parfum de Grasse — composition exclusive signée par un nez',
    'Cire de soja naturelle — combustion propre, sans suie',
    'Mèche coton tressé — flamme stable et régulière',
    '60 heures de combustion — un investissement qui dure',
    'Coffret cadeau premium inclus — prêt à offrir',
  ],
  faq: [
    { question: 'Quelle surface parfume-t-elle ?', answer: 'Efficace sur 25-30m². Idéale pour salon ou chambre.' },
    { question: 'Combien de temps dure le parfum ?', answer: '60h de combustion avec un parfum constant du début à la fin.' },
    { question: 'Retours ?', answer: 'Échange ou remboursement sous 14 jours si non utilisé.' },
  ],
  price: '45',
  original_price: '65',
  images: [
    'https://images.unsplash.com/photo-1618220179428-22790b461013?w=800&q=80',
    'https://images.unsplash.com/photo-1603006905003-be475563bc59?w=800&q=80',
  ],
}

const SAMPLE_GLOW: LandingPageData = {
  product_name: 'CoralGlow Night Mask',
  headline: 'Réveille-toi avec une peau neuve.',
  subtitle: 'Masque de nuit à l\'acide glycolique 5% + Niacinamide. Renouvellement cellulaire pendant le sommeil.',
  cta: 'Essayer — Satisfaite ou remboursée',
  urgency: '✨ Best-seller — 12 000 masques vendus ce mois',
  benefits: [
    'Acide glycolique 5% — exfoliation douce pendant le sommeil',
    'Niacinamide B3 — réduit les pores et unifie le teint',
    'Texture gel-crème — se fond sans coller à l\'oreiller',
    'Sans rinçage — appliquer et dormir, c\'est tout',
    'Résultats visibles dès le 1er réveil — peau lissée et lumineuse',
  ],
  faq: [
    { question: 'À quelle fréquence l\'utiliser ?', answer: '2-3 fois par semaine pour commencer, puis tous les soirs si votre peau le tolère.' },
    { question: 'Convient aux peaux sensibles ?', answer: 'Oui, la concentration à 5% est douce. Faire un test au pli du coude.' },
    { question: 'Retours ?', answer: '30 jours satisfait ou remboursé, même ouvert.' },
  ],
  price: '32',
  original_price: '48',
  images: [
    'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800&q=80',
    'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800&q=80',
  ],
}

const SAMPLE_GOLD: LandingPageData = {
  product_name: 'Maison Élysée — Montre Automatique',
  headline: 'L\'excellence horlogère, sans compromis.',
  subtitle: 'Mouvement automatique suisse, boîtier saphir, bracelet cuir d\'alligator. Édition limitée 200 pièces.',
  cta: 'Réserver la mienne',
  urgency: '👑 Édition limitée — 47 pièces restantes',
  benefits: [
    'Mouvement automatique suisse — précision +/- 2s par jour',
    'Verre saphir inrayable — clarté parfaite, résistance maximale',
    'Bracelet cuir d\'alligator — tanné artisanalement en Italie',
    'Étanchéité 100m — pour toutes les occasions',
    'Garantie 5 ans — service après-vente premium inclus',
  ],
  faq: [
    { question: 'Quelle taille de boîtier ?', answer: '40mm, parfaitement équilibré pour tous les poignets.' },
    { question: 'Livraison ?', answer: 'Coffret luxe livré en 48h par transporteur sécurisé.' },
    { question: 'Retours ?', answer: '30 jours pour changer d\'avis. Retour assuré gratuit.' },
  ],
  price: '890',
  original_price: '1290',
  images: [
    'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=800&q=80',
    'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=800&q=80',
  ],
}

const SAMPLE_ENERGY: LandingPageData = {
  product_name: 'TitanGrip Pro Bandes de Résistance',
  headline: 'Ton gym, partout avec toi.',
  subtitle: 'Set 5 bandes latex naturel, 5-50kg de résistance. Poignées ergonomiques + ancrage de porte inclus.',
  cta: 'Commander mon set',
  urgency: '🔥 -40% — Offre de lancement 72h',
  benefits: [
    '5 niveaux de résistance — de débutant à confirmé, 5 à 50kg',
    'Latex naturel premium — élasticité constante, pas de claquage',
    'Poignées mousse ergonomiques — grip confortable, zéro ampoule',
    'Sac de transport inclus — s\'emporte partout, pèse 800g',
    'Guide d\'exercices PDF — 40 exercices illustrés full body',
  ],
  faq: [
    { question: 'Pour quel niveau ?', answer: 'Tous niveaux. Les 5 bandes couvrent de la rééducation au renforcement avancé.' },
    { question: 'Durabilité ?', answer: 'Latex naturel testé à 10 000 étirements sans perte d\'élasticité.' },
    { question: 'Retours ?', answer: '30 jours satisfait ou remboursé, même utilisé.' },
  ],
  price: '39',
  original_price: '69',
  images: [
    'https://images.unsplash.com/photo-1598289431512-b97b0917affc?w=800&q=80',
    'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80',
  ],
}

const SAMPLE_HOMESTYLE: LandingPageData = {
  product_name: 'Nordic Oak — Table Basse',
  headline: 'Le meuble qui transforme votre salon.',
  subtitle: 'Chêne massif scandinave, pieds fuselés, plateau 120×60cm. Design intemporel fabriqué en Europe.',
  cta: 'Commander — Livraison offerte',
  urgency: '🏡 Stock limité — Fabrication artisanale par lot de 50',
  benefits: [
    'Chêne massif FSC — bois responsable, grain naturel unique',
    'Pieds fuselés en hêtre — stabilité parfaite, design aérien',
    'Finition huile naturelle — toucher soyeux, entretien facile',
    'Montage sans outil — système d\'emboîtement breveté',
    'Garantie 10 ans — qualité qui traverse les décennies',
  ],
  faq: [
    { question: 'Dimensions ?', answer: '120×60×42cm. Poids 18kg. S\'intègre dans tous les salons.' },
    { question: 'Délai de livraison ?', answer: '5-7 jours ouvrés. Livraison en pied d\'immeuble gratuite.' },
    { question: 'Retours ?', answer: '30 jours pour tester dans votre intérieur. Retour gratuit.' },
  ],
  price: '349',
  original_price: '499',
  images: [
    'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80',
    'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80',
  ],
}

const SAMPLE_JEWEL: LandingPageData = {
  product_name: 'Noir Éternel — Collier Onyx',
  headline: 'Un bijou qui parle sans un mot.',
  subtitle: 'Onyx noir naturel, chaîne argent 925 plaqué or, fermoir magnétique. Pièce unisexe faite main.',
  cta: 'Ajouter à ma collection',
  urgency: '💎 Série limitée — 150 pièces numérotées',
  benefits: [
    'Onyx noir naturel — chaque pierre est unique, sélectionnée à la main',
    'Argent 925 plaqué or 18k — ne ternit pas, hypoallergénique',
    'Fermoir magnétique — mise en place facile et sécurisée',
    'Écrin velours premium — prêt à offrir, avec certificat d\'authenticité',
    'Chaîne ajustable 42-50cm — s\'adapte à tous les styles',
  ],
  faq: [
    { question: 'Résiste à l\'eau ?', answer: 'Oui, plaquage or 18k résistant. Évitez le chlore prolongé.' },
    { question: 'Personnalisation ?', answer: 'Gravure possible sur le fermoir (+5€, 48h de délai).' },
    { question: 'Retours ?', answer: '14 jours, bijou non porté, dans son écrin d\'origine.' },
  ],
  price: '79',
  original_price: '129',
  images: [
    'https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=800&q=80',
    'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&q=80',
  ],
}

const SAMPLE_TECHCASE: LandingPageData = {
  product_name: 'ShieldCase Pro — iPhone 16',
  headline: 'La protection invisible.',
  subtitle: 'Polycarbonate anti-choc, MagSafe intégré, 1.5mm d\'épaisseur. Protection militaire, design minimal.',
  cta: 'Protéger mon iPhone',
  urgency: '📱 Compatible iPhone 16 / 16 Pro / 16 Pro Max',
  benefits: [
    'Drop-test 3 mètres certifié — protection militaire MIL-STD-810G',
    'MagSafe intégré — charge sans fil et accessoires magnétiques',
    '1.5mm d\'épaisseur — protection réelle, zéro encombrement',
    'Bords surélevés — protège écran et caméra des surfaces',
    'Anti-jaunissement garanti 2 ans — reste transparent comme au jour 1',
  ],
  faq: [
    { question: 'Compatible charge sans fil ?', answer: 'Oui, MagSafe natif intégré. Charge rapide 15W sans retirer la coque.' },
    { question: 'Boutons accessibles ?', answer: 'Oui, boutons tactiles précis avec retour haptique préservé.' },
    { question: 'Retours ?', answer: '30 jours satisfait ou remboursé. Retour gratuit.' },
  ],
  price: '29',
  original_price: '45',
  images: [
    'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=800&q=80',
    'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=800&q=80',
  ],
}

const SAMPLE_ARTISAN: LandingPageData = {
  product_name: 'Savon de Provence — Lavande Bio',
  headline: 'Le vrai savon, comme autrefois.',
  subtitle: 'Saponifié à froid, huile d\'olive bio, lavande de Haute-Provence AOP. 100g de douceur artisanale.',
  cta: 'Commander — Lot de 3 à -20%',
  urgency: '🧼 Fabrication artisanale — Stock limité chaque mois',
  benefits: [
    'Saponifié à froid — procédé artisanal qui préserve la glycérine naturelle',
    'Huile d\'olive bio première pression — nutrition intense, peau douce',
    'Lavande AOP Haute-Provence — parfum authentique, propriétés apaisantes',
    'Sans huile de palme, sans conservateur — clean et écoresponsable',
    'Cure de 6 semaines — savon dur qui dure 2× plus longtemps',
  ],
  faq: [
    { question: 'Pour quel type de peau ?', answer: 'Convient à toutes les peaux, même sensibles. Testé dermatologiquement.' },
    { question: 'Durée d\'un savon ?', answer: 'Environ 4-6 semaines d\'utilisation quotidienne corps et mains.' },
    { question: 'Retours ?', answer: 'Satisfait ou remboursé 14 jours, même ouvert.' },
  ],
  price: '8',
  original_price: '12',
  images: [
    'https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec?w=800&q=80',
    'https://images.unsplash.com/photo-1607006344380-b6775a0824a7?w=800&q=80',
  ],
}

const SAMPLE_OUTFIT: LandingPageData = {
  product_name: 'Essentials Tee — Coton Bio',
  headline: 'Le t-shirt parfait existe.',
  subtitle: 'Coton bio 240g/m², coupe décontractée, teinture végétale. Porté par 15 000+ clients fidèles.',
  cta: 'Ajouter au panier — 39€',
  urgency: '🔥 Nouvelle collection — Pré-commande ouverte',
  benefits: [
    'Coton biologique certifié GOTS — douceur incomparable',
    'Coupe oversized décontractée — confort toute la journée',
    'Teinture végétale — couleurs durables, zéro chimique',
    'Coutures renforcées — qualité qui dure des années',
    'Livraison offerte dès 2 pièces — retours gratuits 30 jours',
  ],
  faq: [
    { question: 'Guide des tailles ?', answer: 'Coupe légèrement oversize. En cas de doute, prenez votre taille habituelle.' },
    { question: 'Entretien ?', answer: 'Lavage 30°C, séchage à l\'air libre pour préserver les fibres.' },
    { question: 'Retours ?', answer: 'Retours gratuits sous 30 jours, même porté.' },
  ],
  price: '39',
  original_price: '55',
  images: [
    'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80',
    'https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?w=800&q=80',
  ],
}

const SAMPLE_ELLA: LandingPageData = {
  product_name: 'Robe Ella — Soie Lavande',
  headline: 'L\'élégance au quotidien.',
  subtitle: 'Soie naturelle, coupe fluide, teinte lavande exclusive. Pour les femmes qui veulent se sentir belles sans effort.',
  cta: 'Craquer — 129€ au lieu de 189€',
  urgency: '💜 Édition limitée — Plus que 23 pièces',
  benefits: [
    'Soie naturelle grade A — toucher incomparable, légèreté absolue',
    'Coupe fluide flatteuse — sublime toutes les silhouettes',
    'Teinte lavande exclusive — couleur unique non reproductible',
    'Doublure en viscose — confort et maintien parfait',
    'Emballage cadeau offert — prête à offrir ou se faire plaisir',
  ],
  faq: [
    { question: 'Taille ?', answer: 'Du 34 au 46. Coupe régulière, prenez votre taille habituelle.' },
    { question: 'Entretien ?', answer: 'Nettoyage à sec recommandé ou lavage main eau froide.' },
    { question: 'Retours ?', answer: 'Échange ou remboursement sous 14 jours.' },
  ],
  price: '129',
  original_price: '189',
  images: [
    'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&q=80',
    'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=80',
  ],
}

const SAMPLE_STARTER: LandingPageData = {
  product_name: 'SmartLamp Pro — LED Connectée',
  headline: 'L\'éclairage intelligent qui change tout.',
  subtitle: 'WiFi + Bluetooth, 16M de couleurs, compatible Alexa & Google Home. Installation en 30 secondes.',
  cta: 'Commander — 49€ livraison offerte',
  urgency: '⚡ -30% lancement — Offre limitée',
  benefits: [
    'WiFi + Bluetooth — contrôle vocal ou appli, sans hub',
    '16 millions de couleurs — ambiance parfaite en un tap',
    'Compatible Alexa, Google, HomeKit — intégration totale',
    'Mode circadien — lumière adaptée à votre rythme biologique',
    'Installation 30 secondes — vis standard E27, prêt à l\'emploi',
  ],
  faq: [
    { question: 'Besoin d\'un hub ?', answer: 'Non, connexion WiFi directe à votre routeur.' },
    { question: 'Durée de vie ?', answer: '25 000 heures, soit environ 11 ans d\'utilisation normale.' },
    { question: 'Garantie ?', answer: '2 ans constructeur, SAV en France.' },
  ],
  price: '49',
  original_price: '69',
  images: [
    'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=800&q=80',
    'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=800&q=80',
  ],
}

const SAMPLE_GLOWUP: LandingPageData = {
  product_name: 'GlowUp Kit — Routine Teint Parfait',
  headline: 'Ton glow-up commence ici.',
  subtitle: 'Primer + Fond de teint + Setting spray. Formule clean, coverage modulable, tenue 16h.',
  cta: 'Shopper le kit — 59€ au lieu de 87€',
  urgency: '💄 Best-seller — 8 000+ kits vendus ce mois',
  benefits: [
    'Primer hydratant — lisse les pores, base parfaite longue tenue',
    'Fond de teint buildable — coverage light à full, zéro masque',
    'Setting spray fixateur — tenue 16h prouvée cliniquement',
    'Formule clean & vegan — sans parabène, sans test animal',
    'Kit complet -32% — 3 produits essentiels, 1 seul prix',
  ],
  faq: [
    { question: 'Pour quel type de peau ?', answer: 'Toutes peaux. Formule non comédogène, testée dermato.' },
    { question: 'Teintes disponibles ?', answer: '24 teintes du très clair au très foncé. Guide teinte sur le site.' },
    { question: 'Retours ?', answer: 'Satisfaite ou remboursée 30 jours, même ouvert.' },
  ],
  price: '59',
  original_price: '87',
  images: [
    'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800&q=80',
    'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&q=80',
  ],
}

const SAMPLE_HUE: LandingPageData = {
  product_name: 'ArtPrint Canvas — Poster Abstrait',
  headline: 'L\'art qui fait vibrer tes murs.',
  subtitle: 'Impression giclée sur toile coton 380g. Couleurs ultra-vibrantes, cadre inclus. Livré prêt à accrocher.',
  cta: 'Choisir mon format — Dès 45€',
  urgency: '🎨 Collection limitée — 5 designs exclusifs',
  benefits: [
    'Toile coton 380g — qualité musée, texture premium au toucher',
    'Encres pigmentaires archivales — couleurs vibrantes 75+ ans',
    'Cadre bois inclus — prêt à accrocher, aucun montage',
    '5 formats disponibles — du 30×40 au 100×150 cm',
    'Emballage anti-choc — livraison sécurisée garantie',
  ],
  faq: [
    { question: 'Délai de livraison ?', answer: 'Impression sous 48h, livraison 3-5 jours ouvrés.' },
    { question: 'Personnalisation ?', answer: 'Oui, envoyez votre image pour un tirage custom.' },
    { question: 'Retours ?', answer: 'Remboursement sous 14 jours si le produit ne vous convient pas.' },
  ],
  price: '45',
  original_price: '69',
  images: [
    'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=800&q=80',
    'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=800&q=80',
  ],
}

const SAMPLE_INTERIOR: LandingPageData = {
  product_name: 'Fauteuil Oslo — Chêne & Lin',
  headline: 'Le confort scandinave chez vous.',
  subtitle: 'Chêne massif certifié FSC, lin lavé français, mousse HR 40kg. Design primé, fabriqué en Europe.',
  cta: 'Ajouter au panier — 590€',
  urgency: '🪴 Précommande — Livraison mai',
  benefits: [
    'Chêne massif FSC — bois européen responsable et durable',
    'Lin lavé français — tissu naturel respirant, toucher doux',
    'Mousse HR haute résilience — confort optimal pendant 10+ ans',
    'Design primé IF Award — lignes épurées, intemporelles',
    'Montage 15 min — notice illustrée, outils inclus',
  ],
  faq: [
    { question: 'Dimensions ?', answer: 'L75 × P80 × H85 cm. Assise H42 cm.' },
    { question: 'Tissu lavable ?', answer: 'Housse déhoussable, lavable en machine 30°C.' },
    { question: 'Garantie ?', answer: '5 ans structure, 2 ans tissu.' },
  ],
  price: '590',
  original_price: '790',
  images: [
    'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80',
    'https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=800&q=80',
  ],
}

const SAMPLE_PLATINA: LandingPageData = {
  product_name: 'Bague Platina — Or 18k & Diamant',
  headline: 'Une pièce unique, comme vous.',
  subtitle: 'Or 18 carats, diamant VVS1 0.5ct, sertissage main par nos artisans joailliers. Certificat GIA inclus.',
  cta: 'Réserver ma pièce — 1 290€',
  urgency: '💍 Sur commande — Délai 3 semaines',
  benefits: [
    'Or 18 carats recyclé — luxe responsable certifié RJC',
    'Diamant VVS1 certifié GIA — brillance et pureté exceptionnelles',
    'Sertissage main — savoir-faire joaillier français depuis 1987',
    'Écrin cuir premium offert — présentation digne de la pièce',
    'Gravure personnalisée offerte — votre message secret à l\'intérieur',
  ],
  faq: [
    { question: 'Taille ?', answer: 'Baguier offert sur demande. Ajustement gratuit après réception.' },
    { question: 'Certificat ?', answer: 'Certificat GIA + poinçon or 750 + facture détaillée.' },
    { question: 'Retours ?', answer: '30 jours satisfait ou remboursé. Échange taille gratuit.' },
  ],
  price: '1290',
  original_price: '1890',
  images: [
    'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&q=80',
    'https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=800&q=80',
  ],
}

const SAMPLE_STREETZ: LandingPageData = {
  product_name: 'Hoodie StreetZ — Oversize Premium',
  headline: 'La street, version premium.',
  subtitle: 'Coton lourd 420g, broderie chaînette, coupe oversize. Drop limité à 200 pièces.',
  cta: 'Cop maintenant — 89€',
  urgency: '🧢 DROP #07 — 63% sold out',
  benefits: [
    'Coton lourd 420g — épaisseur premium, tombé impeccable',
    'Broderie chaînette artisanale — détail qui fait la différence',
    'Coupe oversize streetwear — style urbain authentique',
    'Drop limité 200 pièces — exclusivité garantie, pas de restock',
    'Packaging collector — boîte sérigraphiée numérotée',
  ],
  faq: [
    { question: 'Taille ?', answer: 'Coupe oversize. Si vous hésitez, prenez votre taille habituelle.' },
    { question: 'Restock ?', answer: 'Non, chaque drop est unique et ne sera jamais reproduit.' },
    { question: 'Livraison ?', answer: 'Expédié sous 48h. Suivi inclus.' },
  ],
  price: '89',
  original_price: '129',
  images: [
    'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&q=80',
    'https://images.unsplash.com/photo-1578681994506-b8f463449011?w=800&q=80',
  ],
}

const SAMPLE_POTERIE: LandingPageData = {
  product_name: 'Vase Terre — Céramique Artisanale',
  headline: 'Chaque pièce raconte une histoire.',
  subtitle: 'Tourné main, grès émaillé haute température, pièce unique signée. Fabriqué dans notre atelier provençal.',
  cta: 'Adopter cette pièce — 65€',
  urgency: '🏺 Pièce unique — Chaque vase est différent',
  benefits: [
    'Tourné main par nos artisans — chaque pièce est unique',
    'Grès émaillé 1280°C — solidité et beauté durables',
    'Étanche sans traitement — prêt à accueillir vos fleurs',
    'Signé et numéroté — certificat d\'authenticité inclus',
    'Emballage artisanal — papier de soie, paille protectrice',
  ],
  faq: [
    { question: 'Dimensions ?', answer: 'Environ H20 × Ø12 cm. Variations naturelles possibles.' },
    { question: 'Entretien ?', answer: 'Lavage main à l\'eau tiède. Compatible lave-vaisselle.' },
    { question: 'Retours ?', answer: 'Échange ou remboursement sous 14 jours si la pièce ne vous plaît pas.' },
  ],
  price: '65',
  original_price: '85',
  images: [
    'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=800&q=80',
    'https://images.unsplash.com/photo-1610701596061-2ecf227e85b2?w=800&q=80',
  ],
}

const SAMPLE_ELECTRO: LandingPageData = {
  product_name: 'HydraBoost — Électrolytes Performance',
  headline: 'Hydrate. Performe. Domine.',
  subtitle: '6 électrolytes essentiels, 0 sucre, 0 colorant. Formule sport validée par 200+ athlètes pro.',
  cta: 'Essayer — Pack 30 sticks à 29€',
  urgency: '💧 Nouveau parfum Citron Yuzu — Stock limité',
  benefits: [
    '6 électrolytes dosés cliniquement — sodium, potassium, magnésium, calcium, zinc, chlorure',
    'Zéro sucre, zéro colorant — clean label, formule transparente',
    'Absorption rapide en 15 min — technologie osmolalité optimisée',
    'Validé par 200+ athlètes pro — rugby, trail, crossfit, cycling',
    '3 parfums : Citron Yuzu, Fruits Rouges, Nature — sans arrière-goût',
  ],
  faq: [
    { question: 'Quand le prendre ?', answer: 'Avant, pendant ou après l\'effort. 1 stick dans 500ml d\'eau.' },
    { question: 'Anti-dopage ?', answer: 'Certifié Informed Sport, sans substance interdite.' },
    { question: 'Abonnement ?', answer: 'Oui, -15% en abonnement mensuel, résiliable à tout moment.' },
  ],
  price: '29',
  original_price: '39',
  images: [
    'https://images.unsplash.com/photo-1622543925917-763c34d1a86e?w=800&q=80',
    'https://images.unsplash.com/photo-1594498653385-d5172c532c00?w=800&q=80',
  ],
}

// ---------------------------------------------------------------------------
// Templates registry
// ---------------------------------------------------------------------------

const TEMPLATES = [
  {
    id: 'etec-blue',
    name: 'Blue',
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
    name: 'Noir',
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
    name: 'Rose',
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
    name: 'Sage',
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
  {
    id: 'etec-blusho',
    name: 'Blusho',
    tagline: 'Cosmetics · Skincare · E-com Premium',
    desc: 'Palette douce vert sauge et blush. Grille produits élégante, sections avis et routine beauté. Parfait pour cosmétiques, skincare premium et maquillage naturel.',
    accent: '#7A8C6E',
    badgeBg: '#7A8C6E',
    badge: 'Skincare',
    cvr: '4.9%',
    niches: ['Skincare', 'Cosmétiques', 'Beauté', 'E-commerce'],
    fn: templateEtecBlusho,
    sample: SAMPLE_BLUSHO,
    preview: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&q=80',
  },
  {
    id: 'etec-aura',
    name: 'Aura',
    tagline: 'Wellness · Lavande · Ritual',
    desc: 'Design zen et apaisant, tons lavande et violet doux. Sections rituel, bienfaits et témoignages. Idéal pour aromathérapie, bougies, huiles essentielles et wellness.',
    accent: '#7C5CBF',
    badgeBg: '#7C5CBF',
    badge: 'Wellness',
    cvr: '4.5%',
    niches: ['Wellness', 'Bio', 'Beauté', 'Lifestyle'],
    fn: templateEtecAura,
    sample: SAMPLE_AURA,
    preview: 'https://images.unsplash.com/photo-1545239705-1564e58b9e4a?w=600&q=80',
  },
  {
    id: 'etec-luxe',
    name: 'Luxe',
    tagline: 'Joaillerie · Noir & Or · Ultra Premium',
    desc: 'Fond noir profond, accents or et typographie serif luxueuse. Effet premium immédiat. Pour joaillerie, montres de luxe, maroquinerie et produits ultra haut de gamme.',
    accent: '#C9A84C',
    badgeBg: '#C9A84C',
    badge: 'Exclusif',
    cvr: '5.3%',
    niches: ['Luxe', 'Montres', 'Électronique', 'Fashion'],
    fn: templateEtecLuxe,
    sample: SAMPLE_LUXE,
    preview: 'https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=600&q=80',
  },
  {
    id: 'etec-pulse',
    name: 'Pulse',
    tagline: 'Tech · Cyberpunk · Gadgets Dark',
    desc: 'Esthétique cyberpunk néon sur fond sombre. Animations néon, grilles futuristes, specs techniques visuelles. Pour gadgets tech, gaming, audio et wearables.',
    accent: '#00D4FF',
    badgeBg: '#00D4FF',
    badge: 'Tech',
    cvr: '4.7%',
    niches: ['Tech', 'Gaming', 'Électronique', 'Gadgets'],
    fn: templateEtecPulse,
    sample: SAMPLE_PULSE,
    preview: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&q=80',
  },
  {
    id: 'etec-nordic',
    name: 'Nordic',
    tagline: 'Lifestyle · Minimaliste · Scandinave',
    desc: 'Minimalisme scandinave, tons neutres et beaucoup d\'espace blanc. Typographie clean, photos lifestyle. Idéal pour déco nordique, mobilier et lifestyle minimaliste.',
    accent: '#4A7C88',
    badgeBg: '#4A7C88',
    badge: 'Lifestyle',
    cvr: '4.4%',
    niches: ['Lifestyle', 'Maison', 'Déco', 'Bio'],
    fn: templateEtecNordic,
    sample: SAMPLE_NORDIC,
    preview: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&q=80',
  },
  {
    id: 'etec-cosmetix',
    name: 'Cosmetix',
    tagline: 'Cosmétiques · Skincare · Clean Beauty',
    desc: 'Design clean beauty bleu profond et blanc immaculé. Sections ingrédients transparents, routine et avis vérifiés. Pour skincare, sérums et cosmétiques premium.',
    accent: '#334FB4',
    badgeBg: '#334FB4',
    badge: 'Beauté',
    cvr: '5.1%',
    niches: ['Beauté', 'Skincare', 'Cosmétiques', 'Bio'],
    fn: templateEtecCosmetix,
    sample: SAMPLE_COSMETIX,
    preview: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&q=80',
  },
  {
    id: 'etec-trendy',
    name: 'Trendy',
    tagline: 'Fashion · Mode · Streetwear',
    desc: 'Design mode contemporain, accents teal et typographie bold. Galerie produit immersive, sélecteur taille, looks associés. Pour streetwear, sneakers et mode urbaine.',
    accent: '#319da0',
    badgeBg: '#319da0',
    badge: 'Fashion',
    cvr: '5.0%',
    niches: ['Fashion', 'Mode', 'Streetwear', 'E-commerce'],
    fn: templateEtecTrendy,
    sample: SAMPLE_TRENDY,
    preview: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600&q=80',
  },
  {
    id: 'etec-solo',
    name: 'Solo',
    tagline: 'Mono-produit · Single Product · DTC',
    desc: 'Template mono-produit ultra-focalisé. Zéro distraction, tout est centré sur un seul produit. Countdown, social proof, FAQ. Parfait pour les lancements DTC.',
    accent: '#334FB4',
    badgeBg: '#334FB4',
    badge: 'DTC',
    cvr: '5.5%',
    niches: ['Tech', 'Health', 'Lifestyle', 'E-commerce'],
    fn: templateEtecSolo,
    sample: SAMPLE_SOLO,
    preview: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=600&q=80',
  },
  {
    id: 'etec-prestige',
    name: 'Prestige',
    tagline: 'Premium · Haut de gamme · Artisanal',
    desc: 'Élégance artisanale, tons rouges et crème. Typographie serif premium, storytelling de marque. Idéal pour bougies, parfums, produits artisanaux et éditions limitées.',
    accent: '#DD1D1D',
    badgeBg: '#DD1D1D',
    badge: 'Exclusif',
    cvr: '4.8%',
    niches: ['Luxe', 'Artisanat', 'Maison', 'Lifestyle'],
    fn: templateEtecPrestige,
    sample: SAMPLE_PRESTIGE,
    preview: 'https://images.unsplash.com/photo-1618220179428-22790b461013?w=600&q=80',
  },
  {
    id: 'etec-glow',
    name: 'Glow',
    tagline: 'Skincare · Beauty · Ritual',
    desc: 'Design beauty coral et rose. Hero impactant, sections routine nuit, ingrédients stars et avis. Parfait pour sérums, masques, crèmes et routines beauté.',
    accent: '#EF4A65',
    badgeBg: '#EF4A65',
    badge: 'Beauté',
    cvr: '5.2%',
    niches: ['Beauté', 'Skincare', 'Cosmétiques', 'Femme'],
    fn: templateEtecGlow,
    sample: SAMPLE_GLOW,
    preview: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&q=80',
  },
  {
    id: 'etec-gold',
    name: 'Gold',
    tagline: 'Luxe · Haute Gamme · Or',
    desc: 'Fond noir profond, accents dorés, typographie serif. Positionne instantanément comme ultra-premium. Parfait pour montres, bijoux et maroquinerie.',
    accent: '#D4A853',
    badgeBg: '#D4A853',
    badge: 'Exclusif',
    cvr: '5.1%',
    niches: ['Luxe', 'Montres', 'Fashion', 'Électronique'],
    fn: templateEtecGold,
    sample: SAMPLE_GOLD,
    preview: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=600&q=80',
  },
  {
    id: 'etec-energy',
    name: 'Energy',
    tagline: 'Sport · Fitness · DTC',
    desc: 'Design dynamique orange vif et fond sombre. Countdown, urgence, social proof. Maximise les conversions pour sport, fitness et produits DTC.',
    accent: '#E63000',
    badgeBg: '#E63000',
    badge: 'Sport',
    cvr: '5.3%',
    niches: ['Sport', 'Health', 'E-commerce', 'Lifestyle'],
    fn: templateEtecEnergy,
    sample: SAMPLE_ENERGY,
    preview: 'https://images.unsplash.com/photo-1598289431512-b97b0917affc?w=600&q=80',
  },
  {
    id: 'etec-homestyle',
    name: 'HomeStyle',
    tagline: 'Mobilier · Déco · Maison',
    desc: 'Tons bois chaud et ambiance cosy. Photos lifestyle, sections matériaux et artisanat. Idéal pour mobilier, décoration et objets maison.',
    accent: '#8B6914',
    badgeBg: '#8B6914',
    badge: 'Maison',
    cvr: '4.6%',
    niches: ['Maison', 'Déco', 'Lifestyle', 'Artisanat'],
    fn: templateEtecHomestyle,
    sample: SAMPLE_HOMESTYLE,
    preview: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80',
  },
  {
    id: 'etec-jewel',
    name: 'Jewel',
    tagline: 'Bijoux · Joaillerie · Dark Luxe',
    desc: 'Fond sombre dramatique, accents dorés, présentation joaillière. Certifications et storytelling artisanal. Pour bijoux, montres et accessoires luxe.',
    accent: '#a37249',
    badgeBg: '#a37249',
    badge: 'Exclusif',
    cvr: '5.0%',
    niches: ['Luxe', 'Fashion', 'Cosmétiques', 'Lifestyle'],
    fn: templateEtecJewel,
    sample: SAMPLE_JEWEL,
    preview: 'https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=600&q=80',
  },
  {
    id: 'etec-techcase',
    name: 'TechCase',
    tagline: 'Accessoires Tech · Phone · Minimal',
    desc: 'Design Apple-minimal, fond noir, présentation produit épurée. Specs visuelles, certifications, compatibilité. Pour coques, cables, accessoires tech.',
    accent: '#000000',
    badgeBg: '#333333',
    badge: 'Tech',
    cvr: '4.8%',
    niches: ['Tech', 'Gadgets', 'Électronique', 'E-commerce'],
    fn: templateEtecTechcase,
    sample: SAMPLE_TECHCASE,
    preview: 'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=600&q=80',
  },
  {
    id: 'etec-artisan',
    name: 'Artisan',
    tagline: 'Handmade · Savon · Naturel',
    desc: 'Tons orangés chaleureux, style artisanal authentique. Processus de fabrication, ingrédients naturels, certifications. Pour savons, cosmétiques naturels, artisanat.',
    accent: '#FF871D',
    badgeBg: '#FF871D',
    badge: 'Artisanat',
    cvr: '4.5%',
    niches: ['Bio', 'Artisanat', 'Beauté', 'Maison'],
    fn: templateEtecArtisan,
    sample: SAMPLE_ARTISAN,
    preview: 'https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec?w=600&q=80',
  },
  {
    id: 'etec-outfit',
    name: 'Outfit',
    tagline: 'Vêtements · E-com · Warm Neutral',
    desc: 'Tons neutres chauds, galerie lookbook lifestyle. Swatches taille/couleur, grille produit, ambiance mode casual. Idéal vêtements, accessoires, lifestyle brands.',
    accent: '#B5854B',
    badgeBg: '#B5854B',
    badge: 'Fashion',
    cvr: '4.6%',
    niches: ['Fashion', 'E-commerce', 'Lifestyle'],
    fn: templateEtecOutfit,
    sample: SAMPLE_OUTFIT,
    preview: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80',
  },
  {
    id: 'etec-ella',
    name: 'Ella',
    tagline: 'Mode Féminine · Élégant · Mauve',
    desc: 'Palette mauve raffinée, serif élégant, lifestyle féminin. Photos éditoriales, storytelling marque, CTA doux. Pour mode femme, accessoires, beauté lifestyle.',
    accent: '#C77DBA',
    badgeBg: '#C77DBA',
    badge: 'Fashion',
    cvr: '4.4%',
    niches: ['Fashion', 'Beauté', 'Lifestyle'],
    fn: templateEtecElla,
    sample: SAMPLE_ELLA,
    preview: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&q=80',
  },
  {
    id: 'etec-starter',
    name: 'Starter',
    tagline: 'Polyvalent · Clean · Universel',
    desc: 'Design indigo clean et universel, parfait pour débuter. Structure claire, sections bien définies, conversion optimisée. S\'adapte à toutes les niches.',
    accent: '#4F46E5',
    badgeBg: '#4F46E5',
    badge: 'Populaire',
    cvr: '4.7%',
    niches: ['Tech', 'E-commerce', 'Lifestyle', 'Health'],
    fn: templateEtecStarter,
    sample: SAMPLE_STARTER,
    preview: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=600&q=80',
  },
  {
    id: 'etec-glowup',
    name: 'GlowUp',
    tagline: 'Beauté · Makeup · Glamour',
    desc: 'Rose glamour, galerie UGC, routine maquillage. Guide teinte interactif, before/after, social proof massif. Pour makeup, skincare, beauté féminine.',
    accent: '#D4508B',
    badgeBg: '#D4508B',
    badge: 'Beauté',
    cvr: '5.1%',
    niches: ['Beauté', 'Skincare', 'Fashion'],
    fn: templateEtecGlowup,
    sample: SAMPLE_GLOWUP,
    preview: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&q=80',
  },
  {
    id: 'etec-hue',
    name: 'Hue',
    tagline: 'Créatif · Couleurs · Audacieux',
    desc: 'Orange vif et couleurs vibrantes, design bold et créatif. Galerie artistique, typographie expressive, mise en page audacieuse. Pour art, déco, créatifs.',
    accent: '#FF6B35',
    badgeBg: '#FF6B35',
    badge: 'Créatif',
    cvr: '4.3%',
    niches: ['Lifestyle', 'Maison', 'E-commerce'],
    fn: templateEtecHue,
    sample: SAMPLE_HUE,
    preview: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=600&q=80',
  },
  {
    id: 'etec-interior',
    name: 'Interior',
    tagline: 'Mobilier · Intérieur · Nature',
    desc: 'Vert nature, lifestyle maison, design organique. Photos ambiance, dimensions produit, matériaux détaillés. Pour mobilier, décoration intérieure, design.',
    accent: '#5B7553',
    badgeBg: '#5B7553',
    badge: 'Maison',
    cvr: '4.5%',
    niches: ['Maison', 'Lifestyle', 'Bio'],
    fn: templateEtecInterior,
    sample: SAMPLE_INTERIOR,
    preview: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80',
  },
  {
    id: 'etec-platina',
    name: 'Platina',
    tagline: 'Bijoux · Joaillerie · Raffiné',
    desc: 'Doré raffiné, serif premium, mise en valeur des pièces uniques. Zoom détail, certificats, storytelling artisan. Pour bijoux, montres, joaillerie fine.',
    accent: '#B8860B',
    badgeBg: '#B8860B',
    badge: 'Luxe',
    cvr: '4.9%',
    niches: ['Luxe', 'Fashion', 'E-commerce'],
    fn: templateEtecPlatina,
    sample: SAMPLE_PLATINA,
    preview: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600&q=80',
  },
  {
    id: 'etec-streetz',
    name: 'StreetZ',
    tagline: 'Streetwear · Urban · Bold',
    desc: 'Rouge bold, design audacieux, mode urbaine. Drop countdown, stock limité, packaging collector. Pour streetwear, sneakers, urban fashion.',
    accent: '#E11D48',
    badgeBg: '#E11D48',
    badge: 'Fashion',
    cvr: '5.2%',
    niches: ['Fashion', 'Lifestyle', 'E-commerce'],
    fn: templateEtecStreetz,
    sample: SAMPLE_STREETZ,
    preview: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600&q=80',
  },
  {
    id: 'etec-poterie',
    name: 'Poterie',
    tagline: 'Céramique · Artisanat · Terre',
    desc: 'Tons terre cuite, style artisanal authentique. Photos atelier, processus de fabrication, pièces uniques signées. Pour céramique, poterie, artisanat d\'art.',
    accent: '#A0522D',
    badgeBg: '#A0522D',
    badge: 'Artisanat',
    cvr: '4.4%',
    niches: ['Bio', 'Artisanat', 'Maison'],
    fn: templateEtecPoterie,
    sample: SAMPLE_POTERIE,
    preview: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=600&q=80',
  },
  {
    id: 'etec-electro',
    name: 'Electro',
    tagline: 'Supplements · Sport · Hydratation',
    desc: 'Bleu cyan dynamique, visuel sport & performance. Ingrédients détaillés, validation athlètes, abonnement. Pour supplements, nutrition sportive, hydratation.',
    accent: '#00B4D8',
    badgeBg: '#00B4D8',
    badge: 'Health',
    cvr: '4.8%',
    niches: ['Health', 'Wellness', 'E-commerce'],
    fn: templateEtecElectro,
    sample: SAMPLE_ELECTRO,
    preview: 'https://images.unsplash.com/photo-1622543925917-763c34d1a86e?w=600&q=80',
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
          sandbox="allow-scripts allow-popups allow-same-origin"
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

  const FILTERS = ['Tous', 'Tech', 'Beauté', 'Bio', 'Luxe', 'Fashion', 'Hair Care', 'Skincare', 'Health', 'Maison', 'Animaux', 'Électronique', 'Wellness', 'Gaming', 'Lifestyle', 'E-commerce', 'Artisanat', 'Créatif']

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
            42 templates · chaque niche a son design
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
            Accédez aux 42 templates, aux mises à jour futures et aux nouveaux designs dès leur sortie.
          </p>
          <a
            href="/signup"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl text-base font-bold text-white transition-all duration-200 hover:opacity-90 hover:-translate-y-0.5"
            style={{ background: '#5B47F5' }}
          >
            Générer ma première page — gratuit →
          </a>
          <p className="mt-4 text-sm" style={{ color: 'rgba(255,255,255,0.25)' }}>
            1 page gratuite &nbsp;·&nbsp; Aucune CB &nbsp;·&nbsp; Annulez quand vous voulez
          </p>
        </div>
      </section>
    </main>
  )
}
