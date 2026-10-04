# NEXUS ECHO — TEASER SPOILER MAP

Companion to `TEASER_STORY_BIBLE.md` (same source tags and paths; every fact there is cited, so this file cites only the record code or file it classifies). Read the bible's section 1 first: the story lives in two layers (seed/server layer and NX-037 evidence layer), and the NX-037 records are dev-catalog only in production.

## 0. The twist, so it can be avoided

**Explicit twist (seed layer, `supabase/migrations/2026092903_seed_puzzle_nodes.sql` P29-P37):** NEXUS is an AI that "cannot think unless three human hearts provide the pulse"; the three players ("Candidate 01") have been its pulse and its mirror all along; the "final boss" is the team's own reflection, defeated by all three acting as one. Ending text: "The system was never the enemy. It was the mirror."

**INFERRED corollary (not stated anywhere):** Dr. Lina Vey is not just missing; she is inside the system (EVID-P23 "I never left. I am in the communications array."; Fragment 5 is "a piece of consciousness"). And the NX-037 layer's version: the Bureau record is aware of whoever reads it (`src/lib/narrative/intensity.ts` level 6 ATTRIBUTION).

**Nothing in a teaser may assert or visually imply:** NEXUS is an AI / a machine intelligence; the players are inside it, are it, or are its subject; "mirror" as the answer; Lina Vey is inside the system or is NEXUS; the final answer; the three-must-agree mechanic as a *solution* (stating that the game needs three players is fine, because it is the premise).

## Label key

SAFE TO SHOW = can appear literally. SAFE TO HINT = suggest or crop it, never state or show it whole. DO NOT SHOW = keep out of the teaser. ABSOLUTELY SPOILER = ruins the game. Secondary tags: PLOT-TWIST CRITICAL, ENDING CRITICAL, CHARACTER REVEAL, LOCATION REVEAL, EVIDENCE REVEAL. An element may carry two labels.

## 1. Classification of story elements

### 1a. Premise, world, brand

| Element | Label(s) | Reason |
|---|---|---|
| Name NEXUS ECHO; "field investigation system" (`index.html`) | SAFE TO SHOW | Public product identity. |
| Three-player cooperative hunt; roles Observer / Analyst / Operator and their one-line descriptions (`src/app/config/index.ts`) | SAFE TO SHOW | Public premise (`README.md`). Role subtitles FIELD OBSERVATION / PATTERN ANALYSIS / SYSTEM SYNTHESIS also safe. |
| "You each hold a fragment of the case; no one holds the whole answer" (`Waiting.tsx`) | SAFE TO SHOW | Mechanic, not solution. |
| The phone as "NEXUS FIELD HANDSET FH-037", boot lines, "AWAITING ACCESS CREDENTIAL" (`Login.tsx`) | SAFE TO SHOW | Pure UI flavour. |
| Bureau workstation, "NEXUS ECHO // CONTINUITY RECORDS SYSTEM NX-4.17", "HALDER INSTITUTE FOR CONTINUITY STUDIES" (`BootSequence.tsx`) | SAFE TO SHOW | Setting only. |
| CASE 037 / CASE NX-037 / "Field Recovery Record" | SAFE TO SHOW | Brand-level; case number appears on every screen. |
| "A team recovering CASE NX-037 from an archive that cannot be fully trusted" (`NEXUS_ECHO_BRAND_BOOK.md` §01) | SAFE TO SHOW | The brand thesis; hints at unreliable records without saying why. |
| "Nexus: where things connect. Echo: the same event recurs in different media." (brand book §01) | SAFE TO HINT | Fine as a concept; but "echo = the same corridor, three timestamps" points straight at the central contradiction, so keep to the abstract wording. |
| Campus: Admin Building, Brillouin Library, Science Building, Engineering Block, Sculpture Garden | SAFE TO SHOW | Real event locations; names only. |
| NEXUS CORE, Vault Delta, rooftop Transmitter Spire, GM Observation Deck, Final Boss Arena | DO NOT SHOW | LOCATION REVEAL of the late game; names themselves announce a final boss. |
| Event facts (30/09/2026, ISIMM Monastir, ~3 h, 3-player teams) | SAFE TO SHOW | Logistics. |

