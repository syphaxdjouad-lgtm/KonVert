import type { LandingPageData } from '@/types'

import {
  renderRichSections,
  type SectionTheme,
} from './sections'

// ─── I18N ────────────────────────────────────────────────────────────────────

// Langue de rendu — dico local complété aux 9 langues NEXARA (fr/en/es/de/it/
// pt/nl/ar/zh) suite à l'audit résiduel J-2 : seuls fr/en/es/ar étaient
// couverts, causant un fallback FR sur de/it/pt/nl/zh.
const T: Record<string, Record<string, string>> = {
  // Nav
  nav_home:        { fr: 'Accueil',   en: 'Home',     es: 'Inicio',    de: 'Startseite', it: 'Home',       pt: 'Início',       nl: 'Home',        ar: 'الرئيسية',         zh: '首页' },
  nav_shop:        { fr: 'Boutique',  en: 'Shop',     es: 'Tienda',    de: 'Shop',       it: 'Negozio',     pt: 'Loja',         nl: 'Shop',        ar: 'المتجر',           zh: '商店' },
  nav_pages:       { fr: 'Pages',     en: 'Pages',    es: 'Páginas',   de: 'Seiten',     it: 'Pagine',      pt: 'Páginas',      nl: "Pagina's",    ar: 'الصفحات',          zh: '页面' },
  nav_features:    { fr: 'Fonctions', en: 'Features', es: 'Funciones', de: 'Funktionen', it: 'Funzioni',    pt: 'Funcionalidades', nl: 'Functies', ar: 'المميزات',         zh: '功能' },
  nav_blog:        { fr: 'Blog',      en: 'Blog',     es: 'Blog',      de: 'Blog',       it: 'Blog',        pt: 'Blog',         nl: 'Blog',        ar: 'المدونة',          zh: '博客' },
  nav_contact:     { fr: 'Contact',   en: 'Contact',  es: 'Contacto',  de: 'Kontakt',    it: 'Contatto',    pt: 'Contacto',     nl: 'Contact',     ar: 'تواصل',            zh: '联系我们' },

  // Aria / accessibility
  aria_menu:       { fr: 'Menu',             en: 'Menu',            es: 'Menú',                de: 'Menü',                 it: 'Menu',                pt: 'Menu',                nl: 'Menu',              ar: 'القائمة',           zh: '菜单' },
  aria_search:     { fr: 'Rechercher',       en: 'Search',          es: 'Buscar',              de: 'Suchen',               it: 'Cerca',               pt: 'Pesquisar',           nl: 'Zoeken',            ar: 'بحث',               zh: '搜索' },
  aria_wishlist:   { fr: 'Liste de souhaits',en: 'Wishlist',        es: 'Lista de deseos',     de: 'Wunschliste',          it: 'Lista dei desideri',  pt: 'Lista de desejos',    nl: 'Verlanglijst',      ar: 'قائمة الرغبات',    zh: '心愿单' },
  aria_account:    { fr: 'Mon compte',       en: 'Account',         es: 'Mi cuenta',           de: 'Konto',                it: 'Account',             pt: 'Conta',               nl: 'Account',           ar: 'حسابي',             zh: '账户' },
  aria_cart:       { fr: 'Panier',           en: 'Cart',            es: 'Carrito',             de: 'Warenkorb',            it: 'Carrello',            pt: 'Carrinho',            nl: 'Winkelwagen',       ar: 'عربة التسوق',       zh: '购物车' },
  aria_main_nav:   { fr: 'Navigation principale', en: 'Main navigation', es: 'Navegación principal', de: 'Hauptnavigation', it: 'Navigazione principale', pt: 'Navegação principal', nl: 'Hoofdnavigatie', ar: 'التنقل الرئيسي', zh: '主导航' },

  // Announce bar
  ann_sale:        { fr: 'VENTE DU WEEK-END ! JUSQU\'À', en: 'WEEKEND SALE! GET UP TO', es: '¡VENTA DE FIN DE SEMANA! HASTA', de: 'WOCHENEND-SALE! BIS ZU', it: 'SALDI DEL WEEKEND! FINO A', pt: 'PROMOÇÃO DE FIM DE SEMANA! ATÉ', nl: 'WEEKENDACTIE! TOT WEL', ar: 'تخفيضات نهاية الأسبوع! حتى', zh: '周末大促！最高可享' },
  ann_off:         { fr: 'DE RÉDUCTION',   en: 'OFF',             es: 'DE DESCUENTO', de: 'RABATT', it: 'DI SCONTO', pt: 'DE DESCONTO', nl: 'KORTING', ar: 'خصم', zh: '折扣' },
  ann_shipping:    { fr: 'LIVRAISON ET RETOURS GRATUITS', en: 'FREE SHIPPING AND RETURN POLICY', es: 'ENVÍO Y DEVOLUCIONES GRATIS', de: 'KOSTENLOSER VERSAND UND RÜCKGABE', it: 'SPEDIZIONE E RESI GRATUITI', pt: 'ENVIO E DEVOLUÇÕES GRÁTIS', nl: 'GRATIS VERZENDING EN RETOUR', ar: 'الشحن والإرجاع مجاناً', zh: '免费配送与退货' },
  ann_limited:     { fr: 'OFFRE LIMITÉE ! PROFITEZ-EN !', en: 'LIMITED TIME OFFER! HURRY UP!', es: '¡OFERTA LIMITADA! ¡DATE PRISA!', de: 'ZEITLICH BEGRENZTES ANGEBOT! JETZT ZUGREIFEN!', it: 'OFFERTA A TEMPO LIMITATO! AFFRETTATI!', pt: 'OFERTA POR TEMPO LIMITADO! APROVEITE!', nl: 'BEPERKTE AANBIEDING! WEES ER SNEL BIJ!', ar: 'عرض محدود! أسرع!', zh: '限时优惠，抓紧抢购！' },
  ann_opening:     { fr: 'OFFRES D\'OUVERTURE', en: 'GRAND OPENING OFFERS', es: 'OFERTAS DE INAUGURACIÓN', de: 'ERÖFFNUNGSANGEBOTE', it: 'OFFERTE DI LANCIO', pt: 'OFERTAS DE INAUGURAÇÃO', nl: 'OPENINGSAANBIEDINGEN', ar: 'عروض الافتتاح', zh: '开业优惠' },

  // Hero
  hero_fallback_headline: { fr: 'Cosmétiques Haut de Gamme Pour Vous', en: 'High Cosmetics<br/>Product For You', es: 'Cosmética Premium<br/>Para Ti', de: 'Premium-Kosmetik<br/>Für Dich', it: 'Cosmetici Premium<br/>Per Te', pt: 'Cosmética Premium<br/>Para Ti', nl: 'Premium Cosmetica<br/>Voor Jou', ar: 'مستحضرات فاخرة<br/>لك أنت', zh: '为你打造的<br/>高端美妆' },
  hero_fallback_subtitle: { fr: 'Découvrez notre collection de soins essentiels premium conçus pour votre peau unique.', en: 'Discover our curated collection of premium skincare essentials crafted for your unique skin.', es: 'Descubre nuestra selección de esenciales de cuidado premium diseñados para tu piel única.', de: 'Entdecke unsere kuratierte Kollektion premium Pflegeprodukte, entwickelt für deine einzigartige Haut.', it: 'Scopri la nostra collezione curata di essenziali skincare premium pensati per la tua pelle unica.', pt: 'Descubra a nossa coleção de essenciais de cuidados premium criados para a sua pele única.', nl: 'Ontdek onze zorgvuldig samengestelde collectie premium huidverzorging voor jouw unieke huid.', ar: 'اكتشف مجموعتنا المختارة من أساسيات العناية الفاخرة المصممة لبشرتك الفريدة.', zh: '发现我们精选的高端护肤精品系列，为你独特的肌肤而生。' },
  hero_fallback_cta:      { fr: 'Voir la Collection', en: 'See All Collection', es: 'Ver Colección', de: 'Kollektion ansehen', it: 'Vedi la Collezione', pt: 'Ver Coleção', nl: 'Bekijk Collectie', ar: 'تصفح المجموعة', zh: '查看系列' },
  hero_happy_clients:     { fr: 'Clients Satisfaits', en: 'Happy Clients', es: 'Clientes Felices', de: 'Zufriedene Kunden', it: 'Clienti Felici', pt: 'Clientes Felizes', nl: 'Tevreden Klanten', ar: 'عملاء سعداء', zh: '满意客户' },

  // Stats bar
  stat_products:   { fr: 'Produits',      en: 'Products',      es: 'Productos',   de: 'Produkte',   it: 'Prodotti',   pt: 'Produtos',   nl: 'Producten', ar: 'المنتجات',    zh: '产品' },
  stat_natural:    { fr: 'Naturel',       en: 'Natural',       es: 'Natural',     de: 'Natürlich',  it: 'Naturale',   pt: 'Natural',    nl: 'Natuurlijk', ar: 'طبيعي',      zh: '天然' },
  stat_clients:    { fr: 'Clients Heureux', en: 'Happy Clients', es: 'Clientes Felices', de: 'Zufriedene Kunden', it: 'Clienti Felici', pt: 'Clientes Felizes', nl: 'Tevreden Klanten', ar: 'عملاء سعداء', zh: '满意客户' },

  // Categories
  cat_overline:    { fr: 'Favoris Populaires',  en: 'Top Search Favorites', es: 'Favoritos Más Buscados', de: 'Beliebte Favoriten', it: 'Preferiti più Cercati', pt: 'Favoritos Mais Procurados', nl: 'Populaire Favorieten', ar: 'المفضلات الأكثر بحثاً', zh: '热门搜索精选' },
  cat_title:       { fr: 'Acheter par Catégorie', en: 'Shop by Categories', es: 'Comprar por Categorías', de: 'Nach Kategorie einkaufen', it: 'Acquista per Categoria', pt: 'Comprar por Categoria', nl: 'Winkel per Categorie', ar: 'تسوق حسب الفئة', zh: '按类别购物' },
  cat_all_link:    { fr: 'Toutes les Catégories', en: 'All Categories', es: 'Todas las Categorías', de: 'Alle Kategorien', it: 'Tutte le Categorie', pt: 'Todas as Categorias', nl: 'Alle Categorieën', ar: 'كل الفئات', zh: '所有类别' },
  cat_products:    { fr: 'Produits',             en: 'Products',            es: 'Productos', de: 'Produkte', it: 'Prodotti', pt: 'Produtos', nl: 'Producten', ar: 'منتجات', zh: '产品' },
  // Category name fallbacks
  cat_name_0:      { fr: 'Meilleures Ventes', en: 'Best Sellers', es: 'Más Vendidos', de: 'Bestseller', it: 'Più Venduti', pt: 'Mais Vendidos', nl: 'Bestsellers', ar: 'الأكثر مبيعاً', zh: '畅销产品' },
  cat_name_1:      { fr: 'Nouveautés',        en: 'New Arrivals', es: 'Novedades',    de: 'Neuheiten',   it: 'Novità',        pt: 'Novidades',      nl: 'Nieuwe Producten', ar: 'الوصول الجديد',    zh: '新品上市' },
  cat_name_2:      { fr: 'Collections',       en: 'Collections',  es: 'Colecciones',  de: 'Kollektionen', it: 'Collezioni',    pt: 'Coleções',       nl: 'Collecties',       ar: 'المجموعات',         zh: '系列' },
  cat_name_3:      { fr: 'Coffrets',          en: 'Bundles',      es: 'Packs',        de: 'Sets',         it: 'Cofanetti',     pt: 'Kits',           nl: 'Bundels',          ar: 'مجموعات الهدايا',  zh: '套装' },
  cat_name_4:      { fr: 'Accessoires',       en: 'Accessories',  es: 'Accesorios',   de: 'Zubehör',      it: 'Accessori',     pt: 'Acessórios',     nl: 'Accessoires',      ar: 'الإكسسوارات',       zh: '配件' },

  // Products section
  products_title:  { fr: 'Explorer les Produits', en: 'Explore Products', es: 'Explorar Productos', de: 'Produkte entdecken', it: 'Esplora i Prodotti', pt: 'Explorar Produtos', nl: 'Producten Ontdekken', ar: 'استكشف المنتجات', zh: '探索产品' },
  products_all:    { fr: 'Voir Tout',              en: 'View All',         es: 'Ver Todo', de: 'Alle ansehen', it: 'Vedi Tutto', pt: 'Ver Tudo', nl: 'Alles Bekijken', ar: 'عرض الكل', zh: '查看全部' },
  add_to_cart:     { fr: 'Ajouter au Panier',     en: 'Add to Cart',      es: 'Añadir al Carrito', de: 'In den Warenkorb', it: 'Aggiungi al Carrello', pt: 'Adicionar ao Carrinho', nl: 'In Winkelwagen', ar: 'أضف إلى السلة', zh: '加入购物车' },

  // Sale banner
  sale_offer:      { fr: 'Offre limitée — ne ratez pas ça', en: 'Limited time offer — don\'t miss out', es: 'Oferta limitada — no te la pierdas', de: 'Zeitlich begrenztes Angebot — nicht verpassen', it: 'Offerta a tempo limitato — non perdertela', pt: 'Oferta por tempo limitado — não perca', nl: 'Beperkte aanbieding — mis het niet', ar: 'عرض محدود — لا تفوتك الفرصة', zh: '限时优惠 — 不容错过' },
  sale_shop:       { fr: 'Acheter les Soldes', en: 'Shop the Sale', es: 'Comprar Ofertas', de: 'Zum Sale', it: 'Acquista in Saldo', pt: 'Comprar Promoção', nl: 'Shop de Sale', ar: 'تسوق التخفيضات', zh: '选购促销' },
  sale_days:       { fr: 'Jours',   en: 'Days', es: 'Días',  de: 'Tage',   it: 'Giorni', pt: 'Dias',  nl: 'Dagen', ar: 'أيام',  zh: '天' },
  sale_hrs:        { fr: 'Heures',  en: 'Hrs',  es: 'Horas', de: 'Std',    it: 'Ore',    pt: 'Horas', nl: 'Uur',   ar: 'ساعة', zh: '时' },
  sale_mns:        { fr: 'Mins',    en: 'Mns',  es: 'Mins',  de: 'Min',    it: 'Min',    pt: 'Mins',  nl: 'Min',   ar: 'دقيقة',zh: '分' },
  sale_secs:       { fr: 'Secs',    en: 'Secs', es: 'Segs',  de: 'Sek',    it: 'Sec',    pt: 'Segs',  nl: 'Sec',   ar: 'ثانية',zh: '秒' },

  // Best sellers
  bs_overline:     { fr: 'Favoris Clients',    en: 'Customer Favorites', es: 'Favoritos Clientes', de: 'Kundenfavoriten', it: 'Preferiti dai Clienti', pt: 'Favoritos dos Clientes', nl: 'Klantfavorieten', ar: 'مفضلات العملاء', zh: '顾客最爱' },
  bs_title:        { fr: 'Meilleures Ventes',  en: 'Best Sellers',       es: 'Más Vendidos', de: 'Bestseller', it: 'Più Venduti', pt: 'Mais Vendidos', nl: 'Bestsellers', ar: 'الأكثر مبيعاً', zh: '畅销产品' },
  bs_tab_all:      { fr: 'Tout',               en: 'All',                es: 'Todo', de: 'Alle', it: 'Tutti', pt: 'Tudo', nl: 'Alles', ar: 'الكل', zh: '全部' },
  bs_tab_new:      { fr: 'Nouveau',            en: 'New',                es: 'Nuevo', de: 'Neu', it: 'Nuovo', pt: 'Novo', nl: 'Nieuw', ar: 'جديد', zh: '新品' },
  bs_tab_sale:     { fr: 'Soldes',             en: 'Sale',               es: 'Oferta', de: 'Sale', it: 'Saldi', pt: 'Promoção', nl: 'Sale', ar: 'تخفيضات', zh: '促销' },
  bs_tab_top:      { fr: 'Mieux notés',        en: 'Top rated',          es: 'Mejor valorado', de: 'Am besten bewertet', it: 'Più votati', pt: 'Mais bem avaliados', nl: 'Best beoordeeld', ar: 'الأعلى تقييماً', zh: '评分最高' },
  bs_reviews:      { fr: 'avis',               en: 'reviews',            es: 'reseñas', de: 'Bewertungen', it: 'recensioni', pt: 'avaliações', nl: 'beoordelingen', ar: 'تقييمات', zh: '条评论' },
  bs_add_wishlist: { fr: 'Ajouter aux souhaits', en: 'Add to wishlist',  es: 'Añadir a favoritos', de: 'Zur Wunschliste hinzufügen', it: 'Aggiungi ai preferiti', pt: 'Adicionar aos favoritos', nl: 'Toevoegen aan verlanglijst', ar: 'أضف إلى المفضلة', zh: '加入心愿单' },

  // Testimonials
  testi_overline:  { fr: 'Vraies Histoires',          en: 'Real Stories',              es: 'Historias Reales', de: 'Echte Geschichten', it: 'Storie Vere', pt: 'Histórias Reais', nl: 'Echte Verhalen', ar: 'قصص حقيقية', zh: '真实故事' },
  testi_title:     { fr: 'Ce que disent nos Clients', en: 'What Our Clients Say',      es: 'Lo que dicen nuestros Clientes', de: 'Was unsere Kunden sagen', it: 'Cosa Dicono i Nostri Clienti', pt: 'O que Dizem os Nossos Clientes', nl: 'Wat Onze Klanten Zeggen', ar: 'ما يقوله عملاؤنا', zh: '客户怎么说' },
  testi_avg_label: { fr: 'avis vérifiés',             en: 'verified reviews',          es: 'reseñas verificadas', de: 'verifizierte Bewertungen', it: 'recensioni verificate', pt: 'avaliações verificadas', nl: 'geverifieerde beoordelingen', ar: 'تقييم موثق', zh: '条已验证评论' },
  testi_verified:  { fr: 'Achat Vérifié',             en: 'Verified Purchase',         es: 'Compra Verificada', de: 'Verifizierter Kauf', it: 'Acquisto Verificato', pt: 'Compra Verificada', nl: 'Geverifieerde Aankoop', ar: 'شراء موثق', zh: '已验证购买' },
  // Fallback testimonials
  testi_q0:        { fr: 'J\'adore absolument cette marque. Ma peau n\'a jamais été aussi hydratée et lumineuse. Je reçois des compliments chaque jour !', en: 'Absolutely love this brand. My skin has never felt so hydrated and glowy. I get compliments every single day!', es: '¡Me encanta esta marca. Mi piel nunca se ha sentido tan hidratada y radiante. ¡Recibo cumplidos todos los días!', de: 'Ich liebe diese Marke absolut. Meine Haut war noch nie so hydratisiert und strahlend. Ich bekomme jeden Tag Komplimente!', it: 'Adoro assolutamente questo marchio. La mia pelle non è mai stata così idratata e luminosa. Ricevo complimenti ogni giorno!', pt: 'Adoro absolutamente esta marca. A minha pele nunca esteve tão hidratada e radiante. Recebo elogios todos os dias!', nl: 'Ik ben dol op dit merk. Mijn huid heeft zich nog nooit zo gehydrateerd en stralend gevoeld. Ik krijg elke dag complimenten!', ar: 'أنا أحب هذه العلامة التجارية تمامًا. لم تشعر بشرتي بالترطيب والإشراق كهذا من قبل. أتلقى المجاملات كل يوم!', zh: '我非常喜欢这个品牌。我的皮肤从未如此水润有光泽，每天都有人夸我！' },
  testi_q1:        { fr: 'La qualité est exceptionnelle. Ingrédients propres, bel emballage, et ça marche vraiment. Chaque euro dépensé vaut le coup.', en: 'The quality is outstanding. Clean ingredients, beautiful packaging, and it actually works. Worth every penny.', es: 'La calidad es excepcional. Ingredientes limpios, envase precioso, y realmente funciona. Vale cada céntimo.', de: 'Die Qualität ist herausragend. Saubere Inhaltsstoffe, schöne Verpackung, und es funktioniert wirklich. Jeden Cent wert.', it: 'La qualità è eccezionale. Ingredienti puliti, packaging bellissimo, e funziona davvero. Vale ogni centesimo.', pt: 'A qualidade é excecional. Ingredientes limpos, embalagem bonita, e realmente funciona. Vale cada cêntimo.', nl: 'De kwaliteit is uitstekend. Zuivere ingrediënten, mooie verpakking, en het werkt echt. Elke cent waard.', ar: 'الجودة رائعة. مكونات نظيفة، تغليف جميل، وهو يعمل فعلاً. يستحق كل قرش.', zh: '品质卓越。成分干净，包装精美，而且真的有效。物超所值。' },
  testi_q2:        { fr: 'J\'ai enfin trouvé une marque de soins en qui j\'ai 100% confiance. Le sérum a transformé ma peau en deux semaines. Je recommande vivement !', en: 'Finally found a skincare brand I trust 100%. The serum transformed my skin within two weeks. Highly recommend!', es: '¡Por fin encontré una marca de cuidado en la que confío 100%. El sérum transformó mi piel en dos semanas. ¡Muy recomendable!', de: 'Endlich eine Pflegemarke gefunden, der ich 100% vertraue. Das Serum hat meine Haut innerhalb von zwei Wochen verändert. Sehr empfehlenswert!', it: 'Finalmente ho trovato un marchio skincare di cui mi fido al 100%. Il siero ha trasformato la mia pelle in due settimane. Consigliatissimo!', pt: 'Finalmente encontrei uma marca de skincare em que confio 100%. O sérum transformou a minha pele em duas semanas. Recomendo muito!', nl: 'Eindelijk een huidverzorgingsmerk gevonden dat ik 100% vertrouw. Het serum veranderde mijn huid binnen twee weken. Sterk aanbevolen!', ar: 'وجدت أخيراً علامة تجارية للعناية بالبشرة أثق بها 100%. حوّل السيروم بشرتي في أسبوعين. أنصح به بشدة!', zh: '终于找到一个我100%信任的护肤品牌。精华液在两周内改变了我的肌肤。强烈推荐！' },
  testi_name0:     { fr: 'Sophie M.',   en: 'Sophie M.',   es: 'Sophie M.',   de: 'Sophie M.',   it: 'Sophie M.',   pt: 'Sophie M.',   nl: 'Sophie M.',   ar: 'سوفي م.',   zh: 'Sophie M.' },
  testi_name1:     { fr: 'Amara K.',    en: 'Amara K.',    es: 'Amara K.',    de: 'Amara K.',    it: 'Amara K.',    pt: 'Amara K.',    nl: 'Amara K.',    ar: 'أمارا ك.',  zh: 'Amara K.' },
  testi_name2:     { fr: 'Isabelle R.', en: 'Isabelle R.', es: 'Isabelle R.', de: 'Isabelle R.', it: 'Isabelle R.', pt: 'Isabelle R.', nl: 'Isabelle R.', ar: 'إيزابيل ر.', zh: 'Isabelle R.' },

  // Newsletter
  nl_title:        { fr: 'Abonnez-vous &amp; Obtenez 10% sur votre Première Commande', en: 'Subscribe &amp; Get 10% Off Your First Order', es: 'Suscríbete y Obtén 10% de Descuento en tu Primer Pedido', de: 'Abonnieren &amp; 10% Rabatt auf deine erste Bestellung erhalten', it: 'Iscriviti e Ottieni il 10% di Sconto sul tuo Primo Ordine', pt: 'Subscreva e Obtenha 10% de Desconto na sua Primeira Encomenda', nl: 'Abonneer je &amp; Ontvang 10% Korting op je Eerste Bestelling', ar: 'اشترك واحصل على خصم 10% على طلبك الأول', zh: '订阅即享首单9折优惠' },
  nl_subtitle:     { fr: 'Rejoignez plus de 50 000 clients satisfaits et soyez le premier à connaître les nouveaux produits, offres exclusives et conseils.', en: 'Join 50,000+ satisfied customers and be the first to hear about new products, exclusive offers, and tips.', es: 'Únete a más de 50.000 clientes satisfechos y sé el primero en conocer nuevos productos, ofertas exclusivas y consejos.', de: 'Schließe dich über 50.000 zufriedenen Kunden an und erfahre als Erste(r) von neuen Produkten, exklusiven Angeboten und Tipps.', it: 'Unisciti a oltre 50.000 clienti soddisfatti e sii il primo a conoscere nuovi prodotti, offerte esclusive e consigli.', pt: 'Junte-se a mais de 50.000 clientes satisfeitos e seja o primeiro a saber sobre novos produtos, ofertas exclusivas e dicas.', nl: 'Sluit je aan bij meer dan 50.000 tevreden klanten en hoor als eerste over nieuwe producten, exclusieve aanbiedingen en tips.', ar: 'انضم إلى أكثر من 50,000 عميل راضٍ وكن أول من يعلم بالمنتجات الجديدة والعروض الحصرية.', zh: '加入超过5万名满意客户，第一时间获取新品、专属优惠和护肤贴士。' },
  nl_placeholder:  { fr: 'Entrez votre adresse email', en: 'Enter your email address', es: 'Introduce tu correo electrónico', de: 'E-Mail-Adresse eingeben', it: 'Inserisci il tuo indirizzo email', pt: 'Introduza o seu endereço de email', nl: 'Voer je e-mailadres in', ar: 'أدخل بريدك الإلكتروني', zh: '输入你的电子邮箱' },
  nl_btn:          { fr: 'S\'abonner', en: 'Subscribe', es: 'Suscribirse', de: 'Abonnieren', it: 'Iscriviti', pt: 'Subscrever', nl: 'Abonneren', ar: 'اشترك', zh: '订阅' },
  nl_note:         { fr: 'Pas de spam. Désabonnement à tout moment.', en: 'No spam. Unsubscribe anytime.', es: 'Sin spam. Cancela cuando quieras.', de: 'Kein Spam. Jederzeit abbestellbar.', it: 'Niente spam. Disiscriviti quando vuoi.', pt: 'Sem spam. Cancele quando quiser.', nl: 'Geen spam. Altijd opzegbaar.', ar: 'لا إزعاج. ألغِ الاشتراك في أي وقت.', zh: '无垃圾邮件，随时可退订。' },
  nl_aria:         { fr: 'Formulaire d\'abonnement email', en: 'Email subscription form', es: 'Formulario de suscripción por email', de: 'E-Mail-Abonnementformular', it: 'Modulo di iscrizione email', pt: 'Formulário de subscrição de email', nl: 'E-mailabonnementsformulier', ar: 'نموذج الاشتراك بالبريد الإلكتروني', zh: '邮件订阅表单' },

  // Footer
  footer_quick_links: { fr: 'Liens Rapides',  en: 'Quick Links', es: 'Enlaces Rápidos', de: 'Schnelllinks', it: 'Link Rapidi', pt: 'Links Rápidos', nl: 'Snelle Links', ar: 'روابط سريعة', zh: '快速链接' },
  footer_home:        { fr: 'Accueil',        en: 'Home',        es: 'Inicio', de: 'Startseite', it: 'Home', pt: 'Início', nl: 'Home', ar: 'الرئيسية', zh: '首页' },
  footer_about:       { fr: 'À propos',       en: 'About Us',    es: 'Nosotros', de: 'Über uns', it: 'Chi Siamo', pt: 'Sobre Nós', nl: 'Over Ons', ar: 'من نحن', zh: '关于我们' },
  footer_shop:        { fr: 'Boutique',       en: 'Shop',        es: 'Tienda', de: 'Shop', it: 'Negozio', pt: 'Loja', nl: 'Shop', ar: 'المتجر', zh: '商店' },
  footer_blog:        { fr: 'Blog',           en: 'Blog',        es: 'Blog', de: 'Blog', it: 'Blog', pt: 'Blog', nl: 'Blog', ar: 'المدونة', zh: '博客' },
  footer_contact:     { fr: 'Contact',        en: 'Contact',     es: 'Contacto', de: 'Kontakt', it: 'Contatto', pt: 'Contacto', nl: 'Contact', ar: 'تواصل', zh: '联系我们' },
  footer_help:        { fr: 'Aide',           en: 'Help',        es: 'Ayuda', de: 'Hilfe', it: 'Aiuto', pt: 'Ajuda', nl: 'Hulp', ar: 'المساعدة', zh: '帮助' },
  footer_faq:         { fr: 'FAQ',            en: 'FAQ',         es: 'FAQ', de: 'FAQ', it: 'FAQ', pt: 'FAQ', nl: 'FAQ', ar: 'الأسئلة الشائعة', zh: '常见问题' },
  footer_shipping:    { fr: 'Livraison &amp; Retours', en: 'Shipping &amp; Returns', es: 'Envío &amp; Devoluciones', de: 'Versand &amp; Rückgabe', it: 'Spedizione &amp; Resi', pt: 'Envio &amp; Devoluções', nl: 'Verzending &amp; Retour', ar: 'الشحن والإرجاع', zh: '配送与退货' },
  footer_track:       { fr: 'Suivre ma Commande', en: 'Track Order', es: 'Rastrear Pedido', de: 'Bestellung verfolgen', it: 'Traccia il tuo Ordine', pt: 'Rastrear Encomenda', nl: 'Bestelling Volgen', ar: 'تتبع الطلب', zh: '追踪订单' },
  footer_privacy:     { fr: 'Confidentialité', en: 'Privacy Policy', es: 'Política de Privacidad', de: 'Datenschutz', it: 'Privacy', pt: 'Política de Privacidade', nl: 'Privacybeleid', ar: 'سياسة الخصوصية', zh: '隐私政策' },
  footer_terms:       { fr: 'Conditions d\'utilisation', en: 'Terms of Service', es: 'Términos de Servicio', de: 'Nutzungsbedingungen', it: 'Termini di Servizio', pt: 'Termos de Serviço', nl: 'Gebruiksvoorwaarden', ar: 'شروط الخدمة', zh: '服务条款' },
  footer_copyright:   { fr: 'Tous droits réservés.', en: 'All rights reserved.', es: 'Todos los derechos reservados.', de: 'Alle Rechte vorbehalten.', it: 'Tutti i diritti riservati.', pt: 'Todos os direitos reservados.', nl: 'Alle rechten voorbehouden.', ar: 'جميع الحقوق محفوظة.', zh: '保留所有权利。' },
  footer_tagline_fallback: { fr: 'Qualité premium, approuvée par des milliers de clients satisfaits à travers le monde.', en: 'Premium quality, trusted by thousands of satisfied customers worldwide.', es: 'Calidad premium, de confianza para miles de clientes satisfechos en todo el mundo.', de: 'Premium-Qualität, der Tausende zufriedener Kunden weltweit vertrauen.', it: 'Qualità premium, di cui si fidano migliaia di clienti soddisfatti in tutto il mondo.', pt: 'Qualidade premium, em que confiam milhares de clientes satisfeitos em todo o mundo.', nl: 'Premium kwaliteit, vertrouwd door duizenden tevreden klanten wereldwijd.', ar: 'جودة فاخرة، يثق بها آلاف العملاء الراضين حول العالم.', zh: '高端品质，深受全球数千名满意客户信赖。' },
}

