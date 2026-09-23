/**
 * Rechenaufgaben zum Rechnen auf Papier.
 *
 * Jeder Generator erzeugt aus einem Seed eine Aufgabe mit neuen Zahlen, der
 * Lösung und dem vollständigen Rechenweg. Es gibt keine Antwortauswahl — sie
 * rechnet auf dem Blatt und tippt nur das Ergebnis ein. Der Lerneffekt steckt
 * im Rechenweg, der erst danach aufgedeckt wird.
 *
 * Kaufmännische Grundlagen: Handelskalkulation (Listeneinkaufspreis bis
 * Bruttoverkaufspreis), Lagerkennzahlen, Bestellrechnung, Umsatzsteuer.
 */

import type { RechenSchritt, Schwierigkeit, ThemaId, ZahlLoesung } from '../domain/types'
import { eur, pz, r2, rN, tage, zahl } from './format'
import { waehle, zwischen, type Rng } from './zufall'
import { ERWEITERTE_AUFGABENTYPEN } from './rechenaufgaben-erweitert'

export type AufgabentypId =
  | 'bezugspreis'
  | 'verkaufspreis'
  | 'verkaufspreis-komplett'
  | 'rueckwaerts'
  | 'differenz'
  | 'handelsspanne'
  | 'lagerkennzahlen'
  | 'lagerzinsen'
  | 'meldebestand'
  | 'umsatzsteuer'
  | 'skontovergleich'
  | 'inventurdifferenz'
  | 'grundpreis'
  | 'handlungskostensatz'
  | 'prozentveraenderung'
  | 'dreisatz'
  | 'break-even'
  | 'rentabilitaet'

export type RechenAufgabe = {
  typId: AufgabentypId
  titel: string
  thema: ThemaId
  /** Der Aufgabentext, so wie er in der Prüfung stehen könnte. */
  frage: string
  /** Die gegebenen Werte, damit sie sie aufs Blatt übertragen kann. */
  gegeben: { label: string; wert: string }[]
  loesung: ZahlLoesung
  rechenweg: RechenSchritt[]
  /** Kurzformel zum Nachschlagen. */
  formel: string
  schwierigkeit: Schwierigkeit
}

export type Aufgabentyp = {
  id: AufgabentypId
  name: string
  thema: ThemaId
  schwierigkeit: Schwierigkeit
  /** Ein Satz: was lernt sie an diesem Aufgabentyp? */
  worumGehts: string
  erzeuge: (r: Rng) => RechenAufgabe
}

const EUR_TOLERANZ = 0.02
const PROZENT_TOLERANZ = 0.05

// ---------------------------------------------------------------------------
// 1. Bezugspreis: Listeneinkaufspreis -> Rabatt -> Skonto -> Bezugskosten
// ---------------------------------------------------------------------------

const bezugspreis: Aufgabentyp = {
  id: 'bezugspreis',
  name: 'Bezugspreis berechnen',
  thema: 'kalkulation',
  schwierigkeit: 1,
  worumGehts: 'Vom Listenpreis des Lieferanten zum Preis, den die Ware dich wirklich kostet.',
  erzeuge: (r) => {
    const lep = zwischen(r, 200, 900, 10)
    const rabatt = waehle(r, [10, 15, 20, 25])
    const skonto = waehle(r, [2, 3])
    const bezugskosten = zwischen(r, 10, 60, 5)

    const rabattBetrag = r2((lep * rabatt) / 100)
    const zep = r2(lep - rabattBetrag)
    const skontoBetrag = r2((zep * skonto) / 100)
    const bep = r2(zep - skontoBetrag)
    const bzp = r2(bep + bezugskosten)

    return {
      typId: 'bezugspreis',
      titel: 'Bezugspreis',
      thema: 'kalkulation',
      schwierigkeit: 1,
      frage:
        'Ein Lieferant stellt Ware mit dem folgenden Listeneinkaufspreis in Rechnung. ' +
        'Wie hoch ist der Bezugspreis?',
      gegeben: [
        { label: 'Listeneinkaufspreis', wert: eur(lep) },
        { label: 'Liefererrabatt', wert: pz(rabatt) },
        { label: 'Liefererskonto', wert: pz(skonto) },
        { label: 'Bezugskosten (Fracht)', wert: eur(bezugskosten) },
      ],
      loesung: { wert: bzp, toleranz: EUR_TOLERANZ, einheit: '€' },
      formel:
        'Listeneinkaufspreis − Liefererrabatt = Zieleinkaufspreis − Liefererskonto = ' +
        'Bareinkaufspreis + Bezugskosten = Bezugspreis',
      rechenweg: [
        {
          label: 'Liefererrabatt abziehen',
          rechnung: `${eur(lep)} × ${pz(rabatt)} = ${eur(rabattBetrag)}`,
          ergebnis: `Zieleinkaufspreis = ${eur(lep)} − ${eur(rabattBetrag)} = ${eur(zep)}`,
          hinweis: 'Der Rabatt wird vom Listenpreis gerechnet — „vom Hundert".',
        },
        {
          label: 'Liefererskonto abziehen',
          rechnung: `${eur(zep)} × ${pz(skonto)} = ${eur(skontoBetrag)}`,
          ergebnis: `Bareinkaufspreis = ${eur(zep)} − ${eur(skontoBetrag)} = ${eur(bep)}`,
          hinweis: 'Achtung: Skonto immer vom Zieleinkaufspreis, nicht vom Listenpreis.',
        },
        {
          label: 'Bezugskosten addieren',
          rechnung: `${eur(bep)} + ${eur(bezugskosten)}`,
          ergebnis: `Bezugspreis = ${eur(bzp)}`,
          hinweis: 'Fracht, Verpackung und Transportversicherung gehören dazu.',
        },
      ],
    }
  },
}

// ---------------------------------------------------------------------------
// 2. Verkaufspreis vorwärts (ohne Kundenskonto und Kundenrabatt)
// ---------------------------------------------------------------------------

