// DSP core for the NEXUS ECHO teaser audio v2. Plain Node, no dependencies. Deterministic.
import fs from 'node:fs'

export const SR = 48000
export const DUR = 56.0
export const N = Math.round(DUR * SR)
export const TAU = Math.PI * 2

// ---------- random ----------
export function rng(seed) {
  let a = seed >>> 0
  const f = () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
  f.range = (a0, b0) => a0 + (b0 - a0) * f()
  f.sym = (w) => (f() * 2 - 1) * w // symmetric +-w
  f.gauss = () => { let s = 0; for (let i = 0; i < 6; i++) s += f(); return (s - 3) / 0.7071 }
  return f
}
// stable seed from a number (time in s) and a salt
export const seedOf = (t, salt = 0) => (Math.round(t * 1000) * 2654435761 + salt * 40503 + 12345) >>> 0

// ---------- small helpers ----------
export const dB = (x) => Math.pow(10, x / 20)
export const toDb = (x) => 20 * Math.log10(Math.max(x, 1e-12))
export const clamp = (x, a, b) => Math.min(b, Math.max(a, x))
export const lerp = (a, b, t) => a + (b - a) * t
export const smooth = (x) => { x = clamp(x, 0, 1); return x * x * (3 - 2 * x) }
export const mtof = (m) => 440 * Math.pow(2, (m - 69) / 12)
export const cents = (c) => Math.pow(2, c / 1200)
export const buf = (n) => new Float32Array(n)

// piecewise-linear envelope, pts = [[t,v],...]
export function envAt(pts, t) {
  if (t <= pts[0][0]) return pts[0][1]
  for (let i = 1; i < pts.length; i++) {
    if (t <= pts[i][0]) {
      const [t0, v0] = pts[i - 1], [t1, v1] = pts[i]
      return t1 === t0 ? v1 : v0 + ((t - t0) / (t1 - t0)) * (v1 - v0)
    }
  }
  return pts[pts.length - 1][1]
}

// ---------- RBJ biquad ----------
export class Biquad {
  constructor(type, f, q = 0.7071, gainDb = 0) { this.type = type; this.x1 = this.x2 = this.y1 = this.y2 = 0; this.set(f, q, gainDb) }
  set(f, q = this.q ?? 0.7071, gainDb = this.g ?? 0) {
    this.f = f; this.q = q; this.g = gainDb
    f = clamp(f, 10, SR * 0.48)
    const w = TAU * f / SR, c = Math.cos(w), s = Math.sin(w), A = Math.pow(10, gainDb / 40), al = s / (2 * q)
    let b0, b1, b2, a0, a1, a2
    switch (this.type) {
      case 'lp': b0 = (1 - c) / 2; b1 = 1 - c; b2 = b0; a0 = 1 + al; a1 = -2 * c; a2 = 1 - al; break
      case 'hp': b0 = (1 + c) / 2; b1 = -(1 + c); b2 = b0; a0 = 1 + al; a1 = -2 * c; a2 = 1 - al; break
      case 'bp': b0 = al; b1 = 0; b2 = -al; a0 = 1 + al; a1 = -2 * c; a2 = 1 - al; break // constant 0 dB peak
      case 'notch': b0 = 1; b1 = -2 * c; b2 = 1; a0 = 1 + al; a1 = -2 * c; a2 = 1 - al; break
      case 'peak': b0 = 1 + al * A; b1 = -2 * c; b2 = 1 - al * A; a0 = 1 + al / A; a1 = -2 * c; a2 = 1 - al / A; break
      case 'ls': { const sq = 2 * Math.sqrt(A) * al; b0 = A * ((A + 1) - (A - 1) * c + sq); b1 = 2 * A * ((A - 1) - (A + 1) * c); b2 = A * ((A + 1) - (A - 1) * c - sq); a0 = (A + 1) + (A - 1) * c + sq; a1 = -2 * ((A - 1) + (A + 1) * c); a2 = (A + 1) + (A - 1) * c - sq; break }
      case 'hs': { const sq = 2 * Math.sqrt(A) * al; b0 = A * ((A + 1) + (A - 1) * c + sq); b1 = -2 * A * ((A - 1) + (A + 1) * c); b2 = A * ((A + 1) + (A - 1) * c - sq); a0 = (A + 1) - (A - 1) * c + sq; a1 = 2 * ((A - 1) - (A + 1) * c); a2 = (A + 1) - (A - 1) * c - sq; break }
      default: throw new Error('biquad type ' + this.type)
    }
    this.b0 = b0 / a0; this.b1 = b1 / a0; this.b2 = b2 / a0; this.a1 = a1 / a0; this.a2 = a2 / a0
    return this
  }
  p(x) {
    const y = this.b0 * x + this.b1 * this.x1 + this.b2 * this.x2 - this.a1 * this.y1 - this.a2 * this.y2
    this.x2 = this.x1; this.x1 = x; this.y2 = this.y1; this.y1 = y
    return y
  }
}
// run a filter over a whole buffer (returns new buffer)
export function filt(b, type, f, q, g) {
  const bq = new Biquad(type, f, q, g)
  const o = buf(b.length)
  for (let i = 0; i < b.length; i++) o[i] = bq.p(b[i])
  return o
}
export const fcopy = (b) => Float32Array.from(b)

