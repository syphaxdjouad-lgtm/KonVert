import Link from 'next/link'
import { CheckCircle } from 'lucide-react'

export default function SuccessPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-green-600" />
        </div>
        <h1 className="text-3xl font-black text-gray-900 mb-3">Bienvenue sur KONVERT !</h1>
        <p className="text-gray-500 mb-8">
          Ton abonnement est actif. Tu peux maintenant créer tes premières landing pages.
        </p>
        <Link
          href="/dashboard/new"
          className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-xl transition-colors"
        >
          Créer ma première page →
        </Link>
      </div>
    </div>
  )
}
