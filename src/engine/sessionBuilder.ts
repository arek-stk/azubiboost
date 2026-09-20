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
  const nimm = (kandidaten: readonly Frage[], wieViele: number): Frage[] => {
    if (wieViele <= 0) return []
    const frei = kandidaten.filter((f) => !genommen.has(f.id))
    const gewaehlt = mische(rng, frei).slice(0, wieViele)
    for (const f of gewaehlt) genommen.add(f.id)
    return gewaehlt
  }

  const faellig = pool.filter((f) => {
    const k = w.karten[f.id]
    return k !== undefined && !istNeu(k) && istFaellig(k, datum)
  })
  const schwach =
    w.schwaechstesThema === undefined ? [] : pool.filter((f) => f.thema === w.schwaechstesThema)
  const neu = pool.filter((f) => {
    const k = w.karten[f.id]
    return k === undefined || istNeu(k)
  })

  const anzahlFaellig = Math.round(w.anzahl * ANTEIL_FAELLIG)
  const anzahlSchwach = Math.round(w.anzahl * ANTEIL_SCHWACH)

  const auswahl = [
    ...nimm(faellig, anzahlFaellig),
    ...nimm(schwach, anzahlSchwach),
    ...nimm(neu, w.anzahl - anzahlFaellig - anzahlSchwach),
  ]

  // Ist ein Korb zu klein gewesen, wird aus dem restlichen Pool aufgefüllt:
  // eine kurze Sitzung ist besser als eine halb leere.
  if (auswahl.length < Math.min(w.anzahl, pool.length)) {
    auswahl.push(...nimm(pool, Math.min(w.anzahl, pool.length) - auswahl.length))
  }

  return entzerreThemen(auswahl)
}

/** Fragenauswahl für eine Prüfungssimulation: quer durch den Bereich, gemischte Schwierigkeit. */
export function bauePruefung(
  fragen: readonly Frage[],
  bereich: BereichId,
  anzahl: number,
  rng: Rng = rngMitSeed(Date.now() % 2_147_483_647),
): Frage[] {
  const pool = fragen.filter((f) => f.bereich === bereich)
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
