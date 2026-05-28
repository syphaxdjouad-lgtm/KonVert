'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Check, X, Minus, AlertTriangle } from 'lucide-react'

type Status = 'yes' | 'no' | 'partial' | 'warning'

interface CriterionRow {
  category: string
  criterion: string
  konvert: { status: Status; label?: string }
  xpage: { status: Status; label?: string }
}

const ROWS: CriterionRow[] = [
  {
    category: 'Intelligence artificielle',
    criterion: 'Génération de copy 100 % unique',
    konvert: { status: 'yes', label: 'DeepSeek — frameworks PAS, AIDA, Cialdini, StoryBrand' },
    xpage: { status: 'no', label: 'Template mapping — champs scrapés insérés dans un modèle fixe' },
  },
  {
    category: 'Intelligence artificielle',
    criterion: 'Frameworks de conversion intégrés',
    konvert: { status: 'yes', label: 'PAS / AIDA / Cialdini / StoryBrand — sélectionnés automatiquement' },
    xpage: { status: 'no', label: 'Aucun framework de conversion documenté' },
  },
  {
    category: 'Structure de page',
    criterion: 'Sections enrichies optionnelles',
    konvert: { status: 'yes', label: '6 sections : story, témoignages, comparaison, garantie, preuve sociale, bonus' },
    xpage: { status: 'no', label: 'Template fixe — aucune personnalisation structurelle' },
  },
  {
    category: 'Structure de page',
    criterion: 'Builder drag & drop ouvert',
    konvert: { status: 'yes', label: 'GrapesJS complet — contrôle total sur chaque élément' },
    xpage: { status: 'no', label: 'Customisation limitée aux options du template' },
  },
  {
    category: 'Plateformes e-commerce',
    criterion: 'Intégration Shopify',
    konvert: { status: 'yes', label: 'OAuth one-click — publication directe' },
    xpage: { status: 'yes', label: 'One-click — fonctionnel' },
  },
  {
    category: 'Plateformes e-commerce',
    criterion: 'Intégration WooCommerce',
    konvert: { status: 'yes', label: 'Natif — sans plugin tiers requis' },
    xpage: { status: 'no', label: 'Shopify uniquement' },
  },
  {
    category: 'Marché & langue',
    criterion: 'Marché francophone (FR / BE / CH)',
    konvert: { status: 'yes', label: 'Interface, copy et support en français' },
    xpage: { status: 'no', label: 'Anglophone uniquement' },
  },
  {
    category: 'Marché & langue',
    criterion: 'Marché MENA (Maghreb / Moyen-Orient)',
    konvert: { status: 'yes', label: 'Copy arabe, ciblage culturel adapté' },
    xpage: { status: 'no', label: 'Non adressé' },
  },
  {
    category: 'Onboarding',
    criterion: 'Essai sans compte ni carte bancaire',
    konvert: { status: 'yes', label: '1 page gratuite, zéro friction, résultat immédiat' },
    xpage: { status: 'partial', label: 'Free trial — inscription obligatoire' },
  },
  {
    category: 'Qualité produit',
    criterion: 'Score Trustpilot',
    konvert: { status: 'yes', label: "En cours d'évaluation — objectif 4.5+" },
    xpage: { status: 'warning', label: '2.7 / 5 — bugs, support défaillant, mobile cassé' },
  },
  {
    category: 'Qualité produit',
    criterion: 'Support client réactif',
    konvert: { status: 'yes', label: 'Chat + email — réponse sous 24h garantie' },
    xpage: { status: 'no', label: 'Support qualifié de "très mauvais" dans les avis' },
  },
  {
    category: 'Qualité produit',
    criterion: 'Rendu mobile des pages générées',
    konvert: { status: 'yes', label: 'Responsive mobile-first natif — testé sur 12 appareils' },
    xpage: { status: 'no', label: 'Problèmes mobiles documentés sur Trustpilot' },
  },
]

function StatusIcon({ status }: { status: Status }) {
  switch (status) {
    case 'yes':
      return (
        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-50 flex-shrink-0">
          <Check className="w-3.5 h-3.5 text-emerald-600" strokeWidth={2.5} />
        </span>
      )
    case 'no':
      return (
        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-red-50 flex-shrink-0">
          <X className="w-3.5 h-3.5 text-red-500" strokeWidth={2.5} />
        </span>
      )
    case 'partial':
      return (
        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-amber-50 flex-shrink-0">
          <Minus className="w-3.5 h-3.5 text-amber-500" strokeWidth={2.5} />
        </span>
      )
    case 'warning':
      return (
        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-red-50 flex-shrink-0">
          <AlertTriangle className="w-3.5 h-3.5 text-red-500" strokeWidth={2} />
        </span>
      )
  }
}

