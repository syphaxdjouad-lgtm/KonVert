import { Metadata } from 'next'
import { allArticles, getAllCategories } from '@/lib/blog'
import { generateBreadcrumbJsonLd } from '@/lib/blog/jsonld'
import { generateMetadata as genMeta } from '@/lib/metadata'
import BlogListClient from './BlogListClient'

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://konvert.app'

/* ── Metadata ─────────────────────────────────────────────────────────────── */

export const metadata: Metadata = {
  ...genMeta({
    title: 'Blog E-commerce & Dropshipping | KONVERT',
    description:
      'Guides SEO, tutoriels Shopify, stratégies de conversion et conseils dropshipping. Tout pour vendre plus avec vos landing pages e-commerce.',
    path: '/blog',
  }),
  keywords: [
    'blog e-commerce',
    'conseils dropshipping',
    'optimiser taux de conversion',
    'landing page e-commerce',
    'SEO dropshipping',
    'shopify tutoriel',
    'fiche produit',
    'copywriting e-commerce',
  ],
  robots: {
    index: true,
    follow: true,
    'max-snippet': -1,
    'max-image-preview': 'large' as const,
    'max-video-preview': -1,
  },
}

/* ── Page (Server Component) ──────────────────────────────────────────────── */

export default function BlogPage() {
  const categories = getAllCategories()
  const breadcrumbJsonLd = generateBreadcrumbJsonLd()

  // Blog listing JSON-LD
  const blogJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: 'Blog KONVERT',
    description: 'Guides pratiques et stratégies pour le e-commerce et le dropshipping.',
    url: `${APP_URL}/blog`,
    publisher: {
      '@type': 'Organization',
      name: 'KONVERT',
      url: APP_URL,
    },
    blogPost: allArticles.map((a) => ({
      '@type': 'BlogPosting',
      headline: a.title,
      url: `${APP_URL}/blog/${a.slug}`,
      datePublished: a.dateISO,
      image: a.image,
    })),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogJsonLd) }}
      />
      <BlogListClient articles={allArticles} categories={categories} />
    </>
  )
}
