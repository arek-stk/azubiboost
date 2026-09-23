import { describe, expect, it } from 'vitest'
import { AUFGABENTYPEN } from './rechenaufgaben'
import { schrittWert } from './schrittwert'
import { taschenrechnerZeilen, tippe } from './taschenrechner'
import { rngMitSeed } from './zufall'

const text = (z: { text: string }[]) => z.map((t) => t.text).join(' ')

describe('Taschenrechner-Tasten', () => {
  it('macht aus Prozent „× 10 ÷ 100" und löst den zweiten Teil als eigene Zeile', () => {
    const z = taschenrechnerZeilen({
      label: 'Rabatt',
      rechnung: '670,00 € × 10 % = 67,00 €',
      ergebnis: 'Zieleinkaufspreis = 670,00 € − 67,00 € = 603,00 €',
    })
    expect(z.map(text)).toEqual(['670 × 10 ÷ 100 =', '670 − 67 ='])
  })

  it('schreibt Dezimalzahlen mit Punkt und ohne Tausenderpunkte', () => {
    const z = taschenrechnerZeilen({ label: 'x', rechnung: '41.500,00 € × 0,611 %', ergebnis: 'Lagerzinsen = 253,57 €' })
    expect(z.map(text)).toEqual(['41500 × 0.611 ÷ 100 ='])
  })

  it('lässt einen Zinssatz vorn stehen', () => {
    const z = taschenrechnerZeilen({ label: 'x', rechnung: '4 % × 55 ÷ 360', ergebnis: 'Lagerzinssatz = 0,611 %' })
    expect(z.map(text)).toEqual(['4 × 55 ÷ 360 ='])
  })

  it('rechnet Klammern erst aus', () => {
    const z = taschenrechnerZeilen({ label: 'x', rechnung: '(15.500 + 8.000 + 22.000) ÷ 5', ergebnis: 'Ø = 9.100,00 €' })
    expect(z.map(text)).toEqual(['15500 + 8000 + 22000 = ÷ 5 ='])
    expect(tippe(z[0] ?? [])).toBe(9100)
  })

  it('liefert für eine Entscheidung in Worten keine Tasten', () => {
    expect(taschenrechnerZeilen({ label: 'x', rechnung: '14,4 % gegen 12 % Kreditzins', ergebnis: 'Skonto ziehen.' })).toEqual([])
  })

  it('führt bei jeder Aufgabe mit der letzten Tastenzeile zum Schrittergebnis', () => {
    let geprueft = 0
    for (const typ of AUFGABENTYPEN) {
      for (let seed = 1; seed <= 20; seed++) {
        for (const s of typ.erzeuge(rngMitSeed(seed)).rechenweg) {
          const ziel = schrittWert(s)
          const zeilen = taschenrechnerZeilen(s)
          if (ziel === null || zeilen.length === 0) continue
          const letzte = zeilen.at(-1) ?? []
          // Zwischenschritte sind in der Anzeige gerundet — eine Rundungsstelle Spielraum.
          const spiel = Math.max(ziel.toleranz * 2, Math.abs(ziel.wert) * 0.002, 0.011)
          expect(Math.abs(tippe(letzte) - ziel.wert), `${typ.id}/${seed}: ${s.label}`).toBeLessThanOrEqual(spiel)
          geprueft++
        }
      }
    }
    expect(geprueft).toBeGreaterThan(500)
  })
})
