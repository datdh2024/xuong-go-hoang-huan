import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import ProjectFilter from '@/components/sections/ProjectFilter'

const mockCategories = ['Nhà gỗ 3 gian', 'Nhà gỗ 5 gian', 'Nhà thờ họ']

describe('TC-15 to TC-19: ProjectFilter component', () => {
  it('TC-15: renders a button for each category plus "Tất cả"', () => {
    render(<ProjectFilter categories={mockCategories} />)
    expect(screen.getByRole('button', { name: 'Tất cả' })).toBeInTheDocument()
    mockCategories.forEach((cat) => {
      expect(screen.getByRole('button', { name: cat })).toBeInTheDocument()
    })
  })

  it('TC-15: renders all 4 buttons (Tất cả + 3 categories)', () => {
    render(<ProjectFilter categories={mockCategories} />)
    const buttons = screen.getAllByRole('button')
    expect(buttons).toHaveLength(4)
  })

  it('TC-16: "Tất cả" button has active styling (bg-wood-600) by default', () => {
    render(<ProjectFilter categories={mockCategories} />)
    const allBtn = screen.getByRole('button', { name: 'Tất cả' })
    // Active class has bg-wood-600 not prefixed by hover:
    expect(allBtn.className).toMatch(/(?<!hover:)bg-wood-600/)
  })

  it('TC-17: clicking a non-default category gives it active styling', async () => {
    const user = userEvent.setup()
    render(<ProjectFilter categories={mockCategories} />)
    const catBtn = screen.getByRole('button', { name: 'Nhà gỗ 3 gian' })
    await user.click(catBtn)
    expect(catBtn.className).toMatch(/(?<!hover:)bg-wood-600/)
  })

  it('TC-17: clicking a non-default category removes active styling from "Tất cả"', async () => {
    const user = userEvent.setup()
    render(<ProjectFilter categories={mockCategories} />)
    const catBtn = screen.getByRole('button', { name: 'Nhà gỗ 3 gian' })
    const allBtn = screen.getByRole('button', { name: 'Tất cả' })
    await user.click(catBtn)
    // Inactive button has border-wood-300 (not border-wood-600 of active button)
    expect(allBtn.className).toMatch(/border-wood-300/)
  })

  it('TC-18: calls onFilter callback with category name when clicked', async () => {
    const user = userEvent.setup()
    const onFilter = vi.fn()
    render(<ProjectFilter categories={mockCategories} onFilter={onFilter} />)
    const catBtn = screen.getByRole('button', { name: 'Nhà thờ họ' })
    await user.click(catBtn)
    expect(onFilter).toHaveBeenCalledWith('Nhà thờ họ')
  })

  it('TC-18: calls onFilter with "Tất cả" when the Tất cả button is clicked', async () => {
    const user = userEvent.setup()
    const onFilter = vi.fn()
    render(<ProjectFilter categories={mockCategories} onFilter={onFilter} />)
    const catBtn = screen.getByRole('button', { name: 'Nhà gỗ 3 gian' })
    await user.click(catBtn)
    const allBtn = screen.getByRole('button', { name: 'Tất cả' })
    await user.click(allBtn)
    expect(onFilter).toHaveBeenLastCalledWith('Tất cả')
  })

  it('TC-19: renders only "Tất cả" button when categories prop is empty', () => {
    render(<ProjectFilter categories={[]} />)
    const buttons = screen.getAllByRole('button')
    expect(buttons).toHaveLength(1)
    expect(buttons[0]).toHaveTextContent('Tất cả')
  })

  it('TC-19: "Tất cả" has active styling when categories is empty', () => {
    render(<ProjectFilter categories={[]} />)
    const allBtn = screen.getByRole('button', { name: 'Tất cả' })
    expect(allBtn.className).toMatch(/(?<!hover:)bg-wood-600/)
  })
})
