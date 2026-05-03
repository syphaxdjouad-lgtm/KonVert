'use client'

import { useEffect, useRef, useState } from 'react'
import 'grapesjs/dist/css/grapes.min.css'
import Leadmeter from '@/components/dashboard/Leadmeter'

interface Props {
  html: string
  onSave?: (html: string, json: object) => void
}

type Device = 'desktop' | 'tablet' | 'mobile'

export default function GrapesEditor({ html, onSave }: Props) {
  const editorRef    = useRef<HTMLDivElement>(null)
  const gjsRef       = useRef<any>(null)
  const debounceRef  = useRef<ReturnType<typeof setTimeout> | null>(null)

  const [device,      setDevice]      = useState<Device>('desktop')
  const [saving,      setSaving]      = useState(false)
  const [saved,       setSaved]       = useState(false)
  const [liveHtml,    setLiveHtml]    = useState(html)

  /* ─── Init GrapesJS ─── */
  useEffect(() => {
    if (!editorRef.current || gjsRef.current) return

    let editor: any

    const init = async () => {
      const gjs = await import('grapesjs')

      if (gjsRef.current) {
        gjsRef.current.destroy()
        gjsRef.current = null
      }

      editor = gjs.default.init({
        container: editorRef.current!,
        fromElement: false,
        components: html,
        height: '100%',
        width: 'auto',
        storageManager: false,
        undoManager: {} as any,
        // Pas de plugins : on veut un canvas pur, sans panels parasites.
        // Notre toolbar custom (device switcher + Export + Save) gère tout.
        plugins: [],
        canvas: { styles: [], scripts: [] },
        deviceManager: {
          devices: [
            { name: 'Desktop', width: '' },
            { name: 'Tablet',  width: '768px', widthMedia: '768px' },
            { name: 'Mobile',  width: '390px', widthMedia: '480px' },
          ],
        },
        // On désactive tous les panels par défaut de GrapesJS (gauche/droite/top)
        panels: { defaults: [] },
        blockManager: { appendTo: '#__gjs_unused', blocks: [] } as any,
        layerManager: { appendTo: '#__gjs_unused' } as any,
        selectorManager: { appendTo: '#__gjs_unused' } as any,
        traitManager: { appendTo: '#__gjs_unused' } as any,
        styleManager: { appendTo: '#__gjs_unused', sectors: [] } as any,
      })

      gjsRef.current = editor

      /* ─── Leadmeter : écoute des events GrapesJS ─── */
      const scheduleUpdate = () => {
        if (debounceRef.current) clearTimeout(debounceRef.current)
        debounceRef.current = setTimeout(() => {
          if (!gjsRef.current) return
          const exportHtml = gjsRef.current.getHtml()
          const css        = gjsRef.current.getCss()
          const full = `<!DOCTYPE html><html><head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1.0"/><style>${css}</style></head><body>${exportHtml}</body></html>`
          setLiveHtml(full)
        }, 500)
      }

      editor.on('component:update',  scheduleUpdate)
      editor.on('component:add',     scheduleUpdate)
      editor.on('component:remove',  scheduleUpdate)
      editor.on('style:change',      scheduleUpdate)

      // Score initial
      scheduleUpdate()
    }

    init()

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
      if (gjsRef.current) {
        gjsRef.current.destroy()
        gjsRef.current = null
      }
    }
  }, [html])

  /* ─── Device switcher ─── */
  useEffect(() => {
    if (!gjsRef.current) return
    const dm = gjsRef.current.DeviceManager
    if (device === 'desktop') dm.select('Desktop')
    else if (device === 'tablet') dm.select('Tablet')
    else dm.select('Mobile')
  }, [device])

  /* ─── Sauvegarder ─── */
  function handleSave() {
    if (!gjsRef.current || !onSave) return
    setSaving(true)
    const exportHtml = gjsRef.current.getHtml()
    const css        = gjsRef.current.getCss()
    const json       = gjsRef.current.getComponents()
    const fullHtml   = `<!DOCTYPE html><html><head><meta charset="UTF-8"/><style>${css}</style></head><body>${exportHtml}</body></html>`
    onSave(fullHtml, json)
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  /* ─── Export HTML ─── */
  function handleExport() {
    if (!gjsRef.current) return
    const exportHtml = gjsRef.current.getHtml()
    const css        = gjsRef.current.getCss()
    const full = `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1.0"/>
<style>${css}</style>
</head>
<body>${exportHtml}</body>
</html>`
    const blob = new Blob([full], { type: 'text/html' })
    const url  = URL.createObjectURL(blob)
    const a    = document.createElement('a')
    a.href = url; a.download = 'landing-page.html'; a.click()
    URL.revokeObjectURL(url)
  }

  /* ─── RENDER ─── */
  return (
    <div className="flex flex-col h-full bg-gray-100">

      {/* ── Toolbar ── */}
      <div className="flex items-center justify-between bg-white border-b border-gray-200 px-4 h-12 flex-shrink-0">

        {/* Device switcher */}
        <div className="flex gap-1 bg-gray-100 p-1 rounded-lg">
          {(['desktop','tablet','mobile'] as Device[]).map(d => (
            <button
              key={d}
              onClick={() => setDevice(d)}
              className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${
                device === d
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              {d === 'desktop' ? '🖥' : d === 'tablet' ? '📱' : '📲'} {d}
            </button>
          ))}
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={handleExport}
            className="text-xs font-semibold text-gray-500 hover:text-gray-800 px-3 py-1.5 border border-gray-200 rounded-lg transition-colors"
          >
            Export HTML
          </button>
          {onSave && (
            <button
              onClick={handleSave}
              disabled={saving}
              className={`text-xs font-bold px-4 py-1.5 rounded-lg transition-all ${
                saved
                  ? 'bg-green-500 text-white'
                  : 'bg-purple-600 hover:bg-purple-700 text-white'
              }`}
            >
              {saved ? '✓ Sauvegardé' : saving ? '...' : 'Sauvegarder'}
            </button>
          )}
        </div>
      </div>

      {/* ── Body : canvas + panel Leadmeter ── */}
      <div className="flex flex-1 overflow-hidden">

        {/* Canvas GrapesJS */}
        <div className="flex-1 overflow-hidden relative bg-white">
          <div
            ref={editorRef}
            className="absolute inset-0 gjs-konvert-root"
          />
        </div>

        {/* Panel Leadmeter */}
        <Leadmeter html={liveHtml} />

      </div>

      {/* Container caché pour neutraliser tous les managers GrapesJS qu'on ne veut pas afficher */}
      <div id="__gjs_unused" style={{ display: 'none' }} />

      {/* Override CSS GrapesJS — canvas plein écran, pas de panels parasites */}
      <style jsx global>{`
        .gjs-konvert-root .gjs-editor {
          background: #ffffff !important;
        }
        .gjs-konvert-root .gjs-cv-canvas {
          width: 100% !important;
          left: 0 !important;
          top: 0 !important;
          height: 100% !important;
          background: #f5f4fa !important;
        }
        .gjs-konvert-root .gjs-pn-panels,
        .gjs-konvert-root .gjs-pn-views,
        .gjs-konvert-root .gjs-pn-views-container,
        .gjs-konvert-root .gjs-pn-options,
        .gjs-konvert-root .gjs-pn-devices-c,
        .gjs-konvert-root .gjs-pn-commands {
          display: none !important;
        }
        .gjs-konvert-root .gjs-frame-wrapper {
          padding: 16px !important;
        }
        .gjs-konvert-root .gjs-frame {
          border: 1px solid #e5e7eb !important;
          border-radius: 8px !important;
          box-shadow: 0 4px 12px rgba(0,0,0,0.05) !important;
          background: #ffffff !important;
        }
      `}</style>
    </div>
  )
}
