import React from 'react'
import { AbsoluteFill, Img, random, staticFile, useCurrentFrame } from 'remotion'
import { Pen } from './props'
import { H, W, sec } from '../data'
import { easeInOut, handheld, lerp, prog } from '../motion'

const IW = 780
const IH = 1000
const SRC = 'ev/note_observer02_02.jpg'

/** x-range and y-range (fractions of the sheet) of the two lines the pen writes, measured from the image. */
const L7 = { y0: 0.349, y1: 0.376, x0: 0.12, x1: 0.345 }
const L8 = { y0: 0.379, y1: 0.402, x0: 0.12, x1: 0.222 }

const Sheet: React.FC<{ reveal7: number; reveal8: number }> = ({ reveal7, reveal8 }) => (
  <div style={{ position: 'absolute', left: 0, top: 0, width: IW, height: IH }}>
    <Img src={staticFile(SRC)} style={{ position: 'absolute', left: 0, top: 0, width: IW, height: IH }} />
    {/* erase the two unwritten lines with ruled paper copied from a text-free strip (period 56 px) */}
    <div style={{ position: 'absolute', left: 0, top: 345, width: IW, height: 83, overflow: 'hidden' }}>
      <Img src={staticFile(SRC)} style={{ position: 'absolute', left: 0, top: -(345 + 112), width: IW, height: IH }} />
    </div>
    {/* the ink that exists so far */}
    {[{ r: L7, v: reveal7 }, { r: L8, v: reveal8 }].map(({ r, v }, i) => (
      <div key={i} style={{ position: 'absolute', left: IW * r.x0 - 6, top: IH * r.y0, width: Math.max(0, (IW * (r.x1 - r.x0) + 12) * v), height: IH * (r.y1 - r.y0), overflow: 'hidden' }}>
        <Img src={staticFile(SRC)} style={{ position: 'absolute', left: -(IW * r.x0 - 6), top: -IH * r.y0, width: IW, height: IH }} />
      </div>
    ))}
  </div>
)

/** B11: macro of a pen writing the observer's note. The line stops dead at "03:17 -". */
export const NotePen: React.FC<{ total: number }> = ({ total }) => {
  const frame = useCurrentFrame()
  void total
  const r7 = prog(frame, 0, sec(0.95), (t) => t)
  const r8 = prog(frame, sec(1.05), sec(1.55), (t) => t)
  const writing = frame < sec(1.6)
  const wob = writing ? random(`pen-${frame}`) - 0.5 : 0
  // pen tip in sheet coordinates
  const onL8 = frame >= sec(1.0)
  const tipX = onL8 ? lerp(IW * L8.x0, IW * L8.x1, r8) : lerp(IW * L7.x0, IW * L7.x1, r7)
  const tipY = (onL8 ? (L8.y0 + L8.y1) / 2 : (L7.y0 + L7.y1) / 2) * IH + 8 + wob * 2.5
  const hh = handheld(frame, 'notepen', 7)
  const p = prog(frame, 0, sec(2.4), easeInOut)
  const sc = lerp(3.4, 3.9, p)
  // camera: sheet point (fx, fy) at screen centre
  const fx = lerp(IW * 0.22, IW * 0.18, p)
  const fy = lerp(IH * 0.352, IH * 0.372, p)
  const tf = `translate(${W / 2 - fx + hh.x}px, ${H / 2 - fy + hh.y}px) scale(${sc}) rotate(${hh.rot - 2}deg)`
  const penScene = (blur: number) => (
    <div style={{ position: 'absolute', left: 0, top: 0, width: IW, height: IH, transformOrigin: `${fx}px ${fy}px`, transform: tf, filter: blur ? `blur(${blur}px)` : undefined }}>
      <Sheet reveal7={r7} reveal8={r8} />
      <div style={{ position: 'absolute', left: tipX - 15, top: tipY - 98 - 14, transform: 'rotate(-28deg)', filter: 'drop-shadow(8px 14px 10px rgba(0,0,0,0.6))' }}>
        <Pen w={400} />
      </div>
    </div>
  )
  return (
    <AbsoluteFill style={{ background: '#070605', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>{penScene(0)}</div>
      {/* depth of field: a blurred copy of the same scene, kept off the centre */}
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', filter: 'blur(14px)', WebkitMaskImage: 'radial-gradient(ellipse 34% 40% at 50% 52%, transparent 40%, black 100%)', maskImage: 'radial-gradient(ellipse 34% 40% at 50% 52%, transparent 40%, black 100%)' }}>
        {penScene(0)}
      </div>
      <AbsoluteFill style={{ background: 'radial-gradient(ellipse at 50% 55%, rgba(255,226,170,0.12) 0%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.85) 100%)', mixBlendMode: 'multiply' }} />
      <AbsoluteFill style={{ background: 'radial-gradient(ellipse at 50% 55%, rgba(0,0,0,0) 40%, rgba(0,0,0,0.7) 100%)' }} />
    </AbsoluteFill>
  )
}
