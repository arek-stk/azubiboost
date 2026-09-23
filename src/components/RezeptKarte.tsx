import type { Rezept } from '../data/rezepte'

/** Das Rezept zum Aufgabentyp: die Reihenfolge, in der man vorgeht. */
export function RezeptKarte({ rezept, offen = false }: { rezept: Rezept; offen?: boolean }) {
  return (
    <details className="karte rezept" open={offen}>
      <summary className="rezept__kopf">Rezept: So gehst du vor</summary>
      <ol className="rezept__liste">
        {rezept.schritte.map((s, i) => (
          <li key={i}>{s}</li>
        ))}
      </ol>
      <p className="merksatz"><strong>Merksatz</strong>{rezept.merke}</p>
    </details>
  )
}
