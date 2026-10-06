import { describe, it, expect } from 'vitest'
import { gameStatusFromTeamStatus } from '@/lib/game/status'

describe('gameStatusFromTeamStatus', () => {
  it('turns the server team state into the case state the screens test for', () => {
    expect(gameStatusFromTeamStatus('ACTIVE')).toBe('RUNNING')
    expect(gameStatusFromTeamStatus('PAUSED')).toBe('PAUSED')
    expect(gameStatusFromTeamStatus('COMPLETED')).toBe('ENDED')
    expect(gameStatusFromTeamStatus('DISQUALIFIED')).toBe('ENDED')
    expect(gameStatusFromTeamStatus('ABANDONED')).toBe('ENDED')
  })

  it('treats every pre-start or unknown state as not started', () => {
    for (const s of ['REGISTERED', 'FORMING', 'READY', 'WAITING', 'RESET', '', undefined, null, 'SOMETHING_ELSE']) {
      expect(gameStatusFromTeamStatus(s as string | null | undefined)).toBe('NOT_STARTED')
    }
  })
})
