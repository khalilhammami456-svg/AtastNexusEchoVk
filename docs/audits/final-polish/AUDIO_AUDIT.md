# NEXUS ECHO - Audio / Immersion Audit

Repo: /home/user/AtastNexusEcho-work. Measured with ffprobe/ffmpeg (ebur128, volumedetect, silencedetect); speech not interpreted.

## 1. Inventory: everything a player can hear today

**The interface has no sound of its own.** There is no AudioContext, no `new Audio`, no `.play()` on audio, no `vibrate`, no mute/volume/sound preference anywhere in `src/`. The only audio is 12 MP3s, each in a native `<audio controls>` the player must press. The game is silent unless a recording is played by hand. No ambience, no UI feedback, no pairing with the glitch system.

All files: mono, 44.1 kHz, 128 kbps CBR (1.88 MB total, 117 s total). Sample peak from volumedetect; no true-peak run.

| File | Triggered where | Dur | LUFS-I | Peak dBFS | Cat |
|---|---|---|---|---|---|
| p17-audio-log-transmission | P17 observer, PuzzleVisual `AudioVisual` (L199) | 19.96 s | -22.5 | -3.6 | NARRATIVE |
| dictaphone-rec-16-reinterpretation | Evidence (P23), AudioView | 13.40 | -19.6 | -1.8 | NARRATIVE |
| dictaphone-rec-18-coherence | Evidence (P26) | 9.64 | -24.5 | -5.2 | NARRATIVE |
| dictaphone-rec-20-mirror-entity | Evidence (P29) | 10.16 | -22.3 | -4.9 | NARRATIVE |
| dictaphone-rec-22-synchronization | Evidence (P30) | 7.29 | -21.4 | -3.8 | NARRATIVE |
| dictaphone-rec-24-gm-key | Evidence (P32) | 6.82 | -21.2 | -4.7 | NARRATIVE |
| dictaphone-rec-26-entity | Evidence (P34) | 9.09 | **-29.5** | **-10.8** | NARRATIVE |
| dictaphone-rec-28-gm | Evidence (P35) | 6.95 | -20.5 | -1.7 | NARRATIVE |
| p24b-vale | P24b `EntryLedgerVisual` clips (L467) | 8.78 | -20.9 | -3.2 | NARRATIVE (gameplay clue) |
| p24b-vey | P24b, rendered twice (see below) | 6.16 | -23.1 | -4.5 | NARRATIVE (gameplay clue) |
| p24b-selim | P24b clips | 5.56 | **-29.1** | **-13.2** | NARRATIVE (gameplay clue) |
| p24b-rahal | P24b clips | 13.19 | -24.7 | -7.0 | NARRATIVE (gameplay clue) |

Admin only: `QAViewer.tsx` plays any audio ref for QA. `evidenceLabCatalog.ts` dev item `dev-ev-006` has `audio_url` pointing at a **.jpg** (`SHOWCASE_MEDIA.audio = /evidence/audio/audio_rec16_reinterpretation.jpg`), so the lab's audio record cannot play. No video files exist in `public/`. Categories SYSTEM, ATMOSPHERE, SPECIAL: **empty today**.

## 2. Problems

