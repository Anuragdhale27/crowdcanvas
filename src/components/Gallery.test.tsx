import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { Gallery } from './Gallery'
import type { Poster } from '../lib/utils'

const posters: Poster[] = [
  { id: 1, title: 'Sunset Boulevard', caption: 'warm light', image_url: 'data:,a', target_url: 'https://example.com', created_at: '2024-05-01T00:00:00Z' },
  { id: 2, title: 'Mountain', caption: 'cold snow', image_url: 'data:,b', target_url: 'javascript:alert(1)', created_at: '2024-05-02T00:00:00Z' },
]

describe('Gallery', () => {
  it('renders posters and filters by search', () => {
    render(<Gallery posters={posters} onOpen={vi.fn()} onRefresh={vi.fn()} />)
    expect(screen.getAllByRole('article')).toHaveLength(2)
    // unsafe destination gets no visit link
    expect(screen.getAllByRole('link')).toHaveLength(1)
    fireEvent.change(screen.getByRole('searchbox'), { target: { value: 'snow' } })
    expect(screen.getAllByRole('article')).toHaveLength(1)
    expect(screen.getByText('Mountain')).toBeInTheDocument()
    fireEvent.change(screen.getByRole('searchbox'), { target: { value: 'zzz' } })
    expect(screen.getByText('No posters match')).toBeInTheDocument()
  })
})
