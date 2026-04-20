'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  Robot, Palette, ChartBar, LinkSimple, Flask, Globe,
  Lightning, ShieldCheck, Clock, Check, Sparkle, TrendUp, ArrowRight
} from '@phosphor-icons/react'
import Tooltip from '@/components/ui/Tooltip'

const GLOBAL_CSS = `
  .reveal { opacity: 0; transform: translateY(24px); transition: opacity .6s cubic-bezier(.16,1,.3,1), transform .6s cubic-bezier(.16,1,.3,1); }
  .reveal.visible { opacity: 1; transform: translateY(0); }
  .delay-1 { transition-delay: .1s }
  .delay-2 { transition-delay: .2s }
  .delay-3 { transition-delay: .3s }
  .delay-4 { transition-delay: .4s }
  @keyframes shimmer { from { background-position: -200% 0; } to { background-position: 200% 0; } }
  .btn-shimmer { background: linear-gradient(90deg, #5B47F5 0%, #7c6af7 40%, #5B47F5 60%, #4a38e0 100%); background-size: 200% 100%; animation: shimmer 2.4s linear infinite; }
  .btn-shimmer:hover { animation-play-state: paused; }
  @keyframes count-up { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
  .tab-content { display: none; }
  .tab-content.active { display: block; }
`

const FEATURES_MAIN = [
  {
    id: 'ia',
    icon: Robot,
    badge: 'IA Native',
    title: 'Génération IA avec Claude',
    subtitle: 'Le copy parfait. En 30 secondes.',
    desc: "KONVERT utilise Claude AI d'Anthropic — le modèle de langage le plus avancé pour le copywriting e-commerce. Accroche percutante, proposition de valeur unique, liste de bénéfices, FAQ personnalisée, CTA optimisés. Tout en 30 secondes.",
    details: [
      'Copy entièrement personnalisé par produit',
      'Adapté à votre niche et audience cible',
      'Optimisé pour la conversion (pas juste beau)',
      'Rééditable manuellement dans le builder',
    ],
    stats: [
      { value: '30s', label: 'Génération' },
      { value: '98%', label: 'Satisfaction' },
      { value: '4.9★', label: 'Note moyenne' },
    ],
    visual: 'ai',
    accent: '#5B47F5',
    accentBg: 'bg-[#5B47F5]/10',
    accentText: 'text-[#5B47F5]',
    gradient: 'from-[#5B47F5]/15 to-[#5B47F5]/5',
    reversed: false,
  },
  {
    id: 'templates',
    icon: Palette,
    badge: '17 Templates',
    title: '17 Templates Premium',
    subtitle: 'Un design pour chaque niche.',
    desc: "17 templates conçus par des experts e-commerce et testés sur des milliers de boutiques. Mode, Tech, Beauté, Sport, Gaming, Alimentation, Animaux... Chaque template est optimisé pour maximiser les conversions dans sa niche.",
    details: [
      '17 templates niches exclusifs',
      'Testé sur +50 000 pages générées',
      'Personnalisable dans le builder',
      'Nouveaux templates chaque mois',
    ],
    stats: [
      { value: '17', label: 'Templates' },
      { value: '8', label: 'Niches' },
      { value: '+4.8%', label: 'CVR moyen' },
    ],
    visual: 'templates',
    accent: '#ec4899',
    accentBg: 'bg-pink-50',
    accentText: 'text-pink-500',
    gradient: 'from-pink-500/15 to-pink-500/5',
    reversed: true,
  },
  {
    id: 'analytics',
    icon: ChartBar,
    badge: 'Analytics',
    title: 'Analytics Temps Réel',
    subtitle: 'Vos données. Vos décisions.',
    desc: "Suivez chaque interaction sur vos pages : scroll depth, clics CTA, temps passé, taux de rebond, conversions, ROAS. Un tableau de bord en temps réel pour prendre des décisions basées sur les données — pas sur des intuitions.",
    details: [
      'Scroll depth & heatmap par section',
      'Tracking conversions Shopify/WooCommerce',
      'Comparaison entre pages A/B',
      'Export CSV et rapports PDF automatiques',
    ],
    stats: [
      { value: '100%', label: 'Temps réel' },
      { value: '12+', label: 'Métriques' },
      { value: 'PDF', label: 'Auto-rapports' },
    ],
    visual: 'analytics',
    accent: '#10b981',
    accentBg: 'bg-emerald-50',
    accentText: 'text-emerald-500',
    gradient: 'from-emerald-500/15 to-emerald-500/5',
    reversed: false,
  },
  {
    id: 'integrations',
    icon: LinkSimple,
    badge: 'Intégrations',
    title: 'Shopify & WooCommerce Natifs',
    subtitle: 'Publiez en 1 clic.',
    desc: "Connexion OAuth sécurisée avec Shopify et WooCommerce. Une fois connecté, publiez n'importe quelle page directement sur votre boutique sans copier-coller de code. Synchronisation automatique des prix et stocks.",
    details: [
      'OAuth sécurisé — pas de mot de passe stocké',
      'Publication directe sans copier-coller',
      'Sync automatique prix et disponibilité',
      'Compatible toutes les versions de thèmes',
    ],
    stats: [
      { value: '1 clic', label: 'Publication' },
      { value: 'OAuth', label: 'Sécurité' },
      { value: '100%', label: 'Compatibilité' },
    ],
    visual: 'integrations',
    accent: '#f97316',
    accentBg: 'bg-orange-50',
    accentText: 'text-orange-500',
    gradient: 'from-orange-500/15 to-orange-500/5',
    reversed: true,
  },
  {
    id: 'abtesting',
    icon: Flask,
    badge: 'A/B Testing',
    title: 'A/B Testing Intégré',
    subtitle: 'Testez. Apprenez. Optimisez.',
    desc: "Créez des variantes de vos pages en quelques clics et testez-les en parallèle. KONVERT distribue le trafic automatiquement et identifie la version gagnante avec une significativité statistique. Gardez ce qui performe.",
    details: [
      'Variantes illimitées par page',
      'Distribution trafic automatique 50/50',
      'Significativité statistique (95%)',
      'Auto-winner après 1 000 visiteurs',
    ],
    stats: [
      { value: '∞', label: 'Variantes' },
      { value: '95%', label: 'Confiance stat.' },
      { value: '1k', label: 'Visiteurs seuil' },
    ],
    visual: 'abtesting',
    accent: '#3b82f6',
    accentBg: 'bg-blue-50',
    accentText: 'text-blue-500',
    gradient: 'from-blue-500/15 to-blue-500/5',
    reversed: false,
  },
  {
    id: 'langues',
    icon: Globe,
    badge: '8 Langues',
    title: 'Génération Multi-langues',
    subtitle: 'Vendez partout dans le monde.',
    desc: "Générez vos pages en français, anglais, espagnol, allemand, italien, portugais, arabe et chinois. Chaque copy est natif — pas une traduction mécanique. Atteignez des marchés internationaux sans agence de traduction.",
    details: [
      'FR, EN, ES, DE, IT, PT, AR, ZH',
      'Copy natif, pas une traduction Google',
      'Adapté aux habitudes culturelles de chaque marché',
      'Sélection de la langue en 1 clic',
    ],
    stats: [
      { value: '8', label: 'Langues' },
      { value: 'Natif', label: 'Qualité copy' },
      { value: '1 clic', label: 'Changement' },
    ],
    visual: 'langues',
    accent: '#14b8a6',
    accentBg: 'bg-teal-50',
    accentText: 'text-teal-500',
    gradient: 'from-teal-500/15 to-teal-500/5',
    reversed: true,
  },
]

