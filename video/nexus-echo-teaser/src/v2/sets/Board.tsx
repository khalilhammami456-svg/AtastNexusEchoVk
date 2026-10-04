import React from 'react'
import { AbsoluteFill, Img, staticFile, useCurrentFrame } from 'remotion'
import { H, W, sec } from '../data'
import { easeInOut, easeOut, handheld, lerp, prog } from '../motion'

const BW = 3400
const BH = 2000
const MONO = "'Plex Mono', monospace"

interface Card { key: string; x: number; y: number; w: number; h: number; rot: number; src?: string; back?: boolean; pin: { x: number; y: number }; pinAt: number }

const CARDS: Card[] = [
  { key: 'photo', x: 760, y: 560, w: 560, h: 445, rot: -4, src: 'ev/photo_nx037_b_01.jpg', pin: { x: 280, y: 18 }, pinAt: 0.3 },
  { key: 'cam', x: 1650, y: 430, w: 560, h: 458, rot: 3, src: 'ev/surv_cam07_031711.jpg', pin: { x: 280, y: 18 }, pinAt: 1.4 },
  { key: 'log', x: 2500, y: 520, w: 470, h: 608, rot: -2, src: 'ev/doc_nx037_surveillance_log.jpg', pin: { x: 235, y: 18 }, pinAt: 2.5 },
  { key: 'note', x: 1100, y: 1130, w: 430, h: 551, rot: 5, src: 'ev/note_observer02_02.jpg', pin: { x: 215, y: 18 }, pinAt: 3.1 },
  { key: 'frag', x: 2050, y: 1180, w: 520, h: 252, rot: -6, src: 'ev/frag_nx037_c_02.jpg', pin: { x: 260, y: 14 }, pinAt: 3.1 },
  { key: 'back', x: 2700, y: 1260, w: 460, h: 366, rot: 4, back: true, pin: { x: 230, y: 16 }, pinAt: 2.5 },
]

const LINKS: Array<{ a: string; b: string; at: number }> = [
  { a: 'photo', b: 'cam', at: 0.7 },
  { a: 'cam', b: 'log', at: 1.8 },
  { a: 'log', b: 'back', at: 2.9 },
]

const pinPos = (c: Card) => ({ x: c.x + c.pin.x, y: c.y + c.pin.y })

/** B09: a pinboard seen from above. Pins strike, red strings are pulled between them one by one. */
export const Board: React.FC<{ total: number; frameOffset?: number; fixed?: { cx: number; cy: number; sc: number } }> = ({ total, frameOffset = 0, fixed }) => {
  const frame = useCurrentFrame() + frameOffset
  const p = prog(frame, 0, total, easeInOut)
  const cx = fixed ? fixed.cx : lerp(1050, 2050, p)
  const cy = fixed ? fixed.cy : lerp(780, 880, p)
  const sc = fixed ? fixed.sc : lerp(1.0, 1.22, p)
  const hh = handheld(frame, 'board', 5)
  const byKey = Object.fromEntries(CARDS.map((c) => [c.key, c]))
  const tagAt = sec(3.0)
  return (
    <AbsoluteFill style={{ background: '#050607', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', left: 0, top: 0, width: BW, height: BH, transformOrigin: `${cx}px ${cy}px`, transform: `translate(${W / 2 - cx + hh.x}px, ${H / 2 - cy + hh.y}px) scale(${sc}) rotate(${hh.rot}deg)` }}>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(120deg,#0e1318,#0a0e12)' }} />
        <div style={{ position: 'absolute', inset: 0, backgroundImage: `url(${staticFile('img/noise.png')})`, backgroundSize: '420px', mixBlendMode: 'overlay', opacity: 0.5 }} />
        {CARDS.map((c) => (
          <div key={c.key} style={{ position: 'absolute', left: c.x, top: c.y, width: c.w, height: c.h, transform: `rotate(${c.rot}deg)`, boxShadow: '14px 22px 26px rgba(0,0,0,0.6)' }}>
            {c.back ? (
              <div style={{ width: '100%', height: '100%', background: 'linear-gradient(160deg,#d3cdb8,#b9b29a)', position: 'relative' }}>
                <div style={{ position: 'absolute', left: '12%', top: '30%', fontFamily: "'Courier Prime', monospace", fontSize: 30, letterSpacing: 5, color: 'rgba(60,52,38,0.7)' }}>FACE DOWN</div>
                <div style={{ position: 'absolute', left: '14%', top: '58%', width: '72%', height: 54, background: 'rgba(214,204,168,0.95)', boxShadow: '0 2px 5px rgba(0,0,0,0.5)', fontFamily: MONO, fontWeight: 500, fontSize: 28, letterSpacing: 6, color: '#7e211d', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: frame >= tagAt ? 1 : 0 }}>UNRESOLVED</div>
              </div>
            ) : (
              <Img src={staticFile(c.src as string)} style={{ width: '100%', height: '100%', display: 'block', filter: 'brightness(0.88) contrast(1.05)' }} />
            )}
          </div>
        ))}
        {/* strings */}
        <svg style={{ position: 'absolute', left: 0, top: 0, width: BW, height: BH, overflow: 'visible' }}>
          {LINKS.map((l) => {
            const a = pinPos(byKey[l.a])
            const b = pinPos(byKey[l.b])
            const t = prog(frame, sec(l.at), sec(l.at + 0.45), easeOut)
            if (t <= 0) return null
            const mx = (a.x + b.x) / 2
            const my = (a.y + b.y) / 2 + 60
            const ex = lerp(a.x, b.x, t)
            const ey = lerp(a.y, b.y, t) + Math.sin(t * Math.PI) * 18
            return (
              <g key={l.a + l.b}>
                <path d={`M ${a.x} ${a.y} Q ${lerp(a.x, mx, t)} ${lerp(a.y, my, t)} ${ex} ${ey}`} fill="none" stroke="rgba(0,0,0,0.5)" strokeWidth="9" transform="translate(6 10)" />
                <path d={`M ${a.x} ${a.y} Q ${lerp(a.x, mx, t)} ${lerp(a.y, my, t)} ${ex} ${ey}`} fill="none" stroke="#a82c26" strokeWidth="5" strokeLinecap="round" />
              </g>
            )
          })}
        </svg>
        {/* pins */}
        {CARDS.map((c) => {
          const pp = pinPos(c)
          const t = prog(frame, sec(c.pinAt), sec(c.pinAt) + 5, easeOut)
          if (frame < sec(c.pinAt)) return null
          return (
            <div key={`pin-${c.key}`} style={{ position: 'absolute', left: pp.x - 16, top: pp.y - 16, width: 32, height: 32, borderRadius: 32, background: 'radial-gradient(circle at 35% 30%, #e86a60, #7e1d18 70%)', transform: `scale(${lerp(1.9, 1, t)})`, boxShadow: `${lerp(26, 5, t)}px ${lerp(34, 8, t)}px ${lerp(26, 8, t)}px rgba(0,0,0,0.7)` }} />
          )
        })}
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 1500px 1000px at 1900px 800px, rgba(255,226,170,0.14) 0%, rgba(255,226,170,0.04) 45%, rgba(0,0,0,0) 75%)', mixBlendMode: 'screen' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 1800px 1200px at 1900px 800px, rgba(0,0,0,0) 25%, rgba(0,0,0,0.78) 90%)' }} />
      </div>
    </AbsoluteFill>
  )
}
