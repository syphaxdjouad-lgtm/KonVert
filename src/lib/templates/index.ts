import type { LandingPageData } from '@/types'

export { templateEtecBlue }   from './etec-blue'
export { templateEtecNoir }   from './etec-noir'
export { templateEtecRose }   from './etec-rose'
export { templateEtecSage }   from './etec-sage'
export { templateEtecGold }   from './etec-gold'
export { templateEtecEnergy } from './etec-energy'
export { templateEtecBeauty } from './etec-beauty'
export { templateEtecStyle }  from './etec-style'
export { templateEtecShopz }   from './etec-shopz'
export { templateEtecVelvety } from './etec-velvety'
export { templateEtecPrime }  from './etec-prime'
export { templateEtecBlusho } from './etec-blusho'
export { templateEtecCasa }   from './etec-casa'
export { templateEtecPet }    from './etec-pet'
export { templateEtecGadget } from './etec-gadget'
export { templateEtecAura }  from './etec-aura'
export { templateEtecLuxe }  from './etec-luxe'
export { templateEtecNordic } from './etec-nordic'
export { templateEtecPulse } from './etec-pulse'
export { templateEtecCosmetix } from './etec-cosmetix'
export { templateEtecTrendy } from './etec-trendy'
export { templateEtecSolo } from './etec-solo'
export { templateEtecPrestige } from './etec-prestige'
export { templateEtecGlow } from './etec-glow'
export { templateEtecHomestyle } from './etec-homestyle'
export { templateEtecJewel } from './etec-jewel'
export { templateEtecTechcase } from './etec-techcase'
export { templateEtecArtisan } from './etec-artisan'
export { templateEtecOutfit } from './etec-outfit'
export { templateEtecElla } from './etec-ella'
export { templateEtecStarter } from './etec-starter'
export { templateEtecGlowup } from './etec-glowup'
export { templateEtecHue } from './etec-hue'
export { templateEtecInterior } from './etec-interior'
export { templateEtecPlatina } from './etec-platina'
export { templateEtecStreetz } from './etec-streetz'
export { templateEtecPoterie } from './etec-poterie'
export { templateEtecElectro } from './etec-electro'
export { templateEtecAgency } from './etec-agency'
export { templateEtecSupreme } from './etec-supreme'
export { templateEtecQuarter } from './etec-quarter'
export { templateEtecBoost } from './etec-boost'

import { templateEtecBlue }   from './etec-blue'
import { templateEtecNoir }   from './etec-noir'
import { templateEtecRose }   from './etec-rose'
import { templateEtecSage }   from './etec-sage'
import { templateEtecGold }   from './etec-gold'
import { templateEtecEnergy } from './etec-energy'
import { templateEtecBeauty } from './etec-beauty'
import { templateEtecStyle }  from './etec-style'
import { templateEtecShopz }   from './etec-shopz'
import { templateEtecVelvety } from './etec-velvety'
import { templateEtecPrime }  from './etec-prime'
import { templateEtecBlusho } from './etec-blusho'
import { templateEtecCasa }   from './etec-casa'
import { templateEtecPet }    from './etec-pet'
import { templateEtecGadget } from './etec-gadget'
import { templateEtecAura }  from './etec-aura'
import { templateEtecLuxe }  from './etec-luxe'
import { templateEtecPulse }  from './etec-pulse'
import { templateEtecNordic } from './etec-nordic'
import { templateEtecCosmetix } from './etec-cosmetix'
import { templateEtecTrendy } from './etec-trendy'
import { templateEtecSolo } from './etec-solo'
import { templateEtecPrestige } from './etec-prestige'
import { templateEtecGlow } from './etec-glow'
import { templateEtecHomestyle } from './etec-homestyle'
import { templateEtecJewel } from './etec-jewel'
import { templateEtecTechcase } from './etec-techcase'
import { templateEtecArtisan } from './etec-artisan'
import { templateEtecOutfit } from './etec-outfit'
import { templateEtecElla } from './etec-ella'
import { templateEtecStarter } from './etec-starter'
import { templateEtecGlowup } from './etec-glowup'
import { templateEtecHue } from './etec-hue'
import { templateEtecInterior } from './etec-interior'
import { templateEtecPlatina } from './etec-platina'
import { templateEtecStreetz } from './etec-streetz'
import { templateEtecPoterie } from './etec-poterie'
import { templateEtecElectro } from './etec-electro'
import { templateEtecAgency } from './etec-agency'
import { templateEtecSupreme } from './etec-supreme'
import { templateEtecQuarter } from './etec-quarter'
import { templateEtecBoost } from './etec-boost'

