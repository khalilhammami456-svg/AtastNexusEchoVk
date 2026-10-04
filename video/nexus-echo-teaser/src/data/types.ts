import timeline from './timeline.json'

export type Grade = 'cctv' | 'cctvDark' | 'cctvLift' | 'photo' | 'paper' | 'paperBlur'
export interface Cam { scale: number; x: number; y: number }
export interface TextItem { t: number; str: string; pos: 'tl' | 'bl'; typed?: boolean }
export interface Highlight { t: number; dur: number; x: number; y: number; w: number; h: number }
export interface Tear { t: number; dur: number; amount: number }

export interface ImageSpec {
  src: string
  fit: 'cover' | 'object'
  objectHeight?: number
  from: Cam
  to: Cam
  grade: Grade
  crt?: number
  grain?: number
  tears?: Tear[]
  tear?: boolean
  text?: TextItem[]
  stamp?: { t: number; x: number; y: number; rot: number }
  highlight?: Highlight
  caption?: { t: number; str: string; dur: number }
  fadeIn?: number
}

export type Shot =
  | ({ id: string; kind: 'image'; start: number; dur: number; purpose: string } & ImageSpec)
  | { id: string; kind: 'phone'; start: number; dur: number; purpose: string; src: string; vibrate: [number, number]; wake: number; from: Cam; to: Cam }
  | { id: string; kind: 'montage'; start: number; dur: number; purpose: string; cuts: Array<Omit<ImageSpec, 'tears'> & { dur: number }> }
  | { id: string; kind: 'reveal'; start: number; dur: number; purpose: string; a: string; b: string; swapAt: number; fit: 'object'; objectHeight: number; fromA: Cam; toA: Cam; fromB: Cam; toB: Cam }
  | { id: string; kind: 'black'; start: number; dur: number; purpose: string }
  | { id: string; kind: 'title'; start: number; dur: number; purpose: string }

export const TIMELINE = timeline as unknown as {
  fps: number
  width: number
  height: number
  durationSeconds: number
  centralQuestion: string
  shots: Shot[]
}

export const W = TIMELINE.width
export const H = TIMELINE.height
export const sec = (s: number) => Math.round(s * TIMELINE.fps)
