/**
 * Stellt eine Lernsitzung zusammen.
 *
 * Der Mix ist bewusst nicht zufällig: überwiegend fällige Wiederholungen,
 * ein Viertel aus dem schwächsten Thema und ein kleiner Rest neuer Fragen.
 * So bleibt Bekanntes sitzen, die Lücke wird kleiner und es kommt trotzdem
 * jeden Tag etwas Neues dazu.
 */

import type { BereichId, Frage, Kartenstand, ThemaId } from '../domain/types'
import { heute, type IsoTag } from './datum'
import { istFaellig, istNeu } from './srs'
import { mische, rngMitSeed, tagesSeed, type Rng } from './zufall'

export const ANTEIL_FAELLIG = 0.6
export const ANTEIL_SCHWACH = 0.25

/** Schwere neue Fragen erst, wenn das Thema sitzt: so viele Antworten mit dieser Quote. */
export const SCHWER_AB_ANTWORTEN = 5
export const SCHWER_AB_QUOTE = 0.6

/** Ist ein Thema bereit für schwere neue Fragen? Erst leicht, dann schwerer. */
export function bereitFuerSchwer(
  thema: ThemaId,
  fragen: readonly Frage[],
  karten: Readonly<Record<string, Kartenstand>>,
): boolean {
  let richtig = 0
  let gesamt = 0
  for (const f of fragen) {
    if (f.thema !== thema) continue
    const k = karten[f.id]
    if (k === undefined) continue
    richtig += k.richtig
    gesamt += k.richtig + k.falsch
  }
  return gesamt >= SCHWER_AB_ANTWORTEN && richtig / gesamt >= SCHWER_AB_QUOTE
}

export type SessionWunsch = {
  fragen: readonly Frage[]
  karten: Readonly<Record<string, Kartenstand>>
  anzahl: number
  /** Nur Fragen dieses Themas. */
  thema?: ThemaId
  /** Nur Fragen dieses Prüfungsbereichs. */
  bereich?: BereichId
  /** Nur Fragen, die schon einmal falsch beantwortet wurden. */
  nurFehler?: boolean
  /** Thema, aus dem zusätzlich gezogen wird — kommt aus der Schwachstellenanalyse. */
  schwaechstesThema?: ThemaId
  datum?: IsoTag
  rng?: Rng
}

function passtZumFilter(f: Frage, w: SessionWunsch): boolean {
  if (w.thema !== undefined && f.thema !== w.thema) return false
  if (w.bereich !== undefined && f.bereich !== w.bereich) return false
  return true
}

/**
 * Sortiert so um, dass möglichst nie zwei Fragen desselben Themas
 * direkt aufeinander folgen.
 */
export function entzerreThemen(fragen: readonly Frage[]): Frage[] {
  const rest = [...fragen]
  const ergebnis: Frage[] = []

  while (rest.length > 0) {
    const letztes = ergebnis[ergebnis.length - 1]?.thema
    let index = rest.findIndex((f) => f.thema !== letztes)
    if (index === -1) index = 0
    ergebnis.push(rest.splice(index, 1)[0] as Frage)
  }

  return ergebnis
}

export function baueSession(w: SessionWunsch): Frage[] {
  const datum = w.datum ?? heute()
  const rng = w.rng ?? rngMitSeed(tagesSeed())
  const pool = w.fragen.filter((f) => passtZumFilter(f, w))

  if (w.anzahl <= 0 || pool.length === 0) return []

  if (w.nurFehler) {
    const fehler = pool
      .map((f) => ({ f, k: w.karten[f.id] }))
      .filter((x) => (x.k?.falsch ?? 0) > 0)
      // Häufigste Fehler und niedrigste Box zuerst.
      .sort((a, b) => (b.k?.falsch ?? 0) - (a.k?.falsch ?? 0) || (a.k?.box ?? 0) - (b.k?.box ?? 0))
      .map((x) => x.f)
    return entzerreThemen(fehler.slice(0, w.anzahl))
  }

  const genommen = new Set<string>()
  const nimm = (kandidaten: readonly Frage[], wieViele: number, geordnet = false): Frage[] => {
    if (wieViele <= 0) return []
    const frei = kandidaten.filter((f) => !genommen.has(f.id))
    const gewaehlt = (geordnet ? frei : mische(rng, frei)).slice(0, wieViele)
    for (const f of gewaehlt) genommen.add(f.id)
    return gewaehlt
  }

  const faellig = pool.filter((f) => {
    const k = w.karten[f.id]
    return k !== undefined && !istNeu(k) && istFaellig(k, datum)
  })
  const schwach =
    w.schwaechstesThema === undefined ? [] : pool.filter((f) => f.thema === w.schwaechstesThema)
  // Neue Fragen: leichte zuerst, schwere erst in Themen, die schon sitzen.
  const neu = mische(
    rng,
    pool.filter((f) => {
      const k = w.karten[f.id]
      const istNeueFrage = k === undefined || istNeu(k)
      return istNeueFrage && (f.schwierigkeit < 3 || bereitFuerSchwer(f.thema, w.fragen, w.karten))
    }),
  ).sort((a, b) => a.schwierigkeit - b.schwierigkeit)

  const anzahlFaellig = Math.round(w.anzahl * ANTEIL_FAELLIG)
  const anzahlSchwach = Math.round(w.anzahl * ANTEIL_SCHWACH)

  const auswahl = [
    ...nimm(faellig, anzahlFaellig),
    ...nimm(schwach, anzahlSchwach),
    ...nimm(neu, w.anzahl - anzahlFaellig - anzahlSchwach, true),
  ]

  // Ist ein Korb zu klein gewesen, wird aus dem restlichen Pool aufgefüllt:
  // eine kurze Sitzung ist besser als eine halb leere.
  // Zuerst mit den geordneten neuen Fragen auffüllen (leichte zuerst, schwere
  // nur in sicheren Themen) — sonst kämen am Anfang, wenn noch nichts fällig
  // ist, doch wieder zufällig schwere Fragen dazu.
  const ziel = Math.min(w.anzahl, pool.length)
  if (auswahl.length < ziel) auswahl.push(...nimm(neu, ziel - auswahl.length, true))
  if (auswahl.length < ziel) auswahl.push(...nimm(pool, ziel - auswahl.length))

  return entzerreThemen(auswahl)
}

/**
 * Fragenauswahl für eine Prüfungssimulation: reihum aus den Themen, gemischte Schwierigkeit.
 * Ohne Themenliste wird nach dem Bereich der Frage gefiltert.
 */
export function bauePruefung(
  fragen: readonly Frage[],
  bereich: BereichId,
  anzahl: number,
  rng: Rng = rngMitSeed(Date.now() % 2_147_483_647),
  themen?: readonly ThemaId[],
): Frage[] {
  const pool = themen === undefined ? fragen.filter((f) => f.bereich === bereich) : fragen.filter((f) => themen.includes(f.thema))
  const nachThema = new Map<ThemaId, Frage[]>()
  for (const f of mische(rng, pool)) {
    const liste = nachThema.get(f.thema) ?? []
    liste.push(f)
    nachThema.set(f.thema, liste)
  }

  // Reihum aus jedem Thema ziehen, damit kein Thema die Prüfung dominiert.
  const auswahl: Frage[] = []
  let leer = false
  while (auswahl.length < anzahl && !leer) {
    leer = true
    for (const liste of nachThema.values()) {
      const f = liste.pop()
      if (f !== undefined) {
        auswahl.push(f)
        leer = false
        if (auswahl.length === anzahl) break
      }
    }
  }

  return entzerreThemen(auswahl)
}
