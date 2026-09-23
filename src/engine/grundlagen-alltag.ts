/**
 * Weitere Grundlagen aus dem Alltag im Markt: Menge mal Preis, Wechselgeld,
 * Durchschnitt und der Schritt vom Teil zurück aufs Ganze. Kleine Zahlen,
 * kleine Schritte, jeder Schritt lässt sich am Taschenrechner nachtippen.
 */

import type { Aufgabentyp } from './rechenaufgaben'
import { eur, r2 } from './format'
import { waehle, zwischen } from './zufall'

const ARTIKEL = [
  { name: 'Flaschen Mineralwasser', preis: 0.49 },
  { name: 'Becher Joghurt', preis: 0.79 },
  { name: 'Packungen Butter', preis: 2.29 },
  { name: 'Gläser Marmelade', preis: 2.49 },
  { name: 'Tafeln Schokolade', preis: 1.29 },
  { name: 'Packungen Kaffee', preis: 5.99 },
  { name: 'Dosen Tomaten', preis: 0.89 },
  { name: 'Beutel Äpfel', preis: 2.99 },
  { name: 'Packungen Nudeln', preis: 1.49 },
  { name: 'Flaschen Olivenöl', preis: 6.49 },
] as const

export const mengePreis: Aufgabentyp = {
  id: 'g-menge-preis',
  name: 'Menge mal Preis',
  thema: 'kasse',
  schwierigkeit: 1,
  worumGehts: 'Wie viel kosten 6 Joghurts zu je 0,79 €? Stückzahl mal Einzelpreis, dann zusammenzählen.',
  erzeuge: (r) => {
    const a = waehle(r, ARTIKEL)
    const b = waehle(
      r,
      ARTIKEL.filter((x) => x.name !== a.name),
    )
    const mengeA = waehle(r, [2, 3, 4, 5, 6, 8, 10, 12])
    const mengeB = waehle(r, [2, 3, 4, 5, 6])
    const summeA = r2(mengeA * a.preis)
    const summeB = r2(mengeB * b.preis)
    const gesamt = r2(summeA + summeB)
    return {
      typId: 'g-menge-preis',
      titel: 'Menge mal Preis',
      thema: 'kasse',
      schwierigkeit: 1,
      frage:
        `Eine Kundin kauft ${mengeA} ${a.name} zu je ${eur(a.preis)} und ` +
        `${mengeB} ${b.name} zu je ${eur(b.preis)}. Wie viel muss sie bezahlen?`,
      gegeben: [
        { label: a.name, wert: `${mengeA} × ${eur(a.preis)}` },
        { label: b.name, wert: `${mengeB} × ${eur(b.preis)}` },
      ],
      loesung: { wert: gesamt, toleranz: 0.01, einheit: '€' },
      formel: 'Stückzahl × Einzelpreis, für jeden Artikel. Dann alles zusammenzählen.',
      rechenweg: [
        {
          label: `${a.name} ausrechnen`,
          rechnung: `${mengeA} × ${eur(a.preis)}`,
          ergebnis: `${a.name} = ${eur(summeA)}`,
          hinweis: 'Die Stückzahl kommt nach vorn, der Preis für ein Stück dahinter.',
        },
        {
          label: `${b.name} ausrechnen`,
          rechnung: `${mengeB} × ${eur(b.preis)}`,
          ergebnis: `${b.name} = ${eur(summeB)}`,
        },
        {
          label: 'Zusammenzählen',
          rechnung: `${eur(summeA)} + ${eur(summeB)}`,
          ergebnis: `Zu zahlen = ${eur(gesamt)}`,
          hinweis: 'Schreib die Beträge beim schriftlichen Rechnen Komma unter Komma.',
        },
      ],
    }
  },
}

export const wechselgeld: Aufgabentyp = {
  id: 'g-wechselgeld',
  name: 'Wechselgeld',
  thema: 'kasse',
  schwierigkeit: 1,
  worumGehts: 'Wie viel Geld bekommt die Kundin zurück? Vom Einkauf aus hochzählen bis zum Schein.',
  erzeuge: (r) => {
    const euro = zwischen(r, 3, 48, 1)
    const cent = zwischen(r, 1, 99, 1)
    const betrag = r2(euro + cent / 100)
    const schein = [5, 10, 20, 50].find((s) => s > betrag) ?? 50
    const voll = euro + 1
    const bisVoll = r2(voll - betrag)
    const bisSchein = r2(schein - voll)
    const zurueck = r2(schein - betrag)
    const schritte = [
      {
        label: 'Bis zum nächsten vollen Euro',
        rechnung: `${eur(voll)} − ${eur(betrag)}`,
        ergebnis: `Bis ${eur(voll)} fehlen ${eur(bisVoll)}`,
        hinweis: 'Erst die Cent auffüllen, bis ein glatter Euro-Betrag dasteht.',
      },
      ...(bisSchein > 0
        ? [
            {
              label: 'Bis zum Schein',
              rechnung: `${eur(schein)} − ${eur(voll)}`,
              ergebnis: `Bis ${eur(schein)} fehlen ${eur(bisSchein)}`,
            },
            {
              label: 'Beides zusammen',
              rechnung: `${eur(bisVoll)} + ${eur(bisSchein)}`,
              ergebnis: `Wechselgeld = ${eur(zurueck)}`,
              hinweis: 'So zählst du das Geld der Kundin auch in die Hand: erst die Münzen, dann die Scheine.',
            },
          ]
        : []),
    ]
    return {
      typId: 'g-wechselgeld',
      titel: 'Wechselgeld',
      thema: 'kasse',
      schwierigkeit: 1,
      frage: `Der Einkauf kostet ${eur(betrag)}. Die Kundin zahlt mit einem ${schein}-€-Schein. Wie viel Wechselgeld bekommt sie?`,
      gegeben: [
        { label: 'Einkauf', wert: eur(betrag) },
        { label: 'Gegeben', wert: eur(schein) },
      ],
      loesung: { wert: zurueck, toleranz: 0.01, einheit: '€' },
      formel: 'Gegeben − Einkauf = Wechselgeld. Im Kopf: vom Einkauf aus hochzählen.',
      rechenweg: schritte,
    }
  },
}

