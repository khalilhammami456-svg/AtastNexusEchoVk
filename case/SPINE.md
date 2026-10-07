# CASE 037 — SPINE

One row per runtime node. This file fixes WHAT each node establishes and which earlier knowledge it needs.
`CANON.md` fixes what is true. `model/nodes/*.mjs` writes the actual screens against this spine.
If a node file disagrees with this spine or with CANON, the node file is wrong.

Amendments to CANON made while building the spine (CANON.md is updated to match):

* **04:17 — Vey really was at the east-lab door** (badge + code 3425). She went there knowing the
  cameras would be dead, so the Directorate would have to invent a "confirmation". Vale did
  (P24b). There is no "forged badge / abnormal keypad rhythm".
* **Bay codes**: every Halder-era door code is its bay number. East Laboratory = bay 3425. The number is
  cut into brass plates on the facade steps. The code is public; a code proves nothing.
* **Library server clock runs +4 h** against building time (never re-synced after 2021 fault).
  Slip 44721 stamped 21:22 is really 17:22.
* **Seven checks** (glyph key): ⟁ Origin, ⧉ Connection, ⬡ Structure, ⧫ Memory, ⌬ Choice, ⍟ Truth,
  ⎔ Finality. Every custodian runs all seven before attesting. The 21:47 seal has check 5 (CHOICE)
  deliberately **not ticked**: the choice (FILE / SEAL / RETURN) is left to the second quorum.
* **Facade has 8 columns**: seven glyphs spell the Halder bay mark CDFDEFF; the 8th is the Directorate's
  countermark (decodes to X in the register).
* **Route Delta** = the service-tunnel network on drawing A-201-G issue 03 (blue on site). Doors on
  Route Delta open on a **maintenance key** and leave **no badge record**. S01-TUN is its head, behind
  the marked archway.
* **Hall 214 / C214-X**: Hall 214 is 12.4 m deep on issue 02 and 8.1 m on issue 03; the 4.3 m
  between is C214-X, opened by a momentary switch under the armrest of seat B7 (2021 work order).
  Vey booked Hall 214 for 17 Oct 19:00–22:00 ("Continuity lecture", no attendees). The quorum closed
  in C214-X.
* **D. Wright** = a pre-signed writ form. Not a person. (Standing Instruction 7.)
* **Disposal**: Notice DN-24-107 (15 Oct) cites 30-year RETENTION expiring 14 Oct 2024; names boxes
  1–3 (Verification copy) and tape 7 (Analysis copy). It does not name Rahal's negatives
  (Observation copy). At 10:00 on 18 Oct boxes 1–3 are EMPTY (Selim moved them 16 Oct); tape 7
  is not in the shaft.
* **Four questions** put to Vey on the antenna deck, asked four times each. She holds no copy of
  anything ("That's the design"). Rahal's pocket recorder REC-19 caught it; the tower strikes five
  during her answer (05:00, dawn light and birds on the tape).

## Answer conventions

Answers are short claims, upper-cased and punctuation-insensitive on the server (`S01-TUN` = `S01TUN`).
Each node lists `alts` (all accepted). Operator terminal always states the **format**
(`SURNAME`, `HH:MM 24h`, `ONE WORD`, `NUMBER`, `DOOR ID`).
Hints: four levels — THINK (what kind of question this is), FOCUS (which evidence, not what it says),
DEDUCE (the inference step), CONFIRM (what the answer must satisfy + format; never the answer).

## Acts

