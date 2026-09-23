import { Icon } from '../components/Icon'
import { Plakette, prozentText, stufe } from '../components/ui'
import { AUFGABENTYPEN } from '../engine/rechenaufgaben'
import { useNavigation } from '../navigation'
import { useStore } from '../store/useStore'

const STERNE = { 1: 'leicht', 2: 'mittel', 3: 'schwer' } as const

export function Rechnen() {
  const { zustand } = useStore()
  const { gehe } = useNavigation()

  return (
    <>
      <header className="kopf">
        <h1>Rechnen</h1>
      </header>
      <p className="untertitel">
        Jede Aufgabe hat neue Zahlen. Du rechnest auf Papier, tippst nur das Ergebnis ein und bekommst danach
        den ganzen Rechenweg.
      </p>

      <button className="knopf knopf--breit" onClick={() => gehe({ name: 'rechenaufgabe', typId: 'gemischt' })}>
        Zufällige Aufgabe
      </button>

      <div className="knopf-reihe">
        <button className="knopf knopf--zweit" onClick={() => gehe({ name: 'formeln' })}>
          <Icon name="formel" groesse={20} /> Formeln
        </button>
        <button className="knopf knopf--zweit" onClick={() => gehe({ name: 'uebungszettel' })}>
          <Icon name="drucker" groesse={20} /> Übungszettel
        </button>
      </div>

      <section className="abschnitt">
        <h2>Aufgabentypen</h2>
        <div className="liste">
          {AUFGABENTYPEN.map((a) => {
            const s = zustand.rechnen[a.id]
            const gesamt = (s?.richtig ?? 0) + (s?.falsch ?? 0)
            const quote = gesamt === 0 ? null : (s?.richtig ?? 0) / gesamt
            return (
              <button key={a.id} className="zeile" onClick={() => gehe({ name: 'rechenaufgabe', typId: a.id })}>
                <span className="zeile__text">
                  <span className="zeile__titel">{a.name}</span>
                  <span className="zeile__info">{a.worumGehts}</span>
                  <span style={{ display: 'flex', gap: 6 }}>
                    <Plakette>{STERNE[a.schwierigkeit]}</Plakette>
                    {quote !== null && (
                      <Plakette art={stufe(quote)}>
                        {prozentText(quote)} · {gesamt}×
                      </Plakette>
                    )}
                  </span>
                </span>
                <span className="pfeil"><Icon name="weiter" /></span>
              </button>
            )
          })}
        </div>
      </section>
    </>
  )
}
