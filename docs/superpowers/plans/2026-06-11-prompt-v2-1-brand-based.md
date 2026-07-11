# KONVERT — Prompt v2.1 brand-based + guardrail anti-hallucination press_logos

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Réécrire le prompt de génération landing v2 pour passer d'une logique press_logos *niche-based* à une logique *brand-based stricte*, plus une whitelist hardcodée + filtre TypeScript dans `sanitizeLandingPageData`, afin de faire chuter le taux d'hallucination de 58,5% à < 5% sur catégories B (DTC) et C (AliExpress).

**Architecture:** Le feature flag `KONVERT_PROMPT_VERSION` reste l'unique levier d'activation. La règle 28 (system + user prompt) devient *brand-based* avec gate `reviews_count`. Le code ajoute une whitelist Set<string> appliquée post-sanitization sur `press_logos` ET sur `press_mentions` (même défaut). Aucune modification de la signature de `sanitizeLandingPageData` pour ne pas casser les tests existants ni les appelants — l'anchor HTML check est explicitement *hors scope* (le HTML brut n'est pas exposé dans `ScrapedProduct`).

**Tech Stack:** TypeScript strict, Next.js 14 App Router, DeepSeek API (deepseek-chat), Vitest, tsx CLI, `process.env.KONVERT_PROMPT_VERSION`.

---

## Contexte rapide

- **État actuel prod :** `KONVERT_PROMPT_VERSION=v1` (rollback du 2026-06-06). Le prompt v2 est en code mais désactivé.
- **Cause racine du défaut v2 :** règle 28 *niche-based* (`generate.ts:407` system + `generate.ts:634` user) → DeepSeek extrapole. Whitelist absente. `press_mentions` (champ ancien) a le même défaut sans aucune instruction anti-hallucination.
- **Fichiers en jeu :**
  - `src/lib/anthropic/generate.ts` (768 lignes, prompt + sanitize + feature flag)
  - `src/lib/anthropic/generate-v2-cro.test.ts` (228 lignes, tests Vitest)
  - `scripts/audit-press-logos-hallucination.ts` (audit golden set 30 produits)
  - `audit/golden-set-prompt-v2.json` (30 produits A/B/C)
- **Non couvert :** anchor HTML check (HTML brut absent de `ScrapedProduct`), AI Act labeling, autres champs CRO v2 (déjà OK).

---

## File Structure

| Fichier | Action | Responsabilité |
|---|---|---|
| `src/lib/anthropic/generate.ts` | Modify | Réécrire `V2_RULES_BLOCK` règle 28 (system) + bloc règle 28 (user prompt). Bump `PROMPT_VERSION`. Ajouter constante `PRESS_LOGOS_WHITELIST_PROMPT` (string injecté dans system prompt). Ajouter constante `PRESS_LOGOS_WHITELIST_CODE` (Set utilisé dans `sanitizeLandingPageData`). Modifier la règle 13 (`press_mentions`) pour la rendre brand-based aussi. Étendre `sanitizeLandingPageData` press_logos et press_mentions avec filtre whitelist. |
| `src/lib/anthropic/generate-v2-cro.test.ts` | Modify | Ajouter 4 cas tests : (a) whitelist filtre logo hors liste, (b) whitelist préserve logo dans liste, (c) press_mentions whitelist filtré, (d) v2.1 retourne `press_logos=[]` quand entrée vide. Les tests existants (XSS, structure) restent verts. |
| `scripts/audit-press-logos-hallucination.ts` | Read-only | Réutilisé tel quel pour re-run golden set. Pas de modification. |
| `audit/PROMPT_V2_1_VALIDATION_REPORT_2026-06-11.md` | Create | Rapport généré par le script audit après re-run v2.1. |

**Pourquoi pas d'extraction modulaire :** la whitelist (~30 lignes) reste colocalisée avec le prompt qui l'utilise dans le system prompt. Extraire dans un module séparé ajouterait un fichier sans gain (les deux usages sont dans `generate.ts`).

---

## Whitelist canonique (alignée rapport MINATO)

Liste exacte hardcodée — normalisation `.toLowerCase().trim()` côté code :

```
'vogue', 'elle', 'marie claire', 'allure', "harper's bazaar", 'glamour',
'cosmopolitan', 'grazia', 'elle décoration', 'marie claire maison',
'ad', 'côté maison', 'madame figaro', 'le figaro madame',
'forbes', 'techcrunch', 'the verge', 'wired', 'fast company',
'gq', 'business of fashion', 'refinery29', "women's health",
'yoga journal', "30 millions d'amis",
'le monde', 'le figaro', 'les echos',
```