| Act | Nodes | Question | Reveal |
|---|---|---|---|
| I Anomaly | P01 P02 P03 P04 P05 M01 | The building keeps a record the bulletin does not. | A quorum sealed something at 21:47, bound by L.V. |
| II Pattern | P06 P07 P08 P09 P10 P11 P12 | She prepared; she came back by a way the badges do not see. | Route Delta, S01-TUN, C214-X |
| III Second story | P13 M02 P06b P07b P14 P15 P16 P17 P17b P18 P19 | This has happened before. | 1994: NX-037, tape 7, Wright, SUBJ-05 |
| IV Recontextualisation | P20 P21 M03 P22 P23 P23b P24 P24b P25 P26 | What looked like vanishing was a defence. | Seal incomplete by design; disposal; Vale lied; Wright is a form |
| V Hidden truth | P27 P27b P28 P29 M04 P30 P31 P32 | What was done to her, and what NEXUS is. | Interrogation; protocol, not AI; alive in 2026 |
| VI Reconstruction | P33 P34 P35 P36 P37 | Say what happened; decide what to do with it. | The record, the choice, the word |

## Nodes

Columns: **Q** claim asked · **A** answer (alts) · **Obs** what is physically on site (kept from the install) ·
**Ana** the record the Analyst holds · **Op** the cross-check the Operator holds ·
**Ex** exhibit(s) granted on solve · **Uses** earlier knowledge required · **Mech** mechanic · **Turn** what changes.

### ACT I

**P01 The Mark** — Main Entrance Facade
Q: Whose building was this before the university? · A: `HALDER` (HALDER INSTITUTE, THE HALDER INSTITUTE)
Obs: row of stone glyphs; 7 spell the mark, the 8th is a different shape. Ana: glyph wheel → CDFDEFF (and the 8th → X, not
explained yet). Op: Register of Marks 1974: `CDFDEFF` = Halder Institute for Continuity Studies (dissolved 1998); the Bureau of
Continuity Records is its surviving retention desk. Ex: EVID-P01 Register of Marks. Uses: none. Mech: provenance/identity.
Turn: the building has an owner the bulletin never names.

**P02 The Held Moment** — Lobby Clock Tower
Q: What time is the lobby clock holding? · A: `21:47` (2147, 9:47 PM, 21.47)
Obs: 12-h face reads 9:47 from the east side. Ana: Facilities clock card — face set by hand 17 Oct 22:45, N. Rahal, "to
the sealed (evening) time". Op: guard-desk log 17 Oct: 17:28 OUT L.V.; 21:44–21:47 "Seal SQ-24-001 applied". Ex: EVID-P02 clock card + guard-log page.
Uses: none. Mech: stopped clock / timeline. Turn: something was sealed at 21:47, after the bulletin's 17:30.

**P03 Bay 3425** — Facade Base Terminal
Q: Which room has bay number 3425? · A: `EAST LAB` (EAST LABORATORY, E LAB, LAB EAST)
Obs: four worn brass plates 3,4,2,5. Ana: ordering rule from P01 glyph positions; Halder bay directory. Op: facade terminal note:
"bay numbers are door codes; cut, not issued". Ex: EVID-P03 Bay directory page. Uses: P01. Mech: spatial/identity.
Turn: the east-lab code is carved on the steps — anyone can type it.

**P04 Four Sessions** — Archive Poster Wall
Q: How many independent attestations does a NEXUS record need to close? · A: `3` (THREE)
Obs: poster lists four 2021 dates (15 Mar, 22 Jun, 8 Sep, 1 Dec). Ana: session register keyed by those dates: attestations per
session (3,3,2,3). Op: session outcome column CLOSED/CLOSED/NOT CLOSED/CLOSED. Ex: EVID-P04 Session register 2021.
Uses: P01. Mech: pattern induction. Turn: closing needs three; two does not close.

**P05 The Empty Frame** — Archive Figure Display
Q: What does the letter in the empty third frame stand for? · A: `VERIFICATION` (VERIFIER, THE VERIFICATION CUSTODIAN)
Obs: three frames, third empty, etched V. Ana: roster by role: OBSERVATION R.N., ANALYSIS M.C., VERIFICATION M.S.; designer line shows
L.V. as "designer — attests nothing". Op: staff directory 2021 (R.N. Noor Rahal, M.C. Prof. M. Carter, M.S. Mara Selim). Ex: EVID-P05 Custodian roster.
Uses: P04. Mech: identity / false assumption (V ≠ Vey). Turn: Vey is not a custodian.

