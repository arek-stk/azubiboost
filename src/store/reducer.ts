/**
 * Alle Zustandsänderungen der App an einer Stelle, als reine Funktion.
 * Die Oberfläche löst nur Aktionen aus — was dabei passiert, steht hier und
 * ist ohne Browser testbar.
 */

import type { Versuch } from '../domain/types'
import type { AufgabentypId } from '../engine/rechenaufgaben'
import type { IsoTag } from '../engine/datum'
import { nachAntwort, neueKarte } from '../engine/srs'
import { leererZustand, type AppZustand, type Einstellungen } from './persist'

export type Aktion =
  | { typ: 'frageBeantwortet'; frageId: string; richtig: boolean; tag: IsoTag }
  | { typ: 'rechenaufgabeBeantwortet'; typId: AufgabentypId; richtig: boolean; tag: IsoTag }
  | { typ: 'versuchBeendet'; versuch: Versuch }
  | { typ: 'einstellungenGeaendert'; aenderung: Partial<Einstellungen> }
  | { typ: 'fachgespraechEingeschaetzt'; punkte: number }
  | { typ: 'ersetzen'; zustand: AppZustand }
  | { typ: 'zuruecksetzen'; tag: IsoTag }

/** Zählt eine Antwort zum Tagesziel und vermerkt den Tag, sobald das Ziel erreicht ist. */
function zaehleZumTag(z: AppZustand, tag: IsoTag): AppZustand {
  const beantwortet = (z.heute.tag === tag ? z.heute.beantwortet : 0) + 1
  const zielErreicht = beantwortet >= z.einstellungen.tagesziel
  const tageMitZiel =
    zielErreicht && !z.tageMitZiel.includes(tag) ? [...z.tageMitZiel, tag].sort() : z.tageMitZiel
  return { ...z, heute: { tag, beantwortet }, tageMitZiel }
}

export function reducer(z: AppZustand, a: Aktion): AppZustand {
  switch (a.typ) {
    case 'frageBeantwortet': {
      const alt = z.karten[a.frageId] ?? neueKarte(a.frageId, a.tag)
      const karten = { ...z.karten, [a.frageId]: nachAntwort(alt, a.richtig, a.tag) }
      return zaehleZumTag({ ...z, karten }, a.tag)
    }

    case 'rechenaufgabeBeantwortet': {
      const alt = z.rechnen[a.typId] ?? { richtig: 0, falsch: 0 }
      const neu = a.richtig
        ? { ...alt, richtig: alt.richtig + 1 }
        : { ...alt, falsch: alt.falsch + 1 }
      return zaehleZumTag({ ...z, rechnen: { ...z.rechnen, [a.typId]: neu } }, a.tag)
    }

    case 'versuchBeendet':
      return { ...z, versuche: [...z.versuche, a.versuch] }

    case 'einstellungenGeaendert':
      return { ...z, einstellungen: { ...z.einstellungen, ...a.aenderung } }

    case 'fachgespraechEingeschaetzt':
      return { ...z, fachgespraechSelbst: Math.min(100, Math.max(0, Math.round(a.punkte))) }

    case 'ersetzen':
      return a.zustand

    case 'zuruecksetzen':
      // Einstellungen bleiben — wer neu anfängt, will nicht auch Name und Termin neu eingeben.
      return { ...leererZustand(a.tag), einstellungen: z.einstellungen }
  }
}
