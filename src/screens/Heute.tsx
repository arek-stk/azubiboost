import { useMemo } from 'react'
import { Icon, type IconName } from '../components/Icon'
import { bereichStil } from '../components/symbole'
import { Plakette, Ring } from '../components/ui'
import { FRAGEN } from '../data/fragen'
import { NACHRICHT_VON, anrede, begruessung, nachrichtFuerTag } from '../data/persoenlich'
import type { BereichId } from '../domain/types'
import { coachNachricht } from '../engine/coach'
import { alsDate, heute } from '../engine/datum'
import { baueSession } from '../engine/sessionBuilder'
import { istFaellig, istNeu } from '../engine/srs'
import {
  MINDESTANTWORTEN,
  empfohlenesTempo,
  schwaechstesThema,
  streak,
  tageBisPruefung,
  themenStatistik,
} from '../engine/statistik'
import { useNavigation } from '../navigation'
import { heuteBeantwortet, useStore } from '../store/useStore'

const SITZUNG = 10

function Kachel(p: { icon: IconName; titel: string; info: string; bereich: BereichId; onClick: () => void }) {
  return (
    <button className="kachel" onClick={p.onClick} style={bereichStil(p.bereich)}>
      <span className="symbol">
        <Icon name={p.icon} />
      </span>
      <span>
        <span className="kachel__titel">{p.titel}</span>
        <br />
        <span className="kachel__info">{p.info}</span>
      </span>
    </button>
  )
}

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
  const fehler = Object.values(zustand.karten).filter((k) => k.falsch > 0 && k.box <= 2).length
  const tempo = empfohlenesTempo(FRAGEN, zustand.karten, tage)
  const nachricht = nachrichtFuerTag(tag)
  const datum = alsDate(tag).toLocaleDateString('de-DE', { weekday: 'long', day: 'numeric', month: 'long' })

  const coach = coachNachricht({
    name: anrede(e.name),
    heuteBeantwortet: beantwortet,
    tagesziel: e.tagesziel,
    streak: serie,
    tageBisPruefung: tage,
    ...(schwach !== undefined && schwach.quote !== null
      ? { schwaechstesThema: { name: schwach.name, quote: schwach.quote } }
      : {}),
  })

  const quiz = (titel: string, ids: string[]) => gehe({ name: 'quiz', titel, frageIds: ids })

  const starte = () => {
    const f = baueSession({
      fragen: FRAGEN,
      karten: zustand.karten,
      anzahl: SITZUNG,
      datum: tag,
      ...(schwach === undefined ? {} : { schwaechstesThema: schwach.thema }),
    })
    quiz('Tagestraining', f.map((x) => x.id))
  }

  const fehlerUeben = () => {
    const f = baueSession({ fragen: FRAGEN, karten: zustand.karten, anzahl: 15, nurFehler: true, datum: tag })
    quiz('Fehler wiederholen', f.map((x) => x.id))
  }

  return (
    <>
      <header>
        <p className="begruessung__datum">{datum}</p>
        <div className="kopf">
          <h1>{begruessung(new Date().getHours(), anrede(e.name))}</h1>
          <button className="icon-knopf" onClick={() => gehe({ name: 'einstellungen' })} aria-label="Einstellungen">
            <Icon name="einstellungen" />
          </button>
        </div>
      </header>

      <section className="held">
        <Ring wert={beantwortet / e.tagesziel} groesse={96} dicke={10}>
          <span className="zahl" style={{ fontSize: 24, fontWeight: 800 }}>
            {Math.min(100, Math.round((beantwortet / e.tagesziel) * 100))}%
          </span>
        </Ring>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, minWidth: 0, position: 'relative', zIndex: 1 }}>
          <span className="held__titel">Tagesziel</span>
          <span className="held__wert">
            {beantwortet} von {e.tagesziel} Fragen
          </span>
          <span style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {serie > 0 && (
              <Plakette>
                <Icon name="flamme" groesse={14} /> {serie} {serie === 1 ? 'Tag' : 'Tage'}
              </Plakette>
            )}
            {tage !== null && tage >= 0 && (
              <Plakette>
                <Icon name="uhr" groesse={14} /> noch {tage} Tage
              </Plakette>
            )}
          </span>
        </div>
      </section>

      {nachricht !== null && (
        <section className="brief">
          <p className="brief__von">{NACHRICHT_VON === null ? 'Für dich' : `Von ${NACHRICHT_VON}`}</p>
          <p className="brief__text">{nachricht}</p>
        </section>
      )}

      <button className="knopf knopf--gross knopf--breit" onClick={starte}>
        {beantwortet === 0 ? "Los geht's" : 'Weiter lernen'}
        <small>
          {SITZUNG} Fragen · ca. {SITZUNG} Minuten{faellig > 0 ? ` · ${faellig} fällig` : ''}
        </small>
      </button>

      <section className="karte">
        <h3>💬 {coach.titel}</h3>
        <p>{coach.text}</p>
        {coach.empfehlung !== undefined && <p className="untertitel">{coach.empfehlung}</p>}
        {schwach !== undefined && schwach.quote !== null && schwach.quote < 0.8 && (
          <button className="knopf-klein" onClick={() => gehe({ name: 'thema', thema: schwach.thema })}>
            {schwach.name} üben →
          </button>
        )}
      </section>

      <div className="kacheln">
        <Kachel icon="stift" titel="Rechnen" info="Auf Papier, mit Hilfe" bereich="warenwirtschaft" onClick={() => gehe({ name: 'rechenaufgabe', typId: 'gemischt' })} />
        <Kachel icon="pruefung" titel="Probeprüfung" info="Geschäftsprozesse, 120 Min" bereich="geschaeftsprozesse" onClick={() => gehe({ name: 'simulation', bereich: 'geschaeftsprozesse' })} />
        <Kachel icon="sprechblase" titel="Fachgespräch" info="Zählt 40 %" bereich="verkauf" onClick={() => gehe({ name: 'fachgespraech' })} />
        {fehler > 0 ? (
          <Kachel icon="kreuz" titel="Fehler wiederholen" info={`${fehler} unsichere Fragen`} bereich="wiso" onClick={fehlerUeben} />
        ) : (
          <Kachel icon="formel" titel="Formeln" info="Alles zum Nachschlagen" bereich="wiso" onClick={() => gehe({ name: 'formeln' })} />
        )}
      </div>

      {tempo !== null && tempo.proTag > 0 && (
        <section className="karte">
          <h3>📅 Dein Tempo bis zur Prüfung</h3>
          <p>
            Mit <strong>{tempo.proTag} Fragen am Tag</strong> sitzt bis zwei Wochen vor der Prüfung jede Frage mindestens
            dreimal richtig. Die letzten zwei Wochen bleiben frei für Probeprüfungen.
          </p>
          {tempo.proTag > e.tagesziel && (
            <p className="schritt__hinweis">
              Dein Tagesziel liegt bei {e.tagesziel}. Stell es in den Einstellungen höher, wenn du es schaffst.
            </p>
          )}
        </section>
      )}
    </>
  )
}
