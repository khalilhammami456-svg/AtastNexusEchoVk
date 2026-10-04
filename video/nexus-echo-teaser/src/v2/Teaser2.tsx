import React from 'react'
import { AbsoluteFill, Sequence } from 'remotion'
import { loadFonts } from '../fonts'
import { FullBlack } from '../components/fx'
import { TitleShot } from '../components/shots'
import { MonitorWall } from './sets/MonitorWall'
import { DeskEvidence, DeskWorld } from './sets/Desk'
import { PhoneInsert } from './sets/Phone'
import { Board } from './sets/Board'
import { TapeDeck } from './sets/TapeDeck'
import { NotePen } from './sets/NotePen'
import { Corridor } from './sets/Corridor'
import { Fragments } from './sets/Fragments'
import { AudioBus } from './AudioBus'
import { Degrade } from './Degrade'
import { FPS, sec, shotsFor, type EndingVariant, type HookVariant, type Version } from './data'

loadFonts()

export interface TeaserProps { version: Version; hook: HookVariant; ending: EndingVariant; audio: boolean }

const HookWall: React.FC<{ dur: number }> = ({ dur }) => (
  <MonitorWall
    mode="hook"
    segments={[{ from: 0, to: dur, cam: { x0: 120, x1: 760, y0: 20, y1: -10, s0: 1.08, s1: 1.0 } }]}
    wake={[0.2, 1.1, 2.0, 2.0, 2.1, 2.1]}
    clock={{ h: 3, m: 16, s: 56 }}
  />
)

const AnomalyWall: React.FC<{ dur: number }> = ({ dur }) => (
  <MonitorWall
    mode="anomaly"
    segments={[
      { from: 0, to: 1.4, cam: { x0: 470, x1: 490, y0: 30, y1: 25, s0: 2.05, s1: 2.2 } },
      { from: 1.4, to: 4.8, cam: { x0: 300, x1: 620, y0: 0, y1: 0, s0: 1.0, s1: 1.04 } },
      { from: 4.8, to: dur, cam: { x0: 480, x1: 485, y0: 30, y1: 20, s0: 2.4, s1: 2.6 } },
    ]}
    wake={[0, 0, 0, 0, 0, 0]}
    die={[1.9, 2.6, 3.2, 3.7, null, 4.2]}
    clock={{ h: 3, m: 17, s: 5 }}
    dropout={[sec(6.2), sec(6.45)]}
  />
)

const FinalWall: React.FC = () => (
  <MonitorWall mode="final" segments={[{ from: 0, to: 3.4, cam: { x0: 560, x1: 575, y0: 0, y1: 0, s0: 1.0, s1: 1.03 } }]} wake={[]} clock={{ h: 3, m: 17, s: 11 }} showRec={false} freezeClock />
)

export const NexusEchoTeaser2: React.FC<TeaserProps> = ({ hook, ending, audio, version }) => {
  const { shots } = shotsFor(ending)
  return (
    <AbsoluteFill style={{ background: '#000' }}>
      {shots.map((s) => {
        const from = sec(s.start)
        const dur = sec(s.start + s.dur) - from
        let body: React.ReactNode = <AbsoluteFill style={{ background: '#111', color: '#fff', fontSize: 60 }}>{s.id}</AbsoluteFill>
        if (s.visual === 'black') body = <FullBlack />
        else if (s.id === 'B02-hook-monitor-wall') body = hook === 'A' ? <HookWall dur={s.dur} /> : <Corridor name="corridor_a" seed="hookB" crt={0.5} />
        else if (s.id === 'B08-corridor-dolly-a') body = <Corridor name="corridor_a" seed="cA" dim={0.62} flickers={[96, 98, 99, 102, 105, 106]} />
        else if (s.id === 'B12-corridor-dolly-b') body = <Corridor name="corridor_b" seed="cB" clock={{ h: 3, m: 14, s: 20 }} crt={0.6} dim={0.55} />
        else if (s.id === 'B13-fragments') body = <Fragments total={s.dur} figure={<Corridor name="corridor_figure" hud={false} seed="fig" crt={0.55} />} />
        else if (s.id === 'B06-anomaly') body = <AnomalyWall dur={s.dur} />
        else if (s.id === 'B15-final-image') body = <FinalWall />
        else if (s.id === 'B03-world-desk') body = <DeskWorld total={dur} />
        else if (s.id === 'B04-phone-insert') body = <PhoneInsert total={dur} />
        else if (s.id === 'B09-evidence-board') body = <Board total={dur} />
        else if (s.id === 'B10-tape-insert') body = <TapeDeck total={dur} />
        else if (s.id === 'B11-note-stops') body = <NotePen total={dur} />
        else if (s.id === 'B05-evidence-drop') body = <DeskEvidence total={dur} />
        else if (s.visual === 'title') body = <TitleShot />
        return (
          <Sequence key={s.id} from={from} durationInFrames={dur} name={s.id} premountFor={FPS}>
            {body}
          </Sequence>
        )
      })}
      <Degrade shots={shots} />
      {audio && <AudioBus version={version} ending={ending} />}
    </AbsoluteFill>
  )
}