const WOCHENTAGE = ['Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag'] as const

export const durchschnitt: Aufgabentyp = {
  id: 'g-durchschnitt',
  name: 'Durchschnitt',
  thema: 'lagerkennzahlen',
  schwierigkeit: 1,
  worumGehts: 'Alles zusammenzählen und durch die Anzahl teilen. Das brauchst du später für den Lagerbestand.',
  erzeuge: (r) => {
    const anzahl = waehle(r, [3, 4, 5])
    const werte = Array.from({ length: anzahl }, () => zwischen(r, 120, 480, 1) * 5)
    // Die Summe soll glatt durch die Anzahl gehen, damit am Ende ganze Euro stehen.
    const rest = werte.reduce((s, w) => s + w, 0) % anzahl
    werte[anzahl - 1] = (werte[anzahl - 1] ?? 0) + (rest === 0 ? 0 : anzahl - rest)
    const summe = werte.reduce((s, w) => s + w, 0)
    const mittel = summe / anzahl
    return {
      typId: 'g-durchschnitt',
      titel: 'Durchschnitt',
      thema: 'lagerkennzahlen',
      schwierigkeit: 1,
      frage: `Die Backtheke hatte an ${anzahl} Tagen diese Umsätze. Wie hoch war der Umsatz im Durchschnitt pro Tag?`,
      gegeben: werte.map((w, i) => ({ label: WOCHENTAGE[i] ?? `Tag ${i + 1}`, wert: eur(w) })),
      loesung: { wert: mittel, toleranz: 0.01, einheit: '€' },
      formel: 'Durchschnitt = Summe aller Werte ÷ Anzahl der Werte',
      rechenweg: [
        {
          label: 'Alle Werte zusammenzählen',
          rechnung: werte.map((w) => eur(w)).join(' + '),
          ergebnis: `Summe = ${eur(summe)}`,
        },
        {
          label: `Durch ${anzahl} teilen`,
          rechnung: `${eur(summe)} ÷ ${anzahl}`,
          ergebnis: `Durchschnitt = ${eur(mittel)}`,
          hinweis: `Du teilst durch ${anzahl}, weil es ${anzahl} Werte sind.`,
        },
      ],
    }
  },
}

const GANZE = [40, 60, 80, 120, 150, 200, 240, 300, 400, 500, 600, 800]

export const grundwert: Aufgabentyp = {
  id: 'g-grundwert',
  name: 'Vom Teil aufs Ganze',
  thema: 'kalkulation',
  schwierigkeit: 2,
  worumGehts: '15 € sind 10 %. Wie viel sind 100 %? Erst 1 % ausrechnen, dann mal 100.',
  erzeuge: (r) => {
    const ganz = waehle(r, GANZE)
    const p = waehle(r, [5, 10, 20, 25, 40, 50])
    const teil = (ganz * p) / 100
    const eins = ganz / 100
    return {
      typId: 'g-grundwert',
      titel: 'Vom Teil aufs Ganze',
      thema: 'kalkulation',
      schwierigkeit: 2,
      frage: `Auf eine Kaffeemaschine gibt es ${p} % Rabatt. Das sind ${eur(teil)}. Was hat die Maschine vorher gekostet?`,
      gegeben: [
        { label: 'Rabatt in Euro', wert: eur(teil) },
        { label: 'Rabatt in Prozent', wert: `${p} %` },
      ],
      loesung: { wert: ganz, toleranz: 0.01, einheit: '€' },
      formel: 'Teil ÷ Prozent = 1 %. Dann 1 % × 100 = das Ganze.',
      rechenweg: [
        {
          label: '1 % ausrechnen',
          rechnung: `${eur(teil)} ÷ ${p}`,
          ergebnis: `1 % = ${eur(eins)}`,
          hinweis: `${eur(teil)} sind ${p} %. Durch ${p} geteilt bleibt 1 % übrig.`,
        },
        {
          label: 'Mal 100 nehmen',
          rechnung: `${eur(eins)} × 100`,
          ergebnis: `100 % = ${eur(ganz)}`,
          hinweis: 'Der alte Preis ist das Ganze, also 100 %.',
        },
      ],
    }
  },
}

/** Diese vier kommen im Lernpfad vor den Prozentaufgaben. */
export const ALLTAG_TYPEN: readonly Aufgabentyp[] = [mengePreis, wechselgeld, durchschnitt, grundwert]
