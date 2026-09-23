import { describe, expect, it } from 'vitest'
import { AUFGABENTYPEN } from './rechenaufgaben'
import { schrittWert } from './schrittwert'
import { rngMitSeed } from './zufall'

const s = (ergebnis: string) => ({ label: 'x', rechnung: 'x', ergebnis })

describe('schrittWert', () => {
  it('liest das Ergebnis am Ende einer Rechenkette', () => {
    expect(schrittWert(s('Zieleinkaufspreis = 480,00 € − 72,00 € = 408,00 €'))).toEqual({
      wert: 408,
      toleranz: 0.015,
      einheit: '€',
    })
  })

  it('versteht Tausenderpunkte, Prozent und Stück', () => {
    expect(schrittWert(s('Ø Lagerbestand = 16.600,00 €'))?.wert).toBe(16600)
    expect(schrittWert(s('Lagerzinssatz = 0,611 %'))).toMatchObject({ wert: 0.611, einheit: '%' })
    expect(schrittWert(s('Meldebestand = 810 Stück'))).toEqual({ wert: 810, toleranz: 0, einheit: 'Stück' })
  })

  it('liefert null für Schritte ohne Zahl', () => {
    expect(schrittWert(s('Skonto ziehen und dafür den Kredit nutzen — das ist günstiger.'))).toBeNull()
  })

  it('findet in jedem generierten Rechenweg den Zwischenwert, und der letzte Wert ist die Lösung', () => {
    for (const typ of AUFGABENTYPEN) {
      for (let seed = 1; seed <= 25; seed++) {
        const a = typ.erzeuge(rngMitSeed(seed))
        const werte = a.rechenweg.map(schrittWert).filter((w) => w !== null)
        expect(werte.length, `${typ.id}/${seed}`).toBeGreaterThan(0)
        const letzter = werte.at(-1)
        expect(
          Math.abs((letzter?.wert ?? Number.NaN) - a.loesung.wert),
          `${typ.id}/${seed}: letzter Schrittwert passt nicht zur Lösung`,
        ).toBeLessThanOrEqual(a.loesung.toleranz + 0.02)
      }
    }
  })
})
