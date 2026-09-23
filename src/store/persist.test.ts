import { describe, expect, it } from 'vitest'
import {
  MAX_VERSUCHE,
  SPEICHER_SCHLUESSEL,
  STANDARD_PRUEFUNGSTERMIN,
  alsBackup,
  ausBackup,
  kompaktiere,
  laden,
  leererZustand,
  migriere,
  speichern,
} from './persist'

const TAG = '2026-09-23'

function speicherAttrappe(start: Record<string, string> = {}) {
  const daten = { ...start }
  return {
    daten,
    getItem: (k: string) => daten[k] ?? null,
    setItem: (k: string, v: string) => {
      daten[k] = v
    },
  }
}

describe('Speichern und Laden', () => {
  it('startet ohne gespeicherte Daten mit einem leeren Zustand', () => {
    const z = laden(speicherAttrappe())
    expect(z.karten).toEqual({})
    expect(z.einstellungen.pruefungstermin).toBe(STANDARD_PRUEFUNGSTERMIN)
  })

  it('übersteht Speichern und Laden ohne Verlust', () => {
    const s = speicherAttrappe()
    const z = leererZustand(TAG)
    z.einstellungen.name = 'Mia'
    z.karten.f1 = { frageId: 'f1', box: 3, faelligAm: TAG, richtig: 4, falsch: 1, zuletztAm: TAG }
    z.tageMitZiel = ['2026-09-21', '2026-09-22']
    expect(speichern(z, s)).toBe(true)

    const geladen = laden(s)
    expect(geladen.einstellungen.name).toBe('Mia')
    expect(geladen.karten.f1?.box).toBe(3)
    expect(geladen.tageMitZiel).toEqual(['2026-09-21', '2026-09-22'])
  })

  it('fällt bei kaputtem JSON auf einen leeren Zustand zurück statt abzustürzen', () => {
    const z = laden(speicherAttrappe({ [SPEICHER_SCHLUESSEL]: '{kaputt' }))
    expect(z.karten).toEqual({})
  })

  it('meldet Fehlschlag, wenn der Speicher voll ist', () => {
    const voll = {
      getItem: () => null,
      setItem: () => {
        throw new Error('QuotaExceededError')
      },
    }
    expect(speichern(leererZustand(), voll)).toBe(false)
  })

  it('läuft ohne verfügbaren Speicher weiter', () => {
    expect(laden(null).karten).toEqual({})
    expect(speichern(leererZustand(), null)).toBe(false)
  })
})

describe('Migration', () => {
  it('behält gültige Karten und verwirft nur kaputte', () => {
    const z = migriere(
      {
        karten: {
          gut: { frageId: 'gut', box: 2, faelligAm: TAG, richtig: 3, falsch: 1, zuletztAm: TAG },
          ohneDatum: { frageId: 'ohneDatum', box: 1 },
          falscheId: { frageId: 'anders', box: 1, faelligAm: TAG, richtig: 0, falsch: 0 },
        },
      },
      TAG,
    )
    expect(Object.keys(z.karten)).toEqual(['gut'])
  })

  it('füllt fehlende Einstellungen mit Standardwerten, statt alles zu verwerfen', () => {
    const z = migriere({ einstellungen: { name: 'Mia' } }, TAG)
    expect(z.einstellungen.name).toBe('Mia')
    expect(z.einstellungen.tagesziel).toBe(20)
    expect(z.einstellungen.pruefungstermin).toBe(STANDARD_PRUEFUNGSTERMIN)
  })

  it('respektiert einen bewusst gelöschten Prüfungstermin', () => {
    const z = migriere({ einstellungen: { pruefungstermin: null } }, TAG)
    expect(z.einstellungen.pruefungstermin).toBeNull()
  })

  it('begrenzt unsinnige Werte', () => {
    const z = migriere({ einstellungen: { tagesziel: 99999 }, fachgespraechSelbst: 150 }, TAG)
    expect(z.einstellungen.tagesziel).toBe(200)
    expect(z.fachgespraechSelbst).toBe(100)
  })

  it('setzt den Tageszähler an einem neuen Tag zurück', () => {
    const gestern = migriere({ heute: { tag: '2026-09-22', beantwortet: 25 } }, TAG)
    expect(gestern.heute).toEqual({ tag: TAG, beantwortet: 0 })

    const heute = migriere({ heute: { tag: TAG, beantwortet: 25 } }, TAG)
    expect(heute.heute.beantwortet).toBe(25)
  })

  it('entfernt doppelte und ungültige Tage aus dem Streak', () => {
    const z = migriere({ tageMitZiel: ['2026-09-22', '2026-09-22', 'quatsch', '2026-09-21'] }, TAG)
    expect(z.tageMitZiel).toEqual(['2026-09-21', '2026-09-22'])
  })

  it('macht aus völlig fremden Daten einen leeren Zustand', () => {
    expect(migriere('text', TAG).karten).toEqual({})
    expect(migriere(null, TAG).versuche).toEqual([])
    expect(migriere([1, 2, 3], TAG).tageMitZiel).toEqual([])
  })
})

