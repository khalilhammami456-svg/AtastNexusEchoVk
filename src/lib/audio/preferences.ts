import { DEFAULT_SOUND_PREFERENCES, type SoundPreferences } from './engine'

const STORAGE_KEY = 'nexus_sound'

/**
 * Read the stored sound preferences. Anything unreadable falls back to the
 * defaults field by field: a corrupt store must never keep the game from
 * starting, and must never switch sound on for someone who switched it off.
 */
export function readSoundPreferences(): SoundPreferences {
  if (typeof window === 'undefined') return { ...DEFAULT_SOUND_PREFERENCES }
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return { ...DEFAULT_SOUND_PREFERENCES }
    const parsed: unknown = JSON.parse(raw)
    if (typeof parsed !== 'object' || parsed === null) return { ...DEFAULT_SOUND_PREFERENCES }
    const p = parsed as Partial<Record<keyof SoundPreferences, unknown>>
    return {
      enabled: typeof p.enabled === 'boolean' ? p.enabled : DEFAULT_SOUND_PREFERENCES.enabled,
      volume:
        typeof p.volume === 'number' && Number.isFinite(p.volume)
          ? Math.min(1, Math.max(0, p.volume))
          : DEFAULT_SOUND_PREFERENCES.volume,
      ambience: typeof p.ambience === 'boolean' ? p.ambience : DEFAULT_SOUND_PREFERENCES.ambience,
    }
  } catch {
    return { ...DEFAULT_SOUND_PREFERENCES }
  }
}

export function writeSoundPreferences(prefs: SoundPreferences): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs))
  } catch {
    // Private browsing and full disks both throw. The choice still applies
    // for this session; it just will not be remembered.
  }
}

export function clearSoundPreferences(): void {
  try {
    window.localStorage.removeItem(STORAGE_KEY)
  } catch {
    // Nothing to recover from.
  }
}
