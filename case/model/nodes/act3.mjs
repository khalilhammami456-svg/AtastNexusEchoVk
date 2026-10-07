// ACT III — THE SECOND STORY. This night has happened before.
// P13 M02 P06b P07b P14 P15 P16 P17 P17b P18 P19

export const newFacts = [
  'East-lab run register (Science Building Research Office): series CAL (recorder and camera calibration; CAL-1 11 Nov 1991 and CAL-2 02 Sep 1993, both in C214-X) and MTP (Memory Transfer Protocol; MTP-1 13 Oct 1994 C214-X, MTP-2..5 the four 2021 sessions in E-LAB-D1, MTP-6 17 Oct 2024 C214-X, outcome SQ-24-001). MTP-1 was transcribed from the Hall 214 annex log in 2021 and its outcome is "not entered".',
  'UPS controller for the Science Building: unit UPS-SB-03 serves the east lab (bay 3425), UPS-SB-04 the Chemicals Store (bay 3524). Circuit 7 feeds cameras and the wall clock. UPS-SB-03 C7: OFF 04:15:03 (ticket logged; number in the unit detail file), ON 05:15:20. UPS-SB-04 C7: surge, OFF 23:41:50, ON 23:41:58. UPS-SB-03 also logged a C3 trip at 22:10:41 (auto-reset) and a 0.4 s mains dip at 02:40:12.',
  'Incident Record 037 is dated 19 Oct 1994 and signed N. Rahal; index sheet keyword VECTOR; items 1-4 cite key sheet KS-037; printed pages 1-3 (p.1 recorder log tape 7, p.2 operations ledger extract, p.3 photograph B-07 print); item 4 has no page ("persons are not reproduced").',
  'Halder Registry stamp on IR-037: RETENTION 30Y FROM DATE OF INCIDENT 14 OCT 1994, EXPIRES 14 OCT 2024 (the 30 years run from the incident date, not the 19 Oct writing date).',
  'NX-037 project convention: archive-register line references are written as two of the seven project glyphs, each standing for its place in the key (first = 1). IR-037 cites the boxes 1-3 withdrawal as the pair of glyphs for 2 and 4, i.e. line 24 of the 1994 archive withdrawal register, page 3.',
  'Archive withdrawal register 1994 p.3: line 24 = 09 OCT NX-037 boxes 1-3, signed out M. SELIM, no return entry. Neighbouring lines: 22 H. MARSH, 23 N. RAHAL, 25 M.A. CARTER, 26 H. MARSH, 42 T. ARDEN.',
  'Directorate briefing 12 Oct 1994 14:00, Main Auditorium Section B (10 rows of 15, only odd rows used), invitations issued 10 Oct. Invitation numbers: INV 24 = A. VALE (Directorate desk) at B7-14, INV 25 = D. WRIGHT (Directorate), personnel check NO SUCH PERSON, at B7-15. Extra invitees: T. ARDEN (Finance), R. HOLLIS (Estates), E. PRYOR (Finance).',
  'Tape 7 recorder log (IR-037 p.1): REC ON 02:48 signed; CHECK 03:16 signed; STOP 03:17 NOT signed ("operator did not sign"); REC ON 03:24 NOT signed; deck fault register empty. Spec: 1747 Hz = REC ON pilot, 2147 Hz = REC OFF pilot (0.8 s), laid only when the transport receives a stop; a power loss, jam or tape break lays no pilot; a console stop is entered with operator initials, a stop without initials did not come from the console.',
  'The tape-7 audio excerpt carries one spoken line in CARTER’s voice: "Recorder seven. Oh three sixteen. Levels steady." (consistent with Carter present on the night, per CANON).',
  'Facilities tool-issue slip FT-94-117, 17 Oct 1994: one reel copper tape 25 mm and one scribe issued to TECH-11, "notice, auditorium basement, 25 characters, 6 words". The strip is read: rail fence 3 rails (rail lengths 7, 12, 6) then Atbash = COUNT THE DOORS NOT THE CLOCKS.',
  'NX-037 stock card: BOX 1 operations ledger (Oct 1994), BOX 2 photographic (print B-07), BOX 3 personnel annex (project roster, lines 01-05); no box 4. Annex: 01 CARTER M.A. Deputy Lead, 02 RAHAL N. Observation Officer Gr.2, 03 SELIM M. Archivist, 04 TECH-11 Facilities, 05 VEY L.M. Project Lead - WITHDRAWN 19 OCT 1994. Item 4 of IR-037 is cited SUBJ-nn with nn the annex line of the person the record withdrew, so SUBJ-05.',
  'Facilities work order scrap WO-94-1014-11, raised 14 Oct 1994 03:50, assigned TECH-11, pencil entry "T7 down the shaft, not the duct", signature line torn away. Services overlay of A-201-G issue 03: D-1 ventilation duct, D-2 waste duct to the sub-basement incinerator, L-1 service lift, S-3 service shaft (stair access under the sculpture-garden pond, opens into the sub-basement plant room, closed to waste). Tape 7 has no custody entry after the 03:17 halt and is in none of boxes 1-3.',
]

export const concerns = [
  'P14: SPINE keeps the "first fragment keyword VECTOR" prompt from the install, but Act I (P05) no longer says where fragment 1 is found; VECTOR is the heading of the cabinet-screen fragment ("The path diverges…") that Act II P08 reads. The Observer recall for P14 points at P05 as in the legacy file; whoever owns P05/P08 should make sure the first fragment (headed VECTOR) is physically or digitally in the team’s hands by P14.',
  'P17: SPINE’s question wording ("a fault or a command?") contains the answer COMMAND, which the redaction rule would blank. Rephrased to "caused by a fault in the recorder, or by something done to it?" with the alts COMMAND / DELIBERATE / A COMMAND / STOPPED / etc. Any later node that quotes the P17 question should use the rephrased form.',
  'P18: the SPINE has the Analyst’s key sheet read "4 SUBJ-05" directly. That makes the item trivial, so the key sheet cites item 4 only as SUBJ-nn (nn = annex line of the person the record withdrew) and the Operator’s box-3 annex supplies line 05 = VEY L.M., WITHDRAWN 19 OCT 1994. This states on paper that SUBJ-05 is the withdrawn project lead. CANON already says Vey was withdrawn from the roster and is "Subject 05" in 2024; Act V should not contradict the annex line number.',
  'P06b: the UPS log must carry "ticket logged, number in detail file" (SPINE), which is also the P25 answer. Only the number is given here, no authoriser and no executor, as instructed. I also had to invent the restoration of circuit 7 at 05:15:20 (the wall clock shows dashes because it lost power and was never re-set); this matches P24’s "no record 04:15-05:15".',
  'P15: CANON says boxes 1-3 were signed out 9 Oct 1994 "and never returned", yet in 2024 the Verification custodian moves them on 16 Oct. The register therefore shows only that no RETURN entry was made for line 24; nothing here says where the boxes physically were between 1994 and 2024.',
  'P16: I placed A. VALE (Directorate desk clerk, 1994) at B7-14, next to the D. WRIGHT seat, as a quiet plant for Act IV/V. Delete if it contradicts the Vale material (his 1994 role is "junior clerk, Directorate desk" in CANON).',
  'P15 uses the seven glyphs as a 1994 NX-037 reference shorthand. CANON puts the seven checks with the 2021 NEXUS; if 1994 should not have the glyph set, change the IR-037 source note to a plain "2 4" and keep the lookup.',
  'Artifact ids: validate.mjs only accepts upper-case suffixes, so SPINE’s EVID-P06b, EVID-P07b and EVID-P17b are written EVID-P06B (+ EVID-P06B-B for the UPS extract), EVID-P07B and EVID-P17B. Downstream references must use the upper-case form.',
  'M02: the answer TUNNEL is the kind of passage, not the route class DELTA (P08) or the door ID (P11). Format text on the Operator terminal says "a kind of route".',
]

/* ────────────────────────────── nodes ────────────────────────────── */

