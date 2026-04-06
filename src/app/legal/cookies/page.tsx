export default function PolitiqueCookies() {
  return (
    <div style={{ background: '#04010a', minHeight: '100vh', color: '#ffffff', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>
      <div style={{ maxWidth: '760px', margin: '0 auto', padding: '80px 24px' }}>
        <a href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'rgba(167,139,250,0.6)', fontSize: '13px', marginBottom: '40px', textDecoration: 'none' }}>
          ← Retour
        </a>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '8px', letterSpacing: '-0.02em' }}>Politique des cookies</h1>
        <p style={{ color: 'rgba(196,181,253,0.5)', fontSize: '13px', marginBottom: '48px' }}>Dernière mise à jour : Mars 2026</p>

        {[
          {
            title: "Qu'est-ce qu'un cookie ?",
            content: `Un cookie est un petit fichier texte déposé sur votre terminal (ordinateur, tablette, smartphone) lors de votre visite sur un site web. Il permet au site de reconnaître votre navigateur lors des visites ultérieures et de mémoriser certaines informations vous concernant.\n\nLes cookies ne contiennent pas de virus et ne peuvent pas endommager votre appareil. Ils contribuent à améliorer votre expérience utilisateur et à analyser l'utilisation du service.`,
          },
          {
            title: 'Cookies utilisés par KONVERT',
            content: `KONVERT utilise trois catégories de cookies :\n\n**Cookies de session (essentiels)**\nCes cookies sont indispensables au fonctionnement du service. Ils maintiennent votre session active, sécurisent vos échanges et mémorisent vos préférences de navigation. Ils ne peuvent pas être désactivés.\n— Durée : session en cours\n— Exemples : session_id, csrf_token, auth_token\n\n**Cookies analytiques**\nCes cookies nous aident à comprendre comment les visiteurs utilisent KONVERT afin d'améliorer continuellement le service. Ils collectent des données de manière anonymisée et agrégée.\n— Fournisseur : Vercel Analytics\n— Durée : 13 mois maximum\n— Données : pages visitées, durée de session, source de trafic\n\n**Cookies Stripe (paiement)**\nLors du processus de paiement, Stripe dépose des cookies pour sécuriser les transactions et prévenir la fraude. Ces cookies sont gérés directement par Stripe Inc.\n— Fournisseur : Stripe Inc.\n— Durée : 2 ans\n— Politique de confidentialité : stripe.com/privacy`,
          },
          {
            title: 'Gestion des cookies',
            content: `Vous pouvez contrôler et gérer les cookies de plusieurs façons :\n\n**Via votre navigateur**\nTous les navigateurs modernes permettent de bloquer, supprimer ou être notifié lors du dépôt de cookies. Consultez l'aide de votre navigateur pour accéder à ces paramètres :\n— Chrome : Paramètres > Confidentialité et sécurité > Cookies\n— Firefox : Préférences > Vie privée et sécurité\n— Safari : Préférences > Confidentialité\n\n**Conséquences du blocage**\nSi vous désactivez les cookies essentiels, certaines fonctionnalités de KONVERT peuvent ne plus fonctionner correctement, notamment l'authentification et le paiement.\n\nPour toute question concernant notre utilisation des cookies, contactez-nous à privacy@konvert.app.`,
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
