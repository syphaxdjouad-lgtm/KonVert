# Editor V2 — Specs Design UI Premium
**Date :** 2026-05-26  
**Statut :** specs finales, mockup livré  
**Référence :** `etec-natural.ts` — palette, typo, DA cohérents  
**Mockup :** `.mockups/editor-v2.html`

---

## 1. Diagnostic V1 — Pourquoi ça floppait

| Problème V1 | Impact perçu |
|---|---|
| Sidebar foncée permanente `bg-gray-900` 48px | Chrome "developer tool", pas un éditeur produit premium |
| Emojis `📑🧩🎨⚙️👁🗑⋮⋮` | Cheap, aliased sur Retina, incohérent avec une DA Natural |
| PanelLeft 320px permanent | Preview écrasée, contenu principal relégué |
| Sélection `bg-purple-50 border-purple-500` | Violette criarde sur fond sable/blanc — clash DA |
| Concept passif | L'user voit une liste, pas son site. Pas de lien visuel preview ↔ panneau |
| Pas de hierarchy visuelle | Tous les rows ont le même poids visuel |

**Principe directeur V2 :** l'éditeur s'efface derrière le contenu. L'interface n'existe que quand l'user en a besoin. La preview est le centre. Le panneau est invité, jamais imposé.

---

## 2. Design System

### 2.1 Palette — cohérence stricte etec-natural

```css
:root {
  /* ── BACKGROUNDS ── */
  --bg-app:          #FAFAF7;   /* off-white warm — fond global éditeur */
  --bg-panel:        #FFFFFF;   /* blanc pur — panneau slide-in */
  --bg-row-hover:    #FAFAF7;   /* fond row au survol */
  --bg-row-active:   #F5F1EB;   /* fond row sélectionnée — sable clair */
  --bg-topbar:       #FFFFFF;   /* topbar blanche */
  --bg-preview:      #F0EDE8;   /* zone preview — sable légèrement plus profond */

  /* ── TEXTE ── */
  --text-primary:    #2D2D2D;   /* charcoal — jamais noir pur */
  --text-muted:      #8B8680;   /* gris chaud — labels secondaires */
  --text-disabled:   #C4BFB9;   /* sections masquées */

  /* ── BORDURES ── */
  --border-panel:    #EDE8DF;   /* sable — bord panneau */
  --border-subtle:   #DDD8CF;   /* bord rows inactives */
  --border-active:   #A8B5A0;   /* sage — left-border row sélectionnée */

  /* ── ACCENT ── */
  --accent-sage:     #A8B5A0;   /* vert sauge — CTA principal, highlight */
  --accent-terra:    #C8A887;   /* terre — accent chaud secondaire */
  --accent-sage-bg:  #EEF2EC;   /* sage très clair — badges */

  /* ── SHADOWS ── */
  --shadow-panel:    0 4px 24px rgba(0, 0, 0, 0.04), 0 1px 4px rgba(0, 0, 0, 0.03);
  --shadow-fab:      0 2px 12px rgba(0, 0, 0, 0.06), 0 1px 4px rgba(0, 0, 0, 0.04);
  --shadow-tooltip:  0 4px 16px rgba(0, 0, 0, 0.08);

  /* ── HIGHLIGHT PREVIEW (click-to-edit) ── */
  --highlight-hover:    rgba(168, 181, 160, 0.18);  /* sage 18% opacity — hover dashed */
  --highlight-selected: rgba(168, 181, 160, 0.22);  /* sage 22% — sélection */
  --outline-hover:   #A8B5A0;   /* sage — outline hover 1px dashed */
  --outline-selected:#A8B5A0;   /* sage — outline selected 2px solid */
}
```

**Choix accent : sage `#A8B5A0` > terra `#C8A887`**  
Le sage est un vert désaturé — il indique l'état actif sans agresser. Le terra est réservé aux accents éditoriaux dans la landing (blockquote, numérotation). Utiliser les deux pour l'UI créerait une dissonance.

### 2.2 Typographie

