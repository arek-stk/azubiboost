import { useCallback, useMemo, useState } from 'react'
import { FrageKarte } from '../components/FrageKarte'
import { Balken, Kopf } from '../components/ui'
import { uhrzeit, useCountdown } from '../components/useCountdown'
import { FRAGEN, alsFrage, istGeneriert } from '../data/fragen'
import { istBeantwortet, istRichtig, leereAntwort, mitGemischtenOptionen } from '../data/fragen/pruefen'
import { bereich as bereichInfo, punkteAusQuote } from '../domain/pruefung'
import { PRUEFUNGSTHEMEN } from '../domain/themen'
import type { Antwort, BereichId, Frage } from '../domain/types'
import { heute } from '../engine/datum'
import { AUFGABENTYPEN } from '../engine/rechenaufgaben'
import { bauePruefung } from '../engine/sessionBuilder'
import { mische, rngMitSeed } from '../engine/zufall'
import { useNavigation } from '../navigation'
import { useStore } from '../store/useStore'

const MINUTEN_JE_AUFGABE = 3
const MINDESTFRAGEN = 5

/** Umfang einer Simulation: echte Prüfungszeit, sofern genug Fragen da sind. */
export function simulationsUmfang(b: BereichId, verfuegbar: number) {
  const info = bereichInfo(b)
  const ziel = Math.round(info.minuten / MINUTEN_JE_AUFGABE)
  const rechnen = b === 'warenwirtschaft' || b === 'geschaeftsprozesse' ? 4 : 0
  if (verfuegbar < MINDESTFRAGEN) return { anzahl: 0, minuten: 0, rechnen: 0 }
  const ausBank = Math.min(verfuegbar, ziel - rechnen)
  const anzahl = ausBank + rechnen
  return { anzahl, minuten: anzahl >= ziel ? info.minuten : anzahl * MINUTEN_JE_AUFGABE, rechnen }
}

/** Alle Fragen, aus denen die Simulation dieses Prüfungsbereichs ziehen darf. */
export function simulationsPool(b: BereichId): Frage[] {
  const themen = PRUEFUNGSTHEMEN[b]
  return FRAGEN.filter((f) => themen.includes(f.thema))
}

function stelleZusammen(b: BereichId): Frage[] {
  const pool = simulationsPool(b)
  const { anzahl, rechnen } = simulationsUmfang(b, pool.length)
  const rng = rngMitSeed(Date.now() % 2_147_483_647)
  const bank = bauePruefung(FRAGEN, b, anzahl - rechnen, rng, PRUEFUNGSTHEMEN[b]).map((f) => mitGemischtenOptionen(f, rng))
  const generiert = mische(rng, AUFGABENTYPEN)
    .slice(0, rechnen)
    .map((t, i) => alsFrage(t.erzeuge(rng), i, b))
  // Rechenaufgaben verteilt einstreuen statt alle ans Ende.
  const alle = [...bank]
  generiert.forEach((g, i) => alle.splice(Math.min(alle.length, (i + 1) * Math.floor(alle.length / (rechnen + 1))), 0, g))
  return alle
}

