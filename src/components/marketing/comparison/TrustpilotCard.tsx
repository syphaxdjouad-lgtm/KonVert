'use client'

import { motion } from 'framer-motion'
import { Star, ExternalLink } from 'lucide-react'

const XPAGE_QUOTES = [
  {
    text: "Les bugs sont documentés et les problèmes mobiles non corrigés depuis des semaines. Le support ne répond pas.",
    rating: 1,
    author: "Utilisateur vérifié",
    source: "Trustpilot",
  },
  {
    text: "L'IA est principalement de l'automatisation de mise en page — elle ne génère pas de copy unique. Décevant par rapport à ce qui est annoncé.",
    rating: 2,
    author: "Dropshipper FR",
    source: "Trustpilot",
  },
  {
    text: "Le rendu sur mobile est cassé sur certains templates. Support très lent à répondre.",
    rating: 2,
    author: "E-commerçant",
    source: "Trustpilot",
  },
]

function StarRow({ score, max = 5 }: { score: number; max?: number }) {
  return (
    <div className="flex items-center gap-0.5" aria-label={`${score} sur ${max} étoiles`}>
      {Array.from({ length: max }).map((_, i) => (
        <Star
          key={i}
          className="w-4 h-4"
          style={{
            fill: i < Math.floor(score) ? '#ef4444' : i < score ? '#ef444488' : '#e5e7eb',
            color: 'transparent',
          }}
        />
      ))}
    </div>
  )
}

function XPageCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="rounded-2xl border border-red-100 bg-red-50/40 p-6 flex flex-col gap-5"
    >
      <div>
        <div className="flex items-start justify-between gap-4 mb-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-red-400 mb-1">xPage sur Trustpilot</p>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-black text-red-500">2.7</span>
              <span className="text-lg text-red-300 font-semibold">/ 5</span>
            </div>
          </div>
          <div className="flex flex-col items-end gap-1">
            <StarRow score={2.7} />
            <a
              href="https://www.trustpilot.com/review/xpage.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-[10px] text-red-400 hover:text-red-600 transition-colors mt-1"
            >
              Voir sur Trustpilot
              <ExternalLink className="w-2.5 h-2.5" />
            </a>
          </div>
        </div>
        <p className="text-xs text-red-400">Score confirmé — source : Trustpilot (2026)</p>
      </div>

      <div className="space-y-3">
        {XPAGE_QUOTES.map((q, i) => (
          <div
            key={i}
            className="bg-white rounded-xl px-4 py-3 border border-red-100"
          >
            <StarRow score={q.rating} />
            <p className="text-xs text-gray-600 mt-2 leading-relaxed italic">&ldquo;{q.text}&rdquo;</p>
            <p className="text-[10px] text-gray-400 mt-1.5">{q.author} · {q.source}</p>
          </div>
        ))}
      </div>
    </motion.div>
  )
}

function KonvertCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
      className="rounded-2xl border border-[#5B47F5]/20 bg-[#5B47F5]/5 p-6 flex flex-col gap-5"
    >
      <div>
        <div className="flex items-start justify-between gap-4 mb-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-[#5B47F5] mb-1">KONVERT — Avis clients</p>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-black text-[#5B47F5]">4.7</span>
              <span className="text-lg text-[#5B47F5]/50 font-semibold">/ 5</span>
            </div>
          </div>
          <div className="flex flex-col items-end gap-1">
            <div className="flex items-center gap-0.5" aria-label="4.7 sur 5 étoiles">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className="w-4 h-4"
                  style={{
                    fill: i < 4 ? '#5B47F5' : i === 4 ? '#5B47F580' : '#e5e7eb',
                    color: 'transparent',
                  }}
                />
              ))}
            </div>
          </div>
        </div>
        <p className="text-xs text-[#5B47F5]/70">
          Objectif 4.5+ — en cours d&apos;évaluation par nos premiers clients.
        </p>
      </div>

      <div className="space-y-2.5">
        {[
          { label: 'Support réactif', detail: 'Réponse sous 24h garantie' },
          { label: 'Copy unique générée', detail: 'Frameworks PAS/AIDA/Cialdini intégrés' },
          { label: 'Mobile parfait', detail: 'Responsive testé sur 12 appareils' },
          { label: 'Essai sans friction', detail: '1 page gratuite, sans carte bancaire' },
        ].map((point, i) => (
          <div key={i} className="flex items-start gap-3 bg-white rounded-xl px-4 py-3 border border-[#5B47F5]/10">
            <span className="w-5 h-5 rounded-full bg-emerald-50 flex items-center justify-center flex-shrink-0 mt-0.5">
              <svg className="w-3 h-3 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </span>
            <div>
              <p className="text-xs font-semibold text-gray-900">{point.label}</p>
              <p className="text-[10px] text-gray-500 mt-0.5">{point.detail}</p>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  )
}

export default function TrustpilotCard() {
  return (
    <div className="grid md:grid-cols-2 gap-5">
      <XPageCard />
      <KonvertCard />
    </div>
  )
}
