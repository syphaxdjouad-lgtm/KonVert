'use client'

import { useState } from 'react'
import { Plus, Minus } from 'lucide-react'

const FAQ_ITEMS = [
  {
    question: 'Est-ce que KONVERT fonctionne avec Shopify ?',
    answer:
      "Oui, KONVERT s'intègre directement avec Shopify via OAuth. En un clic, tu connectes ta boutique et tu publies tes pages produit générées directement dans ton store, sans copier-coller ni compétences techniques.",
  },
  {
    question: 'Combien de temps pour créer ma première page ?',
    answer:
      "Moins de 30 secondes. Tu colles l'URL de ton produit AliExpress, Amazon ou Alibaba — l'IA génère le titre accrocheur, la description optimisée, les arguments de vente et le design. Ta page est prête avant la fin de ton café.",
  },
  {
    question: 'Est-ce que je peux essayer avant de payer ?',
    answer:
      'Absolument. KONVERT propose 14 jours gratuits, sans carte bancaire requise. Tu peux générer des pages, tester les templates et voir les résultats avant de décider si tu passes à un plan payant.',
  },
  {
    question: 'KONVERT est-il adapté aux débutants ?',
    answer:
      "Oui, c'est exactement pour ça qu'on l'a conçu. Aucune compétence en design, copywriting ou code n'est nécessaire. Si tu sais coller une URL, tu sais utiliser KONVERT. L'interface est pensée pour être intuitive dès la première utilisation.",
  },
  {
    question: 'Quelle est la différence avec un freelance ou Fiverr ?',
    answer:
      "Un freelance prend 3 à 10 jours, facture entre 150€ et 800€ par page, et tu dois lui expliquer ton produit, valider les maquettes, faire des allers-retours. KONVERT génère une page optimisée en 30 secondes, pour quelques euros par page, disponible 24h/24. Et si tu veux modifier, tu regénères instantanément.",
  },
  {
    question: 'Puis-je annuler à tout moment ?',
    answer:
      "Oui, sans condition. Tu peux annuler ton abonnement en 1 clic depuis ton dashboard, à tout moment. Aucune période d'engagement, aucun frais de résiliation. Tu gardes accès jusqu'à la fin de ta période déjà payée.",
  },
]

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQ_ITEMS.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  }

  return (
    <section className="py-20 bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="max-w-3xl mx-auto px-5 sm:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-xs font-bold uppercase tracking-widest text-[#5B47F5] mb-3">
            Questions fréquentes
          </p>
          <h2 className="text-3xl sm:text-4xl font-black text-gray-900 leading-tight">
            Tout ce que tu veux savoir,{' '}
            <span className="text-[#5B47F5]">sans te noyer.</span>
          </h2>
        </div>

        {/* Accordion */}
        <div className="space-y-3">
          {FAQ_ITEMS.map((item, index) => {
            const isOpen = openIndex === index

            return (
              <div
                key={index}
                className="border rounded-2xl overflow-hidden transition-all duration-200"
                style={{
                  borderColor: isOpen ? 'rgba(91,71,245,0.3)' : '#e5e7eb',
                  background: isOpen ? 'rgba(91,71,245,0.02)' : '#fff',
                }}
              >
                <button
                  onClick={() => toggle(index)}
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

                {/* Animated answer */}
                <div
                  style={{
                    maxHeight: isOpen ? '400px' : '0',
                    opacity: isOpen ? 1 : 0,
                    overflow: 'hidden',
                    transition: 'max-height 0.35s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.25s ease',
                  }}
                >
                  <p className="px-6 pb-5 text-sm text-gray-500 leading-relaxed">
                    {item.answer}
                  </p>
                </div>
              </div>
            )
          })}
        </div>

        {/* CTA bas */}
        <p className="text-center text-sm text-gray-400 mt-8">
          Tu as une autre question ?{' '}
          <a href="mailto:hello@konvert.app" className="text-[#5B47F5] font-semibold hover:underline">
            Écris-nous
          </a>
        </p>
      </div>
    </section>
  )
}
