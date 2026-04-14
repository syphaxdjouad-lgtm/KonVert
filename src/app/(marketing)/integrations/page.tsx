import Link from 'next/link'
import { ArrowRight, Check, Clock, ShoppingBag, Store, Bot, CreditCard, Package, Zap, BarChart2 } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

export const metadata = { title: 'Intégrations — Konvert' }

const INTEGRATIONS: { name: string; desc: string; status: string; Icon: LucideIcon; color: string; bg: string; href: string | null }[] = [
  {
    name: 'Shopify',
    desc: 'Connectez votre boutique Shopify en un clic. Importez vos produits et publiez directement.',
    status: 'available',
    Icon: ShoppingBag,
    color: '#96BF48',
    bg: 'rgba(150,191,72,0.1)',
    href: '/dashboard/stores',
  },
  {
    name: 'WooCommerce',
    desc: 'Reliez votre boutique WooCommerce via l\'API REST. Compatible avec toutes les versions.',
    status: 'available',
    Icon: Store,
    color: '#7F54B3',
    bg: 'rgba(127,84,179,0.1)',
    href: '/dashboard/stores',
  },
  {
    name: 'Claude AI',
    desc: 'Génération automatique de copy optimisé conversion via Claude Sonnet (Anthropic).',
    status: 'available',
    Icon: Bot,
    color: '#5B47F5',
    bg: 'rgba(91,71,245,0.1)',
    href: '/features',
  },
  {
    name: 'Stripe',
    desc: 'Gestion des abonnements, paiements sécurisés, facturation automatique.',
    status: 'available',
    Icon: CreditCard,
    color: '#635BFF',
    bg: 'rgba(99,91,255,0.1)',
    href: '/pricing',
  },
  {
    name: 'PrestaShop',
    desc: 'Intégration native PrestaShop — import produits et publication directe.',
    status: 'coming',
    Icon: Package,
    color: '#DF0067',
    bg: 'rgba(223,0,103,0.08)',
    href: null,
  },
  {
    name: 'BigCommerce',
    desc: 'Connectez votre boutique BigCommerce et gérez vos landing pages depuis Konvert.',
    status: 'coming',
    Icon: Package,
    color: '#34313F',
    bg: 'rgba(52,49,63,0.08)',
    href: null,
  },
  {
    name: 'Zapier / Make',
    desc: 'Automatisez vos workflows — déclenchez des actions sur chaque publication de page.',
    status: 'coming',
    Icon: Zap,
    color: '#FF4F00',
    bg: 'rgba(255,79,0,0.08)',
    href: null,
  },
  {
    name: 'Google Analytics',
    desc: 'Suivez les performances de vos pages directement dans GA4.',
    status: 'coming',
    Icon: BarChart2,
    color: '#E37400',
    bg: 'rgba(227,116,0,0.08)',
    href: null,
  },
]

export default function IntegrationsPage() {
  const available = INTEGRATIONS.filter(i => i.status === 'available')
  const coming = INTEGRATIONS.filter(i => i.status === 'coming')

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="pt-32 pb-16" style={{ background: 'linear-gradient(135deg, #f8f7ff, #ffffff)' }}>
        <div className="max-w-4xl mx-auto px-5 sm:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold mb-7 border"
               style={{ background: 'rgba(91,71,245,0.08)', borderColor: 'rgba(91,71,245,0.2)', color: '#5B47F5' }}>
            Intégrations
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-gray-900 mb-4">Connectez vos outils</h1>
          <p className="text-lg text-gray-500">Konvert s'intègre avec les plateformes que vous utilisez déjà.</p>
        </div>
      </section>

      {/* Disponibles */}
      <section className="py-16">
        <div className="max-w-5xl mx-auto px-5 sm:px-8">
          <div className="flex items-center gap-3 mb-8">
            <p className="text-xs font-bold uppercase tracking-widest text-[#5B47F5]">Disponibles maintenant</p>
            <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 font-semibold">{available.length} intégrations</span>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {available.map((integ) => (
              <div key={integ.name} className="p-5 rounded-2xl border border-gray-100 hover:border-[#5B47F5]/30 hover:shadow-md transition-all">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{ background: integ.bg }}><integ.Icon className="w-5 h-5" style={{ color: integ.color }} /></div>
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-bold text-gray-900">{integ.name}</h3>
                  <span className="inline-flex items-center gap-1 text-xs text-emerald-600 font-semibold">
                    <Check className="w-3 h-3" /> Actif
                  </span>
                </div>
                <p className="text-xs text-gray-500 mb-4">{integ.desc}</p>
                {integ.href && (
                  <Link href={integ.href} className="text-xs font-semibold text-[#5B47F5] flex items-center gap-1 hover:gap-2 transition-all">
                    Configurer <ArrowRight className="w-3 h-3" />
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bientôt */}
      <section className="py-16 bg-gray-50 border-t border-gray-100">
        <div className="max-w-5xl mx-auto px-5 sm:px-8">
          <div className="flex items-center gap-3 mb-8">
            <p className="text-xs font-bold uppercase tracking-widest text-gray-400">Bientôt disponibles</p>
            <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-500 font-semibold">{coming.length} intégrations</span>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {coming.map((integ) => (
              <div key={integ.name} className="p-5 rounded-2xl border border-dashed border-gray-200 opacity-70">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{ background: integ.bg }}><integ.Icon className="w-5 h-5" style={{ color: integ.color }} /></div>
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-bold text-gray-700">{integ.name}</h3>
                  <span className="inline-flex items-center gap-1 text-xs text-amber-600 font-semibold">
                    <Clock className="w-3 h-3" /> Bientôt
                  </span>
                </div>
                <p className="text-xs text-gray-400">{integ.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="max-w-xl mx-auto px-5 sm:px-8 text-center mt-14">
          <p className="text-sm text-gray-500 mb-4">Une intégration manquante ?</p>
          <Link href="/contact?subject=Intégration"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-white transition-all hover:scale-105"
                style={{ background: 'linear-gradient(135deg, #5B47F5, #7c6af7)' }}>
            Suggérer une intégration
          </Link>
        </div>
      </section>
    </div>
  )
}
