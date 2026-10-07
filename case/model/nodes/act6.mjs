// ACT VI — RECONSTRUCTION. The team holds the case. Say what happened; decide what to do with it.
// P33 P34 P35 P36 P37

export const newFacts = [
  'Bulletin MP-24-018 is read clause by clause: C1 "Dr. L. Vey left the Admin Building", C2 "at 17:30 on 17 October", C3 "She has not been seen since.", C4 "Any information to the Oversight Officer, A. Vale.", C5 "Issued under the authority of the Directorate."',
  'The analysis copy keeps "List A": eight records that place L.V. after 17:30 (19:32 S01-TUN, 19:45 CAM-E3, 21:47 SQ-24-001, 04:17 E-LAB-D1, the west-corridor sighting by M. Selim, 05:00 REC-19, 05:52 S01-TUN OUT, the 29 Sep 2026 voicemail). Library slip 44721 is excluded (true time 17:22).',
  'West corridor door is W-CORR-D2; its controller keeps building time (last drift check 01 Oct 2024, 0 s). Sensor cycles: 22:58:10 (cleaners), 04:20:41 open / 04:20:47 close, 04:51:19.',
  'M. Selim wrote her statement in her own hand on 18 Oct 2024: Dr. Vey came through ahead of another person who kept a step behind, toward the Engineering Block, "about twenty past four".',
  'REC-19 starts 04:30 (Rahal); Disposal Notice DN-24-107 sets destruction for 10:00 on 18 Oct.',
  'The second set of custodians maps to the three seats: Observer = OBSERVATION, Analyst = ANALYSIS, Operator = VERIFICATION. Charter clause CL. 9: a check is closed when three custodians confirm it; the verifying seat enters the word AGREE once all three have confirmed; entered earlier it is void.',
  'The Record of Choice form for check 5 lists FILE / SEAL / RETURN with empty boxes and takes no tick; the choice is not recorded anywhere.',
  'The voicemail reached the Bureau line at 19:06 on 29 Sep 2026 (the desk closes at 18:00, so nobody answered). A 1.1 s dropout hides one word after "a second". The retention desk message is RD-26-0929/1.',
  'The Bureau retention desk accepts a request only under a named class: EXTENSION, APPEAL, AMENDMENT, SECOND QUORUM. SECOND QUORUM = a further three, none of whom attested the first, convened to finish a check the first left open.',
  'The Certificate of Closure is dated 30 Sep 2026 (the day after the voicemail, "the day before the event" in CANON read as the event being 30 Sep 2026); it records the choice as "none recorded".',
  'Form CL-12 "Closing of a Fact" carries a blank "CLOSED BY" line for the protocol’s name; registry headers carry the prefix NX.',
]

export const concerns = [
  'P33: the brief lists "04:20 west corridor sighting by Selim" in the Analyst’s evidence list. That is the answer to P34 one node later. I gave the entry as "early 18 Oct, west corridor, M. Selim, own hand" with no time so P34 stays a reconstruction; the exact time appears only in P34.',
  'P35: SPINE’s question text ("Three agreeing closes the open check. Do you agree?") contains the answer AGREE and would be blanked by the redaction rule. Reworded to "What single word does the verifying seat enter to close the open check once all three seats have confirmed?".',
  'P35: the legacy Y/N confirmation (interactiveData.confirmationRequired) has no renderer in PuzzleVisual.tsx; the Y/N exists only as text on the seats and as spoken confirmation. The mechanic works socially, not in code; a renderer or server gate would make it real.',
  'P34: PuzzleVisual SequenceVisual highlights slot i when missingPositions contains i+1 (1-based). The legacy node used [3,7] for ? at indices 3 and 7 (off by one). Act VI uses 1-based [9,14].',
  'Shot west-corridor-0420 (two figures, one in front) is an image at 04:20, inside the 04:15–05:15 camera blackout. I have not used it; if another act does, its source should be a witness photograph, not CCTV.',
  'P36 alts include QUORUM per SPINE, so the word "quorum" is banned from every player-facing prose field of P36 (only dataPayload/documentText may carry it). Kept as SPINE says.',
]