**M01 What Closed at 21:47** — Central Archive
Q: What was applied to the record at 21:47? · A: `SEAL` (THE SEAL, QUORUM SEAL, A SEAL)
Obs: terminal lists stage answers. Ana: synthesis — three attest (R.N., M.C., M.S.), time 21:47 (P02), room code not given. Op: Bulletin
MP-24-018 (18 Oct 09:40) "left at 17:30; not seen since". Ex: EVID-M01 Seal slip SQ-24-001 — attested R.N. M.C. M.S.; "BOUND: L.V."
(initials). Uses: P01–P05. Mech: synthesis/contradiction. Turn: **Revelation 1** — her initials bind a seal at 21:47, four hours after
she "left".

### ACT II

**P06 Entry #06** — Library Stack Reference Desk
Q: What did L.V. take out on 17 Oct? · A: `A-201-G` (A201G, DRAWING A-201-G, DRAWING SET A-201-G)
Obs: ledger entry #06, L.V., 17/10/2024. Ana: stack index #06 = Drawing set A-201-G (issues 01–03). Op: Halder drawing-register: A-201-G = ground-floor
plan of the Admin Building. Ex: EVID-P06 Ledger page (photo). Uses: M01. Mech: document forensics. Turn: she took the plans before leaving.

**P07 The Rack** — Library Basement Server Rack
Q: What time does the library server stamp on the loan of #06? · A: `21:22` (2122, 9:22 PM)
Obs: eight LED bytes (`IS:44721`). Ana: circulation log: slip 44721 OUT 21:22:14, item #06. Op: guard log (OUT 17:28). Ex: EVID-P07 Circulation extract.
Uses: P06, P02. Mech: log reading / **red herring** (false theory: she came back and borrowed it at 21:22). Turn: apparent proof of presence.

**P08 Two Ways** — Archive Cabinet 3
Q: Which route class does Vey's note choose? · A: `DELTA` (ROUTE DELTA)
Obs: cabinet-screen fragment 1: "The path diverges. One direction is a straight line; the other, a network. Choose the network."
Ana: A-201-G issue 03 route legend (ALPHA corridors, BETA stairs, GAMMA lifts, DELTA service network). Op: Vey's handwriting
comparison / the note's drawer label. Ex: EVID-P08 Plan sheet (issue 03) with route legend. Uses: P06. Mech: plan reading.

**P09 The Master Clock** — Clock Room
Q: What was the true building time of the loan of #06? · A: `17:22` (1722, 5:22 PM)
Obs: master clock hand rests at VII. Ana: sync table — output channel VII feeds LIB-SRV, offset +04:00:00, last sync 2021. Op: P07's 21:22. Ex: EVID-P09 Master clock sync table.
Uses: P07, P02. Mech: clock offset. Turn: **Recontext 1** — the "21:22" is 17:22, seven minutes before she walked out. The red herring dies.

**P10 The Blue Line** — Blue-Marked Door
Q: What kind of key opens a blue door? · A: `MAINTENANCE KEY` (MAINTENANCE, FACILITIES KEY)
Obs: blueprint margin "BLUE = LIGHT". Ana: legend: BLUE = light service (Route Delta). Op: key schedule: blue doors are keyed to facilities
maintenance, no card reader. Ex: EVID-P10 Key schedule. Uses: P08. Mech: inference from schedule. Turn: Route Delta leaves no badge record.

**P11 The Archway** — Wall with Glowing Blue Symbol
Q: Which door ID is behind the marked archway? · A: `S01-TUN` (S01, S01 TUN, S-01)
Obs: glowing blue ⟁ above a stone archway. Ana: door schedule, issue 03: archways exist at three places; only S01-TUN is Route Delta and ground floor
west spine. Op: A-201-G west-spine corridor to Hall 214 (so the archway is the one beside it). Ex: EVID-P11 Door schedule. Uses: P10, P08. Mech: spatial/identity.

