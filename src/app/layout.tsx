import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    template: '%s | KONVERT',
    default: 'KONVERT — Pages produit haute conversion en 30 secondes',
  },
  description: "Générez des landing pages haute conversion depuis n'importe quelle URL AliExpress, Amazon ou Alibaba. Publiez directement sur Shopify ou WooCommerce en 1 clic.",
  keywords: ['landing page', 'dropshipping', 'shopify', 'woocommerce', 'conversion', 'IA', 'aliexpress', 'amazon'],
  openGraph: {
    title: 'KONVERT — Pages produit haute conversion en 30 secondes',
    description: "Générez des landing pages haute conversion depuis n'importe quelle URL produit.",
    type: 'website',
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
