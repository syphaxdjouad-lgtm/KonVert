'use client'

import { useState, useRef, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { TEMPLATES, PRODUCT_TYPE_LABELS, type ProductType } from '@/lib/templates'
import { detectProductType } from '@/lib/templates/detect-product-type'
import {
  Link2, Pencil, Loader2, ArrowLeft, ArrowRight, Check,
  Upload, Palette, Sparkles, Camera, Lightbulb,
  Zap, X, ChevronRight, Send, ChevronDown, CheckCircle2, AlertCircle,
  Video, Film, TrendingUp, Plus, Music2,
} from 'lucide-react'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import type { LandingPageData } from '@/types'
import { track } from '@/lib/analytics'
import { PlatformLogo } from '@/components/ui/platform-logo'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const _Palette = Palette

const BuilderLoader = dynamic(() => import('@/components/builder/BuilderLoader'), { ssr: false })
const EditorRoot    = dynamic(() => import('@/components/editor/EditorRoot'),     { ssr: false })

type Mode = 'wizard' | 'generating' | 'editor'
type InputMode = 'url' | 'manual'

const STYLES = [
  { id: 'etec-blue',      name: 'Blue',      desc: 'Moderne et universel — bleu électrique, fond blanc, boutons ronds',        emoji: '🔵' },
  { id: 'etec-noir',      name: 'Noir',      desc: 'Dark premium élégant — fond noir profond, accents violets, gaming/luxe',   emoji: '🖤' },
  { id: 'etec-rose',      name: 'Rose',      desc: 'Beauté & skincare — rose chaud, galerie UGC, top conversion beauté',       emoji: '🌸' },
  { id: 'etec-sage',      name: 'Sage',      desc: 'Organic & bien-être — vert forêt, tons naturels, certifications bio',      emoji: '🌿' },
  { id: 'etec-gold',      name: 'Gold',      desc: 'Luxe & exclusivité — fond noir, accents dorés, haute gamme',               emoji: '✨' },
  { id: 'etec-energy',    name: 'Energy',    desc: 'Sport & fitness — orange vif, countdown, dynamisme total',                 emoji: '⚡' },
  { id: 'etec-beauty',    name: 'Beauty',    desc: 'Hair care premium — crème & orange brûlé, routine capillaire, UGC',        emoji: '💆' },
  { id: 'etec-style',     name: 'Style',     desc: 'Fashion & personal styling — beige caramel, minimaliste élégant',          emoji: '👗' },
  { id: 'etec-shopz',     name: 'Shopz',     desc: 'E-commerce clothing — galerie interactive, swatches couleur/taille',       emoji: '🛍️' },
  { id: 'etec-velvety',   name: 'Velvety',   desc: 'Skincare botanique — vert forêt, grille produits, newsletter',             emoji: '🍃' },
  { id: 'etec-prime',     name: 'Prime',     desc: 'Supplements premium — dark + lime, ingrédients cliniques, subscribe',      emoji: '💊' },
  { id: 'etec-blusho',    name: 'Blusho',    desc: 'Cosmetics & skincare — vert olive doux, galerie UGC, routine beauté',      emoji: '🧴' },
  { id: 'etec-casa',      name: 'Casa',      desc: 'Maison & déco artisanale — serif élégant, terre cuite, galerie lifestyle', emoji: '🏠' },
  { id: 'etec-pet',       name: 'Pet',       desc: 'Animaux & pet care — orange chaleureux, sélecteur taille, avis espèce',    emoji: '🐾' },
  { id: 'etec-gadget',    name: 'Gadget',    desc: 'Tech & électronique — Apple-style, glassmorphism, color picker, specs',    emoji: '📱' },
  { id: 'etec-aura',      name: 'Aura',      desc: 'Wellness & rituel — lavande, tons zen, méditation et bien-être',           emoji: '🔮' },
  { id: 'etec-luxe',      name: 'Luxe',      desc: 'Joaillerie & ultra premium — noir & or, serif élégant, exclusivité',       emoji: '💎' },
  { id: 'etec-pulse',     name: 'Pulse',     desc: 'Tech & cyberpunk — dark mode, néon bleu, gadgets futuristes',              emoji: '🌀' },
  { id: 'etec-nordic',    name: 'Nordic',    desc: 'Lifestyle scandinave — minimaliste, tons froids, nature & design',         emoji: '🏔️' },
  { id: 'etec-cosmetix',  name: 'Cosmetix',  desc: 'Clean beauty & cosmétiques — bleu profond, Playfair Display, lab vibes',   emoji: '🧪' },
  { id: 'etec-trendy',    name: 'Trendy',    desc: 'Fashion & streetwear — gradient teal/bleu, Oswald bold, mode urbaine',     emoji: '🔥' },
  { id: 'etec-solo',      name: 'Solo',      desc: 'Mono-produit DTC — focus unique, stats bar, conversion maximale',          emoji: '🎯' },
  { id: 'etec-prestige',  name: 'Prestige',  desc: 'Premium artisanal — rouge profond, serif luxe, haut de gamme',             emoji: '🏆' },
  { id: 'etec-glow',      name: 'Glow',      desc: 'Skincare ritual — corail doux, Cormorant Garamond, routine beauté',        emoji: '✨' },
  { id: 'etec-homestyle',  name: 'HomeStyle', desc: 'Mobilier & déco — tons bois chaud, lifestyle maison, ambiance cosy',       emoji: '🏠' },
  { id: 'etec-jewel',      name: 'Jewel',     desc: 'Bijoux dark luxe — fond sombre, accents dorés, joaillerie premium',        emoji: '💎' },
  { id: 'etec-techcase',   name: 'TechCase',  desc: 'Accessoires tech — minimal noir, coques phone, gadgets Apple style',       emoji: '📱' },
  { id: 'etec-artisan',    name: 'Artisan',   desc: 'Handmade & naturel — tons orangés, savon artisanal, fait main',           emoji: '🧼' },
  { id: 'etec-outfit',     name: 'Outfit',    desc: 'Vêtements e-com — tons neutres chauds, galerie lookbook, warm neutral',   emoji: '👕' },
  { id: 'etec-ella',       name: 'Ella',      desc: 'Mode féminine — mauve élégant, serif raffiné, lifestyle féminin',        emoji: '👠' },
  { id: 'etec-starter',    name: 'Starter',   desc: 'Polyvalent & clean — indigo, design universel, idéal pour débuter',      emoji: '🚀' },
  { id: 'etec-glowup',     name: 'GlowUp',   desc: 'Beauté & makeup — rose glamour, galerie UGC, routine maquillage',        emoji: '💄' },
  { id: 'etec-hue',        name: 'Hue',       desc: 'Créatif & audacieux — orange vif, couleurs vibrantes, design bold',      emoji: '🎨' },
  { id: 'etec-interior',   name: 'Interior',  desc: 'Mobilier & intérieur — vert nature, lifestyle maison, design organique', emoji: '🪴' },
  { id: 'etec-platina',    name: 'Platina',   desc: 'Bijoux & joaillerie — doré raffiné, serif premium, pièces uniques',      emoji: '💍' },
  { id: 'etec-streetz',    name: 'StreetZ',   desc: 'Streetwear & urban — rouge bold, design audacieux, mode urbaine',        emoji: '🧢' },
  { id: 'etec-poterie',    name: 'Poterie',   desc: 'Céramique & artisanat — terre cuite, fait main, style organique',        emoji: '🏺' },
  { id: 'etec-electro',    name: 'Electro',   desc: 'Supplements & sport — bleu cyan, hydratation, energy boost',             emoji: '💧' },
  { id: 'etec-agency',     name: 'Agency',    desc: 'Corporate & services — bleu pro, structure claire, B2B',                 emoji: '🏢' },
  { id: 'etec-supreme',    name: 'Supreme',   desc: 'Streetwear & drops — fond dark, monospace, urgence maximale',            emoji: '🔴' },
  { id: 'etec-quarter',    name: 'Quarter',   desc: 'Minimal luxe — noir & blanc épuré, typographie élégante',                emoji: '◼️' },
  { id: 'etec-boost',      name: 'Boost',     desc: 'Conversion max — badges confiance, preuves sociales, DTC wellness',     emoji: '🚀' },
]

// ── Styles V3 (10 styles Allbirds-grade — engine V3 branché Phase 2) ──
// Chaque style expose des couleurs + fonts pour les previews visuels dans
// la carte du wizard étape 5/8 (Phase 3). Les tokens réels vivent dans
// src/lib/styles/<id>/tokens.ts — on duplique ici juste ce qu'il faut pour
// la preview UI (bg, accent, text, font heading) pour éviter d'importer
// tous les fichiers tokens côté client.
// Champs ajoutés pour Phase 3 v3 : surface (palette secondaire), btnRadius
// (forme du CTA), brand+product+tagline (contenu démo), photo (Unsplash URL
// cohérente avec le style). Le rendu de la carte affiche un mini-site
// (header + hero photo + features strip) au lieu du mockup abstrait.
const V3_STYLES = [
  { id: 'soft',         name: 'Soft',         desc: 'Mejuri / Glossier vibe — rose poudré, sérif raffiné, intimité moderne',     emoji: '🌸',
    bg: '#FAF7F2', surface: '#F0E8DC', accent: '#C9A77E', text: '#1A1614', font: '"Cormorant Garamond", Georgia, serif', btnRadius: 999,
    brand: 'MEJURI', product: 'Demi Hoop Earrings', tagline: 'Designed to be worn always',
    photo: 'https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=600&q=80&auto=format&fit=crop',
    bullets: ['Bijoux · Skincare · DTC luxe', 'Top conversion beauté féminine', 'Sérif raffiné Cormorant'] },
  { id: 'editorial',    name: 'Editorial',    desc: 'Magazine éditorial — typo généreuse, blanc + crème, storytelling premium',  emoji: '📰',
    bg: '#FFFFFF', surface: '#F8F6F2', accent: '#0A0A0A', text: '#0A0A0A', font: '"Playfair Display", "Times New Roman", serif', btnRadius: 0,
    brand: 'MONOCLE', product: 'Travel Wallet', tagline: 'Crafted in Florence since 1962',
    photo: 'https://images.unsplash.com/photo-1606503825008-909a67e63c3d?w=600&q=80&auto=format&fit=crop',
    bullets: ['Mode · Maroquinerie · Lifestyle premium', 'Storytelling magazine généreux', 'Boutons carrés sobres'] },
  { id: 'apple-clean',  name: 'Apple Clean',  desc: 'Apple-grade clarté — blanc pur, sans-serif système, glassmorphism subtil',  emoji: '⚪',
    bg: '#F5F5F7', surface: '#FFFFFF', accent: '#0066CC', text: '#1D1D1F', font: '"SF Pro Display", "Inter", system-ui, sans-serif', btnRadius: 980,
    brand: 'AERO', product: 'AirPro Wireless', tagline: 'Pure sound. Pure design.',
    photo: 'https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=600&q=80&auto=format&fit=crop',
    bullets: ['Tech · Électronique · Accessoires', 'Clarté Apple, rendu universel', 'Boutons rounded pills'] },
  { id: 'luxe-noir',    name: 'Luxe Noir',    desc: 'Dark warm + or — noir profond, accents dorés, joaillerie / haute couture', emoji: '✨',
    bg: '#14110F', surface: '#1F1B17', accent: '#C9A84C', text: '#F5F0E8', font: '"Playfair Display", Georgia, serif', btnRadius: 0,
    brand: 'NOIR', product: 'Diamond Solitaire', tagline: 'For the timeless few',
    photo: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600&q=80&auto=format&fit=crop',
    bullets: ['Bijoux · Horlogerie · Ultra premium', 'Dark mode + or = exclusivité', 'Sérif Playfair statement'] },
  { id: 'organic',      name: 'Organic',      desc: 'Aesop vibe — vert sauge, sérif, naturel, bien-être, supplements bio',      emoji: '🌿',
    bg: '#F4F1EB', surface: '#E8E2D4', accent: '#5B6E4F', text: '#1F2D24', font: '"DM Serif Display", Georgia, serif', btnRadius: 999,
    brand: 'AESOP', product: 'Sage & Cedar Balm', tagline: 'Botanicals for sensitive skin',
    photo: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&q=80&auto=format&fit=crop',
    bullets: ['Skincare · Bien-être · Suppléments', 'Tons naturels, certifications bio', 'DM Serif Display chaleureux'] },
  { id: 'brutalist',    name: 'Brutalist',    desc: 'Brut & impactant — mono très bold (JetBrains), grilles strictes, raw',     emoji: '◼️',
    bg: '#FFFFFF', surface: '#F0F0F0', accent: '#FF3300', text: '#000000', font: '"JetBrains Mono", "Courier New", monospace', btnRadius: 0,
    brand: 'RAW.CO', product: 'Concrete Vase /01', tagline: 'Raw materials. No compromise.',
    photo: 'https://images.unsplash.com/photo-1578500494198-246f612d3b3d?w=600&q=80&auto=format&fit=crop',
    bullets: ['Déco · Tech avant-garde · Streetwear', 'Mono bold + grilles strictes', 'Rouge orangé accent'] },
  { id: 'warm-neutral', name: 'Warm Neutral', desc: 'ALD vibe — beige sable, terra cotta, mode caramelisée, lifestyle élégant',  emoji: '🍂',
    bg: '#F4ECE0', surface: '#E8DCC8', accent: '#B5854B', text: '#3B2F23', font: '"DM Serif Display", Georgia, serif', btnRadius: 999,
    brand: 'ALD', product: 'Caramel Cardigan', tagline: 'Slow fashion, warm tones',
    photo: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600&q=80&auto=format&fit=crop',
    bullets: ['Mode · Lifestyle · Lookbook', 'Tons caramel chauds, slow fashion', 'DM Serif Display tendre'] },
  { id: 'minimal-mono', name: 'Minimal Mono', desc: 'MUJI minimal — typo Inter, neutres absolus, pureté zen, anti-décor',       emoji: '◽',
    bg: '#FFFFFF', surface: '#F2F2F2', accent: '#000000', text: '#000000', font: '"Inter", system-ui, sans-serif', btnRadius: 4,
    brand: 'MUJI', product: 'Linen T-Shirt', tagline: 'Essential, nothing more',
    photo: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80&auto=format&fit=crop',
    bullets: ['Universel · Capsule · Essentiels', 'Inter pure, anti-décor zen', 'Coins légers radius 4px'] },
  { id: 'vibrant',      name: 'Vibrant',      desc: 'Tonies / Notion vibe — couleurs vibrantes, joyeux, jeune, énergique',       emoji: '🎨',
    bg: '#FFFFFF', surface: '#FFF1D6', accent: '#FF4D88', text: '#1A1A1A', font: '"Space Grotesk", "Inter", sans-serif', btnRadius: 999,
    brand: 'TONIES', product: 'Pop Speaker Mini', tagline: 'Sound that makes you smile',
    photo: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600&q=80&auto=format&fit=crop',
    bullets: ['Kids · Tech fun · Gadgets pop', 'Couleurs vibrantes joyeuses', 'Space Grotesk énergique'] },
  { id: 'bold',         name: 'Bold',         desc: 'Statement maximaliste — typo display géante, contraste extrême, impact',    emoji: '💥',
    bg: '#FFFFFF', surface: '#FFF5E6', accent: '#FF2277', text: '#0F0F0F', font: '"Space Grotesk", "Arial Black", sans-serif', btnRadius: 999,
    brand: 'BLOOP', product: 'Mega Drop /03', tagline: 'Drop. Sold out. Repeat.',
    photo: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80&auto=format&fit=crop',
    bullets: ['Streetwear · Drops · Sneakers', 'Typo bold géante, FOMO max', 'Magenta accent statement'] },
]

// Enrichi pour Phase 6 — chaque ton expose :
// icon (emoji), accent (color signature), example (1 phrase voix réelle),
// useCases (2 cas d'usage cibles). Le rendu carte est plus visuel et
// permet à l'user de "sentir" la voix avant de choisir.
const TONES = [
  {
    id: 'persuasif',
    label: 'Persuasif',
    desc: 'Vente directe, urgence, FOMO',
    icon: '⚡',
    accent: '#FF6B35',
    bgTint: '#FFF4ED',
    example: 'Plus que 12 en stock — la dernière commande a été passée il y a 4 minutes.',
    useCases: ['Dropshipping · Drops', 'Promotions flash'],
  },
  {
    id: 'premium',
    label: 'Premium',
    desc: 'Luxe, exclusivité, qualité',
    icon: '✦',
    accent: '#9B7B3D',
    bgTint: '#FAF6EE',
    example: 'Façonné à la main dans notre atelier de Florence depuis 1962.',
    useCases: ['Joaillerie · Maroquinerie', 'DTC haut de gamme'],
  },
  {
    id: 'fun',
    label: 'Fun & Viral',
    desc: 'Casual, émotionnel, réseaux',
    icon: '🎉',
    accent: '#E14B8C',
    bgTint: '#FFF0F6',
    example: 'Tu vas l\'adorer (ou on te rembourse, promis juré).',
    useCases: ['Kids · Pop culture', 'TikTok-first'],
  },
  {
    id: 'informatif',
    label: 'Informatif',
    desc: 'Factuel, technique, comparatif',
    icon: '◆',
    accent: '#2A6FE0',
    bgTint: '#EEF4FE',
    example: 'Coton bio certifié GOTS, 220 g/m², tissé en France, livré en 48h.',
    useCases: ['Tech · Suppléments', 'B2B · Pro'],
  },
]

// Mapping tone legacy (4 valeurs) → tone V3 (5 valeurs). Les tones V3 viennent
// de src/types/v3.ts CopyTone : 'friendly' | 'premium' | 'bold' | 'storytelling' | 'educational'
// (+ 'auto' que l'engine V3 résout via autoPickTone).
const LEGACY_TONE_TO_V3: Record<string, 'friendly' | 'premium' | 'bold' | 'storytelling' | 'educational'> = {
  persuasif:  'bold',
  premium:    'premium',
  fun:        'friendly',
  informatif: 'educational',
}

// Détecte si une couleur hex (#RRGGBB) est foncée (luminance perceived <140).
// Sert à choisir la couleur de texte sur un button accent dans la preview V3 :
// fond clair → texte foncé, fond foncé → texte blanc.
function isColorDark(hex: string): boolean {
  const c = hex.replace('#', '')
  if (c.length !== 6) return false
  const r = parseInt(c.slice(0, 2), 16)
  const g = parseInt(c.slice(2, 4), 16)
  const b = parseInt(c.slice(4, 6), 16)
  return (r * 0.299 + g * 0.587 + b * 0.114) < 140
}

// Photos Unsplash par template legacy etec-*. Une URL par template, cohérente
// avec son productType (skincare, tech, jewelry, home, fashion, etc.). Si une
// URL fail à charger, fallback emoji XL via onError du <img>.
// Format : photo-XXXXXXXXXX (ID Unsplash) + query w=600&q=80 pour optim mobile.
const TEMPLATE_PHOTOS: Record<string, string> = {
  // skincare / beauty
  'etec-rose':     'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&q=80&auto=format&fit=crop',
  'etec-beauty':   'https://images.unsplash.com/photo-1607602132700-068258431c6c?w=600&q=80&auto=format&fit=crop',
  'etec-velvety':  'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=600&q=80&auto=format&fit=crop',
  'etec-blusho':   'https://images.unsplash.com/photo-1556228852-80b6e5eeff06?w=600&q=80&auto=format&fit=crop',
  'etec-cosmetix': 'https://images.unsplash.com/photo-1612817288484-6f916006741a?w=600&q=80&auto=format&fit=crop',
  'etec-glow':     'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&q=80&auto=format&fit=crop',
  'etec-glowup':   'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=600&q=80&auto=format&fit=crop',
  // tech / électronique
  'etec-noir':     'https://images.unsplash.com/photo-1593344484962-796055d4a3a4?w=600&q=80&auto=format&fit=crop',
  'etec-gadget':   'https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=600&q=80&auto=format&fit=crop',
  'etec-pulse':    'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&q=80&auto=format&fit=crop',
  'etec-techcase': 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=600&q=80&auto=format&fit=crop',
  // jewelry / luxury
  'etec-gold':     'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=600&q=80&auto=format&fit=crop',
  'etec-luxe':     'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600&q=80&auto=format&fit=crop',
  'etec-jewel':    'https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=600&q=80&auto=format&fit=crop',
  'etec-platina':  'https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=600&q=80&auto=format&fit=crop',
  'etec-prestige': 'https://images.unsplash.com/photo-1606503825008-909a67e63c3d?w=600&q=80&auto=format&fit=crop',
  // home / déco
  'etec-casa':     'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&q=80&auto=format&fit=crop',
  'etec-homestyle':'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=600&q=80&auto=format&fit=crop',
  'etec-artisan':  'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=600&q=80&auto=format&fit=crop',
  'etec-interior': 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=600&q=80&auto=format&fit=crop',
  'etec-poterie':  'https://images.unsplash.com/photo-1578500494198-246f612d3b3d?w=600&q=80&auto=format&fit=crop',
  // fashion / mode
  'etec-style':    'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&q=80&auto=format&fit=crop',
  'etec-shopz':    'https://images.unsplash.com/photo-1542272604-787c3835535d?w=600&q=80&auto=format&fit=crop',
  'etec-trendy':   'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=600&q=80&auto=format&fit=crop',
  'etec-nordic':   'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&q=80&auto=format&fit=crop',
  'etec-outfit':   'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600&q=80&auto=format&fit=crop',
  'etec-ella':     'https://images.unsplash.com/photo-1488161628813-04466f872be2?w=600&q=80&auto=format&fit=crop',
  'etec-streetz':  'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80&auto=format&fit=crop',
  'etec-supreme':  'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80&auto=format&fit=crop',
  // wellness / supplements
  'etec-sage':     'https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=600&q=80&auto=format&fit=crop',
  'etec-prime':    'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&q=80&auto=format&fit=crop',
  'etec-aura':     'https://images.unsplash.com/photo-1545389336-cf090694435e?w=600&q=80&auto=format&fit=crop',
  'etec-electro':  'https://images.unsplash.com/photo-1551244072-5d12893278ab?w=600&q=80&auto=format&fit=crop',
  'etec-boost':    'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600&q=80&auto=format&fit=crop',
  // pet
  'etec-pet':      'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=600&q=80&auto=format&fit=crop',
  // universal / divers
  'etec-blue':     'https://images.unsplash.com/photo-1604754742629-3e5728249d73?w=600&q=80&auto=format&fit=crop',
  'etec-energy':   'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&q=80&auto=format&fit=crop',
  'etec-solo':     'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=600&q=80&auto=format&fit=crop',
  'etec-starter':  'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600&q=80&auto=format&fit=crop',
  'etec-hue':      'https://images.unsplash.com/photo-1614633833026-0820552978b6?w=600&q=80&auto=format&fit=crop',
  'etec-agency':   'https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&q=80&auto=format&fit=crop',
  'etec-quarter':  'https://images.unsplash.com/photo-1574180566232-aaad1b5b8450?w=600&q=80&auto=format&fit=crop',
  'etec-natural':  'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&q=80&auto=format&fit=crop',
}

// Dérive bg/surface/text/font/btnRadius pour chaque template etec-* à partir
// de son id. On utilise des sets pré-définis pour identifier les templates
// dark, serif, et mono — le reste fallback sur du blanc/Inter/rond.
function deriveTemplateStyle(templateId: string, accent: string): {
  bg: string; surface: string; text: string; font: string; btnRadius: number;
} {
  const DARK = new Set([
    'etec-noir', 'etec-gold', 'etec-luxe', 'etec-jewel', 'etec-pulse',
    'etec-supreme', 'etec-platina', 'etec-prestige',
  ])
  const SERIF = new Set([
    'etec-rose', 'etec-blusho', 'etec-velvety', 'etec-cosmetix', 'etec-glow',
    'etec-glowup', 'etec-casa', 'etec-homestyle', 'etec-artisan', 'etec-interior',
    'etec-ella', 'etec-luxe', 'etec-jewel', 'etec-platina', 'etec-prestige',
    'etec-gold', 'etec-sage', 'etec-aura', 'etec-natural',
  ])
  const MONO = new Set(['etec-pulse', 'etec-supreme', 'etec-quarter'])

  const isDark = DARK.has(templateId)
  return {
    bg: isDark ? '#0F0F11' : '#FFFFFF',
    surface: isDark ? `${accent}1A` : '#FAFAFA',
    text: isDark ? '#F0F0F0' : '#1A1A1A',
    font: MONO.has(templateId)
      ? '"JetBrains Mono", "Courier New", monospace'
      : SERIF.has(templateId)
        ? '"Playfair Display", Georgia, serif'
        : '"Inter", system-ui, sans-serif',
    btnRadius: SERIF.has(templateId) || MONO.has(templateId) ? 0 : 999,
  }
}

// Génère brand/product/tagline/bullets pour chaque template à partir de son
// productType. Le nom du template sert de brand (uppercase).
function getTemplateContent(template: { id: string; name: string }, productType: string | undefined): {
  brand: string; product: string; tagline: string; bullets: string[];
} {
  const TYPE_DATA: Record<string, { product: string; tagline: string; bullets: string[] }> = {
    skincare:  { product: 'Hydra Serum 30ml',    tagline: 'Pour peaux sensibles, sans parfum.',     bullets: ['Skincare · Cosmétique', 'Galerie UGC + reviews', 'Top conversion beauté'] },
    beauty:    { product: 'Velvet Lip Tint',     tagline: 'Tenue 12h, fini velouté.',                bullets: ['Maquillage · Routine beauté', 'Swatches couleur interactifs', 'Storytelling cosmétique'] },
    wellness:  { product: 'Daily Multi Pack',    tagline: 'Énergie + immunité, formule pure.',       bullets: ['Suppléments · Bien-être', 'Ingrédients cliniques', 'Subscribe & save'] },
    tech:      { product: 'Pro Wireless Earbuds',tagline: 'Son cristallin, autonomie 36h.',          bullets: ['Tech · Électronique · Gadgets', 'Specs claires + glassmorphism', 'CTA tech-savvy'] },
    jewelry:   { product: 'Atelier Hoop Earrings',tagline: 'Or 18 carats, fait main.',                bullets: ['Bijoux · Joaillerie · Premium', 'Photos packshot studio', 'Conversion luxe'] },
    home:      { product: 'Linen Throw 130×170', tagline: 'Lin tissé main, lavable machine.',        bullets: ['Maison · Déco · Lifestyle', 'Lookbook ambiance cosy', 'Tons naturels chaleureux'] },
    fashion:   { product: 'Cashmere Cardigan',   tagline: 'Cachemire Mongolie, coupe oversize.',     bullets: ['Mode · Vêtements · Lookbook', 'Galerie variantes couleur', 'UGC + storytelling'] },
    pet:       { product: 'Eco Bamboo Brush',    tagline: 'Bambou + soies douces, zéro plastique.',  bullets: ['Animaux · Pet care', 'Avis par espèce', 'Sélecteur taille intuitif'] },
    luxury:    { product: 'Diamond Solitaire',   tagline: 'Diamant éthique, certifié IGI.',          bullets: ['Ultra premium · Exclusivité', 'Dark mode + accents or', 'Storytelling artisanal'] },
    universal: { product: 'Hero Product',        tagline: 'Adapté à tout type de produit.',          bullets: ['Universel · Multi-vertical', 'Design clean, rendu pro', 'Idéal pour débuter'] },
  }
  const data = TYPE_DATA[productType ?? 'universal'] || TYPE_DATA.universal
  return {
    brand: template.name.toUpperCase(),
    product: data.product,
    tagline: data.tagline,
    bullets: data.bullets,
  }
}

const PLATFORMS = [
  { id: 'shopify',      label: 'Shopify',         icon: '🟢' },
  { id: 'woocommerce',  label: 'WooCommerce',      icon: '🟣' },
  { id: 'youcan',       label: 'YouCan',           icon: '🟠' },
  { id: 'standalone',   label: 'Page standalone',  icon: '🔗' },
]

const LANGUAGES = [
  { code: 'fr', flag: '🇫🇷', label: 'Français',   desc: 'Copy optimisé marché FR/BE/CH' },
  { code: 'en', flag: '🇺🇸', label: 'English',    desc: 'US/UK market optimized copy'   },
  { code: 'es', flag: '🇪🇸', label: 'Español',    desc: 'Mercado ES/LATAM'              },
  { code: 'de', flag: '🇩🇪', label: 'Deutsch',    desc: 'DE/AT/CH optimiert'            },
  { code: 'it', flag: '🇮🇹', label: 'Italiano',   desc: 'Mercato IT ottimizzato'        },
  { code: 'pt', flag: '🇧🇷', label: 'Português',  desc: 'Mercado BR/PT'                 },
  { code: 'ar', flag: '🇸🇦', label: 'العربية',    desc: 'سوق الشرق الأوسط'             },
  { code: 'zh', flag: '🇨🇳', label: '中文',       desc: '中国市场优化'                  },
]

// ── Composant StepIndicator ──
function StepIndicator({ current, total, labels }: { current: number; total: number; labels: string[] }) {
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!scrollRef.current) return
    const activeEl = scrollRef.current.querySelector('[data-active="true"]') as HTMLElement | null
    if (activeEl) {
      const container = scrollRef.current
      const scrollLeft = activeEl.offsetLeft - container.offsetWidth / 2 + activeEl.offsetWidth / 2
      container.scrollTo({ left: scrollLeft, behavior: 'smooth' })
    }
  }, [current])

  return (
    <div
      ref={scrollRef}
      className="hidden sm:flex items-center gap-0 overflow-x-auto scrollbar-hide pb-1"
      style={{ WebkitOverflowScrolling: 'touch', scrollbarWidth: 'none', msOverflowStyle: 'none' }}
    >
      {labels.map((label, i) => {
        const step = i + 1
        const done   = step < current
        const active = step === current
        return (
          <div key={step} className="flex items-center flex-shrink-0" data-active={active ? 'true' : undefined}>
            <div className="flex flex-col items-center gap-1">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all"
                style={done
                  ? { background: '#7c3aed', color: '#fff' }
                  : active
                  ? { background: '#7c3aed', color: '#fff', boxShadow: '0 0 0 3px rgba(124,58,237,0.2)' }
                  : { background: '#f0f0f5', color: '#8b8b9e' }
                }
              >
                {done ? <Check className="w-3.5 h-3.5" /> : step}
              </div>
              <span className="text-[10px] font-medium whitespace-nowrap hidden sm:block" style={{ color: active ? '#7c3aed' : '#8b8b9e' }}>
                {label}
              </span>
            </div>
            {i < total - 1 && (
              <div className="w-8 md:w-12 h-px mx-1 mb-4 transition-all" style={{ background: done ? '#7c3aed' : '#e3e3e8' }} />
            )}
          </div>
        )
      })}
    </div>
  )
}

