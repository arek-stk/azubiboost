import { useMemo } from 'react'
import { Kopf, Plakette, prozentText, stufe } from '../components/ui'
import { ERKLAERUNGEN } from '../data/erklaerungen'
import { FRAGEN } from '../data/fragen'
import { thema as themaInfo } from '../domain/themen'
import type { ThemaId } from '../domain/types'
import { heute } from '../engine/datum'
import { AUFGABENTYPEN } from '../engine/rechenaufgaben'
import { baueSession } from '../engine/sessionBuilder'
import { themenStatistik } from '../engine/statistik'
import { useNavigation } from '../navigation'
import { useStore } from '../store/useStore'

export function ThemaSeite({ thema }: { thema: ThemaId }) {
  const { zustand } = useStore()
  const { gehe } = useNavigation()
  const info = themaInfo(thema)
  const e = ERKLAERUNGEN[thema]
  const stat = useMemo(
    () => themenStatistik(FRAGEN, zustand.karten).find((t) => t.thema === thema),
    [zustand.karten, thema],
  )
  const rechentypen = AUFGABENTYPEN.filter((a) => a.thema === thema)

  const ueben = (nurFehler: boolean) => {
    const fragen = baueSession({
      fragen: FRAGEN,
      karten: zustand.karten,
      anzahl: 10,
      thema,
      nurFehler,
      datum: heute(),
    })
    gehe({ name: 'quiz', titel: info.name, frageIds: fragen.map((f) => f.id) })
  }

  const hatFehler = FRAGEN.some((f) => f.thema === thema && (zustand.karten[f.id]?.falsch ?? 0) > 0)

  return (
    <>
      <Kopf titel={info.name} klein />

      {stat !== undefined && stat.beantwortet > 0 && (
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          <Plakette art={stufe(stat.quote)}>{prozentText(stat.quote)} richtig</Plakette>
          <Plakette>{stat.beantwortet} Antworten</Plakette>
        </div>
      )}

      <section className="karte">
        <h3>Kurz erklärt</h3>
        {e.kern.map((absatz, i) => (
          <p key={i}>{absatz}</p>
        ))}
      </section>

      <section className="karte">
        <h3>Beispiel aus dem Laden</h3>
        <p>{e.beispiel}</p>
      </section>

      <p className="merksatz" style={{ background: 'var(--akzent-weich)' }}>💡 {e.merksatz}</p>

      <section className="karte" style={{ background: 'var(--mittel-weich)', boxShadow: 'none' }}>
        <h3>Typische Prüfungsfalle</h3>
        <p>{e.falle}</p>
      </section>

      <button className="knopf knopf--breit" onClick={() => ueben(false)}>
        10 Fragen zu diesem Thema
      </button>
      {hatFehler && (
        <button className="knopf knopf--zweit knopf--breit" onClick={() => ueben(true)}>
          Nur meine Fehler in diesem Thema
        </button>
      )}
      {rechentypen.length > 0 && (
        <section className="abschnitt">
          <h2>Rechnen auf Papier</h2>
          <div className="liste">
            {rechentypen.map((a) => (
              <button key={a.id} className="zeile" onClick={() => gehe({ name: 'rechenaufgabe', typId: a.id })}>
                <span className="zeile__text">
                  <span className="zeile__titel">{a.name}</span>
                  <span className="zeile__info">{a.worumGehts}</span>
                </span>
              </button>
            ))}
          </div>
        </section>
      )}
    </>
  )
}
