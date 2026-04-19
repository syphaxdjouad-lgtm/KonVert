import { type NextRequest, NextResponse } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'
import { rateLimit } from '@/lib/security/ratelimit'

// Routes avec rate limiting et leurs limites (requêtes / fenêtre)
const RATE_LIMITS: Record<string, { limit: number; windowMs: number }> = {
  '/api/generate':        { limit: 10,  windowMs: 60_000 },       // 10 req/min
  '/api/scrape':          { limit: 10,  windowMs: 60_000 },       // 10 req/min
  '/api/stripe':          { limit: 20,  windowMs: 60_000 },       // 20 req/min
  '/api/waitlist':        { limit: 5,   windowMs: 60_000 },       // 5 req/min (anti-spam)
  '/api/admin':           { limit: 5,   windowMs: 60_000 },       // 5 req/min (protection brute-force admin)
  '/api/ab':              { limit: 30,  windowMs: 60_000 },       // 30 req/min (tracking public)
  '/login':               { limit: 10,  windowMs: 15 * 60_000 },  // 10 tentatives / 15 min
  '/signup':              { limit: 5,   windowMs: 15 * 60_000 },  // 5 tentatives / 15 min
}

function getClientIp(req: NextRequest): string {
  return (
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    req.headers.get('x-real-ip') ||
    'unknown'
  )
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Appliquer le rate limiting sur les routes concernées
  for (const [route, config] of Object.entries(RATE_LIMITS)) {
    if (pathname.startsWith(route)) {
      const ip = getClientIp(request)
      const key = `rl:${route}:${ip}`
      const result = rateLimit(key, config.limit, config.windowMs)

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

  return await updateSession(request)
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
