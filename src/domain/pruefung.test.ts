import { describe, expect, it } from 'vitest'
import {
  BESTEHENSGRENZE,
  PRUEFUNGSBEREICHE,
  gesamtergebnis,
  istAusreichend,
  notenstufe,
  punkteAusQuote,
} from './pruefung'

describe('Gewichtung nach § 29 Abs. 1', () => {
  it('ergibt in der Summe genau 100 Prozent', () => {
    const summe = PRUEFUNGSBEREICHE.reduce((s, b) => s + b.gewicht, 0)
    expect(summe).toBe(100)
  })

  it('verteilt 35 Prozent auf Teil 1 und 65 Prozent auf Teil 2', () => {
    const teil1 = PRUEFUNGSBEREICHE.filter((b) => b.teil === 1).reduce((s, b) => s + b.gewicht, 0)
    const teil2 = PRUEFUNGSBEREICHE.filter((b) => b.teil === 2).reduce((s, b) => s + b.gewicht, 0)
    expect(teil1).toBe(35)
    expect(teil2).toBe(65)
  })

  it('hält die Prüfungszeiten der Verordnung ein', () => {
    const minuten = Object.fromEntries(PRUEFUNGSBEREICHE.map((b) => [b.id, b.minuten]))
    expect(minuten).toEqual({
      verkauf: 90,
      warenwirtschaft: 60,
      wiso: 60,
      geschaeftsprozesse: 120,
      fachgespraech: 20,
    })
  })

  it('kennt genau zwei Sperrfächer: Geschäftsprozesse und Fachgespräch', () => {
    expect(PRUEFUNGSBEREICHE.filter((b) => b.sperrfach).map((b) => b.id)).toEqual([
      'geschaeftsprozesse',
      'fachgespraech',
    ])
  })
})

describe('IHK-Notenschlüssel an den Grenzwerten', () => {
  const faelle: [number, number, string][] = [
    [100, 1, 'sehr gut'],
    [92, 1, 'sehr gut'],
    [91, 2, 'gut'],
    [81, 2, 'gut'],
    [80, 3, 'befriedigend'],
    [67, 3, 'befriedigend'],
    [66, 4, 'ausreichend'],
    [50, 4, 'ausreichend'],
    [49, 5, 'mangelhaft'],
    [30, 5, 'mangelhaft'],
    [29, 6, 'ungenügend'],
    [0, 6, 'ungenügend'],
  ]

  it.each(faelle)('%i Punkte sind Note %i (%s)', (punkte, note, wort) => {
    expect(notenstufe(punkte).note).toBe(note)
    expect(notenstufe(punkte).wort).toBe(wort)
  })

  it('weist Punkte außerhalb von 0 bis 100 zurück', () => {
    expect(() => notenstufe(-1)).toThrow()
    expect(() => notenstufe(101)).toThrow()
    expect(() => notenstufe(Number.NaN)).toThrow()
  })

  it('setzt die Bestehensgrenze bei 50 Punkten', () => {
    expect(BESTEHENSGRENZE).toBe(50)
    expect(istAusreichend(50)).toBe(true)
    expect(istAusreichend(49)).toBe(false)
  })
})

describe('Gesamtergebnis und Bestehensregel § 29 Abs. 2', () => {
  const alleGleich = (p: number) => ({
    verkauf: p,
    warenwirtschaft: p,
    wiso: p,
    geschaeftsprozesse: p,
    fachgespraech: p,
  })

  it('rechnet gewichtet, nicht als einfachen Mittelwert', () => {
    // Nur das Fachgespräch ist gut (40 %), alles andere gerade ausreichend.
    const e = gesamtergebnis({
      verkauf: 50,
      warenwirtschaft: 50,
      wiso: 50,
      geschaeftsprozesse: 50,
      fachgespraech: 100,
    })
    // 50*60 % + 100*40 % = 70
    expect(e.punkte).toBe(70)
    expect(e.note.note).toBe(3)
  })

  it('besteht, wenn alles mindestens ausreichend ist', () => {
    const e = gesamtergebnis(alleGleich(50))
    expect(e.vollstaendig).toBe(true)
    expect(e.bestanden).toBe(true)
    expect(e.durchgefallenIn).toEqual([])
  })

  it('fällt durch, wenn Geschäftsprozesse unter 50 liegt — trotz gutem Gesamtergebnis', () => {
    const e = gesamtergebnis({
      verkauf: 100,
      warenwirtschaft: 100,
      wiso: 100,
      geschaeftsprozesse: 40,
      fachgespraech: 100,
    })
    expect(e.punkte).toBeGreaterThanOrEqual(50)
    expect(e.durchgefallenIn).toEqual(['geschaeftsprozesse'])
    expect(e.bestanden).toBe(false)
  })

  it('fällt durch, wenn das Fachgespräch unter 50 liegt', () => {
    const e = gesamtergebnis({
      verkauf: 100,
      warenwirtschaft: 100,
      wiso: 100,
      geschaeftsprozesse: 100,
      fachgespraech: 49,
    })
    expect(e.durchgefallenIn).toEqual(['fachgespraech'])
    expect(e.bestanden).toBe(false)
  })

  it('fällt durch, wenn das Gesamtergebnis unter 50 liegt', () => {
    const e = gesamtergebnis(alleGleich(49))
    expect(e.bestanden).toBe(false)
  })

  it('normiert eine einzelne Simulation auf deren Gewichtung', () => {
    const e = gesamtergebnis({ geschaeftsprozesse: 80 })
    expect(e.punkte).toBe(80)
    expect(e.abgedeckteGewichtung).toBe(25)
    expect(e.vollstaendig).toBe(false)
    // Unvollständig kann nie "bestanden" melden.
    expect(e.bestanden).toBe(false)
  })

  it('meldet 0 Punkte ohne jedes Teilergebnis', () => {
    const e = gesamtergebnis({})
    expect(e.punkte).toBe(0)
    expect(e.abgedeckteGewichtung).toBe(0)
    expect(e.durchgefallenIn).toEqual([])
  })

  it('weist unmögliche Punktwerte zurück', () => {
    expect(() => gesamtergebnis({ verkauf: 120 })).toThrow()
  })
})

describe('punkteAusQuote', () => {
  it('rechnet richtige Antworten auf die 100er-Skala', () => {
    expect(punkteAusQuote(0, 20)).toBe(0)
    expect(punkteAusQuote(10, 20)).toBe(50)
    expect(punkteAusQuote(20, 20)).toBe(100)
    expect(punkteAusQuote(2, 3)).toBe(67)
  })

  it('bleibt bei null Fragen bei 0 statt NaN', () => {
    expect(punkteAusQuote(0, 0)).toBe(0)
  })
})
