// Dictionnaire centralisé des libellés d'habillage (chrome UI) des pages
// générées — boutons, eyebrows, titres de section, textes de fallback.
//
// Contexte : le contenu produit (copy) est déjà généré par DeepSeek dans la
// langue choisie par l'utilisateur (wizard /dashboard/new, step 7). Mais tous
// les libellés "décoratifs" (CTA, nav, FAQ par défaut, trust badges…) étaient
// codés en dur en français dans les renderers V3 et les templates legacy —
// résultat : la coque de la page restait FR quelle que soit la langue choisie.
//
// Ce fichier centralise ces libellés pour les 9 langues supportées
// (cf. src/lib/i18n/languages.ts) avec fallback fr si une clé/langue manque.
//
// Usage : t(lang, 'cta.addToCart') ou t(lang, 'hero.reviewsSuffix', { n: 42 })

import { ALLOWED_LANGS } from './languages'

export type UiLang = 'fr' | 'en' | 'es' | 'de' | 'it' | 'pt' | 'nl' | 'ar' | 'zh'

type LabelDict = Partial<Record<UiLang, string>>

type LabelParams = Record<string, string | number>

// ─── Dictionnaire ───────────────────────────────────────────────────────────
// Organisé par domaine (v3 sections, shared components, legacy sections).
// Certaines clés sont volontairement réutilisées entre V3 et legacy quand le
// texte source est identique (ex: "Avis clients", "Achat vérifié").

