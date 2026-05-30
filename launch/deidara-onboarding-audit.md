# KONVERT — Audit Onboarding & Nurture Trial → Paid
**Date :** 30 mai 2026 | **Auteur :** DEIDARA (CS) | **Scope :** J0 = 2 juin 2026

---

## 1. État actuel onboarding — flow steps + temps estimé + frictions

### Tunnel /essai (anonymous)

**Flow réel :**
1. Arrivée sur `/essai` — step "email" visible immédiatement (email requis avant le produit)
2. Saisie prénom + email → clic "Générer ma page"
3. Step "product" : URL produit OU saisie manuelle (nom, description, image)
4. Clic "Générer ma page en 30 secondes" + attente Turnstile
5. Loader animé (4 textes rotatifs, 1.8s par texte, durée réelle 60-90s côté serveur)
6. Redirect `/preview/[id]` — résultat visible

**Nombre de clics** : 4 clics minimum (email, générer, URL produit, générer final). Acceptable.

**Temps estimé :** 2-3 min si URL valide, 3-4 min en saisie manuelle. TTFV < 5 min = atteignable si le serveur répond sous 60s.

**Friction principale identifiée :** l'email est capturé à l'étape 1, avant que le user ait vu la moindre valeur. C'est contraire à la best practice "show value first, then capture". Le user n'a aucune preuve de qualité au moment où il donne son email.

---

### Wizard /dashboard/new (users signés)

**8 étapes décortiquées :**
- Step 1 — Source produit (URL ou saisie manuelle) : obligatoire, essentiel
- Step 2 — Photos produit (upload) : optionnel en pratique
- Step 3 — Vidéos UGC (upload désactivé, liens YouTube/TikTok seulement) : quasi-inutilisable J0
- Step 4 — Photos Avant/Après : très niche, non-applicable pour la majorité des produits
- Step 5 — Style & Ton (38 templates, 4 tons) : utile mais paralyse le choix (paradox of choice)
- Step 6 — Plateforme cible : utile, 4 options
- Step 7 — Langue du résultat : utile, 8 langues
- Step 8 — Récap + lancer : clic final + génération

**Temps estimé total :** 6-12 min selon le niveau d'exploration des templates (step 5 est un trou noir). TTFV < 5 min = non atteignable avec 8 étapes si l'user s'arrête sur le template picker.

**Points positifs détectés :**
- Sauvegarde automatique localStorage (draft 24h, restauré au F5)
- Autosave DB après génération (pageId créé immédiatement, bouton Publier visible)
- Fallback scrape → saisie manuelle pré-remplie si URL bloquée (UX propre)
- Warning non-bloquant "template incompatible" au lieu d'erreur (mode dégradé bien géré)
- StepIndicator scrollable sur mobile

---

### Séquence emails preview (5 mails J0/J+1/J+3/J+5/J+7)

| Email | Subject | Angle | Verdict |
|---|---|---|---|
| J0 | "Voici ta page produit — [titre]" | Livraison + value stack | Solide. CTA clair vers preview. Mention "7 jours" crée urgence mais... |
| J+1 | "Pourquoi cette page va mieux convertir que la tienne" | Pédagogie (3 éléments différenciants) | Bon. CTA "Publier" → preview. Manque le lien pricing. |
| J+3 | "[Nom], il a fait pareil que toi — voilà ce qui s'est passé" | Social proof générique sans nom/chiffre | Témoignage faible : "E-commerçant dropshipping" = aucune autorité. CTA → pricing ok. |
| J+5 | "39€ vs ce que tu perds chaque semaine" | Calcul douleur ROI | Très fort. Le calcul 1% → 3% est le meilleur email de la séquence. |
| J+7 | "On supprime ta page dans 24h" | Urgence finale | Urgence trop directe sans offre de sortie. Risque unsubscribe élevé. |

