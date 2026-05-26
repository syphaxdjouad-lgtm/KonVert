import { describe, it, expect } from 'vitest'
import { detectAngle } from './angle-detector'

describe('detectAngle', () => {
  it('detects front from LEFT/FRONT/SIDE', () => {
    expect(detectAngle('TR3MJBW080_SHOE_LEFT_GLOBAL.png')).toBe('front')
    expect(detectAngle('product_FRONT.jpg')).toBe('front')
    expect(detectAngle('img_SIDE_view.webp')).toBe('front')
  })
  it('detects back', () => {
    expect(detectAngle('product_BACK_view.png')).toBe('back')
  })
  it('detects detail from DETAIL/CLOSEUP/MACRO', () => {
    expect(detectAngle('shoe_DETAIL_close.jpg')).toBe('detail')
    expect(detectAngle('img_CLOSEUP_lace.png')).toBe('detail')
    expect(detectAngle('material_MACRO_zoom.webp')).toBe('detail')
  })
  it('detects lifestyle from LIFESTYLE/WORN/MODEL', () => {
    expect(detectAngle('shoes_LIFESTYLE_walking.jpg')).toBe('lifestyle')
    expect(detectAngle('product_WORN_outdoor.png')).toBe('lifestyle')
    expect(detectAngle('img_MODEL_pose.jpg')).toBe('lifestyle')
  })
  it('returns unknown if no pattern matches', () => {
    expect(detectAngle('IMG_4523.jpg')).toBe('unknown')
    expect(detectAngle('a8s7df6.png')).toBe('unknown')
  })
  it('is case-insensitive', () => {
    expect(detectAngle('product_back.png')).toBe('back')
    expect(detectAngle('PRODUCT_LIFESTYLE.JPG')).toBe('lifestyle')
  })
  it('handles full URLs', () => {
    expect(detectAngle('https://cdn.shopify.com/files/shoe_LEFT_v2.png?v=123')).toBe('front')
  })
})
