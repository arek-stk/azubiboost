import { describe, expect, it } from 'vitest'
import type { Frage, Kartenstand } from '../domain/types'
import { heute, plusTage, tageBis } from './datum'
import { INTERVALLE, MAX_BOX, istFaellig, istNeu, nachAntwort, neueKarte, quote } from './srs'
import { baueSession, bauePruefung, entzerreThemen } from './sessionBuilder'
import { schwaechstesThema, streak, themenStatistik, verlauf, notenschaetzung } from './statistik'
import { coachNachricht } from './coach'
import { rngMitSeed } from './zufall'

const TAG = '2026-09-20'

function frage(id: string, thema: Frage['thema'], bereich: Frage['bereich']): Frage {
  return {
    id,
    thema,
    bereich,
    typ: 'single',
    frage: `Testfrage ${id}?`,
    optionen: ['a', 'b'],
    loesung: 0,
    erklaerung: 'Erklärung',
    schwierigkeit: 1,
  }
}

describe('Datumshilfen', () => {
  it('rechnet Tage vor und zurück, auch über Monats- und Jahresgrenzen', () => {
    expect(plusTage('2026-09-20', 1)).toBe('2026-09-21')
    expect(plusTage('2026-09-30', 1)).toBe('2026-10-01')
    expect(plusTage('2026-01-01', -1)).toBe('2025-12-31')
    expect(plusTage('2028-02-28', 1)).toBe('2028-02-29')
  })

  it('zählt Tage zwischen zwei Daten', () => {
    expect(tageBis('2026-09-20', '2027-04-28')).toBe(220)
    expect(tageBis('2026-09-20', '2026-09-20')).toBe(0)
    expect(tageBis('2026-09-20', '2026-09-19')).toBe(-1)
  })

  it('liefert heute im ISO-Format', () => {
    expect(heute(new Date(2026, 8, 20))).toBe('2026-09-20')
    expect(heute(new Date(2026, 0, 5))).toBe('2026-01-05')
  })
})

describe('Leitner-Wiederholung', () => {
  it('startet eine neue Karte in Box 0 und sofort fällig', () => {
    const k = neueKarte('f1', TAG)
    expect(k.box).toBe(0)
    expect(istNeu(k)).toBe(true)
    expect(istFaellig(k, TAG)).toBe(true)
    expect(quote(k)).toBeNull()
  })

  it('steigt bei richtiger Antwort eine Box auf und verschiebt den Termin', () => {
    let k = neueKarte('f1', TAG)
    k = nachAntwort(k, true, TAG)
    expect(k.box).toBe(1)
    expect(k.richtig).toBe(1)
    expect(k.faelligAm).toBe(plusTage(TAG, INTERVALLE[0] as number))
    expect(istFaellig(k, TAG)).toBe(false)
  })

  it('erreicht nach genug richtigen Antworten die höchste Box und bleibt dort', () => {
    let k = neueKarte('f1', TAG)
    let tag = TAG
    for (let i = 0; i < 10; i++) {
      k = nachAntwort(k, true, tag)
      tag = k.faelligAm
    }
    expect(k.box).toBe(MAX_BOX)
  })

  it('wirft eine falsche Antwort zurück auf Box 1 und macht sie am selben Tag wieder fällig', () => {
    let k = neueKarte('f1', TAG)
    k = nachAntwort(k, true, TAG)
    k = nachAntwort(k, true, k.faelligAm)
    expect(k.box).toBe(2)

    k = nachAntwort(k, false, '2026-10-01')
    expect(k.box).toBe(1)
    expect(k.falsch).toBe(1)
    expect(k.faelligAm).toBe('2026-10-01')
    expect(istFaellig(k, '2026-10-01')).toBe(true)
  })

  it('zählt richtige und falsche Antworten getrennt mit', () => {
    let k = neueKarte('f1', TAG)
    k = nachAntwort(k, true, TAG)
    k = nachAntwort(k, false, TAG)
    k = nachAntwort(k, true, TAG)
    expect(k.richtig).toBe(2)
    expect(k.falsch).toBe(1)
    expect(quote(k)).toBeCloseTo(2 / 3, 5)
  })
})

