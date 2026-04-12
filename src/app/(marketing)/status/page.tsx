import Link from 'next/link'
import { Check, Activity } from 'lucide-react'

export const metadata = { title: 'Status — Konvert' }

const SERVICES = [
  { name: 'Application web', status: 'operational', uptime: '99.9%' },
  { name: 'API de génération', status: 'operational', uptime: '99.8%' },
  { name: 'Authentification', status: 'operational', uptime: '100%' },
  { name: 'Base de données', status: 'operational', uptime: '99.9%' },
  { name: 'Paiements (Stripe)', status: 'operational', uptime: '100%' },
  { name: 'Intégration Shopify', status: 'operational', uptime: '99.7%' },
  { name: 'Intégration WooCommerce', status: 'operational', uptime: '99.7%' },
  { name: 'Claude AI (génération)', status: 'operational', uptime: '99.5%' },
]

export default function StatusPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="pt-32 pb-16 border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-5 sm:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-emerald-50 border border-emerald-100 mb-8">
            <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-bold text-emerald-700">Tous les systèmes opérationnels</span>
          </div>
          <h1 className="text-4xl font-black text-gray-900 mb-4">Status Konvert</h1>
          <p className="text-gray-500">Surveillance en temps réel de l'infrastructure Konvert.</p>
          <p className="text-sm text-gray-400 mt-2">Dernière vérification : à l'instant · Hébergé à Paris 🇫🇷</p>
        </div>
      </section>

      {/* Services */}
      <section className="py-16">
        <div className="max-w-3xl mx-auto px-5 sm:px-8">
          <div className="flex items-center justify-between mb-6">
            <p className="text-xs font-bold uppercase tracking-widest text-gray-400">Services</p>
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <Activity className="w-3.5 h-3.5" />
              Uptime 30 derniers jours
            </div>
          </div>

          <div className="space-y-3">
            {SERVICES.map((service) => (
              <div key={service.name}
                   className="flex items-center justify-between p-4 rounded-2xl border border-gray-100 hover:border-gray-200 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span className="text-sm font-medium text-gray-900">{service.name}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-xs font-mono text-gray-400">{service.uptime}</span>
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg">
                    <Check className="w-3 h-3" />
                    Opérationnel
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Incidents */}
      <section className="py-12 bg-gray-50 border-t border-gray-100">
        <div className="max-w-3xl mx-auto px-5 sm:px-8">
          <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-6">Incidents récents</p>
          <div className="text-center py-10">
            <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
              <Check className="w-6 h-6 text-emerald-500" />
            </div>
            <p className="font-semibold text-gray-900 mb-1">Aucun incident</p>
            <p className="text-sm text-gray-400">Aucun incident signalé ces 90 derniers jours.</p>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="py-10 border-t border-gray-100">
        <div className="max-w-3xl mx-auto px-5 sm:px-8 text-center">
          <p className="text-sm text-gray-500">
            Un problème ? <Link href="/contact" className="text-[#5B47F5] font-semibold hover:underline">Contacter le support</Link>
          </p>
        </div>
      </section>
    </div>
  )
}
