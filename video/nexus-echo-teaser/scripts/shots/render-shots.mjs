#!/usr/bin/env node
// NEXUS ECHO teaser: real camera moves through the east corridor (LOC-C214).
//
//   node video/nexus-echo-teaser/scripts/shots/render-shots.mjs
//        [--only corridor_a,corridor_b,corridor_figure,corridor_details]
//        [--width 1280 --height 720] [--jobs 4] [--clean]
//
// Uses the game's own deterministic software renderer
// (scripts/evidence-gen/lib/render3d.mjs + scenes.mjs) and the same optical /
// emulsion treatment as the evidence photographs (lib/pixels.mjs, the
// photographicTreatment chain in lib/photo.mjs), pushed a touch darker and
// cooler for a night / security feel. Every frame is a pure function of its
// index, so output is byte-identical between runs.
//
// Output: video/nexus-echo-teaser/public/shots/<name>/0001.jpg ... + meta.json
//         (stills: detail_01.jpg ... + meta.json)

import { mkdirSync, writeFileSync, existsSync, rmSync } from 'node:fs'
import { spawn } from 'node:child_process'
import { cpus } from 'node:os'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const HERE = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(HERE, '..', '..', '..', '..')
const GEN = join(ROOT, 'scripts', 'evidence-gen', 'lib')

await import(join(GEN, 'fontenv.mjs')) // same environment as build.mjs (no SVG here, kept for parity)
const R3 = await import(join(GEN, 'render3d.mjs'))
const SC = await import(join(GEN, 'scenes.mjs'))
const PX = await import(join(GEN, 'pixels.mjs'))
const { makeRng } = await import(join(GEN, 'rng.mjs'))
const { v3, box, face, quad, createCamera, renderScene } = R3

const FPS = 30
const argv = process.argv.slice(2)
const argVal = (k, d) => { const i = argv.indexOf(k); return i >= 0 ? argv[i + 1] : d }
const OUT = resolve(argVal('--out', join(HERE, '..', '..', 'public', 'shots')))
const WIDTH = Number(argVal('--width', 1280))
const HEIGHT = Number(argVal('--height', 720))
const FOCAL_SCALE = WIDTH / 1280

/* ------------------------------------------------------------------ math */

const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x))
const lerp = (a, b, t) => a + (b - a) * t
const smooth = (a, b, x) => { const t = clamp((x - a) / (b - a)); return t * t * (3 - 2 * t) }
function hash01(n) {
  let x = Math.imul((n | 0) ^ 0x9e3779b9, 0x85ebca6b)
  x ^= x >>> 13
  x = Math.imul(x, 0xc2b2ae35)
  x ^= x >>> 16
  return (x >>> 0) / 4294967296
}
/** Hard fluorescent stutter: on with probability pOn, otherwise a dim glow. */
const flick = (f, seed, pOn) => (hash01(f * 131 + seed) < pOn ? 1 : 0.1 + 0.18 * hash01(f * 17 + seed))

/* ----------------------------------------------------------------- scene */

// Same room as photo_nx037_b_01 / _02: corridorScene(), b_01's fixture rhythm,
// b_02's crate and figure, b_01's small floor box and blade sign.
const SCENE_OPTS = { seed: 11, length: 26, lightStart: 2.4, lightEvery: 4.6, doorSide: 'alternate' }
const FIXTURE_Z = [2.4, 7.0, 11.6, 16.2, 20.8, 25.4]
const FIGURE = { x: -0.1, y: 0, z: 23.9, height: 1.76, facing: 0.1, color: [14, 14, 16] }
const CORRIDOR_HW = 1.3

