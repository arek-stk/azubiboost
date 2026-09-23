/**
 * Wochenplan bis zur schriftlichen Prüfung und danach bis zum Fachgespräch.
 *
 * Aufbau: Themenwochen mit je zwei Themen (Teil-2-Themen und schwache Themen
 * zuerst), dazu die passende Stufe im Rechnen-Lernpfad. Die zwei Wochen vor der
 * Prüfungswoche sind für Probeprüfungen, die Prüfungswoche selbst nur zum
 * Wiederholen. Nach der schriftlichen Prüfung folgen Wochen fürs Fachgespräch.
 */

import { alsDate, heute as heuteTag, plusTage, tageBis, type IsoTag } from './datum'

export type PlanThema = { id: string; name: string }

export type LernWoche = {
  /** Montag der Woche. */
  start: IsoTag
  /** Sonntag der Woche. */
  ende: IsoTag
  art: 'themen' | 'probe' | 'pruefungswoche' | 'fachgespraech'
  titel: string
  themen: PlanThema[]
  /** Empfohlene Stufe im Rechnen-Lernpfad, nur in Themenwochen. */
  rechenstufe: 1 | 2 | 3 | 4 | null
  hinweis: string
}

/** Wochen nach der schriftlichen Prüfung bis etwa Ende Juni, wenn die mündlichen Prüfungen laufen. */
const WOCHEN_FACHGESPRAECH = 8
const PROBEWOCHEN = 2

export function montag(tag: IsoTag): IsoTag {
  const wochentag = (alsDate(tag).getDay() + 6) % 7
  return plusTage(tag, -wochentag)
}

function rechenstufe(anteil: number): 1 | 2 | 3 | 4 {
  if (anteil < 0.15) return 1
  if (anteil < 0.4) return 2
  if (anteil < 0.7) return 3
  return 4
}

const STUFENNAME = { 1: 'Grundlagen', 2: 'Einstieg', 3: 'Sicher werden', 4: 'Prüfungsniveau' } as const

export function lernplan(p: {
  heute?: IsoTag
  pruefung: IsoTag
  /** In der Reihenfolge, in der sie drankommen sollen: wichtig und schwach zuerst. */
  themen: readonly PlanThema[]
}): LernWoche[] {
  const heute = p.heute ?? heuteTag()
  const ersteWoche = montag(heute)
  const pruefungsWoche = montag(p.pruefung)
  const wochen: LernWoche[] = []

  const anzahlVorher = Math.max(0, Math.round(tageBis(ersteWoche, pruefungsWoche) / 7))
  const themenWochen = Math.max(0, anzahlVorher - PROBEWOCHEN)
  let t = 0

  for (let i = 0; i < anzahlVorher; i++) {
    const start = plusTage(ersteWoche, i * 7)
    const ende = plusTage(start, 6)
    if (i < themenWochen) {
      const themen = p.themen.length === 0 ? [] : [0, 1].map((k) => p.themen[(t + k) % p.themen.length] as PlanThema)
      t += 2
      const stufe = rechenstufe(themenWochen <= 1 ? 1 : i / themenWochen)
      const runde = p.themen.length === 0 ? 0 : Math.floor((t - 2) / p.themen.length)
      wochen.push({
        start,
        ende,
        art: 'themen',
        titel: themen.map((x) => x.name).join(' und '),
        themen,
        rechenstufe: stufe,
        hinweis:
          (runde > 0 ? 'Zweite Runde: jetzt vor allem wiederholen und Fehler üben. ' : '') +
          `Beim Rechnen: Stufe ${stufe} (${STUFENNAME[stufe]}).`,
      })
    } else {
      wochen.push({
        start,
        ende,
        art: 'probe',
        titel: 'Probeprüfungen',
        themen: [],
        rechenstufe: null,
        hinweis: 'Zwei Probeprüfungen Geschäftsprozesse mit 120 Minuten und dazwischen deine Fehler wiederholen.',
      })
    }
  }

  wochen.push({
    start: pruefungsWoche,
    ende: plusTage(pruefungsWoche, 6),
    art: 'pruefungswoche',
    titel: 'Prüfungswoche',
    themen: [],
    rechenstufe: null,
    hinweis: 'Nichts Neues mehr. Formeln und Merksätze ansehen, Taschenrechner einpacken, früh schlafen.',
  })

  for (let i = 1; i <= WOCHEN_FACHGESPRAECH; i++) {
    const start = plusTage(pruefungsWoche, i * 7)
    wochen.push({
      start,
      ende: plusTage(start, 6),
      art: 'fachgespraech',
      titel: 'Fachgespräch üben',
      themen: [],
      rechenstufe: null,
      hinweis: 'Zwei Fälle pro Woche laut durchsprechen und aufnehmen. Den genauen Termin schickt dir die IHK.',
    })
  }

  // Vergangene Wochen fallen weg, die aktuelle bleibt.
  return wochen.filter((w) => tageBis(heute, w.ende) >= 0)
}

/** Die Woche, in der `tag` liegt, oder undefined. */
export function aktuelleWoche(plan: readonly LernWoche[], tag: IsoTag = heuteTag()): LernWoche | undefined {
  return plan.find((w) => tageBis(w.start, tag) >= 0 && tageBis(tag, w.ende) >= 0)
}
