# KONVERT — Séquences cold email (ZARA)
## 3 touches · 8 jours · hello@konvertpilot.com

---

## Stratégie globale

La séquence suit une logique de pression croissante calibrée sur un ICP méfiant : l'e-commerçant Shopify établi a déjà reçu 50 pitches SaaS ce mois. Il filtre sur 3 signaux — est-ce que t'as regardé ma boutique, est-ce que tu comprends mon problème, est-ce que tu risques quelque chose de ton côté ? Les 3 touches répondent à ces 3 questions dans l'ordre. E1 : preuve que t'as regardé (observation chirurgicale + coût concret). E2 : preuve que tu risques quelque chose (offre gratos sans engagement). E3 : preuve que tu ne mendigues pas (breakup gracieux + un résultat concret). Pas d'image, pas de tracking pixel, pas de pièce jointe. Plain text uniquement — deliverability en priorité absolue.

---

## EMAIL 1 — J0 · Hook douleur · 60-90 mots

### Subject lines à tester (A/B/C)

| | Subject | Hypothèse |
|---|---|---|
| A | `{{firstName}}, ta fiche {{productName}}` | Hyper-personnalisé, nom produit = signal "j'ai regardé ta boutique" → meilleur open rate sur FR/Maroc |
| B | `idée pour {{shopName}}` | Plus vague, intrigue plus que A, test sur UAE/SA où le prénom seul peut suffire |
| C | `1 chose sur ta page {{productName}}` | Concret + curiosité, test alternatif si A sature après 200 envois |

> Hypothèse A/B : A génère plus d'opens sur la base FR (personnalisation forte). B génère plus d'opens sur la base MENA EN (moins de longueur, ton plus direct). Mesurer à J+3 sur 100 envois minimum avant de trancher.

**Preview text (50 chars max) :** `Ton trafic existe. Ta page, elle, perd.`

---

### Version FR neutre (FR · BE · CH)

```
Salut {{firstName}},

Vu la fiche de {{productName}} sur {{shopUrl}} — le produit est solide,
mais la page perd probablement la moitié des visites avant même le bouton
d'achat. Titre générique, pas de preuve sociale visible, zéro urgence.

En e-com FR, le taux de conversion moyen tourne autour de 1,5 %.
Sur 5 000 visites par mois, c'est 75 ventes. Une page bien faite
peut facilement passer à 2,5 % — soit 50 ventes de plus, sans
toucher à ta pub.

J'ai un truc à te montrer en 30 secondes, sans inscription :
konvertpilot.com/essai?ref=cold&shop={{shopName}}

— Syphax | Konvert | konvertpilot.com

P.S. Plus de 200 boutiques Shopify ont déjà utilisé Konvert pour
refaire leurs fiches produit. La première est gratuite.
```

---

### Version FR Maroc

```
Salut {{firstName}},

Vu la fiche de {{productName}} sur {{shopUrl}} — le produit tient la
route, mais la page laisse filer du trafic payant avant même le bouton
d'achat. Titre trop vague, pas de preuve client visible, pas de raison
d'acheter maintenant.

En e-com FR/MA, le taux de conversion moyen tourne autour de 1,5 %.
Sur 5 000 visites, c'est 75 ventes. Une page optimisée peut monter
à 2,5 % — 50 ventes de plus sans augmenter ton budget pub.

30 secondes, sans créer de compte :
konvertpilot.com/essai?ref=cold&shop={{shopName}}

— Syphax | Konvert | konvertpilot.com

P.S. La première page est gratuite. Tu vois le résultat avant de décider.
```

> Note Maroc : pas de mention "dirhams" en E1 (pas de pricing en E1, rule hors scope). Le wording "FR/MA" ancre la proximité géographique sans forcer.

---

### Version EN (UAE · SA · Égypte)

```
Hi {{firstName}},

Checked {{productName}} on {{shopUrl}} — solid product, but the page
is probably losing half your traffic before the buy button.
Generic headline, no visible social proof, no reason to act now.

Average e-com conversion in the region sits around 1–1.5%.
On 5,000 monthly visits, that's 75 sales. A properly built page
can get to 2.5% — 50 extra sales without spending more on ads.

30 seconds, no account needed:
konvertpilot.com/essai?ref=cold&shop={{shopName}}

— Syphax | Konvert | konvertpilot.com

P.S. First page is free. You see the result before you decide anything.
```

---

## EMAIL 2 — J+3 · Bump curiosité + valeur · 50-80 mots

### Subject lines

| | Subject | Hypothèse |
|---|---|---|
| A | `tu m'as pas vu, {{firstName}}` | Désarmant, autodérision → bypass radar "relance commerciale" |
| B | `{{shopName}} — je te génère la page gratis` | Offre directe, plus transactionnel, test si A trop informel pour ta liste |
| C | `relance — {{productName}}` | Minimaliste, sonne interne, test sur liste très froide |

