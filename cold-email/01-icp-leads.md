# ICP + Stratégie leads — Cold email Konvert

## ICP cible (priorité 1)

**Dropshippers Shopify FR/EU, solo ou petite équipe (1-5), produits AliExpress visibles**

Signaux à chercher :
- Boutique Shopify (footer "Powered by Shopify" ou tech stack BuiltWith)
- Catalogue produit qui matche AliExpress (photos identiques, descriptions courtes/mauvaises)
- Lance des ads Meta (visibilité sur Meta Ad Library = budget actif)
- Site en français
- Domaine < 2 ans (chercher via whois)

Pourquoi cet ICP :
- Pain direct : pages produit faibles = budget pub gaspillé
- Acheteur = fondateur (cycle court, pas de comité d'achat)
- Plan Konvert à 29€/mois = no-brainer si convert +0.5%
- Volume large (~10k+ shops FR actifs)

## ICP secondaire (priorité 2)

**Agences SMMA e-com qui gèrent 5-30 clients dropshipping**

- Vendent du service mensuel à 1-3k€
- Bottleneck = qualité landing
- Cible : 1 deal agence = 5-30 utilisateurs Konvert

## Sources de leads (gratuites)

### 1. Meta Ad Library — gratuit, le meilleur signal
URL : https://www.facebook.com/ads/library
- Filtre : France, "All ads", "Issues, electoral or political" = NO
- Recherche par mots-clés produit AliExpress typiques : "anti-stress", "led", "lampe", "minceur", "posture", "voiture", "skincare", "bijou"
- Cherche les ads avec landing Shopify → c'est nos prospects
- Pour chaque ad : note le nom de page Facebook → trouve le site → trouve le email
- Volume : 50-100 leads/h en mode focus

### 2. SimilarWeb / Built With
- BuiltWith.com → "Shopify sites in France"
- Filtres : traffic 1k-50k/mois (assez gros pour avoir un budget, assez petit pour que le founder réponde)

### 3. MyIP.ms
- Liste tous les sites hébergés sur IPs Shopify
- Filtre par TLD .fr puis .com avec FR dans le footer

### 4. Google Maps (longue traîne)
- "marque de bijoux", "boutique cosmétique en ligne", etc.
- Croiser avec Instagram pour voir si ils font du dropshipping

### 5. Communautés à scrapper
- Groupes FB "Dropshipping France", "Shopify France"
- Discord ecommerce francophones
- Reddit r/dropship_FR
- Threads sur Indie Hackers

## Trouver l'email (workflow)

1. **Site web** : footer, page "Contact", page "Mentions légales" (souvent l'email founder)
2. **Hunter.io** (10 free/mois) : domain.com → liste les emails publics
3. **Apollo.io** (60 free/mois) : nom + entreprise → email vérifié
4. **LinkedIn Sales Nav** (1 mois trial) : recherche fondateur → trouver l'email
5. **Pattern guess** : `prenom@domain.com`, `prenom.nom@domain.com` (vérifier avec Hunter Email Verifier)

## Format ligne de données (CSV)

```
email,prenom,boutique,url_boutique,ad_signal,produit_phare,note_perso
```

`note_perso` = la ligne 1 du cold email (observation unique). C'est LE champ critique.

Exemple :
```
marie@bijoux-soleil.fr,Marie,Bijoux Soleil,bijoux-soleil.fr,Meta ads actives,collier infini argent,J'ai cliqué sur ton ad collier Infini hier — la page produit est OK mais tu n'as pas de social proof above the fold
```

## Volume cible

- **Jour 1-3** : 10 leads/jour = 30 emails sortants (warming up doucement)
- **Jour 4-7** : 15/jour = 105 sur 7 jours
- **Total semaine 1** : ~135 emails ultra-personnalisés

Avec 5% reply = 7 conversations. Avec 2% conversion = 1-2 paying users.

## Outils recommandés (gratuits/cheap)

- **Tracking ouvertures/réponses** : Streak (free, Gmail) OU Mixmax (free 100 emails/mois)
- **Verification email** : Hunter Email Verifier (50 free)
- **CRM léger** : Notion ou Google Sheets — 1 ligne par lead, colonnes statut/dernière action/réponse
