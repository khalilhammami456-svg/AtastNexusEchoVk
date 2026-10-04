// Renders the teaser.
// node scripts/render.mjs [--preview] [--version=A|B|C] [--hook=A|B] [--ending=A|B] [--no-audio] [--out file.mp4]
import { renderMedia } from '@remotion/renderer'
import fs from 'node:fs'
import { prepare } from './common.mjs'

const args = process.argv.slice(2)
const flag = (name, def) => (args.find((a) => a.startsWith(`--${name}=`)) ?? `--${name}=${def}`).split('=')[1]
const preview = args.includes('--preview')
const audio = !args.includes('--no-audio')
const version = flag('version', 'A')
const hook = flag('hook', 'A')
const ending = flag('ending', 'A')
const rangeArg = args.find((a) => a.startsWith('--range='))
const frameRange = rangeArg ? rangeArg.split('=')[1].split('-').map((x) => Math.round(Number(x) * 30)) : null
const outIdx = args.indexOf('--out')
const output = outIdx >= 0 ? args[outIdx + 1] : `out/nexus-echo-teaser-${version}${hook}${ending}${preview ? '-preview' : ''}.mp4`
fs.mkdirSync('out', { recursive: true })
const inputProps = { audio, version, hook, ending }

const { serveUrl, composition, opts } = await prepare(inputProps)
console.log(`${composition.width}x${composition.height} @ ${composition.fps} fps, ${composition.durationInFrames} frames (${(composition.durationInFrames / composition.fps).toFixed(2)} s)  version ${version} hook ${hook} ending ${ending}`)
await renderMedia({
  composition,
  serveUrl,
  codec: 'h264',
  outputLocation: output,
  inputProps,
  ...(frameRange ? { frameRange: [frameRange[0], frameRange[1] - 1]  } : {}),
  scale: preview ? 0.5 : 1,
  crf: preview ? 26 : 16,
  pixelFormat: 'yuv420p',
  audioCodec: 'aac',
  audioBitrate: '256k',
  concurrency: 4,
  onProgress: (() => { let last = -1; return ({ progress }) => { const p = Math.floor(progress * 10) * 10; if (p !== last) { last = p; process.stdout.write(` ${p}%`) } } })(),
  ...opts,
})
console.log(`\nwrote ${output}`)
