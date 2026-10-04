// Renders the teaser. Usage: node scripts/render.mjs [--preview] [--out file.mp4] [--no-audio]
import { renderMedia } from '@remotion/renderer'
import fs from 'node:fs'
import { prepare } from './common.mjs'

const args = process.argv.slice(2)
const preview = args.includes('--preview')
const audio = !args.includes('--no-audio')
const outIdx = args.indexOf('--out')
const output = outIdx >= 0 ? args[outIdx + 1] : preview ? 'out/nexus-echo-teaser-preview.mp4' : 'out/nexus-echo-teaser.mp4'
fs.mkdirSync('out', { recursive: true })
if (audio && !fs.existsSync('public/audio/teaser-mix.wav')) throw new Error('Run: node scripts/audio.mjs first')

const { serveUrl, composition, opts } = await prepare({ audio, durationSeconds: 56 })
console.log(`${composition.width}x${composition.height} @ ${composition.fps} fps, ${composition.durationInFrames} frames (${(composition.durationInFrames / composition.fps).toFixed(2)} s)`)
await renderMedia({
  composition,
  serveUrl,
  codec: 'h264',
  outputLocation: output,
  inputProps: { audio, durationSeconds: 56 },
  scale: preview ? 0.5 : 1,
  crf: preview ? 28 : 16,
  pixelFormat: 'yuv420p',
  audioCodec: 'aac',
  audioBitrate: '256k',
  onProgress: (() => { let last = -1; return ({ progress }) => { const p = Math.floor(progress * 10) * 10; if (p !== last) { last = p; process.stdout.write(` ${p}%`) } } })(),
  ...opts,
})
console.log(`\nwrote ${output}`)
