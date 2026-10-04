import React from 'react'
import { AbsoluteFill, staticFile, useCurrentFrame } from 'remotion'
import { Video } from '@remotion/media'
import { Crt, Grain } from '../../components/fx'
import { FPS, sec } from '../data'
import { handheld } from '../motion'

const pad = (n: number) => String(n).padStart(2, '0')

/** A rendered 3D camera move (real parallax), with a field-camera readout on top. */
export const Corridor: React.FC<{ name: string; startFrame?: number; clock?: { h: number; m: number; s: number }; hud?: boolean; seed?: string; crt?: number; dim?: number; flickers?: number[] }> = ({ name, startFrame = 0, clock = { h: 3, m: 12, s: 44 }, hud = true, seed = 'cor', crt = 0.35, dim = 1, flickers = [] }) => {
  const frame = useCurrentFrame()
  const hh = handheld(frame, seed, 2.5)
  const total = clock.s + Math.floor(frame / FPS)
  return (
    <AbsoluteFill style={{ background: '#030405' }}>
      <AbsoluteFill style={{ transform: `translate(${hh.x}px, ${hh.y}px) scale(1.03)` }}>
        <Video src={staticFile(`shots/${name}.mp4`)} trimBefore={startFrame} muted style={{ width: '100%', height: '100%', objectFit: 'cover', filter: `brightness(${flickers.includes(frame) ? 0.04 : dim}) contrast(1.18) saturate(0.8)` }} premountFor={FPS} />
      </AbsoluteFill>
      <AbsoluteFill style={{ background: 'radial-gradient(ellipse at 50% 55%, rgba(0,0,0,0) 25%, rgba(0,0,0,0.72) 100%)' }} />
      <Grain amount={0.55} seed={seed} />
      <Crt level={crt} seed={seed} />
      {hud && (
        <div style={{ position: 'absolute', left: 84, bottom: 70, fontFamily: "'Plex Mono', monospace", fontWeight: 500, fontSize: 30, letterSpacing: '0.12em', color: '#dfe6e2', textShadow: '0 0 6px rgba(0,0,0,0.9)' }}>
          <div>14-10-94 {pad(clock.h)}:{pad(clock.m + Math.floor(total / 60))}:{pad(total % 60)}</div>
          <div style={{ fontSize: 22, opacity: 0.75 }}>FIELD-CAM-02</div>
        </div>
      )}
      {hud && (
        <div style={{ position: 'absolute', right: 96, top: 70, display: 'flex', gap: 14, alignItems: 'center', fontFamily: "'Plex Mono', monospace", fontWeight: 500, fontSize: 26, color: '#d5ded8', letterSpacing: '0.2em' }}>
          <span style={{ width: 16, height: 16, borderRadius: 16, background: Math.floor(frame / 15) % 2 === 0 ? '#d8423a' : '#4a1512', boxShadow: '0 0 12px rgba(216,66,58,0.8)' }} />REC
        </div>
      )}
    </AbsoluteFill>
  )
}
void sec
