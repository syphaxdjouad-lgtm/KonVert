'use client'

import Link from 'next/link'
import { Sparkles, AtSign, ExternalLink, Globe, MessageCircle } from 'lucide-react'

const COLS = [
  {
    title: 'Produit',
    links: [
      { label: 'Fonctionnalités',  href: '/features' },
      { label: 'Templates',        href: '/templates' },
      { label: 'Tarifs',           href: '/pricing' },
      { label: 'Démo',             href: '/demo' },
      { label: 'Changelog',        href: '/changelog' },
    ],
  },
  {
    title: 'Ressources',
    links: [
      { label: 'Blog',             href: '/blog' },
      { label: 'Documentation',    href: '/docs' },
      { label: 'Intégrations',     href: '/integrations' },
      { label: 'API',              href: '/api-docs' },
      { label: 'Status',           href: '/status' },
    ],
  },
  {
    title: 'Services',
    links: [
      { label: 'Audit SEO',        href: '/services#seo' },
      { label: 'Suivi & Reporting',href: '/services#reporting' },
      { label: 'Coaching e-com',   href: '/services#coaching' },
      { label: 'Pack Agence',      href: '/agence' },
      { label: 'Contact',          href: '/contact' },
    ],
  },
  {
    title: 'Entreprise',
    links: [
      { label: 'À propos',         href: '/about' },
      { label: 'CGU',              href: '/legal/cgu' },
      { label: 'Confidentialité',  href: '/legal/privacy' },
      { label: 'RGPD',             href: '/legal/rgpd' },
      { label: 'Mentions légales', href: '/legal/mentions' },
    ],
  },
]

const SOCIALS = [
  { icon: AtSign,         href: '#', label: 'Twitter / X' },
  { icon: ExternalLink,   href: '#', label: 'LinkedIn' },
  { icon: Globe,          href: '#', label: 'Instagram' },
  { icon: MessageCircle,  href: '#', label: 'YouTube' },
]

export default function Footer() {
  return (
    <footer style={{ background: '#08080f' }}>

      {/* Section principale */}
      <div className="max-w-7xl mx-auto px-5 sm:px-8 pt-16 pb-10">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">

          {/* Brand */}
          <div className="col-span-2 md:col-span-1 pr-4">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center"
                   style={{ background: 'linear-gradient(135deg, #5B47F5, #8b77ff)' }}>
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="font-black text-lg text-white tracking-tight">Konvert</span>
            </Link>
            <p className="text-sm leading-relaxed mb-6" style={{ color: '#6b6b8a' }}>
              Générez des landing pages haute conversion depuis n'importe quelle URL produit. En 30 secondes.
            </p>
            <div className="flex items-center gap-3">
              {SOCIALS.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-8 h-8 rounded-lg flex items-center justify-center transition-all hover:scale-110"
                  style={{ background: '#ffffff12', color: '#8b8baa' }}
                  onMouseEnter={e => {
                    ;(e.currentTarget as HTMLElement).style.background = '#5B47F520'
                    ;(e.currentTarget as HTMLElement).style.color = '#8b77ff'
                  }}
                  onMouseLeave={e => {
                    ;(e.currentTarget as HTMLElement).style.background = '#ffffff12'
                    ;(e.currentTarget as HTMLElement).style.color = '#8b8baa'
                  }}
                >
                  <Icon className="w-3.5 h-3.5" />
                </a>
              ))}
            </div>
          </div>

          {/* Colonnes de liens */}
          {COLS.map((col) => (
            <div key={col.title}>
              <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: '#5B47F5' }}>
                {col.title}
              </p>
              <ul className="space-y-2.5">
                {col.links.map(({ label, href }) => (
                  <li key={label}>
                    <Link
                      href={href}
                      className="text-sm transition-colors"
                      style={{ color: '#6b6b8a' }}
                      onMouseEnter={e => ((e.target as HTMLElement).style.color = '#d0d0e8')}
                      onMouseLeave={e => ((e.target as HTMLElement).style.color = '#6b6b8a')}
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="mt-12 pt-6 border-t flex flex-col sm:flex-row items-center justify-between gap-3" style={{ borderColor: '#ffffff0a' }}>
          <p className="text-xs" style={{ color: '#4a4a66' }}>
            © 2025 Konvert SAS. Tous droits réservés.
          </p>
          <p className="text-xs" style={{ color: '#4a4a66' }}>
            Propulsé par{' '}
            <span style={{ color: '#8b77ff' }}>Claude AI</span>
            {' '}·{' '}
            Hébergé en France 🇫🇷
          </p>
        </div>
      </div>
    </footer>
  )
}
