/**
 * Zusätzliche Rechenaufgaben für die Stufen 2 bis 4 des Lernpfads: Kasse,
 * Kennzahlen, Steuer, Einkauf und die langen Kalkulationen aus der Prüfung.
 */

import type { Aufgabentyp } from './rechenaufgaben'
import { eur, pz, r2, rN, tage, zahl } from './format'
import { mische, waehle, zwischen } from './zufall'

const EUR_TOLERANZ = 0.02

function steuerFaktor(satz: number): string {
  return zahl(1 + satz / 100, 2)
}

// ---------------------------------------------------------------------------
// Kassenabrechnung: Soll-Bestand gegen gezähltes Geld
// ---------------------------------------------------------------------------

export const kassenabrechnung: Aufgabentyp = {
  id: 'kassenabrechnung',
  name: 'Kassenabrechnung',
  thema: 'kasse',
  schwierigkeit: 1,
  worumGehts: 'Stimmt die Kasse am Abend? Soll-Bestand ausrechnen und mit dem gezählten Geld vergleichen.',
  erzeuge: (r) => {
    const anfang = waehle(r, [150, 200, 250, 300])
    const einnahmen = r2(zwischen(r, 120000, 480000, 1) / 100)
    const auszahlungen = r2(zwischen(r, 1500, 12000, 1) / 100)
    const zwischensumme = r2(anfang + einnahmen)
    const soll = r2(zwischensumme - auszahlungen)
    const fehlt = r() < 0.7
    const abweichung = r2(zwischen(r, 10, 950, 5) / 100)
    const ist = r2(fehlt ? soll - abweichung : soll + abweichung)
    return {
      typId: 'kassenabrechnung',
      titel: 'Kassenabrechnung',
      thema: 'kasse',
      schwierigkeit: 1,
      frage:
        `Deine Kasse startet morgens mit ${eur(anfang)} Wechselgeld. Laut Kassenbericht hast du ` +
        `${eur(einnahmen)} bar eingenommen und ${eur(auszahlungen)} für Pfandbons bar ausgezahlt. ` +
        `Am Abend zählst du ${eur(ist)}. Wie hoch ist die Abweichung?`,
      gegeben: [
        { label: 'Wechselgeld am Morgen', wert: eur(anfang) },
        { label: 'Bareinnahmen', wert: eur(einnahmen) },
        { label: 'Barauszahlungen', wert: eur(auszahlungen) },
        { label: 'Gezählter Bestand', wert: eur(ist) },
      ],
      loesung: { wert: abweichung, toleranz: 0.01, einheit: '€' },
      formel: 'Wechselgeld + Einnahmen − Auszahlungen = Soll-Bestand. Soll und gezählten Bestand vergleichen.',
      rechenweg: [
        {
          label: 'Wechselgeld und Einnahmen zusammenzählen',
          rechnung: `${eur(anfang)} + ${eur(einnahmen)}`,
          ergebnis: `Zwischensumme = ${eur(zwischensumme)}`,
        },
        {
          label: 'Auszahlungen abziehen',
          rechnung: `${eur(zwischensumme)} − ${eur(auszahlungen)}`,
          ergebnis: `Soll-Bestand = ${eur(soll)}`,
          hinweis: 'So viel Geld müsste jetzt in der Kasse liegen.',
        },
        {
          label: 'Mit dem gezählten Geld vergleichen',
          rechnung: fehlt ? `${eur(soll)} − ${eur(ist)}` : `${eur(ist)} − ${eur(soll)}`,
          ergebnis: fehlt ? `Fehlbetrag = ${eur(abweichung)}` : `Überschuss = ${eur(abweichung)}`,
          hinweis: fehlt
            ? 'Es liegt weniger Geld in der Kasse, als es sein müsste. Das ist ein Kassenfehlbetrag.'
            : 'Es liegt mehr Geld in der Kasse, als es sein müsste. Auch ein Überschuss wird notiert.',
        },
      ],
    }
  },
}

// ---------------------------------------------------------------------------
// Rohgewinn: Nettoumsatz minus Wareneinsatz
// ---------------------------------------------------------------------------

