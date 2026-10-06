# NEXUS ECHO Pacing Audit

Source: nodes.json/order.json (47 nodes, linear order), campus.ts, README, event runbook. Scripts: pace.py, rhythm2.py (same dir). Estimated walking is my own heuristic: Admin-Library 3, Library-Science 4, Admin-Science 5, Science/Library-Garden 3-6, Garden-Admin 6, Science-Engineering 5, Engineering-Nexus Core 5 (minutes). Treat as +/-40%. Reading load = player-visible words (role block, excluding answers and hints, plus narrativeObjective, storyReveal, clueText).

## 1. Headline: the clock does not fit the content

- Stated: README "~3 hours per team"; runbook: 180-minute `game_deadline` and "Avg Time Remaining >30 min" as normal.
- Computed: 411 min of puzzle estimates + about 50 min walking (11 legs) = about 461 min (7.7 h). This is 2.6x the timer. Even if every estimate is 2x pessimistic it is still about 255 min.
- At estimated pace a team reaches M02 at minute 123, P17b at 178 and P18 at 188. At 180 min it is around node 22 of 47. The entire Stage 4 chain (P22-M04, 145 min) and Stage 5 (73 min) are unreachable for an average team, so the finale is seen only by exceptional teams.
- The 6 b-nodes add 44 min (10.7% of puzzle time) and sit in the prerequisite chain, so they cannot be skipped.
- This outranks every rhythm issue below. Decision needed from the owner (config, not content): (a) playtest P01-P13 and rescale estimates (if real pace is 40-50% of the estimates, the 180 min holds), or (b) lengthen the timer (the runbook already supports +15/+30 min extensions), or (c) officially treat Stage 4-5 as a bonus zone and score on progress. Do not rescale `estimated_minutes` to fit 180 without playtest data.

## 2. Per-stage curves

| Stg | Nodes | Diff (min-max, avg) | Puzzle min | Walk min | Cum. end (incl. walk) | Avg words/node (max role + shared) | Dependency |
|---|---|---|---|---|---|---|---|
| 1 | 6 | 2-4, 2.7 | 40 | 0 | 40 | 79 | D2 x5, M01 D4 |
| 2 | 11 | 1-4, 3.0 | 84 | 11 | 135 | 65 | D1 x4, D2 x4, D3 x2, D4 x1 |
| 3 | 10 | 3-5, 3.9 | 84 | 24 | 243 | 70 | D1-D3 mix, ends D4/D5 |
| 4 | 12 | 4-5, 4.4 | 135 | 10 | 388 | 89 | D4 x8, D3 x3 (b-nodes), D5 x1 |
| 5 | 8 | 4-5, 4.4 | 68 | 5 | 461 | 72 | D4 x6, D5 x2 |

Puzzle-type sequences (b = b-node):
- S1: OBS, SPATIAL, CIPHER, PATTERN, DEDUCT, META. All distinct, clean 2-2-2-3-3-4 ramp.
- S2: MEMORY, BINARY, PATTERN, LOGIC, EXTRACT, VISUAL, DEDUCT, OBS, META, MEMORY(b), GRAPH(b). No repeats.
- S3: MEMORY, CIPHER, OBS, AUDIO, CIPHER(b), PATTERN, DEDUCT, PATTERN, NARRATIVE, META.
- S4: LOGIC, DEDUCT, LOGIC(b), CROSS_REF, NARR(b), EXTRACT, THREE_PHONE, LOGIC, LOGIC(b), EXTRACT, NARR, META.
- S5: MEMORY, MEMORY, THREE_PHONE, DEDUCT, PATTERN, NARR, META, FINAL_BOSS.

Back-to-back identical type: P27 to P27b (LOGIC, LOGIC) and P30 to P31 (MEMORY, MEMORY). Near-repeat: P22 LOGIC, P23 DEDUCT, P23b LOGIC.

Walking legs of 4 min or more (9 of 11): P13 5, P15 4, P16 4, P18 4, P19 6, P20 6, P22 5, P23 5, P30 5. Longest: Library to Garden to Admin (about 12 min across P19-P20). Zero-walk stretches: P08-P12 (34 min, Admin only), P23-M04 (11 nodes, 123 min, one building), P30-P37 (68 min).

Reading load: median 73 words/node. Outliers: **P24b 165** (observer 135, but 4 audio clips exist, so partly mitigated) and **P27b 153** (observer 129 pure text trace plus 63-word analyst block). The next-heaviest are P17b, P25 and M03 at about 90, which is acceptable. Observer carries most words by design (average 39 vs operator 21).

