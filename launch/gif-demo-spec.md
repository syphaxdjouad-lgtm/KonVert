# KONVERT — Spec GIF démo 8-12 secondes
# Launch ProductHunt — mardi 2 juin 2026 07h01 Paris
# Produit par SHISUI — NEXARA Production Vidéo & 3D
# Dernière mise à jour : 30 mai 2026

---

## DÉCISION FINALE — OPTION B (Screen Record + Gifski)

**Raison :** Deadline dimanche 31 mai 18h. Option A (Remotion) nécessite 4-6h de dev React pour un résultat propre — risque d'impasse sous délai serré. Option B livre un GIF réaliste du vrai produit en 1h, avec contrôle total sur la séquence. Option C (IA générative) exclue — GIF démo = le vrai produit, pas une simulation synthétique.

**Avantage décisif d'Option B pour PH :** le GIF montre le produit réel — pas une maquette. La communauté PH détecte immédiatement les démos "fake". Un screen record propre du vrai /essai = crédibilité maximale.

---

## SPECS TECHNIQUES — FICHIER FINAL

| Paramètre | Valeur cible | Rationale |
|---|---|---|
| Format principal | **MP4 H.264 silent loop** | PH accepte MP4 autoplay, taille < GIF pour qualité équivalente |
| Format alternatif | GIF (si MP4 refusé sur Twitter) | Twitter supporte GIF natif, jusqu'à 15 Mo |
| Durée | **10 secondes** (8-12 acceptable) | Loop parfait — retour fluide frame finale → frame initiale |
| Dimensions principales | **1280×720** (16:9) | PH cover + Twitter card + LinkedIn |
| Dimensions Twitter | **600×338** (16:9 scaled) | Twitter GIF optimisé taille |
| Frame rate GIF | **20fps** | Compromis qualité/taille — 24fps = trop lourd, 15fps = trop saccadé |
| Frame rate MP4 | **30fps** | Standard web |
| Palette GIF | **256 couleurs** | Maximum GIF standard |
| Taille GIF max | **< 8 Mo** (limite PH) | Vérifier avec `ls -lh` avant upload |
| Taille MP4 max | **< 5 Mo** | Pour Twitter et PH |
| Son | **Aucun** — silent loop | Autoplay sans son sur tous les réseaux |
| Loop | **Seamless** — frame finale = frame initiale | Retour au champ vide après le reveal |
| Fond | **Blanc / off-white** — couleur brand Konvert | Cohérence DA |
| Texte superposé | **Aucun** — l'action parle | Spec NARUTO section 6 : "no text overlay" |

---

## SCÉNARIO FRAME-BY-FRAME

### Séquence complète (10 secondes)

```
00.0s  Champ URL vide — curseur visible, clignotant
       État initial — fond blanc, interface /essai propre

00.5s  Clic dans le champ (animation curseur)
       Curseur positionné dans l'input

01.0s  Paste de l'URL (Cmd+V)
       URL AliExpress ou Amazon apparaît dans le champ
       → URL test : produit visuel (montre, gadget, accessoire)

02.0s  Hover sur bouton "Générer" (cursor sur le bouton)
       Légère montée du curseur vers le CTA

02.5s  Clic bouton "Générer"
       Feedback visuel du clic (button state active)

02.7s  Loading state activé
       Spinner ou barre de progression — élégant
       [conserver 3-4s de loading = crédible, pas de magie instantanée]

06.5s  Page générée — slide-up ou fade-in
       La page complète apparaît progressivement

07.0s  Scroll lent — Section 1 visible
       Hero / Hook de la page générée (titre accrocheur)

08.0s  Scroll — Section 2 visible
       Bullets conversion ou social proof

09.0s  Scroll — Section 3 visible
       FAQ ou CTA final de la page générée

09.5s  Zoom-out léger + fade
       Retour progressif vers l'état initial — champ URL vide

10.0s  LOOP → retour frame 00.0s
       Le champ est à nouveau vide, curseur clignotant
```

### Timing map résumé

| Secondes | Action | Durée segment |
|---|---|---|
| 0.0 → 1.0 | Champ vide → curseur dans champ | 1.0s |
| 1.0 → 2.5 | URL collée → hover bouton | 1.5s |
| 2.5 → 2.7 | Clic "Générer" | 0.2s |
| 2.7 → 6.5 | Loading spinner | 3.8s |
| 6.5 → 9.5 | Page révélée + scroll 3 sections | 3.0s |
| 9.5 → 10.0 | Fade back → loop | 0.5s |

---

## WORKFLOW CAPTURE DÉTAILLÉ — OPTION B

