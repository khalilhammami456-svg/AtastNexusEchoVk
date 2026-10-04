import React from 'react'
import { Img, random, staticFile } from 'remotion'
import { prog, easeOut, clamp01 } from '../motion'

export type CrtState = 'off' | 'on' | 'nosignal'

export interface CrtProps {
  x: number
  y: number
  w: number
  h: number
  src: string
  label: string
  /** frame (local to the shot) at which the tube powers on; Infinity = never */
  wakeAt: number
  /** frame at which the signal drops; Infinity = never */
  dieAt?: number
  frame: number
  seed: string
  /** replace the burned-in stamp with a live one */
  stamp?: string
  /** overall brightness of the picture (0..1) */
  gain?: number
  /** dropout burst: frames [start, end) */
  dropout?: [number, number]
  filter?: string
}

const GREEN = 'rgba(150,205,175,'

/** A CRT monitor in a rack: bezel, glass, power-on collapse, signal loss, burn-in stamp. */
export const CrtMonitor: React.FC<CrtProps> = (p) => {
  const { x, y, w, h, frame } = p
  const dieAt = p.dieAt ?? Infinity
  const bez = Math.round(Math.min(w, h) * 0.075)
  const sw = w - bez * 2
  const sh = h - bez * 2 - Math.round(h * 0.07)
  const powered = frame >= p.wakeAt
  const wakeP = prog(frame, p.wakeAt, p.wakeAt + 10, easeOut)
  const flash = powered ? Math.max(0, 1 - (frame - p.wakeAt) / 9) : 0
  const dead = frame >= dieAt
  const deadP = clamp01((frame - dieAt) / 8)
  const noise = random(`${p.seed}-n-${frame}`)
  const nx = Math.floor(noise * 512)
  const ny = Math.floor(random(`${p.seed}-m-${frame}`) * 512)
  const gain = p.gain ?? 1
  const inDrop = p.dropout && frame >= p.dropout[0] && frame < p.dropout[1]
  const flicker = 0.94 + random(`${p.seed}-f-${frame}`) * 0.06

  // screen content
  const lineH = powered ? Math.max(3, sh * wakeP) : 0
  const lineW = powered ? sw * Math.min(1, 0.15 + wakeP * 1.2) : 0
  const showPicture = powered && wakeP > 0.35 && !dead
  const showStatic = (powered && dead) || inDrop
  const glow = powered ? (dead ? 0.18 * (1 - deadP) + 0.1 : 0.85 * gain) : 0

  return (
    <div style={{ position: 'absolute', left: x, top: y, width: w, height: h }}>
      {/* light the monitor throws on whatever is around it */}
      <div style={{ position: 'absolute', left: -w * 0.5, top: -h * 0.4, width: w * 2, height: h * 1.9, background: `radial-gradient(ellipse at 50% 45%, ${GREEN}${0.28 * glow}) 0%, ${GREEN}${0.1 * glow}) 38%, rgba(0,0,0,0) 70%)`, mixBlendMode: 'screen', pointerEvents: 'none' }} />
      {/* case */}
      <div style={{ position: 'absolute', inset: 0, borderRadius: 16, background: 'linear-gradient(160deg,#25272a 0%,#16181a 45%,#0c0d0e 100%)', boxShadow: '0 22px 50px rgba(0,0,0,0.85), inset 0 1px 0 rgba(255,255,255,0.08), inset 0 -3px 8px rgba(0,0,0,0.6)' }} />
      {/* glass */}
      <div style={{ position: 'absolute', left: bez, top: bez, width: sw, height: sh, borderRadius: Math.round(sw * 0.045), overflow: 'hidden', background: '#020303', boxShadow: 'inset 0 0 40px rgba(0,0,0,0.9)' }}>
        {showPicture && (
          <Img
            src={staticFile(p.src)}
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', filter: `${p.filter ?? 'contrast(1.12) brightness(0.92)'} brightness(${(0.55 + 0.45 * flicker) * gain * (1 + flash * 1.4)})` }}
          />
        )}
        {showPicture && p.stamp && (
          <div style={{ position: 'absolute', left: '2.5%', bottom: '3%', padding: '1px 8px 0', background: 'rgba(8,14,10,0.92)', fontFamily: "'Plex Mono', monospace", fontWeight: 500, fontSize: Math.max(11, sw * 0.045), color: '#cfe5d3', letterSpacing: '0.06em', textShadow: '0 0 6px rgba(160,230,190,0.8)' }}>{p.stamp}</div>
        )}
        {showStatic && (
          <div style={{ position: 'absolute', inset: 0, backgroundImage: `url(${staticFile('img/noise.png')})`, backgroundSize: '256px 256px', backgroundPosition: `${nx}px ${ny}px`, filter: `contrast(1.5) brightness(${inDrop ? 1.0 : 0.55})`, opacity: dead ? 0.95 - deadP * 0.1 : 0.8 }} />
        )}
        {dead && deadP > 0.5 && (
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Plex Mono', monospace", fontWeight: 500, fontSize: Math.max(10, sw * 0.05), letterSpacing: '0.18em', color: '#bcd3c6', background: 'rgba(0,0,0,0.45)', opacity: 0.9 }}>NO SIGNAL</div>
        )}
        {/* power-on collapse line */}
        {powered && wakeP < 1 && (
          <div style={{ position: 'absolute', left: (sw - lineW) / 2, top: (sh - lineH) / 2, width: lineW, height: lineH, background: '#e9f4ee', boxShadow: '0 0 30px rgba(190,240,215,0.9)', opacity: 1 - wakeP * 0.55, mixBlendMode: 'screen' }} />
        )}
        {/* scanlines, curvature, reflection */}
        <div style={{ position: 'absolute', inset: 0, background: 'repeating-linear-gradient(to bottom, rgba(0,0,0,0) 0, rgba(0,0,0,0) 2px, rgba(0,0,0,0.28) 3px)', opacity: powered ? 0.8 : 0 }} />
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at center, rgba(0,0,0,0) 52%, rgba(0,0,0,0.7) 100%)' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(125deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0) 32%)' }} />
      </div>
      {/* bezel details */}
      <div style={{ position: 'absolute', left: bez, bottom: bez * 0.55, fontFamily: "'Plex Mono', monospace", fontWeight: 500, fontSize: Math.max(9, h * 0.04), letterSpacing: '0.14em', color: '#9aa39c', background: 'rgba(214,210,196,0.1)', padding: '1px 6px' }}>{p.label}</div>
      <div style={{ position: 'absolute', right: bez, bottom: bez * 0.7, width: 9, height: 9, borderRadius: 9, background: powered ? '#7fe3a6' : '#252a27', boxShadow: powered ? '0 0 10px #7fe3a6' : 'none' }} />
    </div>
  )
}
