import type { Antwort, Frage, ZahlLoesung } from '../domain/types'
import { thema } from '../domain/themen'
import { Plakette } from './ui'
import { Ziffernblock, eingabeAlsZahl, eingabeAnzeigen } from './Ziffernblock'
import { useState } from 'react'

const BUCHSTABEN = ['A', 'B', 'C', 'D', 'E', 'F']

function optionKlasse(
  frage: Frage,
  antwort: Antwort,
  index: number,
  aufgedeckt: boolean,
): string {
  const gewaehlt =
    (antwort.typ === 'single' && antwort.gewaehlt === index) ||
    (antwort.typ === 'multi' && antwort.gewaehlt.includes(index))
  const istLoesung = Array.isArray(frage.loesung)
    ? frage.loesung.includes(index)
    : frage.loesung === index

  const klassen = ['option']
  if (frage.typ === 'multi') klassen.push('option--mehrfach')
  if (!aufgedeckt) {
    if (gewaehlt) klassen.push('option--gewaehlt')
  } else if (istLoesung) {
    klassen.push('option--richtig')
  } else if (gewaehlt) {
    klassen.push('option--falsch')
  }
  return klassen.join(' ')
}

/**
 * Zeigt eine Frage mit passender Eingabe. `aufgedeckt` färbt richtige und
 * falsche Antworten ein — im Quiz direkt nach dem Prüfen, in der
 * Simulation erst bei der Auswertung.
 */
export function FrageKarte({
  frage,
  antwort,
  onAntwort,
  aufgedeckt,
}: {
  frage: Frage
  antwort: Antwort
  onAntwort: (a: Antwort) => void
  aufgedeckt: boolean
}) {
  const [eingabe, setEingabe] = useState(
    antwort.typ === 'zahl' && antwort.eingabe !== null ? String(antwort.eingabe).replace('.', ',') : '',
  )

  const waehle = (i: number) => {
    if (aufgedeckt) return
    if (antwort.typ === 'single') onAntwort({ typ: 'single', gewaehlt: i })
    if (antwort.typ === 'multi') {
      const neu = antwort.gewaehlt.includes(i)
        ? antwort.gewaehlt.filter((x) => x !== i)
        : [...antwort.gewaehlt, i]
      onAntwort({ typ: 'multi', gewaehlt: neu })
    }
  }

  const aendereEingabe = (text: string) => {
    setEingabe(text)
    onAntwort({ typ: 'zahl', eingabe: eingabeAlsZahl(text) })
  }

  return (
    <div className="abschnitt" style={{ gap: 14 }}>
      <div className="frage-meta">
        <Plakette>{thema(frage.thema).name}</Plakette>
        {frage.typ === 'multi' && <Plakette art="mittel">Mehrere richtig</Plakette>}
        {frage.typ === 'zahl' && <Plakette art="mittel">Auf Papier rechnen</Plakette>}
      </div>

      <p className="frage-text">{frage.frage}</p>

      {frage.typ !== 'zahl' && (
        <div className="optionen" role={frage.typ === 'single' ? 'radiogroup' : 'group'}>
          {(frage.optionen ?? []).map((o, i) => (
            <button
              key={i}
              className={optionKlasse(frage, antwort, i, aufgedeckt)}
              onClick={() => waehle(i)}
              disabled={aufgedeckt}
              role={frage.typ === 'single' ? 'radio' : 'checkbox'}
              aria-checked={
                antwort.typ === 'single'
                  ? antwort.gewaehlt === i
                  : antwort.typ === 'multi' && antwort.gewaehlt.includes(i)
              }
            >
              <span className="option__marke">{BUCHSTABEN[i]}</span>
              <span>{o}</span>
            </button>
          ))}
        </div>
      )}

      {frage.typ === 'zahl' && (
        <>
          <div className="eingabe-anzeige" aria-live="polite">
            {eingabe === '' ? (
              <span className="eingabe-anzeige__leer">Ergebnis</span>
            ) : (
              <span>{eingabeAnzeigen(eingabe)}</span>
            )}
            <span className="eingabe-anzeige__einheit">{(frage.loesung as ZahlLoesung).einheit}</span>
          </div>
          {!aufgedeckt && <Ziffernblock wert={eingabe} onAendern={aendereEingabe} />}
        </>
      )}
    </div>
  )
}
