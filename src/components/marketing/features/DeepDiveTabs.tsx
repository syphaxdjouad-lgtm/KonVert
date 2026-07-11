'use client'

import { useState } from 'react'

type DeepDiveTab = {
  id: string
  label: string
  icon: null
  title: string
  desc: string
  steps: { num: string; title: string; detail: string }[]
  metrics: { value: string; label: string }[]
}

const DEEP_DIVE_TABS: DeepDiveTab[] = [
  {
    id: 'ia',
    label: 'Génération IA',
    icon: null,
    title: 'Comment fonctionne la génération IA ?',
    desc: "KONVERT utilise un moteur IA entraîné sur des millions de pages e-commerce performantes. En analysant ton URL produit, il extrait les informations clés et génère un copy optimisé pour la conversion.",
    steps: [
      { num: '1', title: 'Tu colles l\'URL produit', detail: 'KONVERT scrape automatiquement le titre, les images, le prix, la description et les avis.' },
      { num: '2', title: 'L\'IA analyse et génère', detail: 'Le moteur IA identifie les arguments de vente clés, les objections possibles et rédige une page complète en 30 secondes.' },
      { num: '3', title: 'Tu personnalises et publies', detail: 'Édite chaque bloc dans le builder, choisis un template et publie en 1 clic sur ta boutique.' },
    ],
    metrics: [
      { value: '30s', label: 'Temps moyen de génération' },
      { value: '+62%', label: 'Meilleur copy vs rédaction manuelle' },
      { value: '8', label: 'Langues supportées' },
    ],
  },
  {
    id: 'abtesting',
    label: 'A/B Testing',
    icon: null,
    title: 'Un A/B testing qui travaille pour vous',
    desc: "L'A/B testing manuel est chronophage et statistiquement risqué. KONVERT automatise tout : distribution du trafic, calcul de la significativité, et déclaration du gagnant — sans intervention de ta part.",
    steps: [
      { num: '1', title: 'Créez une variante en 1 clic', detail: 'Dupliquez une page existante, modifiez le titre, le CTA ou le layout. Chaque changement est tracké séparément.' },
      { num: '2', title: 'KONVERT distribue le trafic', detail: 'Le trafic est divisé 50/50 automatiquement. Aucun code à ajouter, aucun plugin externe.' },
      { num: '3', title: 'Le gagnant est déclaré automatiquement', detail: 'Après 1 000 visiteurs ou 95% de confiance statistique, KONVERT déclare la version gagnante et redirige tout le trafic.' },
    ],
    metrics: [
      { value: '95%', label: 'Seuil de confiance statistique' },
      { value: '1000', label: 'Visiteurs pour déclaration auto' },
      { value: '+23%', label: 'Gain moyen après optimisation' },
    ],
  },
  {
    id: 'analytics',
    label: 'Analytics',
    icon: null,
    title: 'Des analytics qui révèlent ce qui convertit',
    desc: "Les analytics KONVERT vont au-delà des simples pages vues. Chaque section de ta page est tracée : où les visiteurs décrochent, quels CTA fonctionnent, et quel segment d'audience convertit le mieux.",
    steps: [
      { num: '1', title: 'Tracking automatique à l\'installation', detail: 'Dès que ta page est publiée, KONVERT commence à collecter les données. Aucun tag Google Analytics à configurer.' },
      { num: '2', title: 'Tableau de bord en temps réel', detail: 'Scroll depth par section, taux de clic CTA, temps passé, taux de rebond et conversions — tout en live.' },
      { num: '3', title: 'Rapports PDF automatiques', detail: 'Chaque semaine, un rapport PDF brandé est généré et envoyé par email. Parfait pour les agences qui gèrent plusieurs clients.' },
    ],
    metrics: [
      { value: '12+', label: 'Métriques trackées par page' },
      { value: '100%', label: 'Temps réel, 0 délai' },
      { value: 'Auto', label: 'Rapports PDF hebdomadaires' },
    ],
  },
]

export default function DeepDiveTabs() {
  const [activeTab, setActiveTab] = useState('ia')
  const currentTab = DEEP_DIVE_TABS.find(t => t.id === activeTab)!

  return (
    <>
      {/* Tabs */}
      <div className="reveal flex gap-2 justify-center mb-10 flex-wrap">
        {DEEP_DIVE_TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 ${
              activeTab === tab.id
                ? 'text-white shadow-lg'
                : 'text-gray-600 bg-white border border-gray-200 hover:border-[#5B47F5]/40 hover:text-[#5B47F5]'
            }`}
            style={activeTab === tab.id ? { background: 'linear-gradient(135deg, #5B47F5, #7c6af7)', boxShadow: '0 4px 14px rgba(91,71,245,0.3)' } : {}}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="reveal delay-1 bg-white rounded-3xl border border-gray-100 p-8 shadow-sm">
        <h3 className="text-2xl font-black text-gray-900 mb-3">{currentTab.title}</h3>
        <p className="text-gray-600 leading-relaxed mb-8 max-w-2xl">{currentTab.desc}</p>

        {/* Steps */}
        <div className="grid sm:grid-cols-3 gap-6 mb-8">
          {currentTab.steps.map((step) => (
            <div key={step.num} className="relative">
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-black mb-3"
                   style={{ background: 'linear-gradient(135deg, #5B47F5, #7c6af7)' }}>
                {step.num}
              </div>
              <h4 className="font-bold text-gray-900 mb-1.5 text-sm">{step.title}</h4>
              <p className="text-xs text-gray-500 leading-relaxed">{step.detail}</p>
            </div>
          ))}
        </div>

        {/* Métriques */}
        <div className="flex gap-6 pt-6 border-t border-gray-100 flex-wrap">
          {currentTab.metrics.map((m) => (
            <div key={m.label} className="text-center">
              <p className="text-2xl font-black text-[#5B47F5]">{m.value}</p>
              <p className="text-xs text-gray-400">{m.label}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
