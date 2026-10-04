import React from 'react'
import { Composition } from 'remotion'
import { z } from 'zod'
import { NexusEchoTeaser } from './Teaser'
import { TIMELINE } from './data/types'

export const teaserSchema = z.object({
  /** 45-60 s. The shot timings are authored for 56 s; shortening trims the end, lengthening holds black. */
  durationSeconds: z.number().min(45).max(60),
  audio: z.boolean(),
})

export const Root: React.FC = () => (
  <Composition
    id="NexusEchoTeaser"
    component={NexusEchoTeaser}
    schema={teaserSchema}
    defaultProps={{ durationSeconds: TIMELINE.durationSeconds, audio: true }}
    durationInFrames={TIMELINE.durationSeconds * TIMELINE.fps}
    fps={TIMELINE.fps}
    width={TIMELINE.width}
    height={TIMELINE.height}
    calculateMetadata={({ props }) => ({ durationInFrames: Math.round(Math.min(60, props.durationSeconds) * TIMELINE.fps) })}
  />
)
