import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

vi.mock('next/link', () => ({
  default: ({ href, children, ...props }: { href: string; children: React.ReactNode; [key: string]: unknown }) => (
    <a href={href} {...props}>{children}</a>
  ),
}))

const customSettings = {
  companyName: 'Test Company',
  tagline: 'Test Tagline',
  phone: '0999 999 999',
  email: 'test@example.com',
  address: 'Test Address, Test City',
  workingHours: '8:00 - 17:00',
  facebookUrl: 'https://facebook.com/test',
  tiktokUrl: 'https://www.tiktok.com/@test',
}

describe('US-28: Header renders from siteSettings prop', () => {
  it('renders company name from siteSettings prop', () => {
    render(<Header siteSettings={customSettings} />)
    expect(screen.getByText('Test Company')).toBeInTheDocument()
  })

  it('renders tagline from siteSettings prop', () => {
    render(<Header siteSettings={customSettings} />)
    expect(screen.getByText('Test Tagline')).toBeInTheDocument()
  })

  it('renders phone from siteSettings prop', () => {
    render(<Header siteSettings={customSettings} />)
    const phoneLinks = screen.getAllByText('0999 999 999')
    expect(phoneLinks.length).toBeGreaterThan(0)
  })

  it('falls back to SITE_SETTINGS when no siteSettings prop provided', () => {
    render(<Header />)
    expect(screen.getByText('Xưởng Gỗ Hoàng Huân')).toBeInTheDocument()
  })
})

describe('US-28: Footer renders from siteSettings prop', () => {
  it('renders company name from siteSettings prop', () => {
    render(<Footer siteSettings={customSettings} />)
    expect(screen.getAllByText('Test Company').length).toBeGreaterThan(0)
  })

  it('renders address from siteSettings prop', () => {
    render(<Footer siteSettings={customSettings} />)
    expect(screen.getByText('Test Address, Test City')).toBeInTheDocument()
  })

  it('renders email from siteSettings prop', () => {
    render(<Footer siteSettings={customSettings} />)
    expect(screen.getByText('test@example.com')).toBeInTheDocument()
  })

  it('renders working hours from siteSettings prop', () => {
    render(<Footer siteSettings={customSettings} />)
    expect(screen.getByText('8:00 - 17:00')).toBeInTheDocument()
  })

  it('falls back to SITE_SETTINGS when no siteSettings prop provided', () => {
    render(<Footer />)
    expect(screen.getAllByText('Xưởng Gỗ Hoàng Huân').length).toBeGreaterThan(0)
  })
})
