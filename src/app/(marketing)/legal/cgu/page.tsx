import { FileText } from 'lucide-react'

export const metadata = { title: "Conditions générales d'utilisation — KONVERT" }

export default function CguPage() {
  return (
    <div className="min-h-screen py-24 px-4" style={{ background: '#fafafa' }}>
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <div className="flex items-center gap-3 mb-10">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(124,58,237,0.08)' }}>
            <FileText className="w-5 h-5" style={{ color: '#7c3aed' }} />
          </div>
          <div>
            <h1 className="text-2xl font-black" style={{ color: '#111' }}>Conditions générales d&apos;utilisation</h1>
            <p className="text-sm" style={{ color: '#9ca3af' }}>Mise à jour : avril 2026</p>
          </div>
        </div>

        <div className="space-y-8">
          <Section title="1. Objet">
            <p>
              Les présentes CGU régissent l&apos;accès et l&apos;utilisation du service KONVERT, accessible à l&apos;adresse <strong>konvert.app</strong>,
              édité par NEXARA. En créant un compte, vous acceptez sans réserve les présentes conditions.
            </p>
          </Section>

          <Section title="2. Description du service">
            <p>
              KONVERT est un outil SaaS permettant de générer des landing pages produit optimisées pour la conversion, à l&apos;aide de l&apos;intelligence artificielle,
              et de les publier directement sur des boutiques Shopify ou WooCommerce.
            </p>
          </Section>

          <Section title="3. Accès et compte">
            <ul>
              <li>• L&apos;accès au service est réservé aux personnes majeures ayant créé un compte valide.</li>
              <li>• Vous êtes responsable de la confidentialité de vos identifiants.</li>
              <li>• Pendant la période de bêta privée, l&apos;accès est soumis à invitation.</li>
              <li>• NEXARA se réserve le droit de suspendre un compte en cas d&apos;utilisation abusive.</li>
            </ul>
          </Section>

          <Section title="4. Abonnement et paiement">
            <ul>
              <li>• Les plans sont facturés mensuellement ou annuellement via Stripe.</li>
              <li>• Une page gratuite est offerte pour tester le service sans obligation d&apos;achat.</li>
              <li>• L&apos;abonnement se renouvelle automatiquement à la date d&apos;échéance.</li>
              <li>• Vous pouvez annuler à tout moment depuis les paramètres de votre compte.</li>
              <li>• En cas d&apos;annulation, l&apos;accès reste actif jusqu&apos;à la fin de la période en cours.</li>
            </ul>
          </Section>

          <Section title="5. Remboursement">
            <p>
              NEXARA propose une garantie satisfait ou remboursé de <strong>30 jours</strong> à compter de la première souscription payante.
              Pour en bénéficier, contactez <a href="mailto:contact@konvert.app" style={{ color: '#7c3aed' }}>contact@konvert.app</a>.
            </p>
          </Section>

          <Section title="6. Propriété du contenu">
            <ul>
              <li>• Les pages générées par KONVERT vous appartiennent entièrement.</li>
              <li>• Vous accordez à NEXARA une licence limitée pour afficher et stocker ces contenus dans le cadre du service.</li>
              <li>• Vous vous engagez à ne pas utiliser KONVERT pour générer du contenu illégal, trompeur ou portant atteinte aux droits de tiers.</li>
            </ul>
          </Section>

          <Section title="7. Disponibilité et support">
            <p>
              NEXARA s&apos;engage à maintenir le service disponible 24h/7j avec un objectif de disponibilité de 99%.
              En cas d&apos;incident, des informations sont publiées sur <a href="/status" style={{ color: '#7c3aed' }}>konvert.app/status</a>.
              Le support est disponible par email à <a href="mailto:contact@konvert.app" style={{ color: '#7c3aed' }}>contact@konvert.app</a>.
            </p>
          </Section>

          <Section title="8. Limitation de responsabilité">
            <p>
              KONVERT est un outil d&apos;aide à la création de contenu. Les résultats en termes de conversion dépendent de nombreux facteurs
              indépendants de la plateforme (trafic, offre produit, prix…). NEXARA ne saurait être tenu responsable des performances
              commerciales de l&apos;utilisateur.
            </p>
          </Section>

          <Section title="9. Modification des CGU">
            <p>
              NEXARA se réserve le droit de modifier les présentes CGU à tout moment. En cas de modification substantielle,
              vous serez notifié par email au moins 15 jours avant l&apos;entrée en vigueur des nouvelles conditions.
            </p>
          </Section>

          <Section title="10. Droit applicable">
            <p>
              Les présentes CGU sont soumises au droit français. Tout litige sera soumis à la compétence des tribunaux français.
            </p>
          </Section>
        </div>

        {/* Liens légaux */}
        <div className="mt-8 flex gap-4 text-xs" style={{ color: '#9ca3af' }}>
          <a href="/legal/mentions" style={{ color: '#7c3aed' }}>Mentions légales</a>
          <a href="/legal/privacy" style={{ color: '#7c3aed' }}>Politique de confidentialité</a>
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
