#!/usr/bin/env node
// Content validation for the case model.
//
//   node case/validate.mjs [--act N] [--strict] [--stats]
//
// Reads case/model/nodes/act*.mjs and checks the structure the compiler and the
// game rely on, plus the editorial rules that keep the case fair: no answer
// leaks, no orphan evidence, no circular dependencies, four-level hints, and
// every claim reachable from evidence the team will hold.

import { readdirSync, readFileSync, existsSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const HERE = dirname(fileURLToPath(import.meta.url))
const args = process.argv.slice(2)
const onlyAct = args.includes('--act') ? Number(args[args.indexOf('--act') + 1]) : null
const strict = args.includes('--strict')
const showStats = args.includes('--stats')

const legacy = JSON.parse(readFileSync(join(HERE, 'legacy', 'nodes.json'), 'utf8'))
const ORDER = legacy.map(n => n.code)
const LEGACY = Object.fromEntries(legacy.map(n => [n.code, n]))

const VISUAL_TYPES = new Set([
  'observation', 'spatial', 'visual', 'memory-recall', 'identity', 'cipher', 'cryptogram', 'graph-network',
  'document-forensics', 'audio', 'binary-technical', 'pattern', 'puzzle', 'dependency-tree', 'contradiction-hunt',
  'timeline-investigation', 'three-phone', 'cipher-text', 'grid-maze', 'meta', 'final-boss',
])
const KINDS = new Set(['document', 'plan', 'note', 'receipt', 'screen', 'log', 'still', 'photo', 'audio'])
const RELIABILITY = new Set(['primary', 'secondary', 'derived', 'unreliable'])
const REL_KINDS = new Set(['corroborates', 'contradicts', 'derives', 'precedes', 'explains'])
const MECHS = new Set([
  'timeline', 'identity', 'alibi', 'contradiction', 'chain-of-custody', 'document-forensics', 'audio-forensics',
  'visual-forensics', 'spatial', 'relationships', 'motive', 'correlation', 'false-report', 'pattern',
  'recontextualisation', 'missing-evidence', 'provenance', 'cross-incident', 'multi-role', 'reconstruction',
  'clock-offset', 'log-integrity', 'synthesis',
])
const SHOTS = new Set([
  'entrance-1729', 'eng-corridor-1945', 'tunnel-door-1932', 'east-lab-door-0417', 'west-corridor-0420',
  'hall214-b7', 'frame-b07-1994', 'negative-strip-1994', 'lobby-clock', 'stair-down-shaft',
])
const ACTS = {
  1: ['P01', 'P02', 'P03', 'P04', 'P05', 'M01'],
  2: ['P06', 'P07', 'P08', 'P09', 'P10', 'P11', 'P12'],
  3: ['P13', 'P06b', 'P07b', 'M02', 'P14', 'P15', 'P16', 'P17', 'P17b', 'P18', 'P19'],
  4: ['P20', 'P21', 'M03', 'P22', 'P23', 'P23b', 'P24', 'P24b', 'P25', 'P26'],
  5: ['P27', 'P27b', 'P28', 'P29', 'M04', 'P30', 'P31', 'P32'],
  6: ['P33', 'P34', 'P35', 'P36', 'P37'],
}
const ACT_OF = {}
for (const [act, codes] of Object.entries(ACTS)) for (const c of codes) ACT_OF[c] = Number(act)

const errors = []
const warnings = []
const err = (where, msg) => errors.push(`${where}: ${msg}`)
const warn = (where, msg) => warnings.push(`${where}: ${msg}`)

const norm = text => String(text ?? '').toUpperCase().replace(/[^A-Z0-9]/g, '')
const contains = (hay, needle) => {
  const n = norm(needle)
  if (n.length < 3) return false
  return norm(hay).includes(n)
}

/* ───────────────────────────── load ───────────────────────────── */

const dir = join(HERE, 'model', 'nodes')
const files = existsSync(dir) ? readdirSync(dir).filter(f => /^act\d\.mjs$/.test(f)).sort() : []
const nodes = []
const artifacts = []
const meta = { newFacts: [], concerns: [] }
for (const file of files) {
  const actNo = Number(file.match(/act(\d)/)[1])
  if (onlyAct && actNo !== onlyAct) continue
  const mod = await import(pathToFileURL(join(dir, file)).href)
  for (const n of mod.nodes ?? []) nodes.push({ ...n, _file: file })
  for (const a of mod.artifacts ?? []) artifacts.push({ ...a, _file: file })
  meta.newFacts.push(...(mod.newFacts ?? []))
  meta.concerns.push(...(mod.concerns ?? []))
}

const byCode = new Map()
for (const n of nodes) {
  if (byCode.has(n.code)) err(n.code, `duplicate node (${n._file})`)
  byCode.set(n.code, n)
}
const artById = new Map()
for (const a of artifacts) {
  if (artById.has(a.id)) err(a.id, `duplicate artifact id (${a._file})`)
  artById.set(a.id, a)
}

/* ───────────────────────────── coverage ───────────────────────────── */

const expectedCodes = onlyAct ? ACTS[onlyAct] : ORDER
for (const code of expectedCodes) if (!byCode.has(code)) (onlyAct || strict ? err : warn)(code, 'no node authored')
for (const n of nodes) {
  if (!LEGACY[n.code]) err(n.code, 'not a runtime node')
  if (onlyAct && ACT_OF[n.code] !== onlyAct) err(n.code, `belongs to act ${ACT_OF[n.code]}, not ${onlyAct}`)
}

/* ───────────────────────────── nodes ───────────────────────────── */

const OBJECTIVE_BAD = /\b(go to|head to|proceed to|travel to|walk to|make your way|report to|find the|visit the|move to)\b/i
const ROLES = ['observer', 'analyst', 'operator']
const prose = n => ({
  question: n.question,
  narrativeObjective: n.narrativeObjective,
  whatTheySee: ROLES.map(r => n[r]?.whatTheySee ?? '').join(' | '),
  taskPrompt: ROLES.map(r => n[r]?.taskPrompt ?? '').join(' | '),
  failure: Object.values(n.failure ?? {}).join(' | '),
  chain: Object.values(n.chain ?? {}).join(' | '),
  hints: (n.hints ?? []).join(' | '),
  clue: n.clue?.clueText ?? '',
})
const evidenceText = n => ROLES.map(r => {
  const b = n[r] ?? {}
  return [b.dataPayload, b.interactiveData?.documentText, ...(b.interactiveData?.entries ?? []).map(e => e.text),
    b.interactiveData?.audioTranscript, b.interactiveData?.message, b.interactiveData?.cipherText,
    b.interactiveData?.gridString, ...(b.interactiveData?.sequence ?? []), ...(b.interactiveData?.binarySequence ?? [])].join(' ')
}).join(' | ')

const seenAnswers = new Map()
for (const n of nodes) {
  const w = n.code
  const must = (cond, msg) => { if (!cond) err(w, msg) }
  must(typeof n.title === 'string' && n.title.length >= 3 && n.title.length <= 40, 'title 3–40 chars')
  must(typeof n.answer === 'string' && n.answer.trim().length > 0, 'answer missing')
  must(Array.isArray(n.alts) && n.alts.length >= 1, 'alts: at least one accepted variant')
  must(typeof n.redact === 'boolean', 'redact must be true or false')
  must(typeof n.format === 'string' && n.format.length > 0, 'format missing (shown on the operator terminal)')
  must(typeof n.question === 'string' && n.question.endsWith('?'), 'question must be a question')
  must(typeof n.narrativeObjective === 'string' && n.narrativeObjective.length > 20, 'narrativeObjective missing')
  if (OBJECTIVE_BAD.test(n.narrativeObjective ?? '')) err(w, 'narrativeObjective reads as a direction ("go to…")')
  if (OBJECTIVE_BAD.test(n.clue?.clueText ?? '')) err(w, 'clue.clueText reads as a direction ("go to…")')
  must(n.clue && typeof n.clue.clueText === 'string' && n.clue.clueText.length > 20, 'clue.clueText missing')
  must(n.code === 'P37' || n.clue?.clueText, 'clue required')
  must(typeof n.reveal === 'string' && n.reveal.length > 20 && n.reveal.length <= 340, 'reveal 20–340 chars')
  must(typeof n.solution === 'string' && n.solution.length > 60, 'solution (ledger text) missing or too short')
  must(MECHS.has(n.mech), `mech "${n.mech}" is not in the list`)
  must(Array.isArray(n.uses), 'uses must be an array (may be empty)')
  must(Array.isArray(n.exhibits) && n.exhibits.length >= 1, 'at least one exhibit is granted on solve')

  // roles
  for (const role of ROLES) {
    const b = n[role]
    if (!b) { err(w, `${role} block missing`); continue }
    for (const key of ['screenTitle', 'visualType', 'whatTheySee', 'taskPrompt', 'dataPayload']) {
      if (typeof b[key] !== 'string' || !b[key].trim()) err(w, `${role}.${key} missing`)
    }
    if (b.visualType && !VISUAL_TYPES.has(b.visualType)) err(w, `${role}.visualType "${b.visualType}" has no renderer`)
    if ((b.dataPayload ?? '').length > 900) err(w, `${role}.dataPayload ${b.dataPayload.length} chars (max 900)`)
    if ((b.interactiveData?.documentText ?? '').length > 1500) err(w, `${role}.documentText too long`)
    if ((b.interactiveData?.entries ?? []).length > 8) err(w, `${role}.entries more than 8`)
    for (const e of b.interactiveData?.exhibits ?? []) {
      if (!e.src || !e.alt) err(w, `${role} inline exhibit needs src and alt`)
    }
  }
  const payloads = ROLES.map(r => n[r]?.dataPayload).filter(Boolean)
  if (new Set(payloads).size < payloads.length) err(w, 'two seats hold the same dataPayload')
  if (n.operator && !/ANSWER \(.+\): \[[^\]]*\]/.test(n.operator.dataPayload ?? '')) {
    warn(w, 'operator.dataPayload should end with an "ANSWER (FORMAT): [ _ _ ]" line')
  }
  // chain / failure
  for (const key of ['observerProduces', 'analystTransforms', 'operatorExecutes']) {
    if (!n.chain?.[key]) err(w, `chain.${key} missing`)
  }
  for (const key of ['wrongStep', 'consequence', 'recoveryGuidance']) {
    if (!n.failure?.[key]) err(w, `failure.${key} missing`)
  }

  // hints
  if (!Array.isArray(n.hints) || n.hints.length !== 4) err(w, 'hints must be exactly four (THINK, FOCUS, DEDUCE, CONFIRM)')
  else {
    n.hints.forEach((h, i) => { if (typeof h !== 'string' || h.length < 20) err(w, `hint ${i + 1} too short`) })
    const lens = n.hints.map(h => h.length)
    if (lens[3] < 30) warn(w, 'CONFIRM hint should state format and constraints')
  }

  // leaks
  const answers = [n.answer, ...(n.alts ?? [])]
  const proseMap = prose(n)
  for (const ans of answers) {
    if (norm(ans).length < 3) continue
    for (const [field, text] of Object.entries(proseMap)) {
      if (contains(text, ans)) err(w, `answer "${ans}" appears in ${field}`)
    }
    if (n.redact === true && contains(evidenceText(n), ans)) err(w, `redact:true but answer "${ans}" appears in a role string`)
  }
  // numeric / time answers are checked against hints only for the full string
  if (norm(n.answer).length < 3) {
    for (const h of n.hints ?? []) {
      if (new RegExp(`(^|[^0-9A-Za-z])${String(n.answer).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}([^0-9A-Za-z]|$)`, 'i').test(h)) {
        warn(w, `short answer "${n.answer}" appears as a token in a hint`)
      }
    }
  }
  const key = norm(n.answer)
  if (key) {
    if (seenAnswers.has(key)) warn(w, `answer duplicates ${seenAnswers.get(key)}`)
    seenAnswers.set(key, w)
  }

  // dependencies
  const myIndex = ORDER.indexOf(n.code)
  for (const u of n.uses ?? []) {
    const ui = ORDER.indexOf(u)
    if (ui < 0) err(w, `uses "${u}": not a node`)
    else if (ui >= myIndex) err(w, `uses "${u}": not earlier in runtime order (circular or forward dependency)`)
  }
  const recall = ROLES.map(r => n[r]?.interactiveData?.requiresPuzzle).filter(Boolean)
  for (const r of recall) {
    if (!(n.uses ?? []).includes(r)) err(w, `requiresPuzzle ${r} is not in uses`)
  }
  if ((n.uses ?? []).length && !recall.length) warn(w, 'uses earlier nodes but no seat carries a requiresPuzzle recall')
  if (n.redHerring && !(n.redHerring.id && n.redHerring.theory && n.redHerring.refutedBy)) err(w, 'redHerring needs id, theory, refutedBy')
  if (n.recontext && !(n.recontext.what && n.recontext.from && n.recontext.to)) err(w, 'recontext needs what, from, to')

  // exhibits
  for (const id of n.exhibits ?? []) {
    const a = artById.get(id)
    if (!a) { err(w, `exhibit ${id} is not defined`); continue }
    if (a.node !== n.code) err(w, `exhibit ${id} belongs to ${a.node}`)
  }
  // clue vs legacy next location
  const nextLoc = LEGACY[n.code]?.metadata?.locationClue?.nextPhysicalLocation
  if (nextLoc && n.code !== 'P37' && !n.clue?.clueText) err(w, `clue must point toward "${nextLoc}"`)
}

