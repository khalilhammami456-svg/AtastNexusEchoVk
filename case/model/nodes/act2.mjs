// ACT II — PATTERN. She prepared; she came back by a way the badges do not see.
// P06 P07 P08 P09 P10 P11 P12

export const newFacts = [
  'Library reference desk is staffed by J. Okoro, 09:00–17:45 building time on 17 Oct 2024; desk closed 17:45, public areas locked 18:00, no evening opening.',
  'Library circulation: server host LIBSRV-01; slips 44709, 44714, 44716, 44721 on 17 Oct (server stamps 13:08, 14:30, 17:20, 21:22). Cards: 0233 reference desk staff, 0412 Reading Room day reader, 0617 L.V. (staff card issued 2021). Slip 44721 = item #06, card 0617, OUT 21:22:14 server time, no IN.',
  'Restricted-case lending ledger (R2): entry numbers equal stack-index numbers; #06 = drawing set A-201-G (issues 01 02 03, lent whole), shelf R2-06. Earlier lines on entry #06: Estates office 14/02/2022, Facilities 03/05/2023.',
  'Halder drawing register: A-201-G issues are 01 JUN 1974, 02 AUG 1991, 03 MAR 1995 (issue 03 drawn after the 1994 night; sheet date 14 MAR 1995). Other sets: A-101-G, A-202-G (R2-07), A-310-S (R2-08).',
  'Master clock channels: I lobby tower face (hand-set, held since 17 Oct 22:45), II guard desk, III access control, IV camera banks, V door sensors, VI building controls, VII LIB-SRV (+04:00:00, last sync 14 SEP 2021, free-run after sync-link fault ticket MT-21-0877), VIII TOWER BELL +00:00:00, last sync 18 OCT 03:00, OK. Sync table printed 18 Oct 2024 07:10. The channel-selector hand rests on the channel last under inspection.',
  'Route legend on A-201-G issue 03: ALPHA public corridors (black, a line), BETA stairs (green, spurs), GAMMA lifts (red, shafts), DELTA service routes (blue, a network of nine junctions linking plant, ground floor and lower ground).',
  'Door categories: PA public, RS restricted staff, HS heavy service (card + key group KP), LS light service (blue; mortice, cut key, key group KM = maintenance key, four numbered sets held by Facilities, no reader, not on access control), FE fire exit.',
  'Door schedule (issue 03): archways A-031-ARC (GF, ALPHA, grid E1), S01-TUN (GF, DELTA, grid W3, west spine beside Hall 214 foyer door A-214-D1 at W4), S06-TUN (LG, DELTA, grid P2). Lower-ground plant corridor P1 stair, P2 recess, P3 door P-PLT-D3.',
  'Archive index card, Cabinet 3 drawer 2: F-1 is a one-leaf handwritten note, deposited by L.V. 2021, countersigned M.S., hand compared with three L.V. specimens (2019, 2020, 2021): same hand. It reads against the route legend of A-201-G issue 03.',
  'Hall 214 block: gridline to gridline 13.0 m, walls front plus rear 0.6 m, hall width 9.6 m. Issue 02: dimension line 12.4 m, screen wall at 8.1 m, rear room C214-X 4.3 m (9.6 m wide, entered from the hall only, panel P-214X). Issue 03: dimension line 8.1 m, the 4.3 m drawn as unlabelled solid fill. Panels: P-214 hall, P-214A AV store, P-214X.',
  'Facilities work order FWO-21-0431 (raised 03 Feb 2021, completed 19 Mar 2021, Estates ref EO/21/118, requested L. Vey): momentary switch under armrest row B seat 7, cable via riser R2 to panel P-214X, relay K1 drives the concealed pivot panel in the rear screen wall.',
  'Hall 214 booking of 17 Oct 2024 19:00–22:00 was made on 11 Oct 2024 by L.V., title Continuity lecture, attendees recorded: none.',
]

export const concerns = [
  'SPINE (P07) says the 21:22 stamp looks like proof she was inside "after the seal". 21:22 is before the attestation window (21:44–21:47). Written as "after the guard logged her out, before the seal".',
  'CANON/prompt say the true loan time 17:22 is "seven minutes" before she walked out. Against the guard log (17:28) it is six minutes; against CAM-01 (17:29) it is seven. Act II text says "minutes before the guard desk logged her out" and never states a number of minutes.',
  'Legacy P07 intermediateOutput says "IS:472501" but the physical LED bytes decode to IS:44721; the bytes were kept and the slip is 44721. Legacy P09 dataPayload reads the hand as XVII; the legacy whatTheySee and SPINE say VII, so VII is used.',
  'Legacy P12 evidence and clue describe a keycard under seat B7 that opens the Research Lab. SPINE says the switch under the B7 armrest opens C214-X. No keycard is mentioned in act 2; the P12 clue points to the east lab by its public door code only. If a keycard prop is physically present, P13 text should absorb it.',
  'P11 relies on the physical glowing-symbol wall being the one beside Hall 214 on the west spine (SPINE: "so the archway is the one beside it"). The Observer is asked to report their level and the doors in sight so the Operator can place it; confirm the site install matches.',
  'P10 asks the Observer for the door and the blueprint note only (legacy). No reader/no-reader detail is described as physically visible on the door, so the inference stays with the key schedule.',
]