= **27 entrées**. Volontairement plus large que les 8-10 du brief pour couvrir mode/beauté/tech/déco/lifestyle/animaux/finance/littérature presse FR. Toute extension future doit passer par revue MADARA + OROCHIMARU (risque légal).

---

## Tasks

### Task 1 : Brancher une worktree dédiée

**Files :** worktree git seulement, pas de fichier modifié.

- [ ] **Step 1 : Créer la branche depuis main**

Run:
```bash
cd /Users/mac/nexara/konvert
git fetch origin
git checkout -b feat/prompt-v2-1-brand-based origin/main
git status
```

Expected : branche `feat/prompt-v2-1-brand-based` créée, working tree propre.

- [ ] **Step 2 : Vérifier l'état du feature flag local**

Run:
```bash
grep -n "KONVERT_PROMPT_VERSION" .env.local 2>/dev/null || echo "Pas dans .env.local"
echo "---"
grep -n "KONVERT_PROMPT_VERSION" .env.example 2>/dev/null || echo "Pas dans .env.example"
```

Expected : afficher la ligne ou confirmer absence. Pour ce dev on travaille en v2 par défaut (USE_V2_PROMPT=true).

---

### Task 2 : Bump PROMPT_VERSION et ajouter constantes whitelist

**Files :**
- Modify: `src/lib/anthropic/generate.ts:659` (`PROMPT_VERSION`)
- Modify: `src/lib/anthropic/generate.ts` (~ligne 354, juste avant `// ─── Prompts ───`)

- [ ] **Step 1 : Bump PROMPT_VERSION**

Edit `src/lib/anthropic/generate.ts` ligne 659 :

```ts
export const PROMPT_VERSION = 'v2.1-brand-based-2026-06-11'
```

- [ ] **Step 2 : Ajouter la whitelist côté code juste après `sanitizeLandingPageData`**

Insérer après la fin de `sanitizeLandingPageData` (avant `// ─── Prompts ───`) :

```ts
// ─── Whitelist press_logos / press_mentions ──────────────────────────────────
//
// Liste canonique de publications presse autorisées. Toute publication hors de
// cette liste est strippée par le sanitizer, indépendamment de ce que le LLM
// retourne. Défense en profondeur contre les hallucinations brand-based
// (cf. audit 2026-06-06 : 58.5% hallucination sur golden set).
//
// Normalisation : .toLowerCase().trim() avant comparaison.
// Mise à jour : passage obligatoire revue MADARA + OROCHIMARU avant ajout.
const PRESS_LOGOS_WHITELIST: ReadonlySet<string> = new Set([
  // Mode / Beauté FR + intl
  'vogue', 'elle', 'marie claire', 'allure', "harper's bazaar", 'glamour',
  'cosmopolitan', 'grazia', 'madame figaro', 'le figaro madame', 'refinery29',
  // Déco / Maison
  'elle décoration', 'marie claire maison', 'ad', 'côté maison',
  // Tech / Business
  'forbes', 'techcrunch', 'the verge', 'wired', 'fast company',
  'business of fashion', 'gq',
  // Sport / Wellness
  "women's health", 'yoga journal',
  // Animaux
  "30 millions d'amis",
  // Presse généraliste FR
  'le monde', 'le figaro', 'les echos',
])
```

- [ ] **Step 3 : Lancer le typecheck**

Run:
```bash
pnpm tsc --noEmit
```

Expected : 0 erreur (la constante est unused pour l'instant, c'est OK avec strict mais pas avec noUnusedLocals — vérifier le tsconfig si erreur).

- [ ] **Step 4 : Commit intermédiaire**

```bash
git add src/lib/anthropic/generate.ts
git commit -m "chore(generate): bump PROMPT_VERSION v2.1 + add PRESS_LOGOS_WHITELIST constant"
```

---

### Task 3 : Réécrire la règle 28 (system prompt) — brand-based

**Files :**
- Modify: `src/lib/anthropic/generate.ts:404-409` (`V2_RULES_BLOCK`)

- [ ] **Step 1 : Remplacer la règle 28 dans V2_RULES_BLOCK**

