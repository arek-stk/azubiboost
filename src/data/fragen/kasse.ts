import { schritt, themaFabrik } from './_fabrik'

const f = themaFabrik('kasse', 'verkauf')

export const kasse = [
  f.einfach(
    'ka-01',
    'Was verlangt die Belegausgabepflicht?',
    [
      'Der Kunde muss den Bon mitnehmen',
      'Jedem Kunden muss ein Beleg angeboten werden, auf Papier oder digital',
      'Belege gibt es nur ab 10 € Einkaufswert',
      'Der Markt muss alle Bons zehn Jahre aufbewahren',
    ],
    1,
    'Seit 2020 muss bei jedem Verkauf über eine elektronische Kasse ein Beleg erstellt und angeboten werden. Mitnehmen muss der Kunde ihn nicht.',
    { rechtsbezug: '§ 146a Abs. 2 AO', schwierigkeit: 1 },
  ),
  f.einfach(
    'ka-02',
    'Eine Kundin zahlt mit einem 50-€-Schein. Wo legst du den Schein hin, bis das Wechselgeld übergeben ist?',
    [
      'Sofort in die Kassenlade',
      'Sichtbar auf die Ablage, bis das Wechselgeld vorgezählt ist',
      'In die Hosentasche',
      'Zurück zur Kundin',
    ],
    1,
    'Bleibt der Schein sichtbar liegen, gibt es keinen Streit darüber, ob es ein 20er oder ein 50er war. Erst nach dem Vorzählen des Wechselgelds kommt er in die Lade.',
    { schwierigkeit: 1 },
  ),
  f.einfach(
    'ka-03',
    'Du hältst einen 50-€-Schein für Falschgeld. Was tust du?',
    [
      'Ihn dem Kunden zurückgeben und um einen anderen bitten',
      'Ihn einbehalten und Vorgesetzte oder Polizei informieren',
      'Ihn trotzdem annehmen, um keinen Ärger zu machen',
      'Ihn zerreißen',
    ],
    1,
    'Falschgeld darf nicht wieder in Umlauf kommen — also nicht zurückgeben. Prüfen nach „Fühlen – Sehen – Kippen“, bei echtem Verdacht einbehalten und die Polizei verständigen. Ruhig und freundlich bleiben: der Kunde weiß es oft selbst nicht.',
    { merksatz: 'Fühlen – Sehen – Kippen.' },
  ),
  f.einfach(
    'ka-04',
    'Welche Zahlungsart gibt dem Händler eine Zahlungsgarantie der Bank?',
    [
      'Lastschrift mit Unterschrift',
      'girocard mit PIN-Eingabe',
      'Zahlung auf Rechnung',
      'Scheck',
    ],
    1,
    'Bei der girocard mit PIN prüft die Bank Karte und Kontodeckung und garantiert die Zahlung. Beim elektronischen Lastschriftverfahren mit Unterschrift trägt der Händler das Risiko, dass die Lastschrift platzt.',
  ),
  f.einfach(
    'ka-05',
    'Ein Kunde will 12 € komplett in 1-Cent-Münzen bezahlen. Was gilt?',
    [
      'Der Markt muss alles annehmen',
      'Niemand ist verpflichtet, mehr als 50 Münzen bei einer Zahlung anzunehmen',
      'Münzen sind kein gesetzliches Zahlungsmittel',
      'Nur Banken dürfen Münzen annehmen',
    ],
    1,
    'Euro-Münzen sind gesetzliches Zahlungsmittel, aber außer der ausgebenden Stelle muss niemand mehr als 50 Münzen bei einer einzelnen Zahlung annehmen. Freiwillig geht natürlich mehr.',
    { rechtsbezug: 'Art. 11 VO (EG) Nr. 974/98', schwierigkeit: 3 },
  ),
  f.rechnen(
    'ka-06',
    'Kassenabrechnung: Wechselgeld zu Schichtbeginn 150,00 €, Barumsatz laut Kasse 2.345,60 €, gezählter Kassenbestand 2.491,10 €. Wie hoch ist der Fehlbetrag?',
    { wert: 4.5, toleranz: 0.01, einheit: '€' },
    [
      schritt('Sollbestand ermitteln', '150,00 € + 2.345,60 €', 'Soll = 2.495,60 €', 'Das Wechselgeld vom Schichtbeginn gehört zum Sollbestand dazu.'),
      schritt('Mit dem Istbestand vergleichen', '2.495,60 € − 2.491,10 €', 'Fehlbetrag = 4,50 €'),
    ],
    'Eine Kassendifferenz entsteht meist durch falsch herausgegebenes Wechselgeld. Sie wird dokumentiert, nicht aus eigener Tasche ausgeglichen.',
    { schwierigkeit: 2 },
  ),
  f.rechnen(
    'ka-07',
    'Ein Kunde möchte wissen, wie viel Umsatzsteuer in seinem Einkauf über 23,80 € (19 %) steckt.',
    { wert: 3.8, toleranz: 0.01, einheit: '€' },
    [
      schritt('Netto herausrechnen', '23,80 € ÷ 1,19', 'Netto = 20,00 €'),
      schritt('Steuer als Differenz', '23,80 € − 20,00 €', 'Umsatzsteuer = 3,80 €', 'Nicht 19 % von 23,80 € — das ergäbe 4,52 € und ist falsch.'),
    ],
    'Die Steuer steckt im Bruttobetrag. Erst Netto ermitteln, dann die Differenz bilden.',
    { schwierigkeit: 1 },
  ),
  f.einfach(
    'ka-08',
    'Eine 16-Jährige möchte eine Flasche Sekt und ein Wodka-Mischgetränk kaufen. Was darfst du verkaufen?',
    ['Beides', 'Nur den Sekt', 'Nur das Mischgetränk', 'Nichts von beidem'],
    1,
    'Bier, Wein und Sekt dürfen an Jugendliche ab 16 verkauft werden. Alles mit Branntwein — Spirituosen und daraus gemischte Getränke — erst ab 18.',
    { rechtsbezug: '§ 9 JuSchG', merksatz: 'Bier, Wein, Sekt ab 16. Schnaps und Alkopops ab 18.' },
  ),
  f.einfach(
    'ka-09',
    'Ab welchem Alter dürfen E-Zigaretten und Tabakwaren verkauft werden?',
    ['Ab 16', 'Ab 18', 'Ab 21', 'Ab 16 mit Erlaubnis der Eltern'],
    1,
    'Tabakwaren, E-Zigaretten und E-Shishas — auch ohne Nikotin — dürfen nur an Erwachsene abgegeben werden. Im Zweifel den Ausweis zeigen lassen.',
    { rechtsbezug: '§ 10 JuSchG', schwierigkeit: 1 },
  ),
  f.einfach(
    'ka-10',
    'Du bist nicht sicher, ob ein junger Kunde schon 18 ist. Er will Wodka kaufen. Was tust du?',
    [
      'Verkaufen, er sieht älter aus',
      'Den Ausweis zeigen lassen und ohne Nachweis nicht verkaufen',
      'Einen Kollegen schätzen lassen',
      'Nur eine kleine Flasche verkaufen',
    ],
    1,
    'Im Zweifel muss das Alter nachgewiesen werden. Verstöße gegen das Jugendschutzgesetz können für den Markt teure Bußgelder bedeuten — und die Kasse ist dafür verantwortlich.',
    { rechtsbezug: '§ 2 Abs. 2 JuSchG', schwierigkeit: 1 },
  ),
]
