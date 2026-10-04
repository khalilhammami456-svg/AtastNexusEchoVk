import React from 'react'
import { AbsoluteFill, random, staticFile, useCurrentFrame } from 'remotion'
import type { Grade } from '../data/types'
import { H, W } from '../data/types'

export const GRADES: Record<Grade, string> = {
  cctv: 'contrast(1.12) brightness(0.9) saturate(0.9)',
  cctvDark: 'contrast(1.25) brightness(0.8)',
  cctvLift: 'contrast(1.1) brightness(1.55) saturate(0.9)',
  photo: 'contrast(1.06) brightness(0.8) saturate(0.82)',
  paper: 'contrast(1.05) brightness(0.86) sepia(0.12)',
  paperBlur: 'contrast(1.05) brightness(0.8) sepia(0.12) blur(5px)',
}

/** CRT glass: scanlines, vignette, a slow rolling band and a faint flicker. Deterministic per frame. */
export const Crt: React.FC<{ level: number; seed?: string }> = ({ level, seed = 'crt' }) => {
  const frame = useCurrentFrame()
  if (level <= 0) return null
  const flicker = (random(`${seed}-f-${frame}`) - 0.5) * 0.07 * level
  const band = ((frame * 5) % (H + 400)) - 200
  return (
    <AbsoluteFill style={{ pointerEvents: 'none' }}>
      <AbsoluteFill style={{ background: 'repeating-linear-gradient(to bottom, rgba(0,0,0,0) 0px, rgba(0,0,0,0) 2px, rgba(0,0,0,0.30) 3px)', opacity: 0.55 * level }} />
      <AbsoluteFill style={{ background: 'radial-gradient(ellipse at center, rgba(0,0,0,0) 48%, rgba(0,0,0,0.78) 100%)' }} />
      <div style={{ position: 'absolute', left: 0, right: 0, top: band, height: 160, background: 'linear-gradient(to bottom, rgba(255,255,255,0), rgba(220,235,225,0.045), rgba(255,255,255,0))', opacity: level }} />
      <AbsoluteFill style={{ background: flicker > 0 ? `rgba(255,255,255,${flicker})` : `rgba(0,0,0,${-flicker})` }} />
    </AbsoluteFill>
  )
}

/** Film/sensor grain from one noise tile jumped to a random offset each frame. */
export const Grain: React.FC<{ amount: number; seed?: string }> = ({ amount, seed = 'g' }) => {
  const frame = useCurrentFrame()
  if (amount <= 0) return null
  const x = Math.floor(random(`${seed}-x-${frame}`) * 512)
  const y = Math.floor(random(`${seed}-y-${frame}`) * 512)
  return (
    <AbsoluteFill
      style={{
        pointerEvents: 'none',
        backgroundImage: `url(${staticFile('img/noise.png')})`,
        backgroundSize: '512px 512px',
        backgroundPosition: `${x}px ${y}px`,
        mixBlendMode: 'overlay',
        opacity: 0.42 * amount,
      }}
    />
  )
}

/**
 * Horizontal-band signal tear: while `active`, the children are drawn in bands that
 * slip sideways by different amounts. Outside the window they are drawn once.
 */
export const Tear: React.FC<{ active: boolean; amount: number; seed: string; children: React.ReactNode }> = ({ active, amount, seed, children }) => {
  const frame = useCurrentFrame()
  if (!active) return <>{children}</>
  const bands = 7
  const edges = Array.from({ length: bands + 1 }, (_, i) => (i === 0 ? 0 : i === bands ? 100 : (i / bands) * 100 + (random(`${seed}-e-${i}-${frame}`) - 0.5) * 9))
  return (
    <AbsoluteFill>
      {Array.from({ length: bands }, (_, i) => {
        const dx = (random(`${seed}-d-${i}-${frame}`) - 0.5) * 2 * amount * (i % 2 === 0 ? 1 : 0.35)
        return (
          <AbsoluteFill key={i} style={{ clipPath: `inset(${edges[i]}% 0 ${100 - edges[i + 1]}% 0)`, transform: `translateX(${dx}px)` }}>
            {children}
          </AbsoluteFill>
        )
      })}
    </AbsoluteFill>
  )
}

export const FullBlack: React.FC = () => <AbsoluteFill style={{ background: '#000' }} />

export const Desk: React.FC = () => (
  <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 45%, #15171a 0%, #08090a 55%, #020202 100%)`, width: W, height: H }} />
)
