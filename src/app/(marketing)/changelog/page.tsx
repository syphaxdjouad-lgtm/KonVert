import Link from 'next/link'
import { Sparkles, Zap, Shield, Globe } from 'lucide-react'

export const metadata = { title: 'Changelog — Konvert' }

const VERSIONS = [
  {
    version: 'v1.2.0',
    date: 'Avril 2026',
    badge: 'Dernière version',
    badgeColor: 'bg-[#5B47F5]/10 text-[#5B47F5]',
    changes: [
      { type: 'new', text: 'Wizard de création de page en 8 étapes' },
      { type: 'new', text: 'Intégration WooCommerce REST API' },
      { type: 'new', text: 'Dashboard analytics avec métriques de performance' },
      { type: 'improved', text: 'Génération IA plus rapide via Claude Sonnet' },
      { type: 'improved', text: 'Templates optimisés mobile-first' },
      { type: 'fix', text: 'Correction du comportement de la Navbar au scroll' },
    ],
  },
  {
    version: 'v1.1.0',
    date: 'Mars 2026',
    badge: null,
    badgeColor: '',
    changes: [
      { type: 'new', text: 'Connexion Shopify OAuth 2.0' },
      { type: 'new', text: '17 templates produits haute conversion' },
      { type: 'new', text: 'Scraper AliExpress / Amazon / Alibaba' },
      { type: 'improved', text: 'Interface de démo interactive' },
    ],
  },
  {
    version: 'v1.0.0',
    date: 'Février 2026',
    badge: 'Lancement',
    badgeColor: 'bg-emerald-100 text-emerald-700',
    changes: [
      { type: 'new', text: 'Lancement public de Konvert' },
      { type: 'new', text: 'Génération de landing pages par URL produit' },
      { type: 'new', text: 'Authentification et gestion de compte' },
      { type: 'new', text: 'Plans Starter, Pro, Agency, Enterprise' },
    ],
  },
]

const TYPE_STYLES: Record<string, string> = {
  new: 'bg-[#5B47F5]/10 text-[#5B47F5]',
  improved: 'bg-amber-100 text-amber-700',
  fix: 'bg-red-100 text-red-600',
}

const TYPE_LABELS: Record<string, string> = {
  new: 'Nouveau',
  improved: 'Amélioré',
  fix: 'Corrigé',
}

export default function ChangelogPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="pt-32 pb-16 border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-5 sm:px-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold mb-7 border"
               style={{ background: 'rgba(91,71,245,0.08)', borderColor: 'rgba(91,71,245,0.2)', color: '#5B47F5' }}>
            <Sparkles className="w-3.5 h-3.5" />
            Changelog
          </div>
          <h1 className="text-4xl font-black text-gray-900 mb-4">Nouveautés Konvert</h1>
          <p className="text-lg text-gray-500">Toutes les mises à jour, améliorations et corrections de la plateforme.</p>
        </div>
      </section>

      {/* Versions */}
      <div className="max-w-3xl mx-auto px-5 sm:px-8 py-16 space-y-14">
        {VERSIONS.map((v) => (
          <div key={v.version} className="relative pl-8 border-l-2 border-gray-100">
            <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-[#5B47F5] border-4 border-white shadow-sm" />
            <div className="flex items-center gap-3 mb-4">
              <span className="text-xl font-black text-gray-900">{v.version}</span>
              {v.badge && (
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${v.badgeColor}`}>{v.badge}</span>
              )}
              <span className="text-sm text-gray-400 ml-auto">{v.date}</span>
            </div>
            <ul className="space-y-2.5">
              {v.changes.map((c, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-md mt-0.5 flex-shrink-0 ${TYPE_STYLES[c.type]}`}>
                    {TYPE_LABELS[c.type]}
                  </span>
                  <span className="text-sm text-gray-700">{c.text}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* CTA */}
      <section className="py-16 bg-gray-50 border-t border-gray-100">
        <div className="max-w-xl mx-auto px-5 sm:px-8 text-center">
          <p className="text-sm text-gray-500 mb-4">Une fonctionnalité manquante ? Dites-le nous.</p>
          <Link href="/contact"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-white transition-all hover:scale-105"
                style={{ background: 'linear-gradient(135deg, #5B47F5, #7c6af7)' }}>
            Suggérer une fonctionnalité
          </Link>
        </div>
      </section>
    </div>
  )
}
