/**
 * Leitet aus einem Rechenschritt die Tastenfolge für den Taschenrechner ab.
 *
 * Für jemanden, dem Rechnen schwerfällt, ist „670 € × 10 %" eine Hürde —
 * „tippe 670 × 10 ÷ 100 =" dagegen nicht. In der IHK-Prüfung ist ein
 * nicht programmierbarer Taschenrechner erlaubt; es kommt also vor allem
 * darauf an, zu wissen, WAS man eintippt.
 */

import type { RechenSchritt } from '../domain/types'

export type Taste = { art: 'zahl' | 'op' | 'gleich'; text: string }

const EINHEITEN = /€|Stück|Tage|Std\.|Arbeitsstunden|kg|m²|\bml\b|\bg\b|\bl\b|\bmal\b/g
const OPERATOREN = new Set(['×', '÷', '+', '−'])

/** "1.234,56" → "1234.56" — der Taschenrechner kennt nur den Dezimalpunkt. */
function alsTastatur(zahl: string): string {
  // Überflüssige Nullen tippt niemand: 670,00 → 670, 12,50 → 12.5
  return String(Number(zahl.replace(/\./g, '').replace(',', '.')))
}

function tokens(ausdruck: string): Taste[] | null {
  const bereinigt = ausdruck.replace(EINHEITEN, ' ')
  // Andere Wörter (etwa "gegen" in einem Vergleich) heißen: keine Rechnung.
  if (/[A-Za-zÄÖÜäöüß]/.test(bereinigt)) return null

  const roh = bereinigt.match(/\d{1,3}(?:\.\d{3})+(?:,\d+)?|\d+(?:,\d+)?|[×÷+−%()]/g)
  if (roh === null) return null

  const ergebnis: Taste[] = []
  let zahlen = 0
  for (let i = 0; i < roh.length; i++) {
    const t = roh[i] as string
    if (t === '%') {
      // "× 10 %" heißt "× 10 ÷ 100". Ein Prozentsatz ganz vorn (Zinssatz) bleibt stehen.
      const vorOp = ergebnis.at(-2)
      if (zahlen > 1 && vorOp?.text === '×') {
        ergebnis.push({ art: 'op', text: '÷' }, { art: 'zahl', text: '100' })
      }
      continue
    }
    if (t === '(' || t === ')') {
      ergebnis.push({ art: 'op', text: t })
      continue
    }
    if (OPERATOREN.has(t)) {
      ergebnis.push({ art: 'op', text: t })
      continue
    }
    zahlen++
    ergebnis.push({ art: 'zahl', text: alsTastatur(t) })
  }
  return ergebnis
}

/** Klammern auflösen wie am einfachen Taschenrechner: erst die Klammer ausrechnen, "=", dann weiter. */
function mitGleich(ts: Taste[]): Taste[] {
  const auf = ts.findIndex((t) => t.text === '(')
  const zu = ts.findIndex((t) => t.text === ')')
  if (auf === 0 && zu > 0) {
    const innen = ts.slice(1, zu)
    const rest = ts.slice(zu + 1)
    return rest.length === 0
      ? [...innen, { art: 'gleich', text: '=' }]
      : [...innen, { art: 'gleich', text: '=' }, ...rest, { art: 'gleich', text: '=' }]
  }
  if (ts.some((t) => t.text === '(' || t.text === ')')) return []
  return [...ts, { art: 'gleich', text: '=' }]
}

function zeile(ausdruck: string): Taste[] | null {
  const ts = tokens(ausdruck)
  if (ts === null || ts.length < 3) return null
  const mit = mitGleich(ts)
  return mit.length === 0 ? null : mit
}

/**
 * Eine oder zwei Tastenzeilen für den Schritt. Viele Schritte bestehen aus
 * zwei Teilen ("10 % ausrechnen", dann "abziehen") — dann gibt es zwei Zeilen.
 */
export function taschenrechnerZeilen(s: RechenSchritt): Taste[][] {
  const zeilen: Taste[][] = []

  const vorGleich = s.rechnung.split(' = ')[0] ?? ''
  const erste = zeile(vorGleich)
  if (erste !== null) zeilen.push(erste)

  // "Zieleinkaufspreis = 670 − 67 = 603": der mittlere Ausdruck ist der zweite Teil.
  const teile = s.ergebnis.split(' = ')
  if (teile.length >= 3) {
    const zweite = zeile(teile.slice(1, -1).join(' = '))
    if (zweite !== null) zeilen.push(zweite)
  }
  return zeilen
}

/** Rechnet eine Tastenfolge so aus, wie ein einfacher Taschenrechner es täte (für Tests). */
export function tippe(tasten: Taste[]): number {
  let wert = 0
  let op: string | null = null
  for (const t of tasten) {
    if (t.art === 'zahl') {
      const z = Number(t.text)
      wert = op === null ? z : op === '×' ? wert * z : op === '÷' ? wert / z : op === '+' ? wert + z : wert - z
      op = null
    } else if (t.art === 'op') {
      op = t.text
    }
  }
  return wert
}