const verkaufspreis: Aufgabentyp = {
  id: 'verkaufspreis',
  name: 'Verkaufspreis vorwärts',
  thema: 'kalkulation',
  schwierigkeit: 1,
  worumGehts: 'Vom Bezugspreis zum Preis am Regal — mit Handlungskosten, Gewinn und Umsatzsteuer.',
  erzeuge: (r) => {
    const bzp = zwischen(r, 10, 240, 1)
    const handlungskosten = waehle(r, [25, 30, 35, 40, 45])
    const gewinn = waehle(r, [10, 12, 15, 20, 25])
    const ust = waehle(r, [19, 7])

    const hkBetrag = r2((bzp * handlungskosten) / 100)
    const selbstkosten = r2(bzp + hkBetrag)
    const gewinnBetrag = r2((selbstkosten * gewinn) / 100)
    const netto = r2(selbstkosten + gewinnBetrag)
    const ustBetrag = r2((netto * ust) / 100)
    const brutto = r2(netto + ustBetrag)

    return {
      typId: 'verkaufspreis',
      titel: 'Verkaufspreis',
      thema: 'kalkulation',
      schwierigkeit: 1,
      frage: 'Kalkuliere den Bruttoverkaufspreis, also den Preis, der am Regal ausgezeichnet wird.',
      gegeben: [
        { label: 'Bezugspreis', wert: eur(bzp) },
        { label: 'Handlungskostenzuschlag', wert: pz(handlungskosten) },
        { label: 'Gewinnzuschlag', wert: pz(gewinn) },
        { label: 'Umsatzsteuer', wert: pz(ust) },
      ],
      loesung: { wert: brutto, toleranz: EUR_TOLERANZ, einheit: '€' },
      formel:
        'Bezugspreis + Handlungskosten = Selbstkosten + Gewinn = Nettoverkaufspreis + ' +
        'Umsatzsteuer = Bruttoverkaufspreis',
      rechenweg: [
        {
          label: 'Handlungskosten aufschlagen',
          rechnung: `${eur(bzp)} × ${pz(handlungskosten)} = ${eur(hkBetrag)}`,
          ergebnis: `Selbstkosten = ${eur(bzp)} + ${eur(hkBetrag)} = ${eur(selbstkosten)}`,
          hinweis: 'Handlungskosten sind Miete, Personal, Energie — alles, was der Laden kostet.',
        },
        {
          label: 'Gewinn aufschlagen',
          rechnung: `${eur(selbstkosten)} × ${pz(gewinn)} = ${eur(gewinnBetrag)}`,
          ergebnis: `Nettoverkaufspreis = ${eur(selbstkosten)} + ${eur(gewinnBetrag)} = ${eur(netto)}`,
          hinweis: 'Der Gewinnzuschlag rechnet sich von den Selbstkosten, nicht vom Bezugspreis.',
        },
        {
          label: 'Umsatzsteuer aufschlagen',
          rechnung: `${eur(netto)} × ${pz(ust)} = ${eur(ustBetrag)}`,
          ergebnis: `Bruttoverkaufspreis = ${eur(netto)} + ${eur(ustBetrag)} = ${eur(brutto)}`,
          hinweis:
            ust === 7
              ? 'Grundnahrungsmittel wie Brot, Milch oder Obst haben 7 %.'
              : 'Der Regelsatz von 19 % gilt für alles, was nicht ausdrücklich begünstigt ist.',
        },
      ],
    }
  },
}

// ---------------------------------------------------------------------------
// 3. Verkaufspreis komplett (mit Kundenskonto und Kundenrabatt, "im Hundert")
// ---------------------------------------------------------------------------

const verkaufspreisKomplett: Aufgabentyp = {
  id: 'verkaufspreis-komplett',
  name: 'Verkaufspreis mit Skonto und Rabatt',
  thema: 'kalkulation',
  schwierigkeit: 3,
  worumGehts: 'Das vollständige Kalkulationsschema — hier stolpern die meisten über „im Hundert".',
  erzeuge: (r) => {
    const bzp = zwischen(r, 40, 300, 2)
    const handlungskosten = waehle(r, [30, 35, 40])
    const gewinn = waehle(r, [10, 15, 20])
    const kundenskonto = waehle(r, [2, 3])
    const kundenrabatt = waehle(r, [5, 10])
    const ust = 19

    const selbstkosten = r2(bzp * (1 + handlungskosten / 100))
    const barverkaufspreis = r2(selbstkosten * (1 + gewinn / 100))
    const zielverkaufspreis = r2((barverkaufspreis * 100) / (100 - kundenskonto))
    const netto = r2((zielverkaufspreis * 100) / (100 - kundenrabatt))
    const brutto = r2(netto * (1 + ust / 100))

    return {
      typId: 'verkaufspreis-komplett',
      titel: 'Verkaufspreis komplett',
      thema: 'kalkulation',
      schwierigkeit: 3,
      frage:
        `Der Kunde soll ${kundenskonto} % Skonto und ${kundenrabatt} % Rabatt erhalten und der ` +
        'Gewinn soll trotzdem erreicht werden. Wie hoch ist der Bruttoverkaufspreis?',
      gegeben: [
        { label: 'Bezugspreis', wert: eur(bzp) },
        { label: 'Handlungskostenzuschlag', wert: pz(handlungskosten) },
        { label: 'Gewinnzuschlag', wert: pz(gewinn) },
        { label: 'Kundenskonto', wert: pz(kundenskonto) },
        { label: 'Kundenrabatt', wert: pz(kundenrabatt) },
        { label: 'Umsatzsteuer', wert: pz(ust) },
      ],
      loesung: { wert: brutto, toleranz: 0.05, einheit: '€' },
      formel:
        'Bezugspreis + Handlungskosten = Selbstkosten + Gewinn = Barverkaufspreis ' +
        '(+ Kundenskonto im Hundert) = Zielverkaufspreis (+ Kundenrabatt im Hundert) = ' +
        'Nettoverkaufspreis + Umsatzsteuer = Bruttoverkaufspreis',
      rechenweg: [
        {
          label: 'Selbstkosten',
          rechnung: `${eur(bzp)} × ${zahl(1 + handlungskosten / 100)}`,
          ergebnis: `Selbstkosten = ${eur(selbstkosten)}`,
        },
        {
          label: 'Barverkaufspreis',
          rechnung: `${eur(selbstkosten)} × ${zahl(1 + gewinn / 100)}`,
          ergebnis: `Barverkaufspreis = ${eur(barverkaufspreis)}`,
        },
        {
          label: 'Kundenskonto einrechnen (im Hundert)',
          rechnung: `${eur(barverkaufspreis)} ÷ ${zahl(100 - kundenskonto, 0)} × 100`,
          ergebnis: `Zielverkaufspreis = ${eur(zielverkaufspreis)}`,
          hinweis:
            'Der Barverkaufspreis ist die Zahl, die nach dem Skontoabzug übrig bleiben muss — ' +
            'deshalb durch (100 − Skonto), nicht mal (100 + Skonto).',
        },
        {
          label: 'Kundenrabatt einrechnen (im Hundert)',
          rechnung: `${eur(zielverkaufspreis)} ÷ ${zahl(100 - kundenrabatt, 0)} × 100`,
          ergebnis: `Nettoverkaufspreis = ${eur(netto)}`,
        },
        {
          label: 'Umsatzsteuer aufschlagen',
          rechnung: `${eur(netto)} × 1,19`,
          ergebnis: `Bruttoverkaufspreis = ${eur(brutto)}`,
        },
      ],
    }
  },
}

