import { MetadataRoute } from 'next'
import { allArticles } from '@/lib/blog'

// Trim défensif : si la var Vercel a un \n ou un espace en suffixe (déjà vu en prod),
// le sitemap se retrouve avec des URLs cassées que Google ignore.
const APP_URL = (process.env.NEXT_PUBLIC_APP_URL || 'https://konvert.app').trim()

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: APP_URL,                       lastModified: new Date(), changeFrequency: 'weekly',  priority: 1   },
    { url: `${APP_URL}/features`,         lastModified: new Date(), changeFrequency: 'monthly', priority: 0.9 },
    { url: `${APP_URL}/pricing`,          lastModified: new Date(), changeFrequency: 'monthly', priority: 0.9 },
    { url: `${APP_URL}/templates`,        lastModified: new Date(), changeFrequency: 'monthly', priority: 0.85 },
    { url: `${APP_URL}/demo`,             lastModified: new Date(), changeFrequency: 'monthly', priority: 0.85 },
    { url: `${APP_URL}/essai`,            lastModified: new Date(), changeFrequency: 'monthly', priority: 0.85 },
    { url: `${APP_URL}/blog`,             lastModified: new Date(), changeFrequency: 'weekly',  priority: 0.9 },
    { url: `${APP_URL}/services`,         lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${APP_URL}/agence`,           lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${APP_URL}/about`,            lastModified: new Date(), changeFrequency: 'yearly',  priority: 0.6 },
    { url: `${APP_URL}/contact`,          lastModified: new Date(), changeFrequency: 'yearly',  priority: 0.6 },
    { url: `${APP_URL}/testimonials`,     lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${APP_URL}/integrations`,     lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${APP_URL}/changelog`,        lastModified: new Date(), changeFrequency: 'monthly', priority: 0.4 },
  ]

  const blogRoutes: MetadataRoute.Sitemap = allArticles.map((article) => ({
    url: `${APP_URL}/blog/${article.slug}`,
    lastModified: new Date(article.updatedISO),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }))

  return [...staticRoutes, ...blogRoutes]
}
