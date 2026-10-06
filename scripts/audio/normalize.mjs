#!/usr/bin/env node
/**
 * Loudness-normalise the recordings in public/audio.
 *
 * The twelve recordings were authored separately and arrived anywhere between
 * -19.6 and -29.5 LUFS, with peaks from -1.7 to -13.2 dBFS. Heard back to
 * back (P24b plays four voices in a row) that reads as "quiet witness", not
 * "different speaker". This brings every file to the same integrated loudness
 * with true-peak headroom, and halves the payload (speech does not need
 * 44.1 kHz at 128 kbps).
 *
 *   target    -23 LUFS integrated, true peak <= -3 dBFS
 *   exception REC-26 (the Entity) sits 3 LU lower on purpose, so it reads as
 *             distinct from the human voices rather than merely quiet
 *   format    mono, 24 kHz, 64 kbps CBR MP3
 *
 * Two passes (measure, then apply a linear correction) so short clips land on
 * target instead of drifting.
 *
 *   node scripts/audio/normalize.mjs           rewrite the files in place
 *   node scripts/audio/normalize.mjs --check   measure only; exit 1 if any file
 *                                              is outside target +/- 1.5 LU
 *
 * Needs ffmpeg on PATH.
 */
import { spawnSync } from 'node:child_process'
import { readdirSync, renameSync, mkdtempSync, rmSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { tmpdir } from 'node:os'
import { fileURLToPath } from 'node:url'

const dir = join(dirname(fileURLToPath(import.meta.url)), '..', '..', 'public', 'audio')
const TARGET = -23
const OFFSETS = { 'dictaphone-rec-26-entity.mp3': -3 }
const check = process.argv.includes('--check')

function ffmpeg(args) {
  const r = spawnSync('ffmpeg', ['-hide_banner', '-nostats', ...args], { encoding: 'utf8' })
  if (r.error) throw new Error(`ffmpeg is required: ${r.error.message}`)
  return r
}

/** First pass: what the file measures at, against the target it is meant to hit. */
function measure(file, target) {
  const r = ffmpeg(['-i', file, '-af', `loudnorm=I=${target}:TP=-3:LRA=11:print_format=json`, '-f', 'null', '-'])
  const blocks = r.stderr.match(/\{[\s\S]*?\}/g)
  if (!blocks) throw new Error(`loudnorm printed no statistics for ${file}`)
  return JSON.parse(blocks[blocks.length - 1])
}

const files = readdirSync(dir).filter(f => f.endsWith('.mp3')).sort()
const tmp = mkdtempSync(join(tmpdir(), 'nexus-audio-'))
let outside = 0

try {
  for (const name of files) {
    const src = join(dir, name)
    const target = TARGET + (OFFSETS[name] ?? 0)
    const before = measure(src, target)
    const lufs = Number(before.input_i)

    if (check) {
      const ok = Math.abs(lufs - target) <= 1.5 && Number(before.input_tp) <= -2
      console.log(`${ok ? 'ok  ' : 'FAIL'} ${name}  ${lufs.toFixed(1)} LUFS  tp ${Number(before.input_tp).toFixed(1)}  (target ${target})`)
      if (!ok) outside += 1
      continue
    }

    const out = join(tmp, name)
    const filter =
      `loudnorm=I=${target}:TP=-3:LRA=11:measured_I=${before.input_i}:measured_TP=${before.input_tp}` +
      `:measured_LRA=${before.input_lra}:measured_thresh=${before.input_thresh}:offset=${before.target_offset}:linear=true`
    const r = ffmpeg(['-loglevel', 'error', '-y', '-i', src, '-af', filter, '-ac', '1', '-ar', '24000', '-c:a', 'libmp3lame', '-b:a', '64k', '-map_metadata', '-1', out])
    if (r.status !== 0) throw new Error(`ffmpeg failed for ${name}: ${r.stderr}`)
    renameSync(out, src)
    const after = measure(src, target)
    console.log(`${name}  ${lufs.toFixed(1)} -> ${Number(after.input_i).toFixed(1)} LUFS  tp ${Number(after.input_tp).toFixed(1)}`)
  }
} finally {
  rmSync(tmp, { recursive: true, force: true })
}
if (outside) process.exit(1)
