# Konvert V3 — Checklist migration prod

Cette checklist liste les **actions manuelles** à exécuter par toi (Syphax) pour activer Konvert V3 en production.

Tout le code est mergé/prêt sur la branche `feat/pages-v3` (Sprints 1-8 complets).

---

## ⚠️ Avant tout

1. **Test V3 en local** (au moins 1 cycle complet) :
   ```bash
   cd /Users/mac/nexara/konvert
   npm run dev
   # → http://localhost:3000/dashboard/new-v3
   ```
   Valide qu'une page produit V3 se génère bien bout en bout sur ton compte local.

2. **Backup Supabase prod** (sécurité avant migrations) :
   - Supabase Dashboard → Database → Backups → Manual backup avant les SQL ci-dessous.

---

## Étape 1 — Appliquer migrations SQL Supabase prod

Deux migrations à appliquer dans **cet ordre** :

### 1.1 Bucket Storage pour images user

Fichier : `supabase/migrations/20260526_konvert_product_images_bucket.sql`

```bash
cat supabase/migrations/20260526_konvert_product_images_bucket.sql
```

→ Copier le contenu → Supabase Dashboard → SQL Editor → Run

Crée :
- Bucket `konvert-product-images` (10 MB max, JPEG/PNG/WEBP/GIF/AVIF)
- 3 RLS policies (upload own folder · public read · delete own)

### 1.2 Colonnes V3 sur table `pages`

Fichier : `supabase/migrations/20260526_pages_v3_columns.sql`

```bash
cat supabase/migrations/20260526_pages_v3_columns.sql
```

→ Copier le contenu → Supabase Dashboard → SQL Editor → Run

Ajoute :
- `style_id text`
- `section_order_v3 text[]`
- `v3_migrated_at timestamptz`
- 2 indexes partiels

---

## Étape 2 — Dry-run migration data

Avec les env vars chargées (`.env.local` doit avoir `SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY`) :

```bash
cd /Users/mac/nexara/konvert
tsx scripts/migrate-pages-to-v3.ts
```

→ Affiche ce qui **serait** migré (zéro écriture).

**Vérifier dans la sortie** :
- Le nombre de pages détectées correspond à ce que tu as en prod
- Les mappings `etec-* → styleId` semblent cohérents (ex: `etec-platina → luxe-noir`)
- Aucune erreur

---

## Étape 3 — Appliquer la migration data

Si dry-run OK :

```bash
tsx scripts/migrate-pages-to-v3.ts --apply
```

→ Écrit dans la table `pages` :
- `style_id` = mapping legacy → V3
- `section_order_v3` = sections V2 mappées vers V3
- `v3_migrated_at` = timestamp now

**Idempotent** : le script skip les pages qui ont déjà `style_id` défini.

---

## Étape 4 — Activer feature flag Vercel

Dans Vercel Dashboard → Project konvert → Settings → Environment Variables :

| Variable | Value | Environments |
|---|---|---|
| `KONVERT_V3_RENDERER` | `true` | production · preview |

(Cette var contrôle si `renderPage()` route vers V3 ou legacy. Avec `true` + `styleId` présent sur la page → rendu V3.)

→ Redeploy : git push trigger / Vercel CLI / "Redeploy" depuis Vercel dashboard.

---

## Étape 5 — Smoke test prod

1. Ouvre `https://konvertpilot.com/dashboard/new-v3`
2. Crée une page test (URL Shopify connue)
3. Vérifie :
   - Wizard 4 étapes fonctionnel
   - Upload image marche (utilise le bucket `konvert-product-images`)
   - Style auto-pick cohérent
   - Page générée affiche les 13 sections V3 niveau Allbirds

4. Ouvre une page **migrée** (legacy → V3) :
   - Vérifie qu'elle se rend dans le nouveau style mappé
   - Pas de bug visuel grave

---

## Étape 6 — Monitoring 24-48h

- Sentry : aucune erreur côté `/api/generate` engine=v3, `/api/upload-image`, `renderPageV3`
- Stripe / abos : pas de break
- Pas de chute de conversion observée

**Si régression** → flip `KONVERT_V3_RENDERER=false` dans Vercel → redeploy. Rollback en < 2 min.

---

## Étape 7 — Cleanup 42 templates legacy (post 1-2 semaines stable)

⚠️ **Ne fais cette étape que si V3 tourne sans incident pendant au moins 1-2 semaines en prod.**

