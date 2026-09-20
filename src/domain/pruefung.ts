/**
 * Die echten Regeln der gestreckten Abschlussprüfung
 * Kauffrau/Kaufmann im Einzelhandel.
 *
 * Grundlage: Verordnung über die Berufsausbildungen zum Verkäufer und zur
 * Verkäuferin sowie zum Kaufmann im Einzelhandel und zur Kauffrau im
 * Einzelhandel (VerkEHKflAusbV) vom 31.03.2017, §§ 21-29.
 * https://www.gesetze-im-internet.de/verkehkflausbv/BJNR045800017.html
 *
 * Diese Werte nur mit Quelle ändern.
 */

import type { BereichId, GewichtungsId, PruefungsTeil } from './types'

export type Pruefungsbereich = {
  id: GewichtungsId
  name: string
  kurz: string
  teil: PruefungsTeil
  /** Prüfungszeit in Minuten (§§ 22-27). */
  minuten: number
  /** Gewichtung am Gesamtergebnis in Prozent (§ 29 Abs. 1). */
  gewicht: number
  schriftlich: boolean
  /** Muss für sich bestanden werden, sonst ist die Prüfung durchgefallen (§ 29 Abs. 2). */
  sperrfach: boolean
}

export const PRUEFUNGSBEREICHE: readonly Pruefungsbereich[] = [
  {
    id: 'verkauf',
    name: 'Verkauf und Werbemaßnahmen',
    kurz: 'Verkauf',
    teil: 1,
    minuten: 90,
    gewicht: 15,
    schriftlich: true,
    sperrfach: false,
  },
  {
    id: 'warenwirtschaft',
    name: 'Warenwirtschaft und Kalkulation',
    kurz: 'Warenwirtschaft',
    teil: 1,
    minuten: 60,
    gewicht: 10,
    schriftlich: true,
    sperrfach: false,
  },
  {
    id: 'wiso',
    name: 'Wirtschafts- und Sozialkunde',
    kurz: 'WiSo',
    teil: 1,
    minuten: 60,
    gewicht: 10,
    schriftlich: true,
    sperrfach: false,
  },
  {
    id: 'geschaeftsprozesse',
    name: 'Geschäftsprozesse im Einzelhandel',
    kurz: 'Geschäftsprozesse',
    teil: 2,
    minuten: 120,
    gewicht: 25,
    schriftlich: true,
    sperrfach: true,
  },
  {
    id: 'fachgespraech',
    name: 'Fachgespräch in der Wahlqualifikation',
    kurz: 'Fachgespräch',
    teil: 2,
    minuten: 20,
    gewicht: 40,
    schriftlich: false,
    sperrfach: true,
  },
] as const

/** Die vier Bereiche, zu denen es Fragen gibt (ohne das mündliche Fachgespräch). */
export const FRAGE_BEREICHE: readonly BereichId[] = [
  'verkauf',
  'warenwirtschaft',
  'wiso',
  'geschaeftsprozesse',
]

export function bereich(id: GewichtungsId): Pruefungsbereich {
  const gefunden = PRUEFUNGSBEREICHE.find((b) => b.id === id)
  if (!gefunden) throw new Error(`Unbekannter Prüfungsbereich: ${id}`)
  return gefunden
}

/** Vorbereitungszeit für das Fachgespräch in Minuten (§ 28 Abs. 4). */
export const FACHGESPRAECH_VORBEREITUNG_MINUTEN = 15

/** Teil 1 zählt 35 %, Teil 2 zählt 65 % (Summe der Einzelgewichte). */
export const TEIL_GEWICHT: Record<PruefungsTeil, number> = { 1: 35, 2: 65 }

// ---------------------------------------------------------------------------
// IHK-Notenschlüssel
// ---------------------------------------------------------------------------

export type Notenstufe = {
  note: 1 | 2 | 3 | 4 | 5 | 6
  wort: string
  /** Untergrenze der Punktespanne, jeweils einschließlich. */
  ab: number
  beschreibung: string
}

