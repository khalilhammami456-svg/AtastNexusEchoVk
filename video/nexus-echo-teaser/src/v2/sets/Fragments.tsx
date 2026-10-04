import React from 'react'
import { AbsoluteFill, Img, Sequence, random, staticFile, useCurrentFrame } from 'remotion'
import { CrtMonitor } from './CrtMonitor'
import { Cassette, Dictaphone, Reel } from './props'
import { Board } from './Board'
import { Corridor } from './Corridor'
import { Crt, Grain, Tear } from '../../components/fx'
import { H, W, sec } from '../data'
import { handheld } from '../motion'

const MONO = "'Plex Mono', monospace"

type Cut =
  | { k: 'detail'; n: number; focus?: [number, number]; s?: number }
  | { k: 'crt'; stamp: string; src?: string; dead?: boolean }
  | { k: 'reels' }
  | { k: 'hand' }
  | { k: 'board'; cx: number; cy: number; sc: number }
  | { k: 'digits'; text: string; red?: boolean }
  | { k: 'dark'; focus: [number, number] }
  | { k: 'dict' }
  | { k: 'deck' }
  | { k: 'cor'; name: string; at: number }

/** 17 fragments, shot length shrinking; variety of scale and subject on purpose. */
export const CUTS: Cut[] = [
  { k: 'detail', n: 1 },
  { k: 'crt', stamp: '14-10-94 03:17:09' },
  { k: 'reels' },
  { k: 'hand' },
  { k: 'detail', n: 4 },
  { k: 'board', cx: 1650, cy: 380, sc: 2.3 },
  { k: 'digits', text: '03:17:11' },
  { k: 'dark', focus: [0.78, 0.8] },
  { k: 'crt', stamp: '', src: 'ev/surv_cam06_0316_offline.jpg', dead: true },
  { k: 'detail', n: 9 },
  { k: 'dict' },
  { k: 'deck' },
  { k: 'cor', name: 'corridor_b', at: 40 },
  { k: 'digits', text: '03:17:11', red: true },
  { k: 'detail', n: 6 },
  { k: 'detail', n: 12 },
  { k: 'detail', n: 14 },
]

/** Same schedule the audio generator uses for its 18 shutters: 17 cuts, first 0.7 s, last 0.15 s, filling `span`. */
export function cutLengths(span: number): number[] {
  const count = 18
  const m = count - 1
  const sum = (p: number) => {
    let t = 0
    for (let i = 0; i < m; i++) t += 0.15 + 0.55 * Math.pow((m - 1 - i) / (m - 1), p)
    return t
  }
  let lo = 0.5
  let hi = 8
  for (let k = 0; k < 60; k++) {
    const mid = (lo + hi) / 2
    if (sum(mid) > span) lo = mid
    else hi = mid
  }
  const p = (lo + hi) / 2
  return Array.from({ length: m }, (_, i) => 0.15 + 0.55 * Math.pow((m - 1 - i) / (m - 1), p))
}

const Flash: React.FC<{ n?: number }> = ({ n = 3 }) => {
  const f = useCurrentFrame()
  return f < n ? <AbsoluteFill style={{ background: `rgba(255,255,255,${0.32 * (1 - f / n)})` }} /> : null
}

const Detail: React.FC<{ n: number }> = ({ n }) => {
  const frame = useCurrentFrame()
  const hh = handheld(frame, `d${n}`, 8)
  const z = 1.06 + frame * 0.004
  return (
    <AbsoluteFill style={{ background: '#000', overflow: 'hidden' }}>
      <Img src={staticFile(`shots/corridor_details/detail_${String(n).padStart(2, '0')}.jpg`)} style={{ width: '100%', height: '100%', objectFit: 'cover', transform: `translate(${hh.x}px,${hh.y}px) scale(${z})`, filter: 'brightness(0.5) contrast(1.35) saturate(0.8)' }} />
      <AbsoluteFill style={{ background: 'radial-gradient(ellipse at 50% 55%, rgba(0,0,0,0) 20%, rgba(0,0,0,0.78) 100%)' }} />
    </AbsoluteFill>
  )
}

const Digits: React.FC<{ text: string; red?: boolean }> = ({ text, red }) => {
  const frame = useCurrentFrame()
  const jit = random(`dg-${frame}`) > 0.8 ? (random(`dj-${frame}`) - 0.5) * 24 : 0
  const c = red ? '#e6564c' : '#cfe9d8'
  return (
    <AbsoluteFill style={{ background: '#020303', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ fontFamily: MONO, fontWeight: 500, fontSize: 330, letterSpacing: '0.08em', color: c, textShadow: `0 0 40px ${red ? 'rgba(230,86,76,0.7)' : 'rgba(160,230,190,0.6)'}`, transform: `translateX(${jit}px)` }}>{text}</div>
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 150, textAlign: 'center', fontFamily: MONO, fontSize: 30, letterSpacing: '0.5em', color: 'rgba(200,215,205,0.55)' }}>14-10-94</div>
    </AbsoluteFill>
  )
}