// ─── BACKWARD COMPAT ALIASES ──────────────────────────────────────────────────

export const templateHealingBird    = templateEtecBeauty
export const templateMinimalDark    = templateEtecNoir
export const templateCleanWhite     = templateEtecBlue
export const templateBoldSales      = templateEtecEnergy
export const templateLuxury         = templateEtecGold
export const templateMobileFirst    = templateEtecBlue
export const templateSheinPro       = templateEtecRose
export const templateSportifEnergie = templateEtecEnergy
export const templateNaturalOrganic = templateEtecSage
export const templateTechGadget     = templateEtecBlue
export const templateBeautyStudio   = templateEtecRose
export const templateHomeDeco       = templateEtecSage
export const templateKidsColorful   = templateEtecEnergy
export const templateFoodieGourmet  = templateEtecEnergy
export const templateTravelNomad    = templateEtecBlue
export const templateAutomotivePro  = templateEtecNoir
export const templateGamingZone     = templateEtecNoir
export const templatePetLove        = templateEtecRose
export const templatePremiumGlass   = templateEtecGold

// ─── REGISTRY ─────────────────────────────────────────────────────────────────

// Type de produit ciblé par un template. Sert au matching wizard ↔ produit
// scrapé pour éviter qu'un blender se retrouve sur un template skincare.
export type ProductType =
  | 'skincare' | 'beauty' | 'wellness' | 'tech' | 'jewelry'
  | 'home' | 'fashion' | 'pet' | 'luxury' | 'universal'

export const PRODUCT_TYPE_LABELS: Record<ProductType, string> = {
  skincare:  'Soins · Skincare',
  beauty:    'Beauté · Maquillage',
  wellness:  'Bien-être · Suppléments',
  tech:      'Tech · Électronique',
  jewelry:   'Bijoux · Joaillerie',
  home:      'Maison · Déco',
  fashion:   'Mode · Vêtements',
  pet:       'Animaux',
  luxury:    'Luxe',
  universal: 'Universel',
}

