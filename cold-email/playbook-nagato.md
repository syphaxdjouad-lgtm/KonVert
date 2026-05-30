# Playbook NAGATO — Cold Outbound Konvert
## Objectif J0 (2 juin) → J+30 (2 juillet) : 1 paiement Pro (79€) ou Agency (199€) confirmé Stripe

---

## Contexte stratégique

- **Produit ciblé** : Konvert Pro 79€/mois ou Agency 199€/mois — PAS Starter
- **Stack : 100% gratuit** — Gmail/Outlook persos, Notion CRM, Cal.com free
- **Volume** : 60-150 emails/jour (multi-inbox) — pas de Smartlead/Instantly
- **Domaine principal `konvertpilot.com` préservé** — jamais utilisé pour le cold

---

## ICP cible Pro/Agency (version affinée 2 juin 2026)

| Critère | Cible |
|---|---|
| Plateforme | Shopify (détecté via BuiltWith / Wappalyzer) |
| Catalogue | 20+ produits publiés |
| Trafic | >5 000 visiteurs/mois estimé |
| Marchés | FR, BE, CH, MA, UAE, SA, EG, KW |
| Verticales | Mode, beauté, maison/déco, santé/wellness, sport/fitness |
| Email cible | Founder / CMO / Marketing manager — PAS info@ ni contact@ |
| Anti-ICP | Dropshipping pur (catalogue <20 produits), CBD, MLM, B2B SaaS pur, trafic <2k/mois |

---

## Inboxes d'envoi (à valider avec Syphax avant J0)

> **Demande ouverte** : confirmer les 3-5 inboxes disponibles avant lundi 2 juin matin.

| Inbox | Statut | Volume max/jour |
|---|---|---|
| Email perso Syphax (Gmail warm) | A confirmer | 20-30 |
| 2e email perso / collaborateur #1 | A confirmer | 20-30 |
| 3e email perso / collaborateur #2 | A confirmer | 20-30 |
| syphax@[domaine-secondaire].com (Outlook free) | A créer si besoin | 20-30 |
| 5e inbox optionnelle | A confirmer | 20-30 |

**Règle** : jamais envoyer depuis `@konvertpilot.com` ni `@nexara.fr` (protection domaines prod).

**Signature à utiliser sur toutes les inboxes :**
```
Syphax | Fondateur Konvert
konvertpilot.com — Tes produits méritent des pages qui vendent.
```
(Pas de photo, pas de LinkedIn perso — en ligne avec politique brand NEXARA)

---

## Sourcing 2 000 prospects — Plan 4 jours

### Jour 1 — Samedi 30 mai : FR e-commerçants (cible ~600 leads bruts)

**BuiltWith free (builtwith.com/free)**
- Filtre : technologie = "Shopify" + pays = France
- Critères : exclure domaines sans trafic visible
- Export 500 leads max (limite free tier)

**Firecrawl MCP — crawl Shopify directories**
- Sources à crawler :
  - `site:myshopify.com inurl:.fr` via Google
  - `store-leads.com` (filtres gratuits)
  - `ecommercedb.com/france` (liste publique)
  - Annuaires boutiques Shopify FR publiés sur GitHub (awesome-shopify-stores type lists)
- Objectif : 150-200 leads bruts supplémentaires

**Firecrawl — Meta Ad Library scrape**
- URL : `facebook.com/ads/library/?active_status=active&country=FR`
- Mots-clés : "skincare", "bijou", "maison", "sport", "wellness"
- Pour chaque annonceur : récupérer URL boutique → identifier Shopify

**Livrable Jour 1** : ~600 leads bruts FR dans `leads-raw-FR.csv`

---

### Jour 2 — Dimanche 31 mai : MENA e-commerçants (cible ~500 leads bruts)

**Apollo.io free (créer 3-5 comptes séparés sur emails différents)**
- Chaque compte : 50 emails/mois gratuits
- Filtres : Industry = "Retail" / "E-Commerce", Geography = MA / UAE / SA / EG / KW
- Job titles : Founder, CEO, CMO, "Marketing Manager", "Head of E-Commerce"
- Export max : 50 contacts/compte × 3-5 comptes = 150-250 leads

