import type { ScrapedProduct } from '@/types'

// Produit mock AliExpress pour tester la pipeline IA sans scraper
// Remplacer par le vrai scraper une fois la pipeline validée

export const MOCK_PRODUCT: ScrapedProduct = {
  title: "Montre Connectée Sport Pro — Étanche IP68, GPS, Suivi Cardiaque",
  description: `Montre intelligente multifonction avec suivi de santé en temps réel.
    Résistante à l'eau IP68, autonomie 7 jours, compatible iOS et Android.
    Affichage AMOLED 1.8 pouces, GPS intégré, 100+ modes sportifs.
    Notifications intelligentes, contrôle de la musique, podomètre, oxymètre.
    Bracelet silicone confortable, remplacement facile, disponible en 6 couleurs.`,
  images: [
    "https://ae01.alicdn.com/kf/watch-sport-1.jpg",
    "https://ae01.alicdn.com/kf/watch-sport-2.jpg",
    "https://ae01.alicdn.com/kf/watch-sport-3.jpg",
  ],
  price: "29.99",
  original_price: "59.99",
  variants: [
    { name: "Couleur", values: ["Noir", "Blanc", "Bleu", "Rouge", "Vert", "Or"] },
    { name: "Taille du bracelet", values: ["S/M (130-170mm)", "L/XL (170-210mm)"] },
  ],
  rating: 4.6,
  reviews_count: 12847,
  source_url: "https://fr.aliexpress.com/item/mock-product.html",
}
