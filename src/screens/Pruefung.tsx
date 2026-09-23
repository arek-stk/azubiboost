import { Icon } from '../components/Icon'
import { Plakette, stufe } from '../components/ui'
import { FRAGE_BEREICHE, bereich, notenstufe } from '../domain/pruefung'
import type { BereichId } from '../domain/types'
import { useNavigation } from '../navigation'
import { useStore } from '../store/useStore'
import { simulationsPool, simulationsUmfang } from './Simulation'

// Teil 2 zuerst — der steht im dritten Lehrjahr an.
const REIHENFOLGE: BereichId[] = ['geschaeftsprozesse', ...FRAGE_BEREICHE.filter((b) => b !== 'geschaeftsprozesse')]

export function Pruefung() {
  const { zustand } = useStore()
  const { gehe } = useNavigation()
  const sims = [...zustand.versuche].filter((v) => v.art === 'simulation').reverse()

  return (
    <>
      <header className="kopf">
        <h1>Prüfung</h1>
      </header>
      <p className="untertitel">
        Simulationen mit Zeitlimit, bewertet nach dem IHK-Notenschlüssel. Die Erklärungen siehst du erst in der
        Auswertung.
      </p>

      <section className="abschnitt">
        <h2>Schriftliche Prüfungsbereiche</h2>
        <div className="liste">
          {REIHENFOLGE.map((b) => {
            const info = bereich(b)
            const { anzahl, minuten } = simulationsUmfang(b, simulationsPool(b).length)
            return (
              <button key={b} className="zeile" onClick={() => gehe({ name: 'simulation', bereich: b })} disabled={anzahl === 0}>
                <span className="zeile__text">
                  <span className="zeile__titel">{info.name}</span>
                  <span className="zeile__info">
                    Teil {info.teil} · {info.gewicht} % der Gesamtnote
                    {info.sperrfach ? ' · Sperrfach' : ''}
                  </span>
                  <span className="zeile__info">
                    {anzahl === 0 ? 'Noch keine Fragen vorhanden' : `${anzahl} Aufgaben · ${minuten} Minuten`}
                  </span>
                </span>
                <span className="pfeil"><Icon name="weiter" /></span>
              </button>
            )
          })}
        </div>
      </section>

      <section className="abschnitt">
        <h2>Mündlich</h2>
        <div className="liste">
          <button className="zeile" onClick={() => gehe({ name: 'fachgespraech' })}>
            <Icon name="sprechblase" />
            <span className="zeile__text">
              <span className="zeile__titel">Fachgespräch in der Wahlqualifikation</span>
              <span className="zeile__info">Teil 2 · 40 % · Sperrfach · 15 Min Vorbereitung, 20 Min Gespräch</span>
            </span>
            <span className="pfeil"><Icon name="weiter" /></span>
          </button>
        </div>
      </section>

      {sims.length > 0 && (
        <section className="abschnitt">
          <h2>Bisherige Simulationen</h2>
          <div className="liste">
            {sims.slice(0, 10).map((v) => {
              const note = notenstufe(v.punkte)
              return (
                <button key={v.id} className="zeile" onClick={() => gehe({ name: 'ergebnis', versuchId: v.id })}>
                  <span className="zeile__text">
                    <span className="zeile__titel">{v.bereich === undefined ? 'Simulation' : bereich(v.bereich).kurz}</span>
                    <span className="zeile__info">{new Date(v.beendetAm).toLocaleDateString('de-DE')}</span>
                  </span>
                  <Plakette art={stufe(v.punkte / 100)}>
                    {v.punkte} Pkt · {note.wort}
                  </Plakette>
                </button>
              )
            })}
          </div>
        </section>
      )}
    </>
  )
}