## 3. Rhythm map

Rules: BREAKTHROUGH = META or P37; MOVEMENT = leg of 4 min or more into a node of diff 3 or less; BREATHER = diff 2 or less, MEMORY recall of diff 3 or less, or D1 and 6 min or less; DISCOVERY = OBS/SPATIAL/VISUAL/EXTRACT/AUDIO; DISCUSSION = DEDUCT/NARR/CROSS_REF or diff below 4 under 10 min; the rest are COGNITIVE-PEAK. An arrow marks a walk.

```
S1  b b b S S B
S2  b>S S S>S b D b D> B b P            (P06 P07 P08 P09 P10 P11 P12 P13 M02 P06b P07b)
S3  b M M D P M S P S B                 (P14 P15 P16 P17 P17b P18 P19 P20 P21 M03; P19/P20 follow 6-min legs)
S4  P S P S S D P P P D S B             (P22 P23 P23b P24 P24b P25 P26 P27 P27b P28 P29 M04)
S5  P P P S P S B B                     (P30-P37)
```

Flags:
- **Runs of 3 or more**: P01-P03 breathers (fine as onboarding); P07-P09 three DISCUSSION nodes and P07-P12 six consecutive diff-3 nodes (42 min plateau, flat, same building from P08); **P26-P27b three COGNITIVE-PEAK in a row** (32 min) with the LOGIC to LOGIC repeat; P30-P32 three COGNITIVE-PEAK (27 min) with the MEMORY to MEMORY repeat.
- **Consecutive hard nodes**: diff 4 or more runs unbroken from **P19 to P37: 24 nodes, 246 puzzle min plus about 28 walk, 60% of all puzzle minutes**. There is no node below diff 4 after P19. Earlier: P13-M02, P17-P17b.
- **Mid-game fatigue**: Stage 2 is flat rather than fatiguing, with D1 nodes P10 and P12 as relief. Stage 3 front half is healthy (three D1/MOVEMENT nodes), but P19-P20-P21-M03 is four hard nodes with two 6-min legs (43 min). **Stage 4 is the true fatigue zone**: 12 nodes, 135 min, avg diff 4.4, avg 11 min/node, D4, one building, no walking, no node under diff 4. Mode variety (S/P/D alternation) softens it but intensity never drops. No D1/D2 node exists after P18, so nobody gets a "light role" turn in the last 29 nodes.
- **Post-meta reset**: M01 is followed by P06 (diff 2, D1), a good reset. M02 is followed by P06b (diff 1) then a spike. **M03 (18 min, diff 5) is followed directly by P22 (diff 4.5, 12 min, plus a 5-min walk) and M04 (25 min) by P30 (diff 4)**. The reset-after-meta pattern disappears exactly where fatigue peaks.
- **Opening vs final quarter**: opening (Q1) ramps 2.0 to 4.0 across 6 nodes with 3 breathers and rising minutes (4 to 12). Final quarter (P28-P37, avg diff 4.45, avg 10 min) plateaus at 4-5 with no breathers, estimated minutes falling (9 to 7) while difficulty rises, and ends P36 (META 5, 7 min) to P37 (5, 10 min). It escalates by compression, not by contrast. This suits the "SYSTEM PURGE IMMINENT" fiction, but it is a sprint with no inhale before the boss.
- **Heavy reading**: P24b, P27b (above).

## 4. The 6 b-nodes

| Node | Diff/min/dep | Function | Verdict |
|---|---|---|---|
| P06b | 1 / 3 / D1 | Recall of P06's "17"; hint 3 gives it away; yields glyph key | **True breather.** But it sits after M02 and is followed immediately by diff-4 P07b |
| P07b | 4 / 9 / D3 | Graph puzzle after the 1.0 breather | **Spike**, a +3 jump. It ends Stage 2 on a non-meta tail after the M02 climax |
| P17b | 4 / 8 / D3 | Cipher right after P17 AUDIO 4.0 | **Spike**: a 16-min double peak. P18 (diff 3, D1) is the relief |
| P23b | 4 / 8 / D3 | Vent grid after P23 4.5/12 min | **Mild dip.** Slightly easier than neighbours, not a breather |
| P24b | 4 / 7 / D3 | Audio interrogation, change of modality | **Texture breather** (listening/arguing vs logic), though text-heavy |
| P27b | 4 / 9 / D3 | LOGIC after LOGIC, 129-word text trace | **Padding risk.** The least differentiated node: same mode as P27, pure text |

