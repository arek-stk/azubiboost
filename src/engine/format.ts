/** Zahlenformate wie in der Prüfung: Komma als Dezimaltrennzeichen. */

export function r2(n: number): number {
  // Kaufmännisch runden: 0,005 geht nach oben. Der Epsilon-Zuschlag fängt
  // Fälle wie 1,005 ab, die binär knapp unter der Hälfte liegen.
  return Math.round((n + Number.EPSILON * Math.sign(n) * Math.abs(n)) * 100) / 100
}

export function rN(n: number, dezimalstellen: number): number {
  const f = 10 ** dezimalstellen
  return Math.round(n * f + Number.EPSILON * Math.sign(n) * Math.abs(n) * f) / f
}

export function eur(n: number): string {
  return `${n.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €`
}

export function pz(n: number, dezimalstellen = 2): string {
  return `${n.toLocaleString('de-DE', {
    minimumFractionDigits: 0,
    maximumFractionDigits: dezimalstellen,
  })} %`
}

export function zahl(n: number, dezimalstellen = 2): string {
  return n.toLocaleString('de-DE', {
    minimumFractionDigits: 0,
    maximumFractionDigits: dezimalstellen,
  })
}

export function stueck(n: number): string {
  return `${zahl(n, 0)} Stück`
}

export function tage(n: number): string {
  return `${zahl(n, 1)} Tage`
}
