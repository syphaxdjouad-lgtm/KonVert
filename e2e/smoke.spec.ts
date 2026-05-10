import { test, expect } from '@playwright/test'

// Smoke tests — chaque test vérifie un signal critique de prod.
// Doivent rester rapides (< 30s total) pour pouvoir tourner avant chaque deploy.
// Aucun test qui consomme du quota DeepSeek réel ou crée des données en DB.

test('homepage charge avec status 200 + tagline visible', async ({ page }) => {
  const response = await page.goto('/')
  expect(response?.status()).toBe(200)
  // La tagline officielle doit être présente quelque part dans le HTML
  // (badge hero + meta + footer). Test "any of" via locator first().
  const tagline = page.getByText('Tes produits méritent des pages qui vendent').first()
  await expect(tagline).toBeVisible()
})

test('robots.txt sert correctement', async ({ request }) => {
  const res = await request.get('/robots.txt')
  expect(res.status()).toBe(200)
  const body = await res.text()
  expect(body).toContain('Sitemap:')
  expect(body).toContain('Disallow: /dashboard/')
  expect(body).toContain('Disallow: /api/')
})

test('sitemap.xml sert un XML valide', async ({ request }) => {
  const res = await request.get('/sitemap.xml')
  expect(res.status()).toBe(200)
  const body = await res.text()
  expect(body).toContain('<?xml')
  expect(body).toContain('<urlset')
  expect(body).toContain('<loc>')
})

test('llms.txt sert le format llmstxt.org', async ({ request }) => {
  const res = await request.get('/llms.txt')
  expect(res.status()).toBe(200)
  const body = await res.text()
  expect(body).toContain('# KONVERT')
  expect(body).toContain('Tes produits méritent des pages qui vendent')
})

test('/api/health renvoie status ok + commit SHA', async ({ request }) => {
  const res = await request.get('/api/health')
  expect(res.status()).toBe(200)
  const body = await res.json()
  expect(body.status).toBe('ok')
  expect(body.commit).toMatch(/^[0-9a-f]{7}$/)
})

test('/api/health/deep refuse sans x-admin-secret', async ({ request }) => {
  const res = await request.get('/api/health/deep')
  expect(res.status()).toBe(403)
})

test('/api/scrape/diagnostic refuse sans header (P0-2 timing-safe)', async ({ request }) => {
  const resNoHeader = await request.get('/api/scrape/diagnostic')
  expect(resNoHeader.status()).toBe(403)
  // Ancien pattern ?secret= en query ne doit plus suffire
  const resQuery = await request.get('/api/scrape/diagnostic?secret=anything')
  expect(resQuery.status()).toBe(403)
})

test('/api/email/unsubscribe refuse les requêtes sans token', async ({ request }) => {
  const res = await request.get('/api/email/unsubscribe')
  expect(res.status()).toBe(400)
  const resGetWithBadToken = await request.get('/api/email/unsubscribe?email=x@y.com&token=fake')
  expect(resGetWithBadToken.status()).toBe(403)
})

test('/api/woocommerce/connect refuse les IPs privées (SSRF)', async ({ request }) => {
  // 4 vecteurs SSRF qui doivent tous renvoyer 400 (audit Madara P1-01)
  for (const url of [
    'http://localhost',
    'http://[::1]',
    'http://169.254.169.254',
    'http://10.0.0.1',
  ]) {
    const res = await request.post('/api/woocommerce/connect', {
      data: { store_url: url, consumer_key: 'x', consumer_secret: 'x' },
    })
    expect(res.status(), `URL bloquée attendue : ${url}`).toBe(400)
  }
})

test('/pricing affiche les 4 plans + toggle annuel', async ({ page }) => {
  await page.goto('/pricing')
  // Les 4 noms de plans doivent être visibles
  await expect(page.getByText('Starter', { exact: false }).first()).toBeVisible()
  await expect(page.getByText('Pro', { exact: false }).first()).toBeVisible()
  await expect(page.getByText('Agency', { exact: false }).first()).toBeVisible()
  await expect(page.getByText('Enterprise', { exact: false }).first()).toBeVisible()
  // Toggle annuel cliquable — le bouton dit "Annuel -25%", le texte simple suffit
  const annualToggle = page.getByText('Annuel', { exact: false }).first()
  await expect(annualToggle).toBeVisible()
  await annualToggle.click()
  // Au moins un prix annuel (31, 63 ou 159) doit apparaître
  await expect(page.locator('body')).toContainText(/31\s*€|63\s*€|159\s*€/)
})