**Séquence emails post-signup (templates.ts) — 9 emails J0 à J+14 :**
- Welcome J0 : déclenché uniquement si `data.session` est créé (pas en mode "confirm email"). Risque : si Supabase a "Confirm email" activé en prod, le welcome ne part pas. À vérifier avec ANNA.
- J+1 : feature-focused (scraper) — pas de question, pas d'empathie
- J+3 : "t'as essayé le scraper ?" — redondant avec J+1
- J+7 : NPS précoce sans avoir vu si la page a été utilisée
- J+10 : upsell pricing table — trop tôt si pas de première page créée
- J+13 : discount -30% — bon save offer mais timing sans trigger comportemental

---

### Crisp Chat

L'implémentation ne charge le script Crisp que si le consentement cookies est "accepted" (`getConsent() === 'accepted'`). Aucun bot first-response, aucun trigger sur pages clés (pricing, checkout), aucune config heures ouverture visible dans le code. C'est un Crisp vierge côté configuration métier.

---

## 2. Frictions identifiées (8 au total)

### F1 — Email avant valeur sur /essai (CRITIQUE)
Le user donne son email sans avoir vu la moindre page générée. La conversion en étape 1 est donc bloquée par le trust-gap. Best practice prouvée : montrer la preview d'abord (ou un exemple animé), capturer l'email après pour "recevoir le lien".
**Recos DEIDARA :** Tester la variante "product first → email gate après preview" (B test A/B). Si pas testable avant J0, ajouter a minima 2-3 exemples de pages générées visibles au-dessus du formulaire pour ancrer la valeur attendue.

### F2 — Loader texte "30 secondes" mais réalité 60-90s (CRITIQUE)
Le code API a `maxDuration = 90`. Les loadingTexts disent "environ 30 secondes". L'écart crée de l'anxiété et des abandons. Aucun feedback de progression réel pendant l'attente.
**Recos DEIDARA :** Corriger le texte vers "environ 60 secondes" ou ajouter un progress bar factice (0% → 25% → 60% → 90% → 100%) pour réduire l'abandon pendant l'attente.

### F3 — Wizard 8 étapes sans skip (HAUT IMPACT)
Steps 3 (vidéos UGC, upload désactivé) et 4 (Avant/Après) sont inutilisables ou non-pertinents pour la majorité des nouveaux users. Ils s'attendent à "coller un lien et obtenir une page" — pas à remplir un formulaire en 8 étapes.
**Recos DEIDARA :** Rendre les steps 2/3/4 optionnels avec un bouton "Passer" visible dès le titre de l'étape. Idéalement, le flux rapide devient : Step 1 → Step 5 (style) → Générer, avec les autres steps accessibles en "options avancées".

### F4 — 38 templates sans filtre ni recommandation (PARALYSIE)
La step 5 affiche 38 templates listés alphabétiquement sans catégorie, sans recommandation contextuelle selon le type de produit détecté à l'étape 1. Le user passe 3-5 min à lire les descriptions.
**Recos DEIDARA :** Pre-sélectionner le template le plus adapté selon le type de produit (déjà détecté via `detectProductType`). Afficher les 3-5 recommandés en premier, puis "tous les templates" en accordéon. KISAME pour la logique, OBITO pour le design, ANNA pour le code.

### F5 — Welcome email conditionnel à `data.session` (RISQUE PROD)
Si Supabase a "Confirm email" activé en production, le welcome J0 ne s'envoie jamais. Les users entrent dans le tunnel sans aucun email d'activation. La séquence d'onboarding saute le premier message.
**Recos DEIDARA :** Déclencher le welcome après la confirmation email (webhook Supabase `user.confirmed` → appel `/api/email/welcome`). ANNA à checker d'urgence avant J0.

### F6 — Témoignage J+3 anonyme et sans chiffre
"E-commerçant dropshipping, plan Starter" n'a aucune autorité. Aucun résultat chiffré. C'est le moment où le user hésite le plus (3 jours après, toujours pas payé). Un témoignage faible à cet instant précis peut faire la différence entre conversion et abandon.
**Recos DEIDARA → ZARA :** Remplacer par un témoignage réel avec prénom + pays + résultat chiffré ("Ahmed, +38% de conversion sur sa boutique Shopify FR, Starter"). Si aucun témoignage réel disponible J0 : anticiper avec un témoignage interne validé, retirer le guillemet-quote et remplacer par un cas d'usage concret avec stats simulées réalistes.

