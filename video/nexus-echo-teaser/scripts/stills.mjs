// Renders PNG stills at given seconds into out/stills/. Usage: node scripts/stills.mjs 0.2 1.5 ...
import { renderStill } from '@remotion/renderer'
import fs from 'node:fs'
import { prepare } from './common.mjs'

const times = process.argv.slice(2).map(Number)
fs.mkdirSync('out/stills', { recursive: true })
const { serveUrl, composition, opts } = await prepare({ audio: false, version: 'A', hook: 'A', ending: 'A' })
for (const t of times) {
  const frame = Math.round(t * composition.fps)
  const output = `out/stills/t${String(Math.round(t * 100)).padStart(5, '0')}.png`
  await renderStill({ composition, serveUrl, frame, output, ...opts })
  console.log(output)
}