describe('Sitzung zusammenstellen', () => {
  const fragen: Frage[] = [
    ...Array.from({ length: 10 }, (_, i) => frage(`kalk${i}`, 'kalkulation', 'warenwirtschaft')),
    ...Array.from({ length: 10 }, (_, i) => frage(`recht${i}`, 'kaufvertrag', 'wiso')),
    ...Array.from({ length: 10 }, (_, i) => frage(`verk${i}`, 'verkaufsgespraech', 'verkauf')),
  ]

  it('liefert genau die gewünschte Anzahl ohne Wiederholungen', () => {
    const s = baueSession({ fragen, karten: {}, anzahl: 10, datum: TAG, rng: rngMitSeed(1) })
    expect(s).toHaveLength(10)
    expect(new Set(s.map((f) => f.id)).size).toBe(10)
  })

  it('beachtet den Themenfilter', () => {
    const s = baueSession({
      fragen,
      karten: {},
      anzahl: 5,
      thema: 'kalkulation',
      datum: TAG,
      rng: rngMitSeed(2),
    })
    expect(s).toHaveLength(5)
    expect(s.every((f) => f.thema === 'kalkulation')).toBe(true)
  })

  it('beachtet den Bereichsfilter', () => {
    const s = baueSession({
      fragen,
      karten: {},
      anzahl: 5,
      bereich: 'wiso',
      datum: TAG,
      rng: rngMitSeed(3),
    })
    expect(s.every((f) => f.bereich === 'wiso')).toBe(true)
  })

  it('zieht bei "nur Fehler" ausschließlich falsch beantwortete Fragen, häufigste zuerst', () => {
    const karten: Record<string, Kartenstand> = {
      kalk0: { ...neueKarte('kalk0', TAG), box: 1, falsch: 3, richtig: 1 },
      kalk1: { ...neueKarte('kalk1', TAG), box: 2, falsch: 1, richtig: 4 },
      recht0: { ...neueKarte('recht0', TAG), box: 3, falsch: 0, richtig: 5 },
    }
    const s = baueSession({ fragen, karten, anzahl: 10, nurFehler: true, datum: TAG })
    expect(s.map((f) => f.id)).toEqual(['kalk0', 'kalk1'])
  })

  it('bevorzugt fällige Karten gegenüber neuen', () => {
    const karten: Record<string, Kartenstand> = {}
    for (let i = 0; i < 10; i++) {
      karten[`kalk${i}`] = { ...neueKarte(`kalk${i}`, TAG), box: 1, faelligAm: TAG, richtig: 1 }
    }
    const s = baueSession({ fragen, karten, anzahl: 10, datum: TAG, rng: rngMitSeed(7) })
    const faellige = s.filter((f) => f.id.startsWith('kalk')).length
    // 60 Prozent des Kontingents sind für fällige Karten vorgesehen.
    expect(faellige).toBeGreaterThanOrEqual(6)
  })

  it('nimmt nichts, was noch nicht fällig ist, wenn genug anderes da ist', () => {
    const karten: Record<string, Kartenstand> = {
      kalk0: { ...neueKarte('kalk0', TAG), box: 3, faelligAm: '2026-12-01', richtig: 3 },
    }
    const s = baueSession({ fragen, karten, anzahl: 5, datum: TAG, rng: rngMitSeed(11) })
    expect(s.some((f) => f.id === 'kalk0')).toBe(false)
  })

  it('gibt nie mehr zurück als vorhanden ist', () => {
    const s = baueSession({ fragen, karten: {}, anzahl: 100, datum: TAG, rng: rngMitSeed(5) })
    expect(s).toHaveLength(fragen.length)
  })

  it('liefert bei Anzahl 0 oder leerem Pool eine leere Sitzung', () => {
    expect(baueSession({ fragen, karten: {}, anzahl: 0 })).toEqual([])
    expect(baueSession({ fragen: [], karten: {}, anzahl: 10 })).toEqual([])
  })

  it('vermeidet zwei gleiche Themen direkt hintereinander', () => {
    const gemischt = entzerreThemen([
      frage('a1', 'kalkulation', 'warenwirtschaft'),
      frage('a2', 'kalkulation', 'warenwirtschaft'),
      frage('b1', 'kaufvertrag', 'wiso'),
      frage('b2', 'kaufvertrag', 'wiso'),
    ])
    let direktFolgend = 0
    for (let i = 1; i < gemischt.length; i++) {
      if (gemischt[i]?.thema === gemischt[i - 1]?.thema) direktFolgend++
    }
    expect(direktFolgend).toBe(0)
  })

  it('verteilt eine Prüfungssimulation über die Themen des Bereichs', () => {
    const p = bauePruefung(fragen, 'warenwirtschaft', 6, rngMitSeed(4))
    expect(p).toHaveLength(6)
    expect(p.every((f) => f.bereich === 'warenwirtschaft')).toBe(true)
  })
})

