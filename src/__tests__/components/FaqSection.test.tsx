import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect } from 'vitest'
import FaqSection from '@/components/sections/FaqSection'

const mockFaqs = [
  { _id: '1', question: 'Chi phí xây dựng nhà gỗ cổ truyền là bao nhiêu?', answer: 'Chi phí phụ thuộc vào loại gỗ.' },
  { _id: '2', question: 'Thời gian thi công một công trình nhà gỗ mất bao lâu?', answer: 'Thông thường từ 3 đến 6 tháng.' },
  { _id: '3', question: 'Loại gỗ nào phù hợp nhất để xây nhà truyền thống?', answer: 'Gỗ lim, gỗ mít và gỗ xoan.' },
  { _id: '4', question: 'Xưởng có thiết kế theo yêu cầu riêng không?', answer: 'Có, chúng tôi nhận thiết kế theo yêu cầu.' },
  { _id: '5', question: 'Nhà gỗ có bền và chịu được thời tiết khắc nghiệt không?', answer: 'Có, nhà gỗ được xử lý chống mối mọt.' },
  { _id: '6', question: 'Xưởng có thi công tại các tỉnh thành khác không?', answer: 'Có, chúng tôi nhận thi công trên toàn quốc.' },
]

describe('SR-906: FaqSection with Sanity CMS data', () => {
  it('renders the section heading "Câu Hỏi Thường Gặp"', () => {
    render(<FaqSection faqs={mockFaqs} />)
    expect(screen.getByText('Câu Hỏi Thường Gặp')).toBeInTheDocument()
  })

  it('renders FAQ questions from props', () => {
    render(<FaqSection faqs={mockFaqs} />)
    expect(screen.getByText('Chi phí xây dựng nhà gỗ cổ truyền là bao nhiêu?')).toBeInTheDocument()
    expect(screen.getByText('Xưởng có thi công tại các tỉnh thành khác không?')).toBeInTheDocument()
  })

  it('renders at least 6 FAQ questions from props', () => {
    render(<FaqSection faqs={mockFaqs} />)
    const buttons = screen.getAllByRole('button')
    expect(buttons.length).toBeGreaterThanOrEqual(6)
  })

  it('answers are hidden by default (collapsed state)', () => {
    render(<FaqSection faqs={mockFaqs} />)
    const answers = screen.queryAllByRole('region')
    answers.forEach(answer => {
      expect(answer).toHaveAttribute('hidden')
    })
  })

  it('clicking a question expands to show the answer', async () => {
    const user = userEvent.setup()
    render(<FaqSection faqs={mockFaqs} />)
    const buttons = screen.getAllByRole('button')
    await user.click(buttons[0])
    const answer = screen.getByRole('region', { hidden: false })
    expect(answer).toBeInTheDocument()
  })

  it('clicking an expanded question collapses it again', async () => {
    const user = userEvent.setup()
    render(<FaqSection faqs={mockFaqs} />)
    const buttons = screen.getAllByRole('button')
    await user.click(buttons[0])
    await user.click(buttons[0])
    const regions = screen.queryAllByRole('region', { hidden: false })
    expect(regions.length).toBe(0)
  })

  it('each question button has aria-expanded attribute', () => {
    render(<FaqSection faqs={mockFaqs} />)
    const buttons = screen.getAllByRole('button')
    buttons.forEach(button => {
      expect(button).toHaveAttribute('aria-expanded')
    })
  })

  it('renders nothing when faqs prop is empty', () => {
    render(<FaqSection faqs={[]} />)
    const buttons = screen.queryAllByRole('button')
    expect(buttons.length).toBe(0)
  })
})
