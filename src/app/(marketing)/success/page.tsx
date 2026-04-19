'use client'

import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import Link from 'next/link'
import { CheckCircle, ArrowRight, Zap, LayoutDashboard, BookOpen } from 'lucide-react'

const PLAN_LABELS: Record<string, { name: string; color: string }> = {
  starter: { name: 'Starter', color: '#2563eb' },
  pro:     { name: 'Pro',     color: '#7c3aed' },
  agency:  { name: 'Agency',  color: '#0891b2' },
}

function SuccessContent() {
  const params   = useSearchParams()
  const plan     = params.get('plan') || 'pro'
  const planInfo = PLAN_LABELS[plan] || PLAN_LABELS.pro

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4 py-24"
      style={{ background: '#fafafa' }}
    >
      {/* Carte principale */}
      <div
        className="w-full max-w-lg rounded-3xl p-10 text-center"
        style={{ background: '#fff', border: '1px solid #e5e7eb', boxShadow: '0 8px 40px rgba(0,0,0,0.06)' }}
      >
        {/* Icône succès */}
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
          style={{ background: 'rgba(22,163,74,0.1)' }}
        >
          <CheckCircle className="w-10 h-10" style={{ color: '#16a34a' }} />
        </div>

        {/* Titre */}
        <h1 className="text-3xl font-black mb-2" style={{ color: '#111', letterSpacing: '-0.02em' }}>
          Bienvenue sur KONVERT !
        </h1>

        {/* Badge plan */}
        <div
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-5"
          style={{ background: `${planInfo.color}14`, border: `1px solid ${planInfo.color}30` }}
        >
          <Zap className="w-3.5 h-3.5" style={{ color: planInfo.color }} />
          <span className="text-sm font-bold" style={{ color: planInfo.color }}>
            Plan {planInfo.name} activé
          </span>
        </div>

        <p className="text-base mb-8" style={{ color: '#6b7280', lineHeight: '1.6' }}>
          Ton abonnement est confirmé. Tu peux maintenant générer tes pages produit et les publier directement sur ta boutique.
        </p>

        {/* CTA principal */}
        <Link
          href="/dashboard"
          className="flex items-center justify-center gap-2 w-full text-white font-bold text-base py-4 rounded-2xl transition-all hover:opacity-90 hover:scale-[1.02] mb-3"
          style={{ background: 'linear-gradient(135deg, #7c3aed, #6d28d9)', boxShadow: '0 4px 20px rgba(124,58,237,0.35)' }}
        >
          <LayoutDashboard className="w-5 h-5" />
          Aller au dashboard
          <ArrowRight className="w-4 h-4" />
        </Link>

        {/* CTA secondaire */}
        <Link
          href="/dashboard/new"
          className="flex items-center justify-center gap-2 w-full font-bold text-sm py-3 rounded-2xl transition-colors"
          style={{ border: '1px solid #e5e7eb', color: '#374151', background: '#fff' }}
        >
          <Zap className="w-4 h-4" style={{ color: '#7c3aed' }} />
          Créer ma première page maintenant
        </Link>
      </div>

      {/* Steps rapides */}
      <div className="w-full max-w-lg mt-8 grid grid-cols-3 gap-3">
        {[
          {
            icon:  <Zap className="w-5 h-5" />,
            title: 'Colle un lien produit',
            desc:  'AliExpress, Amazon, Shopify…',
            color: '#7c3aed',
            bg:    'rgba(124,58,237,0.08)',
          },
          {
            icon:  <BookOpen className="w-5 h-5" />,
            title: "L'IA génère tout",
            desc:  'Copy, titres, FAQ en 30s',
            color: '#2563eb',
            bg:    'rgba(37,99,235,0.08)',
          },
          {
            icon:  <LayoutDashboard className="w-5 h-5" />,
            title: 'Publie en 1 clic',
            desc:  'Shopify ou WooCommerce',
            color: '#16a34a',
            bg:    'rgba(22,163,74,0.08)',
          },
        ].map((step, i) => (
          <div
            key={i}
            className="rounded-2xl p-4 text-center"
            style={{ background: '#fff', border: '1px solid #e5e7eb' }}
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-3"
              style={{ background: step.bg, color: step.color }}
            >
              {step.icon}
            </div>
            <div className="text-xs font-black mb-1" style={{ color: '#111' }}>{step.title}</div>
            <div className="text-xs" style={{ color: '#9ca3af' }}>{step.desc}</div>
          </div>
        ))}
      </div>

      {/* Note facturation */}
      <p className="mt-6 text-xs" style={{ color: '#9ca3af' }}>
        Un email de confirmation a été envoyé par Stripe. Tu peux gérer ta facturation depuis{' '}
        <Link href="/dashboard/settings" style={{ color: '#7c3aed' }}>les paramètres</Link>.
      </p>
    </div>
  )
}

export default function SuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center text-sm" style={{ color: '#9ca3af' }}>
        Chargement...
      </div>
    }>
      <SuccessContent />
    </Suspense>
  )
}
