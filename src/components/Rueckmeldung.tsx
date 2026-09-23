import type { Frage, ZahlLoesung } from '../domain/types'
import { eur, zahl } from '../engine/format'
import { Rechenweg } from './Rechenweg'

export function loesungAlsText(frage: Frage): string {
  if (frage.typ === 'zahl') {
    const l = frage.loesung as ZahlLoesung
    return l.einheit === '€' ? eur(l.wert) : `${zahl(l.wert, 3)} ${l.einheit}`.trim()
  }
  const o = frage.optionen ?? []
  const idx = Array.isArray(frage.loesung) ? frage.loesung : [frage.loesung as number]
  return idx.map((i) => o[i]).join(' · ')
}

/** Sofort-Erklärung nach der Antwort — hier passiert das eigentliche Lernen. */
export function Rueckmeldung({ frage, richtig }: { frage: Frage; richtig: boolean }) {
  return (
    <section
      className={richtig ? 'rueckmeldung rueckmeldung--richtig' : 'rueckmeldung rueckmeldung--falsch'}
      aria-live="polite"
    >
      <p className="rueckmeldung__titel">{richtig ? 'Richtig!' : 'Nicht ganz.'}</p>
      {!richtig && (
        <p>
          <strong>Richtig wäre:</strong> {loesungAlsText(frage)}
        </p>
      )}
      <p>{frage.erklaerung}</p>
      {frage.merksatz !== undefined && <p className="merksatz">💡 {frage.merksatz}</p>}
      {frage.rechenweg !== undefined && <Rechenweg schritte={frage.rechenweg} alleOffen={!richtig} />}
      {frage.rechtsbezug !== undefined && <p className="rechtsbezug">Rechtsgrundlage: {frage.rechtsbezug}</p>}
      <p className="rechtsbezug">Frage-ID: {frage.id}</p>
    </section>
  )
}