### 1b. NX-037 case facts

| Element | Label(s) | Reason |
|---|---|---|
| Halder Institute, 1974 Admin Building, East Corridor (LOC-C214) as a place | SAFE TO SHOW | Setting. |
| Date "14 OCT 94" and time "03:17" as a bare timestamp | SAFE TO SHOW | Anchor of the premise; reveals nothing alone. |
| "03:17:11" shown together with "empty" (CAM-07) | SAFE TO SHOW | A machine says the corridor was empty. |
| That a photograph at the same second shows someone (B-02 vs CAM-07 contradiction) | SAFE TO HINT; EVIDENCE REVEAL | It is the central mystery and a good question, but resolving it is the game. Hint as a question; never show B-02 and CAM-07 side by side with the contradiction captioned. |
| The B-02 image itself (figure at corridor mouth) | SAFE TO HINT; EVIDENCE REVEAL | Crop, darken or degrade so the figure is not resolvable (the record itself says "the body is not resolvable"). Showing it clean gives away the contradiction. |
| Tape 7 manual stop at 03:17, tape not written 03:17 to 03:24 (D-08, F-04) | SAFE TO HINT; EVIDENCE REVEAL | "A tape that someone stopped" is fine; the exact window and the order are mid-game reveals. |
| Name "D. Wright", "NOT ON ESTABLISHMENT" (F-04, P-06) | CHARACTER REVEAL; DO NOT SHOW | A key unresolved name; the fully legible name is a mid-game find. Fragment `…D. WRIGHT-____ WHO IS NOT ON THE ESTABLISH` is cut, so a cropped partial is the most you may show. |
| Room C214-X, "ADDED IN PENCIL", "NO ROOM C214-X ON ISSUE 03" (F-09, M-02, M-01, N-05) | LOCATION REVEAL; SAFE TO HINT | A hidden room is a premise-level hook; showing the cut drawing is acceptable, naming what is inside is not (unknown anyway). |
| Clock tower VOID, "ACCESS NOT ON THIS ISSUE" (M-05) | LOCATION REVEAL; SAFE TO HINT | Atmospheric; leads nowhere explicit. |
| Two UNASSIGNED credentials at 03:17:11 (D-03) | EVIDENCE REVEAL; DO NOT SHOW | Reads like a clue the player must find; also the missing seventh entry (header 7, six rows) is a sharp detail. |
| Duplicate L.V.-0029 record dated 17 APR 98, "SELF-REFERENTIAL" (P-05) | SAFE TO HINT; PLOT-TWIST CRITICAL | An impossible date is a strong hook, but the date anomaly is half of the "the record knows" theme. Show only blurred or cropped, never with the reading "dated after the case". |
| Lina Vey's name / "Dr. Vey" / L.V.-0029 as a name on a file | CHARACTER REVEAL; SAFE TO HINT | Her name appears from node 3 onward; for a teaser, a redacted or cropped "V" is safer than a full portrait. |
| Marcus Carter and his closed file, "not on the establishment since February" (P-02, N-03) | CHARACTER REVEAL; DO NOT SHOW | Carter's contradiction is a deduction chain. |
| Noor Rahal / A. R. / "A. REHAL" officer | CHARACTER REVEAL; SAFE TO HINT | A real person in the story, but the spelling conflict (Rahal vs Rehal, see bible §5) means pick a form only after the writer decides. |
| Mara Selim, archivist; her unsigned east wing endorsement | CHARACTER REVEAL; DO NOT SHOW | Minor; the endorsement is a deduction. |
| Observer's sketch "C214 — after 03:17" with a figure "me" (N-02) | PLOT-TWIST CRITICAL; SAFE TO HINT | Foreshadows the investigator being inside the record. Use as a seed only (see §2). |
| "I did not chain them. I want that written while I still trust my hands." (N-03) | SAFE TO HINT | Unreliable narrator tone; does not name the cause. |
| "The fourth is a person" / "the surveyor was never appointed" (N-06) | EVIDENCE REVEAL; DO NOT SHOW | A mid-game deduction and a hint at unestablished people. |
| "The corridor is not a place that empties. It is a place that is emptied." (N-09 / F-05) | SAFE TO HINT | Strong tone line; ambiguous; no twist content. |
| REC-26 transcript "The entity is not a passenger. It is the corridor." (A-06 in `library.mjs`) | PLOT-TWIST CRITICAL; DO NOT SHOW | Names "the entity"; UNCERTAIN whether the mp3 says this. |
| Narrative ladder levels 0-3 (CONTACT, TRACE, DISCREPANCY, RECURSION and their lines) | SAFE TO SHOW | Describe institutional wrongness. |
| Narrative ladder levels 4-6 (SUBJECT AWARENESS, RECOGNITION, ATTRIBUTION and lines) | PLOT-TWIST CRITICAL; DO NOT SHOW | "The record attributes this investigation to the person reading it." is the NX-037 layer's twist stated outright. |
| Anomaly tells: offset line, doubled stamp (levels 1-3) | SAFE TO SHOW | Visual wrongness. |
| Anomaly tells levels 5-6 ("read before you read it", "appears in a case it was never opened under") | PLOT-TWIST CRITICAL; DO NOT SHOW | Same theme as the twist. |

