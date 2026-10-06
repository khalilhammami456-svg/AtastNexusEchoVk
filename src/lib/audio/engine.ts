/**
 * The NEXUS sound engine.
 *
 * One AudioContext, created only after the player's first gesture (browsers,
 * and phones in particular, refuse to start audio any earlier), and torn down
 * to a suspended state whenever the page is hidden so the game never makes a
 * sound from a locked screen or a background tab.
 *
 * It owns three jobs and nothing else:
 *   1. synthesise cues from the recipes in cues.ts,
 *   2. keep the hierarchy: a louder tier ducks the quieter ones beneath it,
 *   3. refuse to repeat itself (per-cue cooldown, bounded voice count).
 *
 * Everything the engine does is a no-op while sound is disabled or while the
 * context cannot run, so callers never need to check. Nothing here is the only
 * carrier of information: see CueDefinition.visual.
 */

import { CATEGORY_PRIORITY, CUES, type CueCategory, type CueDefinition, type CueId, type NoiseVoice, type ToneVoice } from './cues'

export interface SoundPreferences {
  /** Master switch. Cues are silent when false. */
  enabled: boolean
  /** Master level, 0–1. Applied on a squared curve so the low end is usable. */
  volume: number
  /** Optional room tone under the game. Off unless the player asks for it. */
  ambience: boolean
}

export const DEFAULT_SOUND_PREFERENCES: SoundPreferences = {
  enabled: true,
  volume: 0.7,
  ambience: false,
}

export interface PlayedCue {
  id: CueId
  category: CueCategory
  visual: string
  /** False when the cue was withheld (muted, cooling down, context not ready). */
  sounded: boolean
}

type CueListener = (event: PlayedCue) => void

/** How far a louder tier pushes the quieter ones down, and for how long they stay down. */
const DUCK_DEPTH = 0.3
const DUCK_ATTACK_S = 0.04
const DUCK_RELEASE_S = 0.6
const MAX_VOICES = 14
const SCHEDULE_LEAD_S = 0.1
/** The room-tone bed sits this far below the master level. */
const AMBIENCE_LEVEL = 0.05

const CATEGORIES = Object.keys(CATEGORY_PRIORITY) as CueCategory[]

type ContextFactory = () => AudioContext | null

function defaultFactory(): AudioContext | null {
  if (typeof window === 'undefined') return null
  const Ctor: typeof AudioContext | undefined =
    window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
  if (!Ctor) return null
  try {
    return new Ctor({ latencyHint: 'interactive' })
  } catch {
    return null
  }
}

const dbToGain = (db: number) => Math.pow(10, db / 20)

export class SoundEngine {
  private ctx: AudioContext | null = null
  private master: GainNode | null = null
  private buses = new Map<CueCategory, GainNode>()
  private noise: AudioBuffer | null = null
  private prefs: SoundPreferences = { ...DEFAULT_SOUND_PREFERENCES }
  private lastPlayed = new Map<CueId, number>()
  private duckUntil = new Map<CueCategory, number>()
  private liveVoices = 0
  private listeners = new Set<CueListener>()
  private ambience: { stop: () => void } | null = null
  private ambienceLevel = 0

  constructor(
    private readonly factory: ContextFactory = defaultFactory,
    private readonly clock: () => number = () => (typeof performance !== 'undefined' ? performance.now() : Date.now()),
  ) {}

  // ── preferences ─────────────────────────────────────────────────────────

  setPreferences(next: SoundPreferences): void {
    const wasEnabled = this.prefs.enabled
    this.prefs = { ...next, volume: Math.min(1, Math.max(0, next.volume)) }
    this.applyMasterLevel()
    if (!this.prefs.enabled) {
      this.stopAmbience()
      if (wasEnabled) void this.suspend()
      return
    }
    if (!wasEnabled && this.ctx) void this.resume()
    this.syncAmbience()
  }

  getPreferences(): SoundPreferences {
    return { ...this.prefs }
  }

  // ── lifecycle ───────────────────────────────────────────────────────────

  /**
   * Create and start the context. Must be called from inside a user gesture
   * the first time. Safe to call again from every later gesture: that is how
   * a context the OS interrupted (a phone call, another app taking audio) is
   * brought back, since browsers will not resume it without one.
   */
  async unlock(): Promise<boolean> {
    if (!this.ctx) {
      const ctx = this.factory()
      if (!ctx) return false
      this.ctx = ctx
      this.build(ctx)
    }
    if (!this.prefs.enabled) return this.ctx.state === 'running'
    await this.resume()
    this.syncAmbience()
    return this.ctx.state === 'running'
  }

  /** True once a context exists and is producing sound. */
  get isRunning(): boolean {
    return this.ctx?.state === 'running'
  }

  async suspend(): Promise<void> {
    const ctx = this.ctx
    if (!ctx || ctx.state !== 'running') return
    try {
      await ctx.suspend()
    } catch {
      // A context that cannot suspend is already not making sound.
    }
  }

  async resume(): Promise<void> {
    const ctx = this.ctx
    if (!ctx || !this.prefs.enabled || ctx.state === 'running' || ctx.state === 'closed') return
    try {
      await ctx.resume()
    } catch {
      // Autoplay policy: the next gesture will try again through unlock().
    }
  }

