import type { LandingPageData } from '@/types'

import {
  renderRichSections,
  type SectionTheme,
} from './sections'

// ─── I18N LABELS ─────────────────────────────────────────────────────────────
// Tous les textes structurels (nav, footer, labels boutons) traduits.
// Utiliser t('key') pour récupérer la valeur selon data.language.

const T: Record<string, Record<string, string>> = {
  // Nav
  nav_menu:         { fr: 'Menu',        en: 'Menu',       ar: 'القائمة',   es: 'Menú'       },
  nav_home:         { fr: 'Accueil',     en: 'Home',       ar: 'الرئيسية',  es: 'Inicio'     },
  nav_gallery:      { fr: 'Galerie',     en: 'Gallery',    ar: 'المعرض',    es: 'Galería'    },
  nav_features:     { fr: 'Fonctions',   en: 'Features',   ar: 'المميزات',  es: 'Funciones'  },
  nav_reviews:      { fr: 'Avis',        en: 'Reviews',    ar: 'آراء',      es: 'Reseñas'    },
  nav_about:        { fr: 'À propos',    en: 'About',      ar: 'من نحن',    es: 'Nosotros'   },
  nav_cta:          { fr: 'Nous contacter', en: 'Get in touch', ar: 'تواصل معنا', es: 'Contacto' },

  // Hero left
  hero_eyebrow:     { fr: 'Découvrez', en: 'Discover', ar: 'اكتشف', es: 'Descubre' },
  hero_discover_with: { fr: 'avec', en: 'with', ar: 'مع', es: 'con' },
  hero_book:        { fr: 'En savoir plus', en: 'Learn more', ar: 'اعرف أكثر', es: 'Saber más' },
  hero_experts:     { fr: 'Nos experts', en: 'Our experts', ar: 'خبراؤنا', es: 'Nuestros expertos' },
  hero_corner:      { fr: 'Commandez dès aujourd\'hui et profitez de votre produit.', en: 'Order today and enjoy your product.', ar: 'اطلب اليوم واستمتع بمنتجك.', es: 'Pide hoy y disfruta tu producto.' },

  // Hero right
  hero_members:     { fr: 'clients', en: 'customers', ar: 'عميل', es: 'clientes' },
  services_title:   { fr: 'Ce que vous obtenez', en: 'What you get', ar: 'ما ستحصل عليه', es: 'Qué obtienes' },
  services_tagline: { fr: 'Tout ce dont vous avez besoin, réuni en un seul produit.', en: 'Everything you need, in one product.', ar: 'كل ما تحتاجه في منتج واحد.', es: 'Todo lo que necesitas, en un producto.' },

  // Services fallbacks (si data.benefits vide)
  benefit_0:        { fr: 'Support continu', en: 'Ongoing support', ar: 'دعم مستمر', es: 'Soporte continuo' },
  benefit_1:        { fr: 'Conseil expert',  en: 'Expert advice',   ar: 'نصيحة خبير', es: 'Consejo experto' },
  benefit_2:        { fr: 'Assistance achat', en: 'Shopping assistance', ar: 'مساعدة في الشراء', es: 'Asistencia de compra' },
  benefit_3:        { fr: 'Consultation personnalisée', en: 'Personalised consultation', ar: 'استشارة شخصية', es: 'Consulta personalizada' },
  benefit_4:        { fr: 'Qualité premium', en: 'Premium quality', ar: 'جودة ممتازة', es: 'Calidad premium' },
  benefit_5:        { fr: 'Résultats garantis', en: 'Guaranteed results', ar: 'نتائج مضمونة', es: 'Resultados garantizados' },

  // Price badge
  price_from:       { fr: 'à partir de', en: 'from', ar: 'من', es: 'desde' },
  price_unit:       { fr: '/ unité', en: '/ unit', ar: '/ وحدة', es: '/ unidad' },

  // Styles section
  styles_eyebrow:   { fr: 'Explorer', en: 'Explore', ar: 'استكشف', es: 'Explorar' },
  styles_title:     { fr: 'Nos produits', en: 'Our products', ar: 'منتجاتنا', es: 'Nuestros productos' },
  styles_subtitle:  { fr: 'Une sélection pensée pour vous — qualité, praticité, style.', en: 'A selection designed for you — quality, practicality, style.', ar: 'تشكيلة مصممة لك — جودة وعملية وأناقة.', es: 'Una selección diseñada para ti — calidad, practicidad, estilo.' },
  collage_badge:    { fr: 'Populaire', en: 'Popular', ar: 'الأكثر طلبًا', es: 'Popular' },
  collage_card_title: { fr: 'Tendances produit', en: 'Product trends', ar: 'اتجاهات المنتج', es: 'Tendencias del producto' },
  collage_overlay:  { fr: 'Voir les détails', en: 'View details', ar: 'عرض التفاصيل', es: 'Ver detalles' },

  // Category labels (style-grid) — génériques, adaptables à tout produit
  cat_0:            { fr: 'Qualité',    en: 'Quality',    ar: 'جودة',     es: 'Calidad'    },
  cat_1:            { fr: 'Design',     en: 'Design',     ar: 'تصميم',    es: 'Diseño'     },
  cat_2:            { fr: 'Confort',    en: 'Comfort',    ar: 'راحة',     es: 'Confort'    },
  cat_3:            { fr: 'Durabilité', en: 'Durability', ar: 'متانة',    es: 'Durabilidad' },
  cat_4:            { fr: 'Praticité',  en: 'Practical',  ar: 'عملية',    es: 'Practicidad' },
  cat_5:            { fr: 'Tendance',   en: 'Trending',   ar: 'رائج',     es: 'Tendencia'  },
  cat_6:            { fr: 'Premium',    en: 'Premium',    ar: 'فاخر',     es: 'Premium'    },
  cat_7:            { fr: 'Populaire',  en: 'Popular',    ar: 'شائع',     es: 'Popular'    },
  cat_8:            { fr: 'Exclusif',   en: 'Exclusive',  ar: 'حصري',     es: 'Exclusivo'  },
  cat_9:            { fr: 'Bestseller', en: 'Bestseller', ar: 'الأكثر مبيعاً', es: 'Más vendido' },

  // Quote section
  quote_eyebrow:    { fr: 'Ce qu\'ils disent', en: 'What they say', ar: 'ما يقولونه', es: 'Lo que dicen' },
  quote_fallback:   { fr: 'Ce produit a transformé mon quotidien. Je ne peux plus m\'en passer.', en: 'This product transformed my daily routine. I can\'t live without it.', ar: 'غيّر هذا المنتج حياتي اليومية. لا أستطيع العيش بدونه.', es: 'Este producto transformó mi rutina diaria. No puedo vivir sin él.' },

  // Footer
  footer_desc_fallback: { fr: 'Qualité et satisfaction, livrées chez vous.', en: 'Quality and satisfaction, delivered to you.', ar: 'الجودة والرضا، تُوصَل إليك.', es: 'Calidad y satisfacción, entregadas a ti.' },
  footer_explore:   { fr: 'Explorer', en: 'Explore', ar: 'استكشف', es: 'Explorar' },
  footer_products:  { fr: 'Produits', en: 'Products', ar: 'المنتجات', es: 'Productos' },
  footer_reviews:   { fr: 'Avis clients', en: 'Reviews', ar: 'آراء العملاء', es: 'Reseñas' },
  footer_faq:       { fr: 'FAQ', en: 'FAQ', ar: 'الأسئلة الشائعة', es: 'FAQ' },
  footer_services:  { fr: 'Services', en: 'Services', ar: 'الخدمات', es: 'Servicios' },
  footer_delivery:  { fr: 'Livraison', en: 'Delivery', ar: 'التوصيل', es: 'Entrega' },
  footer_returns:   { fr: 'Retours', en: 'Returns', ar: 'الإرجاع', es: 'Devoluciones' },
  footer_support:   { fr: 'Support client', en: 'Customer support', ar: 'دعم العملاء', es: 'Soporte al cliente' },
  footer_guarantee: { fr: 'Garantie', en: 'Guarantee', ar: 'الضمان', es: 'Garantía' },
  footer_contact:   { fr: 'Contact', en: 'Contact', ar: 'تواصل', es: 'Contacto' },
  footer_order:     { fr: 'Commander', en: 'Order now', ar: 'اطلب الآن', es: 'Pedir ahora' },
  footer_instagram: { fr: 'Instagram', en: 'Instagram', ar: 'إنستغرام', es: 'Instagram' },
  footer_copyright: { fr: 'Tous droits réservés.', en: 'All rights reserved.', ar: 'جميع الحقوق محفوظة.', es: 'Todos los derechos reservados.' },
  footer_privacy:   { fr: 'Politique de confidentialité', en: 'Privacy Policy', ar: 'سياسة الخصوصية', es: 'Política de privacidad' },
  footer_terms:     { fr: 'Conditions d\'utilisation', en: 'Terms of Use', ar: 'شروط الاستخدام', es: 'Términos de uso' },
  footer_cookies:   { fr: 'Cookies', en: 'Cookie Settings', ar: 'إعدادات الكوكيز', es: 'Ajustes de cookies' },

  // Aria labels
  aria_nav:         { fr: 'Navigation principale', en: 'Main navigation', ar: 'التنقل الرئيسي', es: 'Navegación principal' },
  aria_hero:        { fr: 'Section principale', en: 'Main section', ar: 'القسم الرئيسي', es: 'Sección principal' },
  aria_experts:     { fr: 'Notre équipe', en: 'Our team', ar: 'فريقنا', es: 'Nuestro equipo' },
  aria_styles:      { fr: 'Nos catégories', en: 'Our categories', ar: 'فئاتنا', es: 'Nuestras categorías' },
  aria_quote_nav:   { fr: 'Navigation avis', en: 'Reviews navigation', ar: 'التنقل بين الآراء', es: 'Navegación de reseñas' },
  aria_prev:        { fr: 'Avis précédent', en: 'Previous review', ar: 'الرأي السابق', es: 'Reseña anterior' },
  aria_next:        { fr: 'Avis suivant', en: 'Next review', ar: 'الرأي التالي', es: 'Siguiente reseña' },
  aria_footer:      { fr: 'Pied de page', en: 'Footer', ar: 'تذييل الصفحة', es: 'Pie de página' },
}

