// One still, with a hard timeout and verbose logs: node scripts/still1.mjs <seconds> [out.png]
import { renderStill } from '@remotion/renderer'
import { prepare } from './common.mjs'
const t = Number(process.argv[2])
const out = process.argv[3] ?? `out/s_${t}.png`
const { serveUrl, composition, opts } = await prepare({ audio: false, version: 'A', hook: 'A', ending: 'A' })
await renderStill({ composition, serveUrl, frame: Math.round(t * 30), output: out, timeoutInMilliseconds: 90000, ...opts })
console.log('ok', out)
