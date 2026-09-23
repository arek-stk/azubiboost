import type { RechenSchritt } from '../domain/types'
import { taschenrechnerZeilen } from '../engine/taschenrechner'

/** Zeigt als Tasten zum Nachtippen, was in den Taschenrechner getippt wird. */
export function TaschenrechnerTasten({ schritt }: { schritt: RechenSchritt }) {
  const zeilen = taschenrechnerZeilen(schritt)
  if (zeilen.length === 0) return null
  const mitPunkt = zeilen.some((z) => z.some((t) => t.art === 'zahl' && t.text.includes('.')))

  return (
    <div className="tasten-box">
      <span className="tasten-box__titel">Tipp das in den Taschenrechner</span>
      {zeilen.map((zeile, i) => (
        <div key={i} className="tasten-zeile" aria-label={zeile.map((t) => t.text).join(' ')}>
          {zeilen.length > 1 && <span className="tasten-zeile__nr">{i === 0 ? 'Erst' : 'Dann'}</span>}
          {zeile.map((t, j) => (
            <span key={j} className={`taste taste--${t.art === 'zahl' ? 'zahl' : t.art === 'op' ? 'op' : 'gleich'}`}>
              {t.text}
            </span>
          ))}
        </div>
      ))}
      {mitPunkt && <span className="tasten-box__hinweis">Das Komma tippst du am Taschenrechner als Punkt.</span>}
    </div>
  )
}
