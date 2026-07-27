// Store Builder for Shopify — parsing du template JSON du thème (Theme
// Asset API `templates/product.json`) pour en extraire les settings des
// sections `konvert-*` installées par le générateur (Sprint 7). Pur —
// aucun accès réseau, testable avec des fixtures JSON.
//
// Rappel architecture Online Store 2.0 : dans un template JSON, les
// sections ne sont PAS des fichiers séparés par instance — leurs settings
// vivent directement dans `templates/product.json` sous `sections.<id>`,
// le `.liquid` n'étant qu'un "shape" réutilisable. On lit donc le template
// entier puis on retrouve la section par son `type`.

export interface ThemeTemplateBlock {
  type?: string
  settings?: Record<string, unknown>
}

export interface ThemeTemplateSection {
  type?: string
  settings?: Record<string, unknown>
  blocks?: Record<string, ThemeTemplateBlock>
  block_order?: string[]
}

export interface ThemeTemplate {
  sections: Record<string, ThemeTemplateSection>
  order?: string[]
}

/** Parse le contenu brut (string) de l'asset `templates/product.json`.
 * Renvoie `null` si le JSON est invalide ou ne respecte pas la forme
 * minimale attendue — jamais de throw (l'appelant doit pouvoir marquer les
 * critères concernés "non mesurables" plutôt que planter tout l'audit). */
export function parseThemeTemplate(raw: string): ThemeTemplate | null {
  let data: unknown
  try {
    data = JSON.parse(raw)
  } catch {
    return null
  }
  if (!data || typeof data !== 'object' || !('sections' in data)) return null
  const sections = (data as { sections: unknown }).sections
  if (!sections || typeof sections !== 'object') return null
  return data as ThemeTemplate
}

/** Trouve la première section dont `type` correspond (ex: "konvert-social-proof"). */
export function findSectionByType(template: ThemeTemplate, type: string): ThemeTemplateSection | undefined {
  return Object.values(template.sections).find((s) => s.type === type)
}

/** Lit un setting string d'une section, avec fallback `''` si absent/non-string. */
export function readStringSetting(section: ThemeTemplateSection | undefined, key: string): string {
  const value = section?.settings?.[key]
  return typeof value === 'string' ? value : ''
}

export function readBooleanSetting(section: ThemeTemplateSection | undefined, key: string): boolean {
  const value = section?.settings?.[key]
  return typeof value === 'boolean' ? value : Boolean(value)
}

/** Blocs d'une section, dans l'ordre déclaré (`block_order`) si présent,
 * sinon dans l'ordre d'itération de l'objet — l'ordre n'affecte pas les
 * critères actuels (comptages), gardé pour usages futurs. */
export function sectionBlocks(section: ThemeTemplateSection | undefined): ThemeTemplateBlock[] {
  if (!section?.blocks) return []
  const order = section.block_order ?? Object.keys(section.blocks)
  return order.map((id) => section.blocks![id]).filter((b): b is ThemeTemplateBlock => Boolean(b))
}

/** True si l'id de section `sectionId` apparaît dans `template.order` — le
 * signal utilisé pour le critère #11 "Sticky ATC mobile actif" : une
 * section retirée de `order` (mais toujours définie dans `sections`) n'est
 * plus rendue sur la page. */
export function sectionIsInOrder(template: ThemeTemplate, sectionId: string): boolean {
  return (template.order ?? []).includes(sectionId)
}

/** Trouve l'id de section dont le `type` correspond — utile combiné à
 * `sectionIsInOrder` pour vérifier la présence ET l'activation d'une
 * section dont on ne connaît que le type (pas l'id d'instance). */
export function findSectionIdByType(template: ThemeTemplate, type: string): string | undefined {
  return Object.entries(template.sections).find(([, s]) => s.type === type)?.[0]
}
