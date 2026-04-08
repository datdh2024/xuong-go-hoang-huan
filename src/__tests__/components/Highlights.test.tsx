import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import Highlights from '@/components/sections/Highlights'
import type { SanityHighlight } from '@/sanity/lib/types'

describe('US-01: Highlights accepts highlights prop', () => {
  const testHighlights: SanityHighlight[] = [
    { icon: 'Award', title: 'CMS Title', description: 'CMS Desc', order: 1 },
    { icon: 'Shield', title: 'Second', description: 'Second Desc', order: 2 },
  ]

  it('renders title from props', () => {
    render(<Highlights highlights={testHighlights} />)
    expect(screen.getByText('CMS Title')).toBeTruthy()
  })

  it('renders description from props', () => {
    render(<Highlights highlights={testHighlights} />)
    expect(screen.getByText('CMS Desc')).toBeTruthy()
  })

  it('renders correct number of highlight items', () => {
    render(<Highlights highlights={testHighlights} />)
    expect(screen.getByText('CMS Title')).toBeTruthy()
    expect(screen.getByText('Second')).toBeTruthy()
  })

  it('renders nothing when empty array', () => {
    const { container } = render(<Highlights highlights={[]} />)
    expect(container.querySelector('section')).toBeNull()
  })
})
