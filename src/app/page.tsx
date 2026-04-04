'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import {
  Check,
  ArrowRight,
  Zap,
  MousePointerClick,
  BarChart2,
  Store,
  Users,
  Star,
  ChevronDown,
  Sparkles,
  Layers,
  TrendingUp,
  Menu,
  X,
} from 'lucide-react'

/* ─── ÉTOILES STATIQUES (générées une seule fois) ───────────────────────── */
const STARS = Array.from({ length: 80 }, (_, i) => ({
  id: i,
  top: `${(i * 17 + 5) % 100}%`,
  left: `${(i * 23 + 3) % 100}%`,
  size: (i % 3) + 1,
  duration: `${2 + (i % 4)}s`,
  delay: `${(i % 30) * 0.1}s`,
}))

/* ─── HOOK : SCROLL REVEAL ──────────────────────────────────────────────── */
function useReveal() {
  useEffect(() => {
    const elements = document.querySelectorAll('.reveal')
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible')
          }
        })
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    )
    elements.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])
}

/* ─── HOOK : COMPTEUR DE STATS ──────────────────────────────────────────── */
function useCounter(target: number, duration = 1500, trigger: boolean) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    if (!trigger) return
    let start = 0
    const step = Math.ceil(target / (duration / 16))
    const timer = setInterval(() => {
      start += step
      if (start >= target) {
        setCount(target)
        clearInterval(timer)
      } else {
        setCount(start)
      }
    }, 16)
    return () => clearInterval(timer)
  }, [target, duration, trigger])
  return count
}

/* ─── COMPOSANT STATS AVEC COMPTEUR ────────────────────────────────────── */
function StatCounter({
  value,
  label,
  suffix = '',
  triggered,
}: {
  value: number
  label: string
  suffix?: string
  triggered: boolean
}) {
  const count = useCounter(value, 1200, triggered)
  return (
    <div className="text-center">
      <div
        className="text-4xl md:text-5xl font-black"
        style={{
          background: 'linear-gradient(135deg, #ffffff 0%, #c4b5fd 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }}
      >
        {count}{suffix}
      </div>
      <div className="text-sm text-purple-300/70 mt-1 font-medium">{label}</div>
    </div>
  )
}

/* ─── COMPOSANT FAQ ITEM ────────────────────────────────────────────────── */
function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div
      className="glass-card rounded-2xl overflow-hidden cursor-pointer"
      style={{ border: '1px solid rgba(139,92,246,0.15)', transition: 'border-color 0.3s ease' }}
      onMouseEnter={(e) =>
        ((e.currentTarget as HTMLElement).style.borderColor = 'rgba(139,92,246,0.4)')
      }
      onMouseLeave={(e) =>
        ((e.currentTarget as HTMLElement).style.borderColor = 'rgba(139,92,246,0.15)')
      }
    >
      <button
        className="w-full px-6 py-5 flex items-center justify-between text-left"
        onClick={() => setOpen(!open)}
      >
        <span className="font-semibold text-white text-sm pr-4">{q}</span>
        <ChevronDown
          className="w-4 h-4 text-purple-400 flex-shrink-0 transition-transform duration-300"
          style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}
        />
      </button>
      <div
        className="faq-answer px-6"
        style={open ? { maxHeight: '500px', opacity: 1, paddingBottom: '20px' } : {}}
      >
        <p className="text-purple-200/70 text-sm leading-relaxed">{a}</p>
      </div>
    </div>
  )
}

/* ─── COMPOSANT FLOATING CARD ───────────────────────────────────────────── */
function FloatingCard({
  className,
  children,
  animClass,
}: {
  className?: string
  children: React.ReactNode
  animClass: string
}) {
  return (
    <div
      className={`absolute glass-card rounded-2xl p-4 ${animClass} ${className ?? ''}`}
      style={{ border: '1px solid rgba(139,92,246,0.2)' }}
    >
      {children}
    </div>
  )
}

/* ─── COMPOSANT TILT CARD ───────────────────────────────────────────────── */
function TiltCard({ children, className, style }: { children: React.ReactNode; className?: string; style?: React.CSSProperties }) {
  const ref = useRef<HTMLDivElement>(null)

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 20
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * -20
    el.style.transform = `perspective(800px) rotateX(${y}deg) rotateY(${x}deg) translateZ(10px)`
  }

  function handleMouseLeave() {
    if (ref.current) {
      ref.current.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) translateZ(0px)'
    }
  }

  return (
    <div
      ref={ref}
      className={className}
      style={{ ...style, transition: 'transform 0.15s ease', transformStyle: 'preserve-3d', willChange: 'transform' }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </div>
  )
}

/* ─── ROI SECTION ───────────────────────────────────────────────────────── */
function ROISection() {
  const [pages, setPages] = useState(10)

  const traditionalHours = pages * 3
  const konvertMinutes   = pages * 0.5
  const savedHours       = traditionalHours - konvertMinutes / 60
  const savedMoney       = Math.round(savedHours * 50)

  return (
    <section className="py-28 px-6 relative overflow-hidden" style={{ background: 'rgba(6,2,14,1)' }}>
      <div className="absolute inset-0 dot-pattern opacity-20 pointer-events-none" />

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-16 reveal">
          <p className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: 'rgba(167,139,250,0.7)' }}>
            ✦ Calcule ton retour sur investissement
          </p>
          <h2 className="text-4xl md:text-5xl font-black" style={{
            background: 'linear-gradient(135deg, #ffffff 0%, #e9d5ff 100%)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            letterSpacing: '-0.02em',
          }}>
            Combien de temps tu perds<br />chaque mois ?
          </h2>
          <p className="mt-4 text-base max-w-lg mx-auto" style={{ color: 'rgba(196,181,253,0.6)' }}>
            Une fiche produit manuelle = 2 à 4 heures. Avec KONVERT = 30 secondes.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 items-center reveal">

          {/* Slider */}
          <div className="rounded-3xl p-8" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(139,92,246,0.2)' }}>
            <div className="mb-8">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-bold" style={{ color: 'rgba(196,181,253,0.8)' }}>Pages produit par mois</span>
                <span className="text-2xl font-black text-white">{pages}</span>
              </div>
              <input
                type="range"
                min={1}
                max={100}
                value={pages}
                onChange={e => setPages(Number(e.target.value))}
                className="w-full h-2 rounded-full outline-none cursor-pointer"
                style={{
                  appearance: 'none',
                  background: `linear-gradient(to right, #7c3aed ${pages}%, rgba(139,92,246,0.2) ${pages}%)`,
                }}
              />
              <div className="flex justify-between text-xs mt-2" style={{ color: 'rgba(167,139,250,0.4)' }}>
                <span>1</span><span>50</span><span>100</span>
              </div>
            </div>

            {/* Comparaison */}
            <div className="space-y-4">
              {/* Sans KONVERT */}
              <div className="rounded-2xl p-4" style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.15)' }}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase tracking-wide" style={{ color: 'rgba(239,68,68,0.7)' }}>Sans KONVERT</span>
                  <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'rgba(239,68,68,0.12)', color: '#ef4444' }}>Méthode classique</span>
                </div>
                <div className="text-3xl font-black" style={{ color: '#ef4444' }}>{traditionalHours}h</div>
                <div className="text-xs mt-1" style={{ color: 'rgba(239,68,68,0.6)' }}>à 3h/page en moyenne (rédaction + design + mise en ligne)</div>
              </div>

              {/* Avec KONVERT */}
              <div className="rounded-2xl p-4" style={{ background: 'rgba(124,58,237,0.08)', border: '1px solid rgba(139,92,246,0.25)' }}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase tracking-wide" style={{ color: 'rgba(167,139,250,0.7)' }}>Avec KONVERT</span>
                  <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'rgba(74,222,128,0.12)', color: '#4ade80' }}>IA générative</span>
                </div>
                <div className="text-3xl font-black" style={{ color: '#a78bfa' }}>{konvertMinutes < 60 ? `${konvertMinutes}min` : `${(konvertMinutes/60).toFixed(1)}h`}</div>
                <div className="text-xs mt-1" style={{ color: 'rgba(167,139,250,0.5)' }}>30 secondes par page, entièrement automatisé</div>
              </div>
            </div>
          </div>

          {/* Résultats */}
          <div className="space-y-5">
            <div className="text-center md:text-left mb-2">
              <p className="text-sm font-bold uppercase tracking-widest" style={{ color: 'rgba(167,139,250,0.5)' }}>Ton gain mensuel</p>
            </div>

            {[
              {
                value: `${Math.round(savedHours * 10) / 10}h`,
                label: 'heures récupérées',
                sub: 'À consacrer à ta croissance, pas à la rédaction',
                color: '#4ade80',
                bg: 'rgba(74,222,128,0.08)',
                border: 'rgba(74,222,128,0.2)',
              },
              {
                value: `${savedMoney.toLocaleString()}€`,
                label: 'économisés (à 50€/h)',
                sub: 'Si tu externalisais ça à un copywriter freelance',
                color: '#a78bfa',
                bg: 'rgba(124,58,237,0.08)',
                border: 'rgba(139,92,246,0.2)',
              },
              {
                value: `×${Math.round((traditionalHours * 60) / Math.max(konvertMinutes, 0.5))}`,
                label: 'plus rapide',
                sub: 'Le même résultat, en une fraction du temps',
                color: '#fbbf24',
                bg: 'rgba(251,191,36,0.06)',
                border: 'rgba(251,191,36,0.2)',
              },
            ].map(s => (
              <div key={s.label} className="flex items-center gap-5 rounded-2xl px-6 py-5" style={{ background: s.bg, border: `1px solid ${s.border}` }}>
                <div className="text-4xl font-black flex-shrink-0" style={{ color: s.color }}>{s.value}</div>
                <div>
                  <div className="font-bold text-white">{s.label}</div>
                  <div className="text-xs mt-0.5" style={{ color: 'rgba(167,139,250,0.5)' }}>{s.sub}</div>
                </div>
              </div>
            ))}

            <div className="mt-6 text-center md:text-left">
              <Link
                href="/signup"
                className="btn-shimmer inline-flex items-center gap-2 px-8 py-4 rounded-2xl font-bold text-white text-base"
                style={{ background: 'linear-gradient(135deg, #7c3aed, #6d28d9)', boxShadow: '0 8px 30px rgba(124,58,237,0.4)' }}
              >
                Récupérer ces {Math.round(savedHours * 10) / 10}h →
              </Link>
              <p className="mt-2 text-xs" style={{ color: 'rgba(167,139,250,0.4)' }}>✓ Gratuit · ✓ Sans carte bancaire</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ─── TESTIMONIALS DATA ─────────────────────────────────────────────────── */
const TESTIMONIALS = [
  {
    name: 'Karim Benali',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face',
    role: 'Dropshippeur · 3 stores Shopify',
    platform: 'Shopify',
    stars: 5,
    quote: 'Mon CTR est passé de 1.2% à 4.8% sur ma première page générée. En 30 secondes j\'avais un résultat meilleur que ce que je faisais en 4 heures. Incroyable.',
    metric: '+300% CTR',
    date: 'Il y a 3 jours',
    verified: true,
  },
  {
    name: 'Sophie Marchand',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&crop=face',
    role: 'Fondatrice · Boutique beauté',
    platform: 'WooCommerce',
    stars: 5,
    quote: 'J\'ai testé sur ma crème anti-âge bestseller. La page KONVERT a généré 2x plus de ventes que mon ancienne fiche produit. Le copy IA est vraiment au niveau d\'un pro.',
    metric: '+2x ventes',
    date: 'Il y a 1 semaine',
    verified: true,
  },
  {
    name: 'Thomas Girard',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face',
    role: 'Agence e-commerce · 12 clients',
    platform: 'Shopify',
    stars: 5,
    quote: 'Je génère maintenant 12 pages produit en moins de 10 minutes pour mes clients. Ce que je facturais 300€/page, KONVERT le fait en 30s. C\'est un game changer pour mon agence.',
    metric: '12 pages en 10 min',
    date: 'Il y a 2 semaines',
    verified: true,
  },
  {
    name: 'Amina Oukili',
    avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=80&h=80&fit=crop&crop=face',
    role: 'E-commerçante · Mode & Lifestyle',
    platform: 'Shopify',
    stars: 5,
    quote: 'Le template Shein Pro est exactement ce que je cherchais. Mes pages ressemblent à du Zara.com maintenant. Les clientes passent plus de temps dessus et commandent plus.',
    metric: '+65% temps sur page',
    date: 'Il y a 4 jours',
    verified: true,
  },
  {
    name: 'Romain Lefevre',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop&crop=face',
    role: 'Coach business · Formation dropshipping',
    platform: 'Standalone',
    stars: 5,
    quote: 'Je recommande KONVERT à tous mes élèves maintenant. Résultat immédiat visible dès la première page. Le wizard 8 étapes est ultra intuitif, même les débutants s\'y retrouvent.',
    metric: '100% recommandé',
    date: 'Il y a 5 jours',
    verified: true,
  },
  {
    name: 'Léa Fontaine',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&crop=face',
    role: 'Freelance · Consultante CRO',
    platform: 'WooCommerce',
    stars: 5,
    quote: 'En tant que consultante CRO, je suis critique sur le copy de vente. KONVERT m\'a bluffée — le ton persuasif est au niveau d\'un expert. J\'intègre ça dans tous mes audits maintenant.',
    metric: 'Expert level copy',
    date: 'Il y a 1 semaine',
    verified: true,
  },
]

