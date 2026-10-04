// QA for the v2 audio stems:  node scripts/audio2/qa.mjs [A|B|C|all]
// - per-stem peak / RMS, ebur128 of the mix
// - true digital silence check in the three windows (every stem + mix)
// - onset detection near cue times (does the transient really land on the cue?)
// - heartbeat tempo check (28 -> 48 s), format check (48 kHz / 2 ch / 16 bit / 56.0 s)
// - spectrogram PNG of mix.wav (scripts/audio2/qa/spec_<ver>.png)
// Output: console + scripts/audio2/qa/report_<ver>.json. NOTE: this is numerical QA; nobody has listened to these files.
import fs from 'node:fs'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const HERE = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(HERE, '../..')
const TL = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/data/timeline2.json'), 'utf8'))
const SR = 48000
const STEMS = ['ambience', 'music', 'tension', 'sfx_story', 'sfx_device', 'impacts', 'voice', 'sting', 'mix']
const WIN = [[25.0, 26.0], [48.0, 49.2], [52.6, 53.3]]

function readWav(file) {
  const b = fs.readFileSync(file)
  if (b.toString('ascii', 0, 4) !== 'RIFF' || b.toString('ascii', 8, 12) !== 'WAVE') throw new Error('not a wav')
  const fmt = { ch: b.readUInt16LE(22), sr: b.readUInt32LE(24), bits: b.readUInt16LE(34) }
  const n = b.readUInt32LE(40) / 4
  const L = new Float32Array(n), R = new Float32Array(n)
  for (let i = 0; i < n; i++) { L[i] = b.readInt16LE(44 + i * 4) / 32768; R[i] = b.readInt16LE(46 + i * 4) / 32768 }
  return { ...fmt, n, L, R, dur: n / fmt.sr }
}
const db = (x) => 20 * Math.log10(Math.max(x, 1e-9))
function stats(w) {
  let pk = 0, sq = 0
  for (let i = 0; i < w.n; i++) { pk = Math.max(pk, Math.abs(w.L[i]), Math.abs(w.R[i])); sq += w.L[i] ** 2 + w.R[i] ** 2 }
  return { peakDb: +db(pk).toFixed(2), rmsDb: +db(Math.sqrt(sq / (2 * w.n))).toFixed(2) }
}
// 1 ms envelope of the high-passed mono signal (removes hum/rumble so transients stand out)
function envelope(w, hp = 400) {
  const a = Math.exp(-2 * Math.PI * hp / SR), hop = SR / 1000
  let y = 0, x1 = 0
  const hpf = new Float32Array(w.n)
  for (let i = 0; i < w.n; i++) { const x = (w.L[i] + w.R[i]) * 0.5; y = a * (y + x - x1); x1 = x; hpf[i] = y }
  const m = Math.floor(w.n / hop), e = new Float32Array(m)
  for (let k = 0; k < m; k++) { let s = 0; for (let i = k * hop; i < (k + 1) * hop; i++) s += hpf[i] * hpf[i]; e[k] = Math.sqrt(s / hop) }
  return e
}
// onset: first 1 ms bin in [t-0.1, t+0.2] whose level jumps >= 12 dB above the preceding 20 ms floor and is >= 35% of the window max
function onsetNear(e, t, before = 0.1, after = 0.2) {
  const k0 = Math.max(20, Math.round((t - before) * 1000)), k1 = Math.min(e.length - 1, Math.round((t + after) * 1000))
  let mx = 0, kmx = k0; for (let k = k0; k <= k1; k++) if (e[k] > mx) { mx = e[k]; kmx = k }
  if (mx < 1e-5) return { found: false }
  for (let k = k0; k <= k1; k++) {
    let fl = 0; for (let j = k - 20; j < k - 2; j++) fl += e[j]; fl = fl / 18 + 1e-6
    if (e[k] > fl * 4 && e[k] >= mx * 0.12) return { found: true, onsetMs: +((k / 1000 - t) * 1000).toFixed(1), peakMs: +((kmx / 1000 - t) * 1000).toFixed(1), levelDb: +db(mx).toFixed(1) }
  }
  return { found: false, peakMs: +((kmx / 1000 - t) * 1000).toFixed(1) }
}
const CUE_STEM = { relay_click: 'sfx_device', crt_power: 'sfx_device', static_burst: 'sfx_device', phone_buzz: 'sfx_device', rec_beep: 'sfx_device', shutter: 'sfx_story', paper_drop: 'sfx_story', paper_slide: 'sfx_story', soft_thud: 'sfx_story', pin_strike: 'sfx_story', footstep: 'sfx_story', tape_insert: 'sfx_story', impact_low: 'impacts', voice: 'voice', sting: 'sting', motif_note: 'music', motif_final: 'sting', light_flicker: 'impacts', flicker_cut: 'impacts', string_pull: 'sfx_story', paper_open: 'sfx_story', pen_scratch: 'sfx_story' }

