import React from 'react'
import { AbsoluteFill, Easing, Img, Sequence, interpolate, random, staticFile, useCurrentFrame } from 'remotion'
import { Camera, camAt } from './camera'
import { Crt, Desk, FullBlack, GRADES, Grain, Tear } from './fx'
import { Caption, Stamp, SystemLabel } from './text'
import type { Cam, ImageSpec, Shot } from '../data/types'
import { H, W, sec } from '../data/types'

const RATIO: Record<string, number> = {
  'img/surv_cam07_031711.jpg': 704 / 576,
  'img/surv_cam06_0316_offline.jpg': 704 / 576,
  'img/photo_nx037_b_01.jpg': 1024 / 814,
  'img/photo_nx037_b_02.jpg': 1024 / 814,
  'img/doc_nx037_surveillance_log.jpg': 850 / 1100,
  'img/note_observer02_02.jpg': 780 / 1000,
  'img/frag_nx037_c_02.jpg': 620 / 300,
  'img/personnel_lv_0029_duplicate.jpg': 850 / 1100,
  'img/map_east_wing_issue02.jpg': 1180 / 860,
}

/** One framed piece of evidence with a camera move, grade, CRT/grain and optional tear window. */
export const ImageShot: React.FC<{ spec: Omit<ImageSpec, 'tears'> & { tears?: ImageSpec['tears'] }; dur: number; id: string }> = ({ spec, dur, id }) => {
  const frame = useCurrentFrame()
  const total = sec(dur)
  const p = frame / Math.max(1, total - 1)
  const cam = camAt(spec.from, spec.to, p)
  const tears = spec.tears ?? (spec.tear ? [{ t: 0, dur: 0.17, amount: 50 }] : [])
  const tearing = tears.some((t) => frame >= sec(t.t) && frame < sec(t.t + t.dur))
  const tearAmount = tears.find((t) => frame >= sec(t.t) && frame < sec(t.t + t.dur))?.amount ?? 0
  const fade = spec.fadeIn ? interpolate(frame, [0, sec(spec.fadeIn)], [0, 1], { extrapolateRight: 'clamp' }) : 1
  const hl = spec.highlight
  const hlP = hl ? interpolate(frame, [sec(hl.t), sec(hl.t + hl.dur)], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.quad) }) : 0
  const stable = (random(`${id}-expo-${frame}`) - 0.5) * 0.04
  return (
    <AbsoluteFill style={{ background: '#030303', opacity: fade }}>
      {spec.fit === 'object' && <Desk />}
      <Tear active={tearing} amount={tearAmount} seed={id}>
        <AbsoluteFill style={{ filter: `brightness(${1 + stable})` }}>
          <Camera src={spec.src} fit={spec.fit} objectHeight={spec.objectHeight} naturalRatio={RATIO[spec.src]} cam={cam} filter={GRADES[spec.grade]} shadow={spec.fit === 'object'}>
            {hl && hlP > 0 && (
              <div style={{ position: 'absolute', left: `${hl.x}%`, top: `${hl.y}%`, width: `${hl.w * hlP}%`, height: `${hl.h}%`, background: 'rgba(168,52,40,0.28)', mixBlendMode: 'multiply', borderBottom: '2px solid rgba(168,52,40,0.55)' }} />
            )}
          </Camera>
        </AbsoluteFill>
      </Tear>
      <Grain amount={spec.grain ?? 0.3} seed={id} />
      <Crt level={spec.crt ?? 0} seed={id} />
      {spec.text?.map((t) => <SystemLabel key={t.str} str={t.str} t={t.t} pos={t.pos} />)}
      {spec.stamp && <Stamp startFrame={sec(spec.stamp.t)} x={spec.stamp.x} y={spec.stamp.y} rot={spec.stamp.rot} />}
      {spec.caption && <Caption str={spec.caption.str} startFrame={sec(spec.caption.t)} endFrame={sec(spec.caption.t + spec.caption.dur)} />}
    </AbsoluteFill>
  )
}