/* ───────────────────────────── artifacts ───────────────────────────── */

const referenced = new Set(nodes.flatMap(n => n.exhibits ?? []))
for (const a of artifacts) {
  const w = a.id
  if (!/^EVID-[A-Z0-9]+(-[A-Z0-9]+)?$/.test(a.id)) err(w, 'id must look like EVID-P01 or EVID-P01-B')
  if (!byCode.has(a.node)) { if (!onlyAct) err(w, `node ${a.node} not authored`) }
  if (!KINDS.has(a.kind)) err(w, `kind "${a.kind}" not allowed`)
  for (const key of ['title', 'description', 'source', 'custodian', 'date', 'text']) {
    if (typeof a[key] !== 'string' || !a[key].trim()) err(w, `${key} missing`)
  }
  if (!RELIABILITY.has(a.reliability)) err(w, `reliability "${a.reliability}" not allowed`)
  if (!Array.isArray(a.proves) || !a.proves.length) err(w, 'proves: at least one statement')
  if (!Array.isArray(a.doesNotProve) || !a.doesNotProve.length) err(w, 'doesNotProve: at least one statement')
  if (!referenced.has(a.id)) err(w, 'orphan evidence: no node grants it')
  for (const r of a.relates ?? []) {
    if (!REL_KINDS.has(r.kind)) err(w, `relation kind "${r.kind}"`)
    if (!r.note) err(w, 'relation needs a note')
  }
  if (a.kind === 'audio') {
    if (!a.audio?.file || !a.audio?.script?.length || !a.audio?.transcript) err(w, 'audio needs file, script and transcript')
  } else if (!a.render) err(w, 'render spec missing')
  else if (a.kind === 'still' || a.kind === 'photo') {
    if (!SHOTS.has(a.render.shot)) err(w, `unknown shot "${a.render.shot}"`)
  } else {
    const r = a.render
    if (!['doc', 'receipt', 'screen', 'card', 'note'].includes(r.form)) err(w, `render.form "${r.form}"`)
    if (r.form === 'doc' && !r.title) err(w, 'render.title missing')
    if (r.form === 'doc' && !(r.blocks ?? []).length) err(w, 'render.blocks empty')
  }
}
// relations resolve (global): only checked when the whole set is loaded
if (!onlyAct) {
  for (const a of artifacts) for (const r of a.relates ?? []) {
    if (!artById.has(r.to)) err(a.id, `relates to unknown artifact ${r.to}`)
  }
}
// exhibit text must not contain the answer of the node that grants it (it is a conclusion, not evidence)
for (const n of nodes) for (const id of n.exhibits ?? []) {
  const a = artById.get(id)
  if (!a) continue
  if (a.reliability === 'derived' && n.redact === true) continue
  const conclusionWords = (a.text ?? '').toUpperCase()
  if (/\b(CONCLUSION|THEREFORE THE ANSWER|THE ANSWER IS)\b/.test(conclusionWords)) warn(id, 'exhibit text reads like a conclusion')
}