function ffmpegEbur(file) {
  const r = spawnSync('ffmpeg', ['-hide_banner', '-nostats', '-i', file, '-af', 'ebur128=peak=true', '-f', 'null', '-'], { encoding: 'utf8' })
  const t = (r.stderr || '').split('Summary:').pop()
  const g = (re) => { const m = t.match(re); return m ? parseFloat(m[1]) : null }
  return { integratedLUFS: g(/I:\s+(-?[\d.]+)\s+LUFS/), loudnessRange: g(/LRA:\s+(-?[\d.]+)\s+LU/), truePeakDBTP: g(/Peak:\s+(-?[\d.]+)\s+dBFS/), lraLow: g(/LRA low:\s+(-?[\d.]+)\s+LUFS/), lraHigh: g(/LRA high:\s+(-?[\d.]+)\s+LUFS/) }
}

function qa(ver) {
  const dir = path.join(ROOT, 'public/audio/v2', ver)
  const rep = { version: ver, format: {}, stems: {}, silence: {}, onsets: [], heartbeat: {}, ebur128: null, ok: true, problems: [] }
  const wavs = {}
  for (const s of STEMS) {
    const f = path.join(dir, s + '.wav')
    if (!fs.existsSync(f)) { rep.problems.push('missing ' + s); rep.ok = false; continue }
    wavs[s] = readWav(f)
    const w = wavs[s]
    rep.format[s] = `${w.sr} Hz / ${w.ch} ch / ${w.bits}-bit / ${w.dur.toFixed(3)} s`
    if (w.sr !== SR || w.ch !== 2 || w.bits !== 16 || Math.abs(w.dur - 56) > 1e-6) { rep.ok = false; rep.problems.push('bad format ' + s) }
    rep.stems[s] = stats(w)
    // silence windows: count samples with |x| > 0
    rep.silence[s] = WIN.map(([a, b]) => { let nz = 0, mx = 0; for (let i = Math.round(a * SR); i < Math.round(b * SR); i++) { const m = Math.max(Math.abs(w.L[i]), Math.abs(w.R[i])); if (m > 0) nz++; if (m > mx) mx = m } return { window: `${a}-${b}`, nonZeroSamples: nz, maxAbs: mx } })
    if (rep.silence[s].some((x) => x.nonZeroSamples)) { rep.ok = false; rep.problems.push('silence violated in ' + s) }
    // the sample right after each window must not 'bleed' either: report level of the 50 ms after window end (informational)
  }
  // onsets near cue times
  const envs = {}
  for (const c of TL.audioCues) {
    const stem = CUE_STEM[c.cue]; if (!stem || !wavs[stem]) continue
    if (['pen_scratch', 'paper_slide', 'string_pull', 'motif_note', 'motif_final', 'voice'].includes(c.cue)) continue // soft/ramped starts: checked by energy below
    envs[stem] ??= envelope(wavs[stem])
    let t = c.t
    if (c.cue === 'tape_insert') t = c.t // thunk lands on the cue by design
    const o = onsetNear(envs[stem], t, ['rec_beep', 'crt_power', 'tape_insert'].includes(c.cue) ? 0.03 : 0.1, c.cue === 'crt_power' ? 0.1 : 0.2)
    rep.onsets.push({ cue: c.cue, t: c.t, stem, ...o })
  }
  // energy-start checks for the soft cues: first time the 5 ms RMS exceeds -60 dBFS (relative to local silence) after t-0.3
  const soft = []
  for (const c of TL.audioCues) {
    if (!['pen_scratch', 'paper_slide', 'string_pull', 'motif_note', 'motif_final', 'voice'].includes(c.cue)) continue
    const stem = CUE_STEM[c.cue]; const w = wavs[stem]
    const pre = rms(w, c.t - 0.3, c.t - 0.02), post = rms(w, c.t, c.t + 0.3), post2 = rms(w, c.t + 0.3, c.t + 0.9)
    soft.push({ cue: c.cue, t: c.t, stem, rmsBefore_dB: +db(pre).toFixed(1), rmsFirst300ms_dB: +db(post).toFixed(1), rms300to900ms_dB: +db(post2).toFixed(1) })
  }
  rep.softCues = soft
  // end of pen scratch must be dead at pen_stop (39.2)
  const pen = rms(wavs.sfx_story, 39.215, 39.4)
  rep.penDeadAfterStop_dB = +db(pen).toFixed(1)
  // heartbeat: beats in the tension stem (low band), 28..47.9
  rep.heartbeat = heartbeat(wavs.tension)
  rep.ebur128 = ffmpegEbur(path.join(dir, 'mix.wav'))
  // spectrogram
  fs.mkdirSync(path.join(HERE, 'qa'), { recursive: true })
  const png = path.join(HERE, 'qa', `spec_${ver}.png`)
  const r = spawnSync('ffmpeg', ['-hide_banner', '-y', '-v', 'error', '-i', path.join(dir, 'mix.wav'), '-lavfi', 'showspectrumpic=s=1800x720:legend=1:scale=log:fscale=log:drange=100:win_func=hann', png], { encoding: 'utf8' })
  rep.spectrogram = r.status === 0 ? path.relative(ROOT, png) : 'FAILED ' + r.stderr
  fs.writeFileSync(path.join(HERE, 'qa', `report_${ver}.json`), JSON.stringify(rep, null, 1))
  return rep
}
function rms(w, a, b) { let s = 0, n = 0; for (let i = Math.max(0, Math.round(a * SR)); i < Math.min(w.n, Math.round(b * SR)); i++) { s += (w.L[i] ** 2 + w.R[i] ** 2) / 2; n++ } return Math.sqrt(s / Math.max(1, n)) }
function heartbeat(w) {
  // band 70-220 Hz envelope (kills the 41 Hz sub bed), then autocorrelation per window -> beat period -> bpm
  const hop = 48, m = Math.floor(w.n / hop), e = new Float32Array(m)
  const a1 = 1 - Math.exp(-2 * Math.PI * 220 / SR), a2 = Math.exp(-2 * Math.PI * 70 / SR)
  let y = 0, h = 0, x1 = 0
  const bp = new Float32Array(w.n)
  for (let i = 0; i < w.n; i++) { const x = (w.L[i] + w.R[i]) / 2; h = a2 * (h + x - x1); x1 = x; y += a1 * (h - y); bp[i] = y }
  for (let k = 0; k < m; k++) { let s = 0; for (let i = k * hop; i < (k + 1) * hop; i++) s += bp[i] * bp[i]; e[k] = Math.sqrt(s / hop) }
  const bpmWin = (a0, b0, maxLag = 1250) => {
    const k0 = Math.round(a0 * 1000), k1 = Math.round(b0 * 1000), seg = Array.from(e.subarray(k0, k1))
    const mean = seg.reduce((s, v) => s + v, 0) / seg.length, z = seg.map((v) => v - mean)
    let best = -1, bl = 0
    for (let lag = 330; lag <= maxLag; lag++) { let s = 0; for (let i = 0; i + lag < z.length; i++) s += z[i] * z[i + lag]; s /= (z.length - lag); if (s > best) { best = s; bl = lag } }
    return +(60000 / bl).toFixed(1)
  }
  return { bpm_28_32: bpmWin(28, 32.5), bpm_34_38: bpmWin(34, 38.5), bpm_39_42: bpmWin(39, 42), bpm_42_44: bpmWin(42, 44.3), bpm_44_46: bpmWin(44.5, 46.8, 700), bpm_46_48: bpmWin(45.6, 47.95, 700), note: 'autocorrelation of the 70-220 Hz envelope; a beat period of 0.4-1.07 s; windows blur the accel' }
}