/** The handset waking on a desk: a buzz, a flicker, then the real record screen, pushed in. */
export const PhoneShot: React.FC<{ shot: Extract<Shot, { kind: 'phone' }> }> = ({ shot }) => {
  const frame = useCurrentFrame()
  const total = sec(shot.dur)
  const cam = camAt(shot.from, shot.to, frame / Math.max(1, total - 1))
  const vib = frame >= sec(shot.vibrate[0]) && frame < sec(shot.vibrate[1])
  const jx = vib ? (random(`pv-x-${frame}`) - 0.5) * 14 : 0
  const jy = vib ? (random(`pv-y-${frame}`) - 0.5) * 10 : 0
  const wake = sec(shot.wake)
  const screen = frame < wake ? 0.0 : interpolate(frame, [wake, wake + 14], [0, 1], { extrapolateRight: 'clamp' })
  const flick = frame >= wake && frame < wake + 14 ? 0.55 + random(`pf-${frame}`) * 0.45 : 1
  const pw = 470
  const ph = 1000
  const tx = (() => { const sw = cam.scale * pw; let t = -cam.scale * (cam.x / 100 - 0.5) * pw; if (sw > W) { const l = sw / 2 - W / 2; t = Math.max(-l, Math.min(l, t)) } return t })()
  const ty = (() => { const sh = cam.scale * ph; let t = -cam.scale * (cam.y / 100 - 0.5) * ph; if (sh > H) { const l = sh / 2 - H / 2; t = Math.max(-l, Math.min(l, t)) } return t })()
  return (
    <AbsoluteFill style={{ background: '#030303' }}>
      <Desk />
      <div style={{ position: 'absolute', left: (W - pw) / 2 + jx, top: (H - ph) / 2 + jy, width: pw, height: ph, transform: `translate(${tx}px, ${ty}px) scale(${cam.scale}) rotate(-2.5deg)`, transformOrigin: '50% 50%' }}>
        <div style={{ position: 'absolute', inset: 0, borderRadius: 58, background: '#08090a', border: '2px solid #26292c', boxShadow: `0 0 ${140 * screen}px rgba(111,179,196,${0.22 * screen}), 0 40px 120px rgba(0,0,0,0.95)` }} />
        <div style={{ position: 'absolute', inset: 14, borderRadius: 46, overflow: 'hidden', background: '#000' }}>
          <Img src={staticFile(shot.src)} style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: screen * flick, filter: 'contrast(1.05) brightness(0.92)' }} />
          <AbsoluteFill style={{ background: 'repeating-linear-gradient(to bottom, rgba(0,0,0,0) 0, rgba(0,0,0,0) 2px, rgba(0,0,0,0.12) 3px)', opacity: screen }} />
        </div>
      </div>
      <Grain amount={0.25} seed="phone" />
      <Crt level={0.1} seed="phone" />
    </AbsoluteFill>
  )
}

/** Fast cuts between records. Each cut carries its own camera and optional tear. */
export const Montage: React.FC<{ shot: Extract<Shot, { kind: 'montage' }> }> = ({ shot }) => {
  let at = 0
  return (
    <AbsoluteFill>
      {shot.cuts.map((cut, i) => {
        const from = at
        at += sec(cut.dur)
        const len = i === shot.cuts.length - 1 ? sec(shot.dur) - from : sec(cut.dur)
        return (
          <SeqFrame key={i} from={from} dur={len}>
            <ImageShot spec={{ ...cut, crt: cut.grade.startsWith('cctv') ? 0.8 : 0.2, grain: 0.45 }} dur={cut.dur} id={`${shot.id}-${i}`} />
          </SeqFrame>
        )
      })}
    </AbsoluteFill>
  )
}

const SeqFrame: React.FC<{ from: number; dur: number; children: React.ReactNode }> = ({ from, dur, children }) => (
  <Sequence from={from} durationInFrames={dur} premountFor={15}>
    {children}
  </Sequence>
)
export { SeqFrame }

/**
 * The corridor again. First as before (so the viewer recognises it), then a tear swaps in the
 * other photograph, cropped to the far end, darkened and degraded so nothing is resolved.
 */