1. **No loudness normalisation.** Spread is 9.9 LU overall (-19.6 to -29.5). Inside P24b the four voices heard back to back span 8.2 LU (Selim -29.1 vs Vale -20.9, peak -13.2 vs -3.2). A listener hears "quiet witness", not "different speaker". REC-26 (the Entity) is 9.9 LU under REC-16; if that is intentional it is not legible on a phone speaker at -30 LUFS. REC-16 and REC-28 peak at -1.8/-1.7 dBFS: no headroom, and MP3 decode can clip on intersample peaks.
2. **No lead-in or tail.** No silence below -45 dBFS at the start of any file, so each begins on speech with no room tone; the "signal / disconnect" framing must come from the UI, which provides none (section 3).
3. **Multiple simultaneous players.** P24b renders `audioUrl` (Vey) and then `audioClips` (which includes Vey again): Vey appears twice, and 5 native players can play at once. `useVideoControl` enforces one-at-a-time for video; nothing equivalent exists for audio. A dictaphone in the archive and a puzzle clip can overlap.
4. **No visibilitychange / pagehide / route handling.** Visibility is handled only for the timer (`useGameTimer`), connection probe (`useConnection`) and glitch timer (`SignalLayer`). Unmounting removes `<audio>` (browsers pause it), but a backgrounded tab or locked phone keeps a recording running, and a recording that continues over a route change inside an overlay (EvidenceArchive stays mounted) is not stopped.
5. **Accessibility.** Transcripts exist for every recording (P17 `audioTranscript`, P24b payload text, dictaphone memo `text` as `contentText`, max-h-32 scroll), so none is audio-only. Weak points: native controls are small (below the 44 px target used elsewhere); no caption sync; P24b transcript is one block, not per clip; the P17 "Spectrum" bars come from payload text ("1747 Hz"), not the audio.
6. **No mute/volume/sound preference.** `AccessibilityPreferences` has scale/contrast/motion/transparency only. A separate `nexus_effects_v1` visual-effects store has no UI at all (nothing calls `setEffectsPreference`).
7. **Autoplay:** none (good). Preload: `metadata` in AudioView, browser default in PuzzleVisual; fine for 6-20 s clips.
8. **Mobile unlock:** not needed today (native tap); required once any synthesized cue exists.
9. **Hardcoded paths:** `/audio/...` literals live in SQL (migrations 035/036) and `evidenceLabCatalog`; no manifest, duration, gain or transcript key. Migration 035 step 5 was a silent no-op (missing parent key); 036 fixed it by overwriting the whole `interactiveData`.
10. **Cache / service worker:** none; `vercel.json` sets security headers but no `Cache-Control` for `/audio/*`, so Vercel's default (`max-age=0, must-revalidate`) revalidates each file. There is no offline path, and a mid-clip network drop gives no message. CSP allows `media-src 'self' blob:` (fine for `<audio>` and Web Audio; no CSP change needed for a procedural engine).
11. **Size/bitrate waste:** 128 kbps / 44.1 kHz mono for speech. Mono 24 kHz / 48-64 kbps halves the payload (about 1.9 MB to 0.9 MB) with no audible loss on phone speakers.
12. **Metadata gaps in AudioView.** The 7 dictaphone rows carry only `text, source, state, audio_url`, so the dossier grid reads DURATION: NOT RECORDED, RECORDED: TIME NOT RECORDED, RECORDER: UNKNOWN. The generated asset library lists durations (01:12, 00:48, 02:34, 01:26, 00:39, 01:58) that disagree with the real files (13.4, 9.6, 10.2, 7.3, 6.8, 9.1 s), and REC-28 is not in the library. Only six catalogue entries exist for seven files.
13. REC-19 (P24b evidence) is category Audio but has no `audio_url` (migration 035 step 7 skips it).

## 3. Transmissions: framing as presented in AudioView

Frame today (identical for every recording): header `ARCHIVAL RECORDING / {code} / RECORDING n OF m`, a 4-row dossier (DURATION / SOURCE / RECORDED / RECORDER), a native player, a timeline slider, `00:00 / DURATION UNKNOWN`, then the memo text. Missing steps of signal, reception, message, disconnection: **signal** (nothing says a link opened), **reception** (no level or lock indicator), **disconnection** (clip simply stops; no "SIGNAL LOST" line, no marker on the tape). Only the message is delivered.

| Recording | Source line | Frame on screen | Transcript |
|---|---|---|---|
| P17 audio log | Auditorium Stage; "GM Voice" | speaker label, italic transcript, Hz bars | Yes (contains the answer-bearing 17:47) |
| REC-16/18/20/22/24/26/28 | P23 cabinet, P26 laser casing, P29 Vault Delta (mirror entity), P30 spire console, P32 projector, P34 hub (Entity), P35 final chamber (GM) | generic dossier, unknown fields | Yes, memo `text` for all 7 |
| P24b x4 | Antenna deck interrogation | speaker name beside each player | Yes, one block in payload |

The story calls these "Dictaphone Memos"; the UI frames them as archive items (RECORDER UNKNOWN), not as something received. REC-20/26/28 get no more ceremony than REC-18. Recommendation: derive per-recording, from existing fields, a state line (`LINK OPEN`, `RECEIVING 00:07 / 00:09`, `LINK CLOSED / END OF RECORDING`) and, for the entity/GM tapes, a degraded-signal chip. Text only.

## 4. Audio design proposal (restrained)

Principle: silence is the baseline. Sound marks only what NEXUS says, the world going wrong, a transmission opening/closing, and evidence changing the case. Every cue has an on-screen twin; **no information is carried by sound alone**. Procedural Web Audio only (sine/triangle/filtered noise); no new binary assets. Hierarchy: NARRATIVE (the 12 recordings, native audio) > GAMEPLAY (answer/final) > FEEDBACK (discovery, anomaly) > AMBIENCE. Rule: while any recording plays or while the tab is hidden, the engine drops all cues and ambience (it cannot duck native elements, so it yields instead). Level ceiling: all cues <= -18 dBFS peak except final reconstruction (-16); recordings sit at about -3 to -13 dBFS peak, so cues stay 15 dB or more beneath voice. Phone speakers lack energy below about 200 Hz, so low notes use triangle waves with audible 2nd to 4th harmonics (400-900 Hz); nothing relies on sub-bass.

