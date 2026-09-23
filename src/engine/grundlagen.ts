/**
 * Mathe-Grundlagen vor der Kalkulation — für alle, denen Rechnen schwerfällt.
 * Runde, freundliche Zahlen und die kleinsten möglichen Schritte. Jede
 * Kalkulationsaufgabe baut auf genau diesen Bausteinen auf.
 */

import type { Aufgabentyp } from './rechenaufgaben'
import { eur, zahl } from './format'
import { waehle, zwischen } from './zufall'

const GRUNDWERTE = [40, 50, 80, 100, 120, 150, 200, 250, 300, 400, 500, 600, 800]

export const prozentwert: Aufgabentyp = {
  id: 'g-prozentwert',
  name: '1. Prozent von etwas',
  thema: 'kalkulation',
  schwierigkeit: 1,
  worumGehts: 'Wie viel sind 20 % von 150 €? Erst 1 % ausrechnen, dann malnehmen.',
  erzeuge: (r) => {
    const g = waehle(r, GRUNDWERTE)
    const p = waehle(r, [5, 10, 20, 25, 50])
    const eins = g / 100
    const w = (g * p) / 100
    return {
      typId: 'g-prozentwert',
      titel: 'Prozent von etwas',
      thema: 'kalkulation',
      schwierigkeit: 1,
      frage: `Wie viel sind ${p} % von ${eur(g)}?`,
      gegeben: [
        { label: 'Das Ganze (100 %)', wert: eur(g) },
        { label: 'Gesucht sind', wert: `${p} %` },
      ],
      loesung: { wert: w, toleranz: 0.01, einheit: '€' },
      formel: 'Erst durch 100 teilen (= 1 %), dann mit den Prozent malnehmen.',
      rechenweg: [
        {
          label: '1 % ausrechnen',
          rechnung: `${eur(g)} ÷ 100`,
          ergebnis: `1 % = ${eur(eins)}`,
          hinweis: 'Prozent heißt „von Hundert". 1 % ist der hundertste Teil — also durch 100 teilen.',
        },
        {
          label: `Mal ${p} nehmen`,
          rechnung: `${eur(eins)} × ${p}`,
          ergebnis: `${p} % = ${eur(w)}`,
          hinweis: `${p} % sind ${p}-mal so viel wie 1 %.`,
        },
      ],
    }
  },
}

export const prozentsatz: Aufgabentyp = {
  id: 'g-prozentsatz',
  name: '2. Wie viel Prozent ist das?',
  thema: 'kalkulation',
  schwierigkeit: 1,
  worumGehts: 'Der Teil geteilt durchs Ganze, dann mal 100 — schon hast du die Prozent.',
  erzeuge: (r) => {
    const g = waehle(r, GRUNDWERTE)
    const p = waehle(r, [5, 10, 20, 25, 50])
    const w = (g * p) / 100
    return {
      typId: 'g-prozentsatz',
      titel: 'Wie viel Prozent?',
      thema: 'kalkulation',
      schwierigkeit: 1,
      frage: `Von ${eur(g)} Tagesumsatz an einer Theke waren ${eur(w)} Brötchen. Wie viel Prozent sind das?`,
      gegeben: [
        { label: 'Das Ganze', wert: eur(g) },
        { label: 'Der Teil', wert: eur(w) },
      ],
      loesung: { wert: p, toleranz: 0.05, einheit: '%' },
      formel: 'Teil ÷ Ganzes × 100',
      rechenweg: [
        {
          label: 'Teil durch Ganzes',
          rechnung: `${eur(w)} ÷ ${eur(g)}`,
          ergebnis: `${zahl(p / 100, 2)}`,
          hinweis: 'Der Teil kommt nach vorn, das Ganze nach hinten. Der Teil ist immer die kleinere Zahl.',
        },
        {
          label: 'In Prozent umrechnen',
          rechnung: `${zahl(p / 100, 2)} × 100`,
          ergebnis: `Anteil = ${p} %`,
          hinweis: 'Mal 100 macht aus der Kommazahl Prozent.',
        },
      ],
    }
  },
}

