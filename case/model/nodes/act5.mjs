// ACT V — HIDDEN TRUTH. What was done to her, and what NEXUS is.
// P27 P27b P28 P29 M04 P30 P31 P32

export const newFacts = [
  'Disposal Notice DN-24-107 schedule has exactly two items: (1) NX-037 operations file, boxes 1 to 3 (Archive); (2) magnetic tape 7, recorder log ref R-94-07 (shaft S-3). It states it "reaches the holdings listed and no others". It lists no negatives, prints or camera material.',
  'The Observation copy consists of negatives and prints from FIELD-CAM-02 (the 1994 handheld second camera, issued to the Observation Officer, Grade 2) and later cameras; the Analysis copy of ledgers, notebooks and recorder tapes incl. tape 7; the Verification copy of boxes 1 to 3 (personnel, incident, custody papers).',
  'Camera-bank controller ELC-BANK: states 0 LIVE (writing to disk), 1 OFF (unpowered), 2 BUFFERING (writing to local buffer), 3 FAULT (powered, writing nothing); inputs 0x01 PWR (toggle), 0x02 REC (scheduler record request), 0x03 FLUSH. Cameras write video in states 0 and 2 only. Trace lines show Rk (state held when input k arrived); the state a line leaves behind is the register on the next line. The log is not checksummed.',
  'Controller command index: [0] 04:15:03 PWR (ticket MT-24-3302); [1] 04:15:09 REC (scheduler); [2] 05:15:00 PWR (facilities restore); [3] 05:15:04 REC (scheduler); [4] DONE. Camera-system log: no frames from the bank between 04:15:03 and 05:15:04. The altered trace shows entry [1] leaving the bank in state 2 (BUFFERING); the table gives 3 (FAULT).',
  'Building alarm log AL-241018: SEQ 3181 04:17 E-LAB-D1 badge read L.V., code accepted; SEQ 3182 04:17 E-LAB-D1 alarm CONTAINMENT BREACH, source MANUAL at the Oversight console, sensors (door forced, motion, tamper) all untripped, "video confirmation attached by operator". A sensor alarm shows at least one tripped sensor; a manual alarm shows none and the log does not name the operator.',
  'The tower bell is driven by master-clock channel VIII, offset +00:00:00, synchronised weekly, on a striking train separate from the lobby dial (LC-01 isolated only the lobby face movement). Channel VII (library server) stays at +04:00:00.',
  'REC-19: Rahal’s micro-cassette recorder, reel A, 70 minutes continuous, log line "REC-19 start 04:30", stop 05:40, clock set to building time at 04:12, carried in the left breast pocket of his jacket. Five fragments were cut for the file: F1 question 1 (tape 7), F2 question 2 (the boxes), F3 question 3 (the custodians), F4 question 4 (C214-X), F5 a repeat of question 3 with the bell at five and dawn ambience. Questioners are two unnamed male voices (VOICE A, VOICE B).',
  'In REC-19 she says: "I hold nothing. That is the design." (F2); "There is no original. There are three, and I am none of them." (F4); "Nobody keeps it all. Not you. Not me." (F5, while the tower strikes five).',
  'Memo NX/CLS/12 (control number) is the classified memo "Entity identification"; the vault class register lists it as class P rev 3 (earlier class A, changed by the designer in 2021). Classes: A AGENT, D DATABASE, S SYSTEM, P PROTOCOL. The redaction bar on the memo covers one word of about eight letters.',
  'Bureau line 4 (retention desk) voicemail: received 29 Sep 2026 02:14:06, external, caller ID withheld, 41 s, unplayed. The internal switch always shows an extension for internal callers. Voice comparison against REC-19 F5: 171 Hz vs 172 Hz, pause pattern consistent; the two interrogating voices do not match.',
  'The voicemail asks for a second quorum ("three who were not there"), says one check was left empty on purpose, and repeats her phrases from REC-19: "I held none of it. That is the design."',
  'Statements of 16 Oct 2024: R.N. holds the negatives; M.C. holds ledgers and tapes; M.S. holds boxes 1 to 3 (moved 16 Oct); A.V. holds no copy (executes writs); L.V. holds no copy (designer).',
  '1994 writ text (D-W form): "Tape 7 is not to be written for the period stated. Tape 7 only. By order." Recorder stop window 03:17 to 03:24, operator did not sign. FIELD-CAM-02 frame B-07 is stamped 03:17:11. 1994 equipment register: FIELD-CAM-02, handheld, issued to the Observation Officer, Grade 2.',
]

export const concerns = [
  'Artifact ids must be uppercase per validate.mjs, so P27b’s exhibit is EVID-P27B (SPINE writes EVID-P27B); my relates point to EVID-P07B and EVID-P24B and other acts must use the same casing.',
  'P27b: the legacy trace is not internally valid (its last input 0x03 is undefined from state 3, and R4 = 4 is not a state). I kept the five-line layout, the "<-- STATE 2" mark on the second line and the full eight-row transition table verbatim, but changed the last input to 0x02 and R4 to 2 so that exactly one line (printed number 1) fails the table.',
  'P28: CANON says the tower strikes five at 05:00, but P02 (LC-01) isolates the lobby clock movement. I assume the bell is on a separate striking train driven by master-clock channel VIII at +00:00:00; P09’s sync table extract should list channel II .',
  'P28/P30 audio scripts use speaker keys VEY, VOICE A and VOICE B; the audio build needs a voice mapping for the two interrogating voices (male, unnamed). P24b’s REC-19 excerpt must keep those voices unnamed or consistent (Vale’s impossible statement is a separate voice clip about 04:17).',
  'P30: the audio artifact’s plain `text` omits the spoken words so that "second quorum" appears only in audio.transcript (and the Analyst’s audioTranscript). Please confirm the compiler treats those as the only transcript fields.',
  'P29: I added a control number (NX/CLS/12) and the width of the redaction bar (one word of about eight letters) to the Observer’s reading of the classified memo; the legacy text only says "stamped classified document with redacted result line".',
  'P32 (three-phone): requiresPuzzle/recallPrompt are set on interactiveData although the three-phone renderer may ignore them; the dependency on P27 is also carried by the register line ("Observation Officer") which only resolves to a person through the P27 copy map.',
]

