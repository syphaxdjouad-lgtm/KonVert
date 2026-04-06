'use client'

import Link from 'next/link'
import { useState, useEffect, useRef } from 'react'
import {
  Bot,
  Palette,
  BarChart3,
  Link2,
  FlaskConical,
  Globe,
  ChevronDown,
  ChevronUp,
  Menu,
  X,
  ArrowRight,
  Check,
  Star,
  Zap,
  TrendingUp,
  ShoppingBag,
  Building2,
  UserCircle,
  Play,
  Sparkles,
  Shield,
  Clock,
} from 'lucide-react'

/* ════════════════════════════════════════════════════════════════════════════
   STYLES GLOBAUX — keyframes non-expressibles en Tailwind
════════════════════════════════════════════════════════════════════════════ */
const GLOBAL_CSS = `
  @keyframes marquee {
    from { transform: translateX(0); }
    to   { transform: translateX(-50%); }
  }
  @keyframes float {
    0%, 100% { transform: translateY(0px) rotate(0deg); }
    33%       { transform: translateY(-8px) rotate(0.5deg); }
    66%       { transform: translateY(-4px) rotate(-0.5deg); }
  }
  @keyframes pulse-ring {
    0%   { transform: scale(1);   opacity: 0.6; }
    100% { transform: scale(1.6); opacity: 0; }
  }
  @keyframes shimmer {
    from { background-position: -200% 0; }
    to   { background-position:  200% 0; }
  }

  /* Marquee */
  .marquee-wrap  { display: flex; overflow: hidden; user-select: none; }
  .marquee-track { display: flex; flex-shrink: 0; animation: marquee 32s linear infinite; }
  .marquee-track:hover { animation-play-state: paused; }

  /* Float */
  .float-anim { animation: float 5s ease-in-out infinite; }

  /* Scroll reveal */
  .reveal {
    opacity: 0;
    transform: translateY(28px);
    transition: opacity 0.65s cubic-bezier(.16,1,.3,1),
                transform 0.65s cubic-bezier(.16,1,.3,1);
  }
  .reveal.visible { opacity: 1; transform: translateY(0); }
  .delay-100 { transition-delay: 0.10s; }
  .delay-200 { transition-delay: 0.20s; }
  .delay-300 { transition-delay: 0.30s; }
  .delay-400 { transition-delay: 0.40s; }
  .delay-500 { transition-delay: 0.50s; }

  /* Shimmer bouton */
  .btn-shimmer {
    background: linear-gradient(
      90deg,
      #5B47F5 0%, #7c6af7 40%, #5B47F5 60%, #4a38e0 100%
    );
    background-size: 200% 100%;
    animation: shimmer 2.4s linear infinite;
  }
  .btn-shimmer:hover { animation-play-state: paused; background-position: 0 0; }

  /* Pulse ring pour le bouton hero */
  .pulse-ring::before {
    content: '';
    position: absolute;
    inset: -4px;
    border-radius: 9999px;
    border: 2px solid #5B47F5;
    animation: pulse-ring 1.8s ease-out infinite;
  }
`

/* ════════════════════════════════════════════════════════════════════════════
   HOOKS
════════════════════════════════════════════════════════════════════════════ */
function useReveal() {
  useEffect(() => {
    const nodes = Array.from(document.querySelectorAll<HTMLElement>('.reveal'))
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add('visible') }),
      { threshold: 0.08, rootMargin: '0px 0px -48px 0px' }
    )
    nodes.forEach((n) => io.observe(n))
    return () => io.disconnect()
  }, [])
}