/* ─── WAITLIST SECTION FORM ─────────────────────────────────────────────── */
function WaitlistSection() {
  const [email, setEmail]     = useState('')
  const [name, setName]       = useState('')
  const [context, setContext] = useState('')
  const [status, setStatus]   = useState<'idle' | 'loading' | 'success' | 'exists'>('idle')

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('loading')
    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name, context }),
      })
      const data = await res.json()
      setStatus(data.message === 'already_registered' ? 'exists' : 'success')
    } catch {
      setStatus('idle')
    }
  }

  if (status === 'success') {
    return (
      <div className="rounded-3xl p-8 text-center" style={{ background: 'rgba(74,222,128,0.08)', border: '1px solid rgba(74,222,128,0.25)' }}>
        <div className="text-5xl mb-4">🎉</div>
        <h3 className="text-xl font-black text-white mb-2">Tu es sur la liste !</h3>
        <p className="text-sm" style={{ color: 'rgba(167,139,250,0.6)' }}>On t&apos;enverra ton invitation dès qu&apos;une place se libère. Reste attentif à ta boîte mail.</p>
      </div>
    )
  }

  if (status === 'exists') {
    return (
      <div className="rounded-3xl p-6 text-center" style={{ background: 'rgba(251,191,36,0.08)', border: '1px solid rgba(251,191,36,0.2)' }}>
        <p className="font-bold text-white mb-1">✓ Tu es déjà inscrit !</p>
        <p className="text-sm" style={{ color: 'rgba(167,139,250,0.5)' }}>On t&apos;a bien en liste. Ton invitation arrive bientôt.</p>
      </div>
    )
  }

  return (
    <form onSubmit={submit} className="space-y-3 text-left">
      <div className="grid grid-cols-2 gap-3">
        <input
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Ton prénom"
          required
          className="rounded-xl px-4 py-3.5 text-sm outline-none"
          style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(139,92,246,0.2)', color: '#fff' }}
          onFocus={e => (e.target.style.borderColor = '#7c3aed')}
          onBlur={e => (e.target.style.borderColor = 'rgba(139,92,246,0.2)')}
        />
        <select
          value={context}
          onChange={e => setContext(e.target.value)}
          className="rounded-xl px-4 py-3.5 text-sm outline-none"
          style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(139,92,246,0.2)', color: context ? '#fff' : 'rgba(167,139,250,0.5)' }}
        >
          <option value="" style={{ background: '#0d0d1a' }}>Mon profil...</option>
          <option value="dropshippeur" style={{ background: '#0d0d1a' }}>Dropshippeur</option>
          <option value="ecommerce" style={{ background: '#0d0d1a' }}>E-commerçant</option>
          <option value="agence" style={{ background: '#0d0d1a' }}>Agence / Freelance</option>
          <option value="autre" style={{ background: '#0d0d1a' }}>Autre</option>
        </select>
      </div>
      <div className="flex gap-3">
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="ton@email.com"
          required
          className="flex-1 rounded-xl px-4 py-3.5 text-sm outline-none"
          style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(139,92,246,0.2)', color: '#fff' }}
          onFocus={e => (e.target.style.borderColor = '#7c3aed')}
          onBlur={e => (e.target.style.borderColor = 'rgba(139,92,246,0.2)')}
        />
        <button
          type="submit"
          disabled={status === 'loading'}
          className="btn-shimmer flex-shrink-0 px-6 py-3.5 rounded-xl font-bold text-white text-sm flex items-center gap-2"
          style={{ background: 'linear-gradient(135deg,#7c3aed,#6d28d9)', boxShadow: '0 4px 20px rgba(124,58,237,0.4)', whiteSpace: 'nowrap' }}
        >
          {status === 'loading' ? '...' : <><Sparkles className="w-4 h-4" /> Rejoindre</>}
        </button>
      </div>
      <p className="text-center text-xs" style={{ color: 'rgba(167,139,250,0.4)' }}>
        Pas de spam · Désabonnement en 1 clic
      </p>
    </form>
  )
}