export const nodes = [
  /* ─────────────────────────────── P27 ─────────────────────────────── */
  {
    code: 'P27',
    title: 'What They Did Not Know',
    answer: 'OBSERVATION',
    alts: ['RAHAL', 'THE OBSERVATION COPY', 'OBSERVATION COPY', 'OBSERVATION CUSTODIAN', 'THE OBSERVATION CUSTODIAN', 'N RAHAL', 'NOOR RAHAL'],
    redact: false,
    format: 'ONE WORD (a custodian’s role)',
    question: 'Which custodian’s copy did the disposal notice not name?',
    narrativeObjective:
      'The Directorate ordered the file destroyed on the strength of one notice. A notice reaches only what it lists. Establish which of the three independent copies of the record the notice never listed.',
    observer: {
      screenTitle: 'Authority Chain Viewer',
      visualType: 'dependency-tree',
      whatTheySee: 'A directed graph of nine nodes joined by arrows in a single chain, left to right. Each node carries a short label.',
      taskPrompt:
        'Read the nine nodes in order, following the arrows. For each, say whether it is an authority, a document, a holding or a time. Say whether anything branches off the chain.',
      dataPayload:
        'GRAPH: ORDER→WRIT→OFFICER→NOTICE→30 YEAR→BOXES→TAPE 7→CERT.→10:00 (9 nodes in directed chain)\nNothing branches off the chain. It ends where a certificate would be filed.',
      interactiveData: {
        nodes: [
          { pos: 1, label: 'ORDER' },
          { pos: 2, label: 'WRIT' },
          { pos: 3, label: 'OFFICER' },
          { pos: 4, label: 'NOTICE' },
          { pos: 5, label: '30 YEAR' },
          { pos: 6, label: 'BOXES' },
          { pos: 7, label: 'TAPE 7' },
          { pos: 8, label: 'CERT.' },
          { pos: 9, label: '10:00' },
        ],
      },
    },
    analyst: {
      screenTitle: 'Disposal Notice Schedule',
      visualType: 'document-forensics',
      whatTheySee: 'The schedule page of Disposal Notice DN-24-107, as filed by the Oversight desk on 15 October.',
      taskPrompt:
        'Read out exactly which holdings the schedule lists, where it says they are kept, and the sentence that limits the notice. Report only what is printed.',
      dataPayload: 'The schedule lists holdings, not people. Recall what the disposal found when it reached the first of them.',
      interactiveData: {
        requiresPuzzle: 'P21',
        recallPrompt: 'Recall what the disposal found when it reached boxes 1 to 3, and who had moved them.',
        documentText:
          'DISPOSAL NOTICE DN-24-107 — SCHEDULE\nISSUED 15 OCT 2024 · OVERSIGHT DESK (A. VALE)\nAUTHORITY: 30-year retention on closed file NX-037, expired 14 OCT 2024.\n\nITEM  HOLDING                                   KEPT AT\n1     NX-037 operations file, boxes 1 to 3      Archive\n2     Magnetic tape 7 (recorder log R-94-07)    Shaft S-3\n\nEXECUTE: 18 OCT 2024, 10:00. Certificate DC-24-107 to follow.\n\nThis notice reaches the holdings listed above and no others. A holding not listed is outside it.',
      },
    },
    operator: {
      screenTitle: 'Copy Map',
      visualType: 'document-forensics',
      whatTheySee: 'The custody copy map: the three copies of the NEXUS record, who keeps each, and what each is made of.',
      taskPrompt:
        'Sort each holding the Analyst reads out into the copy it belongs to. Then check the Observer’s chain: confirm that no node on it reaches the copy you are left with.',
      dataPayload:
        'The map allots every item of the record to exactly one copy. An instruction reaches a copy only through an item it lists.\nQUESTION: Which custodian’s copy did the disposal notice not name?\nANSWER (ONE WORD, a custodian’s role): [ _ _ _ _ _ _ _ _ _ _ _ ]',
      interactiveData: {
        requiresPuzzle: 'P07b',
        recallPrompt: 'Recall which custodian the Connection glyph stands for, and what that copy is made of.',
        documentText:
          'COPY MAP — NEXUS RECORD (allotment of 2021)\n\n⟁ SEEN · OBSERVATION   N. Rahal\n   negatives and prints from FIELD-CAM-02 (1994 handheld, second camera) and later cameras\n⧉ MEASURED · ANALYSIS  M. Carter\n   ledgers, notebooks, recorder tapes (incl. tape 7)\n⬡ FILED · VERIFICATION M. Selim\n   boxes 1 to 3: personnel, incident and custody papers\n\nDESIGNER L.V.: holds no copy.\n\nA copy is reached by an instruction only if the instruction lists an item the copy is made of.',
      },
    },
    chain: {
      observerProduces: 'The nine-node chain of authority and holdings, in order, and the fact that nothing branches off it.',
      analystTransforms: 'The two holdings the notice lists and the sentence that limits it.',
      operatorExecutes: 'Sorts each listed holding into its copy, checks the chain against the map and files the copy left over.',
    },
    failure: {
      wrongStep: 'Naming the custodian whose copy is best known or most important, instead of the one whose items the schedule leaves out.',
      consequence: 'The claim is rejected: the schedule lists items from the other two copies.',
      recoveryGuidance: 'Sort each listed item into its copy on the map. The answer is the copy that receives no item.',
    },
    hints: [
      'This is a question about what an instruction does not cover. Work out which things the notice reached, and see what is left over.',
      'The Analyst holds the list of what the notice names. The Operator holds the allotment of items to copies. The Observer’s board shows the whole chain, from the order to the hour.',
      'Put each listed item into the copy that holds it. Two copies receive an item. A copy is reached only through an item that is listed.',
      'One word: a custodian’s role, as it appears on the copy map. It is not the copy whose papers were in the boxes, and not the one that kept the tapes.',
    ],
    reveal:
      'The notice named boxes 1 to 3 and tape 7. By ten o’clock neither was where it said. The third copy was never listed, so the order could not touch it. Either the Directorate did not know it existed, or it could not reach it.',
    clue: {
      clueText:
        'The notice could not touch the third copy, so the one thing left to manage was what the cameras said. A console in this same lab replays the commands a camera controller was given. Which console is it?',
      format: 'Inference',
    },
    exhibits: ['EVID-P27'],
    uses: ['P07b', 'P21', 'M03'],
    mech: 'chain-of-custody',
    solution:
      'Analyst reads DN-24-107: item 1 boxes 1 to 3, item 2 tape 7, and "no others". Operator’s copy map (from P07b) allots boxes 1 to 3 to the Verification copy (Selim) and tape 7 to the Analysis copy (Carter); the Observation copy (Rahal: negatives from FIELD-CAM-02) receives no item. Observer’s chain has no node for it. The notice cited retention (M03) and found empty boxes (P21); it never listed the third copy. Answer: OBSERVATION.',
    redHerring: {
      id: 'RH-LEDGER',
      theory: 'The notice did not list the ledger, so the Analysis copy escaped it.',
      refutedBy: 'EVID-P27: tape 7 is part of the Analysis copy on the copy map and is listed; a copy is reached through any one of its items.',
    },
    recontext: {
      what: 'Why the disposal failed',
      from: 'It failed only because Selim emptied the boxes before it ran.',
      to: 'The notice could never have reached the third copy: it listed items from only two of the three.',
    },
  },

  /* ─────────────────────────────── P27b ─────────────────────────────── */
  {
    code: 'P27b',
    title: 'The Altered Line',
    answer: '1',
    alts: ['ENTRY 1', 'STEP 1', 'LINE 1', 'ENTRY #1', 'ENTRY1'],
    redact: false,
    format: 'A NUMBER (the number printed on the line)',
    question: 'Which entry of the camera-controller trace was altered?',
    narrativeObjective:
      'The controller that runs the east-lab cameras keeps a trace of every command it was given and the state it held. One record in the trace has been altered to say something the machine could not have done. Establish which one.',
    observer: {
      screenTitle: 'State Machine Trace Reader',
      visualType: 'document-forensics',
      whatTheySee: 'A debug console showing a corrupted execution trace of five lines, each with a register value and an input, and the controller’s state transition table beside it.',
      taskPrompt:
        'Read the trace aloud line by line, exactly as printed, including the mark at the end of one line. Then read the transition table pair by pair. Do not decide which line is wrong yet.',
      dataPayload:
        'EXECUTION TRACE (CORRUPTED):\n\n[0] R0: 0 | INPUT: 0x01\n[1] R1: 1 | INPUT: 0x02 <-- STATE 2\n[2] R2: 2 | INPUT: 0x01\n[3] R3: 3 | INPUT: 0x02\n[4] R4: 2 | DONE\n\nSTATE MACHINE (4 states, 0-3): State 0: INPUT 0x01 -> State 1; State 0: INPUT 0x02 -> State 2; State 1: INPUT 0x02 -> State 3; State 1: INPUT 0x01 -> State 0; State 2: INPUT 0x01 -> State 3; State 2: INPUT 0x03 -> State 1; State 3: INPUT 0x01 -> State 0; State 3: INPUT 0x02 -> State 2',
    },
    analyst: {
      screenTitle: 'Controller Datasheet',
      visualType: 'document-forensics',
      whatTheySee: 'The firmware note for the east-lab camera-bank controller: what the state numbers and input codes mean, and how a trace line is to be read.',
      taskPrompt:
        'Translate the numbers the Observer reads into names. Read out the logging rule exactly, and say which states mean the cameras are writing video.',
      dataPayload: 'The datasheet gives meanings and a reading rule, not times. Recall the command the ticket carried.',
      interactiveData: {
        requiresPuzzle: 'P25',
        recallPrompt: 'Recall which ticket authorised the camera power-down and what command it carried.',
        documentText:
          'CAMERA-BANK CONTROLLER ELC-BANK — FIRMWARE NOTE\n\nSTATES\n0 LIVE        cameras writing to disk\n1 OFF         bank unpowered, nothing written\n2 BUFFERING   cameras writing to local buffer\n3 FAULT       bank powered, nothing written\n\nINPUTS\n0x01 PWR      power toggle\n0x02 REC      record request (scheduler)\n0x03 FLUSH    write buffer, then power off\n\nLOGGING RULE\nA trace line shows the register Rk (the state held when the input arrived) and the input. The state the line leaves behind is the register on the next line.\nThe log is not checksummed. A line is genuine only if the table gives the next register from its own register and input.',
      },
    },
    operator: {
      screenTitle: 'Controller Log Index',
      visualType: 'document-forensics',
      whatTheySee: 'The maintenance ticket and the controller’s command index, giving a time and a source for each line of the trace, with the camera-system log for the same hour.',
      taskPrompt:
        'Set the time and source of each trace line against the ticket and the camera-system log. Tell the team which line asserts something that the ticket and the log both forbid.',
      dataPayload:
        'The index gives a time and a source for each line of the trace. The trace itself is with the Observer.\nQUESTION: Which entry of the camera-controller trace was altered?\nANSWER (A NUMBER): [ _ ]',
      interactiveData: {
        requiresPuzzle: 'P24b',
        recallPrompt: 'Recall the statement about 04:17 that could not be true, and why.',
        documentText:
          'TICKET MT-24-3302\n04:15:03 PWR-OFF ELC-BANK  AUTH D. WRIGHT  EXEC A. VALE\n\nCOMMAND INDEX (same trace)\n[0] 04:15:03  PWR   ticket MT-24-3302\n[1] 04:15:09  REC   scheduler, recurring\n[2] 05:15:00  PWR   facilities restore\n[3] 05:15:04  REC   scheduler, recurring\n[4] —         DONE\n\nCAMERA-SYSTEM LOG, EAST LAB\n04:15:03 bank unpowered. No frames written until 05:15:04.\n\nA power-off ends recording until the bank is powered again.',
      },
    },
    chain: {
      observerProduces: 'The five trace lines and the eight table rows, read out as printed.',
      analystTransforms: 'The meaning of the numbers, the reading rule, and which states write video.',
      operatorExecutes: 'Times each line, tests it against the ticket and the camera log, and files the number of the line that fails.',
    },
    failure: {
      wrongStep: 'Naming the line whose register looks wrong instead of the line whose own register and input the table forbids, or counting from the wrong end.',
      consequence: 'The claim is rejected: it names a line that obeys the table.',
      recoveryGuidance: 'Number the lines as printed. Test each: its register and input in, the next register out, compared with the register on the following line.',
    },
    hints: [
      'This is an integrity question: a log is trusted only where it obeys the machine that wrote it. Look for the one line that could not have been produced.',
      'The Observer reads the lines and the table. The Analyst says what the numbers mean and how a line is to be read. The Operator holds the times and what the ticket allowed.',
      'For each line take its register and its input, find the next register in the table, and compare it with the register printed on the following line. Only one line fails. Then ask whether what it claims agrees with the ticket.',
      'A single number: the number printed in brackets at the start of the line. It is neither the first line of the trace nor the last.',
    ],
    reveal:
      'The controller was told to power off at 04:15:03. One line of its trace says the bank went on recording afterwards. The state table forbids it. Someone wrote that line so that footage could seem to exist at 04:17.',
    clue: {
      clueText:
        'The cameras can give no true record of that hour, and a log can be rewritten. A record carried in a pocket cannot. In this block a chamber keeps a glowing container whose label is a number from one to five. Which chamber is it?',
      format: 'Inference',
    },
    exhibits: ['EVID-P27B'],
    uses: ['P25', 'P24b'],
    mech: 'log-integrity',
    solution:
      'Observer reads the trace and table. Analyst: the logging rule says line k is genuine only if the table gives R(k+1) from Rk and the input; states 0 and 2 write video. Testing: [0] 0+0x01 gives 1 (matches); [1] 1+0x02 gives 3 (FAULT) but the next register is 2 (BUFFERING); [2] 2+0x01 gives 3 (matches); [3] 3+0x02 gives 2 (matches). Only line 1 fails. Operator: the ticket cut power at 04:15:03 and the camera log shows no frames until 05:15:04, while line 1 (04:15:09) claims the bank was recording. Answer: 1.',
    redHerring: {
      id: 'RH-FAULT',
      theory: 'The bank powered itself back on after the command, so the buffering state is genuine.',
      refutedBy: 'EVID-P27B: the table gives FAULT, not BUFFERING, from that register and input; the camera-system log shows no frames until 05:15:04.',
    },
    recontext: {
      what: 'Whether any camera saw the east-lab door at 04:17',
      from: 'The footage might still confirm what the alarm said.',
      to: 'The cameras were dark; the controller’s own trace holds a line written to say they were not.',
    },
  },

  /* ─────────────────────────────── P28 ─────────────────────────────── */
  {
    code: 'P28',
    title: 'Five O’Clock',
    answer: '05:00',
    alts: ['0500', '5:00 AM', '05:00 AM', '5 AM', '5AM', '05.00', '5:00'],
    redact: false,
    format: 'HH:MM, 24-hour clock',
    question: 'What time was it when the tower struck on REC-19?',
    narrativeObjective:
      'Dr. Vey’s questioning was recorded by someone in the room. On the tape a bell rings the hour, but a bell only counts; it does not say morning from evening. Establish the true clock time of the strike.',
    observer: {
      screenTitle: 'Fragment Assembly Console',
      visualType: 'memory-recall',
      whatTheySee: 'A holographic fragment container pulsing with blue light, labelled FRAGMENT 5.',
      taskPrompt:
        'Read the label exactly and say what else you can see on the container. Then recall the earlier excerpt from the same recording and tell the team whose recorder it was and where it was carried.',
      dataPayload:
        'FRAGMENT HEADER: DESIGNATION FRAGMENT 5\nThe container glows steady blue and pulses once every few seconds. Nothing printed on it gives a time of day.',
      interactiveData: {
        requiresPuzzle: 'P24b',
        recallPrompt: 'Recall the excerpt of the recording made in the interrogation room: whose recorder it was and where it was carried.',
      },
    },
    analyst: {
      screenTitle: 'Fragment Playback and Bell Table',
      visualType: 'audio',
      whatTheySee: 'A playback unit for the fragment, with a waveform trace, and an extract of the master-clock table for the tower bell.',
      taskPrompt:
        'Play the fragment. Count the bell strikes and say what else you can hear: voices, footsteps, keys, birds. Then read the bell table and say whether the bell can be trusted to give true time.',
      dataPayload:
        'WAVEFORM: five low bursts about two seconds apart; high chirps between and after them; low room tone throughout.\nPEAKS: 196 Hz (bell) · 3100 Hz (birdsong)\nMASTER CLOCK (extract): channel VIII, tower bell, offset +00:00:00, synchronised weekly. Channel VII, library server, offset +04:00:00.\nThe bell strikes the hour count on a twelve-hour dial: five strikes is five o’clock, morning or evening.',
      interactiveData: {
        audioSpeaker: 'REC-19 · FRAGMENT 5',
        audioTranscript:
          '[footsteps] VOICE A: The custodians. Give me their names. [keys] VEY: You want names. I will tell you what I am sure of. [the tower bell strikes five times] VEY: Nobody keeps it all. Not you. Not me. [birdsong] VOICE B: It is getting light. Finish this. VOICE A: The custodians, Doctor. Again. VEY: Ask me when the sun is up. The answer will be the same. [footsteps]',
      },
    },
    operator: {
      screenTitle: 'Recorder Log',
      visualType: 'document-forensics',
      whatTheySee: 'The pocket recorder’s log card for the reel: start and stop times, where it was carried, and an index of the five fragments cut for the file.',
      taskPrompt:
        'Read the log. Tell the team when the reel started, when it stopped and which full hours fall inside that span. Then test the Analyst’s count of strikes against what the span allows.',
      dataPayload:
        'The log is the recorder’s own. It does not say when the bell sounds.\nQUESTION: What time was it when the tower struck on REC-19?\nANSWER (HH:MM, 24-hour clock): [ _ _ : _ _ ]',
      interactiveData: {
        requiresPuzzle: 'P09',
        recallPrompt: 'Recall what the master clock table said about the library server’s offset, and what that did to the loan time.',
        documentText:
          'POCKET RECORDER LOG — REC-19\nReel A, micro-cassette, 70 minutes. Continuous: no stops, no pauses.\nREC-19 start 04:30\nREC-19 stop  05:40\nRecorder clock set to building time at 04:12.\nCarried: inside the jacket, left breast pocket. Operator: facilities.\n\nFRAGMENTS CUT FOR THE FILE (order as recorded)\nF1  first question: tape 7\nF2  second question: the boxes\nF3  third question: the custodians\nF4  fourth question: C214-X\nF5  repeat of the third question; ambience: window grey, birds\n\nNo other reel was running in the room.',
      },
    },
    chain: {
      observerProduces: 'The label FRAGMENT 5, the container’s state, and the earlier excerpt’s source.',
      analystTransforms: 'The count of bell strikes, what else is on the tape, and whether the bell’s clock is offset.',
      operatorExecutes: 'Sets the strike count against the reel’s start and stop and files the clock time.',
    },
    failure: {
      wrongStep: 'Answering with a time of day in the evening, because a bell that strikes five sounds the same at both fives.',
      consequence: 'The claim is rejected: the reel was not running at that hour.',
      recoveryGuidance: 'Compare the reel’s start and stop with the two possible fives. The recorder log rules one of them out.',
    },
    hints: [
      'A bell counts hours but cannot tell morning from evening. Decide what else, on the tape and in the recorder’s own papers, can.',
      'The Analyst hears the count and holds the bell’s clock table. The Operator holds the span the reel covered. The Observer’s label tells you which part of the reel you are hearing.',
      'Five strikes mean five o’clock. Ask which of the two fives falls between the reel’s start and its stop, and whether the bell’s own clock is offset from true time the way the library’s was.',
      'Hours and minutes with a colon, 24-hour clock. The strike is on the hour, and it falls inside the span the reel ran.',
    ],
    reveal:
      'The tower struck five while she was being questioned, with the first grey light and the first birds on the tape. The reel ran from half past four to twenty to six. It was five in the morning, in the middle of a hold the bulletin never mentions.',
    clue: {
      clueText:
        'Asked who keeps the record, she answered only with who does not. Somewhere behind blast doors, the Directorate kept its own account of what the system is, under a classification stamp. Where is a classified file declassified?',
      format: 'Inference',
    },
    exhibits: ['EVID-P28', 'EVID-P28-B'],
    uses: ['P17b', 'P09', 'P24b'],
    mech: 'audio-forensics',
    solution:
      'Observer: container labelled FRAGMENT 5, recalls the P24b excerpt (Rahal’s jacket recorder, the same reel). Analyst: counts five bell strikes with birds; the bell is on master-clock channel VIII at +00:00:00, so it gives true time (unlike channel VII, +04:00:00, from P09); five strikes is five o’clock. Operator: reel A started 04:30 and stopped 05:40, continuous; the only full hour inside that span is five. P17b’s advice to count rather than trust a dial applies: the count is five, the span fixes the half of the day. Answer: 05:00.',
    redHerring: {
      id: 'RH-EVENING-FIVE',
      theory: 'The strike was at five in the evening, while she was still in the building.',
      refutedBy: 'EVID-P28-B: the reel started at 04:30 and stopped at 05:40, continuously; it was not running at 17:00. The tape carries dawn ambience.',
    },
    recontext: null,
  },

  /* ─────────────────────────────── P29 ─────────────────────────────── */
  {
    code: 'P29',
    title: 'What NEXUS Is',
    answer: 'PROTOCOL',
    alts: ['A PROTOCOL', 'THE PROTOCOL', 'RECORDS PROTOCOL', 'A RECORDS PROTOCOL', 'THE RECORDS PROTOCOL'],
    redact: false,
    format: 'ONE WORD (a kind of thing)',
    question: 'What is NEXUS?',
    narrativeObjective:
      'The Directorate filed it as an entity, and the building’s legend calls it a machine that thinks. A declassified memo says what it is not and hides what it is. Establish what kind of thing NEXUS is, from how it behaved and not from what anyone called it.',
    observer: {
      screenTitle: 'Declassified Briefing',
      visualType: 'document-forensics',
      whatTheySee: 'A stamped classified document with a black bar over its result line.',
      taskPrompt:
        'Read every printed line exactly, including the stamp and the control number. Measure the black bar against the type around it and tell the team roughly how many letters it covers.',
      dataPayload:
        'DOCUMENT: "NEXUS IS NOT A DATABASE ON A DISK. The key relationship."\nThe result line is blacked out. Judging by the type size, the bar covers a single word of about eight letters.',
      interactiveData: {
        requiresPuzzle: 'P28',
        recallPrompt: 'Recall what the questioned speaker said when pressed again and again to name who keeps the record.',
        documentText:
          'CLASSIFIED MEMO // PROJECT NEXUS\nCONTROL NX/CLS/12\n\nSubject: Entity identification\nResult: [REDACTED]\n\nNEXUS IS NOT A DATABASE ON A DISK.\nThe key relationship.',
      },
    },
    analyst: {
      screenTitle: 'Class Register',
      visualType: 'document-forensics',
      whatTheySee: 'The vault’s classification register: the kinds of thing a file may describe, with a test for each, and the entry for the memo’s control number.',
      taskPrompt:
        'Look up the memo’s control number and read its class and revision. Then read out the test attached to each class. Say what the revision note records.',
      dataPayload: 'The register classifies a file by the kind of thing it describes. Recall how many attestations closed a record, and who had to give them.',
      interactiveData: {
        requiresPuzzle: 'P04',
        recallPrompt: 'Recall how many attestations a record needed before it closed, and what happened with two.',
        documentText:
          'VAULT CLASS REGISTER — NEXUS FILES\n\nNX/CLS/12   class P   rev 3\n\nCLASS  NAME        TEST\nA      AGENT       acts on its own; keeps its own state\nD      DATABASE    holds records; answers without keepers\nS      SYSTEM      equipment that runs when powered\nP      PROTOCOL    holds nothing itself; runs only when its parties act; defined by what they agree\n\nREV 3: class changed from A to P by the designer, 2021. The earlier reading is withdrawn.',
      },
    },
    operator: {
      screenTitle: 'Findings Recap',
      visualType: 'document-forensics',
      whatTheySee: 'Your unit’s own filed findings from the first stage: the sessions, the roster and the seal slip.',
      taskPrompt:
        'Read the recap to the team and test each class on the Analyst’s register against it. Say which tests the recorded behaviour of NEXUS passes and which it fails.',
      dataPayload:
        'Each finding below is your own, filed earlier. A kind fits only if its test holds in every one.\nQUESTION: What is NEXUS?\nANSWER (ONE WORD, a kind of thing): [ _ _ _ _ _ _ _ _ ]',
      interactiveData: {
        requiresPuzzle: 'P20',
        recallPrompt: 'Recall which of the seven checks was left unticked on the seal, and why that mattered.',
        documentText:
          'FINDINGS RECAP\n\nSESSIONS 2021 (NX/REG/2021)\nA record closed only with three attestations. With two it stayed open.\n\nROSTER (NX/ROS/2021)\nThree custodians, each holding a separate copy of the record. The designer attests nothing and holds no copy.\n\nSEAL SLIP SQ-24-001\nClosed on three attestations within a minute, bound by the designer. Check 5 unticked: nothing in the system fills it by itself.',
      },
    },
    chain: {
      observerProduces: 'The memo’s printed lines, its control number and the size of the hidden word.',
      analystTransforms: 'The control number into a class and revision, and the test attached to each class.',
      operatorExecutes: 'Tests each class against the recap and files the kind that survives.',
    },
    failure: {
      wrongStep: 'Taking the memo’s subject line, or the building’s legend, as the answer: calling it a mind because it answers.',
      consequence: 'The claim is rejected: the register’s tests rule that kind out, and so does what NEXUS needed in order to run.',
      recoveryGuidance: 'Test each kind against what was recorded: who had to act, what the system held, and who made the choice.',
    },
    hints: [
      'This asks what kind of thing something is. Judge it by what it needed in order to run, not by what it was called.',
      'The Observer holds the memo and the size of the hidden word. The Analyst holds a register of kinds, with a test for each. The Operator holds your earlier findings about how NEXUS ran.',
      'The memo rules out one kind outright. The register gives a test for each of the others. Check each test against the recap: who had to act, what the system held, and who made the choice.',
      'One word of about eight letters, a class named on the register. It is not the memo’s subject word, and it is not the thing the memo says NEXUS is not.',
    ],
    reveal:
      'NEXUS holds nothing and decides nothing. It is a rule: a fact closes when three independent keepers agree, and it runs only when three people act. The mind the Directorate heard in it was the rule speaking back what three people agree is true.',
    clue: {
      clueText:
        'A rule that only repeats what three keepers agree cannot raise an alarm by itself, yet one was raised that night by a human hand. Behind this vault, a core with seven channel lamps gathers everything you have proven. Which core is it?',
      format: 'Inference',
    },
    exhibits: ['EVID-P29'],
    uses: ['P04', 'P05', 'P20', 'P28'],
    mech: 'recontextualisation',
    solution:
      'Observer: memo NX/CLS/12 says NEXUS is not a database on a disk; the bar hides one word of about eight letters; the memo is filed as "entity identification". Analyst: the register gives NX/CLS/12 as class P rev 3, changed from A (agent) by the designer; tests for A, D, S and P. Operator’s recap (P04, P05, P20) shows it closed only on three attestations, held no copy itself, and left check 5 for people to fill. D fails (database already excluded by the memo), A fails (it did not act on its own), S fails (it ran when people acted, not when powered). P fits. P28’s speaker: nobody keeps it all. Answer: PROTOCOL.',
    redHerring: {
      id: 'RH-AI',
      theory: 'NEXUS is an artificial intelligence: the memo is filed under "entity", and the legend says it answers.',
      refutedBy: 'EVID-P29: rev 3 reclassified it from agent to protocol; it answered only what three keepers agreed, and could not run with fewer.',
    },
    recontext: {
      what: 'What NEXUS is',
      from: 'NEXUS is an artificial intelligence that thinks and answers.',
      to: 'NEXUS is a rule for agreement among three keepers; it runs only when three people act and says back only what they agree is true.',
    },
  },

  /* ─────────────────────────────── M04 ─────────────────────────────── */
  {
    code: 'M04',
    title: 'What the Alarm Was',
    answer: 'PRETEXT',
    alts: ['A PRETEXT', 'THE PRETEXT', 'EXCUSE', 'AN EXCUSE'],
    redact: false,
    format: 'ONE WORD (what kind of reason)',
    question: 'What was the 04:17 containment-breach alarm?',
    narrativeObjective:
      'At 04:17 the building logged a containment breach in the east laboratory, two minutes after its cameras were cut. Establish what the alarm was for, from what was known when it was raised and who raised it.',
    observer: {
      screenTitle: 'Vault Delta Convergence Lock',
      visualType: 'meta',
      whatTheySee: 'A convergence lock with seven channels, each lamp lit green, each engraved with the name of a feeder output.',
      taskPrompt:
        'Read the seven engraved channel names and the colour of each lamp. Then read aloud the findings your unit has filed that bear on the east laboratory at 04:17.',
      dataPayload:
        'FEEDERS: X, REINTERPRET, CONNECTION, FILTER, REFLECTION, STRUCTURE, FRAGMENT5_AUTH\nAll seven lamps are green. The lock accepts one claim, from the Operator, once the three of you agree.',
      interactiveData: {
        answers: ['CAMERAS', 'VALE', 'MT-24-3302', 'FORM', '1'],
        hint: 'Five findings. One alarm.',
      },
    },
    analyst: {
      screenTitle: 'Cryptographic Parity Engine 04',
      visualType: 'document-forensics',
      whatTheySee: 'A parity panel confirming the lock, and beside it an extract of the building alarm log for the east laboratory.',
      taskPrompt:
        'Read the two log entries for 04:17 aloud: what read the door, what raised the alarm and what supports it. Say how the log tells a sensor alarm from a manual one.',
      dataPayload:
        'PARITY 04: all seven operations verified. Operators of record: three. Machine contribution: none.\nThe parity result confirms the lock, not the alarm. Recall who executed the ticket that cut the cameras.',
      interactiveData: {
        requiresPuzzle: 'P25',
        recallPrompt: 'Recall the ticket that authorised the camera power-down and who executed it.',
        documentText:
          'BUILDING ALARM LOG AL-241018 — EAST LAB (extract)\n\nSEQ 3181  04:17  E-LAB-D1  BADGE READ L.V.  CODE ACCEPTED\nSEQ 3182  04:17  E-LAB-D1  ALARM: CONTAINMENT BREACH\n          SOURCE: MANUAL, OVERSIGHT CONSOLE\n          SENSORS: door forced —   motion —   tamper —\n          VIDEO CONFIRMATION: attached by operator\n\nA sensor alarm shows at least one tripped sensor. A manual alarm shows none. The log does not record the name of the operator of a manual alarm.',
      },
    },
    operator: {
      screenTitle: 'Alarm Cross-Check',
      visualType: 'contradiction-hunt',
      whatTheySee: 'Six records from your own earlier findings, laid side by side: the ticket, the trace, the alarm, the door, a statement and the camera log.',
      taskPrompt:
        'Set the alarm against the ticket, the trace, the door record and the statement. For each pair, say whether both can be true. Then say what the alarm was for.',
      dataPayload:
        'The flagged records are already known to be unreliable. The others are genuine.\nQUESTION: What was the 04:17 containment-breach alarm?\nANSWER (ONE WORD, what kind of reason): [ _ _ _ _ _ _ _ ]',
      interactiveData: {
        requiresPuzzle: 'P27b',
        recallPrompt: 'Recall which line of the controller trace was altered, and what it claimed.',
        entries: [
          { source: 'TICKET MT-24-3302 · 04:15:03', text: 'PWR-OFF ELC-BANK. AUTH D. WRIGHT. EXEC A. VALE. East-lab cameras unpowered.', flag: false },
          { source: 'CAMERA-SYSTEM LOG · EAST LAB', text: 'No frames written by the bank between 04:15:03 and 05:15:04.', flag: false },
          { source: 'CONTROLLER TRACE · ALTERED LINE', text: 'Bank recorded as BUFFERING after the power-off. Forbidden by the state table.', flag: true },
          { source: 'DOOR RECORD · 04:17', text: 'E-LAB-D1: valid badge read, code accepted. No forced door.', flag: false },
          { source: 'ALARM LOG · 04:17', text: 'Containment breach, east lab. Raised by hand at the Oversight console. No sensor tripped. Video confirmation attached.', flag: false },
          { source: 'STATEMENT · A. VALE', text: 'Reviewed the footage at 04:17 and confirmed the breach.', flag: true },
        ],
      },
    },
    chain: {
      observerProduces: 'The state of the lock and the five filed findings that bear on 04:17.',
      analystTransforms: 'The alarm log entries and the difference between a sensor alarm and a manual one.',
      operatorExecutes: 'Sets the alarm against the ticket, trace, door record and statement and files what the alarm was for.',
    },
    failure: {
      wrongStep: 'Treating the alarm as a genuine breach because it is logged, or as a sensor fault because no sensor tripped.',
      consequence: 'The claim is rejected: a log entry shows only that someone raised the alarm, and a fault would have left a sensor line.',
      recoveryGuidance: 'Ask who raised it, what supported it, and what it allowed that had not been allowed before.',
    },
    hints: [
      'An alarm is a claim that something happened. Ask what it was meant to cause, and whether what it said could have been known.',
      'The Analyst holds the alarm log and how to tell the two kinds of alarm apart. The Operator holds the ticket, the trace, the door record and the statement. Read the times.',
      'Two minutes before the alarm the cameras were cut by a ticket. The alarm cites video that cannot exist, no sensor tripped, and a valid card and code opened the door. Ask what an alarm like that makes possible.',
      'One word naming a stated reason that covers for the real one. It is not a fault and not a drill.',
    ],
    reveal:
      'No sensor tripped and a valid card opened the door. The alarm was raised by hand two minutes after the cameras were cut, and cited footage that could not exist. It gave the Directorate a reason to hold her, and a record to hold her by.',
    clue: {
      clueText:
        'The alarm gave a reason to hold her. Everything that leaves this building, a call, a signal or a message, ends at one structure on the roof. Which structure is it?',
      format: 'Inference',
    },
    exhibits: ['EVID-M04'],
    uses: ['P24b', 'P25', 'P27b'],
    mech: 'synthesis',
    solution:
      'Analyst: alarm log AL-241018 shows a valid badge read and code at 04:17, then a manual breach alarm from the Oversight console with no tripped sensor and "video confirmation attached". Operator: the ticket (P25, executed by Vale) cut the cameras at 04:15:03; the camera log shows no frames; the controller trace line claiming recording was altered (P27b); Vale’s statement that he reviewed footage at 04:17 is impossible (P24b). So the alarm cited a confirmation that could not exist and was raised by hand. It was a stated reason covering a real one. Answer: PRETEXT.',
    redHerring: {
      id: 'RH-REAL-BREACH',
      theory: 'The alarm was a genuine response to an intrusion: she badged into a restricted room at 04:17.',
      refutedBy: 'EVID-M04: the badge and code were valid, no sensor tripped, the alarm was manual, and its video confirmation could not exist.',
    },
    recontext: {
      what: 'The 04:17 alarm',
      from: 'A breach was detected and answered.',
      to: 'An alarm raised by hand, citing footage that could not exist, gave the Directorate its reason.',
    },
  },

  /* ─────────────────────────────── P30 ─────────────────────────────── */
  {
    code: 'P30',
    title: 'The Voicemail',
    answer: 'VEY',
    alts: ['DR VEY', 'DOCTOR VEY', 'LINA VEY', 'DR LINA VEY', 'L VEY', 'LINA'],
    redact: false,
    format: 'SURNAME',
    question: 'Who left the voicemail of 29 September 2026?',
    narrativeObjective:
      'A message is waiting on the Bureau’s retention line, left two years after the night in question. Establish who left it, from the voice, from what the speaker says about the record, and from who could truthfully say it.',
    observer: {
      screenTitle: 'Spire Activation Console',
      visualType: 'timeline-investigation',
      whatTheySee: 'A control panel with 28 answer slots. Twenty-seven are steady; one is pulsing red.',
      taskPrompt:
        'Report the slots as you see them: how many are steady, which one pulses, and anything printed beside it. Then read out the legend printed under the panel.',
      dataPayload:
        'CONSOLE: 28 slots, 27 steady and one pulsing red.\nThe legend printed under the panel reads: STEADY = ANSWER HELD · PULSING = MESSAGE WAITING.',
      interactiveData: {
        entries: [
          { source: 'SLOTS 1 TO 27', text: 'Steady. Each holds an answer from the earlier stages.', flag: false },
          { source: 'SLOT 28', text: 'Pulsing red. Legend: message waiting. One stored message.', flag: false },
        ],
      },
    },
    analyst: {
      screenTitle: 'Voicemail Playback',
      visualType: 'audio',
      whatTheySee: 'A playback unit holding the stored message and its call metadata, and a second panel that compares the voice with the recording from the antenna deck.',
      taskPrompt:
        'Play the message. Report the call metadata exactly, then what the speaker says about the record and about what she holds. Read out the comparison panel and say what it can and cannot show.',
      dataPayload:
        'CALL METADATA: line 4 (Bureau retention desk) · received 29 SEP 2026 02:14 · 41 s · caller ID WITHHELD · trunk EXTERNAL.\nVOICE COMPARISON vs REC-19 fragment 5 (the speaker answering the questions): pitch 171 Hz vs 172 Hz; pause pattern consistent; the two interrogating voices do not match.\nPEAKS: 172 Hz (voice) · 1400 Hz (line tone)\nA match of pitch alone does not name a person.',
      interactiveData: {
        requiresPuzzle: 'P28',
        recallPrompt: 'Recall the voice that answered the questions on the recording from the antenna deck, and what it said about who keeps the record.',
        audioSpeaker: 'BUREAU LINE 4 · 29 SEP 2026',
        audioTranscript:
          '[line hiss] [voicemail beep] This is for the Bureau, the retention desk. You will know the voice. A record you hold was closed two years ago. One check on it was left empty, on purpose. It was never mine to fill. I held none of it. That is the design. The three who closed it cannot judge themselves. I am asking for a second quorum: three who were not there. Do not look for me. [handset click]',
      },
    },
    operator: {
      screenTitle: 'Bureau Line Log',
      visualType: 'document-forensics',
      whatTheySee: 'The Bureau’s log for line 4, and a table of what each person connected with the record said, on 16 October 2024, that they hold.',
      taskPrompt:
        'Read the log entry for the message. Then go down the table and tell the team who could say, truthfully, that they held no part of the record. Check whether any of them also fits the voice.',
      dataPayload:
        'The internal switch always shows the extension of an internal caller, even when the number is withheld.\nQUESTION: Who left the voicemail of 29 September 2026?\nANSWER (SURNAME): [ _ _ _ ]',
      interactiveData: {
        requiresPuzzle: 'P29',
        recallPrompt: 'Recall what NEXUS is, and who must hold a copy of the record for it to close.',
        documentText:
          'BUREAU LINE LOG — LINE 4\n29 SEP 2026  02:14:06  EXTERNAL IN  CLI WITHHELD  VM 41 s  UNPLAYED\nInternal calls always show an extension, even when withheld. This call shows none.\n\nWHAT EACH PERSON SAID THEY HOLD (16 OCT 2024)\nR.N.  Facilities       holds the negatives\nM.C.  Systems Theory   holds ledgers and tapes\nM.S.  Archivist        holds boxes 1 to 3 (moved 16 OCT)\nA.V.  Oversight        holds no copy (executes writs)\nL.V.  Designer         no statement; attests nothing, holds no copy (roster)\n\nVoice reference on file: REC-19 fragment 5.',
      },
    },
    chain: {
      observerProduces: 'The state of the console and the legend: one message waiting.',
      analystTransforms: 'The message, its call metadata, what the speaker claims, and the voice comparison.',
      operatorExecutes: 'Screens the candidates by what each holds and by the line log, and files the one who fits the voice and the words.',
    },
    failure: {
      wrongStep: 'Naming a custodian because they know the record best, or the Oversight officer because the message went to the Bureau’s line.',
      consequence: 'The claim is rejected: the speaker says she held no part of the record, and a custodian holds a copy.',
      recoveryGuidance: 'Remove everyone who holds a copy. Then compare the voice with the one that answered the questions on the antenna deck.',
    },
    hints: [
      'Who spoke is a question about the voice and about what the speaker could truthfully say. A voice can be matched; a claim about what you hold can be tested against the record.',
      'The Analyst hears the message and holds the voice comparison. The Operator holds the line log and what each person said they hold. The Observer confirms that a message is stored.',
      'The speaker says what she held of the record. Remove everyone who holds a copy. Then ask whose voice answered the questions on the earlier recording, and who else holds no copy.',
      'A surname only. The person is named in the case file, is not a custodian, and is not the officer who executed the writs.',
    ],
    reveal:
      'The voice on the line is the one that answered the four questions on the antenna deck, now two years on. She is alive, free to telephone, and still asking for help carrying what was sealed.',
    clue: {
      clueText:
        'She says she held none of it. If three keep the record and she keeps nothing, the Core’s cylinder arrays in its basement should show how many copies exist and whose they are. Where in the Core would that count be kept?',
      format: 'Inference',
    },
    exhibits: ['EVID-P30'],
    uses: ['P28', 'P29'],
    mech: 'audio-forensics',
    solution:
      'Analyst plays the 41-second message (external, caller ID withheld) and reads the voice comparison: it matches the questioned speaker of REC-19 fragment 5 (P28), whom the case file names as the designer; pitch alone is not proof. The speaker says she held none of the record and that this is the design; a custodian cannot say that. Operator’s table: Rahal, Carter and Selim each hold a copy; Vale holds none but is an internal Directorate officer, his voice is not the match, and the call was external; only the designer holds none and attests nothing (P05, P29). Answer: VEY.',
    redHerring: {
      id: 'RH-VALE-CALL',
      theory: 'The caller is the Oversight officer, who also holds no copy.',
      refutedBy: 'EVID-P30: the voice matches the questioned speaker of REC-19 and not the interrogating voices, and the speaker asks for people from outside the Directorate to carry the record.',
    },
    recontext: null,
    revelation: 'She is alive in 2026: a voice on the Bureau line, dated 29 September 2026, two years after the bulletin.',
  },

  /* ─────────────────────────────── P31 ─────────────────────────────── */
  {
    code: 'P31',
    title: 'What She Held',
    answer: 'ZERO',
    alts: ['ZERO COPIES', '0', 'NONE', 'NO COPIES'],
    redact: false,
    format: 'ONE WORD (a number in words)',
    question: 'How many copies of the record did Dr. Vey hold?',
    narrativeObjective:
      'Everyone who questioned her on the antenna deck assumed she held the record. The case file says three copies exist and names who keeps each. Establish how many of the copies were in her hands.',
    observer: {
      screenTitle: 'Memory Sync Test',
      visualType: 'memory-recall',
      whatTheySee: 'A terminal showing a multiple-choice question about earlier findings, with three options labelled A, B and C.',
      taskPrompt:
        'Read the question and all three options aloud exactly as printed. Do not pick an option until the Analyst and the Operator have reported.',
      dataPayload: 'TEST: "How many copies of the record did the designer hold?"\nA) THREE  B) ONE  C) ZERO',
      interactiveData: {
        requiresPuzzle: 'P28',
        recallPrompt: 'Recall what the questioned speaker answered when asked again and again who keeps the record.',
      },
    },
    analyst: {
      screenTitle: 'REC-19 Transcript Lines',
      visualType: 'document-forensics',
      whatTheySee: 'Selected lines of the REC-19 transcript, cut from the reel in the order recorded.',
      taskPrompt:
        'Read the lines to the team in order. Say what each questioner assumes and what the answering voice states in reply. Do not name a number yet.',
      dataPayload: 'The questioners assume; the answering voice states. Read who says what, fragment by fragment.',
      interactiveData: {
        documentText:
          'REC-19 TRANSCRIPT (selected lines)\n\nF2  VOICE A: You designed it. You hold the master copy.\nF2  VEY: I hold nothing. That is the design.\nF3  VOICE A: Then who holds it?\nF3  VEY: Three who do not know what the others hold.\nF4  VOICE B: Where is the original, Doctor?\nF4  VEY: There is no original. There are three, and I am none of them.\nF5  VEY: Nobody keeps it all. Not you. Not me.',
      },
    },
    operator: {
      screenTitle: 'Custody Map',
      visualType: 'document-forensics',
      whatTheySee: 'The custody map for the record: the three copies, who keeps each, and the line for the designer.',
      taskPrompt:
        'Verify the Analyst’s transcript lines against the map. For each copy, say whose it is. Then read the count of copies the map records against the designer.',
      dataPayload:
        'The map is the 2021 allotment, confirmed by each holder on 16 October.\nQUESTION: How many copies of the record did Dr. Vey hold?\nANSWER (ONE WORD, a number in words): [ _ _ _ _ ]',
      interactiveData: {
        requiresPuzzle: 'P07b',
        recallPrompt: 'Recall which custodian each of the three glyphs stands for, and what each copy is made of.',
        documentText:
          'CUSTODY MAP — NEXUS RECORD\n(allotment of 2021; holders confirmed separately 16 OCT 2024)\n\n⟁ SEEN      N. Rahal    confirmed 16 OCT\n⧉ MEASURED  M. Carter   confirmed 16 OCT\n⬡ FILED     M. Selim    confirmed 16 OCT\n\nCopies in existence: 3\nDESIGNER (L. Vey): copies held 0. Attests nothing. Binds a seal; does not keep it.\nA fourth holder is not provided for.',
      },
    },
    chain: {
      observerProduces: 'The question and its three options, read exactly as printed.',
      analystTransforms: 'The transcript: what was assumed of her and what she stated.',
      operatorExecutes: 'Verifies the statement against the custody map and files the count that agrees with both.',
    },
    failure: {
      wrongStep: 'Answering with the number of copies that exist, or with a single copy because her questioners assumed a master.',
      consequence: 'The claim is rejected: the number of copies in existence is a different count from the number in her hands.',
      recoveryGuidance: 'Count only what the custody map assigns to the designer, and check that the answering voice says the same.',
    },
    hints: [
      'This is reasoning from a design, not from one document alone. Ask what the system was built so that nobody could do.',
      'The Analyst reads what was put to her and what she answered. The Operator holds the map of who keeps what. Hear both before you look at the options on the Observer’s terminal.',
      'The questioners assume a master copy in her hands. The map lists every copy that exists and its keeper. Count the ones that are hers, and see whether her answer agrees.',
      'A number written as a word, as printed beside an option. It is smaller than the number of copies that exist.',
    ],
    reveal:
      'Three copies exist and she keeps none of them. Her questioners wanted the one person who held everything; the design guaranteed there was no such person. That is why holding her could not recover the record.',
    clue: {
      clueText:
        'If she holds nothing, what survives is what others kept. One of the three kept something that no order in 1994 reached. A last chamber of the Core is built to hold that survivor. Which chamber is it?',
      format: 'Inference',
    },
    exhibits: ['EVID-P31'],
    uses: ['P28', 'P07b'],
    mech: 'relationships',
    solution:
      'Analyst reads REC-19: the questioners assume a master copy; the answering voice says she holds nothing, that it is the design, and "there are three, and I am none of them". Operator’s custody map (P07b): three copies, held by Rahal, Carter and Selim, each confirmed; designer copies held 0, attests nothing. Observer’s options: THREE is the number in existence, ONE is the questioners’ assumption, ZERO is what the map and the transcript both give. Answer: ZERO.',
    redHerring: {
      id: 'RH-MASTER',
      theory: 'She holds the master copy, which is why she was held and questioned.',
      refutedBy: 'EVID-P31 and EVID-P07B: the map allots every copy to a custodian, and she says in so many words that there is no original.',
    },
    recontext: {
      what: 'What her questioners wanted from her',
      from: 'She is the keeper of the whole record.',
      to: 'She keeps nothing; the record is held by three others, none of whom was in the room.',
    },
  },

  /* ─────────────────────────────── P32 ─────────────────────────────── */
  {
    code: 'P32',
    title: 'The Survivor',
    answer: 'RAHAL',
    alts: ['N RAHAL', 'NOOR RAHAL', 'N. RAHAL'],
    redact: false,
    format: 'SURNAME',
    question: 'Whose camera produced the one record inside the 1994 stop window?',
    narrativeObjective:
      'In 1994 an order stopped the only recorder for a short window. Establish which record, if any, was made inside that window, and whose device made it, using the three pieces you hold between you.',
    observer: {
      screenTitle: 'Observer Shard',
      visualType: 'three-phone',
      whatTheySee: 'The Observer phone shows one shard of the final vault’s message: a line of frame metadata.',
      taskPrompt:
        'Read your shard aloud to the other two, exactly as shown. Do not combine them yet; the Operator submits once all three of you agree.',
      dataPayload: 'SHARD 1 — FRAME METADATA: "B-07 · 03:17:11 · device FIELD-CAM-02".',
      interactiveData: {
        message: 'FRAME B-07 · 03:17:11 · FIELD-CAM-02',
        simultaneousSubmission: true,
        requiresPuzzle: 'P27',
        recallPrompt: 'Recall which custodian’s copy the disposal notice never named, and what that copy is made of.',
      },
    },
    analyst: {
      screenTitle: 'Analyst Shard',
      visualType: 'three-phone',
      whatTheySee: 'The Analyst phone shows one shard of the final vault’s message: a line from the recorder log.',
      taskPrompt:
        'Read your shard aloud to the other two, exactly as shown. Say what the log records about who stopped the recorder.',
      dataPayload: 'SHARD 2 — RECORDER LOG: "TAPE 7 · writing stopped 03:17 to 03:24 · operator did not sign".',
      interactiveData: {
        message: 'TAPE 7 · RECORDER STOPPED 03:17 TO 03:24',
        simultaneousSubmission: true,
        requiresPuzzle: 'P17',
        recallPrompt: 'Recall what the stop tone on the tape showed about how the recorder came to stop.',
      },
    },
    operator: {
      screenTitle: 'Operator Shard and Synthesis',
      visualType: 'three-phone',
      whatTheySee: 'The Operator phone shows the third shard, the 1994 equipment register line, and the synthesis prompt.',
      taskPrompt:
        'Read your shard to the other two. Test the three together: what did the writ reach, did the stop window cover the frame, and who was the device that made it issued to? Submit when all three agree.',
      dataPayload:
        'SHARD 3 — THE WRIT: "Tape 7 is not to be written for the period stated. Tape 7 only. By order of D. Wright."\nEQUIPMENT REGISTER 1994: FIELD-CAM-02 · handheld camera · issued to the Observation Officer, Grade 2.\nQUESTION: Whose camera produced the one record inside the 1994 stop window?\nANSWER (SURNAME): [ _ _ _ _ _ ]',
      interactiveData: {
        message: 'THE WRIT: TAPE 7 ONLY',
        simultaneousSubmission: true,
        requiresPuzzle: 'P16',
        recallPrompt: 'Recall what D. Wright turned out to be, and so what kind of order the writ was.',
      },
    },
    chain: {
      observerProduces: 'The frame’s number, time stamp and the device that made it.',
      analystTransforms: 'The window in which the recorder was stopped and the fact that the operator did not sign.',
      operatorExecutes: 'Reads the writ and the register, places the frame in the window, and files the keeper of the device.',
    },
    failure: {
      wrongStep: 'Naming the keeper of tape 7, because the order concerned tape 7, or the project lead, because she is the best known.',
      consequence: 'The claim is rejected: the order reached tape 7 only, so the keeper of tape 7 did not make the record inside the window.',
      recoveryGuidance: 'Name the person to whom the device that made the frame was issued, and check which copy that person keeps.',
    },
    hints: [
      'A writ reaches only what it names. Ask what was written, and by what device, during the minutes the order was in force.',
      'Each of you holds one piece: a frame’s details, a recorder’s stop and the words of the order. None is enough alone. The Operator’s register says what office the device was issued to.',
      'Place the frame’s time inside the stop window. Ask whether the order reached the device that made the frame. Then find the keeper of that office from your earlier findings.',
      'A surname only. It belongs to a custodian, the same one whose copy the disposal notice never listed.',
    ],
    reveal:
      'The writ reached tape 7 and nothing else. A handheld camera the order never named made one frame inside the window, and its keeper has held the negatives for thirty years. The one record the Directorate could not stop is the one it never listed.',
    clue: {
      clueText:
        'One record survived because it came from somewhere the order could not reach. Now the bulletin must be weighed against everything you hold. A panel in the Core takes the final verdict only from a game master’s key. Which panel is it?',
      format: 'Inference',
    },
    exhibits: ['EVID-P32'],
    uses: ['P16', 'P17', 'P27'],
    mech: 'multi-role',
    solution:
      'Observer: frame B-07 stamped 03:17:11 from FIELD-CAM-02. Analyst: tape 7’s recorder was stopped 03:17 to 03:24 and the operator did not sign (a command, P17). Operator: the writ (a pre-signed form, P16) says tape 7 only; the register issues FIELD-CAM-02 to the Observation Officer, Grade 2. 03:17:11 falls inside the window; the writ did not reach a second, independent device. The Observation copy’s keeper (P27) is Rahal, who holds the negatives. Answer: RAHAL.',
    redHerring: {
      id: 'RH-TAPE-KEEPER',
      theory: 'The record inside the window must be tape 7’s, so its keeper made it.',
      refutedBy: 'EVID-P32: tape 7 was stopped for the whole window; the frame is stamped by a different device.',
    },
    recontext: {
      what: 'Whether the 1994 night left any record',
      from: 'The writ and the stopped recorder erased the night completely.',
      to: 'One independent camera made a frame inside the window; the order reached tape 7 only.',
    },
  },
]

