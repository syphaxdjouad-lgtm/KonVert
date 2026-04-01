export default function PolitiqueConfidentialite() {
  return (
    <div style={{ background: '#04010a', minHeight: '100vh', color: '#ffffff', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>
      <div style={{ maxWidth: '760px', margin: '0 auto', padding: '80px 24px' }}>
        <a href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'rgba(167,139,250,0.6)', fontSize: '13px', marginBottom: '40px', textDecoration: 'none' }}>
          ← Retour
        </a>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '8px', letterSpacing: '-0.02em' }}>Politique de confidentialité</h1>
        <p style={{ color: 'rgba(196,181,253,0.5)', fontSize: '13px', marginBottom: '48px' }}>Dernière mise à jour : Mars 2026</p>

        {[
          {
            title: 'Données collectées',
            content: `Dans le cadre de l'utilisation de KONVERT, NEXARA SAS collecte les données suivantes :\n\n• Données d'identification : nom, prénom, adresse email\n• Données de connexion : adresse IP, logs d'accès, type de navigateur\n• Données de facturation : informations de paiement (traitées par Stripe, jamais stockées chez nous)\n• Données d'usage : pages générées, prompts soumis, interactions avec le service\n• Données de préférence : paramètres de compte, historique des générations`,
          },
          {
            title: 'Finalité du traitement',
            content: `Vos données sont collectées pour les finalités suivantes :\n\n• Fourniture et amélioration du service KONVERT\n• Gestion de votre compte et de votre abonnement\n• Facturation et prévention de la fraude\n• Support client et communication relative au service\n• Analyses statistiques d'usage (sous forme agrégée et anonymisée)\n• Conformité aux obligations légales et réglementaires`,
          },
          {
            title: 'Base légale du traitement',
            content: `Les traitements de données opérés par NEXARA SAS reposent sur les bases légales suivantes :\n\n• Exécution contractuelle : traitement nécessaire à la fourniture du service\n• Intérêt légitime : amélioration du service, sécurité informatique, prévention des abus\n• Obligation légale : conservation des données de facturation (10 ans)\n• Consentement : communications marketing (révocable à tout moment)`,
          },
          {
            title: 'Durée de conservation',
            content: `Vos données sont conservées pendant les durées suivantes :\n\n• Données de compte : durée de vie du compte + 3 ans après résiliation\n• Données de facturation : 10 ans (obligation comptable légale)\n• Logs de connexion : 12 mois\n• Données de support : 3 ans après clôture du ticket\n• Cookies analytiques : 13 mois maximum`,
          },
          {
            title: 'Vos droits RGPD',
            content: `Conformément au Règlement Général sur la Protection des Données (RGPD), vous disposez des droits suivants :\n\n• Droit d'accès : obtenir une copie de vos données\n• Droit de rectification : corriger des données inexactes\n• Droit à l'effacement : demander la suppression de vos données\n• Droit à la limitation : restreindre certains traitements\n• Droit à la portabilité : récupérer vos données dans un format structuré\n• Droit d'opposition : vous opposer à certains traitements\n\nPour exercer ces droits, contactez notre DPO à l'adresse ci-dessous.`,
          },
          {
            title: 'Contact DPO',
            content: `Délégué à la Protection des Données (DPO) NEXARA SAS\nEmail : privacy@konvert.app\nAdresse : [ADRESSE À COMPLÉTER], France\n\nEn cas de réponse insatisfaisante, vous pouvez introduire une réclamation auprès de la CNIL (Commission Nationale de l'Informatique et des Libertés) — cnil.fr.`,
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
