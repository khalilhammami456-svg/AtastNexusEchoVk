// Physically-motivated SFX recipes (noise + resonances + envelopes). Each returns a mono Float32Array
// normalised to peak 1.0 unless noted; build.mjs places them with a gain and pan. Every call takes a seeded
// rng so repeated instances differ slightly.
import { SR, TAU, buf, Biquad, OnePole, whiteBuf, modal, expDecay, fadeEnd, fadeStart, peakOf, clamp, lerp, smooth } from './dsp.mjs'

const norm = (b, p = 1) => { const m = peakOf(b); if (m > 0) for (let i = 0; i < b.length; i++) b[i] *= p / m; return b }
const nSamp = (s) => Math.round(s * SR)
function mixInto(dst, src, off = 0, g = 1) { for (let i = 0; i < src.length; i++) { const j = i + off; if (j >= 0 && j < dst.length) dst[j] += src[i] * g } return dst }
// smooth value noise at `rate` Hz, returns f(i)->[-1,1]
function vnoise(rate, r, n) {
  const step = SR / rate, cnt = Math.ceil(n / step) + 3, v = new Float32Array(cnt)
  for (let i = 0; i < cnt; i++) v[i] = r() * 2 - 1
  return (i) => { const p = i / step, k = Math.floor(p), f = p - k, s = f * f * (3 - 2 * f); return v[k] * (1 - s) + v[k + 1] * s }
}

// ---------------- device sounds ----------------
export function relayClick(r, { heavy = false } = {}) {
  const dur = heavy ? 0.12 : 0.06, n = nSamp(dur), b = buf(n)
  const f1 = (heavy ? 1500 : 2700) * (1 + r.sym(0.12))
  const gap = (heavy ? 0.013 : 0.0075) * (1 + r.sym(0.25))
  const bp = new Biquad('bp', f1, 5), hp = new Biquad('hp', 700, 0.7), z = whiteBuf(n, r)
  for (let i = 0; i < n; i++) {
    const t = i / SR
    const e = Math.exp(-t / 0.0011) + (t > gap ? Math.exp(-(t - gap) / 0.0016) * (0.5 + r.sym(0.1)) : 0)
    b[i] = bp.p(hp.p(z[i] * e)) * 3
  }
  const body = modal([[(heavy ? 170 : 400) * (1 + r.sym(0.1)), 0.55, heavy ? 0.035 : 0.014], [f1 * 0.5, 0.15, 0.004]], dur, r)
  mixInto(b, body)
  if (heavy) mixInto(b, modal([[62 * (1 + r.sym(0.05)), 0.7, 0.05]], dur, r)) // monitor-off thunk
  return fadeEnd(norm(b), 4)
}

export function crtPower(r, strength = 1, whineF = 15400) {
  const dur = 2.6, n = nSamp(dur), b = buf(n)
  // degauss thump + 50 Hz coil buzz
  mixInto(b, modal([[58 * (1 + r.sym(0.04)), 1, 0.13], [116, 0.35, 0.07], [41, 0.5, 0.22]], dur, r))
  const lpn = new OnePole(180), z = whiteBuf(n, r)
  for (let i = 0; i < nSamp(0.4); i++) b[i] += lpn.lp(z[i]) * 3.5 * Math.exp(-(i / SR) / 0.05)
  for (let i = 0; i < n; i++) { const t = i / SR; b[i] += (Math.sin(TAU * 50 * t) + 0.5 * Math.sin(TAU * 100 * t + 1)) * 0.3 * Math.exp(-t / 0.45) * Math.min(1, t / 0.008) }
  // click of the power relay
  const ck = relayClick(r, { heavy: false }); mixInto(b, ck, 0, 0.35)
  // rising flyback whine (+ audible sub-harmonic), fading
  let ph = 0, ph2 = 0
  const f0 = 5200 + r.sym(300), fb = whineF * (1 + r.sym(0.01))
  for (let i = 0; i < n; i++) {
    const t = i / SR, f = f0 + (fb - f0) * (1 - Math.exp(-t / 0.45))
    ph += TAU * f / SR; ph2 += TAU * (f * 0.5 + 31) / SR
    const a = (1 - Math.exp(-t / 0.12)) * Math.exp(-t / 0.95)
    b[i] += (Math.sin(ph) * 0.07 + Math.sin(ph2) * 0.09 * Math.exp(-t / 0.7)) * a * strength
  }
  return norm(b)
}

