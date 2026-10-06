/**
 * NEXUS sound language.
 *
 * Every sound the interface can make is defined here and nowhere else, as a
 * recipe the engine synthesises on demand. There are no audio files: the
 * whole palette is a few hundred bytes, never blocks a load, and cannot be
 * the reason a node fails to open on a weak connection.
 *
 * The palette is deliberately small. Silence is part of this game, so a cue
 * exists only where a moment changes the state of the case. Navigation,
 * scrolling, opening a menu and similar housekeeping make no sound at all.
 *
 * Hierarchy, strongest first. A cue in a higher tier ducks the tiers below it
 * for as long as it rings, so nothing important is ever buried under
 * something less important:
 *
 *   special     the case's largest moments (reconstruction, major discovery)
 *   narrative   transmissions and the NEXUS motif
 *   gameplay    scanning, verification, evidence
 *   system      link state, confirmation and refusal
 *   atmosphere  optional room tone
 *
 * Motifs, kept to three so each stays recognisable:
 *   NEXUS         a low open fifth (A1 – E2). Means: the system is present.
 *   anomaly       two detuned partials beating against each other.
 *   transmission  a carrier that opens, and a squelch that closes it.
 *
 * Levels are peak dBFS for the loudest voice in the cue, before the
 * player's volume. The loudest cue in the game sits near -12 dBFS and the
 * everyday feedback cues near -26 dBFS, so a phone speaker at a normal setting
 * never startles.
 */

export type CueCategory = 'special' | 'narrative' | 'gameplay' | 'system' | 'atmosphere'

/** Higher wins. Used to decide who ducks whom. */
export const CATEGORY_PRIORITY: Record<CueCategory, number> = {
  special: 5,
  narrative: 4,
  gameplay: 3,
  system: 2,
  atmosphere: 1,
}

export interface ToneVoice {
  kind: 'tone'
  wave: OscillatorType
  /** Start frequency in Hz. */
  hz: number
  /** Optional glide target in Hz, reached by the end of the voice. */
  toHz?: number
  /** Seconds after the cue starts. */
  at: number
  /** Total length in seconds, including the release. */
  length: number
  /** Linear gain, 0–1, relative to the cue's own peak. */
  gain: number
  /** Attack in seconds. Defaults to a click-free 8 ms. */
  attack?: number
  /** Cents of fixed detune. Used for the anomaly's beating. */
  detune?: number
}

export interface NoiseVoice {
  kind: 'noise'
  filter: BiquadFilterType
  hz: number
  toHz?: number
  q?: number
  at: number
  length: number
  gain: number
  attack?: number
}

export type Voice = ToneVoice | NoiseVoice

export interface CueDefinition {
  id: CueId
  category: CueCategory
  /** Peak level of the loudest voice, in dBFS. */
  peakDb: number
  /** Minimum gap before the same cue may play again. Prevents fatigue. */
  cooldownMs: number
  /**
   * What the player is told on screen for this event. Every cue is
   * confirmatory: the same event is always shown in words somewhere else, so
   * a muted or deaf player loses atmosphere but never information. This text
   * is that equivalent, kept next to the sound so the two cannot drift apart.
   */
  visual: string
  voices: Voice[]
}

export type CueId =
  | 'confirm'
  | 'refuse'
  | 'link-lost'
  | 'link-restored'
  | 'scan-lock'
  | 'verify'
  | 'hint'
  | 'evidence'
  | 'evidence-key'
  | 'contradiction'
  | 'signal-open'
  | 'signal-close'
  | 'nexus'
  | 'anomaly'
  | 'major-discovery'
  | 'reconstruction'

// Note frequencies. A minor-leaning palette: A and its fifth E are the NEXUS
// pair, and C is the minor third the cues borrow when something is wrong.
const A1 = 55
const E2 = 82.41
const A2 = 110
const E3 = 164.81
const A3 = 220
const C4 = 261.63
const E4 = 329.63
const A4 = 440
const E5 = 659.25