export const rohgewinn: Aufgabentyp = {
  id: 'rohgewinn',
  name: 'Rohgewinn',
  thema: 'geschaeftsprozesse',
  schwierigkeit: 2,
  worumGehts: 'Was bleibt vom Umsatz nach dem Wareneinsatz? Vorher die Umsatzsteuer herausrechnen.',
  erzeuge: (r) => {
    const satz = waehle(r, [7, 19])
    const netto = zwischen(r, 80, 400, 1) * 100
    const brutto = r2(netto * (1 + satz / 100))
    const spanne = waehle(r, [22, 25, 28, 30, 32, 35])
    const wareneinsatz = r2((netto * (100 - spanne)) / 100)
    const gewinn = r2(netto - wareneinsatz)
    const abteilung = satz === 7 ? 'Obst- und Gemüseabteilung' : 'Drogerieabteilung'
    return {
      typId: 'rohgewinn',
      titel: 'Rohgewinn',
      thema: 'geschaeftsprozesse',
      schwierigkeit: 2,
      frage:
        `Die ${abteilung} hat im Monat ${eur(brutto)} umgesetzt, inklusive ${satz} % Umsatzsteuer. ` +
        `Der Wareneinsatz lag bei ${eur(wareneinsatz)}. Wie hoch ist der Rohgewinn?`,
      gegeben: [
        { label: 'Umsatz brutto', wert: eur(brutto) },
        { label: 'Umsatzsteuersatz', wert: pz(satz) },
        { label: 'Wareneinsatz', wert: eur(wareneinsatz) },
      ],
      loesung: { wert: gewinn, toleranz: EUR_TOLERANZ, einheit: '€' },
      formel: 'Umsatz brutto ÷ 1,19 (oder 1,07) = Nettoumsatz. Nettoumsatz − Wareneinsatz = Rohgewinn.',
      rechenweg: [
        {
          label: 'Umsatzsteuer herausrechnen',
          rechnung: `${eur(brutto)} ÷ ${steuerFaktor(satz)}`,
          ergebnis: `Nettoumsatz = ${eur(netto)}`,
          hinweis: 'Die Umsatzsteuer gehört dem Finanzamt. Deshalb rechnest du sie zuerst heraus.',
        },
        {
          label: 'Wareneinsatz abziehen',
          rechnung: `${eur(netto)} − ${eur(wareneinsatz)}`,
          ergebnis: `Rohgewinn = ${eur(gewinn)}`,
          hinweis:
            'Der Wareneinsatz ist das, was die verkaufte Ware im Einkauf gekostet hat. ' +
            'Vom Rohgewinn gehen noch die Handlungskosten ab.',
        },
      ],
    }
  },
}

// ---------------------------------------------------------------------------
// Flächen- und Personalkennzahlen
// ---------------------------------------------------------------------------

export const flaechenkennzahlen: Aufgabentyp = {
  id: 'flaechenkennzahlen',
  name: 'Umsatz je m² und je Stunde',
  thema: 'geschaeftsprozesse',
  schwierigkeit: 1,
  worumGehts: 'Wie viel Umsatz bringt ein Quadratmeter oder eine Arbeitsstunde? Umsatz geteilt durch Fläche oder Stunden.',
  erzeuge: (r) => {
    if (r() < 0.5) {
      const flaeche = waehle(r, [800, 1000, 1200, 1500, 1800, 2000])
      const jeM2 = zwischen(r, 3500, 6000, 50)
      const umsatz = flaeche * jeM2
      return {
        typId: 'flaechenkennzahlen',
        titel: 'Umsatz je m²',
        thema: 'geschaeftsprozesse',
        schwierigkeit: 1,
        frage:
          `Ein Supermarkt hat ${zahl(flaeche, 0)} m² Verkaufsfläche und im letzten Jahr ${eur(umsatz)} ` +
          'umgesetzt. Wie hoch ist der Umsatz je m² (Flächenproduktivität)?',
        gegeben: [
          { label: 'Jahresumsatz', wert: eur(umsatz) },
          { label: 'Verkaufsfläche', wert: `${zahl(flaeche, 0)} m²` },
        ],
        loesung: { wert: jeM2, toleranz: EUR_TOLERANZ, einheit: '€' },
        formel: 'Umsatz je m² = Umsatz ÷ Verkaufsfläche',
        rechenweg: [
          {
            label: 'Umsatz durch die Fläche teilen',
            rechnung: `${eur(umsatz)} ÷ ${zahl(flaeche, 0)} m²`,
            ergebnis: `Umsatz je m² = ${eur(jeM2)}`,
            hinweis: 'Mit dieser Zahl vergleicht man Märkte unterschiedlicher Größe.',
          },
        ],
      }
    }
    const personen = waehle(r, [6, 8, 10, 12, 14])
    const stunden = waehle(r, [30, 35, 38, 40])
    const gesamt = personen * stunden
    const jeStunde = zwischen(r, 120, 260, 2)
    const umsatz = gesamt * jeStunde
    return {
      typId: 'flaechenkennzahlen',
      titel: 'Umsatz je Arbeitsstunde',
      thema: 'geschaeftsprozesse',
      schwierigkeit: 1,
      frage:
        `In der Getränkeabteilung arbeiten ${personen} Personen je ${stunden} Stunden pro Woche. ` +
        `Der Wochenumsatz liegt bei ${eur(umsatz)}. Wie hoch ist der Umsatz je Arbeitsstunde?`,
      gegeben: [
        { label: 'Personen', wert: zahl(personen, 0) },
        { label: 'Stunden je Person und Woche', wert: `${stunden} Std.` },
        { label: 'Wochenumsatz', wert: eur(umsatz) },
      ],
      loesung: { wert: jeStunde, toleranz: EUR_TOLERANZ, einheit: '€' },
      formel: 'Umsatz je Arbeitsstunde = Umsatz ÷ geleistete Arbeitsstunden',
      rechenweg: [
        {
          label: 'Arbeitsstunden zusammenrechnen',
          rechnung: `${personen} × ${stunden} Std.`,
          ergebnis: `Arbeitsstunden = ${zahl(gesamt, 0)} Std.`,
        },
        {
          label: 'Umsatz durch die Stunden teilen',
          rechnung: `${eur(umsatz)} ÷ ${zahl(gesamt, 0)} Std.`,
          ergebnis: `Umsatz je Arbeitsstunde = ${eur(jeStunde)}`,
          hinweis: 'Diese Kennzahl hilft bei der Personalplanung.',
        },
      ],
    }
  },
}

