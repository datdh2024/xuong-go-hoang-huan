import { render, screen, within } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import NotFoundPage from '@/app/not-found'

describe('US-23: Premium 404 page redesign', () => {
  it('has a decorative SVG woodworking element', () => {
    render(<NotFoundPage />)
    const svg = document.querySelector('svg[aria-hidden="true"]')
    expect(svg).not.toBeNull()
  })

  it('Trang chủ button has primary gold styling (bg-gold-500)', () => {
    render(<NotFoundPage />)
    const main = screen.getByRole('main')
    const link = within(main).getByRole('link', { name: /^trang chủ$/i })
    expect(link.className).toMatch(/bg-gold-500/)
  })

  it('Công trình button has secondary wood outline styling', () => {
    render(<NotFoundPage />)
    const main = screen.getByRole('main')
    const link = within(main).getByRole('link', { name: /^công trình$/i })
    expect(link.className).toMatch(/border/)
  })

  it('Liên hệ button has secondary wood outline styling', () => {
    render(<NotFoundPage />)
    const main = screen.getByRole('main')
    const link = within(main).getByRole('link', { name: /^liên hệ$/i })
    expect(link.className).toMatch(/border/)
  })

  it('navigation has aria-label for accessibility', () => {
    render(<NotFoundPage />)
    const nav = screen.getByRole('navigation', { name: /điều hướng 404/i })
    expect(nav).toBeInTheDocument()
  })

  it('background section uses wood gradient classes', () => {
    render(<NotFoundPage />)
    const main = screen.getByRole('main')
    const section = main.querySelector('section')
    expect(section?.className).toMatch(/wood-50|wood-100/)
  })
})

describe('US-09: Custom 404 Not Found page', () => {
  it('renders Vietnamese 404 heading', () => {
    render(<NotFoundPage />)
    expect(screen.getByRole('heading', { name: /trang không tồn tại/i })).toBeInTheDocument()
  })

  it('displays a 404 status indicator', () => {
    render(<NotFoundPage />)
    expect(screen.getByText(/404/)).toBeInTheDocument()
  })

  it('has a link back to Trang chủ (homepage) in the 404 content', () => {
    render(<NotFoundPage />)
    const main = screen.getByRole('main')
    const link = within(main).getByRole('link', { name: /^trang chủ$/i })
    expect(link).toHaveAttribute('href', '/')
  })

  it('has a link to Công trình (projects) in the 404 content', () => {
    render(<NotFoundPage />)
    const main = screen.getByRole('main')
    const link = within(main).getByRole('link', { name: /^công trình$/i })
    expect(link).toHaveAttribute('href', '/cong-trinh')
  })

  it('has a link to Liên hệ (contact) in the 404 content', () => {
    render(<NotFoundPage />)
    const main = screen.getByRole('main')
    const links = within(main).getAllByRole('link', { name: /liên hệ/i })
    const contactLink = links.find(l => l.getAttribute('href') === '/lien-he')
    expect(contactLink).toBeTruthy()
  })

  it('has a phone CTA link', () => {
    render(<NotFoundPage />)
    const phoneLinks = screen.getAllByRole('link', { name: /0985.?241.?204/i })
    const cta = phoneLinks.find(l => l.getAttribute('href') === 'tel:0985241204')
    expect(cta).toBeTruthy()
  })

  it('heading uses Cormorant Garamond font class', () => {
    render(<NotFoundPage />)
    const heading = screen.getByRole('heading', { name: /trang không tồn tại/i })
    expect(heading.className).toMatch(/font-cormorant|cormorant/i)
  })
})
