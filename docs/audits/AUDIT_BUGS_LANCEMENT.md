# 🔍 AUDIT BUGS KONVERT — Pré-lancement

**Date** : 2026-05-03 · **Lancement prévu** : 2026-05-05 (J-2)
**Périmètre** : dashboard + génération + intégrations + Stripe + auth
**Build** : ✅ 82 pages OK · TypeScript ✅ · Pas d'erreur compile

---

## 📊 RÉSUMÉ EXÉCUTIF

| Sévérité | Nombre | Action |
|---|---|---|
| 🔴 CRITICAL | **11** | À fixer absolument avant J-2 |
| 🟠 HIGH | **24** | À fixer si possible avant J |
| 🟡 MEDIUM | **18** | Post-lancement OK |

**Estimation totale CRITICAL + HIGH** : ~14h de dev focused.

**Top 3 risques au lancement** :
1. Génération IA peut **timeout en prod** (`maxDuration` non défini, 10s défaut Vercel < 18-22s DeepSeek)
2. **Photos / vidéos uploadées en base64** stockées dans le JSON Supabase → crash DB sur 3-4 photos
3. Whitelist scraping limitée à AliExpress/Amazon/Alibaba alors que **le wizard promet Shopify, Etsy "et plus"** → 403 systématique

---

## 🔴 CRITICAL — Bloquants lancement

### 1. Génération IA va timeout en production
- **Fichier** : `src/app/api/generate/route.ts`
- **Symptôme** : Pas de `export const maxDuration = ...` → Vercel Hobby 10s, Pro 60s par défaut
- **Repro** : DeepSeek prend 18-22s → timeout 504, quota déjà consommé
- **Fix** : Ajouter `export const maxDuration = 60` en haut du fichier (idem `/api/generate/public`)
- **Effort** : 5min

### 2. Quota consommé même si la génération échoue
- **Fichier** : `src/app/api/generate/route.ts:23-36`
- **Symptôme** : `check_and_increment_quota` est appelé AVANT l'appel DeepSeek. Si DeepSeek timeout/JSON invalide, l'user perd 1 page de quota
- **Repro** : DeepSeek 500 → user reste bloqué à -1 page
- **Fix** : Soit décrémenter en cas d'erreur, soit séparer `check_quota` (lecture seule) puis `increment_quota` après succès
- **Effort** : 30min (RPC SQL à modifier)

### 3. Photos uploadées en base64 dans la DB
- **Fichier** : `src/app/(dashboard)/dashboard/new/page.tsx:279-305`, `savePage:382-391`
- **Symptôme** : `FileReader.readAsDataURL` → photos en `data:image/jpeg;base64,...` stockées dans `uploadedPhotos`, propagées dans `landingData.images` puis insérées dans `pages.json_content`
- **Repro** : User uploade 5 photos de 2 MB → JSON ~13 MB → DB rejet ou Vercel 4.5 MB body limit
- **Fix** : Upload vers Supabase Storage (bucket `pages-images`) et stocker URLs publiques uniquement
- **Effort** : 2h (route upload + bucket + remplacement côté client)

