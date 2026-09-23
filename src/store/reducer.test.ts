import { describe, expect, it } from 'vitest'
import { leererZustand } from './persist'
import { reducer } from './reducer'

const TAG = '2026-09-23'

describe('reducer', () => {
  it('legt beim ersten Beantworten eine Karte an und schiebt sie in Box 1', () => {
    const z = reducer(leererZustand(TAG), {
      typ: 'frageBeantwortet',
      frageId: 'f1',
      richtig: true,
      tag: TAG,
    })
    expect(z.karten.f1?.box).toBe(1)
    expect(z.heute.beantwortet).toBe(1)
  })

  it('vermerkt den Tag erst, wenn das Tagesziel erreicht ist', () => {
    let z = leererZustand(TAG)
    z = { ...z, einstellungen: { ...z.einstellungen, tagesziel: 5 } }
    for (let i = 0; i < 4; i++) {
      z = reducer(z, { typ: 'frageBeantwortet', frageId: `f${i}`, richtig: true, tag: TAG })
    }
    expect(z.tageMitZiel).toEqual([])
    z = reducer(z, { typ: 'frageBeantwortet', frageId: 'f4', richtig: false, tag: TAG })
    expect(z.tageMitZiel).toEqual([TAG])
    // Weitere Antworten tragen den Tag nicht doppelt ein.
    z = reducer(z, { typ: 'frageBeantwortet', frageId: 'f5', richtig: true, tag: TAG })
    expect(z.tageMitZiel).toEqual([TAG])
  })

  it('beginnt den Tageszähler an einem neuen Tag bei null', () => {
    let z = reducer(leererZustand(TAG), {
      typ: 'frageBeantwortet',
      frageId: 'f1',
      richtig: true,
      tag: TAG,
    })
    z = reducer(z, { typ: 'frageBeantwortet', frageId: 'f2', richtig: true, tag: '2026-09-24' })
    expect(z.heute).toEqual({ tag: '2026-09-24', beantwortet: 1 })
  })

  it('zählt Rechenaufgaben getrennt nach Typ und zum Tagesziel', () => {
    let z = leererZustand(TAG)
    z = reducer(z, { typ: 'rechenaufgabeBeantwortet', typId: 'bezugspreis', richtig: true, tag: TAG })
    z = reducer(z, { typ: 'rechenaufgabeBeantwortet', typId: 'bezugspreis', richtig: false, tag: TAG })
    expect(z.rechnen.bezugspreis).toEqual({ richtig: 1, falsch: 1 })
    expect(z.heute.beantwortet).toBe(2)
  })

  it('begrenzt die Selbsteinschätzung auf 0 bis 100', () => {
    const z = reducer(leererZustand(TAG), { typ: 'fachgespraechEingeschaetzt', punkte: 140 })
    expect(z.fachgespraechSelbst).toBe(100)
  })

  it('setzt den Lernstand zurück, behält aber die Einstellungen', () => {
    let z = leererZustand(TAG)
    z = reducer(z, { typ: 'einstellungenGeaendert', aenderung: { name: 'Mia' } })
    z = reducer(z, { typ: 'frageBeantwortet', frageId: 'f1', richtig: true, tag: TAG })
    z = reducer(z, { typ: 'zuruecksetzen', tag: TAG })
    expect(z.karten).toEqual({})
    expect(z.einstellungen.name).toBe('Mia')
  })
})

describe('reducer: Karteikarten und Fallaufgaben', () => {
  const tag = '2026-10-01'

  it('schiebt einen gewussten Begriff eine Box weiter, ohne das Tagesziel zu zählen', () => {
    const z = reducer(leererZustand(tag), { typ: 'begriffBewertet', begriffId: 'skonto', gewusst: true, tag })
    expect(z.begriffe.skonto?.box).toBe(1)
    expect(z.begriffe.skonto?.faelligAm).toBe('2026-10-02')
    expect(z.heute.beantwortet).toBe(0)
  })

  it('merkt sich bei Fallaufgaben das letzte und das beste Ergebnis', () => {
    let z = reducer(leererZustand(tag), { typ: 'fallBewertet', fallId: 'fa-01', punkte: 30, maxPunkte: 50, tag })
    z = reducer(z, { typ: 'fallBewertet', fallId: 'fa-01', punkte: 20, maxPunkte: 50, tag })
    expect(z.faelle['fa-01']).toEqual({ letztePunkte: 20, bestePunkte: 30, maxPunkte: 50, versuche: 2, zuletztAm: tag })
  })

  it('begrenzt Fallpunkte auf 0 bis Maximum', () => {
    const z = reducer(leererZustand(tag), { typ: 'fallBewertet', fallId: 'fa-01', punkte: 99, maxPunkte: 50, tag })
    expect(z.faelle['fa-01']?.letztePunkte).toBe(50)
  })
})
