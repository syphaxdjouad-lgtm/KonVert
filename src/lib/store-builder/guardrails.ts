import { R5_FORBIDDEN_KEYS } from './schema'

// ─── Filet de sécurité R5 runtime — défense en profondeur ───────────────────
//
// Le guardrail PRINCIPAL est structurel (schema.ts : `.strict()` + absence
// des champs dans le schéma Zod). Cette fonction est un second filet, pas le
// mécanisme premier : elle scanne récursivement l'objet validé par Zod pour
// vérifier qu'aucune clé de la liste noire R5 n'y apparaît. Elle ne devrait
// JAMAIS déclencher en usage normal — si elle déclenche, c'est le signe qu'un
// futur changement de schéma a réintroduit un champ interdit sans review
// MADARA/OROCHIMARU (cf. spec §7.2, point 2 : "test de non-régression").

export class ForbiddenKeyError extends Error {
  constructor(public readonly key: string, public readonly path: string) {
    super(`Champ R5 interdit détecté dans la sortie du générateur : "${key}" (chemin: ${path})`)
    this.name = 'ForbiddenKeyError'
  }
}

const FORBIDDEN_KEY_SET = new Set<string>(R5_FORBIDDEN_KEYS)

/**
 * Parcourt récursivement un objet JSON quelconque et lève `ForbiddenKeyError`
 * dès qu'une clé de `R5_FORBIDDEN_KEYS` est rencontrée, à quelque profondeur
 * que ce soit. Pure, synchrone, sans effet de bord.
 */
export function assertNoForbiddenKeys(value: unknown, path = '$'): void {
  if (Array.isArray(value)) {
    value.forEach((item, i) => assertNoForbiddenKeys(item, `${path}[${i}]`))
    return
  }
  if (value !== null && typeof value === 'object') {
    for (const [key, nested] of Object.entries(value as Record<string, unknown>)) {
      if (FORBIDDEN_KEY_SET.has(key)) {
        throw new ForbiddenKeyError(key, `${path}.${key}`)
      }
      assertNoForbiddenKeys(nested, `${path}.${key}`)
    }
  }
}
