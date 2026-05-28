'use client'

import { motion } from 'framer-motion'

function XPageMockup() {
  return (
    <div
      className="rounded-xl border border-gray-200 overflow-hidden shadow-sm"
      style={{ fontFamily: 'system-ui, sans-serif' }}
      aria-label="Exemple de page générée par xPage"
    >
      <div className="flex items-center gap-1.5 px-3 py-2 bg-gray-100 border-b border-gray-200">
        <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
        <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
        <span className="w-2.5 h-2.5 rounded-full bg-green-400" />
        <span className="flex-1 mx-2 h-5 rounded bg-white border border-gray-200 text-[9px] text-gray-400 flex items-center px-2 overflow-hidden">
          xpage.ai/generated-page
        </span>
      </div>

      <div className="bg-white p-4 space-y-3">
        <div className="flex items-center justify-between pb-3 border-b border-gray-100">
          <div className="w-16 h-3 bg-gray-200 rounded" />
          <div className="flex gap-2">
            <div className="w-10 h-3 bg-gray-100 rounded" />
            <div className="w-10 h-3 bg-gray-100 rounded" />
            <div className="w-14 h-3 bg-gray-200 rounded" />
          </div>
        </div>

        <div className="flex gap-3">
          <div className="w-28 h-28 bg-gray-100 rounded flex-shrink-0 flex items-center justify-center">
            <svg className="w-8 h-8 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <rect x="3" y="3" width="18" height="18" rx="2" strokeWidth={1.5} />
              <circle cx="8.5" cy="8.5" r="1.5" strokeWidth={1.5} />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 15l-5-5L5 21" />
            </svg>
          </div>
          <div className="flex-1 space-y-2">
            <div className="w-full h-3 bg-gray-200 rounded" />
            <div className="w-3/4 h-3 bg-gray-200 rounded" />
            <div className="w-1/2 h-2 bg-gray-100 rounded mt-1" />
            <div className="w-2/3 h-2 bg-gray-100 rounded" />
            <div className="w-3/4 h-2 bg-gray-100 rounded" />
            <div className="w-20 h-6 bg-gray-300 rounded mt-2" />
          </div>
        </div>

        <div className="space-y-1.5 pt-1">
          <div className="w-1/3 h-2.5 bg-gray-200 rounded" />
          <div className="w-full h-2 bg-gray-100 rounded" />
          <div className="w-full h-2 bg-gray-100 rounded" />
          <div className="w-5/6 h-2 bg-gray-100 rounded" />
          <div className="w-full h-2 bg-gray-100 rounded" />
          <div className="w-4/5 h-2 bg-gray-100 rounded" />
        </div>

        <div className="border border-dashed border-gray-200 rounded-lg p-3 text-center">
          <p className="text-[9px] text-gray-300">— Pas de témoignages —</p>
        </div>
        <div className="border border-dashed border-gray-200 rounded-lg p-3 text-center">
          <p className="text-[9px] text-gray-300">— Pas de section garantie —</p>
        </div>
      </div>
    </div>
  )
}

