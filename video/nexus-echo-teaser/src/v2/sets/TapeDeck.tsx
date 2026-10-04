import React from 'react'
import { AbsoluteFill, random, useCurrentFrame } from 'remotion'
import { Cassette, Reel } from './props'
import { H, W, sec } from '../data'
import { easeInOut, easeOut, handheld, lerp, prog } from '../motion'

const MONO = "'Plex Mono', monospace"

/** B10: a cassette slides into a deck, the motor starts, the reels turn, REC lights. */
export const TapeDeck: React.FC<{ total: number; frameOffset?: number; zoom?: number }> = ({ total, frameOffset = 0, zoom = 1 }) => {
  const frame = useCurrentFrame() + frameOffset
  const ins = prog(frame, sec(0.25), sec(0.95), easeOut)
  const thunk = frame >= sec(0.95) && frame < sec(1.1) ? (random(`t-${frame}`) - 0.5) * 10 : 0
  const spin = frame < sec(1.3) ? 0 : (frame - sec(1.3)) * 9
  const rec = frame >= sec(1.9)
  const recGlow = rec ? 0.8 + 0.2 * Math.sin(frame * 0.3) : 0
  const cnt = Math.max(0, Math.floor((frame - sec(1.3)) / 6))
  const hh = handheld(frame, 'deck', 8)
  const p = prog(frame, 0, total, easeInOut)
  const sc = lerp(1.0, 1.18, p) * zoom

  return (
    <AbsoluteFill style={{ background: '#050505', overflow: 'hidden', perspective: 1500 }}>
      <div style={{ position: 'absolute', left: 0, top: 0, width: W, height: H, transform: `translate(${hh.x + thunk}px, ${hh.y}px) scale(${sc}) rotateX(32deg) rotateZ(${-4 + hh.rot}deg)`, transformOrigin: '50% 60%' }}>
        {/* bench */}
        <div style={{ position: 'absolute', left: -400, top: 120, width: W + 800, height: H + 600, background: 'linear-gradient(180deg,#14100d,#0a0806)' }} />
        {/* deck body */}
        <div style={{ position: 'absolute', left: 260, top: 260, width: 1400, height: 520, borderRadius: 22, background: 'linear-gradient(180deg,#2b2e31 0%,#15171a 55%,#0b0c0d 100%)', boxShadow: '0 60px 90px rgba(0,0,0,0.9), inset 0 2px 0 rgba(255,255,255,0.12)' }} />
        {/* cassette bay */}
        <div style={{ position: 'absolute', left: 330, top: 330, width: 700, height: 300, borderRadius: 12, background: '#050607', boxShadow: 'inset 0 0 40px #000, 0 0 0 3px #3a3e42' }}>
          {/* slot guides */}
          <div style={{ position: 'absolute', left: 14, right: 14, top: 12, height: 3, background: '#2c2f32' }} />
          <div style={{ position: 'absolute', left: 14, right: 14, bottom: 12, height: 3, background: '#2c2f32' }} />
          <div style={{ position: 'absolute', left: lerp(980, 40, ins), top: 28, transform: 'scale(1.48)', transformOrigin: '0 0', filter: 'drop-shadow(0 14px 12px rgba(0,0,0,0.7))' }}>
            <Cassette w={400} angle={spin} />
          </div>
          {/* the lid shadow over the right half before it seats */}
        </div>
        {/* controls */}
        {['REC', 'PLAY', 'FF', 'REW', 'STOP'].map((b, i) => (
          <div key={b} style={{ position: 'absolute', left: 1090 + (i % 3) * 170, top: 340 + Math.floor(i / 3) * 110, width: 150, height: 84, borderRadius: 8, background: b === 'REC' && rec ? 'linear-gradient(180deg,#7f2a25,#4a1613)' : 'linear-gradient(180deg,#34373a,#1b1d1f)', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.15), 0 8px 12px rgba(0,0,0,0.7)', fontFamily: MONO, fontSize: 24, letterSpacing: 4, color: '#aab0b3', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{b}</div>
        ))}
        {/* counter and LED */}
        <div style={{ position: 'absolute', left: 1090, top: 580, width: 230, height: 70, borderRadius: 6, background: '#060707', boxShadow: 'inset 0 0 14px #000, 0 0 0 2px #3a3e42', fontFamily: MONO, fontWeight: 500, fontSize: 46, letterSpacing: 8, color: '#d9d4c6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{String(cnt).padStart(4, '0')}</div>
        <div style={{ position: 'absolute', left: 1400, top: 600, width: 30, height: 30, borderRadius: 30, background: rec ? '#ff4a3f' : '#2a1311', boxShadow: rec ? `0 0 ${50 * recGlow}px ${14 * recGlow}px rgba(255,74,63,0.7)` : 'none' }} />
        <div style={{ position: 'absolute', left: 1445, top: 598, fontFamily: MONO, fontSize: 28, letterSpacing: 6, color: rec ? '#e8b8b3' : '#4a4f52' }}>REC</div>
      </div>
      <AbsoluteFill style={{ background: 'radial-gradient(ellipse at 45% 50%, rgba(255,220,170,0.1) 0%, rgba(0,0,0,0) 50%, rgba(0,0,0,0.85) 100%)' }} />
      {rec && <AbsoluteFill style={{ background: `radial-gradient(ellipse 500px 380px at 74% 70%, rgba(255,74,63,${0.2 * recGlow}) 0%, rgba(0,0,0,0) 100%)`, mixBlendMode: 'screen' }} />}
    </AbsoluteFill>
  )
}
void Reel
