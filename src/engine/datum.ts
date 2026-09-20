/** Datumshilfen. Gearbeitet wird mit ISO-Tagesdaten (YYYY-MM-DD) in Ortszeit. */

export type IsoTag = string

export function heute(d: Date = new Date()): IsoTag {
  const jahr = d.getFullYear()
  const monat = `${d.getMonth() + 1}`.padStart(2, '0')
  const tag = `${d.getDate()}`.padStart(2, '0')
  return `${jahr}-${monat}-${tag}`
}

export function alsDate(iso: IsoTag): Date {
  const [j, m, t] = iso.split('-').map(Number)
  return new Date(j ?? 1970, (m ?? 1) - 1, t ?? 1)
}

export function plusTage(iso: IsoTag, n: number): IsoTag {
  const d = alsDate(iso)
  d.setDate(d.getDate() + n)
  return heute(d)
}

/** Tage von `von` bis `bis`; negativ, wenn `bis` in der Vergangenheit liegt. */
export function tageBis(von: IsoTag, bis: IsoTag): number {
  const ms = alsDate(bis).getTime() - alsDate(von).getTime()
  return Math.round(ms / 86_400_000)
}

export function istVorOderGleich(a: IsoTag, b: IsoTag): boolean {
  return a <= b
}

export function deutschesDatum(iso: IsoTag): string {
  const [j, m, t] = iso.split('-')
  return `${t}.${m}.${j}`
}
