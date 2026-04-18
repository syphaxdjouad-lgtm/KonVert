import type { NextConfig } from "next";
import { withSentryConfig } from '@sentry/nextjs'

const securityHeaders = [
  // Empêche l'embedding dans des iframes (clickjacking)
  { key: 'X-Frame-Options', value: 'DENY' },
  // Empêche le MIME sniffing
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  // Limite les infos de référent envoyées aux sites tiers
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  // Désactive les APIs navigateur non utilisées
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), payment=()' },
  // Force HTTPS pendant 1 an (activer uniquement en prod — Vercel gère déjà le HTTPS)
  { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains' },
  // Content Security Policy
  {
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      // Scripts : Stripe, inline (shadcn/next), unsafe-eval pour GrapesJS builder
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com",
      // Styles : inline partout (Tailwind + GrapesJS injecte du CSS dynamique)
      "style-src 'self' 'unsafe-inline'",
      // Images : data URIs, blob (GrapesJS), et tous les CDN produits e-commerce
      "img-src 'self' data: blob: https:",
      // Polices
      "font-src 'self' data:",
      // Connexions API
      "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://api.stripe.com https://api.anthropic.com",
      // Iframes Stripe (checkout embedded)
      "frame-src https://js.stripe.com https://hooks.stripe.com",
      // Workers (Next.js)
      "worker-src 'self' blob:",
    ].join('; '),
  },
]

const nextConfig: NextConfig = {
  compress: true,
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
    ]
  },
  images: {
    formats: ['image/webp'],
    remotePatterns: [
      // AliExpress CDN
      { protocol: 'https', hostname: '**.alicdn.com' },
      { protocol: 'https', hostname: '**.aliexpress.com' },
      // Amazon
      { protocol: 'https', hostname: 'images-amazon.com' },
      { protocol: 'https', hostname: '**.images-amazon.com' },
      { protocol: 'https', hostname: 'm.media-amazon.com' },
      { protocol: 'https', hostname: 'images-na.ssl-images-amazon.com' },
      // Alibaba
      { protocol: 'https', hostname: '**.alibaba.com' },
      { protocol: 'https', hostname: '**.alibabaimg.com' },
    ],
  },
};

export default withSentryConfig(nextConfig, {
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT || 'konvert',

  // Upload des source maps uniquement en CI/prod (pas en dev local)
  silent: !process.env.CI,

  // Tunnel Sentry via notre domaine (contourne les bloqueurs de pubs)
  tunnelRoute: '/monitoring',

  // Cacher les source maps des bundles client (ne pas les exposer publiquement)
  sourcemaps: {
    disable: false,        // uploader vers Sentry
    deleteSourcemapsAfterUpload: true,  // supprimer du bundle déployé
  },

  // Réduire le bruit de build
  automaticVercelMonitors: false,
})
