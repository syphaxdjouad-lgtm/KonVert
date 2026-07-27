import dropshippingTemplate from './dawn-templates/product.dropshipping.json'
import beauteTemplate from './dawn-templates/product.beaute.json'
import techTemplate from './dawn-templates/product.tech.json'
import type { Vertical } from './schema'

// ─── Type minimal du template produit Dawn (JSON `templates/product.*.json`) ─
//
// On ne type QUE ce dont ce module a besoin pour lire/écrire — le fichier
// contient beaucoup plus de settings (couleurs, layout...) qui restent
// `unknown` et ne sont jamais touchés par le générateur IA (cf. spec §2, §9 :
// "hérités du preset thème par vertical, jamais générés par IA").

export interface DawnSectionBlock {
  type: string
  settings?: Record<string, unknown>
}

export interface DawnSection {
  type: string
  settings?: Record<string, unknown>
  blocks?: Record<string, DawnSectionBlock>
  block_order?: string[]
}

export interface DawnProductTemplate {
  sections: Record<string, DawnSection>
  order: string[]
}

const BASE_TEMPLATES: Record<Vertical, DawnProductTemplate> = {
  dropshipping: dropshippingTemplate as DawnProductTemplate,
  beaute: beauteTemplate as DawnProductTemplate,
  tech: techTemplate as DawnProductTemplate,
}

/**
 * Renvoie une COPIE profonde du squelette de template Dawn pour le vertical
 * donné — jamais l'objet original (évite toute mutation partagée entre deux
 * générations concurrentes, cf. `structuredClone` natif Node 18+/Vercel).
 */
export function getBaseTemplate(vertical: Vertical): DawnProductTemplate {
  return structuredClone(BASE_TEMPLATES[vertical])
}