function useCounter(target: number, durationMs: number, triggered: boolean): number {
  const [val, setVal] = useState(0)
  useEffect(() => {
    if (!triggered) return
    const startTime = performance.now()
    const tick = (now: number) => {
      const elapsed = Math.min((now - startTime) / durationMs, 1)
      const eased = 1 - Math.pow(1 - elapsed, 3) // ease-out-cubic
      setVal(Math.round(eased * target))
      if (elapsed < 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  }, [target, durationMs, triggered])
  return val
}

/* ════════════════════════════════════════════════════════════════════════════
   DONNÉES STATIQUES
════════════════════════════════════════════════════════════════════════════ */

const NAV_LINKS = [
  { label: 'Fonctionnalités', href: '#features' },
  { label: 'Templates',       href: '#templates' },
  { label: 'Intégrations',    href: '#integrations' },
  { label: 'Tarifs',          href: '#pricing' },
  { label: 'Ressources',      href: '#faq' },
]

const MARQUEE_BRANDS = [
  'Shopify', 'WooCommerce', 'AliExpress', 'Amazon', 'Alibaba',
  'Claude AI', 'Stripe', 'Klaviyo', 'Zapier', 'Meta Ads',
]

const STATS = [
  { target: 50000, suffix: '+',  label: 'pages générées',            color: 'text-[#5B47F5]' },
  { target: 40,    suffix: '%',  label: 'de conversion en plus',     color: 'text-emerald-400' },
  { target: 2800,  suffix: '+',  label: 'boutiques connectées',      color: 'text-white' },
]

const FEATURES = [
  {
    Icon: Bot,
    title: 'Génération IA',
    desc:  'Le copy de vos pages est rédigé automatiquement par Claude AI. Accroche, bénéfices, FAQ, CTA — tout en 30 secondes.',
    accent: '#5B47F5',
    bg:     'bg-[#5B47F5]/10',
    label:  'text-[#5B47F5]',
  },
  {
    Icon: Palette,
    title: '5 Templates Premium',
    desc:  'Shein Pro, Minimal Dark, Clean White, Bold Orange, Premium Glass. Chaque template optimisé pour convertir.',
    accent: '#ec4899',
    bg:     'bg-pink-50',
    label:  'text-pink-500',
  },
  {
    Icon: BarChart3,
    title: 'Analytics Intégrés',
    desc:  'Suivez les vues, clics CTA, scroll depth et conversions en temps réel. Prenez des décisions basées sur les données.',
    accent: '#10b981',
    bg:     'bg-emerald-50',
    label:  'text-emerald-500',
  },
  {
    Icon: Link2,
    title: 'Intégration Shopify & Woo',
    desc:  'Publiez votre page directement sur votre boutique en un clic. OAuth sécurisé, synchronisation automatique.',
    accent: '#f97316',
    bg:     'bg-orange-50',
    label:  'text-orange-500',
  },
  {
    Icon: FlaskConical,
    title: 'A/B Testing',
    desc:  'Testez plusieurs versions de votre page simultanément. Gardez ce qui performe. Supprimez ce qui ne convertit pas.',
    accent: '#3b82f6',
    bg:     'bg-blue-50',
    label:  'text-blue-500',
  },
  {
    Icon: Globe,
    title: '8 Langues',
    desc:  'Générez vos pages en FR, EN, ES, DE, IT, PT, AR, ZH. Touchez des marchés internationaux sans effort.',
    accent: '#14b8a6',
    bg:     'bg-teal-50',
    label:  'text-teal-500',
  },
]

const SOLUTIONS = [
  {
    Icon:  ShoppingBag,
    title: 'Dropshippers',
    desc:  'Testez des dizaines de produits par semaine sans dépenser des heures à créer des pages. Importez, générez, publiez.',
    color: 'text-[#5B47F5]',
    bg:    'bg-[#5B47F5]/10',
  },
  {
    Icon:  Building2,
    title: 'Agences SMMA',
    desc:  'Gérez plusieurs clients depuis un seul dashboard. White-label, rapports PDF, workspace multi-clients inclus.',
    color: 'text-pink-500',
    bg:    'bg-pink-50',
  },
  {
    Icon:  TrendingUp,
    title: 'Marques E-commerce',
    desc:  "Créez des pages produit premium qui reflètent votre identité de marque. Personnalisation totale avec le builder.",
    color: 'text-emerald-500',
    bg:    'bg-emerald-50',
  },
  {
    Icon:  UserCircle,
    title: 'Entrepreneurs Solo',
    desc:  "Lancez votre boutique rapidement sans compétences techniques. Tout est automatisé, de l'import à la publication.",
    color: 'text-orange-500',
    bg:    'bg-orange-50',
  },
]

const STEPS = [
  {
    num:   '01',
    title: 'Collez une URL',
    desc:  "Entrez l'URL d'un produit AliExpress, Amazon ou Alibaba. KONVERT scrape automatiquement les données produit : titre, images, prix, description.",
    icon:  Link2,
  },
  {
    num:   '02',
    title: 'Personnalisez',
    desc:  "Choisissez votre template, la langue, ajoutez vos visuels UGC et photos avant/après. Claude AI génère le copy optimisé en temps réel.",
    icon:  Sparkles,
  },
  {
    num:   '03',
    title: 'Publiez & Convertissez',
    desc:  'Publiez sur Shopify ou WooCommerce en 1 clic. Suivez vos conversions, lancez vos A/B tests et optimisez en continu.',
    icon:  TrendingUp,
  },
]

const TEMPLATES = [
  {
    name: 'Shein Pro',
    tag:  'Premium',
    desc: 'Inspiré des meilleurs codes de la mode fast. Conversion maximale.',
    bg:   'from-[#5B47F5] to-[#8b77ff]',
    tagStyle: 'bg-white/20 text-white',
    text: 'text-white',
  },
  {
    name: 'Minimal Dark',
    tag:  'Épuré',
    desc: 'Élégance sombre pour les produits premium et tech.',
    bg:   'from-gray-900 to-gray-800',
    tagStyle: 'bg-white/10 text-gray-300',
    text: 'text-white',
  },
  {
    name: 'Clean White',
    tag:  'Classique',
    desc: 'Fond blanc, typographie forte. Universel et rassurant.',
    bg:   'from-gray-100 to-white',
    tagStyle: 'bg-gray-200 text-gray-600',
    text: 'text-gray-900',
    border: 'border border-gray-200',
  },
  {
    name: 'Bold Orange',
    tag:  'Impact',
    desc: 'Energie, urgence et CTA agressifs pour le direct response.',
    bg:   'from-orange-500 to-orange-400',
    tagStyle: 'bg-white/20 text-white',
    text: 'text-white',
  },
  {
    name: 'Premium Glass',
    tag:  'Glassmorphism',
    desc: 'Effet verre sur gradient bleu-indigo. Luxe et modernité.',
    bg:   'from-blue-600 to-indigo-700',
    tagStyle: 'bg-white/20 text-white',
    text: 'text-white',
  },
]

const INTEGRATIONS = [
  { name: 'Shopify',      desc: 'Publiez en 1 clic',      icon: '🛍️', color: 'text-emerald-600', bg: 'bg-emerald-50',    border: 'border-emerald-100' },
  { name: 'WooCommerce',  desc: 'Sync automatique',       icon: '🛒', color: 'text-purple-600',  bg: 'bg-purple-50',     border: 'border-purple-100' },
  { name: 'AliExpress',   desc: 'Import produit',         icon: '📦', color: 'text-orange-500',  bg: 'bg-orange-50',     border: 'border-orange-100' },
  { name: 'Amazon',       desc: 'Scraping automatique',   icon: '📬', color: 'text-yellow-600',  bg: 'bg-yellow-50',     border: 'border-yellow-100' },
  { name: 'Alibaba',      desc: 'B2B & grossiste',        icon: '🏭', color: 'text-red-500',     bg: 'bg-red-50',        border: 'border-red-100' },
  { name: 'Claude AI',    desc: 'Copy IA natif',          icon: '🤖', color: 'text-[#5B47F5]',   bg: 'bg-[#5B47F5]/8',  border: 'border-[#5B47F5]/20' },
  { name: 'Stripe',       desc: 'Paiements sécurisés',    icon: '💳', color: 'text-blue-600',    bg: 'bg-blue-50',       border: 'border-blue-100' },
  { name: 'Klaviyo',      desc: 'Email marketing',        icon: '📧', color: 'text-green-600',   bg: 'bg-green-50',      border: 'border-green-100' },
  { name: 'Zapier',       desc: '5 000+ automatisations', icon: '⚡', color: 'text-orange-600',  bg: 'bg-orange-50',     border: 'border-orange-100' },
  { name: 'Meta Ads',     desc: 'Tracking pixel',         icon: '🎯', color: 'text-blue-700',    bg: 'bg-blue-50',       border: 'border-blue-100' },
]

const TESTIMONIALS = [
  {
    name:     'Thomas M.',
    role:     'Dropshipper • Paris',
    avatar:   'TM',
    avatarBg: 'bg-[#5B47F5]',
    stars:    5,
    tag:      '1,4% → 5,2% CVR',
    tagColor: 'bg-emerald-100 text-emerald-700',
    verified: true,
    since:    'Utilisateur depuis 6 mois',
    quote:    "J'ai testé 12 produits en une semaine grâce à KONVERT. Mon taux de conversion est passé de 1,4% à 5,2%. C'est hallucinant — jamais vu une telle différence avec d'autres outils.",
  },
  {
    name:     'Sarah K.',
    role:     'Directrice Agence SMMA • Lyon',
    avatar:   'SK',
    avatarBg: 'bg-emerald-500',
    stars:    5,
    tag:      '23 clients en 1 dashboard',
    tagColor: 'bg-blue-100 text-blue-700',
    verified: true,
    since:    'Plan Agency depuis 8 mois',
    quote:    "On gère 23 clients depuis un seul dashboard. Le gain de temps est énorme. KONVERT a complètement changé notre façon de livrer des résultats à nos clients e-commerce.",
  },
  {
    name:     'Julien R.',
    role:     'E-commerçant Shopify • Bordeaux',
    avatar:   'JR',
    avatarBg: 'bg-orange-500',
    stars:    5,
    tag:      'ROAS 0.9x → 3.4x',
    tagColor: 'bg-orange-100 text-orange-700',
    verified: true,
    since:    'Plan Pro depuis 4 mois',
    quote:    "Ma page Shein Pro a fait x3 sur mon ROAS en 2 semaines. La génération IA est bluffante de précision. Le copy généré est meilleur que ce que je faisais en 3 heures de travail.",
  },
]

const FAQS = [
  {
    q: 'Comment fonctionne la génération IA ?',
    a: "KONVERT scrape automatiquement les données du produit depuis l'URL que vous fournissez (titre, images, description, prix, variantes). Ensuite, Claude AI rédige le copy complet de votre landing page : accroche percutante, proposition de valeur unique, liste de bénéfices, FAQ personnalisée et CTA optimisés pour la conversion. Le tout en moins de 30 secondes.",
  },
  {
    q: 'KONVERT est-il compatible avec mon thème Shopify ?',
    a: "Oui. KONVERT génère des pages autonomes publiées sur votre Shopify via l'API native. Elles fonctionnent indépendamment de votre thème actif et peuvent être utilisées comme pages produit, pages de collection ou landing pages dédiées à vos campagnes publicitaires. Aucune modification de thème requise.",
  },
  {
    q: 'Puis-je modifier les pages générées ?',
    a: "Absolument. Après la génération automatique, vous avez accès au builder drag & drop (plan Pro et plus) pour modifier chaque section : changer les couleurs, remplacer les images, éditer le texte, réorganiser les blocs et ajouter vos éléments personnalisés. La page générée est un point de départ solide, pas une contrainte.",
  },
  {
    q: "Y a-t-il une limite de pages par mois ?",
    a: "Le plan Starter est limité à 10 pages générées par mois. Le plan Pro et le plan Agence proposent des pages illimitées. Les pages déjà publiées ne comptent pas dans la limite mensuelle — seule la génération de nouvelles pages est comptabilisée.",
  },
  {
    q: "Proposez-vous une période d'essai gratuite ?",
    a: "Oui. Tous les plans bénéficient d'un essai gratuit de 14 jours, sans carte de crédit requise. Vous avez accès à toutes les fonctionnalités du plan Pro pendant cette période. Aucune facturation automatique à la fin de l'essai — vous choisissez librement de continuer ou d'annuler.",
  },
]

const PRICING = [
  {
    name:      'Starter',
    monthly:   29,
    annual:    23,
    desc:      'Pour démarrer et valider vos premiers produits.',
    badge:     null,
    highlight: false,
    features:  [
      '10 pages générées / mois',
      '2 boutiques connectées',
      '3 templates inclus',
      'Analytics de base',
      'Support email 48h',
      'Export page HTML',
    ],
    cta:      'Commencer gratuitement',
    ctaCls:   'border-2 border-gray-200 text-gray-800 hover:border-[#5B47F5] hover:text-[#5B47F5]',
  },
  {
    name:      'Pro',
    monthly:   79,
    annual:    63,
    desc:      'La solution complète pour scaler vos ventes.',
    badge:     'Le plus populaire',
    highlight: true,
    features:  [
      'Pages illimitées',
      '10 boutiques connectées',
      '5 templates premium',
      'Analytics avancés',
      'A/B testing intégré',
      '8 langues supportées',
      'Builder drag & drop',
      'Support prioritaire 24h',
    ],
    cta:    'Essai gratuit 14 jours',
    ctaCls: '',
  },
  {
    name:      'Agence',
    monthly:   199,
    annual:    159,
    desc:      'Pour les agences et équipes multi-clients.',
    badge:     null,
    highlight: false,
    features:  [
      'Tout du plan Pro inclus',
      'Workspaces clients illimités',
      'White-label complet',
      'Rapports PDF automatisés',
      'API privée KONVERT',
      'Onboarding personnalisé',
      'Support dédié & SLA',
      'Facturation groupée clients',
    ],
    cta:    'Contacter les ventes',
    ctaCls: 'border-2 border-gray-200 text-gray-800 hover:border-[#5B47F5] hover:text-[#5B47F5]',
  },
]

const FOOTER_COLS = [
  {
    title: 'Produit',
    links: ['Fonctionnalités', 'Templates', 'Intégrations', 'Tarifs', 'Changelog', 'Roadmap'],
  },
  {
    title: 'Ressources',
    links: ['Documentation', 'Blog', 'Tutoriels vidéo', 'Cas clients', 'Support', 'Statut'],
  },
  {
    title: 'Entreprise',
    links: ['À propos', 'Carrières', 'Partenaires', 'Programme affiliés', 'Presse', 'Contact'],
  },
  {
    title: 'Légal',
    links: ['Confidentialité', 'CGU', 'Cookies', 'RGPD', 'Sécurité'],
  },
]

/* ════════════════════════════════════════════════════════════════════════════
   SOUS-COMPOSANTS
════════════════════════════════════════════════════════════════════════════ */

/* --- Compteur animé dans la section stats --- */
function AnimStat({
  target, suffix, label, color, triggered,
}: { target: number; suffix: string; label: string; color: string; triggered: boolean }) {
  const val = useCounter(target, 1800, triggered)
  return (
    <div className="flex flex-col items-center text-center px-4">
      <span className={`text-5xl sm:text-6xl font-black tabular-nums leading-none ${color}`}>
        {val >= 1000 ? val.toLocaleString('fr-FR') : val}
        {suffix}
      </span>
      <span className="mt-4 text-sm text-gray-400 max-w-[160px] leading-snug">{label}</span>
    </div>
  )
}

/* --- FAQ item avec accordion --- */
function FaqItem({ q, a, open, onToggle }: { q: string; a: string; open: boolean; onToggle: () => void }) {
  return (
    <div
      className={`border rounded-2xl overflow-hidden transition-all duration-300 ${
        open ? 'border-[#5B47F5]/40 shadow-md shadow-[#5B47F5]/5' : 'border-gray-100 bg-white hover:border-gray-200'
      } bg-white`}
    >
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-6 py-5 text-left gap-4 group"
        aria-expanded={open}
      >
        <span className={`font-semibold text-sm sm:text-base leading-snug transition-colors ${open ? 'text-[#5B47F5]' : 'text-gray-900 group-hover:text-[#5B47F5]'}`}>
          {q}
        </span>
        <span className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center transition-all ${open ? 'bg-[#5B47F5] rotate-0' : 'bg-gray-100'}`}>
          {open
            ? <ChevronUp className="w-4 h-4 text-white" />
            : <ChevronDown className="w-4 h-4 text-gray-500" />}
        </span>
      </button>
      {open && (
        <div className="px-6 pb-6">
          <p className="text-sm text-gray-500 leading-relaxed">{a}</p>
        </div>
      )}
    </div>
  )
}

/* ════════════════════════════════════════════════════════════════════════════
   PAGE PRINCIPALE
════════════════════════════════════════════════════════════════════════════ */
export default function Home() {
  useReveal()

  /* State */
  const [menuOpen,     setMenuOpen]     = useState(false)
  const [scrolled,     setScrolled]     = useState(false)
  const [urlInput,     setUrlInput]     = useState('')
  const [billing,      setBilling]      = useState<'monthly' | 'annual'>('monthly')
  const [openFaq,      setOpenFaq]      = useState<number | null>(null)
  const [statsVisible, setStatsVisible] = useState(false)

  /* Refs */
  const statsRef = useRef<HTMLElement>(null)

  /* Nav au scroll */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  /* Observer stats */
  useEffect(() => {
    const el = statsRef.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setStatsVisible(true) },
      { threshold: 0.25 }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  /* Handler URL submit */
  const handleGenerate = () => {
    if (!urlInput.trim()) return
    window.location.href = `/generate?url=${encodeURIComponent(urlInput)}`
  }

  return (
    <>
      {/* ── Injection CSS global ─────────────────────────────────────────── */}
      <style dangerouslySetInnerHTML={{ __html: GLOBAL_CSS }} />

      {/* ════════════════════════════════════════════════════════════════════
          1. NAV
      ════════════════════════════════════════════════════════════════════ */}
      <header
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100'
            : 'bg-white'
        }`}
      >
        <div className="max-w-7xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between gap-6">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 flex-shrink-0">
            <div className="w-8 h-8 rounded-xl bg-[#5B47F5] flex items-center justify-center shadow-md shadow-[#5B47F5]/30">
              <Zap className="w-4 h-4 text-white" strokeWidth={2.5} />
            </div>
            <span className="text-xl font-black text-gray-900 tracking-tight">
              Kon<span className="text-[#5B47F5]">vert</span>
            </span>
          </Link>

          {/* Navigation desktop */}
          <nav className="hidden lg:flex items-center gap-7">
            {NAV_LINKS.map((l) => (
              <Link
                key={l.label}
                href={l.href}
                className="text-sm font-medium text-gray-600 hover:text-[#5B47F5] transition-colors duration-150"
              >
                {l.label}
              </Link>
            ))}
          </nav>

          {/* CTA desktop */}
          <div className="hidden lg:flex items-center gap-3">
            <Link
              href="/login"
              className="text-sm font-semibold text-gray-600 hover:text-[#5B47F5] transition-colors px-3 py-2"
            >
              Se connecter
            </Link>
          </div>

          {/* Hamburger mobile */}
          <button
            className="lg:hidden w-9 h-9 flex items-center justify-center rounded-xl hover:bg-gray-100 transition-colors"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label={menuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
          >
            {menuOpen ? <X className="w-5 h-5 text-gray-700" /> : <Menu className="w-5 h-5 text-gray-700" />}
          </button>
        </div>

        {/* Mobile menu drawer */}
        {menuOpen && (
          <div className="lg:hidden bg-white border-t border-gray-100 px-5 pt-3 pb-5 shadow-lg">
            {NAV_LINKS.map((l) => (
              <Link
                key={l.label}
                href={l.href}
                onClick={() => setMenuOpen(false)}
                className="flex items-center py-3.5 text-base font-semibold text-gray-700 hover:text-[#5B47F5] border-b border-gray-50 last:border-0 transition-colors"
              >
                {l.label}
              </Link>
            ))}
            <div className="flex flex-col gap-3 pt-4">
              <Link href="/login" className="text-center text-sm font-semibold text-gray-600 py-2.5 rounded-xl hover:bg-gray-50 transition-colors">
                Se connecter
              </Link>
              <Link
                href="/signup"
                className="btn-shimmer text-white text-sm font-bold py-3.5 rounded-full text-center shadow-md shadow-[#5B47F5]/25"
              >
                Essai gratuit 14 jours
              </Link>
            </div>
          </div>
        )}
      </header>

      <main className="overflow-hidden">

        {/* ════════════════════════════════════════════════════════════════
            2. HERO
        ════════════════════════════════════════════════════════════════ */}
        <section className="pt-28 sm:pt-32 pb-20 bg-white relative">

          {/* Gradient de fond très subtil */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                'radial-gradient(ellipse 80% 50% at 50% -10%, rgba(91,71,245,0.06) 0%, transparent 70%)',
            }}
          />

          <div className="max-w-7xl mx-auto px-5 sm:px-8">
            <div className="grid lg:grid-cols-2 gap-14 items-center">

              {/* ── Colonne gauche ── */}
              <div className="relative z-10">

                {/* Badge overline */}
                <div className="inline-flex items-center gap-2 bg-[#5B47F5]/8 border border-[#5B47F5]/20 text-[#5B47F5] text-xs font-bold px-4 py-2 rounded-full mb-7 tracking-wide">
                  <Sparkles className="w-3.5 h-3.5" />
                  Powered by Claude AI
                </div>

                {/* H1 */}
                <h1 className="text-[2.6rem] sm:text-5xl lg:text-[3.4rem] font-black text-gray-900 leading-[1.08] tracking-tight mb-6">
                  Des pages produit<br />
                  qui{' '}
                  <span className="text-[#5B47F5]">convertissent.</span>
                  <br />
                  <span className="relative inline-block">
                    En 30 secondes.
                    <svg
                      aria-hidden
                      className="absolute -bottom-1.5 left-0 w-full"
                      viewBox="0 0 300 8"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M2 6 Q75 1 150 5 Q225 9 298 4"
                        stroke="#5B47F5"
                        strokeWidth="3"
                        strokeLinecap="round"
                        fill="none"
                        opacity="0.7"
                      />
                    </svg>
                  </span>
                </h1>

                {/* Sous-titre */}
                <p className="text-lg text-gray-500 leading-relaxed mb-9 max-w-xl">
                  Collez l'URL d'un produit AliExpress, Amazon ou Alibaba.
                  KONVERT génère une landing page haute conversion prête à publier
                  sur Shopify ou WooCommerce — en moins d'une minute.
                </p>

                {/* Input + CTA */}
                <div className="flex flex-col sm:flex-row gap-3 mb-5">
                  <input
                    type="url"
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
                    placeholder="https://aliexpress.com/item/..."
                    className="flex-1 min-w-0 border border-gray-200 rounded-full px-5 py-4 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#5B47F5]/25 focus:border-[#5B47F5] transition-all shadow-sm"
                  />
                  <button
                    onClick={handleGenerate}
                    className="relative pulse-ring btn-shimmer text-white font-bold px-7 py-4 rounded-full flex items-center justify-center gap-2 whitespace-nowrap shadow-xl shadow-[#5B47F5]/30 transition-transform hover:scale-[1.02] active:scale-[0.98]"
                  >
                    Générer ma page
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

                <p className="text-xs text-gray-400 mb-10">
                  Essai gratuit 14 jours — Aucune CB requise — Annulation en 1 clic
                </p>

                {/* Trust chips */}
                <div className="flex flex-wrap gap-3">
                  {[
                    { icon: Check, text: 'Setup en 2 minutes' },
                    { icon: Shield, text: 'OAuth sécurisé' },
                    { icon: Clock, text: '30 secondes / page' },
                  ].map(({ icon: Icon, text }) => (
                    <span
                      key={text}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 bg-gray-50 border border-gray-100 px-3.5 py-2 rounded-full"
                    >
                      <Icon className="w-3.5 h-3.5 text-emerald-500" />
                      {text}
                    </span>
                  ))}
                </div>
              </div>

              {/* ── Colonne droite — Mockup browser ── */}
              <div className="relative float-anim hidden lg:block">

                {/* Halo background */}
                <div
                  aria-hidden
                  className="absolute -inset-6 rounded-3xl"
                  style={{ background: 'radial-gradient(ellipse at center, rgba(91,71,245,0.12) 0%, transparent 70%)' }}
                />

                {/* Fenêtre browser */}
                <div className="relative bg-white rounded-2xl shadow-[0_32px_80px_-12px_rgba(91,71,245,0.2)] border border-gray-100 overflow-hidden">

                  {/* Barre browser */}
                  <div className="bg-[#f5f5f7] border-b border-gray-100 px-4 py-3 flex items-center gap-3">
                    <div className="flex gap-1.5">
                      <span className="w-3 h-3 rounded-full bg-red-400" />
                      <span className="w-3 h-3 rounded-full bg-yellow-400" />
                      <span className="w-3 h-3 rounded-full bg-green-400" />
                    </div>
                    <div className="flex-1 bg-white rounded-lg border border-gray-200 px-3 py-1.5 flex items-center gap-2">
                      <Shield className="w-3 h-3 text-emerald-500 flex-shrink-0" />
                      <span className="text-xs text-gray-400 font-mono truncate">konvert.app/preview/shein-pro-demo</span>
                    </div>
                    <div className="w-7 h-5 rounded bg-[#5B47F5]/10 flex items-center justify-center">
                      <Zap className="w-3 h-3 text-[#5B47F5]" />
                    </div>
                  </div>

                  {/* Screenshot produit */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80"
                    alt="Aperçu d'une page générée par KONVERT"
                    className="w-full h-[360px] object-cover"
                    loading="eager"
                  />

                  {/* Overlay toast succès */}
                  <div className="absolute bottom-5 left-5 right-5 bg-white/92 backdrop-blur-md rounded-xl px-4 py-3 flex items-center gap-3 border border-white shadow-xl shadow-gray-200/60">
                    <div className="w-9 h-9 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                      <Check className="w-4 h-4 text-emerald-600" strokeWidth={2.5} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-gray-900 truncate">Page générée avec succès</p>
                      <p className="text-xs text-gray-400">Prête à publier sur Shopify</p>
                    </div>
                    <div className="flex-shrink-0">
                      <span className="text-xs font-black text-emerald-600 bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded-full">
                        +5.2% CVR
                      </span>
                    </div>
                  </div>
                </div>

                {/* Badge flottant latéral */}
                <div className="absolute -right-6 top-1/3 bg-white rounded-2xl shadow-lg border border-gray-100 px-4 py-3 text-center">
                  <p className="text-2xl font-black text-[#5B47F5]">30s</p>
                  <p className="text-xs text-gray-400 font-medium">génération</p>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════════════
            3. TRUST BAR — MARQUEE
        ════════════════════════════════════════════════════════════════ */}
        <section className="py-10 bg-[#f8fafc] border-y border-gray-100">
          <p className="text-center text-xs font-bold text-gray-400 uppercase tracking-widest mb-6 px-4">
            Connecté aux plateformes que vous utilisez déjà
          </p>
          <div className="marquee-wrap">
            <div className="marquee-track">
              {[...MARQUEE_BRANDS, ...MARQUEE_BRANDS].map((brand, i) => (
                <span
                  key={i}
                  className="flex-shrink-0 px-10 text-sm font-bold text-gray-400 hover:text-[#5B47F5] transition-colors cursor-default"
                >
                  {brand}
                  <span className="ml-10 text-gray-200">|</span>
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════════════
            4. STATS
        ════════════════════════════════════════════════════════════════ */}
        <section ref={statsRef} className="py-24 bg-[#0f0f1a] relative overflow-hidden">

          {/* Grille déco */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage: 'linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)',
              backgroundSize: '48px 48px',
            }}
          />

          <div className="relative max-w-7xl mx-auto px-5 sm:px-8 text-center">
            <p className="text-[#5B47F5] font-bold text-xs uppercase tracking-[0.2em] mb-5 reveal">
              Preuve par les chiffres
            </p>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-5 reveal delay-100">
              Les résultats parlent<br className="hidden sm:block" /> d'eux-mêmes
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto text-base mb-16 reveal delay-200">
              KONVERT propulse les e-commerçants vers des taux de conversion records.
              Des milliers de pages générées. Des résultats prouvés.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-12 sm:gap-4 sm:divide-x sm:divide-white/10">
              {STATS.map((s, i) => (
                <div key={s.label} className={`reveal delay-${(i + 1) * 100}`}>
                  <AnimStat
                    target={s.target}
                    suffix={s.suffix}
                    label={s.label}
                    color={s.color}
                    triggered={statsVisible}
                  />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════════════
            5. FEATURES
        ════════════════════════════════════════════════════════════════ */}
        <section id="features" className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-5 sm:px-8">

            <div className="text-center mb-16">
              <p className="text-[#5B47F5] font-bold text-xs uppercase tracking-[0.2em] mb-5 reveal">
                Fonctionnalités
              </p>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 mb-5 reveal delay-100">
                Des fonctionnalités intelligentes<br className="hidden md:block" /> pour un impact maximal
              </h2>
              <p className="text-gray-500 max-w-2xl mx-auto text-base reveal delay-200">
                Boostez vos ventes avec des outils d'optimisation IA et des templates
                conçus pour convertir, quel que soit votre marché.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {FEATURES.map((feat, i) => (
                <div
                  key={feat.title}
                  className={`reveal delay-${((i % 3) + 1) * 100} group relative bg-white border border-gray-100 rounded-2xl p-7 hover:shadow-xl hover:-translate-y-1.5 hover:border-transparent transition-all duration-300 cursor-default`}
                  style={{ '--accent': feat.accent } as React.CSSProperties}
                >
                  {/* Hover glow */}
                  <div
                    className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                    style={{ boxShadow: `0 20px 60px -10px ${feat.accent}25` }}
                  />

                  <div className={`w-12 h-12 rounded-xl ${feat.bg} flex items-center justify-center mb-5`}>
                    <feat.Icon className={`w-5 h-5 ${feat.label}`} strokeWidth={2} />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{feat.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{feat.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════════════
            6. SOLUTIONS
        ════════════════════════════════════════════════════════════════ */}
        <section className="py-24 bg-[#f8fafc]">
          <div className="max-w-7xl mx-auto px-5 sm:px-8">

            <div className="text-center mb-16">
              <p className="text-[#5B47F5] font-bold text-xs uppercase tracking-[0.2em] mb-5 reveal">
                Solutions
              </p>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 mb-5 reveal delay-100">
                Une solution adaptée<br className="hidden sm:block" /> à chaque profil
              </h2>
              <p className="text-gray-500 max-w-xl mx-auto text-base reveal delay-200">
                Que vous soyez dropshipper, agence, marque ou entrepreneur solo,
                KONVERT s'adapte précisément à vos besoins.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {SOLUTIONS.map((sol, i) => (
                <div
                  key={sol.title}
                  className={`reveal delay-${(i + 1) * 100} group bg-white border border-gray-100 rounded-2xl p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-300`}
                >
                  <div className={`w-11 h-11 rounded-xl ${sol.bg} flex items-center justify-center mb-5`}>
                    <sol.Icon className={`w-5 h-5 ${sol.color}`} strokeWidth={2} />
                  </div>
                  <h3 className="text-base font-bold text-gray-900 mb-2">{sol.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed mb-5">{sol.desc}</p>
                  <Link
                    href="/signup"
                    className={`inline-flex items-center gap-1.5 text-sm font-bold ${sol.color} group-hover:gap-2.5 transition-all duration-200`}
                  >
                    En savoir plus
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════════════
            7. COMMENT CA MARCHE — 3 ETAPES
        ════════════════════════════════════════════════════════════════ */}
        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-5 sm:px-8">

            <div className="text-center mb-16">
              <p className="text-[#5B47F5] font-bold text-xs uppercase tracking-[0.2em] mb-5 reveal">
                Comment ça marche
              </p>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 reveal delay-100">
                De l'URL à la page publiée<br className="hidden sm:block" /> en 3 étapes
              </h2>
            </div>

            <div className="grid sm:grid-cols-3 gap-8 relative">

              {/* Ligne de connexion desktop */}
              <div
                aria-hidden
                className="hidden sm:block absolute top-12 left-[22%] right-[22%] h-px z-0"
                style={{
                  background: 'linear-gradient(90deg, rgba(91,71,245,0.2) 0%, #5B47F5 50%, rgba(91,71,245,0.2) 100%)',
                }}
              />

              {STEPS.map((step, i) => (
                <div key={step.num} className={`reveal delay-${(i + 1) * 100} relative z-10 text-center`}>
                  {/* Numéro */}
                  <div className="w-24 h-24 rounded-2xl bg-[#5B47F5] mx-auto mb-7 flex flex-col items-center justify-center shadow-lg shadow-[#5B47F5]/30 relative">
                    <span className="text-3xl font-black text-white leading-none">{step.num}</span>
                    <div className="absolute -bottom-3 -right-3 w-10 h-10 rounded-xl bg-white border border-gray-100 shadow-md flex items-center justify-center">
                      <step.icon className="w-5 h-5 text-[#5B47F5]" strokeWidth={2} />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{step.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed max-w-xs mx-auto">{step.desc}</p>
                </div>
              ))}
            </div>

            {/* CTA inline */}
            <div className="text-center mt-14 reveal delay-300">
              <Link
                href="/signup"
                className="inline-flex items-center gap-2.5 btn-shimmer text-white font-bold px-8 py-4 rounded-full shadow-lg shadow-[#5B47F5]/30 transition-transform hover:scale-[1.02]"
              >
                Commencer gratuitement
                <ArrowRight className="w-4 h-4" />
              </Link>
              <p className="text-xs text-gray-400 mt-3">Aucune CB — 14 jours d'essai gratuit</p>
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════════════
            8. TEMPLATES
        ════════════════════════════════════════════════════════════════ */}
        <section id="templates" className="py-24 bg-[#0f0f1a] relative overflow-hidden">

          {/* Points déco */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)',
              backgroundSize: '32px 32px',
            }}
          />

          <div className="relative max-w-7xl mx-auto px-5 sm:px-8">

            <div className="text-center mb-14">
              <p className="text-[#5B47F5] font-bold text-xs uppercase tracking-[0.2em] mb-5 reveal">
                Templates
              </p>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-5 reveal delay-100">
                Plus de 5 templates conçus<br className="hidden sm:block" /> pour convertir
              </h2>
              <p className="text-gray-400 max-w-xl mx-auto text-base reveal delay-200">
                Chaque template est A/B testé, optimisé pour la conversion et
                entièrement personnalisable avec le builder.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-12">
              {TEMPLATES.map((tpl, i) => (
                <div
                  key={tpl.name}
                  className={`reveal delay-${(i + 1) * 100} group cursor-pointer rounded-2xl bg-gradient-to-br ${tpl.bg} ${tpl.border ?? ''} p-5 h-52 flex flex-col justify-between hover:scale-[1.04] hover:shadow-2xl transition-all duration-300 relative overflow-hidden`}
                >
                  {/* Reflet hover */}
                  <div className="absolute inset-0 bg-white/0 group-hover:bg-white/5 transition-colors rounded-2xl" />

                  <span className={`self-start text-[10px] font-bold px-2.5 py-1 rounded-full ${tpl.tagStyle} uppercase tracking-wide`}>
                    {tpl.tag}
                  </span>
                  <div>
                    <p className={`text-sm font-black ${tpl.text} leading-tight`}>{tpl.name}</p>
                    <p className={`text-xs mt-1 ${tpl.text} opacity-60 leading-snug`}>{tpl.desc}</p>
                    <Link
                      href="/templates"
                      className={`mt-3 inline-flex items-center gap-1 text-xs font-bold ${tpl.text} opacity-70 hover:opacity-100 transition-opacity`}
                    >
                      Aperçu <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center reveal delay-300">
              <Link
                href="/templates"
                className="inline-flex items-center gap-2 border border-white/20 hover:border-[#5B47F5] text-white hover:text-[#5B47F5] font-semibold px-7 py-3.5 rounded-full transition-all duration-300"
              >
                Voir tous les templates
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════════════
            9. INTEGRATIONS
        ════════════════════════════════════════════════════════════════ */}
        <section id="integrations" className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-5 sm:px-8">

            <div className="text-center mb-16">
              <p className="text-[#5B47F5] font-bold text-xs uppercase tracking-[0.2em] mb-5 reveal">
                Intégrations
              </p>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 mb-5 reveal delay-100">
                Intégrez KONVERT<br className="hidden sm:block" /> à votre stack existant
              </h2>
              <p className="text-gray-500 max-w-xl mx-auto text-base reveal delay-200">
                KONVERT se connecte nativement aux plateformes que vous utilisez pour
                vendre, automatiser et analyser vos performances.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-12">
              {INTEGRATIONS.map((intg, i) => (
                <div
                  key={intg.name}
                  className={`reveal delay-${((i % 5) + 1) * 100} group border ${intg.border} rounded-2xl p-5 text-center hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 bg-white`}
                >
                  <div className={`w-12 h-12 ${intg.bg} rounded-xl mx-auto mb-3 flex items-center justify-center text-2xl`}>
                    {intg.icon}
                  </div>
                  <p className={`text-sm font-bold ${intg.color}`}>{intg.name}</p>
                  <p className="text-xs text-gray-400 mt-1 leading-snug">{intg.desc}</p>
                </div>
              ))}
            </div>

            <div className="text-center reveal delay-300">
              <Link
                href="/integrations"
                className="inline-flex items-center gap-2 border-2 border-gray-200 hover:border-[#5B47F5] text-gray-700 hover:text-[#5B47F5] font-semibold px-7 py-3.5 rounded-full transition-all duration-300"
              >
                Voir toutes les intégrations
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════════════
            10. TÉMOIGNAGES
        ════════════════════════════════════════════════════════════════ */}
        <section className="py-24 bg-[#f8fafc]">
          <div className="max-w-7xl mx-auto px-5 sm:px-8">

            <div className="text-center mb-16">
              <p className="text-[#5B47F5] font-bold text-xs uppercase tracking-[0.2em] mb-5 reveal">
                Témoignages
              </p>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 reveal delay-100">
                Conçu pour les équipes qui veulent<br className="hidden lg:block" /> des résultats, pas de la complexité
              </h2>
            </div>

            <div className="grid sm:grid-cols-3 gap-6">
              {TESTIMONIALS.map((t, i) => (
                <div
                  key={t.name}
                  className={`reveal delay-${(i + 1) * 100} group bg-white border border-gray-100 rounded-2xl p-7 hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300`}
                >
                  {/* Stars + tag */}
                  <div className="flex items-center justify-between mb-5">
                    <div className="flex gap-0.5">
                      {Array.from({ length: t.stars }).map((_, j) => (
                        <Star key={j} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${t.tagColor}`}>
                      {t.tag}
                    </span>
                  </div>

                  {/* Citation */}
                  <p className="text-gray-700 text-sm leading-relaxed mb-7 italic">
                    "{t.quote}"
                  </p>

                  {/* Auteur */}
                  <div className="flex items-center gap-3 pt-5 border-t border-gray-50">
                    <div className={`w-10 h-10 rounded-full ${t.avatarBg} flex items-center justify-center flex-shrink-0`}>
                      <span className="text-xs font-black text-white">{t.avatar}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-bold text-gray-900">{t.name}</p>
                        {t.verified && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-blue-50 text-blue-600">
                            <Check className="w-2.5 h-2.5" />
                            Vérifié
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-400">{t.role}</p>
                      {t.since && <p className="text-[10px] text-gray-300 mt-0.5">{t.since}</p>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════════════
            11. AVANT / APRÈS
        ════════════════════════════════════════════════════════════════ */}
        <section className="py-24 bg-[#0f0f1a] relative overflow-hidden">
          {/* BG glow */}
          <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 80% 50% at 50% 50%, rgba(91,71,245,0.08) 0%, transparent 70%)' }} />

          <div className="max-w-7xl mx-auto px-5 sm:px-8 relative">
            <div className="text-center mb-16">
              <p className="text-[#5B47F5] font-bold text-xs uppercase tracking-[0.2em] mb-5 reveal">
                Transformation
              </p>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white reveal delay-100" style={{ letterSpacing: '-0.02em' }}>
                La différence est{' '}
                <span style={{ background: 'linear-gradient(135deg,#5B47F5,#a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                  immédiate
                </span>
              </h2>
              <p className="text-gray-400 max-w-xl mx-auto text-base mt-4 reveal delay-200">
                Même produit. Même prix. Résultats incomparables.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 lg:gap-10 reveal delay-200">

              {/* AVANT — fiche AliExpress */}
              <div className="relative">
                <div className="absolute -top-3 left-4 z-10 flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-black"
                  style={{ background: '#ef4444', color: '#fff', boxShadow: '0 4px 12px rgba(239,68,68,0.4)' }}>
                  ✕ Avant — Fiche produit classique
                </div>
                <div className="rounded-2xl overflow-hidden border border-white/10" style={{ background: '#ffffff' }}>
                  {/* Browser bar */}
                  <div className="h-9 flex items-center gap-1.5 px-3 border-b" style={{ background: '#f3f4f6', borderColor: '#e5e7eb' }}>
                    <div className="w-3 h-3 rounded-full bg-red-400" />
                    <div className="w-3 h-3 rounded-full bg-yellow-400" />
                    <div className="w-3 h-3 rounded-full bg-green-400" />
                    <div className="flex-1 mx-3 h-5 rounded flex items-center px-2" style={{ background: '#e9eaec' }}>
                      <span className="text-[10px] text-gray-500">aliexpress.com/item/100234567...</span>
                    </div>
                  </div>
                  {/* Page content */}
                  <div className="p-4" style={{ minHeight: '340px' }}>
                    {/* Top nav */}
                    <div className="h-6 w-full mb-3 rounded flex items-center gap-2" style={{ background: '#f5a623' }}>
                      <div className="w-16 h-3 rounded ml-2" style={{ background: 'rgba(255,255,255,0.5)' }} />
                      <div className="flex-1 mx-2 h-3.5 rounded" style={{ background: 'rgba(255,255,255,0.2)' }} />
                      <div className="w-10 h-3 rounded mr-2" style={{ background: 'rgba(255,255,255,0.3)' }} />
                    </div>
                    {/* Breadcrumb */}
                    <div className="flex gap-2 mb-3">
                      {['Home', '>', 'Electronics', '>', 'Item 234567'].map((b, i) => (
                        <span key={i} className="text-[9px]" style={{ color: i === 4 ? '#999' : '#f5a623' }}>{b}</span>
                      ))}
                    </div>
                    {/* Main content */}
                    <div className="grid grid-cols-2 gap-3">
                      {/* Images */}
                      <div className="space-y-1.5">
                        <div className="rounded border" style={{ height: '120px', background: '#f0f0f0', borderColor: '#ddd' }}>
                          <div className="w-full h-full flex items-center justify-center text-gray-300 text-3xl">📦</div>
                        </div>
                        <div className="grid grid-cols-4 gap-1">
                          {[0,1,2,3].map(i => (
                            <div key={i} className="rounded border" style={{ height: '24px', background: '#f5f5f5', borderColor: i === 0 ? '#f5a623' : '#e0e0e0' }} />
                          ))}
                        </div>
                      </div>
                      {/* Info */}
                      <div className="space-y-2">
                        <div className="text-[9px] font-medium leading-tight" style={{ color: '#333' }}>
                          Wireless Bluetooth Earbuds 5.3 TWS Headphones Sport Gaming Earphone With MIC Bass Stereo Headset
                        </div>
                        <div className="flex items-center gap-1">
                          {'★★★★☆'.split('').map((s, i) => (
                            <span key={i} className="text-[10px]" style={{ color: '#f5a623' }}>{s}</span>
                          ))}
                          <span className="text-[8px]" style={{ color: '#999' }}>(1,247)</span>
                        </div>
                        <div className="text-xs font-bold" style={{ color: '#e50000' }}>US $8.99 <span className="text-[9px] line-through text-gray-400">$24.99</span></div>
                        <div className="text-[8px] space-y-0.5" style={{ color: '#666' }}>
                          <div>Color: ■ ■ ■ ■ □ □</div>
                          <div>Ships to: France (+$2.50)</div>
                        </div>
                        <div className="rounded text-[9px] text-center py-1 font-bold" style={{ background: '#f5a623', color: '#fff' }}>
                          Add to Cart
                        </div>
                        <div className="rounded text-[9px] text-center py-1 font-medium border" style={{ color: '#f5a623', borderColor: '#f5a623' }}>
                          Buy Now
                        </div>
                      </div>
                    </div>
                    {/* Description chaos */}
                    <div className="mt-3 pt-3 border-t space-y-1" style={{ borderColor: '#eee' }}>
                      <div className="text-[8px] font-bold mb-1" style={{ color: '#333' }}>Product Description</div>
                      {[100, 85, 95, 70, 88, 60].map((w, i) => (
                        <div key={i} className="h-1.5 rounded" style={{ width: `${w}%`, background: '#e5e5e5' }} />
                      ))}
                    </div>
                  </div>
                  {/* Metrics bas */}
                  <div className="px-4 pb-4">
                    <div className="rounded-lg p-3 flex justify-around" style={{ background: '#fff3f0', border: '1px solid #ffd0c8' }}>
                      <div className="text-center">
                        <div className="text-sm font-black" style={{ color: '#ef4444' }}>1.1%</div>
                        <div className="text-[9px]" style={{ color: '#999' }}>Taux conv.</div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm font-black" style={{ color: '#ef4444' }}>62%</div>
                        <div className="text-[9px]" style={{ color: '#999' }}>Taux rebond</div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm font-black" style={{ color: '#ef4444' }}>0.9x</div>
                        <div className="text-[9px]" style={{ color: '#999' }}>ROAS</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* APRÈS — page KONVERT */}
              <div className="relative">
                <div className="absolute -top-3 left-4 z-10 flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-black"
                  style={{ background: '#10b981', color: '#fff', boxShadow: '0 4px 12px rgba(16,185,129,0.4)' }}>
                  ✓ Après — Page KONVERT générée en 30s
                </div>
                <div className="rounded-2xl overflow-hidden" style={{ border: '1.5px solid rgba(91,71,245,0.4)', boxShadow: '0 0 40px rgba(91,71,245,0.15)' }}>
                  {/* Browser bar */}
                  <div className="h-9 flex items-center gap-1.5 px-3" style={{ background: '#1a1a2e', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                    <div className="w-3 h-3 rounded-full bg-red-400" />
                    <div className="w-3 h-3 rounded-full bg-yellow-400" />
                    <div className="w-3 h-3 rounded-full bg-green-400" />
                    <div className="flex-1 mx-3 h-5 rounded flex items-center gap-1.5 px-2" style={{ background: 'rgba(255,255,255,0.06)' }}>
                      <div className="w-2 h-2 rounded-full bg-green-400" />
                      <span className="text-[10px] text-gray-400">shop.monsite.fr/ecouteurs-pro</span>
                    </div>
                  </div>
                  {/* Hero product */}
                  <div style={{ background: 'linear-gradient(160deg, #0f0f1a 0%, #1a0a2e 100%)', minHeight: '340px' }}>
                    {/* Nav */}
                    <div className="flex items-center justify-between px-4 py-2.5 border-b" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
                      <span className="text-[10px] font-black text-white">AudioPro<span className="text-[#5B47F5]">.</span></span>
                      <div className="flex gap-2">
                        {['Collection', 'Avis', 'Aide'].map(l => (
                          <span key={l} className="text-[9px]" style={{ color: 'rgba(255,255,255,0.5)' }}>{l}</span>
                        ))}
                      </div>
                    </div>
                    {/* Hero split */}
                    <div className="grid grid-cols-2 gap-3 p-4">
                      {/* Product visual */}
                      <div className="rounded-xl flex items-center justify-center relative overflow-hidden" style={{ height: '140px', background: 'linear-gradient(135deg,#1e1b4b,#312e81)' }}>
                        <div className="text-5xl">🎧</div>
                        <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded-full text-[8px] font-bold" style={{ background: '#ef4444', color: '#fff' }}>-64%</div>
                      </div>
                      {/* Copy */}
                      <div className="space-y-2 py-1">
                        <div className="flex">
                          {'★★★★★'.split('').map((s, i) => (
                            <span key={i} className="text-yellow-400 text-[10px]">{s}</span>
                          ))}
                          <span className="text-[9px] ml-1" style={{ color: 'rgba(255,255,255,0.4)' }}>4.9 (2k+)</span>
                        </div>
                        <div className="text-[11px] font-black leading-tight text-white">
                          Son Studio.<br />Qualité Pro.
                        </div>
                        <div className="text-[9px]" style={{ color: 'rgba(255,255,255,0.5)' }}>
                          Bluetooth 5.3 • 40h batterie • ANC actif
                        </div>
                        <div className="flex items-baseline gap-2">
                          <span className="text-base font-black text-white">8,99€</span>
                          <span className="text-[9px] line-through" style={{ color: 'rgba(255,255,255,0.3)' }}>24,99€</span>
                        </div>
                        <div className="rounded-full py-1.5 text-[10px] text-center font-black" style={{ background: 'linear-gradient(90deg,#5B47F5,#7c6af7)', color: '#fff' }}>
                          Commander →
                        </div>
                      </div>
                    </div>
                    {/* Social proof */}
                    <div className="mx-4 mb-3 rounded-xl p-3 flex items-center gap-3" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
                      <div className="flex -space-x-1.5">
                        {['#5B47F5','#10b981','#f59e0b'].map((c, i) => (
                          <div key={i} className="w-5 h-5 rounded-full border-2 border-[#0f0f1a] flex items-center justify-center text-[7px] text-white font-bold" style={{ background: c }}>
                            {['T','S','J'][i]}
                          </div>
                        ))}
                      </div>
                      <span className="text-[9px]" style={{ color: 'rgba(255,255,255,0.5)' }}>
                        <strong className="text-white">2 347 personnes</strong> ont commandé ce mois
                      </span>
                    </div>
                    {/* Features */}
                    <div className="grid grid-cols-3 gap-2 px-4 pb-3">
                      {[['🔋','40h batterie'],['🛡️','2 ans garantie'],['🚀','Livraison J+1']].map(([icon,label]) => (
                        <div key={label} className="rounded-lg p-2 text-center" style={{ background: 'rgba(91,71,245,0.1)', border: '1px solid rgba(91,71,245,0.15)' }}>
                          <div className="text-base">{icon}</div>
                          <div className="text-[8px] text-white font-medium mt-0.5">{label}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                  {/* Metrics bas */}
                  <div className="px-4 pb-4" style={{ background: '#0f0f1a' }}>
                    <div className="rounded-xl p-3 flex justify-around" style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)' }}>
                      <div className="text-center">
                        <div className="text-sm font-black text-emerald-400">5.8%</div>
                        <div className="text-[9px] text-gray-500">Taux conv.</div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm font-black text-emerald-400">28%</div>
                        <div className="text-[9px] text-gray-500">Taux rebond</div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm font-black text-emerald-400">3.4x</div>
                        <div className="text-[9px] text-gray-500">ROAS</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Résultat global */}
            <div className="mt-10 text-center reveal delay-300">
              <div className="inline-flex items-center gap-6 px-8 py-5 rounded-2xl" style={{ background: 'rgba(91,71,245,0.1)', border: '1px solid rgba(91,71,245,0.2)' }}>
                <div className="text-center">
                  <div className="text-2xl font-black text-white">+427%</div>
                  <div className="text-xs text-gray-400">Taux de conversion</div>
                </div>
                <div className="w-px h-10" style={{ background: 'rgba(255,255,255,0.1)' }} />
                <div className="text-center">
                  <div className="text-2xl font-black text-white">-55%</div>
                  <div className="text-xs text-gray-400">Taux de rebond</div>
                </div>
                <div className="w-px h-10" style={{ background: 'rgba(255,255,255,0.1)' }} />
                <div className="text-center">
                  <div className="text-2xl font-black text-white">x3.8</div>
                  <div className="text-xs text-gray-400">Retour sur dépenses pub</div>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-3">Résultats moyens constatés sur les 30 premiers jours d'utilisation</p>
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════════════
            12. PRICING
        ════════════════════════════════════════════════════════════════ */}
        <section id="pricing" className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-5 sm:px-8">

            <div className="text-center mb-10">
              <p className="text-[#5B47F5] font-bold text-xs uppercase tracking-[0.2em] mb-5 reveal">
                Tarifs
              </p>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 mb-5 reveal delay-100">
                Des tarifs transparents<br className="hidden sm:block" /> qui évoluent avec vous
              </h2>
              <p className="text-gray-500 max-w-xl mx-auto text-base mb-8 reveal delay-200">
                Commencez gratuitement, évoluez quand vous êtes prêt.
                Aucun engagement. Annulation en 1 clic.
              </p>

              {/* Toggle mensuel / annuel */}
              <div className="inline-flex items-center bg-gray-100 p-1 rounded-full reveal delay-300">
                {(['monthly', 'annual'] as const).map((b) => (
                  <button
                    key={b}
                    onClick={() => setBilling(b)}
                    className={`relative text-sm font-bold px-6 py-2.5 rounded-full transition-all duration-200 ${
                      billing === b
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    {b === 'monthly' ? 'Mensuel' : (
                      <span className="flex items-center gap-2">
                        Annuel
                        <span className="text-[10px] font-black bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded-full">
                          -20%
                        </span>
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Plans */}
            <div className="grid sm:grid-cols-3 gap-5 items-start mt-10">
              {PRICING.map((plan, i) => (
                <div
                  key={plan.name}
                  className={`reveal delay-${(i + 1) * 100} relative flex flex-col rounded-2xl p-8 transition-all duration-300 ${
                    plan.highlight
                      ? 'bg-[#5B47F5] shadow-[0_24px_80px_-12px_rgba(91,71,245,0.45)] scale-[1.03] z-10'
                      : 'bg-white border border-gray-100 hover:shadow-lg'
                  }`}
                >
                  {/* Badge populaire */}
                  {plan.badge && (
                    <div className="absolute -top-4 inset-x-0 flex justify-center">
                      <span className="bg-white text-[#5B47F5] text-xs font-black px-4 py-1.5 rounded-full shadow-md border border-[#5B47F5]/10">
                        {plan.badge}
                      </span>
                    </div>
                  )}

                  {/* En-tête */}
                  <div className="mb-5">
                    <h3 className={`text-lg font-black mb-1 ${plan.highlight ? 'text-white' : 'text-gray-900'}`}>
                      {plan.name}
                    </h3>
                    <p className={`text-sm ${plan.highlight ? 'text-white/65' : 'text-gray-500'}`}>
                      {plan.desc}
                    </p>
                  </div>

                  {/* Prix */}
                  <div className="flex items-end gap-1 mb-8">
                    <span className={`text-5xl font-black tabular-nums leading-none ${plan.highlight ? 'text-white' : 'text-gray-900'}`}>
                      {billing === 'annual' ? plan.annual : plan.monthly}€
                    </span>
                    <span className={`text-sm pb-1.5 ${plan.highlight ? 'text-white/55' : 'text-gray-400'}`}>
                      /mois
                    </span>
                  </div>

                  {/* Features */}
                  <ul className="space-y-3.5 mb-9 flex-1">
                    {plan.features.map((feat) => (
                      <li key={feat} className="flex items-start gap-2.5 text-sm">
                        <div className={`flex-shrink-0 mt-0.5 w-4 h-4 rounded-full flex items-center justify-center ${plan.highlight ? 'bg-white/20' : 'bg-emerald-50'}`}>
                          <Check className={`w-2.5 h-2.5 ${plan.highlight ? 'text-white' : 'text-emerald-600'}`} strokeWidth={3} />
                        </div>
                        <span className={plan.highlight ? 'text-white/85' : 'text-gray-600'}>{feat}</span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA */}
                  <Link
                    href={plan.highlight ? '/signup' : plan.name === 'Agence' ? '/contact' : '/signup'}
                    className={`block text-center font-bold py-3.5 rounded-full transition-all duration-200 ${
                      plan.highlight
                        ? 'bg-white text-[#5B47F5] hover:bg-gray-50 shadow-md'
                        : plan.ctaCls
                    }`}
                  >
                    {plan.cta}
                  </Link>

                  {plan.highlight && (
                    <p className="text-center text-white/50 text-xs mt-3">
                      14 jours gratuits — aucune CB
                    </p>
                  )}
                </div>
              ))}
            </div>

            {/* Garantie */}
            <div className="mt-14 flex flex-col sm:flex-row items-center justify-center gap-8 reveal delay-400">
              {[
                { icon: Shield,  text: 'Paiement 100% sécurisé' },
                { icon: Clock,   text: 'Annulation en 1 clic, sans pénalité' },
                { icon: Check,   text: 'Satisfait ou remboursé 30 jours' },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-2.5 text-sm text-gray-500">
                  <Icon className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  {text}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════════════
            12. FAQ
        ════════════════════════════════════════════════════════════════ */}
        <section id="faq" className="py-24 bg-[#f8fafc]">
          <div className="max-w-3xl mx-auto px-5 sm:px-8">

            <div className="text-center mb-12">
              <p className="text-[#5B47F5] font-bold text-xs uppercase tracking-[0.2em] mb-5 reveal">
                FAQ
              </p>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 reveal delay-100">
                Questions fréquentes
              </h2>
            </div>

            <div className="space-y-3">
              {FAQS.map((faq, i) => (
                <div key={i} className={`reveal delay-${((i % 3) + 1) * 100}`}>
                  <FaqItem
                    q={faq.q}
                    a={faq.a}
                    open={openFaq === i}
                    onToggle={() => setOpenFaq(openFaq === i ? null : i)}
                  />
                </div>
              ))}
            </div>

            <div className="mt-10 text-center reveal delay-300">
              <p className="text-sm text-gray-500 mb-3">Vous n'avez pas trouvé votre réponse ?</p>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 text-[#5B47F5] font-bold text-sm hover:underline underline-offset-4"
              >
                Contacter le support
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════════════
            13. FINAL CTA
        ════════════════════════════════════════════════════════════════ */}
        <section className="py-32 bg-[#0f0f1a] relative overflow-hidden">

          {/* Halo central */}
          <div
            aria-hidden
            className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(91,71,245,0.18) 0%, transparent 70%)' }}
          />

          {/* Grille déco */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage: 'linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)',
              backgroundSize: '64px 64px',
            }}
          />

          <div className="relative max-w-4xl mx-auto px-5 sm:px-8 text-center">
            <p className="text-[#5B47F5] font-bold text-xs uppercase tracking-[0.2em] mb-6 reveal">
              Prêt à convertir ?
            </p>
            <h2 className="text-4xl sm:text-5xl lg:text-[3.75rem] font-black text-white leading-[1.08] mb-7 reveal delay-100">
              Plus de leads.<br />
              Plus de conversions.<br />
              <span className="text-[#5B47F5]">Commencez gratuitement.</span>
            </h2>
            <p className="text-gray-400 text-base sm:text-lg max-w-2xl mx-auto mb-12 leading-relaxed reveal delay-200">
              Rejoignez 2 800+ boutiques qui utilisent KONVERT pour générer des pages qui vendent.
              Essai gratuit 14 jours. Aucune CB requise.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10 reveal delay-300">
              <Link
                href="/signup"
                className="btn-shimmer text-white font-black px-9 py-4.5 py-[1.125rem] rounded-full text-base flex items-center justify-center gap-2.5 shadow-2xl shadow-[#5B47F5]/40 transition-transform hover:scale-[1.02] active:scale-[0.98]"
              >
                Essai gratuit 14 jours
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/demo"
                className="border border-white/20 hover:border-white/50 text-white hover:bg-white/5 font-bold px-9 py-[1.125rem] rounded-full text-base flex items-center justify-center gap-2.5 transition-all duration-200"
              >
                <Play className="w-4 h-4" />
                Voir une démo
              </Link>
            </div>

            <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-500 reveal delay-400">
              {[
                { icon: Check,  text: 'Setup en 2 minutes' },
                { icon: Shield, text: 'Aucune CB requise' },
                { icon: Zap,    text: 'Annulation en 1 clic' },
              ].map(({ icon: Icon, text }) => (
                <span key={text} className="flex items-center gap-1.5">
                  <Icon className="w-4 h-4 text-emerald-500" />
                  {text}
                </span>
              ))}
            </div>
          </div>
        </section>

      </main>

      {/* ════════════════════════════════════════════════════════════════════
          14. FOOTER
      ════════════════════════════════════════════════════════════════════ */}
      <footer className="bg-[#0c0c18] border-t border-white/5">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 pt-16 pb-10">

          {/* Top row */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-10 mb-14">

            {/* Brand — 2 cols */}
            <div className="col-span-2 sm:col-span-3 lg:col-span-2">
              <Link href="/" className="flex items-center gap-2.5 mb-5 w-fit">
                <div className="w-9 h-9 rounded-xl bg-[#5B47F5] flex items-center justify-center shadow-lg shadow-[#5B47F5]/30">
                  <Zap className="w-4 h-4 text-white" strokeWidth={2.5} />
                </div>
                <span className="text-xl font-black text-white tracking-tight">
                  Kon<span className="text-[#5B47F5]">vert</span>
                </span>
              </Link>
              <p className="text-sm text-gray-500 leading-relaxed max-w-[220px] mb-6">
                Générez des pages qui convertissent. Propulsé par Claude AI.
              </p>
              {/* Réseaux sociaux */}
              <div className="flex gap-2">
                {[
                  { label: 'X / Twitter', abbr: 'X' },
                  { label: 'LinkedIn',    abbr: 'Li' },
                  { label: 'Instagram',   abbr: 'Ig' },
                  { label: 'YouTube',     abbr: 'Yt' },
                ].map((sn) => (
                  <Link
                    key={sn.abbr}
                    href="#"
                    aria-label={sn.label}
                    className="w-9 h-9 rounded-xl bg-white/5 hover:bg-[#5B47F5]/20 hover:border-[#5B47F5]/30 border border-white/5 flex items-center justify-center text-xs font-bold text-gray-500 hover:text-[#5B47F5] transition-all duration-200"
                  >
                    {sn.abbr}
                  </Link>
                ))}
              </div>
            </div>

            {/* 4 colonnes navigation */}
            {FOOTER_COLS.map((col) => (
              <div key={col.title}>
                <h4 className="text-xs font-black text-white uppercase tracking-widest mb-5">
                  {col.title}
                </h4>
                <ul className="space-y-3">
                  {col.links.map((link) => (
                    <li key={link}>
                      <Link
                        href="#"
                        className="text-sm text-gray-500 hover:text-gray-300 transition-colors duration-150"
                      >
                        {link}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Badge "Made with Claude AI" */}
          <div className="flex justify-center mb-10">
            <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-5 py-2.5">
              <Bot className="w-4 h-4 text-[#5B47F5]" />
              <span className="text-xs font-semibold text-gray-400">
                Copy IA généré par <span className="text-[#5B47F5] font-bold">Claude AI</span> — Anthropic
              </span>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="border-t border-white/5 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-gray-600">
              © 2026 KONVERT by NEXARA. Tous droits réservés.
            </p>
            <div className="flex items-center gap-6">
              {['Confidentialité', 'CGU', 'Cookies', 'RGPD'].map((l) => (
                <Link
                  key={l}
                  href="#"
                  className="text-xs text-gray-600 hover:text-gray-400 transition-colors"
                >
                  {l}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </footer>

      {/* ════════════════════════════════════════════════════════════════════
          CTA STICKY MOBILE
      ════════════════════════════════════════════════════════════════════ */}
      <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden px-4 pb-safe" style={{ paddingBottom: 'max(16px, env(safe-area-inset-bottom))' }}>
        <div className="rounded-2xl overflow-hidden shadow-2xl" style={{ boxShadow: '0 -4px 32px rgba(91,71,245,0.3)' }}>
          <Link
            href="/signup"
            className="flex items-center justify-center gap-2.5 w-full py-4 font-black text-[15px] btn-shimmer text-white"
          >
            <Zap className="w-4.5 h-4.5" strokeWidth={2.5} />
            Essai gratuit — 14 jours
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </>
  )
}
