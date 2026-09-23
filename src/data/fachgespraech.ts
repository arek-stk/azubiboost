/**
 * Fachgespräch in der Wahlqualifikation (§ 28 VerkEHKflAusbV).
 * Der Prüfungsausschuss legt zwei praxisbezogene Aufgaben vor, der Prüfling wählt
 * eine, bereitet sich 15 Minuten vor und führt dann ein Gespräch von höchstens
 * 20 Minuten. Die Aufgaben hier sind eigene Übungsfälle, keine IHK-Aufgaben.
 */

export type Fachaufgabe = { titel: string; situation: string; leitfragen: string[] }
export type Wahlqualifikation = { id: string; name: string; aufgaben: Fachaufgabe[] }

export const LEITFADEN = [
  { schritt: 'Situation', frage: 'Was ist los? Fasse den Fall in zwei Sätzen mit eigenen Worten zusammen.' },
  { schritt: 'Ziel', frage: 'Was soll am Ende erreicht sein — für Kunden, Markt und Team?' },
  { schritt: 'Vorgehen', frage: 'Welche Schritte gehst du in welcher Reihenfolge? Wer ist beteiligt?' },
  { schritt: 'Begründung', frage: 'Warum genau so? Nenne Zahlen, Regeln oder Erfahrungen aus deinem Betrieb.' },
  { schritt: 'Alternativen', frage: 'Was wäre ein anderer Weg — und warum hast du dich dagegen entschieden?' },
  { schritt: 'Kontrolle', frage: 'Woran merkst du, ob es funktioniert hat? Welche Kennzahl schaust du dir an?' },
]

