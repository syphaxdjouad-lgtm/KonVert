import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: "Conditions Generales d'Utilisation — Konvert",
  description: "CGU du service Konvert — konvert.app",
}

export default function CGUPage() {
  return (
    <>
      <section className="pt-32 pb-14" style={{ background: 'linear-gradient(135deg, #08080f 0%, #0f0f2e 100%)' }}>
        <div className="max-w-3xl mx-auto px-5 sm:px-8 text-center">
          <h1 className="text-3xl sm:text-4xl font-black text-white mb-4">Conditions Generales d&apos;Utilisation</h1>
          <p className="text-sm" style={{ color: '#8b8baa' }}>Derniere mise a jour : 21 avril 2026</p>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-5 sm:px-8">

          <H2 first>1. Objet</H2>
          <P>
            Les presentes Conditions Generales d&apos;Utilisation (ci-apres &quot;CGU&quot;) ont pour objet de definir
            les modalites et conditions d&apos;utilisation du service Konvert (ci-apres &quot;le Service&quot;), accessible
            a l&apos;adresse <strong>konvert.app</strong>, edite par Konvert SAS.
            En accedant au Service, l&apos;utilisateur accepte sans reserve les presentes CGU.
          </P>

          <H2>2. Description du Service</H2>
          <P>Konvert est une plateforme SaaS qui permet aux e-commercants de :</P>
          <Ul items={[
            "Generer des landing pages haute conversion a partir d'une URL produit",
            'Personnaliser le contenu, le design et les templates de leurs pages',
            'Connecter leurs boutiques Shopify et WooCommerce',
            'Analyser les performances de leurs pages (vues, clics, conversions)',
            'Exporter et publier les pages generees',
          ]} />

          <H2>3. Inscription et compte utilisateur</H2>
          <P>
            L&apos;acces a certaines fonctionnalites du Service necessite la creation d&apos;un compte utilisateur.
            L&apos;utilisateur s&apos;engage a fournir des informations exactes et a jour lors de son inscription.
          </P>
          <P>
            L&apos;utilisateur est responsable de la confidentialite de ses identifiants de connexion et de toutes les
            activites effectuees sous son compte. En cas d&apos;utilisation non autorisee, l&apos;utilisateur doit en
            informer Konvert immediatement a <A href="mailto:contact@konvert.app">contact@konvert.app</A>.
          </P>

          <H2>4. Utilisation acceptable</H2>
          <P>L&apos;utilisateur s&apos;engage a ne pas utiliser le Service pour :</P>
          <Ul items={[
            'Creer ou diffuser du contenu illegal, diffamatoire, obscene ou frauduleux',
            'Promouvoir des produits contrefaits ou en violation de droits de propriete intellectuelle',
            "Tenter de compromettre la securite, la disponibilite ou l'integrite du Service",
            'Revendre, sous-licencier ou redistribuer le Service sans autorisation ecrite',
            'Utiliser des systemes automatises (bots, scrapers) pour acceder au Service de maniere abusive',
          ]} />

          <H2>5. Propriete intellectuelle</H2>
          <P>
            Le Service, ses fonctionnalites, son code source, ses templates et son design sont la propriete exclusive de Konvert SAS.
          </P>
          <P>
            Les pages generees par l&apos;utilisateur via le Service restent la propriete de l&apos;utilisateur.
            Konvert SAS n&apos;acquiert aucun droit sur le contenu produit par les utilisateurs. Cependant, l&apos;utilisateur
            accorde a Konvert une licence limitee pour afficher, stocker et traiter ce contenu dans le cadre du fonctionnement du Service.
          </P>

          <H2>6. Disponibilite du Service</H2>
          <P>
            Konvert SAS s&apos;efforce de maintenir le Service accessible 24h/24 et 7j/7. Toutefois, le Service peut etre
            temporairement interrompu pour des raisons de maintenance, de mise a jour ou en cas de force majeure.
            Konvert SAS ne garantit pas une disponibilite ininterrompue et ne saurait etre tenue responsable des
            interruptions de service.
          </P>

          <H2>7. Limitation de responsabilite</H2>
          <P>
            Le Service est fourni &quot;en l&apos;etat&quot;. Konvert SAS ne garantit pas que le Service sera exempt d&apos;erreurs
            ou que les resultats obtenus seront conformes aux attentes de l&apos;utilisateur.
          </P>
          <P>
            En aucun cas, Konvert SAS ne pourra etre tenue responsable des dommages indirects, pertes de profits,
            pertes de donnees ou interruptions d&apos;activite resultant de l&apos;utilisation ou de l&apos;impossibilite d&apos;utiliser le Service.
          </P>

          <H2>8. Resiliation</H2>
          <P>
            L&apos;utilisateur peut supprimer son compte a tout moment depuis les parametres de son tableau de bord.
          </P>
          <P>
            Konvert SAS se reserve le droit de suspendre ou de supprimer tout compte en cas de violation des presentes CGU,
            sans preavis ni indemnite. En cas de resiliation, l&apos;utilisateur conserve ses donnees pendant 30 jours,
            apres quoi elles seront definitivement supprimees.
          </P>

          <H2>9. Modification des CGU</H2>
          <P>
            Konvert SAS se reserve le droit de modifier les presentes CGU a tout moment. Les utilisateurs seront informes
            par email ou par notification dans le Service. La poursuite de l&apos;utilisation du Service apres modification
            vaut acceptation des nouvelles CGU.
          </P>

          <H2>10. Droit applicable et juridiction</H2>
          <P>
            Les presentes CGU sont soumises au droit francais. Tout litige relatif a leur interpretation ou a leur execution
            sera soumis aux tribunaux competents de Paris, France.
          </P>

          <H2>11. Contact</H2>
          <P last>
            Pour toute question relative aux presentes CGU, contactez-nous a <A href="mailto:contact@konvert.app">contact@konvert.app</A>.
          </P>

          <Nav current="cgu" />
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
