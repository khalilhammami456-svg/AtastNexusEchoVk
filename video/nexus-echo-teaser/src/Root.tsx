import React from 'react'
import { Composition } from 'remotion'
import { z } from 'zod'
import { NexusEchoTeaser2 } from './v2/Teaser2'
import { BASE, FPS, H, W, shotsFor } from './v2/data'

export const teaserSchema = z.object({
  version: z.enum(['A', 'B', 'C']),
  hook: z.enum(['A', 'B']),
  ending: z.enum(['A', 'B']),
  audio: z.boolean(),
})

export const Root: React.FC = () => (
  <Composition
    id="NexusEchoTeaser"
    component={NexusEchoTeaser2 as unknown as React.FC<Record<string, unknown>>}
    schema={teaserSchema}
    defaultProps={{ version: 'A' as const, hook: 'A' as const, ending: 'A' as const, audio: true }}
    durationInFrames={BASE.durationSeconds * FPS}
    fps={FPS}
    width={W}
    height={H}
    calculateMetadata={({ props }) => ({ durationInFrames: Math.round(Math.min(60, shotsFor(props.ending).total) * FPS) })}
  />
)
