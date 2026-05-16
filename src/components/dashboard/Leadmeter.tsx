'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { TrendingUp, Zap, Eye, Shield, Sparkles } from 'lucide-react'

/* ─────────────────────────────────────────────
   TYPES
───────────────────────────────────────────── */
interface Criterion {
  id: string
  label: string
  hint: string
  points: number
  passed: boolean
}

interface Metrics {
  words: number
  images: number
  externalLinks: number
  priceDetected: number | null
  currency: string
  h1Length: number
}

/* ─────────────────────────────────────────────
   ANALYSE HTML → CRITÈRES + MÉTRIQUES
───────────────────────────────────────────── */
function analyzeHtml(html: string): { criteria: Criterion[]; metrics: Metrics } {
  const parser = new DOMParser()
  const doc = parser.parseFromString(html, 'text/html')
  const bodyHtml = doc.body?.innerHTML ?? ''
  const bodyText = doc.body?.textContent ?? ''
  const getText = (el: Element | null) => el?.textContent?.trim() ?? ''

  const h1 = doc.querySelector('h1')
  const h1Words = getText(h1).split(/\s+/).filter(Boolean)
  const hasH1 = h1Words.length > 5

  const h2 = doc.querySelector('h2, h3, [class*="subtitle"], [class*="subheadline"], [class*="tagline"]')
  const firstP = doc.querySelector('p')
  const hasSubtitle = !!(h2 || (firstP && getText(firstP).length > 20))

  const ACTION_RE = /acheter|commander|essayer|commencer|obtenir|s['']inscrire|rejoindre|d[eé]couvrir|t[eé]l[eé]charger|get|buy|order|start|try|download|shop|ajouter au panier|add to cart/i
  const clickables = doc.querySelectorAll('button, a, [class*="btn"], [class*="cta"]')
  const hasCTA = Array.from(clickables).some(el => ACTION_RE.test(getText(el)))

  const imgs = doc.querySelectorAll('img')
  const hasImage = imgs.length > 0

  const PROOF_RE = /avis|[eé]toile|star|review|t[eé]moignage|client|⭐|★|\d+\s*(avis|reviews?|clients?)/i
  const hasProof = PROOF_RE.test(bodyHtml)

  const PRICE_RE = /(\d[\d\s,.]*)\s*(€|\$|£|EUR|USD|CHF)/i
  const priceMatch = bodyText.match(PRICE_RE)
  const hasPrice = !!priceMatch || /prix|price/i.test(bodyHtml)
  let priceDetected: number | null = null
  let currency = '€'
  if (priceMatch) {
    const raw = priceMatch[1].replace(/\s/g, '').replace(',', '.')
    const num = parseFloat(raw)
    if (!isNaN(num) && num > 0 && num < 100000) priceDetected = num
    currency = priceMatch[2]
  }

  const URGENCY_RE = /stock limit[eé]|derni[eè]res pi[eè]ces|offre limit[eé]e|expire|compte.?[aà].?rebours|timer|urgent|aujourd.?hui seulement|limited stock|hurry|countdown|\d+\s*h\s*\d+\s*m|ends in/i
  const hasUrgency = URGENCY_RE.test(bodyHtml)

  const GUARANTEE_RE = /garantie|rembours[eé]|satisfait|sans risque|guarantee|money.?back|refund|\d+\s*jours?/i
  const hasGuarantee = GUARANTEE_RE.test(bodyHtml)

  const hasViewport = !!doc.querySelector('meta[name="viewport"]')

  const externalLinks = Array.from(doc.querySelectorAll('a[href]')).filter(a => {
    const href = a.getAttribute('href') ?? ''
    return href.startsWith('http') || href.startsWith('//')
  })
  const fewLeaks = externalLinks.length < 3

  const words = bodyText.split(/\s+/).filter(Boolean).length

  return {
    criteria: [
      { id: 'h1',        label: 'Titre H1',           hint: 'Ajoute un H1 avec au moins 6 mots clairs',              points: 15, passed: hasH1 },
      { id: 'subtitle',  label: 'Accroche',            hint: "Ajoute un H2 ou un paragraphe d'accroche",              points: 10, passed: hasSubtitle },
      { id: 'cta',       label: 'Bouton CTA',          hint: 'Bouton avec "Acheter", "Commander", "Essayer"…',        points: 15, passed: hasCTA },
      { id: 'image',     label: 'Image produit',       hint: 'Ajoute une image de ton produit',                       points: 10, passed: hasImage },
      { id: 'proof',     label: 'Preuve sociale',      hint: 'Ajoute des étoiles, avis ou témoignages clients',       points: 10, passed: hasProof },
      { id: 'price',     label: 'Prix visible',        hint: 'Affiche clairement le prix du produit',                 points: 10, passed: hasPrice },
      { id: 'urgency',   label: 'Urgence / scarcité',  hint: 'Timer ou mention "Stock limité" / "Offre limitée"',     points: 10, passed: hasUrgency },
      { id: 'guarantee', label: 'Garantie',            hint: 'Mentionne "Satisfait ou remboursé" ou garantie X jours', points: 5,  passed: hasGuarantee },
      { id: 'viewport',  label: 'Mobile responsive',   hint: 'Meta viewport doit être présente dans le HTML',         points: 5,  passed: hasViewport },
      { id: 'leaks',     label: 'Peu de liens fuite',  hint: 'Retire les liens de navigation/footer superflus',       points: 10, passed: fewLeaks },
    ],
    metrics: {
      words,
      images: imgs.length,
      externalLinks: externalLinks.length,
      priceDetected,
      currency,
      h1Length: h1Words.length,
    },
  }
}

