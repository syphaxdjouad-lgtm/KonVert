import Link from 'next/link'
import { Sparkles } from 'lucide-react'

export default function NotFound() {
  return (
    <main
      className="min-h-screen flex items-center justify-center px-6 py-24"
      style={{ background: '#08080f' }}
    >
      <div className="text-center max-w-lg mx-auto">
        {/* Illustration */}
        <div className="relative mx-auto mb-8 w-32 h-32">
          <div
            className="absolute inset-0 rounded-full opacity-20 blur-2xl"
            style={{ background: '#5B47F5' }}
          />
          <div
            className="relative w-32 h-32 rounded-full flex items-center justify-center border"
            style={{ background: '#13131f', borderColor: '#ffffff10' }}
          >
            <span className="text-5xl">🧭</span>
          </div>
        </div>

        {/* Code */}
        <p
          className="text-sm font-bold tracking-widest uppercase mb-3"
          style={{ color: '#5B47F5' }}
        >
          Erreur 404
        </p>

        {/* Titre */}
        <h1 className="text-3xl sm:text-4xl font-black text-white mb-4 leading-tight">
          Cette page s&apos;est perdue
          <br />
          <span style={{ color: '#5B47F5' }}>dans la conversion</span>
        </h1>

        <p className="text-white/50 text-base mb-10">
          On a cherché partout, mais cette URL n&apos;existe pas (ou plus).
          Pas de panique — voilà quelques raccourcis utiles.
        </p>

        {/* Bouton principal */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-bold text-white text-sm transition-all hover:opacity-90 active:scale-95 mb-8"
          style={{ background: 'linear-gradient(135deg, #5B47F5, #7c6af7)' }}
        >
          <Sparkles className="w-4 h-4" />
          Retour à l&apos;accueil
        </Link>

        {/* Pages suggérées */}
        <div
          className="rounded-2xl border p-5"
          style={{ background: '#13131f', borderColor: '#ffffff08' }}
        >
          <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: '#5B47F5' }}>
            Pages populaires
          </p>
          <div className="grid grid-cols-2 gap-2">
            {[
              { label: 'Templates', href: '/templates' },
              { label: 'Tarifs', href: '/pricing' },
              { label: 'Fonctionnalités', href: '/features' },
              { label: 'Changelog', href: '/changelog' },
            ].map(({ label, href }) => (
              <Link
                key={href}
                href={href}
                className="flex items-center justify-center px-3 py-2.5 rounded-xl text-sm font-medium transition-all hover:bg-white/10"
                style={{ color: '#a0a0c0', border: '1px solid #ffffff0a' }}
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}
