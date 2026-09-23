import { useState } from 'react'
import { Icon } from '../components/Icon'
import { Kopf, Plakette } from '../components/ui'
import { useAufnahme } from '../components/useAufnahme'
import { uhrzeit, useCountdown } from '../components/useCountdown'
import { LEITFADEN, WAHLQUALIFIKATIONEN, type Fachaufgabe } from '../data/fachgespraech'
import { FACHGESPRAECH_VORBEREITUNG_MINUTEN, bereich, notenstufe } from '../domain/pruefung'
import { mische, rngMitSeed } from '../engine/zufall'
import { useStore } from '../store/useStore'

type Phase = 'wahl' | 'ziehen' | 'vorbereitung' | 'gespraech' | 'einschaetzung'

const GESPRAECH_MINUTEN = bereich('fachgespraech').minuten

function AufnahmeKarte({ a, nachher = false }: { a: ReturnType<typeof useAufnahme>; nachher?: boolean }) {
  if (a.status === 'nichtMoeglich') return null
  if (a.status === 'gesperrt') {
    return (
      <section className="karte">
        <p className="untertitel">
          Das Mikrofon ist gesperrt. Du kannst es in den iPhone-Einstellungen unter Safari bei Mikrofon erlauben.
        </p>
      </section>
    )
  }
  if (a.status === 'nimmtAuf') {
    return (
      <section className="karte">
        <p className="aufnahme-laeuft">
          <span className="aufnahme-punkt" aria-hidden="true" /> Aufnahme läuft · {uhrzeit(a.sekunden)}
        </p>
        <button className="knopf knopf--zweit knopf--breit" onClick={a.stoppe}>
          Aufnahme beenden
        </button>
      </section>
    )
  }
  if (a.status === 'fertig' && a.url !== null) {
    return (
      <section className="karte">
        <h3>Deine Aufnahme</h3>
        {nachher && (
          <p className="untertitel">
            Hör sie dir an, bevor du dich einschätzt. Hast du die Situation erklärt, dein Vorgehen begründet und
            Fachbegriffe benutzt?
          </p>
        )}
        <audio controls src={a.url} style={{ width: '100%' }} />
        <button className="knopf-klein" onClick={a.verwirf}>
          Löschen
        </button>
      </section>
    )
  }
  if (nachher) return null
  return (
    <section className="karte">
      <p className="untertitel">
        Nimm dein Gespräch auf und hör es dir danach an. Die Aufnahme bleibt nur auf diesem Handy und ist weg, sobald
        du die Seite verlässt.
      </p>
      <button className="knopf knopf--zweit knopf--breit" onClick={() => void a.starte()}>
        <Icon name="mikrofon" /> Aufnahme starten
      </button>
    </section>
  )
}

