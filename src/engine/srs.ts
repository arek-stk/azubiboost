/**
 * Wiederholung nach dem Leitner-Prinzip.
 *
 * Jede Frage sitzt in einer Box. Richtig beantwortet steigt sie auf und kommt
 * später wieder, falsch beantwortet fällt sie auf Box 1 und ist noch am selben
 * Tag wieder fällig. Das ist der Grund, warum sie ihre Fehler nicht los wird,
 * bis sie sie kann.
 */

import type { Kartenstand } from '../domain/types'
import { heute, istVorOderGleich, plusTage, type IsoTag } from './datum'

/** Wiederholungsabstand in Tagen für Box 1 bis 5. */
export const INTERVALLE = [1, 3, 7, 21, 45] as const
export const MAX_BOX = INTERVALLE.length

/** Box 0 heißt: noch nie beantwortet. */
export function neueKarte(frageId: string, datum: IsoTag = heute()): Kartenstand {
  return { frageId, box: 0, faelligAm: datum, richtig: 0, falsch: 0, zuletztAm: null }
}

export function intervallFuerBox(box: number): number {
  const i = Math.min(Math.max(box, 1), MAX_BOX) - 1
  return INTERVALLE[i] as number
}

export function nachAntwort(
  karte: Kartenstand,
  richtig: boolean,
  datum: IsoTag = heute(),
): Kartenstand {
  if (richtig) {
    const box = Math.min(karte.box + 1, MAX_BOX)
    return {
      ...karte,
      box,
      faelligAm: plusTage(datum, intervallFuerBox(box)),
      richtig: karte.richtig + 1,
      zuletztAm: datum,
    }
  }

  return {
    ...karte,
    box: 1,
    // Noch heute wieder dran — Fehler werden in derselben Sitzung wiederholt.
    faelligAm: datum,
    falsch: karte.falsch + 1,
    zuletztAm: datum,
  }
}

export function istFaellig(karte: Kartenstand, datum: IsoTag = heute()): boolean {
  return istVorOderGleich(karte.faelligAm, datum)
}

export function istNeu(karte: Kartenstand): boolean {
  return karte.box === 0
}

/** Trefferquote der Karte; null, solange sie nie beantwortet wurde. */
export function quote(karte: Kartenstand): number | null {
  const gesamt = karte.richtig + karte.falsch
  if (gesamt === 0) return null
  return karte.richtig / gesamt
}

/** Wie sicher sitzt die Frage? 0 = neu, 1 = in der höchsten Box. */
export function sicherheit(karte: Kartenstand): number {
  return karte.box / MAX_BOX
}
