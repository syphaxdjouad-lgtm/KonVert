'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Bell,
  CheckCircle,
  AlertTriangle,
  AlertCircle,
  Info,
} from 'lucide-react'

interface Notification {
  id: string
  type: 'success' | 'warning' | 'error' | 'info'
  title: string
  body: string
  href?: string
  time?: string
}

const STORAGE_KEY = 'konvert-notif-read'

function getReadIds(): string[] {
  if (typeof window === 'undefined') return []
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]') as string[]
  } catch {
    return []
  }
}

function saveReadIds(ids: string[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(ids))
}

function NotifIcon({ type }: { type: Notification['type'] }) {
  const configs = {
    success: {
      bg: 'rgba(181,242,61,0.15)',
      icon: <CheckCircle size={18} color="#b5f23d" strokeWidth={2} />,
    },
    warning: {
      bg: 'rgba(251,191,36,0.15)',
      icon: <AlertTriangle size={18} color="#f59e0b" strokeWidth={2} />,
    },
    error: {
      bg: 'rgba(239,68,68,0.1)',
      icon: <AlertCircle size={18} color="#ef4444" strokeWidth={2} />,
    },
    info: {
      bg: 'rgba(124,58,237,0.1)',
      icon: <Info size={18} color="#7c3aed" strokeWidth={2} />,
    },
  }
  const { bg, icon } = configs[type]
  return (
    <div
      style={{
        width: 36,
        height: 36,
        borderRadius: 10,
        background: bg,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}
    >
      {icon}
    </div>
  )
}

// Polling intervals — adaptés selon que le dropdown est ouvert ou non.
const POLL_OPEN_MS   = 30_000
const POLL_CLOSED_MS = 120_000

export default function NotificationBell() {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [readIds, setReadIds] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const dropdownRef = useRef<HTMLDivElement>(null)

  async function fetchNotifications(signal?: AbortSignal) {
    try {
      const res = await fetch('/api/notifications', { signal, cache: 'no-store' })
      if (!res.ok) return
      const data = await res.json()
      setNotifications(data.notifications ?? [])
    } catch {
      // ignore (abort, réseau, etc.)
    }
  }

  // Fetch initial + chargement readIds
  useEffect(() => {
    const controller = new AbortController()
    fetchNotifications(controller.signal).finally(() => setLoading(false))
    setReadIds(getReadIds())
    return () => controller.abort()
  }, [])

  // Polling adaptatif (plus rapide quand le dropdown est ouvert)
  useEffect(() => {
    const interval = open ? POLL_OPEN_MS : POLL_CLOSED_MS
    const id = setInterval(() => fetchNotifications(), interval)
    return () => clearInterval(id)
  }, [open])

  // Refetch quand l'onglet redevient visible (l'user revient sur la page après pause)
  useEffect(() => {
    function handleVisibility() {
      if (document.visibilityState === 'visible') fetchNotifications()
    }
    document.addEventListener('visibilitychange', handleVisibility)
    return () => document.removeEventListener('visibilitychange', handleVisibility)
  }, [])

  // Fermer au clic dehors
  useEffect(() => {
    if (!open) return
    function handleOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleOutside)
    return () => document.removeEventListener('mousedown', handleOutside)
  }, [open])

  const unreadCount = notifications.filter(n => !readIds.includes(n.id)).length

  function markAllRead() {
    const allIds = notifications.map(n => n.id)
    setReadIds(allIds)
    saveReadIds(allIds)
  }

  function markOneRead(id: string) {
    if (readIds.includes(id)) return
    const updated = [...readIds, id]
    setReadIds(updated)
    saveReadIds(updated)
  }

  function handleNotifClick(notif: Notification) {
    markOneRead(notif.id)
    setOpen(false)
    if (notif.href) router.push(notif.href)
  }

  return (
    <div ref={dropdownRef} style={{ position: 'relative' }}>
      {/* ── Bouton cloche ── */}
      <button
        onClick={() => setOpen(prev => !prev)}
        style={{
          width: 32,
          height: 32,
          borderRadius: 8,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: open ? '#F5F4FA' : 'transparent',
          border: 'none',
          cursor: 'pointer',
          color: '#6b6b84',
          position: 'relative',
        }}
        onMouseEnter={e => {
          if (!open) (e.currentTarget as HTMLButtonElement).style.background = '#F5F4FA'
        }}
        onMouseLeave={e => {
          if (!open) (e.currentTarget as HTMLButtonElement).style.background = 'transparent'
        }}
        aria-label="Notifications"
      >
        <Bell size={16} strokeWidth={1.8} />
        {unreadCount > 0 && (
          <span
            style={{
              position: 'absolute',
              top: -2,
              right: -2,
              minWidth: 16,
              height: 16,
              padding: '0 4px',
              borderRadius: 8,
              background: '#ef4444',
              border: '1.5px solid #fff',
              color: '#fff',
              fontSize: 10,
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              lineHeight: 1,
            }}
            aria-label={`${unreadCount} notification${unreadCount > 1 ? 's' : ''} non lue${unreadCount > 1 ? 's' : ''}`}
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* ── Dropdown ── */}
      {open && (
        <div
          style={{
            position: 'absolute',
            top: 40,
            right: 0,
            width: 320,
            background: '#ffffff',
            borderRadius: 16,
            boxShadow: '0 8px 32px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.06)',
            border: '1px solid #E4E2EE',
            zIndex: 200,
            overflow: 'hidden',
          }}
        >
          {/* Header */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '14px 16px 10px',
              borderBottom: '1px solid #E4E2EE',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontWeight: 700, fontSize: 14, color: '#1a1a2e' }}>
                Notifications
              </span>
              {notifications.length > 0 && (
                <span
                  style={{
                    background: '#7c3aed',
                    color: '#fff',
                    borderRadius: 20,
                    fontSize: 11,
                    fontWeight: 700,
                    padding: '1px 7px',
                  }}
                >
                  {notifications.length}
                </span>
              )}
            </div>
            {unreadCount > 0 && (
              <button
                onClick={markAllRead}
                style={{
                  fontSize: 11,
                  color: '#7c3aed',
                  fontWeight: 600,
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 0,
                }}
              >
                Tout marquer comme lu
              </button>
            )}
          </div>

          {/* Liste */}
          <div style={{ maxHeight: 384, overflowY: 'auto' }}>
            {loading ? (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '36px 16px',
                  gap: 8,
                  color: '#a0a0b8',
                }}
              >
                <div
                  style={{
                    width: 24,
                    height: 24,
                    border: '2px solid #E4E2EE',
                    borderTopColor: '#7c3aed',
                    borderRadius: '50%',
                    animation: 'kvspin 0.8s linear infinite',
                  }}
                />
                <span style={{ fontSize: 12 }}>Chargement…</span>
                <style>{`@keyframes kvspin{to{transform:rotate(360deg)}}`}</style>
              </div>
            ) : notifications.length === 0 ? (
              /* État vide */
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '36px 16px',
                  gap: 12,
                  color: '#a0a0b8',
                }}
              >
                <Bell size={32} strokeWidth={1.4} />
                <span style={{ fontSize: 13, fontWeight: 600 }}>Tout va bien !</span>
                <span style={{ fontSize: 12, textAlign: 'center', lineHeight: 1.4 }}>
                  Aucune notification pour le moment.
                </span>
              </div>
            ) : (
              notifications.map(notif => {
                const isUnread = !readIds.includes(notif.id)
                return (
                  <button
                    key={notif.id}
                    onClick={() => handleNotifClick(notif)}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: 12,
                      padding: '10px 16px',
                      background: 'transparent',
                      border: 'none',
                      borderBottom: '1px solid #f0eef8',
                      cursor: notif.href ? 'pointer' : 'default',
                      textAlign: 'left',
                      transition: 'background 0.15s',
                    }}
                    onMouseEnter={e => {
                      (e.currentTarget as HTMLButtonElement).style.background = '#F5F4FA'
                    }}
                    onMouseLeave={e => {
                      (e.currentTarget as HTMLButtonElement).style.background = 'transparent'
                    }}
                  >
                    <NotifIcon type={notif.type} />

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div
                        style={{
                          fontSize: 13,
                          fontWeight: 700,
                          color: '#1a1a2e',
                          lineHeight: 1.3,
                          marginBottom: 2,
                        }}
                      >
                        {notif.title}
                      </div>
                      <div
                        style={{
                          fontSize: 12,
                          color: '#6b6b84',
                          lineHeight: 1.4,
                          whiteSpace: 'normal',
                        }}
                      >
                        {notif.body}
                      </div>
                      {notif.time && (
                        <div style={{ fontSize: 11, color: '#a0a0b8', marginTop: 4 }}>
                          {notif.time}
                        </div>
                      )}
                    </div>

                    {isUnread && (
                      <div
                        style={{
                          width: 8,
                          height: 8,
                          borderRadius: '50%',
                          background: '#3b82f6',
                          flexShrink: 0,
                          marginTop: 5,
                        }}
                      />
                    )}
                  </button>
                )
              })
            )}
          </div>

          {/* Footer */}
          <div
            style={{
              padding: '10px 16px',
              borderTop: '1px solid #E4E2EE',
              textAlign: 'center',
            }}
          >
            <button
              onClick={() => {
                setOpen(false)
                router.push('/dashboard/analytics')
              }}
              style={{
                fontSize: 12,
                color: '#7c3aed',
                fontWeight: 600,
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: 0,
              }}
            >
              Voir les analytics →
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
