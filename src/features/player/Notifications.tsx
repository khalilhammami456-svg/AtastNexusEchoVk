/**
 * NEXUS — Player Notifications
 *
 * Team-scoped message centre. Content comes from the server
 * (game-notifications -> get_team_notifications, RLS-scoped to the caller's
 * own team). Marking read is persisted server-side through game-mark-read, so
 * an unread badge cannot reappear after a refresh.
 */

import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '@/app/providers'
import { cn } from '@/lib/utils'
import { formatDateTime } from '@/lib/time'
import { BureauIcons } from '@/components/bureau'
import { DocumentShell, StateMarker, Stamp, type StampVariant } from '@/components/bureau'

const PRIORITY_STAMP: Record<string, { variant: StampVariant; label: string }> = {
  LOW: { variant: 'archived', label: 'Routine' },
  NORMAL: { variant: 'verified', label: 'Filed' },
  HIGH: { variant: 'anomalous', label: 'Priority' },
  CRITICAL: { variant: 'anomalous', label: 'Urgent' },
}

/**
 * The server's housekeeping notices were written in the voice of an app
 * ("Puzzle Solved", "Hint Used"). They are stored that way, so the device
 * says them in the game's voice when it shows them. Anything the Bureau
 * writes by hand passes through untouched.
 */
const SYSTEM_VOICE: Record<string, { title: string; message?: string }> = {
  'Puzzle Solved': { title: 'LEAD CLOSED', message: 'Your unit closed a lead.' },
  'QR Code Scanned': { title: 'MARKER READ', message: 'A field marker was read by your unit.' },
  'Hint Used': { title: 'DESK CONSULTED' },
  'Node Unlocked': { title: 'LEAD ISSUED', message: 'The Bureau issued a new lead.' },
  'Node Reset': { title: 'LEAD REOPENED' },
  'Emergency Hint': { title: 'DESK NOTE (BUREAU-ISSUED)' },
}

function inGameVoice(title: string, message: string): { title: string; message: string } {
  const voice = SYSTEM_VOICE[title]
  if (!voice) return { title, message }
  const hintCost = /Time penalty:\s*(\d+)\s*minutes?/i.exec(message)
  return {
    title: voice.title,
    message: hintCost ? `${hintCost[1]} minutes added to the clock.` : (voice.message ?? message),
  }
}

export function PlayerNotifications() {
  const navigate = useNavigate()
  const { notifications, unreadCount, markNotificationRead, markAllNotificationsRead, refreshNotifications } = useApp()
  const [isRefreshing, setIsRefreshing] = useState(false)

  useEffect(() => {
    void refreshNotifications()
  }, [refreshNotifications])

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true)
    try {
      await refreshNotifications()
    } finally {
      setIsRefreshing(false)
    }
  }, [refreshNotifications])

  const handleOpen = useCallback(
    (id: string, isRead: boolean, actionUrl?: string) => {
      if (!isRead) markNotificationRead(id)
      if (actionUrl) {
        if (actionUrl.startsWith('/player/')) {
          navigate(actionUrl)
        }
      }
    },
    [markNotificationRead, navigate],
  )

  return (
    <div className="page">
      <div className="page-content max-w-2xl mx-auto">
        <header className="mb-5 flex items-center gap-3 border-b border-nexus-border pb-3">
          <div className="min-w-0 flex-1">
            <p className="font-mono text-[0.8125rem] uppercase tracking-[0.18em] text-nexus-textSubtle">SECURE CHANNEL · BUREAU</p>
            <h1 className="mt-1 font-mono text-lg font-bold text-nexus-text">COMMS</h1>
          </div>
          <button
            onClick={handleRefresh}
            className="flex min-h-12 min-w-12 items-center justify-center border border-nexus-borderSubtle text-nexus-textSubtle hover:text-nexus-text"
            aria-label="Re-query field channel"
            title="Re-query channel"
            disabled={isRefreshing}
            type="button"
          >
            <BureauIcons.Refresh className={cn('bureau-icon w-4 h-4', isRefreshing && 'animate-spin')} />
          </button>
        </header>

        {unreadCount > 0 && (
          <button
            onClick={() => void markAllNotificationsRead()}
            className="nexus-btn nexus-btn-secondary w-full mb-4 touch-target-comfortable"
            type="button"
          >
            <BureauIcons.Check className="bureau-icon w-4 h-4" />
            ACKNOWLEDGE ALL DISPATCHES ({unreadCount})
          </button>
        )}

        {notifications.length === 0 ? (
          <DocumentShell
            reference="FIELD CHANNEL / CASE 037"
            title="NO ACTIVE COMMUNICATIONS"
            stock="paper"
            footer={<Stamp variant="archived">Channel listening</Stamp>}
          >
            <div className="grid grid-cols-[6.5rem_1fr] border-y border-nexus-borderSubtle font-mono text-[0.8125rem] uppercase tracking-[0.12em]">
              <span className="border-r border-nexus-borderSubtle px-3 py-3 text-nexus-textSubtle">BUFFER</span>
              <span className="px-3 py-3 text-nexus-textMuted">NO INBOUND DISPATCHES IN LOCAL RECORD</span>
            </div>
          </DocumentShell>
        ) : (
          <ul className="border-y border-nexus-borderSubtle divide-y divide-nexus-borderSubtle" aria-label="Dispatches">
            {notifications.map(n => {
              const stamp = PRIORITY_STAMP[n.priority] ?? PRIORITY_STAMP.NORMAL
              return (
                <li key={n.id} className={cn('px-1 py-3', !n.isRead && 'bg-nexus-accentBg/10')}>
                  {/* A dispatch is read, not scanned: the message wraps in full
                      rather than truncating to one register line. */}
                  <div className="flex items-center gap-2 flex-wrap">
                    {!n.isRead && <StateMarker glyph="●" tone="active" label="UNREAD" />}
                    <Stamp variant={stamp.variant} impressed>{stamp.label}</Stamp>
                    <time className="font-mono text-[0.8125rem] uppercase tracking-[0.1em] text-nexus-textSubtle">
                      {formatDateTime(n.createdAt)}
                    </time>
                  </div>
                  <p className="mt-1.5 font-medium text-nexus-text break-words">{inGameVoice(n.title, n.message).title}</p>
                  <p className="mt-0.5 text-sm text-nexus-textMuted break-words">{inGameVoice(n.title, n.message).message}</p>
                  {(n.actionUrl || !n.isRead) && (
                    <button
                      onClick={() => handleOpen(n.id, n.isRead, n.actionUrl)}
                      className="mt-2 min-h-11 px-1 font-mono text-xs uppercase tracking-[0.1em] text-nexus-accent"
                      aria-label={`Open ${n.title}`}
                      type="button"
                    >
                      {n.actionUrl ? '[ REVIEW ]' : '[ MARK READ ]'}
                    </button>
                  )}
                </li>
              )
            })}
          </ul>
        )}

        <div className="mt-6 flex items-center justify-center gap-2 text-xs text-nexus-textSubtle">
          <span className="font-mono text-[0.75rem] uppercase tracking-[0.12em]">
            DISTRIBUTION / TEAM CHANNEL ONLY / PLAYER RECORDS WITHHELD
          </span>
        </div>
      </div>
    </div>
  )
}