export const nodes = [
  /* ─────────────────────────────── P33 ─────────────────────────────── */
  {
    code: 'P33',
    title: 'The Bulletin',
    answer: 'NOT SEEN',
    alts: [
      'NOT SEEN SINCE',
      'NOT SEEN SINCE 17:30',
      'NOT BEEN SEEN',
      'NOT BEEN SEEN SINCE',
      'HAS NOT BEEN SEEN',
      'HAS NOT BEEN SEEN SINCE',
      'SHE HAS NOT BEEN SEEN SINCE',
    ],
    redact: false,
    format: 'THE FALSE CLAUSE, 2 TO 4 WORDS, AS THE BULLETIN WORDS IT',
    question: 'Which part of the bulletin is false?',
    narrativeObjective:
      'The Bureau’s bulletin is one short paragraph. Every record you have filed since the first night either supports a clause of it or cannot. Establish which clause survives the records and which does not.',
    observer: {
      screenTitle: 'Convergence Panel',
      visualType: 'dependency-tree',
      whatTheySee: 'A panel showing a convergence diagram. The findings your unit has filed are drawn as a chain that runs into a single point.',
      taskPrompt: 'Read the chain aloud, node by node, in the order shown. Say which nodes are times, which are a person and which are an object. Then read the line at the point where the chain ends.',
      dataPayload:
        'CONVERGENCE PANEL — six findings filed by this unit.\nThey are drawn in the order of the night they concern, not the order you closed them.\nThe chain ends in one line. Read it exactly.',
      interactiveData: {
        requiresPuzzle: 'P30',
        recallPrompt: 'Recall whose voice left the message on the Bureau line in 2026.',
        nodes: [
          { label: 'P23b · 14 MIN', pos: 1 },
          { label: 'P23 · 19:45', pos: 2 },
          { label: 'M01 · SEAL', pos: 3 },
          { label: 'P24b · VALE', pos: 4 },
          { label: 'P28 · 05:00', pos: 5 },
          { label: 'P30 · VEY', pos: 6 },
        ],
        convergencePoint: 'Six findings, one target: a single clause of the Bureau’s bulletin MP-24-018, 18 Oct 09:40.',
      },
    },
    analyst: {
      screenTitle: 'Evidence List A',
      visualType: 'document-forensics',
      whatTheySee: 'The analysis copy’s list of every record that puts L.V. inside the building, or alive, after 17:30 on 17 October.',
      taskPrompt: 'Read the list line by line: the time, the type of record, and what it records. Say which lines are a person’s eyes, which are a device and which are a voice. Read the exclusions too.',
      dataPayload: 'List A is a list of records, not a conclusion. Recall what the pocket recorder caught as the tower struck; the list leans on it.',
      interactiveData: {
        requiresPuzzle: 'P28',
        recallPrompt: 'Recall the hour the tower struck on the pocket recording.',
        documentText:
          'LIST A — RECORDS AFTER 17:30, 17 OCT 2024 (analysis copy)\n\n1  19:32   DEVICE   S01-TUN opens and closes on a maintenance key. No badge read.\n2  19:45   IMAGE    CAM-E3, Engineering Block corridor: a figure in her coat.\n3  21:47   PAPER    Seal slip SQ-24-001, bound L.V.\n4  04:17   DEVICE   E-LAB-D1 badge read and code typed. A card, not a face.\n5  18 OCT, early hours   WITNESS   West corridor: M. Selim, own hand. Saw her walked toward the Engineering Block.\n6  05:00   AUDIO    REC-19: the tower strikes five during her answer.\n7  05:52   DEVICE   S01-TUN, one OUT, manual entry.\n8  29 SEP 2026   AUDIO   41 s message on the Bureau line, withheld number, her voice.\n\nEXCLUDED: library slip 44721, stamped 21:22 (server +4 h; true time 17:22, before 17:30). Lobby clock face (set 22:45 by Facilities).',
      },
    },
    operator: {
      screenTitle: 'Bulletin by Clause',
      visualType: 'document-forensics',
      whatTheySee: 'The Bureau’s bulletin MP-24-018 split into its clauses, beside the two entrance records that predate the time it names.',
      taskPrompt: 'Mark each clause as supported by a record, contradicted by one, or an instruction rather than a statement. Test the time clause against the entrance records yourself, and put the Analyst’s list against the clause about the time since. File the clause that fails.',
      dataPayload:
        'The bulletin is genuine. Its author is a separate question.\nQUESTION: Which part of the bulletin is false?\nANSWER (THE FALSE CLAUSE, 2 TO 4 WORDS, AS THE BULLETIN WORDS IT): [ ... ]',
      interactiveData: {
        requiresPuzzle: 'P23',
        recallPrompt: 'Recall the time the first image placed her back inside the building.',
        documentText:
          'BULLETIN MP-24-018 · 18 OCT 2024 09:40 · BY CLAUSE\n\nC1  "Dr. L. Vey left the Admin Building"\nC2  "at 17:30 on 17 October."\nC3  "She has not been seen since."\nC4  "Any information to the Oversight Officer, A. Vale."\nC5  "Issued under the authority of the Directorate."\n\nENTRANCE RECORDS BEFORE 17:30\nGUARD DESK GD-241017  17:28  OUT  L.V. (badge, main entrance)\nCAM-01 MAIN ENTRANCE  17:29  figure with a canvas bag leaving\n\nFor each clause: SUPPORTED / CONTRADICTED / INSTRUCTION. C4 and C5 tell the public what to do and who is speaking; they assert nothing about her.',
      },
    },
    chain: {
      observerProduces: 'The six filed findings in the order of the night, and the line they converge on.',
      analystTransforms: 'Eight records after 17:30, typed by what kind of record each is, with the exclusions.',
      operatorExecutes: 'Splits the bulletin into clauses, tests each against the entrance records and List A, and files the clause that fails.',
    },
    failure: {
      wrongStep: 'Marking the time (17:30) as the false part, or calling the whole bulletin a lie.',
      consequence: 'The claim is rejected: the guard desk and CAM-01 put her out of the door within two minutes of the time the bulletin names.',
      recoveryGuidance: 'Test each clause against the records that bear on it. A clause is false only if a record contradicts it.',
    },
    hints: [
      'A sentence can be half true. The question is which half the records support, and which half they cannot.',
      'The Analyst’s list contains only records that place her after 17:30. The Operator holds the bulletin clause by clause and the records from before the time it names.',
      'Test the time clause against the entrance records, then test the clause about what has happened since against List A. One clause survives, one does not. C4 and C5 are not claims about her.',
      'Give the clause as the bulletin words it, two to four words. It is not the time and it is not the instruction to the public.',
    ],
    reveal:
      'The bulletin never lied about the hour. It lied by stopping. Eight records run past 17:30, some by eyes, some by machines, one by her own voice. The first half of its sentence is true. The second half is false.',
    clue: {
      clueText:
        'Once the false clause is named, the night must be set in order, and an order needs one place where every line crosses. The core has a hub built for that.',
      format: 'Inference',
    },
    exhibits: ['EVID-P33'],
    uses: ['P23', 'P23b', 'P24b', 'P28', 'P30', 'M01'],
    mech: 'false-report',
    solution:
      'Operator splits MP-24-018 into clauses. C1 and C2 are tested against GD-241017 (17:28 OUT) and CAM-01 (17:29): supported within two minutes of 17:30. C4 and C5 are instructions. C3 says she has not been seen since; Analyst’s List A has eight records after 17:30 (S01-TUN 19:32, CAM-E3 19:45, seal 21:47, E-LAB-D1 04:17, Selim’s sighting, REC-19 05:00, S01-TUN OUT 05:52, the 2026 voicemail), including two witnesses and a voice. The library slip is excluded: its +4 h clock puts it at 17:22. Answer: NOT SEEN (the clause "has not been seen since").',
    redHerring: {
      id: 'RH-TIME-FALSE',
      theory: 'The false part of the bulletin is the time: she did not leave at 17:30.',
      refutedBy: 'EVID-P02-B: guard desk 17:28 OUT L.V.; and the 17:29 entrance image. The time is supported; what follows it is not.',
    },
    recontext: {
      what: 'How much of the bulletin to trust',
      from: 'The bulletin is either all true or all a lie.',
      to: 'Its first half is true and its second half is false; only the records can tell them apart.',
    },
  },

  /* ─────────────────────────────── P34 ─────────────────────────────── */
  {
    code: 'P34',
    title: 'The Night',
    answer: '04:20',
    alts: ['0420', '4:20', '04:20 AM', '4:20 AM', '04.20', '04:20:41'],
    redact: false,
    format: 'HH:MM, 24-hour clock, seconds dropped',
    question: 'At what time did Selim see Vey being walked toward the Engineering Block?',
    narrativeObjective:
      'The bulletin leaves out the whole night. Set what the records show in order, with every gap named, and fix the moment a witness saw her crossing the building in someone else’s company.',
    observer: {
      screenTitle: 'Night Sequence',
      visualType: 'pattern',
      whatTheySee: 'A hub terminal showing the night of 17–18 October as fourteen events in order. Two of the tiles are empty.',
      taskPrompt: 'Read the sequence aloud with position numbers, left to right. Say which tiles are empty and which events sit either side of each. Do not guess what belongs in a gap.',
      dataPayload:
        'THE NIGHT — 14 events in order. Positions 9 and 14 are empty.\nTimes are building time. Read each tile with its position number: the Analyst and Operator fill the gaps from their own records.',
      interactiveData: {
        requiresPuzzle: 'P28',
        recallPrompt: 'Recall what the pocket recorder caught as the tower struck, and when it began.',
        sequence: [
          '17:29 OUT',
          '18:42 CAFÉ',
          '19:32 TUNNEL',
          '19:45 ENG',
          '21:47 SEAL',
          '22:45 CLOCK',
          '04:15 CAMS',
          '04:17 E-LAB',
          '?',
          '04:30 DECK',
          '05:00 TOWER',
          '05:52 TUNNEL',
          '09:40 BULLETIN',
          '?',
        ],
        missingPositions: [9, 14],
      },
    },
    analyst: {
      screenTitle: 'Order of the Night',
      visualType: 'document-forensics',
      whatTheySee: 'The analysis copy’s account of the two events that sit in the gaps, and a written statement from the Archivist.',
      taskPrompt: 'Read what event belongs at position 9 and at position 14, and what bounds each in time. Read the Archivist’s statement exactly as written and say how exact she is.',
      dataPayload: 'The analysis copy names the events in the gaps, not the minute of position 9. Recall whose account of 04:17 could not have been true.',
      interactiveData: {
        requiresPuzzle: 'P24b',
        recallPrompt: 'Recall whose account of 04:17 could not have been true.',
        documentText:
          'ORDER OF THE NIGHT (analysis copy) — events at the gaps\n\n8   04:17   E-LAB-D1 badge read, L.V., code typed.\n9   ----    WEST CORRIDOR. M. Selim sees L.V. being walked toward the Engineering Block. Time not stated in this copy.\n10  04:30   Questioning begins, antenna deck (REC-19 starts).\n...\n13  09:40   Bulletin MP-24-018 issued.\n14  ----    DISPOSAL under DN-24-107. The notice sets 10:00, 18 Oct.\n\nSTATEMENT OF M. SELIM, 18 OCT 2024, own hand (extract)\n"I was in the west corridor. Dr. Vey came through ahead of another person, who kept a step behind her, toward the Engineering Block. It was about twenty past four. I did not speak."',
      },
    },
    operator: {
      screenTitle: 'West Corridor Sensor',
      visualType: 'document-forensics',
      whatTheySee: 'The west-corridor door controller’s event log for the night, and the camera maintenance interval that bounds what exists as footage.',
      taskPrompt: 'Choose, from the controller’s cycles, the one that fits the Archivist’s account and sits between the east-lab badge read and the start of questioning. Check the controller’s clock before you trust its seconds. File the minute.',
      dataPayload:
        'The controller records door cycles, not people. Pick the cycle the other records point to.\nQUESTION: At what time did Selim see Vey being walked toward the Engineering Block?\nANSWER (HH:MM, 24-hour, seconds dropped): [ _ _ : _ _ ]',
      interactiveData: {
        requiresPuzzle: 'P06b',
        recallPrompt: 'Recall when the east lab lost power.',
        documentText:
          'DOOR CONTROLLER W-CORR-D2 — WEST CORRIDOR, 17-18 OCT 2024\nController clock: building time (last drift check 01 OCT 2024: 0 s).\n\n22:58:10  open / close   one cycle\n04:20:41  open           04:20:47 close\n04:51:19  open / close   one cycle\n\nBADGE LOG, SAME NIGHT\n04:17  E-LAB-D1  L.V.  badge + code\nNo badge reads on W-CORR-D2 for any of the cycles.\n\nCAMERA BANK: dark 04:15 to 05:15. No footage of this corridor exists for the interval.',
      },
    },
    chain: {
      observerProduces: 'The fourteen-event sequence with its two empty positions.',
      analystTransforms: 'Names the events in the gaps and brings the Archivist’s own wording.',
      operatorExecutes: 'Matches the Archivist’s account to one controller cycle, checks the controller’s clock, and files the minute.',
    },
    failure: {
      wrongStep: 'Filing the time of the east-lab badge read because it is the nearest known time, or the later door cycle because it is the last one in the corridor.',
      consequence: 'The claim is rejected: the badge read is a card at a different door, and the later cycle falls inside the questioning.',
      recoveryGuidance: 'The right cycle sits after the badge read and before questioning begins, and fits the words the Archivist used.',
    },
    hints: [
      'This is a reconstruction. The gaps are not mysteries; each has a witness, a device, or both, and they have to agree.',
      'The Analyst names the event at each gap and holds a witness’s words. The Operator holds a device that logs door cycles. The Observer’s sequence tells you which events bound the gap.',
      'The event at position 9 happens after the east-lab badge read and before the antenna deck. Pick the one cycle on the corridor door that fits both bounds and the Archivist’s wording, and check the controller’s clock for an offset.',
      'Hours and minutes, with seconds dropped. It is a few minutes after the badge read, before the half hour.',
    ],
    reveal:
      'Set in order, the night has no gap where she vanishes. She leaves, returns by the tunnel, closes a seal, enters the east lab knowing the cameras are dead, is walked across the building, held, and leaves by the tunnel again.',
    clue: {
      clueText:
        'The night is in order, but one slip is still not whole: a box three custodians left empty for someone else. A chamber waits that opens to nobody alone.',
      format: 'Inference',
    },
    exhibits: ['EVID-P34'],
    uses: ['P06b', 'P23', 'P24b', 'P28'],
    mech: 'reconstruction',
    solution:
      'Observer reads the sequence: positions 9 and 14 are empty, between 04:17 and 04:30, and between 09:40 and the end. Analyst identifies position 9 as Selim’s sighting (time not stated) and position 14 as the disposal (DN-24-107 sets 10:00), and reads Selim’s statement: "about twenty past four". Operator reads the W-CORR-D2 log: controller on building time, no drift; cycles at 22:58:10, 04:20:41 and 04:51:19. Only 04:20:41 falls between the 04:17 badge read and the 04:30 start of questioning; 04:51 is inside the questioning and 22:58 is the cleaners. The statement and the sensor agree. Answer: 04:20.',
    redHerring: {
      id: 'RH-0417',
      theory: 'Selim saw her at 04:17, when she entered the east lab.',
      refutedBy: 'EVID-P24B and the sensor log: 04:17 is a badge at E-LAB-D1, a different door; the west-corridor cycle is 04:20:41 and the statement says about twenty past four.',
    },
    recontext: {
      what: 'Where she was after the east-lab door',
      from: 'The east-lab badge read is the last thing known of her that morning.',
      to: 'Three minutes later she is in the west corridor, being walked, with another person a step behind.',
    },
  },

  /* ─────────────────────────────── P35 ─────────────────────────────── */
  {
    code: 'P35',
    title: 'The Fifth Check',
    answer: 'AGREE',
    alts: ['AGREED', 'I AGREE', 'WE AGREE', 'WE ALL AGREE'],
    redact: false,
    format: 'ONE WORD, FIVE LETTERS',
    question: 'What single word does the verifying seat enter to close the open check once all three seats have confirmed?',
    narrativeObjective:
      'Check 5 is the one box the first custodians left empty on purpose. Establish what it needs from the three of you before it can be closed, and what it will never ask you to put on record.',
    observer: {
      screenTitle: 'The Open Check',
      visualType: 'memory-recall',
      whatTheySee: 'A terminal awaiting confirmation. It shows one line from the seal slip.',
      taskPrompt: 'Read the line from the seal slip aloud. Say what is open on it and who it says may close it. Then answer your own confirmation, Y or N, and say it aloud.',
      dataPayload:
        'SEAL SLIP SQ-24-001, CHECKS 1 TO 7:  [x] [x] [x] [x] [ ] [x] [x]\nCheck 5 ⌬ CHOICE is the only box with no tick. Margin note, printed: "Left for the second set. Closed when three confirm."\nCONFIRMATION (Y/N): This seat has read what is open. Y / N',
      interactiveData: {
        requiresPuzzle: 'P20',
        recallPrompt: 'Recall which of the seven checks was left unticked on the seal.',
        requiresAllRoles: true,
        confirmationRequired: true,
      },
    },
    analyst: {
      screenTitle: 'Three Ways to Close',
      visualType: 'document-forensics',
      whatTheySee: 'A terminal awaiting confirmation. It holds the analysis copy’s note on the ways the open check may be closed.',
      taskPrompt: 'Read the three ways aloud, in the order printed, with what each protects and what each risks. Say whether the note prefers one. Then answer your own confirmation, Y or N, and say it aloud.',
      dataPayload: 'The note lays three options side by side. Recall how many copies of the record the designer held.',
      interactiveData: {
        requiresPuzzle: 'P31',
        recallPrompt: 'Recall how many copies of the record Dr. Vey held.',
        requiresAllRoles: true,
        confirmationRequired: true,
        documentText:
          'WAYS TO CLOSE CHECK 5 (analysis copy)\nThe charter permits each. None is marked preferred.\n\nFILE    The record is opened to the Bureau and the public archive.\n        Protects: nobody can erase it again.\n        Risks: the people who lied are named.\n\nSEAL    The record stays closed, to be opened only by a later set of three.\n        Protects: it cannot be used as a weapon, by anyone.\n        Risks: it stays a secret.\n\nRETURN  The record is handed back to its designer.\n        Protects: it is held by the one who knows what it cost.\n        Risks: one person holds it again.\n\nCONFIRMATION (Y/N): This seat has read all three. Y / N',
      },
    },
    operator: {
      screenTitle: 'Record of Choice',
      visualType: 'document-forensics',
      whatTheySee: 'A terminal awaiting confirmation and input. It holds a form with three options and a clause of the charter.',
      taskPrompt: 'Read the form aloud, including what it says it keeps. Wait until the Observer and the Analyst have both answered Y, answer your own, then enter what the charter clause says the verifying seat enters.',
      dataPayload:
        'The form lists the options and keeps no tick.\nQUESTION: What single word does the verifying seat enter to close the open check once all three seats have confirmed?\nANSWER (ONE WORD, FIVE LETTERS): [ _ _ _ _ _ ]',
      interactiveData: {
        requiresPuzzle: 'P04',
        recallPrompt: 'Recall how many attestations close a record.',
        requiresAllRoles: true,
        confirmationRequired: true,
        documentText:
          'RECORD OF CHOICE — SQ-24-001, CHECK 5 (CHOICE)\nPrepared for the second set of custodians.\n\n   [ ]  FILE\n   [ ]  SEAL\n   [ ]  RETURN\n\nThis form takes no tick. What is chosen is held by those who chose it.\n\nCHARTER CL. 9. A check is closed when three custodians confirm it. The word entered by the verifying seat is AGREE. Entered before all three have confirmed, it is void.\n\nFIRST SET (21:44 to 21:47, 17 OCT 2024): checks 1 2 3 4 6 7 ticked. Check 5 left for the second set.\nSECOND SET:  OBSERVATION [ ]   ANALYSIS [ ]   VERIFICATION [ ]\n\nCONFIRMATION (Y/N): This seat has read the open check, the three ways to close it, and this form. Y / N',
      },
    },
    chain: {
      observerProduces: 'The open check as the slip shows it, and a spoken confirmation.',
      analystTransforms: 'The three ways to close it, laid out without a preference, and a spoken confirmation.',
      operatorExecutes: 'Reads the form and the charter clause, waits for both other confirmations, confirms, then enters the word.',
    },
    failure: {
      wrongStep: 'Entering the word before the Observer and the Analyst have both answered Y, or treating the form as a place to record the choice.',
      consequence: 'The terminal answers ALL SEATS REQUIRED and the check stays open. A tick on the form would not be kept.',
      recoveryGuidance: 'Hold the word until both other seats have answered Y aloud. Decide between yourselves; the form takes nothing.',
    },
    hints: [
      'Nothing here has to be found. Ask what a check that needs three people actually needs from them, and what it deliberately does not ask.',
      'Each seat holds one part: the open check, the three ways to close it, and the form that says what the verifying seat may enter and when.',
      'The charter clause on the Operator’s form names the word. It may be entered only once all three seats have confirmed, and the form itself keeps no tick.',
      'One word, five letters, the verb the charter uses for three custodians who hold the same view. Entered early, it is void.',
    ],
    reveal:
      'Check 5 is closed. Three seats confirmed that a choice was made, and the form kept no tick. The record does not know which way you went. It knows only that it was three, not one.',
    clue: {
      clueText:
        'The slip is whole, but it does not say why it was left for you. A message recorded on a line the Bureau answers will say who left it, and the deck where the Bureau’s messages are broadcast keeps it.',
      format: 'Inference',
    },
    exhibits: ['EVID-P35'],
    uses: ['P04', 'P20', 'P31'],
    mech: 'multi-role',
    solution:
      'Observer reads the seal slip: checks 1 2 3 4 6 7 ticked, check 5 (CHOICE) blank, "Closed when three confirm." Analyst reads the three ways to close it (FILE, SEAL, RETURN), laid out with protects and risks and no preference. Operator reads the Record of Choice: three empty boxes, no tick taken, and charter CL. 9: a check closes when three custodians confirm, and the verifying seat enters AGREE only after all three have. The three recalls (P20 the unticked check, P31 that she held no copy so the choice cannot be hers, P04 that three close a record) mean no one can decide for the team. Each seat says Y aloud; the Operator enters AGREE. The choice itself is not recorded.',
    redHerring: null,
    recontext: {
      what: 'The unticked box on the seal',
      from: 'The seal is incomplete: something was missed or abandoned.',
      to: 'The first set left check 5 open on purpose; it belongs to the second set, and closing it requires only that three confirm.',
    },
  },

  /* ─────────────────────────────── P36 ─────────────────────────────── */
  {
    code: 'P36',
    title: 'What She Asked',
    answer: 'SECOND QUORUM',
    alts: ['A SECOND QUORUM', 'THE SECOND QUORUM', 'QUORUM', '2ND QUORUM'],
    redact: false,
    format: 'THE CLASS OF REQUEST, NAMED IN FULL',
    question: 'What does the voicemail ask the Bureau for?',
    narrativeObjective:
      'The last message the Bureau received came from the person it declared missing. She names her request but the name is lost on the line. Establish exactly what she asked for, from what she says she needs.',
    observer: {
      screenTitle: 'Broadcast Channel',
      visualType: 'document-forensics',
      whatTheySee: 'A broadcast channel on the deck terminal. It displays a transcript with a 00:41 counter, and one passage is replaced by a dropout marker.',
      taskPrompt: 'Read the transcript aloud. Say what she says she holds, what she says of the first three, what she wants, and exactly where the line fails.',
      dataPayload: 'Bureau broadcast. Every role reads a different shard of the same message. Recall whose call this is, from the line log.',
      interactiveData: {
        gmBroadcast: true,
        requiresPuzzle: 'P30',
        recallPrompt: 'Recall whose call this is, from the Bureau line log.',
        documentText:
          'BUREAU LINE — VOICEMAIL, AS RECEIVED\n29 SEP 2026 · WITHHELD NUMBER · 00:41\n\n[tone]\n"This is Lina Vey. It is the twenty-ninth of September. I am leaving this on the Bureau line because it is the one line nobody forwards.\nI hold no copy of anything. That was always the design.\nThe first three can be accused of being interested. They are. So am I.\nI am asking the Bureau for a second [DROPOUT 1.1 s]: three people who were not in that building, who attested nothing, who have nothing to gain. One check is still open, and it is not mine to tick.\nI will not tell them what to do with it."\n[click]',
      },
    },
    analyst: {
      screenTitle: 'Retention Desk Message',
      visualType: 'document-forensics',
      whatTheySee: 'The retention desk’s internal message about the call, filed against the line log.',
      taskPrompt: 'Read the message aloud. Say what the desk could and could not make of the call, and what it says a request must be named under.',
      dataPayload: 'The desk’s note is about form, not content. Recall how many copies she held.',
      interactiveData: {
        gmBroadcast: true,
        requiresPuzzle: 'P31',
        recallPrompt: 'Recall how many copies of the record Dr. Vey held.',
        documentText:
          'BUREAU RETENTION DESK — MESSAGE RD-26-0929/1\n\nReceived: Bureau line, 29 SEP 2026, 19:06. Withheld number. 41 s. Desk closed at 18:00; not answered. Played once; transcribed as received.\n\nThe caller names herself and makes one request. The word that names the request is lost to a dropout of 1.1 s, after "a second".\n\nThe desk does not infer a class from a word it cannot hear. A request is accepted only under a named class. The body of the request is to be read against the class definitions kept by the Verification copy.\n\nNot copied to Oversight: the caller addresses the Bureau, not the Directorate.\nNo reply is possible; the number is withheld.\n— Retention Desk',
      },
    },
    operator: {
      screenTitle: 'Classes of Request',
      visualType: 'document-forensics',
      whatTheySee: 'A terminal holding the retention desk’s classes of request, and the entry for the call in the Bureau line log.',
      taskPrompt: 'Read each class against what the Observer reads of her request: who may take part, whether they attested before, and what the request is meant to do. File the one class that fits every condition, named in full.',
      dataPayload:
        'The desk accepts a request only under a class named in full.\nQUESTION: What does the voicemail ask the Bureau for?\nANSWER (THE CLASS OF REQUEST, NAMED IN FULL): [ ... ]',
      interactiveData: {
        gmBroadcast: true,
        requiresPuzzle: 'P20',
        recallPrompt: 'Recall which check was left unticked on the seal slip.',
        documentText:
          'BUREAU RETENTION DESK — CLASSES OF REQUEST (Verification copy)\n\nEXTENSION      One officer. Lengthens the retention of a closed file. Needs no custodian.\nAPPEAL         One reviewer, named by the Directorate. Contests a disposal.\nAMENDMENT      The same three custodians, in writing. Corrects a closed record.\nSECOND QUORUM  A further three, none of whom attested the first. Convened to finish a check the first left open.\n\nLINE LOG 29 SEP 2026\n19:06:12  IN  withheld  41 s  voicemail  not answered\n\nA request that fits one class in every condition is entered under that class. A request that fits two or none is returned.',
      },
    },
    chain: {
      observerProduces: 'The transcript, with the point where the line fails marked.',
      analystTransforms: 'The desk’s own account of why the call could not be classified, and the rule it works by.',
      operatorExecutes: 'Reads the request against each class definition and files the class that fits every condition.',
    },
    failure: {
      wrongStep: 'Naming AMENDMENT because the record is being finished, or APPEAL because a disposal is part of the story.',
      consequence: 'The claim is rejected: AMENDMENT needs the same three custodians, whom she has just called interested, and APPEAL needs one reviewer named by the Directorate.',
      recoveryGuidance: 'Test each class against all of her conditions: who takes part, whether they attested before, and what is left open.',
    },
    hints: [
      'A request is defined by what it needs, not by what it is called. Ask who she wants, from whom, and to do what.',
      'The transcript has a hole exactly where the name of the request should be. The Bureau’s list of classes is what it must fit.',
      'Test each class against what she says: how many people, whether they attested the first time, and whether there is something left open for them to finish.',
      'Two words, the class name as the Bureau prints it in full. It is not the class that corrects a record or the one that contests a disposal.',
    ],
    reveal:
      'She asks for a further three: strangers to the first, with nothing to gain, to finish the check the first left open. She did not ask for a verdict. She asked for witnesses, and you are them.',
    clue: {
      clueText:
        'She does not say what to choose. What remains is the word for what three people hold between them when a fact is closed, and the last room is built to answer only when all three speak at once.',
      format: 'Inference',
    },
    exhibits: ['EVID-P36', 'EVID-P36-B'],
    uses: ['P04', 'P20', 'P30', 'P31'],
    mech: 'document-forensics',
    solution:
      'Observer reads the voicemail transcript: she holds no copy; the first three "can be accused of being interested"; she asks for "a second [dropout]": three people not in the building who attested nothing, with one check still open. Analyst reads RD-26-0929/1: the word is lost, the desk accepts only a named class and reads the body of the request against the class list. Operator tests the classes: EXTENSION and APPEAL need one person; AMENDMENT needs the same three; SECOND QUORUM is a further three who did not attest the first, convened to finish a check the first left open. Recalls: P30 the voice, P31 zero copies, P20 the unticked check. Answer: SECOND QUORUM.',
    redHerring: {
      id: 'RH-AMEND',
      theory: 'She is asking the Bureau to amend the record: the check is open, so the record needs correcting.',
      refutedBy: 'EVID-P36-B: AMENDMENT is the same three custodians in writing; she says the first three can be accused of being interested and asks for three who attested nothing.',
    },
    recontext: {
      what: 'Why the case reached you',
      from: 'The team was handed the case by chance.',
      to: 'The team is the second set she asked for, because the first could be accused of being interested.',
    },
  },

  /* ─────────────────────────────── P37 ─────────────────────────────── */
  {
    code: 'P37',
    title: 'The Word',
    answer: 'NEXUS',
    alts: ['THE NEXUS', 'NEXUS PROTOCOL'],
    redact: false,
    format: 'ONE WORD (the name of the system)',
    question: 'What closes a fact when three keepers agree?',
    narrativeObjective:
      'Every fact in this case was closed by the same rule, and the last screen speaks in its voice. Establish its name by reading the whole sentence it is made of, one clause to a seat.',
    observer: {
      screenTitle: 'First Clause',
      visualType: 'memory-recall',
      whatTheySee: 'A terminal showing the first phase of the last screen. It speaks in the first person.',
      taskPrompt: 'Read your clause aloud, word for word. Then listen to the other two clauses and say whether the sentence is whole.',
      dataPayload:
        'BOSS PHASE 1 — CLAUSE I.\n"I am the archive. I am the echo. A fact is closed when three keepers, each holding a separate copy of it,"\nRead this aloud. The sentence continues on the other two seats.',
      interactiveData: {
        phase: 1,
        finalBoss: true,
        requiresAllRoles: true,
        simultaneousSubmission: true,
        requiresPuzzle: 'P04',
        recallPrompt: 'Recall how many attestations close a record.',
      },
    },
    analyst: {
      screenTitle: 'Second Clause',
      visualType: 'memory-recall',
      whatTheySee: 'A terminal showing the first phase of the last screen. It holds a second clause.',
      taskPrompt: 'Read your clause aloud, word for word, after the Observer has read theirs. Say what the clause forbids each keeper.',
      dataPayload:
        'BOSS PHASE 1 — CLAUSE II.\n"... none able to see the others’ copies, each says the same, alone, in their own hand. I am the sum. I am the convergence."\nRead this aloud, second.',
      interactiveData: {
        phase: 1,
        finalBoss: true,
        requiresAllRoles: true,
        simultaneousSubmission: true,
        requiresPuzzle: 'P31',
        recallPrompt: 'Recall how many copies Dr. Vey held, and why that was the point.',
      },
    },
    operator: {
      screenTitle: 'Third Clause and Closing Form',
      visualType: 'final-boss',
      whatTheySee: 'A terminal showing the first phase of the last screen and a five-letter input.',
      taskPrompt: 'Read the closing form aloud after the other two clauses. Check the name you mean against the headers of the registers you have read, then wait until all three phones are lined up before you commit.',
      dataPayload:
        'BOSS PHASE 1 — CLAUSE III. "I am the key. I am the lock. I am the..."\nFORM CL-12 — CLOSING OF A FACT.\nA fact is closed when three keepers agree. CLOSED BY: ______ (the protocol’s own name, as on the session register of 2021; registry headers carry the prefix NX).\nQUESTION: What closes a fact when three keepers agree?\nANSWER (ONE WORD, THE NAME OF THE SYSTEM, SUBMITTED WITH THE OTHER TWO SEATS): [ _ _ _ _ _ ]',
      interactiveData: {
        phase: 1,
        finalBoss: true,
        requiresAllRoles: true,
        simultaneousSubmission: true,
        requiresPuzzle: 'P29',
        recallPrompt: 'Recall what the thing everyone took for a mind turned out to be.',
      },
    },
    chain: {
      observerProduces: 'Clause I of the closing sentence, read aloud.',
      analystTransforms: 'Clause II, read aloud, and what it forbids each keeper.',
      operatorExecutes: 'Reads the closing form, checks the name against the registry headers, and submits it with the other two seats.',
    },
    failure: {
      wrongStep: 'Submitting before all three seats are ready, or typing what the thing is rather than its name.',
      consequence: 'The screen holds: nothing closes unless all three submit together, and a description is not a name.',
      recoveryGuidance: 'Read the three clauses in order, then line the three phones up. The blank takes the name the registers carry, not a description of it.',
    },
    hints: [
      'The last question is about the whole case, not one document. Ask what rule has closed every fact you have filed.',
      'Each seat holds one clause of the same sentence. Read all three aloud in order. The Operator’s form holds the blank.',
      'The blank takes the name the session register, the roster and the design note all carry. It is a name, not a description of what the thing is.',
      'One word, five letters, the name of the system the whole case has been about. Submit it with the other two seats ready.',
    ],
    reveal:
      'Nothing was defeated. Three agreed. That is all the system ever was: a rule, a mirror, and the people who hold it. What you chose is not recorded.',
    clue: {
      clueText:
        'The record stands closed, and it has nothing more to say. What the three of you chose to do with it is not written here.',
      format: 'Narrative',
    },
    exhibits: ['EVID-P37'],
    uses: ['P04', 'P29', 'P31', 'P35', 'P36'],
    mech: 'synthesis',
    solution:
      'Three seats each read one clause of the closing sentence: Observer, keepers each holding a separate copy; Analyst, none able to see the others’ copies, each saying the same alone; Operator, Form CL-12 with a blank for the protocol’s own name. The name is on the 2021 session register and on every registry header (NX), and P29 established it is a records protocol, not a mind. P04 supplies the three; P31 the design that left the designer holding no copy. All three submit together. Answer: NEXUS. What was chosen at check 5 is not recorded.',
    redHerring: {
      id: 'RH-PROTOCOL-WORD',
      theory: 'The word is PROTOCOL, because that is what the system turned out to be.',
      refutedBy: 'EVID-P37 / Form CL-12: the blank is "CLOSED BY", the protocol’s own name as the session register carries it; a description is not a name.',
    },
    recontext: {
      what: 'What the voice on the last screen is',
      from: 'The voice is an intelligence that must be beaten or obeyed.',
      to: 'The voice is the rule speaking in the first person: a mirror that says only what three keepers agree is true.',
    },
    revelation: 'The "entity" is the rule itself: it closes a fact only when three agree, and it records nothing of what you chose.',
  },
]

