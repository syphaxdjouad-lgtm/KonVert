'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Check, Zap } from 'lucide-react'
import { Suspense } from 'react'

const PLANS = [
  {
    id:       'starter',
    name:     'Starter',
    price:    29,
    color:    'border-gray-200',
    badge:    null,
    features: [
      '50 pages / mois',
      '2 stores connectés',
      '5 templates premium',
      'Export HTML',
      'Support email',
    ],
  },
  {
    id:       'pro',
    name:     'Pro',
    price:    49,
    color:    'border-purple-500',
    badge:    'Populaire',
    features: [
      '200 pages / mois',
      '5 stores connectés',
      'Tous les templates',
      'Export HTML',
      'Analytics de conversion',
      'Support prioritaire',
    ],
  },
  {
    id:       'agency',
    name:     'Agency',
    price:    119,
    color:    'border-yellow-400',
    badge:    'White-label',
    features: [
      '500 pages / mois',
      '15 stores connectés',
      'Tous les templates',
      'White-label (ton logo)',
      'Analytics avancés',
      'Accès API',
      'Support dédié',
    ],
  },
]

function PricingContent() {
  const [loading, setLoading] = useState<string | null>(null)
  const router                = useRouter()
  const searchParams          = useSearchParams()
  const canceled              = searchParams.get('canceled')

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
    <div className="min-h-screen bg-gray-50 py-16 px-4">
      <div className="max-w-5xl mx-auto">

        <div className="text-center mb-12">
          <span className="text-xs font-bold tracking-widest text-purple-600 uppercase">Tarifs</span>
          <h1 className="text-4xl font-black text-gray-900 mt-2 mb-3">
            Simple et transparent
          </h1>
          <p className="text-gray-500 text-lg">Génère des landing pages qui convertissent, sans te ruiner</p>
          {canceled && (
            <div className="mt-4 inline-block bg-yellow-50 border border-yellow-200 text-yellow-700 text-sm font-medium px-4 py-2 rounded-xl">
              Paiement annulé — tu peux réessayer quand tu veux
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PLANS.map(plan => (
            <div
              key={plan.id}
              className={`bg-white rounded-2xl border-2 ${plan.color} p-6 relative flex flex-col`}
            >
              {plan.badge && (
                <div className={`absolute -top-3 left-1/2 -translate-x-1/2 text-xs font-bold px-3 py-1 rounded-full ${
                  plan.id === 'pro' ? 'bg-purple-600 text-white' : 'bg-yellow-400 text-yellow-900'
                }`}>
                  {plan.badge}
                </div>
              )}

              <div className="mb-6">
                <div className="font-black text-gray-900 text-lg">{plan.name}</div>
                <div className="flex items-end gap-1 mt-2">
                  <span className="text-4xl font-black text-gray-900">{plan.price}€</span>
                  <span className="text-gray-400 text-sm mb-1">/mois</span>
                </div>
              </div>

              <ul className="space-y-3 flex-1 mb-6">
                {plan.features.map(f => (
                  <li key={f} className="flex items-start gap-2 text-sm text-gray-700">
                    <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleCheckout(plan.id)}
                disabled={loading === plan.id}
                className={`w-full font-bold py-3 rounded-xl text-sm transition-colors ${
                  plan.id === 'pro'
                    ? 'bg-purple-600 hover:bg-purple-700 text-white'
                    : plan.id === 'agency'
                    ? 'bg-yellow-400 hover:bg-yellow-500 text-yellow-900'
                    : 'bg-gray-900 hover:bg-gray-800 text-white'
                } disabled:opacity-50`}
              >
                {loading === plan.id ? 'Redirection...' : `Choisir ${plan.name}`}
              </button>
            </div>
          ))}
        </div>

        <p className="text-center text-xs text-gray-400 mt-8">
          Paiement sécurisé via Stripe · Annulation à tout moment · Sans engagement
        </p>
      </div>
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
