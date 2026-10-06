/**
 * NEXUS — Sound
 *
 * Owns the one SoundEngine for the app, keeps it in step with the player's
 * preferences, and handles the three things a phone makes difficult:
 *
 *   - Audio cannot start until the player touches the screen. The first
 *     gesture unlocks it; every later one is also offered to the engine so a
 *     context the OS interrupted (a call, another app, a locked screen) is
 *     brought back without the player having to do anything.
 *   - A hidden page must be silent. visibilitychange and pagehide suspend the
 *     context; coming back resumes it.
 *   - Sound is optional and must be easy to find. The preference lives beside
 *     the other display and access settings.
 *
 * useSound() works without a provider and then does nothing, so a component
 * under test, or rendered in isolation, never needs to know sound exists.
 */

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import {
  SoundEngine,
  clearSoundPreferences,
  DEFAULT_SOUND_PREFERENCES,
  readSoundPreferences,
  writeSoundPreferences,
  type CueId,
  type SoundPreferences,
} from '@/lib/audio'

export interface SoundContextValue extends SoundPreferences {
  /** Play a cue. Returns true only if sound was actually made. */
  play: (id: CueId) => boolean
  setEnabled: (enabled: boolean) => void
  setVolume: (volume: number) => void
  setAmbience: (ambience: boolean) => void
  /** Let the case's tension colour the room tone (0–1). */
  setTension: (level: number) => void
  resetSound: () => void
}

const NOOP_VALUE: SoundContextValue = {
  ...DEFAULT_SOUND_PREFERENCES,
  play: () => false,
  setEnabled: () => undefined,
  setVolume: () => undefined,
  setAmbience: () => undefined,
  setTension: () => undefined,
  resetSound: () => undefined,
}

// eslint-disable-next-line react-refresh/only-export-components
export const SoundContext = createContext<SoundContextValue | null>(null)

export function SoundProvider({ children, engine: injected }: { children: ReactNode; engine?: SoundEngine }) {
  const engineRef = useRef<SoundEngine | null>(injected ?? null)
  if (!engineRef.current) engineRef.current = new SoundEngine()
  const engine = engineRef.current

  const [prefs, setPrefs] = useState<SoundPreferences>(() => readSoundPreferences())

  useEffect(() => {
    engine.setPreferences(prefs)
  }, [engine, prefs])

  // First gesture unlocks; later gestures revive an interrupted context.
  useEffect(() => {
    if (typeof window === 'undefined') return
    const offer = () => {
      if (!engine.isRunning) void engine.unlock()
    }
    const events: Array<keyof WindowEventMap> = ['pointerdown', 'touchend', 'keydown']
    events.forEach(name => window.addEventListener(name, offer, { passive: true }))
    return () => events.forEach(name => window.removeEventListener(name, offer))
  }, [engine])

  // A hidden page makes no sound.
  useEffect(() => {
    if (typeof document === 'undefined') return
    const onVisibility = () => engine.setPageVisible(!document.hidden)
    const onHide = () => engine.setPageVisible(false)
    document.addEventListener('visibilitychange', onVisibility)
    window.addEventListener('pagehide', onHide)
    return () => {
      document.removeEventListener('visibilitychange', onVisibility)
      window.removeEventListener('pagehide', onHide)
    }
  }, [engine])

  useEffect(() => {
    // An injected engine belongs to the caller.
    if (injected) return
    return () => engine.dispose()
  }, [engine, injected])

  const commit = useCallback((next: SoundPreferences) => {
    writeSoundPreferences(next)
    setPrefs(next)
  }, [])

  const play = useCallback((id: CueId) => engine.play(id), [engine])
  const setEnabled = useCallback((enabled: boolean) => commit({ ...prefs, enabled }), [commit, prefs])
  const setVolume = useCallback((volume: number) => commit({ ...prefs, volume }), [commit, prefs])
  const setAmbience = useCallback((ambience: boolean) => commit({ ...prefs, ambience }), [commit, prefs])
  const setTension = useCallback((level: number) => engine.setAmbienceLevel(level), [engine])
  const resetSound = useCallback(() => {
    clearSoundPreferences()
    setPrefs({ ...DEFAULT_SOUND_PREFERENCES })
  }, [])

  const value = useMemo<SoundContextValue>(
    () => ({ ...prefs, play, setEnabled, setVolume, setAmbience, setTension, resetSound }),
    [prefs, play, setEnabled, setVolume, setAmbience, setTension, resetSound],
  )

  return <SoundContext.Provider value={value}>{children}</SoundContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useSound(): SoundContextValue {
  return useContext(SoundContext) ?? NOOP_VALUE
}
