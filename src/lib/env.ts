// Helpers env vars — preferable au pattern `process.env.X || 'http://localhost:3000'`
// qui silencieusement laisse passer une URL incorrecte en prod si l'env var
// n'est pas configurée.

// Renvoie l'URL publique de l'app. En prod (NODE_ENV=production), exige que
// NEXT_PUBLIC_APP_URL soit défini : pas de fallback localhost qui casserait
// les redirects Stripe, les liens emails, les push Shopify/WC, etc.
export function getAppUrl(): string {
  const url = process.env.NEXT_PUBLIC_APP_URL?.trim()
  if (url) return url.replace(/\/$/, '')

  if (process.env.NODE_ENV === 'production') {
    throw new Error(
      'NEXT_PUBLIC_APP_URL est requis en production. ' +
      'Vérifie les env vars Vercel (scope Production + Preview).'
    )
  }
  // Dev local uniquement : fallback acceptable
  return 'http://localhost:3000'
}