export const NOTENSCHLUESSEL: readonly Notenstufe[] = [
  {
    note: 1,
    wort: 'sehr gut',
    ab: 92,
    beschreibung: 'entspricht den Anforderungen in besonderem Maße',
  },
  { note: 2, wort: 'gut', ab: 81, beschreibung: 'entspricht den Anforderungen voll' },
  {
    note: 3,
    wort: 'befriedigend',
    ab: 67,
    beschreibung: 'entspricht im Allgemeinen den Anforderungen',
  },
  {
    note: 4,
    wort: 'ausreichend',
    ab: 50,
    beschreibung: 'hat Mängel, genügt aber insgesamt noch den Anforderungen',
  },
  {
    note: 5,
    wort: 'mangelhaft',
    ab: 30,
    beschreibung: 'entspricht nicht den Anforderungen, lässt aber Grundkenntnisse erkennen',
  },
  {
    note: 6,
    wort: 'ungenügend',
    ab: 0,
    beschreibung: 'entspricht nicht den Anforderungen, deutliche Lücken auch bei Grundkenntnissen',
  },
] as const

/** Ab dieser Punktzahl ist ein Bereich "ausreichend" und damit bestanden. */
export const BESTEHENSGRENZE = 50

export function notenstufe(punkte: number): Notenstufe {
  if (!Number.isFinite(punkte) || punkte < 0 || punkte > 100) {
    throw new Error(`Punkte müssen zwischen 0 und 100 liegen, waren: ${punkte}`)
  }
  const stufe = NOTENSCHLUESSEL.find((s) => punkte >= s.ab)
  // Die letzte Stufe hat ab: 0 und greift damit immer.
  if (!stufe) throw new Error('Notenschlüssel unvollständig')
  return stufe
}

export function istAusreichend(punkte: number): boolean {
  return punkte >= BESTEHENSGRENZE
}

// ---------------------------------------------------------------------------
// Gesamtergebnis und Bestehensregel
// ---------------------------------------------------------------------------

export type Teilergebnisse = Partial<Record<GewichtungsId, number>>

export type Gesamtergebnis = {
  /** Gewichtete Punkte auf der 100er-Skala, kaufmännisch gerundet. */
  punkte: number
  note: Notenstufe
  /** true, sobald alle fünf Bereiche vorliegen. */
  vollstaendig: boolean
  bestanden: boolean
  /** Bereiche, die für sich bestanden werden müssen und es nicht sind. */
  durchgefallenIn: GewichtungsId[]
  /** Anteil der Gewichtung, der in die Rechnung eingeflossen ist (in Prozent). */
  abgedeckteGewichtung: number
}

/**
 * Gewichtetes Gesamtergebnis nach § 29 Abs. 1.
 *
 * Liegen nur einzelne Bereiche vor, wird auf deren Gewichtungssumme normiert —
 * so ergibt auch eine einzelne Simulation eine ehrliche Zwischenschätzung,
 * ohne fehlende Bereiche stillschweigend als 0 zu zählen.
 */
export function gesamtergebnis(teil: Teilergebnisse): Gesamtergebnis {
  let gewichtSumme = 0
  let punkteSumme = 0

  for (const b of PRUEFUNGSBEREICHE) {
    const punkte = teil[b.id]
    if (punkte === undefined) continue
    if (!Number.isFinite(punkte) || punkte < 0 || punkte > 100) {
      throw new Error(`Punkte für ${b.id} müssen zwischen 0 und 100 liegen, waren: ${punkte}`)
    }
    gewichtSumme += b.gewicht
    punkteSumme += punkte * b.gewicht
  }

  const punkte = gewichtSumme === 0 ? 0 : Math.round(punkteSumme / gewichtSumme)
  const vollstaendig = gewichtSumme === 100

  // § 29 Abs. 2: Geschäftsprozesse und Fachgespräch müssen jeweils für sich
  // mindestens "ausreichend" sein.
  const durchgefallenIn = PRUEFUNGSBEREICHE.filter((b) => {
    if (!b.sperrfach) return false
    const p = teil[b.id]
    return p !== undefined && !istAusreichend(p)
  }).map((b) => b.id)

  const bestanden = vollstaendig && istAusreichend(punkte) && durchgefallenIn.length === 0

  return {
    punkte,
    note: notenstufe(punkte),
    vollstaendig,
    bestanden,
    durchgefallenIn,
    abgedeckteGewichtung: gewichtSumme,
  }
}

/** Punkte aus richtig beantworteten Fragen auf die 100er-Skala umrechnen. */
export function punkteAusQuote(richtig: number, gesamt: number): number {
  if (gesamt <= 0) return 0
  return Math.round((richtig / gesamt) * 100)
}