### F7 — J+7 "On supprime ta page dans 24h" sans offre de sortie
L'urgence est maximale mais il n'y a aucune offre d'aide, aucune alternative, aucun discount. Un user qui n'a pas converti en 7 jours a une raison (prix, doute, pas le temps). L'email actuel pousse à l'abandon ou au désabonnement plutôt qu'à la conversion.
**Recos DEIDARA → ZARA :** Ajouter dans cet email : "Si 39€/mois c'est un frein, réponds à cet email — on a une option à te proposer". Link vers le plan Starter avec coupon LAUNCH50 (-50% jusqu'au 27 mai, à prolonger après). Transformer l'urgence en opportunité.

### F8 — Crisp sans bot, sans trigger, consentement-gated (MODÉRÉ)
Le Crisp est purement passif : il n'apparaît que si l'user a accepté les cookies. Aucun trigger sur `/pricing` (page de décision critique), aucun bot configuré pour répondre hors heures. Pour J0 avec 50 signups attendus, la charge support manuelle peut être élevée si pas de bot first-response.
**Recos DEIDARA :** Configurer dans Crisp (dashboard, pas code) : (1) bot first-response "Bonjour, on répond dans les 30 min. En attendant, tu peux lire la FAQ", (2) trigger automatique sur `/pricing` après 45s "Tu as une question sur les plans ?", (3) horaires J0 : 8h-23h avec notification mobile activée.

---

## 3. Quick wins P0 avant J0 (2 juin)

### QW1 — Corriger le texte "30 secondes" → "environ 60 secondes"
**Impact :** HIGH | **Effort :** LOW | **Owner :** ANNA | **P0**
Une ligne de code dans `/essai/page.tsx` (strings loadingDuration dans `T.fr` et `T.en`). Évite l'abandon quand le loader dure 75s sans feedback. Impact direct sur le taux de completion du tunnel.

### QW2 — Vérifier le déclenchement du welcome email si "Confirm email" Supabase activé
**Impact :** HIGH | **Effort :** LOW | **Owner :** ANNA | **P0**
Si le welcome ne part pas pour les users en mode confirmation, la séquence onboarding est brisée dès J0. ANNA doit vérifier la config Supabase prod et câbler un webhook `user.confirmed` si nécessaire. C'est un risque silencieux : aucune erreur visible, mais zéro email de bienvenue.

### QW3 — Ajouter bouton "Passer" visible sur steps 2/3/4 du wizard
**Impact :** HIGH | **Effort :** LOW | **Owner :** ANNA | **P0**
Les steps "Photos", "Vidéos UGC" (upload désactivé) et "Avant/Après" bloquent le TTFV. Un simple `button onClick={() => setStep(step + 1)}` stylisé en lien "Passer cette étape" réduit le temps moyen de complétion de 3-4 min. Pas de refonte, juste un bouton skip.

### QW4 — Remplacer le témoignage J+3 par un cas concret avec chiffre
**Impact :** MED | **Effort :** LOW | **Owner :** ZARA pour le copy | **P0**
Dans `src/lib/email/preview-templates.ts`, la fonction `emailPreviewDay3`. Même un exemple anonyme mais précis ("Un dropshipper accessoires Shopify FR, plan Starter, +41% sur sa page coque téléphone") est plus convaincant que le texte actuel. ZARA l'écrit, ANNA le déploie.

### QW5 — Configurer Crisp bot first-response + trigger pricing avant J0
**Impact :** MED | **Effort :** LOW | **Owner :** DEIDARA (configuration dashboard Crisp, pas de code) | **P0**
Action 100% manuelle dans l'interface Crisp. À faire impérativement avant J0 pour ne pas se retrouver avec 50 users en attente de réponse au lancement. Inclut : message bot auto, horaires, trigger `/pricing`, routing vers l'email si hors-ligne.

---

## 4. Save offers playbook — 5 scénarios

### Scénario 1 — Login drop 7 jours (Yellow alert)

**Trigger :** `sessions_last_7d = 0` ET user inscrit depuis > 7j ET pas encore payant
**Canal :** Email personnalisé (pas automation générique)
**Message :** "Tu nous as oubliés ? Pas de jugement — voilà 3 ressources qui t'aideront cette semaine" + 3 liens utiles (tuto store connect, vidéo Loom 90s, page FAQ). Offre optionnelle : "Si tu veux qu'on regarde ensemble ta situation, je peux bloquer 15 min." + lien Calendly.
**Ton :** Curiosité, pas relance commerciale. Zéro mention d'upgrade.
**KPI :** Taux de réponse > 15% / taux de retour session J+3 > 20%
**Owner :** DEIDARA rédige, ANNA câble le trigger PostHog `login_drop_7d`

### Scénario 2 — Quota 75% atteint avant J+10 (Power user early signal)

**Trigger :** `quota_used_pct >= 75` ET `account_age_days <= 10`
**Canal :** Popup in-app (non-bloquant, dismissable) + email backup J+0 si pas cliqué en 24h
**Message popup :** "Tu es à [X/Y] pages. Tu avances vite — passe en Pro pour ne pas ralentir. 20% off ce mois."
**Message email :** Récap des pages créées + bénéfice Pro (quota étendu + analytics avancés + multi-boutiques) + code promo généré automatiquement via Stripe.
**Offer :** Coupon -20% premier mois Pro, créé via API Stripe, expiration 72h pour créer urgence réelle (pas fake).
**KPI :** Conversion upgrade > 25% sur ce segment (power users early = meilleur signal conversion)
**Owner :** ANNA câble le trigger, TSUNADE valide le niveau de remise, DEIDARA définit le copy brief pour ZARA

### Scénario 3 — Quota stagnant 0 pages générées à J+5 (Non-activation critique)

**Trigger :** `pages_created_total = 0` ET `account_age_days >= 5`
**Canal :** Email perso DEIDARA + offre Calendly screen share
**Message :** "Tu t'es inscrit il y a 5 jours et t'as pas encore créé ta première page. Ça coince quelque part ? Je peux prendre 15 min avec toi pour la créer ensemble — on partage l'écran, on le fait." + lien Calendly 15 min "Créer ma première page avec DEIDARA".
**Logique :** Le problème n'est jamais l'outil — c'est toujours le manque de temps, la peur de se tromper ou un bug silencieux. L'appel de 15 min diagnostique et résout les 3 en même temps.
**KPI :** Taux d'acceptation Calendly > 10% / taux d'activation post-call > 60%
**Owner :** DEIDARA rédige et répond aux calls, ANNA câble le trigger

### Scénario 4 — Billing failure (carte expirée/refusée)

**Trigger :** Stripe webhook `invoice.payment_failed`
**Séquence en 3 temps :**
- J0 (immédiat) : "Ta carte a été refusée — voici comment mettre à jour en 30 secondes." + lien direct Stripe Customer Portal (1 clic, pas de navigation). Ton : pédagogique, pas alarmiste. "C'est souvent juste la date d'expiration — ça arrive à tout le monde."
- J+3 (si non résolu) : "On n'a toujours pas pu prélever — tu as encore accès à tout, mais il faut régulariser avant [date]." Offre : "Si tu as besoin d'un peu de temps, on peut mettre ton compte en pause 1 mois — tes pages restent intactes." + lien Customer Portal + lien pour activer la pause.
- J+7 (final) : "C'est le dernier rappel. Si on ne reçoit pas de paiement avant [date+2], on passe ton compte en Starter gratuit automatiquement — tu gardes tes pages de base." Offre finale : downgrade doux plutôt que cancel brutal.
**KPI :** Taux de récupération paiement J+7 > 50% / taux de churn évité > 70%
**Owner :** ANNA câble le webhook Stripe → séquence Resend, DEIDARA valide le copy avec ZARA

### Scénario 5 — Cancellation request (popup avant confirmation)

**Trigger :** Clic sur "Annuler mon abonnement" dans le Customer Portal (avant confirmation finale)
**Mécanisme :** Popup intercept avec sondage 1 question et 3 réponses cliquables (pas de formulaire long).

Option A — "Trop cher" :
Proposition immédiate : Downgrade vers Starter (si en Pro/Agency) + visuels "ce que tu gardes". OU coupon -50% 3 mois (DEIDARA génère via Stripe API, TSUNADE valide le cap). Clic = appliqué immédiatement, pas de redirection.

Option B — "Il me manque une feature" :
Champ texte libre + bouton "Envoyer". Réponse auto : "On a noté ta demande — si ça ship dans les 30 jours, on te prévient en premier." Auto-ticket dans Notion (via MCP Notion) tagué KISAME + user_id + feature demandée. Si la feature ship : email perso DEIDARA "Ta demande a été implémentée, voici comment l'utiliser."

Option C — "Pas assez utilisé / manque de temps" :
Proposition : Pause subscription 1-3 mois via Stripe `pause_collection`. "Tes pages, ton store connect, tout reste. Tu reprends d'un clic." Sélecteur durée (1 mois / 2 mois / 3 mois) → 1 clic pour activer.

**Si l'user refuse les 3 options et confirme le cancel :**
Email de confirmation sobre + "La porte est ouverte. Si tu reviens dans les 6 mois, on garde tes pages — tu reprends exactement où t'as laissé." Flag `frozen` en DB, winback J+15 déclenché automatiquement.

**KPI :** Save rate > 35% des cancel intents / distribution offres A/B/C à tracker dans PostHog

---

## 5. KPIs onboarding à tracker J0

| Métrique | Définition | Cible J0-J7 | Source |
|---|---|---|---|
| TTFV /essai | Temps entre step email et redirect /preview/[id] | < 90s (réaliste) | PostHog `essai_started` → `generate_completed` |
| TTFV /dashboard | Temps entre step 1 wizard et mode editor visible | < 8 min | PostHog `new_page_wizard_started` → `generate_completed` |
| Completion tunnel /essai | % users qui finissent la génération après step email | > 55% | PostHog funnel |
| Completion wizard /dashboard | % users qui terminent les 8 steps | > 40% | PostHog `wizard_completed` |
| Activation rate J7 | % signups avec au moins 1 page générée | > 30% | PostHog `page_generated` |
| Aha moment rate J7 | % signups avec 1 page publiée | > 20% | PostHog `page_published` |
| Conversion trial → paid J7 | % essais gratuits convertis en abonnement | > 5% | Stripe subs / signups |
| Email open rate séquence preview | Moyenne sur 5 emails | > 38% | Resend analytics |
| Email click rate séquence preview | Moyenne sur 5 emails | > 6% | Resend analytics |
| Unsubscribe rate séquence | % désabonnements sur la séquence | < 2% | Resend + table public_previews |
| Drop rate step 5 (templates) | % users qui abandonnent sur le template picker | < 20% | PostHog event par step |

---

## 6. Plan nurture trial → paid — J0 à J+14

### J0 (jour du signup)
- Welcome email J0 envoyé dans les 5 min (si session créée — QW2 à vérifier)
- Pour les leads /essai : email preview delivery immédiat avec lien direct preview
- Crisp bot actif, réponse < 30 min en heures ouvrées
- PostHog : vérifier que `page_generated` et `signup` sont trackés correctement dès J0

### J+1
- Leads /essai : email J+1 "Pourquoi cette page va mieux convertir"
- Users signés sans 1ère page : email "T'as pas encore créé ta première page" (déjà dans templates.ts)
- Monitoring PostHog : combien de users ont complété step 1 du wizard ?
- Action manuelle si < 20% completion à 18h : DEIDARA poste dans Crisp un message proactif "Tu as une question pour ta première page ?"

### J+2
- Pas d'email (pause intentionnelle — évite la fatigue). Surveillance des signaux Crisp.
- Monitoring : health score calculé sur les 50 signups J0. Identifier les Red (0 action depuis signup).
- Action : pour chaque Red, email perso DEIDARA (pas automation) "Comment t'aider à démarrer ?"

### J+3
- Leads /essai : email J+3 social proof (QW4 appliqué : témoignage avec chiffre)
- Users signés : email "t'as essayé le scraper ?" (templates.ts emailDay3) — à améliorer en J+2 si QW4 impacte les previews : ajouter un lien vers un Loom 90s demo scraper
- Monitoring : taux d'ouverture J0/J+1/J+3 disponible dans Resend. Ajuster si open < 30%.

### J+5
- Leads /essai : email J+5 "39€ vs ce que tu perds" — meilleur email de la séquence, aucune modif nécessaire
- Users signés : vérifier quota. Si 0 page générée → déclencher Scénario 3 save offer (call screen share 15 min)

### J+7
- Leads /essai : email J+7 "On supprime ta page dans 24h" — à modifier avant envoi (QW4 étendu : ajouter offer coupon LAUNCH50 ou équivalent dans le body)
- Users signés J+7 : email NPS précoce (`emailDay7` dans templates.ts). Ajouter la question "De 0 à 10, recommanderais-tu KONVERT à un e-commerçant ?" avec lien Typeform ou lien mailto
- Monitoring : combien de conversions trial → paid en J7 ? Comparer vs cible 5%.

### J+8 à J+10
- Focus sur les non-convertis : email J+10 upsell plans (templates.ts emailDay10). Déclencher uniquement pour les users avec au moins 1 page créée (pas de sens de montrer les plans à quelqu'un qui n'a pas vu la valeur)
- Trigger upsell quota 75% si power users early ont atteint le seuil (Scénario 2)

### J+11 à J+12
- Email "On peut t'aider" (emailDay12) — uniquement aux users sans page générée encore : reformuler comme un check-in humain, pas comme une relance plan
- Pour les users avec pages : passer en mode éducationnel (tips conversion, comment lire les analytics)

### J+13
- Discount -30% (emailDay13) — ATTENTION : vérifier avec TSUNADE si le coupon est configuré dans Stripe (le code dit "Code automatique à la checkout" mais aucun coupon n'est référencé dans le template). Si pas de coupon configuré, l'email promet quelque chose qui n'existe pas. Bloquer ou corriger avant envoi.

### J+14
- Email NPS/retour J+14 (emailDay14) — garder le ton conversationnel "je lis tout personnellement" + ajouter 2 boutons cliquables (thumbs up / thumbs down) pour les users sans réponse verbatim

---

## Annexe — Propriétaires des actions P0

| Action | Owner | Délai |
|---|---|---|
| QW1 : corriger texte "30 secondes" | ANNA | Avant J0 |
| QW2 : vérifier welcome email si Confirm email activé | ANNA | Avant J0 — CRITIQUE |
| QW3 : ajouter bouton "Passer" steps 2/3/4 wizard | ANNA | Avant J0 |
| QW4 : remplacer témoignage J+3 avec chiffre | ZARA (copy) + ANNA (deploy) | Avant J0 |
| QW5 : configurer Crisp bot + triggers | DEIDARA | Avant J0 |
| Vérifier coupon J+13 dans Stripe | TSUNADE | Avant J+13 |
| Câbler trigger login_drop_7d | ANNA | P1 — avant J+7 |
| Câbler trigger quota_75pct | ANNA | P1 — avant J+10 |
| Save offer popup cancel intent | ANNA (code) + OBITO (design) | P2 — avant J+30 |
| B test email-first vs product-first sur /essai | KISAME (décision) + ANNA (code) | P2 — post-launch |
