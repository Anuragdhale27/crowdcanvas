import { useEffect, useRef, useState } from 'react'
import { Icon } from './Icon'
import { SceneArt } from './SceneArt'
import { Bus, Scooter, Sedan, Suv, Taxi, VehicleDefs } from './Vehicles'
import { normalizeDestination, type Poster } from '../lib/utils'

const PLACEHOLDER =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 800'%3E%3Crect width='600' height='800' fill='%23f6f1e5'/%3E%3Ctext x='50%25' y='42%25' text-anchor='middle' font-family='Arial,sans-serif' font-size='54' font-weight='700' fill='%231b2b40'%3ECROWD%3C/text%3E%3Ctext x='50%25' y='51%25' text-anchor='middle' font-family='Arial,sans-serif' font-size='54' font-weight='700' fill='%23a4d82b'%3ECANVAS%3C/text%3E%3Ctext x='50%25' y='60%25' text-anchor='middle' font-family='Arial,sans-serif' font-size='24' fill='%233d4b5a'%3EYour poster belongs here%3C/text%3E%3C/svg%3E"

type V = { k: 'sedan' | 'suv' | 'taxi' | 'bus' | 'scooter'; lane: 'far' | 'near'; w: number; dur: number; delay: number; color?: string }
// far lane drives left (mirrored), near lane drives right
const TRAFFIC: V[] = [
  { k: 'sedan', lane: 'far', w: 11, dur: 22, delay: -4, color: 'red' }, { k: 'bus', lane: 'far', w: 20, dur: 30, delay: -22.5 },
  { k: 'taxi', lane: 'far', w: 11, dur: 24, delay: -11 }, { k: 'suv', lane: 'near', w: 13.5, dur: 19, delay: -6, color: 'blue' },
  { k: 'sedan', lane: 'near', w: 13, dur: 24, delay: -15, color: 'silver' }, { k: 'scooter', lane: 'near', w: 6.5, dur: 14, delay: -2 },
  { k: 'taxi', lane: 'near', w: 13, dur: 27, delay: -21 }, { k: 'scooter', lane: 'far', w: 5.5, dur: 17, delay: -5 },
]
const Vehicle = ({ k, color }: Pick<V, 'k' | 'color'>) =>
  k === 'sedan' ? <Sedan color={color} /> : k === 'suv' ? <Suv color={color} /> : k === 'taxi' ? <Taxi /> : k === 'bus' ? <Bus /> : <Scooter />

const reducedMotion = () => typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches

type Sound = 'off' | 'on' | 'unavailable'

