'use client'

export default function MarketingError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="max-w-md text-center">
        <h2 className="text-2xl font-black text-gray-900 mb-3">Oups, une erreur</h2>
        <p className="text-sm text-gray-500 mb-6">
          {error.message || 'Quelque chose ne s\'est pas passe comme prevu.'}
        </p>
        <button
          onClick={reset}
          className="px-6 py-3 rounded-full text-sm font-bold text-white"
          style={{ background: 'linear-gradient(135deg, #5B47F5, #7c6af7)' }}
        >
          Reessayer
        </button>
      </div>
    </div>
  )
}