export const nodes = [
  /* ─────────────────────────────── P06 ─────────────────────────────── */
  {
    code: 'P06',
    title: 'Entry #06',
    answer: 'A-201-G',
    alts: ['A201G', 'DRAWING A-201-G', 'DRAWING SET A-201-G', 'SET A-201-G', 'A 201 G'],
    redact: false,
    format: 'DRAWING SET REFERENCE',
    question: 'What did L.V. take out of the library on 17 October?',
    narrativeObjective:
      'Dr. Vey bound a seal at 21:47 in a building the Bureau says she left at 17:30. People who mean to return prepare before they go. Establish what she took from the library before she left.',
    observer: {
      screenTitle: 'Reference Desk Ledger',
      visualType: 'memory-recall',
      whatTheySee:
        'A bound lending ledger open at entry #06. The entry carries a borrower’s initials, L.V., and a date, 17/10/2024. The item is named by number.',
      taskPrompt:
        'Read entry #06 to your unit exactly as written: every column, and every mark in the margin. Say what the entry tells you about the borrower and the date, and what it does not tell you about the item.',
      dataPayload:
        'LEDGER, ENTRY #06\nBORROWER: L.V.\nDATE OUT: 17/10/2024\nRETURNED: blank\nThe lines above it are other borrowers. The item is given by number, not by title. Dates are DD/MM/YYYY: read them as written.',
      interactiveData: {
        requiresPuzzle: 'M01',
        recallPrompt: 'Recall what closed the record at the moment the lobby clock is holding, and whose initials bound it.',
      },
    },
    analyst: {
      screenTitle: 'Stack Index',
      visualType: 'document-forensics',
      whatTheySee: 'The library’s stack index for the restricted cases. Ledger entries are numbered with the index.',
      taskPrompt:
        'Look up the entry number your Observer reads. Report the whole line, including how the item is made up, and say what the lines either side of it are.',
      dataPayload:
        'STACK INDEX, RESTRICTED CASES (R2). The Observer holds the number. The Operator holds the register that says what a set reference means and where each set is kept.',
      interactiveData: {
        documentText:
          'LIBRARY STACK INDEX — RESTRICTED CASES (R2), extract\n\nNO.  SHELF  CONTENTS                         PARTS\n04   R2-04  Staff handbooks 1981–1996          3 vols\n05   R2-05  Estates minute book 1988–1993      1 vol\n06   R2-06  Drawing set A-201-G                issues 01 02 03\n07   R2-07  Drawing set A-202-G                issues 01 02\n08   R2-08  Drawing set A-310-S                issue 01\n09   R2-09  Equipment inventory 1979           1 vol\n\nLedger entries use the index number. A set is lent whole: all its issues travel together.',
      },
    },
    operator: {
      screenTitle: 'Drawing Register',
      visualType: 'document-forensics',
      whatTheySee: 'The Halder drawing register, listing each set, what it covers, its issues and where it is kept.',
      taskPrompt:
        'Take the set reference your Analyst reads from the index and find it in the register. Confirm it is kept where the index says, then say what the set covers and how many issues it has.',
      dataPayload:
        'The register is keyed by set reference.\nQUESTION: What did L.V. take out of the library on 17 October?\nANSWER (DRAWING SET REFERENCE): [ _ _ _ _ _ _ _ ]',
      interactiveData: {
        documentText:
          'HALDER DRAWING REGISTER (Admin + Science Bldg), extract\n\nA-101-G  Annex B, ground floor\n         issues 01 02 · held: Estates chest\nA-201-G  Admin Building, ground floor, all wings\n         issues 01 JUN 1974 / 02 AUG 1991 / 03 MAR 1995\n         held: Library, restricted stack R2-06\nA-202-G  Admin Building, first floor\n         issues 01 02 · held: Library R2-07\nA-310-S  Science Building, all floors\n         issue 01 · held: Library R2-08\n\nIssue 03 supersedes 02 for current use. Superseded issues are retained with the set.',
      },
    },
    chain: {
      observerProduces: 'The ledger entry: its number, the borrower’s initials, the date out, and that the item is named by number only.',
      analystTransforms: 'Turns the entry number into the item it stands for, using the stack index.',
      operatorExecutes: 'Checks the item against the drawing register and its shelf, and files the claim.',
    },
    failure: {
      wrongStep: 'Answering with what the set depicts, or with the borrower’s initials, instead of the reference the register uses for the set.',
      consequence: 'The claim is rejected: the register identifies a set by its reference, not by a description or a borrower.',
      recoveryGuidance: 'Use the ledger number to reach the index line, then give the reference that the register prints against that shelf.',
    },
    hints: [
      'Two records of one act can exist: one names who took something, another names what was taken. This question needs the second.',
      'The Observer’s ledger holds a number. The Analyst’s index and the Operator’s register are both keyed to it, from different directions.',
      'Match the ledger number to the index line, then confirm in the register that the set named there is kept on the same shelf.',
      'A reference as the register prints it: a letter, three digits and a letter, joined by hyphens. It names the whole set, not one issue of it.',
    ],
    reveal:
      'On the day she left, Dr. Vey signed out the ground-floor plans of this building, all three issues, and did not bring them back. Whatever she did after 17:30, she studied the building first.',
    clue: {
      clueText:
        'A loan leaves two records: the one a clerk signs, and one a machine writes without being asked. The library keeps its machine in a room below the stacks that used to be something else.',
      format: 'Inference',
    },
    exhibits: ['EVID-P06'],
    uses: ['M01'],
    mech: 'document-forensics',
    solution:
      'Observer reads ledger entry #06: borrower L.V., out 17/10/2024, not returned, item given by number. Analyst finds index no. 06 = shelf R2-06 = drawing set A-201-G, issues 01 02 03, lent whole. Operator confirms in the Halder drawing register that A-201-G is the Admin Building ground-floor plan, three issues, held at Library R2-06. Answer: A-201-G.',
    redHerring: null,
    recontext: null,
  },

  /* ─────────────────────────────── P07 ─────────────────────────────── */
  {
    code: 'P07',
    title: 'The Rack',
    answer: '21:22',
    alts: ['2122', '21.22', '9:22 PM', '09:22 PM', '9:22PM', '21:22:14'],
    redact: false,
    format: 'HH:MM, 24-hour clock',
    question: 'What time does the library server stamp on L.V.’s loan of #06?',
    narrativeObjective:
      'A loan leaves a second record that nobody signs: the one the library’s own system writes. Establish what that system recorded for the drawings she took.',
    observer: {
      screenTitle: 'LED Array Reader',
      visualType: 'binary-technical',
      whatTheySee: 'Eight groups of eight blinking LEDs on the front panel of a server rack. Each group is one byte.',
      taskPrompt:
        'Read the eight groups in order, a lit LED as 1 and a dark one as 0, and give them to your Analyst one byte at a time. Say if any group is hard to read.',
      dataPayload:
        'LED ARRAY, FRONT PANEL: 8 groups of 8 LEDs, read left to right and top to bottom. Lit = 1, dark = 0. Each group is a byte. Read them in order and do not skip a group that is dark at one end.',
      interactiveData: {
        binarySequence: ['01001001', '01010011', '00111010', '00110100', '00110100', '00110111', '00110010', '00110001'],
      },
    },
    analyst: {
      screenTitle: 'Decoder and Circulation Log',
      visualType: 'document-forensics',
      whatTheySee: 'An ASCII reference and the library server’s circulation log for 17 October.',
      taskPrompt:
        'Decode the bytes your Observer reads into characters. They give you a slip number. Read that slip’s row of the log and report the item, the card and the OUT and IN stamps exactly as printed.',
      dataPayload:
        'ASCII (8-bit), the codes you need:\n0 00110000   1 00110001   2 00110010   3 00110011   4 00110100\n5 00110101   6 00110110   7 00110111   8 00111000   9 00111001\n:  00111010   I 01001001   S 01010011\nThe rack’s front-panel word is the last slip issued, written IS:nnnnn.',
      interactiveData: {
        requiresPuzzle: 'P06',
        recallPrompt: 'Recall which stack item L.V. signed out on 17 October. The log is keyed by item number.',
        documentText:
          'LIBRARY CIRCULATION — EXTRACT, 17 OCT 2024\n\nSLIP   ITEM  CARD  OUT       IN\n44709  #11   0233  13:08:07  13:41:50\n44714  #07   0412  14:30:44  15:12:03\n44716  #02   0233  17:20:31  18:02:09\n44721  #06   0617  21:22:14  —\n\nLast slip issued: 44721.\n\nlibsrv01 | time source: local rtc | ntp: unsynchronised',
      },
    },
    operator: {
      screenTitle: 'Card Register and Guard Desk',
      visualType: 'document-forensics',
      whatTheySee: 'The library’s card register and the guard-desk register entries for 17 October.',
      taskPrompt:
        'Check that the card on the Analyst’s row is hers. Then set the stamp against the guard register and against the moment the lobby clock is holding, and say where it falls. Report the stamp as the server wrote it.',
      dataPayload:
        'You hold the card register and the guard desk. The Analyst holds the log.\nQUESTION: What time does the library server stamp on L.V.’s loan of #06?\nANSWER (HH:MM, 24-hour clock): [ _ _ : _ _ ]',
      interactiveData: {
        requiresPuzzle: 'P02',
        recallPrompt: 'Recall the moment the lobby clock is holding, so you can place the stamp against it.',
        documentText:
          'LIBRARY CARD REGISTER, extract\nCARD  HOLDER\n0233  Reference desk (staff)\n0412  Reading Room, day reader\n0617  L.V. (staff, issued 2021)\n\nGUARD DESK, 17 OCT 2024, extract\n17:28  OUT  L.V. (badge, main entrance)\n21:44  QUORUM ATTEST begins (SQ-24-001)\n21:47  SQ-24-001 APPLIED  tri-attest\nNo IN entry for L.V. at the main entrance.',
      },
    },
    chain: {
      observerProduces: 'Eight bytes read off the rack, in order.',
      analystTransforms: 'Decodes the bytes to a slip number and reads that slip’s row of the circulation log.',
      operatorExecutes: 'Confirms whose card is on the row, sets the stamp against the guard register and the seal, and files the stamp.',
    },
    failure: {
      wrongStep: 'Reading the OUT time of a different row, or the IN time, or answering with a time from the guard register.',
      consequence: 'The claim is rejected: the question asks for the stamp on the one loan the rack points to.',
      recoveryGuidance: 'The slip number comes from the lights, not from the item number. Read the OUT stamp on that slip’s row, in hours and minutes.',
    },
    hints: [
      'This is a lookup: a number on the rack points to one row of a log. The question is what the log wrote.',
      'The Observer’s lights and the Analyst’s table give you the slip. The Analyst’s log gives you the row. The Operator can say whether the card on the row is hers.',
      'Decode the eight bytes to characters; the digits after the colon are a slip number. Find that slip in the log and read its OUT stamp.',
      'Hours and minutes on a 24-hour clock, as the log prints them; leave the seconds off. Report what the server wrote.',
    ],
    reveal:
      'The library’s server stamped the loan of the drawings at 21:22, hours after the guard desk logged her out and not long before the seal. If that stamp stands, she was back at a library desk that evening.',
    clue: {
      clueText:
        'If she took a building plan to plan something, she wrote down which way she meant to go. Her 2021 project papers are filed in the archive hall, in the third cabinet.',
      format: 'Inference',
    },
    exhibits: ['EVID-P07'],
    uses: ['P06', 'P02'],
    mech: 'correlation',
    solution:
      'Observer reads bytes 01001001 01010011 00111010 00110100 00110100 00110111 00110010 00110001. Analyst decodes with ASCII: I S : 4 4 7 2 1, so IS:44721, the last slip issued. Circulation row 44721 is item #06, card 0617, OUT 21:22:14, no IN. Operator confirms card 0617 is L.V. and notes the guard register has her OUT at 17:28 with no IN. The question asks for the stamp: 21:22. The log’s own footer says the host’s time source is a local RTC and NTP is unsynchronised; the team has no offset yet (P09).',
    redHerring: {
      id: 'RH-LIB-2122',
      theory: 'She re-entered the building and borrowed the drawings at 21:22, after the guard logged her out and before the seal.',
      refutedBy: 'EVID-P09: the library server runs +04:00:00 from building time, so the stamp is 17:22; the reference desk was staffed until 17:45 and shut for the evening.',
    },
    recontext: null,
  },

  /* ─────────────────────────────── P08 ─────────────────────────────── */
  {
    code: 'P08',
    title: 'Two Ways',
    answer: 'DELTA',
    alts: ['ROUTE DELTA', 'DELTA ROUTE', 'CLASS DELTA', 'THE DELTA ROUTE'],
    redact: false,
    format: 'ONE WORD (a route class)',
    question: 'Which route class does Vey’s note choose?',
    narrativeObjective:
      'A note in her hand offers two directions and picks one. The plans she borrowed sort every route in the building into classes. Establish which class her note is telling the reader to take.',
    observer: {
      screenTitle: 'Fragment 1 Display',
      visualType: 'memory-recall',
      whatTheySee: 'The screen on the front of the cabinet shows a short text headed Fragment 1.',
      taskPrompt:
        'Read the fragment aloud, word for word, as often as your unit asks. Say if anything else is on the screen, and whether the text is signed or dated.',
      dataPayload:
        'CABINET SCREEN, FRAGMENT 1:\n“The path diverges. One direction is a straight line; the other, a network. Choose the network.”',
    },
    analyst: {
      screenTitle: 'Route Legend',
      visualType: 'document-forensics',
      whatTheySee: 'The route legend from the notes sheet of the ground-floor plan, issue 03.',
      taskPrompt:
        'Read each route class with the form the legend gives it: what it looks like on the plan. Report all four before you say which one the Observer’s text points to.',
      dataPayload:
        'The legend defines every route on the plan by class, colour and form. The note’s words are the Observer’s; the shapes are yours.',
      interactiveData: {
        documentText:
          'A-201-G ISSUE 03 — NOTES SHEET 1 — ROUTE LEGEND\n\nCLASS  ROUTES            COLOUR  FORM\nALPHA  public corridors  black   LINE: one E–W run per level, no branching\nBETA   stairs            green   SPURS: single flights, each serving two levels\nGAMMA  lifts             red     SHAFTS: two, independent\nDELTA  service routes    blue    NETWORK: branching, nine junctions; links plant, ground floor and lower ground\n\nA junction is a point where three or more routes meet.',
      },
    },
    operator: {
      screenTitle: 'Cabinet Index Card',
      visualType: 'document-forensics',
      whatTheySee: 'The archive’s index card for the 2021 project folder, with a hand comparison made when the note was deposited.',
      taskPrompt:
        'Establish whose words these are and which drawing they were meant to be read against. Then set the Observer’s text against the Analyst’s legend and report which class it describes.',
      dataPayload:
        'The card says who deposited the note and what it reads against.\nQUESTION: Which route class does Vey’s note choose?\nANSWER (ONE WORD, a route class): [ _ _ _ _ _ ]',
      interactiveData: {
        requiresPuzzle: 'P06',
        recallPrompt: 'Recall which drawing set L.V. signed out on 17 October. The card refers to a set.',
        documentText:
          'ARCHIVE — CABINET 3, DRAWER 2\nINDEX CARD, 2021 PROJECT FOLDER\n\nF-1  Note, one leaf, handwritten. Deposited L.V., 2021. Countersigned M.S.\n     The wording on the cabinet screen is a transcription of the leaf.\n     Reads against the route legend of drawing set A-201-G, issue 03 (current issue at deposit).\n\nHAND COMPARISON, F-1 against three L.V. specimens (2019, 2020, 2021):\n     crossed 7: agrees\n     closed a: agrees\n     L.V. with both stops: agrees\nExaminer: M.S.   Result: same hand.',
      },
    },
    chain: {
      observerProduces: 'The wording of Fragment 1 as displayed, and anything else on the screen.',
      analystTransforms: 'The legend’s definition of each route class by its form.',
      operatorExecutes: 'Authenticates the note, ties it to the right issue of the plans, and matches its wording to a class.',
    },
    failure: {
      wrongStep: 'Choosing a class by how familiar it is, or by the name of the route people use every day, rather than by the form the legend gives it.',
      consequence: 'The claim is rejected: the note contrasts two forms and the legend assigns forms to classes.',
      recoveryGuidance: 'Take the form the note asks for and read which class the legend gives it. Check the card for the issue the legend must come from.',
    },
    hints: [
      'A note that offers two directions names a kind of route, not a place. What kinds exist is a matter for the plans.',
      'The Observer holds the wording. The Analyst’s legend defines each class by its shape. The Operator can say whose words these are and which drawing they read against.',
      'The note contrasts a line with a network. Read the form given to each class in the legend and take the class whose form is the second.',
      'One word: the class name exactly as the legend prints it. It is not the class drawn as a single run.',
    ],
    reveal:
      'Her note chooses the service network over the public corridors: Route Delta, the blue routes on the plans she borrowed. It is not a route the building shows to anyone who simply walks in.',
    clue: {
      clueText:
        'A route is walked at a time, and times only mean something if the clocks agree. One room in this building makes them agree, and its dial is numbered in Roman.',
      format: 'Inference',
    },
    exhibits: ['EVID-P08'],
    uses: ['P06'],
    mech: 'spatial',
    solution:
      'Observer reads Fragment 1: a straight line against a network, choose the network. Analyst reads the issue 03 legend: ALPHA corridors are a LINE, BETA stairs SPURS, GAMMA lifts SHAFTS, DELTA service routes a NETWORK with nine junctions. Operator confirms from the index card that F-1 is in L.V.’s hand (three specimens agree, countersigned M.S.) and reads against the A-201-G issue 03 legend, the set she took out in P06. Answer: DELTA.',
    redHerring: null,
    recontext: null,
  },

  /* ─────────────────────────────── P09 ─────────────────────────────── */
  {
    code: 'P09',
    title: 'The Master Clock',
    answer: '17:22',
    alts: ['1722', '17.22', '5:22 PM', '05:22 PM', '5:22PM', '17:22:14'],
    redact: true,
    format: 'HH:MM, 24-hour clock (building time)',
    question: 'What was the true building time of the loan of #06?',
    narrativeObjective:
      'Two clocks cannot both be right about one moment. The library’s system gave a time for the loan of the drawings. Establish when the loan really happened by the building’s own time.',
    observer: {
      screenTitle: 'Master Clock Dial',
      visualType: 'spatial',
      whatTheySee: 'A clock face with Roman numerals and a single hand. The hand rests at VII.',
      taskPrompt:
        'Report the numeral the hand rests on, and say whether the hand moves while you watch. Read any plate, label or engraving on the dial or its case exactly as it is written.',
      dataPayload:
        'MASTER CLOCK, DIAL: Roman numerals I to XII, one hand, resting at VII.\nThe numeral is a position on the dial, not an hour. Report it as it is printed and do not convert it.',
    },
    analyst: {
      screenTitle: 'Sync Table',
      visualType: 'document-forensics',
      whatTheySee: 'The master clock’s output channels: every sink the clock drives, with its offset from the master.',
      taskPrompt:
        'Read the row for the numeral your Observer gives. Report the sink, the offset with its sign, the convention the sign follows, the last sync and the state. Read the first row as well and say whether it can serve as a reference.',
      dataPayload:
        'The table is keyed by dial numeral. The selector hand is left on the channel last under inspection. The master is building time.',
      interactiveData: {
        requiresPuzzle: 'P02',
        recallPrompt: 'Recall what the lobby clock is holding and how it came to be set, so you know whether its row is a reference.',
        documentText:
          'MASTER CLOCK — OUTPUT CHANNELS\nPrinted 18 OCT 2024 07:10, Plant office\nMaster = building time. OFFSET = sink minus master.\n\nCH    SINK                OFFSET     LAST SYNC     STATE\nI     LOBBY TOWER FACE    hand-set   —             HELD 17 OCT 22:45 (LC-01)\nII    GUARD DESK          +00:00:00  18 OCT 03:00  OK\nIII   ACCESS CONTROL      +00:00:00  18 OCT 03:00  OK\nIV    CAMERA BANKS        +00:00:00  18 OCT 03:00  OK\nV     DOOR SENSORS        +00:00:00  18 OCT 03:00  OK\nVI    BUILDING CONTROLS   +00:00:00  18 OCT 03:00  OK\nVII   LIB-SRV             +04:00:00  14 SEP 2021   FREE-RUN\nVIII  spare               —          —             —',
      },
    },
    operator: {
      screenTitle: 'Desk Hours and Guard Register',
      visualType: 'document-forensics',
      whatTheySee: 'The reference desk’s shift sheet for 17 October and the guard-desk entry for her departure.',
      taskPrompt:
        'Take the stamp your unit found on the loan and the correction your Analyst reads, apply it, and test the result against the desk hours and the guard register before you submit.',
      dataPayload:
        'The shift sheet and the guard register are kept by two different offices.\nQUESTION: What was the true building time of the loan of #06?\nANSWER (HH:MM, 24-hour clock, building time): [ _ _ : _ _ ]',
      interactiveData: {
        requiresPuzzle: 'P07',
        recallPrompt: 'Recall the time the library server stamped on the loan of the drawings.',
        documentText:
          'REFERENCE DESK — SHIFT SHEET, 17 OCT 2024\nDesk staffed: J. Okoro, 09:00 to 17:45\nDesk closed 17:45. Public areas locked 18:00.\nNo evening opening.\n\nGUARD DESK, 17 OCT 2024, extract\n17:28  OUT  L.V. (badge, main entrance)\nNo IN entry for L.V. at the main entrance.\n\nShift sheet and guard register are both kept in building time.',
      },
    },
    chain: {
      observerProduces: 'The numeral the master clock’s hand rests on, as printed.',
      analystTransforms: 'Reads that channel’s offset, its sign convention and its last sync.',
      operatorExecutes: 'Applies the correction to the stamp and tests the result against two independent records.',
    },
    failure: {
      wrongStep: 'Adding the offset instead of removing it, or reading the dial numeral as a time of day.',
      consequence: 'The claim is rejected: the result lands in the small hours of the next day, when the desk was shut and the library locked.',
      recoveryGuidance: 'The offset is the sink minus the master. Work out which way to move the sink’s stamp to get the master, then test it against the desk hours.',
    },
    hints: [
      'A clock that disagrees with the reference is not a witness to the moment, only to itself. Ask which one is the reference and by how much the other is wrong.',
      'The Observer’s dial picks a row of the Analyst’s table. The Operator holds the stamp you already found and two records that bound the day.',
      'Read the offset for the channel the hand rests on and the sign convention printed above the table. Apply it to the stamp to get building time, then test the result against the desk hours and the guard register.',
      'Hours and minutes, 24-hour clock, building time. It must fall inside the hours the reference desk was staffed and before the guard desk logged her out.',
    ],
    reveal:
      'The library server runs four hours ahead of the building and has since 2021. Its evening stamp is the building’s late afternoon: minutes before the guard desk logged her out. She took the plans on her way out.',
    clue: {
      clueText:
        'The route she chose is drawn in a single colour on the plans she took. A door in this building carries the same mark.',
      format: 'Inference',
    },
    exhibits: ['EVID-P09'],
    uses: ['P07', 'P02'],
    mech: 'clock-offset',
    solution:
      'Observer reports the hand at VII. Analyst reads channel VII: LIB-SRV, offset +04:00:00 (sink minus master), last sync 14 SEP 2021, free-run; the lobby row is hand-set and held, so it is no reference (P02). Operator takes the P07 stamp 21:22:14, subtracts 04:00:00 to get 17:22:14 building time, and checks: the desk was staffed until 17:45 (21:22 would be a locked library) and the guard logged L.V. OUT at 17:28. Answer: 17:22. This refutes the P07 theory that she re-entered and borrowed the plans at 21:22.',
    redHerring: null,
    recontext: {
      what: 'When she took the drawings',
      from: 'The library server puts the loan at 21:22, after the guard desk logged her out, so she must have come back.',
      to: 'The loan was at 17:22 building time, minutes before she left. The stamp was never evidence of a return.',
    },
  },

  /* ─────────────────────────────── P10 ─────────────────────────────── */
  {
    code: 'P10',
    title: 'The Blue Line',
    answer: 'MAINTENANCE KEY',
    alts: ['MAINTENANCE', 'MAINTENANCE KEYS', 'A MAINTENANCE KEY', 'FACILITIES KEY', 'KEY GROUP KM'],
    redact: false,
    format: 'TWO WORDS (a kind of key)',
    question: 'What kind of key opens a blue door?',
    narrativeObjective:
      'A route is only useful to someone who can open its doors, and how a door opens decides what remembers it. Establish what opens the doors the plans mark in blue.',
    observer: {
      screenTitle: 'Blueprint Examination',
      visualType: 'document-forensics',
      whatTheySee: 'A blueprint with a note in the margin: BLUE = LIGHT. A door close by is marked blue.',
      taskPrompt:
        'Read the margin note exactly as written, including any marks around it. Then describe the blue door: its frame, anything fixed to it, anything beside it. Report only what you can see.',
      dataPayload:
        'BLUEPRINT MARGIN: “BLUE = LIGHT”.\nThe note is a legend entry: it says what the colour stands for, in the plan’s own terms. Report the door as you see it and do not infer how it opens.',
    },
    analyst: {
      screenTitle: 'Colour Legend',
      visualType: 'document-forensics',
      whatTheySee: 'The colour legend for routes and doors from the plans she took out.',
      taskPrompt:
        'Turn the margin note into a door category with the legend, and report the category code. Check that the route class on that row is the one the note chose.',
      dataPayload:
        'The legend gives every colour a route class and a category code. The Operator’s schedule is keyed by category code, not by colour.',
      interactiveData: {
        requiresPuzzle: 'P08',
        recallPrompt: 'Recall which route class Vey’s note chose. The legend lists doors by class and colour.',
        documentText:
          'A-201-G ISSUE 03 — COLOUR LEGEND, ROUTES AND DOORS\n\nCOLOUR  ROUTE CLASS         SERVICE LEVEL  CODE\nBLACK   ALPHA corridors     PUBLIC         PA\nGREEN   BETA stairs         PUBLIC         PA\nRED     GAMMA lifts         STAFF          RS\nBLUE    DELTA service       LIGHT          LS\nGREY    plant and goods     HEAVY          HS\n\nLIGHT service: personnel only, no goods. HEAVY service: goods and plant.\nFire exits are drawn in outline with no colour (code FE).',
      },
    },
    operator: {
      screenTitle: 'Key Schedule',
      visualType: 'document-forensics',
      whatTheySee: 'The Estates key schedule for the Admin Building, keyed by door category.',
      taskPrompt:
        'Take the category code your Analyst reads and find its row. Report how that category is locked, whether it has a reader and who holds the keys. Read the remark at the foot before you answer.',
      dataPayload:
        'The schedule is keyed by category code.\nQUESTION: What kind of key opens a blue door?\nANSWER (TWO WORDS, a kind of key): [ _ _ _ _ _ _ _ _ _ _ _   _ _ _ ]',
      interactiveData: {
        documentText:
          'ESTATES — KEY SCHEDULE, ADMIN BUILDING (2021 re-key)\n\nCODE  CATEGORY          LOCK                   READER  KEY / HOLDERS\nPA    public            latch, card reader     YES     card, all staff\nRS    restricted staff  card reader + PIN      YES     card and PIN\nHS    heavy service     card reader + cut key  YES     card + key group KP (Estates)\nLS    light service     mortice, cut key       NONE    key group KM = maintenance key (Facilities, four numbered sets)\nFE    fire exit         push-bar, alarm        NONE    —\n\nRemark: doors with no reader are not on the access-control system and are not logged.',
      },
    },
    chain: {
      observerProduces: 'The margin note as written, and the door as it looks.',
      analystTransforms: 'Turns the colour and the word into a door category with the legend.',
      operatorExecutes: 'Reads that category’s lock and keyholders in the schedule and files the claim.',
    },
    failure: {
      wrongStep: 'Answering with the colour, the category code or the word in the margin, or with the lock of a category that has no reader but is not keyed.',
      consequence: 'The claim is rejected: the question asks for a kind of key, and only one category is opened by a cut key with no reader.',
      recoveryGuidance: 'Follow the colour to its category code, the code to its row in the schedule, and give the key as the schedule names it.',
    },
    hints: [
      'Doors are sorted by who is meant to use them. How a door opens decides what record of its opening can exist.',
      'The Observer reads a colour and a word. The Analyst’s legend turns them into a category. The Operator’s schedule says how each category is locked.',
      'Take the category the legend gives for the colour, then read the lock and holders on that row. Weigh it against the other row that has no reader: the question asks about a key.',
      'Two words: the kind of key, as the schedule names it. It is neither a card nor a code.',
    ],
    reveal:
      'Doors on the service route open to a cut key held by the people who maintain the building, and they have no reader. A person can use them freely and the access-control log will show nothing at all.',
    clue: {
      clueText:
        'A route with no record at its doors still has a beginning. The place where it starts is marked on a wall, and the mark glows.',
      format: 'Inference',
    },
    exhibits: ['EVID-P10'],
    uses: ['P08'],
    mech: 'chain-of-custody',
    solution:
      'Observer reads BLUE = LIGHT beside a blue-marked door. Analyst uses the A-201-G issue 03 colour legend: BLUE is the DELTA service route, service level LIGHT, category LS. Operator reads the Estates key schedule row for LS: mortice lock, cut key, no reader, key group KM = maintenance key, Facilities holds four numbered sets; the remark says doors with no reader are not on the access-control system. FE also has no reader but has no key. Answer: MAINTENANCE KEY.',
    redHerring: null,
    recontext: null,
  },

  /* ─────────────────────────────── P11 ─────────────────────────────── */
  {
    code: 'P11',
    title: 'The Archway',
    answer: 'S01-TUN',
    alts: ['S01', 'S01 TUN', 'S-01', 'S01TUN', 'DOOR S01-TUN'],
    redact: false,
    format: 'DOOR ID',
    question: 'Which door ID is behind the marked archway?',
    narrativeObjective:
      'Every opening on a plan has an identity, and the blue symbol hangs over one. Establish which door lies behind the archway it marks.',
    observer: {
      screenTitle: 'Symbol Context Reader',
      visualType: 'visual',
      whatTheySee: 'A glowing blue symbol, ⟁, set in the wall above a stone archway.',
      taskPrompt:
        'Describe the symbol, its colour and what it sits above. Then tell your unit which level you are standing on and which other doors you can see from the wall.',
      dataPayload:
        'SYMBOL: ⟁, glowing blue, above a stone archway.\nReport the level you are on and every other door you can see from the wall. The Operator’s plan will ask.',
    },
    analyst: {
      screenTitle: 'Door Schedule',
      visualType: 'document-forensics',
      whatTheySee: 'The door schedule of the ground-floor plan, issue 03, with each opening’s type, level, route class and gridline.',
      taskPrompt:
        'List every archway in the schedule with its route class, level and gridline. Report all of them before you filter by anything the Observer or the Operator says.',
      dataPayload:
        'Archways are the recessed stone openings. Level GF is ground floor and LG is lower ground. Route class is the class from the legend of the plans.',
      interactiveData: {
        requiresPuzzle: 'P08',
        recallPrompt: 'Recall which route class Vey’s note chose. The schedule is filtered by route class.',
        documentText:
          'A-201-G ISSUE 03 — DOOR SCHEDULE (extract)\n\nID         TYPE        LEVEL  ROUTE  GRID\nA-214-D1   hall door   GF     ALPHA  W4\nA-CAB-D1   hall door   GF     ALPHA  E3\nA-031-ARC  archway     GF     ALPHA  E1\nS01-TUN    archway     GF     DELTA  W3\nS06-TUN    archway     LG     DELTA  P2\nP-PLT-D3   plant door  LG     —      P3\n\nGrid: W = west spine, E = east wing, P = plant corridor.',
      },
    },
    operator: {
      screenTitle: 'Ground-Floor Plan, West Spine',
      visualType: 'document-forensics',
      whatTheySee: 'The west spine of the ground-floor plan, issue 03, with its gridlines, and the lower-ground plant corridor.',
      taskPrompt:
        'Ask your Observer which level they stand on and which doors they can see from the wall. Place the symbol on a gridline of your plan and report the gridline and the nearest door.',
      dataPayload:
        'A-201-G ISSUE 03, GROUND FLOOR, WEST SPINE, from the lobby end:\nW1 lobby end\nW2 stair\nW3 recess, service-route ring\nW4 foyer door A-214-D1, Hall 214\nLOWER GROUND, PLANT CORRIDOR: P1 stair, P2 recess, P3 door P-PLT-D3.\nQUESTION: Which door ID is behind the marked archway?\nANSWER (DOOR ID): [ _ _ _ _ _ _ _ ]',
      interactiveData: {
        requiresPuzzle: 'P10',
        recallPrompt: 'Recall what kind of key opens a blue door. The plan draws the service route’s openings in the same colour.',
      },
    },
    chain: {
      observerProduces: 'The symbol, its colour, what it sits over, the level, and the doors in sight.',
      analystTransforms: 'Lists the archways in the schedule with route class, level and gridline.',
      operatorExecutes: 'Places the symbol on a gridline of the plan and matches that gridline to a row of the schedule.',
    },
    failure: {
      wrongStep: 'Picking the archway on the public route, or the service archway on the wrong level, instead of the one that satisfies both the colour and the gridline.',
      consequence: 'The claim is rejected: two of the three archways fail one test or the other.',
      recoveryGuidance: 'Keep only the archways on the route the colour stands for, then keep only the one at the gridline the plan gives the symbol’s wall.',
    },
    hints: [
      'A symbol over an opening is a marker, and a schedule lists openings by identity. The job is to choose one row out of several that look alike.',
      'The Observer reports what and where. The Analyst’s schedule filters by route and level. The Operator’s plan says which gridline the symbol’s wall belongs to.',
      'Keep the archways on the route class the colour stands for. Of those, keep the one whose gridline the plan puts beside the lecture hall’s door.',
      'A door ID exactly as the schedule prints it: letters and digits, with a hyphen. It is not the lecture hall’s door.',
    ],
    reveal:
      'The glowing symbol marks the head of the service route: a recessed door on the ground-floor west spine, a few steps from the lecture hall. The key schedule says nobody logs it.',
    clue: {
      clueText:
        'The archway sits next to a lecture hall whose bay number you read in the directory on the first day. A hall has seats, and a seat is somewhere a person chose.',
      format: 'Inference',
    },
    exhibits: ['EVID-P11'],
    uses: ['P10', 'P08'],
    mech: 'identity',
    solution:
      'Observer reports a blue ⟁ above a stone archway on the ground floor with a lecture-hall door in sight. Analyst lists three archways: A-031-ARC (GF, ALPHA, E1), S01-TUN (GF, DELTA, W3), S06-TUN (LG, DELTA, P2). Blue is the service route, class DELTA (P08, P10), which removes A-031-ARC. Operator places the symbol at W3 on the ground-floor west spine, beside A-214-D1 at W4, which removes the lower-ground archway. The schedule row for W3 is S01-TUN. Answer: S01-TUN.',
    redHerring: null,
    recontext: null,
  },

  /* ─────────────────────────────── P12 ─────────────────────────────── */
  {
    code: 'P12',
    title: 'The Armrest',
    answer: 'C214-X',
    alts: ['C214X', 'C214 X', 'ROOM C214-X', 'ROOM C214X'],
    redact: false,
    format: 'ROOM CODE',
    question: 'Which room does the armrest switch at seat B7 open?',
    narrativeObjective:
      'A seat in a lecture hall carries her initials. A switch is wired to something, and a drawing either admits that something exists or does not. Establish what the switch under that armrest is connected to.',
    observer: {
      screenTitle: 'Seating Chart Viewer',
      visualType: 'observation',
      whatTheySee: 'A seating chart of Lecture Hall 214 with Row B, Seat 7 marked with the initials L.V.',
      taskPrompt:
        'Report the row letter and the seat number of the marked seat, the initials exactly as written, and whether any other seat carries a mark.',
      dataPayload:
        'SEATING CHART, LECTURE HALL 214: Row B, Seat 7 is marked “L.V.”\nThe mark is on the chart. Say what else, if anything, is written or drawn on the chart.',
    },
    analyst: {
      screenTitle: 'Work Order and Booking',
      visualType: 'document-forensics',
      whatTheySee: 'A 2021 facilities work order for the hall and the hall’s booking register for 17 October.',
      taskPrompt:
        'Read what the work order fits at the seat, where its cable goes and what the far end drives. Read the booking line for 17 October as well and say who booked it and who is recorded as attending.',
      dataPayload:
        'The work order and the booking are yours. The Operator holds two issues of the plan of the hall’s block.',
      interactiveData: {
        requiresPuzzle: 'P11',
        recallPrompt: 'Recall which door lies behind the archway and where it sits on the west spine. This hall is on the same corridor.',
        documentText:
          'FACILITIES WORK ORDER FWO-21-0431\nHALL 214 · raised 03 FEB 2021 · completed 19 MAR 2021\nEstates ref EO/21/118. Requested: L. Vey.\n\n1. Replace armrest hinges, rows A to C.\n2. Re-lamp stage lights.\n3. Fit momentary switch (normally open) under the armrest, row B seat 7. Cable via riser R2 to panel P-214X.\n4. Panel P-214X: relay K1 drives the actuator of the concealed pivot panel in the rear screen wall of the hall.\n5. Label panel.\n\nBOOKING REGISTER, HALL 214\n17 OCT 2024  19:00–22:00  booked 11 OCT by L.V.\nTitle: Continuity lecture. Attendees recorded: none.',
      },
    },
    operator: {
      screenTitle: 'Plan Comparison',
      visualType: 'document-forensics',
      whatTheySee: 'Two issues of the plan for the hall’s block: dimensions and room schedule, side by side.',
      taskPrompt:
        'Set the two issues against each other: the block, the walls, the hall, and every room named. Report what changed, what did not, and what the later issue does with the depth it no longer gives to the hall.',
      dataPayload:
        'You hold the plans. The Analyst holds the wiring.\nQUESTION: Which room does the armrest switch at seat B7 open?\nANSWER (ROOM CODE): [ _ _ _ _ _ _ ]',
      interactiveData: {
        requiresPuzzle: 'P06',
        recallPrompt: 'Recall which drawing set L.V. signed out and how many issues it holds. Both issues here come from that set.',
        documentText:
          'A-201-G — HALL 214 BLOCK, ISSUES COMPARED\n\n                              ISSUE 02       ISSUE 03\n                              AUG 1991       MAR 1995\nBlock, gridline to gridline   13.0 m         13.0 m\nWalls, front plus rear        0.6 m          0.6 m\nHall 214 width                9.6 m          9.6 m\nHall 214 depth (dimension)    12.4 m         8.1 m\n\nROOM SCHEDULE\nISSUE 02: 214 hall (panel P-214) · 214A AV store (P-214A) · C214-X rear room, entered from the hall only (panel P-214X)\nISSUE 03: 214 hall (P-214) · 214A AV store (P-214A)\n\nIssue 03 draws the area behind the hall’s rear wall as solid fill, unlabelled. Issue 02 draws a screen wall across the hall at 8.1 m.',
      },
    },
    chain: {
      observerProduces: 'The seat on the chart, the initials, and anything else on the chart.',
      analystTransforms: 'Follows the switch to the panel and the panel to the wall it moves; reads the booking.',
      operatorExecutes: 'Compares the two issues of the plan, reads what lies behind that wall on each, and files the claim.',
    },
    failure: {
      wrongStep: 'Naming the hall, the panel or the seat, or reading the change in depth as a drafting correction.',
      consequence: 'The claim is rejected: the switch opens a room, and the block’s outer dimensions did not change.',
      recoveryGuidance: 'Follow the cable to the wall it moves, then ask what the earlier issue calls the space behind that wall and whether the later issue still lists it.',
    },
    hints: [
      'A switch is wired to something. Ask what is at the other end, then ask whether the current drawings admit that it exists.',
      'The Observer holds the seat, the Analyst the wiring and the booking, the Operator two issues of one plan. Compare dimensions, not labels.',
      'Follow the switch’s panel to the wall it moves. Measure what lies behind that wall on the later issue against the earlier one, and see what the earlier issue calls the difference.',
      'A room code as printed on the older issue: a letter, three digits and a letter, hyphenated. It does not appear on the later issue.',
    ],
    reveal:
      'Hall 214 is 4.3 m shallower on the current drawings than on the issue before, yet the block outside is unchanged. The armrest switch at her seat opens a room the Institute drew once and then removed from the record.',
    clue: {
      clueText:
        'The room the drawings dropped was used for something. The laboratory whose door code is cut into the steps outside the entrance is in another building.',
      format: 'Inference',
    },
    exhibits: ['EVID-P12', 'EVID-P12-B'],
    uses: ['P06', 'P11'],
    mech: 'missing-evidence',
    solution:
      'Observer reads the chart: Row B Seat 7, marked L.V. Analyst reads work order FWO-21-0431: a momentary switch under the B7 armrest, cable via riser R2 to panel P-214X, relay K1 drives a concealed pivot panel in the rear screen wall; booking 17 Oct 19:00–22:00 by L.V., Continuity lecture, no attendees. Operator compares issues 02 and 03: block 13.0 m and walls 0.6 m on both, hall depth 12.4 m on issue 02 and 8.1 m on issue 03, so 4.3 m behind the rear wall is unaccounted for on issue 03. Issue 02 lists that space as C214-X, a rear room entered from the hall only on panel P-214X, the same panel as the switch. Issue 03 lists neither the room nor its panel. Answer: C214-X.',
    redHerring: null,
    recontext: {
      what: 'What Hall 214 contains',
      from: 'Hall 214 is the 8.1 m lecture hall the current drawings show.',
      to: 'Behind its rear wall is a 4.3 m room that issue 03 removed, and a switch under her seat opens it.',
    },
    revelation: 'A room that is not on the current drawings.',
  },
]

