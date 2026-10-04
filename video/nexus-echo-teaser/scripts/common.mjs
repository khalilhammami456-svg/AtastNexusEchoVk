import { bundle } from '@remotion/bundler'
import { selectComposition } from '@remotion/renderer'
import fs from 'node:fs'
import path from 'node:path'

/** Remotion needs a headless-shell build. Override with CHROME=/path/to/headless_shell. */
export function findBrowser() {
  if (process.env.CHROME) return process.env.CHROME
  const root = '/opt/pw-browsers'
  if (fs.existsSync(root)) {
    for (const d of fs.readdirSync(root)) {
      if (!d.startsWith('chromium_headless_shell')) continue
      const p = path.join(root, d, 'chrome-linux', 'headless_shell')
      if (fs.existsSync(p)) return p
    }
  }
  return null // let Remotion download/locate its own
}

export async function prepare(inputProps = {}) {
  const browserExecutable = findBrowser()
  const serveUrl = await bundle({ entryPoint: path.resolve('src/index.ts') })
  const opts = { browserExecutable, chromeMode: 'headless-shell', logLevel: 'error' }
  const composition = await selectComposition({ serveUrl, id: 'NexusEchoTeaser', inputProps, ...opts })
  return { serveUrl, composition, opts }
}
