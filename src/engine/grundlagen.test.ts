import { describe, expect, it } from 'vitest'
import { GRUNDLAGEN_TYPEN } from './grundlagen'
import { aufgabentyp, istZahlRichtig } from './rechenaufgaben'
import { schrittWert } from './schrittwert'
import { taschenrechnerZeilen, tippe } from './taschenrechner'
import { rngMitSeed } from './zufall'

describe('Mathe-Grundlagen', () => {
  it('sind über aufgabentyp() erreichbar', () => {
    for (const t of GRUNDLAGEN_TYPEN) expect(aufgabentyp(t.id)).toBe(t)
  })

  it.each(GRUNDLAGEN_TYPEN.map((t) => [t.id, t] as const))('%s: Schritte, Tasten und Lösung passen zusammen', (_id, typ) => {
    for (let seed = 1; seed <= 40; seed++) {
      const a = typ.erzeuge(rngMitSeed(seed))
      expect(a.loesung.wert).toBeGreaterThan(0)
      const werte = a.rechenweg.map(schrittWert)
      expect(werte.every((w) => w !== null), `${typ.id}/${seed}`).toBe(true)
      expect(Math.abs((werte.at(-1)?.wert ?? NaN) - a.loesung.wert)).toBeLessThanOrEqual(a.loesung.toleranz + 1e-9)
      for (const s of a.rechenweg) {
        const zeilen = taschenrechnerZeilen(s)
        const ziel = schrittWert(s)
        if (zeilen.length === 0 || ziel === null) continue
        expect(Math.abs(tippe(zeilen.at(-1) ?? []) - ziel.wert), `${typ.id}/${seed}: ${s.label}`).toBeLessThan(0.006)
      }
    }
  })

  it('rundet kaufmännisch und akzeptiert beim Runden keine Abweichung um einen Cent', () => {
    for (let seed = 1; seed <= 60; seed++) {
      const a = GRUNDLAGEN_TYPEN.find((t) => t.id === 'g-runden')?.erzeuge(rngMitSeed(seed))
      if (a === undefined) throw new Error('fehlt')
      expect(istZahlRichtig(a.loesung, a.loesung.wert)).toBe(true)
      expect(istZahlRichtig(a.loesung, a.loesung.wert - 0.01)).toBe(false)
      expect(istZahlRichtig(a.loesung, a.loesung.wert + 0.01)).toBe(false)
      const letzter = schrittWert(a.rechenweg.at(-1) ?? { label: '', rechnung: '', ergebnis: '' })
      expect(letzter?.toleranz).toBe(0.001)
    }
  })

  it('stimmen bei Seed 1 mit von Hand nachgerechneten Werten', () => {
    // 5 % von 300 € · 15 € von 300 € · 120 € + 10 % · 100 € − 5 % · 119 € ÷ 1,19 · 63,081 € gerundet
    const erwartet: Record<string, number> = {
      'g-prozentwert': 15,
      'g-prozentsatz': 5,
      'g-aufschlag': 132,
      'g-abzug': 95,
      'g-herausrechnen': 100,
      'g-runden': 63.08,
    }
    for (const t of GRUNDLAGEN_TYPEN) {
      expect(t.erzeuge(rngMitSeed(1)).loesung.wert, t.id).toBeCloseTo(erwartet[t.id] ?? NaN, 2)
    }
  })
})
