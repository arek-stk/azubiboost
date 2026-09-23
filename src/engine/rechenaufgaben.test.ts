import { describe, expect, it } from 'vitest'
import { AUFGABENTYPEN, aufgabentyp, istZahlRichtig, type AufgabentypId } from './rechenaufgaben'
import { rngMitSeed } from './zufall'
import { zahl } from './format'

const SEEDS = Array.from({ length: 30 }, (_, i) => i + 1)

describe('Aufgabengeneratoren', () => {
  it('bietet achtzehn Aufgabentypen mit eindeutigen Kennungen', () => {
    expect(AUFGABENTYPEN).toHaveLength(18)
    const ids = AUFGABENTYPEN.map((t) => t.id)
    expect(new Set(ids).size).toBe(18)
  })

  it.each(AUFGABENTYPEN.map((t) => [t.id, t] as const))(
    '%s erzeugt über 30 Seeds durchweg brauchbare Aufgaben',
    (_id, typ) => {
      for (const seed of SEEDS) {
        const a = typ.erzeuge(rngMitSeed(seed))

        expect(Number.isFinite(a.loesung.wert)).toBe(true)
        expect(a.loesung.wert).toBeGreaterThan(0)
        expect(a.loesung.toleranz).toBeGreaterThanOrEqual(0)
        expect(a.frage.length).toBeGreaterThan(10)
        expect(a.formel.length).toBeGreaterThan(5)
        expect(a.gegeben.length).toBeGreaterThan(0)
        expect(a.rechenweg.length).toBeGreaterThan(0)

        for (const g of a.gegeben) {
          expect(g.label.length).toBeGreaterThan(0)
          expect(g.wert.length).toBeGreaterThan(0)
        }
        for (const s of a.rechenweg) {
          expect(s.label.length).toBeGreaterThan(0)
          expect(s.rechnung.length).toBeGreaterThan(0)
          expect(s.ergebnis.length).toBeGreaterThan(0)
        }
      }
    },
  )

  it.each(AUFGABENTYPEN.map((t) => [t.id, t] as const))(
    'bei %s steht das Ergebnis auch im Rechenweg',
    (_id, typ) => {
      for (const seed of SEEDS) {
        const a = typ.erzeuge(rngMitSeed(seed))
        const text = a.rechenweg.map((s) => `${s.rechnung} ${s.ergebnis}`).join(' ')
        // Je nach Einheit wird mit 0 bis 3 Dezimalstellen angezeigt.
        const kandidaten = [0, 1, 2, 3].map((d) => zahl(a.loesung.wert, d))
        expect(
          kandidaten.some((k) => text.includes(k)),
          `${typ.id} (Seed ${seed}): ${a.loesung.wert} fehlt im Rechenweg`,
        ).toBe(true)
      }
    },
  )

  it('liefert bei gleichem Seed genau dieselbe Aufgabe', () => {
    for (const typ of AUFGABENTYPEN) {
      expect(typ.erzeuge(rngMitSeed(42))).toEqual(typ.erzeuge(rngMitSeed(42)))
    }
  })

  it('variiert die Zahlen über verschiedene Seeds — Auswendiglernen hilft nicht', () => {
    for (const typ of AUFGABENTYPEN) {
      const werte = new Set(SEEDS.map((s) => typ.erzeuge(rngMitSeed(s)).loesung.wert))
      expect(werte.size).toBeGreaterThan(5)
    }
  })

  it('kennt jeden Aufgabentyp über aufgabentyp()', () => {
    for (const typ of AUFGABENTYPEN) {
      expect(aufgabentyp(typ.id)).toBe(typ)
    }
    expect(() => aufgabentyp('gibtsnicht' as AufgabentypId)).toThrow()
  })
})

