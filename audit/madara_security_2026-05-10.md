# KONVERT — Audit Sécurité MADARA
**Date :** 2026-05-10  
**Auditeur :** MADARA (NEXARA Security)  
**Périmètre :** Next.js 16.2.1 + Supabase + Stripe + DeepSeek/Anthropic + Firecrawl, déployé Vercel  
**Référence précédente :** AUDIT_LAUNCH_READINESS_v2.md (2026-05-04, score 8.5/10)  

---

## Résumé exécutif

| Criticité | Nb |
|---|---|
| P0 — Vulnérabilité exploitable immédiatement | 3 |
| P1 — Faiblesse exploitable sous condition | 5 |
| P2 — Durcissement recommandé | 6 |

---

## P0 — Vulnérabilités exploitables immédiatement

### P0-01 · Secret ADMIN en query param (timing attack + log exposure)
**Fichier :** `src/app/api/scrape/diagnostic/route.ts:18-19`

**Problème :**
```
const secret = req.nextUrl.searchParams.get('secret')
if (!secret || secret !== process.env.ADMIN_SECRET) {
```
Deux problèmes combinés :
1. **Comparaison non timing-safe** : `secret !== process.env.ADMIN_SECRET` est une comparaison JavaScript standard qui court-circuite dès le premier caractère différent. Un attaquant peut mesurer les temps de réponse pour deviner le secret caractère par caractère (timing oracle).
2. **Secret dans l'URL** : `GET /api/scrape/diagnostic?secret=XXX` — l'URL est loggée par Vercel (access logs), Sentry breadcrumbs, et possiblement par tous les reverse proxies en transit. Si le log Vercel est compromis, `ADMIN_SECRET` l'est aussi.

**PoC :**
```bash
# Timing oracle (depuis un réseau avec latence stable)
time curl "https://konvert.app/api/scrape/diagnostic?secret=a"    # ~10ms
time curl "https://konvert.app/api/scrape/diagnostic?secret=ab"   # ~10.3ms si 'a' est le bon 1er char
# → itération possible sur 62 caractères × longueur du secret
```

**Impact :** Accès complet à `/api/scrape/diagnostic` → exposition de la clé FIRECRAWL (préfixe + longueur), déclenchement de scrapes arbitraires sur les domaines whitelistés.

**Remediation :**
```typescript
// Remplacer la comparaison par crypto.timingSafeEqual + passer le secret en header Authorization
function isAdmin(req: NextRequest) {
  const secret = req.headers.get('x-admin-secret')
  const expected = process.env.ADMIN_SECRET
  if (!secret || !expected) return false
  const a = crypto.createHash('sha256').update(secret).digest()
  const b = crypto.createHash('sha256').update(expected).digest()
  return crypto.timingSafeEqual(a, b)
}
```
Même pattern déjà implémenté dans `/api/admin/waitlist/route.ts:14-21` — aligner diagnostic sur ce modèle.

---

### P0-02 · Next.js 16.2.1 — DoS Server Components (GHSA-q4gf-8mx6-v5v3, HIGH)
**Fichier :** `package.json:36` (`next: 16.2.1`)

**Problème :** CVE dans Next.js ≥16.0.0-beta.0 et <16.2.3 permettant un **Denial of Service via Server Components**. Un attaquant peut envoyer des requêtes malformées qui font planter le runtime server-side, rendant l'app indisponible sur Vercel.

**PoC :** Non publié au moment de l'audit, mais le range de versions est confirmé. Score CVSS non encore publié, Severity npm = HIGH.

**Impact :** Disponibilité — interruption de service complète en prod (toutes les routes Server Components, y compris le dashboard).

**Remediation :**
```bash
npm install next@16.2.3   # ou latest 16.x
```
Vérifier que la mise à jour ne casse pas GrapesJS (`unsafe-eval` dans le CSP builder est déjà prévu).

---

### P0-03 · fast-uri ≤3.1.1 — Path traversal + host confusion (GHSA-q3j6-qgpj-74h6 + GHSA-v39h-62p7-jpjc, HIGH×2)
**Fichier :** `node_modules/@sentry/nextjs` → `fast-uri@≤3.1.1`

**Problème :** `fast-uri` est une dépendance transitive de `@sentry/nextjs`. Deux CVE HIGH :
- `GHSA-q3j6-qgpj-74h6` : path traversal via segments `..` encodés en percent (`%2e%2e`) — peut contourner des vérifications de chemin.
- `GHSA-v39h-62p7-jpjc` : host confusion via délimiteurs encodés dans l'authority — peut tromper une validation d'URL basée sur le parsing de `fast-uri`.

