/**
 * Lernpfad fürs Rechnen: erst leicht, dann schwerer.
 *
 * Die Aufgabentypen sind in vier Stufen geordnet. Ein Typ gilt als gemeistert,
 * wenn er oft genug OHNE Hilfe richtig gelöst wurde — mit Hilfe durchgerechnete
 * Aufgaben zählen bewusst nicht, damit „gemeistert" wirklich „kann ich allein"
 * heißt. Gesperrt wird nichts: der Pfad empfiehlt, sie darf aber alles öffnen.
 */

import type { AufgabentypId } from './rechenaufgaben'

export type Stufe = { nr: 1 | 2 | 3 | 4; name: string; beschreibung: string; typen: readonly AufgabentypId[] }

export const STUFEN: readonly Stufe[] = [
  {
    nr: 1,
    name: 'Grundlagen',
    beschreibung: 'Prozent, Aufschlag, Rabatt, Steuer und Runden — mit einfachen Zahlen.',
    typen: ['g-prozentwert', 'g-prozentsatz', 'g-aufschlag', 'g-abzug', 'g-herausrechnen', 'g-runden'],
  },
  {
    nr: 2,
    name: 'Einstieg',
    beschreibung: 'Die ersten echten Prüfungsaufgaben — kurz, mit wenigen Schritten.',
    typen: ['dreisatz', 'umsatzsteuer', 'grundpreis', 'meldebestand', 'prozentveraenderung', 'bezugspreis', 'verkaufspreis'],
  },
  {
    nr: 3,
    name: 'Sicher werden',
    beschreibung: 'Mehr Schritte und mehr Überlegen, aber nichts Neues mehr.',
    typen: [
      'differenz',
      'handelsspanne',
      'rueckwaerts',
      'inventurdifferenz',
      'lagerkennzahlen',
      'handlungskostensatz',
      'break-even',
      'rentabilitaet',
    ],
  },
  {
    nr: 4,
    name: 'Prüfungsniveau',
    beschreibung: 'Die schwierigsten Rechnungen aus Teil 2.',
    typen: ['verkaufspreis-komplett', 'lagerzinsen', 'skontovergleich'],
  },
]

export function meisterSchwelle(id: AufgabentypId): number {
  return id.startsWith('g-') ? 2 : 3
}

export type KnotenStand = {
  typId: AufgabentypId
  stufe: Stufe['nr']
  richtig: number
  schwelle: number
  gemeistert: boolean
  jetztDran: boolean
}

export type PfadStand = {
  knoten: KnotenStand[]
  /** Der nächste nicht gemeisterte Typ in Pfadreihenfolge; null, wenn alles sitzt. */
  naechster: AufgabentypId | null
  aktuelleStufe: Stufe['nr']
  gemeistert: number
  gesamt: number
}

export function lernpfad(richtigJeTyp: Partial<Record<AufgabentypId, { richtig: number }>>): PfadStand {
  const roh = STUFEN.flatMap((s) =>
    s.typen.map((typId) => {
      const richtig = richtigJeTyp[typId]?.richtig ?? 0
      const schwelle = meisterSchwelle(typId)
      return { typId, stufe: s.nr, richtig, schwelle, gemeistert: richtig >= schwelle }
    }),
  )
  const naechster = roh.find((k) => !k.gemeistert)?.typId ?? null
  const knoten = roh.map((k) => ({ ...k, jetztDran: k.typId === naechster }))
  const aktuelleStufe = knoten.find((k) => k.jetztDran)?.stufe ?? 4
  return {
    knoten,
    naechster,
    aktuelleStufe,
    gemeistert: knoten.filter((k) => k.gemeistert).length,
    gesamt: knoten.length,
  }
}
