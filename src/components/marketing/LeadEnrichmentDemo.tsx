'use client'

import { useEffect, useRef, useState } from 'react'
import { BarChart2 } from 'lucide-react'

/* ─── Données mockup dashboard ─────────────────────────────────────────── */
const LEADS = [
  { email: 'alex@conversions.com',  source: 'Meta Ads',    page: '/sneakers-pro',   date: '07 avr.',  enriched: true },
  { email: 'sarah.b@gmail.com',     source: 'Google SEO',  page: '/jordan-retro',   date: '07 avr.',  enriched: false },
  { email: 'marc.d@outlook.com',    source: 'TikTok Ads',  page: '/air-max-2024',   date: '06 avr.',  enriched: true },
  { email: 'julie@shopify.fr',      source: 'Email',       page: '/bestsellers',    date: '06 avr.',  enriched: false },
  { email: 'kevin@ecom.io',         source: 'Organique',   page: '/promo-soldes',   date: '05 avr.',  enriched: true },
  { email: 'nina.r@yahoo.fr',       source: 'Meta Ads',    page: '/collection-ete', date: '05 avr.',  enriched: false },
]

/* ─── Composant principal ───────────────────────────────────────────────── */
export default function LeadEnrichmentDemo() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [triggered, setTriggered] = useState(false)

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTriggered(true)
          io.disconnect()
        }
      },
      { threshold: 0.25 }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <section
      ref={sectionRef}
      style={{ background: '#0c0a1a' }}
      className="relative overflow-hidden py-24 px-5 sm:px-8"
    >
      {/* ── Fond radial blur ─────────────────────────────────────────── */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(ellipse 70% 60% at 50% 50%, rgba(91,71,245,0.22) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />
      <div
        aria-hidden
        style={{
          position: 'absolute',
          top: '20%',
          left: '10%',
          width: 340,
          height: 340,
          borderRadius: '50%',
          background: 'rgba(181,242,61,0.06)',
          filter: 'blur(80px)',
          pointerEvents: 'none',
        }}
      />

      <div className="relative max-w-7xl mx-auto">
        {/* ── Header ───────────────────────────────────────────────── */}
        <div className="text-center mb-16">
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold mb-4"
            style={{
              background: 'rgba(91,71,245,0.18)',
              color: '#a78bfa',
              border: '1px solid rgba(91,71,245,0.3)',
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2a5 5 0 1 1 0 10A5 5 0 0 1 12 2zm0 12c5.33 0 8 2.67 8 4v2H4v-2c0-1.33 2.67-4 8-4z"/>
            </svg>
            Enrichissement de leads
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight mb-4">
            Chaque lead devient{' '}
            <span
              style={{
                background: 'linear-gradient(135deg,#b5f23d,#7aec5a)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              une opportunité.
            </span>
          </h2>
          <p className="text-lg text-white/60 max-w-xl mx-auto">
            KONVERT identifie et enrichit automatiquement tes leads — email, industrie, entreprise — pour que tu puisses cibler les bons prospects.
          </p>
        </div>

        {/* ── Zone démo : dashboard + carte ──────────────────────────── */}
        <div className="flex flex-col lg:flex-row items-center lg:items-start justify-center gap-8 lg:gap-0">

          {/* Wrapper dashboard — zoom au scroll */}
          <div
            style={{
              position: 'relative',
              width: '100%',
              maxWidth: 720,
              transform: triggered ? 'scale(1)' : 'scale(0.85)',
              transition: 'transform 800ms cubic-bezier(0.16,1,0.3,1)',
              transformOrigin: 'center top',
              willChange: 'transform',
              zIndex: 1,
            }}
          >
            {/* Dashboard mockup */}
            <div
              style={{
                background: '#ffffff',
                borderRadius: 16,
                overflow: 'hidden',
                boxShadow: '0 32px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.06)',
              }}
            >
              {/* Browser chrome */}
              <div
                style={{
                  background: '#f1f3f5',
                  padding: '10px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  borderBottom: '1px solid #e2e8f0',
                }}
              >
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#ff5f57' }} />
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#febc2e' }} />
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#28c840' }} />
                <div
                  style={{
                    flex: 1,
                    background: '#fff',
                    borderRadius: 6,
                    padding: '3px 10px',
                    fontSize: 11,
                    color: '#94a3b8',
                    marginLeft: 8,
                    border: '1px solid #e2e8f0',
                  }}
                >
                  app.konvert.app/leads
                </div>
              </div>

              {/* Sidebar + content */}
              <div style={{ display: 'flex', minHeight: 360 }}>
                {/* Sidebar */}
                <div style={{ width: 52, background: '#0f172a', display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 16, gap: 16 }}>
                  {['K','≡','◎','⚡'].map((icon, i) => (
                    <div
                      key={i}
                      style={{
                        width: 32, height: 32, borderRadius: 8,
                        background: i === 2 ? 'rgba(91,71,245,0.4)' : 'transparent',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: i === 0 ? 14 : 12,
                        color: i === 2 ? '#a78bfa' : 'rgba(255,255,255,0.4)',
                        fontWeight: i === 0 ? 900 : 400,
                        cursor: 'pointer',
                      }}
                    >
                      {icon}
                    </div>
                  ))}
                  <div
                    style={{
                      width: 32, height: 32, borderRadius: 8,
                      background: 'transparent',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: 'rgba(255,255,255,0.4)',
                      cursor: 'pointer',
                    }}
                  >
                    <BarChart2 size={14} />
                  </div>
                </div>

                {/* Main content */}
                <div style={{ flex: 1, padding: '16px 20px', overflow: 'hidden' }}>
                  {/* Top bar */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: '#0f172a' }}>Leads — Avril 2026</div>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <div style={{ fontSize: 10, padding: '4px 10px', borderRadius: 6, background: '#5B47F5', color: '#fff', fontWeight: 600 }}>Enrichir tout</div>
                      <div style={{ fontSize: 10, padding: '4px 10px', borderRadius: 6, background: '#f1f5f9', color: '#64748b', fontWeight: 500 }}>Exporter</div>
                    </div>
                  </div>

                  {/* Stats mini */}
                  <div style={{ display: 'flex', gap: 10, marginBottom: 14 }}>
                    {[
                      { label: 'Total leads', val: '247' },
                      { label: 'Enrichis', val: '184', green: true },
                      { label: 'Taux conv.', val: '3.8%' },
                    ].map((s) => (
                      <div
                        key={s.label}
                        style={{
                          flex: 1, background: '#f8fafc',
                          border: '1px solid #e2e8f0',
                          borderRadius: 8, padding: '8px 10px',
                        }}
                      >
                        <div style={{ fontSize: 10, color: '#94a3b8', marginBottom: 2 }}>{s.label}</div>
                        <div style={{ fontSize: 16, fontWeight: 800, color: s.green ? '#16a34a' : '#0f172a' }}>{s.val}</div>
                      </div>
                    ))}
                  </div>

                  {/* Table */}
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11 }}>
                    <thead>
                      <tr style={{ borderBottom: '1.5px solid #f1f5f9' }}>
                        {['Email', 'Source', 'Page', 'Date', 'Statut'].map((h) => (
                          <th key={h} style={{ textAlign: 'left', padding: '6px 8px', color: '#94a3b8', fontWeight: 600, fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {LEADS.map((lead, i) => (
                        <tr
                          key={i}
                          style={{
                            borderBottom: '1px solid #f8fafc',
                            background: lead.email === 'alex@conversions.com' ? 'rgba(91,71,245,0.04)' : 'transparent',
                          }}
                        >
                          <td style={{ padding: '7px 8px', color: '#1e293b', fontWeight: lead.email === 'alex@conversions.com' ? 700 : 400 }}>
                            {lead.email}
                          </td>
                          <td style={{ padding: '7px 8px', color: '#64748b' }}>{lead.source}</td>
                          <td style={{ padding: '7px 8px', color: '#64748b' }}>{lead.page}</td>
                          <td style={{ padding: '7px 8px', color: '#94a3b8' }}>{lead.date}</td>
                          <td style={{ padding: '7px 8px' }}>
                            {lead.enriched ? (
                              <span style={{ fontSize: 9, fontWeight: 700, padding: '2px 7px', borderRadius: 20, background: '#dcfce7', color: '#16a34a', letterSpacing: '0.03em' }}>
                                ENRICHI
                              </span>
                            ) : (
                              <span style={{ fontSize: 9, fontWeight: 600, padding: '2px 7px', borderRadius: 20, background: '#f1f5f9', color: '#94a3b8' }}>
                                En attente
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          {/* ── Carte détail lead ─────────────────────────────────── */}
          <div
            style={{
              position: 'relative',
              zIndex: 10,
              // Desktop : overlap sur le dashboard
              marginLeft: 'clamp(0px, -220px, -220px)',
              marginTop: 'clamp(0px, 60px, 60px)',
              // Animation
              opacity: triggered ? 1 : 0,
              transform: triggered ? 'translateX(0)' : 'translateX(48px)',
              transition: 'opacity 600ms 300ms cubic-bezier(0.16,1,0.3,1), transform 600ms 300ms cubic-bezier(0.16,1,0.3,1)',
              willChange: 'transform, opacity',
              // Mobile : reset les marges négatives
              flexShrink: 0,
              width: 260,
            }}
            className="lead-card-wrapper"
          >
            <div
              style={{
                background: 'rgba(15,18,40,0.82)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                border: '1px solid rgba(255,255,255,0.12)',
                borderRadius: 20,
                padding: '20px',
                boxShadow: '0 24px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(91,71,245,0.15)',
                width: 260,
              }}
            >
              {/* Badge */}
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '4px 10px',
                  borderRadius: 20,
                  background: 'rgba(22,163,74,0.2)',
                  border: '1px solid rgba(22,163,74,0.4)',
                  marginBottom: 14,
                }}
              >
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#4ade80' }} />
                <span style={{ fontSize: 10, fontWeight: 700, color: '#4ade80', letterSpacing: '0.06em' }}>
                  LEAD ENRICHI
                </span>
              </div>

              {/* Avatar + identité */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                <img
                  src="https://i.pravatar.cc/48?img=12"
                  alt="Alexandre Martin"
                  width={48}
                  height={48}
                  style={{ borderRadius: '50%', border: '2px solid rgba(91,71,245,0.4)', flexShrink: 0 }}
                />
                <div>
                  <div style={{ fontWeight: 700, color: '#fff', fontSize: 14, lineHeight: 1.3 }}>
                    Alexandre Martin
                  </div>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', marginTop: 2 }}>
                    alex@conversions.com
                  </div>
                </div>
              </div>

              {/* Divider */}
              <div style={{ height: 1, background: 'rgba(255,255,255,0.08)', marginBottom: 14 }} />

              {/* Données lead */}
              <div style={{ marginBottom: 14 }}>
                <div style={{ fontSize: 9, fontWeight: 700, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 10 }}>
                  Données Lead
                </div>
                {[
                  {
                    icon: (
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="rgba(167,139,250,0.8)">
                        <path d="M20 7H4a2 2 0 00-2 2v6a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2zM4 11h2v2H4v-2zm14 2h-8v-2h8v2z"/>
                      </svg>
                    ),
                    label: 'Industrie',
                    value: 'E-commerce',
                  },
                  {
                    icon: (
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="rgba(167,139,250,0.8)">
                        <path d="M12 7V3H2v18h20V7H12zM6 19H4v-2h2v2zm0-4H4v-2h2v2zm0-4H4V9h2v2zm0-4H4V5h2v2zm4 12H8v-2h2v2zm0-4H8v-2h2v2zm0-4H8V9h2v2zm0-4H8V5h2v2zm10 12h-8v-2h2v-2h-2v-2h2v-2h-2V9h8v10z"/>
                      </svg>
                    ),
                    label: 'Entreprise',
                    value: 'Konvert Co.',
                  },
                  {
                    icon: (
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="rgba(167,139,250,0.8)">
                        <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 3c1.93 0 3.5 1.57 3.5 3.5S13.93 13 12 13s-3.5-1.57-3.5-3.5S10.07 6 12 6zm7 13H5v-.23c0-.62.28-1.2.76-1.58C7.47 15.82 9.64 15 12 15s4.53.82 6.24 2.19c.48.38.76.97.76 1.58V19z"/>
                      </svg>
                    ),
                    label: 'Formulaires soumis',
                    value: '5',
                  },
                ].map((row) => (
                  <div
                    key={row.label}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: 8,
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      {row.icon}
                      <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)' }}>{row.label}</span>
                    </div>
                    <span style={{ fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.85)' }}>
                      {row.value}
                    </span>
                  </div>
                ))}
              </div>

              {/* Bouton */}
              <button
                style={{
                  width: '100%',
                  padding: '9px 0',
                  borderRadius: 10,
                  border: '1.5px solid rgba(181,242,61,0.5)',
                  background: 'rgba(181,242,61,0.08)',
                  color: '#b5f23d',
                  fontSize: 11,
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 6,
                  transition: 'background 200ms',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(181,242,61,0.16)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(181,242,61,0.08)'
                }}
              >
                <span>+</span> Voir les données enrichies
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* CSS responsive pour la carte */}
      <style dangerouslySetInnerHTML={{
        __html: `
          @media (max-width: 1023px) {
            .lead-card-wrapper {
              margin-left: 0 !important;
              margin-top: 0 !important;
              width: 100% !important;
              max-width: 320px !important;
            }
            .lead-card-wrapper > div {
              width: 100% !important;
            }
          }
        `
      }} />
    </section>
  )
}