**LinkedIn Sales Navigator essai gratuit 30 jours**
- Filtre : Job title "Founder OR CEO OR CMO" + Industry "Retail" + Country ciblé
- Secteurs : mode, beauté, maison, wellness, sport
- 20-50 connexions/jour (ne pas dépasser pour éviter restriction)
- Extraction via Phantombuster free tier (3 agents gratuits) → CSV

**Hunter.io free (créer 2-3 comptes)**
- 25 recherches domaine/mois par compte
- Pour chaque boutique identifiée : hunter.io/domain-search → email founder

**Livrable Jour 2** : ~500 leads bruts MENA dans `leads-raw-MENA.csv`

---

### Jour 3 — Lundi 1er juin : Mix scraping manuel (cible ~500 leads bruts)

**Snov.io free (50 crédits)**
- Email finder par domaine sur les boutiques déjà listées sans email
- Priorité : leads FR/BE/CH sans email encore trouvé

**Communautés et forums**
- Facebook Groups : "Shopify France", "E-commerce France", "Dropshipping Maghreb", "E-commerce MENA"
  - Chercher les posts de fondateurs qui présentent leurs boutiques
  - Scraper profils publics → trouver URL boutique + email (mentions légales site)
- Reddit : `r/shopify`, `r/ecommerceFR`, `r/Algerie_ecom`
  - Posts signatures avec URLs boutiques Shopify
- Slack / Discord SMMA FR : repérer fondateurs e-com qui se présentent

**Firecrawl MCP — enrichissement signaux d'achat**
- Sur les 600+500 leads déjà sourcés : scraper la page "Mentions légales" (email légal souvent = email founder FR)
- Scraper les pages "À propos" pour identifier le prénom du fondateur

**Livrable Jour 3** : ~500 leads bruts mix dans `leads-raw-mix.csv`

---

### Jour 4 — Mardi 2 juin matin (avant 10h) : Vérification + dédoublonnage

**Vérification emails**
- MillionVerifier free : 100 vérifications gratuites → priorité leads chauds Score 8+
- Hunter.io Email Verifier (inclus dans recherche domaine) : couvre leads restants
- Retirer : catch-all, invalid, role-based (info@, contact@, support@)
- Cible : bounce rate <2% sur la liste finale

**Dédoublonnage**
- Consolider `leads-raw-FR.csv` + `leads-raw-MENA.csv` + `leads-raw-mix.csv`
- Supprimer doublons sur email + URL boutique
- Scorer chaque lead 1-10 (voir grille ci-dessous)
- Exporter vers `leads-verified-2000.csv` (format complet)

**Import Notion CRM**
- Importer les leads Score 7+ en priorité (batch 1)
- Compléter les champs manuellement pour les leads chauds

**Livrable Jour 4 avant 10h** : `leads-verified-2000.csv` + Notion CRM alimenté + prêt à envoyer J0

---

## Grille de scoring leads (1-10)

| Score | Critères |
|---|---|
| 9-10 | Shopify + 50+ produits + trafic >20k/mois estimé + email founder + ads actives + verticale prioritaire |
| 7-8 | Shopify + 20+ produits + trafic >5k/mois + email founder |
| 5-6 | Shopify + trafic incertain + email role-based mais probable |
| 3-4 | Shopify probable + catalogue non vérifié |
| 1-2 | Données incomplètes ou anti-ICP |

**Règle** : envoyer d'abord les leads Score 9-10, puis 7-8. Mettre en pause les 5-6 jusqu'à la semaine 2.

---

## Format CSV final

```
email,prenom,shop_name,shop_url,country,vertical,traffic_estimate,catalog_size,source,score,ad_signal,note_perso,status
```

Exemple :
```
amira@maisonzine.ma,Amira,Maison Zine,maisonzine.ma,MA,maison,12000,45,apollo,9,Meta ads actives,"J'ai vu ton ad sur la collection Ramadan — la page de destination ne met pas en avant le délai de livraison MA, ce qui freine probablement les conversions",cold
```

---

## Routine quotidienne NAGATO (J0 → J+30)

### 09h00 — Revue replies J-1 (15 min)
1. Ouvrir Gmail label "konvert-outbound" sur chaque inbox
2. Classer chaque reply : positif / négatif / question / désinscription
3. Mettre à jour Notion CRM : changer status + last touch date + touch count
4. Identifier les leads chauds (replied_pos) → priorité du jour 14h-17h
5. Traiter désinscriptions immédiatement (supprimer du CRM, ne plus contacter)

