import type { NextConfig } from "next";
import { withSentryConfig } from '@sentry/nextjs'

// Headers communs à toutes les routes (sauf CSP, qui varie selon la zone)
const commonHeaders = [
  // Empêche l'embedding dans des iframes (clickjacking)
  { key: 'X-Frame-Options', value: 'DENY' },
  // Empêche le MIME sniffing
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  // Limite les infos de référent envoyées aux sites tiers
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  // Désactive les APIs navigateur non utilisées
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
  // Force HTTPS pendant 1 an + preload (eligible HSTS Preload List)
  { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains; preload' },
]

const cspBase = {
  styleSrc: "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  imgSrc: "img-src 'self' data: blob: https:",
  fontSrc: "font-src 'self' data: https://fonts.gstatic.com",
  connectSrc:
    "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://api.stripe.com https://api.anthropic.com https://client.crisp.chat wss://client.relay.crisp.chat https://eu.i.posthog.com https://eu-assets.i.posthog.com https://us.i.posthog.com https://us-assets.i.posthog.com",
  frameSrc: 'frame-src https://js.stripe.com https://hooks.stripe.com https://game.crisp.chat',
  workerSrc: "worker-src 'self' blob:",
}

// CSP stricte : pas d'unsafe-eval. Appliquée partout sauf builder GrapesJS.
const strictCsp = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' https://js.stripe.com https://client.crisp.chat https://eu-assets.i.posthog.com https://us-assets.i.posthog.com",
  cspBase.styleSrc,
  cspBase.imgSrc,
  cspBase.fontSrc,
  cspBase.connectSrc,
  cspBase.frameSrc,
  cspBase.workerSrc,
].join('; ')

// CSP relaxée : autorise unsafe-eval (requis par GrapesJS).
// Limitée aux routes builder uniquement.
const builderCsp = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com https://client.crisp.chat https://eu-assets.i.posthog.com https://us-assets.i.posthog.com",
  cspBase.styleSrc,
  cspBase.imgSrc,
  cspBase.fontSrc,
  cspBase.connectSrc,
  cspBase.frameSrc,
  cspBase.workerSrc,
].join('; ')

const strictHeaders = [
  ...commonHeaders,
  { key: 'Content-Security-Policy', value: strictCsp },
]

const builderHeaders = [
  ...commonHeaders,
  { key: 'Content-Security-Policy', value: builderCsp },
]

const nextConfig: NextConfig = {
  compress: true,
  async headers() {
    return [
      // Builder GrapesJS — unsafe-eval requis (priorité d'évaluation : la 1re entrée matchante gagne)
      { source: '/dashboard/new/:path*', headers: builderHeaders },
      { source: '/dashboard/pages/:path*', headers: builderHeaders },
      { source: '/test-builder/:path*', headers: builderHeaders },
      // Reste de l'app : CSP stricte sans unsafe-eval
      { source: '/(.*)', headers: strictHeaders },
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
      // Unsplash (templates, blog, marketing)
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'plus.unsplash.com' },
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