export function staticBurst(r, dur = 0.3) {
  const n = nSamp(dur), b = buf(n), z = whiteBuf(n, r)
  const hp = new Biquad('hp', 450, 0.7), lp = new Biquad('lp', 9000, 0.7)
  let seg = 0, amp = 1, nxt = 0
  for (let i = 0; i < n; i++) {
    if (i >= nxt) { nxt = i + nSamp(r.range(0.003, 0.014)); amp = r() < 0.2 ? 0.05 : r.range(0.35, 1) }
    const x = lp.p(hp.p(z[i]))
    const q = Math.round(x * 5) / 5 // bit-crush
    const t = i / SR
    const buzz = Math.sin(TAU * (2900 + 1800 * Math.sin(TAU * 11 * t)) * t) * 0.18
    b[i] = (q * 0.9 + buzz) * amp * Math.min(1, t / 0.0015)
  }
  seg = 0
  return fadeEnd(norm(b), 1)
}

export function phoneBuzz(r, dur = 0.25) {
  const n = nSamp(dur), b = buf(n), z = whiteBuf(n, r)
  const f = 168 * (1 + r.sym(0.04)), desk = new Biquad('bp', 430, 2.5), lp = new OnePole(1900)
  for (let i = 0; i < n; i++) {
    const t = i / SR
    const gate = Math.min(1, t / 0.008) * Math.min(1, (dur - t) / 0.03)
    const am = 0.65 + 0.35 * Math.sin(TAU * 27 * t)
    const buzz = Math.tanh(Math.sin(TAU * f * t) * 2.6) * am
    const rattle = lp.lp(z[i]) * 0.5 * (0.5 + 0.5 * Math.sin(TAU * f * t + 1.1))
    b[i] = (buzz * 0.7 + desk.p(buzz) * 1.6 + rattle) * gate
  }
  return norm(b)
}

export function recBeep(r, f = 1850, dur = 0.09) {
  const n = nSamp(dur), b = buf(n), bp = new Biquad('bp', 2200, 0.5), hp = new Biquad('hp', 500, 0.7)
  const ff = f * (1 + r.sym(0.002))
  for (let i = 0; i < n; i++) {
    const t = i / SR, g = Math.min(1, t / 0.003) * Math.min(1, (dur - t) / 0.006)
    const s = Math.sin(TAU * ff * t) + 0.22 * Math.sin(TAU * ff * 3 * t) + 0.1 * Math.sin(TAU * ff * 5 * t)
    b[i] = hp.p(s) * g
  }
  return norm(b)
}

// ---------------- story foley ----------------
export function shutter(r, { gap = 0.045, k = 1 } = {}) {
  const dur = 0.17, n = nSamp(dur), b = buf(n), z = whiteBuf(n, r)
  const bp1 = new Biquad('bp', 1900 * (1 + r.sym(0.1)), 2.5), bp2 = new Biquad('bp', 2700 * (1 + r.sym(0.1)), 3)
  const bp3 = new Biquad('bp', 4300 * (1 + r.sym(0.1)), 2)
  const g2 = nSamp(gap * (1 + r.sym(0.12)))
  for (let i = 0; i < n; i++) {
    const t = i / SR
    b[i] += bp1.p(z[i] * Math.exp(-t / 0.005)) * 2.2
    if (i >= g2) { const tt = (i - g2) / SR; b[i] += bp2.p(z[i] * Math.exp(-tt / 0.004)) * 1.7 + bp3.p(z[i] * Math.exp(-tt / 0.016)) * 0.5 }
  }
  mixInto(b, modal([[210 * (1 + r.sym(0.08)), 0.55, 0.012]], dur, r), 0)
  mixInto(b, modal([[330, 0.3, 0.01]], dur, r), g2)
  void k
  return fadeEnd(norm(b), 4)
}

