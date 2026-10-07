/**
 * NEXUS — Player Puzzle Node
 * Data-driven puzzle screen with role-specific content.
 *
 * SECURITY: Never displays acceptedAnswer, fullSolution, or
 * server-side validation patterns. Operators receive
 * coordination instructions instead of intermediate outputs.
 * All answer validation happens server-side via gameAPI.submitAnswer.
 */

import { useParams, Link } from 'react-router-dom'
import { useApp } from '@/app/providers'
import { useSound } from '@/app/providers/SoundProvider'
import { ROUTES, ROLE_LABELS, ROLE_THEMES } from '@/app/config'
import { cn } from '@/lib/utils'
import { useGameEngine } from '@/hooks/useGameEngine'
import { LeadClosed } from '@/components/player/LeadClosed'
import { saveLeadNote } from '@/lib/leadNote'
import type { NodeReveal } from '@/types/game-engine'
import { PuzzleVisual } from '@/components/player/puzzle/PuzzleVisual'
import { HINT_PENALTIES } from '@/content/constants'
import { useEffect, useState, useRef } from 'react'
import type { PlayerNodeView } from '@/hooks/useGameEngine'
import { BureauIcons } from '@/components/bureau'
import {
  DocumentShell,
  EvidenceFrame,
  RegisterColumn,
  StateMarker,
  Stamp,
  type StatusTone,
} from '@/components/bureau'

/**
 * How long a node request may stay pending before the player is told the
 * Bureau did not answer. Long enough for a weak signal, short enough that a
 * stalled request is not mistaken for a loading screen that never ends.
 */
const NODE_LOAD_TIMEOUT_MS = 12_000

/** Leads whose solve is a revelation, not just a step. */
const MAJOR_DISCOVERY = new Set(['P29', 'P34'])
/** The lead where two accounts are proved not to agree. */
const CONTRADICTION = new Set(['P24b'])