// ---------------------------------------------------------------------------
// 4. Rückwärtskalkulation: vom Marktpreis zum höchstmöglichen Bezugspreis
// ---------------------------------------------------------------------------

const rueckwaerts: Aufgabentyp = {
  id: 'rueckwaerts',
  name: 'Rückwärtskalkulation',
  thema: 'kalkulation',
  schwierigkeit: 2,
  worumGehts: 'Der Marktpreis steht fest — wie teuer darf die Ware im Einkauf höchstens sein?',
  erzeuge: (r) => {
    const brutto = zwischen(r, 1000, 9000, 50) / 100
    const ust = 19
    const handlungskosten = waehle(r, [30, 35, 40])
    const gewinn = waehle(r, [10, 12, 15])

    const netto = r2((brutto * 100) / (100 + ust))
    const selbstkosten = r2((netto * 100) / (100 + gewinn))
    const bzp = r2((selbstkosten * 100) / (100 + handlungskosten))

    return {
      typId: 'rueckwaerts',
      titel: 'Rückwärtskalkulation',
      thema: 'kalkulation',
      schwierigkeit: 2,
      frage:
        'Der Wettbewerb verkauft den Artikel zu diesem Preis, mehr ist am Markt nicht ' +
        'durchsetzbar. Wie hoch darf der Bezugspreis höchstens sein, damit der Gewinnzuschlag ' +
        'noch erreicht wird?',
      gegeben: [
        { label: 'Bruttoverkaufspreis (Marktpreis)', wert: eur(brutto) },
        { label: 'Umsatzsteuer', wert: pz(ust) },
        { label: 'Handlungskostenzuschlag', wert: pz(handlungskosten) },
        { label: 'Gewinnzuschlag', wert: pz(gewinn) },
      ],
      loesung: { wert: bzp, toleranz: 0.05, einheit: '€' },
      formel:
        'Bruttoverkaufspreis ÷ 1,19 = Nettoverkaufspreis ÷ (100 + Gewinn) × 100 = ' +
        'Selbstkosten ÷ (100 + Handlungskosten) × 100 = Bezugspreis',
      rechenweg: [
        {
          label: 'Umsatzsteuer herausrechnen',
          rechnung: `${eur(brutto)} ÷ 1,19`,
          ergebnis: `Nettoverkaufspreis = ${eur(netto)}`,
          hinweis:
            'Nicht 19 % abziehen! Die Umsatzsteuer steckt im Bruttopreis — das ist eine Rechnung ' +
            '„im Hundert".',
        },
        {
          label: 'Gewinn herausrechnen',
          rechnung: `${eur(netto)} ÷ ${zahl(100 + gewinn, 0)} × 100`,
          ergebnis: `Selbstkosten = ${eur(selbstkosten)}`,
        },
        {
          label: 'Handlungskosten herausrechnen',
          rechnung: `${eur(selbstkosten)} ÷ ${zahl(100 + handlungskosten, 0)} × 100`,
          ergebnis: `höchster Bezugspreis = ${eur(bzp)}`,
          hinweis: 'Liegt der Lieferant darüber, lohnt der Artikel zu diesem Marktpreis nicht.',
        },
      ],
    }
  },
}

// ---------------------------------------------------------------------------
// 5. Differenzkalkulation: welcher Gewinn bleibt übrig?
// ---------------------------------------------------------------------------

