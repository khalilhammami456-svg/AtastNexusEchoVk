import { bundle } from '@remotion/bundler'
import { renderMedia, selectComposition } from '@remotion/renderer'
import path from 'node:path'
const chrome = process.env.CHROME || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome'
const serveUrl = await bundle({ entryPoint: path.resolve('src/index.ts') })
const composition = await selectComposition({ serveUrl, id: 'Smoke', browserExecutable: chrome, chromeMode: 'headless-shell' })
await renderMedia({ composition, serveUrl, codec: 'h264', outputLocation: 'out/smoke.mp4', browserExecutable: chrome, chromeMode: 'headless-shell' })
console.log('done')