function t(key: string, lang: string = 'fr'): string {
  return T[key]?.[lang] ?? T[key]?.['fr'] ?? key
}

// ─── FALLBACK IMAGES — cosmetics / skincare Unsplash ─────────────────────────
// Utilisées comme fallback si data.images est vide — ne pas supprimer

const FALLBACK_IMGS = [
  'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=800&q=80',
  'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800&q=80',
  'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&q=80',
  'https://images.unsplash.com/photo-1617897903246-719242758050?w=800&q=80',
]

const HERO_IMG_FALLBACK = 'https://images.unsplash.com/photo-1580618672591-eb180b1a973f?w=900&q=80'

const CAT_IMGS_FALLBACK = [
  'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&q=80',
  'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&q=80',
  'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=400&q=80',
  'https://images.unsplash.com/photo-1526045612212-70caf35c14df?w=400&q=80',
  'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=400&q=80',
]

// ─── COLOR TOKENS ────────────────────────────────────────────────────────────

const C = {
  bg:          '#FFFFFF',
  bgLight:     '#F8F6F3',
  olive:       '#7A8C6E',
  oliveDark:   '#4A5C3E',
  oliveLight:  '#EBF0E6',
  text:        '#1A1A1A',
  muted:       '#6B7280',
  border:      '#E5E7EB',
  sale:        '#C8A96E',
  star:        '#F59E0B',
  footer:      '#1A1A1A',
}

