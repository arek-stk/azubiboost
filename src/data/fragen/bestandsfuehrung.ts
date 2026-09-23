import { schritt, themaFabrik } from './_fabrik'

const f = themaFabrik('bestandsfuehrung', 'warenwirtschaft')

export const bestandsfuehrung = [
  f.einfach(
    'bf-01',
    'Wie oft muss ein Kaufmann nach Handelsrecht mindestens eine Inventur machen?',
    ['Jeden Monat', 'Mindestens einmal im Geschäftsjahr', 'Alle fünf Jahre', 'Nur bei der Gründung'],
    1,
    'Bei der Gründung und dann zum Schluss jedes Geschäftsjahres muss der Bestand erfasst werden. Die Inventur ist die Grundlage für die Bilanz.',
    { rechtsbezug: '§ 240 HGB', schwierigkeit: 1 },
  ),
  f.einfach(
    'bf-02',
    'Was ist der Unterschied zwischen Inventur und Inventar?',
    [
      'Es gibt keinen',
      'Inventur ist das Zählen, das Inventar ist das Verzeichnis, das dabei entsteht',
      'Inventar ist das Zählen, Inventur die Liste',
      'Inventur betrifft nur Waren, Inventar nur Geräte',
    ],
    1,
    'Inventur ist die Tätigkeit: zählen, messen, wiegen. Das Ergebnis ist das Inventar — ein ausführliches Bestandsverzeichnis aller Vermögensteile und Schulden.',
    { merksatz: 'Inventur = tun. Inventar = Liste.', schwierigkeit: 1 },
  ),
  f.einfach(
    'bf-03',
    'Was kennzeichnet die permanente Inventur?',
    [
      'Alle Artikel werden am 31.12. gleichzeitig gezählt',
      'Der Bestand wird laufend im Warenwirtschaftssystem fortgeschrieben und über das Jahr verteilt geprüft',
      'Es wird gar nicht mehr gezählt',
      'Nur teure Artikel werden gezählt',
    ],
    1,
    'Bei der permanenten Inventur führt das System den Bestand laufend. Gezählt wird verteilt über das Jahr, aber jeder Artikel mindestens einmal — der große Zähltag am Jahresende entfällt.',
  ),
  f.einfach(
    'bf-04',
    'In welchem Zeitraum darf eine verlegte Inventur stattfinden?',
    [
      'Bis zu 10 Tage vor oder nach dem Stichtag',
      'Bis zu 3 Monate vor oder 2 Monate nach dem Stichtag',
      'Irgendwann im Geschäftsjahr',
      'Nur genau am Stichtag',
    ],
    1,
    'Die verlegte Inventur wird in ruhigere Zeiten verschoben. Der Bestand wird dann rechnerisch auf den Stichtag fort- oder zurückgerechnet. Die Stichtagsinventur dagegen findet zeitnah rund um den Stichtag statt.',
    { rechtsbezug: '§ 241 Abs. 3 HGB', schwierigkeit: 3 },
  ),
  f.einfach(
    'bf-05',
    'Wofür steht die GTIN (früher EAN) auf der Verpackung?',
    [
      'Das Herstellungsdatum',
      'Eine weltweit eindeutige Artikelnummer, die als Strichcode gescannt wird',
      'Den Verkaufspreis',
      'Die Lieferantennummer im eigenen Markt',
    ],
    1,
    'Die meist 13-stellige GTIN identifiziert jeden Artikel eindeutig. Scanner lesen sie an der Kasse und im Wareneingang — so bucht das Warenwirtschaftssystem jeden Verkauf automatisch ab.',
    { schwierigkeit: 1 },
  ),
  f.einfach(
    'bf-06',
    'Woher kommt der Sollbestand eines Artikels?',
    [
      'Aus der Zählung im Regal',
      'Aus dem Warenwirtschaftssystem: Anfangsbestand plus Eingänge minus Verkäufe',
      'Aus der Schätzung der Marktleitung',
      'Aus dem Katalog des Lieferanten',
    ],
    1,
    'Der Sollbestand ist der Buchbestand — das, was laut System da sein müsste. Der Istbestand ist das, was tatsächlich gezählt wird. Die Differenz ist die Inventurdifferenz.',
    { schwierigkeit: 1 },
  ),
  f.mehrfach(
    'bf-07',
    'Was kann eine Inventurdifferenz verursachen? (Mehrere richtig)',
    ['Ladendiebstahl', 'Bruch, der nicht ausgebucht wurde', 'Falsch gescannte Artikel an der Kasse', 'Eine Preiserhöhung beim Lieferanten'],
    [0, 1, 2],
    'Differenzen entstehen, wenn Ware das Haus verlässt, ohne im System gebucht zu werden — oder falsch gebucht wird. Eine Preisänderung ändert den Wert, aber nicht die Stückzahl.',
  ),
  f.rechnen(
    'bf-08',
    'Laut System sind 240 Dosen Tomaten da, gezählt werden 228. Eine Dose hat einen Bezugspreis von 1,50 €. Wie hoch ist der Wert der Inventurdifferenz?',
    { wert: 18, toleranz: 0.01, einheit: '€' },
    [
      schritt('Fehlmenge', '240 − 228', '12 Dosen'),
      schritt('Wert zu Bezugspreisen', '12 × 1,50 €', 'Inventurdifferenz = 18,00 €', 'Bewertet wird zum Einkaufspreis, nicht zum Verkaufspreis.'),
    ],
    'Erst die fehlende Menge, dann mit dem Bezugspreis bewerten.',
    { schwierigkeit: 1 },
  ),
  f.einfach(
    'bf-09',
    'Wofür nutzt man ein MDE-Gerät im Markt?',
    ['Zum Kassieren', 'Zur mobilen Datenerfassung, etwa für Bestellungen und Inventur direkt am Regal', 'Zum Messen der Kühltemperatur', 'Zum Drucken von Werbeplakaten'],
    1,
    'Mit dem mobilen Datenerfassungsgerät scannst du am Regal und gibst Mengen ein. Die Daten gehen direkt ins Warenwirtschaftssystem — ohne Zettel und Abtippen.',
    { schwierigkeit: 1 },
  ),
  f.einfach(
    'bf-10',
    'Was ist ein geschlossenes Warenwirtschaftssystem?',
    [
      'Ein System, das nachts abgeschaltet wird',
      'Ein System, in dem Wareneingang, Lager und Verkauf vollständig und artikelgenau erfasst sind',
      'Ein System nur für die Buchhaltung',
      'Ein System ohne Internetanschluss',
    ],
    1,
    'Geschlossen heißt: der ganze Warenfluss vom Eingang bis zum Kassenbon läuft artikelgenau durchs System. Nur dann kennt es jederzeit den Bestand und kann automatisch bestellen.',
  ),
]