export const CUES: Record<CueId, CueDefinition> = {
  // ── system ────────────────────────────────────────────────────────────
  // A short, dry key-click: a command was accepted by the device.
  confirm: {
    id: 'confirm',
    category: 'system',
    peakDb: -20,
    cooldownMs: 120,
    visual: 'Control shows its processing state, then its result.',
    voices: [
      { kind: 'noise', filter: 'bandpass', hz: 2600, q: 4, at: 0, length: 0.04, gain: 0.8, attack: 0.002 },
      { kind: 'tone', wave: 'square', hz: 1200, at: 0, length: 0.05, gain: 0.25, attack: 0.002 },
    ],
  },
  // A dull, low knock. Not an error buzzer: a door that did not open.
  refuse: {
    id: 'refuse',
    category: 'system',
    peakDb: -24,
    cooldownMs: 500,
    visual: 'Answer shown as not matching; the team may try again.',
    voices: [
      { kind: 'tone', wave: 'sine', hz: 150, toHz: 90, at: 0, length: 0.22, gain: 0.9, attack: 0.004 },
      { kind: 'noise', filter: 'lowpass', hz: 500, at: 0, length: 0.08, gain: 0.35, attack: 0.002 },
    ],
  },
  'link-lost': {
    id: 'link-lost',
    category: 'system',
    peakDb: -26,
    cooldownMs: 4000,
    visual: 'Signal indicator changes and the offline notice appears.',
    voices: [
      { kind: 'tone', wave: 'triangle', hz: 520, toHz: 210, at: 0, length: 0.38, gain: 0.7 },
      { kind: 'noise', filter: 'highpass', hz: 3000, at: 0.1, length: 0.25, gain: 0.25 },
    ],
  },
  'link-restored': {
    id: 'link-restored',
    category: 'system',
    peakDb: -26,
    cooldownMs: 4000,
    visual: 'Signal indicator returns to normal; held answers are sent.',
    voices: [
      { kind: 'tone', wave: 'triangle', hz: 330, toHz: 495, at: 0, length: 0.28, gain: 0.7 },
    ],
  },

  // ── gameplay ──────────────────────────────────────────────────────────
  // The scanner has locked onto a marker: two ticks and a short rising blip.
  'scan-lock': {
    id: 'scan-lock',
    category: 'gameplay',
    peakDb: -20,
    cooldownMs: 600,
    visual: 'Marker recognised and the lead opens.',
    voices: [
      { kind: 'noise', filter: 'bandpass', hz: 3200, q: 6, at: 0, length: 0.03, gain: 0.7, attack: 0.002 },
      { kind: 'noise', filter: 'bandpass', hz: 3200, q: 6, at: 0.07, length: 0.03, gain: 0.7, attack: 0.002 },
      { kind: 'tone', wave: 'sine', hz: A4, toHz: E5, at: 0.13, length: 0.2, gain: 0.8, attack: 0.01 },
    ],
  },
  // Verification: the fifth, resolved upward. Warm, brief, no fanfare.
  verify: {
    id: 'verify',
    category: 'gameplay',
    peakDb: -18,
    cooldownMs: 1200,
    visual: 'VERIFICATION COMPLETE stamp on the record.',
    voices: [
      { kind: 'tone', wave: 'sine', hz: A3, at: 0, length: 0.9, gain: 0.8, attack: 0.012 },
      { kind: 'tone', wave: 'sine', hz: E4, at: 0.11, length: 0.85, gain: 0.7, attack: 0.012 },
      { kind: 'tone', wave: 'triangle', hz: A4, at: 0.22, length: 0.7, gain: 0.25, attack: 0.012 },
    ],
  },
  // Paper moving: a hint is being drawn.
  hint: {
    id: 'hint',
    category: 'gameplay',
    peakDb: -17,
    cooldownMs: 800,
    visual: 'Hint panel opens with its time cost.',
    voices: [
      { kind: 'noise', filter: 'bandpass', hz: 1800, toHz: 4200, q: 1.2, at: 0, length: 0.22, gain: 0.8, attack: 0.04 },
    ],
  },
  // Ordinary material: a single soft bell with a short body.
  evidence: {
    id: 'evidence',
    category: 'gameplay',
    peakDb: -22,
    cooldownMs: 900,
    visual: 'MATERIAL RECOVERED notice and a new record in the archive.',
    voices: [
      { kind: 'tone', wave: 'sine', hz: E5, at: 0, length: 0.5, gain: 0.7, attack: 0.006 },
      { kind: 'tone', wave: 'sine', hz: E5 * 2.01, at: 0, length: 0.22, gain: 0.18, attack: 0.006 },
    ],
  },
  // Material that changes the case: the bell, plus the NEXUS fifth underneath.
  'evidence-key': {
    id: 'evidence-key',
    category: 'gameplay',
    peakDb: -17,
    cooldownMs: 1500,
    visual: 'KEY MATERIAL notice; the record is flagged in the archive.',
    voices: [
      { kind: 'tone', wave: 'sine', hz: E5, at: 0, length: 0.7, gain: 0.6, attack: 0.006 },
      { kind: 'tone', wave: 'sine', hz: A2, at: 0, length: 1.1, gain: 0.7, attack: 0.03 },
      { kind: 'tone', wave: 'sine', hz: E3, at: 0.05, length: 1.0, gain: 0.5, attack: 0.03 },
    ],
  },
  // Two records disagree: a minor second that beats, and a flat low tone.
  contradiction: {
    id: 'contradiction',
    category: 'gameplay',
    peakDb: -17,
    cooldownMs: 1500,
    visual: 'CONFLICT DETECTED; both records are marked as contradicting.',
    voices: [
      { kind: 'tone', wave: 'sawtooth', hz: A3, at: 0, length: 0.95, gain: 0.35, attack: 0.02 },
      { kind: 'tone', wave: 'sawtooth', hz: A3 * 1.0595, at: 0, length: 0.95, gain: 0.35, attack: 0.02 },
      { kind: 'tone', wave: 'sine', hz: A1, at: 0, length: 0.95, gain: 0.7, attack: 0.02 },
    ],
  },

  // ── narrative ─────────────────────────────────────────────────────────
  // Transmission, opening: static washes in, a carrier tone locks, then fades.
  'signal-open': {
    id: 'signal-open',
    category: 'narrative',
    peakDb: -14,
    cooldownMs: 1500,
    visual: 'Transmission header: SIGNAL RECEIVED.',
    voices: [
      { kind: 'noise', filter: 'bandpass', hz: 900, toHz: 3200, q: 0.9, at: 0, length: 0.7, gain: 0.7, attack: 0.15 },
      { kind: 'tone', wave: 'sine', hz: 1020, at: 0.35, length: 0.5, gain: 0.35, attack: 0.05 },
    ],
  },
  // Transmission, closing: the carrier drops and the squelch tail snaps shut.
  'signal-close': {
    id: 'signal-close',
    category: 'narrative',
    peakDb: -21,
    cooldownMs: 1500,
    visual: 'Transmission footer: SIGNAL LOST.',
    voices: [
      { kind: 'tone', wave: 'sine', hz: 1020, toHz: 400, at: 0, length: 0.25, gain: 0.4, attack: 0.004 },
      { kind: 'noise', filter: 'highpass', hz: 2500, at: 0.05, length: 0.16, gain: 0.8, attack: 0.002 },
    ],
  },
  // The NEXUS motif on its own: a low open fifth, slow to arrive, slow to go.
  nexus: {
    id: 'nexus',
    category: 'narrative',
    peakDb: -16,
    cooldownMs: 6000,
    visual: 'NEXUS notice on screen.',
    voices: [
      { kind: 'tone', wave: 'sine', hz: A1, at: 0, length: 2.2, gain: 0.9, attack: 0.35 },
      { kind: 'tone', wave: 'sine', hz: E2, at: 0.25, length: 2.0, gain: 0.7, attack: 0.35 },
      { kind: 'tone', wave: 'triangle', hz: A2, at: 0.25, length: 1.6, gain: 0.18, attack: 0.4 },
    ],
  },

  // ── special ───────────────────────────────────────────────────────────
  // Something is wrong with the record itself: two partials a few cents
  // apart, so the pitch seems to shiver.
  anomaly: {
    id: 'anomaly',
    category: 'special',
    peakDb: -22,
    cooldownMs: 20000,
    visual: 'The screen visibly breaks up for a moment.',
    voices: [
      { kind: 'tone', wave: 'sine', hz: E4, at: 0, length: 1.4, gain: 0.5, attack: 0.25, detune: -14 },
      { kind: 'tone', wave: 'sine', hz: E4, at: 0, length: 1.4, gain: 0.5, attack: 0.25, detune: 14 },
      { kind: 'noise', filter: 'bandpass', hz: 5200, q: 8, at: 0.2, length: 0.9, gain: 0.12, attack: 0.3 },
    ],
  },
  // The truth lands: NEXUS motif, then the shiver on top of it.
  'major-discovery': {
    id: 'major-discovery',
    category: 'special',
    peakDb: -13,
    cooldownMs: 10000,
    visual: 'RECONSTRUCTION UPDATED notice and the record is rewritten.',
    voices: [
      { kind: 'tone', wave: 'sine', hz: A1, at: 0, length: 3.0, gain: 0.9, attack: 0.4 },
      { kind: 'tone', wave: 'sine', hz: E2, at: 0.2, length: 2.8, gain: 0.7, attack: 0.4 },
      { kind: 'tone', wave: 'sine', hz: E4, at: 0.9, length: 1.8, gain: 0.35, attack: 0.3, detune: -12 },
      { kind: 'tone', wave: 'sine', hz: E4, at: 0.9, length: 1.8, gain: 0.35, attack: 0.3, detune: 12 },
    ],
  },
  // Final reconstruction: three voices, one for each role, arriving one after
  // another and resolving on the open fifth. The loudest cue in the game, and
  // played once.
  reconstruction: {
    id: 'reconstruction',
    category: 'special',
    peakDb: -12,
    cooldownMs: 30000,
    visual: 'RECONSTRUCTION COMPLETE.',
    voices: [
      { kind: 'tone', wave: 'sine', hz: A2, at: 0, length: 4.2, gain: 0.8, attack: 0.5 },
      { kind: 'tone', wave: 'sine', hz: C4, at: 0.9, length: 3.4, gain: 0.5, attack: 0.5 },
      { kind: 'tone', wave: 'sine', hz: E4, at: 1.8, length: 2.6, gain: 0.5, attack: 0.5 },
      { kind: 'tone', wave: 'sine', hz: A1, at: 2.4, length: 3.0, gain: 0.9, attack: 0.5 },
      { kind: 'tone', wave: 'sine', hz: E2, at: 2.6, length: 2.8, gain: 0.7, attack: 0.5 },
    ],
  },
}

export function isCueId(value: string): value is CueId {
  return Object.prototype.hasOwnProperty.call(CUES, value)
}