export function paperSlide(r, dur = 0.9) {
  const n = nSamp(dur), b = buf(n), z = whiteBuf(n, r)
  const bq = new Biquad('bp', 1500, 0.9), hp = new Biquad('hp', 600, 0.7), lowb = new Biquad('bp', 380, 1.2)
  const vn = vnoise(38, r, n), vn2 = vnoise(9, r, n)
  for (let i = 0; i < n; i++) {
    const t = i / SR, u = t / dur
    if ((i & 31) === 0) bq.set(lerp(1300, 3300, smooth(u)) * (1 + 0.15 * vn2(i)), 0.9)
    const env = smooth(u / 0.18) * Math.pow(1 - smooth((u - 0.55) / 0.45), 1.3)
    const mod = 0.55 + 0.45 * vn(i)
    const grain = 0.6 + 0.4 * Math.abs(vn(i + 777))
    b[i] = (bq.p(hp.p(z[i])) * 2.2 + lowb.p(z[i]) * 0.5) * env * mod * grain
  }
  return norm(b)
}

export function paperDrop(r) {
  const dur = 0.55, n = nSamp(dur), b = buf(n), z = whiteBuf(n, r)
  const lp = new OnePole(330), bq = new Biquad('bp', 2600, 0.8), vn = vnoise(55, r, n)
  for (let i = 0; i < n; i++) {
    const t = i / SR
    b[i] += lp.lp(z[i]) * 4 * Math.exp(-t / 0.028)
    // settling flutter
    const fl = Math.max(0, vn(i)) * Math.exp(-t / 0.13) * smooth((t - 0.02) / 0.03)
    b[i] += bq.p(z[i]) * fl * 0.9
  }
  mixInto(b, modal([[135 * (1 + r.sym(0.06)), 0.6, 0.035]], dur, r))
  return fadeEnd(norm(b), 8)
}

export function paperOpen(r) {
  const dur = 0.6, n = nSamp(dur), b = buf(n), z = whiteBuf(n, r)
  const bq = new Biquad('bp', 900, 0.8), hp = new Biquad('hp', 220, 0.7), vn = vnoise(30, r, n)
  for (let i = 0; i < n; i++) {
    const t = i / SR
    if ((i & 31) === 0) bq.set(lerp(500, 2300, smooth(t / 0.3)), 0.8)
    const env = smooth(t / 0.07) * Math.exp(-Math.pow((t - 0.16) / 0.12, 2)) * (0.6 + 0.4 * vn(i))
    b[i] = bq.p(hp.p(z[i])) * env * 2
  }
  const snap = new Biquad('bp', 3100, 2)
  for (let i = nSamp(0.27); i < n; i++) b[i] += snap.p(z[i] * Math.exp(-(i - nSamp(0.27)) / SR / 0.004)) * 0.9
  mixInto(b, modal([[118, 0.5, 0.06]], dur, r), nSamp(0.01))
  return fadeEnd(norm(b), 8)
}

export function softThud(r) {
  const dur = 0.5, n = nSamp(dur), z = whiteBuf(n, r), lp = new OnePole(230)
  const b = modal([[74 * (1 + r.sym(0.05)), 1, 0.075], [148, 0.35, 0.04], [260, 0.12, 0.02]], dur, r)
  for (let i = 0; i < n; i++) b[i] += lp.lp(z[i]) * 3 * Math.exp(-(i / SR) / 0.02)
  return fadeEnd(norm(b), 10)
}

