import { useEffect, useState } from 'react'
import { Icon } from '../components/Icon'
import { Rechenweg } from '../components/Rechenweg'
import { Kopf, Plakette } from '../components/ui'
import { Ziffernblock, eingabeAlsZahl, eingabeAnzeigen } from '../components/Ziffernblock'
import { uhrzeit } from '../components/useCountdown'
import { heute } from '../engine/datum'
import { eur, zahl } from '../engine/format'
import {
  AUFGABENTYPEN,
  aufgabentyp,
  istZahlRichtig,
  type AufgabentypId,
  type RechenAufgabe as Aufgabe,
} from '../engine/rechenaufgaben'
import { rngMitSeed, waehle } from '../engine/zufall'
import { useStore } from '../store/useStore'

type Phase = 'lesen' | 'rechnen' | 'ergebnis'

function erzeuge(typId: AufgabentypId | 'gemischt'): Aufgabe {
  const rng = rngMitSeed(Date.now() % 2_147_483_647)
  const typ = typId === 'gemischt' ? waehle(rng, AUFGABENTYPEN) : aufgabentyp(typId)
  return typ.erzeuge(rng)
}

function useStoppuhr(laeuft: boolean): number {
  const [sekunden, setSekunden] = useState(0)
  useEffect(() => {
    if (!laeuft) return
    const start = Date.now() - sekunden * 1000
    const id = setInterval(() => setSekunden(Math.round((Date.now() - start) / 1000)), 1000)
    return () => clearInterval(id)
  }, [laeuft])
  return sekunden
}

function loesungText(a: Aufgabe): string {
  return a.loesung.einheit === '€' ? eur(a.loesung.wert) : `${zahl(a.loesung.wert, 3)} ${a.loesung.einheit}`.trim()
}

export function RechenAufgabe({ typId }: { typId: AufgabentypId | 'gemischt' }) {
  const { dispatch } = useStore()
  const [aufgabe, setAufgabe] = useState(() => erzeuge(typId))
  const [phase, setPhase] = useState<Phase>('lesen')
  const [eingabe, setEingabe] = useState('')
  const [formelOffen, setFormelOffen] = useState(false)
  const sekunden = useStoppuhr(phase === 'rechnen')
  const [richtig, setRichtig] = useState(false)

  const pruefe = () => {
    const ok = istZahlRichtig(aufgabe.loesung, eingabeAlsZahl(eingabe))
    setRichtig(ok)
    setPhase('ergebnis')
    dispatch({ typ: 'rechenaufgabeBeantwortet', typId: aufgabe.typId, richtig: ok, tag: heute() })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const neu = () => {
    setAufgabe(erzeuge(typId))
    setPhase('lesen')
    setEingabe('')
    setFormelOffen(false)
    window.scrollTo({ top: 0 })
  }

  return (
    <>
      <Kopf
        titel={aufgabe.titel}
        klein
        rechts={phase === 'rechnen' ? <span className="uhr untertitel">{uhrzeit(sekunden)}</span> : undefined}
      />

      <section className="karte">
        <p style={{ fontWeight: 600 }}>{aufgabe.frage}</p>
        <dl className="gegeben">
          {aufgabe.gegeben.map((g) => (
            <div key={g.label} style={{ display: 'contents' }}>
              <dt>{g.label}</dt>
              <dd>{g.wert}</dd>
            </div>
          ))}
        </dl>
      </section>

      {phase === 'lesen' && (
        <>
          <div className="karte karte--akzent">
            <div className="papier-hinweis">
              <Icon name="stift" />
              <p>
                Nimm Blatt und Stift. Schreib die gegebenen Werte ab und rechne Schritt für Schritt — genau
                wie in der Prüfung. Hier tippst du nur das Ergebnis ein.
              </p>
            </div>
          </div>
          <button className="knopf knopf--breit" onClick={() => setPhase('rechnen')}>
            Ich rechne jetzt
          </button>
        </>
      )}

      {phase === 'rechnen' && (
        <>
          <div className="eingabe-anzeige" aria-live="polite">
            {eingabe === '' ? <span className="eingabe-anzeige__leer">Dein Ergebnis</span> : <span>{eingabeAnzeigen(eingabe)}</span>}
            <span className="eingabe-anzeige__einheit">{aufgabe.loesung.einheit}</span>
          </div>
          <Ziffernblock wert={eingabe} onAendern={setEingabe} />
          <button className="knopf knopf--breit" onClick={pruefe} disabled={eingabeAlsZahl(eingabe) === null}>
            Ergebnis prüfen
          </button>
          {formelOffen ? (
            <p className="formel">{aufgabe.formel}</p>
          ) : (
            <button className="knopf knopf--zweit knopf--breit" onClick={() => setFormelOffen(true)}>
              Tipp: Formel anzeigen
            </button>
          )}
        </>
      )}

      {phase === 'ergebnis' && (
        <>
          <section className={richtig ? 'rueckmeldung rueckmeldung--richtig' : 'rueckmeldung rueckmeldung--falsch'}>
            <p className="rueckmeldung__titel">{richtig ? 'Richtig gerechnet!' : 'Da hat sich ein Fehler eingeschlichen.'}</p>
            <p>
              Dein Ergebnis: <strong className="zahl">{eingabeAnzeigen(eingabe)} {aufgabe.loesung.einheit}</strong>
              <br />
              Richtig: <strong className="zahl">{loesungText(aufgabe)}</strong>
            </p>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              <Plakette>
                <Icon name="uhr" groesse={14} /> {uhrzeit(sekunden)}
              </Plakette>
              {formelOffen && <Plakette art="mittel">mit Formel-Tipp</Plakette>}
            </div>
          </section>

          <section className="abschnitt">
            <h2>{richtig ? 'Zum Vergleich: der Rechenweg' : 'Vergleiche Schritt für Schritt mit deinem Blatt'}</h2>
            <Rechenweg schritte={aufgabe.rechenweg} alleOffen={!richtig} />
          </section>

          <p className="formel">{aufgabe.formel}</p>

          <button className="knopf knopf--breit" onClick={neu}>
            Neue Aufgabe mit anderen Zahlen
          </button>
        </>
      )}
    </>
  )
}
