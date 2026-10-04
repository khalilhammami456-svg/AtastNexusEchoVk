import React from 'react'
import { AbsoluteFill, Img, random, staticFile, useCurrentFrame } from 'remotion'
import { Cassette, Dictaphone, Folder, Pen } from './props'
import { H, W, sec } from '../data'
import { easeInOut, easeOut, lerp, prog, handheld } from '../motion'

/**
 * A lamp-lit desk seen from above (or tilted). Every object has a height; the camera slides over it, the
 * higher objects move more (parallax) and the focal plane racks between heights (depth of field).
 */
export interface Obj {
  key: string
  x: number
  y: number
  rot: number
  /** 0 = flat on the desk, 1 = tall (cassette, lamp, pen) */
  h: number
  node: React.ReactNode
  /** seconds (local) at which it arrives, with the offset it arrives from */
  arrive?: { at: number; dur: number; from: { x: number; y: number; rot: number } }
}

interface DeskProps {
  objs: Obj[]
  cam: { x0: number; x1: number; y0: number; y1: number; s0: number; s1: number }
  total: number
  tilt0: number
  tilt1: number
  focus0: number
  focus1: number
  lamp: { x: number; y: number }
  /** extra overlay rendered in desk coordinates, above the objects */
  overlay?: React.ReactNode
  /** white flash frames [start,end) */
  flash?: [number, number]
}

const DESK_W = 3600
const DESK_H = 2200

export const Desk: React.FC<DeskProps> = ({ objs, cam, total, tilt0, tilt1, focus0, focus1, lamp, overlay, flash }) => {
  const frame = useCurrentFrame()
  const p = prog(frame, 0, total, easeInOut)
  const cx = lerp(cam.x0, cam.x1, p)
  const cy = lerp(cam.y0, cam.y1, p)
  const s = lerp(cam.s0, cam.s1, p)
  const tilt = lerp(tilt0, tilt1, p)
  const focus = lerp(focus0, focus1, p)
  const hh = handheld(frame, 'desk', 5)
  const dx = cx - cam.x0
  const dy = cy - cam.y0
  const flick = 0.93 + random(`lamp-${frame}`) * 0.07
  const fl = flash && frame >= flash[0] && frame < flash[1] ? 1 - (frame - flash[0]) / (flash[1] - flash[0]) : 0

  return (
    <AbsoluteFill style={{ background: '#050403', overflow: 'hidden', perspective: 1700, perspectiveOrigin: '50% 45%' }}>
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          width: DESK_W,
          height: DESK_H,
          transformOrigin: `${cx}px ${cy}px`,
          transform: `translate(${W / 2 - cx + hh.x}px, ${H / 2 - cy + hh.y}px) rotateX(${tilt}deg) scale(${s}) rotateZ(${hh.rot}deg)`,
        }}
      >
        {/* the desk top */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(98deg,#1a140f 0%,#231a12 40%,#17110c 100%)' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'repeating-linear-gradient(98deg, rgba(0,0,0,0) 0, rgba(0,0,0,0) 38px, rgba(0,0,0,0.18) 40px, rgba(255,255,255,0.02) 43px)', opacity: 0.8 }} />
        <div style={{ position: 'absolute', inset: 0, backgroundImage: `url(${staticFile('img/noise.png')})`, backgroundSize: '512px', mixBlendMode: 'multiply', opacity: 0.35 }} />
        {/* objects */}
        {objs.map((o) => {
          const a = o.arrive
          const ap = a ? prog(frame, sec(a.at), sec(a.at + a.dur), easeOut) : 1
          if (a && frame < sec(a.at)) return null
          const ox = a ? lerp(o.x + a.from.x, o.x, ap) : o.x
          const oy = a ? lerp(o.y + a.from.y, o.y, ap) : o.y
          const orot = a ? lerp(o.rot + a.from.rot, o.rot, ap) : o.rot
          const lift = a ? 1 - ap : 0
          const par = 0.28 * o.h
          const blur = Math.abs(focus - o.h) * 14
          return (
            <div
              key={o.key}
              style={{
                position: 'absolute',
                left: ox - dx * par,
                top: oy - dy * par,
                transform: `rotate(${orot}deg) scale(${1 + lift * 0.06 + o.h * 0.05})`,
                filter: `blur(${blur.toFixed(2)}px) drop-shadow(${(8 + lift * 40 + o.h * 18).toFixed(0)}px ${(12 + lift * 50 + o.h * 24).toFixed(0)}px ${(14 + lift * 40 + o.h * 18).toFixed(0)}px rgba(0,0,0,0.65))`,
              }}
            >
              {o.node}
            </div>
          )
        })}
        {overlay}
        {/* the lamp: pool of warm light, everything else falls into dark */}
        <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(ellipse 900px 700px at ${lamp.x}px ${lamp.y}px, rgba(255,226,170,${0.2 * flick}) 0%, rgba(255,226,170,0.06) 45%, rgba(0,0,0,0) 75%)`, mixBlendMode: 'screen' }} />
        <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(ellipse 1500px 1100px at ${lamp.x}px ${lamp.y}px, rgba(0,0,0,0) 20%, rgba(0,0,0,0.82) 85%)` }} />
      </div>
      <AbsoluteFill style={{ background: 'radial-gradient(ellipse at center, rgba(0,0,0,0) 55%, rgba(0,0,0,0.6) 100%)' }} />
      {fl > 0 && <AbsoluteFill style={{ background: `rgba(255,255,255,${0.85 * fl})` }} />}
    </AbsoluteFill>
  )
}

