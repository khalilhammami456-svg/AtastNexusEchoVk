import tl from '../data/timeline2.json'

export type Version = 'A' | 'B' | 'C'
export type HookVariant = 'A' | 'B'
export type EndingVariant = 'A' | 'B'

export interface ShotDef {
  id: string
  start: number
  dur: number
  visual: string
  camera: string
  transition: string
  intensity: string
  level: number
  spoiler: string
  purpose: string
}
export interface CueDef { cue: string; t: number; note: string }

export const BASE = tl as unknown as {
  fps: number
  width: number
  height: number
  durationSeconds: number
  centralQuestion: string
  shots: ShotDef[]
  audioCues: CueDef[]
  voice: { file: string; srcStart: number; srcDur: number; t: number }
}

export const W = BASE.width
export const H = BASE.height
export const FPS = BASE.fps
export const sec = (s: number) => Math.round(s * FPS)

/**
 * Ending B skips the silent frame: the montage ends on the figure and cuts straight to the title.
 * Shots after the montage are dropped and the title is pulled forward; later cues move with it.
 */
export function shotsFor(ending: EndingVariant): { shots: ShotDef[]; total: number; shift: (t: number) => number } {
  if (ending === 'A') return { shots: BASE.shots, total: BASE.durationSeconds, shift: (t) => t }
  const cutAt = 48.0
  const titleStart = 53.3
  const pull = titleStart - cutAt
  const shots = BASE.shots
    .filter((s) => !['B14-black-silence', 'B15-final-image', 'B16-black'].includes(s.id))
    .map((s) => (s.start >= titleStart ? { ...s, start: s.start - pull } : s))
  return { shots, total: BASE.durationSeconds - pull, shift: (t) => (t >= titleStart ? t - pull : t) }
}

export const pad4 = (n: number) => String(n).padStart(4, '0')