const OTHER_FEATURES = [
  { icon: Lightning,   title: 'Builder drag & drop',       desc: 'Éditez chaque section visuellement après la génération.',  tooltip: 'Glissez-déposez chaque bloc sans coder' },
  { icon: ShieldCheck, title: 'Sécurité enterprise',        desc: 'OAuth, chiffrement AES-256, conformité RGPD.',             tooltip: 'Données chiffrées AES-256, conformité RGPD' },
  { icon: Clock,       title: 'Génération en 30 secondes',  desc: "Le record absolu vs n'importe quel outil concurrent.",     tooltip: 'De l\'URL au copy complet en 30 secondes' },
  { icon: TrendUp,     title: 'Optimisé Core Web Vitals',   desc: 'LCP < 2s, CLS = 0, INP optimal. Score SEO maximal.',      tooltip: 'LCP < 2s · CLS 0 · Score SEO optimal' },
  { icon: Sparkle,     title: 'Scraper multi-sources',      desc: 'AliExpress, Amazon, Alibaba, Temu, Shein et plus.',        tooltip: 'Scrape AliExpress, Amazon, Alibaba et plus' },
  { icon: ChartBar,    title: 'Rapports PDF auto',          desc: 'Générés et envoyés automatiquement à vos clients.',        tooltip: 'PDF brandés envoyés automatiquement aux clients' },
]

const COMPARE_ROWS = [
  { label: 'Temps pour créer une page', konvert: '30 secondes', diy: '4–6 heures', freelance: '2–5 jours' },
  { label: 'Coût', konvert: 'Dès 29€/mois', diy: '0€ (mais votre temps)', freelance: '300–1500€/page' },
  { label: 'Qualité copy', konvert: 'IA spécialisée e-com', diy: 'Variable, souvent faible', freelance: 'Dépend du freelance' },
  { label: 'Intégration Shopify', konvert: 'Native, 1 clic', diy: 'Manuelle, copier-coller', freelance: 'Parfois incluse' },
  { label: 'A/B Testing', konvert: 'Intégré & automatisé', diy: 'Impossible sans dev', freelance: 'En option payante' },
  { label: 'Support', konvert: '24h, en français', diy: 'Forum, articles, YouTube', freelance: 'Selon dispo' },
]