export const WAHLQUALIFIKATIONEN: Wahlqualifikation[] = [
  {
    id: 'beratung-komplex',
    name: 'Beratung von Kunden in komplexen Situationen',
    aufgaben: [
      {
        titel: 'Allergiker an der Frischetheke',
        situation: 'Eine Kundin mit Nussallergie möchte für eine Feier eine Käseplatte zusammenstellen und fragt nach verborgenen Allergenen.',
        leitfragen: ['Welche Informationen brauchst du zuerst?', 'Wo findest du verlässliche Allergenangaben bei loser Ware?', 'Was tust du, wenn du dir nicht sicher bist?'],
      },
      {
        titel: 'Unentschlossener Kunde beim Wein',
        situation: 'Ein Kunde sucht einen Wein als Geschenk für seinen Chef, kennt sich nicht aus und hat Angst, etwas falsch zu machen.',
        leitfragen: ['Mit welchen Fragen ermittelst du den Bedarf?', 'Wie argumentierst du mit dem Nutzen statt mit Fachbegriffen?', 'Wie bringst du ihn zur Entscheidung, ohne zu drängen?'],
      },
      {
        titel: 'Reklamation mit Vorgeschichte',
        situation: 'Ein Stammkunde reklamiert zum dritten Mal in einem Monat Brot vom Vortag und wird an der Kasse laut.',
        leitfragen: ['Wie beruhigst du die Situation?', 'Welche Rechte hat der Kunde?', 'Wie verhinderst du, dass es ein viertes Mal passiert?'],
      },
    ],
  },
  {
    id: 'beschaffung',
    name: 'Beschaffung von Waren',
    aufgaben: [
      {
        titel: 'Neuer Lieferant für regionales Obst',
        situation: 'Der Markt möchte mehr regionale Äpfel anbieten. Zwei Höfe haben Angebote geschickt, einer billiger, einer zuverlässiger.',
        leitfragen: ['Welche Kriterien vergleichst du außer dem Preis?', 'Wie baust du eine Entscheidungsbewertungstabelle auf?', 'Welche Risiken hat der günstigere Anbieter?'],
      },
      {
        titel: 'Lieferung kommt nicht',
        situation: 'Die Aktionsware für das Wochenende ist am Donnerstag noch nicht da, obwohl der Termin fest vereinbart war.',
        leitfragen: ['Welche Rechte hat der Markt beim Lieferungsverzug?', 'Was tust du kurzfristig für das Wochenende?', 'Was änderst du für die Zukunft?'],
      },
    ],
  },
  {
    id: 'warenbestand',
    name: 'Warenbestandssteuerung',
    aufgaben: [
      {
        titel: 'Hohe Abschriften bei Molkereiprodukten',
        situation: 'Im Kühlregal werden jede Woche viele Joghurts wegen abgelaufenem MHD abgeschrieben.',
        leitfragen: ['Wie findest du die Ursache?', 'Welche Kennzahlen ziehst du heran?', 'Welche Maßnahmen senken die Abschriften?'],
      },
      {
        titel: 'Inventurdifferenz in der Drogerie',
        situation: 'Die Inventur zeigt in der Drogerieabteilung eine deutlich höhere Differenz als im Vorjahr.',
        leitfragen: ['Welche Ursachen kommen infrage?', 'Wie grenzt du die Ursache ein?', 'Welche Maßnahmen schlägst du vor und was kosten sie?'],
      },
    ],
  },
  {
    id: 'kaufm-steuerung',
    name: 'Kaufmännische Steuerung und Kontrolle',
    aufgaben: [
      {
        titel: 'Personalkosten zu hoch',
        situation: 'Der Umsatz je Mitarbeiterstunde ist im letzten Quartal gesunken, die Personalkosten sind gestiegen.',
        leitfragen: ['Welche Zahlen schaust du dir genau an?', 'Wie passt du die Einsatzplanung an die Kundenfrequenz an?', 'Wie redest du mit dem Team darüber?'],
      },
      {
        titel: 'Aktionsartikel ohne Gewinn',
        situation: 'Ein beworbener Artikel verkauft sich gut, bringt aber keinen Deckungsbeitrag.',
        leitfragen: ['Warum kann sich die Aktion trotzdem lohnen?', 'Wie misst du den Erfolg der Aktion?', 'Wann würdest du sie nicht wiederholen?'],
      },
    ],
  },
  {
    id: 'marketing',
    name: 'Marketingmaßnahmen',
    aufgaben: [
      {
        titel: 'Grillsaison vorbereiten',
        situation: 'Der Markt will in der Grillsaison mehr junge Kunden gewinnen und hat ein kleines Werbebudget.',
        leitfragen: ['Welche Zielgruppe sprichst du wie an?', 'Welche Maßnahmen im Laden und außerhalb planst du?', 'Wie überprüfst du den Erfolg?'],
      },
      {
        titel: 'Neuer Wettbewerber',
        situation: 'Ein Discounter eröffnet 300 Meter entfernt. Die Filialleitung fragt nach Ideen.',
        leitfragen: ['Wo ist dein Markt stärker als der Discounter?', 'Welche Instrumente des Marketing-Mix setzt du ein?', 'Was solltest du nicht tun?'],
      },
    ],
  },
  {
    id: 'onlinehandel',
    name: 'Onlinehandel',
    aufgaben: [
      {
        titel: 'Click & Collect einführen',
        situation: 'Der Markt möchte Online-Bestellungen zur Abholung anbieten.',
        leitfragen: ['Welche Abläufe im Markt ändern sich?', 'Welche rechtlichen Pflichten gelten beim Onlinekauf?', 'Wie gehst du mit fehlenden Artikeln um?'],
      },
      {
        titel: 'Schlechte Bewertungen',
        situation: 'Im Onlineshop häufen sich Ein-Stern-Bewertungen wegen zerdrückter Ware bei der Lieferung.',
        leitfragen: ['Wie antwortest du öffentlich auf die Bewertungen?', 'Wo im Ablauf entsteht der Schaden vermutlich?', 'Wie misst du, ob es besser wird?'],
      },
    ],
  },
  {
    id: 'mitarbeiterfuehrung',
    name: 'Mitarbeiterführung und -entwicklung',
    aufgaben: [
      {
        titel: 'Neue Aushilfe einarbeiten',
        situation: 'Eine neue Aushilfe beginnt nächste Woche an der Kasse und im Obst- und Gemüsebereich.',
        leitfragen: ['Wie planst du die ersten Tage?', 'Welche Vorschriften muss sie kennen?', 'Wie gibst du Rückmeldung?'],
      },
      {
        titel: 'Konflikt im Team',
        situation: 'Zwei Kolleginnen streiten sich regelmäßig über die Verteilung der Spätschichten.',
        leitfragen: ['Wie bereitest du das Gespräch vor?', 'Welcher Führungsstil passt hier?', 'Wie sieht eine faire Lösung aus?'],
      },
    ],
  },
  {
    id: 'selbststaendigkeit',
    name: 'Vorbereitung unternehmerischer Selbständigkeit',
    aufgaben: [
      {
        titel: 'Einen eigenen Markt übernehmen',
        situation: 'Du überlegst, in einigen Jahren einen eigenen Lebensmittelmarkt zu übernehmen.',
        leitfragen: ['Welche Rechtsform kommt infrage und warum?', 'Welche Zahlen brauchst du für den Businessplan?', 'Welche Risiken musst du absichern?'],
      },
      {
        titel: 'Standort prüfen',
        situation: 'Für einen möglichen eigenen Markt stehen zwei Standorte zur Wahl: Innenstadt oder Neubaugebiet am Stadtrand.',
        leitfragen: ['Welche Standortfaktoren vergleichst du?', 'Welche Daten brauchst du dafür und woher bekommst du sie?', 'Wie triffst du am Ende die Entscheidung?'],
      },
    ],
  },
]