/* ────────────────────────────── artifacts ────────────────────────────── */

export const artifacts = [
  {
    id: 'EVID-P33',
    node: 'P33',
    kind: 'document',
    title: 'Bulletin MP-24-018, annotated',
    description: 'The Bureau’s bulletin of 18 October 2024, clause by clause, with the records that bear on each clause.',
    source: 'Working copy, second set of custodians',
    custodian: 'Second set of custodians',
    date: '2026-09-30',
    reliability: 'derived',
    proves: [
      'The bulletin’s time clause is supported by the guard desk (17:28) and the entrance image (17:29)',
      'Eight records place L.V. after 17:30',
    ],
    doesNotProve: [
      'Who chose the bulletin’s wording',
      'Where L.V. is now',
      'That she was in the building continuously between 17:30 and her return',
    ],
    relates: [
      { to: 'EVID-M01-B', kind: 'explains', note: 'The original bulletin, unannotated.' },
      { to: 'EVID-P23', kind: 'corroborates', note: 'List A item 2 is the 19:45 corridor image.' },
      { to: 'EVID-P30', kind: 'corroborates', note: 'List A item 8 is the 2026 voicemail.' },
    ],
    condition: 'NORMAL',
    text:
      'BULLETIN MP-24-018, 18 OCT 2024 09:40, annotated. C1 Dr. L. Vey left the Admin Building. C2 at 17:30 on 17 October. [Annotation: guard desk GD-241017 17:28 OUT L.V.; CAM-01 17:29.] C3 She has not been seen since. [Annotation: contradicted by List A, items 1 to 8.] C4 Any information to the Oversight Officer, A. Vale. C5 Issued under the authority of the Directorate. LIST A: 1 19:32 S01-TUN, no badge. 2 19:45 CAM-E3 corridor image. 3 21:47 seal slip, bound L.V. 4 04:17 E-LAB-D1 badge and code. 5 early 18 Oct, Selim, west corridor, own hand. 6 05:00 REC-19, tower strikes five. 7 05:52 S01-TUN OUT. 8 29 SEP 2026 voicemail. Excluded: library slip 44721 (true time 17:22).',
    render: {
      form: 'doc',
      stock: 'bond',
      head: { org: 'BUREAU OF CONTINUITY RECORDS', unit: 'OFFICE OF OVERSIGHT', form: 'BULLETIN', control: 'MP-24-018', revision: 'ANNOTATED' },
      title: 'MISSING PERSON · BULLETIN · ANNOTATED',
      fields: [['ISSUED', '18 OCT 2024  09:40'], ['SUBJECT', 'DR. L. VEY']],
      blocks: [
        { t: 'p', text: 'C1  Dr. L. Vey left the Admin Building' },
        { t: 'p', text: 'C2  at 17:30 on 17 October.' },
        { t: 'hand', text: 'GD-241017  17:28 OUT · CAM-01  17:29', dx: 40, dy: 2, rot: -2, color: 'blue' },
        { t: 'p', text: 'C3  She has not been seen since.' },
        { t: 'hand', text: 'contradicted: list A, 1 to 8', dx: 40, dy: 2, rot: -2, color: 'red' },
        { t: 'p', text: 'C4  Any information to the Oversight Officer, A. Vale.' },
        { t: 'p', text: 'C5  Issued under the authority of the Directorate.' },
        { t: 'gap', h: 8 },
        { t: 'table', cols: ['#', 'TIME', 'RECORD'], widths: [0.07, 0.22, 0.71], rows: [
          ['1', '19:32', 'S01-TUN open/close, maintenance key, no badge'],
          ['2', '19:45', 'CAM-E3, Engineering corridor: figure in her coat'],
          ['3', '21:47', 'Seal slip SQ-24-001, bound L.V.'],
          ['4', '04:17', 'E-LAB-D1 badge read and code'],
          ['5', 'early 18 Oct', 'West corridor: M. Selim, own hand'],
          ['6', '05:00', 'REC-19: tower strikes five'],
          ['7', '05:52', 'S01-TUN, one OUT, manual entry'],
          ['8', '29 SEP 2026', 'Voicemail, Bureau line, withheld number'],
        ] },
        { t: 'gap', h: 6 },
        { t: 'p', text: 'Excluded: library slip 44721 (stamped 21:22; true time 17:22).' },
      ],
      foot: 'WORKING COPY · SECOND SET · PAGE 1 OF 1',
      damage: null,
    },
  },
  {
    id: 'EVID-P34',
    node: 'P34',
    kind: 'document',
    title: 'The Night of 17–18 October 2024, in order',
    description: 'A timeline table of fourteen events with the record that fixes each.',
    source: 'Central hub terminal (print)',
    custodian: 'Second set of custodians',
    date: '2026-09-30',
    reliability: 'derived',
    proves: [
      'Selim’s sighting in the west corridor is fixed by a door controller at 04:20:41 and by her own statement',
      'The events of the night are continuous from 17:29 to 10:00',
    ],
    doesNotProve: [
      'Who walked Dr. Vey through the west corridor',
      'What was said on the antenna deck',
      'Where she was between 19:45 and 21:47',
    ],
    relates: [
      { to: 'EVID-P24B', kind: 'corroborates', note: 'The 04:17 badge read sits two events before the sighting.' },
      { to: 'EVID-P28', kind: 'corroborates', note: 'The 05:00 strike sits two events after the start of questioning.' },
      { to: 'EVID-P33', kind: 'explains', note: 'List A events appear in order here.' },
    ],
    condition: 'NORMAL',
    text:
      'THE NIGHT, 17-18 OCT 2024, IN ORDER (building time). 17:29 main entrance, figure with bag leaving (CAM-01; guard log 17:28). 18:42 café receipt, cash. 19:32 S01-TUN open/close, no badge. 19:45 CAM-E3, Engineering corridor, figure in her coat. 21:47 seal SQ-24-001 applied. 22:45 lobby clock set (LC-01). 04:15 east-lab camera bank off (ticket MT-24-3302). 04:17 E-LAB-D1 badge and code. 04:20 west corridor: Selim sees Vey being walked toward the Engineering Block (W-CORR-D2 04:20:41; statement "about twenty past four"). 04:30 questioning begins, antenna deck (REC-19). 05:00 tower strikes five. 05:52 S01-TUN OUT. 09:40 bulletin MP-24-018. 10:00 disposal under DN-24-107.',
    render: {
      form: 'doc',
      stock: 'ledger',
      head: { org: 'SECOND SET OF CUSTODIANS', unit: 'WORKING RECORD', form: 'EVENT TIMELINE', control: 'SQ-24-001/T', revision: '' },
      title: 'THE NIGHT · 17–18 OCT 2024',
      fields: [['CLOCK', 'BUILDING TIME'], ['EVENTS', '14']],
      blocks: [
        { t: 'table', cols: ['TIME', 'EVENT', 'FIXED BY'], widths: [0.1, 0.5, 0.4], hi: [8], rows: [
          ['17:29', 'Leaves by the main entrance', 'CAM-01; guard log 17:28'],
          ['18:42', 'Tea and a sandwich, in town', 'Café receipt (cash)'],
          ['19:32', 'S01-TUN opens and closes', 'Door sensor, no badge'],
          ['19:45', 'Back inside, Engineering corridor', 'CAM-E3 still'],
          ['21:47', 'Seal SQ-24-001 applied', 'Seal slip; guard log'],
          ['22:45', 'Lobby clock set to the seal time', 'Card LC-01'],
          ['04:15', 'East-lab camera bank off', 'UPS log; ticket MT-24-3302'],
          ['04:17', 'E-LAB-D1 badge and code', 'Badge log'],
          ['04:20', 'Walked toward the Engineering Block', 'W-CORR-D2 04:20:41; Selim'],
          ['04:30', 'Questioning begins, antenna deck', 'REC-19 start'],
          ['05:00', 'Tower strikes five', 'REC-19'],
          ['05:52', 'S01-TUN, one OUT', 'Door sensor, manual entry'],
          ['09:40', 'Bulletin MP-24-018 issued', 'Bulletin'],
          ['10:00', 'Disposal runs', 'DN-24-107; boxes empty'],
        ] },
        { t: 'gap', h: 8 },
        { t: 'hand', text: 'selim: "about twenty past four"', dx: 30, dy: 4, rot: -2, color: 'blue' },
      ],
      foot: 'WORKING RECORD · SECOND SET · PAGE 1 OF 1',
      damage: null,
    },
  },
  {
    id: 'EVID-P35',
    node: 'P35',
    kind: 'document',
    title: 'Record of Choice, Check 5',
    description: 'A form for the fifth check of seal SQ-24-001 listing three options, none ticked.',
    source: 'Final boss chamber terminal',
    custodian: 'Bureau of Continuity Records',
    date: '2021-12-04',
    reliability: 'primary',
    proves: [
      'Check 5 of SQ-24-001 was reserved for a second set of custodians',
      'The charter closes a check when three custodians confirm it',
      'The form takes no tick; the choice is not kept',
    ],
    doesNotProve: [
      'Which option the second set took',
      'That any option is preferred by the charter',
      'That the first set could have closed the check',
    ],
    relates: [
      { to: 'EVID-M01', kind: 'explains', note: 'The seal slip’s unticked fifth check, for which this form exists.' },
      { to: 'EVID-P20', kind: 'explains', note: 'The unticked check identified at the dome.' },
    ],
    condition: 'NORMAL',
    text:
      'RECORD OF CHOICE, SQ-24-001, CHECK 5 (CHOICE). Prepared for the second set of custodians. [ ] FILE. [ ] SEAL. [ ] RETURN. This form takes no tick. What is chosen is held by those who chose it. Charter CL. 9: a check is closed when three custodians confirm it. The word entered by the verifying seat is AGREE. Entered before all three have confirmed, it is void. First set: checks 1 2 3 4 6 7 ticked; check 5 left for the second set. Second set: OBSERVATION [ ] ANALYSIS [ ] VERIFICATION [ ].',
    render: {
      form: 'doc',
      stock: 'bond',
      head: { org: 'BUREAU OF CONTINUITY RECORDS', unit: 'NEXUS REGISTRY', form: 'RECORD OF CHOICE', control: 'NX/CHO/SQ-24-001', revision: 'CHECK 5' },
      title: 'RECORD OF CHOICE',
      fields: [['SEAL', 'SQ-24-001'], ['CHECK', '5 · CHOICE'], ['FOR', 'SECOND SET']],
      blocks: [
        { t: 'mono', lines: ['[   ]  FILE', '[   ]  SEAL', '[   ]  RETURN'] },
        { t: 'gap', h: 10 },
        { t: 'p', text: 'This form takes no tick. What is chosen is held by those who chose it.' },
        { t: 'gap', h: 8 },
        { t: 'p', text: 'CHARTER CL. 9. A check is closed when three custodians confirm it. The word entered by the verifying seat is AGREE. Entered before all three have confirmed, it is void.' },
        { t: 'gap', h: 8 },
        { t: 'table', cols: ['SET', 'OBSERVATION', 'ANALYSIS', 'VERIFICATION'], widths: [0.22, 0.26, 0.26, 0.26], rows: [
          ['FIRST', '21:44 R.N.', '21:45 M.C.', '21:47 M.S.'],
          ['SECOND', '[   ]', '[   ]', '[   ]'],
        ] },
        { t: 'stamp', text: 'NOT RETAINED', color: 'blue', rot: 5, dx: 280, dy: -190 },
      ],
      foot: 'NX REGISTRY · TAKES NO TICK · PAGE 1 OF 1',
      damage: null,
    },
  },
  {
    id: 'EVID-P36',
    node: 'P36',
    kind: 'document',
    title: 'Voicemail Transcript, 29 September 2026',
    description: 'The Bureau line transcript of a 41-second voicemail from a withheld number, with one dropout.',
    source: 'Observation deck broadcast channel (print)',
    custodian: 'Bureau of Continuity Records',
    date: '2026-09-29 19:06',
    reliability: 'primary',
    proves: [
      'A voice naming itself Lina Vey asked the Bureau for a second set of three, none of whom attested the first',
      'She states she holds no copy and that one check is still open',
      'The word naming the request is lost to a 1.1 s dropout',
    ],
    doesNotProve: [
      'Where she called from',
      'What she hoped the second set would choose',
      'That the Directorate has heard the message',
    ],
    relates: [
      { to: 'EVID-P36-B', kind: 'explains', note: 'The retention desk’s message about the call and the class of request.' },
      { to: 'EVID-P30', kind: 'corroborates', note: 'The voicemail audio identified at the transmitter spire.' },
    ],
    condition: 'PARTIAL',
    text:
      'BUREAU LINE, VOICEMAIL TRANSCRIPT. 29 SEP 2026, withheld number, 00:41. [tone] "This is Lina Vey. It is the twenty-ninth of September. I am leaving this on the Bureau line because it is the one line nobody forwards. I hold no copy of anything. That was always the design. The first three can be accused of being interested. They are. So am I. I am asking the Bureau for a second [DROPOUT 1.1 s]: three people who were not in that building, who attested nothing, who have nothing to gain. One check is still open, and it is not mine to tick. I will not tell them what to do with it." [click] Desk entry, in hand: class SECOND QUORUM.',
    render: {
      form: 'doc',
      stock: 'thermal',
      head: { org: 'BUREAU OF CONTINUITY RECORDS', unit: 'RETENTION DESK', form: 'LINE TRANSCRIPT', control: 'RD-26-0929/T', revision: '' },
      title: 'VOICEMAIL · BUREAU LINE',
      fields: [['RECEIVED', '29 SEP 2026  19:06'], ['NUMBER', 'WITHHELD'], ['LENGTH', '00:41']],
      blocks: [
        { t: 'mono', lines: ['[tone]'] },
        { t: 'p', text: '"This is Lina Vey. It is the twenty-ninth of September. I am leaving this on the Bureau line because it is the one line nobody forwards.' },
        { t: 'p', text: 'I hold no copy of anything. That was always the design.' },
        { t: 'p', text: 'The first three can be accused of being interested. They are. So am I.' },
        { t: 'p', text: 'I am asking the Bureau for a second [DROPOUT 1.1 s]: three people who were not in that building, who attested nothing, who have nothing to gain. One check is still open, and it is not mine to tick.' },
        { t: 'p', text: 'I will not tell them what to do with it."' },
        { t: 'mono', lines: ['[click]'] },
        { t: 'hand', text: 'desk entry: class SECOND QUORUM', dx: 40, dy: 6, rot: -2, color: 'blue' },
      ],
      foot: 'RETENTION DESK · AS RECEIVED · PAGE 1 OF 1',
      damage: null,
    },
  },
  {
    id: 'EVID-P36-B',
    node: 'P36',
    kind: 'note',
    title: 'Retention Desk Message RD-26-0929/1',
    description: 'The retention desk’s internal message about the 29 September 2026 call, with the classes of request.',
    source: 'Observation deck broadcast channel',
    custodian: 'Bureau of Continuity Records',
    date: '2026-09-30 08:10',
    reliability: 'primary',
    proves: [
      'The Bureau accepts a request only under a named class',
      'The call was not answered and the number is withheld',
      'The desk did not copy the message to Oversight',
    ],
    doesNotProve: [
      'That the desk acted on the request',
      'Who the caller was beyond what she said',
    ],
    relates: [
      { to: 'EVID-P36', kind: 'explains', note: 'The desk’s account of the call transcribed there.' },
    ],
    condition: 'NORMAL',
    text:
      'BUREAU RETENTION DESK, MESSAGE RD-26-0929/1. Received on the Bureau line 29 SEP 2026 19:06, withheld number, 41 s. Desk closed at 18:00; not answered. The caller names herself and makes one request; the word that names it is lost to a dropout of 1.1 s after "a second". A request is accepted only under a named class. Classes: EXTENSION (one officer, lengthens retention); APPEAL (one reviewer named by the Directorate, contests a disposal); AMENDMENT (the same three custodians, in writing, corrects a record); SECOND QUORUM (a further three, none of whom attested the first, convened to finish a check the first left open). Not copied to Oversight. No reply possible. Retention Desk.',
    render: {
      form: 'note',
      stock: 'card',
      head: null,
      title: 'RD-26-0929/1 · RETENTION DESK',
      fields: [['RECEIVED', '29 SEP 2026 19:06'], ['NUMBER', 'WITHHELD']],
      blocks: [
        { t: 'mono', lines: ['Desk closed 18:00. Not answered.', 'Played once; transcribed as received.', 'One request; the word that names it', 'is lost to a dropout of 1.1 s.'] },
        { t: 'gap', h: 6 },
        { t: 'table', cols: ['CLASS', 'WHO', 'FOR'], widths: [0.26, 0.37, 0.37], rows: [
          ['EXTENSION', 'one officer', 'lengthens retention'],
          ['APPEAL', 'one reviewer (Directorate)', 'contests a disposal'],
          ['AMENDMENT', 'the same three, in writing', 'corrects a record'],
          ['SECOND QUORUM', 'a further three, none attested', 'finishes a check left open'],
        ] },
        { t: 'gap', h: 6 },
        { t: 'mono', lines: ['Not copied to Oversight.', 'No reply possible. Number withheld.'] },
        { t: 'sig', name: 'Retention Desk' },
      ],
      foot: 'BUREAU RETENTION DESK · RD-26-0929/1',
      damage: null,
    },
  },
  {
    id: 'EVID-P37',
    node: 'P37',
    kind: 'document',
    title: 'Certificate of Closure',
    description: 'A certificate for check 5 of seal SQ-24-001, recording that it was closed by a second set of three.',
    source: 'Final boss arena terminal (print)',
    custodian: 'Bureau of Continuity Records',
    date: '2026-09-30',
    reliability: 'derived',
    proves: [
      'All seven checks of SQ-24-001 are now closed',
      'Check 5 was closed by a second set of three custodians',
    ],
    doesNotProve: [
      'Which option the second set chose',
      'That any record of the choice exists',
      'Where Dr. Vey is now',
    ],
    relates: [
      { to: 'EVID-P35', kind: 'derives', note: 'The Record of Choice this certificate closes.' },
      { to: 'EVID-M01', kind: 'derives', note: 'The seal slip whose fifth check was left open.' },
    ],
    condition: 'NORMAL',
    text:
      'CERTIFICATE OF CLOSURE. Seal SQ-24-001, applied 17 OCT 2024 21:47. Check 5 (CHOICE), left open by the first set, was closed on 30 SEP 2026 by a second set of three: OBSERVATION, ANALYSIS, VERIFICATION. Checks 1 to 7: closed. Choice entered: none recorded. The rule: a fact is closed when three independent keepers, each holding a separate copy and none able to see the others’, say the same. What three do with a closed record is not recorded here.',
    render: {
      form: 'doc',
      stock: 'vellum',
      head: { org: 'BUREAU OF CONTINUITY RECORDS', unit: 'NEXUS REGISTRY', form: 'CERTIFICATE OF CLOSURE', control: 'SQ-24-001/C5', revision: '' },
      title: 'CERTIFICATE OF CLOSURE',
      fields: [['SEAL', 'SQ-24-001'], ['APPLIED', '17 OCT 2024 21:47'], ['CLOSED', '30 SEP 2026']],
      blocks: [
        { t: 'p', text: 'Check 5 (CHOICE), left open by the first set, was closed by a second set of three custodians.' },
        { t: 'gap', h: 8 },
        { t: 'table', cols: ['CHECK', 'STATE'], widths: [0.5, 0.5], hi: [4], rows: [
          ['1  ORIGIN', 'CLOSED'],
          ['2  CONNECTION', 'CLOSED'],
          ['3  STRUCTURE', 'CLOSED'],
          ['4  MEMORY', 'CLOSED'],
          ['5  CHOICE', 'CLOSED BY SECOND SET'],
          ['6  TRUTH', 'CLOSED'],
          ['7  FINALITY', 'CLOSED'],
        ] },
        { t: 'gap', h: 8 },
        { t: 'p', text: 'Choice entered: none recorded.' },
        { t: 'p', text: 'A fact is closed when three independent keepers, each holding a separate copy and none able to see the others’, say the same.' },
        { t: 'gap', h: 10 },
        { t: 'mono', lines: ['OBSERVATION  ____________________', 'ANALYSIS     ____________________', 'VERIFICATION ____________________'] },
        { t: 'stamp', text: 'CLOSED', color: 'blue', rot: -8, dx: 300, dy: -250 },
        { t: 'hand', text: 'what three do with it is not recorded', dx: 30, dy: 6, rot: -2, color: 'black' },
      ],
      foot: 'NX REGISTRY · RET 30Y · PAGE 1 OF 1',
      damage: null,
    },
  },
]