```css
/* Import */
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@1,400&family=Inter:wght@400;500;600&display=swap');

/* Scale */
--font-ui-sm:     Inter, 12px, weight 400   /* labels disabled, meta */
--font-ui-base:   Inter, 13px, weight 400   /* body UI, descriptions */
--font-ui-label:  Inter, 13px, weight 500   /* labels actifs, topbar items */
--font-ui-section:Inter, 14px, weight 600   /* noms de sections dans le panel */
--font-panel-title:Inter, 15px, weight 600  /* "Sections" header du panel */
--font-topbar-brand: Playfair Display, 16px, italic, weight 400  /* nom landing */

/* Line-heights */
--lh-ui: 1.4      /* éléments UI courts */
--lh-body: 1.6    /* texte plus long */
```

**Rationale :** Playfair Display italic uniquement pour le nom du produit dans la topbar — ça rappelle que l'user édite une landing premium, pas un dashboard SaaS. Tout le reste Inter pour la clarté.

### 2.3 Espacements — base 4px

```
4px   — micro (gap entre icône et label inline)
8px   — intra-composant (padding interne rows)
12px  — padding vertical rows
16px  — padding horizontal panel
20px  — gap entre éléments moyens
24px  — padding topbar vertical
32px  — section gap dans le panel
44px  — taille minimum touch target (FAB, boutons topbar)
```

### 2.4 Animations

```css
/* Panel slide-in */
--anim-panel: transform 280ms cubic-bezier(0.4, 0, 0.2, 1);

/* Section highlight preview */
--anim-highlight: outline-color 200ms ease, background-color 200ms ease;

/* Boutons hover */
--anim-btn: opacity 150ms ease, transform 150ms ease;

/* Tooltip apparition */
--anim-tooltip: opacity 180ms ease, transform 180ms ease;

/* Row hover */
--anim-row: background-color 120ms ease;

/* FAB hover */
--anim-fab: transform 200ms cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 200ms ease;
```

**Philosophie motion : Emil Kowalski (restraint)**  
Ce projet est un outil productivité. Durées courtes (120-280ms), jamais > 300ms sur les interactions directes. Ease-out pour les ouvertures, ease-in pour les fermetures. Zéro animation en boucle.

### 2.5 Border Radius

```
6px  — petits éléments (badges, search input)
8px  — rows de liste, boutons topbar
10px — FAB (icône sidebar collapsible)
12px — panel slide-in (coins right seulement, les left sont contre l'edge)
16px — tooltip flottant
```

### 2.6 Shadows

Seule règle : subtil ou invisible. Jamais de box-shadow qui compète avec le contenu.

```css
.panel     { box-shadow: 4px 0 24px rgba(0,0,0,0.04), 1px 0 4px rgba(0,0,0,0.03); }
.fab       { box-shadow: 0 2px 12px rgba(0,0,0,0.06), 0 1px 4px rgba(0,0,0,0.04); }
.tooltip   { box-shadow: 0 4px 16px rgba(0,0,0,0.08); }
.topbar    { box-shadow: 0 1px 0 #EDE8DF; }  /* line only, pas de shadow épaisse */
```

---

## 3. Architecture Layout

```
┌─────────────────────────────────────────────────────────────────────┐
│  TOPBAR (52px)                                                       │
│  [← Nom landing, italic]    [Desktop|Tablet|Mobile]   [Sauvegarder] │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ●  PREVIEW AREA (100% restant)                                      │
│  │  - fond #F0EDE8 (sable preview)                                   │
│  │  - iframe centrée max-w 1280px desktop                            │
│  │  - sections survolées : overlay dashed sage                       │
│  │  - sections sélectionnées : outline 2px solid sage + bg light     │
│  │                                                                    │
│  FAB (icône flottante, left 16px, centré vertical)                   │
│  - 44×44px, bg white, shadow subtile, radius 10px                   │
│  - icône : 4 carrés stacked (sections icon)                          │
│                                                                      │
│  PANEL SLIDE-IN (overlay, 400px, depuis left)                        │
│  - position: fixed, top: 52px, left: 0, height: calc(100vh - 52px)  │
│  - z-index: 300 (au-dessus preview, sous topbar)                     │
│  - bg white, border-right 1px #EDE8DF                                │
│  - shadow douce vers la droite                                       │
│  - fermé: transform: translateX(-100%)                               │
│  - ouvert: transform: translateX(0)                                  │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 4. États de l'interface

### État 1 — Panel fermé (défaut)

```
┌──────────────────────────────────────────────────────────┐
│ ← Nom du produit                [D] [T] [M]  [Sauvegarder]│
├──────────────────────────────────────────────────────────┤
│                                                           │
│  ◉  [iframe preview centrée, pleine largeur]             │
│                                                           │
│                                                           │
│                                                           │
│                                                           │
└──────────────────────────────────────────────────────────┘

