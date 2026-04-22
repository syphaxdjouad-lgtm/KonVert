import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Politique de confidentialité — Konvert',
  description: 'Politique de confidentialité et RGPD du service Konvert — konvert.app',
}

export default function PrivacyPage() {
  return (
    <>
      <section className="pt-32 pb-14" style={{ background: 'linear-gradient(135deg, #08080f 0%, #0f0f2e 100%)' }}>
        <div className="max-w-3xl mx-auto px-5 sm:px-8 text-center">
          <h1 className="text-3xl sm:text-4xl font-black text-white mb-4">Politique de confidentialité</h1>
          <p className="text-sm" style={{ color: '#8b8baa' }}>Dernière mise à jour : 22 avril 2026 — Conforme RGPD</p>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-5 sm:px-8">

          <H2 first>1. Responsable du traitement</H2>
          <P>
            Le responsable du traitement des données personnelles est <strong>Konvert SAS</strong>, dont le siège
            social est situé en France. Pour toute question relative à vos données personnelles :{' '}
            <A href="mailto:privacy@konvert.app">privacy@konvert.app</A>.
          </P>

          <H2>2. Données collectées</H2>

          <h3 className="text-base font-semibold text-gray-800 mb-2 mt-4">Données d&apos;identification</h3>
          <Ul items={['Nom et prénom', 'Adresse email', 'Mot de passe (chiffré)']} />

          <h3 className="text-base font-semibold text-gray-800 mb-2">Données de facturation</h3>
          <Ul items={[
            'Informations de paiement (traitées par Stripe, jamais stockées sur nos serveurs)',
            'Adresse de facturation',
            'Historique des transactions',
          ]} />

          <h3 className="text-base font-semibold text-gray-800 mb-2">Données d&apos;utilisation</h3>
          <Ul items={[
            'Pages générées et leur contenu',
            "Boutiques connectées (URL, tokens d'accès OAuth)",
            "Statistiques d'utilisation (nombre de pages, vues, clics)",
          ]} />

          <h3 className="text-base font-semibold text-gray-800 mb-2">Données techniques</h3>
          <Ul items={[
            'Adresse IP',
            "Type de navigateur et système d'exploitation",
            'Pages visitées et durée de visite',
            'Cookies et identifiants de session',
          ]} />

          <H2>3. Finalités du traitement</H2>
          <div className="overflow-x-auto mb-6">
            <table className="w-full text-sm text-gray-600 border-collapse">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left py-3 pr-4 font-bold text-gray-900">Finalité</th>
                  <th className="text-left py-3 pr-4 font-bold text-gray-900">Base légale</th>
                  <th className="text-left py-3 font-bold text-gray-900">Durée</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['Gestion du compte utilisateur', 'Exécution du contrat', 'Durée du compte + 30 jours'],
                  ['Facturation et paiements', 'Obligation légale', '10 ans (obligation comptable)'],
                  ['Génération de landing pages', 'Exécution du contrat', 'Durée du compte + 30 jours'],
                  ['Emails transactionnels et séquences', 'Intérêt légitime', "Jusqu'à désinscription"],
                  ['Amélioration du Service', 'Intérêt légitime', '26 mois (données anonymisées)'],
                  ["Mesure d'audience", 'Consentement', '13 mois'],
                ].map(([f, b, d]) => (
                  <tr key={f} className="border-b border-gray-100">
                    <td className="py-3 pr-4">{f}</td>
                    <td className="py-3 pr-4">{b}</td>
                    <td className="py-3">{d}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <H2>4. Sous-traitants et transferts de données</H2>
          <P>Vos données peuvent être traitées par les sous-traitants suivants :</P>
          <div className="overflow-x-auto mb-4">
            <table className="w-full text-sm text-gray-600 border-collapse">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left py-3 pr-4 font-bold text-gray-900">Sous-traitant</th>
                  <th className="text-left py-3 pr-4 font-bold text-gray-900">Finalité</th>
                  <th className="text-left py-3 font-bold text-gray-900">Localisation</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['Supabase', 'Base de données et authentification', 'EU (Francfort)'],
                  ['Vercel', 'Hébergement (région cdg1 Paris)', 'France'],
                  ['Stripe', 'Paiement', 'EU / USA (SCC)'],
                  ['Resend', "Envoi d'emails", 'USA (SCC)'],
                  ['Anthropic (Claude AI)', 'Génération de contenu', 'USA (SCC)'],
                ].map(([name, purpose, loc]) => (
                  <tr key={name} className="border-b border-gray-100">
                    <td className="py-3 pr-4 font-medium">{name}</td>
                    <td className="py-3 pr-4">{purpose}</td>
                    <td className="py-3">{loc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <P>
            Les transferts vers les USA sont encadrés par des Clauses Contractuelles Types (SCC) approuvées par la Commission européenne.
          </P>

          <H2>5. Vos droits (RGPD)</H2>
          <P>Conformément au RGPD, vous disposez des droits suivants :</P>
          <ul className="text-sm text-gray-600 leading-relaxed mb-4 list-disc pl-5 space-y-1">
            <li><strong>Droit d&apos;accès :</strong> obtenir une copie de vos données personnelles</li>
            <li><strong>Droit de rectification :</strong> corriger vos données inexactes ou incomplètes</li>
            <li><strong>Droit de suppression :</strong> demander l&apos;effacement de vos données</li>
            <li><strong>Droit à la portabilité :</strong> recevoir vos données dans un format structuré et lisible</li>
            <li><strong>Droit d&apos;opposition :</strong> vous opposer au traitement de vos données pour motif légitime</li>
            <li><strong>Droit à la limitation :</strong> demander la suspension du traitement de vos données</li>
            <li><strong>Droit de retirer votre consentement :</strong> à tout moment pour les traitements basés sur le consentement</li>
          </ul>
          <P>
            Pour exercer ces droits, envoyez un email à <A href="mailto:privacy@konvert.app">privacy@konvert.app</A> avec
            une copie de votre pièce d&apos;identité. Nous répondrons sous 30 jours.
          </P>
          <P>
            Vous avez également le droit d&apos;introduire une réclamation auprès de la <strong>CNIL</strong> (Commission
            Nationale de l&apos;Informatique et des Libertés) : <strong>cnil.fr</strong>.
          </P>

          <H2>6. Sécurité des données</H2>
          <P>Nous mettons en place les mesures suivantes pour protéger vos données :</P>
          <Ul items={[
            'Chiffrement des données en transit (TLS 1.3) et au repos',
            'Authentification sécurisée avec hachage bcrypt des mots de passe',
            'Row Level Security (RLS) sur toutes les tables de la base de données',
            "Tokens d'accès OAuth chiffrés pour les intégrations tierces",
            'Revue régulière des accès et des permissions',
          ]} />

          <H2>7. Cookies</H2>
          <P>
            Notre utilisation des cookies est détaillée dans notre{' '}
            <Link href="/legal/cookies" className="text-[#5B47F5] font-semibold hover:underline">politique de cookies</Link>.
          </P>

          <H2>8. Modifications</H2>
          <P last>
            Nous pouvons mettre à jour cette politique périodiquement. Toute modification substantielle sera notifiée
            par email ou par notification dans le Service au moins 15 jours avant son entrée en vigueur.
          </P>

          <Nav current="privacy" />
        </div>
      </section>
    </>
  )
}

function H2({ children, first }: { children: React.ReactNode; first?: boolean }) {
  return <h2 className={`text-xl font-bold text-gray-900 mb-4 ${first ? 'mt-0' : 'mt-8'}`}>{children}</h2>
}
function P({ children, last }: { children: React.ReactNode; last?: boolean }) {
  return <p className={`text-sm text-gray-600 leading-relaxed ${last ? 'mb-0' : 'mb-4'}`}>{children}</p>
}
function A({ href, children }: { href: string; children: React.ReactNode }) {
  return <a href={href} className="text-[#5B47F5] font-semibold hover:underline">{children}</a>
}
function Ul({ items }: { items: string[] }) {
  return (
    <ul className="text-sm text-gray-600 leading-relaxed mb-6 list-disc pl-5 space-y-1">
      {items.map(item => <li key={item}>{item}</li>)}
    </ul>
  )
}
function Nav({ current }: { current: string }) {
  const links = [
    { href: '/legal/cgu', label: 'CGU' },
    { href: '/legal/cgv', label: 'CGV' },
    { href: '/legal/privacy', label: 'Confidentialité' },
    { href: '/legal/cookies', label: 'Cookies' },
    { href: '/legal/mentions', label: 'Mentions légales' },
  ]
  return (
    <div className="mt-10 pt-8 border-t border-gray-100 flex flex-wrap gap-4 text-sm">
      {links.filter(l => !l.href.endsWith(current)).map(l => (
        <Link key={l.href} href={l.href} className="text-[#5B47F5] font-semibold hover:underline">{l.label}</Link>
      ))}
    </div>
  )
}
