// Named shots for the 2024 case: the stills and prints the exhibits refer to by
// name. Each shot is a camera in a real room built by the evidence scene
// library, so a figure in a corridor is geometry in a corridor, not a
// silhouette pasted on a gradient.

import '../../scripts/evidence-gen/lib/fontenv.mjs'
import sharp from 'sharp'
import { hashSeed } from '../../scripts/evidence-gen/lib/rng.mjs'
import { composePhotograph, composeSurveillance } from '../../scripts/evidence-gen/lib/photo.mjs'

const FIGURE = (x, z, o = {}) => ({ kind: 'figure', x, y: 0, z, height: 1.7, facing: 3.1, color: [20, 20, 22], ...o })

/** Surveillance shots: fixed high lens. */
const STILLS = {
  'entrance-1729': {
    scene: 'entrance', sceneOptions: { seed: 41, night: false },
    camera: { position: { x: 0, y: 4.4, z: 3.4 }, yaw: 0, pitch: -0.34 }, hfov: 96,
    props: [
      FIGURE(0.35, 6.4, { height: 1.62, facing: 0.1, color: [24, 22, 24] }),
      { kind: 'box', x: 0.62, y: 0.55, z: 6.35, w: 0.34, h: 0.3, d: 0.14, color: [118, 106, 78] },
    ],
    treatment: { exposure: 1.5 },
    location: 'ADMIN BLDG / MAIN ENTRANCE',
  },
  'eng-corridor-1945': {
    scene: 'corridor', sceneOptions: { seed: 52, length: 24, lightStart: 2.2, lightEvery: 4.4 },
    camera: { position: { x: 0, y: 2.7, z: 0.3 }, yaw: 0, pitch: -0.3 }, hfov: 100,
    props: [FIGURE(-0.15, 14.2, { height: 1.66, facing: 0.15, color: [14, 14, 16] })],
    treatment: { exposure: 1.9 },
    location: 'ENG BLOCK / CORRIDOR 2',
  },
  'west-corridor-0420': {
    scene: 'corridor', sceneOptions: { seed: 53, length: 22, lightStart: 2, lightEvery: 4.2 },
    camera: { position: { x: 0, y: 2.8, z: 0.3 }, yaw: 0, pitch: -0.32 }, hfov: 100,
    props: [
      FIGURE(-0.25, 9.5, { height: 1.66, facing: 3.0, color: [16, 16, 18] }),
      FIGURE(0.35, 10.7, { height: 1.84, facing: 3.0, color: [26, 28, 34] }),
    ],
    treatment: { exposure: 1.8 },
    surveillanceState: 'LOW LIGHT',
    location: 'ADMIN BLDG / WEST CORRIDOR',
  },
  'tunnel-door-1932': {
    scene: 'corridor', sceneOptions: { seed: 54, length: 9, width: 2.0, height: 2.4, lightStart: 1.2, lightEvery: 3.4, doorEvery: 40, endDoor: true },
    camera: { position: { x: 0, y: 2.3, z: 0.2 }, yaw: 0, pitch: -0.22 }, hfov: 96,
    props: [],
    treatment: { exposure: 1.6 },
    location: 'ROUTE DELTA / S01-TUN',
  },
}

/** Prints: handheld or tripod photographs. */
const PRINTS = {
  'east-lab-door-0417': {
    scene: 'corridor', sceneOptions: { seed: 61, length: 12, width: 2.4, lightStart: 1.5, lightEvery: 4, doorEvery: 40, endDoor: true },
    camera: { position: { x: 0.1, y: 1.55, z: 0.2 }, yaw: 0, pitch: 0.0, focal: 700 },
    treatment: { exposure: 1.6, vignette: 0.6, grain: 0.04, noise: 0.05 },
    props: [],
    location: 'SCIENCE BLDG / E-LAB-D1',
  },
  'hall214-b7': {
    scene: 'classroom', sceneOptions: { seed: 62 },
    camera: { position: { x: -0.4, y: 1.15, z: 2.2 }, yaw: 0.18, pitch: -0.14, focal: 760 },
    treatment: { exposure: 1.7, vignette: 0.6, grain: 0.04, noise: 0.05 },
    props: [],
    location: 'ADMIN BLDG / LECTURE HALL 214',
  },
  'frame-b07-1994': {
    scene: 'corridor', sceneOptions: { seed: 17, length: 28, lightStart: 2.0, lightEvery: 4.2 },
    camera: { position: { x: 0, y: 1.6, z: 0.2 }, yaw: 0, pitch: 0.0, focal: 700 },
    treatment: { exposure: 0.62, vignette: 0.5, grain: 0.06, noise: 0.075, flashStrength: 0.9 },
    props: [FIGURE(0.15, 17.5, { height: 1.74, facing: 3.1, color: [12, 12, 14] })],
    location: 'C214 / CORRIDOR MOUTH',
    paperTint: '#d8d0bc',
  },
  'lobby-clock': {
    scene: 'entrance', sceneOptions: { seed: 71, night: false },
    camera: { position: { x: -0.8, y: 1.6, z: 0.4 }, yaw: 0.1, pitch: 0.16, focal: 720 },
    treatment: { exposure: 1.5, vignette: 0.6, grain: 0.04, noise: 0.05 },
    props: [],
    location: 'ADMIN BLDG / LOBBY',
  },
  'stair-down-shaft': {
    scene: 'stairwell', sceneOptions: { seed: 72, lit: false },
    camera: { position: { x: 0.2, y: 1.7, z: 0.3 }, yaw: -0.05, pitch: -0.32, focal: 680 },
    treatment: { exposure: 1.9, vignette: 0.65, grain: 0.05, noise: 0.07 },
    props: [],
    location: 'SERVICE SHAFT S-3',
  },
}

