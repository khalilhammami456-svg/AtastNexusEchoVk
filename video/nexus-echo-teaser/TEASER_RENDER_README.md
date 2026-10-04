# NEXUS ECHO teaser - how to render

Composition `NexusEchoTeaser`, 1920x1080, 30 fps, 56 s (hard maximum 60 s). Props (validated with zod): `version` A|B|C (sound), `hook` A|B, `ending` A|B, `audio` boolean. The chosen cut is `version=A hook=A ending=A`.

```bash
cd video/nexus-echo-teaser
npm install
node scripts/shots/render-shots.mjs --jobs 4     # 3D corridor frames (about 15 min on 4 cores)
bash scripts/shots/encode.sh                      # frames -> public/shots/*.mp4
node scripts/audio2/build.mjs --version=all       # stems + mix for A, B, C (about 20 s each)
npm run studio                                    # preview in Remotion Studio
node scripts/render.mjs --preview                 # half-size animatic with sound
node scripts/render.mjs                           # full-resolution master
node scripts/verify.mjs out/<file>.mp4            # duration, size, fps, frames, black frames, clipping
node scripts/docs2.mjs                            # regenerate TEASER_TIMELINE.md and TEASER_SHOT_LIST.md
```

Useful flags: `--hook=B`, `--ending=B`, `--version=B`, `--no-audio`, `--range=40-50` (seconds, for A/B tests), `--out file.mp4`.

Remotion needs a headless-shell Chromium; `scripts/common.mjs` finds one in `/opt/pw-browsers`, or set `CHROME=/path/to/headless_shell`.

## Structure

- `src/data/timeline2.json` - the single source of truth: 17 shots (start, duration, visual, camera, transition, intensity, spoiler level, purpose) and 64 audio cues. Visuals and audio are both built from it.
- `src/v2/sets/` - `MonitorWall` + `CrtMonitor` (control room), `Desk` (top-down / tilted desk), `Phone`, `Board`, `TapeDeck`, `NotePen`, `Corridor` (3D frames), `Fragments` (montage), `props.tsx` (drawn objects).
- `src/v2/Teaser2.tsx` - lays the shots on the timeline; `AudioBus.tsx`, `Degrade.tsx`, `data.ts`, `motion.ts`.
- `src/components/` - shared CRT, grain, tear and title components.
- `scripts/audio2/` - the sound design generator; `scripts/shots/` - the 3D shot renderer.
- Official Remotion skills are installed in `.agents/skills` and `.claude/skills` (`npx skills add remotion-dev/skills`, verified working in this environment).