// ---------------------------------------------------------------------------
// Angebotsvergleich zweier Lieferanten
// ---------------------------------------------------------------------------

const WAREN = ['Gläser Honig', 'Flaschen Apfelsaft', 'Packungen Müsli', 'Dosen Kaffee'] as const

export const angebotsvergleich: Aufgabentyp = {
  id: 'angebotsvergleich',
  name: 'Angebotsvergleich',
  thema: 'beschaffung',
  schwierigkeit: 3,
  worumGehts: 'Zwei Lieferanten, zwei Angebote: Für beide den Bezugspreis ausrechnen, dann vergleichen.',
  erzeuge: (r) => {
    const ware = waehle(r, WAREN)
    const menge = waehle(r, [50, 80, 100, 120, 150, 200])
    const listeA = zwischen(r, 150, 600, 5) / 100
    const rabatt = waehle(r, [5, 10, 15])
    const skonto = waehle(r, [2, 3])
    const fracht = zwischen(r, 20, 60, 5)

    const lepA = r2(menge * listeA)
    const rabattBetrag = r2((lepA * rabatt) / 100)
    const zepA = r2(lepA - rabattBetrag)
    const skontoBetrag = r2((zepA * skonto) / 100)
    const bepA = r2(zepA - skontoBetrag)
    const bzpA = r2(bepA + fracht)

    // Angebot B liegt ein paar Prozent darüber oder darunter, damit der Vergleich nicht knapp wird.
    const listeB = r2((bzpA / menge) * waehle(r, [0.92, 0.95, 1.05, 1.08]))
    const bzpB = r2(menge * listeB)
    const aGewinnt = bzpA < bzpB
    const besser = aGewinnt ? bzpA : bzpB

    return {
      typId: 'angebotsvergleich',
      titel: 'Angebotsvergleich',
      thema: 'beschaffung',
      schwierigkeit: 3,
      frage:
        `Du brauchst ${menge} ${ware}. Lieferant A verlangt ${eur(listeA)} je Stück, gibt ${rabatt} % Rabatt ` +
        `und ${skonto} % Skonto und berechnet ${eur(fracht)} Fracht. Lieferant B verlangt ${eur(listeB)} je Stück ` +
        'frei Haus, ohne Rabatt und Skonto. Wie hoch ist der Bezugspreis des günstigeren Angebots?',
      gegeben: [
        { label: 'Menge', wert: `${menge} Stück` },
        { label: 'A: Preis je Stück', wert: eur(listeA) },
        { label: 'A: Rabatt / Skonto', wert: `${pz(rabatt)} / ${pz(skonto)}` },
        { label: 'A: Fracht', wert: eur(fracht) },
        { label: 'B: Preis je Stück, frei Haus', wert: eur(listeB) },
      ],
      loesung: { wert: besser, toleranz: EUR_TOLERANZ, einheit: '€' },
      formel: 'Für jedes Angebot: Listenpreis − Rabatt − Skonto + Bezugskosten = Bezugspreis. Der kleinere gewinnt.',
      rechenweg: [
        {
          label: 'Angebot A: Listenpreis für die ganze Menge',
          rechnung: `${menge} × ${eur(listeA)}`,
          ergebnis: `Listeneinkaufspreis A = ${eur(lepA)}`,
        },
        {
          label: 'Angebot A: Rabatt abziehen',
          rechnung: `${eur(lepA)} × ${pz(rabatt)} = ${eur(rabattBetrag)}`,
          ergebnis: `Zieleinkaufspreis A = ${eur(lepA)} − ${eur(rabattBetrag)} = ${eur(zepA)}`,
        },
        {
          label: 'Angebot A: Skonto abziehen',
          rechnung: `${eur(zepA)} × ${pz(skonto)} = ${eur(skontoBetrag)}`,
          ergebnis: `Bareinkaufspreis A = ${eur(zepA)} − ${eur(skontoBetrag)} = ${eur(bepA)}`,
          hinweis: 'Skonto rechnest du vom Preis nach Rabatt.',
        },
        {
          label: 'Angebot A: Fracht dazu',
          rechnung: `${eur(bepA)} + ${eur(fracht)}`,
          ergebnis: `Bezugspreis A = ${eur(bzpA)}`,
        },
        {
          label: 'Angebot B: frei Haus, ohne Abzüge',
          rechnung: `${menge} × ${eur(listeB)}`,
          ergebnis: `Bezugspreis B = ${eur(bzpB)}`,
          hinweis: 'Frei Haus heißt: Der Lieferant zahlt die Fracht. Ohne Rabatt und Skonto ist das schon der Bezugspreis.',
        },
        {
          label: 'Vergleichen',
          rechnung: `${eur(bzpA)} gegen ${eur(bzpB)}`,
          ergebnis: `Günstiger ist Angebot ${aGewinnt ? 'A' : 'B'} mit ${eur(besser)}`,
          hinweis: 'In der Prüfung zählt oft nicht nur der Preis. Qualität, Lieferzeit und Zuverlässigkeit gehören auch dazu.',
        },
      ],
    }
  },
}

