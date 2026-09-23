/**
 * Datentypen der Lern-App. Bewusst frei von React und vom Browser —
 * alles hier ist rein und testbar.
 */

/** Die vier schriftlichen Prüfungsbereiche, zu denen es Fragen gibt. */
export type BereichId = 'verkauf' | 'warenwirtschaft' | 'wiso' | 'geschaeftsprozesse'

/** Zusätzlich zur Gewichtung zählt das mündliche Fachgespräch mit. */
export type GewichtungsId = BereichId | 'fachgespraech'

export type PruefungsTeil = 1 | 2

export type ThemaId =
  // Verkauf und Werbemaßnahmen
  | 'verkaufsgespraech'
  | 'kundenkommunikation'
  | 'warenpraesentation'
  | 'kasse'
  // Warenwirtschaft und Kalkulation
  | 'warenannahme'
  | 'bestandsfuehrung'
  | 'beschaffung'
  | 'kalkulation'
  | 'lagerkennzahlen'
  // Wirtschafts- und Sozialkunde
  | 'kaufvertrag'
  | 'wirtschaftsordnung'
  | 'arbeitsrecht'
  | 'arbeitsschutz'
  // Geschäftsprozesse im Einzelhandel
  | 'geschaeftsprozesse'

export type Schwierigkeit = 1 | 2 | 3

export type Fragetyp = 'single' | 'multi' | 'zahl'

/** Lösung einer Rechenaufgabe: Zielwert mit erlaubter Abweichung. */
export type ZahlLoesung = {
  wert: number
  /** Erlaubte absolute Abweichung, z. B. 0.01 bei Eurobeträgen. */
  toleranz: number
  einheit: string
}

export type RechenSchritt = {
  label: string
  rechnung: string
  ergebnis: string
  hinweis?: string
  /** Erlaubte Abweichung beim Eintippen im geführten Modus; sonst aus der Anzeige abgeleitet. */
  toleranz?: number
}

export type Frage = {
  /** Stabil und niemals neu belegt — Schlüssel des gespeicherten Lernfortschritts. */
  id: string
  thema: ThemaId
  bereich: BereichId
  typ: Fragetyp
  frage: string
  /** Bei 'single' und 'multi' gefüllt, bei 'zahl' leer. */
  optionen?: string[]
  loesung: number | number[] | ZahlLoesung
  /** Pflicht. Erst in Alltagssprache erklären, dann der Fachbegriff. */
  erklaerung: string
  merksatz?: string
  /** Bei 'zahl' Pflicht: der vollständige Weg, nicht nur das Ergebnis. */
  rechenweg?: RechenSchritt[]
  rechtsbezug?: string
  schwierigkeit: Schwierigkeit
}

export type Antwort =
  | { typ: 'single'; gewaehlt: number | null }
  | { typ: 'multi'; gewaehlt: number[] }
  | { typ: 'zahl'; eingabe: number | null }

export type Bewertet = {
  frageId: string
  thema: ThemaId
  bereich: BereichId
  richtig: boolean
  antwort: Antwort
}

/** Leitner-Karte pro Frage. Box 0 = noch nie gesehen. */
export type Kartenstand = {
  frageId: string
  box: number
  /** ISO-Datum (YYYY-MM-DD), an dem die Frage wieder dran ist. */
  faelligAm: string
  richtig: number
  falsch: number
  zuletztAm: string | null
}

export type VersuchArt = 'quiz' | 'rechnen' | 'simulation'

export type Versuch = {
  id: string
  art: VersuchArt
  /** Bei einer Bereichs-Simulation gesetzt. */
  bereich?: BereichId
  begonnenAm: string
  beendetAm: string
  ergebnisse: Bewertet[]
  /** Erreichte Punkte auf der 100er-Skala der IHK. */
  punkte: number
  /** Nur bei Simulation: ob die Zeit abgelaufen ist. */
  zeitAbgelaufen?: boolean
}