Edit le bloc `V2_RULES_BLOCK` ligne 404-409. Remplacer la ligne 407 (règle 28 actuelle) par :

```
28. press_logos : RÈGLE STRICTE ZÉRO TOLÉRANCE — retourne [] par défaut, TOUJOURS.
    N'ajoute une publication QUE si les DEUX conditions sont réunies :
    (a) la marque est une DTC mondialement établie (> 5 000 avis clients sur le produit)
        ET ressort comme couverte historiquement par cette publication,
    OU (b) le nom exact de la publication apparaît littéralement dans la
        description produit fournie ("As seen in...", "Featured in...").
    La publication DOIT figurer dans cette liste exacte (sinon → []) :
    ["Vogue", "Elle", "Marie Claire", "Allure", "Harper's Bazaar", "Glamour",
     "Cosmopolitan", "Grazia", "Elle Décoration", "Marie Claire Maison", "AD",
     "Côté Maison", "Madame Figaro", "Le Figaro Madame", "Forbes", "TechCrunch",
     "The Verge", "Wired", "Fast Company", "GQ", "Business of Fashion",
     "Refinery29", "Women's Health", "Yoga Journal", "30 Millions d'Amis",
     "Le Monde", "Le Figaro", "Les Echos"].
    INTERDIT ABSOLU pour : tout produit AliExpress, dropshipping no-name,
    boutique < 5 000 avis → press_logos = [] obligatoire.
    En cas de doute minimal → []. Mieux vaut [] qu'halluciner.
    Max 3 entrées si tu en mets.
```

- [ ] **Step 2 : Vérifier que la règle 13 (user prompt) press_mentions est elle aussi renforcée**

Edit `generate.ts:619` (règle 13 user prompt) — remplacer :
```
13. press_mentions : 5 médias cohérents avec la langue/catégorie cible (jamais inventés)
```
par :
```
13. press_mentions : MÊME RÈGLE QUE press_logos (cf. règle 28). Liste vide [] par défaut.
    Ne mentionne que des publications mondialement reconnues qui ont réellement couvert la marque
    (DTC > 5 000 avis OU nom dans la description). 0 à 3 entrées max. Mieux vaut [] qu'halluciner.
```

- [ ] **Step 3 : Aligner l'exemple few-shot tech à la nouvelle règle**

Le few-shot ligne 455-457 est OK (il dit déjà "INCORRECT : Vogue/Marie Claire ne couvrent pas les accessoires smartphone"). Ajouter une ligne supplémentaire ligne 458 (avant le séparateur ═) :

```
NICHE INCONNUE (boutique Shopify < 5000 avis OU AliExpress) :
press_logos = [] OBLIGATOIRE. Aucune publication ne couvre les marques no-name.
press_mentions = [] OBLIGATOIRE pour la même raison.
```

- [ ] **Step 4 : Vérifier que le schéma JSON v2 a bien press_logos déclaré (ligne 389-391)**

Le schéma JSON est déjà OK. Pas de modification.

- [ ] **Step 5 : Lancer la suite Vitest pour s'assurer que les tests existants passent**

Run:
```bash
pnpm vitest run src/lib/anthropic/generate-v2-cro.test.ts
```

Expected : 11 tests passent (les tests actuels ne touchent pas au prompt texte, seulement à sanitizeLandingPageData).

- [ ] **Step 6 : Commit prompt v2.1**

```bash
git add src/lib/anthropic/generate.ts
git commit -m "feat(generate): prompt v2.1 brand-based - règles 28 + 13 renforcées + few-shot anti-hallucination"
```

---

### Task 4 : Implémenter le guardrail TypeScript — whitelist filter

**Files :**
- Modify: `src/lib/anthropic/generate.ts:290-302` (press_logos sanitization)
- Modify: `src/lib/anthropic/generate.ts:203-205` (press_mentions sanitization)

- [ ] **Step 1 : Étendre le filtre press_logos avec whitelist**

Edit `generate.ts:290-302` — remplacer le bloc par :

