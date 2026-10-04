import { continueRender, delayRender, staticFile } from 'remotion'

const FACES: Array<[string, string, string]> = [
  ['Plex Mono', 'fonts/plex-mono-400.woff2', '400'],
  ['Plex Mono', 'fonts/plex-mono-500.woff2', '500'],
  ['Courier Prime', 'fonts/courier-prime-400.woff2', '400'],
]

let started = false
/** Blocks every frame until the brand fonts are decoded, so no frame renders in a fallback face. */
export function loadFonts(): void {
  if (started) return
  started = true
  const handle = delayRender('teaser fonts')
  Promise.all(
    FACES.map(async ([family, file, weight]) => {
      const face = new FontFace(family, `url(${staticFile(file)})`, { weight })
      await face.load()
      const set = document.fonts as unknown as { add(face: FontFace): void }
      set.add(face)
    }),
  )
    .then(() => continueRender(handle))
    .catch((error) => {
      console.error('font load failed', error)
      continueRender(handle)
    })
}
