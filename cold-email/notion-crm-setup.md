# CRM Notion — Setup en 3 minutes

Schéma à copier-coller pour créer la base CRM cold email Konvert dans Notion.
Compatible avec import direct du fichier `leads-verified-template.csv` (même colonnes).

---

## Étape 1 — Créer une nouvelle Database Notion

1. Dans Notion, créer une nouvelle page → **+ New** → **Database — Table**
2. Nom : `Konvert — Cold Email CRM`
3. Icône : 📧 (ou 🚀)
4. Description : "Pipeline outbound Konvert J0=2026-06-02 — cible Pro 79€ / Agency 199€"

---

## Étape 2 — Configurer les 18 propriétés (dans l'ordre du CSV)

Copier-coller exactement ces noms + types (case-sensitive pour import CSV) :

| Propriété | Type Notion | Options / Format |
|---|---|---|
| `email` | **Title** (clé primaire) | — |
| `prenom` | Text | — |
| `shop_name` | Text | — |
| `shop_url` | URL | — |
| `country` | Select | FR, BE, CH, MA, UAE, SA, EG, KW |
| `vertical` | Select | mode, beaute, maison, sante, sport, autre |
| `traffic_estimate` | Number | format `Number with commas` |
| `catalog_size` | Number | format `Number` |
| `source` | Select | builtwith, apollo, hunter, firecrawl, linkedin, snov, manual, referral |
| `score` | Number | format `Number` (échelle 1-10, voir playbook NAGATO) |
| `ad_signal` | Checkbox | true si la boutique fait de la pub Meta/Google détectée |
| `note_perso` | Text | ⭐ CRITIQUE — première ligne unique pour personnalisation E1 (cf ZARA seq) |
| `status` | Select (avec couleurs) | cold (gris), sent_t1 (bleu clair), opened (bleu), replied_pos (vert), replied_neg (rouge), meeting_booked (jaune), trial_active (orange), paid (vert foncé), lost (gris foncé) |
| `last_touch` | Date | — |
| `touch_count` | Number | 0, 1, 2, 3 (max séquence 3-touch) |
| `next_touch` | Date | calculé : last_touch + 3j ou +7j selon séquence |
| `owner` | Select | syphax, collab1, collab2 |
| `notes` | Text | libre — replies, contexte, follow-up notes |

---

## Étape 3 — Vues à créer

### Vue 1 — `Pipeline` (Kanban groupé par status)

- **Type** : Board
- **Group by** : `status`
- **Hide** : `lost` (collapsed par défaut)
- **Sort** : `score` desc
- **Filter** : aucun
- Usage : vue principale quotidienne pour NAGATO

### Vue 2 — `À envoyer aujourd'hui` (Table filtrée)

- **Type** : Table
- **Filter** : `status` = `cold` AND `score` ≥ 6
- **Sort** : `score` desc, puis `country` asc
- **Limit** : 30 (= quota envoi/jour)
- Usage : liste exacte du batch matin 10h-12h

### Vue 3 — `Warm replies à traiter` (Table filtrée)

- **Type** : Table
- **Filter** : `status` IN [`replied_pos`, `opened`] AND `next_touch` ≤ today
- **Sort** : `last_touch` asc (les plus anciennes priorité)
- Usage : créneau 14h-17h NAGATO replies 1-to-1

### Vue 4 — `Meetings à booker` (Calendar)

- **Type** : Calendar
- **Date property** : `next_touch`
- **Filter** : `status` = `meeting_booked`
- Usage : suivi calls Cal.com

### Vue 5 — `Trials actifs J+1 à J+7` (Table)

- **Type** : Table
- **Filter** : `status` = `trial_active`
- **Sort** : `last_touch` asc
- Usage : nurture trials avant conversion

### Vue 6 — `Paid 💰` (Gallery)

- **Type** : Gallery
- **Filter** : `status` = `paid`
- **Sort** : `last_touch` desc
- Usage : trophy wall + LTV tracking + case study material

### Vue 7 — `Reporting hebdo` (Table)

- **Type** : Table
- **Group by** : `source`
- **Calculate** : count par colonne `status` (rollup)
- Usage : vendredi soir NAGATO weekly report

---

## Étape 4 — Import du CSV

1. Dans la database créée, cliquer ⋯ (top right) → **Merge with CSV**
2. Sélectionner `/Users/mac/nexara/konvert/cold-email/leads-verified-template.csv`
3. Notion va matcher automatiquement les colonnes (mêmes noms)
4. Valider l'import

⚠️ Si problème mapping : vérifier que les noms de colonnes Notion sont **exactement** `email`, `prenom`, etc. (minuscules, snake_case).

---

## Étape 5 — Automatisations Notion (optionnel mais recommandé)

### Auto-update `next_touch` quand status change

- **Trigger** : `status` updated
- **Action** :
  - Si nouveau `status` = `sent_t1` → set `next_touch` = today + 3 days
  - Si nouveau `status` = `opened` ou `replied_pos` → set `next_touch` = today + 1 day
  - Si nouveau `status` = `meeting_booked` → notif Discord/Slack
  - Si nouveau `status` = `paid` → notif Discord/Slack + auto-add to "Paid 💰" gallery

### Auto-increment `touch_count`

- **Trigger** : `last_touch` updated
- **Action** : `touch_count` = `touch_count` + 1

---

## Lien vers les autres docs cold email

- Playbook routine quotidienne : [`playbook-nagato.md`](./playbook-nagato.md)
- Plan sourcing 2000 leads : [`sourcing-2000-leads.md`](./sourcing-2000-leads.md)
- Séquences 3-touch (FR + EN MENA) : [`sequences-zara.md`](./sequences-zara.md)
- Template CSV leads vérifiés : [`leads-verified-template.csv`](./leads-verified-template.csv)
- Doc legacy (réf) : [`01-icp-leads.md`](./01-icp-leads.md), [`02-variantes-email.md`](./02-variantes-email.md), [`03-followups.md`](./03-followups.md), [`04-playbook-envoi.md`](./04-playbook-envoi.md)

---

## Notes de safety inbox `hello@konvertpilot.com`

Décision chef 2026-05-30 : envoi cold via inbox unique `hello@konvertpilot.com` (déjà active pour support).

**Garde-fous obligatoires** (sinon brûle aussi les emails transac Stripe + Welcome) :

1. **Plafond strict** : 30 emails/jour pendant S1, montée 40 puis 50 si pas de complaints (taux complaint <0.1%, bounce <2%)
2. **Filtres Gmail** : labels `transac` / `support` / `outbound-cold` (priorité 1 / 1 / 2) avec règles auto pour éviter le mélange
3. **Warmup naturel J-2 → J0** : envoyer 5-10 emails "vrais" par jour à des contacts proches pour réchauffer la rep
4. **Pas de tracking pixel** (deliverability)
5. **Pas de liens raccourcis** type bit.ly (red flag spam)
6. **Plain text** dans le body, pas d'HTML lourd
7. **1 lien max** dans le body + 1 lien dans la signature

---

**Owner du CRM** : NAGATO (maintenance quotidienne) + Syphax (closing + decisions finales)
**Source of truth** : Cette base Notion (PAS Gmail, PAS le CSV statique)
