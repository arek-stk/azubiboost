import { schritt, themaFabrik } from './_fabrik'

const f = themaFabrik('kasse', 'verkauf')

export const kasse = [
  f.einfach(
    'ka-01',
    'Was verlangt die Belegausgabepflicht an der Kasse?',
    [
      'Der Kunde ist verpflichtet, den Bon mitzunehmen.',
      'Ein Bon wird nur auf Wunsch des Kunden erstellt.',
      'Zu jedem Verkauf muss ein Beleg angeboten werden.',
      'Liegengelassene Bons müssen aufbewahrt werden.',
    ],
    2,
    'Seit 2020 muss bei jedem Verkauf über eine elektronische Kasse ein Beleg erstellt und dem Kunden angeboten werden, auf Papier oder digital. Mitnehmen muss der Kunde ihn nicht, und liegengelassene Bons darfst du entsorgen.',
    { rechtsbezug: '§ 146a Abs. 2 AO', schwierigkeit: 1 },
  ),
  f.einfach(
    'ka-02',
    'Eine Kundin bezahlt ihren Einkauf über 31,40 € mit einem 50-€-Schein. Wohin legst du den Schein, bis sie ihr Wechselgeld hat?',
    [
      'Sofort ins Fach für 50-€-Scheine',
      'Sichtbar auf die Ablage der Kasse',
      'Unter den Einsatz der Kassenlade',
      'In die Hand, bis das Wechselgeld raus ist',
    ],
    1,
    'Liegt der Schein sichtbar da, gibt es keinen Streit darüber, ob die Kundin mit einem 20er oder einem 50er bezahlt hat. In die Lade kommt er erst, wenn du das Wechselgeld vorgezählt hast.',
    { schwierigkeit: 1 },
  ),
  f.einfach(
    'ka-03',
    'Beim Kassieren kommt dir ein 50-€-Schein verdächtig vor. Nach der Prüfung hältst du ihn für falsch. Was tust du?',
    [
      'Ihn einbehalten und Marktleitung oder Polizei informieren',
      'Ihn zurückgeben und um einen anderen Schein bitten',
      'Ihn annehmen und beim Kassenabschluss melden',
      'Ihn annehmen, wenn der Kunde Stammkunde ist',
    ],
    0,
    'Falschgeld darf nicht wieder in Umlauf kommen. Deshalb behältst du den Schein ein und informierst die Marktleitung oder die Polizei. Bleib dabei ruhig und freundlich, denn oft weiß der Kunde selbst nicht, dass der Schein falsch ist.',
    { merksatz: 'Echtheit prüfen: fühlen, sehen, kippen.' },
  ),
  f.einfach(
    'ka-04',
    'Bei welcher Zahlungsart garantiert die Bank dem Markt die Zahlung?',
    [
      'Lastschrift mit Unterschrift (ELV)',
      'Zahlung auf Rechnung',
      'Zahlung per Scheck',
      'girocard mit PIN-Eingabe',
    ],
    3,
    'Bei der girocard mit PIN prüft die Bank online Karte, PIN und Kontodeckung und garantiert dem Händler das Geld. Beim elektronischen Lastschriftverfahren mit Unterschrift fehlt diese Garantie. Platzt die Lastschrift, trägt der Markt den Ausfall.',
  ),
  f.einfach(
    'ka-05',
    'Ein Kunde will seinen Einkauf über 12,00 € komplett mit 1-Cent-Münzen bezahlen. Was gilt?',
    [
      'Der Markt muss alle 1.200 Münzen annehmen.',
      'Der Markt muss höchstens 100 Münzen annehmen.',
      'Der Markt muss höchstens 50 Münzen annehmen.',
      'Der Markt darf Cent-Münzen ganz ablehnen.',
    ],
    2,
    'Euro-Münzen sind gesetzliches Zahlungsmittel. Außer der ausgebenden Stelle muss aber niemand mehr als 50 Münzen bei einer einzelnen Zahlung annehmen. Nimmt der Markt trotzdem mehr an, ist das freiwillig.',
    { rechtsbezug: 'Art. 11 VO (EG) Nr. 974/98', schwierigkeit: 3 },
  ),
  f.rechnen(
    'ka-06',
    'Kassenabrechnung nach deiner Schicht: Wechselgeld zu Schichtbeginn 150,00 €, Barumsatz laut Kasse 2.345,60 €, gezählter Kassenbestand 2.491,10 €. Wie hoch ist der Fehlbetrag?',
    { wert: 4.5, toleranz: 0.01, einheit: '€' },
    [
      schritt('Sollbestand ermitteln', '150,00 € + 2.345,60 €', 'Soll = 2.495,60 €', 'Das Wechselgeld vom Schichtbeginn gehört zum Sollbestand dazu.'),
      schritt('Mit dem Istbestand vergleichen', '2.495,60 € − 2.491,10 €', 'Fehlbetrag = 4,50 €'),
    ],
    'Der Sollbestand ist das, was in der Kasse sein müsste: Wechselgeld plus Bareinnahmen. Liegt der gezählte Istbestand darunter, fehlt Geld. Die Differenz wird im Kassenprotokoll festgehalten und nicht aus eigener Tasche ausgeglichen.',
    { schwierigkeit: 2 },
  ),
  f.rechnen(
    'ka-07',
    'Ein Kunde kauft eine Bratpfanne für 23,80 € und möchte wissen, wie viel Umsatzsteuer (19 %) im Preis steckt. Berechne den Betrag.',
    { wert: 3.8, toleranz: 0.01, einheit: '€' },
    [
      schritt('Netto herausrechnen', '23,80 € ÷ 1,19', 'Netto = 20,00 €'),
      schritt('Steuer als Differenz', '23,80 € − 20,00 €', 'Umsatzsteuer = 3,80 €', 'Rechne nicht 19 % von 23,80 €. Das ergäbe 4,52 € und wäre zu viel.'),
    ],
    'Die Umsatzsteuer ist im Bruttopreis schon enthalten. Deshalb ermittelst du zuerst den Nettopreis (Brutto geteilt durch 1,19) und bildest dann die Differenz.',
    { schwierigkeit: 1 },
  ),
  f.einfach(
    'ka-08',
    'Eine 16-Jährige möchte eine Flasche Sekt und eine Dose Wodka-Lemon kaufen. Was darfst du ihr verkaufen?',
    ['Nur den Sekt', 'Nur den Wodka-Lemon', 'Beides', 'Nichts von beidem'],
    0,
    'Bier, Wein und Sekt darfst du an Jugendliche ab 16 verkaufen. Spirituosen und alle Getränke, die Branntwein enthalten, auch fertige Mischgetränke wie Wodka-Lemon, gibt es erst ab 18.',
    { rechtsbezug: '§ 9 JuSchG', merksatz: 'Bier, Wein und Sekt ab 16, alles mit Branntwein ab 18.' },
  ),
  f.einfach(
    'ka-09',
    'Ab welchem Alter dürfen Tabakwaren und E-Zigaretten verkauft werden?',
    ['Ab 16', 'Ab 18', 'Ab 21', 'Ab 16 mit Einverständnis der Eltern'],
    1,
    'Tabakwaren, E-Zigaretten und E-Shishas dürfen nur an Erwachsene abgegeben werden. Das gilt auch für Produkte ohne Nikotin, und eine Erlaubnis der Eltern ändert daran nichts.',
    { rechtsbezug: '§ 10 JuSchG', schwierigkeit: 1 },
  ),
  f.einfach(
    'ka-10',
    'Ein junger Kunde will eine Flasche Wodka kaufen. Du bist nicht sicher, ob er schon 18 ist. Was tust du?',
    [
      'Verkaufen, weil er älter aussieht',
      'Fragen, wie alt er ist, und ihm glauben',
      'Eine Kollegin um ihre Einschätzung bitten',
      'Sich den Ausweis zeigen lassen',
    ],
    3,
    'Im Zweifel musst du das Alter überprüfen, zum Beispiel mit Personalausweis, Reisepass oder Führerschein. Kann der Kunde keinen Nachweis zeigen, verkaufst du nicht. Verstöße gegen das Jugendschutzgesetz können für den Markt teure Bußgelder bedeuten.',
    { rechtsbezug: '§ 2 Abs. 2 JuSchG', schwierigkeit: 1 },
  ),
]
