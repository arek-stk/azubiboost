import { themaFabrik } from './_fabrik'

const f = themaFabrik('verkaufsgespraech', 'verkauf')

export const verkaufsgespraech = [
  f.einfach(
    'vk-01',
    'In welcher Reihenfolge laufen die Phasen eines Verkaufsgesprächs ab?',
    [
      'Kontaktaufnahme, Warenvorlage, Bedarfsermittlung, Argumentation, Abschluss',
      'Bedarfsermittlung, Kontaktaufnahme, Warenvorlage, Argumentation, Abschluss',
      'Kontaktaufnahme, Bedarfsermittlung, Argumentation, Warenvorlage, Abschluss',
      'Kontaktaufnahme, Bedarfsermittlung, Warenvorlage, Argumentation, Abschluss',
    ],
    3,
    'Zuerst nimmst du Kontakt auf, dann findest du heraus, was der Kunde braucht. Erst danach zeigst du passende Ware und überzeugst mit ihrem Nutzen. Wer die Bedarfsermittlung überspringt, legt oft das Falsche vor.',
    { schwierigkeit: 1 },
  ),
  f.einfach(
    'vk-02',
    'Ein Kunde steht unschlüssig vor dem Weinregal. Welche Frage ist eine offene Frage?',
    [
      'Zu welchem Anlass suchen Sie den Wein?',
      'Soll es ein Rotwein sein?',
      'Möchten Sie lieber einen trockenen Wein?',
      'Haben Sie unsere Eigenmarke schon probiert?',
    ],
    0,
    'Offene Fragen beginnen mit einem Fragewort wie was, wie oder wozu und lassen sich nicht mit Ja oder Nein beantworten. Der Kunde erzählt mehr, und du erfährst, worauf es ihm ankommt.',
    { merksatz: 'Offene Fragen beginnen mit einem W-Fragewort.', schwierigkeit: 1 },
  ),
  f.einfach(
    'vk-03',
    'Du berätst eine Kundin zu einer Kaffeedose mit Vakuumdeckel. Welcher Satz ist im Sie-Stil formuliert?',
    [
      'Die Dose hat einen dichten Vakuumdeckel.',
      'In der Dose bleibt Ihr Kaffee lange aromatisch.',
      'Wir haben die Dose neu im Sortiment.',
      'Ich finde die Dose mit dem Deckel praktisch.',
    ],
    1,
    'Beim Sie-Stil sprichst du die Kundin direkt an und zeigst ihr, welchen Vorteil sie hat. Aus dem Merkmal Vakuumdeckel wird so der Nutzen, dass der Kaffee lange frisch bleibt. Die übrigen Sätze beschreiben nur die Ware oder sprechen aus Sicht des Verkäufers.',
  ),
  f.einfach(
    'vk-04',
    'Eine Kundin ist sich beim Kaffee fast sicher, zögert aber noch. Mit welcher Frage führst du den Kaufabschluss am besten herbei?',
    [
      'Möchten Sie den Kaffee jetzt mitnehmen?',
      'Soll ich Ihnen noch eine andere Sorte zeigen?',
      'Nehmen Sie die 500-g- oder die 1-kg-Packung?',
      'Wollen Sie es sich noch einmal überlegen?',
    ],
    2,
    'Die Alternativfrage lässt der Kundin die Wahl zwischen zwei Möglichkeiten, die beide zum Kauf führen. Das erleichtert ihr die Entscheidung, ohne Druck zu machen. Auf eine direkte Ja-Nein-Frage kommt dagegen schnell ein Nein.',
  ),
  f.einfach(
    'vk-05',
    'Was versteht man bei der Preisnennung unter der Sandwich-Methode?',
    [
      'Den Preis zwischen zwei Nutzenargumenten nennen',
      'Den Preis zu Beginn und am Ende nennen',
      'Den Preis erst an der Kasse nennen',
      'Einen teuren und einen günstigen Artikel zeigen',
    ],
    0,
    'Du nennst zuerst einen Vorteil, dann den Preis und gleich danach noch einen Vorteil. So verbindet der Kunde den Preis sofort mit dem, was er dafür bekommt.',
    { schwierigkeit: 1 },
  ),
  f.einfach(
    'vk-06',
    'Wann bietest du einem Kunden am besten Ergänzungsartikel an?',
    [
      'Schon bei der Begrüßung',
      'Während der Bedarfsermittlung',
      'Nach dem Bezahlen an der Kasse',
      'Nach der Entscheidung für den Hauptartikel',
    ],
    3,
    'Hat sich der Kunde für den Hauptartikel entschieden, ist er offen für Passendes dazu: zum Grillfleisch die Marinade, zur Pasta den Parmesan. Vorher lenkt das Angebot ab, nach dem Bezahlen kommt es zu spät.',
    { schwierigkeit: 1 },
  ),
  f.einfach(
    'vk-07',
    'Eine Kundin sagt an der Aktionsfläche: „Die Pfanne ist mir zu teuer.“ Welche Antwort folgt der Ja-aber-Methode?',
    [
      'Nein, teuer ist die Pfanne wirklich nicht.',
      'Stimmt, dafür hält die Beschichtung viel länger.',
      'Womit vergleichen Sie den Preis denn?',
      'Gerade wegen der Qualität lohnt sich der Preis.',
    ],
    1,
    'Bei der Ja-aber-Methode (bedingte Zustimmung) gibst du der Kundin zuerst recht und bringst dann ein Argument, das den Einwand ausgleicht. Statt „aber“ sagst du besser „dafür“, sonst wirkt die Zustimmung gleich wieder zurückgenommen. Direkter Widerspruch macht Kunden eher stur.',
  ),
  f.mehrfach(
    'vk-08',
    'Ein Kunde betritt die Weinabteilung und sieht sich um. Was gehört zu einer guten Kontaktaufnahme? (Mehrere richtig)',
    [
      'Blickkontakt aufnehmen und freundlich grüßen',
      'Gleich das aktuelle Wochenangebot empfehlen',
      'Ihm Zeit lassen, sich umzusehen',
      'Weiter einräumen, bis er etwas fragt',
      'In der Nähe bleiben und ansprechbar sein',
    ],
    [0, 2, 4],
    'Kunden möchten bemerkt, aber nicht bedrängt werden. Wer weiter einräumt, wirkt desinteressiert. Ein Angebot vor der Bedarfsermittlung kommt dagegen aufdringlich an.',
  ),
  f.einfach(
    'vk-09',
    'Ein Kunde sucht eine bestimmte Sorte Kaffeepads, die gerade ausverkauft ist. Wie reagierst du am besten?',
    [
      'Ihm sagen, dass die Sorte ausverkauft ist',
      'Ihm eine andere Filiale in der Nähe empfehlen',
      'Eine ähnliche Sorte zeigen und eine Bestellung anbieten',
      'Ihn bitten, in ein paar Tagen wiederzukommen',
    ],
    2,
    'Mit einer passenden Alternative bleibt der Kauf bei euch im Markt. Sie muss denselben Zweck erfüllen, sonst fühlt sich der Kunde abgespeist. Bietest du zusätzlich an, die gewünschte Sorte zu bestellen, nimmst du seinen Wunsch ernst.',
    { schwierigkeit: 1 },
  ),
  f.einfach(
    'vk-10',
    'Eine Kundin sagt am Kühlregal zu dir: „Die fettarme Milch ist ja schon wieder aus.“ Welche Aussage gibt die Appellseite der Nachricht wieder (Vier-Seiten-Modell nach Schulz von Thun)?',
    [
      'Im Regal steht keine fettarme Milch mehr.',
      'Ich ärgere mich darüber.',
      'Bitte füllen Sie die Milch nach.',
      'Sie haben das Regal nicht im Blick.',
    ],
    2,
    'Der Appell ist das, was die Kundin von dir möchte: dass du nachfüllst. Die anderen Antworten gehören zu den übrigen Seiten der Nachricht: Sachinhalt (keine Milch da), Selbstoffenbarung (sie ärgert sich) und Beziehung (was sie von dir hält).',
    { merksatz: 'Jede Nachricht hat vier Seiten: Sachinhalt, Selbstoffenbarung, Beziehung und Appell.' },
  ),
]