// ---------------------------------------------------------------------------
// Kalkulationsfaktor ermitteln und anwenden
// ---------------------------------------------------------------------------

export const kalkulationsfaktor: Aufgabentyp = {
  id: 'kalkulationsfaktor',
  name: 'Mit dem Kalkulationsfaktor rechnen',
  thema: 'kalkulation',
  schwierigkeit: 2,
  worumGehts: 'Den Faktor aus einem bekannten Artikel ablesen und damit einen neuen Artikel in einem Schritt kalkulieren.',
  erzeuge: (r) => {
    const faktor = waehle(r, [1.25, 1.3, 1.4, 1.5, 1.6, 1.75, 1.8, 2])
    const satz = waehle(r, [7, 19])
    const bezug1 = r2(zwischen(r, 5, 40, 1) / 5)
    const netto1 = r2(bezug1 * faktor)
    const bezug2 = r2(zwischen(r, 5, 40, 1) / 5)
    const netto2 = r2(bezug2 * faktor)
    const brutto2 = r2(netto2 * (1 + satz / 100))
    const artikel =
      satz === 7
        ? { bekannt: 'Eine Packung Kaffee', neu: 'Eine neue Kaffeesorte' }
        : { bekannt: 'Ein Duschgel', neu: 'Ein neues Duschgel' }
    return {
      typId: 'kalkulationsfaktor',
      titel: 'Kalkulationsfaktor',
      thema: 'kalkulation',
      schwierigkeit: 2,
      frage:
        `${artikel.bekannt} hat einen Bezugspreis von ${eur(bezug1)} und wird netto für ${eur(netto1)} verkauft. ` +
        `${artikel.neu} kostet im Bezug ${eur(bezug2)} und wird mit demselben Faktor kalkuliert. ` +
        `Wie hoch ist der Bruttoverkaufspreis des neuen Artikels bei ${satz} % Umsatzsteuer?`,
      gegeben: [
        { label: 'Bekannter Artikel: Bezugspreis', wert: eur(bezug1) },
        { label: 'Bekannter Artikel: Nettoverkaufspreis', wert: eur(netto1) },
        { label: 'Neuer Artikel: Bezugspreis', wert: eur(bezug2) },
        { label: 'Umsatzsteuer', wert: pz(satz) },
      ],
      loesung: { wert: brutto2, toleranz: EUR_TOLERANZ, einheit: '€' },
      formel: 'Kalkulationsfaktor = Nettoverkaufspreis ÷ Bezugspreis. Bezugspreis × Faktor = Nettoverkaufspreis.',
      rechenweg: [
        {
          label: 'Kalkulationsfaktor ermitteln',
          rechnung: `${eur(netto1)} ÷ ${eur(bezug1)}`,
          ergebnis: `Kalkulationsfaktor = ${zahl(faktor, 2)}`,
          hinweis: 'Der Faktor sagt, wie viel mal so hoch der Nettoverkaufspreis ist wie der Bezugspreis.',
        },
        {
          label: 'Neuen Artikel kalkulieren',
          rechnung: `${eur(bezug2)} × ${zahl(faktor, 2)}`,
          ergebnis: `Nettoverkaufspreis = ${eur(netto2)}`,
          hinweis: 'Handlungskosten und Gewinn stecken beide im Faktor. Deshalb reicht eine Rechnung.',
        },
        {
          label: 'Umsatzsteuer dazu',
          rechnung: `${eur(netto2)} × ${steuerFaktor(satz)}`,
          ergebnis: `Bruttoverkaufspreis = ${eur(brutto2)}`,
        },
      ],
    }
  },
}

