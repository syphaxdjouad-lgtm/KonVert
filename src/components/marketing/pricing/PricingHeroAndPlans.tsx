'use client'

import { useState, useEffect, useRef, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { toast } from 'sonner'
import * as Sentry from '@sentry/nextjs'
import Link from 'next/link'
import { track } from '@/lib/analytics'
import { pixels } from '@/lib/tracking/pixels'
import { Check, Lock, CreditCard, ShieldCheck } from 'lucide-react'
import TrustBadges from '@/components/marketing/TrustBadges'
import { TEMPLATE_COUNT } from '@/lib/templates'

function addRipple(e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) {
  const el = e.currentTarget
  const rect = el.getBoundingClientRect()
  const size = Math.max(rect.width, rect.height) * 2
  const x = e.clientX - rect.left - size / 2
  const y = e.clientY - rect.top - size / 2
  const wave = document.createElement('span')
  wave.className = 'ripple-wave'
  Object.assign(wave.style, { width: `${size}px`, height: `${size}px`, left: `${x}px`, top: `${y}px` })
  el.appendChild(wave)
  setTimeout(() => wave.remove(), 600)
}

/* ─── PLANS DATA ────────────────────────────────────────────────────────── */
const PLANS = [
  {
    id:           'starter',
    name:         'Starter',
    priceMonthly: 39,
    priceAnnual:  31,
    badge:        null,
    popular:      false,
    enterprise:   false,
    tagline:      'Pour valider un produit, vite.',
    desc:         'Publie tes premières pages produit sans mobiliser ton équipe design. De quoi valider si un produit mérite un vrai budget ad avant d\'investir plus loin.',
    features: [
      '75 pages / mois',
      '2 stores connectés',
      `${TEMPLATE_COUNT}+ templates`,
      'Génération copy AI',
      'Export HTML',
      'Support email',
    ],
    cta: 'Démarre avec Starter',
  },
  {
    id:           'pro',
    name:         'Pro',
    priceMonthly: 79,
    priceAnnual:  63,
    badge:        'Populaire',
    popular:      true,
    enterprise:   false,
    tagline:      'Pour scaler au rythme de tes campagnes.',
    desc:         'Publie autant de pages que tes campagnes l\'exigent, avec analytics et A/B test intégrés. Ton time-to-market arrête de dépendre du planning de quelqu\'un d\'autre.',
    features: [
      '300 pages / mois',
      '7 stores connectés',
      'Tous les templates',
      'Copy AI ton de marque',
      'Analytics de conversion',
      'Support email prioritaire',
      'Export HTML',
    ],
    cta: 'Démarre avec Pro',
  },
  {
    id:           'agency',
    name:         'Agency',
    priceMonthly: 199,
    priceAnnual:  159,
    badge:        'White-label',
    popular:      false,
    enterprise:   false,
    tagline:      'Pour livrer plus vite que tes concurrents facturés à l\'heure.',
    desc:         'Produis des pages pour plusieurs clients sans embaucher un designer de plus. Ce que tu factures en "délai de livraison" devient ton avantage concurrentiel, pas ton goulot d\'étranglement.',
    features: [
      'Pages illimitées',
      'Stores illimités',
      'Tous les templates',
      'White-label (logo + couleurs)',
      'Dashboard multi-clients',
      'Rapports clients',
      'Onboarding personnalisé',
    ],
    cta: 'Démarre avec Agency',
  },
  {
    id:           'enterprise',
    name:         'Enterprise',
    priceMonthly: 0,
    priceAnnual:  0,
    badge:        'Sur mesure',
    popular:      false,
    enterprise:   true,
    tagline:      'Pour les volumes et les besoins qu\'aucun plan standard ne couvre.',
    desc:         'Volume sur-mesure, intégrations spécifiques, accompagnement dédié. Un interlocuteur, pas un ticket support.',
    features: [
      'Tout ce qu\'inclut Agency',
      'Intégrations sur demande',
      'Hébergement haute disponibilité',
      'Support prioritaire direct',
      'Onboarding équipe',
      'Multi-utilisateurs',
      'Facturation personnalisée',
    ],
    cta: 'Parle à l\'équipe',
  },
]

/* ─── PRICING CONTENT ───────────────────────────────────────────────────── */
function PricingHeroAndPlansContent() {
  const [loading, setLoading]   = useState<string | null>(null)
  const [annual, setAnnual]     = useState(false)
  const router                  = useRouter()
  const searchParams            = useSearchParams()
  const canceled                = searchParams.get('canceled')
  // Coupon transmis via /pricing?coupon=LAUNCH50 (depuis /producthunt ou
  // /launch-day) — passé tel quel à /api/stripe/checkout qui resout le
  // promotion code Stripe et l'applique automatiquement.
  const couponFromUrl           = searchParams.get('coupon')
  // autocheckout : flag posé par le emailRedirectTo de signup. Quand l'user
  // confirme son email, Supabase le redirige ici avec ce param + une session
  // valide → on relance handleCheckout automatiquement pour reprendre le funnel
  // là où il s'est arrêté avant la confirmation email.
  const autoCheckoutPlan        = searchParams.get('autocheckout')
  const autoCheckoutInterval    = searchParams.get('interval')
  const autoFiredRef            = useRef(false)

  async function handleCheckout(plan: string) {
    setLoading(plan)
    // Tracking funnel : selectedPlan + checkoutStarted. planSelected capture
    // aussi le prix affiché → permet de mesurer si le toggle annuel pousse
    // mieux les Pro vs les Starter.
    const planMeta = PLANS.find(p => p.id === plan)
    const value = planMeta ? (annual ? planMeta.priceAnnual : planMeta.priceMonthly) : 0
    if (planMeta) {
      track.planSelected(plan as 'starter' | 'pro' | 'agency' | 'enterprise', value)
    }
    track.checkoutStarted(plan)
    // Pixels InitiateCheckout : critique pour optimiser les campagnes Meta
    // sur "ajout au panier équivalent". Valeur réelle = mensuel ou annuel selon toggle.
    pixels.initiateCheckout({ plan, value, currency: 'EUR' })
    try {
      const res  = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // interval explicite : sans ce champ, l'API tombait par défaut sur le
        // price mensuel et le toggle "Annuel" ne servait à rien (perte revenu).
        // coupon : auto-appliqué si /pricing?coupon=LAUNCH50 (lien depuis /producthunt).
        body: JSON.stringify({
          plan,
          interval: annual ? 'annual' : 'monthly',
          ...(couponFromUrl && { coupon: couponFromUrl }),
        }),
      })
      const json = await res.json()
      if (!res.ok) {
        if (res.status === 401) {
          // Pas de session : on envoie sur /signup avec le plan/interval pré-sélectionné.
          // Après création de compte, signup relance automatiquement le checkout Stripe.
          const params = new URLSearchParams({
            plan,
            interval: annual ? 'annual' : 'monthly',
            ...(couponFromUrl && { coupon: couponFromUrl }),
          })
          router.push(`/signup?${params.toString()}`)
          return
        }
        throw new Error(json.error || `Erreur ${res.status}`)
      }
      window.location.href = json.url
    } catch (err) {
      // Avant : silencieux — le user voyait le spinner disparaître sans message.
      // Maintenant : toast visible + Sentry pour qu'on soit alerté en prod.
      const message = err instanceof Error ? err.message : 'Erreur lors du paiement.'
      toast.error(message, {
        description: 'Réessaie ou contacte support@konvertpilot.com si ça persiste.',
      })
      Sentry.captureException(err, { tags: { component: 'pricing/handleCheckout' }, extra: { plan, annual } })
      setLoading(null)
    }
  }

  // Auto-resume checkout après confirmation email Supabase.
  // Le signup pose emailRedirectTo=/pricing?autocheckout=PLAN&interval=INT&coupon=X
  // → quand l'user clique le magic link, il atterrit ici avec une session valide
  // → on relance handleCheckout pour finaliser le funnel sans re-cliquer.
  // autoFiredRef évite la double-exécution en cas de re-render React.
  useEffect(() => {
    if (autoFiredRef.current) return
    if (!autoCheckoutPlan || !['starter', 'pro', 'agency'].includes(autoCheckoutPlan)) return
    autoFiredRef.current = true
    if (autoCheckoutInterval === 'annual') setAnnual(true)
    // Petit délai pour que les pixels d'init aient le temps de charger.
    setTimeout(() => handleCheckout(autoCheckoutPlan), 200)
  // handleCheckout est stable (pas de deps capturées critiques) — on évite de
  // l'ajouter en dep pour ne pas retrigger.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoCheckoutPlan, autoCheckoutInterval])

  return (
    <>
      {/* ── HERO PRICING ─────────────────────────────────────────────────── */}
      <div className="bg-gray-50 border-b border-gray-100 py-16 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-xs font-bold tracking-widest uppercase text-green-600 mb-3">
            Tarifs
          </p>
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4" style={{ letterSpacing: '-0.02em' }}>
            Le prix d&apos;une page qui ne fait pas attendre ton lancement.
          </h1>
          <p className="text-gray-500 text-lg mb-8">
            Starter pour tester, Pro pour scaler, Agency pour tes clients. Vois le résultat avant de payer, sur chaque plan.
          </p>

          {/* Toggle mensuel / annuel */}
          <div className="inline-flex items-center gap-3 bg-white rounded-xl p-1.5 border border-gray-200 shadow-sm">
            <button
              onClick={() => setAnnual(false)}
              className="px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200"
              style={
                !annual
                  ? { background: '#111827', color: '#ffffff' }
                  : { background: 'transparent', color: '#6b7280' }
              }
            >
              Mensuel
            </button>
            <button
              onClick={() => setAnnual(true)}
              className="px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 flex items-center gap-2"
              style={
                annual
                  ? { background: '#111827', color: '#ffffff' }
                  : { background: 'transparent', color: '#6b7280' }
              }
            >
              Annuel
              <span
                className="text-[10px] font-black px-2 py-0.5 rounded-full"
                style={
                  annual
                    ? { background: '#16a34a', color: '#ffffff' }
                    : { background: '#dcfce7', color: '#16a34a' }
                }
              >
                -25%
              </span>
            </button>
          </div>

          {canceled && (
            <div className="mt-6 inline-block bg-yellow-50 border border-yellow-200 text-yellow-700 text-sm font-medium px-4 py-2.5 rounded-xl">
              Paiement annulé — tu peux réessayer quand tu veux
            </div>
          )}
          {autoCheckoutPlan && (
            <div className="mt-6 inline-flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 text-sm font-semibold px-4 py-2.5 rounded-xl">
              <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Compte confirmé — redirection vers le paiement <span className="capitalize">{autoCheckoutPlan}</span>...
            </div>
          )}
          {couponFromUrl && (
            <div
              className="mt-6 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold border"
              style={{ background: 'rgba(91,71,245,0.08)', borderColor: 'rgba(91,71,245,0.25)', color: '#5B47F5' }}
            >
              <span className="text-base">🎁</span>
              Code <code className="font-black px-2 py-0.5 rounded bg-white">{couponFromUrl.toUpperCase()}</code> sera appliqué au checkout
            </div>
          )}
        </div>
      </div>

      {/* ── CARTES PLANS ─────────────────────────────────────────────────── */}
      <div className="py-16 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 items-center">
            {PLANS.map(plan => {
              const price = annual ? plan.priceAnnual : plan.priceMonthly
              return (
                <div
                  key={plan.id}
                  className={`relative flex flex-col rounded-xl transition-all duration-200 ${!plan.popular && !plan.enterprise ? 'card-hover-violet' : ''}`}
                  style={
                    plan.popular
                      ? {
                          background: '#ffffff',
                          border: '2px solid #16a34a',
                          transform: 'scale(1.04)',
                          boxShadow: '0 0 0 2px #16a34a, 0 8px 32px rgba(22,163,74,0.14), 0 24px 48px rgba(0,0,0,0.06)',
                          padding: '32px 24px',
                        }
                      : plan.enterprise
                      ? {
                          background: '#111827',
                          border: '1px solid #374151',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                          padding: '28px 24px',
                        }
                      : {
                          background: '#ffffff',
                          border: '1px solid #e5e7eb',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                          padding: '28px 24px',
                        }
                  }
                >
                  {/* Badge */}
                  {plan.badge && (
                    <div
                      className="absolute -top-3.5 left-1/2 -translate-x-1/2 text-xs font-black px-4 py-1.5 rounded-full whitespace-nowrap"
                      style={
                        plan.popular
                          ? { background: '#16a34a', color: '#ffffff' }
                          : plan.enterprise
                          ? { background: '#6366f1', color: '#ffffff' }
                          : { background: '#f59e0b', color: '#ffffff' }
                      }
                    >
                      {plan.badge}
                    </div>
                  )}

                  {/* Nom + tagline + value prop */}
                  <div className="mb-5">
                    <div
                      className="font-black text-lg mb-1"
                      style={{ color: plan.enterprise ? '#ffffff' : '#111827' }}
                    >
                      {plan.name}
                    </div>
                    <div
                      className="text-sm font-semibold mb-1.5"
                      style={{ color: plan.enterprise ? 'rgba(255,255,255,0.75)' : '#5B47F5' }}
                    >
                      {plan.tagline}
                    </div>
                    <div
                      className="text-xs leading-relaxed"
                      style={{ color: plan.enterprise ? 'rgba(255,255,255,0.5)' : '#9ca3af' }}
                    >
                      {plan.desc}
                    </div>
                  </div>

                  {/* Prix */}
                  {plan.enterprise ? (
                    <div className="mb-6">
                      <div className="font-black text-white" style={{ fontSize: '1.6rem', lineHeight: 1.2, letterSpacing: '-0.02em' }}>
                        Sur devis
                      </div>
                      <div className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.4)' }}>
                        Tarif personnalisé selon vos besoins
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-end gap-1 mb-6">
                      <span
                        className="font-black text-gray-900"
                        style={{ fontSize: '2.8rem', lineHeight: 1, letterSpacing: '-0.03em' }}
                      >
                        {price}€
                      </span>
                      <div className="mb-1.5 ml-1">
                        <div className="text-sm text-gray-400">/mois</div>
                        {annual && (
                          <div className="text-[11px] text-green-600 font-semibold">
                            soit {price * 12}€/an
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Features */}
                  <ul className="space-y-3 flex-1 mb-7">
                    {plan.features.map(f => (
                      <li key={f} className="flex items-start gap-2.5 text-sm">
                        <div
                          className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                          style={{ background: plan.enterprise ? 'rgba(99,102,241,0.3)' : '#dcfce7' }}
                        >
                          <Check
                            className="w-2.5 h-2.5"
                            style={{ color: plan.enterprise ? '#a5b4fc' : '#16a34a' }}
                          />
                        </div>
                        <span style={{ color: plan.enterprise ? 'rgba(255,255,255,0.7)' : '#4b5563' }}>{f}</span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA */}
                  {plan.enterprise ? (
                    <Link
                      href="/contact"
                      className="btn-ripple w-full font-bold py-3.5 rounded-lg text-sm text-center transition-all duration-200 block"
                      style={{ background: '#6366f1', color: '#ffffff', boxShadow: '0 4px 12px rgba(99,102,241,0.3)' }}
                      onClick={addRipple}
                    >
                      {plan.cta}
                    </Link>
                  ) : (
                    <button
                      onClick={(e) => { addRipple(e); handleCheckout(plan.id) }}
                      disabled={loading === plan.id}
                      className={`btn-ripple w-full font-bold py-3.5 rounded-lg text-sm transition-all duration-200 disabled:opacity-50 ${plan.popular ? 'btn-shimmer' : ''}`}
                      style={
                        plan.popular
                          ? { background: 'linear-gradient(135deg, #16a34a, #15803d)', color: '#ffffff', boxShadow: '0 4px 12px rgba(22,163,74,0.3)' }
                          : { background: '#f9fafb', color: '#374151', border: '1px solid #e5e7eb' }
                      }
                      onMouseEnter={(e) => {
                        if (!plan.popular) (e.currentTarget as HTMLElement).style.background = '#f3f4f6'
                      }}
                      onMouseLeave={(e) => {
                        if (!plan.popular) (e.currentTarget as HTMLElement).style.background = '#f9fafb'
                      }}
                    >
                      {loading === plan.id ? (
                        <span className="flex items-center justify-center gap-2">
                          <svg className="animate-spin w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                          </svg>
                          Redirection...
                        </span>
                      ) : plan.cta}
                    </button>
                  )}
                  {/* Mini trust sous le CTA */}
                  <p className="text-center mt-2" style={{ fontSize: '10px', color: plan.enterprise ? 'rgba(255,255,255,0.3)' : '#9ca3af' }}>
                    <Lock className="inline w-2.5 h-2.5 mr-0.5" /> SSL · <CreditCard className="inline w-2.5 h-2.5 mr-0.5" /> Stripe · <ShieldCheck className="inline w-2.5 h-2.5 mr-0.5" /> Sans engagement
                  </p>
                </div>
              )
            })}
          </div>

          {/* Trust badges */}
          <div className="mt-12">
            <TrustBadges />
          </div>

          {/* Ligne anti-risque — cf. `06-ZARA-reecriture-hero-pricing.md` Section 4 :
              reformulation honnête de la garantie, cohérente avec le hero. */}
          <div className="mt-6 flex justify-center">
            <div
              className="inline-flex items-center gap-3 px-6 py-3.5 rounded-2xl"
              style={{ background: '#f0fdf4', border: '1px solid #bbf7d0' }}
            >
              <ShieldCheck className="w-5 h-5 text-green-600 flex-shrink-0" aria-hidden="true" />
              <p className="text-sm font-semibold text-green-800">
                Tu testes avant de payer.{' '}
                <span className="font-normal text-green-700">Pas l&apos;inverse.</span>
              </p>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-center gap-4 text-xs text-gray-400">
            <span>Annulation à tout moment</span>
            <span className="hidden sm:block">·</span>
            <span>Sans engagement</span>
            <span className="hidden sm:block">·</span>
            <span>Support inclus dès le premier jour</span>
          </div>
        </div>
      </div>
    </>
  )
}

export default function PricingHeroAndPlans() {
  return (
    <Suspense fallback={null}>
      <PricingHeroAndPlansContent />
    </Suspense>
  )
}
