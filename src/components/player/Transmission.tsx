/**
 * A recorded transmission, played as one: signal, reception, message,
 * disconnection.
 *
 * A bare audio control makes a recording feel like a file in a folder. This
 * wraps the same recording in the states a received signal passes through, so
 * the player sees (and, if sound is on, hears) the link open before the voice
 * starts and close when it ends. The audio is always started by the player;
 * nothing here ever autoplays.
 *
 *   STANDBY   -> nothing received yet
 *   RECEIVING -> link open, voice playing, with the running time
 *   PAUSED    -> link held
 *   LOST      -> the recording ended; the link closed
 *   FAILED    -> the file could not be loaded
 *
 * Only one transmission plays at a time, anywhere in the app: starting one
 * pauses the others. A hidden page pauses the current one, so a locked phone
 * never keeps talking. The transcript, when there is one, is passed in and
 * stays visible beside the controls: the voice is never the only carrier.
 */

import { useCallback, useEffect, useId, useRef, useState } from 'react'
import { useSound } from '@/app/providers/SoundProvider'
import { cn } from '@/lib/utils'
import { BureauIcons } from '@/components/bureau'

type LinkState = 'standby' | 'receiving' | 'paused' | 'lost' | 'failed'

/** The one transmission that is currently playing, if any. */
let active: { id: string; pause: () => void } | null = null

/** Lets the signal-open cue land before the voice begins. */
const LEAD_IN_MS = 380

const clock = (seconds: number) =>
  `${Math.floor(seconds / 60).toString().padStart(2, '0')}:${Math.floor(seconds % 60).toString().padStart(2, '0')}`

const STATUS: Record<LinkState, string> = {
  standby: 'STANDBY',
  receiving: 'SIGNAL RECEIVED',
  paused: 'LINK HELD',
  lost: 'SIGNAL LOST · END OF RECORDING',
  failed: 'NO SIGNAL · RECORDING UNAVAILABLE',
}

export interface TransmissionProps {
  src: string
  /** Who or what is transmitting. Shown beside the controls. */
  source?: string
  className?: string
}

export function Transmission({ src, source, className }: TransmissionProps) {
  const id = useId()
  const audioRef = useRef<HTMLAudioElement>(null)
  const leadTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const { play } = useSound()
  const [state, setState] = useState<LinkState>('standby')
  const [duration, setDuration] = useState(0)
  const [current, setCurrent] = useState(0)

  const pause = useCallback(() => {
    if (leadTimer.current) {
      clearTimeout(leadTimer.current)
      leadTimer.current = null
    }
    audioRef.current?.pause()
  }, [])

  // Pause when the page is hidden, and when the player leaves the screen.
  useEffect(() => {
    const onHidden = () => {
      if (document.hidden) pause()
    }
    document.addEventListener('visibilitychange', onHidden)
    return () => {
      document.removeEventListener('visibilitychange', onHidden)
      pause()
      if (active?.id === id) active = null
    }
  }, [id, pause])

  const begin = () => {
    const audio = audioRef.current
    if (!audio) return
    // One voice at a time.
    if (active && active.id !== id) active.pause()
    active = { id, pause }
    const start = () => {
      leadTimer.current = null
      audio.play().catch(() => setState('failed'))
    }
    if (audio.currentTime === 0 || state === 'lost') {
      // A fresh reception: the link opens first.
      if (state === 'lost') audio.currentTime = 0
      const cued = play('signal-open')
      setState('receiving')
      if (cued) leadTimer.current = setTimeout(start, LEAD_IN_MS)
      else start()
    } else {
      start()
    }
  }

  const toggle = () => {
    if (state === 'receiving') pause()
    else begin()
  }

  const progress = duration > 0 ? Math.min(current, duration) : 0

  return (
    <div className={cn('border border-nexus-border bg-nexus-surfaceElevated p-3', className)}>
      <audio
        ref={audioRef}
        src={src}
        preload="metadata"
        onLoadedMetadata={event =>
          setDuration(Number.isFinite(event.currentTarget.duration) ? event.currentTarget.duration : 0)
        }
        onTimeUpdate={event => setCurrent(event.currentTarget.currentTime)}
        onPlaying={() => setState('receiving')}
        onPause={event => {
          // `pause` also fires when playback reaches the end; ended handles that.
          if (!event.currentTarget.ended) setState(prev => (prev === 'receiving' ? 'paused' : prev))
        }}
        onEnded={() => {
          setState('lost')
          play('signal-close')
          if (active?.id === id) active = null
        }}
        onError={() => setState('failed')}
      />

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={toggle}
          disabled={state === 'failed'}
          aria-pressed={state === 'receiving'}
          aria-label={state === 'receiving' ? 'Hold the link' : state === 'lost' ? 'Replay the recording' : 'Play the recording'}
          className="nx-action !min-h-12 !w-12 shrink-0 !px-0"
        >
          {state === 'receiving' ? (
            <BureauIcons.Pause className="bureau-icon w-5 h-5" aria-hidden="true" />
          ) : (
            <BureauIcons.Play className="bureau-icon w-5 h-5" aria-hidden="true" />
          )}
        </button>
        <div className="min-w-0 flex-1">
          {source && (
            <p className="truncate font-mono text-[0.8125rem] uppercase tracking-[0.12em] text-nexus-text">{source}</p>
          )}
          <p
            className={cn(
              'font-mono text-[0.8125rem] uppercase tracking-[0.14em]',
              state === 'receiving' ? 'text-nexus-accent' : state === 'failed' ? 'text-nexus-warning' : 'text-nexus-textSubtle',
            )}
            role="status"
          >
            {STATUS[state]}
          </p>
        </div>
        <span className="shrink-0 font-mono text-[0.8125rem] tabular-nums text-nexus-textSubtle">
          {clock(progress)} / {duration ? clock(duration) : '--:--'}
        </span>
      </div>

      <input
        type="range"
        min={0}
        max={duration || 0}
        step={0.1}
        value={progress}
        onChange={event => {
          const value = Number(event.target.value)
          if (audioRef.current) audioRef.current.currentTime = value
          setCurrent(value)
        }}
        aria-label="Recording timeline"
        className="mt-2 h-11 w-full accent-nexus-accent"
        disabled={!duration || state === 'failed'}
      />
    </div>
  )
}
