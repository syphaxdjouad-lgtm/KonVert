import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  // Désactiver en développement local
  enabled: process.env.NODE_ENV === 'production',

  // Capture 10% des transactions en prod (performance)
  tracesSampleRate: 0.1,

  // Replay session sur les erreurs uniquement
  replaysOnErrorSampleRate: 1.0,
  replaysSessionSampleRate: 0.05,

  integrations: [
    Sentry.replayIntegration({
      maskAllText: true,      // RGPD — masquer tout le texte
      blockAllMedia: true,
    }),
  ],
})
