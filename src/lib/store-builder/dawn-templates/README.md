# Dawn templates embarqués — décision d'implémentation ANNA (Sprint 7)

Ces 3 fichiers sont des **copies exactes** de `konvert-dawn/templates/product.{dropshipping,beaute,tech}.json`
(repo séparé `/Users/mac/nexara/konvert-dawn/`), figées au 2026-07-27.

## Pourquoi une copie et pas une lecture cross-repo

`konvert-dawn` est un repo Git indépendant, pas un sous-dossier de `konvert/`. L'endpoint
`/api/shopify/store-builder/generate` tourne en serverless sur Vercel dans le déploiement
`konvert` — il n'a pas accès au filesystem d'un autre repo en prod. Ces squelettes sont donc
importés comme assets statiques du build Next.js (`import ... from './dawn-templates/product.X.json'`),
la même stratégie qu'un `assemble.ts` qui fusionne la sortie du générateur IA dans une copie
profonde de ce squelette.

## Comment les garder synchronisés

Si OBITO ou une future itération du thème Dawn change la structure de
`konvert-dawn/templates/product.*.json` (nouveau setting, renommage d'un `setting_id`,
nouvelle section), il faut répercuter le changement ici manuellement — ce n'est PAS un
symlink ni un submodule. Pas de CI de synchro automatique à ce stade (hors scope Sprint 7).
Si ça devient un point de friction récurrent, envisager un submodule Git ou un package npm
interne partagé — décision à remonter au founder, pas prise unilatéralement ici.