function groupByCategory(rows: CriterionRow[]) {
  const map = new Map<string, CriterionRow[]>()
  for (const row of rows) {
    const existing = map.get(row.category) ?? []
    existing.push(row)
    map.set(row.category, existing)
  }
  return map
}

export default function ComparisonTable() {
  const [hoveredRow, setHoveredRow] = useState<number | null>(null)
  const grouped = groupByCategory(ROWS)
  let globalIndex = 0

  return (
    <div className="w-full overflow-x-auto rounded-2xl border border-gray-200 shadow-sm">
      <table className="w-full min-w-[700px] border-collapse">
        <thead>
          <tr className="sticky top-0 z-20 bg-white border-b border-gray-200">
            <th scope="col" className="w-[38%] px-6 py-4 text-left text-[10px] font-bold uppercase tracking-widest text-gray-400">
              Critère
            </th>
            <th scope="col" className="w-[31%] px-6 py-4 text-left">
              <div className="flex items-center gap-2">
                <svg width="22" height="22" viewBox="0 0 52 52" fill="none" aria-hidden="true">
                  <rect width="52" height="52" rx="10" fill="#5B47F5" />
                  <rect x="14" y="12" width="6" height="28" rx="2" fill="white" />
                  <path d="M20 26 L35 13" stroke="white" strokeWidth="5.5" strokeLinecap="round" />
                  <path d="M20 26 L33 39" stroke="#b5f23d" strokeWidth="5.5" strokeLinecap="round" />
                  <polygon points="33,39 24,37 31,30" fill="#b5f23d" />
                </svg>
                <span className="text-sm font-black text-gray-900">KONVERT</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: '#b5f23d', color: '#1a1a1a' }}>
                  Recommandé
                </span>
              </div>
            </th>
            <th scope="col" className="w-[31%] px-6 py-4 text-left">
              <span className="text-sm font-semibold text-gray-400">xPage</span>
            </th>
          </tr>
        </thead>

        <tbody>
          {Array.from(grouped.entries()).map(([category, rows]) => (
            <>
              <tr key={`cat-${category}`} className="bg-gray-50/80">
                <td colSpan={3} className="px-6 py-2 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                  {category}
                </td>
              </tr>

              {rows.map((row) => {
                const idx = globalIndex++
                const isHovered = hoveredRow === idx

                return (
                  <motion.tr
                    key={`row-${idx}`}
                    initial={{ opacity: 0, y: 6 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-30px' }}
                    transition={{ duration: 0.35, delay: Math.min(idx * 0.035, 0.3), ease: [0.16, 1, 0.3, 1] }}
                    onMouseEnter={() => setHoveredRow(idx)}
                    onMouseLeave={() => setHoveredRow(null)}
                    style={{
                      background: isHovered ? 'rgba(91,71,245,0.028)' : '#fff',
                      borderBottom: '1px solid #f3f4f6',
                      transition: 'background 0.15s ease',
                    }}
                  >
                    <td className="px-6 py-4">
                      <span className="text-sm font-semibold text-gray-800 leading-snug">{row.criterion}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-start gap-2.5">
                        <StatusIcon status={row.konvert.status} />
                        {row.konvert.label && (
                          <span className="text-xs text-gray-600 leading-relaxed pt-0.5">{row.konvert.label}</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-start gap-2.5">
                        <StatusIcon status={row.xpage.status} />
                        {row.xpage.label && (
                          <span className="text-xs text-gray-400 leading-relaxed pt-0.5">{row.xpage.label}</span>
                        )}
                      </div>
                    </td>
                  </motion.tr>
                )
              })}
            </>
          ))}
        </tbody>
      </table>

      <div className="flex flex-wrap items-center gap-5 px-6 py-4 border-t border-gray-100 bg-gray-50/60">
        {(
          [
            { status: 'yes' as Status, label: 'Disponible' },
            { status: 'no' as Status, label: 'Non disponible' },
            { status: 'partial' as Status, label: 'Partiel' },
            { status: 'warning' as Status, label: 'Problème documenté' },
          ] as { status: Status; label: string }[]
        ).map(({ status, label }) => (
          <div key={label} className="flex items-center gap-1.5">
            <StatusIcon status={status} />
            <span className="text-xs text-gray-400">{label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