const differenz: Aufgabentyp = {
  id: 'differenz',
  name: 'Differenzkalkulation',
  thema: 'kalkulation',
  schwierigkeit: 2,
  worumGehts: 'Einkaufspreis und Ladenpreis stehen fest — wie viel Gewinn bleibt tatsächlich?',
  erzeuge: (r) => {
    const bzp = zwischen(r, 20, 150, 1)
    const handlungskosten = waehle(r, [30, 35, 40])
    const aufschlag = waehle(r, [60, 70, 80, 90])
    const ust = 19

    const selbstkosten = r2(bzp * (1 + handlungskosten / 100))
    const netto = r2(bzp * (1 + aufschlag / 100))
    const brutto = r2(netto * (1 + ust / 100))
    const gewinn = r2(netto - selbstkosten)

    return {
      typId: 'differenz',
      titel: 'Differenzkalkulation',
      thema: 'kalkulation',
      schwierigkeit: 2,
      frage: 'Wie hoch ist der Gewinn je Stück in Euro?',
      gegeben: [
        { label: 'Bezugspreis', wert: eur(bzp) },
        { label: 'Handlungskostenzuschlag', wert: pz(handlungskosten) },
        { label: 'Bruttoverkaufspreis im Laden', wert: eur(brutto) },
        { label: 'Umsatzsteuer', wert: pz(ust) },
      ],
      loesung: { wert: gewinn, toleranz: 0.05, einheit: '€' },
      formel: 'Nettoverkaufspreis − Selbstkosten = Gewinn',
      rechenweg: [
        {
          label: 'Umsatzsteuer herausrechnen',
          rechnung: `${eur(brutto)} ÷ 1,19`,
          ergebnis: `Nettoverkaufspreis = ${eur(netto)}`,
          hinweis: 'Die Umsatzsteuer gehört dem Finanzamt, sie ist kein Erlös.',
        },
        {
          label: 'Selbstkosten berechnen',
          rechnung: `${eur(bzp)} × ${zahl(1 + handlungskosten / 100)}`,
          ergebnis: `Selbstkosten = ${eur(selbstkosten)}`,
        },
        {
          label: 'Gewinn als Differenz',
          rechnung: `${eur(netto)} − ${eur(selbstkosten)}`,
          ergebnis: `Gewinn = ${eur(gewinn)}`,
        },
      ],
    }
  },
}

// ---------------------------------------------------------------------------
// 6. Handelsspanne, Kalkulationszuschlag, Kalkulationsfaktor
// ---------------------------------------------------------------------------

const handelsspanne: Aufgabentyp = {
  id: 'handelsspanne',
  name: 'Handelsspanne und Kalkulationszuschlag',
  thema: 'kalkulation',
  schwierigkeit: 2,
  worumGehts:
    'Dieselbe Marge, drei Zahlen: Spanne rechnet vom Verkaufspreis, Zuschlag vom Einkaufspreis.',
  erzeuge: (r) => {
    const bzp = zwischen(r, 20, 200, 1)
    const aufschlag = waehle(r, [50, 60, 75, 80, 100])
    const netto = r2(bzp * (1 + aufschlag / 100))
    const rohgewinn = r2(netto - bzp)

    const gegeben = [
      { label: 'Bezugspreis', wert: eur(bzp) },
      { label: 'Nettoverkaufspreis', wert: eur(netto) },
    ]
    const variante = waehle(r, ['spanne', 'zuschlag', 'faktor'] as const)

    if (variante === 'spanne') {
      const wert = rN((rohgewinn / netto) * 100, 2)
      return {
        typId: 'handelsspanne',
        titel: 'Handelsspanne',
        thema: 'kalkulation',
        schwierigkeit: 2,
        frage: 'Wie hoch ist die Handelsspanne in Prozent?',
        gegeben,
        loesung: { wert, toleranz: PROZENT_TOLERANZ, einheit: '%' },
        formel: 'Handelsspanne % = (Nettoverkaufspreis − Bezugspreis) ÷ Nettoverkaufspreis × 100',
        rechenweg: [
          {
            label: 'Rohgewinn berechnen',
            rechnung: `${eur(netto)} − ${eur(bzp)}`,
            ergebnis: `Rohgewinn = ${eur(rohgewinn)}`,
          },
          {
            label: 'Anteil am Verkaufspreis',
            rechnung: `${eur(rohgewinn)} ÷ ${eur(netto)} × 100`,
            ergebnis: `Handelsspanne = ${pz(wert)}`,
            hinweis:
              'Merksatz: Die Spanne rechnet vom Verkaufspreis. Sie ist deshalb immer kleiner als ' +
              'der Kalkulationszuschlag.',
          },
        ],
      }
    }

    if (variante === 'zuschlag') {
      const wert = rN((rohgewinn / bzp) * 100, 2)
      return {
        typId: 'handelsspanne',
        titel: 'Kalkulationszuschlag',
        thema: 'kalkulation',
        schwierigkeit: 2,
        frage: 'Wie hoch ist der Kalkulationszuschlag in Prozent?',
        gegeben,
        loesung: { wert, toleranz: PROZENT_TOLERANZ, einheit: '%' },
        formel: 'Kalkulationszuschlag % = (Nettoverkaufspreis − Bezugspreis) ÷ Bezugspreis × 100',
        rechenweg: [
          {
            label: 'Rohgewinn berechnen',
            rechnung: `${eur(netto)} − ${eur(bzp)}`,
            ergebnis: `Rohgewinn = ${eur(rohgewinn)}`,
          },
          {
            label: 'Anteil am Einkaufspreis',
            rechnung: `${eur(rohgewinn)} ÷ ${eur(bzp)} × 100`,
            ergebnis: `Kalkulationszuschlag = ${pz(wert)}`,
            hinweis: 'Merksatz: Der Zuschlag rechnet vom Bezugspreis.',
          },
        ],
      }
    }

    const wert = rN(netto / bzp, 3)
    return {
      typId: 'handelsspanne',
      titel: 'Kalkulationsfaktor',
      thema: 'kalkulation',
      schwierigkeit: 2,
      frage: 'Wie hoch ist der Kalkulationsfaktor?',
      gegeben,
      loesung: { wert, toleranz: 0.005, einheit: '' },
      formel: 'Kalkulationsfaktor = Nettoverkaufspreis ÷ Bezugspreis',
      rechenweg: [
        {
          label: 'Verkaufspreis durch Einkaufspreis teilen',
          rechnung: `${eur(netto)} ÷ ${eur(bzp)}`,
          ergebnis: `Kalkulationsfaktor = ${zahl(wert, 3)}`,
          hinweis:
            'Mit dem Faktor kalkulierst du im Laden blitzschnell: Bezugspreis × Faktor = ' +
            'Nettoverkaufspreis.',
        },
      ],
    }
  },
}

// ---------------------------------------------------------------------------
// 7. Lagerkennzahlen: Ø-Bestand, Umschlagshäufigkeit, Lagerdauer
// ---------------------------------------------------------------------------