**P12 The Armrest** — Lecture Hall 214
Q: Which room does the armrest switch at seat B7 open? · A: `C214-X` (C214X, C214 X)
Obs: seating chart, Row B Seat 7 marked "L.V.". Ana: 2021 facilities work order — momentary switch under B7 armrest wired to panel P-214X; Hall 214
booking 17 Oct 19:00–22:00 by L.V. Op: plan comparison issue 02 vs 03 (depth 12.4 m vs 8.1 m). Ex: EVID-P12 Plan comparison + work order.
Uses: P06, P11. Mech: document comparison / missing space. Turn: **Revelation 2** — a room that is not on the current drawings.

### ACT III

**P13 The Whiteboard** — Science Building Research Lab (the east lab)
Q: In what year was the first Memory Transfer run? · A: `1994` (year only; NINETEEN NINETY FOUR)
Obs: whiteboard "Memory Transfer Protocol / 17/10/2024 / Code 3425". Ana: lab run register: Run 1 13 Oct 1994 C214-X; Runs 2–5 2021 sessions; Run 6 17 Oct 2024.
Op: bay 3425 = this lab (P03) so this is the east lab. Ex: EVID-P13 Run register. Uses: P03, P12. Mech: register reading. Turn: **Revelation 3** — the
test is thirty years old; same room.

**M02 How She Came Back** — Memory Lab
Q: By what route did she re-enter without a badge record? · A: `TUNNEL` (SERVICE TUNNEL, THE TUNNEL, ROUTE DELTA TUNNEL)
Obs: terminal lists Stage 2 results. Ana: synthesis from P08 P10 P11. Op: guard OUT 17:28 + no IN record. Ex: EVID-M02 Case-conference note. Uses: P08 P09 P10 P11 P12. Mech: synthesis.

**P06b The Dark Clock** — Lab Wall Clock
Q: When did the east lab lose power? · A: `04:15` (0415, 4:15 AM)
Obs: wall clock shows --:-- (dashes). Ana: lab UPS/event log: circuit 7 (cameras + clock) dropped 04:15:03, ticket MT-24-3302 recorded. Op: P13's lab identity.
Ex: EVID-P06b Glyph key (symbol drawer) + UPS extract. Uses: P13. Mech: log reading. Turn: seed for P24b.

**P07b The Three Copies** — Lab Network Diagram
Q: Which custodian does ⧉ CONNECTION stand for? · A: `CARTER` (M CARTER, PROF CARTER, MARCUS CARTER)
Obs: diagram: three symbols ⟁ ⧉ ⬡ connected. Ana: glyph key (P06b): ⟁ Origin = what was SEEN, ⧉ Connection = what was MEASURED/linked, ⬡ Structure = what was FILED. Op: roster P05
maps seen/measured/filed → Rahal/Carter/Selim. Ex: EVID-P07b Copy map. Uses: P05, P06b. Mech: relationship mapping.

**P14 The Index** — Memory Lab terminal
Q: How many items does Incident Record 037 list? · A: `4` (FOUR)
Obs: terminal prompts for first fragment keyword (kept; the keyword VECTOR is the index header). Ana: IR-037 index: items 1–4, printed pages 3. Op: 1994 retention stamp 14 Oct 1994
+ 30Y. Ex: EVID-P14 IR-037 index page (scan). Uses: P13, P05. Mech: document forensics (absence of a printed page).

**P15 The Withdrawal** — Library Entrance Symbol Wall
Q: Who signed boxes 1–3 out on 9 Oct 1994? · A: `SELIM` (M SELIM, MARA SELIM)
Obs: wheel of seven symbols. Ana: symbols → line numbers via glyph key. Op: archive withdrawal register line. Ex: EVID-P15 Withdrawal register 1994. Uses: P14, P06b. Mech: key lookup.

