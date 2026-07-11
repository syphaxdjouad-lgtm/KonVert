# KONVERT V2 — Roadmap inspirée d'Emergent.sh

> **Statut** : à exécuter APRÈS le lancement public et les premiers retours payants.
> **Créé le** : 2026-05-18
> **Objectif** : faire passer KONVERT d'un outil mono-shot à une plateforme agentique de conversion.

---

## Contexte stratégique

Emergent.sh (Y Combinator S24) = AI App Builder full-stack horizontal. On ne le concurrence PAS.
On lui pique uniquement les briques techniques qui font sens dans notre verticale e-commerce / landing pages.

État actuel KONVERT :
- 1 appel DeepSeek mono-shot → 1 landing complète d'un coup
- Quota fixe par plan (Starter / Pro / Agency)
- Édition via GrapesJS (manuel)
- Pas d'itération post-publication

---

## Les 7 améliorations classées par ROI

### 🥇 1. Pipeline multi-agents visible

**Remplacer** : `src/lib/anthropic/generate.ts` (1 fetch DeepSeek)
**Par** : orchestration 5 agents spécialisés

```
🔍 Scraper agent    → produit + 3 concurrents + reviews
🧠 Strategist agent → angle marketing (PAS / AIDA / problème-agitation)
✍️  Copywriter agent → hero, story, bonuses, garantie (sections séparées)
🎨 Designer agent   → template + palette adaptée à la niche
✅ QA agent         → score conversion + corrige les faiblesses
```

**Stack** : Claude Agent SDK + DeepSeek (bulk) + Claude Sonnet (sections critiques)
**Effort** : 3-5 jours
**Impact UX** : user voit l'IA "travailler" en live = perception valeur ×3
**Impact qualité** : chaque agent spécialisé = qualité ×2
**Impact dev** : on peut re-run un seul agent (pas tout regénérer)

**Fichiers à créer** :
- `src/lib/agents/scraper-agent.ts`
- `src/lib/agents/strategist-agent.ts`
- `src/lib/agents/copywriter-agent.ts`
- `src/lib/agents/designer-agent.ts`
- `src/lib/agents/qa-agent.ts`
- `src/lib/agents/orchestrator.ts`
- `src/app/api/generate/v2/route.ts` (streaming SSE pour afficher progression)

---

### 🥈 2. Mode chat itératif sur la page générée

**Aujourd'hui** : page générée → édition manuelle GrapesJS
**Demain** : chat persistant à côté de la preview

Exemples :
- *"Rends le hero plus agressif"* → re-génère JUSTE le hero
- *"Change le bonus 2 en formation vidéo"* → patch ciblé
- *"Ajoute une garantie 30 jours"* → ajoute la section

**Tech** : tool-use Claude avec `edit_section(section_id, new_content)` qui patch le state Zustand côté `LandingPageData`.
**Effort** : 2-3 jours
**Pas besoin de toucher GrapesJS** — on patch le JSON.

**Fichiers à créer** :
- `src/components/dashboard/EditChat.tsx` (sidebar chat dans le builder)
- `src/lib/agents/section-editor-agent.ts`
- `src/app/api/edit/section/route.ts`

---

### 🥉 3. Boucle d'optimisation post-publication (LE MOAT 🛡️)

**Ce qu'Emergent ne fait PAS** (ils stoppent à la livraison). Notre vraie différenciation.

```
Page publiée → 100 visiteurs → conversion 1.2%
🤖 Agent analyse : "Le hero ne convertit pas"
→ Propose 3 variantes
→ A/B test auto 7 jours
→ Garde le gagnant
→ Boucle
```

**Pourquoi c'est défensif** : justifie l'abonnement RÉCURRENT (vs Emergent = one-shot).
**Stack** : cron Vercel quotidien + agent d'analyse + génération variantes + tracking déjà en place.
**Effort** : 1-2 semaines

**Fichiers à créer** :
- `src/lib/agents/optimizer-agent.ts`
- `src/lib/ab-testing/variant-manager.ts`
- `src/app/api/cron/optimize/route.ts`
- `supabase/migrations/2026XXXX_ab_tests.sql`
- Dashboard : nouvelle page `/dashboard/optimizations`

---

### 4. Multi-modèle intelligent (économie + qualité)

**Stratégie** : router automatique selon la section.

| Section | Modèle | Raison |
|---|---|---|
| Hero, garantie, story | Claude Sonnet 4.5 | Conversion-critique → qualité max |
| Specs, bullets, FAQ | DeepSeek | Bulk → pas cher |
| QA / scoring | Haiku 4.5 | Rapide et pas cher |

