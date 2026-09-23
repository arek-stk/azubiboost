import { useMemo, useState } from 'react'
import { Kopf, Plakette } from '../components/ui'
import { APP_NAME } from '../data/persoenlich'
import { PRUEFUNGSTHEMEN, THEMEN } from '../domain/themen'
import type { ThemaId } from '../domain/types'
import { alsDate, deutschesDatum, heute, plusTage, type IsoTag } from '../engine/datum'
import { lernerinnerungIcs } from '../engine/kalender'
import { aktuelleWoche, lernplan, type LernWoche } from '../engine/lernplan'
import { useNavigation } from '../navigation'
import { STANDARD_PRUEFUNGSTERMIN } from '../store/persist'
import { useStore } from '../store/useStore'

function kurz(tag: IsoTag): string {
  return alsDate(tag).toLocaleDateString('de-DE', { day: 'numeric', month: 'numeric' })
}

const ART_TEXT: Record<LernWoche['art'], string> = {
  themen: 'Themen',
  probe: 'Probe',
  pruefungswoche: 'Prüfung',
  fachgespraech: 'Mündlich',
}

/** Teil-2-Themen zuerst, danach die übrigen. Feste Reihenfolge, damit der Plan nicht springt. */
function planThemen() {
  const teil2 = PRUEFUNGSTHEMEN.geschaeftsprozesse
  const rest = THEMEN.filter((t) => !teil2.includes(t.id))
  return [...teil2.map((id) => THEMEN.find((t) => t.id === id)), ...rest]
    .filter((t) => t !== undefined)
    .map((t) => ({ id: t.id, name: t.name }))
}

function oeffneKalender(inhalt: string) {
  const url = URL.createObjectURL(new Blob([inhalt], { type: 'text/calendar;charset=utf-8' }))
  const a = document.createElement('a')
  a.href = url
  // Ein neues Fenster lässt die App offen. Safari zeigt dann „Alle hinzufügen“ an.
  a.target = '_blank'
  a.rel = 'noopener'
  a.click()
  window.setTimeout(() => URL.revokeObjectURL(url), 60_000)
}

export function Lernplan() {
  const { zustand, dispatch } = useStore()
  const { gehe } = useNavigation()
  const tag = heute()
  const pruefung = zustand.einstellungen.pruefungstermin ?? STANDARD_PRUEFUNGSTERMIN
  const plan = useMemo(() => lernplan({ heute: tag, pruefung, themen: planThemen() }), [tag, pruefung])
  const jetzt = aktuelleWoche(plan, tag)
  const wochenBisPruefung = plan.filter((w) => w.art === 'themen' || w.art === 'probe').length
  const [eingetragen, setEingetragen] = useState(false)

  const eintragen = () => {
    oeffneKalender(
      lernerinnerungIcs({
        ab: plusTage(tag, 1),
        pruefung,
        uhrzeit: zustand.einstellungen.erinnerungUm,
        appName: APP_NAME,
      }),
    )
    setEingetragen(true)
  }

  return (
    <>
      <Kopf titel="Lernplan" klein />
      <p className="untertitel">
        Bis zur schriftlichen Prüfung am {deutschesDatum(pruefung)} sind es noch {wochenBisPruefung} Wochen. Jede Woche
        zwei Themen, dazu Rechnen. Die zwei Wochen vor der Prüfung sind für Probeprüfungen.
      </p>

      {jetzt !== undefined && (
        <section className="karte karte--akzent">
          <span className="untertitel" style={{ fontSize: 13, fontWeight: 600 }}>
            Diese Woche · {kurz(jetzt.start)} bis {kurz(jetzt.ende)}
          </span>
          <h3 style={{ fontSize: 22 }}>{jetzt.titel}</h3>
          <p>{jetzt.hinweis}</p>
          {jetzt.themen.map((t) => (
            <button
              key={t.id}
              className="knopf knopf--zweit knopf--breit"
              onClick={() => gehe({ name: 'thema', thema: t.id as ThemaId })}
            >
              {t.name} üben
            </button>
          ))}
          {jetzt.art === 'probe' && (
            <button className="knopf knopf--breit" onClick={() => gehe({ name: 'simulation', bereich: 'geschaeftsprozesse' })}>
              Probeprüfung starten
            </button>
          )}
          {jetzt.art === 'fachgespraech' && (
            <button className="knopf knopf--breit" onClick={() => gehe({ name: 'fachgespraech' })}>
              Fachgespräch üben
            </button>
          )}
        </section>
      )}

      <section className="abschnitt">
        <h2>Erinnerung</h2>
        <div className="liste">
          <label className="zeile">
            <span className="zeile__text">Jeden Tag um</span>
            <input
              className="feld-inline"
              type="time"
              value={zustand.einstellungen.erinnerungUm}
              onChange={(e) => {
                if (/^\d{2}:\d{2}$/.test(e.target.value)) {
                  dispatch({ typ: 'einstellungenGeaendert', aenderung: { erinnerungUm: e.target.value } })
                  setEingetragen(false)
                }
              }}
            />
          </label>
        </div>
        <button className="knopf knopf--breit" onClick={eintragen}>
          In den Kalender eintragen
        </button>
        <p className="untertitel" style={{ fontSize: 13, padding: '0 4px' }}>
          {eingetragen
            ? 'Tippe im Kalender auf „Alle hinzufügen“. Falls sich nichts öffnet, öffne die App einmal in Safari und tippe dort auf den Knopf.'
            : 'Der Kalender erinnert dich jeden Tag bis zum Tag vor der Prüfung. Den Prüfungstag trägt er mit einer Erinnerung am Vorabend gleich mit ein.'}
        </p>
      </section>

      <section className="abschnitt">
        <h2>Alle Wochen</h2>
        <div className="liste">
          {plan.map((w) => (
            <div
              key={w.start}
              className="zeile"
              style={w === jetzt ? { background: 'var(--akzent-weich)' } : undefined}
            >
              <span className="zeile__text">
                <span className="zeile__info">
                  {kurz(w.start)} bis {kurz(w.ende)}
                </span>
                <span className="zeile__titel">{w.titel}</span>
              </span>
              <Plakette art={w.art === 'themen' ? undefined : 'mittel'}>{ART_TEXT[w.art]}</Plakette>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}