const DEEP_DIVE_TABS = [
  {
    id: 'ia',
    label: 'Génération IA',
    icon: null,
    title: 'Comment fonctionne la génération IA ?',
    desc: "KONVERT utilise Claude AI d'Anthropic, entraîné sur des millions de pages e-commerce performantes. En analysant votre URL produit, il extrait les informations clés et génère un copy optimisé pour la conversion.",
    steps: [
      { num: '1', title: 'Vous collez l\'URL produit', detail: 'KONVERT scrape automatiquement le titre, les images, le prix, la description et les avis.' },
      { num: '2', title: 'L\'IA analyse et génère', detail: 'Claude identifie les arguments de vente clés, les objections possibles et rédige une page complète en 30 secondes.' },
      { num: '3', title: 'Vous personnalisez et publiez', detail: 'Éditez chaque bloc dans le builder, choisissez un template et publiez en 1 clic sur votre boutique.' },
    ],
    metrics: [
      { value: '30s', label: 'Temps moyen de génération' },
      { value: '+62%', label: 'Meilleur copy vs rédaction manuelle' },
      { value: '8', label: 'Langues supportées' },
    ],
  },
  {
    id: 'abtesting',
    label: 'A/B Testing',
    icon: null,
    title: 'Un A/B testing qui travaille pour vous',
    desc: "L'A/B testing manuel est chronophage et statistiquement risqué. KONVERT automatise tout : distribution du trafic, calcul de la significativité, et déclaration du gagnant — sans intervention de votre part.",
    steps: [
      { num: '1', title: 'Créez une variante en 1 clic', detail: 'Dupliquez une page existante, modifiez le titre, le CTA ou le layout. Chaque changement est tracké séparément.' },
      { num: '2', title: 'KONVERT distribue le trafic', detail: 'Le trafic est divisé 50/50 automatiquement. Aucun code à ajouter, aucun plugin externe.' },
      { num: '3', title: 'Le gagnant est déclaré automatiquement', detail: 'Après 1 000 visiteurs ou 95% de confiance statistique, KONVERT déclare la version gagnante et redirige tout le trafic.' },
    ],
    metrics: [
      { value: '95%', label: 'Seuil de confiance statistique' },
      { value: '1000', label: 'Visiteurs pour déclaration auto' },
      { value: '+23%', label: 'Gain moyen après optimisation' },
    ],
  },
  {
    id: 'analytics',
    label: 'Analytics',
    icon: null,
    title: 'Des analytics qui révèlent ce qui convertit',
    desc: "Les analytics KONVERT vont au-delà des simples pages vues. Chaque section de votre page est tracée : où les visiteurs décrochent, quels CTA fonctionnent, et quel segment d'audience convertit le mieux.",
    steps: [
      { num: '1', title: 'Tracking automatique à l\'installation', detail: 'Dès que votre page est publiée, KONVERT commence à collecter les données. Aucun tag Google Analytics à configurer.' },
      { num: '2', title: 'Tableau de bord en temps réel', detail: 'Scroll depth par section, taux de clic CTA, temps passé, taux de rebond et conversions — tout en live.' },
      { num: '3', title: 'Rapports PDF automatiques', detail: 'Chaque semaine, un rapport PDF brandé est généré et envoyé par email. Parfait pour les agences qui gèrent plusieurs clients.' },
    ],
    metrics: [
      { value: '12+', label: 'Métriques trackées par page' },
      { value: '100%', label: 'Temps réel, 0 délai' },
      { value: 'Auto', label: 'Rapports PDF hebdomadaires' },
    ],
  },
]

