// Music / motif building blocks (all original synthesis).
// The motif: three notes A2 - Bb2 - E3 (a minor second stacked under a tritone, A against E a fifth),
// played as a tape-warped analog tone with a long ping-pong echo ("the echo of the title").
import { SR, TAU, buf, rng, Biquad, OnePole, whiteBuf, modal, peakOf, clamp, lerp, smooth, cents, tapeEcho, put, envAt } from './dsp.mjs'

export const F = { A1: 55, Bb1: 58.2705, E2: 82.4069, A2: 110, Bb2: 116.5409, E3: 164.8138, A3: 220, Bb3: 233.0819, E4: 329.6276, F3: 174.6141 }
export const MOTIF = [F.A2, F.Bb2, F.E3] // note 1, 2, 3

// Tape-warped analog-style tone. freqs: array of Hz (played together). Returns mono buffer (peak-normalised to 1).
export function motifTone(freqs, dur, r, { detune = [0, 0, 0], attack = 0.06, tau = 1.5, fc0 = 2300, fc1 = 520, fcTau = 0.7, warp = 1, nh = 9, voices = 2, sag = 0.014 } = {}) {
  const n = Math.round(dur * SR), b = buf(n)
  const p1 = r() * TAU, p2 = r() * TAU, p3 = r() * TAU
  freqs.forEach((f0, k) => {
    const dc = detune[k] ?? 0
    for (let v = 0; v < voices; v++) {
      const vf = f0 * cents(dc + (v === 0 ? -3.5 : 3.5) * (1 + 0.3 * k))
      let ph = r() * TAU
      for (let i = 0; i < n; i++) {
        const t = i / SR
        // tape transport: slow wow + faster flutter + start-up sag (note enters flat) + droop in the tail
        const pf = 1 + warp * (0.0022 * Math.sin(TAU * 0.62 * t + p1) + 0.0007 * Math.sin(TAU * 6.1 * t + p2) + 0.0004 * Math.sin(TAU * 11.3 * t + p3)) - sag * Math.exp(-t / 0.2) - 0.012 * warp * smooth((t - dur * 0.55) / (dur * 0.45))
        ph += TAU * vf * pf / SR
        let s = 0
        for (let h = 1; h <= nh; h++) s += Math.sin(ph * h) / Math.pow(h, 1.25)
        b[i] += s * (v === 0 ? 1 : 0.85)
      }
    }
  })
  // envelope + time-varying low-pass (bright at onset, darkening) + tape saturation
  const lp = new Biquad('lp', fc0, 0.8), lp2 = new Biquad('lp', fc0, 0.7)
  for (let i = 0; i < n; i++) {
    const t = i / SR
    if ((i & 15) === 0) { const fc = fc1 + (fc0 - fc1) * Math.exp(-t / fcTau); lp.set(fc, 0.8); lp2.set(fc * 1.3, 0.7) }
    const env = smooth(t / attack) * Math.exp(-t / tau)
    b[i] = Math.tanh(lp2.p(lp.p(b[i])) * env * 1.8)
  }
  const m = peakOf(b); if (m > 0) for (let i = 0; i < n; i++) b[i] /= m
  return b
}

// processed-piano-like tone: additive, stretched partials, felt hammer, long decay, tape wobble
export function pianoTone(f0, dur, r, { tau = 2.6, bright = 1 } = {}) {
  const n = Math.round(dur * SR), b = buf(n)
  const B = 0.0004, ph0 = r() * TAU
  for (let h = 1; h <= 16; h++) {
    const f = f0 * h * Math.sqrt(1 + B * h * h)
    if (f > 7000) break
    const a = Math.pow(h, -1.0) * Math.exp(-h / (9 / bright)) * (h === 2 ? 1.2 : 1) * (1 + r.sym(0.1))
    const tn = tau / (1 + 0.5 * h)
    let ph = ph0 * h
    const len = Math.min(n, Math.round(tn * 8 * SR))
    for (let i = 0; i < len; i++) {
      const t = i / SR
      ph += TAU * f * (1 + 0.0012 * Math.sin(TAU * 0.8 * t + h)) / SR
      b[i] += Math.sin(ph) * a * Math.exp(-t / tn) * Math.min(1, t / 0.004)
    }
  }
  const z = whiteBuf(Math.round(0.03 * SR), r), bp = new Biquad('bp', 1900, 1.5)
  for (let i = 0; i < z.length; i++) b[i] += bp.p(z[i]) * Math.exp(-(i / SR) / 0.005) * 0.5
  const lp = new Biquad('lp', 2800 * bright, 0.7)
  for (let i = 0; i < n; i++) b[i] = Math.tanh(lp.p(b[i]) * 1.2)
  const m = peakOf(b); if (m > 0) for (let i = 0; i < n; i++) b[i] /= m
  return b
}

