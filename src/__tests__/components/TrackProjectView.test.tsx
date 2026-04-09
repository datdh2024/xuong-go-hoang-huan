import { render } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('@/lib/analytics', () => ({
  trackEvent: vi.fn(),
}))

describe('US-11: TrackProjectView component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('fires project_view event with slug on mount', async () => {
    const { trackEvent } = await import('@/lib/analytics')
    const { default: TrackProjectView } = await import('@/components/analytics/TrackProjectView')
    render(<TrackProjectView slug="nha-go-quoc-oai" />)
    expect(trackEvent).toHaveBeenCalledWith('project_view', { slug: 'nha-go-quoc-oai' })
  })

  it('renders nothing to the DOM', async () => {
    const { default: TrackProjectView } = await import('@/components/analytics/TrackProjectView')
    const { container } = render(<TrackProjectView slug="test" />)
    expect(container.innerHTML).toBe('')
  })
})