**Impact :** Indirect via Sentry SDK. Si Sentry parse des URLs d'erreur contenant des payloads encodés, ces vulns pourraient être atteintes. Risque principalement sur la route `/monitoring` (Sentry tunnel configuré dans `next.config.ts:104`).

**Remediation :**
```bash
# Override la dépendance transitive dans package.json
"overrides": {
  "fast-uri": "^3.1.2"
}
npm install
```

---

## P1 — Faiblesses exploitables sous condition

### P1-01 · SSRF partiel sur /api/woocommerce/connect — blocklist incomplète
**Fichier :** `src/app/api/woocommerce/connect/route.ts:29-34`

**Problème :** La protection SSRF de la route WooCommerce utilise une blocklist (regex sur hostname), contrairement à `/api/scrape` et `/api/generate` qui utilisent une whitelist stricte (`url-allow.ts`). Patterns manquants dans la blocklist locale :
- `::1` IPv6 loopback (seul `[::1]` est bloqué, pas `::1` sans crochets)
- `0.0.0.0/8` n'est pas complètement couvert
- Adresses IPv6 link-local `fe80::/10` non bloquées
- Métadonnées cloud AWS `169.254.169.254` — présent, mais la regex `/^169\.254\./` couvre l'entier du range, OK

**PoC :**
```bash
curl -X POST https://konvert.app/api/woocommerce/connect \
  -H "Authorization: Bearer <token>" \
  -d '{"store_url":"http://[::1]/admin","consumer_key":"k","consumer_secret":"s"}'
# Résultat attendu si non patché : le serveur tente un fetch vers ::1
```

**Impact conditionnel :** Nécessite un compte authentifié. L'attaquant pourrait faire rebondir des requêtes depuis l'infrastructure Vercel vers des services internes accessibles depuis le réseau cloud.

**Remediation :** Remplacer la blocklist locale par un appel à `validateScrapeUrl()` de `lib/security/url-allow.ts` après avoir ajouté `::1` (sans crochets) et `fe80:` aux `BLOCKED_PATTERNS`. Ou utiliser une whitelist métier pour les URL WooCommerce (domaine arbitraire légitime → whitelist impossible, donc blocklist étendue obligatoire).

---

### P1-02 · /api/generate/public — pas de validation de taille sur `product` input manuel
**Fichier :** `src/app/api/generate/public/route.ts:66-68`

**Problème :**
```typescript
} else if (productInput) {
  product = productInput  // ← aucune validation de taille/structure
}
```
Quand le corps contient `product` (saisie manuelle), l'objet est passé directement à `generateLandingPage()` sans validation de schéma. Un attaquant peut envoyer un `product.description` de plusieurs MB, forçant l'envoi d'un prompt géant à DeepSeek, ce qui :
1. Fait exploser le coût LLM (prompt injection économique)
2. Peut dépasser les limites de tokens du modèle et produire une erreur 500 non gérée

**PoC :**
```bash
curl -X POST https://konvert.app/api/generate/public \
  -d '{"email":"test@test.com","turnstileToken":"valid","product":{"title":"x","description":"A"*500000}}'
```

**Impact :** Abuse du quota LLM (coût financier) + possible DoS de la route publique (5s de traitement pour retourner une erreur).

**Remediation :** Ajouter une validation de taille max sur les champs de `productInput` :
```typescript
const MAX_FIELD = 2000
if (productInput?.description?.length > MAX_FIELD || productInput?.title?.length > 200) {
  return NextResponse.json({ error: 'Données produit trop volumineuses' }, { status: 400 })
}
```

---

### P1-03 · GrapesJS + underscore — DoS via _.flatten/_.isEqual (GHSA-qpx9-hpmf-5gmw)
**Fichier :** `package.json` → `grapesjs@0.22.14` → `underscore@1.13.1`

**Problème :** `underscore ≤1.13.7` est vulnérable à une récursion illimitée dans `_.flatten()` et `_.isEqual()`. GrapesJS utilise underscore (via backbone) pour comparer des structures de contenu éditeur. Un utilisateur authentifié peut construire un JSON de page avec des structures imbriquées circulaires et déclencher un stack overflow côté serveur lors de la sauvegarde.

