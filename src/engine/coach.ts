/**
 * Texte des Lerncoachs.
 *
 * Ton: wie eine Kollegin, die es gut meint. Kurz, konkret, ohne übertriebenes
 * Lob und ohne Druck. Immer mit dem nächsten kleinen Schritt.
 */

import { waehle, type Rng } from './zufall'

export type CoachKontext = {
  /** Vorname, falls eingetragen. Sonst wird neutral formuliert. */
  name: string | null
  heuteBeantwortet: number
  tagesziel: number
  streak: number
  schwaechstesThema?: { name: string; quote: number }
  tageBisPruefung: number | null
}

export type CoachNachricht = {
  titel: string
  text: string
  /** Konkreter nächster Schritt, wenn es einen gibt. */
  empfehlung?: string
}

function anrede(name: string | null): string {
  return name === null || name.trim() === '' ? '' : `, ${name.trim()}`
}

function countdownSatz(tage: number | null): string | null {
  if (tage === null) return null
  if (tage < 0) return 'Der eingetragene Prüfungstermin ist schon vorbei. Trag in den Einstellungen den neuen ein.'
  if (tage === 0) return 'Heute ist Prüfungstag. Viel Erfolg!'
  if (tage === 1) return 'Morgen ist Prüfungstag. Schau dir heute nur noch die Formeln an und geh früh schlafen.'
  if (tage <= 7) return `Noch ${tage} Tage bis zur Prüfung. Jetzt nichts Neues mehr, nur wiederholen.`
  if (tage <= 30) return `Noch ${tage} Tage bis zur Prüfung. Jetzt lohnen sich Probeprüfungen.`
  if (tage <= 120) return `Noch ${tage} Tage bis zur Prüfung. Jeden Tag ein bisschen reicht.`
  // Weiter weg steht die Zahl schon auf der Startseite; der Coach wiederholt sie nicht.
  return null
}

function empfehlungText(k: CoachKontext): string | undefined {
  const s = k.schwaechstesThema
  if (s === undefined) return undefined
  const prozent = Math.round(s.quote * 100)
  if (prozent >= 80) {
    return `Selbst dein schwächstes Thema, ${s.name}, liegt schon bei ${prozent} %.`
  }
  const minuten = prozent < 50 ? 20 : prozent < 65 ? 15 : 10
  return `${s.name} liegt bei ${prozent} %. Nimm dir dafür heute ${minuten} Minuten.`
}

export function coachNachricht(k: CoachKontext, rng?: Rng): CoachNachricht {
  const du = anrede(k.name)
  const offen = Math.max(k.tagesziel - k.heuteBeantwortet, 0)
  const countdown = countdownSatz(k.tageBisPruefung)
  const empfehlung = empfehlungText(k)

  // Tagesziel geschafft
  if (k.heuteBeantwortet >= k.tagesziel && k.tagesziel > 0) {
    const n = k.heuteBeantwortet
    const satz =
      rng === undefined
        ? `${n} Fragen heute. Für heute reicht das.`
        : waehle(rng, [
            `${n} Fragen heute. Für heute reicht das.`,
            `${n} Fragen heute. Wenn du noch Lust hast, mach eine Rechenaufgabe.`,
            `${n} Fragen heute. Morgen geht es weiter.`,
          ])
    return {
      titel: `Tagesziel geschafft${du}`,
      text: k.streak >= 2 ? `${satz} Seit ${k.streak} Tagen lernst du jeden Tag.` : satz,
      ...(empfehlung === undefined ? {} : { empfehlung }),
    }
  }

  // Heute schon angefangen
  if (k.heuteBeantwortet > 0) {
    return {
      titel: `Guter Anfang${du}`,
      text:
        `${k.heuteBeantwortet} ${k.heuteBeantwortet === 1 ? 'Frage hast' : 'Fragen hast'} du heute schon. ` +
        `Noch ${offen}, dann ist das Tagesziel erreicht.`,
      ...(empfehlung === undefined ? {} : { empfehlung }),
    }
  }

  // Heute noch nichts
  if (k.streak > 0) {
    return {
      titel: `${k.streak} Tage in Folge`,
      text: `Für heute stehen noch ${k.tagesziel} Fragen an${du}. Das dauert etwa ${k.tagesziel} Minuten.`,
      ...(empfehlung === undefined ? { ...(countdown === null ? {} : { empfehlung: countdown }) } : { empfehlung }),
    }
  }

  return {
    titel: `Auf geht's${du}`,
    text: countdown ?? `Heute stehen ${k.tagesziel} Fragen an. Jeden Tag ein bisschen bringt mehr als ein langer Abend vor der Prüfung.`,
    ...(empfehlung === undefined ? {} : { empfehlung }),
  }
}