export const nodes = [
  /* ─────────────────────────────── P13 ─────────────────────────────── */
  {
    code: 'P13',
    title: 'The Whiteboard',
    answer: '1994',
    alts: ['NINETEEN NINETY FOUR', 'NINETEEN NINETY-FOUR'],
    redact: false,
    format: 'A YEAR (digits)',
    question: 'In what year was the first Memory Transfer run?',
    narrativeObjective:
      'The whiteboard in the laboratory names a protocol and a date as though both were routine. Establish when that protocol was first run, and where, from the laboratory’s own records rather than from the date on the board.',
    observer: {
      screenTitle: 'Lab Whiteboard Log',
      visualType: 'observation',
      whatTheySee: 'A whiteboard with experiment notes: a protocol name, a date and a code.',
      taskPrompt: 'Copy the notes exactly as written, line by line, and read them to the Analyst. Say which line names the experiment and which line is a date.',
      dataPayload:
        'LAB NOTES ON WHITEBOARD:\n"Experiment: Memory Transfer Protocol\nDate: 17/10/2024\nCode: 3425"\nReport the protocol’s name exactly as it is written. The date is the date of the note, nothing more.',
    },
    analyst: {
      screenTitle: 'Run Register',
      visualType: 'document-forensics',
      whatTheySee: 'The east laboratory’s run register as filed by the Science Building Research Office: runs listed under short series codes, with a note beneath.',
      taskPrompt: 'Read the register out row by row: run, date, room, outcome. Report anything unusual about a row or about the note beneath the table.',
      dataPayload:
        'REGISTER: 8 rows, two series codes, one note beneath the table.\nThe codes are not explained on this sheet. Your Observer holds the experiment’s name; your Operator holds the index that turns names into codes.',
      interactiveData: {
        requiresPuzzle: 'P12',
        recallPrompt: 'Recall the hidden room behind the lecture hall and the label it carries on the older plan.',
        documentText:
          'EAST LABORATORY · RUN REGISTER\nScience Bldg Research Office. Series are filed under the protocol code and numbered separately.\n\nRUN     DATE          ROOM       OUTCOME\nCAL-1   11 NOV 1991   C214-X     levels only\nCAL-2   02 SEP 1993   C214-X     levels only\nMTP-1   13 OCT 1994   C214-X     not entered\nMTP-2   15 MAR 2021   E-LAB-D1   CLOSED\nMTP-3   22 JUN 2021   E-LAB-D1   CLOSED\nMTP-4   08 SEP 2021   E-LAB-D1   NOT CLOSED\nMTP-5   01 DEC 2021   E-LAB-D1   CLOSED\nMTP-6   17 OCT 2024   C214-X     SQ-24-001\n\nNote: MTP-1 transcribed from the Hall 214 annex log when this register was opened (2021).',
      },
    },
    operator: {
      screenTitle: 'Research Office Index',
      visualType: 'document-forensics',
      whatTheySee: 'The Research Office protocol index, the facade terminal’s bay directory and a note on drawing A-201-G.',
      taskPrompt: 'Turn the protocol name your Observer reads into its register code, confirm that this laboratory keeps that series, and check that any room named in an old row was a real room at the time.',
      dataPayload:
        'Three small records, one for each thing to confirm: which series, which laboratory, which room.\nQUESTION: In what year was the first Memory Transfer run?\nANSWER (A YEAR, DIGITS): [ _ _ _ _ ]',
      interactiveData: {
        requiresPuzzle: 'P03',
        recallPrompt: 'Recall which room bay number 3425 belongs to.',
        documentText:
          'RESEARCH OFFICE · PROTOCOL INDEX\nCODE  PROTOCOL                          REGISTER KEPT AT\nCAL   Recorder and camera calibration   E-LAB-D1\nMTP   Memory Transfer Protocol          E-LAB-D1\nRegisters are filed under the protocol code, one series per protocol, each numbered from 1.\n\nBAY DIRECTORY (facade terminal)\n3425  East Laboratory (Science Bldg)    E-LAB-D1\n3524  Chemicals Store                   S-CHM-D1\n\nDRAWING A-201-G\nIssue 02 (Aug 1991): annex behind Hall 214, labelled C214-X.\nIssue 03: annex not drawn.',
      },
    },
    chain: {
      observerProduces: 'The name of the experiment on the board, verbatim, and its date.',
      analystTransforms: 'The register’s rows, grouped under codes the Analyst cannot yet translate.',
      operatorExecutes: 'Translates the name into a code, confirms the lab and the old room, and files the year of the earliest row of that series.',
    },
    failure: {
      wrongStep: 'Taking the date on the board, the first row in the register, or the first row in the room, without sorting the rows by protocol.',
      consequence: 'The claim is rejected: the board shows when the note was written, and the earliest rows of the register belong to a different protocol.',
      recoveryGuidance: 'Use the index to find which series the experiment’s name belongs to, then take the earliest row of that series only.',
    },
    hints: [
      'A date on a whiteboard is when somebody wrote it, not when something began. Ask what the board belongs to and where that thing keeps its history.',
      'The Observer reads the experiment’s name. The Operator’s index turns a name into a series code. The Analyst’s register is organised by series, not by name.',
      'Keep only the rows of the series your experiment belongs to, put them in date order, and ignore rows from any other series. Compare the room in the earliest row with the hidden room you already know about.',
      'A year in digits. It is earlier than the sessions held in this laboratory and earlier than any date the recent paperwork gives.',
    ],
    reveal:
      'The protocol on the whiteboard is thirty years older than the whiteboard. Its first run was held in a room the current plans no longer show, and the laboratory has been repeating the same test ever since.',
    clue: {
      clueText:
        'The register says this laboratory was already running the protocol thirty years ago. In the room itself, one instrument that should be counting shows only dashes.',
      format: 'Inference',
    },
    exhibits: ['EVID-P13'],
    uses: ['P03', 'P12'],
    mech: 'cross-incident',
    solution:
      'Observer reads "Memory Transfer Protocol" on the board (and the date 17/10/2024, which is only the note). Operator’s protocol index: MTP = Memory Transfer Protocol, CAL = recorder and camera calibration; bay 3425 = East Laboratory = E-LAB-D1, which keeps both series; drawing A-201-G issue 02 labels the Hall 214 annex C214-X, so the old room was real. Analyst’s register: MTP rows in date order, earliest MTP-1 13 Oct 1994 in C214-X; the earlier rows (1991, 1993) are CAL, not MTP; MTP-2..5 are the 2021 sessions; MTP-6 is 17 Oct 2024. Answer: 1994.',
    redHerring: { id: 'RH-FIRST-SESSION', theory: 'The first run was the March 2021 session, or the 2024 date on the whiteboard; the 1991/1993 rows are the first.', refutedBy: 'EVID-P13: the 1991 and 1993 rows are series CAL (calibration, levels only); MTP-1 predates the 2021 sessions.' },
    recontext: { what: 'How old the test is', from: 'The Memory Transfer test began with the 2021 relaunch.', to: 'It was first run in 1994 in the hidden room behind Hall 214.' },
    revelation: 'The test is thirty years old and was first run in the same room.',
  },

  /* ─────────────────────────────── M02 ─────────────────────────────── */
  {
    code: 'M02',
    title: 'How She Came Back',
    answer: 'TUNNEL',
    alts: ['SERVICE TUNNEL', 'THE TUNNEL', 'A TUNNEL', 'ROUTE DELTA TUNNEL', 'SERVICE TUNNELS', 'THE SERVICE TUNNEL'],
    redact: false,
    format: 'ONE OR TWO WORDS (a kind of route)',
    question: 'By what route did she re-enter the building without a badge record?',
    narrativeObjective:
      'Eight findings from the second stage are on the terminal. One person left by the front and the bulletin says nothing more is known. Establish by which kind of passage she could have come back inside without leaving a record.',
    observer: {
      screenTitle: 'Stage 2 Findings',
      visualType: 'meta',
      whatTheySee: 'A terminal listing the eight findings your unit filed in the second stage, with connecting lines drawn between the entries.',
      taskPrompt: 'Read each finding aloud in the order shown, with its line number. Say which are times, which are places or door identifiers, and which is a year.',
      dataPayload:
        'STAGE 2 FINDINGS — as filed by this unit.\n1  A-201-G\n2  21:22\n3  DELTA\n4  17:22\n5  MAINTENANCE KEY\n6  S01-TUN\n7  C214-X\n8  1994\nConnecting lines are drawn between the entries.',
      interactiveData: {
        answers: ['A-201-G', '21:22', 'DELTA', '17:22', 'MAINTENANCE KEY', 'S01-TUN', 'C214-X', '1994'],
        hint: 'Each finding is a link. Some links break a theory.',
      },
    },
    analyst: {
      screenTitle: 'Route Legend',
      visualType: 'document-forensics',
      whatTheySee: 'The route legend and an extract of the door schedule from drawing A-201-G, issue 03.',
      taskPrompt: 'Read out each route class: what it is built as and how its doors are controlled. Say which class keeps no reader.',
      dataPayload: 'Recall the key a blue door needs and which door sits behind the marked archway. This legend tells you what the route behind that door is made of.',
      interactiveData: {
        requiresPuzzle: 'P11',
        recallPrompt: 'Recall the door identifier behind the marked archway, and the kind of key that opens blue doors.',
        documentText:
          'DRAWING A-201-G · ISSUE 03 · ROUTE LEGEND (extract)\nCLASS  ROUTE            BUILT AS                     CONTROL\nALPHA  corridors        at grade                     card reader at every door\nBETA   stairs           enclosed stairwells          card reader at each landing\nGAMMA  lifts            car in shaft                 car reader, every floor\nDELTA  service network  below-grade service tunnels   maintenance key; no reader\n\nDOOR SCHEDULE (extract)\nMain entrance   ALPHA  guard desk + card reader\nS01-TUN         DELTA  west spine, ground floor, archway; head of the service tunnels, which link the plant rooms, this building and the Engineering Block\n\nDelta doors are keyed to Facilities maintenance (see key schedule).',
      },
    },
    operator: {
      screenTitle: 'Access Records',
      visualType: 'contradiction-hunt',
      whatTheySee: 'Seven records from five offices about the evening of 17 October: the bulletin, the guard desk, the access-control extract, the library slip, the seal slip and the key schedule.',
      taskPrompt: 'Set the records against each other. Strike out every way into the building that her card or the guard desk would have recorded, and say what kind of passage is left. Treat the library slip with care.',
      dataPayload: 'Seven records. None of them places her at a door after 17:28.\nQUESTION: By what route did she re-enter the building without a badge record?\nANSWER (ONE OR TWO WORDS, a kind of route): [ _ _ _ _ _ _ ]',
      interactiveData: {
        requiresPuzzle: 'P09',
        recallPrompt: 'Recall the true building time of the loan of #06 and how far the library clock was out.',
        entries: [
          { source: 'BULLETIN MP-24-018 · 18 OCT 09:40', text: 'Dr. L. Vey left the Admin Building at 17:30 on 17 October. She has not been seen since.', flag: false },
          { source: 'GUARD DESK GD-241017 · 17 OCT', text: '17:28 OUT L.V. (badge, main entrance). Later main-entrance events: cleaners IN 18:15, Facilities OUT 23:10. None for L.V.', flag: false },
          { source: 'ACCESS CONTROL · CARD L.V. · 17 OCT 17:28 to 22:00', text: 'All ALPHA, BETA and GAMMA readers: last read 17:28 main entrance (OUT). No reads afterwards.', flag: false },
          { source: 'LIBRARY SLIP 44721 · SERVER STAMP', text: '21:22 OUT item #06, L.V.', flag: true },
          { source: 'SEAL SLIP SQ-24-001 · 17 OCT 21:47', text: 'Bound (designer): L.V. Attested R.N., M.C., M.S.', flag: false },
          { source: 'KEY SCHEDULE (FACILITIES)', text: 'Blue doors are keyed to Facilities maintenance. No card reader.', flag: false },
        ],
      },
    },
    chain: {
      observerProduces: 'The eight stage-2 findings, read aloud in order.',
      analystTransforms: 'The legend of route classes: what each is built as and how it is controlled.',
      operatorExecutes: 'Strikes out every way in that her card or the desk would have recorded, discounts the library slip, and files the kind of passage that is left.',
    },
    failure: {
      wrongStep: 'Naming the main entrance because the library slip stamps her inside after 21:00, or answering with the route class (DELTA) or a door identifier instead of the kind of passage.',
      consequence: 'The claim is rejected: the question asks what the route is, and the slip’s stamp comes from a clock that does not tell building time.',
      recoveryGuidance: 'List every way a person can get in, cross out those that would have left a record of her card or her name, then read what the legend says the remaining class is built as.',
    },
    hints: [
      'This is a question of elimination. A person who is never recorded entering was not recorded because of the way she used, or because she did not use any way at all.',
      'The Analyst’s legend says how each class of route is built and controlled. The Operator’s records say where her card was read and where the desk saw her. Your own findings already name the class with no reader.',
      'Strike every route whose doors read a card or pass the guard desk. Decide whether the library slip can place her at a door, using what you learned about its clock. Then ask what the one remaining route actually is as a structure: a corridor, a stair, a lift, or something else.',
      'One or two words naming a kind of passage, not a class letter and not a door identifier. It lies below ground level.',
    ],
    reveal:
      'No reader, no desk entry, no card read after 17:28. The one way into the Admin Building that keeps no record is the one the 1974 plans call a service route. She did not vanish at 17:30. She changed doors.',
    clue: {
      clueText:
        'Having a way back is not yet a reason to come back. The reason is older than this building’s drawings, and the terminal in this laboratory keeps its index.',
      format: 'Inference',
    },
    exhibits: ['EVID-M02'],
    uses: ['P08', 'P09', 'P10', 'P11', 'P12'],
    mech: 'synthesis',
    solution:
      'Observer reads the eight stage-2 findings (A-201-G, 21:22, DELTA, 17:22, MAINTENANCE KEY, S01-TUN, C214-X, 1994). Analyst’s A-201-G issue 03 legend: ALPHA corridors, BETA stairs and GAMMA lifts all read cards; DELTA is the below-grade service tunnels, keyed to maintenance, no reader; S01-TUN is its head. Operator’s records: the desk logged 17:28 OUT and no IN; her card has no reads after 17:28; the library slip’s 21:22 is the P07 stamp, which P09 showed to be 17:22 (server +4 h) and so cannot place her at a door; the key schedule confirms blue doors have no reader. Every recorded way in is excluded. Answer: TUNNEL (the kind of passage Route Delta is).',
    redHerring: { id: 'RH-2122', theory: 'She came back through the main entrance and borrowed the drawings at 21:22.', refutedBy: 'EVID-P09 (library server runs +04:00, so the stamp is 17:22) and EVID-P02-B (no further main-entrance event for L.V.).' },
    recontext: null,
  },

  /* ─────────────────────────────── P06b ─────────────────────────────── */
  {
    code: 'P06b',
    title: 'The Dark Clock',
    answer: '04:15',
    alts: ['0415', '4:15', '4:15 AM', '04:15 AM', '04.15', '4.15'],
    redact: false,
    format: 'HH:MM, 24-hour clock',
    question: 'When did the east lab’s wall clock lose its power?',
    narrativeObjective:
      'The clock on the laboratory wall shows dashes instead of a time. A clock that shows nothing has lost something. Establish when, and what else was on the same supply.',
    observer: {
      screenTitle: 'Lab Wall Clock',
      visualType: 'observation',
      whatTheySee: 'A wall clock with no numbers, just dashes.',
      taskPrompt: 'Report exactly what the display shows. Say whether it is dark, blinking or lit but blank, and whether anything in the room is labelled with the same circuit or unit.',
      dataPayload: 'CLOCK SHOWS: --:--\nA clock that shows dashes has power now and has not been told the time since it last lost power.',
      interactiveData: {
        requiresPuzzle: 'P13',
        recallPrompt: 'Recall which laboratory you are standing in: its bay number and the room that number belongs to.',
      },
    },
    analyst: {
      screenTitle: 'UPS Event Log',
      visualType: 'document-forensics',
      whatTheySee: 'The Science Building UPS controller event log for the night of 17 to 18 October, two units, with circuit numbers but no room names.',
      taskPrompt: 'Read out every event line for both units: time, circuit, event and cause. Say which events were restored within seconds and which were not.',
      dataPayload: 'Six event lines on two units. The log names units and circuits, not rooms. Your Operator holds the schedule that says what each unit and circuit serves.',
      interactiveData: {
        documentText:
          'SCIENCE BUILDING · UPS CONTROLLER · EVENT LOG (extract)\nController clock: building time (master clock, no offset).\n\nUNIT UPS-SB-03\n17 OCT 22:10:41  C3  TRIP   overcurrent; auto-reset 22:10:44\n18 OCT 02:40:12  ALL MAINS DIP 0.4 s; battery held, no circuit lost\n18 OCT 04:15:03  C7  OFF    ticket logged, number in detail file\n18 OCT 05:15:20  C7  ON     restored\n\nUNIT UPS-SB-04\n17 OCT 23:41:50  C7  OFF    surge protection\n17 OCT 23:41:58  C7  ON     restored',
      },
    },
    operator: {
      screenTitle: 'Electrical Schedule',
      visualType: 'document-forensics',
      whatTheySee: 'The Science Building electrical schedule: which UPS unit serves which room, and what each circuit feeds.',
      taskPrompt: 'Find the unit that serves this laboratory by its bay number, find the circuit that feeds the wall clock, and read the Analyst’s log for that unit and circuit. Mind the other unit and the other bay.',
      dataPayload: 'A schedule of units, rooms and circuits.\nQUESTION: When did the east lab’s wall clock lose its power?\nANSWER (HH:MM, 24-hour): [ _ _ : _ _ ]',
      interactiveData: {
        requiresPuzzle: 'P13',
        recallPrompt: 'Recall the bay number of this laboratory and the other bay with nearly the same digits.',
        documentText:
          'SCIENCE BUILDING · ELECTRICAL SCHEDULE\nUNIT        SERVES                          BAY / DOOR\nUPS-SB-03   Research Laboratory (East)      3425 / E-LAB-D1\nUPS-SB-04   Chemicals Store                 3524 / S-CHM-D1\n\nCIRCUITS (same on every unit)\nC3  fume cabinet blower\nC5  bench sockets\nC7  cameras + wall clock\n\nWall clocks are battery-less. After a power loss they show dashes until set by Facilities.',
      },
    },
    chain: {
      observerProduces: 'The dashes on the wall clock, and anything labelled near it.',
      analystTransforms: 'The unit-and-circuit event log, with its short dips and restores.',
      operatorExecutes: 'Maps the lab’s bay to its unit and the clock to its circuit, then files the time of the one event that matches.',
    },
    failure: {
      wrongStep: 'Reading the first event in the log, the mains dip, or the other unit’s circuit 7 because its bay number has the same digits.',
      consequence: 'The claim is rejected: those events either restored within seconds, did not touch the clock’s circuit, or belong to another room.',
      recoveryGuidance: 'Pin down the unit by the bay, the circuit by the schedule, and then look for the event on that pair that was not restored for a long time.',
    },
    hints: [
      'A dark display tells you that power was lost, not when. The answer sits in a log, but a log can describe many rooms and many circuits.',
      'The Operator’s schedule says which unit serves which room and what each circuit feeds. The Analyst’s log is organised by unit and circuit, not by room.',
      'Find the unit for this laboratory using the bay number you established, find the circuit the clock hangs on, and then pick the event on that pair that is neither a short dip nor a restore within seconds.',
      'Hour and minute in 24-hour form, in the small hours after midnight. Seconds are not wanted.',
    ],
    reveal:
      'The laboratory’s cameras and its wall clock hang on one circuit, and that circuit was switched off in the small hours on a ticket. The dashes on the wall are what a clock shows when it has lost power and nobody has set it again.',
    clue: {
      clueText:
        'The custodians keep their records in a shorthand, and its key is now in your archive. On the laboratory wall a diagram uses that shorthand to join three things.',
      format: 'Inference',
    },
    exhibits: ['EVID-P06B', 'EVID-P06B-B'],
    uses: ['P13'],
    mech: 'timeline',
    solution:
      'Observer: wall clock shows --:--. Operator’s schedule: UPS-SB-03 serves the East Laboratory (bay 3425, the lab from P13); UPS-SB-04 serves the Chemicals Store (bay 3524, a digit transposition); circuit 7 feeds cameras and the wall clock; wall clocks are battery-less and show dashes after power loss. Analyst’s log for UPS-SB-03 C7: OFF 04:15:03 (ticket logged; number in the unit detail file), restored 05:15:20. The C3 trip at 22:10 is another circuit, the 02:40 dip lost no circuit, and UPS-SB-04 C7 (23:41, eight seconds) is the wrong room. Answer: 04:15. Side finding: cameras and clock share the circuit, so the lab’s cameras also went dark at 04:15 (seed for P24b).',
    redHerring: { id: 'RH-MAINS-DIP', theory: 'The whole building lost power in a mains dip, which killed the clock.', refutedBy: 'EVID-P06B-B: the 02:40 dip was held by the battery and lost no circuit; only C7 on the lab’s unit went off, at the logged time, and stayed off.' },
    recontext: null,
  },

  /* ─────────────────────────────── P07b ─────────────────────────────── */
  {
    code: 'P07b',
    title: 'The Three Copies',
    answer: 'CARTER',
    alts: ['M CARTER', 'M A CARTER', 'PROF CARTER', 'PROFESSOR CARTER', 'MARCUS CARTER', 'MARCUS A CARTER', 'M.C.', 'MC'],
    redact: false,
    format: 'ONE WORD (a surname)',
    question: 'Which custodian does the symbol ⧉ CONNECTION stand for?',
    narrativeObjective:
      'A diagram in the laboratory joins three symbols by lines. The laboratory uses the symbols as labels on records. Establish which of the three people each label points to, starting from the symbol the question names.',
    observer: {
      screenTitle: 'Network Diagram',
      visualType: 'visual',
      whatTheySee: 'A diagram showing three symbols connected by lines.',
      taskPrompt: 'Read the three symbols in the order listed, and say how many nodes the diagram has. Say whether any node, line or label stands for anything other than these three symbols.',
      dataPayload: 'NETWORK: Three nodes connected by arrows: ⟁ ⧉ ⬡\nThe diagram has no other nodes. Count them yourself.',
    },
    analyst: {
      screenTitle: 'Symbol Usage Sheet',
      visualType: 'document-forensics',
      whatTheySee: 'The laboratory’s usage sheet for the three copy symbols, filed with the symbol key from the drawer.',
      taskPrompt: 'Read out what each of the three symbols means as a kind of record, and the order in which the sheet lists them. Report anything the sheet says about the other symbols.',
      dataPayload: 'A short usage sheet. It names kinds of record, not people. Recall the lab’s key to the symbols.',
      interactiveData: {
        requiresPuzzle: 'P06b',
        recallPrompt: 'Recall the key to the seven symbols found in the lab drawer, in the order the key gives them.',
        documentText:
          'SYMBOL USAGE · MEMORY TRANSFER PROTOCOL\nA record is held in three copies. The copy is labelled with one symbol.\n\n⟁ Origin      the copy of what was seen\n⧉ Connection  the copy of what was measured, and how the measurements link\n⬡ Structure   the copy of what was filed\n\nThe other four symbols (⧫ Memory, ⌬ Choice, ⍟ Truth, ⎔ Finality) label checks, not copies.\nA copy is held by one custodian. No custodian holds two.',
      },
    },
    operator: {
      screenTitle: 'Custodian Roster',
      visualType: 'document-forensics',
      whatTheySee: 'The 2021 roster of NEXUS custodians with the staff directory, as filed in the archive.',
      taskPrompt: 'Match each kind of copy the Analyst reads out to the custodian who holds that kind, and read that custodian’s surname off the directory. Check whether anyone on the roster holds none.',
      dataPayload: 'The roster lists roles, initials and what each role holds.\nQUESTION: Which custodian does the symbol ⧉ CONNECTION stand for?\nANSWER (ONE WORD, a surname): [ _ _ _ _ _ _ ]',
      interactiveData: {
        requiresPuzzle: 'P05',
        recallPrompt: 'Recall the three custodian roles on the wall and who is listed outside them.',
        documentText:
          'NEXUS — ROSTER OF CUSTODIANS, 2021 ISSUE\nROLE            INITIALS   HOLDS\nOBSERVATION     R.N.       the copy of what was seen (photographic)\nANALYSIS        M.C.       the copy of what was measured (ledgers, tapes)\nVERIFICATION    M.S.       the copy of what was filed (boxes, custody)\n\nNOT A CUSTODIAN\nDESIGNER        L.V.       attests nothing. Holds no copy. Binds the seal.\n\nSTAFF DIRECTORY 2021 (extract)\nCARTER, M.A. (Prof. Marcus A.) — Systems Theory\nRAHAL, N. (Noor) — Facilities\nSELIM, M. (Mara) — Archivist\nVEY, L.M. (Dr. Lina M.) — Project Lead, Designer',
      },
    },
    chain: {
      observerProduces: 'Three symbols, three nodes, nothing else on the diagram.',
      analystTransforms: 'Each symbol into the kind of record it labels.',
      operatorExecutes: 'Matches the kind of record to the role that holds it and reads the surname.',
    },
    failure: {
      wrongStep: 'Reading the word CONNECTION as the person who ties the others together, the designer who binds the seal.',
      consequence: 'The claim is rejected: the designer holds no copy and the diagram has no fourth node.',
      recoveryGuidance: 'Treat each symbol as a label on a copy, ask what kind of record that copy is, and match it to the role that holds that kind.',
    },
    hints: [
      'A symbol in a diagram of three stands for one of three things. This is a question about who holds what.',
      'The Analyst’s sheet says what each symbol means as a kind of record. The Operator’s roster says which person holds which kind. The Observer’s diagram tells you how many nodes there are.',
      'Take the meaning of the symbol you are asked about, find the role whose copy is of that kind, and read the person who holds that role. Someone who ties the three together is not necessarily one of them.',
      'One word, a surname as the roster gives it. It is not the surname of the person who designed the quorum.',
    ],
    reveal:
      'Each symbol on the diagram is a copy and each copy has one keeper: what was seen, what was measured, what was filed. The lab drew the record as three nodes because no one of them was meant to be enough.',
    clue: {
      clueText:
        'Three copies need three keepers, and the diagram names what each of them keeps. A terminal in the Memory Lab holds the index of what was kept from the first night.',
      format: 'Inference',
    },
    exhibits: ['EVID-P07B'],
    uses: ['P05', 'P06b'],
    mech: 'relationships',
    solution:
      'Observer: the diagram has exactly three nodes, ⟁ ⧉ ⬡, and none for a binder. Analyst’s usage sheet with the drawer key (EVID-P06B): ⟁ Origin = what was seen, ⧉ Connection = what was measured, ⬡ Structure = what was filed; the other four symbols label checks. Operator’s roster (EVID-P05): the copy of what was measured is ANALYSIS, M.C.; directory: CARTER, M.A., Prof. Marcus A. The designer L.V. holds no copy, so CONNECTION is not the designer. Answer: CARTER.',
    redHerring: { id: 'RH-DESIGNER-LINKS', theory: 'CONNECTION means the person who links the other two, the designer, Vey.', refutedBy: 'EVID-P05: the designer holds no copy and attests nothing; the diagram has only three nodes, all copies.' },
    recontext: null,
  },

  /* ─────────────────────────────── P14 ─────────────────────────────── */
  {
    code: 'P14',
    title: 'The Index',
    answer: '4',
    alts: ['FOUR', '4 ITEMS', 'FOUR ITEMS'],
    redact: true,
    format: 'A NUMBER',
    question: 'How many items does Incident Record 037 list?',
    narrativeObjective:
      'The laboratory’s register points at a night in October 1994, and the building kept one record of it. Establish how much that record claims to hold, and whether the paper in the file agrees.',
    observer: {
      screenTitle: 'Memory Bank Terminal',
      visualType: 'memory-recall',
      whatTheySee: 'A terminal asking for the first fragment keyword.',
      taskPrompt: 'Read the prompt aloud exactly as it appears and say what the terminal does after it. Do not enter anything until the Analyst has confirmed the keyword against the record.',
      dataPayload: 'PROMPT: "Recall the first fragment. What is the keyword?"\nThe terminal waits for a single word before it shows anything else.',
      interactiveData: {
        requiresPuzzle: 'P05',
        recallPrompt: 'Recall the first fragment the unit recovered after the empty frame, and the one word it is headed with.',
      },
    },
    analyst: {
      screenTitle: 'IR-037 Index Sheet',
      visualType: 'document-forensics',
      whatTheySee: 'The index sheet of Incident Record 037, a one-page typed list with a filing keyword at the head.',
      taskPrompt: 'Read the filing keyword and every numbered row of the index, including any row with a blank. Say how many pages are said to follow the sheet.',
      dataPayload: 'One typed index sheet. It points at a key sheet that is filed separately. Read it row by row; do not summarise.',
      interactiveData: {
        documentText:
          'INCIDENT RECORD 037 · INDEX SHEET\nFiling keyword: VECTOR\nSigned for the record: N. Rahal, Observation Officer Gr.2 · 19 OCT 1994\n\nITEM   PAGE    KEY SHEET\n 1     p. 1    KS-1\n 2     p. 2    KS-2\n 3     p. 3    KS-3\n 4     —       KS-4\n\nPrinted pages follow this sheet: 3.\nDescriptions of the items are on key sheet KS-037, filed separately.',
      },
    },
    operator: {
      screenTitle: 'Closed File Register',
      visualType: 'document-forensics',
      whatTheySee: 'The Halder Registry’s closed file register entry for Incident Record 037, with its retention stamp.',
      taskPrompt: 'Check that this entry is the record of the night the laboratory’s register points at. Read the pages on file and the retention stamp, set them against what the Analyst reads from the index, and file the claim.',
      dataPayload: 'A registry entry and a stamp.\nQUESTION: How many items does Incident Record 037 list?\nANSWER (A NUMBER): [ _ ]',
      interactiveData: {
        requiresPuzzle: 'P13',
        recallPrompt: 'Recall the year of the first Memory Transfer run and the room it was held in.',
        documentText:
          'HALDER INSTITUTE · REGISTRY · CLOSED FILE REGISTER\nFILE NX-037 (operations)\nRECORD   DATED         SIGNED       PAGES ON FILE\nIR-037   19 OCT 1994   N. RAHAL     3\n\nINCIDENT: night of 13–14 OCT 1994, overnight test of NEXUS v1, room C214-X.\nSTAMP: RETENTION 30Y FROM DATE OF INCIDENT 14 OCT 1994 · EXPIRES 14 OCT 2024\n\n(pencil) pages on file against index — reconcile.',
      },
    },
    chain: {
      observerProduces: 'The terminal’s prompt for the first fragment keyword.',
      analystTransforms: 'The index sheet: the keyword, the numbered rows and the page references.',
      operatorExecutes: 'Confirms the record is the right night’s, reads the pages on file, sets them against the index and files the count of what the record lists.',
    },
    failure: {
      wrongStep: 'Counting the printed pages (or the attestations from the sessions) instead of the numbered rows of the index.',
      consequence: 'The claim is rejected: the pages are what was printed, and the question asks what the record lists.',
      recoveryGuidance: 'Count the rows on the index sheet, then ask what the difference from the pages on file means for the last row.',
    },
    hints: [
      'A record can list more than it contains. Ask whether the question counts what is listed or what was printed.',
      'The Analyst’s sheet is an index; the Operator’s register says how many pages are on file. They are two different counts and need not agree.',
      'Count the numbered rows on the index. Compare that count with the pages on file and say what the difference means for the row with no page.',
      'A single digit. It is larger than the number of printed pages in the file.',
    ],
    reveal:
      'The incident record lists more than it prints. Three items have pages in the file; the last has a number and nothing else. Someone decided that one item would be remembered by its absence.',
    clue: {
      clueText:
        'A record that lists an item without a page was drawn from boxes. The boxes left the archive on a register line, and the register is kept behind a wall of symbols at the library door.',
      format: 'Inference',
    },
    exhibits: ['EVID-P14'],
    uses: ['P05', 'P13'],
    mech: 'document-forensics',
    solution:
      'Observer: terminal asks for the first fragment keyword; Analyst’s index sheet is filed under the keyword VECTOR, which confirms it is the record the terminal guards. Index rows: items 1, 2, 3 each with a page and item 4 with a dash (KS-4), "Printed pages follow this sheet: 3". Operator’s closed file register: IR-037 dated 19 Oct 1994, pages on file 3, incident 13–14 Oct 1994 in C214-X (the first Memory Transfer run, P13), retention 30Y from 14 Oct 1994. The record lists four numbered items and prints three pages, so item 4 has no page. Answer: 4.',
    redHerring: { id: 'RH-THREE', theory: 'The record lists three items, the same three as the three custodians and the three attestations.', refutedBy: 'EVID-P14: the index sheet numbers four rows; three is only the number of printed pages on file.' },
    recontext: null,
  },

  /* ─────────────────────────────── P15 ─────────────────────────────── */
  {
    code: 'P15',
    title: 'The Withdrawal',
    answer: 'SELIM',
    alts: ['M SELIM', 'MARA SELIM', 'M. SELIM', 'MS SELIM'],
    redact: false,
    format: 'ONE WORD (a surname)',
    question: 'Who signed boxes 1–3 out on 9 October 1994?',
    narrativeObjective:
      'The printed pages of the incident record were typed from three boxes of the operations file. Establish who took those boxes out of the archive, and on what date, from the register that keeps such things.',
    observer: {
      screenTitle: 'Entrance Symbol Wall',
      visualType: 'visual',
      whatTheySee: 'A physical cipher wheel with 7 symbol positions, beside a carved symbol that is the second of the seven.',
      taskPrompt: 'Read the seven symbols on the wheel in order and give each its place: first, second and so on. Say which symbol is carved beside the wheel and what place it holds.',
      dataPayload: 'WHEEL SHOWS: 7 positions with symbols: ⟁ ⧉ ⬡ ⧫ ⌬ ⍟ ⎔\nA carved ⧉ is set beside the wheel. Give the places in the order the wheel runs.',
      interactiveData: {
        requiresPuzzle: 'P06b',
        recallPrompt: 'Recall the lab drawer’s key to the seven symbols and the order in which it lists them.',
      },
    },
    analyst: {
      screenTitle: 'IR-037 Source Note',
      visualType: 'document-forensics',
      whatTheySee: 'The source note of Incident Record 037: where its printed pages were typed from, and how it cites the withdrawal of those boxes.',
      taskPrompt: 'Read the source note and the reference written in symbols. Turn each symbol into its number using the places your Observer reads from the wheel, and read the line number to the Operator.',
      dataPayload: 'A short source note with one reference written in glyphs. Recall what the incident record lists and what it prints.',
      interactiveData: {
        requiresPuzzle: 'P14',
        recallPrompt: 'Recall how many items the incident record lists and how many pages it prints.',
        documentText:
          'INCIDENT RECORD 037 · SOURCE NOTE\nPrinted pages 1–3 were typed from the NX-037 operations file, boxes 1–3.\n\nBoxes leave the archive on a line of the archive withdrawal register. The NX-037 project cites register lines in its own shorthand: two of the seven project glyphs, left to right, each standing for its place in the glyph key (first = 1).\n\nLine reference for boxes 1–3:   ⧉   ⧫\nRead as tens, then units.\n\nRegister page: 3.',
      },
    },
    operator: {
      screenTitle: 'Withdrawal Register',
      visualType: 'document-forensics',
      whatTheySee: 'Page 3 of the archive’s 1994 withdrawal register, lines 22 to 26 and line 42, with the 2021 staff directory.',
      taskPrompt: 'Go to the line your Analyst reads and check that it names boxes 1–3 and the right date. Then read who signed it. Read the neighbouring lines too, and note what is missing on the line you want.',
      dataPayload: 'A register page with several signers on neighbouring lines.\nQUESTION: Who signed boxes 1–3 out on 9 October 1994?\nANSWER (ONE WORD, a surname): [ _ _ _ _ _ ]',
      interactiveData: {
        documentText:
          'ARCHIVE WITHDRAWAL REGISTER · 1994 · PAGE 3 (extract)\nLINE  DATE    ITEM                  SIGNED OUT     RETURNED\n22    05 OCT  NX-035 box 2          H. MARSH       06 OCT\n23    09 OCT  NX-036 box 7          N. RAHAL       09 OCT\n24    09 OCT  NX-037 boxes 1-3      M. SELIM       —\n25    10 OCT  NX-034 box 1          M.A. CARTER    11 OCT\n26    11 OCT  NX-035 box 4          H. MARSH       12 OCT\n42    12 OCT  NX-031 box 3          T. ARDEN       13 OCT\n\nISSUED BY: archive desk (all lines).\n\nSTAFF DIRECTORY 2021 (extract)\nSELIM, M. (Mara) — Archivist\nCARTER, M.A. — Systems Theory\nRAHAL, N. — Facilities',
      },
    },
    chain: {
      observerProduces: 'The seven symbols in the order the wheel runs, and the place of the carved symbol.',
      analystTransforms: 'The glyph reference into a line number, using the places the Observer reads.',
      operatorExecutes: 'Reads that register line, checks item and date, and files the name signed against it.',
    },
    failure: {
      wrongStep: 'Reading the two glyphs in the wrong order, or taking a neighbouring line’s signer because the names Carter and Rahal are familiar.',
      consequence: 'The claim is rejected: the line you land on names other boxes and a different date.',
      recoveryGuidance: 'Number the glyphs by their places, read the pair as tens then units, and confirm that the line says boxes 1–3 on the right date.',
    },
    hints: [
      'A register line is only useful if you know which line. Here the line is written in symbols and must be turned into digits first.',
      'The Observer can read the order the symbols sit in. The Analyst holds the reference written in symbols. The Operator holds the register page.',
      'Number the symbols by their places, read the pair as tens then units, go to that line and check it says boxes 1–3 and the right date. Neighbouring lines belong to other people and other boxes.',
      'One word, the surname as signed on the line. It belongs to the archivist, and the line has no return entry.',
    ],
    reveal:
      'The register records the archivist’s signature on the line, and no return. Days before the night, the file that would one day be asked for was taken out, and no return was ever entered against it.',
    clue: {
      clueText:
        'The register shows a loan with no return. A library keeps a place where returns are made, and a symbol for memory is carved where borrowed things come back.',
      format: 'Inference',
    },
    exhibits: ['EVID-P15'],
    uses: ['P14', 'P06b'],
    mech: 'correlation',
    solution:
      'Observer reads the wheel order ⟁ ⧉ ⬡ ⧫ ⌬ ⍟ ⎔, so places 1 to 7, matching the drawer key (P06b). Analyst’s IR-037 source note (P14 record): boxes 1–3 are cited by the glyph pair ⧉ ⧫, read tens then units; ⧉ = 2, ⧫ = 4, so line 24, register page 3. Operator’s register: line 24 is 09 OCT NX-037 boxes 1-3, signed out M. SELIM, returned: —. Line 42 (the reversed pair) is T. Arden on 12 Oct; lines 23 and 25 are Rahal and Carter on other boxes. Staff directory: SELIM, M. is the archivist. Answer: SELIM.',
    redHerring: { id: 'RH-CARTER-BOXES', theory: 'Carter, who closed his own file on 12 Oct and holds the technical record, took the boxes.', refutedBy: 'EVID-P15: line 24 (boxes 1-3, 09 OCT) is signed M. SELIM; Carter’s entry is line 25, a different project box, returned.' },
    recontext: null,
  },

  /* ─────────────────────────────── P16 ─────────────────────────────── */
  {
    code: 'P16',
    title: 'The Seat',
    answer: 'WRIGHT',
    alts: ['D WRIGHT', 'D. WRIGHT', 'DR WRIGHT'],
    redact: false,
    format: 'ONE WORD (a surname)',
    question: 'Who was seated at B7-15 at the Directorate briefing of 12 October 1994?',
    narrativeObjective:
      'Three days after the boxes left the archive, the Directorate briefed staff in the main auditorium. Establish who sat in Row 7, Seat 15 of Section B, and whether the name on the list belongs to anyone.',
    observer: {
      screenTitle: 'Auditorium Seating',
      visualType: 'observation',
      whatTheySee: 'Auditorium seating with Section B visible.',
      taskPrompt: 'Count the rows in Section B and the seats in a row, and report which rows have occupied seats and which do not.',
      dataPayload: 'SECTION B: Rows 1-10, each with 15 seats. But only odd rows have occupied seats.\nCount the rows and the seats yourself and report any row that breaks the pattern.',
    },
    analyst: {
      screenTitle: 'Briefing Seat Plan',
      visualType: 'document-forensics',
      whatTheySee: 'The seat plan for the Directorate briefing, Section B, as filed by the Directorate desk: rows of invitation numbers, with unoccupied rows left off.',
      taskPrompt: 'Read the plan row by row: the drawn row, the seat and the invitation number. Say how the plan numbers its rows and how it numbers the seats in a row.',
      dataPayload: 'A plan with invitation numbers, not names. Your Operator holds the invitation list. Ask your Observer how the hall is built before you decide which drawn row is which.',
      interactiveData: {
        documentText:
          'DIRECTORATE BRIEFING · 12 OCT 1994 14:00 · MAIN AUDITORIUM\nSEAT PLAN · SECTION B\nOnly occupied rows are drawn, numbered R1 onward in the order drawn. Rows not drawn are empty rows. Seats are numbered 1–15 from the aisle. Entries are invitation numbers (INV).\n\nR1   seat 6  INV 05 · seat 7  INV 06 · seat 8  INV 07\nR2   seat 1  INV 11 · seat 2  INV 12 · seat 3  INV 13\nR3   seat 9  INV 17 · seat 15 INV 18\nR4   seat 1  INV 21 · seat 2  INV 22 · seat 3  INV 23 · seat 14 INV 24 · seat 15 INV 25\nR5   seat 15 INV 31\nUnlisted seats empty.',
      },
    },
    operator: {
      screenTitle: 'Invitation List',
      visualType: 'document-forensics',
      whatTheySee: 'The Directorate’s invitation list for the briefing, with a personnel check run against each name at issue.',
      taskPrompt: 'Turn the invitation number your Analyst reads into a name and read the personnel check against it. Look at the dates on the list, and say what they tell you about the order of the week.',
      dataPayload: 'An invitation list with a personnel check column.\nQUESTION: Who was seated at B7-15 at the Directorate briefing of 12 October 1994?\nANSWER (ONE WORD, a surname): [ _ _ _ _ _ _ ]',
      interactiveData: {
        requiresPuzzle: 'P15',
        recallPrompt: 'Recall the date the boxes left the archive and who signed for them.',
        documentText:
          'INVITATION LIST · DIRECTORATE BRIEFING · 12 OCT 1994 14:00\nIssued 10 OCT 1994 by the Directorate desk. Personnel check run against the roster at issue.\n\nINV     NAME                 UNIT              PERSONNEL CHECK\n05-07   (board, 3)           Directorate       on file\n11-13   (staff, 3)           Estates           on file\n17      ARDEN, T.            Finance           on file\n18      HOLLIS, R.           Estates           on file\n21-23   (project staff, 3)   NX-037            on file\n24      VALE, A.             Directorate desk  on file\n25      WRIGHT, D.           Directorate       NO SUCH PERSON\n31      PRYOR, E.            Finance           on file',
      },
    },
    chain: {
      observerProduces: 'How the hall is built: ten rows of fifteen, only the odd rows used.',
      analystTransforms: 'The plan’s drawn rows and seat entries, as invitation numbers.',
      operatorExecutes: 'Turns the invitation number into a name and reads the personnel check against it.',
    },
    failure: {
      wrongStep: 'Taking the drawn row numbered 7, or the fourth drawn row as Row 4, or counting the seat from the wrong end of the row.',
      consequence: 'The claim is rejected: you land on a different invitation number and a person who exists.',
      recoveryGuidance: 'Work out which drawn row corresponds to Row 7 of the hall from the pattern the Observer reports, then take Seat 15 of that row.',
    },
    hints: [
      'A seat plan says where someone sat; an invitation list says who they were. Neither is any use until you are sure which seat is meant.',
      'The Observer knows how the hall is built and which rows are used. The Analyst’s plan numbers the rows it draws. The Operator’s list turns an invitation number into a name.',
      'Work out which drawn row is the seventh row of the hall, take the last seat in it, read its invitation number, then read that line of the invitation list including its personnel check.',
      'A surname exactly as the list gives it. The personnel check beside that line is not clean.',
    ],
    reveal:
      'The seat is on the plan and the name is on the list, but the personnel check beside it says there is nobody of that name. A name was sitting where a person should have been.',
    clue: {
      clueText:
        'A name nobody can sign for still managed to stop a machine that night. The proof of what the machine did lies where the hall keeps what it heard: at the stage, behind the last row of seats.',
      format: 'Inference',
    },
    exhibits: ['EVID-P16', 'EVID-P16-B'],
    uses: ['P15'],
    mech: 'identity',
    solution:
      'Observer: Section B has ten rows of fifteen and only the odd rows (1, 3, 5, 7, 9) are occupied. Analyst’s plan draws only occupied rows as R1..R5, so hall Row 7 is the fourth drawn row, R4; Seat 15 of R4 is INV 25 (seat 14 is INV 24). Operator’s invitation list: INV 25 = WRIGHT, D., Directorate, personnel check NO SUCH PERSON; INV 24 = VALE, A. The list was issued 10 Oct, the day after the boxes left the archive (P15). Answer: WRIGHT. Wrong-row traps: R3 seat 15 = Hollis (hall row 5), R5 seat 15 = Pryor (hall row 9).',
    redHerring: null,
    recontext: { what: 'Who stopped the record', from: 'A named officer, D. Wright, gave the order.', to: 'The name sits in a seat and on a list, but the personnel check says no such person exists.' },
  },

  /* ─────────────────────────────── P17 ─────────────────────────────── */
  {
    code: 'P17',
    title: 'The Stop Tone',
    answer: 'COMMAND',
    alts: ['A COMMAND', 'COMMANDED', 'DELIBERATE', 'DELIBERATELY', 'DELIBERATE STOP', 'A DELIBERATE STOP', 'STOP COMMAND', 'STOPPED', 'INTENTIONAL'],
    redact: false,
    format: 'ONE WORD (the cause)',
    question: 'Was the gap in tape 7 caused by a fault in the recorder, or by something done to it?',
    narrativeObjective:
      'Tape 7 holds a silence where the night should be. A machine that breaks and a machine that is told to cease leave different marks on the tape. Establish which of the two happened.',
    observer: {
      screenTitle: 'Audio Spectrum Viewer',
      visualType: 'audio',
      whatTheySee: 'Audio spectrum with two prominent frequency peaks.',
      taskPrompt: 'Play the excerpt and report the peak frequencies. Say which tone sounds first, what is heard between the tones, and what follows the second one.',
      dataPayload: 'SPECTRUM: Frequency peaks at 1747 Hz, 2147 Hz. Ratio: 17/21.\nOne peak is at the start of the excerpt, the other close to its end. Report the order you hear them in.',
      interactiveData: {
        audioSpeaker: 'Tape 7 excerpt',
        audioTranscript: '[tone, 1747 Hz] Recorder seven. Oh three sixteen. Levels steady. [room tone] [tone, 2147 Hz] [silence] [tone, 1747 Hz]',
      },
    },
    analyst: {
      screenTitle: 'Recorder Specification',
      visualType: 'document-forensics',
      whatTheySee: 'The service specification for the NEXUS analogue recorder: its control track, its pilot tones and what a failure leaves.',
      taskPrompt: 'Read out the meaning of each pilot frequency, when the recorder lays it, and what a breakdown leaves on the tape. Say how a stop is entered in the log.',
      dataPayload: 'A service sheet for the recorder deck. Match each frequency to its meaning before the Observer reports the order.',
      interactiveData: {
        documentText:
          'NEXUS RECORDER · SERVICE SPECIFICATION (extract)\nCONTROL TRACK PILOT TONES, 0.8 s each:\n1747 Hz   REC ON    laid when the transport starts to record\n2147 Hz   REC OFF   laid only when the transport receives a stop (operator, console or remote), just before the capstan halts\n\nFAULTS: power loss, tape break, motor stall or head clog lay NO pilot. The signal ends hard or degrades; a fault is entered in the deck fault register.\n\nLOGGING: a console stop is entered with the operator’s initials. A stop with no initials did not come from the console.',
      },
    },
    operator: {
      screenTitle: 'Recorder Log',
      visualType: 'document-forensics',
      whatTheySee: 'Page 1 of Incident Record 037: the deck log for tape 7, with its signature column and the deck fault register.',
      taskPrompt: 'Read the log around 03:17 and say whether the stop was signed. Read the fault register. Set both against what the Analyst says each tone means, and file the cause.',
      dataPayload: 'A deck log with a signature column.\nQUESTION: Was the gap in tape 7 caused by a fault in the recorder, or by something done to it?\nANSWER (ONE WORD, the cause): [ _ _ _ _ _ _ _ ]',
      interactiveData: {
        requiresPuzzle: 'P14',
        recallPrompt: 'Recall which pages of the incident record were printed and which item has none.',
        documentText:
          'HALDER INSTITUTE · RECORDER LOG · TAPE 7 (IR-037 p. 1 of 3)\nTIME   EVENT    SIGNED   NOTE\n02:48  REC ON   yes      tape 7 loaded, pilot logged\n03:16  CHECK    yes      levels steady\n03:17  STOP     NO       operator did not sign\n03:24  REC ON   NO       operator did not sign\n\nDECK FAULT REGISTER: no entries.',
      },
    },
    chain: {
      observerProduces: 'The two peaks, their order and the quiet between and after them.',
      analystTransforms: 'What each tone means, when the recorder lays it, and what a breakdown leaves.',
      operatorExecutes: 'Reads the log and fault register, checks the signature column, and files the cause.',
    },
    failure: {
      wrongStep: 'Treating the second tone as noise, or treating the unsigned entry as a clerical gap, and so calling the gap a breakdown.',
      consequence: 'The claim is rejected: a breakdown lays no tone, and the fault register is empty.',
      recoveryGuidance: 'Ask whether a machine that has failed could have laid the second tone, and whether anyone at the console signed for it.',
    },
    hints: [
      'A gap in a recording has only two kinds of cause: something broke, or something was done. Machines leave different traces of each.',
      'The Observer hears and reads the two tones and what comes between them. The Analyst’s specification says what each tone means and what a breakdown leaves behind. The Operator’s log says who, if anyone, acted.',
      'Match each tone to its meaning. Decide whether the second one could be laid by a machine that had lost power or jammed. Then see whether the log puts a person at the console when it sounded.',
      'One word naming the cause. It is not a fault, and it is something the recorder had to be told to do by someone who did not sign.',
    ],
    reveal:
      'The recorder laid its own stop tone. A machine that fails does not announce itself; this one was told, and the operator never signed for it. Someone with reach to the deck at 03:17 chose what the tape would not hold.',
    clue: {
      clueText:
        'Whoever halted the tape could not halt everyone who handled it. Beneath this stage, in the basement, a technician left a message for whoever came next, in a zigzag, on a pillar, in copper.',
      format: 'Inference',
    },
    exhibits: ['EVID-P17', 'EVID-P17-B'],
    uses: ['P14'],
    mech: 'audio-forensics',
    solution:
      'Observer: the excerpt carries a 1747 Hz tone at the start, speech and room tone, then a 2147 Hz tone and silence (then 1747 Hz again). Analyst’s specification: 1747 Hz is the REC ON pilot, 2147 Hz the REC OFF pilot, laid only when the transport receives a stop, never by a fault; a stop without operator initials did not come from the console. Operator’s log (IR-037 p.1): STOP 03:17 NOT signed ("operator did not sign"), REC ON 03:24 not signed, fault register empty. A tone that only a stop produces, an unsigned stop, no fault: the gap was commanded. Answer: COMMAND.',
    redHerring: { id: 'RH-FAULT', theory: 'The gap in tape 7 is a recorder fault (tape break, power loss, head clog).', refutedBy: 'EVID-P17 and EVID-P17-B: a fault lays no REC OFF pilot and is entered in the fault register, which is empty; the stop is unsigned.' },
    recontext: { what: 'The gap in tape 7', from: 'Equipment failure on a long night.', to: 'A stop the recorder was told to make by someone who would not sign.' },
  },

  /* ─────────────────────────────── P17b ─────────────────────────────── */
  {
    code: 'P17b',
    title: 'The Etched Strip',
    answer: 'DOORS',
    alts: ['THE DOORS', 'COUNT THE DOORS'],
    redact: false,
    format: 'ONE WORD (the thing to count)',
    question: 'What does the etched message tell you to count?',
    narrativeObjective:
      'Someone who handled tape 7 left a message in the building’s basement, in a form only a patient reader would take the trouble to unfold. Establish what it asks the reader to attend to.',
    observer: {
      screenTitle: 'Basement Archive Scan',
      visualType: 'cipher-text',
      whatTheySee: 'A copper strip with letters carved in a zigzag pattern across three levels.',
      taskPrompt: 'Read the letters aloud exactly as etched, from the top of the strip to the bottom, one at a time, and say how many there are.',
      dataPayload: 'SCANNED SURFACE: A length of copper tape mounted vertically on a concrete pillar. Etched along its length is a zigzagging string of letters.\nThe string has no gaps between words. Count the letters as you read them.',
      interactiveData: {
        cipherText: 'XGWHGOHLMGVLIMGSXLPFSLLVX',
        hint: 'Three rows. Read down-the-diagonal.',
      },
    },
    analyst: {
      screenTitle: 'Rail Fence Worksheet',
      visualType: 'document-forensics',
      whatTheySee: 'A worksheet for unfolding a rail-fence cipher with three rails, with the rail lengths filled in for a string of this length.',
      taskPrompt: 'Take the letters your Observer reads and unfold them on the fence. Read the unfolded string to the Operator letter by letter. Do not guess words yet.',
      dataPayload: 'RAIL FENCE · 3 RAILS · 25 LETTERS\nThe string is the rails read off one after another: top rail, then middle, then bottom.\nTop rail 7 letters, middle rail 12, bottom rail 6.\nThe zigzag path is rail 1, 2, 3, 2, 1, 2, 3, 2 …\nTop letters sit at positions 1, 5, 9, 13, 17, 21, 25. Middle at the even positions. Bottom at 3, 7, 11, 15, 19, 23.',
      interactiveData: {
        requiresPuzzle: 'P17',
        recallPrompt: 'Recall what the gap in tape 7 turned out to be, and who the log says did not sign.',
      },
    },
    operator: {
      screenTitle: 'Atbash Terminal',
      visualType: 'document-forensics',
      whatTheySee: 'An Atbash alphabet table and the Facilities tool-issue slip for the strip.',
      taskPrompt: 'Apply the Atbash reversal to the string the Analyst reads out, letter by letter. Check the result against the slip. Read the sentence and say which thing it tells the reader to count and which to leave alone.',
      dataPayload: 'ATBASH: the first letter of the alphabet swaps with the last, the second with the one before the last, and so on.\nQUESTION: What does the etched message tell you to count?\nANSWER (ONE WORD, the thing to count): [ _ _ _ _ _ ]',
      interactiveData: {
        requiresPuzzle: 'P09',
        recallPrompt: 'Recall which clock in the building ran four hours out of true, and why that mattered to the loan time.',
        documentText:
          'ATBASH TABLE\nA↔Z  B↔Y  C↔X  D↔W  E↔V  F↔U  G↔T\nH↔S  I↔R  J↔Q  K↔P  L↔O  M↔N\n\nFACILITIES TOOL-ISSUE SLIP FT-94-117 · 17 OCT 1994\nIssued to: TECH-11\n1 reel copper tape 25 mm; 1 scribe\nUse: notice, auditorium basement pillar\nText length: 25 characters, 6 words, no spaces',
      },
    },
    chain: {
      observerProduces: 'The twenty-five etched letters, in order.',
      analystTransforms: 'The three-rail unfolding of those letters.',
      operatorExecutes: 'Applies the Atbash reversal, reads the sentence and files the thing it says to count.',
    },
    failure: {
      wrongStep: 'Applying the Atbash first and the rail fence second, submitting the whole sentence, or submitting the last noun, the thing the sentence says to leave alone.',
      consequence: 'The terminal prints nonsense, or the claim is rejected for being the wrong word.',
      recoveryGuidance: 'Unfold the zigzag first, then reverse the alphabet, then read the sentence and take the noun after the verb to count.',
    },
    hints: [
      'Two ciphers were applied one after the other. Each seat can do one step, and the order matters.',
      'The Observer reads the strip; the Analyst can unfold a zigzag; the Operator holds the alphabet reversal. The Analyst’s step comes first.',
      'Unfold, then reverse the alphabet, then read the sentence. It tells you to attend to one thing and to disregard another; the question asks for the one to attend to.',
      'One word, plural. It is the first noun of the instruction, not the second, and it is something a building has many of.',
    ],
    reveal:
      'COUNT THE DOORS NOT THE CLOCKS. A man who moved a tape and could not sign for it left a sentence for the next person who looked. Clocks can be set to say anything; a door is either there or it is not.',
    clue: {
      clueText:
        'He told you what to attend to, and then nothing else. The next record is behind a lock in the room where books are read, beneath a symbol that names what a record is for.',
      format: 'Inference',
    },
    exhibits: ['EVID-P17B'],
    uses: ['P17', 'P09'],
    mech: 'pattern',
    solution:
      'Observer reads the strip XGWHGOHLMGVLIMGSXLPFSLLVX (25 letters, legacy cipher text). Analyst unfolds the 3-rail fence (rails of 7, 12 and 6 letters) to XLFMGGSVWLLIHMLGGSVXOLXPH. Operator applies Atbash to get COUNTTHEDOORSNOTTHECLOCKS (25 characters, 6 words, as the slip says): COUNT THE DOORS NOT THE CLOCKS. The instruction is to count the first noun, DOORS; the second noun is what to leave. P09 (the library clock was out by four hours) is why a message about clocks being unreliable matters. Answer: DOORS.',
    redHerring: { id: 'RH-LAST-NOUN', theory: 'The message is about clocks: the last word of the sentence is the thing to attend to.', refutedBy: 'EVID-P17B: the sentence says NOT THE CLOCKS; the thing to count is the first noun.' },
    recontext: null,
  },

  /* ─────────────────────────────── P18 ─────────────────────────────── */
  {
    code: 'P18',
    title: 'Item Four',
    answer: 'SUBJ-05',
    alts: ['SUBJ 05', 'SUBJECT 05', 'SUBJ-5', 'SUBJ5', 'SUBJECT 5', 'SUBJECT-05'],
    redact: false,
    format: 'A SHORT REFERENCE (letters, hyphen, two digits)',
    question: 'What is item 4 of Incident Record 037?',
    narrativeObjective:
      'The record lists items and prints pages, and one item has no page. The paper that survives can say what the other items are, and where an unprinted one would be cited from. Establish what was listed and never printed.',
    observer: {
      screenTitle: 'Reading Room Lock',
      visualType: 'visual',
      whatTheySee: 'A 4-digit lock with symbol markers around it, and a carved symbol with a word beneath it.',
      taskPrompt: 'Describe the lock: how many digits it takes and how the symbols are arranged around it. Read the carved symbol and the word beneath it.',
      dataPayload: 'LOCK: 4-digit pattern. Symbols around show: ⟁ ⧉ ⬡ ⧫ ⌬ ⍟ ⎔\nA carved ⍟ with the word TRUTH beneath it is set into the wall beside the lock.',
      interactiveData: {
        requiresPuzzle: 'P17',
        recallPrompt: 'Recall which tape’s recorder log you read at the auditorium stage, and which page of the incident record it is.',
      },
    },
    analyst: {
      screenTitle: 'IR-037 Key Sheet',
      visualType: 'document-forensics',
      whatTheySee: 'Key sheet KS-037 to the incident record: what each numbered item is, and how an item with no page is cited.',
      taskPrompt: 'Read the key sheet line by line, and the note beneath it about items with no page. Say what the last line tells you to look up, and where.',
      dataPayload: 'A key sheet filed apart from the record. It describes three items by page and one by reference.',
      interactiveData: {
        requiresPuzzle: 'P14',
        recallPrompt: 'Recall the numbered rows of the incident record’s index and the row with no page.',
        documentText:
          'KEY SHEET KS-037 (to Incident Record 037)\nKS-1  Recorder log, tape 7                printed p. 1\nKS-2  Operations ledger, extract          printed p. 2\nKS-3  Photograph B-07, print              printed p. 3\nKS-4  A person withdrawn from the project roster by this record. Cited by reference SUBJ-nn, where nn is the person’s line on the personnel annex (NX-037 box 3).\n\nPersons are not reproduced. No page is printed for KS-4.',
      },
    },
    operator: {
      screenTitle: 'Box Labels and Annex',
      visualType: 'document-forensics',
      whatTheySee: 'The archive stock card for the three NX-037 boxes, and the personnel annex listed as box 3.',
      taskPrompt: 'Match each printed page to the box it was typed from. Find the annex line that matches the person the key sheet describes, and build the reference exactly as the key sheet says.',
      dataPayload: 'A stock card with three boxes, no more, and the annex it lists.\nQUESTION: What is item 4 of Incident Record 037?\nANSWER (A SHORT REFERENCE, letters, hyphen, two digits): [ _ _ _ _ - _ _ ]',
      interactiveData: {
        requiresPuzzle: 'P15',
        recallPrompt: 'Recall who signed the three NX-037 boxes out and on what date.',
        documentText:
          'NX-037 STOCK CARD\nBOX 1  operations ledger, Oct 1994\nBOX 2  photographic: print B-07\nBOX 3  personnel annex (project roster, lines 01-05)\nNo box 4 on the card. Boxes 1-3 out 09 OCT 1994 (register p. 3, line 24).\n\nANNEX · NX-037 PROJECT ROSTER · OCT 1994\n01  CARTER, M.A.   Deputy Lead\n02  RAHAL, N.      Observation Officer Gr.2\n03  SELIM, M.      Archivist\n04  TECH-11        Facilities\n05  VEY, L.M.      Project Lead — WITHDRAWN 19 OCT 1994',
      },
    },
    chain: {
      observerProduces: 'The lock, its ring of symbols and the carved word.',
      analystTransforms: 'The key sheet: three items by page, the last by reference.',
      operatorExecutes: 'Matches pages to boxes, finds the annex line the key sheet describes, and builds the reference.',
    },
    failure: {
      wrongStep: 'Assuming item 4 is a fourth document that was lost, or naming a box, or naming the person by name rather than by the reference the key sheet prescribes.',
      consequence: 'The claim is rejected: the key sheet cites this item by a reference, not by a title or a name.',
      recoveryGuidance: 'Read how the key sheet says the last item is cited, find the annex line it describes, and write the reference in the form the sheet gives.',
    },
    hints: [
      'Some records are defined by what they lack. A list that runs to a number and a pile of paper that stops short have a gap between them.',
      'The Analyst’s key sheet says what each item is and how the last one is cited. The Operator’s stock card and the annex it lists say where that reference points.',
      'Match the items with pages to the boxes and to the log you have already read. The last item has no page; the key sheet tells you what kind of thing it is and what to look up. Find the line the record itself withdrew.',
      'A short reference: letters, a hyphen and two digits. It names a person, not a page or a box.',
    ],
    reveal:
      'Item four is not paper. It is a person, cited by a number, withdrawn from the roster on the day the record was written. The record lists her and does not print her.',
    clue: {
      clueText:
        'Three items had pages and one had a number. When someone is told to destroy a thing, it goes one of two ways. Outdoors, beside water, a bronze hand holds something half under.',
      format: 'Inference',
    },
    exhibits: ['EVID-P18'],
    uses: ['P14', 'P15', 'P17'],
    mech: 'missing-evidence',
    solution:
      'Analyst’s key sheet KS-037: items 1-3 have printed pages (1 recorder log tape 7, 2 operations ledger extract, 3 photograph B-07 print); item 4 is a person withdrawn from the project roster by this record, cited SUBJ-nn with nn the line on the personnel annex, and no page is printed. Operator’s stock card: boxes 1-3 hold ledger, print B-07 and the personnel annex, no box 4; annex line 05 is VEY, L.M., Project Lead, WITHDRAWN 19 OCT 1994, the date IR-037 was signed (P14). Page 1 is the tape-7 log read in P17; boxes 1-3 are the ones signed out in P15. Reference: SUBJ-05. Answer: SUBJ-05.',
    redHerring: { id: 'RH-LOST-PAGE', theory: 'Item 4 is a fourth document whose page was lost or removed from the file.', refutedBy: 'EVID-P18: the key sheet says KS-4 is a person, cited by reference, and that no page is printed for it.' },
    recontext: { what: 'What the incident record lists', from: 'Three documents, one of them lost.', to: 'Three documents and a person, who was withdrawn from the roster by the same record.' },
  },

  /* ─────────────────────────────── P19 ─────────────────────────────── */
  {
    code: 'P19',
    title: 'Where It Went',
    answer: 'SHAFT',
    alts: ['THE SHAFT', 'DOWN THE SHAFT', 'SERVICE SHAFT', 'S-3', 'S3'],
    redact: false,
    format: 'ONE WORD (a kind of vertical passage)',
    question: 'Where did TECH-11 take tape 7?',
    narrativeObjective:
      'Tape 7 was halted at the deck and is in none of the boxes. A technician moved it. Establish by which route, from a scrap of a work order and the plans, and what that route does and does not lead to.',
    observer: {
      screenTitle: 'Sculpture Garden Inspection',
      visualType: 'observation',
      whatTheySee: 'A bronze sculpture of a hand holding a partially submerged sphere.',
      taskPrompt: 'Describe the sphere’s position and what the hand is doing. Say what the sphere is partly under, and what surrounds the sculpture.',
      dataPayload: 'SCULPTURE: A bronze hand holding a sphere underwater, half-submerged.\nDescribe the water: how large it is, how deep it appears, and where its edge is.',
    },
    analyst: {
      screenTitle: 'Work Order Scrap',
      visualType: 'document-forensics',
      whatTheySee: 'A torn scrap of a Facilities work order, the lower part only, with one pencil entry.',
      taskPrompt: 'Read every legible line of the scrap, typed and handwritten. Say what is missing, and what the shorthand in the pencil entry could stand for.',
      dataPayload: 'A torn work order. The signature line is gone. The pencil entry uses a shorthand that the incident record explains.',
      interactiveData: {
        requiresPuzzle: 'P17b',
        recallPrompt: 'Recall the sentence etched on the copper strip and who the slip says it was issued to.',
        documentText:
          'FACILITIES WORK ORDER WO-94-1014-11 (lower part of sheet; upper part missing)\nASSIGNED: TECH-11\nRAISED: 14 OCT 1994 03:50\nSITE: Admin Building, ground floor\n\nENTRY (pencil): T7 down the shaft, not the duct.\n\nSIGNATURE: [torn away]',
      },
    },
    operator: {
      screenTitle: 'Custody and Services Plan',
      visualType: 'document-forensics',
      whatTheySee: 'The custody entries for tape 7 and the services overlay of drawing A-201-G, issue 03, showing vertical runs.',
      taskPrompt: 'Read the custody entries and say where the chain breaks. Read the services overlay and say where each vertical run ends. Decide which run a person who wanted the item kept would have used.',
      dataPayload: 'Custody entries with a gap, and a list of vertical runs.\nQUESTION: Where did TECH-11 take tape 7?\nANSWER (ONE WORD, a kind of vertical passage): [ _ _ _ _ _ ]',
      interactiveData: {
        requiresPuzzle: 'P18',
        recallPrompt: 'Recall which boxes held the incident record’s source papers and what is not in any of them.',
        documentText:
          'TAPE 7 · CUSTODY ENTRIES\n03:17  halted at the deck (recorder log, IR-037 p. 1)\n——     removed from the deck: no entry\n——     filed in boxes 1-3: no (ledger, print B-07 and personnel annex only)\n\nSERVICES OVERLAY · A-201-G ISSUE 03 (vertical runs)\nD-1  ventilation duct       to roof plant\nD-2  waste duct             to incinerator, sub-basement\nL-1  service lift           floors G to 3\nS-3  service shaft          stair access under the pond, sculpture garden; opens into the sub-basement plant room; closed to waste',
      },
    },
    chain: {
      observerProduces: 'The sculpture, the water around it and where the sphere sits in it.',
      analystTransforms: 'The scrap: who was assigned, when, and the pencil entry in shorthand.',
      operatorExecutes: 'Finds the break in the custody chain, reads where each run in the plan ends, and files the passage the scrap names.',
    },
    failure: {
      wrongStep: 'Concluding that tape 7 was destroyed because the scrap mentions a duct, or answering with the sub-basement or the pond rather than the kind of passage.',
      consequence: 'The claim is rejected: the scrap names a duct only to say it was not used.',
      recoveryGuidance: 'Read the whole pencil entry, including the word after "not", and ask where each of the two places it names leads.',
    },
    hints: [
      'Where a thing went is a chain: each hand it passed through leaves an entry, and a missing entry is a gap that some other record must fill.',
      'The Analyst’s scrap names two places in shorthand. The Operator’s custody entries show where the chain breaks and the services overlay shows what each place is.',
      'Expand the shorthand using what you know about the incident record, work out what each of the two places leads to, and decide which one a person who wanted the item kept would choose.',
      'One word naming a kind of vertical passage. It is the one that does not end in the incinerator.',
    ],
    reveal:
      'Tape 7 went down, not out. Whoever carried it chose the passage that does not end in the incinerator, and told nobody but a scrap of paper. The scrap does not say what was waiting at the bottom.',
    clue: {
      clueText:
        'Seven symbols, seven checks. One of them is meant to be ticked by the people who close a record, and the last of the seven stands where a weathervane would, at the top of the building.',
      format: 'Inference',
    },
    exhibits: ['EVID-P19'],
    uses: ['P17b', 'P18'],
    mech: 'chain-of-custody',
    solution:
      'Operator’s custody entries: tape 7 halted at the deck at 03:17 (the P17 log), no removal entry, not in boxes 1-3 (ledger, print B-07, annex: P18). Analyst’s scrap WO-94-1014-11, raised 14 Oct 1994 03:50, assigned TECH-11 (the same technician issued the copper tape, P17b): "T7 down the shaft, not the duct" - T7 is tape 7. Operator’s services overlay: D-2 is the waste duct to the incinerator, S-3 the service shaft under the pond, opening into the sub-basement plant room, closed to waste; the Observer’s sculpture stands in water, over S-3. The scrap names the shaft as the route used and the duct as the route refused. Answer: SHAFT.',
    redHerring: { id: 'RH-DUCT', theory: 'Tape 7 went down the waste duct to the incinerator and was destroyed that night.', refutedBy: 'EVID-P19: the pencil entry says "not the duct"; the duct leads to the incinerator, the shaft does not.' },
    recontext: null,
  },
]

