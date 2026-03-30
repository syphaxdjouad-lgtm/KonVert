import Link from 'next/link'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-white px-4">
      <div className="text-center max-w-2xl">
        <div className="inline-flex items-center gap-2 bg-purple-50 border border-purple-200 rounded-full px-4 py-1.5 text-sm font-semibold text-purple-700 mb-8">
          <span className="w-2 h-2 bg-purple-600 rounded-full animate-pulse" />
          En construction
        </div>

        <h1 className="text-5xl font-black tracking-tight text-gray-900 mb-4">
          KON<span className="text-purple-600">VERT</span>
        </h1>

        <p className="text-xl text-gray-500 mb-10">
          Génère des landing pages e-commerce haute conversion par IA.<br />
          Colle une URL produit — ta page est prête en 30 secondes.
        </p>

        <div className="flex gap-4 justify-center">
          <Link
            href="/signup"
            className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-8 py-3 rounded-lg transition-colors"
          >
            Commencer gratuitement
          </Link>
          <Link
            href="/pricing"
            className="border border-gray-200 hover:border-gray-300 text-gray-700 font-semibold px-8 py-3 rounded-lg transition-colors"
          >
            Voir les prix
          </Link>
        </div>

        <div className="mt-16 grid grid-cols-3 gap-8 border-t border-gray-100 pt-10">
          <div className="text-center">
            <div className="text-2xl font-black text-gray-900">30s</div>
            <div className="text-sm text-gray-400 mt-1">Page générée</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-black text-gray-900">5</div>
            <div className="text-sm text-gray-400 mt-1">Templates pro</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-black text-gray-900">1-clic</div>
            <div className="text-sm text-gray-400 mt-1">Push Shopify</div>
          </div>
        </div>
      </div>
    </main>
  )
}
