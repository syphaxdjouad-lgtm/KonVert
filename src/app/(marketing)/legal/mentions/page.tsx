import { Scale } from 'lucide-react'

export const metadata = { title: 'Mentions légales — KONVERT' }

export default function MentionsPage() {
  return (
    <div className="min-h-screen py-24 px-4" style={{ background: '#fafafa' }}>
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <div className="flex items-center gap-3 mb-10">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(124,58,237,0.08)' }}>
            <Scale className="w-5 h-5" style={{ color: '#7c3aed' }} />
          </div>
          <div>
            <h1 className="text-2xl font-black" style={{ color: '#111' }}>Mentions légales</h1>
            <p className="text-sm" style={{ color: '#9ca3af' }}>Mise à jour : avril 2026</p>
          </div>
        </div>

        <div className="space-y-8">
          <Section title="Éditeur du site">
            <p>Le site <strong>konvert.app</strong> est édité par :</p>
            <ul>
              <li><strong>Raison sociale :</strong> NEXARA</li>
              <li><strong>Statut :</strong> Auto-entrepreneur</li>
              <li><strong>Email :</strong> <a href="mailto:contact@konvert.app" style={{ color: '#7c3aed' }}>contact@konvert.app</a></li>
            </ul>
          </Section>

          <Section title="Hébergement">
            <ul>
              <li><strong>Hébergeur :</strong> Vercel Inc.</li>
              <li><strong>Adresse :</strong> 340 Pine Street, Suite 701, San Francisco, CA 94104, États-Unis</li>
              <li><strong>Site :</strong> <a href="https://vercel.com" style={{ color: '#7c3aed' }}>vercel.com</a></li>
            </ul>
          </Section>

          <Section title="Propriété intellectuelle">
            <p>
              L&apos;ensemble du contenu de ce site (textes, images, logo, interface, code) est protégé par le droit d&apos;auteur et appartient à NEXARA, sauf mention contraire.
              Toute reproduction, même partielle, est interdite sans autorisation préalable.
            </p>
          </Section>

          <Section title="Données personnelles">
            <p>
              Les données collectées lors de l&apos;utilisation de KONVERT sont traitées conformément à notre{' '}
              <a href="/legal/privacy" style={{ color: '#7c3aed' }}>Politique de confidentialité</a>.
            </p>
          </Section>

          <Section title="Contact">
            <p>
              Pour toute question, vous pouvez nous écrire à{' '}
              <a href="mailto:contact@konvert.app" style={{ color: '#7c3aed' }}>contact@konvert.app</a>.
            </p>
          </Section>
        </div>
      </div>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl p-6" style={{ background: '#fff', border: '1px solid #e5e7eb' }}>
      <h2 className="text-base font-black mb-4" style={{ color: '#111' }}>{title}</h2>
      <div className="text-sm space-y-2 [&_ul]:space-y-1.5 [&_ul]:list-none [&_ul]:pl-0 [&_p]:leading-relaxed" style={{ color: '#6b7280' }}>
        {children}
      </div>
    </div>
  )
}
