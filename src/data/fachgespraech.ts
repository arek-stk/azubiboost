/**
 * Fachgespräch in der Wahlqualifikation (§ 28 VerkEHKflAusbV).
 * Der Prüfungsausschuss legt zwei praxisbezogene Aufgaben vor, der Prüfling wählt
 * eine, bereitet sich 15 Minuten vor und führt dann ein Gespräch von höchstens
 * 20 Minuten. Außerdem kann nach dem Warenbereich gefragt werden, der im
 * Ausbildungsnachweis dokumentiert ist. Die Aufgaben hier sind eigene Übungsfälle,
 * keine IHK-Aufgaben. Situationen und Prüferfragen stehen in der Sie-Form, wie in
 * der echten Prüfung.
 */

export type Fachaufgabe = { titel: string; situation: string; leitfragen: string[] }
export type Wahlqualifikation = { id: string; name: string; aufgaben: Fachaufgabe[] }

export const LEITFADEN = [
  { schritt: 'Situation', frage: 'Worum geht es? Fasse den Fall in zwei Sätzen mit eigenen Worten zusammen.' },
  { schritt: 'Ziel', frage: 'Was soll am Ende erreicht sein? Denk an die Kunden, den Markt und das Team.' },
  { schritt: 'Vorgehen', frage: 'Welche Schritte gehst du in welcher Reihenfolge? Wer ist beteiligt?' },
  { schritt: 'Begründung', frage: 'Warum gehst du so vor? Nenne Zahlen, Vorschriften oder Erfahrungen aus deinem Betrieb.' },
  { schritt: 'Alternativen', frage: 'Welchen anderen Weg gäbe es? Warum hast du dich dagegen entschieden?' },
  { schritt: 'Kontrolle', frage: 'Woran erkennst du, ob es funktioniert hat? Welche Kennzahl schaust du dir an?' },
]

