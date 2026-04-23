import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Space_Grotesk } from 'next/font/google'
import CrispChat from '@/components/CrispChat'

const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], weight: ['400','500','600','700'], variable: '--font-space-grotesk' })

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://konvert.app'

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#5B47F5',
}

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title: {
    template: '%s | KONVERT',
    default: 'KONVERT — Tes produits méritent des pages qui vendent',
  },
  description:
    'Génère ta fiche produit et landing page optimisées en 30 secondes. SEO, mobile, conversion — prêt à copier-coller sur ta boutique Shopify.',
  keywords: ['landing page', 'dropshipping', 'shopify', 'woocommerce', 'conversion', 'IA', 'aliexpress', 'amazon', 'fiche produit'],
  openGraph: {
    title: 'KONVERT — Tes produits méritent des pages qui vendent',
    description:
      'Génère ta fiche produit et landing page optimisées en 30 secondes. SEO, mobile, conversion — prêt à copier-coller sur ta boutique Shopify.',
    type: 'website',
    siteName: 'KONVERT',
    images: [{ url: `${APP_URL}/opengraph-image`, width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'KONVERT — Tes produits méritent des pages qui vendent',
    description:
      'Génère ta fiche produit et landing page optimisées en 30 secondes. SEO, mobile, conversion — prêt à copier-coller sur ta boutique Shopify.',
    images: [`${APP_URL}/opengraph-image`],
  },
  icons: {
    icon: [
      { url: '/favicon.ico', type: 'image/x-icon', sizes: '32x32' },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    apple: [
      { url: '/apple-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  alternates: {
    canonical: APP_URL,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="h-full antialiased">
      <body className={`min-h-full flex flex-col ${spaceGrotesk.variable}`}>{children}<CrispChat /></body>
    </html>
  );
}
