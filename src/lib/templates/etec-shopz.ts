import type { LandingPageData } from '@/types'

import {
  renderRichSections,
  renderHeroThumbs,
  type SectionTheme,
} from './sections'

// ─── I18N ────────────────────────────────────────────────────────────────────

const T: Record<string, Record<string, string>> = {
  promo_bar:            { fr: '🎁 Promo — Obtenez 25% de cashback sur votre première commande', en: '🎁 Promo — Get 25% Cash Back on your first order', ar: '🎁 عرض — احصل على استرداد 25% على طلبك الأول', es: '🎁 Promo — Obtén 25% de reembolso en tu primer pedido' },
  nav_home:             { fr: 'Accueil', en: 'Home', ar: 'الرئيسية', es: 'Inicio' },
  nav_catalogue:        { fr: 'Catalogue', en: 'Catalogue', ar: 'الكتالوج', es: 'Catálogo' },
  nav_new:              { fr: 'Nouveautés', en: 'New Arrivals', ar: 'الوافدون الجدد', es: 'Novedades' },
  nav_promo:            { fr: 'Promotions', en: 'Promotions', ar: 'العروض', es: 'Promociones' },
  breadcrumb_products:  { fr: 'Produits', en: 'Products', ar: 'المنتجات', es: 'Productos' },
  badge_sold:           { fr: 'ventes', en: 'Sold', ar: 'مباع', es: 'vendidos' },
  badge_reviews:        { fr: 'avis', en: 'reviews', ar: 'تقييم', es: 'reseñas' },
  label_color:          { fr: 'Couleur :', en: 'Color:', ar: 'اللون :', es: 'Color:' },
  label_size:           { fr: 'Taille :', en: 'Size:', ar: 'المقاس :', es: 'Talla:' },
  color_green:          { fr: 'Vert', en: 'Green', ar: 'أخضر', es: 'Verde' },
  color_beige:          { fr: 'Beige sable', en: 'Sand Beige', ar: 'بيج رملي', es: 'Beige arena' },
  color_grey:           { fr: 'Gris ardoise', en: 'Slate Grey', ar: 'رمادي أردوازي', es: 'Gris pizarra' },
  size_xs:              { fr: 'XS', en: 'XS', ar: 'XS', es: 'XS' },
  size_s:               { fr: 'S', en: 'S', ar: 'S', es: 'S' },
  size_m:               { fr: 'M', en: 'M', ar: 'M', es: 'M' },
  size_l:               { fr: 'L', en: 'L', ar: 'L', es: 'L' },
  size_xl:              { fr: 'XL', en: 'XL', ar: 'XL', es: 'XL' },
  size_xxl:             { fr: 'XXL', en: 'XXL', ar: 'XXL', es: 'XXL' },
  size_xsmall:          { fr: 'Très petit', en: 'XSmall', ar: 'صغير جداً', es: 'XPequeño' },
  size_small:           { fr: 'Petit', en: 'Small', ar: 'صغير', es: 'Pequeño' },
  size_medium:          { fr: 'Moyen', en: 'Medium', ar: 'وسط', es: 'Mediano' },
  size_large:           { fr: 'Grand', en: 'Large', ar: 'كبير', es: 'Grande' },
  size_xlarge:          { fr: 'Très grand', en: 'XLarge', ar: 'كبير جداً', es: 'XGrande' },
  size_xxlarge:         { fr: 'XXL', en: 'XXLarge', ar: 'XXL', es: 'XXGrande' },
  btn_buy:              { fr: 'Acheter maintenant', en: 'Buy this Item', ar: 'اشترِ الآن', es: 'Comprar ahora' },
  btn_chat:             { fr: 'Chat', en: 'Chat', ar: 'محادثة', es: 'Chat' },
  btn_wishlist:         { fr: 'Favoris', en: 'Wishlist', ar: 'المفضلة', es: 'Favoritos' },
  btn_share:            { fr: 'Partager', en: 'Share', ar: 'مشاركة', es: 'Compartir' },
  btn_added_cart:       { fr: '✓ Ajouté au panier', en: '✓ Added to Cart', ar: '✓ تمت الإضافة', es: '✓ Añadido al carrito' },
  btn_add_wishlist:     { fr: 'Ajouter aux favoris', en: 'Add to Wishlist', ar: 'أضف إلى المفضلة', es: 'Añadir a favoritos' },
  tab_details:          { fr: 'Détails', en: 'Details', ar: 'التفاصيل', es: 'Detalles' },
  tab_reviews:          { fr: 'Avis', en: 'Reviews', ar: 'التقييمات', es: 'Reseñas' },
  tab_discussion:       { fr: 'Discussion', en: 'Discussion', ar: 'النقاش', es: 'Discusión' },
  details_title:        { fr: 'Détails du produit', en: 'Product Details', ar: 'تفاصيل المنتج', es: 'Detalles del producto' },
  detail_quality:       { fr: 'Matériaux de haute qualité', en: 'Premium quality materials', ar: 'مواد عالية الجودة', es: 'Materiales de alta calidad' },
  detail_comfort:       { fr: 'Confort optimal pour une utilisation quotidienne', en: 'Optimal comfort for everyday use', ar: 'راحة مثلى للاستخدام اليومي', es: 'Comodidad óptima para uso diario' },
  detail_care:          { fr: 'Entretien facile', en: 'Easy care', ar: 'سهل العناية', es: 'Fácil cuidado' },
  detail_variants:      { fr: 'Disponible en plusieurs variantes', en: 'Available in multiple variants', ar: 'متوفر بعدة خيارات', es: 'Disponible en múltiples variantes' },
  detail_sustainable:   { fr: 'Matériaux responsables et durables', en: 'Responsible and sustainable materials', ar: 'مواد مسؤولة ومستدامة', es: 'Materiales responsables y sostenibles' },
  reviews_title:        { fr: 'Avis clients', en: 'Reviews', ar: 'التقييمات', es: 'Reseñas' },
  reviews_showing:      { fr: 'Affichage de 5 sur 225 avis', en: 'Showing 5 from 225 reviews', ar: 'عرض 5 من 225 تقييم', es: 'Mostrando 5 de 225 reseñas' },
  reviews_sort_latest:  { fr: 'Plus récents ↓', en: 'Latest ↓', ar: 'الأحدث ↓', es: 'Más recientes ↓' },
  reviews_sort_top:     { fr: 'Mieux notés', en: 'Highest Rated', ar: 'الأعلى تقييماً', es: 'Mejor valorados' },
  reviews_sort_helpful: { fr: 'Plus utiles', en: 'Most Helpful', ar: 'الأكثر فائدة', es: 'Más útiles' },
  reviews_show_all:     { fr: 'Voir tous les avis', en: 'Show all reviews', ar: 'عرض جميع التقييمات', es: 'Ver todas las reseñas' },
  review_reply:         { fr: 'Répondre', en: 'Reply', ar: 'رد', es: 'Responder' },
  reviews_based_on:     { fr: 'Basé sur 225 avis', en: 'Based on 225 reviews', ar: 'بناءً على 225 تقييم', es: 'Basado en 225 reseñas' },
  discussion_empty:     { fr: 'Aucune discussion pour l\'instant. Soyez le premier à démarrer une conversation.', en: 'No discussions yet. Be the first to start a conversation about this product.', ar: 'لا توجد نقاشات بعد. كن أول من يبدأ محادثة.', es: 'Sin discusiones aún. Sé el primero en iniciar una conversación.' },
  related_title:        { fr: 'Vous pourriez aimer', en: 'You Might Like This Product', ar: 'قد يعجبك أيضاً', es: 'También te puede gustar' },
  related_badge_new:    { fr: 'Nouveauté', en: 'New Arrivals', ar: 'وصل حديثاً', es: 'Novedades' },
  footer_brand_desc:    { fr: 'Produits premium sélectionnés pour leur qualité et leur exclusivité.', en: 'Premium products selected for their quality and exclusivity.', ar: 'منتجات مميزة مختارة بعناية لجودتها وحصريتها.', es: 'Productos premium seleccionados por su calidad y exclusividad.' },
  footer_about:         { fr: 'À propos', en: 'About Us', ar: 'من نحن', es: 'Sobre nosotros' },
  footer_information:   { fr: 'Informations', en: 'Information', ar: 'معلومات', es: 'Información' },
  footer_store_locator: { fr: 'Trouver un magasin', en: 'Store Locator', ar: 'أماكن المتاجر', es: 'Localizador de tiendas' },
  footer_bulk:          { fr: 'Achat en gros', en: 'Bulk Purchase', ar: 'شراء بالجملة', es: 'Compra al por mayor' },
  footer_alteration:    { fr: 'Service de retouche', en: 'Alteration Service', ar: 'خدمة التعديل', es: 'Servicio de modificaciones' },
  footer_gift:          { fr: 'Livraison cadeau', en: 'Gift Delivery', ar: 'توصيل الهدايا', es: 'Entrega de regalos' },
  footer_live:          { fr: 'Live Station', en: 'Live Station', ar: 'البث المباشر', es: 'Live Station' },
  footer_help:          { fr: 'Aide', en: 'Help', ar: 'المساعدة', es: 'Ayuda' },
  footer_faq:           { fr: 'FAQ', en: 'FAQ', ar: 'الأسئلة الشائعة', es: 'FAQ' },
  footer_guide:         { fr: 'Guide d\'achat en ligne', en: 'Online Shopping Guide', ar: 'دليل التسوق عبر الإنترنت', es: 'Guía de compras online' },
  footer_return:        { fr: 'Politique de retour', en: 'Return Policy', ar: 'سياسة الإرجاع', es: 'Política de devoluciones' },
  footer_privacy:       { fr: 'Politique de confidentialité', en: 'Privacy Policy', ar: 'سياسة الخصوصية', es: 'Política de privacidad' },
  footer_accessibility: { fr: 'Accessibilité', en: 'Accessibility', ar: 'إمكانية الوصول', es: 'Accesibilidad' },
  footer_contact:       { fr: 'Nous contacter', en: 'Contact Us', ar: 'اتصل بنا', es: 'Contáctanos' },
  footer_account:       { fr: 'Mon compte', en: 'Account', ar: 'حسابي', es: 'Cuenta' },
  footer_membership:    { fr: 'Adhésion', en: 'Membership', ar: 'العضوية', es: 'Membresía' },
  footer_profile:       { fr: 'Profil', en: 'Profile', ar: 'الملف الشخصي', es: 'Perfil' },
  footer_coupons:       { fr: 'Coupons', en: 'Coupons', ar: 'كوبونات', es: 'Cupones' },
  footer_social:        { fr: 'Réseaux sociaux', en: 'Social Media', ar: 'وسائل التواصل', es: 'Redes sociales' },
  footer_copy:          { fr: '©Shopz 2026. Tous droits réservés.', en: '©Shopz 2026. All rights reserved.', ar: '©Shopz 2026. جميع الحقوق محفوظة.', es: '©Shopz 2026. Todos los derechos reservados.' },
  footer_terms:         { fr: 'Conditions générales', en: 'Terms and Conditions', ar: 'الشروط والأحكام', es: 'Términos y condiciones' },
  img_view:             { fr: 'Vue', en: 'View', ar: 'صورة', es: 'Vista' },
  img_more:             { fr: '+4 autres', en: '+4 more', ar: '+4 المزيد', es: '+4 más' },
  aria_stars:           { fr: 'étoiles', en: 'stars', ar: 'نجوم', es: 'estrellas' },
}

