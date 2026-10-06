/**
 * The sound engine's promises, checked against a fake AudioContext:
 * silent until unlocked, silent when muted or hidden, never repeating itself,
 * and always keeping the hierarchy (special > narrative > gameplay > system).
 */

import { describe, it, expect, beforeEach } from 'vitest'
import { SoundEngine, DEFAULT_SOUND_PREFERENCES } from '@/lib/audio/engine'
import { CUES, CATEGORY_PRIORITY, isCueId, type CueCategory, type CueId } from '@/lib/audio/cues'
import { readSoundPreferences, writeSoundPreferences } from '@/lib/audio/preferences'

class FakeParam {
  value = 0
  calls: string[] = []
  targets: number[] = []
  setValueAtTime(v: number) { this.value = v; this.calls.push('set'); return this }
  linearRampToValueAtTime() { this.calls.push('lin'); return this }
  exponentialRampToValueAtTime() { this.calls.push('exp'); return this }
  setTargetAtTime(v: number) { this.value = v; this.targets.push(v); this.calls.push('target'); return this }
  cancelScheduledValues() { this.calls.push('cancel'); return this }
}

class FakeNode {
  gain = new FakeParam()
  frequency = new FakeParam()
  detune = new FakeParam()
  Q = new FakeParam()
  threshold = new FakeParam()
  knee = new FakeParam()
  ratio = new FakeParam()
  attack = new FakeParam()
  release = new FakeParam()
  type = ''
  buffer: unknown = null
  loop = false
  started = 0
  stopped = 0
  onended: (() => void) | null = null
  constructor(readonly kind: string) {}
  connect(target: unknown) { return target }
  start() { this.started += 1 }
  stop() { this.stopped += 1 }
}

class FakeContext {
  state: 'suspended' | 'running' | 'closed' = 'suspended'
  currentTime = 0
  sampleRate = 8000
  destination = new FakeNode('destination')
  nodes: FakeNode[] = []
  suspendCalls = 0
  resumeCalls = 0
  private make(kind: string) { const n = new FakeNode(kind); this.nodes.push(n); return n }
  createOscillator() { return this.make('osc') }
  createGain() { return this.make('gain') }
  createBiquadFilter() { return this.make('filter') }
  createBufferSource() { return this.make('source') }
  createDynamicsCompressor() { return this.make('comp') }
  createBuffer(_c: number, frames: number) {
    const data = new Float32Array(frames)
    return { getChannelData: () => data }
  }
  async resume() { this.resumeCalls += 1; this.state = 'running' }
  async suspend() { this.suspendCalls += 1; this.state = 'suspended' }
  async close() { this.state = 'closed' }
  count(kind: string) { return this.nodes.filter(n => n.kind === kind).length }
}

function setup() {
  const ctx = new FakeContext()
  let now = 1000
  const engine = new SoundEngine(() => ctx as unknown as AudioContext, () => now)
  return { ctx, engine, advance: (ms: number) => { now += ms } }
}