const lagerkennzahlen: Aufgabentyp = {
  id: 'lagerkennzahlen',
  name: 'Lagerkennzahlen',
  thema: 'lagerkennzahlen',
  schwierigkeit: 2,
  worumGehts: 'Was die Zahlen über das Lager sagen: wie oft dreht die Ware, wie lange liegt sie?',
  erzeuge: (r) => {
    const anfang = zwischen(r, 8000, 20000, 500)
    const q: [number, number, number, number] = [
      zwischen(r, 8000, 22000, 500),
      zwischen(r, 8000, 22000, 500),
      zwischen(r, 8000, 22000, 500),
      zwischen(r, 8000, 22000, 500),
    ]
    const wareneinsatz = zwischen(r, 120000, 400000, 1000)

    const durchschnitt = r2((anfang + q[0] + q[1] + q[2] + q[3]) / 5)
    const uh = rN(wareneinsatz / durchschnitt, 2)
    const lagerdauer = rN(360 / uh, 1)

    const gegeben = [
      { label: 'Anfangsbestand', wert: eur(anfang) },
      { label: 'Bestand 31.03.', wert: eur(q[0]) },
      { label: 'Bestand 30.06.', wert: eur(q[1]) },
      { label: 'Bestand 30.09.', wert: eur(q[2]) },
      { label: 'Bestand 31.12.', wert: eur(q[3]) },
      { label: 'Wareneinsatz im Jahr', wert: eur(wareneinsatz) },
    ]

    const schrittDurchschnitt: RechenSchritt = {
      label: 'Durchschnittlicher Lagerbestand',
      rechnung: `(${zahl(anfang, 0)} + ${q.map((x) => zahl(x, 0)).join(' + ')}) ÷ 5`,
      ergebnis: `Ø Lagerbestand = ${eur(durchschnitt)}`,
      hinweis:
        'Geteilt wird durch die Anzahl der Werte: Anfangsbestand plus vier Quartalsbestände sind ' +
        'fünf Werte.',
    }

    const variante = waehle(r, ['durchschnitt', 'uh', 'dauer'] as const)

    if (variante === 'durchschnitt') {
      return {
        typId: 'lagerkennzahlen',
        titel: 'Durchschnittlicher Lagerbestand',
        thema: 'lagerkennzahlen',
        schwierigkeit: 2,
        frage: 'Wie hoch ist der durchschnittliche Lagerbestand?',
        gegeben,
        loesung: { wert: durchschnitt, toleranz: 0.5, einheit: '€' },
        formel: 'Ø Lagerbestand = (Anfangsbestand + Quartalsbestände) ÷ Anzahl der Werte',
        rechenweg: [schrittDurchschnitt],
      }
    }

    if (variante === 'uh') {
      return {
        typId: 'lagerkennzahlen',
        titel: 'Umschlagshäufigkeit',
        thema: 'lagerkennzahlen',
        schwierigkeit: 2,
        frage: 'Wie hoch ist die Umschlagshäufigkeit?',
        gegeben,
        loesung: { wert: uh, toleranz: 0.05, einheit: 'mal' },
        formel: 'Umschlagshäufigkeit = Wareneinsatz ÷ Ø Lagerbestand',
        rechenweg: [
          schrittDurchschnitt,
          {
            label: 'Umschlagshäufigkeit',
            rechnung: `${eur(wareneinsatz)} ÷ ${eur(durchschnitt)}`,
            ergebnis: `Umschlagshäufigkeit = ${zahl(uh)} mal im Jahr`,
            hinweis: 'Je höher, desto besser: das Kapital steckt kürzer in der Ware.',
          },
        ],
      }
    }

    return {
      typId: 'lagerkennzahlen',
      titel: 'Durchschnittliche Lagerdauer',
      thema: 'lagerkennzahlen',
      schwierigkeit: 2,
      frage: 'Wie hoch ist die durchschnittliche Lagerdauer in Tagen?',
      gegeben,
      loesung: { wert: lagerdauer, toleranz: 0.6, einheit: 'Tage' },
      formel: 'Lagerdauer = 360 ÷ Umschlagshäufigkeit',
      rechenweg: [
        schrittDurchschnitt,
        {
          label: 'Umschlagshäufigkeit',
          rechnung: `${eur(wareneinsatz)} ÷ ${eur(durchschnitt)}`,
          ergebnis: `Umschlagshäufigkeit = ${zahl(uh)}`,
        },
        {
          label: 'Lagerdauer',
          rechnung: `360 ÷ ${zahl(uh)}`,
          ergebnis: `Lagerdauer = ${tage(lagerdauer)}`,
          hinweis: 'Im Rechnungswesen wird mit 360 Tagen gerechnet, nicht mit 365.',
        },
      ],
    }
  },
}

// ---------------------------------------------------------------------------
// 8. Lagerzinssatz und Lagerzinsen
// ---------------------------------------------------------------------------

