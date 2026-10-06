/**
 * NEXUS — The closing entry
 *
 * Where the case ends. It states what the last lead said, what the unit's
 * record was, and nothing it cannot back up: figures that the server does not
 * report (hints drawn, objects held) are not shown rather than shown as zero.
 * Time on case stops at the moment the case closed.
 */

import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useGameEngine } from '@/hooks/useGameEngine'
import { useApp } from '@/app/providers'
import { ROUTES, ROLE_LABELS } from '@/app/config'
import { BureauIcons } from '@/components/bureau'
import { DocumentShell, RegisterList, RegisterRow, StateMarker, Stamp } from '@/components/bureau'
import type { NodeReveal } from '@/types/game-engine'

/** The lead whose record closes the case. */
const FINAL_LEAD = 'P37'

export function PlayerComplete() {
  const { player, team, teamProgress, gameState, solvedCount, totalNodes, fetchNode } = useGameEngine()
  const { logout } = useApp()
  const [shareMessage, setShareMessage] = useState<string | null>(null)
  const [closing, setClosing] = useState<NodeReveal | null>(null)
  const [confirmLeave, setConfirmLeave] = useState(false)

  // The last record is the server's to give: fetch it, never hard-code it.
  useEffect(() => {
    let cancelled = false
    void fetchNode(FINAL_LEAD)
      .then(view => {
        if (!cancelled && view?.reveal) setClosing(view.reveal)
      })
      .catch(() => undefined)
    return () => {
      cancelled = true
    }
  }, [fetchNode])

  const finalScore = teamProgress?.score ?? 0
  const timeOnCase = formatSpan(gameState?.startedAt ?? null, gameState?.completedAt ?? null)
  const roleLabel = player?.role && ROLE_LABELS[player.role]

  const debriefEntries: { label: string; value: string }[] = [
    { label: 'SCORE', value: finalScore.toLocaleString() },
    { label: 'LEADS CLOSED', value: `${solvedCount}/${totalNodes}` },
    { label: 'TIME ON CASE', value: timeOnCase },
  ]

  const handleShare = () => {
    const shareText =
      `NEXUS ECHO · Case 037 closed\n` +
      `Unit: ${team?.name ?? 'Unknown'}\n` +
      `Score: ${finalScore}\n` +
      `Time on case: ${timeOnCase}`
    const acknowledge = (message: string) => {
      setShareMessage(message)
      setTimeout(() => setShareMessage(null), 3000)
    }
    const copyReport = () => {
      void navigator.clipboard?.writeText(shareText)
      acknowledge('CASE SUMMARY COPIED')
    }
    if (navigator.share) {
      void navigator.share({ title: 'NEXUS ECHO · Case 037 closed', text: shareText })
        .then(() => acknowledge('CASE SUMMARY SENT'))
        .catch(copyReport)
    } else {
      copyReport()
    }
  }

  return (
    <div className="page">
      <div className="page-content max-w-2xl mx-auto space-y-6">
        <DocumentShell
          reference="Case 037"
          title="CLOSING ENTRY"
          titleAs="h1"
          classification="RESTRICTED"
          stock="carbon"
          footer={<Stamp variant="archived" impressed>Closed</Stamp>}
        >
          <div className="space-y-5 py-2">
            <p className="nx-body text-nexus-textMuted">
              The Bureau has taken the file from {team?.name ?? 'your unit'}.
            </p>
            {closing?.storyReveal && (
              <p className="font-mono text-[0.95rem] leading-relaxed text-nexus-text">{closing.storyReveal}</p>
            )}
            {closing?.evidenceContent && (
              <blockquote className="whitespace-pre-line border-l-2 border-nexus-borderStrong pl-4 font-type text-[0.95rem] leading-relaxed text-nexus-text">
                {closing.evidenceContent}
              </blockquote>
            )}
          </div>
        </DocumentShell>

        {player && (
          <DocumentShell
            reference="Operator Identity"
            title="Unit filed"
            stock="paper"
            footer={
              <StateMarker glyph={player.role?.[0] ?? '?'} tone="active" label={roleLabel ?? 'Unknown role'} />
            }
          >
            <p className="font-medium text-nexus-text">{roleLabel}</p>
            <p className="text-sm text-nexus-textMuted">{player.displayName}</p>
          </DocumentShell>
        )}

        <DocumentShell
          reference="After Action Report"
          title="AFTER-ACTION REGISTER"
          stock="digital"
          footer={<Stamp variant="verified">Filed</Stamp>}
        >
          <RegisterList>
            {debriefEntries.map(entry => (
              <RegisterRow
                key={entry.label}
                label={entry.label}
                trailing={<span className="font-mono text-base font-bold tabular-nums text-nexus-text">{entry.value}</span>}
              />
            ))}
          </RegisterList>
        </DocumentShell>

        <div className="flex flex-col gap-3">
          <Link to={ROUTES.PLAYER_LEADERBOARD} className="nx-action w-full">
            <BureauIcons.Flag className="bureau-icon w-5 h-5" aria-hidden="true" />
            <span>View the field record</span>
          </Link>
          <button type="button" onClick={handleShare} className="nx-action-ghost w-full">
            <BureauIcons.Share className="bureau-icon w-5 h-5" aria-hidden="true" />
            <span>Copy case summary</span>
          </button>
          {confirmLeave ? (
            <div className="border border-nexus-border p-3" role="group" aria-label="Close this device">
              <p className="mb-3 font-mono text-[0.875rem] uppercase tracking-[0.1em] text-nexus-textMuted">
                This signs the device out. Your unit's record stays with the Bureau.
              </p>
              <div className="flex gap-2">
                <button type="button" onClick={() => { void logout() }} className="nx-action flex-1">
                  <span>Close device</span>
                </button>
                <button type="button" onClick={() => setConfirmLeave(false)} className="nx-action-ghost flex-1">
                  <span>Stay</span>
                </button>
              </div>
            </div>
          ) : (
            <button type="button" onClick={() => setConfirmLeave(true)} className="nx-action-ghost w-full">
              <BureauIcons.Back className="bureau-icon w-5 h-5 rotate-180" aria-hidden="true" />
              <span>Close this device</span>
            </button>
          )}
        </div>

        {shareMessage && (
          <p
            className="border-l-2 border-nexus-accent px-3 py-2 text-center font-mono text-[0.8125rem] uppercase tracking-[0.14em] text-nexus-textMuted"
            role="status"
            aria-live="polite"
          >
            {shareMessage}
          </p>
        )}

        <p className="text-center font-mono text-[0.8125rem] uppercase tracking-[0.14em] text-nexus-textSubtle">
          NEXUS ECHO / CASE 037 / FIELD RECOVERY RECORD
        </p>
      </div>
    </div>
  )
}

/** Time between two instants; if the case is still open, up to now. */
function formatSpan(startedAt: string | null, endedAt: string | null): string {
  if (!startedAt) return '—'
  const start = new Date(startedAt).getTime()
  const end = endedAt ? new Date(endedAt).getTime() : Date.now()
  if (!Number.isFinite(start) || !Number.isFinite(end) || end < start) return '—'
  const diff = end - start
  const hours = Math.floor(diff / 3600000)
  const minutes = Math.floor((diff % 3600000) / 60000)
  return `${hours}h ${minutes}m`
}
