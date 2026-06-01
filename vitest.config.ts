import { defineConfig } from 'vitest/config'
import path from 'node:path'

// Config Vitest — lance les tests unit côté Node (pas de DOM par défaut).
// Pour les tests qui ont besoin de DOM (composants React), surcharger avec
// /** @vitest-environment happy-dom */ en haut du fichier de test.
export default defineConfig({
  test: {
    environment: 'node',
    include: ['src/**/*.test.{ts,tsx}'],
    exclude: ['node_modules', '.next', 'video', 'e2e'],
    globals: false,
    // setupFiles tourne AVANT tous les imports — indispensable pour les env
    // vars que les modules lisent au import-time (ex: ENCRYPTION_KEY dans
    // unsubscribe-token.ts).
    setupFiles: ['./vitest.setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      include: ['src/lib/**/*.ts'],
      exclude: ['src/lib/**/*.test.ts', 'src/lib/**/types.ts'],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
})