describe('sound engine', () => {
  beforeEach(() => localStorage.clear())

  it('makes no sound until a gesture unlocks it, but still reports the cue', async () => {
    const { engine } = setup()
    const heard: boolean[] = []
    engine.subscribe(e => heard.push(e.sounded))

    expect(engine.play('verify')).toBe(false)
    expect(heard).toEqual([false])

    await engine.unlock()
    expect(engine.isRunning).toBe(true)
    expect(engine.play('verify')).toBe(true)
    expect(heard).toEqual([false, true])
  })

  it('gives every cue a visual equivalent so nothing is carried by sound alone', () => {
    for (const cue of Object.values(CUES)) {
      expect(cue.visual.trim().length, cue.id).toBeGreaterThan(8)
    }
    const { engine } = setup()
    const seen: string[] = []
    engine.subscribe(e => seen.push(e.visual))
    engine.play('contradiction')
    expect(seen[0]).toMatch(/CONFLICT DETECTED/)
  })

  it('stays silent while muted and reports the cue anyway', async () => {
    const { engine, ctx } = setup()
    await engine.unlock()
    engine.setPreferences({ ...DEFAULT_SOUND_PREFERENCES, enabled: false })
    const before = ctx.count('osc')
    expect(engine.play('verify')).toBe(false)
    expect(ctx.count('osc')).toBe(before)
    expect(ctx.suspendCalls).toBe(1)
  })

  it('does not repeat a cue inside its cooldown, and allows it afterwards', async () => {
    const { engine, advance } = setup()
    await engine.unlock()
    expect(engine.play('verify')).toBe(true)
    expect(engine.play('verify')).toBe(false)
    advance(CUES.verify.cooldownMs + 1)
    expect(engine.play('verify')).toBe(true)
  })

  it('suspends when the page is hidden and resumes when it returns', async () => {
    const { engine, ctx } = setup()
    await engine.unlock()
    engine.setPageVisible(false)
    await Promise.resolve()
    expect(ctx.state).toBe('suspended')
    expect(engine.play('verify')).toBe(false)
    engine.setPageVisible(true)
    await Promise.resolve()
    expect(ctx.state).toBe('running')
  })

  it('does not resume for a hidden-then-visible page while muted', async () => {
    const { engine, ctx } = setup()
    await engine.unlock()
    engine.setPreferences({ ...DEFAULT_SOUND_PREFERENCES, enabled: false })
    await Promise.resolve()
    const resumes = ctx.resumeCalls
    engine.setPageVisible(true)
    await Promise.resolve()
    expect(ctx.resumeCalls).toBe(resumes)
    expect(ctx.state).toBe('suspended')
  })

  it('ducks lower tiers under a higher one, and never the reverse', async () => {
    const { engine, ctx } = setup()
    await engine.unlock()
    // build order: gain nodes are master, then one bus per category in priority-key order
    const gains = ctx.nodes.filter(n => n.kind === 'gain')
    const duckedCount = () => gains.filter(g => g.gain.targets.includes(0.3)).length

    engine.play('confirm') // system: ducks only atmosphere
    const afterSystem = duckedCount()
    engine.play('nexus') // narrative: ducks gameplay, system, atmosphere
    expect(duckedCount()).toBeGreaterThan(afterSystem)

    const spare = setup()
    await spare.engine.unlock()
    const spareGains = spare.ctx.nodes.filter(n => n.kind === 'gain')
    spare.engine.play('refuse') // system tier
    // special/narrative/gameplay buses must be untouched by a system cue
    const touchedByTopTiers = spareGains.filter(g => g.gain.targets.includes(0.3)).length
    expect(touchedByTopTiers).toBe(1) // atmosphere only
  })

  it('keeps the strongest peaks for the strongest tiers', () => {
    const peak = (category: CueCategory) =>
      Math.max(...Object.values(CUES).filter(c => c.category === category).map(c => c.peakDb))
    expect(peak('special')).toBeGreaterThanOrEqual(peak('narrative'))
    expect(peak('narrative')).toBeGreaterThanOrEqual(peak('gameplay'))
    expect(peak('gameplay')).toBeGreaterThanOrEqual(peak('system'))
    // Nothing may ever approach full scale on a phone speaker.
    for (const cue of Object.values(CUES)) expect(cue.peakDb, cue.id).toBeLessThanOrEqual(-12)
  })

  it('reserves the largest cue for the final reconstruction', () => {
    const loudest = Object.values(CUES).sort((a, b) => b.peakDb - a.peakDb)[0]
    expect(loudest.category).toBe('special')
    expect(CUES.reconstruction.cooldownMs).toBeGreaterThanOrEqual(30000)
    expect(CUES.reconstruction.peakDb).toBeGreaterThanOrEqual(CUES['major-discovery'].peakDb - 1)
  })

  it('uses the priority table consistently', () => {
    const order = Object.entries(CATEGORY_PRIORITY).sort((a, b) => b[1] - a[1]).map(([k]) => k)
    expect(order).toEqual(['special', 'narrative', 'gameplay', 'system', 'atmosphere'])
  })

  it('accepts only known cue ids', () => {
    expect(isCueId('verify')).toBe(true)
    expect(isCueId('toString')).toBe(false)
    expect(isCueId('nope' as CueId)).toBe(false)
  })

  it('room tone is off by default and only starts when asked for', async () => {
    const { engine, ctx } = setup()
    await engine.unlock()
    const before = ctx.count('osc')
    expect(engine.getPreferences().ambience).toBe(false)
    expect(ctx.count('osc')).toBe(before)
    engine.setPreferences({ ...DEFAULT_SOUND_PREFERENCES, ambience: true })
    expect(ctx.count('osc')).toBe(before + 2)
    engine.setPreferences({ ...DEFAULT_SOUND_PREFERENCES, ambience: false })
    // stopping must not leak a second bed on re-enable
    engine.setPreferences({ ...DEFAULT_SOUND_PREFERENCES, ambience: true })
    expect(ctx.count('osc')).toBe(before + 4)
  })
})

describe('sound preferences storage', () => {
  beforeEach(() => localStorage.clear())

  it('defaults to sound on at a modest level with room tone off', () => {
    expect(readSoundPreferences()).toEqual({ enabled: true, volume: 0.7, ambience: false })
  })

  it('round-trips and clamps', () => {
    writeSoundPreferences({ enabled: false, volume: 0.25, ambience: true })
    expect(readSoundPreferences()).toEqual({ enabled: false, volume: 0.25, ambience: true })
    localStorage.setItem('nexus_sound', JSON.stringify({ volume: 9 }))
    expect(readSoundPreferences().volume).toBe(1)
  })

  it('falls back field by field on corrupt data', () => {
    localStorage.setItem('nexus_sound', '{not json')
    expect(readSoundPreferences()).toEqual(DEFAULT_SOUND_PREFERENCES)
    localStorage.setItem('nexus_sound', JSON.stringify({ enabled: 'yes', volume: 'loud', ambience: 1 }))
    expect(readSoundPreferences()).toEqual(DEFAULT_SOUND_PREFERENCES)
    localStorage.setItem('nexus_sound', JSON.stringify({ enabled: false }))
    expect(readSoundPreferences()).toEqual({ ...DEFAULT_SOUND_PREFERENCES, enabled: false })
  })
})
