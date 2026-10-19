import type { CSSProperties } from 'react'

/* Hand-built vector city (viewBox 1600x900). Colours come from CSS custom properties so the
   inline copy follows the page theme; public/assets/us-city-billboard.svg is a baked dark copy. */
const W = 1600, GROUND = 640
const v = (n: string) => `var(--${n})`
const sf = (n: string): CSSProperties => ({ stopColor: v(n) })

function rng(seed: number) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const far = (() => {
  const r = rng(11), out: { x: number; w: number; h: number; a: boolean }[] = []
  for (let x = -10; x < W; ) { const w = 40 + r() * 55; out.push({ x, w, h: 100 + r() * 170, a: r() > 0.7 }); x += w - 4 }
  return out
})()

const MID: [number, number, number, 'flat' | 'spire' | 'step'][] = [
  [20, 90, 430, 'step'], [118, 70, 330, 'flat'], [225, 100, 520, 'spire'], [350, 82, 380, 'flat'], [455, 112, 470, 'step'],
  [575, 80, 350, 'flat'], [1005, 90, 400, 'flat'], [1090, 100, 500, 'spire'], [1205, 80, 360, 'flat'], [1300, 112, 470, 'step'],
  [1425, 90, 400, 'flat'], [1520, 90, 330, 'spire'],
]
const NEAR: [number, number, number, 'w1' | 'w2' | 'w3', string][] = [
  [0, 150, 250, 'w1', '#e0457b'], [150, 175, 190, 'w2', ''], [325, 150, 300, 'w3', '#2ed3e6'], [475, 125, 150, 'w1', ''],
  [995, 135, 170, 'w2', '#2ed3e6'], [1130, 160, 310, 'w3', ''], [1290, 150, 200, 'w1', '#e0457b'], [1440, 160, 260, 'w2', '#ffb03a'],
]
const LAMPS = [135, 560, 1065, 1500]
const TREES = [270, 1230]

const Blink = ({ x, y, d = 0 }: { x: number; y: number; d?: number }) => (
  <g className="blink" style={{ animationDelay: `${d}s` }}>
    <circle cx={x} cy={y} r="9" fill="#ff3b30" opacity=".35" /><circle cx={x} cy={y} r="3" fill="#ff5a4e" />
  </g>
)

