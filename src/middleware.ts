import { type NextRequest, NextResponse } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'
import { rateLimitAsync } from '@/lib/security/ratelimit'
import { UTM_COOKIE, UTM_KEYS, encodeUtm, decodeUtm, type UtmData } from '@/lib/analytics/utm'

// 90 jours en secondes — assez pour couvrir un cycle considération B2B normal
// (e-commerçant qui voit la pub, attend la fin du mois pour upgrader, etc.).
const UTM_COOKIE_MAX_AGE = 60 * 60 * 24 * 90

// Routes avec rate limiting et leurs limites (requêtes / fenêtre)
const RATE_LIMITS: Record<string, { limit: number; windowMs: number }> = {
  '/api/generate/public': { limit: 3,   windowMs: 300_000 },      // 3 req / 5 min (sans auth, coûteux)
  '/api/generate':        { limit: 10,  windowMs: 60_000 },       // 10 req/min
  '/api/scrape':          { limit: 10,  windowMs: 60_000 },       // 10 req/min
  '/api/stripe/checkout': { limit: 20,  windowMs: 60_000 },       // 20 req/min (pas webhook)
  '/api/stripe/portal':   { limit: 10,  windowMs: 60_000 },       // 10 req/min
  '/api/waitlist':        { limit: 5,   windowMs: 60_000 },       // 5 req/min (anti-spam)
  '/api/admin':           { limit: 5,   windowMs: 60_000 },       // 5 req/min (protection brute-force admin)
  '/api/ab':              { limit: 30,  windowMs: 60_000 },       // 30 req/min (tracking public)
  '/api/analytics':       { limit: 100, windowMs: 60_000 },       // 100 req/min (tracking pages)
  '/api/contact':         { limit: 5,   windowMs: 60_000 },       // 5 req/min (anti-spam)
  '/api/invitations':     { limit: 10,  windowMs: 60_000 },       // 10 req/min (anti-brute-force)
  '/api/preview':         { limit: 30,  windowMs: 60_000 },       // 30 req/min
  '/api/email/unsubscribe': { limit: 5, windowMs: 60_000 },        // 5 req/min (anti-bruteforce désabonnement)
}

function getClientIp(req: NextRequest): string {
  return (
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    req.headers.get('x-real-ip') ||
    'unknown'
  )
}

// Capture first-touch UTM : on persiste les params au premier hit qui en porte,
// et on NE remplace PAS si déjà présents (modèle attribution first-touch).
// Si tu veux passer en last-touch, il suffit de retirer le `existing &&` ci-dessous.
function captureUtm(request: NextRequest, response: NextResponse): NextResponse {
  const params = request.nextUrl.searchParams
  const incoming: UtmData = {}
  let hasUtm = false
  for (const key of UTM_KEYS) {
    const v = params.get(key)
    if (v) {
      incoming[key] = v.slice(0, 200)  // cap par sécurité
      hasUtm = true
    }
  }
  if (!hasUtm) return response

  const existing = decodeUtm(request.cookies.get(UTM_COOKIE)?.value)
  if (existing && existing.ts) return response  // first-touch déjà capturé

  const data: UtmData = {
    ...incoming,
    ts: Date.now(),
    landing: request.nextUrl.pathname,
    referrer: request.headers.get('referer') ?? undefined,
  }

  response.cookies.set(UTM_COOKIE, encodeUtm(data), {
    maxAge: UTM_COOKIE_MAX_AGE,
    path: '/',
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    httpOnly: false,  // doit être lisible côté client (signup, PostHog identify)
  })
  return response
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Appliquer le rate limiting sur les routes concernées
  for (const [route, config] of Object.entries(RATE_LIMITS)) {
    if (pathname.startsWith(route)) {
      const ip = getClientIp(request)
      const key = `rl:${route}:${ip}`
      const result = await rateLimitAsync(key, config.limit, config.windowMs)

      if (!result.allowed) {
        return new NextResponse(
          JSON.stringify({ error: 'Trop de requêtes — réessaie dans quelques instants.' }),
          {
            status: 429,
            headers: {
              'Content-Type': 'application/json',
              'Retry-After': String(Math.ceil(result.retryAfterMs / 1000)),
              'X-RateLimit-Limit': String(config.limit),
              'X-RateLimit-Remaining': '0',
            },
          }
        )
      }
      break
    }
  }

  const response = await updateSession(request)
  return captureUtm(request, response)
}

export const config = {
  // Exclut assets statiques (images, fonts, JSON, manifest, ico) pour éviter
  // un appel Supabase getUser() inutile à chaque request d'asset.
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|woff|woff2|ttf|otf|json|ico|txt|xml|webmanifest|map)$).*)',
  ],
}
