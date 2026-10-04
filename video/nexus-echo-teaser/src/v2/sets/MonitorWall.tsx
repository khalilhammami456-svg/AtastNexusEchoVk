import React from 'react'
import { AbsoluteFill, useCurrentFrame } from 'remotion'
import { CrtMonitor } from './CrtMonitor'
import { H, W, sec } from '../data'
import { handheld, lerp, prog, easeInOut } from '../motion'

export type WallMode = 'hook' | 'anomaly' | 'final'
export interface WallCam { x0: number; x1: number; y0: number; y1: number; s0: number; s1: number }
/** Hard-cut camera segments, seconds local to the shot. */
export interface WallSegment { from: number; to: number; cam: WallCam }

const WALL_W = 3000

interface Props {
  mode: WallMode
  segments: WallSegment[]
  /** seconds, local to the shot */
  wake?: number[]
  die?: Array<number | null>
  dropout?: [number, number]
  /** live stamp on the big monitor: "HH:MM:SS" at the start, advances one second per second */
  clock?: { h: number; m: number; s: number } | null
  hand?: number
  showRec?: boolean
  /** keep the stamp on its first second (the final frame must read 03:17:11 and stay there) */
  freezeClock?: boolean
}

const MON = [
  { key: 'c1', x: 250, y: 330, w: 330, h: 270, src: 'ev/surv_cam01_015203.jpg', label: 'CAM-01' },
  { key: 'c2', x: 610, y: 330, w: 330, h: 270, src: 'ev/surv_cam02_024120.jpg', label: 'CAM-02' },
  { key: 'c3', x: 250, y: 628, w: 330, h: 270, src: 'ev/surv_cam03_025830.jpg', label: 'CAM-03' },
  { key: 'c4', x: 610, y: 628, w: 330, h: 270, src: 'ev/surv_cam04_024820.jpg', label: 'CAM-04' },
  { key: 'c7', x: 1090, y: 270, w: 700, h: 580, src: 'ev/surv_cam07_031711.jpg', label: 'CAM-07  DVR NODE B-04' },
  { key: 'c6', x: 1960, y: 390, w: 330, h: 270, src: 'ev/surv_cam06_0316_offline.jpg', label: 'CAM-06' },
]

const pad = (n: number) => String(n).padStart(2, '0')