// kind 'underline' (one long stroke) or 'write' (many small strokes). Ends dead at `dur`.
export function penScratch(r, dur, kind = 'write') {
  const n = nSamp(dur), b = buf(n), z = whiteBuf(n, r)
  const bq = new Biquad('bp', 3200, 1.3), hp = new Biquad('hp', 1400, 0.7), body = new Biquad('bp', 700, 1.0)
  const grain = vnoise(210, r, n), trem = vnoise(15, r, n)
  // stroke schedule -> [{a,b,speed,press}]
  const strokes = []
  if (kind === 'underline') {
    strokes.push({ a: 0.03, b: dur - 0.05, speed: 0.75, press: 0.8 })
  } else {
    let t = 0.04, k = 0
    while (t < dur) {
      const l = r.range(0.06, 0.2)
      strokes.push({ a: t, b: Math.min(dur, t + l), speed: r.range(0.55, 1), press: r.range(0.55, 1) })
      t += l + r.range(0.012, 0.05) + (++k % 5 === 0 ? r.range(0.12, 0.26) : 0)
    }
  }
  const ctl = new Float32Array(n), spd = new Float32Array(n)
  for (const s of strokes) {
    const i0 = nSamp(s.a), i1 = Math.min(n, nSamp(s.b)), L = Math.max(2, i1 - i0)
    for (let i = i0; i < i1; i++) {
      const u = (i - i0) / L
      const h = kind === 'underline' ? smooth(u / 0.1) * (1 - 0.3 * u) : Math.sin(Math.PI * u) ** 0.8
      ctl[i] = Math.max(ctl[i], h * s.press * (0.85 + 0.15 * trem(i)))
      spd[i] = s.speed * (0.8 + 0.4 * (kind === 'underline' ? u : Math.sin(Math.PI * u)))
    }
  }
  for (let i = 0; i < n; i++) {
    if ((i & 63) === 0) bq.set(2100 + 2400 * spd[i], 1.3)
    const gr = 0.5 + 0.5 * Math.abs(grain(i))
    b[i] = (bq.p(hp.p(z[i])) * 2 + body.p(z[i]) * 0.5) * ctl[i] * gr
  }
  return fadeEnd(norm(b), 3)
}

export function pinStrike(r) {
  const dur = 0.35, n = nSamp(dur), z = whiteBuf(n, r)
  const bq = new Biquad('bp', 3300 * (1 + r.sym(0.08)), 2.5), b = buf(n)
  for (let i = 0; i < n; i++) b[i] = bq.p(z[i] * Math.exp(-(i / SR) / 0.0014)) * 2.5
  mixInto(b, modal([[690 * (1 + r.sym(0.1)), 0.6, 0.007], [1260, 0.18, 0.005], [4200 * (1 + r.sym(0.03)), 0.12, 0.03], [6100, 0.05, 0.02]], dur, r))
  return fadeEnd(norm(b), 10)
}

export function stringPull(r, dur = 0.6) {
  const n = nSamp(dur), b = buf(n), z = whiteBuf(n, r)
  const f0 = 330 * (1 + r.sym(0.1)), rub = new Biquad('bp', 2500 * (1 + r.sym(0.1)), 1.8), vn = vnoise(70, r, n)
  let ph = 0, ph2 = 0
  for (let i = 0; i < n; i++) {
    const t = i / SR
    // rub: friction while the twine is drawn taut (rises, then stops)
    const re = smooth(t / 0.3) * (1 - smooth((t - 0.34) / 0.05)) * (0.6 + 0.4 * vn(i))
    b[i] += rub.p(z[i]) * re * 1.2
    // taut-string twang after the pull: pitch settles down
    if (t > 0.33) {
      const tt = t - 0.33, f = f0 * (1 + 0.035 * Math.exp(-tt / 0.1))
      ph += TAU * f / SR; ph2 += TAU * f * 2.01 / SR
      b[i] += (Math.sin(ph) * 0.55 * Math.exp(-tt / 0.14) + Math.sin(ph2) * 0.2 * Math.exp(-tt / 0.06)) * Math.min(1, tt / 0.002)
    }
  }
  // tie-off tick
  const tk = new Biquad('bp', 2800, 2)
  for (let i = nSamp(0.33); i < nSamp(0.37); i++) b[i] += tk.p(z[i] * Math.exp(-((i - nSamp(0.33)) / SR) / 0.002)) * 1.4
  return fadeEnd(norm(b), 8)
}

