import { defineConfig, devices } from '@playwright/test'

// Smoke E2E — tournent contre l'URL prod par défaut (`PLAYWRIGHT_BASE_URL`).
// En CI ou local sans cette var, fallback sur konvertpilot.com.
//
// Pas d'instance dev locale automatique (`webServer`) — on teste la prod réelle.
// Pour tester en local, lancer `npm run dev` dans un autre terminal puis
// `PLAYWRIGHT_BASE_URL=http://localhost:3000 npx playwright test`.

const baseURL = process.env.PLAYWRIGHT_BASE_URL || 'https://konvertpilot.com'

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: process.env.CI ? [['github'], ['list']] : 'list',
  timeout: 30_000,

  use: {
    baseURL,
    trace: 'on-first-retry',
    // Pas d'attente exagérée — un smoke doit être rapide. Si une page charge
    // > 15s c'est qu'un truc va mal, on veut savoir.
    navigationTimeout: 15_000,
    actionTimeout: 8_000,
    // User-Agent désambigu pour les logs Vercel — qu'on identifie nos tests
    // si jamais on les confond avec du trafic réel.
    userAgent: 'KONVERT-Playwright/1.0 (e2e smoke test)',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
})
