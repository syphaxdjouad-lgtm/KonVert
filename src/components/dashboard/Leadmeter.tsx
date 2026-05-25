'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { TrendingUp, Zap, Eye, Shield, Sparkles, Check, X, Minus, BarChart3 } from 'lucide-react'

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
   (inchangée — logique métier)
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
   SCORE PUBLIC (drop-in compatible)
───────────────────────────────────────────── */
export function computeLeadmeterScore(html: string) {
  if (typeof window === 'undefined') return { score: 0, criteria: [] as Criterion[] }
  const { criteria } = analyzeHtml(html)
  const score = criteria.filter(c => c.passed).reduce((sum, c) => sum + c.points, 0)
  return { score, criteria }
}

/* ─────────────────────────────────────────────
   PALETTE — tokens sémantiques
───────────────────────────────────────────── */
function getScorePalette(score: number) {
  if (score >= 71) return {
    accentHex:  '#059669',
    accentLight: 'rgba(5, 150, 105, 0.08)',
    accentBorder: 'rgba(5, 150, 105, 0.20)',
    label: 'BON',
    labelClass: 'text-emerald-700 bg-emerald-50 border-emerald-200',
    ringColor: '#059669',
    ringTrack: '#d1fae5',
  }
  if (score >= 41) return {
    accentHex:  '#D97706',
    accentLight: 'rgba(217, 119, 6, 0.07)',
    accentBorder: 'rgba(217, 119, 6, 0.20)',
    label: 'MOYEN',
    labelClass: 'text-amber-700 bg-amber-50 border-amber-200',
    ringColor: '#D97706',
    ringTrack: '#fef3c7',
  }
  return {
    accentHex:  '#DC2626',
    accentLight: 'rgba(220, 38, 38, 0.07)',
    accentBorder: 'rgba(220, 38, 38, 0.18)',
    label: 'FAIBLE',
    labelClass: 'text-red-700 bg-red-50 border-red-200',
    ringColor: '#DC2626',
    ringTrack: '#fee2e2',
  }
}

/* ─────────────────────────────────────────────
   COUNT-UP
───────────────────────────────────────────── */
function CountUp({ value, decimals = 0, suffix = '' }: { value: number; decimals?: number; suffix?: string }) {
  const mv = useMotionValue(0)
  const springV = useSpring(mv, { stiffness: 80, damping: 18 })
  const display = useTransform(springV, latest => latest.toFixed(decimals) + suffix)
  const [text, setText] = useState('0' + suffix)
  useEffect(() => { mv.set(value) }, [value, mv])
  useEffect(() => display.on('change', v => setText(v)), [display])
  return <>{text}</>
}

