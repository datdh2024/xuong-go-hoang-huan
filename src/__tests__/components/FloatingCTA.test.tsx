import { render, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import FloatingCTA from '@/components/layout/FloatingCTA'

vi.mock('@/lib/analytics', () => ({
  trackEvent: vi.fn(),
}))

describe('US-26: FloatingCTA accessibility', () => {
  it('Zalo button has aria-label for screen readers', () => {
    render(<FloatingCTA />)
    const zaloLink = document.querySelector('a[href*="zalo.me"]')
    expect(zaloLink).not.toBeNull()
    expect(zaloLink?.getAttribute('aria-label')).toBeTruthy()
  })

  it('Phone button has aria-label for screen readers', () => {
    render(<FloatingCTA />)
    const phoneLink = document.querySelector('a[href^="tel:"]')
    expect(phoneLink).not.toBeNull()
    expect(phoneLink?.getAttribute('aria-label')).toBeTruthy()
  })

  it('Zalo aria-label describes the action in Vietnamese', () => {
    render(<FloatingCTA />)
    const zaloLink = document.querySelector('a[href*="zalo.me"]')
    const label = zaloLink?.getAttribute('aria-label') ?? ''
    expect(label.toLowerCase()).toMatch(/zalo/i)
  })

  it('Phone aria-label describes the action in Vietnamese', () => {
    render(<FloatingCTA />)
    const phoneLink = document.querySelector('a[href^="tel:"]')
    const label = phoneLink?.getAttribute('aria-label') ?? ''
    expect(label.length).toBeGreaterThan(0)
  })
})

describe('US-11: FloatingCTA analytics tracking', () => {
  it('calls trackEvent phone_click when phone button is clicked', async () => {
    const { trackEvent } = await import('@/lib/analytics')
    ;(trackEvent as ReturnType<typeof vi.fn>).mockClear()
    render(<FloatingCTA />)
    const phoneLink = document.querySelector('a[href^="tel:"]')!
    fireEvent.click(phoneLink)
    expect(trackEvent).toHaveBeenCalledWith('phone_click')
  })

  it('calls trackEvent zalo_click when Zalo button is clicked', async () => {
    const { trackEvent } = await import('@/lib/analytics')
    ;(trackEvent as ReturnType<typeof vi.fn>).mockClear()
    render(<FloatingCTA />)
    const zaloLink = document.querySelector('a[href*="zalo.me"]')!
    fireEvent.click(zaloLink)
    expect(trackEvent).toHaveBeenCalledWith('zalo_click')
  })
})
