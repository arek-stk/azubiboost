import { themaFabrik } from './_fabrik'

const f = themaFabrik('kundenkommunikation', 'verkauf')

export const kundenkommunikation = [
  f.einfach(
    'kk-01',
    'Ein Kunde ärgert sich über die unfreundliche Bedienung an der Fleischtheke. Was ist das?',
    ['Eine Reklamation', 'Eine Beschwerde', 'Ein Umtausch', 'Ein Gewährleistungsfall'],
    1,
    'Eine Reklamation betrifft einen Mangel an der Ware und gibt dem Kunden gesetzliche Rechte. Eine Beschwerde ist Unzufriedenheit ohne Rechtsanspruch — sie ist trotzdem ernst zu nehmen.',
    { schwierigkeit: 1 },
  ),
  f.einfach(
    'kk-02',
    'Eine Kundin möchte eine einwandfreie Bluse umtauschen, die ihr nicht mehr gefällt. Muss der Laden sie zurücknehmen?',
    [
      'Ja, innerhalb von 14 Tagen immer',
      'Ja, bei Vorlage des Kassenbons',
      'Nein, ein Umtausch mangelfreier Ware ist freiwillige Kulanz',
      'Nein, niemals',
    ],
    2,
    'Im Laden gibt es kein gesetzliches Rückgaberecht für einwandfreie Ware. Viele Händler tauschen trotzdem um, weil es Kunden bindet — das ist aber eine freiwillige Leistung.',
    { merksatz: 'Mangel = Recht. Kein Mangel = Kulanz.' },
  ),
  f.einfach(
    'kk-03',
    'Ein Kunde kommt verärgert zur Information. Was tust du zuerst?',
    [
      'Erklären, warum der Fehler nicht deine Schuld ist',
      'Ihn ausreden lassen und aufmerksam zuhören',
      'Sofort einen Gutschein anbieten',
      'Die Filialleitung holen, bevor er etwas sagt',
    ],
    1,
    'Wer sich ärgert, will zuerst gehört werden. Unterbrichst du oder rechtfertigst dich, steigt der Ärger. Erst zuhören, dann Verständnis zeigen, dann lösen.',
    { schwierigkeit: 1 },
  ),
  f.einfach(
    'kk-04',
    'Ein Wasserkocher ist nach acht Monaten kaputt, ohne dass der Kunde etwas falsch gemacht hat. Was kann der Kunde zuerst verlangen?',
    ['Sofort sein Geld zurück', 'Nacherfüllung: Reparatur oder einen neuen Wasserkocher', 'Nur eine Gutschrift', 'Nichts, die Garantie ist abgelaufen'],
    1,
    'Bei einem Mangel hat die Nacherfüllung Vorrang. Der Kunde darf wählen, ob repariert oder neu geliefert wird. Erst wenn das scheitert, kommen Rücktritt oder Minderung infrage.',
    { rechtsbezug: '§ 437, § 439 BGB' },
  ),
  f.einfach(
    'kk-05',
    'Ein Kunde reklamiert einen defekten Toaster, hat aber den Kassenbon nicht mehr. Was gilt?',
    [
      'Ohne Bon keine Reklamation',
      'Der Kauf kann auch anders nachgewiesen werden, etwa per Kontoauszug',
      'Der Kunde muss einen neuen Toaster kaufen',
      'Nur der Hersteller ist zuständig',
    ],
    1,
    'Der Bon ist nur ein Beweismittel. Entscheidend ist, dass der Kauf in diesem Geschäft nachgewiesen wird — ein Kontoauszug oder eine Kartenzahlung reichen oft aus.',
  ),
  f.einfach(
    'kk-06',
    'Was unterscheidet eine Garantie von der Gewährleistung?',
    [
      'Die Garantie ist gesetzlich vorgeschrieben',
      'Die Garantie ist ein freiwilliges Versprechen, meist vom Hersteller, zusätzlich zur Gewährleistung',
      'Die Gewährleistung gilt nur ein Jahr',
      'Es gibt keinen Unterschied',
    ],
    1,
    'Die Gewährleistung hat der Kunde immer gegenüber dem Verkäufer, zwei Jahre lang. Eine Garantie kommt freiwillig obendrauf — Umfang und Dauer bestimmt, wer sie gibt.',
    { rechtsbezug: '§ 438, § 443 BGB' },
  ),
  f.einfach(
    'kk-07',
    'Warum sind Beschwerden für den Markt eine Chance?',
    [
      'Weil der Kunde danach sicher nicht wiederkommt',
      'Weil sie auf Fehler hinweisen und gut gelöste Beschwerden Kunden oft stärker binden',
      'Weil der Markt dafür Geld bekommt',
      'Weil sie im Warenwirtschaftssystem gezählt werden',
    ],
    1,
    'Die meisten unzufriedenen Kunden sagen nichts — sie kommen einfach nicht wieder. Wer sich beschwert, gibt dem Markt die Gelegenheit, es besser zu machen.',
    { schwierigkeit: 1 },
  ),
  f.mehrfach(
    'kk-08',
    'Welche Sätze solltest du bei einer Reklamation vermeiden? (Mehrere richtig)',
    [
      'Da sind Sie der Erste, der sich beschwert.',
      'Dafür bin ich nicht zuständig.',
      'Danke, dass Sie mir das sagen.',
      'Ich kümmere mich sofort darum.',
    ],
    [0, 1],
    'Der erste Satz unterstellt dem Kunden, er übertreibe. Der zweite schiebt die Verantwortung weg. Beides verschärft den Ärger. Danken und handeln beruhigt.',
  ),
  f.einfach(
    'kk-09',
    'Welcher Satz ist eine Ich-Botschaft?',
    [
      'Sie drängeln sich vor!',
      'Ich möchte gern alle der Reihe nach bedienen.',
      'Das macht man nicht.',
      'Sie haben die Schlange übersehen.',
    ],
    1,
    'Ich-Botschaften sprechen aus, was du möchtest, ohne den anderen anzugreifen. Du-Botschaften klingen wie ein Vorwurf und führen schnell zum Streit.',
  ),
  f.einfach(
    'kk-10',
    'Ein Kunde reklamiert nach vier Monaten einen Mangel. Was wird zu seinen Gunsten vermutet?',
    [
      'Dass er das Gerät selbst beschädigt hat',
      'Dass der Mangel schon beim Kauf vorlag',
      'Dass die Gewährleistung abgelaufen ist',
      'Nichts, er muss alles beweisen',
    ],
    1,
    'Beim Kauf durch einen Verbraucher gilt die Beweislastumkehr: Zeigt sich ein Mangel im ersten Jahr, wird vermutet, dass er von Anfang an da war. Der Händler müsste das Gegenteil beweisen.',
    { rechtsbezug: '§ 477 BGB', schwierigkeit: 3 },
  ),
]
