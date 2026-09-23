/** Prüft eine Antwort gegen die Lösung einer Frage. */

import type { Antwort, Frage, ZahlLoesung } from '../../domain/types'
import { istZahlRichtig } from '../../engine/rechenaufgaben'
import { mische, type Rng } from '../../engine/zufall'

export function istRichtig(frage: Frage, antwort: Antwort): boolean {
  switch (frage.typ) {
    case 'single':
      return antwort.typ === 'single' && antwort.gewaehlt === frage.loesung
    case 'multi': {
      if (antwort.typ !== 'multi' || !Array.isArray(frage.loesung)) return false
      const soll = [...frage.loesung].sort((a, b) => a - b)
      const ist = [...new Set(antwort.gewaehlt)].sort((a, b) => a - b)
      return soll.length === ist.length && soll.every((w, i) => w === ist[i])
    }
    case 'zahl':
      return antwort.typ === 'zahl' && istZahlRichtig(frage.loesung as ZahlLoesung, antwort.eingabe)
  }
}

export function leereAntwort(frage: Frage): Antwort {
  switch (frage.typ) {
    case 'single':
      return { typ: 'single', gewaehlt: null }
    case 'multi':
      return { typ: 'multi', gewaehlt: [] }
    case 'zahl':
      return { typ: 'zahl', eingabe: null }
  }
}

export function istBeantwortet(antwort: Antwort): boolean {
  switch (antwort.typ) {
    case 'single':
      return antwort.gewaehlt !== null
    case 'multi':
      return antwort.gewaehlt.length > 0
    case 'zahl':
      return antwort.eingabe !== null
  }
}

/**
 * Liefert die Frage mit neu gemischten Antwortoptionen und passend
 * umgerechneter Lösung. Ohne das Mischen lernt man mit der Zeit die
 * Position der richtigen Antwort statt ihres Inhalts.
 */
export function mitGemischtenOptionen(f: Frage, rng: Rng): Frage {
  if (f.typ === 'zahl' || f.optionen === undefined) return f
  const alt = f.optionen
  // reihenfolge[neuerIndex] = alterIndex
  const reihenfolge = mische(
    rng,
    alt.map((_, i) => i),
  )
  const neuVonAlt = (a: number) => reihenfolge.indexOf(a)
  const loesung = Array.isArray(f.loesung)
    ? f.loesung.map(neuVonAlt).sort((a, b) => a - b)
    : neuVonAlt(f.loesung as number)
  return { ...f, optionen: reihenfolge.map((a) => alt[a] as string), loesung }
}
