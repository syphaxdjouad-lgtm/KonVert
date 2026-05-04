# KONVERT — Stratégie Ads Payantes Complète
**Objectif :** 2 000 abonnés payants (Starter 39€ / Pro 79€ / Agency 199€)**
**Produit :** konvert.app — génération landing pages e-commerce par IA
**Hook principal :** 1 page gratuite, sans compte, résultat en 30 secondes
**Date de construction :** Avril 2026

---

## LOGIQUE GENERALE

Le produit a un avantage massif : il s'essaie AVANT de payer. Toute la stratégie ads doit pointer vers
le tunnel `/essai` — pas vers la homepage, pas vers `/pricing`. Le visiteur génère sa page, il voit
le résultat, et là seulement on lui propose de payer. C'est un hook product-led. Les ads servent à
amener du trafic qualifié dans ce tunnel.

**Funnel global :**
```
Ad (cold) → /essai → génération page → /preview/[id] → email séquence 7j → Paid
```

**MRR cible par palier :**
- 500 Starter = 19 500€/mois
- 1 000 Starter + 500 Pro = 78 500€/mois
- 1 200 Starter + 600 Pro + 200 Agency = 134 400€/mois

---

## 1. META ADS (Facebook + Instagram)

### 1.1 Structure de campagne

```
CAMPAGNE 1 — COLD (CBO)
Budget : 50€/jour → 1 500€/mois
Objectif : Leads (génération via /essai)
Stratégie enchère : Coût le plus bas

  ├── Adset A1 — Dropshippers FR (intérêts)
  ├── Adset A2 — Shopify owners FR (intérêts)
  ├── Adset A3 — E-commerçants BE/CH/CA (expansion géo)
  ├── Adset A4 — Lookalike 1% (visiteurs /essai)
  └── Adset A5 — Lookalike 2-3% (visiteurs 30j)

CAMPAGNE 2 — RETARGETING CHAUD (ABO)
Budget : 20€/jour → 600€/mois
Objectif : Conversion (Stripe)
Stratégie enchère : ROAS cible 4x

  ├── Adset R1 — Visiteurs /essai (non convertis, 7j)
  ├── Adset R2 — Visiteurs preview (non abonnés, 7j)
  └── Adset R3 — Email list (custom audience)

CAMPAGNE 3 — RETARGETING TIEDE (ABO)
Budget : 10€/jour → 300€/mois
Objectif : Trafic / Engagement
Stratégie enchère : CPC le plus bas

  └── Adset W1 — Visiteurs site 30j (sauf convertis)
```

**Pourquoi CBO sur la cold :** le produit est nouveau, pas assez de données pour forcer sur un adset.
CBO laisse l'algorithme trouver les meilleurs performers naturellement sur 7-10 jours.

**Pourquoi ABO sur le retargeting :** les audiences sont petites, le CBO les asséchera trop vite.
L'ABO contrôle la dépense adset par adset.

---

### 1.2 Les 5 Audiences Détaillées

**A1 — Dropshippers Francophones (Cold)**
- Age : 18-34 ans
- Pays : France, Belgique, Suisse, Canada (FR)
- Intérêts : AliExpress, Oberlo, DSers, Zendrop, Dropshipping
- Comportements : Administrateurs de page Facebook (boutique)
- Exclusions : Clients Stripe actuels
- Taille estimée : 800K — 2M

**A2 — Propriétaires Shopify (Cold)**
- Age : 20-38 ans
- Pays : France, Belgique, Suisse
- Intérêts : Shopify, WooCommerce, Prestashop, e-commerce
- Comportements : Petits propriétaires d'entreprise + Engagement page Facebook
- Exclusions : Clients actuels
- Taille estimée : 600K — 1.5M

**A3 — Géographie élargie (Cold)**
- Age : 18-35 ans
- Pays : France (priorité), Belgique, Maroc, Tunisie, Algérie (marché FR significatif)
- Intérêts : Marketing digital, Facebook Ads, Google Ads, Publicité en ligne
- Comportements : Acheteurs en ligne fréquents + Propriétaires PME
- Note : Le Maghreb est un marché dropshipping FR massif et sous-ciblé

**A4 — Lookalike 1% Visiteurs /essai (Warm)**
- Source : custom audience des visiteurs `/essai` (pixel événement PageView)
- Lookalike 1% France
- Mise à jour automatique 30 jours glissants
- Activer dès 500 visiteurs minimum sur la source