### 10h00-12h00 — Envoi batch (90 min)
- Volume : 20-30 emails par inbox active
- Espacer les envois : 3-5 min entre chaque email (jamais de blast)
- Utiliser le template ZARA correpondant à la semaine (E1/E2/E3/E4)
- Personnaliser OBLIGATOIREMENT la ligne 1 (observation unique par prospect)
- Cocher envoyé dans le CRM : status → `sent_t1`, last touch date = aujourd'hui
- Ne jamais envoyer si le domaine bounce rate a dépassé 2% la veille

### 14h00-17h00 — Réponses 1-to-1 (3h)
- Répondre dans les 4h max à tout replied_pos
- Mode discovery : écouter 70%, parler 30%
- Si intérêt confirmé : proposer call 15 min via Cal.com → envoyer lien dans la réponse
- Logger chaque échange dans Notion : résumé + next step + score mis à jour
- Si replied_neg ou désinscription : fermer proprement et mettre tag `closed_lost`

### 17h00-18h00 — Booking calls (1h)
- Confirmer les calls du lendemain (Cal.com envoie reminder auto)
- Préparer les calls : lire les notes discovery Notion, préparer les 5 questions de qualification
- Si no-show la veille : envoyer email J+1 (template no-show ZARA)
- Mettre à jour métriques hebdo dans Notion

### Vendredi soir — Reporting hebdo (30 min)
Créer une note Notion "Rapport S[n] — [date]" avec :
- Envoyés cette semaine / cumulé
- Reply rate (replies / envoyés)
- Positive reply rate (interested / envoyés)
- Meetings bookés
- Trials démarrés
- Paiements confirmés Stripe
- Top 3 objections rencontrées
- Décision : continuer variante A ou tester variante B

---

## Métriques cibles hebdo (volume réduit vs plan initial — assumé)

| Semaine | Envoyés cumulés | Replies cibles | Meetings cibles | Trials | Paiements |
|---|---|---|---|---|---|
| S1 (J0 → J+7) | 300-500 | 10-25 | 1-3 | 0-1 | 0 |
| S2 (J+7 → J+14) | 700-1000 | 25-50 | 3-6 | 1-3 | 0-1 |
| S3 (J+14 → J+21) | 1100-1500 | 50-75 | 6-10 | 3-5 | 0-1 |
| S4 (J+21 → J+30) | 1500-2000 | 75-100 | 10-15 | 5-8 | 1+ (Pro/Agency) |

---

## Plan de bataille J0 → J+7 (quotidien)

### J0 — Lundi 2 juin

- 09h00 : confirmer que les inboxes sont prêtes (SPF/DKIM/DMARC vérifiés via mailtester.com)
- 09h30 : charger batch 1 dans le CRM : 50 leads Score 9-10 (mélange FR + MENA)
- 10h00-12h00 : envoyer E1 à 50 leads (3 inboxes × ~17 emails), 3 min entre chaque
- 14h00 : si déjà des replies → répondre immédiatement
- 17h00 : log Notion — envoyés J0 : 50, replies : X

### J+1 — Mardi 3 juin

- 09h00 : revue replies J0
- 10h00-12h00 : envoyer E1 à 50 nouveaux leads (Score 9-10)
- 14h00-17h00 : répondre aux positifs J0 + proposer call 15 min
- 17h00 : log Notion — envoyés cumulés : 100

### J+2 — Mercredi 4 juin

- 09h00 : revue replies J+1
- 10h00-11h00 : E2 aux leads J0 qui n'ont pas répondu (valeur ajoutée + relance douce)
- 11h00-12h00 : E1 à 50 nouveaux leads Score 7-8
- 14h00-17h00 : calls bookés J0 (si déjà) + réponses positifs

### J+3 — Jeudi 5 juin

- 09h00 : revue replies J+2
- 10h00-12h00 : E1 à 50 nouveaux leads + E2 aux leads J+1
- 14h00 : 1er call discovery potentiel si meeting booké J0/J+1
- Log Notion : envoyés cumulés ~200

### J+4 — Vendredi 6 juin