/** 7-segment room-number plate texture (u runs along +Z on the left wall). */
function plateTexture(z0, y0, w, h, digits) {
  const SEG = { 0: 'abcdef', 1: 'bc', 2: 'abdeg', 3: 'abcdg', 4: 'bcfg', 5: 'acdfg', 6: 'acdefg', 7: 'abc', 8: 'abcdefg', 9: 'abcdfg' }
  const rects = {
    a: [0.15, 0.88, 0.85, 1.0], b: [0.8, 0.52, 1.0, 0.92], c: [0.8, 0.08, 1.0, 0.48],
    d: [0.15, 0.0, 0.85, 0.12], e: [0.0, 0.08, 0.2, 0.48], f: [0.0, 0.52, 0.2, 0.92], g: [0.15, 0.44, 0.85, 0.56],
  }
  return (_wx, wy, wz) => {
    const u = (wz - z0) / w
    const v = (wy - y0) / h
    if (u < 0 || u > 1 || v < 0 || v > 1) return 1
    if (u < 0.035 || u > 0.965 || v < 0.07 || v > 0.93) return 1.5 // raised rim
    const gu = (u - 0.1) / 0.8
    const gv = (v - 0.2) / 0.6
    if (gu < 0 || gu > 1 || gv < 0 || gv > 1) return 1
    const cell = Math.min(digits.length - 1, Math.floor(gu * digits.length))
    const cu = (gu * digits.length - cell - 0.12) / 0.76
    if (cu < 0 || cu > 1) return 1
    for (const s of SEG[digits[cell]]) {
      const [a, b, c, d] = rects[s]
      if (cu >= a && cu <= c && gv >= b && gv <= d) return 2.5
    }
    return 1
  }
}

function buildBase() {
  const scene = SC.corridorScene(SCENE_OPTS)
  const faces = scene.faces
  const fixtures = faces.filter(f => f.tag === 'fixture')
  if (fixtures.length !== FIXTURE_Z.length || scene.lights.length !== FIXTURE_Z.length) {
    throw new Error(`expected ${FIXTURE_Z.length} fixtures, found ${fixtures.length}/${scene.lights.length}`)
  }
  // Dressing from the photographs (library.mjs b_01 + b_02).
  const rng = makeRng(12)
  SC.addCrate(faces, { x: 1.0, y: 0, z: 6.2, w: 0.44, h: 0.4, d: 0.38, seed: rng.int(1, 9999) })
  faces.push(...box(0.9, 0.06, 1.4, 0.3, 0.12, 0.3, { color: [70, 70, 66] }))
  faces.push(SC.wallSign(-1.26, 2.16, 4.6, 0.46, 0.15, 0, [178, 174, 158], 0.16))

  // Hardware the corridor builder leaves out: lever handles on the closed
  // (left wall) doors and the end door, and a room-number plate by each door.
  const handle = [150, 150, 144]
  for (const [i, dz] of [3.4, 9.6, 15.8, 22.0].entries()) {
    faces.push(...box(-1.115, 1.0, dz + 0.8, 0.012, 0.07, 0.07, { color: handle, roughness: 0.4 }))
    faces.push(...box(-1.08, 1.0, dz + 0.76, 0.07, 0.03, 0.15, { color: handle, roughness: 0.4 }))
    const pz = dz + 1.35
    const digits = ['211', '212', '213', '214'][i]
    faces.push(face(
      [v3(-CORRIDOR_HW + 0.012, 1.55, pz), v3(-CORRIDOR_HW + 0.012, 1.55, pz + 0.24), v3(-CORRIDOR_HW + 0.012, 1.71, pz + 0.24), v3(-CORRIDOR_HW + 0.012, 1.71, pz)],
      { color: [66, 74, 82], roughness: 0.4, doubleSided: true, texture: plateTexture(pz, 1.55, 0.24, 0.16, digits), tag: 'plate', bias: 0.03 },
    ))
  }
  faces.push(...box(0.37, 1.0, 25.92, 0.07, 0.03, 0.07, { color: handle, roughness: 0.4 }))
  faces.push(...box(0.37, 1.0, 25.95, 0.07, 0.07, 0.012, { color: handle, roughness: 0.4 }))

  const figure = []
  SC.addFigure(figure, FIGURE)
  return { scene, fixtures, figure, baseLights: scene.lights, baseEmissive: fixtures.map(f => f.emissive), baseFog: scene.fog, baseAmbient: scene.ambient }
}

