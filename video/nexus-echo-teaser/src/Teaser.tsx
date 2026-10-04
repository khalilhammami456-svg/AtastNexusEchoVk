import React from 'react'
import { AbsoluteFill, Audio, Sequence, staticFile } from 'remotion'
import { loadFonts } from './fonts'
import { FullBlack } from './components/fx'
import { ImageShot, Montage, PhoneShot, RevealShot, TitleShot } from './components/shots'
import { TIMELINE, sec } from './data/types'

loadFonts()

export const NexusEchoTeaser: React.FC<{ audio: boolean }> = ({ audio }) => (
  <AbsoluteFill style={{ background: '#000' }}>
    {TIMELINE.shots.map((shot) => {
      const from = sec(shot.start)
      const dur = sec(shot.start + shot.dur) - from
      return (
        <Sequence key={shot.id} from={from} durationInFrames={dur} name={shot.id} premountFor={30}>
          {shot.kind === 'image' && <ImageShot spec={shot} dur={shot.dur} id={shot.id} />}
          {shot.kind === 'phone' && <PhoneShot shot={shot} />}
          {shot.kind === 'montage' && <Montage shot={shot} />}
          {shot.kind === 'reveal' && <RevealShot shot={shot} />}
          {shot.kind === 'black' && <FullBlack />}
          {shot.kind === 'title' && <TitleShot />}
        </Sequence>
      )
    })}
    {audio && <Audio src={staticFile('audio/teaser-mix.wav')} />}
  </AbsoluteFill>
)
