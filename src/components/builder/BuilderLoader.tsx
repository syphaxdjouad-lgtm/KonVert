'use client'

import dynamic from 'next/dynamic'
import type { LandingPageData } from '@/types'

// GrapesJS DOIT être importé en client-side uniquement — pas de SSR
const GrapesEditor = dynamic(() => import('./GrapesEditor'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-full bg-gray-50">
      <div className="text-center">
        <div className="w-8 h-8 border-2 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-sm text-gray-400 font-medium">Chargement du builder...</p>
      </div>
    </div>
  ),
})

interface Props {
  html: string
  onSave?: (html: string, json: object) => void
}

export default function BuilderLoader({ html, onSave }: Props) {
  return <GrapesEditor html={html} onSave={onSave} />
}
