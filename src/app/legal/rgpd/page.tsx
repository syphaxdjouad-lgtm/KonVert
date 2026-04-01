export default function RGPD() {
  return (
    <div style={{ background: '#04010a', minHeight: '100vh', color: '#ffffff', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>
      <div style={{ maxWidth: '760px', margin: '0 auto', padding: '80px 24px' }}>
        <a href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'rgba(167,139,250,0.6)', fontSize: '13px', marginBottom: '40px', textDecoration: 'none' }}>
          ← Retour
        </a>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '8px', letterSpacing: '-0.02em' }}>Conformité RGPD</h1>
        <p style={{ color: 'rgba(196,181,253,0.5)', fontSize: '13px', marginBottom: '48px' }}>Dernière mise à jour : Mars 2026</p>

        {[
          {
            title: 'Responsable de traitement',
            content: `Le responsable du traitement de vos données personnelles est :\n\nNEXARA SAS\nSiège social : [ADRESSE À COMPLÉTER], France\nEmail : privacy@konvert.app\nSIRET : [SIRET À COMPLÉTER]\n\nNEXARA SAS est engagée dans une démarche de conformité continue au Règlement Général sur la Protection des Données (RGPD — Règlement UE 2016/679).`,
          },
          {
            title: 'Données traitées',
            content: `Dans le cadre de son activité, NEXARA SAS traite les catégories de données suivantes :\n\n• Données d'identité : nom, prénom, adresse email professionnelle\n• Données techniques : adresse IP, identifiants de session, logs d'utilisation\n• Données commerciales : historique des abonnements, facturation\n• Données de contenu : prompts et pages générées via le service IA\n• Données comportementales : navigation, interactions avec l'interface\n\nAucune donnée sensible au sens de l'article 9 du RGPD (origine raciale, données de santé, etc.) n'est collectée ou traitée.`,
          },
          {
            title: 'Droits des utilisateurs',
            content: `Conformément aux articles 15 à 22 du RGPD, vous disposez des droits suivants sur vos données personnelles :`,
          },
          {
            title: 'Droit d\'accès (Art. 15)',
            content: `Vous pouvez demander à tout moment une copie complète de vos données personnelles que nous détenons. Nous disposons d'un délai d'un mois pour répondre à votre demande.\n\nComment l'exercer : connectez-vous à votre compte > Paramètres > Mes données, ou envoyez un email à privacy@konvert.app avec l'objet "Demande d'accès RGPD".`,
          },
          {
            title: 'Droit de rectification (Art. 16)',
            content: `Si vos données personnelles sont inexactes ou incomplètes, vous pouvez demander leur correction à tout moment depuis votre espace personnel ou en nous contactant directement.\n\nLes modifications prennent effet immédiatement pour les données de compte. Pour les données de facturation, des justificatifs peuvent être requis.`,
          },
          {
            title: 'Droit à l\'effacement (Art. 17)',
            content: `Vous pouvez demander la suppression de vos données personnelles, sauf lorsque leur conservation est imposée par une obligation légale (ex. données de facturation conservées 10 ans).\n\nLa suppression de votre compte entraîne l'effacement de l'ensemble de vos données dans un délai de 30 jours, sous réserve des obligations légales de conservation.`,
          },
          {
            title: 'Droit à la portabilité (Art. 20)',
            content: `Vous avez le droit de recevoir vos données dans un format structuré, couramment utilisé et lisible par machine (JSON ou CSV), et de les transmettre à un autre responsable de traitement.\n\nCe droit s'applique aux données que vous nous avez fourni activement et qui sont traitées sur base de votre consentement ou d'un contrat.`,
          },
          {
            title: 'Contact pour exercer vos droits',
            content: `Pour exercer l'un de vos droits RGPD :\n\nEmail : privacy@konvert.app\nObjet : "Exercice de droits RGPD — [Type de demande]"\n\nNous accusons réception sous 72 heures et traitons votre demande dans un délai d'un mois (prolongeable à 3 mois pour les demandes complexes).\n\nEn cas de réponse insatisfaisante, vous pouvez déposer une plainte auprès de la CNIL :\ncnil.fr · 3 Place de Fontenoy, 75007 Paris · Tel : +33 1 53 73 22 22`,
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