/* ------------------------------------------------------- camera + motion */

/** Forward speed in m/s over the continuous 7.7 s walk (a -> b -> figure hold). */
function speedAt(t) {
  if (t < 4.5) return 1.75 * (0.3 + 0.7 * smooth(0, 0.6, t))
  if (t < 6.5) return lerp(1.75, 0.55, smooth(4.5, 6.5, t))
  return lerp(0.55, 0.12, smooth(6.5, 7.7, t))
}
const distTable = (() => {
  const steps = 8200
  const dt = 1 / 1000
  const table = [0]
  let d = 0
  for (let i = 0; i < steps; i++) { d += speedAt(i * dt + dt / 2) * dt; table.push(d) }
  return table
})()
const distance = t => { const x = clamp(t, 0, 8.199) * 1000; const i = Math.floor(x); return lerp(distTable[i], distTable[i + 1], x - i) }

const SEQ_OFFSET = { corridor_a: 0, corridor_b: 135, corridor_figure: 195 }
const START_Z = 1.0

function walkCamera(seq, f) {
  const gf = SEQ_OFFSET[seq] + f
  const t = gf / FPS
  const d = distance(t)
  const s = speedAt(t)
  const stride = 0.85
  const phase = (2 * Math.PI * d) / stride
  const k = 0.35 + 0.65 * clamp(s / 1.75) // step bob follows pace, never dies completely
  // "More bob" through b: unease, not shake. Everything is a low-frequency sinusoid.
  const amp = lerp(1.0, 1.9, smooth(135, 195, gf)) * (gf >= 195 ? lerp(1.9, 1.5, smooth(195, 231, gf)) / 1.9 : 1)
  const bobY = 0.021 * Math.sin(phase) * k * amp
  const sway = 0.016 * Math.sin(phase / 2 + 0.7) * k * amp + 0.012 * Math.sin(0.61 * t + 0.4)
  const pitch = -0.018 + (0.0065 * Math.sin(phase + 0.6) * k + 0.004 * Math.sin(0.93 * t + 1.1)) * amp
  const yaw = (0.0095 * Math.sin(phase / 2 + 1.3) * k + 0.010 * Math.sin(0.52 * t + 2.0) + 0.004 * Math.sin(1.7 * t)) * amp
  const roll = (0.0065 * Math.sin(phase / 2 + 0.4) * k + 0.0035 * Math.sin(1.31 * t + 0.2)) * amp
  const breathe = 0.004 * Math.sin(2 * Math.PI * 0.28 * t)
  return {
    position: v3(0.05 + sway, 1.58 + bobY + breathe, START_Z + d),
    yaw, pitch, roll, focal: 920 * FOCAL_SCALE,
  }
}

function lookAt(pos, target, focal, roll = 0) {
  const dx = target[0] - pos[0]
  const dy = target[1] - pos[1]
  const dz = target[2] - pos[2]
  return { position: v3(...pos), yaw: Math.atan2(dx, dz), pitch: Math.atan2(dy, Math.hypot(dx, dz)), roll, focal: focal * FOCAL_SCALE }
}

function makeCamera(spec) {
  const cam = createCamera({ position: spec.position, yaw: spec.yaw, pitch: spec.pitch, focal: spec.focal, width: WIDTH, height: HEIGHT })
  if (spec.roll) {
    const c = Math.cos(spec.roll)
    const s = Math.sin(spec.roll)
    const r = cam.right
    const u = cam.up
    cam.right = { x: r.x * c + u.x * s, y: r.y * c + u.y * s, z: r.z * c + u.z * s }
    cam.up = { x: u.x * c - r.x * s, y: u.y * c - r.y * s, z: u.z * c - r.z * s }
  }
  return cam
}

