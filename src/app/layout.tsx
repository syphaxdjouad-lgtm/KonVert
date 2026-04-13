import type { Metadata } from "next";
import "./globals.css";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://konvert.app'

export const metadata: Metadata = {
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
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
