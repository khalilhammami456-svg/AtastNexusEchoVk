import React from 'react'
import { Easing, Img, interpolate, staticFile } from 'remotion'
import type { Cam } from '../data/types'
import { H, W } from '../data/types'

const ease = Easing.inOut(Easing.quad)

export function camAt(from: Cam, to: Cam, p: number): Cam {
  const e = ease(Math.min(1, Math.max(0, p)))
  return { scale: interpolate(e, [0, 1], [from.scale, to.scale]), x: interpolate(e, [0, 1], [from.x, to.x]), y: interpolate(e, [0, 1], [from.y, to.y]) }
}

/**
 * Places an element (ew x eh) centred on screen, then moves the camera so that the focus point
 * (x%, y%) of the element sits at screen centre, never showing beyond the element's edge when the
 * element is larger than the screen at that scale.
 */
export function cameraTransform(c: Cam, ew: number, eh: number): string {
  const sw = c.scale * ew
  const sh = c.scale * eh
  let tx = -c.scale * (c.x / 100 - 0.5) * ew
  let ty = -c.scale * (c.y / 100 - 0.5) * eh
  if (sw > W) { const lim = sw / 2 - W / 2; tx = Math.max(-lim, Math.min(lim, tx)) }
  if (sh > H) { const lim = sh / 2 - H / 2; ty = Math.max(-lim, Math.min(lim, ty)) }
  return `translate(${tx.toFixed(2)}px, ${ty.toFixed(2)}px) scale(${c.scale.toFixed(4)})`
}

export const Camera: React.FC<{
  src: string
  fit: 'cover' | 'object'
  objectHeight?: number
  naturalRatio?: number
  cam: Cam
  filter: string
  shadow?: boolean
  children?: React.ReactNode
}> = ({ src, fit, objectHeight, naturalRatio, cam, filter, shadow, children }) => {
  const ew = fit === 'cover' ? W : Math.round((objectHeight ?? 1000) * (naturalRatio ?? 1))
  const eh = fit === 'cover' ? H : objectHeight ?? 1000
  return (
    <div style={{ position: 'absolute', left: (W - ew) / 2, top: (H - eh) / 2, width: ew, height: eh, transform: cameraTransform(cam, ew, eh), transformOrigin: '50% 50%', filter, boxShadow: shadow ? '0 30px 120px rgba(0,0,0,0.9)' : undefined }}>
      <Img src={staticFile(src)} style={{ width: '100%', height: '100%', objectFit: fit === 'cover' ? 'cover' : 'fill', display: 'block' }} />
      {children}
    </div>
  )
}