export class OnePole {
  constructor(fc) { this.y = 0; this.set(fc) }
  set(fc) { this.a = 1 - Math.exp(-TAU * fc / SR) }
  lp(x) { this.y += this.a * (x - this.y); return this.y }
  hp(x) { this.y += this.a * (x - this.y); return x - this.y }
}

// ---------- noise sources ----------
export function whiteBuf(n, r) { const b = buf(n); for (let i = 0; i < n; i++) b[i] = r() * 2 - 1; return b }
// pink-ish noise (Paul Kellet), roughly +-1
export function pinkBuf(n, r) {
  const b = buf(n); let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0
  for (let i = 0; i < n; i++) {
    const w = r() * 2 - 1
    b0 = 0.99886 * b0 + w * 0.0555179; b1 = 0.99332 * b1 + w * 0.0750759; b2 = 0.969 * b2 + w * 0.153852
    b3 = 0.8665 * b3 + w * 0.3104856; b4 = 0.55 * b4 + w * 0.5329522; b5 = -0.7616 * b5 - w * 0.016898
    b[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + w * 0.5362) * 0.18; b6 = w * 0.115926
  }
  return b
}
export function brownBuf(n, r, leak = 0.998) {
  const b = buf(n); let y = 0
  for (let i = 0; i < n; i++) { y = y * leak + (r() * 2 - 1) * 0.1; b[i] = y * 3.2 }
  return b
}

// ---------- stems ----------
// A stem holds the dry signal (L,R) and two reverb sends: room (small) and hall (large).
export class Stem {
  constructor(name) {
    this.name = name
    this.L = buf(N); this.R = buf(N)
    this.rL = buf(N); this.rR = buf(N) // small room send
    this.hL = buf(N); this.hR = buf(N) // hall send
    this.log = [] // cue log: {cue,t,desc}
  }
}
// place a mono (Float32Array) or stereo ({L,R}) buffer at time t. pan -1..1 (mono only), constant power.
// Silence windows (set by build.mjs): nothing placed may cross into or start inside a window (hard cuts, no tails).
let CUTS = []
export function setCuts(w) { CUTS = w.map(([a, b]) => [Math.round(a * SR), Math.round(b * SR)]) }
export const getCuts = () => CUTS
export function put(stem, src, t, gain = 1, pan = 0, room = 0, hall = 0) {
  const i0 = Math.round(t * SR)
  let limit = N
  for (const [a, b] of CUTS) { if (i0 >= a && i0 < b) return; if (a > i0 && a < limit) limit = a }
  const mono = src instanceof Float32Array
  const a = (pan + 1) * Math.PI / 4
  const gl = mono ? Math.cos(a) * Math.SQRT2 * gain : gain
  const gr = mono ? Math.sin(a) * Math.SQRT2 * gain : gain
  const SL = mono ? src : src.L, SRr = mono ? src : src.R
  const n = SL.length
  for (let j = 0; j < n; j++) {
    const i = i0 + j
    if (i < 0) continue
    if (i >= limit) break
    const l = SL[j] * gl, r = SRr[j] * gr
    stem.L[i] += l; stem.R[i] += r
    if (room) { stem.rL[i] += l * room; stem.rR[i] += r * room }
    if (hall) { stem.hL[i] += l * hall; stem.hR[i] += r * hall }
  }
}

