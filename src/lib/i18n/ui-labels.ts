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
  'bespoke.badge.moneyBackGuarantee': {
    fr: 'Garantie remboursement', en: 'Money-back guarantee', es: 'Garantía de devolución',
    de: 'Geld-zurück-Garantie', it: 'Garanzia di rimborso', pt: 'Garantia de reembolso',
    nl: 'Geld-terug-garantie', ar: 'ضمان استرداد الأموال', zh: '退款保证',
  },
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

  // ── Bespoke (contenu individuel des 43 fichiers etec-*.ts — nav/footer/
  // badges/CTA hardcodés propres à chaque template, hors sections.ts) ────
  'bespoke.faqShort': {
    fr: 'FAQ', en: 'FAQ', es: 'FAQ', de: 'FAQ', it: 'FAQ', pt: 'FAQ',
    nl: 'FAQ', ar: 'الأسئلة الشائعة', zh: '常见问题',
  },
  'bespoke.nav.home': {
    fr: 'Accueil', en: 'Home', es: 'Inicio', de: 'Startseite', it: 'Home',
    pt: 'Início', nl: 'Home', ar: 'الرئيسية', zh: '首页',
  },
  'bespoke.nav.reviewsShort': {
    fr: 'Avis', en: 'Reviews', es: 'Reseñas', de: 'Bewertungen', it: 'Recensioni',
    pt: 'Avaliações', nl: 'Reviews', ar: 'التقييمات', zh: '评价',
  },
  'bespoke.nav.collection': {
    fr: 'Collection', en: 'Collection', es: 'Colección', de: 'Kollektion',
    it: 'Collezione', pt: 'Coleção', nl: 'Collectie', ar: 'المجموعة', zh: '系列',
  },
  'bespoke.nav.shop': {
    fr: 'Boutique', en: 'Shop', es: 'Tienda', de: 'Shop', it: 'Negozio',
    pt: 'Loja', nl: 'Winkel', ar: 'المتجر', zh: '商店',
  },
  'bespoke.nav.support': {
    fr: 'Support', en: 'Support', es: 'Soporte', de: 'Support', it: 'Supporto',
    pt: 'Suporte', nl: 'Support', ar: 'الدعم', zh: '支持',
  },
  'bespoke.nav.ourStory': {
    fr: 'Notre histoire', en: 'Our Story', es: 'Nuestra historia', de: 'Unsere Geschichte',
    it: 'La nostra storia', pt: 'A nossa história', nl: 'Ons verhaal', ar: 'قصتنا', zh: '我们的故事',
  },
  'bespoke.nav.lookbook': {
    fr: 'Lookbook', en: 'Lookbook', es: 'Lookbook', de: 'Lookbook', it: 'Lookbook',
    pt: 'Lookbook', nl: 'Lookbook', ar: 'لوك بوك', zh: '造型手册',
  },
  'bespoke.nav.specs': {
    fr: 'Spécifications', en: 'Specs', es: 'Especificaciones', de: 'Spezifikationen',
    it: 'Specifiche', pt: 'Especificações', nl: 'Specificaties', ar: 'المواصفات', zh: '规格',
  },
  'bespoke.nav.craftsmanship': {
    fr: 'Savoir-faire', en: 'Craftsmanship', es: 'Saber hacer', de: 'Handwerkskunst',
    it: 'Artigianato', pt: 'Saber-fazer', nl: 'Vakmanschap', ar: 'الحرفية', zh: '工艺',
  },
  'bespoke.nav.ingredients': {
    fr: 'Ingrédients', en: 'Ingredients', es: 'Ingredientes', de: 'Zutaten',
    it: 'Ingredienti', pt: 'Ingredientes', nl: 'Ingrediënten', ar: 'المكونات', zh: '成分',
  },
  'bespoke.nav.company': {
    fr: 'Entreprise', en: 'Company', es: 'Empresa', de: 'Unternehmen', it: 'Azienda',
    pt: 'Empresa', nl: 'Bedrijf', ar: 'الشركة', zh: '公司',
  },
  'bespoke.nav.bundles': {
    fr: 'Packs', en: 'Bundles', es: 'Packs', de: 'Pakete', it: 'Pacchetti',
    pt: 'Pacotes', nl: 'Bundels', ar: 'الحزم', zh: '套装',
  },
  'bespoke.nav.about': {
    fr: 'À propos', en: 'About', es: 'Acerca de', de: 'Über uns', it: 'Chi siamo',
    pt: 'Sobre', nl: 'Over ons', ar: 'من نحن', zh: '关于我们',
  },
  'bespoke.footer.subscribe': {
    fr: "S'abonner", en: 'Subscribe', es: 'Suscribirse', de: 'Abonnieren',
    it: 'Iscriviti', pt: 'Subscrever', nl: 'Abonneren', ar: 'اشترك', zh: '订阅',
  },
  'bespoke.nav.services': {
    fr: 'Services', en: 'Services', es: 'Servicios', de: 'Dienstleistungen',
    it: 'Servizi', pt: 'Serviços', nl: 'Diensten', ar: 'الخدمات', zh: '服务',
  },
  'bespoke.nav.science': {
    fr: 'Science', en: 'Science', es: 'Ciencia', de: 'Wissenschaft', it: 'Scienza',
    pt: 'Ciência', nl: 'Wetenschap', ar: 'العلم', zh: '科学',
  },
  'bespoke.badge.returns30': {
    fr: 'Retours 30 jours', en: '30-day returns', es: 'Devoluciones 30 días',
    de: '30 Tage Rückgabe', it: 'Reso 30 giorni', pt: 'Devolução 30 dias',
    nl: '30 dagen retour', ar: 'إرجاع خلال 30 يومًا', zh: '30天退货',
  },
  'bespoke.section.provenResults': {
    fr: 'Résultats prouvés', en: 'Proven results', es: 'Resultados probados',
    de: 'Bewährte Ergebnisse', it: 'Risultati comprovati', pt: 'Resultados comprovados',
    nl: 'Bewezen resultaten', ar: 'نتائج مثبتة', zh: '效果验证',
  },
  'bespoke.nav.questions': {
    fr: 'Questions', en: 'Questions', es: 'Preguntas', de: 'Fragen', it: 'Domande',
    pt: 'Perguntas', nl: 'Vragen', ar: 'الأسئلة', zh: '问题',
  },
  'bespoke.nav.product': {
    fr: 'Produit', en: 'Product', es: 'Producto', de: 'Produkt', it: 'Prodotto',
    pt: 'Produto', nl: 'Product', ar: 'المنتج', zh: '产品',
  },
  'bespoke.nav.press': {
    fr: 'Presse', en: 'Press', es: 'Prensa', de: 'Presse', it: 'Stampa',
    pt: 'Imprensa', nl: 'Pers', ar: 'الصحافة', zh: '媒体',
  },
  'bespoke.badge.limitedOffer': {
    fr: 'Offre limitée', en: 'Limited offer', es: 'Oferta limitada',
    de: 'Begrenztes Angebot', it: 'Offerta limitata', pt: 'Oferta limitada',
    nl: 'Beperkt aanbod', ar: 'عرض محدود', zh: '限时优惠',
  },
  'bespoke.nav.nutrition': {
    fr: 'Nutrition', en: 'Nutrition', es: 'Nutrición', de: 'Ernährung', it: 'Nutrizione',
    pt: 'Nutrição', nl: 'Voeding', ar: 'التغذية', zh: '营养',
  },
  'bespoke.section.ourCommitments': {
    fr: 'Nos engagements', en: 'Our commitments', es: 'Nuestros compromisos',
    de: 'Unsere Verpflichtungen', it: 'I nostri impegni', pt: 'Os nossos compromissos',
    nl: 'Onze beloftes', ar: 'التزاماتنا', zh: '我们的承诺',
  },
  'bespoke.nav.furniture': {
    fr: 'Mobilier', en: 'Furniture', es: 'Mobiliario', de: 'Möbel', it: 'Mobili',
    pt: 'Mobiliário', nl: 'Meubels', ar: 'الأثاث', zh: '家具',
  },
  'bespoke.nav.materials': {
    fr: 'Matériaux', en: 'Materials', es: 'Materiales', de: 'Materialien',
    it: 'Materiali', pt: 'Materiais', nl: 'Materialen', ar: 'الخامات', zh: '材质',
  },
  'bespoke.badge.freeShipping': {
    fr: 'Livraison gratuite', en: 'Free shipping', es: 'Envío gratis',
    de: 'Kostenloser Versand', it: 'Spedizione gratuita', pt: 'Envio grátis',
    nl: 'Gratis verzending', ar: 'شحن مجاني', zh: '免费配送',
  },
  'bespoke.badge.limitedEdition': {
    fr: 'Édition limitée', en: 'Limited Edition', es: 'Edición limitada',
    de: 'Limitierte Auflage', it: 'Edizione limitata', pt: 'Edição limitada',
    nl: 'Beperkte oplage', ar: 'إصدار محدود', zh: '限量版',
  },
  'bespoke.nav.inspirations': {
    fr: 'Inspirations', en: 'Inspiration', es: 'Inspiración', de: 'Inspiration',
    it: 'Ispirazione', pt: 'Inspiração', nl: 'Inspiratie', ar: 'إلهام', zh: '灵感',
  },
  'bespoke.nav.sizeGuide': {
    fr: 'Guide des tailles', en: 'Size guide', es: 'Guía de tallas',
    de: 'Größentabelle', it: 'Guida alle taglie', pt: 'Guia de tamanhos',
    nl: 'Maattabel', ar: 'دليل المقاسات', zh: '尺码指南',
  },
  'bespoke.badge.warranty2y': {
    fr: 'Garantie 2 ans', en: '2-year warranty', es: 'Garantía de 2 años',
    de: '2 Jahre Garantie', it: 'Garanzia di 2 anni', pt: 'Garantia de 2 anos',
    nl: '2 jaar garantie', ar: 'ضمان لمدة عامين', zh: '2年保修',
  },
  'bespoke.section.inSituation': {
    fr: 'En situation', en: 'In use', es: 'En uso', de: 'Im Einsatz', it: 'In uso',
    pt: 'Em uso', nl: 'In gebruik', ar: 'أثناء الاستخدام', zh: '使用场景',
  },
  'bespoke.cta.learnMore': {
    fr: 'En savoir plus', en: 'Learn more', es: 'Saber más', de: 'Mehr erfahren',
    it: 'Scopri di più', pt: 'Saber mais', nl: 'Meer weten', ar: 'اعرف المزيد', zh: '了解更多',
  },
  'bespoke.section.inAction': {
    fr: 'En action', en: 'In action', es: 'En acción', de: 'In Aktion', it: 'In azione',
    pt: 'Em ação', nl: 'In actie', ar: 'أثناء العمل', zh: '使用中',
  },
  'bespoke.nav.details': {
    fr: 'Détails', en: 'Details', es: 'Detalles', de: 'Details', it: 'Dettagli',
    pt: 'Detalhes', nl: 'Details', ar: 'التفاصيل', zh: '详情',
  },
  'bespoke.nav.contact': {
    fr: 'Contact', en: 'Contact', es: 'Contacto', de: 'Kontakt', it: 'Contatto',
    pt: 'Contacto', nl: 'Contact', ar: 'تواصل معنا', zh: '联系我们',
  },
  'bespoke.nav.composition': {
    fr: 'Composition', en: 'Composition', es: 'Composición', de: 'Zusammensetzung',
    it: 'Composizione', pt: 'Composição', nl: 'Samenstelling', ar: 'التركيب', zh: '成分构成',
  },
  'bespoke.faq.commonQuestions': {
    fr: 'Questions courantes.', en: 'Common questions.', es: 'Preguntas frecuentes.',
    de: 'Häufige Fragen.', it: 'Domande comuni.', pt: 'Perguntas comuns.',
    nl: 'Veelgestelde vragen.', ar: 'أسئلة شائعة.', zh: '常见问题。',
  },
  'bespoke.nav.catalogue': {
    fr: 'Catalogue', en: 'Catalog', es: 'Catálogo', de: 'Katalog', it: 'Catalogo',
    pt: 'Catálogo', nl: 'Catalogus', ar: 'الكتالوج', zh: '产品目录',
  },
  'bespoke.nav.blog': {
    fr: 'Blog', en: 'Blog', es: 'Blog', de: 'Blog', it: 'Blog', pt: 'Blog',
    nl: 'Blog', ar: 'المدونة', zh: '博客',
  },
  'bespoke.nav.affiliates': {
    fr: 'Programme affilié', en: 'Affiliates', es: 'Afiliados', de: 'Partnerprogramm',
    it: 'Affiliati', pt: 'Afiliados', nl: 'Affiliates', ar: 'برنامج الشركاء', zh: '联盟计划',
  },
  'bespoke.nav.accessories': {
    fr: 'Accessoires', en: 'Accessories', es: 'Accesorios', de: 'Zubehör',
    it: 'Accessori', pt: 'Acessórios', nl: 'Accessoires', ar: 'الإكسسوارات', zh: '配件',
  },

  // ── etec-style.ts — consolidation de son ancien dico local (4 langues) ────
  'style.nav_menu': {
    fr: 'Menu', en: 'Menu', es: 'Menú', de: 'Menü', it: 'Menu', pt: 'Menu',
    nl: 'Menu', ar: 'القائمة', zh: '菜单',
  },
  'style.nav_gallery': {
    fr: 'Galerie', en: 'Gallery', es: 'Galería', de: 'Galerie', it: 'Galleria',
    pt: 'Galeria', nl: 'Galerij', ar: 'المعرض', zh: '图库',
  },
  'style.nav_features': {
    fr: 'Fonctions', en: 'Features', es: 'Funciones', de: 'Funktionen',
    it: 'Funzioni', pt: 'Funcionalidades', nl: 'Functies', ar: 'المميزات', zh: '功能',
  },
  'style.nav_cta': {
    fr: 'Nous contacter', en: 'Get in touch', es: 'Contacto', de: 'Kontaktieren Sie uns',
    it: 'Contattaci', pt: 'Contacte-nos', nl: 'Neem contact op', ar: 'تواصل معنا', zh: '联系我们',
  },
  'style.hero_eyebrow': {
    fr: 'Découvrez', en: 'Discover', es: 'Descubre', de: 'Entdecken', it: 'Scopri',
    pt: 'Descubra', nl: 'Ontdek', ar: 'اكتشف', zh: '探索',
  },
  'style.hero_with': {
    fr: 'avec', en: 'with', es: 'con', de: 'mit', it: 'con', pt: 'com',
    nl: 'met', ar: 'مع', zh: '与',
  },
  'style.hero_experts': {
    fr: 'Nos experts', en: 'Our experts', es: 'Nuestros expertos', de: 'Unsere Experten',
    it: 'I nostri esperti', pt: 'Os nossos especialistas', nl: 'Onze experts', ar: 'خبراؤنا', zh: '我们的专家',
  },
  'style.hero_corner': {
    fr: "Commandez dès aujourd'hui et profitez de votre produit.",
    en: 'Order today and enjoy your product.',
    es: 'Pide hoy y disfruta tu producto.',
    de: 'Bestellen Sie noch heute und genießen Sie Ihr Produkt.',
    it: 'Ordina oggi e goditi il tuo prodotto.',
    pt: 'Encomende hoje e desfrute do seu produto.',
    nl: 'Bestel vandaag en geniet van je product.',
    ar: 'اطلب اليوم واستمتع بمنتجك.',
    zh: '今天下单，尽享您的产品。',
  },
  'style.hero_members': {
    fr: 'clients', en: 'customers', es: 'clientes', de: 'Kunden', it: 'clienti',
    pt: 'clientes', nl: 'klanten', ar: 'عميل', zh: '位客户',
  },
  'style.services_tagline': {
    fr: 'Tout ce dont vous avez besoin, réuni en un seul produit.',
    en: 'Everything you need, in one product.',
    es: 'Todo lo que necesitas, en un producto.',
    de: 'Alles, was du brauchst, in einem Produkt.',
    it: 'Tutto ciò di cui hai bisogno, in un unico prodotto.',
    pt: 'Tudo o que precisa, num único produto.',
    nl: 'Alles wat je nodig hebt, in één product.',
    ar: 'كل ما تحتاجه في منتج واحد.',
    zh: '一件产品，满足所有需求。',
  },
  'style.benefit_0': {
    fr: 'Support continu', en: 'Ongoing support', es: 'Soporte continuo',
    de: 'Kontinuierlicher Support', it: 'Supporto continuo', pt: 'Suporte contínuo',
    nl: 'Continue ondersteuning', ar: 'دعم مستمر', zh: '持续支持',
  },
  'style.benefit_1': {
    fr: 'Conseil expert', en: 'Expert advice', es: 'Consejo experto',
    de: 'Expertenberatung', it: 'Consulenza esperta', pt: 'Aconselhamento especializado',
    nl: 'Deskundig advies', ar: 'نصيحة خبير', zh: '专家建议',
  },
  'style.benefit_2': {
    fr: 'Assistance achat', en: 'Shopping assistance', es: 'Asistencia de compra',
    de: 'Einkaufsunterstützung', it: 'Assistenza agli acquisti', pt: 'Assistência de compra',
    nl: 'Winkelhulp', ar: 'مساعدة في الشراء', zh: '购物协助',
  },
  'style.benefit_3': {
    fr: 'Consultation personnalisée', en: 'Personalised consultation', es: 'Consulta personalizada',
    de: 'Persönliche Beratung', it: 'Consulenza personalizzata', pt: 'Consulta personalizada',
    nl: 'Persoonlijk advies', ar: 'استشارة شخصية', zh: '个性化咨询',
  },
  'style.benefit_4': {
    fr: 'Qualité premium', en: 'Premium quality', es: 'Calidad premium',
    de: 'Premium-Qualität', it: 'Qualità premium', pt: 'Qualidade premium',
    nl: 'Premiumkwaliteit', ar: 'جودة ممتازة', zh: '优质品质',
  },
  'style.benefit_5': {
    fr: 'Résultats garantis', en: 'Guaranteed results', es: 'Resultados garantizados',
    de: 'Garantierte Ergebnisse', it: 'Risultati garantiti', pt: 'Resultados garantidos',
    nl: 'Gegarandeerde resultaten', ar: 'نتائج مضمونة', zh: '效果保证',
  },
  'style.price_from': {
    fr: 'à partir de', en: 'from', es: 'desde', de: 'ab', it: 'a partire da',
    pt: 'a partir de', nl: 'vanaf', ar: 'من', zh: '起',
  },
  'style.price_unit': {
    fr: '/ unité', en: '/ unit', es: '/ unidad', de: '/ Stück', it: '/ unità',
    pt: '/ unidade', nl: '/ stuk', ar: '/ وحدة', zh: '/ 件',
  },
  'style.styles_eyebrow': {
    fr: 'Explorer', en: 'Explore', es: 'Explorar', de: 'Entdecken', it: 'Esplora',
    pt: 'Explorar', nl: 'Ontdekken', ar: 'استكشف', zh: '探索',
  },
  'style.styles_title': {
    fr: 'Nos produits', en: 'Our products', es: 'Nuestros productos', de: 'Unsere Produkte',
    it: 'I nostri prodotti', pt: 'Os nossos produtos', nl: 'Onze producten', ar: 'منتجاتنا', zh: '我们的产品',
  },
  'style.styles_subtitle': {
    fr: 'Une sélection pensée pour vous — qualité, praticité, style.',
    en: 'A selection designed for you — quality, practicality, style.',
    es: 'Una selección diseñada para ti — calidad, practicidad, estilo.',
    de: 'Eine für dich zusammengestellte Auswahl — Qualität, Praktikabilität, Stil.',
    it: 'Una selezione pensata per te — qualità, praticità, stile.',
    pt: 'Uma seleção pensada para si — qualidade, praticidade, estilo.',
    nl: 'Een selectie speciaal voor jou — kwaliteit, gemak, stijl.',
    ar: 'تشكيلة مصممة لك — جودة وعملية وأناقة.',
    zh: '为你精心挑选——品质、实用、风格。',
  },
  'style.collage_badge': {
    fr: 'Populaire', en: 'Popular', es: 'Popular', de: 'Beliebt', it: 'Popolare',
    pt: 'Popular', nl: 'Populair', ar: 'الأكثر طلبًا', zh: '热门',
  },
  'style.collage_card_title': {
    fr: 'Tendances produit', en: 'Product trends', es: 'Tendencias del producto',
    de: 'Produkttrends', it: 'Tendenze del prodotto', pt: 'Tendências do produto',
    nl: 'Producttrends', ar: 'اتجاهات المنتج', zh: '产品趋势',
  },
  'style.collage_overlay': {
    fr: 'Voir les détails', en: 'View details', es: 'Ver detalles', de: 'Details ansehen',
    it: 'Vedi dettagli', pt: 'Ver detalhes', nl: 'Bekijk details', ar: 'عرض التفاصيل', zh: '查看详情',
  },
  'style.cat_0': {
    fr: 'Qualité', en: 'Quality', es: 'Calidad', de: 'Qualität', it: 'Qualità',
    pt: 'Qualidade', nl: 'Kwaliteit', ar: 'جودة', zh: '品质',
  },
  'style.cat_1': {
    fr: 'Design', en: 'Design', es: 'Diseño', de: 'Design', it: 'Design',
    pt: 'Design', nl: 'Design', ar: 'تصميم', zh: '设计',
  },
  'style.cat_2': {
    fr: 'Confort', en: 'Comfort', es: 'Confort', de: 'Komfort', it: 'Comfort',
    pt: 'Conforto', nl: 'Comfort', ar: 'راحة', zh: '舌适',
  },
  'style.cat_3': {
    fr: 'Durabilité', en: 'Durability', es: 'Durabilidad', de: 'Langlebigkeit',
    it: 'Durabilità', pt: 'Durabilidade', nl: 'Duurzaamheid', ar: 'متانة', zh: '耐用性',
  },
  'style.cat_4': {
    fr: 'Praticité', en: 'Practical', es: 'Practicidad', de: 'Praktisch',
    it: 'Praticità', pt: 'Praticidade', nl: 'Praktisch', ar: 'عملية', zh: '实用性',
  },
  'style.cat_5': {
    fr: 'Tendance', en: 'Trending', es: 'Tendencia', de: 'Trend', it: 'Di tendenza',
    pt: 'Tendência', nl: 'Trending', ar: 'رائج', zh: '流行',
  },
  'style.cat_6': {
    fr: 'Premium', en: 'Premium', es: 'Premium', de: 'Premium', it: 'Premium',
    pt: 'Premium', nl: 'Premium', ar: 'فاخر', zh: '高端',
  },
  'style.cat_7': {
    fr: 'Populaire', en: 'Popular', es: 'Popular', de: 'Beliebt', it: 'Popolare',
    pt: 'Popular', nl: 'Populair', ar: 'شائع', zh: '热门',
  },
  'style.cat_8': {
    fr: 'Exclusif', en: 'Exclusive', es: 'Exclusivo', de: 'Exklusiv', it: 'Esclusivo',
    pt: 'Exclusivo', nl: 'Exclusief', ar: 'حصري', zh: '独家',
  },
  'style.cat_9': {
    fr: 'Bestseller', en: 'Bestseller', es: 'Más vendido', de: 'Bestseller',
    it: 'Bestseller', pt: 'Mais vendido', nl: 'Bestseller', ar: 'الأكثر مبيعاً', zh: '畅销',
  },
  'style.quote_eyebrow': {
    fr: "Ce qu'ils disent", en: 'What they say', es: 'Lo que dicen', de: 'Was sie sagen',
    it: 'Cosa dicono', pt: 'O que dizem', nl: 'Wat ze zeggen', ar: 'ما يقولونه', zh: '他们怎么说',
  },
  'style.quote_fallback': {
    fr: "Ce produit a transformé mon quotidien. Je ne peux plus m'en passer.",
    en: "This product transformed my daily routine. I can't live without it.",
    es: 'Este producto transformó mi rutina diaria. No puedo vivir sin él.',
    de: 'Dieses Produkt hat meinen Alltag verändert. Ich kann nicht mehr darauf verzichten.',
    it: 'Questo prodotto ha trasformato la mia routine quotidiana. Non posso più farne a meno.',
    pt: 'Este produto transformou a minha rotina diária. Não consigo viver sem ele.',
    nl: 'Dit product heeft mijn dagelijkse routine veranderd. Ik kan er niet meer zonder.',
    ar: 'غيّر هذا المنتج حياتي اليومية. لا أستطيع العيش بدونه.',
    zh: '这款产品改变了我的日常生活，我离不开它了。',
  },
  'style.footer_desc_fallback': {
    fr: 'Qualité et satisfaction, livrées chez vous.',
    en: 'Quality and satisfaction, delivered to you.',
    es: 'Calidad y satisfacción, entregadas a ti.',
    de: 'Qualität und Zufriedenheit, direkt zu dir geliefert.',
    it: 'Qualità e soddisfazione, consegnate a te.',
    pt: 'Qualidade e satisfação, entregues a si.',
    nl: 'Kwaliteit en tevredenheid, bij jou bezorgd.',
    ar: 'الجودة والرضا، تُوصَل إليك.',
    zh: '品质与满意，直达你手中。',
  },
  'style.footer_products': {
    fr: 'Produits', en: 'Products', es: 'Productos', de: 'Produkte', it: 'Prodotti',
    pt: 'Produtos', nl: 'Producten', ar: 'المنتجات', zh: '产品',
  },
  'style.footer_support': {
    fr: 'Support client', en: 'Customer support', es: 'Soporte al cliente',
    de: 'Kundensupport', it: 'Assistenza clienti', pt: 'Apoio ao cliente',
    nl: 'Klantenservice', ar: 'دعم العملاء', zh: '客户支持',
  },
  'style.footer_guarantee': {
    fr: 'Garantie', en: 'Guarantee', es: 'Garantía', de: 'Garantie', it: 'Garanzia',
    pt: 'Garantia', nl: 'Garantie', ar: 'الضمان', zh: '保修',
  },
  'style.footer_order': {
    fr: 'Commander', en: 'Order now', es: 'Pedir ahora', de: 'Jetzt bestellen',
    it: 'Ordina ora', pt: 'Encomendar', nl: 'Bestellen', ar: 'اطلب الآن', zh: '立即订购',
  },
  'style.footer_instagram': {
    fr: 'Instagram', en: 'Instagram', es: 'Instagram', de: 'Instagram', it: 'Instagram',
    pt: 'Instagram', nl: 'Instagram', ar: 'إنستغرام', zh: 'Instagram',
  },
  'style.footer_copyright': {
    fr: 'Tous droits réservés.', en: 'All rights reserved.', es: 'Todos los derechos reservados.',
    de: 'Alle Rechte vorbehalten.', it: 'Tutti i diritti riservati.', pt: 'Todos os direitos reservados.',
    nl: 'Alle rechten voorbehouden.', ar: 'جميع الحقوق محفوظة.', zh: '保留所有权利。',
  },
  'style.footer_privacy': {
    fr: 'Politique de confidentialité', en: 'Privacy Policy', es: 'Política de privacidad',
    de: 'Datenschutzrichtlinie', it: 'Informativa sulla privacy', pt: 'Política de privacidade',
    nl: 'Privacybeleid', ar: 'سياسة الخصوصية', zh: '隐私政策',
  },
  'style.footer_terms': {
    fr: "Conditions d'utilisation", en: 'Terms of Use', es: 'Términos de uso',
    de: 'Nutzungsbedingungen', it: 'Termini di utilizzo', pt: 'Termos de utilização',
    nl: 'Gebruiksvoorwaarden', ar: 'شروط الاستخدام', zh: '使用条款',
  },
  'style.footer_cookies': {
    fr: 'Cookies', en: 'Cookie Settings', es: 'Ajustes de cookies', de: 'Cookie-Einstellungen',
    it: 'Impostazioni cookie', pt: 'Definições de cookies', nl: 'Cookie-instellingen',
    ar: 'إعدادات الكوكيز', zh: 'Cookie 设置',
  },
  'style.aria_hero': {
    fr: 'Section principale', en: 'Main section', es: 'Sección principal', de: 'Hauptbereich',
    it: 'Sezione principale', pt: 'Secção principal', nl: 'Hoofdsectie', ar: 'القسم الرئيسي', zh: '主要区域',
  },
  'style.aria_experts': {
    fr: 'Notre équipe', en: 'Our team', es: 'Nuestro equipo', de: 'Unser Team',
    it: 'Il nostro team', pt: 'A nossa equipa', nl: 'Ons team', ar: 'فريقنا', zh: '我们的团队',
  },
  'style.aria_styles': {
    fr: 'Nos catégories', en: 'Our categories', es: 'Nuestras categorías', de: 'Unsere Kategorien',
    it: 'Le nostre categorie', pt: 'As nossas categorias', nl: 'Onze categorieën', ar: 'فئاتنا', zh: '我们的分类',
  },
  'style.aria_quote_nav': {
    fr: 'Navigation avis', en: 'Reviews navigation', es: 'Navegación de reseñas',
    de: 'Bewertungsnavigation', it: 'Navigazione recensioni', pt: 'Navegação de avaliações',
    nl: 'Beoordelingsnavigatie', ar: 'التنقل بين الآراء', zh: '评价导航',
  },
  'style.aria_prev': {
    fr: 'Avis précédent', en: 'Previous review', es: 'Reseña anterior', de: 'Vorherige Bewertung',
    it: 'Recensione precedente', pt: 'Avaliação anterior', nl: 'Vorige beoordeling', ar: 'الرأي السابق', zh: '上一条评价',
  },
  'style.aria_next': {
    fr: 'Avis suivant', en: 'Next review', es: 'Siguiente reseña', de: 'Nächste Bewertung',
    it: 'Recensione successiva', pt: 'Avaliação seguinte', nl: 'Volgende beoordeling', ar: 'الرأي التالي', zh: '下一条评价',
  },
  'style.aria_footer': {
    fr: 'Pied de page', en: 'Footer', es: 'Pie de página', de: 'Fußzeile', it: 'Piè di pagina',
    pt: 'Rodapé', nl: 'Voettekst', ar: 'تذييل الصفحة', zh: '页脚',
  },

  // ── etec-natural.ts — consolidation de son ancien dico local (4 langues) ──
  'natural.nav_cta': {
    fr: 'Découvrir', en: 'Shop now', es: 'Comprar', de: 'Jetzt entdecken',
    it: 'Scopri ora', pt: 'Comprar agora', nl: 'Nu ontdekken', ar: 'تسوق الآن', zh: '立即选购',
  },
  'natural.hero_eyebrow': {
    fr: 'Nouveau', en: 'New', es: 'Nuevo', de: 'Neu', it: 'Novità', pt: 'Novo',
    nl: 'Nieuw', ar: 'جديد', zh: '新品',
  },
  'natural.hero_nature': {
    fr: 'Fait pour durer', en: 'Made to last', es: 'Hecho para durar', de: 'Gemacht, um zu bleiben',
    it: 'Fatto per durare', pt: 'Feito para durar', nl: 'Gemaakt om te blijven', ar: 'صُنع ليدوم', zh: '经久耐用',
  },
  'natural.hero_scroll': {
    fr: 'Défiler', en: 'Scroll', es: 'Desplazar', de: 'Scrollen', it: 'Scorri',
    pt: 'Deslizar', nl: 'Scrollen', ar: 'تمرير', zh: '向下滑动',
  },
  'natural.hero_stat_suffix': {
    fr: 'commandes', en: 'orders', es: 'pedidos', de: 'Bestellungen', it: 'ordini',
    pt: 'encomendas', nl: 'bestellingen', ar: 'طلب', zh: '笔订单',
  },
  'natural.press_eyebrow': {
    fr: 'Vu dans', en: 'Featured in', es: 'Visto en', de: 'Erwähnt in', it: 'Menzionato su',
    pt: 'Visto em', nl: 'Gezien in', ar: 'كما ذُكر في', zh: '媒体报道',
  },
  'natural.story_fallback_h': {
    fr: 'Pourquoi ce produit existe', en: 'Why this product exists', es: 'Por qué existe este producto',
    de: 'Warum es dieses Produkt gibt', it: 'Perché esiste questo prodotto', pt: 'Porque é que este produto existe',
    nl: 'Waarom dit product bestaat', ar: 'لماذا يوجد هذا المنتج', zh: '这款产品诞生的原因',
  },
  'natural.story_fallback_p': {
    fr: 'Nous avons créé ce produit pour résoudre un problème réel — pas pour suivre une tendance.',
    en: 'We built this product to solve a real problem — not to follow a trend.',
    es: 'Creamos este producto para resolver un problema real — no para seguir una tendencia.',
    de: 'Wir haben dieses Produkt entwickelt, um ein echtes Problem zu lösen — nicht um einem Trend zu folgen.',
    it: 'Abbiamo creato questo prodotto per risolvere un problema reale — non per seguire una tendenza.',
    pt: 'Criámos este produto para resolver um problema real — não para seguir uma tendência.',
    nl: 'We hebben dit product gemaakt om een echt probleem op te lossen — niet om een trend te volgen.',
    ar: 'صنعنا هذا المنتج لحل مشكلة حقيقية — ليس لمتابعة الاتجاهات.',
    zh: '我们打造这款产品是为了解决真实问题——而非追随潮流。',
  },
  'natural.feat_fallback_0': {
    fr: 'Matière naturelle', en: 'Natural material', es: 'Material natural', de: 'Natürliches Material',
    it: 'Materiale naturale', pt: 'Material natural', nl: 'Natuurlijk materiaal', ar: 'مادة طبيعية', zh: '天然材质',
  },
  'natural.feat_fallback_1': {
    fr: 'Fabrication responsable', en: 'Responsible manufacturing', es: 'Fabricación responsable',
    de: 'Verantwortungsvolle Herstellung', it: 'Produzione responsabile', pt: 'Fabrico responsável',
    nl: 'Verantwoorde productie', ar: 'تصنيع مسؤول', zh: '负责任的生产',
  },
  'natural.feat_fallback_2': {
    fr: 'Durabilité certifiée', en: 'Certified durability', es: 'Durabilidad certificada',
    de: 'Zertifizierte Langlebigkeit', it: 'Durabilità certificata', pt: 'Durabilidade certificada',
    nl: 'Gecertificeerde duurzaamheid', ar: 'متانة معتمدة', zh: '认证耐用性',
  },
  'natural.feat_desc_0': {
    fr: 'Sélectionné à la source pour sa qualité supérieure.',
    en: 'Sourced for superior quality.',
    es: 'Seleccionado en origen por su calidad superior.',
    de: 'An der Quelle ausgewählt für höchste Qualität.',
    it: "Selezionato all'origine per la sua qualità superiore.",
    pt: 'Selecionado na origem pela sua qualidade superior.',
    nl: 'Aan de bron geselecteerd voor superieure kwaliteit.',
    ar: 'مختار من المصدر لجودته العالية.',
    zh: '从源头精选，品质卓越。',
  },
  'natural.feat_desc_1': {
    fr: 'Chaque pièce assemblée avec une attention extrême.',
    en: 'Every piece assembled with extreme care.',
    es: 'Cada pieza ensamblada con extremo cuidado.',
    de: 'Jedes Teil wird mit größter Sorgfalt montiert.',
    it: 'Ogni pezzo assemblato con estrema cura.',
    pt: 'Cada peça montada com extremo cuidado.',
    nl: 'Elk onderdeel met uiterste zorg gemonteerd.',
    ar: 'كل قطعة مجمعة باهتمام شديد.',
    zh: '每一件都经过精心组装。',
  },
  'natural.feat_desc_2': {
    fr: 'Conçu pour accompagner chaque jour, longtemps.',
    en: 'Designed to accompany every day, for a long time.',
    es: 'Diseñado para acompañar cada día, durante mucho tiempo.',
    de: 'Entwickelt, um dich lange Zeit jeden Tag zu begleiten.',
    it: 'Progettato per accompagnarti ogni giorno, a lungo.',
    pt: 'Concebido para acompanhar cada dia, durante muito tempo.',
    nl: 'Ontworpen om je elke dag, lange tijd, te vergezellen.',
    ar: 'مصمم ليرافق كل يوم، لفترة طويلة.',
    zh: '专为长久院伴每一天而设计。',
  },
  'natural.testimonial_fallback': {
    fr: 'Ce produit a changé ma façon de consommer. Je ne reviendrai pas en arrière.',
    en: "This product changed the way I consume. I won't go back.",
    es: 'Este producto cambió mi forma de consumir. No volvería atrás.',
    de: 'Dieses Produkt hat meine Art zu konsumieren verändert. Ich möchte nicht mehr zurück.',
    it: 'Questo prodotto ha cambiato il mio modo di consumare. Non tornerei indietro.',
    pt: 'Este produto mudou a minha forma de consumir. Não voltaria atrás.',
    nl: 'Dit product heeft mijn manier van consumeren veranderd. Ik ga niet meer terug.',
    ar: 'غيّر هذا المنتج طريقة استهلاكي. لن أعود أبدًا.',
    zh: '这款产品改变了我的消费方式，我再也回不去了。',
  },
  'natural.testimonial_name': {
    fr: 'Camille L.', en: 'Camille L.', es: 'Camille L.', de: 'Camille L.', it: 'Camille L.',
    pt: 'Camille L.', nl: 'Camille L.', ar: 'كاميل ل.', zh: 'Camille L.',
  },
  'natural.testimonial_role': {
    fr: 'Cliente depuis 2 ans', en: 'Customer for 2 years', es: 'Cliente desde hace 2 años',
    de: 'Kundin seit 2 Jahren', it: 'Cliente da 2 anni', pt: 'Cliente há 2 anos',
    nl: 'Klant sinds 2 jaar', ar: 'عميلة منذ سنتين', zh: '两年老客户',
  },
  'natural.behind_eyebrow': {
    fr: 'Coulisses', en: 'Behind the scenes', es: 'Detrás del diseño', de: 'Hinter den Kulissen',
    it: 'Dietro le quinte', pt: 'Bastidores', nl: 'Achter de schermen', ar: 'خلف الكواليس', zh: '幕后故事',
  },
  'natural.behind_title': {
    fr: 'Derrière le design', en: 'Behind the design', es: 'Detrás del diseño', de: 'Hinter dem Design',
    it: 'Dietro il design', pt: 'Por trás do design', nl: 'Achter het ontwerp', ar: 'خلف التصميم', zh: '设计背后',
  },
  'natural.behind_fallback': {
    fr: "Chaque détail a été pensé dans un seul objectif : vous offrir quelque chose qui dure vraiment, qui s'améliore avec le temps, et qui ne compromet jamais la planète.",
    en: 'Every detail was thought out with a single goal: to offer you something that truly lasts, improves over time, and never compromises the planet.',
    es: 'Cada detalle fue pensado con un solo objetivo: ofrecerte algo que realmente dure, que mejore con el tiempo y que nunca comprometa el planeta.',
    de: 'Jedes Detail wurde mit einem einzigen Ziel durchdacht: dir etwas zu bieten, das wirklich hält, sich mit der Zeit verbessert und den Planeten niemals gefährdet.',
    it: 'Ogni dettaglio è stato pensato con un unico obiettivo: offrirti qualcosa che duri davvero, che migliori nel tempo e che non comprometta mai il pianeta.',
    pt: 'Cada detalhe foi pensado com um único objetivo: oferecer-lhe algo que dure verdadeiramente, que melhore com o tempo e que nunca comprometa o planeta.',
    nl: 'Elk detail is doordacht met één doel: je iets bieden dat écht lang meegaat, in de loop van de tijd beter wordt en de planeet nooit schaadt.',
    ar: 'تم التفكير في كل تفصيل بهدف واحد: تقديم شيء يدوم حقًا، ويتحسن مع الوقت، ولا يضر بالكوكب أبدًا.',
    zh: '每一个细节都以一个目标为出发点：为你提供真正经久耐用、随时间愈发出色、且绝不危害地球的产品。',
  },
  'natural.faq_title': {
    fr: 'Ce que vous voulez savoir', en: 'What you want to know', es: 'Lo que quieres saber',
    de: 'Was du wissen möchtest', it: 'Quello che vuoi sapere', pt: 'O que quer saber',
    nl: 'Wat je wilt weten', ar: 'ما تريد معرفته', zh: '你想了解的',
  },
  'natural.rr_shipping': {
    fr: 'Livraison offerte', en: 'Free shipping', es: 'Envío gratis', de: 'Kostenloser Versand',
    it: 'Spedizione gratuita', pt: 'Envio grátis', nl: 'Gratis verzending', ar: 'شحن مجاني', zh: '免费配送',
  },
  'natural.rr_returns': {
    fr: 'Retour 30 jours', en: '30-day returns', es: 'Devolución 30 días', de: '30 Tage Rückgabe',
    it: 'Reso 30 giorni', pt: 'Devolução 30 dias', nl: '30 dagen retour', ar: 'إرجاع 30 يومًا', zh: '30天退货',
  },
  'natural.rr_carbon': {
    fr: 'Neutre en carbone', en: 'Carbon neutral', es: 'Neutro en carbono', de: 'Klimaneutral',
    it: 'Neutrale dal punto di vista climatico', pt: 'Neutro em carbono', nl: 'Klimaatneutraal', ar: 'محايد كربونيًا', zh: '碳中和',
  },
  'natural.final_eyebrow': {
    fr: 'Prêt à commencer ?', en: 'Ready to start?', es: '¿Listo para empezar?', de: 'Bereit anzufangen?',
    it: 'Pronto per iniziare?', pt: 'Pronto para começar?', nl: 'Klaar om te beginnen?', ar: 'مستعد للبدء؟', zh: '准备好了吗？',
  },
  'natural.final_cta': {
    fr: 'Découvrir maintenant', en: 'Shop now', es: 'Comprar ahora', de: 'Jetzt entdecken',
    it: 'Scopri ora', pt: 'Comprar agora', nl: 'Nu ontdekken', ar: 'تسوق الآن', zh: '立即选购',
  },
  'natural.final_sub': {
    fr: 'Livraison gratuite · Retour 30 jours · Neutre en carbone',
    en: 'Free shipping · 30-day returns · Carbon neutral',
    es: 'Envío gratis · Devolución 30 días · Neutro en carbono',
    de: 'Kostenloser Versand · 30 Tage Rückgabe · Klimaneutral',
    it: 'Spedizione gratuita · Reso 30 giorni · Neutrale dal punto di vista climatico',
    pt: 'Envio grátis · Devolução 30 dias · Neutro em carbono',
    nl: 'Gratis verzending · 30 dagen retour · Klimaatneutraal',
    ar: 'شحن مجاني · إرجاع 30 يومًا · محايد كربونيًا',
    zh: '免费配送 · 30天退货 · 碳中和',
  },
  'natural.footer_privacy': {
    fr: 'Confidentialité', en: 'Privacy', es: 'Privacidad', de: 'Datenschutz', it: 'Privacy',
    pt: 'Privacidade', nl: 'Privacy', ar: 'الخصوصية', zh: '隐私',
  },
  'natural.footer_terms': {
    fr: 'Conditions', en: 'Terms', es: 'Términos', de: 'Bedingungen', it: 'Termini',
    pt: 'Termos', nl: 'Voorwaarden', ar: 'الشروط', zh: '条款',
  },
  'natural.footer_desc_fallback': {
    fr: 'Conçu pour durer. Fabriqué avec soin.', en: 'Designed to last. Made with care.',
    es: 'Diseñado para durar. Fabricado con cuidado.', de: 'Für die Ewigkeit gemacht. Mit Sorgfalt hergestellt.',
    it: 'Progettato per durare. Realizzato con cura.', pt: 'Concebido para durar. Feito com cuidado.',
    nl: 'Gemaakt om te blijven. Met zorg vervaardigd.', ar: 'مصمم ليدوم. مصنوع بعناية.', zh: '经久耐用，用心制作。',
  },
  'natural.aria_gallery': {
    fr: 'Galerie produit', en: 'Product gallery', es: 'Galería del producto', de: 'Produktgalerie',
    it: 'Galleria del prodotto', pt: 'Galeria do produto', nl: 'Productgalerij', ar: 'معرض المنتج', zh: '产品图库',
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
