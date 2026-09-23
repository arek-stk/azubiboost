import { useMemo, useState } from 'react'
import { useFeier } from '../components/Feier'
import { FrageKarte } from '../components/FrageKarte'
import { Rueckmeldung } from '../components/Rueckmeldung'
import { Balken, Kopf, Ring } from '../components/ui'
import { frage as frageNachId } from '../data/fragen'
import { istBeantwortet, istRichtig, leereAntwort, mitGemischtenOptionen } from '../data/fragen/pruefen'
import { punkteAusQuote } from '../domain/pruefung'
import type { Antwort, Bewertet, Frage } from '../domain/types'
import { heute } from '../engine/datum'
import { rngMitSeed } from '../engine/zufall'
import { useNavigation } from '../navigation'
import { heuteBeantwortet, useStore } from '../store/useStore'

export function Quiz({ titel, frageIds }: { titel: string; frageIds: string[] }) {
  const { zustand, dispatch } = useStore()
  const { feiere } = useFeier()
  const { zurueck, gehe } = useNavigation()
  const fragen = useMemo(
    () => {
      const rng = rngMitSeed(Date.now() % 2_147_483_647)
      return frageIds
        .map(frageNachId)
        .filter((f): f is Frage => f !== undefined)
        .map((f) => mitGemischtenOptionen(f, rng))
    },
    [frageIds],
  )
  const [start] = useState(() => new Date().toISOString())
  const [index, setIndex] = useState(0)
  const [antwort, setAntwort] = useState<Antwort | null>(null)
  const [geprueft, setGeprueft] = useState(false)
  // Erst selbst überlegen: die Antwortmöglichkeiten erscheinen erst nach einem Tipp.
  const [gezeigt, setGezeigt] = useState(false)
  const [ergebnisse, setErgebnisse] = useState<Bewertet[]>([])

  if (fragen.length === 0) {
    return (
      <>
        <Kopf titel={titel} klein />
        <div className="karte">
          <p>Hier gibt es gerade keine Fragen. Schau später wieder rein oder wähle ein anderes Thema.</p>
        </div>
      </>
    )
  }

  const fertig = index >= fragen.length

  if (fertig) {
    const richtig = ergebnisse.filter((e) => e.richtig).length
    const punkte = punkteAusQuote(richtig, ergebnisse.length)
    const fehlerIds = ergebnisse.filter((e) => !e.richtig).map((e) => e.frageId)
    return (
      <>
        <Kopf titel="Geschafft" klein />
        <div className="karte" style={{ alignItems: 'center', textAlign: 'center', gap: 16 }}>
          <Ring wert={punkte / 100} groesse={140}>
            <div>
              <div className="zahl" style={{ fontSize: 32, fontWeight: 750 }}>{punkte} %</div>
              <div className="untertitel">{richtig} von {ergebnisse.length}</div>
            </div>
          </Ring>
          <p>
            {punkte >= 80
              ? 'Richtig stark. Das Thema sitzt.'
              : punkte >= 50
                ? 'Gute Grundlage. Die Fehler kommen in den nächsten Tagen automatisch wieder.'
                : 'Das war noch nicht so gut. Lies dir die Erklärungen in Ruhe durch, morgen kommen die Fragen wieder.'}
          </p>
        </div>
        {fehlerIds.length > 0 && (
          <button
            className="knopf knopf--breit"
            onClick={() => gehe({ name: 'quiz', titel: 'Fehler wiederholen', frageIds: fehlerIds })}
          >
            {fehlerIds.length} Fehler gleich wiederholen
          </button>
        )}
        <button className="knopf knopf--zweit knopf--breit" onClick={zurueck}>
          Fertig
        </button>
      </>
    )
  }

  const f = fragen[index] as Frage
  const aktuelleAntwort = antwort ?? leereAntwort(f)
  const richtig = geprueft && istRichtig(f, aktuelleAntwort)

  const pruefe = () => {
    const ok = istRichtig(f, aktuelleAntwort)
    const tag = heute()
    if (heuteBeantwortet(zustand) + 1 === zustand.einstellungen.tagesziel) {
      feiere({ symbol: 'pokal', titel: 'Tagesziel geschafft', text: 'Was jetzt noch kommt, ist extra.' })
    }
    dispatch({ typ: 'frageBeantwortet', frageId: f.id, richtig: ok, tag })
    const neu = [
      ...ergebnisse,
      { frageId: f.id, thema: f.thema, bereich: f.bereich, richtig: ok, antwort: aktuelleAntwort },
    ]
    setErgebnisse(neu)
    setGeprueft(true)

    if (neu.length === fragen.length) {
      dispatch({
        typ: 'versuchBeendet',
        versuch: {
          id: `quiz-${Date.now()}`,
          art: 'quiz',
          begonnenAm: start,
          beendetAm: new Date().toISOString(),
          ergebnisse: neu,
          punkte: punkteAusQuote(neu.filter((e) => e.richtig).length, neu.length),
        },
      })
    }
  }

  const weiter = () => {
    setIndex((i) => i + 1)
    setAntwort(null)
    setGeprueft(false)
    setGezeigt(false)
    window.scrollTo({ top: 0 })
  }

  const verdeckt = zustand.einstellungen.erstUeberlegen && !gezeigt && !geprueft && f.typ !== 'zahl'

  return (
    <>
      <Kopf titel={titel} klein />
      <div className="quiz-kopf">
        <Balken wert={index / fragen.length} />
        <span className="untertitel zahl">
          {index + 1}/{fragen.length}
        </span>
      </div>

      <FrageKarte
        key={f.id}
        frage={f}
        antwort={aktuelleAntwort}
        onAntwort={setAntwort}
        aufgedeckt={geprueft}
        optionenVerdeckt={verdeckt}
      />

      {geprueft && <Rueckmeldung frage={f} richtig={richtig} />}

      <div className="aktionsleiste">
        {verdeckt ? (
          <button className="knopf knopf--breit" onClick={() => setGezeigt(true)}>
            Antworten zeigen
          </button>
        ) : !geprueft ? (
          <button className="knopf knopf--breit" onClick={pruefe} disabled={!istBeantwortet(aktuelleAntwort)}>
            Antwort prüfen
          </button>
        ) : (
          <button className="knopf knopf--breit" onClick={weiter}>
            {index + 1 === fragen.length ? 'Auswertung ansehen' : 'Nächste Frage'}
          </button>
        )}
      </div>
    </>
  )
}