function t(key: string, lang: string = 'fr'): string {
  return T[key]?.[lang] ?? T[key]?.['fr'] ?? key
}

// ─── FALLBACK IMAGES — menswear premium ───────────────────────────────────────

const IMGS_FALLBACK = [
  'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=800&q=80',
  'https://images.unsplash.com/photo-1611911813383-67769b37a149?w=800&q=80',
  'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=800&q=80',
  'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800&q=80',
  'https://images.unsplash.com/photo-1578932750294-f5075e85f44a?w=800&q=80',
  'https://images.unsplash.com/photo-1516826957135-700dedea698c?w=800&q=80',
]

const RELATED_FALLBACK = [
  'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=400&q=80',
  'https://images.unsplash.com/photo-1485462537746-965f33f7f6a7?w=400&q=80',
  'https://images.unsplash.com/photo-1543076447-215ad9ba6923?w=400&q=80',
  'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=400&q=80',
]

const C = {
  bg:         '#EEF0F2',
  white:      '#FFFFFF',
  green:      '#1A5C30',
  greenLight: '#E8F2EC',
  text:       '#1A1A1A',
  muted:      '#6B6B6B',
  border:     '#E5E5E5',
  promo:      '#8B6914',
  pink:       '#D63370',
  star:       '#F59E0B',
  footer:     '#1F3D2B',
}

