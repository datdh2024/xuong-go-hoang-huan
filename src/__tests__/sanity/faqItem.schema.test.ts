import { describe, it, expect } from 'vitest'
import { faqItem } from '@/sanity/schemas/faqItem'

describe('SR-906: faqItem Sanity schema', () => {
  it('has name "faqItem"', () => {
    expect(faqItem.name).toBe('faqItem')
  })

  it('has type "document"', () => {
    expect(faqItem.type).toBe('document')
  })

  it('has a "question" field of type string', () => {
    const field = faqItem.fields.find((f: { name: string }) => f.name === 'question')
    expect(field).toBeDefined()
    expect(field?.type).toBe('string')
  })

  it('has an "answer" field of type text', () => {
    const field = faqItem.fields.find((f: { name: string }) => f.name === 'answer')
    expect(field).toBeDefined()
    expect(field?.type).toBe('text')
  })

  it('has an "orderRank" field for drag-and-drop ordering', () => {
    const field = faqItem.fields.find((f: { name: string }) => f.name === 'orderRank')
    expect(field).toBeDefined()
  })
})