/* ─────────────────────────────────────────────
   SCORE RING (drawer)
───────────────────────────────────────────── */
function ScoreRing({ score, ringColor, ringTrack }: { score: number; ringColor: string; ringTrack: string }) {
  const size = 132
  const stroke = 9
  const radius = (size - stroke) / 2
  const circumference = 2 * Math.PI * radius

  const progressMV = useMotionValue(circumference)
  const progressSpring = useSpring(progressMV, { stiffness: 55, damping: 22 })
  useEffect(() => { progressMV.set(circumference - (score / 100) * circumference) }, [score, progressMV, circumference])

  const scoreLabel = score >= 90 ? 'EXCELLENT' : score >= 71 ? 'BON' : score >= 41 ? 'MOYEN' : 'FAIBLE'

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          stroke={ringTrack}
          strokeWidth={stroke}
          fill="none"
        />
        <motion.circle
          cx={size / 2} cy={size / 2} r={radius}
          stroke={ringColor}
          strokeWidth={stroke}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          style={{ strokeDashoffset: progressSpring }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="text-[34px] font-black leading-none tabular-nums text-slate-900">
          <CountUp value={score} />
        </div>
        <div className="text-[8px] font-semibold tracking-[0.18em] text-slate-400 mt-0.5 uppercase">
          / 100
        </div>
        <div
          className="text-[8px] font-bold tracking-widest mt-1 px-1.5 py-0.5 rounded"
          style={{ color: ringColor, background: ringTrack }}
        >
          {scoreLabel}
        </div>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────
   KPI TILE
───────────────────────────────────────────── */
function KpiTile({
  icon: Icon,
  label,
  value,
  suffix,
  decimals = 0,
  valueColor,
}: {
  icon: React.ComponentType<{ size?: number; className?: string; style?: React.CSSProperties }>
  label: string
  value: number
  suffix?: string
  decimals?: number
  valueColor?: string
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 flex flex-col gap-1.5">
      <div className="flex items-center gap-1.5">
        <Icon size={11} className="text-slate-400" />
        <span className="text-[9px] font-semibold text-slate-400 tracking-[0.12em] uppercase">{label}</span>
      </div>
      <div
        className="text-base font-black tabular-nums leading-none"
        style={{ color: valueColor ?? '#0f172a' }}
      >
        <CountUp value={value} decimals={decimals} suffix={suffix ?? ''} />
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────
   ÉTATS DE VUE + PERSISTANCE
───────────────────────────────────────────── */
type ViewState = 'drawer' | 'pill' | 'icon'
const STORAGE_KEY = 'konvert:leadmeter:view'
const VIOLET = '#7C3AED'
const VIOLET_LIGHT = 'rgba(124, 58, 237, 0.07)'

function loadView(): ViewState {
  if (typeof window === 'undefined') return 'pill'
  const v = window.localStorage.getItem(STORAGE_KEY)
  return v === 'drawer' || v === 'pill' || v === 'icon' ? v : 'pill'
}

/* ─────────────────────────────────────────────
   ICON BUTTON (header drawer + pill close)
───────────────────────────────────────────── */
function IconBtn({
  onClick,
  children,
  title,
}: {
  onClick: (e: React.MouseEvent) => void
  children: React.ReactNode
  title: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className="w-6 h-6 rounded-md flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
    >
      {children}
    </button>
  )
}

/* ─────────────────────────────────────────────
   COMPOSANT PRINCIPAL
───────────────────────────────────────────── */
interface Props {
  html: string
}

export default function Leadmeter({ html }: Props) {
  const [view, setView] = useState<ViewState>('pill')
  const mounted = useRef(false)

  // Charge l'état persisté au premier mount (côté client)
  useEffect(() => {
    setView(loadView())
    mounted.current = true
  }, [])

  // Persiste l'état
  useEffect(() => {
    if (!mounted.current) return
    try { window.localStorage.setItem(STORAGE_KEY, view) } catch {}
  }, [view])

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

  const palette = getScorePalette(score)

  // Métriques business dérivées
  const conversionRate = +(0.5 + (score / 100) * 4).toFixed(1)
  const trustScore = Math.min(100, Math.round(
    (criteria.find(c => c.id === 'proof')?.passed ? 30 : 0) +
    (criteria.find(c => c.id === 'guarantee')?.passed ? 20 : 0) +
    (criteria.find(c => c.id === 'price')?.passed ? 25 : 0) +
    (criteria.find(c => c.id === 'leaks')?.passed ? 25 : 0)
  ))
  const readTime = Math.max(1, Math.round(metrics.words / 200))
  const monthlyRevenue = metrics.priceDetected
    ? Math.round((metrics.priceDetected * 1000 * conversionRate) / 100)
    : Math.round(score * 47)

  const passed = criteria.filter(c => c.passed)
  const suggestions = criteria.filter(c => !c.passed).slice(0, 3)

  return (
    <AnimatePresence mode="wait" initial={false}>
      {/* ════════════════════════════════════════
          VUE 1 — ICON (ultra-discret)
      ════════════════════════════════════════ */}
      {view === 'icon' && (
        <motion.button
          key="icon"
          type="button"
          onClick={() => setView('pill')}
          title="Rouvrir le Leadmeter"
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.6 }}
          transition={{ type: 'spring', stiffness: 320, damping: 24 }}
          className="absolute bottom-4 right-4 z-30 w-9 h-9 rounded-full bg-white border border-slate-200 shadow-sm hover:shadow-md flex items-center justify-center transition-shadow"
          style={{ pointerEvents: 'auto' }}
        >
          <BarChart3 size={15} style={{ color: palette.accentHex }} />
          <span
            className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-white"
            style={{ background: palette.ringColor }}
          />
        </motion.button>
      )}

      {/* ════════════════════════════════════════
          VUE 2 — PILL (compacte)
      ════════════════════════════════════════ */}
      {view === 'pill' && (
        <motion.div
          key="pill"
          initial={{ opacity: 0, y: 12, scale: 0.92 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 12, scale: 0.92 }}
          transition={{ type: 'spring', stiffness: 320, damping: 26 }}
          className="absolute bottom-4 right-4 z-30 flex items-stretch gap-px rounded-full bg-white border border-slate-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden"
          style={{ pointerEvents: 'auto' }}
        >
          <button
            type="button"
            onClick={() => setView('drawer')}
            className="flex items-center gap-2 pl-3 pr-3 py-2 hover:bg-slate-50 transition-colors"
            title="Ouvrir le Leadmeter"
          >
            <motion.div
              className="w-1.5 h-1.5 rounded-full"
              style={{ background: palette.ringColor }}
              animate={{ opacity: [1, 0.35, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <span className="text-[15px] font-black tabular-nums text-slate-900 leading-none">
              {score}
            </span>
            <span
              className="text-[9px] font-bold tracking-widest px-1.5 py-0.5 rounded"
              style={{ color: palette.accentHex, background: palette.ringTrack }}
            >
              {palette.label}
            </span>
          </button>
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); setView('icon') }}
            title="Réduire en icône"
            className="px-2 flex items-center justify-center text-slate-300 hover:text-slate-600 hover:bg-slate-50 transition-colors border-l border-slate-100"
          >
            <Minus size={12} />
          </button>
        </motion.div>
      )}

      {/* ════════════════════════════════════════
          VUE 3 — DRAWER (panneau complet)
      ════════════════════════════════════════ */}
      {view === 'drawer' && (
        <motion.div
          key="drawer"
          initial={{ opacity: 0, x: 20, scale: 0.98 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: 20, scale: 0.98 }}
          transition={{ type: 'spring', stiffness: 280, damping: 28 }}
          className="absolute bottom-4 right-4 top-4 z-30 w-[300px] rounded-2xl bg-white border border-slate-200 shadow-xl overflow-hidden flex flex-col"
          style={{ pointerEvents: 'auto' }}
        >
          {/* ── HEADER ── */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 bg-white flex-shrink-0">
            <div className="flex items-center gap-2">
              <motion.div
                className="w-1.5 h-1.5 rounded-full"
                style={{ background: VIOLET }}
                animate={{ opacity: [1, 0.35, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <span className="text-[10px] font-bold text-slate-600 tracking-[0.16em] uppercase">
                Leadmeter
              </span>
              <span
                className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md border tracking-wider ${palette.labelClass}`}
              >
                {palette.label}
              </span>
            </div>
            <div className="flex items-center gap-0.5">
              <IconBtn onClick={() => setView('pill')} title="Réduire en pastille">
                <Minus size={13} />
              </IconBtn>
              <IconBtn onClick={() => setView('icon')} title="Masquer (mode icône)">
                <X size={13} />
              </IconBtn>
            </div>
          </div>

          {/* ── CONTENU SCROLLABLE ── */}
          <div className="flex-1 overflow-y-auto">
            <div className="flex flex-col gap-4 p-4">

              {/* Score ring */}
              <div className="flex justify-center pt-1">
                <ScoreRing score={score} ringColor={palette.ringColor} ringTrack={palette.ringTrack} />
              </div>

              {/* KPIs 2x2 */}
              <div className="grid grid-cols-2 gap-2">
                <KpiTile
                  icon={TrendingUp}
                  label="Conv. est."
                  value={conversionRate}
                  decimals={1}
                  suffix="%"
                  valueColor={palette.accentHex}
                />
                <KpiTile
                  icon={Zap}
                  label="CA / mois"
                  value={monthlyRevenue}
                  suffix={` ${metrics.currency}`}
                  valueColor={palette.accentHex}
                />
                <KpiTile
                  icon={Eye}
                  label="Lecture"
                  value={readTime}
                  suffix=" min"
                  valueColor={VIOLET}
                />
                <KpiTile
                  icon={Shield}
                  label="Trust"
                  value={trustScore}
                  suffix="/100"
                  valueColor={VIOLET}
                />
              </div>

              <div className="h-px bg-slate-200" />

              {/* Critères — progression */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[9px] font-semibold text-slate-400 tracking-[0.14em] uppercase">
                    Critères
                  </span>
                  <span
                    className="text-[9px] font-bold tabular-nums px-1.5 py-0.5 rounded"
                    style={{ color: VIOLET, background: VIOLET_LIGHT }}
                  >
                    {passed.length} / {criteria.length}
                  </span>
                </div>
                <div className="h-1 rounded-full bg-slate-200 overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ background: VIOLET }}
                    initial={{ width: 0 }}
                    animate={{ width: `${(passed.length / Math.max(criteria.length, 1)) * 100}%` }}
                    transition={{ duration: 0.7, ease: 'easeOut' }}
                  />
                </div>
              </div>

              {/* Checklist */}
              <div className="flex flex-col gap-1">
                {criteria.map((c, i) => (
                  <motion.div
                    key={c.id}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.025, duration: 0.2 }}
                    className={`flex items-center gap-2 px-2 py-1.5 rounded-lg transition-colors ${
                      c.passed ? 'bg-slate-50 border border-slate-200' : 'bg-transparent'
                    }`}
                  >
                    <div
                      className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 transition-all"
                      style={
                        c.passed
                          ? { background: palette.ringColor, border: 'none' }
                          : { background: 'transparent', border: '1.5px solid #cbd5e1' }
                      }
                    >
                      {c.passed && <Check size={8} className="text-white" strokeWidth={3} />}
                    </div>
                    <span
                      className={`text-[11px] font-medium leading-none flex-1 truncate ${
                        c.passed ? 'text-slate-700' : 'text-slate-400'
                      }`}
                    >
                      {c.label}
                    </span>
                    <span
                      className="text-[9px] font-bold tabular-nums px-1.5 py-0.5 rounded"
                      style={
                        c.passed
                          ? { color: palette.accentHex, background: palette.accentLight }
                          : { color: '#94a3b8', background: '#f1f5f9' }
                      }
                    >
                      +{c.points}
                    </span>
                  </motion.div>
                ))}
              </div>

              {/* Boost rapide */}
              {suggestions.length > 0 && (
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-1.5">
                    <Sparkles size={10} style={{ color: VIOLET }} />
                    <span className="text-[9px] font-semibold text-slate-400 tracking-[0.14em] uppercase">
                      Boost rapide
                    </span>
                  </div>
                  {suggestions.map(s => (
                    <div
                      key={s.id}
                      className="flex items-start gap-2 px-2.5 py-2 rounded-lg bg-white border border-slate-200"
                    >
                      <div
                        className="w-1 h-1 rounded-full mt-1.5 flex-shrink-0"
                        style={{ background: VIOLET }}
                      />
                      <span className="text-[10px] text-slate-500 leading-snug">{s.hint}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Score parfait */}
              {score === 100 && (
                <motion.div
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-center py-3 rounded-xl text-[11px] font-bold tracking-wider border"
                  style={{
                    color: palette.accentHex,
                    background: palette.accentLight,
                    borderColor: palette.accentBorder,
                  }}
                >
                  Page optimisée au maximum
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
