import { Icon } from '../components/Icon'
import { Plakette, prozentText, stufe } from '../components/ui'
import { GRUNDLAGEN_TYPEN } from '../engine/grundlagen'
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
        Keine Angst vor Zahlen: Zu jedem Schritt gibt es einen Tipp und die Tasten für den Taschenrechner — den darfst du
        in der Prüfung auch benutzen. Fang am besten mit den Grundlagen an.
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
        <h2>Grundlagen — hier anfangen</h2>
        <p className="untertitel" style={{ padding: '0 4px' }}>
          Sechs kleine Bausteine, auf denen jede Kalkulation aufbaut. Mit einfachen Zahlen und Hilfe bei jedem Schritt.
        </p>
        <div className="liste">
          {GRUNDLAGEN_TYPEN.map((a) => {
            const s = zustand.rechnen[a.id]
            const gesamt = (s?.richtig ?? 0) + (s?.falsch ?? 0)
            return (
              <button key={a.id} className="zeile" onClick={() => gehe({ name: 'rechenaufgabe', typId: a.id })}>
                <span className="zeile__text">
                  <span className="zeile__titel">{a.name}</span>
                  <span className="zeile__info">{a.worumGehts}</span>
                </span>
                {gesamt > 0 && <Plakette art={stufe((s?.richtig ?? 0) / gesamt)}>{s?.richtig ?? 0} ✓</Plakette>}
                <span className="pfeil"><Icon name="weiter" /></span>
              </button>
            )
          })}
        </div>
      </section>

      <section className="abschnitt">
        <h2>Prüfungsaufgaben</h2>
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
