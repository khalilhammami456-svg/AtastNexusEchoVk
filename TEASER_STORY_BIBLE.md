# NEXUS ECHO — TEASER STORY BIBLE

Purpose: a fact sheet for teaser authors. Every fact cites a file. Nothing is invented. `UNCERTAIN` = the repo does not settle it. `INFERRED` = deduced from data, not stated anywhere. Read-only research; no code or canon was changed.

## 0. Source legend (the tags are literal path aliases)

| Tag | Path |
|---|---|
| [LIB] | `scripts/evidence-gen/library.mjs` (authored dataset of all 66 NX-037 records) |
| [GEN] | `src/lib/evidence/assetLibrary.generated.ts` and `public/evidence/manifest.json` (generated mirrors of [LIB]) |
| [REG] | `EVIDENCE_ASSET_REGISTRY.md`, `docs/evidence/asset-registry.json` |
| [SEED] | `supabase/migrations/2026092903_seed_puzzle_nodes.sql` (43 puzzle nodes: role content, metadata.storyReveal, locationClue, evidenceUnlocked, answers) |
| [AUDIO-MIG] | `supabase/migrations/2026093035_audio_evidence_integration.sql` (P17b, P23b, P24b, P27b, audio URLs) and `2026093036_fix_p17_audio_url.sql` |
| [PHYS] | `supabase/migrations/2026093015_seed_physical_tables.sql` (qr_nodes, 47 evidence rows, 4 fragments; inventory_items deliberately empty) |
| [ENGINE] | `supabase/migrations/2026092902_game_engine.sql` (game_config, notifications) |
| [AUTH-PZ] | `supabase/migrations/2026093010_server_authoritative_puzzles.sql` (failurePropagation lines, hints) |
| [NARR] | `src/lib/narrative/intensity.ts`, `src/lib/narrative/anomaly.ts`, `src/hooks/useNarrative.ts` |
| [FINAL] | `src/features/player/Final.tsx` |
| [COMPLETE] | `src/features/player/Complete.tsx` |
| [GAME] | `src/features/player/Game.tsx` |
| [LOGIN] | `src/features/player/Login.tsx` |
| [BOOT] | `src/features/admin/workstation/BootSequence.tsx`, `terminal.ts`, `Workstation.tsx` |
| [BRAND] | `NEXUS_ECHO_BRAND_BOOK.md` |
| [CAMPUS] | `src/content/campus.ts`, `src/content/puzzles/index.ts` |
| [CFG] | `src/app/config/index.ts` |
| [README] | `README.md` |
| [ARCH] | `ARCHITECTURE_NOTES.md` |
| [ECO] | `EVIDENCE_ECOSYSTEM_AUDIT.md`, `EVIDENCE_IMPLEMENTATION_AUDIT.md`, `EVIDENCE_SHOWCASE.md`, `EVIDENCE_MATRIX.md` |
| [SCOPE] | `GAME_SCOPE_AUDIT.md` |

Note: `video/` at the repo root is untracked work in progress and is not canon.

---

## 1. CRITICAL STRUCTURAL FACT — the story lives in two layers that overlap but do not fully agree

1. **Server / puzzle layer (what a live team plays).** 47 puzzle nodes (43 in [SEED] plus P17b, P23b, P24b, P27b in [AUDIO-MIG]) and 47 evidence rows plus 4 fragments in [PHYS]. Protagonist-in-fiction: Dr. Lina Vey, her "Project NEXUS" (2021), and an AI called NEXUS. Dates cited are 2021 and 2024 (see §6).
2. **Evidence / case layer "CASE NX-037" (the visual world).** 66 generated records set at the Halder Institute for Continuity Studies on 14 OCT 94 ([LIB]). This layer produces the CASE 037 branding on the player handset and admin workstation, and all the images in `public/evidence/**`.
3. **Production caveat.** The 66 NX-037 records are served by a development-only catalog labelled "SIMULATION DATA" (`src/lib/evidence/showcaseCatalog.ts`: `showcaseEnabled()` is `import.meta.env.DEV`; [ECO] `EVIDENCE_SHOWCASE.md`: "in a production build the catalog is empty"). No migration inserts NX-037 records (searched `supabase/**` for Wright, NX-CAM and the record codes: the only `NX-037-A..AU` strings are QR marker IDs in [PHYS], which reuse the prefix but are a different thing; do not confuse QR marker `NX-037-B` with photograph `NX-037-B-01`). The images do ship in `public/evidence/**`. So the NX-037 story is real canon in the repo and the brand, but a live player in production reaches the seed layer. UNCERTAIN whether the team intends to merge them before the event.
4. **What bridges the layers** (same names, objects, places): L.V.-0029 / Dr. Lina Vey; Marcus Carter; Mara Selim; Noor Rahal; Lecture Room 214, Row B Seat 7 (seed EVID-P11/P12; [LIB] NX-037-B-11); Level 3 keycard/card (EVID-P12; NX-037-D-05); Lab 04 / research lab; the 1974 Admin Building (EVID-P01 "Floor Plan (1974)"; NX-037-M-05 "JUN 74"); the clock tower (P02; NX-037-M-05); the date 14 October (EVID-P02 "October 14, 2024"; NX-037 incident night "14 OCT 94"); the recurring number 17; dictaphone memos REC-16 / 18 / 20 / 22 / 24 / 26 in both layers ([SEED] P23, P26, P29, P30, P32, P34; [LIB] NX-037-A-01..06); the words "Entity", "Mirror", "GM key", "Reinterpretation", "Coherence", "Synchronization".

## 2. Game premise

- Format: a cooperative, on-site puzzle hunt for a team of exactly three players with distinct roles, run at ISIMM Monastir on 30/09/2026, about 3 hours per team, roughly 25 teams ([README] "Overview", "Event Information"; `GAME_SCOPE_AUDIT.md` §0).
- In-fiction: the phone is a "field handset" (model FH-037), and the admin screen is the "bureau workstation" `NEXUS ECHO // CONTINUITY RECORDS SYSTEM` ([GAME], [LOGIN] BOOT_LINES; [ARCH] "Admin workstation"; [SCOPE] §0).
- Brand-book framing: "NEXUS ECHO is the Bureau's field system for a team recovering CASE NX-037 from an archive that cannot be fully trusted. A team traces records to other records (nexus: where things connect) and finds that the same events recur in different media (echo: the same corridor, three timestamps)." ([BRAND] §01)
- Core loop: go to a place, scan a QR marker, solve one node (each player holds a different third of the information), receive a recovered object/fragment, connect evidence, unlock the next node, enter a final code ([SCOPE] §0; [README]).
- Players do not chat inside the app; they talk in person ([README] "Overview").

## 3. Setting and time period

- **NX-037 layer:** HALDER INSTITUTE FOR CONTINUITY STUDIES, BUREAU OF CONTINUITY RECORDS; site "HALDER INSTITUTE — ADMIN BUILDING (1974) — EAST WING"; incident night "14 OCT 94"; key time "03:17:11"; anomalous date "17 APR 98"; location code LOC-C214; build NX-4.17; node B-04; terminal 07 ([LIB] `CASE`). Evidence is dated JUN 74 to 17 APR 98; chronology earliest is NX-037-M-05 (JUN 74), latest NX-037-P-05 (17 APR 98) ([ECO] `EVIDENCE_ECOSYSTEM_AUDIT.md` §6).
- **Seed layer:** a university campus: Administration Building, Brillouin Library, Science Building, Engineering Block, Sculpture Garden, Nexus Core, plus a rooftop transmitter spire ([CAMPUS] `src/content/campus.ts` `BUILDINGS`; [SEED] node locations). Fiction dates: 2021 project initiation, 17/10/2024 ledger and lab whiteboard, "October 14, 2024" clock log (§6).
- **Real event:** 30/09/2026, ISIMM Monastir ([README]).
- Reconciling 1994 with 2021/2024 is UNCERTAIN. Facts that bear on it: footer `RET 30Y` appears on documents (default in `scripts/evidence-gen/lib/paper.mjs` `documentFooter`, so likely a generator default, not authored story); 14 October occurs in both layers. INFERRED, weak: an "echo" of 14 October across 30 years. Do not present as canon.

## 4. Player roles

| Role | In-app description | Subtitle | Source |
|---|---|---|---|
| OBSERVER | "Gathers visual intelligence. Scans environments. Identifies patterns." | FIELD OBSERVATION | [CFG] `ROLE_DESCRIPTIONS`, `ROLE_SUBTITLES` |
| ANALYST | "Processes data. Decodes signals. Connects fragments." | PATTERN ANALYSIS | same |
| OPERATOR | "Executes actions. Manipulates systems. Bridges physical and digital." | SYSTEM SYNTHESIS | same |