// ---------------------------------------------------------------------------
// Umsatzsteuer-Zahllast
// ---------------------------------------------------------------------------

export const zahllast: Aufgabentyp = {
  id: 'zahllast',
  name: 'Zahllast ans Finanzamt',
  thema: 'geschaeftsprozesse',
  schwierigkeit: 2,
  worumGehts: 'Umsatzsteuer aus den Verkäufen minus Vorsteuer aus den Einkäufen. Den Rest bekommt das Finanzamt.',
  erzeuge: (r) => {
    const satz = waehle(r, [7, 19])
    const verkauf = zwischen(r, 200, 900, 1) * 100
    const einkauf = r2(verkauf * waehle(r, [0.55, 0.6, 0.65, 0.7, 0.75]))
    const ust = r2((verkauf * satz) / 100)
    const vst = r2((einkauf * satz) / 100)
    const last = r2(ust - vst)
    return {
      typId: 'zahllast',
      titel: 'Zahllast',
      thema: 'geschaeftsprozesse',
      schwierigkeit: 2,
      frage:
        `Ein Markt hat im Monat Ware für ${eur(verkauf)} netto verkauft und für ${eur(einkauf)} netto eingekauft. ` +
        `Für alles gilt ${satz} % Umsatzsteuer. Wie hoch ist die Zahllast an das Finanzamt?`,
      gegeben: [
        { label: 'Verkäufe netto', wert: eur(verkauf) },
        { label: 'Einkäufe netto', wert: eur(einkauf) },
        { label: 'Steuersatz', wert: pz(satz) },
      ],
      loesung: { wert: last, toleranz: EUR_TOLERANZ, einheit: '€' },
      formel: 'Umsatzsteuer − Vorsteuer = Zahllast',
      rechenweg: [
        {
          label: 'Umsatzsteuer auf die Verkäufe',
          rechnung: `${eur(verkauf)} × ${pz(satz)}`,
          ergebnis: `Umsatzsteuer = ${eur(ust)}`,
          hinweis: 'Diese Steuer hat der Markt von den Kunden kassiert. Sie gehört dem Finanzamt.',
        },
        {
          label: 'Vorsteuer auf die Einkäufe',
          rechnung: `${eur(einkauf)} × ${pz(satz)}`,
          ergebnis: `Vorsteuer = ${eur(vst)}`,
          hinweis: 'Diese Steuer hat der Markt selbst an die Lieferanten gezahlt. Er darf sie abziehen.',
        },
        {
          label: 'Vorsteuer abziehen',
          rechnung: `${eur(ust)} − ${eur(vst)}`,
          ergebnis: `Zahllast = ${eur(last)}`,
          hinweis: 'Überwiesen wird nur der Unterschied. Für den Markt ist die Umsatzsteuer ein durchlaufender Posten.',
        },
      ],
    }
  },
}

// ---------------------------------------------------------------------------
// Rückwärtskalkulation bis zum Listeneinkaufspreis
// ---------------------------------------------------------------------------

