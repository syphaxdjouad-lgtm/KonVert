'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { CheckCircle2, Circle, X, Rocket, ChevronDown, ChevronUp } from 'lucide-react'

interface Step {
  id: string
  label: string
  desc: string
  href: string
  cta: string
  done: boolean
}

interface Props {
  pagesCount: number
  storesCount: number
  publishedCount: number
  hasAnalytics: boolean
}

const DISMISS_KEY = 'konvert-onboarding-dismissed'

export default function OnboardingChecklist({ pagesCount, storesCount, publishedCount, hasAnalytics }: Props) {
  const [dismissed, setDismissed] = useState(true) // true pour éviter flash SSR
  const [collapsed, setCollapsed] = useState(false)

  useEffect(() => {
    const d = localStorage.getItem(DISMISS_KEY) === '1'
    setDismissed(d)
  }, [])

  const steps: Step[] = [
    {
      id: 'create_page',
      label: 'Créer ta première page de vente',
      desc: 'Colle une URL produit AliExpress, Amazon ou Alibaba — la page se génère en 30 secondes.',
      href: '/dashboard/new',
      cta: 'Créer une page →',
      done: pagesCount > 0,
    },
    {
      id: 'connect_store',
      label: 'Connecter ton store',
      desc: 'Relie ton Shopify ou WooCommerce pour publier tes pages en 1 clic directement depuis le dashboard.',
      href: '/dashboard/stores',
      cta: 'Connecter un store →',
      done: storesCount > 0,
    },
    {
      id: 'publish_page',
      label: 'Publier ta première page',
      desc: 'Envoie ta landing page sur ton store. Elle sera en ligne en quelques secondes.',
      href: '/dashboard/pages',
      cta: 'Voir mes pages →',
      done: publishedCount > 0,
    },
    {
      id: 'check_analytics',
      label: 'Analyser tes performances',
      desc: 'Suis les vues, clics et taux de conversion de chaque page en temps réel.',
      href: '/dashboard/analytics',
      cta: 'Voir les analytics →',
      done: hasAnalytics,
    },
  ]

  const doneCount = steps.filter(s => s.done).length
  const allDone = doneCount === steps.length
  const pct = Math.round((doneCount / steps.length) * 100)

  // Masquer automatiquement si tout est fait et que l'utilisateur a déjà vu le checklist
  function dismiss() {
    localStorage.setItem(DISMISS_KEY, '1')
    setDismissed(true)
  }

  if (dismissed) return null

  return (
    <div
      className="rounded-2xl overflow-hidden mb-6"
      style={{ border: '1px solid #E4E2EE', background: '#ffffff' }}
    >
      {/* ── Header ── */}
      <div
        className="flex items-center justify-between px-5 py-4 cursor-pointer select-none"
        style={{ borderBottom: collapsed ? 'none' : '1px solid #E4E2EE' }}
        onClick={() => setCollapsed(c => !c)}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, #7c3aed, #5b21b6)' }}
          >
            <Rocket size={16} color="#b5f23d" strokeWidth={2.2} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[14px] font-black" style={{ color: '#0f0f1e' }}>
                Démarrer avec KONVERT
              </span>
              <span
                className="text-[11px] font-bold px-2 py-0.5 rounded-full"
                style={{
                  background: allDone ? '#f0fdf4' : '#f3f0ff',
                  color: allDone ? '#16a34a' : '#7c3aed',
                }}
              >
                {doneCount}/{steps.length}
              </span>
            </div>
            <div className="flex items-center gap-2 mt-1">
              <div
                className="rounded-full overflow-hidden"
                style={{ width: 120, height: 4, background: '#F0EDF8' }}
              >
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${pct}%`,
                    background: allDone
                      ? '#16a34a'
                      : 'linear-gradient(90deg, #7c3aed, #b5f23d)',
                  }}
                />
              </div>
              <span className="text-[11px]" style={{ color: '#a0a0b8' }}>
                {pct}% complété
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={e => { e.stopPropagation(); setCollapsed(c => !c) }}
            className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors"
            style={{ color: '#a0a0b8' }}
            aria-label={collapsed ? 'Ouvrir' : 'Réduire'}
          >
            {collapsed ? <ChevronDown size={15} /> : <ChevronUp size={15} />}
          </button>
          <button
            onClick={e => { e.stopPropagation(); dismiss() }}
            className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors"
            style={{ color: '#a0a0b8' }}
            title="Masquer le guide"
            aria-label="Fermer le guide"
            onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = '#fff0f0')}
            onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = 'transparent')}
          >
            <X size={14} />
          </button>
        </div>
      </div>

      {/* ── Steps ── */}
      {!collapsed && (
        <div>
          {steps.map((step, i) => (
            <div
              key={step.id}
              className="flex items-start gap-4 px-5 py-4"
              style={{
                borderBottom: i < steps.length - 1 ? '1px solid #f5f4fa' : 'none',
                opacity: step.done ? 0.6 : 1,
              }}
            >
              {/* Icône check */}
              <div className="flex-shrink-0 mt-0.5">
                {step.done ? (
                  <CheckCircle2 size={20} color="#16a34a" strokeWidth={2} />
                ) : (
                  <Circle size={20} color="#d0cde8" strokeWidth={1.8} />
                )}
              </div>

              {/* Contenu */}
              <div className="flex-1 min-w-0">
                <div
                  className="text-[13px] font-bold mb-0.5"
                  style={{
                    color: step.done ? '#6b6b84' : '#0f0f1e',
                    textDecoration: step.done ? 'line-through' : 'none',
                  }}
                >
                  {step.label}
                </div>
                {!step.done && (
                  <p className="text-[12px] mb-2" style={{ color: '#8b8ba0', lineHeight: 1.4 }}>
                    {step.desc}
                  </p>
                )}
              </div>

              {/* CTA */}
              {!step.done && (
                <Link
                  href={step.href}
                  className="flex-shrink-0 px-3 py-1.5 rounded-lg text-[12px] font-bold transition-all"
                  style={{
                    background: '#f3f0ff',
                    color: '#7c3aed',
                    whiteSpace: 'nowrap',
                  }}
                  onMouseEnter={e => {
                    ;(e.currentTarget as HTMLElement).style.background = '#7c3aed'
                    ;(e.currentTarget as HTMLElement).style.color = '#ffffff'
                  }}
                  onMouseLeave={e => {
                    ;(e.currentTarget as HTMLElement).style.background = '#f3f0ff'
                    ;(e.currentTarget as HTMLElement).style.color = '#7c3aed'
                  }}
                >
                  {step.cta}
                </Link>
              )}

              {step.done && (
                <span className="flex-shrink-0 text-[12px] font-semibold" style={{ color: '#16a34a' }}>
                  Fait ✓
                </span>
              )}
            </div>
          ))}

          {/* Footer si tout est fait */}
          {allDone && (
            <div
              className="px-5 py-4 flex items-center justify-between"
              style={{ background: '#f0fdf4', borderTop: '1px solid #dcfce7' }}
            >
              <div>
                <div className="text-[13px] font-black" style={{ color: '#15803d' }}>
                  Tu es prêt à scaler ! 🚀
                </div>
                <div className="text-[12px] mt-0.5" style={{ color: '#16a34a' }}>
                  Toutes les étapes sont complétées. Continue à créer des pages.
                </div>
              </div>
              <button
                onClick={dismiss}
                className="px-4 py-1.5 rounded-lg text-[12px] font-bold transition-all"
                style={{ background: '#16a34a', color: '#ffffff' }}
              >
                Fermer →
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
