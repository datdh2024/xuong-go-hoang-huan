import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import QuoteForm from '@/components/sections/QuoteForm'

describe('US-01: QuoteForm accepts houseTypes prop', () => {
  const customTypes = ['CMS Type A', 'CMS Type B']

  it('renders custom house types in select', () => {
    render(<QuoteForm houseTypes={customTypes} />)
    expect(screen.getByText('CMS Type A')).toBeTruthy()
    expect(screen.getByText('CMS Type B')).toBeTruthy()
  })

  it('falls back to default HOUSE_TYPES when no prop given', () => {
    render(<QuoteForm />)
    expect(screen.getByText('Nhà gỗ 3 gian')).toBeTruthy()
  })
})
