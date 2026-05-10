'use client'

import { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowRight, Check, Star, Sparkles, Zap, Loader2, Gift } from 'lucide-react'
import { toast } from 'sonner'
import { track } from '@/lib/analytics'
import { pixels } from '@/lib/tracking/pixels'
import { launchEventSchema, jsonLd } from '@/lib/schema'

// Landing dédiée trafic ProductHunt — exposée via le post PH du jour J et
// le QR code dans les communautés. Offre exclusive 50% off premier mois.
//
// Tracking : utm_source=producthunt forcé via cookie (le middleware capture
// déjà depuis les query params, mais ici on s'assure que les visiteurs qui
// arrivent direct via le lien PH ont l'attribution même sans utm_*).

const FEATURES = [
  'Génération en 30 secondes',
  '42+ templates haute conversion',
  'A/B testing intégré',
  'Connexion Shopify, WooCommerce, YouCan',
  'Copy IA optimisée 8 langues',
  'Mode white-label pour agences',
]

const PH_TESTIMONIALS = [
  {
    quote: 'Vu le post sur ProductHunt, testé en 5 min, ma 1ère page tourne sur Shopify ce soir. Sérieux.',
    author: 'Mathilde R.',
    role: 'Boutique cosmétiques · 2k€/mois',
  },
  {
    quote: '30 secondes pour une page que j\'aurais payé 400€ à un freelance. KONVERT change la donne.',
    author: 'Karim B.',
    role: 'Dropshipping fashion · 8k€/mois',
  },
  {
    quote: 'Le toggle annuel + 50% PH = j\'ai pris Pro pour 31€/mois la première année. No-brainer.',
    author: 'Tom L.',
    role: 'Agence SMMA · 5 clients',
  },
]

