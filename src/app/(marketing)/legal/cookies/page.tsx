import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Politique de cookies — Konvert',
  description: 'Politique de cookies du service Konvert — konvert.app',
}

export default function CookiesPage() {
  return (
    <>
      <section className="pt-32 pb-14" style={{ background: 'linear-gradient(135deg, #08080f 0%, #0f0f2e 100%)' }}>
        <div className="max-w-3xl mx-auto px-5 sm:px-8 text-center">
          <h1 className="text-3xl sm:text-4xl font-black text-white mb-4">Politique de cookies</h1>
          <p className="text-sm" style={{ color: '#8b8baa' }}>Derniere mise a jour : 21 avril 2026</p>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-5 sm:px-8">

          <H2 first>1. Qu&apos;est-ce qu&apos;un cookie ?</H2>
          <P>
            Un cookie est un petit fichier texte depose sur votre appareil (ordinateur, tablette, smartphone)
            lors de la visite d&apos;un site web. Les cookies permettent au site de reconnaitre votre appareil et de
            memoriser certaines informations relatives a votre visite, comme vos preferences ou votre statut de connexion.
          </P>

          <H2>2. Cookies utilises par Konvert</H2>

          <h3 className="text-base font-semibold text-gray-800 mb-3 mt-4">Cookies strictement necessaires</h3>
          <P>Ces cookies sont indispensables au fonctionnement du site. Ils ne peuvent pas etre desactives.</P>
          <div className="overflow-x-auto mb-6">
            <table className="w-full text-sm text-gray-600 border-collapse">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left py-3 pr-4 font-bold text-gray-900">Cookie</th>
                  <th className="text-left py-3 pr-4 font-bold text-gray-900">Finalite</th>
                  <th className="text-left py-3 font-bold text-gray-900">Duree</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['sb-access-token', 'Authentification Supabase', 'Session'],
                  ['sb-refresh-token', 'Renouvellement de session', '7 jours'],
                  ['cookie-consent', 'Memorisation de votre choix cookies', '12 mois'],
                ].map(([name, purpose, dur]) => (
                  <tr key={name} className="border-b border-gray-100">
                    <td className="py-3 pr-4 font-mono text-xs">{name}</td>
                    <td className="py-3 pr-4">{purpose}</td>
                    <td className="py-3">{dur}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h3 className="text-base font-semibold text-gray-800 mb-3">Cookies de performance et d&apos;analyse</h3>
          <P>
            Ces cookies nous aident a comprendre comment les visiteurs utilisent le site afin d&apos;ameliorer notre service.
            Ils sont deposes uniquement avec votre consentement.
          </P>
          <div className="overflow-x-auto mb-6">
            <table className="w-full text-sm text-gray-600 border-collapse">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left py-3 pr-4 font-bold text-gray-900">Cookie</th>
                  <th className="text-left py-3 pr-4 font-bold text-gray-900">Fournisseur</th>
                  <th className="text-left py-3 pr-4 font-bold text-gray-900">Finalite</th>
                  <th className="text-left py-3 font-bold text-gray-900">Duree</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-100">
                  <td className="py-3 pr-4 font-mono text-xs">_va</td>
                  <td className="py-3 pr-4">Vercel Analytics</td>
                  <td className="py-3 pr-4">Mesure d&apos;audience anonymisee</td>
                  <td className="py-3">Session</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3 className="text-base font-semibold text-gray-800 mb-3">Cookies tiers</h3>
          <P>
            Certains services tiers integres a Konvert (comme Stripe pour le paiement) peuvent deposer leurs propres cookies.
            Ces cookies sont soumis aux politiques de confidentialite de leurs fournisseurs respectifs.
            Konvert n&apos;a aucun controle sur ces cookies tiers.
          </P>

          <H2>3. Gestion de vos preferences</H2>
          <P>
            Lors de votre premiere visite, un bandeau vous permet d&apos;accepter ou de refuser les cookies non essentiels.
            Vous pouvez modifier vos preferences a tout moment :
          </P>
          <ul className="text-sm text-gray-600 leading-relaxed mb-6 list-disc pl-5 space-y-1">
            <li><strong>Via le bandeau cookies :</strong> accessible en bas de chaque page du site</li>
            <li><strong>Via votre navigateur :</strong> chaque navigateur propose des parametres de gestion des cookies dans ses options de confidentialite</li>
          </ul>
          <P>
            La desactivation de certains cookies peut affecter votre experience de navigation et limiter l&apos;acces
            a certaines fonctionnalites du Service.
          </P>

          <H2>4. Duree de conservation</H2>
          <P>
            Conformement aux recommandations de la CNIL, les cookies de mesure d&apos;audience sont conserves pour une
            duree maximale de <strong>13 mois</strong>. Les cookies de session sont supprimes a la fermeture de votre navigateur.
            Le cookie de consentement est conserve pendant <strong>12 mois</strong>.
          </P>

          <H2>5. Base legale</H2>
          <P>
            Les cookies strictement necessaires sont deposes sur la base de notre interet legitime a assurer le
            fonctionnement du Service. Les cookies d&apos;analyse sont deposes uniquement apres obtention de votre
            consentement, conformement a l&apos;article 82 de la loi Informatique et Libertes et aux directives de la CNIL.
          </P>

          <H2>6. Contact</H2>
          <P last>
            Pour toute question concernant notre utilisation des cookies, contactez-nous a{' '}
            <A href="mailto:privacy@konvert.app">privacy@konvert.app</A>.
          </P>

          <Nav current="cookies" />
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