const lagerzinsen: Aufgabentyp = {
  id: 'lagerzinsen',
  name: 'Lagerzinsen',
  thema: 'lagerkennzahlen',
  schwierigkeit: 3,
  worumGehts: 'Was es kostet, dass Geld als Ware im Regal liegt statt auf dem Konto.',
  erzeuge: (r) => {
    const durchschnitt = zwischen(r, 10000, 60000, 500)
    const marktzins = waehle(r, [4, 5, 6, 8])
    const lagerdauer = zwischen(r, 20, 90, 5)

    const lagerzinssatz = rN((marktzins * lagerdauer) / 360, 3)
    const zinsen = r2((durchschnitt * lagerzinssatz) / 100)

    const gegeben = [
      { label: 'Ø Lagerbestand', wert: eur(durchschnitt) },
      { label: 'Marktzinssatz (Jahr)', wert: pz(marktzins) },
      { label: 'Ø Lagerdauer', wert: `${zahl(lagerdauer, 0)} Tage` },
    ]

    const schrittSatz: RechenSchritt = {
      label: 'Lagerzinssatz',
      rechnung: `${pz(marktzins)} × ${zahl(lagerdauer, 0)} ÷ 360`,
      ergebnis: `Lagerzinssatz = ${pz(lagerzinssatz, 3)}`,
      hinweis:
        'Der Jahreszinssatz gilt für 360 Tage. Liegt die Ware kürzer, fällt nur der entsprechende ' +
        'Anteil an.',
    }

    if (waehle(r, ['satz', 'zinsen'] as const) === 'satz') {
      return {
        typId: 'lagerzinsen',
        titel: 'Lagerzinssatz',
        thema: 'lagerkennzahlen',
        schwierigkeit: 3,
        frage: 'Wie hoch ist der Lagerzinssatz in Prozent?',
        gegeben,
        loesung: { wert: lagerzinssatz, toleranz: 0.01, einheit: '%' },
        formel: 'Lagerzinssatz = Marktzinssatz × Ø Lagerdauer ÷ 360',
        rechenweg: [schrittSatz],
      }
    }

    return {
      typId: 'lagerzinsen',
      titel: 'Lagerzinsen',
      thema: 'lagerkennzahlen',
      schwierigkeit: 3,
      frage: 'Wie hoch sind die Lagerzinsen in Euro?',
      gegeben,
      loesung: { wert: zinsen, toleranz: 0.5, einheit: '€' },
      formel: 'Lagerzinsen = Ø Lagerbestand × Lagerzinssatz ÷ 100',
      rechenweg: [
        schrittSatz,
        {
          label: 'Lagerzinsen',
          rechnung: `${eur(durchschnitt)} × ${pz(lagerzinssatz, 3)}`,
          ergebnis: `Lagerzinsen = ${eur(zinsen)}`,
          hinweis: 'Das ist echtes Geld, das der Laden verliert, wenn Ware zu lange liegt.',
        },
      ],
    }
  },
}

// ---------------------------------------------------------------------------
// 9. Mindestbestand und Meldebestand
// ---------------------------------------------------------------------------

const meldebestand: Aufgabentyp = {
  id: 'meldebestand',
  name: 'Meldebestand',
  thema: 'beschaffung',
  schwierigkeit: 1,
  worumGehts: 'Wann muss bestellt werden, damit das Regal nicht leer wird?',
  erzeuge: (r) => {
    const tagesverbrauch = zwischen(r, 20, 200, 5)
    const lieferzeit = zwischen(r, 2, 10, 1)
    const sicherheitstage = zwischen(r, 2, 6, 1)

    const mindestbestand = tagesverbrauch * sicherheitstage
    const meldebestandWert = tagesverbrauch * lieferzeit + mindestbestand

    const gegeben = [
      { label: 'Tagesverbrauch', wert: `${zahl(tagesverbrauch, 0)} Stück` },
      { label: 'Lieferzeit', wert: `${zahl(lieferzeit, 0)} Tage` },
      { label: 'Sicherheitsreserve', wert: `${zahl(sicherheitstage, 0)} Tage` },
    ]

    if (waehle(r, ['mindest', 'melde'] as const) === 'mindest') {
      return {
        typId: 'meldebestand',
        titel: 'Mindestbestand',
        thema: 'beschaffung',
        schwierigkeit: 1,
        frage: 'Wie hoch ist der Mindestbestand (eiserner Bestand) in Stück?',
        gegeben,
        loesung: { wert: mindestbestand, toleranz: 0, einheit: 'Stück' },
        formel: 'Mindestbestand = Tagesverbrauch × Sicherheitstage',
        rechenweg: [
          {
            label: 'Sicherheitsreserve rechnen',
            rechnung: `${zahl(tagesverbrauch, 0)} × ${zahl(sicherheitstage, 0)}`,
            ergebnis: `Mindestbestand = ${zahl(mindestbestand, 0)} Stück`,
            hinweis:
              'Der Mindestbestand ist der Puffer für Lieferverzug oder plötzlich höhere ' +
              'Nachfrage — im Normalbetrieb wird er nicht angetastet.',
          },
        ],
      }
    }

    return {
      typId: 'meldebestand',
      titel: 'Meldebestand',
      thema: 'beschaffung',
      schwierigkeit: 1,
      frage: 'Bei welchem Bestand muss bestellt werden?',
      gegeben,
      loesung: { wert: meldebestandWert, toleranz: 0, einheit: 'Stück' },
      formel: 'Meldebestand = Tagesverbrauch × Lieferzeit + Mindestbestand',
      rechenweg: [
        {
          label: 'Verbrauch während der Lieferzeit',
          rechnung: `${zahl(tagesverbrauch, 0)} × ${zahl(lieferzeit, 0)}`,
          ergebnis: `${zahl(tagesverbrauch * lieferzeit, 0)} Stück`,
        },
        {
          label: 'Mindestbestand',
          rechnung: `${zahl(tagesverbrauch, 0)} × ${zahl(sicherheitstage, 0)}`,
          ergebnis: `${zahl(mindestbestand, 0)} Stück`,
        },
        {
          label: 'Meldebestand',
          rechnung: `${zahl(tagesverbrauch * lieferzeit, 0)} + ${zahl(mindestbestand, 0)}`,
          ergebnis: `Meldebestand = ${zahl(meldebestandWert, 0)} Stück`,
          hinweis:
            'Wird dieser Bestand erreicht, löst das Warenwirtschaftssystem die Bestellung aus.',
        },
      ],
    }
  },
}

// ---------------------------------------------------------------------------
// 10. Umsatzsteuer: Brutto, Netto, Steuerbetrag
// ---------------------------------------------------------------------------

