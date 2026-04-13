import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'KONVERT — Tes produits méritent des pages qui vendent'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '1200px',
          height: '630px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #08080f 0%, #0f0f2e 50%, #1a0a3e 100%)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Orb violet background */}
        <div
          style={{
            position: 'absolute',
            width: '600px',
            height: '600px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(91,71,245,0.35) 0%, transparent 70%)',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
          }}
        />

        {/* Top accent line */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '3px',
            background: 'linear-gradient(90deg, transparent, #5B47F5, #8b77ff, transparent)',
          }}
        />

        {/* Logo badge */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            background: 'rgba(91,71,245,0.15)',
            border: '1px solid rgba(91,71,245,0.4)',
            borderRadius: '999px',
            padding: '10px 24px',
            marginBottom: '28px',
          }}
        >
          <div
            style={{
              width: '28px',
              height: '28px',
              background: 'linear-gradient(135deg, #5B47F5, #8b77ff)',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontWeight: 900,
              fontSize: '16px',
            }}
          >
            K
          </div>
          <span style={{ color: '#fff', fontSize: '20px', fontWeight: 700, letterSpacing: '-0.02em' }}>
            KONVERT
          </span>
        </div>

        {/* Headline */}
        <div
          style={{
            color: '#ffffff',
            fontSize: '54px',
            fontWeight: 900,
            textAlign: 'center',
            letterSpacing: '-0.03em',
            lineHeight: 1.1,
            maxWidth: '900px',
            marginBottom: '20px',
          }}
        >
          Tes produits méritent des pages
          <br />
          <span style={{ color: '#8b77ff' }}>qui vendent.</span>
        </div>

        {/* Tagline */}
        <div
          style={{
            color: 'rgba(255,255,255,0.55)',
            fontSize: '22px',
            textAlign: 'center',
            maxWidth: '680px',
            marginBottom: '36px',
            lineHeight: 1.5,
          }}
        >
          Génère ta landing page optimisée en 30 secondes.
          <br />
          SEO · Mobile · Shopify — prêt à vendre.
        </div>

        {/* Stats pills */}
        <div style={{ display: 'flex', gap: '16px' }}>
          {[
            { label: '50 000+', sub: 'pages générées' },
            { label: '+40%', sub: 'conversion moyenne' },
            { label: '30s', sub: 'pour créer ta page' },
          ].map((stat) => (
            <div
              key={stat.label}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '16px',
                padding: '14px 28px',
                gap: '4px',
              }}
            >
              <span style={{ color: '#8b77ff', fontSize: '26px', fontWeight: 800 }}>{stat.label}</span>
              <span style={{ color: 'rgba(255,255,255,0.45)', fontSize: '13px' }}>{stat.sub}</span>
            </div>
          ))}
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    },
  )
}
