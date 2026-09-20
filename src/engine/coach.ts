/**
 * Texte des Lerncoachs.
 *
 * Ton: zugewandt und konkret, nicht kindlich. Kein Lob ohne Grund und keine
 * Drohung — sondern immer der nächste kleine Schritt, der gerade dran ist.
 */

import { waehle, type Rng } from './zufall'

export type CoachKontext = {
  /** Vorname, falls eingetragen — sonst wird neutral formuliert. */
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
  return name === null || name.trim() === '' ? '' : ` ${name.trim()}`
}

function countdownSatz(tage: number | null): string | null {
  if (tage === null) return null
  if (tage < 0) return 'Der eingetragene Prüfungstermin liegt in der Vergangenheit.'
  if (tage === 0) return 'Heute ist Prüfungstag. Du hast alles getan, was du tun konntest.'
  if (tage === 1) return 'Morgen ist Prüfungstag.'
  if (tage <= 7) return `Nur noch ${tage} Tage bis zur Prüfung.`
  if (tage <= 30) return `${tage} Tage bis zur Prüfung — die Zeit reicht, wenn du dranbleibst.`
  if (tage <= 120) return `${tage} Tage bis zur Prüfung. Genau jetzt lohnt sich Regelmäßigkeit.`
  return `${tage} Tage bis zur Prüfung.`
}

function empfehlungText(k: CoachKontext): string | undefined {
  const s = k.schwaechstesThema
  if (s === undefined) return undefined
  const prozent = Math.round(s.quote * 100)
  if (prozent >= 80) {
    return `${s.name} liegt bei ${prozent} % — dein schwächstes Thema ist also schon ordentlich. Weiter so.`
  }
  const minuten = prozent < 50 ? 20 : prozent < 65 ? 15 : 10
  return `Bei „${s.name}" stehst du bei ${prozent} %. Nimm dir heute ${minuten} Minuten genau dafür.`
}

export function coachNachricht(k: CoachKontext, rng?: Rng): CoachNachricht {
  const du = anrede(k.name)
  const offen = Math.max(k.tagesziel - k.heuteBeantwortet, 0)
  const countdown = countdownSatz(k.tageBisPruefung)
  const empfehlung = empfehlungText(k)

  // Tagesziel geschafft
  if (k.heuteBeantwortet >= k.tagesziel && k.tagesziel > 0) {
    const lob =
      rng === undefined
        ? `Tagesziel geschafft — ${k.heuteBeantwortet} Fragen heute.`
        : waehle(rng, [
            `Tagesziel geschafft — ${k.heuteBeantwortet} Fragen heute.`,
            `${k.heuteBeantwortet} Fragen heute. Genau so wird die Prüfung machbar.`,
            `Geschafft: ${k.heuteBeantwortet} Fragen. Der Rest des Tages gehört dir.`,
          ])
    return {
      titel: `Stark${du}!`,
      text: k.streak >= 2 ? `${lob} Damit stehst du bei ${k.streak} Tagen in Folge.` : lob,
      ...(empfehlung === undefined ? {} : { empfehlung }),
    }
  }

  // Heute schon angefangen
  if (k.heuteBeantwortet > 0) {
    return {
      titel: `Weiter so${du}`,
      text:
        `Du hast heute schon ${k.heuteBeantwortet} ${k.heuteBeantwortet === 1 ? 'Frage' : 'Fragen'} ` +
        `geschafft. Nur noch ${offen}, dann ist dein Tagesziel erreicht.`,
      ...(empfehlung === undefined ? {} : { empfehlung }),
    }
  }

  // Heute noch nichts
  if (k.streak > 0) {
    return {
      titel: `${k.streak} Tage in Folge`,
      text:
        `Heute noch keine Frage${du}. ${k.tagesziel} Fragen sind in ein paar Minuten erledigt — ` +
        'und deine Serie läuft weiter.',
      ...(empfehlung === undefined ? { ...(countdown === null ? {} : { empfehlung: countdown }) } : { empfehlung }),
    }
  }

  return {
    titel: `Auf geht's${du}`,
    text:
      countdown ??
      `${k.tagesziel} Fragen für heute. Kleine Einheiten jeden Tag bringen mehr als ein langer Abend.`,
    ...(empfehlung === undefined ? {} : { empfehlung }),
  }
}
