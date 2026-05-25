import type { LandingPageData } from '@/types'
import {
  renderRichSections,
  type SectionTheme,
  renderHeroThumbs,
} from './sections'

// ─── I18N ─────────────────────────────────────────────────────────────────────

const T: Record<string, Record<string, string>> = {
  // Nav
  nav_story:         { fr: 'Notre histoire',  en: 'Our story',     ar: 'قصتنا',         es: 'Nuestra historia' },
  nav_materials:     { fr: 'Matériaux',       en: 'Materials',     ar: 'المواد',         es: 'Materiales'       },
  nav_reviews:       { fr: 'Avis',            en: 'Reviews',       ar: 'التقييمات',      es: 'Reseñas'          },
  nav_cta:           { fr: 'Découvrir',       en: 'Shop now',      ar: 'تسوق الآن',      es: 'Comprar'          },

  // Hero
  hero_eyebrow:      { fr: 'Nouveau',         en: 'New',           ar: 'جديد',           es: 'Nuevo'            },
  hero_nature:       { fr: 'Fait pour durer', en: 'Made to last',  ar: 'صُنع ليدوم',     es: 'Hecho para durar' },
  hero_cta:          { fr: 'Découvrir',       en: 'Shop now',      ar: 'تسوق الآن',      es: 'Comprar'          },
  hero_scroll:       { fr: 'Défiler',         en: 'Scroll',        ar: 'تمرير',          es: 'Desplazar'        },
  hero_stat_suffix:  { fr: 'commandes',       en: 'orders',        ar: 'طلب',            es: 'pedidos'          },

  // Press
  press_eyebrow:     { fr: 'Vu dans',         en: 'Featured in',   ar: 'كما ذُكر في',    es: 'Visto en'         },

  // Story editorial
  story_eyebrow:     { fr: 'Notre histoire',  en: 'Our story',     ar: 'قصتنا',          es: 'Nuestra historia' },
  story_fallback_h:  { fr: 'Pourquoi ce produit existe',     en: 'Why this product exists',      ar: 'لماذا يوجد هذا المنتج',         es: 'Por qué existe este producto'    },
  story_fallback_p:  { fr: 'Nous avons créé ce produit pour résoudre un problème réel — pas pour suivre une tendance.', en: 'We built this product to solve a real problem — not to follow a trend.', ar: 'صنعنا هذا المنتج لحل مشكلة حقيقية — ليس لمتابعة الاتجاهات.', es: 'Creamos este producto para resolver un problema real — no para seguir una tendencia.' },

  // Materials / Features
  materials_eyebrow: { fr: 'Les matériaux',   en: 'Materials',     ar: 'المواد',          es: 'Los materiales'   },
  materials_title:   { fr: 'Conçu avec soin', en: 'Crafted with care', ar: 'مصنوع بعناية', es: 'Fabricado con cuidado' },
  feat_fallback_0:   { fr: 'Matière naturelle',       en: 'Natural material',          ar: 'مادة طبيعية',         es: 'Material natural'         },
  feat_fallback_1:   { fr: 'Fabrication responsable', en: 'Responsible manufacturing', ar: 'تصنيع مسؤول',         es: 'Fabricación responsable'  },
  feat_fallback_2:   { fr: 'Durabilité certifiée',    en: 'Certified durability',      ar: 'متانة معتمدة',        es: 'Durabilidad certificada'   },
  feat_desc_0:       { fr: 'Sélectionné à la source pour sa qualité supérieure.', en: 'Sourced for superior quality.', ar: 'مختار من المصدر لجودته العالية.', es: 'Seleccionado en origen por su calidad superior.' },
  feat_desc_1:       { fr: 'Chaque pièce assemblée avec une attention extrême.', en: 'Every piece assembled with extreme care.', ar: 'كل قطعة مجمعة باهتمام شديد.', es: 'Cada pieza ensamblada con extremo cuidado.' },
  feat_desc_2:       { fr: 'Conçu pour accompagner chaque jour, longtemps.', en: 'Designed to accompany every day, for a long time.', ar: 'مصمم ليرافق كل يوم، لفترة طويلة.', es: 'Diseñado para acompañar cada día, durante mucho tiempo.' },

  // Before / After
  before_label:      { fr: 'Avant',           en: 'Before',        ar: 'قبل',            es: 'Antes'            },
  after_label:       { fr: 'Après',           en: 'After',         ar: 'بعد',            es: 'Después'          },
  ba_eyebrow:        { fr: 'Transformation',  en: 'Transformation', ar: 'التحول',        es: 'Transformación'   },
  ba_title:          { fr: 'La différence',   en: 'The difference', ar: 'الفرق',         es: 'La diferencia'    },

  // Testimonial
  testimonial_eyebrow: { fr: 'Ce qu\'ils disent', en: 'What they say', ar: 'ما يقولونه', es: 'Lo que dicen'    },
  testimonial_fallback: { fr: 'Ce produit a changé ma façon de consommer. Je ne reviendrai pas en arrière.', en: 'This product changed the way I consume. I won\'t go back.', ar: 'غيّر هذا المنتج طريقة استهلاكي. لن أعود أبدًا.', es: 'Este producto cambió mi forma de consumir. No volvería atrás.' },
  testimonial_name:  { fr: 'Camille L.',      en: 'Camille L.',    ar: 'كاميل ل.',        es: 'Camille L.'       },
  testimonial_role:  { fr: 'Cliente depuis 2 ans', en: 'Customer for 2 years', ar: 'عميلة منذ سنتين', es: 'Cliente desde hace 2 años' },

  // Behind design
  behind_eyebrow:    { fr: 'Coulisses',       en: 'Behind the scenes', ar: 'خلف الكواليس', es: 'Detrás del diseño' },
  behind_title:      { fr: 'Derrière le design', en: 'Behind the design', ar: 'خلف التصميم', es: 'Detrás del diseño' },
  behind_fallback:   { fr: 'Chaque détail a été pensé dans un seul objectif : vous offrir quelque chose qui dure vraiment, qui s\'améliore avec le temps, et qui ne compromet jamais la planète.', en: 'Every detail was thought out with a single goal: to offer you something that truly lasts, improves over time, and never compromises the planet.', ar: 'تم التفكير في كل تفصيل بهدف واحد: تقديم شيء يدوم حقًا، ويتحسن مع الوقت، ولا يضر بالكوكب أبدًا.', es: 'Cada detalle fue pensado con un solo objetivo: ofrecerte algo que realmente dure, que mejore con el tiempo y que nunca comprometa el planeta.' },

  // Gallery
  gallery_eyebrow:   { fr: 'Galerie',         en: 'Gallery',       ar: 'المعرض',         es: 'Galería'          },

  // FAQ
  faq_eyebrow:       { fr: 'Questions',       en: 'Questions',     ar: 'الأسئلة',        es: 'Preguntas'        },
  faq_title:         { fr: 'Ce que vous voulez savoir', en: 'What you want to know', ar: 'ما تريد معرفته', es: 'Lo que quieres saber' },

  // Risk reversal
  rr_shipping:       { fr: 'Livraison offerte', en: 'Free shipping',  ar: 'شحن مجاني',    es: 'Envío gratis'     },
  rr_returns:        { fr: 'Retour 30 jours',   en: '30-day returns', ar: 'إرجاع 30 يومًا', es: 'Devolución 30 días' },
  rr_carbon:         { fr: 'Neutre en carbone', en: 'Carbon neutral', ar: 'محايد كربونيًا', es: 'Neutro en carbono' },

  // Final CTA
  final_eyebrow:     { fr: 'Prêt à commencer ?', en: 'Ready to start?', ar: 'مستعد للبدء؟', es: '¿Listo para empezar?' },
  final_cta:         { fr: 'Découvrir maintenant', en: 'Shop now', ar: 'تسوق الآن', es: 'Comprar ahora' },
  final_sub:         { fr: 'Livraison gratuite · Retour 30 jours · Neutre en carbone', en: 'Free shipping · 30-day returns · Carbon neutral', ar: 'شحن مجاني · إرجاع 30 يومًا · محايد كربونيًا', es: 'Envío gratis · Devolución 30 días · Neutro en carbono' },

  // Footer
  footer_explore:    { fr: 'Explorer',        en: 'Explore',       ar: 'استكشف',         es: 'Explorar'         },
  footer_products:   { fr: 'Produits',        en: 'Products',      ar: 'المنتجات',       es: 'Productos'        },
  footer_reviews:    { fr: 'Avis clients',    en: 'Reviews',       ar: 'آراء العملاء',   es: 'Reseñas'          },
  footer_faq:        { fr: 'FAQ',             en: 'FAQ',           ar: 'الأسئلة الشائعة', es: 'FAQ'             },
  footer_services:   { fr: 'Services',        en: 'Services',      ar: 'الخدمات',        es: 'Servicios'        },
  footer_delivery:   { fr: 'Livraison',       en: 'Delivery',      ar: 'التوصيل',        es: 'Entrega'          },
  footer_returns:    { fr: 'Retours',         en: 'Returns',       ar: 'الإرجاع',        es: 'Devoluciones'     },
  footer_support:    { fr: 'Support',         en: 'Support',       ar: 'الدعم',          es: 'Soporte'          },
  footer_contact:    { fr: 'Contact',         en: 'Contact',       ar: 'تواصل',          es: 'Contacto'         },
  footer_copyright:  { fr: 'Tous droits réservés.', en: 'All rights reserved.', ar: 'جميع الحقوق محفوظة.', es: 'Todos los derechos reservados.' },
  footer_privacy:    { fr: 'Confidentialité', en: 'Privacy',       ar: 'الخصوصية',       es: 'Privacidad'       },
  footer_terms:      { fr: 'Conditions',      en: 'Terms',         ar: 'الشروط',         es: 'Términos'         },
  footer_desc_fallback: { fr: 'Conçu pour durer. Fabriqué avec soin.', en: 'Designed to last. Made with care.', ar: 'مصمم ليدوم. مصنوع بعناية.', es: 'Diseñado para durar. Fabricado con cuidado.' },

  // Aria
  aria_nav:          { fr: 'Navigation principale', en: 'Main navigation', ar: 'التنقل الرئيسي', es: 'Navegación principal' },
  aria_hero:         { fr: 'Section principale',    en: 'Main section',    ar: 'القسم الرئيسي',  es: 'Sección principal'   },
  aria_gallery:      { fr: 'Galerie produit',        en: 'Product gallery', ar: 'معرض المنتج',    es: 'Galería del producto' },
  aria_footer:       { fr: 'Pied de page',           en: 'Footer',          ar: 'تذييل الصفحة',  es: 'Pie de página'       },
  aria_prev:         { fr: 'Avis précédent',         en: 'Previous review', ar: 'الرأي السابق',   es: 'Reseña anterior'     },
  aria_next:         { fr: 'Avis suivant',           en: 'Next review',     ar: 'الرأي التالي',   es: 'Siguiente reseña'    },
}

