# Store Builder Shopify — Spec Sprint 8 (A/B test natif + Re-audit CRO J+7)

Auteur : KAKASHI (analyste perf) — 2026-07-27
Destinataire : ANNA (implémentation)
Statut : spec fonctionnelle, aucune ligne de code écrite. Grounded sur l'état réel du repo (`konvert/src/lib/store-builder/`, `konvert/src/lib/shopify/store-builder/`, `konvert-dawn/sections/konvert-*.liquid`, `konvert/supabase/migrations/20260727_shopify_store_connections.sql`).

⚠️ Prérequis lu avant d'écrire cette spec : l'extension Shopify native (Sprint 5, tracking events) est **reportée**. Tout ce qui suit fonctionne **sans elle**, avec une section "ce qui s'améliore quand elle arrive" à la fin de chaque partie.

---

## 0. Constat technique qui conditionne toute la Partie A

Le générateur IA (Sprint 7, `assemble.ts`) écrit `hero.h1_title` → **`product.title`** (champ Admin du produit Shopify, pas un setting de section) et `description_html` → **`product.body_html`**. Le bloc `title` du template `main-product` de Dawn (`templates/product.json`) est `{{ product.title | escape }}` : une valeur unique sur l'objet Produit, pas un setting de template.

Conséquence : on **ne peut pas** A/B tester le H1/la description en gardant "2 variantes JSON de section" au sens naïf — un JSON de template différent n'y changerait rien, `product.title` reste la même valeur des deux côtés. Deux options réalistes :

- **Option retenue : swap client-side.** Le serveur rend toujours la variante A (= `product.title`/`product.body_html` actuels, donc 100% cacheable par Shopify, aucune logique conditionnelle en Liquid). Un petit script embarqué dans le thème résout l'assignment côté navigateur et remplace le texte du H1/de la description avant peinture si le visiteur est assigné à B. C'est le même principe que les outils de CRO client-side historiques (Optimizely/VWO) — zéro impact sur le cache Shopify, zéro écriture Admin API par pageview.
- Option rejetée : deux templates JSON (`product.json` / `product.b.json`) sélectionnés côté Liquid par cookie — cassé par construction car `title`/`description` restent liés à `product.title`, pas au template, et forcer une variation nécessiterait d'écrire `product.title` en Admin API à chaque bascule (donc partagé entre TOUS les visiteurs au même instant — pas un vrai A/B).

---

# PARTIE A — A/B test natif

## A.1 Modèle de données (Supabase)

Deux nouvelles tables + 2 colonnes ajoutées à `shopify_store_connections`.

### Migration — colonnes ajoutées à `shopify_store_connections`

```sql
alter table public.shopify_store_connections
  add column if not exists product_id bigint,          -- Product.id Shopify du produit installé (retour de createProduct, cf. install/route.ts — actuellement non persisté)
  add column if not exists theme_installed_at timestamptz; -- posé au succès d'activateTheme (déclencheur J+7 Partie B)
```

`product_id` est requis par les deux features (A et B) : aujourd'hui `install/route.ts` persiste `theme_id` mais pas `product_id` en retour de `createProduct` (cf. `CreatedProduct.id`, `types.ts` ligne 133-138) — à ajouter dans le même `update()` (best-effort, non bloquant, même pattern que `theme_id`).

### Table `store_builder_ab_tests`

