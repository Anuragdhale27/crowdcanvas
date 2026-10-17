import type { ReactNode } from 'react'

/* Side-view vehicles facing right. Gradients live in <VehicleDefs/>, rendered once by the scene. */
const BODIES: Record<string, [string, string, string]> = {
  red: ['#e5675f', '#b3262e', '#5a1220'],
  silver: ['#e4eaee', '#a3b0b8', '#4c5962'],
  blue: ['#5f90cf', '#21487f', '#0e2140'],
  white: ['#ffffff', '#d9dfe3', '#8b979f'],
  taxi: ['#ffe36a', '#f6b800', '#9a6b00'],
  bus: ['#6fd0b4', '#1f9a84', '#0d5648'],
  teal: ['#8fe0d0', '#2aa190', '#0f5a50'],
}

export const VehicleDefs = () => (
  <svg width="0" height="0" aria-hidden="true" focusable="false" style={{ position: 'absolute' }}>
    <defs>
      {Object.entries(BODIES).map(([k, [a, b, c]]) => (
        <linearGradient key={k} id={`vb-${k}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={a} /><stop offset=".45" stopColor={b} /><stop offset="1" stopColor={c} />
        </linearGradient>
      ))}
      <linearGradient id="v-glass" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#9fc4d8" /><stop offset=".5" stopColor="#274459" /><stop offset=".56" stopColor="#6f98ae" /><stop offset="1" stopColor="#1b3041" />
      </linearGradient>
      <radialGradient id="v-rim" cx=".4" cy=".35" r=".8">
        <stop offset="0" stopColor="#f2f6f8" /><stop offset=".6" stopColor="#a5b1b8" /><stop offset="1" stopColor="#5c676e" />
      </radialGradient>
      <linearGradient id="v-beam" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="#fff2b8" stopOpacity=".75" /><stop offset="1" stopColor="#fff2b8" stopOpacity="0" />
      </linearGradient>
      <radialGradient id="v-tail">
        <stop offset="0" stopColor="#ff5a4e" stopOpacity=".9" /><stop offset="1" stopColor="#ff5a4e" stopOpacity="0" />
      </radialGradient>
    </defs>
  </svg>
)

const Wheel = ({ cx, cy, r }: { cx: number; cy: number; r: number }) => (
  <g transform={`translate(${cx} ${cy})`}>
    <circle r={r + 2.5} fill="#05090d" />
    <g className="spin">
      <circle r={r} fill="#10161b" stroke="#2b343a" strokeWidth="1.2" />
      <circle r={r * 0.66} fill="url(#v-rim)" />
      {[0, 72, 144, 216, 288].map((a) => (
        <path key={a} d={`M0 0L${(r * 0.6).toFixed(1)} 0`} stroke="#4b565d" strokeWidth={r * 0.17} strokeLinecap="round" transform={`rotate(${a})`} />
      ))}
      <circle r={r * 0.2} fill="#d9e1e5" stroke="#56626a" strokeWidth=".8" />
    </g>
  </g>
)

const Lamps = ({ x, y, tx, ty, beam = true }: { x: number; y: number; tx: number; ty: number; beam?: boolean }) => (
  <>
    {beam && <path className="beam" d={`M${x} ${y}L${x + 130} ${y - 14}L${x + 130} ${y + 20}Z`} fill="url(#v-beam)" />}
    <circle cx={tx} cy={ty} r="11" fill="url(#v-tail)" />
    <rect x={x - 7} y={y - 3} width="8" height="5" rx="2" fill="#fff8d6" />
    <rect x={tx - 1} y={ty - 3} width="7" height="5" rx="2" fill="#ff4a40" />
  </>
)

const Shadow = ({ w }: { w: number }) => <ellipse cx={w / 2} cy="66" rx={w * 0.46} ry="3.2" fill="#000" opacity=".4" />

const Svg = ({ w, h = 72, children }: { w: number; h?: number; children: ReactNode }) => (
  <svg viewBox={`0 0 ${w} ${h}`}>{children}</svg>
)

const Arch = ({ cx, cy = 53 }: { cx: number; cy?: number }) => <circle cx={cx} cy={cy} r="16" fill="#0a0f14" />

export const Sedan = ({ color = 'silver', taxi = false }: { color?: string; taxi?: boolean }) => (
  <Svg w={220}>
    <Shadow w={220} />
    <path d="M6 52C6 46 8 43 16 41L50 36C60 24 76 18 100 18L132 18C148 19 158 27 166 35L196 40C208 42 214 46 214 52L214 56C214 58 212 59 208 59L8 59C6 59 6 57 6 56Z" fill={`url(#vb-${taxi ? 'taxi' : color})`} />
    <Arch cx={52} /><Arch cx={168} />
    <path d="M62 36C70 26 82 22 98 22L104 22L104 36ZM110 22L132 22C144 23 152 29 158 36L110 36Z" fill="url(#v-glass)" />
    <path d="M16 41L196 40" stroke="#fff" strokeOpacity=".4" strokeWidth="1" />
    <path d="M107 37V56M148 37V56M64 40V55" stroke="#000" strokeOpacity=".35" strokeWidth=".9" />
    <rect x="112" y="41" width="9" height="2.2" rx="1" fill="#000" opacity=".4" /><rect x="152" y="41" width="9" height="2.2" rx="1" fill="#000" opacity=".4" />
    <path d="M10 56H206" stroke="#000" strokeOpacity=".35" strokeWidth="3" />
    <ellipse cx="157" cy="35" rx="5" ry="3" fill={`url(#vb-${taxi ? 'taxi' : color})`} stroke="#000" strokeOpacity=".4" strokeWidth=".6" />
    {taxi && (
      <>
        <path d="M14 47H204" stroke="#111" strokeWidth="3" strokeDasharray="4 4" />
        <rect x="98" y="11" width="24" height="8" rx="2" fill="#fff8d6" stroke="#6b5200" strokeWidth=".8" />
        <path d="M104 15H116" stroke="#6b5200" strokeWidth="2" />
      </>
    )}
    <Lamps x={213} y={46} tx={7} ty={46} />
    <Wheel cx={52} cy={53} r={12} /><Wheel cx={168} cy={53} r={12} />
  </Svg>
)

export const Taxi = () => <Sedan taxi />

export const Suv = ({ color = 'blue' }: { color?: string }) => (
  <Svg w={230}>
    <Shadow w={230} />
    <path d="M6 52C6 44 8 40 16 38L44 34L52 21C56 14 64 11 78 11L152 11C160 11 166 15 172 23L180 35L206 38C218 40 224 44 224 52L224 56C224 58 222 59 218 59L8 59C6 59 6 57 6 56Z" fill={`url(#vb-${color})`} />
    <Arch cx={54} /><Arch cx={176} />
    <path d="M60 33L66 22C68 18 72 16 78 16L96 16L96 33ZM102 16L128 16L128 33L102 33ZM134 16L152 16C156 16 160 18 164 24L170 33L134 33Z" fill="url(#v-glass)" />
    <path d="M44 11H160" stroke="#222" strokeWidth="2.2" strokeLinecap="round" opacity=".7" />
    <path d="M16 38L206 38" stroke="#fff" strokeOpacity=".35" strokeWidth="1" />
    <path d="M99 34V56M131 34V56M66 38V55M176 38V55" stroke="#000" strokeOpacity=".35" strokeWidth=".9" />
    <rect x="105" y="40" width="9" height="2.2" rx="1" fill="#000" opacity=".4" /><rect x="137" y="40" width="9" height="2.2" rx="1" fill="#000" opacity=".4" />
    <path d="M10 56H216" stroke="#000" strokeOpacity=".4" strokeWidth="3.4" />
    <ellipse cx="168" cy="33" rx="5" ry="3" fill={`url(#vb-${color})`} stroke="#000" strokeOpacity=".4" strokeWidth=".6" />
    <Lamps x={223} y={45} tx={7} ty={45} />
    <Wheel cx={54} cy={53} r={13} /><Wheel cx={176} cy={53} r={13} />
  </Svg>
)

export const Bus = () => (
  <Svg w={400} h={100}>
    <ellipse cx="200" cy="94" rx="185" ry="4" fill="#000" opacity=".4" />
    <rect x="4" y="8" width="392" height="80" rx="12" fill="url(#vb-bus)" />
    <rect x="30" y="2" width="70" height="8" rx="3" fill="#cfd8dc" /><rect x="120" y="2" width="50" height="8" rx="3" fill="#cfd8dc" />
    <circle cx="94" cy="84" r="19" fill="#0a0f14" /><circle cx="300" cy="84" r="19" fill="#0a0f14" />
    <g fill="url(#v-glass)">
      {[18, 64, 110, 156, 202, 248].map((x) => <rect key={x} x={x} y="20" width="40" height="30" rx="3" />)}
      <rect x="338" y="18" width="50" height="38" rx="6" />
    </g>
    <rect x="296" y="20" width="36" height="58" rx="3" fill="url(#v-glass)" /><path d="M314 20V78" stroke="#0d5648" strokeWidth="1.6" />
    <path d="M6 58H394" stroke="#fff" strokeOpacity=".7" strokeWidth="3" />
    <path d="M6 66H394" stroke="#0d3f36" strokeOpacity=".6" strokeWidth="6" />
    <rect x="342" y="22" width="40" height="8" rx="2" fill="#12201d" /><path d="M346 26H378" stroke="#ffb347" strokeWidth="2.4" strokeDasharray="5 2" />
    <path className="beam" d="M394 70L520 56L520 90Z" fill="url(#v-beam)" />
    <circle cx="8" cy="68" r="12" fill="url(#v-tail)" />
    <rect x="385" y="66" width="11" height="7" rx="2" fill="#fff8d6" /><rect x="3" y="64" width="7" height="8" rx="2" fill="#ff4a40" />
    <Wheel cx={94} cy={84} r={15} /><Wheel cx={300} cy={84} r={15} />
  </Svg>
)

export const Scooter = () => (
  <Svg w={100} h={80}>
    <ellipse cx="50" cy="76" rx="42" ry="2.6" fill="#000" opacity=".4" />
    <path d="M18 66L36 66C40 66 42 58 46 50L60 50L70 62L80 66" stroke="#e8563b" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    <path d="M70 62L72 30" stroke="#444c52" strokeWidth="4" strokeLinecap="round" /><path d="M66 28L78 27" stroke="#2b3238" strokeWidth="4" strokeLinecap="round" />
    <path d="M20 44C20 40 26 40 40 40L52 40L52 50L24 50Z" fill="#e8563b" />
    <path d="M38 40L40 22C42 16 50 16 52 22L50 40Z" fill="#26364a" />
    <path d="M44 28L68 28" stroke="#26364a" strokeWidth="6" strokeLinecap="round" />
    <path d="M44 42L58 52L56 66" stroke="#1c2733" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    <circle cx="46" cy="12" r="8" fill="#f2f2ea" stroke="#b9c1c4" strokeWidth="1" /><path d="M48 10H55V16H48Z" fill="#274459" />
    <path className="beam" d="M80 52L170 40L170 66Z" fill="url(#v-beam)" />
    <circle cx="14" cy="46" r="9" fill="url(#v-tail)" />
    <rect x="77" y="49" width="6" height="5" rx="2" fill="#fff8d6" />
    <Wheel cx={20} cy={66} r={9} /><Wheel cx={80} cy={66} r={9} />
  </Svg>
)
