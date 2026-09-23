import { schritt, themaFabrik } from './_fabrik'

const f = themaFabrik('beschaffung', 'warenwirtschaft')

export const beschaffung = [
  f.einfach(
    'bs-01',
    'Beim Kaffee wird immer dann bestellt, wenn der Bestand auf 200 Packungen fällt. Welches Verfahren ist das?',
    ['Bestellrhythmusverfahren', 'Bestellpunktverfahren', 'Just-in-time', 'Streckengeschäft'],
    1,
    'Beim Bestellpunktverfahren löst das Erreichen des Meldebestands die Bestellung aus. Beim Bestellrhythmusverfahren wird in festen Abständen bestellt, etwa jeden Montag.',
    { schwierigkeit: 1 },
  ),
  f.einfach(
    'bs-02',
    'Wie ist eine Anfrage an einen Lieferanten rechtlich einzuordnen?',
    ['Verbindlich, wie eine Bestellung', 'Unverbindlich', 'Verbindlich für 14 Tage', 'Sie ist bereits ein Kaufvertrag'],
    1,
    'Mit einer Anfrage holt man nur Informationen ein. Sie verpflichtet zu nichts — man kann so viele Anbieter anfragen, wie man will.',
    { schwierigkeit: 1 },
  ),
  f.einfach(
    'bs-03',
    'Ein Lieferant schreibt „Angebot freibleibend“. Was bedeutet das?',
    [
      'Die Lieferung ist kostenlos',
      'Das Angebot ist unverbindlich, der Lieferant ist nicht daran gebunden',
      'Der Preis gilt für immer',
      'Der Käufer muss nicht bezahlen',
    ],
    1,
    'Ein Angebot bindet normalerweise den Anbieter. Mit Freizeichnungsklauseln wie „freibleibend“, „ohne Obligo“ oder „solange Vorrat reicht“ schränkt er diese Bindung ein.',
    { rechtsbezug: '§ 145 BGB' },
  ),
  f.einfach(
    'bs-04',
    'Wo liegt die optimale Bestellmenge?',
    [
      'Bei der größtmöglichen Menge, weil es Mengenrabatt gibt',
      'Dort, wo die Summe aus Bestellkosten und Lagerkosten am kleinsten ist',
      'Immer bei genau einer Palette',
      'Bei der kleinsten möglichen Menge',
    ],
    1,
    'Große Mengen: wenige Bestellungen, aber viel Lagerplatz und gebundenes Kapital. Kleine Mengen: wenig Lager, aber viele teure Bestellvorgänge. Das Optimum liegt dazwischen.',
  ),
  f.einfach(
    'bs-05',
    'Mit welchem Werkzeug vergleichst du Angebote auch nach Qualität, Lieferzeit und Zuverlässigkeit?',
    ['Mit dem Kassenbericht', 'Mit einer Entscheidungsbewertungstabelle (Nutzwertanalyse)', 'Mit der Inventurliste', 'Mit der ABC-Analyse'],
    1,
    'Jedes Kriterium bekommt eine Gewichtung, jeder Anbieter Punkte je Kriterium. Gewichtung mal Punkte, aufsummiert — so wird auch ein teurerer, aber verlässlicherer Lieferant vergleichbar.',
  ),
  f.rechnen(
    'bs-06',
    'Täglich werden 60 Flaschen Apfelsaft verkauft, die Lieferzeit beträgt 4 Tage, der Mindestbestand 120 Flaschen. Wie hoch ist der Meldebestand?',
    { wert: 360, toleranz: 0, einheit: 'Stück' },
    [
      schritt('Verbrauch während der Lieferzeit', '60 × 4', '240 Flaschen'),
      schritt('Mindestbestand addieren', '240 + 120', 'Meldebestand = 360 Flaschen'),
    ],
    'Bei 360 Flaschen wird bestellt. Bis die Lieferung da ist, sind 240 verkauft — der Mindestbestand von 120 bleibt als Puffer.',
    { schwierigkeit: 1 },
  ),
  f.rechnen(
    'bs-07',
    'Zahlungsbedingung: 3 % Skonto bei Zahlung in 10 Tagen, sonst 40 Tage netto. Welchem Jahreszinssatz entspricht der Skonto?',
    { wert: 36, toleranz: 0.1, einheit: '%' },
    [
      schritt('Zinstage', '40 − 10', '30 Tage'),
      schritt('Auf das Jahr hochrechnen', '3 % × 360 ÷ 30', 'Jahreszinssatz = 36 %'),
    ],
    'Wer auf den Skonto verzichtet, zahlt für 30 Tage Aufschub 3 % — aufs Jahr gerechnet 36 %. Das ist fast immer teurer als ein Kontokorrentkredit.',
  ),
  f.einfach(
    'bs-08',
    'Im Vertrag steht „Lieferung fest am 15. März“. Die Ware kommt nicht. Ist eine Mahnung nötig, damit der Lieferant in Verzug gerät?',
    ['Ja, immer', 'Nein, bei einem kalendermäßig bestimmten Termin ist sie entbehrlich', 'Nur schriftlich per Einschreiben', 'Nur wenn der Schaden über 1.000 € liegt'],
    1,
    'Normalerweise braucht es eine Mahnung. Ist der Termin aber nach dem Kalender genau bestimmt, weiß der Lieferant ohnehin, wann er liefern muss — der Verzug tritt automatisch ein.',
    { rechtsbezug: '§ 286 Abs. 2 Nr. 1 BGB', schwierigkeit: 3 },
  ),
  f.einfach(
    'bs-09',
    'Wozu dient ein Höchstbestand?',
    [
      'Er verhindert, dass zu viel Ware Lagerplatz und Kapital bindet',
      'Er ist die Menge, bei der bestellt wird',
      'Er ist der eiserne Bestand',
      'Er zeigt die Tagesverkäufe',
    ],
    0,
    'Der Höchstbestand ist die Obergrenze: mehr passt nicht ins Lager oder lohnt sich nicht. Der Meldebestand löst die Bestellung aus, der Mindestbestand ist der Puffer.',
    { merksatz: 'Mindest – Melde – Höchst: Puffer, Auslöser, Obergrenze.', schwierigkeit: 1 },
  ),
  f.einfach(
    'bs-10',
    'Ein Lieferant liefert mangelhafte Ware. Welches Recht hat der Markt zuerst?',
    ['Sofort vom Vertrag zurücktreten', 'Nacherfüllung verlangen: Nachbesserung oder mangelfreie Ware', 'Den Preis nach eigenem Ermessen kürzen', 'Den Lieferanten verklagen'],
    1,
    'Auch unter Kaufleuten gilt zuerst die Nacherfüllung. Rücktritt oder Minderung kommen erst, wenn sie scheitert oder verweigert wird — vorausgesetzt, der Mangel wurde rechtzeitig gerügt.',
    { rechtsbezug: '§ 437, § 439 BGB, § 377 HGB' },
  ),
]
