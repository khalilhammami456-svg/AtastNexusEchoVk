#!/usr/bin/env node
// Compile the case model into what the game runs.
//
//   node case/compile.mjs [--assets] [--force] [--sql] [--index] [--docs]
//
// Default is everything. Steps:
//   assets  render every exhibit (documents, stills, prints, audio) into
//           public/evidence/case and public/audio/case under unguessable names
//   sql     write supabase/migrations/2026100501_case_rebuild.sql
//   index   refresh node names in src/content/puzzles/index.ts
//   docs    write the ledgers under docs/case/
//
// The model is the single source. Nothing generated here is edited by hand.

import { createHash } from 'node:crypto'
import { existsSync, mkdirSync, readFileSync, writeFileSync, readdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { spawnSync } from 'node:child_process'

const HERE = dirname(fileURLToPath(import.meta.url))
const ROOT = join(HERE, '..')
const args = new Set(process.argv.slice(2))
const want = name => args.size === 0 || args.has('--all') || args.has(`--${name}`)
const force = args.has('--force')

const legacy = JSON.parse(readFileSync(join(HERE, 'legacy', 'nodes.json'), 'utf8'))
const ORDER = legacy.map(n => n.code)
const LEGACY = Object.fromEntries(legacy.map(n => [n.code, n]))
const ACT_OF = {}
for (const [act, codes] of Object.entries({
  1: ['P01', 'P02', 'P03', 'P04', 'P05', 'M01'], 2: ['P06', 'P07', 'P08', 'P09', 'P10', 'P11', 'P12'],
  3: ['P13', 'P06b', 'P07b', 'M02', 'P14', 'P15', 'P16', 'P17', 'P17b', 'P18', 'P19'],
  4: ['P20', 'P21', 'M03', 'P22', 'P23', 'P23b', 'P24', 'P24b', 'P25', 'P26'],
  5: ['P27', 'P27b', 'P28', 'P29', 'M04', 'P30', 'P31', 'P32'], 6: ['P33', 'P34', 'P35', 'P36', 'P37'],
})) for (const c of codes) ACT_OF[c] = Number(act)

/* ───────────────────────────── load ───────────────────────────── */

const nodeDir = join(HERE, 'model', 'nodes')
const nodes = []
const artifacts = []
for (const file of readdirSync(nodeDir).filter(f => /^act\d\.mjs$/.test(f)).sort()) {
  const mod = await import(pathToFileURL(join(nodeDir, file)).href)
  nodes.push(...(mod.nodes ?? []))
  artifacts.push(...(mod.artifacts ?? []))
}
nodes.sort((a, b) => ORDER.indexOf(a.code) - ORDER.indexOf(b.code))
const artById = new Map(artifacts.map(a => [a.id, a]))

const check = spawnSync('node', [join(HERE, 'validate.mjs'), '--strict'], { encoding: 'utf8' })
process.stdout.write(check.stdout.split('\n').filter(l => /^(ERROR|stats|\d+ nodes)/.test(l)).join('\n') + '\n')
if (check.status !== 0) {
  console.error('validation failed; nothing compiled')
  process.exit(1)
}
if (nodes.length !== ORDER.length) {
  console.error(`expected ${ORDER.length} nodes, found ${nodes.length}`)
  process.exit(1)
}

/* ───────────────────────────── assets ───────────────────────────── */

const MANIFEST = join(HERE, 'render', 'manifest.json')
const manifest = existsSync(MANIFEST) ? JSON.parse(readFileSync(MANIFEST, 'utf8')) : {}
const SALT = 'nx037-case-2024'

function specHash(a) {
  return createHash('sha1').update(SALT).update(a.id).update(JSON.stringify(a.render ?? a.audio)).update(a.condition ?? '').digest('hex')
}
function publicName(a) {
  return createHash('sha1').update(SALT + ':name:' + a.id).digest('hex').slice(0, 14)
}

if (want('assets')) {
  const { renderDocument } = await import(pathToFileURL(join(HERE, 'render', 'docs.mjs')).href)
  const { renderImage } = await import(pathToFileURL(join(HERE, 'render', 'images.mjs')).href)
  const { renderAudio } = await import(pathToFileURL(join(HERE, 'render', 'audio.mjs')).href)
  const imgDir = join(ROOT, 'public', 'evidence', 'case')
  const audDir = join(ROOT, 'public', 'audio', 'case')
  mkdirSync(imgDir, { recursive: true })
  mkdirSync(audDir, { recursive: true })
  let built = 0
  let kept = 0
  for (const a of artifacts) {
    const name = publicName(a)
    const hash = specHash(a)
    const files = a.kind === 'audio' ? [join(audDir, `${name}.mp3`)] : [join(imgDir, `${name}.jpg`), join(imgDir, `${name}-t.jpg`)]
    if (!force && manifest[a.id]?.hash === hash && files.every(existsSync)) { kept++; continue }
    if (a.kind === 'audio') {
      const { mp3, seconds } = renderAudio(a)
      writeFileSync(files[0], mp3)
      manifest[a.id] = { hash, audio: `/audio/case/${name}.mp3`, seconds: Math.round(seconds) }
    } else {
      const rendered = a.kind === 'still' || a.kind === 'photo' ? await renderImage(a) : await renderDocument(a)
      writeFileSync(files[0], rendered.full)
      writeFileSync(files[1], rendered.thumb)
      manifest[a.id] = { hash, image: `/evidence/case/${name}.jpg`, thumb: `/evidence/case/${name}-t.jpg` }
    }
    built++
    process.stdout.write(`  rendered ${a.id}\n`)
  }
  writeFileSync(MANIFEST, JSON.stringify(manifest, null, 1) + '\n')
  console.log(`assets: ${built} rendered, ${kept} unchanged`)
}

/* The side branch through the lab (P06b, P07b) is part of the main line: later
   leads need the glyph key and the copy map it files. */
const GRAPH = {
  P13: { branches: { unlocks: 'P06b', nextNodes: ['P06b'] } },
  P06b: { prerequisites: ['P13'], branches: { unlocks: 'P07b', nextNodes: ['P07b'] } },
  P07b: { prerequisites: ['P06b'], branches: { unlocks: 'M02', nextNodes: ['M02'] } },
  M02: { prerequisites: ['P07b'], branches: { unlocks: 'P14', nextNodes: ['P14'] } },
}

/* ───────────────────────────── helpers ───────────────────────────── */

const KIND_LABEL = { document: 'Document', plan: 'Plan', note: 'Note', receipt: 'Receipt', screen: 'Terminal', log: 'Log', still: 'Surveillance', photo: 'Photograph', audio: 'Audio' }
const ARTIFACT_TYPE = { document: 'DOCUMENT', plan: 'MAP', note: 'NOTE', receipt: 'DOCUMENT', screen: 'DOCUMENT', log: 'DOCUMENT', still: 'SURVEILLANCE', photo: 'PHOTOGRAPH', audio: 'AUDIO' }
const RELIABILITY_LABEL = {
  primary: 'Original record; first-hand',
  secondary: 'Official statement; not independently checked',
  derived: 'Derived from other records',
  unreliable: 'Origin or accuracy in doubt',
}
const q = text => `$nxj$${text}$nxj$`
const jsonb = value => `${q(JSON.stringify(value))}::jsonb`
const str = text => `$nxs$${text}$nxs$`

function resolveExhibits(data) {
  if (!data?.exhibits) return data
  return {
    ...data,
    exhibits: data.exhibits.map(e => {
      if (typeof e.src === 'string' && e.src.startsWith('EVID-')) {
        const m = manifest[e.src]
        if (!m?.image) throw new Error(`inline exhibit ${e.src} has no rendered image`)
        return { ...e, src: m.image }
      }
      return e
    }),
  }
}

function roleBlock(role, b, node) {
  const out = {
    role: role.toUpperCase(),
    screenTitle: b.screenTitle,
    visualType: b.visualType,
    whatTheySee: b.whatTheySee,
    taskPrompt: b.taskPrompt,
    dataPayload: b.dataPayload,
  }
  let data = resolveExhibits(b.interactiveData)
  // An audio exhibit is heard in the node as well as filed after it.
  const audioArt = (node.exhibits ?? []).map(id => artById.get(id)).find(a => a?.kind === 'audio')
  if (audioArt && role === 'observer' && !data?.audioUrl && !data?.audioClips) {
    data = { ...(data ?? {}), audioUrl: manifest[audioArt.id]?.audio, audioSpeaker: audioArt.audio.speakerLabel ?? audioArt.title }
  }
  if (data && Object.keys(data).length) out.interactiveData = data
  return out
}

function nodeContent(node) {
  const old = LEGACY[node.code].content
  return {
    hints: node.hints,
    observer: roleBlock('observer', node.observer, node),
    analyst: roleBlock('analyst', node.analyst, node),
    operator: roleBlock('operator', node.operator, node),
    branchConditions: old.branchConditions ?? [],
    coordinationChain: node.chain,
    failurePropagation: node.failure,
    narrativeObjective: node.narrativeObjective,
    roleDependencyLevel: old.roleDependencyLevel,
    operatorInvestigation: {
      operatorOwnEvidence: `Your terminal holds: ${node.operator.screenTitle}.`,
      requiredDiscoveries: { observerDiscovery: node.chain.observerProduces, analystDiscovery: node.chain.analystTransforms },
      operatorTaskDescription: node.question,
    },
  }
}

function nodeMetadata(node) {
  const old = LEGACY[node.code].metadata
  const primary = artById.get(node.exhibits[0])
  return {
    ...old,
    storyReveal: node.reveal,
    locationClue: {
      ...(old.locationClue ?? {}),
      format: node.clue.format ?? 'Inference',
      clueText: node.clue.clueText,
    },
    evidenceUnlocked: {
      id: primary.id,
      state: 'RECOVERED',
      title: primary.title,
      source: primary.source,
      content: primary.description,
      category: KIND_LABEL[primary.kind],
      timestamp: `Act ${ACT_OF[node.code]}`,
    },
    evidenceBundle: node.exhibits,
    whyTeamworkMatters: `${node.chain.observerProduces} ${node.chain.analystTransforms} ${node.chain.operatorExecutes}`,
    act: ACT_OF[node.code],
    mechanic: node.mech,
    time: old.time,
  }
}

function answerMetadata(node) {
  return {
    acceptedAnswer: node.answer,
    alternatives: node.alts,
    validationMethod: 'case_insensitive',
    redact: node.redact,
    question: node.question,
    format: node.format,
    fullSolution: node.solution,
  }
}

function evidenceRow(a) {
  const m = manifest[a.id] ?? {}
  const content = {
    text: a.text,
    state: 'UNREVIEWED',
    artifact_type: ARTIFACT_TYPE[a.kind],
    source: a.source,
    custodian: a.custodian,
    provenance: RELIABILITY_LABEL[a.reliability],
    date: a.date,
    captured_at: a.date,
    condition: a.condition ?? 'NORMAL',
  }
  if (m.image) { content.image_url = m.image; content.thumb_url = m.thumb }
  if (m.audio) content.audio_url = m.audio
  if (a.kind === 'audio') content.transcript = a.audio.transcript
  if (a.relates?.length) content.relationships = a.relates.map(r => ({ to: r.to, kind: r.kind.toUpperCase(), note: r.note }))
  const dbType = a.kind === 'audio' ? 'AUDIO' : (a.kind === 'still' || a.kind === 'photo') ? 'IMAGE' : 'DOCUMENT'
  return {
    code: a.id,
    title: a.title,
    description: a.description,
    type: dbType,
    classification: 'RESTRICTED',
    content,
    metadata: { node: a.node, reliability: a.reliability, custodian: a.custodian, source: a.source },
  }
}

/* ───────────────────────────── sql ───────────────────────────── */

function extractFunction(file, name) {
  const text = readFileSync(join(ROOT, 'supabase', 'migrations', file), 'utf8')
  const start = text.lastIndexOf(`CREATE OR REPLACE FUNCTION ${name}(`)
  if (start < 0) throw new Error(`${name} not found in ${file}`)
  const end = text.indexOf('\n$$;', start)
  return text.slice(start, end + 4)
}
function patch(text, from, to, label) {
  if (!text.includes(from)) throw new Error(`patch "${label}" did not match`)
  return text.replace(from, () => to)
}

if (want('sql')) {
  const out = []
  out.push(`-- CASE 037: case-solving content rebuild.
-- Generated by case/compile.mjs from case/model. Do not edit by hand.
--
-- What changes
--   * Every lead is rewritten as a step in one investigation: the answers are
--     claims about the case, each reached from evidence held by different seats.
--   * answer_metadata.alternatives: accepted variants. Comparison ignores case,
--     spacing and punctuation (S01-TUN = S01 TUN = s01tun).
--   * answer_metadata.redact = false: evidence may legitimately contain the
--     claim's own words (a register that names the institution), so the
--     server-side redaction is switched off for those leads. The authoring
--     validator keeps the answer out of every instruction, hint and objective.
--   * Four hint levels (THINK / FOCUS / DEDUCE / CONFIRM); the fourth costs 15 min.
--   * A lead can file several exhibits (metadata.evidenceBundle).
--   * Evidence is replaced by the exhibits the new case needs.
`)

  // 1. hints
  out.push(`-- 1. Four hint levels`)
  out.push(`UPDATE game_config SET value = value || '{"hint4": 900}'::jsonb WHERE key = 'hint_penalties';`)
  let hintFn = extractFunction('2026093010_server_authoritative_puzzles.sql', 'request_hint')
  hintFn = patch(hintFn, 'v_max_hints := LEAST(v_max_hints, 3);', 'v_max_hints := LEAST(v_max_hints, 4);', 'hint cap')
  hintFn = patch(hintFn, 'SECURITY DEFINER\nAS $$', 'SECURITY DEFINER\nSET search_path = public, pg_temp\nAS $$', 'hint search_path')
  out.push(hintFn + '\n')

  // 2. submit
  let submitFn = extractFunction('2026100401_solve_reveal_and_case_close.sql', 'submit_puzzle_answer')
  submitFn = patch(submitFn, `  v_is_correct := (
    v_accepted <> ''
    AND v_normalized_answer = v_accepted
  );`, `  v_is_correct := (
    v_accepted <> ''
    AND (
      v_normalized_answer = v_accepted
      OR (
        char_length(regexp_replace(v_normalized_answer, '[^A-Z0-9]', '', 'g')) > 0
        AND (
          regexp_replace(v_normalized_answer, '[^A-Z0-9]', '', 'g') = regexp_replace(v_accepted, '[^A-Z0-9]', '', 'g')
          OR EXISTS (
            SELECT 1
              FROM jsonb_array_elements_text(COALESCE(v_answer_meta->'alternatives', '[]'::jsonb)) AS alt(value)
             WHERE regexp_replace(UPPER(alt.value), '[^A-Z0-9]', '', 'g') = regexp_replace(v_normalized_answer, '[^A-Z0-9]', '', 'g')
          )
        )
      )
      OR EXISTS (
        SELECT 1
          FROM jsonb_array_elements_text(COALESCE(v_answer_meta->'alternatives', '[]'::jsonb)) AS alt(value)
         WHERE UPPER(TRIM(alt.value)) = v_normalized_answer
      )
    )
  );`, 'answer compare')
  submitFn = patch(submitFn, `    v_evidence_code := v_node_meta->'evidenceUnlocked'->>'id';
    IF v_evidence_code IS NOT NULL THEN
      UPDATE team_progress tp
         SET evidence_owned = tp.evidence_owned || e.id
        FROM evidence e
       WHERE tp.team_id = v_team_id
         AND e.code = v_evidence_code
         AND NOT (e.id = ANY (tp.evidence_owned));
    END IF;`, `    v_evidence_code := v_node_meta->'evidenceUnlocked'->>'id';
    -- A lead files every exhibit in its bundle (or, for older leads, its one exhibit).
    UPDATE team_progress tp
       SET evidence_owned = COALESCE((
             SELECT array_agg(DISTINCT x)
               FROM unnest(tp.evidence_owned || COALESCE((
                      SELECT array_agg(e.id)
                        FROM evidence e
                       WHERE e.code IN (
                         SELECT jsonb_array_elements_text(
                                  COALESCE(v_node_meta->'evidenceBundle', jsonb_build_array(v_evidence_code)))
                       )
                    ), '{}'::uuid[])) AS x
           ), '{}'::uuid[])
     WHERE tp.team_id = v_team_id;`, 'evidence bundle')
  out.push(`-- 2. submit_puzzle_answer: alternatives, loose comparison, evidence bundles`)
  out.push(submitFn + '\n')

  // 3. node detail
  let detailFn = extractFunction('2026100401_solve_reveal_and_case_close.sql', 'get_player_node_detail')
  detailFn = patch(detailFn, '  v_solved_node RECORD;\nBEGIN', '  v_solved_node RECORD;\n  v_redact_key TEXT;\nBEGIN', 'detail declare')
  detailFn = patch(detailFn, `  IF v_node.code IS NULL THEN
    RETURN jsonb_build_object('unlocked', false);
  END IF;
`, `  IF v_node.code IS NULL THEN
    RETURN jsonb_build_object('unlocked', false);
  END IF;

  -- Leads whose evidence legitimately contains the claim's own words opt out
  -- of redaction (answer_metadata.redact = false). The authoring validator
  -- guarantees the answer is absent from objectives, prompts and hints.
  v_redact_key := CASE
    WHEN COALESCE(v_node.answer_metadata->>'redact', 'true') = 'false' THEN NULL
    ELSE v_node.answer_metadata->>'acceptedAnswer'
  END;
`, 'detail redact key')
  const before = detailFn.split(`v_node.answer_metadata->>'acceptedAnswer'`).length - 1
  // only the call sites in the RETURN block use the key; keep the one inside the new CASE
  detailFn = detailFn.replace(/nexus_redact_(answer|jsonb)\(([^)]*?),\s*v_node\.answer_metadata->>'acceptedAnswer'\)/g, (m, k, a) => `nexus_redact_${k}(${a}, v_redact_key)`)
  if (before < 2) throw new Error('detail redact call sites not found')
  out.push(`-- 3. get_player_node_detail: per-lead redaction opt-out`)
  out.push(detailFn + '\n')

  // 4. nodes
  out.push(`-- 4. Leads`)
  for (const node of nodes) {
    out.push(`UPDATE puzzle_nodes SET
  title = ${str(node.title)},
  content = ${jsonb(nodeContent(node))},
  metadata = ${jsonb(nodeMetadata(node))},
  answer_metadata = ${jsonb(answerMetadata(node))}
WHERE code = ${str(node.code)};`)
  }
  for (const [code, g] of Object.entries(GRAPH)) {
    const sets = []
    if (g.prerequisites) sets.push(`prerequisites = ${jsonb(g.prerequisites)}`)
    if (g.branches) sets.push(`branches = ${jsonb(g.branches)}`)
    out.push(`UPDATE puzzle_nodes SET ${sets.join(', ')} WHERE code = ${str(code)};`)
  }
  out.push('')

  // 5. evidence
  const rows = artifacts.map(evidenceRow)
  out.push(`-- 5. Evidence`)
  out.push(`DELETE FROM evidence WHERE code NOT IN (${rows.map(r => str(r.code)).join(', ')});`)
  for (const r of rows) {
    out.push(`INSERT INTO evidence (code, title, description, type, classification, content, metadata)
VALUES (${str(r.code)}, ${str(r.title)}, ${str(r.description)}, ${str(r.type)}::evidence_type, ${str(r.classification)}::evidence_classification, ${jsonb(r.content)}, ${jsonb(r.metadata)})
ON CONFLICT (code) DO UPDATE SET
  title = EXCLUDED.title, description = EXCLUDED.description, type = EXCLUDED.type,
  classification = EXCLUDED.classification, content = EXCLUDED.content, metadata = EXCLUDED.metadata;`)
  }
  out.push('')

  // 6. teams mid-case
  out.push(`-- 6. Teams already mid-case: drop references to removed exhibits, file every exhibit of every closed lead.
UPDATE team_progress tp
   SET evidence_owned = COALESCE((
         SELECT array_agg(DISTINCT x)
           FROM unnest(tp.evidence_owned || COALESCE((
                  SELECT array_agg(e.id)
                    FROM node_progress np
                    JOIN puzzle_nodes n ON n.id = np.node_id
                    JOIN evidence e ON e.code IN (SELECT jsonb_array_elements_text(n.metadata->'evidenceBundle'))
                   WHERE np.team_id = tp.team_id AND np.status = 'SOLVED'
                ), '{}'::uuid[])) AS x
          WHERE EXISTS (SELECT 1 FROM evidence ev WHERE ev.id = x)
       ), '{}'::uuid[]);
`)
  const file = join(ROOT, 'supabase', 'migrations', '2026100501_case_rebuild.sql')
  writeFileSync(file, out.join('\n') + '\n')
  console.log(`sql: ${file.replace(ROOT + '/', '')} (${Math.round(out.join('\n').length / 1024)} KB)`)
}