function FeatureVisualContent({ id, accent }: { id: string; accent: string }) {
  // ── IA ──────────────────────────────────────────────────────────────────────
  if (id === 'ia') {
    return (
      <div style={{ fontFamily: 'inherit', padding: '20px', height: '100%', display: 'flex', flexDirection: 'column', gap: '0' }}>
        {/* Terminal header */}
        <div style={{ background: '#1e1e2e', borderRadius: '16px 16px 0 0', padding: '10px 16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#ff5f57', display: 'inline-block' }} />
          <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#febc2e', display: 'inline-block' }} />
          <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#28c840', display: 'inline-block' }} />
          <span style={{ marginLeft: 8, fontSize: 11, color: '#8b8baa', fontWeight: 600 }}>KONVERT — Génération IA</span>
        </div>
        {/* Body en 2 colonnes */}
        <div style={{ background: '#ffffff', borderRadius: '0 0 16px 16px', border: '1px solid #e5e7eb', borderTop: 'none', flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0, overflow: 'hidden' }}>
          {/* Gauche — input */}
          <div style={{ padding: '18px 16px', borderRight: '1px solid #f0f0f5', display: 'flex', flexDirection: 'column', gap: 12 }}>
            <p style={{ fontSize: 10, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.08em', margin: 0 }}>URL Produit</p>
            <div style={{ background: '#f8f7ff', border: '1px solid #ede9fe', borderRadius: 10, padding: '8px 12px', fontSize: 11, color: '#6d6d8a', lineHeight: 1.4 }}>
              aliexpress.com/item/<br />
              <span style={{ color: '#5B47F5', fontWeight: 600 }}>casque-pro-studio...</span>
            </div>
            <button style={{ background: 'linear-gradient(135deg, #5B47F5, #7c6af7)', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 12px', fontSize: 11, fontWeight: 700, cursor: 'pointer', textAlign: 'center' }}>
              Analyser →
            </button>
            <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981', display: 'inline-block', flexShrink: 0 }} />
              <span style={{ fontSize: 10, color: '#10b981', fontWeight: 700 }}>Généré en 28s</span>
            </div>
          </div>
          {/* Droite — résultat */}
          <div style={{ padding: '18px 16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
            <p style={{ fontSize: 10, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.08em', margin: 0 }}>Résultat</p>
            <p style={{ fontSize: 13, fontWeight: 900, color: '#111827', margin: 0, lineHeight: 1.3 }}>Casque Pro Studio X</p>
            <p style={{ fontSize: 10, color: '#6b7280', margin: 0 }}>Son cristallin · ANC active</p>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginTop: 2 }}>
              <span style={{ fontSize: 15, fontWeight: 900, color: '#5B47F5' }}>79€</span>
              <span style={{ fontSize: 11, color: '#9ca3af', textDecoration: 'line-through' }}>139€</span>
              <span style={{ fontSize: 10, fontWeight: 700, color: '#ef4444', background: '#fef2f2', borderRadius: 4, padding: '1px 5px' }}>-43%</span>
            </div>
            <button style={{ marginTop: 'auto', background: 'linear-gradient(135deg, #5B47F5, #7c6af7)', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 10px', fontSize: 10, fontWeight: 700, cursor: 'pointer' }}>
              Ajouter au panier
            </button>
          </div>
        </div>
      </div>
    )
  }

  // ── TEMPLATES ───────────────────────────────────────────────────────────────
  if (id === 'templates') {
    const cards = [
      { img: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&q=80', niche: 'Sport', cvr: '+5.2%' },
      { img: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=300&q=80', niche: 'Beauté', cvr: '+4.8%' },
      { img: 'https://images.unsplash.com/photo-1547996160-81dfa63595aa?w=300&q=80', niche: 'Luxe', cvr: '+6.1%' },
      { img: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=300&q=80', niche: 'Mode', cvr: '+4.3%' },
      { img: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&q=80', niche: 'Tech', cvr: '+5.7%' },
      { img: 'https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=300&q=80', niche: 'Maison', cvr: '+3.9%' },
    ]
    return (
      <div style={{ padding: '20px', height: '100%', display: 'flex', flexDirection: 'column', gap: 12 }}>
        <p style={{ fontSize: 10, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.08em', margin: 0 }}>Templates par niche</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, flex: 1 }}>
          {cards.map((c) => (
            <div key={c.niche} style={{ borderRadius: 10, overflow: 'hidden', position: 'relative', height: 100 }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={c.img}
                alt={c.niche}
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 60%)' }} />
              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '6px 8px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <span style={{ fontSize: 10, fontWeight: 700, color: '#fff' }}>{c.niche}</span>
                <span style={{ fontSize: 9, fontWeight: 800, color: '#4ade80', background: 'rgba(0,0,0,0.5)', borderRadius: 4, padding: '1px 4px' }}>{c.cvr}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  // ── ANALYTICS ───────────────────────────────────────────────────────────────
  if (id === 'analytics') {
    const bars = [
      { day: 'L', h: 55, active: false },
      { day: 'M', h: 70, active: false },
      { day: 'M', h: 48, active: false },
      { day: 'J', h: 82, active: false },
      { day: 'V', h: 91, active: false },
      { day: 'S', h: 76, active: false },
      { day: 'D', h: 100, active: true },
    ]
    return (
      <div style={{ padding: '20px', height: '100%', display: 'flex', flexDirection: 'column', gap: 12 }}>
        {/* Header */}
        <div style={{ background: '#1e1e2e', borderRadius: 12, padding: '10px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: '#e2e8f0' }}>Analytics · Boutique Alpha</span>
          <span style={{ fontSize: 10, fontWeight: 700, color: '#10b981', background: 'rgba(16,185,129,0.15)', borderRadius: 20, padding: '2px 8px' }}>● Live</span>
        </div>
        {/* KPIs */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6 }}>
          <div style={{ background: 'rgba(16,185,129,0.1)', borderRadius: 10, padding: '8px 10px', border: '1px solid rgba(16,185,129,0.2)' }}>
            <p style={{ fontSize: 14, fontWeight: 900, color: '#10b981', margin: 0 }}>4.8%</p>
            <p style={{ fontSize: 9, color: '#6b7280', margin: '2px 0 0' }}>CVR</p>
            <p style={{ fontSize: 9, fontWeight: 700, color: '#10b981', margin: 0 }}>+1.4pts</p>
          </div>
          <div style={{ background: 'rgba(91,71,245,0.1)', borderRadius: 10, padding: '8px 10px', border: '1px solid rgba(91,71,245,0.2)' }}>
            <p style={{ fontSize: 14, fontWeight: 900, color: '#5B47F5', margin: 0 }}>x4.2</p>
            <p style={{ fontSize: 9, color: '#6b7280', margin: '2px 0 0' }}>ROAS</p>
            <p style={{ fontSize: 9, fontWeight: 700, color: '#5B47F5', margin: 0 }}>+0.9</p>
          </div>
          <div style={{ background: 'rgba(249,115,22,0.1)', borderRadius: 10, padding: '8px 10px', border: '1px solid rgba(249,115,22,0.2)' }}>
            <p style={{ fontSize: 14, fontWeight: 900, color: '#f97316', margin: 0 }}>28K</p>
            <p style={{ fontSize: 9, color: '#6b7280', margin: '2px 0 0' }}>Vues</p>
            <p style={{ fontSize: 9, fontWeight: 700, color: '#f97316', margin: 0 }}>+31%</p>
          </div>
        </div>
        {/* Barres */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 5, height: 60 }}>
            {bars.map((b, i) => (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, height: '100%', justifyContent: 'flex-end' }}>
                <div style={{ width: '100%', borderRadius: '4px 4px 0 0', background: b.active ? '#5B47F5' : 'rgba(91,71,245,0.25)', height: `${b.h}%`, transition: 'height 0.4s ease' }} />
                <span style={{ fontSize: 9, color: b.active ? '#5B47F5' : '#9ca3af', fontWeight: b.active ? 800 : 500 }}>{b.day}</span>
              </div>
            ))}
          </div>
          {/* Scroll depth */}
          <div style={{ background: '#f8f7ff', borderRadius: 8, padding: '8px 10px', marginTop: 2 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
              <span style={{ fontSize: 10, color: '#6b7280' }}>Scroll depth moyen</span>
              <span style={{ fontSize: 10, fontWeight: 700, color: '#5B47F5' }}>72%</span>
            </div>
            <div style={{ background: '#e9d5ff', borderRadius: 4, height: 5, overflow: 'hidden' }}>
              <div style={{ width: '72%', height: '100%', background: 'linear-gradient(90deg, #5B47F5, #7c6af7)', borderRadius: 4 }} />
            </div>
          </div>
        </div>
      </div>
    )
  }

  // ── INTEGRATIONS ────────────────────────────────────────────────────────────
  if (id === 'integrations') {
    return (
      <div style={{ padding: '24px 20px', height: '100%', display: 'flex', flexDirection: 'column', gap: 20, justifyContent: 'center' }}>
        {/* Logos connectés */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0 }}>
          {/* Shopify */}
          <div style={{ background: '#fff', borderRadius: 14, padding: '10px 14px', boxShadow: '0 2px 12px rgba(0,0,0,0.08)', border: '1px solid #e5e7eb', textAlign: 'center', minWidth: 74 }}>
            <div style={{ fontSize: 18, marginBottom: 2 }}>🛍️</div>
            <p style={{ fontSize: 10, fontWeight: 800, color: '#96bf48', margin: 0 }}>Shopify</p>
          </div>
          {/* Flèche */}
          <div style={{ display: 'flex', alignItems: 'center', padding: '0 6px' }}>
            <div style={{ height: 2, width: 16, background: 'linear-gradient(90deg, #96bf48, #5B47F5)' }} />
            <span style={{ fontSize: 10, color: '#5B47F5' }}>›</span>
          </div>
          {/* KONVERT */}
          <div style={{ background: 'linear-gradient(135deg, #5B47F5, #7c6af7)', borderRadius: 14, padding: '10px 14px', boxShadow: '0 4px 16px rgba(91,71,245,0.35)', textAlign: 'center', minWidth: 74 }}>
            <div style={{ fontSize: 18, marginBottom: 2 }}>⚡</div>
            <p style={{ fontSize: 10, fontWeight: 800, color: '#fff', margin: 0 }}>KONVERT</p>
          </div>
          {/* Flèche */}
          <div style={{ display: 'flex', alignItems: 'center', padding: '0 6px' }}>
            <div style={{ height: 2, width: 16, background: 'linear-gradient(90deg, #5B47F5, #7c2d8e)' }} />
            <span style={{ fontSize: 10, color: '#7c2d8e' }}>›</span>
          </div>
          {/* WooCommerce */}
          <div style={{ background: '#fff', borderRadius: 14, padding: '10px 14px', boxShadow: '0 2px 12px rgba(0,0,0,0.08)', border: '1px solid #e5e7eb', textAlign: 'center', minWidth: 74 }}>
            <div style={{ fontSize: 18, marginBottom: 2 }}>🛒</div>
            <p style={{ fontSize: 10, fontWeight: 800, color: '#7c2d8e', margin: 0 }}>WooCommerce</p>
          </div>
        </div>
        {/* Card confirmations */}
        <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #e5e7eb', padding: '14px 16px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', gap: 8 }}>
          {[
            'Boutique Sneakers connectée',
            '3 pages publiées aujourd\'hui',
            'Prix synchronisés en temps réel',
          ].map((txt) => (
            <div key={txt} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ width: 16, height: 16, borderRadius: '50%', background: 'rgba(16,185,129,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, color: '#10b981', fontWeight: 900, flexShrink: 0 }}>✓</span>
              <span style={{ fontSize: 11, color: '#374151', fontWeight: 500 }}>{txt}</span>
            </div>
          ))}
          <div style={{ marginTop: 4, background: 'rgba(249,115,22,0.08)', borderRadius: 8, padding: '5px 10px', display: 'inline-flex', alignItems: 'center', gap: 5, alignSelf: 'flex-start' }}>
            <span style={{ fontSize: 12 }}>🔒</span>
            <span style={{ fontSize: 10, fontWeight: 700, color: '#f97316' }}>OAuth Sécurisé</span>
          </div>
        </div>
      </div>
    )
  }

  // ── A/B TESTING ─────────────────────────────────────────────────────────────
  if (id === 'abtesting') {
    return (
      <div style={{ padding: '20px', height: '100%', display: 'flex', flexDirection: 'column', gap: 12 }}>
        {/* Header */}
        <div style={{ background: '#1e1e2e', borderRadius: 12, padding: '10px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: '#e2e8f0' }}>Test en cours</span>
          <span style={{ fontSize: 10, fontWeight: 700, color: '#a78bfa', background: 'rgba(167,139,250,0.15)', borderRadius: 20, padding: '2px 8px' }}>847 visiteurs</span>
        </div>
        {/* 2 cartes */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, flex: 1 }}>
          {/* Variante A */}
          <div style={{ background: '#f9fafb', borderRadius: 12, border: '1px solid #e5e7eb', padding: '12px 12px', display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 10, fontWeight: 800, color: '#6b7280', background: '#e5e7eb', borderRadius: 6, padding: '2px 7px' }}>Variante A</span>
            </div>
            <p style={{ fontSize: 12, fontWeight: 700, color: '#374151', margin: 0 }}>Acheter</p>
            <p style={{ fontSize: 15, fontWeight: 900, color: '#6b7280', margin: 0 }}>3.2%</p>
            <p style={{ fontSize: 9, color: '#9ca3af', margin: 0 }}>CVR actuel</p>
            <div style={{ background: '#e5e7eb', borderRadius: 4, height: 6, overflow: 'hidden', marginTop: 'auto' }}>
              <div style={{ width: '32%', height: '100%', background: '#9ca3af', borderRadius: 4 }} />
            </div>
          </div>
          {/* Variante B — gagnant */}
          <div style={{ background: 'rgba(91,71,245,0.06)', borderRadius: 12, border: '2px solid rgba(91,71,245,0.4)', padding: '12px 12px', display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 10, fontWeight: 800, color: '#5B47F5', background: 'rgba(91,71,245,0.12)', borderRadius: 6, padding: '2px 7px' }}>Variante B</span>
              <span style={{ fontSize: 9 }}>🏆</span>
            </div>
            <p style={{ fontSize: 12, fontWeight: 700, color: '#5B47F5', margin: 0 }}>Commander maintenant</p>
            <p style={{ fontSize: 15, fontWeight: 900, color: '#5B47F5', margin: 0 }}>5.8%</p>
            <p style={{ fontSize: 9, color: '#7c6af7', margin: 0 }}>CVR actuel</p>
            <div style={{ background: 'rgba(91,71,245,0.15)', borderRadius: 4, height: 6, overflow: 'hidden', marginTop: 'auto' }}>
              <div style={{ width: '58%', height: '100%', background: 'linear-gradient(90deg, #5B47F5, #7c6af7)', borderRadius: 4 }} />
            </div>
          </div>
        </div>
        {/* Footer */}
        <div style={{ background: 'rgba(91,71,245,0.06)', borderRadius: 10, padding: '8px 12px', border: '1px solid rgba(91,71,245,0.15)' }}>
          <p style={{ fontSize: 10, color: '#5B47F5', fontWeight: 600, margin: 0, textAlign: 'center' }}>
            Significativité statistique : <strong>97%</strong> — Winner déclaré automatiquement
          </p>
        </div>
      </div>
    )
  }

  // ── LANGUES ─────────────────────────────────────────────────────────────────
  if (id === 'langues') {
    const langs = [
      { flag: '🇫🇷', code: 'FR', active: true },
      { flag: '🇬🇧', code: 'EN', active: false },
      { flag: '🇪🇸', code: 'ES', active: false },
      { flag: '🇩🇪', code: 'DE', active: false },
      { flag: '🇮🇹', code: 'IT', active: false },
      { flag: '🇵🇹', code: 'PT', active: false },
      { flag: '🇸🇦', code: 'AR', active: false },
      { flag: '🇨🇳', code: 'ZH', active: false },
    ]
    return (
      <div style={{ padding: '20px', height: '100%', display: 'flex', flexDirection: 'column', gap: 14 }}>
        <p style={{ fontSize: 10, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.08em', margin: 0 }}>Langue de génération</p>
        {/* Grille 4×2 */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 7 }}>
          {langs.map((l) => (
            <div
              key={l.code}
              style={{
                borderRadius: 10,
                padding: '7px 4px',
                textAlign: 'center',
                background: l.active ? 'rgba(20,184,166,0.12)' : '#f8f9fa',
                border: l.active ? '1.5px solid rgba(20,184,166,0.5)' : '1.5px solid #e5e7eb',
                cursor: 'default',
              }}
            >
              <div style={{ fontSize: 16, lineHeight: 1 }}>{l.flag}</div>
              <div style={{ fontSize: 9, fontWeight: 800, color: l.active ? '#14b8a6' : '#6b7280', marginTop: 3 }}>{l.code}</div>
            </div>
          ))}
        </div>
        {/* Carte traductions */}
        <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #e5e7eb', padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
            <span style={{ fontSize: 14, flexShrink: 0 }}>🇫🇷</span>
            <p style={{ fontSize: 11, color: '#374151', margin: 0, fontWeight: 500, lineHeight: 1.4 }}>
              Profitez de <strong style={{ color: '#14b8a6' }}>-40%</strong> ce week-end seulement →
            </p>
          </div>
          <div style={{ width: '100%', height: 1, background: '#f0f0f5' }} />
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
            <span style={{ fontSize: 14, flexShrink: 0 }}>🇬🇧</span>
            <p style={{ fontSize: 11, color: '#6b7280', margin: 0, lineHeight: 1.4 }}>
              Get <strong>40% off</strong> this weekend only →
            </p>
          </div>
        </div>
        {/* Badge */}
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(20,184,166,0.08)', borderRadius: 8, padding: '6px 10px', border: '1px solid rgba(20,184,166,0.2)', alignSelf: 'flex-start' }}>
          <span style={{ fontSize: 10, fontWeight: 700, color: '#14b8a6' }}>Copy natif · Pas de Google Traduction</span>
        </div>
      </div>
    )
  }

  return null
}

export default function FeaturesPage() {
  const [activeTab, setActiveTab] = useState('ia')

  useEffect(() => {
    const style = document.createElement('style')
    style.textContent = GLOBAL_CSS
    document.head.appendChild(style)
    return () => { document.head.removeChild(style) }
  }, [])

  useEffect(() => {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible') })
    }, { threshold: 0.15 })
    document.querySelectorAll('.reveal').forEach(el => obs.observe(el))
    return () => obs.disconnect()
  }, [])

  const currentTab = DEEP_DIVE_TABS.find(t => t.id === activeTab)!

  return (
    <>
      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section id="features" className="pt-32 pb-16" style={{ background: 'linear-gradient(135deg, #08080f 0%, #0f0f2e 100%)' }}>
        <div className="max-w-4xl mx-auto px-5 sm:px-8 text-center">

          <div className="reveal inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold mb-7 border"
               style={{ background: 'rgba(91,71,245,0.15)', borderColor: 'rgba(91,71,245,0.3)', color: '#a78bfa' }}>
            <Sparkle className="w-3.5 h-3.5" weight="fill" />
            Fonctionnalités
          </div>

          <h1 className="reveal delay-1 text-4xl sm:text-5xl font-black text-white mb-5 leading-tight">
            Tout ce qu'il faut pour<br />
            <span style={{ color: '#8b77ff' }}>vendre plus. Dès aujourd'hui.</span>
          </h1>
          <p className="reveal delay-2 text-lg max-w-2xl mx-auto leading-relaxed mb-8" style={{ color: '#8b8baa' }}>
            KONVERT combine IA générative, templates optimisés, analytics temps réel et intégrations natives pour vous donner un avantage concurrentiel immédiat.
          </p>
          <div className="reveal delay-3">
            <Link
              href="/demo"
              className="btn-shimmer inline-flex items-center gap-2 px-8 py-4 rounded-full text-white font-bold text-sm"
              style={{ boxShadow: '0 8px 24px rgba(91,71,245,0.35)' }}
            >
              Voir la démo live
              <ArrowRight className="w-4 h-4" weight="bold" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── FEATURES DÉTAILLÉES ──────────────────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 space-y-24">
          {FEATURES_MAIN.map((f) => {
            const { icon: Icon } = f
            return (
              <div key={f.id} id={f.id} className={`grid lg:grid-cols-2 gap-14 items-center ${f.reversed ? 'lg:grid-flow-dense' : ''}`}>

                {/* Contenu */}
                <div className={`reveal ${f.reversed ? 'lg:col-start-2' : ''}`}>
                  <span className="inline-flex items-center gap-2 text-xs font-bold px-3 py-1.5 rounded-full mb-5"
                        style={{ background: `${f.accent}15`, color: f.accent }}>
                    {f.badge}
                  </span>
                  <h2 className="text-3xl font-black text-gray-900 mb-2">{f.title}</h2>
                  <p className="text-[#5B47F5] font-semibold text-sm mb-4">{f.subtitle}</p>
                  <p className="text-gray-600 leading-relaxed mb-6">{f.desc}</p>
                  <ul className="space-y-2.5 mb-6">
                    {f.details.map((d) => (
                      <li key={d} className="flex items-center gap-2.5 text-sm text-gray-700">
                        <Check className={`w-4 h-4 flex-shrink-0 ${f.accentText}`} weight="bold" />
                        {d}
                      </li>
                    ))}
                  </ul>
                  {/* Mini-stats */}
                  <div className="flex gap-4 mt-4">
                    {f.stats.map((s) => (
                      <div key={s.label} className="text-center">
                        <p className="text-xl font-black" style={{ color: f.accent }}>{s.value}</p>
                        <p className="text-xs text-gray-400">{s.label}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Visual */}
                <div className={`reveal delay-2 ${f.reversed ? 'lg:col-start-1 lg:row-start-1' : ''} rounded-3xl relative overflow-hidden`}
                     style={{ background: `linear-gradient(135deg, ${f.accent}15 0%, ${f.accent}06 100%)`, minHeight: '320px' }}>
                  <FeatureVisualContent id={f.id} accent={f.accent} />
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* ── COMPARATIF ───────────────────────────────────────────────────── */}
      <section className="py-20" style={{ background: '#fafafa' }}>
        <div className="max-w-5xl mx-auto px-5 sm:px-8">
          <div className="text-center mb-12">
            <p className="reveal text-xs font-bold uppercase tracking-widest text-[#5B47F5] mb-3">Comparatif</p>
            <h2 className="reveal delay-1 text-3xl font-black text-gray-900">KONVERT vs les alternatives</h2>
            <p className="reveal delay-2 text-sm text-gray-500 mt-3 max-w-xl mx-auto">Pourquoi passer des heures à bricoler ou payer une fortune en freelances, quand KONVERT fait tout en 30 secondes ?</p>
          </div>

          {/* Header colonnes */}
          <div className="reveal grid grid-cols-4 gap-3 mb-3 px-2">
            <div />
            <div className="rounded-2xl p-4 text-center" style={{ background: 'linear-gradient(135deg, #5B47F5, #7c6af7)' }}>
              <p className="text-white font-black text-sm">KONVERT</p>
              <p className="text-white/70 text-xs mt-0.5">La solution IA</p>
            </div>
            <div className="rounded-2xl p-4 text-center bg-gray-100">
              <p className="text-gray-700 font-bold text-sm">Faire soi-même</p>
              <p className="text-gray-400 text-xs mt-0.5">DIY</p>
            </div>
            <div className="rounded-2xl p-4 text-center bg-gray-100">
              <p className="text-gray-700 font-bold text-sm">Freelance</p>
              <p className="text-gray-400 text-xs mt-0.5">Agence / Indépendant</p>
            </div>
          </div>

          {/* Lignes */}
          <div className="reveal delay-1 rounded-2xl overflow-hidden border border-gray-100">
            {COMPARE_ROWS.map((row, i) => (
              <div key={row.label} className={`grid grid-cols-4 gap-0 ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                <div className="px-4 py-4 flex items-center">
                  <span className="text-xs font-semibold text-gray-600">{row.label}</span>
                </div>
                <div className="px-4 py-4 flex items-center justify-center" style={{ background: 'rgba(91,71,245,0.06)' }}>
                  <span className="text-xs font-bold text-[#5B47F5] text-center">{row.konvert}</span>
                </div>
                <div className="px-4 py-4 flex items-center justify-center">
                  <span className="text-xs text-gray-500 text-center">{row.diy}</span>
                </div>
                <div className="px-4 py-4 flex items-center justify-center">
                  <span className="text-xs text-gray-500 text-center">{row.freelance}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── AUTRES FEATURES ──────────────────────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-5 sm:px-8">
          <div className="text-center mb-12">
            <p className="reveal text-xs font-bold uppercase tracking-widest text-[#5B47F5] mb-3">Et bien plus encore</p>
            <h2 className="reveal delay-1 text-3xl font-black text-gray-900">Chaque détail compte.</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {OTHER_FEATURES.map(({ icon: Icon, title, desc, tooltip }, idx) => (
              <div key={title} className={`reveal delay-${Math.min(idx + 1, 4)} card-hover-violet bg-white p-6 rounded-2xl border border-gray-100`}>
                <Tooltip content={tooltip} position="top">
                  <div className="w-9 h-9 rounded-xl bg-[#5B47F5]/10 flex items-center justify-center mb-4 cursor-default">
                    <Icon className="w-5 h-5 text-[#5B47F5]" weight="duotone" />
                  </div>
                </Tooltip>
                <h3 className="font-bold text-gray-900 mb-1.5 text-sm">{title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── DEEP DIVE ────────────────────────────────────────────────────── */}
      <section className="py-20" style={{ background: '#faf8ff' }}>
        <div className="max-w-5xl mx-auto px-5 sm:px-8">
          <div className="text-center mb-12">
            <p className="reveal text-xs font-bold uppercase tracking-widest text-[#5B47F5] mb-3">Deep dive</p>
            <h2 className="reveal delay-1 text-3xl font-black text-gray-900">Comment ça marche vraiment ?</h2>
            <p className="reveal delay-2 text-sm text-gray-500 mt-3 max-w-xl mx-auto">Plongez dans les détails techniques de chaque fonctionnalité clé.</p>
          </div>

          {/* Tabs */}
          <div className="reveal flex gap-2 justify-center mb-10 flex-wrap">
            {DEEP_DIVE_TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'text-white shadow-lg'
                    : 'text-gray-600 bg-white border border-gray-200 hover:border-[#5B47F5]/40 hover:text-[#5B47F5]'
                }`}
                style={activeTab === tab.id ? { background: 'linear-gradient(135deg, #5B47F5, #7c6af7)', boxShadow: '0 4px 14px rgba(91,71,245,0.3)' } : {}}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>

          {/* Tab content */}
          <div className="reveal delay-1 bg-white rounded-3xl border border-gray-100 p-8 shadow-sm">
            <h3 className="text-2xl font-black text-gray-900 mb-3">{currentTab.title}</h3>
            <p className="text-gray-600 leading-relaxed mb-8 max-w-2xl">{currentTab.desc}</p>

            {/* Steps */}
            <div className="grid sm:grid-cols-3 gap-6 mb-8">
              {currentTab.steps.map((step) => (
                <div key={step.num} className="relative">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-black mb-3"
                       style={{ background: 'linear-gradient(135deg, #5B47F5, #7c6af7)' }}>
                    {step.num}
                  </div>
                  <h4 className="font-bold text-gray-900 mb-1.5 text-sm">{step.title}</h4>
                  <p className="text-xs text-gray-500 leading-relaxed">{step.detail}</p>
                </div>
              ))}
            </div>

            {/* Métriques */}
            <div className="flex gap-6 pt-6 border-t border-gray-100 flex-wrap">
              {currentTab.metrics.map((m) => (
                <div key={m.label} className="text-center">
                  <p className="text-2xl font-black text-[#5B47F5]">{m.value}</p>
                  <p className="text-xs text-gray-400">{m.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────────── */}
      <section className="py-20" style={{ background: 'linear-gradient(135deg, #08080f, #0f0f2e)' }}>
        <div className="max-w-2xl mx-auto px-5 sm:px-8 text-center">
          <h2 className="reveal text-3xl font-black text-white mb-4">
            Prêt à tester toutes ces fonctionnalités ?
          </h2>
          <p className="reveal delay-1 text-sm mb-8" style={{ color: '#8b8baa' }}>
            14 jours d'accès complet. Sans carte de crédit.
          </p>
          <div className="reveal delay-2 flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/pricing"
              className="btn-shimmer inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full text-white font-bold"
              style={{ boxShadow: '0 8px 24px rgba(91,71,245,0.35)' }}
            >
              Voir les tarifs
              <ArrowRight className="w-4 h-4" weight="bold" />
            </Link>
            <Link
              href="/demo"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full font-bold text-sm border"
              style={{ borderColor: 'rgba(255,255,255,0.2)', color: '#fff' }}
            >
              Voir la démo
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