export function SceneArt({ style }: { style?: CSSProperties }) {
  return (
    <svg className="scene-art" viewBox={`0 0 ${W} 900`} preserveAspectRatio="none" aria-hidden="true" focusable="false" style={style}>
      <defs>
        <linearGradient id="sc-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" style={sf('sky0')} /><stop offset=".4" style={sf('sky1')} /><stop offset=".72" style={sf('sky2')} /><stop offset="1" style={sf('sky3')} />
        </linearGradient>
        <linearGradient id="sc-haze" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" style={sf('haze')} stopOpacity="0" /><stop offset="1" style={sf('haze')} stopOpacity=".85" />
        </linearGradient>
        <linearGradient id="sc-glass" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" style={sf('glassA')} /><stop offset=".5" style={sf('glassB')} /><stop offset="1" style={sf('glassA')} />
        </linearGradient>
        <linearGradient id="sc-shine" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#fff" stopOpacity="0" /><stop offset=".35" stopColor="#fff" stopOpacity=".28" /><stop offset=".5" stopColor="#fff" stopOpacity="0" /><stop offset=".78" stopColor="#fff" stopOpacity=".14" /><stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="sc-near" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" style={sf('nearA')} /><stop offset="1" style={sf('nearB')} />
        </linearGradient>
        <linearGradient id="sc-asphalt" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" style={sf('roadA')} /><stop offset="1" style={sf('roadB')} />
        </linearGradient>
        <linearGradient id="sc-steel" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#59656d" /><stop offset=".25" stopColor="#c3ccd1" /><stop offset=".6" stopColor="#7d8a92" /><stop offset="1" stopColor="#3b454c" />
        </linearGradient>
        <linearGradient id="sc-cone" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffe6a8" stopOpacity=".85" /><stop offset="1" stopColor="#ffe6a8" stopOpacity="0" />
        </linearGradient>
        <radialGradient id="sc-glow"><stop offset="0" stopColor="#ffe9b8" stopOpacity=".9" /><stop offset="1" stopColor="#ffe9b8" stopOpacity="0" /></radialGradient>
        <radialGradient id="sc-sun"><stop offset="0" style={sf('sun')} stopOpacity=".9" /><stop offset="1" style={sf('sun')} stopOpacity="0" /></radialGradient>
        <radialGradient id="sc-leaf" cx=".4" cy=".35" r=".75"><stop offset="0" style={sf('leafA')} /><stop offset="1" style={sf('leafB')} /></radialGradient>
        <filter id="sc-blur" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="14" /></filter>

        <pattern id="sc-curtain" width="16" height="20" patternUnits="userSpaceOnUse">
          <rect width="16" height="20" fill="none" /><path d="M15.5 0V20M0 19.5H16" stroke="#0a1a28" strokeOpacity=".45" strokeWidth="1.2" />
          <path d="M0 .5H16" stroke="#fff" strokeOpacity=".12" />
        </pattern>
        <pattern id="sc-w1" width="42" height="34" patternUnits="userSpaceOnUse">
          <rect x="5" y="6" width="12" height="18" fill="#ffd58a" /><rect x="22" y="6" width="12" height="18" fill="#1a2634" />
          <rect x="5" y="6" width="12" height="18" fill="#fff" opacity=".12" />
        </pattern>
        <pattern id="sc-w2" width="54" height="40" patternUnits="userSpaceOnUse">
          <rect x="6" y="7" width="12" height="20" fill="#9fdcf0" opacity=".85" /><rect x="24" y="7" width="12" height="20" fill="#1a2634" />
          <rect x="42" y="7" width="8" height="20" fill="#ffc47a" />
        </pattern>
        <pattern id="sc-w3" width="60" height="30" patternUnits="userSpaceOnUse">
          <rect x="4" y="5" width="16" height="16" fill="#ffcf7d" /><rect x="22" y="5" width="16" height="16" fill="#1a2634" />
          <rect x="40" y="5" width="16" height="16" fill="#a6e4f5" opacity=".9" />
        </pattern>
        <pattern id="sc-tile" width="40" height="28" patternUnits="userSpaceOnUse"><path d="M39.5 0V28M0 .5H40" stroke="#000" strokeOpacity=".16" /></pattern>
      </defs>

      {/* sky */}
      <rect width={W} height="900" fill="url(#sc-sky)" />
      <g style={{ opacity: v('stars') }} fill="#fff">
        {Array.from({ length: 46 }, (_, i) => { const r = rng(i * 7 + 3); return <circle key={i} cx={r() * W} cy={r() * 290} r={0.6 + r() * 1.1} opacity={0.35 + r() * 0.6} /> })}
      </g>
      <circle cx="1230" cy="470" r="260" fill="url(#sc-sun)" />
      <rect y="420" width={W} height="230" fill="url(#sc-haze)" />

      {/* far skyline */}
      <g style={{ fill: v('far') }}>
        {far.map((b, i) => (
          <g key={i}><rect x={b.x} y={GROUND - b.h} width={b.w} height={b.h} />{b.a && <rect x={b.x + b.w / 2 - 1.5} y={GROUND - b.h - 28} width="3" height="28" />}</g>
        ))}
      </g>
      <rect y="470" width={W} height={GROUND - 470} fill="url(#sc-haze)" opacity=".7" />

      {/* mid glass towers */}
      {MID.map(([x, w, h, kind], i) => {
        const top = GROUND - h, cx = x + w / 2
        return (
          <g key={i}>
            <rect x={x} y={top} width={w} height={h} fill="url(#sc-glass)" />
            <rect x={x} y={top} width={w} height={h} fill="url(#sc-curtain)" />
            <rect x={x + w * 0.1} y={top} width={w * 0.34} height={h} fill="url(#sc-shine)" />
            <rect x={x} y={top} width="3" height={h} fill="#fff" opacity=".18" /><rect x={x + w - 3} y={top} width="3" height={h} fill="#000" opacity=".25" />
            {kind === 'step' && (
              <>
                <rect x={x + w * 0.15} y={top - 46} width={w * 0.7} height="46" fill="url(#sc-glass)" /><rect x={x + w * 0.15} y={top - 46} width={w * 0.7} height="46" fill="url(#sc-curtain)" />
                <rect x={cx - 1.5} y={top - 100} width="3" height="54" fill="#9aa7ae" /><Blink x={cx} y={top - 100} d={i * 0.4} />
              </>
            )}
            {kind === 'spire' && (
              <>
                <path d={`M${x + 4} ${top}L${cx - 6} ${top - 60}H${cx + 6}L${x + w - 4} ${top}Z`} fill="url(#sc-glass)" />
                <rect x={cx - 1.2} y={top - 150} width="2.4" height="92" fill="#c9d3d8" /><Blink x={cx} y={top - 150} d={i * 0.3} />
              </>
            )}
            {kind === 'flat' && (
              <>
                <rect x={x + w * 0.2} y={top - 12} width={w * 0.25} height="12" fill="#56636b" />
                <rect x={x + w * 0.7} y={top - 34} width="2" height="34" fill="#9aa7ae" /><Blink x={x + w * 0.7 + 1} y={top - 34} d={i * 0.5} />
              </>
            )}
            <rect x={x} y={GROUND - 20} width={w} height="20" fill="#000" opacity=".25" />
          </g>
        )
      })}

      {/* billboard glow, frame and truss */}
      <ellipse cx="802" cy="360" rx="330" ry="320" fill="url(#sc-glow)" opacity=".28" style={{ opacity: v('bbglow') }} />
      <g>
        <path d="M706 612L706 660M894 612L894 660" stroke="url(#sc-steel)" strokeWidth="14" />
        <path d="M706 622L894 622M706 640L894 640M706 622L894 640M894 622L706 640" stroke="#7d8a92" strokeWidth="3" />
        <rect x="690" y="656" width="32" height="8" rx="2" fill="#4a555c" /><rect x="878" y="656" width="32" height="8" rx="2" fill="#4a555c" />
        <rect x="606" y="102" width="394" height="516" rx="5" fill="url(#sc-steel)" />
        <rect x="620" y="116" width="366" height="488" fill="#0d1318" />
        <rect x="598" y="606" width="410" height="14" fill="#3a444b" /><path d="M598 606H1008" stroke="#c3ccd1" strokeWidth="2" />
        <path d="M606 586V606M1000 586V606M806 588V606" stroke="#2d363c" strokeWidth="3" />
        {[650, 730, 810, 890, 960].map((x) => (
          <g key={x}>
            <path d={`M${x} 102V86H${x + 26}`} stroke="#59656d" strokeWidth="4" fill="none" />
            <rect x={x + 8} y="84" width="24" height="8" rx="2" fill="#fff8de" />
            <ellipse cx={x + 20} cy="98" rx="30" ry="12" fill="url(#sc-glow)" opacity=".7" />
          </g>
        ))}
      </g>

      {/* near buildings */}
      {NEAR.map(([x, w, h, pat, led], i) => {
        const top = GROUND - h
        return (
          <g key={i}>
            <rect x={x} y={top} width={w} height={h} fill="url(#sc-near)" />
            <g style={{ opacity: v('lit') }}><rect x={x + 6} y={top + 14} width={w - 12} height={h - 30} fill={`url(#sc-${pat})`} /></g>
            <rect x={x} y={top} width={w} height="6" fill="#fff" opacity=".14" />
            <rect x={x + w * 0.62} y={top - 20} width={w * 0.22} height="20" fill="#26323c" /><rect x={x + w * 0.12} y={top - 9} width={w * 0.3} height="9" fill="#2b3944" />
            {led && (
              <g className="led">
                <rect x={x} y={top + 6} width={w} height="4" fill={led} /><rect x={x} y={top + 2} width={w} height="12" fill={led} opacity=".35" filter="url(#sc-blur)" />
                <rect x={x} y={GROUND - 30} width="3" height="30" fill={led} />
              </g>
            )}
            <rect x={x} y={GROUND - 34} width={w} height="34" fill="#0b1117" opacity=".55" />
            <rect x={x + 10} y={GROUND - 28} width={w - 20} height="22" fill="#ffd9a0" opacity=".5" style={{ opacity: v('shop') }} />
            <path d={`M${x + 10} ${GROUND - 34}H${x + w - 10}L${x + w - 4} ${GROUND - 28}H${x + 4}Z`} fill="#8a3b34" />
            <rect x={x + w - 1.5} y={top} width="1.5" height={h} fill="#000" opacity=".3" />
          </g>
        )
      })}

      {/* street */}
      <rect y={GROUND} width={W} height="30" fill="#8f9aa1" />
      <rect y={GROUND} width={W} height="30" fill="url(#sc-tile)" />
      <rect y={GROUND} width={W} height="3" fill="#fff" opacity=".3" />
      <rect y="668" width={W} height="8" fill="#b6bfc4" /><rect y="676" width={W} height="4" fill="#000" opacity=".4" />
      <rect y="676" width={W} height="224" fill="url(#sc-asphalt)" />
      <path d="M0 782H1600" stroke="#f3c53a" strokeWidth="3" opacity=".9" /><path d="M0 790H1600" stroke="#f3c53a" strokeWidth="3" opacity=".9" />
      
      <path d="M0 892H1600" stroke="#fff" strokeOpacity=".25" strokeWidth="6" />
      <rect y="676" width={W} height="22" fill="#000" opacity=".25" />

      {/* trees + planters */}
      {TREES.map((x) => (
        <g key={x}>
          <rect x={x - 2.5} y="570" width="5" height="74" fill="#4a362a" />
          <circle cx={x} cy="560" r="42" fill="url(#sc-leaf)" /><circle cx={x - 28} cy="582" r="26" fill="url(#sc-leaf)" /><circle cx={x + 28} cy="580" r="28" fill="url(#sc-leaf)" />
          <rect x={x - 22} y="634" width="44" height="16" rx="3" fill="#6c757b" /><rect x={x - 22} y="634" width="44" height="4" fill="#fff" opacity=".2" />
        </g>
      ))}
      {[420, 1380].map((x) => (
        <g key={x}><rect x={x - 26} y="636" width="52" height="14" rx="3" fill="#6c757b" /><circle cx={x - 12} cy="628" r="12" fill="url(#sc-leaf)" /><circle cx={x + 8} cy="624" r="15" fill="url(#sc-leaf)" /></g>
      ))}

      {/* traffic light */}
      <g>
        <rect x="1014" y="520" width="5" height="136" fill="#2b3338" /><rect x="1014" y="520" width="38" height="4" fill="#2b3338" />
        <rect x="1038" y="524" width="18" height="46" rx="4" fill="#12181c" stroke="#3a454c" />
        <circle cx="1047" cy="535" r="5" fill="#5a1a1a" /><circle cx="1047" cy="547" r="5" fill="#5a4a14" />
        <circle cx="1047" cy="559" r="5" fill="#46e08b" /><circle cx="1047" cy="559" r="14" fill="#46e08b" opacity=".3" />
      </g>

      {/* street lamps */}
      {LAMPS.map((x) => (
        <g key={x}>
          <path d={`M${x + 31} 492H${x + 51}L${x + 130} 676H${x - 50}Z`} fill="url(#sc-cone)" style={{ opacity: v('cone') }} />
          <rect x={x - 3} y="500" width="6" height="164" fill="#2b3338" /><rect x={x - 3} y="500" width="2" height="164" fill="#fff" opacity=".2" />
          <path d={`M${x} 502C${x} 486 ${x + 20} 482 ${x + 38} 486`} stroke="#2b3338" strokeWidth="5" fill="none" strokeLinecap="round" />
          <rect x={x + 28} y="483" width="26" height="8" rx="4" fill="#3a444b" /><rect x={x + 31} y="489" width="20" height="3" rx="1.5" fill="#fff4cc" />
          <circle cx={x + 41} cy="494" r="22" fill="url(#sc-glow)" style={{ opacity: v('cone') }} />
        </g>
      ))}
    </svg>
  )
}
