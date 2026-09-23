import { describe, expect, it } from 'vitest'
import { lernerinnerungIcs } from './kalender'
import { aktuelleWoche, lernplan, montag } from './lernplan'

const THEMEN = ['a', 'b', 'c', 'd', 'e'].map((id) => ({ id, name: `Thema ${id}` }))

describe('Lernplan', () => {
  // Mittwoch, 23.09.2026; Prüfung Mittwoch, 28.04.2027
  const plan = lernplan({ heute: '2026-09-23', pruefung: '2027-04-28', themen: THEMEN })

  it('beginnt mit der aktuellen Woche am Montag', () => {
    expect(montag('2026-09-23')).toBe('2026-09-21')
    expect(plan[0]?.start).toBe('2026-09-21')
    expect(aktuelleWoche(plan, '2026-09-23')?.start).toBe('2026-09-21')
  })

  it('hat vor der Prüfungswoche zwei Probewochen und danach Fachgesprächswochen', () => {
    const i = plan.findIndex((w) => w.art === 'pruefungswoche')
    expect(plan[i]?.start).toBe('2027-04-26')
    expect(plan[i - 1]?.art).toBe('probe')
    expect(plan[i - 2]?.art).toBe('probe')
    expect(plan[i - 3]?.art).toBe('themen')
    expect(plan.slice(i + 1).every((w) => w.art === 'fachgespraech')).toBe(true)
  })

  it('verteilt die Themen der Reihe nach, zwei pro Woche, und steigert die Rechenstufe', () => {
    const themen = plan.filter((w) => w.art === 'themen')
    expect(themen[0]?.themen.map((t) => t.id)).toEqual(['a', 'b'])
    expect(themen[1]?.themen.map((t) => t.id)).toEqual(['c', 'd'])
    expect(themen[2]?.themen.map((t) => t.id)).toEqual(['e', 'a'])
    expect(themen[0]?.rechenstufe).toBe(1)
    expect(themen.at(-1)?.rechenstufe).toBe(4)
    const stufen = themen.map((w) => w.rechenstufe ?? 0)
    expect(stufen).toEqual([...stufen].sort((x, y) => x - y))
  })

  it('lässt vergangene Wochen weg', () => {
    const spaeter = lernplan({ heute: '2027-04-27', pruefung: '2027-04-28', themen: THEMEN })
    expect(spaeter[0]?.art).toBe('pruefungswoche')
  })
})

describe('Kalenderdatei', () => {
  const ics = lernerinnerungIcs({
    ab: '2026-09-24',
    pruefung: '2027-04-28',
    uhrzeit: '18:30',
    appName: 'Deine LernApp',
    jetzt: new Date('2026-09-23T10:00:00Z'),
  })

  it('erinnert täglich zur gewählten Uhrzeit bis zum Tag vor der Prüfung', () => {
    expect(ics).toContain('DTSTART:20260924T183000')
    expect(ics).toContain('RRULE:FREQ=DAILY;UNTIL=20270427T235959')
    expect(ics).toContain('DTSTART;VALUE=DATE:20270428')
  })

  it('hält den Standard ein: CRLF, Anfang und Ende, maskierte Kommas, kurze Zeilen', () => {
    expect(ics.startsWith('BEGIN:VCALENDAR\r\n')).toBe(true)
    expect(ics.endsWith('END:VCALENDAR\r\n')).toBe(true)
    expect(ics).toContain(String.raw`nicht programmierbar)\, Ausweis`)
    for (const zeile of ics.split('\r\n')) expect(zeile.length).toBeLessThanOrEqual(75)
  })
})
