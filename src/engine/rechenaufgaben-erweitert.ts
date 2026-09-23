/**
 * Weitere Rechenaufgaben für Teil 2 (Controlling, Personal, Verkauf).
 * Jeder Rechenschritt ist bewusst klein gehalten: im geführten Modus rechnet
 * sie jeden Schritt einzeln und tippt das Zwischenergebnis ein.
 */

import type { Aufgabentyp } from './rechenaufgaben'
import { eur, pz, r2, rN, zahl } from './format'
import { waehle, zwischen } from './zufall'

const EUR_TOLERANZ = 0.02

// ---------------------------------------------------------------------------
// 13. Grundpreis nach Preisangabenverordnung
// ---------------------------------------------------------------------------

export const grundpreis: Aufgabentyp = {
  id: 'grundpreis',
  name: 'Grundpreis je Kilo oder Liter',
  thema: 'warenpraesentation',
  schwierigkeit: 1,
  worumGehts: 'Was kostet ein Kilo oder ein Liter? Diese Angabe muss am Regal stehen.',
  erzeuge: (r) => {
    const fluessig = r() < 0.4
    const menge = fluessig ? waehle(r, [200, 250, 500]) : waehle(r, [100, 125, 200, 250, 400, 500])
    const einheitKlein = fluessig ? 'ml' : 'g'
    const einheitGross = fluessig ? 'l' : 'kg'
    const preis = zwischen(r, 79, 899, 10) / 100
    const faktor = 1000 / menge
    const grund = r2(preis * faktor)
    const artikel = fluessig ? 'Eine Flasche Saft' : 'Eine Packung Käse'

    return {
      typId: 'grundpreis',
      titel: 'Grundpreis',
      thema: 'warenpraesentation',
      schwierigkeit: 1,
      frage: `${artikel} mit ${menge} ${einheitKlein} kostet ${eur(preis)}. Wie hoch ist der Grundpreis je 1 ${einheitGross}?`,
      gegeben: [
        { label: 'Inhalt', wert: `${menge} ${einheitKlein}` },
        { label: 'Verkaufspreis', wert: eur(preis) },
      ],
      loesung: { wert: grund, toleranz: EUR_TOLERANZ, einheit: '€' },
      formel: `Grundpreis = Verkaufspreis ÷ Inhalt × 1.000 ${einheitKlein}`,
      rechenweg: [
        {
          label: `Wie oft passt der Inhalt in 1 ${einheitGross}?`,
          rechnung: `1.000 ${einheitKlein} ÷ ${menge} ${einheitKlein}`,
          ergebnis: `${zahl(faktor, 2)} mal`,
          hinweis: `1 ${einheitGross} sind 1.000 ${einheitKlein}.`,
        },
        {
          label: 'Preis mit dieser Zahl malnehmen',
          rechnung: `${eur(preis)} × ${zahl(faktor, 2)}`,
          ergebnis: `Grundpreis = ${eur(grund)} je ${einheitGross}`,
          hinweis: 'Seit 2022 ist die Bezugsgröße immer 1 kg oder 1 l. Die Angabe je 100 g reicht nicht mehr.',
        },
      ],
    }
  },
}

// ---------------------------------------------------------------------------
// 14. Handlungskostenzuschlagssatz ermitteln
// ---------------------------------------------------------------------------

export const handlungskostensatz: Aufgabentyp = {
  id: 'handlungskostensatz',
  name: 'Handlungskostenzuschlag ermitteln',
  thema: 'kalkulation',
  schwierigkeit: 2,
  worumGehts: 'Den Prozentsatz für die Handlungskosten ermittelst du aus den Zahlen des Vorjahres.',
  erzeuge: (r) => {
    const wareneinsatz = zwischen(r, 30, 90, 1) * 10000
    const satz = waehle(r, [20, 25, 30, 35, 40, 45])
    const hk = (wareneinsatz * satz) / 100
    const quote = hk / wareneinsatz

    return {
      typId: 'handlungskostensatz',
      titel: 'Handlungskostenzuschlag',
      thema: 'kalkulation',
      schwierigkeit: 2,
      frage:
        'Aus der Buchführung des Vorjahres kennt der Markt seine Handlungskosten und den Wareneinsatz. ' +
        'Mit welchem Handlungskostenzuschlag in Prozent muss er kalkulieren?',
      gegeben: [
        { label: 'Handlungskosten (Personal, Miete, Energie …)', wert: eur(hk) },
        { label: 'Wareneinsatz zu Bezugspreisen', wert: eur(wareneinsatz) },
      ],
      loesung: { wert: satz, toleranz: 0.05, einheit: '%' },
      formel: 'Handlungskostenzuschlag = Handlungskosten ÷ Wareneinsatz × 100',
      rechenweg: [
        {
          label: 'Handlungskosten durch Wareneinsatz teilen',
          rechnung: `${eur(hk)} ÷ ${eur(wareneinsatz)}`,
          ergebnis: `${zahl(quote, 2)}`,
          hinweis: 'Das Ergebnis ist der Anteil als Kommazahl.',
        },
        {
          label: 'In Prozent umrechnen',
          rechnung: `${zahl(quote, 2)} × 100`,
          ergebnis: `Handlungskostenzuschlag = ${pz(satz)}`,
        },
      ],
    }
  },
}

