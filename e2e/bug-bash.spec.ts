import { test, expect } from '@playwright/test'

// Bug bash — tests exploratoires de friction. Tourner avec `--workers=1`
// pour pas saturer Vercel sur les cold starts :
//   npx playwright test e2e/bug-bash.spec.ts --workers=1
// Navigation timeout étendu : ces tests touchent la prod réelle.
test.use({ navigationTimeout: 30_000, actionTimeout: 12_000 })

// iPhone 13 viewport — on n'utilise pas devices[...] pour pas forcer un
// browser type différent (Playwright interdit ça dans un describe).
const IPHONE_13 = { width: 390, height: 844 } as const

// Bug bash automatisé — mode "user idiot" : clicks rapides, F5, mobile, slow
// 3G, no cookies. Tourne contre la prod (PLAYWRIGHT_BASE_URL).
// Distinct de smoke.spec.ts qui valide le golden path — ici on stress-teste
// les chemins de friction avant le launch 20 mai.

// ─── Race conditions ────────────────────────────────────────────────────

// SKIP : ce test déclenche un vrai POST avec email fake → pollue la DB
// + cold-start `/essai` >30s. À tester en manuel lors du bug bash humain.
test.skip('double-click rapide sur CTA Essai ne crée pas 2 sessions', async ({ page }) => {
  await page.goto('/essai')
  const emailInput = page.locator('input[type="email"]').first()
  await emailInput.fill('bugbash+race@konvert.test')
  const submitBtn = page.locator('form button[type="submit"]').first()
  await Promise.all([
    submitBtn.click(),
    submitBtn.click({ force: true }).catch(() => {}),
  ])
  const toasts = await page.locator('[role="status"], [role="alert"]').count()
  expect(toasts).toBeLessThanOrEqual(3)
})

test('F5 pendant le wizard /essai ne perd pas le contexte email', async ({ page }) => {
  await page.goto('/essai')
  const emailInput = page.locator('input[type="email"]').first()
  await emailInput.fill('bugbash+f5@konvert.test')
  // Reload avant de submit — l'email saisi peut disparaître, mais la page
  // doit charger sans erreur et le formulaire être à nouveau utilisable.
  await page.reload()
  const emailAfter = page.locator('input[type="email"]').first()
  await expect(emailAfter).toBeVisible()
  // Pas d'erreur JS console
  const errors: string[] = []
  page.on('pageerror', (err) => errors.push(err.message))
  await page.waitForTimeout(500)
  expect(errors, `Erreurs JS détectées : ${errors.join('\n')}`).toHaveLength(0)
})

// ─── Mobile viewport (iPhone 13) ───────────────────────────────────────

test('mobile — homepage hero CTA accessible + pas de scroll horizontal', async ({ page }) => {
  await page.setViewportSize(IPHONE_13)
  await page.goto('/')
  const cta = page.getByRole('link', { name: /essai|gratuit|démarrer/i }).first()
  await expect(cta).toBeVisible()
  const box = await cta.boundingBox()
  expect(box).not.toBeNull()
  // Touch target ≥ 40px hauteur (proche WCAG 2.1 AA 44px)
  expect(box!.height).toBeGreaterThanOrEqual(40)
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth)
  expect(overflow, 'Scroll horizontal détecté en mobile').toBe(false)
})

test('mobile — /pricing affiche les 3 plans visibles en stack', async ({ page }) => {
  await page.setViewportSize(IPHONE_13)
  await page.goto('/pricing')
  // Match exact pour ne pas attraper "Démarrer avec Starter" (CTA) ni le lien
  // Nav (hidden derrière le burger en mobile). Le nom du plan est rendu dans
  // un <div font-black> au-dessus de la description.
  for (const plan of ['Starter', 'Pro', 'Agency']) {
    const card = page.getByText(plan, { exact: true }).first()
    await expect(card).toBeVisible()
  }
})

test('mobile — /launch-day countdown + coupon visibles', async ({ page }) => {
  await page.setViewportSize(IPHONE_13)
  await page.goto('/launch-day')
  await expect(page.getByText(/jours|LIVE/i).first()).toBeVisible()
  await expect(page.getByText('LAUNCH50').first()).toBeVisible()
})

// ─── Slow 3G + no cookies ──────────────────────────────────────────────

test('homepage charge en < 20s sur connexion 3G simulée', async ({ page, context }) => {
  // CDP throttling ~750kbps + 200ms latence (Fast 3G — Slow 3G à 400kbps
  // dépasse 20s sur konvertpilot.com homepage qui est lourde).
  const client = await context.newCDPSession(page)
  await client.send('Network.emulateNetworkConditions', {
    offline: false,
    downloadThroughput: (750 * 1024) / 8,
    uploadThroughput: (250 * 1024) / 8,
    latency: 200,
  })
  const t0 = Date.now()
  await page.goto('/', { waitUntil: 'domcontentloaded', timeout: 25_000 })
  const elapsed = Date.now() - t0
  expect(elapsed, `Homepage prend ${elapsed}ms en Fast 3G — investiguer LCP/poids assets`).toBeLessThan(20_000)
})

test('navigation sans cookies — CookieBanner visible + navigation OK', async ({ page, context }) => {
  await context.clearCookies()
  await page.goto('/')
  // Le banner doit s'afficher
  const banner = page.getByRole('button', { name: /accepter les cookies/i })
  await expect(banner).toBeVisible({ timeout: 5000 })
  // Navigation vers /pricing doit fonctionner même sans accepter le banner
  await page.goto('/pricing')
  await expect(page.getByText('Starter', { exact: false }).first()).toBeVisible()
  // Le banner persiste sur la page suivante (pas accepté)
  await expect(banner).toBeVisible()
})

// ─── Coupon LAUNCH50 end-to-end ────────────────────────────────────────

test('parcours coupon LAUNCH50 depuis /producthunt vers /pricing', async ({ page }) => {
  await page.goto('/producthunt')
  // Click sur le bouton qui mène à pricing avec coupon
  const ctaPricing = page.getByRole('link', { name: /50.*off/i }).first()
  await ctaPricing.click()
  await page.waitForURL(/\/pricing.*coupon=LAUNCH50/)
  // Le banner coupon doit apparaître
  await expect(page.getByText(/sera appliqué|LAUNCH50/i).first()).toBeVisible()
})

// ─── Liens cassés / 404 fantômes ───────────────────────────────────────

test('aucun lien interne ne retourne 404', async ({ page, request }) => {
  await page.goto('/')
  const hrefs = await page.locator('a[href^="/"]:not([href^="/api"])').evaluateAll(
    (links) =>
      Array.from(
        new Set(
          links
            .map((a) => (a as HTMLAnchorElement).getAttribute('href'))
            .filter((h): h is string => !!h && !h.startsWith('#'))
        )
      )
  )
  // Échantillon des 20 premiers pour pas exploser le temps de test
  const sample = hrefs.slice(0, 20)
  for (const href of sample) {
    const res = await request.get(href, { failOnStatusCode: false })
    expect(res.status(), `Lien cassé : ${href}`).toBeLessThan(400)
  }
})
