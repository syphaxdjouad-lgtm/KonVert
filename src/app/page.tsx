import Link from 'next/link'
import { Check, ArrowRight, Zap, MousePointerClick, BarChart2, Store, Users, Star } from 'lucide-react'

export default function Home() {
  return (
    <main className="bg-white text-gray-900 overflow-x-hidden">

      {/* ── NAV ─────────────────────────────────────────────────────────────── */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <span className="font-black text-xl tracking-tight">KON<span className="text-purple-600">VERT</span></span>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-500">
            <a href="#how" className="hover:text-gray-900 transition-colors">Comment ça marche</a>
            <a href="#pricing" className="hover:text-gray-900 transition-colors">Tarifs</a>
            <a href="#faq" className="hover:text-gray-900 transition-colors">FAQ</a>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm font-semibold text-gray-600 hover:text-gray-900 transition-colors">
              Connexion
            </Link>
            <Link href="/signup"
              className="bg-purple-600 hover:bg-purple-700 text-white text-sm font-bold px-4 py-2 rounded-xl transition-colors">
              Essai gratuit
            </Link>
          </div>
        </div>
      </nav>

      {/* ── HERO ────────────────────────────────────────────────────────────── */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-purple-50 border border-purple-200 rounded-full px-4 py-1.5 text-sm font-semibold text-purple-700 mb-8">
            <span className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" />
            Bêta ouverte — 50 pages offertes
          </div>

          <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-none mb-6">
            Colle une URL.<br />
            <span className="text-purple-600">Ta page est prête.</span>
          </h1>

          <p className="text-xl text-gray-500 max-w-2xl mx-auto mb-10 leading-relaxed">
            KONVERT génère des landing pages e-commerce haute conversion en 30 secondes.
            L'IA rédige le copy, choisit le design, et publie directement sur ton Shopify ou WooCommerce.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link href="/signup"
              className="inline-flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-bold px-8 py-4 rounded-2xl text-lg transition-colors shadow-lg shadow-purple-200">
              Générer ma première page <ArrowRight className="w-5 h-5" />
            </Link>
            <a href="#how"
              className="inline-flex items-center justify-center gap-2 border-2 border-gray-200 hover:border-gray-300 text-gray-700 font-bold px-8 py-4 rounded-2xl text-lg transition-colors">
              Voir comment ça marche
            </a>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-10 text-center">
            {[
              { value: '30s',    label: 'Pour générer une page' },
              { value: '5',      label: 'Templates premium' },
              { value: '2x',     label: 'Plus de conversions' },
              { value: '1-clic', label: 'Push sur Shopify' },
            ].map(s => (
              <div key={s.label}>
                <div className="text-3xl font-black text-gray-900">{s.value}</div>
                <div className="text-sm text-gray-400 mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── DEMO VISUELLE ───────────────────────────────────────────────────── */}
      <section className="px-6 pb-24">
        <div className="max-w-5xl mx-auto">
          <div className="bg-gray-900 rounded-3xl overflow-hidden shadow-2xl border border-gray-800">
            <div className="bg-gray-800 px-4 py-3 flex items-center gap-3">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 bg-red-500 rounded-full" />
                <div className="w-3 h-3 bg-yellow-500 rounded-full" />
                <div className="w-3 h-3 bg-green-500 rounded-full" />
              </div>
              <div className="flex-1 bg-gray-700 rounded-lg px-3 py-1 text-xs text-gray-400 text-center max-w-xs mx-auto">
                konvert.app/dashboard/new
              </div>
            </div>
            <div className="p-8 grid grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="text-xs font-bold text-gray-500 uppercase tracking-widest">URL du produit</div>
                <div className="bg-gray-800 rounded-xl p-3 text-sm text-green-400 font-mono">
                  aliexpress.com/item/123456789
                </div>
                <div className="text-xs font-bold text-gray-500 uppercase tracking-widest mt-2">Template</div>
                <div className="grid grid-cols-3 gap-2">
                  {['Dark', 'White', 'Bold'].map((t, i) => (
                    <div key={t} className={`rounded-lg p-2 text-xs font-bold text-center ${i === 0 ? 'bg-purple-600 text-white' : 'bg-gray-800 text-gray-500'}`}>
                      {t}
                    </div>
                  ))}
                </div>
                <div className="w-full bg-purple-600 rounded-xl py-3 text-sm font-bold text-white mt-2 flex items-center justify-center gap-2">
                  <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
                  Génération en cours...
                </div>
              </div>
              <div className="bg-gray-800 rounded-xl overflow-hidden">
                <div className="bg-gray-950 p-4">
                  <div className="text-xs text-purple-400 font-bold mb-2">IA génère en live →</div>
                  <div className="space-y-2">
                    {['✓ Titre accrocheur', '✓ 5 bénéfices clés', '✓ FAQ client', '✓ CTA optimisé', '✓ Design responsive'].map(item => (
                      <div key={item} className="text-xs text-green-400 font-mono">{item}</div>
                    ))}
                  </div>
                </div>
                <div className="p-3 text-center">
                  <div className="text-2xl font-black text-white">⚡ 28s</div>
                  <div className="text-xs text-gray-500 mt-1">Page générée</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── COMMENT ÇA MARCHE ───────────────────────────────────────────────── */}
      <section id="how" className="py-24 px-6 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-xs font-bold tracking-widest text-purple-600 uppercase">Simple comme bonjour</span>
            <h2 className="text-4xl font-black mt-2">3 étapes. C'est tout.</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                icon: <MousePointerClick className="w-6 h-6 text-purple-600" />,
                title: 'Colle une URL produit',
                desc: 'AliExpress, Amazon, Alibaba ou n\'importe quelle boutique. KONVERT extrait automatiquement le titre, les images et le prix.',
              },
              {
                step: '02',
                icon: <Zap className="w-6 h-6 text-purple-600" />,
                title: 'L\'IA génère le contenu',
                desc: 'Claude rédige un copy de vente optimisé : titre accrocheur, bénéfices, FAQ, urgence, CTA. Le tout en français parfait.',
              },
              {
                step: '03',
                icon: <Store className="w-6 h-6 text-purple-600" />,
                title: 'Publie en 1 clic',
                desc: 'Édite visuellement avec le builder drag & drop, puis publie directement sur ton Shopify ou WooCommerce.',
              },
            ].map(({ step, icon, title, desc }) => (
              <div key={step} className="bg-white rounded-2xl p-6 border border-gray-200 relative">
                <div className="text-5xl font-black text-gray-100 absolute top-4 right-5 select-none">{step}</div>
                <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center mb-4">{icon}</div>
                <h3 className="font-bold text-lg text-gray-900 mb-2">{title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ────────────────────────────────────────────────────────── */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black">Tout ce dont tu as besoin</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { icon: <Zap />,               title: 'Génération IA en 30s',     desc: 'Copy de vente professionnel généré par Claude (Anthropic)' },
              { icon: <MousePointerClick />, title: 'Builder drag & drop',      desc: 'Édite chaque élément visuellement sans toucher au code' },
              { icon: <Store />,             title: 'Shopify & WooCommerce',    desc: 'Publie en 1 clic sur ta boutique, la page est live instantanément' },
              { icon: <BarChart2 />,         title: 'Analytics intégrés',       desc: 'Vues, clics CTA, scroll depth — tout ce qu\'il faut pour optimiser' },
              { icon: <Users />,             title: 'Mode Agence',              desc: 'Workspaces clients, white-label et rapports PDF pour tes clients' },
              { icon: <Star />,              title: '5 templates premium',      desc: 'Minimal Dark, Clean White, Bold Sales, Luxury, Mobile First' },
            ].map(({ icon, title, desc }) => (
              <div key={title} className="border border-gray-200 rounded-2xl p-5 hover:border-purple-200 hover:bg-purple-50/30 transition-all group">
                <div className="w-10 h-10 bg-purple-100 group-hover:bg-purple-200 rounded-xl flex items-center justify-center mb-3 text-purple-600 transition-colors">
                  {icon}
                </div>
                <div className="font-bold text-gray-900 mb-1">{title}</div>
                <div className="text-sm text-gray-500">{desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TÉMOIGNAGES ─────────────────────────────────────────────────────── */}
      <section className="py-24 px-6 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black">Ils ont testé. Ils ne reviennent pas en arrière.</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                name: 'Mehdi B.', role: 'Dropshipper Shopify', avatar: 'MB',
                text: 'J\'ai testé 3 outils similaires. KONVERT est le seul qui génère un copy qui sonne vraiment français. Mes conversions ont grimpé de 40%.',
              },
              {
                name: 'Sarah L.', role: 'Agence e-commerce', avatar: 'SL',
                text: 'Le mode agence est une mine d\'or. Je gère 12 clients depuis un seul dashboard et j\'envoie un rapport PDF pro. Mes marges ont explosé.',
              },
              {
                name: 'Thomas R.', role: 'Boutique WooCommerce', avatar: 'TR',
                text: 'Je colle l\'URL du produit, je sélectionne le template, et la page est publiée directement sur mon site. Incroyable.',
              },
            ].map(({ name, role, avatar, text }) => (
              <div key={name} className="bg-white rounded-2xl border border-gray-200 p-6">
                <div className="flex text-yellow-400 mb-4">
                  {[1,2,3,4,5].map(i => <Star key={i} className="w-4 h-4 fill-yellow-400" />)}
                </div>
                <p className="text-gray-700 text-sm leading-relaxed mb-5">"{text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-purple-100 rounded-full flex items-center justify-center text-xs font-black text-purple-700">{avatar}</div>
                  <div>
                    <div className="font-bold text-gray-900 text-sm">{name}</div>
                    <div className="text-xs text-gray-400">{role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING ─────────────────────────────────────────────────────────── */}
      <section id="pricing" className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black">Tarifs simples. Aucune surprise.</h2>
            <p className="text-gray-500 mt-3">Annule à tout moment. Sans engagement.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { name: 'Starter', price: 29, popular: false, features: ['50 pages / mois', '2 stores connectés', '5 templates', 'Export HTML', 'Support email'] },
              { name: 'Pro',     price: 49, popular: true,  features: ['200 pages / mois', '5 stores connectés', 'Tous les templates', 'Analytics avancés', 'Support prioritaire'] },
              { name: 'Agency',  price: 119, popular: false, features: ['500 pages / mois', '15 stores connectés', 'Mode Agence complet', 'White-label', 'Rapports PDF clients', 'Support dédié'] },
            ].map(({ name, price, popular, features }) => (
              <div key={name} className={`rounded-2xl p-6 relative ${popular ? 'bg-purple-600 text-white ring-4 ring-purple-200' : 'bg-white border border-gray-200'}`}>
                {popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-white text-purple-700 text-xs font-black px-3 py-1 rounded-full border border-purple-200">
                    Le plus populaire
                  </div>
                )}
                <div className={`font-black text-lg mb-1 ${popular ? 'text-white' : 'text-gray-900'}`}>{name}</div>
                <div className="flex items-end gap-1 mb-6">
                  <span className={`text-4xl font-black ${popular ? 'text-white' : 'text-gray-900'}`}>{price}€</span>
                  <span className={`text-sm mb-1 ${popular ? 'text-purple-200' : 'text-gray-400'}`}>/mois</span>
                </div>
                <ul className="space-y-2.5 mb-6">
                  {features.map(f => (
                    <li key={f} className="flex items-center gap-2 text-sm">
                      <Check className={`w-4 h-4 flex-shrink-0 ${popular ? 'text-purple-200' : 'text-green-500'}`} />
                      <span className={popular ? 'text-purple-100' : 'text-gray-700'}>{f}</span>
                    </li>
                  ))}
                </ul>
                <Link href="/signup"
                  className={`block w-full text-center font-bold py-3 rounded-xl text-sm transition-colors ${popular ? 'bg-white text-purple-700 hover:bg-purple-50' : 'bg-gray-900 hover:bg-gray-800 text-white'}`}>
                  Commencer
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ─────────────────────────────────────────────────────────────── */}
      <section id="faq" className="py-24 px-6 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black">Questions fréquentes</h2>
          </div>
          <div className="space-y-4">
            {[
              { q: 'Ça fonctionne avec quel type de produits ?', a: 'KONVERT fonctionne avec tous les produits e-commerce : mode, électronique, beauté, sport, maison... Tant que tu as une URL produit ou une description, l\'IA peut générer une page.' },
              { q: 'Est-ce que le copy est en français ?', a: 'Oui, KONVERT génère du contenu 100% en français. Le modèle est spécialisé pour le copywriting e-commerce francophone.' },
              { q: 'Puis-je modifier le contenu généré ?', a: 'Absolument. Après génération, tu accèdes à un éditeur drag & drop complet pour modifier textes, couleurs, images et mise en page.' },
              { q: 'Comment fonctionne la connexion Shopify ?', a: 'Via OAuth officiel Shopify. Tu cliques sur "Connecter Shopify", tu autorises l\'accès, et KONVERT peut créer des pages dans ton store en 1 clic.' },
              { q: 'Puis-je annuler à tout moment ?', a: 'Oui, sans engagement ni frais. Tu annules depuis ton dashboard en quelques clics. Tu gardes accès jusqu\'à la fin de ta période facturée.' },
            ].map(({ q, a }) => (
              <details key={q} className="bg-white border border-gray-200 rounded-2xl p-5 group">
                <summary className="font-bold text-gray-900 cursor-pointer list-none flex items-center justify-between text-sm">
                  {q}
                  <span className="text-gray-400 group-open:rotate-45 transition-transform text-lg leading-none">+</span>
                </summary>
                <p className="text-gray-500 text-sm mt-3 leading-relaxed">{a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA FINAL ───────────────────────────────────────────────────────── */}
      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-5xl font-black tracking-tight mb-6">
            Ta prochaine page qui convertit<br />
            <span className="text-purple-600">est à 30 secondes.</span>
          </h2>
          <p className="text-gray-500 text-lg mb-10">
            Rejoins les e-commerçants qui génèrent des pages haute conversion sans designer ni copywriter.
          </p>
          <Link href="/signup"
            className="inline-flex items-center gap-3 bg-purple-600 hover:bg-purple-700 text-white font-black px-10 py-5 rounded-2xl text-lg transition-colors shadow-xl shadow-purple-200">
            Commencer gratuitement <ArrowRight className="w-5 h-5" />
          </Link>
          <p className="text-sm text-gray-400 mt-4">50 pages offertes · Aucune carte bancaire requise</p>
        </div>
      </section>

      {/* ── FOOTER ──────────────────────────────────────────────────────────── */}
      <footer className="border-t border-gray-100 py-10 px-6">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <span className="font-black text-lg">KON<span className="text-purple-600">VERT</span></span>
          <div className="flex gap-6 text-sm text-gray-400">
            <Link href="/pricing" className="hover:text-gray-700">Tarifs</Link>
            <Link href="/login" className="hover:text-gray-700">Connexion</Link>
            <Link href="/signup" className="hover:text-gray-700">Inscription</Link>
          </div>
          <span className="text-sm text-gray-400">© 2026 KONVERT</span>
        </div>
      </footer>

    </main>
  )
}
