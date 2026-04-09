import { describe, it, expect, vi, beforeEach } from 'vitest'

describe('US-11: analytics utility', () => {
  beforeEach(() => {
    vi.resetModules()
    delete (window as any).gtag
  })

  it('pageview calls window.gtag with correct params', async () => {
    vi.stubEnv('NEXT_PUBLIC_GA_MEASUREMENT_ID', 'G-TEST123')
    const gtagMock = vi.fn()
    ;(window as any).gtag = gtagMock

    const { pageview } = await import('@/lib/analytics')
    pageview('/cong-trinh')

    expect(gtagMock).toHaveBeenCalledWith('config', 'G-TEST123', { page_path: '/cong-trinh' })
    vi.unstubAllEnvs()
  })

  it('trackEvent calls window.gtag with event name and params', async () => {
    vi.stubEnv('NEXT_PUBLIC_GA_MEASUREMENT_ID', 'G-TEST123')
    const gtagMock = vi.fn()
    ;(window as any).gtag = gtagMock

    const { trackEvent } = await import('@/lib/analytics')
    trackEvent('phone_click')

    expect(gtagMock).toHaveBeenCalledWith('event', 'phone_click', undefined)
    vi.unstubAllEnvs()
  })

  it('trackEvent passes custom params to gtag', async () => {
    vi.stubEnv('NEXT_PUBLIC_GA_MEASUREMENT_ID', 'G-TEST123')
    const gtagMock = vi.fn()
    ;(window as any).gtag = gtagMock

    const { trackEvent } = await import('@/lib/analytics')
    trackEvent('project_view', { slug: 'nha-go-quoc-oai' })

    expect(gtagMock).toHaveBeenCalledWith('event', 'project_view', { slug: 'nha-go-quoc-oai' })
    vi.unstubAllEnvs()
  })

  it('pageview is no-op when GA_MEASUREMENT_ID is empty', async () => {
    vi.stubEnv('NEXT_PUBLIC_GA_MEASUREMENT_ID', '')
    const gtagMock = vi.fn()
    ;(window as any).gtag = gtagMock

    const { pageview } = await import('@/lib/analytics')
    pageview('/test')

    expect(gtagMock).not.toHaveBeenCalled()
    vi.unstubAllEnvs()
  })

  it('trackEvent is no-op when window.gtag is undefined', async () => {
    vi.stubEnv('NEXT_PUBLIC_GA_MEASUREMENT_ID', 'G-TEST123')
    // window.gtag is not defined

    const { trackEvent } = await import('@/lib/analytics')
    expect(() => trackEvent('phone_click')).not.toThrow()
    vi.unstubAllEnvs()
  })
})
