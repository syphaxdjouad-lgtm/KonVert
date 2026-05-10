import * as Sentry from '@sentry/nextjs'
import { scrubEvent } from '@/lib/sentry/scrub'

Sentry.init({
  dsn: process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN,

  enabled: process.env.NODE_ENV === 'production',

  // Rattachement aux source maps + segmentation env (preview vs production).
  release: process.env.VERCEL_GIT_COMMIT_SHA,
  environment: process.env.VERCEL_ENV || 'development',

  // Capture toutes les erreurs serveur
  tracesSampleRate: 0.1,

  // Ne pas logger les infos de debug en prod
  debug: false,

  // Filtre PII serveur : essentiel ici car les logs cron et webhook
  // contiennent souvent des emails, IDs de session, secrets en clair.
  beforeSend: scrubEvent,
})
