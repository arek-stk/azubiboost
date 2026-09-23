import { themaFabrik } from './_fabrik'

const f = themaFabrik('kundenkommunikation', 'verkauf')

export const kundenkommunikation = [
  f.einfach(
    'kk-01',
    'Ein Kunde kommt zur Information, weil er an der Fleischtheke unfreundlich bedient wurde. Worum handelt es sich?',
    ['Eine Reklamation', 'Ein Umtauschwunsch', 'Eine Beschwerde', 'Ein Gewährleistungsfall'],
    2,
    'Der Kunde ist mit dem Service unzufrieden, an der Ware selbst ist nichts falsch. Das ist eine Beschwerde. Eine Reklamation bezieht sich auf mangelhafte Ware und gibt dem Kunden gesetzliche Rechte.',
    { schwierigkeit: 1 },
  ),
  f.einfach(
    'kk-02',
    'Eine Kundin möchte eine originalverpackte Thermoskanne aus der Aktionsware zurückgeben, weil ihr die Farbe nicht gefällt. Muss der Markt die Kanne zurücknehmen?',
    [
      'Ja, innerhalb von 14 Tagen nach dem Kauf',
      'Ja, wenn sie den Kassenbon vorlegt',
      'Ja, aber nur gegen einen Gutschein',
      'Nein, eine Rücknahme ist freiwillige Kulanz',
    ],
    3,
    'Für einwandfreie Ware, die im Laden gekauft wurde, gibt es kein gesetzliches Umtausch- oder Rückgaberecht. Das 14-tägige Widerrufsrecht gilt zum Beispiel bei Onlinekäufen, nicht im Laden. Nimmt der Markt die Kanne trotzdem zurück, ist das Kulanz.',
    { merksatz: 'Ohne Mangel ist ein Umtausch Kulanz.' },
  ),
  f.einfach(
    'kk-03',
    'Ein Kunde kommt verärgert an die Information. Was tust du zuerst?',
    [
      'Ihn ausreden lassen und zuhören',
      'Ihm erklären, dass dich keine Schuld trifft',
      'Ihm sofort einen Einkaufsgutschein anbieten',
      'Gleich die Marktleitung dazuholen',
    ],
    0,
    'Wer sich ärgert, will zuerst gehört werden. Unterbrichst du ihn oder rechtfertigst dich, wird der Ärger größer. Danach zeigst du Verständnis und suchst mit ihm eine Lösung.',
    { schwierigkeit: 1 },
  ),
  f.einfach(
    'kk-04',
    'Ein Wasserkocher aus der Aktionsware ist nach acht Monaten kaputt, obwohl der Kunde ihn richtig benutzt hat. Was kann der Kunde zuerst verlangen?',
    [
      'Den vollen Kaufpreis zurück',
      'Eine Reparatur oder ein neues Gerät',
      'Einen Teil des Kaufpreises zurück',
      'Einen Gutschein über den Kaufpreis',
    ],
    1,
    'Bei einem Mangel hat die Nacherfüllung Vorrang. Der Kunde kann wählen, ob der Wasserkocher repariert oder gegen einen neuen getauscht wird. Rücktritt (Geld zurück) oder Minderung (ein Teil des Preises zurück) kommen erst infrage, wenn die Nacherfüllung scheitert.',
    { rechtsbezug: '§ 437, § 439 BGB' },
  ),
  f.einfach(
    'kk-05',
    'Ein Kunde reklamiert einen defekten Toaster, hat den Kassenbon aber nicht mehr. Was gilt?',
    [
      'Ohne Kassenbon ist keine Reklamation möglich',
      'Der Kunde muss sich an den Hersteller wenden',
      'Der Kauf kann auch anders nachgewiesen werden',
      'Ohne Kassenbon bleibt nur eine Kulanzlösung',
    ],
    2,
    'Der Kassenbon ist nur ein Beweismittel. Es reicht, wenn der Kunde den Kauf bei euch anders belegen kann, zum Beispiel mit dem Kontoauszug einer Kartenzahlung. Ansprechpartner für die Gewährleistung ist der Markt als Verkäufer.',
  ),
  f.einfach(
    'kk-06',
    'Was unterscheidet die Garantie von der Gewährleistung?',
    [
      'Die Gewährleistung gilt per Gesetz, die Garantie ist freiwillig.',
      'Die Garantie gilt per Gesetz, die Gewährleistung ist freiwillig.',
      'Die Garantie ersetzt nach einem Jahr die Gewährleistung.',
      'Beide gelten zwei Jahre, aber nur gegenüber dem Hersteller.',
    ],
    0,
    'Die Gewährleistung hat der Kunde per Gesetz gegenüber dem Verkäufer, bei neuer Ware zwei Jahre lang. Eine Garantie gibt meist der Hersteller freiwillig dazu und legt Umfang und Dauer selbst fest. Die Gewährleistung bleibt daneben voll bestehen.',
    { rechtsbezug: '§ 438, § 443 BGB' },
  ),
  f.einfach(
    'kk-07',
    'Warum ist eine Kundenbeschwerde für den Markt auch eine Chance?',
    [
      'Der Markt erfährt, welcher Mitarbeiter schuld ist.',
      'Der Markt kann den Kunden direkt auf Angebote hinweisen.',
      'Der Markt erfährt von Fehlern und kann den Kunden halten.',
      'Der Markt spart sich eine eigene Kundenbefragung.',
    ],
    2,
    'Viele unzufriedene Kunden sagen nichts und kaufen künftig woanders. Wer sich beschwert, gibt euch die Gelegenheit, den Fehler abzustellen. Wird die Beschwerde gut gelöst, bindet das den Kunden oft stärker als vorher.',
    { schwierigkeit: 1 },
  ),
  f.mehrfach(
    'kk-08',
    'Welche Sätze solltest du bei einer Reklamation vermeiden? (Mehrere richtig)',
    [
      'Da sind Sie der Erste, der sich beschwert.',
      'Danke, dass Sie mir das sagen.',
      'Das kann eigentlich gar nicht sein.',
      'Dafür bin ich nicht zuständig.',
      'Ich kümmere mich gleich darum.',
    ],
    [0, 2, 3],
    'Mit „Da sind Sie der Erste“ und „Das kann gar nicht sein“ unterstellst du dem Kunden, dass er übertreibt oder sich irrt. „Dafür bin ich nicht zuständig“ schiebt die Verantwortung weg. Ein Dank und das Versprechen, dich zu kümmern, beruhigen den Kunden dagegen.',
  ),
  f.einfach(
    'kk-09',
    'Ein Kunde drängelt sich an deiner Kasse vor. Welcher Satz ist eine Ich-Botschaft?',
    [
      'Sie haben sich gerade vorgedrängelt.',
      'Das macht man hier aber nicht.',
      'Sie haben wohl die Schlange übersehen.',
      'Ich möchte gern alle der Reihe nach bedienen.',
    ],
    3,
    'In einer Ich-Botschaft sagst du, was du möchtest, ohne den anderen anzugreifen. Du-Botschaften wie „Sie haben sich vorgedrängelt“ klingen nach Vorwurf, und der Kunde geht in die Verteidigung.',
  ),
  f.einfach(
    'kk-10',
    'Ein Kunde bringt einen Stabmixer zurück, der nach vier Monaten nicht mehr funktioniert. Was vermutet das Gesetz in diesem Fall?',
    [
      'Dass der Kunde das Gerät falsch bedient hat',
      'Dass der Mangel schon beim Kauf vorlag',
      'Dass es sich um normalen Verschleiß handelt',
      'Dass der Hersteller für den Mangel haftet',
    ],
    1,
    'Kauft ein Verbraucher bei einem Händler, gilt die Beweislastumkehr: Zeigt sich ein Mangel innerhalb eines Jahres nach der Übergabe, wird vermutet, dass er schon beim Kauf da war. Will der Markt das bestreiten, muss er das Gegenteil beweisen.',
    { rechtsbezug: '§ 477 BGB', schwierigkeit: 3 },
  ),
]
