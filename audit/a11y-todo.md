# A11y — TODO list (session dédiée)

L'audit Konan 2026-05-10 P1-10 a flaggé :
- **9.4 % seulement des 138 boutons ont un `aria-label`** (cible : 80 %+)
- Focus states absents ou `focus:outline-none` sans fallback
- Touch targets parfois < 44px sur mobile

## Fait dans S2 (2026-05-10)

- [x] CookieBanner : `min-h-[44px]` sur Refuser/Accepter + `aria-label` + `focus-visible:outline`

## À faire en session dédiée

### Pass aria-label boutons icon-only

Chercher tous les `<button>` qui contiennent uniquement une icône (pas de texte) et leur ajouter `aria-label`. Commande :

```bash
grep -rEn "<button[^>]*onClick" src/ --include="*.tsx" \
  | grep -v "aria-label" \
  | grep -v "aria-labelledby"
```

Cibles prioritaires (ordre d'impact UX) :
1. **Dashboard sidebar mobile** (`(dashboard)/layout.tsx`) — burger, close, settings icon, user avatar
2. **Wizard `/dashboard/new`** — photo upload, X suppression image, nav step prev/next
3. **Pages `/dashboard/pages`** — éditer / supprimer / publier
4. **Marketing Navbar** — burger mobile, close drawer
5. **PreviewPage `/preview/[id]`** — play vidéo, close modal

### Pass focus states

`grep -rn "focus:outline-none" src/ --include="*.tsx"` puis ajouter `focus-visible:ring-2 focus-visible:ring-[#5B47F5] focus-visible:ring-offset-2` sur chaque match.

### Pass touch targets mobile

Tous `<button>` et `<Link>` avec `text-xs` ou `text-[10-13px]` sans `min-h-[44px]` doivent avoir min-h-[44px] sur mobile (md:min-h-[36px] desktop accepté).

### Tests automatiques

À installer dans la S3 (tests Playwright) :
- `@axe-core/playwright` pour audit a11y automatique sur chaque smoke test
- Lighthouse a11y score cible : 95+

## Métriques cibles avant launch

- **aria-label coverage** : 80 %+ sur boutons icon-only
- **Lighthouse a11y mobile** : 95+
- **Touch targets** : 100 % ≥ 44px sur mobile
- **Focus visible** : 100 % des éléments interactifs
- **Contraste WCAG AA** : 4.5:1 body, 3:1 titres > 18px