**Conditions :** Utilisateur authentifié avec accès au builder (toutes les formules).

**Impact :** DoS ciblé sur le processus builder, potentiellement propagé à d'autres requêtes dans le même worker Vercel.

**Remediation :** Mettre à jour GrapesJS dès qu'une version avec `underscore ≥1.13.8` est disponible. En attendant, limiter la profondeur du JSON `json_content` côté API avant persistance en base (guard `JSON.stringify(body).length > MAX_JSON_SIZE`).

---

### P1-04 · Rate limiting absent sur routes non couvertes
**Fichier :** `src/middleware.ts:6-20`

**Routes sans rate limiting identifiées :**
- `/api/workspaces` (GET/POST) — création illimitée de workspaces (même si plan Agency requis, le check est en DB)
- `/api/workspaces/[id]/invite` — envoi illimité d'invitations email (coût Resend)
- `/api/workspaces/[id]/report` — génération PDF illimitée (CPU-bound jsPDF)
- `/api/shopify/push`, `/api/woocommerce/push`, `/api/youcan/push` — push vers API tierces illimité
- `/api/upload` — upload d'images (5MB × ∞ = risque saturation Storage)
- `/api/notifications` — polling sans limite

**Impact :** Abus de ressources facturées (Resend emails, Supabase Storage), saturation CPU sur génération PDF, burn de quota API tierces.

**Remediation :** Ajouter dans `RATE_LIMITS` de `middleware.ts` :
```typescript
'/api/workspaces':          { limit: 20,  windowMs: 60_000 },
'/api/upload':              { limit: 10,  windowMs: 60_000 },
'/api/shopify/push':        { limit: 10,  windowMs: 60_000 },
'/api/woocommerce/push':    { limit: 10,  windowMs: 60_000 },
'/api/youcan/push':         { limit: 10,  windowMs: 60_000 },
```

---

### P1-05 · Webhook Stripe — erreur non-23505 continue le traitement silencieusement
**Fichier :** `src/app/api/stripe/webhook/route.ts:69-73`

**Problème :**
```typescript
if (dupErr) {
  // Erreur autre que duplicate (table absente, RLS, etc.). On log mais on
  // continue le traitement pour ne pas bloquer le webhook.
  console.warn('[webhook] processed_stripe_events insert:', dupErr.message)
}
```
Si la table `processed_stripe_events` est absente (migration non appliquée) ou si la RLS bloque l'insert, le webhook continue le traitement **sans garantie d'idempotence**. Stripe peut rejouer l'event et déclencher une double activation d'abonnement.

**Impact conditionnel :** Requiert un problème d'infrastructure (migration SQL non jouée). En cas de rollback de la migration 20260503, les webhooks re-exécutés après timeout Stripe doubleraient les activations.

**Remediation :** Convertir le `console.warn` en un `return NextResponse.json({ error: 'idempotence_check_failed' }, { status: 500 })` pour forcer Stripe à retry plus tard (quand l'infra est saine) plutôt que de traiter en aveugle.

---

## P2 — Durcissement recommandé

### P2-01 · Headers COEP/COOP absents
**Fichier :** `next.config.ts` — section `commonHeaders`

`Cross-Origin-Opener-Policy` et `Cross-Origin-Embedder-Policy` ne sont pas configurés. Sans COOP, des attaques Spectre cross-origin restent théoriquement possibles sur les navigateurs qui exposent `SharedArrayBuffer`. Sans COEP, les workers Sentry ne peuvent pas utiliser les fonctionnalités avancées d'isolation de processus.

**Remediation :**
```typescript
{ key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
{ key: 'Cross-Origin-Embedder-Policy', value: 'require-corp' },
```
Attention : `COEP: require-corp` casse les iframes tierces (Stripe, Crisp). À appliquer uniquement sur les routes dashboard, pas sur les routes marketing.

---

### P2-02 · CSP `script-src 'unsafe-inline'` sur toutes les routes hors builder
**Fichier :** `next.config.ts:31`

La CSP stricte contient `'unsafe-inline'` dans `script-src`. C'est une concession due aux scripts inline de Stripe et Crisp. Sans nonce ou hash, cette directive affaiblit considérablement la CSP (XSS via injection de `<script>` dans le DOM reste possible si une faille d'injection HTML existe).

**Remediation :** Implémenter des nonces CSP via middleware Next.js (généré par requête et injecté dans les headers + le `<script>` tag de `layout.tsx`). Cela permettrait de remplacer `'unsafe-inline'` par `'nonce-{valeur}'`.

