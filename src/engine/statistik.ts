/**
 * Auswertung: was sitzt, was nicht, und was käme in einer echten Prüfung heraus.
 */

import { FRAGE_BEREICHE, gesamtergebnis, type Gesamtergebnis } from '../domain/pruefung'
import { THEMEN } from '../domain/themen'
import type {
  BereichId,
  Frage,
  GewichtungsId,
  Kartenstand,
  ThemaId,
  Versuch,
} from '../domain/types'
import { plusTage, tageBis, heute, type IsoTag } from './datum'
import { MAX_BOX } from './srs'

/** Ab so vielen Antworten gilt ein Thema als aussagekräftig bewertet. */
export const MINDESTANTWORTEN = 5

export type ThemaStatistik = {
  thema: ThemaId
  name: string
  bereich: BereichId
  anzahlFragen: number
  beantwortet: number
  richtig: number
  falsch: number
  /** null, solange nichts beantwortet wurde. */
  quote: number | null
  /** 0 bis 1: wie weit die Fragen des Themas in den Leitner-Boxen aufgestiegen sind. */
  fortschritt: number
}

export function themenStatistik(
  fragen: readonly Frage[],
  karten: Readonly<Record<string, Kartenstand>>,
): ThemaStatistik[] {
  return THEMEN.map((t) => {
    const eigene = fragen.filter((f) => f.thema === t.id)
    let richtig = 0
    let falsch = 0
    let boxSumme = 0

    for (const f of eigene) {
      const k = karten[f.id]
      if (k === undefined) continue
      richtig += k.richtig
      falsch += k.falsch
      boxSumme += k.box
    }

    const beantwortet = richtig + falsch
    return {
      thema: t.id,
      name: t.name,
      bereich: t.bereich,
      anzahlFragen: eigene.length,
      beantwortet,
      richtig,
      falsch,
      quote: beantwortet === 0 ? null : richtig / beantwortet,
      fortschritt: eigene.length === 0 ? 0 : boxSumme / (eigene.length * MAX_BOX),
    }
  })
}

export type BereichStatistik = {
  bereich: BereichId
  beantwortet: number
  quote: number | null
  fortschritt: number
}

export function bereichsStatistik(themen: readonly ThemaStatistik[]): BereichStatistik[] {
  return FRAGE_BEREICHE.map((b) => {
    const eigene = themen.filter((t) => t.bereich === b)
    const richtig = eigene.reduce((s, t) => s + t.richtig, 0)
    const beantwortet = eigene.reduce((s, t) => s + t.beantwortet, 0)
    const fragen = eigene.reduce((s, t) => s + t.anzahlFragen, 0)
    const gewichtet = eigene.reduce((s, t) => s + t.fortschritt * t.anzahlFragen, 0)

    return {
      bereich: b,
      beantwortet,
      quote: beantwortet === 0 ? null : richtig / beantwortet,
      fortschritt: fragen === 0 ? 0 : gewichtet / fragen,
    }
  })
}

/**
 * Themen mit der schlechtesten Quote, absteigend nach Dringlichkeit.
 * Themen mit zu wenig Antworten werden nur berücksichtigt, wenn es sonst
 * keine Kandidaten gibt. Andernfalls würde die App schon nach einer einzigen
 * falschen Antwort Alarm schlagen.
 */
export function schwaechsteThemen(
  themen: readonly ThemaStatistik[],
  anzahl = 3,
): ThemaStatistik[] {
  const bewertet = themen.filter((t) => t.beantwortet >= MINDESTANTWORTEN && t.quote !== null)
  const kandidaten =
    bewertet.length > 0 ? bewertet : themen.filter((t) => t.beantwortet > 0 && t.quote !== null)

  return [...kandidaten].sort((a, b) => (a.quote ?? 1) - (b.quote ?? 1)).slice(0, anzahl)
}

export function schwaechstesThema(themen: readonly ThemaStatistik[]): ThemaStatistik | undefined {
  return schwaechsteThemen(themen, 1)[0]
}

/**
 * Punkte je Prüfungsbereich aus den letzten Simulationen.
 * Gemittelt über die jüngsten drei Versuche je Bereich, damit ein einzelner
 * schlechter Tag die Einschätzung nicht verzerrt.
 */
export function punkteProBereich(versuche: readonly Versuch[]): Partial<Record<BereichId, number>> {
  const ergebnis: Partial<Record<BereichId, number>> = {}

  for (const b of FRAGE_BEREICHE) {
    const eigene = versuche
      .filter((v) => v.art === 'simulation' && v.bereich === b)
      .sort((x, y) => y.beendetAm.localeCompare(x.beendetAm))
      .slice(0, 3)

    if (eigene.length === 0) continue
    ergebnis[b] = Math.round(eigene.reduce((s, v) => s + v.punkte, 0) / eigene.length)
  }

  return ergebnis
}