export function Fachgespraech() {
  const { zustand, dispatch } = useStore()
  const wqId = zustand.einstellungen.wahlqualifikation
  const wq = WAHLQUALIFIKATIONEN.find((w) => w.id === wqId)
  const [phase, setPhase] = useState<Phase>(wq === undefined ? 'wahl' : 'ziehen')
  const [gezogen, setGezogen] = useState<Fachaufgabe[]>([])
  const [aufgabe, setAufgabe] = useState<Fachaufgabe | null>(null)
  const [frageIndex, setFrageIndex] = useState(0)
  const [selbst, setSelbst] = useState(zustand.fachgespraechSelbst ?? 60)
  const [gespeichert, setGespeichert] = useState(false)
  const aufnahme = useAufnahme()

  const vorbereitung = useCountdown(FACHGESPRAECH_VORBEREITUNG_MINUTEN * 60, phase === 'vorbereitung', () =>
    setPhase('gespraech'),
  )
  const gespraech = useCountdown(GESPRAECH_MINUTEN * 60, phase === 'gespraech', () => {
    aufnahme.stoppe()
    setPhase('einschaetzung')
  })

  const ziehe = () => {
    if (wq === undefined) return
    setGezogen(mische(rngMitSeed(Date.now() % 2_147_483_647), wq.aufgaben).slice(0, 2))
    setAufgabe(null)
    setFrageIndex(0)
    setGespeichert(false)
  }

  if (phase === 'wahl' || wq === undefined) {
    return (
      <>
        <Kopf titel="Fachgespräch" klein />
        <p className="untertitel">
          Welche Wahlqualifikation steht im Ausbildungsvertrag für das Fachgespräch? Das legt fest, aus welchem
          Bereich die Aufgaben kommen.
        </p>
        <div className="liste">
          {WAHLQUALIFIKATIONEN.map((w) => (
            <button
              key={w.id}
              className="zeile"
              onClick={() => {
                dispatch({ typ: 'einstellungenGeaendert', aenderung: { wahlqualifikation: w.id } })
                setPhase('ziehen')
              }}
            >
              <span className="zeile__text">
                <span className="zeile__titel">{w.name}</span>
                <span className="zeile__info">{w.aufgaben.length} Übungsfälle</span>
              </span>
              {w.id === wqId && <Icon name="haken" />}
            </button>
          ))}
        </div>
      </>
    )
  }

  if (phase === 'ziehen') {
    return (
      <>
        <Kopf titel="Fachgespräch" klein />
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          <Plakette>{wq.name}</Plakette>
          <button className="plakette" onClick={() => setPhase('wahl')}>
            ändern
          </button>
        </div>
        <section className="karte">
          <h3>So läuft es in der Prüfung</h3>
          <p>
            Der Ausschuss legt dir zwei Aufgaben vor, du wählst eine. Dann hast du {FACHGESPRAECH_VORBEREITUNG_MINUTEN}{' '}
            Minuten Vorbereitung und höchstens {GESPRAECH_MINUTEN} Minuten Gespräch.
          </p>
          <p className="untertitel">Übe laut. Am besten mit jemandem, der dir die Fragen der Prüfer stellt.</p>
        </section>

        {gezogen.length === 0 ? (
          <button className="knopf knopf--breit" onClick={ziehe}>
            Zwei Aufgaben ziehen
          </button>
        ) : (
          <>
            {gezogen.map((a) => (
              <button
                key={a.titel}
                className="karte"
                style={{
                  textAlign: 'left',
                  border: aufgabe?.titel === a.titel ? '2px solid var(--akzent)' : '2px solid transparent',
                }}
                onClick={() => setAufgabe(a)}
                aria-pressed={aufgabe?.titel === a.titel}
              >
                <h3>{a.titel}</h3>
                <p>{a.situation}</p>
              </button>
            ))}
            <button className="knopf knopf--breit" disabled={aufgabe === null} onClick={() => setPhase('vorbereitung')}>
              Vorbereitung starten ({FACHGESPRAECH_VORBEREITUNG_MINUTEN} Min)
            </button>
            <button className="knopf knopf--zweit knopf--breit" onClick={ziehe}>
              Neu ziehen
            </button>
          </>
        )}
      </>
    )
  }

  if (phase === 'vorbereitung' && aufgabe !== null) {
    return (
      <>
        <Kopf titel="Vorbereitung" klein rechts={<span className="uhr">{uhrzeit(vorbereitung)}</span>} />
        <section className="karte karte--akzent">
          <h3>{aufgabe.titel}</h3>
          <p>{aufgabe.situation}</p>
        </section>
        <section className="abschnitt">
          <h2>Notiere dir Stichpunkte zu jedem Schritt</h2>
          <div className="liste">
            {LEITFADEN.map((l, i) => (
              <div key={l.schritt} className="zeile">
                <span className="plakette">{i + 1}</span>
                <span className="zeile__text">
                  <span className="zeile__titel">{l.schritt}</span>
                  <span className="zeile__info">{l.frage}</span>
                </span>
              </div>
            ))}
          </div>
        </section>
        <button className="knopf knopf--breit" onClick={() => setPhase('gespraech')}>
          Gespräch beginnen
        </button>
      </>
    )
  }

  if (phase === 'gespraech' && aufgabe !== null) {
    const frage = aufgabe.leitfragen[frageIndex]
    return (
      <>
        <Kopf
          titel="Gespräch"
          klein
          rechts={<span className={gespraech <= 120 ? 'uhr uhr--knapp' : 'uhr'}>{uhrzeit(gespraech)}</span>}
        />
        <section className="karte">
          <p className="untertitel">Erzähl zuerst frei: Situation, Ziel, Vorgehen. Danach fragt der Prüfer nach.</p>
        </section>
        <AufnahmeKarte a={aufnahme} />
        <section className="karte karte--akzent">
          {frage !== undefined ? (
            <>
              <p className="untertitel">
                Prüferfrage {frageIndex + 1} von {aufgabe.leitfragen.length}
              </p>
              <p className="frage-text">{frage}</p>
            </>
          ) : (
            <p className="frage-text">Alle Prüferfragen beantwortet.</p>
          )}
        </section>
        {frage !== undefined && (
          <button className="knopf knopf--zweit knopf--breit" onClick={() => setFrageIndex((i) => i + 1)}>
            Nächste Prüferfrage
          </button>
        )}
        <button
          className="knopf knopf--breit"
          onClick={() => {
            aufnahme.stoppe()
            setPhase('einschaetzung')
          }}
        >
          Gespräch beenden
        </button>
      </>
    )
  }

  const note = notenstufe(selbst)
  return (
    <>
      <Kopf titel="Wie lief es?" klein />
      <AufnahmeKarte a={aufnahme} nachher />
      <section className="karte">
        <p>
          Schätz dich ehrlich ein. Das fließt als <strong>Selbsteinschätzung</strong> in die Notenprognose ein. Eine echte
          Bewertung ist es nicht.
        </p>
        <label htmlFor="selbst" className="untertitel">
          {selbst} Punkte · Note {note.note} ({note.wort})
        </label>
        <input
          id="selbst"
          type="range"
          min={0}
          max={100}
          step={1}
          value={selbst}
          onChange={(e) => {
            setSelbst(Number(e.target.value))
            setGespeichert(false)
          }}
          style={{ width: '100%', accentColor: 'var(--akzent)' }}
        />
        <p className="untertitel">{note.beschreibung}</p>
      </section>
      <button
        className="knopf knopf--breit"
        onClick={() => {
          dispatch({ typ: 'fachgespraechEingeschaetzt', punkte: selbst })
          setGespeichert(true)
        }}
        disabled={gespeichert}
      >
        {gespeichert ? 'Gespeichert' : 'Einschätzung speichern'}
      </button>
      <button
        className="knopf knopf--zweit knopf--breit"
        onClick={() => {
          aufnahme.verwirf()
          setGezogen([])
          setPhase('ziehen')
        }}
      >
        Noch ein Fall
      </button>
    </>
  )
}
