# Cold email — Séquence follow-up

## Principe
Chaque follow-up apporte un angle nouveau. Pas de "je remonte ce mail" ou "tu as eu le temps de regarder ?" → ces phrases tuent le reply rate.

## Cadence

| Touch | Jours après J0 | Angle |
|---|---|---|
| Email 1 (cold) | J0 | Variante A/B/C |
| Follow-up 1 | J+3 | Use-case concret + proof |
| Follow-up 2 | J+7 | Question ouverte (revive) |
| Follow-up 3 (breakup) | J+12 | Sortie élégante |

**Important :** Reply dans le même thread (`Re:` même subject). N'envoie pas un nouveau thread, sauf breakup où tu peux changer le subject.

---

## Follow-up 1 — J+3 — Use-case concret

**Subject :** `Re: ta page [produit]` (même thread)

```
[Prénom],

Pour le contexte, un exemple concret :

[Témoignage placeholder — à remplacer dès qu'on a un client]
"Marc, boutique [niche], a refait 12 pages en une après-midi avec
Konvert → +0.4% de CVR sur les ads. ROAS passé de 1.4 à 2.1."

Si tu veux voir ce que ça donne sur ton produit [X],
test sans inscription : konvertpilot.com.

Sy
```

**Notes :**
- TODO : récupérer 1 vrai témoignage avant J+3 du premier envoi
- Si pas de témoignage encore, remplace par un screenshot d'une "avant/après" anonymisée
- L'angle "concret" évite le "rappel" qui agace

---

## Follow-up 2 — J+7 — Question ouverte

**Subject :** `Re: ta page [produit]` (même thread)

```
[Prénom],

Je te laisse tranquille après ce mail si pas de réponse — promis.

Une question avant : c'est quoi qui te bloque pour optimiser
tes pages produit aujourd'hui ? Time ? Skill copywriting ? Pas
convaincu que ça bouge la CVR ?

Je demande honnêtement, pas pour pitcher. Si tu réponds, je m'engage
à pas te repitcher Konvert dans ma réponse.

Sy
```

**Pourquoi ça marche :**
- "Je te laisse tranquille après ce mail" = la promesse qui rassure
- Question ouverte authentique → réveille même les ghosters
- "Je m'engage à pas te repitcher" = signal d'honnêteté rare → réponses
- Si ils répondent, t'as une **vraie conversation** + info de marché précieuse

---

## Follow-up 3 — Breakup — J+12

**Subject :** `je débranche` (nouveau subject, plus efficace ici)

```
[Prénom],

Dernier mail. Tu connais maintenant Konvert (outil qui transforme
un lien AliExpress en page produit qui vend) — quand t'auras
besoin, tu reviendras de toi-même ou pas, c'est nickel.

Si entre-temps je peux t'aider sur autre chose (copy, structure
page, choix d'angle ad) → réponds, je donne 10 min gratos.

Bonne suite avec [nom boutique].

Sy
```

**Notes :**
- "Dernier mail" = pression douce → 5-15% des breakups génèrent une réponse
- "10 min gratos sur autre chose" = soft door qui ouvre la conversation sans pitch
- Souhait personnalisé final = touche humaine

---

## Règles d'arrêt

Arrête la séquence **dès qu'il y a** :
- ✅ Réponse positive ou négative (passe en mode 1-to-1)
- ✅ Out-of-office (relance manuellement après leur retour)
- ✅ Désinscription explicite ("ne m'écris plus") → remove de la liste + flag domain
- ❌ Bounce hard (email invalide) → remove

## Tracker dans le Sheet

Colonnes à maintenir par lead :
- `last_touch_date` : date dernier email envoyé
- `next_touch_date` : date du prochain envoi
- `status` : cold / replied / interested / not_interested / customer / unsubscribed
- `reply_snippet` : 1ère ligne de leur réponse (pour priorisation rapide)