// ---------- reverb (Schroeder/Moorer style, stereo decorrelated) ----------
// returns wet signal only. rt = seconds (RT60), damp 0..1 (HF damping in the loop), pre = pre-delay s.
export function reverb(inL, inR, { rt = 1.2, size = 1, damp = 0.4, pre = 0.012, seed = 1 } = {}) {
  const n = inL.length
  const outL = buf(n), outR = buf(n)
  const baseL = [1557, 1617, 1491, 1422, 1277, 1356, 1188, 1116]
  const baseR = baseL.map((d, i) => d + 23 + i * 7)
  const run = (inp, bases, out, apSeed) => {
    const combs = bases.map((d) => {
      const len = Math.max(32, Math.round(d * size * (SR / 44100)))
      const g = Math.pow(10, (-3 * len) / (rt * SR))
      return { b: buf(len), len, i: 0, g, lp: 0 }
    })
    const aps = [556, 441, 341, 225].map((d) => ({ b: buf(Math.round(d * (SR / 44100)) + apSeed), i: 0 }))
    const preN = Math.round(pre * SR)
    const dmp = clamp(damp, 0, 0.98)
    for (let t = 0; t < n; t++) {
      const x = t >= preN ? inp[t - preN] * 0.12 : 0
      let s = 0
      for (let c = 0; c < combs.length; c++) {
        const k = combs[c]
        const y = k.b[k.i]
        k.lp = y * (1 - dmp) + k.lp * dmp
        k.b[k.i] = x + k.lp * k.g
        if (++k.i >= k.len) k.i = 0
        s += y
      }
      for (let a = 0; a < aps.length; a++) {
        const k = aps[a]
        const y = k.b[k.i]
        const v = s + y * 0.5
        k.b[k.i] = v
        s = y - v * 0.5
        if (++k.i >= k.b.length) k.i = 0
      }
      out[t] = s
    }
  }
  const mid = buf(n)
  for (let i = 0; i < n; i++) mid[i] = (inL[i] + inR[i]) * 0.5
  // slight decorrelation: L gets the mid + side, R mid - side
  const iL = buf(n), iR = buf(n)
  for (let i = 0; i < n; i++) { const s = (inL[i] - inR[i]) * 0.5; iL[i] = mid[i] + s * 0.6; iR[i] = mid[i] - s * 0.6 }
  run(iL, baseL, outL, 0)
  run(iR, baseR, outR, 5)
  return { L: outL, R: outR }
}

// finalize a stem: dry + reverbs. spec: {room:{rt,wet,...}|null, hall:{...}|null}
// Reverb is run per segment between silence windows with fresh state, so no tail can survive a window.
export function renderStem(stem, spec = {}) {
  const L = stem.L, R = stem.R
  const used = (a, b) => { for (let i = 0; i < a.length; i++) if (a[i] !== 0 || b[i] !== 0) return true; return false }
  const segs = []
  let p = 0
  for (const [a, b] of CUTS) { if (a > p) segs.push([p, a]); p = Math.max(p, b) }
  if (p < N) segs.push([p, N])
  const run = (sL, sR, cfg, seed) => {
    if (!cfg || !used(sL, sR)) return
    const g = cfg.wet ?? 1
    for (const [a, b] of segs) {
      const w = reverb(sL.subarray(a, b), sR.subarray(a, b), { seed, ...cfg })
      for (let i = a; i < b; i++) { L[i] += w.L[i - a] * g; R[i] += w.R[i - a] * g }
    }
  }
  run(stem.rL, stem.rR, spec.room, 3)
  run(stem.hL, stem.hR, spec.hall, 7)
  stem.rL = stem.rR = stem.hL = stem.hR = null
  return stem
}