const ICON_SEARCH      = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>`
const ICON_BELL        = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>`
const ICON_HEART       = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>`
const ICON_CART        = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>`
const ICON_PLUS        = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>`
const ICON_SHARE       = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/></svg>`
const ICON_CHAT        = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>`
const ICON_ARROW_LEFT  = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>`
const ICON_ARROW_RIGHT = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>`
const ICON_THUMB_UP    = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3H14z"/><path d="M7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/></svg>`
const ICON_THUMB_DOWN  = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3H10z"/><path d="M17 2h2.67A2.31 2.31 0 0 1 22 4v7a2.31 2.31 0 0 1-2.33 2H17"/></svg>`
const ICON_TWITTER     = `<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>`
const ICON_FACEBOOK    = `<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>`
const ICON_INSTAGRAM   = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>`
const ICON_YOUTUBE     = `<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>`

function stars(count: number): string {
  return Array.from({ length: 5 }, (_, i) =>
    `<span style="color:${i < count ? C.star : '#D1D5DB'}">&#9733;</span>`
  ).join('')
}

const AVATAR_COLORS = ['#7C3AED', '#0891B2', '#D97706', '#DC2626', '#059669']

function avatarInitials(name: string, index: number): string {
  const initials = name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
  const bg = AVATAR_COLORS[index % AVATAR_COLORS.length]
  return `<div style="width:40px;height:40px;border-radius:50%;background:${bg};display:flex;align-items:center;justify-content:center;flex-shrink:0;font-size:13px;font-weight:700;color:#fff;letter-spacing:0.03em;">${initials}</div>`
}

const REVIEW_DIST = [
  { star: 5, count: 184, pct: 82 },
  { star: 4, count: 63,  pct: 28 },
  { star: 3, count: 29,  pct: 13 },
  { star: 2, count: 7,   pct: 3  },
  { star: 1, count: 2,   pct: 1  },
]

const RELATED_PRODUCTS = [
  { name: 'Collection Essentielle Vol.1', price: '$98',  orig: '$129', badge: 'Nouveauté', rating: '4.8', reviews: '143' },
  { name: 'Collection Essentielle Vol.2', price: '$76',  orig: '$99',  badge: 'Nouveauté', rating: '4.9', reviews: '201' },
  { name: 'Édition Signature',            price: '$115', orig: '$149', badge: null,        rating: '4.7', reviews: '87'  },
  { name: 'Pack Premium',                 price: '$89',  orig: '$119', badge: 'Nouveauté', rating: '4.9', reviews: '312' },
]

const SHOPZ_THEME: SectionTheme = {
  primary:    '#1a5c30',
  accent:     '#edf2ee',
  text:       '#1a1a2e',
  textMuted:  '#6E6E73',
  bg:         '#ffffff',
  bgAlt:      '#F5F5F7',
  border:     '#E8E8ED',
  fontFamily: "'Inter',sans-serif",
  radius:     '16px',
}

