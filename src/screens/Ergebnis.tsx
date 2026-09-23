import { Rueckmeldung } from '../components/Rueckmeldung'
import { Balken, Kopf, Plakette, Ring, prozentText, stufe } from '../components/ui'
import { frage as frageNachId } from '../data/fragen'
import { BESTEHENSGRENZE, bereich, notenstufe } from '../domain/pruefung'
import { THEMEN } from '../domain/themen'
import { useNavigation } from '../navigation'
import { useStore } from '../store/useStore'

export function Ergebnis({ versuchId }: { versuchId: string }) {
  const { zustand } = useStore()
  const { wechsleTab } = useNavigation()
  const v = zustand.versuche.find((x) => x.id === versuchId)

  if (v === undefined) {
    return (
      <>
        <Kopf titel="Auswertung" klein />
        <p>Diese Auswertung ist nicht mehr gespeichert.</p>
      </>
    )
  }

  const note = notenstufe(v.punkte)
  const info = v.bereich === undefined ? undefined : bereich(v.bereich)
  const bestanden = v.punkte >= BESTEHENSGRENZE
  const richtig = v.ergebnisse.filter((e) => e.richtig).length

  const jeThema = THEMEN.map((t) => {
    const eigene = v.ergebnisse.filter((e) => e.thema === t.id)
    return { t, anzahl: eigene.length, quote: eigene.length === 0 ? null : eigene.filter((e) => e.richtig).length / eigene.length }
  }).filter((x) => x.anzahl > 0)

  const fehler = v.ergebnisse.filter((e) => !e.richtig)

  return (
    <>
      <Kopf titel={info?.name ?? 'Auswertung'} klein />

      <section className="karte" style={{ alignItems: 'center', textAlign: 'center', gap: 14 }}>
        <Ring wert={v.punkte / 100} groesse={150}>
          <div>
            <div className="zahl" style={{ fontSize: 36, fontWeight: 750 }}>{v.punkte}</div>
            <div className="untertitel">von 100 Punkten</div>
          </div>
        </Ring>
        <div>
          <p style={{ fontSize: 22, fontWeight: 700 }}>
            Note {note.note} · {note.wort}
          </p>
          <p className="untertitel">{richtig} von {v.ergebnisse.length} Aufgaben richtig</p>
        </div>
        <Plakette art={bestanden ? 'gut' : 'schlecht'}>
          {bestanden ? 'Mit diesem Ergebnis bestanden' : 'Mit diesem Ergebnis nicht bestanden'}
        </Plakette>
        {v.zeitAbgelaufen === true && <p className="schritt__hinweis">Die Zeit ist abgelaufen — es wurde automatisch abgegeben.</p>}
        {info?.sperrfach === true && !bestanden && (
          <p className="schritt__hinweis">
            {info.kurz} ist ein Sperrfach: unter 50 Punkten ist die gesamte Prüfung nicht bestanden. Hier lohnt sich jede
            Übungsminute am meisten.
          </p>
        )}
      </section>

      <section className="abschnitt">
        <h2>Nach Themen</h2>
        <div className="liste">
          {jeThema.map(({ t, anzahl, quote }) => (
            <div key={t.id} className="zeile">
              <span className="zeile__text">
                <span className="zeile__titel">{t.name}</span>
                <Balken wert={quote ?? 0} farbe={stufe(quote)} />
              </span>
              <Plakette art={stufe(quote)}>
                {prozentText(quote)} · {anzahl}
              </Plakette>
            </div>
          ))}
        </div>
      </section>

      {fehler.length > 0 && (
        <section className="abschnitt">
          <h2>Deine Fehler mit Erklärung</h2>
          {fehler.map((e) => {
            const f = frageNachId(e.frageId)
            if (f === undefined) return null
            return (
              <details key={e.frageId} className="karte">
                <summary style={{ fontWeight: 600, cursor: 'pointer', whiteSpace: 'pre-line' }}>{f.frage}</summary>
                <Rueckmeldung frage={f} richtig={false} />
              </details>
            )
          })}
        </section>
      )}

      <button className="knopf knopf--breit" onClick={() => wechsleTab('fortschritt')}>
        Zum Gesamtfortschritt
      </button>
    </>
  )
}
