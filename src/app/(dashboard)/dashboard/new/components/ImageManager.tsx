'use client'

import { useState } from 'react'

interface Props {
  images: string[]
  onChange: (images: string[]) => void
}

export function ImageManager({ images, onChange }: Props) {
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [draggedIdx, setDraggedIdx] = useState<number | null>(null)

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files
    if (!files || files.length === 0) return
    setUploading(true)
    setUploadError(null)
    try {
      const newUrls: string[] = []
      for (const file of Array.from(files)) {
        const fd = new FormData()
        fd.append('file', file)
        const r = await fetch('/api/upload-image', { method: 'POST', body: fd })
        if (!r.ok) {
          const err = await r.json().catch(() => ({ error: r.statusText }))
          throw new Error(err.error ?? `Upload failed (${r.status})`)
        }
        const { url } = await r.json()
        newUrls.push(url)
      }
      onChange([...images, ...newUrls])
    } catch (e) {
      setUploadError(e instanceof Error ? e.message : 'Upload error')
    } finally {
      setUploading(false)
      // Reset l'input pour permettre re-upload du même fichier
      e.target.value = ''
    }
  }

  function removeAt(i: number) {
    onChange(images.filter((_, j) => j !== i))
  }

  function move(from: number, to: number) {
    if (from === to) return
    const next = [...images]
    const [item] = next.splice(from, 1)
    if (item !== undefined) next.splice(to, 0, item)
    onChange(next)
  }

  function handleDragStart(idx: number) {
    return (e: React.DragEvent<HTMLDivElement>) => {
      setDraggedIdx(idx)
      e.dataTransfer.effectAllowed = 'move'
      e.dataTransfer.setData('text/plain', String(idx))
    }
  }

  function handleDragOver(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  function handleDrop(to: number) {
    return (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault()
      const from = Number(e.dataTransfer.getData('text/plain'))
      if (!Number.isNaN(from)) move(from, to)
      setDraggedIdx(null)
    }
  }

  return (
    <div>
      <div className="grid grid-cols-3 md:grid-cols-5 gap-3 mb-3">
        {images.map((src, i) => {
          const isDragged = draggedIdx === i
          return (
            <div
              key={src + i}
              draggable
              onDragStart={handleDragStart(i)}
              onDragOver={handleDragOver}
              onDrop={handleDrop(i)}
              onDragEnd={() => setDraggedIdx(null)}
              className={`relative aspect-square rounded-lg overflow-hidden border bg-neutral-100 group cursor-move transition-opacity ${
                isDragged ? 'opacity-40' : ''
              }`}
            >
              <img
                src={src}
                alt={`Image ${i + 1}`}
                className="w-full h-full object-cover pointer-events-none"
              />
              <button
                onClick={() => removeAt(i)}
                aria-label={`Supprimer image ${i + 1}`}
                className="absolute top-1 right-1 w-7 h-7 bg-white/90 hover:bg-white rounded-full text-sm
                           opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
              >
                ✕
              </button>
              {i === 0 && (
                <span className="absolute bottom-1 left-1 text-xs bg-purple-600 text-white px-2 py-0.5 rounded">
                  Hero
                </span>
              )}
            </div>
          )
        })}
        <label className="aspect-square rounded-lg border-2 border-dashed border-neutral-300
                          flex flex-col items-center justify-center cursor-pointer hover:border-purple-400
                          text-neutral-400 hover:text-purple-600 transition-colors">
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleUpload}
            className="hidden"
            disabled={uploading}
          />
          <span className="text-3xl leading-none">+</span>
          <span className="text-xs mt-1">{uploading ? 'Upload...' : 'Ajouter'}</span>
        </label>
      </div>

      <p className="text-xs text-neutral-500">
        {images.length} image{images.length > 1 ? 's' : ''} &middot;{' '}
        Drag pour réordonner &middot; Clic ✕ pour supprimer &middot; La première = hero
      </p>

      {uploadError && (
        <p className="text-xs text-red-600 mt-1">&#9888; {uploadError}</p>
      )}
    </div>
  )
}