### Étape 1 — Préparation (15 min)

**URL test à préparer :**
Choisir un produit AliExpress ou Amazon avec :
- Images produit propres (pas de fond maquette chinois)
- Titre descriptif (pas "2023 NEW HOT SALE 1PC")
- Catégorie lisible (montre, casque audio, objet de bureau)

Exemple type URL AliExpress (structure) :
```
https://www.aliexpress.com/item/[ID-PRODUIT].html
```

**Copier cette URL dans le presse-papier avant l'enregistrement.**

**Navigateur :**
- Chrome, fenêtre maximisée, zoom 100%
- Aller sur `konvertpilot.com/essai`
- Vérifier que le champ est bien vide, le bouton "Générer" visible
- Désactiver toutes les extensions (barre d'extensions Chrome masquée)
- Activer le mode Ne Pas Déranger macOS

---

### Étape 2 — Capture écran (30 min)

**Outil : Loom ou QuickTime Player**

Option Loom (plus simple) :
1. Loom Desktop → "Record Screen" → "Full Screen"
2. Webcam OFF, micro OFF
3. Résolution : 1920×1080
4. Enregistrer → jouer la séquence scénario ci-dessus manuellement
5. Faire 2-3 prises — garder la plus propre
6. Trim début/fin dans Loom
7. Télécharger MP4

Option QuickTime (backup, 0 install) :
1. QuickTime Player → Fichier → Nouvel enregistrement d'écran
2. Options → Micro : Aucun
3. Enregistrer la zone : "Enregistrement de l'écran entier"
4. Jouer la séquence
5. Arrêter → Sauvegarder comme MOV
6. Convertir MOV → MP4 avec ffmpeg (commande ci-dessous)

```bash
# Convertir MOV QuickTime en MP4
ffmpeg -i ~/Desktop/capture_konvert.mov \
  -c:v libx264 -crf 18 -preset slow \
  -an \
  -movflags +faststart \
  /Users/mac/nexara/images/videos/konvert/hero/konvert_gif-source_16x9_10s_v1_20260601.mp4
```

---

### Étape 3 — Trim + Speedup (15 min)

**Objectif :** obtenir exactement 10 secondes de séquence propre.

**Via ffmpeg (gratuit, en ligne de commande) :**

```bash
# Trim la capture brute entre les timestamps start et end
ffmpeg -i input_raw.mp4 \
  -ss 00:00:02.5 \
  -to 00:00:13.5 \
  -c:v libx264 -crf 18 \
  -an \
  /Users/mac/nexara/images/videos/konvert/hero/konvert_gif-source-trimmed_16x9_10s_v1_20260601.mp4
```

Ajuster `-ss` (start) et `-to` (end) selon la capture réelle.

**Via iMovie (si pas à l'aise avec ffmpeg) :**
1. Importer le MP4 dans iMovie
2. Couper le clip aux bons timestamps
3. Exporter → MP4 4K ou 1080p

---

### Étape 4 — Conversion MP4 → GIF via Gifski (20 min)

**Gifski = meilleur convertisseur GIF sur Mac, gratuit, open source**

**Installation Gifski :**
```bash
# Via Homebrew
brew install gifski

# Vérification
gifski --version
```

**Alternative si Homebrew absent :**
- Télécharger l'app Mac depuis gifski.app (Mac App Store, gratuit)
- Drag & drop le MP4 → régler les paramètres → export GIF

**Workflow ligne de commande (recommandé pour contrôle taille) :**

```bash
# Étape 4a : Extraire les frames du MP4 trimmed
mkdir /tmp/konvert-frames
ffmpeg -i /Users/mac/nexara/images/videos/konvert/hero/konvert_gif-source-trimmed_16x9_10s_v1_20260601.mp4 \
  -vf "fps=20,scale=1280:720:flags=lanczos" \
  /tmp/konvert-frames/frame%04d.png

# Étape 4b : Assembler le GIF avec Gifski
gifski \
  --fps 20 \
  --quality 85 \
  --width 1280 \
  --output /Users/mac/nexara/images/videos/konvert/hero/konvert_gif-demo_1280x720_10s_v1_20260601.gif \
  /tmp/konvert-frames/frame*.png

# Vérifier la taille
ls -lh /Users/mac/nexara/images/videos/konvert/hero/konvert_gif-demo_1280x720_10s_v1_20260601.gif
```

**Si GIF > 8 Mo — réduire la taille :**

```bash
# Option 1 : Réduire la qualité Gifski (80 → 70 → 60)
gifski --fps 20 --quality 70 --width 1280 \
  --output /Users/mac/nexara/images/videos/konvert/hero/konvert_gif-demo_1280x720_10s_v2_20260601.gif \
  /tmp/konvert-frames/frame*.png

# Option 2 : Réduire la résolution (1280 → 960 → 800)
gifski --fps 20 --quality 80 --width 960 \
  --output /Users/mac/nexara/images/videos/konvert/hero/konvert_gif-demo_960x540_10s_v1_20260601.gif \
  /tmp/konvert-frames/frame*.png

# Option 3 : Réduire le fps (20 → 15)
ffmpeg -i source.mp4 -vf "fps=15,scale=1280:720:flags=lanczos" /tmp/konvert-frames-15fps/frame%04d.png
gifski --fps 15 --quality 80 --width 1280 \
  --output /Users/mac/nexara/images/videos/konvert/hero/konvert_gif-demo_1280x720_10s_15fps_v1_20260601.gif \
  /tmp/konvert-frames-15fps/frame*.png
```

**Cible de taille progressive :**
- Première tentative : quality 85, fps 20, 1280px → mesurer
- Si > 8 Mo : quality 75, fps 20, 1280px
- Si > 8 Mo : quality 75, fps 15, 1280px
- Si > 8 Mo : quality 75, fps 15, 960px → presque certain d'être < 8 Mo

---

### Étape 5 — Export MP4 Silent Loop (15 min)

MP4 silent loop pour PH (meilleure qualité que GIF pour même taille) :

```bash
ffmpeg -i /Users/mac/nexara/images/videos/konvert/hero/konvert_gif-source-trimmed_16x9_10s_v1_20260601.mp4 \
  -c:v libx264 -crf 20 -preset slow \
  -vf "scale=1280:720" \
  -an \
  -movflags +faststart \
  -loop 0 \
  /Users/mac/nexara/images/videos/konvert/hero/konvert_gif-demo_1280x720_10s_v1_20260601.mp4
```

Vérifier taille :
```bash
ls -lh /Users/mac/nexara/images/videos/konvert/hero/
```

---

### Étape 6 — Vérification loop seamless (10 min)

**Test loop seamless :**
1. Ouvrir le GIF dans un navigateur (drag & drop dans Chrome) → regarder le loop 3-4 fois
2. La transition frame finale → frame initiale doit être fluide (pas de flash blanc ou saut brutal)
3. Si le loop n'est pas clean : ajouter un fade-to-white à la fin (0.5s) qui correspond au fade-from-white au début

**Ajouter fade in/out pour loop propre si nécessaire :**

```bash
# Ajouter fade-in 0.3s au début + fade-out 0.5s à la fin avant conversion GIF
ffmpeg -i source-trimmed.mp4 \
  -vf "fade=t=in:st=0:d=0.3,fade=t=out:st=9.5:d=0.5" \
  -an \
  source-faded.mp4
```

Relancer ensuite l'extraction frames + Gifski sur `source-faded.mp4`.

---

## OUTILS À INSTALLER CÔTÉ SYPHAX

| Outil | Installation | Temps install | Gratuit |
|---|---|---|---|
| **Gifski** | `brew install gifski` ou gifski.app Mac App Store | 2 min | Oui |
| **Homebrew** (si absent) | `/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"` | 5 min | Oui |
| **ffmpeg** | `brew install ffmpeg` | 3-5 min | Oui |
| **Loom Desktop** | loom.com/download | 2 min | Oui (free tier) |
| QuickTime Player | Déjà installé sur Mac | 0 min | Oui |

**Vérifier si ffmpeg et Gifski sont déjà installés :**
```bash
ffmpeg -version && gifski --version
```

---

## NAMING FICHIERS FINAUX

| Fichier | Chemin | Usage |
|---|---|---|
| Source brute | `/Users/mac/nexara/images/videos/konvert/hero/konvert_gif-source_16x9_10s_v1_20260601.mp4` | Archive — ne pas supprimer |
| Source trimmed | `/Users/mac/nexara/images/videos/konvert/hero/konvert_gif-source-trimmed_16x9_10s_v1_20260601.mp4` | Base pour conversion |
| GIF 1280px | `/Users/mac/nexara/images/videos/konvert/hero/konvert_gif-demo_1280x720_10s_v1_20260601.gif` | Upload PH cover + LinkedIn |
| MP4 silent loop | `/Users/mac/nexara/images/videos/konvert/hero/konvert_gif-demo_1280x720_10s_v1_20260601.mp4` | PH vidéo embed + Twitter |
| GIF 600px Twitter | `/Users/mac/nexara/images/videos/konvert/hero/konvert_gif-demo_600x338_10s_v1_20260601.gif` | Twitter thread tweet 1 |

---

## WORKFLOW UPLOAD PH — ÉTAPE PAR ÉTAPE

### Où va le GIF sur PH

ProductHunt permet d'uploader des GIFs dans la galerie media de ta page produit (les "Screenshots"). Les GIFs s'autoplaylent dans la galerie — c'est l'emplacement le plus visible.

**Position recommandée :** Media asset #1 (premier screenshot) — c'est le thumbnail visible avant que l'utilisateur clique.

### Upload procédure (J0, avant 07h01)

```
1. Ouvrir admin PH de ta page produit (producthunt.com/posts/manage)
2. Section "Media" → "Add image / GIF"
3. Uploader le GIF 1280×720 (< 8 Mo)
4. S'assurer qu'il est en position 1 dans la galerie (drag & drop)
5. Uploader aussi le Hero Before/After image (HINATA) en position 2-3
6. Save + Preview → vérifier que le GIF autoplay dans la preview
```

### Upload Twitter (thread tweet 1)

```
1. Composer le tweet 1 du thread (voir soft-launch-multi-canal.md pour le thread)
2. Attacher le GIF 600×338 via le bouton "Image" de Twitter
3. Twitter accepte GIF jusqu'à 15 Mo — notre cible est < 5 Mo donc OK
4. Vérifier le preview autoplay dans l'éditeur Twitter avant de poster
```

### Upload first comment PH (embed GIF)

PH first comment ne supporte pas les images directement. Utiliser plutôt :
- Une URL vers le GIF hébergé (GitHub raw URL ou Cloudinary free tier)
- Ou une image via imgur.com (upload gratuit, lien direct)

```
1. Uploader le GIF sur imgur.com (gratuit, pas de compte requis)
2. Copier le lien direct du GIF (format: i.imgur.com/XXXXX.gif)
3. Insérer dans le first comment si PH Markdown le supporte
   (Note: PH comments acceptent les images via markdown: ![alt](url))
```

---

## AUTO-EVAL GIF — CHECKLIST AVANT LIVRAISON

| Critère | Cible | Statut |
|---|---|---|
| Loop seamless | Transition finale → initiale invisible | A valider |
| Taille GIF | < 8 Mo | A vérifier `ls -lh` |
| Taille MP4 | < 5 Mo | A vérifier `ls -lh` |
| Fond propre | Blanc / off-white — pas de fond gris Chrome visible | A valider |
| Interface KONVERT | Propre (pas d'extensions Chrome visibles, barre bookmarks masquée) | A valider avant capture |
| Séquence complète | Tous les 6 états du scénario visibles | A valider lecture |
| Texte superposé | Aucun | Spécification confirmée |
| Scroll fluide | Pas de saut, pas de scroll trop rapide | A valider |
| Loading crédible | 3-4s minimum visible | A valider |
| Résolution | ≥ 1280×720 | `ffprobe output.gif` |

---

## RISQUES IDENTIFIÉS — GIF

| Risque | Probabilité | Mitigation |
|---|---|---|
| GIF > 8 Mo premier essai | Élevée | Réduire quality (85→70→60) ou fps (20→15) ou résolution (1280→960) |
| Loop pas seamless | Moyenne | Ajouter fade-in/out 0.3s au début et à la fin de la source |
| Chrome barre bookmarks visible | Élevée | Masquer barre bookmarks avant capture (Cmd+Shift+B dans Chrome) |
| Scroll trop rapide dans la capture | Moyenne | Faire la capture lentement — on peut toujours accélérer en post, pas ralentir |
| Loading trop court (<2s) | Faible | Avoir l'URL test prête — si loading < 2s, utiliser une URL plus complexe |
| Interface KONVERT change avant le 2 juin | Très faible | Capturer au plus tôt (dimanche 1er juin matin) pour avoir la version live finale |

---

## RÉCAPITULATIF PLANNING DIMANCHE 31 MAI

| Heure | Action | Durée estimée |
|---|---|---|
| 14h00 | Installation outils (Gifski, ffmpeg si absent) | 15 min |
| 14h15 | Préparation : URL test, Chrome propre, Loom config | 15 min |
| 14h30 | 3 prises capture écran /essai | 30 min |
| 15h00 | Trim + export MP4 propre | 15 min |
| 15h15 | Conversion GIF Gifski + ajustement taille | 30 min |
| 15h45 | Test loop + validation checklist | 15 min |
| 16h00 | Export MP4 silent loop | 15 min |
| 16h15 | Livré — GIF + MP4 dans `/videos/konvert/hero/` | — |

Marge de 1h45 avant la deadline de 18h.