export const RevealShot: React.FC<{ shot: Extract<Shot, { kind: 'reveal' }> }> = ({ shot }) => {
  const frame = useCurrentFrame()
  const swap = sec(shot.swapAt)
  const total = sec(shot.dur)
  const after = frame >= swap
  const tearing = frame >= swap - 3 && frame < swap + 6
  const pA = frame / Math.max(1, swap)
  const pB = (frame - swap) / Math.max(1, total - swap)
  const camA = camAt(shot.fromA, shot.toA, Math.min(1, pA))
  const camB = camAt(shot.fromB, shot.toB, Math.min(1, Math.max(0, pB)))
  const dark = after ? interpolate(pB, [0, 0.55, 1], [0.34, 0.42, 0.66]) : 1
  const blur = after ? interpolate(pB, [0, 0.5, 1], [3.4, 2.4, 1.5]) : 0
  return (
    <AbsoluteFill style={{ background: '#030303' }}>
      <Desk />
      <Tear active={tearing} amount={90} seed="reveal">
        {!after ? (
          <Camera src={shot.a} fit="object" objectHeight={shot.objectHeight} naturalRatio={1024 / 814} cam={camA} filter={GRADES.photo} shadow />
        ) : (
          <Camera src={shot.b} fit="object" objectHeight={shot.objectHeight} naturalRatio={1024 / 814} cam={camB} filter={`${GRADES.photo} brightness(${dark}) contrast(1.35) blur(${blur}px)`} shadow />
        )}
      </Tear>
      <Grain amount={after ? 0.9 : 0.35} seed="reveal" />
      <Crt level={after ? 0.6 : 0.25} seed="reveal" />
      {after && <AbsoluteFill style={{ background: `radial-gradient(ellipse at 52% 52%, rgba(0,0,0,0) 12%, rgba(0,0,0,${interpolate(pB, [0, 1], [0.8, 0.5])}) 62%)` }} />}
    </AbsoluteFill>
  )
}

export const TitleShot: React.FC = () => {
  const frame = useCurrentFrame()
  const lineW = interpolate(frame, [0, 6], [0, W], { extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) })
  const open = interpolate(frame, [6, 16], [0, 100], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.quad) })
  const settle = interpolate(frame, [10, 44], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
  const jitter = settle * 26
  const sx = (random(`t-sx-${frame}`) - 0.5) * jitter
  const sliceY = Math.floor(random(`t-sy-${frame}`) * 80)
  const caseOp = interpolate(frame, [46, 58], [0, 0.85], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
  const logoW = 900
  return (
    <AbsoluteFill style={{ background: '#030303' }}>
      {frame < 16 && <div style={{ position: 'absolute', left: (W - lineW) / 2, top: H / 2 - 1, width: lineW, height: 3, background: '#e8f1ee', boxShadow: '0 0 24px #9fd4e0' }} />}
      <AbsoluteFill style={{ clipPath: `inset(${50 - open / 2}% 0 ${50 - open / 2}% 0)`, justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ position: 'relative', width: logoW, transform: `translateX(${sx}px)` }}>
          <Img src={staticFile('brand/lockup-dark.svg')} style={{ width: logoW, display: 'block' }} />
          {settle > 0.05 && (
            <div style={{ position: 'absolute', inset: 0, clipPath: `inset(${sliceY}% 0 ${Math.max(0, 100 - sliceY - 12)}% 0)`, transform: `translateX(${-sx * 2.4}px)`, opacity: 0.8 }}>
              <Img src={staticFile('brand/lockup-dark.svg')} style={{ width: logoW, display: 'block', filter: 'hue-rotate(160deg)' }} />
            </div>
          )}
        </div>
      </AbsoluteFill>
      <div style={{ position: 'absolute', left: 0, right: 0, top: H / 2 + 170, textAlign: 'center', fontFamily: "'Plex Mono', monospace", fontWeight: 500, fontSize: 34, letterSpacing: '0.5em', color: '#e4e2dc', opacity: caseOp }}>CASE 037</div>
      <Grain amount={0.35} seed="title" />
      <Crt level={0.5} seed="title" />
    </AbsoluteFill>
  )
}

export { FullBlack }
