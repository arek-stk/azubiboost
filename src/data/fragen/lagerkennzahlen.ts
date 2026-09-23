import { schritt, themaFabrik } from './_fabrik'

const f = themaFabrik('lagerkennzahlen', 'warenwirtschaft')

export const lagerkennzahlen = [
  f.einfach(
    'lk-01',
    'Die Umschlagshäufigkeit eines Artikels steigt. Was folgt daraus?',
    [
      'Die Ware liegt länger im Lager',
      'Die Ware liegt kürzer im Lager, es ist weniger Kapital gebunden',
      'Die Lagerkosten steigen',
      'Der Artikel verkauft sich schlechter',
    ],
    1,
    'Je öfter sich das Lager im Jahr erneuert, desto kürzer liegt jede einzelne Ware herum. Weniger Geld steckt im Regal fest, Lagerzinsen und Verderb sinken.',
    { schwierigkeit: 1 },
  ),
  f.einfach(
    'lk-02',
    'Der Ø Lagerbestand wird aus dem Jahresanfangsbestand und den 12 Monatsendbeständen berechnet. Durch welche Zahl teilst du?',
    ['12', '13', '2', '365'],
    1,
    'Du addierst 13 Werte — den Anfangsbestand und zwölf Monatsendbestände. Also teilst du durch 13. Bei Anfangsbestand plus vier Quartalen sind es 5 Werte.',
    { merksatz: 'Geteilt wird durch die Anzahl der Werte, nicht durch die Anzahl der Monate.' },
  ),
  f.einfach(
    'lk-03',
    'Was bedeutet der Wareneinsatz in der Formel der Umschlagshäufigkeit?',
    [
      'Der Umsatz zu Verkaufspreisen',
      'Die verkaufte Ware bewertet zu Bezugspreisen',
      'Die Anzahl der Mitarbeiter',
      'Der Warenbestand am Jahresende',
    ],
    1,
    'Der Lagerbestand ist zu Einkaufspreisen bewertet — also muss auch der Verbrauch zu Einkaufspreisen stehen. Sonst vergleichst du Äpfel mit Birnen.',
  ),
  f.rechnen(
    'lk-04',
    'Wareneinsatz im Jahr 240.000 €, durchschnittlicher Lagerbestand 20.000 €. Wie hoch ist die Umschlagshäufigkeit?',
    { wert: 12, toleranz: 0.01, einheit: 'mal' },
    [schritt('Wareneinsatz durch Ø Lagerbestand', '240.000 € ÷ 20.000 €', 'Umschlagshäufigkeit = 12')],
    'Das Lager wird zwölfmal im Jahr komplett verkauft und neu aufgefüllt.',
    { schwierigkeit: 1 },
  ),
  f.rechnen(
    'lk-05',
    'Die Umschlagshäufigkeit beträgt 12. Wie viele Tage liegt die Ware durchschnittlich im Lager?',
    { wert: 30, toleranz: 0.1, einheit: 'Tage' },
    [schritt('360 durch Umschlagshäufigkeit', '360 ÷ 12', 'Lagerdauer = 30 Tage', 'Kaufmännisch hat das Jahr 360 Tage.')],
    'Zwölfmal im Jahr umgeschlagen heißt: jede Ware liegt im Schnitt einen Monat.',
    { schwierigkeit: 1 },
  ),
  f.rechnen(
    'lk-06',
    'Anfangsbestand 18.000 €, Endbestand 22.000 €. Wie hoch ist der durchschnittliche Lagerbestand?',
    { wert: 20000, toleranz: 0.5, einheit: '€' },
    [schritt('Anfang plus Ende, durch zwei', '(18.000 € + 22.000 €) ÷ 2', 'Ø Lagerbestand = 20.000 €')],
    'Mit nur zwei Werten ist das die einfachste Form. Genauer wird es mit Quartals- oder Monatsbeständen.',
    { schwierigkeit: 1 },
  ),
  f.rechnen(
    'lk-07',
    'Der Marktzinssatz beträgt 6 %, die durchschnittliche Lagerdauer 30 Tage. Wie hoch ist der Lagerzinssatz?',
    { wert: 0.5, toleranz: 0.01, einheit: '%' },
    [schritt('Jahreszins auf die Lagerdauer umrechnen', '6 % × 30 ÷ 360', 'Lagerzinssatz = 0,5 %')],
    'Das Geld steckt nur 30 von 360 Tagen in der Ware — also fällt nur ein Zwölftel des Jahreszinses an.',
  ),
  f.rechnen(
    'lk-08',
    'Ø Lagerbestand 30.000 €, Lagerzinssatz 0,5 %. Wie hoch sind die Lagerzinsen?',
    { wert: 150, toleranz: 0.01, einheit: '€' },
    [schritt('Bestand mal Lagerzinssatz', '30.000 € × 0,5 %', 'Lagerzinsen = 150 €')],
    'Die Lagerzinsen sind die Kosten dafür, dass das Geld in der Ware steckt statt Zinsen zu bringen oder Schulden zu senken.',
    { schwierigkeit: 1 },
  ),
  f.mehrfach(
    'lk-09',
    'Wie kann der Markt die Umschlagshäufigkeit erhöhen? (Mehrere richtig)',
    [
      'Häufiger in kleineren Mengen bestellen',
      'Ladenhüter abverkaufen und auslisten',
      'Das Sortiment straffen',
      'Den Sicherheitsbestand verdoppeln',
    ],
    [0, 1, 2],
    'Alles, was den durchschnittlichen Bestand senkt oder den Absatz erhöht, steigert die Umschlagshäufigkeit. Ein größerer Sicherheitsbestand bewirkt das Gegenteil.',
  ),
  f.einfach(
    'lk-10',
    'Artikel A hat eine Lagerdauer von 8 Tagen, Artikel B von 60 Tagen. Was ist wahrscheinlich?',
    [
      'A ist ein Ladenhüter',
      'A ist ein Frischeartikel oder Schnelldreher, B dreht langsam',
      'Beide verkaufen sich gleich gut',
      'B hat eine höhere Umschlagshäufigkeit',
    ],
    1,
    'Kurze Lagerdauer heißt schneller Abverkauf — typisch für Molkerei, Brot, Obst. 60 Tage deuten auf einen Langsamdreher hin, etwa Gewürze oder Haushaltswaren.',
    { schwierigkeit: 1 },
  ),
]
