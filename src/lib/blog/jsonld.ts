import { BlogArticle } from './types'

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://konvert.app'

/** Generate JSON-LD BlogPosting schema for an article */
export function generateArticleJsonLd(article: BlogArticle) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: article.title,
    description: article.metaDescription,
    image: article.image,
    datePublished: article.dateISO,
    dateModified: article.updatedISO,
    author: {
      '@type': 'Organization',
      name: 'KONVERT',
      url: APP_URL,
      logo: {
        '@type': 'ImageObject',
        url: `${APP_URL}/icon-192.png`,
      },
    },
    publisher: {
      '@type': 'Organization',
      name: 'KONVERT',
      url: APP_URL,
      logo: {
        '@type': 'ImageObject',
        url: `${APP_URL}/icon-192.png`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${APP_URL}/blog/${article.slug}`,
    },
    url: `${APP_URL}/blog/${article.slug}`,
    keywords: article.keywords.join(', '),
    wordCount: Math.round(article.content.replace(/<[^>]*>/g, '').split(/\s+/).length),
    articleSection: article.category,
    inLanguage: 'fr-FR',
  }
}

/** Generate JSON-LD BreadcrumbList for blog pages */
export function generateBreadcrumbJsonLd(article?: BlogArticle) {
  const items = [
    { name: 'Accueil', url: APP_URL },
    { name: 'Blog', url: `${APP_URL}/blog` },
  ]

  if (article) {
    items.push({ name: article.title, url: `${APP_URL}/blog/${article.slug}` })
  }

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  }
}

/** Generate FAQ schema from article content (extracts details/summary elements) */
export function generateFaqJsonLd(article: BlogArticle) {
  const faqRegex = new RegExp('<summary[^>]*>(.*?)</summary>\\s*<p[^>]*>(.*?)</p>', 'gs')
  const faqs: { question: string; answer: string }[] = []

  let match
  while ((match = faqRegex.exec(article.content)) !== null) {
    faqs.push({
      question: match[1].replace(/<[^>]*>/g, '').trim(),
      answer: match[2].replace(/<[^>]*>/g, '').trim(),
    })
  }

  if (faqs.length === 0) return null

  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  }
}
