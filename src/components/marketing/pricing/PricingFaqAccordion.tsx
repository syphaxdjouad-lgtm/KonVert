'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

type FaqEntry = { q: string; a: string }

function FaqItem({ q, a }: FaqEntry) {
  const [open, setOpen] = useState(false)
  return (
    <div
      className="bg-white rounded-xl overflow-hidden cursor-pointer border transition-colors duration-200"
      style={{ borderColor: open ? '#d1d5db' : '#e5e7eb' }}
    >
      <button
        className="w-full px-6 py-5 flex items-center justify-between text-left"
        onClick={() => setOpen(!open)}
      >
        <span className="font-semibold text-gray-900 text-sm pr-4">{q}</span>
        <ChevronDown
          className="w-4 h-4 text-gray-400 flex-shrink-0 transition-transform duration-300"
          style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}
        />
      </button>
      <div
        className="px-6 overflow-hidden transition-all duration-300"
        style={
          open
            ? { maxHeight: '400px', opacity: 1, paddingBottom: '20px' }
            : { maxHeight: '0px', opacity: 0, paddingBottom: '0px' }
        }
      >
        <p className="text-gray-500 text-sm leading-relaxed">{a}</p>
      </div>
    </div>
  )
}

export default function PricingFaqAccordion({ items }: { items: FaqEntry[] }) {
  return (
    <div className="space-y-3">
      {items.map(({ q, a }) => (
        <FaqItem key={q} q={q} a={a} />
      ))}
    </div>
  )
}