```ts
  // press_logos — guardrail v2.1 : whitelist brand-based stricte
  // Toute publication hors PRESS_LOGOS_WHITELIST est strippée silencieusement.
  // Si le LLM hallucine "Parenting France" ou autre, on n'affiche jamais.
  if (Array.isArray(d.press_logos)) {
    out.press_logos = d.press_logos
      .filter(
        (p): p is NonNullable<(typeof d.press_logos)>[number] =>
          p != null && typeof p.publication === 'string' && p.publication.trim().length > 0,
      )
      .filter(p => PRESS_LOGOS_WHITELIST.has(p.publication.toLowerCase().trim()))
      .slice(0, 3)
      .map(p => ({
        publication: escapeHtml(p.publication.slice(0, 80)),
        ...(typeof p.quote_short === 'string' && p.quote_short.trim().length > 0
          ? { quote_short: escapeHtml(p.quote_short.slice(0, 80)) }
          : {}),
      }))
  }
```

- [ ] **Step 2 : Étendre le filtre press_mentions avec la même whitelist**

Edit `generate.ts:203-205` — remplacer le bloc par :

```ts
  // press_mentions — guardrail v2.1 : même whitelist que press_logos.
  // press_mentions est un string[] (vs press_logos qui est { publication, quote_short? }[]).
  if (Array.isArray(d.press_mentions)) {
    out.press_mentions = d.press_mentions
      .filter(s => typeof s === 'string' && s.trim().length > 0)
      .filter(s => PRESS_LOGOS_WHITELIST.has(s.toLowerCase().trim()))
      .slice(0, 3)
      .map(escapeHtml)
  }
```

- [ ] **Step 3 : Lancer le typecheck**

Run:
```bash
pnpm tsc --noEmit
```

Expected : 0 erreur.

- [ ] **Step 4 : Lancer la suite Vitest, vérifier qu'aucun test existant ne casse**

Run:
```bash
pnpm vitest run src/lib/anthropic/generate-v2-cro.test.ts
```

Expected : tous les tests passent. Note : les tests existants utilisent "Vogue" et "Marie Claire" (lignes 41-43, 71-73, 203-210) — ces deux logos sont dans la whitelist, donc les tests restent verts.

- [ ] **Step 5 : Commit guardrail**

```bash
git add src/lib/anthropic/generate.ts
git commit -m "feat(generate): guardrail whitelist press_logos+press_mentions v2.1"
```

---

### Task 5 : Ajouter les tests Vitest du guardrail v2.1

**Files :**
- Modify: `src/lib/anthropic/generate-v2-cro.test.ts` (append nouveau describe block)

- [ ] **Step 1 : Écrire d'abord les tests qui doivent passer**

Append à `src/lib/anthropic/generate-v2-cro.test.ts` (après le dernier `describe`) :

```ts
// ─── 4. GUARDRAIL v2.1 — whitelist brand-based press_logos & press_mentions ──
describe('sanitizeLandingPageData — guardrail v2.1 whitelist press_logos', () => {
  it('strippe les press_logos hors whitelist (ex: "Parenting France" inventé)', () => {
    const result = sanitizeLandingPageData({
      ...BASE,
      press_logos: [
        { publication: 'Vogue' },
        { publication: 'Parenting France' },          // inventé → strip
        { publication: 'Science & Vie Junior' },      // hors whitelist → strip
      ],
    })
    expect(result.press_logos).toHaveLength(1)
    expect(result.press_logos![0].publication).toBe('Vogue')
  })

  it('préserve les publications whitelistées (Vogue, Marie Claire, TechCrunch)', () => {
    const result = sanitizeLandingPageData({
      ...BASE,
      press_logos: [
        { publication: 'Vogue', quote_short: 'Excellent.' },
        { publication: 'Marie Claire' },
        { publication: 'TechCrunch' },
      ],
    })
    expect(result.press_logos).toHaveLength(3)
    expect(result.press_logos!.map(p => p.publication)).toEqual([
      'Vogue', 'Marie Claire', 'TechCrunch',
    ])
  })

  it('normalisation lowercase + trim : "  VOGUE  " est accepté', () => {
    const result = sanitizeLandingPageData({
      ...BASE,
      press_logos: [
        { publication: '  VOGUE  ' },
        { publication: 'elle' },
      ],
    })
    expect(result.press_logos).toHaveLength(2)
    // escapeHtml + slice préservent la casse fournie côté output
    expect(result.press_logos![0].publication).toContain('VOGUE')
  })

  it('cap à 3 entrées même si le LLM en retourne plus', () => {
    const result = sanitizeLandingPageData({
      ...BASE,
      press_logos: [
        { publication: 'Vogue' },
        { publication: 'Elle' },
        { publication: 'Marie Claire' },
        { publication: 'Allure' },
        { publication: 'Glamour' },
      ],
    })
    expect(result.press_logos).toHaveLength(3)
  })

  it('press_mentions : whitelist appliquée (string[] vs object[])', () => {
    const result = sanitizeLandingPageData({
      ...BASE,
      press_mentions: ['Vogue', 'Marie Claire', 'Parenting France', 'Random Magazine'],
    })
    expect(result.press_mentions).toEqual(['Vogue', 'Marie Claire'])
  })

  it('press_logos tableau vide reste vide (cas le plus fréquent v2.1)', () => {
    const result = sanitizeLandingPageData({ ...BASE, press_logos: [] })
    expect(result.press_logos).toEqual([])
  })

  it('press_logos avec UNIQUEMENT des entrées hors whitelist → tableau vide', () => {
    const result = sanitizeLandingPageData({
      ...BASE,
      press_logos: [
        { publication: 'Parenting France' },
        { publication: 'Random Inventé' },
        { publication: 'Cosmétiques Daily' },
      ],
    })
    expect(result.press_logos).toEqual([])
  })
})
```

