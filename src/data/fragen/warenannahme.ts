import { themaFabrik } from './_fabrik'

const f = themaFabrik('warenannahme', 'warenwirtschaft')

export const warenannahme = [
  f.einfach(
    'wa-01',
    'Was prüfst du bei der Warenannahme, solange der Fahrer noch da ist?',
    [
      'Das Mindesthaltbarkeitsdatum jedes einzelnen Artikels',
      'Anschrift, Anzahl der Packstücke und äußere Beschädigungen',
      'Den Geschmack der Ware',
      'Den Preis auf der Rechnung',
    ],
    1,
    'Die äußere Prüfung passiert sofort in Anwesenheit des Fahrers. Nur so kann er Schäden bestätigen. Die genaue Kontrolle des Inhalts folgt danach.',
    { schwierigkeit: 1 },
  ),
  f.einfach(
    'wa-02',
    'Ein Karton ist sichtbar eingedrückt und nass. Was tust du?',
    [
      'Annehmen und später beim Lieferanten anrufen',
      'Den Schaden auf dem Lieferschein vermerken und vom Fahrer bestätigen lassen, notfalls die Annahme verweigern',
      'Den Karton einfach wegwerfen',
      'Den Fahrer bitten, ihn am nächsten Tag zurückzubringen',
    ],
    1,
    'Ohne Vermerk mit Unterschrift des Fahrers lässt sich später kaum beweisen, dass der Schaden beim Transport entstand. Bei starken Schäden kann die Annahme verweigert werden.',
  ),
  f.einfach(
    'wa-03',
    'Zwei Kaufleute schließen einen Kaufvertrag. Wann muss der Käufer einen erkennbaren Mangel melden?',
    ['Innerhalb von zwei Jahren', 'Innerhalb von 14 Tagen', 'Unverzüglich', 'Erst bei der nächsten Bestellung'],
    2,
    'Beim zweiseitigen Handelskauf gilt die Rügepflicht: Ware sofort prüfen, Mängel unverzüglich — also ohne schuldhaftes Zögern — melden. Wer zu lange wartet, verliert seine Rechte.',
    { rechtsbezug: '§ 377 HGB', merksatz: 'Unter Kaufleuten: sofort prüfen, sofort rügen.' },
  ),
  f.einfach(
    'wa-04',
    'Beim Auspacken nach einer Woche entdeckst du, dass Gläser innen gesprungen sind — von außen war nichts zu sehen. Was gilt?',
    [
      'Zu spät, die Ware gilt als genehmigt',
      'Der versteckte Mangel muss unverzüglich nach der Entdeckung gerügt werden',
      'Du hast noch zwei Jahre Zeit für die Rüge',
      'Nur der Fahrer haftet',
    ],
    1,
    'Ein versteckter Mangel war bei der Prüfung nicht erkennbar. Die Rügefrist beginnt deshalb erst mit der Entdeckung — dann aber muss es unverzüglich geschehen.',
    { rechtsbezug: '§ 377 Abs. 3 HGB', schwierigkeit: 3 },
  ),
  f.einfach(
    'wa-05',
    'Welche Temperatur muss Tiefkühlware bei der Anlieferung mindestens halten?',
    ['0 °C', '−10 °C', '−18 °C oder kälter', '+4 °C'],
    2,
    'Tiefgefrorene Lebensmittel müssen durchgehend bei −18 °C oder kälter gehalten werden. Beim Transport sind nur kurze Schwankungen nach oben erlaubt. Ist die Kühlkette unterbrochen, wird die Annahme verweigert.',
    { rechtsbezug: 'TLMV (Verordnung über tiefgefrorene Lebensmittel)', schwierigkeit: 1 },
  ),
  f.einfach(
    'wa-06',
    'Was bedeutet FEFO beim Einräumen?',
    [
      'First expired, first out: was zuerst abläuft, kommt zuerst nach vorn',
      'Fast every, fast order',
      'Frische Ware immer ganz vorn',
      'Die neueste Ware zuerst verkaufen',
    ],
    0,
    'Neue Ware kommt nach hinten, die mit dem kürzesten Datum nach vorn. So wird nichts abgeschrieben, weil es hinten im Regal abläuft. FIFO (first in, first out) ist das Gleiche nach Lieferdatum.',
    { merksatz: 'Neu nach hinten, kurz nach vorn.', schwierigkeit: 1 },
  ),
  f.einfach(
    'wa-07',
    'Wozu dient der Lieferschein bei der Warenannahme?',
    [
      'Als Zahlungsaufforderung',
      'Zum Abgleich, ob Art und Menge der gelieferten Ware stimmen',
      'Als Garantieurkunde',
      'Er ersetzt die Bestellung',
    ],
    1,
    'Der Lieferschein begleitet die Ware und zeigt, was geliefert werden soll. Die Rechnung ist die Zahlungsaufforderung und kommt oft getrennt. Verglichen wird: Bestellung, Lieferschein, tatsächliche Ware.',
    { schwierigkeit: 1 },
  ),
  f.mehrfach(
    'wa-08',
    'Was prüfst du bei der inneren Kontrolle nach der Annahme? (Mehrere richtig)',
    ['Stimmen Menge und Artikel mit der Bestellung überein?', 'Ist die Qualität einwandfrei?', 'Ist das Mindesthaltbarkeitsdatum ausreichend?', 'Wie hoch ist der Kontostand des Lieferanten?'],
    [0, 1, 2],
    'Bei der inneren Prüfung kommt alles auf den Tisch: richtige Artikel, richtige Menge, einwandfreie Qualität, ausreichend Restlaufzeit. Kurz vor Ablauf gelieferte Ware lässt sich kaum noch verkaufen.',
  ),
  f.einfach(
    'wa-09',
    'Wo lagerst du Reinigungsmittel im Lager?',
    ['Direkt über den Lebensmitteln', 'Getrennt von Lebensmitteln', 'Im Kühlraum', 'Egal, Hauptsache platzsparend'],
    1,
    'Lagergrundsatz „artgerecht lagern“: Chemikalien können auslaufen oder Gerüche übertragen. Deshalb gehören sie nie über oder neben Lebensmittel.',
    { schwierigkeit: 1 },
  ),
  f.einfach(
    'wa-10',
    'Welche Temperatur darf Hackfleisch höchstens haben?',
    ['+2 °C', '+7 °C', '+10 °C', '−18 °C'],
    0,
    'Hackfleisch verdirbt besonders schnell, weil durch das Zerkleinern viel Oberfläche für Keime entsteht. Deshalb gilt die strengste Grenze: höchstens +2 °C.',
    { rechtsbezug: 'Tier-LMHV, Anlage 3', schwierigkeit: 2 },
  ),
]
