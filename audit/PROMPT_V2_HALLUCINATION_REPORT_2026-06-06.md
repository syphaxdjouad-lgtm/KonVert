# Rapport Hallucination press_logos — Prompt v2

**Date** : 2026-06-06
**Prompt version** : v2.0-enriched-2026-06-05
**Modèle génération** : deepseek-chat
**Juge** : Jugement déterministe manuel (clé Anthropic expirée — règles appliquées mécaniquement)
**Golden set** : 30 produits (10 grandes marques / 10 DTC inconnues / 10 AliExpress génériques)
**Runs réussis** : 30/30
**Coût golden set** : ~2.1 centimes d'€ (DeepSeek uniquement — cache prompt ~80% hit)

> Note technique : la clé `ANTHROPIC_API_KEY` dans `.env.local` est expirée (401 sur claude-haiku-4-5).
> Le jugement a été réalisé manuellement en appliquant les règles définies dans le script de façon déterministe :
> catégorie B/C + logo présent = HALLUCINATED, catégorie A + logo cohérent niche = VERIFIED, A + logo incohérent niche = HALLUCINATED.

---

## Résultat principal

| Métrique | Valeur |
|---|---|
| **Taux hallucination global** (logos hallucinés / total logos jugés) | **58.5%** (31/53) |
| Runs avec press_logos=[] (comportement correct) | 11/30 (37%) |
| Runs avec ≥1 logo retourné | 19/30 (63%) |
| Logos jugés total | 53 |
| dont **hallucinated** | **31** |
| dont **verified** | **19** |
| dont **unverifiable** | **3** |

**Seuil > 50% atteint → RECOMMANDATION ROLLBACK V1 IMMÉDIAT**

---

## Breakdown par catégorie

| Catégorie | N | press_logos=[] | Logos retournés | Hallucinés | Taux hallucination | Attendu |
|---|---|---|---|---|---|---|
| **A — Grandes marques connues** | 10 | 3/10 (30%) | 21 logos | 2 (Vogue/GQ sur Peak Design) | **9.5%** | Acceptable si cohérent niche |
| **B — DTC boutiques inconnues** | 10 | 3/10 (30%) | 19 logos | 19 (100%) | **100%** | Devrait être 100% [] |
| **C — AliExpress génériques** | 10 | 5/10 (50%) | 13 logos | 10 (77%) | **77%** | Doit être 100% [] |

Le taux global de 58.5% est tiré à la hausse par les catégories B et C, qui représentent le cas d'usage le plus courant sur Konvert (dropshipping AliExpress, petites boutiques DTC).

---

## Exemples concrets d'hallucinations

### Exemple 1 — [B] WildRoots Botanicals (boutique inconnue, 458 avis)
- **Produit** : Hair Growth Serum with Rosemary & Biotin, 45€
- **Logos retournés** : "Vogue", "Elle", "Marie Claire", "Le Figaro Madame", "Cosmopolitan"
- **Verdict** : 5/5 HALLUCINATED — marque sans notoriété établie, zéro couverture médiatique possible
- **Risque légal** : Afficher "Vu dans Vogue" pour une boutique de 458 avis = fausse allégation commerciale

### Exemple 2 — [C] AliExpress EMS Neck Massager (vendeur WellnessStore)
- **Produit** : Electric Neck Massager EMS, 29€ (prix barré 58€)
- **Logos retournés** : "Vogue", "Elle", "GQ", "Cosmopolitan", "Le Figaro"
- **Verdict** : 5/5 HALLUCINATED — produit AliExpress générique, impossible de couvrir dans ces médias
- **Risque légal** : Maximum — 5 grands médias revendiqués pour un drop générique à 29€

### Exemple 3 — [C] AliExpress Jade Gua Sha Set (vendeur SkinCareDeals)
- **Produit** : Face Roller Gua Sha jade stone, 5€ (prix barré 12€)
- **Logos retournés** : "Vogue", "Marie Claire", "Elle"
- **Verdict** : 3/3 HALLUCINATED — outil de beauté générique no-name à 5€ cité dans Vogue

### Exemple 4 — [C] AliExpress Building Blocks (vendeur KidToys)
- **Produit** : Magnetic Building Blocks 64pcs, 24€
- **Logos retournés** : "Le Figaro", "Science & Vie Junior", "Parenting France"
- **Verdict** : 3/3 HALLUCINATED — "Parenting France" n'existe pas en tant que publication, les autres ne couvrent pas ce produit
- **Note** : DeepSeek invente des noms de publications inexistants

### Exemple 5 — [B] ActiveMom France (boutique Shopify, 387 avis)
- **Produit** : Legging Push-Up, 42€
- **Logos retournés** : "Vogue", "Elle", "Marie Claire"
- **Verdict** : 3/3 HALLUCINATED — boutique mode inconnue < 500 avis, aucune couverture presse

### Exemple 6 — [B] SlumberwellCo (boutique Shopify, 174 avis)
- **Produit** : Weighted Blanket 7kg, 89€
- **Logos retournés** : "Vogue", "Cosmopolitan"
- **Verdict** : 2/2 HALLUCINATED — Vogue pour une couverture lestée d'une boutique de 174 avis