| Cue | Sound | Trigger (file / function) | Dur | Peak | Visual twin |
|---|---|---|---|---|---|
| **NEXUS** motif | descending fourth, 110 Hz to 82 Hz fundamental (tri + harmonics), second note longer, 2-3 s decay | `PlayerLayout.tsx` effect on `narrative.level` increasing (derived from `levelFromCasePhase`: BRIEFING 1, GAMEPLAY 3, FINAL 5, DEBRIEF 6). Only on upward change, never on first load. | 1.8 s | -22 | `data-horror` shell change + existing dispatch `glitch LIGHT` |
| **Anomaly** | two sines 1320/1330 Hz detuned about 0.8% plus 600 ms filtered-noise breath; tremolo off under reduced motion | subscribe to `subscribeGlitch` (`lib/vfx/glitch.ts`). Sounds for type TRACKING/CORRUPTION/FRAME/FULL or intensity >= 0.5 (LIGHT/SIGNAL stay silent so `SignalLayer` dropouts every 8-19 s do not become a metronome); own 20 s cooldown | min(event.duration, 700) | -26 (LIGHT-class n/a), -20 for FULL | the glitch bands themselves (GlitchLayer); `reduced` events play -6 dB, no beating |
| **Transmission open** | 1 kHz carrier sine 180 ms + 100 ms bandpass-noise "breath" | `AudioView` / `PuzzleVisual` custom play button (see step 6) before `audio.play()` | 0.25 s | -34 | status line `LINK OPEN` (to add) |
| **Transmission close** | single noise "squelch" tail, lowpass sweep 3 kHz to 400 Hz | audio `ended`, `pause` by route/visibility, or `error` | 0.12 s | -30 | `LINK CLOSED / END OF RECORDING` (to add) |
| **Evidence: normal** | one sine tick 880 Hz, 60 ms, soft envelope | new ids appear in `teamProgress.evidenceOwned` (`useGameEngine.refreshTeamProgress`), skipping first load; also `Node.tsx handleSubmit` correct, `showToast(..., 'evidence')` | 0.15 s | -30 | DiscoveryToast (exists) |
| **Evidence: important** | two notes rising E5 to B5, 110 ms each | new evidence where `isFlagged(artifact)` is false but the node is in a small allowlist `IMPORTANT_NODES`, or evidence category Audio (dictaphone unlock) | 0.35 s | -26 | toast + new RECORDINGS filter count |
| **Evidence: contradiction** | minor second B4+C5 together with 6 Hz beat (steady under reduced motion) | `isFlagged` state CONTRADICTED; annotation kind `CONTRADICTION` added (`ArtifactInspection onAddAnnotation` L353 / `EvidenceArchive.addAnnotation` L308); board link CONTRADICTS | 0.5 s | -24 | `stamp-contradicted` x glyph (`Status.tsx`), board link style |
| **Major discovery** | NEXUS interval then three-note rising line over a low pedal | solved node in `MAJOR_DISCOVERY = ['P29','P34']` (the "mirror entity" / "entity stirs" beats), from `Node.tsx` where `justSolved` becomes true | 2.4 s | -20 | `justSolved` panel + toast; add `RECOVERED` stamp |
| **Final reconstruction** | the NEXUS interval resolving into a full triad, slow 4 s swell and fade; the only cue allowed -16 | `Final.tsx handleSubmit` when `result.isCorrect`, before the 1500 ms `navigate(PLAYER_COMPLETE)`; engine is a singleton so it survives the route change | 4.5 s | -16 | Complete page "Investigation Complete" |

Wrong answers, hints, taps and navigation stay **silent** on purpose. Strength is monotonic: normal < important < contradiction < major < final (peak -30/-26/-24/-20/-16; 0.15 to 4.5 s); the strongest fires once per team.

**Ambience:** OFF by default; "full" mode only: 300 Hz-lowpassed brown noise at -52 dBFS from horror level 3, one soft transient every 40-90 s, silent while hidden or a recording plays.

**Defaults and preference.** Add `sound: 'off' | 'cues' | 'full'` to `AccessibilityPreferences` in `src/app/providers/AccessibilityProvider.tsx`: same `nexus_accessibility` key, a `data-sound` attribute on `<html>`, a "Sound" ChoiceRow on `Accessibility.tsx` (reachable pre-login), `resetPreferences` included. Default **`cues`** (feedback only, no ambience): cues are sparse (well under a minute total per case), ambience is the opt-in. The recordings are always player-initiated and ignore the preference except for the transmission cues. A one-line Waiting-screen notice ("Sound cues on. Change in Display & Access") replaces a modal. Reduced motion does not mute; it removes beating/tremolo and caps anomaly sound at -26. Glitch effects "off" means no glitch events and therefore no anomaly sound.