// ---------------------------------------------------------------------------
// 15. Prozentuale Veränderung (Umsatz, Kunden, Absatz)
// ---------------------------------------------------------------------------

export const prozentveraenderung: Aufgabentyp = {
  id: 'prozentveraenderung',
  name: 'Veränderung in Prozent',
  thema: 'geschaeftsprozesse',
  schwierigkeit: 1,
  worumGehts: 'Um wie viel Prozent ist der Umsatz gestiegen? Diese Rechnung brauchst du im Controlling oft.',
  erzeuge: (r) => {
    const vorjahr = zwischen(r, 40, 120, 1) * 10000
    const prozent = waehle(r, [2, 3, 4, 5, 6, 8, 10, 12, 15])
    const neu = vorjahr + (vorjahr * prozent) / 100
    const differenz = neu - vorjahr
    const anteil = differenz / vorjahr

    return {
      typId: 'prozentveraenderung',
      titel: 'Umsatzsteigerung',
      thema: 'geschaeftsprozesse',
      schwierigkeit: 1,
      frage: 'Um wie viel Prozent ist der Jahresumsatz des Marktes gestiegen?',
      gegeben: [
        { label: 'Umsatz Vorjahr', wert: eur(vorjahr) },
        { label: 'Umsatz dieses Jahr', wert: eur(neu) },
      ],
      loesung: { wert: prozent, toleranz: 0.05, einheit: '%' },
      formel: 'Veränderung in % = (neuer Wert − alter Wert) ÷ alter Wert × 100',
      rechenweg: [
        {
          label: 'Um wie viel Euro ist es mehr geworden?',
          rechnung: `${eur(neu)} − ${eur(vorjahr)}`,
          ergebnis: `Steigerung = ${eur(differenz)}`,
        },
        {
          label: 'Steigerung durch den alten Wert teilen',
          rechnung: `${eur(differenz)} ÷ ${eur(vorjahr)}`,
          ergebnis: `${zahl(anteil, 2)}`,
          hinweis: 'Du teilst immer durch den Ausgangswert. Das ist hier der Umsatz des Vorjahres.',
        },
        {
          label: 'In Prozent umrechnen',
          rechnung: `${zahl(anteil, 2)} × 100`,
          ergebnis: `Steigerung = ${pz(prozent)}`,
        },
      ],
    }
  },
}

// ---------------------------------------------------------------------------
// 16. Dreisatz (proportional und antiproportional)
// ---------------------------------------------------------------------------

