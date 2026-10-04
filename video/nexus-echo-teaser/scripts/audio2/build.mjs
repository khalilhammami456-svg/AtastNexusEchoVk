// NEXUS ECHO teaser v2 - original, deterministic audio generator.
//   node scripts/audio2/build.mjs [--version=A|B|C|all]
// Reads src/data/timeline2.json (audioCues + shots) and writes 48 kHz / stereo / 16-bit / 56.0 s WAV stems to
// public/audio/v2/<version>/ : ambience, music, tension, sfx_story, sfx_device, impacts, voice, sting, mix + levels.json.
// Everything is synthesised here in plain Node. The only non-original audio is the repo's own recording
// public/audio/p24b-rahal.mp3 (3.0 s from 2.35 s), which is filtered/compressed/roomed/degraded in voiceStem().
import fs from 'node:fs'
import path from 'node:path'
import { execFileSync, spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import {
  SR, DUR, N, TAU, rng, seedOf, buf, Stem, put, renderStem, reverb, hardSilence, writeWav, limiter, envAt, Biquad, OnePole,
  pinkBuf, whiteBuf, modal, peakOf, clamp, lerp, smooth, dB, toDb, fadeEnd, tapeEcho, setCuts,
} from './dsp.mjs'
import * as X from './sfx.mjs'
import { F, MOTIF, motifTone, pianoTone, pulsePluck, machineTick, placeEchoed, drone, pad } from './music.mjs'

const HERE = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(HERE, '../..') // video/nexus-echo-teaser
const REPO = path.resolve(ROOT, '../..')
const TL = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/data/timeline2.json'), 'utf8'))

// ----------------------------------------------------------------------------------------------------------
// Version parameter tables. Same story, same cue times; density / level / texture differ.
// ----------------------------------------------------------------------------------------------------------
const VERSIONS = {
  A: { // atmospheric: sparser, lower tension levels
    label: 'atmospheric',
    trim: { ambience: 1.0, music: 1.0, tension: 0.75, sfx_story: 1.8, sfx_device: 1.3, impacts: 0.8, voice: 1.3, sting: 1.0 },
    tail: 1.0, echo: { fb: 0.58, wet: 0.8, time: 0.66 }, motifLevel: [0.55, 0.65, 0.78],
    pulse: 0.8, pulseFrom: 28.0, riser: 0.8, heart: 0.8, sub: 0.8, pad: 0.8, texture: 0.7, drone: 1.0, ghost: 0,
    piano: [[12.4, 'Bb3', 0.5], [29.6, 'A3', 0.42], [33.4, 'Bb3', 0.45], [36.4, 'E4', 0.4], [41.0, 'Bb3', 0.4], [50.0, 'E4', 0.0]],
    impLevel: [0.8, 0.9, 1.0], master: 0,
  },
  B: { // more aggressive: denser pulse, louder riser/impacts, shorter tails
    label: 'aggressive',
    trim: { ambience: 1.0, music: 0.9, tension: 0.62, sfx_story: 1.8, sfx_device: 1.3, impacts: 0.9, voice: 1.3, sting: 1.0 },
    tail: 0.55, echo: { fb: 0.42, wet: 0.65, time: 0.5 }, motifLevel: [0.5, 0.62, 0.8],
    pulse: 1.5, pulseFrom: 27.2 + 0.8, riser: 1.35, heart: 1.25, sub: 1.25, pad: 1.0, texture: 1.1, drone: 1.15, ghost: 0,
    piano: [[12.4, 'Bb3', 0.45], [29.6, 'A3', 0.42], [33.4, 'Bb3', 0.5], [36.4, 'E4', 0.45], [38.0, 'Bb3', 0.0], [41.0, 'Bb3', 0.5], [44.6, 'E4', 0.45], [45.8, 'A3', 0.4]],
    impLevel: [0.95, 1.1, 1.3], master: 0,
  },
  C: { // more mysterious: more motif/echo, less rhythm, more space
    label: 'mysterious',
    trim: { ambience: 1.0, music: 1.0, tension: 0.8, sfx_story: 1.8, sfx_device: 1.3, impacts: 0.85, voice: 1.3, sting: 1.0 },
    tail: 1.45, echo: { fb: 0.7, wet: 1.1, time: 0.78 }, motifLevel: [0.65, 0.78, 0.9],
    pulse: 0.4, pulseFrom: 28.0, riser: 0.9, heart: 0.8, sub: 0.7, pad: 0.9, texture: 0.9, drone: 0.9, ghost: 1,
    piano: [[9.0, 'E4', 0.38], [12.4, 'Bb3', 0.5], [14.2, 'A3', 0.34], [29.6, 'A3', 0.45], [32.4, 'E4', 0.4], [36.4, 'Bb3', 0.45], [41.0, 'E4', 0.42], [44.8, 'Bb3', 0.4]],
    impLevel: [0.8, 0.9, 1.0], master: 0,
  },
}
const NOTE = { A3: F.A3, Bb3: F.Bb3, E4: F.E4 }

// ----------------------------------------------------------------------------------------------------------
// Timeline helpers
// ----------------------------------------------------------------------------------------------------------
const CUES = TL.audioCues.map((c, i) => ({ ...c, idx: i }))
const cueTimes = (name) => CUES.filter((c) => c.cue === name).sort((a, b) => a.t - b.t)
const cueT = (name, k = 0) => { const c = cueTimes(name)[k]; if (!c) throw new Error('missing cue ' + name); return c.t }
const shotById = (id) => TL.shots.find((s) => s.id === id)
const WINDOWS = (() => {
  const w = []
  const sil = cueTimes('silence')
  if (sil.length !== 2) throw new Error('expected 2 silence cues')
  for (const c of sil) {
    const shot = TL.shots.find((s) => Math.abs(s.start - c.t) < 1e-6 && s.intensity === 'zero')
    if (!shot) throw new Error('no zero-intensity shot at silence cue ' + c.t)
    w.push([shot.start, shot.start + shot.dur, 'silence cue'])
  }
  const fin = shotById('B16-black')
  w.push([fin.start, fin.start + fin.dur, 'final black (B16)'])
  w.forEach((x) => { x[0] = Math.round(x[0] * 1000) / 1000; x[1] = Math.round(x[1] * 1000) / 1000 })
  return w.sort((a, b) => a[0] - b[0])
})()
setCuts(WINDOWS)

const envArr = (pts) => { const a = new Float32Array(N); let k = 1; for (let i = 0; i < N; i++) { const t = i / SR; while (k < pts.length - 1 && t > pts[k][0]) k++; const [t0, v0] = pts[k - 1], [t1, v1] = pts[k]; a[i] = t <= pts[0][0] ? pts[0][1] : t >= pts[pts.length - 1][0] ? pts[pts.length - 1][1] : t1 === t0 ? v1 : v0 + ((t - t0) / (t1 - t0)) * (v1 - v0) } return a }
const logCue = (stem, c, info = '') => stem.log.push({ idx: c.idx, cue: c.cue, t: c.t, info })
const CUE_DB = (c) => c // alias for readability

// multiply all channels (dry + sends) by a gain curve g(t) inside [a,b]
function gainWindow(stem, a, b, fn) {
  const arrs = [stem.L, stem.R, stem.rL, stem.rR, stem.hL, stem.hR].filter(Boolean)
  for (let i = Math.round(a * SR); i < Math.min(N, Math.round(b * SR)); i++) { const g = fn(i / SR); for (const x of arrs) x[i] *= g }
}
// ducks used to keep the one spoken line clear and the pen-stop 'silence for the pen' (baked into stems)
function bakeDucks(stem, P, which) {
  const v0 = TL.voice.t, v1 = TL.voice.t + TL.voice.srcDur
  const vdb = { ambience: -7, music: -12, tension: -8 }[which]
  if (vdb !== undefined) gainWindow(stem, v0 - 0.4, v1 + 0.5, (t) => { const k = t < v0 ? smooth((t - (v0 - 0.4)) / 0.4) : t > v1 ? 1 - smooth((t - v1) / 0.5) : 1; return dB(vdb * k) })
  const ps = cueT('pen_stop')
  if (['ambience', 'music', 'tension'].includes(which)) gainWindow(stem, ps, ps + 0.9, (t) => { const k = t < ps + 0.03 ? smooth((t - ps) / 0.03) : 1 - smooth((t - (ps + 0.42)) / 0.45); return dB(-14 * clamp(k, 0, 1)) })
}

// ----------------------------------------------------------------------------------------------------------
// AMBIENCE: room tone, CRT/lamp hum, tape hiss, corridor sub hum. Scene motivated.
// ----------------------------------------------------------------------------------------------------------
function buildAmbience(P) {
  const S = new Stem('ambience')
  const r = rng(1001)
  const rt0 = cueT('room_tone', 0), rt1 = cueT('room_tone', 1), humOn = cueT('hum_on'), lamp = cueT('lamp_buzz'), hissT = cueT('tape_hiss')
  const sil = cueTimes('silence').map((c) => c.t), titleT = cueT('sting')
  const [w0] = WINDOWS
  // envelopes
  const eRoom = envArr([[0, 0], [rt0, 0], [rt0 + 0.8, 0.6], [lamp - 0.1, 0.6], [lamp + 0.3, 0.5], [18.4, 0.5], [18.9, 0.62], [sil[0] - 0.01, 0.62], [sil[0], 0],
    [humOn, 0], [humOn + 0.15, 0.7], [34, 0.7], [34.3, 0.55], [40, 0.55], [40.3, 0.75], [sil[1] - 0.1, 1.1], [sil[1], 0],
    [rt1, 0], [rt1 + 0.7, 0.16], [WINDOWS[2][0] - 0.01, 0.16], [WINDOWS[2][0], 0], [titleT, 0.14], [DUR, 0]])
  const eCorr = envArr([[0, 0], [humOn - 0.01, 0], [humOn, 1], [30.5, 1], [31.0, 0], [40.0, 0], [40.1, 1], [sil[1], 1], [rt1, 0]])
  const eSub = envArr([[0, 0], [humOn, 0], [humOn + 0.18, 0.8], [34, 0.9], [40, 1.0], [42, 1.25], [47.9, 1.9], [sil[1], 1.9], [sil[1] + 0.001, 0]])
  const prox = envArr([[0, 1], [lamp - 0.1, 1], [lamp + 0.2, 0.3], [18.4, 0.3], [18.8, 1], [sil[0], 1]])
  const eLamp = envArr([[0, 0], [lamp, 0], [lamp + 0.25, 0.5], [lamp + 1.0, 1], [18.4, 1], [18.55, 0], [37.4, 0], [37.7, 0.8], [39.95, 0.8], [40.0, 0]])
  const eHiss = envArr([[0, 0], [hissT, 0], [hissT + 1.2, 0.45], [sil[0] - 0.01, 0.6], [sil[0], 0], [33.9, 0], [34.6, 0.9], [39.95, 0.9], [40.0, 0]])
  // CRT hum: monitor m alive on [on_m, off_m]. deaths come from the 'monitor dies' relay cues.
  const crtOn = cueTimes('crt_power').map((c) => c.t) // 1.0, 2.0, 2.9
  const onT = [crtOn[0], crtOn[1], crtOn[2], crtOn[2] + 0.03, crtOn[2] + 0.07, crtOn[2] + 0.11]
  const deaths = cueTimes('relay_click').filter((c) => c.t > 19 && c.t < 24).map((c) => c.t) // 5 deaths
  if (deaths.length !== 5) throw new Error('expected 5 monitor deaths, got ' + deaths.length)
  const offT = [sil[0] - 0.005, ...deaths] // monitor 1 (CAM-07) stays alive to the dropout; 2..6 die in cue order
  const finalHum = envArr([[0, 0], [rt1, 0], [rt1 + 0.6, 0.4], [WINDOWS[2][0] - 0.01, 0.4], [WINDOWS[2][0], 0], [titleT, 0.4], [titleT + 0.5, 0.4], [DUR - 0.9, 0.08], [DUR, 0]])
  const monAmp = (m, t) => {
    const a = clamp((t - onT[m]) / 0.25, 0, 1)
    if (a <= 0) return 0
    if (t >= offT[m]) return 0
    return a
  }
  // oscillator state
  const nz = [0, 1].map((k) => pinkBuf(N, rng(2000 + k)))
  const brown = [0, 1].map((k) => pinkBuf(N, rng(2100 + k)))
  const hissN = [0, 1].map((k) => whiteBuf(N, rng(2200 + k)))
  const ventN = [0, 1].map((k) => whiteBuf(N, rng(2300 + k)))
  const hpRoom = [new Biquad('hp', 38, 0.7), new Biquad('hp', 38, 0.7)]
  const lpRoom = [new Biquad('lp', 900, 0.6), new Biquad('lp', 900, 0.6)]
  const lpRoom2 = [new Biquad('lp', 900, 0.6), new Biquad('lp', 900, 0.6)]
  const hissHp = [new Biquad('hp', 3400, 0.7), new Biquad('hp', 3400, 0.7)], hissLp = [new Biquad('lp', 11000, 0.7), new Biquad('lp', 11000, 0.7)]
  const ventBp = [new Biquad('bp', 230, 1.1), new Biquad('bp', 260, 1.1)]
  const hf = [50.0, 50.07, 49.94, 50.13, 49.88, 50.2], mph = hf.map((_, i) => i * 1.3), mpan = [-0.5, 0.45, -0.15, 0.2, -0.7, 0.7]
  let lampPh = 0, subP1 = 0, subP2 = 0, distPh = 0
  const vn = (() => { const rr = rng(77), v = new Float32Array(2000); for (let i = 0; i < v.length; i++) v[i] = rr() * 2 - 1; return (t) => { const p = t * 23, k = Math.floor(p) % 1998, f = p - Math.floor(p); return v[k] * (1 - f) + v[k + 1] * f } })()
  const mg = mpan.map((p) => [Math.cos((p + 1) * Math.PI / 4) * Math.SQRT2, Math.sin((p + 1) * Math.PI / 4) * Math.SQRT2])
  for (let i = 0; i < N; i++) {
    const t = i / SR
    const room = eRoom[i], corr = eCorr[i], sub = eSub[i], hum = prox[i], lampE = eLamp[i], hissE = eHiss[i], fh = finalHum[i]
    if (room <= 0 && sub <= 0 && lampE <= 0 && hissE <= 0 && fh <= 0) {
      // monitors may still be alive; fall through only if needed
      if (!(t < sil[0] && t >= crtOn[0])) continue
    }
    if ((i & 63) === 0) { const fc = lerp(950, 380, corr); for (let c = 0; c < 2; c++) { lpRoom[c].set(fc, 0.6); lpRoom2[c].set(fc * 1.7, 0.6) } }
    let l = 0, rr = 0
    // 1. room tone (pink, low-passed) + brown rumble
    if (room > 0) {
      for (let c = 0; c < 2; c++) {
        const s = hpRoom[c].p(lpRoom2[c].p(lpRoom[c].p(nz[c][i]))) * 0.55 + brown[c][i] * 0.07 * (1 + corr)
        if (c === 0) l += s * room * 0.5; else rr += s * room * 0.5
      }
    }
    // 2. CRT hum (mains 50 Hz + harmonics, one oscillator group per monitor)
    if (t < sil[0] || t >= rt1) {
      if (t < sil[0]) {
        for (let m = 0; m < 6; m++) {
          const a = monAmp(m, t); if (a <= 0) continue
          const p = TAU * hf[m] * t + mph[m]
          const s = (Math.sin(p) + 0.6 * Math.sin(2 * p + 0.7) + 0.32 * Math.sin(3 * p + 1.9) + 0.12 * Math.sin(5 * p)) * a * hum * 0.0125
          l += s * mg[m][0]; rr += s * mg[m][1]
        }
      } else if (fh > 0) {
        const p = TAU * hf[0] * t
        const s = (Math.sin(p) + 0.6 * Math.sin(2 * p + 0.7) + 0.32 * Math.sin(3 * p + 1.9) + 0.1 * Math.sin(5 * p)) * fh * 0.0125
        l += s * 0.85; rr += s * 1.1
      }
    }
    // 3. fluorescent / desk lamp buzz (100 Hz stack with irregular amplitude)
    if (lampE > 0) {
      lampPh += TAU * 100.02 / SR
      let s = 0
      for (let h = 1; h <= 10; h++) s += Math.sin(lampPh * h + h * 0.4) / Math.pow(h, 0.8)
      s = Math.tanh(s * 0.9) * (0.75 + 0.25 * vn(t + 3)) * lampE * 0.0105
      l += s * 0.9; rr += s * 1.0
    }
    // 4. tape hiss
    if (hissE > 0) {
      const mod = 0.85 + 0.15 * vn(t * 0.3 + 11)
      l += hissLp[0].p(hissHp[0].p(hissN[0][i])) * 0.016 * hissE * mod
      rr += hissLp[1].p(hissHp[1].p(hissN[1][i])) * 0.016 * hissE * mod
    }
    // 5. corridor: sub hum returns (hum_on) + ventilation air + distant fluorescent
    if (sub > 0) {
      subP1 += TAU * 50.0 / SR; subP2 += TAU * 55.3 * (1 + 0.0007 * Math.sin(TAU * 0.05 * t)) / SR; distPh += TAU * 100.0 / SR
      const s = (Math.sin(subP1) * 0.6 + Math.sin(subP2) * 0.4 + 0.35 * Math.sin(2 * subP1 + 1)) * sub * 0.032
      let air = 0
      for (let c = 0; c < 2; c++) { const v = ventBp[c].p(ventN[c][i]) * (0.6 + 0.4 * Math.sin(TAU * 0.13 * t + c)) * corr * sub * 0.06; if (c === 0) l += v; else rr += v }
      const dist = Math.tanh(Math.sin(distPh) + 0.6 * Math.sin(2 * distPh + 1) + 0.3 * Math.sin(3 * distPh)) * corr * 0.0035 * (0.5 + 0.5 * Math.sin(TAU * 0.4 * t))
      l += s + dist + air; rr += s + dist
    }
    S.L[i] += l; S.R[i] += rr
  }
  // cue log
  for (const c of [...cueTimes('room_tone'), ...cueTimes('lamp_buzz'), ...cueTimes('tape_hiss'), ...cueTimes('hum_on')]) logCue(S, c, 'scene-motivated bed layer start')
  bakeDucks(S, P, 'ambience')
  return S
}

// ----------------------------------------------------------------------------------------------------------
// TENSION: sub pressure, accelerating heartbeat, riser
// ----------------------------------------------------------------------------------------------------------
function parseNum(note, re, dflt) { const m = (note || '').match(re); return m ? parseFloat(m[1]) : dflt }
function buildTension(P) {
  const S = new Stem('tension'), r = rng(3001)
  const sil = cueTimes('silence').map((c) => c.t)
  // 1. sub pressure bed (41 Hz pair beating) - grows in B06, returns lower, builds to the climax
  const eSub = envArr([[0, 0], [18.5, 0], [sil[0] - 0.05, 0.75], [sil[0], 0], [26.0, 0], [27.6, 0.12], [34, 0.32], [42, 0.55], [47.9, 1.0], [sil[1], 1.0], [sil[1] + 0.001, 0]])
  let p1 = 0, p2 = 0, p3 = 0
  for (let i = 0; i < N; i++) {
    const a = eSub[i]; if (a <= 0) continue
    const t = i / SR
    p1 += TAU * 41.0 / SR; p2 += TAU * 41.9 * (1 + 0.001 * Math.sin(TAU * 0.09 * t)) / SR; p3 += TAU * 82.6 / SR
    const s = (Math.sin(p1) * 0.6 + Math.sin(p2) * 0.5 + Math.sin(p3) * 0.12 * (0.5 + 0.5 * Math.sin(TAU * 0.11 * t))) * a * 0.17 * P.sub
    S.L[i] += s; S.R[i] += s
  }
  // 2. heartbeat 56 -> 150 bpm
  const hs = cueT('heartbeat_start'), hAccel = cueTimes('heartbeat_accel')[0]
  const hEnd = parseNum(hAccel.note, /([\d.]+)\s*$/, 47.9) // 'to 150 bpm at 47.9'
  const bpmEnd = parseNum(hAccel.note, /to\s+(\d+)\s*bpm/, 150), bpm0 = parseNum(cueTimes('heartbeat_start')[0].note, /(\d+)\s*bpm/, 56)
  const bpmMid = 74
  const bpmAt = (t) => t < hAccel.t ? lerp(bpm0, bpmMid, Math.pow((t - hs) / (hAccel.t - hs), 1.4)) : lerp(bpmMid, bpmEnd, Math.pow(clamp((t - hAccel.t) / (hEnd - hAccel.t), 0, 1), 1.8))
  const ampAt = (t) => t < hAccel.t ? lerp(0.2, 0.42, (t - hs) / (hAccel.t - hs)) : lerp(0.42, 1.0, Math.pow(clamp((t - hAccel.t) / (hEnd - hAccel.t), 0, 1), 1.3))
  const beats = []
  for (let t = hs; t < sil[1] - 0.12; t += 60 / bpmAt(t)) beats.push(t)
  beats.forEach((t, k) => {
    const rr = rng(seedOf(t, 5)), per = 60 / bpmAt(t), a = ampAt(t) * P.heart * 0.5 * (1 + rr.sym(0.06))
    const lub = heart(rr, 47 + rr.sym(2), 0.2), dub = heart(rr, 58 + rr.sym(2), 0.16)
    put(S, lub, t, a, 0, 0, 0.25)
    put(S, dub, t + Math.min(0.2, per * 0.3) + rr.sym(0.004), a * 0.6, 0, 0, 0.25)
  })
  logCue(S, cueTimes('heartbeat_start')[0], `56 bpm start; ${beats.length} beats; bpm(t0)=${bpm0}, bpm(${hEnd})=${bpmAt(hEnd - 1e-3).toFixed(1)}`)
  logCue(S, hAccel, `accel to ${bpmEnd} bpm at ${hEnd}`)
  // 3. riser: filtered noise + rising sub + a tight tonal glide
  const rs = cueTimes('riser')[0], rEnd = parseNum(rs.note, /to\s+([\d.]+)/, 47.9)
  const nzL = whiteBuf(N, rng(3101)), nzR = whiteBuf(N, rng(3102))
  const bpL = new Biquad('bp', 250, 3), bpR = new Biquad('bp', 250, 3), bpL2 = new Biquad('bp', 250, 3), bpR2 = new Biquad('bp', 250, 3)
  let sp = 0, tp = 0
  for (let i = Math.round(rs.t * SR); i < Math.min(N, Math.round(rEnd * SR)); i++) {
    const t = i / SR, u = (t - rs.t) / (rEnd - rs.t)
    const g = Math.pow(u, 2.0) * P.riser
    const fc = 250 * Math.pow(28, Math.pow(u, 1.25))
    if ((i & 15) === 0) { const q = 2.5 + 7 * u; bpL.set(fc, q); bpR.set(fc * 1.04, q); bpL2.set(fc * 1.9, q + 2); bpR2.set(fc * 1.85, q + 2) }
    const l = (bpL.p(nzL[i]) + 0.5 * bpL2.p(nzL[i])) * g * 0.42, rr = (bpR.p(nzR[i]) + 0.5 * bpR2.p(nzR[i])) * g * 0.42
    sp += TAU * (36 + 52 * Math.pow(u, 1.5)) / SR
    tp += TAU * 196 * Math.pow(4.2, u) * (1 + 0.004 * Math.sin(TAU * 5.5 * t)) / SR
    const sub = Math.sin(sp) * Math.pow(u, 1.5) * 0.4 * P.riser
    const ton = Math.sin(tp) * Math.pow(u, 2.2) * 0.04 * P.riser
    S.L[i] += l + sub + ton; S.R[i] += rr + sub + ton
    S.hL[i] += l * 0.25; S.hR[i] += rr * 0.25
  }
  logCue(S, rs, `riser ${rs.t}-${rEnd}`)
  bakeDucks(S, P, 'tension')
  return S
}
function heart(r, f0, tau) {
  const n = Math.round(0.4 * SR), b = buf(n), z = whiteBuf(n, r), lp = new OnePole(130)
  let ph = 0
  for (let i = 0; i < n; i++) {
    const t = i / SR
    ph += TAU * f0 * (1 + 0.9 * Math.exp(-t / 0.045)) / SR
    b[i] = (Math.sin(ph) * Math.exp(-t / tau) + lp.lp(z[i]) * 1.8 * Math.exp(-t / 0.03) + Math.sin(2 * ph + 0.5) * 0.18 * Math.exp(-t / 0.05)) * smoothAttack(t, 0.007)
  }
  const m = peakOf(b); for (let i = 0; i < n; i++) b[i] /= m
  return b
}
const smoothAttack = (t, a) => t >= a ? 1 : smooth(t / a)

// ----------------------------------------------------------------------------------------------------------
// MUSIC: motif notes + echo, drone, piano, pad, machine pulse, sub bass, climax texture
// ----------------------------------------------------------------------------------------------------------
function buildMusic(P) {
  const S = new Stem('music')
  const sil = cueTimes('silence').map((c) => c.t)
  const notes = cueTimes('motif_note') // by time: note 1,2,3
  if (notes.length !== 3) throw new Error('need 3 motif_note cues')
  const ec = { time: P.echo.time, fb: P.echo.fb }
  // --- motif notes, one at a time, softly, with the long tape echo
  notes.forEach((c, k) => {
    const rr = rng(seedOf(c.t, 11))
    const tone = motifTone([MOTIF[k]], 6.5, rr, { detune: [k === 1 ? 7 : -4], attack: 0.07, tau: 1.7, fc0: 2200 - 200 * k, fc1: 520, warp: 1 })
    const tail = 11 * P.tail
    placeEchoed(S, tone, c.t, { dry: 0.085 * P.motifLevel[k], wet: 0.12 * P.motifLevel[k] * P.echo.wet, hall: 0.3, echo: { ...ec, seed: 40 + k }, tail })
    // C: a reversed 'pre-echo' swell leads each note in
    if (P.ghost) {
      const rev = Float32Array.from(motifTone([MOTIF[k]], 1.4, rng(seedOf(c.t, 12)), { attack: 0.02, tau: 0.5, fc0: 1500, fc1: 500, warp: 1.5 })).reverse()
      for (let i = 0; i < rev.length; i++) rev[i] *= smooth(i / rev.length) * smooth(i / rev.length)
      put(S, rev, c.t - 1.4, 0.18 * P.motifLevel[k], 0, 0, 0.5)
    }
    logCue(S, c, `motif note ${k + 1}/3 (${['A2', 'Bb2', 'E3'][k]}), tape echo ${ec.time}s fb ${ec.fb}`)
  })
  // --- drone: two detuned saws (A1), filter LFO, sub sine; evolves with the story
  const dm = P.drone
  drone(S, {
    f: F.A1,
    ampPts: [[0, 0], [9.4, 0], [10.6, 0.02 * dm], [18.5, 0.04 * dm], [sil[0] - 0.05, 0.07 * dm], [sil[0], 0], [26.0, 0], [26.7, 0.03 * dm], [34, 0.06 * dm], [42, 0.1 * dm], [47.9, 0.16 * dm], [sil[1], 0.16 * dm], [sil[1] + 0.001, 0]],
    fcPts: [[0, 140], [25, 260], [26, 150], [34, 300], [42, 520], [47.9, 1200]],
    subPts: [[0, 0.5], [56, 0.5]], hall: 0.3, seed: 31, t1: sil[1],
  })
  // --- processed piano, sparse
  P.piano.forEach(([t, nm, lv], k) => {
    if (lv <= 0) return
    const tone = pianoTone(NOTE[nm], 5.5, rng(seedOf(t, 17)), { tau: 2.4, bright: 0.8 })
    placeEchoed(S, tone, t, { dry: 0.05 * lv, wet: 0.07 * lv * P.echo.wet, pan: k % 2 ? 0.25 : -0.25, hall: 0.5, echo: { ...ec, seed: 60 + k, lp: 1300 }, tail: 8 * P.tail })
  })
  // --- machine pulse: step sequencer on a 120 bpm 16th grid anchored at the pulse entry (~28 s)
  const r = rng(3301), t0 = P.pulseFrom, step = 0.125, stepsTotal = Math.floor((sil[1] - 0.12 - t0) / step)
  const sec = (t) => (t < 34 ? 1 : t < 42 ? 2 : 3)
  const pat = (s, t) => {
    const bar = Math.floor(s / 16), st = s % 16, sc = sec(t), o = []
    const A = P.pulse
    if (sc === 1) { // 28-34: a lone low tick, then a second hit joins (thickens)
      if (st === 0) o.push([F.A1, 0.5 + 0.1 * bar])
      if (st === 8 && bar >= 1 && A >= 0.7) o.push([F.A1, 0.35])
      if (A >= 1.2 && (st === 4 || st === 12)) o.push([F.A1, 0.3])
      if (A >= 1.2 && st === 14) o.push([F.Bb1, 0.22])
    } else if (sc === 2) { // 34-42: syncopation + the dissonant neighbour note
      if (st === 0) o.push([F.A1, 0.75])
      if (st === 6 && A >= 0.35) o.push([F.A1, 0.5])
      if (st === 10 && A >= 0.7) o.push([F.A1, 0.55])
      if (st === 14 && (bar % 2 === 1) && A >= 0.35) o.push([F.Bb1, 0.45])
      if (A >= 1.2 && (st % 4 === 2)) o.push([F.A1, 0.34])
      if (A >= 1.2 && st === 12) o.push([F.E2, 0.4])
    } else { // 42-48: climax rhythm + bass
      const ramp = clamp((t - 42) / 6, 0, 1)
      const eighth = st % 2 === 0
      if (A < 0.7) { if (st % 4 === 0) o.push([st === 12 ? F.Bb1 : F.A1, 0.7 + 0.3 * ramp]) }
      else if (A < 1.2) { if (eighth || (ramp > 0.45)) o.push([[0, 6, 14].includes(st) ? F.A1 : st === 10 ? F.Bb1 : st === 12 ? F.E2 : F.A1, (st % 4 === 0 ? 0.9 : 0.6) * (0.7 + 0.3 * ramp)]) }
      else o.push([[0, 3, 8, 14].includes(st) ? F.A1 : [6, 11].includes(st) ? F.Bb1 : st === 12 ? F.E2 : F.A1, (st % 4 === 0 ? 1.0 : 0.62) * (0.75 + 0.25 * ramp)])
    }
    return o
  }
  for (let s = 0; s < stepsTotal; s++) {
    const t = t0 + s * step, sc = sec(t), rr = rng(seedOf(t, 23))
    const grow = lerp(0.1, 0.34, clamp((t - t0) / 6, 0, 1)) * (sc === 1 ? 1 : sc === 2 ? 1.5 : 2.1) * P.pulse
    for (const [f, a] of pat(s, t)) {
      const pl = pulsePluck(f, rr, { dur: 0.3, cut0: 1100 + 700 * (sc - 1) + 500 * rr(), cut1: 120, tau: 0.1 + 0.03 * (sc === 1) })
      put(S, pl, t + rr.sym(0.002), a * grow * 0.35, rr.sym(0.1), 0, 0.22)
    }
    // machine ticks (hat-like) from 34 s, density by version
    if (sc >= 2 && P.pulse >= 0.7 && ((s % 2 === 1 && sc === 2) || (sc === 3 && (P.pulse >= 1.2 || s % 2 === 1)))) {
      put(S, machineTick(rr), t, 0.045 * (sc === 3 ? 1.6 : 1) * P.pulse * (0.6 + 0.4 * rr()), rr.sym(0.5), 0, 0.1)
    }
  }
  // --- sub bass sine (A1) under the pulse, swelling to the climax
  {
    const eSub = envArr([[0, 0], [t0 - 0.2, 0], [t0 + 2, 0.2], [34, 0.3], [42, 0.5], [44, 0.75], [47.9, 1.0], [sil[1], 1.0]])
    let ph = 0
    for (let i = Math.round(t0 * SR); i < Math.round((sil[1]) * SR); i++) {
      const t = i / SR; ph += TAU * F.A1 * (1 + 0.0005 * Math.sin(TAU * 0.13 * t)) / SR
      const s = Math.sin(ph) * eSub[i] * 0.2 * P.sub
      S.L[i] += s; S.R[i] += s
    }
  }
  // --- added harmonic tension 34-42: detuned-saw cluster (Bb2 E3 A3) that creeps up a semitone, continuing to climax
  pad(S, {
    freqs: [F.Bb2, F.E3, F.A3], t0: 33.6, t1: sil[1],
    ampPts: [[33.6, 0], [41.5, 0.55 * P.pad], [42, 0.7 * P.pad], [47.9, 1.0 * P.pad], [sil[1], 1.0 * P.pad]],
    fcPts: [[33.6, 420], [42, 1100], [47.9, 2400]],
    bend: (t) => (t < 39.5 ? 0 : t < 42 ? 0.5 * smooth((t - 39.5) / 2.5) : 0.5 + 1.6 * smooth((t - 42) / 5.9)),
    spread: P.ghost ? 12 : 8, hall: 0.55, seed: 33,
  })
  // --- climax texture: thin inharmonic shimmer, tremolo'd (42-48)
  {
    const parts = [[1318, 0.4, 3.3], [1749, 0.35, 5.1], [2341, 0.28, 7.7], [3187, 0.22, 4.4], [4423, 0.12, 6.1]]
    const ph = parts.map(() => 0)
    for (let i = Math.round(42 * SR); i < Math.round((sil[1] - 0.0) * SR); i++) {
      const t = i / SR, u = (t - 42) / 6, a = Math.pow(u, 1.5) * 0.05 * P.texture
      let l = 0, rr = 0
      parts.forEach(([f, am, rate], k) => { ph[k] += TAU * f * (1 + 0.003 * Math.sin(TAU * 0.4 * t + k)) / SR; const s = Math.sin(ph[k]) * am * (0.5 + 0.5 * Math.sin(TAU * rate * t + k)) * a; if (k % 2) rr += s; else l += s })
      S.L[i] += l; S.R[i] += rr; S.hL[i] += l * 0.5; S.hR[i] += rr * 0.5
    }
  }
  bakeDucks(S, P, 'music')
  return S
}

// ----------------------------------------------------------------------------------------------------------
// SFX STORY: paper, pen, pins, strings, footsteps, tape insert / motor / stop, shutter
// ----------------------------------------------------------------------------------------------------------
function buildSfxStory(P) {
  const S = new Stem('sfx_story')
  const place = (c, buf, o = {}) => { put(S, buf, c.t + (o.off ?? 0), o.g ?? 0.1, o.pan ?? 0, o.room ?? 0.25, o.hall ?? 0); logCue(S, c, o.info ?? '') }
  const rr = (c, salt = 0) => rng(seedOf(c.t, salt))
  for (const c of cueTimes('paper_slide')) { const r = rr(c, 1); const d = c.t < 10 ? 0.95 : 0.8; place(c, X.paperSlide(r, d), { g: dB(-21), pan: c.t < 10 ? -0.2 : 0.25, info: `${d.toFixed(2)}s slide` }) }
  for (const c of cueTimes('soft_thud')) place(c, X.softThud(rr(c, 2)), { g: dB(-17), room: 0.3 })
  for (const c of cueTimes('paper_open')) place(c, X.paperOpen(rr(c, 3)), { g: dB(-20), pan: 0.1 })
  for (const c of cueTimes('paper_drop')) place(c, X.paperDrop(rr(c, 4)), { g: dB(-19), pan: 0.15 })
  for (const c of cueTimes('shutter')) place(c, X.shutter(rr(c, 5), { gap: 0.05 }), { g: dB(-16), room: 0.15, info: 'two-stage' })
  // pen: 16.4 underline (1.6 s), 37.6 writing (1.6 s, dead at 39.2 = pen_stop)
  const pens = cueTimes('pen_scratch')
  pens.forEach((c, k) => {
    const dur = parseNum(c.note, /([\d.]+)\s*s/, 1.6)
    place(c, X.penScratch(rr(c, 6), dur, k === 0 ? 'underline' : 'write'), { g: dB(-20), pan: k === 0 ? -0.1 : 0.1, room: 0.12, info: `${dur}s ${k === 0 ? 'underline stroke' : 'writing strokes'}` })
  })
  for (const c of cueTimes('pen_stop')) {
    // the pen lifts: one tiny tick of the tip leaving the paper, then nothing (ambience dips: see bakeDucks)
    const tk = X.pinStrike(rr(c, 7)).subarray(0, Math.round(0.05 * SR)); const t2 = Float32Array.from(tk); fadeEnd(t2, 4)
    place(c, t2, { g: dB(-34), room: 0.1, info: 'pen tip lifts; pen strokes end dead here' })
  }
  for (const c of cueTimes('pin_strike')) place(c, X.pinStrike(rr(c, 8)), { g: dB(-18), pan: -0.15 + 0.15 * cueTimes('pin_strike').indexOf(c), room: 0.2 })
  for (const c of cueTimes('string_pull')) place(c, X.stringPull(rr(c, 9), 0.6), { g: dB(-22), pan: 0.1 * (cueTimes('string_pull').indexOf(c) - 1), room: 0.25, info: 'rub then taut twang' })
  // footsteps: first cue = slow soft run, one every 1.0 s, until 30.5 inclusive; later cues = single fast steps
  const fs = cueTimes('footstep')
  fs.forEach((c, k) => {
    if (k === 0) {
      const until = parseNum(c.note, /until\s+([\d.]+)/, 30.5)
      let j = 0
      for (let t = c.t; t <= until + 1e-6; t += 1.0, j++) {
        const r = rng(seedOf(t, 10)); const cc = { ...c, t }
        put(S, X.footstep(r, { soft: 0.7 }), t, dB(-21 + r.sym(1.5)), (j % 2 ? 0.2 : -0.2), 0.1, 0.9)
      }
      logCue(S, c, `${j} slow steps ${c.t}..${until}`)
    } else {
      const r = rng(seedOf(c.t, 10))
      put(S, X.footstep(r, { soft: 1.3, fast: true }), c.t, dB(-17 + r.sym(1.2)), k % 2 ? 0.2 : -0.2, 0.1, 0.9)
      logCue(S, c, 'fast step')
    }
  })
  // tape deck: insert thunk lands ON the cue time (the shell slides in 0.2 s before), motor spins up at motor_whir
  for (const c of cueTimes('tape_insert')) place(c, X.tapeInsert(rr(c, 11)), { off: -0.2, g: dB(-14), room: 0.2, pan: 0.1, info: 'thunk lands at cue (scrape starts 0.2 s earlier)' })
  for (const c of cueTimes('motor_whir')) {
    const stopT = cueT('pen_stop')
    place(c, X.tapeMotor(rr(c, 12), stopT - c.t, { dipAt: cueT('pen_scratch', 1) - c.t, dip: 0.4 }), { g: dB(-27), room: 0.15, pan: 0.15, info: `reels spin up; run until ${stopT} where the tape stops dead with the pen (03:17 manual stop)` })
  }
  // shutter_rapid: 18 shutters; intervals shrink from 0.7 s to 0.15 s. times may come from the cue (`times`) later.
  for (const c of cueTimes('shutter_rapid')) {
    const times = c.times ?? rapidTimes(c.t)
    times.forEach((t, k) => {
      const r = rng(seedOf(t, 13)), u = k / (times.length - 1)
      put(S, X.shutter(r, { gap: lerp(0.04, 0.022, u) }), t, dB(lerp(-24, -12, u) + r.sym(1)), r.sym(0.35), 0.1, 0.15)
    })
    logCue(S, c, `${times.length} shutters ${times[0].toFixed(2)}..${times[times.length - 1].toFixed(2)}`)
    S.rapid = times
  }
  return S
}
// 18 shutter times from t0; first interval 0.7 s, last 0.15 s; last cut at 46.8 (the last 1.2 s of B13 hold the figure)
function rapidTimes(t0, count = 18, last = 46.8) {
  const span = last - t0, m = count - 1
  let lo = 0.5, hi = 8
  const sum = (p) => { let s = 0; for (let i = 0; i < m; i++) s += 0.15 + 0.55 * Math.pow((m - 1 - i) / (m - 1), p); return s }
  for (let k = 0; k < 60; k++) { const mid = (lo + hi) / 2; if (sum(mid) > span) lo = mid; else hi = mid }
  const p = (lo + hi) / 2, out = [t0]
  for (let i = 0; i < m; i++) out.push(out[i] + 0.15 + 0.55 * Math.pow((m - 1 - i) / (m - 1), p))
  return out
}

// ----------------------------------------------------------------------------------------------------------
// SFX DEVICE: relay clicks, CRT power, static, phone buzz, rec beeps
// ----------------------------------------------------------------------------------------------------------
function buildSfxDevice(P) {
  const S = new Stem('sfx_device')
  const rr = (c, salt = 0) => rng(seedOf(c.t, salt))
  const voice0 = TL.voice.t, voice1 = TL.voice.t + TL.voice.srcDur
  for (const c of cueTimes('relay_click')) {
    const dies = c.t > 19 && c.t < 24
    const r = rr(c, 21)
    const under = c.t >= voice0 && c.t < voice1 ? -7 : 0
    put(S, X.relayClick(r, { heavy: dies }), c.t, dB((dies ? -15 : -18) + under + r.sym(1)), r.sym(0.4), 0.2, 0)
    logCue(S, c, dies ? 'monitor dies (heavy)' : 'relay')
  }
  const power = cueTimes('crt_power')
  power.forEach((c, k) => {
    const r = rr(c, 22)
    if (k < 2) { put(S, X.crtPower(r, 1, 15400 + 80 * k), c.t, dB(-16 + 0 * k), k ? 0.3 : -0.3, 0.2, 0); logCue(S, c, `monitor ${k + 1}`) }
    else for (let m = 0; m < 4; m++) { // monitors 3-4-5-6 together, softer, staggered
      const rm = rng(seedOf(c.t, 30 + m))
      put(S, X.crtPower(rm, 0.6, 15200 + 130 * m), c.t + [0, 0.03, 0.07, 0.11][m], dB(-21 + rm.sym(0.8)), [-0.55, 0.15, -0.1, 0.6][m], 0.25, 0)
      if (m === 0) logCue(S, c, 'monitors 3-6 together, softer')
    }
  })
  cueTimes('static_burst').forEach((c, k) => {
    const sil = cueTimes('silence')[0].t
    const dur = c.t < 10 ? 0.14 : sil - c.t // second burst runs straight into the hard cut
    put(S, X.staticBurst(rr(c, 23), dur), c.t, dB(k ? -14 : -19), 0, 0.15, 0)
    logCue(S, c, `${dur.toFixed(2)}s, ${k ? 'runs into the hard cut at ' + sil : 'short, cut'}`)
  })
  cueTimes('phone_buzz').forEach((c, k) => { put(S, X.phoneBuzz(rr(c, 24), k ? 0.2 : 0.26), c.t, dB(-15 + (k ? -1.5 : 0)), 0.2, 0.2, 0); logCue(S, c, `buzz ${k + 1}/2`) })
  cueTimes('rec_beep').forEach((c) => {
    const deck = c.t > 30
    put(S, X.recBeep(rr(c, 25), deck ? 1320 : 1850, deck ? 0.12 : 0.09), c.t, dB(deck ? -22 : -24), deck ? 0.3 : -0.25, 0.1, 0)
    logCue(S, c, deck ? 'tape deck REC light' : 'CAM-07 REC')
  })
  return S
}

// ----------------------------------------------------------------------------------------------------------
// IMPACTS: impact_low x3, light flicker (electrical)
// ----------------------------------------------------------------------------------------------------------
function buildImpacts(P) {
  const S = new Stem('impacts')
  cueTimes('impact_low').forEach((c, k) => {
    const r = rng(seedOf(c.t, 41)), hard = [0.3, 0.65, 1.0][k]
    const b = X.impactLow(r, hard, 3.0)
    put(S, b, c.t, dB([-17, -12, -6][k]) * P.impLevel[k], 0, 0.05, 0.55)
    logCue(S, c, `hardness ${hard}`)
  })
  const lf = cueTimes('light_flicker')
  for (const c of lf) { put(S, X.lightFlicker(rng(seedOf(c.t, 42)), 0.55, false), c.t, dB(-17), 0.1, 0.1, 0.3); logCue(S, c, 'stutter, lamp recovers') }
  for (const c of cueTimes('flicker_cut')) { put(S, X.lightFlicker(rng(seedOf(c.t, 43)), 1.0, true), c.t, dB(-15), -0.1, 0.1, 0.3); logCue(S, c, 'lights fail and stay dead') }
  return S
}

// ----------------------------------------------------------------------------------------------------------
// VOICE: the one non-original sound: the repo's own recording, processed.
// ----------------------------------------------------------------------------------------------------------
function buildVoice(P) {
  const S = new Stem('voice'), v = TL.voice
  const src = path.resolve(ROOT, v.file)
  const raw = execFileSync('ffmpeg', ['-v', 'error', '-ss', String(v.srcStart), '-t', String(v.srcDur), '-i', src, '-ar', String(SR), '-ac', '1', '-f', 'f32le', '-'], { maxBuffer: 1 << 26 })
  const x = new Float32Array(raw.buffer, raw.byteOffset, raw.byteLength / 4).slice()
  const n = Math.min(x.length, Math.round(v.srcDur * SR))
  let y = new Float32Array(n)
  // 1. band-limit: high-pass 150 Hz (2nd order x2 = 24 dB/oct) and low-pass 6.8 kHz
  const hp1 = new Biquad('hp', 150, 0.7), hp2 = new Biquad('hp', 150, 0.9), lp = new Biquad('lp', 6800, 0.7)
  let pk = 0; for (let i = 0; i < n; i++) pk = Math.max(pk, Math.abs(x[i]))
  for (let i = 0; i < n; i++) y[i] = lp.p(hp2.p(hp1.p(x[i] / pk * 0.7)))
  // 2. light compression (feed-forward, 6 ms / 110 ms, -26 dBFS, 2.6:1), makeup after
  let env = 0; const thr = dB(-26), ratio = 2.6
  for (let i = 0; i < n; i++) {
    const a = Math.abs(y[i]), k = a > env ? 1 - Math.exp(-1 / (0.006 * SR)) : 1 - Math.exp(-1 / (0.11 * SR))
    env += (a - env) * k
    const g = env > thr ? Math.pow(env / thr, 1 / ratio - 1) : 1
    y[i] *= g
  }
  // 3. analog degradation: tape-ish wow (tiny), soft saturation, hiss floor
  const rr = rng(4401), z = whiteBuf(n, rr), hh = new Biquad('hp', 2500, 0.7)
  const wow = (i) => i + SR * 0.00028 * Math.sin(TAU * 0.9 * i / SR) + SR * 0.00008 * Math.sin(TAU * 5.7 * i / SR + 1)
  const d = new Float32Array(n)
  for (let i = 0; i < n; i++) { const p = wow(i), i0 = Math.floor(p), f = p - i0; const a = y[clamp(i0, 0, n - 1)], b = y[clamp(i0 + 1, 0, n - 1)]; d[i] = Math.tanh((a + (b - a) * f) * 1.5) / 1.1 + hh.p(z[i]) * 0.0022 }
  y = d
  // 4. normalise so RMS is a clear -18 dBFS-ish, peak limited to -5 dBFS
  let sq = 0; for (let i = 0; i < n; i++) sq += y[i] * y[i]
  let g = dB(-17) / Math.sqrt(sq / n); let pe = 0; for (let i = 0; i < n; i++) pe = Math.max(pe, Math.abs(y[i] * g))
  if (pe > dB(-5)) g *= dB(-5) / pe
  for (let i = 0; i < n; i++) y[i] *= g
  // 5. small room (RT60 ~ 0.35 s), then cut dead at the end of the clip (no tail)
  const w = reverb(y, y, { rt: 0.35 * (0.7 + 0.3 * P.tail), size: 0.35, damp: 0.55, pre: 0.006, seed: 3 })
  const L = new Float32Array(n), R = new Float32Array(n)
  for (let i = 0; i < n; i++) { L[i] = y[i] + w.L[i] * 0.55; R[i] = y[i] * 0.97 + w.R[i] * 0.55 }
  fadeEnd(L, 6); fadeEnd(R, 6)
  put(S, { L, R }, v.t, 1)
  logCue(S, cueTimes('voice')[0], `p24b-rahal.mp3 ${v.srcStart}s +${v.srcDur}s -> ${v.t}..${(v.t + v.srcDur).toFixed(2)}, hp150/lp6.8k, comp 2.6:1, wow, tanh, hiss, room RT~0.35, dead cut`)
  return S
}

// ----------------------------------------------------------------------------------------------------------
// STING: motif_final (51.4) + title sting (53.3)
// ----------------------------------------------------------------------------------------------------------
function buildSting(P) {
  const S = new Stem('sting')
  const black = WINDOWS[2][0]
  // --- motif_final: the three notes together, detuned, one long decay. It is still ringing when the black cuts it.
  const mf = cueTimes('motif_final')[0], r = rng(seedOf(mf.t, 51))
  const dur = black - mf.t + 0.3
  const tone = motifTone(MOTIF, dur, r, { detune: [-14, +16, -9], attack: 0.16, tau: 7 * (0.8 + 0.2 * P.tail), fc0: 1700, fc1: 760, fcTau: 3, voices: 2, warp: 1.6, sag: 0.02 })
  const sub = new Float32Array(Math.round(dur * SR)); { let ph = 0; for (let i = 0; i < sub.length; i++) { const t = i / SR; ph += TAU * 55.0 * (1 - 0.01 * Math.exp(-t / 0.3)) / SR; sub[i] = Math.sin(ph) * smooth(t / 0.25) * Math.exp(-t / 5) } }
  for (let i = 0; i < sub.length; i++) tone[i] += sub[i] * 0.35
  placeEchoed(S, tone, mf.t, { dry: 0.1, wet: 0.14 * P.echo.wet, hall: 0.45, echo: { time: P.echo.time * 0.9, fb: P.echo.fb + 0.04, seed: 77 }, tail: 3 })
  logCue(S, mf, `A2+Bb2+E3 detuned (-14/+16/-9 cents), tau ~7 s, cut by the black at ${black}`)
  // --- title sting at 53.3
  const st = cueTimes('sting')[0], rs = rng(seedOf(st.t, 52)), t0 = st.t
  // (a) relay thunk: the machine room's relay (same family as the monitor relays), pitched low and heavy
  const relay = X.relayClick(rs, { heavy: true })
  put(S, relay, t0, dB(-13), 0, 0.15, 0.2)
  const thump = modal([[52, 1, 0.22], [104, 0.35, 0.1], [38, 0.5, 0.35]], 1.4, rs)
  put(S, thump, t0, dB(-15), 0, 0, 0.1)
  // (b) low metallic inharmonic hit: free-bar partial ratios on 77.8 Hz (Eb2: foreign to the A-Bb-E motif)
  const f0 = 77.8, ratios = [1, 2.76, 5.40, 8.93, 13.34, 18.64], amps = [1, 0.62, 0.45, 0.3, 0.2, 0.12], taus = [3.0, 2.2, 1.5, 0.95, 0.6, 0.35].map((x) => x * (0.7 + 0.3 * P.tail))
  const hit = modal(ratios.map((q, k) => [f0 * q * (1 + rs.sym(0.003)), amps[k], taus[k]]), 2.9, rs)
  const mal = whiteBuf(Math.round(0.03 * SR), rs), mlp = new Biquad('lp', 1400, 0.7)
  for (let i = 0; i < mal.length; i++) hit[i] += mlp.p(mal[i]) * Math.exp(-(i / SR) / 0.006) * 0.9
  put(S, hit, t0 + 0.012, dB(-17), 0, 0.1, 0.7)
  // (c) CRT lock-on zip + settling whine (ties to the title card locking onto a CRT)
  {
    const n = Math.round(2.6 * SR), z = new Float32Array(n), nz = whiteBuf(n, rs), hp = new Biquad('hp', 2500, 0.7)
    let ph = 0, ph2 = 0
    for (let i = 0; i < n; i++) {
      const t = i / SR
      if (t < 0.22) { const u = t / 0.22, f = 380 * Math.pow(26, u * u); ph += TAU * f / SR; z[i] += Math.sin(ph) * (1 - u) * 0.5 * smooth(t / 0.01); z[i] += hp.p(nz[i]) * Math.exp(-t / 0.05) * 0.4 }
      const wa = smooth((t - 0.2) / 0.1) * Math.exp(-(t - 0.2) / 0.9) * (t > 0.2 ? 1 : 0)
      ph2 += TAU * (15500 + 60 * Math.sin(TAU * 0.3 * t)) / SR
      z[i] += Math.sin(ph2) * 0.05 * wa + Math.sin(ph2 * 0.5 + 1) * 0.07 * wa
    }
    put(S, z, t0 + 0.02, dB(-21), 0, 0.1, 0.2)
  }
  // renderStem happens in finalize; nothing else here
  logCue(S, st, 'relay thunk + low metallic bar hit (77.8 Hz inharmonic) + CRT lock-on zip, long hall tail')
  return S
}

// ----------------------------------------------------------------------------------------------------------
// Orchestration
// ----------------------------------------------------------------------------------------------------------
function finalize(stem, P) {
  const H = (rt, wet, extra = {}) => ({ rt: rt * P.tail, wet, ...extra })
  const specs = {
    ambience: {},
    music: { room: null, hall: H(3.2, 0.55, { damp: 0.55, size: 1.2 }) },
    tension: { hall: H(2.2, 0.5, { damp: 0.6 }) },
    sfx_story: { room: { rt: 0.4 * (0.6 + 0.4 * P.tail), wet: 0.8, size: 0.4, damp: 0.5 }, hall: H(1.0, 0.8, { damp: 0.5, size: 0.9 }) }, // footsteps: big corridor, short tail
    sfx_device: { room: { rt: 0.35 * (0.6 + 0.4 * P.tail), wet: 0.8, size: 0.35, damp: 0.5 } },
    impacts: { room: { rt: 0.4, wet: 0.6, size: 0.4 }, hall: H(2.8, 0.8, { damp: 0.65, size: 1.3 }) },
    voice: {},
    sting: { room: { rt: 0.45, wet: 0.5, size: 0.4 }, hall: H(3.4, 0.75, { damp: 0.6, size: 1.4 }) },
  }
  renderStem(stem, specs[stem.name])
  // hard silence windows: every stem is exactly 0 inside them; fade-out only just before the window start
  for (const [a, b] of WINDOWS) hardSilence(stem.L, stem.R, a, b, 1.2)
  // start/end safety fades
  const f0 = Math.round(0.004 * SR), f1 = Math.round(0.35 * SR)
  for (let i = 0; i < f0; i++) { const g = i / f0; stem.L[i] *= g; stem.R[i] *= g }
  for (let i = 0; i < f1; i++) { const g = smooth(i / f1), k = N - 1 - i; stem.L[k] *= g; stem.R[k] *= g }
  return stem
}
const stats = (L, R, a = 0, b = N) => {
  let pk = 0, sq = 0
  for (let i = a; i < b; i++) { pk = Math.max(pk, Math.abs(L[i]), Math.abs(R[i])); sq += L[i] * L[i] + R[i] * R[i] }
  return { peakDb: +toDb(pk).toFixed(2), rmsDb: +toDb(Math.sqrt(sq / (2 * Math.max(1, b - a)))).toFixed(2) }
}
function maxAbsIn(L, R, a, b) { let m = 0; for (let i = Math.round(a * SR); i < Math.min(N, Math.round(b * SR)); i++) m = Math.max(m, Math.abs(L[i]), Math.abs(R[i])); return m }

function buildVersion(ver) {
  const P = VERSIONS[ver], t00 = Date.now()
  console.log(`\n=== version ${ver} (${P.label}) ===`)
  const stems = {}
  const build = { ambience: buildAmbience, music: buildMusic, tension: buildTension, sfx_story: buildSfxStory, sfx_device: buildSfxDevice, impacts: buildImpacts, voice: buildVoice, sting: buildSting }
  for (const [name, fn] of Object.entries(build)) { const t = Date.now(); stems[name] = finalize(fn(P), P); console.log(`  ${name.padEnd(11)} ${((Date.now() - t) / 1000).toFixed(1)}s`) }
  // cue coverage: every audioCue index must be logged by some stem; silence cues are honoured by the windows
  const logged = new Set()
  for (const s of Object.values(stems)) for (const l of s.log) logged.add(l.idx)
  for (const c of cueTimes('silence')) logged.add(c.idx)
  const missing = CUES.filter((c) => !logged.has(c.idx))
  if (missing.length) throw new Error('cues not honoured: ' + missing.map((c) => c.cue + '@' + c.t).join(', '))
  // mix: sum of trimmed stems, master gain, limiter at -2 dBFS
  const g = dB(P.master)
  const mL = buf(N), mR = buf(N)
  for (const [name, s] of Object.entries(stems)) {
    const k = P.trim[name] * g * (LEVEL_SCALE[ver]?.[name] ?? 1)
    s.k = k
    for (let i = 0; i < N; i++) { s.L[i] *= k; s.R[i] *= k; mL[i] += s.L[i]; mR[i] += s.R[i] }
  }
  const reduced = limiter(mL, mR, -2.0, 144)
  // re-assert silence on the mix (the limiter only scales, so zeros stay zero, but be explicit)
  for (const [a, b] of WINDOWS) hardSilence(mL, mR, a, b, 0)
  const out = path.join(ROOT, 'public/audio/v2', ver)
  fs.mkdirSync(out, { recursive: true })
  const levels = { version: ver, label: P.label, sampleRate: SR, channels: 2, bitDepth: 16, duration: DUR, generator: 'scripts/audio2/build.mjs', windows: WINDOWS.map(([a, b, why]) => ({ from: a, to: b, why })), stems: {}, mix: {}, cues: [], limiterReducedSamples: reduced }
  let clippedTotal = 0
  for (const [name, s] of Object.entries(stems)) {
    clippedTotal += writeWav(path.join(out, name + '.wav'), s.L, s.R)
    levels.stems[name] = { file: `${name}.wav`, ...stats(s.L, s.R), gainApplied: +toDb(s.k).toFixed(2), silenceMaxAbs: WINDOWS.map(([a, b]) => maxAbsIn(s.L, s.R, a, b)), perSecondRmsDb: perSecond(s.L, s.R) }
    for (const l of s.log) levels.cues.push({ ...l, stem: name })
  }
  clippedTotal += writeWav(path.join(out, 'mix.wav'), mL, mR)
  levels.mix = { file: 'mix.wav', ...stats(mL, mR), silenceMaxAbs: WINDOWS.map(([a, b]) => maxAbsIn(mL, mR, a, b)), perSecondRmsDb: perSecond(mL, mR) }
  levels.cues.sort((a, b) => a.t - b.t || a.cue.localeCompare(b.cue))
  levels.clippedSamples = clippedTotal
  levels.ebur128 = ebur(path.join(out, 'mix.wav'))
  fs.writeFileSync(path.join(out, 'levels.json'), JSON.stringify(levels, null, 1))
  console.log(`  mix peak ${levels.mix.peakDb} dBFS  rms ${levels.mix.rmsDb} dBFS  ${JSON.stringify(levels.ebur128)}  limiter touched ${reduced} samples  clipped ${clippedTotal}  [${((Date.now() - t00) / 1000).toFixed(0)}s]`)
}
function perSecond(L, R) { const o = []; for (let s = 0; s < DUR; s++) o.push(stats(L, R, s * SR, (s + 1) * SR).rmsDb); return o }
function ebur(file) {
  const r = spawnSync('ffmpeg', ['-hide_banner', '-nostats', '-i', file, '-af', 'ebur128=peak=true', '-f', 'null', '-'], { encoding: 'utf8' })
  const t = (r.stderr || '').split('Summary:').pop()
  const g = (re) => { const m = t.match(re); return m ? parseFloat(m[1]) : null }
  return { integratedLUFS: g(/I:\s+(-?[\d.]+)\s+LUFS/), LRA: g(/LRA:\s+(-?[\d.]+)\s+LU/), truePeakDBTP: g(/Peak:\s+(-?[\d.]+)\s+dBFS/) }
}

// per-stem, per-version level scales (calibrated after measuring; keeps the relative balance honest)
const LEVEL_SCALE = {
  A: {}, B: {}, C: {},
}

// ---------------- main ----------------
const arg = process.argv.find((a) => a.startsWith('--version='))?.split('=')[1] ?? 'all'
const run = arg === 'all' ? ['A', 'B', 'C'] : arg.split(',')
for (const v of run) { if (!VERSIONS[v]) throw new Error('unknown version ' + v); buildVersion(v) }