**A5 — Lookalike 1% Acheteurs (Scale)**
- Source : custom audience Stripe (emails clients) uploadée manuellement
- Lookalike 1% France + Belgique + Suisse
- Activer dès 100 clients minimum
- C'est l'audience la plus précieuse — à lancer en phase 2

---

### 1.3 Les 10 Hooks / Accroches Ads

**Hook 1 — La perte d'argent**
> "Tu paies des pubs pour envoyer du trafic sur une page qui ne convertit pas. C'est de l'argent brûlé. KONVERT génère ta page produit en 30 secondes."

**Hook 2 — Le chiffre brutal**
> "95% des visiteurs quittent une page produit sans acheter. Souvent à cause du design. Pas du produit."

**Hook 3 — La comparaison temps**
> "Un freelance : 3 jours, 300€, et tu l'attends. KONVERT : 30 secondes. Gratuit pour tester."

**Hook 4 — La question directe**
> "Ta page produit fait 1% de conversion ou plus ? Si tu ne sais pas, c'est probablement moins."

**Hook 5 — Le résultat immédiat**
> "Colle ton lien produit. On génère ta landing page complète. Aucune compétence nécessaire."

**Hook 6 — Le social proof implicite**
> "Les e-commerçants qui passent à KONVERT réduisent leur CPA en moyenne de 30%. Voilà pourquoi."

**Hook 7 — La douleur Shopify**
> "Shopify te donne les outils. Pas le copywriting. Pas la structure de conversion. Ça, c'est notre boulot."

**Hook 8 — Le test sans risque**
> "Génère ta première page produit gratuitement. Pas de CB, pas de compte. Vois le résultat d'abord."

**Hook 9 — L'objection freelance**
> "J'utilisais Fiverr pour mes pages produit. 5-7 jours d'attente. KONVERT fait la même chose en 30 secondes pour 39€/mois."

**Hook 10 — L'urgence budget pub**
> "Chaque visiteur sur une mauvaise page = argent perdu. Si tu fais de la pub, tes pages doivent convertir. Point."

---

### 1.4 Les 5 Concepts Créatifs

**Concept 1 — DEMO ECRAN (format Reels/Stories 9:16)**
Format : Screen recording 15-30 secondes
Contenu :
- 0-3s : "Ta page produit convertit à 1% ? Regarde ça."
- 3-10s : Coller un lien AliExpress dans KONVERT
- 10-20s : La page générée apparaît (animation fluide)
- 20-30s : Scroll rapide sur la page — sections, copy, images, CTA
- Fin : "Gratuit. 30 secondes. konvert.app"
Placement prioritaire : Reels Instagram, TikTok, YouTube Shorts

**Concept 2 — BEFORE / AFTER (format carré ou 4:5)**
Format : Image statique ou vidéo split-screen 10 secondes
Gauche : Screenshot d'une page produit Shopify par défaut (basique, sans copy)
Droite : Même produit, page générée par KONVERT (titre accrocheur, sections structurées, CTA)
Texte overlay : "Avant KONVERT / Après KONVERT"
Texte principal : "Même produit. Page différente. Résultats différents."
Placement : Feed Instagram, Facebook Feed

**Concept 3 — UGC / TESTIMONIAL (format Reels 9:16)**
Format : Vidéo face caméra 30-45 secondes (sous-titres obligatoires)
Script :
> "Je faisais de la pub depuis 6 mois. Les produits étaient bons. Mais mes pages étaient nulles.
> J'ai essayé KONVERT sur un de mes produits. La page était prête en 30 secondes.
> J'ai relancé la pub. Mon CPA a baissé de 40%.
> Le mois d'après, j'ai tout migré sur KONVERT."
Profil idéal : Homme ou femme 20-28 ans, face cam naturelle, pas de sur-production

**Concept 4 — COMPARAISON CONCURRENTS (format carré)**
Format : Image tableau comparatif
Colonnes : Faire soi-même / Freelance Fiverr / KONVERT
Lignes : Prix / Délai / Optimisation SEO / Mobile / Mises à jour
KONVERT gagne sur chaque ligne
Texte : "Pourquoi payer plus pour attendre plus ?"

**Concept 5 — PROBLEME/SOLUTION (format vidéo 15s)**
Format : Vidéo texte animé sur fond noir
- 0-5s : Texte rouge animé "Ta pub tourne. Tes pages ne convertissent pas."
- 5-10s : Texte blanc "KONVERT génère ta landing page en 30 secondes."
- 10-15s : CTA "Essaie gratuitement — konvert.app"
Son : musique urgente/motivante (compatible TikTok)
Placement : Stories, Reels, TikTok