function PHContent() {
  const router = useRouter()
  const [copied, setCopied] = useState(false)
  const [email, setEmail] = useState('')
  const [submitting, setSubmitting] = useState(false)

  // Sur mount : on enregistre l'event PH visit pour PostHog + on s'assure que
  // utm_source=producthunt est dans le cookie même si pas de query param.
  useEffect(() => {
    track.essaiStarted('producthunt')
    pixels.viewContent({ content_name: 'producthunt_landing' })
    // Le middleware capture les UTM via query — pour les visiteurs qui arrivent
    // sans param (lien direct dans bio PH), on injecte ici en cookie.
    if (typeof document !== 'undefined') {
      const hasUtm = document.cookie.includes('_konvert_utm=')
      if (!hasUtm) {
        const data = {
          utm_source: 'producthunt',
          utm_medium: 'launch',
          utm_campaign: 'ph_launch_day',
          ts: Date.now(),
          landing: '/producthunt',
        }
        const encoded = encodeURIComponent(JSON.stringify(data))
        document.cookie = `_konvert_utm=${encoded}; path=/; max-age=${60 * 60 * 24 * 90}; SameSite=Lax`
      }
    }
  }, [])

  function copyCoupon() {
    navigator.clipboard?.writeText('LAUNCH50').then(() => {
      setCopied(true)
      toast.success('Code LAUNCH50 copié !')
      setTimeout(() => setCopied(false), 2500)
    }).catch(() => {
      toast.error('Impossible de copier — utilise le code LAUNCH50 manuellement')
    })
  }

  async function handleQuickStart(e: React.FormEvent) {
    e.preventDefault()
    if (!email.includes('@')) {
      toast.error('Email invalide')
      return
    }
    setSubmitting(true)
    track.essaiEmailCaptured()
    pixels.lead({ content_name: 'producthunt_quickstart', value: 1 })
    // Redirige sur /essai avec email pré-rempli + utm path
    router.push(`/essai?email=${encodeURIComponent(email)}&upgrade=ph`)
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Schema.org SaleEvent — donne du contexte aux AI Overviews / Bing
          Copilot quand quelqu'un cherche "ProductHunt launch [date]". */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(launchEventSchema()) }}
      />

      {/* HERO PH */}
      <section
        className="pt-24 pb-20 px-6 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #ff6154 0%, #ff8160 100%)' }}
      >
        <div className="max-w-4xl mx-auto text-center relative z-10">
          {/* Badge ProductHunt officiel */}
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-black mb-6 bg-white"
            style={{ color: '#da552f' }}
          >
            <span className="text-base">🎉</span>
            BIENVENUE PRODUCTHUNT
          </div>

          <h1 className="text-4xl md:text-6xl font-black text-white mb-5 leading-tight" style={{ letterSpacing: '-0.03em' }}>
            Une offre exclusive<br />
            pour la communauté PH
          </h1>
          <p className="text-white/90 text-xl mb-10 max-w-2xl mx-auto leading-relaxed">
            Profite de <span className="font-black">50 % de réduction</span> sur ton premier mois,
            tous plans confondus. Valable pour les <span className="font-black">100 premiers</span> signups depuis ProductHunt.
          </p>

          {/* Coupon copiable */}
          <div className="inline-block bg-white rounded-2xl p-2 mb-8" style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.15)' }}>
            <div className="flex items-center gap-3 px-4 py-3">
              <Gift className="w-5 h-5" style={{ color: '#da552f' }} />
              <code className="text-2xl font-black tracking-wider text-gray-900">LAUNCH50</code>
              <button
                onClick={copyCoupon}
                className="ml-2 px-4 py-2 rounded-xl text-sm font-bold text-white transition-all"
                style={{ background: copied ? '#10b981' : '#da552f' }}
                aria-label="Copier le code LAUNCH50"
              >
                {copied ? <span className="flex items-center gap-1.5"><Check className="w-4 h-4" /> Copié</span> : 'Copier'}
              </button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/pricing?coupon=LAUNCH50&utm_source=producthunt&utm_campaign=ph_launch_day"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-sm bg-white text-gray-900 hover:bg-gray-50 transition-colors"
              style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.15)' }}
            >
              Voir les plans avec 50 % off <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/essai?utm_source=producthunt&utm_campaign=ph_launch_day"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-sm border-2 border-white text-white hover:bg-white/10 transition-colors"
            >
              Essai gratuit (1 page) <Sparkles className="w-4 h-4" />
            </Link>
          </div>

          <p className="mt-6 text-xs text-white/70">
            Code valable jusqu&apos;au dimanche minuit · 50 % off uniquement sur le premier mois · Sans CB pour l&apos;essai
          </p>
        </div>
      </section>

      {/* QUICK START INLINE — capture email rapide */}
      <section className="py-12 px-6 bg-white border-b border-gray-100">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-black text-gray-900 mb-2">Génère ta 1ère page maintenant</h2>
            <p className="text-sm text-gray-500">Pas de carte bancaire, résultat en 30 secondes.</p>
          </div>
          <form onSubmit={handleQuickStart} className="flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="ton@email.com"
              className="flex-1 rounded-xl px-5 py-4 text-sm outline-none border border-gray-200 focus:border-[#da552f] transition-colors"
              aria-label="Ton email"
            />
            <button
              type="submit"
              disabled={submitting}
              className="px-8 py-4 rounded-xl font-bold text-sm text-white transition-all flex items-center justify-center gap-2"
              style={{ background: submitting ? '#fda58e' : '#da552f' }}
            >
              {submitting
                ? <><Loader2 className="w-4 h-4 animate-spin" /> Redirection…</>
                : <>Démarrer gratuitement <ArrowRight className="w-4 h-4" /></>}
            </button>
          </form>
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-16 px-6 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-black text-center text-gray-900 mb-10" style={{ letterSpacing: '-0.02em' }}>
            Ce que tu débloques avec KONVERT
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {FEATURES.map((f) => (
              <div key={f} className="flex items-center gap-3 bg-white rounded-xl p-4 border border-gray-100">
                <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(218,85,47,0.1)' }}>
                  <Check className="w-4 h-4" style={{ color: '#da552f' }} />
                </div>
                <span className="text-sm font-semibold text-gray-700">{f}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-black text-center text-gray-900 mb-10" style={{ letterSpacing: '-0.02em' }}>
            Ce qu&apos;ils en disent
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {PH_TESTIMONIALS.map(({ quote, author, role }) => (
              <div key={author} className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                <div className="flex gap-0.5 mb-3">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} className="w-4 h-4 fill-current" style={{ color: '#da552f' }} />
                  ))}
                </div>
                <p className="text-sm text-gray-700 mb-4 leading-relaxed">&ldquo;{quote}&rdquo;</p>
                <div>
                  <p className="text-sm font-bold text-gray-900">{author}</p>
                  <p className="text-xs text-gray-500">{role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="py-16 px-6" style={{ background: '#111827' }}>
        <div className="max-w-2xl mx-auto text-center">
          <Zap className="w-10 h-10 mx-auto mb-5" style={{ color: '#fda58e' }} />
          <h2 className="text-3xl font-black text-white mb-4" style={{ letterSpacing: '-0.02em' }}>
            Profite des 50 % avant minuit
          </h2>
          <p className="text-white/60 text-lg mb-8">
            Code <code className="font-black text-white">LAUNCH50</code> valable uniquement aujourd&apos;hui pour les supporters ProductHunt.
          </p>
          <Link
            href="/pricing?coupon=LAUNCH50&utm_source=producthunt&utm_campaign=ph_launch_day"
            className="inline-flex items-center gap-2 px-10 py-4 rounded-xl font-bold text-sm text-white transition-all"
            style={{ background: 'linear-gradient(135deg, #ff6154, #da552f)', boxShadow: '0 4px 20px rgba(218,85,47,0.4)' }}
          >
            Activer mon code 50 % <ArrowRight className="w-4 h-4" />
          </Link>
          <p className="mt-4 text-xs text-white/40">
            Aucune CB pour tester · Annulation 1 click · Satisfait ou remboursé 30 jours
          </p>
        </div>
      </section>
    </div>
  )
}

export default function ProductHuntPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white" />}>
      <PHContent />
    </Suspense>
  )
}
