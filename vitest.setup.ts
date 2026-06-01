/**
 * Setup global vitest — exécuté AVANT tous les imports de chaque fichier de test.
 *
 * Sert à initialiser les env vars que les modules lisent au import-time
 * (`const SECRET = process.env.ENCRYPTION_KEY`). vi.stubEnv() dans le fichier
 * de test est trop tardif : les imports ESM sont hoisted, donc le module
 * est chargé avant que vi.stubEnv s'exécute.
 *
 * Pour ajouter une variable test-only ici, prendre une valeur DUMMY évidente
 * (jamais un secret réel). Les tests qui font du HMAC/signature utilisent
 * cette même valeur via process.env.ENCRYPTION_KEY.
 */

// Clé 32 chars+ pour HMAC SHA-256. Valeur dummy uniquement pour les tests.
process.env.ENCRYPTION_KEY = process.env.ENCRYPTION_KEY ?? 'test-secret-key-for-unsubscribe-route-tests-32c'
process.env.NEXT_PUBLIC_APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://konvertpilot.com'
