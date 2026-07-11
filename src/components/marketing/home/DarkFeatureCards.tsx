'use client'

const DARK_CARDS = [
  {
    icon: (
      <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
      </svg>
    ),
    title: 'Toolkit de conversion',
    desc: 'Chaque visiteur qui part sans acheter, c\'est de l\'argent perdu. KONVERT centralise tout ce qu\'il faut pour inverser la tendance.',
  },
  {
    icon: (
      <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="5" width="20" height="14" rx="3"/>
        <path d="M2 10h20"/>
        <path d="M7 15h2M12 15h5"/>
        <path d="M7 15v1.5M9 15v1.5"/>
      </svg>
    ),
    title: 'Vente directe sur la page',
    desc: 'Transforme chaque visiteur en acheteur sans qu\'il quitte ta landing page. Le funnel le plus court = le plus rentable.',
  },
  {
    icon: (
      <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
        <rect x="5" y="2" width="14" height="20" rx="2"/>
        <circle cx="12" cy="17" r="1" fill="currentColor"/>
      </svg>
    ),
    title: 'Mobile-first par défaut',
    desc: '73% des achats e-commerce se font sur mobile. Tes pages KONVERT sont pensées mobile dès le départ — pas adaptées après.',
  },
  {
    icon: (
      <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 20h9"/>
        <path d="M16.376 3.622a1 1 0 0 1 3.002 3.002L7.368 18.635l-4 1 1-4 12.008-12.013z"/>
        <path d="m14.5 6.5 3 3"/>
        <circle cx="4.5" cy="4.5" r="1.5" fill="currentColor" stroke="none"/>
        <path d="M3 3l2 2"/>
      </svg>
    ),
    title: 'Copy IA qui vend vraiment',
    desc: 'Titre accrocheur, bénéfices, FAQ, CTA — l\'IA rédige un copy haute conversion en 30s, adapté à ton produit et à ton audience.',
  },
  {
    icon: (
      <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8"/>
        <line x1="21" y1="21" x2="16.65" y2="16.65"/>
        <path d="M8 11h6M11 8v6" strokeDasharray="3 1"/>
      </svg>
    ),
    title: 'SEO intégré, trafic gratuit',
    desc: 'Tes pages sont optimisées SEO dès la génération — balises, vitesse, structure. Chaque page travaille pour toi même quand tu dors.',
  },
  {
    icon: (
      <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="3"/>
        <circle cx="8.5" cy="10" r="2"/>
        <path d="M13 9h5M13 13h5M8.5 16h8"/>
      </svg>
    ),
    title: 'Leads capturés, argent gardé',
    desc: 'Capture les leads qui ne convertissent pas tout de suite. Relance-les avec Klaviyo ou ton CRM. Rien ne se perd.',
  },
]
export default function DarkFeatureCards() {
  return (
    <section style={{ background: 'radial-gradient(ellipse 70% 60% at 10% 50%, rgba(91,71,245,0.2) 0%, transparent 55%), radial-gradient(ellipse 60% 50% at 90% 50%, rgba(124,106,247,0.14) 0%, transparent 55%), #0b0b1c', paddingTop: '0', paddingBottom: '96px' }}>
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {DARK_CARDS.map((card, i) => (
            <div
              key={card.title}
              className="reveal flex flex-col items-center text-center px-8 py-12 rounded-3xl"
              style={{
                background: 'rgba(255,255,255,0.035)',
                border: '1px solid rgba(255,255,255,0.07)',
                transition: 'transform 0.2s ease-out, box-shadow 0.2s ease-out, background 0.2s ease-out',
                transitionDelay: `${i * 0.08}s`,
              }}
              onMouseEnter={e => {
                const el = e.currentTarget
                el.style.transform = 'translateY(-4px) scale(1.015)'
                el.style.background = 'rgba(255,255,255,0.06)'
                el.style.boxShadow = '0 12px 40px rgba(91,71,245,0.22)'
              }}
              onMouseLeave={e => {
                const el = e.currentTarget
                el.style.transform = ''
                el.style.background = 'rgba(255,255,255,0.035)'
                el.style.boxShadow = ''
              }}
            >
              <div className="mb-7 text-white" style={{ opacity: 0.75 }}>
                {card.icon}
              </div>
              <h3 className="text-white font-semibold text-xl mb-4 leading-snug">
                {card.title}
              </h3>
              <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '15px', lineHeight: '1.7' }}>
                {card.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}