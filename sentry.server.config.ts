import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN,

  enabled: process.env.NODE_ENV === 'production',

  // Capture toutes les erreurs serveur
  tracesSampleRate: 0.1,

  // Ne pas logger les infos de debug en prod
  debug: false,
})
