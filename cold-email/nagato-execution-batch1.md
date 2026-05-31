# NAGATO — Rapport Exécution Batch 1 — 31 mai 2026

## Résultat

**123 leads ajoutés** au CSV `leads-verified-template.csv`.

Cible annoncée : 200-300. Réel livré : 123. Explication en bas (issues).

---

## Répartition par pays

| Pays | Leads | % |
|---|---|---|
| FR | 72 | 58.5% |
| BE | 15 | 12.2% |
| AE | 14 | 11.4% |
| CH | 5 | 4.1% |
| MA | 8 | 6.5% |
| EG | 6 | 4.9% |
| SA | 2 | 1.6% |
| KW | 1 | 0.8% |

---

## Répartition par verticale

| Verticale | Leads |
|---|---|
| mode | 55 |
| beaute | 35 |
| maison | 18 |
| sport | 7 |
| sante | 1 |
| autre | 7 (dont 4 hors ICP score 4-5 — à exclure du batch envoi) |

---

## Score moyen ICP

**6.2 / 10** (médiane : 6)

Leads Score 8-10 : 12 leads
Leads Score 7 : 28 leads
Leads Score 6 : 68 leads
Leads Score 5 ou moins : 15 leads (hors batch envoi)

---

## Top 5 leads — Qualité maximale (attaquer en premier)

**1. Squatwolf UAE / SA (Score 9)**
- Email : hello@squatwolf.com / hello@squatwolf.ae
- Fondateur : Wajdan Gul (wajdan@squatwolf.com confirmé via RocketReach)
- 236k+ visites/mois. Shopify confirmé. 120+ pays. Sport activewear DTC pur.
- Note_perso : page "Warrior" — pas de "Complete the look" bundle sur les landing

**2. Asphalte (Score 8)**
- Email : contact@asphalte.com
- Fondateur : William Hauvette. SIRET 53424741600033.
- Modèle prevente DTC unique. Shopify. Fort catalogue mode homme.
- Note_perso : page prevente "Chino" — compteur commandes sans FAQ taille visible

**3. Typology (Score 8)**
- Email : hello@typology.com
- Fondateur : Ning Li. Levée 10M€.
- Skincare DTC 100+ SKU. Shopify. Configurateur routine.
- Note_perso : configurateur ingrédients sans landing par actif dédiée

**4. Oh My Cream (Score 8)**
- Email : hello@ohmycream.com
- Fondatrice : Juliette Lévy. Pioneer beauté Shopify FR.
- 150+ produits. 15+ boutiques. Catalog énorme.
- Note_perso : landing par marque partenaire sans storytelling OhMyCream propre

**5. Maison Standards (Score 8)**
- Email : hello@maison-standards.com
- Fondateur : Uriel Karsenti (confirmé FashionNetwork).
- Mode DTC minimaliste FR. Shopify.
- Note_perso : landing "Le Jean Parfait" sans comparateur coupe visuel interactif

---

## Issues rencontrées

### Issue 1 — Outils bloqués (critique)
Bash et WebFetch ont refusé de s'exécuter dans cette session. Sans ces outils, impossible de :
- Scraper automatiquement les pages mentions légales pour extraire 300+ emails en masse
- Crawler storeleads.app / dbshopi.com / woorank pour extraire des listes de 100+ boutiques d'un coup
- Vérifier les emails via NeverBounce
**Impact : volume divisé par 2-3 vs la cible.**

### Issue 2 — Emails incertains
Pour environ 40% des leads, l'email est un pattern déduit (contact@, hello@, prenom@) pas un email extrait de mentions légales. Avant envoi, vérification NeverBounce obligatoire sur ces 40%.

Les emails confirmés avec sources publiques :
- Cabaïa : contact@cabaia.fr (mentions légales Shopify confirmées)
- Circle Sportswear : via annuaire-entreprises.data.gouv.fr
- Leticia Ponti : SIRET 794 556 084 00018 (email déduit du pattern)
- Bohemian Chic Interior : bohemianchicinterior@gmail.com (mentions légales myshopify.com)
- Squatwolf : wajdan@squatwolf.com (RocketReach confirmé)

### Issue 3 — Leads MENA peu denses
Les boutiques UAE/MA/EG avec données publiques suffisantes sont peu nombreuses sans accès aux bases Apollo ou à BuiltWith payant. 29 leads MENA vs 94 FR/BE/CH. Ratio inversé vs plan.

### Issue 4 — Quelques hors ICP inclus (à nettoyer)
5-6 leads avec Score 4 ou hors vertical (Almarai, Egy Book Store, Revibe) sont dans le CSV avec note explicite. A exclure du batch envoi via filtre score >= 6.

---

## Estimation pour atteindre 2000 leads

Rythme actuel (session WebSearch seule, pas de Bash ni WebFetch) : ~60-80 leads/heure.
Avec Bash + WebFetch opérationnels : ~200-300 leads/heure (scraping automatisé mentions légales).

Pour 2000 leads :
- Sans Bash/WebFetch : ~25-30 heures de session WebSearch manuelle
- Avec Bash + WebFetch + accès Apollo/DBShopi : 8-12 heures
- **Recommandation : débloquer Bash pour la prochaine session.** Une session Bash de 2-3h sur storeleads.app + dbshopi.com + woorank.com produit 300-500 leads en une passe.

---

## Prochaines actions pour atteindre 2000

1. **Débloquer Bash** pour la session suivante (scraping CLI curl/jq sur APIs publiques)
2. **DBShopi** ($49 pays) — 98k boutiques FR avec 78% emails vérifiés — investissement ROI immédiat
3. **Firecrawl mentions légales** — scraper /pages/mentions-legales sur les 123 boutiques pour compléter les emails manquants
4. **Apollo.io** 3 comptes free — 150 contacts MENA avec emails (cofondateurs + CMO filtrés industry Retail)
5. **Session batch 2** : +300 leads FR mode/beauté via crawl webplease.fr (70 boutiques) + lobstter.com (120 boutiques) + boutique-cle-en-main.com (15 boutiques)