export function templateEtecShopz(data: LandingPageData): string {
  const lang   = data.language ?? 'fr'
  const img    = (i: number) => data.images?.[i] || IMGS_FALLBACK[i % IMGS_FALLBACK.length]
  const relImg = (i: number) => RELATED_FALLBACK[i % RELATED_FALLBACK.length]

  const productName   = data.product_name   || 'Produit Premium'
  const subtitle      = data.subtitle       || 'Un produit conçu avec soin pour la qualité et le confort au quotidien.'
  const price         = data.price          || '$122'
  const originalPrice = data.original_price || '$156'
  const ctaText       = data.cta            || 'Ajouter au panier'

  const rawTestimonials = data.faq?.slice(0, 5) || []
  const testimonials = [
    { author: rawTestimonials[0]?.question || 'James Gouse',       rating: 5, text: rawTestimonials[0]?.answer || 'Conforme à la description. Excellente qualité et très confortable au quotidien.' },
    { author: rawTestimonials[1]?.question || 'Guy Hawkins',        rating: 5, text: rawTestimonials[1]?.answer || 'Super produit, la qualité est excellente et la livraison rapide. Très satisfait de cet achat.' },
    { author: rawTestimonials[2]?.question || 'Brooklyn Simmons',   rating: 5, text: rawTestimonials[2]?.answer || 'J\'adore la qualité. C\'est très bien fabriqué. J\'en ai déjà recommandé deux pour des amis.' },
    { author: rawTestimonials[3]?.question || 'Courtney Henry',     rating: 5, text: rawTestimonials[3]?.answer || 'Vraiment ravi. La qualité est irréprochable et ça reçoit des compliments à chaque fois.' },
    { author: rawTestimonials[4]?.question || 'Cameron Williamson', rating: 5, text: rawTestimonials[4]?.answer || 'Produit exceptionnel. Il tient toutes ses promesses et la finition est superbe.' },
  ]

  const thumbsHTML = Array.from({ length: 5 }, (_, i) => {
    const isLast = i === 4
    return `
          <div class="gallery-thumb${i === 0 ? ' active' : ''}" data-idx="${i}" onclick="selectImg(${i})" role="button" tabindex="0" aria-label="${t('img_view', lang)} ${i + 1}" onkeydown="if(event.key==='Enter')selectImg(${i})">
            <img src="${img(i)}" alt="${t('img_view', lang)} ${i + 1}" loading="lazy">
            ${isLast ? `<div class="thumb-more">${t('img_more', lang)}</div>` : ''}
          </div>`
  }).join('')

  const reviewsHTML = testimonials.map((rev, i) => `
          <div class="review-item">
            <div class="review-header">
              ${avatarInitials(rev.author, i)}
              <div class="review-meta">
                <span class="review-author">${rev.author}</span>
                <div class="review-stars" aria-label="${rev.rating} ${t('aria_stars', lang)}">${stars(rev.rating)}</div>
              </div>
            </div>
            <p class="review-text">${rev.text}</p>
            <div class="review-actions">
              <button class="review-action-btn">${t('review_reply', lang)}</button>
              <button class="review-action-btn thumb-btn">${ICON_THUMB_UP} <span>${6 + i}</span></button>
              <button class="review-action-btn thumb-btn">${ICON_THUMB_DOWN} <span>0</span></button>
            </div>
          </div>`).join('')

  const barsHTML = REVIEW_DIST.map(r => `
            <div class="dist-row">
              <span class="dist-label">${r.star} ${stars(1)}</span>
              <div class="dist-bar-wrap"><div class="dist-bar-fill" style="width:${r.pct}%"></div></div>
              <span class="dist-count">${r.count}</span>
            </div>`).join('')

  const relatedHTML = RELATED_PRODUCTS.map((p, i) => `
          <div class="related-card">
            <div class="related-img-wrap">
              <img src="${relImg(i)}" alt="${p.name}" loading="lazy">
              ${p.badge ? `<span class="related-badge">${t('related_badge_new', lang)}</span>` : ''}
              <button class="related-heart" aria-label="${t('btn_add_wishlist', lang)}">${ICON_HEART}</button>
            </div>
            <div class="related-info">
              <p class="related-name">${p.name}</p>
              <div class="related-stars">${stars(5)} <span class="related-stars-text">${p.rating} (${p.reviews} ${t('badge_reviews', lang)})</span></div>
              <div class="related-pricing">
                <span class="related-price">${p.price}</span>
                <span class="related-orig">${p.orig}</span>
              </div>
            </div>
          </div>`).join('')

  const allImgsJson = JSON.stringify(Array.from({ length: 6 }, (_, i) => img(i)))

  return `<!DOCTYPE html>
<html lang="${data.language || 'fr'}" dir="${data.language === 'ar' ? 'rtl' : 'ltr'}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${productName} — Shopz</title>
  <meta name="description" content="${subtitle}">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <style>
    *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
    html { scroll-behavior: smooth; }
    body { font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: ${C.bg}; color: ${C.text}; -webkit-font-smoothing: antialiased; overflow-x: hidden; font-size: 14px; line-height: 1.6; }
    img { display: block; max-width: 100%; }
    a { text-decoration: none; color: inherit; }
    button { cursor: pointer; border: none; background: none; font-family: inherit; }
    ul { list-style: none; }

    .promo-bar { background: ${C.promo}; color: #fff; text-align: center; padding: 10px 24px; font-size: 13px; font-weight: 500; letter-spacing: 0.01em; }

    .nav { position: sticky; top: 0; z-index: 200; background: ${C.white}; border-bottom: 1px solid ${C.border}; display: flex; align-items: center; justify-content: space-between; padding: 0 48px; height: 64px; gap: 24px; }
    .nav-logo { font-size: 22px; font-weight: 700; color: ${C.green}; letter-spacing: -0.03em; flex-shrink: 0; }
    .nav-links { display: flex; align-items: center; gap: 36px; flex: 1; justify-content: center; }
    .nav-links a { font-size: 14px; font-weight: 500; color: ${C.muted}; transition: color 0.15s; position: relative; padding-bottom: 2px; }
    .nav-links a:hover { color: ${C.text}; }
    .nav-links a.active { color: ${C.text}; font-weight: 600; }
    .nav-links a.active::after { content: ''; position: absolute; bottom: -2px; left: 0; right: 0; height: 2px; background: ${C.green}; border-radius: 1px; }
    .nav-icons { display: flex; align-items: center; gap: 16px; flex-shrink: 0; }
    .nav-icon-btn { color: ${C.text}; display: flex; align-items: center; justify-content: center; width: 36px; height: 36px; border-radius: 50%; transition: background 0.15s; }
    .nav-icon-btn:hover { background: ${C.bg}; }
    .nav-avatar { width: 32px; height: 32px; border-radius: 50%; background: ${C.green}; display: flex; align-items: center; justify-content: center; color: ${C.white}; font-size: 12px; font-weight: 700; cursor: pointer; }

    .breadcrumb { padding: 14px 48px; background: ${C.white}; border-bottom: 1px solid ${C.border}; display: flex; align-items: center; gap: 6px; font-size: 13px; color: ${C.muted}; }
    .breadcrumb a { color: ${C.muted}; transition: color 0.15s; }
    .breadcrumb a:hover { color: ${C.text}; }
    .breadcrumb-sep { color: #C9C9C9; }
    .breadcrumb-current { color: ${C.text}; font-weight: 500; }

    .product-section { background: ${C.white}; margin: 16px 48px; border-radius: 16px; padding: 32px; display: flex; gap: 40px; align-items: flex-start; }

    .product-gallery { flex: 0 0 55%; display: flex; flex-direction: column; gap: 12px; }
    .gallery-main { background: #F5F5F5; border-radius: 12px; overflow: hidden; height: 500px; display: flex; align-items: center; justify-content: center; }
    .gallery-main img { width: 100%; height: 100%; object-fit: cover; object-position: center top; transition: opacity 0.15s ease; }
    .gallery-thumbs { display: flex; gap: 8px; }
    .gallery-thumb { flex: 1; border-radius: 8px; overflow: hidden; border: 2px solid transparent; cursor: pointer; transition: border-color 0.15s; position: relative; background: #F5F5F5; height: 80px; }
    .gallery-thumb img { width: 100%; height: 100%; object-fit: cover; object-position: center top; }
    .gallery-thumb.active { border-color: ${C.green}; }
    .gallery-thumb:hover:not(.active) { border-color: #C0C0C0; }
    .thumb-more { position: absolute; inset: 0; background: rgba(0,0,0,0.45); display: flex; align-items: center; justify-content: center; color: #fff; font-size: 11px; font-weight: 600; letter-spacing: 0.02em; }

    .product-info { flex: 0 0 45%; display: flex; flex-direction: column; }
    .product-title { font-size: 22px; font-weight: 700; color: ${C.text}; line-height: 1.3; margin-bottom: 8px; letter-spacing: -0.01em; }
    .product-subtitle { font-size: 13px; color: ${C.muted}; line-height: 1.65; margin-bottom: 16px; }
    .product-badges { display: flex; align-items: center; gap: 12px; margin-bottom: 18px; flex-wrap: wrap; }
    .badge-sold { font-size: 12px; font-weight: 600; color: ${C.green}; background: ${C.greenLight}; padding: 4px 10px; border-radius: 999px; }
    .badge-rating { display: flex; align-items: center; gap: 4px; font-size: 12px; color: ${C.text}; }
    .badge-rating .stars-inline { color: ${C.star}; }
    .divider { height: 1px; background: ${C.border}; margin: 18px 0; }
    .price-row { display: flex; align-items: baseline; gap: 10px; margin-bottom: 20px; }
    .price-current { font-size: 26px; font-weight: 700; color: ${C.text}; }
    .price-orig { font-size: 16px; font-weight: 400; color: ${C.pink}; text-decoration: line-through; }
    .price-save { font-size: 12px; font-weight: 600; color: ${C.white}; background: ${C.pink}; padding: 3px 8px; border-radius: 999px; }

    .selector-label { font-size: 13px; font-weight: 600; color: ${C.text}; margin-bottom: 10px; }
    .selector-label span { font-weight: 400; color: ${C.muted}; }
    .color-swatches { display: flex; gap: 8px; margin-bottom: 20px; }
    .color-swatch { width: 36px; height: 36px; border-radius: 8px; cursor: pointer; border: 2px solid transparent; transition: border-color 0.15s, transform 0.15s; }
    .color-swatch:hover { transform: scale(1.08); }
    .color-swatch.active { border-color: ${C.green}; box-shadow: 0 0 0 1px ${C.green}; }

    .size-options { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 20px; }
    .size-btn { min-width: 48px; height: 38px; padding: 0 12px; border-radius: 8px; border: 1.5px solid ${C.border}; font-size: 13px; font-weight: 500; color: ${C.text}; background: ${C.white}; cursor: pointer; transition: all 0.15s; }
    .size-btn:hover:not(.active) { border-color: ${C.text}; }
    .size-btn.active { background: ${C.green}; color: ${C.white}; border-color: ${C.green}; font-weight: 600; }

    .btn-cart { display: flex; align-items: center; justify-content: center; gap: 8px; width: 100%; padding: 14px 24px; background: ${C.green}; color: ${C.white}; border-radius: 999px; font-size: 14px; font-weight: 600; letter-spacing: 0.01em; transition: background 0.15s, transform 0.1s; margin-bottom: 10px; cursor: pointer; border: none; font-family: inherit; }
    .btn-cart:hover { background: #144D27; transform: scale(0.99); }
    .btn-buy { display: flex; align-items: center; justify-content: center; width: 100%; padding: 13px 24px; background: ${C.white}; color: ${C.green}; border-radius: 999px; border: 1.5px solid ${C.green}; font-size: 14px; font-weight: 600; transition: background 0.15s; margin-bottom: 20px; cursor: pointer; font-family: inherit; }
    .btn-buy:hover { background: ${C.greenLight}; }

    .product-actions { display: grid; grid-template-columns: 1fr 1fr 1fr; border: 1px solid ${C.border}; border-radius: 12px; overflow: hidden; }
    .action-btn { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 6px; padding: 14px 8px; font-size: 12px; font-weight: 500; color: ${C.muted}; border-right: 1px solid ${C.border}; transition: background 0.15s, color 0.15s; cursor: pointer; background: ${C.white}; border-top: none; border-bottom: none; border-left: none; font-family: inherit; }
    .action-btn:last-child { border-right: none; }
    .action-btn:hover { background: ${C.bg}; color: ${C.text}; }

    .tabs-section { background: ${C.white}; margin: 16px 48px; border-radius: 16px; overflow: hidden; }
    .tabs-header { display: flex; border-bottom: 1px solid ${C.border}; padding: 0 32px; }
    .tab-btn { padding: 18px 24px; font-size: 14px; font-weight: 500; color: ${C.muted}; border-bottom: 2px solid transparent; cursor: pointer; transition: color 0.15s, border-color 0.15s; background: none; font-family: inherit; border-top: none; border-left: none; border-right: none; }
    .tab-btn:hover { color: ${C.text}; }
    .tab-btn.active { color: ${C.green}; border-bottom-color: ${C.green}; font-weight: 600; }
    .tab-panel { display: none; }
    .tab-panel.active { display: block; }

    .reviews-layout { display: grid; grid-template-columns: 1fr 280px; }
    .reviews-left { padding: 32px; padding-right: 32px; border-right: 1px solid ${C.border}; }
    .reviews-top-row { display: flex; align-items: center; justify-content: space-between; margin-bottom: 24px; gap: 12px; }
    .reviews-title { font-size: 18px; font-weight: 700; color: ${C.text}; }
    .reviews-count { font-size: 13px; color: ${C.muted}; margin-top: 2px; }
    .reviews-sort { padding: 8px 14px; border: 1px solid ${C.border}; border-radius: 8px; font-size: 13px; color: ${C.text}; background: ${C.white}; cursor: pointer; font-family: inherit; }
    .review-item { padding: 20px 0; border-bottom: 1px solid ${C.border}; }
    .review-item:last-child { border-bottom: none; }
    .review-header { display: flex; align-items: center; gap: 12px; margin-bottom: 10px; }
    .review-meta { display: flex; flex-direction: column; gap: 2px; }
    .review-author { font-size: 14px; font-weight: 600; color: ${C.text}; }
    .review-stars { font-size: 13px; }
    .review-text { font-size: 13px; color: ${C.muted}; line-height: 1.65; margin-bottom: 12px; }
    .review-actions { display: flex; align-items: center; gap: 16px; }
    .review-action-btn { font-size: 12px; font-weight: 500; color: ${C.muted}; display: flex; align-items: center; gap: 4px; padding: 4px 0; transition: color 0.15s; background: none; border: none; cursor: pointer; font-family: inherit; }
    .review-action-btn:hover { color: ${C.text}; }

    .reviews-pagination { display: flex; align-items: center; gap: 4px; padding-top: 24px; flex-wrap: wrap; }
    .page-btn { width: 32px; height: 32px; border-radius: 8px; font-size: 13px; font-weight: 500; color: ${C.muted}; display: flex; align-items: center; justify-content: center; border: 1px solid transparent; cursor: pointer; transition: all 0.15s; background: none; font-family: inherit; }
    .page-btn:hover { border-color: ${C.border}; color: ${C.text}; background: ${C.bg}; }
    .page-btn.active { background: ${C.green}; color: ${C.white}; border-color: ${C.green}; font-weight: 600; }
    .page-btn.arrow { background: ${C.bg}; border-color: ${C.border}; }
    .page-sep { color: ${C.muted}; font-size: 13px; padding: 0 2px; }
    .page-show-all { font-size: 12px; font-weight: 600; color: ${C.green}; margin-left: 8px; cursor: pointer; background: none; border: none; font-family: inherit; }
    .page-show-all:hover { opacity: 0.75; }

    .reviews-right { padding: 32px; padding-left: 32px; }
    .rating-global { text-align: center; margin-bottom: 24px; padding-bottom: 24px; border-bottom: 1px solid ${C.border}; }
    .rating-score { font-size: 56px; font-weight: 700; color: ${C.text}; line-height: 1; margin-bottom: 8px; }
    .rating-stars-big { font-size: 20px; color: ${C.star}; margin-bottom: 6px; }
    .rating-total { font-size: 12px; color: ${C.muted}; }
    .dist-row { display: flex; align-items: center; gap: 8px; margin-bottom: 10px; }
    .dist-label { font-size: 12px; color: ${C.muted}; white-space: nowrap; min-width: 40px; display: flex; align-items: center; gap: 2px; }
    .dist-bar-wrap { flex: 1; height: 6px; background: #E5E7EB; border-radius: 999px; overflow: hidden; }
    .dist-bar-fill { height: 100%; background: ${C.star}; border-radius: 999px; transition: width 0.6s ease; }
    .dist-count { font-size: 12px; color: ${C.muted}; min-width: 28px; text-align: right; }

    .details-panel { padding: 32px; }
    .details-panel h3 { font-size: 16px; font-weight: 600; margin-bottom: 12px; color: ${C.text}; }
    .details-panel p, .details-panel li { font-size: 13px; color: ${C.muted}; line-height: 1.75; }
    .details-panel ul { list-style: disc; padding-left: 20px; margin-top: 8px; display: flex; flex-direction: column; gap: 4px; }
    .discussion-panel { padding: 48px 32px; text-align: center; color: ${C.muted}; font-size: 13px; }

    .related-section { background: ${C.bg}; padding: 48px; }
    .related-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 28px; }
    .related-title { font-size: 20px; font-weight: 700; color: ${C.text}; }
    .related-nav { display: flex; gap: 8px; }
    .related-nav-btn { width: 36px; height: 36px; border-radius: 50%; border: 1px solid ${C.border}; background: ${C.white}; color: ${C.text}; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: background 0.15s, border-color 0.15s; }
    .related-nav-btn:hover { background: ${C.text}; color: ${C.white}; border-color: ${C.text}; }
    .related-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }
    .related-card { background: ${C.white}; border-radius: 12px; overflow: hidden; transition: box-shadow 0.2s; }
    .related-card:hover { box-shadow: 0 4px 20px rgba(0,0,0,0.08); }
    .related-img-wrap { position: relative; background: #F5F5F5; height: 200px; overflow: hidden; }
    .related-img-wrap img { width: 100%; height: 100%; object-fit: cover; object-position: center top; transition: transform 0.3s ease; }
    .related-card:hover .related-img-wrap img { transform: scale(1.04); }
    .related-badge { position: absolute; top: 10px; left: 10px; background: ${C.green}; color: ${C.white}; font-size: 10px; font-weight: 700; padding: 3px 8px; border-radius: 999px; letter-spacing: 0.04em; }
    .related-heart { position: absolute; top: 8px; right: 8px; width: 32px; height: 32px; border-radius: 50%; background: ${C.white}; border: none; display: flex; align-items: center; justify-content: center; color: ${C.muted}; cursor: pointer; transition: color 0.15s, background 0.15s; box-shadow: 0 1px 4px rgba(0,0,0,0.1); }
    .related-heart:hover { color: ${C.pink}; background: #FFF5F8; }
    .related-info { padding: 14px; }
    .related-name { font-size: 13px; font-weight: 600; color: ${C.text}; margin-bottom: 6px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .related-stars { display: flex; align-items: center; gap: 4px; font-size: 12px; margin-bottom: 8px; }
    .related-stars-text { color: ${C.muted}; }
    .related-pricing { display: flex; align-items: baseline; gap: 8px; }
    .related-price { font-size: 15px; font-weight: 700; color: ${C.text}; }
    .related-orig { font-size: 13px; color: ${C.pink}; text-decoration: line-through; }

    .footer { background: ${C.footer}; padding: 60px 48px 36px; }
    .footer-top { display: grid; grid-template-columns: 1.4fr 1fr 1fr 1fr 1fr; gap: 40px; padding-bottom: 48px; border-bottom: 1px solid rgba(255,255,255,0.08); margin-bottom: 32px; }
    .footer-brand-name { font-size: 24px; font-weight: 700; color: ${C.white}; margin-bottom: 14px; letter-spacing: -0.02em; }
    .footer-brand-desc { font-size: 13px; color: rgba(255,255,255,0.4); line-height: 1.75; max-width: 200px; }
    .footer-col-title { font-size: 13px; font-weight: 700; color: rgba(255,255,255,0.9); margin-bottom: 18px; }
    .footer-links { display: flex; flex-direction: column; gap: 12px; }
    .footer-links a { font-size: 13px; color: rgba(255,255,255,0.45); transition: color 0.15s; display: flex; align-items: center; gap: 8px; }
    .footer-links a:hover { color: rgba(255,255,255,0.9); }
    .footer-bottom { display: flex; align-items: center; justify-content: space-between; gap: 24px; flex-wrap: wrap; }
    .footer-copy { font-size: 12px; color: rgba(255,255,255,0.3); }
    .footer-legal { display: flex; gap: 20px; }
    .footer-legal a { font-size: 12px; color: rgba(255,255,255,0.3); transition: color 0.15s; }
    .footer-legal a:hover { color: rgba(255,255,255,0.65); }

    @media (max-width: 1100px) {
      .nav, .breadcrumb { padding-left: 24px; padding-right: 24px; }
      .product-section, .tabs-section { margin: 12px 24px; }
      .related-section, .footer { padding-left: 24px; padding-right: 24px; }
      .footer-top { grid-template-columns: 1fr 1fr 1fr; gap: 28px; }
      .related-grid { grid-template-columns: repeat(2, 1fr); }
    }
    @media (max-width: 900px) {
      .product-section { flex-direction: column; }
      .product-gallery, .product-info { flex: none; }
      .reviews-layout { grid-template-columns: 1fr; }
      .reviews-left { border-right: none; border-bottom: 1px solid ${C.border}; padding-bottom: 24px; margin-bottom: 24px; }
      .reviews-right { padding-left: 32px; }
    }
    @media (max-width: 768px) {
      .nav-links { display: none; }
      .product-section { margin: 8px 12px; padding: 20px; }
      .tabs-section { margin: 8px 12px; }
      .related-section { padding: 28px 12px; }
      .footer-top { grid-template-columns: 1fr 1fr; }
    }
    @media (max-width: 480px) {
      .footer-top { grid-template-columns: 1fr; }
      .footer-bottom { flex-direction: column; text-align: center; }
    }
    @media (prefers-reduced-motion: reduce) {
      * { transition-duration: 0.01ms !important; animation-duration: 0.01ms !important; }
    }
  </style>
</head>
<body>

  <div class="promo-bar">${t('promo_bar', lang)}</div>

  <nav class="nav">
    <a href="javascript:void(0)" onclick="event.preventDefault()" class="nav-logo">Shopz</a>
    <ul class="nav-links">
      <li><a href="javascript:void(0)" onclick="event.preventDefault()">${t('nav_home', lang)}</a></li>
      <li><a href="javascript:void(0)" onclick="event.preventDefault()" class="active">${t('nav_catalogue', lang)}</a></li>
      <li><a href="javascript:void(0)" onclick="event.preventDefault()">${t('nav_new', lang)}</a></li>
      <li><a href="javascript:void(0)" onclick="event.preventDefault()">${t('nav_promo', lang)}</a></li>
    </ul>
    <div class="nav-icons">
      <button class="nav-icon-btn">${ICON_SEARCH}</button>
      <button class="nav-icon-btn">${ICON_BELL}</button>
      <button class="nav-icon-btn">${ICON_HEART}</button>
      <button class="nav-icon-btn">${ICON_CART}</button>
      <div class="nav-avatar">JD</div>
    </div>
  </nav>

  <div class="breadcrumb">
    <a href="javascript:void(0)" onclick="event.preventDefault()">${t('nav_home', lang)}</a><span class="breadcrumb-sep">/</span>
    <a href="javascript:void(0)" onclick="event.preventDefault()">${t('nav_catalogue', lang)}</a><span class="breadcrumb-sep">/</span>
    <a href="javascript:void(0)" onclick="event.preventDefault()">${t('breadcrumb_products', lang)}</a><span class="breadcrumb-sep">/</span>
    <span class="breadcrumb-current">${productName}</span>
  </div>

  <section class="product-section">
    <div class="product-gallery">
      <div class="gallery-main">
        <img id="gallery-main-img" src="${img(0)}" alt="${productName}" loading="eager">
        ${renderHeroThumbs(data.images ?? [], SHOPZ_THEME, 'gallery-main-img')}
      </div>
      <div class="gallery-thumbs">${thumbsHTML}</div>
    </div>

    <div class="product-info">
      <h1 class="product-title">${productName}</h1>
      <p class="product-subtitle">${subtitle}</p>
      <div class="product-badges">
        <span class="badge-sold">5K+ ${t('badge_sold', lang)}</span>
        <div class="badge-rating">
          <span class="stars-inline">&#9733;&#9733;&#9733;&#9733;&#9733;</span>
          <strong>4.9</strong>
          <span style="color:${C.muted}">(225 ${t('badge_reviews', lang)})</span>
        </div>
      </div>
      <div class="divider"></div>
      <div class="price-row">
        <span class="price-current">${price}</span>
        <span class="price-orig">${originalPrice}</span>
        <span class="price-save">-22%</span>
      </div>

      <p class="selector-label">${t('label_color', lang)} <span id="color-label">${t('color_green', lang)}</span></p>
      <div class="color-swatches">
        <div class="color-swatch active" style="background:#1A5C30" onclick="selectColor(this,'${t('color_green', lang)}')" role="button" tabindex="0" onkeydown="if(event.key==='Enter')selectColor(this,'${t('color_green', lang)}')"></div>
        <div class="color-swatch" style="background:#B8A898" onclick="selectColor(this,'${t('color_beige', lang)}')" role="button" tabindex="0" onkeydown="if(event.key==='Enter')selectColor(this,'${t('color_beige', lang)}')"></div>
        <div class="color-swatch" style="background:#6B6B6B" onclick="selectColor(this,'${t('color_grey', lang)}')" role="button" tabindex="0" onkeydown="if(event.key==='Enter')selectColor(this,'${t('color_grey', lang)}')"></div>
      </div>

      <p class="selector-label">${t('label_size', lang)} <span id="size-label">${t('size_small', lang)}</span></p>
      <div class="size-options">
        <button class="size-btn" onclick="selectSize(this,'${t('size_xsmall', lang)}')">${t('size_xs', lang)}</button>
        <button class="size-btn active" onclick="selectSize(this,'${t('size_small', lang)}')">${t('size_s', lang)}</button>
        <button class="size-btn" onclick="selectSize(this,'${t('size_medium', lang)}')">${t('size_m', lang)}</button>
        <button class="size-btn" onclick="selectSize(this,'${t('size_large', lang)}')">${t('size_l', lang)}</button>
        <button class="size-btn" onclick="selectSize(this,'${t('size_xlarge', lang)}')">${t('size_xl', lang)}</button>
        <button class="size-btn" onclick="selectSize(this,'${t('size_xxlarge', lang)}')">${t('size_xxl', lang)}</button>
      </div>

      <button class="btn-cart" onclick="addToCart(this)">${ICON_PLUS} ${ctaText}</button>
      <button class="btn-buy">${t('btn_buy', lang)}</button>

      <div class="product-actions">
        <button class="action-btn">${ICON_CHAT}<span>${t('btn_chat', lang)}</span></button>
        <button class="action-btn">${ICON_HEART}<span>${t('btn_wishlist', lang)}</span></button>
        <button class="action-btn">${ICON_SHARE}<span>${t('btn_share', lang)}</span></button>
      </div>
    </div>
  </section>

  <section class="tabs-section">
    <div class="tabs-header">
      <button class="tab-btn" onclick="switchTab('details',this)">${t('tab_details', lang)}</button>
      <button class="tab-btn active" onclick="switchTab('reviews',this)">${t('tab_reviews', lang)}</button>
      <button class="tab-btn" onclick="switchTab('discussion',this)">${t('tab_discussion', lang)}</button>
    </div>

    <div id="panel-details" class="tab-panel details-panel">
      <h3>${t('details_title', lang)}</h3>
      <p>${data.benefits?.[0] || t('detail_comfort', lang)}</p>
      <ul>
        <li>${data.benefits?.[1] || t('detail_quality', lang)}</li>
        <li>${data.benefits?.[2] || t('detail_comfort', lang)}</li>
        <li>${data.benefits?.[3] || t('detail_care', lang)}</li>
        <li>${data.benefits?.[4] || t('detail_variants', lang)}</li>
        <li>${data.benefits?.[5] || t('detail_sustainable', lang)}</li>
      </ul>
    </div>

    <div id="panel-reviews" class="tab-panel active">
      <div class="reviews-layout">
        <div class="reviews-left">
          <div class="reviews-top-row">
            <div>
              <p class="reviews-title">${t('reviews_title', lang)}</p>
              <p class="reviews-count">${t('reviews_showing', lang)}</p>
            </div>
            <select class="reviews-sort">
              <option>${t('reviews_sort_latest', lang)}</option>
              <option>${t('reviews_sort_top', lang)}</option>
              <option>${t('reviews_sort_helpful', lang)}</option>
            </select>
          </div>
          ${reviewsHTML}
          <div class="reviews-pagination">
            <button class="page-btn arrow">${ICON_ARROW_LEFT}</button>
            <button class="page-btn active">1</button>
            <button class="page-btn">2</button>
            <button class="page-btn">3</button>
            <span class="page-sep">...</span>
            <button class="page-btn">28</button>
            <button class="page-btn arrow">${ICON_ARROW_RIGHT}</button>
            <button class="page-show-all">${t('reviews_show_all', lang)}</button>
          </div>
        </div>
        <div class="reviews-right">
          <div class="rating-global">
            <div class="rating-score">4.9</div>
            <div class="rating-stars-big">&#9733;&#9733;&#9733;&#9733;&#9733;</div>
            <p class="rating-total">${t('reviews_based_on', lang)}</p>
          </div>
          ${barsHTML}
        </div>
      </div>
    </div>

    <div id="panel-discussion" class="tab-panel discussion-panel">
      ${t('discussion_empty', lang)}
    </div>
  </section>

  <section class="related-section">
    <div class="related-header">
      <h2 class="related-title">${t('related_title', lang)}</h2>
      <div class="related-nav">
        <button class="related-nav-btn">${ICON_ARROW_LEFT}</button>
        <button class="related-nav-btn">${ICON_ARROW_RIGHT}</button>
      </div>
    </div>
    <div class="related-grid">${relatedHTML}</div>
  </section>

  <!-- ═══ SECTIONS DYNAMIQUES (story / social_proof / comparison / testimonials / bonuses / guarantee) ═══ -->
  ${renderRichSections(data, SHOPZ_THEME)}

  <footer class="footer">
    <div class="footer-top">
      <div>
        <p class="footer-brand-name">Shopz</p>
        <p class="footer-brand-desc">${data.subtitle || t('footer_brand_desc', lang)}</p>
      </div>
      <div>
        <p class="footer-col-title">${t('footer_about', lang)}</p>
        <ul class="footer-links">
          <li><a href="javascript:void(0)" onclick="event.preventDefault()">${t('footer_information', lang)}</a></li>
          <li><a href="javascript:void(0)" onclick="event.preventDefault()">${t('footer_store_locator', lang)}</a></li>
          <li><a href="javascript:void(0)" onclick="event.preventDefault()">${t('footer_bulk', lang)}</a></li>
          <li><a href="javascript:void(0)" onclick="event.preventDefault()">${t('footer_alteration', lang)}</a></li>
          <li><a href="javascript:void(0)" onclick="event.preventDefault()">${t('footer_gift', lang)}</a></li>
          <li><a href="javascript:void(0)" onclick="event.preventDefault()">${t('footer_live', lang)}</a></li>
        </ul>
      </div>
      <div>
        <p class="footer-col-title">${t('footer_help', lang)}</p>
        <ul class="footer-links">
          <li><a href="javascript:void(0)" onclick="event.preventDefault()">${t('footer_faq', lang)}</a></li>
          <li><a href="javascript:void(0)" onclick="event.preventDefault()">${t('footer_guide', lang)}</a></li>
          <li><a href="javascript:void(0)" onclick="event.preventDefault()">${t('footer_return', lang)}</a></li>
          <li><a href="javascript:void(0)" onclick="event.preventDefault()">${t('footer_privacy', lang)}</a></li>
          <li><a href="javascript:void(0)" onclick="event.preventDefault()">${t('footer_accessibility', lang)}</a></li>
          <li><a href="javascript:void(0)" onclick="event.preventDefault()">${t('footer_contact', lang)}</a></li>
        </ul>
      </div>
      <div>
        <p class="footer-col-title">${t('footer_account', lang)}</p>
        <ul class="footer-links">
          <li><a href="javascript:void(0)" onclick="event.preventDefault()">${t('footer_membership', lang)}</a></li>
          <li><a href="javascript:void(0)" onclick="event.preventDefault()">${t('footer_profile', lang)}</a></li>
          <li><a href="javascript:void(0)" onclick="event.preventDefault()">${t('footer_coupons', lang)}</a></li>
        </ul>
      </div>
      <div>
        <p class="footer-col-title">${t('footer_social', lang)}</p>
        <ul class="footer-links">
          <li><a href="javascript:void(0)" onclick="event.preventDefault()">${ICON_TWITTER} Twitter</a></li>
          <li><a href="javascript:void(0)" onclick="event.preventDefault()">${ICON_FACEBOOK} Facebook</a></li>
          <li><a href="javascript:void(0)" onclick="event.preventDefault()">${ICON_INSTAGRAM} Instagram</a></li>
          <li><a href="javascript:void(0)" onclick="event.preventDefault()">${ICON_YOUTUBE} Youtube</a></li>
        </ul>
      </div>
    </div>
    <div class="footer-bottom">
      <p class="footer-copy">${t('footer_copy', lang)}</p>
      <div class="footer-legal">
        <a href="javascript:void(0)" onclick="event.preventDefault()">${t('footer_privacy', lang)}</a>
        <a href="javascript:void(0)" onclick="event.preventDefault()">${t('footer_terms', lang)}</a>
      </div>
    </div>
  </footer>

  <script>
    var allImgs = ${allImgsJson};
    function selectImg(idx) {
      var mainImg = document.getElementById('gallery-main-img');
      var thumbs = document.querySelectorAll('.gallery-thumb');
      if (mainImg) {
        mainImg.style.opacity = '0';
        setTimeout(function() { mainImg.src = allImgs[idx] || allImgs[0]; mainImg.style.opacity = '1'; }, 150);
      }
      thumbs.forEach(function(t, i) { t.classList.toggle('active', i === idx); });
    }
    function selectColor(el, label) {
      document.querySelectorAll('.color-swatch').forEach(function(s) { s.classList.remove('active'); });
      el.classList.add('active');
      var lbl = document.getElementById('color-label'); if (lbl) lbl.textContent = label;
    }
    function selectSize(el, label) {
      document.querySelectorAll('.size-btn').forEach(function(b) { b.classList.remove('active'); });
      el.classList.add('active');
      var lbl = document.getElementById('size-label'); if (lbl) lbl.textContent = label;
    }
    function switchTab(tabId, btn) {
      document.querySelectorAll('.tab-panel').forEach(function(p) { p.classList.remove('active'); });
      document.querySelectorAll('.tab-btn').forEach(function(b) { b.classList.remove('active'); });
      var panel = document.getElementById('panel-' + tabId);
      if (panel) panel.classList.add('active');
      btn.classList.add('active');
    }
    function addToCart(btn) {
      var orig = btn.innerHTML;
      btn.innerHTML = '${t('btn_added_cart', lang)}';
      btn.style.background = '#144D27';
      setTimeout(function() { btn.innerHTML = orig; btn.style.background = '${C.green}'; }, 1800);
    }
    document.querySelectorAll('.related-heart').forEach(function(btn) {
      btn.addEventListener('click', function() {
        var liked = btn.getAttribute('data-liked') === 'true';
        btn.setAttribute('data-liked', String(!liked));
        btn.style.color = !liked ? '${C.pink}' : '${C.muted}';
        btn.style.background = !liked ? '#FFF5F8' : '${C.white}';
      });
    });
    var io = new IntersectionObserver(function(entries) {
      entries.forEach(function(e) {
        if (e.isIntersecting) {
          e.target.querySelectorAll('.dist-bar-fill').forEach(function(bar) {
            var w = bar.style.width; bar.style.width = '0';
            setTimeout(function() { bar.style.width = w; }, 80);
          });
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.3 });
    var rp = document.querySelector('.reviews-right'); if (rp) io.observe(rp);
  </script>

</body>
</html>`
}