describe('Speicher klein halten', () => {
  it('behält höchstens die jüngsten Versuche und kürzt ältere', () => {
    const z = leererZustand(TAG)
    z.versuche = Array.from({ length: MAX_VERSUCHE + 20 }, (_, i) => ({
      id: `v${i}`,
      art: 'quiz' as const,
      begonnenAm: new Date(2026, 0, 1, 0, i).toISOString(),
      beendetAm: new Date(2026, 0, 1, 0, i).toISOString(),
      ergebnisse: [
        {
          frageId: 'f',
          thema: 'kalkulation' as const,
          bereich: 'warenwirtschaft' as const,
          richtig: true,
          antwort: { typ: 'single' as const, gewaehlt: 0 },
        },
      ],
      punkte: 80,
    }))

    const k = kompaktiere(z)
    expect(k.versuche).toHaveLength(MAX_VERSUCHE)
    // Die jüngsten stehen am Ende und behalten ihre Details.
    expect(k.versuche.at(-1)?.id).toBe(`v${MAX_VERSUCHE + 19}`)
    expect(k.versuche.at(-1)?.ergebnisse).toHaveLength(1)
    expect(k.versuche[0]?.ergebnisse).toHaveLength(0)
  })
})

describe('Backup', () => {
  it('stellt einen exportierten Stand vollständig wieder her', () => {
    const z = leererZustand(TAG)
    z.einstellungen.name = 'Mia'
    z.karten.f1 = { frageId: 'f1', box: 2, faelligAm: TAG, richtig: 2, falsch: 0, zuletztAm: TAG }
    const zurueck = ausBackup(alsBackup(z))
    expect(zurueck.einstellungen.name).toBe('Mia')
    expect(zurueck.karten.f1?.box).toBe(2)
  })

  it('lehnt fremde Dateien mit verständlicher Meldung ab', () => {
    expect(() => ausBackup('kein json')).toThrow('kein gültiges Backup')
    expect(() => ausBackup('{"app":"andere"}')).toThrow('kein Backup dieser LernApp')
  })
})

describe('Einrichtung und Erfolge', () => {
  it('zeigt die Einrichtung bei einem ganz neuen Zustand', () => {
    expect(leererZustand(TAG).einstellungen.onboardingFertig).toBe(false)
  })

  it('überspringt die Einrichtung für alle, die schon gelernt haben', () => {
    const alt = migriere(
      { karten: { f1: { frageId: 'f1', box: 1, faelligAm: TAG, richtig: 1, falsch: 0, zuletztAm: TAG } } },
      TAG,
    )
    expect(alt.einstellungen.onboardingFertig).toBe(true)
    expect(migriere({ einstellungen: { name: 'Mia' } }, TAG).einstellungen.onboardingFertig).toBe(true)
    expect(migriere({}, TAG).einstellungen.onboardingFertig).toBe(false)
  })

  it('übernimmt freigeschaltete Erfolge ohne Doppelte', () => {
    expect(migriere({ erfolge: ['start', 'start', 42, 'serie-3'] }, TAG).erfolge).toEqual(['start', 'serie-3'])
  })
})

describe('neue Felder: Karteikarten, Fallaufgaben, Erst-überlegen', () => {
  it('füllt sie bei altem Speicherstand mit Standardwerten', () => {
    const z = migriere({ einstellungen: { name: 'Mia' }, karten: {} }, '2026-10-01')
    expect(z.einstellungen.erstUeberlegen).toBe(true)
    expect(z.einstellungen.erinnerungUm).toBe('18:00')
    expect(z.begriffe).toEqual({})
    expect(z.faelle).toEqual({})
  })

  it('übernimmt gültige Werte und verwirft kaputte', () => {
    const z = migriere(
      {
        einstellungen: { erstUeberlegen: false, erinnerungUm: '25:99' },
        begriffe: {
          skonto: { frageId: 'skonto', box: 2, faelligAm: '2026-10-03', richtig: 2, falsch: 0 },
          kaputt: { box: 1 },
        },
        faelle: {
          'fa-01': { letztePunkte: 40, bestePunkte: 55, maxPunkte: 50, versuche: 2, zuletztAm: '2026-10-01' },
          'fa-02': { letztePunkte: 10 },
        },
      },
      '2026-10-01',
    )
    expect(z.einstellungen.erstUeberlegen).toBe(false)
    expect(z.einstellungen.erinnerungUm).toBe('18:00')
    expect(Object.keys(z.begriffe)).toEqual(['skonto'])
    expect(z.faelle['fa-01']).toEqual({ letztePunkte: 40, bestePunkte: 50, maxPunkte: 50, versuche: 2, zuletztAm: '2026-10-01' })
    expect(z.faelle['fa-02']).toBeUndefined()
  })
})