export const aufschlag: Aufgabentyp = {
  id: 'g-aufschlag',
  name: '3. Etwas aufschlagen',
  thema: 'kalkulation',
  schwierigkeit: 1,
  worumGehts: 'Auf den Einkaufspreis kommt etwas drauf: Aufschlag ausrechnen, dazuzählen.',
  erzeuge: (r) => {
    const n = waehle(r, [20, 40, 50, 80, 100, 120, 160, 200, 250])
    const p = waehle(r, [10, 20, 25, 30, 40, 50])
    const a = (n * p) / 100
    return {
      typId: 'g-aufschlag',
      titel: 'Aufschlagen',
      thema: 'kalkulation',
      schwierigkeit: 1,
      frage: `Ein Artikel kostet im Einkauf ${eur(n)}. Du schlägst ${p} % auf. Wie hoch ist der neue Preis?`,
      gegeben: [
        { label: 'Einkaufspreis', wert: eur(n) },
        { label: 'Aufschlag', wert: `${p} %` },
      ],
      loesung: { wert: n + a, toleranz: 0.01, einheit: '€' },
      formel: 'Aufschlag in € = Preis × Prozent ÷ 100, dann dazuzählen.',
      rechenweg: [
        {
          label: 'Aufschlag in Euro',
          rechnung: `${eur(n)} × ${p} %`,
          ergebnis: `Aufschlag = ${eur(a)}`,
          hinweis: '„× 10 %" tippst du als „× 10 ÷ 100".',
        },
        {
          label: 'Dazuzählen',
          rechnung: `${eur(n)} + ${eur(a)}`,
          ergebnis: `Neuer Preis = ${eur(n + a)}`,
          hinweis: 'Aufschlag heißt: es kommt etwas dazu.',
        },
      ],
    }
  },
}

export const abzug: Aufgabentyp = {
  id: 'g-abzug',
  name: '4. Etwas abziehen (Rabatt)',
  thema: 'kalkulation',
  schwierigkeit: 1,
  worumGehts: 'Rabatt in Euro ausrechnen und vom Preis abziehen.',
  erzeuge: (r) => {
    const preis = waehle(r, [20, 40, 50, 60, 80, 100, 120, 150, 200])
    const p = waehle(r, [5, 10, 15, 20, 25, 30])
    const rabatt = (preis * p) / 100
    return {
      typId: 'g-abzug',
      titel: 'Abziehen',
      thema: 'kalkulation',
      schwierigkeit: 1,
      frage: `Ein Präsentkorb kostet ${eur(preis)}. Es gibt ${p} % Rabatt. Was kostet er jetzt?`,
      gegeben: [
        { label: 'Preis', wert: eur(preis) },
        { label: 'Rabatt', wert: `${p} %` },
      ],
      loesung: { wert: preis - rabatt, toleranz: 0.01, einheit: '€' },
      formel: 'Rabatt in € = Preis × Prozent ÷ 100, dann abziehen.',
      rechenweg: [
        {
          label: 'Rabatt in Euro',
          rechnung: `${eur(preis)} × ${p} %`,
          ergebnis: `Rabatt = ${eur(rabatt)}`,
        },
        {
          label: 'Abziehen',
          rechnung: `${eur(preis)} − ${eur(rabatt)}`,
          ergebnis: `Neuer Preis = ${eur(preis - rabatt)}`,
          hinweis: 'Rabatt heißt: es wird weniger.',
        },
      ],
    }
  },
}

