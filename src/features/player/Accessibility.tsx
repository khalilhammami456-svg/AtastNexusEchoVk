/**
 * NEXUS — Device Settings (Display & Access)
 *
 * The one screen a player is allowed to open before anyone signs in.
 *
 * These controls exist because the interface used to assume a specific
 * handset, a specific viewer and a specific player. Every preference here is
 * applied immediately to the whole application, so a player can set the text
 * size they need and then judge the rest of the game in the size they will
 * actually play it at.
 *
 * Reachable pre-auth on purpose: a legibility problem should not require an
 * account to fix.
 */

import { useNavigate } from 'react-router-dom'
import { useApp } from '@/app/providers'
import { useSound } from '@/app/providers/SoundProvider'
import {
  useAccessibility,
  SCALE_LABELS,
  SCALE_ORDER,
  type ContrastMode,
  type MotionMode,
  type TransparencyMode,
  type UIScale,
} from '@/app/providers'
import { ROUTES } from '@/app/config'
import { cn } from '@/lib/utils'
import { BureauIcons } from '@/components/bureau'

interface Choice<T extends string> {
  value: T
  label: string
  hint: string
}

function ChoiceRow<T extends string>({
  legend,
  description,
  choices,
  selected,
  onSelect,
  name,
}: {
  legend: string
  description: string
  choices: Choice<T>[]
  selected: T
  onSelect: (value: T) => void
  name: string
}) {
  return (
    <fieldset className="nx-panel">
      <legend className="nx-eyebrow px-1">{legend}</legend>
      <p className="nx-body text-nexus-textMuted mt-2 max-w-[60ch]">{description}</p>

      <div
        role="radiogroup"
        aria-label={legend}
        className="mt-5 grid gap-3 sm:grid-cols-2"
      >
        {choices.map(choice => {
          const isSelected = choice.value === selected
          const inputId = `${name}-${choice.value}`
          const hintId = `${inputId}-hint`
          return (
            <div
              key={choice.value}
              className={cn(
                'nx-panel flex flex-col gap-1 transition-colors duration-150',
                isSelected
                  ? 'border-nexus-accent bg-nexus-accentBg'
                  : 'hover:border-nexus-borderStrong hover:bg-nexus-surfaceElevated',
              )}
            >
              {/* The label wraps the control and its name only. The hint is
                  referenced by aria-describedby instead, so assistive
                  technology announces "Largest" rather than reading the
                  explanation as part of the option's name. */}
              <label htmlFor={inputId} className="flex items-center gap-3 cursor-pointer">
                <input
                  id={inputId}
                  type="radio"
                  name={name}
                  value={choice.value}
                  checked={isSelected}
                  onChange={() => onSelect(choice.value)}
                  aria-describedby={hintId}
                  className="sr-only peer"
                />
                <span
                  aria-hidden="true"
                  className={cn(
                    'shrink-0 w-5 h-5 border flex items-center justify-center',
                    'peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-nexus-accent peer-focus-visible:outline-offset-2',
                    isSelected
                      ? 'border-nexus-accent bg-nexus-accent text-nexus-bg'
                      : 'border-nexus-border',
                  )}
                >
                  {isSelected && <BureauIcons.Check className="bureau-icon w-3.5 h-3.5" />}
                </span>
                <span className={cn('nx-body', isSelected ? 'text-nexus-text' : 'text-nexus-textMuted')}>
                  {choice.label}
                </span>
              </label>
              <span id={hintId} className="nx-meta text-nexus-textSubtle pl-8">
                {choice.hint}
              </span>
            </div>
          )
        })}
      </div>
    </fieldset>
  )
}

const SCALE_CHOICES: Choice<UIScale>[] = SCALE_ORDER.map(scale => ({
  value: scale,
  label: SCALE_LABELS[scale],
  hint: scale === 'compact' ? 'Densest layout' : scale === 'xlarge' ? 'Largest type and spacing' : 'Roomier',
}))

const CONTRAST_CHOICES: Choice<ContrastMode>[] = [
  { value: 'standard', label: 'Standard', hint: 'The Bureau default palette' },
  { value: 'boost', label: 'High contrast', hint: 'Brighter text, defined borders' },
]

const MOTION_CHOICES: Choice<MotionMode>[] = [
  { value: 'full', label: 'Full motion', hint: 'Transitions and signal movement' },
  { value: 'reduced', label: 'Reduced motion', hint: 'State changes appear instantly' },
]

const TRANSPARENCY_CHOICES: Choice<TransparencyMode>[] = [
  { value: 'full', label: 'Layered', hint: 'Translucent panels over the backdrop' },
  { value: 'reduced', label: 'Solid', hint: 'Opaque panels, no blur' },
]

const SOUND_CHOICES: Choice<'on' | 'off'>[] = [
  { value: 'on', label: 'Cues on', hint: 'Brief sounds when something in the case changes' },
  { value: 'off', label: 'Silent', hint: 'Nothing the interface does makes a sound' },
]

const ROOM_TONE_CHOICES: Choice<'on' | 'off'>[] = [
  { value: 'off', label: 'Off', hint: 'Silence between events (default)' },
  { value: 'on', label: 'Room tone', hint: 'A faint low hum under the case' },
]

