import React from 'react'

const MONO = "'Plex Mono', monospace"
const COURIER = "'Courier Prime', 'Courier New', monospace"

/** A spoked tape reel; `angle` in degrees. */
export const Reel: React.FC<{ cx: number; cy: number; r: number; angle: number }> = ({ cx, cy, r, angle }) => (
  <g transform={`rotate(${angle} ${cx} ${cy})`}>
    <circle cx={cx} cy={cy} r={r} fill="#15110e" stroke="#3c3732" strokeWidth={r * 0.08} />
    {[0, 60, 120, 180, 240, 300].map((a) => (
      <rect key={a} x={cx - r * 0.06} y={cy - r * 0.92} width={r * 0.12} height={r * 0.5} fill="#d9d4c6" transform={`rotate(${a} ${cx} ${cy})`} />
    ))}
    <circle cx={cx} cy={cy} r={r * 0.2} fill="#8a8578" />
  </g>
)

/** Micro-cassette lying flat. */
export const Cassette: React.FC<{ w?: number; angle?: number }> = ({ w = 360, angle = 0 }) => {
  const h = w * 0.62
  return (
    <svg width={w} height={h} viewBox="0 0 360 223" style={{ overflow: 'visible' }}>
      <rect x="2" y="2" width="356" height="219" rx="12" fill="#26282a" stroke="#0a0b0c" strokeWidth="3" />
      <rect x="2" y="2" width="356" height="219" rx="12" fill="url(#cg)" opacity="0.5" />
      <defs>
        <linearGradient id="cg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#4a4d50" /><stop offset="1" stopColor="#101112" /></linearGradient>
      </defs>
      <rect x="26" y="22" width="308" height="86" rx="4" fill="#d8d0b8" />
      <text x="40" y="52" fontFamily={COURIER} fontSize="22" fill="#2a2620" letterSpacing="2">TAPE 7</text>
      <text x="40" y="80" fontFamily={COURIER} fontSize="15" fill="#4a4538" letterSpacing="1.5">NODE B-04 / 14 OCT 94</text>
      <rect x="40" y="90" width="280" height="2" fill="#a22a24" />
      <rect x="64" y="122" width="232" height="62" rx="8" fill="#0c0d0e" stroke="#3d4144" strokeWidth="2" />
      <Reel cx={110} cy={153} r={22} angle={angle} />
      <Reel cx={250} cy={153} r={22} angle={angle} />
      <rect x="118" y="195" width="124" height="14" rx="3" fill="#0c0d0e" />
      <circle cx="26" cy="196" r="5" fill="#0c0d0e" />
      <circle cx="334" cy="196" r="5" fill="#0c0d0e" />
    </svg>
  )
}

export const Dictaphone: React.FC<{ w?: number; angle?: number }> = ({ w = 520, angle = 0 }) => (
  <svg width={w} height={w * 0.45} viewBox="0 0 520 234" style={{ overflow: 'visible' }}>
    <rect x="3" y="3" width="514" height="228" rx="22" fill="#171819" stroke="#050505" strokeWidth="4" />
    <rect x="3" y="3" width="514" height="228" rx="22" fill="url(#dg)" opacity="0.6" />
    <defs>
      <linearGradient id="dg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#3a3d40" /><stop offset="0.5" stopColor="#141516" /><stop offset="1" stopColor="#0a0a0b" /></linearGradient>
    </defs>
    {Array.from({ length: 9 }, (_, i) => (
      <rect key={i} x="34" y={30 + i * 11} width="120" height="4" rx="2" fill="#0a0a0a" stroke="#4b4f52" strokeWidth="1" />
    ))}
    <rect x="190" y="26" width="296" height="108" rx="10" fill="#0a0b0c" stroke="#40444a" strokeWidth="3" />
    <Reel cx={262} cy={80} r={30} angle={angle} />
    <Reel cx={414} cy={80} r={30} angle={angle} />
    <text x="34" y="190" fontFamily={MONO} fontSize="15" fill="#8d9296" letterSpacing="4">DICTAPHONE</text>
    {[0, 1, 2, 3].map((i) => (
      <rect key={i} x={190 + i * 76} y="160" width="64" height="40" rx="6" fill={i === 0 ? '#7a1f1b' : '#26292b'} stroke="#080808" strokeWidth="2" />
    ))}
    <circle cx="214" cy="180" r="6" fill="#d8423a" />
  </svg>
)