// hard-floor footstep: heel + toe. soft 0..1.6 strength, fast shortens the heel-toe gap.
export function footstep(r, { soft = 1, fast = false } = {}) {
  const dur = 0.4, n = nSamp(dur), b = buf(n), z = whiteBuf(n, r)
  const heel = new Biquad('bp', 1700 * (1 + r.sym(0.15)), 1.2), lp = new OnePole(420 * (1 + r.sym(0.1)))
  const toeAt = nSamp(fast ? r.range(0.05, 0.07) : r.range(0.085, 0.11))
  for (let i = 0; i < n; i++) {
    const t = i / SR
    b[i] += heel.p(z[i] * Math.exp(-t / 0.0028)) * 1.8 * soft
    b[i] += lp.lp(z[i]) * 3.2 * Math.exp(-t / 0.02)
    if (i >= toeAt) { const tt = (i - toeAt) / SR; b[i] += lp.lp(z[i]) * 1.3 * Math.exp(-tt / 0.016) * 0.7 }
  }
  mixInto(b, modal([[92 * (1 + r.sym(0.08)), 0.9, 0.03], [186, 0.3, 0.02]], dur, r))
  mixInto(b, modal([[118 * (1 + r.sym(0.08)), 0.35, 0.02]], dur, r), toeAt)
  return fadeEnd(norm(b), 8)
}

export function tapeInsert(r) {
  const dur = 0.75, n = nSamp(dur), b = buf(n), z = whiteBuf(n, r)
  const sc = new Biquad('bp', 1500, 1.0), vn = vnoise(80, r, n)
  // plastic shell sliding into the cradle
  for (let i = 0; i < nSamp(0.2); i++) { const t = i / SR; b[i] += sc.p(z[i]) * smooth(t / 0.06) * (1 - smooth((t - 0.14) / 0.06)) * (0.5 + 0.5 * vn(i)) * 0.7 }
  // seat thunk + latch click + head engage
  mixInto(b, modal([[132 * (1 + r.sym(0.05)), 1, 0.06], [356, 0.4, 0.028], [720, 0.15, 0.015], [84, 0.5, 0.1]], dur, r), nSamp(0.2))
  const lc = new Biquad('bp', 2400, 3)
  for (let i = nSamp(0.33); i < nSamp(0.37); i++) b[i] += lc.p(z[i] * Math.exp(-((i - nSamp(0.33)) / SR) / 0.0025)) * 1.2
  mixInto(b, modal([[240, 0.3, 0.02]], dur, r), nSamp(0.38))
  return fadeEnd(norm(b), 10)
}

// cassette-deck motor: spin-up, steady whir (with a dip in level), then a dead stop with a clunk.
export function tapeMotor(r, runDur, { dipAt = 2.8, dip = 0.45 } = {}) {
  const total = runDur + 0.5, n = nSamp(total), b = buf(n), z = whiteBuf(n, r)
  const frun = 92 * (1 + r.sym(0.03)), bear = new Biquad('bp', 640, 2), tick = new Biquad('bp', 1900, 2.5)
  let ph = 0, tph = 0
  const vn = vnoise(6, r, n)
  for (let i = 0; i < n; i++) {
    const t = i / SR
    const f = t < runDur ? frun * (1 - Math.exp(-t / 0.22)) : frun * (1 - Math.exp(-runDur / 0.22)) * Math.exp(-(t - runDur) / 0.07)
    const lvl = (t < dipAt ? 1 : lerp(1, dip, smooth((t - dipAt) / 0.06))) * (t < runDur ? 1 : 1)
    const fl = 1 + 0.004 * vn(i)
    ph += TAU * f * fl / SR
    const ra = f / frun
    let s = 0
    for (let h = 1; h <= 5; h++) s += Math.sin(ph * h + h) * (1 / h) * 0.6
    s += bear.p(z[i]) * 0.5 * ra
    // reel hub ticks
    tph += (14 * ra) / SR
    if (tph >= 1) { tph -= 1; b[i] += tick.p(z[i]) * 2 * ra * lvl } else b[i] += tick.p(0) * 0
    b[i] += s * Math.pow(ra, 0.8) * lvl
  }
  // stop: mechanical clunk
  const at = nSamp(runDur + 0.07)
  mixInto(b, modal([[96, 0.9, 0.035], [310, 0.4, 0.018], [880, 0.15, 0.01]], 0.3, r), at)
  const ck = new Biquad('bp', 2300, 3)
  for (let i = at; i < at + nSamp(0.01); i++) b[i] += ck.p(z[i] * Math.exp(-((i - at) / SR) / 0.0025)) * 1.0
  // after the clunk it is dead
  const end = at + nSamp(0.3)
  for (let i = end; i < n; i++) b[i] = 0
  return fadeEnd(norm(b), 6)
}

