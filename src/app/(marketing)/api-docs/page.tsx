import Link from 'next/link'
import { Code, Lock, Zap, ArrowRight } from 'lucide-react'

export const metadata = { title: 'API — Konvert' }

export default function ApiDocsPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="pt-32 pb-16" style={{ background: 'linear-gradient(135deg, #08080f, #0f0f2e)' }}>
        <div className="max-w-3xl mx-auto px-5 sm:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold mb-7 border"
               style={{ background: 'rgba(91,71,245,0.15)', borderColor: 'rgba(91,71,245,0.3)', color: '#a78bfa' }}>
            <Code className="w-3.5 h-3.5" />
            API Konvert
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-white mb-4">API Développeurs</h1>
          <p className="text-lg mb-8" style={{ color: '#8b8baa' }}>
            Intégrez la génération de landing pages directement dans vos outils et workflows.
          </p>
          <div className="inline-block px-4 py-2 rounded-xl text-sm font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30">
            API disponible sur les plans Agency & Enterprise
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-5 sm:px-8">
          <div className="grid sm:grid-cols-3 gap-6 mb-16">
            {[
              { icon: Zap, title: 'REST API simple', desc: 'Endpoints REST JSON. Authentification par Bearer token. Réponse en < 2s.' },
              { icon: Lock, title: 'Sécurisé', desc: 'HTTPS uniquement. Tokens API révocables depuis le dashboard. Rate limiting inclus.' },
              { icon: Code, title: 'Webhooks', desc: 'Recevez des événements en temps réel sur vos URLs — publication, mise à jour, erreur.' },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="p-6 rounded-2xl border border-gray-100">
                <div className="w-10 h-10 rounded-xl bg-[#5B47F5]/10 flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5 text-[#5B47F5]" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{title}</h3>
                <p className="text-sm text-gray-500">{desc}</p>
              </div>
            ))}
          </div>

          {/* Aperçu endpoint */}
          <div className="rounded-2xl overflow-hidden border border-gray-100">
            <div className="px-5 py-3 bg-gray-900 flex items-center gap-2">
              <span className="text-xs font-mono text-emerald-400">POST</span>
              <span className="text-xs font-mono text-gray-300">/api/v1/pages/generate</span>
              <span className="ml-auto text-xs text-gray-500">Exemple</span>
            </div>
            <pre className="p-5 bg-gray-950 text-xs font-mono text-gray-300 overflow-x-auto leading-relaxed">{`{
  "product_url": "https://aliexpress.com/item/...",
  "template": "minimal-dark",
  "lang": "fr",
  "store_id": "store_xxxx"
}`}</pre>
          </div>
        </div>
      </section>

      {/* Coming soon */}
      <section className="py-16 bg-gray-50 border-t border-gray-100">
        <div className="max-w-2xl mx-auto px-5 sm:px-8 text-center">
          <div className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-700 mb-4">En cours de développement</div>
          <h2 className="text-2xl font-black text-gray-900 mb-3">Documentation complète bientôt</h2>
          <p className="text-gray-500 mb-8">La documentation interactive avec tous les endpoints, exemples de code et sandbox sera disponible prochainement.</p>
          <div className="flex gap-3 justify-center flex-wrap">
            <Link href="/pricing"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-white transition-all hover:scale-105"
                  style={{ background: 'linear-gradient(135deg, #5B47F5, #7c6af7)' }}>
              Voir le plan Agency
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/contact?subject=API"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold border border-gray-200 text-gray-700 hover:border-[#5B47F5]/40 transition-colors">
              Contacter l'équipe
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
