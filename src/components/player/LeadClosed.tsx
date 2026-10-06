/**
 * A closed lead.
 *
 * The moment a team solves something is the one place the game can say what
 * just changed. This screen is that moment, and it is also what a closed lead
 * shows on every later visit. It states, in order: the verdict, what the
 * system said, what was recovered, and where the trail goes next, in Lina's
 * own hand. It never leaves on a timer; the player decides when they have
 * read it. Nothing here is the only carrier of a sound cue: each event the
 * engine plays a sound for is written out on this screen.
 *
 * The final lead gets a different ending: the same verdict, then the way out
 * of the case rather than the way to another place.
 */

import { Link } from 'react-router-dom'
import { ROUTES } from '@/app/config'
import { BureauIcons, DocumentShell, Stamp } from '@/components/bureau'
import { noteAuthor, plainNote } from '@/lib/leadNote'
import type { NodeReveal } from '@/types/game-engine'

export interface LeadClosedProps {
  code: string
  title: string
  reveal: NodeReveal | null
  /** True when this visit is the solve itself rather than a later look back. */
  justClosed: boolean
  /** True when closing this lead closed the case. */
  isFinal: boolean
  pointsAwarded?: number
}

export function LeadClosed({ code, title, reveal, justClosed, isFinal, pointsAwarded }: LeadClosedProps) {
  const note = reveal?.clueText ? plainNote(reveal.clueText) : null
  const author = reveal?.clueText ? noteAuthor(reveal.clueText) : 'L.V.'

  return (
    <div className="page">
      <div className="page-content mx-auto max-w-2xl space-y-6">
        <DocumentShell
          reference={`Lead ${code}`}
          title={isFinal ? 'CASE CLOSED' : justClosed ? 'VERIFICATION COMPLETE' : 'LEAD CLOSED'}
          titleAs="h1"
          subtitle={title}
          stock="carbon"
          classification="RESTRICTED"
          footer={
            <>
              <Stamp variant="verified" impressed={justClosed}>Verified</Stamp>
              {justClosed && pointsAwarded !== undefined && pointsAwarded > 0 && (
                <span className="meta tabular-nums">+{pointsAwarded} on the record</span>
              )}
            </>
          }
        >
          <div role="status" aria-live="polite" className="space-y-5">
            {reveal?.storyReveal ? (
              <section aria-label="What the system said">
                <p className="section-label">Record</p>
                <p className="mt-1 font-mono text-[0.95rem] leading-relaxed text-nexus-text">{reveal.storyReveal}</p>
              </section>
            ) : (
              <p className="nx-body text-nexus-textMuted">This lead is closed.</p>
            )}

            {reveal?.evidenceTitle && (
              <section aria-label="Material recovered" className="border-l-2 border-nexus-accent pl-3">
                <p className="section-label">Material recovered</p>
                <p className="mt-1 font-mono text-[0.95rem] text-nexus-text">{reveal.evidenceTitle}</p>
                {reveal.evidenceSource && (
                  <p className="font-mono text-[0.8125rem] uppercase tracking-[0.12em] text-nexus-textSubtle">
                    Found at {reveal.evidenceSource}
                  </p>
                )}
                <Link to={ROUTES.PLAYER_EVIDENCE} className="mt-2 inline-block font-mono text-[0.8125rem] uppercase tracking-[0.14em] text-nexus-accent underline underline-offset-4">
                  Open it in the archive
                </Link>
              </section>
            )}

            {!isFinal && note && (
              <section aria-label="New lead">
                <p className="section-label">New lead</p>
                <p className="text-hand mt-2 text-lg leading-snug text-nexus-text">{note}</p>
                <p className="mt-1 text-hand text-right text-nexus-textMuted">— {author}</p>
                {reveal?.nextPhysicalLocation && (
                  <p className="mt-2 font-mono text-[0.8125rem] uppercase tracking-[0.12em] text-nexus-textSubtle">
                    Next · {reveal.nextPhysicalLocation}
                  </p>
                )}
              </section>
            )}
          </div>
        </DocumentShell>

        <div className="flex flex-col gap-3">
          {isFinal ? (
            <Link to={ROUTES.PLAYER_COMPLETE} className="nx-action w-full">
              <span>Read the closing entry</span>
              <BureauIcons.Forward className="bureau-icon w-4 h-4" aria-hidden="true" />
            </Link>
          ) : (
            <Link to={ROUTES.PLAYER_GAME} className="nx-action w-full">
              <span>Return to the case</span>
              <BureauIcons.Forward className="bureau-icon w-4 h-4" aria-hidden="true" />
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}