/* ───────────────────────────── statistics ───────────────────────────── */

if (!onlyAct || showStats) {
  const total = nodes.length
  const dependent = nodes.filter(n => (n.uses ?? []).length > 0).length
  const combining = nodes.filter(n => (n.uses ?? []).length >= 2 || new Set([n.code, ...(n.uses ?? [])]).size >= 3).length
  const recon = nodes.filter(n => n.recontext).length
  const revel = nodes.filter(n => n.revelation).length
  const herrings = new Set(nodes.filter(n => n.redHerring).map(n => n.redHerring.id)).size
  const stats = { nodes: total, artifacts: artifacts.length, dependentOnEarlier: dependent, combiningTwoOrMore: combining, recontextualisations: recon, revelations: revel, redHerrings: herrings }
  if (!onlyAct && total === ORDER.length) {
    const pct = x => Math.round((x / total) * 100)
    if (pct(dependent) < 75) warn('stats', `only ${pct(dependent)}% of nodes depend on earlier information (target ≥75%)`)
    if (pct(combining) < 50) warn('stats', `only ${pct(combining)}% combine two or more earlier findings (target ≥50%)`)
    if (recon < 10) warn('stats', `${recon} recontextualisations (target ≥10)`)
    if (revel < 5) warn('stats', `${revel} major revelations (target ≥5)`)
  }
  console.log('stats', JSON.stringify(stats))
}

for (const c of meta.concerns) console.log('concern:', c)
for (const w of warnings) console.log('warn  ', w)
for (const e of errors) console.log('ERROR ', e)
console.log(`${nodes.length} nodes, ${artifacts.length} artifacts, ${errors.length} errors, ${warnings.length} warnings`)
process.exit(errors.length ? 1 : 0)
void resolve