```sql
create table public.store_builder_ab_tests (
  id             uuid primary key default uuid_generate_v4(),
  user_id        uuid references public.users(id) on delete cascade not null,
  connection_id  uuid references public.shopify_store_connections(id) on delete cascade not null,
  field          text not null check (field in ('h1_title', 'description')),
  variant_a_text text not null,   -- snapshot de product.title/body_html au lancement (= contenu actuellement live, jamais modifié après)
  variant_b_text text not null,   -- challenger saisi par le marchand dans le dashboard
  status         text not null default 'running' check (status in ('running','promoted','stopped','inconclusive')),
  winner         text check (winner in ('a','b','inconclusive')),
  started_at     timestamptz not null default now(),
  ended_at       timestamptz,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now(),
  -- une seule variante ACTIVE par (connection, field) — pas 2 tests concurrents sur le même champ
  constraint store_builder_ab_tests_one_running unique nulls not distinct (connection_id, field, status)
);
-- NB : le "unique nulls not distinct" ci-dessus est une approche simplifiée ;
-- si le moteur Postgres/Supabase utilisé ne supporte pas NULLS NOT DISTINCT
-- (PG ≥ 15 requis), remplacer par un index partiel :
-- create unique index store_builder_ab_tests_one_running_idx
--   on store_builder_ab_tests(connection_id, field) where status = 'running';

create index idx_store_builder_ab_tests_connection on store_builder_ab_tests(connection_id);

alter table public.store_builder_ab_tests enable row level security;
create policy "Users can CRUD own ab tests" on public.store_builder_ab_tests
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
```

### Table `store_builder_ab_events`

```sql
create table public.store_builder_ab_events (
  id            uuid primary key default uuid_generate_v4(),
  ab_test_id    uuid references public.store_builder_ab_tests(id) on delete cascade not null,
  variant       text not null check (variant in ('a','b')),
  event_type    text not null check (event_type in ('page_view','add_to_cart','purchase')),
  visitor_id    text not null,        -- valeur du cookie _kv_ab (pas d'IP/PII stockée)
  session_id    text,
  order_id      bigint,               -- rempli uniquement pour event_type='purchase' — dédup webhook
  value_cents   integer,              -- rempli uniquement pour event_type='purchase' (total_price commande)
  created_at    timestamptz not null default now(),
  -- dédup : un même order_id ne peut créer qu'un seul event purchase par test (retry webhook Shopify)
  constraint store_builder_ab_events_order_uniq unique (ab_test_id, order_id)
);

create index idx_store_builder_ab_events_test on store_builder_ab_events(ab_test_id, event_type, variant);

alter table public.store_builder_ab_events enable row level security;
-- Écriture : service role uniquement (l'endpoint public /api/shopify/events et le
-- webhook orders/paid utilisent supabaseAdmin, jamais le client anon-key).
-- Lecture : le marchand voit les events de SES tests via la relation ab_test → user_id.
create policy "Users can read own ab test events" on public.store_builder_ab_events
  for select using (
    exists (
      select 1 from public.store_builder_ab_tests t
      where t.id = ab_test_id and t.user_id = auth.uid()
    )
  );
```

`visitor_id` n'est **jamais** une IP ni un identifiant Shopify customer — c'est une valeur aléatoire générée côté client (cookie), non liée à une identité réelle. Pas de donnée personnelle stockée dans cette table (RGPD-safe par construction, à confirmer avec OROCHIMARU si besoin).

---

## A.2 Assignment (déterministe, sticky, sans casser le cache Shopify)