export const rueckwaertsKomplett: Aufgabentyp = {
  id: 'rueckwaerts-komplett',
  name: 'Rückwärts bis zum Listenpreis',
  thema: 'kalkulation',
  schwierigkeit: 3,
  worumGehts: 'Vom Ladenpreis ganz zurück bis zu dem Listenpreis, den der Markt dem Lieferanten höchstens zahlen kann.',
  erzeuge: (r) => {
    const satz = waehle(r, [7, 19])
    const gewinn = waehle(r, [5, 8, 10, 12, 15])
    const hk = waehle(r, [20, 25, 30, 35, 40])
    const skonto = waehle(r, [2, 3])
    const rabatt = waehle(r, [10, 15, 20, 25])
    const bezugskosten = r2(zwischen(r, 5, 40, 1) / 100)
    const brutto = r2(zwischen(r, 3, 24, 1) + waehle(r, [0.49, 0.79, 0.99]))

    const netto = r2(brutto / (1 + satz / 100))
    const selbst = r2((netto / (100 + gewinn)) * 100)
    const bezug = r2((selbst / (100 + hk)) * 100)
    const bar = r2(bezug - bezugskosten)
    const ziel = r2((bar / (100 - skonto)) * 100)
    const liste = r2((ziel / (100 - rabatt)) * 100)

    return {
      typId: 'rueckwaerts-komplett',
      titel: 'Rückwärts bis zum Listenpreis',
      thema: 'kalkulation',
      schwierigkeit: 3,
      frage:
        `Ein Artikel soll im Markt ${eur(brutto)} kosten, inklusive ${satz} % Umsatzsteuer. Der Markt rechnet mit ` +
        `${hk} % Handlungskosten und ${gewinn} % Gewinn. Der Lieferant gibt ${rabatt} % Rabatt und ${skonto} % Skonto, ` +
        `die Bezugskosten liegen bei ${eur(bezugskosten)} je Stück. Wie hoch darf der Listeneinkaufspreis höchstens sein?`,
      gegeben: [
        { label: 'Bruttoverkaufspreis', wert: eur(brutto) },
        { label: 'Umsatzsteuer', wert: pz(satz) },
        { label: 'Gewinn', wert: pz(gewinn) },
        { label: 'Handlungskosten', wert: pz(hk) },
        { label: 'Bezugskosten je Stück', wert: eur(bezugskosten) },
        { label: 'Liefererskonto', wert: pz(skonto) },
        { label: 'Liefererrabatt', wert: pz(rabatt) },
      ],
      loesung: { wert: liste, toleranz: 0.05, einheit: '€' },
      formel:
        'Brutto ÷ 1,19 = Netto ÷ (100 + Gewinn) × 100 = Selbstkosten ÷ (100 + Handlungskosten) × 100 = Bezugspreis ' +
        '− Bezugskosten = Bareinkaufspreis ÷ (100 − Skonto) × 100 = Zieleinkaufspreis ÷ (100 − Rabatt) × 100 = Listeneinkaufspreis',
      rechenweg: [
        {
          label: 'Umsatzsteuer herausrechnen',
          rechnung: `${eur(brutto)} ÷ ${steuerFaktor(satz)}`,
          ergebnis: `Nettoverkaufspreis = ${eur(netto)}`,
          hinweis: `Der Bruttopreis sind ${100 + satz} %. Das ist eine Rechnung „auf Hundert".`,
        },
        {
          label: 'Gewinn herausrechnen',
          rechnung: `${eur(netto)} ÷ ${100 + gewinn} × 100`,
          ergebnis: `Selbstkosten = ${eur(selbst)}`,
          hinweis: `Die Selbstkosten sind 100 %, der Nettoverkaufspreis ${100 + gewinn} %.`,
        },
        {
          label: 'Handlungskosten herausrechnen',
          rechnung: `${eur(selbst)} ÷ ${100 + hk} × 100`,
          ergebnis: `Bezugspreis = ${eur(bezug)}`,
          hinweis: `Der Bezugspreis sind 100 %, die Selbstkosten ${100 + hk} %.`,
        },
        {
          label: 'Bezugskosten abziehen',
          rechnung: `${eur(bezug)} − ${eur(bezugskosten)}`,
          ergebnis: `Bareinkaufspreis = ${eur(bar)}`,
          hinweis: 'Vorwärts kommt die Fracht dazu. Rückwärts ziehst du sie ab.',
        },
        {
          label: 'Skonto einrechnen',
          rechnung: `${eur(bar)} ÷ ${100 - skonto} × 100`,
          ergebnis: `Zieleinkaufspreis = ${eur(ziel)}`,
          hinweis: `Der Barpreis ist der Zielpreis minus Skonto, also ${100 - skonto} %. Das ist eine Rechnung „im Hundert".`,
        },
        {
          label: 'Rabatt einrechnen',
          rechnung: `${eur(ziel)} ÷ ${100 - rabatt} × 100`,
          ergebnis: `Listeneinkaufspreis = ${eur(liste)}`,
          hinweis: `Der Zielpreis sind ${100 - rabatt} % vom Listenpreis.`,
        },
      ],
    }
  },
}

// ---------------------------------------------------------------------------
// Differenzkalkulation mit Rabatt, Skonto und Umsatzsteuer
// ---------------------------------------------------------------------------

