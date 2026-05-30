# feat(v3): pages produit V3 + xPage comparaison + AI SDK refacto

## 🎯 Résumé

61 commits regroupant le chantier V3 (refonte pages produit niveau Allbirds), les pages comparaison SEO xPage, la refacto AI SDK + Zod, le hotfix sécurité B8 unsubscribe et le playbook cold-email outbound.

---

## ✨ Nouveautés user-visible

### 1. Pages produit V3 — refonte Allbirds-grade
- **10 styles** complets (soft, editorial, apple-clean, luxe-noir, organic, brutalist, warm-neutral, minimal-mono, vibrant, bold) avec tokens + patterns CSS
- **13 sections universelles** (hero, gallery, why_we_love, features, best_for, materials, compare, reviews, press, manifesto, how_it_works, care_instructions, faq)
- **Wizard `/dashboard/new-v3`** 4 étapes : Style picker → Tone picker → Data validation → Style summary
- **Upload d'images produit** : bucket Supabase Storage dédié + ImageManager avec drag-reorder + delete
- **Auto-pick logic** : sélection automatique du style et du tone selon le produit scrappé

### 2. Pages comparaison SEO xPage
- `/alternative/xpage` (singular)
- `/vs/xpage` (versus)
- Composants SEO réutilisables + schema

### 3. Refacto AI SDK V3 (sécurise la qualité côté client)
- Remplace l'appel DeepSeek mono-shot (`fetch` + `JSON.parse` + string-replace ` ```json ```) par `generateObject({ model, schema })` du Vercel AI SDK
- Validation runtime Zod sur la sortie LLM → 0 chance de JSON cassé servi au client
- Retry auto SDK (`maxRetries=2`) si format invalide
- Type-safe end-to-end via `z.infer`

### 4. Hotfix sécurité B8 — unsubscribe HMAC
- Rate limit 5 req/min/IP (au lieu de 10)
- Token signing HMAC-SHA256 timing-safe
- Tests E2E : 400 missing params, 403 invalid token, 200 valid, 429 rate limit

### 5. Cold-email playbook outbound (docs)
- `cold-email/playbook-nagato.md`
- Template leads verified

---

## 📦 Stack ajoutée

| Package | Version | Raison |
|---|---|---|
| `ai` | ^6.0.193 | Vercel AI SDK core (`generateObject`) |
| `@ai-sdk/deepseek` | ^2.0.35 | Provider DeepSeek officiel |
| `zod` | ^4.4.3 | Schema validation runtime |

---

## ⚠️ Actions prod requises AVANT merge

### A. Migrations SQL Supabase

```bash
# Dans Supabase Dashboard → SQL Editor → New query → Run
cat supabase/migrations/20260526_konvert_product_images_bucket.sql
cat supabase/migrations/20260526_pages_v3_columns.sql
```

### B. Env vars Vercel à ajouter (production + preview)

| Variable | Valeur | Pour quoi |
|---|---|---|
| `KONVERT_V3_RENDERER` | `true` | Active le rendu V3 (false par défaut → safe) |
| `DEEPSEEK_API_KEY` | déjà en local | Génération copy V3 (Vercel AI SDK) |

### C. Smoke test sur preview deploy

- `/dashboard/new-v3` → cycle wizard complet (1 page produit générée)
- `/alternative/xpage` → page charge
- `/vs/xpage` → page charge

---

## 🛡️ Rollback

V3 est protégé par le flag `KONVERT_V3_RENDERER`. En cas de régression : flip `false` dans Vercel → redeploy → rollback en < 2 min sans toucher le code.

---

## ✅ Tests

- **47 test files**, **367 tests verts** (Vitest)
- TypeScript strict clean dans le scope V3
- Lint clean

---

## 📊 Stats

- **61 commits** ahead of main
- **+~150 fichiers** (tokens styles, components wizard, renderers sections, tests)
- 8 sprints V3 (S1 Fondations → S8 Migration) + sprint B8 launch security