---

### 1.5 Budget Meta Ads

| Phase | Budget/jour | Budget/mois | Adsets actifs |
|---|---|---|---|
| Phase 1 (test) | 30€ | 900€ | 3 adsets cold + 2 retargeting |
| Phase 2 (scale) | 100€ | 3 000€ | 5 adsets cold + 3 retargeting |
| Phase 3 (accélération) | 250€ | 7 500€ | Full structure + lookalike actifs |

---

### 1.6 Funnel Ads Cold → Warm → Hot

**COLD (Adsets A1, A2, A3, A4)**
- Objectif campagne : Lead (événement CompleteRegistration sur /essai)
- Format prioritaire : Reels 9:16 + Carré 1:1
- Message : "Génère ta première page gratuitement"
- CTA : "Essayer gratuitement"
- URL : konvert.app/essai
- KPI cibles : CPM < 8€, CTR > 2.5%, CPC < 0.60€, CPL < 5€

**WARM (Adset A5 + retargeting 30j)**
- Objectif campagne : Trafic / Engagement
- Format : Carré + Stories image
- Message : "Tu as vu KONVERT. Voilà ce que tu rates."
- CTA : "Voir les offres"
- URL : konvert.app/pricing
- KPI cibles : CTR > 3%, CPC < 0.40€

**HOT (Retargeting visiteurs /essai et /preview)**
- Objectif campagne : Conversion (Purchase Stripe)
- Format : Stories image + Feed carré
- Message : "Ta page t'attend. Passe à l'abonnement maintenant."
- CTA : "S'abonner"
- URL : konvert.app/pricing (avec UTM retargeting)
- KPI cibles : CPA < 40€, ROAS > 3.5x

---

## 2. TIKTOK ADS

### 2.1 Format et Style des Créas

TikTok est le canal le plus important pour toucher les 17-28 ans dropshippers. L'audience est massive,
le CPM est encore bas (3-8€ en France), et le format "démo produit" performe parfaitement.