// ─── SVG ICONS ───────────────────────────────────────────────────────────────

const ICON_SEARCH    = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>`
const ICON_HEART     = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>`
const ICON_CART      = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>`
const ICON_USER      = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`
const ICON_INSTAGRAM = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>`
const ICON_TWITTER   = `<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>`
const ICON_FACEBOOK  = `<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>`
const ICON_TIKTOK    = `<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.75a4.85 4.85 0 0 1-1.01-.06z"/></svg>`

// ─── HELPERS ─────────────────────────────────────────────────────────────────

function starsHtml(count: number, total = 5): string {
  return Array.from({ length: total }, (_, i) =>
    `<span style="color:${i < count ? C.star : '#D1D5DB'};font-size:13px;">&#9733;</span>`
  ).join('')
}

function avatarCircle(name: string, size = 48): string {
  const colors = ['#7A8C6E', '#C8A96E', '#4A5C3E', '#9CA87E', '#B8856A']
  const idx    = name.charCodeAt(0) % colors.length
  const init   = name.slice(0, 1).toUpperCase()
  return `<div style="width:${size}px;height:${size}px;border-radius:50%;background:${colors[idx]};display:flex;align-items:center;justify-content:center;color:#fff;font-weight:700;font-size:${Math.round(size * 0.38)}px;font-family:'Inter',sans-serif;flex-shrink:0;">${init}</div>`
}

