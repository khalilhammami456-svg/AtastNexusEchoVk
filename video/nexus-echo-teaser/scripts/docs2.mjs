// Generates TEASER_TIMELINE.md and TEASER_SHOT_LIST.md from src/data/timeline2.json.
import fs from 'node:fs'
const TL = JSON.parse(fs.readFileSync('src/data/timeline2.json', 'utf8'))
const t = (s) => { const m = Math.floor(s / 60); return `${String(m).padStart(2, '0')}:${(s - m * 60).toFixed(3).padStart(6, '0')}` }
const inShot = (s) => TL.audioCues.filter((c) => c.t >= s.start - 1e-9 && c.t < s.start + s.dur - 1e-9)
const SFX = new Set(['relay_click', 'crt_power', 'phone_buzz', 'paper_slide', 'paper_drop', 'paper_open', 'soft_thud', 'shutter', 'shutter_rapid', 'pen_scratch', 'pen_stop', 'pin_strike', 'string_pull', 'footstep', 'tape_insert', 'motor_whir', 'rec_beep', 'static_burst', 'lamp_buzz', 'light_flicker', 'flicker_cut'])
const MUSIC = new Set(['motif_note', 'motif_final', 'riser', 'heartbeat_start', 'heartbeat_accel', 'hum_on', 'room_tone', 'tape_hiss'])
const IMPACT = new Set(['impact_low', 'sting', 'silence'])

const lines = []
lines.push('# NEXUS ECHO teaser - timeline', '', `${TL.durationSeconds} s, ${TL.width}x${TL.height}, ${TL.fps} fps (${TL.durationSeconds * TL.fps} frames). Generated from \`src/data/timeline2.json\` by \`scripts/docs2.mjs\`.`, '', `**Central question:** ${TL.centralQuestion}`, '', 'Every cut, every sound cue, every music cue, in time order. Times are absolute (mm:ss.mmm).', '')
const events = [
  ...TL.shots.map((s) => ({ t: s.start, k: 'CUT', text: `**${s.id}** (${s.dur.toFixed(2)} s) - ${s.visual} - ${s.camera} - transition: ${s.transition}` })),
  ...TL.audioCues.map((c) => ({ t: c.t, k: SFX.has(c.cue) ? 'SFX' : MUSIC.has(c.cue) ? 'MUSIC' : c.cue === 'voice' ? 'VOICE' : IMPACT.has(c.cue) ? 'IMPACT' : 'AUDIO', text: `${c.cue}${c.note ? ' - ' + c.note : ''}` })),
].sort((a, b) => a.t - b.t || (a.k === 'CUT' ? -1 : 1))
for (const e of events) lines.push(`- \`${t(e.t)}\` **${e.k}** ${e.text}`)
lines.push('', '## Fragment montage (B13, 42.0-46.8 s)', '', 'Seventeen cuts whose lengths shrink from about 0.7 s to 0.15 s on the same schedule as the 18 shutter clicks (the 18th lands on the figure at 46.8 s): corridor ceiling light (render), CAM-07 on a CRT with a live stamp, tape reels, handwriting macro, door frame (render), evidence-board string and pin, 03:17:11 digits, a dark crop of the second photograph (floor and box only), CAM-06 NO SIGNAL, the far door (render), dictaphone reels, deck reels, the corridor in motion (render), 03:17:11 again in red, two more corridor details, then 1.2 s of the figure emerging (render).')
fs.writeFileSync('TEASER_TIMELINE.md', lines.join('\n') + '\n')

const rows = TL.shots.map((s, i) => {
  const cues = inShot(s)
  const pick = (set) => cues.filter((c) => set.has(c.cue)).map((c) => `${c.cue}@${c.t.toFixed(1)}`).join(', ') || '-'
  return `| ${String(i + 1).padStart(2, '0')} | ${s.id} | ${t(s.start)} | ${s.dur.toFixed(2)} | ${s.visual} | ${s.camera} | ${pick(SFX)} | ${pick(MUSIC)} | ${pick(IMPACT)}${cues.some((c) => c.cue === 'voice') ? ' voice@20.1' : ''} | ${s.transition} | ${s.intensity} (L${s.level}) | ${s.spoiler} | ${s.purpose} |`
})
const out = ['# NEXUS ECHO teaser - shot list', '', `Generated from \`src/data/timeline2.json\`. ${TL.shots.length} shots, ${TL.durationSeconds} s.`, '', '| # | SHOT | START | DUR (s) | VISUAL | CAMERA | SFX | MUSIC / AMBIENCE | IMPACT / VOICE | TRANSITION | INTENSITY | SPOILER | PURPOSE |', '|---|---|---|---|---|---|---|---|---|---|---|---|---|', ...rows, '', 'Visual keys: `set:*` = a physical set built from layers with parallax and depth of field; `render:*` = frames of a real 3D camera move rendered with the game\'s own renderer; `montage` = the 17-cut fragment sequence; `title` = brand lockup.']
fs.writeFileSync('TEASER_SHOT_LIST.md', out.join('\n') + '\n')
console.log('wrote TEASER_TIMELINE.md and TEASER_SHOT_LIST.md')
