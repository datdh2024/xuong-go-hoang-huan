import { describe, it, expect } from 'vitest'
import { faqItemsQuery } from '@/sanity/lib/queries'

describe('SR-906: FAQ GROQ query', () => {
  it('faqItemsQuery is defined', () => {
    expect(faqItemsQuery).toBeDefined()
  })

  it('faqItemsQuery targets faqItem document type', () => {
    expect(faqItemsQuery).toContain('faqItem')
  })

  it('faqItemsQuery selects question field', () => {
    expect(faqItemsQuery).toContain('question')
  })

  it('faqItemsQuery selects answer field', () => {
    expect(faqItemsQuery).toContain('answer')
  })

  it('faqItemsQuery orders by orderRank', () => {
    expect(faqItemsQuery).toContain('orderRank')
  })
})