const umsatzsteuer: Aufgabentyp = {
  id: 'umsatzsteuer',
  name: 'Umsatzsteuer',
  thema: 'kasse',
  schwierigkeit: 1,
  worumGehts: 'Brutto, Netto und Steuerbetrag sicher auseinanderhalten.',
  erzeuge: (r) => {
    const satz = waehle(r, [19, 7])
    const netto = zwischen(r, 500, 25000, 5) / 100
    const steuer = r2((netto * satz) / 100)
    const brutto = r2(netto + steuer)
    const warengruppe = satz === 7 ? 'Backwaren' : 'Haushaltsartikel'

    const variante = waehle(r, ['brutto', 'netto', 'steuer'] as const)

    if (variante === 'brutto') {
      return {
        typId: 'umsatzsteuer',
        titel: 'Bruttobetrag',
        thema: 'kasse',
        schwierigkeit: 1,
        frage: `Wie hoch ist der Bruttobetrag für ${warengruppe}?`,
        gegeben: [
          { label: 'Nettobetrag', wert: eur(netto) },
          { label: 'Umsatzsteuersatz', wert: pz(satz) },
        ],
        loesung: { wert: brutto, toleranz: EUR_TOLERANZ, einheit: '€' },
        formel: 'Brutto = Netto × (100 + Steuersatz) ÷ 100',
        rechenweg: [
          {
            label: 'Steuerbetrag',
            rechnung: `${eur(netto)} × ${pz(satz)}`,
            ergebnis: `Umsatzsteuer = ${eur(steuer)}`,
          },
          {
            label: 'Brutto',
            rechnung: `${eur(netto)} + ${eur(steuer)}`,
            ergebnis: `Brutto = ${eur(brutto)}`,
          },
        ],
      }
    }

    if (variante === 'netto') {
      return {
        typId: 'umsatzsteuer',
        titel: 'Nettobetrag',
        thema: 'kasse',
        schwierigkeit: 1,
        frage: `Auf dem Bon stehen ${eur(brutto)} für ${warengruppe}. Wie hoch ist der Nettobetrag?`,
        gegeben: [
          { label: 'Bruttobetrag', wert: eur(brutto) },
          { label: 'Umsatzsteuersatz', wert: pz(satz) },
        ],
        loesung: { wert: netto, toleranz: EUR_TOLERANZ, einheit: '€' },
        formel: 'Netto = Brutto ÷ (100 + Steuersatz) × 100',
        rechenweg: [
          {
            label: 'Steuer herausrechnen',
            rechnung: `${eur(brutto)} ÷ ${zahl(100 + satz, 0)} × 100`,
            ergebnis: `Netto = ${eur(netto)}`,
            hinweis:
              satz === 19
                ? 'Häufigster Fehler: 19 % vom Bruttopreis abziehen. Richtig ist ÷ 1,19.'
                : 'Häufigster Fehler: 7 % vom Bruttopreis abziehen. Richtig ist ÷ 1,07.',
          },
        ],
      }
    }

    return {
      typId: 'umsatzsteuer',
      titel: 'Steuerbetrag',
      thema: 'kasse',
      schwierigkeit: 1,
      frage: 'Wie hoch ist die im Bruttobetrag enthaltene Umsatzsteuer?',
      gegeben: [
        { label: 'Bruttobetrag', wert: eur(brutto) },
        { label: 'Umsatzsteuersatz', wert: pz(satz) },
      ],
      loesung: { wert: steuer, toleranz: EUR_TOLERANZ, einheit: '€' },
      formel: 'Umsatzsteuer = Brutto − Brutto ÷ (100 + Steuersatz) × 100',
      rechenweg: [
        {
          label: 'Netto ermitteln',
          rechnung: `${eur(brutto)} ÷ ${zahl(100 + satz, 0)} × 100`,
          ergebnis: `Netto = ${eur(netto)}`,
        },
        {
          label: 'Steuerbetrag als Differenz',
          rechnung: `${eur(brutto)} − ${eur(netto)}`,
          ergebnis: `Umsatzsteuer = ${eur(steuer)}`,
        },
      ],
    }
  },
}

// ---------------------------------------------------------------------------
// 11. Skontovergleich: lohnt sich die schnelle Zahlung?
// ---------------------------------------------------------------------------

const skontovergleich: Aufgabentyp = {
  id: 'skontovergleich',
  name: 'Lohnt sich Skonto?',
  thema: 'beschaffung',
  schwierigkeit: 3,
  worumGehts:
    'Skonto ziehen heißt früher zahlen. Der Vergleich mit dem Kreditzins zeigt, ob es sich lohnt.',
  erzeuge: (r) => {
    const rechnungsbetrag = zwischen(r, 1000, 12000, 50)
    const skonto = waehle(r, [2, 3])
    const skontofrist = waehle(r, [8, 10, 14])
    const zahlungsziel = waehle(r, [30, 45, 60])
    const kreditzins = waehle(r, [8, 10, 12])

    const zinstage = zahlungsziel - skontofrist
    const jahreszins = rN((skonto * 360) / zinstage, 2)
    const skontobetrag = r2((rechnungsbetrag * skonto) / 100)

    const gegeben = [
      { label: 'Rechnungsbetrag', wert: eur(rechnungsbetrag) },
      { label: 'Zahlungsbedingung', wert: `${skonto} % Skonto in ${skontofrist} Tagen` },
      { label: 'Zahlungsziel', wert: `${zahlungsziel} Tage netto` },
      { label: 'Zinssatz des Kontokorrentkredits', wert: pz(kreditzins) },
    ]

    if (waehle(r, ['jahreszins', 'betrag'] as const) === 'betrag') {
      return {
        typId: 'skontovergleich',
        titel: 'Skontobetrag',
        thema: 'beschaffung',
        schwierigkeit: 3,
        frage: 'Wie hoch ist der Skontobetrag in Euro?',
        gegeben,
        loesung: { wert: skontobetrag, toleranz: EUR_TOLERANZ, einheit: '€' },
        formel: 'Skontobetrag = Rechnungsbetrag × Skontosatz ÷ 100',
        rechenweg: [
          {
            label: 'Skonto berechnen',
            rechnung: `${eur(rechnungsbetrag)} × ${pz(skonto)}`,
            ergebnis: `Skontobetrag = ${eur(skontobetrag)}`,
            hinweis: `Zu zahlen wären dann ${eur(r2(rechnungsbetrag - skontobetrag))}.`,
          },
        ],
      }
    }

    return {
      typId: 'skontovergleich',
      titel: 'Jahreszinssatz des Skontos',
      thema: 'beschaffung',
      schwierigkeit: 3,
      frage:
        'Wie hoch ist der Jahreszinssatz, der dem Skonto entspricht? Damit entscheidest du, ob ' +
        'sich das Ziehen des Skontos lohnt.',
      gegeben,
      loesung: { wert: jahreszins, toleranz: 0.1, einheit: '%' },
      formel: 'Jahreszinssatz = Skontosatz × 360 ÷ (Zahlungsziel − Skontofrist)',
      rechenweg: [
        {
          label: 'Zinstage bestimmen',
          rechnung: `${zahlungsziel} − ${skontofrist}`,
          ergebnis: `${zinstage} Tage`,
          hinweis: 'Nur für diese Tage nimmst du Geld auf. Nicht das ganze Zahlungsziel rechnen.',
        },
        {
          label: 'Auf das Jahr hochrechnen',
          rechnung: `${pz(skonto)} × 360 ÷ ${zinstage}`,
          ergebnis: `Jahreszinssatz = ${pz(jahreszins)}`,
        },
        {
          label: 'Entscheidung',
          rechnung: `${pz(jahreszins)} gegen ${pz(kreditzins)} Kreditzins`,
          ergebnis:
            jahreszins > kreditzins
              ? 'Skonto ziehen und dafür den Kredit nutzen — das ist günstiger.'
              : 'Skonto nicht ziehen — der Kredit wäre teurer als der Vorteil.',
          hinweis:
            'Der höhere Zinssatz gewinnt: Skonto ziehen, wenn es mehr bringt als der Kredit kostet.',
        },
      ],
    }
  },
}

