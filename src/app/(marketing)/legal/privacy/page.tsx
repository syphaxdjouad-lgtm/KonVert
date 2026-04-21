import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Politique de confidentialite — Konvert',
  description: 'Politique de confidentialite et RGPD du service Konvert — konvert.app',
}

export default function PrivacyPage() {
  return (
    <>
      <section className="pt-32 pb-14" style={{ background: 'linear-gradient(135deg, #08080f 0%, #0f0f2e 100%)' }}>
        <div className="max-w-3xl mx-auto px-5 sm:px-8 text-center">
          <h1 className="text-3xl sm:text-4xl font-black text-white mb-4">Politique de confidentialite</h1>
          <p className="text-sm" style={{ color: '#8b8baa' }}>Derniere mise a jour : 21 avril 2026 — Conforme RGPD</p>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-5 sm:px-8">

          <H2 first>1. Responsable du traitement</H2>
          <P>
            Le responsable du traitement des donnees personnelles est <strong>Konvert SAS</strong>, dont le siege
            social est situe en France. Pour toute question relative a vos donnees personnelles :{' '}
            <A href="mailto:privacy@konvert.app">privacy@konvert.app</A>.
          </P>

          <H2>2. Donnees collectees</H2>

          <h3 className="text-base font-semibold text-gray-800 mb-2 mt-4">Donnees d&apos;identification</h3>
          <Ul items={['Nom et prenom', 'Adresse email', 'Mot de passe (chiffre)']} />

          <h3 className="text-base font-semibold text-gray-800 mb-2">Donnees de facturation</h3>
          <Ul items={[
            'Informations de paiement (traitees par Stripe, jamais stockees sur nos serveurs)',
            'Adresse de facturation',
            'Historique des transactions',
          ]} />

          <h3 className="text-base font-semibold text-gray-800 mb-2">Donnees d&apos;utilisation</h3>
          <Ul items={[
            'Pages generees et leur contenu',
            "Boutiques connectees (URL, tokens d'acces OAuth)",
            "Statistiques d'utilisation (nombre de pages, vues, clics)",
          ]} />

          <h3 className="text-base font-semibold text-gray-800 mb-2">Donnees techniques</h3>
          <Ul items={[
            'Adresse IP',
            "Type de navigateur et systeme d'exploitation",
            'Pages visitees et duree de visite',
            'Cookies et identifiants de session',
          ]} />

          <H2>3. Finalites du traitement</H2>
          <div className="overflow-x-auto mb-6">
            <table className="w-full text-sm text-gray-600 border-collapse">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left py-3 pr-4 font-bold text-gray-900">Finalite</th>
                  <th className="text-left py-3 pr-4 font-bold text-gray-900">Base legale</th>
                  <th className="text-left py-3 font-bold text-gray-900">Duree</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['Gestion du compte utilisateur', 'Execution du contrat', 'Duree du compte + 30 jours'],
                  ['Facturation et paiements', 'Obligation legale', '10 ans (obligation comptable)'],
                  ['Generation de landing pages', 'Execution du contrat', 'Duree du compte + 30 jours'],
                  ['Emails transactionnels et sequences', 'Interet legitime', "Jusqu'a desinscription"],
                  ['Amelioration du Service', 'Interet legitime', '26 mois (donnees anonymisees)'],
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

          <H2>4. Sous-traitants et transferts de donnees</H2>
          <P>Vos donnees peuvent etre traitees par les sous-traitants suivants :</P>
          <div className="overflow-x-auto mb-4">
            <table className="w-full text-sm text-gray-600 border-collapse">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left py-3 pr-4 font-bold text-gray-900">Sous-traitant</th>
                  <th className="text-left py-3 pr-4 font-bold text-gray-900">Finalite</th>
                  <th className="text-left py-3 font-bold text-gray-900">Localisation</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['Supabase', 'Base de donnees et authentification', 'EU (Francfort)'],
                  ['Vercel', 'Hebergement (region cdg1 Paris)', 'France'],
                  ['Stripe', 'Paiement', 'EU / USA (SCC)'],
                  ['Resend', "Envoi d'emails", 'USA (SCC)'],
                  ['Anthropic (Claude AI)', 'Generation de contenu', 'USA (SCC)'],
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
            Les transferts vers les USA sont encadres par des Clauses Contractuelles Types (SCC) approuvees par la Commission europeenne.
          </P>

          <H2>5. Vos droits (RGPD)</H2>
          <P>Conformement au RGPD, vous disposez des droits suivants :</P>
          <ul className="text-sm text-gray-600 leading-relaxed mb-4 list-disc pl-5 space-y-1">
            <li><strong>Droit d&apos;acces :</strong> obtenir une copie de vos donnees personnelles</li>
            <li><strong>Droit de rectification :</strong> corriger vos donnees inexactes ou incompletes</li>
            <li><strong>Droit de suppression :</strong> demander l&apos;effacement de vos donnees</li>
            <li><strong>Droit a la portabilite :</strong> recevoir vos donnees dans un format structure et lisible</li>
            <li><strong>Droit d&apos;opposition :</strong> vous opposer au traitement de vos donnees pour motif legitime</li>
            <li><strong>Droit a la limitation :</strong> demander la suspension du traitement de vos donnees</li>
            <li><strong>Droit de retirer votre consentement :</strong> a tout moment pour les traitements bases sur le consentement</li>
          </ul>
          <P>
            Pour exercer ces droits, envoyez un email a <A href="mailto:privacy@konvert.app">privacy@konvert.app</A> avec
            une copie de votre piece d&apos;identite. Nous repondrons sous 30 jours.
          </P>
          <P>
            Vous avez egalement le droit d&apos;introduire une reclamation aupres de la <strong>CNIL</strong> (Commission
            Nationale de l&apos;Informatique et des Libertes) : <strong>cnil.fr</strong>.
          </P>

          <H2>6. Securite des donnees</H2>
          <P>Nous mettons en place les mesures suivantes pour proteger vos donnees :</P>
          <Ul items={[
            'Chiffrement des donnees en transit (TLS 1.3) et au repos',
            'Authentification securisee avec hachage bcrypt des mots de passe',
            'Row Level Security (RLS) sur toutes les tables de la base de donnees',
            "Tokens d'acces OAuth chiffres pour les integrations tierces",
            'Revue reguliere des acces et des permissions',
          ]} />

          <H2>7. Cookies</H2>
          <P>
            Notre utilisation des cookies est detaillee dans notre{' '}
            <Link href="/legal/cookies" className="text-[#5B47F5] font-semibold hover:underline">politique de cookies</Link>.
          </P>

          <H2>8. Modifications</H2>
          <P last>
            Nous pouvons mettre a jour cette politique periodiquement. Toute modification substantielle sera notifiee
            par email ou par notification dans le Service au moins 15 jours avant son entree en vigueur.
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
    { href: '/legal/privacy', label: 'Confidentialite' },
    { href: '/legal/cookies', label: 'Cookies' },
    { href: '/legal/mentions', label: 'Mentions legales' },
  ]
  return (
    <div className="mt-10 pt-8 border-t border-gray-100 flex flex-wrap gap-4 text-sm">
      {links.filter(l => !l.href.endsWith(current)).map(l => (
        <Link key={l.href} href={l.href} className="text-[#5B47F5] font-semibold hover:underline">{l.label}</Link>
      ))}
    </div>
  )
}
