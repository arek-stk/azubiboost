import { schritt, themaFabrik } from './_fabrik'

const f = themaFabrik('bestandsfuehrung', 'warenwirtschaft')

export const bestandsfuehrung = [
  f.einfach(
    'bf-01',
    'Wie oft muss ein Kaufmann nach dem Handelsgesetzbuch mindestens eine Inventur machen?',
    ['Einmal im Quartal', 'Alle zwei Geschäftsjahre', 'Einmal im Geschäftsjahr', 'Nur bei der Geschäftsgründung'],
    2,
    'Nach § 240 HGB nimmt der Kaufmann seinen Bestand bei der Gründung auf und danach zum Schluss jedes Geschäftsjahres. Aus der Inventur entsteht das Inventar, und das ist die Grundlage für die Bilanz.',
    { rechtsbezug: '§ 240 HGB', schwierigkeit: 1 },
  ),
  f.einfach(
    'bf-02',
    'Was ist der Unterschied zwischen Inventur und Inventar?',
    [
      'Inventur ist das Zählen, Inventar ist die Bestandsliste',
      'Inventur ist die Bestandsliste, Inventar ist das Zählen',
      'Inventur erfasst die Waren, Inventar die Geschäftsausstattung',
      'Inventur erfasst das Vermögen, Inventar die Schulden',
    ],
    0,
    'Die Inventur ist die Tätigkeit: zählen, messen, wiegen. Dabei entsteht das Inventar, ein ausführliches Verzeichnis aller Vermögensteile und Schulden.',
    { merksatz: 'Inventur ist die Tätigkeit, Inventar das Ergebnis.', schwierigkeit: 1 },
  ),
  f.einfach(
    'bf-03',
    'Was kennzeichnet die permanente Inventur?',
    [
      'Alle Artikel werden am Bilanzstichtag gezählt',
      'Gezählt wird nur eine Stichprobe der Artikel',
      'Der Bestand wird laufend fortgeschrieben und über das Jahr verteilt gezählt',
      'Der Bestand wird laufend fortgeschrieben, gezählt wird nicht mehr',
    ],
    2,
    'Bei der permanenten Inventur führt das Warenwirtschaftssystem den Bestand laufend mit. Jeder Artikel muss trotzdem mindestens einmal im Geschäftsjahr gezählt werden, den Zeitpunkt kann der Markt selbst wählen. Dafür entfällt der große Zähltag zum Jahresende.',
  ),
  f.einfach(
    'bf-04',
    'In welchem Zeitraum darf eine verlegte Inventur stattfinden?',
    [
      'Bis zu 10 Tage vor oder nach dem Stichtag',
      'Bis zu 2 Monate vor oder 3 Monate nach dem Stichtag',
      'Zu jedem Zeitpunkt im Geschäftsjahr',
      'Bis zu 3 Monate vor oder 2 Monate nach dem Stichtag',
    ],
    3,
    'Die verlegte Inventur findet in einer ruhigeren Zeit statt, höchstens 3 Monate vor oder 2 Monate nach dem Bilanzstichtag. Der gezählte Bestand wird dann wertmäßig auf den Stichtag fortgeschrieben oder zurückgerechnet. Die 10 Tage gelten für die zeitnahe Stichtagsinventur.',
    { rechtsbezug: '§ 241 Abs. 3 HGB', schwierigkeit: 3 },
  ),
  f.einfach(
    'bf-05',
    'Was ist die GTIN (früher EAN) auf einer Verpackung?',
    [
      'Eine interne Artikelnummer des eigenen Marktes',
      'Eine weltweit eindeutige Artikelnummer',
      'Die Lieferantennummer im Warenwirtschaftssystem',
      'Die Chargennummer aus der Produktion',
    ],
    1,
    'Die meist 13-stellige GTIN wird für jeden Artikel weltweit nur einmal vergeben. Sie steht als Strichcode auf der Packung und wird an der Kasse und im Wareneingang gescannt. So bucht das Warenwirtschaftssystem jeden Verkauf automatisch ab.',
    { schwierigkeit: 1 },
  ),
  f.einfach(
    'bf-06',
    'Woher kommt der Sollbestand eines Artikels?',
    [
      'Aus der Zählung bei der Inventur',
      'Aus der Fortschreibung im Warenwirtschaftssystem',
      'Aus dem festgelegten Höchstbestand',
      'Aus dem Lieferschein der letzten Lieferung',
    ],
    1,
    'Der Sollbestand ist der Buchbestand. Das System rechnet ihn laufend aus: Anfangsbestand plus Wareneingänge minus Verkäufe. Was du tatsächlich zählst, ist der Istbestand, und die Abweichung zwischen beiden heißt Inventurdifferenz.',
    { schwierigkeit: 1 },
  ),
  f.mehrfach(
    'bf-07',
    'Wodurch kann eine Inventurdifferenz entstehen? (Mehrere richtig)',
    ['Ladendiebstahl', 'Preiserhöhung beim Lieferanten', 'Nicht ausgebuchter Bruch', 'Falsch gescannte Artikel an der Kasse'],
    [0, 2, 3],
    'Eine Differenz entsteht, wenn Ware den Markt verlässt, ohne im System gebucht zu werden, oder wenn sie falsch gebucht wird. Eine Preisänderung verändert nur den Wert der Ware, die Stückzahl bleibt gleich.',
  ),
  f.rechnen(
    'bf-08',
    'Laut Warenwirtschaftssystem sind 240 Dosen gehackte Tomaten am Lager, bei der Inventur zählst du 228. Der Bezugspreis beträgt 1,50 € je Dose. Wie hoch ist die Inventurdifferenz in Euro?',
    { wert: 18, toleranz: 0.01, einheit: '€' },
    [
      schritt('Fehlmenge', '240 − 228', '12 Dosen'),
      schritt('Wert zu Bezugspreisen', '12 × 1,50 €', 'Inventurdifferenz = 18,00 €', 'Bestände bewertest du zum Bezugspreis, nicht zum Verkaufspreis.'),
    ],
    'Zuerst ermittelst du die Fehlmenge aus Soll- und Istbestand. Danach bewertest du die fehlenden Dosen mit dem Bezugspreis.',
    { schwierigkeit: 1 },
  ),
  f.einfach(
    'bf-09',
    'Wofür nutzt du im Markt ein MDE-Gerät?',
    [
      'Zum Erfassen von Bestell- und Inventurmengen am Regal',
      'Zum Kassieren von Kundeneinkäufen',
      'Zum Aufzeichnen der Temperaturen in den Kühlmöbeln',
      'Zum Übertragen von Kartenzahlungen an die Bank',
    ],
    0,
    'MDE steht für mobile Datenerfassung. Du scannst am Regal den Artikel und gibst die Menge ein, zum Beispiel für die Bestellung oder die Inventur. Die Daten gehen direkt ins Warenwirtschaftssystem, ohne Zettel und Abtippen.',
    { schwierigkeit: 1 },
  ),
  f.einfach(
    'bf-10',
    'Wann spricht man von einem geschlossenen Warenwirtschaftssystem?',
    [
      'Wenn nur der Wareneingang artikelgenau erfasst wird',
      'Wenn Wareneingang und Warenausgang nach Warengruppen erfasst werden',
      'Wenn nur der Warenausgang artikelgenau erfasst wird',
      'Wenn Wareneingang und Warenausgang artikelgenau erfasst werden',
    ],
    3,
    'Geschlossen heißt, dass der gesamte Warenfluss vom Wareneingang bis zum Kassenbon artikelgenau im System läuft. Nur dann kennt das System jederzeit den Bestand und kann automatisch nachbestellen. Fehlt ein Teil davon, ist das System offen.',
  ),
]
