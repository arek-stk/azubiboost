/**
 * Rezepte: für jeden Aufgabentyp die Reihenfolge, in der man vorgeht.
 * Kurz genug, um sie im Kopf zu behalten und in der Prüfung abzuarbeiten.
 */

import type { AufgabentypId } from '../engine/rechenaufgaben'

export type Rezept = { schritte: string[]; merke: string }

export const REZEPTE: Record<AufgabentypId, Rezept> = {
  bezugspreis: {
    schritte: [
      'Schreib den Listeneinkaufspreis oben hin.',
      'Rabatt ausrechnen (Listenpreis × Rabatt %) und abziehen → Zieleinkaufspreis.',
      'Skonto ausrechnen — vom Zieleinkaufspreis! — und abziehen → Bareinkaufspreis.',
      'Fracht und andere Bezugskosten dazuzählen → Bezugspreis.',
    ],
    merke: 'Rabatt – Skonto – Fracht. Jeder Schritt rechnet mit dem Ergebnis davor.',
  },
  verkaufspreis: {
    schritte: [
      'Bezugspreis oben hinschreiben.',
      'Handlungskosten in % vom Bezugspreis ausrechnen und dazuzählen → Selbstkosten.',
      'Gewinn in % von den Selbstkosten ausrechnen und dazuzählen → Nettoverkaufspreis.',
      'Umsatzsteuer (19 % oder 7 %) vom Nettopreis dazuzählen → Bruttoverkaufspreis.',
    ],
    merke: 'Jeder Zuschlag rechnet vom Ergebnis der Zeile darüber — nie alles vom Bezugspreis.',
  },
  'verkaufspreis-komplett': {
    schritte: [
      'Bezugspreis + Handlungskosten = Selbstkosten.',
      'Selbstkosten + Gewinn = Barverkaufspreis.',
      'Kundenskonto einrechnen: Barverkaufspreis ÷ (100 − Skonto) × 100 = Zielverkaufspreis.',
      'Kundenrabatt einrechnen: Zielverkaufspreis ÷ (100 − Rabatt) × 100 = Nettoverkaufspreis.',
      'Nettoverkaufspreis × 1,19 = Bruttoverkaufspreis.',
    ],
    merke: 'Was der Kunde später abzieht, rechnest du „im Hundert“ ein: teilen durch (100 − Prozent), mal 100.',
  },
  rueckwaerts: {
    schritte: [
      'Mit dem Marktpreis (brutto) anfangen.',
      'Steuer raus: ÷ 1,19 (bei Lebensmitteln ÷ 1,07) → Nettoverkaufspreis.',
      'Gewinn raus: ÷ (100 + Gewinn %) × 100 → Selbstkosten.',
      'Handlungskosten raus: ÷ (100 + HK %) × 100 → höchster Bezugspreis.',
    ],
    merke: 'Rückwärts wird aus jedem „plus“ ein „geteilt durch (100 + …)“. Nie einfach Prozent abziehen.',
  },
  differenz: {
    schritte: [
      'Oben: Bezugspreis → mit Handlungskosten zu den Selbstkosten rechnen.',
      'Unten: Bruttopreis → Steuer raus (÷ 1,19) → Nettoverkaufspreis.',
      'Nettoverkaufspreis minus Selbstkosten = Gewinn in Euro.',
    ],
    merke: 'Von oben und von unten rechnen, in der Mitte treffen sich beide — die Lücke ist der Gewinn.',
  },
  handelsspanne: {
    schritte: [
      'Rohgewinn = Nettoverkaufspreis − Bezugspreis.',
      'Für die Spanne: Rohgewinn ÷ Verkaufspreis × 100.',
      'Für den Zuschlag: Rohgewinn ÷ Bezugspreis × 100.',
      'Für den Faktor: Verkaufspreis ÷ Bezugspreis.',
    ],
    merke: 'Spanne vom Verkauf, Zuschlag vom Einkauf. Die Spanne ist immer die kleinere Zahl.',
  },
  lagerkennzahlen: {
    schritte: [
      'Alle Bestände zusammenzählen (Anfang + Quartale oder Monate).',
      'Durch die Anzahl der Werte teilen → Ø Lagerbestand.',
      'Wareneinsatz ÷ Ø Lagerbestand → Umschlagshäufigkeit.',
      '360 ÷ Umschlagshäufigkeit → Lagerdauer in Tagen.',
    ],
    merke: 'Zähl die Werte, nicht die Monate: Anfang + 4 Quartale = 5 Werte.',
  },
  lagerzinsen: {
    schritte: [
      'Marktzins × Lagerdauer ÷ 360 → Lagerzinssatz.',
      'Ø Lagerbestand × Lagerzinssatz ÷ 100 → Lagerzinsen in Euro.',
    ],
    merke: 'Der Jahreszins gilt für 360 Tage — liegt die Ware kürzer, fällt nur ein Teil an.',
  },
  meldebestand: {
    schritte: [
      'Mindestbestand = Tagesverbrauch × Sicherheitstage (falls nicht gegeben).',
      'Verbrauch in der Lieferzeit = Tagesverbrauch × Lieferzeit.',
      'Beides zusammenzählen → Meldebestand.',
    ],
    merke: 'Bestellt wird so früh, dass die Lieferung kommt, bevor der Puffer angegriffen wird.',
  },
  umsatzsteuer: {
    schritte: [
      'Klären: Ist der Betrag brutto (mit Steuer) oder netto (ohne)?',
      'Netto → Brutto: × 1,19 (oder × 1,07).',
      'Brutto → Netto: ÷ 1,19 (oder ÷ 1,07).',
      'Steuerbetrag = Brutto − Netto.',
    ],
    merke: 'Brutto sind 119 %. Wer 19 % vom Bruttopreis abzieht, liegt immer falsch.',
  },
  skontovergleich: {
    schritte: [
      'Zinstage = Zahlungsziel − Skontofrist.',
      'Skontosatz × 360 ÷ Zinstage → Jahreszinssatz des Skontos.',
      'Mit dem Kreditzins vergleichen: ist der Skonto-Zins höher, Skonto ziehen.',
    ],
    merke: 'Skonto lohnt sich fast immer — es sind meist 30 % und mehr aufs Jahr gerechnet.',
  },
  inventurdifferenz: {
    schritte: [
      'Sollbestand (System) minus Istbestand (gezählt) → Inventurdifferenz.',
      'Für die Quote: Differenz ÷ Umsatz × 100.',
    ],
    merke: 'Soll kommt aus dem Computer, Ist aus dem Regal.',
  },
  grundpreis: {
    schritte: [
      'Wie oft passt der Inhalt in 1 kg oder 1 l? → 1.000 ÷ Inhalt.',
      'Preis mit dieser Zahl malnehmen → Grundpreis.',
    ],
    merke: 'Immer auf 1 kg oder 1 l hochrechnen — auch bei kleinen Packungen.',
  },
  handlungskostensatz: {
    schritte: [
      'Handlungskosten ÷ Wareneinsatz.',
      'Ergebnis × 100 → Zuschlag in Prozent.',
    ],
    merke: 'Der Wareneinsatz ist die Basis, weil die Handlungskosten später auf den Bezugspreis aufgeschlagen werden.',
  },
  prozentveraenderung: {
    schritte: [
      'Differenz = neuer Wert − alter Wert.',
      'Differenz ÷ alter Wert.',
      'Ergebnis × 100 → Veränderung in Prozent.',
    ],
    merke: 'Immer durch den alten Wert teilen — der alte Wert ist 100 %.',
  },
  dreisatz: {
    schritte: [
      'Fragen: Wenn es mehr wird — wird das Ergebnis mehr (gerade) oder weniger (umgekehrt)?',
      'Gerade: erst teilen (auf 1), dann malnehmen (auf die gesuchte Menge).',
      'Umgekehrt: erst malnehmen (Gesamtmenge), dann teilen (auf die neue Anzahl).',
    ],
    merke: 'Mehr Kisten = mehr Gewicht (gerade). Mehr Leute = weniger Zeit (umgekehrt).',
  },
  'break-even': {
    schritte: [
      'Deckungsbeitrag je Stück = Verkaufspreis − variable Kosten.',
      'Fixkosten ÷ Deckungsbeitrag → Break-even-Menge.',
    ],
    merke: 'Fixkosten fallen immer an. Jedes Stück trägt seinen Deckungsbeitrag dazu bei, sie zu bezahlen.',
  },
  'g-prozentwert': {
    schritte: ['Das Ganze durch 100 teilen — das ist 1 %.', 'Mit der Prozentzahl malnehmen.'],
    merke: 'Prozent heißt „von Hundert". Erst auf 1 %, dann auf die gesuchten Prozent.',
  },
  'g-prozentsatz': {
    schritte: ['Den Teil durch das Ganze teilen.', 'Das Ergebnis mal 100 nehmen.'],
    merke: 'Teil durch Ganzes, mal 100. Der Teil ist die kleinere Zahl.',
  },
  'g-aufschlag': {
    schritte: ['Aufschlag in Euro: Preis × Prozent ÷ 100.', 'Zum Preis dazuzählen.'],
    merke: 'Aufschlag = es kommt etwas dazu.',
  },
  'g-abzug': {
    schritte: ['Rabatt in Euro: Preis × Prozent ÷ 100.', 'Vom Preis abziehen.'],
    merke: 'Rabatt = es wird weniger.',
  },
  'g-herausrechnen': {
    schritte: ['100 % + Steuersatz = Prozent mit Steuer (z. B. 119 %).', 'Als Kommazahl schreiben (119 % = 1,19).', 'Den Bruttopreis durch diese Zahl teilen.'],
    merke: 'Steuer raus heißt: teilen durch 1,19 oder 1,07 — nie Prozent abziehen.',
  },
  'g-runden': {
    schritte: ['Die dritte Stelle nach dem Komma anschauen.', '0 bis 4: die Cent bleiben. 5 bis 9: eine Cent-Stelle mehr.'],
    merke: 'Ab 5 wird aufgerundet.',
  },
  rentabilitaet: {
    schritte: [
      'Gewinn durch die Bezugsgröße teilen (Eigenkapital oder Umsatz).',
      'Ergebnis × 100 → Rentabilität in Prozent.',
    ],
    merke: 'Rentabilität fragt: wie viel Gewinn bringt jeder eingesetzte Euro?',
  },
}