- 09h00 : revue replies
- 10h00-12h00 : E1 à 50 nouveaux leads + E2 aux leads J+2 + E3 (case study) leads J0 non-réponse
- 17h00 : 1er rapport hebdo S1 draft

### J+5 — Samedi 7 juin (optionnel — seulement si bonne dynamique)

- 10h00-11h00 : sourcing 50 leads frais si stock épuisé
- Pas d'envoi cold le weekend (taux d'ouverture plus faible)

### J+6 — Dimanche 8 juin

- Repos ou sourcing leads semaine suivante

### J+7 — Lundi 9 juin

- Bilan S1 complet + ajustement stratégie (pivot ICP ou variante email si reply rate <2%)
- Démarrer séquence E4 breakup pour leads J0 non-réponse (cadence 14 jours)

---

## Gestion des objections terrain (top 5 pour Konvert)

| Objection | Réponse terrain |
|---|---|
| "On gère ça en interne" | "Combien de temps par fiche produit ? On réduit ça à 30 sec par page — tu veux voir ?" |
| "On a déjà un copywriter" | "Il vous coûte combien par mois ? Konvert coûte X fois moins sur le même volume." |
| "On verra plus tard" | "Je comprends. Quand tu relances ta prochaine collection, on reprend ça ?" (mettre date rappel dans Notion) |
| "C'est quoi la différence avec ChatGPT ?" | "ChatGPT génère du texte. Konvert génère une page complète optimisée conversion Shopify, prête à publier en 30 sec." |
| "Pas de budget" | "Le Pro à 79€ = 1 vente supplémentaire par mois suffit à couvrir. Tu veux un calcul rapide ?" |

---

## Escalation rules (stop conditions)

| Signal | Action immédiate |
|---|---|
| Bounce rate >2% sur une inbox | Stop cette inbox, nettoyer la liste, reprendre en 48h |
| Score mailtester.com <8 | Stop envois, diagnostiquer DNS/contenu avant de reprendre |
| 1 spam report reçu | Pause 48h toutes inboxes, audit dernier batch |
| Reply rate <1% après 100 envois | Pivot : changer variante E1 + requalifier ICP |
| 0 reply positif après 200 envois | Appel d'urgence : revoir messaging avec ZARA + HASHIRAMA |

---

## Vérification deliverability par inbox (avant J0)

### Checklist pré-envoi (à valider J-1 — dimanche 1er juin)

- [ ] SPF configuré sur chaque domaine d'envoi (vérif : mxtoolbox.com)
- [ ] DKIM actif (vérif : dkimvalidator.com)
- [ ] DMARC configuré (vérif : mxtoolbox.com)
- [ ] Score mailtester.com >= 9/10 sur chaque inbox
- [ ] Gmail label "konvert-outbound" créé sur chaque inbox
- [ ] Filtre Gmail auto sur replies (from: prospects → label konvert-outbound)
- [ ] Tracking pixel = OFF sur toutes inboxes (Streak : désactiver tracking open)
- [ ] Cal.com lien prêt (type meeting : "Call découverte Konvert 15 min")
- [ ] Template E1 ZARA chargé dans Google Docs (prêt pour copier-coller)
- [ ] CRM Notion alimenté avec batch 1 (50 leads Score 9-10)
- [ ] Lien /essai konvertpilot.com testé et fonctionnel

---

## Handoff post-signature

Dès qu'un deal signe (Pro ou Agency) :
1. Confirmer paiement Stripe dans le dashboard
2. Créer dossier handoff Notion : notes discovery + plan souscrit + contacts + date onboarding
3. Passer le tag Notion CRM en `paid`
4. Transmettre dossier complet à DEIDARA pour onboarding
5. Mettre à jour reporting hebdo avec 1 paiement confirmé

---

## Questions à Syphax (max 2)

**Q1 (bloquante)** : Quelles sont les 3-5 inboxes Gmail/Outlook disponibles pour l'envoi cold ? Noms et emails exacts, pour que je les configure dans le CRM et que je valide leur score deliverability avant J0.

**Q2 (optionnelle)** : Y a-t-il un collaborateur disponible pour m'aider sur le sourcing manuel (scraping groupes Facebook MENA / communautés Discord) les jours 2 et 3 ?
