# Benchmark sections page produit DTC par catégorie — 2026-07-27

Sources : pages produit réelles scrapées via Firecrawl le 27/07/2026. Vocabulaire de sections imposé : `hero, social_proof, why, features, materials, how_it_works, before_after, comparison, reviews, press, faq, guarantee, story, gallery`.

---

## electronics

Sources analysées : Anker Prime Power Bank (20K, 220W) — anker.com/products/a110b-anker-prime-20k-220w-power-bank ; Nothing Ear (3) — us.nothing.tech/products/ear-3

| | |
|---|---|
| **recommended** | hero, features, comparison, social_proof, reviews, faq, guarantee |
| **discouraged** | before_after, story, materials, gallery, press |
| **min / max** | 6 / 8 — premium (prix élevé, ex. power bank 220W multi-port) → max = 8 |

Justifications :
- **features** : Anker structure une section "Overview" en blocs de bénéfices fonctionnels (Prime Charging Anywhere, Smart Power Delivery, Full Control via App, Safe Charging All Day) + un bloc "Key Features" dès le hero.
- **comparison** : Anker publie un tableau de compatibilité complet (For Laptops / For Phones / For Tablets / Other Devices) et une table de spécifications (capacité, input, output, dimensions, poids) — c'est le vrai équivalent d'un comparatif pour ce type de produit.
- **social_proof / reviews** : le compteur d'avis (46 reviews) est affiché juste sous le nom du produit, avant toute autre preuve ; Nothing Ear (3) garde un hero minimal (nom, 3 specs clés, prix, add to bag) — la preuve attendue est la spec, pas le récit.
- **faq** : la FAQ Anker est orientée troubleshooting (pairing Bluetooth, mise à jour firmware, vitesse de charge), pas lifestyle.
- **guarantee** : badges "30-Day Money-Back Guarantee" et "Hassle-Free Warranty" visibles près du CTA.
- **discouraged before_after / story** : aucun bloc de transformation ni de récit fondateur sur les deux pages — l'électronique se vend sur la spec et la certification, pas la narration.
- **discouraged materials / gallery** : pas de section "de quoi c'est fait" ni galerie éditoriale lifestyle ; les images restent des plans produit studio.

---

## skincare