**Formats à utiliser :**
- In-Feed Ads (priorité absolue) — apparaît dans le For You Page
- Spark Ads — booster les TikToks organiques qui fonctionnent
- TikTok Shop Ads (si pertinent pour l'affiliation)

**Style créatif :**
- Natif TikTok : face cam, sous-titres, musique tendance
- Pas de logo permanent — intégrer le branding dans le contenu
- Accrocher dans les 2 premières secondes (thumb stop)
- Durée idéale : 9-15 secondes (ou 30s max pour expliquer)
- Sous-titres automatiques obligatoires (60% regardent sans son)

---

### 2.2 Les 5 Scripts Vidéo TikTok

**Script T1 — "Le truc que j'aurais voulu savoir" (15 sec)**
```
[0-2s] Face cam, regard direct : "Le truc que j'aurais voulu savoir avant de balancer 1000€ en pub."
[2-8s] Screen recording rapide : coller un lien produit dans KONVERT
[8-13s] La page apparaît, scroll rapide
[13-15s] "Gratuit sur konvert.app — premier résultat sans CB"
```
Musique : son trending discret
Caption : "j'aurais économisé tellement d'argent #dropshipping #ecommerce #shopify"

**Script T2 — "POV" (9 sec)**
```
[0-1s] Texte overlay : "POV : tu colles ton lien produit dans KONVERT"
[1-6s] Screen recording : lien → génération → page complète
[6-9s] Texte overlay : "30 secondes. C'est tout."
```
Musique : son viral "mind blown"
Caption : "le temps de faire une page produit complète #konvert #landingpage"

**Script T3 — "Avant / Après" (15 sec)**
```
[0-3s] Face cam : "Ma page Shopify par défaut vs après KONVERT. Regardez."
[3-9s] Screenshot page basique Shopify (mauvaise)
[9-14s] Screenshot page KONVERT (propre, structurée)
[14-15s] "konvert.app — essai gratuit"
```
Caption : "la différence est ENORME #conversionrate #shopify #dropshipping"

**Script T4 — "Le CPA qui baisse" (15 sec)**
```
[0-2s] Texte rouge animé : "Mon CPA était à 45€."
[2-5s] "J'ai changé mes pages produit."
[5-10s] Screen recording KONVERT en action
[10-14s] "Mon CPA est passé à 28€."
[14-15s] "konvert.app — premier essai gratuit"
```
Son : audio motivant tendance
Caption : "comment j'ai baissé mon CPA de 37% #facebookads #dropshipping"

**Script T5 — "Freelance vs KONVERT" (15 sec)**
```
[0-3s] Face cam : "J'ai arrêté de payer des freelances pour mes pages produit."
[3-7s] "Fiverr : 150€, 5 jours d'attente, résultat moyen."
[7-12s] Screen recording KONVERT : lien → page en 30 secondes
[12-15s] "39€/mois. Illimité. konvert.app"
```
Caption : "fini Fiverr pour mes landing pages #freelance #shopify #ecommerce"

---

### 2.3 Audiences TikTok et Bidding

**Audience TK1 — Broad (18-34 ans)**
- Pays : France, Belgique, Suisse
- Age : 18-34
- Intérêts : E-commerce, Dropshipping, Entrepreneurship, Marketing
- Comportements : Achats en ligne fréquents
- Budget : 20€/jour
- Objectif : Conversions (Complete Registration)

**Audience TK2 — Intérêts Shopify**
- Intérêts : Shopify, WooCommerce, Online Business, Side Hustle
- Age : 20-35
- Pays : France
- Budget : 15€/jour

**Audience TK3 — Retargeting (7 jours)**
- Visiteurs page web (pixel TikTok)
- Engagement vidéo 75%+ sur les créas
- Budget : 10€/jour
- Objectif : Conversion (achat)

**Bidding recommandé :**
- Phase test : Lowest Cost (laisser l'algo apprendre)
- Phase scale : Cost Cap à 6€ par lead
- Enchère minimum efficace : 15€/jour par adgroup

---

### 2.4 Budget TikTok Ads

| Phase | Budget/jour | Budget/mois |
|---|---|---|
| Phase 1 (test) | 20€ | 600€ |
| Phase 2 (scale) | 60€ | 1 800€ |
| Phase 3 | 150€ | 4 500€ |

**Note :** TikTok exige un minimum de 20€/jour par campagne pour sortir de la phase d'apprentissage.
En dessous, les données sont inexploitables.

---

## 3. GOOGLE ADS

### 3.1 Mots-clés à Cibler (Search)

Google Search est le canal à activer en phase 2 seulement. Le volume de recherche est plus faible
que Meta/TikTok pour "landing page IA", mais l'intent est ultra qualifié — les gens qui cherchent
activement une solution.

**Mots-clés exacts prioritaires (exact match)**
```
[landing page produit shopify]
[créer page produit shopify]
[landing page ecommerce gratuit]
[générateur landing page ia]
[page produit dropshipping]
[landing page convertissante]
[outil landing page shopify]
[créer fiche produit optimisée]
```

**Mots-clés phrase match (broad)**
```
"landing page shopify" → 2 000-5 000 recherches/mois (FR)
"créer landing page" → 1 000-3 000/mois
"page produit optimisée" → 500-1 000/mois
"améliorer conversion shopify" → 300-800/mois
"landing page ecommerce" → 1 000-2 500/mois
"générateur page produit IA" → 200-500/mois (nouveau)
```

**Mots-clés négatifs (exclure absolument)**
```
-gratuit (si pas en phase free)
-wordpress (pas notre cible principale)
-template (trop générique)
-github
-tutorial
-tuto
-comment
-définition
```

**Mots-clés concurrents (à cibler avec parcimonie)**
```
[unbounce alternative]
[leadpages alternative]
[instapage pas cher]
```

---

### 3.2 Structure de Campagne Google

```
CAMPAGNE SEARCH 1 — Intent Direct
Budget : 20€/jour → 600€/mois
Ciblage géo : France, Belgique, Suisse
Stratégie : Maximize Conversions (puis Target CPA dès 30 conversions)

  ├── Groupe A — "Landing page Shopify"
  │   Mots-clés : landing page shopify, créer page shopify, page produit shopify
  │   URL destination : konvert.app/essai
  │
  ├── Groupe B — "Générateur IA"
  │   Mots-clés : générateur landing page ia, créer page produit ia, outil ia ecommerce
  │   URL destination : konvert.app/features
  │
  └── Groupe C — "Conversion ecommerce"
      Mots-clés : améliorer conversion shopify, page produit qui convertit
      URL destination : konvert.app/essai

CAMPAGNE SEARCH 2 — Concurrents
Budget : 10€/jour → 300€/mois
Mots-clés : unbounce alternative, leadpages alternative, instapage pas cher
URL : konvert.app (page comparaison à créer)
```

**Annonces Search (RSA) — Structure**

Titres (15 possibles, Google choisit les meilleurs) :
```
Ta Landing Page en 30 Secondes
Génère ta Page Produit par IA
Shopify + KONVERT = +Conversions
Gratuit pour Tester — Aucun Compte
Moins cher qu'un Freelance
Page Produit Optimisée Instantanément
Arrête de Perdre de l'Argent en Pub
KONVERT — IA pour E-commerçants
```

Descriptions (4 possibles) :
```
D1 : "Colle ton lien produit. KONVERT génère ta landing page complète en 30 secondes. SEO, mobile, conversion — prêt à copier-coller."
D2 : "Plus de pages qui ne convertissent pas. Moins cher qu'un freelance, disponible 24/7. Essai gratuit sans CB."
D3 : "Starter 39€/mois. Génération illimitée. Compatible Shopify, WooCommerce, dropshipping. Vois le résultat avant de payer."
D4 : "1 e-commerçant sur 3 perd son budget pub à cause d'une mauvaise page. KONVERT corrige ça en 30 secondes."
```

---

### 3.3 Budget Google Ads

| Phase | Budget/jour | Budget/mois | Objectif |
|---|---|---|---|
| Phase 1 | Pas Google (pas assez de données) | — | — |
| Phase 2 | 30€ | 900€ | Test Search intent direct |
| Phase 3 | 60€ | 1 800€ | Scale Search + Remarketing Display |

**Note :** Ne pas lancer Google avant d'avoir le pixel Meta en données (min. 500 leads). Google Search
est un canal de capture d'intent — il amplifie la demande existante, il ne la crée pas.

---

## 4. YOUTUBE ADS

### 4.1 Format Recommandé

- **In-Stream Skippable** (priorité) : 30-60 secondes, skip après 5s
- **Bumper Ads** (phase 2) : 6 secondes, non skippable, pour le retargeting

**Ciblage YouTube :**
- Chaînes : dropshipping FR, Shopify FR, e-commerce FR, marketing digital FR
- Mots-clés : "comment faire de la pub Shopify", "dropshipping 2026", "créer boutique en ligne"
- Audiences d'affinité : Acheteurs fréquents en ligne, Propriétaires PME
- Remarketing : Visiteurs konvert.app (30 jours)

---

### 4.2 Script YouTube — In-Stream 30 secondes

**"La vraie raison pourquoi ta pub ne marche pas"**

```
[0-5s — HOOK avant skip]
Visuel : E-commerçant face cam, regard direct
Texte overlay : "Ne skip pas — ça va te coûter de l'argent."
Voix : "Tu envoies du trafic sur tes pages produit et ça ne convertit pas ?"

[5-12s — PROBLEME]
Visuel : Dashboard Facebook Ads avec CPA élevé
Voix : "Le problème c'est rarement le produit. C'est la page.
95% des visiteurs partent sans acheter sur une page Shopify standard."

[12-22s — SOLUTION + DEMO]
Visuel : Screen recording KONVERT — lien collé → génération → résultat
Voix : "KONVERT génère ta landing page optimisée en 30 secondes.
SEO, mobile, copy de conversion — prêt à coller sur ta boutique."

[22-27s — SOCIAL PROOF + PRIX]
Visuel : Avant/après pages
Voix : "À partir de 39€/mois. Moins cher qu'un seul post Fiverr."

[27-30s — CTA]
Visuel : Logo KONVERT + URL
Voix : "Génère ta première page gratuitement sur konvert.app"
Bouton CTA : "Essayer gratuitement"
URL : konvert.app/essai
```

**Bumper 6 secondes (retargeting)**
```
[0-2s] Texte animé : "Ta page produit perd de l'argent."
[2-5s] Screen recording ultra rapide KONVERT
[5-6s] "konvert.app — 30 secondes"
```

---

### 4.3 Budget YouTube Ads

| Phase | Budget/mois | Format |
|---|---|---|
| Phase 1 | 0€ | Pas encore |
| Phase 2 | 500€ | In-Stream Skippable |
| Phase 3 | 1 500€ | In-Stream + Bumpers retargeting |

---

## 5. BUDGET TOTAL PAR PHASE

### Phase 1 — Test (Mois 1-2)
Budget total : **600€ à 900€/mois**

| Canal | Budget/mois | Objectif |
|---|---|---|
| Meta Ads (cold) | 900€ | Tester les hooks, trouver le créatif gagnant |
| TikTok Ads | 600€ | Tester 5 créas, identifier meilleure audience |
| Google Ads | 0€ | Pas encore |
| YouTube Ads | 0€ | Pas encore |
| **Total** | **1 500€** | **Trouver le hook gagnant** |

**KPIs Phase 1 :**
- CPL cible : < 6€ (coût par lead = génération /essai)
- CTR minimum : 1.5% (si < 1.5%, changer le créatif)
- CPC maximum : 0.80€
- Abonnés payants attendus : 20-50

**Décisions à J+15 :**
- Couper tout adset avec CPL > 10€
- Doubler le budget sur le meilleur adset
- Dupliquer le créatif gagnant en 3 variantes

---

### Phase 2 — Scale (Mois 3-5)
Budget total : **2 000€ à 4 000€/mois**

| Canal | Budget/mois | Objectif |
|---|---|---|
| Meta Ads | 2 500€ | Scale créatif gagnant + lookalike |
| TikTok Ads | 1 000€ | Scale + Spark Ads |
| Google Search | 900€ | Capture intent qualifié |
| YouTube Ads | 500€ | Brand + retargeting |
| **Total** | **4 900€** | **100-200 nouveaux abonnés/mois** |

**KPIs Phase 2 :**
- CPL cible : < 4€
- CPA (abonné payant) cible : < 35€
- ROAS : > 3.5x (sur Starter 39€, LTV 6 mois = 234€)
- Abonnés payants attendus : 100-200/mois

---

### Phase 3 — Accélération (Mois 6+)
Budget total : **5 000€ à 10 000€/mois**

| Canal | Budget/mois | Objectif |
|---|---|---|
| Meta Ads | 5 000€ | Full structure, lookalike acheteurs |
| TikTok Ads | 2 500€ | Scale + influenceurs micro |
| Google Search | 1 500€ | Dominer intent + concurrents |
| YouTube Ads | 1 500€ | Brand awareness + retargeting |
| Affiliés (20-30% récurrent) | Variable | Canal passif |
| **Total** | **10 500€** | **300-500 nouveaux abonnés/mois** |

**KPIs Phase 3 :**
- CPA cible : < 25€
- ROAS : > 5x (sur mix Starter/Pro)
- LTV moyenne cible : 300€ (mix plans)
- Abonnés payants attendus : 300-500/mois

---

## 6. METRIQUES CIBLES — SYNTHESE

### Meta Ads — Benchmarks Attendus

| Metrique | Phase 1 (test) | Phase 2 (scale) | Phase 3 (excel) |
|---|---|---|---|
| CPM | 8-12€ | 6-10€ | 5-8€ |
| CTR | 1.5-2.5% | 2.5-3.5% | > 3.5% |
| CPC | 0.50-0.90€ | 0.30-0.60€ | < 0.35€ |
| CPL (/essai) | 4-8€ | 3-5€ | < 3€ |
| Taux conv. lead→payant | 8-12% | 12-18% | > 20% |
| CPA (abonné) | 40-80€ | 25-40€ | < 25€ |
| ROAS | 1.5-2.5x | 3-4x | > 5x |

*ROAS calculé sur LTV 6 mois : Starter = 234€, Pro = 474€, Agency = 1 194€*

### TikTok Ads — Benchmarks Attendus

| Metrique | Cible |
|---|---|
| CPM | 3-7€ |
| CTR | 1.5-3% |
| CPC | 0.20-0.50€ |
| CPL | 3-6€ |
| VTR (view-through rate) | > 20% |

### Google Search — Benchmarks Attendus

| Metrique | Cible |
|---|---|
| CTR | 5-10% (intent direct) |
| CPC | 0.80-2€ (compétitif FR) |
| Quality Score | > 7/10 |
| Taux conversion | 15-25% (intent qualifié) |
| CPA | 20-40€ |

---

## 7. REGLES D'OPTIMISATION — LES DECISIONS DATA-DRIVEN

### Règle des 7 jours (Meta)
- Si CTR < 1% après 7 jours → couper le créatif, remplacer
- Si CPL > 10€ après 7 jours → couper l'adset
- Si CPL < 4€ → doubler le budget (max x2 par semaine)
- Ne jamais toucher un adset dans les 48h suivant un changement de budget

### Règle des 3 créatifs
- Toujours 3 créatifs minimum par adset (Meta choisit)
- Après 2 semaines : couper le dernier performant, le remplacer par une variante du gagnant
- Structure gagnante : 1 créatif domine à 70% → c'est normal

### Règle du ROAS minimum
- Si ROAS < 2x sur 7 jours → pause campagne, diagnostic créatif/audience
- Si ROAS > 4x → scale progressif +20%/semaine
- ROAS calculé sur 28 jours glissants, pas journalier (les journées sont trop volatiles)

### Règle des audiences fatiguées
- Fréquence > 3.5 sur 7 jours → rafraîchir le créatif immédiatement
- Fréquence > 5 → pause adset ou élargir l'audience

### Paramétrage UTMs obligatoire
```
konvert.app/essai?utm_source=meta&utm_medium=paid&utm_campaign=cold-v1&utm_content=hook1-before-after
```
Chaque ad doit avoir son UTM unique pour tracer les performances dans Supabase/analytics.

---

## 8. PIXEL ET TRACKING — PREREQUIS AVANT LANCER

Avant de dépenser 1€ en ads, ces éléments doivent être en place :

**Meta Pixel (Events à tracker)**
- `PageView` → toutes les pages
- `ViewContent` → /essai (page tunnel)
- `Lead` → après génération page (/preview/[id])
- `InitiateCheckout` → clic sur "S'abonner" ou /pricing
- `Purchase` → confirmation paiement Stripe

**TikTok Pixel**
- Mêmes events que Meta
- Intégrer via balise script dans Next.js (layout.tsx)

**Google Tag Manager**
- GA4 configuré
- Conversion Stripe trackée

**Note critique :** Le tunnel `/essai` → `/preview/[id]` est le coeur de la conversion. L'event
`Lead` doit se déclencher au moment où la preview est générée (et non au submit du formulaire).
C'est ce moment qui prouve la valeur — l'utilisateur voit sa page. C'est là qu'on l'attribue.

---

## 9. CONTENU ORGANIQUE EN SUPPORT DES ADS

Les ads payantes marchent mieux avec du contenu organique actif. Pour KONVERT :

**TikTok organique (1 video/jour pendant 30 jours)**
- Format : démo produit, avant/après, "j'aurais voulu savoir"
- Booster avec Spark Ads les vidéos qui dépassent 5K vues organiquement
- Objectif : au moins 1 vidéo > 50K vues dans le premier mois

**Créateurs à approcher (micro-influenceurs FR, 10K-100K)**
- Profils : dropshipping, Shopify, e-commerce, marketing digital
- Deal : accès Pro gratuit + commission affilié 25%
- Budget négociation : 0€ cash (accès + affilié seulement en phase 1)

---

## 10. PRIORITES D'EXECUTION PAR SEMAINE

**Semaine 1 — Setup**
- [ ] Installer Meta Pixel + events sur konvert.app (ViewContent, Lead, Purchase)
- [ ] Installer TikTok Pixel
- [ ] Créer les 3 créatifs Meta prioritaires (Démo, Before/After, Hook texte)
- [ ] Créer les 2 TikTok scripts vidéo T1 et T2
- [ ] Créer les custom audiences (visiteurs /essai, visiteurs site 30j)
- [ ] Paramétrer les UTMs sur toutes les URLs

**Semaine 2 — Lancement Phase 1**
- [ ] Lancer CAMPAGNE 1 Meta (CBO, 3 adsets, 30€/jour)
- [ ] Lancer TikTok Ads (2 adgroups, 20€/jour total)
- [ ] Surveiller CTR et CPL H48

**Semaine 3 — Premiers Arbitrages**
- [ ] Couper créatifs CTR < 1%
- [ ] Doubler budget sur le meilleur adset
- [ ] Produire 3 nouvelles variantes créatives

**Semaine 4 — Retargeting**
- [ ] Lancer CAMPAGNE 2 Meta retargeting (visiteurs /essai)
- [ ] Analyse complète : CPL, taux conv. lead→payant, ROAS
- [ ] Décision : scale ou pivot créatif

---

*Stratégie construite par ITACHI — Expert Pub Payante NEXARA*
*Workspace : /Users/mac/nexara/konvert/strategie/paid_ads_strategy.md*
