import { detectAngle, type Angle } from './angle-detector'

export interface ImagePool {
  primary: string
  all: string[]
  byAngle?: {
    front?: string
    back?: string
    detail?: string
    lifestyle?: string
  }
}

export function buildImagePool(images: string[]): ImagePool {
  if (images.length === 0) {
    return { primary: '', all: [], byAngle: {} }
  }

  const byAngle: ImagePool['byAngle'] = {}
  for (const img of images) {
    const angle = detectAngle(img)
    if (angle !== 'unknown' && !byAngle[angle]) {
      byAngle[angle] = img
    }
  }

  return {
    primary: images[0]!,
    all: images,
    byAngle,
  }
}

export type ImageSlot = Angle | 'any'

export function getImage(pool: ImagePool, slot: ImageSlot, index: number): string {
  if (pool.all.length === 0) return ''
  if (pool.all.length === 1) return pool.primary

  if (slot !== 'any' && slot !== 'unknown' && pool.byAngle?.[slot]) {
    return pool.byAngle[slot]!
  }

  return pool.all[index % pool.all.length]!
}
