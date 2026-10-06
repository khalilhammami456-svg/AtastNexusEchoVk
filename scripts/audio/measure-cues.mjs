#!/usr/bin/env node
/**
 * Play every cue in a real browser AudioContext and measure what comes out.
 *
 * The unit tests run against a fake context, which cannot hear a click. This
 * does: it taps the destination with an AnalyserNode and reports each cue's
 * measured peak against the level the palette specifies. It caught a
 * dynamics compressor that overshot a noise onset by 17 dB, and attack ramps
 * scheduled too close to the clock turning into pops.
 *
 *   npm run dev          (in another terminal; any port)
 *   node scripts/audio/measure-cues.mjs [http://127.0.0.1:3000] [volume 0-1]
 *
 * Needs playwright-core and a Chromium (see scripts/screenshots/capture.mjs for
 * where it looks). Nothing is installed by this script.
 */
import { createRequire } from 'node:module'
import fs from 'node:fs'

const base = process.argv[2] ?? 'http://127.0.0.1:3000'
const volume = Number(process.argv[3] ?? 1)

function load(name) {
  for (const dir of [process.env.PLAYWRIGHT_CORE_DIR, '/opt/node-tools/'].filter(Boolean).concat([process.cwd() + '/'])) {
    try {
      return createRequire(dir)(name)
    } catch {
      /* try the next place */
    }
  }
  throw new Error(`${name} not found`)
}
const { chromium } = load('playwright-core')
const executablePath = process.env.PW_CHROMIUM ?? ['/opt/pw-browsers/chromium', '/usr/bin/chromium'].find(p => fs.existsSync(p))

const browser = await chromium.launch({ executablePath, args: ['--no-sandbox', '--autoplay-policy=no-user-gesture-required'] })
const page = await (await browser.newContext()).newPage()
page.on('pageerror', e => console.log('PAGE ERROR', e))
// Any page that serves the app's modules will do; the login screen is enough.
await page.goto(`${base}/player/login`, { waitUntil: 'load' })

const rows = await page.evaluate(async vol => {
  const { SoundEngine } = await import('/src/lib/audio/engine.ts')
  const { CUES } = await import('/src/lib/audio/cues.ts')
  const real = new AudioContext()
  const analyser = real.createAnalyser()
  analyser.fftSize = 2048
  analyser.connect(real.destination)
  const ctx = new Proxy(real, {
    get(target, key) {
      if (key === 'destination') return analyser
      const value = target[key]
      return typeof value === 'function' ? value.bind(target) : value
    },
  })
  let clock = 0
  const engine = new SoundEngine(() => ctx, () => (clock += 1e5))
  await engine.unlock()
  engine.setPreferences({ enabled: true, volume: vol, ambience: false })
  await new Promise(r => setTimeout(r, 300))
  const buf = new Float32Array(analyser.fftSize)
  const out = []
  for (const id of Object.keys(CUES)) {
    let peak = 0
    const timer = setInterval(() => {
      analyser.getFloatTimeDomainData(buf)
      for (const x of buf) peak = Math.max(peak, Math.abs(x))
    }, 5)
    const played = engine.play(id)
    const length = Math.max(...CUES[id].voices.map(v => v.at + v.length))
    await new Promise(r => setTimeout(r, length * 1000 + 400))
    clearInterval(timer)
    out.push({ id, played, spec: CUES[id].peakDb, measured: Math.round(20 * Math.log10(peak || 1e-9) * 10) / 10 })
  }
  return out
}, volume)

let bad = 0
for (const r of rows) {
  const clipped = r.measured > -3
  if (!r.played || clipped) bad += 1
  console.log(`${clipped || !r.played ? 'FAIL' : 'ok  '} ${r.id.padEnd(16)} spec ${String(r.spec).padStart(4)}  measured ${String(r.measured).padStart(6)} dBFS`)
}
await browser.close()
process.exit(bad ? 1 : 0)