1. **Cookie first-party** `_kv_ab` — posé au premier chargement du script (`document.cookie`, `SameSite=Lax`, 365 jours), valeur = UUID v4 généré côté client. Ce cookie sert de `visitor_id`, réutilisé pour tous les tests du store.
2. **Fetch config actif** — au chargement de la page produit, le script appelle `GET /api/shopify/ab-tests/active?shop={shop_domain}&product_id={id}` (endpoint public, `Cache-Control: public, max-age=60` côté Vercel edge — cacheable, ne dépend pas du visiteur). Réponse : `{ h1_title_test: {id, variant_b_text} | null, description_test: {id, variant_b_text} | null }` (au plus 1 test par champ, cf. contrainte `unique` ci-dessus).
3. **Assignment** — pour chaque test actif reçu : `bucket = fnv1aHash(visitor_id + ':' + ab_test_id) % 100`. `bucket < 50` → variante A, sinon B. Fonction FNV-1a en JS pur (aucune dépendance externe), split 50/50, déterministe pour un même `(visitor_id, ab_test_id)` → sticky tant que le cookie n'est pas effacé, sans avoir besoin de stocker l'assignment côté serveur.
4. **Swap DOM** — si B : remplace le `textContent` de `#konvert-ab-h1` (ou `#konvert-ab-desc`) par `variant_b_text`. Nécessite d'ajouter ces `id` sur les blocs `title`/`description` du snippet `main-product` forké dans `konvert-dawn` (édition mineure du thème, pas du générateur). Script chargé en `<script>` synchrone juste après le nœud ciblé (pas `defer`/`async`) pour éviter le flash de contenu A→B — trade-off assumé : ~quelques ms de blocage render sur cette portion, acceptable vu la taille du script (< 2 Ko).
5. **Injection attributs panier** — au même moment que le swap, le script injecte dans le `<form>` produit 3 champs cachés : `attributes[konvert_ab_test_id]`, `attributes[konvert_ab_variant]`, `attributes[konvert_ab_visitor_id]`. Shopify propage nativement tout champ `attributes[x]` d'un formulaire d'ajout panier vers `cart.attributes`, qui devient automatiquement `order.note_attributes` à la commande — **aucun appel réseau supplémentaire requis**, mécanisme 100% natif Shopify, disponible sans extension.

Rien de tout ça ne touche le rendu Liquid ni les headers de cache Shopify : la page HTML servie est strictement identique quel que soit le visiteur.

---

## A.3 Events trackés

| Event | Déclencheur | Émission | Rôle |
|---|---|---|---|
| `page_view` | Chargement page produit, après résolution de l'assignment | `fetch('/api/shopify/events', {keepalive:true})` | Dénominateur du taux de conversion (visiteurs par variante) |
| `add_to_cart` | `submit` sur `form[action*="/cart/add"]` | `navigator.sendBeacon('/api/shopify/events', ...)` (survit à la navigation) | **Secondaire / garde-fou précoce** — signal rapide, mais pas la conversion business |
| `purchase` | Webhook `orders/paid` (server-side, pas de JS) | Insertion directe via `supabaseAdmin` dans le handler webhook | **Primaire** — seule vérité business (commande réellement payée) |