export function CityScene({ featured }: { featured: Poster | null }) {
  const [motion, setMotion] = useState(() => !reducedMotion())
  const [sound, setSound] = useState<Sound>('off')
  const ctxRef = useRef<AudioContext | null>(null)
  const nodesRef = useRef<AudioNode[]>([])

  const stopSound = (next: Sound = 'off') => {
    nodesRef.current.forEach((n) => {
      try { (n as AudioScheduledSourceNode).stop?.() } catch { /* not started */ }
      try { n.disconnect() } catch { /* already disconnected */ }
    })
    nodesRef.current = []
    ctxRef.current?.close().catch(() => {})
    ctxRef.current = null
    setSound(next)
  }

  const startSound = async () => {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
    if (!AudioCtx) return setSound('unavailable')
    try {
      const ctx = new AudioCtx()
      ctxRef.current = ctx
      await ctx.resume()
      const buf = ctx.createBuffer(1, ctx.sampleRate * 3, ctx.sampleRate)
      const data = buf.getChannelData(0)
      for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * 0.28
      const noise = ctx.createBufferSource()
      noise.buffer = buf; noise.loop = true
      const filter = ctx.createBiquadFilter(); filter.type = 'lowpass'; filter.frequency.value = 420
      const gain = ctx.createGain(); gain.gain.value = 0.045
      noise.connect(filter); filter.connect(gain); gain.connect(ctx.destination); noise.start()
      const engine = ctx.createOscillator(), eFilter = ctx.createBiquadFilter(), eGain = ctx.createGain()
      engine.type = 'sawtooth'; engine.frequency.value = 58
      eFilter.type = 'lowpass'; eFilter.frequency.value = 105; eGain.gain.value = 0.008
      engine.connect(eFilter); eFilter.connect(eGain); eGain.connect(ctx.destination); engine.start()
      nodesRef.current = [noise, filter, gain, engine, eFilter, eGain]
      setSound('on')
    } catch {
      stopSound('unavailable')
    }
  }

  useEffect(() => {
    const onHide = () => { if (document.hidden && ctxRef.current) stopSound() }
    document.addEventListener('visibilitychange', onHide)
    return () => { document.removeEventListener('visibilitychange', onHide); if (ctxRef.current) stopSound() }
  }, [])

  const url = featured ? normalizeDestination(featured.target_url) : null
  const href = typeof url === 'string' ? url : undefined
  const title = featured ? featured.title || 'Latest community poster' : 'Your poster belongs here'
  const caption = featured
    ? featured.caption || 'A new piece on the CrowdCanvas city wall.'
    : 'The wall is waiting for its first poster. Be the first to add one.'

  const jump = () => {
    const el = document.getElementById('posterFile')
    el?.scrollIntoView({ behavior: reducedMotion() ? 'auto' : 'smooth', block: 'center' })
    el?.focus({ preventScroll: true })
  }

  return (
    <section className="feature">
      <div className="feature-head"><strong>THE GLOBAL WALL · LIVE CITY EDITION</strong><span className="tag">Community canvas</span></div>
      <div className={'city-scene ' + (motion ? 'motion-enabled' : 'motion-reduced')} aria-label="Downtown US city billboard at dusk with illuminated steel supports and moving traffic">
        <div className="scene-stage">
        <SceneArt />
        <div className="scene-vignette" aria-hidden="true" />
        <div className="billboard-display">
          <div className="billboard-screen">
            <a className="poster-link" aria-label="Open featured poster destination" href={href} target={href ? '_blank' : undefined} rel={href ? 'noopener noreferrer' : undefined}>
              <img className="poster-link-image" alt={featured?.title || 'Latest poster shared with CrowdCanvas'} src={featured?.image_url || PLACEHOLDER} />
            </a>
            <div className="billboard-screen-glare" aria-hidden="true" />
          </div>
        </div>
        <div className="light-sweep" aria-hidden="true" />
        <div className="traffic-overlay" aria-hidden="true">
          <VehicleDefs />
          {TRAFFIC.map((t, i) => (
            <div key={i} className={`veh ${t.lane} ${t.lane === 'far' ? 'go-l rev' : 'go-r'}`} style={{ width: `${t.w}%`, '--w': `${t.w}%`, '--dur': `${t.dur}s`, '--delay': `${t.delay}s` } as React.CSSProperties}>
              <Vehicle k={t.k} color={t.color} />
            </div>
          ))}
        </div>
        <div className="city-caption"><span className="city-chip">CROWDCANVAS · CITY EDITION</span><span className="city-chip">LIVE COMMUNITY BILLBOARD</span></div>
        </div>
        <div className="scene-controls">
          <span>ILLUMINATED BILLBOARD · CITY TRAFFIC</span>
          <div className="control-group">
            <button className="sound-toggle" type="button" aria-pressed={motion} aria-label={motion ? 'Pause traffic animation' : 'Enable traffic animation'} onClick={() => setMotion((m) => !m)}>
              <Icon name={motion ? 'pause' : 'play'} /><span>{motion ? 'Traffic moving' : 'Enable traffic'}</span>
            </button>
            <button className="sound-toggle" type="button" aria-pressed={sound === 'on'} onClick={() => (ctxRef.current ? stopSound() : startSound())}>
              <Icon name={sound === 'on' ? 'volume' : 'mute'} /><span>{sound === 'on' ? 'City ambience on' : sound === 'unavailable' ? 'Sound unavailable' : 'Sound off'}</span>
            </button>
          </div>
        </div>
      </div>
      <div className="featured-info">
        <div><strong>{title}</strong><p className="caption">{caption}</p></div>
        <div className="featured-actions">
          <a className="visit-link" hidden={!href} href={href} target="_blank" rel="noopener noreferrer"><Icon name="arrowUpRight" /><span>Visit website</span></a>
          <button className="btn" type="button" onClick={jump}><Icon name="arrowDown" /><span>Put your poster on the wall</span></button>
        </div>
      </div>
    </section>
  )
}
