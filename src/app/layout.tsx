import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://konvert.app'

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title: {
    default: 'KONVERT — Génère des landing pages e-commerce qui convertissent en 30 secondes',
    template: '%s | KONVERT',
  },
  description: 'Colle une URL produit AliExpress, Amazon ou Alibaba et KONVERT génère une landing page haute conversion en 30 secondes grâce à l\'IA. Publie directement sur Shopify ou WooCommerce.',
  keywords: [
    'landing page e-commerce',
    'générateur page produit IA',
    'optimisation conversion dropshipping',
    'page produit Shopify',
    'page produit WooCommerce',
    'IA copywriting e-commerce',
    'KONVERT',
    'augmenter CTR boutique en ligne',
  ],
  authors: [{ name: 'KONVERT' }],
  creator: 'KONVERT',
  publisher: 'KONVERT',
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    url: APP_URL,
    siteName: 'KONVERT',
    title: 'KONVERT — Génère des landing pages e-commerce en 30 secondes',
    description: 'Colle une URL produit et obtiens une page haute conversion prête à publier sur Shopify ou WooCommerce. Propulsé par l\'IA Claude.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'KONVERT — Générateur de landing pages e-commerce IA',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'KONVERT — Landing pages e-commerce en 30 secondes',
    description: 'Colle une URL produit, KONVERT génère ta page haute conversion grâce à l\'IA.',
    images: ['/og-image.jpg'],
    creator: '@konvert_app',
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
  alternates: {
    canonical: APP_URL,
    languages: { 'fr-FR': APP_URL },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