/**
 * Notenschätzung nach echter Gewichtung. Das Fachgespräch kann nicht
 * automatisch bewertet werden. Es zählt deshalb nur mit, wenn sie sich selbst
 * eingeschätzt hat, und wird in der Anzeige als Selbsteinschätzung
 * gekennzeichnet.
 */
export function notenschaetzung(
  versuche: readonly Versuch[],
  fachgespraechSelbsteinschaetzung?: number,
): Gesamtergebnis {
  const teil: Partial<Record<GewichtungsId, number>> = { ...punkteProBereich(versuche) }
  if (fachgespraechSelbsteinschaetzung !== undefined) {
    teil.fachgespraech = fachgespraechSelbsteinschaetzung
  }
  return gesamtergebnis(teil)
}

export type VerlaufPunkt = { tag: IsoTag; punkte: number; anzahl: number }

/** Durchschnittliche Punkte je Tag über die letzten `tage` Tage. */
export function verlauf(
  versuche: readonly Versuch[],
  tage = 30,
  bis: IsoTag = heute(),
): VerlaufPunkt[] {
  const von = plusTage(bis, -(tage - 1))
  const nachTag = new Map<IsoTag, number[]>()

  for (const v of versuche) {
    const tag = v.beendetAm.slice(0, 10)
    if (tag < von || tag > bis) continue
    const liste = nachTag.get(tag) ?? []
    liste.push(v.punkte)
    nachTag.set(tag, liste)
  }

  const punkte: VerlaufPunkt[] = []
  for (let i = 0; i < tage; i++) {
    const tag = plusTage(von, i)
    const werte = nachTag.get(tag) ?? []
    punkte.push({
      tag,
      punkte: werte.length === 0 ? 0 : Math.round(werte.reduce((s, x) => s + x, 0) / werte.length),
      anzahl: werte.length,
    })
  }

  return punkte
}

/**
 * Lernstreak in Tagen. Ein einzelner verpasster Tag wird verziehen. Wer zwei
 * Tage hintereinander aussetzt, fängt neu an. Ohne diesen Karenztag würde ein
 * langer Arbeitstag eine Serie von drei Wochen beenden.
 */
export function streak(tageMitZiel: readonly IsoTag[], bis: IsoTag = heute()): number {
  const tage = new Set(tageMitZiel)
  if (tage.size === 0) return 0

  let laenge = 0
  let verzeihenGenutzt = false

  for (let i = 0; ; i++) {
    const tag = plusTage(bis, -i)
    if (tage.has(tag)) {
      laenge++
      continue
    }
    // Der heutige Tag zählt noch nicht als Lücke, weil er noch nicht vorbei ist.
    if (i === 0) continue
    if (!verzeihenGenutzt) {
      verzeihenGenutzt = true
      continue
    }
    break
  }

  return laenge
}

export function tageBisPruefung(pruefungstermin: IsoTag | null, von: IsoTag = heute()): number | null {
  if (pruefungstermin === null) return null
  return tageBis(von, pruefungstermin)
}

/** So oft soll jede Frage richtig beantwortet sein, bevor sie als sicher gilt. */
export const ZIEL_BOX = 3
/** Die letzten Tage vor der Prüfung bleiben frei für Simulationen und Wiederholung. */
export const PUFFER_TAGE = 14

/**
 * Empfohlene Fragen pro Tag, damit bis zum Puffer vor der Prüfung jede Frage
 * mindestens dreimal richtig beantwortet ist. null, wenn kein Termin feststeht
 * oder die Prüfung schon vorbei ist.
 */
export function empfohlenesTempo(
  fragen: readonly Frage[],
  karten: Readonly<Record<string, Kartenstand>>,
  tageBisPruefung: number | null,
): { proTag: number; offeneAntworten: number } | null {
  if (tageBisPruefung === null || tageBisPruefung < 0) return null
  const offeneAntworten = fragen.reduce(
    (summe, f) => summe + Math.max(0, ZIEL_BOX - (karten[f.id]?.box ?? 0)),
    0,
  )
  const lernTage = Math.max(1, tageBisPruefung - PUFFER_TAGE)
  const proTag = Math.min(80, Math.max(offeneAntworten === 0 ? 0 : 5, Math.ceil(offeneAntworten / lernTage)))
  return { proTag, offeneAntworten }
}