/* ─── PAGE PRINCIPALE ───────────────────────────────────────────────────── */
export default function Home() {
  const [scrollY, setScrollY] = useState(0)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [statsTriggered, setStatsTriggered] = useState(false)
  const [heroParallax, setHeroParallax] = useState(0)
  const [cursor, setCursor] = useState({ x: 0, y: 0 })
  const [cursorVisible, setCursorVisible] = useState(false)
  const [showStickyMobile, setShowStickyMobile] = useState(false)
  const statsRef = useRef<HTMLDivElement>(null)

  /* Scroll progress + navbar blur + parallax */
  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY
      setScrollY(y)
      const docHeight =
        document.documentElement.scrollHeight - document.documentElement.clientHeight
      setScrollProgress(docHeight > 0 ? (y / docHeight) * 100 : 0)
      setHeroParallax(y * 0.3)
      const docH = document.documentElement.scrollHeight
      setShowStickyMobile(y > 400 && y < docH - 1200)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  /* Cursor glow */
  useEffect(() => {
    const move = (e: MouseEvent) => {
      setCursor({ x: e.clientX, y: e.clientY })
      setCursorVisible(true)
    }
    const hide = () => setCursorVisible(false)
    window.addEventListener('mousemove', move)
    window.addEventListener('mouseleave', hide)
    return () => {
      window.removeEventListener('mousemove', move)
      window.removeEventListener('mouseleave', hide)
    }
  }, [])

  /* Particules canvas IA */
  useEffect(() => {
    const canvas = document.getElementById('particles-canvas') as HTMLCanvasElement
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animId: number
    const mouse = { x: -1000, y: -1000 }

    function resize() {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const particles = Array.from({ length: 80 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      r: Math.random() * 2 + 0.5,
      alpha: Math.random() * 0.5 + 0.1,
    }))

    canvas.addEventListener('mousemove', (e) => {
      const rect = canvas.getBoundingClientRect()
      mouse.x = e.clientX - rect.left
      mouse.y = e.clientY - rect.top
    })

    function draw() {
      ctx!.clearRect(0, 0, canvas.width, canvas.height)
      particles.forEach(p => {
        const dx = p.x - mouse.x
        const dy = p.y - mouse.y
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist < 120) {
          const force = (120 - dist) / 120
          p.vx += (dx / dist) * force * 0.5
          p.vy += (dy / dist) * force * 0.5
        }
        p.vx *= 0.98
        p.vy *= 0.98
        p.x += p.vx
        p.y += p.vy
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1

        ctx!.beginPath()
        ctx!.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx!.fillStyle = `rgba(167,139,250,${p.alpha})`
        ctx!.fill()
      })

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const d = Math.sqrt(dx * dx + dy * dy)
          if (d < 100) {
            ctx!.beginPath()
            ctx!.moveTo(particles[i].x, particles[i].y)
            ctx!.lineTo(particles[j].x, particles[j].y)
            ctx!.strokeStyle = `rgba(124,58,237,${0.15 * (1 - d / 100)})`
            ctx!.lineWidth = 0.5
            ctx!.stroke()
          }
        }
      }
      animId = requestAnimationFrame(draw)
    }
    draw()

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  /* Stats trigger */
  useEffect(() => {
    if (!statsRef.current) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStatsTriggered(true)
          observer.disconnect()
        }
      },
      { threshold: 0.4 }
    )
    observer.observe(statsRef.current)
    return () => observer.disconnect()
  }, [])

  /* Scroll reveal */
  useReveal()

  const navBlur = scrollY > 40

  return (
    <main
      className="overflow-x-hidden"
      style={{ background: '#0d0d1a', color: '#ffffff' }}
    >
      {/* Cursor glow */}
      {cursorVisible && (
        <div
          className="fixed pointer-events-none z-[9999]"
          style={{
            left: cursor.x - 200,
            top: cursor.y - 200,
            width: '400px',
            height: '400px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(124,58,237,0.06) 0%, transparent 70%)',
            transition: 'left 0.1s ease, top 0.1s ease',
          }}
        />
      )}

      {/* ── SCROLL PROGRESS BAR ─────────────────────────────────────────── */}
      <div
        className="scroll-progress"
        style={{ width: `${scrollProgress}%` }}
      />

      {/* ── NAVBAR ──────────────────────────────────────────────────────── */}
      <nav
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
        style={{
          background: navBlur ? 'rgba(13, 13, 26, 0.85)' : 'transparent',
          backdropFilter: navBlur ? 'blur(20px)' : 'blur(0px)',
          WebkitBackdropFilter: navBlur ? 'blur(20px)' : 'blur(0px)',
          borderBottom: navBlur ? '1px solid rgba(139,92,246,0.15)' : '1px solid transparent',
        }}
      >
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <span
            className="font-black text-xl tracking-tight cursor-pointer select-none"
            style={{ letterSpacing: '-0.03em' }}
          >
            <span style={{ color: '#ffffff' }}>KON</span>
            <span
              style={{
                background: 'linear-gradient(135deg, #a78bfa, #7c3aed)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              VERT
            </span>
          </span>

          {/* Nav links desktop */}
          <div className="hidden md:flex items-center gap-8 text-sm font-medium">
            {[
              { label: 'Comment ça marche', href: '#how' },
              { label: 'Tarifs', href: '#pricing' },
              { label: 'FAQ', href: '#faq' },
            ].map(({ label, href }) => (
              <a
                key={href}
                href={href}
                className="transition-colors duration-200"
                style={{ color: 'rgba(196,181,253,0.7)' }}
                onMouseEnter={(e) =>
                  ((e.target as HTMLElement).style.color = '#ffffff')
                }
                onMouseLeave={(e) =>
                  ((e.target as HTMLElement).style.color = 'rgba(196,181,253,0.7)')
                }
              >
                {label}
              </a>
            ))}
          </div>

          {/* CTA desktop */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/login"
              className="text-sm font-semibold transition-colors duration-200"
              style={{ color: 'rgba(196,181,253,0.7)' }}
            >
              Connexion
            </Link>
            <Link
              href="/signup"
              className="btn-shimmer relative text-sm font-bold px-5 py-2.5 rounded-xl transition-all duration-200"
              style={{
                background: 'linear-gradient(135deg, #7c3aed, #6d28d9)',
                color: '#ffffff',
                boxShadow: '0 4px 15px rgba(124,58,237,0.4)',
              }}
            >
              Essai gratuit
            </Link>
          </div>

          {/* Mobile menu toggle */}
          <button
            className="md:hidden p-2 text-purple-300"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div
            className="md:hidden px-6 py-4 space-y-4"
            style={{
              background: 'rgba(13,13,26,0.95)',
              borderTop: '1px solid rgba(139,92,246,0.15)',
            }}
          >
            {[
              { label: 'Comment ça marche', href: '#how' },
              { label: 'Tarifs', href: '#pricing' },
              { label: 'FAQ', href: '#faq' },
            ].map(({ label, href }) => (
              <a
                key={href}
                href={href}
                className="block text-purple-200 text-sm font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                {label}
              </a>
            ))}
            <div className="pt-2 flex gap-3">
              <Link href="/login" className="text-sm text-purple-300 font-semibold">
                Connexion
              </Link>
              <Link
                href="/signup"
                className="text-sm font-bold px-4 py-2 rounded-xl text-white"
                style={{ background: 'linear-gradient(135deg, #7c3aed, #6d28d9)' }}
              >
                Essai gratuit
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* ── HERO ────────────────────────────────────────────────────────── */}
      <section
        className="relative min-h-screen flex flex-col items-center justify-center pt-24 pb-16 px-6 overflow-hidden"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1600&h=900&fit=crop&q=80')",
          backgroundSize: 'cover',
          backgroundPosition: `calc(center) calc(center + ${heroParallax}px)`,
        }}
      >
        {/* Overlay sombre pour lisibilité du texte */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'rgba(13,13,26,0.85)' }}
        />
        {/* Radial overlays purple par-dessus l'overlay sombre */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse 80% 60% at 50% -10%, rgba(124,58,237,0.35) 0%, transparent 60%), radial-gradient(ellipse 60% 40% at 80% 80%, rgba(109,40,217,0.2) 0%, transparent 50%)',
          }}
        />
        {/* Dot grid */}
        <div className="absolute inset-0 dot-pattern opacity-40" />

        {/* Étoiles */}
        {STARS.map((s) => (
          <div
            key={s.id}
            className="star"
            style={{
              top: s.top,
              left: s.left,
              width: `${s.size}px`,
              height: `${s.size}px`,
              ['--duration' as string]: s.duration,
              ['--delay' as string]: s.delay,
            }}
          />
        ))}

        {/* Orbe 3D rotatif */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none" style={{ width: '500px', height: '500px' }}>
          {/* Sphère principale */}
          <div style={{
            width: '100%', height: '100%', borderRadius: '50%',
            background: 'radial-gradient(circle at 35% 30%, rgba(196,181,253,0.25) 0%, rgba(124,58,237,0.15) 40%, transparent 70%)',
            boxShadow: '0 0 120px rgba(124,58,237,0.2), inset 0 0 80px rgba(124,58,237,0.08)',
            animation: 'orbePulse 4s ease-in-out infinite',
          }} />
          {/* Anneau orbital 1 */}
          <div style={{
            position: 'absolute', inset: '-60px',
            border: '1px solid rgba(139,92,246,0.15)',
            borderRadius: '50%',
            transform: 'rotateX(75deg)',
            animation: 'orbeRing1 12s linear infinite',
          }} />
          {/* Anneau orbital 2 */}
          <div style={{
            position: 'absolute', inset: '-30px',
            border: '1px solid rgba(139,92,246,0.1)',
            borderRadius: '50%',
            transform: 'rotateX(60deg) rotateZ(45deg)',
            animation: 'orbeRing2 18s linear infinite reverse',
          }} />
          {/* Anneau orbital 3 */}
          <div style={{
            position: 'absolute', inset: '-90px',
            border: '0.5px solid rgba(167,139,250,0.08)',
            borderRadius: '50%',
            transform: 'rotateX(80deg) rotateY(20deg)',
            animation: 'orbeRing1 25s linear infinite',
          }} />
          {/* Points lumineux sur les anneaux */}
          {[0,60,120,180,240,300].map((deg, i) => (
            <div key={i} style={{
              position: 'absolute',
              width: '4px', height: '4px',
              borderRadius: '50%',
              background: i % 2 === 0 ? '#a78bfa' : '#7c3aed',
              boxShadow: `0 0 8px ${i % 2 === 0 ? '#a78bfa' : '#7c3aed'}`,
              top: `${50 + 48 * Math.sin(deg * Math.PI / 180)}%`,
              left: `${50 + 48 * Math.cos(deg * Math.PI / 180)}%`,
              transform: 'translate(-50%, -50%)',
              animation: `starTwinkle ${1.5 + i * 0.3}s ease-in-out infinite alternate`,
            }} />
          ))}
        </div>

        {/* Floating cards */}
        <div className="absolute inset-0 pointer-events-none hidden lg:block">
          <FloatingCard
            animClass="animate-float"
            className="top-32 left-8 xl:left-24 w-56"
          >
            <div className="flex items-center gap-2 mb-2">
              <div
                className="w-6 h-6 rounded-lg flex items-center justify-center"
                style={{ background: 'rgba(124,58,237,0.3)' }}
              >
                <Zap className="w-3 h-3 text-purple-300" />
              </div>
              <span className="text-xs font-bold text-white">IA génère en live</span>
            </div>
            <div className="space-y-1">
              {['Titre accrocheur', '5 bénéfices clés', 'CTA optimisé'].map((item) => (
                <div key={item} className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 bg-green-400 rounded-full" />
                  <span className="text-xs text-green-300/80 font-mono">{item}</span>
                </div>
              ))}
            </div>
            <div className="mt-2 text-center">
              <span
                className="text-2xl font-black"
                style={{
                  background: 'linear-gradient(135deg, #a78bfa, #7c3aed)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                ⚡ 28s
              </span>
            </div>
          </FloatingCard>

          <FloatingCard
            animClass="animate-float-reverse"
            className="top-36 right-8 xl:right-24 w-52"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-white">Conversions</span>
              <TrendingUp className="w-3 h-3 text-green-400" />
            </div>
            <div className="text-3xl font-black text-green-400 mb-1">+40%</div>
            <div className="text-xs text-purple-200/60">Semaine vs N-1</div>
            <div className="mt-2 h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.1)' }}>
              <div
                className="h-full rounded-full"
                style={{ width: '72%', background: 'linear-gradient(90deg, #7c3aed, #a78bfa)' }}
              />
            </div>
          </FloatingCard>

          <FloatingCard
            animClass="animate-float-delay-1"
            className="bottom-48 left-8 xl:left-32 w-48"
          >
            <div className="flex items-center gap-2 mb-2">
              <Store className="w-4 h-4 text-purple-400" />
              <span className="text-xs font-bold text-white">Publié sur Shopify</span>
            </div>
            <div className="flex items-center gap-1 mt-1">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
            <div className="text-xs text-purple-200/60 mt-1">4.9/5 — 200+ avis</div>
          </FloatingCard>

          <FloatingCard
            animClass="animate-float-delay-2"
            className="bottom-44 right-8 xl:right-28 w-52"
          >
            <div className="text-xs text-purple-300/60 mb-1 font-mono uppercase tracking-wider">
              URL produit
            </div>
            <div
              className="text-xs text-green-400 font-mono p-2 rounded-lg mb-2"
              style={{ background: 'rgba(0,0,0,0.3)' }}
            >
              aliexpress.com/item/123...
            </div>
            <div
              className="text-center py-1.5 rounded-lg text-xs font-bold text-white"
              style={{ background: 'linear-gradient(135deg, #7c3aed, #6d28d9)' }}
            >
              Générer
            </div>
          </FloatingCard>
        </div>

        {/* Contenu héro */}
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 mb-8 px-4 py-2 rounded-full animate-glow"
            style={{
              background: 'rgba(124,58,237,0.15)',
              border: '1px solid rgba(139,92,246,0.4)',
            }}
          >
            <div className="relative">
              <div
                className="w-2 h-2 rounded-full"
                style={{ background: '#a78bfa' }}
              />
              <div className="pulse-ring" />
            </div>
            <Sparkles className="w-3.5 h-3.5 text-purple-300" />
            <span className="text-sm font-semibold text-purple-200">
              Bêta ouverte — 50 pages offertes
            </span>
          </div>

          {/* H1 */}
          <h1
            className="font-black tracking-tight leading-none mb-6"
            style={{ fontSize: 'clamp(2.5rem, 7vw, 5.5rem)', letterSpacing: '-0.03em' }}
          >
            <span
              style={{
                background: 'linear-gradient(135deg, #ffffff 0%, #e9d5ff 60%, #c4b5fd 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Colle une URL.
            </span>
            <br />
            <span
              className="animate-glow-text"
              style={{
                background: 'linear-gradient(135deg, #a78bfa 0%, #7c3aed 50%, #6d28d9 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Ta page est prête.
            </span>
          </h1>

          {/* Sous-titre */}
          <p
            className="text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed"
            style={{ color: 'rgba(196,181,253,0.7)' }}
          >
            KONVERT génère des landing pages e-commerce haute conversion en{' '}
            <span className="text-purple-300 font-semibold">30 secondes</span>.
            L'IA rédige le copy, choisit le design, et publie directement sur ton Shopify ou WooCommerce.
          </p>

          {/* Input URL Hero */}
          <div className="max-w-2xl mx-auto mb-8 reveal">
            <div
              className="flex items-center gap-0 rounded-2xl overflow-hidden p-1"
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(139,92,246,0.4)',
                boxShadow: '0 0 30px rgba(124,58,237,0.15)',
              }}
            >
              <div className="flex items-center gap-2 px-4 py-3 flex-1">
                <div className="w-2 h-2 rounded-full bg-green-400 flex-shrink-0" style={{ animation: 'pulse 2s ease-in-out infinite' }} />
                <input
                  type="text"
                  placeholder="aliexpress.com/item/... ou amazon.fr/dp/..."
                  className="flex-1 bg-transparent outline-none text-sm font-mono"
                  style={{ color: '#e9d5ff', caretColor: '#a78bfa' }}
                  readOnly
                />
              </div>
              <a
                href="/signup"
                className="btn-shimmer flex-shrink-0 px-6 py-3 rounded-xl text-sm font-bold text-white"
                style={{ background: 'linear-gradient(135deg, #7c3aed, #6d28d9)', boxShadow: '0 4px 15px rgba(124,58,237,0.4)' }}
              >
                Générer →
              </a>
            </div>
            <p className="text-center text-xs mt-2" style={{ color: 'rgba(167,139,250,0.5)' }}>
              ✓ Aucune carte bancaire · ✓ 50 pages offertes · ✓ Setup en 2 minutes
            </p>
          </div>

          {/* CTA buttons — Bêta fermée */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-4">
            <a
              href="#waitlist"
              className="btn-shimmer inline-flex items-center justify-center gap-2 font-bold px-8 py-4 rounded-2xl text-lg transition-all duration-300"
              style={{
                background: 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)',
                color: '#ffffff',
                boxShadow: '0 8px 30px rgba(124,58,237,0.5)',
              }}
            >
              <Sparkles className="w-5 h-5" />
              Rejoindre la bêta
            </a>
            <a
              href="#how"
              className="inline-flex items-center justify-center gap-2 font-bold px-8 py-4 rounded-2xl text-lg transition-all duration-300"
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(139,92,246,0.3)',
                color: '#e9d5ff',
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLElement
                el.style.background = 'rgba(124,58,237,0.1)'
                el.style.borderColor = 'rgba(139,92,246,0.6)'
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLElement
                el.style.background = 'rgba(255,255,255,0.05)'
                el.style.borderColor = 'rgba(139,92,246,0.3)'
              }}
            >
              Voir comment ça marche
            </a>
          </div>
          <p className="text-center text-sm mb-10" style={{ color: 'rgba(167,139,250,0.5)' }}>
            ✓ Bêta gratuite · ✓ 50 premiers utilisateurs · ✓ Accès prioritaire
          </p>

          {/* Stats */}
          <div ref={statsRef} className="flex flex-wrap justify-center gap-10">
            <StatCounter value={30} suffix="s" label="Pour générer une page" triggered={statsTriggered} />
            <StatCounter value={5} suffix="" label="Templates premium" triggered={statsTriggered} />
            <StatCounter value={2} suffix="x" label="Plus de conversions" triggered={statsTriggered} />
            <div className="text-center">
              <div
                className="text-4xl md:text-5xl font-black"
                style={{
                  background: 'linear-gradient(135deg, #ffffff 0%, #c4b5fd 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                1-clic
              </div>
              <div className="text-sm text-purple-300/70 mt-1 font-medium">Push sur Shopify</div>
            </div>
          </div>
        </div>

        {/* Flèche scroll */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <ChevronDown className="w-6 h-6 text-purple-400/50" />
        </div>
      </section>

      {/* ── WAVE SEPARATOR ──────────────────────────────────────────────── */}
      <div className="wave-separator" style={{ background: '#0d0d1a', marginBottom: '-2px' }}>
        <svg viewBox="0 0 1440 60" preserveAspectRatio="none" style={{ height: '60px' }}>
          <path
            d="M0,0 C360,60 1080,60 1440,0 L1440,60 L0,60 Z"
            fill="rgba(18,8,38,1)"
          />
        </svg>
      </div>

      {/* ── TRUST BAR ─── */}
      <section className="py-10 px-6" style={{ background: 'rgba(18,8,38,1)', borderTop: '1px solid rgba(139,92,246,0.1)', borderBottom: '1px solid rgba(139,92,246,0.1)' }}>
        <div className="max-w-5xl mx-auto">
          <p className="text-center text-xs font-semibold tracking-widest uppercase mb-6" style={{ color: 'rgba(139,92,246,0.5)' }}>
            Compatible avec
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
            {/* Shopify */}
            <div className="flex items-center gap-2 opacity-60 hover:opacity-100 transition-opacity duration-300">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="#96BF48"><path d="M15.337 23.979l7.216-1.561S19.686 7.329 19.67 7.207c-.017-.12-.12-.2-.222-.2-.1 0-1.857-.037-1.857-.037s-1.482-1.432-1.63-1.58v18.589zM14.067 4.168s-.97-.29-2.56-.29c-4.003 0-5.94 2.5-5.94 4.97 0 2.736 1.9 4.03 3.615 4.892 1.61.81 2.16 1.39 2.16 2.21 0 .87-.697 1.38-1.84 1.38-1.64 0-3.143-.85-3.143-.85L5.5 18.67s1.548.96 3.82.96c3.617 0 5.94-1.79 5.94-5.027 0-2.72-1.857-4.01-3.632-4.897-1.47-.73-2.143-1.266-2.143-2.13 0-.72.582-1.432 1.857-1.432 1.148 0 2.22.47 2.22.47l.505-2.446z"/></svg>
              <span className="text-sm font-bold" style={{ color: 'rgba(255,255,255,0.7)' }}>Shopify</span>
            </div>
            {/* WooCommerce */}
            <div className="flex items-center gap-2 opacity-60 hover:opacity-100 transition-opacity duration-300">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="#7f54b3"><path d="M2.047 4.005A2.47 2.47 0 00.02 6.41l1.565 10.943a2.47 2.47 0 002.693 2.123l14.13-1.565a2.47 2.47 0 002.123-2.693L18.967 4.275a2.47 2.47 0 00-2.693-2.123L2.144 3.717l-.097.288zm3.29 3.574c.287-.032.56.097.656.384l1.145 3.86 1.24-2.37c.128-.256.384-.384.64-.352.257.032.48.224.545.48l.704 2.788 1.017-4.756c.064-.32.352-.544.672-.512.32.032.544.32.512.64l-1.505 7.033c-.064.288-.32.48-.608.48-.257 0-.48-.16-.577-.384l-.833-3.284-1.392 2.658c-.128.24-.384.384-.64.352a.66.66 0 01-.545-.48L4.16 8.219c-.064-.32.128-.64.448-.672l.73.032z"/></svg>
              <span className="text-sm font-bold" style={{ color: 'rgba(255,255,255,0.7)' }}>WooCommerce</span>
            </div>
            {/* AliExpress */}
            <div className="flex items-center gap-2 opacity-60 hover:opacity-100 transition-opacity duration-300">
              <div className="w-6 h-6 rounded flex items-center justify-center text-xs font-black" style={{ background: '#ff4747', color: 'white' }}>AE</div>
              <span className="text-sm font-bold" style={{ color: 'rgba(255,255,255,0.7)' }}>AliExpress</span>
            </div>
            {/* Amazon */}
            <div className="flex items-center gap-2 opacity-60 hover:opacity-100 transition-opacity duration-300">
              <div className="w-6 h-6 rounded flex items-center justify-center text-xs font-black" style={{ background: '#FF9900', color: '#0F1111' }}>a</div>
              <span className="text-sm font-bold" style={{ color: 'rgba(255,255,255,0.7)' }}>Amazon</span>
            </div>
            {/* Claude / Anthropic */}
            <div className="flex items-center gap-2 opacity-60 hover:opacity-100 transition-opacity duration-300">
              <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-black" style={{ background: 'linear-gradient(135deg, #d4a574, #c48a4a)', color: 'white' }}>C</div>
              <span className="text-sm font-bold" style={{ color: 'rgba(255,255,255,0.7)' }}>Claude · Anthropic</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── DEMO VISUELLE ────────────────────────────────────────────────── */}
      <section
        className="px-6 py-24"
        style={{ background: 'rgba(18,8,38,1)' }}
      >
        <div className="max-w-5xl mx-auto reveal">
          <div
            className="rounded-3xl overflow-hidden shadow-2xl"
            style={{
              border: '1px solid rgba(139,92,246,0.25)',
              boxShadow: '0 0 60px rgba(124,58,237,0.2), 0 40px 80px rgba(0,0,0,0.6)',
            }}
          >
            {/* Barre de navigateur */}
            <div
              className="px-4 py-3 flex items-center gap-3"
              style={{ background: 'rgba(24,14,44,1)' }}
            >
              <div className="flex gap-1.5">
                <div className="w-3 h-3 bg-red-500/80 rounded-full" />
                <div className="w-3 h-3 bg-yellow-500/80 rounded-full" />
                <div className="w-3 h-3 bg-green-500/80 rounded-full" />
              </div>
              <div
                className="flex-1 rounded-lg px-3 py-1 text-xs text-center max-w-xs mx-auto font-mono"
                style={{ background: 'rgba(0,0,0,0.4)', color: 'rgba(167,139,250,0.8)' }}
              >
                konvert.app/dashboard/new
              </div>
            </div>

            {/* Contenu démo */}
            <div
              className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6"
              style={{ background: 'rgba(14,6,28,1)' }}
            >
              <div className="space-y-4">
                <div className="text-xs font-bold uppercase tracking-widest" style={{ color: 'rgba(139,92,246,0.7)' }}>
                  URL du produit
                </div>
                <div
                  className="rounded-xl p-3 text-sm font-mono"
                  style={{ background: 'rgba(0,0,0,0.5)', color: '#4ade80' }}
                >
                  aliexpress.com/item/123456789
                </div>
                <div className="text-xs font-bold uppercase tracking-widest mt-4" style={{ color: 'rgba(139,92,246,0.7)' }}>
                  Template
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {['Dark', 'White', 'Bold'].map((t, i) => (
                    <div
                      key={t}
                      className="rounded-lg p-2 text-xs font-bold text-center"
                      style={
                        i === 0
                          ? {
                              background: 'linear-gradient(135deg, #7c3aed, #6d28d9)',
                              color: '#ffffff',
                            }
                          : {
                              background: 'rgba(255,255,255,0.05)',
                              color: 'rgba(167,139,250,0.5)',
                              border: '1px solid rgba(139,92,246,0.1)',
                            }
                      }
                    >
                      {t}
                    </div>
                  ))}
                </div>

                {/* Progress bar génération */}
                <div className="mb-4">
                  <div className="flex justify-between text-xs mb-1" style={{ color: 'rgba(167,139,250,0.6)' }}>
                    <span>Génération en cours</span>
                    <span style={{ color: '#4ade80' }}>100%</span>
                  </div>
                  <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
                    <div className="h-full rounded-full" style={{
                      width: '100%',
                      background: 'linear-gradient(90deg, #7c3aed, #4ade80)',
                      animation: 'progressFill 2s ease-out forwards',
                    }} />
                  </div>
                </div>

                <button
                  className="btn-shimmer w-full rounded-xl py-3 text-sm font-bold text-white mt-2 flex items-center justify-center gap-2"
                  style={{
                    background: 'linear-gradient(135deg, #7c3aed, #6d28d9)',
                    boxShadow: '0 4px 20px rgba(124,58,237,0.4)',
                  }}
                >
                  <span
                    className="w-2 h-2 bg-white rounded-full"
                    style={{ animation: 'pulse 1.5s ease-in-out infinite' }}
                  />
                  Génération en cours...
                </button>
              </div>

              {/* Dashboard preview — image réelle */}
              <div
                className="rounded-xl overflow-hidden relative"
                style={{
                  border: '1px solid rgba(139,92,246,0.3)',
                  minHeight: '280px',
                }}
              >
                <img
                  src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=560&fit=crop&q=80"
                  alt="Dashboard Konvert"
                  className="w-full h-full object-cover"
                  style={{ display: 'block', minHeight: '280px' }}
                />
                {/* Badge overlay en bas */}
                <div
                  className="absolute bottom-3 left-3 right-3 flex items-center justify-between px-3 py-2 rounded-lg"
                  style={{ background: 'rgba(13,13,26,0.8)', backdropFilter: 'blur(8px)', border: '1px solid rgba(139,92,246,0.2)' }}
                >
                  <div className="flex items-center gap-1.5 text-xs text-purple-300 font-bold">
                    <Zap className="w-3 h-3" />
                    Page générée
                  </div>
                  <div
                    className="text-sm font-black"
                    style={{
                      background: 'linear-gradient(135deg, #a78bfa, #7c3aed)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                    }}
                  >
                    ⚡ 28s
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── WAVE UP ──────────────────────────────────────────────────────── */}
      <div className="wave-separator" style={{ background: 'rgba(18,8,38,1)', marginBottom: '-2px' }}>
        <svg viewBox="0 0 1440 60" preserveAspectRatio="none" style={{ height: '60px' }}>
          <path
            d="M0,60 C360,0 1080,0 1440,60 L1440,0 L0,0 Z"
            fill="rgba(12,4,26,1)"
          />
        </svg>
      </div>

      {/* ── COMMENT ÇA MARCHE ────────────────────────────────────────────── */}
      <section
        id="how"
        className="py-28 px-6 relative overflow-hidden"
        style={{ background: 'rgba(12,4,26,1)' }}
      >
        {/* Grid pattern */}
        <div className="absolute inset-0 grid-pattern opacity-60" />

        <div className="max-w-5xl mx-auto relative z-10">
          <div className="text-center mb-20 reveal">
            <span
              className="text-xs font-bold tracking-widest uppercase"
              style={{ color: 'rgba(167,139,250,0.8)' }}
            >
              Simple comme bonjour
            </span>
            <h2
              className="text-4xl md:text-5xl font-black mt-3"
              style={{
                background: 'linear-gradient(135deg, #ffffff 0%, #e9d5ff 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                letterSpacing: '-0.02em',
              }}
            >
              3 étapes. C'est tout.
            </h2>
          </div>

          {/* Timeline */}
          <div className="relative">
            {/* Ligne verticale centrale (desktop uniquement) */}
            <div
              className="hidden md:block absolute left-1/2 top-16 bottom-16 w-px"
              style={{
                background: 'linear-gradient(to bottom, rgba(124,58,237,0.7), rgba(124,58,237,0.1))',
                transform: 'translateX(-50%)',
              }}
            />

            <div className="space-y-12 md:space-y-0 md:grid md:grid-cols-3 md:gap-8">
              {[
                {
                  step: '01',
                  icon: <MousePointerClick className="w-6 h-6 text-purple-300" />,
                  title: 'Colle une URL produit',
                  desc: "AliExpress, Amazon, Alibaba ou n'importe quelle boutique. KONVERT extrait automatiquement le titre, les images et le prix.",
                  delay: '',
                },
                {
                  step: '02',
                  icon: <Zap className="w-6 h-6 text-purple-300" />,
                  title: "L'IA génère le contenu",
                  desc: "Claude rédige un copy de vente optimisé : titre accrocheur, bénéfices, FAQ, urgence, CTA. Le tout en français parfait.",
                  delay: 'reveal-delay-2',
                },
                {
                  step: '03',
                  icon: <Store className="w-6 h-6 text-purple-300" />,
                  title: 'Publie en 1 clic',
                  desc: "Édite visuellement avec le builder drag & drop, puis publie directement sur ton Shopify ou WooCommerce.",
                  delay: 'reveal-delay-4',
                },
              ].map(({ step, icon, title, desc, delay }) => (
                <TiltCard
                  key={step}
                  className={`reveal ${delay} glass-card rounded-3xl p-8 relative`}
                  style={{ border: '1px solid rgba(139,92,246,0.15)' }}
                >
                  {/* Numéro flottant */}
                  <div
                    className="absolute top-5 right-6 text-6xl font-black select-none leading-none"
                    style={{ color: 'rgba(124,58,237,0.12)', letterSpacing: '-0.05em' }}
                  >
                    {step}
                  </div>

                  {/* Icône cercle gradient */}
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5 relative"
                    style={{
                      background: 'linear-gradient(135deg, rgba(124,58,237,0.3), rgba(109,40,217,0.1))',
                      border: '1px solid rgba(139,92,246,0.3)',
                    }}
                  >
                    {icon}
                  </div>

                  <h3 className="font-bold text-lg text-white mb-3" style={{ letterSpacing: '-0.01em' }}>
                    {title}
                  </h3>
                  <p className="text-sm leading-relaxed" style={{ color: 'rgba(196,181,253,0.6)' }}>
                    {desc}
                  </p>
                </TiltCard>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA intermédiaire après "Comment ça marche" */}
      <div className="text-center py-10 px-6" style={{ background: 'rgba(12,4,26,1)' }}>
        <p className="text-purple-300/60 text-sm mb-4">Tu vois ? C'est aussi simple que ça.</p>
        <a href="/signup" className="btn-shimmer inline-flex items-center gap-2 px-8 py-4 rounded-2xl font-bold text-white text-base"
          style={{ background: 'linear-gradient(135deg, #7c3aed, #6d28d9)', boxShadow: '0 8px 30px rgba(124,58,237,0.4)' }}>
          Tester gratuitement — c'est sans engagement
          <ArrowRight className="w-4 h-4" />
        </a>
      </div>

      {/* ── WAVE ─────────────────────────────────────────────────────────── */}
      <div className="wave-separator" style={{ background: 'rgba(12,4,26,1)', marginBottom: '-2px' }}>
        <svg viewBox="0 0 1440 80" preserveAspectRatio="none" style={{ height: '80px' }}>
          <path
            d="M0,0 C480,80 960,80 1440,0 L1440,80 L0,80 Z"
            fill="rgba(10,3,22,1)"
          />
        </svg>
      </div>

      {/* ── SHOWCASE PAGES GÉNÉRÉES ──────────────────────────────────────── */}
      <section className="py-28 px-6" style={{ background: 'rgba(12,4,26,1)' }}>
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-16 reveal">
            <p className="text-sm font-bold tracking-widest uppercase mb-3" style={{ color: '#a78bfa' }}>
              ✦ Nos pages générées
            </p>
            <h2 className="text-4xl md:text-5xl font-black" style={{
              background: 'linear-gradient(135deg, #ffffff 0%, #e9d5ff 100%)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
              letterSpacing: '-0.02em', maxWidth: '600px'
            }}>
              Des landing pages qui convertissent vraiment
            </h2>
          </div>

          {/* 2 mockups côte à côte */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16 reveal">
            {/* Mockup 1 */}
            <div className="rounded-3xl overflow-hidden shadow-2xl" style={{ border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.03)' }}>
              {/* Browser bar */}
              <div className="px-4 py-2.5 flex items-center gap-2" style={{ background: 'rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                <div className="flex gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-red-400/60"/><div className="w-2.5 h-2.5 rounded-full bg-yellow-400/60"/><div className="w-2.5 h-2.5 rounded-full bg-green-400/60"/></div>
                <div className="flex-1 mx-3 py-1 px-3 rounded-md text-xs font-mono text-center" style={{ background: 'rgba(0,0,0,0.3)', color: 'rgba(167,139,250,0.7)' }}>store.myshopify.com/products/smartwatch-pro</div>
              </div>
              {/* Page preview simulée */}
              <div style={{ aspectRatio: '4/3', background: 'linear-gradient(135deg, #1a0533 0%, #0d0d1a 100%)', position: 'relative', overflow: 'hidden' }}>
                <img src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800&h=600&fit=crop&q=80" alt="Landing page produit" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.9 }} />
                {/* Overlay avec éléments UI simulés */}
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '16px', background: 'linear-gradient(to top, rgba(10,3,22,0.95), transparent)' }}>
                  <div className="flex items-center justify-between">
                    <div>
                      <div style={{ color: 'rgba(167,139,250,0.8)', fontSize: '10px', fontFamily: 'monospace' }}>SmartWatch Pro X</div>
                      <div style={{ color: 'white', fontSize: '20px', fontWeight: 900 }}>129,99€ <span style={{ fontSize: '13px', color: '#4ade80' }}>↑ 3.8% CTR</span></div>
                    </div>
                    <div style={{ background: 'linear-gradient(135deg, #7c3aed, #6d28d9)', borderRadius: '10px', padding: '8px 16px', fontSize: '11px', fontWeight: 700, color: 'white' }}>
                      Publié sur Shopify ✓
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Mockup 2 */}
            <div className="rounded-3xl overflow-hidden shadow-2xl" style={{ border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.03)' }}>
              <div className="px-4 py-2.5 flex items-center gap-2" style={{ background: 'rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                <div className="flex gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-red-400/60"/><div className="w-2.5 h-2.5 rounded-full bg-yellow-400/60"/><div className="w-2.5 h-2.5 rounded-full bg-green-400/60"/></div>
                <div className="flex-1 mx-3 py-1 px-3 rounded-md text-xs font-mono text-center" style={{ background: 'rgba(0,0,0,0.3)', color: 'rgba(167,139,250,0.7)' }}>mystore.com/products/wireless-earbuds</div>
              </div>
              <div style={{ aspectRatio: '4/3', background: 'linear-gradient(135deg, #0a1628 0%, #0d0d1a 100%)', position: 'relative', overflow: 'hidden' }}>
                <img src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop&q=80" alt="Dashboard analytics" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.9 }} />
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '16px', background: 'linear-gradient(to top, rgba(10,3,22,0.95), transparent)' }}>
                  <div className="flex items-center justify-between">
                    <div>
                      <div style={{ color: 'rgba(167,139,250,0.8)', fontSize: '10px', fontFamily: 'monospace' }}>Wireless Earbuds X3</div>
                      <div style={{ color: 'white', fontSize: '20px', fontWeight: 900 }}>89,99€ <span style={{ fontSize: '13px', color: '#4ade80' }}>↑ +42% conv.</span></div>
                    </div>
                    <div style={{ background: 'linear-gradient(135deg, #059669, #047857)', borderRadius: '10px', padding: '8px 16px', fontSize: '11px', fontWeight: 700, color: 'white' }}>
                      WooCommerce ✓
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Logos bar */}
          <div className="reveal">
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '40px' }}>
              <p className="text-center text-xs font-semibold tracking-widest uppercase mb-8" style={{ color: 'rgba(139,92,246,0.4)' }}>
                Trusted by teams at
              </p>
              <div className="flex flex-wrap items-center justify-center gap-10 md:gap-16">
                {[
                  { name: 'Meta', style: { color: 'rgba(255,255,255,0.5)', fontSize: '18px', fontWeight: 700, fontFamily: 'system-ui' } },
                  { name: 'Shopify', style: { color: 'rgba(255,255,255,0.5)', fontSize: '18px', fontWeight: 700 } },
                  { name: 'Amazon', style: { color: 'rgba(255,255,255,0.5)', fontSize: '18px', fontWeight: 700 } },
                  { name: 'TikTok', style: { color: 'rgba(255,255,255,0.5)', fontSize: '18px', fontWeight: 700 } },
                  { name: 'Google', style: { color: 'rgba(255,255,255,0.5)', fontSize: '18px', fontWeight: 700 } },
                ].map(({ name, style }) => (
                  <span key={name} className="opacity-50 hover:opacity-80 transition-opacity duration-300 cursor-default select-none" style={style}>{name}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURES ─────────────────────────────────────────────────────── */}
      <section
        className="py-28 px-6 relative overflow-hidden"
        style={{ background: 'rgba(10,3,22,1)' }}
      >
        {/* Orbe décoratif */}
        <div
          className="absolute top-1/2 right-0 -translate-y-1/2 pointer-events-none"
          style={{
            width: '500px',
            height: '500px',
            background: 'radial-gradient(circle, rgba(124,58,237,0.12) 0%, transparent 70%)',
            filter: 'blur(40px)',
          }}
        />

        <div className="max-w-5xl mx-auto relative z-10">
          <div className="text-center mb-20 reveal">
            <h2
              className="text-4xl md:text-5xl font-black"
              style={{
                background: 'linear-gradient(135deg, #ffffff 0%, #e9d5ff 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                letterSpacing: '-0.02em',
              }}
            >
              Tout ce dont tu as besoin
            </h2>
            <p className="mt-4 text-base" style={{ color: 'rgba(196,181,253,0.6)' }}>
              Une suite complète pour le e-commerce haute performance
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              {
                icon: <Zap className="w-5 h-5 text-purple-300" />,
                title: 'Génération IA en 30s',
                desc: 'Copy de vente professionnel généré par Claude (Anthropic)',
                delay: '',
              },
              {
                icon: <MousePointerClick className="w-5 h-5 text-purple-300" />,
                title: 'Builder drag & drop',
                desc: 'Édite chaque élément visuellement sans toucher au code',
                delay: 'reveal-delay-1',
              },
              {
                icon: <Store className="w-5 h-5 text-purple-300" />,
                title: 'Shopify & WooCommerce',
                desc: "Publie en 1 clic sur ta boutique, la page est live instantanément",
                delay: 'reveal-delay-2',
              },
              {
                icon: <BarChart2 className="w-5 h-5 text-purple-300" />,
                title: 'Analytics intégrés',
                desc: "Vues, clics CTA, scroll depth — tout ce qu'il faut pour optimiser",
                delay: 'reveal-delay-3',
              },
              {
                icon: <Users className="w-5 h-5 text-purple-300" />,
                title: 'Mode Agence',
                desc: 'Workspaces clients, white-label et rapports PDF pour tes clients',
                delay: 'reveal-delay-4',
              },
              {
                icon: <Layers className="w-5 h-5 text-purple-300" />,
                title: '5 templates premium',
                desc: 'Minimal Dark, Clean White, Bold Sales, Luxury, Mobile First',
                delay: 'reveal-delay-5',
              },
            ].map(({ icon, title, desc, delay }) => (
              <TiltCard
                key={title}
                className={`reveal ${delay} glass-card rounded-2xl p-6`}
                style={{ border: '1px solid rgba(139,92,246,0.1)' }}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                  style={{
                    background: 'linear-gradient(135deg, rgba(124,58,237,0.3), rgba(109,40,217,0.1))',
                    border: '1px solid rgba(139,92,246,0.3)',
                  }}
                >
                  {icon}
                </div>
                <div className="font-bold text-white mb-1.5" style={{ letterSpacing: '-0.01em' }}>
                  {title}
                </div>
                <div className="text-sm leading-relaxed" style={{ color: 'rgba(196,181,253,0.55)' }}>
                  {desc}
                </div>
              </TiltCard>
            ))}
          </div>
        </div>
      </section>

      {/* ── GLOBE STATS ──────────────────────────────────────────────────────── */}
      <section className="py-32 px-6 relative overflow-hidden" style={{ background: 'rgba(8,2,18,1)' }}>
        {/* Glow central */}
        <div className="absolute inset-0 pointer-events-none" style={{
          background: 'radial-gradient(ellipse 60% 60% at 50% 50%, rgba(124,58,237,0.18) 0%, transparent 70%)'
        }} />

        <div className="max-w-5xl mx-auto relative z-10">
          {/* Stats top */}
          <div className="grid grid-cols-2 gap-8 mb-16 reveal">
            <div>
              <p className="text-sm mb-2" style={{ color: 'rgba(167,139,250,0.6)' }}>Pages générées</p>
              <div className="text-6xl md:text-8xl font-black" style={{ color: 'white', letterSpacing: '-0.04em', lineHeight: 1 }}>
                50K<span className="text-purple-400">+</span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm mb-2" style={{ color: 'rgba(167,139,250,0.6)' }}>Taux de conversion moyen</p>
              <div className="text-6xl md:text-8xl font-black" style={{ color: 'white', letterSpacing: '-0.04em', lineHeight: 1 }}>
                +<span className="text-purple-400">40</span><span style={{ fontSize: '0.5em', verticalAlign: 'top', marginTop: '0.3em', display: 'inline-block' }}>%</span>
              </div>
            </div>
          </div>

          {/* Globe CSS */}
          <div className="flex justify-center items-center reveal" style={{ height: '400px', position: 'relative' }}>
            {/* Globe principal */}
            <div style={{
              width: '320px', height: '320px', borderRadius: '50%',
              background: 'radial-gradient(circle at 35% 35%, rgba(167,139,250,0.3) 0%, rgba(124,58,237,0.6) 40%, rgba(60,20,120,0.8) 70%, rgba(5,2,15,1) 100%)',
              boxShadow: '0 0 80px rgba(124,58,237,0.4), inset 0 0 60px rgba(0,0,0,0.5)',
              position: 'relative',
              animation: 'globeRotate 20s linear infinite',
            }}>
              {/* Continents simulés via radial gradients */}
              <div style={{
                position: 'absolute', inset: 0, borderRadius: '50%',
                background: `
                  radial-gradient(ellipse 30% 20% at 35% 40%, rgba(167,139,250,0.5) 0%, transparent 100%),
                  radial-gradient(ellipse 25% 30% at 65% 35%, rgba(139,92,246,0.4) 0%, transparent 100%),
                  radial-gradient(ellipse 20% 15% at 50% 65%, rgba(167,139,250,0.3) 0%, transparent 100%)
                `
              }} />
            </div>

            {/* Arc orbital 1 */}
            <div style={{
              position: 'absolute', width: '420px', height: '420px',
              border: '1px solid rgba(167,139,250,0.15)',
              borderRadius: '50%', transform: 'rotateX(70deg) rotateZ(20deg)',
              animation: 'globeOrbit1 8s linear infinite',
            }} />
            {/* Arc orbital 2 */}
            <div style={{
              position: 'absolute', width: '380px', height: '380px',
              border: '1px solid rgba(139,92,246,0.1)',
              borderRadius: '50%', transform: 'rotateX(60deg) rotateZ(-40deg)',
              animation: 'globeOrbit2 12s linear infinite',
            }} />
            {/* Points lumineux */}
            {[
              { top: '20%', left: '60%' }, { top: '45%', left: '30%' },
              { top: '60%', left: '70%' }, { top: '35%', left: '55%' },
              { top: '70%', left: '45%' }
            ].map((pos, i) => (
              <div key={i} style={{
                position: 'absolute', width: '4px', height: '4px',
                borderRadius: '50%', background: '#fbbf24',
                top: pos.top, left: pos.left,
                boxShadow: '0 0 6px #fbbf24',
                animation: `starTwinkle ${1.5 + i * 0.4}s ease-in-out infinite alternate`
              }} />
            ))}
          </div>

          {/* Stat bottom */}
          <div className="text-center mt-8 reveal">
            <p className="text-base" style={{ color: 'rgba(167,139,250,0.5)' }}>
              Des e-commerçants dans <span style={{ color: 'white', fontWeight: 700 }}>12 pays</span> utilisent KONVERT pour scaler leurs stores
            </p>
          </div>
        </div>
      </section>

      {/* ── SECTION IA INTERACTIVE ──────────────────────────────────────────── */}
      <section className="py-28 px-6 relative overflow-hidden" style={{ background: 'rgba(6,2,16,1)' }}>
        <canvas
          id="particles-canvas"
          className="absolute inset-0 w-full h-full pointer-events-none"
          style={{ opacity: 0.6 }}
        />

        <div className="max-w-4xl mx-auto relative z-10 text-center">
          <div className="reveal">
            <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full"
              style={{ background: 'rgba(124,58,237,0.15)', border: '1px solid rgba(139,92,246,0.3)' }}>
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              <span className="text-sm font-semibold text-purple-300">Powered by Claude · Anthropic</span>
            </div>

            <h2 className="text-4xl md:text-6xl font-black mb-6" style={{
              background: 'linear-gradient(135deg, #ffffff 0%, #c4b5fd 50%, #a78bfa 100%)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
              letterSpacing: '-0.03em', lineHeight: 1.1,
            }}>
              Propulsé par l&apos;IA<br />
              <span style={{
                background: 'linear-gradient(135deg, #a78bfa 0%, #7c3aed 100%)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
              }}>la plus avancée</span>
            </h2>

            <p className="text-lg mb-12 max-w-xl mx-auto" style={{ color: 'rgba(196,181,253,0.7)' }}>
              Claude d&apos;Anthropic rédige un copy de vente natif, persuasif et culturellement adapté — dans 8 langues.
            </p>

            {/* Comparaison IA */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
              {[
                {
                  label: 'Copy natif',
                  desc: "Pas de traduction automatique. L'IA pense directement dans la langue cible.",
                  icon: '🌍',
                  highlight: false,
                },
                {
                  label: '8 langues',
                  desc: 'FR, EN, ES, DE, IT, PT, AR, ZH — chaque marché avec son propre angle marketing.',
                  icon: '🗣',
                  highlight: true,
                },
                {
                  label: 'Ton adapté',
                  desc: 'Persuasif, premium, fun ou informatif — le copy s\'adapte à ton positionnement.',
                  icon: '🎯',
                  highlight: false,
                },
              ].map(({ label, desc, icon, highlight }) => (
                <div key={label}
                  className="glass-card rounded-2xl p-6 text-left"
                  style={{
                    border: highlight ? '1px solid rgba(139,92,246,0.5)' : '1px solid rgba(139,92,246,0.15)',
                    background: highlight ? 'rgba(124,58,237,0.12)' : 'rgba(255,255,255,0.03)',
                    boxShadow: highlight ? '0 0 30px rgba(124,58,237,0.2)' : 'none',
                  }}>
                  <div className="text-3xl mb-3">{icon}</div>
                  <div className="font-bold text-white mb-2">{label}</div>
                  <div className="text-sm" style={{ color: 'rgba(196,181,253,0.6)' }}>{desc}</div>
                </div>
              ))}
            </div>

            {/* Démo copy live */}
            <div className="rounded-2xl p-6 text-left max-w-2xl mx-auto"
              style={{ background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(139,92,246,0.2)' }}>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-2 h-2 rounded-full bg-green-400" style={{ animation: 'pulse 2s ease-in-out infinite' }} />
                <span className="text-xs font-mono text-purple-400">Claude génère votre copy...</span>
              </div>
              <div className="space-y-2">
                {[
                  { label: 'Titre', value: '🔥 La montre qui va changer ta routine sport', color: '#ffffff' },
                  { label: 'Accroche', value: 'Suivi GPS précis, 7j d\'autonomie, waterproof 50m. Enfin une montre à la hauteur.', color: 'rgba(196,181,253,0.8)' },
                  { label: 'CTA', value: '⚡ Commander maintenant — Livraison 48h', color: '#4ade80' },
                ].map(({ label, value, color }, i) => (
                  <div key={label} className="flex items-start gap-3" style={{ animation: `fadeInUp 0.5s ease forwards ${i * 0.2}s`, opacity: 0 }}>
                    <span className="text-xs font-mono px-2 py-0.5 rounded flex-shrink-0 mt-0.5"
                      style={{ background: 'rgba(124,58,237,0.3)', color: '#a78bfa' }}>{label}</span>
                    <span className="text-sm font-medium" style={{ color }}>{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── PRODUCT SHOWCASE ─────────────────────────────────────────────── */}
      <section
        className="py-28 px-6 relative overflow-hidden"
        style={{ background: 'rgba(6,2,16,1)' }}
      >
        {/* Orbe décoratif gauche */}
        <div
          className="absolute top-1/2 left-0 -translate-y-1/2 pointer-events-none"
          style={{
            width: '500px',
            height: '500px',
            background: 'radial-gradient(circle, rgba(124,58,237,0.1) 0%, transparent 70%)',
            filter: 'blur(50px)',
          }}
        />

        <div className="max-w-5xl mx-auto relative z-10">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            {/* Colonne gauche — texte */}
            <div className="reveal">
              <span
                className="text-xs font-bold tracking-widest uppercase mb-4 block"
                style={{ color: 'rgba(167,139,250,0.8)' }}
              >
                Pages produits
              </span>
              <h2
                className="font-black mb-6 leading-tight"
                style={{
                  fontSize: 'clamp(2rem, 4vw, 3rem)',
                  letterSpacing: '-0.02em',
                  background: 'linear-gradient(135deg, #ffffff 0%, #e9d5ff 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                Tes pages produits,<br />à un autre niveau
              </h2>
              <p className="text-base mb-8 leading-relaxed" style={{ color: 'rgba(196,181,253,0.65)' }}>
                Stop aux fiches produits basiques qui ne convertissent pas. KONVERT génère des pages
                haute performance en 30 secondes, avec le copy parfait pour ton audience.
              </p>
              <ul className="space-y-4">
                {[
                  { label: 'Conversion optimisée', desc: 'Structure de page testée sur des milliers de produits e-commerce' },
                  { label: 'Copy IA haute performance', desc: 'Claude rédige un argumentaire qui déclenche l\'achat' },
                  { label: 'Push 1-clic sur Shopify', desc: 'Ta page est live en quelques secondes, directement dans ton store' },
                ].map(({ label, desc }) => (
                  <li key={label} className="flex items-start gap-3">
                    <div
                      className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                      style={{ background: 'rgba(139,92,246,0.25)', border: '1px solid rgba(139,92,246,0.4)' }}
                    >
                      <Check className="w-3 h-3 text-purple-300" />
                    </div>
                    <div>
                      <div className="font-bold text-white text-sm">{label}</div>
                      <div className="text-xs mt-0.5" style={{ color: 'rgba(196,181,253,0.55)' }}>{desc}</div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Colonne droite — image produit avec cadre glow */}
            <div className="reveal reveal-delay-2 flex items-center justify-center">
              <div
                className="product-showcase-img relative"
                style={{
                  transform: 'rotate(-2deg)',
                  transition: 'transform 0.4s ease',
                  borderRadius: '16px',
                  border: '2px solid rgba(139,92,246,0.4)',
                  boxShadow: '0 0 40px rgba(124,58,237,0.3), 0 0 80px rgba(124,58,237,0.1), 0 30px 60px rgba(0,0,0,0.6)',
                  overflow: 'hidden',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.transform = 'rotate(0deg)'
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.transform = 'rotate(-2deg)'
                }}
              >
                <img
                  src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=960&h=720&fit=crop&q=80"
                  alt="Page produit e-commerce générée par Konvert"
                  style={{ display: 'block', width: '100%', maxWidth: '480px', height: 'auto' }}
                />
                {/* Badge "Généré par Konvert" */}
                <div
                  className="absolute top-3 right-3 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5"
                  style={{
                    background: 'linear-gradient(135deg, #7c3aed, #6d28d9)',
                    color: '#ffffff',
                    boxShadow: '0 4px 15px rgba(124,58,237,0.5)',
                  }}
                >
                  <Zap className="w-3 h-3" />
                  Généré en 28s
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── MOBILE PREVIEW ───────────────────────────────────────────────── */}
      <section
        className="py-24 px-6 relative overflow-hidden"
        style={{ background: 'rgba(10,3,22,1)' }}
      >
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
          style={{
            width: '600px',
            height: '400px',
            background: 'radial-gradient(ellipse, rgba(124,58,237,0.1) 0%, transparent 60%)',
            filter: 'blur(60px)',
          }}
        />

        <div className="max-w-5xl mx-auto relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Colonne gauche — mockup phone */}
            <div className="reveal flex items-center justify-center">
              <div
                style={{
                  borderRadius: '36px',
                  border: '8px solid rgba(139,92,246,0.3)',
                  boxShadow: '0 0 50px rgba(124,58,237,0.35), 0 0 100px rgba(124,58,237,0.12), 0 40px 80px rgba(0,0,0,0.7)',
                  overflow: 'hidden',
                  maxWidth: '260px',
                  width: '100%',
                  background: '#0d0d1a',
                }}
              >
                {/* Notch simulé */}
                <div
                  className="flex items-center justify-center py-2"
                  style={{ background: '#0a0418' }}
                >
                  <div
                    style={{
                      width: '80px',
                      height: '6px',
                      background: 'rgba(139,92,246,0.3)',
                      borderRadius: '3px',
                    }}
                  />
                </div>
                <img
                  src="https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&h=700&fit=crop&q=80"
                  alt="Page produit mobile Konvert"
                  style={{ display: 'block', width: '100%', height: 'auto' }}
                />
              </div>
            </div>

            {/* Colonne droite — texte */}
            <div className="reveal reveal-delay-2">
              <span
                className="text-xs font-bold tracking-widest uppercase mb-4 block"
                style={{ color: 'rgba(167,139,250,0.8)' }}
              >
                100% Mobile First
              </span>
              <h2
                className="font-black mb-6 leading-tight"
                style={{
                  fontSize: 'clamp(2rem, 4vw, 3rem)',
                  letterSpacing: '-0.02em',
                  background: 'linear-gradient(135deg, #ffffff 0%, #e9d5ff 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                Parfait sur mobile.<br />Dès la génération.
              </h2>
              <p className="text-base leading-relaxed mb-6" style={{ color: 'rgba(196,181,253,0.65)' }}>
                Plus de 70% des achats e-commerce se font sur mobile. Toutes les pages KONVERT sont
                optimisées mobile-first automatiquement — vitesse, lisibilité, CTA accessibles.
              </p>
              <div className="flex flex-wrap gap-3">
                {['Responsive auto', 'CTA sticky mobile', 'Images optimisées', 'Chargement rapide'].map((tag) => (
                  <span
                    key={tag}
                    className="text-xs font-semibold px-3 py-1.5 rounded-full"
                    style={{
                      background: 'rgba(124,58,237,0.15)',
                      border: '1px solid rgba(139,92,246,0.25)',
                      color: '#c4b5fd',
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ─────────────────────────────────────────────────── */}
      <section
        className="py-28 px-6 relative overflow-hidden"
        style={{ background: 'rgba(6,2,16,1)' }}
      >
        <div
          className="absolute inset-0 dot-pattern"
          style={{ opacity: 0.3 }}
        />

        <div className="max-w-5xl mx-auto relative z-10">
          <div className="text-center mb-10 reveal">
            <p className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: 'rgba(167,139,250,0.7)' }}>
              ✦ Témoignages vérifiés
            </p>
            <h2
              className="text-4xl md:text-5xl font-black"
              style={{
                background: 'linear-gradient(135deg, #ffffff 0%, #e9d5ff 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                letterSpacing: '-0.02em',
              }}
            >
              Ils ont testé. Voici leurs résultats.
            </h2>
          </div>

          {/* Barre de stats globale */}
          <div className="flex flex-wrap items-center justify-center gap-6 mb-12 reveal">
            {/* Note globale */}
            <div className="flex items-center gap-3 px-5 py-3 rounded-2xl" style={{ background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.2)' }}>
              <div>
                <div className="text-2xl font-black text-white">4.9</div>
                <div className="flex gap-0.5 mt-0.5">
                  {[1,2,3,4,5].map(i => (
                    <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
              </div>
              <div className="text-left">
                <div className="text-[11px] font-bold text-white/80">Note moyenne</div>
                <div className="text-[11px]" style={{ color: 'rgba(167,139,250,0.6)' }}>247 avis clients</div>
              </div>
            </div>
            {/* Badge vérifié */}
            <div className="flex items-center gap-2 px-4 py-3 rounded-2xl" style={{ background: 'rgba(22,163,74,0.1)', border: '1px solid rgba(22,163,74,0.25)' }}>
              <div className="w-7 h-7 rounded-full flex items-center justify-center" style={{ background: 'rgba(22,163,74,0.2)' }}>
                <Check className="w-3.5 h-3.5 text-green-400" />
              </div>
              <div>
                <div className="text-[11px] font-bold text-white/80">Avis vérifiés</div>
                <div className="text-[11px]" style={{ color: 'rgba(167,139,250,0.6)' }}>Utilisateurs actifs uniquement</div>
              </div>
            </div>
            {/* Taux satisfaction */}
            <div className="flex items-center gap-2 px-4 py-3 rounded-2xl" style={{ background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.2)' }}>
              <div className="text-2xl font-black" style={{ color: '#a78bfa' }}>97%</div>
              <div>
                <div className="text-[11px] font-bold text-white/80">Taux de satisfaction</div>
                <div className="text-[11px]" style={{ color: 'rgba(167,139,250,0.6)' }}>Recommanderaient KONVERT</div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {TESTIMONIALS.map((t) => (
              <div
                key={t.name}
                className="glass-card rounded-2xl p-6 flex flex-col gap-4"
                style={{ border: '1px solid rgba(139,92,246,0.15)' }}
              >
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="relative flex-shrink-0">
                      <img
                        src={t.avatar}
                        alt={t.name}
                        className="w-11 h-11 rounded-full object-cover"
                        style={{ border: '2px solid rgba(139,92,246,0.3)' }}
                      />
                      {t.verified && (
                        <div
                          className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center"
                          style={{ background: '#16a34a', border: '2px solid rgba(13,13,26,1)' }}
                        >
                          <Check className="w-2 h-2 text-white" />
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="font-bold text-white text-[13px]">{t.name}</div>
                      <div className="text-[11px]" style={{ color: 'rgba(167,139,250,0.6)' }}>{t.role}</div>
                    </div>
                  </div>
                  <span
                    className="text-[10px] font-bold px-2 py-1 rounded-lg flex-shrink-0"
                    style={{
                      background: t.platform === 'Shopify' ? 'rgba(150,191,72,0.15)' : t.platform === 'WooCommerce' ? 'rgba(124,58,237,0.15)' : 'rgba(255,255,255,0.08)',
                      color: t.platform === 'Shopify' ? '#96BF48' : t.platform === 'WooCommerce' ? '#a78bfa' : '#9ca3af',
                    }}
                  >
                    {t.platform}
                  </span>
                </div>

                {/* Étoiles */}
                <div className="flex items-center gap-1">
                  {Array.from({ length: t.stars }).map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>

                {/* Citation */}
                <p className="text-[13px] leading-relaxed flex-1" style={{ color: 'rgba(196,181,253,0.8)' }}>
                  &ldquo;{t.quote}&rdquo;
                </p>

                {/* Footer */}
                <div className="flex items-center justify-between pt-3" style={{ borderTop: '1px solid rgba(139,92,246,0.1)' }}>
                  <span
                    className="text-[12px] font-black px-3 py-1 rounded-lg"
                    style={{ background: 'rgba(124,58,237,0.2)', color: '#a78bfa' }}
                  >
                    {t.metric}
                  </span>
                  <span className="text-[11px]" style={{ color: 'rgba(167,139,250,0.4)' }}>{t.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── AVANT / APRÈS ─────────────────────────────────────────────────── */}
      <section className="py-28 px-6 relative overflow-hidden" style={{ background: 'rgba(8,4,20,1)' }}>
        <div className="absolute inset-0 grid-pattern opacity-30 pointer-events-none" />

        <div className="max-w-5xl mx-auto relative z-10">
          {/* Header */}
          <div className="text-center mb-16 reveal">
            <p className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: 'rgba(167,139,250,0.7)' }}>
              ✦ La différence en un coup d&apos;œil
            </p>
            <h2 className="text-4xl md:text-5xl font-black" style={{
              background: 'linear-gradient(135deg, #ffffff 0%, #e9d5ff 100%)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
              letterSpacing: '-0.02em',
            }}>
              Avant KONVERT. Après KONVERT.
            </h2>
            <p className="mt-4 text-base max-w-xl mx-auto" style={{ color: 'rgba(196,181,253,0.6)' }}>
              Stop aux fiches produits qui ne convertissent pas. Voici ce que KONVERT change vraiment.
            </p>
          </div>

          {/* Comparaison */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 reveal">

            {/* AVANT */}
            <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid rgba(239,68,68,0.3)' }}>
              {/* Label */}
              <div className="px-5 py-3 flex items-center gap-2" style={{ background: 'rgba(239,68,68,0.1)', borderBottom: '1px solid rgba(239,68,68,0.2)' }}>
                <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: '#ef4444' }}>
                  <X className="w-3 h-3 text-white" />
                </div>
                <span className="text-sm font-bold" style={{ color: '#ef4444' }}>Fiche produit basique</span>
              </div>

              {/* Contenu simulé "fiche AliExpress" */}
              <div className="p-5" style={{ background: 'rgba(20,8,30,1)' }}>
                {/* Titre moche */}
                <div className="text-xs font-mono mb-3 leading-relaxed" style={{ color: 'rgba(255,255,255,0.4)', wordBreak: 'break-all' }}>
                  New 2024 Smart Watch Waterproof Sport Fitness Tracker Bluetooth Heart Rate Monitor For Men Women Android iOS Compatible Free Shipping
                </div>
                {/* Image produit AliExpress style */}
                <div className="w-full rounded-lg mb-3 relative overflow-hidden" style={{ height: '140px', background: '#f0f0f0' }}>
                  <img
                    src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=280&fit=crop"
                    alt="Produit basique"
                    className="w-full h-full object-cover"
                    style={{ filter: 'saturate(0.4) contrast(0.8) brightness(1.1)', opacity: 0.7 }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center" style={{ background: 'rgba(240,240,240,0.3)' }}>
                    <span className="text-[10px] font-mono px-2 py-1 rounded" style={{ background: 'rgba(255,100,0,0.15)', color: '#cc4400', border: '1px solid rgba(255,100,0,0.3)' }}>3 images disponibles</span>
                  </div>
                </div>
                {/* Prix bizarre */}
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-lg font-bold" style={{ color: '#ef4444' }}>$12.47</span>
                  <span className="text-xs line-through" style={{ color: 'rgba(255,255,255,0.2)' }}>$24.99</span>
                  <span className="text-xs px-1.5 py-0.5 rounded" style={{ background: 'rgba(239,68,68,0.2)', color: '#ef4444' }}>-50%</span>
                </div>
                {/* Texte copié/collé */}
                <div className="space-y-1 mb-4">
                  {['Feature 1: Waterproof IP67', 'Feature 2: 7 days battery life', 'Feature 3: Heart rate monitor', 'Color: Black/Silver/Gold'].map(f => (
                    <div key={f} className="text-[11px] font-mono" style={{ color: 'rgba(255,255,255,0.25)' }}>• {f}</div>
                  ))}
                </div>
                {/* Bouton cheap */}
                <div className="w-full py-2.5 rounded text-center text-xs font-bold" style={{ background: '#e67e22', color: '#fff' }}>
                  Add to Cart
                </div>
                {/* Stats catastrophiques */}
                <div className="mt-4 pt-3 grid grid-cols-3 gap-2 text-center" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                  {[['0.8%', 'CTR'], ['12s', 'Temps'], ['94%', 'Bounce']].map(([val, lbl]) => (
                    <div key={lbl}>
                      <div className="text-sm font-bold" style={{ color: '#ef4444' }}>{val}</div>
                      <div className="text-[10px]" style={{ color: 'rgba(255,255,255,0.3)' }}>{lbl}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* APRÈS */}
            <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid rgba(124,58,237,0.4)', boxShadow: '0 0 30px rgba(124,58,237,0.15)' }}>
              {/* Label */}
              <div className="px-5 py-3 flex items-center gap-2" style={{ background: 'rgba(124,58,237,0.15)', borderBottom: '1px solid rgba(124,58,237,0.2)' }}>
                <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: '#7c3aed' }}>
                  <Check className="w-3 h-3 text-white" />
                </div>
                <span className="text-sm font-bold" style={{ color: '#a78bfa' }}>Page générée par KONVERT</span>
                <span className="ml-auto text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: 'rgba(74,222,128,0.15)', color: '#4ade80' }}>⚡ 28s</span>
              </div>

              {/* Contenu simulé "page KONVERT" */}
              <div className="p-5" style={{ background: 'rgba(14,6,28,1)' }}>
                {/* Titre accrocheur */}
                <div className="font-black text-base mb-3 leading-tight" style={{ color: '#ffffff' }}>
                  La montre connectée qui transforme ta routine sport — GPS, santé &amp; style en 1 seul appareil
                </div>
                {/* Image avec overlay premium */}
                <div className="w-full rounded-xl mb-3 relative overflow-hidden" style={{ height: '140px' }}>
                  <img
                    src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=280&fit=crop"
                    alt="Produit KONVERT"
                    className="w-full h-full object-cover"
                    style={{ filter: 'saturate(1.2) contrast(1.05)', transform: 'scale(1.05)' }}
                  />
                  <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(14,6,28,0.8) 0%, transparent 50%)' }} />
                  <div className="absolute bottom-0 left-0 right-0 px-3 py-1.5 flex items-center justify-between">
                    <span className="text-[10px] font-bold" style={{ color: '#4ade80' }}>✓ En stock — Livraison 24h</span>
                    <span className="text-[10px]" style={{ color: 'rgba(255,255,255,0.7)' }}>247 avis ★★★★★</span>
                  </div>
                </div>
                {/* Prix premium */}
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xl font-black" style={{ color: '#4ade80' }}>49,99€</span>
                  <span className="text-sm line-through" style={{ color: 'rgba(255,255,255,0.3)' }}>89,99€</span>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-lg" style={{ background: 'rgba(239,68,68,0.2)', color: '#fca5a5' }}>-44%</span>
                </div>
                {/* Bénéfices IA */}
                <div className="space-y-1 mb-4">
                  {['⚡ Suivi GPS ultra-précis pour tes sessions', '🔋 7 jours d\'autonomie — recharge oubliée', '❤️ Santé 24/7 : cardio, SpO2, sommeil', '💧 Waterproof 50m — piscine inclus'].map(b => (
                    <div key={b} className="text-[12px]" style={{ color: 'rgba(196,181,253,0.8)' }}>{b}</div>
                  ))}
                </div>
                {/* CTA premium */}
                <div className="w-full py-3 rounded-xl text-center text-sm font-bold" style={{ background: 'linear-gradient(135deg, #7c3aed, #6d28d9)', color: '#fff', boxShadow: '0 4px 15px rgba(124,58,237,0.4)' }}>
                  Commander maintenant →
                </div>
                {/* Stats top */}
                <div className="mt-4 pt-3 grid grid-cols-3 gap-2 text-center" style={{ borderTop: '1px solid rgba(139,92,246,0.1)' }}>
                  {[['4.8%', 'CTR'], ['3m 20s', 'Temps'], ['18%', 'Bounce']].map(([val, lbl]) => (
                    <div key={lbl}>
                      <div className="text-sm font-bold" style={{ color: '#4ade80' }}>{val}</div>
                      <div className="text-[10px]" style={{ color: 'rgba(167,139,250,0.5)' }}>{lbl}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Flèche VS centrale */}
          <div className="hidden md:flex absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 flex-col items-center gap-1"
            style={{ marginTop: '60px' }}>
            <div className="w-14 h-14 rounded-full flex items-center justify-center font-black text-white text-sm"
              style={{ background: 'linear-gradient(135deg, #7c3aed, #6d28d9)', boxShadow: '0 0 30px rgba(124,58,237,0.6)', border: '3px solid rgba(139,92,246,0.3)' }}>
              VS
            </div>
          </div>

          {/* Barre comparaison métriques */}
          <div className="mt-8 rounded-2xl overflow-hidden reveal" style={{ border: '1px solid rgba(139,92,246,0.2)' }}>
            <div className="px-5 py-3 text-center text-xs font-bold tracking-widest uppercase" style={{ background: 'rgba(124,58,237,0.1)', color: 'rgba(167,139,250,0.7)', borderBottom: '1px solid rgba(139,92,246,0.15)' }}>
              Impact réel mesuré sur 1 000+ pages
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4" style={{ background: 'rgba(14,6,28,0.8)' }}>
              {[
                { label: 'CTR moyen', before: '0.8%', after: '4.8%', delta: '+500%', positive: true },
                { label: 'Temps sur page', before: '18s', after: '3m 20s', delta: '+10x', positive: true },
                { label: 'Taux de rebond', before: '94%', after: '18%', delta: '-76%', positive: true },
                { label: 'Taux de conversion', before: '0.4%', after: '3.2%', delta: '+700%', positive: true },
              ].map((m, i) => (
                <div key={m.label} className="px-4 py-5 text-center" style={{ borderRight: i < 3 ? '1px solid rgba(139,92,246,0.1)' : 'none' }}>
                  <div className="text-[10px] font-bold uppercase tracking-wider mb-3" style={{ color: 'rgba(167,139,250,0.5)' }}>{m.label}</div>
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <span className="text-sm font-bold line-through" style={{ color: 'rgba(239,68,68,0.6)' }}>{m.before}</span>
                    <ArrowRight className="w-3 h-3" style={{ color: 'rgba(139,92,246,0.5)' }} />
                    <span className="text-sm font-black text-white">{m.after}</span>
                  </div>
                  <div className="text-xs font-black px-2 py-0.5 rounded-lg inline-block" style={{ background: 'rgba(74,222,128,0.15)', color: '#4ade80' }}>{m.delta}</div>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="text-center mt-12 reveal">
            <Link href="/signup"
              className="btn-shimmer inline-flex items-center gap-2 px-8 py-4 rounded-2xl font-bold text-white text-base"
              style={{ background: 'linear-gradient(135deg, #7c3aed, #6d28d9)', boxShadow: '0 8px 30px rgba(124,58,237,0.4)' }}>
              Créer ma première page →
            </Link>
            <p className="mt-3 text-xs" style={{ color: 'rgba(167,139,250,0.45)' }}>✓ Gratuit · ✓ Sans carte bancaire · ✓ Résultat en 30 secondes</p>
          </div>
        </div>
      </section>

      {/* ── ROI CALCULATEUR ──────────────────────────────────────────────── */}
      <ROISection />

      {/* ── PRICING ──────────────────────────────────────────────────────── */}
      <section
        id="pricing"
        className="py-28 px-6 relative overflow-hidden"
        style={{ background: 'rgba(10,3,22,1)' }}
      >
        {/* Orbe central */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 pointer-events-none"
          style={{
            width: '800px',
            height: '400px',
            background: 'radial-gradient(ellipse, rgba(124,58,237,0.12) 0%, transparent 60%)',
            filter: 'blur(60px)',
          }}
        />

        <div className="max-w-5xl mx-auto relative z-10">
          <div className="text-center mb-20 reveal">
            <h2
              className="text-4xl md:text-5xl font-black"
              style={{
                background: 'linear-gradient(135deg, #ffffff 0%, #e9d5ff 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                letterSpacing: '-0.02em',
              }}
            >
              Tarifs simples. Aucune surprise.
            </h2>
            <p className="mt-4 text-base" style={{ color: 'rgba(196,181,253,0.6)' }}>
              Annule à tout moment. Sans engagement.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 items-center">
            {[
              {
                name: 'Starter',
                price: 29,
                popular: false,
                features: [
                  '50 pages / mois',
                  '2 stores connectés',
                  '5 templates',
                  'Export HTML',
                  'Support email',
                ],
              },
              {
                name: 'Pro',
                price: 49,
                popular: true,
                features: [
                  '200 pages / mois',
                  '5 stores connectés',
                  'Tous les templates',
                  'Analytics avancés',
                  'Support prioritaire',
                ],
              },
              {
                name: 'Agency',
                price: 119,
                popular: false,
                features: [
                  '500 pages / mois',
                  '15 stores connectés',
                  'Mode Agence complet',
                  'White-label',
                  'Rapports PDF clients',
                  'Support dédié',
                ],
              },
            ].map(({ name, price, popular, features }, i) => (
              <div
                key={name}
                className={`reveal ${i === 1 ? '' : i === 0 ? 'reveal-delay-1' : 'reveal-delay-3'} relative rounded-3xl p-7 transition-all duration-300`}
                style={
                  popular
                    ? {
                        background: 'linear-gradient(135deg, rgba(124,58,237,0.25) 0%, rgba(109,40,217,0.15) 100%)',
                        border: '1px solid rgba(139,92,246,0.5)',
                        transform: 'scale(1.05)',
                        boxShadow:
                          '0 0 0 1px rgba(139,92,246,0.4), 0 0 40px rgba(124,58,237,0.25), 0 30px 60px rgba(0,0,0,0.5)',
                      }
                    : {
                        background: 'rgba(255,255,255,0.03)',
                        border: '1px solid rgba(139,92,246,0.1)',
                      }
                }
              >
                {popular && (
                  <div
                    className="absolute -top-3.5 left-1/2 -translate-x-1/2 text-xs font-black px-4 py-1.5 rounded-full whitespace-nowrap"
                    style={{
                      background: 'linear-gradient(135deg, #7c3aed, #6d28d9)',
                      color: '#ffffff',
                      boxShadow: '0 4px 15px rgba(124,58,237,0.5)',
                    }}
                  >
                    Le plus populaire
                  </div>
                )}

                <div
                  className="font-black text-lg mb-1"
                  style={{ color: popular ? '#e9d5ff' : 'rgba(196,181,253,0.8)' }}
                >
                  {name}
                </div>

                <div className="flex items-end gap-1 mb-7">
                  <span
                    className="text-5xl font-black"
                    style={{
                      background: popular
                        ? 'linear-gradient(135deg, #ffffff, #c4b5fd)'
                        : 'linear-gradient(135deg, #ffffff, #e9d5ff)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                    }}
                  >
                    {price}€
                  </span>
                  <span
                    className="text-sm mb-1.5"
                    style={{ color: popular ? 'rgba(196,181,253,0.7)' : 'rgba(139,92,246,0.5)' }}
                  >
                    /mois
                  </span>
                </div>

                <ul className="space-y-3 mb-7">
                  {features.map((f) => (
                    <li key={f} className="flex items-center gap-2.5 text-sm">
                      <div
                        className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{
                          background: popular
                            ? 'rgba(139,92,246,0.3)'
                            : 'rgba(139,92,246,0.15)',
                        }}
                      >
                        <Check className="w-2.5 h-2.5 text-purple-300" />
                      </div>
                      <span style={{ color: popular ? 'rgba(233,213,255,0.85)' : 'rgba(196,181,253,0.6)' }}>
                        {f}
                      </span>
                    </li>
                  ))}
                </ul>

                <Link
                  href="/signup"
                  className="btn-shimmer block w-full text-center font-bold py-3.5 rounded-xl text-sm transition-all duration-200"
                  style={
                    popular
                      ? {
                          background: 'linear-gradient(135deg, #7c3aed, #6d28d9)',
                          color: '#ffffff',
                          boxShadow: '0 4px 20px rgba(124,58,237,0.4)',
                        }
                      : {
                          background: 'rgba(139,92,246,0.1)',
                          color: '#c4b5fd',
                          border: '1px solid rgba(139,92,246,0.2)',
                        }
                  }
                >
                  Commencer
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WAVE ─────────────────────────────────────────────────────────── */}
      <div className="wave-separator" style={{ background: 'rgba(10,3,22,1)', marginBottom: '-2px' }}>
        <svg viewBox="0 0 1440 60" preserveAspectRatio="none" style={{ height: '60px' }}>
          <path
            d="M0,60 C480,0 960,0 1440,60 L1440,0 L0,0 Z"
            fill="rgba(6,2,16,1)"
          />
        </svg>
      </div>

      {/* ── FAQ ───────────────────────────────────────────────────────────── */}
      <section
        id="faq"
        className="py-28 px-6 relative"
        style={{ background: 'rgba(6,2,16,1)' }}
      >
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16 reveal">
            <h2
              className="text-4xl md:text-5xl font-black"
              style={{
                background: 'linear-gradient(135deg, #ffffff 0%, #e9d5ff 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                letterSpacing: '-0.02em',
              }}
            >
              Questions fréquentes
            </h2>
          </div>

          <div className="space-y-3 reveal">
            {[
              {
                q: 'Ça fonctionne avec quel type de produits ?',
                a: "KONVERT fonctionne avec tous les produits e-commerce : mode, électronique, beauté, sport, maison... Tant que tu as une URL produit ou une description, l'IA peut générer une page.",
              },
              {
                q: 'Est-ce que le copy est en français ?',
                a: "Oui, KONVERT génère du contenu 100% en français. Le modèle est spécialisé pour le copywriting e-commerce francophone.",
              },
              {
                q: 'Puis-je modifier le contenu généré ?',
                a: "Absolument. Après génération, tu accèdes à un éditeur drag & drop complet pour modifier textes, couleurs, images et mise en page.",
              },
              {
                q: 'Comment fonctionne la connexion Shopify ?',
                a: "Via OAuth officiel Shopify. Tu cliques sur \"Connecter Shopify\", tu autorises l'accès, et KONVERT peut créer des pages dans ton store en 1 clic.",
              },
              {
                q: 'Puis-je annuler à tout moment ?',
                a: "Oui, sans engagement ni frais. Tu annules depuis ton dashboard en quelques clics. Tu gardes accès jusqu'à la fin de ta période facturée.",
              },
            ].map(({ q, a }) => (
              <FaqItem key={q} q={q} a={a} />
            ))}
          </div>
        </div>
      </section>

      {/* ── AGENCE SECTION ───────────────────────────────────────────────── */}
      <section
        className="py-28 px-6 relative overflow-hidden"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1600&h=900&fit=crop&q=80')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* Overlay sombre */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'rgba(13,13,26,0.88)' }}
        />
        {/* Nuance purple par-dessus */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse 70% 60% at 30% 50%, rgba(124,58,237,0.2) 0%, transparent 60%)',
          }}
        />

        <div className="max-w-5xl mx-auto relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Texte */}
            <div className="reveal">
              <span
                className="text-xs font-bold tracking-widest uppercase mb-4 block"
                style={{ color: 'rgba(167,139,250,0.8)' }}
              >
                Pour les agences
              </span>
              <h2
                className="font-black mb-6 leading-tight"
                style={{
                  fontSize: 'clamp(2rem, 4vw, 3rem)',
                  letterSpacing: '-0.02em',
                  background: 'linear-gradient(135deg, #ffffff 0%, #e9d5ff 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                Gère tous tes clients<br />depuis un seul endroit
              </h2>
              <p className="text-base leading-relaxed mb-8" style={{ color: 'rgba(196,181,253,0.65)' }}>
                Le mode Agence de KONVERT est conçu pour scaler. Workspaces séparés par client,
                rapports PDF white-label, et jusqu'à 15 stores connectés sur un seul compte.
              </p>
              <ul className="space-y-3 mb-8">
                {[
                  'Workspaces clients isolés',
                  'Rapports PDF white-label',
                  'Facturation client intégrée',
                  'Support dédié 7j/7',
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3">
                    <div
                      className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ background: 'rgba(139,92,246,0.25)', border: '1px solid rgba(139,92,246,0.4)' }}
                    >
                      <Check className="w-3 h-3 text-purple-300" />
                    </div>
                    <span className="text-sm font-medium text-white">{item}</span>
                  </li>
                ))}
              </ul>
              <Link
                href="/signup"
                className="btn-shimmer inline-flex items-center gap-2 font-bold px-6 py-3.5 rounded-xl text-sm transition-all duration-300"
                style={{
                  background: 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)',
                  color: '#ffffff',
                  boxShadow: '0 6px 25px rgba(124,58,237,0.45)',
                }}
              >
                Voir le plan Agency
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Stats agence */}
            <div className="reveal reveal-delay-2 grid grid-cols-2 gap-4">
              {[
                { value: '15', label: 'Stores connectés', sub: 'sur le plan Agency' },
                { value: '500', label: 'Pages / mois', sub: 'sans limite de clients' },
                { value: 'PDF', label: 'Rapports white-label', sub: 'à ton branding' },
                { value: '7j/7', label: 'Support dédié', sub: 'réponse en moins de 2h' },
              ].map(({ value, label, sub }) => (
                <div
                  key={label}
                  className="rounded-2xl p-5"
                  style={{
                    background: 'rgba(14,6,28,0.8)',
                    border: '1px solid rgba(139,92,246,0.2)',
                    backdropFilter: 'blur(10px)',
                  }}
                >
                  <div
                    className="text-3xl font-black mb-1"
                    style={{
                      background: 'linear-gradient(135deg, #a78bfa, #7c3aed)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                    }}
                  >
                    {value}
                  </div>
                  <div className="text-sm font-bold text-white">{label}</div>
                  <div className="text-xs mt-0.5" style={{ color: 'rgba(167,139,250,0.5)' }}>{sub}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA FINAL ────────────────────────────────────────────────────── */}
      <section
        className="py-32 px-6 relative overflow-hidden"
        style={{
          background:
            'radial-gradient(ellipse 80% 60% at 50% 50%, rgba(124,58,237,0.25) 0%, transparent 60%), rgba(10,3,22,1)',
        }}
      >
        {/* Étoiles */}
        {STARS.slice(0, 40).map((s) => (
          <div
            key={s.id}
            className="star"
            style={{
              top: s.top,
              left: s.left,
              width: `${s.size}px`,
              height: `${s.size}px`,
              ['--duration' as string]: s.duration,
              ['--delay' as string]: s.delay,
              opacity: 0.3,
            }}
          />
        ))}

        <div className="max-w-3xl mx-auto text-center relative z-10 reveal">
          <h2
            className="font-black tracking-tight mb-6"
            style={{
              fontSize: 'clamp(2.5rem, 6vw, 4rem)',
              letterSpacing: '-0.03em',
              color: '#ffffff',
            }}
          >
            Ta prochaine page qui convertit
            <br />
            <span
              style={{
                background: 'linear-gradient(135deg, #a78bfa 0%, #7c3aed 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              est à 30 secondes.
            </span>
          </h2>

          <p
            className="text-lg mb-12 leading-relaxed"
            style={{ color: 'rgba(196,181,253,0.65)' }}
          >
            Rejoins les e-commerçants qui génèrent des pages haute conversion
            sans designer ni copywriter.
          </p>

          <Link
            href="/signup"
            className="btn-shimmer inline-flex items-center gap-3 font-black px-12 py-5 rounded-2xl text-lg transition-all duration-300"
            style={{
              background: 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)',
              color: '#ffffff',
              boxShadow: '0 10px 40px rgba(124,58,237,0.5), 0 0 80px rgba(124,58,237,0.15)',
            }}
          >
            Commencer gratuitement
            <ArrowRight className="w-5 h-5" />
          </Link>

          <p className="text-sm mt-4" style={{ color: 'rgba(167,139,250,0.45)' }}>
            50 pages offertes · Aucune carte bancaire requise
          </p>
        </div>
      </section>

      {/* ── WAITLIST SECTION ─────────────────────────────────────────────── */}
      <section id="waitlist" className="py-28 px-6" style={{ background: 'rgba(6,2,16,1)' }}>
        <div className="max-w-xl mx-auto text-center">
          <div className="reveal">
            {/* Badge */}
            <div
              className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full"
              style={{ background: 'rgba(124,58,237,0.15)', border: '1px solid rgba(139,92,246,0.3)' }}
            >
              <div className="w-2 h-2 rounded-full bg-green-400" style={{ animation: 'pulse 2s ease-in-out infinite' }} />
              <span className="text-sm font-semibold text-purple-300">Bêta ouverte — Places limitées</span>
            </div>

            <h2
              className="text-4xl md:text-5xl font-black mb-4"
              style={{
                background: 'linear-gradient(135deg, #ffffff 0%, #c4b5fd 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                letterSpacing: '-0.02em',
              }}
            >
              Rejoins les premiers à tester KONVERT
            </h2>
            <p className="text-base mb-10" style={{ color: 'rgba(196,181,253,0.6)' }}>
              50 places disponibles en bêta fermée. Inscris-toi maintenant pour recevoir ton invitation en priorité.
            </p>

            {/* Compteur places */}
            <div className="flex items-center justify-center gap-6 mb-10">
              {[
                { val: '50', label: 'Places totales' },
                { val: '23', label: 'Déjà prises' },
                { val: '27', label: 'Restantes' },
              ].map(({ val, label }) => (
                <div key={label} className="text-center">
                  <div className="text-2xl font-black text-white">{val}</div>
                  <div className="text-[11px]" style={{ color: 'rgba(167,139,250,0.5)' }}>{label}</div>
                </div>
              ))}
            </div>

            {/* Barre de remplissage */}
            <div className="h-2 rounded-full overflow-hidden mb-10 mx-auto max-w-xs" style={{ background: 'rgba(255,255,255,0.08)' }}>
              <div
                className="h-full rounded-full"
                style={{ width: '46%', background: 'linear-gradient(90deg, #7c3aed, #a78bfa)' }}
              />
            </div>

            {/* Formulaire waitlist */}
            <WaitlistSection />
          </div>
        </div>
      </section>

      {/* ── FOOTER ──────────────────────────────────────────────────────────── */}
      <footer style={{ background: 'rgba(4,1,10,1)', borderTop: '1px solid rgba(139,92,246,0.15)' }}>
        {/* Top footer */}
        <div className="max-w-6xl mx-auto px-6 py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">

            {/* Brand */}
            <div className="md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <span className="font-black text-xl tracking-tight" style={{ letterSpacing: '-0.03em' }}>
                  <span style={{ color: '#ffffff' }}>KON</span>
                  <span style={{
                    background: 'linear-gradient(135deg, #a78bfa, #7c3aed)',
                    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                  }}>VERT</span>
                </span>
              </div>
              <p className="text-[13px] leading-relaxed mb-5" style={{ color: 'rgba(167,139,250,0.55)' }}>
                Génère des landing pages e-commerce haute conversion en 30 secondes grâce à l&apos;IA.
              </p>
              {/* Réseaux sociaux */}
              <div className="flex items-center gap-3">
                {[
                  { label: 'X', href: '#' },
                  { label: 'in', href: '#' },
                  { label: 'ig', href: '#' },
                ].map(({ label, href }) => (
                  <a key={label} href={href}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-[11px] font-black transition-all"
                    style={{ background: 'rgba(255,255,255,0.05)', color: 'rgba(167,139,250,0.6)', border: '1px solid rgba(139,92,246,0.15)' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(124,58,237,0.2)'; (e.currentTarget as HTMLElement).style.color = '#a78bfa' }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.05)'; (e.currentTarget as HTMLElement).style.color = 'rgba(167,139,250,0.6)' }}
                  >
                    {label}
                  </a>
                ))}
              </div>
            </div>

            {/* Produit */}
            <div>
              <h4 className="text-[12px] font-bold tracking-widest uppercase mb-4" style={{ color: 'rgba(167,139,250,0.5)' }}>Produit</h4>
              <ul className="space-y-2.5">
                {[
                  { label: 'Fonctionnalités', href: '#how' },
                  { label: 'Tarifs', href: '#pricing' },
                  { label: 'Templates', href: '/signup' },
                  { label: 'Changelog', href: '#' },
                  { label: 'Roadmap', href: '#' },
                ].map(({ label, href }) => (
                  <li key={label}>
                    <a href={href} className="text-[13px] transition-colors" style={{ color: 'rgba(196,181,253,0.5)' }}
                      onMouseEnter={e => ((e.target as HTMLElement).style.color = '#ffffff')}
                      onMouseLeave={e => ((e.target as HTMLElement).style.color = 'rgba(196,181,253,0.5)')}>
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Ressources */}
            <div>
              <h4 className="text-[12px] font-bold tracking-widest uppercase mb-4" style={{ color: 'rgba(167,139,250,0.5)' }}>Ressources</h4>
              <ul className="space-y-2.5">
                {[
                  { label: 'Documentation', href: '#' },
                  { label: 'Guide démarrage', href: '#' },
                  { label: 'Blog', href: '#' },
                  { label: 'Support', href: 'mailto:support@konvert.app' },
                  { label: 'Status', href: '#' },
                ].map(({ label, href }) => (
                  <li key={label}>
                    <a href={href} className="text-[13px] transition-colors" style={{ color: 'rgba(196,181,253,0.5)' }}
                      onMouseEnter={e => ((e.target as HTMLElement).style.color = '#ffffff')}
                      onMouseLeave={e => ((e.target as HTMLElement).style.color = 'rgba(196,181,253,0.5)')}>
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Légal */}
            <div>
              <h4 className="text-[12px] font-bold tracking-widest uppercase mb-4" style={{ color: 'rgba(167,139,250,0.5)' }}>Légal</h4>
              <ul className="space-y-2.5">
                {[
                  { label: 'Mentions légales', href: '/legal/mentions' },
                  { label: 'CGU', href: '/legal/cgu' },
                  { label: 'Politique de confidentialité', href: '/legal/privacy' },
                  { label: 'Politique cookies', href: '/legal/cookies' },
                  { label: 'RGPD', href: '/legal/rgpd' },
                ].map(({ label, href }) => (
                  <li key={label}>
                    <a href={href} className="text-[13px] transition-colors" style={{ color: 'rgba(196,181,253,0.5)' }}
                      onMouseEnter={e => ((e.target as HTMLElement).style.color = '#ffffff')}
                      onMouseLeave={e => ((e.target as HTMLElement).style.color = 'rgba(196,181,253,0.5)')}>
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom footer */}
        <div style={{ borderTop: '1px solid rgba(139,92,246,0.08)' }}>
          <div className="max-w-6xl mx-auto px-6 py-5 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-[12px]" style={{ color: 'rgba(167,139,250,0.35)' }}>
              © 2026 KONVERT — Tous droits réservés
            </p>
            <div className="flex items-center gap-4">
              {/* Badges tech */}
              <div className="flex items-center gap-2 text-[11px] font-semibold" style={{ color: 'rgba(167,139,250,0.4)' }}>
                <span>Propulsé par</span>
                <span className="px-2 py-0.5 rounded-md" style={{ background: 'rgba(124,58,237,0.15)', color: '#a78bfa' }}>Claude · Anthropic</span>
              </div>
              <div className="flex items-center gap-1.5 text-[11px]" style={{ color: 'rgba(167,139,250,0.35)' }}>
                <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
                Tous les services opérationnels
              </div>
            </div>
          </div>
        </div>
      </footer>
      {/* CTA Sticky Mobile */}
      <div
        className="md:hidden fixed bottom-0 left-0 right-0 z-50 p-4 transition-transform duration-300"
        style={{
          background: 'rgba(13,13,26,0.95)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderTop: '1px solid rgba(139,92,246,0.2)',
          transform: showStickyMobile ? 'translateY(0)' : 'translateY(100%)',
        }}
      >
        <Link
          href="/signup"
          className="btn-shimmer flex items-center justify-center gap-2 w-full py-4 rounded-2xl font-bold text-white text-base"
          style={{
            background: 'linear-gradient(135deg, #7c3aed, #6d28d9)',
            boxShadow: '0 4px 20px rgba(124,58,237,0.5)',
          }}
        >
          <Sparkles className="w-4 h-4" />
          Générer ma page — Gratuit
        </Link>
        <p className="text-center text-[11px] mt-2" style={{ color: 'rgba(167,139,250,0.4)' }}>
          ✓ Sans carte bancaire · ✓ 50 pages offertes
        </p>
      </div>
    </main>
  )
}