**P16 The Seat** — Main Auditorium
Q: Who was seated at B7-15 at the 12 Oct 1994 Directorate briefing? · A: `WRIGHT` (D WRIGHT, D. WRIGHT)
Obs: Section B, rows of 15 seats, odd rows occupied. Ana: briefing seat plan. Op: personnel roster 1994: WRIGHT, D. — NO SUCH PERSON stamp. Ex: EVID-P16 seat plan + roster line.
Uses: P15. Mech: identity. Turn: a name that does not exist.

**P17 The Stop Tone** — Auditorium Stage
Q: Was the gap in tape 7 a fault or a command? · A: `COMMAND` (DELIBERATE, A COMMAND, STOPPED)
Obs: spectrum, two peaks 1747 Hz and 2147 Hz. Ana: recorder spec: 1747 Hz pilot = REC ON, 2147 Hz = REC OFF (operator stop). Op: recorder log: tape 7, "stop 03:17 — operator did not sign". Ex: EVID-P17 audio:
tape-7 excerpt with pilot and stop tones (synthesised). Uses: P14. Mech: audio forensics.

**P17b The Etched Strip** — Auditorium Basement Archive
Q: What does the etched message say to count? · A: `DOORS` (THE DOORS)
Obs: copper tape cipher text `XGWHGOHLMGVLIMGSXLPFSLLVX`. Ana: rail fence 3 rails. Op: Atbash → COUNT THE DOORS NOT THE CLOCKS. Ex: EVID-P17b TECH-11 etching photo. Uses: P17, P09. Mech: cipher → advice.

**P18 Item Four** — Library Reading Room Fifth Symbol
Q: What is item 4 of IR-037? · A: `SUBJ-05` (SUBJECT 05, SUBJ 05, SUBJECT 5)
Obs: lock with symbols around it. Ana: IR-037 item key: 1 TAPE 7, 2 LEDGER, 3 PHOTO B-07, 4 SUBJ-05 (no printed page). Op: box labels. Ex: EVID-P18 Item key. Uses: P14 P15 P17. Mech: missing evidence.

**P19 Where It Went** — Sculpture Garden
Q: Where did TECH-11 take tape 7? · A: `SHAFT` (THE SHAFT, DOWN THE SHAFT)
Obs: bronze hand holding a half-submerged sphere. Ana: TECH-11 work order scrap "T7 down the shaft, not the duct". Op: plan: shaft S-3 under the pond. Ex: EVID-P19 work order scrap.
Uses: P17b P18. Mech: chain of custody.

### ACT IV

**P20 The Seven Checks** — Building Dome
Q: Which of the seven checks is not ticked on the seal? · A: `CHOICE` (CHECK 5, CHECK FIVE, ⌬)
Obs: panel of seven slots; arrange the symbols. Ana: seal slip SQ-24-001 ticks 1 2 3 4 _ 6 7. Op: charter order of the seven checks. Ex: EVID-P20 Seal slip (full).
Uses: M01, P07b. Mech: recontextualisation — the seal is incomplete by design.

**P21 The Empty Boxes** — Fourth Floor Window
Q: What did the disposal find in boxes 1–3? · A: `EMPTY` (NOTHING, EMPTY BOXES)
Obs: note on the window. Ana: Disposal Notice DN-24-107 + Certificate DC-24-107 (boxes: contents —). Op: Selim's 16 Oct custody transfer slip. Ex: EVID-P21. Uses: P15 P19 P20. Mech: missing evidence.

**M03 The Pretext** — Central Archive
Q: What authority did the Directorate cite to destroy the file? · A: `RETENTION` (30 YEAR RETENTION, RETENTION RULE, RETENTION EXPIRY)
Ana: DN-24-107 header. Op: IR-037 retention stamp P14. Ex: EVID-M03. Uses: P14 P21. Mech: synthesis.