// ─── COULEURS NATURE ──────────────────────────────────────────────────────────
// Jamais de noir pur en fond. Le charcoal sert uniquement pour le texte.

const N = {
  sage:      '#A8B5A0', // vert sauge — accent principal
  terra:     '#C8A887', // terre — accent secondaire chaud
  sand:      '#F5F1EB', // sable — fond principal très clair
  sandAlt:   '#EDE8DF', // sable légèrement plus profond — fond alternatif
  white:     '#FFFFFF', // blanc pur — surfaces
  charcoal:  '#2D2D2D', // charcoal — texte (jamais noir pur)
  textMuted: '#7A7A72', // muted — body text secondaire
  border:    '#DDD8CF', // bordure douce terre/sable
  sageLight: '#EEF2EC', // sage très clair — bg badges/chips
}

// ─── THEME SECTIONS ───────────────────────────────────────────────────────────

const NATURAL_THEME: SectionTheme = {
  primary:    N.sage,
  accent:     N.sageLight,
  text:       N.charcoal,
  textMuted:  N.textMuted,
  bg:         N.white,
  bgAlt:      N.sand,
  border:     N.border,
  fontFamily: "'Inter', sans-serif",
  radius:     '4px',
}

// ─── FALLBACK IMAGES — matériaux naturels, lumière naturelle, sans visage fashion stéréotypé ──

const FALLBACK_IMGS = [
  'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&q=85', // laine naturelle texture cream
  'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=800&q=80',  // atelier mains savoir-faire
  'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&q=80', // vêtement lin naturel lifestyle
  'https://images.unsplash.com/photo-1617137968427-85924c800a22?w=800&q=80', // sneaker blanc sur herbe
  'https://images.unsplash.com/photo-1604537529428-15bcbeecfe4d?w=800&q=80', // tissu coton brut macro
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1600&q=85', // paysage montagne lumière naturelle
]

// ─── SVG ICONS outline 1.5px — aucun emoji ────────────────────────────────────

const ICO = {
  leaf:    `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/></svg>`,
  package: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><line x1="16.5" y1="9.4" x2="7.5" y2="4.21"/><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>`,
  recycle: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="1 4 1 10 7 10"/><polyline points="23 20 23 14 17 14"/><path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4-4.64 4.36A9 9 0 0 1 3.51 15"/></svg>`,
  truck:   `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>`,
  return_: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-3"/></svg>`,
  arrow_r: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>`,
  arrow_l: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>`,
  check:   `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`,
  feather: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z"/><line x1="16" y1="8" x2="2" y2="22"/><line x1="17" y1="15" x2="9" y2="15"/></svg>`,
  sun:     `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>`,
}

// ─── TEMPLATE ─────────────────────────────────────────────────────────────────