/* ------------------------------------------------------ light schedules */

const ON = () => [1, 1, 1, 1, 1, 1]

function lightsCorridorA(f) {
  const m = ON()
  if (f >= 56 && f <= 80) m[2] = f <= 77 ? flick(f, 5, 0.5) : 0.75 // the unstable tube, mid-shot
  else if (f >= 81 && f <= 88) m[2] = 0.88 + 0.12 * hash01(f)
  if (f >= 130) m[2] = flick(f, 9, 0.4) // flickers again as the cut comes
  return { m, bounce: 0.12 }
}

function lightsCorridorB(f) {
  const m = [
    lerp(1, 0.2, smooth(25, 59, f)),
    lerp(1, 0.2, smooth(40, 59, f)),
    1,
    1,
    lerp(1, 0.14, smooth(30, 59, f)),
    lerp(1, 0.08, smooth(36, 59, f)),
  ]
  // fixture 3 (z 11.6): the tube that was already flickering. Dims, stutters, drops out.
  if (f < 4) m[2] = 1
  else if (f < 29) m[2] = lerp(1, 0.35, smooth(4, 26, f)) * (hash01(f * 131 + 3) < 1 - 0.5 * smooth(8, 28, f) ? 1 : 0.25)
  else m[2] = f === 29 ? 0.1 : f === 33 || f === 34 ? 0.45 : 0
  // fixture 4 (z 16.2): follows, then goes out.
  if (f < 16) m[3] = 1
  else if (f < 44) m[3] = lerp(1, 0.3, smooth(16, 38, f)) * (f > 30 ? flick(f, 11, 0.6) : 1)
  else m[3] = f === 47 ? 0.2 : 0
  // two of the survivors sputter late
  if (f >= 50 && f <= 56) m[1] *= flick(f, 21, 0.6)
  if (f >= 54) m[4] *= flick(f, 23, 0.7)
  return { m, bounce: lerp(0.12, 0.03, smooth(20, 59, f)) }
}

// Frames of the figure shot: how far the lights come back (0 dark .. 1 lit).
const FIGURE_LIT = [
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0.7, 0, 1, 1, 0.35, 1, 1, 1, 0.9, 1, 0.45,
  1, 0.15, 0.6, 0, 0.25, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
]
function lightsFigure(f) {
  const end = lightsCorridorB(59).m
  const l = FIGURE_LIT[f]
  const target = [0.8, 0.8, 1.0, 1.0, 1.0, 1.0]
  const m = end.map((v, i) => lerp(v, target[i], l))
  return { m, bounce: lerp(0.03, 0.12, l) }
}

/* -------------------------------------------------------------- grading */

/** The evidence-photo chain (photo.mjs photographicTreatment), cooler and darker. */
function grade(canvas, seed, o = {}) {
  const k = WIDTH / 1280
  PX.bloom(canvas, { threshold: o.bloomThreshold ?? 0.5, radius: Math.round((o.bloomRadius ?? 15) * k), strength: o.bloom ?? 0.5 })
  PX.toneMap(canvas, { exposure: o.exposure ?? 0.8, contrast: o.contrast ?? 1.16, blackLift: o.blackLift ?? 0.016 })
  PX.desaturate(canvas, o.desaturate ?? 0.44, o.tint ?? [0.95, 1.0, 1.075])
  PX.colorGrade(canvas, { shadows: o.shadows ?? [0.006, 0.013, 0.028], highlights: o.highlights ?? [0.004, 0.007, 0.006] })
  PX.flashFalloff(canvas, { strength: o.flashStrength ?? 0.3, radius: 0.92, centerX: 0.5, centerY: 0.46 })
  if (o.blur !== 0) PX.depthOfField(canvas, { focusX: o.focusX ?? 0.5, focusY: o.focusY ?? 0.48, maxRadius: (o.blur ?? 1.6) * k, focusSpread: o.focusSpread ?? 0.3 })
  PX.lensDistortion(canvas, { amount: o.barrel ?? 0.05, chromatic: o.chromatic ?? 1.1 })
  PX.vignette(canvas, { strength: o.vignette ?? 0.7, radius: 0.74, softness: 0.5 })
  PX.sensorNoise(canvas, seed, { amount: o.noise ?? 0.06, chroma: 0.5 })
  PX.filmGrain(canvas, seed + 91, o.grain ?? 0.042, 1)
  PX.physicalImperfections(canvas, seed + 3, { dust: o.dust ?? 7, scratches: 0, smudges: 0 })
}