export const differenzKomplett: Aufgabentyp = {
  id: 'differenz-komplett',
  name: 'Differenzkalkulation mit Rabatt und Skonto',
  thema: 'kalkulation',
  schwierigkeit: 3,
  worumGehts: 'Einkaufspreis und Ladenpreis stehen fest. Von beiden Seiten rechnen, in der Mitte bleibt der Gewinn.',
  erzeuge: (r) => {
    const satz = waehle(r, [7, 19])
    const liste = r2(zwischen(r, 200, 1200, 5) / 100)
    const rabatt = waehle(r, [10, 15, 20])
    const skonto = waehle(r, [2, 3])
    const bezugskosten = r2(zwischen(r, 5, 30, 1) / 100)
    const hk = waehle(r, [20, 25, 30, 35])
    const zielGewinn = waehle(r, [6, 8, 10, 12, 15])

    const rabattBetrag = r2((liste * rabatt) / 100)
    const ziel = r2(liste - rabattBetrag)
    const skontoBetrag = r2((ziel * skonto) / 100)
    const bar = r2(ziel - skontoBetrag)
    const bezug = r2(bar + bezugskosten)
    const hkBetrag = r2((bezug * hk) / 100)
    const selbst = r2(bezug + hkBetrag)
    // Ladenpreise enden auf 9 Cent und liegen höchstens 10 Cent über dem rechnerischen Preis.
    const exakt = selbst * (1 + zielGewinn / 100) * (1 + satz / 100)
    const brutto = r2(Math.ceil((exakt + 0.01) * 10) / 10 - 0.01)
    const netto = r2(brutto / (1 + satz / 100))
    const gewinn = r2(netto - selbst)
    const prozent = rN((gewinn / selbst) * 100, 2)
    const ware = satz === 7 ? { name: 'ein Olivenöl', einheit: 'Flasche' } : { name: 'ein Waschmittel', einheit: 'Packung' }

    return {
      typId: 'differenz-komplett',
      titel: 'Differenzkalkulation',
      thema: 'kalkulation',
      schwierigkeit: 3,
      frage:
        `Ein Lieferant bietet ${ware.name} für ${eur(liste)} je ${ware.einheit} an, mit ${rabatt} % Rabatt und ` +
        `${skonto} % Skonto. Die Bezugskosten liegen bei ${eur(bezugskosten)} je ${ware.einheit}, die Handlungskosten ` +
        `bei ${hk} %. Im Markt kostet die ${ware.einheit} ${eur(brutto)}, inklusive ${satz} % Umsatzsteuer. ` +
        'Wie viel Prozent Gewinn bleiben?',
      gegeben: [
        { label: 'Listeneinkaufspreis', wert: eur(liste) },
        { label: 'Liefererrabatt / Skonto', wert: `${pz(rabatt)} / ${pz(skonto)}` },
        { label: 'Bezugskosten', wert: eur(bezugskosten) },
        { label: 'Handlungskosten', wert: pz(hk) },
        { label: 'Bruttoverkaufspreis', wert: eur(brutto) },
        { label: 'Umsatzsteuer', wert: pz(satz) },
      ],
      loesung: { wert: prozent, toleranz: 0.1, einheit: '%' },
      formel:
        'Von oben bis zu den Selbstkosten, von unten bis zum Nettoverkaufspreis. ' +
        'Gewinn = Nettoverkaufspreis − Selbstkosten, Gewinn in % = Gewinn ÷ Selbstkosten × 100',
      rechenweg: [
        {
          label: 'Liefererrabatt abziehen',
          rechnung: `${eur(liste)} × ${pz(rabatt)} = ${eur(rabattBetrag)}`,
          ergebnis: `Zieleinkaufspreis = ${eur(liste)} − ${eur(rabattBetrag)} = ${eur(ziel)}`,
        },
        {
          label: 'Liefererskonto abziehen',
          rechnung: `${eur(ziel)} × ${pz(skonto)} = ${eur(skontoBetrag)}`,
          ergebnis: `Bareinkaufspreis = ${eur(ziel)} − ${eur(skontoBetrag)} = ${eur(bar)}`,
        },
        {
          label: 'Bezugskosten dazu',
          rechnung: `${eur(bar)} + ${eur(bezugskosten)}`,
          ergebnis: `Bezugspreis = ${eur(bezug)}`,
        },
        {
          label: 'Handlungskosten dazu',
          rechnung: `${eur(bezug)} × ${pz(hk)} = ${eur(hkBetrag)}`,
          ergebnis: `Selbstkosten = ${eur(bezug)} + ${eur(hkBetrag)} = ${eur(selbst)}`,
        },
        {
          label: 'Vom Ladenpreis aus: Umsatzsteuer herausrechnen',
          rechnung: `${eur(brutto)} ÷ ${steuerFaktor(satz)}`,
          ergebnis: `Nettoverkaufspreis = ${eur(netto)}`,
          hinweis: 'Jetzt rechnest du von unten. Der Ladenpreis ist brutto, die Steuer muss erst raus.',
        },
        {
          label: 'Gewinn in Euro',
          rechnung: `${eur(netto)} − ${eur(selbst)}`,
          ergebnis: `Gewinn = ${eur(gewinn)}`,
        },
        {
          label: 'Gewinn in Prozent der Selbstkosten',
          rechnung: `${eur(gewinn)} ÷ ${eur(selbst)} × 100`,
          ergebnis: `Gewinnzuschlag = ${pz(prozent)}`,
          hinweis: 'Der Gewinnzuschlag bezieht sich auf die Selbstkosten, nicht auf den Verkaufspreis.',
        },
      ],
    }
  },
}