export function PlayerNode() {
  const { nodeId } = useParams<{ nodeId: string }>()
  const { team, refreshTeamProgress, refreshGameState } = useApp()
  const { play } = useSound()
  const engine = useGameEngine()
  const { role, submitAnswer, requestHint, isOffline, fetchNode } = engine
  const [node, setNode] = useState<PlayerNodeView | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [answer, setAnswer] = useState('')
  const [submissions, setSubmissions] = useState<
    { answer: string; isCorrect: boolean; queued: boolean }[]
  >([])
  const [hints, setHints] = useState<{ level: number; text: string; penalty: number }[]>([])
  const [showHintPanel, setShowHintPanel] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  // A failed submit or hint keeps the puzzle on screen; only a failed load blocks it.
  const [actionError, setActionError] = useState<string | null>(null)
  // Bumped by the retry control: a hung request is a realistic field failure.
  const [loadAttempt, setLoadAttempt] = useState(0)
  const [justSolved, setJustSolved] = useState(false)
  /** What the solve gave back, held on screen until the player leaves. */
  const [closure, setClosure] = useState<{ reveal: NodeReveal | null; isFinal: boolean; points: number } | null>(null)
  /** The Bureau's verdict on the last entry, written out beside the form. */
  const [verdict, setVerdict] = useState<string | null>(null)
  const hintIndexRef = useRef(0)
  const hintBusyRef = useRef(false)
  const mountedRef = useRef(true)
  const evidenceCueRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    mountedRef.current = true
    return () => {
      mountedRef.current = false
      if (evidenceCueRef.current) clearTimeout(evidenceCueRef.current)
    }
  }, [])

  useEffect(() => {
    // Every early exit leaves the screen in a real state. Bailing out without
    // clearing `loading` once left a player on a permanent spinner.
    if (!nodeId) return

    if (!role) {
      setLoading(false)
      setError('Your field assignment has not been received from the Bureau yet. Reconnect and try again.')
      return
    }

    // A slow response for a node the player already left must not overwrite the current one.
    let cancelled = false
    let timer: ReturnType<typeof setTimeout> | undefined
    const loadNode = async () => {
      setLoading(true)
      setError(null)
      setActionError(null)
      try {
        const nodeData = await Promise.race([
          fetchNode(nodeId),
          new Promise<never>((_, reject) => {
            timer = setTimeout(
              () => reject(new Error('The Bureau did not respond. Check the signal and try again.')),
              NODE_LOAD_TIMEOUT_MS,
            )
          }),
        ])
        if (cancelled) return
        setNode(nodeData)
        setShowHintPanel(false)
        setJustSolved(false)
        setSubmissions([])
        setHints([])
        setAnswer('')
        hintIndexRef.current = nodeData?.hintsUsed ?? 0
      } catch (err: unknown) {
        if (cancelled) return
        const msg = err instanceof Error ? err.message : 'Failed to load node'
        setError(msg)
      } finally {
        if (timer) clearTimeout(timer)
        if (!cancelled) setLoading(false)
      }
    }

    void loadNode()
    return () => {
      cancelled = true
      if (timer) clearTimeout(timer)
    }
  }, [nodeId, role, fetchNode, loadAttempt])

  /**
   * Sound for a closed lead. One cue, chosen by what the lead was: the final
   * lead gets the case's largest cue, the two revelations a major one, the
   * contradiction its own, everything else the plain verification. Material
   * filed with the solve follows on its own, a beat later. Each of these is
   * written out on the closed-lead screen.
   */
  const celebrate = (code: string, isFinal: boolean, reveal: NodeReveal | null) => {
    if (isFinal) play('reconstruction')
    else if (MAJOR_DISCOVERY.has(code)) play('major-discovery')
    else if (CONTRADICTION.has(code)) play('contradiction')
    else play('verify')
    if (!isFinal && reveal?.evidenceTitle) {
      if (evidenceCueRef.current) clearTimeout(evidenceCueRef.current)
      evidenceCueRef.current = setTimeout(() => play('evidence'), 1100)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!answer.trim() || isSubmitting || !nodeId) return

    setIsSubmitting(true)
    setActionError(null)
    try {
      const result = await submitAnswer(nodeId, answer.trim())
      if (!mountedRef.current) return

      setSubmissions(prev => [...prev, {
        answer: answer.trim(),
        isCorrect: result.isCorrect,
        queued: result.queued === true,
      }])

      if (result.queued) {
        // The answer is held on the device; the form already says so.
        setVerdict('No signal. The entry is held and will be sent when the link returns.')
      } else if (result.isCorrect) {
        setVerdict(null)
        setJustSolved(true)
        const reveal = result.reveal ?? null
        const isFinal = result.isFinal === true
        setClosure({ reveal, isFinal, points: result.pointsAwarded })
        if (team?.id) saveLeadNote(team.id, result.nextNodeCode, reveal)
        refreshGameState()
        refreshTeamProgress()
        celebrate(nodeId, isFinal, reveal)
      } else {
        play('refuse')
        setVerdict(
          result.attemptNumber > 0
            ? `The terminal rejects the entry. Attempt ${result.attemptNumber}.`
            : 'The terminal rejects the entry.',
        )
      }
      setAnswer('')
    } catch (err: unknown) {
      if (!mountedRef.current) return
      const msg = err instanceof Error ? err.message : 'Submission failed'
      setActionError(msg)
    } finally {
      if (mountedRef.current) setIsSubmitting(false)
    }
  }

  const handleHint = async () => {
    if (!nodeId || !node) return
    const nextHintNumber = hintIndexRef.current + 1
    if (nextHintNumber > 3) return
    // Each hint costs time: a double tap must not buy two.
    if (hintBusyRef.current) return
    hintBusyRef.current = true

    try {
      const result = await requestHint(nodeId, nextHintNumber)
      if (!mountedRef.current) return
      setHints(prev => [...prev, {
        level: nextHintNumber,
        text: result.hint,
        penalty: result.penaltySeconds,
      }])
      hintIndexRef.current = nextHintNumber
      play('hint')
    } catch (err: unknown) {
      if (!mountedRef.current) return
      const msg = err instanceof Error ? err.message : 'Failed to get hint'
      setActionError(msg)
    } finally {
      hintBusyRef.current = false
    }
  }

  const isOperator = role === 'OPERATOR'
  const roleTheme = role && ROLE_THEMES[role]
  const isSolved = node?.isSolved || justSolved

  if (!nodeId) {
    return (
      <div className="page-content max-w-md mx-auto text-center py-12">
        <BureauIcons.Back className="bureau-icon w-12 h-12 text-nexus-textMuted mx-auto mb-4" aria-hidden="true" />
        <h1 className="heading-3 mb-2">NO SUCH LEAD</h1>
        <Link to={ROUTES.PLAYER_GAME} className="nexus-btn nexus-btn-secondary w-full touch-target-comfortable">
          RETURN TO CASE
        </Link>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="page">
        <div className="page-content max-w-md mx-auto text-center py-12">
          <BureauIcons.Spinner className="bureau-icon w-8 h-8 text-nexus-accent animate-spin mx-auto mb-4" aria-hidden="true" />
          <p className="text-nexus-textMuted">OPENING LEAD…</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="page">
        <div className="page-content max-w-md mx-auto text-center py-12">
          <BureauIcons.Flag className="bureau-icon w-8 h-8 text-nexus-warning mx-auto mb-4" aria-hidden="true" />
          <h1 className="heading-3 mb-2">INVESTIGATION BLOCKED</h1>
          <p className="nx-body text-nexus-textMuted mb-6" role="alert">{error}</p>
          {/* Retry first: a stalled request is usually transient, and making
              the player navigate away to try again loses their place. */}
          <button
            type="button"
            onClick={() => setLoadAttempt(attempt => attempt + 1)}
            className="nx-action w-full"
          >
            <BureauIcons.Refresh className="bureau-icon w-4 h-4" />
            <span>Try again</span>
          </button>
          <Link to={ROUTES.PLAYER_GAME} className="nx-action-ghost w-full mt-3">
            <BureauIcons.Back className="bureau-icon w-4 h-4" />
            <span>Return to the case</span>
          </Link>
        </div>
      </div>
    )
  }

  if (!node) {
    // Reachable when the load resolved without a record. An empty screen with
    // no explanation and no exit is the worst place for a player to land.
    return (
      <div className="page">
        <div className="page-content max-w-md mx-auto text-center py-12">
          <BureauIcons.File className="bureau-icon w-10 h-10 text-nexus-textMuted mx-auto mb-4" aria-hidden="true" />
          <h1 className="heading-3 mb-2">Nothing filed here</h1>
          <p className="nx-body text-nexus-textMuted mb-6">
            The Bureau returned no record for this item. It may have been withdrawn, or it may not have been
            issued to your team.
          </p>
          <Link to={ROUTES.PLAYER_GAME} className="nx-action w-full">
            <span>Return to the case</span>
            <BureauIcons.Back className="bureau-icon w-4 h-4" />
          </Link>
        </div>
      </div>
    )
  }

  // A closed lead, whether just closed or opened again later, is a record to
  // read, not a puzzle to attempt.
  if (closure || node.isSolved) {
    return (
      <LeadClosed
        code={node.code}
        title={node.title}
        reveal={closure?.reveal ?? node.reveal}
        justClosed={closure !== null}
        isFinal={closure?.isFinal ?? false}
        pointsAwarded={closure?.points}
      />
    )
  }

  const isLocked = !node.unlocked
  const hintLevel = hintIndexRef.current
  const hintPenaltyMap = { 0: HINT_PENALTIES.hint1, 1: HINT_PENALTIES.hint2, 2: HINT_PENALTIES.hint3, 3: HINT_PENALTIES.hint4 }
  const nextHintCost = hintLevel < 4 ? Math.floor(hintPenaltyMap[hintLevel as 0 | 1 | 2 | 3] / 60) : 0

  const nodeStatusTone: StatusTone =
    node.status === 'SOLVED' ? 'active' : node.unlocked ? 'warning' : 'inactive'

  return (
    <div className="page">
      <div className="page-content max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link
            to={ROUTES.PLAYER_GAME}
            className="p-2 border border-nexus-borderSubtle text-nexus-textMuted hover:text-nexus-text touch-target-primary"
            aria-label="Return to case"
          >
            <BureauIcons.Back className="bureau-icon w-5 h-5" aria-hidden="true" />
          </Link>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <StateMarker glyph="◦" tone={nodeStatusTone} label={node.status} />
              <span className="text-sm text-nexus-textMuted font-mono">Lead {node.code}</span>
            </div>
            <h1 className="heading-3 truncate">{node.title}</h1>
          </div>
        </div>

        {/* Role Indicator + Coordination Info */}
        <div className={cn('nexus-ops-panel flex items-center gap-4', roleTheme?.bg)}>
          <div className={cn('w-12 h-12 flex items-center justify-center border border-nexus-borderSubtle', roleTheme?.bg)}>
            <span className={cn('font-display font-bold text-2xl', roleTheme?.text)}>
              {role?.[0]}
            </span>
          </div>
          <div>
            <p className="text-xs text-nexus-textSubtle uppercase tracking-wider">Your Role</p>
            <p className="font-medium text-nexus-text">{ROLE_LABELS[role ?? 'OBSERVER']}</p>
            <p className={cn('text-xs font-medium', roleTheme?.text)}>
              {roleTheme?.subtitle}
            </p>
          </div>
          {node.isSolved && <BureauIcons.Flag className="bureau-icon w-6 h-6 text-nexus-accent ml-auto" />}
        </div>

        {/* Locked State */}
        {isLocked && (
          <DocumentShell
            reference={`Lead ${node.code}`}
            title="Node Locked"
            stock="paper"
            footer={<Stamp variant="incomplete">Sealed</Stamp>}
          >
            <div className="text-center py-6">
              <p className="text-nexus-textMuted">
                Solve prerequisite puzzles or scan the correct QR code to unlock this node.
              </p>
            </div>
          </DocumentShell>
        )}

        {/* Role-Specific Content — only when unlocked and not solved */}
        {node.unlocked && node.roleContent && !isSolved && (
          <div className="nexus-document space-y-6">
            <h3 className="heading-4 flex items-center gap-2">
              <span className={roleTheme?.text}>●</span>
              <span>{node.roleContent.screenTitle}</span>
            </h3>

            {/* Type-specific visual */}
            <EvidenceFrame seed={`node:${node.code}:visual`} title={`EXHIBIT ${node.code}`}>
              <div className="space-y-4">
                <PuzzleVisual
                  type={node.roleContent.visualType}
                  dataPayload={node.roleContent.dataPayload}
                  interactiveData={node.roleContent.interactiveData}
                />
              </div>
            </EvidenceFrame>

            {/* Mission Brief */}
            <div className="nexus-panel space-y-3">
              <p className="text-sm text-nexus-textMuted">
                <strong className="text-nexus-text">On the floor:</strong> {node.roleContent.whatTheySee}
              </p>
              <p className="text-sm text-nexus-textMuted">
                <strong className="text-nexus-text">Your part:</strong> {node.roleContent.taskPrompt}
              </p>
            </div>

            {/* Coordination Chain */}
            {node.coordinationChain && (
              <RegisterColumn heading="Who holds what">
                <div className="nexus-panel p-3 space-y-2 text-sm">
                  <p className="text-nexus-textMuted">
                    <strong>Observer produces:</strong> {node.coordinationChain.observerProduces}
                  </p>
                  <p className="text-nexus-textMuted">
                    <strong>Analyst transforms:</strong> {node.coordinationChain.analystTransforms}
                  </p>
                  <p className="text-nexus-textMuted">
                    <strong>Operator executes:</strong> {node.coordinationChain.operatorExecutes}
                  </p>
                </div>
              </RegisterColumn>
            )}

            {/* Operator Investigation */}
            {isOperator && node.operatorInvestigation && (
              <div className={cn('nexus-panel p-4 space-y-2', roleTheme?.bg)}>
                <h4 className="text-xs uppercase tracking-wider text-nexus-textSubtle">
                  Operator's file
                </h4>
                <div className="space-y-1 text-sm">
                  <p className="text-nexus-textMuted">
                    <strong>Your Evidence:</strong> {node.operatorInvestigation.operatorOwnEvidence}
                  </p>
                  <p className="text-nexus-textMuted">
                    <strong>Task:</strong> {node.operatorInvestigation.operatorTaskDescription}
                  </p>
                  <div className="nexus-panel p-3 mt-2 bg-nexus-bg/70 border-nexus-borderSubtle">
                    <p className="text-xs uppercase tracking-wider text-nexus-textSubtle mb-1.5">
                      Required Discoveries
                    </p>
                    <p className="text-nexus-textMuted">
                      • <strong>From Observer:</strong> {node.operatorInvestigation.requiredDiscoveries.observerDiscovery}
                    </p>
                    <p className="text-nexus-textMuted mt-1">
                      • <strong>From Analyst:</strong> {node.operatorInvestigation.requiredDiscoveries.analystDiscovery}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Failure Propagation */}
            {node.failurePropagation && (
              <div className="nexus-panel p-3 border-nexus-warning/30">
                <p className="text-xs uppercase tracking-wider text-nexus-textSubtle mb-1">
                  Field note
                </p>
                <p className="text-xs text-nexus-textMuted">
                  <strong>If the entry is rejected:</strong> {node.failurePropagation.recoveryGuidance}
                </p>
              </div>
            )}

            {/* Hints Panel */}
            {hints.length > 0 && (
              <RegisterColumn heading="From the desk">
                <div className="space-y-2">
                  {hints.map(h => (
                    <div
                      key={h.level}
                      className="nexus-panel p-3 border-nexus-warning/30 bg-nexus-warningBg/20"
                    >
                      <p className="text-sm text-nexus-warning">
                        <strong>Desk note {h.level}:</strong> {h.text}
                      </p>
                      {h.penalty > 0 && (
                        <p className="text-xs text-nexus-textSubtle mt-1">
                          +{Math.floor(h.penalty / 60)} min on your clock
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </RegisterColumn>
            )}
          </div>
        )}

        {/* Submission Area */}
        {!isSolved && node.unlocked && (
          <DocumentShell
            reference={`Lead ${node.code}`}
            title="ENTRY TO THE BUREAU"
            stock="paper"
            footer={
              <Stamp variant={isOffline ? 'anomalous' : 'verified'}>
                {isOffline ? 'QUEUED' : 'LIVE'}
              </Stamp>
            }
          >
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label htmlFor="answer" className="label">ENTRY</label>
                <input
                  id="answer"
                  type="text"
                  value={answer}
                  onChange={e => { setAnswer(e.target.value); if (verdict) setVerdict(null) }}
                   placeholder={
                     isOperator ? 'ENTER THE COMBINED ENTRY…' : 'ENTER YOUR ENTRY…'
                   }
                  className="input font-mono text-lg text-center"
                  autoComplete="off"
                  disabled={isSubmitting}
                  aria-invalid={actionError ? true : undefined}
                  aria-describedby={cn(isOffline && 'answer-offline', actionError && 'answer-error') || undefined}
                />
                {verdict && !actionError && (
                  <p role="status" className="mt-1.5 font-mono text-[0.875rem] uppercase tracking-[0.1em] text-nexus-warning">
                    {verdict}
                  </p>
                )}
                {actionError && (
                  <p id="answer-error" role="alert" className="mt-1.5 text-sm text-nexus-danger">
                    {actionError}
                  </p>
                )}
                {isOffline && (
                  <p id="answer-offline" className="mt-1.5 text-sm text-nexus-warning flex items-center gap-1.5">
                    <BureauIcons.Alert className="bureau-icon w-3.5 h-3.5 flex-shrink-0" aria-hidden="true" />
                    <span>No signal — your answer will be queued and sent on reconnect</span>
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting || !answer.trim()}
                className="nexus-btn nexus-btn-primary w-full touch-target-comfortable"
              >
                {isSubmitting ? (
                  <>
                    <BureauIcons.Spinner className="bureau-icon w-5 h-5 animate-spin" aria-hidden="true" />
                    <span>TRANSMITTING…</span>
                  </>
                ) : (
                  <>
                    <BureauIcons.Send className="bureau-icon w-5 h-5" aria-hidden="true" />
                    <span>{isOffline ? 'HOLD ENTRY' : 'TRANSMIT'}</span>
                  </>
                )}
              </button>
            </form>

            {/* Submission Status */}
            {submissions.length > 0 && (
              <RegisterColumn heading={`Entries so far (${submissions.length})`}>
                <div className="space-y-1 max-h-40 overflow-y-auto" role="log" aria-live="polite" aria-label="Recent attempts">
                  {submissions.slice(-5).map((sub, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-2 border-b border-nexus-borderSubtle text-sm"
                    >
                      <code className="font-mono text-nexus-text truncate">
                        {sub.answer}
                      </code>
                      <Stamp variant={
                        sub.queued
                          ? 'anomalous'
                          : sub.isCorrect
                            ? 'verified'
                            : 'contradicted'
                      } impressed>
                        {sub.queued ? 'QUEUED' : sub.isCorrect ? 'ACCEPTED' : 'REJECTED'}
                      </Stamp>
                    </div>
                  ))}
                </div>
              </RegisterColumn>
            )}

            {/* Hint Section */}
            {!isSolved && hintLevel < 4 && (
              <div className="border-t border-nexus-borderSubtle pt-2">
                <button
                  onClick={() => setShowHintPanel(true)}
                  className="nexus-btn nexus-btn-ghost w-full touch-target-primary"
                  type="button"
                >
                  <BureauIcons.Help className="bureau-icon w-4 h-4" />
                  <span>Ask the desk · note {hintLevel + 1} of 4</span>
                  <span className="ml-auto text-xs text-nexus-textSubtle">
                    +{nextHintCost} min
                  </span>
                </button>
                {showHintPanel && (
                  <div className="mt-3 p-4 border-nexus-warning/30 bg-nexus-warningBg/20">
                    <p className="text-sm text-nexus-textMuted mb-3">
                      The desk will answer. {Math.floor(hintPenaltyMap[hintLevel as 0 | 1 | 2 | 3] / 60)} minutes
                      are added to your clock.
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={async () => {
                          setShowHintPanel(false)
                          await handleHint()
                        }}
                        className="nexus-btn nexus-btn-primary flex-1 touch-target-primary"
                        type="button"
                      >
                        ASK
                      </button>
                      <button
                        onClick={() => setShowHintPanel(false)}
                        className="nexus-btn nexus-btn-secondary flex-1 touch-target-primary"
                        type="button"
                      >
                        HOLD OFF
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </DocumentShell>
        )}
      </div>
    </div>
  )
}