// pluck for the machine pulse: saw + octave square, resonant LP closing fast.
export function pulsePluck(f, r, { dur = 0.3, cut0 = 1500, cut1 = 130, tau = 0.11, q = 2.6, oct = 0.5 } = {}) {
  const n = Math.round(dur * SR), b = buf(n), bq = new Biquad('lp', cut0, q), bq2 = new Biquad('lp', cut0, 0.7)
  let p1 = r(), p2 = r()
  for (let i = 0; i < n; i++) {
    const t = i / SR
    if ((i & 7) === 0) { const fc = cut1 + (cut0 - cut1) * Math.exp(-t / 0.05); bq.set(fc, q); bq2.set(fc * 1.5, 0.7) }
    p1 += f / SR; p2 += (f * 2.0 * 1.0035) / SR
    const saw = 2 * (p1 % 1) - 1, sq = (p2 % 1) < 0.5 ? 1 : -1
    b[i] = bq2.p(bq.p(saw + sq * oct)) * Math.exp(-t / tau) * Math.min(1, t / 0.002)
  }
  const m = peakOf(b); if (m > 0) for (let i = 0; i < n; i++) b[i] /= m
  return b
}
export function machineTick(r, hf = 6500) {
  const n = Math.round(0.03 * SR), b = buf(n), z = whiteBuf(n, r), hp = new Biquad('hp', hf, 0.7)
  for (let i = 0; i < n; i++) b[i] = hp.p(z[i]) * Math.exp(-(i / SR) / 0.004)
  const m = peakOf(b); if (m > 0) for (let i = 0; i < n; i++) b[i] /= m
  return b
}

// place a note + its tape echo on a stem. dry/wet linear gains. hall = reverb send of the dry part
export function placeEchoed(stem, mono, t, { dry = 1, wet = 0.8, pan = 0, hall = 0.3, echo = {}, tail = 8 } = {}) {
  const n = Math.round((mono.length / SR + tail) * SR)
  const e = tapeEcho(mono, n, echo)
  put(stem, mono, t, dry, pan, 0, hall)
  put(stem, e, t, wet, 0, 0, hall * 0.8)
}

// continuous drone: two detuned saws, low-passed with a slow LFO on the filter, plus a quiet sub sine.
// ampPts / fcPts are [[t,v]..] envelopes. Writes straight into the stem (dry + hall send).
export function drone(stem, { f = F.A1, ampPts, fcPts, subPts, detune = 11, lfoHz = 0.06, hall = 0.25, seed = 9, t0 = 0, t1 = 56 }) {
  const r = rng(seed), i0 = Math.round(t0 * SR), i1 = Math.min(Math.round(t1 * SR), stem.L.length)
  const lpA = new Biquad('lp', 200, 1.6), lpB = new Biquad('lp', 200, 1.6), lpA2 = new Biquad('lp', 200, 0.7), lpB2 = new Biquad('lp', 200, 0.7)
  let pa = r(), pb = r(), ps = 0
  const lfoP = r() * TAU
  const fa = f * cents(-detune / 2), fb = f * cents(detune / 2)
  for (let i = i0; i < i1; i++) {
    const t = i / SR
    const amp = envAt(ampPts, t)
    pa += fa / SR; pb += fb * (1 + 0.0004 * Math.sin(TAU * 0.11 * t)) / SR
    ps += TAU * f * (1 + 0.0006 * Math.sin(TAU * 0.07 * t)) / SR
    if (amp <= 0.0001) continue
    if ((i & 15) === 0) {
      const fc = envAt(fcPts, t) * (1 + 0.5 * Math.sin(TAU * lfoHz * t + lfoP))
      lpA.set(fc, 1.6); lpA2.set(fc * 1.4, 0.7); lpB.set(fc * 1.06, 1.6); lpB2.set(fc * 1.45, 0.7)
    }
    const sa = lpA2.p(lpA.p(2 * (pa % 1) - 1)), sb = lpB2.p(lpB.p(2 * (pb % 1) - 1))
    const sub = Math.sin(ps) * envAt(subPts, t)
    const l = (sa * 0.8 + sb * 0.35 + sub) * amp, rr = (sa * 0.35 + sb * 0.8 + sub) * amp
    stem.L[i] += l; stem.R[i] += rr
    stem.hL[i] += l * hall; stem.hR[i] += rr * hall
  }
}

// detuned-saw pad voices (the 'added harmonic tension'): freqs list, bend(t) in semitones, env
export function pad(stem, { freqs, ampPts, fcPts, bend = () => 0, spread = 8, hall = 0.55, seed = 21, t0, t1, lfoHz = 0.09 }) {
  const r = rng(seed), i0 = Math.round(t0 * SR), i1 = Math.round(t1 * SR)
  const vs = freqs.flatMap((f, k) => [-1, 1].map((s, j) => ({ f: f * cents(s * spread * (1 + 0.2 * k)), ph: r(), pan: (k % 2 ? 1 : -1) * (j ? 0.35 : -0.35) * (1 + 0.2 * k), lp: new Biquad('lp', 600, 1.2), lp2: new Biquad('lp', 900, 0.7) })))
  const lfoP = r() * TAU
  for (let i = i0; i < i1; i++) {
    const t = i / SR, amp = envAt(ampPts, t)
    const bf = Math.pow(2, bend(t) / 12)
    if ((i & 15) === 0) { const fc = envAt(fcPts, t) * (1 + 0.35 * Math.sin(TAU * lfoHz * t + lfoP)); for (const v of vs) { v.lp.set(fc, 1.2); v.lp2.set(fc * 1.5, 0.7) } }
    let l = 0, rr = 0
    for (const v of vs) {
      v.ph += v.f * bf / SR
      const s = v.lp2.p(v.lp.p(2 * (v.ph % 1) - 1))
      const gl = Math.cos((v.pan + 1) * Math.PI / 4), gr = Math.sin((v.pan + 1) * Math.PI / 4)
      l += s * gl; rr += s * gr
    }
    if (amp > 0) {
      l *= amp * 0.07; rr *= amp * 0.07
      stem.L[i] += l; stem.R[i] += rr; stem.hL[i] += l * hall; stem.hR[i] += rr * hall
    }
  }
}