/* ────────────────────────────── artifacts ────────────────────────────── */

export const artifacts = [
  /* ───── P13 ───── */
  {
    id: 'EVID-P13',
    node: 'P13',
    kind: 'document',
    title: 'East Laboratory Run Register',
    description: 'The east laboratory’s run register with two protocol series, and the Research Office protocol index.',
    source: 'Science Building, research laboratory (east)',
    custodian: 'Science Building Research Office',
    date: '2024-10-17',
    reliability: 'primary',
    proves: ['The Memory Transfer series (MTP) has a first run on 13 Oct 1994 in room C214-X', 'Runs 2–5 are the four 2021 sessions and run 6 is the night of 17 Oct 2024', 'The 1991 and 1993 rows belong to a different protocol (calibration)'],
    doesNotProve: ['What the 1994 run recorded or whether it closed', 'Who took part in the 1994 run', 'That the 1994 date is the original and not a copy error (it was transcribed in 2021)'],
    relates: [
      { to: 'EVID-P03', kind: 'corroborates', note: 'Bay 3425 is the east laboratory whose register this is.' },
      { to: 'EVID-P12', kind: 'corroborates', note: 'Issue 02 of the plan draws the annex that the earliest rows name.' },
    ],
    condition: 'NORMAL',
    text:
      'EAST LABORATORY RUN REGISTER. Science Building Research Office. Series are filed under the protocol code and numbered separately. CAL-1 11 NOV 1991 C214-X levels only. CAL-2 02 SEP 1993 C214-X levels only. MTP-1 13 OCT 1994 C214-X not entered. MTP-2 15 MAR 2021 E-LAB-D1 CLOSED. MTP-3 22 JUN 2021 E-LAB-D1 CLOSED. MTP-4 08 SEP 2021 E-LAB-D1 NOT CLOSED. MTP-5 01 DEC 2021 E-LAB-D1 CLOSED. MTP-6 17 OCT 2024 C214-X SQ-24-001. Note: MTP-1 transcribed from the Hall 214 annex log when this register was opened (2021). Protocol index: CAL recorder and camera calibration; MTP Memory Transfer Protocol; both registers kept at E-LAB-D1.',
    render: {
      form: 'doc',
      stock: 'ledger',
      head: { org: 'SCIENCE BUILDING', unit: 'RESEARCH OFFICE', form: 'RUN REGISTER', control: 'SB/RR/E-LAB', revision: '' },
      title: 'EAST LABORATORY · RUN REGISTER',
      fields: [['DOOR', 'E-LAB-D1'], ['OPENED', '2021']],
      blocks: [
        { t: 'table', cols: ['RUN', 'DATE', 'ROOM', 'OUTCOME'], widths: [0.16, 0.26, 0.24, 0.34], hi: [2], rows: [
          ['CAL-1', '11 NOV 1991', 'C214-X', 'levels only'],
          ['CAL-2', '02 SEP 1993', 'C214-X', 'levels only'],
          ['MTP-1', '13 OCT 1994', 'C214-X', 'not entered'],
          ['MTP-2', '15 MAR 2021', 'E-LAB-D1', 'CLOSED'],
          ['MTP-3', '22 JUN 2021', 'E-LAB-D1', 'CLOSED'],
          ['MTP-4', '08 SEP 2021', 'E-LAB-D1', 'NOT CLOSED'],
          ['MTP-5', '01 DEC 2021', 'E-LAB-D1', 'CLOSED'],
          ['MTP-6', '17 OCT 2024', 'C214-X', 'SQ-24-001'],
        ] },
        { t: 'gap', h: 10 },
        { t: 'p', text: 'MTP-1 transcribed from the Hall 214 annex log when this register was opened (2021).' },
        { t: 'gap', h: 8 },
        { t: 'mono', lines: ['INDEX  CAL  recorder and camera calibration', '       MTP  Memory Transfer Protocol'] },
      ],
      foot: 'SB RESEARCH OFFICE · RET 10Y · PAGE 1 OF 1',
      damage: null,
    },
  },

  /* ───── M02 ───── */
  {
    id: 'EVID-M02',
    node: 'M02',
    kind: 'document',
    title: 'Case Conference Note: Re-entry',
    description: 'The unit’s note of which routes into the building would have left a record of Dr. Vey on the evening of 17 October.',
    source: 'Memory lab terminal (print)',
    custodian: 'Investigating unit',
    date: '2026-10-07',
    reliability: 'derived',
    proves: ['No recorded way into the building places L.V. at a door after 17:28', 'The Delta service network is the one class of route that keeps no reader and no desk'],
    doesNotProve: ['That she in fact used the service tunnels', 'When she re-entered', 'Where she was between 17:28 and 21:44'],
    relates: [
      { to: 'EVID-P09', kind: 'explains', note: 'The 21:22 library stamp cannot place her at a door: that server runs four hours ahead.' },
      { to: 'EVID-P10', kind: 'derives', note: 'Blue doors keep no reader.' },
      { to: 'EVID-P11', kind: 'derives', note: 'S01-TUN is the head of the Delta service network.' },
    ],
    condition: 'NORMAL',
    text:
      'CASE CONFERENCE NOTE CC-02. Question: how could L.V. re-enter the Admin Building without a badge record? Routes and what each would have recorded. Main entrance: guard desk plus card reader; 17:28 OUT, no IN. ALPHA corridors: card reader; no reads for L.V. after 17:28. BETA stairs: card reader; none. GAMMA lifts: car reader; none. DELTA service network, below-grade service tunnels: maintenance key, no reader, nothing could have been recorded. Library slip 44721 (21:22) discounted: library server runs +04:00, true time 17:22. Open: the time of entry, and whether Route Delta was in fact used.',
    render: {
      form: 'doc',
      stock: 'bond',
      head: { org: 'INVESTIGATING UNIT', unit: 'CASE CONFERENCE', form: 'CONFERENCE NOTE', control: 'CC-02', revision: '' },
      title: 'RE-ENTRY · WHICH ROUTES LEAVE A RECORD',
      fields: [['SUBJECT', 'L.V., 17 OCT 2024'], ['STAGE', '2']],
      blocks: [
        { t: 'table', cols: ['ROUTE', 'CONTROL', 'WOULD HAVE RECORDED'], widths: [0.3, 0.3, 0.4], hi: [4], rows: [
          ['Main entrance', 'guard desk + reader', '17:28 OUT; no IN'],
          ['ALPHA corridors', 'card reader', 'no reads after 17:28'],
          ['BETA stairs', 'card reader', 'no reads'],
          ['GAMMA lifts', 'car reader', 'no reads'],
          ['DELTA service tunnels', 'maintenance key', 'nothing: no reader'],
        ] },
        { t: 'gap', h: 10 },
        { t: 'p', text: 'Library slip 44721 (21:22) discounted: the library server runs +04:00, true time 17:22.' },
        { t: 'p', text: 'Open: time of entry; whether Route Delta was in fact used.' },
      ],
      foot: 'UNIT FILE · NOT AN OFFICIAL RECORD · PAGE 1 OF 1',
      damage: null,
    },
  },

  /* ───── P06b ───── */
  {
    id: 'EVID-P06B',
    node: 'P06b',
    kind: 'note',
    title: 'Lab Symbol Key',
    description: 'A card from the laboratory symbol drawer keying seven symbols to seven names.',
    source: 'Lab symbol drawer, east laboratory',
    custodian: 'Science Building Research Office',
    date: '2021-03-15',
    reliability: 'primary',
    proves: ['The seven symbols and their names: Origin, Connection, Structure, Memory, Choice, Truth, Finality', 'The first three also label the copies: what was seen, what was measured, what was filed'],
    doesNotProve: ['Who wrote the card', 'Who holds each copy', 'Whether the seven symbols were in use before 2021'],
    relates: [{ to: 'EVID-P07B', kind: 'explains', note: 'The copy symbols are read off this key.' }],
    condition: 'NORMAL',
    text:
      'LAB SYMBOL KEY. ⟁ Origin (what was seen). ⧉ Connection (what was measured), marked with a star. ⬡ Structure (what was filed). ⧫ Memory. ⌬ Choice. ⍟ Truth. ⎔ Finality. Symbols are listed in this order. Pencil: second glyph starred.',
    render: {
      form: 'note',
      stock: 'card',
      head: null,
      title: 'SYMBOL KEY · LAB DRAWER',
      fields: [['SHEET', '1 OF 1'], ['KEPT', 'DRAWER, E-LAB']],
      blocks: [
        { t: 'mono', lines: ['1  ⟁  ORIGIN       what was seen', '2  ⧉  CONNECTION   what was measured *', '3  ⬡  STRUCTURE    what was filed', '4  ⧫  MEMORY', '5  ⌬  CHOICE', '6  ⍟  TRUTH', '7  ⎔  FINALITY'] },
        { t: 'hand', text: '* second glyph starred', dx: 30, dy: 6, rot: -2, color: 'blue' },
      ],
      foot: 'RESEARCH OFFICE · KEY SHEET',
      damage: null,
    },
  },
  {
    id: 'EVID-P06B-B',
    node: 'P06b',
    kind: 'log',
    title: 'UPS Controller Event Log, Science Building',
    description: 'Extract of the UPS controller event log for two units, night of 17 to 18 October 2024.',
    source: 'Science Building plant controller (print)',
    custodian: 'Estates Facilities',
    date: '2024-10-18',
    reliability: 'primary',
    proves: ['Circuit 7 on unit UPS-SB-03 went off at 04:15:03 on 18 Oct on a logged ticket and came back on at 05:15:20', 'The 02:40 mains dip lost no circuit', 'Circuit 7 on UPS-SB-04 went off for eight seconds at 23:41'],
    doesNotProve: ['Who authorised or executed the ticket', 'What the ticket said', 'What happened in the lab between 04:15 and 05:15'],
    relates: [
      { to: 'EVID-P25', kind: 'precedes', note: 'The ticket number recorded here is the one the later power-down log carries.' },
      { to: 'EVID-P06B', kind: 'corroborates', note: 'Circuit 7 feeds the cameras and the wall clock whose dashes the symbol drawer sat beneath.' },
    ],
    condition: 'NORMAL',
    text:
      'SCIENCE BUILDING UPS CONTROLLER EVENT LOG (extract). Controller clock: building time (master clock, no offset). UNIT UPS-SB-03: 17 OCT 22:10:41 C3 TRIP overcurrent, auto-reset 22:10:44. 18 OCT 02:40:12 ALL MAINS DIP 0.4 s, battery held, no circuit lost. 18 OCT 04:15:03 C7 OFF ticket logged, number in detail file. 18 OCT 05:15:20 C7 ON restored. UNIT UPS-SB-04: 17 OCT 23:41:50 C7 OFF surge protection. 17 OCT 23:41:58 C7 ON restored.',
    render: {
      form: 'doc',
      stock: 'thermal',
      head: null,
      title: 'UPS CONTROLLER · EVENT LOG',
      fields: [['SITE', 'SCIENCE BUILDING'], ['CLOCK', 'BUILDING TIME']],
      blocks: [
        { t: 'mono', lines: [
          'UNIT UPS-SB-03',
          '17 OCT 22:10:41  C3  TRIP  overcurrent, auto-reset 22:10:44',
          '18 OCT 02:40:12  ALL MAINS DIP 0.4 s, battery held',
          '18 OCT 04:15:03  C7  OFF   TKT logged, number in detail file',
          '18 OCT 05:15:20  C7  ON    restored',
          '',
          'UNIT UPS-SB-04',
          '17 OCT 23:41:50  C7  OFF   surge protection',
          '17 OCT 23:41:58  C7  ON    restored',
        ] },
      ],
      foot: 'ESTATES FACILITIES · CONTROLLER PRINT',
      damage: null,
    },
  },

  /* ───── P07b ───── */
  {
    id: 'EVID-P07B',
    node: 'P07b',
    kind: 'document',
    title: 'Copy Map: Symbols to Keepers',
    description: 'A table matching the three copy symbols to the kind of record and to the custodian who holds it.',
    source: 'Lab network diagram, with the 2021 roster',
    custodian: 'Investigating unit',
    date: '2026-10-07',
    reliability: 'derived',
    proves: ['Each of the three copy symbols labels one kind of record and one custodian', 'The designer holds no copy and has no node on the diagram'],
    doesNotProve: ['Which custodian holds which physical object today', 'That the copies agree with one another'],
    relates: [
      { to: 'EVID-P05', kind: 'derives', note: 'Roles, initials and what each role holds.' },
      { to: 'EVID-P06B', kind: 'derives', note: 'Symbol names and the glosses for the first three.' },
    ],
    condition: 'NORMAL',
    text:
      'COPY MAP. ⟁ Origin: the copy of what was seen: OBSERVATION, R.N., Rahal. ⧉ Connection: the copy of what was measured, ledgers and tapes: ANALYSIS, M.C., Carter. ⬡ Structure: the copy of what was filed, boxes and custody: VERIFICATION, M.S., Selim. The designer, L.V., holds no copy and appears on no node. The other four symbols label checks.',
    render: {
      form: 'doc',
      stock: 'bond',
      head: { org: 'INVESTIGATING UNIT', unit: 'CASE FILE', form: 'COPY MAP', control: 'CM-07B', revision: '' },
      title: 'THREE COPIES, THREE KEEPERS',
      fields: [['FROM', 'LAB DIAGRAM + ROSTER 2021']],
      blocks: [
        { t: 'table', cols: ['SYMBOL', 'KIND OF RECORD', 'ROLE', 'KEEPER'], widths: [0.2, 0.34, 0.22, 0.24], hi: [1], rows: [
          ['⟁ Origin', 'what was seen', 'OBSERVATION', 'R.N. Rahal'],
          ['⧉ Connection', 'what was measured', 'ANALYSIS', 'M.C. Carter'],
          ['⬡ Structure', 'what was filed', 'VERIFICATION', 'M.S. Selim'],
        ] },
        { t: 'gap', h: 10 },
        { t: 'p', text: 'The designer (L.V.) holds no copy and has no node on the diagram.' },
      ],
      foot: 'UNIT FILE · PAGE 1 OF 1',
      damage: null,
    },
  },

  /* ───── P14 ───── */
  {
    id: 'EVID-P14',
    node: 'P14',
    kind: 'document',
    title: 'Incident Record 037: Index Sheet',
    description: 'The index sheet of Incident Record 037, with the Registry’s retention stamp.',
    source: 'Memory lab terminal (scan)',
    custodian: 'Bureau of Continuity Records',
    date: '1994-10-19',
    reliability: 'primary',
    proves: ['IR-037 numbers four items in its index', 'Three printed pages follow the sheet; item 4 has no page', 'The record was signed by N. Rahal on 19 Oct 1994 and retained 30 years from the incident date, 14 Oct 1994'],
    doesNotProve: ['What the four items are', 'Why item 4 has no page', 'Who removed or never printed it'],
    relates: [
      { to: 'EVID-P13', kind: 'corroborates', note: 'The incident date is the night after the first Memory Transfer run.' },
      { to: 'EVID-P18', kind: 'precedes', note: 'The key sheet describes the numbered rows.' },
    ],
    condition: 'NORMAL',
    text:
      'INCIDENT RECORD 037, INDEX SHEET. Filing keyword: VECTOR. Signed for the record: N. Rahal, Observation Officer Gr.2, 19 OCT 1994. ITEM 1 p. 1 KS-1. ITEM 2 p. 2 KS-2. ITEM 3 p. 3 KS-3. ITEM 4 no page KS-4. Printed pages follow this sheet: 3. Descriptions of the items are on key sheet KS-037, filed separately. Stamp: RETENTION 30Y FROM DATE OF INCIDENT 14 OCT 1994, EXPIRES 14 OCT 2024. Pencil: pages on file against index, reconcile.',
    render: {
      form: 'doc',
      stock: 'carbon',
      head: { org: 'HALDER INSTITUTE FOR CONTINUITY STUDIES', unit: 'REGISTRY', form: 'INCIDENT RECORD · INDEX SHEET', control: 'IR-037', revision: '' },
      title: 'INCIDENT RECORD 037 · INDEX',
      fields: [['KEYWORD', 'VECTOR'], ['DATED', '19 OCT 1994']],
      blocks: [
        { t: 'table', cols: ['ITEM', 'PAGE', 'KEY SHEET'], widths: [0.2, 0.3, 0.5], hi: [3], rows: [
          ['1', 'p. 1', 'KS-1'],
          ['2', 'p. 2', 'KS-2'],
          ['3', 'p. 3', 'KS-3'],
          ['4', '—', 'KS-4'],
        ] },
        { t: 'gap', h: 10 },
        { t: 'p', text: 'Printed pages follow this sheet: 3. Descriptions of the items are on key sheet KS-037, filed separately.' },
        { t: 'sig', name: 'N. Rahal' },
        { t: 'stamp', text: 'RET 30Y · INCIDENT 14 OCT 1994', color: 'red', rot: -6, dx: 150, dy: -180 },
        { t: 'hand', text: 'pages on file vs index — reconcile', dx: 20, dy: 4, rot: -2, color: 'blue' },
      ],
      foot: 'HALDER REGISTRY · RET 30Y · EXPIRES 14 OCT 2024',
      damage: null,
    },
  },

  /* ───── P15 ───── */
  {
    id: 'EVID-P15',
    node: 'P15',
    kind: 'log',
    title: 'Archive Withdrawal Register 1994, Page 3',
    description: 'Page 3 of the archive’s 1994 withdrawal register, lines 22 to 26 and line 42.',
    source: 'Library entrance symbol wall',
    custodian: 'Bureau of Continuity Records',
    date: '1994-10-12',
    reliability: 'primary',
    proves: ['Line 24: NX-037 boxes 1-3 signed out on 09 Oct 1994 by M. Selim', 'No return is entered against line 24'],
    doesNotProve: ['What Selim did with the boxes', 'That the boxes never physically returned (only that no return was entered)', 'Why the boxes were signed out'],
    relates: [
      { to: 'EVID-P14', kind: 'explains', note: 'The incident record’s source note cites this line by glyph pair.' },
      { to: 'EVID-P16', kind: 'precedes', note: 'Three days before the briefing.' },
    ],
    condition: 'NORMAL',
    text:
      'ARCHIVE WITHDRAWAL REGISTER 1994, PAGE 3 (extract). Line 22: 05 OCT NX-035 box 2, H. Marsh, returned 06 OCT. Line 23: 09 OCT NX-036 box 7, N. Rahal, returned 09 OCT. Line 24: 09 OCT NX-037 boxes 1-3, M. Selim, returned: none. Line 25: 10 OCT NX-034 box 1, M.A. Carter, returned 11 OCT. Line 26: 11 OCT NX-035 box 4, H. Marsh, returned 12 OCT. Line 42: 12 OCT NX-031 box 3, T. Arden, returned 13 OCT. Issued by: archive desk.',
    render: {
      form: 'doc',
      stock: 'ledger',
      head: { org: 'HALDER INSTITUTE FOR CONTINUITY STUDIES', unit: 'ARCHIVE DESK', form: 'WITHDRAWAL REGISTER', control: 'AR/WD/94', revision: '' },
      title: 'WITHDRAWAL REGISTER · 1994 · PAGE 3',
      fields: [['LINES', '22–26, 42 (EXTRACT)'], ['ISSUED BY', 'ARCHIVE DESK']],
      blocks: [
        { t: 'table', cols: ['LINE', 'DATE', 'ITEM', 'SIGNED OUT', 'RETURNED'], widths: [0.1, 0.14, 0.26, 0.28, 0.22], hi: [2], rows: [
          ['22', '05 OCT', 'NX-035 box 2', 'H. MARSH', '06 OCT'],
          ['23', '09 OCT', 'NX-036 box 7', 'N. RAHAL', '09 OCT'],
          ['24', '09 OCT', 'NX-037 boxes 1-3', 'M. SELIM', '—'],
          ['25', '10 OCT', 'NX-034 box 1', 'M.A. CARTER', '11 OCT'],
          ['26', '11 OCT', 'NX-035 box 4', 'H. MARSH', '12 OCT'],
          ['42', '12 OCT', 'NX-031 box 3', 'T. ARDEN', '13 OCT'],
        ] },
        { t: 'gap', h: 8 },
        { t: 'p', text: 'ISSUED BY: archive desk (all lines).' },
      ],
      foot: 'ARCHIVE DESK · RET 30Y · PAGE 3',
      damage: null,
    },
  },

  /* ───── P16 ───── */
  {
    id: 'EVID-P16',
    node: 'P16',
    kind: 'document',
    title: 'Briefing Seat Plan, Section B, 12 October 1994',
    description: 'Seat plan for the Directorate briefing in the main auditorium, Section B, occupied rows only.',
    source: 'Main auditorium, Section B',
    custodian: 'Directorate desk (Bureau of Continuity Records successor files)',
    date: '1994-10-12',
    reliability: 'primary',
    proves: ['Section B drew five occupied rows; Seat 15 of the fourth drawn row (hall Row 7) is invitation 25', 'Seat 14 of the same row is invitation 24'],
    doesNotProve: ['That the invitation holder attended', 'Who invitation 25 was'],
    relates: [{ to: 'EVID-P16-B', kind: 'explains', note: 'The invitation list turns the numbers into names.' }],
    condition: 'NORMAL',
    text:
      'DIRECTORATE BRIEFING, 12 OCT 1994 14:00, MAIN AUDITORIUM. SEAT PLAN, SECTION B. Only occupied rows are drawn, numbered R1 onward in the order drawn. Rows not drawn are empty rows. Seats are numbered 1 to 15 from the aisle. Entries are invitation numbers (INV). R1: seat 6 INV 05, seat 7 INV 06, seat 8 INV 07. R2: seat 1 INV 11, seat 2 INV 12, seat 3 INV 13. R3: seat 9 INV 17, seat 15 INV 18. R4: seat 1 INV 21, seat 2 INV 22, seat 3 INV 23, seat 14 INV 24, seat 15 INV 25. R5: seat 15 INV 31. Unlisted seats empty.',
    render: {
      form: 'doc',
      stock: 'bond',
      head: { org: 'THE DIRECTORATE', unit: 'DIRECTORATE DESK', form: 'BRIEFING SEAT PLAN', control: 'DD/BR/94-10', revision: '' },
      title: 'SECTION B · SEAT PLAN',
      fields: [['BRIEFING', '12 OCT 1994 14:00'], ['HALL', 'MAIN AUDITORIUM']],
      blocks: [
        { t: 'p', text: 'Only occupied rows are drawn, numbered R1 onward in the order drawn. Rows not drawn are empty rows. Seats 1–15 from the aisle. Entries are invitation numbers.' },
        { t: 'gap', h: 6 },
        { t: 'table', cols: ['ROW', 'SEAT : INVITATION'], widths: [0.14, 0.86], hi: [3], rows: [
          ['R1', '6 : 05   7 : 06   8 : 07'],
          ['R2', '1 : 11   2 : 12   3 : 13'],
          ['R3', '9 : 17   15 : 18'],
          ['R4', '1 : 21   2 : 22   3 : 23   14 : 24   15 : 25'],
          ['R5', '15 : 31'],
        ] },
        { t: 'gap', h: 8 },
        { t: 'p', text: 'Unlisted seats empty.' },
      ],
      foot: 'DIRECTORATE DESK · PAGE 1 OF 1',
      damage: null,
    },
  },
  {
    id: 'EVID-P16-B',
    node: 'P16',
    kind: 'document',
    title: 'Invitation List with Personnel Check, 12 October 1994',
    description: 'The Directorate’s invitation list for the briefing, with a personnel check column.',
    source: 'Main auditorium, Section B',
    custodian: 'Directorate desk (Bureau of Continuity Records successor files)',
    date: '1994-10-10',
    reliability: 'primary',
    proves: ['Invitation 25 is entered under the name WRIGHT, D., Directorate', 'The personnel check against that line is NO SUCH PERSON', 'Invitation 24 is A. Vale of the Directorate desk'],
    doesNotProve: ['Who actually filled the seat', 'Why the name was put on the list', 'Who wrote the name'],
    relates: [
      { to: 'EVID-P16', kind: 'explains', note: 'Resolves the plan’s invitation numbers into names.' },
      { to: 'EVID-P26', kind: 'precedes', note: 'The standing instruction that explains the stamp.' },
    ],
    condition: 'NORMAL',
    text:
      'INVITATION LIST, DIRECTORATE BRIEFING, 12 OCT 1994 14:00. Issued 10 OCT 1994 by the Directorate desk. Personnel check run against the roster at issue. INV 05-07 (board, 3) Directorate, on file. INV 11-13 (staff, 3) Estates, on file. INV 17 ARDEN, T., Finance, on file. INV 18 HOLLIS, R., Estates, on file. INV 21-23 (project staff, 3) NX-037, on file. INV 24 VALE, A., Directorate desk, on file. INV 25 WRIGHT, D., Directorate, NO SUCH PERSON. INV 31 PRYOR, E., Finance, on file.',
    render: {
      form: 'doc',
      stock: 'carbon',
      head: { org: 'THE DIRECTORATE', unit: 'DIRECTORATE DESK', form: 'INVITATION LIST', control: 'DD/INV/94-10', revision: '' },
      title: 'BRIEFING · INVITATION LIST',
      fields: [['ISSUED', '10 OCT 1994'], ['CHECK', 'PERSONNEL ROSTER AT ISSUE']],
      blocks: [
        { t: 'table', cols: ['INV', 'NAME', 'UNIT', 'PERSONNEL CHECK'], widths: [0.12, 0.3, 0.28, 0.3], hi: [6], rows: [
          ['05-07', '(board, 3)', 'Directorate', 'on file'],
          ['11-13', '(staff, 3)', 'Estates', 'on file'],
          ['17', 'ARDEN, T.', 'Finance', 'on file'],
          ['18', 'HOLLIS, R.', 'Estates', 'on file'],
          ['21-23', '(project staff, 3)', 'NX-037', 'on file'],
          ['24', 'VALE, A.', 'Directorate desk', 'on file'],
          ['25', 'WRIGHT, D.', 'Directorate', 'NO SUCH PERSON'],
          ['31', 'PRYOR, E.', 'Finance', 'on file'],
        ] },
        { t: 'stamp', text: 'NO SUCH PERSON', color: 'red', rot: -8, dx: 260, dy: -70 },
      ],
      foot: 'DIRECTORATE DESK · PAGE 1 OF 1',
      damage: null,
    },
  },

  /* ───── P17 ───── */
  {
    id: 'EVID-P17',
    node: 'P17',
    kind: 'audio',
    title: 'Tape 7 Excerpt: Pilot and Stop Tones',
    description: 'A synthesised reconstruction of an excerpt of tape 7 around the 03:17 stop, with both pilot tones on the control track.',
    source: 'Auditorium stage terminal',
    custodian: 'Bureau of Continuity Records',
    date: '1994-10-14 03:17',
    reliability: 'derived',
    proves: ['The excerpt carries a 1747 Hz tone at its start and a 2147 Hz tone before the silence', 'A spoken level check is heard before the 2147 Hz tone'],
    doesNotProve: ['Who sent the stop', 'What was spoken or done in the room during the gap', 'That this reconstruction is the original waveform (it is rendered from the recorder’s log and specification)'],
    relates: [
      { to: 'EVID-P17-B', kind: 'corroborates', note: 'The deck log records an unsigned stop at 03:17.' },
    ],
    condition: 'NORMAL',
    text:
      'TAPE 7 EXCERPT (reconstruction, 17 seconds). [Tone, 1747 Hz.] Spoken: "Recorder seven. Oh three sixteen. Levels steady." [Room tone, 2.5 seconds.] [Tone, 2147 Hz.] [Silence, 3 seconds.] [Tone, 1747 Hz.]',
    audio: {
      file: 'tape7-stop-excerpt',
      length: 17,
      script: [
        { cue: 'pilot-on' },
        { who: 'CARTER', text: 'Recorder seven. Oh three sixteen. Levels steady.', pause: 1.2 },
        { silence: 2.5 },
        { cue: 'pilot-off', pause: 0.5 },
        { silence: 3 },
        { cue: 'pilot-on' },
      ],
      ambience: 'room',
      transcript: '[Tone, 1747 Hz.] CARTER: Recorder seven. Oh three sixteen. Levels steady. [Room tone.] [Tone, 2147 Hz.] [Silence.] [Tone, 1747 Hz.]',
    },
  },
  {
    id: 'EVID-P17-B',
    node: 'P17',
    kind: 'log',
    title: 'Recorder Log, Tape 7 (IR-037 p. 1)',
    description: 'The deck log for tape 7, page 1 of Incident Record 037, with its signature column and fault register.',
    source: 'Auditorium stage terminal',
    custodian: 'Bureau of Continuity Records',
    date: '1994-10-14',
    reliability: 'primary',
    proves: ['The stop at 03:17 is not signed: "operator did not sign"', 'The deck fault register has no entries', 'Recording resumed at 03:24, also unsigned'],
    doesNotProve: ['Who sent the stop', 'What was happening in the room between 03:17 and 03:24', 'Who the operator was'],
    relates: [
      { to: 'EVID-P17', kind: 'corroborates', note: 'The audio carries the stop pilot the specification ties to a received stop.' },
      { to: 'EVID-P14', kind: 'explains', note: 'This is the first of the three printed pages of IR-037.' },
    ],
    condition: 'NORMAL',
    text:
      'HALDER INSTITUTE, RECORDER LOG, TAPE 7 (IR-037 p. 1 of 3). 02:48 REC ON, signed, tape 7 loaded, pilot logged. 03:16 CHECK, signed, levels steady. 03:17 STOP, not signed, operator did not sign. 03:24 REC ON, not signed, operator did not sign. Deck fault register: no entries.',
    render: {
      form: 'doc',
      stock: 'carbon',
      head: { org: 'HALDER INSTITUTE FOR CONTINUITY STUDIES', unit: 'RECORDING', form: 'RECORDER LOG', control: 'IR-037 P.1', revision: '' },
      title: 'RECORDER LOG · TAPE 7',
      fields: [['DECK', 'NEXUS ANALOGUE'], ['DATE', '13–14 OCT 1994']],
      blocks: [
        { t: 'table', cols: ['TIME', 'EVENT', 'SIGNED', 'NOTE'], widths: [0.14, 0.18, 0.14, 0.54], hi: [2], rows: [
          ['02:48', 'REC ON', 'yes', 'tape 7 loaded, pilot logged'],
          ['03:16', 'CHECK', 'yes', 'levels steady'],
          ['03:17', 'STOP', 'NO', 'operator did not sign'],
          ['03:24', 'REC ON', 'NO', 'operator did not sign'],
        ] },
        { t: 'gap', h: 10 },
        { t: 'p', text: 'DECK FAULT REGISTER: no entries.' },
        { t: 'stamp', text: 'IR-037 · PAGE 1 OF 3', color: 'blue', rot: 4, dx: 280, dy: -120 },
      ],
      foot: 'HALDER REGISTRY · RET 30Y · PAGE 1 OF 3',
      damage: null,
    },
  },

  /* ───── P17b ───── */
  {
    id: 'EVID-P17B',
    node: 'P17b',
    kind: 'note',
    title: 'Etched Strip: Transcription and Tool-Issue Slip',
    description: 'A transcription of the copper strip in the auditorium basement with its decoding steps, and the Facilities tool-issue slip for the tape and scribe.',
    source: 'Auditorium basement archive, concrete pillar',
    custodian: 'Estates Facilities',
    date: '1994-10-17',
    reliability: 'derived',
    proves: ['The strip’s 25 letters decode by a three-rail fence then Atbash to a sentence', 'The tape and scribe were issued to TECH-11 on 17 Oct 1994'],
    doesNotProve: ['That TECH-11 himself etched the strip (the slip shows only that he was issued the means)', 'What the doors are, or which doors are meant', 'Why the clocks are to be left alone'],
    relates: [
      { to: 'EVID-P17', kind: 'precedes', note: 'The person who left the message is the one who handled the tape the stop affected.' },
      { to: 'EVID-P09', kind: 'explains', note: 'A building where one clock runs four hours out of true.' },
    ],
    condition: 'NORMAL',
    text:
      'STRIP AS ETCHED: XGWHGOHLMGVLIMGSXLPFSLLVX (25 letters). Rail fence, 3 rails (7, 12, 6): XLFMGGSVWLLIHMLGGSVXOLXPH. Atbash: COUNTTHEDOORSNOTTHECLOCKS. Read: COUNT THE DOORS NOT THE CLOCKS. FACILITIES TOOL-ISSUE SLIP FT-94-117, 17 OCT 1994. Issued to TECH-11: 1 reel copper tape 25 mm, 1 scribe. Use: notice, auditorium basement pillar. Text length: 25 characters, 6 words, no spaces.',
    render: {
      form: 'note',
      stock: 'card',
      head: null,
      title: 'FT-94-117 · TOOL ISSUE · FACILITIES',
      fields: [['DATE', '17 OCT 1994'], ['ISSUED TO', 'TECH-11']],
      blocks: [
        { t: 'mono', lines: ['1 reel copper tape 25 mm', '1 scribe', 'USE: notice, aud. basement pillar', 'TEXT: 25 characters, 6 words, no spaces'] },
        { t: 'gap', h: 8 },
        { t: 'mono', lines: ['STRIP: XGWHGOHLMGVLIMGSXLPFSLLVX', 'FENCE: XLFMGGSVWLLIHMLGGSVXOLXPH', 'ATBASH: COUNT THE DOORS NOT THE CLOCKS'] },
        { t: 'hand', text: 'unfolded by the unit', dx: 40, dy: 6, rot: -2, color: 'blue' },
      ],
      foot: 'FACILITIES · TOOL ISSUE · UNIT ANNOTATION',
      damage: null,
    },
  },

  /* ───── P18 ───── */
  {
    id: 'EVID-P18',
    node: 'P18',
    kind: 'document',
    title: 'Incident Record 037: Item Key',
    description: 'Key sheet KS-037 resolved against the NX-037 stock card and personnel annex.',
    source: 'Library reading room, fifth-symbol lock',
    custodian: 'Investigating unit',
    date: '2026-10-07',
    reliability: 'derived',
    proves: ['Items 1-3 are the recorder log (tape 7), the operations ledger extract and photograph B-07, with printed pages 1 to 3', 'Item 4 is a person, cited by reference to line 05 of the NX-037 personnel annex, with no printed page', 'Annex line 05 is the project lead, withdrawn from the roster on 19 Oct 1994'],
    doesNotProve: ['What became of the person after the withdrawal', 'Who decided that persons would not be printed', 'Why this person was cited by number and not by name'],
    relates: [
      { to: 'EVID-P14', kind: 'derives', note: 'Resolves the numbered rows of the index.' },
      { to: 'EVID-P15', kind: 'derives', note: 'Boxes 1-3 are the boxes signed out on 09 Oct.' },
      { to: 'EVID-P17-B', kind: 'derives', note: 'Item 1 is the log on page 1.' },
    ],
    condition: 'NORMAL',
    text:
      'ITEM KEY (compiled from KS-037 and the NX-037 stock card). Item 1: recorder log, tape 7, printed p. 1. Item 2: operations ledger, extract, printed p. 2. Item 3: photograph B-07, print, printed p. 3. Item 4: a person withdrawn from the project roster by this record, cited SUBJ-nn with nn the line on the personnel annex (box 3); no page printed. Annex line 05: VEY, L.M., Project Lead, WITHDRAWN 19 OCT 1994. Item 4 = SUBJ-05. Boxes: 1 operations ledger, 2 photographic print B-07, 3 personnel annex; no box 4.',
    render: {
      form: 'doc',
      stock: 'bond',
      head: { org: 'INVESTIGATING UNIT', unit: 'CASE FILE', form: 'ITEM KEY', control: 'IK-037', revision: '' },
      title: 'IR-037 · WHAT THE ITEMS ARE',
      fields: [['FROM', 'KS-037 + STOCK CARD'], ['ANNEX', 'NX-037 BOX 3']],
      blocks: [
        { t: 'table', cols: ['ITEM', 'WHAT', 'PAGE', 'BOX'], widths: [0.12, 0.5, 0.18, 0.2], hi: [3], rows: [
          ['1', 'TAPE 7 (recorder log)', 'p. 1', '—'],
          ['2', 'LEDGER (extract)', 'p. 2', 'box 1'],
          ['3', 'PHOTO B-07 (print)', 'p. 3', 'box 2'],
          ['4', 'SUBJ-05 (a person)', 'none', 'box 3, annex line 05'],
        ] },
        { t: 'gap', h: 10 },
        { t: 'p', text: 'Annex line 05: VEY, L.M., Project Lead. WITHDRAWN 19 OCT 1994. Persons are not reproduced.' },
      ],
      foot: 'UNIT FILE · PAGE 1 OF 1',
      damage: null,
    },
  },

  /* ───── P19 ───── */
  {
    id: 'EVID-P19',
    node: 'P19',
    kind: 'note',
    title: 'Work Order Scrap WO-94-1014-11',
    description: 'A torn scrap of a Facilities work order assigned to TECH-11, with one pencil entry.',
    source: 'Sculpture garden',
    custodian: 'Estates Facilities',
    date: '1994-10-14 03:50',
    reliability: 'primary',
    proves: ['A work order was raised at 03:50 on 14 Oct 1994 and assigned to TECH-11', 'The pencil entry reads "T7 down the shaft, not the duct"'],
    doesNotProve: ['That the order was carried out', 'Who wrote the pencil entry (the signature line is torn away)', 'What lies at the bottom of the shaft'],
    relates: [
      { to: 'EVID-P17-B', kind: 'explains', note: 'The tape halted at 03:17 on the deck log.' },
      { to: 'EVID-P18', kind: 'explains', note: 'T7 is item 1 of the incident record, tape 7.' },
    ],
    condition: 'TORN',
    text:
      'FACILITIES WORK ORDER WO-94-1014-11 (lower part of sheet; upper part missing). ASSIGNED: TECH-11. RAISED: 14 OCT 1994 03:50. SITE: Admin Building, ground floor. ENTRY (pencil): T7 down the shaft, not the duct. SIGNATURE: torn away.',
    render: {
      form: 'doc',
      stock: 'carbon',
      head: null,
      title: 'FACILITIES · WORK ORDER (LOWER PART)',
      fields: [['ORDER', 'WO-94-1014-11'], ['ASSIGNED', 'TECH-11'], ['RAISED', '14 OCT 1994 03:50'], ['SITE', 'ADMIN BLDG, GROUND FLOOR']],
      blocks: [
        { t: 'gap', h: 14 },
        { t: 'hand', text: 'T7 down the shaft, not the duct.', dx: 24, dy: 0, rot: -2, color: 'black' },
        { t: 'gap', h: 30 },
        { t: 'p', text: 'SIGNATURE:' },
      ],
      foot: 'FACILITIES · WORK ORDER · SCRAP',
      damage: { kind: 'TORN' },
    },
  },
]
