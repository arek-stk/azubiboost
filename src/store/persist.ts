/**
 * Speichern und Laden des Lernstands im localStorage.
 *
 * Oberste Regel: ein Update der App darf niemals den Lernfortschritt löschen.
 * Deshalb wird alles Geladene gegen die erwartete Form geprüft, fehlende Felder
 * werden mit Standardwerten gefüllt und unbekannte Felder ignoriert — statt
 * bei der kleinsten Abweichung alles zu verwerfen.
 */

import type { Kartenstand, Versuch } from '../domain/types'
import type { AufgabentypId } from '../engine/rechenaufgaben'
import { heute, type IsoTag } from '../engine/datum'

export const SCHEMA_VERSION = 1
export const SPEICHER_SCHLUESSEL = 'azubiboost:zustand'

/**
 * Schriftliche Prüfung Teil 2 (Geschäftsprozesse), Sommer 2027, laut IHK Niederbayern.
 * Teil 1 wäre der Vortag (27.04.2027); die mündliche Prüfung liegt Mitte Juni bis Juli.
 */
export const STANDARD_PRUEFUNGSTERMIN: IsoTag = '2027-04-28'
export const STANDARD_TAGESZIEL = 20

/** So viele Versuche bleiben gespeichert; nur die jüngsten behalten Einzelantworten. */
export const MAX_VERSUCHE = 300
export const VERSUCHE_MIT_DETAILS = 30

export type Einstellungen = {
  name: string | null
  pruefungstermin: IsoTag | null
  tagesziel: number
  wahlqualifikation: string | null
  /** Einrichtung beim ersten Start abgeschlossen. */
  onboardingFertig: boolean
}

export type RechenStand = { richtig: number; falsch: number }

export type AppZustand = {
  schemaVersion: number
  einstellungen: Einstellungen
  karten: Record<string, Kartenstand>
  versuche: Versuch[]
  tageMitZiel: IsoTag[]
  heute: { tag: IsoTag; beantwortet: number }
  rechnen: Partial<Record<AufgabentypId, RechenStand>>
  /** Selbsteinschätzung fürs Fachgespräch auf der 100er-Skala. */
  fachgespraechSelbst: number | null
  /** IDs der bereits freigeschalteten Erfolge. */
  erfolge: string[]
}

export function leererZustand(tag: IsoTag = heute()): AppZustand {
  return {
    schemaVersion: SCHEMA_VERSION,
    einstellungen: {
      name: null,
      pruefungstermin: STANDARD_PRUEFUNGSTERMIN,
      tagesziel: STANDARD_TAGESZIEL,
      wahlqualifikation: null,
      onboardingFertig: false,
    },
    karten: {},
    versuche: [],
    tageMitZiel: [],
    heute: { tag, beantwortet: 0 },
    rechnen: {},
    fachgespraechSelbst: null,
    erfolge: [],
  }
}

const istObjekt = (x: unknown): x is Record<string, unknown> =>
  typeof x === 'object' && x !== null && !Array.isArray(x)
const istIsoTag = (x: unknown): x is IsoTag => typeof x === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(x)
const zahl = (x: unknown, ersatz: number) =>
  typeof x === 'number' && Number.isFinite(x) ? x : ersatz

function pruefeKarte(x: unknown): Kartenstand | null {
  if (!istObjekt(x) || typeof x.frageId !== 'string' || !istIsoTag(x.faelligAm)) return null
  return {
    frageId: x.frageId,
    box: Math.max(0, Math.round(zahl(x.box, 0))),
    faelligAm: x.faelligAm,
    richtig: Math.max(0, Math.round(zahl(x.richtig, 0))),
    falsch: Math.max(0, Math.round(zahl(x.falsch, 0))),
    zuletztAm: istIsoTag(x.zuletztAm) ? x.zuletztAm : null,
  }
}

function pruefeVersuch(x: unknown): Versuch | null {
  if (!istObjekt(x) || typeof x.id !== 'string') return null
  if (x.art !== 'quiz' && x.art !== 'rechnen' && x.art !== 'simulation') return null
  if (typeof x.beendetAm !== 'string') return null
  return {
    ...(x as unknown as Versuch),
    punkte: Math.min(100, Math.max(0, zahl(x.punkte, 0))),
    ergebnisse: Array.isArray(x.ergebnisse) ? (x.ergebnisse as Versuch['ergebnisse']) : [],
  }
}

