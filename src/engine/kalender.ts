/**
 * Kalenderdatei (iCalendar, RFC 5545) für die Lernerinnerung. Das iPhone
 * übernimmt die Termine in den Kalender und erinnert dann selbst. Die App
 * braucht dafür keinen Server und keine Push-Nachrichten.
 */

import { plusTage, type IsoTag } from './datum'

function kompakt(tag: IsoTag): string {
  return tag.replaceAll('-', '')
}

/** Kommas, Semikolons und Zeilenumbrüche müssen im Text maskiert werden. */
function maskiere(text: string): string {
  return text.replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\r?\n/g, '\\n')
}

/** Zeilen länger als 75 Zeichen werden gefaltet, wie es der Standard verlangt. */
function falte(zeile: string): string {
  const teile: string[] = []
  let rest = zeile
  while (rest.length > 74) {
    teile.push(rest.slice(0, 74))
    rest = ` ${rest.slice(74)}`
  }
  teile.push(rest)
  return teile.join('\r\n')
}

function utcStempel(d: Date): string {
  return d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')
}

export function lernerinnerungIcs(p: {
  ab: IsoTag
  pruefung: IsoTag
  /** "HH:MM", Ortszeit. */
  uhrzeit: string
  appName: string
  jetzt?: Date
}): string {
  const [hh, mm] = p.uhrzeit.split(':')
  const zeit = `${hh ?? '18'}${mm ?? '00'}00`
  const stempel = utcStempel(p.jetzt ?? new Date())
  // Am Prüfungstag selbst wird nicht mehr gelernt.
  const bis = kompakt(plusTage(p.pruefung, -1))

  const zeilen = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Deine LernApp//Lernerinnerung//DE',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:lernerinnerung-${kompakt(p.ab)}@deine-lernapp`,
    `DTSTAMP:${stempel}`,
    // Ohne Zeitzone: die Erinnerung kommt immer um diese Uhrzeit vor Ort.
    `DTSTART:${kompakt(p.ab)}T${zeit}`,
    'DURATION:PT20M',
    `RRULE:FREQ=DAILY;UNTIL=${bis}T235959`,
    `SUMMARY:${maskiere(`Lernen mit ${p.appName}`)}`,
    `DESCRIPTION:${maskiere('20 Minuten: Tagestraining und eine Rechenaufgabe.')}`,
    'BEGIN:VALARM',
    'ACTION:DISPLAY',
    `DESCRIPTION:${maskiere(`Zeit für ${p.appName}`)}`,
    'TRIGGER:PT0M',
    'END:VALARM',
    'END:VEVENT',
    'BEGIN:VEVENT',
    `UID:pruefung-${kompakt(p.pruefung)}@deine-lernapp`,
    `DTSTAMP:${stempel}`,
    `DTSTART;VALUE=DATE:${kompakt(p.pruefung)}`,
    `SUMMARY:${maskiere('Abschlussprüfung Teil 2, schriftlich')}`,
    `DESCRIPTION:${maskiere('Taschenrechner (nicht programmierbar), Ausweis und Einladung mitnehmen.')}`,
    'BEGIN:VALARM',
    'ACTION:DISPLAY',
    `DESCRIPTION:${maskiere('Morgen ist die Prüfung. Tasche packen und früh schlafen.')}`,
    'TRIGGER:-PT6H',
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR',
  ]
  return zeilen.map(falte).join('\r\n') + '\r\n'
}
