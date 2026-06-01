'use client'

import { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'
import { ArrowRight, Check, Gift, Clock, Sparkles, Zap, Rocket } from 'lucide-react'
import { toast } from 'sonner'
import { track } from '@/lib/analytics'
import { launchEventSchema, jsonLd } from '@/lib/schema'
import { getLaunchDate } from '@/lib/launch'

// Page de pré-launch — countdown vers J-Day puis bascule "We're live!" une
// fois le launch passé. Date paramétrable via NEXT_PUBLIC_LAUNCH_DATE (ISO
// 8601). Source unique : @/lib/launch (alignée avec schema/index.ts).

function useCountdown(target: Date) {
  // Initialiser à null → le composant n'affiche rien avant l'hydratation
  // (évite que isLive = true au SSR car now = target au render initial).
  // La page est full client ('use client') donc pas de mismatch React #418.
  const [now, setNow] = useState<number | null>(null)
  useEffect(() => {
    setNow(Date.now())
    const id = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(id)
  }, [target])
  const diff = now === null ? 1 : Math.max(0, target.getTime() - now)
  const days = Math.floor(diff / 86400000)
  const hours = Math.floor((diff % 86400000) / 3600000)
  const mins = Math.floor((diff % 3600000) / 60000)
  const secs = Math.floor((diff % 60000) / 1000)
  // isLive uniquement si now est initialisé ET que la date est passée
  return { diff, days, hours, mins, secs, isLive: now !== null && diff <= 0 }
}

function CountdownCard({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <div
        className="rounded-2xl px-4 sm:px-6 py-4 sm:py-5 mb-2 min-w-[72px] sm:min-w-[100px] text-center"
        style={{
          background: 'linear-gradient(135deg, #5B47F5, #7c3aed)',
          boxShadow: '0 8px 24px rgba(91,71,245,0.35)',
        }}
      >
        <div className="text-3xl sm:text-5xl font-black text-white tabular-nums" style={{ letterSpacing: '-0.04em' }}>
          {String(value).padStart(2, '0')}
        </div>
      </div>
      <span className="text-xs uppercase tracking-widest text-gray-500 font-bold">{label}</span>
    </div>
  )
}

function LaunchDayContent() {
  const { days, hours, mins, secs, isLive } = useCountdown(getLaunchDate())
  const [email, setEmail] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)

  useEffect(() => {
    track.essaiStarted('launch-day')
  }, [])

  function copyCoupon() {
    navigator.clipboard?.writeText('LAUNCH50').then(() => {
      toast.success('Code LAUNCH50 copié !')
    }).catch(() => {
      toast.error('Code à copier manuellement : LAUNCH50')
    })
  }

  async function handleNotify(e: React.FormEvent) {
    e.preventDefault()
    if (!email.includes('@')) {
      toast.error('Email invalide')
      return
    }
    setSubmitting(true)
    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name: '', context: 'launch-day-notify' }),
      })
      const data = await res.json()
      if (!res.ok && data.message !== 'already_registered') throw new Error(data.error || 'fail')
      setDone(true)
      toast.success(data.message === 'already_registered' ? 'Tu es déjà sur la liste !' : 'On te ping le jour J 🚀')
    } catch {
      toast.error('Erreur, réessaie')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'radial-gradient(ellipse at top, #EDE9FE 0%, #F8F7FF 60%)' }}>
      {/* Schema.org SaleEvent — détecté par AI Overviews + Bing Copilot */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(launchEventSchema()) }}
      />

      {/* Hero countdown */}
      <section className="flex-1 flex items-center justify-center px-6 py-20">
        <div className="max-w-3xl mx-auto text-center">

          {/* Badge */}
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold mb-8 border"
            style={{ background: 'rgba(91,71,245,0.10)', borderColor: 'rgba(91,71,245,0.25)', color: '#5B47F5' }}
          >
            <Rocket className="w-3.5 h-3.5" />
            {isLive ? 'C\'EST LE GRAND JOUR' : 'COMPTE À REBOURS LAUNCH'}
          </div>

          <h1 className="text-4xl md:text-6xl font-black text-slate-900 mb-5 leading-tight" style={{ letterSpacing: '-0.03em' }}>
            {isLive ? (
              <>On est <span style={{ background: 'linear-gradient(135deg,#a78bfa,#7c3aed)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>LIVE</span></>
            ) : (
              <>KONVERT arrive <br /> <span style={{ background: 'linear-gradient(135deg,#a78bfa,#7c3aed)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>très bientôt</span></>
            )}
          </h1>
          <p className="text-lg max-w-xl mx-auto mb-10 leading-relaxed text-slate-600">
            {isLive
              ? 'Le launch officiel est en cours sur ProductHunt — viens nous soutenir et profite du code 50 % off.'
              : 'Tes produits méritent des pages qui vendent. Le launch officiel arrive — sois prévenu en avant-première.'}
          </p>

          {/* COUNTDOWN */}
          {!isLive && (
            <div className="flex justify-center gap-3 sm:gap-4 mb-10">
              <CountdownCard value={days} label="jours" />
              <CountdownCard value={hours} label="heures" />
              <CountdownCard value={mins} label="minutes" />
              <CountdownCard value={secs} label="secondes" />
            </div>
          )}

          {/* CTA principal — bascule selon isLive */}
          {isLive ? (
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-6">
              <Link
                href="/producthunt"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-sm text-white transition-all"
                style={{ background: 'linear-gradient(135deg, #5B47F5, #7c3aed)', boxShadow: '0 4px 20px rgba(91,71,245,0.4)' }}
              >
                Voir l&apos;offre ProductHunt 50 % <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/essai"
                className="focus-konvert inline-flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-sm border-2 transition-colors"
                style={{ borderColor: 'rgba(91,71,245,0.3)', color: '#5B47F5' }}
              >
                Essai gratuit <Sparkles className="w-4 h-4" />
              </Link>
            </div>
          ) : done ? (
            <div className="rounded-2xl p-6 max-w-md mx-auto" style={{ background: 'rgba(74,222,128,0.08)', border: '1px solid rgba(74,222,128,0.25)' }}>
              <div className="text-3xl mb-3">🎉</div>
              <p className="font-bold text-slate-900 mb-1">Tu es sur la liste prioritaire</p>
              <p className="text-sm text-slate-600">
                On t&apos;envoie un mail le jour J avec un coupon spécial early-supporters.
              </p>
            </div>
          ) : (
            <form onSubmit={handleNotify} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="ton@email.com"
                className="flex-1 rounded-xl px-5 py-4 text-sm outline-none transition-all"
                style={{ background: '#ffffff', border: '1px solid #ddd6fe', color: '#0f172a' }}
                onFocus={e => (e.target.style.borderColor = '#7c3aed')}
                onBlur={e => (e.target.style.borderColor = 'rgba(139,92,246,0.3)')}
                aria-label="Ton email pour être prévenu du launch"
              />
              <button
                type="submit"
                disabled={submitting}
                className="px-7 py-4 rounded-xl font-bold text-sm text-white transition-all flex items-center justify-center gap-2"
                style={{ background: submitting ? 'rgba(124,58,237,0.5)' : 'linear-gradient(135deg, #7c3aed, #6d28d9)', boxShadow: '0 4px 20px rgba(124,58,237,0.4)' }}
              >
                {submitting ? 'Inscription…' : <>Préviens-moi <ArrowRight className="w-4 h-4" /></>}
              </button>
            </form>
          )}

          {/* Coupon teaser pour les early visiteurs */}
          {!isLive && (
            <div className="mt-12 inline-flex items-center gap-3 px-5 py-3 rounded-2xl" style={{ background: 'rgba(91,71,245,0.08)', border: '1px solid rgba(91,71,245,0.2)' }}>
              <Gift className="w-4 h-4" style={{ color: '#5B47F5' }} />
              <span className="text-sm text-slate-600">
                Code launch <code className="font-black text-slate-900 bg-white px-2 rounded">LAUNCH50</code>
              </span>
              <button
                onClick={copyCoupon}
                className="text-xs font-bold px-3 py-1.5 rounded-lg transition-colors"
                style={{ background: 'rgba(91,71,245,0.12)', color: '#5B47F5' }}
                aria-label="Copier le code launch"
              >
                Copier
              </button>
            </div>
          )}

          <p className="mt-10 text-xs text-slate-400">
            <Clock className="inline w-3 h-3 mr-1" />
            Date launch : {getLaunchDate().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </div>
      </section>

      {/* Bandeau bas — preview features */}
      <section className="py-10 px-6 border-t border-slate-200">
        <div className="max-w-4xl mx-auto">
          <p className="text-xs uppercase tracking-widest text-center font-bold mb-6 text-[#5B47F5]">
            Ce qui arrive le jour J
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            {[
              { icon: Zap, label: 'Génération 30s' },
              { icon: Sparkles, label: '42+ templates' },
              { icon: Rocket, label: 'A/B testing' },
              { icon: Check, label: 'Shopify natif' },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex flex-col items-center gap-2">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(91,71,245,0.15)' }}>
                  <Icon className="w-5 h-5" style={{ color: '#5B47F5' }} />
                </div>
                <span className="text-xs font-semibold text-slate-600">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

export default function LaunchDayPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50" />}>
      <LaunchDayContent />
    </Suspense>
  )
}