const ImgBox: React.FC<{ src: string; w: number; h: number }> = ({ src, w, h }) => (
  <Img src={staticFile(src)} style={{ width: w, height: h, display: 'block' }} />
)

/** B03: the world. Top-down, lateral track, rack focus from the cassette to the folder tab. */
export const DeskWorld: React.FC<{ total: number }> = ({ total }) => {
  const objs: Obj[] = [
    { key: 'sheet1', x: 2150, y: 700, rot: -7, h: 0.05, node: <ImgBox src="ev/doc_nx037_surveillance_log.jpg" w={520} h={673} /> },
    { key: 'photo', x: 1180, y: 1180, rot: 9, h: 0.08, node: <ImgBox src="ev/photo_nx037_b_01.jpg" w={560} h={445} /> },
    { key: 'folder', x: 1480, y: 640, rot: -3, h: 0.3, node: <Folder w={820} /> },
    { key: 'dict', x: 560, y: 900, rot: 14, h: 0.85, node: <Dictaphone w={520} /> },
    { key: 'cass', x: 1040, y: 560, rot: -22, h: 0.7, node: <Cassette w={300} /> },
    { key: 'pen', x: 1750, y: 1330, rot: 24, h: 0.6, node: <Pen w={420} /> },
  ]
  return (
    <Desk
      objs={objs}
      total={total}
      cam={{ x0: 640, x1: 1560, y0: 880, y1: 780, s0: 1.0, s1: 1.18 }}
      tilt0={8}
      tilt1={8}
      focus0={0.8}
      focus1={0.3}
      lamp={{ x: 1500, y: 760 }}
    />
  )
}

/** B05: evidence arrives. Tilted desk, a photograph and a log slide in, a pen underlines, camera pulls macro. */
export const DeskEvidence: React.FC<{ total: number }> = ({ total }) => {
  const frame = useCurrentFrame()
  // D-08 line (19.4% down, 13-49% across) on a 520x673 sheet at (1800, 760)
  const sx = 1800
  const sy = 760
  const lineY = sy + 673 * 0.209
  const x0 = sx + 520 * 0.125
  const x1 = sx + 520 * 0.5
  const penP = prog(frame, sec(3.9), sec(5.5), easeInOut)
  const penX = lerp(x0 - 20, x1, penP)
  const objs: Obj[] = [
    { key: 'folder', x: 600, y: 520, rot: -5, h: 0.3, node: <Folder w={780} /> },
    { key: 'cass', x: 1060, y: 1440, rot: 18, h: 0.7, node: <Cassette w={300} /> },
    { key: 'photo', x: 1060, y: 780, rot: -4, h: 0.06, node: <ImgBox src="ev/photo_nx037_b_01.jpg" w={600} h={477} />, arrive: { at: 0.2, dur: 0.5, from: { x: 900, y: -120, rot: 14 } } },
    { key: 'sheet', x: sx, y: sy, rot: 0, h: 0, node: <ImgBox src="ev/doc_nx037_surveillance_log.jpg" w={520} h={673} />, arrive: { at: 2.5, dur: 0.55, from: { x: 80, y: 700, rot: -10 } } },
    { key: 'pen', x: penX + 185 - 210, y: lineY - 98 - 15, rot: -28, h: 0.02, node: <Pen w={420} />, arrive: { at: 3.5, dur: 0.4, from: { x: 260, y: -200, rot: 10 } } },
  ]
  const overlay = (
    <svg style={{ position: 'absolute', left: 0, top: 0, width: 3600, height: 2200, overflow: 'visible' }}>
      <line x1={x0} y1={lineY + 12} x2={penX} y2={lineY + 12 + Math.sin(penX * 0.05) * 1.2} stroke="rgba(150,34,28,0.85)" strokeWidth="4" strokeLinecap="round" />
    </svg>
  )
  return (
    <Desk
      objs={objs}
      overlay={overlay}
      total={total}
      cam={{ x0: 1300, x1: 1960, y0: 1000, y1: 930, s0: 1.0, s1: 2.5 }}
      tilt0={34}
      tilt1={14}
      focus0={0.4}
      focus1={0.05}
      lamp={{ x: 1500, y: 800 }}
      flash={[0, 4]}
    />
  )
}
