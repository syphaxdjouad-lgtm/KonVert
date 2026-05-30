# Sourcing 2 000 leads — Plan 4 jours (28-31 mai 2026)

## Répartition cible par pays

| Pays | Leads cibles | Pourcentage | Priorité |
|---|---|---|---|
| France | 900 | 45% | Primaire |
| Belgique + Suisse | 200 | 10% | Primaire |
| Maroc | 300 | 15% | Secondaire |
| UAE + KW + SA | 400 | 20% | Secondaire |
| Égypte | 200 | 10% | Tertiaire |

## Répartition cible par verticale

| Verticale | Leads cibles | Raison |
|---|---|---|
| Mode / Prêt-à-porter | 500 | Volume fort, pages produit critiques |
| Beauté / Skincare | 400 | ROAS sensible à la page landing |
| Maison / Déco | 350 | Catalogue souvent grand (20+ SKU) |
| Santé / Wellness | 350 | Pain fort : pages produit réglementées = conversion basse |
| Sport / Fitness | 200 | Croissance forte MENA |
| Autre DTC | 200 | Buffer |

---

## Jour 1 — Samedi 30 mai : FR (cible 600 leads bruts)

### Outil 1 : BuiltWith free
URL : https://builtwith.com/websites/shopify
- Aller sur la page gratuite BuiltWith
- Filtrer : Technology = Shopify, Country = France
- Exporter les 500 premiers résultats en CSV (limite free)
- Conserver : shop_url, shop_name
- Enrichir avec email via Hunter.io (domaine → email founder)
- Fichier sortie : `leads-raw-builtwith-FR.csv`

### Outil 2 : Firecrawl MCP — Shopify directories
Sources à crawler via `mcp__firecrawl__firecrawl_search` :
```
query: "site:myshopify.com France mode beauté maison"
query: "boutique Shopify France skincare wellness sport"
query: "ecommercedb.com liste boutiques france shopify"
query: "store-leads.com shopify france"
```
- Extraire : shop URL, nom boutique, contact visible
- Volume attendu : 100-150 leads bruts
- Fichier sortie : `leads-raw-firecrawl-FR.csv`

### Outil 3 : Meta Ad Library manuel
URL : https://www.facebook.com/ads/library/?active_status=active&country=FR
- Mots-clés par verticale :
  - Mode : "robe", "tenue", "collection", "style"
  - Beauté : "skincare", "sérum", "crème", "soin"
  - Maison : "décoration", "lampe", "coussin", "cuisine"
  - Wellness : "complément", "bien-être", "santé", "sport"
- Pour chaque annonceur : cliquer sur le nom → trouver site web
- Vérifier : site en Shopify (footer "Powered by Shopify" ou BuiltWith)
- Trouver email : page Contact / Mentions légales du site
- Volume attendu : 50-100 leads avec email direct
- Fichier sortie : `leads-raw-metaads-FR.csv`

---

## Jour 2 — Dimanche 31 mai : MENA (cible 500 leads bruts)

### Outil 1 : Apollo.io free (3-5 comptes)
Créer les comptes sur : https://app.apollo.io
- Compte 1 : email perso 1 → 50 contacts
- Compte 2 : email perso 2 → 50 contacts
- Compte 3 : email perso 3 → 50 contacts
Total : 150 contacts enrichis avec email

Filtres Apollo par compte :
- Industry : "Retail", "Consumer Goods", "E-Commerce"
- Job Title : "Founder", "CEO", "Co-Founder", "CMO", "Marketing Manager", "Head of E-Commerce"
- Country : Maroc (compte 1), UAE + KW (compte 2), SA + EG (compte 3)
- Company Size : 1-50 employés
- Technologies : "Shopify" (filtre Apollo premium parfois accessible en free)

Vérifier : l'email est personnel (pas info@ ou contact@)
Fichier sortie : `leads-raw-apollo-MENA.csv`

### Outil 2 : LinkedIn Sales Navigator (essai 30 jours)
Activer l'essai : https://www.linkedin.com/sales/
- Filtre 1 (Maroc/UAE) :
  - Title : Founder OR CEO OR CMO OR "Marketing Manager"
  - Industry : Retail OR "Consumer Goods" OR "E-Commerce"
  - Geography : Morocco, United Arab Emirates, Saudi Arabia, Egypt, Kuwait
  - Company Headcount : 1-50
- Exporter via Phantombuster LinkedIn Sales Navigator Extractor (free tier : 3 agents)
  - Paramétrer : export 500 profils → CSV avec nom, prénom, company, LinkedIn URL
  - Enrichir email via Hunter.io sur chaque domaine d'entreprise
- Volume attendu : 200-250 profils avec email partiel
- Fichier sortie : `leads-raw-linkedin-MENA.csv`

### Outil 3 : Groupes Facebook MENA
- Rejoindre (si pas encore membre) : "Dropshipping Maghreb", "E-commerce MENA", "Shopify Arabic"
- Chercher les posts "ma boutique" ou "je vends" ou "nouveau lancement"
- Pour chaque poster : visiter le profil, trouver le lien boutique, récupérer l'email (mentions légales ou page contact)
- Volume attendu : 50-100 leads
- Fichier sortie : `leads-raw-fb-MENA.csv`

---

## Jour 3 — Lundi 1er juin : Mix scraping (cible 500 leads bruts)

### Outil 1 : Snov.io free (50 crédits)
URL : https://app.snov.io
- Email Finder par domaine sur les boutiques Jour 1/2 sans email encore trouvé
- Priorité : leads FR Score potentiel 7+
- 50 crédits = 50 domaines vérifiés

