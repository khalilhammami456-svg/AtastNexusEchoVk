// ACT I — ANOMALY. The bulletin says she left at 17:30. The building keeps a record the bulletin does not.
// P01 P02 P03 P04 P05 M01

export const newFacts = [
  'Register of Marks is Halder form HI/REG/74-03; countermarks are in a restricted Addendum A (used by P22).',
  'Seal register entry is SQ-24-001; guard-desk page is GD-241017; clock card is LC-01; session register is NX/REG/2021.',
  'Bay table pairs mark letters with digits: C=3, D=4, E=5, F=2 (only these four letters occur in the Halder mark).',
  'The Bureau issued bulletin MP-24-018 at 09:40 on 18 Oct 2024.',
  'Attestation window for SQ-24-001 ran 21:44–21:47; the guard desk logged it as a "tri-attest" at the Admin Building.',
]

export const concerns = []

export const nodes = [
  /* ─────────────────────────────── P01 ─────────────────────────────── */
  {
    code: 'P01',
    title: 'The Mark',
    answer: 'HALDER',
    alts: ['HALDER INSTITUTE', 'THE HALDER INSTITUTE', 'HALDER INSTITUTE FOR CONTINUITY STUDIES'],
    redact: false,
    format: 'ONE WORD (the institution’s name)',
    question: 'Whose building was this before the university?',
    narrativeObjective:
      'The bulletin calls this the university’s Admin Building. The stone above the doors says something older. Establish who built and held the building before the university.',
    observer: {
      screenTitle: 'Facade Field Log',
      visualType: 'visual',
      whatTheySee: 'A row of carved stone glyphs above the main entrance. Eight columns of symbols; some shapes repeat.',
      taskPrompt: 'Copy the row left to right, one glyph per column, and read it to the Analyst. Say if any column looks different from the rest.',
      dataPayload:
        'FIELD LOG — MAIN ENTRANCE\nFACADE SYMBOL GRID: 8 columns of carved stone symbols above the doors.\nThe stonework is original to the 1974 building. Count the columns yourself before you read; the Analyst cannot check your count from where they sit.',
    },
    analyst: {
      screenTitle: 'Mark Decoder',
      visualType: 'memory-recall',
      whatTheySee: 'The cipher wheel from your kit, which maps the facade’s glyph shapes to letters.',
      taskPrompt: 'Turn each glyph your Observer reads into a letter with the wheel, and read the letters back in order. A mark is seven letters; the wheel will not give a letter for a column that is not part of it.',
      dataPayload:
        'DECODING INSTRUCTIONS: Convert each glyph to a single letter using the substitution key.\nThe Institute’s bay marks were always seven letters. Report what the wheel gives you, in order, and say which column it would not translate.',
    },
    operator: {
      screenTitle: 'Register of Marks',
      visualType: 'document-forensics',
      whatTheySee: 'A terminal holding a scanned register of institutional marks, 1974 issue, and the Bureau’s bulletin of 18 October.',
      taskPrompt: 'Match the mark your Analyst decodes to a row in the register, check the dates on that row against the bulletin, and answer who held the building before the university.',
      dataPayload:
        'The register is keyed by mark. The bulletin names the building as the university’s Admin Building.\nQUESTION: Whose building was this before the university?\nANSWER (ONE WORD — the institution’s name): [ _ _ _ _ _ _ ]',
      interactiveData: {
        documentText:
          'REGISTER OF INSTITUTIONAL MARKS — 1974 ISSUE (extract)\n\nMARK      HOLDER                                         ISSUED   NOTE\nCDFDEFF   Halder Institute for Continuity Studies        1974     Admin Bldg, main + east wing\nDBFFECD   Estates Office                                 1974     Annex B only\nCEEDFDC   Printing & Stores                              1974     Basement, west\nFDCEFDE   Plant & Heating                                1974     Sub-basement\nBDFCEED   Bureau of Continuity Records                   1998     Retention desk, tenant of Admin Bldg\nCDFDEEF   University Estates (consolidated)              1998     All other bays\n\nCountermarks: see Addendum A (restricted).\n\nBULLETIN MP-24-018, 18 OCT 2024 09:40\n"The Admin Building, university estate…"',
      },
    },
    chain: {
      observerProduces: 'The glyph row, column by column, and which column stands apart.',
      analystTransforms: 'Glyphs into a seven-letter mark with the wheel.',
      operatorExecutes: 'Looks the mark up in the register, checks the issue dates, and files the claim.',
    },
    failure: {
      wrongStep: 'Matching the building to the Bureau because it is the tenant that still keeps records here, or to the university because it holds the estate today.',
      consequence: 'The claim is rejected: the register dates those holders to 1998.',
      recoveryGuidance: 'Read the issue year on the row for the facade’s own mark, not the name of whoever is in the building now.',
    },
    hints: [
      'This is a question about who something belonged to. A mark on stone is a claim of ownership; a register is where such claims were written down.',
      'The Observer and Analyst together produce a mark. The Operator’s register is organised by marks, not by names.',
      'Match the decoded mark to its row, then compare the issue year on that row with the years on the other rows. The question asks who held the building first.',
      'One word, an institution’s name as it appears in the register. It is neither the Bureau nor the university.',
    ],
    reveal:
      'The mark above the doors is not the university’s. The Admin Building was raised for an institute that no longer exists. What remains of it is a records desk that kept its retention rules.',
    clue: {
      clueText:
        'A place built to keep records kept its time as carefully. In the lobby, one clock is wrong in a way that looks deliberate.',
      format: 'Inference',
    },
    exhibits: ['EVID-P01'],
    uses: [],
    mech: 'provenance',
    solution:
      'Observer reads the glyph row; Analyst decodes to CDFDEFF with the wheel (the eighth column is not a letter); Operator finds CDFDEFF in the 1974 register: Halder Institute for Continuity Studies, issued 1974. The Estates Office and University Estates marks are 1998; the Bureau is a 1998 tenant. Answer: HALDER.',
    redHerring: { id: 'RH-BUREAU', theory: 'The Bureau owns the building (it keeps the records and still sits in it).', refutedBy: 'EVID-P01: the Bureau’s mark is issued 1998; the facade carries the 1974 Halder mark.' },
    recontext: null,
  },

  /* ─────────────────────────────── P02 ─────────────────────────────── */
  {
    code: 'P02',
    title: 'The Held Moment',
    answer: '21:47',
    alts: ['2147', '21.47', '9:47 PM', '09:47 PM', '9:47PM', '21:47:00'],
    redact: false,
    format: 'HH:MM, 24-hour clock',
    question: 'What time is the lobby clock holding?',
    narrativeObjective:
      'A clock that shows the wrong time is either broken or has been set on purpose. Establish which moment the lobby clock was set to hold, and when that moment happened.',
    observer: {
      screenTitle: 'Lobby Clock Log',
      visualType: 'observation',
      whatTheySee: 'A vintage clock face with Roman numerals. One hand points at IX, the other at VII.',
      taskPrompt: 'Read the face from the east side of the lobby and report the time it shows. Then report anything you can see about the clock’s condition: dust, marks, whether anything is moving.',
      dataPayload: 'OBSERVATION: The clock face shows 9:47 when viewed from the east side.\nIt is a twelve-hour face. Nothing on it says morning or evening.',
    },
    analyst: {
      screenTitle: 'Facilities Clock Card',
      visualType: 'document-forensics',
      whatTheySee: 'The maintenance card for the lobby clock, as kept by Facilities.',
      taskPrompt: 'Read the card for what was done to the clock and why. Say whether the clock is running.',
      dataPayload: 'Card LC-01, one entry from the night of the 17th. The Operator holds the register the entry refers to.',
      interactiveData: {
        documentText:
          'LOBBY CLOCK — MAINTENANCE CARD LC-01\n\n17 OCT 2024  22:45\nFace set by hand to the time entered against SQ-24-001 in the guard-desk register (evening entry).\nMovement isolated at the gear train. Clock is NOT to be reset or restarted without a Facilities ticket.\n— N. Rahal, Facilities',
      },
    },
    operator: {
      screenTitle: 'Guard-Desk Register',
      visualType: 'document-forensics',
      whatTheySee: 'A scan of the guard-desk register page for 17 October 2024.',
      taskPrompt: 'Find the register entry that the clock card refers to and read its time. The register keeps 24-hour time; the clock is a twelve-hour face.',
      dataPayload: 'REGISTER PAGE GD-241017 (extract). The clock is held at a moment, not at the time now.\nQUESTION: What time is the lobby clock holding?\nANSWER (HH:MM, 24-hour): [ _ _ : _ _ ]',
      interactiveData: {
        documentText:
          'GUARD DESK — ADMIN BUILDING — 17 OCT 2024\n\n08:02  IN   staff (14)\n12:30  IN/OUT contractor, lift service\n17:28  OUT  L.V. (badge, main entrance)\n18:15  OUT  night cleaners IN\n21:44  QUORUM ATTEST begins   (SQ-24-001)\n21:47  SQ-24-001 APPLIED  tri-attest\n22:45  Facilities, lobby clock (LC-01)\n23:10  OUT  Facilities\n\nNo further main-entrance badge events recorded for the night.',
      },
    },
    chain: {
      observerProduces: 'The time on the clock face, read from the east side, and its condition.',
      analystTransforms: 'What the card says Facilities did, and which register entry it points to.',
      operatorExecutes: 'Finds that entry, converts it to 24-hour time and files the claim.',
    },
    failure: {
      wrongStep: 'Answering with the time on the face, or the time of the Facilities entry that set it.',
      consequence: 'The claim is rejected: the face is twelve-hour and the set-time is when someone touched the clock, not what it holds.',
      recoveryGuidance: 'The clock holds the time written against the register entry the card names, in the register’s 24-hour form.',
    },
    hints: [
      'A clock that is wrong on purpose is a record. Ask what it is recording, and who would want it held.',
      'The Analyst’s card names an entry in the Operator’s register. The Observer’s reading is the check that you have the right moment.',
      'The face reads 9:47 and has no marker for morning or evening. The register’s time for the entry the card cites, in 24-hour form, must give 9:47 on a twelve-hour face.',
      'Hours and minutes with a colon. It is later in the day than the entry that says L.V. left.',
    ],
    reveal:
      'Facilities stopped the lobby clock on purpose, at the moment of an entry made against SQ-24-001. That moment is over four hours after the bulletin says she left the building.',
    clue: {
      clueText:
        'The Institute cut numbers into the foot of its own entrance, in brass, where anyone could read them. A door somewhere is waiting for those numbers.',
      format: 'Inference',
    },
    exhibits: ['EVID-P02', 'EVID-P02-B'],
    uses: [],
    mech: 'timeline',
    solution:
      'The face shows 9:47 (twelve-hour). Card LC-01 says Facilities set it to the time entered against SQ-24-001 (evening entry) and stopped the movement. Register GD-241017 logs SQ-24-001 applied at 21:47. 21:47 on a twelve-hour face is 9:47; 09:47 would be an AM entry, and the register shows none. Answer: 21:47.',
    redHerring: { id: 'RH-CLOCK-NOW', theory: 'The lobby clock is simply wrong or broken.', refutedBy: 'EVID-P02: the card records that Facilities set and isolated it deliberately.' },
    recontext: null,
  },

  /* ─────────────────────────────── P03 ─────────────────────────────── */
  {
    code: 'P03',
    title: 'Bay 3425',
    answer: 'EAST LAB',
    alts: ['EAST LABORATORY', 'THE EAST LAB', 'THE EAST LABORATORY', 'EAST LAB D1'],
    redact: false,
    format: 'ROOM NAME',
    question: 'Which room does bay number 3425 belong to?',
    narrativeObjective:
      'Four brass plates are set into the steps at the foot of the entrance. The Institute put numbers where anyone could read them. Establish what the numbers are for.',
    observer: {
      screenTitle: 'Steps Field Log',
      visualType: 'visual',
      whatTheySee: 'Four worn brass plates near the facade steps. Each shows a single digit.',
      taskPrompt: 'Read the digit on each plate and report the plates in the order they lie on the steps. Say which plate is most worn.',
      dataPayload: 'BASE DETAILS: Four worn brass plates near the facade steps each show a single digit.\nBrass plates embedded in the steps: 3, 4, 2, 5.\nTreat the plates as four separate readings. Whether their order on the steps is the order that matters is for the Analyst.',
    },
    analyst: {
      screenTitle: 'Bay Table',
      visualType: 'document-forensics',
      whatTheySee: 'The Institute’s bay table, which pairs mark letters with digits, and the mark you decoded earlier.',
      taskPrompt: 'Use the bay table to put the plates in the order the mark gives them, and read the four digits back to the Operator.',
      dataPayload: 'Recall the mark your unit decoded at the entrance. Bay numbers were derived from it.',
      interactiveData: {
        requiresPuzzle: 'P01',
        recallPrompt: 'Recall the seven-letter mark decoded at the facade.',
        documentText:
          'HALDER BAY TABLE (derivation)\n\nA bay number is four digits.\nTake the letters of the Institute’s mark in the order each first appears.\nPair each with its digit:  C = 3   D = 4   E = 5   F = 2\nRead the digits in that order.\n\nORDERING RULE: Digits are ordered by the facade glyph positions from P01.\nCountermarks do not take a bay.',
      },
    },
    operator: {
      screenTitle: 'Bay Directory',
      visualType: 'document-forensics',
      whatTheySee: 'A directory page of Halder bay numbers and the rooms they open, and a note from the facade terminal.',
      taskPrompt: 'Look up the number your Analyst derives. Check it against the other numbers close to it before you commit: a wrong order lands on a different room.',
      dataPayload: 'The terminal at the foot of the facade prints a bay directory.\nQUESTION: Which room does bay number 3425 belong to?\nANSWER (ROOM NAME): [ _ _ _ _   _ _ _ ]',
      interactiveData: {
        documentText:
          'HALDER INSTITUTE — BAY DIRECTORY (Admin Bldg + Science Bldg)\n\nBAY    ROOM                            DOOR\n2345   Reading Room (Library)          L-RR-D2\n3245   Lecture Hall 214                A-214-D1\n3425   East Laboratory (Science Bldg)  E-LAB-D1\n3524   Chemicals Store                 S-CHM-D1\n4325   Plant Room                      P-PLT-D3\n5432   Archive, Cabinet Hall           A-CAB-D1\n\nBAY NUMBERS ARE DOOR CODES. THEY ARE CUT, NOT ISSUED.\nThe cut numbers are the code. Nothing records who types them.',
      },
    },
    chain: {
      observerProduces: 'Four digits as cut into the steps.',
      analystTransforms: 'Uses the mark to put the digits in order.',
      operatorExecutes: 'Looks the number up in the directory and files the claim.',
    },
    failure: {
      wrongStep: 'Taking the digits in the order they lie on the steps without checking them against the mark.',
      consequence: 'The number lands on a different room in the directory and the claim is rejected.',
      recoveryGuidance: 'Order the digits by where each pairing letter first appears in the mark, not by position on the steps.',
    },
    hints: [
      'A number cut into stone is a public number. Ask what it opens, and who could have read it.',
      'Four plates, a table that pairs letters with digits, and a directory of rooms. The Analyst’s ordering decides which room.',
      'Recall the mark from the entrance. Order the plates by where each letter pairs and first appears, then look the number up.',
      'A room name as the directory gives it. It is not in the Admin Building.',
    ],
    reveal:
      'Bay 3425 is the east laboratory. The code to its door is cut into the steps outside, where anyone could read it. A code that anyone can read cannot say who typed it.',
    clue: {
      clueText:
        'The Institute recorded people the way it recorded doors: on a schedule. A poster in the archive hall keeps one, and gives dates.',
      format: 'Inference',
    },
    exhibits: ['EVID-P03'],
    uses: ['P01'],
    mech: 'spatial',
    solution:
      'Plates read 3, 4, 2, 5. The bay table pairs C=3 D=4 E=5 F=2 and orders digits by first appearance of each letter in CDFDEFF: C, D, F, E gives 3,4,2,5 = 3425. The directory shows 3425 = East Laboratory, door E-LAB-D1. The note that bay numbers are door codes is the groundwork for P24b: a code proves nothing. Answer: EAST LAB.',
    redHerring: null,
    recontext: null,
  },

  /* ─────────────────────────────── P04 ─────────────────────────────── */
  {
    code: 'P04',
    title: 'Four Sessions',
    answer: '3',
    alts: ['THREE', '3 CUSTODIANS', 'THREE CUSTODIANS'],
    redact: true,
    format: 'A NUMBER',
    question: 'How many independent attestations does a NEXUS record need before it closes?',
    narrativeObjective:
      'A poster in the archive lists four dates. Establish what happened on them and what the sessions needed in order to count.',
    observer: {
      screenTitle: 'Poster Wall Log',
      visualType: 'document-forensics',
      whatTheySee: 'Four dates arranged in a vertical list on the poster.',
      taskPrompt: 'Read the four dates exactly as printed, in the order they appear on the poster. Read every other printed line too, even if it seems to be decoration.',
      dataPayload: 'POSTER DATES: 2021-03-15, 2021-06-22, 2021-09-08, 2021-12-01.\nThe dates are the poster’s own order. Read every other line on it.',
    },
    analyst: {
      screenTitle: 'Session Attestations',
      visualType: 'document-forensics',
      whatTheySee: 'The 2021 NEXUS session register, which records who attested each session.',
      taskPrompt: 'Match each session to a date your Observer reads, and report who attested it. Report attestations only; the Operator holds the outcomes.',
      dataPayload: 'Recall the lobby seal and who attested it. Sessions are listed by number; the Observer’s dates identify them.',
      interactiveData: {
        requiresPuzzle: 'P02',
        recallPrompt: 'Recall what the guard-desk register recorded when the lobby seal was applied.',
        documentText:
          'NEXUS SESSION REGISTER 2021 — ATTESTATIONS\n\nSESSION  DATE      ATTESTED BY\nS-1      15 MAR    R.N.  M.C.  M.S.\nS-2      22 JUN    R.N.  M.C.  M.S.\nS-3      08 SEP    R.N.  M.C.  —\nS-4      01 DEC    R.N.  M.C.  M.S.\n\nAn attestation is one custodian confirming their own copy of the event. The register records the outcome separately.',
      },
    },
    operator: {
      screenTitle: 'Session Outcomes',
      visualType: 'document-forensics',
      whatTheySee: 'The outcomes column for the same 2021 sessions, kept by a different office.',
      taskPrompt: 'Set each session’s outcome against the attestations your Analyst reads out, and say what it takes to close a record.',
      dataPayload: 'The outcomes are kept apart from the attestations.\nQUESTION: How many independent attestations does a NEXUS record need before it closes?\nANSWER (A NUMBER): [ _ ]',
      interactiveData: {
        documentText:
          'NEXUS SESSION OUTCOMES 2021\n\nS-1  CLOSED\nS-2  CLOSED\nS-3  NOT CLOSED — re-run required\nS-4  CLOSED\n\nA closed record is final. A record that is not closed is held open and may not be cited.',
      },
    },
    chain: {
      observerProduces: 'The four dates and any other line on the poster.',
      analystTransforms: 'Who attested each date.',
      operatorExecutes: 'Sets outcomes against attestations and files the rule they imply.',
    },
    failure: {
      wrongStep: 'Counting the sessions or the poster’s dates instead of the attestations.',
      consequence: 'The claim is rejected: four is the number of sessions, not the number needed.',
      recoveryGuidance: 'Compare the session that did not close with the ones that did, and count what differs.',
    },
    hints: [
      'This is a question about a rule that nobody wrote down for you. Induce it from cases.',
      'One session differs from the others. Look at what the Analyst reads for it and the outcome the Operator reads for it.',
      'Most sessions closed and one did not. Count the attestations on each. The rule is the smallest number that separates closing from not closing.',
      'A single digit. It is not the number of sessions.',
    ],
    reveal:
      'A NEXUS record closes only when three people each confirm their own copy. When only two attested, the record stayed open. The system is a rule about agreement, not a machine.',
    clue: {
      clueText:
        'The register lists them by initial and role. In the hall of people there is a display with room for a full set, and one place on it is empty.',
      format: 'Inference',
    },
    exhibits: ['EVID-P04'],
    uses: ['P02'],
    mech: 'pattern',
    solution:
      'Poster dates identify sessions S-1..S-4. Attestations: S-1 three (R.N., M.C., M.S.), S-2 three, S-3 two (R.N., M.C.), S-4 three. Outcomes: S-1 closed, S-2 closed, S-3 NOT CLOSED, S-4 closed. The smallest number that separates closing from not closing is 3. Answer: 3.',
    redHerring: { id: 'RH-FOUR', theory: 'The rule has to do with four (four sessions, four dates).', refutedBy: 'EVID-P04: the sessions that closed each have three attestations.' },
    recontext: null,
  },

  /* ─────────────────────────────── P05 ─────────────────────────────── */
  {
    code: 'P05',
    title: 'The Empty Frame',
    answer: 'VERIFICATION',
    alts: ['VERIFIER', 'THE VERIFICATION CUSTODIAN', 'VERIFICATION CUSTODIAN', 'VERIFICATION COPY'],
    redact: false,
    format: 'ONE WORD (a role)',
    question: 'What does the letter in the empty third frame stand for?',
    narrativeObjective:
      'A display has room for three people. Two frames hold photographs; the third is empty and carries one letter. Establish what the letter stands for.',
    observer: {
      screenTitle: 'Figure Display Log',
      visualType: 'observation',
      whatTheySee: 'A display with three frames. The third frame is empty but has an etched initial: V.',
      taskPrompt: 'Describe the two photographs as precisely as you can, then the third frame. Report the etched letter exactly.',
      dataPayload: 'DISPLAY: Two photos visible. Third photo frame is empty but has an etched initial: V.\nThe frames are in a row, left to right. Say whether the two photographs carry anything beneath them.',
    },
    analyst: {
      screenTitle: 'Custodian Roster',
      visualType: 'document-forensics',
      whatTheySee: 'The 2021 roster of NEXUS custodians and the one person who stands outside them.',
      taskPrompt: 'Read the roster and report who holds what, in the roles’ own words. Say who is listed outside the custodians, and what is said of them.',
      dataPayload: 'The initials on this roster are the ones on the session register. Recall them.',
      interactiveData: {
        requiresPuzzle: 'P04',
        recallPrompt: 'Recall the three sets of initials that attested the sessions that closed.',
        documentText:
          'NEXUS — ROSTER OF CUSTODIANS, 2021 ISSUE\n\nROLE            INITIALS   HOLDS\nOBSERVATION     R.N.       the copy of what was seen (photographic)\nANALYSIS        M.C.       the copy of what was measured (ledgers, tapes)\nVERIFICATION    M.S.       the copy of what was filed (boxes, custody)\n\nNOT A CUSTODIAN\nDESIGNER        L.V.       attests nothing. Holds no copy. Designed the quorum.',
      },
    },
    operator: {
      screenTitle: 'Display Schedule',
      visualType: 'document-forensics',
      whatTheySee: 'The display schedule for the figure display and the 2021 staff directory.',
      taskPrompt: 'Set the display schedule against the roster your Analyst reads. Test every name that could begin with the letter before you accept one.',
      dataPayload: 'Frames are etched by whatever the schedule says is etched. Check the directory for every name or role that fits.\nQUESTION: What does the letter in the empty third frame stand for?\nANSWER (ONE WORD, a role): [ _ _ _ _ _ _ _ _ _ _ _ _ ]',
      interactiveData: {
        documentText:
          'DISPLAY SCHEDULE — CUSTODIAN WALL (2021)\n\nFrame 1: OBSERVATION   — portrait, etched initial of the role\nFrame 2: ANALYSIS      — portrait, etched initial of the role\nFrame 3: portrait withdrawn Dec 2021; frame left in place, initial of the role retained\n\nSTAFF DIRECTORY 2021 (extract)\nCARTER, M. — Systems Theory\nRAHAL, N. — Facilities\nSELIM, M. — Archivist\nVALE, A. — Directorate liaison\nVEY, L. — Project Lead, Designer',
      },
    },
    chain: {
      observerProduces: 'The two photographs, the empty frame and its etched letter.',
      analystTransforms: 'Turns the roster into roles, copies and the person outside the three.',
      operatorExecutes: 'Sets the schedule against the roster and files what the letter stands for.',
    },
    failure: {
      wrongStep: 'Reading the letter as the initial of the most prominent person in the case.',
      consequence: 'The claim is rejected: the schedule says what is etched, and it is a role.',
      recoveryGuidance: 'The frames carry the initial of the role. List the roles on the roster and see which begins with the letter.',
    },
    hints: [
      'A letter on an empty frame can stand for a name or a thing. The schedule tells you which kind this display uses.',
      'The schedule says what the frames are etched with. The roster lists the roles and the one person who is not in them.',
      'Frames one and two are etched with the initial of their role. Apply the same rule to frame three and list the roles that begin with the letter.',
      'A role from the roster, not a surname. It is not the designer’s role.',
    ],
    reveal:
      'The third seat belongs to Verification, not to Vey. She designed the quorum and stands outside it. Whoever binds a record as its designer is not one of the three who make it close.',
    clue: {
      clueText:
        'Five findings now agree about one evening. A terminal in the archive will only open to a unit that can say what those five add up to.',
      format: 'Inference',
    },
    exhibits: ['EVID-P05'],
    uses: ['P04'],
    mech: 'identity',
    solution:
      'Frame 3 is etched V, the schedule says frames carry the initial of the role. Roles: Observation, Analysis, Verification. Only Verification begins with V; the designer role is D and is expressly outside the custodians. Directory names beginning with V (Vale, Vey) are not roles on the wall. Answer: VERIFICATION.',
    redHerring: { id: 'RH-V-IS-VEY', theory: 'V stands for Vey: she is the third figure.', refutedBy: 'EVID-P05: the roster lists the designer outside the custodians and the schedule etches role initials.' },
    recontext: { what: 'Who the third figure is', from: 'The third figure is the project lead (Dr. Vey).', to: 'The third seat is the Verification custodian; Vey designed the quorum and holds no seat.' },
  },

  /* ─────────────────────────────── M01 ─────────────────────────────── */
  {
    code: 'M01',
    title: 'Seal Register',
    answer: 'SEAL',
    alts: ['THE SEAL', 'A SEAL', 'QUORUM SEAL', 'SEAL APPLIED'],
    redact: false,
    format: 'ONE WORD (an event type)',
    question: 'What was applied to the record at the moment the lobby clock is holding?',
    narrativeObjective:
      'Five findings have been filed. Put them together: what kind of event happened in the Admin Building after the bulletin says Dr. Vey left it?',
    observer: {
      screenTitle: 'Findings Terminal',
      visualType: 'meta',
      whatTheySee: 'A terminal showing the five findings your unit has filed.',
      taskPrompt: 'Read the five findings aloud in the order shown. Say which of them concern a person and which concern a place or a time.',
      dataPayload: 'STAGE 1 FINDINGS — as filed by this unit.\nThey are listed in the order they were closed.',
      interactiveData: {
        answers: ['HALDER', '21:47', 'EAST LAB', '3', 'VERIFICATION'],
        hint: 'Five findings. One evening.',
      },
    },
    analyst: {
      screenTitle: 'Event Types',
      visualType: 'document-forensics',
      whatTheySee: 'The register of NEXUS event types and the conditions for each.',
      taskPrompt: 'Read out the definition of each event type. Say which ones need custodians and which do not.',
      dataPayload: 'Recall the rule for closing a record and who the three custodians are.',
      interactiveData: {
        requiresPuzzle: 'P05',
        recallPrompt: 'Recall who the three custodians are and what the empty frame stood for.',
        documentText:
          'NEXUS EVENT TYPES\n\nSYNC   a custodian refreshes their own copy. One custodian.\nVOID   a custodian withdraws their copy. One custodian.\nAMEND  a record is corrected. Three custodians, each in writing.\nSEAL   a record is closed. Three custodians attest within one minute; the designer binds it.\n\nEvery event is entered against a reference of the form SQ-yy-nnn.',
      },
    },
    operator: {
      screenTitle: 'Bulletin and Register',
      visualType: 'contradiction-hunt',
      whatTheySee: 'The Bureau’s bulletin of 18 October beside the guard-desk register entries.',
      taskPrompt: 'Read the bulletin against the register. Report which statements can both be true and which cannot. Then state which event type matches what the register shows.',
      dataPayload: 'Two documents about the same evening. The register and the bulletin are both genuine.\nQUESTION: What was applied to the record at the moment the lobby clock is holding?\nANSWER (ONE WORD — an event type): [ _ _ _ _ ]',
      interactiveData: {
        entries: [
          { source: 'BULLETIN MP-24-018 · 18 OCT 09:40', text: 'Dr. L. Vey left the Admin Building at 17:30 on 17 October. She has not been seen since.', flag: false },
          { source: 'GUARD DESK · 17 OCT 17:28', text: 'OUT L.V. (badge, main entrance).', flag: false },
          { source: 'GUARD DESK · 17 OCT 21:44', text: 'QUORUM ATTEST begins (SQ-24-001).', flag: false },
          { source: 'GUARD DESK · 17 OCT 21:47', text: 'SQ-24-001 applied. Tri-attest. Register notes the designer’s initials against the entry.', flag: false },
          { source: 'GUARD DESK · 17 OCT 22:45', text: 'Facilities, lobby clock (LC-01).', flag: false },
        ],
      },
    },
    chain: {
      observerProduces: 'The five filed findings, read aloud, in order.',
      analystTransforms: 'The definitions of the event types and what each needs.',
      operatorExecutes: 'Sets the bulletin against the register and names the event that matches.',
    },
    failure: {
      wrongStep: 'Naming an event that needs fewer than three custodians, or one that changes a record rather than closing it.',
      consequence: 'The claim is rejected: the register shows three attestations inside a minute and a designer’s binding.',
      recoveryGuidance: 'Match the register entry’s conditions to the definitions, not to the name of the reference.',
    },
    hints: [
      'This is a synthesis: you are asked to name an event by matching conditions. Your findings are the conditions.',
      'The Analyst holds definitions; the Operator holds what the register recorded at the held moment.',
      'Count who attested and how close together, and note whether anyone outside the three bound the entry. Match every condition to a definition.',
      'One word, one of the four event types. It is not one that changes an existing record.',
    ],
    reveal:
      'At 21:47 three custodians closed a record, and the designer bound it. The bulletin says she left at 17:30 and has not been seen since. The register disagrees with half of that sentence.',
    clue: {
      clueText:
        'Whoever binds a record after leaving the building prepared for it before she went. Preparation leaves paper, and the building’s library keeps a ledger.',
      format: 'Inference',
    },
    exhibits: ['EVID-M01', 'EVID-M01-B'],
    uses: ['P01', 'P02', 'P03', 'P04', 'P05'],
    mech: 'synthesis',
    solution:
      'Register entry SQ-24-001 at 21:47 shows three attestations within a minute (21:44–21:47) and a designer’s binding. Event types: SYNC and VOID need one custodian; AMEND needs three in writing and changes a record; SEAL needs three attesting within one minute with the designer binding. Answer: SEAL. Side finding: the designer’s initials are against a 21:47 entry in a building the bulletin says she left at 17:30.',
    redHerring: null,
    recontext: { what: 'The meaning of the bulletin', from: 'She left and nothing more is known.', to: 'She left at 17:28 and her initials bind a seal at 21:47.' },
    revelation: 'Her initials bind the seal at 21:47, four hours after the bulletin says she left.',
  },
]