describe('Von Hand nachgerechnete Aufgaben (Seed 1)', () => {
  // Jeder Wert unten wurde per Hand nach dem Kalkulationsschema geprüft.
  const erwartet: Record<AufgabentypId, { titel: string; wert: number }> = {
    // 640 − 10 % = 576 − 3 % = 558,72 + 60
    bezugspreis: { titel: 'Bezugspreis', wert: 618.72 },
    // 154 + 25 % = 192,50 + 15 % = 221,38 + 7 %
    verkaufspreis: { titel: 'Verkaufspreis', wert: 236.88 },
    // 204 × 1,3 × 1,15 = 304,98 ÷ 97 × 100 = 314,41 ÷ 90 × 100 = 349,34 × 1,19
    'verkaufspreis-komplett': { titel: 'Verkaufspreis komplett', wert: 415.71 },
    // 60 ÷ 1,19 = 50,42 ÷ 112 × 100 = 45,02 ÷ 130 × 100
    rueckwaerts: { titel: 'Rückwärtskalkulation', wert: 34.63 },
    // 218,48 ÷ 1,19 = 183,60 − (102 × 1,3 = 132,60)
    differenz: { titel: 'Differenzkalkulation', wert: 51 },
    // (199,50 − 133) ÷ 133 × 100
    handelsspanne: { titel: 'Kalkulationszuschlag', wert: 50 },
    // 83.000 ÷ 5 = 16.600; 198.000 ÷ 16.600
    lagerkennzahlen: { titel: 'Umschlagshäufigkeit', wert: 11.93 },
    // 4 × 55 ÷ 360 = 0,611 %; 41.500 × 0,611 %
    lagerzinsen: { titel: 'Lagerzinsen', wert: 253.57 },
    // 135 × 2 + 135 × 4
    meldebestand: { titel: 'Meldebestand', wert: 810 },
    // 6,05 ÷ 1,07
    umsatzsteuer: { titel: 'Nettobetrag', wert: 5.65 },
    // 2 % × 360 ÷ (60 − 10)
    skontovergleich: { titel: 'Jahreszinssatz des Skontos', wert: 14.4 },
    // 200 ÷ 820.000 × 100
    inventurdifferenz: { titel: 'Schwundquote', wert: 0.024 },
    // 1.000 g ÷ 100 g = 10; 5,09 € × 10
    grundpreis: { titel: 'Grundpreis', wert: 50.9 },
    // 136.000 ÷ 680.000 × 100
    handlungskostensatz: { titel: 'Handlungskostenzuschlag', wert: 20 },
    // (918.000 − 900.000) ÷ 900.000 × 100
    prozentveraenderung: { titel: 'Umsatzsteigerung', wert: 2 },
    // 2 × 6 Std. = 12; 12 ÷ 8
    dreisatz: { titel: 'Dreisatz', wert: 1.5 },
    // 4,70 − 2,30 = 2,40; 2.400 ÷ 2,40
    'break-even': { titel: 'Break-even-Menge', wert: 1000 },
    // 41.000 ÷ 410.000 × 100
    rentabilitaet: { titel: 'Eigenkapitalrentabilität', wert: 10 },
  }

  it.each(AUFGABENTYPEN.map((t) => [t.id, t] as const))('%s', (id, typ) => {
    const a = typ.erzeuge(rngMitSeed(1))
    const soll = erwartet[id]
    expect(a.titel).toBe(soll.titel)
    expect(a.loesung.wert).toBeCloseTo(soll.wert, 2)
  })
})

describe('istZahlRichtig', () => {
  const loesung = { wert: 100, toleranz: 0.02, einheit: '€' }

  it('nimmt den genauen Wert an', () => {
    expect(istZahlRichtig(loesung, 100)).toBe(true)
  })

  it('nimmt Abweichungen innerhalb der Toleranz an', () => {
    expect(istZahlRichtig(loesung, 100.02)).toBe(true)
    expect(istZahlRichtig(loesung, 99.98)).toBe(true)
  })

  it('lehnt Abweichungen außerhalb der Toleranz ab', () => {
    expect(istZahlRichtig(loesung, 100.03)).toBe(false)
    expect(istZahlRichtig(loesung, 99.97)).toBe(false)
  })

  it('lehnt fehlende und unmögliche Eingaben ab', () => {
    expect(istZahlRichtig(loesung, null)).toBe(false)
    expect(istZahlRichtig(loesung, Number.NaN)).toBe(false)
    expect(istZahlRichtig(loesung, Number.POSITIVE_INFINITY)).toBe(false)
  })

  it('verlangt bei Toleranz 0 den exakten Wert', () => {
    const stueck = { wert: 810, toleranz: 0, einheit: 'Stück' }
    expect(istZahlRichtig(stueck, 810)).toBe(true)
    expect(istZahlRichtig(stueck, 809)).toBe(false)
  })
})
