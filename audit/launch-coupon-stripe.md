# Coupon Stripe LAUNCH50 — création manuelle

Le code `LAUNCH50` doit exister dans Stripe Dashboard côté `live` (pas test)
avant le launch, sinon `/pricing?coupon=LAUNCH50` reçoit "promotion code not found"
et fallback sur la saisie manuelle (UX dégradée).

## Création — Stripe Dashboard

1. **Stripe Dashboard → Products → Coupons → New coupon**
   - **Name (interne)** : `Launch 50% off`
   - **Type** : `Percent off`
   - **Percent off** : `50`
   - **Duration** : `Once` (uniquement sur le 1er paiement, pas récurrent — sinon la marge crève)
   - **Apply to**: `All products` (les 3 plans)
   - **Currency restriction** : `EUR`
   - **Redemption limit** : `100` (limite d'usages totaux — créer urgency PH)
   - **Expires after** : `7 jours après J-Day` (manuel, à ajuster)
   - **Save**

2. **Promotion Code (le code humain)** depuis le coupon créé :
   - Sur la page coupon → **Add promotion code**
   - **Code** : `LAUNCH50` (case insensitive, mais le helper UPPER-case dans le code)
   - **Customer-facing name** : `Launch ProductHunt -50% premier mois`
   - **Restrictions** : aucune (ouvert à tous, pas de minimum)
   - **Save**

3. **Tester** :
   - Ouvre `/pricing?coupon=LAUNCH50` en navigation privée
   - Le banner "Code LAUNCH50 sera appliqué" doit s'afficher
   - Click sur Pro/Agency → la session Stripe doit montrer "Subtotal -50%" en haut

## Variantes possibles à créer pareillement

| Code | % off | Usage |
|---|---|---|
| `LAUNCH50` | 50 | ProductHunt + IndieHackers · 100 usages · 7j |
| `EARLY30` | 30 | Waitlist early supporters · 200 usages · 30j |
| `AFFILIATE10` | 10 | Public général via affiliés · pas de limite · perpétuel |
| `BETA100` | 100 (free) | Beta testers (1 mois gratuit) · 50 usages · 14j |

Note : le `BETA100` doit être limité à `Once` aussi, sinon le user est gratuit
à vie (perte revenu garantie).

## Hooks de monitoring

Sentry alert à créer :
- **Quand** : event Stripe `coupon.applied` ou metadata `coupon` non vide dans webhook
- **Action** : compteur PostHog `coupon_redeemed{code}` pour suivre adoption
- **Alerte** : si > 50 redemptions/jour sur LAUNCH50 → check qu'on bloque pas trop tôt

Le coupon est aussi présent dans `metadata.coupon` du webhook Stripe (cf
src/app/api/stripe/checkout/route.ts) → exploitable pour cohort analysis BI.

## Bloquant

Tant que les env vars `STRIPE_SECRET_KEY` ne pointent pas en `sk_live_` (cf
audit P0-5), le coupon ne peut pas être créé en mode live. À faire le J+2 du
plan launch quand tu actives Stripe LIVE.
