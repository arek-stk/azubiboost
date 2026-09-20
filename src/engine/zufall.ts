/**
 * Reproduzierbarer Zufall. Gleicher Seed heißt gleiche Aufgabe —
 * damit sind die Aufgabengeneratoren testbar und ein Übungszettel
 * lässt sich später erneut genau so erzeugen.
 */

export type Rng = () => number

/** mulberry32 — klein, schnell, ausreichend gleichmäßig für Übungsaufgaben. */
export function rngMitSeed(seed: number): Rng {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/** Ganzzahl oder Vielfaches von `schritt` im Bereich [min, max]. */
export function zwischen(r: Rng, min: number, max: number, schritt = 1): number {
  const stufen = Math.floor((max - min) / schritt) + 1
  return min + Math.floor(r() * stufen) * schritt
}

export function waehle<T>(r: Rng, werte: readonly T[]): T {
  if (werte.length === 0) throw new Error('waehle: leere Liste')
  return werte[Math.floor(r() * werte.length)] as T
}

/** Mischt eine Kopie der Liste (Fisher-Yates). */
export function mische<T>(r: Rng, werte: readonly T[]): T[] {
  const kopie = [...werte]
  for (let i = kopie.length - 1; i > 0; i--) {
    const j = Math.floor(r() * (i + 1))
    const a = kopie[i] as T
    const b = kopie[j] as T
    kopie[i] = b
    kopie[j] = a
  }
  return kopie
}

/** Seed aus dem heutigen Datum — gleiche Aufgaben für denselben Tag. */
export function tagesSeed(datum: Date = new Date()): number {
  return datum.getFullYear() * 10000 + (datum.getMonth() + 1) * 100 + datum.getDate()
}