**P22 The Eighth Column** — Research Lab
Q: Which authority's countermark is the eighth facade column? · A: `DIRECTORATE`
Obs: terminal says facade carries a hidden field. Ana: glyph 8 → X. Op: Register of Marks: X = Directorate countermark. Ex: EVID-P22 Register addendum. Uses: P01 P03 M03.
Mech: recontextualisation of P01.

**P23 Seen Again** — Engineering Robotics Bay 1
Q: At what time does the first image place Vey back inside? · A: `19:45` (1945, 7:45 PM)
Obs: terminal with contradictory reports. Ana: CCTV still, Engineering corridor 19:45. Op: bulletin + guard log. Ex: EVID-P23 CCTV still (surveillance). Uses: M01 P09 P02. Mech: timeline/contradiction. **Recontext** — "left 17:30" true, "not seen since" false.

**P23b The Long Way** — Maintenance Vent
Q: How many minutes is the walk from S01-TUN to the Engineering corridor? · A: `14` (14 MINUTES)
Obs: 6x6 grid S..E. Ana: alternating-axis rule = how the 1974 tunnel turns. Op: tunnel door sensor 19:32 (S01-TUN, no badge). Ex: EVID-P23b Tunnel sensor log. Uses: P11 P23 P10.
Mech: cross-check (19:32 + 14 ≈ 19:45).

**P24 The Silent System** — Antenna Deck
Q: Which of the three systems has no record for 04:15–05:15? · A: `CAMERAS` (CCTV, CAMERA, VIDEO)
Obs: Venn of three departmental seals. Ana: system register: access control (Computer Science), door/building controls (Architecture), CCTV (Human Communication). Op: three logs for the window.
Ex: EVID-P24 Three-system log. Uses: P06b P03. Mech: cross-reference / absence.

**P24b The Impossible Witness** — Antenna Deck Interrogation Room
Q: Which witness made a statement that could not be true? · A: `VALE`
Obs: transcript of four statements; four voice clips. Ana: camera maintenance log 04:15:03. Op: badge log (L.V. east lab 04:17; west corridor 04:20). Ex: EVID-P24b REC-19 excerpt + log.
Uses: P24 P06b. Mech: contradiction. **Revelation 4**.

**P25 The Ticket** — Cooling Corridor
Q: Which ticket authorised the camera power-down? · A: `MT-24-3302` (MT243302, 3302)
Obs: scrolling noise wall; row 17. Ana: log row format. Op: filter by row 17: "04:15:03 PWR-OFF ELC-BANK TKT MT-24-3302 AUTH D. WRIGHT EXEC A. VALE". Ex: EVID-P25 The ticket (image).
Uses: P24b P06b. Mech: extraction from noise.

**P26 Three Papers** — Holographic Prototyping Lab (three-phone)
Q: What is D. Wright? · A: `FORM` (A FORM, WRIT FORM, PRE-SIGNED FORM)
Obs/Ana/Op each hold one paper: personnel stamp NO SUCH PERSON; Standing Instruction 7 (authorising line left blank; clerks enter "D. WRIGHT"); a 1994 writ and the 2024 ticket in the same hand.
Ex: EVID-P26 Standing Instruction 7. Uses: P16 P25. Mech: multi-role synthesis. **Recontext** — the signature on both nights is the same form.

### ACT V

**P27 What They Did Not Know** — Computer Systems Architecture Lab
Q: Which custodian's copy did the disposal notice not name? · A: `OBSERVATION` (RAHAL, THE OBSERVATION COPY)
Obs: dependency chain graph. Ana: DN-24-107 targets (boxes 1–3, tape 7). Op: copy map P07b. Ex: EVID-P27 Annotated notice. Uses: P07b P21 M03. Mech: set difference.

