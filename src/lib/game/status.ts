import type { GameStatus } from '@/types/domain'

/**
 * The server speaks in team states (ACTIVE, COMPLETED, ...); the handset's
 * screens speak in case states (RUNNING, ENDED, ...). The two vocabularies
 * were once compared directly, so a real team's ACTIVE never equalled the
 * RUNNING that the hub and waiting room test for. This is the one place that
 * translates between them.
 */
export function gameStatusFromTeamStatus(teamStatus: string | null | undefined): GameStatus {
  switch (teamStatus) {
    case 'ACTIVE':
      return 'RUNNING'
    case 'PAUSED':
      return 'PAUSED'
    case 'COMPLETED':
    case 'DISQUALIFIED':
    case 'ABANDONED':
      return 'ENDED'
    default:
      return 'NOT_STARTED'
  }
}
