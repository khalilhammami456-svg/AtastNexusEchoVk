// Procedural sound design for the teaser. Everything is synthesised here from src/data/timeline.json,
// except the one spoken line, which is the repo's own recording (public/audio/p24b-rahal.mp3).
// Output: public/audio/teaser-mix.wav (48 kHz, 16-bit, stereo). Deterministic: same input, same file.
import { execFileSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'

const TL = JSON.parse(fs.readFileSync('src/data/timeline.json', 'utf8'))
const A = TL.audio
const SR = 48000
const N = Math.round(A.end * SR)
const L = new Float32Array(N)
const R = new Float32Array(N)

function rng(seed) { let a = seed >>> 0; return () => { a = (a + 0x6d2b79f5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296 } }
const env = (pts, t) => { if (t <= pts[0][0]) return pts[0][1]; for (let i = 1; i < pts.length; i++) { if (t <= pts[i][0]) { const [t0, v0] = pts[i - 1]; const [t1, v1] = pts[i]; return t1 === t0 ? v1 : v0 + ((t - t0) / (t1 - t0)) * (v1 - v0) } } return pts[pts.length - 1][1] }
const add = (i, l, r = l) => { if (i >= 0 && i < N) { L[i] += l; R[i] += r } }
const TAU = Math.PI * 2

// One-pole filters
const lp = (state, x, fc) => { const a = 1 - Math.exp(-TAU * fc / SR); state.y += a * (x - state.y); return state.y }
const hp = (state, x, fc) => x - lp(state, x, fc)

function layerHum() {
  const r = rng(11)
  const n1 = { y: 0 }, n2 = { y: 0 }, b1 = { y: 0 }, b2 = { y: 0 }
  for (let i = 0; i < N; i++) {
    const t = i / SR
    const e = env(A.hum, t)
    if (e <= 0) continue
    const mains = Math.sin(TAU * 50 * t) * 0.5 + Math.sin(TAU * 100 * t) * 0.24 + Math.sin(TAU * 150 * t) * 0.1
    const drone = Math.sin(TAU * 55 * t + Math.sin(TAU * 0.07 * t)) * 0.5 + Math.sin(TAU * 55.4 * t) * 0.5
    const brownL = lp(n1, (r() * 2 - 1), 260) * 6
    const brownR = lp(n2, (r() * 2 - 1), 260) * 6
    const l = e * (mains * 0.045 + drone * 0.05 + brownL * 0.05)
    const rr = e * (mains * 0.045 + drone * 0.05 + brownR * 0.05)
    add(i, l, rr)
  }
}

function layerPressure() {
  const r = rng(23)
  // band-pass noise rising from 180 Hz to 2.4 kHz (Chamberlin state-variable filter)
  let low = 0, band = 0
  for (let i = 0; i < N; i++) {
    const t = i / SR
    const e = env(A.pressure, t)
    if (e <= 0) continue
    const sub = Math.sin(TAU * 38 * t) * 0.6 + Math.sin(TAU * 41.3 * t + 0.5) * 0.4
    const prog = Math.min(1, Math.max(0, (t - A.pressure[0][0]) / (A.pressure[A.pressure.length - 2][0] - A.pressure[0][0])))
    const fc = 180 * Math.pow(2400 / 180, prog)
    const f = 2 * Math.sin(Math.PI * fc / SR)
    const x = r() * 2 - 1
    const high = x - low - 0.18 * band
    band += f * high
    low += f * band
    const swell = band * 0.9
    add(i, e * (sub * 0.16 + swell * 0.09), e * (sub * 0.16 + swell * 0.09))
  }
}

function layerPulse() {
  const { start, end, bpmFrom, bpmTo } = A.pulse
  let t = start
  let k = 0
  while (t < end) {
    const prog = (t - start) / (end - start)
    const bpm = bpmFrom + (bpmTo - bpmFrom) * prog * prog
    const amp = 0.14 + 0.5 * prog
    thump(t, amp, 1.0)
    thump(t + 0.17 - 0.06 * prog, amp * 0.62, 0.85)
    t += 60 / bpm
    k++
  }
}
function thump(t0, amp, pitch) {
  const i0 = Math.round(t0 * SR)
  const len = Math.round(0.35 * SR)
  const r = rng(i0)
  const n = { y: 0 }
  for (let j = 0; j < len; j++) {
    const tt = j / SR
    const f = (38 + 52 * Math.exp(-tt / 0.03)) * pitch
    const ph = TAU * (38 * pitch * tt + 52 * pitch * 0.03 * (1 - Math.exp(-tt / 0.03)))
    const body = Math.sin(ph) * Math.exp(-tt / 0.11)
    const click = lp(n, r() * 2 - 1, 300) * Math.exp(-tt / 0.012) * 0.4
    void f
    add(i0 + j, amp * (body + click))
  }
}

function layerHiss() {
  const r1 = rng(31), r2 = rng(37)
  const h1 = { y: 0 }, h2 = { y: 0 }
  for (let i = 0; i < N; i++) {
    const t = i / SR
    const e = env(A.hiss, t)
    if (e <= 0) continue
    const mod = 0.8 + 0.2 * Math.sin(TAU * 0.9 * t)
    add(i, hp(h1, r1() * 2 - 1, 2500) * 0.05 * e * mod, hp(h2, r2() * 2 - 1, 2500) * 0.05 * e * mod)
  }
  // faint room tone before the title
  const r3 = rng(41), n3 = { y: 0 }, n4 = { y: 0 }
  for (let i = 0; i < N; i++) {
    const e = env(A.roomtone, i / SR)
    if (e <= 0) continue
    add(i, lp(n3, r3() * 2 - 1, 500) * 0.2 * e, lp(n4, r3() * 2 - 1, 500) * 0.2 * e)
  }
}

function click(t0, amp, centre = 3200, decay = 0.004, seed = 1, pan = 0) {
  const i0 = Math.round(t0 * SR)
  const len = Math.round(decay * 8 * SR)
  const r = rng(seed + i0)
  const s = { y: 0 }
  for (let j = 0; j < len; j++) {
    const tt = j / SR
    const e = Math.exp(-tt / decay)
    const noise = hp(s, r() * 2 - 1, centre * 0.5)
    const v = amp * e * (noise * 0.7 + Math.sin(TAU * centre * tt) * 0.3)
    add(i0 + j, v * (1 - Math.max(0, pan)), v * (1 + Math.min(0, pan)))
  }
}

function layerTyping() {
  let seed = 100
  const typeStr = (t0, str, spacing) => {
    for (let k = 0; k < str.length; k++) {
      if (str[k] === ' ') continue
      const jitter = (rng(seed++)() - 0.5) * 0.01
      click(t0 + k * spacing + jitter, 0.13 + rng(seed++)() * 0.05, 2400 + rng(seed++)() * 900, 0.003, seed)
    }
  }
  for (const s of TL.shots) {
    if (s.kind !== 'image') continue
    for (const tx of s.text ?? []) typeStr(s.start + tx.t, tx.str, 1 / (0.3 * TL.fps))
    if (s.caption) typeStr(s.start + s.caption.t, s.caption.str, s.caption.dur / s.caption.str.length)
  }
}

function layerStamp() {
  for (const t0 of A.stamp) {
    const i0 = Math.round(t0 * SR), len = Math.round(0.5 * SR), r = rng(i0), n = { y: 0 }
    for (let j = 0; j < len; j++) {
      const tt = j / SR
      const body = Math.sin(TAU * (45 + 40 * Math.exp(-tt / 0.05)) * tt) * Math.exp(-tt / 0.18)
      const thud = lp(n, r() * 2 - 1, 700) * Math.exp(-tt / 0.04)
      add(i0 + j, 0.5 * (body + thud * 0.7))
    }
  }
}

function layerVibrate() {
  for (const t0 of A.vibrate) {
    const i0 = Math.round(t0 * SR), len = Math.round(0.24 * SR), r = rng(i0), n = { y: 0 }
    for (let j = 0; j < len; j++) {
      const tt = j / SR
      const gate = Math.min(1, tt / 0.01) * Math.min(1, (0.24 - tt) / 0.02)
      const buzz = Math.tanh(Math.sin(TAU * 172 * tt) * 2.2) * (0.6 + 0.4 * Math.sin(TAU * 31 * tt))
      const rattle = lp(n, r() * 2 - 1, 1800) * 0.3
      add(i0 + j, 0.15 * gate * (buzz + rattle), 0.12 * gate * (buzz + rattle * 0.6))
    }
  }
}

function layerShutter() {
  A.shutter.forEach((t0, k) => { click(t0, 0.34, 1900, 0.006, 700 + k); click(t0 + 0.035, 0.2, 1200, 0.008, 900 + k) })
  A.relay.forEach((t0, k) => click(t0, 0.2, 700, 0.012, 1300 + k))
}

function layerTears() {
  A.tears.forEach((t0, k) => {
    const dur = 0.2
    const i0 = Math.round(t0 * SR), len = Math.round(dur * SR), r = rng(5000 + k)
    const s = { y: 0 }
    for (let j = 0; j < len; j++) {
      const tt = j / SR
      const gate = Math.floor(tt * 90) % 2 === 0 ? 1 : 0.15
      const x = hp(s, r() * 2 - 1, 900)
      const crush = Math.round(x * 5) / 5
      const sweep = Math.sin(TAU * (400 + 5200 * (tt / dur)) * tt) * 0.25
      add(i0 + j, 0.2 * gate * (crush * 0.8 + sweep) * Math.exp(-tt / 0.18))
    }
  })
}

function layerSting() {
  const t0 = A.stingT
  const i0 = Math.round(t0 * SR), len = Math.round(3.6 * SR), r = rng(777)
  const n = { y: 0 }
  const partials = [[97, 0.35, 2.4], [143, 0.22, 2.0], [211, 0.14, 1.6], [331, 0.08, 1.1]]
  for (let j = 0; j < len; j++) {
    const tt = j / SR
    let v = Math.sin(TAU * (42 + 30 * Math.exp(-tt / 0.08)) * tt) * Math.exp(-tt / 1.6) * 0.9
    for (const [f, a, d] of partials) v += Math.sin(TAU * f * tt) * a * Math.exp(-tt / d) * 0.5
    const burst = hp(n, r() * 2 - 1, 1500) * Math.exp(-tt / 0.03) * 0.5
    // CRT lock-on zip aligned with the first 6 frames of the title
    const zip = tt < 0.2 ? Math.sin(TAU * (300 + 9000 * (tt / 0.2) * (tt / 0.2)) * tt) * 0.14 * (1 - tt / 0.2) : 0
    add(i0 + j, 0.62 * (v + burst) + zip, 0.62 * (v + burst) + zip)
  }
}

function layerVoice() {
  const v = A.voice
  const wav = path.resolve('out/voice-rahal.raw')
  execFileSync('ffmpeg', ['-v', 'error', '-y', '-ss', String(v.srcStart), '-t', String(v.srcDur), '-i', path.resolve(v.file), '-af', 'highpass=f=150,lowpass=f=5200,acompressor=threshold=-24dB:ratio=3,aecho=0.7:0.5:68|141:0.28|0.16', '-ar', String(SR), '-ac', '1', '-f', 'f32le', wav].filter(Boolean))
  const buf = fs.readFileSync(wav)
  const samples = new Float32Array(buf.buffer, buf.byteOffset, buf.byteLength / 4)
  let peak = 0
  for (const s of samples) peak = Math.max(peak, Math.abs(s))
  const gain = 0.62 / (peak || 1)
  const i0 = Math.round(v.t * SR)
  const dry = Math.round((v.srcDur - 0.6) * SR) // echo tail is gated: the line is cut, not faded
  const fadeLen = Math.round(0.02 * SR)
  for (let j = 0; j < samples.length; j++) {
    let g = gain
    if (j > dry) { const k = j - dry; g *= Math.max(0, 1 - k / fadeLen) }
    add(i0 + j, samples[j] * g * 1.0, samples[j] * g * 0.92)
  }
  fs.unlinkSync(wav)
}

layerHum(); layerPressure(); layerPulse(); layerHiss(); layerTyping(); layerStamp(); layerVibrate(); layerShutter(); layerTears(); layerSting(); layerVoice()

// Hard silence windows (the cuts are the point)
const silence = [[23.4, 24.6], [47.6, 48.5]]
for (const [a, b] of silence) for (let i = Math.round(a * SR); i < Math.round(b * SR); i++) { L[i] = 0; R[i] = 0 }

// Master: soft saturation, short start/end fades, peak to -2 dBFS
let peak = 0
for (let i = 0; i < N; i++) { L[i] = Math.tanh(L[i] * 1.1); R[i] = Math.tanh(R[i] * 1.1); peak = Math.max(peak, Math.abs(L[i]), Math.abs(R[i])) }
const norm = Math.pow(10, -2 / 20) / (peak || 1)
const out = Buffer.alloc(44 + N * 4)
out.write('RIFF', 0); out.writeUInt32LE(36 + N * 4, 4); out.write('WAVEfmt ', 8); out.writeUInt32LE(16, 16); out.writeUInt16LE(1, 20); out.writeUInt16LE(2, 22)
out.writeUInt32LE(SR, 24); out.writeUInt32LE(SR * 4, 28); out.writeUInt16LE(4, 32); out.writeUInt16LE(16, 34); out.write('data', 36); out.writeUInt32LE(N * 4, 40)
for (let i = 0; i < N; i++) {
  const fade = Math.min(1, i / (0.05 * SR), (N - i) / (0.05 * SR))
  out.writeInt16LE(Math.max(-32768, Math.min(32767, Math.round(L[i] * norm * fade * 32767))), 44 + i * 4)
  out.writeInt16LE(Math.max(-32768, Math.min(32767, Math.round(R[i] * norm * fade * 32767))), 46 + i * 4)
}
fs.mkdirSync('public/audio', { recursive: true })
fs.writeFileSync('public/audio/teaser-mix.wav', out)
console.log(`wrote public/audio/teaser-mix.wav  ${A.end}s  pre-norm peak ${peak.toFixed(3)}  gain ${norm.toFixed(3)}`)
