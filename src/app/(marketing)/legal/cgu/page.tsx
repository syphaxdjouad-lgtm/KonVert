import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: "Conditions Générales d'Utilisation — Konvert",
  description: "CGU du service Konvert — konvert.app",
}

export default function CGUPage() {
  return (
    <>
      <section className="pt-32 pb-14" style={{ background: 'linear-gradient(135deg, #08080f 0%, #0f0f2e 100%)' }}>
        <div className="max-w-3xl mx-auto px-5 sm:px-8 text-center">
          <h1 className="text-3xl sm:text-4xl font-black text-white mb-4">Conditions Générales d&apos;Utilisation</h1>
          <p className="text-sm" style={{ color: '#8b8baa' }}>Dernière mise à jour : 22 avril 2026</p>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-5 sm:px-8">

          <H2 first>1. Objet</H2>
          <P>
            Les présentes Conditions Générales d&apos;Utilisation (ci-après &quot;CGU&quot;) ont pour objet de définir
            les modalités et conditions d&apos;utilisation du service Konvert (ci-après &quot;le Service&quot;), accessible
            à l&apos;adresse <strong>konvert.app</strong>, édité par Konvert SAS.
            En accédant au Service, l&apos;utilisateur accepte sans réserve les présentes CGU.
          </P>

          <H2>2. Description du Service</H2>
          <P>Konvert est une plateforme SaaS qui permet aux e-commerçants de :</P>
          <Ul items={[
            "Générer des landing pages haute conversion à partir d'une URL produit",
            'Personnaliser le contenu, le design et les templates de leurs pages',
            'Connecter leurs boutiques Shopify et WooCommerce',
            'Analyser les performances de leurs pages (vues, clics, conversions)',
            'Exporter et publier les pages générées',
          ]} />

          <H2>3. Inscription et compte utilisateur</H2>
          <P>
            L&apos;accès à certaines fonctionnalités du Service nécessite la création d&apos;un compte utilisateur.
            L&apos;utilisateur s&apos;engage à fournir des informations exactes et à jour lors de son inscription.
          </P>
          <P>
            L&apos;utilisateur est responsable de la confidentialité de ses identifiants de connexion et de toutes les
            activités effectuées sous son compte. En cas d&apos;utilisation non autorisée, l&apos;utilisateur doit en
            informer Konvert immédiatement à <A href="mailto:contact@konvert.app">contact@konvert.app</A>.
          </P>

          <H2>4. Utilisation acceptable</H2>
          <P>L&apos;utilisateur s&apos;engage à ne pas utiliser le Service pour :</P>
          <Ul items={[
            'Créer ou diffuser du contenu illégal, diffamatoire, obscène ou frauduleux',
            'Promouvoir des produits contrefaits ou en violation de droits de propriété intellectuelle',
            "Tenter de compromettre la sécurité, la disponibilité ou l'intégrité du Service",
            'Revendre, sous-licencier ou redistribuer le Service sans autorisation écrite',
            'Utiliser des systèmes automatisés (bots, scrapers) pour accéder au Service de manière abusive',
          ]} />

          <H2>5. Propriété intellectuelle</H2>
          <P>
            Le Service, ses fonctionnalités, son code source, ses templates et son design sont la propriété exclusive de Konvert SAS.
          </P>
          <P>
            Les pages générées par l&apos;utilisateur via le Service restent la propriété de l&apos;utilisateur.
            Konvert SAS n&apos;acquiert aucun droit sur le contenu produit par les utilisateurs. Cependant, l&apos;utilisateur
            accorde à Konvert une licence limitée pour afficher, stocker et traiter ce contenu dans le cadre du fonctionnement du Service.
          </P>

          <H2>6. Disponibilité du Service</H2>
          <P>
            Konvert SAS s&apos;efforce de maintenir le Service accessible 24h/24 et 7j/7. Toutefois, le Service peut être
            temporairement interrompu pour des raisons de maintenance, de mise à jour ou en cas de force majeure.
            Konvert SAS ne garantit pas une disponibilité ininterrompue et ne saurait être tenue responsable des
            interruptions de service.
          </P>

          <H2>7. Limitation de responsabilité</H2>
          <P>
            Le Service est fourni &quot;en l&apos;état&quot;. Konvert SAS ne garantit pas que le Service sera exempt d&apos;erreurs
            ou que les résultats obtenus seront conformes aux attentes de l&apos;utilisateur.
          </P>
          <P>
            En aucun cas, Konvert SAS ne pourra être tenue responsable des dommages indirects, pertes de profits,
            pertes de données ou interruptions d&apos;activité résultant de l&apos;utilisation ou de l&apos;impossibilité d&apos;utiliser le Service.
          </P>

          <H2>8. Résiliation</H2>
          <P>
            L&apos;utilisateur peut supprimer son compte à tout moment depuis les paramètres de son tableau de bord.
          </P>
          <P>
            Konvert SAS se réserve le droit de suspendre ou de supprimer tout compte en cas de violation des présentes CGU,
            sans préavis ni indemnité. En cas de résiliation, l&apos;utilisateur conserve ses données pendant 30 jours,
            après quoi elles seront définitivement supprimées.
          </P>

          <H2>9. Modification des CGU</H2>
          <P>
            Konvert SAS se réserve le droit de modifier les présentes CGU à tout moment. Les utilisateurs seront informés
            par email ou par notification dans le Service. La poursuite de l&apos;utilisation du Service après modification
            vaut acceptation des nouvelles CGU.
          </P>

          <H2>10. Droit applicable et juridiction</H2>
          <P>
            Les présentes CGU sont soumises au droit français. Tout litige relatif à leur interprétation ou à leur exécution
            sera soumis aux tribunaux compétents de Paris, France.
          </P>

          <H2>11. Contact</H2>
          <P last>
            Pour toute question relative aux présentes CGU, contactez-nous à <A href="mailto:contact@konvert.app">contact@konvert.app</A>.
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
