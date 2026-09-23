/**
 * Liest den Zwischenwert aus einem Rechenschritt, damit sie im geführten Modus
 * jeden einzelnen Schritt selbst ausrechnen und eintippen kann.
 *
 * Die Ergebnistexte werden von den Generatoren einheitlich erzeugt
 * ("Zieleinkaufspreis = 480,00 € − 72,00 € = 408,00 €"): der letzte Zahlenwert
 * im Text ist das Ergebnis des Schritts. Schritte ohne Zahl (etwa eine
 * Entscheidung in Worten) liefern null und werden nur angezeigt.
 */

import type { RechenSchritt } from '../domain/types'

const ZAHL = /-?\d{1,3}(?:\.\d{3})+(?:,\d+)?|-?\d+(?:,\d+)?/g

export type SchrittWert = { wert: number; toleranz: number; einheit: string }

function alsZahl(text: string): number {
  return Number(text.replace(/\./g, '').replace(',', '.'))
}

export function schrittWert(s: RechenSchritt): SchrittWert | null {
  const treffer = [...s.ergebnis.matchAll(ZAHL)]
  const letzter = treffer.at(-1)
  if (letzter === undefined) return null

  const text = letzter[0]
  const wert = alsZahl(text)
  if (!Number.isFinite(wert)) return null

  // Toleranz aus der angezeigten Genauigkeit: wer mit ungerundeten Zwischenwerten
  // rechnet, darf in der letzten Stelle um eins abweichen.
  const nachkomma = text.includes(',') ? (text.split(',')[1] ?? '').length : 0
  const toleranz = nachkomma === 0 ? 0 : 1.5 * 10 ** -nachkomma

  const rest = s.ergebnis.slice((letzter.index ?? 0) + text.length).trim()
  const einheit = rest.startsWith('€')
    ? '€'
    : rest.startsWith('%')
      ? '%'
      : (rest.split(/\s+/)[0] ?? '').replace(/[^A-Za-zÄÖÜäöüß²]/g, '')

  return { wert, toleranz, einheit }
}
