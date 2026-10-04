# NEXUS ECHO teaser v2 - audio plan

Status: generated, measured, **never listened to**. The author of this audio (an AI agent working in a sandbox with no audio output) could not hear a single sample. Everything below that sounds like a claim about how it "feels" is design intent plus numerical checks (levels, spectrograms, onset detection, silence scans). A human must audition all three versions before they ship.

Everything is original synthesis in plain Node (`scripts/audio2/*.mjs`) plus `ffmpeg` for decoding the one voice clip and for loudness/spectrogram measurement. The generator is deterministic (two consecutive builds of version A produced byte-identical WAVs).

## 1. How to build and check

```
cd video/nexus-echo-teaser
node scripts/audio2/build.mjs --version=A     # or B, C, all (default all) ; ~18 s per version
node scripts/audio2/qa.mjs all                # numeric QA + spectrogram PNGs in scripts/audio2/qa/
node scripts/audio2/qa_table.mjs A            # per-section RMS table from levels.json
```

Output per version, in `public/audio/v2/<A|B|C>/`: `ambience.wav music.wav tension.wav sfx_story.wav sfx_device.wav impacts.wav voice.wav sting.wav mix.wav levels.json`. All WAVs are 48 kHz / stereo / 16-bit / exactly 56.000 s (2 688 000 frames). Size is about 10.8 MB per file, about 93 MB per version, 278 MB for the three (see the size note in section 9).

Source files: `dsp.mjs` (filters, reverb, tape echo, limiter, WAV writer), `sfx.mjs` (foley and device recipes), `music.mjs` (motif, drone, piano, pad, pulse), `build.mjs` (cue router, version tables, mix), `qa.mjs`, `qa_table.mjs`.

The generator reads `src/data/timeline2.json`. Every one of the 64 `audioCues` is routed to a stem and logged in `levels.json` (`cues[]`: cue, time, stem, what was done). The build throws if any cue is not honoured. The two `silence` cues are honoured by the silence windows. Cue times are used as given; nothing is moved. Window boundaries come from the shot list (B07, B14, B16).

## 2. Direction

Uneasy, retro, forensic, electronic, analog, minimal, psychological, restrained. The sound world is the room itself: CRT monitors waking, a fluorescent desk lamp, a dictaphone-era tape deck, relays, paper, a corridor. Music is one three-note idea and a thin machine pulse, not an orchestra. Deliberately avoided: orchestral swells, trailer "braams", superhero percussion, string-section horror, generic "dark cinematic" pads and risers.

No story is added. Nothing in the sound states or implies the twist (the spoiler map forbids it); the sound only implies unreliable records: a tape that stops at 03:17, monitors that die one by one, a corridor that hums.

## 3. Layers (stems) and what each is for

| Stem | Content | Purpose |
|---|---|---|
| `ambience` | Room tone (pink noise, low-passed, HP 38 Hz); 50 Hz CRT mains hum, one oscillator group per monitor, each switching on at its `crt_power` cue and, for monitors 2-6, off at the five "monitor dies" relay cues; 100 Hz fluorescent lamp buzz (desk scenes B03-B05 and the pen macro B11); tape hiss (from the `tape_hiss` cue, again under the tape deck); corridor sub hum 50/55.3 Hz + ventilation air + distant lamp (from `hum_on`, growing towards the climax); final "CRT hum only, very low" at 49.2 and under the title | Makes the world physical and tells the viewer where they are. Scene-motivated: the hum thins when the camera leaves the monitors, and drops monitor by monitor as the wall dies. |
| `music` | The motif (3 notes with tape echo), analog drone, sparse piano-like tone, machine pulse, sub bass, detuned-saw cluster pad, climax shimmer | The score. Evolves 0 -> climax -> hard cut. |
| `tension` | 41 Hz beating sub pressure (builds in B06, returns, climbs to the climax); heartbeat 56 -> 150 bpm; 42-47.9 riser (filtered noise + rising sub + a tight tonal glide) | Physiological pressure. The heartbeat is the only thing that accelerates continuously. |
| `sfx_story` | Paper slide / drop / open, soft thud, pen underline and writing, pen tip lift, pin strikes, string pulls, footsteps (corridor reverb), cassette insert thunk, tape motor + dead stop, shutter and 18 rapid shutters | The physical evidence being handled. |
| `sfx_device` | Relay clicks (normal, and heavier "monitor dies"), CRT power-on thump + rising 15 kHz whine, static bursts, phone buzz (2), REC beeps | The machines. No keyboard sounds: no keyboard cue exists and none was invented. |
| `impacts` | Three `impact_low` hits (soft / harder / hard) and two electrical light flickers | Punctuation, used three times only. |
| `voice` | The Rahal line (section 6) | Intelligibility is the priority; everything else is ducked under it. |
| `sting` | `motif_final` at 51.4 and the title sting at 53.3 | The two last sounds. |
| `mix` | Balanced sum, soft limiter, peak -2.0 dBFS | What goes into the video if no stem mixing is wanted. |

