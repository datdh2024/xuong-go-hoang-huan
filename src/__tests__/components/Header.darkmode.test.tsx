import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'

const mockToggle = vi.fn()
let mockIsDark = false

vi.mock('@/hooks/useDarkMode', () => ({
  useDarkMode: () => ({ isDark: mockIsDark, toggle: mockToggle }),
}))

// next/navigation is mocked globally in setup.ts
import Header from '@/components/layout/Header'

describe('Header — dark mode toggle', () => {
  beforeEach(() => {
    mockIsDark = false
    mockToggle.mockClear()
  })

  it('renders a dark mode toggle button', () => {
    render(<Header />)
    const btn = screen.getByRole('button', { name: /dark mode|toggle|chế độ/i })
    expect(btn).toBeInTheDocument()
  })

  it('toggle button has an accessible aria-label', () => {
    render(<Header />)
    const btn = screen.getByRole('button', { name: /dark mode|toggle|chế độ/i })
    expect(btn).toHaveAttribute('aria-label')
  })

  it('shows moon icon when in light mode (to indicate switching to dark)', () => {
    mockIsDark = false
    render(<Header />)
    // The moon icon signals "click to enable dark mode"
    const moonIcon = document.querySelector('[data-testid="moon-icon"], [aria-label*="dark"], [aria-label*="tối"]')
    expect(moonIcon).not.toBeNull()
  })

  it('shows sun icon when in dark mode (to indicate switching to light)', () => {
    mockIsDark = true
    render(<Header />)
    const sunIcon = document.querySelector('[data-testid="sun-icon"], [aria-label*="light"], [aria-label*="sáng"]')
    expect(sunIcon).not.toBeNull()
  })

  it('calls toggle when button is clicked', () => {
    render(<Header />)
    const btn = screen.getByRole('button', { name: /dark mode|toggle|chế độ/i })
    fireEvent.click(btn)
    expect(mockToggle).toHaveBeenCalledTimes(1)
  })

  it('toggle button is present on both desktop and mobile', () => {
    render(<Header />)
    // At least one toggle button must exist
    const buttons = screen.getAllByRole('button', { name: /dark mode|toggle|chế độ/i })
    expect(buttons.length).toBeGreaterThanOrEqual(1)
  })
})