describe('Statistik', () => {
  const fragen = [
    frage('k1', 'kalkulation', 'warenwirtschaft'),
    frage('k2', 'kalkulation', 'warenwirtschaft'),
    frage('r1', 'kaufvertrag', 'wiso'),
  ]

  it('rechnet Quote und Fortschritt je Thema', () => {
    const karten: Record<string, Kartenstand> = {
      k1: { ...neueKarte('k1', TAG), box: 1, richtig: 2, falsch: 8 },
      k2: { ...neueKarte('k2', TAG), box: 5, richtig: 5, falsch: 0 },
    }
    const stats = themenStatistik(fragen, karten)
    const kalk = stats.find((s) => s.thema === 'kalkulation')
    expect(kalk?.beantwortet).toBe(15)
    expect(kalk?.quote).toBeCloseTo(7 / 15, 5)
    expect(kalk?.fortschritt).toBeCloseTo(6 / 10, 5)

    const recht = stats.find((s) => s.thema === 'kaufvertrag')
    expect(recht?.quote).toBeNull()
    expect(recht?.fortschritt).toBe(0)
  })

  it('findet das schwächste Thema und bevorzugt ausreichend bewertete Themen', () => {
    const wenig = themenStatistik(fragen, {
      k1: { ...neueKarte('k1', TAG), box: 1, richtig: 0, falsch: 1 },
    })
    // Eine einzige falsche Antwort reicht, wenn es sonst nichts gibt ...
    expect(schwaechstesThema(wenig)?.thema).toBe('kalkulation')

    // ... ein ausreichend bewertetes Thema hat Vorrang.
    const genug = themenStatistik(fragen, {
      k1: { ...neueKarte('k1', TAG), box: 1, richtig: 1, falsch: 9 },
      r1: { ...neueKarte('r1', TAG), box: 1, richtig: 0, falsch: 1 },
    })
    expect(schwaechstesThema(genug)?.thema).toBe('kalkulation')
  })

  it('verzeiht beim Streak genau einen verpassten Tag', () => {
    expect(streak(['2026-09-20', '2026-09-19', '2026-09-18'], '2026-09-20')).toBe(3)
    // Lücke am 19., davor durchgehend: wird verziehen.
    expect(streak(['2026-09-20', '2026-09-18', '2026-09-17'], '2026-09-20')).toBe(3)
    // Zwei Tage Lücke beendet die Serie.
    expect(streak(['2026-09-20', '2026-09-17'], '2026-09-20')).toBe(1)
    expect(streak([], '2026-09-20')).toBe(0)
  })

  it('zählt den heutigen Tag nicht als Lücke', () => {
    expect(streak(['2026-09-19', '2026-09-18'], '2026-09-20')).toBe(2)
  })

  it('liefert für den Verlauf einen Punkt je Tag', () => {
    const v = verlauf(
      [
        {
          id: 'v1',
          art: 'simulation',
          bereich: 'geschaeftsprozesse',
          begonnenAm: '2026-09-20T10:00:00.000Z',
          beendetAm: '2026-09-20T11:00:00.000Z',
          ergebnisse: [],
          punkte: 80,
        },
      ],
      7,
      '2026-09-20',
    )
    expect(v).toHaveLength(7)
    expect(v[6]?.tag).toBe('2026-09-20')
    expect(v[6]?.punkte).toBe(80)
    expect(v[0]?.anzahl).toBe(0)
  })

  it('schätzt die Note nach echter Gewichtung und bleibt ehrlich unvollständig', () => {
    const e = notenschaetzung([
      {
        id: 'v1',
        art: 'simulation',
        bereich: 'geschaeftsprozesse',
        begonnenAm: '2026-09-20T10:00:00.000Z',
        beendetAm: '2026-09-20T11:00:00.000Z',
        ergebnisse: [],
        punkte: 70,
      },
    ])
    expect(e.punkte).toBe(70)
    expect(e.vollstaendig).toBe(false)
    expect(e.bestanden).toBe(false)
  })
})

describe('Lerncoach', () => {
  const basis = {
    name: 'Mia',
    heuteBeantwortet: 0,
    tagesziel: 30,
    streak: 0,
    tageBisPruefung: 220,
  }

  it('lobt, wenn das Tagesziel erreicht ist, und nennt die Serie', () => {
    const n = coachNachricht({ ...basis, heuteBeantwortet: 30, streak: 7 })
    expect(n.titel).toContain('Mia')
    expect(n.text).toContain('7 Tagen')
  })

  it('nennt die offenen Fragen, wenn der Tag begonnen hat', () => {
    const n = coachNachricht({ ...basis, heuteBeantwortet: 20 })
    expect(n.text).toContain('20')
    expect(n.text).toContain('10')
  })

  it('empfiehlt konkret Minuten für das schwächste Thema', () => {
    const n = coachNachricht({
      ...basis,
      heuteBeantwortet: 5,
      schwaechstesThema: { name: 'Warenwirtschaft', quote: 0.58 },
    })
    expect(n.empfehlung).toContain('Warenwirtschaft')
    expect(n.empfehlung).toContain('58 %')
    expect(n.empfehlung).toContain('15 Minuten')
  })

  it('kommt ohne eingetragenen Namen aus', () => {
    const n = coachNachricht({ ...basis, name: null })
    expect(n.titel).not.toContain('null')
    expect(n.titel.trim().length).toBeGreaterThan(0)
  })

  it('formuliert den Countdown je nach Nähe des Termins', () => {
    expect(coachNachricht({ ...basis, tageBisPruefung: 1 }).text).toContain('Morgen')
    expect(coachNachricht({ ...basis, tageBisPruefung: 0 }).text).toContain('Prüfungstag')
    expect(coachNachricht({ ...basis, tageBisPruefung: 5 }).text).toContain('5 Tage')
  })
})