/* ───────────────────────────── index.ts ───────────────────────────── */

if (want('index')) {
  const file = join(ROOT, 'src', 'content', 'puzzles', 'index.ts')
  let text = readFileSync(file, 'utf8')
  let changed = 0
  for (const node of nodes) {
    const re = new RegExp(`(code: '${node.code}',\\n\\s+name: )'[^']*'`)
    if (!re.test(text)) throw new Error(`index.ts has no entry for ${node.code}`)
    text = text.replace(re, (m, head) => `${head}'${node.title.replace(/'/g, "\\'")}'`)
    const g = GRAPH[node.code]
    if (g?.prerequisites) text = text.replace(new RegExp(`(code: '${node.code}',[\\s\\S]*?prerequisiteNodes: )\\[[^\\]]*\\]`), (m, head) => `${head}${JSON.stringify(g.prerequisites)}`)
    if (g?.branches) text = text.replace(new RegExp(`(code: '${node.code}',[\\s\\S]*?nextNodes: )\\[[^\\]]*\\]`), (m, head) => `${head}${JSON.stringify(g.branches.nextNodes)}`)
    changed++
  }
  writeFileSync(file, text)
  console.log(`index: ${changed} names refreshed`)
}

/* ───────────────────────────── ledgers ───────────────────────────── */

if (want('docs')) {
  const { writeLedgers } = await import(pathToFileURL(join(HERE, 'ledgers.mjs')).href)
  writeLedgers({ nodes, artifacts, ACT_OF, ORDER, ROOT, manifest })
}