// ─── FALLBACK IMAGES — neutres, produit générique ────────────────────────────
// Conservées pour le cas où data.images est vide — images Unsplash lifestyle
// qui fonctionnent pour tout type de produit (pas fashion-spécifique)

const FALLBACK_IMGS = [
  'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=80',
  'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=800&q=80',
  'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=800&q=80',
  'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=800&q=80',
  'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&q=80',
  'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&q=80',
]

// ─── COLOR TOKENS ─────────────────────────────────────────────────────────────

const C = {
  heroBg:   '#C9B49A',
  sectionBg:'#F8F7F3',
  darkBg:   '#0D0D0D',
  white:    '#FFFFFF',
  text:     '#1A1A1A',
  muted:    '#6B6B6B',
  border:   '#E5E0D8',
}

// ─── SVG ICONS ────────────────────────────────────────────────────────────────

const ICON_SETTINGS = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>`

const ICON_ARROW_NE = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/></svg>`

const ICON_ARROW_LEFT  = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>`
const ICON_ARROW_RIGHT = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>`

const ICON_ARROW_LONG_RIGHT = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>`

const ICON_INFINITY   = `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 12c-2-2.5-4-4-6-4a4 4 0 0 0 0 8c2 0 4-1.5 6-4z"/><path d="M12 12c2 2.5 4 4 6 4a4 4 0 0 0 0-8c-2 0-4 1.5-6 4z"/></svg>`
const ICON_USER       = `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`
const ICON_SHOPPING   = `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>`
const ICON_CHAT       = `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>`
const ICON_WARDROBE   = `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="18" rx="2"/><line x1="12" y1="3" x2="12" y2="21"/><line x1="7" y1="9" x2="7" y2="9.01"/><line x1="17" y1="9" x2="17" y2="9.01"/></svg>`

