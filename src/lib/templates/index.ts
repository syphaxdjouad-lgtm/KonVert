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

export const TEMPLATES = [
  { id: 'etec-blue',    name: 'Blue',    category: 'modern'  as const, fn: templateEtecBlue,    label: 'Tech · Moderne · Universel',          accent: '#0057FF', badge: 'Populaire'     },
  { id: 'etec-noir',    name: 'Noir',    category: 'dark'    as const, fn: templateEtecNoir,    label: 'Premium · Dark · Gaming',             accent: '#7C3AED', badge: ''              },
  { id: 'etec-rose',    name: 'Rose',    category: 'beauty'  as const, fn: templateEtecRose,    label: 'Beauté · Makeup · Skincare',          accent: '#D63370', badge: 'Top conversion' },
  { id: 'etec-sage',    name: 'Sage',    category: 'organic' as const, fn: templateEtecSage,    label: 'Organic · Bio · Bien-être',           accent: '#2D6A4F', badge: ''              },
  { id: 'etec-gold',    name: 'Gold',    category: 'luxury'  as const, fn: templateEtecGold,    label: 'Luxe · Haute Gamme · Or',             accent: '#D4A853', badge: 'Exclusif'      },
  { id: 'etec-energy',  name: 'Energy',  category: 'sport'   as const, fn: templateEtecEnergy,  label: 'Sport · Fitness · DTC',               accent: '#E63000', badge: 'Nouveau'       },
  { id: 'etec-beauty',  name: 'Beauty',  category: 'beauty'  as const, fn: templateEtecBeauty,  label: 'Hair Care · Premium · Organic',       accent: '#E8622A', badge: 'Nouveau'       },
  { id: 'etec-style',   name: 'Style',   category: 'luxury'  as const, fn: templateEtecStyle,   label: 'Fashion · Styling · Luxe accessible', accent: '#C9B49A', badge: 'Nouveau'       },
  { id: 'etec-shopz',   name: 'Shopz',   category: 'modern'  as const, fn: templateEtecShopz,   label: 'E-commerce · Clothing · Shopz Style', accent: '#1A5C30', badge: 'Nouveau'       },
  { id: 'etec-velvety', name: 'Velvety', category: 'organic' as const, fn: templateEtecVelvety, label: 'Skincare · Botanique · Haut de gamme',accent: '#4A7C59', badge: 'Nouveau'       },
  { id: 'etec-prime',   name: 'Prime',   category: 'modern'  as const, fn: templateEtecPrime,   label: 'Supplements · Health · DTC Premium',  accent: '#3CB043', badge: 'Nouveau'       },
  { id: 'etec-blusho',  name: 'Blusho',  category: 'beauty'  as const, fn: templateEtecBlusho,  label: 'Cosmetics · Skincare · E-com Premium', accent: '#7A8C6E', badge: 'Nouveau'       },
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