Endpoint `POST /api/shopify/events` (public, non authentifié) :
- Body : `{ shop_domain, ab_test_id, variant, visitor_id, event_type: 'page_view'|'add_to_cart', session_id? }`.
- Validation avant insert : `ab_test_id` existe, appartient à une connexion dont `shop_domain` correspond, et `status = 'running'` — sinon 204 silencieux (pas d'erreur qui fuite d'info, pas d'insert).
- Rate-limit : 20 req/min par `(shop_domain, visitor_id)` (réutilise `rateLimitAsync`, déjà utilisé dans `install/route.ts`) — anti-spam/anti-bot basique.

Webhook `POST /api/shopify/webhooks/orders-paid` :
- Vérification HMAC (`X-Shopify-Hmac-Sha256` contre `SHOPIFY_API_SECRET`) — pattern standard Shopify webhook, à écrire (n'existe pas encore dans `api/shopify/`).
- Parse `note_attributes` → si `konvert_ab_test_id` présent, insert `store_builder_ab_events` (`event_type='purchase'`, `order_id`, `value_cents = total_price × 100`). La contrainte `unique(ab_test_id, order_id)` absorbe les retries webhook Shopify sans doublon (insert `on conflict do nothing`).
- **Scope OAuth requis en plus** : `read_orders` — absent de `STORE_BUILDER_REQUIRED_SCOPES` actuel (`write_themes, write_products, read_products` dans `scopes.ts`). À ajouter, ce qui impose une **reconnexion** aux boutiques déjà connectées (même pattern déjà documenté dans le commentaire de `scopes.ts` pour `write_publications`). Proposition : ne demander ce scope élargi qu'au moment où le marchand crée son premier test A/B (pas au connect initial), pour ne pas alourdir l'onboarding Store Builder des marchands qui n'utilisent jamais l'A/B testing.
- **Enregistrement du webhook** : `POST /admin/api/{version}/webhooks.json {topic:'orders/paid', address:'https://konvertpilot.com/api/shopify/webhooks/orders-paid', format:'json'}` — à déclencher au même moment que l'upgrade de scope (création du 1er test), pas à l'install initial.

---

## A.4 Calcul du gagnant

**Métrique primaire : taux de conversion Achat** (`purchase` / `page_view`, par variante) — c'est la seule vérité business, cohérent avec la doctrine "Stripe ground truth" appliquée ici aux commandes Shopify payées. **Métrique secondaire/garde-fou : taux de conversion Ajout panier** (`add_to_cart` / `page_view`) — signal précoce, sert à détecter qu'une variante casse l'intérêt avant même d'avoir assez de données Achat, mais **ne déclare jamais un gagnant seul**.

### Garde-fous obligatoires avant de déclarer QUOI QUE CE SOIT

Un gagnant ne peut être déclaré que si **toutes** ces conditions sont vraies simultanément :
- `visiteurs_A ≥ 100` **et** `visiteurs_B ≥ 100` (N minimum par variante)
- `jours_écoulés ≥ 7` (T minimum — évite le biais jour de semaine)
- `achats_A ≥ 10` **et** `achats_B ≥ 10` (un test de proportion n'est pas fiable sous ce seuil, même avec N élevé)
- `p-value < 0.05` (test bilatéral)

Si une seule condition manque → statut `"Collecte en cours"` (dashboard), aucun gagnant affiché, même directionnellement.

### Formule (test de proportion à deux échantillons, z-test)

```
p_A = achats_A / visiteurs_A
p_B = achats_B / visiteurs_B
p_pool = (achats_A + achats_B) / (visiteurs_A + visiteurs_B)
SE = sqrt( p_pool × (1 - p_pool) × (1/visiteurs_A + 1/visiteurs_B) )
z = (p_B - p_A) / SE
p_value = 2 × (1 - Φ(|z|))   // Φ = fonction de répartition normale standard
```

Gagnant = variante avec le `p_x` le plus élevé, si `p_value < 0.05` et tous les garde-fous ci-dessus passés.

### Fenêtre de décision
- **Plafond de durée : 30 jours.** Si à J30 les garde-fous ne sont toujours pas remplis (ou remplis mais `p_value ≥ 0.05`) → statut `inconclusive`, test clos automatiquement (cron quotidien), retour à variante A par défaut, reco dashboard : "Pas de différence détectée après 30 jours — reviens à l'original et teste une autre hypothèse plutôt que de laisser tourner indéfiniment."
- Garde-fou secondaire affiché en continu (pas de blocage) : si le taux Ajout panier de B est significativement inférieur à A (même z-test, appliqué à `add_to_cart`), bandeau d'alerte dashboard "Variante B semble nuire à l'ajout panier — envisage d'arrêter le test avant terme" — le marchand reste libre de continuer.

---

## A.5 Switch dashboard

Écran "Tests A/B" (nouvelle page, à créer — aucune UI Store Builder n'existe encore dans `src/app/`), une carte par test actif :

| Élément affiché | Détail |
|---|---|
| Champ testé | "Titre H1" ou "Description" |
| Aperçu A vs B | texte complet des deux variantes, côte à côte |
| Visiteurs | `visiteurs_A` / `visiteurs_B` |
| CR Ajout panier | % A vs % B, delta relatif |
| CR Achat | % A vs % B, delta relatif — grisé "collecte en cours" si `achats_x < 10` |
| Statut | `Collecte en cours` (gris) / `Pas de différence significative` (orange) / `Gagnant détecté : Variante {A|B} (+X%, p={p_value})` (vert) |
| Jours écoulés | `J{n}/30` |

Actions :
- **"Promouvoir la variante gagnante"** — actif uniquement quand statut = `Gagnant détecté`. Écrit la variante gagnante dans `product.title` ou `product.body_html` via Admin API (`PUT /products/{id}.json`), passe `status='promoted'`, `winner`, `ended_at=now()`. Dès `status≠'running'`, l'endpoint `/api/shopify/ab-tests/active` ne renvoie plus ce test → le script cesse de swapper (variante gagnante devient la seule servie, via `product.title` désormais).
- **"Forcer maintenant"** (bouton secondaire, toujours visible) — modale de confirmation explicite : *"Échantillon insuffisant pour une décision fiable (N={n}, {achats} achats). Tu peux forcer, mais le résultat n'est pas garanti représentatif."* Permet au marchand de trancher business même hors garde-fous statistiques, en connaissance de cause — cohérent avec "honnête sur l'incertitude, jamais un chiffre flatteur sans contexte".
- **"Arrêter le test"** — repasse en variante A, `status='stopped'`.

---

## A.6 Ce qui s'améliore avec l'extension Shopify (future)

- Assignment et events pourront passer par le Web Pixels API natif (`analytics.subscribe('checkout_started')`, `'checkout_completed'`) au lieu de la combinaison beacon + attributs panier + webhook — événement `checkout_started` (actuellement impossible à observer proprement sans extension, le checkout étant hébergé sur `checkout.shopify.com`) deviendra trackable comme métrique intermédiaire entre `add_to_cart` et `purchase`.
- Le swap pourra potentiellement se faire server-side (edge function Shopify) plutôt que client-side, supprimant le petit risque de flash de contenu.

---

# PARTIE B — Re-audit CRO automatique J+7

## 0. Constat qui conditionne le choix des critères

Le générateur IA (Sprint 7) remplit déjà automatiquement, au moment de l'install, les sections `konvert-faq-rich`, `konvert-guarantees`, `konvert-comparison-table`, `konvert-urgency-bar`, `konvert-founder-story` (heading/story/role) et `konvert-exit-intent` (heading/text/cta_label) — avec des minimums imposés par le schéma Zod (ex. FAQ ≥ 4 items, guarantees ≥ 3, comparison rows ≥ 4). **Un critère qui vérifie juste "≥ 3 FAQ remplies" sera donc quasi toujours vert dès J0**, et n'a presque aucune valeur diagnostique à J+7.

Ce qui reste **structurellement vide après install**, par construction R5 (hors schéma du générateur, jamais touché par `assemble.ts`) :
- `konvert-social-proof` (`proof_number`/`custom_text`) — jamais généré, R5 oblige le marchand à saisir un vrai chiffre.
- `konvert-testimonials-carousel` — 3 blocs placeholder ("Placeholder tant qu'aucun vrai avis...", auteur "[Remplacez par...]", `rating=0`), jamais générés.
- `founder_name` (forcé à `''` dans `assemble.ts`, ligne `founder_name: ''`) et `founder_photo` (image_picker, hors schéma).
- `promo_code`/`cta_link` de `konvert-exit-intent` (forcés à `''`, R5).
- `story_html` du founder contient **volontairement** un token `[entre crochets]` non résolu (contrainte du schéma : `refine(s => /\[[^\]]+\]/.test(s))`) que le marchand doit remplacer par sa vraie histoire.

La checklist ci-dessous priorise donc ces vrais trous (poids forts) sur les critères déjà garantis par le générateur (poids faibles, gardés en défense en profondeur seulement — un marchand peut avoir supprimé un bloc dans l'éditeur de thème après install).

## B.1 Checklist complète (18 critères, poids Σ = 100)

### Groupe 1 — Contenu jamais généré par l'IA (vrais gaps, poids forts) — Σ 47

| # | Critère | Mesure (source) | Seuil pass | Poids |
|---|---|---|---|---|
| 1 | Avis clients réels | Theme Asset API, blocs `konvert-testimonials-carousel` : compter les blocs où `author_name` ≠ placeholder par défaut ET `quote` ≠ placeholder ET `rating > 0` | Tiered : 0 avis→0%, 1-2 avis→60%, ≥3 avis→100% du poids | 14 |
| 2 | Preuve sociale renseignée | Theme Asset API, section `konvert-social-proof` : `proof_number` ou `custom_text` non vide | Au moins un des deux champs rempli | 12 |
| 3 | Nom du fondateur renseigné | Theme Asset API, section `konvert-founder-story` : `founder_name` non vide | Non vide | 7 |
| 4 | Histoire fondateur personnalisée | Theme Asset API, `konvert-founder-story.story` : regex `/\[[^\]]+\]/` (placeholder crochets) absente | Aucun token `[...]` restant | 7 |
| 5 | Photo fondateur ajoutée | Theme Asset API, `konvert-founder-story.founder_photo` non vide | Renseignée | 4 |
| 6 | Popup exit-intent personnalisée | Theme Asset API, `konvert-exit-intent.promo_code` non vide | Renseigné (info : pas de vérif que le code existe réellement — hors scope, nécessiterait `read_discounts`) | 3 |

### Groupe 2 — Contenu généré par l'IA, vérif défensive (poids moyens) — Σ 23

| # | Critère | Mesure | Seuil pass | Poids |
|---|---|---|---|---|
| 7 | FAQ ≥ 3 Q/R non vides | Theme Asset API, `konvert-faq-rich.blocks` | ≥ 3 blocs `question`+`answer` non vides | 6 |
| 8 | Garanties ≥ 3 | Theme Asset API, `konvert-guarantees.blocks` | ≥ 3 blocs remplis | 5 |
| 9 | Tableau comparatif ≥ 4 lignes | Theme Asset API, `konvert-comparison-table.blocks` | ≥ 4 lignes remplies | 4 |
| 10 | Barre d'urgence remplie | Theme Asset API, `konvert-urgency-bar.message_default` | Non vide | 3 |
| 11 | Sticky ATC mobile actif | Theme Asset API, `product.json.order` | Section présente dans `order` | 2 |
| 12 | Description produit ≥ 150 mots | Admin API `products/{id}.json.body_html` (texte hors balises) | ≥ 150 mots | 3 |

### Groupe 3 — Produit / SEO / Perf, indépendant du générateur — Σ 30

| # | Critère | Mesure | Seuil pass | Poids |
|---|---|---|---|---|
| 13 | Images produit ≥ 4 | Admin API `products/{id}.images.length` | ≥ 4 | 10 |
| 14 | Meta title 30-60 car. | Admin API `products/{id}.metafields_global_title_tag` (ou GraphQL `seo.title`) | Longueur entre 30 et 60 | 5 |
| 15 | Meta description 70-160 car. | Admin API `products/{id}.metafields_global_description_tag` | Longueur entre 70 et 160 | 5 |
| 16 | Schema JSON-LD Product présent | Fetch serveur de l'URL publique (`https://{shop_domain}/products/{handle}`), recherche `<script type="application/ld+json">` avec `"@type":"Product"` | Présent | 3 |
| 17 | Perf mobile Lighthouse | Google PageSpeed Insights API, `strategy=mobile`, `lighthouseResult.categories.performance.score` | Tiered : <50→0%, 50-89→60%, ≥90→100% du poids | 5 |
| 18 | LCP mobile | PageSpeed Insights API, `audits['largest-contentful-paint'].numericValue` | Pass si < 4000ms (bonus si < 2500ms, mais bonus non modélisé dans le score, juste dans la reco) | 2 |

**Nouvel env var requis** : `GOOGLE_PSI_API_KEY` (PageSpeed Insights) — à ajouter au même titre que les autres tâches manuelles founder déjà trackées (`project_konvert_manual_tasks.md`).

## B.2 Formule du score

```
score = Σ (poids_i × credit_i)     // credit_i ∈ {0, 0.6, 1} pour #1 et #17 (tiered), {0, 1} sinon
```
Les poids sommant déjà à 100, `score` est directement sur 100, aucune normalisation supplémentaire nécessaire.

**Bandes** :
- `score < 50` → 🔴 rouge
- `50 ≤ score ≤ 75` → 🟠 orange
- `score > 75` → 🟢 vert

## B.3 Recommandations (1 phrase par critère en échec)

Garde-fou R5 impératif : pour tout critère lié à social-proof/testimonials, **jamais** de reco du type "génère des avis" — toujours "ajoute tes VRAIS avis/chiffres".

| # | Reco (si échec) |
|---|---|
| 1 | "Ajoute au moins 3 vrais avis clients dans la section Avis — jamais générés, toujours réels." |
| 2 | "Renseigne un vrai chiffre de preuve sociale (ex. nombre de commandes) dans la section Preuve sociale — jamais inventé." |
| 3 | "Ajoute ton vrai nom dans la section Notre histoire pour humaniser la page." |
| 4 | "Remplace les [crochets] restants dans ton histoire de marque par tes vraies infos (ville, année, etc.)." |
| 5 | "Ajoute une photo dans la section Notre histoire — les visages augmentent la confiance." |
| 6 | "Ajoute un vrai code promo actif à ta popup de sortie, ou laisse-la telle quelle en connaissance de cause." |
| 7 | "Vérifie que ta FAQ a bien au moins 3 questions remplies — un bloc a peut-être été supprimé." |
| 8 | "Vérifie que tes garanties (livraison, retour...) sont bien au moins 3 et remplies." |
| 9 | "Complète ton tableau comparatif — au moins 4 lignes remplies recommandées." |
| 10 | "Ta barre d'urgence est vide — ajoute un message (ex. délai de livraison)." |
| 11 | "Active la barre d'achat fixe mobile — elle améliore la conversion sur mobile." |
| 12 | "Ta description produit est courte — vise au moins 150 mots pour le SEO et la conversion." |
| 13 | "Ajoute plus de photos produit — vise au moins 4 (angles, contexte d'usage, packaging)." |
| 14 | "Ton titre SEO est mal calibré (trop court/long) — vise 30 à 60 caractères." |
| 15 | "Ta meta description est mal calibrée — vise 70 à 160 caractères." |
| 16 | "Les données structurées produit sont absentes — pénalise ta visibilité Google Shopping." |
| 17 | "Ta boutique est lente sur mobile — vérifie les images trop lourdes en premier." |
| 18 | "Ton chargement mobile est lent (LCP > 4s) — compresse tes images ci-dessus du pli." |

## B.4 Déclenchement (cron)

- Colonnes ajoutées à `shopify_store_connections` (cf. A.1) : `theme_installed_at` (posé au succès `activateTheme`, dans `install/route.ts`, même endroit que la mise à jour `theme_id`) + `audit_emails_sent integer[] default '{}'` (pattern identique à `trial_emails_sent`, contient `7` et/ou `30` une fois envoyés).
- Nouvelle route `GET /api/cron/store-builder-audit`, protégée par `CRON_SECRET` (même pattern exact que `cron/trial-emails/route.ts` : `safeCompare`, `maxDuration=60`).
- Exécution **quotidienne**. Pour chaque connexion avec `theme_installed_at` non nul : `jours = floor((now - theme_installed_at) / 1j)`. Si `jours ≥ 7` et `7 ∉ audit_emails_sent` → checkpoint J7. Si `jours ≥ 30` et `30 ∉ audit_emails_sent` → checkpoint J30. Un seul checkpoint envoyé par run (le plus tôt dû).
- Canal : email via Resend (`sendEmail`, `src/lib/email/index.ts`, déjà en place).
- Fréquence : **J+7 puis J+30** (pas au-delà dans ce sprint — un 3e checkpoint J+60/90 serait à évaluer selon le taux d'ouverture des deux premiers).

## B.5 Structure de l'email

- **Sujet** : `"Ton audit boutique — Score {score}/100 [{J+7|J+30}]"`
- **Corps** :
  1. Score + bande couleur, 1 phrase de contexte ("Voici où en est ta boutique 7 jours après l'installation.")
  2. **Top 3 recommandations uniquement** (cohérent avec la doctrine "jamais plus de 3 actions") — les 3 critères en échec au poids le plus élevé, triés par poids décroissant. Pas la liste des 18 critères dans l'email (trop dense pour un marchand non-tech) — la liste complète reste consultable dans le dashboard Konvert.
  3. Pour le checkpoint **J+30 uniquement** : ligne de trend explicite "Score J+7 : {x}/100 → Score J+30 : {y}/100 ({delta})" — boucle de mesure d'impact, cohérent avec la doctrine "mesurer l'impact des recos du mois précédent".
  4. CTA "Voir mon audit complet" → lien dashboard Konvert.
- **Ton** : niveau collège, pas de jargon non défini (ex. jamais "LCP" sans "temps de chargement mobile" entre parenthèses).

## B.6 Modèle de données — table `store_builder_audits`

```sql
create table public.store_builder_audits (
  id             uuid primary key default uuid_generate_v4(),
  user_id        uuid references public.users(id) on delete cascade not null,
  connection_id  uuid references public.shopify_store_connections(id) on delete cascade not null,
  checkpoint     text not null check (checkpoint in ('j7','j30')),
  score          numeric(5,2) not null,
  band           text not null check (band in ('red','orange','green')),
  criteria       jsonb not null,   -- snapshot complet des 18 critères : [{id, label, weight, pass, credit, measured_value}]
  created_at     timestamptz not null default now()
);

create index idx_store_builder_audits_connection on store_builder_audits(connection_id, checkpoint);

alter table public.store_builder_audits enable row level security;
create policy "Users can read own audits" on public.store_builder_audits
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
```

`criteria` en JSONB permet au dashboard d'afficher l'historique complet sans recalcul, et sert de base au calcul du delta J+7→J+30 dans l'email.

---

## Récap — 3 métriques primaires par feature (pas plus)

**A/B test natif** :
1. **Taux de conversion Achat par variante** (déclare le gagnant — vérité business)
2. **Taux de conversion Ajout panier par variante** (garde-fou/signal précoce)
3. **p-value + taille d'échantillon** (gate ship/no-ship — jamais de gagnant sous N<100, achats<10, T<7j)

**Re-audit CRO J+7** :
1. **Score CRO 0-100** (agrégat pondéré des 18 critères)
2. **Nombre de critères Groupe 1 en échec** (les vrais gaps structurels — pas les critères déjà garantis par le générateur)
3. **Delta score J+7 → J+30** (mesure l'impact réel des recos envoyées, pas une photo isolée)

---

## À trancher / tâches manuelles founder avant implémentation ANNA

- [ ] Ajouter `GOOGLE_PSI_API_KEY` (PageSpeed Insights) aux env vars Vercel.
- [ ] Décider du moment d'upgrade du scope OAuth `read_orders` (proposition : lazy, au 1er test A/B créé — pas à l'install initial).
- [ ] Confirmer avec OROCHIMARU que `store_builder_ab_events.visitor_id` (cookie aléatoire, pas de PII) ne nécessite pas de bannière consentement cookie dédiée côté boutique marchande (a priori non : mesure d'audience/A-B test propriétaire = équivalent "finalité strictement nécessaire" au sens CNIL, mais à faire trancher explicitement, pas supposé ici).