```bash
git checkout feat/pages-v3  # ou nouvelle branche feat/v3-cleanup
git rm src/lib/templates/etec-*.ts
# Simplifier src/lib/templates/index.ts pour ne garder que le renderTemplate qui route vers V3
```

Voir spec section 9.5 pour le détail. Cette étape supprime ~60KB de code mort.

---

## Étape 8 — PR finale → main

Une fois tout stable :

```bash
gh pr create \
  --title "feat(v3): pages produit V3 architecture (10 styles + 13 sections universelles)" \
  --body "Voir docs/superpowers/specs/2026-05-26-konvert-pages-v3-design.md"
```

Référence le plan + spec dans la description. Demande review (toi).

---

## Récap commits de la branche `feat/pages-v3`

| Sprint | Description | Approximate commits |
|---|---|---|
| S1 Fondations | Types + ImagePool + 1 style + 1 section + flag | 6 |
| S2 Maquettes 1/2 | 5 styles HTML/CSS validés visuellement | 9 |
| S3 Maquettes 2/2 | 5 autres styles validés | 10 |
| S4 Sections V3 (7/13) | hero, gallery, why_we_love, features, best_for, care, faq | 7 |
| S5 Sections V3 (6/13) | materials★, compare, reviews, press, manifesto, how_it_works | 7 |
| S6 Styles register + Wizard | Auto-pick, tone, modales, StyleSummaryStep, API V3, wizard /new-v3 | 9 |
| S7 Dashboard images | Bucket Supabase + ImageManager + intégration wizard | 3 |
| S8 Migration | Mappings + script tsx + colonnes DB | 2 |
| **Total** | **~53 commits** | |

Tests : **101+ Vitest passing**, TypeScript strict clean dans scope V3.

---

## Concerns à valider avant merge final

Réunis depuis les rapports OBITO + ANNA pendant la build :

### Fonts à self-host (`next/font`)
- `soft` Cormorant Garamond — Google Fonts ✓
- `editorial` Tiempos → substituer **Playfair Display** (Tiempos est propriétaire Klim)
- `apple-clean` SF Pro Display — fallback Inter
- `bold` PP Neue Machina (propriétaire Pangram) → **Bebas Neue** ou **Space Grotesk**
- `organic` DM Serif Display — Google Fonts ✓
- `luxe-noir` Playfair Display — Google Fonts ✓
- `brutalist` JetBrains Mono — Google Fonts ✓ (preload weight 800 pour éviter FOUT)
- `warm-neutral` PP Editorial New (propriétaire) → **Playfair Display** fallback OK
- `minimal-mono` Inter — Google Fonts ✓ (sûrement déjà dans le projet)
- `vibrant` Clash Display → **self-host woff2** depuis Fontshare CDN

### Accessibilité
- Ajouter `prefers-reduced-motion` dans tous les renderers (désactive anims si user le demande)
- `text-muted` sur `surface` du style `organic` = 4.5:1 exact WCAG AA → ne pas dégrader

### Performance
- Toutes les images Unsplash dans les mockups → à remplacer par `getImage(pool, slot, index)` (déjà OK dans les renderers prod)
- Inter weight 300 sur Android low-DPI : `minimal-mono` body à 15px / H3 weight 500 (déjà testé Pixel 5a en mockup)

### Code quality
- `autoPickTone()` typé `() → CopyTone` mais ne retourne jamais `'auto'` — cast `as Exclude<CopyTone, 'auto'>` dans `/api/generate`. À nettoyer : changer le return type dans `auto-pick-tone.ts`.
- Pas de Zod validation sur `body` de `/api/generate` engine=v3. Ajouter avant merge final (sécurité prod).

---

## Concerns par style (depuis OBITO)

Voir notes détaillées dans `design/mockups/style-*.notes.md` pour chaque style.

**Communs à tous** :
- Pas d'imports `next/font` dans les mockups (HTML standalone). En prod ANNA self-host.
- Animations max 600ms cubic-bezier — déjà respecté côté code.

---

## Quand tu seras prêt à merger

Ping-moi avec :
```
ok merge V3 prod
```

Je ferai :
1. Vérification finale code + tests
2. Build prod test (`npm run build`)
3. Bullet point récap des changements pour le commit message PR
4. `gh pr create` avec la bonne description

Si problème en cours de route → `KONVERT_V3_RENDERER=false` rollback instantané.
