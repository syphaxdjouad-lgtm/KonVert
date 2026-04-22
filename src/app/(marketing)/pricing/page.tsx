'use client'

import { useState, useCallback } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Check, Zap, ChevronDown, ArrowRight, Lock, CreditCard, ShieldCheck } from 'lucide-react'
import { Suspense } from 'react'
import Link from 'next/link'
import TrustBadges from '@/components/marketing/TrustBadges'

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
    desc:         'Pour démarrer et tester rapidement.',
    features: [
      '75 pages / mois',
      '2 stores connectés',
      '42+ templates',
      'Génération copy AI',
      'Export HTML',
      'Support email',
    ],
    cta: 'Démarrer avec Starter',
  },
  {
    id:           'pro',
    name:         'Pro',
    priceMonthly: 79,
    priceAnnual:  63,
    badge:        'Populaire',
    popular:      true,
    enterprise:   false,
    desc:         'Pour les e-commerçants qui veulent scaler.',
    features: [
      '300 pages / mois',
      '7 stores connectés',
      'Tous les templates',
      'Copy AI ton de marque',
      'Analytics de conversion',
      'Support email prioritaire',
      'Export HTML',
    ],
    cta: 'Démarrer avec Pro',
  },
  {
    id:           'agency',
    name:         'Agency',
    priceMonthly: 199,
    priceAnnual:  159,
    badge:        'White-label',
    popular:      false,
    enterprise:   false,
    desc:         'Pour les agences avec plusieurs clients.',
    features: [
      'Pages illimitées',
      'Stores illimités',
      'Tous les templates',
      'White-label (logo + couleurs)',
      'Dashboard multi-clients',
      'Rapports clients',
      'Accès API (bientôt)',
      'Onboarding personnalisé',
    ],
    cta: 'Démarrer avec Agency',
  },
  {
    id:           'enterprise',
    name:         'Enterprise',
    priceMonthly: 0,
    priceAnnual:  0,
    badge:        'Sur mesure',
    popular:      false,
    enterprise:   true,
    desc:         'Pour les grandes structures avec des besoins spécifiques.',
    features: [
      'Tout ce qu\'inclut Agency',
      'Intégrations sur demande',
      'Hébergement haute disponibilité',
      'Support prioritaire direct',
      'Onboarding équipe',
      'Multi-utilisateurs',
      'Facturation personnalisée',
    ],
    cta: 'Nous contacter',
  },
]

/* ─── FAQ ITEM ──────────────────────────────────────────────────────────── */
function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div
      className="bg-white rounded-xl overflow-hidden cursor-pointer border transition-colors duration-200"
      style={{ borderColor: open ? '#d1d5db' : '#e5e7eb' }}
    >
      <button
        className="w-full px-6 py-5 flex items-center justify-between text-left"
        onClick={() => setOpen(!open)}
      >
        <span className="font-semibold text-gray-900 text-sm pr-4">{q}</span>
        <ChevronDown
          className="w-4 h-4 text-gray-400 flex-shrink-0 transition-transform duration-300"
          style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}
        />
      </button>
      <div
        className="px-6 overflow-hidden transition-all duration-300"
        style={
          open
            ? { maxHeight: '400px', opacity: 1, paddingBottom: '20px' }
            : { maxHeight: '0px', opacity: 0, paddingBottom: '0px' }
        }
      >
        <p className="text-gray-500 text-sm leading-relaxed">{a}</p>
      </div>
    </div>
  )
}