export const herausrechnen: Aufgabentyp = {
  id: 'g-herausrechnen',
  name: '5. Steuer herausrechnen',
  thema: 'kalkulation',
  schwierigkeit: 2,
  worumGehts: 'Wie viel kostet es ohne Steuer? Durch 1,19 teilen — nie 19 % abziehen.',
  erzeuge: (r) => {
    const netto = waehle(r, [10, 20, 40, 50, 80, 100, 150, 200])
    const satz = waehle(r, [19, 7])
    const faktor = 1 + satz / 100
    const brutto = Math.round(netto * faktor * 100) / 100
    return {
      typId: 'g-herausrechnen',
      titel: 'Steuer herausrechnen',
      thema: 'kalkulation',
      schwierigkeit: 2,
      frage: `Im Preis von ${eur(brutto)} stecken ${satz} % Umsatzsteuer. Wie viel kostet die Ware ohne Steuer?`,
      gegeben: [
        { label: 'Preis mit Steuer (brutto)', wert: eur(brutto) },
        { label: 'Steuersatz', wert: `${satz} %` },
      ],
      loesung: { wert: netto, toleranz: 0.01, einheit: '€' },
      formel: `Brutto ÷ ${zahl(faktor, 2)} = Netto`,
      rechenweg: [
        {
          label: 'Wie viel Prozent ist der Preis mit Steuer?',
          rechnung: `100 % + ${satz} %`,
          ergebnis: `${100 + satz} %`,
          hinweis: 'Ohne Steuer sind 100 %. Die Steuer kommt obendrauf.',
        },
        {
          label: 'Als Kommazahl schreiben',
          rechnung: `${100 + satz} ÷ 100`,
          ergebnis: `${zahl(faktor, 2)}`,
          hinweis: `${100 + satz} % sind als Zahl ${zahl(faktor, 2)}.`,
        },
        {
          label: 'Durch diese Zahl teilen',
          rechnung: `${eur(brutto)} ÷ ${zahl(faktor, 2)}`,
          ergebnis: `Ohne Steuer = ${eur(netto)}`,
          hinweis: `Nicht ${satz} % abziehen — das ergibt einen falschen Wert, weil die Steuer vom Nettopreis berechnet wurde.`,
        },
      ],
    }
  },
}

export const runden: Aufgabentyp = {
  id: 'g-runden',
  name: '6. Auf Cent runden',
  thema: 'kalkulation',
  schwierigkeit: 1,
  worumGehts: 'Nur die dritte Stelle nach dem Komma entscheidet: ab 5 aufrunden.',
  erzeuge: (r) => {
    const cent = zwischen(r, 100, 9999, 1)
    const dritte = zwischen(r, 1, 9, 1)
    const wert = (cent * 10 + dritte) / 1000
    const gerundet = (dritte >= 5 ? cent + 1 : cent) / 100
    return {
      typId: 'g-runden',
      titel: 'Runden',
      thema: 'kalkulation',
      schwierigkeit: 1,
      frage: `Geld hat nur zwei Stellen nach dem Komma. Runde ${zahl(wert, 3)} € kaufmännisch auf ganze Cent.`,
      gegeben: [{ label: 'Betrag', wert: `${zahl(wert, 3)} €` }],
      loesung: { wert: gerundet, toleranz: 0.001, einheit: '€' },
      formel: 'Dritte Stelle 0–4: abrunden. Dritte Stelle 5–9: aufrunden.',
      rechenweg: [
        {
          label: 'Welche Ziffer steht an der 3. Stelle nach dem Komma?',
          rechnung: `${zahl(wert, 3)} — die letzte Ziffer`,
          ergebnis: `Dritte Stelle: ${dritte}`,
          hinweis: 'Nur diese eine Ziffer entscheidet.',
          toleranz: 0,
        },
        {
          label: dritte >= 5 ? 'Aufrunden' : 'Abrunden',
          rechnung: dritte >= 5 ? `${dritte} ist 5 oder mehr — die Cent-Stelle wird eins größer` : `${dritte} ist kleiner als 5 — die Cent bleiben`,
          ergebnis: `Gerundet = ${eur(gerundet)}`,
          hinweis: 'Ab 5 wird aufgerundet, darunter abgerundet.',
          toleranz: 0.001,
        },
      ],
    }
  },
}

/** In dieser Reihenfolge lernen: jeder Baustein nutzt den davor. */
export const GRUNDLAGEN_TYPEN: readonly Aufgabentyp[] = [prozentwert, prozentsatz, aufschlag, abzug, herausrechnen, runden]