describe('Lerntempo', () => {
  const zehn = Array.from({ length: 10 }, (_, i) => frage(`t${i}`, 'kalkulation', 'warenwirtschaft'))

  it('verteilt die offenen Antworten auf die Tage vor dem Puffer', async () => {
    const { empfohlenesTempo, PUFFER_TAGE, ZIEL_BOX } = await import('./statistik')
    // 10 Fragen × 3 Antworten = 30, verteilt auf 30 Lerntage → mindestens 5 (Untergrenze)
    const t = empfohlenesTempo(zehn, {}, 30 + PUFFER_TAGE)
    expect(t?.offeneAntworten).toBe(10 * ZIEL_BOX)
    expect(t?.proTag).toBe(5)
  })

  it('zählt Fragen, die schon sicher sitzen, nicht mehr mit', async () => {
    const { empfohlenesTempo } = await import('./statistik')
    const karten = Object.fromEntries(zehn.map((f) => [f.id, { ...neueKarte(f.id, TAG), box: 3 }]))
    expect(empfohlenesTempo(zehn, karten, 100)).toEqual({ proTag: 0, offeneAntworten: 0 })
  })

  it('wird kurz vor der Prüfung dringlicher und hat eine Obergrenze', async () => {
    const { empfohlenesTempo } = await import('./statistik')
    const viele = Array.from({ length: 200 }, (_, i) => frage(`v${i}`, 'kalkulation', 'warenwirtschaft'))
    expect(empfohlenesTempo(viele, {}, 20)?.proTag).toBe(80)
    expect(empfohlenesTempo(viele, {}, null)).toBeNull()
    expect(empfohlenesTempo(viele, {}, -1)).toBeNull()
  })
})

describe('Erst leicht, dann schwerer', () => {
  const gemischt: Frage[] = [
    ...Array.from({ length: 6 }, (_, i) => ({ ...frage(`leicht${i}`, 'kalkulation', 'warenwirtschaft'), schwierigkeit: 1 as const })),
    ...Array.from({ length: 6 }, (_, i) => ({ ...frage(`mittel${i}`, 'kalkulation', 'warenwirtschaft'), schwierigkeit: 2 as const })),
    ...Array.from({ length: 6 }, (_, i) => ({ ...frage(`schwer${i}`, 'kalkulation', 'warenwirtschaft'), schwierigkeit: 3 as const })),
  ]

  it('gibt am Anfang keine schweren neuen Fragen und die leichten zuerst', () => {
    const s = baueSession({ fragen: gemischt, karten: {}, anzahl: 8, datum: TAG, rng: rngMitSeed(3) })
    expect(s.some((f) => f.id.startsWith('schwer'))).toBe(false)
    expect(s.filter((f) => f.id.startsWith('leicht'))).toHaveLength(6)
  })

  it('lässt schwere Fragen zu, sobald das Thema sitzt', () => {
    const karten: Record<string, Kartenstand> = {}
    for (let i = 0; i < 6; i++) karten[`leicht${i}`] = { ...neueKarte(`leicht${i}`, TAG), box: 3, faelligAm: '2026-12-01', richtig: 3, falsch: 0 }
    for (let i = 0; i < 6; i++) karten[`mittel${i}`] = { ...neueKarte(`mittel${i}`, TAG), box: 3, faelligAm: '2026-12-01', richtig: 3, falsch: 1 }
    const s = baueSession({ fragen: gemischt, karten, anzahl: 6, datum: TAG, rng: rngMitSeed(4) })
    expect(s.some((f) => f.id.startsWith('schwer'))).toBe(true)
  })

  it('hält schwere Fragen zurück, solange die Quote unter 60 Prozent liegt', () => {
    const karten: Record<string, Kartenstand> = {}
    for (let i = 0; i < 6; i++) karten[`leicht${i}`] = { ...neueKarte(`leicht${i}`, TAG), box: 1, faelligAm: '2026-12-01', richtig: 1, falsch: 2 }
    const s = baueSession({ fragen: gemischt, karten, anzahl: 6, datum: TAG, rng: rngMitSeed(5) })
    expect(s.filter((f) => f.id.startsWith('schwer')).length).toBe(0)
  })
})