  /** Called when the page is hidden or shown again. */
  setPageVisible(visible: boolean): void {
    if (visible) void this.resume()
    else void this.suspend()
  }

  dispose(): void {
    this.stopAmbience()
    this.listeners.clear()
    const ctx = this.ctx
    this.ctx = null
    this.master = null
    this.buses.clear()
    this.noise = null
    if (ctx && ctx.state !== 'closed') void ctx.close().catch(() => undefined)
  }

  // ── playback ────────────────────────────────────────────────────────────

  subscribe(listener: CueListener): () => void {
    this.listeners.add(listener)
    return () => {
      this.listeners.delete(listener)
    }
  }

  /**
   * Play a cue. Returns true only if sound was actually made. Listeners are
   * told either way, so a visual that mirrors the sound still appears when
   * the sound is muted.
   */
  play(id: CueId): boolean {
    const def = CUES[id]
    const sounded = this.trySound(def)
    const event: PlayedCue = { id, category: def.category, visual: def.visual, sounded }
    this.listeners.forEach(listener => listener(event))
    return sounded
  }

  private trySound(def: CueDefinition): boolean {
    const ctx = this.ctx
    if (!this.prefs.enabled || !ctx || !this.master || ctx.state !== 'running') return false

    const now = this.clock()
    const last = this.lastPlayed.get(def.id)
    if (last !== undefined && now - last < def.cooldownMs) return false
    if (this.liveVoices + def.voices.length > MAX_VOICES) return false
    this.lastPlayed.set(def.id, now)

    const bus = this.buses.get(def.category)
    if (!bus) return false

    // Schedule a little ahead of the clock. Events scheduled in the past make
    // an attack ramp jump straight to full level, which is an audible click;
    // a busy main thread (React rendering the very screen that triggered this
    // cue) is enough to be 10 ms late.
    const t0 = ctx.currentTime + SCHEDULE_LEAD_S
    const peak = dbToGain(def.peakDb)
    const length = Math.max(...def.voices.map(v => v.at + v.length))

    this.duckBelow(def.category, t0, length)

    for (const voice of def.voices) {
      if (voice.kind === 'tone') this.tone(ctx, bus, voice, t0, peak)
      else this.noiseVoice(ctx, bus, voice, t0, peak)
    }
    return true
  }

  private tone(ctx: AudioContext, bus: GainNode, v: ToneVoice, t0: number, peak: number): void {
    const osc = ctx.createOscillator()
    const env = ctx.createGain()
    osc.type = v.wave
    const start = t0 + v.at
    const end = start + v.length
    osc.frequency.setValueAtTime(v.hz, start)
    if (v.toHz) osc.frequency.exponentialRampToValueAtTime(v.toHz, end)
    if (v.detune) osc.detune.setValueAtTime(v.detune, start)
    this.envelope(env, start, end, v.attack ?? 0.008, peak * v.gain)
    osc.connect(env).connect(bus)
    this.track(osc, start, end)
  }

  private noiseVoice(ctx: AudioContext, bus: GainNode, v: NoiseVoice, t0: number, peak: number): void {
    if (!this.noise) return
    const src = ctx.createBufferSource()
    src.buffer = this.noise
    src.loop = true
    const filter = ctx.createBiquadFilter()
    const env = ctx.createGain()
    filter.type = v.filter
    const start = t0 + v.at
    const end = start + v.length
    filter.frequency.setValueAtTime(v.hz, start)
    if (v.toHz) filter.frequency.exponentialRampToValueAtTime(v.toHz, end)
    if (v.q) filter.Q.setValueAtTime(v.q, start)
    this.envelope(env, start, end, v.attack ?? 0.005, peak * v.gain)
    src.connect(filter).connect(env).connect(bus)
    this.track(src, start, end)
  }

  /** Linear attack, exponential release: no clicks, no hard edges. */
  private envelope(env: GainNode, start: number, end: number, attack: number, level: number): void {
    const g = env.gain
    g.setValueAtTime(0.0001, start)
    g.linearRampToValueAtTime(Math.max(level, 0.0002), start + Math.min(attack, (end - start) / 2))
    g.exponentialRampToValueAtTime(0.0001, end)
  }

  private track(node: OscillatorNode | AudioBufferSourceNode, start: number, end: number): void {
    this.liveVoices += 1
    node.onended = () => {
      this.liveVoices = Math.max(0, this.liveVoices - 1)
    }
    node.start(start)
    node.stop(end + 0.05)
  }

  /** Push every lower tier down while a higher one rings, then let it back up. */
  private duckBelow(category: CueCategory, t0: number, length: number): void {
    const ctx = this.ctx
    if (!ctx) return
    const priority = CATEGORY_PRIORITY[category]
    for (const other of CATEGORIES) {
      if (CATEGORY_PRIORITY[other] >= priority) continue
      const bus = this.buses.get(other)
      if (!bus) continue
      const hold = t0 + length
      if ((this.duckUntil.get(other) ?? 0) > hold) continue
      this.duckUntil.set(other, hold)
      bus.gain.cancelScheduledValues(t0)
      bus.gain.setTargetAtTime(DUCK_DEPTH, t0, DUCK_ATTACK_S)
      bus.gain.setTargetAtTime(1, hold, DUCK_RELEASE_S / 3)
    }
  }

