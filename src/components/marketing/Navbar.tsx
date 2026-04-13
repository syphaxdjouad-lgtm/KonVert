'use client'

import Link from 'next/link'
import { useState, useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import { Menu, X, Sparkles, ChevronDown, ArrowRight, Zap, BarChart3, Globe, Search, Palette, FlaskConical } from 'lucide-react'

const NAV = [
  { label: 'Fonctionnalités', href: '/features' },
  { label: 'Templates',       href: '/templates' },
  { label: 'Tarifs',          href: '/pricing' },
  {
    label: 'Services',
    href:  '/services',
    dropdown: [
      { icon: Search,    label: 'Audit SEO',          desc: 'Analysez votre boutique',   href: '/services#seo' },
      { icon: BarChart3, label: 'Suivi & Reporting',   desc: 'KPIs en temps réel',        href: '/services#reporting' },
      { icon: Globe,     label: 'Accompagnement',      desc: 'Coaching e-commerce',       href: '/services#coaching' },
      { icon: Zap,       label: 'Pack Agence',         desc: 'Multi-clients & white-label',href: '/agence' },
    ],
  },
  { label: 'Blog',     href: '/blog' },
  { label: 'À propos', href: '/about' },
]

// Pages avec hero dark → navbar transparente au départ
const DARK_HERO_PAGES = ['/', '/features', '/agence', '/demo']

export default function Navbar() {
  const [menuOpen,    setMenuOpen]    = useState(false)
  const [scrolled,    setScrolled]    = useState(false)
  const [activeDD,    setActiveDD]    = useState<string | null>(null)
  const pathname = usePathname()
  const ddRef    = useRef<HTMLDivElement>(null)

  const isDarkHero = DARK_HERO_PAGES.includes(pathname)
  const isTransparent = isDarkHero && !scrolled

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Ferme dropdown si clic extérieur
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ddRef.current && !ddRef.current.contains(e.target as Node)) {
        setActiveDD(null)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const navBg    = isTransparent ? 'bg-transparent' : 'bg-white/95 backdrop-blur-xl shadow-sm border-b border-gray-100'
  const textCol  = isTransparent ? 'text-white/90 hover:text-white' : 'text-gray-600 hover:text-gray-900'
  const logoCls  = isTransparent ? 'text-white' : 'text-gray-900'
  const subCls   = isTransparent ? 'text-white/60' : 'text-[#5B47F5]'

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${navBg}`}>
      <nav className="max-w-7xl mx-auto px-5 sm:px-8 h-16 flex items-center gap-6">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 flex-shrink-0 mr-4">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center"
               style={{ background: 'linear-gradient(135deg, #5B47F5, #8b77ff)' }}>
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span className={`font-black text-lg tracking-tight ${logoCls}`}>
            Konvert
          </span>
          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${subCls} ${isTransparent ? 'bg-white/15' : 'bg-[#5B47F5]/10'}`}>
            beta
          </span>
        </Link>

        {/* Desktop nav */}
        <div ref={ddRef} className="hidden lg:flex items-center gap-0.5 flex-1 min-w-0">
          {NAV.map((item) => {
            const active = pathname === item.href || pathname.startsWith(item.href + '/')
            if (item.dropdown) {
              return (
                <div key={item.label} className="relative">
                  <button
                    onClick={() => setActiveDD(activeDD === item.label ? null : item.label)}
                    className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-all ${textCol} ${active ? 'font-semibold' : ''}`}
                  >
                    {item.label}
                    <ChevronDown className={`w-3.5 h-3.5 transition-transform ${activeDD === item.label ? 'rotate-180' : ''}`} />
                  </button>
                  {activeDD === item.label && (
                    <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-gray-100 p-2 z-50">
                      {item.dropdown.map(({ icon: Icon, label, desc, href }) => (
                        <Link
                          key={label}
                          href={href}
                          onClick={() => setActiveDD(null)}
                          className="flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors group"
                        >
                          <div className="w-8 h-8 rounded-lg bg-[#5B47F5]/10 flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:bg-[#5B47F5]/20 transition-colors">
                            <Icon className="w-4 h-4 text-[#5B47F5]" />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-gray-900">{label}</p>
                            <p className="text-xs text-gray-500">{desc}</p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              )
            }
            return (
              <Link
                key={item.label}
                href={item.href}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${textCol} ${active ? 'font-semibold' : ''}`}
              >
                {item.label}
              </Link>
            )
          })}
        </div>

        {/* CTA droite */}
        <div className="hidden lg:flex items-center gap-2 ml-auto flex-shrink-0">
          <Link
            href="/login"
            className={`text-sm font-semibold px-4 py-2 rounded-lg transition-all whitespace-nowrap ${
              isTransparent ? 'text-white/80 hover:text-white hover:bg-white/10' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            Se connecter
          </Link>
          <Link
            href="/demo"
            className="text-sm font-bold px-4 py-2 rounded-full transition-all whitespace-nowrap hover:opacity-90"
            style={{ border: '1.5px solid', color: isTransparent ? '#a78bfa' : '#5B47F5', borderColor: isTransparent ? '#a78bfa' : '#5B47F5' }}
          >
            Voir la démo
          </Link>
          <Link
            href="/signup"
            className="flex items-center gap-1.5 text-sm font-bold px-4 py-2 rounded-full text-white transition-all whitespace-nowrap hover:opacity-90"
            style={{ background: 'linear-gradient(135deg, #5B47F5, #7c6af7)', boxShadow: '0 4px 14px rgba(91,71,245,0.3)' }}
          >
            Essai gratuit
            <ArrowRight className="w-3.5 h-3.5 flex-shrink-0" />
          </Link>
        </div>

        {/* Mobile burger */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="lg:hidden ml-auto p-2 rounded-lg transition-colors"
          style={{ color: isTransparent ? '#fff' : '#374151' }}
        >
          {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-100 shadow-xl">
          <div className="max-w-7xl mx-auto px-5 py-4 space-y-1">
            {NAV.map((item) => (
              <div key={item.label}>
                <Link
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center justify-between py-3 text-sm font-semibold text-gray-700 hover:text-[#5B47F5] border-b border-gray-50 last:border-0 transition-colors"
                >
                  {item.label}
                </Link>
                {item.dropdown && (
                  <div className="pl-4 pb-2 space-y-1">
                    {item.dropdown.map(({ label, href }) => (
                      <Link
                        key={label}
                        href={href}
                        onClick={() => setMenuOpen(false)}
                        className="block py-2 text-xs text-gray-500 hover:text-[#5B47F5] transition-colors"
                      >
                        → {label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <div className="flex flex-col gap-3 pt-4">
              <Link href="/login" className="text-center text-sm font-semibold text-gray-600 py-2.5 rounded-xl hover:bg-gray-50">
                Se connecter
              </Link>
              <Link
                href="/demo"
                onClick={() => setMenuOpen(false)}
                className="text-center text-sm font-bold py-3 rounded-full transition-all"
                style={{ border: '1.5px solid #5B47F5', color: '#5B47F5' }}
              >
                Démo
              </Link>
              <Link
                href="/signup"
                className="text-center text-sm font-bold py-3.5 rounded-full text-white"
                style={{ background: 'linear-gradient(135deg, #5B47F5, #7c6af7)' }}
              >
                Essai gratuit 14 jours
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