/* ------------------------------------------------------------- rendering */

let base = null
function renderFrame({ camera, lights, withFigure, seed, gradeOpts }) {
  base ??= buildBase()
  const { scene, fixtures, figure } = base
  const { m, bounce } = lights
  const level = m.reduce((a, b) => a + b, 0) / m.length
  const amb = clamp(0.3 + 0.7 * level, 0.3, 1)
  fixtures.forEach((fx, i) => { fx.emissive = base.baseEmissive[i] * m[i] + 0.012 })
  const lightList = base.baseLights.map((l, i) => ({ ...l, intensity: l.intensity * m[i] }))
  lightList.push({ position: v3(camera.position.x, camera.position.y + 1.0, camera.position.z + 0.25), intensity: bounce, range: 5.5, color: [0.95, 0.96, 1.0] })
  const frameScene = {
    ...scene,
    faces: withFigure ? scene.faces.concat(figure) : scene.faces,
    lights: lightList,
    ambient: base.baseAmbient.map(v => v * amb),
    ambientSky: base.baseAmbient.map((v, i) => v * [1.4, 1.4, 1.6][i] * amb),
    fog: base.baseFog.map(v => v * clamp(amb * 1.1, 0.15, 1)),
  }
  const canvas = PX.createCanvas(WIDTH, HEIGHT)
  renderScene(frameScene, makeCamera(camera), canvas)
  grade(canvas, seed, gradeOpts)
  return sharp(PX.toRaw(canvas), { raw: { width: WIDTH, height: HEIGHT, channels: 3 } }).jpeg({ quality: 90 }).toBuffer()
}

/* --------------------------------------------------------------- details */

