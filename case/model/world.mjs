// The people, places and timelines of CASE 037, in a form the ledgers and the
// continuity checks can read. CANON.md is the prose; this is the table.

export const people = [
  {
    id: 'VEY', name: 'Dr. Lina M. Vey', born: 1954,
    role1994: 'Project Lead, NEXUS (from Sep 1993). Withdrawn from the roster after the night; re-appointed 17 Apr 1998 under the same number.',
    role2024: 'Designer of the quorum. Left at 17:28 on 17 Oct, returned by Route Delta, bound the seal, was held on the antenna deck, released at 05:52.',
    wants: 'A record nobody can erase, and a second quorum that cannot be accused of being interested.',
    fears: 'One person holding it again.',
    secrets: ['Holds no copy by design', 'Left the fifth check (CHOICE) open on purpose', 'Walked into the east lab at 04:17 knowing the cameras were dead'],
    lies: [],
    knowsAbout: 'everything except what the second quorum chooses',
    appears: ['M01', 'P06', 'P12', 'P24b', 'P28', 'P30', 'P36'],
  },
  {
    id: 'CARTER', name: 'Prof. Marcus A. Carter', born: 1949,
    role1994: 'Deputy Lead, System Theory. Closed his own file 12 Oct 1994 and still signed after.',
    role2024: 'ANALYSIS custodian (M.C.). Holds the measured record: ledgers, tape 7 copies, notebooks.',
    wants: 'The record to survive without having to be brave in public.',
    fears: 'The Directorate and being the one who was not there.',
    secrets: ['Signed after leaving the project', 'His copy is the one the Directorate named and could not find'],
    lies: [],
    knowsAbout: 'what was measured',
    appears: ['P04', 'P05', 'M01', 'P07b', 'P27'],
  },
  {
    id: 'RAHAL', name: 'Noor Rahal', born: 1968,
    role1994: 'Observation Officer, Grade 2. Held FIELD-CAM-02, the camera the writ did not reach. Signed Incident Record 037.',
    role2024: 'OBSERVATION custodian (R.N.), facilities supervisor. Set the lobby clock to hold the seal moment. Ran REC-19 in his jacket.',
    wants: 'The frame, the negatives and the recording to outlive the people who would rather they did not.',
    fears: 'Being the reason the cameras were off (he is the facilities supervisor who executes tickets).',
    secrets: ['Recorded the interrogation without being asked', 'Holds the negatives the notice never named'],
    lies: [],
    knowsAbout: 'what was seen',
    appears: ['P02', 'P04', 'P05', 'M01', 'P28', 'P32'],
  },
  {
    id: 'SELIM', name: 'Mara Selim', born: 1961,
    role1994: 'Archivist. Signed boxes 1–3 out of the archive on 9 Oct 1994 and never returned them.',
    role2024: 'VERIFICATION custodian (M.S.), archivist. Moved boxes 1–3 on 16 Oct; saw Vey walked toward the Engineering Block at 04:20.',
    wants: 'The custody chain intact.',
    fears: 'A gap in the chain that she is blamed for.',
    secrets: ['The boxes were never destroyed', 'Her custody slip of 16 Oct is the reason the disposal found them empty'],
    lies: [],
    knowsAbout: 'what was filed',
    appears: ['P05', 'M01', 'P15', 'P21', 'P34'],
  },
  {
    id: 'VALE', name: 'Dr. Adrian Vale', born: 1972,
    role1994: 'Junior clerk, Directorate desk.',
    role2024: 'Continuity Oversight Officer for NEXUS. Executes the Directorate’s writs. Issued the bulletin MP-24-018 and the disposal notice DN-24-107; executed the 04:15 camera power-down; claimed to have reviewed footage that did not exist.',
    wants: 'A records system that says what the institution needs it to say.',
    fears: 'A record he cannot control.',
    secrets: ['Ordered the cameras off', 'Never saw footage of Vey at 04:17'],
    lies: ['I reviewed the east laboratory footage at 04:17 and confirmed Dr. Vey was present'],
    knowsAbout: 'the Directorate’s instructions; not the negatives',
    appears: ['M01', 'P24b', 'P25', 'M03'],
  },
  {
    id: 'TECH11', name: 'TECH-11 (Faouzi M.)', born: 1957,
    role1994: 'Facilities technician. Carried tape 7 down the shaft, not the duct. Etched COUNT THE DOORS NOT THE CLOCKS.',
    role2024: 'Retired 2019. His 1994 etching and work order are his only testimony.',
    wants: 'Tape 7 not destroyed.', fears: 'Nothing recorded of what he did.',
    secrets: ['Kept Vey in the sub-basement plant room 1994–98 (told only by his scrawl and one duplicate record)'],
    lies: [], knowsAbout: 'where tape 7 went', appears: ['P17b', 'P19'],
  },
  {
    id: 'WRIGHT', name: '“D. Wright”', born: null,
    role1994: 'The signature on the order that stopped tape 7. Stamped NO SUCH PERSON on the personnel roster.',
    role2024: 'The authorising name on the camera power-down ticket MT-24-3302.',
    wants: 'Nothing: a pre-signed writ form (D-W) whose authorising-officer line a clerk fills with the name.',
    fears: 'Nothing.', secrets: ['Is a form, not a person (Standing Instruction 7)'], lies: [],
    knowsAbout: 'nothing', appears: ['P16', 'P25', 'P26'],
  },
]

