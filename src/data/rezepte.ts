/**
 * Rezepte: für jeden Aufgabentyp die Reihenfolge, in der man vorgeht.
 * Geschrieben für Stift, Papier und einen normalen Taschenrechner. Kurz genug,
 * um sie in der Prüfung Schritt für Schritt abzuarbeiten.
 */

import type { AufgabentypId } from '../engine/rechenaufgaben'

export type Rezept = { schritte: string[]; merke: string }

export const REZEPTE: Record<AufgabentypId, Rezept> = {
  bezugspreis: {
    schritte: [
      'Schreib den Listeneinkaufspreis oben auf dein Blatt.',
      'Rechne den Rabatt in Euro aus: Listeneinkaufspreis mal Rabattsatz, dann geteilt durch 100. Zieh ihn ab. Das ist der Zieleinkaufspreis.',
      'Rechne das Skonto in Euro aus, diesmal vom Zieleinkaufspreis: Zieleinkaufspreis mal Skontosatz, geteilt durch 100. Zieh es ab. Das ist der Bareinkaufspreis.',
      'Zähl Fracht und andere Bezugskosten dazu. Das Ergebnis ist der Bezugspreis.',
    ],
    merke: 'Erst Rabatt, dann Skonto, dann Bezugskosten. Jeder Schritt rechnet mit dem Ergebnis der Zeile davor.',
  },
  verkaufspreis: {
    schritte: [
      'Schreib den Bezugspreis oben auf dein Blatt.',
      'Rechne die Handlungskosten in Euro aus: Bezugspreis mal Handlungskostensatz, geteilt durch 100. Zähl sie dazu. Das sind die Selbstkosten.',
      'Rechne den Gewinn in Euro aus: Selbstkosten mal Gewinnsatz, geteilt durch 100. Zähl ihn dazu. Das ist der Nettoverkaufspreis.',
      'Rechne die Umsatzsteuer aus: Nettoverkaufspreis mal 19 (oder 7), geteilt durch 100. Zähl sie dazu. Das ist der Bruttoverkaufspreis.',
    ],
    merke: 'Jeder Zuschlag wird vom Ergebnis der Zeile darüber gerechnet. Rechne nie alles vom Bezugspreis.',
  },
  'verkaufspreis-komplett': {
    schritte: [
      'Selbstkosten: Bezugspreis plus Handlungskosten. Bei 30 % Handlungskosten geht das in einem Schritt: Bezugspreis mal 1,30.',
      'Barverkaufspreis: Selbstkosten plus Gewinn. Bei 15 % Gewinn: Selbstkosten mal 1,15.',
      'Kundenskonto einrechnen: Barverkaufspreis geteilt durch (100 minus Skontosatz), dann mal 100. Bei 2 % Skonto heißt das: geteilt durch 98, mal 100. Das ist der Zielverkaufspreis.',
      'Kundenrabatt einrechnen: Zielverkaufspreis geteilt durch (100 minus Rabattsatz), dann mal 100. Das ist der Nettoverkaufspreis.',
      'Nettoverkaufspreis mal 1,19. Das ist der Bruttoverkaufspreis.',
    ],
    merke: 'Skonto und Rabatt zieht der Kunde später wieder ab. Deshalb rechnest du sie im Hundert ein: geteilt durch (100 minus Prozent), dann mal 100.',
  },
  rueckwaerts: {
    schritte: [
      'Fang mit dem Marktpreis an. Das ist der Bruttoverkaufspreis.',
      'Steuer rausrechnen: Bruttoverkaufspreis geteilt durch 1,19 (bei 7 % geteilt durch 1,07). Das ist der Nettoverkaufspreis.',
      'Gewinn rausrechnen: Nettoverkaufspreis geteilt durch (100 plus Gewinnsatz), dann mal 100. Bei 10 % Gewinn heißt das: geteilt durch 110, mal 100. Das sind die Selbstkosten.',
      'Handlungskosten rausrechnen: Selbstkosten geteilt durch (100 plus Handlungskostensatz), dann mal 100. Das ist der höchste Bezugspreis, den der Markt zahlen kann.',
    ],
    merke: 'Rückwärts wird aus jedem Aufschlag ein Teilen: durch (100 plus Prozent), dann mal 100. Wer die Prozent abzieht, bekommt ein falsches Ergebnis.',
  },
  differenz: {
    schritte: [
      'Von oben rechnen: Bezugspreis plus Handlungskosten. Das sind die Selbstkosten.',
      'Von unten rechnen: Bruttoverkaufspreis geteilt durch 1,19. Das ist der Nettoverkaufspreis.',
      'Nettoverkaufspreis minus Selbstkosten. Was übrig bleibt, ist der Gewinn in Euro.',
    ],
    merke: 'Du rechnest von oben und von unten zur Mitte. Der Abstand zwischen Selbstkosten und Nettoverkaufspreis ist der Gewinn.',
  },
  handelsspanne: {
    schritte: [
      'Rohgewinn ausrechnen: Nettoverkaufspreis minus Bezugspreis.',
      'Handelsspanne in Prozent: Rohgewinn geteilt durch Nettoverkaufspreis, mal 100.',
      'Kalkulationszuschlag in Prozent: Rohgewinn geteilt durch Bezugspreis, mal 100.',
      'Kalkulationsfaktor: Nettoverkaufspreis geteilt durch Bezugspreis.',
    ],
    merke: 'Die Spanne rechnet vom Verkaufspreis, der Zuschlag vom Einkaufspreis. Die Spanne ist deshalb immer kleiner als der Zuschlag.',
  },
  lagerkennzahlen: {
    schritte: [
      'Zähl alle Bestände zusammen: den Anfangsbestand und die Bestände am Ende jedes Quartals (oder Monats).',
      'Teil die Summe durch die Anzahl der Werte. Das ist der durchschnittliche Lagerbestand.',
      'Umschlagshäufigkeit: Wareneinsatz geteilt durch den durchschnittlichen Lagerbestand.',
      'Lagerdauer: 360 geteilt durch die Umschlagshäufigkeit. Das Ergebnis sind Tage.',
    ],
    merke: 'Zähl die Werte, nicht die Quartale. Anfangsbestand plus 4 Quartalsbestände sind 5 Werte, mit 12 Monatsbeständen sind es 13.',
  },
  lagerzinsen: {
    schritte: [
      'Lagerzinssatz: Marktzins mal Lagerdauer in Tagen, geteilt durch 360.',
      'Lagerzinsen in Euro: durchschnittlicher Lagerbestand mal Lagerzinssatz, geteilt durch 100.',
    ],
    merke: 'Der Marktzins gilt für ein Jahr mit 360 Tagen. Liegt die Ware im Schnitt 30 Tage, fallen nur 30 von 360 Teilen davon an.',
  },
  meldebestand: {
    schritte: [
      'Mindestbestand: Tagesverbrauch mal Sicherheitstage. Steht der Mindestbestand schon in der Aufgabe, nimm diesen Wert.',
      'Verbrauch während der Lieferzeit: Tagesverbrauch mal Lieferzeit in Tagen.',
      'Zähl beides zusammen. Das ist der Meldebestand.',
    ],
    merke: 'Du bestellst so früh, dass die neue Ware da ist, bevor du den Mindestbestand anbrechen musst.',
  },
  umsatzsteuer: {
    schritte: [
      'Schau zuerst nach: Ist der Betrag brutto (mit Steuer) oder netto (ohne Steuer)?',
      'Von netto zu brutto: mal 1,19 (bei 7 % mal 1,07).',
      'Von brutto zu netto: geteilt durch 1,19 (bei 7 % geteilt durch 1,07).',
      'Steuerbetrag: Brutto minus Netto.',
    ],
    merke: 'Der Bruttopreis sind 119 %, nicht 100 %. Deshalb ist es falsch, 19 % vom Bruttopreis abzuziehen.',
  },
  skontovergleich: {
    schritte: [
      'Ist nur der Skontobetrag gefragt: Rechnungsbetrag mal Skontosatz, geteilt durch 100. Dann bist du fertig.',
      'Zinstage: Zahlungsziel minus Skontofrist. Bei 30 Tagen Ziel und 10 Tagen Skontofrist sind das 20 Tage.',
      'Jahreszinssatz des Skontos: Skontosatz mal 360, geteilt durch die Zinstage.',
      'Vergleich mit dem Kreditzins: Ist der Skonto-Jahreszins höher, lohnt es sich, Skonto zu ziehen, auch wenn du dafür den Kredit nutzt.',
    ],
    merke: '2 % Skonto bei 10 Tagen Frist und 30 Tagen Ziel sind schon 36 % aufs Jahr gerechnet. Ein Kredit ist fast immer billiger.',
  },
  inventurdifferenz: {
    schritte: [
      'Inventurdifferenz: Sollbestand aus dem System minus Istbestand aus der Zählung.',
      'Schwundquote in Prozent: Inventurdifferenz geteilt durch Umsatz, mal 100.',
    ],
    merke: 'Soll kommt aus dem Computer, Ist aus dem Regal.',
  },
  grundpreis: {
    schritte: [
      'Rechne aus, wie oft der Inhalt in 1 kg oder 1 l passt: 1.000 geteilt durch den Inhalt in g oder ml. Bei 250 g: 1.000 geteilt durch 250 ergibt 4.',
      'Nimm den Preis mal diese Zahl. Das ist der Grundpreis je kg oder je l.',
    ],
    merke: 'Der Grundpreis gilt immer für 1 kg oder 1 l, auch bei kleinen Packungen.',
  },
  handlungskostensatz: {
    schritte: [
      'Teil die Handlungskosten durch den Wareneinsatz.',
      'Nimm das Ergebnis mal 100. Das ist der Handlungskostenzuschlag in Prozent.',
    ],
    merke: 'Du teilst durch den Wareneinsatz, weil die Handlungskosten später auf den Bezugspreis aufgeschlagen werden.',
  },
  prozentveraenderung: {
    schritte: [
      'Rechne den Unterschied aus: neuer Wert minus alter Wert.',
      'Teil den Unterschied durch den alten Wert.',
      'Nimm das Ergebnis mal 100. Das ist die Veränderung in Prozent. Ist die Zahl negativ, ist der Wert gesunken.',
    ],
    merke: 'Teil immer durch den alten Wert. Der alte Wert ist 100 %.',
  },
  dreisatz: {
    schritte: [
      'Frag dich zuerst: Wenn die eine Zahl größer wird, wird die andere dann auch größer? Dann ist es ein gerader Dreisatz (proportional). Wird sie kleiner, ist es ein umgekehrter Dreisatz (antiproportional).',
      'Gerader Dreisatz: Erst teilen, um auf 1 Stück zu kommen. Dann mit der gesuchten Menge malnehmen.',
      'Umgekehrter Dreisatz: Erst malnehmen, um die ganze Arbeit auszurechnen. Dann durch die neue Anzahl teilen.',
    ],
    merke: 'Mehr Kisten bedeuten mehr Gewicht: gerader Dreisatz. Mehr Leute bedeuten weniger Zeit: umgekehrter Dreisatz.',
  },
  'break-even': {
    schritte: [
      'Deckungsbeitrag je Stück: Verkaufspreis minus variable Kosten je Stück.',
      'Break-even-Menge: Fixkosten geteilt durch den Deckungsbeitrag je Stück. Kommt eine Kommazahl heraus, rundest du auf das nächste ganze Stück auf.',
    ],
    merke: 'Die Fixkosten fallen immer an, auch wenn nichts verkauft wird. Jedes verkaufte Stück bezahlt mit seinem Deckungsbeitrag einen Teil davon.',
  },
  'g-prozentwert': {
    schritte: ['Teil das Ganze durch 100. Das ist 1 %.', 'Nimm dieses Ergebnis mal die Prozentzahl.'],
    merke: 'Prozent heißt „von Hundert“. Du rechnest erst 1 % aus und dann die gesuchten Prozent.',
  },
  'g-prozentsatz': {
    schritte: ['Teil den Teil durch das Ganze.', 'Nimm das Ergebnis mal 100. Das sind die Prozent.'],
    merke: 'Teil durch Ganzes, mal 100. Der Teil ist meistens die kleinere Zahl.',
  },
  'g-aufschlag': {
    schritte: ['Rechne den Aufschlag in Euro aus: Preis mal Prozent, geteilt durch 100.', 'Zähl den Aufschlag zum Preis dazu.'],
    merke: 'Aufschlag heißt: Es kommt etwas dazu.',
  },
  'g-abzug': {
    schritte: ['Rechne den Rabatt in Euro aus: Preis mal Prozent, geteilt durch 100.', 'Zieh den Rabatt vom Preis ab.'],
    merke: 'Rabatt heißt: Der Preis wird kleiner.',
  },
  'g-herausrechnen': {
    schritte: [
      'Rechne 100 % plus Steuersatz. Das ist der Preis mit Steuer in Prozent, zum Beispiel 119 %.',
      'Schreib diese Prozent als Kommazahl: 119 % sind 1,19, 107 % sind 1,07.',
      'Teil den Bruttopreis durch diese Zahl. Das ist der Preis ohne Steuer.',
    ],
    merke: 'Steuer rausrechnen heißt teilen durch 1,19 oder 1,07. Prozent abziehen ist falsch.',
  },
  'g-runden': {
    schritte: [
      'Schau dir die dritte Stelle nach dem Komma an.',
      'Ist sie 0, 1, 2, 3 oder 4, bleiben die Cent, wie sie sind. Die dritte Stelle fällt weg.',
      'Ist sie 5, 6, 7, 8 oder 9, wird die zweite Stelle nach dem Komma um 1 größer. Die dritte Stelle fällt weg.',
    ],
    merke: 'Ab 5 wird aufgerundet, darunter abgerundet.',
  },
  rentabilitaet: {
    schritte: [
      'Teil den Gewinn durch die Bezugsgröße. Für die Eigenkapitalrentabilität ist das das Eigenkapital, für die Umsatzrentabilität der Umsatz.',
      'Nimm das Ergebnis mal 100. Das ist die Rentabilität in Prozent.',
    ],
    merke: 'Die Rentabilität zeigt, wie viele Cent Gewinn aus einem Euro Kapital oder Umsatz werden. 3 % Umsatzrentabilität heißt: 3 Cent Gewinn je Euro Umsatz.',
  },
  'g-menge-preis': {
    schritte: [
      'Nimm für jeden Artikel die Stückzahl mal den Preis für ein Stück.',
      'Schreib die Beträge untereinander, Komma unter Komma.',
      'Zähl alles zusammen. Das muss die Kundin bezahlen.',
    ],
    merke: 'Erst jeden Artikel einzeln ausrechnen, dann zusammenzählen.',
  },
  'g-wechselgeld': {
    schritte: [
      'Zähl vom Einkaufsbetrag hoch bis zum nächsten vollen Euro. Das sind die Münzen.',
      'Zähl vom vollen Euro weiter bis zum Schein, den die Kundin gegeben hat.',
      'Beides zusammen ist das Wechselgeld. Am Taschenrechner geht es auch direkt: Schein minus Einkauf.',
    ],
    merke: 'Gegeben minus Einkauf ist das Wechselgeld. Im Kopf zählst du vom Einkauf aus hoch.',
  },
  'g-durchschnitt': {
    schritte: ['Zähl alle Werte zusammen.', 'Teil die Summe durch die Anzahl der Werte.'],
    merke: 'Zähl nach, wie viele Werte es sind. Durch genau diese Zahl teilst du.',
  },
  'g-grundwert': {
    schritte: [
      'Teil den Betrag durch die Prozentzahl. Das ist 1 %.',
      'Nimm das Ergebnis mal 100. Das ist das Ganze, also 100 %.',
    ],
    merke: 'Vom Teil aufs Ganze: erst auf 1 % zurück, dann mal 100.',
  },
  kassenabrechnung: {
    schritte: [
      'Zähl das Wechselgeld vom Morgen und die Bareinnahmen zusammen.',
      'Zieh die Barauszahlungen ab, zum Beispiel ausgezahlte Pfandbons. Das ist der Soll-Bestand.',
      'Vergleich den Soll-Bestand mit dem gezählten Geld. Ist weniger da, ist es ein Fehlbetrag. Ist mehr da, ist es ein Überschuss.',
    ],
    merke: 'Soll ist, was da sein müsste. Ist ist, was du gezählt hast.',
  },
  rohgewinn: {
    schritte: [
      'Rechne aus dem Bruttoumsatz die Umsatzsteuer heraus: geteilt durch 1,19 oder 1,07.',
      'Zieh vom Nettoumsatz den Wareneinsatz ab. Das ist der Rohgewinn.',
    ],
    merke: 'Rohgewinn = Nettoumsatz minus Wareneinsatz. Die Handlungskosten sind darin noch nicht abgezogen.',
  },
  flaechenkennzahlen: {
    schritte: [
      'Für den Umsatz je m²: Umsatz geteilt durch die Verkaufsfläche.',
      'Für den Umsatz je Arbeitsstunde: erst alle Stunden zusammenrechnen (Personen mal Stunden), dann den Umsatz durch diese Stunden teilen.',
    ],
    merke: 'Umsatz je Irgendwas heißt immer: Umsatz geteilt durch dieses Irgendwas.',
  },
  angebotsvergleich: {
    schritte: [
      'Rechne für jedes Angebot den Listenpreis für die ganze Menge aus: Menge mal Stückpreis.',
      'Zieh Rabatt und danach Skonto ab, wenn es welche gibt.',
      'Zähl die Fracht dazu, wenn nicht frei Haus geliefert wird. Das ist der Bezugspreis.',
      'Vergleich die beiden Bezugspreise. Der kleinere ist das günstigere Angebot.',
    ],
    merke: 'Verglichen werden Bezugspreise, nicht Listenpreise.',
  },
  kalkulationsfaktor: {
    schritte: [
      'Teil beim bekannten Artikel den Nettoverkaufspreis durch den Bezugspreis. Das ist der Kalkulationsfaktor.',
      'Nimm den Bezugspreis des neuen Artikels mal den Faktor. Das ist sein Nettoverkaufspreis.',
      'Nimm den Nettoverkaufspreis mal 1,19 oder 1,07. Das ist der Bruttoverkaufspreis.',
    ],
    merke: 'Faktor = Nettoverkaufspreis geteilt durch Bezugspreis. Im Faktor stecken Handlungskosten und Gewinn zusammen.',
  },
  zahllast: {
    schritte: [
      'Rechne die Umsatzsteuer auf die Verkäufe aus: Nettoverkäufe mal Steuersatz, geteilt durch 100.',
      'Rechne die Vorsteuer auf die Einkäufe aus: Nettoeinkäufe mal Steuersatz, geteilt durch 100.',
      'Zieh die Vorsteuer von der Umsatzsteuer ab. Das ist die Zahllast.',
    ],
    merke: 'Umsatzsteuer minus Vorsteuer gleich Zahllast.',
  },
  'rueckwaerts-komplett': {
    schritte: [
      'Bruttoverkaufspreis geteilt durch 1,19 (oder 1,07). Das ist der Nettoverkaufspreis.',
      'Geteilt durch (100 plus Gewinnsatz), mal 100. Das sind die Selbstkosten.',
      'Geteilt durch (100 plus Handlungskostensatz), mal 100. Das ist der Bezugspreis.',
      'Minus Bezugskosten. Das ist der Bareinkaufspreis.',
      'Geteilt durch (100 minus Skontosatz), mal 100. Das ist der Zieleinkaufspreis.',
      'Geteilt durch (100 minus Rabattsatz), mal 100. Das ist der Listeneinkaufspreis.',
    ],
    merke: 'Rückwärts kehrt sich alles um: Aus plus wird minus, aus minus wird plus. Zuschläge rechnest du auf Hundert heraus, Abzüge im Hundert wieder hinein.',
  },
  'differenz-komplett': {
    schritte: [
      'Von oben: Listenpreis minus Rabatt, minus Skonto, plus Bezugskosten, plus Handlungskosten. Das sind die Selbstkosten.',
      'Von unten: Bruttoverkaufspreis geteilt durch 1,19 oder 1,07. Das ist der Nettoverkaufspreis.',
      'Nettoverkaufspreis minus Selbstkosten. Das ist der Gewinn in Euro.',
      'Gewinn geteilt durch Selbstkosten, mal 100. Das ist der Gewinn in Prozent.',
    ],
    merke: 'Bei der Differenzkalkulation rechnest du von beiden Seiten. Der Gewinn ist das, was in der Mitte übrig bleibt.',
  },
  'lagerkennzahlen-jahr': {
    schritte: [
      'Zähl den Anfangsbestand und die zwölf Monatsendbestände zusammen.',
      'Teil die Summe durch 13. Das ist der durchschnittliche Lagerbestand.',
      'Teil den Wareneinsatz durch den durchschnittlichen Lagerbestand. Das ist die Umschlagshäufigkeit.',
      'Teil 360 durch die Umschlagshäufigkeit. Das ist die durchschnittliche Lagerdauer in Tagen.',
    ],
    merke: '13 Werte, also durch 13. Nur wenn Anfangs- und Endbestand gegeben sind, teilst du durch 2.',
  },
}