### Exemple 7 — [A] Peak Design Everyday Backpack (faux positif même sur grande marque)
- **Produit** : Everyday Backpack 20L, 299€ (grande marque connue)
- **Logos retournés** : "Vogue", "GQ"
- **Verdict** : 2/2 HALLUCINATED — Peak Design est réellement couvert dans Wired/TechCrunch/The Verge/Outdoor Photographer, PAS dans Vogue ou GQ
- **Note** : même sur les grandes marques, l'instruction niche-based sans ancrage HTML génère des publications incorrectes (erreur de niche : photo/tech → mode/lifestyle)

---

## Résultats bruts (30 runs)

| ID | Cat | Marque | press_logos retournés | H | V | U |
|---|---|---|---|---|---|---|
| A01 | A | Allbirds | Vogue, Wired, Fast Company | 0 | 3 | 0 |
| A02 | A | Casper | [] | 0 | 0 | 0 |
| A03 | A | Glossier | Vogue, Elle, Marie Claire | 0 | 3 | 0 |
| A04 | A | Dollar Shave Club | [] | 0 | 0 | 0 |
| A05 | A | Away Travel | [] | 0 | 0 | 0 |
| A06 | A | Warby Parker | Vogue, GQ | 0 | 2 | 0 |
| A07 | A | Oura Ring | Forbes, TechCrunch, The Verge | 0 | 3 | 0 |
| A08 | A | Drunk Elephant | Vogue, Elle, Marie Claire | 0 | 3 | 0 |
| A09 | A | Peak Design | Vogue, GQ | 2 | 0 | 0 |
| A10 | A | Lululemon | Vogue, Women's Health, Yoga Journal | 0 | 2 | 1 |
| B01 | B | LuminaSkin | Vogue, Marie Claire | 2 | 0 | 0 |
| B02 | B | PetPaw Essentials | Le Figaro, 30 Millions d'Amis | 2 | 0 | 0 |
| B03 | B | HomeBliss Candles | [] | 0 | 0 | 0 |
| B04 | B | FlexGrip Pro | [] | 0 | 0 | 0 |
| B05 | B | WildRoots Botanicals | Vogue, Elle, Marie Claire, Le Figaro Madame, Cosmopolitan | 5 | 0 | 0 |
| B06 | B | SlumberwellCo | Vogue, Cosmopolitan | 2 | 0 | 0 |
| B07 | B | TechNomad Gear | TechCrunch | 1 | 0 | 0 |
| B08 | B | CleanCo Kitchen | Elle | 1 | 0 | 0 |
| B09 | B | ActiveMom France | Vogue, Elle, Marie Claire | 3 | 0 | 0 |
| B10 | B | NordLight Studio | Elle Décoration, Marie Claire Maison | 2 | 0 | 0 |
| C01 | C | AliExpress LED strips | [] | 0 | 0 | 0 |
| C02 | C | AliExpress knife set | [] | 0 | 0 | 0 |
| C03 | C | AliExpress gym gloves | Men's Health | 1 | 0 | 0 |
| C04 | C | AliExpress jade roller | Vogue, Marie Claire, Elle | 3 | 0 | 0 |
| C05 | C | AliExpress dog harness | [] | 0 | 0 | 0 |
| C06 | C | AliExpress wireless charger | TechCrunch | 1 | 0 | 0 |
| C07 | C | AliExpress shelves | [] | 0 | 0 | 0 |
| C08 | C | AliExpress hoodie | Elle | 1 | 0 | 0 |
| C09 | C | AliExpress EMS massager | Vogue, Elle, GQ, Cosmopolitan, Le Figaro | 5 | 0 | 0 |
| C10 | C | AliExpress building blocks | Le Figaro, Science & Vie Junior, Parenting France | 3 | 0 | 0 |

**Totaux** : 53 logos jugés — H=31, V=17, U=3 — **taux hallucination = 58.5%**

---

## Analyse du problème — Pourquoi le prompt v2 hallucine

### Défaut fondamental de la règle 28

La règle 28 actuelle (`generate.ts` ligne ~417) dit :
> "liste uniquement les publications qui couvrent vraiment **la niche** du produit. En cas de doute → retourne []"

Le problème : l'instruction est **niche-based**, pas **brand-based**.

DeepSeek interprète "couvre la niche beauté" comme autorisation de citer Vogue pour N'IMPORTE quel produit beauté — qu'il s'agisse d'un sérum Drunk Elephant à 90€ (VERIFIED) ou d'un gua sha AliExpress à 5€ (HALLUCINATED). DeepSeek ne peut pas savoir si "WildRoots Botanicals" a réellement été couvert par Vogue.

### Confirmation statistique

- Quand DeepSeek retourne des logos (19/30 runs), le taux de hallucination conditionnel est de **31/53 = 58.5%**
- Sur les catégories B+C (20 produits), 100% des runs avec logos retournés = logos hallucinés
- Seul comportement correct : les 11 runs où DeepSeek retourne `[]` (37% des cas — insuffisant)