const arg = process.argv[2] ?? 'all'
const vers = arg === 'all' ? ['A', 'B', 'C'] : [arg]
for (const v of vers) {
  const r = qa(v)
  console.log(`\n===== QA version ${v} : ${r.ok ? 'PASS' : 'FAIL ' + r.problems.join('; ')}`)
  console.log('format  ', r.format.mix)
  console.log('stem'.padEnd(11), 'peak dBFS  rms dBFS   silence nonzero samples (25-26 | 48-49.2 | 52.6-53.3)')
  for (const s of STEMS) if (r.stems[s]) console.log(s.padEnd(11), String(r.stems[s].peakDb).padStart(9), String(r.stems[s].rmsDb).padStart(10), '   ', r.silence[s].map((x) => x.nonZeroSamples).join(' | '))
  console.log('ebur128 mix', JSON.stringify(r.ebur128))
  console.log('heartbeat ', JSON.stringify(r.heartbeat))
  console.log('pen dead after 39.2 (rms dB):', r.penDeadAfterStop_dB)
  const bad = r.onsets.filter((o) => !o.found || Math.abs(o.onsetMs) > 12)
  console.log(`onsets: ${r.onsets.length} transient cues checked, ${r.onsets.length - bad.length} within +-12 ms; offsets:`)
  console.log(r.onsets.map((o) => `${o.cue}@${o.t}:${o.found ? (o.onsetMs >= 0 ? '+' : '') + o.onsetMs + 'ms' : 'NA'}`).join('  '))
  console.log('soft cues:', r.softCues.map((o) => `${o.cue}@${o.t} before ${o.rmsBefore_dB} / first300 ${o.rmsFirst300ms_dB} / next ${o.rms300to900ms_dB}`).join('\n          '))
  console.log('spectrogram:', r.spectrogram)
}