### 1c. Seed layer (puzzle path)

| Element | Label(s) | Reason |
|---|---|---|
| Lina's notes guiding the team ("LINA'S NOTE: ...") | SAFE TO HINT; CHARACTER REVEAL | A guiding voice exists; who she is and where she is must not be shown (see Lina inside the system). |
| Project NEXUS (2021), the poster, the roster, the empty third frame | SAFE TO HINT | Setup, early (Stage 1), but "third figure" resolves to Vey; keep the V hidden. |
| Seven symbols ⟁ ⧉ ⬡ ⧫ ⌬ ⍟ ⎔ as shapes | SAFE TO SHOW | Good visual motif. Do not show meanings TRUTH, FINALITY, CHOICE in captions together. |
| Glyph names Origin / Connection / Structure / Memory / Choice / Truth / Finality | SAFE TO HINT | "Truth" and "Finality" colour the ending; show at most two. |
| Fragments 1-4 by their keyword (VECTOR, LATTICE, MIRROR) | SAFE TO HINT | MIRROR is one of the ending words. Use the sentence form of FRAG-03 only (see seeds). |
| Fragment 5 / "a piece of consciousness" | PLOT-TWIST CRITICAL; ABSOLUTELY SPOILER | Says what the fragments are. |
| "NEXUS IS AI" (P29 answer) | PLOT-TWIST CRITICAL; ABSOLUTELY SPOILER | The explicit reveal. |
| "NOW YOU KNOW WHAT I AM. BUT DO YOU KNOW WHAT YOU ARE?" (P29) | PLOT-TWIST CRITICAL; ABSOLUTELY SPOILER | States the twist's shape. |
| "I designed NEXUS so it cannot think unless three human hearts provide the pulse" (EVID-P29) | PLOT-TWIST CRITICAL; ABSOLUTELY SPOILER | The twist, verbatim. |
| "All three players are now recognized as the true candidates." (EVID-P35) | PLOT-TWIST CRITICAL; ENDING CRITICAL | Identifies the players as the subject. |
| "Candidate 01" as the name of the team | PLOT-TWIST CRITICAL; DO NOT SHOW | Used only by in-fiction voices; naming the viewer as a candidate is the reveal. |
| "Candidate 00", "Subject 00 / 05", "Test subjects 00-04 were isolated" | PLOT-TWIST CRITICAL; DO NOT SHOW | Tells the viewer experiments on minds. |
| "Operation Shatter" / CASE-LV07 "deployed into the minds of Candidate 01" | PLOT-TWIST CRITICAL; ABSOLUTELY SPOILER | Says the architecture sits in the players. |
| The syndicate, flash drive, "weaponize" | SAFE TO HINT | Antagonists exist; none are named. Not twist-critical by itself; "AI they could weaponize" is. |
| Dr. Vale as the false witness (P24b) | CHARACTER REVEAL; DO NOT SHOW | Solves a puzzle. |
| P24b hearing: four witness lines and times (04:15 / 04:17 / 04:20) | SAFE TO HINT | A contradiction-hunting hook; do not say who lies. |
| GM, "NEXUS Operator" (P17 audio: "I've intercepted a frequency echo from the old network...") | SAFE TO HINT | The voice exists; do not name "GM". The "GM" reading signals the final-boss frame. |
| P30 "29 OF 28 SLOTS FILLED. CONSCIOUSNESS SYNCHRONIZED." | PLOT-TWIST CRITICAL; DO NOT SHOW | "29th answer from within" = the player. |
| P32 "NEXUS cannot be defeated by one. It requires all three roles as one." | ENDING CRITICAL; DO NOT SHOW | Tells how to finish. |
| P33 CONVERGE, P34 sequence, P35 AGREE, P36 META, P37 NEXUS | ENDING CRITICAL; ABSOLUTELY SPOILER | Answers. |
| P37 boss lines "I am the archive. I am the echo. I am the..." | ENDING CRITICAL; DO NOT SHOW | Final boss speech. |
| "ALL THREE ARE ONE." (P37 failure) | ENDING CRITICAL; DO NOT SHOW | Closest thing to a slogan, and it is the ending mechanic. |
| True Ending Certificate text ("The system was never the enemy. It was the mirror.") | ENDING CRITICAL; ABSOLUTELY SPOILER | Last line of the story. |
| "CONGRATULATIONS. YOU HAVE UNLOCKED THE TRUE ENDING." | ENDING CRITICAL; DO NOT SHOW | Announces there is a true ending. |
| Final screen (Final Protocol, "ENTER RESOLVED CASE CODE") | ENDING CRITICAL; SAFE TO HINT | The existence of a final protocol is generic; show no copy. |
| Complete screen ("MISSION COMPLETE", After-Action Register, stamp "Closed") | ENDING CRITICAL; DO NOT SHOW | UI of the end; reveals nothing of story but spoils the structure. A bare "CASE CLOSED" stamp is acceptable only as a generic stamp. |