export const dreisatz: Aufgabentyp = {
  id: 'dreisatz',
  name: 'Dreisatz',
  thema: 'geschaeftsprozesse',
  schwierigkeit: 1,
  worumGehts: 'Erst auf eine Einheit rechnen, dann auf die gesuchte Menge. So löst du fast jede Mengenrechnung.',
  erzeuge: (r) => {
    if (r() < 0.5) {
      // proportional: mehr Kisten → mehr Gewicht
      const kisten1 = waehle(r, [6, 8, 10, 12, 15, 20])
      const jeKiste = waehle(r, [5, 7.5, 12, 15, 18])
      const gesamt1 = kisten1 * jeKiste
      const kisten2 = zwischen(r, 3, 30, 1)
      const gesamt2 = kisten2 * jeKiste
      return {
        typId: 'dreisatz',
        titel: 'Dreisatz',
        thema: 'geschaeftsprozesse',
        schwierigkeit: 1,
        frage: `${kisten1} Kisten Äpfel wiegen zusammen ${zahl(gesamt1, 1)} kg. Wie viel wiegen ${kisten2} Kisten?`,
        gegeben: [
          { label: 'Kisten', wert: `${kisten1}` },
          { label: 'Gewicht zusammen', wert: `${zahl(gesamt1, 1)} kg` },
          { label: 'Gesucht für', wert: `${kisten2} Kisten` },
        ],
        loesung: { wert: gesamt2, toleranz: 0.05, einheit: 'kg' },
        formel: 'Erst auf eine Einheit rechnen (teilen), dann auf die gesuchte Menge (malnehmen).',
        rechenweg: [
          {
            label: 'Auf eine Kiste rechnen',
            rechnung: `${zahl(gesamt1, 1)} kg ÷ ${kisten1}`,
            ergebnis: `1 Kiste = ${zahl(jeKiste, 1)} kg`,
            hinweis: 'Mehr Kisten, mehr Gewicht: das ist ein gerader (proportionaler) Dreisatz.',
          },
          {
            label: `Auf ${kisten2} Kisten rechnen`,
            rechnung: `${zahl(jeKiste, 1)} kg × ${kisten2}`,
            ergebnis: `${kisten2} Kisten = ${zahl(gesamt2, 1)} kg`,
          },
        ],
      }
    }

    // antiproportional: mehr Leute → weniger Zeit
    let leute1 = 2
    let stunden1 = 6
    let leute2 = 3
    for (let versuch = 0; versuch < 50; versuch++) {
      leute1 = waehle(r, [2, 3, 4, 5, 6])
      stunden1 = zwischen(r, 2, 9, 1)
      leute2 = waehle(r, [2, 3, 4, 5, 6, 8].filter((x) => x !== leute1))
      if ((leute1 * stunden1 * 100) % leute2 === 0) break
    }
    const arbeitsstunden = leute1 * stunden1
    const stunden2 = arbeitsstunden / leute2
    return {
      typId: 'dreisatz',
      titel: 'Dreisatz',
      thema: 'geschaeftsprozesse',
      schwierigkeit: 2,
      frage: `${leute1} Mitarbeiter brauchen für die Inventur der Getränkeabteilung ${stunden1} Stunden. Wie lange brauchen ${leute2} Mitarbeiter?`,
      gegeben: [
        { label: 'Mitarbeiter', wert: `${leute1}` },
        { label: 'Dauer', wert: `${stunden1} Stunden` },
        { label: 'Gesucht für', wert: `${leute2} Mitarbeiter` },
      ],
      loesung: { wert: stunden2, toleranz: 0.05, einheit: 'Std.' },
      formel: 'Umgekehrter Dreisatz: erst die gesamte Arbeit (malnehmen), dann auf die neue Anzahl verteilen (teilen).',
      rechenweg: [
        {
          label: 'Gesamte Arbeit in Stunden',
          rechnung: `${leute1} × ${stunden1} Std.`,
          ergebnis: `${arbeitsstunden} Arbeitsstunden`,
          hinweis: 'Mehr Leute, weniger Zeit: das ist ein umgekehrter (antiproportionaler) Dreisatz.',
        },
        {
          label: `Auf ${leute2} Mitarbeiter verteilen`,
          rechnung: `${arbeitsstunden} ÷ ${leute2}`,
          ergebnis: `Dauer = ${zahl(stunden2, 2)} Stunden`,
        },
      ],
    }
  },
}

// ---------------------------------------------------------------------------
// 17. Break-even-Menge
// ---------------------------------------------------------------------------

export const breakEven: Aufgabentyp = {
  id: 'break-even',
  name: 'Break-even-Menge',
  thema: 'geschaeftsprozesse',
  schwierigkeit: 2,
  worumGehts: 'Ab wie vielen verkauften Stück lohnt sich eine neue Theke?',
  erzeuge: (r) => {
    const db = waehle(r, [1.2, 1.5, 2, 2.4, 2.5, 3])
    const menge = zwischen(r, 2, 16, 1) * 500
    const fixkosten = r2(db * menge)
    const variabel = zwischen(r, 150, 300, 10) / 100
    const preis = r2(variabel + db)

    return {
      typId: 'break-even',
      titel: 'Break-even-Menge',
      thema: 'geschaeftsprozesse',
      schwierigkeit: 2,
      frage:
        'Der Markt plant eine Salatbar. Wie viele Salatschalen muss er im Monat verkaufen, damit die Fixkosten gedeckt sind?',
      gegeben: [
        { label: 'Fixkosten im Monat (Personal, Theke)', wert: eur(fixkosten) },
        { label: 'Verkaufspreis netto je Schale', wert: eur(preis) },
        { label: 'Variable Kosten je Schale (Zutaten, Verpackung)', wert: eur(variabel) },
      ],
      loesung: { wert: menge, toleranz: 0, einheit: 'Stück' },
      formel: 'Break-even-Menge = Fixkosten ÷ Deckungsbeitrag je Stück',
      rechenweg: [
        {
          label: 'Deckungsbeitrag je Schale',
          rechnung: `${eur(preis)} − ${eur(variabel)}`,
          ergebnis: `Deckungsbeitrag = ${eur(db)}`,
          hinweis: 'So viel bleibt von jeder Schale übrig, um die Fixkosten zu bezahlen.',
        },
        {
          label: 'Fixkosten durch Deckungsbeitrag',
          rechnung: `${eur(fixkosten)} ÷ ${eur(db)}`,
          ergebnis: `Break-even-Menge = ${zahl(menge, 0)} Stück`,
          hinweis: 'Ab der nächsten Schale macht der Markt Gewinn.',
        },
      ],
    }
  },
}

