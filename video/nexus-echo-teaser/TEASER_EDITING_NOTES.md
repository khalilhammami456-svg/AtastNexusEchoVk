# NEXUS ECHO teaser - editing notes

## What the rebuild changed
The first teaser flew over screenshots. This one is built from **shots**: physical sets assembled from layers (parallax, depth of field, light), real 3D camera moves rendered with the game's own renderer, and one fragment montage cut to a schedule. The only real screenshot left is the handset screen, shown on a phone buzzing on a desk. Everything else is a set, a render or a macro.

| Shot | How it is built (not a zoom of a flat image) |
|---|---|
| Control room (B02, B06, B15) | Six CRT monitors in a rack, three depth layers moving at different speeds, tube power-on collapse, signal loss to NO SIGNAL, live burn-in stamp, light thrown on the wall |
| Desk (B03, B05) | Lamp-lit desk, objects at different heights, a moving focal plane (rack focus), records sliding in with growing shadows, a pen that draws the underline |
| Phone (B04) | A handset on wood that buzzes, wakes and lights the desk |
| Corridor (B08, B12, figure) | 3D camera moves through the game's own corridor: walking bob, flickering and failing lights |
| Board (B09) | Pins strike, red strings are pulled between them one by one |
| Deck (B10) | A cassette slides in, the reels spin, REC lights |
| Pen macro (B11) | Real ink reveal: the pen writes the note and stops dead at "03:17 -" |
| Montage (B13) | 17 cuts of different subjects and scales on a shrinking schedule |

## A/B tests (done on rendered frames from the actual animatic)

**Hook.** A: six CRTs waking one by one in a dark control room with a crawling timecode. B: first-person dolly down the empty corridor. *Finding:* B is more immediate in its first second, but it uses up the corridor. The film's payoff is the corridor returning, and Hook B makes the first minute of corridor identical to the montage corridor, so nothing changes between the two viewings. A takes longer to land but plants the recorder's room, the timestamp and the motif, and the film ends in that room. **Chosen: A.** Weakness accepted: the first 3 s of A are quiet screens waking.

**Ending.** A: figure, hard cut to black, then the recorder's empty frame frozen on 03:17:11, one low tone, black, title. B: figure, black, title. *Finding:* B is punchier, but A shows the contradiction (the recorder says empty, the last image said otherwise) and ends on that question. **Chosen: A.** B is kept as a 50.7 s alternate (`--ending=B`; its audio splice is untested).

**Sound versions** (same cues, different density): A sparse/atmospheric, B denser and louder, C more echo and space. *Finding:* A was chosen because the brief asks for restraint and silence as the weapon, and A's measured dynamic range (12.3 LU, -19.8 LUFS) leaves the most room for the two total silences. B and C are provided as muxed alternates (`nexus-echo-teaser-v2-soundB.mp4`, `-soundC.mp4`). **None of the three has been listened to**; a person must audition them.

## Review rounds and what each fixed
1. First stills: the hook shot cropped out its timestamp; a log underline sat on the wrong row (I had mislabelled the rows - fixed by measuring the image); the pen sprite was offset from its tip; the close-up camera aimed at the wrong monitor.
2. Animatic frames: the final frame's clock advanced (03:17:12, 03:17:13) instead of staying on 03:17:11; the 3D corridor was too bright and flat; the montage had 15 cuts instead of the 17 the sound design timed for.
3. Final-file frames: montage inserts were washed-out grey during the climax; fixed by darkening them (brightness 0.5, contrast 1.35, vignette) and softening the flash.
4. Technical: an overstuffed intended-black list (the corridor's failing lights end in black just before the montage - intended).

## Measured rhythm (scene detection on the delivered file)
Average shot length: 0-10 s about 3.3 s; 10-20 s about 1.7 s; 20-30 s about 1.1 s; 30-40 s about 1.7 s (a breather: the corridor walk and the board); **40-48 s about 0.31 s** (25 visual changes); 48-56 s about 2.7 s (silence, the empty frame, the title). Long, shorter, short, breather, barrage, sudden stop.

## Self-assessment against the brief's questions
- Does it feel like a teaser / a game / indie horror / forensic / retro / NEXUS ECHO? It uses the game's own corridor, recorder, evidence, brand and fonts; the sets are specific (a case folder, a dictaphone, tape 7).
- Is it a screenshot montage? No. The only screenshot is the phone screen.
- Original cinematic shots? Yes: the 3D corridor moves, the sets, the pen/ink reveal, the pin-and-string sequence.
- Energy / silence / suspense / evolving music / SFX that matter? Designed and measured (see `TEASER_AUDIO_PLAN.md`); **not auditioned**.
- Does it spoil? No twist, ending, or identity (see the spoiler audit in `TEASER_SPOILER_MAP.md`).

## Honest limits
- Nobody (including me) has listened to the audio or watched the teaser at speed as a viewer. Visual review is from still frames extracted from the real renders, so **motion feel (camera speed, handheld amount, flicker timing) is not judged**.
- The 3D geometry is flat and boxy, as in the game's photographs; close-ups (door handle, wall seam, ceiling fixture) are the weakest images. The corridor has a bright fog bloom at the far end whenever the lights are on.
- Source CCTV frames are 704x576, upscaled; the CRT treatment hides it but it is soft at full-screen.
- Hook A is quiet for its first 3 s; whether that grabs attention or loses it needs a cold viewer.
- Tests with a cold viewer (the brief's "if I removed the logo and told you nothing" test) were not run: no independent reviewer was available.