Structural notes for the owner (prerequisites are out of scope, so no fix is listed):
- M02's prerequisite is only P13, while P13's clue points to the "symbol drawer" (P06b evidence) and P07b lists M02 as next. Real order is ambiguous.
- P07b's answer (CONNECTION) equals M02's answer. If P07b is done first, the meta is a freebie.
- 4 of the 6 b-nodes are in Stage 4, where they make up 24 of 135 min. Their D3 level is the only lower role-dependency in that chain, so they are worth keeping and reframing, not cutting.

## 5. Recommended fixes (15, text/config only; no answers, IDs, prereqs or logic touched)

Framing lines below contain no answer values. Where `metadata.time` and `estimated_minutes` ever change they must change together with `src/content/puzzles/index.ts` `time`.

| # | Node | Field / path | Change |
|---|---|---|---|
| 1 | (event config) | `game_deadline` interval; README "Duration" | Owner decision per section 1. If estimates are kept, set the timer or the stated duration to match, or state that Stage 4-5 is a bonus zone. Confirm with a P01-P13 playtest |
| 2 | M03 | `metadata.storyReveal` | Append: ` CHECKPOINT SAVED. REGROUP. THE NEXT STAGE WILL NOT WAIT, BUT YOU MAY.` This creates an inhale before P22 |
| 3 | M03 | `metadata.locationClue.clueText` | Add to the end: ` Take the walk slowly; talk through what you have learned.` Makes the 5-min walk a deliberate rest beat |
| 4 | P22 | `content.narrativeObjective` | Prefix: `Fresh start, second pass. ` Signals a reset at the stage boundary |
| 5 | M04 | `metadata.storyReveal` | Append: ` THREE OPERATORS ENTER. NONE LEAVE THE SAME.` Raises stakes without adding load |
| 6 | M04 | `metadata.locationClue.clueText` | Append: ` The way there is long. Use it: share what the last hour cost you.` Walk framing before P30 |
| 7 | P23b | `content.narrativeObjective` | Prefix: `Quiet crawl, no clock pressure: ` (the mild dip becomes a deliberate breather) |
| 8 | P24b | `content.observer.taskPrompt` | Append: ` Play each clip aloud, or have each teammate read one speaker's lines.` Spreads the 135-word load |
| 9 | P27b | `content.observer.taskPrompt` | Append: ` Read the trace aloud, line by line, to your Analyst.` Makes reading a team act |
| 10 | P27b | `content.narrativeObjective` | Prefix: `Hands-on repair, not theory: ` Differentiates it from P27 (LOGIC to LOGIC) |
| 11 | P06b | `content.narrativeObjective` | Prefix: `Quick callback, breathe: `. Keep the 3 min as is |
| 12 | P07b | `metadata.storyReveal` | Leave as is; instead set `content.narrativeObjective` prefix `Back to full focus: ` so the +3 jump after P06b reads intended |
| 13 | P19 | `content.narrativeObjective` | Prefix: `Open-air stop, look around before you deduce: ` (the only outdoor node, 6-min legs either side) |
| 14 | P21 | `content.narrativeObjective` | Append: ` Take a moment together before the meta.` Turns the 22-word, 8-min message node into the stage breather |
| 15 | P31 | `content.narrativeObjective` | Prefix: `Shared recall, say it out loud together: ` Differentiates from P30 MEMORY and shifts it to a discussion beat |

Optional after playtest: check `estimated_minutes` of M02 (15), M03 (18), M04 (25). Their answers are one-word and hints name them, so the time is gathering plus discussion and may be overstated. Do not edit them blindly.

## 6. Do NOT change

- Stage 1 ramp (2-2-2-3-3-4, all distinct types, all D2): a clean onboarding. Leave it.
- Meta then easy reset at M01 to P06: this is the rhythm model; extend it with fixes 2-6 only through text.
- D1 breathers P06, P10, P12, P16, P18 and MOVEMENT nodes P15/P16/P18: the Library-Science zigzag is the symbol-hunt's physical heartbeat; walking there is the pacing.
- Stage 3 Garden to Admin legs: the one outdoor beat; shortening it would remove the only change of scene before Stage 4.
- Mode alternation in Stage 4 (S/P/D): already the main fatigue mitigation; reordering would break the clue chain.
- THREE_PHONE nodes (P26, P32) and the P36 to P37 finale: successful, distinctive mechanics and the climax.
- b-nodes as prerequisite-chain members (P17b, P23b, P24b, P27b): needed for narrative evidence; cutting them breaks the chain.
- Hint tiers (120/300/600 s penalty) and reading-load targets (about 70 words median): fine.
- `estimated_minutes` rescaling to hit 180 min: would hide, not solve, the mismatch.
