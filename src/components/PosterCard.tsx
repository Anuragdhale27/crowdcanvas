import { Icon } from './Icon'
import { normalizeDestination, prettyDate, type Poster } from '../lib/utils'

export function PosterCard({ poster, onOpen }: { poster: Poster; onOpen: (p: Poster) => void }) {
  const url = normalizeDestination(poster.target_url)
  const name = poster.title || 'poster'
  return (
    <article className="card">
      <button type="button" className="cardimg" aria-label={`View ${name} full size`} onClick={() => onOpen(poster)}>
        <img loading="lazy" src={poster.image_url} alt={poster.title || 'Community poster'} referrerPolicy="no-referrer" />
      </button>
      <div className="cardbody">
        <strong>{poster.title || 'Untitled poster'}</strong>
        <p>{poster.caption || 'A contribution to CrowdCanvas'}</p>
        <p>{prettyDate(poster.created_at)}</p>
        {typeof url === 'string' && (
          <a className="visit-link" href={url} target="_blank" rel="noopener noreferrer" aria-label={`Visit website for ${name}`}>
            <Icon name="arrowUpRight" /><span>Visit</span>
          </a>
        )}
      </div>
    </article>
  )
}
