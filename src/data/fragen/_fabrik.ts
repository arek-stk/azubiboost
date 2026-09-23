/**
 * Kurzschreibweise für Fragen. Hält die Themendateien lesbar: pro Frage steht
 * nur, was sie ausmacht, Thema und Bereich kommen aus der Fabrik.
 */

import type {
  BereichId,
  Frage,
  RechenSchritt,
  Schwierigkeit,
  ThemaId,
  ZahlLoesung,
} from '../../domain/types'

type Extras = {
  merksatz?: string
  rechtsbezug?: string
  schwierigkeit?: Schwierigkeit
}

export function themaFabrik(thema: ThemaId, bereich: BereichId) {
  const basis = (id: string, extras: Extras) => ({
    id,
    thema,
    bereich,
    schwierigkeit: extras.schwierigkeit ?? 2,
    ...(extras.merksatz === undefined ? {} : { merksatz: extras.merksatz }),
    ...(extras.rechtsbezug === undefined ? {} : { rechtsbezug: extras.rechtsbezug }),
  })

  return {
    /** Genau eine Antwort ist richtig. `richtig` ist der Index in `optionen`. */
    einfach(
      id: string,
      frage: string,
      optionen: string[],
      richtig: number,
      erklaerung: string,
      extras: Extras = {},
    ): Frage {
      return { ...basis(id, extras), typ: 'single', frage, optionen, loesung: richtig, erklaerung }
    },

    /** Mehrere Antworten sind richtig. Alle richtigen müssen gewählt werden. */
    mehrfach(
      id: string,
      frage: string,
      optionen: string[],
      richtig: number[],
      erklaerung: string,
      extras: Extras = {},
    ): Frage {
      return {
        ...basis(id, extras),
        typ: 'multi',
        frage,
        optionen,
        loesung: [...richtig].sort((a, b) => a - b),
        erklaerung,
      }
    },

    /** Rechenaufgabe: Eingabe einer Zahl, danach Rechenweg. */
    rechnen(
      id: string,
      frage: string,
      loesung: ZahlLoesung,
      rechenweg: RechenSchritt[],
      erklaerung: string,
      extras: Extras = {},
    ): Frage {
      return { ...basis(id, extras), typ: 'zahl', frage, loesung, rechenweg, erklaerung }
    },
  }
}

/** Kurzform für einen Rechenschritt. */
export const schritt = (
  label: string,
  rechnung: string,
  ergebnis: string,
  hinweis?: string,
): RechenSchritt => ({ label, rechnung, ergebnis, ...(hinweis === undefined ? {} : { hinweis }) })