### Outil 2 : Hunter.io free (comptes multiples)
- Compte 1 : 25 recherches/mois
- Compte 2 : 25 recherches/mois
Total : 50 domaines → emails fondateurs FR/BE/CH

### Outil 3 : Reddit scraping manuel
- Subreddits : r/shopify (filtrer posts FR), r/ecommerce, r/FrenchEntrepreneurs
- Chercher les posts "my store", "my Shopify", "boutique", "lancement"
- Récupérer l'URL du site mentionné → trouver email
- Volume attendu : 50-80 leads
- Fichier sortie : `leads-raw-reddit.csv`

### Outil 4 : Firecrawl enrichissement email
- Sur les leads Jour 1 sans email : scraper la page "Mentions légales" du site
  - La loi française oblige les e-commerçants à publier un email de contact légal
  - Extraction automatique via Firecrawl extract
- Volume attendu : récupérer 100-150 emails manquants sur les 600 leads FR bruts

### Outil 5 : Communautés SMMA/e-com FR
- Discord : "Shopify France", "E-commerce France", "SMMA France" — lister les membres qui présentent leur boutique
- Skool (groupes e-com FR publics) : mêmes profils
- Volume attendu : 50-100 leads avec email
- Fichier sortie : `leads-raw-communities.csv`

---

## Jour 4 — Mardi 2 juin matin : Vérification + dédoublonnage

### Étape 1 : Consolidation
Fusionner tous les CSV :
- leads-raw-builtwith-FR.csv
- leads-raw-firecrawl-FR.csv
- leads-raw-metaads-FR.csv
- leads-raw-apollo-MENA.csv
- leads-raw-linkedin-MENA.csv
- leads-raw-fb-MENA.csv
- leads-raw-reddit.csv
- leads-raw-communities.csv

Dédoublonner sur : email (primary) + shop_url (secondary)

### Étape 2 : Nettoyage
Supprimer automatiquement :
- Emails role-based : info@, contact@, support@, hello@, admin@
- Emails génériques sans prénom identifié
- Domaines blacklistés (anti-ICP secteurs)

### Étape 3 : Vérification emails
- MillionVerifier : https://www.millionverifier.com (100 vérifs gratuites)
  - Prioriser les 100 leads Score 9-10
- Hunter Email Verifier (inclus dans recherche domaine) : couvrir le reste
- Statuts à conserver : "valid" uniquement (supprimer "risky", "unknown", "invalid")

### Étape 4 : Scoring final (1-10)
Pour chaque lead vérifié :
- +3 points : email founder identifié (prénom@domaine)
- +2 points : catalog size >=20 produits vérifié
- +2 points : trafic >5k/mois estimé (SimilarWeb free)
- +2 points : ads actives visibles (Meta Ad Library)
- +1 point : verticale prioritaire (mode, beauté, maison, wellness, sport)
Maximum : 10 points

### Étape 5 : Export final
Fichier : `leads-verified-2000.csv`
Format complet (13 colonnes) :
```
email,prenom,shop_name,shop_url,country,vertical,traffic_estimate,catalog_size,source,score,ad_signal,note_perso,status
```
- Trier par score décroissant
- Batch 1 (envoi J0-J+7) : les 300 premiers (Score 7-10)
- Batch 2 (envoi J+7-J+14) : leads 301-700
- Batch 3 (envoi J+14-J+21) : leads 701-1200
- Batch 4 (envoi J+21-J+30) : leads 1201-2000

---

## Estimation réaliste par source

| Source | Leads bruts | Avec email | Avec email vérifié | Score 7+ |
|---|---|---|---|---|
| BuiltWith free | 500 | 200 (40%) | 160 | 80 |
| Firecrawl crawl | 200 | 120 (60%) | 100 | 60 |
| Meta Ad Library | 100 | 90 (90%) | 75 | 60 |
| Apollo.io (3 cptes) | 150 | 150 (100%) | 120 | 90 |
| LinkedIn Sales Nav | 250 | 100 (40%) | 80 | 60 |
| Facebook MENA | 150 | 75 (50%) | 60 | 30 |
| Snov.io + Hunter | 200 | 200 (100%) | 160 | 80 |
| Reddit + communautés | 150 | 80 (53%) | 60 | 30 |
| Mentions légales Firecrawl | 150 | 150 (100%) | 120 | 70 |
| **TOTAL** | **1850** | **1165** | **935** | **560** |

Note : l'objectif "2000 leads vérifiés" avec une stack 100% gratuite est ambitieux. La cible réaliste est **1000-1200 leads vérifiés bounce <2%**, avec **500-600 leads Score 7+** prêts à l'envoi. Le chiffre 2000 reste possible en étirant sur J+5-J+7 si le sourcing J1-J4 livre court.

---

## Outils de secours si volume insuffisant

Si total vérifiés <800 leads au J4 matin :
1. **MyIP.ms** : liste sites sur IPs Shopify → filtrer TLD .fr → email via Hunter
2. **Ecommercedb.com** (filtres gratuits) : liste boutiques par pays/verticale
3. **Kompass.com free** : annuaire entreprises FR avec email parfois public
4. **Societe.com** : e-commerçants FR avec email public (très souvent = fondateur)
5. **Instagram scraping manuel** : rechercher par hashtag (#shopifyfrance, #boutiqueenligne) → profil pro → lien en bio → site Shopify → email mentions légales
