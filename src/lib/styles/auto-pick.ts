import type { StyleId } from './types'
import type { ProductType } from '@/lib/templates/index'
import { detectProductType } from '@/lib/templates/detect-product-type'

interface ProductInput {
  title?: string | null
  description?: string | null
  price?: number
}

/**
 * Suggests a StyleId from product metadata.
 *
 * Rules (in priority order):
 *   1. jewelry + price > 200 → luxe-noir
 *   2. luxury → luxe-noir
 *   3. per-category mapping
 *   4. no category detected → minimal-mono (safe neutral fallback)
 */
export function suggestStyle(product: ProductInput): StyleId {
  const type = detectProductType({ title: product.title, description: product.description })
  if (!type) return 'minimal-mono'

  // High-end jewelry wins over generic jewelry mapping
  if (type === 'jewelry' && (product.price ?? 0) > 200) return 'luxe-noir'
  if (type === 'luxury') return 'luxe-noir'

  const map: Record<Exclude<ProductType, 'luxury'>, StyleId> = {
    jewelry:   'soft',
    skincare:  'organic',
    beauty:    'soft',
    tech:      'apple-clean',
    wellness:  'organic',
    fashion:   'warm-neutral',
    home:      'editorial',
    pet:       'vibrant',
    universal: 'minimal-mono',
  }

  return map[type as Exclude<ProductType, 'luxury'>] ?? 'minimal-mono'
}
