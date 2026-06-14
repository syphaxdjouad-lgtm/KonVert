'use client'

import { useEditorStore } from './store'

export function AutoSaveIndicator() {
  const saveStatus = useEditorStore(s => s.saveStatus)
  const lastSavedAt = useEditorStore(s => s.lastSavedAt)
  const scheduleAutoSave = useEditorStore(s => s.scheduleAutoSave)

  if (saveStatus === 'idle') return null

  if (saveStatus === 'saving') {
    return <span style={{ fontSize: '11px', color: '#888' }}>Sauvegarde…</span>
  }

  if (saveStatus === 'saved') {
    const time = lastSavedAt
      ? lastSavedAt.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
      : ''
    return <span style={{ fontSize: '11px', color: '#1a7' }}>Sauvegardé à {time}</span>
  }

  // error
  return (
    <span style={{ fontSize: '11px', color: '#E53935', display: 'flex', alignItems: 'center', gap: '6px' }}>
      Erreur — <button
        type="button"
        onClick={() => scheduleAutoSave('', async () => { /* placeholder retry — onSave fourni par EditorRoot */ })}
        style={{ background: 'transparent', border: 0, color: '#E53935', textDecoration: 'underline', cursor: 'pointer', fontSize: '11px', padding: 0 }}
      >
        réessayer
      </button>
    </span>
  )
}
