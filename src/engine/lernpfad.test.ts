import { describe, expect, it } from 'vitest'
import { GRUNDLAGEN_TYPEN } from './grundlagen'
import { STUFEN, lernpfad, meisterSchwelle } from './lernpfad'
import { AUFGABENTYPEN } from './rechenaufgaben'

describe('Lernpfad', () => {
  it('enthält jeden Aufgabentyp genau einmal', () => {
    const imPfad = STUFEN.flatMap((s) => s.typen)
    const alle = [...GRUNDLAGEN_TYPEN, ...AUFGABENTYPEN].map((t) => t.id)
    expect(new Set(imPfad).size).toBe(imPfad.length)
    expect([...imPfad].sort()).toEqual([...alle].sort())
  })

  it('ordnet die Prüfungsaufgaben von leicht nach schwer', () => {
    // Stufe 1 sind Bausteine unter den Prüfungsaufgaben; ab Stufe 2 steigt die Schwierigkeit.
    const schwierigkeit = new Map(AUFGABENTYPEN.map((t) => [t.id, t.schwierigkeit]))
    const pruefung = STUFEN.filter((s) => s.nr > 1)
    const mittel = pruefung.map((s) => s.typen.reduce((a, id) => a + (schwierigkeit.get(id) ?? 0), 0) / s.typen.length)
    for (let i = 1; i < mittel.length; i++) expect(mittel[i] ?? 0).toBeGreaterThan(mittel[i - 1] ?? 0)
    expect(STUFEN.find((s) => s.nr === 4)?.typen.every((id) => schwierigkeit.get(id) === 3)).toBe(true)
  })

  it('beginnt am Anfang mit der ersten Grundlage', () => {
    const p = lernpfad({})
    expect(p.naechster).toBe('g-prozentwert')
    expect(p.aktuelleStufe).toBe(1)
    expect(p.gemeistert).toBe(0)
    expect(p.knoten.filter((k) => k.jetztDran)).toHaveLength(1)
  })

  it('geht erst weiter, wenn die Schwelle ohne Hilfe erreicht ist', () => {
    expect(lernpfad({ 'g-prozentwert': { richtig: 1 } }).naechster).toBe('g-prozentwert')
    expect(lernpfad({ 'g-prozentwert': { richtig: 2 } }).naechster).toBe('g-prozentsatz')
  })

  it('verlangt bei Prüfungsaufgaben mehr Sicherheit als bei Grundlagen', () => {
    expect(meisterSchwelle('g-runden')).toBe(2)
    expect(meisterSchwelle('bezugspreis')).toBe(3)
  })

  it('erreicht nach allen Grundlagen die Stufe Einstieg', () => {
    const alleGrundlagen = Object.fromEntries(GRUNDLAGEN_TYPEN.map((t) => [t.id, { richtig: 2 }]))
    const p = lernpfad(alleGrundlagen)
    expect(p.aktuelleStufe).toBe(2)
    expect(p.naechster).toBe('dreisatz')
  })

  it('meldet null, wenn alles gemeistert ist', () => {
    const alles = Object.fromEntries(STUFEN.flatMap((s) => s.typen).map((id) => [id, { richtig: 5 }]))
    const p = lernpfad(alles)
    expect(p.naechster).toBeNull()
    expect(p.gemeistert).toBe(p.gesamt)
  })
})
