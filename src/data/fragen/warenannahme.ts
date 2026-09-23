import { themaFabrik } from './_fabrik'

const f = themaFabrik('warenannahme', 'warenwirtschaft')

export const warenannahme = [
  f.einfach(
    'wa-01',
    'Was prüfst du bei der Warenannahme, solange der Fahrer noch da ist?',
    [
      'MHD und Qualität jedes einzelnen Artikels',
      'Anschrift, Zahl der Packstücke und äußere Schäden',
      'Preise und Rabatte auf der Rechnung',
      'Menge und Sorte jedes einzelnen Artikels',
    ],
    1,
    'Solange der Fahrer da ist, prüfst du, ob die Lieferung für euren Markt bestimmt ist, ob die Zahl der Packstücke stimmt und ob Verpackungen beschädigt sind. Nur jetzt kann er Schäden bestätigen. Den Inhalt kontrollierst du danach in Ruhe.',
    { schwierigkeit: 1 },
  ),
  f.einfach(
    'wa-02',
    'Ein Karton ist sichtbar eingedrückt und nass. Was tust du?',
    [
      'Annehmen und später beim Lieferanten reklamieren',
      'Schaden vermerken und vom Fahrer quittieren lassen',
      'Schaden fotografieren und ohne Vermerk annehmen',
      'Karton annehmen und gleich aussortieren',
    ],
    1,
    'Ohne Vermerk auf dem Lieferschein und Unterschrift des Fahrers kannst du später kaum beweisen, dass der Schaden beim Transport entstanden ist. Bei starken Schäden darfst du die Annahme auch verweigern. Fotos helfen zusätzlich, ersetzen den Vermerk aber nicht.',
  ),
  f.einfach(
    'wa-03',
    'Zwei Kaufleute schließen einen Kaufvertrag. Wann muss der Käufer einen erkennbaren Mangel melden?',
    ['Innerhalb von zwei Jahren', 'Innerhalb von 14 Tagen', 'Unverzüglich', 'Innerhalb von 30 Tagen'],
    2,
    'Beim zweiseitigen Handelskauf muss der Käufer die Ware unverzüglich prüfen und Mängel unverzüglich melden, das heißt ohne schuldhaftes Zögern. Wer zu lange wartet, verliert seine Mängelrechte, weil die Ware dann als genehmigt gilt.',
    { rechtsbezug: '§ 377 HGB', merksatz: 'Beim Handelskauf wird unverzüglich geprüft und unverzüglich gerügt.' },
  ),
  f.einfach(
    'wa-04',
    'Beim Auspacken nach einer Woche entdeckst du, dass Gläser innen gesprungen sind. Von außen war nichts zu sehen. Was gilt?',
    [
      'Zu spät, die Ware gilt als genehmigt',
      'Du rügst unverzüglich, die Frist läuft ab Entdeckung',
      'Du hast ab Lieferung zwei Jahre Zeit für die Rüge',
      'Du hast ab Entdeckung 14 Tage Zeit für die Rüge',
    ],
    1,
    'Ein versteckter Mangel war bei der Eingangsprüfung nicht zu erkennen. Deshalb beginnt die Rügefrist erst mit der Entdeckung, dann musst du aber unverzüglich rügen.',
    { rechtsbezug: '§ 377 Abs. 3 HGB', schwierigkeit: 3 },
  ),
  f.einfach(
    'wa-05',
    'Wie kalt muss Tiefkühlware bei der Anlieferung mindestens sein?',
    ['+4 °C oder kälter', '−12 °C oder kälter', '−18 °C oder kälter', '−30 °C oder kälter'],
    2,
    'Tiefgefrorene Lebensmittel müssen durchgehend bei −18 °C oder kälter gehalten werden. Beim Transport sind nur kurze Schwankungen nach oben erlaubt. Ist die Kühlkette unterbrochen, verweigerst du die Annahme.',
    { rechtsbezug: 'TLMV (Verordnung über tiefgefrorene Lebensmittel)', schwierigkeit: 1 },
  ),
  f.einfach(
    'wa-06',
    'Was bedeutet FEFO beim Einräumen?',
    [
      'Was zuerst abläuft, wird zuerst verkauft',
      'Was zuerst geliefert wurde, wird zuerst verkauft',
      'Was zuletzt geliefert wurde, wird zuerst verkauft',
      'Was sich am besten verkauft, steht vorn',
    ],
    0,
    'FEFO steht für first expired, first out. Die Ware mit dem kürzesten Datum kommt nach vorn, neue Ware nach hinten. So läuft hinten im Regal nichts ab. FIFO (first in, first out) richtet sich dagegen nach dem Lieferdatum.',
    { merksatz: 'Neue Ware nach hinten, kurzes Datum nach vorn.', schwierigkeit: 1 },
  ),
  f.einfach(
    'wa-07',
    'Wozu dient der Lieferschein bei der Warenannahme?',
    [
      'Als Zahlungsaufforderung an den Markt',
      'Zum Abgleich von Art und Menge der Ware',
      'Als Bestätigung der Bestellung',
      'Als Quittung für die bezahlte Ware',
    ],
    1,
    'Der Lieferschein begleitet die Ware und zeigt, was geliefert wurde. Du vergleichst Bestellung, Lieferschein und tatsächlich gelieferte Ware. Die Rechnung mit der Zahlungsaufforderung kommt oft getrennt.',
    { schwierigkeit: 1 },
  ),
  f.mehrfach(
    'wa-08',
    'Was prüfst du bei der inneren Kontrolle nach der Annahme? (Mehrere richtig)',
    [
      'Stimmen Menge und Artikel mit der Bestellung überein?',
      'Ist die Qualität einwandfrei?',
      'Ist das Mindesthaltbarkeitsdatum ausreichend?',
      'Stimmt die Zahl der Packstücke mit dem Frachtbrief überein?',
    ],
    [0, 1, 2],
    'Bei der inneren Prüfung öffnest du die Packstücke und kontrollierst Artikel, Menge, Qualität und Restlaufzeit. Ware, die kurz vor Ablauf ankommt, lässt sich kaum noch verkaufen. Die Zahl der Packstücke gehört zur äußeren Prüfung, die schon mit dem Fahrer stattfindet.',
  ),
  f.einfach(
    'wa-09',
    'Eine Palette Reinigungsmittel kommt ins Lager. Wo stellst du sie hin?',
    [
      'Ins Lebensmittelregal, aber ganz nach unten',
      'In einen eigenen Bereich, getrennt von Lebensmitteln',
      'Neben die Lebensmittel, wenn alles verschlossen ist',
      'In den Kühlraum, damit nichts ausgast',
    ],
    1,
    'Reinigungsmittel können auslaufen oder Gerüche an Lebensmittel abgeben. Deshalb lagerst du sie getrennt, nicht über, neben oder unter Lebensmitteln. Das gehört zur artgerechten Lagerung.',
    { schwierigkeit: 1 },
  ),
  f.einfach(
    'wa-10',
    'Welche Temperatur darf Hackfleisch in der Kühltheke höchstens haben?',
    ['+2 °C', '+4 °C', '+7 °C', '+10 °C'],
    0,
    'Beim Zerkleinern entsteht viel Oberfläche, auf der sich Keime schnell vermehren. Deshalb gilt für Hackfleisch die strengste Grenze von höchstens +2 °C. Frisches Fleisch am Stück darf bis +7 °C haben.',
    { rechtsbezug: 'Tier-LMHV, Anlage 3', schwierigkeit: 2 },
  ),
]
