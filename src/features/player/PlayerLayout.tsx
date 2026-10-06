/**
 * NEXUS ECHO — Player Layout
 *
 * Mobile-first layout wrapper for all player screens.
 * Shows PlayerHeader, the connection banner and BottomNav only when
 * authenticated, and reserves bottom padding only where the nav actually renders.
 *
 * The shell also carries the narrative level. The whole subtree drains colour
 * through `[data-horror]` on this one element, so escalation is a property of
 * the case rather than of any individual screen — and no screen has to know
 * about it.
 */

import { useEffect, useMemo, useRef } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { PlayerHeader } from '@/components/player/PlayerHeader'
import { BottomNav } from '@/components/player/BottomNav'
import { OfflineBanner } from '@/components/player/OfflineBanner'
import { SignalLayer } from '@/components/visual/SignalLayer'
import { GlitchLayer } from '@/components/visual/GlitchLayer'
import { VisualEnvironmentProvider } from '@/components/visual/VisualEnvironment'
import { shouldRenderBottomNav } from '@/lib/navigation'
import { useApp } from '@/app/providers'
import { useSound } from '@/app/providers/SoundProvider'
import { useConnection } from '@/hooks/useConnection'
import { useSubmissionQueue } from '@/hooks/useSubmissionQueue'
import { useNarrative } from '@/hooks/useNarrative'
import { PUZZLE_COUNT } from '@/content/puzzles'
import { glitch, subscribeGlitch } from '@/lib/vfx/glitch'

export function PlayerLayout() {
  const { isAuthenticated, isInitializing, teamProgress, unreadCount } = useApp()
  const connection = useConnection()
  const queue = useSubmissionQueue()
  const { pathname } = useLocation()
  const showLayout = isAuthenticated && !isInitializing

  // BottomNav renders only on the five listed destinations; the content
  // padding has to follow it or detail screens get a dead strip at the bottom.
  const showBottomNav = showLayout && shouldRenderBottomNav(pathname)

  const signals = useMemo(
    () => ({
      solvedCount: teamProgress ? Object.keys(teamProgress.solvedNodes).length : 0,
      totalNodes: PUZZLE_COUNT,
      hintsUsed: teamProgress?.hintsUsed ?? 0,
      isOffline: connection.isOffline,
      queuedCount: queue.count,
      unreadCount,
    }),
    [teamProgress, connection.isOffline, queue.count, unreadCount]
  )

  const narrative = useNarrative(signals)

  // A dispatch arriving while the device is open is the one authored moment in
  // the shell: a brief disruption, then calm. Not on first load, not on read.
  const lastUnread = useRef<number | null>(null)
  useEffect(() => {
    const previous = lastUnread.current
    lastUnread.current = unreadCount
    if (previous !== null && unreadCount > previous) glitch({ type: 'LIGHT' })
  }, [unreadCount])
  const horrorLevel = narrative.level

  // Sound marks only the moments the case changes. Each cue below has a
  // visual twin already on screen, and none fires on first load.
  const { play, setTension } = useSound()

  // Tension quietly shapes the optional room tone; it never makes a sound of
  // its own.
  useEffect(() => {
    setTension((narrative.level - 1) / 5)
  }, [narrative.level, setTension])

  // The case escalates: NEXUS is present. Upward changes only, and only once
  // the investigation is properly under way.
  const lastLevel = useRef<number | null>(null)
  useEffect(() => {
    const previous = lastLevel.current
    lastLevel.current = narrative.level
    if (previous !== null && narrative.level > previous && narrative.level >= 3) play('nexus')
  }, [narrative.level, play])

  // The link drops, and comes back.
  const lastLink = useRef<boolean | null>(null)
  useEffect(() => {
    const offline = connection.isOffline
    const previous = lastLink.current
    lastLink.current = offline
    if (previous === null || previous === offline) return
    play(offline ? 'link-lost' : 'link-restored')
  }, [connection.isOffline, play])

  // A strong visible glitch is the world going wrong; give it a voice. The
  // brief, frequent signal dropouts stay silent so they never become a ticking
  // clock, and reduced-motion events are heard at the same quiet level.
  useEffect(() => {
    return subscribeGlitch(event => {
      if (event.type === 'LIGHT' || event.type === 'SIGNAL') return
      if (event.intensity < 0.5) return
      play('anomaly')
    })
  }, [play])

  // Derive signal strength from connection state for the visual environment
  const signalStrength = useMemo(() => {
    switch (connection.status) {
      case 'online': return 100
      case 'degraded': return 50
      case 'unavailable': return 30
      case 'reconnecting': return 60
      case 'offline': return 0
      default: return 0
    }
  }, [connection.status])

  return (
    <VisualEnvironmentProvider
      profile="FIELD_DEVICE"
      horrorLevel={horrorLevel}
      signalStrength={signalStrength}
      isConnected={connection.isOffline ? false : true}
    >
      <div
        data-horror={narrative.level}
        className="relative bg-nexus-bg text-nexus-text flex flex-col safe-area-x app-viewport nexus-handset-shell"
      >
        <SignalLayer signalStrength={signalStrength} />
        <GlitchLayer />
        {showLayout && <PlayerHeader />}
        {showLayout && (
          <OfflineBanner
            connection={connection}
            queuedCount={queue.count}
            lastFlush={queue.lastFlush}
            onAcknowledge={queue.clearLastFlush}
          />
        )}

        <main
          className={
            showBottomNav
              ? 'relative flex-1 w-full overflow-x-hidden pb-[calc(104px+var(--safe-bottom))] md:pb-0'
              : 'relative flex-1 w-full overflow-x-hidden'
          }
        >
          <Outlet />
        </main>

        {showLayout && <BottomNav />}
      </div>
    </VisualEnvironmentProvider>
  )
}