// electrical flicker: gated mains-buzz stutter with tick on every strike. dying => lights fail and stay dead.
export function lightFlicker(r, dur = 0.6, dying = false) {
  const n = nSamp(dur), b = buf(n), z = whiteBuf(n, r)
  const hp = new Biquad('hp', 1500, 0.7), tink = new Biquad('bp', 3300, 6)
  const f0 = 100 * (1 + r.sym(0.004))
  let i = 0, on = true, ph = 0
  const edges = []
  while (i < n) {
    const u = i / n
    const segLen = on ? nSamp(dying ? lerp(0.07, 0.015, u) * r.range(0.6, 1.4) : r.range(0.02, 0.08)) : nSamp(dying ? lerp(0.02, 0.1, u) * r.range(0.6, 1.4) : r.range(0.015, 0.06))
    edges.push([i, Math.min(n, i + segLen), on])
    i += segLen; on = !on
  }
  const gate = new Float32Array(n)
  for (const [a, c, o] of edges) for (let k = a; k < c; k++) gate[k] = o ? 1 : 0
  // 3 ms smoothing so gate edges are not a click, strikes get their own tick
  let g = 0
  for (let k = 0; k < n; k++) {
    const t = k / SR
    g += (gate[k] - g) * 0.03
    const fd = dying ? f0 * (1 - 0.35 * smooth((t - dur * 0.6) / (dur * 0.4))) : f0
    ph += TAU * fd / SR
    let s = 0
    for (let h = 1; h <= 14; h++) s += Math.sin(ph * h) / Math.pow(h, 0.85)
    s = Math.tanh(s * 0.9)
    b[k] = s * g * (0.5 + 0.1 * Math.sin(TAU * 7 * t)) * (dying ? 1 - 0.5 * smooth(t / dur) : 1)
  }
  for (const [a, , o] of edges) if (o) {
    for (let k = a; k < Math.min(n, a + nSamp(0.012)); k++) b[k] += hp.p(z[k]) * Math.exp(-((k - a) / SR) / 0.0009) * 1.1 + tink.p(z[k]) * Math.exp(-((k - a) / SR) / 0.006) * 0.6
  }
  if (dying) { // last strike dies with a cold-tube tunk
    const at = n - nSamp(0.12)
    mixInto(b, modal([[88, 0.8, 0.07], [175, 0.3, 0.04]], 0.2, r), at)
    for (let k = at + nSamp(0.1); k < n; k++) b[k] = 0
  }
  return fadeEnd(norm(b), 4)
}

// low impact: sub drop + body + dull slam + metallic ring. hard 0..1
export function impactLow(r, hard = 0.5, dur = 3.2) {
  const n = nSamp(dur), b = buf(n), z = whiteBuf(n, r)
  const lp = new OnePole(170 + 120 * hard), slam = new Biquad('bp', 520 * (1 + r.sym(0.1)), 0.9), lp2 = new OnePole(3800)
  let ph = 0
  const tau = 0.45 + 0.7 * hard
  for (let i = 0; i < n; i++) {
    const t = i / SR
    const f = 33 + (46 + 24 * hard) * Math.exp(-t / 0.05)
    ph += TAU * f / SR
    b[i] += Math.sin(ph) * Math.exp(-t / tau) * Math.min(1, t / 0.003)
    b[i] += lp.lp(z[i]) * 2.8 * Math.exp(-t / (0.07 + 0.05 * hard))
    b[i] += lp2.lp(slam.p(z[i])) * 2.4 * Math.exp(-t / 0.035) * (0.4 + 0.6 * hard)
  }
  const parts = [[188, 0.18, 0.6], [291, 0.14, 0.5], [437, 0.1, 0.4], [611, 0.07, 0.3], [903, 0.04, 0.2]].map(([f, a, tt]) => [f * (1 + r.sym(0.02)), a * (0.3 + 0.9 * hard), tt])
  mixInto(b, modal(parts, dur, r))
  return norm(b)
}