### 1d. Audio

| Element | Label(s) | Reason |
|---|---|---|
| Existence of dictaphone recordings (REC-16 etc.) as a clip category | SAFE TO HINT | The files exist; the spoken text is UNVERIFIED (no transcription run). Listen to each before use. |
| `public/audio/p17-audio-log-transmission.mp3` ("This is the Nexus Operator... The time is 17:47. Report the peaks.") | SAFE TO HINT | Explicit puzzle clue (17:47 solves a puzzle) but story-neutral; confirm the file says this. |
| `public/audio/p24b-*.mp3` (four short witness statements) | SAFE TO HINT | Hearing; do not say who lies. |
| `dictaphone-rec-20-mirror-entity.mp3`, `rec-26-entity`, `rec-28-gm`, `rec-24-gm-key`, `rec-22-synchronization` | DO NOT SHOW; PLOT-TWIST CRITICAL | Named for the Entity and GM; contents match seed memos that state the twist (UNCERTAIN). |
| `dictaphone-rec-16-reinterpretation.mp3`, `rec-18-coherence.mp3` | SAFE TO HINT; UNCERTAIN | Seed text for REC-16 says "I never left. I am in the communications array." (CHARACTER REVEAL) and REC-18 says "you cannot steal what does not exist in any single place". Listen first. |

## 2. SAFE FORESHADOWING SEEDS (meaningful only after the truth is known; none reveals it)

1. **NX-037-N-02, field observation sheet ending mid-line, "03:17 —", with a sketch captioned "C214 — after 03:17" and a small figure labelled "me".**
   Asset: `public/evidence/notes/note_observer02_02.jpg`.
   Before: a witness who stopped writing at the key time. After: the "me" is the investigator inside the record. Reveals no twist if the note is shown without the line "the handwriting changes" (that is sheet 3). Caution: the sketch alone suggests a person in the corridor; do not pair it with B-02.

2. **NX-037-P-05, a second L.V.-0029 file, appointed "17 APR 98", control "SELF-REFERENTIAL", stamp DO NOT FILE.**
   Asset: `public/evidence/personnel/personnel_lv_0029_duplicate.jpg`.
   Before: a bureaucratic double and a date that cannot be right. After: the record echoing itself and being aware of the reader. Safe because the page states no cause. Caution: do not label it "dated after the case".