// ─── STYLE THEME ──────────────────────────────────────────────────────────────

const STYLE_THEME: SectionTheme = {
  primary:    '#c9b49a',
  accent:     '#fbf9f7',
  text:       '#1a1a2e',
  textMuted:  '#6E6E73',
  bg:         '#ffffff',
  bgAlt:      '#F5F5F7',
  border:     '#E8E8ED',
  fontFamily: "'Inter',sans-serif",
  radius:     '16px',
}

// ─── MAIN TEMPLATE FUNCTION ───────────────────────────────────────────────────

export function templateEtecStyle(data: LandingPageData): string {
  const lang = data.language ?? 'fr'

  // Résolution i18n : fallback fr si la langue n'a pas de traduction
  const t = (key: string): string => T[key]?.[lang] ?? T[key]?.['fr'] ?? key

  const img = (i: number) => data.images?.[i] || FALLBACK_IMGS[i % FALLBACK_IMGS.length]

  const brandName = data.product_name || 'Studio'
  const ctaText   = data.cta         || t('nav_cta')
  const price     = data.price       || null

  // ── Social proof : nombre de clients depuis social_proof.customers ────────
  const membersCount = data.social_proof?.customers ?? null

  // ── Services : utilise data.benefits, fallbacks i18n génériques ───────────
  const rawBenefits = data.benefits?.slice(0, 6) || []
  const services = [
    { icon: ICON_INFINITY,  label: rawBenefits[0] || t('benefit_0') },
    { icon: ICON_USER,      label: rawBenefits[1] || t('benefit_1') },
    { icon: ICON_SHOPPING,  label: rawBenefits[2] || t('benefit_2') },
    { icon: ICON_CHAT,      label: rawBenefits[3] || t('benefit_3') },
    { icon: ICON_WARDROBE,  label: rawBenefits[4] || t('benefit_4') },
    { icon: ICON_ARROW_NE,  label: rawBenefits[5] || t('benefit_5') },
  ]

  // ── Hero right headline : data.headline en priorité absolue ───────────────
  // Fallback : unique_mechanism.name → story.solution → subtitle → i18n générique
  const heroHeadline =
    data.headline ||
    data.unique_mechanism?.name ||
    data.story?.solution ||
    data.subtitle ||
    t('styles_title')

  // ── Hero right desc : unique_mechanism.description → story.transformation → subtitle
  const heroDesc =
    data.unique_mechanism?.description ||
    data.story?.transformation ||
    data.subtitle ||
    ''

  // ── Press mentions : data.press_mentions en priorité ─────────────────────
  const pressMentions = data.press_mentions?.slice(0, 4) ?? []

  // ── Testimonials / quotes ─────────────────────────────────────────────────
  // Priorité : data.testimonials → data.faq[0].answer → t('quote_fallback')
  const allQuotes: string[] = []
  if (data.testimonials && data.testimonials.length > 0) {
    data.testimonials.slice(0, 3).forEach(t_ => allQuotes.push(t_.text))
  } else if (data.faq && data.faq.length > 0) {
    data.faq.slice(0, 3).forEach(f => allQuotes.push(f.answer))
  }
  if (allQuotes.length === 0) allQuotes.push(t('quote_fallback'))
  const firstQuote = allQuotes[0]!

  // ── Style grid HTML — labels i18n génériques ─────────────────────────────
  // Les avatars Unsplash restent (visuels neutres). Les labels deviennent
  // data.features[i].title si dispo, sinon i18n générique (Qualité, Design…).
  const STYLE_AVATAR_URLS = [
    'https://images.unsplash.com/photo-1617922001439-4a2e6562f328?w=120&q=80',
    'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=120&q=80',
    'https://images.unsplash.com/photo-1519340241574-2cec6aef0c01?w=120&q=80',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&q=80',
    'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=120&q=80',
    'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=120&q=80',
    'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=120&q=80',
    'https://images.unsplash.com/photo-1488161628813-04466f872be2?w=120&q=80',
    'https://images.unsplash.com/photo-1512361436605-a484bdb34b5f?w=120&q=80',
    'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=120&q=80',
  ]
  const styleGridHTML = STYLE_AVATAR_URLS.map((url, i) => {
    const label = data.features?.[i]?.title || t(`cat_${i}`)
    return `
        <div class="style-item">
          <div class="style-avatar" style="background-image:url('${url}')"></div>
          <span class="style-label">${label}</span>
        </div>`
  }).join('')

  // ── Services grid HTML ───────────────────────────────────────────────────
  const servicesHTML = services.map(s => `
              <div class="service-item">
                <div class="service-icon">${s.icon}</div>
                <span class="service-label">${s.label}</span>
              </div>`).join('')

  // ── Press mentions HTML (remplace PACO/BOSS/WM/CK) ───────────────────────
  // Affiché seulement si des mentions existent dans la data.
  const pressHTML = pressMentions.length > 0
    ? `<div class="brand-logos" aria-label="Mentions presse">
          ${pressMentions.map(m => `<span class="brand-logo-item">${m}</span>`).join('\n          ')}
        </div>`
    : ''

  // ── Price badge ──────────────────────────────────────────────────────────
  const priceBadge = price ? `
      <div class="price-pill">
        <span class="price-from">${t('price_from')}</span>
        <span class="price-amount">${price}</span>
        <span class="price-unit">${t('price_unit')}</span>
      </div>` : ''

  // ── Members count HTML ───────────────────────────────────────────────────
  const membersHTML = membersCount
    ? `<div class="members-count"><strong>${membersCount}</strong> ${t('hero_members')}</div>`
    : ''

  // ── Footer brand desc ────────────────────────────────────────────────────
  const footerDesc = data.subtitle || t('footer_desc_fallback')

  return `<!DOCTYPE html>
<html lang="${lang}" dir="${lang === 'ar' ? 'rtl' : 'ltr'}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${brandName}</title>
  <meta name="description" content="${data.subtitle || heroHeadline}">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet">
  <style>
    /* ── RESET ── */
    *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
    html { scroll-behavior: smooth; }
    body {
      font-family: 'Inter', sans-serif;
      background: ${C.sectionBg};
      color: ${C.text};
      -webkit-font-smoothing: antialiased;
      overflow-x: hidden;
    }
    img { display: block; max-width: 100%; }
    a { text-decoration: none; color: inherit; }
    button { cursor: pointer; border: none; background: none; font-family: inherit; }

    /* ── NAVIGATION ── */
    .nav {
      position: sticky;
      top: 0;
      z-index: 100;
      background: ${C.darkBg};
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 18px 48px;
      gap: 24px;
    }
    .nav-left {
      display: flex;
      align-items: center;
      gap: 10px;
      color: rgba(255,255,255,0.55);
      flex-shrink: 0;
    }
    .nav-left span {
      font-size: 11px;
      font-weight: 500;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: rgba(255,255,255,0.4);
    }
    .nav-links {
      display: flex;
      align-items: center;
      gap: 36px;
      list-style: none;
      flex: 1;
      justify-content: center;
    }
    .nav-links a {
      font-size: 13px;
      font-weight: 400;
      color: rgba(255,255,255,0.65);
      letter-spacing: 0.02em;
      transition: color 0.2s;
    }
    .nav-links a:hover,
    .nav-links a.active { color: ${C.white}; }
    .nav-cta {
      flex-shrink: 0;
      background: ${C.white};
      color: ${C.text};
      font-size: 13px;
      font-weight: 600;
      padding: 10px 22px;
      border-radius: 999px;
      letter-spacing: 0.01em;
      transition: opacity 0.2s, transform 0.15s;
    }
    .nav-cta:hover { opacity: 0.88; transform: scale(0.98); }

    /* ── HERO SPLIT ── */
    .hero {
      display: flex;
      min-height: calc(100vh - 61px);
    }

    /* Left column — beige */
    .hero-left {
      flex: 0 0 60%;
      background: ${C.heroBg};
      position: relative;
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }
    .hero-left-img {
      flex: 1;
      min-height: 0;
      width: 100%;
      object-fit: cover;
      object-position: center top;
      display: block;
    }
    .hero-left-bottom {
      padding: 32px 40px;
      display: flex;
      align-items: flex-end;
      justify-content: space-between;
      gap: 24px;
      background: linear-gradient(to top, rgba(201,180,154,0.98) 0%, rgba(201,180,154,0.7) 60%, transparent 100%);
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
    }
    .hero-left-copy {}
    .hero-left-eyebrow {
      font-size: 13px;
      font-weight: 400;
      color: rgba(26,26,26,0.65);
      margin-bottom: 4px;
      font-style: italic;
    }
    .hero-left-title {
      font-family: 'Playfair Display', serif;
      font-size: 26px;
      font-weight: 700;
      color: ${C.text};
      line-height: 1.25;
      margin-bottom: 12px;
    }
    .hero-left-sub {
      font-size: 13px;
      color: rgba(26,26,26,0.72);
      line-height: 1.6;
      max-width: 320px;
      margin-bottom: 20px;
    }
    .hero-btns {
      display: flex;
      align-items: center;
      gap: 16px;
    }
    .btn-pill-white {
      background: ${C.white};
      color: ${C.text};
      font-size: 13px;
      font-weight: 600;
      padding: 11px 26px;
      border-radius: 999px;
      letter-spacing: 0.01em;
      transition: opacity 0.2s, transform 0.15s;
      display: inline-flex;
      align-items: center;
      gap: 8px;
    }
    .btn-pill-white:hover { opacity: 0.88; transform: scale(0.98); }
    .btn-text-link {
      font-size: 13px;
      font-weight: 500;
      color: ${C.text};
      display: inline-flex;
      align-items: center;
      gap: 6px;
      border-bottom: 1px solid rgba(26,26,26,0.3);
      padding-bottom: 1px;
      transition: border-color 0.2s;
    }
    .btn-text-link:hover { border-color: ${C.text}; }
    .hero-experts {
      display: flex;
      align-items: center;
      gap: 10px;
      flex-shrink: 0;
    }
    .hero-avatars {
      display: flex;
    }
    .hero-avatars span {
      width: 34px;
      height: 34px;
      border-radius: 50%;
      border: 2px solid ${C.heroBg};
      background-size: cover;
      background-position: center;
      display: block;
      margin-left: -10px;
      overflow: hidden;
    }
    .hero-avatars span:first-child { margin-left: 0; }
    .hero-experts-label {
      font-size: 11px;
      font-weight: 600;
      color: ${C.text};
      letter-spacing: 0.04em;
      text-transform: uppercase;
    }
    .hero-corner-note {
      position: absolute;
      bottom: 32px;
      right: 40px;
      text-align: right;
      max-width: 160px;
    }
    .hero-corner-note p {
      font-size: 11px;
      color: rgba(26,26,26,0.6);
      line-height: 1.5;
      margin-bottom: 6px;
    }
    .hero-corner-arrow {
      width: 28px;
      height: 28px;
      border-radius: 50%;
      background: ${C.text};
      color: ${C.white};
      display: inline-flex;
      align-items: center;
      justify-content: center;
      float: right;
    }

    /* Right column — white */
    .hero-right {
      flex: 0 0 40%;
      background: ${C.white};
      display: flex;
      flex-direction: column;
      padding: 48px 40px;
      gap: 0;
      overflow-y: auto;
    }
    .hero-right-top {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
    }
    .hero-right-headline {
      font-family: 'Playfair Display', serif;
      font-size: 28px;
      font-weight: 700;
      line-height: 1.3;
      color: ${C.text};
      margin-bottom: 28px;
    }
    .brand-logos {
      display: flex;
      align-items: center;
      gap: 24px;
      margin-bottom: 24px;
      padding-bottom: 24px;
      border-bottom: 1px solid ${C.border};
    }
    .brand-logo-item {
      font-size: 12px;
      font-weight: 700;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      color: rgba(26,26,26,0.35);
    }
    .hero-right-desc {
      font-size: 13px;
      color: ${C.muted};
      line-height: 1.75;
      margin-bottom: 28px;
    }
    .hero-right-actions {
      display: flex;
      align-items: center;
      gap: 20px;
      margin-bottom: 32px;
    }
    .btn-pill-dark {
      background: ${C.text};
      color: ${C.white};
      font-size: 13px;
      font-weight: 600;
      padding: 12px 28px;
      border-radius: 999px;
      letter-spacing: 0.01em;
      transition: opacity 0.2s, transform 0.15s;
      display: inline-flex;
      align-items: center;
      gap: 8px;
    }
    .btn-pill-dark:hover { opacity: 0.82; transform: scale(0.98); }
    .members-count {
      font-size: 13px;
      color: ${C.muted};
    }
    .members-count strong {
      font-size: 15px;
      font-weight: 700;
      color: ${C.text};
    }
    .hero-right-divider {
      height: 1px;
      background: ${C.border};
      margin-bottom: 32px;
    }
    .services-title {
      font-family: 'Playfair Display', serif;
      font-size: 18px;
      font-weight: 600;
      color: ${C.text};
      margin-bottom: 8px;
    }
    .services-tagline {
      font-size: 12px;
      color: ${C.muted};
      line-height: 1.6;
      margin-bottom: 24px;
    }
    .services-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
    }
    .service-item {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 12px 14px;
      border: 1px solid ${C.border};
      border-radius: 12px;
      background: ${C.sectionBg};
      transition: border-color 0.2s, background 0.2s;
    }
    .service-item:hover {
      border-color: rgba(26,26,26,0.2);
      background: ${C.white};
    }
    .service-icon {
      flex-shrink: 0;
      color: ${C.text};
      opacity: 0.7;
    }
    .service-label {
      font-size: 11px;
      font-weight: 500;
      color: ${C.text};
      line-height: 1.4;
    }
    ${priceBadge ? `
    .price-pill {
      display: inline-flex;
      align-items: baseline;
      gap: 4px;
      background: ${C.text};
      color: ${C.white};
      padding: 6px 14px;
      border-radius: 999px;
      margin-bottom: 28px;
      align-self: flex-start;
    }
    .price-from { font-size: 10px; opacity: 0.6; }
    .price-amount { font-size: 18px; font-weight: 700; }
    .price-unit { font-size: 10px; opacity: 0.6; }
    ` : ''}

    /* ── STYLES / CATEGORIES SECTION ── */
    .styles-section {
      background: ${C.white};
      padding: 80px 64px;
    }
    .styles-header {
      display: flex;
      align-items: flex-end;
      justify-content: space-between;
      margin-bottom: 48px;
      gap: 32px;
    }
    .styles-header-left {}
    .styles-eyebrow {
      font-size: 11px;
      font-weight: 600;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      color: ${C.muted};
      margin-bottom: 10px;
    }
    .styles-title {
      font-family: 'Playfair Display', serif;
      font-size: 38px;
      font-weight: 700;
      color: ${C.text};
      line-height: 1.2;
    }
    .styles-subtitle {
      font-size: 14px;
      color: ${C.muted};
      line-height: 1.65;
      max-width: 360px;
      margin-top: 14px;
    }
    .styles-content {
      display: grid;
      grid-template-columns: 1fr 340px;
      gap: 40px;
      align-items: start;
    }
    .style-grid {
      display: grid;
      grid-template-columns: repeat(5, 1fr);
      gap: 20px;
    }
    .style-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 10px;
      cursor: pointer;
    }
    .style-avatar {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      background-size: cover;
      background-position: center;
      border: 2px solid transparent;
      transition: border-color 0.2s, transform 0.2s;
    }
    .style-item:hover .style-avatar {
      border-color: ${C.text};
      transform: scale(1.05);
    }
    .style-label {
      font-size: 12px;
      font-weight: 500;
      color: ${C.text};
      text-align: center;
      letter-spacing: 0.01em;
    }
    /* Right collage */
    .styles-collage {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .collage-main {
      position: relative;
      border-radius: 20px;
      overflow: hidden;
      height: 220px;
    }
    .collage-main img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .collage-badge {
      position: absolute;
      bottom: 14px;
      left: 14px;
      background: ${C.white};
      color: ${C.text};
      font-size: 11px;
      font-weight: 700;
      padding: 5px 12px;
      border-radius: 999px;
      letter-spacing: 0.04em;
    }
    .collage-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
    }
    .collage-card {
      border-radius: 16px;
      overflow: hidden;
      background: ${C.sectionBg};
      position: relative;
    }
    .collage-card img {
      width: 100%;
      height: 140px;
      object-fit: cover;
      display: block;
    }
    .collage-card-info {
      padding: 10px 12px;
    }
    .collage-card-date {
      font-size: 10px;
      color: ${C.muted};
      margin-bottom: 3px;
    }
    .collage-card-title {
      font-size: 12px;
      font-weight: 600;
      color: ${C.text};
      line-height: 1.3;
    }
    .collage-round-wrap {
      position: relative;
    }
    .collage-round-img {
      width: 100%;
      height: 140px;
      object-fit: cover;
      border-radius: 16px;
    }
    .collage-round-overlay {
      position: absolute;
      bottom: 10px;
      left: 10px;
      right: 10px;
      background: rgba(0,0,0,0.55);
      border-radius: 10px;
      padding: 8px 10px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .collage-round-label {
      font-size: 11px;
      font-weight: 600;
      color: ${C.white};
    }
    .collage-round-btn {
      width: 24px;
      height: 24px;
      background: ${C.white};
      color: ${C.text};
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    /* ── QUOTE SECTION ── */
    .quote-section {
      background: ${C.sectionBg};
      padding: 100px 64px;
      text-align: center;
      position: relative;
    }
    .quote-eyebrow {
      font-size: 11px;
      font-weight: 600;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      color: ${C.muted};
      margin-bottom: 36px;
    }
    .quote-text {
      font-family: 'Playfair Display', serif;
      font-size: 34px;
      font-weight: 400;
      font-style: italic;
      line-height: 1.5;
      color: ${C.text};
      max-width: 800px;
      margin: 0 auto 48px;
      quotes: none;
    }
    .quote-text::before { content: '\\201C'; }
    .quote-text::after  { content: '\\201D'; }
    .quote-nav {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 12px;
    }
    .quote-nav-btn {
      width: 44px;
      height: 44px;
      border-radius: 50%;
      border: 1px solid ${C.border};
      background: ${C.white};
      color: ${C.text};
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background 0.2s, border-color 0.2s;
    }
    .quote-nav-btn:hover {
      background: ${C.text};
      color: ${C.white};
      border-color: ${C.text};
    }
    .quote-dots {
      display: flex;
      gap: 6px;
    }
    .quote-dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: ${C.border};
      transition: background 0.2s, width 0.2s;
    }
    .quote-dot.active {
      background: ${C.text};
      width: 20px;
      border-radius: 999px;
    }

    /* ── FOOTER ── */
    .footer {
      background: ${C.darkBg};
      padding: 64px 64px 40px;
    }
    .footer-top {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr 1fr;
      gap: 40px;
      padding-bottom: 48px;
      border-bottom: 1px solid rgba(255,255,255,0.08);
    }
    .footer-brand {}
    .footer-brand-name {
      font-family: 'Playfair Display', serif;
      font-size: 22px;
      font-weight: 700;
      color: ${C.white};
      margin-bottom: 12px;
      letter-spacing: -0.01em;
    }
    .footer-brand-desc {
      font-size: 13px;
      color: rgba(255,255,255,0.45);
      line-height: 1.7;
      max-width: 200px;
    }
    .footer-col-title {
      font-size: 12px;
      font-weight: 700;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: rgba(255,255,255,0.35);
      margin-bottom: 18px;
    }
    .footer-links {
      list-style: none;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .footer-links a {
      font-size: 13px;
      color: rgba(255,255,255,0.55);
      transition: color 0.2s;
    }
    .footer-links a:hover { color: ${C.white}; }
    .footer-bottom {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding-top: 32px;
      gap: 24px;
    }
    .footer-copy {
      font-size: 12px;
      color: rgba(255,255,255,0.3);
    }
    .footer-bottom-links {
      display: flex;
      gap: 24px;
      list-style: none;
    }
    .footer-bottom-links a {
      font-size: 12px;
      color: rgba(255,255,255,0.3);
      transition: color 0.2s;
    }
    .footer-bottom-links a:hover { color: rgba(255,255,255,0.65); }

    /* ── FADE-IN ANIMATION ── */
    .fade-in {
      opacity: 0;
      transform: translateY(24px);
      transition: opacity 0.65s ease, transform 0.65s ease;
    }
    .fade-in.visible {
      opacity: 1;
      transform: translateY(0);
    }

    /* ── RESPONSIVE ── */
    @media (max-width: 1024px) {
      .nav { padding: 16px 24px; }
      .nav-links { gap: 20px; }
      .hero-left { flex: 0 0 55%; }
      .hero-right { flex: 0 0 45%; padding: 36px 28px; }
      .hero-right-headline { font-size: 22px; }
      .styles-section { padding: 60px 32px; }
      .styles-content { grid-template-columns: 1fr; }
      .styles-collage { display: none; }
      .style-grid { grid-template-columns: repeat(5, 1fr); }
      .footer-top { grid-template-columns: 1fr 1fr; }
      .quote-text { font-size: 26px; }
    }

    @media (max-width: 768px) {
      .nav-links { display: none; }
      .hero { flex-direction: column; min-height: auto; }
      .hero-left { flex: none; min-height: 60vw; }
      .hero-right { flex: none; padding: 32px 20px; }
      .hero-right-headline { font-size: 20px; }
      .services-grid { grid-template-columns: 1fr; }
      .styles-section { padding: 48px 20px; }
      .styles-title { font-size: 28px; }
      .style-grid { grid-template-columns: repeat(4, 1fr); gap: 14px; }
      .style-avatar { width: 60px; height: 60px; }
      .quote-section { padding: 64px 24px; }
      .quote-text { font-size: 22px; }
      .footer { padding: 48px 24px 32px; }
      .footer-top { grid-template-columns: 1fr 1fr; gap: 28px; }
      .footer-bottom { flex-direction: column; text-align: center; }
    }

    @media (max-width: 480px) {
      .style-grid { grid-template-columns: repeat(3, 1fr); }
      .footer-top { grid-template-columns: 1fr; }
    }

    @media (prefers-reduced-motion: reduce) {
      .fade-in { opacity: 1; transform: none; transition: none; }
      * { transition-duration: 0.01ms !important; animation-duration: 0.01ms !important; }
    }
  </style>
</head>
<body>

  <!-- ── NAVIGATION ── -->
  <nav class="nav" role="navigation" aria-label="${t('aria_nav')}">
    <div class="nav-left">
      <span aria-hidden="true">${ICON_SETTINGS}</span>
      <span>${t('nav_menu')}</span>
    </div>
    <ul class="nav-links" role="list">
      <li><a href="javascript:void(0)" onclick="event.preventDefault()" class="active">${t('nav_home')}</a></li>
      <li><a href="#styles">${t('nav_gallery')}</a></li>
      <li><a href="#styles">${t('nav_features')}</a></li>
      <li><a href="#quote">${t('nav_reviews')}</a></li>
      <li><a href="#footer">${t('nav_about')}</a></li>
    </ul>
    <a href="#contact" class="nav-cta">${t('nav_cta')}</a>
  </nav>

  <!-- ── HERO SPLIT ── -->
  <section class="hero" aria-label="${t('aria_hero')}">

    <!-- Left — beige image column -->
    <div class="hero-left">
      <img
        class="hero-left-img"
        src="${img(0)}"
        alt="${brandName}"
        loading="eager"
      >
      <div class="hero-left-bottom">
        <div class="hero-left-copy">
          <p class="hero-left-eyebrow">${t('hero_eyebrow')} ${brandName}</p>
          <h1 class="hero-left-title">${data.product_name || brandName}</h1>
          <p class="hero-left-sub">${data.subtitle || heroHeadline}</p>
          <div class="hero-btns">
            <a href="#styles" class="btn-pill-white">
              ${ctaText}
            </a>
            <a href="#contact" class="btn-text-link">
              ${t('hero_book')} ${ICON_ARROW_LONG_RIGHT}
            </a>
          </div>
        </div>
        <div class="hero-experts" aria-label="${t('aria_experts')}">
          <div class="hero-avatars" aria-hidden="true">
            <span style="background-image:url('${img(1)}')"></span>
            <span style="background-image:url('${img(2)}')"></span>
            <span style="background-image:url('${img(3)}')"></span>
          </div>
          <span class="hero-experts-label">${t('hero_experts')}</span>
        </div>
      </div>
      <div class="hero-corner-note" aria-hidden="true">
        <p>${t('hero_corner')}</p>
        <div class="hero-corner-arrow">${ICON_ARROW_NE}</div>
      </div>
    </div>

    <!-- Right — white content column -->
    <div class="hero-right">
      <div class="hero-right-top">
        <h2 class="hero-right-headline">${heroHeadline}</h2>

        ${pressHTML}

        ${heroDesc ? `<p class="hero-right-desc">${heroDesc}</p>` : ''}

        ${priceBadge}

        <div class="hero-right-actions">
          <a href="#styles" class="btn-pill-dark">${ctaText}</a>
          ${membersHTML}
        </div>

        <div class="hero-right-divider" role="separator"></div>

        <p class="services-title">${t('services_title')}</p>
        <p class="services-tagline">${t('services_tagline')}</p>

        <div class="services-grid" role="list" aria-label="${t('services_title')}">
          ${servicesHTML}
        </div>
      </div>
    </div>

  </section>

  <!-- ── CATEGORIES / FEATURES ── -->
  <section class="styles-section fade-in" id="styles" aria-labelledby="styles-heading">
    <div class="styles-header">
      <div class="styles-header-left">
        <p class="styles-eyebrow">${t('styles_eyebrow')}</p>
        <h2 class="styles-title" id="styles-heading">${data.product_name || t('styles_title')}</h2>
        <p class="styles-subtitle">${data.subtitle || t('styles_subtitle')}</p>
      </div>
    </div>

    <div class="styles-content">
      <!-- Feature grid with circular avatars -->
      <div>
        <div class="style-grid" role="list" aria-label="${t('aria_styles')}">
          ${styleGridHTML}
        </div>
      </div>

      <!-- Collage right -->
      <div class="styles-collage" aria-hidden="true">
        <div class="collage-main">
          <img src="${img(4)}" alt="${brandName}" loading="lazy">
          <span class="collage-badge">${t('collage_badge')}</span>
        </div>
        <div class="collage-row">
          <div class="collage-card">
            <img src="${img(1)}" alt="${brandName}" loading="lazy">
            <div class="collage-card-info">
              <p class="collage-card-date">${brandName}</p>
              <p class="collage-card-title">${t('collage_card_title')}</p>
            </div>
          </div>
          <div class="collage-round-wrap">
            <img class="collage-round-img" src="${img(5)}" alt="${brandName}" loading="lazy">
            <div class="collage-round-overlay">
              <span class="collage-round-label">${data.product_name || t('collage_overlay')}</span>
              <div class="collage-round-btn" aria-hidden="true">${ICON_ARROW_NE}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- ── QUOTE / TESTIMONIALS ── -->
  <section class="quote-section fade-in" id="quote" aria-label="${t('quote_eyebrow')}">
    <p class="quote-eyebrow">${t('quote_eyebrow')}</p>
    <blockquote class="quote-text" id="quote-text">
      ${firstQuote}
    </blockquote>
    <div class="quote-nav" role="group" aria-label="${t('aria_quote_nav')}">
      <button class="quote-nav-btn" aria-label="${t('aria_prev')}" onclick="prevQuote()">
        ${ICON_ARROW_LEFT}
      </button>
      <div class="quote-dots" aria-hidden="true">
        <div class="quote-dot active" data-index="0"></div>
        <div class="quote-dot" data-index="1"></div>
        <div class="quote-dot" data-index="2"></div>
      </div>
      <button class="quote-nav-btn" aria-label="${t('aria_next')}" onclick="nextQuote()">
        ${ICON_ARROW_RIGHT}
      </button>
    </div>
  </section>

  <!-- ── FOOTER ── -->
  <footer class="footer" id="footer" aria-label="${t('aria_footer')}">
    <div class="footer-top">
      <div class="footer-brand">
        <p class="footer-brand-name">${brandName}</p>
        <p class="footer-brand-desc">${footerDesc}</p>
      </div>
      <div>
        <p class="footer-col-title">${t('footer_explore')}</p>
        <ul class="footer-links" role="list">
          <li><a href="javascript:void(0)" onclick="event.preventDefault()">${t('footer_products')}</a></li>
          <li><a href="#styles">${t('nav_features')}</a></li>
          <li><a href="#quote">${t('footer_reviews')}</a></li>
          <li><a href="#footer">${t('footer_faq')}</a></li>
        </ul>
      </div>
      <div>
        <p class="footer-col-title">${t('footer_services')}</p>
        <ul class="footer-links" role="list">
          <li><a href="javascript:void(0)" onclick="event.preventDefault()">${t('footer_delivery')}</a></li>
          <li><a href="javascript:void(0)" onclick="event.preventDefault()">${t('footer_returns')}</a></li>
          <li><a href="javascript:void(0)" onclick="event.preventDefault()">${t('footer_support')}</a></li>
          <li><a href="javascript:void(0)" onclick="event.preventDefault()">${t('footer_guarantee')}</a></li>
        </ul>
      </div>
      <div id="contact">
        <p class="footer-col-title">${t('footer_contact')}</p>
        <ul class="footer-links" role="list">
          <li><a href="javascript:void(0)" onclick="event.preventDefault()">${t('footer_order')}</a></li>
          <li><a href="javascript:void(0)" onclick="event.preventDefault()">${t('footer_instagram')}</a></li>
          <li><a href="javascript:void(0)" onclick="event.preventDefault()">${t('footer_support')}</a></li>
        </ul>
      </div>
    </div>
    <div class="footer-bottom">
      <p class="footer-copy">&copy; ${new Date().getFullYear()} ${brandName}. ${t('footer_copyright')}</p>
      <ul class="footer-bottom-links" role="list">
        <li><a href="javascript:void(0)" onclick="event.preventDefault()">${t('footer_privacy')}</a></li>
        <li><a href="javascript:void(0)" onclick="event.preventDefault()">${t('footer_terms')}</a></li>
        <li><a href="javascript:void(0)" onclick="event.preventDefault()">${t('footer_cookies')}</a></li>
      </ul>
    </div>
  </footer>

  <script>
    // ── QUOTE ROTATOR ─────────────────────────────────────────────────────────
    const QUOTES = ${JSON.stringify(allQuotes)}
    let currentQuote = 0

    function updateQuote(index) {
      const el = document.getElementById('quote-text')
      const dots = document.querySelectorAll('.quote-dot')
      if (!el) return
      el.style.opacity = '0'
      el.style.transform = 'translateY(10px)'
      setTimeout(function() {
        el.textContent = QUOTES[index]
        el.style.opacity = '1'
        el.style.transform = 'translateY(0)'
      }, 250)
      dots.forEach(function(d, i) {
        d.classList.toggle('active', i === index)
      })
    }

    function nextQuote() {
      currentQuote = (currentQuote + 1) % QUOTES.length
      updateQuote(currentQuote)
    }

    function prevQuote() {
      currentQuote = (currentQuote - 1 + QUOTES.length) % QUOTES.length
      updateQuote(currentQuote)
    }

    // Quote text smooth transition
    var quoteEl = document.getElementById('quote-text')
    if (quoteEl) {
      quoteEl.style.transition = 'opacity 0.25s ease, transform 0.25s ease'
    }

    // ── SCROLL FADE-IN ────────────────────────────────────────────────────────
    var fadeEls = document.querySelectorAll('.fade-in')
    var io = new IntersectionObserver(function(entries) {
      entries.forEach(function(e) {
        if (e.isIntersecting) {
          e.target.classList.add('visible')
          io.unobserve(e.target)
        }
      })
    }, { threshold: 0.12, rootMargin: '-40px' })
    fadeEls.forEach(function(el) { io.observe(el) })

    // ── FEATURE AVATAR ACTIVE STATE ───────────────────────────────────────────
    var styleItems = document.querySelectorAll('.style-item')
    styleItems.forEach(function(item) {
      item.addEventListener('click', function() {
        styleItems.forEach(function(i) {
          i.querySelector('.style-avatar').style.borderColor = 'transparent'
        })
        item.querySelector('.style-avatar').style.borderColor = '#1A1A1A'
      })
    })
  </script>


<!-- ═══ SECTIONS DYNAMIQUES (story / social_proof / comparison / testimonials / bonuses / guarantee) ═══ -->
${renderRichSections(data, STYLE_THEME)}

</body>
</html>`
}
