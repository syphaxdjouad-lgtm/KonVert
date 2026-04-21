'use client'

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md text-center">
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-6"
             style={{ background: 'rgba(239,68,68,0.1)' }}>
          <span className="text-2xl">!</span>
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Une erreur est survenue</h2>
        <p className="text-sm text-gray-500 mb-6">
          {error.message || 'Quelque chose ne s\'est pas passe comme prevu. Veuillez reessayer.'}
        </p>
        <button
          onClick={reset}
          className="px-6 py-3 rounded-xl text-sm font-bold text-white"
          style={{ background: '#5B47F5' }}
        >
          Reessayer
        </button>
      </div>
    </div>
  )
}