**P27b The Altered Line** — Debug Console
Q: Which entry of the camera-controller trace was altered? · A: `1` (ENTRY 1, STEP 1, LINE 1)
Obs: corrupted execution trace. Ana: state table. Op: P25 ticket. Ex: EVID-P27b Controller trace. Uses: P25 P24b. Mech: log integrity.

**P28 Five O'Clock** — Cyber-Physical Research Chamber
Q: What time was it when the tower struck on REC-19? · A: `05:00` (0500, 5:00 AM, 5 AM)
Obs: container labelled FRAGMENT 5. Ana: tower strike pattern (hour count) + waveform. Op: recorder log: REC-19 start 04:30 + dawn ambience. Ex: EVID-P28 REC-19 full audio.
Uses: P17b P09 P24b. Mech: audio timing.

**P29 What NEXUS Is** — Core Declassification Vault
Q: What is NEXUS? · A: `PROTOCOL` (A PROTOCOL, RECORDS PROTOCOL, A RECORDS PROTOCOL)
Obs: classified doc, redacted result line. Ana: classification code PROTOCOL rev 3. Op: P04+P05+P20 recap. Ex: EVID-P29 Declassified design note. Uses: P04 P05 P20 P28.
Mech: reinterpretation. **Recontext** — not an AI.

**M04 What the Alarm Was** — Vault Delta Core
Q: What was the 04:17 containment-breach alarm? · A: `PRETEXT` (A PRETEXT, EXCUSE)
Ana: alarm log. Op: P27b + P25 + P24b. Ex: EVID-M04. Uses: P24b P25 P27b. Mech: synthesis.

**P30 The Voicemail** — Transmitter Spire
Q: Who left the voicemail of 29 Sep 2026? · A: `VEY` (LINA VEY, DR VEY)
Obs: console 28 slots one pulsing. Ana: call metadata. Op: Bureau line log. Ex: EVID-P30 voicemail audio (41 s). Uses: P28 P29. Mech: audio identification. **Revelation 5** — she is alive.

**P31 What She Held** — Memory Arrays
Q: How many copies of the record did Vey hold? · A: `ZERO` (0, NONE, NO COPIES)
Obs: multiple-choice recall. Ana: REC-19 transcript lines. Op: custody map. Ex: EVID-P31 REC-19 transcript. Uses: P28 P07b. Mech: reasoning from design.

**P32 The Survivor** — Final Vault (three-phone)
Q: Whose camera produced the one record inside the 1994 stop window? · A: `RAHAL`
Obs/Ana/Op each hold one of: frame metadata 03:17:11 FIELD-CAM-02; recorder stop window 03:17–03:24; the writ text "tape 7 only".
Ex: EVID-P32 negative strip. Uses: P16 P17 P27. Mech: multi-role synthesis.

### ACT VI

**P33 The Bulletin** — GM Key Panel
Q: Which part of the bulletin is false? · A: `NOT SEEN` (NOT SEEN SINCE, NOT SEEN SINCE 17:30)
Ana: bulletin + evidence list. Ex: EVID-P33 annotated bulletin. Uses: P23 P28 P30.

**P34 The Night** — Central Hub
Q: At what time did Selim see Vey walked toward the Engineering Block? · A: `04:20` (0420, 4:20 AM)
Obs: sequence with two gaps. Ana: rest of the night's events. Op: west corridor door sensor. Ex: EVID-P34 timeline. Uses: P24b P28.

**P35 The Check** — Final Boss Chamber
Q: Three agreeing closes the open check. Do you agree? · A: `AGREE` (AGREED)
**P36 What She Asked** — GM Observation Deck
Q: What does the voicemail ask the Bureau for? · A: `SECOND QUORUM` (A SECOND QUORUM, QUORUM)
**P37 The Word** — Final Boss Arena
Q: What closes a fact when three keepers agree? · A: `NEXUS`