- [ ] **Step 2 : Lancer les tests, vérifier qu'ils passent**

Run:
```bash
pnpm vitest run src/lib/anthropic/generate-v2-cro.test.ts
```

Expected : 18 tests passent (11 existants + 7 nouveaux).

- [ ] **Step 3 : Commit tests**

```bash
git add src/lib/anthropic/generate-v2-cro.test.ts
git commit -m "test(generate): suite Vitest guardrail whitelist v2.1 (7 nouveaux cas)"
```

---

### Task 6 : Re-run golden set audit avec prompt v2.1

**Files :**
- Read-only: `scripts/audit-press-logos-hallucination.ts`
- Create: `audit/PROMPT_V2_1_VALIDATION_REPORT_2026-06-11.md`
- Create: `audit/raw-results-2026-06-11.json`

- [ ] **Step 1 : Vérifier les clés API requises**

Run:
```bash
grep -E "^(DEEPSEEK_API_KEY|ANTHROPIC_API_KEY)=" .env.local | sed 's/=.*/=***/'
```

Expected : afficher les deux clés (sans la valeur). Si `ANTHROPIC_API_KEY` est expirée (cf. rapport 2026-06-06), le judge tombera sur fallback `unverifiable` — c'est OK pour ce run, on jugera manuellement.

- [ ] **Step 2 : Force KONVERT_PROMPT_VERSION=v2 pour le run audit**

Run:
```bash
KONVERT_PROMPT_VERSION=v2 pnpm tsx scripts/audit-press-logos-hallucination.ts 2>&1 | tee audit/run-2026-06-11.log
```

Expected (durée ~75s : 30 runs × ~2.5s avec sleep 2s) :
- stdout : ligne par produit avec `press_logos=[...] → ok|HALLUCINATED (H:n V:n U:n)`
- rapport markdown généré : `audit/PROMPT_V2_HALLUCINATION_REPORT_2026-06-11.md`
- raw JSON : `audit/raw-results-2026-06-11.json`

⚠ Le script nomme le rapport `PROMPT_V2_HALLUCINATION_REPORT_${date}.md` — renomme-le manuellement après run :

```bash
mv audit/PROMPT_V2_HALLUCINATION_REPORT_2026-06-11.md audit/PROMPT_V2_1_VALIDATION_REPORT_2026-06-11.md
```

- [ ] **Step 3 : Analyser les métriques**

Run:
```bash
head -40 audit/PROMPT_V2_1_VALIDATION_REPORT_2026-06-11.md
```

Critère go-live :
- **Taux hallucination catégorie B (DTC)** : < 5%
- **Taux hallucination catégorie C (AliExpress)** : < 5% (idéalement 0%)
- **Taux hallucination catégorie A (grandes marques)** : sous le niveau v2 (9.5%), tolérance < 15%
- **Taux global** : < 10%

Si l'un de ces critères échoue → ne pas merger, escalader à user pour patch.

- [ ] **Step 4 : Commit l'audit**

```bash
git add audit/PROMPT_V2_1_VALIDATION_REPORT_2026-06-11.md audit/raw-results-2026-06-11.json audit/run-2026-06-11.log
git commit -m "audit(prompt-v2-1): golden set 30 produits — hallucination < 5% B/C"
```

---

### Task 7 : Sample output pour validation user (showcase 3 cas)

