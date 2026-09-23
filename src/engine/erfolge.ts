/**
 * Erfolge und Abzeichen. Motivierend, aber nicht verspielt: jedes Abzeichen
 * steht für etwas, das für die Prüfung wirklich zählt.
 */

import type { BereichId } from '../domain/types'
import type { IsoTag } from './datum'
import { streak } from './statistik'

export type ErfolgKontext = {
  antworten: number
  richtigeRechenaufgaben: number
  laengsteSerie: number
  simulationen: readonly { bereich?: BereichId | undefined; punkte: number }[]
  fachgespraechGeuebt: boolean
  themenGeuebt: number
  themenGesamt: number
  gemeisterteThemen: number
}

export type Erfolg = {
  id: string
  symbol: string
  titel: string
  beschreibung: string
  erreicht: (k: ErfolgKontext) => boolean
}

export const ERFOLGE: readonly Erfolg[] = [
  { id: 'start', symbol: '🌱', titel: 'Losgelegt', beschreibung: 'Die erste Frage beantwortet.', erreicht: (k) => k.antworten >= 1 },
  { id: 'fragen-100', symbol: '🏆', titel: '100 Fragen', beschreibung: '100 Fragen beantwortet.', erreicht: (k) => k.antworten >= 100 },
  { id: 'fragen-500', symbol: '🚀', titel: '500 Fragen', beschreibung: '500 Fragen beantwortet.', erreicht: (k) => k.antworten >= 500 },
  { id: 'serie-3', symbol: '🔥', titel: '3 Tage am Stück', beschreibung: 'Drei Tage in Folge das Tagesziel geschafft.', erreicht: (k) => k.laengsteSerie >= 3 },
  { id: 'serie-7', symbol: '🔥', titel: 'Eine Woche', beschreibung: 'Sieben Tage in Folge das Tagesziel geschafft.', erreicht: (k) => k.laengsteSerie >= 7 },
  { id: 'serie-30', symbol: '👑', titel: 'Ein Monat', beschreibung: '30 Tage in Folge das Tagesziel geschafft.', erreicht: (k) => k.laengsteSerie >= 30 },
  { id: 'rechnen-10', symbol: '✏️', titel: 'Rechenprofi', beschreibung: '10 Rechenaufgaben ohne Hilfe richtig.', erreicht: (k) => k.richtigeRechenaufgaben >= 10 },
  { id: 'rechnen-50', symbol: '🧮', titel: 'Kalkulationskönigin', beschreibung: '50 Rechenaufgaben ohne Hilfe richtig.', erreicht: (k) => k.richtigeRechenaufgaben >= 50 },
  { id: 'simulation', symbol: '📝', titel: 'Erste Probeprüfung', beschreibung: 'Eine Prüfungssimulation abgeschlossen.', erreicht: (k) => k.simulationen.length >= 1 },
  { id: 'bestanden', symbol: '✅', titel: 'Bestanden', beschreibung: 'Eine Simulation mit mindestens 50 Punkten.', erreicht: (k) => k.simulationen.some((s) => s.punkte >= 50) },
  {
    id: 'gp-gut',
    symbol: '🎯',
    titel: 'Teil 2 im Griff',
    beschreibung: 'Geschäftsprozesse mit mindestens 81 Punkten (gut).',
    erreicht: (k) => k.simulationen.some((s) => s.bereich === 'geschaeftsprozesse' && s.punkte >= 81),
  },
  { id: 'sehr-gut', symbol: '💯', titel: 'Sehr gut', beschreibung: 'Eine Simulation mit 92 Punkten oder mehr.', erreicht: (k) => k.simulationen.some((s) => s.punkte >= 92) },
  { id: 'fachgespraech', symbol: '🗣️', titel: 'Laut geübt', beschreibung: 'Ein Fachgespräch durchgespielt.', erreicht: (k) => k.fachgespraechGeuebt },
  { id: 'thema-sicher', symbol: '🧠', titel: 'Thema sitzt', beschreibung: 'Alle Fragen eines Themas mindestens dreimal richtig.', erreicht: (k) => k.gemeisterteThemen >= 1 },
  {
    id: 'alle-themen',
    symbol: '🗺️',
    titel: 'Überall gewesen',
    beschreibung: 'In jedem Thema mindestens einmal geübt.',
    erreicht: (k) => k.themenGesamt > 0 && k.themenGeuebt >= k.themenGesamt,
  },
]

export function erreichteErfolge(k: ErfolgKontext): string[] {
  return ERFOLGE.filter((e) => e.erreicht(k)).map((e) => e.id)
}

/** Längste Serie über die gesamte Zeit — nach denselben Regeln wie die aktuelle Serie. */
export function laengsteSerie(tageMitZiel: readonly IsoTag[]): number {
  let beste = 0
  for (const tag of new Set(tageMitZiel)) beste = Math.max(beste, streak(tageMitZiel, tag))
  return beste
}
