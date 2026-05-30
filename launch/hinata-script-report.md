# HINATA — Rapport livraison script generate-ph-assets.py

## Script livré

`/Users/mac/nexara/konvert/launch/assets/generate-ph-assets.py`

---

## Commande exacte à lancer

```bash
# Sourcer la clé depuis l'env kirin (recommandé)
source /Users/mac/nexara/projets/kirin/app/.env.local
python3 /Users/mac/nexara/konvert/launch/assets/generate-ph-assets.py
```

Ou si FAL_KEY est déjà dans l'env :

```bash
python3 /Users/mac/nexara/konvert/launch/assets/generate-ph-assets.py
```

---

## Variable d'environnement requise

| Variable | Où la trouver |
|---|---|
| `FAL_KEY` | `/Users/mac/nexara/projets/kirin/app/.env.local` ou `/Users/mac/nexara/moteur/agents-ia/.env.shared` |

Le script lira `os.environ['FAL_KEY']`. Si absente, il affiche un message d'erreur clair avec les instructions et s'arrête.

---

## Estimation temps d'exécution

~2 à 4 minutes en séquentiel :
- 4 images ideogram/v3 (~20s/img) = ~80s
- 10 images flux/schnell (~5s/img) = ~50s
- Polling overhead + downloads = ~60s
- Total : ~3 min sans retry, ~8 min si max retries sur tous les slots

---

## Estimation coût total

| Modèle | Images | Prix/img | Sous-total |
|---|---|---|---|
| `fal-ai/ideogram/v3` | 4 (slots cover-ph + page-annotee) | $0.05 | $0.20 |
| `fal-ai/flux/schnell` | 10 (slots 2-3-5-6-7) | $0.003 | $0.03 |
| **Total** | **14** | — | **~$0.23 USD** |

Avec retries (cas défavorable max) : ~$0.70 USD.

---

## Slots générés

| # | Slot name | Modèle | Priorité | Output fichiers |
|---|---|---|---|---|
| 1 | `cover-ph` | ideogram/v3 | P0 | ph-cover-ph-v1.png, ph-cover-ph-v2.png |
| 2 | `hero-before-after` | flux/schnell | P0 | ph-hero-before-after-v1.png, ph-hero-before-after-v2.png |
| 3 | `wizard-flow` | flux/schnell | P0 | ph-wizard-flow-v1.png, ph-wizard-flow-v2.png |
| 4 | `page-annotee` | ideogram/v3 | P0 | ph-page-annotee-v1.png, ph-page-annotee-v2.png |
| 5 | `templates-grid` | flux/schnell | P1 | ph-templates-grid-v1.png, ph-templates-grid-v2.png |
| 6 | `dashboard` | flux/schnell | P1 | ph-dashboard-v1.png, ph-dashboard-v2.png |
| 7 | `tunnel-essai` | flux/schnell | P1 | ph-tunnel-essai-v1.png, ph-tunnel-essai-v2.png |

---

## Checklist de validation post-run (par slot)

### cover-ph (P0 — critique)
- [ ] Fichier > 200 KB (sinon image tronquée)
- [ ] La tagline "Turn any product link into a page that sells" est lisible (ideogram garantit le texte)
- [ ] Fond off-white ou blanc visible — pas de fond noir
- [ ] Couleur corail #ff6154 présente sur le texte ou un élément
- [ ] "June 2 on ProductHunt" visible quelque part dans le visuel

### hero-before-after (P0)
- [ ] Split gauche/droite visible (deux panneaux distincts)
- [ ] Texte "30 seconds" ou "Conversion-optimized" lisible en overlay
- [ ] Pas d'artefacts sur la frontière du split
- [ ] Fond global clair (pas noir)

### wizard-flow (P0)
- [ ] 3 étapes clairement visibles avec numéros 1, 2, 3
- [ ] Flèches de progression présentes entre les étapes
- [ ] URL bar visible dans step 1

### page-annotee (P0)
- [ ] 4 callouts d'annotation visibles (Hook, Social Proof, FAQ, CTA)
- [ ] Lignes/flèches reliant les callouts aux sections de la page
- [ ] Texte des labels lisible (ideogram garantit)

### templates-grid (P1)
- [ ] Au moins 4 templates visibles en grille
- [ ] Badge "40+ Templates" visible
- [ ] Chaque template montre une niche différente

### dashboard (P1)
- [ ] Sidebar de navigation visible
- [ ] Liste de pages générées visible dans le contenu principal
- [ ] Bouton CTA en corail présent

### tunnel-essai (P1)
- [ ] Input URL bien visible
- [ ] Bouton "Generate" en corail visible
- [ ] Message "no account needed" ou équivalent présent

---

## Plan B — Régénération sélective par slot

Si un slot rate (fichier absent ou visuel inacceptable) :

```bash
# Supprimer les fichiers ratés (sinon le script les skip)
rm /Users/mac/nexara/konvert/launch/assets/ph-cover-ph-v1.png
rm /Users/mac/nexara/konvert/launch/assets/ph-cover-ph-v2.png

# Relancer uniquement ce slot
python3 /Users/mac/nexara/konvert/launch/assets/generate-ph-assets.py --slot cover-ph
```

Slots disponibles pour `--slot` :
- `cover-ph`
- `hero-before-after`
- `wizard-flow`
- `page-annotee`
- `templates-grid`
- `dashboard`
- `tunnel-essai`

---

## Notes importantes

- Le script est **idempotent** : si un fichier PNG existe déjà, il est skipé sans frais.
- Max 3 retries automatiques par image — si 3 echecs, le slot est flagué en fin de rapport.
- Tous les outputs dans `/Users/mac/nexara/konvert/launch/assets/`
- Nomenclature : `ph-{slot-name}-v{1|2}.png`
- Les outputs bruts sont la matière OBITO — pas de texte overlay final, pas de logo, pas de CTA baked-in.

---

*Rapport généré le 2026-05-30 par HINATA / NEXARA*