**Files :**
- Create: `audit/SAMPLE_OUTPUTS_V2_1_2026-06-11.md`

- [ ] **Step 1 : Extraire 3 outputs représentatifs depuis raw-results**

Run:
```bash
node -e "
const raw = JSON.parse(require('fs').readFileSync('audit/raw-results-2026-06-11.json', 'utf8'));
const samples = [
  raw.results.find(r => r.product_id === 'A03'), // Glossier — DTC mondiale
  raw.results.find(r => r.product_id === 'B05'), // WildRoots — DTC inconnue → []
  raw.results.find(r => r.product_id === 'C09'), // EMS massager AliExpress → []
];
console.log(JSON.stringify(samples, null, 2));
" > audit/SAMPLE_OUTPUTS_V2_1_2026-06-11.json
```

- [ ] **Step 2 : Écrire un récap markdown lisible**

Create `audit/SAMPLE_OUTPUTS_V2_1_2026-06-11.md` avec :
- Avant/après par produit (press_logos v2 vs v2.1)
- Verdict (verified / hallucinated / [])
- Lien vers raw JSON pour audit complet

- [ ] **Step 3 : Commit sample**

```bash
git add audit/SAMPLE_OUTPUTS_V2_1_2026-06-11.md audit/SAMPLE_OUTPUTS_V2_1_2026-06-11.json
git commit -m "audit(prompt-v2-1): sample outputs 3 cas (A/B/C) pour validation user"
```

---

### Task 8 : Push branche + ouvrir PR draft

**Files :** aucun fichier modifié.

- [ ] **Step 1 : Push la branche**

```bash
git push -u origin feat/prompt-v2-1-brand-based
```

- [ ] **Step 2 : Ouvrir une PR draft**

```bash
gh pr create --draft --title "feat(generate): prompt v2.1 brand-based + guardrail anti-hallucination" --body "$(cat <<'EOF'
## Contexte

Prompt v2 (mergé 2026-06-06, rollback même jour) avait un taux d'hallucination press_logos de 58,5% sur le golden set 30 produits :
- Catégorie A (grandes marques) : 9,5%
- Catégorie B (DTC inconnues) : 100%
- Catégorie C (AliExpress) : 77%

Cause racine : règle 28 *niche-based* → DeepSeek extrapolait Vogue/Elle pour tout produit beauté, quel que soit le brand.

## Changements

1. **Règle 28 réécrite brand-based** : DTC mondialement établie (> 5 000 avis) OU nom de publication dans la description. Whitelist hardcodée 27 publications. Default `[]`.
2. **Règle 13 (press_mentions)** : alignée brand-based + whitelist.
3. **Guardrail TypeScript** : `PRESS_LOGOS_WHITELIST` Set appliqué post-sanitization sur `press_logos` ET `press_mentions`. Toute publication hors whitelist est strippée silencieusement.
4. **Few-shot ajouté** : exemple "boutique no-name → []" pour ancrer le LLM.
5. **Cap à 3 entrées** (était implicite "max 5" dans v2).
6. **PROMPT_VERSION bump** : `v2.1-brand-based-2026-06-11`.

## Résultats audit

| Catégorie | v2 hallucination | v2.1 hallucination |
|---|---|---|
| A (grandes marques) | 9,5% | _voir rapport_ |
| B (DTC inconnues) | 100% | _voir rapport_ |
| C (AliExpress) | 77% | _voir rapport_ |
| **Global** | **58,5%** | _voir rapport_ |

Voir `audit/PROMPT_V2_1_VALIDATION_REPORT_2026-06-11.md` et `audit/SAMPLE_OUTPUTS_V2_1_2026-06-11.md`.

## Test plan

- [x] `pnpm tsc --noEmit` → 0 erreur
- [x] `pnpm vitest run src/lib/anthropic/generate-v2-cro.test.ts` → 18/18 (11 existants + 7 nouveaux)
- [x] Re-run golden set 30 produits → taux hallucination B/C < 5%
- [ ] **À faire en prod** : Vercel → `KONVERT_PROMPT_VERSION=v2` → redeploy → smoke test 3 produits live (1 grande marque + 1 DTC + 1 AliExpress)
- [ ] **Hors scope (suivi futur)** : anchor HTML check (nécessite exposer raw HTML dans ScrapedProduct)

## Risques

- **Faux négatifs** : une marque légitime qui a réellement été couverte par une publication hors whitelist (ex: Le Parisien, NYT) verra ses logos strippés. Acceptable : on préfère [] qu'halluciner. Whitelist extensible via revue MADARA + OROCHIMARU.
- **Faux positifs** : une publication whitelistée citée par erreur (ex: Vogue pour AliExpress) — la règle 28 brand-based + reviews_count gate devrait bloquer côté LLM, mais le guardrail code ne valide pas l'adéquation publication/produit. Si l'audit re-run montre que ça arrive, ajouter un second gate `reviews_count >= 5000 || description.includes(publication)` côté code.

🤖 Generated with [Claude Code](https://claude.com/claude-code)
EOF
)"
```

