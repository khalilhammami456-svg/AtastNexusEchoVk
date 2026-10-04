# NEXUS ECHO teaser - final QA

Delivered file: `out/nexus-echo-teaser-v2-A.mp4` (26.7 MB, two-pass 3.6 Mb/s H.264 + 192 kb/s AAC, from the full-resolution master `out/final-master.mp4`, 187 MB). Contact sheet from the delivered file: `docs/teaser-contact-sheet.png`. Alternate sound: `-soundB.mp4`, `-soundC.mp4` (same picture).

## Technical (`node scripts/verify.mjs`, run on master and on the delivered file)
| Check | Result |
|---|---|
| Duration | 56.000 s (limit 60) |
| Resolution / frame rate / codec | 1920x1080, 30 fps, H.264 |
| Frame count | 1680 of 1680 |
| Audio | AAC, 48 kHz, stereo, peak about -1.96 dBFS, no clipping |
| Black frames | only the intended ones: opening 0-0.8 s, silent beats 25-26 s and 47.6-49.2 s, lights failing 41.6-42 s, the breath before the title 52.6-53.4 s |
| True silence | audio drops to silence at 25.0, 48.0 and 52.6 s (stems checked for zero samples in the windows) |
| Missing assets / console errors | none during renders |
| Audio loudness (mix A) | -19.8 LUFS integrated, 12.3 LU range, -1.9 dBTP |
| Cue alignment | 39 transient cues onset within 12 ms of their cue time (generator QA) |

## Creative checks (done on frames extracted from the real renders)
- **No screenshot zooming as the structure:** the only screenshot is the handset screen on a buzzing phone; the rest are sets, 3D camera moves, macros and a montage.
- **Rhythm measured by scene detection:** about 3.3 s average shot (0-10 s), 1.7 s, 1.1 s, 1.7 s (breather), **0.31 s (40-48 s)**, 2.7 s (silence and title).
- **Hook / ending A/B:** done on rendered frames; A chosen for both (reasons in `TEASER_EDITING_NOTES.md`).
- **Spoilers:** audited against `TEASER_SPOILER_MAP.md` section 6; no twist, ending or identity. Residual risk: the 1 s silhouette near the end.
- **Final image:** the recorder's frame, empty, frozen on 03:17:11, after the silhouette. The question it leaves: which record is lying?

## What was NOT done (be careful with the claims)
- **Nobody has listened to the audio.** All audio statements come from measurements (loudness, peak, silence scans, onset detection, spectrograms). A person must audition versions A, B and C.
- **Motion has not been watched at speed by anyone.** I reviewed still frames from the real renders and measured cut rhythm; camera speed, handheld amount and flicker timing are unjudged.
- **No cold-viewer test.** The brief's "if I removed the logo and told you nothing" test, and "does it make me want to play", need an independent human.
- **Mobile / accessibility / performance QA** in the brief's checklist belong to an interactive web page; this deliverable is a video, so they do not apply. Captions: the one voice line is captioned only if you add them (the earlier version typed it on screen; this cut does not caption it, and it is a fragment cut mid-word on purpose).
- **Rights to confirm before public release:** the Rahal recording (no ownership or TTS-terms note in the repo), and the Remotion license for your team size.
- **External research** could not open web pages; `TEASER_REFERENCE_RESEARCH.md` is from search snippets and general knowledge, with no verified sources. External sound libraries and image generators were unavailable, so everything is original or from the game.
- **Known weak spots:** boxy 3D geometry in close-ups (door handle, wall seam, ceiling fixture); a bright fog bloom at the far end of the lit corridor; the first 3 s of the hook are quiet screens waking; the CCTV frames are 704x576 upscaled.