export function PlayerAccessibility() {
  const navigate = useNavigate()
  const { player } = useApp()
  const { scale, contrast, motion, transparency, setScale, setContrast, setMotion, setTransparency, resetPreferences } =
    useAccessibility()
  const sound = useSound()

  return (
    <div className="page py-8">
      <div className="mx-auto w-full max-w-3xl px-4 md:px-6">
        <div className="nexus-case-shell">
          <div className="nexus-case-header">
            <span className="section-label">Device</span>
            <span className="case-number-tag">SETTINGS</span>
          </div>

          <div className="nexus-case-body nx-stack-loose">
            <div>
              <h1 className="heading-1">Display &amp; Access</h1>
              <p className="nx-lead text-nexus-textMuted mt-3 max-w-[56ch]">
                These settings apply immediately to every screen, and are remembered on this device. Nothing here
                changes what other players on your team see.
              </p>
            </div>

            <ChoiceRow
              name="ui-scale"
              legend="Text size"
              description="Scales type, spacing and controls together. The layout reflows instead of scrolling sideways."
              choices={SCALE_CHOICES}
              selected={scale}
              onSelect={setScale}
            />

            <ChoiceRow
              name="contrast"
              legend="Contrast"
              description="High contrast brightens text and strengthens borders, for bright rooms or reduced vision."
              choices={CONTRAST_CHOICES}
              selected={contrast}
              onSelect={setContrast}
            />

            <ChoiceRow
              name="motion"
              legend="Motion"
              description="Reduced motion removes movement while keeping every state change visible."
              choices={MOTION_CHOICES}
              selected={motion}
              onSelect={setMotion}
            />

            <ChoiceRow
              name="transparency"
              legend="Transparency"
              description="Solid panels trade atmosphere for maximum text legibility."
              choices={TRANSPARENCY_CHOICES}
              selected={transparency}
              onSelect={setTransparency}
            />

            <ChoiceRow
              name="sound"
              legend="Sound"
              description="Everything the interface says with sound is also shown on screen, so nothing is lost when this is off. Recordings in the archive are always played by you, and ignore this setting. A phone's silent switch can mute these cues but not the recordings."
              choices={SOUND_CHOICES}
              selected={sound.enabled ? 'on' : 'off'}
              onSelect={value => sound.setEnabled(value === 'on')}
            />

            {sound.enabled && (
              <fieldset className="nx-panel">
                <legend className="nx-eyebrow px-1">Volume</legend>
                <div className="mt-2 flex items-center gap-4">
                  <input
                    id="sound-volume"
                    type="range"
                    min={0}
                    max={100}
                    step={5}
                    value={Math.round(sound.volume * 100)}
                    onChange={event => sound.setVolume(Number(event.target.value) / 100)}
                    aria-label="Sound volume"
                    aria-valuetext={`${Math.round(sound.volume * 100)} percent`}
                    className="h-11 w-full accent-[var(--nexus-accent,#6fb3c4)]"
                  />
                  <output htmlFor="sound-volume" className="nx-meta w-12 shrink-0 text-right tabular-nums text-nexus-textMuted">
                    {Math.round(sound.volume * 100)}%
                  </output>
                </div>
                <div className="mt-3">
                  <button type="button" onClick={() => sound.play('verify')} className="nx-action-ghost">
                    <span>Play a test cue</span>
                  </button>
                </div>
              </fieldset>
            )}

            {sound.enabled && (
              <ChoiceRow
                name="room-tone"
                legend="Room tone"
                description="Optional. The case is quiet by design; this adds a faint hum under it for players who want the room to feel occupied."
                choices={ROOM_TONE_CHOICES}
                selected={sound.ambience ? 'on' : 'off'}
                onSelect={value => sound.setAmbience(value === 'on')}
              />
            )}

            {/* A live specimen. Preferences are easy to change and impossible to
                judge in the abstract, so the result is shown on the spot. */}
            <div className="nx-stage">
              <span className="nx-eyebrow">Preview</span>
              <p className="nx-display mt-4">Case 037</p>
              <p className="nx-prose text-nexus-textMuted mt-3">
                Recovered at 03:17:11 from camera 07. The frame is degraded and partially recovered; the
                corridor behind the subject is not resolvable at this exposure.
              </p>
              <div className="nx-row flex-wrap mt-5">
                <span className="nx-chip" data-tone="verified">Verified</span>
                <span className="nx-chip" data-tone="warning">Degraded</span>
                <span className="nx-chip" data-tone="danger">Anomalous</span>
              </div>
            </div>

            <div className="nx-row flex-wrap gap-3">
              <button
                type="button"
                onClick={() => {
                  resetPreferences()
                  sound.resetSound()
                }}
                className="nx-action-ghost"
              >
                <BureauIcons.Refresh className="bureau-icon w-4 h-4" />
                <span>Restore defaults</span>
              </button>
              <button
                type="button"
                onClick={() => navigate(player ? ROUTES.PLAYER_GAME : ROUTES.PLAYER_LOGIN)}
                className="nx-action"
              >
                <span>{player ? 'Return to case' : 'Back to sign in'}</span>
                <BureauIcons.Forward className="bureau-icon w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