// `themed: true` = le template contient du contenu produit-spécifique (badges,
// titres section, fallback images). À éviter pour un produit hors catégorie.
// `themed: false` = template universel utilisable pour tout produit.
export const TEMPLATES = [
  { id: 'etec-blue',     name: 'Blue',     category: 'modern'  as const, fn: templateEtecBlue,     label: 'Tech · Moderne · Universel',           accent: '#0057FF', badge: 'Populaire',      productType: 'universal' as ProductType, themed: false },
  { id: 'etec-noir',     name: 'Noir',     category: 'dark'    as const, fn: templateEtecNoir,     label: 'Premium · Dark · Gaming',              accent: '#7C3AED', badge: '',               productType: 'tech'      as ProductType, themed: true  },
  { id: 'etec-rose',     name: 'Rose',     category: 'beauty'  as const, fn: templateEtecRose,     label: 'Beauté · Makeup · Skincare',           accent: '#D63370', badge: 'Top conversion', productType: 'skincare'  as ProductType, themed: true  },
  { id: 'etec-sage',     name: 'Sage',     category: 'organic' as const, fn: templateEtecSage,     label: 'Organic · Bio · Bien-être',            accent: '#2D6A4F', badge: '',               productType: 'wellness'  as ProductType, themed: true  },
  { id: 'etec-gold',     name: 'Gold',     category: 'luxury'  as const, fn: templateEtecGold,     label: 'Luxe · Haute Gamme · Or',              accent: '#D4A853', badge: 'Exclusif',       productType: 'luxury'    as ProductType, themed: true  },
  { id: 'etec-energy',   name: 'Energy',   category: 'sport'   as const, fn: templateEtecEnergy,   label: 'Sport · Fitness · DTC',                accent: '#E63000', badge: 'Nouveau',        productType: 'wellness'  as ProductType, themed: true  },
  { id: 'etec-beauty',   name: 'Beauty',   category: 'beauty'  as const, fn: templateEtecBeauty,   label: 'Hair Care · Premium · Organic',        accent: '#E8622A', badge: 'Nouveau',        productType: 'beauty'    as ProductType, themed: true  },
  { id: 'etec-style',    name: 'Style',    category: 'luxury'  as const, fn: templateEtecStyle,    label: 'Fashion · Styling · Luxe accessible',  accent: '#C9B49A', badge: 'Nouveau',        productType: 'fashion'   as ProductType, themed: true  },
  { id: 'etec-shopz',    name: 'Shopz',    category: 'modern'  as const, fn: templateEtecShopz,    label: 'E-commerce · Clothing · Shopz Style',  accent: '#1A5C30', badge: 'Nouveau',        productType: 'fashion'   as ProductType, themed: true  },
  { id: 'etec-velvety',  name: 'Velvety',  category: 'organic' as const, fn: templateEtecVelvety,  label: 'Skincare · Botanique · Haut de gamme', accent: '#4A7C59', badge: 'Nouveau',        productType: 'skincare'  as ProductType, themed: true  },
  { id: 'etec-prime',    name: 'Prime',    category: 'modern'  as const, fn: templateEtecPrime,    label: 'Supplements · Health · DTC Premium',   accent: '#3CB043', badge: 'Nouveau',        productType: 'wellness'  as ProductType, themed: true  },
  { id: 'etec-blusho',   name: 'Blusho',   category: 'beauty'  as const, fn: templateEtecBlusho,   label: 'Cosmetics · Skincare · E-com Premium', accent: '#7A8C6E', badge: 'Nouveau',        productType: 'skincare'  as ProductType, themed: true  },
  { id: 'etec-casa',     name: 'Casa',     category: 'organic' as const, fn: templateEtecCasa,     label: 'Maison · Déco · Artisanat Premium',    accent: '#B5541B', badge: 'Nouveau',        productType: 'home'      as ProductType, themed: true  },
  { id: 'etec-pet',      name: 'Pet',      category: 'modern'  as const, fn: templateEtecPet,      label: 'Animaux · Bien-être · Pet Care',       accent: '#E8722A', badge: 'Nouveau',        productType: 'pet'       as ProductType, themed: true  },
  { id: 'etec-gadget',   name: 'Gadget',   category: 'modern'  as const, fn: templateEtecGadget,   label: 'Tech · Electronics · Apple Style',     accent: '#0066CC', badge: 'Nouveau',        productType: 'tech'      as ProductType, themed: true  },
  { id: 'etec-aura',     name: 'Aura',     category: 'organic' as const, fn: templateEtecAura,     label: 'Wellness · Lavande · Ritual',          accent: '#7C5CBF', badge: 'Nouveau',        productType: 'wellness'  as ProductType, themed: true  },
  { id: 'etec-luxe',     name: 'Luxe',     category: 'luxury'  as const, fn: templateEtecLuxe,     label: 'Joaillerie · Noir & Or · Ultra Premium', accent: '#C9A84C', badge: 'Exclusif',     productType: 'jewelry'   as ProductType, themed: true  },
  { id: 'etec-pulse',    name: 'Pulse',    category: 'dark'    as const, fn: templateEtecPulse,    label: 'Tech · Cyberpunk · Gadgets Dark',      accent: '#00D4FF', badge: 'Nouveau',        productType: 'tech'      as ProductType, themed: true  },
  { id: 'etec-nordic',   name: 'Nordic',   category: 'organic' as const, fn: templateEtecNordic,   label: 'Lifestyle · Minimaliste · Scandinave', accent: '#4A7C88', badge: 'Nouveau',        productType: 'home'      as ProductType, themed: true  },
  { id: 'etec-cosmetix', name: 'Cosmetix', category: 'beauty'  as const, fn: templateEtecCosmetix, label: 'Cosmétiques · Skincare · Clean Beauty', accent: '#334FB4', badge: 'Nouveau',       productType: 'skincare'  as ProductType, themed: true  },
  { id: 'etec-trendy',   name: 'Trendy',   category: 'modern'  as const, fn: templateEtecTrendy,   label: 'Fashion · Mode · Streetwear',          accent: '#319da0', badge: 'Nouveau',        productType: 'fashion'   as ProductType, themed: true  },
  { id: 'etec-solo',     name: 'Solo',     category: 'modern'  as const, fn: templateEtecSolo,     label: 'Mono-produit · Single Product · DTC',  accent: '#334FB4', badge: 'Nouveau',        productType: 'universal' as ProductType, themed: false },
  { id: 'etec-prestige', name: 'Prestige', category: 'luxury'  as const, fn: templateEtecPrestige, label: 'Premium · Haut de gamme · Artisanal',  accent: '#DD1D1D', badge: 'Exclusif',       productType: 'luxury'    as ProductType, themed: true  },
  { id: 'etec-glow',     name: 'Glow',     category: 'beauty'  as const, fn: templateEtecGlow,     label: 'Skincare · Beauty · Ritual',           accent: '#EF4A65', badge: 'Nouveau',        productType: 'skincare'  as ProductType, themed: true  },
  { id: 'etec-homestyle',name: 'HomeStyle',category: 'organic' as const, fn: templateEtecHomestyle,label: 'Mobilier · Déco · Maison',             accent: '#8B6914', badge: 'Nouveau',        productType: 'home'      as ProductType, themed: true  },
  { id: 'etec-jewel',    name: 'Jewel',    category: 'dark'    as const, fn: templateEtecJewel,    label: 'Bijoux · Joaillerie · Dark Luxe',      accent: '#a37249', badge: 'Exclusif',       productType: 'jewelry'   as ProductType, themed: true  },
  { id: 'etec-techcase', name: 'TechCase', category: 'modern'  as const, fn: templateEtecTechcase, label: 'Accessoires Tech · Phone · Minimal',   accent: '#000000', badge: 'Nouveau',        productType: 'tech'      as ProductType, themed: true  },
  { id: 'etec-artisan',  name: 'Artisan',  category: 'organic' as const, fn: templateEtecArtisan,  label: 'Handmade · Savon · Naturel',           accent: '#FF871D', badge: 'Nouveau',        productType: 'skincare'  as ProductType, themed: true  },
  { id: 'etec-outfit',   name: 'Outfit',   category: 'modern'  as const, fn: templateEtecOutfit,   label: 'Vêtements · E-com · Warm Neutral',     accent: '#B5854B', badge: 'Nouveau',        productType: 'fashion'   as ProductType, themed: true  },
  { id: 'etec-ella',     name: 'Ella',     category: 'beauty'  as const, fn: templateEtecElla,     label: 'Mode Féminine · Élégant · Mauve',      accent: '#C77DBA', badge: 'Nouveau',        productType: 'universal' as ProductType, themed: false },
  { id: 'etec-starter',  name: 'Starter',  category: 'modern'  as const, fn: templateEtecStarter,  label: 'Polyvalent · Clean · Universel',       accent: '#4F46E5', badge: 'Nouveau',        productType: 'universal' as ProductType, themed: false },
  { id: 'etec-glowup',   name: 'GlowUp',   category: 'beauty'  as const, fn: templateEtecGlowup,   label: 'Beauté · Makeup · Glamour',            accent: '#D4508B', badge: 'Nouveau',        productType: 'beauty'    as ProductType, themed: true  },
  { id: 'etec-hue',      name: 'Hue',      category: 'modern'  as const, fn: templateEtecHue,      label: 'Créatif · Couleurs · Audacieux',       accent: '#FF6B35', badge: 'Nouveau',        productType: 'universal' as ProductType, themed: false },
  { id: 'etec-interior', name: 'Interior', category: 'organic' as const, fn: templateEtecInterior, label: 'Mobilier · Intérieur · Nature',        accent: '#5B7553', badge: 'Nouveau',        productType: 'home'      as ProductType, themed: true  },
  { id: 'etec-platina',  name: 'Platina',  category: 'luxury'  as const, fn: templateEtecPlatina,  label: 'Bijoux · Joaillerie · Raffiné',        accent: '#B8860B', badge: 'Exclusif',       productType: 'jewelry'   as ProductType, themed: true  },
  { id: 'etec-streetz',  name: 'StreetZ',  category: 'dark'    as const, fn: templateEtecStreetz,  label: 'Streetwear · Urban · Bold',            accent: '#E11D48', badge: 'Nouveau',        productType: 'fashion'   as ProductType, themed: true  },
  { id: 'etec-poterie',  name: 'Poterie',  category: 'organic' as const, fn: templateEtecPoterie,  label: 'Céramique · Artisanat · Terre',        accent: '#A0522D', badge: 'Nouveau',        productType: 'home'      as ProductType, themed: true  },
  { id: 'etec-electro',  name: 'Electro',  category: 'sport'   as const, fn: templateEtecElectro,  label: 'Supplements · Sport · Hydratation',    accent: '#00B4D8', badge: 'Nouveau',        productType: 'wellness'  as ProductType, themed: true  },
  { id: 'etec-agency',   name: 'Agency',   category: 'modern'  as const, fn: templateEtecAgency,   label: 'Corporate · Services · Professionnel', accent: '#334FB4', badge: 'Nouveau',        productType: 'universal' as ProductType, themed: false },
  { id: 'etec-supreme',  name: 'Supreme',  category: 'dark'    as const, fn: templateEtecSupreme,  label: 'Exclusive · Monospace · Streetwear',   accent: '#FE0100', badge: 'Exclusif',       productType: 'fashion'   as ProductType, themed: true  },
  { id: 'etec-quarter',  name: 'Quarter',  category: 'luxury'  as const, fn: templateEtecQuarter,  label: 'Minimal Luxe · Épuré · Noir & Blanc',  accent: '#121212', badge: 'Nouveau',        productType: 'universal' as ProductType, themed: false },
  { id: 'etec-boost',    name: 'Boost',    category: 'beauty'  as const, fn: templateEtecBoost,    label: 'Conversion · Wellness · DTC Premium',  accent: '#FF2277', badge: 'Top conversion', productType: 'wellness'  as ProductType, themed: true  },
]

