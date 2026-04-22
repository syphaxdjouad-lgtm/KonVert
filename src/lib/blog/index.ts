import { BlogArticle } from './types'
import { articlesPart1 } from './articles-part1'
import { articlesPart2 } from './articles-part2'

export type { BlogArticle }

/** All blog articles sorted by date (newest first) */
export const allArticles: BlogArticle[] = [...articlesPart1, ...articlesPart2].sort(
  (a, b) => new Date(b.dateISO).getTime() - new Date(a.dateISO).getTime()
)

/** Get a single article by slug */
export function getArticleBySlug(slug: string): BlogArticle | undefined {
  return allArticles.find((a) => a.slug === slug)
}

/** Get all slugs (for generateStaticParams) */
export function getAllSlugs(): string[] {
  return allArticles.map((a) => a.slug)
}

/** Get related articles (same category, excluding current) */
export function getRelatedArticles(slug: string, limit = 3): BlogArticle[] {
  const current = getArticleBySlug(slug)
  if (!current) return allArticles.filter((a) => a.slug !== slug).slice(0, limit)

  const sameCategory = allArticles.filter(
    (a) => a.slug !== slug && a.category === current.category
  )
  const others = allArticles.filter(
    (a) => a.slug !== slug && a.category !== current.category
  )

  return [...sameCategory, ...others].slice(0, limit)
}

/** Get all unique categories */
export function getAllCategories(): string[] {
  const cats = new Set(allArticles.map((a) => a.category))
  return ['Tous', ...Array.from(cats)]
}