/* ────────────────────────────── artifacts ────────────────────────────── */

export const artifacts = [
  {
    id: 'EVID-P06',
    node: 'P06',
    kind: 'document',
    title: 'Reference Desk Lending Ledger, Entry #06',
    description: 'The library’s lending ledger page for restricted-case item 06, with the loan history of the item.',
    source: 'Library reference desk',
    custodian: 'University Library',
    date: '2024-10-17',
    reliability: 'primary',
    proves: ['L.V. is entered as the borrower of restricted-case item 06 on 17/10/2024', 'The loan has not been returned', 'Item 06 is identified in the index and register as a drawing set'],
    doesNotProve: ['What time of day the loan was made', 'That she kept the set for any purpose', 'Where she took it'],
    relates: [
      { to: 'EVID-M01', kind: 'precedes', note: 'The same initials bind the seal of 21:47.' },
      { to: 'EVID-P07', kind: 'corroborates', note: 'The library server holds its own record of the loan.' },
    ],
    condition: 'NORMAL',
    text:
      'UNIVERSITY LIBRARY, REFERENCE DESK. LENDING LEDGER, RESTRICTED CASES (R2). ENTRY #06. Loan history. OUT 14/02/2022 Estates office, DUE 21/02/2022, IN 18/02/2022. OUT 03/05/2023 Facilities, DUE 10/05/2023, IN 08/05/2023. OUT 17/10/2024 L.V., DUE blank, IN blank. Initials L.V. handwritten in the borrower column. The item is identified by number only.',
    render: {
      form: 'doc',
      stock: 'ledger',
      head: { org: 'UNIVERSITY LIBRARY', unit: 'REFERENCE DESK', form: 'LENDING LEDGER · RESTRICTED CASES', control: 'LL/R2', revision: '' },
      title: 'ENTRY #06',
      fields: [['STACK', 'RESTRICTED CASES (R2)'], ['ENTRY', '#06']],
      blocks: [
        { t: 'table', cols: ['OUT', 'BORROWER', 'DUE', 'IN'], widths: [0.26, 0.34, 0.2, 0.2], hi: [2], rows: [
          ['14/02/2022', 'Estates office', '21/02/2022', '18/02/2022'],
          ['03/05/2023', 'Facilities', '10/05/2023', '08/05/2023'],
          ['17/10/2024', '', '', ''],
        ] },
        { t: 'hand', text: 'L.V.', dx: 190, dy: -52, rot: -3, color: 'black' },
        { t: 'gap', h: 8 },
        { t: 'p', text: 'ITEM: by number. Title is in the stack index.' },
      ],
      foot: 'LIBRARY · REFERENCE DESK · RET 7Y · PAGE 06',
      damage: null,
    },
  },
  {
    id: 'EVID-P07',
    node: 'P07',
    kind: 'log',
    title: 'Library Circulation Extract, 17 Oct 2024',
    description: 'The library server’s circulation extract for 17 October 2024 with slip, item, card and stamped times.',
    source: 'Library basement server rack',
    custodian: 'University Library',
    date: '2024-10-17',
    reliability: 'secondary',
    proves: ['Slip 44721 is item #06 on card 0617 with an OUT stamp of 21:22:14 and no IN', 'Slip 44721 was the last slip issued', 'The host reports a local RTC time source and NTP unsynchronised'],
    doesNotProve: ['By whose clock the stamp was made, or that it agrees with other systems', 'Who stood at the desk when the slip was written', 'Where the cardholder was at the time'],
    relates: [
      { to: 'EVID-P06', kind: 'corroborates', note: 'The paper ledger records the same loan without a time.' },
      { to: 'EVID-P02-B', kind: 'contradicts', note: 'The guard register logs L.V. out at 17:28, before this stamp.' },
    ],
    condition: 'NORMAL',
    text:
      'LIBSRV-01 CIRCULATION, 17 OCT 2024. SLIP ITEM CARD OUT IN. 44709 #11 0233 13:08:07 13:41:50. 44714 #07 0412 14:30:44 15:12:03. 44716 #02 0233 17:20:31 18:02:09. 44721 #06 0617 21:22:14, no IN. Last slip issued: 44721. Footer: libsrv01 | time source: local rtc | ntp: unsynchronised.',
    render: {
      form: 'screen',
      theme: 'green',
      title: 'LIBSRV-01 · CIRCULATION · 17 OCT 2024',
      lines: [
        'SLIP   ITEM  CARD  OUT       IN',
        '44709  #11   0233  13:08:07  13:41:50',
        '44714  #07   0412  14:30:44  15:12:03',
        '44716  #02   0233  17:20:31  18:02:09',
        '44721  #06   0617  21:22:14  --',
        '',
        'LAST SLIP ISSUED: 44721',
        '',
        'libsrv01 | time source: local rtc | ntp: unsynchronised',
      ],
      hi: [4],
    },
  },
  {
    id: 'EVID-P08',
    node: 'P08',
    kind: 'plan',
    title: 'A-201-G Issue 03, Route Legend',
    description: 'The notes sheet of the Admin Building ground-floor plan, issue 03, with the legend of route classes.',
    source: 'Archive cabinet, drawing set A-201-G',
    custodian: 'Bureau of Continuity Records',
    date: '1995-03-14',
    reliability: 'primary',
    proves: ['The plans class every route as ALPHA, BETA, GAMMA or DELTA', 'Only the DELTA class is drawn as a network, with nine junctions linking plant, ground floor and lower ground'],
    doesNotProve: ['Which route anyone actually took', 'That the network is open to the public', 'Who wrote the note that points to it'],
    relates: [
      { to: 'EVID-P06', kind: 'derives', note: 'The legend belongs to the drawing set she signed out.' },
      { to: 'EVID-P10', kind: 'precedes', note: 'The colour legend assigns door categories to the same classes.' },
    ],
    condition: 'NORMAL',
    text:
      'HALDER INSTITUTE, DRAWING OFFICE. A-201-G ISSUE 03, NOTES SHEET 1, ROUTE LEGEND. ALPHA public corridors, black, LINE: one E-W run per level, no branching. BETA stairs, green, SPURS: single flights, each serving two levels. GAMMA lifts, red, SHAFTS: two, independent. DELTA service routes, blue, NETWORK: branching, nine junctions, links plant, ground floor and lower ground. A junction is a point where three or more routes meet. Sheet date 14 MAR 1995.',
    render: {
      form: 'doc',
      stock: 'vellum',
      head: { org: 'HALDER INSTITUTE FOR CONTINUITY STUDIES', unit: 'DRAWING OFFICE', form: 'A-201-G · ISSUE 03 · NOTES SHEET 1', control: 'HI/DRG/A-201-G/03', revision: '14 MAR 1995' },
      title: 'ROUTE LEGEND',
      fields: [['SHEET', 'GROUND FLOOR, ALL WINGS'], ['SCALE', '1:100']],
      blocks: [
        { t: 'table', cols: ['CLASS', 'ROUTES', 'COLOUR', 'FORM'], widths: [0.14, 0.22, 0.14, 0.5], hi: [3], rows: [
          ['ALPHA', 'public corridors', 'black', 'LINE: one E-W run per level, no branching'],
          ['BETA', 'stairs', 'green', 'SPURS: single flights, each serving two levels'],
          ['GAMMA', 'lifts', 'red', 'SHAFTS: two, independent'],
          ['DELTA', 'service routes', 'blue', 'NETWORK: branching, nine junctions; links plant, ground floor and lower ground'],
        ] },
        { t: 'gap', h: 10 },
        { t: 'p', text: 'A JUNCTION is a point where three or more routes meet.' },
        { t: 'mono', lines: ['ALPHA  o-------------------o', 'DELTA  o--o--o     o', '          \\ | /   /', '           o-o---o'] },
      ],
      foot: 'HALDER INSTITUTE · RET 30Y · SHEET N1',
      damage: null,
    },
  },
  {
    id: 'EVID-P09',
    node: 'P09',
    kind: 'log',
    title: 'Master Clock Output Channels',
    description: 'A printout of the master clock’s output channels with each sink’s offset from building time and its last sync.',
    source: 'Clock room',
    custodian: 'Estates, Plant office',
    date: '2024-10-18 07:10',
    reliability: 'primary',
    proves: ['The library server (channel VII) runs +04:00:00 against building time and was last synchronised on 14 September 2021', 'The guard desk, access control, camera banks and door sensors are held at +00:00:00', 'The lobby tower face is hand-set and not a reference'],
    doesNotProve: ['Why the library link was never restored', 'What any individual log line on the library server records', 'Who was in the library at any time'],
    relates: [
      { to: 'EVID-P07', kind: 'contradicts', note: 'Corrects the stamp on slip 44721 by the host’s offset.' },
      { to: 'EVID-P02', kind: 'explains', note: 'Row I records the hand-set lobby face and its hold.' },
    ],
    condition: 'NORMAL',
    text:
      'MASTER CLOCK, OUTPUT CHANNELS. Printed 18 OCT 2024 07:10, Plant office. Master = building time. OFFSET = sink minus master. I LOBBY TOWER FACE, hand-set, HELD 17 OCT 22:45 (LC-01). II GUARD DESK +00:00:00, last sync 18 OCT 03:00, OK. III ACCESS CONTROL +00:00:00, 18 OCT 03:00, OK. IV CAMERA BANKS +00:00:00, 18 OCT 03:00, OK. V DOOR SENSORS +00:00:00, 18 OCT 03:00, OK. VI BUILDING CONTROLS +00:00:00, 18 OCT 03:00, OK. VII LIB-SRV +04:00:00, last sync 14 SEP 2021, FREE-RUN. VIII TOWER BELL +00:00:00, last sync 18 OCT 03:00, OK.',
    render: {
      form: 'doc',
      stock: 'thermal',
      head: { org: 'ESTATES · PLANT OFFICE', unit: 'CLOCK ROOM', form: 'MASTER CLOCK · OUTPUT CHANNELS', control: 'MC-ST', revision: '' },
      title: 'OUTPUT CHANNELS',
      fields: [['PRINTED', '18 OCT 2024  07:10'], ['MASTER', 'BUILDING TIME'], ['OFFSET', 'SINK MINUS MASTER']],
      blocks: [
        { t: 'table', cols: ['CH', 'SINK', 'OFFSET', 'LAST SYNC', 'STATE'], widths: [0.08, 0.28, 0.16, 0.22, 0.26], hi: [6], rows: [
          ['I', 'LOBBY TOWER FACE', 'hand-set', '—', 'HELD 17 OCT 22:45 (LC-01)'],
          ['II', 'GUARD DESK', '+00:00:00', '18 OCT 03:00', 'OK'],
          ['III', 'ACCESS CONTROL', '+00:00:00', '18 OCT 03:00', 'OK'],
          ['IV', 'CAMERA BANKS', '+00:00:00', '18 OCT 03:00', 'OK'],
          ['V', 'DOOR SENSORS', '+00:00:00', '18 OCT 03:00', 'OK'],
          ['VI', 'BUILDING CONTROLS', '+00:00:00', '18 OCT 03:00', 'OK'],
          ['VII', 'LIB-SRV', '+04:00:00', '14 SEP 2021', 'FREE-RUN'],
          ['VIII', 'spare', '—', '—', '—'],
        ] },
        { t: 'gap', h: 8 },
        { t: 'p', text: 'The selector hand is left on the channel last under inspection.' },
      ],
      foot: 'PLANT OFFICE · CLOCK ROOM · PAGE 1 OF 1',
      damage: null,
    },
  },
  {
    id: 'EVID-P10',
    node: 'P10',
    kind: 'document',
    title: 'Estates Key Schedule, Admin Building',
    description: 'The 2021 key schedule for the Admin Building, by door category, with lock type, reader and keyholders.',
    source: 'Blue-marked door, with the blueprint',
    custodian: 'Estates Office',
    date: '2021-06-14',
    reliability: 'primary',
    proves: ['Light-service doors (code LS) are opened by a cut key from key group KM, the maintenance key', 'LS doors have no reader and are not on the access-control system', 'Doors with no reader are not logged'],
    doesNotProve: ['Who held any of the four maintenance key sets on a given night', 'That any particular door was opened', 'That the schedule is still current'],
    relates: [
      { to: 'EVID-P08', kind: 'derives', note: 'The blue service route is the light-service category.' },
      { to: 'EVID-P11', kind: 'precedes', note: 'The door schedule lists the openings this schedule governs.' },
    ],
    condition: 'NORMAL',
    text:
      'ESTATES, KEY SCHEDULE, ADMIN BUILDING (2021 re-key). PA public: latch, card reader, reader YES, card for all staff. RS restricted staff: card reader and PIN, YES. HS heavy service: card reader and cut key, YES, card plus key group KP (Estates). LS light service: mortice lock, cut key, reader NONE, key group KM = maintenance key, Facilities, four numbered sets. FE fire exit: push-bar, alarm, reader NONE. Remark: doors with no reader are not on the access-control system and are not logged.',
    render: {
      form: 'doc',
      stock: 'bond',
      head: { org: 'ESTATES OFFICE', unit: 'KEY CONTROL', form: 'KEY SCHEDULE · ADMIN BUILDING', control: 'EO/KEY/21-02', revision: '2021 RE-KEY' },
      title: 'KEY SCHEDULE',
      fields: [['ISSUED', '14 JUN 2021'], ['COVERS', 'ADMIN BUILDING']],
      blocks: [
        { t: 'table', cols: ['CODE', 'CATEGORY', 'LOCK', 'READER', 'KEY / HOLDERS'], widths: [0.09, 0.19, 0.22, 0.1, 0.4], hi: [3], rows: [
          ['PA', 'public', 'latch, card reader', 'YES', 'card, all staff'],
          ['RS', 'restricted staff', 'card reader + PIN', 'YES', 'card and PIN'],
          ['HS', 'heavy service', 'card reader + cut key', 'YES', 'card + key group KP (Estates)'],
          ['LS', 'light service', 'mortice, cut key', 'NONE', 'key group KM = maintenance key (Facilities, four numbered sets)'],
          ['FE', 'fire exit', 'push-bar, alarm', 'NONE', '—'],
        ] },
        { t: 'gap', h: 10 },
        { t: 'p', text: 'REMARK: doors with no reader are not on the access-control system and are not logged.' },
      ],
      foot: 'ESTATES OFFICE · RET 10Y · PAGE 1 OF 2',
      damage: null,
    },
  },
  {
    id: 'EVID-P11',
    node: 'P11',
    kind: 'plan',
    title: 'A-201-G Issue 03, Door Schedule and West Spine',
    description: 'A door schedule extract for the ground-floor plan, issue 03, with a note of the west spine gridlines.',
    source: 'Wall with the glowing symbol, from drawing set A-201-G',
    custodian: 'Bureau of Continuity Records',
    date: '1995-03-14',
    reliability: 'primary',
    proves: ['Three archways are scheduled: A-031-ARC (ALPHA, ground, E1), S01-TUN (DELTA, ground, W3) and S06-TUN (DELTA, lower ground, P2)', 'On the west spine the archway at W3 stands beside the Hall 214 foyer door at W4'],
    doesNotProve: ['Where the service route leads', 'Whether the door at W3 has ever been opened', 'Who holds a key to it'],
    relates: [
      { to: 'EVID-P10', kind: 'corroborates', note: 'The route class is the service route whose doors have no reader.' },
      { to: 'EVID-P12', kind: 'precedes', note: 'The lecture hall at W4 is the next room on the spine.' },
    ],
    condition: 'NORMAL',
    text:
      'A-201-G ISSUE 03, DOOR SCHEDULE (extract). A-214-D1 hall door, GF, ALPHA, W4. A-CAB-D1 hall door, GF, ALPHA, E3. A-031-ARC archway, GF, ALPHA, E1. S01-TUN archway, GF, DELTA, W3. S06-TUN archway, LG, DELTA, P2. P-PLT-D3 plant door, LG, no route, P3. Grid: W west spine, E east wing, P plant corridor. West spine from the lobby end: W1 lobby end, W2 stair, W3 recess (service-route ring), W4 foyer door A-214-D1, Hall 214.',
    render: {
      form: 'doc',
      stock: 'vellum',
      head: { org: 'HALDER INSTITUTE FOR CONTINUITY STUDIES', unit: 'DRAWING OFFICE', form: 'A-201-G · ISSUE 03 · DOOR SCHEDULE', control: 'HI/DRG/A-201-G/03', revision: '14 MAR 1995' },
      title: 'DOOR SCHEDULE (EXTRACT)',
      fields: [['SHEET', 'GROUND FLOOR + LOWER GROUND'], ['GRID', 'W WEST · E EAST · P PLANT']],
      blocks: [
        { t: 'table', cols: ['ID', 'TYPE', 'LEVEL', 'ROUTE', 'GRID'], widths: [0.24, 0.24, 0.14, 0.18, 0.2], hi: [3], rows: [
          ['A-214-D1', 'hall door', 'GF', 'ALPHA', 'W4'],
          ['A-CAB-D1', 'hall door', 'GF', 'ALPHA', 'E3'],
          ['A-031-ARC', 'archway', 'GF', 'ALPHA', 'E1'],
          ['S01-TUN', 'archway', 'GF', 'DELTA', 'W3'],
          ['S06-TUN', 'archway', 'LG', 'DELTA', 'P2'],
          ['P-PLT-D3', 'plant door', 'LG', '—', 'P3'],
        ] },
        { t: 'gap', h: 10 },
        { t: 'mono', lines: ['GF WEST SPINE, from the lobby end', 'W1 lobby --- W2 stair --- W3 recess --- W4 A-214-D1', '                         (service ring)   Hall 214'] },
      ],
      foot: 'HALDER INSTITUTE · RET 30Y · SHEET D1',
      damage: null,
    },
  },
  {
    id: 'EVID-P12',
    node: 'P12',
    kind: 'plan',
    title: 'Hall 214 Block, Issues 02 and 03 Compared',
    description: 'Dimensions and room schedules for the Hall 214 block taken from issues 02 and 03 of the ground-floor plan, side by side.',
    source: 'Drawing set A-201-G (library R2-06), Hall 214 sheets',
    custodian: 'Bureau of Continuity Records',
    date: '2024-10-17',
    reliability: 'derived',
    proves: ['The block is 13.0 m gridline to gridline on both issues, and the walls are 0.6 m', 'Hall 214 is dimensioned 12.4 m deep on issue 02 and 8.1 m on issue 03', 'Issue 02 lists a rear room C214-X of 4.3 m on panel P-214X; issue 03 lists no such room'],
    doesNotProve: ['What the room was used for', 'Whether the room still exists behind the wall', 'Who ordered it removed from the drawings'],
    relates: [
      { to: 'EVID-P12-B', kind: 'corroborates', note: 'The work order wires the switch to the same panel, P-214X.' },
      { to: 'EVID-P06', kind: 'derives', note: 'Both issues come from the set she signed out.' },
    ],
    condition: 'NORMAL',
    text:
      'A-201-G, HALL 214 BLOCK, ISSUES COMPARED. Issue 02 (Aug 1991) and issue 03 (Mar 1995). Block, gridline to gridline: 13.0 m and 13.0 m. Walls, front plus rear: 0.6 m and 0.6 m. Hall 214 width: 9.6 m and 9.6 m. Hall 214 depth (dimension): 12.4 m and 8.1 m. Room schedule, issue 02: 214 hall (panel P-214), 214A AV store (P-214A), C214-X rear room, entered from the hall only (panel P-214X). Room schedule, issue 03: 214 hall (P-214), 214A AV store (P-214A). Issue 03 draws the area behind the hall’s rear wall as solid fill, unlabelled. Issue 02 draws a screen wall across the hall at 8.1 m.',
    render: {
      form: 'doc',
      stock: 'bond',
      head: { org: 'BUREAU OF CONTINUITY RECORDS', unit: 'DRAWING EXTRACTS', form: 'A-201-G · HALL 214 BLOCK · ISSUES 02 / 03', control: 'BCR/DX/A-201-G', revision: '' },
      title: 'ISSUES COMPARED',
      fields: [['SET', 'A-201-G, LIBRARY R2-06'], ['EXTRACTED', '17 OCT 2024']],
      blocks: [
        { t: 'table', cols: ['DIMENSION', 'ISSUE 02 · AUG 1991', 'ISSUE 03 · MAR 1995'], widths: [0.4, 0.3, 0.3], hi: [3], rows: [
          ['Block, gridline to gridline', '13.0 m', '13.0 m'],
          ['Walls, front plus rear', '0.6 m', '0.6 m'],
          ['Hall 214 width', '9.6 m', '9.6 m'],
          ['Hall 214 depth (dimension)', '12.4 m', '8.1 m'],
        ] },
        { t: 'gap', h: 8 },
        { t: 'table', cols: ['ROOM SCHEDULE', 'ISSUE 02', 'ISSUE 03'], widths: [0.34, 0.38, 0.28], hi: [2], rows: [
          ['214 hall', 'panel P-214', 'panel P-214'],
          ['214A AV store', 'panel P-214A', 'panel P-214A'],
          ['C214-X rear room, from the hall only', 'panel P-214X', '—'],
        ] },
        { t: 'gap', h: 8 },
        { t: 'mono', lines: [
          'ISSUE 02 (AUG 1991), depth in metres',
          'F|== HALL 214 ==|= C214-X =|R',
          '0.3     8.1          4.3    0.3',
          '',
          'ISSUE 03 (MAR 1995)',
          'F|== HALL 214 ==|//////////|R',
          '0.3     8.1      solid fill 0.3',
        ] },
      ],
      foot: 'BUREAU · EXTRACT FROM SET A-201-G · PAGE 1 OF 1',
      damage: null,
    },
  },
  {
    id: 'EVID-P12-B',
    node: 'P12',
    kind: 'document',
    title: 'Facilities Work Order FWO-21-0431 and Hall 214 Booking',
    description: 'A 2021 facilities work order for Hall 214 and the hall’s booking register line for 17 October 2024.',
    source: 'Lecture Hall 214, under seat B7',
    custodian: 'Estates, Facilities',
    date: '2021-03-19',
    reliability: 'primary',
    proves: ['A momentary switch was fitted under the armrest of row B seat 7 in 2021 and wired to panel P-214X', 'Panel P-214X drives a concealed pivot panel in the rear screen wall', 'Hall 214 was booked for 19:00–22:00 on 17 October 2024 by L.V., with no attendees recorded'],
    doesNotProve: ['That the switch was used on 17 October', 'Who was in the hall during the booking', 'What lies behind the concealed panel'],
    relates: [
      { to: 'EVID-P12', kind: 'corroborates', note: 'The panel named here is the panel of the rear room the plans list.' },
      { to: 'EVID-M01', kind: 'precedes', note: 'The booking window contains the seal at 21:47.' },
    ],
    condition: 'NORMAL',
    text:
      'FACILITIES WORK ORDER FWO-21-0431. HALL 214. Raised 03 FEB 2021, completed 19 MAR 2021. Estates ref EO/21/118. Requested: L. Vey. 1 Replace armrest hinges, rows A to C. 2 Re-lamp stage lights. 3 Fit momentary switch (normally open) under the armrest, row B seat 7. Cable via riser R2 to panel P-214X. 4 Panel P-214X: relay K1 drives the actuator of the concealed pivot panel in the rear screen wall of the hall. 5 Label panel. BOOKING REGISTER, HALL 214: 17 OCT 2024, 19:00-22:00, booked 11 OCT by L.V. Title: Continuity lecture. Attendees recorded: none.',
    render: {
      form: 'doc',
      stock: 'carbon',
      head: { org: 'ESTATES · FACILITIES', unit: 'WORK ORDERS', form: 'WORK ORDER FWO-21-0431', control: 'EO/21/118', revision: '' },
      title: 'HALL 214',
      fields: [['RAISED', '03 FEB 2021'], ['COMPLETED', '19 MAR 2021'], ['REQUESTED', 'L. VEY']],
      blocks: [
        { t: 'mono', lines: [
          '1  Replace armrest hinges, rows A to C.',
          '2  Re-lamp stage lights.',
          '3  Fit momentary switch (normally open) under',
          '   the armrest, row B seat 7. Cable via riser R2',
          '   to panel P-214X.',
          '4  Panel P-214X: relay K1 drives the actuator of',
          '   the concealed pivot panel in the rear screen',
          '   wall of the hall.',
          '5  Label panel.',
        ] },
        { t: 'rule' },
        { t: 'p', text: 'BOOKING REGISTER, HALL 214' },
        { t: 'table', cols: ['DATE', 'TIME', 'BOOKED', 'TITLE', 'ATTENDEES'], widths: [0.16, 0.18, 0.2, 0.28, 0.18], hi: [0], rows: [
          ['17 OCT 2024', '19:00–22:00', '11 OCT · L.V.', 'Continuity lecture', 'none recorded'],
        ] },
      ],
      foot: 'ESTATES · FACILITIES · RET 10Y · PAGE 1 OF 1',
      damage: null,
    },
  },
]
