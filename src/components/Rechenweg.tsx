import type { RechenSchritt } from '../domain/types'

/** Rechenweg Schritt für Schritt — jeder Schritt einzeln aufklappbar. */
export function Rechenweg({ schritte, alleOffen = false }: { schritte: RechenSchritt[]; alleOffen?: boolean }) {
  return (
    <ol className="rechenweg">
      {schritte.map((s, i) => (
        <li key={i}>
          <details className="schritt" open={alleOffen || i === 0}>
            <summary>{s.label}</summary>
            <div className="schritt__inhalt">
              <p className="schritt__rechnung">{s.rechnung}</p>
              <p className="schritt__ergebnis">{s.ergebnis}</p>
              {s.hinweis !== undefined && <p className="schritt__hinweis">{s.hinweis}</p>}
            </div>
          </details>
        </li>
      ))}
    </ol>
  )
}