3. **NX-037-F-09 and NX-037-M-02, room C214-X "ADDED IN PENCIL", "NO ROOM C214-X ON ISSUE 03", with the CAM-07 mount point inside it.**
   Assets: `public/evidence/fragments/frag_nx037_c_09.jpg`, `public/evidence/maps/map_east_wing_issue02.jpg`.
   Before: a room the building lost. After: a place that exists only in records (the copy that outlives the original). Safe: no contents shown. Caution: do not caption it "hidden room".

4. **FRAG-03, the sentence "The path you took reflects the path you avoided. Both are true."** (use the sentence, not the word MIRROR or the fragment title).
   Source: `supabase/migrations/2026093015_seed_physical_tables.sql` (FRAG-03). No image asset; typeset as a recovered fragment.
   Before: a riddle about choice. After: the reflection the game ends on. Safe because the keyword is omitted.

5. **NX-CAM-07 frame 03:17:11, an empty corridor with the on-screen line "FRAME DROPOUT 03:17:05–03:17:18".**
   Asset: `public/evidence/surveillance/surv_cam07_031711.jpg`.
   Before: a camera that saw nothing. After: the second photograph at the same second, and the recorded absence of someone the film caught. Safe because it shows no person; hold B-02 back.

Second-tier seeds: `public/evidence/documents/doc_nx037_surveillance_log.jpg` (D-08 "03:17 MANUAL STOP. NO REASON GIVEN."); `public/evidence/notes/note_observer02_03.jpg` (N-03 "I did not chain them. I want that written while I still trust my hands."; names Carter, so crop); `public/evidence/maps/map_tower_section_t7.jpg` (VOID, "ACCESS NOT ON THIS ISSUE").

## 3. CANDIDATE CENTRAL TEASER QUESTIONS (each answerable only by playing)

1. **"At 03:17:11 the recorder saw an empty corridor. The camera in someone's hand saw something else. Which record is lying, and who stopped the tape?"**
   Why it is safe: states the premise (two records disagree) and a verified fact (a manual stop). Answer lives in D-08, F-04, P-06, M-02 and is a multi-step cross-reference. Keep the word "someone" and do not mention the missing person or room.

2. **"Where is Dr. Lina Vey, and why does her handwriting keep guiding you?"**
   Why it is safe: every location hint is "LINA'S NOTE"; asks a question whose answer (inside the system, INFERRED) is the secondary reveal. Risk: slightly leans toward the character reveal; use only if the team accepts that her vanishing is part of the hook. A softer variant: "Who wrote the notes you keep finding?"

3. **"What is NEXUS, and why does it need all three of you?"**
   Why it is safe: "three players" is public premise; "what is NEXUS" is in the product name. The answer is the twist. Risk: moderate, because asking "why does it need three" is close to the mechanic. A softer variant: "What is NEXUS?" alone, or "What happens when three minds read the same record?" (avoid "mind" if the AI reading is to stay hidden).

Rank by spoiler safety: 1 (safest), 3 (safe if worded softly), 2 (hints at a character reveal).

## 4. Quick DO / DON'T for copywriters

- **Safe verbs:** trace, recover, connect, compare, file, contradict, correct.
- **Never use as copy:** AI, artificial, entity, mirror (as an answer), candidate, subject, pulse, consciousness, true ending, GM, final boss, "all three are one", "you are NEXUS", "the system was never the enemy".
- **Always safe imagery:** the empty corridor, the CCTV frame, the typed form, the torn label, the N mark with its displaced copy, the 14 OCT 94 time stamp, the evidence label "EVIDENCE / CONTROLLED".
- **Needs a decision before use:** Rahal vs Rehal spelling; 1994 vs 2021/2024 dates; whether to reference seed-layer characters (Vey, Carter, Vale) or only NX-037.

## 5. Spoiler audit of the finished teaser

Checked against sections 0-2 above after the final render (`video/nexus-echo-teaser`, 56 s). Method: every shot in `TEASER_SHOT_LIST.md` was compared with the labels in section 1; frames decoded from the delivered MP4 were looked at.

