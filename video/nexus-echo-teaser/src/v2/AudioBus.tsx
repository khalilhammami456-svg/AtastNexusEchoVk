import React from 'react'
import { Audio } from '@remotion/media'
import { staticFile } from 'remotion'
import { FPS, sec, type EndingVariant, type Version } from './data'

/** Stems and their balance. The stems come from scripts/audio2/build.mjs (one folder per version). */
const STEMS: Array<{ file: string; volume: number }> = [
  { file: 'ambience', volume: 1 },
  { file: 'music', volume: 1 },
  { file: 'tension', volume: 1 },
  { file: 'sfx_story', volume: 1 },
  { file: 'sfx_device', volume: 1 },
  { file: 'impacts', volume: 1 },
  { file: 'voice', volume: 1 },
]

/**
 * Ending B drops the silent tail (48.0 -> 53.3 s): every stem stops at the cut and the title sting stem is
 * trimmed so that only its last part (from 53.3 s) plays, starting at the cut.
 */
export const AudioBus: React.FC<{ version: Version; ending: EndingVariant }> = ({ version, ending }) => {
  const dir = `audio/v2/${version}`
  const cut = 48.0
  const stingFrom = 53.3
  return (
    <>
      {/* Ending A plays the balanced, limited mix (the sum of the raw stems can exceed full scale). */}
      {ending === 'A' ? (
        <Audio src={staticFile(`${dir}/mix.wav`)} />
      ) : (
        STEMS.map((s) => <Audio key={s.file} src={staticFile(`${dir}/${s.file}.wav`)} volume={s.volume * 0.72} durationInFrames={sec(cut)} />)
      )}
      {ending === 'A' ? null : <Audio src={staticFile(`${dir}/sting.wav`)} trimBefore={Math.round(stingFrom * FPS)} from={sec(cut)} />}
    </>
  )
}
