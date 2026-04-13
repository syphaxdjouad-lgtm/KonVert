'use client'

const BADGES = [
  {
    label: 'SSL Sécurisé',
    color: '#10b981',
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M12 2L4 5v6.09c0 5.05 3.41 9.76 8 10.91 4.59-1.15 8-5.86 8-10.91V5l-8-3z" fill="#10b981" />
        <path d="M9 12l2 2 4-4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    label: 'Paiement Stripe',
    color: '#635BFF',
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="#635BFF" aria-hidden="true">
        <path d="M13.976 9.15c-2.172-.806-3.356-1.426-3.356-2.409 0-.831.683-1.305 1.901-1.305 2.227 0 4.515.858 6.09 1.631l.89-5.494C18.252.975 15.697 0 12.165 0 9.667 0 7.589.654 6.104 1.872 4.56 3.147 3.757 4.992 3.757 7.218c0 4.039 2.467 5.76 6.476 7.219 2.585.92 3.445 1.574 3.445 2.583 0 .98-.84 1.545-2.354 1.545-1.875 0-4.965-.921-6.99-2.109l-.9 5.555C5.175 22.99 8.385 24 11.714 24c2.641 0 4.843-.624 6.328-1.813 1.664-1.305 2.525-3.236 2.525-5.732 0-4.128-2.524-5.851-6.594-7.305h.003z" />
      </svg>
    ),
  },
  {
    label: 'RGPD Conforme',
    color: '#5B47F5',
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M12 2L4 5v6.09c0 5.05 3.41 9.76 8 10.91 4.59-1.15 8-5.86 8-10.91V5l-8-3z" fill="#5B47F5" />
        <path d="M9 12l2 2 4-4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    label: 'Sans engagement',
    color: '#10b981',
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle cx="12" cy="12" r="10" fill="#10b981" />
        <path d="M8 12l3 3 5-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
]

interface TrustBadgesProps {
  dark?: boolean
  className?: string
}

export default function TrustBadges({ dark = false, className = '' }: TrustBadgesProps) {
  return (
    <div className={`flex flex-wrap items-center justify-center gap-2 ${className}`}>
      {BADGES.map(({ label, color, icon }) => (
        <div
          key={label}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold"
          style={{
            background: dark ? 'rgba(255,255,255,0.06)' : `${color}14`,
            border: `1px solid ${dark ? 'rgba(255,255,255,0.1)' : `${color}35`}`,
            color: dark ? '#c4b5fd' : color,
          }}
        >
          {icon}
          {label}
        </div>
      ))}
    </div>
  )
}
