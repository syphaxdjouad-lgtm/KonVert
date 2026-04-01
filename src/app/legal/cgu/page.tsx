export default function CGU() {
  return (
    <div style={{ background: '#04010a', minHeight: '100vh', color: '#ffffff', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>
      <div style={{ maxWidth: '760px', margin: '0 auto', padding: '80px 24px' }}>
        <a href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'rgba(167,139,250,0.6)', fontSize: '13px', marginBottom: '40px', textDecoration: 'none' }}>
          ← Retour
        </a>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '8px', letterSpacing: '-0.02em' }}>Conditions Générales d&apos;Utilisation</h1>
        <p style={{ color: 'rgba(196,181,253,0.5)', fontSize: '13px', marginBottom: '48px' }}>Dernière mise à jour : Mars 2026</p>

        {[
          {
            title: '1. Objet',
            content: `Les présentes Conditions Générales d'Utilisation (CGU) régissent l'accès et l'utilisation de la plateforme KONVERT, éditée par NEXARA SAS. En accédant au service, vous acceptez sans réserve les présentes CGU.\n\nKONVERT est une solution SaaS permettant de générer des landing pages e-commerce optimisées pour la conversion grâce à l'intelligence artificielle.`,
          },
          {
            title: '2. Accès au service',
            content: `L'accès à KONVERT est conditionné à la création d'un compte utilisateur. Le service est disponible 24h/24, 7j/7, sous réserve des opérations de maintenance ou d'incidents techniques indépendants de notre volonté.\n\nNEXARA SAS se réserve le droit de suspendre temporairement l'accès pour des raisons de maintenance, de sécurité ou d'évolution du service.`,
          },
          {
            title: '3. Compte utilisateur',
            content: `Lors de votre inscription, vous vous engagez à fournir des informations exactes et à les maintenir à jour. Vous êtes seul responsable de la confidentialité de vos identifiants de connexion.\n\nTout accès frauduleux ou utilisation abusive de votre compte doit être signalé immédiatement à support@konvert.app. NEXARA SAS ne saurait être tenu responsable des dommages résultant d'un accès non autorisé à votre compte.`,
          },
          {
            title: '4. Plans et facturation',
            content: `KONVERT propose plusieurs formules d'abonnement (Gratuit, Pro, Business). Les tarifs sont indiqués en euros TTC sur la page de tarification.\n\nLes abonnements payants sont facturés mensuellement ou annuellement selon votre choix. Les paiements sont traités de manière sécurisée par Stripe. Vous pouvez résilier votre abonnement à tout moment depuis votre espace personnel, sans frais de résiliation.`,
          },
          {
            title: '5. Propriété intellectuelle',
            content: `Le contenu généré par KONVERT (landing pages, textes, visuels) vous appartient intégralement. Vous disposez d'une licence pleine et entière sur les outputs produits par le service.\n\nEn revanche, la plateforme KONVERT, son code source, son design, ses algorithmes et sa documentation restent la propriété exclusive de NEXARA SAS. Toute reproduction ou utilisation non autorisée est strictement interdite.`,
          },
          {
            title: '6. Données personnelles',
            content: `NEXARA SAS traite vos données personnelles conformément au RGPD. Pour plus d'informations sur la collecte, le traitement et vos droits, consultez notre Politique de confidentialité disponible sur /legal/privacy.`,
          },
          {
            title: '7. Résiliation',
            content: `Vous pouvez résilier votre compte à tout moment depuis votre espace personnel. La résiliation prend effet à la fin de la période de facturation en cours pour les abonnements payants.\n\nNEXARA SAS se réserve le droit de suspendre ou supprimer tout compte en cas de violation des présentes CGU, sans préavis ni remboursement.`,
          },
          {
            title: '8. Loi applicable',
            content: `Les présentes CGU sont régies par le droit français. En cas de litige, et après tentative de résolution amiable, les tribunaux compétents de Paris seront saisis. L'utilisateur consommateur peut également recourir à la médiation conformément aux dispositions du Code de la consommation.`,
          },
        ].map(({ title, content }) => (
          <div key={title} style={{ marginBottom: '36px' }}>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '12px', color: '#a78bfa' }}>{title}</h2>
            <p style={{ fontSize: '14px', lineHeight: '1.8', color: 'rgba(196,181,253,0.7)', whiteSpace: 'pre-line' }}>{content}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