// ---------------------------------------------------------------------------
// 12. Inventurdifferenz und Schwundquote
// ---------------------------------------------------------------------------

const inventurdifferenz: Aufgabentyp = {
  id: 'inventurdifferenz',
  name: 'Inventurdifferenz',
  thema: 'bestandsfuehrung',
  schwierigkeit: 2,
  worumGehts: 'Was fehlt zwischen System und Regal — und wie viel das vom Umsatz ausmacht.',
  erzeuge: (r) => {
    const sollbestand = zwischen(r, 40000, 120000, 500)
    const differenzWert = zwischen(r, 200, 2500, 50)
    const istbestand = sollbestand - differenzWert
    const umsatz = zwischen(r, 400000, 1200000, 5000)

    const quote = rN((differenzWert / umsatz) * 100, 3)

    const gegeben = [
      { label: 'Sollbestand (Warenwirtschaftssystem)', wert: eur(sollbestand) },
      { label: 'Istbestand (Inventur)', wert: eur(istbestand) },
      { label: 'Jahresumsatz', wert: eur(umsatz) },
    ]

    if (waehle(r, ['differenz', 'quote'] as const) === 'differenz') {
      return {
        typId: 'inventurdifferenz',
        titel: 'Inventurdifferenz',
        thema: 'bestandsfuehrung',
        schwierigkeit: 2,
        frage: 'Wie hoch ist die Inventurdifferenz in Euro?',
        gegeben,
        loesung: { wert: differenzWert, toleranz: EUR_TOLERANZ, einheit: '€' },
        formel: 'Inventurdifferenz = Sollbestand − Istbestand',
        rechenweg: [
          {
            label: 'Soll und Ist vergleichen',
            rechnung: `${eur(sollbestand)} − ${eur(istbestand)}`,
            ergebnis: `Inventurdifferenz = ${eur(differenzWert)}`,
            hinweis:
              'Ursachen sind Diebstahl, Verderb, Bruch oder Fehlbuchungen — nicht automatisch ' +
              'Diebstahl.',
          },
        ],
      }
    }

    return {
      typId: 'inventurdifferenz',
      titel: 'Schwundquote',
      thema: 'bestandsfuehrung',
      schwierigkeit: 2,
      frage: 'Wie hoch ist die Schwundquote in Prozent vom Umsatz?',
      gegeben,
      loesung: { wert: quote, toleranz: 0.01, einheit: '%' },
      formel: 'Schwundquote = Inventurdifferenz ÷ Umsatz × 100',
      rechenweg: [
        {
          label: 'Inventurdifferenz',
          rechnung: `${eur(sollbestand)} − ${eur(istbestand)}`,
          ergebnis: eur(differenzWert),
        },
        {
          label: 'Anteil am Umsatz',
          rechnung: `${eur(differenzWert)} ÷ ${eur(umsatz)} × 100`,
          ergebnis: `Schwundquote = ${pz(quote, 3)}`,
          hinweis: 'Im Lebensmitteleinzelhandel gilt etwa 1 % als üblicher Richtwert.',
        },
      ],
    }
  },
}

// ---------------------------------------------------------------------------

export const AUFGABENTYPEN: readonly Aufgabentyp[] = [
  bezugspreis,
  verkaufspreis,
  verkaufspreisKomplett,
  rueckwaerts,
  differenz,
  handelsspanne,
  lagerkennzahlen,
  lagerzinsen,
  meldebestand,
  umsatzsteuer,
  skontovergleich,
  inventurdifferenz,
  ...ERWEITERTE_AUFGABENTYPEN,
]

export function aufgabentyp(id: AufgabentypId): Aufgabentyp {
  const t = AUFGABENTYPEN.find((a) => a.id === id)
  if (!t) throw new Error(`Unbekannter Aufgabentyp: ${id}`)
  return t
}

/** Prüft eine eingegebene Zahl gegen die Lösung, inklusive erlaubter Toleranz. */
export function istZahlRichtig(loesung: ZahlLoesung, eingabe: number | null): boolean {
  if (eingabe === null || !Number.isFinite(eingabe)) return false
  return Math.abs(eingabe - loesung.wert) <= loesung.toleranz + 1e-9
}
