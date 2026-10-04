# NEXUS ECHO — cinematic teaser (Remotion)

A 56-second teaser, 1920×1080 at 30 fps, built from the game's own evidence, brand and recordings. It lives beside the game and does not touch it: its own `package.json`, its own dependencies (Remotion 4.0.532), no shared code.

Read first: `../../TEASER_STORY_BIBLE.md` (what the story is), `../../TEASER_SPOILER_MAP.md` (what must stay hidden), `TEASER_SHOT_LIST.md`, `NEXUS_ECHO_TEASER_SCRIPT.md`.

**Central question:** At 03:17:11 the recorder saw an empty corridor. Which record is lying?

## Run it

```bash
cd video/nexus-echo-teaser
npm install
node scripts/audio.mjs                 # synthesise public/audio/teaser-mix.wav from the timeline
npm run studio                         # Remotion Studio
node scripts/render.mjs --preview      # half-size draft  -> out/nexus-echo-teaser-preview.mp4
node scripts/render.mjs                # final            -> out/nexus-echo-teaser.mp4
node scripts/verify.mjs                # duration, size, fps, frames, black frames, clipping
node scripts/docs.mjs                  # regenerate the shot list and script from the timeline
node scripts/stills.mjs 12 40.5 47.4   # PNG stills at given seconds -> out/stills/
node scripts/sheet.mjs out/sheet.png   # contact sheet of out/stills
```

Remotion needs a headless-shell Chromium. `scripts/common.mjs` looks in `/opt/pw-browsers`; set `CHROME=/path/to/headless_shell` to override. On a normal machine Remotion downloads its own.

## How it is organised

- `src/data/timeline.json` — the single source of truth: every shot (kind, start, duration, source asset, camera from/to, grade, CRT, grain, tears, text, stamp, caption) and every audio cue. Visuals and sound are both generated from it, so a retime changes both.
- `src/components/` — `camera.tsx` (focus-point camera with edge clamping), `fx.tsx` (CRT, grain, signal tear), `text.tsx` (typed system text, caption, stamp), `shots.tsx` (image, phone, montage, reveal and title shots).
- `src/Teaser.tsx` — lays the shots on the timeline with `Sequence`; images are `Img` (render waits for load) and fonts block rendering until decoded, so no frame shows a missing asset.
- `src/Root.tsx` — composition `NexusEchoTeaser`; props are validated with zod (`durationSeconds` 45–60, `audio`). Duration is configurable up to a hard maximum of 60 s; the authored timing is 56 s.
- `scripts/audio.mjs` — procedural sound design in plain Node (hum, hiss, sub pressure, pulse, clicks, tears, sting). The one voice line is the repo's `public/audio/p24b-rahal.mp3`, trimmed and processed with ffmpeg.
- `public/` — copies of the assets the teaser uses (images from `public/evidence`, a real UI capture, brand marks, IBM Plex Mono and Courier Prime). Nothing was generated or synthesised visually; all pictures are existing game assets.

## Honest limits

- Source images are small (CCTV 704×576, photographs 1024×814, documents 850×1100). They are upscaled to 1080p, so every zoom is limited and the CRT/grain treatment carries the rest.
- There is no music in the repository, so none was used.
- The audio was verified by measurement (loudness, peak, silence windows, spectrogram), not by ear.
- The spoken line was identified by speech recognition and matched to the seed transcript.
- The Remotion agent skills plugin was not enabled in this environment; the code uses the installed 4.0.532 API.
