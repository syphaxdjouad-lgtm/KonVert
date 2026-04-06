'use client'

import Link from 'next/link'
import { ArrowLeft, Clock, ArrowRight } from 'lucide-react'

// Page d'article de blog — contenu dynamique à venir depuis CMS/MDX
// Pour l'instant : template avec données mock basées sur le slug

export default function BlogArticlePage({ params }: { params: { slug: string } }) {
  const { slug } = params

  // Titre formaté depuis le slug
  const title = slug
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')
    .replace(/Aliexpress/g, 'AliExpress')
    .replace(/Shopify/g, 'Shopify')
    .replace(/Woocommerce/g, 'WooCommerce')
    .replace(/Ia/g, 'IA')

  const RELATED = [
    { slug: 'aliexpress-a-shopify-en-30-secondes', title: "D'AliExpress à Shopify en 30 secondes", readTime: '6 min' },
    { slug: 'meilleurs-templates-dropshipping-2025', title: 'Les 5 templates qui convertissent le mieux', readTime: '5 min' },
    { slug: 'ab-testing-pages-produit', title: "A/B testing sur vos pages produit", readTime: '6 min' },
  ].filter((a) => a.slug !== slug).slice(0, 2)

  return (
    <>
      {/* ── HERO ARTICLE ─────────────────────────────────────────────────── */}
      <section className="pt-28 pb-12" style={{ background: 'linear-gradient(135deg, #08080f, #0f0f2e)' }}>
        <div className="max-w-3xl mx-auto px-5 sm:px-8">

          <Link href="/blog" className="inline-flex items-center gap-2 text-sm mb-8 transition-colors"
                style={{ color: '#8b8baa' }}
                onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
                onMouseLeave={e => (e.currentTarget.style.color = '#8b8baa')}>
            <ArrowLeft className="w-4 h-4" />
            Retour au blog
          </Link>

          <div className="flex items-center gap-3 mb-5">
            <span className="text-xs font-bold px-3 py-1 rounded-full text-white" style={{ background: '#5B47F5' }}>
              Conversion
            </span>
            <span className="flex items-center gap-1 text-xs" style={{ color: '#6b6b8a' }}>
              <Clock className="w-3.5 h-3.5" />
              8 min de lecture
            </span>
            <span className="text-xs" style={{ color: '#6b6b8a' }}>· 2 janvier 2025</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black text-white leading-snug mb-5">
            {title}
          </h1>
          <p className="text-base leading-relaxed" style={{ color: '#8b8baa' }}>
            Un guide complet pour transformer vos fiches produit en machines à convertir — sans avoir besoin d'un designer ou d'un développeur.
          </p>
        </div>
      </section>

      {/* ── CONTENU ARTICLE ───────────────────────────────────────────────── */}
      <section className="py-14 bg-white">
        <div className="max-w-3xl mx-auto px-5 sm:px-8">

          {/* Auteur */}
          <div className="flex items-center gap-3 pb-8 mb-8 border-b border-gray-100">
            <div className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold"
                 style={{ background: 'linear-gradient(135deg, #5B47F5, #8b77ff)' }}>
              K
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">Équipe Konvert</p>
              <p className="text-xs text-gray-400">Experts e-commerce & conversion</p>
            </div>
          </div>

          {/* Corps de l'article */}
          <div className="prose prose-gray max-w-none">

            <p className="text-lg text-gray-600 leading-relaxed mb-8">
              Le taux de conversion moyen d'un e-commerce est de <strong>2,3%</strong>. Les meilleurs boutiques atteignent 8 à 12%.
              Cette différence ne tient pas à la chance — elle tient à des choix précis sur chaque élément de vos pages produit.
            </p>

            <h2 className="text-2xl font-black text-gray-900 mt-10 mb-4">Pourquoi votre page actuelle ne convertit pas</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              La plupart des fiches produit souffrent des mêmes problèmes : un titre générique, une description copiée-collée du fournisseur,
              des photos de mauvaise qualité, et un bouton "Ajouter au panier" perdu dans la page.
            </p>
            <p className="text-gray-600 leading-relaxed mb-6">
              Le problème n'est pas le produit. C'est la façon dont il est présenté. Un visiteur décide de rester ou partir en moins de 3 secondes.
              Votre page a exactement ce temps pour le convaincre.
            </p>

            {/* Callout */}
            <div className="my-8 p-6 rounded-2xl border-l-4" style={{ background: '#f3f0ff', borderColor: '#5B47F5' }}>
              <p className="font-bold text-gray-900 mb-1">💡 À retenir</p>
              <p className="text-sm text-gray-700">
                Une augmentation de 1% du taux de conversion sur 10 000 visiteurs/mois génère 100 ventes supplémentaires.
                Sur un panier moyen de 50€, c'est 5 000€ de CA en plus — chaque mois.
              </p>
            </div>

            <h2 className="text-2xl font-black text-gray-900 mt-10 mb-4">Les 5 éléments d'une page qui convertit</h2>

            <h3 className="text-xl font-bold text-gray-900 mt-6 mb-3">1. Le titre — votre première impression</h3>
            <p className="text-gray-600 leading-relaxed mb-4">
              Le titre doit répondre à une question : "En quoi ce produit améliore-t-il ma vie ?". Pas "Écouteurs Bluetooth X200" —
              mais "Profitez de 40h de musique sans fil, sans jamais recharger en voyage."
            </p>

            <h3 className="text-xl font-bold text-gray-900 mt-6 mb-3">2. Les images — montrez le résultat, pas le produit</h3>
            <p className="text-gray-600 leading-relaxed mb-4">
              Les meilleures pages produit montrent le produit <em>en situation d'usage</em>. Une personne qui l'utilise, le bénéfice visible,
              l'emotion associée. Les images sur fond blanc ne convertissent que pour les sites Amazon — pas pour le D2C.
            </p>

            <h3 className="text-xl font-bold text-gray-900 mt-6 mb-3">3. Le copy — parlez comme votre client</h3>
            <p className="text-gray-600 leading-relaxed mb-4">
              Lisez les avis clients de vos concurrents sur Amazon. Les clients décrivent leurs problèmes dans leurs propres mots —
              reprenez exactement ces formulations. C'est ce qu'on appelle le "voice of customer" copy.
            </p>

            <h3 className="text-xl font-bold text-gray-900 mt-6 mb-3">4. Le CTA — un seul choix possible</h3>
            <p className="text-gray-600 leading-relaxed mb-4">
              Un seul bouton d'action par page. Il doit être visible sans scroll sur desktop. La couleur doit contraster avec le reste de la page.
              Le texte doit être orienté bénéfice : "Je veux en profiter" plutôt que "Ajouter au panier".
            </p>

            <h3 className="text-xl font-bold text-gray-900 mt-6 mb-3">5. La preuve sociale — la conviction par les autres</h3>
            <p className="text-gray-600 leading-relaxed mb-6">
              92% des acheteurs lisent les avis avant d'acheter. Placez 3-5 avis vérifiés juste avant le bouton CTA.
              Un chiffre de clients ("4 200 clients satisfaits") fonctionne mieux que "Excellentes critiques".
            </p>

            <h2 className="text-2xl font-black text-gray-900 mt-10 mb-4">Comment KONVERT automatise tout ça</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              KONVERT analyse votre URL produit, extrait les données clés, et génère automatiquement une page optimisée avec :
              un titre percutant, une description bénéfice-centrée, une FAQ personnalisée, et les éléments de réassurance adaptés à votre niche.
            </p>
            <p className="text-gray-600 leading-relaxed mb-8">
              Résultat moyen observé sur nos utilisateurs : +40% de taux de conversion par rapport à leurs pages précédentes.
            </p>

          </div>

          {/* CTA inline */}
          <div className="mt-12 p-8 rounded-3xl text-center" style={{ background: 'linear-gradient(135deg, #0a0a1a, #0f0f2e)' }}>
            <p className="text-white font-black text-xl mb-2">Testez sur vos produits maintenant</p>
            <p className="text-sm mb-6" style={{ color: '#8b8baa' }}>
              14 jours gratuits · Aucune carte de crédit requise
            </p>
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full text-white font-bold text-sm"
              style={{ background: 'linear-gradient(135deg, #5B47F5, #7c6af7)' }}
            >
              Générer ma première page gratuite
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── ARTICLES LIÉS ─────────────────────────────────────────────────── */}
      {RELATED.length > 0 && (
        <section className="py-14" style={{ background: '#fafafa' }}>
          <div className="max-w-3xl mx-auto px-5 sm:px-8">
            <p className="text-xs font-bold uppercase tracking-widest text-[#5B47F5] mb-6">Articles liés</p>
            <div className="grid sm:grid-cols-2 gap-5">
              {RELATED.map((r) => (
                <Link
                  key={r.slug}
                  href={`/blog/${r.slug}`}
                  className="group bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-lg hover:shadow-[#5B47F5]/8 transition-all"
                >
                  <h3 className="font-bold text-gray-900 mb-2 text-sm leading-snug group-hover:text-[#5B47F5] transition-colors">
                    {r.title}
                  </h3>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-400 flex items-center gap-1"><Clock className="w-3 h-3" />{r.readTime}</span>
                    <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-[#5B47F5] group-hover:translate-x-1 transition-all" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  )
}