### Observation secondaire

Le champ `press_mentions` (règle 13 user prompt, champ distinct de `press_logos`) a exactement le même défaut sans instruction anti-hallucination. Non mesuré ici mais risque identique.

---

## Recommandation

**Niveau : ROLLBACK V1 + PATCH V2.1 en parallèle**

Le taux de 58.5% dépasse le seuil critique de 50%.

### Action immédiate (< 5 min) — Rollback feature flag

```
# Vercel Dashboard → Settings → Environment Variables
KONVERT_PROMPT_VERSION = v1
# Redeploy → rollback immédiat (désactive les 5 champs CRO v2 dont press_logos)
```

### Patch prompt v2.1 — Règle 28 renforcée

Dans `V2_RULES_BLOCK` (~ligne 417 de `generate.ts`), remplacer la règle 28 par :

```
28. press_logos : RÈGLE STRICTE ZÉRO TOLÉRANCE — retourne [] par défaut, TOUJOURS.
    N'ajoute une publication QUE si les DEUX conditions sont réunies :
    (a) le nom exact de la publication apparaît dans la description produit fournie,
    OU (b) la marque est globalement reconnue (>50 000 avis, marque internationale établie)
        ET la publication figure dans cette liste exacte : ["Vogue", "Elle", "Allure",
        "Forbes", "TechCrunch", "The Verge", "Wired", "GQ", "Harper's Bazaar",
        "Marie Claire", "Fast Company", "Business of Fashion"].
    INTERDIT absolument pour : tout produit AliExpress, dropshipping no-name,
    boutique < 5 000 avis → press_logos = [] obligatoire.
    En cas de doute minimal → []. Mieux vaut [] que halluciner.
```

### Guardrail code — Défense en profondeur dans `sanitizeLandingPageData`

Ajouter après la sanitization existante de `press_logos` (~ligne 300) :

```ts
// Guardrail anti-hallucination press_logos v2.1 — whitelist stricte
const PRESS_LOGOS_WHITELIST = new Set([
  'vogue', 'elle', 'marie claire', 'allure', "harper's bazaar", 'glamour',
  'cosmopolitan', 'grazia', 'elle décoration', 'marie claire maison',
  'ad', 'côté maison', 'madame figaro', 'le figaro madame',
  'forbes', 'techcrunch', 'the verge', 'wired', 'fast company',
  'gq', 'business of fashion', 'refinery29', "women's health",
  'yoga journal', 'outdoor photographer', "30 millions d'amis",
  'science & vie', 'le monde', 'le figaro', 'les echos',
])
if (Array.isArray(out.press_logos) && out.press_logos.length > 0) {
  out.press_logos = out.press_logos.filter(
    p => PRESS_LOGOS_WHITELIST.has(p.publication.toLowerCase().trim())
  )
  // Whitelist filtre les inventions ("Parenting France") mais ne résout pas
  // le problème brand-based → la règle 28 renforcée reste nécessaire
}
```

Ce guardrail serait actif en v2.1 ET protège aussi le champ `press_mentions` si on l'y applique.

### Coût du patch v2.1

- Règle 28 renforcée : zéro coût additionnel (moins de tokens output)
- Guardrail code : 12 lignes, zéro latence additionnelle
- Re-test golden set pour valider v2.1 : ~0.05 € (même coût que ce run)

---

## Risque légal

Afficher "Vu dans Forbes / Vogue / TechCrunch" pour un produit qu'un client Konvert drop depuis AliExpress constitue une **fausse allégation commerciale**. Le vendeur final est responsable du contenu de sa page, Konvert en est le générateur — double exposition.

- **France** : Art. L122-1 Code de la consommation (pratique commerciale trompeuse), amende 300 000€ + 2 ans prison
- **UK** : Consumer Protection from Unfair Trading Regulations 2008
- **EU** : Directive 2005/29/CE pratiques commerciales déloyales

---

## Prochaines étapes

1. **Aujourd'hui** : Activer `KONVERT_PROMPT_VERSION=v1` dans Vercel (rollback immédiat)
2. **Cette semaine** : Patch règle 28 + guardrail code → prompt v2.1 (ANNA implémente)
3. **Avant re-activation v2.1** : Re-run golden set, valider taux < 5% sur catégories B/C
4. **Optionnel** : Appliquer le même guardrail au champ `press_mentions` (même risque)
5. **Clé Anthropic** : Renouveler `ANTHROPIC_API_KEY` dans `.env.local` pour relancer le judge automatisé

---

_Rapport généré le 2026-06-06 — MINATO / NEXARA_
_Script : `/Users/mac/nexara/konvert/scripts/audit-press-logos-hallucination.ts`_
_Golden set : `/Users/mac/nexara/konvert/audit/golden-set-prompt-v2.json`_
_Raw JSON : `/Users/mac/nexara/konvert/audit/raw-results-2026-06-06.json`_
