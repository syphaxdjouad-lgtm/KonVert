import * as Sentry from '@sentry/nextjs'
import { scrubEvent, scrubString, scrubValue } from '@/lib/sentry/scrub'

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  // Désactiver en développement local
  enabled: process.env.NODE_ENV === 'production',

  // Tag les events au commit déployé pour rattacher les source maps uploadées
  // par next.config.ts (deleteSourcemapsAfterUpload). Sans ça, les stack traces
  // restent illisibles en prod.
  release: process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA || process.env.VERCEL_GIT_COMMIT_SHA,
  environment: process.env.NEXT_PUBLIC_VERCEL_ENV || process.env.VERCEL_ENV || 'development',

  // Capture 10% des transactions en prod (performance)
  tracesSampleRate: 0.1,

  // Replay session sur les erreurs uniquement
  replaysOnErrorSampleRate: 1.0,
  replaysSessionSampleRate: 0.05,

  // Filtre PII : masque emails, tokens, clés API dans les events et breadcrumbs.
  // Sans ce filtre, les logs `console.log('[contact] from:', user@example.com)`
  // partent en clair vers Sentry → fuite RGPD.
  beforeSend: scrubEvent,
  beforeBreadcrumb: (breadcrumb) => {
    if (breadcrumb.message) breadcrumb.message = scrubString(breadcrumb.message)
    if (breadcrumb.data) {
      breadcrumb.data = scrubValue(breadcrumb.data) as Record<string, unknown>
    }
    return breadcrumb
  },

  integrations: [
    Sentry.replayIntegration({
      maskAllText: true,      // RGPD — masquer tout le texte
      blockAllMedia: true,
    }),
  ],
})
