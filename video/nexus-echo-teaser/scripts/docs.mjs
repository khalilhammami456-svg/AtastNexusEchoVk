// Generates TEASER_SHOT_LIST.md and NEXUS_ECHO_TEASER_SCRIPT.md from src/data/timeline.json so the
// documents cannot drift from what renders. Per-shot editorial notes live in META below.
import fs from 'node:fs'
const TL = JSON.parse(fs.readFileSync('src/data/timeline.json', 'utf8'))
const A = TL.audio
const t = (s) => { const m = Math.floor(s / 60); const x = (s - m * 60).toFixed(1).padStart(4, '0'); return `${String(m).padStart(2, '0')}:${x}` }

const META = {
  'S01-hook-cam07-stamp': { audio: 'Silence into tape hiss and 50 Hz mains hum (fade-in 1.2 s); relay click at 0.3 s; signal-tear burst at 2.5 s', text: 'On image: "14-10-94 03:17:11", "FRAME DROPOUT 03:17:05-03:17:18" (part of the evidence frame)', spoiler: 'SAFE TO SHOW', source: 'NX-CAM-07 / public/evidence/surveillance/surv_cam07_031711.jpg', transition: 'Fade up from black; cut' },
  'S02-world-b01-print': { audio: 'Hum continues; typed ticks for "CASE 037" at 4.3 s; stamp thud at 7.3 s', text: '"CASE 037" (typed), RECOVERED stamp (public/brand/stamp-recovered.svg)', spoiler: 'SAFE TO SHOW', source: 'NX-037-B-01 / photo_nx037_b_01.jpg (the corridor with nothing in it; B-02 is held back)', transition: 'Hard cut' },
  'S03-phone-archive': { audio: 'Two phone buzzes at 9.8 s and 10.1 s; hum under', text: 'Real handset UI: CAM-07 / EAST CORRIDOR, FRAME 9/9, TAPE 7', spoiler: 'SAFE TO SHOW', source: 'docs/evidence-screenshots/mobile-02-surveillance-inspection.png (a real capture of the app)', transition: 'Hard cut' },
  'S04-doc-d08': { audio: 'Hum; relay click on the cut', text: 'On image (canonical): "03:17 MANUAL STOP. NO REASON GIVEN."', spoiler: 'SAFE TO HINT (D-08; the exact stop window is a mid-game reveal and is not shown)', source: 'NX-037-D-08 / doc_nx037_surveillance_log.jpg', transition: 'Hard cut' },
  'S05-cam06-voice': { audio: 'The repo\'s own recording p24b-rahal.mp3, 2.35-5.35 s of the clip, cut after "powered down"; typed ticks; hiss', text: 'Caption: "THE EAST LABORATORY CAMERAS WERE POWERED DOWN—" (cut off)', spoiler: 'SAFE TO HINT (puzzle P24b line; the contradicting witness is not used)', source: 'NX-CAM-06 / surv_cam06_0316_offline.jpg + public/audio/p24b-rahal.mp3', transition: 'Hard audio and picture cut at 23.4 s' },
  'S06-silence-black': { audio: 'Absolute silence (23.4-24.6 s)', text: '-', spoiler: 'n/a', source: '-', transition: 'Hard cut in and out' },
  'S07-note-n02': { audio: 'Thin hum returns; pressure layer begins 28 s; heartbeat-like pulse starts 29 s at 56 bpm', text: 'On image (canonical, handwritten): the observer\'s note, ending "03:17 —"', spoiler: 'SAFE TO HINT (foreshadowing seed; the sketch captioned "me" is deliberately out of frame)', source: 'NX-037-N-02 / note_observer02_02.jpg', transition: 'Hard cut' },
  'S08-montage': { audio: 'Camera-shutter clicks on each cut, pulse accelerating, rising band-pass pressure, signal-tear bursts on the three tear cuts', text: 'On images only', spoiler: 'SAFE TO HINT (each record is cropped; none is held long enough to read in full)', source: 'F-02 (frag_nx037_c_02.jpg), CAM-07, P-05 (personnel_lv_0029_duplicate.jpg, blurred), M-02 (map_east_wing_issue02.jpg), D-08, B-01', transition: 'Accelerating cuts: 1.8, 1.4, 1.1, 0.9, 0.7, 0.55, 0.45, 0.4, 0.3 s' },
  'S09-reveal-same-corridor': { audio: 'Pulse at 150 bpm, sub-bass pressure at its peak, hum swell; tear burst at 42.7 s; everything cuts to silence at 47.6 s', text: '-', spoiler: 'SAFE TO HINT (B-02 degraded, cropped and dark; the figure is a silhouette with no face; no caption)', source: 'NX-037-B-01 then NX-037-B-02 / photo_nx037_b_01.jpg, photo_nx037_b_02.jpg', transition: 'Signal tear at 42.7 s swaps the photographs' },
  'S10-black-hard-cut': { audio: 'Absolute silence (47.6-48.5 s)', text: '-', spoiler: 'n/a', source: '-', transition: 'Hard cut' },
  'S11-cam07-empty': { audio: 'Quiet tape hiss only, -40 dB', text: 'On image: timestamp, "FRAME DROPOUT 03:17:05-03:17:18"', spoiler: 'SAFE TO SHOW', source: 'NX-CAM-07', transition: 'Hard cut to black' },
  'S12-black': { audio: 'Faint room tone then nothing', text: '-', spoiler: 'n/a', source: '-', transition: 'Cut' },
  'S13-title': { audio: 'Single low metallic impact with a decaying partial cluster, CRT lock-on zip over the first 6 frames', text: 'NEXUS ECHO (brand lockup), "CASE 037"', spoiler: 'n/a', source: 'public/brand/lockup-dark.svg', transition: 'CRT line lock-on, signal reconstruction; held to the end' },
}