/* ────────────────────────────── artifacts ────────────────────────────── */

export const artifacts = [
  {
    id: 'EVID-P01',
    node: 'P01',
    kind: 'document',
    title: 'Register of Institutional Marks, 1974',
    description: 'A scanned register of marks and the offices that held them, with an addendum reference.',
    source: 'Archive alcove, lobby',
    custodian: 'Bureau of Continuity Records',
    date: '1974-06-03',
    reliability: 'primary',
    proves: ['The facade’s seven-letter mark is the Halder Institute’s, issued 1974', 'The Bureau and University Estates marks were issued in 1998'],
    doesNotProve: ['That the Institute still exists', 'Who currently controls the building'],
    relates: [{ to: 'EVID-P22', kind: 'explains', note: 'The register refers to a restricted addendum of countermarks.' }],
    condition: 'NORMAL',
    text:
      'REGISTER OF INSTITUTIONAL MARKS, 1974 ISSUE. CDFDEFF Halder Institute for Continuity Studies (Admin Bldg, main and east wing). DBFFECD Estates Office (Annex B). CEEDFDC Printing and Stores. FDCEFDE Plant and Heating. BDFCEED Bureau of Continuity Records (issued 1998, retention desk). CDFDEEF University Estates, consolidated (issued 1998). Countermarks: see Addendum A (restricted). Stamp: DISSOLVED 1998 against the Halder row.',
    render: {
      form: 'doc',
      stock: 'bond',
      head: { org: 'HALDER INSTITUTE FOR CONTINUITY STUDIES', unit: 'REGISTRY', form: 'REGISTER OF INSTITUTIONAL MARKS', control: 'HI/REG/74-03', revision: 'REV 02' },
      title: 'REGISTER OF INSTITUTIONAL MARKS',
      fields: [['ISSUE', '03 JUN 1974'], ['KEEPER', 'REGISTRY, ADMIN BLDG'], ['VALID FOR', 'ALL BAYS']],
      blocks: [
        { t: 'table', cols: ['MARK', 'HOLDER', 'ISSUED', 'NOTE'], widths: [0.2, 0.42, 0.12, 0.26], hi: [0], rows: [
          ['CDFDEFF', 'Halder Institute for Continuity Studies', '1974', 'Admin Bldg, main + east wing'],
          ['DBFFECD', 'Estates Office', '1974', 'Annex B only'],
          ['CEEDFDC', 'Printing & Stores', '1974', 'Basement, west'],
          ['FDCEFDE', 'Plant & Heating', '1974', 'Sub-basement'],
          ['BDFCEED', 'Bureau of Continuity Records', '1998', 'Retention desk (tenant)'],
          ['CDFDEEF', 'University Estates (consolidated)', '1998', 'All other bays'],
        ] },
        { t: 'gap', h: 14 },
        { t: 'p', text: 'Countermarks, where fitted, are recorded in Addendum A and are not to be copied.' },
        { t: 'stamp', text: 'DISSOLVED 1998', color: 'red', rot: -7, dx: 40, dy: -170 },
        { t: 'hand', text: 'bureau = tenant only. see add. A', dx: 30, dy: 10, rot: -2, color: 'blue' },
      ],
      foot: 'FORM HI-03 · RET 30Y · PAGE 1 OF 1',
      damage: null,
    },
  },
  {
    id: 'EVID-P02',
    node: 'P02',
    kind: 'note',
    title: 'Lobby Clock Maintenance Card LC-01',
    description: 'Facilities maintenance card for the lobby clock with a single entry for 17 October 2024.',
    source: 'Behind the lobby clock face',
    custodian: 'Facilities',
    date: '2024-10-17 22:45',
    reliability: 'primary',
    proves: ['The face was set by hand and the movement isolated by Facilities at 22:45 on 17 Oct', 'The set time was taken from the guard-desk entry for SQ-24-001'],
    doesNotProve: ['What SQ-24-001 recorded', 'Who asked Facilities to do it'],
    relates: [{ to: 'EVID-P02-B', kind: 'corroborates', note: 'The register entry the card cites.' }],
    condition: 'NORMAL',
    text: 'LOBBY CLOCK, MAINTENANCE CARD LC-01. 17 OCT 2024 22:45. Face set by hand to the time entered against SQ-24-001 in the guard-desk register (evening entry). Movement isolated at the gear train. Not to be reset or restarted without a Facilities ticket. N. Rahal, Facilities.',
    render: {
      form: 'note',
      stock: 'card',
      head: null,
      title: 'LC-01 · LOBBY CLOCK · MAINTENANCE',
      fields: [['UNIT', 'LOBBY CLOCK (TOWER FACE)'], ['LAST SERVICE', '09 MAR 2023']],
      blocks: [
        { t: 'mono', lines: ['17 OCT 2024  22:45', 'Face set by hand to the time entered', 'against SQ-24-001 in the guard-desk', 'register (evening entry).', 'Movement isolated at the gear train.', 'DO NOT RESET WITHOUT A FACILITIES TICKET.'] },
        { t: 'sig', name: 'N. Rahal' },
        { t: 'hand', text: 'to hold the moment', dx: 20, dy: 6, rot: -3, color: 'blue' },
      ],
      foot: 'FACILITIES · CARD LC-01',
      damage: null,
    },
  },
  {
    id: 'EVID-P02-B',
    node: 'P02',
    kind: 'log',
    title: 'Guard-Desk Register GD-241017',
    description: 'The guard-desk register page for 17 October 2024, Admin Building.',
    source: 'Main entrance guard desk',
    custodian: 'Estates security',
    date: '2024-10-17',
    reliability: 'primary',
    proves: ['L.V. left by the main entrance at 17:28', 'An entry, SQ-24-001, was applied at 21:47 with three attestations', 'No further main-entrance badge events were recorded that night'],
    doesNotProve: ['That L.V. did not re-enter by another route', 'Who the attesting custodians were'],
    relates: [{ to: 'EVID-M01-B', kind: 'contradicts', note: 'The bulletin’s account of her movements stops at 17:30.' }],
    condition: 'NORMAL',
    text: 'GUARD DESK, ADMIN BUILDING, 17 OCT 2024. 08:02 IN staff (14). 12:30 contractor lift service. 17:28 OUT L.V. (badge, main entrance). 18:15 night cleaners IN. 21:44 QUORUM ATTEST begins (SQ-24-001). 21:47 SQ-24-001 APPLIED tri-attest. 22:45 Facilities, lobby clock (LC-01). 23:10 OUT Facilities. No further main-entrance badge events recorded for the night.',
    render: {
      form: 'doc',
      stock: 'ledger',
      head: { org: 'ESTATES SECURITY', unit: 'GUARD DESK · ADMIN BUILDING', form: 'DAILY REGISTER', control: 'GD-241017', revision: '' },
      title: 'DAILY REGISTER · 17 OCT 2024',
      fields: [['DESK', 'MAIN ENTRANCE'], ['SHIFT', 'DAY / NIGHT']],
      blocks: [
        { t: 'table', cols: ['TIME', 'EVENT', 'NOTE'], widths: [0.14, 0.2, 0.66], hi: [2, 4, 5], rows: [
          ['08:02', 'IN', 'staff (14)'],
          ['12:30', 'IN/OUT', 'contractor, lift service'],
          ['17:28', 'OUT', 'L.V. (badge, main entrance)'],
          ['18:15', 'IN', 'night cleaners'],
          ['21:44', 'QUORUM', 'ATTEST begins (SQ-24-001)'],
          ['21:47', 'SQ-24-001', 'APPLIED · tri-attest'],
          ['22:45', 'FACILITIES', 'lobby clock (LC-01)'],
          ['23:10', 'OUT', 'Facilities'],
        ] },
        { t: 'gap', h: 10 },
        { t: 'hand', text: 'no further badge events at main entrance', dx: 24, dy: 4, rot: -1, color: 'blue' },
      ],
      foot: 'ESTATES SECURITY · RET 7Y · PAGE 1 OF 1',
      damage: null,
    },
  },
  {
    id: 'EVID-P03',
    node: 'P03',
    kind: 'document',
    title: 'Halder Bay Directory',
    description: 'A page of the Institute’s bay directory listing rooms with their bay numbers and doors.',
    source: 'Facade base terminal',
    custodian: 'Bureau of Continuity Records',
    date: '1974-06-03',
    reliability: 'primary',
    proves: ['Bay 3425 is the East Laboratory, door E-LAB-D1', 'Bay numbers are door codes, cut into stone rather than issued'],
    doesNotProve: ['Who has ever typed any code', 'That the code is still unchanged'],
    relates: [{ to: 'EVID-P01', kind: 'derives', note: 'Bay numbers derive from the Halder mark.' }],
    condition: 'NORMAL',
    text: 'HALDER INSTITUTE BAY DIRECTORY (Admin Bldg and Science Bldg). 2345 Reading Room (Library) L-RR-D2. 3245 Lecture Hall 214 A-214-D1. 3425 East Laboratory (Science Bldg) E-LAB-D1. 3524 Chemicals Store S-CHM-D1. 4325 Plant Room P-PLT-D3. 5432 Archive, Cabinet Hall A-CAB-D1. Bay numbers are door codes. They are cut, not issued. Nothing records who types them.',
    render: {
      form: 'doc',
      stock: 'bond',
      head: { org: 'HALDER INSTITUTE FOR CONTINUITY STUDIES', unit: 'FABRIC OFFICE', form: 'BAY DIRECTORY', control: 'HI/FAB/74-11', revision: 'REV 01' },
      title: 'BAY DIRECTORY',
      fields: [['COVERS', 'ADMIN + SCIENCE BLDG'], ['ISSUED', '03 JUN 1974']],
      blocks: [
        { t: 'table', cols: ['BAY', 'ROOM', 'DOOR'], widths: [0.14, 0.58, 0.28], hi: [2], rows: [
          ['2345', 'Reading Room (Library)', 'L-RR-D2'],
          ['3245', 'Lecture Hall 214', 'A-214-D1'],
          ['3425', 'East Laboratory (Science Bldg)', 'E-LAB-D1'],
          ['3524', 'Chemicals Store', 'S-CHM-D1'],
          ['4325', 'Plant Room', 'P-PLT-D3'],
          ['5432', 'Archive, Cabinet Hall', 'A-CAB-D1'],
        ] },
        { t: 'gap', h: 12 },
        { t: 'p', text: 'BAY NUMBERS ARE DOOR CODES. THEY ARE CUT, NOT ISSUED. A cut number is carried on the entrance steps for the bays of the main hall.' },
        { t: 'hand', text: 'nothing records who types them', dx: 40, dy: 6, rot: -2, color: 'blue' },
      ],
      foot: 'FORM HI-11 · RET 30Y · PAGE 1 OF 3',
      damage: null,
    },
  },
  {
    id: 'EVID-P04',
    node: 'P04',
    kind: 'document',
    title: 'NEXUS Session Register, 2021',
    description: 'A register of the four 2021 NEXUS sessions with attestations and outcomes.',
    source: 'Behind the poster',
    custodian: 'Bureau of Continuity Records',
    date: '2021-12-01',
    reliability: 'primary',
    proves: ['Three sessions closed, each with three attestations', 'The session with two attestations did not close'],
    doesNotProve: ['Why the third custodian was absent on 8 September', 'What the sessions recorded'],
    relates: [{ to: 'EVID-P05', kind: 'explains', note: 'The initials on the register are the custodians on the roster.' }],
    condition: 'NORMAL',
    text: 'NEXUS SESSION REGISTER 2021. S-1 15 March attested R.N. M.C. M.S. CLOSED. S-2 22 June R.N. M.C. M.S. CLOSED. S-3 8 September R.N. M.C. (none for third) NOT CLOSED, re-run required. S-4 1 December R.N. M.C. M.S. CLOSED.',
    render: {
      form: 'doc',
      stock: 'ledger',
      head: { org: 'BUREAU OF CONTINUITY RECORDS', unit: 'NEXUS REGISTRY', form: 'SESSION REGISTER', control: 'NX/REG/2021', revision: '' },
      title: 'SESSION REGISTER · 2021',
      fields: [['PROJECT', 'NEXUS'], ['YEAR', '2021']],
      blocks: [
        { t: 'table', cols: ['SESSION', 'DATE', 'ATTESTED', 'OUTCOME'], widths: [0.14, 0.18, 0.4, 0.28], hi: [2], rows: [
          ['S-1', '15 MAR', 'R.N.  M.C.  M.S.', 'CLOSED'],
          ['S-2', '22 JUN', 'R.N.  M.C.  M.S.', 'CLOSED'],
          ['S-3', '08 SEP', 'R.N.  M.C.  ——', 'NOT CLOSED'],
          ['S-4', '01 DEC', 'R.N.  M.C.  M.S.', 'CLOSED'],
        ] },
        { t: 'gap', h: 12 },
        { t: 'hand', text: 're-run needed. M.S. unavailable.', dx: 20, dy: 4, rot: -2, color: 'blue' },
        { t: 'stamp', text: 'NOT CLOSED', color: 'red', rot: -6, dx: 260, dy: -90 },
      ],
      foot: 'NX REGISTRY · RET 30Y · PAGE 1 OF 1',
      damage: null,
    },
  },
  {
    id: 'EVID-P05',
    node: 'P05',
    kind: 'document',
    title: 'Custodian Roster and Display Schedule, 2021',
    description: 'The 2021 roster of NEXUS custodians with the display schedule for the custodian wall.',
    source: 'Behind the figure display',
    custodian: 'Bureau of Continuity Records',
    date: '2021-12-04',
    reliability: 'primary',
    proves: ['NEXUS has three custodian roles: Observation, Analysis, Verification', 'The designer is expressly outside the custodians and holds no copy', 'The frames are etched with the initial of the role'],
    doesNotProve: ['Why the third portrait was withdrawn', 'Who currently holds each role'],
    relates: [{ to: 'EVID-P04', kind: 'explains', note: 'R.N., M.C., M.S. on the session register are the custodians here.' }],
    condition: 'NORMAL',
    text: 'NEXUS ROSTER OF CUSTODIANS, 2021. OBSERVATION R.N. holds the copy of what was seen. ANALYSIS M.C. holds the copy of what was measured. VERIFICATION M.S. holds the copy of what was filed. Not a custodian: DESIGNER L.V., attests nothing, holds no copy, designed the quorum. Display schedule: frames carry the initial of the role; the third portrait was withdrawn December 2021 and the frame left in place. Staff directory: Carter M. Systems Theory; Rahal N. Facilities; Selim M. Archivist; Vale A. Directorate liaison; Vey L. Project Lead, Designer.',
    render: {
      form: 'doc',
      stock: 'bond',
      head: { org: 'BUREAU OF CONTINUITY RECORDS', unit: 'NEXUS REGISTRY', form: 'ROSTER OF CUSTODIANS', control: 'NX/ROS/2021', revision: 'REV 04' },
      title: 'ROSTER OF CUSTODIANS',
      fields: [['ISSUE', '04 DEC 2021'], ['COPIES', '1 OF 3']],
      blocks: [
        { t: 'table', cols: ['ROLE', 'INITIALS', 'HOLDS'], widths: [0.26, 0.14, 0.6], rows: [
          ['OBSERVATION', 'R.N.', 'the copy of what was seen'],
          ['ANALYSIS', 'M.C.', 'the copy of what was measured'],
          ['VERIFICATION', 'M.S.', 'the copy of what was filed'],
        ] },
        { t: 'gap', h: 10 },
        { t: 'p', text: 'NOT A CUSTODIAN. DESIGNER (L.V.): attests nothing. Holds no copy. Designed the quorum.' },
        { t: 'gap', h: 8 },
        { t: 'p', text: 'DISPLAY: custodian wall frames carry the initial of the role. Frame 3 portrait withdrawn December 2021; frame left in place.' },
        { t: 'stamp', text: 'CONTROLLED', color: 'blue', rot: 5, dx: 280, dy: -150 },
      ],
      foot: 'NX REGISTRY · RET 30Y · PAGE 1 OF 2',
      damage: null,
    },
  },
  {
    id: 'EVID-M01',
    node: 'M01',
    kind: 'document',
    title: 'Seal Slip SQ-24-001',
    description: 'The seal slip entered against SQ-24-001 on 17 October 2024.',
    source: 'Central archive terminal (print)',
    custodian: 'Bureau of Continuity Records',
    date: '2024-10-17 21:47',
    reliability: 'primary',
    proves: ['A seal was applied at 21:47 on 17 Oct with three attestations', 'The designer’s initials are on the binding line'],
    doesNotProve: ['Where the seal was applied', 'That every check on the slip was completed', 'That the initials were written by the designer'],
    relates: [
      { to: 'EVID-M01-B', kind: 'contradicts', note: 'The bulletin says she was not seen after 17:30.' },
      { to: 'EVID-P02-B', kind: 'corroborates', note: 'The guard-desk register logs the same seal at 21:47.' },
    ],
    condition: 'NORMAL',
    text: 'NEXUS SEAL SLIP SQ-24-001. Applied 17 OCT 2024 21:47. Attested: R.N. (21:44), M.C. (21:45), M.S. (21:47). Bound (designer): L.V. Room: not entered. Checks 1 to 7: ticked 1 2 3 4, 5 blank, 6 7 ticked.',
    render: {
      form: 'doc',
      stock: 'bond',
      head: { org: 'BUREAU OF CONTINUITY RECORDS', unit: 'NEXUS REGISTRY', form: 'SEAL SLIP', control: 'SQ-24-001', revision: '' },
      title: 'SEAL SLIP',
      fields: [['REFERENCE', 'SQ-24-001'], ['APPLIED', '17 OCT 2024  21:47'], ['ROOM', '—']],
      blocks: [
        { t: 'table', cols: ['CUSTODIAN', 'TIME', 'INITIALS'], widths: [0.4, 0.24, 0.36], rows: [
          ['OBSERVATION', '21:44', 'R.N.'],
          ['ANALYSIS', '21:45', 'M.C.'],
          ['VERIFICATION', '21:47', 'M.S.'],
        ] },
        { t: 'gap', h: 10 },
        { t: 'p', text: 'BOUND (DESIGNER):' },
        { t: 'hand', text: 'L.V.', dx: 200, dy: -22, rot: -3, color: 'black' },
        { t: 'gap', h: 6 },
        { t: 'mono', lines: ['CHECKS  1 [x]  2 [x]  3 [x]  4 [x]  5 [ ]  6 [x]  7 [x]'] },
        { t: 'stamp', text: 'SEALED', color: 'red', rot: -9, dx: 300, dy: -130 },
      ],
      foot: 'NX REGISTRY · RET 30Y · PAGE 1 OF 1',
      damage: null,
    },
  },
  {
    id: 'EVID-M01-B',
    node: 'M01',
    kind: 'document',
    title: 'Bureau Bulletin MP-24-018',
    description: 'Missing-person bulletin issued by the Bureau on 18 October 2024.',
    source: 'Bureau notice board',
    custodian: 'Bureau of Continuity Records',
    date: '2024-10-18 09:40',
    reliability: 'secondary',
    proves: ['The Bureau recorded that Dr. Vey left at 17:30', 'The Bureau issued a missing-person notice at 09:40 on 18 Oct'],
    doesNotProve: ['That she was not seen after 17:30', 'What happened to her'],
    relates: [{ to: 'EVID-M01', kind: 'contradicts', note: 'A seal bound with her initials at 21:47.' }],
    condition: 'NORMAL',
    text: 'BUREAU BULLETIN MP-24-018. 18 OCT 2024 09:40. Dr. L. Vey left the Admin Building at 17:30 on 17 October. She has not been seen since. Any information to the Oversight Officer, A. Vale. Issued under the authority of the Directorate.',
    render: {
      form: 'doc',
      stock: 'bond',
      head: { org: 'BUREAU OF CONTINUITY RECORDS', unit: 'OFFICE OF OVERSIGHT', form: 'BULLETIN', control: 'MP-24-018', revision: '' },
      title: 'MISSING PERSON · BULLETIN',
      fields: [['ISSUED', '18 OCT 2024  09:40'], ['SUBJECT', 'DR. L. VEY']],
      blocks: [
        { t: 'p', text: 'Dr. L. Vey left the Admin Building at 17:30 on 17 October. She has not been seen since.' },
        { t: 'gap', h: 12 },
        { t: 'p', text: 'Any information to the Oversight Officer, A. Vale. Issued under the authority of the Directorate.' },
        { t: 'sig', name: 'A. Vale' },
      ],
      foot: 'OFFICE OF OVERSIGHT · PAGE 1 OF 1',
      damage: null,
    },
  },
]
