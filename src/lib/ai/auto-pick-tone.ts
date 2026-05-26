import type { CopyTone } from '@/types/v3'
import { detectProductType } from '@/lib/templates/detect-product-type'

interface ProductInput {
  title?: string
  description?: string
  price?: number
}

/**
 * Sélectionne le ton optimal selon le produit.
 * - prix > 200€ + jewelry/luxury → premium
 * - skincare/wellness → educational
 * - tech → bold
 * - fashion/beauty → friendly
 * - default → friendly
 */
export function autoPickTone(product: ProductInput): CopyTone {
  const type = detectProductType({ title: product.title, description: product.description })

  if ((product.price ?? 0) > 200 && (type === 'jewelry' || type === 'luxury')) return 'premium'
  if (type === 'skincare' || type === 'wellness') return 'educational'
  if (type === 'tech') return 'bold'
  if (type === 'fashion' || type === 'beauty') return 'friendly'
  return 'friendly'
}