  // ── ambience ────────────────────────────────────────────────────────────

  /**
   * Optional room tone. `level` (0–1) lets the case's tension nudge it, but
   * it never rises above a bed that sits under every other tier.
   */
  setAmbienceLevel(level: number): void {
    this.ambienceLevel = Math.min(1, Math.max(0, level))
    if (this.ambience && this.ctx && this.buses.get('atmosphere')) this.applyAmbienceGain()
  }

  private syncAmbience(): void {
    const wanted = this.prefs.enabled && this.prefs.ambience
    if (wanted && !this.ambience) this.startAmbience()
    else if (!wanted && this.ambience) this.stopAmbience()
  }

  private applyAmbienceGain(): void {
    const ctx = this.ctx
    const bed = this.ambienceBed
    if (!ctx || !bed) return
    bed.gain.setTargetAtTime(AMBIENCE_LEVEL * (0.7 + 0.3 * this.ambienceLevel), ctx.currentTime, 0.8)
  }

  private ambienceBed: GainNode | null = null

  private startAmbience(): void {
    const ctx = this.ctx
    const bus = this.buses.get('atmosphere')
    if (!ctx || !bus || ctx.state !== 'running') return

    const bed = ctx.createGain()
    bed.gain.setValueAtTime(0.0001, ctx.currentTime)
    bed.connect(bus)
    this.ambienceBed = bed

    // Two low partials a hair apart, so the floor breathes slowly instead of
    // sitting on one dead pitch, and a trace of filtered air above them.
    const a = ctx.createOscillator()
    const b = ctx.createOscillator()
    a.type = 'sine'
    b.type = 'sine'
    a.frequency.value = 55
    b.frequency.value = 55.6
    a.connect(bed)
    b.connect(bed)

    const air = this.noise ? ctx.createBufferSource() : null
    const airFilter = ctx.createBiquadFilter()
    const airGain = ctx.createGain()
    if (air && this.noise) {
      air.buffer = this.noise
      air.loop = true
      airFilter.type = 'lowpass'
      airFilter.frequency.value = 380
      airGain.gain.value = 0.35
      air.connect(airFilter).connect(airGain).connect(bed)
      air.start()
    }
    a.start()
    b.start()
    this.applyAmbienceGain()

    this.ambience = {
      stop: () => {
        const end = ctx.currentTime + 1.2
        bed.gain.cancelScheduledValues(ctx.currentTime)
        bed.gain.setTargetAtTime(0.0001, ctx.currentTime, 0.3)
        for (const node of [a, b, air]) {
          if (!node) continue
          try {
            node.stop(end)
          } catch {
            // Already stopped.
          }
        }
        this.ambienceBed = null
      },
    }
  }

  private stopAmbience(): void {
    this.ambience?.stop()
    this.ambience = null
  }

  // ── graph ───────────────────────────────────────────────────────────────

  private build(ctx: AudioContext): void {
    const master = ctx.createGain()
    // No dynamics processing: a compressor adds make-up gain and overshoots
    // on sudden noise onsets (measured: a 17 dB spike on the squelch). The
    // palette is designed to stay well under full scale instead: the cues sum
    // to at most about 0.85 at full volume, and the master gain never exceeds 1.
    master.connect(ctx.destination)
    this.master = master

    for (const category of CATEGORIES) {
      const bus = ctx.createGain()
      bus.gain.value = 1
      bus.connect(master)
      this.buses.set(category, bus)
    }

    const frames = ctx.sampleRate
    const buffer = ctx.createBuffer(1, frames, ctx.sampleRate)
    const data = buffer.getChannelData(0)
    for (let i = 0; i < frames; i += 1) data[i] = Math.random() * 2 - 1
    this.noise = buffer

    this.applyMasterLevel()
    this.warmUp(ctx)
  }

  /**
   * Run every kind of node once, silently, so the first real cue does not pay
   * for creating them: browsers compile the filter and oscillator paths on
   * first use, and that stall lands on the very first cue the player hears.
   */
  private warmUp(ctx: AudioContext): void {
    const mute = ctx.createGain()
    mute.gain.value = 0
    if (this.master) mute.connect(this.master)
    const osc = ctx.createOscillator()
    osc.connect(mute)
    osc.start()
    osc.stop(ctx.currentTime + 0.05)
    if (this.noise) {
      const src = ctx.createBufferSource()
      const filter = ctx.createBiquadFilter()
      src.buffer = this.noise
      src.connect(filter).connect(mute)
      src.start()
      src.stop(ctx.currentTime + 0.05)
    }
  }

  private applyMasterLevel(): void {
    if (!this.master || !this.ctx) return
    const level = this.prefs.enabled ? this.prefs.volume * this.prefs.volume : 0
    this.master.gain.setTargetAtTime(level, this.ctx.currentTime, 0.03)
  }
}