/** A dark control room. The camera dollies sideways past three depth layers; the tubes light the room. */
export const MonitorWall: React.FC<Props> = ({ mode, segments, wake = [], die = [], dropout, clock, hand = 6, showRec = true, freezeClock = false }) => {
  const frame = useCurrentFrame()
  const seg = segments.find((x) => frame >= sec(x.from) && frame < sec(x.to)) ?? segments[segments.length - 1]
  const cam = seg.cam
  const p = prog(frame, sec(seg.from), sec(seg.to), easeInOut)
  const cx = lerp(cam.x0, cam.x1, p)
  const cy = lerp(cam.y0, cam.y1, p)
  const sc = lerp(cam.s0, cam.s1, p)
  const hh = handheld(frame, `wall-${mode}`, hand)
  const layer = (par: number) => `translate(${-(cx * par) + hh.x * par}px, ${-(cy * par) + hh.y * par}px)`
  const onAt = (i: number) => (mode === 'final' ? (MON[i].key === 'c7' ? 0 : Infinity) : wake[i] !== undefined ? sec(wake[i]) : 0)
  const dieAt = (i: number) => (die[i] === null || die[i] === undefined ? Infinity : sec(die[i] as number))
  const stamp = clock ? `14-10-94 ${pad(clock.h)}:${pad(clock.m)}:${pad(Math.min(59, clock.s + (freezeClock ? 0 : Math.floor(frame / 30))))}` : undefined
  const lit = MON.filter((_, i) => frame >= onAt(i) && frame < dieAt(i)).length

  return (
    <AbsoluteFill style={{ background: '#030405', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: 0, transform: `scale(${sc}) rotate(${hh.rot}deg)`, transformOrigin: `${W / 2}px ${H / 2}px` }}>
        {/* back wall */}
        <div style={{ position: 'absolute', left: 0, top: 0, width: WALL_W, height: H, transform: layer(0.55), background: 'linear-gradient(180deg,#0a0c0d 0%,#0b0e0f 60%,#060707 100%)' }}>
          {Array.from({ length: 12 }, (_, i) => (
            <div key={i} style={{ position: 'absolute', left: i * 270, top: 0, width: 2, height: H, background: 'rgba(255,255,255,0.025)' }} />
          ))}
          <div style={{ position: 'absolute', left: 120, top: 180, width: 2400, height: 6, background: 'rgba(255,255,255,0.03)' }} />
          <div style={{ position: 'absolute', left: 120, top: 940, width: 2600, height: 4, background: 'rgba(255,255,255,0.04)' }} />
        </div>
        {/* monitors */}
        <div style={{ position: 'absolute', left: 0, top: 0, width: WALL_W, height: H, transform: layer(1) }}>
          {/* the shelf they sit on */}
          <div style={{ position: 'absolute', left: 180, top: 905, width: 2250, height: 30, background: 'linear-gradient(180deg,#1d1f21,#0b0c0d)', boxShadow: '0 20px 40px rgba(0,0,0,0.8)' }} />
          {MON.map((m, i) => (
            <CrtMonitor
              key={m.key}
              x={m.x}
              y={m.y}
              w={m.w}
              h={m.h}
              src={m.src}
              label={m.label}
              frame={frame}
              seed={`${mode}-${m.key}`}
              wakeAt={onAt(i)}
              dieAt={dieAt(i)}
              stamp={m.key === 'c7' ? stamp : undefined}
              dropout={m.key === 'c7' ? dropout : undefined}
              gain={mode === 'final' ? 1.0 : 0.92}
            />
          ))}
        </div>
        {/* desk edge: keyboard, glare */}
        <div style={{ position: 'absolute', left: 0, top: 0, width: WALL_W + 600, height: H, transform: layer(1.7), filter: 'blur(3px)' }}>
          <div style={{ position: 'absolute', left: -200, top: 960, width: 2700, height: 400, background: 'linear-gradient(180deg,#121110,#050505)', boxShadow: '0 -20px 60px rgba(0,0,0,0.9)' }} />
          <div style={{ position: 'absolute', left: 760, top: 1000, width: 700, height: 150, borderRadius: 14, transform: 'perspective(500px) rotateX(55deg)', background: 'repeating-linear-gradient(90deg,#17181a 0,#17181a 26px,#0a0b0c 27px,#0a0b0c 29px)', boxShadow: '0 0 40px rgba(150,205,175,0.08)' }} />
          <div style={{ position: 'absolute', left: 1700, top: 990, width: 120, height: 90, borderRadius: 10, background: 'linear-gradient(160deg,#262626,#0a0a0a)' }} />
        </div>
        {/* foreground chair back, heavily out of focus */}
        <div style={{ position: 'absolute', left: 0, top: 0, width: WALL_W + 1200, height: H, transform: layer(2.8), filter: 'blur(16px)', opacity: 0.96 }}>
          <div style={{ position: 'absolute', left: -140, top: 380, width: 360, height: 900, borderRadius: '120px 120px 0 0', background: 'linear-gradient(90deg,#000,#0a0a0b)' }} />
        </div>
      </div>
      {/* room darkness + light falloff */}
      <AbsoluteFill style={{ background: 'radial-gradient(ellipse at 50% 55%, rgba(0,0,0,0) 30%, rgba(0,0,0,0.78) 100%)' }} />
      {showRec && mode !== 'final' && (
        <div style={{ position: 'absolute', right: 96, top: 70, display: 'flex', gap: 14, alignItems: 'center', fontFamily: "'Plex Mono', monospace", fontWeight: 500, fontSize: 26, color: '#d5ded8', letterSpacing: '0.2em', opacity: lit > 0 ? 1 : 0 }}>
          <span style={{ width: 16, height: 16, borderRadius: 16, background: Math.floor(frame / 15) % 2 === 0 ? '#d8423a' : '#4a1512', boxShadow: '0 0 12px rgba(216,66,58,0.8)' }} />REC
        </div>
      )}
    </AbsoluteFill>
  )
}