const DETAILS = [
  { id: 'ceiling_fixture', desc: 'Ceiling light fixture close up, looking up at the troffer and its housing.', cam: lookAt([0.2, 1.6, 5.8], [-0.2, 2.8, 7.0], 1800), grade: { exposure: 0.9, blur: 1.2 } },
  { id: 'door_frame_edge', desc: 'Door slab / frame top corner at the left wall, oblique from across the corridor.', cam: lookAt([0.4, 1.85, 8.2], [-1.12, 2.1, 9.6], 1300), grade: { exposure: 0.8 } },
  { id: 'door_handle', desc: 'Macro of a lever handle on a closed door, shallow focus.', cam: lookAt([-0.45, 1.16, 9.85], [-1.1, 1.0, 10.4], 1500), grade: { exposure: 0.45, blur: 3.2, focusSpread: 0.12 } },
  { id: 'skirting_receding', desc: 'Skirting and dado line receding along the left wall from a low position.', cam: lookAt([0.9, 0.22, 3.0], [-1.3, 0.14, 14.0], 1000), grade: { exposure: 0.8 } },
  { id: 'far_door', desc: 'The door at the far end of the corridor, long lens, compressed fixtures.', cam: lookAt([0.0, 1.5, 17.0], [0.0, 1.25, 26.0], 2800), grade: { exposure: 0.9, blur: 1.0 } },
  { id: 'box_corner', desc: 'Corner of the cardboard box in the foreground, low angle.', cam: lookAt([0.2, 0.55, 5.2], [0.8, 0.3, 6.05], 1400), grade: { exposure: 0.7, blur: 2.4, focusSpread: 0.2 } },
  { id: 'wall_block_seam', desc: 'Painted block courses and mortar seams with the green dado band, close on the left wall.', cam: lookAt([-0.5, 1.2, 8.2], [-1.3, 1.05, 8.9], 1700), grade: { exposure: 0.8, blur: 1.4 } },
  { id: 'room_plate', desc: 'Room-number plate (211) beside the first door, frontal.', cam: lookAt([-0.25, 1.62, 4.87], [-1.29, 1.62, 4.87], 2200), grade: { exposure: 0.6, blur: 1.6 } },
  { id: 'wide_mouth', desc: 'Extreme wide from the corridor mouth.', cam: { position: v3(0.0, 1.45, 0.05), yaw: 0, pitch: -0.01, focal: 420 * FOCAL_SCALE, roll: 0 }, grade: { exposure: 1.0, barrel: 0.08 } },
  { id: 'floor_level', desc: 'Low-angle floor-level shot straight down the terrazzo.', cam: { position: v3(0.1, 0.1, 1.2), yaw: 0, pitch: 0.025, focal: 900 * FOCAL_SCALE, roll: 0 }, grade: { exposure: 1.0, blur: 2.2, focusSpread: 0.25 } },
  { id: 'ceiling_receding', desc: 'Looking along the ceiling grid, fixtures converging.', cam: { position: v3(0, 1.8, 1.5), yaw: 0.02, pitch: 0.55, focal: 800 * FOCAL_SCALE, roll: 0 }, grade: { exposure: 1.0 } },
  { id: 'floor_macro', desc: 'Terrazzo floor, grout lines and chips, straight down.', cam: lookAt([0.2, 1.1, 8.0], [0.25, 0.0, 8.5], 1500), grade: { exposure: 0.8, blur: 2.0, focusSpread: 0.2 } },
  { id: 'open_door_edge', desc: 'Edge of an open door slab on the right wall.', cam: lookAt([-0.6, 1.1, 10.6], [1.12, 1.2, 12.6], 1400), grade: { exposure: 0.8 } },
  { id: 'far_floor_empty', desc: 'Low view of the empty floor near the end of the corridor.', cam: lookAt([0.1, 0.45, 19.0], [-0.1, 0.1, 24.0], 1100), grade: { exposure: 0.9, blur: 1.8 } },
  { id: 'failing_fixtures_tele', desc: 'Long lens up the ceiling: one fixture out, one flickering low, the rest on.', cam: lookAt([0, 1.2, 3.0], [0, 2.3, 14.0], 2400), grade: { exposure: 1.1, blur: 1.2 }, lights: { m: [1, 1, 0.3, 0, 1, 1], bounce: 0.1 } },
  { id: 'door_and_handle_medium', desc: 'Medium shot of a closed door with handle, dado and skirting, mid-corridor.', cam: lookAt([0.6, 1.0, 13.5], [-1.3, 1.0, 16.5], 1000), grade: { exposure: 0.9 } },
]

/* ----------------------------------------------------------------- jobs */

const SEQS = {
  corridor_a: { frames: 135, lights: lightsCorridorA, figure: false, desc: 'POV dolly forward down the east corridor (LOC-C214), walking pace, subtle handheld bob. The unstable tube flickers mid-shot (fixture 3) and again on the last frames. No person. Ends about 1/3 of the way down.' },
  corridor_b: { frames: 60, lights: lightsCorridorB, figure: false, desc: 'Continuation of corridor_a, slowing, more bob. Fixtures 3 and 4 dim and drop out, the rest sag toward darkness. Ends about 40% of the way down.' },
  corridor_figure: { frames: 36, lights: lightsFigure, figure: true, desc: 'Same framing as the end of corridor_b. Dark corridor; light stutters back for about 0.4 s revealing the silhouette figure from photo_nx037_b_02 at the far end (z 23.9, ~12.8 m from camera, 1.76 m), then dark again.' },
}