## 4. The motif

Three notes: **A2 (110 Hz) - Bb2 (116.5 Hz) - E3 (164.8 Hz)**. A against Bb is a minor second; Bb against E is a tritone; A against E is a bare fifth. The result is a small, unresolved, slightly sick cluster that is still clearly "a tune": three notes, always in this order, always on the same pitches.

Sound: 2 detuned voices per note (about +-3.5 cents), 9 additive harmonics (1/h^1.25), tape transport model (slow wow 0.62 Hz, flutter 6 and 11 Hz, the note enters flat and sags in the tail), time-varying low-pass (bright at onset, darker), tanh saturation. It goes into a ping-pong tape echo (about 0.66 s, feedback 0.58, each repeat darker and dirtier because filtering and saturation sit inside the loop, delay time wobbling). The echo is the "echo" of the title.

Appearances (all from the cues):

| Cue | t | What |
|---|---|---|
| `motif_note` 1 | 3.3 | A2 alone, very soft, echo tail about 11 s |
| `motif_note` 2 | 17.6 | Bb2 alone, slightly louder |
| `motif_note` 3 | 31.0 | E3 alone, louder again. The tune is now complete in the viewer's memory. |
| `motif_final` | 51.4 | All three at once, detuned (-14, +16, -9 cents), swelling in over 160 ms, long decay (tau about 7 s) that is **still ringing when the black cuts it at 52.6**. A faint A1 sub sine underneath. The cluster that was introduced one note at a time arrives as a single wrong chord. It is the only sound in the last 4 s. |

The pad (34-48 s) and the pulse reuse the same pitch set (Bb2/E3/A3 and A1/Bb1/E2), so the harmonic tension at the climax is the motif's own tension, not new material.

## 5. Cue-by-cue table (version A; B and C use identical times)

