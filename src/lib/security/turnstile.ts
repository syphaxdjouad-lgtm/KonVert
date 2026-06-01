/**
 * Vérification serveur d'un token Cloudflare Turnstile.
 * Free, RGPD-friendly, pas de tracking utilisateur.
 *
 * Setup :
 * - dashboard.cloudflare.com → Turnstile → Add site → konvertpilot.com
 * - Mode "Managed" recommandé
 * - Récupérer site_key (public) + secret_key (server)
 * - Variables Vercel :
 *     NEXT_PUBLIC_TURNSTILE_SITE_KEY=0x...
 *     TURNSTILE_SECRET_KEY=0x...
 *
 * Si TURNSTILE_SECRET_KEY n'est pas configurée (dev local), on bypass.
 */

const VERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify'

export interface TurnstileResult {
  ok: boolean
  error?: string
}

export async function verifyTurnstile(token: unknown, ip?: string | null): Promise<TurnstileResult> {
  const secret = process.env.TURNSTILE_SECRET_KEY

  // Pas configuré → bypass UNIQUEMENT en dev. En prod, fail-closed pour ne pas
  // exposer /api/generate/public au spam si la clé est manquante (H-01 MADARA).
  if (!secret) {
    if (process.env.NODE_ENV === 'production') {
      return { ok: false, error: 'Captcha non configuré' }
    }
    return { ok: true }
  }

  if (!token || typeof token !== 'string' || token.length < 10) {
    return { ok: false, error: 'Captcha manquant' }
  }

  const params = new URLSearchParams()
  params.set('secret', secret)
  params.set('response', token)
  if (ip) params.set('remoteip', ip)

  try {
    const res = await fetch(VERIFY_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params.toString(),
      signal: AbortSignal.timeout(5000),
    })

    if (!res.ok) return { ok: false, error: 'Captcha service indisponible' }

    const data = (await res.json()) as { success: boolean; 'error-codes'?: string[] }
    if (!data.success) {
      return { ok: false, error: 'Captcha invalide. Recharge la page et réessaie.' }
    }
    return { ok: true }
  } catch {
    return { ok: false, error: 'Captcha service injoignable' }
  }
}
