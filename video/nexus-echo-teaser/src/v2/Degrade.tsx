import React from 'react'
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion'
import { Crt, Grain } from '../components/fx'
import { FPS, type ShotDef } from './data'

/**
 * Story-wide degradation: grain and scanlines rise with each shot's level (0-5), so the picture itself gets
 * rougher as the case goes wrong. Shots keep their own treatment; this sits on top, lightly.
 */
export const Degrade: React.FC<{ shots: ShotDef[] }> = ({ shots }) => {
  const frame = useCurrentFrame()
  const t = frame / FPS
  const pts = shots.map((s) => [s.start + s.dur / 2, s.level] as const)
  const level = interpolate(t, pts.map((p) => p[0]), pts.map((p) => p[1]), { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
  return (
    <AbsoluteFill style={{ pointerEvents: 'none' }}>
      <Grain amount={0.06 + 0.07 * level} seed="global" />
      <Crt level={0.03 * level} seed="global" />
    </AbsoluteFill>
  )
}
