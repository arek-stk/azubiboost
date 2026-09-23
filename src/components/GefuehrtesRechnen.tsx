import { useState } from 'react'
import type { RechenSchritt } from '../domain/types'
import { schrittWert } from '../engine/schrittwert'
import { TaschenrechnerTasten } from './TaschenrechnerTasten'
import { Ziffernblock, eingabeAlsZahl, eingabeAnzeigen } from './Ziffernblock'

type Stand = 'offen' | 'richtig' | 'korrigiert'

/**
 * Rechnet eine Aufgabe Schritt für Schritt mit ihr durch. Zu jedem Schritt gibt
 * es erst nur die Frage, dann auf Wunsch einen kleinen Tipp, dann die Rechnung —
 * so viel Hilfe wie nötig, so wenig wie möglich. Jedes Zwischenergebnis tippt
 * sie selbst ein.
 */
export function GefuehrtesRechnen({
  schritte,
  onFertig,
}: {
  schritte: RechenSchritt[]
  onFertig: (ohneFehler: boolean) => void
}) {
  const [index, setIndex] = useState(0)
  const [staende, setStaende] = useState<Stand[]>(() => schritte.map(() => 'offen'))
  const [eingabe, setEingabe] = useState('')
  const [tippOffen, setTippOffen] = useState(false)
  const [rechnungOffen, setRechnungOffen] = useState(false)
  const [geprueft, setGeprueft] = useState(false)

  const schritt = schritte[index]
  const ziel = schritt === undefined ? null : schrittWert(schritt)

  const weiter = (neuerStand: Stand) => {
    const neu = staende.map((s, i) => (i === index ? neuerStand : s))
    setStaende(neu)
    setEingabe('')
    setTippOffen(false)
    setRechnungOffen(false)
    setGeprueft(false)
    if (index + 1 >= schritte.length) {
      onFertig(neu.every((s) => s === 'richtig'))
    } else {
      setIndex(index + 1)
    }
  }

  const pruefe = () => {
    if (ziel === null) return
    const zahl = eingabeAlsZahl(eingabe)
    const ok = zahl !== null && Math.abs(zahl - ziel.wert) <= ziel.toleranz + 1e-9
    if (ok) {
      weiter('richtig')
    } else {
      setGeprueft(true)
    }
  }

  return (
    <ol className="gefuehrt">
      {schritte.map((s, i) => {
        if (i < index) {
          return (
            <li key={i} className={`gefuehrt__schritt gefuehrt__schritt--${staende[i]}`}>
              <span className="gefuehrt__marke">{staende[i] === 'richtig' ? '✓' : i + 1}</span>
              <div>
                <p className="gefuehrt__titel">{s.label}</p>
                <p className="schritt__ergebnis">{s.ergebnis}</p>
              </div>
            </li>
          )
        }
        if (i > index) {
          return (
            <li key={i} className="gefuehrt__schritt gefuehrt__schritt--spaeter">
              <span className="gefuehrt__marke">{i + 1}</span>
              <p className="gefuehrt__titel">Schritt {i + 1}</p>
            </li>
          )
        }
        return (
          <li key={i} className="gefuehrt__schritt gefuehrt__schritt--aktuell">
            <span className="gefuehrt__marke">{i + 1}</span>
            <div className="gefuehrt__inhalt">
              <p className="gefuehrt__titel">{s.label}</p>

              {s.hinweis !== undefined &&
                (tippOffen ? (
                  <p className="schritt__hinweis">💡 {s.hinweis}</p>
                ) : (
                  <button className="knopf-klein" onClick={() => setTippOffen(true)}>
                    Kleiner Tipp
                  </button>
                ))}

              {rechnungOffen ? (
                <>
                  <TaschenrechnerTasten schritt={s} />
                  <p className="formel">{s.rechnung}</p>
                </>
              ) : (
                <button className="knopf-klein" onClick={() => setRechnungOffen(true)}>
                  Zeig mir, was ich eintippe
                </button>
              )}

              {ziel === null ? (
                <>
                  <p className="schritt__ergebnis">{s.ergebnis}</p>
                  <button className="knopf knopf--breit" onClick={() => weiter('richtig')}>
                    Verstanden, weiter
                  </button>
                </>
              ) : geprueft ? (
                <>
                  <p className="rueckmeldung rueckmeldung--falsch">
                    Fast! Richtig ist: <strong className="zahl">{s.ergebnis}</strong>
                  </p>
                  <button className="knopf knopf--breit" onClick={() => weiter('korrigiert')}>
                    Weiter zum nächsten Schritt
                  </button>
                </>
              ) : (
                <>
                  <div className="eingabe-anzeige eingabe-anzeige--klein" aria-live="polite">
                    {eingabe === '' ? (
                      <span className="eingabe-anzeige__leer">Zwischenergebnis</span>
                    ) : (
                      <span>{eingabeAnzeigen(eingabe)}</span>
                    )}
                    <span className="eingabe-anzeige__einheit">{ziel.einheit}</span>
                  </div>
                  <Ziffernblock wert={eingabe} onAendern={setEingabe} />
                  <button className="knopf knopf--breit" onClick={pruefe} disabled={eingabeAlsZahl(eingabe) === null}>
                    Schritt prüfen
                  </button>
                </>
              )}
            </div>
          </li>
        )
      })}
    </ol>
  )
}