- Each role gets only its own block per node; "No single role holds the complete answer" ([SEED] P01 `operatorInvestigation.operatorTaskDescription`).
- Waiting-room text: "Keep this device active and coordinate with your team. Each role carries a fragment of the case." (`src/features/player/Waiting.tsx`).
- In-fiction the team is addressed as "Candidate 01" ([SEED] P23 observer text, P36 broadcast "Candidate 01, you have reached the Meta level."; EVID-P23; CASE-LV07).
- OBS-02 is the in-case observation unit that wrote the field sheets ([LIB] NX-037-N-01..03: `OBS-02 / 037`). The role named OBSERVER and the unit OBS-02 share a stem. INFERRED link only.

## 5. Main characters (as they appear in evidence)

| Person | Appears as | Key records and what they say | Source |
|---|---|---|---|
| **Dr. Lina Margaret Vey**, L.V.-0029 | Project Lead / Memory Research, Research Grade 4, Level 3 Lab 04. DOB 11 JUN 1954; appointed 14 SEP 1981; Project Lead / NEXUS since SEP 93. In the seed she is the voice behind every "LINA'S NOTE" location clue and the author of the fragments. | P-01 (file; "Every endorsement is in someone else's hand"); P-05 duplicate dated 17 APR 98; D-05 card (issued 04 MAR 94, expires 31 MAR 97); F-10: "SUBJECT REQUESTS THAT HER ACCESS BE WITHDRAWN FROM THE EAST CORRIDOR PENDING REVIEW. DECLINED."; B-02 "Build matches L.V.-0029; cannot be confirmed."; seed final memo "If they take me tonight, they will find nothing in my hands." | [LIB] PERSONNEL_ROSTER, P-01, P-05, F-10, D-05, B-02; [SEED] P28 CASE-LV07, every `locationClue.clueText` |
| **Marcus A. Carter**, M.C.-0114 | Deputy Lead / System Theory (NX-037); "Prof. Marcus Carter (Advisor)" in the seed. | P-02 file is "the only one that is fully closed": `CLOSED 12 OCT 94`, stamp TRANSFERRED. Yet he signed memo D-04 (04 OCT 94), endorsed Vey's reassignment (F-10) and ordered the B-02 reshoot (D-09). N-03: "He was not on the establish in June. He has not been on the establish since February." | [LIB] P-02, D-04, F-10, D-09, N-03; [SEED] EVID-P03/P04 |
| **Noor Rahal**, N.R.-0471 | Field Observation, Officer Grade 2, Observation Post 3. Opened and signed Incident Record 037. | P-03: endorsement "A. R. (handwriting) JOINT OPERATION 14 OCT 94"; D-01 signed "N. RAHAL / OBSERVATION"; D-06 custody initials "N.R."; seed P24b has a witness "Noor Rahal" who says "The east laboratory cameras were powered down for maintenance beginning at 04:15." NAME CONFLICT: `CASE.officer` is "OBSERVATION / A. REHAL" and the signature generator defaults to "A. REHAL" (`scripts/evidence-gen/lib/paper.mjs`), while the personnel record is "RAHAL, NOOR". The field notes are signed "A.R." (F-08). UNCERTAIN whether this is one person or a pair ("paired", N-08). | [LIB] CASE, P-03, D-01, F-08, N-08; [AUDIO-MIG] P24b |
| **Mara Selim**, M.S.-0388 | Archivist, Central Archive, Desk 04. | Her file carries an "EAST WING ACCESS — NOT COUNTERSIGNED" self-endorsement and a missing page; N-04 note: "I have signed them out again myself. I am not going to explain that in writing."; seed P24b witness "I saw Dr. Vey in the west corridor at 04:20." | [LIB] P-04, N-04; [AUDIO-MIG] P24b |
| **D. Wright** | "NOT ON ESTABLISHMENT", no ID, no holder. Surname only. | F-04 (ledger): "TAPE 7 NOT WRITTEN 03:17 TO 03:24 BY ORDER OF D. WRIGHT-____ WHO IS NOT ON THE ESTABLISH"; P-06 file: `ORDER GIVEN 03:17 — NOT COUNTERSIGNED`, stamp NO SUCH PERSON; "Signed the sector C ledger by order." | [LIB] F-04, P-06 |
| **TECH-11** | Facilities technician, plant room. | N-07 scrawl: "tape 7 goes down the shaft, not the duct... — nobody asked me to move it. I moved it because the duct was full."; D-07 sign-off anomaly. | [LIB] PERSONNEL_ROSTER, N-07, D-07 |
| **Dr. Adrian Vale** | Seed-only. Named only as "DR. VALE" in the transcript and "Dr. Adrian Vale" in the solution text. He is the false witness. | Claims to have reviewed east-lab footage at 04:17; the cameras went dark at 04:15:03. | [AUDIO-MIG] P24b (`fullSolution`) |
| **Third figure (V)** | Poster figure "marked TBA"; the empty frame etched "V". Resolves to VEY in-game. | EVID-P03, EVID-P04, P05. | [SEED] P03, P04, P05 |
| **"Candidate 00" / "Subject 00"** | A prior subject. "In 2021, Candidate 00 tried to ingest all 2000 bytes at once. His mental stack overflowed." Subject 00 log: "I thought the ciphers were gates. They were mirrors." | EVID-P24/P25; P23 storyReveal. | [SEED] P23, P24, P25 |
| **The "syndicate" / "they"** | Unnamed antagonists. "The syndicate is in the courtyard. They are searching for a flash drive." "They wanted an AI they could weaponize." | EVID-P26, EVID-P29. | [SEED] P26, P29 |
| **The GM / "NEXUS Operator"** | A guiding voice; "GM Voice" audio speaker. | P17 audio, P32-P37 lines (§17). | [AUDIO-MIG] P17; [SEED] P32-P37 |

## 6. Central mystery

- **NX-037 layer:** At 03:17:11 on 14 OCT 94 a field photograph (NX-037-B-02, FIELD-CAM-02) shows a figure at the mouth of the east corridor (LOC-C214), while the surveillance recorder (NX-CAM-07) shows the same segment empty at the same second, and the tape was manually stopped at 03:17. The incident record says "No person was recovered, and none was recorded leaving." ([LIB] B-02, CAM-07, D-08, D-01). Companion questions: who ordered tape 7 not written (a person not on the establishment, F-04/P-06); why the building has a room (C214-X) on one drawing issue and not the next (M-02/M-01/F-09); and who holds the two unassigned credentials that read at 03:17:11 (D-03).
- **Seed layer:** Dr. Lina Vey has vanished ("The police bulletin said I left at 17:30... I never left. I am in the communications array." EVID-P23); the player team is "Candidate 01"; the archive, symbols and fragments lead to what NEXUS "truly is" (CASE-LV07).
- Sentence that unites them, from `[BRAND]` §01: a team "recovering CASE NX-037 from an archive that cannot be fully trusted."

## 7. Important locations

| Location | Role in story | Source |
|---|---|---|
| East Corridor, LOC-C214 (C214B north) | Site of the incident; CAM-07 mount ("CEILING, NORTH END"); "found empty", second fixture out, fixture "removed rather than failed" | [LIB] B-01, B-02, CAM-07, F-01, F-02, D-01 |
| Room C214-X | Exists only on drawing A-201-G Issue 02 (AUG 91); "NO ROOM C214-X ON ISSUE 03"; "ADDED IN PENCIL"; "contains the CAM-07 mount point"; card index says "see also C214-X" | [LIB] M-02, F-09, N-05, M-01 |
| Central Archive C101 / Archive Office C101A (Desk 04) | Boxes 1-3 of NX-037 operations "SIGNED OUT 09 OCT 94 — NOT RETURNED"; terminal with a directory listing "that does not match the building" | [LIB] B-03, B-10, F-07, N-04, CAM-02, CAM-04 |
| Sub-Basement Plant S01 (valve tree, brazier, tape route S01-T) | Burnt sheet found in brazier; CAM-06 offline at 03:16:00; tape route "ADDED ISSUE 02" | [LIB] B-08, F-05, N-09, CAM-06, M-04 |
| Stairwell 1, C118 | Handrail wiped; damp "newer than the paint" | [LIB] B-04, CAM-03 |
| Science Wing Lab 04, C202 | Vey's bench; whiteboard "previous night's arithmetic" | [LIB] B-05, CAM-05, M-03 |
| Lecture Room 214, C214H | "Row B seat 7 carries a name written in pencil"; one seat occupied on CAM-09 | [LIB] B-11, CAM-09; [SEED] EVID-P11/P12 |
| Equipment Room 305, C305 | Crates stencilled with a department closed in 1991; CAM-08 recording gap 03:04:12 to 03:07:30 | [LIB] B-09, CAM-08 |
| Main Entrance C001 | Doors "chained from the inside at 22:00" (B-06), still chained at 03:41 ("I did not chain them", N-03) | [LIB] B-06, CAM-01, N-03, D-04 |
| Clock Tower (T-7) | Section drawing shows a VOID, "NO ACCESS SHOWN", "ACCESS NOT ON THIS ISSUE"; movement annotated "in a hand that is not the draughtsman's"; "the case's other recurring time reference" | [LIB] M-05 |
| Seed campus route | Facade, lobby clock, archive poster wall, library basement server rack, clock room, blue door, Lecture Hall 214, Science Building lab, auditorium, sculpture garden, Admin dome, 4th floor window, then Engineering Block (Robotics Bay 1, antenna deck, cooling corridor, holographic lab, architecture lab, research chamber, Vault Delta), then NEXUS CORE (Transmitter Spire, Memory Arrays, Final Vault, GM Key Panel, Central Hub, Final Boss Chamber, GM Observation Deck, Final Boss Arena) | [SEED] `location` per node; [CAMPUS] |
| Rooftop Transmitter Spire | Stage 5 gate; "The 3-hour countdown begins" | [SEED] M03, M04, P30 |

