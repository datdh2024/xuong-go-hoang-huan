import { render } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock next/script to render actual script tags for inspection
vi.mock('next/script', () => ({
  default: ({ src, id, strategy, dangerouslySetInnerHTML, ...props }: any) => {
    if (src) return <script data-testid={id} src={src} data-strategy={strategy} {...props} />
    if (dangerouslySetInnerHTML) return <script data-testid={id} data-strategy={strategy} dangerouslySetInnerHTML={dangerouslySetInnerHTML} {...props} />
    return null
  },
}))

describe('US-11: GoogleAnalytics component', () => {
  beforeEach(() => {
    vi.resetModules()
  })

  it('renders gtag.js script with correct measurement ID', async () => {
    vi.stubEnv('NEXT_PUBLIC_GA_MEASUREMENT_ID', 'G-TEST123')
    vi.stubEnv('NODE_ENV', 'production')
    const { default: GoogleAnalytics } = await import('@/components/GoogleAnalytics')
    const { container } = render(<GoogleAnalytics />)
    const script = container.querySelector('script[src*="googletagmanager.com/gtag/js"]')
    expect(script).not.toBeNull()
    expect(script?.getAttribute('src')).toContain('G-TEST123')
    vi.unstubAllEnvs()
  })

  it('renders inline gtag config script', async () => {
    vi.stubEnv('NEXT_PUBLIC_GA_MEASUREMENT_ID', 'G-TEST123')
    vi.stubEnv('NODE_ENV', 'production')
    const { default: GoogleAnalytics } = await import('@/components/GoogleAnalytics')
    const { container } = render(<GoogleAnalytics />)
    const scripts = container.querySelectorAll('script')
    const inlineScript = Array.from(scripts).find(s => s.innerHTML.includes('gtag'))
    expect(inlineScript).not.toBeNull()
    expect(inlineScript?.innerHTML).toContain('G-TEST123')
    vi.unstubAllEnvs()
  })

  it('renders nothing when GA_MEASUREMENT_ID is empty', async () => {
    vi.stubEnv('NEXT_PUBLIC_GA_MEASUREMENT_ID', '')
    vi.stubEnv('NODE_ENV', 'production')
    const { default: GoogleAnalytics } = await import('@/components/GoogleAnalytics')
    const { container } = render(<GoogleAnalytics />)
    expect(container.innerHTML).toBe('')
    vi.unstubAllEnvs()
  })

  it('renders nothing in development environment', async () => {
    vi.stubEnv('NEXT_PUBLIC_GA_MEASUREMENT_ID', 'G-TEST123')
    vi.stubEnv('NODE_ENV', 'development')
    const { default: GoogleAnalytics } = await import('@/components/GoogleAnalytics')
    const { container } = render(<GoogleAnalytics />)
    expect(container.innerHTML).toBe('')
    vi.unstubAllEnvs()
  })
})
