# Authoring a node

You are writing the screens the three players see for one node, and the exhibits the node files in the archive.
Read `CANON.md` (what is true), `SPINE.md` (what this node must establish), `legacy/nodes.json` (the current text of every
node, including what is physically on site), then write `model/nodes/actN.mjs`.

## Hard rules

1. **One truth.** Never contradict CANON/SPINE. If you need a new fact (a name, a time, a number) that
   the spine does not fix, invent it so it cannot collide with a fixed one, and list it in the file's
   `newFacts` export. Do not change a fixed fact. If you think a fixed fact is wrong, say so in
   `concerns` and do not work around it silently.
2. **Keep the physical install.** `legacy/nodes.json` is what is physically on site (glyph row, brass
   plates, clock face, poster dates, empty third frame, ledger #06, LED bytes, cabinet screen text,
   roman clock, blueprint note, blue symbol on archway, seat B7, whiteboard, lab clock dashes, diagram,
   auditorium rows, spectrum peaks, copper tape cipher text, sculpture, dome panel, window note,
   six-by-six grid, Venn seals, scrolling noise, three-phone shards, dependency chain, execution trace,
   holographic container…). The **Observer** block keeps those readings *verbatim in substance*; you
   may add context around them but never change what the object looks like. Never write that a
   physical object shows something the legacy text does not say.
3. **The answer is a claim, not a code.** It is a fact about the case, deduced from at least two
   different pieces of evidence. No player-visible string (role blocks, objective, failure text) may
   state the conclusion. Evidence states facts; the team states the conclusion.
4. **Three seats, three different things.** Observer = what is physically there (and only that).
   Analyst = a record/dataset/instrument the Observer cannot see. Operator = the cross-check, the
   authority/index/register, and the terminal where the claim is typed. No seat can answer alone, no
   seat is a pure relay. The Operator must have something to *verify*, not just type.
5. **Dependencies are real.** `uses` lists earlier node codes whose *findings* are needed. At least
   one `requiresPuzzle` recall (`interactiveData.requiresPuzzle` + `recallPrompt`) per node that uses
   anything, naming the finding to recall in the *player's* words (never the answer).
6. **Redaction.** The server blanks any string that contains the node's answer (≥3 alphanumerics). Either
   keep the answer out of every string (`redact: true`), or set `redact: false` and keep it out of
   `whatTheySee`, `taskPrompt`, `narrativeObjective`, `failure.*`, `chain.*`, `hints` (the answer may appear only
   inside `dataPayload`, `documentText` and `entries[].text` as evidence — and only where the evidence
   would naturally say it).
7. **Hints are four levels**, each non-spoiling, each more specific:
   THINK — what kind of question this is. FOCUS — which evidence to read, not what it says.
   DEDUCE — the inference step in words. CONFIRM — what a correct answer must satisfy and its format; never the answer.
