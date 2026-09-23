import { describe, expect, it } from 'vitest'
import type { Frage } from '../../domain/types'
import { rngMitSeed } from '../../engine/zufall'
import { istRichtig, mitGemischtenOptionen } from './pruefen'
import { FRAGEN } from './index'

const einfach: Frage = {
  id: 't1',
  thema: 'kalkulation',
  bereich: 'warenwirtschaft',
  typ: 'single',
  frage: 'Testfrage?',
  optionen: ['falsch 1', 'RICHTIG', 'falsch 2', 'falsch 3'],
  loesung: 1,
  erklaerung: 'x',
  schwierigkeit: 1,
}

const mehrfach: Frage = {
  ...einfach,
  id: 't2',
  typ: 'multi',
  optionen: ['RICHTIG A', 'falsch', 'RICHTIG B', 'falsch 2', 'RICHTIG C'],
  loesung: [0, 2, 4],
}

describe('Antworten mischen', () => {
  it('behält bei Einfachauswahl die richtige Antwort bei', () => {
    for (let seed = 1; seed <= 50; seed++) {
      const g = mitGemischtenOptionen(einfach, rngMitSeed(seed))
      expect(g.optionen?.[g.loesung as number]).toBe('RICHTIG')
      expect(istRichtig(g, { typ: 'single', gewaehlt: g.loesung as number })).toBe(true)
    }
  })

  it('behält bei Mehrfachauswahl alle richtigen Antworten bei', () => {
    for (let seed = 1; seed <= 50; seed++) {
      const g = mitGemischtenOptionen(mehrfach, rngMitSeed(seed))
      const texte = (g.loesung as number[]).map((i) => g.optionen?.[i]).sort()
      expect(texte).toEqual(['RICHTIG A', 'RICHTIG B', 'RICHTIG C'])
    }
  })

  it('verschiebt die richtige Antwort tatsächlich auf verschiedene Positionen', () => {
    const positionen = new Set(
      Array.from({ length: 40 }, (_, s) => mitGemischtenOptionen(einfach, rngMitSeed(s + 1)).loesung),
    )
    expect(positionen.size).toBe(4)
  })

  it('lässt die Originalfrage unverändert', () => {
    mitGemischtenOptionen(einfach, rngMitSeed(3))
    expect(einfach.optionen).toEqual(['falsch 1', 'RICHTIG', 'falsch 2', 'falsch 3'])
    expect(einfach.loesung).toBe(1)
  })

  it('funktioniert für die ganze Fragenbank', () => {
    for (const f of FRAGEN) {
      if (f.typ === 'zahl') continue
      const g = mitGemischtenOptionen(f, rngMitSeed(7))
      const soll = Array.isArray(f.loesung) ? f.loesung.map((i) => f.optionen?.[i]).sort() : [f.optionen?.[f.loesung as number]]
      const ist = Array.isArray(g.loesung) ? g.loesung.map((i) => g.optionen?.[i]).sort() : [g.optionen?.[g.loesung as number]]
      expect(ist, f.id).toEqual(soll)
    }
  })
})