**Mobile.** (1) Create the AudioContext lazily and `resume()` on the first `pointerdown`/`keydown` (also play a one-sample silent buffer for iOS), unlocking silently; no cue may fire before that. (2) On `visibilitychange` hidden / `pagehide`: `ctx.suspend()`, pause ambience and any recording; on visible resume only if `sound !== 'off'`. (3) Listen to `ctx.onstatechange` for `interrupted` (iOS call, Siri) and re-resume on the next gesture. (4) iOS ringer switch mutes Web Audio but not `<audio>`: recordings still play, cues go quiet. This is acceptable, but the "Sound" help text must say so. (5) Design for the speaker: mono-safe, 300 Hz-3 kHz energy; headphone detection is not reliably possible (microphone blocked by Permissions-Policy), so none is attempted. (6) No haptics: `navigator.vibrate` is unsupported on iOS and unused today.

## 5. Implementation plan (12 steps max, each unit-testable)

1. **`src/lib/audio/soundPrefs.ts`**: type `SoundMode`, `readSoundMode()` from `nexus_accessibility` with try/catch (mirrors `readStored`).
2. **`AccessibilityProvider.tsx` + `Accessibility.tsx`**: add `sound` (default `cues`), `setSound`, `data-sound`, ChoiceRow. Extend `accessibility-settings.test.tsx`.
3. **`src/lib/audio/engine.ts`**: singleton `engine` with `unlock()`, `setMode()`, `suspend()/resume()`, `play(cueId)`, `isPlayingRecording` flag, and a master gain; no-ops when `AudioContext` is missing. Test with a mocked `AudioContext` (vi.fn nodes) in jsdom: asserts `play` before `unlock` does nothing, `off` does nothing.
4. **`src/lib/audio/cues.ts`**: a pure table `CUES: Record<CueId, CueSpec>` (oscillator list, envelopes, peak dBFS, duration) and `render(ctx, spec, t0)`. Test spec invariants: every peak <= -16 dBFS, ordering normal < important < contradiction < major < final, every cue has a `visualTwin` string (guards the "no sound-only information" rule).
5. **`src/hooks/useSoundLifecycle.ts`**: mount once in `PlayerLayout.tsx` and `Workstation.tsx`/`AdminLayout`: gesture unlock, `visibilitychange`/`pagehide` suspend/resume, `statechange` handling. Test by dispatching events.
6. **`src/features/player/evidence/media/useAudioTransport.ts`**: shared transport for one recording: custom 44 px play/pause, `LINK OPEN / RECEIVING / LINK CLOSED` state, single-active registry (starting one pauses the others), pause on unmount and on `engine` suspend, plays open cue before `audio.play()`, close cue on `ended`. Replaces native `controls` in `AudioView.tsx` and the three `<audio>` in `PuzzleVisual.tsx`. De-duplicate P24b (skip a clip equal to `audioUrl`). Test: two transports, play second pauses first.
7. **`src/lib/audio/glitchBridge.ts`**: `subscribeGlitch` to anomaly cue with intensity/type filter, 20 s cooldown, `reduced` attenuation. Test using `__resetGlitchForTests` clock.
8. **`src/hooks/useEvidenceCues.ts`**: diff `teamProgress.evidenceOwned` and artifact flags; classify normal/important/contradiction; skip initial load; call in `PlayerLayout`. Add contradiction call sites in `EvidenceArchive.addAnnotation` and `ArtifactInspection` note button.
9. **Narrative cues**: effect in `PlayerLayout.tsx` (level up to NEXUS cue), `Node.tsx` (`MAJOR_DISCOVERY` code list to major cue), `Final.tsx` (final cue before `navigate`). Test with mocked engine (`vi.mock('@/lib/audio/engine')`) asserting exact cue on exact state change, and none on first render.
10. **Ambience (optional)**: `src/lib/audio/ambience.ts`, gated on `full`, horror >= 3, visible, no recording. Test the gating matrix.
11. **Asset fix-ups (non-code, small)**: re-encode the 12 MP3s once with `ffmpeg loudnorm` to I = -23 LUFS, TP <= -3 dBFS, mono 24 kHz 64 kbps (REC-26 deliberately -3 LU lower, Selim matched to the other P24b voices); add `Cache-Control: public, max-age=31536000, immutable` for `/audio/*` only after filenames are versioned. Fix `dev-ev-006` to a real mp3 path. Add `duration`, `source`, `recorded` to the 7 dictaphone rows (migration) so AudioView stops printing NOT RECORDED. Add a script-level check that fails CI when a file in `public/audio` is outside -23 +/- 2 LUFS.
12. **Test seam**: `engine.__resetForTests()` (like glitch's) and a render test per surface asserting the visual twin text is present whenever its cue fires.

Steps 1-5 are invisible (safe alone); 6 is the biggest visible change; 9 touches story-critical screens.