export function templateEtecNatural(data: LandingPageData): string {
  const lang = data.language ?? 'fr'
  const t = (key: string): string => T[key]?.[lang] ?? T[key]?.['fr'] ?? key

  // Résolution images
  const _real = data.images?.filter(Boolean) ?? []
  const imgs = (i: number): string =>
    _real[i] ?? FALLBACK_IMGS[i % FALLBACK_IMGS.length] ?? FALLBACK_IMGS[0]!

  // Données produit
  const brandName  = data.product_name || 'Natural'
  const ctaText    = data.cta || t('hero_cta')
  const price      = data.price ?? null
  const origPrice  = data.original_price ?? null
  const savePct    = price && origPrice
    ? Math.round((1 - +price / +origPrice) * 100)
    : 0

  // Benefits / features (max 3 pour la grille matériaux)
  const benefits = data.benefits?.slice(0, 5) ?? []
  const features = data.features?.slice(0, 3) ?? []

  const featureCards = [0, 1, 2].map(i => {
    const feat = features[i]
    return {
      title: feat?.title ?? t(`feat_fallback_${i}`),
      desc:  feat?.description ?? t(`feat_desc_${i}`),
      icon:  i === 0 ? ICO.feather : i === 1 ? ICO.recycle : ICO.sun,
    }
  })

  // Press mentions
  const pressMentions = data.press_mentions?.slice(0, 5) ?? []

  // Testimonials — 1 central
  const testimonialText = data.testimonials?.[0]?.text ?? t('testimonial_fallback')
  const testimonialName = data.testimonials?.[0]?.name ?? t('testimonial_name')
  const testimonialRole = data.testimonials?.[0]?.location ?? t('testimonial_role')

  // Story éditoriale
  const storyTitle = data.story?.solution ?? data.unique_mechanism?.name ?? t('story_fallback_h')
  const storyBody  =
    data.story?.transformation ??
    data.unique_mechanism?.description ??
    data.subtitle ??
    t('story_fallback_p')
  const storyProblem = data.story?.problem ?? ''

  // Behind design — fond text éditorial
  const behindText =
    data.founder_note?.message ??
    data.unique_mechanism?.proof ??
    t('behind_fallback')
  const behindAuthor = data.founder_note
    ? `${data.founder_note.name} · ${data.founder_note.role}`
    : null

  // FAQ accordion
  const faqHtml = data.faq.length > 0
    ? data.faq.map((f, i) => `
    <div class="nat-faq-item">
      <button
        class="nat-faq-btn"
        onclick="(function(){var c=document.getElementById('nfaq-${i}');var a=document.getElementById('narr-${i}');var open=c.style.maxHeight!=='0px'&&c.style.maxHeight!=='';c.style.maxHeight=open?'0px':'400px';c.style.paddingTop=open?'0':'12px';a.style.transform=open?'rotate(0deg)':'rotate(45deg)';})()"
        aria-expanded="false"
      >
        <span class="nat-faq-q">${f.question}</span>
        <span id="narr-${i}" class="nat-faq-arr" aria-hidden="true">+</span>
      </button>
      <div id="nfaq-${i}" class="nat-faq-body">
        <p class="nat-faq-a">${f.answer}</p>
      </div>
    </div>`).join('')
    : ''

  // Social proof stat
  const statCustomers = data.social_proof?.customers ?? null

  // Before / after textuel (données) → photo split si pas de données spécifiques
  const hasBa = (data.before_after?.length ?? 0) > 0

  // Footer desc
  const footerDesc = data.subtitle || t('footer_desc_fallback')

  return `<!DOCTYPE html>
<html lang="${lang}" dir="${lang === 'ar' ? 'rtl' : 'ltr'}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${brandName}</title>
  <meta name="description" content="${data.subtitle || storyTitle}">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet">
  <style>
    /* ── RESET ── */
    *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
    html { scroll-behavior: smooth; }
    body {
      font-family: 'Inter', sans-serif;
      background: ${N.sand};
      color: ${N.charcoal};
      -webkit-font-smoothing: antialiased;
      overflow-x: hidden;
    }
    img { display: block; max-width: 100%; }
    a { text-decoration: none; color: inherit; }
    button { cursor: pointer; border: none; background: none; font-family: inherit; }

    /* ── TOKENS ── */
    :root {
      --sage:      ${N.sage};
      --terra:     ${N.terra};
      --sand:      ${N.sand};
      --sand-alt:  ${N.sandAlt};
      --white:     ${N.white};
      --charcoal:  ${N.charcoal};
      --muted:     ${N.textMuted};
      --border:    ${N.border};
      --sage-light:${N.sageLight};
    }

    /* ── NAV ── */
    .nat-nav {
      position: sticky;
      top: 0;
      z-index: 100;
      background: ${N.white};
      border-bottom: 1px solid ${N.border};
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 20px 64px;
    }
    .nat-nav-brand {
      font-family: 'Playfair Display', serif;
      font-size: 18px;
      font-weight: 600;
      color: ${N.charcoal};
      letter-spacing: -0.01em;
    }
    .nat-nav-links {
      display: flex;
      align-items: center;
      gap: 40px;
      list-style: none;
    }
    .nat-nav-links a {
      font-size: 13px;
      font-weight: 400;
      color: ${N.textMuted};
      letter-spacing: 0.01em;
      transition: color 0.2s;
    }
    .nat-nav-links a:hover { color: ${N.charcoal}; }
    .nat-nav-cta {
      font-size: 13px;
      font-weight: 500;
      color: ${N.charcoal};
      border-bottom: 1px solid ${N.charcoal};
      padding-bottom: 1px;
      transition: opacity 0.2s;
      display: inline-flex;
      align-items: center;
      gap: 6px;
    }
    .nat-nav-cta:hover { opacity: 0.6; }

    /* ── HERO SPLIT ── */
    .nat-hero {
      display: flex;
      min-height: calc(100vh - 61px);
      background: ${N.white};
    }
    /* Image column — 55% */
    .nat-hero-img-col {
      flex: 0 0 55%;
      position: relative;
      overflow: hidden;
      background: ${N.sandAlt};
    }
    .nat-hero-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: center;
      display: block;
      min-height: 560px;
    }
    /* Info column — 45% */
    .nat-hero-info-col {
      flex: 0 0 45%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      padding: 80px 72px;
    }
    .nat-eyebrow {
      font-size: 11px;
      font-weight: 500;
      letter-spacing: 0.15em;
      text-transform: uppercase;
      color: ${N.sage};
      margin-bottom: 20px;
    }
    .nat-hero-h1 {
      font-family: 'Playfair Display', serif;
      font-size: clamp(40px, 4.5vw, 64px);
      font-weight: 700;
      color: ${N.charcoal};
      line-height: 1.15;
      letter-spacing: -0.02em;
      margin-bottom: 20px;
    }
    .nat-hero-sub {
      font-size: 17px;
      color: ${N.textMuted};
      line-height: 1.75;
      max-width: 400px;
      margin-bottom: 40px;
    }
    /* Price block */
    .nat-price-row {
      display: flex;
      align-items: baseline;
      gap: 12px;
      margin-bottom: 40px;
    }
    .nat-price {
      font-size: 32px;
      font-weight: 600;
      color: ${N.charcoal};
      letter-spacing: -0.02em;
    }
    .nat-price-orig {
      font-size: 18px;
      color: ${N.textMuted};
      text-decoration: line-through;
    }
    .nat-save-badge {
      font-size: 11px;
      font-weight: 600;
      color: ${N.sage};
      background: ${N.sageLight};
      padding: 3px 10px;
      border-radius: 2px;
      letter-spacing: 0.05em;
      text-transform: uppercase;
    }
    /* Hero benefits list */
    .nat-benefits {
      list-style: none;
      display: flex;
      flex-direction: column;
      gap: 10px;
      margin-bottom: 40px;
    }
    .nat-benefit-item {
      display: flex;
      align-items: flex-start;
      gap: 10px;
      font-size: 14px;
      color: ${N.textMuted};
      line-height: 1.5;
    }
    .nat-benefit-check {
      flex-shrink: 0;
      width: 18px;
      height: 18px;
      border-radius: 50%;
      border: 1.5px solid ${N.sage};
      display: flex;
      align-items: center;
      justify-content: center;
      color: ${N.sage};
      margin-top: 1px;
    }
    /* CTA hero */
    .nat-cta-primary {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      background: ${N.charcoal};
      color: ${N.white};
      font-size: 14px;
      font-weight: 500;
      padding: 16px 36px;
      border-radius: 2px;
      letter-spacing: 0.03em;
      transition: opacity 0.2s, transform 0.15s;
      margin-bottom: 16px;
      width: fit-content;
    }
    .nat-cta-primary:hover { opacity: 0.82; transform: translateY(-1px); }
    .nat-cta-secondary {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      font-size: 13px;
      font-weight: 400;
      color: ${N.textMuted};
      transition: color 0.2s;
    }
    .nat-cta-secondary:hover { color: ${N.charcoal}; }
    /* Stat hero */
    .nat-hero-stat {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-top: 40px;
      padding-top: 32px;
      border-top: 1px solid ${N.border};
    }
    .nat-hero-stat-num {
      font-family: 'Playfair Display', serif;
      font-size: 28px;
      font-weight: 600;
      color: ${N.charcoal};
    }
    .nat-hero-stat-label {
      font-size: 12px;
      color: ${N.textMuted};
      line-height: 1.4;
    }
    /* Hero thumb strip */
    .nat-thumb-strip {
      position: absolute;
      bottom: 24px;
      left: 24px;
      display: flex;
      gap: 8px;
    }

    /* ── PRESS MENTIONS ÉDITORIAL ── */
    .nat-press {
      background: ${N.sand};
      padding: 28px 64px;
      display: flex;
      align-items: center;
      gap: 48px;
      border-top: 1px solid ${N.border};
    }
    .nat-press-label {
      font-size: 10px;
      font-weight: 600;
      letter-spacing: 0.14em;
      text-transform: uppercase;
      color: ${N.textMuted};
      white-space: nowrap;
      flex-shrink: 0;
    }
    .nat-press-divider {
      width: 1px;
      height: 20px;
      background: ${N.border};
      flex-shrink: 0;
    }
    .nat-press-items {
      display: flex;
      align-items: center;
      gap: 40px;
      flex-wrap: wrap;
    }
    .nat-press-item {
      font-size: 13px;
      font-weight: 600;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: ${N.textMuted};
      opacity: 0.55;
      transition: opacity 0.2s;
    }
    .nat-press-item:hover { opacity: 0.85; }

    /* ── SECTIONS COMMUNES ── */
    .nat-section {
      padding: 120px 64px;
    }
    .nat-section-alt {
      padding: 120px 64px;
      background: ${N.white};
    }
    .nat-container {
      max-width: 1160px;
      margin: 0 auto;
    }
    .nat-container-narrow {
      max-width: 800px;
      margin: 0 auto;
    }
    .nat-section-eyebrow {
      font-size: 11px;
      font-weight: 500;
      letter-spacing: 0.15em;
      text-transform: uppercase;
      color: ${N.sage};
      margin-bottom: 16px;
    }
    .nat-section-h2 {
      font-family: 'Playfair Display', serif;
      font-size: clamp(32px, 3.5vw, 52px);
      font-weight: 700;
      color: ${N.charcoal};
      line-height: 1.2;
      letter-spacing: -0.02em;
      margin-bottom: 20px;
    }
    .nat-section-lead {
      font-size: 17px;
      color: ${N.textMuted};
      line-height: 1.75;
      max-width: 560px;
    }

    /* ── STORY ÉDITORIALE ── */
    .nat-story-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 80px;
      align-items: center;
    }
    .nat-story-text {}
    .nat-story-problem {
      font-size: 13px;
      font-style: italic;
      color: ${N.textMuted};
      border-left: 2px solid ${N.terra};
      padding-left: 20px;
      margin-bottom: 32px;
      line-height: 1.7;
    }
    .nat-story-body {
      font-size: 17px;
      color: ${N.charcoal};
      line-height: 1.85;
    }
    .nat-story-img {
      position: relative;
    }
    .nat-story-img img {
      width: 100%;
      aspect-ratio: 3/4;
      object-fit: cover;
      display: block;
    }

    /* ── MATERIALS / FEATURES GRID ── */
    .nat-feat-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1px;
      background: ${N.border};
      margin-top: 64px;
    }
    .nat-feat-card {
      background: ${N.white};
      padding: 48px 40px;
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
    .nat-feat-icon {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: ${N.sageLight};
      display: flex;
      align-items: center;
      justify-content: center;
      color: ${N.sage};
    }
    .nat-feat-num {
      font-size: 11px;
      font-weight: 500;
      letter-spacing: 0.12em;
      color: ${N.terra};
      text-transform: uppercase;
    }
    .nat-feat-title {
      font-family: 'Playfair Display', serif;
      font-size: 22px;
      font-weight: 600;
      color: ${N.charcoal};
      line-height: 1.3;
    }
    .nat-feat-desc {
      font-size: 15px;
      color: ${N.textMuted};
      line-height: 1.7;
    }

    /* ── AVANT / APRÈS ── */
    .nat-ba-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 2px;
      margin-top: 56px;
    }
    .nat-ba-item {
      position: relative;
      overflow: hidden;
    }
    .nat-ba-item img {
      width: 100%;
      height: 400px;
      object-fit: cover;
      display: block;
    }
    .nat-ba-label {
      position: absolute;
      bottom: 20px;
      left: 20px;
      font-size: 11px;
      font-weight: 600;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      color: ${N.white};
      background: rgba(45, 45, 45, 0.72);
      padding: 6px 16px;
      backdrop-filter: blur(4px);
    }
    .nat-ba-item.before img { filter: saturate(0.45); }

    /* ── TESTIMONIAL CENTRAL ── */
    .nat-testimonial {
      text-align: center;
    }
    .nat-quote-mark {
      font-family: 'Playfair Display', serif;
      font-size: 80px;
      line-height: 0.5;
      color: ${N.terra};
      opacity: 0.3;
      margin-bottom: 16px;
      display: block;
    }
    .nat-quote-text {
      font-family: 'Playfair Display', serif;
      font-size: clamp(22px, 2.5vw, 34px);
      font-weight: 400;
      font-style: italic;
      color: ${N.charcoal};
      line-height: 1.6;
      max-width: 720px;
      margin: 0 auto 40px;
    }
    .nat-quote-author {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 4px;
    }
    .nat-quote-name {
      font-size: 14px;
      font-weight: 600;
      color: ${N.charcoal};
      letter-spacing: 0.03em;
    }
    .nat-quote-role {
      font-size: 12px;
      color: ${N.textMuted};
    }
    .nat-quote-line {
      width: 40px;
      height: 1px;
      background: ${N.terra};
      margin: 0 auto 32px;
    }
    /* Testimonial nav */
    .nat-quote-nav {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 12px;
      margin-top: 48px;
    }
    .nat-quote-nav-btn {
      width: 44px;
      height: 44px;
      border-radius: 50%;
      border: 1px solid ${N.border};
      background: ${N.white};
      color: ${N.charcoal};
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background 0.2s, border-color 0.2s;
    }
    .nat-quote-nav-btn:hover {
      background: ${N.charcoal};
      color: ${N.white};
      border-color: ${N.charcoal};
    }
    .nat-quote-dots {
      display: flex;
      gap: 6px;
    }
    .nat-quote-dot {
      width: 5px;
      height: 5px;
      border-radius: 50%;
      background: ${N.border};
      transition: all 0.25s;
    }
    .nat-quote-dot.active {
      background: ${N.charcoal};
      width: 18px;
      border-radius: 999px;
    }

    /* ── BEHIND THE DESIGN ── */
    .nat-behind-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 80px;
      align-items: center;
    }
    .nat-behind-img img {
      width: 100%;
      aspect-ratio: 4/5;
      object-fit: cover;
    }
    .nat-behind-content {}
    .nat-behind-body {
      font-size: 18px;
      color: ${N.charcoal};
      line-height: 1.85;
      margin-bottom: 40px;
    }
    .nat-behind-author {
      font-size: 13px;
      font-weight: 500;
      color: ${N.textMuted};
      letter-spacing: 0.04em;
    }

    /* ── GALERIE 2×2 ── */
    .nat-gallery-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 4px;
      margin-top: 56px;
    }
    .nat-gallery-item img {
      width: 100%;
      aspect-ratio: 4/3;
      object-fit: cover;
      display: block;
      transition: transform 0.5s ease;
    }
    .nat-gallery-item:hover img { transform: scale(1.02); }
    .nat-gallery-item { overflow: hidden; }

    /* ── FAQ ── */
    .nat-faq-list {
      margin-top: 56px;
    }
    .nat-faq-item {
      border-top: 1px solid ${N.border};
    }
    .nat-faq-item:last-child {
      border-bottom: 1px solid ${N.border};
    }
    .nat-faq-btn {
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 24px 0;
      background: none;
      border: none;
      cursor: pointer;
      text-align: left;
      gap: 16px;
    }
    .nat-faq-q {
      font-size: 16px;
      font-weight: 500;
      color: ${N.charcoal};
      line-height: 1.4;
    }
    .nat-faq-arr {
      font-size: 22px;
      color: ${N.textMuted};
      transition: transform 0.3s;
      flex-shrink: 0;
      font-weight: 300;
    }
    .nat-faq-body {
      max-height: 0;
      overflow: hidden;
      transition: max-height 0.35s ease, padding-top 0.35s ease;
      padding-top: 0;
    }
    .nat-faq-a {
      font-size: 15px;
      color: ${N.textMuted};
      line-height: 1.75;
      padding-bottom: 24px;
    }

    /* ── RISK REVERSAL FOOTER PRE-CTA ── */
    .nat-rr-strip {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 40px;
      padding: 24px 64px;
      background: ${N.sandAlt};
      border-top: 1px solid ${N.border};
    }
    .nat-rr-item {
      display: flex;
      align-items: center;
      gap: 10px;
      font-size: 13px;
      color: ${N.textMuted};
    }
    .nat-rr-icon {
      color: ${N.sage};
    }

    /* ── FINAL CTA ── */
    .nat-final-cta {
      background: ${N.white};
      padding: 140px 64px;
      text-align: center;
    }
    .nat-final-h2 {
      font-family: 'Playfair Display', serif;
      font-size: clamp(36px, 4vw, 56px);
      font-weight: 700;
      color: ${N.charcoal};
      line-height: 1.2;
      letter-spacing: -0.02em;
      margin-bottom: 20px;
    }
    .nat-final-sub {
      font-size: 16px;
      color: ${N.textMuted};
      line-height: 1.7;
      margin-bottom: 48px;
      max-width: 480px;
      margin-left: auto;
      margin-right: auto;
    }
    .nat-final-price {
      font-family: 'Playfair Display', serif;
      font-size: 48px;
      font-weight: 700;
      color: ${N.charcoal};
      letter-spacing: -0.03em;
      margin-bottom: 40px;
    }
    .nat-btn-outlined {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      border: 1.5px solid ${N.charcoal};
      color: ${N.charcoal};
      font-size: 14px;
      font-weight: 500;
      padding: 16px 48px;
      letter-spacing: 0.05em;
      text-transform: uppercase;
      transition: background 0.2s, color 0.2s;
    }
    .nat-btn-outlined:hover {
      background: ${N.charcoal};
      color: ${N.white};
    }
    .nat-final-note {
      font-size: 12px;
      color: ${N.textMuted};
      margin-top: 24px;
      letter-spacing: 0.04em;
    }

    /* ── FOOTER ── */
    .nat-footer {
      background: ${N.sandAlt};
      border-top: 1px solid ${N.border};
      padding: 80px 64px 48px;
    }
    .nat-footer-top {
      display: grid;
      grid-template-columns: 1.5fr 1fr 1fr 1fr;
      gap: 48px;
      padding-bottom: 48px;
      border-bottom: 1px solid ${N.border};
    }
    .nat-footer-brand-name {
      font-family: 'Playfair Display', serif;
      font-size: 20px;
      font-weight: 600;
      color: ${N.charcoal};
      margin-bottom: 12px;
    }
    .nat-footer-brand-desc {
      font-size: 13px;
      color: ${N.textMuted};
      line-height: 1.7;
      max-width: 220px;
    }
    .nat-footer-col-title {
      font-size: 11px;
      font-weight: 600;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      color: ${N.charcoal};
      margin-bottom: 20px;
    }
    .nat-footer-links {
      list-style: none;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .nat-footer-links a {
      font-size: 13px;
      color: ${N.textMuted};
      transition: color 0.2s;
    }
    .nat-footer-links a:hover { color: ${N.charcoal}; }
    .nat-footer-bottom {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding-top: 32px;
      gap: 24px;
    }
    .nat-footer-copy {
      font-size: 12px;
      color: ${N.textMuted};
    }
    .nat-footer-legal {
      display: flex;
      gap: 24px;
      list-style: none;
    }
    .nat-footer-legal a {
      font-size: 12px;
      color: ${N.textMuted};
      transition: color 0.2s;
    }
    .nat-footer-legal a:hover { color: ${N.charcoal}; }

    /* ── FADE-IN SCROLL ── */
    .nat-fade {
      opacity: 0;
      transform: translateY(28px);
      transition: opacity 0.7s cubic-bezier(0.4, 0, 0.2, 1), transform 0.7s cubic-bezier(0.4, 0, 0.2, 1);
    }
    .nat-fade.visible {
      opacity: 1;
      transform: translateY(0);
    }
    .nat-fade-delay-1 { transition-delay: 0.1s; }
    .nat-fade-delay-2 { transition-delay: 0.2s; }
    .nat-fade-delay-3 { transition-delay: 0.3s; }

    /* ── RESPONSIVE ── */
    @media (max-width: 1024px) {
      .nat-nav { padding: 18px 32px; }
      .nat-hero-info-col { padding: 60px 40px; }
      .nat-section, .nat-section-alt { padding: 80px 32px; }
      .nat-press { padding: 24px 32px; gap: 28px; }
      .nat-story-grid, .nat-behind-grid { gap: 48px; }
      .nat-rr-strip { padding: 20px 32px; }
      .nat-final-cta { padding: 100px 32px; }
      .nat-footer { padding: 64px 32px 40px; }
      .nat-footer-top { grid-template-columns: 1fr 1fr; gap: 32px; }
    }

    @media (max-width: 768px) {
      .nat-nav { padding: 16px 20px; }
      .nat-nav-links { display: none; }
      .nat-hero { flex-direction: column; min-height: auto; }
      .nat-hero-img-col { flex: none; height: 60vw; min-height: 280px; }
      .nat-hero-img { min-height: 0; height: 100%; }
      .nat-hero-info-col { flex: none; padding: 48px 24px; }
      .nat-hero-h1 { font-size: 36px; }
      .nat-story-grid { grid-template-columns: 1fr; gap: 40px; }
      .nat-story-img { order: -1; }
      .nat-story-img img { aspect-ratio: 16/9; }
      .nat-feat-grid { grid-template-columns: 1fr; }
      .nat-ba-grid { grid-template-columns: 1fr; gap: 2px; }
      .nat-behind-grid { grid-template-columns: 1fr; gap: 40px; }
      .nat-behind-img { order: -1; }
      .nat-behind-img img { aspect-ratio: 16/9; }
      .nat-gallery-grid { grid-template-columns: 1fr; }
      .nat-rr-strip { flex-direction: column; gap: 16px; align-items: flex-start; padding: 24px 20px; }
      .nat-section, .nat-section-alt { padding: 80px 20px; }
      .nat-press { flex-direction: column; align-items: flex-start; gap: 16px; padding: 20px; }
      .nat-press-items { gap: 20px; }
      .nat-final-cta { padding: 80px 20px; }
      .nat-footer { padding: 48px 20px 32px; }
      .nat-footer-top { grid-template-columns: 1fr 1fr; }
      .nat-footer-bottom { flex-direction: column; text-align: center; }
      .nat-thumb-strip { display: none; }
    }

    @media (max-width: 480px) {
      .nat-footer-top { grid-template-columns: 1fr; }
    }

    @media (prefers-reduced-motion: reduce) {
      .nat-fade { opacity: 1; transform: none; transition: none; }
      * { transition-duration: 0.01ms !important; animation-duration: 0.01ms !important; }
    }
  </style>
</head>
<body>

  <!-- ── NAVIGATION ── -->
  <nav class="nat-nav" role="navigation" aria-label="${t('aria_nav')}">
    <span class="nat-nav-brand">${brandName}</span>
    <ul class="nat-nav-links" role="list">
      <li><a href="#story">${t('nav_story')}</a></li>
      <li><a href="#materials">${t('nav_materials')}</a></li>
      <li><a href="#reviews">${t('nav_reviews')}</a></li>
    </ul>
    <a href="#final-cta" class="nat-nav-cta">${t('nav_cta')} ${ICO.arrow_r}</a>
  </nav>

  <!-- ── HERO SPLIT ── -->
  <section class="nat-hero" aria-label="${t('aria_hero')}">

    <!-- Image column -->
    <div class="nat-hero-img-col">
      <img
        id="nat-main-img"
        class="nat-hero-img"
        src="${imgs(0)}"
        alt="${brandName}"
        loading="eager"
      >
      ${renderHeroThumbs(_real.length > 0 ? _real : FALLBACK_IMGS, NATURAL_THEME, 'nat-main-img')}
      <!-- Thumbnail strip discret -->
      <div class="nat-thumb-strip">
        ${[0, 1, 2, 3].map((i) => `
        <button
          onclick="(function(){document.getElementById('nat-main-img').src='${imgs(i)}';document.querySelectorAll('.nat-th').forEach(function(t,j){t.style.outline=j===${i}?'2px solid ${N.charcoal}':'2px solid transparent';t.style.opacity=j===${i}?'1':'.5';});})();"
          class="nat-th"
          style="width:48px;height:48px;border-radius:2px;overflow:hidden;cursor:pointer;outline:2px solid ${i === 0 ? N.charcoal : 'transparent'};opacity:${i === 0 ? '1' : '.5'};transition:all .2s;background:${N.sandAlt};"
          aria-label="Image ${i + 1}"
        >
          <img src="${imgs(i)}" style="width:100%;height:100%;object-fit:cover;display:block;" alt="">
        </button>`).join('')}
      </div>
    </div>

    <!-- Info column -->
    <div class="nat-hero-info-col">
      <p class="nat-eyebrow">${t('hero_eyebrow')} — ${data.category || t('hero_nature')}</p>
      <h1 class="nat-hero-h1">${data.headline}</h1>
      <p class="nat-hero-sub">${data.subtitle}</p>

      ${(price || benefits.length > 0) ? `
      ${price ? `
      <div class="nat-price-row">
        <span class="nat-price">${price}€</span>
        ${origPrice ? `<span class="nat-price-orig">${origPrice}€</span>` : ''}
        ${savePct > 0 ? `<span class="nat-save-badge">-${savePct}%</span>` : ''}
      </div>` : ''}

      ${benefits.length > 0 ? `
      <ul class="nat-benefits">
        ${benefits.map(b => `
        <li class="nat-benefit-item">
          <span class="nat-benefit-check" aria-hidden="true">${ICO.check}</span>
          <span>${b}</span>
        </li>`).join('')}
      </ul>` : ''}
      ` : ''}

      <a href="#final-cta" class="nat-cta-primary">
        ${ctaText} ${ICO.arrow_r}
      </a>
      <a href="#story" class="nat-cta-secondary">
        ${t('nav_story')} ${ICO.arrow_r}
      </a>

      ${statCustomers ? `
      <div class="nat-hero-stat">
        <span class="nat-hero-stat-num">${statCustomers}</span>
        <span class="nat-hero-stat-label">${t('hero_stat_suffix')}</span>
      </div>` : data.social_proof?.rating ? `
      <div class="nat-hero-stat">
        <span class="nat-hero-stat-num">${data.social_proof.rating}</span>
        <span class="nat-hero-stat-label">/ 5 · Note moyenne</span>
      </div>` : ''}
    </div>

  </section>

  <!-- ── PRESS MENTIONS ÉDITORIAL ── -->
  ${pressMentions.length > 0 ? `
  <div class="nat-press nat-fade" aria-label="${t('press_eyebrow')}">
    <span class="nat-press-label">${t('press_eyebrow')}</span>
    <div class="nat-press-divider" aria-hidden="true"></div>
    <div class="nat-press-items">
      ${pressMentions.map(m => `<span class="nat-press-item">${m}</span>`).join('')}
    </div>
  </div>` : ''}

  <!-- ── STORY ÉDITORIALE ── -->
  <section class="nat-section-alt nat-fade" id="story" aria-labelledby="nat-story-h2">
    <div class="nat-container">
      <div class="nat-story-grid">
        <div class="nat-story-text">
          <p class="nat-section-eyebrow">${t('story_eyebrow')}</p>
          <h2 class="nat-section-h2" id="nat-story-h2">${storyTitle}</h2>
          ${storyProblem ? `<p class="nat-story-problem">${storyProblem}</p>` : ''}
          <p class="nat-story-body">${storyBody}</p>
        </div>
        <div class="nat-story-img" aria-hidden="true">
          <img src="${imgs(1)}" alt="" loading="lazy">
        </div>
      </div>
    </div>
  </section>

  <!-- ── MATERIALS / FEATURES ── -->
  <section class="nat-section nat-fade" id="materials" aria-labelledby="nat-mat-h2">
    <div class="nat-container">
      <p class="nat-section-eyebrow">${t('materials_eyebrow')}</p>
      <h2 class="nat-section-h2" id="nat-mat-h2">${t('materials_title')}</h2>
      <p class="nat-section-lead">${data.subtitle}</p>

      <div class="nat-feat-grid" role="list">
        ${featureCards.map((fc, i) => `
        <div class="nat-feat-card nat-fade nat-fade-delay-${i + 1}" role="listitem">
          <div class="nat-feat-icon" aria-hidden="true">${fc.icon}</div>
          <p class="nat-feat-num">0${i + 1}</p>
          <h3 class="nat-feat-title">${fc.title}</h3>
          <p class="nat-feat-desc">${fc.desc}</p>
        </div>`).join('')}
      </div>
    </div>
  </section>

  <!-- ── AVANT / APRÈS (seulement si data) ── -->
  ${hasBa ? `
  <section class="nat-section-alt nat-fade" aria-labelledby="nat-ba-h2">
    <div class="nat-container">
      <p class="nat-section-eyebrow">${t('ba_eyebrow')}</p>
      <h2 class="nat-section-h2" id="nat-ba-h2">${t('ba_title')}</h2>
      <div class="nat-ba-grid">
        <div class="nat-ba-item before">
          <img src="${imgs(2)}" alt="${t('before_label')}" loading="lazy">
          <span class="nat-ba-label">${t('before_label')}</span>
        </div>
        <div class="nat-ba-item">
          <img src="${imgs(0)}" alt="${t('after_label')}" loading="lazy">
          <span class="nat-ba-label" style="background:rgba(168,181,160,0.85);">${t('after_label')}</span>
        </div>
      </div>
    </div>
  </section>` : ''}

  <!-- ── TESTIMONIAL CENTRAL ── -->
  <section class="nat-section nat-fade" id="reviews" aria-labelledby="nat-reviews-eyebrow">
    <div class="nat-container-narrow">
      <div class="nat-testimonial">
        <p class="nat-section-eyebrow" id="nat-reviews-eyebrow">${t('testimonial_eyebrow')}</p>
        <div class="nat-quote-line" aria-hidden="true"></div>
        <span class="nat-quote-mark" aria-hidden="true">&ldquo;</span>
        <blockquote class="nat-quote-text" id="nat-quote-text">
          ${testimonialText}
        </blockquote>
        <div class="nat-quote-author">
          <span class="nat-quote-name">${testimonialName}</span>
          <span class="nat-quote-role">${testimonialRole}</span>
        </div>

        ${(data.testimonials?.length ?? 0) > 1 ? `
        <div class="nat-quote-nav" role="group" aria-label="Navigation avis">
          <button class="nat-quote-nav-btn" onclick="natPrevQuote()" aria-label="${t('aria_prev')}">
            ${ICO.arrow_l}
          </button>
          <div class="nat-quote-dots" aria-hidden="true">
            ${(data.testimonials ?? []).slice(0, 5).map((_, i) => `
            <div class="nat-quote-dot${i === 0 ? ' active' : ''}" data-index="${i}"></div>`).join('')}
          </div>
          <button class="nat-quote-nav-btn" onclick="natNextQuote()" aria-label="${t('aria_next')}">
            ${ICO.arrow_r}
          </button>
        </div>` : ''}
      </div>
    </div>
  </section>

  <!-- ── BEHIND THE DESIGN (mécanisme unique / fondateur) ── -->
  <section class="nat-section-alt nat-fade" aria-labelledby="nat-behind-h2">
    <div class="nat-container">
      <div class="nat-behind-grid">
        <div class="nat-behind-img" aria-hidden="true">
          <img src="${imgs(3)}" alt="" loading="lazy">
        </div>
        <div class="nat-behind-content">
          <p class="nat-section-eyebrow">${t('behind_eyebrow')}</p>
          <h2 class="nat-section-h2" id="nat-behind-h2">${t('behind_title')}</h2>
          <p class="nat-behind-body">${behindText}</p>
          ${behindAuthor ? `<p class="nat-behind-author">${behindAuthor}</p>` : ''}
        </div>
      </div>
    </div>
  </section>

  <!-- ── GALERIE 2×2 ── -->
  <section class="nat-section nat-fade" aria-label="${t('aria_gallery')}">
    <div class="nat-container">
      <p class="nat-section-eyebrow">${t('gallery_eyebrow')}</p>
      <div class="nat-gallery-grid" aria-label="${t('aria_gallery')}">
        ${[0, 1, 2, 3].map(i => `
        <div class="nat-gallery-item">
          <img src="${imgs(i)}" alt="${brandName}" loading="lazy">
        </div>`).join('')}
      </div>
    </div>
  </section>

  <!-- ── FAQ ── -->
  ${data.faq.length > 0 ? `
  <section class="nat-section-alt nat-fade" aria-labelledby="nat-faq-h2">
    <div class="nat-container-narrow">
      <p class="nat-section-eyebrow">${t('faq_eyebrow')}</p>
      <h2 class="nat-section-h2" id="nat-faq-h2">${t('faq_title')}</h2>
      <div class="nat-faq-list">
        ${faqHtml}
      </div>
    </div>
  </section>` : ''}

  <!-- ── SECTIONS DYNAMIQUES (chantier A) ── -->
  ${renderRichSections(data, NATURAL_THEME)}

  <!-- ── RISK REVERSAL STRIP ── -->
  <div class="nat-rr-strip" aria-hidden="true">
    <span class="nat-rr-item">
      <span class="nat-rr-icon">${ICO.truck}</span>
      ${t('rr_shipping')}
    </span>
    <span class="nat-rr-item">
      <span class="nat-rr-icon">${ICO.return_}</span>
      ${t('rr_returns')}
    </span>
    <span class="nat-rr-item">
      <span class="nat-rr-icon">${ICO.leaf}</span>
      ${t('rr_carbon')}
    </span>
  </div>

  <!-- ── FINAL CTA ── -->
  <section class="nat-final-cta nat-fade" id="final-cta" aria-labelledby="nat-final-h2">
    <p class="nat-section-eyebrow">${t('final_eyebrow')}</p>
    <h2 class="nat-final-h2" id="nat-final-h2">${data.headline}</h2>
    <p class="nat-final-sub">${data.subtitle}</p>
    ${price ? `<p class="nat-final-price">${price}€</p>` : ''}
    <a href="javascript:void(0)" onclick="event.preventDefault()" class="nat-btn-outlined">
      ${t('final_cta')} ${ICO.arrow_r}
    </a>
    <p class="nat-final-note">${t('final_sub')}</p>
  </section>

  <!-- ── FOOTER ── -->
  <footer class="nat-footer" id="footer" aria-label="${t('aria_footer')}">
    <div class="nat-footer-top">
      <div>
        <p class="nat-footer-brand-name">${brandName}</p>
        <p class="nat-footer-brand-desc">${footerDesc}</p>
      </div>
      <div>
        <p class="nat-footer-col-title">${t('footer_explore')}</p>
        <ul class="nat-footer-links" role="list">
          <li><a href="javascript:void(0)" onclick="event.preventDefault()">${t('footer_products')}</a></li>
          <li><a href="#reviews">${t('footer_reviews')}</a></li>
          <li><a href="#materials">${t('nav_materials')}</a></li>
          <li><a href="#story">${t('footer_faq')}</a></li>
        </ul>
      </div>
      <div>
        <p class="nat-footer-col-title">${t('footer_services')}</p>
        <ul class="nat-footer-links" role="list">
          <li><a href="javascript:void(0)" onclick="event.preventDefault()">${t('footer_delivery')}</a></li>
          <li><a href="javascript:void(0)" onclick="event.preventDefault()">${t('footer_returns')}</a></li>
          <li><a href="javascript:void(0)" onclick="event.preventDefault()">${t('footer_support')}</a></li>
        </ul>
      </div>
      <div>
        <p class="nat-footer-col-title">${t('footer_contact')}</p>
        <ul class="nat-footer-links" role="list">
          <li><a href="javascript:void(0)" onclick="event.preventDefault()">${t('footer_support')}</a></li>
          <li><a href="javascript:void(0)" onclick="event.preventDefault()">${t('nav_cta')}</a></li>
        </ul>
      </div>
    </div>
    <div class="nat-footer-bottom">
      <p class="nat-footer-copy">&copy; ${new Date().getFullYear()} ${brandName}. ${t('footer_copyright')}</p>
      <ul class="nat-footer-legal" role="list">
        <li><a href="javascript:void(0)" onclick="event.preventDefault()">${t('footer_privacy')}</a></li>
        <li><a href="javascript:void(0)" onclick="event.preventDefault()">${t('footer_terms')}</a></li>
      </ul>
    </div>
  </footer>

  <script>
    // ── SCROLL FADE-IN ─────────────────────────────────────────────────────────
    var natFadeEls = document.querySelectorAll('.nat-fade')
    var natIO = new IntersectionObserver(function(entries) {
      entries.forEach(function(e) {
        if (e.isIntersecting) {
          e.target.classList.add('visible')
          natIO.unobserve(e.target)
        }
      })
    }, { threshold: 0.08, rootMargin: '-32px' })
    natFadeEls.forEach(function(el) { natIO.observe(el) })

    // ── QUOTE ROTATOR ─────────────────────────────────────────────────────────
    var NAT_QUOTES = ${JSON.stringify(
      data.testimonials && data.testimonials.length > 0
        ? data.testimonials.slice(0, 5).map(t_ => t_.text)
        : [testimonialText]
    )}
    var NAT_AUTHORS = ${JSON.stringify(
      data.testimonials && data.testimonials.length > 0
        ? data.testimonials.slice(0, 5).map(t_ => ({ name: t_.name, role: t_.location ?? '' }))
        : [{ name: testimonialName, role: testimonialRole }]
    )}
    var natCurQuote = 0

    function natUpdateQuote(idx) {
      var el  = document.getElementById('nat-quote-text')
      var dots = document.querySelectorAll('.nat-quote-dot')
      if (!el) return
      el.style.opacity = '0'
      el.style.transform = 'translateY(8px)'
      setTimeout(function() {
        el.textContent = NAT_QUOTES[idx]
        el.style.opacity = '1'
        el.style.transform = 'translateY(0)'
      }, 220)
      dots.forEach(function(d, i) { d.classList.toggle('active', i === idx) })
    }
    function natNextQuote() {
      natCurQuote = (natCurQuote + 1) % NAT_QUOTES.length
      natUpdateQuote(natCurQuote)
    }
    function natPrevQuote() {
      natCurQuote = (natCurQuote - 1 + NAT_QUOTES.length) % NAT_QUOTES.length
      natUpdateQuote(natCurQuote)
    }
    var natQuoteEl = document.getElementById('nat-quote-text')
    if (natQuoteEl) {
      natQuoteEl.style.transition = 'opacity 0.22s ease, transform 0.22s ease'
    }
  </script>

</body>
</html>`
}
