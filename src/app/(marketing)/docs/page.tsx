import Link from 'next/link'
import { BookOpen, Zap, Globe, Code, ArrowRight } from 'lucide-react'

export const metadata = { title: 'Documentation — Konvert' }

const GUIDES = [
  {
    icon: Zap,
    title: 'Démarrer en 5 minutes',
    desc: 'Connectez votre boutique et créez votre première landing page.',
    href: '/demo',
    cta: 'Voir la démo',
  },
  {
    icon: Globe,
    title: 'Connecter Shopify',
    desc: 'Reliez votre boutique Shopify en un clic via OAuth.',
    href: '/dashboard/stores',
    cta: 'Connecter',
  },
  {
    icon: Code,
    title: 'Intégrer WooCommerce',
    desc: 'Ajoutez votre boutique WooCommerce avec votre clé API.',
    href: '/dashboard/stores',
    cta: 'Connecter',
  },
  {
    icon: BookOpen,
    title: 'Guide des templates',
    desc: 'Découvrez nos 42 templates produits et leurs cas d\'usage.',
    href: '/templates',
    cta: 'Voir les templates',
  },
]

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="pt-32 pb-16" style={{ background: 'linear-gradient(135deg, #f8f7ff, #ffffff)' }}>
        <div className="max-w-4xl mx-auto px-5 sm:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold mb-7 border"
               style={{ background: 'rgba(91,71,245,0.08)', borderColor: 'rgba(91,71,245,0.2)', color: '#5B47F5' }}>
            <BookOpen className="w-3.5 h-3.5" />
            Documentation
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-gray-900 mb-4">Centre d'aide Konvert</h1>
          <p className="text-lg text-gray-500 mb-8">Tout ce dont vous avez besoin pour maîtriser Konvert.</p>
          <Link href="/contact"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white"
                style={{ background: '#5B47F5' }}>
            Contacter le support
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Guides */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-5 sm:px-8">
          <p className="text-xs font-bold uppercase tracking-widest text-[#5B47F5] mb-8">Guides de démarrage</p>
          <div className="grid sm:grid-cols-2 gap-6">
            {GUIDES.map(({ icon: Icon, title, desc, href, cta }) => (
              <Link key={title} href={href}
                    className="group p-6 rounded-2xl border border-gray-100 hover:border-[#5B47F5]/30 hover:shadow-lg hover:shadow-[#5B47F5]/8 transition-all">
                <div className="w-10 h-10 rounded-xl bg-[#5B47F5]/10 flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5 text-[#5B47F5]" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{title}</h3>
                <p className="text-sm text-gray-500 mb-4">{desc}</p>
                <span className="text-sm font-semibold text-[#5B47F5] flex items-center gap-1 group-hover:gap-2 transition-all">
                  {cta} <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Documentation complète — coming soon */}
      <section className="py-16 bg-gray-50 border-t border-gray-100">
        <div className="max-w-2xl mx-auto px-5 sm:px-8 text-center">
          <div className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-700 mb-4">Bientôt disponible</div>
          <h2 className="text-2xl font-black text-gray-900 mb-3">Documentation technique complète</h2>
          <p className="text-gray-500 mb-6">Références API, webhooks, guides d'intégration avancée — en cours de rédaction.</p>
          <Link href="/contact?subject=Documentation"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold border border-[#5B47F5] text-[#5B47F5] hover:bg-[#5B47F5]/5 transition-colors">
            Être notifié à la sortie
          </Link>
        </div>
      </section>
    </div>
  )
}
