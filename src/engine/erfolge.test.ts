import { describe, expect, it } from 'vitest'
import { ERFOLGE, erreichteErfolge, laengsteSerie, type ErfolgKontext } from './erfolge'

const nichts: ErfolgKontext = {
  antworten: 0,
  richtigeRechenaufgaben: 0,
  laengsteSerie: 0,
  simulationen: [],
  fachgespraechGeuebt: false,
  themenGeuebt: 0,
  themenGesamt: 14,
  gemeisterteThemen: 0,
}

describe('Erfolge', () => {
  it('haben eindeutige IDs', () => {
    expect(new Set(ERFOLGE.map((e) => e.id)).size).toBe(ERFOLGE.length)
  })

  it('sind am Anfang alle gesperrt', () => {
    expect(erreichteErfolge(nichts)).toEqual([])
  })

  it('werden an den Schwellen freigeschaltet', () => {
    expect(erreichteErfolge({ ...nichts, antworten: 1 })).toContain('start')
    expect(erreichteErfolge({ ...nichts, antworten: 99 })).not.toContain('fragen-100')
    expect(erreichteErfolge({ ...nichts, antworten: 100 })).toContain('fragen-100')
    expect(erreichteErfolge({ ...nichts, laengsteSerie: 7 })).toEqual(expect.arrayContaining(['serie-3', 'serie-7']))
  })

  it('unterscheidet bei Simulationen nach Bereich und Punkten', () => {
    const k = { ...nichts, simulationen: [{ bereich: 'verkauf' as const, punkte: 85 }] }
    expect(erreichteErfolge(k)).toEqual(expect.arrayContaining(['simulation', 'bestanden']))
    expect(erreichteErfolge(k)).not.toContain('gp-gut')
    const gp = { ...nichts, simulationen: [{ bereich: 'geschaeftsprozesse' as const, punkte: 81 }] }
    expect(erreichteErfolge(gp)).toContain('gp-gut')
  })

  it('verlangt für „Überall gewesen“ wirklich alle Themen', () => {
    expect(erreichteErfolge({ ...nichts, themenGeuebt: 13 })).not.toContain('alle-themen')
    expect(erreichteErfolge({ ...nichts, themenGeuebt: 14 })).toContain('alle-themen')
  })
})

describe('längste Serie', () => {
  it('findet die längste Serie auch in der Vergangenheit', () => {
    const tage = ['2026-09-01', '2026-09-02', '2026-09-03', '2026-09-04', '2026-09-20']
    expect(laengsteSerie(tage)).toBe(4)
  })

  it('ist bei keinen Tagen null', () => {
    expect(laengsteSerie([])).toBe(0)
  })
})
