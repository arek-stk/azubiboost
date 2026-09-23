import { schritt, themaFabrik } from './_fabrik'

const f = themaFabrik('beschaffung', 'warenwirtschaft')

export const beschaffung = [
  f.einfach(
    'bs-01',
    'Kaffee wird im Markt immer dann nachbestellt, wenn der Bestand auf 200 Packungen sinkt. Welches Bestellverfahren ist das?',
    ['Bestellrhythmusverfahren', 'Bestellpunktverfahren', 'Just-in-time', 'Streckengeschäft'],
    1,
    'Beim Bestellpunktverfahren wird bestellt, sobald der Bestand den Meldebestand erreicht, hier 200 Packungen. Beim Bestellrhythmusverfahren wird dagegen in festen Abständen bestellt, zum Beispiel jeden Montag.',
    { schwierigkeit: 1 },
  ),
  f.einfach(
    'bs-02',
    'Wie ist eine Anfrage an einen Lieferanten rechtlich einzuordnen?',
    [
      'Sie ist verbindlich wie eine Bestellung',
      'Sie ist rechtlich unverbindlich',
      'Sie bindet den Käufer 14 Tage lang',
      'Sie ist bereits ein Kaufvertrag',
    ],
    1,
    'Mit einer Anfrage holst du nur Informationen ein, etwa zu Preisen und Lieferzeiten. Sie verpflichtet zu nichts, deshalb kannst du bei beliebig vielen Lieferanten anfragen.',
    { schwierigkeit: 1 },
  ),
  f.einfach(
    'bs-03',
    'Ein Lieferant schreibt „Angebot freibleibend“. Was bedeutet das?',
    [
      'Die Lieferung erfolgt frei Haus',
      'Das Angebot ist unverbindlich',
      'Das Angebot gilt zeitlich unbegrenzt',
      'Die Verpackung wird nicht berechnet',
    ],
    1,
    'Normalerweise ist der Anbieter an sein Angebot gebunden. Mit einer Freizeichnungsklausel wie „freibleibend“ oder „ohne Obligo“ schließt er diese Bindung aus. Bei „solange Vorrat reicht“ gilt sie nur für die Menge, die noch da ist.',
    { rechtsbezug: '§ 145 BGB' },
  ),
  f.einfach(
    'bs-04',
    'Bei jeder Bestellung fallen Bestellkosten an, für die gelagerte Ware Lagerkosten. Wo liegt die optimale Bestellmenge?',
    [
      'Wo der Lieferant den höchsten Rabatt gibt',
      'Wo die Summe beider Kosten am kleinsten ist',
      'Wo die Lagerkosten am kleinsten sind',
      'Wo die Bestellkosten am kleinsten sind',
    ],
    1,
    'Bestellst du große Mengen, sparst du Bestellvorgänge, brauchst aber viel Lagerplatz und bindest Kapital. Bei kleinen Mengen ist es umgekehrt. Die optimale Bestellmenge liegt dort, wo Bestell- und Lagerkosten zusammen am niedrigsten sind.',
  ),
  f.einfach(
    'bs-05',
    'Du vergleichst die Angebote von drei Lieferanten. Neben dem Preis sollen auch Qualität, Lieferzeit und Zuverlässigkeit zählen. Welches Verfahren nutzt du?',
    ['Eine Bezugskalkulation', 'Eine Nutzwertanalyse', 'Eine ABC-Analyse', 'Eine XYZ-Analyse'],
    1,
    'Bei der Nutzwertanalyse (Entscheidungsbewertungstabelle) gewichtest du jedes Kriterium, vergibst Punkte je Lieferant und rechnest Gewichtung mal Punkte zusammen. So kann auch ein teurerer, aber zuverlässiger Lieferant vorn liegen. Eine Bezugskalkulation vergleicht dagegen nur die Preise.',
  ),
  f.rechnen(
    'bs-06',
    'Vom Apfelsaft werden täglich 60 Flaschen verkauft. Die Lieferzeit beträgt 4 Tage, der Mindestbestand 120 Flaschen. Wie hoch ist der Meldebestand?',
    { wert: 360, toleranz: 0, einheit: 'Stück' },
    [
      schritt('Verbrauch während der Lieferzeit', '60 × 4', '240 Flaschen'),
      schritt('Mindestbestand addieren', '240 + 120', 'Meldebestand = 360 Flaschen'),
    ],
    'Sobald nur noch 360 Flaschen da sind, wird bestellt. In den 4 Tagen bis zur Lieferung werden 240 Flaschen verkauft, die 120 Flaschen Mindestbestand bleiben als Reserve.',
    { schwierigkeit: 1 },
  ),
  f.rechnen(
    'bs-07',
    'Auf der Rechnung steht: „Zahlbar innerhalb von 10 Tagen mit 3 % Skonto oder innerhalb von 40 Tagen netto.“ Welchem Jahreszinssatz entspricht der Skonto?',
    { wert: 36, toleranz: 0.1, einheit: '%' },
    [
      schritt('Zinstage: Zahlungsziel minus Skontofrist', '40 − 10', '30 Tage'),
      schritt('Auf 360 Tage hochrechnen', '3 % × 360 ÷ 30', 'Jahreszinssatz = 36 %'),
    ],
    'Wer den Skonto nicht nutzt, zahlt für 30 Tage längeres Zahlungsziel 3 % mehr. Aufs Jahr gerechnet sind das 36 %. Ein Kontokorrentkredit ist fast immer günstiger, deshalb lohnt es sich meist, innerhalb der Skontofrist zu zahlen, notfalls mit Kredit.',
  ),
  f.einfach(
    'bs-08',
    'Im Kaufvertrag mit dem Getränkelieferanten steht „Lieferung fest am 15. März“. Die Ware kommt an diesem Tag nicht. Ist eine Mahnung nötig, damit der Lieferant in Verzug gerät?',
    [
      'Ja, ohne Mahnung tritt kein Verzug ein',
      'Nein, der Termin ist kalendermäßig bestimmt',
      'Ja, die Mahnung muss per Einschreiben gehen',
      'Ja, mit einer Nachfrist von 14 Tagen',
    ],
    1,
    'In der Regel kommt der Lieferant erst durch eine Mahnung in Verzug. Ist der Liefertermin aber nach dem Kalender bestimmt, weiß er ohnehin, wann er liefern muss. Deshalb ist er ohne Mahnung im Verzug, sobald der Termin verstrichen ist.',
    { rechtsbezug: '§ 286 Abs. 2 Nr. 1 BGB', schwierigkeit: 3 },
  ),
  f.einfach(
    'bs-09',
    'Wozu dient der Höchstbestand?',
    [
      'Er begrenzt die Lagermenge nach oben',
      'Bei ihm wird eine Bestellung ausgelöst',
      'Er ist die Reserve für Lieferengpässe',
      'Er gibt den täglichen Absatz an',
    ],
    0,
    'Der Höchstbestand ist die Obergrenze für das Lager. Mehr Ware würde zu viel Platz und Kapital binden oder passt gar nicht erst hinein.',
    { merksatz: 'Mindestbestand ist die Reserve, Meldebestand der Auslöser, Höchstbestand die Obergrenze.', schwierigkeit: 1 },
  ),
  f.einfach(
    'bs-10',
    'Bei der Prüfung im Wareneingang zeigt sich, dass mehrere Kaffeemaschinen aus der Aktionsware defekt sind. Welches Recht hat der Markt zuerst?',
    ['Vom Vertrag zurücktreten', 'Nacherfüllung verlangen', 'Den Kaufpreis mindern', 'Schadensersatz verlangen'],
    1,
    'Auch zwischen Kaufleuten hat die Nacherfüllung Vorrang: Der Markt verlangt Reparatur oder mangelfreie Ersatzware. Rücktritt oder Minderung kommen erst infrage, wenn die Nacherfüllung scheitert oder verweigert wird. Voraussetzung ist, dass der Mangel unverzüglich gerügt wurde.',
    { rechtsbezug: '§ 437, § 439 BGB, § 377 HGB' },
  ),
]