// ─── MAIN EXPORT ─────────────────────────────────────────────────────────────

const BLUSHO_THEME: SectionTheme = {
  primary:    '#7a8c6e',
  accent:     '#f4f6f3',
  text:       '#1a1a2e',
  textMuted:  '#6E6E73',
  bg:         '#ffffff',
  bgAlt:      '#F5F5F7',
  border:     '#E8E8ED',
  fontFamily: "'Inter',sans-serif",
  radius:     '16px',
}

export function templateEtecBlusho(data: LandingPageData): string {
  const lang = data.language ?? 'fr'
  const _ = (key: string) => t(key, lang)

  const _real = data.images?.filter(Boolean) ?? []
  const imgs = _real.length >= 1
    ? Array.from({ length: Math.max(4, _real.length) }, (_, i) => _real[i % _real.length])
    : FALLBACK_IMGS

  // Hero image : priorité data.images[0], sinon fallback Unsplash
  const heroImg = _real[0] || HERO_IMG_FALLBACK

  // Cat images : priorité data.images rotatif, sinon fallback Unsplash par index
  const catImg = (i: number) => _real[i] || CAT_IMGS_FALLBACK[i % CAT_IMGS_FALLBACK.length]

  const price         = data.price         || '29.90'
  const originalPrice = data.original_price || '59.90'
  const savePct       = price && originalPrice
    ? Math.round((1 - parseFloat(price) / parseFloat(originalPrice)) * 100)
    : 50

  const benefitFallbacks = [
    _('cat_name_0'), // "Best Sellers" generic fallback
    _('cat_name_1'),
    _('cat_name_2'),
    _('cat_name_3'),
    _('cat_name_4'),
  ]
  const benefits = [
    data.benefits?.[0] || benefitFallbacks[0],
    data.benefits?.[1] || benefitFallbacks[1],
    data.benefits?.[2] || benefitFallbacks[2],
    data.benefits?.[3] || benefitFallbacks[3],
    data.benefits?.[4] || benefitFallbacks[4],
  ]

  const productName = data.product_name

  // produit cards — 6 entrées
  const productCards = [
    { name: productName, img: imgs[0], price, orig: originalPrice, rating: 4.8, reviews: 89,  badge: 'SALE' },
    { name: productName, img: imgs[1], price: (parseFloat(price)+5).toFixed(2),  orig:'', rating: 4.9, reviews: 134, badge: 'NEW'  },
    { name: productName, img: imgs[2], price: (parseFloat(price)+8).toFixed(2),  orig:'', rating: 4.7, reviews: 62,  badge: ''     },
    { name: productName, img: imgs[3], price: (parseFloat(price)+3).toFixed(2),  orig:'', rating: 4.6, reviews: 47,  badge: 'SALE' },
    { name: productName, img: imgs[0], price: (parseFloat(price)-2).toFixed(2),  orig:'', rating: 4.8, reviews: 105, badge: ''     },
    { name: productName, img: imgs[1], price: (parseFloat(price)+12).toFixed(2), orig:'', rating: 5.0, reviews: 218, badge: 'NEW'  },
  ]

  const testiData = data.testimonials?.slice(0, 3) ?? []
  const testimonials = [
    {
      name:   testiData[0]?.name || _('testi_name0'),
      rating: testiData[0]?.rating ?? 5,
      quote:  testiData[0]?.text || _('testi_q0'),
    },
    {
      name:   testiData[1]?.name || _('testi_name1'),
      rating: testiData[1]?.rating ?? 5,
      quote:  testiData[1]?.text || _('testi_q1'),
    },
    {
      name:   testiData[2]?.name || _('testi_name2'),
      rating: testiData[2]?.rating ?? 5,
      quote:  testiData[2]?.text || _('testi_q2'),
    },
  ]

  return `<!DOCTYPE html>
<html lang="${data.language || 'fr'}" dir="${data.language === 'ar' ? 'rtl' : 'ltr'}">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1.0"/>
<title>${productName}</title>
<link rel="preconnect" href="https://fonts.googleapis.com"/>
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/>
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,600&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet"/>
<style>
  /* ── RESET ── */
  *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
  html{scroll-behavior:smooth;}
  body{font-family:'Inter',sans-serif;background:${C.bg};color:${C.text};overflow-x:hidden;-webkit-font-smoothing:antialiased;}
  img{display:block;max-width:100%;height:auto;}
  a{color:inherit;text-decoration:none;}
  button{cursor:pointer;border:none;background:none;font-family:inherit;}

  /* ── MARQUEE ANIMATION ── */
  @keyframes marqueeb{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}
  @keyframes marquee-reverseb{0%{transform:translateX(-50%)}100%{transform:translateX(0)}}

  /* ── NAVBAR ── */
  .navb{position:sticky;top:0;z-index:1000;background:${C.bg};border-bottom:1px solid ${C.border};padding:0 40px;}
  .nav-innerb{max-width:1400px;margin:0 auto;display:flex;align-items:center;justify-content:space-between;height:64px;}
  .nav-leftb{display:flex;align-items:center;gap:20px;}
  .hamburgerb{display:flex;flex-direction:column;gap:5px;cursor:pointer;padding:4px;}
  .hamburgerb span{display:block;width:22px;height:1.5px;background:${C.text};}
  .logob{font-family:'Cormorant Garamond',serif;font-style:italic;font-size:28px;font-weight:600;color:${C.text};letter-spacing:-.5px;}
  .nav-linksb{display:flex;align-items:center;gap:28px;list-style:none;}
  .nav-linksb a{font-size:11px;font-weight:500;letter-spacing:.12em;text-transform:uppercase;color:${C.text};transition:color .2s;}
  .nav-linksb a:hover{color:${C.olive};}
  .nav-rightb{display:flex;align-items:center;gap:16px;color:${C.text};}
  .nav-iconb{display:flex;align-items:center;justify-content:center;width:36px;height:36px;border-radius:50%;transition:background .2s;position:relative;cursor:pointer;}
  .nav-iconb:hover{background:${C.oliveLight};}
  .cart-badgeb{position:absolute;top:-2px;right:-2px;width:16px;height:16px;border-radius:50%;background:${C.olive};color:#fff;font-size:10px;font-weight:700;display:flex;align-items:center;justify-content:center;line-height:1;}

  /* ── ANNOUNCEMENT BAR ── */
  .announce-barb{background:${C.olive};color:#fff;padding:10px 0;overflow:hidden;position:relative;}
  .announce-trackb{display:flex;white-space:nowrap;animation:marqueeb 30s linear infinite;}
  .announce-itemb{font-size:12px;font-weight:500;letter-spacing:.1em;text-transform:uppercase;padding:0 48px;}
  .announce-sepb{opacity:.6;margin:0 4px;}

  /* ── HERO ── */
  .herob{background:${C.bg};padding:80px 40px;max-width:1400px;margin:0 auto;display:grid;grid-template-columns:1fr 1fr;gap:80px;align-items:center;}
  .hero-textb{display:flex;flex-direction:column;gap:24px;}
  .hero-badgeb{display:inline-flex;align-items:center;gap:8px;font-size:11px;font-weight:600;letter-spacing:.18em;text-transform:uppercase;color:${C.olive};}
  .hero-badgeb::before{content:'';display:block;width:28px;height:1.5px;background:${C.olive};}
  .hero-h1b{font-family:'Cormorant Garamond',serif;font-size:clamp(44px,5vw,72px);font-weight:700;line-height:1.05;color:${C.text};letter-spacing:-.02em;}
  .hero-subtitleb{font-size:15px;line-height:1.7;color:${C.muted};max-width:400px;}
  .hero-ctab{display:inline-flex;align-items:center;gap:10px;border:1.5px solid ${C.text};padding:14px 28px;font-size:12px;font-weight:600;letter-spacing:.14em;text-transform:uppercase;color:${C.text};transition:background .25s,color .25s;align-self:flex-start;}
  .hero-ctab:hover{background:${C.text};color:#fff;}
  .hero-imgb{position:relative;display:flex;justify-content:center;align-items:center;}
  .hero-img-wrapb{width:100%;max-width:520px;aspect-ratio:4/5;border-radius:40% 60% 60% 40% / 55% 45% 55% 45%;overflow:hidden;position:relative;}
  .hero-img-wrapb img{width:100%;height:100%;object-fit:cover;object-position:center top;}
  .hero-img-wrapb::after{content:'';position:absolute;inset:0;background:linear-gradient(180deg,transparent 60%,rgba(122,140,110,.12));border-radius:inherit;}
  .hero-floatb{position:absolute;bottom:32px;left:-24px;background:${C.bg};border:1px solid ${C.border};padding:14px 20px;border-radius:12px;box-shadow:0 8px 32px rgba(0,0,0,.08);}
  .hero-float-numbb{font-family:'Cormorant Garamond',serif;font-size:28px;font-weight:700;color:${C.olive};line-height:1;}
  .hero-float-labelb{font-size:10px;font-weight:500;letter-spacing:.1em;text-transform:uppercase;color:${C.muted};margin-top:2px;}

  /* ── STATS BAR ── */
  .stats-barb{border-top:1px solid ${C.border};border-bottom:1px solid ${C.border};padding:20px 40px;}
  .stats-innerb{max-width:1400px;margin:0 auto;display:flex;align-items:center;justify-content:center;gap:0;}
  .statb{display:flex;align-items:center;gap:12px;padding:0 48px;}
  .statb:not(:last-child){border-right:1px solid ${C.border};}
  .stat-numbb{font-family:'Cormorant Garamond',serif;font-size:22px;font-weight:700;color:${C.text};}
  .stat-labelb{font-size:12px;color:${C.muted};font-weight:400;}

  /* ── CATEGORIES ── */
  .categoriesb{padding:80px 40px;background:${C.bg};}
  .section-headerb{max-width:1400px;margin:0 auto 40px;display:flex;align-items:flex-end;justify-content:space-between;}
  .section-tagsb{display:flex;flex-direction:column;gap:8px;}
  .section-overlineb{font-size:11px;font-weight:600;letter-spacing:.18em;text-transform:uppercase;color:${C.olive};}
  .section-titleb{font-family:'Cormorant Garamond',serif;font-size:clamp(28px,3vw,40px);font-weight:700;color:${C.text};line-height:1.1;}
  .section-linkb{font-size:12px;font-weight:600;letter-spacing:.12em;text-transform:uppercase;color:${C.text};border-bottom:1.5px solid ${C.text};padding-bottom:2px;transition:color .2s,border-color .2s;white-space:nowrap;margin-bottom:4px;}
  .section-linkb:hover{color:${C.olive};border-color:${C.olive};}
  .cat-gridb{max-width:1400px;margin:0 auto;display:grid;grid-template-columns:repeat(5,1fr);gap:20px;}
  .cat-cardb{display:flex;flex-direction:column;align-items:center;gap:16px;padding:28px 16px;border-radius:16px;border:1px solid ${C.border};background:${C.bg};cursor:pointer;transition:transform .25s,box-shadow .25s;}
  .cat-cardb:hover{transform:translateY(-4px);box-shadow:0 12px 40px rgba(122,140,110,.15);}
  .cat-imgb{width:100px;height:100px;border-radius:50%;object-fit:cover;border:2px solid ${C.oliveLight};}
  .cat-nameb{font-size:13px;font-weight:600;color:${C.text};text-align:center;letter-spacing:.03em;}
  .cat-countb{font-size:11px;color:${C.muted};}

  /* ── BRAND STATEMENT ── */
  .brand-stmtb{background:${C.bgLight};padding:80px 40px;text-align:center;}
  .brand-stmt-innerb{max-width:820px;margin:0 auto;display:flex;flex-direction:column;gap:20px;}
  .brand-quoteb{font-family:'Cormorant Garamond',serif;font-style:italic;font-size:clamp(22px,2.8vw,30px);line-height:1.6;color:${C.text};font-weight:400;}
  .brand-quote-subbb{font-size:14px;color:${C.muted};line-height:1.7;}

  /* ── PRODUCTS + SALE BANNER ── */
  .products-sectionb{padding:80px 40px;background:${C.bg};}
  .products-innerb{max-width:1400px;margin:0 auto;display:grid;grid-template-columns:2fr 1fr;gap:40px;align-items:start;}
  .products-colb{display:flex;flex-direction:column;gap:28px;}
  .products-gridb{display:grid;grid-template-columns:repeat(3,1fr);gap:20px;}
  .pcardb{background:${C.bg};border:1px solid ${C.border};border-radius:12px;overflow:hidden;position:relative;transition:box-shadow .25s;}
  .pcardb:hover{box-shadow:0 8px 32px rgba(0,0,0,.09);}
  .pcard-imgwrapb{position:relative;aspect-ratio:1;overflow:hidden;background:${C.bgLight};}
  .pcard-imgwrapb img{width:100%;height:100%;object-fit:cover;transition:transform .4s;}
  .pcardb:hover .pcard-imgwrapb img{transform:scale(1.05);}
  .pcard-badgeb{position:absolute;top:10px;left:10px;background:${C.olive};color:#fff;font-size:9px;font-weight:700;letter-spacing:.1em;padding:3px 8px;border-radius:20px;text-transform:uppercase;}
  .pcard-bodyb{padding:16px;}
  .pcard-nameb{font-size:13px;font-weight:500;color:${C.text};line-height:1.4;margin-bottom:8px;}
  .pcard-priceb{display:flex;align-items:center;gap:8px;margin-bottom:6px;}
  .pcard-price-currentb{font-size:15px;font-weight:700;color:${C.text};}
  .pcard-price-origb{font-size:13px;color:${C.muted};text-decoration:line-through;}
  .pcard-ratingb{display:flex;align-items:center;gap:6px;font-size:11px;color:${C.muted};}
  .pcard-atcb{position:absolute;bottom:0;left:0;right:0;background:${C.text};color:#fff;padding:12px;text-align:center;font-size:11px;font-weight:600;letter-spacing:.1em;text-transform:uppercase;transform:translateY(100%);transition:transform .25s;}
  .pcardb:hover .pcard-atcb{transform:translateY(0);}

  /* ── SALE BANNER ── */
  .sale-bannerb{background:${C.olive};border-radius:16px;padding:40px 28px;display:flex;flex-direction:column;gap:20px;position:relative;overflow:hidden;}
  .sale-bannerb::before{content:'';position:absolute;top:-60px;right:-60px;width:200px;height:200px;border-radius:50%;background:rgba(255,255,255,.06);}
  .sale-bannerb::after{content:'';position:absolute;bottom:-40px;left:-40px;width:160px;height:160px;border-radius:50%;background:rgba(255,255,255,.04);}
  .sale-bigb{font-family:'Cormorant Garamond',serif;font-size:clamp(56px,6vw,84px);font-weight:700;color:#fff;line-height:.9;letter-spacing:-.02em;position:relative;z-index:1;}
  .sale-sublabelb{font-size:13px;font-weight:500;color:rgba(255,255,255,.8);letter-spacing:.1em;text-transform:uppercase;position:relative;z-index:1;}
  .sale-timerb{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;position:relative;z-index:1;}
  .timer-unitb{background:rgba(255,255,255,.15);border-radius:8px;padding:10px 6px;text-align:center;backdrop-filter:blur(4px);}
  .timer-numbb{font-family:'Cormorant Garamond',serif;font-size:26px;font-weight:700;color:#fff;line-height:1;display:block;}
  .timer-labelb{font-size:8px;font-weight:600;letter-spacing:.12em;text-transform:uppercase;color:rgba(255,255,255,.7);margin-top:2px;display:block;}
  .sale-imgb{width:100%;aspect-ratio:1;border-radius:12px;object-fit:cover;position:relative;z-index:1;}
  .sale-ctab{display:block;background:#fff;color:${C.olive};text-align:center;padding:13px;border-radius:8px;font-size:11px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;transition:opacity .2s;position:relative;z-index:1;}
  .sale-ctab:hover{opacity:.92;}

  /* ── BEST SELLERS ── */
  .bestsellersb{padding:80px 40px;background:${C.bgLight};}
  .bs-innerb{max-width:1400px;margin:0 auto;}
  .bs-tabsb{display:flex;align-items:center;gap:4px;margin-bottom:32px;background:${C.bg};border:1px solid ${C.border};border-radius:8px;padding:4px;width:fit-content;}
  .bs-tabb{padding:8px 20px;border-radius:6px;font-size:12px;font-weight:600;letter-spacing:.08em;text-transform:uppercase;color:${C.muted};cursor:pointer;transition:background .2s,color .2s;border:none;background:transparent;}
  .bs-tabb.activebb{background:${C.olive};color:#fff;}
  .bs-gridb{display:grid;grid-template-columns:repeat(4,1fr);gap:20px;}
  .bscardb{background:${C.bg};border-radius:12px;overflow:hidden;position:relative;transition:box-shadow .25s;}
  .bscardb:hover{box-shadow:0 8px 32px rgba(0,0,0,.09);}
  .bscard-imgwrapb{position:relative;aspect-ratio:3/4;overflow:hidden;background:${C.bgLight};}
  .bscard-imgwrapb img{width:100%;height:100%;object-fit:cover;transition:transform .4s;}
  .bscardb:hover .bscard-imgwrapb img{transform:scale(1.04);}
  .bscard-badgeb{position:absolute;top:10px;left:10px;background:${C.olive};color:#fff;font-size:9px;font-weight:700;letter-spacing:.1em;padding:3px 8px;border-radius:20px;text-transform:uppercase;}
  .bscard-wishlistb{position:absolute;top:10px;right:10px;width:32px;height:32px;border-radius:50%;background:rgba(255,255,255,.9);display:flex;align-items:center;justify-content:center;cursor:pointer;transition:background .2s;color:${C.muted};}
  .bscard-wishlistb:hover{background:#fff;color:${C.olive};}
  .bscard-bodyb{padding:16px;}
  .bscard-nameb{font-size:13px;font-weight:500;color:${C.text};margin-bottom:8px;line-height:1.4;}
  .bscard-priceb{display:flex;align-items:center;gap:8px;margin-bottom:6px;}
  .bscard-price-currentb{font-size:15px;font-weight:700;color:${C.text};}
  .bscard-price-origb{font-size:12px;color:${C.muted};text-decoration:line-through;}
  .bscard-ratingb{display:flex;align-items:center;gap:5px;font-size:11px;color:${C.muted};}

  /* ── MARQUEE PRODUITS ── */
  .product-marqueeb{background:${C.oliveLight};padding:32px 0;overflow:hidden;}
  .pm-trackb{display:flex;white-space:nowrap;animation:marquee-reverseb 25s linear infinite;gap:0;}
  .pm-itemb{display:inline-flex;align-items:center;gap:16px;padding:0 40px;}
  .pm-imgb{width:56px;height:56px;border-radius:8px;object-fit:cover;flex-shrink:0;}
  .pm-nameb{font-size:13px;font-weight:500;color:${C.oliveDark};letter-spacing:.04em;}
  .pm-dotb{width:4px;height:4px;border-radius:50%;background:${C.olive};flex-shrink:0;}

  /* ── TESTIMONIALS ── */
  .testimonialsb{padding:80px 40px;background:${C.bg};}
  .testi-innerb{max-width:1400px;margin:0 auto;}
  .testi-ratingb{display:flex;align-items:center;gap:12px;margin-bottom:8px;}
  .testi-avg-scoreb{font-family:'Cormorant Garamond',serif;font-size:20px;font-weight:700;color:${C.text};}
  .testi-avg-labelb{font-size:12px;color:${C.muted};}
  .testi-gridb{display:grid;grid-template-columns:repeat(3,1fr);gap:24px;margin-top:40px;}
  .tcardb{background:${C.bgLight};border-radius:16px;padding:28px;display:flex;flex-direction:column;gap:16px;}
  .tcard-starb{display:flex;gap:2px;}
  .tcard-quoteb{font-size:14px;line-height:1.75;color:${C.text};font-style:italic;}
  .tcard-authorb{display:flex;align-items:center;gap:12px;margin-top:auto;}
  .tcard-nameb{font-size:13px;font-weight:600;color:${C.text};}
  .tcard-verifiedb{font-size:11px;color:${C.olive};}

  /* ── NEWSLETTER ── */
  .newsletterb{background:${C.olive};padding:80px 40px;text-align:center;}
  .nl-innerb{max-width:560px;margin:0 auto;display:flex;flex-direction:column;gap:20px;align-items:center;}
  .nl-titleb{font-family:'Cormorant Garamond',serif;font-size:clamp(28px,3vw,40px);font-weight:700;color:#fff;line-height:1.15;}
  .nl-subtitleb{font-size:14px;color:rgba(255,255,255,.8);line-height:1.6;}
  .nl-formb{display:flex;width:100%;max-width:420px;gap:0;border-radius:8px;overflow:hidden;border:1px solid rgba(255,255,255,.3);}
  .nl-inputb{flex:1;padding:14px 18px;background:rgba(255,255,255,.15);border:none;outline:none;font-size:14px;color:#fff;font-family:'Inter',sans-serif;}
  .nl-inputb::placeholder{color:rgba(255,255,255,.6);}
  .nl-btnb{padding:14px 24px;background:#fff;color:${C.olive};border:none;font-size:12px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;cursor:pointer;transition:opacity .2s;white-space:nowrap;}
  .nl-btnb:hover{opacity:.92;}
  .nl-noteb{font-size:11px;color:rgba(255,255,255,.6);}

  /* ── FOOTER ── */
  .footerb{background:${C.footer};padding:60px 40px 32px;color:rgba(255,255,255,.7);}
  .footer-gridbb{max-width:1400px;margin:0 auto;display:grid;grid-template-columns:2fr 1fr 1fr 1.5fr;gap:48px;padding-bottom:48px;border-bottom:1px solid rgba(255,255,255,.1);}
  .footer-logob{font-family:'Cormorant Garamond',serif;font-style:italic;font-size:32px;font-weight:600;color:#fff;margin-bottom:12px;}
  .footer-taglineb{font-size:13px;line-height:1.7;color:rgba(255,255,255,.55);margin-bottom:20px;max-width:240px;}
  .footer-socialsb{display:flex;gap:12px;}
  .footer-social-iconb{width:36px;height:36px;border-radius:50%;border:1px solid rgba(255,255,255,.2);display:flex;align-items:center;justify-content:center;color:rgba(255,255,255,.7);transition:border-color .2s,color .2s;cursor:pointer;}
  .footer-social-iconb:hover{border-color:${C.olive};color:${C.olive};}
  .footer-col-titleb{font-size:12px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:#fff;margin-bottom:20px;}
  .footer-linksb{list-style:none;display:flex;flex-direction:column;gap:10px;}
  .footer-linksb a{font-size:13px;color:rgba(255,255,255,.55);transition:color .2s;}
  .footer-linksb a:hover{color:#fff;}
  .footer-contact-itemb{display:flex;align-items:flex-start;gap:10px;font-size:13px;color:rgba(255,255,255,.55);margin-bottom:12px;line-height:1.5;}
  .footer-copyrightb{max-width:1400px;margin:24px auto 0;text-align:center;font-size:12px;color:rgba(255,255,255,.3);}

  /* ── RESPONSIVE ── */
  @media(max-width:1024px){
    .nav-linksb{display:none;}
    .cat-gridb{grid-template-columns:repeat(3,1fr);}
    .bs-gridb{grid-template-columns:repeat(2,1fr);}
    .footer-gridbb{grid-template-columns:1fr 1fr;}
  }
  @media(max-width:768px){
    .navb{padding:0 20px;}
    .herob{padding:48px 20px;grid-template-columns:1fr;gap:40px;}
    .hero-img-wrapb{max-width:380px;margin:0 auto;}
    .hero-floatb{display:none;}
    .stats-barb{padding:20px;}
    .stats-innerb{gap:0;flex-wrap:wrap;}
    .statb{padding:12px 20px;width:50%;border-right:none !important;border-bottom:1px solid ${C.border};}
    .categoriesb,.products-sectionb,.bestsellersb,.testimonialsb,.newsletterb{padding:56px 20px;}
    .cat-gridb{grid-template-columns:repeat(2,1fr);}
    .products-innerb{grid-template-columns:1fr;}
    .products-gridb{grid-template-columns:repeat(2,1fr);}
    .bs-gridb{grid-template-columns:repeat(2,1fr);}
    .testi-gridb{grid-template-columns:1fr;}
    .footer-gridbb{grid-template-columns:1fr;gap:32px;padding:0 20px 40px;}
    .footerb{padding:40px 20px 24px;}
    .sale-timerb{grid-template-columns:repeat(4,1fr);}
  }
  @media(max-width:480px){
    .products-gridb{grid-template-columns:1fr;}
    .bs-gridb{grid-template-columns:1fr;}
    .cat-gridb{grid-template-columns:repeat(2,1fr);}
  }
</style>
</head>
<body>

<!-- ══════════════════════════════════════════════════════════ -->
<!-- 1. ANNOUNCEMENT BAR                                        -->
<!-- ══════════════════════════════════════════════════════════ -->
<div class="announce-barb" role="marquee" aria-live="off">
  <div class="announce-trackb">
    <span class="announce-itemb">${_('ann_sale')} ${savePct}% ${_('ann_off')}<span class="announce-sepb"> ✦</span></span>
    <span class="announce-itemb">${_('ann_shipping')}<span class="announce-sepb"> ✦</span></span>
    <span class="announce-itemb">${_('ann_limited')}<span class="announce-sepb"> ✦</span></span>
    <span class="announce-itemb">${_('ann_opening')}<span class="announce-sepb"> ✦</span></span>
    <span class="announce-itemb">${_('ann_sale')} ${savePct}% ${_('ann_off')}<span class="announce-sepb"> ✦</span></span>
    <span class="announce-itemb">${_('ann_shipping')}<span class="announce-sepb"> ✦</span></span>
    <span class="announce-itemb">${_('ann_limited')}<span class="announce-sepb"> ✦</span></span>
    <span class="announce-itemb">${_('ann_opening')}<span class="announce-sepb"> ✦</span></span>
  </div>
</div>

<!-- ══════════════════════════════════════════════════════════ -->
<!-- 2. NAVBAR                                                   -->
<!-- ══════════════════════════════════════════════════════════ -->
<header class="navb" role="banner">
  <div class="nav-innerb">
    <!-- Left -->
    <div class="nav-leftb">
      <div class="hamburgerb" aria-label="${_('aria_menu')}" role="button" tabindex="0">
        <span></span><span></span><span></span>
      </div>
      <a href="javascript:void(0)" onclick="event.preventDefault()" class="logob" aria-label="${productName} home">${productName}</a>
    </div>
    <!-- Center nav -->
    <nav aria-label="${_('aria_main_nav')}">
      <ul class="nav-linksb">
        <li><a href="javascript:void(0)" onclick="event.preventDefault()">${_('nav_home')}</a></li>
        <li><a href="javascript:void(0)" onclick="event.preventDefault()">${_('nav_shop')}</a></li>
        <li><a href="javascript:void(0)" onclick="event.preventDefault()">${_('nav_pages')}</a></li>
        <li><a href="javascript:void(0)" onclick="event.preventDefault()">${_('nav_features')}</a></li>
        <li><a href="javascript:void(0)" onclick="event.preventDefault()">${_('nav_blog')}</a></li>
        <li><a href="javascript:void(0)" onclick="event.preventDefault()">${_('nav_contact')}</a></li>
      </ul>
    </nav>
    <!-- Right icons -->
    <div class="nav-rightb">
      <button class="nav-iconb" aria-label="${_('aria_search')}">${ICON_SEARCH}</button>
      <button class="nav-iconb" aria-label="${_('aria_wishlist')}">${ICON_HEART}</button>
      <button class="nav-iconb" aria-label="${_('aria_account')}">${ICON_USER}</button>
      <button class="nav-iconb" aria-label="${_('aria_cart')}" style="position:relative;">
        ${ICON_CART}
        <span class="cart-badgeb" aria-hidden="true">2</span>
      </button>
    </div>
  </div>
</header>

<!-- ══════════════════════════════════════════════════════════ -->
<!-- 3. HERO SECTION                                             -->
<!-- ══════════════════════════════════════════════════════════ -->
<section class="herob" aria-label="Hero">
  <div class="hero-textb">
    <span class="hero-badgeb">${data.hero_badges?.[0] || productName.split(' ')[0]}</span>
    <h1 class="hero-h1b">${data.headline || _('hero_fallback_headline')}</h1>
    <p class="hero-subtitleb">${data.subtitle || _('hero_fallback_subtitle')}</p>
    <a href="javascript:void(0)" onclick="event.preventDefault()" class="hero-ctab">${data.cta || _('hero_fallback_cta')} &rarr;</a>
  </div>
  <div class="hero-imgb">
    <div class="hero-img-wrapb">
      <img src="${heroImg}" alt="${productName} hero model" loading="eager" width="520" height="650"/>
    </div>
    <div class="hero-floatb" aria-hidden="true">
      <div class="hero-float-numbb">50K+</div>
      <div class="hero-float-labelb">${_('hero_happy_clients')}</div>
    </div>
  </div>
</section>

<!-- ══════════════════════════════════════════════════════════ -->
<!-- 4. STATS BAR                                                -->
<!-- ══════════════════════════════════════════════════════════ -->
<div class="stats-barb" aria-label="Key stats">
  <div class="stats-innerb">
    <div class="statb">
      <span class="stat-numbb">2500+</span>
      <span class="stat-labelb">${_('stat_products')}</span>
    </div>
    <div class="statb">
      <span class="stat-numbb">100%</span>
      <span class="stat-labelb">${_('stat_natural')}</span>
    </div>
    <div class="statb">
      <span class="stat-numbb">50K+</span>
      <span class="stat-labelb">${_('stat_clients')}</span>
    </div>
  </div>
</div>

<!-- ══════════════════════════════════════════════════════════ -->
<!-- 5. SHOP BY CATEGORIES                                       -->
<!-- ══════════════════════════════════════════════════════════ -->
<section class="categoriesb" aria-label="${_('cat_title')}">
  <div class="section-headerb">
    <div class="section-tagsb">
      <span class="section-overlineb">${_('cat_overline')}</span>
      <h2 class="section-titleb">${_('cat_title')}</h2>
    </div>
    <a href="javascript:void(0)" onclick="event.preventDefault()" class="section-linkb">${_('cat_all_link')} &rarr;</a>
  </div>
  <div class="cat-gridb">
    ${(data.features?.slice(0,5).map((f, i) => ({ name: f.title, count: [48,32,75,29,41][i] ?? 0 })) || [
      { name: _('cat_name_0'), count: 48 },
      { name: _('cat_name_1'), count: 32 },
      { name: _('cat_name_2'), count: 75 },
      { name: _('cat_name_3'), count: 29 },
      { name: _('cat_name_4'), count: 41 },
    ]).map((cat, i) => `
    <div class="cat-cardb" role="button" tabindex="0" aria-label="${cat.name}">
      <img class="cat-imgb" src="${catImg(i)}" alt="${cat.name}" loading="lazy" width="100" height="100"/>
      <span class="cat-nameb">${cat.name}</span>
      <span class="cat-countb">${cat.count} ${_('cat_products')}</span>
    </div>`).join('')}
  </div>
</section>

<!-- ══════════════════════════════════════════════════════════ -->
<!-- 6. BRAND STATEMENT                                          -->
<!-- ══════════════════════════════════════════════════════════ -->
<section class="brand-stmtb" aria-label="Brand statement">
  <div class="brand-stmt-innerb">
    <p class="brand-quoteb">
      &ldquo;${productName} — ${data.subtitle || 'Premium quality, proven results. Designed for those who demand the best.'}&rdquo;
    </p>
    <p class="brand-quote-subbb">${data.subtitle || 'Premium formulas, visible results. Designed for every skin type.'}</p>
  </div>
</section>

<!-- ══════════════════════════════════════════════════════════ -->
<!-- 7. FEATURED PRODUCTS + SALE BANNER                         -->
<!-- ══════════════════════════════════════════════════════════ -->
<section class="products-sectionb" aria-label="Featured products">
  <div class="products-innerb">
    <!-- Left: products grid -->
    <div class="products-colb">
      <div class="section-headerb" style="margin-bottom:0;">
        <div class="section-tagsb">
          <h2 class="section-titleb">${_('products_title')}</h2>
        </div>
        <a href="javascript:void(0)" onclick="event.preventDefault()" class="section-linkb">${_('products_all')} &rarr;</a>
      </div>
      <div class="products-gridb">
        ${productCards.map(p => `
        <article class="pcardb">
          <div class="pcard-imgwrapb">
            <img src="${p.img}" alt="${p.name}" loading="lazy" width="300" height="300"/>
            ${p.badge ? `<span class="pcard-badgeb">${p.badge}</span>` : ''}
          </div>
          <div class="pcard-bodyb">
            <p class="pcard-nameb">${p.name}</p>
            <div class="pcard-priceb">
              <span class="pcard-price-currentb">$${p.price}</span>
              ${p.orig ? `<span class="pcard-price-origb">$${p.orig}</span>` : ''}
            </div>
            <div class="pcard-ratingb">
              ${starsHtml(Math.floor(p.rating))}
              <span>${p.rating} (${p.reviews})</span>
            </div>
          </div>
          <button class="pcard-atcb" aria-label="${_('add_to_cart')} ${p.name}">${_('add_to_cart')}</button>
        </article>`).join('')}
      </div>
    </div>
    <!-- Right: sale banner -->
    <aside class="sale-bannerb" aria-label="Sale promotion">
      <div class="sale-bigb">${savePct}%<br/>SALE!</div>
      <p class="sale-sublabelb">${_('sale_offer')}</p>
      <div class="sale-timerb" id="countdown-blusho" aria-live="polite">
        <div class="timer-unitb"><span class="timer-numbb" id="cddb-d">00</span><span class="timer-labelb">${_('sale_days')}</span></div>
        <div class="timer-unitb"><span class="timer-numbb" id="cddb-h">00</span><span class="timer-labelb">${_('sale_hrs')}</span></div>
        <div class="timer-unitb"><span class="timer-numbb" id="cddb-m">00</span><span class="timer-labelb">${_('sale_mns')}</span></div>
        <div class="timer-unitb"><span class="timer-numbb" id="cddb-s">00</span><span class="timer-labelb">${_('sale_secs')}</span></div>
      </div>
      <img class="sale-imgb" src="${imgs[2]}" alt="${productName}" loading="lazy" width="320" height="320"/>
      <a href="javascript:void(0)" onclick="event.preventDefault()" class="sale-ctab">${_('sale_shop')} &rarr;</a>
    </aside>
  </div>
</section>

<!-- ══════════════════════════════════════════════════════════ -->
<!-- 8. BEST SELLERS                                             -->
<!-- ══════════════════════════════════════════════════════════ -->
<section class="bestsellersb" aria-label="Best sellers">
  <div class="bs-innerb">
    <div class="section-headerb" style="margin-bottom:24px;">
      <div class="section-tagsb">
        <span class="section-overlineb">${_('bs_overline')}</span>
        <h2 class="section-titleb">${_('bs_title')}</h2>
      </div>
    </div>
    <!-- Tabs -->
    <div class="bs-tabsb" role="tablist" aria-label="${_('cat_title')}">
      <button class="bs-tabb activebb" role="tab" aria-selected="true"  onclick="bsTabs(this,'all')">${_('bs_tab_all')}</button>
      <button class="bs-tabb"          role="tab" aria-selected="false" onclick="bsTabs(this,'new')">${_('bs_tab_new')}</button>
      <button class="bs-tabb"          role="tab" aria-selected="false" onclick="bsTabs(this,'sale')">${_('bs_tab_sale')}</button>
      <button class="bs-tabb"          role="tab" aria-selected="false" onclick="bsTabs(this,'top')">${_('bs_tab_top')}</button>
    </div>
    <div class="bs-gridb">
      ${productCards.slice(0, 4).map((p, i) => `
      <article class="bscardb" data-cat="${['all','skincare','makeup','hair'][i % 4]}">
        <div class="bscard-imgwrapb">
          <img src="${p.img}" alt="${p.name}" loading="lazy" width="320" height="426"/>
          ${p.badge ? `<span class="bscard-badgeb">${p.badge}</span>` : ''}
          <button class="bscard-wishlistb" aria-label="${_('bs_add_wishlist')} ${p.name}">${ICON_HEART}</button>
        </div>
        <div class="bscard-bodyb">
          <p class="bscard-nameb">${p.name}</p>
          <div class="bscard-priceb">
            <span class="bscard-price-currentb">$${p.price}</span>
            ${p.orig ? `<span class="bscard-price-origb">$${p.orig}</span>` : ''}
          </div>
          <div class="bscard-ratingb">
            ${starsHtml(Math.floor(p.rating))}
            <span>${p.reviews} ${_('bs_reviews')}</span>
          </div>
        </div>
      </article>`).join('')}
    </div>
  </div>
</section>

<!-- ══════════════════════════════════════════════════════════ -->
<!-- 9. MARQUEE PRODUITS DÉFILANTS                              -->
<!-- ══════════════════════════════════════════════════════════ -->
<div class="product-marqueeb" aria-hidden="true">
  <div class="pm-trackb">
    ${[...productCards, ...productCards].map(p => `
    <span class="pm-itemb">
      <img class="pm-imgb" src="${p.img}" alt="${p.name}" loading="lazy" width="56" height="56"/>
      <span class="pm-nameb">${p.name}</span>
      <span class="pm-dotb"></span>
    </span>`).join('')}
  </div>
</div>

<!-- ══════════════════════════════════════════════════════════ -->
<!-- 10. TESTIMONIALS                                            -->
<!-- ══════════════════════════════════════════════════════════ -->
<section class="testimonialsb" aria-label="Customer reviews">
  <div class="testi-innerb">
    <div class="section-headerb">
      <div class="section-tagsb">
        <span class="section-overlineb">${_('testi_overline')}</span>
        <h2 class="section-titleb">${_('testi_title')}</h2>
      </div>
      <div>
        <div class="testi-ratingb">
          ${starsHtml(5)}
          <span class="testi-avg-scoreb">4.9/5</span>
        </div>
        <span class="testi-avg-labelb">2,847 ${_('testi_avg_label')}</span>
      </div>
    </div>
    <div class="testi-gridb">
      ${testimonials.map(tItem => `
      <div class="tcardb">
        <div class="tcard-starb">${starsHtml(tItem.rating)}</div>
        <p class="tcard-quoteb">&ldquo;${tItem.quote}&rdquo;</p>
        <div class="tcard-authorb">
          ${avatarCircle(tItem.name, 40)}
          <div>
            <div class="tcard-nameb">${tItem.name}</div>
            <div class="tcard-verifiedb">&#10003; ${_('testi_verified')}</div>
          </div>
        </div>
      </div>`).join('')}
    </div>
  </div>
</section>

<!-- ══════════════════════════════════════════════════════════ -->
<!-- 11. NEWSLETTER                                              -->
<!-- ══════════════════════════════════════════════════════════ -->
<section class="newsletterb" aria-label="${_('nl_aria')}">
  <div class="nl-innerb">
    <h2 class="nl-titleb">${_('nl_title')}</h2>
    <p class="nl-subtitleb">${_('nl_subtitle')}</p>
    <form class="nl-formb" onsubmit="return false;" aria-label="${_('nl_aria')}">
      <input class="nl-inputb" type="email" placeholder="${_('nl_placeholder')}" aria-label="${_('nl_placeholder')}" autocomplete="email"/>
      <button class="nl-btnb" type="submit">${_('nl_btn')}</button>
    </form>
    <p class="nl-noteb">${_('nl_note')}</p>
  </div>
</section>

<!-- ══════════════════════════════════════════════════════════ -->
<!-- 12. FOOTER                                                  -->
<!-- ══════════════════════════════════════════════════════════ -->
<footer class="footerb" role="contentinfo">
  <div class="footer-gridbb">
    <!-- Col 1: Brand -->
    <div>
      <div class="footer-logob">${productName}</div>
      <p class="footer-taglineb">${data.subtitle || _('footer_tagline_fallback')}</p>
      <div class="footer-socialsb" aria-label="Social media links">
        <a href="javascript:void(0)" onclick="event.preventDefault()" class="footer-social-iconb" aria-label="Instagram">${ICON_INSTAGRAM}</a>
        <a href="javascript:void(0)" onclick="event.preventDefault()" class="footer-social-iconb" aria-label="TikTok">${ICON_TIKTOK}</a>
        <a href="javascript:void(0)" onclick="event.preventDefault()" class="footer-social-iconb" aria-label="Twitter">${ICON_TWITTER}</a>
        <a href="javascript:void(0)" onclick="event.preventDefault()" class="footer-social-iconb" aria-label="Facebook">${ICON_FACEBOOK}</a>
      </div>
    </div>
    <!-- Col 2: Quick Links -->
    <div>
      <p class="footer-col-titleb">${_('footer_quick_links')}</p>
      <ul class="footer-linksb">
        <li><a href="javascript:void(0)" onclick="event.preventDefault()">${_('footer_home')}</a></li>
        <li><a href="javascript:void(0)" onclick="event.preventDefault()">${_('footer_about')}</a></li>
        <li><a href="javascript:void(0)" onclick="event.preventDefault()">${_('footer_shop')}</a></li>
        <li><a href="javascript:void(0)" onclick="event.preventDefault()">${_('footer_blog')}</a></li>
        <li><a href="javascript:void(0)" onclick="event.preventDefault()">${_('footer_contact')}</a></li>
      </ul>
    </div>
    <!-- Col 3: Help -->
    <div>
      <p class="footer-col-titleb">${_('footer_help')}</p>
      <ul class="footer-linksb">
        <li><a href="javascript:void(0)" onclick="event.preventDefault()">${_('footer_faq')}</a></li>
        <li><a href="javascript:void(0)" onclick="event.preventDefault()">${_('footer_shipping')}</a></li>
        <li><a href="javascript:void(0)" onclick="event.preventDefault()">${_('footer_track')}</a></li>
        <li><a href="javascript:void(0)" onclick="event.preventDefault()">${_('footer_privacy')}</a></li>
        <li><a href="javascript:void(0)" onclick="event.preventDefault()">${_('footer_terms')}</a></li>
      </ul>
    </div>
    <!-- Col 4: Contact -->
    <div>
      <p class="footer-col-titleb">${_('footer_contact')}</p>
      <div style="margin-top:16px;display:flex;gap:8px;flex-wrap:wrap;">
        ${benefits.slice(0, 3).map(b => `<span style="background:rgba(255,255,255,.08);border-radius:20px;padding:4px 12px;font-size:11px;color:rgba(255,255,255,.6);">${b}</span>`).join('')}
      </div>
    </div>
  </div>
  <p class="footer-copyrightb">&copy; ${new Date().getFullYear()} ${productName}. ${_('footer_copyright')}</p>
</footer>

<!-- ══════════════════════════════════════════════════════════ -->
<!-- SCRIPTS                                                     -->
<!-- ══════════════════════════════════════════════════════════ -->
<script>
(function () {
  'use strict';

  // ── COUNTDOWN TIMER ──────────────────────────────────────
  var endDate = new Date();
  endDate.setDate(endDate.getDate() + 3);
  endDate.setHours(23, 59, 59, 0);

  function pad(n) { return String(n).padStart(2, '0'); }

  function updateCountdown() {
    var now  = new Date();
    var diff = endDate - now;
    if (diff <= 0) {
      document.getElementById('cddb-d').textContent = '00';
      document.getElementById('cddb-h').textContent = '00';
      document.getElementById('cddb-m').textContent = '00';
      document.getElementById('cddb-s').textContent = '00';
      return;
    }
    var days    = Math.floor(diff / 86400000);
    var hours   = Math.floor((diff % 86400000) / 3600000);
    var minutes = Math.floor((diff % 3600000)  / 60000);
    var seconds = Math.floor((diff % 60000)    / 1000);
    document.getElementById('cddb-d').textContent = pad(days);
    document.getElementById('cddb-h').textContent = pad(hours);
    document.getElementById('cddb-m').textContent = pad(minutes);
    document.getElementById('cddb-s').textContent = pad(seconds);
  }
  updateCountdown();
  setInterval(updateCountdown, 1000);

  // ── BEST SELLERS TABS ─────────────────────────────────────
  window.bsTabs = function (btn, cat) {
    var tabs = document.querySelectorAll('.bs-tabb');
    tabs.forEach(function (t) {
      t.classList.remove('activebb');
      t.setAttribute('aria-selected', 'false');
    });
    btn.classList.add('activebb');
    btn.setAttribute('aria-selected', 'true');
    var cards = document.querySelectorAll('.bscardb');
    cards.forEach(function (c) {
      var cardCat = c.getAttribute('data-cat');
      c.style.display = (cat === 'all' || cardCat === cat) ? 'block' : 'none';
    });
  };

})();
</script>

<!-- ═══ SECTIONS DYNAMIQUES (story / social_proof / comparison / testimonials / bonuses / guarantee) ═══ -->
${renderRichSections(data, BLUSHO_THEME)}

</body>
</html>`
}