// ---------------------------------------------------------------------------
// 18. Rentabilität
// ---------------------------------------------------------------------------

export const rentabilitaet: Aufgabentyp = {
  id: 'rentabilitaet',
  name: 'Rentabilität',
  thema: 'geschaeftsprozesse',
  schwierigkeit: 2,
  worumGehts: 'Wie viel Gewinn bringt das eingesetzte Geld? Du setzt den Gewinn ins Verhältnis zum Kapital oder zum Umsatz.',
  erzeuge: (r) => {
    const gewinn = zwischen(r, 10, 60, 1) * 1000
    if (r() < 0.5) {
      const prozent = waehle(r, [4, 5, 6, 8, 10, 12, 15, 20])
      const eigenkapital = (gewinn * 100) / prozent
      return {
        typId: 'rentabilitaet',
        titel: 'Eigenkapitalrentabilität',
        thema: 'geschaeftsprozesse',
        schwierigkeit: 2,
        frage: 'Wie hoch ist die Eigenkapitalrentabilität des Marktes?',
        gegeben: [
          { label: 'Gewinn im Jahr', wert: eur(gewinn) },
          { label: 'Eigenkapital', wert: eur(eigenkapital) },
        ],
        loesung: { wert: prozent, toleranz: 0.05, einheit: '%' },
        formel: 'Eigenkapitalrentabilität = Gewinn ÷ Eigenkapital × 100',
        rechenweg: [
          {
            label: 'Gewinn durch Eigenkapital',
            rechnung: `${eur(gewinn)} ÷ ${eur(eigenkapital)}`,
            ergebnis: `${zahl(prozent / 100, 3)}`,
          },
          {
            label: 'In Prozent umrechnen',
            rechnung: `${zahl(prozent / 100, 3)} × 100`,
            ergebnis: `Eigenkapitalrentabilität = ${pz(prozent)}`,
            hinweis: 'Liegt sie unter dem Zins, den eine sichere Geldanlage bringt, lohnt sich das Geschäft kaum.',
          },
        ],
      }
    }

    const prozent = waehle(r, [1, 1.5, 2, 2.5, 3, 4, 5])
    const umsatz = rN((gewinn * 100) / prozent, 2)
    return {
      typId: 'rentabilitaet',
      titel: 'Umsatzrentabilität',
      thema: 'geschaeftsprozesse',
      schwierigkeit: 2,
      frage: 'Wie hoch ist die Umsatzrentabilität des Marktes?',
      gegeben: [
        { label: 'Gewinn im Jahr', wert: eur(gewinn) },
        { label: 'Umsatz im Jahr', wert: eur(umsatz) },
      ],
      loesung: { wert: prozent, toleranz: 0.05, einheit: '%' },
      formel: 'Umsatzrentabilität = Gewinn ÷ Umsatz × 100',
      rechenweg: [
        {
          label: 'Gewinn durch Umsatz',
          rechnung: `${eur(gewinn)} ÷ ${eur(umsatz)}`,
          ergebnis: `${zahl(prozent / 100, 3)}`,
        },
        {
          label: 'In Prozent umrechnen',
          rechnung: `${zahl(prozent / 100, 3)} × 100`,
          ergebnis: `Umsatzrentabilität = ${pz(prozent)}`,
          hinweis: 'Im Lebensmittelhandel sind 1 bis 3 % üblich. Von jedem Euro Umsatz bleiben nur wenige Cent Gewinn.',
        },
      ],
    }
  },
}

export const ERWEITERTE_AUFGABENTYPEN: readonly Aufgabentyp[] = [
  grundpreis,
  handlungskostensatz,
  prozentveraenderung,
  dreisatz,
  breakEven,
  rentabilitaet,
]
