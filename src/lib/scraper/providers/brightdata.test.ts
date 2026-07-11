import { describe, it, expect } from 'vitest'
import { extractProductFromHtml } from './brightdata'

// HTML AliExpress "hydraté" : og:title fournit le titre (curated), mais le prix,
// la note et la galerie ne vivent QUE dans window.runParams. Le bug historique :
// parseProductFromHtml réussissait sur og:title et renvoyait AVANT de lire
// runParams → prix/note/images perdus. On vérifie que la fusion les récupère.
const HTML_HYDRATED = `<!doctype html><html><head>
<meta property="og:title" content="Super Earbuds Pro 75H - AliExpress"/>
<meta property="og:image" content="https://ae01.alicdn.com/kf/og-main.jpg"/>
<meta property="og:description" content="Ecouteurs sans fil Bluetooth 5.4"/>
</head><body>
<script>window.runParams = {"data":{"titleModule":{"subject":"Super Earbuds Pro 75H"},"priceModule":{"formatedActivityPrice":"US $12.99","formatedPrice":"US $25.99"},"imageModule":{"imagePathList":["https://ae01.alicdn.com/kf/gallery-a.jpg","https://ae01.alicdn.com/kf/gallery-b.jpg"]},"feedbackModule":{"feedbackInfo":{"averageStar":"4.8","totalValidNum":312}}}};</script>
</body></html>`

// Page où runParams n'est pas hydraté (anti-bot partiel) : seul og:title/og:image
// sont là. On doit renvoyer un produit valide (titre + image) mais prix null,
// sans crasher ni tomber en erreur.
const HTML_OG_ONLY = `<!doctype html><html><head>
<meta property="og:title" content="Wireless Earbuds Sport - AliExpress"/>
<meta property="og:image" content="https://ae01.alicdn.com/kf/og-only.jpg"/>
</head><body></body></html>`

// Page splash anti-bot : le titre extrait = nom du domaine → produit invalide.
const HTML_BLOCKED = `<!doctype html><html><head><title>AliExpress</title></head><body></body></html>`

describe('extractProductFromHtml (BrightData / AliExpress)', () => {
  it('fusionne og:title + runParams : le prix vient de runParams même si og fournit le titre', () => {
    const { product } = extractProductFromHtml(HTML_HYDRATED)
    expect(product).not.toBeNull()
    expect(product!.title).toContain('Super Earbuds Pro')
    // prix courant = formatedActivityPrice (promo), prix barré = formatedPrice
    expect(product!.price).toBeTruthy()
    expect(product!.price).toContain('12.99')
    expect(product!.original_price).toContain('25.99')
    expect(product!.rating).toBe(4.8)
    expect(product!.reviews_count).toBe(312)
    // galerie runParams + og:image fusionnés
    expect(product!.images.length).toBeGreaterThanOrEqual(2)
  })

  it('renvoie un produit valide avec og:title seul (runParams absent), prix null', () => {
    const { product } = extractProductFromHtml(HTML_OG_ONLY)
    expect(product).not.toBeNull()
    expect(product!.title).toBe('Wireless Earbuds Sport')
    expect(product!.price).toBeNull()
    expect(product!.images.length).toBeGreaterThan(0)
  })

  it('rejette une page anti-bot dont le titre = nom du domaine', () => {
    const { product } = extractProductFromHtml(HTML_BLOCKED)
    expect(product).toBeNull()
  })
})