export function Simulation({ bereich }: { bereich: BereichId }) {
  const { dispatch } = useStore()
  const { ersetze, zurueck } = useNavigation()
  const info = bereichInfo(bereich)
  const [fragen] = useState(() => stelleZusammen(bereich))
  const { minuten } = simulationsUmfang(bereich, simulationsPool(bereich).length)
  const [phase, setPhase] = useState<'start' | 'laeuft'>('start')
  const [start, setStart] = useState('')
  const [index, setIndex] = useState(0)
  const [antworten, setAntworten] = useState<Record<string, Antwort>>({})

  const beantwortet = useMemo(
    () => fragen.filter((f) => antworten[f.id] !== undefined && istBeantwortet(antworten[f.id] as Antwort)).length,
    [fragen, antworten],
  )

  const abgeben = useCallback(
    (zeitAbgelaufen: boolean) => {
      const tag = heute()
      const ergebnisse = fragen.map((f) => {
        const a = antworten[f.id] ?? leereAntwort(f)
        return { frageId: f.id, thema: f.thema, bereich: f.bereich, richtig: istRichtig(f, a), antwort: a }
      })
      for (const e of ergebnisse) {
        if (!istGeneriert(e.frageId)) dispatch({ typ: 'frageBeantwortet', frageId: e.frageId, richtig: e.richtig, tag })
      }
      const id = `sim-${Date.now()}`
      dispatch({
        typ: 'versuchBeendet',
        versuch: {
          id,
          art: 'simulation',
          bereich,
          begonnenAm: start,
          beendetAm: new Date().toISOString(),
          ergebnisse,
          punkte: punkteAusQuote(ergebnisse.filter((e) => e.richtig).length, ergebnisse.length),
          zeitAbgelaufen,
        },
      })
      ersetze({ name: 'ergebnis', versuchId: id })
    },
    [fragen, antworten, dispatch, bereich, start, ersetze],
  )

  const rest = useCountdown(minuten * 60, phase === 'laeuft', () => abgeben(true))

  if (phase === 'start') {
    return (
      <>
        <Kopf titel={info.name} klein />
        <section className="karte">
          <h3>So läuft die Simulation</h3>
          <p>
            {fragen.length} Aufgaben in {minuten} Minuten. Du kannst vor und zurück springen und Antworten ändern,
            bis du abgibst. Läuft die Zeit ab, wird automatisch abgegeben.
          </p>
          <p>Leg Blatt, Stift und Taschenrechner bereit. Einige Aufgaben sind Rechenaufgaben.</p>
          {info.sperrfach && (
            <p className="schritt__hinweis">
              Sperrfach: unter 50 Punkten ist die ganze Prüfung nicht bestanden, egal wie gut der Rest ist.
            </p>
          )}
        </section>
        <button
          className="knopf knopf--breit"
          onClick={() => {
            setStart(new Date().toISOString())
            setPhase('laeuft')
          }}
        >
          Simulation starten
        </button>
      </>
    )
  }

  const f = fragen[index] as Frage
  const antwort = antworten[f.id] ?? leereAntwort(f)
  const knapp = rest <= 5 * 60

  const abbrechen = () => {
    if (window.confirm('Simulation abbrechen? Deine Antworten gehen verloren.')) zurueck()
  }

  const abgabeFragen = () => {
    const offen = fragen.length - beantwortet
    const text = offen > 0 ? `${offen} Aufgaben sind noch offen. Trotzdem abgeben?` : 'Jetzt abgeben?'
    if (window.confirm(text)) abgeben(false)
  }

  return (
    <>
      <header className="kopf kopf--klein">
        <button className="zurueck" onClick={abbrechen}>
          Abbrechen
        </button>
        <h1 style={{ textAlign: 'center' }}>
          <span className={knapp ? 'uhr uhr--knapp' : 'uhr'}>{uhrzeit(rest)}</span>
        </h1>
        <button className="zurueck" style={{ marginLeft: 0, marginRight: -8 }} onClick={abgabeFragen}>
          Abgeben
        </button>
      </header>

      <div className="quiz-kopf">
        <Balken wert={beantwortet / fragen.length} />
        <span className="untertitel zahl">
          {index + 1}/{fragen.length}
        </span>
      </div>

      <FrageKarte
        key={f.id}
        frage={f}
        antwort={antwort}
        onAntwort={(a) => setAntworten((alt) => ({ ...alt, [f.id]: a }))}
        aufgedeckt={false}
      />

      <div className="aktionsleiste" style={{ flexDirection: 'row' }}>
        <button className="knopf knopf--zweit" style={{ flex: 1 }} onClick={() => setIndex((i) => i - 1)} disabled={index === 0}>
          Zurück
        </button>
        {index + 1 < fragen.length ? (
          <button className="knopf" style={{ flex: 1 }} onClick={() => setIndex((i) => i + 1)}>
            Weiter
          </button>
        ) : (
          <button className="knopf" style={{ flex: 1 }} onClick={abgabeFragen}>
            Abgeben
          </button>
        )}
      </div>
    </>
  )
}