function NewPageInner() {
  const router        = useRouter()
  const searchParams  = useSearchParams()
  const fileInputRef  = useRef<HTMLInputElement>(null)

  const [pageId,       setPageId]       = useState<string | null>(null)
  const [loadingPage,  setLoadingPage]  = useState(false)
  const videoInputRef = useRef<HTMLInputElement>(null)
  const beforeInputRef = useRef<HTMLInputElement>(null)
  const afterInputRef  = useRef<HTMLInputElement>(null)

  const [mode, setMode] = useState<Mode>('wizard')
  const [step, setStep] = useState(1)

  // Step 1 — Source
  const [inputMode, setInputMode] = useState<InputMode>('url')
  const [url, setUrl]             = useState('')
  const [manual, setManual]       = useState({
    product_name: '', headline: '', subtitle: '',
    price: '', original_price: '', cta: 'Commander maintenant',
  })

  // Step 2 — Photos produit
  const [uploadedPhotos, setUploadedPhotos] = useState<string[]>([])

  // Step 3 — Vidéos UGC
  const [ugcVideos, setUgcVideos] = useState<string[]>([])
  const [ugcLinks,  setUgcLinks]  = useState<string[]>([''])
  const [ugcTab,    setUgcTab]    = useState(0)

  // Step 4 — Photos Avant/Après
  const [beforePhotos, setBeforePhotos] = useState<string[]>([])
  const [afterPhotos,  setAfterPhotos]  = useState<string[]>([])

  // Step 5 — Style & Ton
  const [selectedStyle, setSelectedStyle] = useState('etec-blue')
  // Phase 1 — toggle UI entre la liste des templates legacy (etec-*) et la
  // liste des nouveaux styles V3. Engine de génération reste legacy pour
  // l'instant (Phase 2 branchera engine V3 quand l'UI sera validée).
  const [styleMode, setStyleMode] = useState<'legacy' | 'v3'>('legacy')
  const [selectedTone,  setSelectedTone]  = useState('persuasif')
  // Brand name affiché en haut du hero V3 + dans le manifesto. Optionnel —
  // si vide, DeepSeek invente un nom cohérent avec le produit.
  const [brand, setBrand] = useState('')

  // Step 6 — Plateforme cible
  const [platform, setPlatform] = useState('shopify')

  // Step 7 — Langue du résultat
  const [resultLang, setResultLang] = useState('fr')

  // Step 8 — Récap + lancement
  const [title,       setTitle]       = useState('')
  const [html,        setHtml]        = useState('')
  const [landingData, setLandingData] = useState<LandingPageData | null>(null)
  const [error,       setError]       = useState<string | null>(null)
  // Warning non-bloquant : affiché quand le scrape a réussi en mode dégradé
  // (titre OU images récupérées mais pas tout). L'user voit la page générée
  // et un message lui suggère de relire/corriger avant publication.
  const [partialWarning, setPartialWarning] = useState<string | null>(null)
  const [saving,      setSaving]      = useState(false)

  // Publication vers store
  const [stores,         setStores]         = useState<any[]>([])
  const [publishOpen,    setPublishOpen]     = useState(false)
  const [publishing,     setPublishing]      = useState<string | null>(null)
  const [publishSuccess, setPublishSuccess]  = useState<{ name: string; url?: string } | null>(null)
  const [publishError,   setPublishError]    = useState<string | null>(null)

  // ── Tracking début wizard (1 seule fois par mount) ──
  useEffect(() => {
    track.newPageWizardStarted()
  }, [])

  // ── Tracking avancement steps wizard ──
  // Noms des steps alignés avec l'UI pour lisibilité dans PostHog.
  const STEP_NAMES: Record<number, string> = {
    1: 'source', 2: 'photos', 3: 'ugc', 4: 'before_after',
    5: 'style_tone', 6: 'platform', 7: 'language', 8: 'generate',
  }
  useEffect(() => {
    if (mode !== 'wizard' || step < 1) return
    track.newPageWizardStepCompleted(step, STEP_NAMES[step] ?? `step_${step}`)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step])

  // ── Backup wizard dans localStorage ─────────────────────────────────
  // F5 ou crash navigateur pendant le wizard = perte des inputs avant ce fix
  // (audit Konan P1-3). On sauvegarde les champs des steps 1-7 à chaque change,
  // expirable 24h. Pas le HTML résultant (lourd, déjà persisté côté DB via pageId).
  const WIZARD_DRAFT_KEY = 'konvert-wizard-draft'
  const WIZARD_DRAFT_TTL_MS = 24 * 60 * 60 * 1000

  // Restore au mount — sauf si l'user load une page existante via ?page_id=
  useEffect(() => {
    if (searchParams.get('page_id')) return
    try {
      const raw = localStorage.getItem(WIZARD_DRAFT_KEY)
      if (!raw) return
      const draft = JSON.parse(raw) as { ts: number; data: Record<string, unknown> }
      if (!draft.ts || Date.now() - draft.ts > WIZARD_DRAFT_TTL_MS) {
        localStorage.removeItem(WIZARD_DRAFT_KEY)
        return
      }
      const d = draft.data as {
        step?: number; inputMode?: InputMode; url?: string; manual?: typeof manual
        uploadedPhotos?: string[]; ugcVideos?: string[]; ugcLinks?: string[]
        beforePhotos?: string[]; afterPhotos?: string[]
        selectedStyle?: string; selectedTone?: string; platform?: string; resultLang?: string
      }
      if (typeof d.step === 'number' && d.step >= 1 && d.step <= 7) setStep(d.step)
      if (d.inputMode) setInputMode(d.inputMode)
      if (typeof d.url === 'string') setUrl(d.url)
      if (d.manual) setManual(d.manual)
      if (Array.isArray(d.uploadedPhotos)) setUploadedPhotos(d.uploadedPhotos)
      if (Array.isArray(d.ugcVideos)) setUgcVideos(d.ugcVideos)
      if (Array.isArray(d.ugcLinks)) setUgcLinks(d.ugcLinks)
      if (Array.isArray(d.beforePhotos)) setBeforePhotos(d.beforePhotos)
      if (Array.isArray(d.afterPhotos)) setAfterPhotos(d.afterPhotos)
      if (d.selectedStyle) setSelectedStyle(d.selectedStyle)
      if (d.selectedTone) setSelectedTone(d.selectedTone)
      if (d.platform) setPlatform(d.platform)
      if (d.resultLang) setResultLang(d.resultLang)
    } catch {
      // localStorage indisponible (private mode) ou JSON corrompu — on ignore
      try { localStorage.removeItem(WIZARD_DRAFT_KEY) } catch { /* noop */ }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Save à chaque change de champ wizard, sauf en step 8 (résultat) / mode editor
  useEffect(() => {
    if (mode !== 'wizard') return
    if (step >= 8) return
    try {
      const data = {
        step, inputMode, url, manual,
        uploadedPhotos, ugcVideos, ugcLinks,
        beforePhotos, afterPhotos,
        selectedStyle, selectedTone, platform, resultLang,
      }
      localStorage.setItem(WIZARD_DRAFT_KEY, JSON.stringify({ ts: Date.now(), data }))
    } catch { /* quota dépassé / private mode — silencieux */ }
  }, [
    mode, step, inputMode, url, manual,
    uploadedPhotos, ugcVideos, ugcLinks,
    beforePhotos, afterPhotos,
    selectedStyle, selectedTone, platform, resultLang,
  ])

  // Clear à la publication réussie (ou au changement de mode vers editor stable)
  useEffect(() => {
    if (mode === 'editor' && html) {
      try { localStorage.removeItem(WIZARD_DRAFT_KEY) } catch { /* noop */ }
    }
  }, [mode, html])

  // ── Chargement d'une page existante ──
  useEffect(() => {
    const id = searchParams.get('page_id')
    if (!id) return
    setPageId(id)
    setLoadingPage(true)
    const supabase = createClient()
    supabase
      .from('pages')
      .select('id, title, product_url, html_content, json_content, template_id')
      .eq('id', id)
      .single()
      .then(({ data, error }) => {
        if (error || !data) { setLoadingPage(false); return }
        const json = data.json_content as LandingPageData | null
        if (data.product_url) {
          setInputMode('url')
          setUrl(data.product_url)
        }
        if (json) {
          setManual({
            product_name:   json.product_name || '',
            headline:       json.headline || '',
            subtitle:       json.subtitle || '',
            price:          json.price || '',
            original_price: json.original_price || '',
            cta:            json.cta || 'Commander maintenant',
          })
          setLandingData(json)
          if (json.images?.length) setUploadedPhotos(json.images)
          // Le slug du template est stocke dans json_content._template_slug
          // (template_id en DB est un UUID FK qui reste null pour l'instant)
          const slug = (json as { _template_slug?: string })._template_slug
          if (slug) setSelectedStyle(slug)
        }
        if (data.title) setTitle(data.title)
        if (data.html_content) {
          setHtml(data.html_content)
          setMode('editor')
        }
        setLoadingPage(false)
      })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // ── Chargement stores ──
  useEffect(() => {
    const supabase = createClient()
    supabase.from('stores').select('id, name, platform, store_url').then(({ data }) => {
      setStores(data || [])
    })
  }, [])

  // ── Publication vers store ──
  async function publishToStore(store: any) {
    if (!pageId) return
    setPublishing(store.id)
    setPublishError(null)
    setPublishSuccess(null)
    try {
      const endpoint = store.platform === 'youcan' ? '/api/youcan/push' : store.platform === 'woocommerce' ? '/api/woocommerce/push' : '/api/shopify/push'
      const res  = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ store_id: store.id, page_id: pageId }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error)
      // L'API push renvoie data.url (Shopify/Woo/YouCan) — on l'expose dans
      // le toast pour que l'user puisse cliquer "Voir la page publiée".
      setPublishSuccess({ name: store.name, url: json.data?.url })
      setPublishOpen(false)
      track.pagePublished(store.platform as 'shopify' | 'woocommerce' | 'youcan')
    } catch (err) {
      setPublishError(err instanceof Error ? err.message : 'Erreur publication')
    } finally {
      setPublishing(null)
    }
  }

  // ── Upload helper Supabase Storage ──
  // Toutes les photos passent par /api/upload qui pousse sur le bucket
  // pages-images et renvoie une URL publique. On ne stocke JAMAIS de base64
  // côté client (cf bug #3 audit : crash DB sur 3-4 photos).
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)

  async function uploadOne(file: File, kind: 'product' | 'before' | 'after'): Promise<string | null> {
    const fd = new FormData()
    fd.append('file', file)
    fd.append('kind', kind)
    const res = await fetch('/api/upload', { method: 'POST', body: fd })
    const json = await res.json().catch(() => ({}))
    if (!res.ok) throw new Error(json.error || 'Upload échoué')
    return json.url ?? null
  }

  // ── Gestion upload photos produit ──
  async function handlePhotoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return
    setUploading(true)
    setUploadError(null)
    try {
      for (const file of files) {
        const url = await uploadOne(file, 'product')
        if (url) setUploadedPhotos(prev => [...prev, url])
      }
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : 'Erreur upload')
    } finally {
      setUploading(false)
      e.target.value = '' // permet de réuploader le même fichier
    }
  }

  function removePhoto(index: number) {
    setUploadedPhotos(prev => prev.filter((_, i) => i !== index))
  }

  // ── Gestion upload vidéos UGC ──
  // Vidéos désactivées : trop lourdes pour le base64, et le storage Supabase
  // n'est pas dimensionné pour des MP4 multi-MB côté MVP. L'utilisateur peut
  // toujours coller des liens YouTube/TikTok via l'onglet "Liens externes".
  // (cf bug #4 audit lancement)
  function handleVideoUpload(_e: React.ChangeEvent<HTMLInputElement>) {
    setUploadError('L\'upload vidéo est temporairement indisponible — utilise l\'onglet "Liens externes" (YouTube, TikTok…)')
  }

  // ── Langue label helper ──
  function getLangLabel(code: string): string {
    const found = LANGUAGES.find(l => l.code === code)
    return found ? `${found.flag} ${found.label}` : code
  }

  // ── Validation URL ──
  // On parse côté front pour éviter le throw "The string did not match the
  // expected pattern" remonté brut par Safari quand l'URL est cassée.
  function isValidHttpUrl(input: string): boolean {
    try {
      const u = new URL(input.trim())
      return u.protocol === 'http:' || u.protocol === 'https:'
    } catch {
      return false
    }
  }

  // ── Génération ──
  async function generate() {
    if (mode !== 'wizard') return // garde-fou anti double-clic

    if (inputMode === 'url' && !isValidHttpUrl(url)) {
      setError('URL invalide. Colle un lien produit complet commençant par https:// (ex: https://www.aliexpress.com/item/...).')
      return
    }

    setMode('generating')
    setError(null)
    track.newPageWizardCompleted()
    track.generateStarted('dashboard')
    const startedAt = Date.now()
    try {
      // Mode URL : on split le flow en 2 appels (scrape → generate) pour ne pas
      // dépasser le maxDuration Vercel sur AliExpress (Bright Data ~50-65s).
      // Si on appelait /api/generate avec body.url, il chaînait scrape+generate
      // dans la même Lambda → timeout 90s parfois dépassé.
      let body: Record<string, unknown>
      if (inputMode === 'url') {
        // Phase 1 — scrape isolé (jusqu'à 85s côté serveur)
        const scrapeRes = await fetch('/api/scrape', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url }),
        })
        const scrapeJson = await scrapeRes.json()

        if (!scrapeRes.ok) {
          // Erreur scrape (401, 403, 500…) → bascule manuel avec message clair
          setInputMode('manual')
          setStep(1)
          setMode('wizard')
          setError(scrapeJson.error || 'Impossible de scraper cette URL — utilise la saisie manuelle.')
          return
        }

        const scraped = scrapeJson.data as {
          title?: string
          description?: string
          price?: string | null
          original_price?: string | null
          images?: string[]
          rating?: number | null
          reviews_count?: number | null
        }

        // Validation : sans titre OU sans image, DeepSeek va halluciner.
        // On bascule l'user en saisie manuelle pré-remplie comme avant.
        const titleOk  = !!scraped.title && scraped.title.trim().length >= 3
        const imagesOk = Array.isArray(scraped.images) && scraped.images.length >= 1
        if (!titleOk || !imagesOk) {
          setInputMode('manual')
          setManual(prev => ({
            ...prev,
            product_name: scraped.title || prev.product_name,
            subtitle:     scraped.description?.slice(0, 200) || prev.subtitle,
            price:        scraped.price || prev.price,
          }))
          if (Array.isArray(scraped.images) && scraped.images.length > 0) {
            setUploadedPhotos(prev => [...scraped.images!, ...prev])
          }
          setStep(1)
          setMode('wizard')
          setError(scrapeJson.warning || `Scraping insuffisant — ${!titleOk ? 'le titre n\'a pas pu être extrait' : 'aucune image produit récupérée'}. Complète manuellement.`)
          return
        }

        // Phase 2 — generate avec le product déjà scrapé.
        // /api/generate accepte body.product (skip scrape côté serveur).
        body = {
          product: { ...scraped, tone: selectedTone },
          style: selectedStyle,
          ugcVideos: ugcVideos.length > 0 ? '[vidéos uploadées]' : ugcLinks.filter(l => l.trim()),
          beforeAfter: beforePhotos.length > 0 && afterPhotos.length > 0,
          language: resultLang,
          tone: selectedTone,
        }
      } else {
        body = {
          product: {
            ...manual,
            benefits: [],
            faq: [],
            urgency: '',
            images: uploadedPhotos,
            tone: selectedTone,
          },
          ugcVideos: ugcVideos.length > 0 ? '[vidéos uploadées]' : ugcLinks.filter(l => l.trim()),
          beforeAfter: beforePhotos.length > 0 && afterPhotos.length > 0,
          language: resultLang,
        }
      }

      // ── Path V3 — quand l'user a choisi un style V3 sur l'étape 5/8 ──
      // L'engine V3 (AI SDK + Zod + 13 sections + renderPageV3) prend la main.
      // styleId = slug V3 direct (ex: 'apple-clean'), tone mappé vers les
      // 5 tones V3 via LEGACY_TONE_TO_V3, images du wizard transmises.
      // brand = nom de marque user (string vide → DeepSeek invente un nom).
      if (styleMode === 'v3') {
        body = {
          ...body,
          engine: 'v3',
          styleId: selectedStyle,
          tone: LEGACY_TONE_TO_V3[selectedTone] || 'friendly',
          images: uploadedPhotos.length > 0 ? uploadedPhotos : undefined,
          brand: brand.trim() || undefined,
        }
      }

      const res  = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      const json = await res.json()

      // Scraping insuffisant (titre vide, 0 image) : on bascule l'user en
      // saisie manuelle pré-remplie au lieu de lui balancer une erreur sèche.
      if (!res.ok && res.status === 422 && json.needsManualInput) {
        const partial = json.partialData || {}
        setInputMode('manual')
        setManual(prev => ({
          ...prev,
          product_name: partial.title || prev.product_name,
          subtitle:     partial.description?.slice(0, 200) || prev.subtitle,
          price:        partial.price || prev.price,
        }))
        if (Array.isArray(partial.images) && partial.images.length > 0) {
          setUploadedPhotos(prev => [...partial.images, ...prev])
        }
        setStep(1)
        setMode('wizard')
        setError(json.error)
        return
      }

      if (!res.ok) throw new Error(json.error)

      // ── Path V3 — engine V3 a retourné { html, data, engine: 'v3' } ────────
      // Skip renderTemplate côté client : l'HTML est déjà rendu serveur via
      // renderPageV3 avec les 13 sections Allbirds-grade. Skip aussi le mismatch
      // product_type qui est un check legacy (V3 n'a pas la notion de "themed").
      if (json.engine === 'v3') {
        const v3Html = json.html as string
        const v3Data = json.data as { product?: { title?: string }; images?: string[] } | null
        setHtml(v3Html)
        setLandingData(v3Data as unknown as LandingPageData)
        const v3Title = v3Data?.product?.title || 'Nouvelle page'
        setTitle(v3Title)
        track.generateCompleted('dashboard', Date.now() - startedAt)
        track.pageGenerated('dashboard')
        setMode('editor')
        if (json.partial) {
          setPartialWarning(json.warning
            ? `Scrape partiel : ${json.warning}. Vérifie le titre, le prix et les images avant de publier.`
            : 'Scrape partiel — vérifie le titre, le prix et les images avant de publier.')
        } else {
          setPartialWarning(null)
        }
        // Autosave V3 — même logique que legacy, json_content tag _engine='v3'
        if (!pageId) {
          try {
            const supabase = createClient()
            const { data: { user } } = await supabase.auth.getUser()
            if (user) {
              const jsonWithSlug = { ...(v3Data as object), _template_slug: selectedStyle, _engine: 'v3' }
              const { data: inserted, error: insertErr } = await supabase
                .from('pages')
                .insert({
                  user_id:      user.id,
                  title:        v3Title,
                  product_url:  inputMode === 'url' ? url : null,
                  html_content: v3Html,
                  json_content: jsonWithSlug,
                  status:       'draft',
                })
                .select('id')
                .single()
              if (!insertErr && inserted?.id) {
                setPageId(inserted.id)
                window.history.replaceState(null, '', `/dashboard/new?page_id=${inserted.id}`)
              } else if (insertErr) {
                console.warn('[autosave-v3] insert failed', insertErr.message)
              }
            }
          } catch (autosaveErr) {
            console.warn('[autosave-v3]', autosaveErr)
          }
        }
        return
      }

      const data: LandingPageData = json.data

      // Mismatch produit ↔ template : si le template sélectionné est "themed"
      // (skincare, jewelry, tech…) et qu'on détecte un type différent dans le
      // produit, on warn. Empêche de générer un blender sur velvety.
      //
      // Priorité 1 : data.product_type vient du mini-call DeepSeek (classifier
      // sémantique multilingue, bien meilleur que keywords).
      // Priorité 2 : fallback detectProductType keyword-based (compat anciennes
      // pages générées sans le mini-call, ou en cas d'échec du mini-call).
      const tplMeta = TEMPLATES.find(t => t.id === selectedStyle)
      const llmType = (data.product_type && data.product_type !== 'universal')
        ? (data.product_type as ProductType)
        : null
      const detected = llmType ?? detectProductType({
        title: data.product_name,
        description: `${data.headline || ''} ${data.subtitle || ''} ${(data.benefits || []).join(' ')}`,
      })

      // PostHog : on track la qualité du cleaning pour suivre les drift en prod
      // (ex: trop de fallback, mauvaises classifications, latence anormale).
      track.productNameCleaned({
        language: data.language || 'fr',
        product_type: data.product_type || null,
        category: data.category || null,
        used_llm: !!data.product_type,
      })

      const mismatch = !!(tplMeta?.themed && detected && detected !== tplMeta.productType)

      // Mode dégradé : le scrape a marché mais incomplètement. On laisse
      // passer la génération et on affiche un bandeau warning au-dessus de
      // l'éditeur pour que l'user vérifie/complète avant de publier.
      if (mismatch && tplMeta) {
        const tplLabel = PRODUCT_TYPE_LABELS[tplMeta.productType]
        // On préfère le label friendly du LLM (data.category) s'il existe —
        // ex: "Lingerie" est plus précis que "Mode · Vêtements" pour une bralette.
        const detectedLabel = data.category && llmType
          ? data.category
          : PRODUCT_TYPE_LABELS[detected as ProductType]
        setPartialWarning(
          `Template incompatible : "${tplMeta.name}" est conçu pour ${tplLabel}, ton produit ressemble plutôt à ${detectedLabel}. Le rendu peut afficher du contenu hors-sujet — change de template (Blue, Solo, Starter, Hue, Ella sont universels).`
        )
      } else if (json.partial) {
        setPartialWarning(
          json.warning
            ? `Scrape partiel : ${json.warning}. Vérifie le titre, le prix et les images avant de publier.`
            : 'Scrape partiel — vérifie le titre, le prix et les images avant de publier.'
        )
      } else {
        setPartialWarning(null)
      }

      if (uploadedPhotos.length > 0) {
        data.images = [...uploadedPhotos, ...(data.images || [])]
      }
      track.generateCompleted('dashboard', Date.now() - startedAt)
      track.pageGenerated('dashboard')
      setLandingData(data)
      const pageTitle = data.product_name || 'Nouvelle page'
      setTitle(pageTitle)

      const { renderTemplate } = await import('@/lib/templates')
      const generatedHtml = renderTemplate(selectedStyle, data)
      setHtml(generatedHtml)
      setMode('editor')

      // Autosave silencieux : si pas encore de pageId (nouvelle page),
      // on crée la draft en DB tout de suite. Sans ça, le bouton Publier
      // est caché tant que l'user n'a pas cliqué Save manuellement —
      // énorme friction à la conversion (cf bug #10 audit lancement).
      if (!pageId) {
        try {
          const supabase = createClient()
          const { data: { user } } = await supabase.auth.getUser()
          if (user) {
            // template_id (uuid FK) reste null ; on stocke le slug dans json
            const jsonWithSlug = { ...data, _template_slug: selectedStyle }
            const { data: inserted, error: insertErr } = await supabase
              .from('pages')
              .insert({
                user_id:      user.id,
                title:        pageTitle,
                product_url:  inputMode === 'url' ? url : null,
                html_content: generatedHtml,
                json_content: jsonWithSlug,
                status:       'draft',
              })
              .select('id')
              .single()
            if (!insertErr && inserted?.id) {
              setPageId(inserted.id)
              // Met à jour l'URL pour que F5 recharge bien la page
              window.history.replaceState(null, '', `/dashboard/new?page_id=${inserted.id}`)
            } else if (insertErr) {
              console.warn('[autosave] insert failed', insertErr.message)
            }
          }
        } catch (autosaveErr) {
          // Non bloquant : l'user pourra toujours Save manuellement
          console.warn('[autosave]', autosaveErr)
        }
      }
    } catch (err) {
      const reason = err instanceof Error ? err.message : 'Erreur'
      track.generateFailed('dashboard', reason)
      setError(reason)
      setMode('wizard')
    }
  }

  async function savePage(savedHtml: string) {
    setSaving(true)
    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Non authentifié')

      // template_id est un UUID FK vers public.templates — on n'y met PAS
      // le slug 'etec-blue' (sinon Postgres rejette). Le slug est conservé
      // dans json_content._template_slug pour la réouverture (cf F5).
      const jsonWithSlug = landingData
        ? { ...landingData, _template_slug: selectedStyle }
        : { _template_slug: selectedStyle }

      if (pageId) {
        // Mode édition — mise à jour de la page existante
        const { error: updateErr } = await supabase.from('pages').update({
          title:        title || 'Nouvelle page',
          html_content: savedHtml,
          json_content: jsonWithSlug,
        }).eq('id', pageId)
        if (updateErr) throw new Error(`Sauvegarde echouee : ${updateErr.message}`)
      } else {
        // Nouvelle page — on capture l'id pour pouvoir re-sauver
        const { data: inserted, error: insertErr } = await supabase
          .from('pages')
          .insert({
            user_id:      user.id,
            title:        title || 'Nouvelle page',
            product_url:  inputMode === 'url' ? url : null,
            html_content: savedHtml,
            json_content: jsonWithSlug,
            status:       'draft',
          })
          .select('id')
          .single()
        if (insertErr) throw new Error(`Sauvegarde echouee : ${insertErr.message}`)
        if (inserted?.id) setPageId(inserted.id)
      }
      router.push('/dashboard/pages')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur sauvegarde')
    } finally {
      setSaving(false)
    }
  }

  function changeTemplate(id: string) {
    setSelectedStyle(id)
    // Styles V3 (soft, editorial, apple-clean, etc.) ne sont pas rendus
    // côté client : renderPageV3 vit en serveur. L'user doit re-générer
    // (clic sur Régénérer) — preview du nouveau style impossible inline.
    const isV3Style = V3_STYLES.some(s => s.id === id)
    if (isV3Style) {
      setError('Style V3 sélectionné. Pour appliquer le rendu, regénère la page (l\'éditeur ne preview pas les V3 inline).')
      return
    }
    if (landingData) {
      import('@/lib/templates').then(({ renderTemplate }) => {
        setHtml(renderTemplate(id, landingData))
      })
    }
  }

  // ── Chargement page existante ──
  if (loadingPage) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4" style={{ minHeight: '60vh' }}>
        <Loader2 className="w-8 h-8 animate-spin" style={{ color: '#7c3aed' }} />
        <p className="text-[14px] font-semibold" style={{ color: '#5c5c7a' }}>Chargement de la page...</p>
      </div>
    )
  }

  // ── Vue éditeur ──
  if (mode === 'editor') {
    return (
      <div className="flex flex-col h-full">
        <div className="h-14 flex items-center justify-between px-4 border-b bg-white flex-shrink-0" style={{ borderColor: '#E3E3E8' }}>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMode('wizard')}
              className="flex items-center gap-1.5 text-[13px] font-medium transition-colors"
              style={{ color: '#8b8b9e' }}
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Retour
            </button>
            <div className="w-px h-4 bg-gray-200" />
            <input
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="text-[13px] font-bold bg-transparent focus:outline-none border-b border-transparent focus:border-purple-400"
              style={{ color: '#1a1a2e' }}
              placeholder="Titre de la page"
            />
          </div>
          <div className="flex items-center gap-2">
            <div className="flex gap-1">
              {TEMPLATES.map(t => (
                <button key={t.id} onClick={() => changeTemplate(t.id)}
                  className="text-[12px] px-2.5 py-1 rounded-lg font-semibold transition-all"
                  style={selectedStyle === t.id
                    ? { background: '#7c3aed', color: '#fff' }
                    : { color: '#5c5c7a', background: '#F6F6F7' }
                  }
                >
                  {t.name}
                </button>
              ))}
            </div>

            {/* Bouton Publier */}
            {stores.length > 0 && pageId && (
              <div className="relative">
                <button
                  onClick={() => setPublishOpen(o => !o)}
                  className="flex items-center gap-1.5 text-[12px] font-bold px-3 py-1.5 rounded-lg transition-all"
                  style={{ background: 'linear-gradient(135deg, #7c3aed, #6d28d9)', color: '#fff' }}
                >
                  <Send className="w-3.5 h-3.5" />
                  Publier
                  <ChevronDown className="w-3 h-3" />
                </button>
                {publishOpen && (
                  <div
                    className="absolute top-9 right-0 rounded-xl overflow-hidden z-50 min-w-[200px]"
                    style={{ background: '#fff', border: '1px solid #e5e7eb', boxShadow: '0 8px 24px rgba(0,0,0,0.12)' }}
                  >
                    <div className="px-3 py-2 text-[11px] font-bold uppercase tracking-wide" style={{ color: '#9ca3af', borderBottom: '1px solid #f3f4f6' }}>
                      Choisir un store
                    </div>
                    {stores.map(store => {
                      const isShopify = store.platform === 'shopify'
                      const isYouCan  = store.platform === 'youcan'
                      const color     = isShopify ? '#16a34a' : isYouCan ? '#f97316' : '#7c3aed'
                      const icon      = isShopify ? '🟢' : isYouCan ? '🟠' : '🟣'
                      return (
                        <button
                          key={store.id}
                          onClick={() => publishToStore(store)}
                          disabled={!!publishing}
                          className="w-full flex items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-gray-50 disabled:opacity-50"
                        >
                          <span>{icon}</span>
                          <div className="flex-1 min-w-0">
                            <div className="text-[13px] font-bold truncate" style={{ color: '#111' }}>{store.name}</div>
                            <div className="text-[11px] font-semibold capitalize" style={{ color }}>{store.platform}</div>
                          </div>
                          {publishing === store.id && <Loader2 className="w-3.5 h-3.5 animate-spin" style={{ color }} />}
                        </button>
                      )
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        <div className="flex-1 overflow-hidden">
          {process.env.NEXT_PUBLIC_KONVERT_NEW_EDITOR === 'true' ? (
            <EditorRoot
              jsonContent={
                landingData
                  ? { ...landingData, _template_slug: selectedStyle }
                  : undefined
              }
              defaultTemplateId={selectedStyle}
              staticHtml={html}
              onSave={async (savedHtml) => {
                // savePage gere son propre assemblage du json_content.
                // Le jsonForDb du nouvel editeur sera utilise en C2+.
                await savePage(savedHtml)
              }}
              saving={saving}
            />
          ) : (
            <BuilderLoader html={html} onSave={savePage} />
          )}
        </div>
        {error && (
          <div className="fixed bottom-4 right-4 bg-red-50 border border-red-200 text-red-700 rounded-xl p-3 text-sm">
            {error}
          </div>
        )}
        {partialWarning && (
          <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 max-w-xl bg-amber-50 border border-amber-200 text-amber-900 rounded-xl px-4 py-3 text-sm shadow-lg flex items-start gap-2">
            <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <span className="flex-1">{partialWarning}</span>
            <button onClick={() => setPartialWarning(null)} className="text-amber-600 hover:text-amber-900" aria-label="Fermer">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
        {saving && (
          <div className="fixed bottom-4 right-4 bg-white border border-gray-200 rounded-xl p-3 text-sm flex items-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin text-purple-600" />
            Sauvegarde...
          </div>
        )}
        {publishSuccess && (
          <div
            className="fixed bottom-4 right-4 flex items-start gap-3 rounded-xl px-4 py-3 text-sm max-w-sm shadow-lg"
            style={{ background: '#fff', border: '1px solid rgba(22,163,74,0.3)', color: '#166534' }}
          >
            <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#16a34a' }} />
            <div className="flex-1">
              <div className="font-bold mb-0.5">Publié sur {publishSuccess.name} !</div>
              {publishSuccess.url ? (
                <a
                  href={publishSuccess.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-semibold underline"
                  style={{ color: '#16a34a' }}
                >
                  Voir la page publiée
                  <ChevronRight className="w-3 h-3" />
                </a>
              ) : (
                <span className="text-xs" style={{ color: '#6b7280' }}>Disponible dans ton admin store</span>
              )}
            </div>
            <button
              onClick={() => setPublishSuccess(null)}
              className="flex-shrink-0 transition-opacity hover:opacity-70"
              style={{ color: '#9ca3af' }}
              aria-label="Fermer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
        {publishError && (
          <div
            className="fixed bottom-4 right-4 flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold"
            style={{ background: 'rgba(220,38,38,0.08)', border: '1px solid rgba(220,38,38,0.2)', color: '#dc2626' }}
            onClick={() => setPublishError(null)}
          >
            <AlertCircle className="w-4 h-4" />
            {publishError}
          </div>
        )}
        {publishOpen && <div className="fixed inset-0 z-40" onClick={() => setPublishOpen(false)} />}
      </div>
    )
  }

  // ── Vue génération ──
  if (mode === 'generating') {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6" style={{ background: 'linear-gradient(135deg, #7c3aed, #6d28d9)' }}>
            <Sparkles className="w-8 h-8 text-white animate-pulse" />
          </div>
          <h2 className="text-xl font-black mb-2" style={{ color: '#1a1a2e' }}>Génération en cours...</h2>
          <p className="text-[13px] mb-8" style={{ color: '#8b8b9e' }}>L'IA crée ta page produit premium</p>
          <div className="w-64 mx-auto space-y-3">
            {['Analyse du produit', 'Rédaction du copy', 'Application du design', 'Optimisation conversion'].map((item) => (
              <div key={item} className="flex items-center gap-3 text-[13px]" style={{ color: '#5c5c7a' }}>
                <div className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: '#f3f0ff' }}>
                  <Loader2 className="w-2.5 h-2.5 text-purple-600 animate-spin" />
                </div>
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // ── Wizard ──
  const STEP_LABELS = ['Source', 'Photos', 'Vidéos', 'Avant/Après', 'Style', 'Plateforme', 'Langue', 'Lancer']
  const canProceed  = step === 1
    ? (inputMode === 'url' ? isValidHttpUrl(url) : manual.product_name.trim().length > 0)
    : true

  const progressPct = ((step - 1) / 7) * 100
  const nextLabel   = step < 8 ? STEP_LABELS[step] : null

  return (
    <div className="min-h-full" style={{ background: '#F6F6F7' }}>
      {/* Header */}
      <div className="bg-white border-b px-6 py-4" style={{ borderColor: '#E3E3E8' }}>
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <Link href="/dashboard" className="flex items-center gap-1.5 text-[13px] font-medium" style={{ color: '#8b8b9e' }}>
              <ArrowLeft className="w-3.5 h-3.5" /> Dashboard
            </Link>
            <ChevronRight className="w-3.5 h-3.5" style={{ color: '#c4c4d0' }} />
            <span className="text-[13px] font-bold" style={{ color: '#1a1a2e' }}>Nouvelle page</span>
          </div>

          {/* Progress bar */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[13px] font-bold" style={{ color: '#1a1a2e' }}>
                Étape {step}/8 — {STEP_LABELS[step - 1]}
              </span>
              {nextLabel && (
                <span className="text-[12px]" style={{ color: '#8b8b9e' }}>
                  Suivant : {nextLabel}
                </span>
              )}
            </div>
            <div className="h-2 rounded-full overflow-hidden" style={{ background: '#e8e8f0' }}>
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{ width: `${progressPct}%`, background: '#5B47F5' }}
              />
            </div>
          </div>

          <StepIndicator current={step} total={8} labels={STEP_LABELS} />
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-8">

        {/* ── STEP 1 : Source ── */}
        {step === 1 && (
          <div>
            <h1 className="text-2xl font-black mb-1" style={{ color: '#1a1a2e' }}>Source du produit</h1>
            <p className="text-[14px] mb-6" style={{ color: '#8b8b9e' }}>D'où vient le produit que tu veux mettre en avant ?</p>

            {/* Toggle */}
            <div className="flex gap-3 mb-6">
              {[
                { id: 'url',    label: 'URL produit',    icon: Link2,  desc: 'AliExpress, Amazon, Shopify, Etsy, eBay…' },
                { id: 'manual', label: 'Saisie manuelle', icon: Pencil, desc: 'Entre les infos du produit à la main'          },
              ].map(({ id, label, icon: Icon, desc }) => (
                <button
                  key={id}
                  onClick={() => setInputMode(id as InputMode)}
                  className="flex-1 p-4 rounded-xl text-left border-2 transition-all"
                  style={inputMode === id
                    ? { borderColor: '#7c3aed', background: '#faf9ff' }
                    : { borderColor: '#E3E3E8', background: '#fff' }
                  }
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Icon className="w-4 h-4" style={{ color: inputMode === id ? '#7c3aed' : '#5c5c7a' }} />
                    <span className="text-[13px] font-bold" style={{ color: inputMode === id ? '#7c3aed' : '#1a1a2e' }}>{label}</span>
                  </div>
                  <p className="text-[12px]" style={{ color: '#8b8b9e' }}>{desc}</p>
                </button>
              ))}
            </div>

            {inputMode === 'url' ? (
              <div>
                <label className="block text-[13px] font-bold mb-1.5" style={{ color: '#1a1a2e' }}>URL du produit</label>
                <input
                  type="url"
                  value={url}
                  onChange={e => setUrl(e.target.value)}
                  placeholder="https://aliexpress.com/item/... ou ton-store.myshopify.com/products/..."
                  className="w-full border rounded-xl px-4 py-3 text-[13px] outline-none transition-all"
                  style={{ borderColor: url ? '#7c3aed' : '#E3E3E8', background: '#fff', color: '#1a1a2e' }}
                />
                <p className="text-[12px] mt-1.5" style={{ color: '#8b8b9e' }}>Compatible AliExpress, Amazon, Alibaba, Shopify (.myshopify.com), Etsy, eBay, Cdiscount, Fnac, Temu</p>
              </div>
            ) : (
              <div className="space-y-3">
                {[
                  { key: 'product_name',   label: 'Nom du produit *',         placeholder: 'Montre connectée sport Pro X'                 },
                  { key: 'headline',       label: 'Accroche principale',       placeholder: 'Transforme ta routine fitness en 1 geste'     },
                  { key: 'subtitle',       label: 'Sous-titre',                placeholder: 'GPS intégré, 7 jours d\'autonomie, waterproof' },
                  { key: 'price',          label: 'Prix de vente',             placeholder: '49,99€'                                       },
                  { key: 'original_price', label: 'Prix barré (optionnel)',    placeholder: '89,99€'                                       },
                  { key: 'cta',            label: 'Texte du bouton CTA',       placeholder: 'Commander maintenant'                         },
                ].map(({ key, label, placeholder }) => (
                  <div key={key}>
                    <label className="block text-[13px] font-bold mb-1" style={{ color: '#1a1a2e' }}>{label}</label>
                    <input
                      value={manual[key as keyof typeof manual]}
                      onChange={e => setManual({ ...manual, [key]: e.target.value })}
                      placeholder={placeholder}
                      className="w-full border rounded-xl px-4 py-2.5 text-[13px] outline-none transition-all"
                      style={{ borderColor: '#E3E3E8', background: '#fff', color: '#1a1a2e' }}
                      onFocus={e => (e.target.style.borderColor = '#7c3aed')}
                      onBlur={e  => (e.target.style.borderColor = '#E3E3E8')}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── STEP 2 : Photos produit ── */}
        {step === 2 && (
          <div>
            <h1 className="text-2xl font-black mb-1" style={{ color: '#1a1a2e' }}>Tes photos produit</h1>
            <p className="text-[14px] mb-5" style={{ color: '#8b8b9e' }}>Tu as déjà des photos ? Uploade-les pour les intégrer directement dans ta page.</p>

            {/* Drop zone — compact si photos uploadées, plein si vide */}
            {uploadedPhotos.length === 0 ? (
              <div
                className="border-2 border-dashed rounded-2xl text-center cursor-pointer transition-all"
                style={{ borderColor: '#c4b5fd', background: '#faf9ff', padding: '36px 24px' }}
                onClick={() => fileInputRef.current?.click()}
                onMouseEnter={e => {
                  const el = e.currentTarget
                  el.style.borderColor = '#a78bfa'
                  el.style.boxShadow = '0 4px 16px rgba(124,58,237,0.08)'
                  el.style.transform = 'translateY(-1px)'
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget
                  el.style.borderColor = '#c4b5fd'
                  el.style.boxShadow = 'none'
                  el.style.transform = 'translateY(0)'
                }}
              >
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3" style={{ background: '#f3f0ff' }}>
                  <Upload className="w-[22px] h-[22px]" style={{ color: '#7c3aed' }} />
                </div>
                <p className="font-bold text-[14px] mb-1" style={{ color: '#1a1a2e' }}>Glisse tes photos ici</p>
                <p className="text-[12px]" style={{ color: '#8b8b9e' }}>ou clique pour sélectionner · JPG, PNG, WEBP · max 5 photos</p>
                <span className="block text-[11px] font-semibold mt-2" style={{ color: '#a78bfa' }}>
                  {uploadedPhotos.length} / 5 photos
                </span>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={handlePhotoUpload}
                />
              </div>
            ) : (
              /* Mode compact quand des photos sont déjà uploadées */
              <div
                className="border-2 border-dashed rounded-2xl cursor-pointer transition-all mb-4"
                style={{ borderColor: '#c4b5fd', background: '#faf9ff', padding: '16px 20px' }}
                onClick={() => fileInputRef.current?.click()}
                onMouseEnter={e => {
                  const el = e.currentTarget
                  el.style.borderColor = '#a78bfa'
                  el.style.boxShadow = '0 4px 16px rgba(124,58,237,0.08)'
                  el.style.transform = 'translateY(-1px)'
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget
                  el.style.borderColor = '#c4b5fd'
                  el.style.boxShadow = 'none'
                  el.style.transform = 'translateY(0)'
                }}
              >
                <div className="flex items-center gap-3 justify-center">
                  <div className="flex-shrink-0 flex items-center justify-center rounded-[10px]" style={{ width: 36, height: 36, background: '#f3f0ff' }}>
                    <Upload className="w-[18px] h-[18px]" style={{ color: '#7c3aed' }} />
                  </div>
                  <div className="text-left">
                    <p className="text-[13px] font-bold mb-0.5" style={{ color: '#1a1a2e' }}>Ajouter d'autres photos</p>
                    <p className="text-[11.5px]" style={{ color: '#8b8b9e' }}>JPG, PNG, WEBP · max 5 photos</p>
                  </div>
                  <span className="ml-auto text-[11px] font-semibold flex-shrink-0" style={{ color: '#a78bfa' }}>
                    {uploadedPhotos.length} / 5 photos
                  </span>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={handlePhotoUpload}
                />
              </div>
            )}

            {/* Grid photos + slot "+" */}
            {uploadedPhotos.length > 0 && (
              <div className="grid grid-cols-4 gap-3 mt-4">
                {uploadedPhotos.map((photo, i) => (
                  <div key={i} className="relative aspect-square rounded-xl overflow-hidden" style={{ border: '1px solid #e9e5ff' }}>
                    <img src={photo} alt={`Photo ${i + 1}`} className="w-full h-full object-cover" />
                    <button
                      onClick={() => removePhoto(i)}
                      className="absolute top-1.5 right-1.5 flex items-center justify-center rounded-[6px]"
                      style={{ width: 22, height: 22, background: 'rgba(15,10,30,0.65)', backdropFilter: 'blur(4px)' }}
                    >
                      <X className="w-[11px] h-[11px] text-white" strokeWidth={2.5} />
                    </button>
                  </div>
                ))}
                {/* Slot "+" pour ajouter une photo si < 5 */}
                {uploadedPhotos.length < 5 && (
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="aspect-square rounded-xl flex items-center justify-center transition-all"
                    style={{ border: '2px dashed #ddd6fe', background: '#faf9ff' }}
                    onMouseEnter={e => {
                      e.currentTarget.style.borderColor = '#a78bfa'
                      e.currentTarget.style.background = '#f3f0ff'
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.borderColor = '#ddd6fe'
                      e.currentTarget.style.background = '#faf9ff'
                    }}
                  >
                    <Plus className="w-5 h-5" style={{ color: '#c4b5fd' }} strokeWidth={2} />
                  </button>
                )}
              </div>
            )}

            {/* Tip vert success — toujours visible (fallback IA info fonctionnelle) */}
            <div className="flex items-start gap-2 p-3 rounded-xl mt-4" style={{ background: '#f0fdf4', border: '1px solid #bbf7d0' }}>
              <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: '#16a34a' }} />
              <p className="text-[12px]" style={{ color: '#15803d' }}>Sans photo, l'IA utilisera automatiquement les images scrappées depuis l'URL produit.</p>
            </div>

            <button
              onClick={() => setStep(s => s + 1)}
              className="mt-4 text-[12px] font-medium w-full text-center py-2 rounded-xl transition-all"
              style={{ color: '#8b8b9e', background: 'transparent' }}
            >
              Passer cette étape
            </button>
          </div>
        )}

        {/* ── STEP 3 : Vidéos UGC — Premium Minimal ── */}
        {step === 3 && (
          <div>
            <h1 className="text-2xl font-black mb-1" style={{ color: '#1a1a2e' }}>Vidéos UGC</h1>
            <p className="text-[14px] mb-5" style={{ color: '#8b8b9e' }}>Ajoute des vidéos clients, unboxing ou reviews pour booster la confiance.</p>

            {/* Tabs upload / liens — segmented toggle */}
            <div className="flex gap-1 p-1 rounded-xl mb-5" style={{ background: '#faf9ff', border: '1px solid #ede9fe', width: 'fit-content' }}>
              {['Upload', 'Liens externes'].map((tab, i) => (
                <button
                  key={tab}
                  onClick={() => setUgcTab(i)}
                  className="px-4 py-2 rounded-lg text-[13px] font-bold transition-all"
                  style={ugcTab === i
                    ? { background: '#7c3aed', color: '#fff', boxShadow: '0 1px 2px rgba(124,58,237,0.15)' }
                    : { background: 'transparent', color: '#5c5c7a' }
                  }
                >
                  {tab}
                </button>
              ))}
            </div>

            {ugcTab === 0 ? (
              <div>
                <div
                  className="border-2 border-dashed rounded-2xl text-center cursor-pointer transition-all mb-4"
                  style={{ borderColor: '#c4b5fd', background: '#faf9ff', padding: '32px 24px' }}
                  onClick={() => videoInputRef.current?.click()}
                  onMouseEnter={e => {
                    const el = e.currentTarget
                    el.style.borderColor = '#a78bfa'
                    el.style.boxShadow = '0 4px 16px rgba(124,58,237,0.08)'
                    el.style.transform = 'translateY(-1px)'
                  }}
                  onMouseLeave={e => {
                    const el = e.currentTarget
                    el.style.borderColor = '#c4b5fd'
                    el.style.boxShadow = 'none'
                    el.style.transform = 'translateY(0)'
                  }}
                >
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3" style={{ background: '#f3f0ff' }}>
                    <Video className="w-[22px] h-[22px]" style={{ color: '#7c3aed' }} />
                  </div>
                  <p className="font-bold text-[14px] mb-1" style={{ color: '#1a1a2e' }}>Glisse tes vidéos ici</p>
                  <p className="text-[12px]" style={{ color: '#8b8b9e' }}>MP4, MOV, AVI · max 100MB par vidéo</p>
                  <input ref={videoInputRef} type="file" accept="video/*" multiple className="hidden" onChange={handleVideoUpload} />
                </div>
                {ugcVideos.length > 0 && (
                  <div className="space-y-2">
                    {ugcVideos.map((_, i) => (
                      <div key={i} className="flex items-center gap-3 p-3 rounded-xl transition-all" style={{ background: '#f8f8fc', border: '1px solid #e9e5ff' }}>
                        <div className="flex-shrink-0 flex items-center justify-center rounded-lg" style={{ width: 40, height: 40, background: '#ede9fe' }}>
                          <Film className="w-[18px] h-[18px]" style={{ color: '#7c3aed' }} />
                        </div>
                        <span className="flex-1 text-[13px] font-medium truncate" style={{ color: '#1a1a2e' }}>Vidéo {i + 1}</span>
                        <button
                          onClick={() => setUgcVideos(prev => prev.filter((__, j) => j !== i))}
                          className="flex items-center justify-center rounded-full transition-all"
                          style={{ width: 28, height: 28, background: '#fef2f2' }}
                          onMouseEnter={e => (e.currentTarget.style.background = '#fee2e2')}
                          onMouseLeave={e => (e.currentTarget.style.background = '#fef2f2')}
                        >
                          <X className="w-[14px] h-[14px]" style={{ color: '#dc2626' }} strokeWidth={2.5} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div>
                {ugcLinks.map((link, i) => {
                  const lower = link.toLowerCase()
                  const isTikTok = lower.includes('tiktok.com')
                  const isYoutube = lower.includes('youtube.com') || lower.includes('youtu.be')
                  const PlatformIcon = isTikTok ? Music2 : isYoutube ? Film : Link2
                  return (
                    <div key={i} className="flex gap-2 mb-2">
                      <div className="flex-1 flex items-center gap-2 rounded-xl px-3" style={{ background: '#fff', border: '1px solid #E3E3E8' }}>
                        <div className="flex-shrink-0 flex items-center justify-center rounded-md" style={{ width: 26, height: 26, background: '#f3f0ff' }}>
                          <PlatformIcon className="w-[14px] h-[14px]" style={{ color: '#7c3aed' }} />
                        </div>
                        <input
                          value={link}
                          onChange={e => { const n = [...ugcLinks]; n[i] = e.target.value; setUgcLinks(n) }}
                          placeholder="https://youtube.com/... ou tiktok.com/..."
                          className="flex-1 py-2.5 text-[13px] outline-none bg-transparent"
                          style={{ color: '#1a1a2e' }}
                        />
                      </div>
                      {ugcLinks.length > 1 && (
                        <button
                          onClick={() => setUgcLinks(prev => prev.filter((_, j) => j !== i))}
                          className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-all"
                          style={{ background: '#fef2f2' }}
                          onMouseEnter={e => (e.currentTarget.style.background = '#fee2e2')}
                          onMouseLeave={e => (e.currentTarget.style.background = '#fef2f2')}
                        >
                          <X className="w-4 h-4" style={{ color: '#dc2626' }} strokeWidth={2.5} />
                        </button>
                      )}
                    </div>
                  )
                })}
                <button
                  onClick={() => setUgcLinks(prev => [...prev, ''])}
                  className="text-[13px] font-semibold flex items-center gap-1.5 mt-2 transition-all"
                  style={{ color: '#7c3aed' }}
                  onMouseEnter={e => (e.currentTarget.style.opacity = '0.75')}
                  onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
                >
                  <Plus className="w-4 h-4" strokeWidth={2.5} /> Ajouter un lien
                </button>
              </div>
            )}

            {/* Tip violet — conseil éducatif (cohérence wizard) */}
            <div className="mt-5 p-3 rounded-xl flex items-start gap-2.5" style={{ background: '#faf9ff', border: '1px solid #ddd6fe' }}>
              <TrendingUp className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: '#7c3aed' }} />
              <p className="text-[12px]" style={{ color: '#5b21b6' }}>Les vidéos UGC augmentent les conversions de <strong>+34%</strong> en moyenne. Même une courte vidéo fait la différence.</p>
            </div>

            <button
              onClick={() => setStep(s => s + 1)}
              className="mt-4 text-[12px] font-medium w-full text-center py-2 rounded-xl transition-all"
              style={{ color: '#8b8b9e', background: 'transparent' }}
            >
              Passer cette étape
            </button>
          </div>
        )}

        {/* ── STEP 4 : Photos Avant/Après — Direction A Premium Minimal ── */}
        {step === 4 && (
          <div>
            <h1 className="text-2xl font-black mb-1" style={{ color: '#1a1a2e' }}>Photos Avant / Après</h1>
            <p className="text-[14px] mb-6" style={{ color: '#8b8b9e' }}>Les comparaisons avant/après sont les preuves visuelles les plus persuasives.</p>

            {/* Grid 3 colonnes : Avant | flèche centrale | Après */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 44px 1fr', gap: 0, alignItems: 'start' }}>

              {/* ── Col AVANT ── */}
              <div>
                {/* Header colonne */}
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-[11px] font-black tracking-widest" style={{ color: '#7c3aed', fontVariantNumeric: 'tabular-nums' }}>01</span>
                  <div className="flex-1" style={{ height: '1px', background: '#f0ecff' }} />
                  <span className="text-[13px] font-bold" style={{ color: '#1a1a2e' }}>Avant</span>
                </div>

                {/* Dropzone AVANT */}
                <div
                  className="border-2 border-dashed rounded-2xl cursor-pointer transition-all duration-200 relative overflow-hidden"
                  style={{
                    borderColor: beforePhotos.length > 0 ? '#ddd6fe' : '#c4b5fd',
                    borderStyle: beforePhotos.length > 0 ? 'solid' : 'dashed',
                    background: beforePhotos.length > 0 ? 'transparent' : '#faf9ff',
                    minHeight: '148px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '10px',
                  }}
                  onClick={() => !uploading && beforeInputRef.current?.click()}
                  onMouseEnter={e => {
                    if (beforePhotos.length === 0) {
                      (e.currentTarget as HTMLDivElement).style.borderColor = '#7c3aed'
                      ;(e.currentTarget as HTMLDivElement).style.background = '#f5f1ff'
                      ;(e.currentTarget as HTMLDivElement).style.transform = 'translateY(-1px)'
                      ;(e.currentTarget as HTMLDivElement).style.boxShadow = '0 4px 20px rgba(124,58,237,0.08)'
                    }
                  }}
                  onMouseLeave={e => {
                    if (beforePhotos.length === 0) {
                      (e.currentTarget as HTMLDivElement).style.borderColor = '#c4b5fd'
                      ;(e.currentTarget as HTMLDivElement).style.background = '#faf9ff'
                      ;(e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)'
                      ;(e.currentTarget as HTMLDivElement).style.boxShadow = 'none'
                    }
                  }}
                >
                  {beforePhotos.length === 0 ? (
                    uploading ? (
                      <div className="flex flex-col items-center gap-2">
                        <Loader2 className="w-5 h-5 animate-spin" style={{ color: '#7c3aed' }} />
                        <span className="text-[11px]" style={{ color: '#8b8b9e' }}>Upload en cours...</span>
                      </div>
                    ) : (
                      <>
                        <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: '#f3f0ff' }}>
                          <Camera className="w-5 h-5" style={{ color: '#7c3aed' }} />
                        </div>
                        <span className="text-[13px] font-bold" style={{ color: '#1a1a2e' }}>Uploader la photo avant</span>
                        <span className="text-[11px]" style={{ color: '#8b8b9e' }}>JPG, PNG · max 5MB</span>
                      </>
                    )
                  ) : (
                    <>
                      <img
                        src={beforePhotos[0]}
                        className="w-full object-cover rounded-[14px]"
                        style={{ height: '148px' }}
                        alt="Avant"
                      />
                      {/* Badge overlay */}
                      <div
                        className="absolute top-2 left-2 text-[10px] font-black tracking-wide uppercase px-2 py-1 rounded-md"
                        style={{ background: 'rgba(10,8,20,0.65)', backdropFilter: 'blur(4px)', color: '#e9d5ff' }}
                      >
                        Avant
                      </div>
                      {/* Bouton supprimer */}
                      <button
                        className="absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center transition-opacity"
                        style={{ background: 'rgba(0,0,0,0.6)' }}
                        onClick={e => { e.stopPropagation(); setBeforePhotos([]) }}
                        aria-label="Retirer la photo avant"
                      >
                        <X className="w-3 h-3 text-white" />
                      </button>
                    </>
                  )}
                  <input
                    ref={beforeInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={async e => {
                      const f = e.target.files?.[0]
                      e.target.value = ''
                      if (!f) return
                      setUploading(true)
                      setUploadError(null)
                      try {
                        const url = await uploadOne(f, 'before')
                        if (url) setBeforePhotos([url])
                      } catch (err) {
                        setUploadError(err instanceof Error ? err.message : 'Erreur upload')
                      } finally {
                        setUploading(false)
                      }
                    }}
                  />
                </div>
                {/* Erreur upload sous la dropzone AVANT */}
                {uploadError && beforePhotos.length === 0 && (
                  <p className="text-[11px] mt-1" style={{ color: '#dc2626' }}>{uploadError}</p>
                )}
              </div>

              {/* ── Flèche centrale ── */}
              <div className="flex flex-col items-center justify-center gap-1.5 px-1" style={{ marginTop: '40px' }}>
                <div style={{ width: '1px', height: '28px', background: 'linear-gradient(180deg, transparent, #c4b5fd)' }} />
                <div
                  className="flex items-center justify-center rounded-full"
                  style={{ width: '28px', height: '28px', background: '#f3f0ff', border: '1px solid #ddd6fe', flexShrink: 0 }}
                >
                  <ArrowRight className="w-3 h-3" style={{ color: '#7c3aed' }} />
                </div>
                <div style={{ width: '1px', height: '28px', background: 'linear-gradient(180deg, #c4b5fd, transparent)' }} />
              </div>

              {/* ── Col APRÈS ── */}
              <div>
                {/* Header colonne */}
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-[11px] font-black tracking-widest" style={{ color: '#7c3aed', fontVariantNumeric: 'tabular-nums' }}>02</span>
                  <div className="flex-1" style={{ height: '1px', background: '#f0ecff' }} />
                  <span className="text-[13px] font-bold" style={{ color: '#1a1a2e' }}>Après</span>
                </div>

                {/* Dropzone APRÈS */}
                <div
                  className="border-2 border-dashed rounded-2xl cursor-pointer transition-all duration-200 relative overflow-hidden"
                  style={{
                    borderColor: afterPhotos.length > 0 ? '#ddd6fe' : '#c4b5fd',
                    borderStyle: afterPhotos.length > 0 ? 'solid' : 'dashed',
                    background: afterPhotos.length > 0 ? 'transparent' : '#faf9ff',
                    minHeight: '148px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '10px',
                  }}
                  onClick={() => !uploading && afterInputRef.current?.click()}
                  onMouseEnter={e => {
                    if (afterPhotos.length === 0) {
                      (e.currentTarget as HTMLDivElement).style.borderColor = '#7c3aed'
                      ;(e.currentTarget as HTMLDivElement).style.background = '#f5f1ff'
                      ;(e.currentTarget as HTMLDivElement).style.transform = 'translateY(-1px)'
                      ;(e.currentTarget as HTMLDivElement).style.boxShadow = '0 4px 20px rgba(124,58,237,0.08)'
                    }
                  }}
                  onMouseLeave={e => {
                    if (afterPhotos.length === 0) {
                      (e.currentTarget as HTMLDivElement).style.borderColor = '#c4b5fd'
                      ;(e.currentTarget as HTMLDivElement).style.background = '#faf9ff'
                      ;(e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)'
                      ;(e.currentTarget as HTMLDivElement).style.boxShadow = 'none'
                    }
                  }}
                >
                  {afterPhotos.length === 0 ? (
                    uploading ? (
                      <div className="flex flex-col items-center gap-2">
                        <Loader2 className="w-5 h-5 animate-spin" style={{ color: '#7c3aed' }} />
                        <span className="text-[11px]" style={{ color: '#8b8b9e' }}>Upload en cours...</span>
                      </div>
                    ) : (
                      <>
                        <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: '#f3f0ff' }}>
                          <Sparkles className="w-5 h-5" style={{ color: '#7c3aed' }} />
                        </div>
                        <span className="text-[13px] font-bold" style={{ color: '#1a1a2e' }}>Uploader la photo après</span>
                        <span className="text-[11px]" style={{ color: '#8b8b9e' }}>JPG, PNG · max 5MB</span>
                      </>
                    )
                  ) : (
                    <>
                      <img
                        src={afterPhotos[0]}
                        className="w-full object-cover rounded-[14px]"
                        style={{ height: '148px' }}
                        alt="Après"
                      />
                      {/* Badge overlay */}
                      <div
                        className="absolute top-2 left-2 text-[10px] font-black tracking-wide uppercase px-2 py-1 rounded-md"
                        style={{ background: 'rgba(10,8,20,0.65)', backdropFilter: 'blur(4px)', color: '#e9d5ff' }}
                      >
                        Après
                      </div>
                      {/* Bouton supprimer */}
                      <button
                        className="absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center transition-opacity"
                        style={{ background: 'rgba(0,0,0,0.6)' }}
                        onClick={e => { e.stopPropagation(); setAfterPhotos([]) }}
                        aria-label="Retirer la photo après"
                      >
                        <X className="w-3 h-3 text-white" />
                      </button>
                    </>
                  )}
                  <input
                    ref={afterInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={async e => {
                      const f = e.target.files?.[0]
                      e.target.value = ''
                      if (!f) return
                      setUploading(true)
                      setUploadError(null)
                      try {
                        const url = await uploadOne(f, 'after')
                        if (url) setAfterPhotos([url])
                      } catch (err) {
                        setUploadError(err instanceof Error ? err.message : 'Erreur upload')
                      } finally {
                        setUploading(false)
                      }
                    }}
                  />
                </div>
                {/* Erreur upload sous la dropzone APRÈS */}
                {uploadError && afterPhotos.length === 0 && (
                  <p className="text-[11px] mt-1" style={{ color: '#dc2626' }}>{uploadError}</p>
                )}
              </div>
            </div>

            {/* ── Aperçu comparaison (visible seulement si les 2 photos sont uploadées) ── */}
            {beforePhotos.length > 0 && afterPhotos.length > 0 && (
              <div className="mt-4 p-4 rounded-2xl" style={{ background: '#f8f8fc', border: '1px solid #E3E3E8' }}>
                <p
                  className="text-[11px] font-bold text-center mb-3 uppercase tracking-widest"
                  style={{ color: '#5c5c7a' }}
                >
                  Aperçu de la comparaison
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 28px 1fr', gap: '10px', alignItems: 'center' }}>
                  {/* Image AVANT */}
                  <div className="relative rounded-xl overflow-hidden">
                    <img
                      src={beforePhotos[0]}
                      className="w-full object-cover block"
                      style={{ aspectRatio: '1/1' }}
                      alt="Avant"
                    />
                    <div
                      className="absolute bottom-2 left-2 text-[10px] font-bold tracking-wide uppercase px-2 py-0.5 rounded-md"
                      style={{ background: 'rgba(10,8,20,0.6)', backdropFilter: 'blur(4px)', color: '#e9d5ff' }}
                    >
                      01 · Avant
                    </div>
                  </div>
                  {/* Flèche centrale preview */}
                  <div className="flex items-center justify-center" style={{ color: '#a78bfa' }}>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                  {/* Image APRÈS */}
                  <div className="relative rounded-xl overflow-hidden">
                    <img
                      src={afterPhotos[0]}
                      className="w-full object-cover block"
                      style={{ aspectRatio: '1/1' }}
                      alt="Après"
                    />
                    <div
                      className="absolute bottom-2 left-2 text-[10px] font-bold tracking-wide uppercase px-2 py-0.5 rounded-md"
                      style={{ background: 'rgba(10,8,20,0.6)', backdropFilter: 'blur(4px)', color: '#e9d5ff' }}
                    >
                      02 · Après
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ── Tip Transformation ── */}
            <div className="mt-4 p-3 rounded-xl flex items-start gap-2.5" style={{ background: '#faf9ff', border: '1px solid #ddd6fe' }}>
              <Lightbulb className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: '#7c3aed' }} />
              <p className="text-[12px]" style={{ color: '#5b21b6' }}>Ces photos seront automatiquement intégrées dans une section "Transformation" sur ta page produit.</p>
            </div>

            <button
              onClick={() => setStep(s => s + 1)}
              className="mt-4 text-[12px] font-medium w-full text-center py-2 rounded-xl transition-all"
              style={{ color: '#8b8b9e', background: 'transparent' }}
            >
              Passer cette étape
            </button>
          </div>
        )}

        {/* ── STEP 5 : Style & Ton ── */}
        {step === 5 && (
          <div>
            <h1 className="text-2xl font-black mb-1" style={{ color: '#1a1a2e' }}>Style & Ton de ta page</h1>
            <p className="text-[14px] mb-6" style={{ color: '#8b8b9e' }}>Choisis le style visuel et le ton du copy IA.</p>

            <label className="block text-[13px] font-bold mb-3" style={{ color: '#1a1a2e' }}>Style visuel</label>

            {/* ── Toggle Templates / Styles V3 ── */}
            <div className="flex gap-2 mb-4 p-1 rounded-xl" style={{ background: '#f3f0ff' }}>
              <button
                onClick={() => setStyleMode('legacy')}
                className="flex-1 px-4 py-2 rounded-lg text-[13px] font-bold transition-all"
                style={styleMode === 'legacy'
                  ? { background: '#fff', color: '#7c3aed', boxShadow: '0 1px 2px rgba(124,58,237,0.08)' }
                  : { background: 'transparent', color: '#8b8b9e' }
                }
              >
                Templates
              </button>
              <button
                onClick={() => setStyleMode('v3')}
                className="flex-1 px-4 py-2 rounded-lg text-[13px] font-bold transition-all relative"
                style={styleMode === 'v3'
                  ? { background: '#fff', color: '#7c3aed', boxShadow: '0 1px 2px rgba(124,58,237,0.08)' }
                  : { background: 'transparent', color: '#8b8b9e' }
                }
              >
                Styles V3
                <span className="ml-1.5 text-[9px] font-bold px-1.5 py-0.5 rounded" style={{ background: '#fef3c7', color: '#d97706' }}>NOUVEAU</span>
              </button>
            </div>

            {/* ── Liste Templates legacy (etec-*) — 1 carte/ligne style V3 ── */}
            {styleMode === 'legacy' && (
              <div className="space-y-3 mb-6">
                {STYLES.map(s => {
                  const tpl = TEMPLATES.find(t => t.id === s.id)
                  const isUniversal = tpl?.productType === 'universal' || tpl?.themed === false
                  const productLabel = tpl ? PRODUCT_TYPE_LABELS[tpl.productType] : null
                  const accent = tpl?.accent || '#7c3aed'
                  const photo = TEMPLATE_PHOTOS[s.id]
                  const tokens = deriveTemplateStyle(s.id, accent)
                  const content = getTemplateContent(s, tpl?.productType)
                  const isSelected = selectedStyle === s.id
                  const isDarkBg = isColorDark(tokens.bg)
                  const btnTextColor = isColorDark(accent) ? '#FFFFFF' : tokens.text
                  return (
                    <button
                      key={s.id}
                      onClick={() => setSelectedStyle(s.id)}
                      className="w-full text-left rounded-2xl border-2 overflow-hidden transition-all hover:shadow-md"
                      style={{
                        height: 200,
                        display: 'flex',
                        ...(isSelected
                          ? { borderColor: '#7c3aed', boxShadow: '0 0 0 4px rgba(124,58,237,0.08)' }
                          : { borderColor: '#E3E3E8', background: '#fff' }
                        ),
                      }}
                    >
                      {/* ─── PARTIE 1 — Mini-site preview (gauche, 320px) ─── */}
                      <div style={{
                        width: 320,
                        flexShrink: 0,
                        background: tokens.bg,
                        color: tokens.text,
                        position: 'relative',
                        display: 'flex',
                        flexDirection: 'column',
                        borderRight: '1px solid #f0f0f3',
                      }}>
                        {/* Mini header brand + nav */}
                        <div style={{
                          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                          padding: '8px 12px',
                          borderBottom: `1px solid ${isDarkBg ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'}`,
                          flexShrink: 0,
                        }}>
                          <div style={{
                            fontFamily: tokens.font, fontSize: 11, fontWeight: 700,
                            letterSpacing: '0.06em', color: tokens.text,
                          }}>{content.brand}</div>
                          <div style={{
                            display: 'flex', gap: 8, fontFamily: '"Inter", sans-serif',
                            fontSize: 7, fontWeight: 500, opacity: 0.7,
                            textTransform: 'uppercase', letterSpacing: '0.12em',
                            color: tokens.text,
                          }}>
                            <span>Shop</span><span>Story</span><span style={{ marginLeft: 2 }}>⊕</span>
                          </div>
                        </div>

                        {/* Hero 2 cols compact : photo + contenu */}
                        <div style={{ display: 'flex', flex: 1, minHeight: 0 }}>
                          <div style={{
                            width: '50%', position: 'relative', overflow: 'hidden',
                            background: `linear-gradient(135deg, ${tokens.surface} 0%, ${tokens.bg} 100%)`,
                            flexShrink: 0,
                          }}>
                            {photo && (
                              /* eslint-disable-next-line @next/next/no-img-element */
                              <img
                                src={photo}
                                alt={content.product}
                                loading="lazy"
                                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                                onError={(e) => { e.currentTarget.style.display = 'none' }}
                              />
                            )}
                            <div style={{
                              position: 'absolute', bottom: 6, left: 8,
                              fontSize: 16, opacity: 0.5, pointerEvents: 'none',
                            }}>{s.emoji}</div>
                          </div>

                          <div style={{
                            flex: 1, padding: '10px 12px',
                            display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 5,
                            minWidth: 0,
                          }}>
                            <div style={{
                              fontFamily: '"Inter", sans-serif',
                              fontSize: 7, fontWeight: 700,
                              letterSpacing: '0.18em', textTransform: 'uppercase',
                              color: accent,
                            }}>New · {content.brand}</div>
                            <div style={{
                              fontFamily: tokens.font,
                              fontSize: 14, fontWeight: 600, lineHeight: 1.1,
                              color: tokens.text,
                              display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
                              overflow: 'hidden', wordBreak: 'break-word',
                            }}>{content.product}</div>
                            <div style={{
                              fontFamily: tokens.font, fontSize: 11, fontWeight: 600, color: tokens.text,
                              opacity: 0.85, marginTop: 1,
                            }}>€98 <span style={{ color: accent, fontSize: 8, marginLeft: 4 }}>★ 4.8</span></div>
                            <div style={{
                              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                              alignSelf: 'flex-start',
                              fontFamily: '"Inter", sans-serif',
                              fontSize: 8, fontWeight: 600,
                              padding: '5px 10px', borderRadius: tokens.btnRadius,
                              background: accent, color: btnTextColor,
                              letterSpacing: '0.03em', marginTop: 3,
                              textTransform: 'uppercase',
                            }}>Ajouter</div>
                          </div>
                        </div>

                        {/* Trust strip bas */}
                        <div style={{
                          display: 'flex', justifyContent: 'space-around',
                          padding: '5px 10px',
                          borderTop: `1px solid ${isDarkBg ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'}`,
                          background: isDarkBg ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.015)',
                          flexShrink: 0,
                        }}>
                          {['Livraison 48h', 'Retours 30j', 'Garantie'].map((feat, i) => (
                            <div key={i} style={{
                              fontFamily: '"Inter", sans-serif',
                              fontSize: 6, fontWeight: 500,
                              letterSpacing: '0.08em', textTransform: 'uppercase',
                              color: tokens.text, opacity: 0.6, whiteSpace: 'nowrap',
                            }}>{feat}</div>
                          ))}
                        </div>
                      </div>

                      {/* ─── PARTIE 2 — Info + bullets (droite) ─── */}
                      <div style={{
                        flex: 1,
                        padding: '18px 20px',
                        display: 'flex', flexDirection: 'column',
                        justifyContent: 'center', gap: 10,
                        background: '#fff',
                        position: 'relative',
                        minWidth: 0,
                      }}>
                        {/* Header : nom mis en valeur + badges */}
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-[22px] font-black leading-none tracking-tight" style={{ color: '#0f0f1e' }}>{s.name}</span>
                          {s.id === 'etec-blue' && (
                            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md" style={{ background: '#fef3c7', color: '#d97706' }}>POPULAIRE</span>
                          )}
                          {productLabel && (
                            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md" style={isUniversal
                              ? { background: '#ecfdf5', color: '#047857' }
                              : { background: '#f3e8ff', color: '#6d28d9' }
                            }>{productLabel}</span>
                          )}
                        </div>

                        {/* Description courte */}
                        <p className="text-[12px] leading-snug" style={{ color: '#5c5c7a', margin: 0 }}>{s.desc}</p>

                        {/* 3 bullets points forts */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                          {content.bullets.map((b, i) => (
                            <div key={i} className="flex items-start gap-1.5 text-[11px]" style={{ color: '#5c5c7a' }}>
                              <span style={{ color: accent, fontWeight: 700, flexShrink: 0, marginTop: 1 }}>·</span>
                              <span style={{ lineHeight: 1.3 }}>{b}</span>
                            </div>
                          ))}
                        </div>

                        {/* Swatch couleurs + font */}
                        <div className="flex items-center gap-1.5 mt-1">
                          <span title="Background" style={{ width: 12, height: 12, borderRadius: 3, background: tokens.bg, border: '1px solid rgba(0,0,0,0.08)' }} />
                          <span title="Accent" style={{ width: 12, height: 12, borderRadius: 3, background: accent, border: '1px solid rgba(0,0,0,0.08)' }} />
                          <span title="Text" style={{ width: 12, height: 12, borderRadius: 3, background: tokens.text, border: '1px solid rgba(0,0,0,0.08)' }} />
                          <span className="text-[10px] ml-1" style={{ color: '#a8a8b8' }}>
                            {tokens.font.split(',')[0].replace(/['"]/g, '').trim()}
                          </span>
                        </div>

                        {/* Checkmark overlay si sélectionné */}
                        {isSelected && (
                          <div style={{
                            position: 'absolute', top: 14, right: 16,
                            width: 22, height: 22, borderRadius: '50%',
                            background: '#7c3aed',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            boxShadow: '0 2px 8px rgba(124,58,237,0.4)',
                          }}>
                            <Check className="w-3.5 h-3.5 text-white" />
                          </div>
                        )}
                      </div>
                    </button>
                  )
                })}
              </div>
            )}

            {/* ── Liste Styles V3 (10 nouveaux Allbirds-grade) — Engine V3 actif ── */}
            {styleMode === 'v3' && (
              <div className="space-y-4 mb-6">
                {/* Charge Google Fonts dans le dashboard pour que les vraies fonts
                    apparaissent dans les mini-previews (sans ça : fallback system-ui). */}
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
                <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Cormorant+Garamond:wght@500;600;700&family=Playfair+Display:wght@500;600;700&family=DM+Serif+Display&family=Space+Grotesk:wght@500;600;700&family=JetBrains+Mono:wght@600;700&display=swap" />

                <div className="p-3 rounded-lg mb-2 text-[12px]" style={{ background: '#ede9fe', color: '#5b21b6' }}>
                  <strong>Engine V3 actif</strong> — génération via Vercel AI SDK + Zod + 13 sections universelles (Allbirds-grade). Rendu serveur direct.
                </div>
                {V3_STYLES.map(s => {
                  const isSelected = selectedStyle === s.id
                  const isDarkBg = isColorDark(s.bg)
                  const btnTextColor = isColorDark(s.accent) ? '#FFFFFF' : s.text
                  return (
                    <button
                      key={s.id}
                      onClick={() => setSelectedStyle(s.id)}
                      className="w-full text-left rounded-2xl border-2 overflow-hidden transition-all hover:shadow-md"
                      style={{
                        height: 200,
                        display: 'flex',
                        ...(isSelected
                          ? { borderColor: '#7c3aed', boxShadow: '0 0 0 4px rgba(124,58,237,0.08)' }
                          : { borderColor: '#E3E3E8', background: '#fff' }
                        ),
                      }}
                    >
                      {/* ─── PARTIE 1 — Mini-site preview (gauche, largeur fixe) ─── */}
                      <div style={{
                        width: 320,
                        flexShrink: 0,
                        background: s.bg,
                        color: s.text,
                        position: 'relative',
                        display: 'flex',
                        flexDirection: 'column',
                        borderRight: '1px solid #f0f0f3',
                      }}>
                        {/* Mini header brand + nav */}
                        <div style={{
                          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                          padding: '8px 12px',
                          borderBottom: `1px solid ${isDarkBg ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'}`,
                          flexShrink: 0,
                        }}>
                          <div style={{
                            fontFamily: s.font, fontSize: 11, fontWeight: 700,
                            letterSpacing: '0.06em', color: s.text,
                          }}>{s.brand}</div>
                          <div style={{
                            display: 'flex', gap: 8, fontFamily: '"Inter", sans-serif',
                            fontSize: 7, fontWeight: 500, opacity: 0.7,
                            textTransform: 'uppercase', letterSpacing: '0.12em',
                            color: s.text,
                          }}>
                            <span>Shop</span><span>Story</span><span style={{ marginLeft: 2 }}>⊕</span>
                          </div>
                        </div>

                        {/* Hero 2 cols compact : photo + contenu */}
                        <div style={{ display: 'flex', flex: 1, minHeight: 0 }}>
                          {/* Photo */}
                          <div style={{
                            width: '50%', position: 'relative', overflow: 'hidden',
                            background: `linear-gradient(135deg, ${s.surface} 0%, ${s.bg} 100%)`,
                            flexShrink: 0,
                          }}>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={s.photo}
                              alt={s.product}
                              loading="lazy"
                              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                              onError={(e) => { e.currentTarget.style.display = 'none' }}
                            />
                            <div style={{
                              position: 'absolute', bottom: 6, left: 8,
                              fontSize: 16, opacity: 0.5, pointerEvents: 'none',
                            }}>{s.emoji}</div>
                          </div>

                          {/* Texte hero compact */}
                          <div style={{
                            flex: 1, padding: '10px 12px',
                            display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 5,
                            minWidth: 0,
                          }}>
                            <div style={{
                              fontFamily: '"Inter", sans-serif',
                              fontSize: 7, fontWeight: 700,
                              letterSpacing: '0.18em', textTransform: 'uppercase',
                              color: s.accent,
                            }}>New · {s.brand}</div>
                            <div style={{
                              fontFamily: s.font,
                              fontSize: 14, fontWeight: 600, lineHeight: 1.1,
                              color: s.text,
                              display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
                              overflow: 'hidden', wordBreak: 'break-word',
                            }}>{s.product}</div>
                            <div style={{
                              fontFamily: s.font, fontSize: 11, fontWeight: 600, color: s.text,
                              opacity: 0.85, marginTop: 1,
                            }}>€98 <span style={{ color: s.accent, fontSize: 8, marginLeft: 4 }}>★ 4.8</span></div>
                            <div style={{
                              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                              alignSelf: 'flex-start',
                              fontFamily: '"Inter", sans-serif',
                              fontSize: 8, fontWeight: 600,
                              padding: '5px 10px', borderRadius: s.btnRadius,
                              background: s.accent, color: btnTextColor,
                              letterSpacing: '0.03em', marginTop: 3,
                              textTransform: 'uppercase',
                            }}>Ajouter</div>
                          </div>
                        </div>

                        {/* Mini trust strip bas */}
                        <div style={{
                          display: 'flex', justifyContent: 'space-around',
                          padding: '5px 10px',
                          borderTop: `1px solid ${isDarkBg ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'}`,
                          background: isDarkBg ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.015)',
                          flexShrink: 0,
                        }}>
                          {['Livraison 48h', 'Retours 30j', 'Garantie'].map((feat, i) => (
                            <div key={i} style={{
                              fontFamily: '"Inter", sans-serif',
                              fontSize: 6, fontWeight: 500,
                              letterSpacing: '0.08em', textTransform: 'uppercase',
                              color: s.text, opacity: 0.6, whiteSpace: 'nowrap',
                            }}>{feat}</div>
                          ))}
                        </div>
                      </div>

                      {/* ─── PARTIE 2 — Info + bullets (droite) ─── */}
                      <div style={{
                        flex: 1,
                        padding: '18px 20px',
                        display: 'flex', flexDirection: 'column',
                        justifyContent: 'center', gap: 10,
                        background: '#fff',
                        position: 'relative',
                        minWidth: 0,
                      }}>
                        {/* Header : nom du style mis en valeur + V3 badge */}
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-[22px] font-black leading-none tracking-tight" style={{ color: '#0f0f1e' }}>{s.name}</span>
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md" style={{ background: '#ede9fe', color: '#6d28d9' }}>V3</span>
                        </div>

                        {/* Description courte */}
                        <p className="text-[12px] leading-snug" style={{ color: '#5c5c7a', margin: 0 }}>{s.desc}</p>

                        {/* 3 bullets points forts */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                          {s.bullets.map((b, i) => (
                            <div key={i} className="flex items-start gap-1.5 text-[11px]" style={{ color: '#5c5c7a' }}>
                              <span style={{ color: '#7c3aed', fontWeight: 700, flexShrink: 0, marginTop: 1 }}>·</span>
                              <span style={{ lineHeight: 1.3 }}>{b}</span>
                            </div>
                          ))}
                        </div>

                        {/* Swatch couleurs + font name (bottom) */}
                        <div className="flex items-center gap-1.5 mt-1">
                          <span title="Background" style={{ width: 12, height: 12, borderRadius: 3, background: s.bg, border: '1px solid rgba(0,0,0,0.08)' }} />
                          <span title="Accent" style={{ width: 12, height: 12, borderRadius: 3, background: s.accent, border: '1px solid rgba(0,0,0,0.08)' }} />
                          <span title="Text" style={{ width: 12, height: 12, borderRadius: 3, background: s.text, border: '1px solid rgba(0,0,0,0.08)' }} />
                          <span className="text-[10px] ml-1" style={{ color: '#a8a8b8' }}>
                            {s.font.split(',')[0].replace(/['"]/g, '').trim()}
                          </span>
                        </div>

                        {/* Checkmark overlay top-right */}
                        {isSelected && (
                          <div style={{
                            position: 'absolute', top: 14, right: 16,
                            width: 22, height: 22, borderRadius: '50%',
                            background: '#7c3aed',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            boxShadow: '0 2px 8px rgba(124,58,237,0.4)',
                          }}>
                            <Check className="w-3.5 h-3.5 text-white" />
                          </div>
                        )}
                      </div>
                    </button>
                  )
                })}
              </div>
            )}

            <label className="block text-[13px] font-bold mb-3" style={{ color: '#1a1a2e' }}>Ton du copywriting IA</label>
            <div className="grid grid-cols-2 gap-3">
              {TONES.map(t => {
                const isSelected = selectedTone === t.id
                return (
                  <button
                    key={t.id}
                    onClick={() => setSelectedTone(t.id)}
                    className="text-left rounded-xl border-2 overflow-hidden transition-all hover:shadow-md"
                    style={{
                      position: 'relative',
                      ...(isSelected
                        ? { borderColor: t.accent, boxShadow: `0 0 0 3px ${t.accent}22` }
                        : { borderColor: '#E3E3E8', background: '#fff' }
                      ),
                    }}
                  >
                    {/* Strip color accent + icône en haut */}
                    <div style={{
                      padding: '12px 14px 10px',
                      background: t.bgTint,
                      borderBottom: `1px solid ${t.accent}22`,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                    }}>
                      <div style={{
                        width: 36, height: 36, borderRadius: 10,
                        background: t.accent,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 18,
                        color: '#fff',
                        boxShadow: `0 2px 6px ${t.accent}44`,
                      }}>{t.icon}</div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div className="text-[15px] font-black tracking-tight" style={{ color: '#0f0f1e', lineHeight: 1.1 }}>{t.label}</div>
                        <div className="text-[10px] mt-0.5" style={{ color: '#7a7a8e' }}>{t.desc}</div>
                      </div>
                      {/* Checkmark si sélectionné */}
                      {isSelected && (
                        <div style={{
                          width: 22, height: 22, borderRadius: '50%',
                          background: t.accent,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          flexShrink: 0,
                          boxShadow: `0 2px 6px ${t.accent}55`,
                        }}>
                          <Check className="w-3 h-3 text-white" />
                        </div>
                      )}
                    </div>

                    {/* Corps : exemple de voix + cas d'usage */}
                    <div style={{ padding: '10px 14px 12px', background: '#fff' }}>
                      {/* Exemple voix réelle, italique avec quote */}
                      <div style={{
                        fontSize: 11,
                        fontStyle: 'italic',
                        color: '#3b3b4f',
                        lineHeight: 1.4,
                        paddingLeft: 8,
                        borderLeft: `2px solid ${t.accent}55`,
                        marginBottom: 8,
                      }}>« {t.example} »</div>

                      {/* Cas d'usage */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                        {t.useCases.map((u, i) => (
                          <div key={i} className="flex items-start gap-1.5 text-[10px]" style={{ color: '#7a7a8e' }}>
                            <span style={{ color: t.accent, fontWeight: 700, flexShrink: 0 }}>·</span>
                            <span style={{ lineHeight: 1.3 }}>{u}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>

            {/* ── Champ Nom de marque (visible pour les 2 modes, utilisé surtout V3) ── */}
            <label className="block text-[13px] font-bold mt-6 mb-3" style={{ color: '#1a1a2e' }}>
              Nom de ta marque
              <span className="ml-2 text-[11px] font-normal" style={{ color: '#8b8b9e' }}>(optionnel — laisse vide pour qu&apos;on en invente un)</span>
            </label>
            <input
              type="text"
              value={brand}
              onChange={(e) => setBrand(e.target.value.slice(0, 40))}
              placeholder="Ex : Atelier Forêt, Velura, Halo..."
              className="w-full px-4 py-3 rounded-xl border-2 text-[14px] focus:outline-none transition-colors"
              style={{ borderColor: brand ? '#7c3aed' : '#E3E3E8', background: '#fff', color: '#1a1a2e' }}
              maxLength={40}
            />
            <p className="text-[11px] mt-1.5" style={{ color: '#8b8b9e' }}>
              Affiché en haut du hero + dans le manifesto. 2-40 caractères.
            </p>
          </div>
        )}

        {/* ── STEP 6 : Plateforme ── */}
        {step === 6 && (
          <div>
            <h1 className="text-2xl font-black mb-1" style={{ color: '#1a1a2e' }}>Plateforme cible</h1>
            <p className="text-[14px] mb-6" style={{ color: '#8b8b9e' }}>Où vas-tu publier cette page ?</p>

            <div className="space-y-3">
              {PLATFORMS.map(p => (
                <button
                  key={p.id}
                  onClick={() => setPlatform(p.id)}
                  className="w-full flex items-center gap-4 p-5 rounded-xl border-2 text-left transition-all"
                  style={platform === p.id
                    ? { borderColor: '#7c3aed', background: '#faf9ff' }
                    : { borderColor: '#E3E3E8', background: '#fff' }
                  }
                >
                  <PlatformLogo platform={p.id} size={36} />
                  <div className="flex-1">
                    <span className="text-[16px] font-black tracking-tight" style={{ color: '#0f0f1e' }}>{p.label}</span>
                  </div>
                  {platform === p.id && (
                    <div className="w-5 h-5 rounded-full flex items-center justify-center" style={{ background: '#7c3aed' }}>
                      <Check className="w-3 h-3 text-white" />
                    </div>
                  )}
                </button>
              ))}
            </div>

            <div className="mt-6 p-4 rounded-xl" style={{ background: '#f3f0ff', border: '1px solid #ddd6fe' }}>
              <div className="flex items-start gap-3">
                <Zap className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: '#7c3aed' }} />
                <p className="text-[12px]" style={{ color: '#5b21b6' }}>
                  Après génération, tu pourras publier en 1 clic directement depuis l'éditeur. Assure-toi d'avoir connecté ton store dans <strong>Mes stores</strong>.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ── STEP 7 : Langue du résultat ── */}
        {step === 7 && (
          <div>
            <h1 className="text-2xl font-black mb-1" style={{ color: '#1a1a2e' }}>Langue de la page</h1>
            <p className="text-[14px] mb-6" style={{ color: '#8b8b9e' }}>Dans quelle langue veux-tu que l'IA génère le contenu de ta page ?</p>

            <div className="grid grid-cols-2 gap-3">
              {LANGUAGES.map(({ code, flag, label, desc }) => (
                <button key={code} onClick={() => setResultLang(code)}
                  className="flex items-center gap-3 p-4 rounded-xl border-2 text-left transition-all"
                  style={resultLang === code
                    ? { borderColor: '#7c3aed', background: '#faf9ff' }
                    : { borderColor: '#E3E3E8', background: '#fff' }}>
                  <span className="text-2xl">{flag}</span>
                  <div className="flex-1">
                    <div className="text-[13px] font-bold" style={{ color: resultLang === code ? '#7c3aed' : '#1a1a2e' }}>{label}</div>
                    <div className="text-[11px]" style={{ color: '#8b8b9e' }}>{desc}</div>
                  </div>
                  {resultLang === code && (
                    <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: '#7c3aed' }}>
                      <Check className="w-3 h-3 text-white" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── STEP 8 : Récap ── */}
        {step === 8 && (
          <div>
            <h1 className="text-2xl font-black mb-1" style={{ color: '#1a1a2e' }}>Tout est prêt !</h1>
            <p className="text-[14px] mb-6" style={{ color: '#8b8b9e' }}>Vérifie tes choix avant de lancer la génération.</p>

            <div className="rounded-2xl overflow-hidden mb-6" style={{ border: '1px solid #E3E3E8' }}>
              {[
                { label: 'Source',      value: inputMode === 'url' ? (url || '—') : (manual.product_name || '—') },
                { label: 'Photos',      value: uploadedPhotos.length > 0 ? `${uploadedPhotos.length} photo(s) uploadée(s)` : 'Auto (depuis URL)' },
                { label: 'Vidéos UGC',  value: ugcVideos.length > 0 ? `${ugcVideos.length} vidéo(s)` : ugcLinks.filter(l => l.trim()).length > 0 ? `${ugcLinks.filter(l => l.trim()).length} lien(s)` : 'Aucune' },
                { label: 'Avant/Après', value: beforePhotos.length > 0 && afterPhotos.length > 0 ? 'Activé ✓' : 'Non ajouté' },
                { label: 'Style',       value: STYLES.find(s => s.id === selectedStyle)?.name || selectedStyle },
                { label: 'Ton',         value: TONES.find(t => t.id === selectedTone)?.label || selectedTone },
                { label: 'Plateforme',  value: PLATFORMS.find(p => p.id === platform)?.label || platform },
                { label: 'Langue',      value: getLangLabel(resultLang) },
              ].map(({ label, value }, i) => (
                <div key={label} className="flex items-center justify-between px-4 py-3"
                  style={{ background: i % 2 === 0 ? '#fff' : '#fafafa', borderBottom: i < 7 ? '1px solid #E3E3E8' : 'none' }}>
                  <span className="text-[13px] font-medium" style={{ color: '#8b8b9e' }}>{label}</span>
                  <span className="text-[13px] font-bold" style={{ color: '#1a1a2e' }}>{value}</span>
                </div>
              ))}
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-3 text-[13px] mb-4">{error}</div>
            )}

            <button
              onClick={generate}
              disabled={mode !== 'wizard'}
              className="w-full font-bold py-4 rounded-xl text-[14px] transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
              style={{
                background: 'linear-gradient(135deg, #7c3aed, #6d28d9)',
                color: '#fff',
                boxShadow: '0 4px 20px rgba(124,58,237,0.35)',
              }}
            >
              <Sparkles className="w-4 h-4" />
              Générer ma page avec l'IA
            </button>
            <p className="text-center text-[12px] mt-2" style={{ color: '#8b8b9e' }}>L'IA travaille — patiente 30 à 60 secondes</p>
          </div>
        )}

        {/* ── Navigation ── */}
        <div className="flex items-center justify-between mt-8">
          <button
            onClick={() => step > 1 ? setStep(s => s - 1) : router.push('/dashboard')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-[13px] font-semibold transition-all"
            style={{ color: '#5c5c7a', background: '#fff', border: '1px solid #E3E3E8' }}
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            {step === 1 ? 'Annuler' : 'Précédent'}
          </button>

          {step < 8 && (
            <button
              onClick={() => setStep(s => s + 1)}
              disabled={!canProceed}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-[13px] font-bold transition-all"
              style={canProceed
                ? { background: '#1a1a2e', color: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }
                : { background: '#E3E3E8', color: '#8b8b9e', cursor: 'not-allowed' }
              }
            >
              Suivant
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default function NewPage() {
  return (
    <Suspense fallback={<div className="flex h-screen items-center justify-center"><div className="w-6 h-6 rounded-full border-2 border-violet-600 border-t-transparent animate-spin" /></div>}>
      <NewPageInner />
    </Suspense>
  )
}