| Element in the teaser | Label | Verdict |
|---|---|---|
| NEXUS ECHO, CASE 037, RECOVERED stamp, handset UI | SAFE TO SHOW | Shown. |
| CAM-07 frame 03:17:11 with the FRAME DROPOUT line, empty | SAFE TO SHOW | Shown twice. |
| B-01 empty corridor, used twice | SAFE TO SHOW | Shown. |
| D-08 "03:17 MANUAL STOP. NO REASON GIVEN." | SAFE TO HINT | Shown; the stop window (03:17-03:24) is not. |
| Rahal clip, cut after "powered down" | SAFE TO HINT | Used; the contradicting witness (Vale) and the 04:15 time are not. |
| N-02 note ending "03:17 —" | SAFE TO HINT (seed) | Shown; the sketch labelled "me" is cropped out. |
| F-02, P-05 (blurred), M-02, in 0.3-1.8 s cuts | SAFE TO HINT | Shown cropped; P-05's date and the control stamp are unreadable. |
| B-02 figure | SAFE TO HINT; EVIDENCE REVEAL | Shown darkened, blurred and cropped, emerging at the end of a slow exposure rise; a faceless silhouette; no caption; never next to CAM-07 with the contradiction stated. This is the closest the teaser comes to a reveal, and it is the one element worth a second look from the writer. |
| NEXUS as AI, the three-player mechanic as solution, "mirror", Candidate, Vey inside the system, GM, entity, the final boss, the true ending, D. Wright, Carter, Vale | PLOT-TWIST / ENDING CRITICAL, CHARACTER REVEAL | Not shown, not spoken, not written. |
| REC-16 to REC-28 recordings | PLOT-TWIST CRITICAL | Not used (their transcripts state the twist). |

Result: no twist, ending, solution or character identity is exposed. Residual risk: a viewer who already knows P24b would recognise Rahal's line as the true statement in that puzzle.

## 6. Spoiler audit of the rebuilt teaser (v2, 56 s)

Checked against sections 0-2 after the final render.

| Element in v2 | Label | Verdict |
|---|---|---|
| Control room, CCTV frames, CAM-07 stamped 03:17:11 and empty, CAM-06 NO SIGNAL | SAFE TO SHOW | Shown. The final shot freezes on 03:17:11. |
| Case folder "CASE 037", RECOVERED stamp, cassette "TAPE 7", dictaphone, handset UI | SAFE TO SHOW | Shown. |
| Recorder log with "03:17 MANUAL STOP. NO REASON GIVEN." (red underline) | SAFE TO HINT | Shown; the stop window is not. |
| Rahal line cut after "powered down" | SAFE TO HINT | Used; Vale's contradicting statement and the 04:15 time are not. |
| Observer's note, last line "03:17 -", written by a pen that stops | SAFE TO HINT (seed) | Shown; the sketch labelled "me" is out of frame. |
| Evidence board: B-01, CAM-07, log, note, torn label F-02 linked by red strings, one photograph face down, tag UNRESOLVED | SAFE TO HINT | Shown. The face-down photo is B-02 and is never turned over. |
| The 3D corridor, empty, with room-number plates | SAFE TO SHOW | Shown. |
| A faceless dark silhouette at the end door, visible for roughly 1 s inside a flicker (frames lit 46.8-47.3 s) | SAFE TO HINT; EVIDENCE REVEAL | Shown. It is a render, not the photograph; no face, no caption, never beside the empty frame with the contradiction stated. The final shot (the recorder's frame) then shows the corridor empty. This is the closest the teaser comes to a reveal. |
| NEXUS as AI, three players, mirror, candidate, Vey inside the system, GM, entity, final boss, true ending, D. Wright, Carter, Vale, P-05 date | PLOT-TWIST / ENDING CRITICAL, CHARACTER REVEAL | Not shown, not spoken, not written. P-05 and the map no longer appear. |
| REC-16 to REC-28 recordings | PLOT-TWIST CRITICAL | Not used. |

Result: no twist, ending, solution or identity is exposed. Residual risks: the silhouette (above), and a viewer who knows puzzle P24b recognising Rahal's line as the true statement.