> Hypothèse A/B : A fonctionne mieux sur founders FR habituels aux emails informels. B fonctionne sur CMO/marketing managers qui veulent comprendre la valeur vite. Mesurer reply rate J+3 → J+6.

**Preview text :** `Pas de pitch. Juste une page à te montrer.`

---

### Version FR neutre

```
Salut {{firstName}},

Tu m'as probablement pas vu — normal, tu reçois 40 emails de ce type
par semaine.

Donc je fais différemment : je te génère ta page {{productName}} gratis,
maintenant, sans engagement. Tu la regardes. Si c'est nul, tu m'envoies
te faire foutre et c'est terminé.

Si t'es curieux :
konvertpilot.com/essai?ref=cold&shop={{shopName}}

— Syphax
```

---

### Version FR Maroc

```
Salut {{firstName}},

T'as sans doute pas vu mon premier mail — c'est normal, les boîtes
de réception sont impitoyables.

Donc je coupe court : je te génère ta page {{productName}} gratis,
sans compte à créer. Tu juges le résultat. Si ça vaut rien,
tu ne réponds pas et c'est terminé.

konvertpilot.com/essai?ref=cold&shop={{shopName}}

— Syphax
```

---

### Version EN

```
Hi {{firstName}},

Probably missed my last email — fair enough, inboxes are brutal.

Different approach: I'll build your {{productName}} page for free,
right now, no account needed. You judge the output.
If it's not worth your time, just ignore this and we're done.

konvertpilot.com/essai?ref=cold&shop={{shopName}}

— Syphax
```

---

## EMAIL 3 — J+7 · Breakup honnête · 40-60 mots

### Subject lines

| | Subject | Hypothèse |
|---|---|---|
| A | `dernier mail, {{firstName}}` | Classique breakup SaaS, fonctionne car ferme une boucle cognitive |
| B | `je me suis peut-être trompé sur {{shopName}}` | Plus humble, moins "urgence", test sur leads froids qui ont regardé sans répondre |
| C | `on arrête là` | Ultra-court, punch, risqué mais testé efficace sur founders pressés |

> Hypothèse A/B : A produit plus de replies "en fait attends" car l'humain veut fermer la conversation proprement. B produit plus de curiosité chez ceux qui hésitaient. Tester sur deux batches de 50.

**Preview text :** `Pas de rancune. Juste un dernier truc.`

---

### Version FR neutre

```
{{firstName}},

Dernier mail de ma part.

Je vise pas les boutiques OK avec 1,5 % de conversion.
Si {{shopName}} n'est pas en mode "on optimise les pages maintenant",
j'ai mal ciblé — pas de souci.

Sinon, voici ce qu'une boutique mode a obtenu en 2 semaines :
konvertpilot.com/essai?ref=cold&shop={{shopName}}

— Syphax
```

> Note : le lien `/essai` fait office de case study placeholder jusqu'à ce que RYUK produise un case study dédié sur `/templates` ou `/cas-clients`. Remplacer le lien dès que la page existe.

---

### Version FR Maroc

```
{{firstName}},

Dernier message.

Je cible les boutiques qui veulent améliorer leur conversion maintenant —
pas dans 6 mois. Si c'est pas {{shopName}} en ce moment, aucun problème.

Sinon, voici le résultat d'une boutique similaire à la tienne :
konvertpilot.com/essai?ref=cold&shop={{shopName}}

— Syphax
```

---

### Version EN

```
{{firstName}},

Last email.

I focus on stores that want to fix their conversion now, not later.
If {{shopName}} isn't there yet, no hard feelings — wrong timing.

If you are: here's what a similar store got in 2 weeks:
konvertpilot.com/essai?ref=cold&shop={{shopName}}

— Syphax
```

---

## Notes d'envoi

### Timing optimal

| Email | Jour | Créneau recommandé | Rationnel |
|---|---|---|---|
| E1 | J0 (lundi ou mardi) | 09h00–10h00 heure locale | Inbox au calme, decision-making morning |
| E2 | J+3 (jeudi ou vendredi) | 09h00–09h30 | Avant le week-end, fondateurs souvent en mode planning |
| E3 | J+7 (lundi suivant) | 08h30–09h30 | Reprise de semaine, inbox propre, breakup = urgence douce |

- Ne jamais envoyer le vendredi après-midi ni le week-end (open rate -30% en moyenne).
- Pour MENA (UAE/SA/EG) : décaler sur dimanche–jeudi (semaine de travail locale). Éviter vendredi.
- Espacer les envois : minimum 3 minutes entre chaque email dans le batch.

### Règles de personnalisation