---

### P2-03 · `NEXT_PUBLIC_POSTHOG_KEY` exposé côté client + utilisé côté serveur webhook
**Fichier :** `src/app/api/stripe/webhook/route.ts:10`

La clé PostHog est préfixée `NEXT_PUBLIC_` (donc exposée dans le bundle client, ce qui est normal pour PostHog). Le webhook Stripe l'utilise aussi côté serveur. Ce n'est pas une fuite en soi — la `phc_xxx` est prévue pour être publique — mais si PostHog change sa politique de sécurité et que la clé est abusée pour injecter des événements PostHog depuis l'extérieur, le webhook n'aurait pas de clé serveur dédiée pour distinguer les événements légitimes.

**Remediation :** Conserver le comportement actuel (acceptable pour PostHog), mais documenter que si PostHog introduit une `POSTHOG_PRIVATE_KEY`, l'utiliser côté webhook.

---

### P2-04 · Fallback `http://localhost:3000` dans les URLs Stripe et tracker
**Fichiers :**
- `src/app/api/stripe/checkout/route.ts:45`
- `src/app/api/stripe/portal/route.ts:22`
- `src/app/api/shopify/push/route.ts:52`
- `src/app/api/woocommerce/push/route.ts:55`
- `src/app/api/youcan/push/route.ts:55`
- `src/lib/shopify/index.ts:8`

Si `NEXT_PUBLIC_APP_URL` n'est pas défini en prod (variable Vercel manquante), les `success_url` et `cancel_url` Stripe pointent vers `http://localhost:3000`. L'utilisateur termine un paiement Stripe et est redirigé vers une URL introuvable. Risque faible en prod Vercel (variable définie dans `vercel.json`), mais possible sur des preview deployments sans override.

**Remediation :** Ajouter une assertion au démarrage :
```typescript
// src/lib/config.ts
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL
if (!APP_URL && process.env.NODE_ENV === 'production') {
  throw new Error('NEXT_PUBLIC_APP_URL is required in production')
}
```

---

### P2-05 · RGPD — unsubscribe ne supprime pas les données, marque seulement `converted: true`
**Fichier :** `src/app/api/email/unsubscribe/route.ts:10-23`

La fonction `unsubscribeEmail()` :
- Met `converted: true` sur `public_previews` → la ligne reste en base avec l'email, le HTML généré, le titre produit
- Met `trial_emails_sent: [-1]` sur `users` → les données du profil restent intactes

Le droit à l'oubli RGPD (Art. 17) implique la **suppression** des données personnelles sur demande, pas seulement leur marquage. Un utilisateur non inscrit (preview publique) dont le lead est stocké en `public_previews` avec son email + son HTML pendant 7 jours après expiration ne peut pas exercer un vrai effacement via ce mécanisme.

**Remediation :** Ajouter à `unsubscribeEmail()` la suppression effective ou l'anonymisation :
```typescript
// Anonymiser l'email dans public_previews (garder les stats, supprimer le PII)
await supabaseAdmin
  .from('public_previews')
  .update({ email: '[supprimé]', name: null, html_content: '' })
  .eq('email', normalizedEmail)
```

---

### P2-06 · deleteAccount — workspaces membres non nettoyés
**Fichier :** `src/app/(dashboard)/dashboard/settings/actions.ts:67-84`

Le flux `deleteAccount()` supprime :
- `analytics_events`, `workspace_members`, `pages`, `stores`, `subscriptions`, `workspaces` (owner), `users`

Manque : si l'utilisateur est **membre** d'un workspace dont il n'est pas owner, les workspaces d'autrui contiennent encore sa référence dans `workspace_members`. La ligne est supprimée (`workspace_members.delete().eq('user_id', user.id)`), mais l'email reste dans les invitations (`invitations` table) s'il en a créé.

Également : les fichiers Storage dans `pages-images/{user_id}/` ne sont pas supprimés lors de `deleteAccount()` → données résiduelles en Storage Supabase facturées.

**Remediation :**
```typescript
// Dans deleteAccount(), ajouter :
await supabase.storage.from('pages-images').remove(
  (await supabase.storage.from('pages-images').list(user.id)).data?.map(f => `${user.id}/${f.name}`) || []
)
await supabaseAdmin.from('invitations').delete().eq('email', user.email)
```

---

