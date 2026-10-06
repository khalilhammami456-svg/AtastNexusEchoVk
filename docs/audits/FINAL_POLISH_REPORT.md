# NEXUS ECHO: final narrative, immersion, audio and production pass

What was found, what was changed, what was left alone and why, and what was
verified. Everything claimed here was run; where something could not be
verified it says so.

## What the pass found that mattered most

Reading the case as a player, from the first scan to the last answer, turned
up defects that no earlier audit had reached because they only show when the
whole game is played through:

| Finding | Effect on a team | Fixed |
|---|---|---|
| P33 accepted `CONVERGENCE`; every hint, the slot display and the recorded solution said `CONVERGE` | A team doing exactly what the screen said was rejected, and could not pass P33 | Yes |
| P34 accepted `C`; the sequence, hints and solution said `D` | Same, at P34 | Yes |
| The case never closed: solving the last lead changed nothing, and the ending screens were linked from nowhere | There was no ending | Yes |
| Solving a lead returned no evidence to the team | The evidence archive of a real team stayed empty | Yes |
| The app compared the server's team status (`ACTIVE`, `COMPLETED`) with the case status it expected (`RUNNING`, `ENDED`) | The hub's open / closed states never matched a real team | Yes |
| A lead's reward, Lina's note and the next location were sent to the browser before the lead was solved | A team could read ahead in the network tab | Yes |
| The moment of a solve was a toast containing a UUID, then a redirect after two seconds | The most important text in the game was unreadable | Yes |
| Lina's notes (`LINA'S NOTE: ...`) were never shown to the player anywhere | The game's one human voice was missing | Yes |
| Hand-offs at M03 and P21 sent teams to the rooftop while the next lead was in a different building; P35 told the player to "PROCEED TO P36" | Teams sent the wrong way | Yes |

## Narrative

- **Reveal on solve** (`2026100401`): the answer to a correct entry carries what the lead gave back: the system's line, the material recovered, Lina's note about the next place. A closed lead can be opened again and shows the same. An open lead no longer carries any of it.
- **Closed-lead screen** (`LeadClosed`): verdict, record, material recovered (linked to the archive), the new lead in Lina's hand, the next place. It never leaves on a timer. The hub shows her note on the next lead as NEW LEAD until the team opens it.
- **The case closes**: solving a lead with no successor completes the team, records `TEAM_COMPLETED`, and the closing entry shows the real score, leads closed, time on case (frozen at the moment it closed) and the final record from the server.
- **Text** (`2026100402`): 67 vetted edits: hand-offs that name the place the next lead really is; Subject 05 (P07) pays off in the closing memo; Carter, Vale and Rahal acquire a trace; Lina's voice returns in margins and notes; two checkout dates that disagreed now agree; leaked author notes removed; the ending asks what to do with the truth (each role gets a distinct stake at P35, P36 says "decide what it was for", P37 stops congratulating). The 04:15 / 04:17 (P24b) and 17:30 / 19:45 (P23) clashes, and `29 OF 28 SLOTS` (P30), are intentional and were kept.
- **Left alone on purpose**: any edit that changes what a puzzle physically shows or how it is solved (glyph counts, clock readings, document layouts), fragment words, titles, answers other than the two broken keys. See `NARRATIVE_OPEN_ITEMS.md`: those need someone who has stood in the building.

## Pacing

- Walking time and reading load were measured per stage (`final-polish/PACING_AUDIT.md`). Added at the stage boundaries (M03, M04): an instruction to walk it slowly and talk it through; reading nodes (P24b, P27b) now say to read aloud as a team; P19 and P21 are framed as the open-air stop and the breath before the meta.
- **Not fixed, needs a decision**: the content totals about 460 minutes of estimated play against a 180-minute clock. Stages 4 and 5 are unreachable for an average team. Playtest, then rescale the timer or call the last stages a bonus zone. Estimates were not edited to hide this.

## Audio

There was no sound in the interface at all; the only audio was twelve recordings behind bare players. Now:

- A small synthesised palette, defined in one file (`src/lib/audio/cues.ts`): sixteen cues, no audio files. Tiers: special > narrative > gameplay > system > atmosphere; a higher tier ducks the ones below it. Three motifs: NEXUS (a low open fifth), anomaly (two detuned partials), transmission (carrier opens, squelch closes).
- Silence is the default. Navigation, scrolling and menus make no sound. Cues fire only where the case changes: scan result, verification, rejection, hint, new material, contradiction (P24b), major discovery (P29, P34), the case closing, the link dropping and returning, NEXUS on escalation, strong glitches.
- Every cue has its visual twin written next to it, and a test requires one. Nothing is carried by sound alone.
- Settings (Display & Access): sound on/off, volume with a test cue, optional room tone (off by default).
- **Mobile**: audio starts only after the first touch; a hidden page is silent (`visibilitychange`, `pagehide`); an interrupted context is revived by the next gesture; the phone's silent switch note is on the settings page.
- **Transmissions** (`Transmission`): signal received, receiving, held, signal lost, one voice at a time, paused when the page is hidden; the P24b duplicate clip is gone.
- **Recordings** normalised from a 9.9 LU spread to within 0.1 LU at -23 LUFS (the Entity deliberately 3 LU lower), mono 24 kHz 64 kbps: 1.86 MB to 0.94 MB. `npm run audio:check` fails if one drifts.
- **Measured in a real browser** (`scripts/audio/measure-cues.mjs`): found and fixed a compressor that overshot a noise onset by 17 dB, and ramps scheduled so close to the clock that a busy page turned them into pops. Final measured peaks run from about -9 dBFS (the closing cue) to -29 dBFS (link state). **Residual**: in headless Chromium the first noise-based cue after load occasionally measures a transient (-7 dBFS) that does not recur; tone cues are clean. Check on a real phone.

## Immersion and language

Loading, errors, the waiting room, login failures, QR results, notifications (stored titles are re-voiced on screen), hints (the cost is time on the clock, which the old copy got wrong), the offline banner, 404, the closing entry. Generic web patterns removed: the toast component, UUIDs on screen, a full-page reload on map select, three redundant stat tiles, simulation text in the player build. Lina's note renders in a vendored hand (Caveat, OFL).

## Production

Removed: root decoders and screenshot, ~9 unreferenced source files, `gsap`, `puppeteer`, `source-map`, a broken script, duplicate teaser docs, the fabricated evidence fallback in production, the simulation evidence archive in production builds. Source maps are hidden. `.env.example` reads exactly what the app reads. Docs moved under `docs/`. No `console.log`, `debugger` or secret anywhere; the ~70 `console.warn/error` calls are error paths and log nothing sensitive.

## Verified

| Check | Result |
|---|---|
| `npm run lint` (0 warnings) | pass |
| `tsc --noEmit` | pass |
| `vitest run` | 60+ files, 820+ tests pass |
| `npm run build` | pass |
| Database: every migration replayed on PostgreSQL 16 plus `supabase/tests/*.sql` | pass, including a **full-case walkthrough** (all reachable leads solved in order, the last one closing the case), reveal gating, evidence filing, and a test that every "Submit X" hint equals the accepted key |
| `npm run evidence:lock`, `npm run audio:check` | pass |
| Real Chromium at 390 px: closed lead, final lead, revisit, settings, transmission player (play, hold, second voice holds first, signal lost), 404 | no overflow, no errors |
| Cue levels in a real AudioContext | measured, see Audio |

## Scorecard (honest)

| | /10 | Why not higher |
|---|---|---|
| Narrative coherence | 7 | Physical-puzzle contradictions (clock, glyph counts) are documented but not fixed |
| Narrative escalation | 6 | After P30 the only new information is the roles; the plateau P14-P20 remains |
| Setup / payoff | 7 | Main threads paid; symbol numbering and fragment words need the owner |
| Recontextualization | 6 | Added at P28 and P36; still sparse in the middle |
| Pacing | 6 | The clock does not fit the content; fixes are framing only |
| Puzzle / story integration | 7 | Roles pay off at P26 and P32, less elsewhere |
| Ending | 7 | Now reachable and a question rather than a form; the P35 terminals still ask for a typed word |
| Audio design | 7 | Not heard on a real phone speaker |
| Audio restraint | 8 | |
| Immersion | 7 | Several screens still read as a form (login, notifications) |
| Atmosphere | 7 | |
| Micro-interactions | 7 | Queued answers still return no verdict; wrong answers now speak |
| Visual / audio sync | 7 | Cues and visuals are paired by design and by test, not frame-synchronised |
| Production cleanliness | 8 | Dev showcase assets (7 MB) still ship |
| Code quality | 8 | |
| Mobile experience | 7 | Verified in an emulated 390 px browser, not on devices |
| Overall polish | 7 | |

## Release blockers

- **Critical**: none known. The two answer-key defects and the unreachable ending, which were critical, are fixed and covered by tests.
- **High**: the timer / content mismatch (a decision, not a defect to patch); the physical-puzzle contradictions listed in `NARRATIVE_OPEN_ITEMS.md` (P07 decode, P01 columns, clock hands) need a walk-through of the real installation before event day.
- **Low**: queued-answer verdict after reconnect; single "mark read" is local until the next poll; login validates while typing; `public/evidence` ships 7 MB of showcase images; a Supabase client placeholder fallback when env vars are missing.
