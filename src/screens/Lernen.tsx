import { useMemo } from 'react'
import { Icon } from '../components/Icon'
import { THEMA_ICON, bereichStil } from '../components/symbole'
import { Plakette, prozentText, stufe } from '../components/ui'
import { FRAGEN } from '../data/fragen'
import { bereich } from '../domain/pruefung'
import type { BereichId } from '../domain/types'
import { heute } from '../engine/datum'
import { baueSession } from '../engine/sessionBuilder'
import { themenStatistik } from '../engine/statistik'
import { useNavigation } from '../navigation'
import { useStore } from '../store/useStore'

// Teil 2 zuerst — darauf kommt es im dritten Lehrjahr an.
const REIHENFOLGE: BereichId[] = ['geschaeftsprozesse', 'warenwirtschaft', 'verkauf', 'wiso']

export function Lernen() {
  const { zustand } = useStore()
  const { gehe } = useNavigation()
  const themen = useMemo(() => themenStatistik(FRAGEN, zustand.karten), [zustand.karten])
  const anzahlFehler = Object.values(zustand.karten).filter((k) => k.falsch > 0 && k.box <= 2).length

  const fehlerUeben = () => {
    const fragen = baueSession({
      fragen: FRAGEN,
      karten: zustand.karten,
      anzahl: 15,
      nurFehler: true,
      datum: heute(),
    })
    gehe({ name: 'quiz', titel: 'Fehler wiederholen', frageIds: fragen.map((f) => f.id) })
  }

  return (
    <>
      <header className="kopf">
        <h1>Lernen</h1>
      </header>

      {anzahlFehler > 0 && (
        <button className="knopf knopf--breit" onClick={fehlerUeben}>
          {anzahlFehler} unsichere Fragen wiederholen
        </button>
      )}

      {REIHENFOLGE.map((b) => {
        const eigene = themen.filter((t) => t.bereich === b)
        const info = bereich(b)
        return (
          <section className="abschnitt" key={b} style={bereichStil(b)}>
            <div className="bereich-kopf">
              <span className="bereich-kopf__punkt" />
              <h2>
                {info.kurz} · Teil {info.teil} · {info.gewicht} %
              </h2>
            </div>
            <div className="liste">
              {eigene.map((t) => (
                <button key={t.thema} className="zeile" onClick={() => gehe({ name: 'thema', thema: t.thema })}>
                  <span className="symbol symbol--klein">
                    <Icon name={THEMA_ICON[t.thema]} groesse={20} />
                  </span>
                  <span className="zeile__text">
                    <span className="zeile__titel">{t.name}</span>
                    <div className="balken balken--bereich">
                      <div className="balken__fuellung" style={{ width: `${Math.round(t.fortschritt * 100)}%` }} />
                    </div>
                    <span className="zeile__info">
                      {t.anzahlFragen} Fragen · {t.beantwortet === 0 ? 'noch nicht geübt' : `${t.beantwortet} Antworten`}
                    </span>
                  </span>
                  {t.quote !== null && <Plakette art={stufe(t.quote)}>{prozentText(t.quote)}</Plakette>}
                  <span className="pfeil"><Icon name="weiter" /></span>
                </button>
              ))}
            </div>
          </section>
        )
      })}

      <div className="liste">
        <button className="zeile" onClick={() => gehe({ name: 'formeln' })}>
          <Icon name="formel" />
          <span className="zeile__text">
            <span className="zeile__titel">Formelsammlung</span>
            <span className="zeile__info">Alle Rechenwege zum Nachschlagen</span>
          </span>
          <span className="pfeil"><Icon name="weiter" /></span>
        </button>
      </div>
    </>
  )
}
