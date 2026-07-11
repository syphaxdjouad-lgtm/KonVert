'use client'

import { useEditorStore } from './store'
import { SectionEditor } from './SectionEditor'
import { AutoSaveIndicator } from './AutoSaveIndicator'

const SECTION_LABELS: Record<string, string> = {
  social_proof_bar: 'Barre de social proof',
  story: 'Histoire (PAS)',
  target_audience: 'Audience cible',
  features: 'Features',
  gallery: 'Galerie',
  unique_mechanism: 'Mécanisme unique',
  how_it_works: 'Comment ça marche',
  before_after: 'Avant / Après',
  comparison: 'Comparaison',
  competitor_comparison: 'Vs concurrence',
  testimonials: 'Témoignages',
  press_mentions: 'Mentions presse',
  founder_note: 'Mot du fondateur',
  value_stack: 'Stack de valeur',
  bonuses: 'Bonus',
  guarantee: 'Garantie',
  trust_badges_payment: 'Paiement sécurisé',
  risk_reversal: 'Risque inversé',
  objections: 'Objections',
  community_callout: 'Communauté',
  final_pitch: 'Pitch final',
}

export function PanelRight() {
  const subPanelEditOpen = useEditorStore(s => s.subPanelEditOpen)
  const editingSectionId = useEditorStore(s => s.editingSectionId)
  const sectionOrder = useEditorStore(s => s.sectionOrder)
  const setSubPanelEditOpen = useEditorStore(s => s.setSubPanelEditOpen)

  const editingSection = editingSectionId
    ? sectionOrder.find(s => s.id === editingSectionId)
    : null

  const sectionLabel = editingSection
    ? (SECTION_LABELS[editingSection.key] ?? editingSection.key)
    : 'Section'

  return (
    <aside
      data-testid="panel-right"
      style={{
        position: 'fixed',
        top: '52px',
        right: 0,
        width: '360px',
        height: 'calc(100vh - 52px)',
        background: '#FFFFFF',
        borderLeft: '1px solid #EAEAEA',
        boxShadow: '-4px 0 16px rgba(0,0,0,0.04)',
        transform: subPanelEditOpen ? 'translateX(0)' : 'translateX(100%)',
        transition: 'transform 280ms cubic-bezier(0.4, 0, 0.2, 1)',
        display: 'flex',
        flexDirection: 'column',
        zIndex: 100,
      }}
    >
      {/* Header */}
      <header style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '12px 16px',
        borderBottom: '1px solid #EAEAEA',
        flexShrink: 0,
      }}>
        <h2 style={{ fontSize: '14px', fontWeight: 600, margin: 0 }}>{sectionLabel}</h2>
        <button
          type="button"
          aria-label="Fermer le panel"
          onClick={() => setSubPanelEditOpen(false)}
          style={{
            background: 'transparent',
            border: 0,
            cursor: 'pointer',
            fontSize: '20px',
            lineHeight: 1,
            color: '#888',
            padding: '4px',
          }}
        >
          ×
        </button>
      </header>

      {/* Body scrollable */}
      <div style={{ flex: 1, overflowY: 'auto' }}>
        {editingSection ? (
          <SectionEditor sectionId={editingSection.id} sectionKey={editingSection.key} />
        ) : (
          <div style={{ padding: '16px', fontSize: '13px', color: '#888' }}>
            Sélectionnez une section pour l&apos;éditer.
          </div>
        )}
      </div>

      {/* Footer avec AutoSaveIndicator */}
      <footer style={{
        padding: '8px 16px',
        borderTop: '1px solid #EAEAEA',
        flexShrink: 0,
        minHeight: '32px',
        display: 'flex',
        alignItems: 'center',
      }}>
        <AutoSaveIndicator />
      </footer>
    </aside>
  )
}
