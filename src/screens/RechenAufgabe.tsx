import { useState } from 'react'
import { GefuehrtesRechnen } from '../components/GefuehrtesRechnen'
import { Icon } from '../components/Icon'
import { RezeptKarte } from '../components/RezeptKarte'
import { REZEPTE } from '../data/rezepte'
import { Rechenweg } from '../components/Rechenweg'
import { Kopf, Plakette } from '../components/ui'
import { Ziffernblock, eingabeAlsZahl, eingabeAnzeigen } from '../components/Ziffernblock'
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

type Phase = 'lesen' | 'rechnen' | 'ergebnis' | 'gefuehrt' | 'gefuehrt-fertig'

function erzeuge(typId: AufgabentypId | 'gemischt'): Aufgabe {
  const rng = rngMitSeed(Date.now() % 2_147_483_647)
  const typ = typId === 'gemischt' ? waehle(rng, AUFGABENTYPEN) : aufgabentyp(typId)
  return typ.erzeuge(rng)
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
  const [richtig, setRichtig] = useState(false)
  const [ohneFehler, setOhneFehler] = useState(false)
  const rezept = REZEPTE[aufgabe.typId]

  const starteGefuehrt = () => {
    setPhase('gefuehrt')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const gefuehrtFertig = (fehlerfrei: boolean) => {
    setOhneFehler(fehlerfrei)
    setPhase('gefuehrt-fertig')
    dispatch({ typ: 'rechenaufgabeGeuebt', tag: heute() })
  }

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
          <RezeptKarte rezept={rezept} />
          <button className="knopf knopf--breit" onClick={() => setPhase('rechnen')}>
            Ich rechne jetzt
          </button>
          <button className="knopf knopf--zweit knopf--breit" onClick={starteGefuehrt}>
            Schritt für Schritt mit Hilfe
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
          <p className="untertitel" style={{ textAlign: 'center' }}>Keine Eile — hier läuft keine Uhr.</p>
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
          <button className="knopf knopf--zweit knopf--breit" onClick={starteGefuehrt}>
            Ich komme nicht weiter — zeig es mir Schritt für Schritt
          </button>
        </>
      )}

      {phase === 'gefuehrt' && (
        <>
          <RezeptKarte rezept={rezept} offen />
          <GefuehrtesRechnen schritte={aufgabe.rechenweg} onFertig={gefuehrtFertig} />
        </>
      )}

      {phase === 'gefuehrt-fertig' && (
        <>
          <section className="rueckmeldung rueckmeldung--richtig">
            <p className="rueckmeldung__titel">{ohneFehler ? 'Alle Schritte richtig!' : 'Durchgerechnet!'}</p>
            <p>
              {ohneFehler
                ? 'Du hast jeden Zwischenschritt selbst gelöst. Probier die nächste Aufgabe ganz ohne Hilfe.'
                : 'Die markierten Schritte schau dir noch einmal an. Bei der nächsten Aufgabe erkennst du sie wieder.'}
            </p>
            <p>
              Ergebnis: <strong className="zahl">{loesungText(aufgabe)}</strong>
            </p>
          </section>
          <p className="formel">{aufgabe.formel}</p>
          <button className="knopf knopf--breit" onClick={neu}>
            Neue Aufgabe mit anderen Zahlen
          </button>
        </>
      )}

      {phase === 'ergebnis' && (
        <>
          <section className={richtig ? 'rueckmeldung rueckmeldung--richtig' : 'rueckmeldung rueckmeldung--falsch'}>
            <p className="rueckmeldung__titel">{richtig ? 'Richtig gerechnet!' : 'Fast! Lass uns schauen, wo es hakt.'}</p>
            <p>
              Dein Ergebnis: <strong className="zahl">{eingabeAnzeigen(eingabe)} {aufgabe.loesung.einheit}</strong>
              <br />
              Richtig: <strong className="zahl">{loesungText(aufgabe)}</strong>
            </p>
            {formelOffen && <Plakette art="mittel">mit Formel-Tipp</Plakette>}
          </section>

          {!richtig && (
            <button className="knopf knopf--breit" onClick={starteGefuehrt}>
              Diese Aufgabe gemeinsam Schritt für Schritt rechnen
            </button>
          )}

          <section className="abschnitt">
            <h2>{richtig ? 'Zum Vergleich: der Rechenweg' : 'Oder vergleiche mit deinem Blatt'}</h2>
            <Rechenweg schritte={aufgabe.rechenweg} alleOffen={!richtig} />
          </section>

          <RezeptKarte rezept={rezept} offen={!richtig} />

          <button className="knopf knopf--breit" onClick={neu}>
            Neue Aufgabe mit anderen Zahlen
          </button>
        </>
      )}
    </>
  )
}
