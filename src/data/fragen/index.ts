import type { Frage } from '../../domain/types'
import type { RechenAufgabe } from '../../engine/rechenaufgaben'
import { geschaeftsprozesse } from './geschaeftsprozesse'
import { kalkulation } from './kalkulation'

export const FRAGEN: readonly Frage[] = [...kalkulation, ...geschaeftsprozesse]

const nachId = new Map(FRAGEN.map((f) => [f.id, f]))

/**
 * Generierte Rechenaufgaben, die in eine Simulation eingemischt wurden. Sie
 * leben nur im Speicher dieser Sitzung — damit die Auswertung ihren Rechenweg
 * zeigen kann. Ins Leitner-System kommen sie nicht, ihre IDs sind nicht stabil.
 */
const generiert = new Map<string, Frage>()

export function frage(id: string): Frage | undefined {
  return nachId.get(id) ?? generiert.get(id)
}

export function istGeneriert(id: string): boolean {
  return id.startsWith('gen-')
}

export function alsFrage(a: RechenAufgabe, laufendeNummer: number, bereich: Frage['bereich']): Frage {
  const gegeben = a.gegeben.map((g) => `${g.label}: ${g.wert}`).join('\n')
  const f: Frage = {
    id: `gen-${a.typId}-${Date.now()}-${laufendeNummer}`,
    thema: a.thema,
    bereich,
    typ: 'zahl',
    frage: `${a.frage}\n\n${gegeben}`,
    loesung: a.loesung,
    rechenweg: a.rechenweg,
    erklaerung: `Formel: ${a.formel}`,
    schwierigkeit: a.schwierigkeit,
  }
  generiert.set(f.id, f)
  return f
}
