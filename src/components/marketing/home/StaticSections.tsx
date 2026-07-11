import Link from 'next/link'
import Image from 'next/image'
import type { ReactNode } from 'react'
import { templateEtecBeauty, TEMPLATE_COUNT } from '@/lib/templates'
import Tooltip from '@/components/ui/Tooltip'
import BrandLogo from './BrandLogo'
import VideoDemoTrigger from './VideoDemoTrigger'
import {
  Robot,
  Palette,
  ChartBar,
  LinkSimple,
  Flask,
  Globe,
  ArrowRight,
  Star,
  Lightning,
  TrendUp,
  Sparkle,
  Check,
  File as FileText2,
  PencilSimple as Pencil2,
  Image as Image2,
  Gear as Settings2,
} from '@phosphor-icons/react/ssr'

/* ═══════════════════════════════════════════════════════════════════════════
   TRUST BAR — Logo marquee style
═══════════════════════════════════════════════════════════════════════════ */
const TRUST_BRANDS = [
  { name: 'Shopify',      style: { fontWeight: 700, fontSize: '18px' } },
  { name: 'WooCommerce',  style: { fontWeight: 700, fontSize: '16px' } },
  { name: 'Stripe',       style: { fontWeight: 700, fontSize: '20px', letterSpacing: '-0.5px' } },
  { name: 'AliExpress',   style: { fontWeight: 700, fontSize: '16px' } },
  { name: 'Klaviyo',      style: { fontWeight: 700, fontSize: '18px' } },
  { name: 'Zapier',       style: { fontWeight: 700, fontSize: '18px' } },
  { name: 'YouCan',       style: { fontWeight: 700, fontSize: '18px' } },
  { name: 'DeepSeek',     style: { fontWeight: 700, fontSize: '18px' } },
]