// ---------- modal synthesis helper ----------
// partials: [[freqHz, amp, tauSec], ...] -> mono buffer of `dur` seconds
export function modal(partials, dur, r, jitter = 0.0) {
  const n = Math.round(dur * SR), b = buf(n)
  for (const [f0, a0, tau] of partials) {
    const f = f0 * (1 + (jitter ? r.sym(jitter) : 0)), ph = r() * TAU
    const w = TAU * f / SR, k = Math.exp(-1 / (tau * SR))
    let e = a0
    const len = Math.min(n, Math.round(tau * 9 * SR))
    for (let i = 0; i < len; i++) { b[i] += Math.sin(ph + w * i) * e; e *= k }
  }
  return b
}
// multiply buffer by an exponential decay
export function expDecay(b, tau, from = 0) {
  const k = Math.exp(-1 / (tau * SR)); let e = 1
  for (let i = from; i < b.length; i++) { b[i] *= e; e *= k }
  return b
}
// short fade out of the last `ms` of a buffer (hard but click-free ending)
export function fadeEnd(b, ms = 3) {
  const n = Math.min(b.length, Math.max(2, Math.round(ms * SR / 1000)))
  for (let i = 0; i < n; i++) b[b.length - 1 - i] *= i / n
  return b
}
export function fadeStart(b, ms = 1) {
  const n = Math.min(b.length, Math.max(2, Math.round(ms * SR / 1000)))
  for (let i = 0; i < n; i++) b[i] *= i / n
  return b
}
export function gainBuf(b, g) { for (let i = 0; i < b.length; i++) b[i] *= g; return b }
export function peakOf(b) { let p = 0; for (let i = 0; i < b.length; i++) { const a = Math.abs(b[i]); if (a > p) p = a } return p }

// ---------- tape-style ping-pong echo (the 'echo' of the title) ----------
// in: mono Float32Array. Returns {L,R} of length n (input is NOT included, wet only).
export function tapeEcho(inp, n, { time = 0.66, fb = 0.58, lp = 1700, hp = 140, wow = 0.003, flutter = 0.00025, drive = 1.4, seed = 5, spread = 0.07 } = {}) {
  const r = rng(seed)
  const maxD = Math.round((time * (1 + spread) + 0.05) * SR) + 8
  const dl = buf(maxD), dr = buf(maxD)
  const outL = buf(n), outR = buf(n)
  let wi = 0
  const lpL = new Biquad('lp', lp, 0.6), lpR = new Biquad('lp', lp * 0.9, 0.6)
  const hpL = new Biquad('hp', hp, 0.7), hpR = new Biquad('hp', hp, 0.7)
  const p1 = r() * TAU, p2 = r() * TAU, p3 = r() * TAU
  let fL = 0, fR = 0
  for (let i = 0; i < n; i++) {
    const t = i / SR
    const m = Math.sin(TAU * 0.37 * t + p1) * wow + Math.sin(TAU * 5.3 * t + p2) * flutter + Math.sin(TAU * 1.9 * t + p3) * wow * 0.4
    const dL = (time * (1 + m)) * SR
    const dR = (time * (1 + spread) * (1 - m * 0.8)) * SR
    const rd = (line, d) => {
      let p = wi - d
      while (p < 0) p += maxD
      const i0 = Math.floor(p), fr = p - i0
      const a = line[i0 % maxD], b = line[(i0 + 1) % maxD]
      return a + (b - a) * fr
    }
    const oL = rd(dl, dL), oR = rd(dr, dR)
    outL[i] = oL; outR[i] = oR
    // ping-pong: L feeds R, R feeds L; filter + saturation inside the loop => every repeat is darker and dirtier
    const x = i < inp.length ? inp[i] : 0
    fL = Math.tanh(hpL.p(lpL.p(oR * fb)) * drive) / drive
    fR = Math.tanh(hpR.p(lpR.p(oL * fb)) * drive) / drive
    dl[wi] = x + fL
    dr[wi] = fR
    if (++wi >= maxD) wi = 0
  }
  return { L: outL, R: outR }
}