const monthFor = { '24': 'OCT 24', '94': 'OCT 94' }

function captionDate(text) {
  return text ?? 'DATE UNKNOWN'
}

async function negativeStrip(a, base) {
  // Three frames of the same corridor on a film base, inverted and orange-tinted.
  const frames = []
  for (let i = 0; i < 3; i++) {
    const spec = { ...base, seed: hashSeed(`${a.id}${i}`) % 90000, width: 520, height: 390, caption: false, label: false, border: 0, printDamage: false,
      camera: { ...base.camera, yaw: (i - 1) * 0.04 },
      props: i === 1 ? base.props : [] }
    const { full } = await composePhotograph(spec)
    frames.push(await sharp(full).negate({ alpha: false }).modulate({ saturation: 0.7 }).toBuffer())
  }
  const W = 3 * 540 + 40
  const H = 520
  const sprocket = Array.from({ length: 34 }, (_, k) => `<rect x="${14 + k * 49}" y="14" width="22" height="30" rx="4" fill="#0c0805"/><rect x="${14 + k * 49}" y="${H - 44}" width="22" height="30" rx="4" fill="#0c0805"/>`).join('')
  const base64 = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}"><rect width="${W}" height="${H}" fill="#3a2410"/><rect width="${W}" height="${H}" fill="#7a4a1e" opacity="0.35"/>${sprocket}<text x="20" y="${H - 54}" font-family="'Courier New',monospace" font-size="13" fill="#e0a45a" opacity="0.85">NX-037 · FIELD-CAM-02 · 14 OCT 94 · 22 23 24</text></svg>`
  const strip = await sharp(Buffer.from(base64)).composite(frames.map((f, i) => ({ input: f, left: 20 + i * 540, top: 62 }))).jpeg({ quality: 88 }).toBuffer()
  const thumb = await sharp(strip).resize(240, 240, { fit: 'inside' }).jpeg({ quality: 78 }).toBuffer()
  return { full: strip, thumb }
}

export async function renderImage(a) {
  const r = a.render
  const seed = (hashSeed(a.id) % 90000) + 100
  if (r.shot === 'negative-strip-1994') return negativeStrip(a, PRINTS['frame-b07-1994'])
  if (a.kind === 'still') {
    const shot = STILLS[r.shot]
    if (!shot) throw new Error(`${a.id}: shot "${r.shot}" is not a surveillance shot`)
    const osd = r.osd ?? {}
    return composeSurveillance({
      ...shot, seed,
      surveillanceState: shot.surveillanceState ?? 'SIGNAL STABLE',
      cameraLabel: osd.camera ?? 'CAM-E3',
      osdLocation: shot.location,
      osdDate: osd.date ?? '17-10-24',
      osdTime: osd.time ?? '00:00:00',
      frame: osd.frame ?? 61000 + (seed % 9000),
      totalFrames: osd.totalFrames ?? 2073600,
      integrity: 'RECORD INTACT',
    })
  }
  const shot = PRINTS[r.shot] ?? STILLS[r.shot]
  if (!shot) throw new Error(`${a.id}: unknown shot "${r.shot}"`)
  const [code, location, captured, device] = r.caption ?? [a.id, shot.location, a.date, 'FIELD CAMERA']
  return composePhotograph({
    ...shot, seed, code: a.id, location: location ?? shot.location, capturedAt: captionDate(captured), device,
    captionFields: [code],
    condition: a.condition && a.condition !== 'NORMAL' ? a.condition : 'NORMAL',
  })
}

export const SHOT_NAMES = [...Object.keys(STILLS), ...Object.keys(PRINTS), 'negative-strip-1994']
void monthFor
