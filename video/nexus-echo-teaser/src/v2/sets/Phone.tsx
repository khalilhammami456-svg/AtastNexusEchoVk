import React from 'react'
import { AbsoluteFill, Img, random, staticFile, useCurrentFrame } from 'remotion'
import { H, W, sec } from '../data'
import { easeInOut, easeOut, handheld, lerp, prog } from '../motion'

/** B04: the handset on a dark desk. It buzzes twice, then the screen wakes and lights the wood. */
export const PhoneInsert: React.FC<{ total: number }> = ({ total }) => {
  const frame = useCurrentFrame()
  const buzz = (a: number, b: number) => frame >= sec(a) && frame < sec(b)
  const vib = buzz(0, 0.2) || buzz(0.32, 0.52)
  const jx = vib ? (random(`pv-${frame}`) - 0.5) * 16 : 0
  const jy = vib ? (random(`pw-${frame}`) - 0.5) * 12 : 0
  const wake = sec(0.6)
  const screen = frame < wake ? 0 : prog(frame, wake, wake + 8, easeOut)
  const flick = frame >= wake && frame < wake + 8 ? 0.5 + random(`pf-${frame}`) * 0.5 : 1
  const hh = handheld(frame, 'phone', 6)
  const p = prog(frame, 0, total, easeInOut)
  const sc = lerp(1.0, 1.14, p)
  return (
    <AbsoluteFill style={{ background: '#050403', overflow: 'hidden', perspective: 1400 }}>
      <div style={{ position: 'absolute', inset: 0, transform: `scale(${sc}) translate(${hh.x}px, ${hh.y}px)`, transformOrigin: '50% 50%' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(100deg,#1c150f,#120d09 60%,#0b0806)', filter: 'blur(5px)' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'repeating-linear-gradient(100deg, rgba(0,0,0,0) 0, rgba(0,0,0,0) 46px, rgba(0,0,0,0.2) 49px)', filter: 'blur(3px)' }} />
        {/* the light the screen throws on the wood */}
        <div style={{ position: 'absolute', left: W / 2 - 900, top: H / 2 - 600, width: 1800, height: 1200, background: `radial-gradient(ellipse at 50% 50%, rgba(120,190,205,${0.42 * screen}) 0%, rgba(120,190,205,${0.12 * screen}) 40%, rgba(0,0,0,0) 70%)`, mixBlendMode: 'screen' }} />
        {/* the handset */}
        <div style={{ position: 'absolute', left: W / 2 - 250 + jx, top: H / 2 - 520 + jy, width: 500, height: 1040, transform: 'rotateX(52deg) rotateZ(-24deg)', transformStyle: 'preserve-3d' }}>
          <div style={{ position: 'absolute', inset: 0, borderRadius: 56, background: '#08090a', border: '2px solid #2a2d30', boxShadow: '30px 50px 60px rgba(0,0,0,0.85)' }} />
          <div style={{ position: 'absolute', inset: 14, borderRadius: 44, overflow: 'hidden', background: '#000' }}>
            <Img src={staticFile('ui/mobile-02-surveillance-inspection.png')} style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: screen * flick }} />
            <AbsoluteFill style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 30%)' }} />
          </div>
        </div>
      </div>
      <AbsoluteFill style={{ background: 'radial-gradient(ellipse at center, rgba(0,0,0,0) 40%, rgba(0,0,0,0.85) 100%)' }} />
    </AbsoluteFill>
  )
}
