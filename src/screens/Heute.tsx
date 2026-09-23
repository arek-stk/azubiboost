import { useMemo } from 'react'
import { Icon } from '../components/Icon'
import { Plakette, Ring } from '../components/ui'
import { FRAGEN } from '../data/fragen'
import { coachNachricht } from '../engine/coach'
import { deutschesDatum, heute } from '../engine/datum'
import { baueSession } from '../engine/sessionBuilder'
import {
  MINDESTANTWORTEN,
  schwaechstesThema,
  streak,
  tageBisPruefung,
  themenStatistik,
} from '../engine/statistik'
import { istFaellig, istNeu } from '../engine/srs'
import { useNavigation } from '../navigation'
import { heuteBeantwortet, useStore } from '../store/useStore'

const SITZUNG = 10

export function Heute() {
  const { zustand } = useStore()
  const { gehe } = useNavigation()
  const tag = heute()
  const e = zustand.einstellungen

  const themen = useMemo(() => themenStatistik(FRAGEN, zustand.karten), [zustand.karten])
  const schwachRoh = schwaechstesThema(themen)
  // Erst ab genug Antworten empfehlen — sonst schlägt der Coach nach einer einzigen Frage Alarm.
  const schwach = schwachRoh !== undefined && schwachRoh.beantwortet >= MINDESTANTWORTEN ? schwachRoh : undefined
  const beantwortet = heuteBeantwortet(zustand)
  const serie = streak(zustand.tageMitZiel, tag)
  const tage = tageBisPruefung(e.pruefungstermin, tag)
  const faellig = Object.values(zustand.karten).filter((k) => !istNeu(k) && istFaellig(k, tag)).length

  const coach = coachNachricht({
    name: e.name,
    heuteBeantwortet: beantwortet,
    tagesziel: e.tagesziel,
    streak: serie,
    tageBisPruefung: tage,
    ...(schwach !== undefined && schwach.quote !== null
      ? { schwaechstesThema: { name: schwach.name, quote: schwach.quote } }
      : {}),
  })

  const starte = () => {
    const fragen = baueSession({
      fragen: FRAGEN,
      karten: zustand.karten,
      anzahl: SITZUNG,
      datum: tag,
      ...(schwach === undefined ? {} : { schwaechstesThema: schwach.thema }),
    })
    gehe({ name: 'quiz', titel: 'Tagestraining', frageIds: fragen.map((f) => f.id) })
  }

  const starteSchwach = () => {
    if (schwach === undefined) return
    const fragen = baueSession({
      fragen: FRAGEN,
      karten: zustand.karten,
      anzahl: SITZUNG,
      thema: schwach.thema,
      datum: tag,
    })
    gehe({ name: 'quiz', titel: schwach.name, frageIds: fragen.map((f) => f.id) })
  }

  return (
    <>
      <header className="kopf">
        <h1>{e.name === null ? 'Heute' : `Hallo ${e.name}`}</h1>
        <button className="icon-knopf" onClick={() => gehe({ name: 'einstellungen' })} aria-label="Einstellungen">
          <Icon name="einstellungen" />
        </button>
      </header>

      <section className="karte" style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
        <Ring wert={beantwortet / e.tagesziel} groesse={104} dicke={11}>
          <div>
            <div className="zahl" style={{ fontSize: 26, fontWeight: 750 }}>{beantwortet}</div>
            <div className="untertitel" style={{ fontSize: 12 }}>von {e.tagesziel}</div>
          </div>
        </Ring>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, minWidth: 0 }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {serie > 0 && (
              <Plakette art="mittel">
                <Icon name="flamme" groesse={14} /> {serie} {serie === 1 ? 'Tag' : 'Tage'}
              </Plakette>
            )}
            {tage !== null && tage >= 0 && (
              <Plakette>
                <Icon name="uhr" groesse={14} /> noch {tage} Tage
              </Plakette>
            )}
          </div>
          <p className="untertitel">
            {faellig === 0
              ? 'Heute ist nichts überfällig.'
              : faellig === 1
                ? 'Eine Wiederholung ist heute fällig.'
                : `${faellig} Wiederholungen sind heute fällig.`}
          </p>
          {e.pruefungstermin !== null && tage !== null && tage >= 0 && (
            <p className="untertitel" style={{ fontSize: 13 }}>Prüfung am {deutschesDatum(e.pruefungstermin)}</p>
          )}
        </div>
      </section>

      <section className="karte karte--akzent">
        <h3>{coach.titel}</h3>
        <p>{coach.text}</p>
        {coach.empfehlung !== undefined && <p className="untertitel">{coach.empfehlung}</p>}
      </section>

      <button className="knopf knopf--breit" onClick={starte}>
        {beantwortet === 0 ? `Los geht's — ${SITZUNG} Fragen` : `Weiter lernen — ${SITZUNG} Fragen`}
      </button>

      {schwach !== undefined && schwach.quote !== null && schwach.quote < 0.8 && (
        <button className="knopf knopf--zweit knopf--breit" onClick={starteSchwach}>
          Gezielt üben: {schwach.name}
        </button>
      )}

      <div className="liste">
        <button className="zeile" onClick={() => gehe({ name: 'rechenaufgabe', typId: 'gemischt' })}>
          <Icon name="stift" />
          <span className="zeile__text">
            <span className="zeile__titel">Eine Rechenaufgabe auf Papier</span>
            <span className="zeile__info">Kalkulation, Lagerkennzahlen, Meldebestand</span>
          </span>
          <span className="pfeil"><Icon name="weiter" /></span>
        </button>
        <button className="zeile" onClick={() => gehe({ name: 'fachgespraech' })}>
          <Icon name="sprechblase" />
          <span className="zeile__text">
            <span className="zeile__titel">Fachgespräch üben</span>
            <span className="zeile__info">Zählt 40 % — der größte Einzelposten der Prüfung</span>
          </span>
          <span className="pfeil"><Icon name="weiter" /></span>
        </button>
      </div>
    </>
  )
}
