'use client'

import Link from 'next/link'
import Image from 'next/image'
import { TEMPLATE_COUNT } from '@/lib/templates'
import { addRipple } from '@/lib/ui/ripple'
import { Palette, ArrowRight } from '@phosphor-icons/react'

const TEMPLATE_GRID = [
  { name: 'Blue',     gradient: 'linear-gradient(135deg,#0057FF,#3b82f6)', tag: 'Tech · Universal',    img: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80' },
  { name: 'Noir',     gradient: 'linear-gradient(135deg,#0D0D0D,#1f1f2e)', tag: 'Gaming · Premium',    img: 'https://images.unsplash.com/photo-1547996160-81dfa63595aa?w=600&q=80' },
  { name: 'Rose',     gradient: 'linear-gradient(135deg,#D63370,#f472b6)', tag: 'Beauté · Skincare',   img: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&q=80' },
  { name: 'Gold',     gradient: 'linear-gradient(135deg,#D4A853,#b8860b)', tag: 'Luxe · Haute Gamme',  img: 'https://images.unsplash.com/photo-1600003014755-ba31aa59c4b6?w=600&q=80' },
  { name: 'StreetZ',  gradient: 'linear-gradient(135deg,#E11D48,#f43f5e)', tag: 'Streetwear · Urban',  img: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600&q=80' },
  { name: 'GlowUp',   gradient: 'linear-gradient(135deg,#D4508B,#ec4899)', tag: 'Makeup · Glamour',    img: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600&q=80' },
  { name: 'Platina',  gradient: 'linear-gradient(135deg,#B8860B,#d4a853)', tag: 'Joaillerie · Raffiné',img: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600&q=80' },
  { name: 'Starter',  gradient: 'linear-gradient(135deg,#4F46E5,#6366f1)', tag: 'Polyvalent · Clean',  img: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80' },
]
export default function TemplatesPreview() {
  return (
    <section id="templates" style={{ background: '#faf8ff' }}>
      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-14 sm:py-24">
        <div className="text-center mb-10 sm:mb-14">
          <div
            className="reveal inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold mb-4"
            style={{ background: 'rgba(91,71,245,0.08)', color: '#5B47F5', border: '1px solid rgba(91,71,245,0.15)' }}
          >
            <Palette className="w-3.5 h-3.5" />
            Templates
          </div>
          <h2 className="reveal delay-1 text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 tracking-tight mb-4">
            Chaque niche a son template.
          </h2>
          <p className="reveal delay-2 text-lg text-gray-500 max-w-xl mx-auto">
            {TEMPLATE_COUNT}+ designs calibrés pour convertir — Tech, Beauté, Luxe, Streetwear, Joaillerie, Maison et plus. Le bon design pour le bon produit, immédiatement.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-10">
          {TEMPLATE_GRID.map((t, i) => (
            <div
              key={t.name}
              className="reveal group cursor-pointer rounded-2xl overflow-hidden card-hover-violet"
              style={{ transitionDelay: `${i * 0.06}s` }}
            >
              <div
                className="h-36 flex items-end p-3 relative overflow-hidden"
                style={{ background: t.gradient }}
              >
                {t.img && (
                  <Image
                    src={t.img}
                    alt={t.name}
                    fill
                    sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 220px"
                    className="object-cover opacity-60 group-hover:opacity-80 transition-opacity duration-300"
                  />
                )}
                <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 60%)' }} />
                <span
                  className="relative z-10 text-xs font-bold px-2 py-0.5 rounded-full"
                  style={{ background: 'rgba(255,255,255,0.25)', color: '#fff', backdropFilter: 'blur(4px)' }}
                >
                  {t.tag}
                </span>
              </div>
              <div className="p-3 bg-white border border-purple-50 border-t-0 rounded-b-2xl">
                <span className="text-gray-800 text-sm font-semibold">{t.name}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Link
            href="/templates"
            className="btn-shimmer btn-ripple inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-bold text-sm text-white transition-all hover:scale-[1.02]"
            style={{ background: 'linear-gradient(135deg,#5B47F5,#7c6af7)', boxShadow: '0 4px 18px rgba(91,71,245,0.35)' }}
            onClick={addRipple}
          >
            Voir tous les templates <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}