8. **No "go to X" objectives.** `narrativeObjective` states the case question. `clue.clueText` is an inference
   prompt about the *next* node's location drawn from this node's finding ("The ticket was served on a door that
   keeps no register. Which door is that?") and must still resolve to the legacy `nextPhysicalLocation`.
9. **Fair.** Every claim must be derivable from evidence in the game. A red herring must be refuted by
   evidence the team already has or will get from this or a later node. State where.
10. **Brevity.** Handset screens. `dataPayload` ≤ 900 characters; `documentText` ≤ 1500; ≤ 8 entries.
    No markdown. Typographic apostrophes allowed. In-world voice (records are not written to entertain).
11. **Reuse physical fidelity, not legacy puzzle logic.** Do not keep legacy answers (CDFDEFF, 3425…) as the
    thing the Operator types — they may be *keys* the team reads and uses, but the Operator submits the claim.

## Node shape

```js
export const nodes = [{
  code: 'P01',                         // runtime code, must exist in legacy/nodes.json
  title: 'The Mark',                   // lead title (2–4 words, in-world)
  answer: 'HALDER',
  alts: ['HALDER INSTITUTE', 'THE HALDER INSTITUTE'],   // ≥2 sensible variants; SPINE lists the minimum
  redact: false,                       // see rule 6
  format: 'ONE WORD',                  // shown on the Operator terminal
  question: 'Whose building was this before the university?',   // the claim, shown to the Operator as the prompt
  narrativeObjective: '…',             // case question, not a destination
  observer: { screenTitle, visualType, whatTheySee, taskPrompt, dataPayload, interactiveData? },
  analyst:  { … },
  operator: { … , dataPayload: '…\nANSWER (ONE WORD): [ _ _ _ _ _ _ ]' },
  chain: { observerProduces, analystTransforms, operatorExecutes },   // who holds/does what, no conclusions
  failure: { wrongStep, consequence, recoveryGuidance },              // what a wrong assumption looks like
  hints: [think, focus, deduce, confirm],
  reveal: 'storyReveal text shown after solving (what the team now knows; in-world; ≤ 280 chars)',
  clue: { clueText, format: 'Inference' },   // toward the next node
  exhibits: ['EVID-P01'],              // ids of artifacts granted on solve (first = primary)
  uses: [],                            // earlier node codes whose findings are required
  mech: 'provenance',                  // see list below
  solution: '…',                       // full solution for the ledger; names every evidence item used and the inference
  redHerring: null | { id, theory, refutedBy },
  recontext: null | { what, from, to }, // a belief the node overturns
}]
```

Mechanics: timeline · identity · alibi · contradiction · chain-of-custody · document-forensics ·
audio-forensics · visual-forensics · spatial · relationships · motive · correlation · false-report ·
pattern · recontextualisation · missing-evidence · provenance · cross-incident · multi-role · reconstruction ·
clock-offset · log-integrity · synthesis.

`visualType` and the `interactiveData` keys each one reads (anything else is ignored):

| visualType | keys |
|---|---|
| observation, spatial, visual | `requiresPuzzle`, `recallPrompt` (glyph characters in dataPayload render as tiles) |
| memory-recall (dossier) | `requiresPuzzle`, `recallPrompt`, `requiresAllRoles` |
| document-forensics | `documentText` (shown in a monospace page; preferred for long records), `requiresPuzzle`, `recallPrompt` |
| contradiction-hunt, timeline-investigation | `entries: [{source, text, flag}]`, `audioUrl`, `audioSpeaker`, `audioTranscript`, `audioClips: [{speaker, voice, file}]` |
| audio | `audioUrl`, `audioSpeaker`, `audioTranscript`; Hz values in dataPayload are drawn as peaks |
| binary-technical | `binarySequence: ['01001001', …]` |
| pattern | `sequence: [..strings], missingPositions: [4,8]` |
| dependency-tree | `nodes: [{label, pos}]`, `convergencePoint` |
| cipher, puzzle, meta | `symbols: [..]`, `hint`, `answers: [..]` (meta) |
| cipher-text | `cipherText`, `hint` |
| grid-maze | `gridString`, `hint` (rows separated by ` / `) |
| three-phone | `message` (this seat's shard), `simultaneousSubmission` |
| any | `exhibits: [{src, caption, alt}]` — an inline image only this seat sees (use sparingly; ≤ 1 per seat; do not put the conclusion in the image) |

`flag: true` on an entry highlights it — use only for a record the team has *already* been told to distrust.

## Artifact shape

```js
export const artifacts = [{
  id: 'EVID-P01',                      // EVID-<node> (+ -B, -C for extras); never reuse
  node: 'P01',                         // granted when this node is solved
  kind: 'document',                    // document | plan | note | receipt | screen | log | still | photo | audio
  title: 'Register of Institutional Marks, 1974',
  description: 'One neutral sentence for the archive list. No conclusions.',
  source: 'Archive alcove — lobby',    // where it was recovered
  custodian: 'Bureau of Continuity Records',
  date: '1974-06-03',                  // when the document was made (in-world), ISO or 'YYYY-MM-DD HH:MM'
  reliability: 'primary',              // primary | secondary | derived | unreliable
  proves: ['CDFDEFF is the Halder Institute’s bay mark'],
  doesNotProve: ['That the Institute still operates'],
  relates: [{ to: 'EVID-P05', kind: 'corroborates', note: '…' }],   // corroborates | contradicts | derives | precedes | explains
  condition: 'NORMAL',                 // NORMAL | FADED | STAINED | TORN | PARTIAL
  text: 'Full plain-text transcription of everything legible on the exhibit. Always present (accessibility + search).',
  render: { … },                       // see below; omit only for audio
}]
```

### render — documents (`kind` document/plan/note/receipt/screen/log)

```js
render: {
  form: 'doc',                         // doc | receipt | screen | card | note
  stock: 'bond',                       // bond | carbon | ledger | thermal | vellum
  head: { org: 'HALDER INSTITUTE FOR CONTINUITY STUDIES', unit: 'BUREAU OF CONTINUITY RECORDS', form: 'REGISTER OF MARKS', control: 'HI/REG/74-03', revision: 'REV 02' } | null,
  title: 'REGISTER OF INSTITUTIONAL MARKS',
  fields: [['ISSUED','03 JUN 1974'], ['KEEPER','M. SELIM']],
  blocks: [
    { t: 'p', text: '…' },                                   // typed paragraph
    { t: 'mono', lines: ['…','…'] },                         // typewriter lines
    { t: 'table', cols: ['MARK','HOLDER','STATUS'], rows: [['CDFDEFF','HALDER INSTITUTE','DISSOLVED 1998']], widths: [0.25,0.5,0.25], hi: [0] },
    { t: 'hand', text: 'checked — NR', dx: 40, dy: 0, rot: -2, color: 'blue' },   // handwriting (blue | black | red)
    { t: 'stamp', text: 'DISSOLVED 1998', color: 'red', rot: -8, dx: 300, dy: -20 },
    { t: 'redact', w: 220 },
    { t: 'sig', name: 'N. Rahal' },
    { t: 'rule' }, { t: 'gap', h: 18 },
  ],
  foot: 'FORM HI-14 · RET 30Y · PAGE 1 OF 1',
  damage: null | { kind: 'STAIN' | 'TORN' | 'BURNED' | 'FADED' },
}
```
`form: 'screen'` → `{ form:'screen', theme:'amber'|'green'|'white', title, lines:[…], hi:[lineIndex…] }`.
`form: 'receipt'` → `{ form:'receipt', shop, address, lines:[[item, price]], total, time, footer }`.
Hand-written facts that matter (initials, a time, a name) go in `hand` blocks; typed ones in `p/mono/table`.

### render — images (`kind` still/photo)

```js
render: {
  form: 'still',                       // still = CCTV frame; photo = print
  shot: 'eng-corridor-1945',           // one of the named shots in case/render/shots.mjs
  osd: { camera: 'CAM-E3', date: '18-10-24', time: '19:45:12' },    // stills only
  caption: ['EVID-P23', 'ENG BLOCK · CORRIDOR 2', '17 OCT 24 19:45', 'CAM-E3'],
}
```
Available shots: `entrance-1729` (CAM-01, main entrance, figure with bag leaving), `eng-corridor-1945` (CAM-E3, figure
in a long dark coat), `tunnel-door-1932` (S01-TUN, door ajar, no figure), `east-lab-door-0417` (door, badge reader lit),
`west-corridor-0420` (two figures, one in front), `hall214-b7` (seat B7 armrest), `frame-b07-1994` (Rahal's 03:17:11 frame:
corridor mouth, a figure), `negative-strip-1994` (strip of three frames), `lobby-clock`, `stair-down-shaft`.
Ask for a new shot only in `concerns`; do not invent shot names.

### render — audio (`kind` audio)
```js
audio: {
  file: 'rec19-fragment-5',            // basename; the case/audio script builds it from `script`
  length: 41,                          // seconds
  script: [                             // spoken lines for synthetic speech + sound cues; keep each line short
    { who: 'VEY', text: '…', pause: 0.6 },
    { cue: 'tower-strike', n: 5 },     // cues: tower-strike(n), door, keys, footsteps, birds, hum, tone(hz,len), pilot-on, pilot-off, handset-click, voicemail-beep
  ],
  ambience: 'room-jacket' | 'room' | 'phone-line' | 'tape-hiss' | 'outdoor-dawn',
  transcript: 'Full transcript, including [cues].',
}
```

## Output

Write `case/model/nodes/actN.mjs` exporting `nodes`, `artifacts`, `newFacts` (array of strings), `concerns`
(array of strings). Plain ESM, no imports. Keep each exported object literal-only (the compiler reads
them with `import()`); no functions. Then run `node case/validate.mjs --act N` and fix everything it reports.