const Dark: React.FC<{ focus: [number, number] }> = ({ focus }) => {
  const frame = useCurrentFrame()
  const hh = handheld(frame, 'dk', 8)
  return (
    <AbsoluteFill style={{ background: '#000', overflow: 'hidden' }}>
      <Img src={staticFile('ev/photo_nx037_b_02.jpg')} style={{ position: 'absolute', width: W * 3, height: H * 3, left: -W * 3 * focus[0] + W / 2 + hh.x, top: -H * 3 * focus[1] + H / 2 + hh.y, objectFit: 'fill', filter: 'brightness(0.42) contrast(1.4) blur(1.2px)' }} />
    </AbsoluteFill>
  )
}

const Macro: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const frame = useCurrentFrame()
  const hh = handheld(frame, 'mc', 9)
  return (
    <AbsoluteFill style={{ background: 'linear-gradient(100deg,#1b140e,#0d0906)', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
      <div style={{ transform: `translate(${hh.x}px,${hh.y}px) scale(${3.1 + frame * 0.01})`, filter: 'drop-shadow(20px 30px 24px rgba(0,0,0,0.8))' }}>{children}</div>
      <AbsoluteFill style={{ background: 'radial-gradient(ellipse at 40% 45%, rgba(255,226,170,0.16), rgba(0,0,0,0) 55%, rgba(0,0,0,0.85) 100%)' }} />
    </AbsoluteFill>
  )
}

const Hand: React.FC = () => {
  const frame = useCurrentFrame()
  const hh = handheld(frame, 'hd', 9)
  return (
    <AbsoluteFill style={{ background: '#060504', overflow: 'hidden' }}>
      <Img src={staticFile('ev/note_observer02_02.jpg')} style={{ position: 'absolute', width: 780 * 3.6, height: 1000 * 3.6, left: -780 * 3.6 * 0.08 + hh.x, top: -1000 * 3.6 * 0.268 + hh.y, filter: 'brightness(0.85) contrast(1.1) blur(0.6px)' }} />
      <AbsoluteFill style={{ background: 'radial-gradient(ellipse at center, rgba(0,0,0,0) 35%, rgba(0,0,0,0.85) 100%)' }} />
    </AbsoluteFill>
  )
}

const Body: React.FC<{ c: Cut; i: number }> = ({ c, i }) => {
  const frame = useCurrentFrame()
  switch (c.k) {
    case 'detail':
      return <Detail n={c.n} />
    case 'crt':
      return (
        <AbsoluteFill style={{ background: '#030405', alignItems: 'center', justifyContent: 'center' }}>
          <CrtMonitor x={170} y={-60} w={1580} h={1230} src={c.src ?? 'ev/surv_cam07_031711.jpg'} label="CAM" frame={frame + 30} wakeAt={0} dieAt={c.dead ? 0 : Infinity} stamp={c.stamp || undefined} seed={`fr${i}`} />
        </AbsoluteFill>
      )
    case 'reels':
      return (
        <Macro>
          <Cassette w={520} angle={frame * 22} />
        </Macro>
      )
    case 'hand':
      return <Hand />
    case 'board':
      return <Board total={150} frameOffset={sec(3.2)} fixed={{ cx: c.cx, cy: c.cy, sc: c.sc }} />
    case 'digits':
      return <Digits text={c.text} red={c.red} />
    case 'dark':
      return <Dark focus={c.focus} />
    case 'dict':
      return (
        <Macro>
          <Dictaphone w={520} angle={frame * 18} />
        </Macro>
      )
    case 'deck':
      return <Macro><svg width={560} height={160} viewBox="0 0 560 160"><rect width="560" height="160" rx="18" fill="#17191b" /><Reel cx={150} cy={80} r={52} angle={frame * 20} /><Reel cx={410} cy={80} r={52} angle={frame * 20} /><circle cx="280" cy="80" r="9" fill="#ff4a3f" /></svg></Macro>
    case 'cor':
      return <Corridor name={c.name} startFrame={c.at} hud={false} seed={`frc${i}`} crt={0.5} dim={0.5} />
  }
}

/** B13: the fragment montage. Subjects change scale and type on every cut; the last cut hands over to the figure. */
export const Fragments: React.FC<{ total: number; figure: React.ReactNode }> = ({ total, figure }) => {
  const montage = total - 1.2 // 4.8 s: 17 cuts, then the figure
  const lens = cutLengths(montage)
  let at = 0
  return (
    <AbsoluteFill style={{ background: '#000' }}>
      {CUTS.map((c, i) => {
        const from = Math.round(at * 30)
        const len = Math.max(2, Math.round(lens[i] * 30))
        at += lens[i]
        const tear = i % 3 === 1
        return (
          <Sequence key={i} from={from} durationInFrames={len} premountFor={20}>
            <Tear active={tear} amount={44} seed={`ft${i}`}>
              <Body c={c} i={i} />
            </Tear>
            <Grain amount={0.6} seed={`fg${i}`} />
            <Crt level={0.35 + i * 0.03} seed={`fc${i}`} />
            <Flash />
          </Sequence>
        )
      })}
      <Sequence from={Math.round(montage * 30)} durationInFrames={Math.round(1.2 * 30)} premountFor={20}>
        {figure}
        <Flash n={4} />
      </Sequence>
    </AbsoluteFill>
  )
}
