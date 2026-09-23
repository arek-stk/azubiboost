import { describe, expect, it } from 'vitest'
import { THEMEN, thema } from '../../domain/themen'
import type { ZahlLoesung } from '../../domain/types'
import { zahl } from '../../engine/format'
import { FRAGEN } from './index'

describe('Fragenbank', () => {
  it('hat eindeutige IDs', () => {
    const ids = FRAGEN.map((f) => f.id)
    const doppelt = ids.filter((id, i) => ids.indexOf(id) !== i)
    expect(doppelt).toEqual([])
  })

  it.each(FRAGEN.map((f) => [f.id, f] as const))('%s ist formal korrekt', (_id, f) => {
    // Thema und Bereich passen zusammen
    expect(thema(f.thema).bereich).toBe(f.bereich)

    // Jede Frage erklärt sich — das ist der eigentliche Lerneffekt
    expect(f.erklaerung.length).toBeGreaterThan(40)
    expect(f.frage.trim().length).toBeGreaterThan(10)

    if (f.typ === 'single') {
      const o = f.optionen ?? []
      expect(o.length).toBeGreaterThanOrEqual(2)
      expect(new Set(o).size).toBe(o.length)
      expect(typeof f.loesung).toBe('number')
      expect(f.loesung as number).toBeGreaterThanOrEqual(0)
      expect(f.loesung as number).toBeLessThan(o.length)
    }

    if (f.typ === 'multi') {
      const o = f.optionen ?? []
      const l = f.loesung as number[]
      expect(Array.isArray(l)).toBe(true)
      expect(l.length).toBeGreaterThanOrEqual(2)
      expect(l.length).toBeLessThan(o.length)
      expect(l.every((i) => i >= 0 && i < o.length)).toBe(true)
      expect(new Set(o).size).toBe(o.length)
    }

    if (f.typ === 'zahl') {
      const l = f.loesung as ZahlLoesung
      expect(Number.isFinite(l.wert)).toBe(true)
      expect(l.toleranz).toBeGreaterThanOrEqual(0)
      expect(f.rechenweg?.length ?? 0).toBeGreaterThan(0)
      // Das Ergebnis muss im Rechenweg auftauchen — fängt Tippfehler zwischen Lösung und Weg ab.
      const text = (f.rechenweg ?? []).map((s) => `${s.rechnung} ${s.ergebnis}`).join(' ')
      const kandidaten = [0, 1, 2, 3].map((d) => zahl(l.wert, d))
      expect(kandidaten.some((k) => text.includes(k)), `${f.id}: ${l.wert} fehlt im Rechenweg`).toBe(true)
    }
  })

  it('deckt jedes Thema ab', () => {
    for (const t of THEMEN) {
      const anzahl = FRAGEN.filter((f) => f.thema === t.id).length
      expect(anzahl, `Thema ${t.id}`).toBeGreaterThanOrEqual(8)
    }
  })
})