/** Bringt beliebige geladene Daten in die aktuelle Form. Verwirft nur, was unbrauchbar ist. */
export function migriere(roh: unknown, tag: IsoTag = heute()): AppZustand {
  const z = leererZustand(tag)
  if (!istObjekt(roh)) return z

  const e = istObjekt(roh.einstellungen) ? roh.einstellungen : {}
  z.einstellungen = {
    name: typeof e.name === 'string' && e.name.trim() !== '' ? e.name.trim() : null,
    pruefungstermin: istIsoTag(e.pruefungstermin)
      ? e.pruefungstermin
      : e.pruefungstermin === null
        ? null
        : STANDARD_PRUEFUNGSTERMIN,
    tagesziel: Math.min(200, Math.max(5, Math.round(zahl(e.tagesziel, STANDARD_TAGESZIEL)))),
    wahlqualifikation: typeof e.wahlqualifikation === 'string' ? e.wahlqualifikation : null,
    // Wer schon vor Einführung der Einrichtung gelernt hat, soll sie nicht noch einmal sehen.
    onboardingFertig:
      typeof e.onboardingFertig === 'boolean'
        ? e.onboardingFertig
        : (istObjekt(roh.karten) && Object.keys(roh.karten).length > 0) || typeof e.name === 'string',
  }

  if (istObjekt(roh.karten)) {
    for (const [id, wert] of Object.entries(roh.karten)) {
      const k = pruefeKarte(wert)
      if (k !== null && k.frageId === id) z.karten[id] = k
    }
  }

  if (Array.isArray(roh.versuche)) {
    z.versuche = roh.versuche.map(pruefeVersuch).filter((v): v is Versuch => v !== null)
  }

  if (Array.isArray(roh.tageMitZiel)) {
    z.tageMitZiel = [...new Set(roh.tageMitZiel.filter(istIsoTag))].sort()
  }

  // Der Tageszähler gilt nur für den Tag, an dem er entstanden ist.
  if (istObjekt(roh.heute) && roh.heute.tag === tag) {
    z.heute = { tag, beantwortet: Math.max(0, Math.round(zahl(roh.heute.beantwortet, 0))) }
  }

  if (istObjekt(roh.rechnen)) {
    for (const [id, wert] of Object.entries(roh.rechnen)) {
      if (!istObjekt(wert)) continue
      z.rechnen[id as AufgabentypId] = {
        richtig: Math.max(0, Math.round(zahl(wert.richtig, 0))),
        falsch: Math.max(0, Math.round(zahl(wert.falsch, 0))),
      }
    }
  }

  const fg = roh.fachgespraechSelbst
  z.fachgespraechSelbst =
    typeof fg === 'number' && Number.isFinite(fg) ? Math.min(100, Math.max(0, fg)) : null

  if (Array.isArray(roh.erfolge)) {
    z.erfolge = [...new Set(roh.erfolge.filter((x): x is string => typeof x === 'string'))]
  }

  return z
}

/** Hält den Speicher klein: älteste Versuche fallen weg, ältere verlieren ihre Einzelantworten. */
export function kompaktiere(z: AppZustand): AppZustand {
  const sortiert = [...z.versuche].sort((a, b) => b.beendetAm.localeCompare(a.beendetAm))
  const behalten = sortiert
    .slice(0, MAX_VERSUCHE)
    .map((v, i) => (i < VERSUCHE_MIT_DETAILS ? v : { ...v, ergebnisse: [] }))
  return { ...z, versuche: behalten.reverse() }
}

type Speicher = Pick<Storage, 'getItem' | 'setItem'>

function standardSpeicher(): Speicher | null {
  try {
    return typeof localStorage === 'undefined' ? null : localStorage
  } catch {
    // Safari im privaten Modus oder gesperrte Website-Daten.
    return null
  }
}

export function laden(speicher: Speicher | null = standardSpeicher()): AppZustand {
  if (speicher === null) return leererZustand()
  try {
    const text = speicher.getItem(SPEICHER_SCHLUESSEL)
    return text === null ? leererZustand() : migriere(JSON.parse(text))
  } catch {
    return leererZustand()
  }
}

export function speichern(z: AppZustand, speicher: Speicher | null = standardSpeicher()): boolean {
  if (speicher === null) return false
  try {
    speicher.setItem(SPEICHER_SCHLUESSEL, JSON.stringify(kompaktiere(z)))
    return true
  } catch {
    return false
  }
}

export function alsBackup(z: AppZustand): string {
  return JSON.stringify({ app: 'azubiboost', exportiertAm: new Date().toISOString(), zustand: z }, null, 2)
}

/** Liest ein Backup ein. Wirft einen verständlichen Fehler, wenn die Datei nicht passt. */
export function ausBackup(text: string): AppZustand {
  let daten: unknown
  try {
    daten = JSON.parse(text)
  } catch {
    throw new Error('Die Datei ist kein gültiges Backup.')
  }
  if (!istObjekt(daten) || daten.app !== 'azubiboost' || !istObjekt(daten.zustand)) {
    throw new Error('Die Datei stammt nicht aus AzubiBoost.')
  }
  return migriere(daten.zustand)
}