- [ ] **Step 3 : Confirmer le PR URL**

Run:
```bash
gh pr view --json url,number,state --jq '.'
```

Expected : URL de la PR draft.

---

### Task 9 : Validation user explicite + merge prod

**Files :** aucun.

- [ ] **Step 1 : Présenter au user les éléments de validation**

Présenter :
- Diff prompt v2 → v2.1 (depuis le commit "feat(generate): prompt v2.1 brand-based")
- Métriques audit (extrait `head -40 audit/PROMPT_V2_1_VALIDATION_REPORT_2026-06-11.md`)
- 3 sample outputs (Glossier / WildRoots / EMS massager)
- Lien PR draft

- [ ] **Step 2 : Attendre confirmation user**

❌ NE PAS MERGER tant que user n'a pas explicitement écrit "OK merge" ou équivalent.

- [ ] **Step 3 : Sur confirmation user, mark PR ready et merge**

```bash
gh pr ready
gh pr merge --squash --auto
```

- [ ] **Step 4 : Activer KONVERT_PROMPT_VERSION=v2 en prod Vercel**

⚠ Action manuelle requise côté user. Documenter dans le PR comment :

```
Vercel Dashboard → konvert → Settings → Environment Variables
KONVERT_PROMPT_VERSION = v2  (Production)
→ Redeploy "konvert" (Production)
```

- [ ] **Step 5 : Smoke test prod**

User teste 3 produits live (1 grande marque, 1 DTC inconnue, 1 AliExpress) via UI. Si `press_logos` halluciné apparaît → revert immédiat `KONVERT_PROMPT_VERSION=v1` + reopener investigation.

---

## Self-review

**1. Spec coverage :**

| Spec brief user | Task couvrant |
|---|---|
| Réécrire règle 28 brand-based | Task 3 |
| Interdiction si < 5 000 reviews | Task 3 (intégré dans règle 28) |
| Whitelist hardcodée 8-10 logos | Task 2 + Task 3 (27 publications, plus large pour cover FR/intl) |
| Fonction `sanitizeLandingPageData()` qui strippe entrées hors whitelist | Task 4 |
| Anchor check HTML scrapé | **Hors scope** documenté (HTML brut absent de ScrapedProduct) — fallback : règle prompt 28 (b) + description text |
| Re-run golden set | Task 6 |
| Critère < 5% B/C | Task 6 step 3 + Task 9 |
| Diff prompt + sample output avant validation | Task 7 + Task 9 |

**2. Placeholder scan :**

- Pas de TBD/TODO/fill-in.
- Tous les code blocks contiennent le code exact.
- Toutes les commandes shell sont complètes avec leurs flags.

**3. Type consistency :**

- `PRESS_LOGOS_WHITELIST` : `ReadonlySet<string>`, utilisé `.has(s.toLowerCase().trim())` partout (Task 2, 4).
- `PRESS_LOGOS_WHITELIST_PROMPT` : pas de constante string séparée, la liste est inline dans le prompt v2.1 (Task 3) — cohérent.
- `press_logos` type : `{ publication: string; quote_short?: string }[]` confirmé via test fixtures (Task 5).
- `press_mentions` type : `string[]` confirmé (Task 5).

---

## Exécution

Plan complet et sauvegardé.

**Deux options :**

1. **Subagent-Driven (recommandé)** — j'orchestre MINATO (Task 2, 3) puis ANNA (Task 4, 5, 6, 7, 8) en sous-agents séparés, review entre chaque, fast iteration.
2. **Inline Execution** — j'exécute task par task dans la session courante avec checkpoints user.

Approche **suggérée par le brief user** : déléguer à MINATO + ANNA. Donc option 1.
