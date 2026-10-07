// Audio exhibits. The recordings in the 2024 case are reconstructed: speech from
// a formant synthesiser, sound cues from first principles, room and recorder
// character from filters. They are mixed to the same loudness target as the
// recordings already in public/audio so a team hears one archive, not two.
//
// Needs ffmpeg and espeak-ng on PATH.

import { spawnSync } from 'node:child_process'
import { mkdtempSync, rmSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { tmpdir } from 'node:os'

const VOICES = {
  VEY: { v: 'en-gb-x-rp+f3', s: 148, p: 52 },
  VALE: { v: 'en-gb-x-rp+m3', s: 138, p: 34 },
  RAHAL: { v: 'en-gb-x-gbclan+m1', s: 142, p: 40 },
  SELIM: { v: 'en-gb-x-rp+f4', s: 150, p: 58 },
  CARTER: { v: 'en-gb-x-rp+m2', s: 134, p: 30 },
  CLERK: { v: 'en-gb-x-rp+m4', s: 160, p: 44 },
  'VOICE A': { v: 'en-gb-x-rp+m3', s: 136, p: 33 },
  'VOICE B': { v: 'en-gb-x-gbclan+m4', s: 144, p: 46 },
  SYSTEM: { v: 'en-us+f2', s: 150, p: 50 },
}

function run(cmd, args, label) {
  const r = spawnSync(cmd, args, { encoding: 'utf8' })
  if (r.error || r.status !== 0) throw new Error(`${label}: ${cmd} failed: ${r.error?.message ?? r.stderr?.split('\n').slice(-6).join('\n')}`)
  return r
}
const ff = (args, label) => run('ffmpeg', ['-hide_banner', '-nostats', '-loglevel', 'error', '-y', ...args], label)

function speech(dir, name, who, text) {
  const voice = VOICES[who] ?? VOICES.SYSTEM
  const raw = join(dir, `${name}-raw.wav`)
  run('espeak-ng', ['-v', voice.v, '-s', String(voice.s), '-p', String(voice.p), '-g', '3', '-w', raw, text], `${name} speech`)
  const out = join(dir, `${name}.wav`)
  // Speech from a synthesiser is too clean to be a recording: narrow it a little.
  ff(['-i', raw, '-ar', '44100', '-ac', '1', '-af', 'highpass=f=120,lowpass=f=5200,acompressor=threshold=-20dB:ratio=3', out], name)
  return out
}

const CUES = {
  'tower-strike': (dir, name, c) => {
    const n = c.n ?? 5
    const strike = join(dir, `${name}-s.wav`)
    ff(['-f', 'lavfi', '-i', "aevalsrc='0.7*exp(-2.4*t)*(sin(2*PI*196*t)+0.55*sin(2*PI*392*t)+0.35*sin(2*PI*587*t)+0.2*sin(2*PI*831*t))':d=2.4:s=44100", strike], name)
    const parts = []
    for (let i = 0; i < n; i++) parts.push(strike)
    const out = join(dir, `${name}.wav`)
    const filter = parts.map((_, i) => `[${i}]adelay=${i * 2100}|${i * 2100}[a${i}]`).join(';') + ';' + parts.map((_, i) => `[a${i}]`).join('') + `amix=inputs=${n}:normalize=0:duration=longest[o]`
    ff([...parts.flatMap(p => ['-i', p]), '-filter_complex', filter, '-map', '[o]', '-ac', '1', out], name)
    return out
  },
  tone: (dir, name, c) => {
    const out = join(dir, `${name}.wav`)
    ff(['-f', 'lavfi', '-i', `sine=f=${c.hz ?? 1000}:d=${c.len ?? 0.6}:r=44100`, '-af', 'afade=t=in:d=0.02,afade=t=out:st=' + Math.max(0, (c.len ?? 0.6) - 0.05) + ':d=0.05,volume=0.45', '-ac', '1', out], name)
    return out
  },
  'pilot-on': (dir, name) => CUES.tone(dir, name, { hz: 1747, len: 0.8 }),
  'pilot-off': (dir, name) => CUES.tone(dir, name, { hz: 2147, len: 0.8 }),
  'voicemail-beep': (dir, name) => CUES.tone(dir, name, { hz: 1000, len: 0.35 }),
  door: (dir, name) => {
    const out = join(dir, `${name}.wav`)
    ff(['-f', 'lavfi', '-i', "aevalsrc='0.9*exp(-14*t)*sin(2*PI*68*t)+0.5*exp(-30*t)*(random(0)-0.5)':d=0.8:s=44100", '-af', 'lowpass=f=900', '-ac', '1', out], name)
    return out
  },
  keys: (dir, name) => {
    const out = join(dir, `${name}.wav`)
    ff(['-f', 'lavfi', '-i', "aevalsrc='0.5*(random(0)-0.5)*exp(-40*mod(t,0.11))*(0.6+0.4*sin(2*PI*3*t))':d=1.1:s=44100", '-af', 'highpass=f=2200,lowpass=f=8000', '-ac', '1', out], name)
    return out
  },
  footsteps: (dir, name, c) => {
    const out = join(dir, `${name}.wav`)
    ff(['-f', 'lavfi', '-i', `aevalsrc='0.8*(random(0)-0.5)*exp(-22*mod(t,0.55))':d=${c.len ?? 3}:s=44100`, '-af', 'lowpass=f=600', '-ac', '1', out], name)
    return out
  },
  'handset-click': (dir, name) => {
    const out = join(dir, `${name}.wav`)
    ff(['-f', 'lavfi', '-i', "aevalsrc='0.9*(random(0)-0.5)*exp(-120*t)':d=0.2:s=44100", '-af', 'bandpass=f=1800:w=2000', '-ac', '1', out], name)
    return out
  },
  birds: (dir, name, c) => {
    const out = join(dir, `${name}.wav`)
    const len = c.len ?? 4
    ff(['-f', 'lavfi', '-i', `aevalsrc='0.22*sin(2*PI*(3300+900*sin(2*PI*7*t))*t)*pow(max(0,sin(2*PI*1.3*t)),6)+0.15*sin(2*PI*(4200+600*sin(2*PI*11*t))*t)*pow(max(0,sin(2*PI*0.9*t+1)),8)':d=${len}:s=44100`, '-ac', '1', out], name)
    return out
  },
  hum: (dir, name, c) => {
    const out = join(dir, `${name}.wav`)
    ff(['-f', 'lavfi', '-i', `aevalsrc='0.12*(sin(2*PI*50*t)+0.5*sin(2*PI*100*t)+0.2*sin(2*PI*150*t))':d=${c.len ?? 3}:s=44100`, '-ac', '1', out], name)
    return out
  },
}

function ambienceBed(dir, kind, seconds) {
  const out = join(dir, 'ambience.wav')
  const noise = (color, amp) => `anoisesrc=d=${seconds}:c=${color}:a=${amp}:r=44100`
  const chain = {
    room: ['-f', 'lavfi', '-i', noise('pink', 0.012), '-af', 'lowpass=f=900'],
    'room-jacket': ['-f', 'lavfi', '-i', noise('brown', 0.05), '-af', 'lowpass=f=700,volume=0.7'],
    'phone-line': ['-f', 'lavfi', '-i', noise('white', 0.012), '-af', 'bandpass=f=1800:w=2600'],
    'tape-hiss': ['-f', 'lavfi', '-i', noise('white', 0.02), '-af', 'highpass=f=3000,lowpass=f=9000'],
    'outdoor-dawn': ['-f', 'lavfi', '-i', noise('pink', 0.014), '-af', 'lowpass=f=1800'],
  }[kind] ?? ['-f', 'lavfi', '-i', noise('pink', 0.01), '-af', 'lowpass=f=900']
  ff([...chain, '-ac', '1', out], 'ambience')
  return out
}

/** Render a script to an mp3 buffer. Returns { mp3, seconds }. */
export function renderAudio(a) {
  const spec = a.audio
  const dir = mkdtempSync(join(tmpdir(), 'nx-case-audio-'))
  try {
    const segments = []
    let t = 0
    let i = 0
    for (const item of spec.script) {
      const name = `seg${i++}`
      if (item.who) {
        const wav = speech(dir, name, item.who, item.text)
        const dur = Number(run('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', wav], name).stdout)
        segments.push({ wav, at: t, who: item.who })
        t += dur + (item.pause ?? 0.5)
      } else if (item.cue) {
        const make = CUES[item.cue]
        if (!make) throw new Error(`${a.id}: unknown cue "${item.cue}"`)
        const wav = make(dir, name, item)
        const dur = Number(run('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', wav], name).stdout)
        segments.push({ wav, at: t + (item.offset ?? 0), cue: true })
        if (!item.overlay) t += dur + (item.pause ?? 0.3)
      } else if (item.silence) {
        t += item.silence
      }
    }
    const total = t + 0.8
    const bed = ambienceBed(dir, spec.ambience ?? 'room', total)
    const inputs = [bed, ...segments.map(s => s.wav)]
    const delays = ['[0]volume=1[bed]']
    segments.forEach((s, k) => {
      const ms = Math.round(s.at * 1000)
      let chain = `[${k + 1}]`
      if (!s.cue && spec.ambience === 'room-jacket') chain += 'lowpass=f=2600,volume=0.8,'
      if (!s.cue && spec.ambience === 'phone-line') chain += 'highpass=f=300,lowpass=f=3400,'
      if (!s.cue && spec.ambience === 'tape-hiss') chain += 'lowpass=f=4200,'
      chain += `adelay=${ms}|${ms}[s${k}]`
      delays.push(chain)
    })
    const mixIn = ['[bed]', ...segments.map((_, k) => `[s${k}]`)].join('')
    const filter = `${delays.join(';')};${mixIn}amix=inputs=${inputs.length}:normalize=0:duration=longest,atrim=0:${total.toFixed(2)}[mix]`
    const mixed = join(dir, 'mix.wav')
    ff([...inputs.flatMap(p => ['-i', p]), '-filter_complex', filter, '-map', '[mix]', '-ac', '1', '-ar', '24000', mixed], 'mix')

    // Two-pass loudness to the archive's target.
    const target = spec.lufs ?? -23
    const pass1 = spawnSync('ffmpeg', ['-hide_banner', '-nostats', '-i', mixed, '-af', `loudnorm=I=${target}:TP=-3:LRA=11:print_format=json`, '-f', 'null', '-'], { encoding: 'utf8' })
    const block = pass1.stderr.match(/\{[\s\S]*?\}/g)?.pop()
    if (!block) throw new Error(`${a.id}: loudnorm printed nothing`)
    const m = JSON.parse(block)
    const out = join(dir, 'out.mp3')
    ff(['-i', mixed, '-af', `loudnorm=I=${target}:TP=-3:LRA=11:measured_I=${m.input_i}:measured_TP=${m.input_tp}:measured_LRA=${m.input_lra}:measured_thresh=${m.input_thresh}:offset=${m.target_offset}:linear=true`, '-ar', '24000', '-ac', '1', '-b:a', '64k', out], 'encode')
    const mp3 = readFileSync(out)
    return { mp3, seconds: total }
  } finally {
    rmSync(dir, { recursive: true, force: true })
  }
}

void writeFileSync