| t (s) | cue | stem | what was made |
|---|---|---|---|
| 0.20 | room_tone | ambience | thin room tone fades in over 0.8 s |
| 0.90 / 1.90 / 2.80 | relay_click | sfx_device | monitor 1 / 2 / 3 relay, 100 ms before each CRT power-on |
| 1.00 / 2.00 | crt_power | sfx_device | degauss thump + 50 Hz coil + rising 15.4 kHz whine (and audible 7.7 kHz sub-harmonic); each also starts that monitor's hum |
| 2.90 | crt_power | sfx_device | monitors 3-6 together, 4 staggered instances (0 / 30 / 70 / 110 ms), softer, different whine pitches |
| 3.30 | motif_note | music | note 1 (A2) |
| 4.60 | static_burst | sfx_device | 0.14 s, hard end |
| 5.00 | lamp_buzz, tape_hiss | ambience | 100 Hz lamp buzz fades in, tape hiss (low) fades in; CRT hum drops to 30 % (camera left the monitors) |
| 6.30 | paper_slide | sfx_story | 0.95 s band-passed noise, centre sweeps 1.3 -> 3.3 kHz |
| 8.20 | soft_thud | sfx_story | wood-desk thump |
| 9.30 | paper_open | sfx_story | folder flap swoosh + snap |
| 10.00 / 10.32 | phone_buzz | sfx_device | two vibration-motor buzzes on a desk (0.26 s and 0.20 s) |
| 10.60 | relay_click | sfx_device | screen wakes |
| 12.50 | shutter | sfx_story | two-stage mechanical shutter |
| 12.70 | paper_drop | sfx_story | sheet lands + settling flutter |
| 15.00 | paper_slide | sfx_story | 0.80 s |
| 16.40 | pen_scratch | sfx_story | 1.6 s one long underline stroke |
| 17.60 | motif_note | music | note 2 (Bb2) |
| 18.60 / 19.60 | rec_beep | sfx_device | 1850 Hz CAM-07 REC beeps (ambience hum returns to full at 18.8) |
| 20.10 | voice | voice | the Rahal line, ends dead at 23.10 |
| 20.40 / 21.10 / 21.70 / 22.20 / 22.70 | relay_click | sfx_device | heavy "monitor dies" relays; each also removes one monitor's hum (monitors 2-6; monitor 1 = CAM-07 stays) |
| 23.40 / 24.00 | rec_beep | sfx_device | the last two REC beeps (03:17:10) |
| 24.70 | static_burst | sfx_device | 0.30 s, runs straight into the hard cut at 25.0 |
| 25.0-26.0 | silence | all | exact digital zero in every stem |
| 26.00 | hum_on | ambience | corridor sub hum returns (120 ms attack, no fade-in) |
| 26.50 | footstep | sfx_story | 5 slow soft steps, 26.5 / 27.5 / 28.5 / 29.5 / 30.5, alternating L/R, big-corridor reverb (RT about 1 s) |
| 28.00 | heartbeat_start | tension | 56 bpm, very soft; also where the machine pulse starts (A: 28.0) |
| 29.20 | light_flicker | impacts | 0.55 s mains-buzz stutter, lamp recovers |
| 30.80 / 31.90 / 33.00 | pin_strike | sfx_story | cork + metal-pin tick |
| 31.00 | motif_note | music | note 3 (E3) |
| 31.20 / 32.30 / 33.40 | string_pull | sfx_story | friction rub on the twine, then a taut twang that settles |
| 34.30 | tape_insert | sfx_story | the **thunk lands on the cue**; the plastic scrape starts 0.2 s earlier |
| 34.80 | motor_whir | sfx_story | reels spin up, steady whir with hub ticks; level drops 8 dB when the pen scene begins (37.6); runs to 39.2 |
| 35.80 | rec_beep | sfx_device | 1320 Hz, longer: the deck's REC light, a different machine from CAM-07 |
| 37.60 | pen_scratch | sfx_story | 1.6 s of short writing strokes with pauses; ends dead at 39.2 |
| 39.20 | pen_stop | sfx_story | the pen strokes end mid-stroke; a tiny tip-lift tick; the tape motor also stops dead with a clunk 70 ms later (the manual stop at 03:17); ambience, music and tension dip 14 dB for about 0.9 s ("silence for the pen") |
| 40.00 | flicker_cut | impacts | 1.0 s lights failing: stutter gets shorter, buzz droops 100 -> 65 Hz, ends with a cold-tube tunk and stays dead |
| 40.40 / 40.90 / 41.30 | footstep | sfx_story | three faster, harder steps |
| 42.00 | shutter_rapid | sfx_story | 18 shutters, intervals shrinking from 0.70 s to 0.15 s, last at 46.8 (leaving the final 1.2 s of B13 for the held figure), level rising -24 -> -12 dBFS |
| 42.00 | riser | tension | filtered noise (250 Hz -> about 7 kHz, Q 2.5 -> 9.5), sub 36 -> 88 Hz, tonal glide 196 -> 823 Hz; amplitude follows u^2 and ends at 47.9 |
| 42.00 | heartbeat_accel | tension | 74 bpm at 42.0 accelerating to 150 bpm at 47.9; amplitude 0.42 -> 1.0 |
| 44.00 / 46.00 / 47.60 | impact_low | impacts | hardness 0.3 / 0.65 / 1.0: sub drop, body thud, dull slam, inharmonic ring; hall reverb; the third is cut by 48.0 |
| 48.0-49.2 | silence | all | exact digital zero |
| 49.20 | room_tone | ambience | CRT hum of one monitor + a whisper of room tone, about -41 dB RMS |
| 51.40 | motif_final | sting | see section 4 |
| 52.6-53.3 | final black (shot B16) | all | exact digital zero (see section 8) |
| 53.30 | sting | sting | relay thunk + low metallic hit + CRT lock-on zip + long tail (section 7) |

The machine pulse, drone, piano, pad and shimmer in `music` are not individual cues; they follow the section structure in section 10.

## 6. The voice