// ─── RENDER ───────────────────────────────────────────────────────────────────

export function renderTemplate(templateId: string, data: LandingPageData): string {
  switch (templateId) {
    case 'etec-blue':       return templateEtecBlue(data)
    case 'etec-noir':       return templateEtecNoir(data)
    case 'etec-rose':       return templateEtecRose(data)
    case 'etec-sage':       return templateEtecSage(data)
    case 'etec-gold':       return templateEtecGold(data)
    case 'etec-energy':     return templateEtecEnergy(data)
    case 'etec-beauty':     return templateEtecBeauty(data)
    case 'etec-style':      return templateEtecStyle(data)
    case 'etec-shopz':      return templateEtecShopz(data)
    case 'etec-velvety':    return templateEtecVelvety(data)
    case 'etec-prime':      return templateEtecPrime(data)
    case 'etec-blusho':     return templateEtecBlusho(data)
    case 'etec-casa':       return templateEtecCasa(data)
    case 'etec-pet':        return templateEtecPet(data)
    case 'etec-gadget':     return templateEtecGadget(data)
    case 'etec-aura':       return templateEtecAura(data)
    case 'etec-luxe':       return templateEtecLuxe(data)
    case 'etec-pulse':      return templateEtecPulse(data)
    case 'etec-nordic':     return templateEtecNordic(data)
    case 'etec-cosmetix':   return templateEtecCosmetix(data)
    case 'etec-trendy':     return templateEtecTrendy(data)
    case 'etec-solo':       return templateEtecSolo(data)
    case 'etec-prestige':   return templateEtecPrestige(data)
    case 'etec-glow':       return templateEtecGlow(data)
    case 'etec-homestyle':  return templateEtecHomestyle(data)
    case 'etec-jewel':      return templateEtecJewel(data)
    case 'etec-techcase':   return templateEtecTechcase(data)
    case 'etec-artisan':    return templateEtecArtisan(data)
    case 'etec-outfit':     return templateEtecOutfit(data)
    case 'etec-ella':       return templateEtecElla(data)
    case 'etec-starter':    return templateEtecStarter(data)
    case 'etec-glowup':     return templateEtecGlowup(data)
    case 'etec-hue':        return templateEtecHue(data)
    case 'etec-interior':   return templateEtecInterior(data)
    case 'etec-platina':    return templateEtecPlatina(data)
    case 'etec-streetz':    return templateEtecStreetz(data)
    case 'etec-poterie':    return templateEtecPoterie(data)
    case 'etec-electro':    return templateEtecElectro(data)
    case 'etec-agency':     return templateEtecAgency(data)
    case 'etec-supreme':    return templateEtecSupreme(data)
    case 'etec-quarter':    return templateEtecQuarter(data)
    case 'etec-boost':      return templateEtecBoost(data)
    case 'minimal-dark':
    case 'gaming-zone':
    case 'automotive-pro':  return templateEtecNoir(data)
    case 'clean-white':
    case 'mobile-first':
    case 'tech-gadget':
    case 'travel-nomad':    return templateEtecBlue(data)
    case 'bold-sales':
    case 'bold-orange':
    case 'sportif-energie':
    case 'kids-colorful':
    case 'foodie-gourmet':  return templateEtecEnergy(data)
    case 'luxury':
    case 'luxe-noir':
    case 'premium-glass':   return templateEtecGold(data)
    case 'shein-pro':
    case 'beauty-studio':
    case 'pet-love':        return templateEtecRose(data)
    case 'natural-organic':
    case 'home-deco':       return templateEtecSage(data)
    default:                return templateEtecBlue(data)
  }
}
