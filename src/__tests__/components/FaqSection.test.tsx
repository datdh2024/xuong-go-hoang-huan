import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect } from 'vitest'
import FaqSection from '@/components/sections/FaqSection'

describe('SR-904: FaqSection', () => {
  it('renders the section heading "Câu Hỏi Thường Gặp"', () => {
    render(<FaqSection />)
    expect(screen.getByText('Câu Hỏi Thường Gặp')).toBeInTheDocument()
  })

  it('renders at least 6 FAQ questions', () => {
    render(<FaqSection />)
    const buttons = screen.getAllByRole('button')
    expect(buttons.length).toBeGreaterThanOrEqual(6)
  })

  it('answers are hidden by default (collapsed state)', () => {
    render(<FaqSection />)
    const answers = screen.queryAllByRole('region')
    // All regions should be collapsed (not visible) by default
    answers.forEach(answer => {
      expect(answer).toHaveAttribute('hidden')
    })
  })

  it('clicking a question expands to show the answer', async () => {
    const user = userEvent.setup()
    render(<FaqSection />)
    const buttons = screen.getAllByRole('button')
    await user.click(buttons[0])
    const answer = screen.getByRole('region', { hidden: false })
    expect(answer).toBeInTheDocument()
  })

  it('clicking an expanded question collapses it again', async () => {
    const user = userEvent.setup()
    render(<FaqSection />)
    const buttons = screen.getAllByRole('button')
    await user.click(buttons[0])
    await user.click(buttons[0])
    const regions = screen.queryAllByRole('region', { hidden: false })
    expect(regions.length).toBe(0)
  })

  it('each question button has aria-expanded attribute', () => {
    render(<FaqSection />)
    const buttons = screen.getAllByRole('button')
    buttons.forEach(button => {
      expect(button).toHaveAttribute('aria-expanded')
    })
  })
})