export const UI_LABELS: Record<string, LabelDict> = {
  // ── CTA génériques ──────────────────────────────────────
  'cta.addToCart': {
    fr: 'Ajouter au panier', en: 'Add to cart', es: 'Añadir al carrito',
    de: 'In den Warenkorb', it: 'Aggiungi al carrello', pt: 'Adicionar ao carrinho',
    nl: 'In winkelwagen', ar: 'أضف إلى السلة', zh: '加入购物车',
  },
  'cta.viewOffer': {
    fr: "Voir l'offre", en: 'View offer', es: 'Ver oferta',
    de: 'Angebot ansehen', it: "Vedi l'offerta", pt: 'Ver oferta',
    nl: 'Bekijk aanbieding', ar: 'عرض العرض', zh: '查看优惠',
  },
  'cta.orderNow': {
    fr: 'Commander maintenant', en: 'Order now', es: 'Pedir ahora',
    de: 'Jetzt bestellen', it: 'Ordina ora', pt: 'Encomendar agora',
    nl: 'Nu bestellen', ar: 'اطلب الآن', zh: '立即订购',
  },

  // ── Nav sticky (V3) ──────────────────────────────────────
  'nav.skipToContent': {
    fr: 'Aller au contenu', en: 'Skip to content', es: 'Ir al contenido',
    de: 'Zum Inhalt springen', it: 'Vai al contenuto', pt: 'Ir para o conteúdo',
    nl: 'Naar inhoud', ar: 'الانتقال إلى المحتوى', zh: '跳至内容',
  },
  'nav.ariaLabel': {
    fr: 'Navigation principale', en: 'Main navigation', es: 'Navegación principal',
    de: 'Hauptnavigation', it: 'Navigazione principale', pt: 'Navegação principal',
    nl: 'Hoofdnavigatie', ar: 'التنقل الرئيسي', zh: '主导航',
  },
  'nav.viewOfferAria': {
    fr: "Voir l'offre — aller au bouton principal", en: 'View offer — go to main button',
    es: 'Ver oferta — ir al botón principal', de: 'Angebot ansehen — zum Hauptbutton springen',
    it: "Vedi l'offerta — vai al pulsante principale", pt: 'Ver oferta — ir para o botão principal',
    nl: 'Bekijk aanbieding — ga naar hoofdknop', ar: 'عرض العرض — الانتقال إلى الزر الرئيسي',
    zh: '查看优惠 — 前往主按钮',
  },
  'nav.viewShort': {
    fr: 'Voir', en: 'View', es: 'Ver', de: 'Ansehen', it: 'Vedi',
    pt: 'Ver', nl: 'Bekijk', ar: 'عرض', zh: '查看',
  },

  // ── Hero (V3) ────────────────────────────────────────────
  'hero.reviewsSuffix': {
    fr: '{n} avis', en: '{n} reviews', es: '{n} opiniones', de: '{n} Bewertungen',
    it: '{n} recensioni', pt: '{n} avaliações', nl: '{n} beoordelingen',
    ar: '{n} تقييم', zh: '{n} 条评论',
  },
  'hero.socialProofFallback': {
    fr: '★★★★★ Plus de 10 000 clients satisfaits',
    en: '★★★★★ Over 10,000 happy customers',
    es: '★★★★★ Más de 10.000 clientes satisfechos',
    de: '★★★★★ Über 10.000 zufriedene Kunden',
    it: '★★★★★ Oltre 10.000 clienti soddisfatti',
    pt: '★★★★★ Mais de 10.000 clientes satisfeitos',
    nl: '★★★★★ Meer dan 10.000 tevreden klanten',
    ar: '★★★★★ أكثر من 10,000 عميل راضٍ',
    zh: '★★★★★ 超过 10,000 位满意客户',
  },
  'hero.guarantee30': {
    fr: 'Garantie 30 jours', en: '30-day guarantee', es: 'Garantía de 30 días',
    de: '30 Tage Garantie', it: 'Garanzia di 30 giorni', pt: 'Garantia de 30 dias',
    nl: '30 dagen garantie', ar: 'ضمان 30 يومًا', zh: '30天保证',
  },
  'hero.fastShipping': {
    fr: 'Livraison rapide', en: 'Fast shipping', es: 'Envío rápido',
    de: 'Schneller Versand', it: 'Spedizione rapida', pt: 'Envio rápido',
    nl: 'Snelle levering', ar: 'شحن سريع', zh: '快速配送',
  },
  'hero.securePayment': {
    fr: 'Paiement sécurisé', en: 'Secure payment', es: 'Pago seguro',
    de: 'Sichere Zahlung', it: 'Pagamento sicuro', pt: 'Pagamento seguro',
    nl: 'Veilig betalen', ar: 'دفع آمن', zh: '安全支付',
  },
  'image.viewAlt': {
    fr: 'vue {n}', en: 'view {n}', es: 'vista {n}', de: 'Ansicht {n}',
    it: 'vista {n}', pt: 'vista {n}', nl: 'weergave {n}', ar: 'منظر {n}', zh: '视图 {n}',
  },

  // ── Gallery (V3) ──────────────────────────────────────
  'galleryV3.title': {
    fr: 'Tous les angles', en: 'All angles', es: 'Todos los ángulos',
    de: 'Alle Ansichten', it: 'Tutte le angolazioni', pt: 'Todos os ângulos',
    nl: 'Alle hoeken', ar: 'جميع الزوايا', zh: '全方位视角',
  },

  // ── Why we love (V3) ──────────────────────────────────
  'whyWeLove.eyebrow': {
    fr: 'Pourquoi on aime ça', en: 'Why we love it', es: 'Por qué nos encanta',
    de: 'Warum wir es lieben', it: 'Perché lo adoriamo', pt: 'Por que adoramos',
    nl: 'Waarom we het geweldig vinden', ar: 'لماذا نحبه', zh: '我们为何喜爱',
  },

  // ── Thoughtfully designed (V3) ──────────────────────────
  'thoughtfullyDesigned.title': {
    fr: 'Conçu avec soin', en: 'Thoughtfully designed', es: 'Diseñado con esmero',
    de: 'Mit Sorgfalt gestaltet', it: 'Progettato con cura', pt: 'Concebido com cuidado',
    nl: 'Zorgvuldig ontworpen', ar: 'مصمم بعناية', zh: '精心设计',
  },

  // ── Best for (V3) ──────────────────────────────────────
  'bestFor.eyebrow': {
    fr: 'Idéal pour', en: 'Perfect for', es: 'Ideal para', de: 'Ideal für',
    it: 'Ideale per', pt: 'Ideal para', nl: 'Ideaal voor', ar: 'مثالي لـ', zh: '适合',
  },
  'bestFor.empty': {
    fr: 'Informations non disponibles pour ce produit.',
    en: 'Information not available for this product.',
    es: 'Información no disponible para este producto.',
    de: 'Keine Informationen für dieses Produkt verfügbar.',
    it: 'Informazioni non disponibili per questo prodotto.',
    pt: 'Informações não disponíveis para este produto.',
    nl: 'Geen informatie beschikbaar voor dit product.',
    ar: 'المعلومات غير متوفرة لهذا المنتج.',
    zh: '该产品暂无相关信息。',
  },

  // ── Materials breakdown (V3) ──────────────────────────
  'materials.eyebrow': {
    fr: 'Matériau', en: 'Material', es: 'Material', de: 'Material',
    it: 'Materiale', pt: 'Material', nl: 'Materiaal', ar: 'الخامة', zh: '材质',
  },
  'materials.title': {
    fr: 'Les matériaux', en: 'The materials', es: 'Los materiales', de: 'Die Materialien',
    it: 'I materiali', pt: 'Os materiais', nl: 'De materialen', ar: 'الخامات', zh: '材质介绍',
  },

  // ── How it works (V3) ────────────────────────────────
  'howItWorksV3.title': {
    fr: "Comment l'utiliser", en: 'How to use it', es: 'Cómo usarlo',
    de: 'So wird es verwendet', it: 'Come si usa', pt: 'Como usar',
    nl: 'Hoe te gebruiken', ar: 'كيفية الاستخدام', zh: '使用方法',
  },

  // ── Compare variants (V3) ───────────────────────────
  'compareVariants.recommended': {
    fr: 'Recommandé', en: 'Recommended', es: 'Recomendado', de: 'Empfohlen',
    it: 'Consigliato', pt: 'Recomendado', nl: 'Aanbevolen', ar: 'موصى به', zh: '推荐',
  },
  'compareVariants.title': {
    fr: 'Toutes les variantes', en: 'All variants', es: 'Todas las variantes',
    de: 'Alle Varianten', it: 'Tutte le varianti', pt: 'Todas as variantes',
    nl: 'Alle varianten', ar: 'جميع الخيارات', zh: '所有款式',
  },

  // ── Reviews AI summary (V3) ──────────────────────────
  'reviews.verifiedCount': {
    fr: '{n} avis vérifiés', en: '{n} verified reviews', es: '{n} opiniones verificadas',
    de: '{n} verifizierte Bewertungen', it: '{n} recensioni verificate',
    pt: '{n} avaliações verificadas', nl: '{n} geverifieerde beoordelingen',
    ar: '{n} تقييم موثّق', zh: '{n} 条已验证评论',
  },
  'reviewsAiSummary.generatedFrom': {
    fr: '— Résumé généré à partir des avis clients',
    en: '— Summary generated from customer reviews',
    es: '— Resumen generado a partir de las opiniones de clientes',
    de: '— Zusammenfassung basierend auf Kundenbewertungen',
    it: '— Riepilogo generato dalle recensioni dei clienti',
    pt: '— Resumo gerado a partir das avaliações dos clientes',
    nl: '— Samenvatting op basis van klantbeoordelingen',
    ar: '— ملخص تم إنشاؤه من تقييمات العملاء',
    zh: '— 根据客户评论生成的摘要',
  },

  // ── Reviews grid (V3 + réutilisé legacy testimonials) ──────────────
  'reviews.verifiedPurchase': {
    fr: 'Achat vérifié', en: 'Verified purchase', es: 'Compra verificada',
    de: 'Verifizierter Kauf', it: 'Acquisto verificato', pt: 'Compra verificada',
    nl: 'Geverifieerde aankoop', ar: 'عملية شراء موثّقة', zh: '已验证购买',
  },
  'reviews.eyebrow': {
    fr: 'Avis clients', en: 'Customer reviews', es: 'Opiniones de clientes',
    de: 'Kundenbewertungen', it: 'Recensioni dei clienti', pt: 'Avaliações de clientes',
    nl: 'Klantbeoordelingen', ar: 'تقييمات العملاء', zh: '客户评价',
  },
  'reviewsV3.title': {
    fr: "Ce qu'ils en disent.", en: "What they're saying.", es: 'Lo que opinan.',
    de: 'Was sie sagen.', it: 'Cosa ne pensano.', pt: 'O que eles dizem.',
    nl: 'Wat ze ervan vinden.', ar: 'ماذا يقولون.', zh: '他们怎么说。',
  },
  'reviews.filterAll': {
    fr: 'Tous', en: 'All', es: 'Todos', de: 'Alle', it: 'Tutti',
    pt: 'Todos', nl: 'Alles', ar: 'الكل', zh: '全部',
  },
  'reviews.filterWithPhotos': {
    fr: 'Avec photos', en: 'With photos', es: 'Con fotos', de: 'Mit Fotos',
    it: 'Con foto', pt: 'Com fotos', nl: "Met foto's", ar: 'مع صور', zh: '带图片',
  },
  'reviews.filter5Star': {
    fr: '5 étoiles', en: '5 stars', es: '5 estrellas', de: '5 Sterne',
    it: '5 stelle', pt: '5 estrelas', nl: '5 sterren', ar: '5 نجوم', zh: '5星',
  },
  'reviews.filterVerified': {
    fr: 'Vérifiés', en: 'Verified', es: 'Verificados', de: 'Verifiziert',
    it: 'Verificati', pt: 'Verificados', nl: 'Geverifieerd', ar: 'موثّق', zh: '已验证',
  },

  // ── Trust stats / press quote fallback (V3) ────────────────────
  'trust.satisfiedCustomers': {
    fr: '+10 000 clients satisfaits', en: '+10,000 happy customers',
    es: '+10.000 clientes satisfechos', de: '+10.000 zufriedene Kunden',
    it: '+10.000 clienti soddisfatti', pt: '+10.000 clientes satisfeitos',
    nl: '+10.000 tevreden klanten', ar: '+10,000 عميل راضٍ', zh: '超过 10,000 满意客户',
  },
  'trust.averageRating': {
    fr: 'Note moyenne 4,8★', en: 'Average rating 4.8★', es: 'Valoración media 4,8★',
    de: 'Durchschnittsbewertung 4,8★', it: 'Valutazione media 4,8★',
    pt: 'Avaliação média 4,8★', nl: 'Gemiddelde score 4,8★',
    ar: 'متوسط التقييم 4.8★', zh: '平均评分 4.8★',
  },
  'trust.fastShipping48h': {
    fr: 'Livraison rapide 48h', en: 'Fast shipping in 48h', es: 'Envío rápido en 48h',
    de: 'Schneller Versand in 48h', it: 'Spedizione rapida in 48h', pt: 'Envio rápido em 48h',
    nl: 'Snelle levering binnen 48u', ar: 'شحن سريع خلال 48 ساعة', zh: '48小时快速配送',
  },

  // ── Care instructions (V3) ────────────────────────────────
  'care.title': {
    fr: 'Entretien', en: 'Care', es: 'Cuidado', de: 'Pflege', it: 'Cura',
    pt: 'Cuidados', nl: 'Onderhoud', ar: 'العناية', zh: '保养说明',
  },
  'care.defaultText': {
    fr: 'Pour conserver toute sa qualité, suis simplement les indications fournies avec le produit.',
    en: 'To keep it in top condition, simply follow the instructions provided with the product.',
    es: 'Para conservar toda su calidad, sigue simplemente las indicaciones incluidas con el producto.',
    de: 'Um die Qualität zu erhalten, befolge einfach die dem Produkt beiliegenden Hinweise.',
    it: "Per mantenerne intatta la qualità, segui semplicemente le indicazioni fornite con il prodotto.",
    pt: 'Para preservar toda a sua qualidade, basta seguir as instruções fornecidas com o produto.',
    nl: 'Volg gewoon de bijgevoegde instructies om de kwaliteit te behouden.',
    ar: 'للحفاظ على جودته، اتبع ببساطة التعليمات المرفقة مع المنتج.',
    zh: '为保持产品品质，请遵循产品随附的说明。',
  },
  'care.shippingTitle': {
    fr: 'Livraison', en: 'Shipping', es: 'Envío', de: 'Versand', it: 'Spedizione',
    pt: 'Envio', nl: 'Verzending', ar: 'الشحن', zh: '配送',
  },
  'care.shippingText': {
    fr: 'Livraison gratuite à partir de 75€. Expédition sous 24-48h.',
    en: 'Free shipping from €75. Dispatched within 24-48h.',
    es: 'Envío gratis a partir de 75€. Envío en 24-48h.',
    de: 'Kostenloser Versand ab 75€. Versand innerhalb von 24-48 Std.',
    it: 'Spedizione gratuita a partire da 75€. Spedizione entro 24-48h.',
    pt: 'Envio grátis a partir de 75€. Expedido em 24-48h.',
    nl: 'Gratis verzending vanaf €75. Verzending binnen 24-48u.',
    ar: 'شحن مجاني ابتداءً من 75€. الشحن خلال 24-48 ساعة.',
    zh: '满75欧元免运费。24-48小时内发货。',
  },
  'care.returnsTitle': {
    fr: 'Retours', en: 'Returns', es: 'Devoluciones', de: 'Rückgabe', it: 'Resi',
    pt: 'Devoluções', nl: 'Retourneren', ar: 'الإرجاع', zh: '退货',
  },
  'care.returnsText': {
    fr: "30 jours pour changer d'avis. Retour gratuit, remboursement sous 5 jours.",
    en: '30 days to change your mind. Free returns, refunded within 5 days.',
    es: '30 días para cambiar de opinión. Devolución gratuita, reembolso en 5 días.',
    de: '30 Tage Bedenkzeit. Kostenlose Rückgabe, Rückerstattung innerhalb von 5 Tagen.',
    it: 'Reso gratuito, rimborso entro 5 giorni. 30 giorni per cambiare idea.',
    pt: '30 dias para mudar de ideias. Devolução grátis, reembolso em 5 dias.',
    nl: 'Gratis retourneren, terugbetaling binnen 5 dagen. 30 dagen bedenktijd.',
    ar: '30 يومًا لتغيير رأيك. إرجاع مجاني، استرداد الأموال خلال 5 أيام.',
    zh: '30天犹豫期。免费退货，5天内退款。',
  },

  // ── FAQ (V3) ───────────────────────────────────────────
  'faqV3.title': {
    fr: 'Questions fréquentes', en: 'Frequently asked questions', es: 'Preguntas frecuentes',
    de: 'Häufig gestellte Fragen', it: 'Domande frequenti', pt: 'Perguntas frequentes',
    nl: 'Veelgestelde vragen', ar: 'الأسئلة الشائعة', zh: '常见问题',
  },
  'faq.defaultQ1': {
    fr: 'Combien de temps pour la livraison ?', en: 'How long does shipping take?',
    es: '¿Cuánto tarda el envío?', de: 'Wie lange dauert der Versand?',
    it: 'Quanto tempo richiede la consegna?', pt: 'Quanto tempo demora a entrega?',
    nl: 'Hoe lang duurt de levering?', ar: 'كم من الوقت يستغرق الشحن؟', zh: '配送需要多长时间？',
  },
  'faq.defaultA1': {
    // fr conservé à l'identique (non-régression) — les autres langues neutralisent
    // la référence "en France" (produits expédiés à l'international).
    fr: '24 à 48h ouvrées en France.', en: '24 to 48 business hours.',
    es: 'De 24 a 48 horas laborables.', de: '24 bis 48 Werkstunden.',
    it: 'Da 24 a 48 ore lavorative.', pt: '24 a 48 horas úteis.',
    nl: '24 tot 48 werkuren.', ar: 'من 24 إلى 48 ساعة عمل.', zh: '24至48个工作小时。',
  },
  'faq.defaultQ2': {
    fr: 'Puis-je retourner le produit ?', en: 'Can I return the product?',
    es: '¿Puedo devolver el producto?', de: 'Kann ich das Produkt zurückgeben?',
    it: 'Posso restituire il prodotto?', pt: 'Posso devolver o produto?',
    nl: 'Kan ik het product retourneren?', ar: 'هل يمكنني إرجاع المنتج؟', zh: '我可以退货吗？',
  },
  'faq.defaultA2': {
    fr: 'Oui, sous 30 jours, retour gratuit.', en: 'Yes, within 30 days, free returns.',
    es: 'Sí, en un plazo de 30 días, devolución gratuita.', de: 'Ja, innerhalb von 30 Tagen, kostenlose Rückgabe.',
    it: 'Sì, entro 30 giorni, reso gratuito.', pt: 'Sim, dentro de 30 dias, devolução grátis.',
    nl: 'Ja, binnen 30 dagen, gratis retourneren.', ar: 'نعم، خلال 30 يومًا، إرجاع مجاني.', zh: '可以，30天内免费退货。',
  },

  // ── Brand manifesto (V3) ──────────────────────────────
  'manifesto.defaultHeadline': {
    fr: 'Conçu pour durer', en: 'Built to last', es: 'Diseñado para durar',
    de: 'Für die Ewigkeit gemacht', it: 'Progettato per durare', pt: 'Feito para durar',
    nl: 'Gemaakt om te blijven', ar: 'مصمم ليدوم', zh: '经久耐用设计',
  },
  'manifesto.defaultPillar1': {
    fr: 'Qualité', en: 'Quality', es: 'Calidad', de: 'Qualität', it: 'Qualità',
    pt: 'Qualidade', nl: 'Kwaliteit', ar: 'الجودة', zh: '品质',
  },
  'manifesto.defaultPillar2': {
    fr: 'Éthique', en: 'Ethics', es: 'Ética', de: 'Ethik', it: 'Etica',
    pt: 'Ética', nl: 'Ethiek', ar: 'الأخلاقيات', zh: '道德',
  },
  'manifesto.defaultPillar3': {
    fr: 'Transparence', en: 'Transparency', es: 'Transparencia', de: 'Transparenz',
    it: 'Trasparenza', pt: 'Transparência', nl: 'Transparantie', ar: 'الشفافية', zh: '透明度',
  },
  'manifesto.cta': {
    fr: "Découvrir l'histoire", en: 'Discover the story', es: 'Descubre la historia',
    de: 'Die Geschichte entdecken', it: 'Scopri la storia', pt: 'Descobrir a história',
    nl: 'Ontdek het verhaal', ar: 'اكتشف القصة', zh: '了解我们的故事',
  },

  // ── Sticky add-to-cart mobile (shared V3 + legacy) ─────────────
  'sticky.ariaLabel': {
    fr: 'Ajouter au panier — barre rapide', en: 'Add to cart — quick bar',
    es: 'Añadir al carrito — barra rápida', de: 'In den Warenkorb — Schnellleiste',
    it: 'Aggiungi al carrello — barra rapida', pt: 'Adicionar ao carrinho — barra rápida',
    nl: 'In winkelwagen — snelle balk', ar: 'أضف إلى السلة — شريط سريع', zh: '加入购物车 — 快速栏',
  },
  'sticky.stockLow': {
    fr: 'Stock limité', en: 'Limited stock', es: 'Stock limitado', de: 'Begrenzter Bestand',
    it: 'Scorte limitate', pt: 'Stock limitado', nl: 'Beperkte voorraad',
    ar: 'مخزون محدود', zh: '库存有限',
  },
  'sticky.stockCritical': {
    fr: 'Stock presque épuisé', en: 'Almost sold out', es: 'Casi agotado',
    de: 'Fast ausverkauft', it: 'Quasi esaurito', pt: 'Quase esgotado',
    nl: 'Bijna uitverkocht', ar: 'على وشك النفاد', zh: '即将售罄',
  },
  'sticky.stockLowCount': {
    fr: 'Plus que {n} unité(s) en stock', en: 'Only {n} left in stock',
    es: 'Solo quedan {n} unidades', de: 'Nur noch {n} Stück auf Lager',
    it: 'Solo {n} pezzi disponibili', pt: 'Restam apenas {n} unidades',
    nl: 'Nog maar {n} op voorraad', ar: 'لم يتبق سوى {n} في المخزون', zh: '仅剩 {n} 件库存',
  },
  'sticky.stockCriticalCount': {
    fr: '🔴 Seulement {n} unité(s) restante(s)', en: '🔴 Only {n} left',
    es: '🔴 Solo quedan {n}', de: '🔴 Nur noch {n} übrig',
    it: '🔴 Solo {n} rimasti', pt: '🔴 Restam apenas {n}',
    nl: '🔴 Nog maar {n} over', ar: '🔴 لم يتبق سوى {n}', zh: '🔴 仅剩 {n} 件',
  },
  'sticky.flashSaleDefault': {
    fr: 'Offre flash expire dans', en: 'Flash sale ends in', es: 'La oferta flash termina en',
    de: 'Blitzangebot endet in', it: "L'offerta flash termina tra", pt: 'Oferta relâmpago termina em',
    nl: 'Flitsdeal eindigt over', ar: 'العرض السريع ينتهي خلال', zh: '限时优惠倒计时',
  },

  // ── Trust badges payment (shared V3 + legacy) ──────────────
  'trustBadges.ariaLabel': {
    fr: 'Moyens de paiement acceptés', en: 'Accepted payment methods',
    es: 'Métodos de pago aceptados', de: 'Akzeptierte Zahlungsmethoden',
    it: 'Metodi di pagamento accettati', pt: 'Métodos de pagamento aceites',
    nl: 'Geaccepteerde betaalmethoden', ar: 'طرق الدفع المقبولة', zh: '接受的付款方式',
  },
  'trustBadges.securePayment100': {
    fr: 'Paiement 100% sécurisé', en: '100% secure payment', es: 'Pago 100% seguro',
    de: '100% sichere Zahlung', it: 'Pagamento sicuro al 100%', pt: 'Pagamento 100% seguro',
    nl: '100% veilig betalen', ar: 'دفع آمن 100%', zh: '100% 安全支付',
  },

  // ── Quantity selector (shared V3 + legacy) ─────────────────
  'qty.srLabel': {
    fr: 'Quantité', en: 'Quantity', es: 'Cantidad', de: 'Menge', it: 'Quantità',
    pt: 'Quantidade', nl: 'Aantal', ar: 'الكمية', zh: '数量',
  },
  'qty.groupAriaLabel': {
    fr: 'Sélecteur de quantité', en: 'Quantity selector', es: 'Selector de cantidad',
    de: 'Mengenauswahl', it: 'Selettore di quantità', pt: 'Seletor de quantidade',
    nl: 'Aantalselector', ar: 'محدد الكمية', zh: '数量选择器',
  },
  'qty.decrease': {
    fr: 'Diminuer la quantité', en: 'Decrease quantity', es: 'Disminuir cantidad',
    de: 'Menge verringern', it: 'Diminuisci quantità', pt: 'Diminuir quantidade',
    nl: 'Aantal verminderen', ar: 'تقليل الكمية', zh: '减少数量',
  },
  'qty.increase': {
    fr: 'Augmenter la quantité', en: 'Increase quantity', es: 'Aumentar cantidad',
    de: 'Menge erhöhen', it: 'Aumenta quantità', pt: 'Aumentar quantidade',
    nl: 'Aantal verhogen', ar: 'زيادة الكمية', zh: '增加数量',
  },

  // ── Legacy sections.ts (renderRichSections — partagé par les 43 templates) ─
  'legacy.socialProof.customers': {
    fr: 'Clients satisfaits', en: 'Happy customers', es: 'Clientes satisfechos',
    de: 'Zufriedene Kunden', it: 'Clienti soddisfatti', pt: 'Clientes satisfeitos',
    nl: 'Tevreden klanten', ar: 'عملاء راضون', zh: '满意客户',
  },
  'legacy.socialProof.rating': {
    fr: 'Note moyenne', en: 'Average rating', es: 'Valoración media', de: 'Durchschnittsbewertung',
    it: 'Valutazione media', pt: 'Avaliação média', nl: 'Gemiddelde score',
    ar: 'متوسط التقييم', zh: '平均评分',
  },
  'legacy.socialProof.sold': {
    fr: 'Vendus ce mois', en: 'Sold this month', es: 'Vendidos este mes',
    de: 'Verkauft diesen Monat', it: 'Venduti questo mese', pt: 'Vendidos este mês',
    nl: 'Verkocht deze maand', ar: 'تم بيعه هذا الشهر', zh: '本月销量',
  },
  'legacy.story.problem': {
    fr: 'Le problème', en: 'The problem', es: 'El problema', de: 'Das Problem',
    it: 'Il problema', pt: 'O problema', nl: 'Het probleem', ar: 'المشكلة', zh: '问题',
  },
  'legacy.story.cost': {
    fr: 'Ce que ça coûte', en: 'What it costs you', es: 'Lo que te cuesta',
    de: 'Was es dich kostet', it: 'Cosa ti costa', pt: 'O que isso custa',
    nl: 'Wat het kost', ar: 'ما يكلفك ذلك', zh: '代价',
  },
  'legacy.story.solution': {
    fr: 'Notre solution', en: 'Our solution', es: 'Nuestra solución', de: 'Unsere Lösung',
    it: 'La nostra soluzione', pt: 'A nossa solução', nl: 'Onze oplossing',
    ar: 'حلنا', zh: '我们的解决方案',
  },
  'legacy.story.result': {
    fr: 'Le résultat', en: 'The result', es: 'El resultado', de: 'Das Ergebnis',
    it: 'Il risultato', pt: 'O resultado', nl: 'Het resultaat', ar: 'النتيجة', zh: '结果',
  },
  'legacy.story.eyebrow': {
    fr: "L'histoire", en: 'The story', es: 'La historia', de: 'Die Geschichte',
    it: 'La storia', pt: 'A história', nl: 'Het verhaal', ar: 'القصة', zh: '故事',
  },
  'legacy.story.titleWithProduct': {
    fr: 'Pourquoi nous avons créé {name}', en: 'Why we created {name}',
    es: 'Por qué creamos {name}', de: 'Warum wir {name} entwickelt haben',
    it: 'Perché abbiamo creato {name}', pt: 'Porque criámos {name}',
    nl: 'Waarom we {name} hebben gemaakt', ar: 'لماذا أنشأنا {name}', zh: '我们为何创造了{name}',
  },
  'legacy.story.titleDefault': {
    fr: "L'histoire derrière le produit", en: 'The story behind the product',
    es: 'La historia detrás del producto', de: 'Die Geschichte hinter dem Produkt',
    it: 'La storia dietro il prodotto', pt: 'A história por trás do produto',
    nl: 'Het verhaal achter het product', ar: 'القصة وراء المنتج', zh: '产品背后的故事',
  },
  'legacy.testimonials.defaultName': {
    fr: 'Client vérifié', en: 'Verified customer', es: 'Cliente verificado',
    de: 'Verifizierter Kunde', it: 'Cliente verificato', pt: 'Cliente verificado',
    nl: 'Geverifieerde klant', ar: 'عميل موثّق', zh: '已验证客户',
  },
  'legacy.testimonials.title': {
    fr: 'Ils ont fait le choix.', en: 'They made the choice.', es: 'Ellos ya eligieron.',
    de: 'Sie haben sich entschieden.', it: 'Loro hanno scelto.', pt: 'Eles fizeram a escolha.',
    nl: 'Zij kozen ervoor.', ar: 'لقد اختاروا.', zh: '他们已经选择。',
  },
  'legacy.comparison.eyebrow': {
    fr: 'La différence', en: 'The difference', es: 'La diferencia', de: 'Der Unterschied',
    it: 'La differenza', pt: 'A diferença', nl: 'Het verschil', ar: 'الفرق', zh: '差异所在',
  },
  'legacy.comparison.titleWithProduct': {
    fr: '{name} change la donne', en: '{name} changes everything',
    es: '{name} lo cambia todo', de: '{name} verändert alles',
    it: '{name} cambia le regole del gioco', pt: '{name} muda tudo',
    nl: '{name} verandert alles', ar: '{name} يغيّر كل شيء', zh: '{name} 改变一切',
  },
  'legacy.comparison.titleDefault': {
    fr: 'Avec ou sans ?', en: 'With or without?', es: '¿Con o sin?', de: 'Mit oder ohne?',
    it: 'Con o senza?', pt: 'Com ou sem?', nl: 'Met of zonder?', ar: 'مع أو بدون؟', zh: '有还是没有？',
  },
  'legacy.comparison.without': {
    fr: 'Sans', en: 'Without', es: 'Sin', de: 'Ohne', it: 'Senza',
    pt: 'Sem', nl: 'Zonder', ar: 'بدون', zh: '没有',
  },
  'legacy.comparison.with': {
    fr: 'Avec', en: 'With', es: 'Con', de: 'Mit', it: 'Con',
    pt: 'Com', nl: 'Met', ar: 'مع', zh: '有',
  },
  'legacy.bonuses.defaultTitle': {
    fr: 'Bonus', en: 'Bonus', es: 'Bono', de: 'Bonus', it: 'Bonus',
    pt: 'Bônus', nl: 'Bonus', ar: 'مكافأة', zh: '赠品',
  },
  'legacy.bonuses.offered': {
    fr: 'OFFERT', en: 'FREE', es: 'GRATIS', de: 'GESCHENKT', it: 'IN OMAGGIO',
    pt: 'OFERTA', nl: 'GRATIS', ar: 'مجاني', zh: '免费赠送',
  },
  'legacy.bonuses.eyebrow': {
    fr: 'Bonus exclusifs', en: 'Exclusive bonuses', es: 'Bonos exclusivos',
    de: 'Exklusive Boni', it: 'Bonus esclusivi', pt: 'Bónus exclusivos',
    nl: 'Exclusieve bonussen', ar: 'مكافآت حصرية', zh: '专属赠品',
  },
  'legacy.bonuses.title': {
    fr: 'Inclus dans votre commande', en: 'Included with your order',
    es: 'Incluido en tu pedido', de: 'In Ihrer Bestellung enthalten',
    it: 'Incluso nel tuo ordine', pt: 'Incluído na sua encomenda',
    nl: 'Inbegrepen bij je bestelling', ar: 'مشمول في طلبك', zh: '订单包含',
  },
  'legacy.bonuses.subtitle': {
    fr: "Valeur additionnelle offerte — disponible uniquement aujourd'hui.",
    en: 'Extra value included — available today only.',
    es: 'Valor adicional incluido, disponible solo hoy.',
    de: 'Zusätzlicher Wert inklusive — nur heute verfügbar.',
    it: 'Valore aggiuntivo incluso, disponibile solo oggi.',
    pt: 'Valor adicional incluído — disponível apenas hoje.',
    nl: 'Extra waarde inbegrepen — alleen vandaag beschikbaar.',
    ar: 'قيمة إضافية مجانية — متاحة اليوم فقط.',
    zh: '附加价值赠送——仅限今日。',
  },
  'legacy.guarantee.eyebrow': {
    fr: 'Sans risque', en: 'Risk-free', es: 'Sin riesgo', de: 'Risikofrei',
    it: 'Senza rischi', pt: 'Sem risco', nl: 'Zonder risico', ar: 'بدون مخاطرة', zh: '无风险保障',
  },
  'legacy.guarantee.defaultTitle': {
    fr: 'Satisfait ou remboursé', en: 'Satisfaction guaranteed or your money back',
    es: 'Satisfacción garantizada o te devolvemos tu dinero', de: 'Zufrieden oder Geld zurück',
    it: 'Soddisfatti o rimborsati', pt: 'Satisfeito ou reembolsado',
    nl: 'Tevreden of geld terug', ar: 'الرضا التام أو استرداد الأموال', zh: '满意保证，否则退款',
  },
  'legacy.targetAudience.eyebrow': {
    fr: 'Pour qui ?', en: "Who it's for", es: '¿Para quién?', de: 'Für wen?',
    it: 'Per chi?', pt: 'Para quem?', nl: 'Voor wie?', ar: 'لمن هذا المنتج؟', zh: '适用人群',
  },
  'legacy.targetAudience.title': {
    fr: 'Ce produit a été pensé pour vous', en: 'This product was made for you',
    es: 'Este producto fue pensado para ti', de: 'Dieses Produkt wurde für dich entwickelt',
    it: 'Questo prodotto è stato pensato per te', pt: 'Este produto foi pensado para si',
    nl: 'Dit product is ontworpen voor jou', ar: 'تم تصميم هذا المنتج من أجلك', zh: '为你而设计',
  },
  'legacy.targetAudience.badge': {
    fr: 'Ce produit est fait pour toi', en: 'This product is made for you',
    es: 'Este producto es para ti', de: 'Dieses Produkt ist für dich gemacht',
    it: 'Questo prodotto fa per te', pt: 'Este produto é para si',
    nl: 'Dit product is voor jou gemaakt', ar: 'هذا المنتج مصمم لك', zh: '这款产品适合你',
  },
  'legacy.features.eyebrow': {
    fr: 'Caractéristiques', en: 'Features', es: 'Características', de: 'Merkmale',
    it: 'Caratteristiche', pt: 'Características', nl: 'Kenmerken', ar: 'الميزات', zh: '产品特点',
  },
  'legacy.features.title': {
    fr: 'Conçu dans les moindres détails', en: 'Designed down to the smallest detail',
    es: 'Diseñado hasta el más mínimo detalle', de: 'Bis ins kleinste Detail durchdacht',
    it: 'Progettato nei minimi dettagli', pt: 'Concebido ao mais ínfimo detalhe',
    nl: 'Tot in de kleinste details ontworpen', ar: 'مصمم بأدق التفاصيل', zh: '精益求精的每一处细节',
  },
  'legacy.uniqueMechanism.eyebrow': {
    fr: 'Technologie exclusive', en: 'Exclusive technology', es: 'Tecnología exclusiva',
    de: 'Exklusive Technologie', it: 'Tecnologia esclusiva', pt: 'Tecnologia exclusiva',
    nl: 'Exclusieve technologie', ar: 'تقنية حصرية', zh: '独家技术',
  },
  'legacy.uniqueMechanism.title': {
    fr: 'Ce qui nous rend différents', en: 'What sets us apart', es: 'Lo que nos hace diferentes',
    de: 'Was uns anders macht', it: 'Ciò che ci rende diversi', pt: 'O que nos torna diferentes',
    nl: 'Wat ons anders maakt', ar: 'ما الذي يميزنا', zh: '我们的与众不同之处',
  },
  'legacy.uniqueMechanism.proof': {
    fr: 'Preuve', en: 'Proof', es: 'Prueba', de: 'Beweis', it: 'Prova',
    pt: 'Prova', nl: 'Bewijs', ar: 'الإثبات', zh: '实证',
  },
  'legacy.howItWorks.eyebrow': {
    fr: 'En pratique', en: 'In practice', es: 'En la práctica', de: 'In der Praxis',
    it: 'In pratica', pt: 'Na prática', nl: 'In de praktijk', ar: 'من الناحية العملية', zh: '实际操作',
  },
  'legacy.howItWorks.title': {
    fr: 'Comment ça marche', en: 'How it works', es: 'Cómo funciona', de: "So funktioniert's",
    it: 'Come funziona', pt: 'Como funciona', nl: 'Hoe het werkt', ar: 'كيف يعمل', zh: '工作原理',
  },
  'legacy.beforeAfter.eyebrow': {
    fr: 'Transformation', en: 'Transformation', es: 'Transformación', de: 'Verwandlung',
    it: 'Trasformazione', pt: 'Transformação', nl: 'Transformatie', ar: 'التحول', zh: '蝉变',
  },
  'legacy.beforeAfter.title': {
    fr: 'Avant. Après.', en: 'Before. After.', es: 'Antes. Después.', de: 'Vorher. Nachher.',
    it: 'Prima. Dopo.', pt: 'Antes. Depois.', nl: 'Voor. Na.', ar: 'قبل. بعد.', zh: '之前。之后。',
  },
  'legacy.beforeAfter.before': {
    fr: 'Avant', en: 'Before', es: 'Antes', de: 'Vorher', it: 'Prima',
    pt: 'Antes', nl: 'Voor', ar: 'قبل', zh: '之前',
  },
  'legacy.beforeAfter.after': {
    fr: 'Après', en: 'After', es: 'Después', de: 'Nachher', it: 'Dopo',
    pt: 'Depois', nl: 'Na', ar: 'بعد', zh: '之后',
  },
  'legacy.competitorComparison.eyebrow': {
    fr: 'Comparatif', en: 'Comparison', es: 'Comparativa', de: 'Vergleich',
    it: 'Confronto', pt: 'Comparação', nl: 'Vergelijking', ar: 'المقارنة', zh: '对比',
  },
  'legacy.competitorComparison.title': {
    fr: 'Pourquoi nous ?', en: 'Why us?', es: '¿Por qué nosotros?', de: 'Warum wir?',
    it: 'Perché noi?', pt: 'Porquê nós?', nl: 'Waarom wij?', ar: 'لماذا نحن؟', zh: '为什么选择我们？',
  },
  'legacy.competitorComparison.criterion': {
    fr: 'Critère', en: 'Criteria', es: 'Criterio', de: 'Kriterium', it: 'Criterio',
    pt: 'Critério', nl: 'Criterium', ar: 'المعيار', zh: '对比项',
  },
  'legacy.pressMentions.eyebrow': {
    fr: 'Vu dans la presse', en: 'As seen in', es: 'Visto en', de: 'Bekannt aus',
    it: 'Visto su', pt: 'Visto em', nl: 'Gezien in', ar: 'كما ورد في', zh: '媒体报道',
  },
  'legacy.founderNote.eyebrow': {
    fr: 'Le mot du fondateur', en: 'A note from the founder', es: 'Una palabra del fundador',
    de: 'Ein Wort vom Gründer', it: 'Una parola del fondatore', pt: 'Uma palavra do fundador',
    nl: 'Een woord van de oprichter', ar: 'كلمة من المؤسس', zh: '创始人寄语',
  },
  'legacy.valueStack.eyebrow': {
    fr: 'Ce que vous obtenez', en: 'What you get', es: 'Lo que obtienes', de: 'Was Sie erhalten',
    it: 'Cosa ottieni', pt: 'O que recebe', nl: 'Wat je krijgt', ar: 'ما الذي ستحصل عليه', zh: '你将获得',
  },
  'legacy.valueStack.title': {
    fr: 'Tout ce qui est inclus', en: "Everything that's included", es: 'Todo lo que está incluido',
    de: 'Alles, was enthalten ist', it: 'Tutto ciò che è incluso', pt: 'Tudo o que está incluído',
    nl: 'Alles wat is inbegrepen', ar: 'كل ما هو مشمول', zh: '所有包含内容',
  },
  'legacy.valueStack.totalValue': {
    fr: 'Valeur totale', en: 'Total value', es: 'Valor total', de: 'Gesamtwert',
    it: 'Valore totale', pt: 'Valor total', nl: 'Totale waarde', ar: 'القيمة الإجمالية', zh: '总价值',
  },
  'legacy.valueStack.youPayToday': {
    fr: "Vous payez aujourd'hui", en: 'You pay today', es: 'Pagas hoy', de: 'Sie zahlen heute',
    it: 'Paghi oggi', pt: 'Paga hoje', nl: 'Je betaalt vandaag', ar: 'تدفع اليوم', zh: '今日支付',
  },
  'legacy.valueStack.youSave': {
    fr: 'Vous économisez {amount}', en: 'You save {amount}', es: 'Ahorras {amount}',
    de: 'Sie sparen {amount}', it: 'Risparmi {amount}', pt: 'Poupa {amount}',
    nl: 'Je bespaart {amount}', ar: 'توفر {amount}', zh: '节省 {amount}',
  },
  'legacy.riskReversal.eyebrow': {
    fr: 'Réassurance', en: 'Peace of mind', es: 'Garantía de confianza', de: 'Sicherheit',
    it: 'Rassicurazione', pt: 'Garantias', nl: 'Geruststelling', ar: 'طمأنينة', zh: '安心保障',
  },
  'legacy.riskReversal.title': {
    fr: 'Achetez sans risque', en: 'Buy risk-free', es: 'Compra sin riesgo', de: 'Risikofrei einkaufen',
    it: 'Acquista senza rischi', pt: 'Compre sem risco', nl: 'Koop zonder risico',
    ar: 'تسوّق دون مخاطرة', zh: '无风险购买',
  },
  'legacy.objections.eyebrow': {
    fr: 'Vos questions', en: 'Your questions', es: 'Tus preguntas', de: 'Ihre Fragen',
    it: 'Le tue domande', pt: 'As suas perguntas', nl: 'Jouw vragen', ar: 'أسئلتك', zh: '你的疑问',
  },
  'legacy.objections.title': {
    fr: 'Les vraies questions.', en: 'The real questions.', es: 'Las preguntas reales.',
    de: 'Die wichtigen Fragen.', it: 'Le domande vere.', pt: 'As perguntas reais.',
    nl: 'De echte vragen.', ar: 'الأسئلة الحقيقية.', zh: '真正的问题。',
  },
  'legacy.communityCallout.eyebrow': {
    fr: 'Communauté', en: 'Community', es: 'Comunidad', de: 'Community', it: 'Community',
    pt: 'Comunidade', nl: 'Community', ar: 'المجتمع', zh: '社区',
  },
  'legacy.communityCallout.defaultCta': {
    fr: 'Rejoindre la communauté', en: 'Join the community', es: 'Únete a la comunidad',
    de: 'Der Community beitreten', it: 'Unisciti alla community', pt: 'Junte-se à comunidade',
    nl: 'Word lid van de community', ar: 'انضم إلى المجتمع', zh: '加入社区',
  },
  'legacy.finalPitch.eyebrow': {
    fr: 'Dernière chance', en: 'Last chance', es: 'Última oportunidad', de: 'Letzte Chance',
    it: 'Ultima occasione', pt: 'Última oportunidade', nl: 'Laatste kans', ar: 'الفرصة الأخيرة', zh: '最后机会',
  },
  'legacy.gallery.title': {
    fr: 'Voir le produit en détail', en: 'See it in detail', es: 'Ver el producto en detalle',
    de: 'Im Detail ansehen', it: 'Vedere in dettaglio', pt: 'Ver o produto em detalhe',
    nl: 'Bekijk het product in detail', ar: 'عرض المنتج بالتفصيل', zh: '查看产品细节',
  },
}

// ─── Helpers ────────────────────────────────────────────────────────

/**
 * Résout un libellé UI pour la langue donnée, avec interpolation optionnelle
 * ({n}, {name}, {amount}…) et fallback fr si la clé/langue est absente.
 *
 * Ne throw jamais : si la clé n'existe pas dans le dictionnaire, retourne la
 * clé elle-même (visible en dev, jamais de page cassée en prod).
 */
export function t(lang: string | undefined, key: string, params?: LabelParams): string {
  const l: UiLang = lang && ALLOWED_LANGS.has(lang) ? (lang as UiLang) : 'fr'
  const entry = UI_LABELS[key]
  if (!entry) return key
  let value = entry[l] ?? entry.fr ?? entry.en ?? Object.values(entry)[0] ?? key
  if (params) {
    for (const [k, v] of Object.entries(params)) {
      value = value.split(`{${k}}`).join(String(v))
    }
  }
  return value
}

/** true uniquement pour l'arabe — utilisé pour dir="rtl" sur <html>. */
export function isRtl(lang: string | undefined): boolean {
  return lang === 'ar'
}