/* ─── PRICING CONTENT ───────────────────────────────────────────────────── */
function PricingContent() {
  const [loading, setLoading]   = useState<string | null>(null)
  const [annual, setAnnual]     = useState(false)
  const router                  = useRouter()
  const searchParams            = useSearchParams()
  const canceled                = searchParams.get('canceled')

  async function handleCheckout(plan: string) {
    setLoading(plan)
    try {
      const res  = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan }),
      })
      const json = await res.json()
      if (!res.ok) {
        if (res.status === 401) { router.push('/login'); return }
        throw new Error(json.error)
      }
      window.location.href = json.url
    } catch (err) {
      console.error(err)
      setLoading(null)
    }
  }

  return (
    <div className="min-h-screen bg-white">

      {/* ── NAVBAR MINIMALE ────────────────────────────────────────────── */}
      <nav className="border-b border-gray-100 bg-white sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="font-black text-xl text-gray-900" style={{ letterSpacing: '-0.03em' }}>
            KON<span style={{ color: '#16a34a' }}>VERT</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm font-semibold text-gray-500 hover:text-gray-900 transition-colors">
              Connexion
            </Link>
            <Link
              href="/essai"
              className="text-sm font-bold px-4 py-2.5 rounded-lg text-white bg-green-600 hover:bg-green-700 transition-colors"
            >
              1 page gratuite
            </Link>
          </div>
        </div>
      </nav>

      {/* ── HERO PRICING ─────────────────────────────────────────────────── */}
      <div className="bg-gray-50 border-b border-gray-100 py-16 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-xs font-bold tracking-widest uppercase text-green-600 mb-3">
            Tarifs
          </p>
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4" style={{ letterSpacing: '-0.02em' }}>
            Simple et transparent
          </h1>
          <p className="text-gray-500 text-lg mb-8">
            Génère des landing pages qui convertissent, sans te ruiner
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

                  {/* Nom + description */}
                  <div className="mb-5">
                    <div
                      className="font-black text-lg mb-1"
                      style={{ color: plan.enterprise ? '#ffffff' : '#111827' }}
                    >
                      {plan.name}
                    </div>
                    <div
                      className="text-sm"
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

          {/* Satisfait ou remboursé */}
          <div className="mt-6 flex justify-center">
            <div
              className="inline-flex items-center gap-3 px-6 py-3.5 rounded-2xl"
              style={{ background: '#f0fdf4', border: '1px solid #bbf7d0' }}
            >
              <ShieldCheck className="w-5 h-5 text-green-600 flex-shrink-0" aria-hidden="true" />
              <p className="text-sm font-semibold text-green-800">
                Satisfait ou remboursé 30 jours —{' '}
                <span className="font-normal text-green-700">Sans question</span>
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

      {/* ── COMPARATIF FEATURES ──────────────────────────────────────────── */}
      <div className="py-16 px-6 bg-gray-50 border-t border-gray-100">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-black text-gray-900 mb-8 text-center" style={{ letterSpacing: '-0.02em' }}>
            Comparatif des fonctionnalités
          </h2>

          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden" style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
            {/* Header */}
            <div className="grid grid-cols-5 border-b border-gray-100">
              <div className="p-4 col-span-1" />
              {[
                { label: 'Starter', highlight: false, dark: false },
                { label: 'Pro', highlight: true, dark: false },
                { label: 'Agency', highlight: false, dark: false },
                { label: 'Enterprise', highlight: false, dark: true },
              ].map(({ label, highlight, dark }) => (
                <div
                  key={label}
                  className="p-4 text-center font-black text-sm"
                  style={
                    highlight
                      ? { background: '#f0fdf4', color: '#16a34a' }
                      : dark
                      ? { background: '#111827', color: '#ffffff' }
                      : { color: '#374151' }
                  }
                >
                  {label}
                  {highlight && (
                    <div className="text-[10px] font-semibold text-green-500 mt-0.5">Recommandé</div>
                  )}
                </div>
              ))}
            </div>

            {/* Rows */}
            {[
              { feature: 'Pages / mois',     values: ['75', '300', 'Illimitées', 'Illimitées'] },
              { feature: 'Stores connectés', values: ['2', '7', 'Illimités', 'Illimités'] },
              { feature: 'Templates',        values: ['17', 'Tous', 'Tous', 'Tous'] },
              { feature: 'Copy AI',          values: [true, true, true, true] },
              { feature: 'Export HTML',      values: [true, true, true, true] },
              { feature: 'Analytics',        values: [false, true, true, true] },
              { feature: 'White-label',      values: [false, false, true, true] },
              { feature: 'Accès API',        values: [false, false, true, true] },
              { feature: 'Multi-clients',    values: [false, false, true, true] },
              { feature: 'Rapports PDF',     values: [false, false, true, true] },
              { feature: 'SLA garanti',      values: [false, false, false, true] },
              { feature: 'Account manager', values: [false, false, false, true] },
              { feature: 'Support',          values: ['Email 48h', 'Prioritaire 24h', 'Dédié', 'Dédié + SLA'] },
            ].map(({ feature, values }, rowIdx) => (
              <div
                key={feature}
                className="grid grid-cols-5 border-b border-gray-50 hover:bg-gray-50 transition-colors"
                style={{ borderBottomColor: rowIdx === 12 ? 'transparent' : undefined }}
              >
                <div className="p-3.5 text-sm text-gray-600 font-medium">{feature}</div>
                {values.map((val, i) => (
                  <div
                    key={i}
                    className="p-3.5 text-center"
                    style={
                      i === 1
                        ? { background: 'rgba(240,253,244,0.4)' }
                        : i === 3
                        ? { background: 'rgba(17,24,39,0.04)' }
                        : {}
                    }
                  >
                    {typeof val === 'boolean' ? (
                      val
                        ? <Check className="w-4 h-4 text-green-500 mx-auto" />
                        : <span className="text-gray-200 text-lg">—</span>
                    ) : (
                      <span className="text-sm font-semibold text-gray-700">{val}</span>
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── FAQ PRICING ──────────────────────────────────────────────────── */}
      <div className="py-16 px-6 bg-white border-t border-gray-100">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-black text-gray-900 mb-8 text-center" style={{ letterSpacing: '-0.02em' }}>
            Questions fréquentes sur les tarifs
          </h2>

          <div className="space-y-3">
            {[
              {
                q: 'Puis-je changer de plan à tout moment ?',
                a: 'Oui. Tu peux upgrader ou downgrader depuis ton dashboard à tout moment. Le changement prend effet immédiatement et le prorata est calculé automatiquement par Stripe.',
              },
              {
                q: 'Comment fonctionne la facturation annuelle ?',
                a: 'En choisissant le plan annuel, tu paies 12 mois en avance et bénéficies d\'une réduction de 25%. Une seule facture est émise au moment du paiement.',
              },
              {
                q: 'Que se passe-t-il si je dépasse mon quota mensuel ?',
                a: 'La génération est temporairement suspendue jusqu\'à la prochaine période de facturation. Tu peux upgrader ton plan à tout moment pour débloquer immédiatement plus de pages.',
              },
              {
                q: 'Y a-t-il une période d\'essai gratuite ?',
                a: 'Oui — tu peux générer 1 page produit gratuitement sans créer de compte. Aucune carte bancaire, résultat immédiat. Si la page te convainc, tu choisis un plan pour l\'utiliser sur ta boutique.',
              },
              {
                q: 'Comment annuler mon abonnement ?',
                a: 'Tu peux annuler depuis Paramètres → Abonnement dans ton dashboard, en quelques clics. L\'accès est maintenu jusqu\'à la fin de ta période payée.',
              },
            ].map(({ q, a }) => (
              <FaqItem key={q} q={q} a={a} />
            ))}
          </div>
        </div>
      </div>

      {/* ── CTA FINAL ────────────────────────────────────────────────────── */}
      <div
        className="py-20 px-6 text-center"
        style={{ background: '#111827' }}
      >
        <h2
          className="text-3xl md:text-4xl font-black text-white mb-4"
          style={{ letterSpacing: '-0.02em' }}
        >
          Prêt à générer ta première page ?
        </h2>
        <p className="text-lg mb-8" style={{ color: 'rgba(255,255,255,0.6)' }}>
          Génère ta 1ère page gratuitement — vois le résultat avant de payer.
        </p>
        <Link
          href="/essai"
          className="inline-flex items-center gap-2 font-bold px-10 py-4 rounded-lg text-white text-base bg-green-600 hover:bg-green-700 transition-colors"
          style={{ boxShadow: '0 4px 20px rgba(22,163,74,0.35)' }}
        >
          Générer ma première page — gratuit
          <ArrowRight className="w-4 h-4" />
        </Link>
        <p className="mt-3 text-sm" style={{ color: 'rgba(255,255,255,0.3)' }}>
          Stripe · Annulation à tout moment · Sans engagement
        </p>
        <p className="mt-2 text-sm font-semibold" style={{ color: 'rgba(134,239,172,0.8)' }}>
          <ShieldCheck className="inline w-3.5 h-3.5 mr-1" /> Satisfait ou remboursé 30 jours — Sans question
        </p>
      </div>

      {/* ── FOOTER MINIMAL ───────────────────────────────────────────────── */}
      <footer className="bg-white border-t border-gray-100 py-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <Link href="/" className="font-black text-gray-900" style={{ letterSpacing: '-0.02em' }}>
            KON<span style={{ color: '#16a34a' }}>VERT</span>
          </Link>
          <div className="flex flex-wrap items-center gap-6 text-sm text-gray-400">
            <Link href="/" className="hover:text-gray-700 transition-colors">Accueil</Link>
            <Link href="/legal/mentions" className="hover:text-gray-700 transition-colors">Mentions légales</Link>
            <Link href="/legal/privacy" className="hover:text-gray-700 transition-colors">Confidentialité</Link>
            <a href="mailto:support@konvert.app" className="hover:text-gray-700 transition-colors">Support</a>
          </div>
          <p className="text-xs text-gray-300">© 2026 KONVERT</p>
        </div>
      </footer>
    </div>
  )
}

export default function PricingPage() {
  return (
    <Suspense fallback={null}>
      <PricingContent />
    </Suspense>
  )
}