test('/affiliate page existe et affiche le programme 20-30%', async ({ page }) => {
  await page.goto('/affiliate')
  // Plusieurs occurrences "20-30 %" sur la page (hero + chiffre clé) — .first()
  await expect(page.getByText('20-30 %').first()).toBeVisible()
  await expect(page.getByText('PROGRAMME AFFILIÉ', { exact: true })).toBeVisible()
  // Form pre-inscription doit avoir un input email
  const emailInput = page.locator('input[type="email"]').first()
  await expect(emailInput).toBeVisible()
})

test('/essai charge le formulaire email', async ({ page }) => {
  await page.goto('/essai')
  // L'étape email doit être visible
  const emailInput = page.locator('input[type="email"]').first()
  await expect(emailInput).toBeVisible()
})

test('CookieBanner s\'affiche au premier visit + a11y touch targets', async ({ page, context }) => {
  // Clear cookies pour forcer l'affichage du banner
  await context.clearCookies()
  await page.goto('/')
  // Le banner doit apparaître
  const acceptBtn = page.getByRole('button', { name: 'Accepter les cookies' })
  await expect(acceptBtn).toBeVisible({ timeout: 5000 })
  // Touch target ≥ 44px (WCAG 2.1 AA — fix S2)
  const box = await acceptBtn.boundingBox()
  expect(box).not.toBeNull()
  expect(box!.height).toBeGreaterThanOrEqual(44)
})

test('pages /about + /features + /demo retournent 200', async ({ request }) => {
  for (const path of ['/about', '/features', '/demo', '/templates', '/blog', '/contact']) {
    const res = await request.get(path)
    expect(res.status(), `${path} doit être 200`).toBe(200)
  }
})

test('Schema.org JSON-LD présent sur homepage', async ({ page }) => {
  await page.goto('/')
  // Au moins 2 scripts JSON-LD (Organization + SoftwareApplication)
  const ldScripts = await page.locator('script[type="application/ld+json"]').count()
  expect(ldScripts).toBeGreaterThanOrEqual(2)
  // Récupère le contenu du 1er pour vérifier qu'il contient @type:Organization
  const firstLd = await page.locator('script[type="application/ld+json"]').first().textContent()
  expect(firstLd).toContain('"Organization"')
})

// ─── S4 — Launch week pages ─────────────────────────────────────────────

test('/producthunt landing affiche coupon LAUNCH50 + offre 50%', async ({ page }) => {
  await page.goto('/producthunt')
  // Hero badge
  await expect(page.getByText('BIENVENUE PRODUCTHUNT')).toBeVisible()
  // Coupon visible et copiable
  await expect(page.getByText('LAUNCH50').first()).toBeVisible()
  // CTA principal vers /pricing avec coupon
  const cta = page.getByRole('link', { name: /50.*off/i }).first()
  await expect(cta).toBeVisible()
  // Schema SaleEvent injecté
  const ldScripts = await page.locator('script[type="application/ld+json"]').count()
  expect(ldScripts).toBeGreaterThanOrEqual(1)
})

test('/launch-day affiche countdown ou mode LIVE', async ({ page }) => {
  await page.goto('/launch-day')
  // L'un OU l'autre doit être présent : countdown (avant launch) ou "LIVE" (pendant)
  const heroText = await page.locator('h1').first().textContent()
  expect(heroText).toMatch(/bientôt|LIVE/i)
  // Le code coupon doit être visible quel que soit l'état
  await expect(page.getByText('LAUNCH50').first()).toBeVisible()
})

test('/pricing?coupon=LAUNCH50 affiche le banner coupon', async ({ page }) => {
  await page.goto('/pricing?coupon=LAUNCH50')
  // Banner "Code LAUNCH50 sera appliqué" doit être visible
  await expect(page.getByText(/sera appliqué/i)).toBeVisible()
  await expect(page.getByText('LAUNCH50', { exact: false })).toBeVisible()
})

test('ProductHuntBanner s\'affiche depuis ?ref=ph et persiste après dismiss', async ({ page, context }) => {
  // Force premier visit (pas de cookie _konvert_ph_seen)
  await context.clearCookies()
  await page.goto('/?ref=ph')
  // Le banner doit apparaître après le délai 800ms — on attend visible
  const banner = page.getByText(/Bienvenue depuis ProductHunt/i)
  await expect(banner).toBeVisible({ timeout: 5000 })
  // Dismiss via le bouton X
  const closeBtn = page.getByRole('button', { name: /Fermer le bandeau ProductHunt/i })
  await closeBtn.click()
  await expect(banner).not.toBeVisible()
  // Reload : le banner ne doit PAS réapparaître (cookie set)
  await page.goto('/?ref=ph')
  await page.waitForTimeout(1500) // au-delà du délai 800ms du banner
  await expect(banner).not.toBeVisible()
})
