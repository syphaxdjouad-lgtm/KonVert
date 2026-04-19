import { ShieldCheck } from 'lucide-react'

export const metadata = { title: 'Politique de confidentialité — KONVERT' }

export default function PrivacyPage() {
  return (
    <div className="min-h-screen py-24 px-4" style={{ background: '#fafafa' }}>
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <div className="flex items-center gap-3 mb-10">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(124,58,237,0.08)' }}>
            <ShieldCheck className="w-5 h-5" style={{ color: '#7c3aed' }} />
          </div>
          <div>
            <h1 className="text-2xl font-black" style={{ color: '#111' }}>Politique de confidentialité</h1>
            <p className="text-sm" style={{ color: '#9ca3af' }}>Mise à jour : avril 2026</p>
          </div>
        </div>

        <div className="space-y-8">
          <Section title="Données collectées">
            <p>Lors de votre utilisation de KONVERT, nous collectons les données suivantes :</p>
            <ul>
              <li>• <strong>Compte :</strong> adresse email, nom (lors de l&apos;inscription)</li>
              <li>• <strong>Paiement :</strong> informations de facturation traitées par Stripe — NEXARA ne stocke aucune donnée bancaire</li>
              <li>• <strong>Usage :</strong> pages créées, boutiques connectées, événements d&apos;analytics (vues, clics)</li>
              <li>• <strong>Techniques :</strong> adresse IP hashée (anonymisée), user-agent pour les statistiques de pages publiées</li>
            </ul>
          </Section>

          <Section title="Finalité du traitement">
            <ul>
              <li>• Fourniture du service KONVERT (génération de pages, publication)</li>
              <li>• Gestion de votre abonnement et facturation</li>
              <li>• Envoi d&apos;emails liés à votre compte (bienvenue, trial, factures)</li>
              <li>• Amélioration du produit via des données d&apos;usage agrégées et anonymisées</li>
            </ul>
          </Section>

          <Section title="Base légale">
            <p>
              Le traitement de vos données est fondé sur l&apos;exécution du contrat (CGU) que vous acceptez lors de votre inscription,
              ainsi que sur votre consentement pour les communications marketing.
            </p>
          </Section>

          <Section title="Conservation des données">
            <ul>
              <li>• <strong>Données de compte :</strong> conservées pendant la durée de votre abonnement + 3 ans après résiliation</li>
              <li>• <strong>Données d&apos;analytics :</strong> conservées 13 mois glissants</li>
              <li>• <strong>Données de facturation :</strong> conservées 10 ans (obligation légale)</li>
            </ul>
          </Section>

          <Section title="Sous-traitants">
            <ul>
              <li>• <strong>Supabase</strong> — base de données et authentification (EU)</li>
              <li>• <strong>Stripe</strong> — paiement (certifié PCI-DSS)</li>
              <li>• <strong>Vercel</strong> — hébergement (région Paris cdg1)</li>
              <li>• <strong>Resend</strong> — envoi d&apos;emails transactionnels</li>
              <li>• <strong>Anthropic</strong> — génération IA du contenu</li>
            </ul>
          </Section>

          <Section title="Vos droits (RGPD)">
            <p>Vous disposez des droits suivants sur vos données :</p>
            <ul>
              <li>• Accès, rectification, suppression</li>
              <li>• Portabilité et opposition au traitement</li>
              <li>• Retrait du consentement à tout moment</li>
            </ul>
            <p className="mt-3">
              Pour exercer ces droits, écrivez à{' '}
              <a href="mailto:privacy@konvert.app" style={{ color: '#7c3aed' }}>privacy@konvert.app</a>.
              Vous pouvez également supprimer votre compte depuis les paramètres du dashboard.
            </p>
          </Section>

          <Section title="Cookies">
            <p>
              KONVERT utilise uniquement des cookies strictement nécessaires au fonctionnement du service
              (session d&apos;authentification). Aucun cookie publicitaire ou de tracking tiers n&apos;est déposé.
            </p>
          </Section>

          <Section title="Contact">
            <p>
              Pour toute question relative à la protection de vos données :{' '}
              <a href="mailto:privacy@konvert.app" style={{ color: '#7c3aed' }}>privacy@konvert.app</a>
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
