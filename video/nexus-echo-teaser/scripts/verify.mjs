// Technical checks on the rendered MP4. Usage: node scripts/verify.mjs [file]
import { execFileSync, spawnSync } from 'node:child_process'
const file = process.argv[2] ?? 'out/nexus-echo-teaser.mp4'
const probe = JSON.parse(execFileSync('ffprobe', ['-v', 'error', '-show_streams', '-show_format', '-of', 'json', file]).toString())
const v = probe.streams.find((s) => s.codec_type === 'video')
const a = probe.streams.find((s) => s.codec_type === 'audio')
const fail = []
const ok = (c, msg) => { console.log(`${c ? 'PASS' : 'FAIL'}  ${msg}`); if (!c) fail.push(msg) }
const dur = Number(probe.format.duration)
ok(dur >= 45 && dur <= 60, `duration ${dur.toFixed(3)} s (45-60)`)
ok(v.width === 1920 && v.height === 1080, `resolution ${v.width}x${v.height}`)
ok(v.r_frame_rate === '30/1', `frame rate ${v.r_frame_rate}`)
ok(v.codec_name === 'h264', `video codec ${v.codec_name}`)
ok(!!a, `audio stream ${a?.codec_name} ${a?.sample_rate} Hz ${a?.channels} ch`)
const frames = parseInt(execFileSync('ffprobe', ['-v', 'error', '-count_packets', '-select_streams', 'v:0', '-show_entries', 'stream=nb_read_packets', '-of', 'csv=p=0', file]).toString(), 10)
ok(frames === 1680, `frame count ${frames} (expected 1680)`)
const log = (args) => spawnSync('ffmpeg', ['-nostats', '-i', file, ...args, '-f', 'null', '-'], { encoding: 'utf8' }).stderr
const black = [...log(['-vf', 'blackdetect=d=0.2:pix_th=0.04']).matchAll(/black_start:([\d.]+) black_end:([\d.]+)/g)].map((m) => [Number(m[1]), Number(m[2])])
console.log('black intervals (s):', black.map(([s, e]) => `${s.toFixed(2)}-${e.toFixed(2)}`).join(', ') || 'none')
const intended = [[23.4, 24.6], [47.6, 48.5], [51.5, 52.2]]
const unintended = black.filter(([s, e]) => !intended.some(([is, ie]) => s >= is - 0.15 && e <= ie + 0.15))
ok(unintended.length === 0, `no unintended black frames (${unintended.map(([s, e]) => `${s.toFixed(2)}-${e.toFixed(2)}`).join(', ') || 'none'})`)
const sil = [...log(['-af', 'silencedetect=n=-60dB:d=0.4']).matchAll(/silence_start: ([\d.]+)/g)].map((m) => Number(m[1]))
console.log('silence starts (s):', sil.map((x) => x.toFixed(2)).join(', ') || 'none')
const peak = log(['-af', 'astats=measure_overall=Peak_level:measure_perchannel=none']).match(/Peak level dB: (-?[\d.]+)/)
ok(peak && Number(peak[1]) < -0.5, `audio peak ${peak?.[1]} dBFS (no clipping)`)
process.exit(fail.length ? 1 : 0)