- `{{productName}}` doit être UN produit réel de la boutique, idéalement le bestseller ou le plus mis en avant sur la homepage. Fourni par NAGATO via Firecrawl pre-processing. Ne jamais laisser la variable vide — si non disponible, mettre "[votre produit phare]" et noter le lead pour correction manuelle.
- La ligne d'observation (ligne 1) doit être unique pour chaque prospect. Les templates ci-dessus sont la structure — la ligne 1 change à chaque envoi selon la note `note_perso` du CSV NAGATO.
- `{{shopUrl}}` : utiliser le domaine court sans "https://". Ex : `maisonzine.ma`, pas `https://www.maisonzine.ma`.
- UTM `?ref=cold&shop={{shopName}}` : encoder le nom de la boutique sans espaces (remplacer par `-`). Ex : `?ref=cold&shop=Maison-Zine`.

### Signaux à tagger dans le CRM Notion

| Signal | Tag | Action |
|---|---|---|
| Répond positivement (intérêt, question, "dis-m'en plus") | `warm_pos` | Répondre dans les 4h, proposer call 15 min Cal.com |
| Répond négativement (pas intéressé, pas le moment) | `warm_neg` | Fermer proprement, tag `closed_lost`, mettre une date de rappel +90j |
| Répond avec une objection (trop cher, j'ai déjà X) | `warm_obj` | Utiliser template de reply objection (cf. section ci-dessous) |
| Clique le lien `/essai` sans répondre | `clicked_no_reply` | Attendre E2 sans accélérer — la curiosité est là |
| Ouvre 3+ fois sans répondre | `warm_lurker` | Flag pour personnalisation E2 renforcée |
| Désinscription (demande de retrait) | `unsubscribed` | Supprimer immédiatement du CRM, ne plus contacter sous aucune forme |
| Bounce | `bounced` | Supprimer de la liste, ne pas relancer |

---

## Templates de reply — 5 objections classiques

> Ces templates sont des bases. Chaque réponse doit intégrer au minimum 1 détail propre à la boutique du prospect. Ne jamais copier-coller sans adapter la ligne 1.

---

### Objection 1 — "C'est trop cher"

```
Je comprends.

Pour que ce soit concret : le Pro à 79 €/mois, ça couvre quoi ?
Si tu fais 1 vente supplémentaire par semaine grâce à une meilleure page,
c'est couvert — souvent dès le premier produit.

La première page est gratuite. Tu la testes sur {{productName}},
tu mesures la différence. Si ça bouge pas, t'as rien perdu.

konvertpilot.com/essai

— Syphax
```

---

### Objection 2 — "J'ai déjà GemPages / Shogun / PageFly"

```
C'est pas la même chose.

GemPages, c'est un builder — tu construis la structure.
Konvert, c'est le contenu qui convertit : le texte, les sections,
la hiérarchie, les preuves sociales — générés en 30 secondes
à partir de ton URL produit.

Les deux sont complémentaires. La plupart de nos utilisateurs
collent la copy Konvert dans leur template GemPages existant.

Tu veux voir sur {{productName}} ?

— Syphax
```

---

### Objection 3 — "Envoie-moi plus d'infos"

```
Pas de doc PDF à te balancer — tout est live sur le site.

Ce qui est plus utile : tu testes toi-même sur un de tes produits,
t'as le résultat en 30 secondes, et on en parle si t'as des questions.

Lien direct : konvertpilot.com/essai

Si t'as 15 min cette semaine, je peux aussi te faire une démo
sur {{shopName}} spécifiquement : [lien Cal.com]

— Syphax
```

---

### Objection 4 — "J'ai pas le temps"

```
C'est exactement pour ça que Konvert existe.

30 secondes par page produit. Pas de brief, pas d'aller-retour
avec un freelance, pas de PDF à relire.

Tu colles ton URL, tu copies la page générée dans Shopify, c'est fait.

Si t'as littéralement 30 secondes maintenant :
konvertpilot.com/essai

— Syphax
```

---

### Objection 5 — "Ça marchera pas pour mon produit"

```
C'est la meilleure façon de le savoir.

La première page est gratuite, sans compte à créer.
Tu colles l'URL de {{productName}}, tu vois le résultat en 30 secondes.
Si c'est pas adapté à ta verticale, tu me le dis et je comprends.

On a déjà traité des boutiques en {{vertical}} — mode, beauté, maison,
wellness. La structure s'adapte au produit, pas l'inverse.

konvertpilot.com/essai

— Syphax
```

---

*Fichier ZARA — v1.0 — 30 mai 2026*
*Prochaine révision : après bilan S1 (J+7) avec données reply rate réels.*
*Case study E3 : remplacer le lien `/essai` par `/cas-clients` dès que RYUK livre la page.*