function KonvertMockup() {
  return (
    <div
      className="rounded-xl border border-[#5B47F5]/20 overflow-hidden shadow-md"
      style={{ fontFamily: 'system-ui, sans-serif' }}
      aria-label="Exemple de page générée par Konvert"
    >
      <div className="flex items-center gap-1.5 px-3 py-2 bg-gray-100 border-b border-gray-200">
        <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
        <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
        <span className="w-2.5 h-2.5 rounded-full bg-green-400" />
        <span className="flex-1 mx-2 h-5 rounded bg-white border border-gray-200 text-[9px] text-gray-400 flex items-center px-2 overflow-hidden">
          votre-boutique.myshopify.com/products/...
        </span>
      </div>

      <div className="bg-white p-4 space-y-3">
        <div className="flex items-center justify-between pb-3 border-b border-gray-100">
          <div className="flex items-center gap-1.5">
            <div className="w-5 h-5 rounded bg-[#5B47F5]" />
            <div className="w-20 h-3 bg-gray-800 rounded" />
          </div>
          <div className="flex gap-2">
            <div className="w-10 h-3 bg-gray-100 rounded" />
            <div className="w-14 h-5 bg-[#5B47F5] rounded-full" />
          </div>
        </div>

        <div className="flex gap-3">
          <div className="w-28 h-28 rounded-lg flex-shrink-0 overflow-hidden relative bg-gradient-to-br from-[#5B47F5]/10 to-[#7c6af7]/10 flex items-center justify-center">
            <svg className="w-10 h-10 text-[#5B47F5]/40" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2a10 10 0 100 20A10 10 0 0012 2zm0 18a8 8 0 110-16 8 8 0 010 16zm-1-11h2v6h-2zm0-4h2v2h-2z" />
            </svg>
            <span
              className="absolute top-1.5 right-1.5 text-[8px] font-bold px-1.5 py-0.5 rounded-full"
              style={{ background: '#b5f23d', color: '#1a1a1a' }}
            >
              -47%
            </span>
          </div>
          <div className="flex-1 space-y-1.5">
            <div className="w-full h-3.5 bg-gray-900 rounded" />
            <div className="w-3/4 h-3.5 bg-gray-700 rounded" />
            <div className="flex gap-1 mt-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="w-2.5 h-2.5 rounded-sm bg-[#5B47F5]" />
              ))}
              <div className="w-12 h-2.5 bg-gray-200 rounded-sm" />
            </div>
            <div className="flex items-baseline gap-1.5">
              <div className="w-12 h-4 bg-[#5B47F5] rounded" />
              <div className="w-8 h-3 bg-gray-200 rounded" />
            </div>
            <div className="flex gap-1.5 mt-1">
              <div className="flex-1 h-6 bg-[#5B47F5] rounded-full" />
              <div className="w-20 h-6 bg-gray-100 rounded-full border border-gray-200" />
            </div>
          </div>
        </div>

        <div className="bg-[#5B47F5]/5 rounded-lg p-2.5 space-y-1.5">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-sm bg-[#5B47F5]" />
            <div className="w-24 h-2 bg-[#5B47F5] rounded" />
          </div>
          <div className="w-full h-2 bg-gray-200 rounded" />
          <div className="w-11/12 h-2 bg-gray-200 rounded" />
          <div className="w-4/5 h-2 bg-gray-200 rounded" />
        </div>

        <div className="space-y-1.5">
          <div className="w-28 h-2.5 bg-gray-800 rounded" />
          <div className="grid grid-cols-2 gap-1.5">
            {[0, 1].map((i) => (
              <div key={i} className="bg-gray-50 rounded p-2 space-y-1 border border-gray-100">
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <div key={j} className="w-2 h-2 bg-amber-400 rounded-sm" />
                  ))}
                </div>
                <div className="w-full h-1.5 bg-gray-200 rounded" />
                <div className="w-3/4 h-1.5 bg-gray-200 rounded" />
                <div className="w-1/2 h-1.5 bg-gray-300 rounded" />
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2 bg-emerald-50 rounded-lg p-2 border border-emerald-100">
          <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
            <svg className="w-3.5 h-3.5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <div className="space-y-0.5">
            <div className="w-24 h-2 bg-emerald-600 rounded" />
            <div className="w-32 h-1.5 bg-emerald-300 rounded" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default function SideBySideMockup() {
  return (
    <div className="grid md:grid-cols-2 gap-6 lg:gap-10 items-start">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="mb-3 flex items-center justify-between">
          <div>
            <p className="text-sm font-bold text-gray-400">xPage</p>
            <p className="text-xs text-gray-300 mt-0.5">Template mapping — copy générique</p>
          </div>
          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full bg-red-50 text-red-500">
            <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
            </svg>
            Trustpilot 2.7/5
          </span>
        </div>
        <XPageMockup />
        <div className="mt-3 space-y-1.5">
          {['Copy générique mappé depuis le template', 'Aucune section enrichie disponible', 'Rendu mobile non garanti'].map((item) => (
            <div key={item} className="flex items-center gap-2">
              <svg className="w-3.5 h-3.5 text-red-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
              <span className="text-xs text-gray-500">{item}</span>
            </div>
          ))}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="mb-3 flex items-center justify-between">
          <div>
            <p className="text-sm font-black text-gray-900">KONVERT</p>
            <p className="text-xs text-gray-400 mt-0.5">Génération copy unique — 6 sections enrichies</p>
          </div>
          <span
            className="inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full"
            style={{ background: '#b5f23d', color: '#1a1a1a' }}
          >
            <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
            Recommandé
          </span>
        </div>
        <KonvertMockup />
        <div className="mt-3 space-y-1.5">
          {['Copy unique générée par DeepSeek avec frameworks conversion', 'Témoignages, garantie, story, bonus — tout inclus', 'Mobile-first responsive — parfait sur tous les écrans'].map((item) => (
            <div key={item} className="flex items-center gap-2">
              <svg className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-xs text-gray-600">{item}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