/** Buff case folder with a typed label. */
export const Folder: React.FC<{ w?: number }> = ({ w = 760 }) => {
  const h = w * 0.7
  return (
    <div style={{ position: 'relative', width: w, height: h }}>
      <div style={{ position: 'absolute', left: 0, top: h * 0.04, width: w, height: h * 0.96, background: 'linear-gradient(160deg,#b4a37f,#9a8a68)', borderRadius: 6, boxShadow: 'inset 0 0 0 2px rgba(60,50,30,0.35)' }} />
      <div style={{ position: 'absolute', left: w * 0.06, top: 0, width: w * 0.3, height: h * 0.1, background: '#b4a37f', borderRadius: '6px 6px 0 0', boxShadow: 'inset 0 0 0 2px rgba(60,50,30,0.35)' }}>
        <div style={{ fontFamily: COURIER, fontSize: w * 0.035, color: '#2c2518', padding: `${w * 0.012}px ${w * 0.02}px`, letterSpacing: 2 }}>NX-037</div>
      </div>
      <div style={{ position: 'absolute', left: w * 0.1, top: h * 0.22, width: w * 0.8, height: h * 0.34, background: '#d8d1bd', boxShadow: '0 2px 6px rgba(0,0,0,0.4)', padding: w * 0.03, boxSizing: 'border-box' }}>
        <div style={{ fontFamily: COURIER, fontSize: w * 0.026, color: '#26221a', letterSpacing: 2.4 }}>HALDER INSTITUTE FOR CONTINUITY STUDIES</div>
        <div style={{ fontFamily: COURIER, fontSize: w * 0.026, color: '#4a4436', letterSpacing: 2, marginTop: w * 0.006 }}>BUREAU OF CONTINUITY RECORDS</div>
        <div style={{ fontFamily: COURIER, fontSize: w * 0.075, color: '#1c1812', letterSpacing: 6, marginTop: w * 0.025, fontWeight: 700 }}>CASE 037</div>
        <div style={{ fontFamily: COURIER, fontSize: w * 0.026, color: '#3a3528', letterSpacing: 2, marginTop: w * 0.01 }}>EAST CORRIDOR / LOC-C214</div>
      </div>
      <div style={{ position: 'absolute', left: w * 0.55, top: h * 0.68, width: w * 0.34, height: h * 0.1, border: '3px solid rgba(150,40,34,0.75)', color: 'rgba(150,40,34,0.8)', fontFamily: MONO, fontWeight: 500, fontSize: w * 0.034, letterSpacing: 5, display: 'flex', alignItems: 'center', justifyContent: 'center', transform: 'rotate(-5deg)' }}>RECOVERED</div>
    </div>
  )
}

export const Pen: React.FC<{ w?: number }> = ({ w = 460 }) => (
  <svg width={w} height={w * 0.07} viewBox="0 0 460 32" style={{ overflow: 'visible' }}>
    <defs>
      <linearGradient id="pg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#4a5a78" /><stop offset="0.45" stopColor="#1a2234" /><stop offset="1" stopColor="#0a0d16" /></linearGradient>
    </defs>
    <rect x="40" y="4" width="420" height="24" rx="12" fill="url(#pg)" />
    <polygon points="0,16 42,5 42,27" fill="#c9c6bb" />
    <polygon points="0,16 12,12 12,20" fill="#14110d" />
    <rect x="64" y="9" width="260" height="3" fill="rgba(255,255,255,0.18)" />
    <rect x="380" y="8" width="8" height="16" fill="#b7b3a6" />
  </svg>
)
