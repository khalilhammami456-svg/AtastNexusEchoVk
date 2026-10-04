import React from 'react'
import { AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame } from 'remotion'
import { sec } from '../data/types'

const MONO = "'Plex Mono', 'Courier New', monospace"

/** Evidence-style system text: appears character by character, never animates in like a title. */
export const Typed: React.FC<{ str: string; startFrame: number; cps?: number; style?: React.CSSProperties; cursor?: boolean }> = ({ str, startFrame, cps = 0.55, style, cursor = true }) => {
  const frame = useCurrentFrame()
  const n = Math.max(0, Math.min(str.length, Math.floor((frame - startFrame) * cps)))
  if (frame < startFrame) return null
  const blink = Math.floor(frame / 8) % 2 === 0
  return (
    <div style={{ fontFamily: MONO, fontWeight: 500, color: '#d8d6d0', letterSpacing: '0.2em', textShadow: '0 0 6px rgba(0,0,0,0.9)', ...style }}>
      {str.slice(0, n)}
      {cursor && n < str.length + 6 && <span style={{ opacity: blink ? 1 : 0, color: '#6fb3c4' }}>{'█'}</span>}
    </div>
  )
}

export const SystemLabel: React.FC<{ str: string; t: number; pos: 'tl' | 'bl' }> = ({ str, t, pos }) => (
  <Typed
    str={str}
    startFrame={sec(t)}
    cps={0.3}
    style={{ position: 'absolute', left: 84, [pos === 'tl' ? 'top' : 'bottom']: 70, fontSize: 28 }}
  />
)

export const Caption: React.FC<{ str: string; startFrame: number; endFrame: number }> = ({ str, startFrame, endFrame }) => {
  const frame = useCurrentFrame()
  if (frame < startFrame) return null
  const done = frame >= endFrame
  return (
    <AbsoluteFill style={{ justifyContent: 'flex-end', alignItems: 'center', paddingBottom: 96 }}>
      <Typed
        str={str}
        startFrame={startFrame}
        cps={str.length / Math.max(1, endFrame - startFrame)}
        cursor={!done}
        style={{ fontSize: 36, letterSpacing: '0.12em', background: 'rgba(0,0,0,0.55)', padding: '12px 22px', borderLeft: '3px solid #6fb3c4' }}
      />
    </AbsoluteFill>
  )
}

/** The recovered-record stamp lands once, slightly off-square, and stays. */
export const Stamp: React.FC<{ startFrame: number; x: number; y: number; rot: number }> = ({ startFrame, x, y, rot }) => {
  const frame = useCurrentFrame()
  if (frame < startFrame) return null
  const p = Math.min(1, (frame - startFrame) / 5)
  const scale = interpolate(p, [0, 1], [1.35, 1], { easing: Easing.out(Easing.cubic) })
  return (
    <div style={{ position: 'absolute', left: `${x}%`, top: `${y}%`, width: 420, transform: `translate(-50%,-50%) rotate(${rot}deg) scale(${scale})`, opacity: Math.min(1, p * 2) * 0.92, mixBlendMode: 'screen' }}>
      <Img src={staticFile('brand/stamp-recovered.svg')} style={{ width: '100%' }} />
    </div>
  )
}
