import { useEffect, useRef, useState } from 'react'
import { Icon } from './Icon'
import { normalizeDestination, type Poster } from '../lib/utils'

export function Lightbox({ poster, onClose }: { poster: Poster | null; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null)
  const [copied, setCopied] = useState(false)
  useEffect(() => {
    const d = ref.current
    if (!d) return
    if (poster && !d.open) d.showModal()
    if (!poster && d.open) d.close()
    setCopied(false)
  }, [poster])
  const url = poster ? normalizeDestination(poster.target_url) : null

  const share = async () => {
    if (!poster) return
    if (navigator.share) {
      try { await navigator.share({ title: poster.title || 'CrowdCanvas poster', text: poster.caption || '', url: poster.image_url }) } catch { /* cancelled */ }
      return
    }
    try {
      await navigator.clipboard.writeText(poster.image_url)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch { /* clipboard unavailable */ }
  }

  return (
    <dialog ref={ref} className="lightbox" aria-label="Poster preview" onClose={onClose} onClick={(e) => { if (e.target === ref.current) ref.current?.close() }}>
      <img src={poster?.image_url} alt={poster?.title || 'Community poster'} />
      <h3>{poster?.title || 'Untitled poster'}</h3>
      <p>{poster?.caption || ''}</p>
      <div className="lbbar">
        <a className="visit-link" hidden={typeof url !== 'string'} href={typeof url === 'string' ? url : undefined} target="_blank" rel="noopener noreferrer">
          <Icon name="arrowUpRight" /><span>Visit website</span>
        </a>
        <button className="btn" type="button" onClick={share}><Icon name="share" /><span>{copied ? 'Copied' : 'Share'}</span></button>
        <button className="themebtn lbclose" type="button" aria-label="Close" onClick={() => ref.current?.close()}><Icon name="x" /></button>
      </div>
    </dialog>
  )
}
