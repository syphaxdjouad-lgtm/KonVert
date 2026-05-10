import * as Sentry from '@sentry/nextjs'
import { scrubEvent } from '@/lib/sentry/scrub'

Sentry.init({
  dsn: process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN,

  enabled: process.env.NODE_ENV === 'production',

  release: process.env.VERCEL_GIT_COMMIT_SHA,
  environment: process.env.VERCEL_ENV || 'development',

  tracesSampleRate: 0.1,

  beforeSend: scrubEvent,
})