◉ = FAB (44px, discret, left 16px, mid-vertical)
```

### État 2 — Panel ouvert (click FAB)

```
┌──────────────────────────────────────────────────────────┐
│ ← Nom du produit                [D] [T] [M]  [Sauvegarder]│
├──────────────────────────────────────────────────────────┤
│┌────────────────┐                                         │
││ Sections   [X] │  [iframe preview, légèrement réduite   │
││ ──────────────  │   par l'overlay du panel]              │
││ 🔍 Rechercher  │                                         │
││ ──────────────  │                                         │
││ :: Histoire    │                                         │
││ :: Pour qui    │                                         │
││ :: Matériaux   │                                         │
││ :: Témoignages │                                         │
││ ──────────────  │                                         │
││ + Ajouter      │                                         │
│└────────────────┘                                         │
│                                                           │
└──────────────────────────────────────────────────────────┘
```

### État 3 — Section hovered (dans la preview)

```
Section "Histoire" dans l'iframe :
- outline: 1px dashed #A8B5A0
- background overlay: rgba(168, 181, 160, 0.08)
- tooltip flottant en haut-gauche de la section :
  ┌───────────────────────┐
  │  Histoire (PAS)  ✎    │
  └───────────────────────┘
  bg: #2D2D2D, text: white, radius 6px, 13px Inter 500
```

### État 4 — Section sélectionnée (click dans preview)

```
Section "Histoire" dans l'iframe :
- outline: 2px solid #A8B5A0
- background overlay: rgba(168, 181, 160, 0.14)
- Panel s'ouvre automatiquement sur cette section
- Row correspondante dans le panel : active state (bg #F5F1EB, border-left 3px sage)
```

### État 5 — Row sélectionnée (click dans le panel)

```
┌────────────────────────────────────────────────────────┐
│ :: ▌ Histoire (PAS)                          👁  ...   │
│    ▌ (border-left 3px #A8B5A0, bg #F5F1EB)            │
└────────────────────────────────────────────────────────┘
- La preview scrolle automatiquement vers la section
- La section dans l'iframe reçoit l'outline 2px solid
```

### État 6 — Section masquée

```
┌────────────────────────────────────────────────────────┐
│ ::   Histoire (PAS)                          ◌  ...    │
│      (opacity: 0.38, label en italic)                  │
└────────────────────────────────────────────────────────┘
- Dans la preview : section visible mais avec overlay grisé + label "Masqué"
```

### État 7 — Mobile (<768px)

```
FAB : reste accessible, left 12px, mid-vertical
Panel : width 100vw, height calc(100vh - 52px), full overlay
         handle en haut (barre 32px pour swipe-down)
         fermeture par swipe vers le bas ou tap handle
Topbar : device switcher masqué sur mobile (on est mobile)
```

---

## 5. Composants — Specs détaillées

### 5.1 Topbar

```
Hauteur : 52px fixe
Background : #FFFFFF
Border-bottom : 1px solid #EDE8DF
Padding horizontal : 20px
Z-index : 400

Layout (3 zones flex justify-between) :
  LEFT  : bouton retour + nom landing
  CENTER: device switcher (3 icônes)
  RIGHT : bouton "Sauvegarder"

Bouton retour :
  - icône chevron-left SVG 18px stroke 1.5
  - gap 6px avec le texte "Retour"
  - Inter 13px weight 400, couleur #8B8680
  - hover: color #2D2D2D, transition 150ms

Nom landing (entre retour et switcher) :
  - Playfair Display 16px italic weight 400
  - couleur #2D2D2D
  - max-width 200px, overflow ellipsis

Device switcher :
  - 3 boutons 36px×32px, border-radius 6px
  - Inactif : stroke #8B8680
  - Actif : bg #F5F1EB, stroke #2D2D2D
  - gap 2px entre boutons
  - Icônes : desktop 20px, tablet 18px, mobile 16px

Bouton Sauvegarder :
  - outlined : border 1px solid #DDD8CF
  - bg: transparent → hover: #F5F1EB
  - Inter 13px weight 500, couleur #2D2D2D
  - padding 8px 16px, border-radius 8px
  - icône save 16px à gauche, gap 6px
  - transition: background 150ms ease
```

### 5.2 FAB (Floating Action Button sidebar)

```
Position : fixed, left: 16px, top: 50% (translateY -50%), z-index: 200
Taille : 44×44px
Background : #FFFFFF
Border-radius : 10px
Shadow : 0 2px 12px rgba(0,0,0,0.06), 0 1px 4px rgba(0,0,0,0.04)
Border : 1px solid #EDE8DF

Icône : 4 squares stacked (sections icon) 20px, stroke 1.5, couleur #8B8680
  → hover : couleur #2D2D2D + scale(1.05)
  → ouvert : couleur #A8B5A0 (sage) + bg #EEF2EC

Transition :
  transform: 200ms cubic-bezier(0.34, 1.56, 0.64, 1)  /* légère spring */
  box-shadow: 200ms ease
  background: 150ms ease

Tooltip (hover sur FAB, après 400ms delay) :
  "Sections" — right du FAB, 8px de gap
  bg #2D2D2D, text white, 12px Inter 500, radius 6px, padding 4px 10px
```

### 5.3 Panel Slide-in

```
Position : fixed, left: 0, top: 52px (sous topbar), width: 400px
Height : calc(100vh - 52px)
Z-index : 300
Background : #FFFFFF
Border-right : 1px solid #EDE8DF
Box-shadow : 4px 0 24px rgba(0,0,0,0.04), 1px 0 4px rgba(0,0,0,0.03)

Animation :
  Fermé :  transform: translateX(-100%); visibility: hidden;
  Ouvert : transform: translateX(0);     visibility: visible;
  Durée :  280ms cubic-bezier(0.4, 0, 0.2, 1)
  Fermeture : 240ms ease-in (légèrement plus rapide)

HEADER du panel (56px) :
  - "Sections" : Inter 15px weight 600, couleur #2D2D2D
  - Bouton X close : 32×32px, icône x-close 16px SVG, couleur #8B8680
    hover: bg #F5F1EB, couleur #2D2D2D, border-radius 6px
  - padding : 16px 16px 0 16px

SEARCH BAR (40px zone) :
  - Input 100% width, height 34px
  - bg #FAFAF7, border 1px solid #DDD8CF, radius 6px
  - placeholder : "Rechercher..." — #C4BFB9, 13px
  - padding 0 12px 0 34px (icône search à gauche 16px)
  - focus: border-color #A8B5A0, outline none
  - margin : 12px 16px

LISTE sections :
  - overflow-y: auto
  - padding: 8px 12px 16px 12px
  - gap: 2px entre rows

FOOTER du panel :
  - Bouton "+ Ajouter une section"
  - position: sticky, bottom: 0
  - bg #FFFFFF, border-top 1px solid #EDE8DF
  - padding: 12px 16px
  - texte 13px Inter 500, couleur #A8B5A0
  - icône plus 16px à gauche
  - hover: bg #EEF2EC
```

### 5.4 Section Row

```
Layout : flex, align-items center, gap 8px
Height : 44px (touch target minimum)
Padding : 0 8px
Border-radius : 8px
Transition : background 120ms ease

Zones de gauche à droite :
  1. Drag handle (20px) : 6 dots SVG, couleur #C4BFB9
     → cursor grab / grabbing
     → hover: couleur #8B8680
  2. Label section (flex 1) : Inter 14px weight 600, couleur #2D2D2D
     → section masquée : opacity 0.38 + font-style italic
  3. Toggle visibility (28×28px) : icône eye/eye-off 16px
     → visible: couleur #8B8680, hover: #2D2D2D
     → masqué: couleur #C4BFB9
     → hover bg: #F5F1EB, radius 6px
  4. More actions (...) button (28×28px) : icône 3 dots horizontal 16px
     → mini-menu : Dupliquer | Masquer | Supprimer
     → même style hover

États :
  DEFAULT  : bg transparent, border transparent
  HOVER    : bg #FAFAF7
  ACTIVE   : bg #F5F1EB + border-left 3px solid #A8B5A0 + padding-left: 13px (compense border)
  DRAGGING : opacity 0.5, shadow légère, scale 1.01
  DISABLED (masqué) : texte opacity 0.38, italic

Mini-menu contextuel (...) :
  Position : absolute, right 0, top 100%
  bg #FFFFFF, border 1px solid #EDE8DF, radius 8px
  shadow: 0 4px 16px rgba(0,0,0,0.08)
  Items : 13px Inter 400, couleur #2D2D2D
    - "Dupliquer" — icône copy 14px
    - "Masquer" — icône eye-off 14px
    - "Supprimer" — icône trash 14px, couleur rouge sur hover (#EF4444)
  padding: 4px 0
  Item height: 32px, padding 0 12px
```

### 5.5 Highlight Preview (click-to-edit overlay)

```
Implémentation : injection CSS dans l'iframe via postMessage
Chaque section dans l'iframe reçoit : data-section-id, data-section-key

HOVER state :
  outline: 1px dashed rgba(168, 181, 160, 0.8)
  background: rgba(168, 181, 160, 0.06)
  cursor: pointer
  transition: all 200ms ease

SELECTED state :
  outline: 2px solid #A8B5A0
  background: rgba(168, 181, 160, 0.10)

TOOLTIP hover (flottant sur section) :
  Position: absolute, top: 8px, left: 8px dans la section
  Content: "[Nom section]  ✎"
  bg: #2D2D2D, color: #FFFFFF
  Font: 12px Inter 500
  Padding: 5px 10px
  Border-radius: 6px
  Shadow: 0 4px 16px rgba(0,0,0,0.12)
  Apparition : opacity 0→1, translateY(2px→0), 180ms ease
  Disparition : 150ms ease
```

---

## 6. Pattern postMessage iframe ↔ parent

### Séquence complète

```
1. INIT (parent → iframe)
   parent envoie : { type: 'EDITOR_INIT', sections: [...] }
   iframe : injecte CSS styles hover/selected sur chaque [data-section-id]
   iframe : attache eventListeners mouseover + click sur chaque section

2. HOVER (iframe → parent)
   user survole une section dans l'iframe
   iframe envoie : { type: 'SECTION_HOVER', sectionId: 'uuid', key: 'story' }
   parent reçoit : 
     → rien (pas d'action panel, juste confirmation hover actif)
     → (optionnel) highlight de la row dans le panel)

3. CLICK SECTION (iframe → parent)
   user clique une section dans l'iframe
   iframe envoie : { type: 'SECTION_CLICK', sectionId: 'uuid', key: 'story' }
   parent reçoit :
     → setSelectedSection(sectionId)
     → openPanel()  ← si panel fermé
     → scroll row correspondante dans le panel en vue

4. SECTION SELECTED (parent → iframe)
   parent envoie : { type: 'SECTION_SELECTED', sectionId: 'uuid' }
   iframe reçoit :
     → retire outline de l'ancienne section sélectionnée
     → ajoute outline 2px solid #A8B5A0 sur la nouvelle
     → scrollIntoView({ behavior: 'smooth', block: 'center' })

5. SECTION TOGGLE (parent → iframe)
   parent envoie : { type: 'SECTION_TOGGLE', sectionId: 'uuid', visible: false }
   iframe reçoit :
     → section.style.display = visible ? '' : 'none'

6. SECTION REORDER (parent → iframe)
   parent envoie : { type: 'SECTIONS_REORDER', order: ['id1','id2',...] }
   iframe reçoit :
     → réorganise les sections dans le DOM (ou déclenche re-render)

7. PANEL CLICK OUTSIDE (parent logique)
   user clique dans la zone preview en dehors d'une section annotée
   iframe envoie : { type: 'CLICK_OUTSIDE' }
   parent reçoit :
     → clearSelectedSection()
     → closePanel()
```

### Code parent (listener)

```javascript
window.addEventListener('message', (event) => {
  // Vérifier l'origine en production
  const { type, sectionId, key } = event.data
  switch (type) {
    case 'SECTION_HOVER':
      // optionnel: highlight row dans panel
      break
    case 'SECTION_CLICK':
      store.setSelectedSection(sectionId)
      store.openPanel()
      scrollPanelToRow(sectionId)
      break
    case 'CLICK_OUTSIDE':
      store.clearSelectedSection()
      store.closePanel()
      break
  }
})
```

### Code iframe (injection)

```javascript
// Injection dans le HTML généré de la landing
window.addEventListener('message', (event) => {
  const { type, sectionId, sectionIds } = event.data
  if (type === 'EDITOR_INIT') {
    injectEditorOverlays()
  }
  if (type === 'SECTION_SELECTED') {
    document.querySelectorAll('[data-section-id]').forEach(el => {
      el.classList.remove('kv-selected')
    })
    if (sectionId) {
      const el = document.querySelector(`[data-section-id="${sectionId}"]`)
      if (el) {
        el.classList.add('kv-selected')
        el.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
    }
  }
})

function injectEditorOverlays() {
  const style = document.createElement('style')
  style.textContent = `
    [data-section-id] {
      position: relative;
      cursor: pointer;
      outline: 1px solid transparent;
      transition: outline 200ms ease, background-color 200ms ease;
    }
    [data-section-id]:hover {
      outline: 1px dashed rgba(168, 181, 160, 0.8);
      background-color: rgba(168, 181, 160, 0.06);
    }
    [data-section-id]:hover::before {
      content: attr(data-section-label) ' ✎';
      position: absolute;
      top: 8px; left: 8px;
      background: #2D2D2D;
      color: #fff;
      font: 500 12px/1 'Inter', sans-serif;
      padding: 5px 10px;
      border-radius: 6px;
      z-index: 9999;
      pointer-events: none;
      box-shadow: 0 4px 16px rgba(0,0,0,0.12);
    }
    [data-section-id].kv-selected {
      outline: 2px solid #A8B5A0;
      background-color: rgba(168, 181, 160, 0.10);
    }
  `
  document.head.appendChild(style)

  document.querySelectorAll('[data-section-id]').forEach(el => {
    el.addEventListener('click', (e) => {
      e.stopPropagation()
      window.parent.postMessage({
        type: 'SECTION_CLICK',
        sectionId: el.dataset.sectionId,
        key: el.dataset.sectionKey
      }, '*')
    })
  })

  document.body.addEventListener('click', () => {
    window.parent.postMessage({ type: 'CLICK_OUTSIDE' }, '*')
  })
}
```

---

## 7. Icônes SVG — Bibliothèque complète

Toutes les icônes : stroke 1.5px, viewBox 24×24, fill none, stroke-linecap round, stroke-linejoin round.

### sections (4 carrés stacked — FAB icon)
```svg
<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
  <rect x="3" y="3" width="8" height="5" rx="1"/>
  <rect x="13" y="3" width="8" height="5" rx="1"/>
  <rect x="3" y="11" width="8" height="5" rx="1"/>
  <rect x="13" y="11" width="8" height="5" rx="1"/>
  <rect x="3" y="19" width="18" height="2" rx="1"/>
</svg>
```

### drag-handle (6 dots)
```svg
<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
  <circle cx="9" cy="6" r="1" fill="currentColor" stroke="none"/>
  <circle cx="15" cy="6" r="1" fill="currentColor" stroke="none"/>
  <circle cx="9" cy="12" r="1" fill="currentColor" stroke="none"/>
  <circle cx="15" cy="12" r="1" fill="currentColor" stroke="none"/>
  <circle cx="9" cy="18" r="1" fill="currentColor" stroke="none"/>
  <circle cx="15" cy="18" r="1" fill="currentColor" stroke="none"/>
</svg>
```

### eye (visible)
```svg
<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
  <circle cx="12" cy="12" r="3"/>
</svg>
```

### eye-off (masqué)
```svg
<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
  <line x1="1" y1="1" x2="23" y2="23"/>
</svg>
```

### trash
```svg
<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
  <polyline points="3 6 5 6 21 6"/>
  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
</svg>
```

### x-close
```svg
<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
  <line x1="18" y1="6" x2="6" y2="18"/>
  <line x1="6" y1="6" x2="18" y2="18"/>
</svg>
```

### chevron-left
```svg
<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
  <polyline points="15 18 9 12 15 6"/>
</svg>
```

### plus
```svg
<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
  <line x1="12" y1="5" x2="12" y2="19"/>
  <line x1="5" y1="12" x2="19" y2="12"/>
</svg>
```

### save
```svg
<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
  <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
  <polyline points="17 21 17 13 7 13 7 21"/>
  <polyline points="7 3 7 8 15 8"/>
</svg>
```

### more-horizontal (3 dots)
```svg
<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
  <circle cx="12" cy="12" r="1" fill="currentColor" stroke="none"/>
  <circle cx="19" cy="12" r="1" fill="currentColor" stroke="none"/>
  <circle cx="5" cy="12" r="1" fill="currentColor" stroke="none"/>
</svg>
```

### desktop
```svg
<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
  <rect x="2" y="3" width="20" height="14" rx="2"/>
  <line x1="8" y1="21" x2="16" y2="21"/>
  <line x1="12" y1="17" x2="12" y2="21"/>
</svg>
```

### tablet
```svg
<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
  <rect x="4" y="2" width="16" height="20" rx="2"/>
  <circle cx="12" cy="18" r="1" fill="currentColor" stroke="none"/>
</svg>
```

### mobile
```svg
<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
  <rect x="5" y="2" width="14" height="20" rx="2"/>
  <circle cx="12" cy="18" r="1" fill="currentColor" stroke="none"/>
</svg>
```

### search
```svg
<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
  <circle cx="11" cy="11" r="8"/>
  <line x1="21" y1="21" x2="16.65" y2="16.65"/>
</svg>
```

### copy (dupliquer)
```svg
<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
  <rect x="9" y="9" width="13" height="13" rx="2"/>
  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
</svg>
```

---

## 8. Anti-patterns validés pour cette UI

| Anti-pattern évité | Raison |
|---|---|
| Aucun fond foncé / dark theme | DA etec-natural est light. L'éditeur doit s'effacer |
| Aucun border entre éléments panel | Séparation par spacing (gap 2px) + état hover seulement |
| Aucun accent violet | clash avec la palette sand/sage/terra |
| Aucun emoji dans les icônes | SVG outline 1.5px partout |
| Aucun PanelLeft permanent 320px | Preview = l'espace principal, le panneau est invité |
| Aucune shadow aggressive | max 4% opacity, subtile |
| Aucun border-radius >12px | Pas de "rounded-full" sur des éléments rectangulaires |
| Aucune animation >300ms sur actions directes | Philosophie Kowalski restraint |

---

## 9. Checklist A11y

- [ ] Tous les boutons ont un `aria-label` explicite
- [ ] FAB : `aria-expanded`, `aria-controls="editor-panel"`
- [ ] Panel : `role="dialog"`, `aria-modal="true"`, focus trap à l'ouverture
- [ ] ESC ferme le panneau
- [ ] Drag & drop : alternative clavier (buttons up/down dans le mini-menu)
- [ ] Contraste : charcoal #2D2D2D sur white #FFFFFF = 13.9:1 (AAA)
- [ ] Contraste : muted #8B8680 sur white = 4.6:1 (AA)
- [ ] Contraste : sage #A8B5A0 sur white = 2.9:1 — **usage décoratif seulement** (outline, border), jamais pour du texte informationnel
- [ ] `prefers-reduced-motion` : toutes les transitions → `transition: none`
- [ ] Touch targets : 44px minimum partout
