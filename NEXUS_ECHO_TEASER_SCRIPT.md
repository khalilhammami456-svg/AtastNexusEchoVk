# NEXUS ECHO — teaser script

Central question: **At 03:17:11 the recorder saw an empty corridor. Which record is lying?**

The teaser has no narration and no exposition. It speaks through evidence, one recorded voice, and the system. It never says what NEXUS is, who the player is, who is missing, or how the case ends.

## Emotional line
Curiosity (0:00) → unease (0:03) → interest (0:10) → suspicion (0:16) → silence (0:23) → dread (0:25) → urgency (0:33) → revelation (0:40) → silence (0:47) → question (0:48) → title (0:52).

## Sequence
**00:00.0 — hook cam07 stamp** (3.4 s)
- Visual: Hook: a machine timestamp inside a dropout. Something is wrong with the time.
- Source: NX-CAM-07 / public/evidence/surveillance/surv_cam07_031711.jpg
- Sound: Silence into tape hiss and 50 Hz mains hum (fade-in 1.2 s); relay click at 0.3 s; signal-tear burst at 2.5 s
- Text: On image: "14-10-94 03:17:11", "FRAME DROPOUT 03:17:05-03:17:18" (part of the evidence frame)

**00:03.4 — world b01 print** (6.4 s)
- Visual: World: an empty east corridor. Establish place, medium, the record.
- Source: NX-037-B-01 / photo_nx037_b_01.jpg (the corridor with nothing in it; B-02 is held back)
- Sound: Hum continues; typed ticks for "CASE 037" at 4.3 s; stamp thud at 7.3 s
- Text: "CASE 037" (typed), RECOVERED stamp (public/brand/stamp-recovered.svg)

**00:09.8 — phone archive** (6.0 s)
- Visual: Investigation: the handset opens a camera record. Same game, fragment of UI.
- Source: docs/evidence-screenshots/mobile-02-surveillance-inspection.png (a real capture of the app)
- Sound: Two phone buzzes at 9.8 s and 10.1 s; hum under
- Text: Real handset UI: CAM-07 / EAST CORRIDOR, FRAME 9/9, TAPE 7

**00:15.8 — doc d08** (4.0 s)
- Visual: First anomaly: a recorder log line, canonical text, no reason given.
- Source: NX-037-D-08 / doc_nx037_surveillance_log.jpg
- Sound: Hum; relay click on the cut
- Text: On image (canonical): "03:17 MANUAL STOP. NO REASON GIVEN."

**00:19.8 — cam06 voice** (3.6 s)
- Visual: Canonical voice line over a camera that says NO SIGNAL; sentence cut off.
- Source: NX-CAM-06 / surv_cam06_0316_offline.jpg + public/audio/p24b-rahal.mp3
- Sound: The repo's own recording p24b-rahal.mp3, 2.35-5.35 s of the clip, cut after "powered down"; typed ticks; hiss
- Text: Caption: "THE EAST LABORATORY CAMERAS WERE POWERED DOWN—" (cut off)

**00:23.4 — silence black** (1.2 s)
- Visual: Hard audio cut. Silence is the beat.
- Source: -
- Sound: Absolute silence (23.4-24.6 s)
- Text: -

**00:24.6 — note n02** (8.0 s)
- Visual: Foreshadowing seed: an observer's note that stops mid-line at 03:17.
- Source: NX-037-N-02 / note_observer02_02.jpg
- Sound: Thin hum returns; pressure layer begins 28 s; heartbeat-like pulse starts 29 s at 56 bpm
- Text: On image (canonical, handwritten): the observer's note, ending "03:17 —"

**00:32.6 — montage** (7.6 s)
- Visual: Escalation: records the viewer cannot yet connect, cutting faster.
- Source: F-02 (frag_nx037_c_02.jpg), CAM-07, P-05 (personnel_lv_0029_duplicate.jpg, blurred), M-02 (map_east_wing_issue02.jpg), D-08, B-01
- Sound: Camera-shutter clicks on each cut, pulse accelerating, rising band-pass pressure, signal-tear bursts on the three tear cuts
- Text: On images only

**00:40.2 — reveal same corridor** (7.4 s)
- Visual: The same corridor again. Something has changed. Degraded, cropped, unresolved.
- Source: NX-037-B-01 then NX-037-B-02 / photo_nx037_b_01.jpg, photo_nx037_b_02.jpg
- Sound: Pulse at 150 bpm, sub-bass pressure at its peak, hum swell; tear burst at 42.7 s; everything cuts to silence at 47.6 s
- Text: -

**00:47.6 — black hard cut** (0.9 s)
- Visual: Everything drops out.
- Source: -
- Sound: Absolute silence (47.6-48.5 s)
- Text: -

**00:48.5 — cam07 empty** (3.0 s)
- Visual: The recorder's version. Empty. Which record is lying?
- Source: NX-CAM-07
- Sound: Quiet tape hiss only, -40 dB
- Text: On image: timestamp, "FRAME DROPOUT 03:17:05-03:17:18"

**00:51.5 — black** (0.7 s)
- Visual: Breath before the title.
- Source: -
- Sound: Faint room tone then nothing
- Text: -

**00:52.2 — title** (3.8 s)
- Visual: Title earned, last. Brand lock-on.
- Source: public/brand/lockup-dark.svg
- Sound: Single low metallic impact with a decaying partial cluster, CRT lock-on zip over the first 6 frames
- Text: NEXUS ECHO (brand lockup), "CASE 037"

## Dialogue
One line, from the game's own recording (`public/audio/p24b-rahal.mp3`), cut mid-sentence: "…the east laboratory cameras were powered down…". The seed transcript for that clip reads: "The east laboratory cameras were powered down for maintenance beginning at 04:15." The teaser stops before "for maintenance". The words were checked against the seed text (`2026093035_audio_evidence_integration.sql`) and by speech recognition of the file; they were not heard by a person.

## On-screen text (everything that is not part of an evidence image)
"CASE 037", RECOVERED (stamp), the caption above, "NEXUS ECHO", "CASE 037".

## Sound identity
Tape hiss and 50 Hz mains hum; a slow sub-bass pressure that rises from 28 s; a pulse that starts at 56 bpm and reaches 150 bpm; relay, typing, camera-shutter and phone-buzz clicks; two total silences (23.4–24.6 s, 47.6–48.5 s); one impact at the title. Everything but the voice is synthesised by `scripts/audio.mjs` from the timeline; there is no music in the repository and none was added.

## The hidden breadcrumb
The corridor appears empty at 3.4 s and again at 40.2 s. Then the same corridor returns degraded and a figure resolves out of the dark, and the recorder's frame (empty, stamped 03:17:11) answers it. After playing, the viewer knows who recorded what and why the two records cannot both be true. The note that stops at "03:17 —" is the second breadcrumb.
