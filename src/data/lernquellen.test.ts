import { describe, expect, it } from 'vitest'
import { QUELLEN } from './lernquellen'

describe('Lernquellen', () => {
  const alle = QUELLEN.flatMap((g) => g.quellen)

  it('verlinken nur verschlüsselt und ohne Dubletten', () => {
    for (const q of alle) expect(q.url.startsWith('https://'), q.url).toBe(true)
    expect(new Set(alle.map((q) => q.url)).size).toBe(alle.length)
  })

  it('erklären bei jeder Quelle, wozu sie gut ist', () => {
    for (const q of alle) expect(q.warum.length, q.titel).toBeGreaterThan(30)
  })
})
