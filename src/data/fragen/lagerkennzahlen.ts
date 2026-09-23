import { schritt, themaFabrik } from './_fabrik'

const f = themaFabrik('lagerkennzahlen', 'warenwirtschaft')

export const lagerkennzahlen = [
  f.einfach(
    'lk-01',
    'Die Umschlagshäufigkeit bei Molkereiprodukten steigt. Welche Folge hat das?',
    [
      'Die Lagerdauer steigt, die Kapitalbindung steigt',
      'Die Lagerdauer steigt, die Kapitalbindung sinkt',
      'Die Lagerdauer sinkt, die Kapitalbindung steigt',
      'Die Lagerdauer sinkt, die Kapitalbindung sinkt',
    ],
    3,
    'Wenn sich der Bestand öfter im Jahr erneuert, liegt jede Ware kürzer im Lager. Dadurch steckt weniger Geld in der Ware (geringere Kapitalbindung), und Lagerzinsen und Verderb gehen zurück.',
    { schwierigkeit: 1 },
  ),
  f.einfach(
    'lk-02',
    'Der durchschnittliche Lagerbestand soll aus dem Jahresanfangsbestand und den 12 Monatsendbeständen berechnet werden. Durch welche Zahl teilst du?',
    ['2', '12', '13', '365'],
    2,
    'Du addierst 13 Werte: den Jahresanfangsbestand und die zwölf Monatsendbestände. Deshalb teilst du durch 13. Mit dem Jahresanfangsbestand und vier Quartalsendbeständen wären es 5 Werte.',
    { merksatz: 'Du teilst durch die Anzahl der Bestände, die du addiert hast.' },
  ),
  f.einfach(
    'lk-03',
    'In der Formel für die Umschlagshäufigkeit steht der Wareneinsatz. Was ist damit gemeint?',
    [
      'Die verkaufte Ware zu Bezugspreisen',
      'Die eingekaufte Ware zu Bezugspreisen',
      'Der Umsatz zu Verkaufspreisen',
      'Der Warenbestand am Jahresende',
    ],
    0,
    'Der Wareneinsatz ist die verkaufte Ware, bewertet zu Bezugspreisen. Weil der Lagerbestand ebenfalls zu Bezugspreisen bewertet wird, passen beide Werte in der Formel zusammen. Die eingekaufte Ware ist dagegen der Wareneingang.',
  ),
  f.rechnen(
    'lk-04',
    'Im Getränkebereich beträgt der Wareneinsatz 240.000 € im Jahr, der durchschnittliche Lagerbestand 20.000 €. Wie hoch ist die Umschlagshäufigkeit?',
    { wert: 12, toleranz: 0.01, einheit: 'mal' },
    [schritt('Wareneinsatz durch Ø Lagerbestand', '240.000 € ÷ 20.000 €', 'Umschlagshäufigkeit = 12')],
    'Eine Umschlagshäufigkeit von 12 bedeutet, dass der durchschnittliche Bestand zwölfmal im Jahr verkauft und wieder aufgefüllt wird.',
    { schwierigkeit: 1 },
  ),
  f.rechnen(
    'lk-05',
    'Die Umschlagshäufigkeit einer Warengruppe beträgt 12. Wie viele Tage liegt die Ware durchschnittlich im Lager?',
    { wert: 30, toleranz: 0.1, einheit: 'Tage' },
    [schritt('360 durch Umschlagshäufigkeit', '360 ÷ 12', 'Lagerdauer = 30 Tage', 'Im kaufmännischen Rechnen hat das Jahr 360 Tage.')],
    'Bei zwölf Umschlägen im Jahr liegt die Ware im Durchschnitt einen Monat im Lager, bevor sie verkauft wird.',
    { schwierigkeit: 1 },
  ),
  f.rechnen(
    'lk-06',
    'Laut Inventur betrug der Warenbestand am Jahresanfang 18.000 € und am Jahresende 22.000 €. Wie hoch ist der durchschnittliche Lagerbestand?',
    { wert: 20000, toleranz: 0.5, einheit: '€' },
    [schritt('Anfang plus Ende, durch zwei', '(18.000 € + 22.000 €) ÷ 2', 'Ø Lagerbestand = 20.000 €')],
    'Mit Anfangs- und Endbestand hast du zwei Werte, deshalb teilst du durch 2. Rechnest du mit Quartals- oder Monatsendbeständen, wird der Durchschnitt zuverlässiger.',
    { schwierigkeit: 1 },
  ),
  f.rechnen(
    'lk-07',
    'Der Marktzinssatz beträgt 6 % im Jahr, die durchschnittliche Lagerdauer 30 Tage. Wie hoch ist der Lagerzinssatz?',
    { wert: 0.5, toleranz: 0.01, einheit: '%' },
    [schritt('Jahreszins auf die Lagerdauer umrechnen', '6 % × 30 ÷ 360', 'Lagerzinssatz = 0,5 %')],
    'Das Geld ist im Schnitt nur 30 von 360 Tagen in der Ware gebunden. Deshalb fällt nur ein Zwölftel des Jahreszinses an.',
  ),
  f.rechnen(
    'lk-08',
    'Der durchschnittliche Lagerbestand beträgt 30.000 €, der Lagerzinssatz 0,5 %. Wie hoch sind die Lagerzinsen?',
    { wert: 150, toleranz: 0.01, einheit: '€' },
    [schritt('Bestand mal Lagerzinssatz', '30.000 € × 0,5 %', 'Lagerzinsen = 150 €')],
    'Lagerzinsen zeigen, was das im Lager gebundene Geld kostet. Ohne den Bestand könnte das Geld auf der Bank Zinsen bringen oder einen Kredit verringern.',
    { schwierigkeit: 1 },
  ),
  f.mehrfach(
    'lk-09',
    'Mit welchen Maßnahmen kann der Markt die Umschlagshäufigkeit erhöhen? (Mehrere richtig)',
    [
      'Häufiger in kleineren Mengen bestellen',
      'Den Sicherheitsbestand erhöhen',
      'Ladenhüter abverkaufen und auslisten',
      'Größere Mengen mit Mengenrabatt bestellen',
      'Das Sortiment straffen',
    ],
    [0, 2, 4],
    'Die Umschlagshäufigkeit steigt, wenn der durchschnittliche Bestand sinkt oder mehr verkauft wird. Kleinere Bestellmengen, weniger Ladenhüter und ein schlankeres Sortiment senken den Bestand. Ein höherer Sicherheitsbestand und große Bestellmengen erhöhen ihn.',
  ),
  f.einfach(
    'lk-10',
    'Artikel A liegt durchschnittlich 8 Tage im Lager, Artikel B 60 Tage. Welche Aussage trifft zu?',
    [
      'A ist ein Langsamdreher, B ein Schnelldreher',
      'A ist ein Schnelldreher, B ein Langsamdreher',
      'B hat die höhere Umschlagshäufigkeit',
      'B muss häufiger nachbestellt werden',
    ],
    1,
    'Eine kurze Lagerdauer heißt schneller Abverkauf, typisch für Molkereiprodukte, Brot oder Obst. Bei 60 Tagen dreht der Artikel langsam, etwa bei Gewürzen oder Haushaltswaren. A kommt auf eine Umschlagshäufigkeit von 45, B nur auf 6.',
    { schwierigkeit: 1 },
  ),
]