The only non-original audio. Source: `public/audio/p24b-rahal.mp3` (the project's own canonical recording), 3.0 s starting at 2.35 s, placed at 20.1 s as specified in `timeline2.json`. Measured on the source: speech starts about 2.45 s (so the first word lands at about 20.2 s) and the clip's last sample falls on a pause (energy about -36 to -44 dB at 5.30-5.40 s), so the cut at 5.35 s does not slice a word. I cannot transcribe it, so I have not verified by ear that the cut falls right after "powered down"; the numbers say it is in a gap.

Chain: high-pass 150 Hz (x2) and low-pass 6.8 kHz; feed-forward compressor (-26 dBFS, 2.6:1, 6 ms / 110 ms); a touch of analog degradation (about 0.3 ms wow, tanh saturation, -53 dBFS hiss); normalised to about -17 dBFS RMS with a -5 dBFS peak ceiling; small room reverb (RT60 about 0.35 s, dry-heavy); then cut dead at 3.0 s (6 ms fade-out, **no reverb tail**).

Intelligibility measures: during 20.2-23.1 s the voice stem is 12 dB above the sum of all other stems (A 12.2, B 11.8, C 12.0 dB, RMS). Baked ducks on the other layers across the line: ambience -7 dB, tension -8 dB, music -12 dB (0.4 s in, 0.5 s out), heavy relay clicks -7 dB.

## 7. Title sting (53.3) and why it is built this way

Three parts, all landing within 25 ms of 53.3:
1. **Relay thunk** (heavy relay recipe + 52 Hz thump): the same family as the relays that woke and killed the monitors, now very low. The machine room closing.
2. **Low metallic inharmonic hit**: free-bar partial ratios (1, 2.76, 5.40, 8.93, 13.34, 18.64) on 77.8 Hz (Eb2, deliberately foreign to the A-Bb-E motif), mallet transient, decay times 3.0 s down to 0.35 s, hall reverb RT about 3.4 s. A steel filing cabinet or door shutting on a case, not a cinematic "boom".
3. **CRT lock-on zip**: 380 Hz -> about 10 kHz exponential sine sweep in 0.22 s + noise burst, then a settling 15.5 kHz / 7.75 kHz flyback whine fading over about 1 s. It matches the title card's CRT lock-on and ties back to the first sound of the film (the CRT power-on whine).

The tail rings, then fades to zero over the last 0.35 s (all stems have a 0.35 s safety fade at 56.0). Nothing resolves; the three-note motif is not repeated in the title, because the title is "earned last" and the last motif statement already happened at 51.4.

## 8. Silence strategy

Windows: 25.0-26.0 (B07), 48.0-49.2 (B14), 52.6-53.3 (B16 final black). In **every** stem and in the mix the samples inside each window are exactly 0 (checked by scanning: 0 non-zero samples in all 27 stem-window pairs for each version, plus the mixes).

How it is guaranteed, not just hoped for:
- `put()` refuses to place anything starting inside a window and **truncates anything that would cross into a window** at the window start. Echo/delay tails are therefore cut by construction.
- Reverb is rendered per segment between windows with fresh state, so no reverb tail can survive a window and re-emerge after it (this was a real bug in the first draft: tails came back at 49.2).
- Continuous layers (drone, pad, sub) have envelopes that end at 0 at the window start, and the final step multiplies the 1.2 ms before each window by a ramp to zero (a click-free but effectively hard cut) and writes exact zeros inside.
- The mix applies the same zeroing after the limiter.
- Re-entries are hard: `hum_on` at 26.0 attacks in 120 ms; the 49.2 room tone fades in over 0.7 s; the sting at 53.3 starts at full transient.

The 52.6-53.3 black is also made digitally silent (the brief asks for the motif to be "cut by the black"). If a human prefers the black to carry 0.7 s of room tone for "breath", that is a one-line change in the ambience envelopes, but the hard cut makes the sting land from nothing.

Other deliberate dips: the pen stop at 39.2 (section 5), and the 24.7 static burst runs into the 25.0 cut so the dropout is audibly severed.

## 9. Mix balance and loudness

Per-stem trims (version A): ambience 1.0, music 1.0, tension 0.75, sfx_story 1.8, sfx_device 1.3, impacts 0.8, voice 1.3, sting 1.0, applied to the stems before they are written, so the stems are already at their mix level and `mix.wav` is their sum followed by a lookahead soft limiter (ceiling -2.0 dBFS; it touched 1 / 17 / 4 samples for A / B / C). Because only the limiter differs, `mix.wav` equals the sum of the stems except at those few samples.

Measured (ebur128 on `mix.wav`):

| Version | Integrated | LRA | True peak | Sample peak | RMS |
|---|---|---|---|---|---|
| A | -19.8 LUFS | 12.3 LU | -1.9 dBTP | -2.0 dBFS | -20.8 dBFS |
| B | -18.3 LUFS | 14.3 LU | -1.8 dBTP | -2.0 dBFS | -19.5 dBFS |
| C | -19.4 LUFS | 12.1 LU | -1.9 dBTP | -2.0 dBFS | -20.7 dBFS |

All within the requested about -20 to -16 LUFS, with a large dynamic range. No stem clips (stem peaks: A -12.9..-2.7, B up to -1.5 dBFS on tension; see `levels.json`). Short-term level by section (A, mix RMS dBFS): 0-5 s -26.5; 5-10 -28.6; 10-18.5 -27; voice scene -22.6; corridor 26-30.5 -26; 30.5-34 -20.6; 34-40 -21.5; 40-42 -18; climax 42-48 -14; final image 49.2-52.6 -26 (the motif); title -24.

Priorities when the sections compete: voice > hard-cut silence > motif > the single physical sound of each beat (pin, pen, relay, tape) > bed. The bed is never louder than the foley of the moment. Deliberate low-frequency weight: the spectrograms show a lot of energy below 100 Hz in the later sections (sub, heartbeat, impacts). On phone speakers that part disappears, and the mid-range content (pulse harmonics, pad, whine, foley) still carries the cues; on a good system it should be felt more than heard. Worth checking on both.

Size note: `public/audio/v2/` is about 278 MB of uncompressed WAV for three versions. `video/nexus-echo-teaser/.gitignore` ignores `public/audio/*.wav` but not `public/audio/v2/`, so these files would be picked up by `git add`. Consider ignoring them (they are reproducible with one command) or committing only the chosen version's `mix.wav`.

## 10. Music evolution (all versions follow this arc; densities differ)

| Time | State |
|---|---|
| 0-10 | Almost nothing: note 1 + echo at 3.3 under the CRT wake-up; drone not yet in |
| 10-25 | Drone creeps in at about 10.6 (very low), note 2 at 17.6, piano note (A, B) at 12.4; ducked under the voice; hard cut at 25 |
| 26-28 | No score; only corridor hum and footsteps ("the beat before it gets worse") |
| 28-34 | Drone back at low level; machine pulse enters: a single low tick per bar, a second hit joins from bar 2; note 3 at 31.0; sub bass fades in |
| 34-42 | Syncopated pulse (+ hat-like ticks), Bb1 neighbour note every other bar (dissonance), and the **added harmonic tension**: detuned-saw cluster Bb2 / E3 / A3 fades in from 33.6, filter opening, creeping up half a semitone by 42 |
| 42-48 | Climax: 8th-note then 16th-note bass ostinato (A1 / Bb1 / E2), pad keeps rising (another +1.6 semitones), inharmonic shimmer fades in, drone filter opens to 1.2 kHz, plus the riser, accelerating heartbeat, 18 shutters and three impacts. Hard cut at 48.0 |
| 48-51.4 | Near-nothing (CRT hum only) |
| 51.4-52.6 | The three-note chord, cut by the black |
| 53.3- | Title sting, long tail |

Pulse grid: 16th notes at 120 bpm (0.125 s), anchored at the pulse entry; the heartbeat deliberately does not lock to it (56 -> 150 bpm vs a fixed 120), so the two rhythms drift against each other.

## 11. Versions

Same story, same cue times, same silence windows; density, level, texture and tail length differ.

| | A atmospheric | B aggressive | C mysterious |
|---|---|---|---|
| Pulse | sparse: 1-2 hits per bar early, syncopation from 34, 8ths at the climax, soft hat-like ticks on odd 16ths | dense: quarter hits from 28, extra E2/Bb1 hits, a tick on every 16th at the climax, 16-note bass pattern | thin: 1 hit per bar, fewer syncopations, quarter notes at the climax, no ticks |
| Heart / riser / sub | 0.8 / 0.8 / 0.8 | 1.25 / 1.35 / 1.25 (then tension trim 0.62 to avoid clipping) | 0.8 / 0.9 / 0.7 |
| Impacts | x0.8 trim, levels 0.8 / 0.9 / 1.0 | x0.9 trim, levels 0.95 / 1.1 / 1.3 | x0.85 trim |
| Tails | reverb and echo x1.0 (echo 0.66 s, fb 0.58) | x0.55 (echo 0.5 s, fb 0.42): shorter silence tails, tighter, drier | x1.45 (echo 0.78 s, fb 0.70, wet x1.1): more space |
| Motif | normal | slightly less echo, last note louder | more echo, louder notes, **reversed pre-swell** leading into each note, wider pad detune, 3 extra piano notes (one at 9.0) |
| Piano | 5 notes | 7 notes (2 in the climax) | 8 notes, more echo |
| Mix | -19.8 LUFS, LRA 12.3 | -18.3 LUFS, LRA 14.3 | -19.4 LUFS, LRA 12.1 |

## 12. Cue-time verification (numerical, version-independent)

`qa.mjs` takes the high-passed (400 Hz) 1 ms envelope of the stem that owns each transient cue and finds the first bin that jumps at least 12 dB over the preceding floor, within [-30 or -100 ms, +200 ms] of the cue time. All 39 transient cues (relay clicks, CRT power, static bursts, phone buzz, REC beeps, soft thud, paper open/drop, shutter, footsteps, light flickers, pin strikes, tape insert, impacts, sting) onset within 12 ms of the cue time in all three versions: 38 at 0-3 ms, `paper_open` at +10 ms (its swoosh is a deliberately soft attack). `tape_insert` onsets on the cue because the sample is offset 0.2 s to put the thunk, not the scrape, on 34.3.

Soft/ramped cues (paper slide, pen, string, motif notes, voice) were checked by energy rise: the RMS in the 300 ms after the cue is above the 300 ms before it; the voice rises from digital zero (-180) to about -22 dB RMS at 20.1. The heartbeat was checked by autocorrelation of the 70-220 Hz envelope: 57.8 bpm (28-32 s), 64.6 (34-38), 70.1 (39-42), 74.2 (42-44.3), 93.9 (44.5-46.8), 127.4 (45.6-47.95; a window average, the true end value is 150 at 47.9 by construction). The pen is dead after 39.2 (the residue is the tip-lift tick and the tape stop clunk, about -36 dB RMS over 185 ms).

## 13. Reference research: what was used

No external recordings, tutorials or libraries were consulted and no citations are claimed. The only knowledge used is general: how analog tape echo behaves (every repeat darker and noisier, delay time wobbling); that horror and thriller scores get their unease from small intervals (minor second, tritone) and inharmonic metal rather than from volume; that silence only works as a tool if what precedes it is loud enough and the cut is abrupt (hence true digital zero, not a fade); that heartbeat-based tension works by acceleration and level, not by adding layers; that a title sting reads as "finished" when it has a low transient, a ringing inharmonic tail and a recognisable sound from the film's world (here the monitor relay and CRT whine); that fluorescent buzz is a 100 Hz (50 Hz mains) harmonic stack, CRT whine is a line-frequency tone near 15.6 kHz (the 7.8 kHz sub-harmonic is added because many listeners cannot hear 15 kHz), and that dialogue needs roughly 10-12 dB over its bed to stay intelligible on small speakers.

External libraries could not be consulted: see `TEASER_AUDIO_LICENSES.md` for the connectivity test.

## 14. Ending B (title pulled forward)

`src/v2/data.ts` has an "ending B" that drops B14-B16 and pulls the title forward by 5.3 s (to 48.0). These stems are authored for ending A (56.0 s). For ending B, cut each stem at 48.0 and append the segment from 53.3: the sting begins exactly at its sample 0 transient, so the splice is clean, and nothing else is active in the dropped 48.0-53.3 region. This was not built or tested.

## 15. Limits and open items

- Nothing has been auditioned. Balance, taste of the sub-bass weight, whether the motif is "recognisable" to a listener, and whether foley levels read in context are untested judgements. A human pass should check: the motif note 1 level (may be too quiet, about -28 dBFS peak before mix), the pen scratch (about -20 dBFS peak), the heavy "monitor dies" relays under the voice, and the 15 kHz whine (inaudible to some adults, irritating to others; trivial to lower).
- The 18 rapid-shutter times are generated (first 42.0, last 46.8, intervals 0.70 -> 0.15 s), because the real cut times of B13 are not in `timeline2.json`. If the final edit uses different cut times, add a `times` array to the `shutter_rapid` cue and rebuild: the generator already reads it.
- The voice cut at 5.35 s of the source was checked against energy only (see section 6).
