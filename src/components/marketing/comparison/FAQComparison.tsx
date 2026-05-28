'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Minus } from 'lucide-react'

const FAQ_ITEMS = [
  {
    question: 'Quelle est la vraie différence entre Konvert et xPage ?',
    answer:
      "La différence fondamentale est dans la nature de l'IA. xPage utilise du template mapping : il prend les champs scrapés (titre, prix, description) et les insère dans un modèle fixe. Konvert utilise DeepSeek avec des frameworks de conversion éprouvés (PAS, AIDA, Cialdini, StoryBrand) pour générer du copy 100 % unique, calibré pour convertir. Ce n'est pas la même chose — l'une copie-colle, l'autre crée.",
  },
  {
    question: 'Pourquoi Konvert est plus cher que xPage ?',
    answer:
      "Konvert génère du copy unique avec des frameworks de conversion (valeur d'un copywriter), propose 6 sections enrichies optionnelles, un builder GrapesJS complet, l'intégration WooCommerce, le support francophone et le marché MENA. xPage propose un template mapping sans section enrichie. La comparaison n'est pas sur le prix — elle est sur le résultat.",
  },
  {
    question: 'Est-ce que Konvert fonctionne avec WooCommerce ?',
    answer:
      "Oui. Konvert est l'un des seuls outils de ce type à intégrer nativement WooCommerce, sans plugin tiers. xPage est limité à Shopify. Si tu vends sur WordPress/WooCommerce, Konvert est ta seule option dans cette catégorie.",
  },
  {
    question: 'Que disent les utilisateurs de xPage ?',
    answer:
      "Le score Trustpilot de xPage est 2.7/5 (score confirmé, source Trustpilot). Les plaintes récurrentes documentées : bugs non corrigés, rendu mobile cassé, support très lent voire absent, et une IA décrite comme « principalement de l'automatisation de mise en page » plutôt que de la vraie génération. Ces informations sont factuelles et sourcées.",
  },
  {
    question: 'Est-ce que Konvert peut générer une page en français ?',
    answer:
      "Oui, c'est même un de nos points forts. Konvert génère du copy en français, avec les nuances culturelles du marché francophone (FR, BE, CH, Maghreb). xPage génère uniquement en anglais. Pour les dropshippers francophones, c'est une différence majeure de conversion.",
  },
  {
    question: 'Y a-t-il un cas où xPage serait plus adapté que Konvert ?',
    answer:
      "Honnêtement : si tu cherches exclusivement le prix le plus bas, que tu travailles uniquement en anglais, sur Shopify uniquement, et que tu te contentes d'un template fixe sans customisation, xPage pourrait suffire. Mais si la qualité du copy, la flexibilité du design, la responsivité mobile et le support comptent — Konvert est le meilleur choix.",
  },
]

export default function FAQComparison() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <div className="space-y-3">
      {FAQ_ITEMS.map((item, index) => {
        const isOpen = openIndex === index

        return (
          <div
            key={index}
            className="border rounded-2xl overflow-hidden transition-all duration-200"
            style={{
              borderColor: isOpen ? 'rgba(91,71,245,0.25)' : '#e5e7eb',
              background: isOpen ? 'rgba(91,71,245,0.02)' : '#fff',
            }}
          >
            <button
              onClick={() => setOpenIndex(isOpen ? null : index)}
              className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left"
              aria-expanded={isOpen}
            >
              <span
                className="font-semibold text-sm sm:text-base leading-snug"
                style={{ color: isOpen ? '#5B47F5' : '#111827' }}
              >
                {item.question}
              </span>
              <span
                className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center transition-colors"
                style={{
                  background: isOpen ? '#5B47F5' : '#f3f4f6',
                  color: isOpen ? '#fff' : '#6b7280',
                }}
              >
                {isOpen ? <Minus className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
              </span>
            </button>

            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  style={{ overflow: 'hidden' }}
                >
                  <p className="px-6 pb-5 text-sm text-gray-500 leading-relaxed">
                    {item.answer}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )
      })}
    </div>
  )
}