// ---------------------------------------------------------------------------
// Lagerkennzahlen aus Jahresanfangsbestand und zwölf Monatsendbeständen
// ---------------------------------------------------------------------------

const MONATE = [
  'Januar',
  'Februar',
  'März',
  'April',
  'Mai',
  'Juni',
  'Juli',
  'August',
  'September',
  'Oktober',
  'November',
  'Dezember',
] as const

export const lagerkennzahlenJahr: Aufgabentyp = {
  id: 'lagerkennzahlen-jahr',
  name: 'Lagerkennzahlen aus 13 Beständen',
  thema: 'lagerkennzahlen',
  schwierigkeit: 3,
  worumGehts: 'Aus dem Anfangsbestand und zwölf Monatsendbeständen den Durchschnitt bilden, dann Umschlag und Lagerdauer.',
  erzeuge: (r) => {
    const mittel = zwischen(r, 20, 60, 1) * 1000
    // Abweichungen paarweise (+x und −x), dann gemischt: die Summe geht glatt durch 13.
    const paare = Array.from({ length: 6 }, () => zwischen(r, 2, 40, 1) * 100)
    const abweichungen = mische(r, [...paare, ...paare.map((x) => -x), 0])
    const werte = abweichungen.map((d) => mittel + d)
    const summe = werte.reduce((s, w) => s + w, 0)
    const umschlag = waehle(r, [4, 5, 6, 8, 9, 10, 12])
    const wareneinsatz = mittel * umschlag
    const dauer = 360 / umschlag
    return {
      typId: 'lagerkennzahlen-jahr',
      titel: 'Lagerkennzahlen aus 13 Beständen',
      thema: 'lagerkennzahlen',
      schwierigkeit: 3,
      frage:
        'Die Getränkeabteilung hat diese Bestände zu Bezugspreisen gemeldet. Der Wareneinsatz des Jahres ' +
        `betrug ${eur(wareneinsatz)}. Wie viele Tage liegt die Ware im Durchschnitt im Lager?`,
      gegeben: [
        ...werte.map((w, i) => ({ label: i === 0 ? 'Anfangsbestand 1. Januar' : `Ende ${MONATE[i - 1] ?? ''}`, wert: eur(w) })),
        { label: 'Wareneinsatz im Jahr', wert: eur(wareneinsatz) },
      ],
      loesung: { wert: dauer, toleranz: 0.5, einheit: 'Tage' },
      formel:
        'Ø Lagerbestand = (Anfangsbestand + 12 Monatsendbestände) ÷ 13. Umschlagshäufigkeit = Wareneinsatz ÷ Ø Lagerbestand. ' +
        'Lagerdauer = 360 ÷ Umschlagshäufigkeit',
      rechenweg: [
        {
          label: 'Alle 13 Bestände zusammenzählen',
          rechnung: werte.map((w) => eur(w)).join(' + '),
          ergebnis: `Summe = ${eur(summe)}`,
        },
        {
          label: 'Durch 13 teilen',
          rechnung: `${eur(summe)} ÷ 13`,
          ergebnis: `Durchschnittlicher Lagerbestand = ${eur(mittel)}`,
          hinweis: 'Es sind 13 Werte: der Anfangsbestand und zwölf Monatsendbestände. Deshalb durch 13, nicht durch 12.',
        },
        {
          label: 'Umschlagshäufigkeit',
          rechnung: `${eur(wareneinsatz)} ÷ ${eur(mittel)}`,
          ergebnis: `Umschlagshäufigkeit = ${zahl(umschlag, 2)}`,
          hinweis: 'So oft im Jahr wird der durchschnittliche Bestand verkauft und wieder aufgefüllt.',
        },
        {
          label: 'Durchschnittliche Lagerdauer',
          rechnung: `360 Tage ÷ ${zahl(umschlag, 2)}`,
          ergebnis: `Lagerdauer = ${tage(dauer)}`,
          hinweis: 'Im kaufmännischen Rechnen hat das Jahr 360 Tage.',
        },
      ],
    }
  },
}

export const PLUS_AUFGABENTYPEN: readonly Aufgabentyp[] = [
  kassenabrechnung,
  rohgewinn,
  flaechenkennzahlen,
  angebotsvergleich,
  kalkulationsfaktor,
  zahllast,
  rueckwaertsKomplett,
  differenzKomplett,
  lagerkennzahlenJahr,
]
