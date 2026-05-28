# Playbook envoi — Préserver konvertpilot.com

## Le risque qu'on prend
On envoie depuis le domaine de prod `konvertpilot.com`. Si on crame la réputation, on flingue les emails transactionnels Stripe + signup. Les règles ci-dessous existent pour rendre ce risque acceptable.

## Règles non-négociables

### 1. Volume max
- **Jour 1-3** : 10 emails/jour
- **Jour 4-7** : 15/jour
- **Semaine 2+** : 20/jour MAX si délivrabilité OK
- **Jamais > 25/jour** depuis konvertpilot.com tant que pas warmé proprement

### 2. Plage horaire
- Envoie entre **9h-12h** ou **14h-17h** heure FR (jour ouvré uniquement)
- **Espacement** : 2-5 min entre chaque mail (pas de blast en 1 seconde)
- **Jamais** : weekend, soir, ou en rafale

### 3. Personnalisation obligatoire
- **Chaque email a une ligne 1 unique** (l'observation)
- **Pas de copier-coller** des autres champs (subject inclus — varie 3-5 versions)
- Si tu peux pas personnaliser → skip le lead, le grille pas

### 4. Pas de tracking pixel
- Streak/Mixmax tracking ouverture = **OFF**
- Le pixel est un signal fort spam pour Gmail
- Mesure tes ouvertures via reply rate, pas via pixel

### 5. 1 seul lien par email
- `konvertpilot.com` uniquement (jamais de UTM dans cold — flag spam)
- Pas de Calendly, pas de PDF, pas de YouTube
- Si tu dois ajouter un lien → mets-le en signature pas dans le body

### 6. Pas de mots-spam dans body/subject
Liste à bannir : `gratuit`, `100%`, `garantie`, `urgent`, `offre`, `promotion`, `cliquez ici`, `ne ratez pas`, `dernière chance`, `$$$`, emojis sauf 1 max.

---

## Setup technique pré-envoi (à valider J-1)

### Vérifier SPF/DKIM/DMARC
Ces 3 records DNS doivent être OK sinon les mails partent en spam direct.

```bash
# SPF
dig +short TXT konvertpilot.com | grep spf

# DKIM (selector Resend par défaut)
dig +short TXT resend._domainkey.konvertpilot.com

# DMARC
dig +short TXT _dmarc.konvertpilot.com
```

**Status attendu :**
- SPF : doit inclure `include:_spf.resend.com` (déjà configuré pour Resend)
- DKIM : doit retourner une clé publique
- DMARC : `v=DMARC1; p=none` minimum (`p=quarantine` ou `p=reject` mieux)

Si l'un des 3 manque → fix avant d'envoyer. Sinon tout va en spam.

### Choisir l'inbox d'envoi
**Options :**

**Option 1 — Gmail Workspace lié à `syphax@konvertpilot.com`** (recommandé)
- Crée l'alias depuis Resend ou Google Workspace
- Envois manuels depuis Gmail
- Tracking via Streak (extension Gmail)
- Avantage : inbox vraie, interactions humaines, ouvertures naturelles

**Option 2 — Envoyer depuis Resend SMTP**
- Pratique pour automatiser mais Resend = ESP transactionnel, pas optimal pour cold
- Risque de cramer la réputation Resend de prod

→ **Va sur option 1.** Confirme avec moi l'adresse exacte avant J0.

### Monitoring quotidien
Avant chaque session d'envoi :
1. Check `mail-tester.com` — envoie un mail à l'adresse fournie, vise score 9-10/10
2. Check spam folder de Gmail perso pour voir si Konvert y atterrit
3. Check Resend dashboard : taux de bounce (doit rester < 2%)

Si **bounce > 3%** ou **score mail-tester < 8** → **STOP** envois, on diagnostique.

---

## Workflow journalier (1h30/jour)

### Bloc 1 — Sourcing (45 min)
- Ouvre Meta Ad Library
- Filtre France + mots-clés produit dropshipping
- Note 15 leads dans le Sheet : email, prénom, boutique, produit phare
- Pour chaque lead : note 1 observation unique en colonne `note_perso`

### Bloc 2 — Rédaction (30 min)
- Ouvre Gmail
- 15 emails avec template + perso ligne 1
- 2-5 min entre chaque envoi

### Bloc 3 — Replies (15 min, l'après-midi)
- Réponds aux replies dans l'heure
- Mets à jour `status` dans le Sheet
- Suit les follow-up plannés (J+3, J+7, J+12)

---

## Métriques à suivre (Sheet)

Tableau de bord daily :
- **Sent today** : nombre envoyé
- **Sent total** : cumul depuis J0
- **Reply rate** : replies / sent (target : > 4%)
- **Positive reply rate** : interested / sent (target : > 1%)
- **Conversions** : trials lancés depuis cold (target : 1-2/semaine)
- **Spam reports** : doit rester 0

## Escalation rules

| Signal | Action |
|---|---|
| Reply rate < 2% après 50 envois | Pivote variante (B au lieu de A) ou ICP |
| Bounce > 3% | Stop envoi, recheck quality liste emails |
| Score mail-tester < 7 | Stop envoi, fix DNS/contenu |
| 1 spam report | Pause 48h, audit dernier batch envoyé |
| 2 spam reports | Stop tout, switch sur sous-domaine `mail.konvertpilot.com` ou domaine séparé |

---

## TL;DR — Ta routine

1. **Tous les matins 9h** : 15 leads sourcés dans Sheet
2. **9h30** : 15 emails envoyés (Variante A 60%, B 30%, C 10%) — espacés 3 min
3. **Tous les jours 16h** : replies + follow-up plannés (J+3, J+7, J+12 selon Sheet)
4. **Tous les vendredis** : review métriques, ajuste variante gagnante