export const WAHLQUALIFIKATIONEN: Wahlqualifikation[] = [
  {
    id: 'beratung-komplex',
    name: 'Beratung von Kunden in komplexen Situationen',
    aufgaben: [
      {
        titel: 'Allergiker an der Frischetheke',
        situation:
          'Sie arbeiten an der Käsetheke. Eine Kundin mit Nussallergie möchte für eine Feier eine Käseplatte zusammenstellen. Sie fragt, in welchen Produkten Nüsse oder Spuren davon enthalten sein können.',
        leitfragen: [
          'Welche Informationen brauchen Sie zuerst von der Kundin?',
          'Wo finden Sie bei loser Ware verlässliche Angaben zu Allergenen?',
          'Wie reagieren Sie, wenn Sie sich bei einem Produkt nicht sicher sind?',
        ],
      },
      {
        titel: 'Unentschlossener Kunde beim Wein',
        situation:
          'Ein Kunde sucht in der Weinabteilung ein Geschenk für seinen Chef. Er kennt sich mit Wein nicht aus und hat Sorge, etwas Falsches zu kaufen.',
        leitfragen: [
          'Mit welchen Fragen ermitteln Sie den Bedarf des Kunden?',
          'Wie argumentieren Sie mit dem Nutzen, ohne Fachbegriffe zu verwenden?',
          'Wie führen Sie den Kunden zu einer Entscheidung, ohne ihn zu drängen?',
        ],
      },
      {
        titel: 'Reklamation mit Vorgeschichte',
        situation:
          'Ein Stammkunde reklamiert an der Kasse zum dritten Mal in diesem Monat, dass sein Brot vom Vortag ist. Er wird laut, hinter ihm warten weitere Kunden.',
        leitfragen: [
          'Wie beruhigen Sie die Situation?',
          'Welche Rechte hat der Kunde in diesem Fall?',
          'Was unternehmen Sie, damit es nicht ein viertes Mal passiert?',
        ],
      },
    ],
  },
  {
    id: 'beschaffung',
    name: 'Beschaffung von Waren',
    aufgaben: [
      {
        titel: 'Neuer Lieferant für regionales Obst',
        situation:
          'Ihr Markt möchte mehr Äpfel aus der Region anbieten. Zwei Obsthöfe haben Angebote geschickt. Hof A ist günstiger, Hof B ist teurer, gilt aber als zuverlässiger.',
        leitfragen: [
          'Welche Kriterien vergleichen Sie neben dem Preis?',
          'Wie bauen Sie eine Entscheidungsbewertungstabelle auf?',
          'Welche Risiken sehen Sie beim günstigeren Anbieter?',
        ],
      },
      {
        titel: 'Lieferung kommt nicht',
        situation:
          'Für das Wochenende ist eine Aktion beworben. Es ist Donnerstag, und die Aktionsware ist noch nicht eingetroffen, obwohl der Liefertermin fest vereinbart war.',
        leitfragen: [
          'Welche Rechte hat der Markt bei einem Lieferungsverzug?',
          'Was tun Sie kurzfristig, damit die Aktion am Wochenende stattfinden kann?',
          'Welche Konsequenzen ziehen Sie für künftige Bestellungen?',
        ],
      },
    ],
  },
  {
    id: 'warenbestand',
    name: 'Warenbestandssteuerung',
    aufgaben: [
      {
        titel: 'Hohe Abschriften bei Molkereiprodukten',
        situation:
          'Im Kühlregal werden jede Woche viele Joghurts abgeschrieben, weil das MHD abgelaufen ist. Die Abschriften in der Warengruppe liegen deutlich über dem Vorjahr.',
        leitfragen: [
          'Wie finden Sie die Ursache heraus?',
          'Welche Kennzahlen ziehen Sie heran?',
          'Mit welchen Maßnahmen senken Sie die Abschriften?',
        ],
      },
      {
        titel: 'Inventurdifferenz in der Drogerie',
        situation: 'Die Inventur zeigt in der Drogerieabteilung eine deutlich höhere Inventurdifferenz als im Vorjahr.',
        leitfragen: [
          'Welche Ursachen kommen infrage?',
          'Wie grenzen Sie die Ursache ein?',
          'Welche Maßnahmen schlagen Sie vor, und was kosten sie?',
        ],
      },
    ],
  },
  {
    id: 'kaufm-steuerung',
    name: 'Kaufmännische Steuerung und Kontrolle',
    aufgaben: [
      {
        titel: 'Personalkosten zu hoch',
        situation:
          'Im letzten Quartal ist der Umsatz je Mitarbeiterstunde gesunken, gleichzeitig sind die Personalkosten gestiegen. Die Marktleitung bittet Sie um eine Analyse.',
        leitfragen: [
          'Welche Zahlen sehen Sie sich im Einzelnen an?',
          'Wie passen Sie die Einsatzplanung an die Kundenfrequenz an?',
          'Wie sprechen Sie das Thema im Team an?',
        ],
      },
      {
        titel: 'Aktionsartikel ohne Gewinn',
        situation: 'Ein Artikel aus der Wochenwerbung verkauft sich sehr gut, bringt aber keinen Deckungsbeitrag.',
        leitfragen: [
          'Warum kann sich die Aktion trotzdem lohnen?',
          'Woran messen Sie den Erfolg der Aktion?',
          'Unter welchen Umständen würden Sie die Aktion nicht wiederholen?',
        ],
      },
    ],
  },
  {
    id: 'marketing',
    name: 'Marketingmaßnahmen',
    aufgaben: [
      {
        titel: 'Grillsaison vorbereiten',
        situation: 'Ihr Markt möchte in der Grillsaison mehr junge Kunden gewinnen. Das Werbebudget ist klein.',
        leitfragen: [
          'Welche Zielgruppe sprechen Sie wie an?',
          'Welche Maßnahmen planen Sie im Markt und außerhalb?',
          'Wie überprüfen Sie den Erfolg?',
        ],
      },
      {
        titel: 'Neuer Wettbewerber',
        situation:
          'In 300 Metern Entfernung eröffnet ein Discounter. Die Marktleitung bittet Sie um Vorschläge, wie der Markt darauf reagieren soll.',
        leitfragen: [
          'Worin ist Ihr Markt stärker als der Discounter?',
          'Welche Instrumente des Marketing-Mix setzen Sie ein?',
          'Von welchen Reaktionen raten Sie ab?',
        ],
      },
    ],
  },
  {
    id: 'onlinehandel',
    name: 'Onlinehandel',
    aufgaben: [
      {
        titel: 'Click & Collect einführen',
        situation: 'Ihr Markt möchte Online-Bestellungen anbieten, die die Kunden im Markt abholen (Click & Collect).',
        leitfragen: [
          'Welche Abläufe im Markt ändern sich dadurch?',
          'Welche rechtlichen Pflichten gelten beim Verkauf über das Internet?',
          'Wie gehen Sie vor, wenn bestellte Artikel fehlen?',
        ],
      },
      {
        titel: 'Schlechte Bewertungen',
        situation:
          'Im Onlineshop Ihres Marktes häufen sich Bewertungen mit einem Stern, weil Ware bei der Lieferung zerdrückt ankommt.',
        leitfragen: [
          'Wie antworten Sie öffentlich auf diese Bewertungen?',
          'An welcher Stelle im Ablauf entsteht der Schaden vermutlich?',
          'Woran messen Sie, ob sich die Lage verbessert?',
        ],
      },
    ],
  },
  {
    id: 'mitarbeiterfuehrung',
    name: 'Mitarbeiterführung und -entwicklung',
    aufgaben: [
      {
        titel: 'Neue Aushilfe einarbeiten',
        situation:
          'Nächste Woche fängt eine neue Aushilfe an. Sie wird an der Kasse und in der Obst- und Gemüseabteilung eingesetzt. Die Marktleitung überträgt Ihnen die Einarbeitung.',
        leitfragen: [
          'Wie planen Sie die ersten Arbeitstage?',
          'Welche Vorschriften muss die Aushilfe kennen?',
          'Wie geben Sie ihr Rückmeldung?',
        ],
      },
      {
        titel: 'Konflikt im Team',
        situation:
          'Zwei Kolleginnen streiten regelmäßig darüber, wer die Spätschichten übernimmt. Die Stimmung im Team leidet darunter.',
        leitfragen: [
          'Wie bereiten Sie das Gespräch mit den beiden vor?',
          'Welcher Führungsstil passt in dieser Situation?',
          'Wie sieht eine faire Lösung aus?',
        ],
      },
    ],
  },
  {
    id: 'selbststaendigkeit',
    name: 'Vorbereitung unternehmerischer Selbständigkeit',
    aufgaben: [
      {
        titel: 'Einen eigenen Markt übernehmen',
        situation: 'Sie überlegen, in einigen Jahren als selbstständige Kauffrau einen Lebensmittelmarkt zu übernehmen.',
        leitfragen: [
          'Welche Rechtsform kommt infrage, und warum?',
          'Welche Zahlen brauchen Sie für den Businessplan?',
          'Gegen welche Risiken müssen Sie sich absichern?',
        ],
      },
      {
        titel: 'Standort prüfen',
        situation:
          'Für einen eigenen Markt stehen zwei Standorte zur Auswahl: einer in der Innenstadt und einer in einem Neubaugebiet am Stadtrand.',
        leitfragen: [
          'Welche Standortfaktoren vergleichen Sie?',
          'Welche Daten brauchen Sie dafür, und woher bekommen Sie sie?',
          'Wie treffen Sie am Ende die Entscheidung?',
        ],
      },
    ],
  },
]