### 4. Vidéos UGC en base64 (même problème en pire)
- **Fichier** : `src/app/(dashboard)/dashboard/new/page.tsx:297-306`, `setUgcVideos`
- **Symptôme** : Vidéos 50-100 MB encodées en data URL → état React géant + serialization JSON impossible
- **Repro** : User uploade 1 vidéo MP4 100 MB → browser freeze + crash
- **Fix court terme** : Désactiver l'upload vidéo, garder uniquement l'onglet "Liens externes" (YouTube/TikTok URLs)
- **Effort** : 5min (cacher l'onglet) | 3h (upload Supabase)

### 5. Whitelist URL scraping cassée vs promesse wizard
- **Fichier** : `src/lib/security/url-allow.ts:8-18`
- **Symptôme** : Whitelist contient seulement aliexpress, amazon (FR/UK/DE/ES/IT/CA/COM), alibaba. Wizard promet "AliExpress, Amazon, Alibaba, Shopify, Etsy et plus" (`new/page.tsx:657`)
- **Repro** : User colle `https://maboutique.myshopify.com/products/xyz` → 403 "Domaine non supporté"
- **Fix** : Élargir whitelist (myshopify.com via wildcard contrôlé, etsy.com, ebay.com/fr, cdiscount.com, fnac.com, aliexpress.us, aliexpress.ru, aliexpress.es) ET mettre à jour le texte wizard
- **Effort** : 30min

### 6. Webhook Stripe downgrade vers 'starter' au lieu de 'free'
- **Fichier** : `src/app/api/stripe/webhook/route.ts:115-121`
- **Symptôme** : Sur `customer.subscription.deleted`, le plan est mis à `'starter'` → un user qui annule garde un plan PAYANT (75 pages/mois) gratuitement
- **Repro** : User Pro annule → reste sur starter avec quota Pro non reset
- **Fix** : Utiliser `'free'` (1 page/mois) ou créer un plan "canceled" sans quota. Vérifier que `PLAN_LIMITS.free` existe dans `src/types`
- **Effort** : 30min

### 7. Cron `trial-emails` spamme les users payants
- **Fichier** : `src/app/api/cron/trial-emails/route.ts:59`
- **Symptôme** : Filtre `plan in ['starter', null]`, mais `'starter'` est aussi le plan **payant** Starter (39€/mois). Tous les abonnés Starter reçoivent les emails trial
- **Repro** : User paie Starter → reçoit email "Ton trial expire dans 14 jours" 7 fois sur 14 jours
- **Fix** : Soit ajouter une colonne `is_trial: boolean`, soit filtrer sur `subscriptions.status` à NULL/canceled
- **Effort** : 1h (migration + update logique)

### 8. RLS Stores : delete sans filtre user_id
- **Fichier** : `src/app/(dashboard)/dashboard/stores/page.tsx:146`, `:93`
- **Symptôme** : `supabase.from('stores').delete().eq('id', deleteTarget.id)` — repose 100% sur RLS Supabase
- **Repro** : Si la policy RLS Stores n'est pas appliquée correctement, un user peut supprimer le store d'un autre. **À VÉRIFIER MAINTENANT** dans Supabase Dashboard
- **Fix** : Ajouter `.eq('user_id', userId)` côté client en plus de la RLS (defense in depth)
- **Effort** : 10min

### 9. Pages dashboard marquées en static dans le build
- **Fichier** : Build output → `/dashboard/agency`, `/dashboard/new`, `/dashboard/stores` sont `○` (Static) au lieu de `ƒ` (Dynamic)
- **Symptôme** : Ces pages sont des `'use client'` mais leur HTML statique peut leak entre users (cache CDN partagé)
- **Repro** : User A crée une page → user B au même moment voit potentiellement le HTML d'A
- **Fix** : Ajouter `export const dynamic = 'force-dynamic'` ou consommer cookies/headers en server component parent
- **Effort** : 15min

### 10. Bouton "Publier" inaccessible pour nouvelle page
- **Fichier** : `src/app/(dashboard)/dashboard/new/page.tsx:458`
- **Symptôme** : Bouton n'apparaît que si `pageId && stores.length > 0`. Pour une nouvelle page, `pageId === null` → l'user doit Save → redirigé vers `/pages` → revenir avec `?page_id=...` pour publier. Friction énorme à la conversion
- **Fix** : Sauvegarder automatiquement la page au premier `editor mount`, recevoir l'`id` créé, puis afficher le bouton Publier
- **Effort** : 1h

### 11. Pages test/demo accessibles en prod
- **Build** : `/test-builder`, `/test-generate`, `/framer-demo`, `/framer-test`, `/api-docs`
- **Symptôme** : 5 routes de dev visibles en production, indexables Google, peuvent leak des données mock ou crash
- **Fix** : Ajouter ces routes dans `robots.txt` + supprimer les fichiers ou wrap dans `if (process.env.NODE_ENV !== 'production') notFound()`
- **Effort** : 15min

---

## 🟠 HIGH — À fixer avant lancement si possible

### Génération & wizard

### 12. Pas de timeout sur l'appel DeepSeek
- **Fichier** : `src/lib/anthropic/generate.ts:295-311`
- **Fix** : Ajouter `signal: AbortSignal.timeout(50000)` sur le `fetch`
- **Effort** : 5min

### 13. Wizard envoie `tone`, `language`, `platform` mais `platform` jamais utilisé
- **Fichier** : `src/app/(dashboard)/dashboard/new/page.tsx:185, 322-340`
- **Symptôme** : User choisit "WooCommerce" → comportement identique. Étape inutile
- **Fix** : Soit supprimer l'étape, soit l'utiliser pour pré-sélectionner le store dans le bouton Publier
- **Effort** : 30min

### 14. Photos avant/après et UGC envoyées en string `'[vidéos uploadées]'`
- **Fichier** : `src/app/(dashboard)/dashboard/new/page.tsx:324, 337`
- **Symptôme** : Le backend ne sait rien faire de cette string, et les photos avant/après ne sont JAMAIS envoyées au générateur
- **Fix** : Soit retirer ces étapes du wizard si non implémentées, soit les uploader (cf bug #3)
- **Effort** : 30min (retirer) | 3h (implémenter)

### 15. Langue `zh` (chinois) tombe en fallback `fr` silencieusement
- **Fichier** : `src/lib/anthropic/generate.ts:30, 61` · `LANGUAGES` dans wizard:91
- **Symptôme** : User choisit 中文 → reçoit page en français sans warning
- **Fix** : Soit retirer `zh` du wizard, soit l'ajouter à `ALLOWED_LANGS`
- **Effort** : 5min

### 16. Pas de retry sur DeepSeek 429/500
- **Fichier** : `src/lib/anthropic/generate.ts:313-315`
- **Symptôme** : 1 seul shot. DeepSeek peut être flaky, 1 erreur = quota perdu
- **Fix** : Retry x2 avec backoff sur 429 et 5xx
- **Effort** : 20min

### 17. Loader génération promet "30 secondes"
- **Fichier** : `src/app/(dashboard)/dashboard/new/page.tsx:1107`
- **Symptôme** : Texte "Résultat en moins de 30 secondes" mais réel = 25-40s (scrape + LLM)
- **Fix** : Retirer la promesse temporelle ou afficher progression réelle
- **Effort** : 5min

### 18. Bouton Générer pas désactivé pendant la génération
- **Fichier** : `src/app/(dashboard)/dashboard/new/page.tsx:1095`
- **Symptôme** : Re-clic possible → multiple appels API et quota brûlé
- **Fix** : Ajouter `disabled={mode === 'generating'}` et early return dans `generate()`
- **Effort** : 5min

### 19. Si page existante chargée n'appartient pas à l'user, wizard vide sans message
- **Fichier** : `src/app/(dashboard)/dashboard/new/page.tsx:217`
- **Symptôme** : `?page_id=X` qui ne match pas RLS → `data === null` → wizard vide sans erreur
- **Fix** : Afficher un toast "Page introuvable" et rediriger vers `/dashboard/pages`
- **Effort** : 10min

### 20. `published_id` typé incohérent (number vs string)
- **Fichier** : `src/app/api/{shopify,woocommerce,youcan}/push/route.ts`
- **Symptôme** : Shopify/Woo `number`, YouCan `string`. Si la colonne DB est `bigint`, YouCan IDs peuvent casser
- **Fix** : Vérifier que la colonne `pages.published_id` est en `text` Supabase
- **Effort** : 10min (vérif) + migration si besoin

### 21. Republication écrase les méta de l'autre store
- **Fichier** : Tous les `*/push/route.ts`
- **Symptôme** : Push Shopify puis push Woo → `published_url` et `published_id` écrasés. L'user perd la trace de la version Shopify
- **Fix** : Stocker un objet `published: { shopify: {id, url}, woo: {...}, youcan: {...} }` ou table dédiée
- **Effort** : 1h

### 22. Push Shopify/Woo/YouCan : pas de `maxDuration`
- **Fichier** : `src/app/api/{shopify,woocommerce,youcan}/push/route.ts`
- **Symptôme** : 10s par défaut peut être insuffisant
- **Fix** : `export const maxDuration = 30`
- **Effort** : 5min

### Dashboard & UX

### 23. Aucune action "Voir la page publiée" / "Supprimer" sur la liste pages
- **Fichier** : `src/app/(dashboard)/dashboard/pages/PagesClient.tsx:334-368`
- **Symptôme** : User publie une page mais ne peut pas l'ouvrir depuis le dashboard. Pas de delete non plus
- **Fix** : Ajouter actions `Eye → published_url` et `Trash → confirm + delete`
- **Effort** : 1h

### 24. Pas de pagination sur `/dashboard/pages` ni `/dashboard/analytics`
- **Symptôme** : User avec 200+ pages = freeze
- **Fix** : Limit 50 + pagination ou virtualisation
- **Effort** : 1h

### 25. `loadStores()` sans filtre user_id
- **Fichier** : `src/app/(dashboard)/dashboard/stores/page.tsx:93`
- **Fix** : Ajouter `.eq('user_id', user.id)` (defense in depth)
- **Effort** : 5min

### 26. Pas de guard sur le quota stores par plan
- **Fichier** : Wizard + `/api/stores` (à créer)
- **Symptôme** : Plan Starter `stores: 1` mais l'user peut connecter 10 stores en bypass
- **Fix** : Check côté API connect (Shopify/Woo/YouCan) du quota plan
- **Effort** : 30min

### 27. Pas de validation client URL Woo / token YouCan
- **Fichier** : `src/app/(dashboard)/dashboard/stores/page.tsx:289-321, 233-285`
- **Fix** : Regex URL https + length min token
- **Effort** : 10min

### 28. Bouton "A/B test" même quand page draft
- **Fichier** : `src/app/(dashboard)/dashboard/pages/PagesClient.tsx:336`
- **Symptôme** : Lien actif vers la page A/B avec page non publiée
- **Fix** : `disabled` ou cacher si `status !== 'published'`
- **Effort** : 5min

### Stripe

### 29. Pas de déduplication d'events Stripe (idempotence)
- **Fichier** : `src/app/api/stripe/webhook/route.ts`
- **Symptôme** : Stripe peut rejouer un event → double event PostHog `subscription_started`
- **Fix** : Stocker `event.id` dans une table `processed_stripe_events`, skip si déjà vu
- **Effort** : 30min

### 30. Pas de Trial period Stripe configuré
- **Fichier** : `src/app/api/stripe/checkout/route.ts:46`
- **Symptôme** : Séquence email trial 14j parle de trial mais Stripe checkout est immédiat → confusion
- **Fix** : Soit ajouter `subscription_data: { trial_period_days: 14 }`, soit aligner messaging emails
- **Effort** : 15min

### 31. `webhook` en cas d'erreur retourne 500 → Stripe rejoue indéfiniment
- **Fichier** : `src/app/api/stripe/webhook/route.ts:181-184`
- **Fix** : Logger Sentry + retourner 200 sauf si erreur transitoire identifiée
- **Effort** : 15min

### Auth & sécurité

### 32. Middleware appelle `getUser()` à chaque request (assets inclus)
- **Fichier** : `src/middleware.ts:60-64`
- **Symptôme** : Matcher exclut images mais pas fonts/JSON → coût Supabase élevé
- **Fix** : Élargir le matcher : `(?!_next|.*\\.(svg|png|jpg|woff2?|json|ico)$)`
- **Effort** : 5min

### 33. Cron preview-emails ignore unsubscribe
- **Fichier** : `src/app/api/cron/preview-emails/route.ts:71-83`
- **Symptôme** : Pas de check du sentinel -1 ni d'une table d'unsubscribe → spam après désinscription
- **Fix** : Ajouter check identique à `trial-emails`
- **Effort** : 10min

### 34. Cron limite 500 sans pagination
- **Fichier** : Les deux crons
- **Symptôme** : >500 users = certains skipped silencieusement
- **Fix** : Loop avec `range()` Supabase ou warning si limit atteinte
- **Effort** : 20min

### 35. Sentry/middleware deprecated Next 16
- **Build warning** : "middleware" file convention deprecated, `automaticVercelMonitors` deprecated
- **Fix** : Renommer `src/middleware.ts` → `src/proxy.ts`, mettre à jour `sentry.config.ts`
- **Effort** : 30min

---

## 🟡 MEDIUM — Post-lancement OK

36. **CTR analytics** : pas de filtre période (figé 30j) — `analytics/page.tsx:27`
37. **Stores** : pas d'unicité (2x même WooCommerce store possible)
38. **Stores delete** : ne supprime pas pages liées → orphelins
39. **Workspace agency** : pas de delete, pas de view détaillée
40. **Settings** : `setTimeout` reset message sans cleanup useEffect
41. **Wizard step 5** : 42 styles en liste scrollable sans search
42. **Wizard step 4** : race condition FileReader si upload rapide
43. **Generate** : pas de log des tokens DeepSeek consommés
44. **Generate** : `escapeHtml` rendu littéral dans contexte texte (`&amp;` visible)
45. **GrapesEditor** : `setSaving(false)` synchrone, pas attente onSave
46. **GrapesEditor** : export HTML `lang="fr"` hardcodé
47. **Preview** : countdown refresh 60s, pas de seconde live
48. **Preview** : iframe `pointer-events: none` empêche scroll long
49. **Scraper** : pas d'extraction variantes (couleur/taille)
50. **Scraper** : `cleanPrice` ambigu sur format européen "1.234"
51. **Email Resend** : pas de check success status, pas de retry
52. **Stripe** : customer Stripe orphelin si checkout abandonné
53. **Préview cleanup** : nettoyage previews expirées commenté

---

## ✅ Plan d'attaque recommandé (J-2 → J-1)

### Jour 1 (aujourd'hui — 2026-05-03) · 6h
- ⏱ 1h — Bugs #1, #2, #11, #12, #15, #17, #18, #22, #25, #28, #32, #35 (quick wins)
- ⏱ 2h — Bug #3 + #4 (upload Supabase Storage pour photos, désactiver vidéo)
- ⏱ 1h — Bug #5 (whitelist URL + texte wizard cohérent)
- ⏱ 1h — Bug #6 + #7 (Stripe downgrade + cron filtre trial)
- ⏱ 1h — Bug #8 + #9 (RLS stores defense + force-dynamic dashboard)

### Jour 2 (2026-05-04) · 6h
- ⏱ 1h — Bug #10 (autosave page → enable Publier)
- ⏱ 1h — Bug #21 + #20 (published_id structure)
- ⏱ 1h — Bugs #23, #24 (actions pages + pagination)
- ⏱ 1h — Bug #29 (idempotence Stripe)
- ⏱ 1h — Bug #30 + #33 + #34 (Trial Stripe + crons)
- ⏱ 1h — Smoke test full flow (signup → wizard → genération → édition → publication Shopify → analytics)

### Jour J (2026-05-05) · checks final
- Check Stripe LIVE webhook reçoit bien les events test
- Check 1 vraie page publiée sur Shopify de bout en bout
- Check email trial day 1 envoyé correctement
- Activer Sentry alerting

---

## 🛡 SMOKE TEST À FAIRE AVANT LANCEMENT

```
1. Signup nouveau compte → email bienvenue reçu
2. Connecter store Shopify (OAuth complet)
3. Wizard URL AliExpress → vérifier scrape OK
4. Wizard URL Shopify (bug #5) → 403 attendu actuellement
5. Wizard saisie manuelle + upload 3 photos → vérifier taille DB après save
6. Génération en français → vérifier toutes sections présentes
7. Génération en chinois → vérifier comportement (bug #15)
8. Édition GrapesJS → save → reload page → contenu conservé ?
9. Publier sur Shopify → vérifier URL accessible publiquement
10. Tracker analytics : ouvrir la page publique 5x → vérifier views++ dashboard
11. Stripe checkout sandbox → upgrade Pro → vérifier quota = 300
12. Stripe webhook test cancel → vérifier downgrade 'free' (bug #6)
13. Cron trial-emails manuel curl avec CRON_SECRET → vérifier pas de spam payants (bug #7)
14. Test mobile : dashboard + wizard sur iPhone safari
```

---

**Audit réalisé sans exécution UI — basé sur lecture statique du code.**
**Recommandation : exécuter ce smoke test une fois les fixes critiques appliqués.**