/* ─────────────────────────────────────────────
   SCORE PUBLIC (utilisé par GrapesEditor)
───────────────────────────────────────────── */
export function computeLeadmeterScore(html: string) {
  if (typeof window === 'undefined') return { score: 0, criteria: [] as Criterion[] }
  const { criteria } = analyzeHtml(html)
  const score = criteria.filter(c => c.passed).reduce((sum, c) => sum + c.points, 0)
  return { score, criteria }
}

/* ─────────────────────────────────────────────
   COUNT-UP NUMBER
───────────────────────────────────────────── */
function CountUp({ value, decimals = 0, suffix = '' }: { value: number; decimals?: number; suffix?: string }) {
  const mv = useMotionValue(0)
  const spring = useSpring(mv, { stiffness: 80, damping: 18 })
  const display = useTransform(spring, latest => {
    return latest.toFixed(decimals) + suffix
  })
  const [text, setText] = useState('0' + suffix)

  useEffect(() => { mv.set(value) }, [value, mv])
  useEffect(() => display.on('change', v => setText(v)), [display])

  return <>{text}</>
}

/* ─────────────────────────────────────────────
   GAUGE CIRCULAIRE
───────────────────────────────────────────── */
function CircularGauge({ score, color, glow }: { score: number; color: string; glow: string }) {
  const size = 168
  const stroke = 10
  const radius = (size - stroke) / 2
  const circumference = 2 * Math.PI * radius
  const progress = circumference - (score / 100) * circumference

  const progressMV = useMotionValue(circumference)
  const progressSpring = useSpring(progressMV, { stiffness: 60, damping: 20 })

  useEffect(() => { progressMV.set(progress) }, [progress, progressMV])

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      {/* Halo glow */}
      <div
        className="absolute inset-0 rounded-full blur-2xl opacity-40"
        style={{ background: `radial-gradient(circle, ${color}, transparent 70%)` }}
      />

      <svg width={size} height={size} className="-rotate-90 relative">
        <defs>
          <linearGradient id="lm-gauge-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={color} stopOpacity="0.5" />
            <stop offset="100%" stopColor={color} />
          </linearGradient>
          <filter id="lm-gauge-glow">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="rgba(255,255,255,0.06)"
          strokeWidth={stroke}
          fill="none"
        />

        {/* Tick marks */}
        {Array.from({ length: 40 }).map((_, i) => {
          const angle = (i / 40) * 360
          const isActive = i / 40 < score / 100
          const x1 = size / 2 + (radius - stroke / 2 - 2) * Math.cos((angle * Math.PI) / 180)
          const y1 = size / 2 + (radius - stroke / 2 - 2) * Math.sin((angle * Math.PI) / 180)
          const x2 = size / 2 + (radius + stroke / 2 + 2) * Math.cos((angle * Math.PI) / 180)
          const y2 = size / 2 + (radius + stroke / 2 + 2) * Math.sin((angle * Math.PI) / 180)
          return (
            <line
              key={i}
              x1={x1} y1={y1} x2={x2} y2={y2}
              stroke={isActive ? color : 'rgba(255,255,255,0.04)'}
              strokeWidth="1"
              style={{ transition: 'stroke 0.4s' }}
            />
          )
        })}

        {/* Progress arc */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="url(#lm-gauge-grad)"
          strokeWidth={stroke}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          style={{ strokeDashoffset: progressSpring, filter: `drop-shadow(0 0 6px ${glow})` }}
        />
      </svg>

      {/* Centre */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="text-[44px] font-black leading-none tabular-nums" style={{ color, textShadow: `0 0 20px ${glow}` }}>
          <CountUp value={score} />
        </div>
        <div className="text-[9px] font-bold tracking-[0.2em] text-white/40 mt-1">SCORE / 100</div>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────
   MINI TUILE KPI
───────────────────────────────────────────── */
function KpiTile({
  icon: Icon,
  label,
  value,
  suffix,
  decimals = 0,
  color,
  glow,
}: {
  icon: React.ComponentType<{ size?: number; className?: string }>
  label: string
  value: number
  suffix?: string
  decimals?: number
  color: string
  glow: string
}) {
  return (
    <div
      className="relative rounded-xl p-2.5 overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, rgba(255,255,255,0.04), rgba(255,255,255,0.01))',
        border: '1px solid rgba(255,255,255,0.06)',
        backdropFilter: 'blur(10px)',
      }}
    >
      <div
        className="absolute -top-4 -right-4 w-12 h-12 rounded-full blur-2xl opacity-30"
        style={{ background: color }}
      />
      <div className="flex items-center gap-1 mb-1 relative">
        <Icon size={9} className="opacity-60" />
        <span className="text-[8px] font-bold tracking-wider text-white/50 uppercase">{label}</span>
      </div>
      <div className="text-sm font-black tabular-nums relative" style={{ color, textShadow: `0 0 8px ${glow}` }}>
        <CountUp value={value} decimals={decimals} suffix={suffix ?? ''} />
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────
   COMPOSANT PRINCIPAL
───────────────────────────────────────────── */
interface Props {
  html: string
}

export default function Leadmeter({ html }: Props) {
  const { score, criteria, metrics } = useMemo(() => {
    if (!html || typeof window === 'undefined') {
      return {
        score: 0,
        criteria: [] as Criterion[],
        metrics: { words: 0, images: 0, externalLinks: 0, priceDetected: null, currency: '€', h1Length: 0 } as Metrics,
      }
    }
    const { criteria, metrics } = analyzeHtml(html)
    const score = criteria.filter(c => c.passed).reduce((sum, c) => sum + c.points, 0)
    return { score, criteria, metrics }
  }, [html])

  // Palette néon
  const color = score >= 71 ? '#10f5a8' : score >= 41 ? '#ffb547' : '#ff5470'
  const glow  = score >= 71 ? 'rgba(16,245,168,0.55)' : score >= 41 ? 'rgba(255,181,71,0.55)' : 'rgba(255,84,112,0.55)'
  const label = score >= 90 ? 'EXCELLENT' : score >= 71 ? 'BON' : score >= 41 ? 'MOYEN' : 'FAIBLE'

  // Métriques business dérivées
  const conversionRate = +(0.5 + (score / 100) * 4).toFixed(1) // 0.5% → 4.5%
  const trustScore = Math.min(100, Math.round(
    (criteria.find(c => c.id === 'proof')?.passed ? 30 : 0) +
    (criteria.find(c => c.id === 'guarantee')?.passed ? 20 : 0) +
    (criteria.find(c => c.id === 'price')?.passed ? 25 : 0) +
    (criteria.find(c => c.id === 'leaks')?.passed ? 25 : 0)
  ))
  const readTime = Math.max(1, Math.round(metrics.words / 200))
  const monthlyRevenue = metrics.priceDetected
    ? Math.round((metrics.priceDetected * 1000 * conversionRate) / 100)
    : Math.round(score * 47) // fallback : score × 47 €

  const passed = criteria.filter(c => c.passed)
  const suggestions = criteria.filter(c => !c.passed).slice(0, 3)

  return (
    <div
      className="flex flex-col h-full overflow-y-auto relative"
      style={{
        minWidth: 228,
        maxWidth: 228,
        background: 'radial-gradient(ellipse at top, #1a1033 0%, #0a0a14 60%, #050508 100%)',
        borderLeft: '1px solid rgba(139,92,246,0.15)',
      }}
    >
      {/* Grille de fond futuriste */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
          backgroundSize: '20px 20px',
        }}
      />

      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/5 relative">
        <div className="flex items-center gap-1.5">
          <motion.div
            className="w-1.5 h-1.5 rounded-full"
            style={{ background: color, boxShadow: `0 0 8px ${glow}` }}
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 1.6, repeat: Infinity }}
          />
          <span className="text-[10px] font-black text-white/70 tracking-[0.2em] uppercase">Leadmeter</span>
        </div>
        <span
          className="text-[9px] font-black px-2 py-0.5 rounded-md tracking-wider"
          style={{
            background: `linear-gradient(135deg, ${color}25, ${color}10)`,
            color,
            border: `1px solid ${color}40`,
          }}
        >
          {label}
        </span>
      </div>

      <div className="flex flex-col gap-4 p-4 relative">
        {/* Gauge centrale */}
        <div className="flex justify-center pt-1">
          <CircularGauge score={score} color={color} glow={glow} />
        </div>

        {/* KPIs business */}
        <div className="grid grid-cols-2 gap-2">
          <KpiTile icon={TrendingUp} label="Conv. est." value={conversionRate} decimals={1} suffix="%" color={color} glow={glow} />
          <KpiTile icon={Zap} label="CA / mois" value={monthlyRevenue} suffix={` ${metrics.currency}`} color={color} glow={glow} />
          <KpiTile icon={Eye} label="Lecture" value={readTime} suffix=" min" color="#a78bfa" glow="rgba(167,139,250,0.5)" />
          <KpiTile icon={Shield} label="Trust" value={trustScore} suffix="/100" color="#22d3ee" glow="rgba(34,211,238,0.5)" />
        </div>

        {/* Equalizer critères */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[9px] font-black text-white/40 tracking-[0.2em] uppercase">
              Critères
            </span>
            <span className="text-[9px] font-black tabular-nums" style={{ color }}>
              {passed.length}/{criteria.length}
            </span>
          </div>
          <div className="flex items-end gap-1 h-8">
            {criteria.map((c, i) => (
              <motion.div
                key={c.id}
                initial={{ height: '20%' }}
                animate={{ height: c.passed ? `${60 + ((i * 13) % 40)}%` : '15%' }}
                transition={{ duration: 0.5, delay: i * 0.04 }}
                className="flex-1 rounded-sm"
                title={`${c.label} (+${c.points}pts)`}
                style={{
                  background: c.passed
                    ? `linear-gradient(180deg, ${color}, ${color}60)`
                    : 'rgba(255,255,255,0.05)',
                  boxShadow: c.passed ? `0 0 6px ${glow}` : 'none',
                }}
              />
            ))}
          </div>
        </div>

        {/* Checklist */}
        <div className="flex flex-col gap-1.5">
          {criteria.map(c => (
            <div
              key={c.id}
              className="flex items-center gap-2 px-2 py-1.5 rounded-md transition-all"
              style={{
                background: c.passed ? 'rgba(255,255,255,0.02)' : 'transparent',
              }}
            >
              <div
                className="w-3.5 h-3.5 rounded-full flex items-center justify-center flex-shrink-0"
                style={{
                  background: c.passed ? color : 'transparent',
                  border: c.passed ? 'none' : '1.5px solid rgba(255,255,255,0.15)',
                  boxShadow: c.passed ? `0 0 6px ${glow}` : 'none',
                }}
              >
                {c.passed && (
                  <svg width="7" height="7" viewBox="0 0 8 8" fill="none">
                    <path d="M1.5 4L3 5.5L6.5 2" stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </div>
              <span
                className="text-[11px] font-semibold leading-none flex-1 truncate"
                style={{ color: c.passed ? 'rgba(255,255,255,0.85)' : 'rgba(255,255,255,0.3)' }}
              >
                {c.label}
              </span>
              <span
                className="text-[9px] font-black tabular-nums"
                style={{ color: c.passed ? color : 'rgba(255,255,255,0.2)' }}
              >
                +{c.points}
              </span>
            </div>
          ))}
        </div>

        {/* Suggestions */}
        {suggestions.length > 0 && (
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-1.5">
              <Sparkles size={10} style={{ color }} />
              <span className="text-[9px] font-black text-white/40 tracking-[0.2em] uppercase">
                Boost rapide
              </span>
            </div>
            {suggestions.map(s => (
              <div
                key={s.id}
                className="flex items-start gap-2 px-2.5 py-2 rounded-lg"
                style={{
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.03), rgba(255,255,255,0.01))',
                  border: '1px solid rgba(255,255,255,0.05)',
                }}
              >
                <div
                  className="w-1 h-1 rounded-full mt-1.5 flex-shrink-0"
                  style={{ background: color, boxShadow: `0 0 4px ${glow}` }}
                />
                <span className="text-[10px] text-white/55 leading-snug">{s.hint}</span>
              </div>
            ))}
          </div>
        )}

        {/* Score parfait */}
        {score === 100 && (
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center py-3 rounded-xl text-[11px] font-black tracking-wider"
            style={{
              background: `linear-gradient(135deg, ${color}20, ${color}05)`,
              border: `1px solid ${color}40`,
              color,
              textShadow: `0 0 10px ${glow}`,
            }}
          >
            ⚡ PAGE PARFAITE
          </motion.div>
        )}
      </div>
    </div>
  )
}
