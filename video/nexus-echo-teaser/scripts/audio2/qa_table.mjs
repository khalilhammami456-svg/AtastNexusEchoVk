// quick per-section RMS table from levels.json: node scripts/audio2/qa_table.mjs A
import fs from 'node:fs'
const ver = process.argv[2] ?? 'A'
const l = JSON.parse(fs.readFileSync(new URL(`../../public/audio/v2/${ver}/levels.json`, import.meta.url)))
const secs = [[0, 5], [5, 10], [10, 18.5], [18.5, 25], [26, 30.5], [30.5, 34], [34, 40], [40, 42], [42, 48], [49.2, 52.6], [53.3, 56]]
const names = Object.keys(l.stems)
const avg = (arr, a, b) => { const p = arr.slice(Math.ceil(a), Math.floor(b)); if (!p.length) return NaN; const e = p.reduce((s, x) => s + Math.pow(10, x / 10), 0) / p.length; return 10 * Math.log10(e) }
console.log('section'.padEnd(10) + names.map((n) => n.slice(0, 9).padStart(10)).join('') + '       mix')
for (const [a, b] of secs) console.log((a + '-' + b).padEnd(10) + names.map((n) => avg(l.stems[n].perSecondRmsDb, a, b).toFixed(1).padStart(10)).join('') + avg(l.mix.perSecondRmsDb, a, b).toFixed(1).padStart(10))
console.log('peaks', names.map((n) => n + ':' + l.stems[n].peakDb).join(' '), 'mix', l.mix.peakDb, JSON.stringify(l.ebur128))