**Impact** : coût ÷ 3-4 SANS perte de qualité.
**Upsell** : "Plan Pro débloque Claude Opus pour le hero".
**Effort** : 1-2 jours

**Fichiers à créer/modifier** :
- `src/lib/llm/router.ts` (sélectionne le modèle selon `section_type`)
- `src/lib/llm/providers/anthropic.ts`
- `src/lib/llm/providers/deepseek.ts`

---

### 5. Versioning de pages (façon GitHub)

Chaque génération/édition → version stockée.
L'utilisateur peut comparer V1 vs V2, rollback, brancher des variantes.

**Killer feature pour les agences** (clients qui changent d'avis 12 fois).
**Effort** : 1 jour

**Schema Supabase** :
```sql
CREATE TABLE page_versions (
  id uuid PRIMARY KEY,
  page_id uuid REFERENCES pages(id),
  version_number int,
  data jsonb,
  created_by uuid,
  created_at timestamptz,
  comment text
);
```

**UI** : timeline à droite du builder + diff visuel.

---

### 6. Preview live + click-to-edit

**Comment Emergent fait** : click sur élément dans iframe → ouvre chat dédié.

Chez nous :
- Click sur section → highlight + ouvre chat dédié à cette section
- *"Change le bouton en vert et augmente la taille"* → direct
- Bien plus naturel que naviguer dans GrapesJS

**Tech** : `postMessage` entre iframe et parent. `data-section-id` sur chaque bloc.
**Effort** : 2 jours

**Fichiers à modifier** :
- `src/components/builder/PreviewIframe.tsx` (ajout listener click)
- `src/components/builder/SectionSelector.tsx`

---

### 7. Système de crédits (vs quota actuel)

**Aujourd'hui** : Starter = X pages/mois (quota dur, frustration).
**Demain** : crédits flexibles, comme Emergent.

| Action | Crédits |
|---|---|
| Génération full landing | 5 cr |
| Re-génération section | 1 cr |
| Optimisation auto post-pub | 2 cr/cycle |
| A/B test 7 jours | 10 cr |
| Variante design | 3 cr |

**Pricing proposé** :
- Starter : 39€ → 50 crédits
- Pro : 79€ → 150 crédits
- Agency : 199€ → 500 crédits + crédits partagés équipe

**Upsell naturel** : recharge de crédits à la carte (20€ = 30 cr supplémentaires).
**Impact business** : marges meilleures, on facture la valeur réelle, pas un quota arbitraire.
**Effort** : 2-3 jours (table credits + middleware + UI)

---

## Plan d'attaque suggéré (5-6 semaines)

| Sprint | Durée | Contenu | Pourquoi en premier |
|---|---|---|---|
| **Sprint 1** | 1-2 sem | Pipeline multi-agents + chat itératif | Le plus visible côté user, débloque le reste |
| **Sprint 2** | 1 sem | Multi-modèle + versioning | Le caché qui économise + tranquillise les agences |
| **Sprint 3** | 2 sem | Boucle d'optimisation post-pub | LE moat, justifie l'abonnement récurrent |
| **Sprint 4** | 1 sem | Crédits + click-to-edit | Polish commerciale, prêt à scaler |

---

## Pré-requis avant de lancer V2

- [ ] V1 (actuelle) lancée publiquement
- [ ] Au moins 10 clients payants utilisant l'outil
- [ ] Feedback réel collecté (interviews 5 users mini)
- [ ] Décision basée sur le feedback, pas sur cette roadmap théorique
- [ ] Métriques baseline V1 (conversion landings générées, churn, NPS)

**Règle absolue** : ne PAS dev ces features sans validation user. Le risque = construire un Lovable bis dans le vide.

---

## Ce qu'on ne fait PAS (anti-roadmap)

❌ Génération full-stack apps (= devenir Emergent → guerre perdue)
❌ Mobile apps (Expo/React Native) → hors scope e-com
❌ Sandbox d'exécution VM (Firecracker, E2B) → trop cher pour notre usage
❌ Multi-langage backend → on reste Next.js + Supabase
❌ Marketplace de templates externes → garde la curation interne

---

## Sources d'inspiration

- Emergent.sh — pipeline multi-agents et chat itératif
- Lovable.dev — preview live et iteration
- Webflow AI — design intelligent
- Framer AI — édition naturelle
- Notre propre roadmap : `/Users/mac/nexara/konvert/STRATEGIE.md`

---

**Prochaine revue de ce document** : 30 jours après le lancement public, avec données user réelles en main.
