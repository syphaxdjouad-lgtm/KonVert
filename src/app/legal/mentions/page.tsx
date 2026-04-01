export default function MentionsLegales() {
  return (
    <div style={{ background: '#04010a', minHeight: '100vh', color: '#ffffff', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>
      <div style={{ maxWidth: '760px', margin: '0 auto', padding: '80px 24px' }}>
        <a href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'rgba(167,139,250,0.6)', fontSize: '13px', marginBottom: '40px', textDecoration: 'none' }}>
          ← Retour
        </a>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '8px', letterSpacing: '-0.02em' }}>Mentions légales</h1>
        <p style={{ color: 'rgba(196,181,253,0.5)', fontSize: '13px', marginBottom: '48px' }}>Dernière mise à jour : Mars 2026</p>

        {[
          {
            title: 'Éditeur du site',
            content: `KONVERT est édité par NEXARA SAS, société par actions simplifiée au capital de 1 000€, immatriculée au RCS de Paris sous le numéro [RCS À COMPLÉTER].\n\nSiège social : [ADRESSE À COMPLÉTER], France\nEmail : contact@konvert.app\nDirecteur de publication : [NOM À COMPLÉTER]`,
          },
          {
            title: 'Hébergement',
            content: `Le site est hébergé par :\nVercel Inc.\n440 N Barranca Ave #4133, Covina, CA 91723, USA\nSite : vercel.com`,
          },
          {
            title: 'Propriété intellectuelle',
            content: `L'ensemble du contenu de ce site (textes, images, code, design) est protégé par le droit d'auteur et appartient à NEXARA SAS. Toute reproduction, même partielle, est interdite sans autorisation écrite préalable.\n\nLes marques, logos et signes distinctifs reproduits sur ce site sont la propriété exclusive de NEXARA SAS. Toute utilisation non autorisée constitue une contrefaçon.`,
          },
          {
            title: 'Limitation de responsabilité',
            content: `KONVERT s'efforce d'assurer l'exactitude des informations diffusées sur ce site. Cependant, KONVERT ne peut garantir l'exactitude, la complétude et l'actualité des informations diffusées.\n\nKONVERT décline toute responsabilité pour tout dommage direct ou indirect résultant de l'utilisation de ce site ou de l'impossibilité d'y accéder.`,
          },
          {
            title: 'Liens hypertextes',
            content: `Ce site peut contenir des liens vers des sites tiers. KONVERT n'exerce aucun contrôle sur ces sites et décline toute responsabilité quant à leur contenu ou leurs pratiques en matière de données personnelles.`,
          },
          {
            title: 'Droit applicable',
            content: `Les présentes mentions légales sont soumises au droit français. En cas de litige, les tribunaux français seront seuls compétents.`,
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
