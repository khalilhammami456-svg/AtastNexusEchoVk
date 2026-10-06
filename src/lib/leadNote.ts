/**
 * The last note a team was handed.
 *
 * When a lead closes, the Bureau's reply carries Lina's note about the next
 * one. The hub shows that note on the next lead until the team opens it, so
 * the walk to the next place is guided by what she actually wrote. It is
 * remembered on the device, per team, because the server only returns it at
 * the moment of the solve (and for a lead that is already closed).
 */

import type { NodeReveal } from '@/types/game-engine'

const KEY = 'nexus_lead_note'

export interface LeadNote {
  teamId: string
  /** The lead the note points at. */
  forNode: string
  clueText: string
  nextPhysicalLocation?: string
}

export function saveLeadNote(teamId: string, forNode: string | null | undefined, reveal: NodeReveal | null | undefined): void {
  if (!forNode || !reveal?.clueText) return
  const note: LeadNote = { teamId, forNode, clueText: reveal.clueText, nextPhysicalLocation: reveal.nextPhysicalLocation }
  try {
    window.localStorage.setItem(KEY, JSON.stringify(note))
  } catch {
    // Private browsing: the hub falls back to its own line.
  }
}

export function readLeadNote(teamId: string | undefined, currentNode: string | undefined): LeadNote | null {
  if (!teamId || !currentNode) return null
  try {
    const raw = window.localStorage.getItem(KEY)
    if (!raw) return null
    const note = JSON.parse(raw) as Partial<LeadNote>
    if (note.teamId !== teamId || note.forNode !== currentNode || typeof note.clueText !== 'string') return null
    return note as LeadNote
  } catch {
    return null
  }
}

/** Lina signs her notes in the data; the hub renders them as handwriting, so drop the label and the quotes. */
export function plainNote(clueText: string): string {
  return clueText
    .replace(/^\s*(LINA'S NOTE|GM NOTE)\s*:\s*/i, '')
    .replace(/^["“]/, '')
    .replace(/["”]\s*$/, '')
    .trim()
}

/** Who wrote it, for the attribution line. */
export function noteAuthor(clueText: string): string {
  return /^\s*GM NOTE/i.test(clueText) ? 'GM' : 'L.V.'
}