export function TrustBar() {
  const doubled = [...TRUST_BRANDS, ...TRUST_BRANDS]
  return (
    <section style={{ background: '#f0eeff', borderTop: '1px solid #e4daff', borderBottom: '1px solid #e4daff' }}>
      <div className="py-3">
        <p className="text-center text-xs font-semibold uppercase tracking-widest mb-5" style={{ color: '#b8aee8' }}>
          Intégrations natives disponibles dès J0
        </p>
        <div className="marquee-wrap">
          <div className="marquee-track">
            {doubled.map((brand, i) => (
              <span
                key={i}
                className="flex items-center gap-8 sm:gap-12 px-6 sm:px-10 flex-shrink-0"
                style={{ color: '#374151', ...brand.style }}
              >
                {brand.name}
                <span style={{ color: '#d1c7f5', fontSize: '20px', fontWeight: 300 }}>|</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
/* ═══════════════════════════════════════════════════════════════════════════
   PROOF SECTION
═══════════════════════════════════════════════════════════════════════════ */
const PROOF_STATS = [
  { value: '< 30s',              label: 'pour générer une page complète' },
  { value: `${TEMPLATE_COUNT}+`, label: 'templates optimisés conversion' },
  { value: '3',                  label: 'plateformes : Shopify, WooCommerce, YouCan' },
]

export function ProofSection() {
  return (
    <section
      style={{ background: 'linear-gradient(135deg, #f5f3ff 0%, #fdfbff 55%, #ede8ff 100%)' }}
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-14 sm:py-24">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-24 items-center">

          {/* Gauche — titre + description */}
          <div>
            <h2 className="reveal text-4xl sm:text-5xl lg:text-6xl font-black leading-[1.08] tracking-tight text-gray-900 mb-6">
              Conçu pour{' '}
              <span style={{ background: 'linear-gradient(135deg,#7c6af7,#a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                convertir.
              </span>
            </h2>
            <p className="reveal delay-1 text-lg text-gray-500 leading-relaxed max-w-lg">
              KONVERT génère des pages produit optimisées conversion en quelques secondes — scraping, copy IA, mise en forme. Tu publies directement sur ta boutique sans toucher au code.
            </p>
          </div>

          {/* Droite — 3 stats empilées */}
          <div className="flex flex-col">
            {PROOF_STATS.map((s, i) => (
              <div
                key={i}
                className="reveal py-8"
                style={{
                  transitionDelay: `${i * 0.15}s`,
                  borderTop: i > 0 ? '1px solid rgba(91,71,245,0.12)' : 'none',
                }}
              >
                <div
                  className="text-4xl sm:text-6xl lg:text-7xl font-black leading-none mb-2"
                  style={{ background: 'linear-gradient(135deg,#7c6af7,#a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
                >
                  {s.value}
                </div>
                <div className="text-gray-500 text-base font-medium">{s.label}</div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  )
}
/* ═══════════════════════════════════════════════════════════════════════════
   FEATURES
═══════════════════════════════════════════════════════════════════════════ */
const FEATURES = [
  {
    Icon: Robot,
    color: '#5B47F5',
    bg: 'rgba(91,71,245,0.08)',
    title: 'Page générée en 30 secondes',
    desc: 'Colle l\'URL du produit. L\'IA analyse, rédige le titre, les bénéfices, la FAQ et le CTA. Ta page est prête avant ton café.',
    tooltip: 'IA Claude génère titre, bénéfices, FAQ et CTA',
  },
  {
    Icon: Palette,
    color: '#f97316',
    bg: 'rgba(249,115,22,0.08)',
    title: `${TEMPLATE_COUNT}+ templates qui convertissent`,
    desc: 'Chaque template suit les tendances mondiales. Tech, Beauté, Luxe, Streetwear, Joaillerie, Maison — le bon design pour chaque niche.',
    tooltip: `${TEMPLATE_COUNT} designs optimisés par niche e-commerce`,
  },
  {
    Icon: ChartBar,
    color: '#10b981',
    bg: 'rgba(16,185,129,0.08)',
    title: 'Sais-tu ce qui bloque tes ventes ?',
    desc: 'Scroll depth, CVR, ROAS en temps réel. Tu vois exactement où tes clients décrochent — et tu corriges.',
    tooltip: 'Scroll depth, CVR et ROAS en temps réel',
  },
  {
    Icon: LinkSimple,
    color: '#0d9488',
    bg: 'rgba(13,148,136,0.08)',
    title: 'Publish Shopify en 1 clic',
    desc: 'Pas de copier-coller de code. Connecte ta boutique une fois, publie en un clic. Zéro développeur requis.',
    tooltip: 'Connexion OAuth Shopify & WooCommerce directe',
  },
  {
    Icon: Flask,
    color: '#8b5cf6',
    bg: 'rgba(139,92,246,0.08)',
    title: 'A/B Testing automatique',
    desc: 'Lance 2 variantes de ta page. L\'algorithme identifie la gagnante et bascule le trafic dessus. Tu te concentres sur le reste.',
    tooltip: 'Gagnant détecté automatiquement à 95% de signif.',
  },
  {
    Icon: Globe,
    color: '#f59e0b',
    bg: 'rgba(245,158,11,0.08)',
    title: 'Vends dans 8 langues',
    desc: 'Français, anglais, espagnol, allemand, portugais et plus. Chaque marché, une page optimisée dans sa langue.',
    tooltip: 'FR, EN, ES, DE, IT, PT, AR, ZH — copy natif',
  },
]

export function FeaturesSection() {
  return (
    <section id="features" style={{ background: '#faf8ff' }}>
      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-14 sm:py-24">
        <div className="text-center mb-10 sm:mb-16">
          <div
            className="reveal inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold mb-4"
            style={{ background: 'rgba(91,71,245,0.08)', color: '#5B47F5', border: '1px solid rgba(91,71,245,0.15)' }}
          >
            <Lightning className="w-3.5 h-3.5" />
            Fonctionnalités
          </div>
          <h2 className="reveal delay-1 text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 tracking-tight mb-4">
            Arrête de perdre de l&apos;argent<br />sur tes pages.
          </h2>
          <p className="reveal delay-2 text-lg text-gray-500 max-w-xl mx-auto">
            KONVERT donne à chaque e-commerçant les outils pro qui coûtaient 5 000€/mois à une agence. Résultats immédiats, sans intermédiaire.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((f, i) => (
            <div
              key={f.title}
              className="reveal card-hover-violet p-6 rounded-2xl"
              style={{
                background: '#ffffff',
                border: '1.5px solid #ede8ff',
                boxShadow: '0 2px 12px rgba(91,71,245,0.05)',
                transitionDelay: `${i * 0.07}s`,
              }}
            >
              <Tooltip content={f.tooltip} position="top">
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center mb-4 cursor-default"
                  style={{ background: f.bg }}
                >
                  <f.Icon className="w-5 h-5" style={{ color: f.color }} />
                </div>
              </Tooltip>
              <h3 className="text-gray-900 font-bold text-base mb-2">{f.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
export function ABTestingSection() {
  return (
    <section style={{ background: '#ffffff' }}>
      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-14 sm:py-24">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-24 items-center">

          {/* Left */}
          <div>
            <h2 className="reveal text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 tracking-tight mb-6 leading-tight">
              Ta meilleure page, trouvée par les données.
            </h2>
            <p className="reveal delay-1 text-lg text-gray-500 leading-relaxed mb-10">
              Lance deux versions de ta page. KONVERT mesure les clics, les scrolls, les conversions — et te dit laquelle gagne. Plus de suppositions, que des résultats.
            </p>
            <Link href="/features" className="reveal delay-2 inline-flex items-center gap-4 group">
              <span className="font-bold text-gray-900 text-sm">Optimiser les performances</span>
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center transition-transform group-hover:scale-110"
                style={{ background: '#b5f23d' }}
              >
                <ArrowRight className="w-5 h-5 text-gray-900" />
              </div>
            </Link>
          </div>

          {/* Right — mockup A/B */}
          <div className="hidden lg:flex items-center justify-center relative" style={{ minHeight: '360px' }}>

            {/* Page variant B (arrière) */}
            <div
              className="absolute rounded-2xl overflow-hidden shadow-xl"
              style={{
                width: '300px',
                top: '10px',
                right: '10px',
                background: '#1a2535',
                border: '1px solid rgba(255,255,255,0.08)',
                transform: 'rotate(3deg)',
                zIndex: 1,
              }}
            >
              <div className="flex items-center gap-2 px-3 py-2" style={{ background: '#111827', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                <div className="flex gap-1">
                  <div className="w-2 h-2 rounded-full bg-red-500" />
                  <div className="w-2 h-2 rounded-full bg-yellow-500" />
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                </div>
                <div className="flex-1 rounded px-2 py-0.5 text-xs text-white/30 font-mono" style={{ background: 'rgba(255,255,255,0.05)' }}>konvertpilot.com/p/variant-b</div>
              </div>
              <div className="p-4" style={{ background: '#1a2535' }}>
                <div className="h-20 rounded-lg mb-3" style={{ background: 'linear-gradient(135deg,#0d9488,#2dd4bf)' }} />
                <div className="h-2 rounded w-3/4 mb-2" style={{ background: 'rgba(255,255,255,0.12)' }} />
                <div className="h-2 rounded w-full mb-1" style={{ background: 'rgba(255,255,255,0.06)' }} />
                <div className="h-2 rounded w-5/6" style={{ background: 'rgba(255,255,255,0.06)' }} />
              </div>
            </div>

            {/* Page variant A (avant) — page produit KONVERT */}
            <div
              className="float-anim absolute rounded-2xl overflow-hidden shadow-2xl"
              style={{
                width: '320px',
                top: '20px',
                left: '0px',
                background: '#fff',
                border: '1.5px solid #e5e7eb',
                zIndex: 2,
              }}
            >
              {/* Chrome navigateur */}
              <div className="flex items-center gap-2 px-3 py-2" style={{ background: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                <div className="flex gap-1">
                  <div className="w-2 h-2 rounded-full bg-red-400" />
                  <div className="w-2 h-2 rounded-full bg-yellow-400" />
                  <div className="w-2 h-2 rounded-full bg-green-400" />
                </div>
                <div className="flex-1 rounded px-2 py-0.5 text-xs text-gray-400 font-mono bg-white border border-gray-200">konvertpilot.com/p/air-max-pro</div>
              </div>
              {/* Hero produit — image sneaker */}
              <div style={{ background: 'linear-gradient(135deg,#5B47F5 0%,#7c6af7 100%)', padding: '12px 16px', position: 'relative', overflow: 'hidden' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6, position: 'relative', zIndex: 2 }}>
                  <span style={{ background: 'rgba(255,255,255,0.2)', color: '#fff', fontSize: 9, fontWeight: 800, padding: '2px 8px', borderRadius: 99 }}>NOUVEAUTÉ</span>
                  <div style={{ display: 'flex', gap: 2 }}>
                    {[1,2,3,4,5].map(i => <svg key={i} width="9" height="9" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" fill="#fbbf24"/></svg>)}
                  </div>
                </div>
                {/* Image produit */}
                <div style={{ display: 'flex', justifyContent: 'center', position: 'relative', zIndex: 2 }}>
                  <Image
                    src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80"
                    alt="Air Max Pro sneaker"
                    width={140}
                    height={80}
                    style={{ width: 140, height: 80, objectFit: 'contain', filter: 'drop-shadow(0 8px 16px rgba(0,0,0,0.3))' }}
                  />
                </div>
                {/* Halo lumineux derrière le produit */}
                <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 120, height: 120, borderRadius: '50%', background: 'rgba(255,255,255,0.1)', filter: 'blur(20px)' }} />
              </div>
              {/* Info produit */}
              <div className="p-4 bg-white">
                <p className="font-black text-gray-900 text-sm mb-1">Air Max Pro — Édition limitée</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                  <span style={{ fontWeight: 900, fontSize: 16, color: '#5B47F5' }}>89€</span>
                  <span style={{ fontSize: 12, textDecoration: 'line-through', color: '#94a3b8' }}>139€</span>
                  <span style={{ fontSize: 10, fontWeight: 700, padding: '1px 6px', borderRadius: 4, background: '#fee2e2', color: '#ef4444' }}>-36%</span>
                </div>
                <div style={{ height: 6, borderRadius: 4, background: '#f1f5f9', marginBottom: 6, width: '100%' }} />
                <div style={{ height: 6, borderRadius: 4, background: '#f1f5f9', marginBottom: 12, width: '75%' }} />
                <div style={{ background: 'linear-gradient(135deg,#5B47F5,#7c6af7)', borderRadius: 10, padding: '8px 0', textAlign: 'center', fontSize: 12, fontWeight: 800, color: '#fff' }}>
                  Ajouter au panier →
                </div>
                <div style={{ display: 'flex', justifyContent: 'center', gap: 12, marginTop: 8 }}>
                  {['🔒 Paiement sécurisé', '🚚 Livraison offerte'].map(t => (
                    <span key={t} style={{ fontSize: 9, color: '#94a3b8', fontWeight: 600 }}>{t}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* Barre "Add Variant" */}
            <div
              className="absolute flex items-center justify-center gap-2 text-sm font-bold text-white rounded-xl px-6 py-3 z-10"
              style={{
                bottom: '30px',
                left: '0',
                right: '80px',
                background: '#1f2937',
              }}
            >
              <span className="text-lg">+</span> Add Variant
            </div>

            {/* Floating stats card — le carré qui bouge */}
            <div
              className="float-card absolute rounded-2xl p-4 shadow-2xl z-20"
              style={{
                bottom: '80px',
                right: '-10px',
                background: 'rgba(20,22,38,0.95)',
                backdropFilter: 'blur(16px)',
                border: '1px solid rgba(255,255,255,0.1)',
                width: '155px',
              }}
            >
              <p className="text-white/50 text-xs font-bold tracking-widest mb-1">A/B TEST</p>
              <p className="text-white font-black text-4xl mb-3">+45%</p>
              <svg viewBox="0 0 120 44" className="w-full">
                <defs>
                  <linearGradient id="abGrad" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#7c6af7" />
                    <stop offset="100%" stopColor="#22d3ee" />
                  </linearGradient>
                  <linearGradient id="abFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#7c6af7" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#22d3ee" stopOpacity="0.05" />
                  </linearGradient>
                </defs>
                <polygon
                  points="0,44 0,38 15,32 30,34 45,22 60,24 75,14 90,16 105,7 120,4 120,44"
                  fill="url(#abFill)"
                />
                <polyline
                  points="0,38 15,32 30,34 45,22 60,24 75,14 90,16 105,7 120,4"
                  fill="none"
                  stroke="url(#abGrad)"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
/* ═══════════════════════════════════════════════════════════════════════════
   HOW IT WORKS — header + steps statiques, vidéo interactive déléguée
═══════════════════════════════════════════════════════════════════════════ */
const STEPS = [
  {
    num: '01',
    Icon: LinkSimple,
    title: 'Colle ton lien produit',
    desc: 'AliExpress, Amazon, Alibaba. Tu colles l\'URL — KONVERT scrape tout automatiquement.',
  },
  {
    num: '02',
    Icon: Sparkle,
    title: 'L\'IA rédige en 30 secondes',
    desc: 'Titre accrocheur, bénéfices, FAQ, CTA — tout généré et optimisé pour convertir.',
  },
  {
    num: '03',
    Icon: TrendUp,
    title: 'Publie sur Shopify en 1 clic',
    desc: 'Choisis un template, connecte ta boutique, publie. Pas de dev, pas d\'attente.',
  },
]
export function HowItWorks() {
  return (
    <section id="how-it-works" style={{ background: 'radial-gradient(ellipse 90% 50% at 50% -5%, rgba(91,71,245,0.28) 0%, transparent 60%), radial-gradient(ellipse 55% 40% at 85% 110%, rgba(124,106,247,0.15) 0%, transparent 60%), #0b0b1c' }}>
      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-14 sm:py-24">
        <div className="text-center mb-10 sm:mb-16">
          <div
            className="reveal inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold mb-4"
            style={{ background: 'rgba(91,71,245,0.18)', color: '#a78bfa', border: '1px solid rgba(91,71,245,0.3)' }}
          >
            <Lightning className="w-3.5 h-3.5" />
            Comment ça marche
          </div>
          <h2 className="reveal delay-1 text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight mb-4">
            Un lien AliExpress. Une page qui vend.
          </h2>
          <p className="reveal delay-2 text-lg text-white/60 max-w-xl mx-auto">
            Personne d&apos;autre ne fait ça. Tu colles un lien — l&apos;IA scrape, rédige, structure. Ta page est prête en 30 secondes.
          </p>
        </div>

        {/* ── Bloc vidéo (interactif — Client Component) ────────────────── */}
        <VideoDemoTrigger />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative">
          <div
            className="hidden lg:block absolute top-14 left-1/6 right-1/6 h-px"
            style={{ background: 'linear-gradient(90deg, transparent, rgba(91,71,245,0.4), transparent)' }}
          />
          {STEPS.map((s, i) => (
            <div
              key={s.num}
              className="reveal text-center lg:text-left"
              style={{ transitionDelay: `${i * 0.12}s` }}
            >
              <div className="flex flex-col lg:flex-row items-center lg:items-start gap-5 mb-5">
                <div className="flex-shrink-0">
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center"
                    style={{ background: 'rgba(91,71,245,0.15)', border: '1px solid rgba(91,71,245,0.3)' }}
                  >
                    <s.Icon className="w-6 h-6" style={{ color: '#7c6af7' }} />
                  </div>
                </div>
                <div
                  className="text-4xl sm:text-6xl font-black"
                  style={{ color: 'rgba(91,71,245,0.2)', lineHeight: 1 }}
                >
                  {s.num}
                </div>
              </div>
              <h3 className="text-white font-bold text-xl mb-3">{s.title}</h3>
              <p className="text-white/55 leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════
   INTEGRATIONS
═══════════════════════════════════════════════════════════════════════════ */
const INTEGRATION_APPS = [
  { name: 'Shopify',      color: '#96BF48' },
  { name: 'Zapier',       color: '#FF4A00' },
  { name: 'HubSpot',      color: '#FF7A59' },
  { name: 'Klaviyo',      color: '#006BFF' },
  { name: 'Stripe',       color: '#635BFF' },
  { name: 'Meta Ads',     color: '#1877F2' },
  { name: 'WooCommerce',  color: '#7F54B3' },
  { name: 'Mailchimp',    color: '#FFE01B' },
]

export function IntegrationsSection() {
  return (
    <section style={{ background: '#12131f', position: 'relative', overflow: 'hidden' }}>
      {/* Glow violet haut-droite — renforcé */}
      <div
        className="absolute pointer-events-none"
        style={{
          right: '-5%',
          top: '-10%',
          width: '55%',
          height: '90%',
          background: 'radial-gradient(ellipse, rgba(91,71,245,0.38) 0%, transparent 65%)',
        }}
      />
      {/* Glow centre */}
      <div
        className="absolute pointer-events-none"
        style={{
          left: '50%',
          top: '50%',
          transform: 'translate(-50%,-50%)',
          width: '70%',
          height: '60%',
          background: 'radial-gradient(ellipse, rgba(124,106,247,0.1) 0%, transparent 70%)',
        }}
      />
      {/* Glow bas-gauche */}
      <div
        className="absolute pointer-events-none"
        style={{
          left: '-5%',
          bottom: '0',
          width: '40%',
          height: '60%',
          background: 'radial-gradient(ellipse, rgba(139,92,246,0.18) 0%, transparent 70%)',
        }}
      />

      <div className="max-w-7xl mx-auto px-5 sm:px-8 pt-14 sm:pt-24 pb-0 text-center relative z-10">
        <h2 className="reveal text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight mb-6 leading-[1.1]">
          Connecte KONVERT à ce que<br />tu utilises déjà
        </h2>
        <p className="reveal delay-1 text-lg text-white/55 max-w-2xl mx-auto mb-10">
          Shopify, Klaviyo, Meta Ads, Stripe — tes outils restent en place. KONVERT s&apos;y branche en quelques secondes et commence à travailler pour toi.
        </p>
        <Link href="/integrations" className="reveal delay-2 inline-flex items-center gap-4 mb-20 group">
          <span className="text-white font-bold text-sm">Intégrations</span>
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center transition-transform group-hover:scale-110"
            style={{ background: '#b5f23d' }}
          >
            <ArrowRight className="w-5 h-5 text-gray-900" />
          </div>
        </Link>

        {/* App icons — grille isométrique */}
        <div className="flex justify-center pb-0">
          <div className="grid grid-cols-4 sm:grid-cols-8 gap-3 sm:gap-5">
            {INTEGRATION_APPS.map((app, i) => (
              <div
                key={app.name}
                className="float-anim flex flex-col items-center gap-2"
                style={{ animationDelay: `${i * 0.25}s` }}
              >
                <div
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center shadow-2xl"
                  style={{
                    background: `linear-gradient(145deg, ${app.color}28 0%, #1e2035 100%)`,
                    border: `1px solid ${app.color}33`,
                    boxShadow: `0 8px 32px ${app.color}18, inset 0 1px 0 rgba(255,255,255,0.06)`,
                  }}
                >
                  <div className="w-9 h-9 sm:w-11 sm:h-11">
                    <BrandLogo name={app.name} color={app.color} />
                  </div>
                </div>
                <span className="text-white/40 text-[10px] sm:text-xs font-semibold">{app.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
/* ═══════════════════════════════════════════════════════════════════════════
   AI BUILDER DEMO — html calculé au build (pas de useMemo : pas de dépendance
   variable, templateEtecBeauty est une fonction pure)
═══════════════════════════════════════════════════════════════════════════ */
const DEMO_BEAUTY_DATA = {
  product_name: 'LuxHair Pro',
  headline: 'Des cheveux transformés, une confiance retrouvée',
  subtitle: 'Formule kératine premium enrichie aux huiles botaniques. Sans sulfates, sans parabènes. Résultats visibles en 7 jours.',
  cta: 'Découvrir la routine — Livraison offerte',
  urgency: '🌿 Édition limitée — Stock faible',
  benefits: [
    'Formule kératine premium — lissage naturel durable',
    'Huiles botaniques bio — argan, ricin, jojoba',
    'Sans sulfates, sans parabènes — respecte le cuir chevelu',
    'Résultats visibles en 7 jours — testé et approuvé',
    'Convient à tous les types de cheveux — même colorés',
  ],
  faq: [
    { question: 'Convient aux cheveux colorés ?', answer: 'Oui, notre formule est spécialement conçue pour respecter les cheveux colorés et traités chimiquement.' },
    { question: 'Délai de livraison ?', answer: 'Livraison express en 2–3 jours ouvrés. Expédition le jour même avant 14h.' },
    { question: 'Garantie satisfait ou remboursé ?', answer: 'Satisfait ou remboursé sous 30 jours. Aucune question posée.' },
  ],
  price: '49',
  original_price: '79',
  images: [
    'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&q=80',
    'https://images.unsplash.com/photo-1560869713-7d0a29430803?w=800&q=80',
    'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=800&q=80',
    'https://images.unsplash.com/photo-1519415387722-a1c3bbef716c?w=800&q=80',
    'https://images.unsplash.com/photo-1527799820374-87591a16f5e6?w=800&q=80',
  ],
}
const AI_BUILDER_DEMO_HTML = templateEtecBeauty(DEMO_BEAUTY_DATA)

export function AIBuilderDemoSection() {
  const html = AI_BUILDER_DEMO_HTML

  return (
    <section style={{ background: '#08080f', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-20 sm:py-28">

        {/* Header */}
        <div className="text-center mb-14">
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold mb-5"
            style={{ background: 'rgba(181,242,61,0.08)', color: '#b5f23d', border: '1px solid rgba(181,242,61,0.18)' }}
          >
            ✦ Propulsé par Claude AI
          </div>
          <h2 className="reveal text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight mb-4 leading-tight">
            Génère. Modifie. Teste.<br />
            <span style={{ color: '#b5f23d' }}>Tout depuis un seul outil.</span>
          </h2>
          <p className="reveal delay-1 text-base max-w-xl mx-auto leading-relaxed" style={{ color: 'rgba(255,255,255,0.4)' }}>
            Dis à l&apos;IA ce que tu veux changer. Elle le fait en secondes.
            Le A/B test tourne en fond et te dit quelle version gagne.
          </p>
        </div>

        {/* Demo grid */}
        <div className="reveal delay-2 flex flex-col lg:flex-row gap-5 items-stretch">

          {/* ── LEFT : Browser window avec vraie template ── */}
          <div className="flex-1 min-w-0 relative">
            <div
              className="rounded-2xl overflow-hidden"
              style={{
                background: '#111122',
                border: '1.5px solid rgba(255,255,255,0.08)',
                boxShadow: '0 40px 100px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04)',
              }}
            >
              {/* Chrome bar */}
              <div
                className="flex items-center gap-3 px-4 py-3 flex-shrink-0"
                style={{ background: '#0d0e1e', borderBottom: '1px solid rgba(255,255,255,0.07)' }}
              >
                <div className="flex gap-1.5">
                  {['#ef4444','#f59e0b','#22c55e'].map(c => (
                    <div key={c} className="w-2.5 h-2.5 rounded-full" style={{ background: c }} />
                  ))}
                </div>
                <div
                  className="flex-1 mx-3 flex items-center gap-2 px-3 py-1 rounded-md text-xs"
                  style={{ background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.3)', fontFamily: 'monospace' }}
                >
                  <div className="w-2 h-2 rounded-full" style={{ background: 'rgba(255,255,255,0.15)' }} />
                  konvertpilot.com/p/phantom-watch-x
                </div>
                <span
                  className="text-xs font-bold px-3 py-1.5 rounded-full flex-shrink-0"
                  style={{ background: 'rgba(91,71,245,0.85)', color: '#fff' }}
                >
                  ✦ Éditer avec l&apos;IA
                </span>
              </div>

              {/* Template iframe scalée */}
              <div style={{ position: 'relative', overflow: 'hidden', height: '480px' }}>
                <iframe
                  srcDoc={html}
                  title="Template KONVERT — Phantom Watch X"
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '1280px',
                    height: '960px',
                    transform: 'scale(0.5)',
                    transformOrigin: 'top left',
                    border: 'none',
                    pointerEvents: 'none',
                    display: 'block',
                  }}
                  sandbox="allow-scripts"
                />
                {/* Dégradé bas pour fondre proprement */}
                <div
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: '100px',
                    background: 'linear-gradient(to bottom, transparent, #111122)',
                    pointerEvents: 'none',
                  }}
                />
              </div>
            </div>

            {/* ── AI Chat overlay ── */}
            <div
              className="absolute z-20 rounded-2xl overflow-hidden"
              style={{
                bottom: '28px',
                right: '24px',
                width: '300px',
                background: '#ffffff',
                border: '1px solid rgba(0,0,0,0.08)',
                boxShadow: '0 24px 56px rgba(0,0,0,0.5)',
              }}
            >
              {/* Chat header */}
              <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: '1px solid #f0f0f0' }}>
                <div className="flex items-center gap-2">
                  <div
                    className="w-6 h-6 rounded-lg flex items-center justify-center font-black text-white text-xs"
                    style={{ background: 'linear-gradient(135deg, #5B47F5, #7c6af7)' }}
                  >K</div>
                  <span className="font-black text-sm text-gray-900">KONVERT IA</span>
                  <span className="text-xs px-2 py-0.5 rounded-full font-semibold" style={{ background: '#f3f4f6', color: '#6b7280' }}>⚡ 2.1k</span>
                </div>
                <div className="flex items-center gap-1.5 text-gray-300 text-xs">
                  <span className="cursor-pointer">↺</span>
                  <span className="cursor-pointer">✕</span>
                </div>
              </div>

              {/* Messages */}
              <div className="p-3 flex flex-col gap-2.5">
                <div
                  className="self-end px-3.5 py-2 rounded-2xl text-white text-xs leading-relaxed"
                  style={{ background: '#5B47F5', maxWidth: '90%' }}
                >
                  Rends le fond plus sombre et le CTA plus lumineux
                </div>
                <p className="text-xs text-gray-500 leading-relaxed px-1">
                  Fond passé en noir profond #08080f. CTA changé en violet électrique avec halo lumineux.
                </p>
                <div
                  className="self-end px-3.5 py-2 rounded-2xl text-white text-xs leading-relaxed"
                  style={{ background: '#5B47F5', maxWidth: '90%' }}
                >
                  Ajoute un badge &quot;Édition Limitée&quot; en rouge
                </div>
                {/* Typing dots */}
                <div className="flex items-center gap-1.5 px-1 py-1">
                  {[0,1,2].map(i => (
                    <div
                      key={i}
                      className="w-2 h-2 rounded-full"
                      style={{ background: '#d1d5db', animation: `wave-move ${0.5 + i * 0.15}s ease-in-out infinite` }}
                    />
                  ))}
                </div>
              </div>

              {/* Input */}
              <div className="px-3 pb-3">
                <div
                  className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-gray-400"
                  style={{ background: '#f9fafb', border: '1.5px solid #e5e7eb' }}
                >
                  Demande à l&apos;IA de modifier la page...
                </div>
              </div>
            </div>
          </div>

          {/* ── RIGHT : A/B Test panel ── */}
          <div
            className="lg:w-72 xl:w-80 flex-shrink-0 rounded-2xl flex flex-col"
            style={{
              background: '#0f1020',
              border: '1.5px solid rgba(255,255,255,0.07)',
              boxShadow: '0 24px 64px rgba(0,0,0,0.4)',
            }}
          >
            {/* Panel header */}
            <div
              className="flex items-center justify-between px-5 py-4"
              style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}
            >
              <span className="font-black text-white text-sm">A/B Test</span>
              <span
                className="text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5"
                style={{ background: 'rgba(16,185,129,0.15)', color: '#10b981' }}
              >
                <div className="w-1.5 h-1.5 rounded-full" style={{ background: '#10b981' }} />
                En cours
              </span>
            </div>

            {/* Test label */}
            <div
              className="px-5 py-3 text-xs"
              style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.3)' }}
            >
              CTA lumineux vs CTA original
            </div>

            {/* Stats */}
            <div className="px-5 py-5 flex flex-col gap-5">
              <p className="text-xs font-bold tracking-widest" style={{ color: 'rgba(255,255,255,0.22)' }}>
                TAUX DE CONVERSION
              </p>

              {/* Variant A */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: '#5B47F5' }} />
                    <span className="text-xs font-semibold" style={{ color: 'rgba(255,255,255,0.45)' }}>Variante A — original</span>
                  </div>
                  <span className="text-xs font-bold text-white/50">2.1%</span>
                </div>
                <div className="h-2 rounded-full w-full" style={{ background: 'rgba(255,255,255,0.06)' }}>
                  <div className="h-full rounded-full" style={{ width: '35%', background: '#5B47F5' }} />
                </div>
                <p className="text-xs mt-1.5" style={{ color: 'rgba(255,255,255,0.2)' }}>32 / 1 505 visites</p>
              </div>

              {/* Variant B */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: '#b5f23d' }} />
                    <span className="text-xs font-semibold" style={{ color: '#b5f23d' }}>Variante B — CTA lumineux</span>
                  </div>
                  <span className="text-xs font-bold" style={{ color: '#b5f23d' }}>4.7%</span>
                </div>
                <div className="h-2 rounded-full w-full" style={{ background: 'rgba(181,242,61,0.1)' }}>
                  <div className="h-full rounded-full" style={{ width: '78%', background: '#b5f23d' }} />
                </div>
                <p className="text-xs mt-1.5" style={{ color: 'rgba(181,242,61,0.4)' }}>71 / 1 505 visites</p>
              </div>

              {/* Winner card */}
              <div
                className="px-4 py-3 rounded-xl"
                style={{ background: 'rgba(181,242,61,0.07)', border: '1px solid rgba(181,242,61,0.18)' }}
              >
                <p className="text-xs font-bold mb-1" style={{ color: '#b5f23d' }}>
                  ✓ Variante B — 91% confiance
                </p>
                <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.3)' }}>
                  +124% de conversions — Smart Traffic redirige automatiquement
                </p>
              </div>

              {/* Smart Traffic */}
              <div
                className="flex items-center justify-between px-3.5 py-3 rounded-xl"
                style={{ background: 'rgba(91,71,245,0.1)', border: '1px solid rgba(91,71,245,0.2)' }}
              >
                <div className="flex items-center gap-2">
                  <span style={{ color: '#a78bfa', fontSize: '13px' }}>⚡</span>
                  <span className="text-xs font-bold" style={{ color: '#a78bfa' }}>Smart Traffic</span>
                </div>
                <span className="text-xs font-bold" style={{ color: '#10b981' }}>Actif</span>
              </div>

              {/* Heatmap preview */}
              <div
                className="px-4 py-3 rounded-xl"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
              >
                <p className="text-xs font-bold mb-2.5" style={{ color: 'rgba(255,255,255,0.35)' }}>Heatmap clics</p>
                <div className="flex gap-1 items-end h-10">
                  {[30,55,40,80,95,70,85,60,90,75].map((h, i) => (
                    <div
                      key={i}
                      className="flex-1 rounded-sm"
                      style={{
                        height: `${h}%`,
                        background: h > 80
                          ? 'rgba(239,68,68,0.7)'
                          : h > 60
                          ? 'rgba(251,146,60,0.5)'
                          : 'rgba(91,71,245,0.35)',
                      }}
                    />
                  ))}
                </div>
                <p className="text-xs mt-2" style={{ color: 'rgba(255,255,255,0.2)' }}>Zone CTA — haute densité</p>
              </div>
            </div>

            {/* CTA */}
            <div className="px-5 pb-5 mt-auto">
              <button
                className="w-full py-2.5 rounded-xl text-xs font-bold"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.3)' }}
              >
                Voir les Insights →
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════
   BUILDER SECTION
═══════════════════════════════════════════════════════════════════════════ */
const SWATCHES = ['#d1d5db', '#ef4444', '#f97316', '#eab308', '#22c55e', '#a78bfa', '#5B47F5']

export function BuilderSection() {
  return (
    <section style={{ background: '#ffffff' }}>
      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-24">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-20 items-center">

          {/* Left */}
          <div>
            <h2 className="reveal text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 tracking-tight mb-6 leading-tight">
              Fini les pages qui font fuir tes clients.
            </h2>
            <p className="reveal delay-1 text-lg text-gray-500 leading-relaxed mb-10">
              Zéro dev, zéro designer. Tu colles ton lien AliExpress, tu choisis un template, tu personnalises en 2 clics. Ta page convertit — aujourd&apos;hui.
            </p>
            <Link href="/demo" className="reveal delay-2 inline-flex items-center gap-4 group">
              <span className="font-bold text-gray-900 text-sm">Créer des pages optimisées</span>
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center transition-transform group-hover:scale-110"
                style={{ background: '#b5f23d' }}
              >
                <ArrowRight className="w-5 h-5 text-gray-900" />
              </div>
            </Link>
          </div>

          {/* Right — Laptop mockup */}
          <div className="flex items-start justify-center relative pt-6 lg:pt-8">

            {/* Swatches flottants au dessus */}
            <div
              className="float-card absolute hidden lg:flex items-center gap-2.5 px-4 py-3 rounded-full shadow-xl z-20"
              style={{
                top: '-8px',
                right: '20px',
                background: 'rgba(255,255,255,0.97)',
                border: '1px solid rgba(0,0,0,0.07)',
                boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
              }}
            >
              {SWATCHES.map((color) => (
                <div
                  key={color}
                  className="w-8 h-8 rounded-full border-2 border-white shadow-sm"
                  style={{ background: color, boxShadow: '0 2px 6px rgba(0,0,0,0.15)' }}
                />
              ))}
            </div>

            {/* Écran laptop */}
            <div className="w-full max-w-lg">
              <div
                className="rounded-2xl overflow-hidden shadow-2xl"
                style={{
                  background: '#1a1b2e',
                  border: '1.5px solid rgba(255,255,255,0.08)',
                  aspectRatio: '16/10',
                  position: 'relative',
                  display: 'flex',
                }}
              >
                {/* Sidebar builder */}
                <div
                  className="flex flex-col gap-1.5 py-3 px-1.5 flex-shrink-0"
                  style={{ width: '52px', background: '#111120', borderRight: '1px solid rgba(255,255,255,0.05)' }}
                >
                  {[
                    { Icon: FileText2, label: 'Pages' },
                    { Icon: Pencil2, label: 'Edit' },
                    { Icon: Image2, label: 'Images' },
                    { Icon: Lightning, label: 'Actions' },
                    { Icon: ChartBar, label: 'Stats' },
                    { Icon: Settings2, label: 'Settings' },
                  ].map(({ Icon, label }, idx) => (
                    <div
                      key={idx}
                      className="w-8 h-8 rounded-lg flex items-center justify-center"
                      style={{ background: idx === 0 ? 'rgba(91,71,245,0.35)' : 'transparent', opacity: idx === 0 ? 1 : 0.35 }}
                      title={label}
                    >
                      <Icon size={16} weight="bold" color={idx === 0 ? '#b5f23d' : '#ffffff'} />
                    </div>
                  ))}
                </div>

                {/* Canvas */}
                <div className="flex-1 flex flex-col">
                  {/* Topbar */}
                  <div
                    className="flex items-center justify-between px-3 py-2 flex-shrink-0"
                    style={{ background: '#16172a', borderBottom: '1px solid rgba(255,255,255,0.05)' }}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-white/50 text-xs font-semibold">Leadmeter</span>
                      <span
                        className="text-xs font-bold px-2 py-0.5 rounded-full"
                        style={{ background: 'rgba(16,185,129,0.2)', color: '#10b981' }}
                      >
                        Excellent
                      </span>
                    </div>
                    <div className="flex gap-1.5">
                      {['#ef4444','#f59e0b','#10b981'].map(c => (
                        <div key={c} className="w-2.5 h-2.5 rounded-full" style={{ background: c }} />
                      ))}
                    </div>
                  </div>

                  {/* Page preview — produit KONVERT */}
                  <div
                    className="flex-1 relative overflow-hidden"
                    style={{ background: '#ffffff' }}
                  >
                    {/* Hero bannière produit — image réelle headphone */}
                    <div style={{ position: 'relative', overflow: 'hidden', minHeight: 90, height: 90 }}>
                      <Image
                        src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=85"
                        alt="Casque Pro Studio X"
                        fill
                        sizes="(max-width: 640px) 90vw, 400px"
                        style={{ objectFit: 'cover', objectPosition: 'center' }}
                      />
                      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(26,10,78,0.88) 0%, rgba(91,71,245,0.55) 100%)' }} />
                      <div style={{ position: 'absolute', inset: 0, padding: '10px 14px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ background: 'rgba(255,255,255,0.18)', color: '#fff', fontSize: 8, fontWeight: 800, padding: '2px 7px', borderRadius: 99, backdropFilter: 'blur(4px)' }}>-42% CE WEEK-END</span>
                          <div style={{ display: 'flex', gap: 2 }}>{[1,2,3,4,5].map(i=><svg key={i} width="8" height="8" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" fill="#fbbf24"/></svg>)}</div>
                        </div>
                        <div>
                          <div style={{ fontWeight: 900, fontSize: 12, color: '#fff', lineHeight: 1.3, marginBottom: 2 }}>Casque Pro Studio X</div>
                          <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.65)', marginBottom: 4 }}>Son cristallin · Réduction de bruit active</div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <span style={{ fontWeight: 900, fontSize: 15, color: '#fff' }}>79€</span>
                            <span style={{ fontSize: 10, textDecoration: 'line-through', color: 'rgba(255,255,255,0.45)' }}>139€</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* CTA et avis */}
                    <div style={{ padding: '10px 14px' }}>
                      <div style={{ height: 5, borderRadius: 3, background: '#f1f5f9', marginBottom: 4, width: '90%' }} />
                      <div style={{ height: 5, borderRadius: 3, background: '#f1f5f9', marginBottom: 10, width: '65%' }} />
                      <div style={{ background: 'linear-gradient(135deg,#5B47F5,#7c6af7)', borderRadius: 8, padding: '7px 0', textAlign: 'center', fontSize: 10, fontWeight: 800, color: '#fff', marginBottom: 8 }}>
                        Acheter maintenant →
                      </div>
                      <div style={{ display: 'flex', gap: 6 }}>
                        {['✓ Retour 30j', '✓ Garanti 2 ans', '🚚 48h'].map(t => (
                          <span key={t} style={{ fontSize: 8, color: '#94a3b8', fontWeight: 600 }}>{t}</span>
                        ))}
                      </div>
                    </div>

                    {/* Add Variant floating pill */}
                    <div
                      className="float-anim absolute bottom-5 right-4 flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-bold text-white shadow-2xl"
                      style={{
                        background: 'rgba(15,17,32,0.92)',
                        backdropFilter: 'blur(12px)',
                        border: '1px solid rgba(255,255,255,0.12)',
                      }}
                    >
                      <span className="text-base">+</span> Add Variant
                    </div>
                  </div>
                </div>
              </div>

              {/* Socle laptop */}
              <div className="flex flex-col items-center">
                <div style={{ height: '14px', width: '70%', background: 'linear-gradient(to bottom,#252537,#1a1a2e)', borderRadius: '0 0 8px 8px' }} />
                <div style={{ height: '6px', width: '88%', background: '#0f0f1e', borderRadius: '0 0 10px 10px' }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
/* ═══════════════════════════════════════════════════════════════════════════
   ANALYTICS SECTION — dashboard mockup, image à gauche
═══════════════════════════════════════════════════════════════════════════ */
const ANALYTICS_BARS = [55, 72, 48, 88, 64, 95, 79]
const ANALYTICS_METRICS = [
  { label: 'Taux de conversion', value: '4.8%', delta: '+1.4pts', color: '#10b981' },
  { label: 'ROAS moyen',         value: 'x4.2',  delta: '+0.9',   color: '#7c6af7' },
  { label: 'Vues ce mois',       value: '28K',   delta: '+31%',   color: '#f59e0b' },
]

export function AnalyticsShowcase() {
  return (
    <section style={{ background: '#faf8ff' }}>
      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-14 sm:py-24">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-20 items-center">

          {/* Left — dashboard mockup */}
          <div className="relative">
            <div
              className="reveal rounded-3xl overflow-hidden shadow-2xl"
              style={{ background: '#ffffff', border: '1.5px solid #e8e2ff' }}
            >
              {/* Header — chrome sombre style navigateur */}
              <div
                className="flex items-center justify-between px-5 py-3.5"
                style={{ background: '#1a1b2e', borderBottom: '1px solid rgba(255,255,255,0.06)' }}
              >
                <div className="flex items-center gap-3">
                  <div className="flex gap-1.5">
                    {['#ef4444','#f59e0b','#10b981'].map(c => (
                      <div key={c} className="w-2.5 h-2.5 rounded-full" style={{ background: c }} />
                    ))}
                  </div>
                  <span className="text-white/50 text-xs font-semibold">Analytics · Boutique Alpha</span>
                </div>
                <span
                  className="text-xs font-bold px-3 py-1 rounded-full"
                  style={{ background: 'rgba(91,71,245,0.25)', color: '#a78bfa' }}
                >
                  Temps réel
                </span>
              </div>

              {/* Métriques — fond lavande clair */}
              <div className="grid grid-cols-3 gap-px" style={{ background: '#e8e2ff' }}>
                {ANALYTICS_METRICS.map((m) => (
                  <div
                    key={m.label}
                    className="flex flex-col gap-1 px-5 py-5"
                    style={{ background: 'linear-gradient(135deg,#f8f6ff,#fdf9ff)' }}
                  >
                    <span className="text-gray-400 text-xs font-medium">{m.label}</span>
                    <span className="text-gray-900 font-black text-2xl">{m.value}</span>
                    <span
                      className="text-xs font-bold w-fit px-2 py-0.5 rounded-full"
                      style={{ background: `${m.color}18`, color: m.color }}
                    >
                      {m.delta}
                    </span>
                  </div>
                ))}
              </div>

              {/* Graphe barres — fond blanc */}
              <div className="px-5 pb-6 pt-4 bg-white">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-gray-400 text-xs font-semibold">Conversions — 7 derniers jours</span>
                  <span className="text-gray-300 text-xs">vs semaine préc.</span>
                </div>
                <div className="flex items-end gap-2 h-24">
                  {ANALYTICS_BARS.map((h, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1">
                      <div
                        className="w-full rounded-lg"
                        style={{
                          height: `${h}%`,
                          background: i === ANALYTICS_BARS.length - 1
                            ? 'linear-gradient(to top,#5B47F5,#a78bfa)'
                            : 'rgba(91,71,245,0.15)',
                        }}
                      />
                    </div>
                  ))}
                </div>
                <div className="flex justify-between mt-2">
                  {['Lun','Mar','Mer','Jeu','Ven','Sam','Dim'].map(d => (
                    <span key={d} className="flex-1 text-center text-gray-300 text-xs">{d}</span>
                  ))}
                </div>
              </div>

              {/* Ligne heatmap — fond lavande très clair */}
              <div
                className="mx-5 mb-5 rounded-2xl px-4 py-3 flex items-center justify-between"
                style={{ background: '#f5f3ff', border: '1px solid #e8e2ff' }}
              >
                <span className="text-gray-400 text-xs">Scroll depth moyen</span>
                <div className="flex items-center gap-2">
                  <div className="flex gap-0.5">
                    {[100, 85, 70, 52, 38, 24].map((w, i) => (
                      <div
                        key={i}
                        className="h-3 rounded-sm"
                        style={{
                          width: `${Math.max(w * 0.3, 6)}px`,
                          background: `rgba(91,71,245,${0.15 + i * 0.12})`,
                        }}
                      />
                    ))}
                  </div>
                  <span className="text-gray-700 font-bold text-sm">72%</span>
                </div>
              </div>
            </div>

            {/* Floating card CVR */}
            <div
              className="float-card absolute -bottom-4 -right-6 hidden lg:flex items-center gap-3 px-4 py-3 rounded-2xl shadow-2xl"
              style={{
                background: 'rgba(16,185,129,0.92)',
                backdropFilter: 'blur(12px)',
              }}
            >
              <TrendUp className="w-5 h-5 text-white" />
              <div>
                <p className="text-white font-black text-lg leading-none">+5.2%</p>
                <p className="text-white/70 text-xs">CVR vs mois dernier</p>
              </div>
            </div>
          </div>

          {/* Right — texte */}
          <div>
            <h2 className="reveal text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 tracking-tight mb-6 leading-tight">
              Tu sais exactement où tu perds de l&apos;argent.
            </h2>
            <p className="reveal delay-1 text-lg text-gray-500 leading-relaxed mb-10">
              Scroll depth, CVR, ROAS par page — tout en temps réel. Tu vois où tes visiteurs décrochent, tu corriges en quelques secondes. Fini de dépenser en aveugle.
            </p>
            <Link href="/features" className="reveal delay-2 inline-flex items-center gap-4 group">
              <span className="font-bold text-gray-900 text-sm">Voir les analytics</span>
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center transition-transform group-hover:scale-110"
                style={{ background: '#b5f23d' }}
              >
                <ArrowRight className="w-5 h-5 text-gray-900" />
              </div>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
/* ═══════════════════════════════════════════════════════════════════════════
   PUBLISH SECTION
═══════════════════════════════════════════════════════════════════════════ */
const PUBLISH_PLATFORM_ICONS: Record<string, ReactNode> = {
  Shopify: (
    <svg viewBox="0 0 24 24" style={{ width: 28, height: 28, fill: '#96BF48' }}>
      <path d="M15.337 23.979l7.216-1.561s-2.604-17.613-2.625-17.73c-.018-.116-.114-.192-.211-.192s-1.929-.136-1.929-.136-1.275-1.274-1.439-1.411c-.045-.037-.075-.057-.121-.074l-.914 21.104h.023zM11.71 11.305s-.81-.424-1.774-.424c-1.447 0-1.504.906-1.504 1.141 0 1.232 3.24 1.715 3.24 4.629 0 2.295-1.44 3.76-3.406 3.76-2.354 0-3.54-1.465-3.54-1.465l.646-2.086s1.245 1.066 2.28 1.066c.675 0 .975-.545.975-.932 0-1.619-2.654-1.694-2.654-4.359-.034-2.237 1.571-4.416 4.827-4.416 1.257 0 1.875.361 1.875.361l-.945 2.715-.02.01zM11.17.83c.136 0 .271.038.405.135-.984.465-2.064 1.639-2.508 3.992-.656.213-1.293.405-1.889.578C7.697 3.75 8.951.84 11.17.84V.83zm1.235 2.949v.135c-.754.232-1.583.484-2.394.736.466-1.777 1.333-2.645 2.085-2.971.193.501.309 1.176.309 2.1zm.539-2.234c.694.074 1.141.867 1.429 1.755-.349.114-.735.231-1.158.366v-.252c0-.752-.096-1.371-.271-1.871v.002zm2.992 1.289c-.02 0-.06.021-.078.021s-.289.075-.714.21c-.423-1.233-1.176-2.37-2.508-2.37h-.115C12.135.209 11.669 0 11.265 0 8.159 0 6.675 3.877 6.21 5.846c-1.194.365-2.063.636-2.16.674-.675.213-.694.232-.772.87-.075.462-1.83 14.063-1.83 14.063L15.009 24l.927-21.166z"/>
    </svg>
  ),
  WooCommerce: (
    <svg viewBox="0 0 24 24" style={{ width: 28, height: 28, fill: '#7F54B3' }}>
      <path d="M21.994 9.28a2.19 2.19 0 0 0-1.818-.98H2.805A2.19 2.19 0 0 0 .628 10.46l1.34 7.993a2.19 2.19 0 0 0 2.157 1.822h15.74a2.19 2.19 0 0 0 2.157-1.822l1.34-7.994a2.19 2.19 0 0 0-.368-1.178zM6.129 16.27c-.37 0-.7-.218-.855-.556l-1.312-2.842-.29 2.27a.938.938 0 0 1-.929.816.938.938 0 0 1-.937-.938.929.929 0 0 1 .009-.128l.573-4.478a.938.938 0 0 1 1.792-.231l1.95 4.223 1.95-4.223a.938.938 0 0 1 1.793.231l.572 4.478a.938.938 0 0 1-.928 1.066.938.938 0 0 1-.929-.816l-.29-2.27-1.311 2.842a.938.938 0 0 1-.856.556zm7.5 0c-.37 0-.7-.218-.855-.556l-1.311-2.842-.291 2.27a.938.938 0 0 1-.928.816.938.938 0 0 1-.938-.938.929.929 0 0 1 .009-.128l.573-4.478a.938.938 0 0 1 1.792-.231l1.95 4.223 1.949-4.223a.938.938 0 0 1 1.793.231l.573 4.478a.929.929 0 0 1 .009.128.938.938 0 0 1-.938.938.938.938 0 0 1-.929-.816l-.29-2.27-1.311 2.842a.938.938 0 0 1-.856.556zm6.57-.468a2.104 2.104 0 1 1 0-4.209 2.104 2.104 0 0 1 0 4.21z"/>
    </svg>
  ),
  'Export HTML': (
    <div style={{ width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(14,165,233,0.15)', borderRadius: 6 }}>
      <span style={{ color: '#5B47F5', fontWeight: 900, fontSize: 13, letterSpacing: '-0.5px', fontFamily: 'monospace' }}>&lt;/&gt;</span>
    </div>
  ),
}
const PUBLISH_PLATFORMS = [
  { name: 'Shopify',     color: '#96BF48', status: 'Publié',   time: 'Il y a 2 min' },
  { name: 'WooCommerce', color: '#7F54B3', status: 'En ligne',  time: 'Il y a 1h' },
  { name: 'Export HTML', color: '#0ea5e9', status: 'Prêt',      time: 'À télécharger' },
]

export function PublishSection() {
  return (
    <section style={{ background: '#ffffff' }}>
      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-24">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-20 items-center">

          {/* Left — texte */}
          <div>
            <h2 className="reveal text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 tracking-tight mb-6 leading-tight">
              Ta page générée. Sur ta boutique. En 60 secondes.
            </h2>
            <p className="reveal delay-1 text-lg text-gray-500 leading-relaxed mb-10">
              Shopify, WooCommerce ou export HTML — un clic et c&apos;est en ligne. Pas de copier-coller, pas de développeur, pas d&apos;attente. Tu publies, tes clients achètent.
            </p>
            <Link href="/integrations" className="reveal delay-2 inline-flex items-center gap-4 group">
              <span className="font-bold text-gray-900 text-sm">Voir les intégrations</span>
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center transition-transform group-hover:scale-110"
                style={{ background: '#b5f23d' }}
              >
                <ArrowRight className="w-5 h-5 text-gray-900" />
              </div>
            </Link>
          </div>

          {/* Right — mockup publish */}
          <div className="flex items-center justify-center relative mt-6 lg:mt-0">
            <div
              className="reveal w-full max-w-md rounded-3xl overflow-hidden shadow-2xl"
              style={{ background: '#ffffff', border: '1.5px solid #e8e2ff' }}
            >
              {/* Header — chrome sombre */}
              <div
                className="flex items-center justify-between px-5 py-3.5"
                style={{ background: '#1a1b2e', borderBottom: '1px solid rgba(255,255,255,0.06)' }}
              >
                <div className="flex items-center gap-3">
                  <div className="flex gap-1.5">
                    {['#ef4444','#f59e0b','#10b981'].map(c => (
                      <div key={c} className="w-2.5 h-2.5 rounded-full" style={{ background: c }} />
                    ))}
                  </div>
                  <span className="text-white/50 text-xs font-semibold">Publier la page</span>
                </div>
                <div
                  className="px-3 py-1 rounded-full text-xs font-bold text-white"
                  style={{ background: 'linear-gradient(135deg,#5B47F5,#7c6af7)' }}
                >
                  1 clic
                </div>
              </div>

              {/* Aperçu page — mini page produit KONVERT */}
              <div className="mx-5 mt-5 rounded-2xl overflow-hidden" style={{ border: '1px solid #e8e2ff' }}>
                {/* Bannière produit gradient violet */}
                <div
                  className="relative flex items-center justify-between px-4"
                  style={{ height: '90px', background: 'linear-gradient(135deg,#4c1d95 0%,#5B47F5 55%,#7c6af7 100%)' }}
                >
                  {/* Cercles déco */}
                  <div style={{ position: 'absolute', top: -15, right: -15, width: 60, height: 60, borderRadius: '50%', background: 'rgba(255,255,255,0.07)' }} />
                  <div style={{ position: 'absolute', bottom: -10, left: 30, width: 40, height: 40, borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }} />
                  {/* Contenu produit */}
                  <div className="relative z-10">
                    <div className="text-[10px] font-bold text-white/60 mb-0.5">RUNNING PRO X</div>
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-white font-black text-base">€79.90</span>
                      <span className="text-white/40 text-xs line-through">€129</span>
                    </div>
                  </div>
                  {/* Bouton acheter */}
                  <div
                    className="relative z-10 px-3 py-1.5 rounded-lg text-[11px] font-black text-gray-900"
                    style={{ background: '#fff' }}
                  >
                    Acheter
                  </div>
                </div>
                {/* Barre URL */}
                <div className="px-3 py-2 flex items-center justify-between" style={{ background: '#f8f6ff' }}>
                  <span className="text-gray-400 text-xs font-mono">konvertpilot.com/p/running-pro</span>
                  <span
                    className="text-xs font-bold px-2 py-0.5 rounded-full"
                    style={{ background: 'rgba(16,185,129,0.12)', color: '#10b981' }}
                  >
                    Live
                  </span>
                </div>
              </div>

              {/* Plateformes — fond clair */}
              <div className="px-5 py-5 flex flex-col gap-3">
                {PUBLISH_PLATFORMS.map((p) => (
                  <div
                    key={p.name}
                    className="flex items-center gap-4 px-4 py-3.5 rounded-2xl"
                    style={{ background: '#f8f6ff', border: '1px solid #ede8ff' }}
                  >
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background: `${p.color}15`, border: `1px solid ${p.color}28` }}
                    >
                      {PUBLISH_PLATFORM_ICONS[p.name]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-gray-800 text-sm font-semibold">{p.name}</div>
                      <div className="text-gray-400 text-xs">{p.time}</div>
                    </div>
                    <div
                      className="flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full flex-shrink-0"
                      style={{ background: 'rgba(16,185,129,0.1)', color: '#10b981' }}
                    >
                      <div className="w-1.5 h-1.5 rounded-full" style={{ background: '#10b981' }} />
                      {p.status}
                    </div>
                  </div>
                ))}
              </div>

              {/* Bouton publish */}
              <div className="px-5 pb-5">
                <div
                  className="w-full py-3.5 rounded-2xl text-center text-white font-bold text-sm"
                  style={{ background: 'linear-gradient(135deg,#5B47F5,#7c6af7)', boxShadow: '0 4px 20px rgba(91,71,245,0.35)' }}
                >
                  Publier sur toutes les plateformes
                </div>
              </div>
            </div>

            {/* Floating success toast */}
            <div
              className="float-anim absolute -top-4 -left-6 hidden lg:flex items-center gap-3 px-4 py-3 rounded-2xl shadow-2xl"
              style={{
                background: 'rgba(15,17,30,0.95)',
                backdropFilter: 'blur(12px)',
                border: '1px solid rgba(16,185,129,0.3)',
              }}
            >
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ background: 'rgba(16,185,129,0.2)' }}
              >
                <Check className="w-4 h-4" style={{ color: '#10b981' }} />
              </div>
              <div>
                <p className="text-white font-bold text-sm leading-none mb-0.5">Publiée sur Shopify</p>
                <p className="text-white/40 text-xs">À l&apos;instant</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
/* ═══════════════════════════════════════════════════════════════════════════
   TESTIMONIALS
═══════════════════════════════════════════════════════════════════════════ */
const TESTIMONIALS = [
  {
    name: 'Thomas M.',
    role: 'Dropshipper · Shopify',
    avatar: 'T',
    color: '#5B47F5',
    quote: 'J\'ai généré ma première landing page en 45 secondes. Mon taux de conversion a grimpé de 5.2% dès le lendemain. KONVERT est l\'outil que j\'attendais.',
    stars: 5,
    stat: '+5.2% CVR',
  },
  {
    name: 'Sarah K.',
    role: 'Agence SMMA · 23 clients',
    avatar: 'S',
    color: '#10b981',
    quote: 'On gère 23 boutiques clients depuis un seul dashboard. La fonctionnalité white-label nous a permis de vendre KONVERT comme un service premium à 500€/mois.',
    stars: 5,
    stat: '23 clients',
  },
  {
    name: 'Julien R.',
    role: 'E-commerce · Beauté',
    avatar: 'J',
    color: '#f97316',
    quote: 'Mon ROAS est passé de x1.4 à x4.2 en 3 semaines. Les templates beauté sont absolument parfaits pour ma niche. Je ne reviendrai jamais en arrière.',
    stars: 5,
    stat: 'ROAS x4.2',
  },
  {
    name: 'Camille L.',
    role: 'Mode Femme · Shopify',
    avatar: 'C',
    color: '#ec4899',
    quote: 'En mode, l\'image c\'est tout. KONVERT m\'a permis de créer des pages produit qui respirent le luxe sans passer des heures sur Figma. Mes bounces ont chuté de 62%.',
    stars: 5,
    stat: '-62% bounce',
  },
]

export function Testimonials() {
  return (
    <section style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 50%, rgba(91,71,245,0.22) 0%, transparent 60%), radial-gradient(ellipse 40% 30% at 5% 100%, rgba(167,139,250,0.12) 0%, transparent 55%), #0e0d1e' }}>
      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-14 sm:py-24">
        <div className="text-center mb-10 sm:mb-14">
          <div
            className="reveal inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold mb-4"
            style={{ background: 'rgba(91,71,245,0.18)', color: '#a78bfa', border: '1px solid rgba(91,71,245,0.3)' }}
          >
            <Star className="w-3.5 h-3.5" />
            Témoignages
          </div>
          <h2 className="reveal delay-1 text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight mb-4">
            Ils ont transformé leurs résultats.
          </h2>
          <p className="reveal delay-2 text-lg text-white/60 max-w-xl mx-auto">
            Des e-commerçants et agences qui utilisent KONVERT au quotidien.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t, i) => (
            <div
              key={t.name}
              className="reveal p-6 rounded-2xl flex flex-col gap-4"
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
                backdropFilter: 'blur(12px)',
                transitionDelay: `${i * 0.1}s`,
              }}
            >
              <div className="flex gap-1">
                {Array.from({ length: t.stars }).map((_, s) => (
                  <Star key={s} className="w-4 h-4 fill-current" style={{ color: '#f59e0b' }} />
                ))}
              </div>
              <p className="text-white/75 leading-relaxed text-sm flex-1">&ldquo;{t.quote}&rdquo;</p>
              <div className="flex items-center justify-between pt-2" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                <div className="flex items-center gap-3">
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center font-black text-white text-sm"
                    style={{ background: t.color }}
                  >
                    {t.avatar}
                  </div>
                  <div>
                    <div className="text-white font-semibold text-sm">{t.name}</div>
                    <div className="text-white/40 text-xs">{t.role}</div>
                  </div>
                </div>
                <span
                  className="text-xs font-bold px-2.5 py-1 rounded-full"
                  style={{ background: `${t.color}22`, color: t.color }}
                >
                  {t.stat}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="reveal text-center mt-10">
          <Link
            href="/testimonials"
            className="inline-flex items-center gap-2 text-sm font-semibold transition-opacity hover:opacity-70"
            style={{ color: '#a78bfa' }}
          >
            Voir tous les avis <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}