/* ────────────────────────────── artifacts ────────────────────────────── */

export const artifacts = [
  /* P27 */
  {
    id: 'EVID-P27',
    node: 'P27',
    kind: 'document',
    title: 'Disposal Notice DN-24-107, schedule (annotated)',
    description: 'The schedule page of the disposal notice of 15 October 2024, with a reviewer’s marginal notes.',
    source: 'Architecture lab server terminal (print)',
    custodian: 'Bureau of Continuity Records',
    date: '2024-10-15',
    reliability: 'primary',
    proves: [
      'The notice lists boxes 1 to 3 and tape 7 and no other holding',
      'The notice states that it reaches only what it lists',
      'The listed items fall in two of the three copies on the copy map',
    ],
    doesNotProve: ['That the third copy still exists', 'Whether the Directorate knew of the third copy', 'That the notice was carried out as written'],
    relates: [
      { to: 'EVID-P07B', kind: 'derives', note: 'The copy map allots the listed items to the Verification and Analysis copies.' },
      { to: 'EVID-P21', kind: 'corroborates', note: 'The certificate that followed the notice found boxes 1 to 3 empty.' },
    ],
    condition: 'NORMAL',
    text:
      'DISPOSAL NOTICE DN-24-107, SCHEDULE. Issued 15 OCT 2024, Oversight desk (A. Vale). Authority: 30-year retention on closed file NX-037, expired 14 OCT 2024. Item 1: NX-037 operations file, boxes 1 to 3, Archive. Item 2: magnetic tape 7, recorder log R-94-07, shaft S-3. Execute 18 OCT 2024, 10:00. Certificate DC-24-107 to follow. This notice reaches the holdings listed above and no others. A holding not listed is outside it. Reviewer’s notes in blue: item 1 = filed copy; item 2 = measured copy; seen copy: nothing listed.',
    render: {
      form: 'doc',
      stock: 'bond',
      head: { org: 'BUREAU OF CONTINUITY RECORDS', unit: 'OFFICE OF OVERSIGHT', form: 'DISPOSAL NOTICE', control: 'DN-24-107', revision: '' },
      title: 'DISPOSAL NOTICE · SCHEDULE',
      fields: [['ISSUED', '15 OCT 2024'], ['EXECUTE', '18 OCT 2024  10:00'], ['FILE', 'NX-037']],
      blocks: [
        { t: 'p', text: 'AUTHORITY: 30-year retention on closed file NX-037, expired 14 OCT 2024.' },
        { t: 'gap', h: 8 },
        { t: 'table', cols: ['ITEM', 'HOLDING', 'KEPT AT'], widths: [0.1, 0.62, 0.28], hi: [0, 1], rows: [
          ['1', 'NX-037 operations file, boxes 1 to 3', 'Archive'],
          ['2', 'Magnetic tape 7 (recorder log R-94-07)', 'Shaft S-3'],
        ] },
        { t: 'gap', h: 10 },
        { t: 'p', text: 'This notice reaches the holdings listed above and no others. A holding not listed is outside it.' },
        { t: 'sig', name: 'A. Vale' },
        { t: 'hand', text: 'item 1 = filed copy', dx: 30, dy: -150, rot: -3, color: 'blue' },
        { t: 'hand', text: 'item 2 = measured copy', dx: 30, dy: -120, rot: -2, color: 'blue' },
        { t: 'hand', text: 'seen copy: nothing listed', dx: 30, dy: -10, rot: -2, color: 'blue' },
      ],
      foot: 'OFFICE OF OVERSIGHT · DN-24-107 · PAGE 2 OF 2',
      damage: null,
    },
  },

  /* P27b */
  {
    id: 'EVID-P27B',
    node: 'P27b',
    kind: 'log',
    title: 'Camera-Controller Trace, ELC-BANK (annotated)',
    description: 'The execution trace of the east-lab camera-bank controller with each line tested against the state table.',
    source: 'Architecture lab debug console',
    custodian: 'Bureau of Continuity Records',
    date: '2024-10-18',
    reliability: 'derived',
    proves: [
      'Only one line of the trace fails the controller’s state table',
      'That line records the bank as buffering after a power-off command',
      'The trace has no checksum, so a line can be rewritten without trace',
    ],
    doesNotProve: ['Who rewrote the line', 'What the cameras would have shown had they been recording', 'When the line was rewritten'],
    relates: [
      { to: 'EVID-P25', kind: 'contradicts', note: 'The ticket cut power at 04:15:03; the altered line has the bank recording afterwards.' },
      { to: 'EVID-P24B', kind: 'explains', note: 'A line of this kind would let a statement about 04:17 footage look supported.' },
    ],
    condition: 'NORMAL',
    text:
      'ELC-BANK CONTROLLER TRACE, tested against the state table. [0] R0 0, input 0x01: table gives 1, next register 1, OK. [1] R1 1, input 0x02: table gives 3 (FAULT), next register shows 2 (BUFFERING), FAILS. [2] R2 2, input 0x01: table gives 3, next register 3, OK. [3] R3 3, input 0x02: table gives 2, next register 2, OK. [4] R4 2, DONE. Command index: [0] 04:15:03 ticket MT-24-3302; [1] 04:15:09 scheduler; [2] 05:15:00 facilities restore; [3] 05:15:04 scheduler. Camera-system log: no frames 04:15:03 to 05:15:04.',
    render: {
      form: 'screen',
      theme: 'green',
      title: 'ELC-BANK · TRACE TEST',
      lines: [
        '[0] R0: 0 | 0x01  -> table 1   next 1   OK',
        '[1] R1: 1 | 0x02  -> table 3   next 2   FAIL',
        '[2] R2: 2 | 0x01  -> table 3   next 3   OK',
        '[3] R3: 3 | 0x02  -> table 2   next 2   OK',
        '[4] R4: 2 | DONE',
        '',
        'STATES  0 LIVE · 1 OFF · 2 BUFFERING · 3 FAULT',
        'WRITES VIDEO IN: 0, 2',
        '',
        '[1] 04:15:09  REC  scheduler',
        'TICKET  04:15:03  PWR-OFF  MT-24-3302',
        'CAMERA LOG  no frames 04:15:03 - 05:15:04',
      ],
      hi: [1, 9],
    },
  },

  /* P28 */
  {
    id: 'EVID-P28',
    node: 'P28',
    kind: 'audio',
    title: 'REC-19, fragment 5 of 5',
    description: 'The fifth fragment cut from the pocket recorder’s reel: a repeated question, a bell, and the room at first light.',
    source: 'Fragment container, research chamber',
    custodian: 'Bureau of Continuity Records',
    date: '2024-10-18',
    reliability: 'primary',
    proves: [
      'A woman was pressed to name the custodians while a tower bell struck five',
      'Dawn ambience and birdsong are on the tape; a speaker remarks that it is getting light',
      'She says nobody keeps the whole record',
    ],
    doesNotProve: ['The names of the two questioning voices', 'That the recording is complete', 'Who ordered the questioning'],
    relates: [
      { to: 'EVID-P28-B', kind: 'explains', note: 'The recorder log gives the span of the reel that this fragment was cut from.' },
      { to: 'EVID-P24B', kind: 'precedes', note: 'The earlier excerpt is cut from the same reel.' },
    ],
    condition: 'NORMAL',
    text:
      'REC-19 fragment 5 of 5, about 46 seconds. Footsteps. A male voice (VOICE A) asks for the custodians’ names. Keys. Vey says she will tell what she is sure of. The tower bell strikes five times. Vey says nobody keeps it all, not the questioner and not her. Birdsong. A second male voice (VOICE B) says it is getting light. VOICE A asks again. Vey answers that the answer will be the same when the sun is up. Footsteps.',
    audio: {
      file: 'rec19-fragment-5',
      length: 46,
      script: [
        { cue: 'footsteps' },
        { who: 'VOICE A', text: 'The custodians. Give me their names.', pause: 1.2 },
        { cue: 'keys' },
        { who: 'VEY', text: 'You want names. I will tell you what I am sure of.', pause: 0.4 },
        { cue: 'tower-strike', n: 5 },
        { who: 'VEY', text: 'Nobody keeps it all. Not you. Not me.', pause: 1.0 },
        { cue: 'birds' },
        { who: 'VOICE B', text: 'It is getting light. Finish this.', pause: 0.8 },
        { who: 'VOICE A', text: 'The custodians, Doctor. Again.', pause: 1.4 },
        { who: 'VEY', text: 'Ask me when the sun is up. The answer will be the same.', pause: 0.8 },
        { cue: 'footsteps' },
      ],
      ambience: 'room-jacket',
      transcript:
        '[footsteps] VOICE A: The custodians. Give me their names. [keys] VEY: You want names. I will tell you what I am sure of. [the tower bell strikes five times] VEY: Nobody keeps it all. Not you. Not me. [birdsong] VOICE B: It is getting light. Finish this. VOICE A: The custodians, Doctor. Again. VEY: Ask me when the sun is up. The answer will be the same. [footsteps]',
    },
  },
  {
    id: 'EVID-P28-B',
    node: 'P28',
    kind: 'note',
    title: 'Pocket Recorder Log, REC-19',
    description: 'The log card kept with the recorder for reel A, with the five fragments cut for the file.',
    source: 'Fragment container, research chamber',
    custodian: 'Facilities',
    date: '2024-10-18',
    reliability: 'primary',
    proves: [
      'The reel ran continuously from 04:30 to 05:40',
      'The recorder was carried inside a jacket pocket by a facilities operator',
      'The recorder’s clock was set to building time at 04:12',
    ],
    doesNotProve: ['That the recorder was authorised', 'The time of any single sound on the reel', 'Who was in the room besides the speakers'],
    relates: [{ to: 'EVID-P28', kind: 'explains', note: 'The span fixes which five the bell was striking.' }],
    condition: 'NORMAL',
    text:
      'POCKET RECORDER LOG, REC-19. Reel A, micro-cassette, 70 minutes, continuous. REC-19 start 04:30. REC-19 stop 05:40. Recorder clock set to building time at 04:12. Carried inside the jacket, left breast pocket. Operator: facilities. Fragments cut for the file, in the order recorded: F1 first question, tape 7. F2 second question, the boxes. F3 third question, the custodians. F4 fourth question, C214-X. F5 repeat of the third question; ambience: window grey, birds. No other reel was running in the room.',
    render: {
      form: 'note',
      stock: 'card',
      head: null,
      title: 'REC-19 · REEL A · LOG',
      fields: [['MEDIA', 'MICRO-CASSETTE 70 MIN'], ['CARRIED', 'JACKET, LEFT BREAST POCKET']],
      blocks: [
        { t: 'mono', lines: ['REC-19 start 04:30', 'REC-19 stop  05:40', 'clock set to building time 04:12', '', 'F1  tape 7', 'F2  the boxes', 'F3  the custodians', 'F4  C214-X', 'F5  repeat of F3; window grey, birds'] },
        { t: 'hand', text: 'one reel, no stops', dx: 20, dy: 6, rot: -2, color: 'blue' },
      ],
      foot: 'FACILITIES · REC-19',
      damage: null,
    },
  },

  /* P29 */
  {
    id: 'EVID-P29',
    node: 'P29',
    kind: 'document',
    title: 'Declassified Design Note, NEXUS rev 3',
    description: 'The classified memo NX/CLS/12 with its result line restored.',
    source: 'Core declassification vault',
    custodian: 'Bureau of Continuity Records',
    date: '2021-12-01',
    reliability: 'primary',
    proves: [
      'NEXUS is classed as a protocol, revised from agent by its designer in 2021',
      'NEXUS stores nothing of its own and cannot run with fewer than three people',
      'The Directorate’s requirement, a system that says what it is told, was not met',
    ],
    doesNotProve: ['That the Directorate accepted the reclassification', 'Where the three copies are kept', 'Whether anyone has tried to run it with fewer than three'],
    relates: [
      { to: 'EVID-P04', kind: 'explains', note: 'The sessions that closed had three attestations because the rule needs three.' },
      { to: 'EVID-P05', kind: 'explains', note: 'The designer holds no copy because the rule does not allow a fourth holder.' },
    ],
    condition: 'NORMAL',
    text:
      'CLASSIFIED MEMO // PROJECT NEXUS. Control NX/CLS/12. Subject: Entity identification. Result: A RECORDS PROTOCOL. NEXUS is not a database on a disk. The key relationship: a fact is closed when three independent custodians, each holding a separate copy, agree. It stores nothing of its own and it cannot run with fewer than three. Asked a question, it returns only what three people agree is true. Class changed from A to P, rev 3. Marginal note in red: Directorate requirement was a system that says what it is told. Not met. Signed: L. Vey, designer.',
    render: {
      form: 'doc',
      stock: 'bond',
      head: { org: 'BUREAU OF CONTINUITY RECORDS', unit: 'NEXUS REGISTRY', form: 'CLASSIFIED MEMO', control: 'NX/CLS/12', revision: 'REV 03' },
      title: 'PROJECT NEXUS · ENTITY IDENTIFICATION',
      fields: [['CLASS', 'P · REV 3'], ['STATUS', 'DECLASSIFIED']],
      blocks: [
        { t: 'p', text: 'Subject: Entity identification' },
        { t: 'p', text: 'Result: A RECORDS PROTOCOL.' },
        { t: 'gap', h: 8 },
        { t: 'p', text: 'NEXUS is not a database on a disk. The key relationship: a fact is closed when three independent custodians, each holding a separate copy, agree. It stores nothing of its own and it cannot run with fewer than three. Asked a question, it returns only what three people agree is true.' },
        { t: 'gap', h: 10 },
        { t: 'sig', name: 'L. Vey' },
        { t: 'hand', text: 'Directorate requirement: a system that says what it is told. Not met.', dx: 20, dy: 6, rot: -2, color: 'red' },
        { t: 'stamp', text: 'DECLASSIFIED', color: 'red', rot: -8, dx: 290, dy: -240 },
      ],
      foot: 'NX REGISTRY · RET 30Y · PAGE 1 OF 1',
      damage: null,
    },
  },

  /* M04 */
  {
    id: 'EVID-M04',
    node: 'M04',
    kind: 'log',
    title: 'Building Alarm Log AL-241018, east lab (annotated)',
    description: 'An extract of the building alarm log for the east laboratory at 04:17 on 18 October 2024, with a reviewer’s notes.',
    source: 'Vault Delta terminal (print)',
    custodian: 'Estates security',
    date: '2024-10-18',
    reliability: 'primary',
    proves: [
      'A valid badge read and code were accepted at E-LAB-D1 at 04:17',
      'The containment-breach alarm that followed was raised by hand at the Oversight console',
      'No door, motion or tamper sensor tripped',
    ],
    doesNotProve: ['Which person was at the Oversight console', 'What the east-lab door camera would have shown', 'What happened to the person who badged in after 04:17'],
    relates: [
      { to: 'EVID-P27B', kind: 'contradicts', note: 'The alarm cites video confirmation; the cameras were dark and the trace line that suggests otherwise was altered.' },
      { to: 'EVID-P25', kind: 'precedes', note: 'The ticket that cut the cameras was executed two minutes before the alarm.' },
      { to: 'EVID-P24B', kind: 'corroborates', note: 'A statement of footage seen at 04:17 is the only support the alarm has.' },
    ],
    condition: 'NORMAL',
    text:
      'BUILDING ALARM LOG AL-241018, east lab, extract. SEQ 3181 04:17 E-LAB-D1 badge read L.V., code accepted. SEQ 3182 04:17 E-LAB-D1 alarm: containment breach. Source: manual, Oversight console. Sensors: door forced none, motion none, tamper none. Video confirmation: attached by operator. A sensor alarm shows at least one tripped sensor. A manual alarm shows none. The log does not record the name of the operator of a manual alarm. Reviewer’s notes in blue: cameras dark since 04:15:03; confirmation cannot exist.',
    render: {
      form: 'doc',
      stock: 'ledger',
      head: { org: 'ESTATES SECURITY', unit: 'BUILDING ALARM LOG', form: 'ALARM LOG', control: 'AL-241018', revision: '' },
      title: 'ALARM LOG · EAST LAB · 18 OCT 2024',
      fields: [['DOOR', 'E-LAB-D1'], ['SOURCE', 'EXTRACT']],
      blocks: [
        { t: 'table', cols: ['SEQ', 'TIME', 'EVENT', 'DETAIL'], widths: [0.1, 0.12, 0.28, 0.5], hi: [1], rows: [
          ['3181', '04:17', 'BADGE READ', 'L.V. · code accepted'],
          ['3182', '04:17', 'ALARM · CONTAINMENT BREACH', 'MANUAL · OVERSIGHT CONSOLE · sensors: none tripped · video confirmation attached by operator'],
        ] },
        { t: 'gap', h: 10 },
        { t: 'p', text: 'A sensor alarm shows at least one tripped sensor. A manual alarm shows none. The log does not record the name of the operator of a manual alarm.' },
        { t: 'hand', text: 'cameras dark since 04:15:03. confirmation cannot exist.', dx: 20, dy: 6, rot: -2, color: 'blue' },
      ],
      foot: 'ESTATES SECURITY · RET 7Y · PAGE 1 OF 1',
      damage: null,
    },
  },

  /* P30 */
  {
    id: 'EVID-P30',
    node: 'P30',
    kind: 'audio',
    title: 'Voicemail, Bureau line 4, 29 September 2026',
    description: 'A 41-second voicemail left on the Bureau’s retention line from a withheld number.',
    source: 'Spire control console',
    custodian: 'Bureau of Continuity Records',
    date: '2026-09-29',
    reliability: 'primary',
    proves: [
      'The speaker was alive and able to telephone on 29 September 2026',
      'The voice matches the questioned speaker of REC-19 fragment 5 in pitch and pause pattern',
      'The speaker says she held no part of the record and that this is the design',
    ],
    doesNotProve: ['Where the call was made from', 'That pitch alone identifies a person', 'Whether the Bureau has acted on the message'],
    relates: [
      { to: 'EVID-P28', kind: 'corroborates', note: 'Same voice as the answering speaker in fragment 5.' },
      { to: 'EVID-P29', kind: 'explains', note: 'The message asks for new keepers because the rule needs three who are not interested parties.' },
    ],
    condition: 'NORMAL',
    text:
      'Voicemail, Bureau line 4, received 29 SEP 2026 02:14, 41 seconds, caller ID withheld, external. A woman’s voice speaks to the Bureau’s retention desk about a record closed two years earlier and asks the Bureau to convene new keepers. The full transcript is attached to the audio record.',
    audio: {
      file: 'voicemail-20260929',
      length: 41,
      script: [
        { cue: 'voicemail-beep' },
        { who: 'VEY', text: 'This is for the Bureau, the retention desk. You will know the voice.', pause: 1.0 },
        { who: 'VEY', text: 'A record you hold was closed two years ago. One check on it was left empty, on purpose.', pause: 1.0 },
        { who: 'VEY', text: 'It was never mine to fill. I held none of it. That is the design.', pause: 1.2 },
        { who: 'VEY', text: 'The three who closed it cannot judge themselves. I am asking for a second quorum: three who were not there.', pause: 1.2 },
        { who: 'VEY', text: 'Do not look for me.', pause: 0.8 },
        { cue: 'handset-click' },
      ],
      ambience: 'phone-line',
      transcript:
        '[line hiss] [voicemail beep] VEY: This is for the Bureau, the retention desk. You will know the voice. A record you hold was closed two years ago. One check on it was left empty, on purpose. It was never mine to fill. I held none of it. That is the design. The three who closed it cannot judge themselves. I am asking for a second quorum: three who were not there. Do not look for me. [handset click]',
    },
  },

  /* P31 */
  {
    id: 'EVID-P31',
    node: 'P31',
    kind: 'document',
    title: 'REC-19 Transcript, selected lines',
    description: 'Selected lines of the REC-19 transcript in which her questioners put a master copy to her and she answers.',
    source: 'Memory array terminal (print)',
    custodian: 'Bureau of Continuity Records',
    date: '2024-10-18',
    reliability: 'secondary',
    proves: [
      'The questioners assumed she held a master copy',
      'She stated that she held nothing and that there was no original',
      'She described the record as held by three',
    ],
    doesNotProve: ['That her statements are true (the custody map is what checks them)', 'The identity of the two questioning voices', 'That the transcript is complete'],
    relates: [
      { to: 'EVID-P07B', kind: 'corroborates', note: 'The copy map lists three copies and three keepers, none of them the designer.' },
      { to: 'EVID-P28', kind: 'explains', note: 'Fragment 5 carries the last line quoted here.' },
    ],
    condition: 'NORMAL',
    text:
      'REC-19 TRANSCRIPT, selected lines. F2 VOICE A: You designed it. You hold the master copy. F2 VEY: I hold nothing. That is the design. F3 VOICE A: Then who holds it? F3 VEY: Three who do not know what the others hold. F4 VOICE B: Where is the original, Doctor? F4 VEY: There is no original. There are three, and I am none of them. F5 VEY: Nobody keeps it all. Not you. Not me.',
    render: {
      form: 'doc',
      stock: 'thermal',
      head: { org: 'BUREAU OF CONTINUITY RECORDS', unit: 'CASE FILE 037', form: 'TRANSCRIPT', control: 'REC-19/T', revision: '' },
      title: 'REC-19 · SELECTED LINES',
      fields: [['REEL', 'A · 04:30 TO 05:40'], ['CUT', 'FOR THE FILE']],
      blocks: [
        { t: 'mono', lines: [
          'F2  VOICE A: You designed it. You hold the',
          '    master copy.',
          'F2  VEY: I hold nothing. That is the design.',
          'F3  VOICE A: Then who holds it?',
          'F3  VEY: Three who do not know what the',
          '    others hold.',
          'F4  VOICE B: Where is the original, Doctor?',
          'F4  VEY: There is no original. There are',
          '    three, and I am none of them.',
          'F5  VEY: Nobody keeps it all. Not you. Not me.',
        ] },
        { t: 'hand', text: 'three copies, three keepers. not one of them hers.', dx: 20, dy: 8, rot: -2, color: 'blue' },
      ],
      foot: 'CASE FILE 037 · TRANSCRIPT · PAGE 1 OF 1',
      damage: null,
    },
  },

  /* P32 */
  {
    id: 'EVID-P32',
    node: 'P32',
    kind: 'photo',
    title: 'Negative Strip, FIELD-CAM-02, 13/14 October 1994',
    description: 'A strip of three frames from the handheld second camera, including the frame stamped 03:17:11.',
    source: 'Final vault, holographic projector',
    custodian: 'Observation copy, N. Rahal',
    date: '1994-10-14',
    reliability: 'primary',
    proves: [
      'A frame stamped 03:17:11 exists from FIELD-CAM-02, inside the 03:17 to 03:24 stop window',
      'The writ named tape 7 only and so did not reach this camera',
      'The negatives were kept by the Observation copy, never listed for disposal',
    ],
    doesNotProve: ['Who the figure at the corridor mouth is', 'That the camera was authorised that night', 'That the strip is complete'],
    relates: [
      { to: 'EVID-P17', kind: 'contradicts', note: 'The recorder was stopped by command; this camera was not.' },
      { to: 'EVID-P16', kind: 'explains', note: 'The writ was a pre-signed form that named tape 7 only.' },
    ],
    condition: 'NORMAL',
    text:
      'NEGATIVE STRIP, FIELD-CAM-02, night of 13/14 October 1994. Three frames: the corridor at 03:12, empty; frame B-07 stamped 03:17:11, a figure at the corridor mouth; a third frame. The recorder (tape 7) was stopped 03:17 to 03:24 by writ; the writ named tape 7 only.',
    render: {
      form: 'photo',
      shot: 'negative-strip-1994',
      caption: ['EVID-P32', 'NEGATIVE STRIP · FIELD-CAM-02', '13/14 OCT 1994', '3 FRAMES · B-07 = 03:17:11'],
    },
  },
]
