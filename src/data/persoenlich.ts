/**
 * Persönliche Nachrichten und Vorbelegungen — bewusst nicht im Quellcode.
 *
 * Die Werte kommen aus Umgebungsvariablen zur Build-Zeit (lokal aus
 * .env.local, beim Hosting aus den Projekteinstellungen). So stehen Name und
 * private Nachrichten nicht im öffentlichen Repository.
 *
 *   VITE_NACHRICHTEN     mehrere Nachrichten, getrennt durch |
 *   VITE_NACHRICHT_VON   wer sie geschrieben hat
 *   VITE_VORNAME         Vorbelegung für den Namen beim ersten Start
 *   VITE_KOSENAME        liebevolle Anrede für die Begrüßung
 */

import { tageBis, type IsoTag } from '../engine/datum'

function text(wert: string | undefined): string | null {
  const t = wert?.trim()
  return t === undefined || t === '' ? null : t
}

const NACHRICHTEN = (text(import.meta.env.VITE_NACHRICHTEN) ?? '')
  .split('|')
  .map((n) => n.trim())
  .filter((n) => n !== '')

export const NACHRICHT_VON = text(import.meta.env.VITE_NACHRICHT_VON)
export const VORNAME_VORBELEGUNG = text(import.meta.env.VITE_VORNAME)
export const KOSENAME = text(import.meta.env.VITE_KOSENAME)
export const APP_NAME = text(import.meta.env.VITE_APP_NAME) ?? 'AzubiBoost'

/** Wie sie angesprochen wird: Kosename, sonst Vorname, sonst gar nicht. */
export function anrede(name: string | null): string | null {
  return KOSENAME ?? name
}

/** Begrüßung passend zur Tageszeit. */
export function begruessung(stunde: number, wer: string | null): string {
  const an = wer === null ? '' : `, ${wer}`
  if (stunde >= 5 && stunde < 11) return `Guten Morgen${an} ☀️`
  if (stunde >= 17 && stunde < 23) return `Guten Abend${an} 🌙`
  if (stunde >= 23 || stunde < 5) return `Noch wach${an}? 💫`
  return `Hallo${an} 💕`
}

/** Jeden Tag eine andere Nachricht, falls mehrere hinterlegt sind. */
export function nachrichtFuerTag(tag: IsoTag): string | null {
  if (NACHRICHTEN.length === 0) return null
  const index = Math.abs(tageBis('2026-01-01', tag)) % NACHRICHTEN.length
  return NACHRICHTEN[index] ?? null
}
