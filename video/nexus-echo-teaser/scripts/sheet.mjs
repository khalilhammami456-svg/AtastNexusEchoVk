// Tiles out/stills/*.png (sorted) into a labelled contact sheet: node scripts/sheet.mjs out/sheet.png [cols] [width]
import { execFileSync } from 'node:child_process'
import fs from 'node:fs'
const [out = 'out/sheet.png', cols = '4', width = '480'] = process.argv.slice(2)
const files = fs.readdirSync('out/stills').filter((f) => f.endsWith('.png')).sort()
const rows = Math.ceil(files.length / Number(cols))
const args = ['-v', 'error', '-y']
files.forEach((f) => args.push('-i', `out/stills/${f}`))
const labelled = files.map((f, i) => `[${i}:v]scale=${width}:-2,drawtext=text='${(Number(f.slice(1, 6)) / 100).toFixed(2)}s':x=w-tw-8:y=h-th-8:fontsize=22:fontcolor=white:box=1:boxcolor=black@0.6[v${i}]`)
args.push('-filter_complex', `${labelled.join(';')};${files.map((_, i) => `[v${i}]`).join('')}xstack=inputs=${files.length}:layout=${files.map((_, i) => `${(i % Number(cols)) * (Number(width) + 4)}_${Math.floor(i / Number(cols)) * (Math.round(Number(width) * 9 / 16) + 4)}`).join('|')}[o]`, '-map', '[o]', '-frames:v', '1', out)
execFileSync('ffmpeg', args, { stdio: 'inherit' })
console.log('sheet', out, files.length, 'stills', rows, 'rows')