function writeMeta(name, extra) {
  writeFileSync(join(OUT, name, 'meta.json'), JSON.stringify({ name, fps: FPS, width: WIDTH, height: HEIGHT, location: 'LOC-C214 EAST CORRIDOR', jpegQuality: 90, ...extra }, null, 2) + '\n')
}

const pad = n => String(n).padStart(4, '0')

async function runWorker(name, start, end) {
  if (name === 'corridor_details') {
    for (let i = start; i < end; i++) {
      const d = DETAILS[i]
      const buf = await renderFrame({
        camera: d.cam,
        lights: d.lights ?? { m: [1, 1, 1, 0, 1, 1], bounce: 0.06 },
        withFigure: false,
        seed: 5000 + i * 7,
        gradeOpts: d.grade,
      })
      writeFileSync(join(OUT, name, `detail_${String(i + 1).padStart(2, '0')}.jpg`), buf)
    }
    return
  }
  const seq = SEQS[name]
  for (let f = start; f < end; f++) {
    const buf = await renderFrame({
      camera: walkCamera(name, f),
      lights: seq.lights(f),
      withFigure: seq.figure,
      seed: 1000 + (SEQ_OFFSET[name] + f) * 3,
      gradeOpts: {},
    })
    writeFileSync(join(OUT, name, `${pad(f + 1)}.jpg`), buf)
  }
}

if (argv[0] === '--worker') {
  const [, name, s, e] = argv
  mkdirSync(join(OUT, name), { recursive: true })
  await runWorker(name, Number(s), Number(e))
  process.exit(0)
}

// ---- coordinator
const only = (argVal('--only', '') || '').split(',').filter(Boolean)
const names = ['corridor_a', 'corridor_b', 'corridor_figure', 'corridor_details'].filter(n => only.length === 0 || only.includes(n))
const jobs = Number(argVal('--jobs', Math.max(1, Math.min(8, cpus().length))))
const t0 = Date.now()

function runChild(name, s, e) {
  const passthrough = ['--width', String(WIDTH), '--height', String(HEIGHT), '--out', OUT]
  return new Promise((res, rej) => {
    const p = spawn(process.execPath, [fileURLToPath(import.meta.url), '--worker', name, String(s), String(e), ...passthrough], { stdio: 'inherit' })
    p.on('exit', c => (c === 0 ? res() : rej(new Error(`worker ${name} ${s}-${e} exited ${c}`))))
  })
}

for (const name of names) {
  const total = name === 'corridor_details' ? DETAILS.length : SEQS[name].frames
  const dir = join(OUT, name)
  if (argv.includes('--clean') && existsSync(dir)) rmSync(dir, { recursive: true })
  mkdirSync(dir, { recursive: true })
  // Interleaved chunks keep the workers balanced.
  const chunk = Math.ceil(total / (jobs * 3))
  const queue = []
  for (let s = 0; s < total; s += chunk) queue.push([s, Math.min(total, s + chunk)])
  const lane = async () => { while (queue.length) { const [s, e] = queue.shift(); await runChild(name, s, e) } }
  const ts = Date.now()
  await Promise.all(Array.from({ length: jobs }, lane))
  if (name === 'corridor_details') {
    writeMeta(name, {
      count: DETAILS.length,
      description: 'Still inserts from the 3D corridor for fast montage; varied focal length, position and height.',
      stills: DETAILS.map((d, i) => ({ file: `detail_${String(i + 1).padStart(2, '0')}.jpg`, id: d.id, description: d.desc, focalPx: Math.round(d.cam.focal / FOCAL_SCALE) })),
    })
  } else {
    writeMeta(name, { frames: SEQS[name].frames, durationSeconds: SEQS[name].frames / FPS, pattern: '%04d.jpg', description: SEQS[name].desc })
  }
  console.log(`${name}: ${total} frames in ${((Date.now() - ts) / 1000).toFixed(1)}s`)
}
console.log(`done in ${((Date.now() - t0) / 1000).toFixed(1)}s at ${WIDTH}x${HEIGHT}`)