export const organisations = [
  { id: 'HALDER', name: 'Halder Institute for Continuity Studies', years: '1974–1998', note: 'Built the Admin Building. Dissolved 1998.' },
  { id: 'BUREAU', name: 'Bureau of Continuity Records', years: '1998–', note: 'Surviving retention desk. Standing rule: 30-year retention on closed case files. The players’ employer.' },
  { id: 'DIRECTORATE', name: 'The Directorate', years: '1987?–', note: 'Co-holder of the building (facade countermark X). Wants NEXUS controllable.' },
  { id: 'UNIVERSITY', name: 'University Estates', years: '1998–', note: 'Holds the estate. Owns nothing of the case.' },
]

export const places = [
  { id: 'ADMIN', name: 'Admin Building (1974)', note: 'Main entrance, lobby, library, archive, Lecture Hall 214, clock room, dome.' },
  { id: 'C214X', name: 'Room C214-X', note: 'Behind Hall 214; on drawing A-201-G issue 02, absent from issue 03. Opened by the armrest switch at seat B7. Where the quorum closed (2024) and the first run was held (1994).' },
  { id: 'ELAB', name: 'East Laboratory (Science Building)', note: 'Bay 3425, door E-LAB-D1. Vey badged in at 04:17.' },
  { id: 'ENG', name: 'Engineering Block', note: 'Corridor camera CAM-E3; the antenna deck and its interrogation room.' },
  { id: 'TUN', name: 'Route Delta / S01-TUN', note: 'Service-tunnel network; blue doors; maintenance key; no badge record.' },
  { id: 'SHAFT', name: 'Service shaft S-3', note: 'Under the sculpture-garden pond; where tape 7 went in 1994; empty in 2024.' },
]

/** The three timelines. `true` is canon; `official` is the bulletin; `false` is what the red herrings suggest. */
export const timelines = {
  official: [
    ['17 Oct 17:30', 'Dr. Vey left the Admin Building.'],
    ['18 Oct 09:40', 'Bulletin MP-24-018: not seen since.'],
  ],
  false: [
    ['17 Oct 21:22', 'Vey returns and borrows drawing set A-201-G (library server stamp; refuted: the server clock is +4 h).'],
    ['—', 'Vey never returned and is missing or in flight (refuted: CCTV 19:45, seal 21:47, REC-19, voicemail 2026).'],
    ['—', 'V in the empty frame is Vey (refuted: it is the Verification role).'],
  ],
  true: [
    ['17 Oct 17:22', 'Vey checks out A-201-G (library server shows 21:22).'],
    ['17 Oct 17:28', 'Vey leaves by the main entrance (guard log; CAM-01 17:29).'],
    ['17 Oct 18:42', 'A café receipt in town.'],
    ['17 Oct 19:32', 'S01-TUN opens on a maintenance key; no badge read.'],
    ['17 Oct 19:45', 'CAM-E3: figure in a long dark coat in the Engineering corridor.'],
    ['17 Oct 21:44–21:47', 'Three custodians attest; SQ-24-001 sealed in C214-X; designer binds; check 5 (CHOICE) left open.'],
    ['17 Oct 22:45', 'Rahal sets the lobby clock to hold the moment.'],
    ['18 Oct 04:15', 'East-lab camera bank powered down on ticket MT-24-3302 (authorised D. WRIGHT, executed A. VALE).'],
    ['18 Oct 04:17', 'Vey badges into E-LAB-D1; Vale logs a containment-breach alarm (pretext).'],
    ['18 Oct 04:20', 'Selim sees Vey walked toward the Engineering Block.'],
    ['18 Oct 04:30–05:40', 'Interrogation on the antenna deck; REC-19 runs in Rahal’s jacket; the tower strikes five at 05:00.'],
    ['18 Oct 05:52', 'Vey leaves by S01-TUN; released.'],
    ['18 Oct 09:40', 'Bulletin MP-24-018 issued.'],
    ['18 Oct 10:00', 'Disposal DN-24-107: boxes 1–3 empty; tape 7 not in the shaft.'],
    ['29 Sep 2026', 'Voicemail (41 s, withheld number) asks the Bureau for a second quorum.'],
  ],
}
