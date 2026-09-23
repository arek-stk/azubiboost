/**
 * Die Lernthemen der App, jeweils einem Prüfungsbereich zugeordnet.
 *
 * Ein Thema ist die Einheit, in der gelernt und ausgewertet wird; der
 * Prüfungsbereich ist die Einheit, in der die IHK prüft und gewichtet.
 * Dieselbe Frage taucht deshalb im Themen-Quiz und in der Bereichs-Simulation auf.
 */

import type { BereichId, ThemaId } from './types'

export type Thema = {
  id: ThemaId
  name: string
  bereich: BereichId
  /** Ein Satz, der erklärt, worum es geht — erscheint über der Themenliste. */
  worumGehts: string
  /** true bei Themen, in denen mit Stift und Papier gerechnet wird. */
  rechenthema: boolean
}

export const THEMEN: readonly Thema[] = [
  // --- Verkauf und Werbemaßnahmen -----------------------------------------
  {
    id: 'verkaufsgespraech',
    name: 'Verkaufsgespräch und Beratung',
    bereich: 'verkauf',
    worumGehts: 'Wie ein Verkaufsgespräch aufgebaut ist und wie du Kunden wirklich berätst.',
    rechenthema: false,
  },
  {
    id: 'kundenkommunikation',
    name: 'Kundenkommunikation und Reklamation',
    bereich: 'verkauf',
    worumGehts: 'Einwände, Beschwerden und Reklamationen so lösen, dass der Kunde wiederkommt.',
    rechenthema: false,
  },
  {
    id: 'warenpraesentation',
    name: 'Warenpräsentation und Werbung',
    bereich: 'verkauf',
    worumGehts: 'Wo Ware im Regal hingehört, warum das wirkt und wie Werbung im Laden funktioniert.',
    rechenthema: false,
  },
  {
    id: 'kasse',
    name: 'Kasse und Zahlungsverkehr',
    bereich: 'verkauf',
    worumGehts: 'Zahlungsarten, Kassenvorschriften, Kassendifferenzen und der Bon.',
    rechenthema: true,
  },

  // --- Warenwirtschaft und Kalkulation ------------------------------------
  {
    id: 'warenannahme',
    name: 'Warenannahme und Lagerung',
    bereich: 'warenwirtschaft',
    worumGehts: 'Ware annehmen, kontrollieren, richtig lagern — und was bei Mängeln zu tun ist.',
    rechenthema: false,
  },
  {
    id: 'bestandsfuehrung',
    name: 'Bestandsführung und Inventur',
    bereich: 'warenwirtschaft',
    worumGehts: 'Wie der Bestand im System mit dem Regal übereinstimmt und was Inventur bringt.',
    rechenthema: true,
  },
  {
    id: 'beschaffung',
    name: 'Beschaffung und Disposition',
    bereich: 'warenwirtschaft',
    worumGehts: 'Wann und wie viel bestellt wird, damit nichts fehlt und nichts verdirbt.',
    rechenthema: true,
  },
  {
    id: 'kalkulation',
    name: 'Kalkulation und Preisbildung',
    bereich: 'warenwirtschaft',
    worumGehts: 'Vom Listenpreis des Lieferanten bis zum Preis am Regal — Schritt für Schritt.',
    rechenthema: true,
  },
  {
    id: 'lagerkennzahlen',
    name: 'Lagerkennzahlen',
    bereich: 'warenwirtschaft',
    worumGehts: 'Umschlagshäufigkeit, Lagerdauer, Lagerzinsen: was die Zahlen über den Laden sagen.',
    rechenthema: true,
  },

  // --- Wirtschafts- und Sozialkunde ---------------------------------------
  {
    id: 'kaufvertrag',
    name: 'Kaufvertrag und Verkaufsrecht',
    bereich: 'wiso',
    worumGehts: 'Wie ein Kaufvertrag entsteht, was schiefgehen kann und welche Rechte gelten.',
    rechenthema: false,
  },
  {
    id: 'wirtschaftsordnung',
    name: 'Wirtschaftsordnung und Markt',
    bereich: 'wiso',
    worumGehts: 'Angebot und Nachfrage, Marktformen und wie der Einzelhandel darin steht.',
    rechenthema: false,
  },
  {
    id: 'arbeitsrecht',
    name: 'Arbeits- und Ausbildungsrecht',
    bereich: 'wiso',
    worumGehts: 'Ausbildungsvertrag, Arbeitszeit, Kündigung, Mitbestimmung — deine Rechte im Betrieb.',
    rechenthema: false,
  },
  {
    id: 'arbeitsschutz',
    name: 'Arbeitsschutz, Hygiene und Nachhaltigkeit',
    bereich: 'wiso',
    worumGehts: 'Sicher arbeiten, Lebensmittel sicher behandeln, Abfall und Energie im Griff haben.',
    rechenthema: false,
  },

  // --- Geschäftsprozesse im Einzelhandel ----------------------------------
  {
    id: 'geschaeftsprozesse',
    name: 'Sortiment, Marketing, Personal und Steuerung',
    bereich: 'geschaeftsprozesse',
    worumGehts:
      'Der Prüfungsbereich aus Teil 2: Sortiment gestalten, Marketing planen, Personal einsetzen, mit Zahlen steuern.',
    rechenthema: true,
  },
] as const

export function thema(id: ThemaId): Thema {
  const gefunden = THEMEN.find((t) => t.id === id)
  if (!gefunden) throw new Error(`Unbekanntes Thema: ${id}`)
  return gefunden
}

export function themenVonBereich(b: BereichId): readonly Thema[] {
  return THEMEN.filter((t) => t.bereich === b)
}

/**
 * Aus welchen Themen eine Prüfungssimulation zieht. Das ist nicht dasselbe wie
 * die Zuordnung oben: der Prüfungsbereich Geschäftsprozesse etwa verlangt
 * Aufgaben aus mindestens zwei der Gebiete Einkauf, Sortimentsgestaltung,
 * Logistik und Verkauf (§ 27 Abs. 2 VerkEHKflAusbV) — dazu gehört auch
 * Kalkulation. Und Verkauf und Werbemaßnahmen prüft ausdrücklich auch
 * verkaufsrelevante Rechtsvorschriften (§ 22).
 */
export const PRUEFUNGSTHEMEN: Record<BereichId, readonly ThemaId[]> = {
  verkauf: ['verkaufsgespraech', 'kundenkommunikation', 'warenpraesentation', 'kasse', 'kaufvertrag'],
  warenwirtschaft: ['warenannahme', 'bestandsfuehrung', 'beschaffung', 'kalkulation', 'lagerkennzahlen'],
  wiso: ['kaufvertrag', 'wirtschaftsordnung', 'arbeitsrecht', 'arbeitsschutz'],
  geschaeftsprozesse: [
    'geschaeftsprozesse',
    'beschaffung',
    'kalkulation',
    'lagerkennzahlen',
    'bestandsfuehrung',
    'warenpraesentation',
  ],
}
