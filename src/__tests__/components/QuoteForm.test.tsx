import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import QuoteForm from '@/components/sections/QuoteForm'

vi.mock('@/lib/analytics', () => ({
  trackEvent: vi.fn(),
}))

describe('US-11: QuoteForm analytics tracking', () => {
  it('calls trackEvent form_submit with form data on successful submission', async () => {
    const { trackEvent } = await import('@/lib/analytics')
    ;(trackEvent as ReturnType<typeof vi.fn>).mockClear()

    global.fetch = vi.fn().mockResolvedValue({ ok: true })

    render(<QuoteForm houseTypes={['Nhà gỗ 3 gian']} />)

    fireEvent.change(screen.getByPlaceholderText('Nguyễn Văn A'), { target: { value: 'Test User' } })
    fireEvent.change(screen.getByPlaceholderText('0985 241 204'), { target: { value: '0912345678' } })
    const selects = screen.getAllByRole('combobox')
    fireEvent.change(selects[0], { target: { value: 'Nhà gỗ 3 gian' } })
    fireEvent.change(selects[1], { target: { value: 'Hà Nội' } })

    fireEvent.click(screen.getByText('Gửi yêu cầu tư vấn'))

    await waitFor(() => {
      expect(trackEvent).toHaveBeenCalledWith('form_submit', expect.objectContaining({
        name: 'Test User',
        phone: '0912345678',
        house_type: 'Nhà gỗ 3 gian',
        province: 'Hà Nội',
      }))
    })
  })
})

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
