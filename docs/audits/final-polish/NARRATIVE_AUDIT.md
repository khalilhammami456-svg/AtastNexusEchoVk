# NEXUS ECHO — Narrative Audit

Companions (same folder): `NARRATIVE_FIXES.json` / `.sql` (104 edits; each `old` verified to occur once at its path; Tier 1 = ranked 40 below, Tier 2 = X01–X64; SQL also mirrors `evidence`/`fragments` rows), `TRANSITIONS.md` (all 47 banners and clues as played, with verdicts). The SQL was dry-run (apply, then re-apply) on a scratch Postgres loaded from `nodes.json`: clean and idempotent.

**Blockers outside text scope:**
- P33 `acceptedAnswer` is `CONVERGENCE`; UI has 7 slots, hints say CONVERGE.
- P34 `acceptedAnswer` is `C`; UI, hints, solution say `D`.
- P07 decodes disagree: analyst "IS:472501", observer bytes "IS:41701", interactive bytes "IS:44721". None is a time.
- Duplicate `nextQrNode`: P05/M01=06, M02/P07b=16, P20/P22=23, P21/M03=24; P27b=27 but its text led to the chamber (28).

## 1. Per-node table (learns / question / pays off)

- **P01–P02** No briefing. Facade code; lobby clock "set" to 21:47 (log "14 Oct 2024"); Lina's notes guide. Q: who is Lina, why set a clock? Plants 21:47.
- **P03–P04** NEXUS Project 2021; Vey, Carter, third "TBA"; four dates. Q: who is third? Dates never used.
- **P05** Third = VEY, but the roster already lists Lina Vey: answer pre-given. #6–8 make it "one name, two entries".
- **M01** LIGHT; folder "MEMORY TRANSFER". Weak synthesis; transfer unpaid until #34.
- **P06–P07** Lina checked out #06 (17/10/2024); rack reading; folder: "Subject 05 first to achieve network state". Q: who is Subject 05? Best early hook, never named again (#34).
- **P08–P10** DELTA, XVII, BLUE=LIGHT. Pure chain; LIGHT repeats M01.
- **P11–P12** Lina's seat B7; Level 3 keycard. First human trace.
- **P13–M02 (+P06b, P07b)** Whiteboard "Memory Transfer" 17/10/2024 contradicts clock log date (#32); 3425 reused; glyph key.
- **P14–P20** Symbols ⧉⧫⌬⍟⎔; P17 audio "Nexus Operator… old network"; P19 SUBMERGE; 3425 ×4. Plateau. ⬡ never found (#37); "COUNT THE DOORS NOT THE CLOCKS" unused.
- **P21–M03** Window note; FRAG-03 Mirror; "NEXUS CORE revealed". Both clues point to the rooftop (wrong).
- **P22–P23b** Reopen P01 → X; Lina: "I never left… communications array". Q: where is she? X unprepared; P23b filler.
- **P24–P24b** CONNECTION; Vale lies (04:15 vs 04:17); Vale/Selim/Rahal appear cold. Motive unpaid (#36).
- **P25–P27b** FILTER (pivot 17 pays P06: best payoff); REFLECTION; STRUCTURE; "syndicate… flash drive". Syndicate stays open.
- **P28–P29** Fragment 5 = "consciousness"; CASE-LV07; NEXUS IS AI: "what are you?" Pays P07, P23.
- **M04** "Seven cognitive operations verified." Best line; make it land (X49).
- **P30–P34** PULSE (29 of 28), SYNC, UNITY, CONVERGE, D. No new facts; "all three" ×7 (P31–P37). Roles gain identity only at P32.
- **P35–P37** AGREE, META, NEXUS; certificate "mirror". Q: none, type the word (§8).

## 2. Act structure (actual boundaries)

- **Discovery P01–M01 (6).** Works. Flaw: P05's answer is printed in P03/P04.
- **Pattern P06–M03 (21 nodes, 45%).** Real beats: P07 folder, P11–P13 Lina's seat and whiteboard, P17 audio. P14–P20 is a seven-node plateau: one symbol, one banner each. Curve flat for ~15 nodes.
- **Contradiction P22–P24b (5).** Short but strong; P23b/P24 are filler.
- **Reconstruction P25–M04 (7).** Good rise to NEXUS IS AI at node 38 of 47.
- **Convergence P30–P37 (8).** Curve dies: nothing new after P30 except roles (P32); "all three" repeats in P31–P37.
- **Hand-offs.** M03/P21 point at the rooftop (Stage 5) before Stage 4. P06b/P07b play after M02 but feed it.

## 3. SETUP / PAYOFF ledger (a payoff, b soften, c leave)

- Third figure: paid redundantly. (a) #6–8.
- Poster dates: decorative. (b) #40; (a) X15 plants "Subject 00 withdrawn".
- 21:47 / 17:47 / 17:30 / 19:45; 14 vs 17 Oct: unreconciled. (a) #32–33, X23–24, X41.
- "Decommissioned Security Office" (EVID-P01): never. (a) X12, the rack sits in it.
- Carter: vanishes after P04. (a) #36.
- Selim, Rahal, Vale: cold at P24b. (a) Selim #6, Rahal #33, Vale X47.
- Subject 00/05, Candidate 00/01: unprepared. (a) #34, X15, X45.
- ⬡ Structure: never found. (a) #37.
- "COUNT THE DOORS NOT THE CLOCKS": orphan. (a) X42 door log.
- X at the window (P22): never shown. (a) X38–39.
- FRAG-02/03/04: never recalled; two "Lattice". (a) #35, X33–34.
- SUBMERGE: (a) X37. 3425 ×4: (a) X36.
- "Nexus Operator", "old network" (P17 audio): audio-locked. (c); P32 "The Operator acts" is the payoff.
- Syndicate, flash drive: (c); #36 gives it a face.
- LIGHT, keycard use, "6th letter": (c). "29 OF 28 SLOTS": intentional, keep.

## 4. Consistency (A accidental, I intentional)

1. A P33/P34 answer keys.
2. A EVID-P02 title "October 14, 2024" vs P06/P13 "17/10/2024" → #32.
3. I P23 `documentText`: "departed at 17:30" vs "cam shows subject at 19:45"; P24b 04:15 vs 04:17.
4. A P07 `operator.taskPrompt` "09:47 was the synchronization"; "21:47 = 17:47" unexplained → X23–24. A EVID-P20 "17:47 in a different base" → X41.
5. A P01 `content.observer.dataPayload` "8 columns" vs 7 → X27–29.
6. A scratch text: EVID-P06 "Hmm, that seems wrong" (#27); P04 "01-14 = -13 (mod 31 = 18)" (#40); M01 "3=L, 6=F, 22=V" (#39); P09 "24 - 7 = 17. Or simply" (#29); P15 "17th position" (X18).
7. A P09 "Hand points to XVII" vs "pointing at VII" on a face "I through XII" → #28. A P02 "IX… VII" for 9:47 → X25.
8. A Symbol counts: P15 "THIRD SYMBOL" shows ⧫; P16 "Fourth Symbol — Choice"; P18 "No symbol found"; P20 hint "Order of discovery: Origin, Connection, Structure" contradicts finds.
9. A EVID-P20 title "Stage 2→3 Transition Clue" → X40. A M04 and P22 both "The Hidden Layer" → X48. A P26 "The Mirror II" → X51.
10. A P28 "FRAGMENT 05" vs "FRAGMENT 5" → X32. A P33 "All 30 stages" (P30 says 28) → X22.
11. A P31 "first word of the P01 answer… P01 answered OBSERVE" (answer CDFDEFF) → #30–31.
12. A EVID-P36 "in the format of an acronym" → X10. A node codes in fiction: P35 "PROCEED TO P36", CASE-LV07 "answer to P29" → #19, #34.
13. A M02 list ends "FRAGMENTS", interactive says VECTOR → X35. A "Lab Notebook Fragment #" clashes with Fragments 1–5 → X53–57.
14. A EVID-P24 "optics lab" vs clue "cooling corridor"; P24/P25 pages near-identical → X05, X43.
15. A Duplicate clueText P28=P29, P24=P24b. A P24b "THE NOISE CANAL" → X07. A b-nodes unquoted → X01–04, X09.
16. A P22 recovery "Stage 2 answer for P03" (Stage 1). A P29 orphan "The key relationship." → X31. A P27b 6 slots vs `0x02`.
17. A Naming: "Main Building" (P01), "[MAIN HALL]" (P02), spire "[ROOFTOP]" vs "[NEXUS CORE]".

## 5. Lina

Traces: terse imperatives; hides things where only she would sit (B7, armrest); reuses one PIN; dry planning ("they will search the bus stops"); "nothing in my hands". Thin: no habit, fear, body, or Carter; notes sound like a host ("await(s)" in 9 banners/clues). Additions (exact):
- P06 `content.observer.dataPayload` + `Return date: blank. Margin, in pencil: "Still reading."` (X11)
- P11 `metadata.locationClue.clueText` `…Look under seat 42: nobody ever sat there, so nobody ever looked. It holds a chart, not an answer.` (X44)
- P12 EVID + `Taped to the back, in pencil: "Lost this twice. Third time is someone else's problem. — L."` (X45)
- P13 whiteboard + `(Written where Carter cannot read it. He read it.)` (X46)
- P18 `storyReveal` `PASSWORDS MATCH. SHE NEVER CHANGED THE CODE.` (X36)
- P31 EVID + `Last line on the page, underlined twice: "Eat something, all three of you."` (X21)
- P19 plaque `HELD UNDER, NOT DROWNED. — L.V.` (X37); P35 clue (#20).

## 6. NEXUS meaning arc

System: P03 "Project", archive language to P21. Unusual: P07 "consciousness… vector". Questionable: P22 "re-weaves old threads", P23 "gates… mirrors", P26 "cannot steal what does not exist in any single place". Architecture: P27 STRUCTURE, CASE-LV07, M04, P32 shards. Breaks: NEXUS silent P08–P21; P27 already says "a piece of consciousness", so P29 surprises less than "what are you?"; roles are never parts of NEXUS before P32. Add: P13 `(host: NEXUS)` (X46); CASE-LV07 `one who reads, one who binds, one who acts. Subject 05 was me.` (#34); M04 analyst `Operators of record: three. Machine contribution: none.` (X49); P20 banner `SEVEN FUNCTIONS, ONE WIRING DIAGRAM.` (X58); P18 `Structure cannot be carved. You are standing in it.` (#37).

## 7. Transitions

27 of 47 banners are weak (bare "X VERIFIED. Y IS REVEALED." or wrong); only P22, P23, P26, P29, P30, P32 carry a real revelation; ten are broken (`TRANSITIONS.md`). Weakest 12, replacements:
- M03 clue: `Go back to where this began and read it again: the research lab, Science Building.` (#1)
- P21 clue: `That is seven. Alone they say nothing. Go down to the Central Archive and read them together.` (#4)
- P17, P23, P24, P27, P27b clues skip their b-node; e.g. P23: `The cabinet hums because the vent behind it is warm. Open the vent before you climb anything.` (#9–18)
- P35: `NOW YOU ARE READY. THE OBSERVATION DECK IS OPEN.` (#19)
- P36: `Now decide what it was for.` (#24). P37: `NOTHING WAS DEFEATED. THREE OF YOU AGREED. THAT IS ALL I EVER WAS.` (#25)
- P20: `SEVEN FUNCTIONS, ONE WIRING DIAGRAM. THE WINDOW IS NEXT.` (X58). P14: `THE FIRST FRAGMENT WAS A KEY, NOT A CLUE. SYMBOL TWO IS OUTSIDE.` (X59)
- P33: `THE KEY WAS A VERB. THREE OF YOU, ONE POINT.` (X61). P34: `SOMETHING HAS ENTERED THE HUB. IT IS WAITING FOR ALL THREE OF YOU.` (X62)
- P12: `SHE LEFT A KEY WHERE ONLY SHE WOULD SIT.` (X63)

## 8. Final reconstruction and choice (P33–P37)

Role payoff is partial. P26 (three phones) and P32 shards ("The Observer sees… The Analyst binds… The Operator acts…") are real; P37 has three distinct boss lines. But P35's three terminals are identical and P31–P34 are interchangeable.

The final choice is "pick the correct word". Evidence: P35 hint "The 5-letter word is a synonym of agree", prompt "(Y/N)" with no N path; P36 "It is 4 letters", "The answer is what you call this kind of puzzle"; P37 "The entity's name is your game's title. It is 5 letters."; P33 "Use the verb form: CONVERGE." The fiction also contradicts itself: "you must defeat it" versus "The system was never the enemy."

Minimal edits, answers and mechanics untouched: P35 gives each role a distinct stake (#21–23): Observer "Stopping it erases what you saw; letting it run keeps writing it"; Analyst "the design needs three minds and cannot be copied. Whatever is decided, nobody else can decide it for you"; Operator "yours is the hand that enters it". AGREE then means "we decide together", defensible whether a team would stop, keep or release it. P36 "decide what it was for" (#24); P37 banner and certificate line "What three minds do with the truth is not recorded." (#25–26) make the ending a question, not a score. Lina's handoff (#20) explains the voice change.

## 9. Ranked fix list (Tier 1; exact strings in `NARRATIVE_FIXES.json`)

`m.lc` = metadata.locationClue, `m.ev` = metadata.evidenceUnlocked, `c` = content; bare `storyReveal` = metadata.storyReveal. Old/new truncated.

1. M03.m.lc.clueText: "LINA'S NOTE: "Return…" → "LINA'S NOTE: "Seven symbols, seven doors I could…"
2. M03.m.lc.nextPhysicalLocation: "[ROOFTOP] — Transmitter…" → "[SCIENCE BUILDING] — Research Lab"
3. M03.m.ev.content: "Proceed to the…" → "The Core is not open yet. Read the…"
4. P21.m.lc.clueText: "LINA'S NOTE: "The…" → "LINA'S NOTE: "That is seven. Alone they say…"
5. P21.m.lc.nextPhysicalLocation: "[ROOFTOP] — Spire…" → "[ADMIN BUILDING] — Central Archive"
6. P05.c.observer.dataPayload: "DISPLAY: Two photos…" → "DISPLAY: Two photos visible: Carter, Vey. The third…"
7. P05.c.analyst.dataPayload: "REASONING: Dr. Vey…" → "REASONING: Dr. Vey is already listed as project…"
8. P05.storyReveal: "Terminal: "IDENTITY RECONSTRUCTED.…" → "Terminal: "IDENTITY RECONSTRUCTED. ONE NAME, TWO ENTRIES. THE…"
9. P17.m.lc.clueText: "LINA'S NOTE: "Find…" → "LINA'S NOTE: "The fifth glyph is in the…"
10. P17.m.lc.nextPhysicalLocation: "[LIBRARY] — Reading…" → "[SCIENCE BUILDING] — Auditorium Basement Archive"
11. P23.m.lc.clueText: "LINA'S NOTE: "Ascend…" → "LINA'S NOTE: "The cabinet hums because the vent…"
12. P23.m.lc.nextPhysicalLocation: "[ENGINEERING BLOCK] —…" → "[ENGINEERING BLOCK] — Robotics Bay 1 Maintenance Vent"
13. P24.m.lc.clueText: "LINA'S NOTE: "Descend…" → "LINA'S NOTE: "They sat me down on this…"
14. P24.m.lc.nextPhysicalLocation: "[ENGINEERING BLOCK] —…" → "[ENGINEERING BLOCK] — Antenna Deck Interrogation Room"
15. P27.m.lc.clueText: "LINA'S NOTE: "Enter…" → "LINA'S NOTE: "Before the chamber, the debug console.…"
16. P27.m.lc.nextPhysicalLocation: "[ENGINEERING BLOCK] —…" → "[ENGINEERING BLOCK] — Architecture Lab Debug Console"
17. P27b.m.lc.clueText: "LINA'S NOTE: The…" → "LINA'S NOTE: "Patched. Now the chamber. The fragment…"
18. P27b.m.lc.nextPhysicalLocation: "[ENGINEERING BLOCK] —…" → "[ENGINEERING BLOCK] — Research Chamber"
19. P35.storyReveal: "Entity voice: "NOW…" → "Entity voice: "NOW YOU ARE READY. THE OBSERVATION…"
20. P35.m.lc.clueText: "LINA'S NOTE: "The…" → "LINA'S NOTE: "My handwriting ends here. What speaks…"
21. P35.c.observer.dataPayload: "CONFIRMATION: "Do you…" → "You saw it all: nothing here was filed,…"
22. P35.c.analyst.dataPayload: "CONFIRMATION: "Do you…" → "You bound the evidence: the design needs three…"
23. P35.c.operator.dataPayload: "CONFIRMATION: "Do you…" → "You act: whatever the three of you decide,…"
24. P36.storyReveal: "GM voice: "You…" → "GM voice: "You have seen the game. Now…"
25. P37.storyReveal: "GM voice: "CONGRATULATIONS.…" → "Entity voice: "NOTHING WAS DEFEATED. THREE OF YOU…"
26. P37.m.ev.content: "It was the…" → "It was the mirror. / / What three…"
27. P06.m.ev.content: "Binary sequence: 01001001…" → "Rack LED log, copied by hand: one line,…"
28. P09.c.observer.dataPayload: "Hand points to…" → "A brass plate under the dial reads XVII.…"
29. P09.c.analyst.dataPayload: "EQUATION: P06 pivot…" → "EQUATION: the hand reads 7. The plate reads…"
30. P31.c.observer.dataPayload: "What was the…" → "What kind of node was the first lock,…"
31. P31.c.analyst.dataPayload: "MATRIX: P01 answered…" → "MATRIX: The facade was an observation node. Correct…"
32. P02.m.ev.title: "October 14, 2024" → "October 17, 2024"
33. P02.m.ev.content: "Clock manually set…" → "Clock manually set to 21:47 to hold the…"
34. P28.m.ev.content: "The entire architecture…" → "The entire architecture has been deployed into the…"
35. P28.c.observer.whatTheySee: "Holographic fragment container…" → "Holographic fragment container pulsing with blue light. Four…"
36. P24b.m.ev.content: "contradicted by the…" → "contradicted by the camera maintenance log (power-down at…"
37. P18.m.ev.content: "No symbol found.…" → "The sixth plinth is empty; its outline is…"
38. P29.m.lc.clueText: "LINA'S NOTE: "Step…" → "LINA'S NOTE: "The file is open. The door…"
39. M01.c.analyst.dataPayload: "EXTRACTION: First letters:…" → "EXTRACTION: Letter extraction yields nothing. Step back: a…"
40. P04.c.analyst.dataPayload: "Difference pattern: +7,…" → "No pattern holds. The dates are only milestones.…"

Tier 2 (X01–X64) covers quotes, scratch text, glyph count, Lina lines, setups, banners. Needs an owner (not text): Blockers list, P20 order/positions, P17 "reversed = ECHO", P22 derivation of X.
