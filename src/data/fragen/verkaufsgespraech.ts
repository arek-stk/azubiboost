import { themaFabrik } from './_fabrik'

const f = themaFabrik('verkaufsgespraech', 'verkauf')

export const verkaufsgespraech = [
  f.einfach(
    'vk-01',
    'Welche Reihenfolge der Phasen im Verkaufsgespräch ist richtig?',
    [
      'Warenvorlage – Kontaktaufnahme – Bedarfsermittlung – Abschluss',
      'Kontaktaufnahme – Bedarfsermittlung – Warenvorlage – Argumentation – Abschluss',
      'Bedarfsermittlung – Preisnennung – Kontaktaufnahme – Abschluss',
      'Argumentation – Warenvorlage – Kontaktaufnahme – Abschluss',
    ],
    1,
    'Erst ins Gespräch kommen, dann herausfinden, was gebraucht wird, dann passende Ware zeigen und mit dem Nutzen überzeugen. Wer die Bedarfsermittlung überspringt, zeigt oft das Falsche.',
    { schwierigkeit: 1 },
  ),
  f.einfach(
    'vk-02',
    'Welche Frage ist eine offene Frage?',
    [
      'Soll es ein Rotwein sein?',
      'Möchten Sie die große Packung?',
      'Zu welchem Anlass suchen Sie den Wein?',
      'Haben Sie schon unsere Eigenmarke probiert?',
    ],
    2,
    'Offene Fragen beginnen mit einem W-Wort und lassen sich nicht mit Ja oder Nein beantworten. Der Kunde erzählt — und du erfährst, was er wirklich braucht.',
    { merksatz: 'W-Fragen öffnen das Gespräch, Ja/Nein-Fragen schließen es.', schwierigkeit: 1 },
  ),
  f.einfach(
    'vk-03',
    'Welcher Satz ist im Sie-Stil formuliert?',
    [
      'Die Dose hat einen Vakuumdeckel.',
      'Mit dem Vakuumdeckel bleibt Ihr Kaffee wochenlang aromatisch.',
      'Wir haben diese Dose neu im Sortiment.',
      'Ich finde die Dose sehr praktisch.',
    ],
    1,
    'Der Sie-Stil übersetzt ein Merkmal (Vakuumdeckel) in einen Vorteil für den Kunden (Kaffee bleibt aromatisch). Kunden kaufen keinen Deckel, sie kaufen frischen Kaffee.',
  ),
  f.einfach(
    'vk-04',
    'Mit welcher Frage führst du den Kaufabschluss am geschicktesten herbei?',
    [
      'Wollen Sie das jetzt kaufen oder nicht?',
      'Nehmen Sie lieber die 500-g- oder die 1-kg-Packung?',
      'Soll ich Ihnen noch etwas anderes zeigen?',
      'Brauchen Sie noch Bedenkzeit?',
    ],
    1,
    'Die Alternativfrage lässt die Wahl zwischen zwei Möglichkeiten, die beide ein Kauf sind. Das hilft unentschlossenen Kunden bei der Entscheidung, ohne sie zu drängen.',
  ),
  f.einfach(
    'vk-05',
    'Was ist die Sandwich-Methode bei der Preisnennung?',
    [
      'Den Preis zweimal nennen',
      'Den Preis zwischen zwei Nutzenargumente packen',
      'Den Preis erst an der Kasse nennen',
      'Einen günstigen und einen teuren Artikel gemeinsam anbieten',
    ],
    1,
    'Nutzen – Preis – Nutzen. So steht der Preis nicht allein im Raum, sondern wird gleich mit einem Grund verbunden, warum er sich lohnt.',
    { schwierigkeit: 1 },
  ),
  f.einfach(
    'vk-06',
    'Wann ist der richtige Moment für ein Ergänzungsangebot?',
    [
      'Gleich bei der Begrüßung',
      'Nach der Kaufentscheidung, bevor der Kunde zur Kasse geht',
      'Erst nach dem Bezahlen',
      'Nur wenn der Kunde danach fragt',
    ],
    1,
    'Hat sich der Kunde entschieden, passt ein Hinweis auf Ergänzendes: zum Grillfleisch die Marinade, zur Pasta der Parmesan. Vorher lenkt es ab, nach dem Bezahlen ist es zu spät.',
    { schwierigkeit: 1 },
  ),
  f.einfach(
    'vk-07',
    'Eine Kundin sagt: „Der ist mir zu teuer.“ Welche Antwort folgt der Ja-aber-Methode?',
    [
      'Nein, der ist gar nicht teuer.',
      'Da haben Sie recht, er kostet etwas mehr — dafür hält er doppelt so lange.',
      'Dann nehmen Sie doch den billigen.',
      'Das sagen alle.',
    ],
    1,
    'Bei der Ja-aber-Methode (bedingte Zustimmung) gibst du dem Kunden erst recht und bringst dann ein Gegenargument. Widerspruch ohne Zustimmung macht Kunden stur.',
  ),
  f.mehrfach(
    'vk-08',
    'Was gehört zu einer guten Kontaktaufnahme? (Mehrere richtig)',
    [
      'Blickkontakt und freundliche Begrüßung',
      'Einen stöbernden Kunden sich erst in Ruhe umsehen lassen',
      'Aufmerksam und ansprechbar in der Nähe bleiben',
      'Sofort ein Sonderangebot anpreisen',
      'Mit verschränkten Armen abwarten',
    ],
    [0, 1, 2],
    'Kunden wollen wahrgenommen, aber nicht bedrängt werden. Verschränkte Arme wirken abweisend, ein Angebot ohne Bedarfsermittlung wirkt aufdringlich.',
  ),
  f.einfach(
    'vk-09',
    'Ein Kunde fragt nach einem Artikel, der ausverkauft ist. Wie reagierst du am besten?',
    [
      'Sagen, dass der Artikel nicht da ist',
      'Einen Artikel mit ähnlichem Nutzen zeigen und anbieten, den gewünschten zu bestellen',
      'Auf die nächste Filiale verweisen',
      'Den Kunden bitten, morgen wiederzukommen',
    ],
    1,
    'Ein Alternativangebot hält den Kauf im Laden. Wichtig ist, dass die Alternative denselben Zweck erfüllt — sonst fühlt sich der Kunde abgespeist.',
    { schwierigkeit: 1 },
  ),
  f.einfach(
    'vk-10',
    'Eine Kundin sagt: „Die Milch ist schon wieder leer.“ Was steckt auf der Appellebene (Schulz von Thun) dahinter?',
    ['Im Regal ist keine Milch mehr.', 'Ich bin genervt.', 'Bitte füllen Sie die Milch nach.', 'Sie arbeiten hier schlecht.'],
    2,
    'Jede Nachricht hat vier Seiten: Sachinhalt (keine Milch da), Selbstoffenbarung (ich bin genervt), Beziehung (was ich von dir halte) und Appell (was ich von dir will). Der Appell ist hier die Bitte ums Nachfüllen.',
    { merksatz: 'Sache, Selbstoffenbarung, Beziehung, Appell — vier Ohren für eine Nachricht.' },
  ),
]
