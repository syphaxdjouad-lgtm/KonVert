#!/usr/bin/env tsx
/**
 * Génère des previews HTML du rendu V3 (renderPageV3, bypass auth) pour
 * QA visuelle rapide sur 3 produits × 3 styles, sans passer par le builder.
 *
 * Usage: npx tsx scripts/gen-v3-audit.ts
 * Sortie : fichiers HTML dans /tmp/v3-audit-*.html (ouvrir dans le navigateur).
 */
import { renderPageV3 } from '../src/lib/sections-v3/render-page'
import type { V3PageData } from '../src/types/v3'
import { writeFileSync } from 'fs'

const PRODUCTS: Array<{ id: string; base_style: 'soft' | 'apple-clean' | 'warm-neutral'; data: Omit<V3PageData, 'styleId'> }> = [
  {
    id: 'tech-casque',
    base_style: 'soft',
    data: {
      tone: 'auto',
      product: {
        title: 'Écouteurs TWS Pro X50',
        description: 'Écouteurs sans fil Bluetooth 5.3, réduction active du bruit -35dB, autonomie 40h avec boîtier, drivers 10mm, certification IPX5, latence ultra-faible 50ms.',
        price: '49€',
        rating: { value: 4.7, count: 2847 },
        category: 'tech',
        variants: [
          { name: 'Noir mat', recommended: true },
          { name: 'Blanc perle' },
          { name: 'Midnight Blue' },
        ],
      },
      images: [
        'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800',
        'https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=800',
        'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
      ],
      copy: {
        hero: { tagline: 'Le silence, redéfini.', subtagline: 'Musique pure, monde en pause.' },
        why_we_love: 'Parce que la vraie liberté sonore ne devrait pas coûter une fortune.',
        features: [
          { name: 'ANC -35dB', description: 'Isolation active certifiée pour open-space et transports' },
          { name: 'Bluetooth 5.3', description: 'Connexion instantanée, portée jusqu\'à 15m' },
          { name: 'Autonomie 40h', description: 'Recharge rapide 15min = 3h d\'écoute' },
        ],
        best_for: ['Travail en open-space', 'Voyage en train/avion', 'Séances sport intensives', 'Podcast & audiobooks'],
        faq: [
          { q: 'Compatible avec tous les smartphones ?', a: 'Oui, iOS 14+ et Android 8+. App dédiée disponible sur les deux plateformes.' },
          { q: 'L\'ANC fonctionne avec la musique OFF ?', a: 'Oui, le mode transparence et l\'ANC fonctionnent indépendamment de la lecture.' },
          { q: 'Livraison et retours ?', a: '48h en France. Retour gratuit sous 30 jours si l\'emballage est intact.' },
        ],
        how_it_works: [
          { step: 1, title: 'Ouvrez le boîtier', description: 'La connexion Bluetooth s\'active automatiquement à l\'ouverture.' },
          { step: 2, title: 'Choisissez votre mode', description: 'Appui long = ANC, double-appui = transparence.' },
          { step: 3, title: 'Profitez', description: 'Jusqu\'à 8h d\'autonomie par charge, 40h au total.' },
        ],
        reviews: [
          { author: 'Marie L.', initials: 'ML', rating: 5, title: 'Bluffant pour le prix !', text: 'L\'ANC est vraiment efficace en open-space. Je les porte 8h/jour sans fatigue.', date: 'il y a 3 jours', verified: true, variant: 'Noir mat' },
          { author: 'Thomas B.', initials: 'TB', rating: 5, title: 'Qualité audio top', text: 'Les basses sont profondes sans être envahissantes. Connection impeccable.', date: 'il y a 1 semaine', verified: true },
          { author: 'Sarah K.', initials: 'SK', rating: 4, title: 'Très bon rapport qualité/prix', text: 'Le confort est excellent. L\'ANC est légèrement moins fort qu\'un Sony mais pour le prix c\'est imbattable.', date: 'il y a 2 semaines', verified: true, photo_url: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=300' },
        ],
      },
    },
  },
  {
    id: 'beaute-serum',
    base_style: 'warm-neutral',
    data: {
      tone: 'auto',
      product: {
        title: 'Sérum Éclat Vitamine C 30ml',
        description: 'Sérum concentré 15% Vitamine C stabilisée, acide hyaluronique, niacinamide 5%. Éclaircit le teint, réduit les taches brunes en 4 semaines.',
        price: '39€',
        rating: { value: 4.8, count: 1563 },
        category: 'beauty',
      },
      images: [
        'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=800',
        'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800',
        'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=800',
      ],
      copy: {
        hero: { tagline: 'Ton éclat, dévoilé.', subtagline: 'Vitamine C 15% + Niacinamide pour un teint lumineux en 28 jours.' },
        why_we_love: 'Parce qu\'un sérum efficace ne devrait pas coûter une fortune ni irriter les peaux sensibles.',
        features: [
          { name: 'Vitamine C 15%', description: 'Forme ascorbate stable, non irritante, active la synthèse de collagène' },
          { name: 'Niacinamide 5%', description: 'Resserre les pores, unifie le teint, réduit les rougeurs' },
          { name: 'Acide Hyaluronique', description: '3 poids moléculaires pour une hydratation surface + profonde' },
        ],
        best_for: ['Peaux ternes manquant d\'éclat', 'Taches brunes post-acné', 'Teint fatigué hiver', 'Peaux sensibles cherchant douceur'],
        care: 'Appliquer le matin sur peau propre, avant la crème SPF. Conserver à l\'abri de la lumière.',
        faq: [
          { q: 'Convient aux peaux sensibles ?', a: 'Oui, testé dermatologiquement. La forme ascorbate évite les picotements.' },
          { q: 'À quelle fréquence utiliser ?', a: 'Matin uniquement, quotidiennement. Le soir, préférez un rétinol.' },
          { q: 'Résultats visibles en combien de temps ?', a: '80% des testeurs observent un éclat visible à 14 jours, 100% à 28 jours.' },
        ],
        reviews: [
          { author: 'Amélie R.', initials: 'AR', rating: 5, title: 'Ma peau a changé en 3 semaines', text: 'J\'avais des taches post-acné depuis 2 ans. Après 3 semaines, elles ont clairement estompé.', date: 'il y a 5 jours', verified: true, photo_url: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=300' },
          { author: 'Nadia B.', initials: 'NB', rating: 5, title: 'Non irritant même peau réactive', text: 'J\'ai peau très sensible, souvent les sérums vitamin C me piquent. Celui-ci zéro inconfort.', date: 'il y a 2 semaines', verified: true },
          { author: 'Claire M.', initials: 'CM', rating: 5, title: 'Le meilleur rapport qualité/prix du marché', text: 'J\'ai essayé Paula\'s Choice, Skinceuticals... Pour 4x moins cher j\'ai les mêmes résultats.', date: 'il y a 1 mois', verified: true },
        ],
      },
    },
  },
  {
    id: 'mode-sneaker',
    base_style: 'apple-clean',
    data: {
      tone: 'auto',
      product: {
        title: 'Sneaker Urban Runner Low',
        description: 'Sneaker lifestyle semelle EVA légère, tige mesh respirant double couche, memory foam intérieure. 7 coloris exclusifs.',
        price: '89€',
        rating: { value: 4.6, count: 984 },
        category: 'fashion',
        variants: [
          { name: 'Blanc/Gris' },
          { name: 'Noir/Or', recommended: true },
          { name: 'Terracotta' },
        ],
      },
      images: [
        'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800',
        'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800',
        'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=800',
      ],
      copy: {
        hero: { tagline: 'Marche. Cours. Vis.', subtagline: 'La sneaker qui suit ton rythme, du bureau à la rue.' },
        why_we_love: 'Parce que les meilleures sneakers ne sacrifient pas le style pour le confort.',
        features: [
          { name: 'Semelle EVA légère', description: '30% plus légère que la concurrence, amorti parfait toute la journée' },
          { name: 'Mesh respirant', description: 'Double couche anti-odeur, pied au frais même en été' },
          { name: 'Memory foam', description: 'Semelle intérieure amovible qui épouse la forme de votre pied' },
        ],
        best_for: ['Commute quotidien en ville', 'Séances sport légères', 'Voyages longue distance', 'Style casual-chic week-end'],
        care: 'Machine 30°C en filet. Pas de sèche-linge. Nettoyer les semelles à la brosse sèche.',
        faq: [
          { q: 'La pointure est-elle vraie ?', a: 'Oui, coupe standard. Si entre deux tailles, prenez la taille supérieure.' },
          { q: 'Résistant à la pluie ?', a: 'Traitement déperlant en usine, résistant aux légères averses. Pas pluie battante.' },
          { q: 'Délais de livraison ?', a: '24-48h en France. Livraison gratuite dès 49€. Retour gratuit sous 30 jours.' },
        ],
        how_it_works: [
          { step: 1, title: 'Choisissez votre coloris', description: 'Disponible en 7 teintes exclusives, conçues par notre studio design interne.' },
          { step: 2, title: 'Commandez avant 14h', description: 'Expédition le jour même, livraison J+1 en France.' },
          { step: 3, title: 'Portez dès le premier jour', description: 'Aucune période de rodage. La memory foam s\'adapte instantanément.' },
        ],
        reviews: [
          { author: 'Lucas D.', initials: 'LD', rating: 5, title: 'Confort incroyable', text: 'Je les porte 10h/jour entre bureau et sorties. Aucune fatigue aux pieds.', date: 'il y a 4 jours', verified: true, photo_url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300' },
          { author: 'Emma S.', initials: 'ES', rating: 5, title: 'Stylées ET confortables !', text: 'Enfin une sneaker qui ne fait pas "sport" mais qui tient aussi bien. La coloris Noir/Or est sublime.', date: 'il y a 2 semaines', verified: true, variant: 'Noir/Or' },
          { author: 'Hugo M.', initials: 'HM', rating: 4, title: 'Légères comme des chaussettes', text: 'La légèreté est bluffante. Je retire une étoile car le traitement déperlant s\'estompe après 2 mois.', date: 'il y a 1 mois', verified: true },
        ],
      },
    },
  },
]

const STYLES: Array<'soft' | 'apple-clean' | 'warm-neutral'> = ['soft', 'apple-clean', 'warm-neutral']

const index: string[] = []

for (const { id, data } of PRODUCTS) {
  for (const styleId of STYLES) {
    const pageData: V3PageData = { ...data, styleId }
    const html = renderPageV3(styleId, pageData)
    const filename = `/tmp/v3-audit-${id}-${styleId}.html`
    writeFileSync(filename, html, 'utf-8')
    const sections = (html.match(/<section/g) ?? []).length
    index.push(`file://${filename}`)
    console.log(`OK ${id} x ${styleId} — ${sections} sections, ${html.length} chars`)
  }
}

console.log('\nFILES:')
index.forEach(f => console.log(f))
