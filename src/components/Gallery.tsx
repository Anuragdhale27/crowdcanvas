import { useState } from 'react'
import { PosterCard } from './PosterCard'
import { filterPosters, type Poster } from '../lib/utils'

interface Props {
  posters: Poster[]
  /** Loading / error message shown instead of cards. */
  message?: string | null
  onOpen: (p: Poster) => void
  onRefresh: () => void
}

export function Gallery({ posters, message, onOpen, onRefresh }: Props) {
  const [query, setQuery] = useState('')
  const list = filterPosters(posters, query)
  return (
    <section>
      <div className="galleryhead">
        <div><h2>Global gallery</h2><span>Newest contributions first</span></div>
        <input type="search" aria-label="Search posters by title or caption" placeholder="Search posters" value={query} onChange={(e) => setQuery(e.target.value)} />
        <button className="btn refresh" type="button" onClick={onRefresh}>Refresh</button>
      </div>
      <div className="gallery">
        {message ? <div className="empty">{message}</div>
          : !posters.length ? <div className="empty">The wall is empty. Be the first to add a poster.</div>
          : !list.length ? <div className="empty">No posters match</div>
          : list.map((p, i) => <PosterCard key={p.id ?? i} poster={p} onOpen={onOpen} />)}
      </div>
    </section>
  )
}
