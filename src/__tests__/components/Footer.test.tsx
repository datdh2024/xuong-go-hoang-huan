import { render } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import Footer from '@/components/layout/Footer'

vi.mock('next/link', () => ({
  default: ({ href, children, ...props }: { href: string; children: React.ReactNode; [key: string]: unknown }) => (
    <a href={href} {...props}>{children}</a>
  ),
}))

describe('US-26: Footer social links accessibility', () => {
  it('Facebook link has aria-label for screen readers', () => {
    render(<Footer />)
    const facebookLink = document.querySelector('a[href*="facebook"]')
    expect(facebookLink).not.toBeNull()
    expect(facebookLink?.getAttribute('aria-label')).toBeTruthy()
  })

  it('YouTube link has aria-label for screen readers', () => {
    render(<Footer />)
    const youtubeLink = document.querySelector('a[href*="youtube"]')
    expect(youtubeLink).not.toBeNull()
    expect(youtubeLink?.getAttribute('aria-label')).toBeTruthy()
  })

  it('Facebook aria-label mentions the company name', () => {
    render(<Footer />)
    const facebookLink = document.querySelector('a[href*="facebook"]')
    const label = facebookLink?.getAttribute('aria-label') ?? ''
    expect(label).toMatch(/facebook/i)
  })

  it('YouTube aria-label mentions the company name', () => {
    render(<Footer />)
    const youtubeLink = document.querySelector('a[href*="youtube"]')
    const label = youtubeLink?.getAttribute('aria-label') ?? ''
    expect(label).toMatch(/youtube/i)
  })
})
