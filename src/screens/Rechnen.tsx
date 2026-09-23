import { Icon } from '../components/Icon'
import { Balken, Plakette } from '../components/ui'
import { GRUNDLAGEN_TYPEN } from '../engine/grundlagen'
import { STUFEN, lernpfad } from '../engine/lernpfad'
import { AUFGABENTYPEN, type AufgabentypId } from '../engine/rechenaufgaben'
import { useNavigation } from '../navigation'
import { useStore } from '../store/useStore'

const NAMEN = new Map([...GRUNDLAGEN_TYPEN, ...AUFGABENTYPEN].map((t) => [t.id, t]))

export function Rechnen() {
  const { zustand } = useStore()
  const { gehe } = useNavigation()
  const pfad = lernpfad(zustand.rechnen)
  const stufe = STUFEN.find((s) => s.nr === pfad.aktuelleStufe)
  const naechster = pfad.naechster === null ? undefined : NAMEN.get(pfad.naechster)
  const oeffne = (typId: AufgabentypId | 'gemischt') => gehe({ name: 'rechenaufgabe', typId })

  return (
    <>
      <header className="kopf">
        <h1>Rechnen</h1>
      </header>
      <p className="untertitel">
        Keine Angst vor Zahlen: Du fängst mit leichten Aufgaben an, und erst wenn du sie allein kannst, wird es schwerer.
        Zu jedem Schritt gibt es einen Tipp und die Tasten für den Taschenrechner.
      </p>

      <section className="karte">
        <span className="untertitel" style={{ fontSize: 13, fontWeight: 600 }}>
          Stufe {pfad.aktuelleStufe} von 4 · {stufe?.name}
        </span>
        <h3 className="titel-serif" style={{ fontSize: 22 }}>
          {naechster === undefined ? 'Alles gemeistert!' : `Jetzt dran: ${naechster.name.replace(/^\d+\.\s*/, '')}`}
        </h3>
        <Balken wert={pfad.gemeistert / pfad.gesamt} />
        <span className="untertitel" style={{ fontSize: 14 }}>
          {pfad.gemeistert} von {pfad.gesamt} Aufgabentypen gemeistert
        </span>
        <button className="knopf knopf--gross knopf--breit" onClick={() => oeffne(pfad.naechster ?? 'gemischt')}>
          {naechster === undefined ? 'Gemischte Prüfungsaufgabe' : 'Weiter auf dem Lernpfad'}
        </button>
      </section>

      <div className="knopf-reihe">
        <button className="knopf knopf--zweit" onClick={() => gehe({ name: 'formeln' })}>
          <Icon name="formel" groesse={20} /> Formeln
        </button>
        <button className="knopf knopf--zweit" onClick={() => gehe({ name: 'uebungszettel' })}>
          <Icon name="drucker" groesse={20} /> Übungszettel
        </button>
      </div>

      {STUFEN.map((s) => (
        <section className="abschnitt" key={s.nr}>
          <h2>
            Stufe {s.nr} · {s.name}
          </h2>
          <p className="untertitel" style={{ padding: '0 4px', fontSize: 14 }}>
            {s.beschreibung}
          </p>
          <div className="liste">
            {pfad.knoten
              .filter((k) => k.stufe === s.nr)
              .map((k) => {
                const typ = NAMEN.get(k.typId)
                return (
                  <button key={k.typId} className="zeile" onClick={() => oeffne(k.typId)}>
                    <span className="symbol symbol--klein" style={k.gemeistert ? { background: 'var(--gut-weich)', color: 'var(--gut)' } : undefined}>
                      {k.gemeistert ? <Icon name="haken" groesse={18} /> : <span style={{ fontWeight: 700, fontSize: 14 }}>{Math.min(k.richtig, k.schwelle)}/{k.schwelle}</span>}
                    </span>
                    <span className="zeile__text">
                      <span className="zeile__titel">{typ?.name.replace(/^\d+\.\s*/, '')}</span>
                      <span className="zeile__info">{typ?.worumGehts}</span>
                    </span>
                    {k.jetztDran && <Plakette art="mittel">Jetzt dran</Plakette>}
                  </button>
                )
              })}
          </div>
        </section>
      ))}

      <button className="knopf knopf--zweit knopf--breit" onClick={() => oeffne('gemischt')}>
        Zufällige Prüfungsaufgabe
      </button>
      <button className="knopf knopf--zweit knopf--breit" onClick={() => gehe({ name: 'hilfe' })}>
        Erklärvideos und Nachhilfe
      </button>
    </>
  )
}
