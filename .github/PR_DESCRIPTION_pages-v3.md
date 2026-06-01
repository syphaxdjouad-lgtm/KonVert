# feat(v3+launch): pages produit V3 + xPage + AI SDK + launch kit 2 juin

## 🎯 Résumé

67 commits regroupant tout le boulot pre-launch 2 juin : chantier V3 (refonte pages produit Allbirds-grade), pages comparaison SEO xPage, refacto AI SDK + Zod, hotfix sécurité B8, launch kit complet (17 SEO articles + dashboard J0), playbook cold-email NAGATO, fixes UX wizard et auth welcome email.

---

## ✨ Nouveautés user-visible

### 1. Pages produit V3 — refonte Allbirds-grade
- **10 styles** complets (soft, editorial, apple-clean, luxe-noir, organic, brutalist, warm-neutral, minimal-mono, vibrant, bold) avec tokens + patterns CSS
- **13 sections universelles** (hero, gallery, why_we_love, features, best_for, materials, compare, reviews, press, manifesto, how_it_works, care_instructions, faq)
- **Wizard `/dashboard/new-v3`** 4 étapes : Style picker → Tone picker → Data validation → Style summary
- **Skip button** sur étape 2 du wizard (UX DEIDARA)
- **Upload d'images produit** : bucket Supabase Storage dédié + ImageManager avec drag-reorder + delete
- **Auto-pick logic** : sélection automatique du style et du tone selon le produit scrappé

### 2. Pages comparaison SEO xPage
- `/alternative/xpage` (singular)
- `/vs/xpage` (versus)
- Composants SEO réutilisables + schema

### 3. Launch kit 2 juin
- 17 SEO articles
- Dashboard J0
- Python visuals generator
- Coupon `LAUNCH50` avec expiry
- Date fallback 2026-06-02

### 4. Refacto AI SDK V3 (sécurise la qualité côté client)
- Remplace l'appel DeepSeek mono-shot (`fetch` + `JSON.parse` + string-replace ` ```json ```) par `generateObject({ model, schema })` du Vercel AI SDK
- Validation runtime Zod sur la sortie LLM → 0 chance de JSON cassé servi au client
- Retry auto SDK (`maxRetries=2`) si format invalide
- Type-safe end-to-end via `z.infer`

### 5. Hotfix sécurité B8 — unsubscribe HMAC
- Rate limit 5 req/min/IP
- Token signing HMAC-SHA256 timing-safe
- Tests E2E : 400 missing params, 403 invalid token, 200 valid, 429 rate limit

### 6. Fixes critiques pre-launch
- Welcome email se fire même si session null (P0 DEIDARA)
- Loader copy aligné sur réalité 60s (pas 30s) (P0 DEIDARA)

### 7. Cold-email NAGATO playbook (outbound)
- Playbook complet + sourcing plan + ZARA sequences + Notion CRM template

---

## 📦 Stack ajoutée

| Package | Version | Raison |
|---|---|---|
| `ai` | ^6.0.193 | Vercel AI SDK core (`generateObject`) |
| `@ai-sdk/deepseek` | ^2.0.35 | Provider DeepSeek officiel |
| `zod` | ^4.4.3 | Schema validation runtime |

---

## ⚠️ Actions prod requises AVANT merge

### A. Migrations SQL Supabase (manuel via SQL Editor)

Coller `supabase/migrations/20260526_konvert_product_images_bucket.sql` + `supabase/migrations/20260526_pages_v3_columns.sql` dans Dashboard → SQL Editor.

### B. Env vars Vercel à ajouter (production + preview)

| Variable | Valeur | Pour quoi |
|---|---|---|
| `KONVERT_V3_RENDERER` | `true` | Active le rendu V3 (false par défaut → safe) |
| `DEEPSEEK_API_KEY` | déjà en local | Génération copy V3 (Vercel AI SDK) |

### C. Smoke test sur preview deploy

- `/dashboard/new-v3` → cycle wizard complet (1 page produit générée)
- `/alternative/xpage` → page charge
- `/vs/xpage` → page charge
- Welcome email après signup (P0 DEIDARA)

---

## 🛡️ Rollback

V3 protégé par flag `KONVERT_V3_RENDERER`. En cas de régression : flip `false` dans Vercel → redeploy → rollback en < 2 min.

---

## ✅ Tests

- 47+ test files, 367+ tests verts (Vitest)
- TypeScript strict clean dans le scope V3
- Lint clean

---

## 📊 Stats

- **67 commits** ahead of main
- **+~200 fichiers** (V3 tokens + components + renderers + tests + launch kit SEO + cold-email playbooks)
- 8 sprints V3 (S1 Fondations → S8 Migration) + sprint B8 launch security + launch kit 2 juin