// ---------- limiter ----------
export function limiter(L, R, ceilDb = -2, look = 144) {
  const n = L.length, ceil = dB(ceilDb)
  const g = new Float32Array(n).fill(1)
  for (let i = 0; i < n; i++) {
    const p = Math.max(Math.abs(L[i]), Math.abs(R[i]))
    if (p > ceil) {
      const need = ceil / p
      for (let j = Math.max(0, i - look + 1); j <= i; j++) if (g[j] > need) g[j] = need
    }
  }
  // causal box average over `look` samples of the look-ahead min => gain at i <= need(i)
  const out = new Float32Array(n)
  let acc = 0
  for (let i = 0; i < n; i++) {
    acc += g[i]; if (i >= look) acc -= g[i - look]
    const k = Math.min(i + 1, look)
    out[i] = acc / k
  }
  // box average only guarantees <= need if the window lies in the spread region; enforce with a hard clamp
  let reduced = 0
  for (let i = 0; i < n; i++) {
    // gain applied is the average of g over [i-look+1, i]; shift by look/2 not needed because spread was backward
    let gi = out[i]
    L[i] *= gi; R[i] *= gi
    const p = Math.max(Math.abs(L[i]), Math.abs(R[i]))
    if (p > ceil) { const c = ceil / p; L[i] *= c; R[i] *= c; reduced++ }
  }
  return reduced
}

// ---------- WAV writer: 48 kHz stereo 16-bit PCM ----------
export function writeWav(file, L, R) {
  const n = L.length
  const out = Buffer.alloc(44 + n * 4)
  out.write('RIFF', 0); out.writeUInt32LE(36 + n * 4, 4); out.write('WAVEfmt ', 8)
  out.writeUInt32LE(16, 16); out.writeUInt16LE(1, 20); out.writeUInt16LE(2, 22)
  out.writeUInt32LE(SR, 24); out.writeUInt32LE(SR * 4, 28); out.writeUInt16LE(4, 32); out.writeUInt16LE(16, 34)
  out.write('data', 36); out.writeUInt32LE(n * 4, 40)
  let clipped = 0
  for (let i = 0; i < n; i++) {
    let l = Math.round(L[i] * 32767), r = Math.round(R[i] * 32767)
    if (l > 32767 || l < -32768) { clipped++; l = clamp(l, -32768, 32767) }
    if (r > 32767 || r < -32768) { clipped++; r = clamp(r, -32768, 32767) }
    out.writeInt16LE(l, 44 + i * 4); out.writeInt16LE(r, 46 + i * 4)
  }
  fs.writeFileSync(file, out)
  return clipped
}

// zero a time window exactly (hard cut). `fadeMs` of fade-out applied just BEFORE the window start only.
export function hardSilence(L, R, a, b, fadeMs = 1.2) {
  const i0 = Math.round(a * SR), i1 = Math.min(L.length, Math.round(b * SR))
  const f = Math.round(fadeMs * SR / 1000)
  for (let k = 0; k < f; k++) { const i = i0 - 1 - k; if (i >= 0) { const g = k / f; L[i] *= g; R[i] *= g } }
  for (let i = i0; i < i1; i++) { L[i] = 0; R[i] = 0 }
}