## Ce qui est SOLIDE — ne pas refaire ces points

**Auth :** Toutes les routes sensibles du dashboard et API appellent `supabase.auth.getUser()` côté serveur (pas uniquement client-side guard). Pas de route API avec auth manquante identifiée dans le périmètre audité.

**RLS Supabase :** Les tables `public_previews`, `ab_events`, `processed_stripe_events` sont verrouillées service_role-only. Les policies `workspace_members` sont correctes (case-insensitive, email normalisé). Le bucket `pages-images` a des policies par namespace `user_id`.

**Webhook Stripe :** Signature validée via `stripe.webhooks.constructEvent()` (library officielle, HMAC SHA-256). Idempotence via `processed_stripe_events` avec contrainte UNIQUE sur `event_id`. Quota atomique via `check_and_increment_quota()` avec `FOR UPDATE`.

**Anti-SSRF scraping :** `validateScrapeUrl()` utilise une whitelist stricte (Set exact, pas de `includes()`/`endsWith()` naïf), bloque les IPs privées, loopback, link-local, métadonnées cloud. Appliqué sur `/api/scrape`, `/api/generate`, `/api/generate/public`.

**Timing-safe :** `/api/admin/waitlist` utilise `crypto.timingSafeEqual()` avec double hash SHA-256. CRON protégé via `timingSafeEqual()` sur l'Authorization header.

**Captcha :** Turnstile Cloudflare sur `/api/generate/public` (seul endpoint LLM sans auth). Bypass explicitement désactivé si `TURNSTILE_SECRET_KEY` absent (blocage systématique, pas de bypass silencieux).

**Input validation :** Workspaces valident longueur (100 chars max), email format, couleur hex/rgb. Upload valide MIME type + taille (5MB). Analytics track valide UUID et event_type via whitelist.

**Shopify OAuth :** State CSRF généré + vérifié en cookie. HMAC Shopify vérifié avant échange du code. Shop domain validé par regex stricte (`.myshopify.com`).

**Headers sécurité :** HSTS (31536000 + includeSubDomains + preload), X-Frame-Options DENY, X-Content-Type-Options nosniff, Referrer-Policy strict-origin-when-cross-origin, Permissions-Policy restrictive. CSP différenciée (stricte vs builder GrapesJS avec `unsafe-eval`).

**Secrets :** Aucun secret hardcodé trouvé dans le code source. `.env.example` sans valeurs réelles. Tokens Shopify/WooCommerce/YouCan chiffrés AES avant stockage DB.

**RGPD compte complet :** `deleteAccount()` annule l'abonnement Stripe, supprime toutes les tables liées, supprime le compte Supabase Auth. Unsubscribe email via token HMAC signé (pas de lien devinable).

**Dépendances :** 0 Critical. 4 High (dont 2 sur fast-uri transitive Sentry, 1 sur Next.js, 1 sur underscore via GrapesJS). Aucune CVE directement exploitable sur le code applicatif KONVERT sans passer par une dépendance tierce.

---

## Plan d'action priorisé

| Priorité | Item | Effort | Fichier |
|---|---|---|---|
| P0 immédiat | Corriger timing attack + query param secret diagnostic | 15min | `scrape/diagnostic/route.ts` |
| P0 immédiat | `npm install next@16.2.3` | 5min | `package.json` |
| P0 immédiat | Override `fast-uri` ≥3.1.2 | 5min | `package.json` |
| P1 cette semaine | Étendre blocklist SSRF WooCommerce (IPv6 `::1`, `fe80:`) | 30min | `woocommerce/connect/route.ts` |
| P1 cette semaine | Valider taille/structure `productInput` sur generate/public | 20min | `generate/public/route.ts` |
| P1 cette semaine | Rate limiting sur upload, push, workspaces | 15min | `middleware.ts` |
| P1 cette semaine | Webhook : retourner 500 si idempotence check échoue | 10min | `stripe/webhook/route.ts` |
| P2 quand possible | COEP/COOP headers (dashboard uniquement) | 30min | `next.config.ts` |
| P2 quand possible | Anonymisation PII dans unsubscribe | 20min | `email/unsubscribe/route.ts` |
| P2 quand possible | Purge Storage + invitations dans deleteAccount | 30min | `settings/actions.ts` |
| P2 quand possible | Assertion APP_URL en prod | 10min | `lib/config.ts` nouveau fichier |

**Score estimé après correction P0+P1 : 9.2/10**

