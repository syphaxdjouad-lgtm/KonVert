import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Mentions legales — Konvert',
  description: 'Mentions legales du site konvert.app',
}

export default function MentionsLegalesPage() {
  return (
    <>
      <section className="pt-32 pb-14" style={{ background: 'linear-gradient(135deg, #08080f 0%, #0f0f2e 100%)' }}>
        <div className="max-w-3xl mx-auto px-5 sm:px-8 text-center">
          <h1 className="text-3xl sm:text-4xl font-black text-white mb-4">Mentions legales</h1>
          <p className="text-sm" style={{ color: '#8b8baa' }}>Derniere mise a jour : 21 avril 2026</p>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-5 sm:px-8">

          <H2>1. Editeur du site</H2>
          <P>Le site <strong>konvert.app</strong> est edite par :</P>
          <ul className="text-gray-600 text-sm leading-relaxed mb-6 list-disc pl-5 space-y-1">
            <li><strong>Raison sociale :</strong> Konvert SAS</li>
            <li><strong>Forme juridique :</strong> Societe par Actions Simplifiee (SAS)</li>
            <li><strong>Siege social :</strong> France</li>
            <li><strong>Capital social :</strong> 1 000 euros</li>
            <li><strong>Email :</strong> <A href="mailto:contact@konvert.app">contact@konvert.app</A></li>
            <li><strong>Directeur de la publication :</strong> Le President de Konvert SAS</li>
          </ul>

          <H2>2. Hebergement</H2>
          <P>
            Le site est heberge par <strong>Vercel Inc.</strong>, 340 S Lemon Ave #4133, Walnut, CA 91789, USA.
            Les donnees sont stockees sur des serveurs situes dans la region <strong>cdg1 (Paris, France)</strong> conformement
            a notre engagement de souverainete des donnees europeennes.
          </P>

          <H2>3. Propriete intellectuelle</H2>
          <P>
            L&apos;ensemble des elements du site konvert.app (textes, images, logos, icones, logiciels, base de donnees,
            structure, design, templates) est protege par les lois francaises et internationales relatives a la propriete intellectuelle.
          </P>
          <P>
            Toute reproduction, representation, modification, publication ou adaptation de tout ou partie des elements du site,
            quel que soit le moyen ou le procede utilise, est interdite sans autorisation ecrite prealable de Konvert SAS.
          </P>

          <H2>4. Donnees personnelles</H2>
          <P>
            Conformement au Reglement General sur la Protection des Donnees (RGPD) et a la loi Informatique et Libertes,
            vous disposez d&apos;un droit d&apos;acces, de rectification, de suppression et de portabilite de vos donnees personnelles.
          </P>
          <P>
            Pour exercer ces droits, contactez-nous a <A href="mailto:privacy@konvert.app">privacy@konvert.app</A>.
            Pour plus de details, consultez notre <Link href="/legal/privacy" className="text-[#5B47F5] font-semibold hover:underline">politique de confidentialite</Link>.
          </P>

          <H2>5. Cookies</H2>
          <P>
            Le site utilise des cookies pour assurer son bon fonctionnement et ameliorer l&apos;experience utilisateur.
            Pour en savoir plus, consultez notre <Link href="/legal/cookies" className="text-[#5B47F5] font-semibold hover:underline">politique de cookies</Link>.
          </P>

          <H2>6. Responsabilite</H2>
          <P>
            Konvert SAS s&apos;efforce de fournir des informations aussi precises que possible sur le site.
            Toutefois, elle ne pourra etre tenue responsable des omissions, des inexactitudes ou des carences
            dans la mise a jour de ces informations.
          </P>
          <P>
            Konvert SAS ne saurait etre tenue responsable des dommages directs ou indirects causes au materiel
            de l&apos;utilisateur lors de l&apos;acces au site.
          </P>

          <H2>7. Liens hypertextes</H2>
          <P>
            Le site peut contenir des liens hypertextes vers d&apos;autres sites internet. Konvert SAS n&apos;exerce aucun
            controle sur ces sites et decline toute responsabilite quant a leur contenu.
          </P>

          <H2>8. Droit applicable</H2>
          <P last>
            Les presentes mentions legales sont soumises au droit francais. En cas de litige, les tribunaux francais
            seront seuls competents.
          </P>

          <Nav current="mentions" />
        </div>
      </section>
    </>
  )
}

function H2({ children }: { children: React.ReactNode }) {
  return <h2 className="text-xl font-bold text-gray-900 mb-4 mt-8 first:mt-0">{children}</h2>
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