const rows = TL.shots.map((s, i) => {
  const m = META[s.id]
  return `| ${String(i + 1).padStart(2, '0')} | ${t(s.start)} | ${s.dur.toFixed(1)} s | ${s.purpose} | ${m.audio} | ${m.text} | ${m.spoiler} | ${m.source} | ${m.transition} |`
}).join('\n')

const list = `# NEXUS ECHO teaser — shot list

Generated from \`video/nexus-echo-teaser/src/data/timeline.json\` by \`scripts/docs.mjs\`. ${TL.durationSeconds} s, ${TL.width}×${TL.height}, ${TL.fps} fps.

**Central teaser question:** ${TL.centralQuestion}

| # | TIME | DURATION | PURPOSE | AUDIO | TEXT | SPOILER LEVEL | SOURCE ASSET | TRANSITION |
|---|---|---|---|---|---|---|---|---|
${rows}

Montage cuts (shot 08): ${TL.shots.find((s) => s.kind === 'montage').cuts.map((c) => `${c.src.split('/').pop()} ${c.dur}s`).join(' → ')}.
`
fs.writeFileSync('TEASER_SHOT_LIST.md', list)

const script = `# NEXUS ECHO — teaser script

Central question: **${TL.centralQuestion}**

The teaser has no narration and no exposition. It speaks through evidence, one recorded voice, and the system. It never says what NEXUS is, who the player is, who is missing, or how the case ends.

## Emotional line
Curiosity (0:00) → unease (0:03) → interest (0:10) → suspicion (0:16) → silence (0:23) → dread (0:25) → urgency (0:33) → revelation (0:40) → silence (0:47) → question (0:48) → title (0:52).

## Sequence
${TL.shots.map((s) => { const m = META[s.id]; return `**${t(s.start)} — ${s.id.replace(/^S\d+-/, '').replace(/-/g, ' ')}** (${s.dur.toFixed(1)} s)\n- Visual: ${s.purpose}\n- Source: ${m.source}\n- Sound: ${m.audio}\n- Text: ${m.text}\n` }).join('\n')}
## Dialogue
One line, from the game's own recording (\`public/audio/p24b-rahal.mp3\`), cut mid-sentence: "…the east laboratory cameras were powered down…". The seed transcript for that clip reads: "The east laboratory cameras were powered down for maintenance beginning at 04:15." The teaser stops before "for maintenance". The words were checked against the seed text (\`2026093035_audio_evidence_integration.sql\`) and by speech recognition of the file; they were not heard by a person.

## On-screen text (everything that is not part of an evidence image)
"CASE 037", RECOVERED (stamp), the caption above, "NEXUS ECHO", "CASE 037".

## Sound identity
Tape hiss and 50 Hz mains hum; a slow sub-bass pressure that rises from 28 s; a pulse that starts at 56 bpm and reaches 150 bpm; relay, typing, camera-shutter and phone-buzz clicks; two total silences (23.4–24.6 s, 47.6–48.5 s); one impact at the title. Everything but the voice is synthesised by \`scripts/audio.mjs\` from the timeline; there is no music in the repository and none was added.

## The hidden breadcrumb
The corridor appears empty at 3.4 s and again at 40.2 s. Then the same corridor returns degraded and a figure resolves out of the dark, and the recorder's frame (empty, stamped 03:17:11) answers it. After playing, the viewer knows who recorded what and why the two records cannot both be true. The note that stops at "03:17 —" is the second breadcrumb.
`
fs.writeFileSync('NEXUS_ECHO_TEASER_SCRIPT.md', script)
console.log('wrote TEASER_SHOT_LIST.md, NEXUS_ECHO_TEASER_SCRIPT.md')
