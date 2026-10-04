import { Easing, interpolate, random } from 'remotion'

export const easeInOut = Easing.inOut(Easing.cubic)
export const easeOut = Easing.out(Easing.cubic)
export const clamp01 = (x: number) => Math.min(1, Math.max(0, x))

/** 0..1 progress of `frame` between a and b, eased. */
export const prog = (frame: number, a: number, b: number, ease: (t: number) => number = easeInOut) => ease(clamp01((frame - a) / Math.max(1, b - a)))

/** Smooth, deterministic hand-held drift: a few incommensurate sines with seeded phases. amount in px / degrees. */
export function handheld(frame: number, seed: string, amount: number) {
  const ph = (k: string) => random(`${seed}-${k}`) * Math.PI * 2
  const f = frame / 30
  const x = Math.sin(f * 1.7 + ph('x1')) * 0.6 + Math.sin(f * 4.3 + ph('x2')) * 0.25 + Math.sin(f * 9.1 + ph('x3')) * 0.08
  const y = Math.sin(f * 1.3 + ph('y1')) * 0.6 + Math.sin(f * 3.7 + ph('y2')) * 0.28 + Math.sin(f * 8.2 + ph('y3')) * 0.07
  const r = Math.sin(f * 1.1 + ph('r1')) * 0.7 + Math.sin(f * 3.1 + ph('r2')) * 0.2
  return { x: x * amount, y: y * amount, rot: r * amount * 0.05 }
}

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t
export { interpolate }