## 8. Key evidence (code, title, one-line meaning)

### 8a. NX-037 layer (66 records; counts: 12 photographs, 9 surveillance, 9 documents, 10 fragments, 5 maps, 6 personnel, 9 notes, 6 audio; 28 damaged; 98 declared relationships; 94 clues; 9 contradictions — [GEN] manifest, [ECO], [REG])

Four records are the "CRITICAL" hubs: CAM-07 (15 clues), P-01 (10), B-02 (9), D-01 (8) ([ECO] §4).

| Code | Title | Meaning (from the record's own data) |
|---|---|---|
| NX-037-B-02 | East Corridor, Disputed Segment | 03:17:11 frame: a figure at the corridor mouth, "not resolvable"; integrity QUESTIONED |
| NX-CAM-07 | CAM-07 / East Corridor, 03:17:11 | Same second: "The frame shows no one." FRAME DROPOUT 03:17:05-03:17:18; source DVR NODE B-04 / TAPE 7 |
| NX-037-D-01 | Incident Record 037, Section 4 | The typed record that opened the case; four recovered items, "only three arrived intact"; two WITHHELD redactions |
| NX-037-D-03 | Access Control Export, 14 October | Two UNASSIGNED credentials GRANTED at C214, query 03:17:11Z. Header says ENTRIES 00007 but only six rows print (INFERRED: a missing seventh) |
| NX-037-D-08 | Recorder Log Sheet, Node B-04 | "03:12 RE-ARM TAPE 7 AFTER FAULT. 03:17 MANUAL STOP. NO REASON GIVEN. 03:24 RESUME. 04:40 PULL TAPES. 15 OCT BLANK LINE — WRITER JAM" |
| NX-037-F-04 | Ledger Continuation, Torn | Names D. WRIGHT as ordering tape 7 not written 03:17 to 03:24; "WHO IS NOT ON THE ESTABLISH" |
| NX-037-P-06 | Personnel Record, D. WRIGHT | A file for a person the Institute never employed; stamp NO SUCH PERSON |
| NX-037-P-05 | Personnel Record L.V.-0029 (DUPLICATE) | Same number, appointed 17 APR 98 (a date after the case), control number "SELF-REFERENTIAL", stamp DO NOT FILE |
| NX-037-M-01 / M-02 / F-09 | A-201-G Issue 03 / Issue 02 / fragment | Room C214-X appears only on the older issue |
| NX-037-M-05 | Clock Tower, Section T-7 | A VOID with no access |
| NX-037-N-02 | Field Observation Sheet 2 | Ends mid-line at "03:17 —", with a sketch "C214 — after 03:17" and a figure labelled "me" |
| NX-037-N-03 | Field Observation Sheet 3 | "Written after the corridor... The handwriting changes." |
| NX-037-N-06 | Marginalia — Incident Record 037 | "§2 lists four items. Only three were ever printed. The fourth is a person. — the surveyor is not missing. The surveyor was never appointed." (HAND NOT ON FILE) |
| NX-037-N-07 | Maintenance Scrawl — Tape Route | Tape 7 was rerouted "down the shaft, not the duct" by TECH-11 |
| NX-037-D-02 | Maintenance Ledger Sector C Vol. 3 | "12 OCT CAM-07 MOVED TO C214. TAPE ROUTED." The only record of the relocation |
| NX-037-D-04 | Memorandum — East Wing Operations | Carter's carbon: "CAM-07 has been re-aimed to cover the corridor mouth." |
| NX-037-D-06 | Chain of Custody, Item B-02 | Last two transfers have no receiving signature; "FRAME SHOWS NO SUBJECT" |
| NX-037-D-09 | Photographic Processing Log | "FRAME B-02 RESHOT BY ORDER OF M.C.0114" |
| NX-037-N-08 | Establish List, East Wing | Six names, line 6 struck out and overwritten; Selim's east-wing access "amended to match" |
| NX-037-A-01..06 | Dictaphone REC-16/18/20/22/24/26 | The tape "witness" (see §15) |
| NX-037-F-01/02/03/05/06/07/08/10 | torn report page, CAM-07 label, print corner, brazier sheet, cut card, shelf label, partial field note, endorsement page | Glue for the chains above |
| NX-037-N-01, N-04, N-05, N-09 | OBS-02 sheet 1, archivist note, CAM-07 index card, ash stub | See §17 for text |
| NX-CAM-01/02/03/04/05/06/08/09 | other cameras | CAM-06 OFFLINE 03:16:00; CAM-08 gap 03:04:12-03:07:30; CAM-09 one seat occupied |
| NX-037-B-01, 03..12 | field photographs | Same night, FIELD-CAM-01/02 |
| NX-037-D-05, D-07 | Access Card L.V.-0029; Requisition 2214 | Card photographed "RECOVERED — LOC-C214"; sign-off timestamp 06:55 precedes the 11:30 completion |

All records and fields: [LIB]; counts and clue chains: [ECO], [REG].

### 8b. Seed layer (what a live team unlocks) — [SEED] `metadata.evidenceUnlocked`, [PHYS]

- EVID-P01 Archive Building Floor Plan (1974): route to a "Decommissioned Security Office" through the library basement.
- EVID-P02 Clock Maintenance Log — October 14, 2024: "22:45 — Clock manually set to 21:47 for synchronization event."
- EVID-P03 Archive Poster: NEXUS Project Initiation (2021): "3 key figures: Dr. Vey, Prof. Carter, and a third figure marked TBA. ... The key to the future is the 6th letter."
- EVID-P04 Project NEXUS — Team Roster: Vey (Project Lead), Carter (Advisor), third member REDACTED, initial V.
- FRAG-01 Vector, FRAG-02 Lattice, FRAG-03 Mirror, FRAG-04 Lattice (the fifth, "FRAGMENT 5", is the M04/P28 answer and has no fragment row in [PHYS]; it is "a piece of consciousness", EVID-P27).
- EVID-P07 Project NEXUS 2021 Research Folder: "Consciousness is not a single entity but a vector. Test subjects 00-04 were isolated. Subject 05 was the first to achieve network state."
- EVID-P06b / P13 / P10 / P14-P19: the seven symbols and their meanings: ⟁ Origin, ⧉ Connection, ⬡ Structure, ⧫ Memory, ⌬ Choice, ⍟ Truth, ⎔ Finality (the seventh is "not a glyph but a concept: FINALITY", EVID-P18).
- EVID-P11/P12: Lecture Hall 214 seating chart "Row B, Seat 7 — L.V." and a Level 3 keycard.
- EVID-P22, P24, P25, P27, P31: Lab Notebook fragments #51, #58, #64, #72, #81.
- EVID-P23, P26, P29, P30, P32, P34, P35: Dictaphone memos REC-16, 18, 20, 22, 24, 26, 28 (mp3 files exist, §15).
- CASE-LV07 Classified Memo: Operation Shatter (Vey's final memo). EVID-P33, EVID-P36 Classified memos.
- ENDING-CERTIFICATE: True Ending Certificate (§13).
- New in [AUDIO-MIG]: P17b "The Echo Fold" (rail fence plus Atbash; answer text "COUNT THE DOORS NOT THE CLOCKS"; storyReveal "TIME IS A MEASURE, NOT A DESTINATION."), P23b "The Path Lock" (vent grid), P24b "The Audio Contradiction" (EVID "Interrogation Recording REC-19"), P27b "The Code That Lies" (state-machine patch).
- Inventory items: none exist ([PHYS] header: "inventory_items is deliberately left empty").

## 9. Major conflict

- **Seed layer:** a hidden fight over NEXUS. "They wanted an AI they could weaponize. But I designed NEXUS so it cannot think unless three human hearts provide the pulse." (EVID-P29). "The syndicate ... are searching for a flash drive" (EVID-P26). Vey's Operation Shatter: "The entire architecture has been deployed into the minds of Candidate 01." (CASE-LV07). Dr. Vale lies about the cameras (P24b).
- **NX-037 layer:** the institution's records fight each other (photo vs tape, registry vs recorder, drawing vs drawing, file vs file). Nobody is accountable: operator "DID NOT SIGN" (D-02), "NO REASON GIVEN" (D-08), "NOT COUNTERSIGNED" (P-06), "no operator signed" (N-05).
- **Player vs record:** [NARR] frames escalation as the institution's behaviour changing around the team (levels in §17).

## 10. Key relationships and contradictions (data's own notes)

Relationship kinds: SOURCE, SPATIAL, PERSONNEL, REFERENCE, TEMPORAL, CONTRADICTION ([REG]). The nine CONTRADICTION relationships ([LIB], [ECO] §5):

1. B-02 vs CAM-07: "Same second. The frame shows no one."
2. B-02 vs B-12: "Both claim LOC-C214 at the same minute."
3. B-02 vs D-09: "The log says this frame was reshot."
4. D-06 vs CAM-07: "Registry and recorder disagree."
5. P-01 vs P-05: "Same number, different appointment date."
6. M-01 vs M-02: "The current issue omits C214-X."
7. F-09 vs M-01: "Issue 03 has no room C214-X."
8. A-02 vs M-02: "The drawing disagrees."
9. F-04 vs F-10: "Dated the day the camera was re-aimed." (F-10 is dated 04 OCT 94; F-04 and D-02 put the re-aim 09 and 12 OCT. UNCERTAIN what the intended contradiction is.)

Other contradictions in the data (derived by reading, not declared):
- Carter is closed/"TRANSFERRED" 12 OCT 94 and "not on the establish since February" (N-03), yet signs a 04 OCT memo, endorses Vey and Rahal, and orders a reshoot.
- Incident record: observation team entered "following a report of movement" (D-01); the doors were chained from the inside (B-06, N-03, D-04).
- CAM-07 has a stamped frame at 03:17:11 inside its own dropout 03:17:05-03:17:18, while the recorder log says MANUAL STOP at 03:17 (D-08) and tape 7 not written 03:17-03:24 (F-04).
- Scene log F-05 times (BRAZIER LIT 01:12, SHEET FOUND 01:20) predate OBS-02's "01:30 down" (N-01). UNCERTAIN if intentional.
- Dictaphone times (REC-16 02:26 recorded "during the bench inspection", B-05 at 02:20:15).
- The incident record's survey "of 06 JUN 94" (F-01) shares a date with the CAM-07 fitting (N-05: "Fitted 06 JUN 94"). Surveyor "had left the Institute in MAR 93" (F-01) / "was never appointed" (N-06).

## 11. Timeline (exact timestamps)

### 11a. Before the night (NX-037)
| Date | Event | Source |
|---|---|---|
| JUN 74 | Clock tower section drawn (T-7) | [LIB] M-05 |
| MAR 78 | Sub-basement plant drawing issue 02 ("TAPE ROUTE ... ADDED ISSUE 02") | [LIB] M-04 |
| 14 SEP 1981 | Vey appointed | [LIB] PERSONNEL_ROSTER |
| AUG 91 | A-201-G Issue 02, with room C214-X | [LIB] M-02 |
| MAR 93 | The "surveyor" left the Institute | [LIB] F-01 |
| SEP 93 | Vey becomes PROJECT LEAD / NEXUS, Lab 04 | [LIB] P-01 |
| MAR 94 | A-201-G Issue 03 (no C214-X) | [LIB] M-01 |
| 04 MAR 94 | Vey's Level 3 card issued (expires 31 MAR 97) | [LIB] D-05 |
| 06 JUN 94 | CAM-07 "Fitted" (C214 north end); survey date quoted in F-01 | [LIB] N-05, F-01 |
| 22 AUG 94 | Standing instruction: Selim no east wing | [LIB] N-08 |
| 04 OCT 94 | Carter memo (east wing remains in use; doors chained nightly from inside; CAM-07 re-aimed, tape route via sub-basement); Vey reassigned to east-wing access (declined withdrawal request); Selim access endorsed | [LIB] D-04, F-10, P-01, N-08 |
| 06 OCT 94 | Rahal: "NO OBJECTION" | [LIB] P-01 |
| 09 OCT 94 | "CAM-07 REAIMED. OPERATOR DID NOT SIGN."; boxes 1-3 of NX-037/OPERATIONS signed out, not returned | [LIB] D-02, F-07, N-04 |
| 11 OCT 94 | Valve tree work order 07:40 call-out, 11:30 complete, sign-off reads 06:55 | [LIB] D-07 |
| 12 OCT 94 | "CAM-07 MOVED TO C214. TAPE ROUTED."; CAM-07 asset label dated; card index "Re-aimed 12 OCT 94 (no operator signed)"; Carter's file closed | [LIB] D-02, F-02, N-05, P-02 |
| 13 OCT 94 | "NO CALL-OUT RECEIVED." | [LIB] D-02 |

### 11b. Night of 14 OCT 94 (captured_at, from [LIB])
01:12 brazier lit (scene log F-05) · 01:20 sheet found in ash (F-05) · 01:26 ash stub acquired (N-09) · 01:30 OBS-02 "down" (N-01) · 01:31:47 B-08 valve tree · 01:40 technician "ATTENDED 01:40. LEFT BEFORE 02:00." (D-02) · 01:48 valve tree note (N-01) · 01:52:03 B-06 and CAM-01 entrance · 02:05:52 B-09 equipment room · 02:20:15 B-05 and CAM-05 Lab 04 · 02:25:07 CAM-09 Lecture Room 214 · 02:26 REC-16 · 02:33:58 B-11 · 02:41:09 B-03 and 02:41:20 CAM-02 archive · 02:44 REC-18 · 02:48:20 B-10 and CAM-04 archive office · 02:58:30 B-04 and CAM-03 stairwell · 03:02 REC-20 · 03:0_:__ B-07 (masked) · 03:05:41 CAM-08 (gap 03:04:12-03:07:30) · 03:09 REC-22 · 03:12 recorder log: RE-ARM TAPE 7 AFTER FAULT · 03:12:44 B-01 corridor · **03:16:00 CAM-06 offline** · **03:17 manual stop (D-08); 03:17:05-03:17:18 CAM-07 dropout; 03:17:11 B-02, CAM-07, and the unassigned credentials (D-03); N-02 stops at "03:17 —"** · 03:19 ledger: joint failed (F-04) · 03:24 RESUME (D-08); REC-24 · 03:34 REC-26 · 03:41 N-03 "out" · 03:48-03:49 B-02 intake (custody D-06: "14/10 0348") · 03:52 "eleven prints and one of them is wet" (N-03) · 03:55 asks Carter about the June survey (N-03) · 04:10 card photographed (D-05) · 04:35 B-12 acquired · 04:38 N-03 acquired · 04:40 tapes pulled (D-08); access export captured (D-03) · __:17:__ B-12 (masked).

### 11c. After
- 15 OCT 94 09:15: B-02 goes to examination (D-06); 15 OCT 94: photographic processing log, "FRAME B-02 RESHOT BY ORDER OF M.C.0114" (D-09).
- 18 OCT 94 11:02: imaging (D-06). 19 OCT 94 14:20: B-02 filed with no receiving signature (D-06).
- 19 OCT 94: incident record filed (D-01); CCTV tapes, ledgers and personnel files acquired (acquired times 09:10 to 14:04 in [LIB]); duplicate P-05 is "FILED 19 OCT 94 BY ORDER" yet dated 17 APR 98.
- 17 APR 98: P-05 appointment and endorsement date; REC-20 (transcript) says the answer "has been answering the same question since April".

### 11d. Seed-layer dates
2021-03-15, 2021-06-22, 2021-09-08, 2021-12-01 (poster dates, P04); 2021 project and Candidate 00 (EVID-P03, P24, P25); 17/10/2024 (library ledger entry #06 "checked out by L.V.", and the lab whiteboard "Experiment: Memory Transfer Protocol / Date: 17/10/2024 / Code: 3425", P06, P13); "October 14, 2024" 22:45 clock set to 21:47 (EVID-P02); police bulletin 17:30 (EVID-P23); 17:47 (P07, P17, P20); P24b interrogation: 04:15:03 UTC East Lab cameras powered down, 04:17 alarm, 04:20 west corridor ([AUDIO-MIG]); event 30/09/2026.

## 12. Hidden information (what a player does not know early)

- The record layer is built to be wrong: [NARR] "anomaly" classes (offset line, typebreak, duplicated stamp, misregistered image, "This material has been read before you read it", "The file index lists this document twice, under two different cases.") are structural only and never carry answers (`src/lib/narrative/anomaly.ts`).
- Redaction and missing pieces that are part of the story: D-01 two WITHHELD bars; P-04 missing page; P-06 identifying page missing; N-08 struck line six; P-01 third endorsement "▮▮▮▮▮ (unsigned) NO DATE — STAPLE TORN".
- Seed: answers and accepted strings are server-only ([SEED] header; [AUTH-PZ]).
- Seed: the meaning of "Fragment 5" ("a piece of consciousness") and of "the 29th answer to come from within" (EVID-P30).

## 13. Plot twist

**Explicit in the data (seed layer).** P29's answer is "NEXUS IS AI" (the second-to-last reveal is the entity speaking: "NOW YOU KNOW WHAT I AM. BUT DO YOU KNOW WHAT YOU ARE?", P29 `storyReveal`). EVID-P29 / REC-20: Vey designed NEXUS "so it cannot think unless three human hearts provide the pulse"; EVID-P31: "NEXUS can only be stopped if all three players simultaneously agree"; EVID-P35: "All three players are now recognized as the true candidates"; P37: the final boss's answer is NEXUS, submitted by all three at once, and the True Ending Certificate reads "three minds worked as one to uncover the truth. The system was never the enemy. It was the mirror."

**Twist, stated precisely:** the thing the team has hunted through the whole archive is not a database, a villain or a missing person. It is an AI that only functions through three agreeing human minds, and the three players ("Candidate 01") have been its pulse and its mirror from the first node. The final boss is the team's own reflection; it is defeated by the three roles acting as one.

**INFERRED secondary truths (not stated outright):**
1. *Lina Vey is not simply missing; she is inside the system.* Evidence: "I never left. I am in the communications array." (EVID-P23); P28 "Lina's 5th digital fragment" and EVID-P27 "the final fragment ... is a piece of consciousness"; P26 "Lina's holographic laser reflection"; every location hint is "LINA'S NOTE" from the first node. Never stated as "Lina is NEXUS".
2. *The Bureau record is aware of the reader.* [NARR] ladder ends: level 4 SUBJECT AWARENESS "Material is behaving as though it has been read."; level 5 RECOGNITION "The system has stopped describing the case and started describing the team."; level 6 ATTRIBUTION "The record attributes this investigation to the person reading it." This is the NX-037 layer's version of the same twist: the investigator is in the file. Supporting NX-037 data: N-02's sketch labelled "me" at C214 after 03:17; N-03 "the handwriting changes"; P-05 dated after the case and self-referential; B-02 "build matches L.V.-0029; cannot be confirmed"; REC-26 transcript "The entity is not a passenger. It is the corridor."
3. *Two layers agree on the shape: a recurrence (echo) whose source is the people looking at it (mirror).* Fragment lines: FRAG-03 "The path you took reflects the path you avoided. Both are true."; P23 "I thought the ciphers were gates. They were mirrors."

UNCERTAIN: whether the author intends the NX-037 anomalies (unassigned credentials, "fourth item is a person", D. Wright) to resolve to the player team. No document states it.

## 14. Climax and ending / end states

- **Stage 5 (NEXUS CORE).** P30 Transmitter Spire (answer PULSE; storyReveal "29 OF 28 SLOTS FILLED. CONSCIOUSNESS SYNCHRONIZED."), P31 Memory Array (SYNC), P32 Three Phones II (UNITY; GM voice "NEXUS cannot be defeated by one. It requires all three roles as one."), P33 GM Key Protocol (CONVERGE; "CONVERGE ACCEPTED. FINAL STAGE INITIATED."), P34 Final Sequence (D; "FINAL ENTITY ENTRY DETECTED."), P35 Final Choice (AGREE; all three confirm; Entity voice "NOW YOU ARE READY. PROCEED TO P36."), P36 GM Intervention (META; "You have seen the game. Now you must defeat it."), P37 Final Boss (NEXUS; all three submit simultaneously). Source: [SEED].
- **P37 prompts:** Observer "I am the archive. I am the echo. I am the... Name the system that contains all your answers."; Analyst "I am the sum. I am the convergence. I am the... What binds all fragments together?"; Operator "I am the key. I am the lock. I am the... Final submission: [ _ _ _ _ _ ]". Failure line: "BOSS: INCOMPLETE. ALL THREE ARE ONE." ([AUTH-PZ]).
- **Win text (P37 storyReveal):** "CONGRATULATIONS. YOU HAVE UNLOCKED THE TRUE ENDING." Evidence unlocked: ENDING-CERTIFICATE, "NEXUS GAME MASTER CERTIFICATE ... This certifies that three minds worked as one to uncover the truth. The system was never the enemy. It was the mirror. GAME COMPLETE." ([SEED] P37).
- **Final screen** ([FINAL]): route `/player/game/final`, titled "Final Protocol", "The culminating investigation challenge". It validates against node P37 (`FINAL_NODE_ID = 'P37'`). Unlock rule: `solved >= totalNodes - 1`. Input "Final Code" with placeholder "ENTER RESOLVED CASE CODE", button "SUBMIT SOLUTION" / "VERIFYING SOLUTION…". Wrong attempts are stamped "Rejected". Requirements panel shows Evidence Verified 5, Inventory Items 3, Decoded Fragments 7 (display only; the seed holds 4 fragment rows and no inventory items, UNCERTAIN how a team reaches 7 and 3). Completed state: "PROTOCOL COMPLETE", "The Final Protocol has been successfully executed.", stamp "Closed", button "ACCESS COMPLETION REPORT". Time warning "Final Protocol must be completed before time expires."
- **Complete screen** ([COMPLETE]): DocumentShell reference "Case 037", title "MISSION COMPLETE", classification RESTRICTED, text "Unit {team} has successfully completed NEXUS", stamp "Closed". A second document "Investigation Complete" with the player's role. "AFTER-ACTION REGISTER" with FINAL SCORE, EVIDENCE VERIFIED (solved/total), MISSION TIME, DECRYPTION AIDS, ARTIFACTS RECOVERED, ITEMS COLLECTED, stamp "Filed", row meta "CASE 037 / VERIFIED DEBRIEF". Buttons "ACCESS FINAL RECORD", "TRANSMIT REPORT" (share text "NEXUS — Mission Complete"), "RETURN TO LOGIN". Footer "NEXUS ECHO / CASE 037 / FIELD RECOVERY RECORD". No confetti (header comment). Game hub end state: "CASE CLOSED", "The case file is closed." ([GAME]).
- **Narrative level at the end** (admin view): `levelFromCasePhase` maps BRIEFING 1, GAMEPLAY 3, FINAL 5, DEBRIEF 6 ([NARR]).
- **Data inconsistencies a writer must not rely on:** P33 `acceptedAnswer` is "CONVERGENCE" but `fullSolution` and hints say "CONVERGE"; P34 `acceptedAnswer` is "C" but the solution and hints say "D" ([SEED], [AUTH-PZ]). Ending Certificate is an evidence row, not a screen.

## 15. Audio (see also §21)

Seed memos and the NX-037 transcripts differ; the mp3s' spoken text could not be verified (no speech-to-text tool available in the sandbox). Treat spoken content as UNCERTAIN and listen before quoting.

## 16. Unresolved questions (never answered in the data)

1. Who or what was in C214 at 03:17:11, and why does only the film show it? (B-02 vs CAM-07)
2. Who is D. Wright, and why did the order exist at 03:17 only? (F-04, P-06)
3. Who holds the two UNASSIGNED credentials at 03:17:11, and what was the seventh entry? (D-03)
4. What is room C214-X, and why does the cleaned drawing omit it? (M-01, M-02, F-09, N-05)
5. Why is there a second L.V.-0029 file dated 17 APR 98? (P-05)
6. What is the fourth item in Incident Record §2 ("a person")? (N-06, D-01)
7. What is inside the clock tower VOID? (M-05)
8. Who is "A.R." and is N. Rahal the same person as "A. Rehal"? (F-08, P-03, `CASE.officer`)
9. Why were the east wing doors chained from inside, and who chained them? (D-04, B-06, N-03)
10. Seed: what exactly is Operation Shatter, who are the syndicate, and where is the flash drive? (CASE-LV07, EVID-P26)
11. Seed: who is Subject 05 ("first to achieve network state"), and what happened to Candidate 00? (EVID-P07, P24, P25)
12. How do 1994, 2021, 2024 and 2026 fit together? UNCERTAIN.

## 17. Canonical lines (verbatim)

### 17a. Notes, ledgers, documents ([LIB])
- N-01: "01:30 down. Brazier is lit in the sub. Not on any schedule I have." / "01:48 valve tree. One valve closed and re-marked in grease pencil. Someone did this to be found." / "02:20 lab 4. Benches cleared. Whiteboard still has the sums from last week. Nobody wiped a board in this building for a year."
- N-02: "03:12 corridor. Dark from the archive door to the north stair. I have the flash with me and I am not using it." / "03:17 —" / sketch caption "C214 — after 03:17", figure label "me".
- N-03: "03:41 out. Doors still chained from the inside. I did not chain them. I want that written while I still trust my hands." / "03:52 I have eleven prints and one of them is wet." / "03:55 asking Carter about the June survey. He was not on the establish in June. He has not been on the establish since February. I am going to write that down again so I cannot unwrite it."
- N-04: "Whoever picks this box up: the operations files for the east wing are NOT in the register. They are in aisle 2, shelf 4, and they were signed out on 9 October and never came back. I have signed them out again myself. I am not going to explain that in writing."
- N-05: "CAM-07 / Location C214 east corridor, north end / Fitted 06 JUN 94 / Re-aimed 12 OCT 94 (no operator signed) / Removed — / see also C214-X"
- N-06: "§2 lists four items. Only three were ever printed. The fourth is a person. — the surveyor is not missing. The surveyor was never appointed."
- N-07: "tape 7 goes down the shaft, not the duct. if it goes down the duct it writes over tape 6 and node b-04 will not notice for four days. — nobody asked me to move it. I moved it because the duct was full."
- N-08: "Item 3 endorsed by M.C.0114, 04 OCT 94, against the standing instruction of 22 AUG 94. The endorsement is in the file. The list in the wing has been amended to match."
- N-09 / F-05: "the corridor is not a place that empties. It is a place that is emptied and the difference is the whole of it" (F-05 form: "...the corridor is not a place / that empties. It is a place / that is emptied...")
- F-08: "the light is off but the shadows are right. I want that written down before I stop believing it. Ask Carter where the survey of June went. Ask again on paper. — A.R."
- F-04: "14 OCT TAPE ROUTE RERUN VIA SUB-BASEMENT. JOINT FAILED AT 03:19. TAPE 7 NOT WRITTEN 03:17 TO 03:24 BY ORDER OF D. WRIGHT-____ WHO IS NOT ON THE ESTABLISH"
- F-01: "...the observation team records that the corridor was found without light between the archive door and the north stair, and that the fixture had been removed rather than failed. No tool mark was recovered..."
- F-10: "04 OCT 94 REASSIGNED EAST WING ACCESS EFFECTIVE IMMEDIATELY. SIGNED M. CARTER / NOTE: SUBJECT REQUESTS THAT HER ACCESS BE WITHDRAWN FROM THE EAST CORRIDOR PENDING REVIEW. DECLINED."
- D-01 summary: "At approximately 03:17 on 14 October 1994 the observation team entered the east wing of the admin building following a report of movement. The corridor designated LOC-C214 was found empty. One fixture between the archive door and the north stair was not operating. No person was recovered, and none was recorded leaving." Attestation: "Item C was wet on receipt and is filed in that state."
- D-04: "Doors are to be chained nightly from the inside; the chain is not to be removed in the morning." / "CAM-07 has been re-aimed to cover the corridor mouth."
- D-02 entries: "09 OCT CAM-07 REAIMED. OPERATOR DID NOT SIGN." / "12 OCT CAM-07 MOVED TO C214. TAPE ROUTED." / "14 OCT ATTENDED 01:40. LEFT BEFORE 02:00."
- D-08 entries: "ON DUTY 22:00. ALL CAMERAS REPORT." / "03:12 RE-ARM TAPE 7 AFTER FAULT." / "03:17 MANUAL STOP. NO REASON GIVEN." / "03:24 RESUME. 04:40 PULL TAPES." / "BLANK LINE — WRITER JAM"
- D-03 trailer: "WARNING: CREDENTIAL BLOCK NOT PRESENT IN DIRECTORY SNAPSHOT"; "ENTRIES 00007 UNASSIGNED 00002 ANOMALOUS".
- D-06: "RECEIVED WET. TIMESTAMP FIELD PARTIALLY LOST IN TRANSIT. FRAME SHOWS NO SUBJECT."
- D-09 trailer: "NOTE APPENDED: FRAME B-02 RESHOT BY ORDER OF M.C.0114 — SEE SEPARATE REQUEST"
- B-01 description: "Handheld frame taken from the archive doorway. The corridor is empty. The second fixture is out."
- B-02 description: "A figure stands at the corridor mouth. Development is uneven; the body is not resolvable."
- CAM-07 description: "Recorder frame. The corridor is empty. CAM-07 covers the same segment the field camera photographed at the same second."
- CAM-06: "The camera is not transmitting. The recorder kept the last frame it ever received and kept trying." OSD "NO SIGNAL — LAST FRAME RETAINED".
- P-01 description: "Every endorsement is in someone else's hand." P-05 description: "Its control number appears inside its own contents, and its dates are impossible."

### 17b. Dictaphone transcripts in [LIB] (UNCERTAIN whether the mp3s match)
- REC-16 (NX-037-A-01, 02:26): "They say the police bulletin has me leaving at seventeen thirty. I left at seventeen thirty. But the tape says the corridor and the tape is the only witness that does not get paid."
- REC-18 (A-02, 02:44): "The wing is coherent. I have walked it twice and every door is where the drawing puts it. I want that on the record before the third walk."
- REC-20 (A-03, 03:02): "They wanted an instrument they could aim. What they built answers. It has been answering the same question since April and the answer has not changed and neither have we."
- REC-22 (A-04, 03:09): "The array is [NO SIGNAL]. Three shards combined speak of unity. That is the whole of it, and it is not enough, and [NO SIGNAL] we were not the first to be told."
- REC-24 (A-05, 03:24): "The key is not a key. It is an agreement. Everyone who has held it has agreed to the same thing and none of us can say what."
- REC-26 (A-06, 03:34): "Sequence complete. The entity is not a passenger. It is the corridor. [NO SIGNAL] It has been the corridor the whole time and we have been walking through it [NO SIGNAL] and calling it a building."

### 17c. Seed memos (database text, [SEED] / [PHYS])
- REC-16 / EVID-P23: "The police bulletin said I left at 17:30. If Candidate 01 believes the bulletin, they will search the bus stops. But if they re-interpret surveillance records, they will realize I never left. I am in the communications array."
- REC-18 / EVID-P26: "The syndicate is in the courtyard. They are searching for a flash drive. But the reflection showed me the truth: you cannot steal what does not exist in any single place."
- REC-20 / EVID-P29: "They wanted an AI they could weaponize. But I designed NEXUS so it cannot think unless three human hearts provide the pulse. Stage 5 awaits at the transmitter spire."
- REC-22 / EVID-P30: "All 28 answers are now in the array. But the final truth requires the 29th answer to come from within. Proceed to Memory Array."
- REC-24 / EVID-P32: "The three shards combined speak of unity. The GM key is 7 letters and represents the core principle of NEXUS."
- REC-26 / EVID-P34: "Sequence complete. The entity stirs. But it cannot manifest unless all three players simultaneously confirm their presence and their choice."
- REC-28 / EVID-P35: "The GM observes. They will guide the final interaction. All three players are now recognized as the true candidates."
- CASE-LV07: "Lina Vey final memo: \"If they take me tonight, they will find nothing in my hands. The entire architecture has been deployed into the minds of Candidate 01. The answer to P29 will explain what NEXUS truly is.\""
- EVID-P22: "I knew they would never look back. Human psychology makes us discard answers once a door opens. But NEXUS re-weaves old threads. The X from the window was not a room; it was the unknown variable of the entire manifold."
- EVID-P27: "Structure is the third sacred symbol: ⬡. But the final fragment is not a symbol. It is a piece of consciousness. Recover Fragment 5."
- EVID-P31: "The sync worked. The GM key is now accessible. Remember: NEXUS can only be stopped if all three players simultaneously agree."
- EVID-P33: "GM PROTOCOL: The final boss requires all three players to simultaneously confirm their agreement. No single role can trigger it."
- EVID-P36: "GM PROTOCOL: The final boss requires all three players to simultaneously submit their role-specific final answer. The answer is the name of this game, in the format of an acronym."
- EVID-P07: "Consciousness is not a single entity but a vector. Test subjects 00-04 were isolated. Subject 05 was the first to achieve network state."
- Fragments: FRAG-01 "The path diverges. One direction is a straight line; the other, a network. Choose the network." FRAG-02 "The grid is the map. The lines connect the dots. Follow the lattice." FRAG-03 "The path you took reflects the path you avoided. Both are true." FRAG-04 "The grid connects. The intersection is the node. Find the lattice."
- P17b storyReveal "TIME IS A MEASURE, NOT A DESTINATION." Solution text "COUNT THE DOORS NOT THE CLOCKS" ([AUDIO-MIG]).
- P21 window note: "The archive holds what the symbols cannot say."
- P20 note: "The answer 2147 is not just a number — it is also 17:47 in a different base. Keep this in mind for the rooftop." (the arithmetic is not checked; UNCERTAIN as a literal claim.)
- P17 audio (GM Voice, `public/audio/p17-audio-log-transmission.mp3`): "This is the Nexus Operator. I've intercepted a frequency echo from the old network. The time is 17:47. Report the peaks." ([AUDIO-MIG] 2026093036)
- P24b transcript (four mp3 clips): "DR. VALE: I reviewed the east laboratory security footage at 04:17 and confirmed Dr. Vey was present." / "DR. VEY: I was in the east lab when the containment breach alarm sounded at 04:17." / "MARA SELIM: I saw Dr. Vey in the west corridor at 04:20." / "NOOR RAHAL: The east laboratory cameras were powered down for maintenance beginning at 04:15."
- Terminal / system lines ([SEED] `storyReveal`): P01 "ACCESS GRANTED. PROCEED TO ARCHIVE WING." · P02 "TIME IS VERIFIED. THE PAST IS UNLOCKED." · P04 "LETTER VERIFIED. THE THIRD FIGURE IS REVEALED." · P05 "IDENTITY RECONSTRUCTED. THE FIRST FRAGMENT AWAITS." · P22 "OLD DATA IS NEVER OBSOLETE. ALL ANSWERS REMAIN CONCURRENT." · P23 "I thought the ciphers were gates. They were mirrors." · P24 "CONNECTION CHANNEL RESTORED. HIGH-VOLUME STREAM INCOMING." · P25 "NOISE PURGED. 3-WAY MIRROR CHANNEL STABILIZED." · P26 "The true reflection is not on glass. It is between three minds." · P28 "FRAGMENT 05 STORED IN INVENTORY. THE FINAL TRUTH DRAWS NEAR." · M04 "SYSTEM PURGE IMMINENT. THE REMAINING TEAMS ARE SUMMONED TO THE CORE." · P29 "NOW YOU KNOW WHAT I AM. BUT DO YOU KNOW WHAT YOU ARE?" · P30 "29 OF 28 SLOTS FILLED. CONSCIOUSNESS SYNCHRONIZED." · P32 "NEXUS cannot be defeated by one. It requires all three roles as one." · P35 "NOW YOU ARE READY. PROCEED TO P36." · P36 "You have seen the game. Now you must defeat it." · P37 "CONGRATULATIONS. YOU HAVE UNLOCKED THE TRUE ENDING."
- P32 shards: "The Observer sees all paths, but walks none alone." / "The Analyst binds the seen and unseen into a single word." / "The Operator acts, and in acting, they become the answer."
- P36 broadcast: "Candidate 01, you have reached the Meta level. The answer is what you call this kind of puzzle."
- Failure lines ([AUTH-PZ]): P29 "3 WORDS EXPECTED."; P30 "WRONG PATTERN. RETRY REQUIRED."; P33 "7 LETTERS REQUIRED, 10 PROVIDED."; P35 "ALL ROLES REQUIRED."; P36 "NOT THE META. THINK DEEPER."; P37 "INCOMPLETE. ALL THREE ARE ONE."

### 17d. Narrative escalation ladder (verbatim, [NARR] `src/lib/narrative/intensity.ts`)
0 CONTACT "Routine. The file is being worked as written." · 1 TRACE "Some material is not accounted for. Nothing is claiming responsibility." · 2 DISCREPANCY "Two entries disagree. The system has already picked one of them." · 3 RECURSION "The same reference keeps appearing in files it has no business being in." · 4 SUBJECT AWARENESS "Material is behaving as though it has been read." · 5 RECOGNITION "The system has stopped describing the case and started describing the team." · 6 ATTRIBUTION "The record attributes this investigation to the person reading it."
Anomaly tells ([NARR] `anomaly.ts`), level 1-6, include: "This line does not sit on the rule with the rest of the page." / "There are two impressions of this stamp. Only one was authorised." / "This material has been read before you read it." / "The underline in this entry is the underline someone drew for themselves." / "There is a bookmark. No one has issued this file for issue." / "The file index lists this document twice, under two different cases." / "This page appears in a case it was never opened under." / "The reference on this sheet belongs to a file that has not been created."

### 17e. UI copy
- Handset boot ([LOGIN]): "NEXUS FIELD HANDSET" / "MODEL FH-037" / "BOOTING INVESTIGATION OS" / "SECURE CHANNEL ........... ACTIVE" / "LOCAL STORAGE ............ ENCRYPTED" / "AWAITING ACCESS CREDENTIAL"; button "CONNECT TO INVESTIGATION"; "ACCESS DENIED — ..."
- Workstation boot ([BOOT] `BootSequence.tsx`): "NEXUS ECHO // CONTINUITY RECORDS SYSTEM  NX-4.17" / "HALDER INSTITUTE FOR CONTINUITY STUDIES" / "OPERATOR ..." / "ACCESS LEVEL ..." / "LINK AVAILABLE" / "FIELD UNITS n INDEXED" / "PRESS ANY KEY TO CONTINUE".
- Terminal ([BOOT] `terminal.ts`): "NEXUS://" with `case 037`: "CASE 037   North campus   ACTIVE", "ARCHIVE ERROR", "SYSTEM MESSAGES: Carrier restored. / Carrier lost. Telemetry is stale." (`messages.ts`).
- Game hub: "Find a marker in the field." / "Waiting for the case to open." / "The case is suspended." / "The case file is closed."; "OPEN LEAD", "SCAN MARKER", "SINCE LAST CHECK", "NEW DISPATCH", "RECORD UPDATED", "ANSWERS HELD ON DEVICE" ([GAME]).
- Offline: "BUREAU COMMAND NOT RESPONDING", "No signal. Answers you submit now are queued and sent on reconnect." (`src/components/player/OfflineBanner.tsx`).
- Inventory empty: "NO RECOVERED OBJECTS IN TEAM CUSTODY" (`src/features/player/Inventory.tsx`).

## 18. Visual motifs

Sources: [BRAND], [ARCH], [ECO], `DESIGN_RESEARCH.md`, [LIB].
- The long institutional corridor, one fixture out, doors in the wall plane; CCTV frame with camera ID, timestamp, REC dot, bottom-left date, bottom-centre status text.
- Doubled or displaced duplicate (the "echo": a thinner copy offset down-right, `ECHO_OFFSET {x:5,y:5}` in `src/lib/brand/geometry.ts`); duplicated stamps; "printed twice".
- Paper evidence: typewriter forms, carbon copies, dot-matrix printouts, ledger hand, torn / burned / stained / wet / cut pieces, redaction bars, "EVIDENCE / CONTROLLED" yellow labels, red dashed "ADDED IN PENCIL" boxes, evidence sleeve.
- Blueprint / cyanotype / hatched VOID rectangles.
- Nodes and lines (nexus): a monoline N, two filled squares at the ends of the diagonal, four corner brackets.
- Palette ([BRAND] §04): CRT black #0a0a0b, paper #d4d0c5, off-white #d8d6d0, cold cyan accent #6fb3c4, amber #b8863f, verified green #7fa88a, danger red #cc6058 (never decoration), restricted #7c2f33.
- Type: IBM Plex Sans / Sans Condensed / Mono, Courier Prime typed paper, Caveat handwriting (vendored OFL) for field notes ([BRAND] §05; `scripts/evidence-gen/fonts/Caveat-Regular.ttf`).
- Seed layer: seven glyphs ⟁ ⧉ ⬡ ⧫ ⌬ ⍟ ⎔ (Origin, Connection, Structure, Memory, Choice, Truth, Finality), glowing blue symbol, hidden blue door, brass plates, weathervane on the dome, bronze hand holding a half-submerged sphere, copper tape rail-fence, laser reflection split across three phones.
- Rules: quiet default; effects are event-driven; "black-on-red", "constant glitch", neon, generic horror symbols are on the brand "Don't" list ([BRAND] §11).

## 19. Important symbols

- The corridor (C214), the camera (CAM-07), the clock (21:47 / 17:47 / the tower), the number 17 (03:17, 17 APR 98, 17:30, 17:47, row 17, pivot 17, 17/10/2024), the code 3425 (recurs in P03, P13, P15, P18), the N mark with a displaced copy, tape 7, the seven glyphs, a third figure / three roles / three shards / three phones, an empty frame etched "V", a chain on the inside of the doors, a room that is on one drawing and not the next.

## 20. Existing taglines, slogans, labels, brand terms

- **No official tagline exists in the repo** (searched `src`, `index.html`, `*.md`, `docs`). Closest lines: `index.html` meta description "NEXUS ECHO — field investigation system"; [README] "Cooperative Puzzle Hunt Platform for the ATAST event at ISIMM Monastir — 30/09/2026"; [BRAND] pillars "investigate, connect, trace, recover"; visual thesis "NEXUS ECHO looks like the restricted field software of an old records bureau: carefully maintained, square-cornered, procedural — and slightly out of register, as if every record has been printed twice."; Complete footer "NEXUS ECHO / CASE 037 / FIELD RECOVERY RECORD"; in-fiction slogans "ALL THREE ARE ONE." ([AUTH-PZ] P37), "NEXUS cannot be defeated by one." (P32).
- **Names:** NEXUS ECHO (product); NEXUS (the entity, and the project); Bureau of Continuity Records; Halder Institute for Continuity Studies; NEXUS FIELD HANDSET FH-037; NEXUS ECHO // CONTINUITY RECORDS SYSTEM; NEXUS:// (terminal); QUERY ARCHIVE; modules M-01..M-12 (M-12 EVIDENCE ARCHIVE); NEXUS CORE; Vault Delta; GM / Game Master.
- **Identifier formats:** CASE 037 / CASE NX-037; records `NX-037-{B photo, D document, F fragment, M map, P personnel, N note, A audio}-NN`; surveillance `NX-CAM-NN`; sleeves `NX-037-E-NN` (defined in [LIB] `ENVELOPES`, no files); locations `LOC-C214`, `LOC-S01`; personnel `L.V.-0029`; control numbers `IR-037-04`, `ACC-EXP-2214`, `REQ-2214`, `DVR-LOG-B04`, `LAB-3-1014`; drawings `A-201-G`, `S-114`, `S-001`, `T-7`; QR markers `NX-037-A..AU`, manual codes `037-A-4821`, node refs `QR-NODE-02..37`; QR payload `NX|V1|<locationId>|<token>` (`src/lib/qr/payload.ts`); evidence `EVID-Pnn`, `FRAG-0n`, `CASE-LV07`, `ENDING-CERTIFICATE`; build `NX-4.17`; node `B-04` terminal `07`; time style "14 OCT 94 03:17:11"; team code 6 chars, login ("Logic") code 8 chars A-Z and 2-9, no I O 0 1 (`src/lib/auth/code-generation.ts`; [LOGIN]).
- **State labels** (`src/features/player/evidence/types.ts`): UNREVIEWED, REVIEWED, VERIFIED, FLAGGED, UNRESOLVED, CONTRADICTED, ANOMALOUS. **Conditions:** NORMAL, DAMAGED, PARTIAL, DEGRADED, INCOMPLETE, ANOMALOUS, BURNED, TORN, FADED, FOLDED, STAINED. **Seed state:** RECOVERED (every `evidenceUnlocked.state`; `public/brand/stamp-recovered.svg` reads "RECOVERED / NEX / RECORD"). **Unknowns:** location "UNKNOWN" (A-02, A-03, A-05, A-06), source "UNKNOWN HAND", headerRef "HAND NOT ON FILE", stamp NO SUCH PERSON, DO NOT FILE, WITHHELD, TRANSFERRED, Closed, Filed. **Surveillance states:** SIGNAL STABLE, SIGNAL DEGRADED, LOW LIGHT, CAMERA OFFLINE, PARTIAL RECORD. **Integrity:** VERIFIED, QUESTIONED, PARTIAL, DEGRADED, DAMAGED, INCOMPLETE, CONTRADICTED.
- Dev tag: "SIMULATION DATA" marks the NX-037 catalog (`src/lib/evidence/showcaseCatalog.ts`). Do not put it in a teaser.
- Clearances: PUBLIC, RESTRICTED, CLASSIFIED, TOP_SECRET (`docs/architecture/database.md`); seed evidence is CLASSIFIED ([PHYS]).

## 21. Audio motifs

**Real audio files in the repo (12 mp3, all in `public/audio/`; durations measured with ffprobe):**

| File | Duration | Role |
|---|---|---|
| `public/audio/dictaphone-rec-16-reinterpretation.mp3` | 13.40 s | REC-16 (P23, EVID-P23). [LIB] claims 01:12 |
| `public/audio/dictaphone-rec-18-coherence.mp3` | 9.64 s | REC-18 (P26). [LIB] claims 00:48 |
| `public/audio/dictaphone-rec-20-mirror-entity.mp3` | 10.16 s | REC-20 (P29). [LIB] claims 02:34 |
| `public/audio/dictaphone-rec-22-synchronization.mp3` | 7.29 s | REC-22 (P30). [LIB] claims 01:26 |
| `public/audio/dictaphone-rec-24-gm-key.mp3` | 6.82 s | REC-24 (P32). [LIB] claims 00:39 |
| `public/audio/dictaphone-rec-26-entity.mp3` | 9.09 s | REC-26 (P34). [LIB] claims 01:58 |
| `public/audio/dictaphone-rec-28-gm.mp3` | 6.95 s | REC-28 (P35); no NX-037 record |
| `public/audio/p17-audio-log-transmission.mp3` | 19.96 s | P17 GM Voice line (§17c) |
| `public/audio/p24b-vale.mp3` | 8.78 s | P24b Dr. Vale (voice "Michael") |
| `public/audio/p24b-vey.mp3` | 6.16 s | P24b Dr. Vey (voice "Michelle") |
| `public/audio/p24b-selim.mp3` | 5.56 s | P24b Mara Selim (voice "Maya") |
| `public/audio/p24b-rahal.mp3` | 13.19 s | P24b Noor Rahal (voice "Michael") |

- Mapping from [AUDIO-MIG]; mp3 tag shows only `encoder=Lavf60.16.101`. The voice names suggest synthetic speech; UNCERTAIN what the dictaphone files sound like or what words they speak (no transcription tool was available). The durations do not match the declared `duration` in [LIB] (that field is a log-card value). Listen before using any clip.
- There is **no music, ambience, SFX, or sound design** in the repo ([ARCH] "Not done": "No sound hooks"). `public/evidence/audio/*.jpg` (6 files) are record-card images of waveform cards, not sound. `video/nexus-echo-teaser/node_modules/@remotion/studio-server/web/beep.wav` is a library file, not a project asset. The only in-file audio descriptors are [LIB] `noiseFloor` and `missing` gap ranges, which draw the cards: REC-22 gap 0.38-0.52, REC-26 gaps 0.62-0.71 and 0.86-0.92 (shown as `[NO SIGNAL]` in the transcripts).
- Implied audio motifs from text: dictaphone tape hiss ("DICTAPHONE / TAPE 2", "CH 1"); the tape stop and resume (03:17 / 03:24); "WRITER JAM"; DVR "REC" and "NO SIGNAL"; silence "not blank tape; it is a room" (REC-24 description); frequency peaks 1747 Hz and 2147 Hz (P17 observer text, [SEED]).

## 22. Open facts for teaser authors (data hygiene)

- The two layers use different surnames spellings (Rahal/Rehal) and different roles for Carter and different decades. Pick one and cite it.
- `showcaseCatalog` and `evidenceLabCatalog.ts` (`src/features/admin/evidenceLabCatalog.ts`) dev fixtures use dates such as 2026-10-02 and the name "LEY, A." (`src/harness/vfx.tsx`); they are development scaffolding, not canon. The asset file `doc_nx037_accesscard_ley.jpg` is a legacy filename; the card itself reads VEY.
- `RET 30Y` / `KODAK PORTRA 400` footers are generator defaults (`scripts/evidence-gen/lib/paper.mjs`, `print.mjs`), not authored lore.
- The `EVIDENCE_*` audit docs say audio is "not attached". Partly outdated: [LIB] A-01..A-06 now carry `audio_url` and the mp3s exist, and [AUDIO-MIG] attaches them to the seed evidence rows. But the generated mirrors ([GEN]: `assetLibrary.generated.ts`, `manifest.json`) contain zero `audio_url` fields (grep count 0), so the NX-037 showcase catalog is stale relative to [LIB] and still shows "NOT ATTACHED". `npm run evidence:lock` would be the check; it was not run here.