Source analysée : The Ordinary Niacinamide 10% + Zinc 1% — theordinary.com/en-us/niacinamide-10-zinc-1-serum-100436.html (Typology et Paula's Choice indisponibles au scrape, 404)

| | |
|---|---|
| **recommended** | hero, materials, how_it_works, before_after, reviews, faq, press, guarantee |
| **discouraged** | comparison, story, gallery |
| **min / max** | 7 / 9 — premium (sérum/traitement complexe multi-actifs) → max = 9 |

Justifications :
- **materials** : "Key ingredients" (Niacinamide, Zinc PCA) affiché dès le hero, avant même l'Overview, plus un "Formulation Compatibility Tool" dédié aux interactions d'ingrédients.
- **how_it_works** : bloc "How to Use" avec étapes précises (application AM/PM, patch test) — la routine est un argument de vente central.
- **before_after** : bloc "Testing Shows" avec claims chiffrés (réduit l'excès de sébum en 3 jours, visibilité des pores en 4 semaines) — c'est la catégorie où before_after est le plus fort, même sans photo, via la preuve clinique quantifiée.
- **reviews** : système d'avis filtrable très dense (2795 avis, filtres par type de peau/concern/carnation/âge).
- **faq** : bloc "Niacinamide 10% + Zinc 1% FAQs" dédié.
- **press** : "Awards & Features" avec logos SheerLuxe Beauty Awards 2023 et Boots Beauty Awards 2022.
- **guarantee** : "365 day returns" affiché près du bouton d'achat.
- **discouraged comparison** : pas de tableau spec-vs-concurrent ; le seul "comparatif" est l'outil de compatibilité d'ingrédients, pas un argument de vente comparatif.
- **discouraged story / gallery** : aucun bloc récit fondateur ni galerie lifestyle éditoriale sur la page produit elle-même.
- Même un sérum "budget" à 6$ porte déjà 7+ de ces blocs car la promesse skincare exige une preuve lourde (sécurité cutanée) → min = 7.

---

## cosmetics

Sources analysées : Rare Beauty Soft Pinch Liquid Blush — rarebeauty.com/products/soft-pinch-liquid-blush ; Glossier Cloud Paint Duo — glossier.com/products/cloud-paint-duo

| | |
|---|---|
| **recommended** | hero, gallery, materials, how_it_works, social_proof, reviews, press, faq |
| **discouraged** | before_after, comparison, story |
| **min / max** | 6 / 8 — premium (kit/palette prestige) → max = 8 |

Justifications :
- **gallery** : grille de teintes + section UGC "This is Your Community" chez Rare Beauty ; carrousel "Get the Look" chez Glossier.
- **materials** : "What's in it?" (Botanical Blend lotus/gardénia/nénuphar) chez Rare Beauty ; "Key ingredients" (Collagen, Smooth-Gel Texture) chez Glossier.
- **how_it_works** : bloc "How to use" détaillé (applicateur doe-foot, étapes de blending) chez Rare Beauty.
- **press / social_proof** : citation "Why Selena Loves It" (Selena Gomez) qui fait office de press/endorsement, plus la note 4.8 (4949 avis) affichée en tout début de page.
- **faq** : bloc "Blush FAQs" dédié chez Rare Beauty.
- **discouraged before_after** : aucune photo/claim de transformation sur les deux pages — le maquillage s'applique et se juge à l'instant, pas sur une temporalité.
- **discouraged comparison** : aucun tableau de spec comparatif.
- **discouraged story** : pas de bloc origine-fondateur injecté dans la page produit (le storytelling de marque vit ailleurs sur le site).
- Glossier (kit simple à 38$) ne mobilise qu'environ 6 sections → min = 6. Rare Beauty, plus riche en contenu, en mobilise 8 → max = 8 pour le haut de gamme.

---

## supplements

Source analysée : AG1 Next Gen Pouch — drinkag1.com/products/greens-powder-pouch (Oura non scrapé)

| | |
|---|---|
| **recommended** | hero, social_proof, comparison, materials, before_after, how_it_works, faq, guarantee |
| **discouraged** | story, gallery, press |
| **min / max** | 6 / 9 — premium (abonnement clinique $79-99/mois) → max = 9 |

Justifications :
- **social_proof** : bandeau "60,000+ verified 5-star reviews" placé immédiatement sous le hero, avant tout autre contenu.
- **comparison** : tableau explicite "AG1 is a more-in-one solution" opposant AG1 à Multivitamins / Probiotics / Greens sur 7 attributs — la preuve de comparaison la plus explicite de tout le benchmark.
- **materials** : détail des ingrédients par catégorie (vitamines & minéraux, pré/probiotiques, adaptogènes, antioxydants, superfoods & champignons) + lien "View Supplement Facts".
- **before_after** : bloc "Formulated for your body. Clinically backed." avec stats chiffrées (+70% folate RBC, +73% vitamine C, x10 bactéries intestinales).
- **how_it_works** : "How to use" (dose + eau) — instructions de préparation.
- **faq** : bloc FAQ de 9 questions (pertinence, délai d'effet, saveurs).
- **guarantee** : "90-day money-back guarantee", "Pause or cancel anytime".
- **discouraged story / gallery / press** : aucun récit fondateur, aucune galerie lifestyle éditoriale, aucun bandeau logos presse externe sur cette page — la confiance passe par la donnée clinique et les certifs (NSF), pas la narration.
- Un supplément mono-ingrédient bas de gamme (ex. flacon magnésium à 15$) n'aurait besoin que de hero+features+materials+reviews+faq+guarantee → min = 6.

---

## jewelry

Sources analysées : Mejuri Thin Dôme Ring — mejuri.com/shop/products/thin-dome-ring ; Mejuri Lotus Necklace — mejuri.com/products/lotus-necklace (Ana Luisa indisponible, 404)

| | |
|---|---|
| **recommended** | hero, materials, story, gallery, social_proof, guarantee, reviews, faq |
| **discouraged** | comparison, before_after, features |
| **min / max** | 6 / 8 — premium (pièce fine, or massif) → max = 8 |

Justifications :
- **materials** : accordéon "Materials & Specifications" détaillant la pureté de l'or/le taux de recyclé et des specs au millimètre (largeur du bandeau, du chaton) — sur les deux produits.
- **story** : accordéon "Sustainability" dédié racontant les "2030 Sustainability Goals" et le "Mejuri Empowerment Fund" — c'est la preuve la plus nette de section story de tout le benchmark.
- **gallery** : images multiples on-figure/off-figure (porté à l'oreille/au cou vs. à plat) plutôt qu'un plan produit unique.
- **guarantee** : accordéon "Shipping, Returns & Warranty" explicite (garantie 2 ans, retours 30 jours).
- **social_proof / reviews** : note affichée directement sous le nom du produit (4.6).
- **discouraged comparison** : aucun tableau spec-vs-concurrent — le bijou se vend sur l'émotion/l'artisanat, pas le benchmark.
- **discouraged before_after** : non applicable à un objet fini.
- **discouraged features** : Mejuri remplace la liste de features fonctionnelles par un texte descriptif court ("We made a thin and light version...") — le registre "feature bullet" est absent, remplacé par materials + story.
- Une pièce simple du quotidien (~100$) n'a besoin que de hero+materials+guarantee+reviews+faq+gallery → min = 6.

---

## apparel

Sources analysées : Gymshark Flex High Waisted Leggings — gymshark.com/products/gymshark-flex-high-waisted-leggings-black-aw21 ; Allbirds (messaging matériaux constaté via allbirds.com, page produit spécifique bloquée)

| | |
|---|---|
| **recommended** | hero, social_proof, materials, gallery, reviews, faq, guarantee |
| **discouraged** | before_after, comparison, story |
| **min / max** | 5 / 8 — premium (pièce "considered"/durable type Allbirds) → max = 8 |

Justifications :
- **social_proof** : Gymshark affiche la note (4.2, 1007 avis) et un badge "true to size" directement sous le nom du produit, avant toute description.
- **materials** : notes d'attributs spécifiques au tissu (Sizing, Value, Length, Comfort, Squat-Proof) chez Gymshark ; messaging matières omniprésent chez Allbirds ("Merino wool", "eucalyptus tree fiber", "sugarcane").
- **gallery** : bloc "Get The Look" en cross-sell stylé chez Gymshark.
- **reviews** : système d'avis filtrable riche (âge, fréquence d'entraînement, taille, activité).
- **guarantee** : seuil de livraison gratuite + accordéon Delivery & Returns.
- **discouraged before_after / comparison** : aucune photo de transformation, aucun tableau spec-vs-concurrent sur les deux pages.
- **discouraged story** : le narratif de marque n'est pas injecté dans la page produit elle-même ; le message durabilité d'Allbirds reste dans le copy matériaux, pas un bloc story séparé.
- Une pièce basique (chaussette/t-shirt à 15-18$) ne nécessite que hero+social_proof+reviews+guarantee+faq → min = 5.

---

## home

Source analysée : Our Place Ceramic Nonstick Always Pan 10.5" — fromourplace.com/products/always-essential-cooking-pan (Brooklinen non scrapé)

| | |
|---|---|
| **recommended** | hero, why, features, materials, how_it_works, guarantee, social_proof, reviews, faq |
| **discouraged** | before_after, comparison, story, press |
| **min / max** | 6 / 9 — premium (cookware multifonction $135-360) → max = 9 |

Justifications :
- **why** : Our Place titre littéralement une section "Why You'll Love It".
- **features** : bloc "10 Functions, 1 Pan" et "Complete Versatility" en démonstration fonctionnelle.
- **materials** : accordéon "Non-Toxic Materials" + section "Ceramic Nonstick Always Pan Up Close" (aluminium recyclé, coating Thermakind sans PFAS).
- **how_it_works** : le tour des dix fonctions (Roast/Strain/Serve/Saute/Sear/Bake/Braise/Steam/Fry/Boil) fait office de mode d'emploi explicite.
- **guarantee** : trois badges de confiance juste sous le prix ("3-Year Warranty", "100-Day Trial", "Free Shipping & Returns").
- **social_proof / reviews** : note 4.6 / 40 249 avis affichée immédiatement, plus un bandeau de tags "See what people think!".
- **faq** : accordéon "Frequently Asked Questions" dédié.
- **discouraged before_after / comparison / story / press** : aucune photo de transformation, aucun tableau vs-concurrent, aucun récit fondateur, aucun bandeau logos presse sur cette page — la confiance se construit entièrement via démonstration fonctionnelle + avis + garantie.
- Un article home basique mono-fonction (torchon, ustensile à 20$) ne nécessite que hero+features+materials+reviews+faq+guarantee → min = 6.

---

## universal (fallback prudent)

| | |
|---|---|
| **recommended** | hero, features/why, social_proof, reviews, faq, guarantee |
| **discouraged** | (aucun — socle générique, pas d'exclusion a priori) |
| **min / max** | 6 / 9 |

`hero`, `reviews` et `faq` sont quasi universels sur l'ensemble des 7 catégories analysées — ils apparaissent sur chacune des pages scrapées sans exception. `universal` reste le socle prudent pour tout ProductType non catégorisé ou ambigu.

---

## Tableau récap

| Catégorie | recommended (count) | discouraged | min | max |
|---|---|---|---|---|
| electronics | 7 | before_after, story, materials, gallery, press | 6 | 8 |
| skincare | 8 | comparison, story, gallery | 7 | 9 |
| cosmetics | 8 | before_after, comparison, story | 6 | 8 |
| supplements | 8 | story, gallery, press | 6 | 9 |
| jewelry | 8 | comparison, before_after, features | 6 | 8 |
| apparel | 7 | before_after, comparison, story | 5 | 8 |
| home | 9 | before_after, comparison, story, press | 6 | 9 |
| universal | 6 | (aucun) | 6 | 9 |
