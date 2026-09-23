import { useState } from 'react'
import { Icon, type IconName } from '../components/Icon'
import { bereichStil } from '../components/symbole'
import { WAHLQUALIFIKATIONEN } from '../data/fachgespraech'
import { APP_NAME, KOSENAME } from '../data/persoenlich'
import type { BereichId } from '../domain/types'
import { STANDARD_PRUEFUNGSTERMIN } from '../store/persist'
import { useStore } from '../store/useStore'

const TAGESZIELE = [10, 20, 30, 50]

const MERKMALE: { icon: IconName; bereich: BereichId; titel: string; text: string }[] = [
  {
    icon: 'lernen',
    bereich: 'verkauf',
    titel: 'Jeden Tag ein paar Fragen',
    text: 'Nach jeder Antwort siehst du gleich, warum sie stimmt oder nicht.',
  },
  {
    icon: 'stift',
    bereich: 'warenwirtschaft',
    titel: 'Rechnen mit Stift und Papier',
    text: 'Wenn du hängst, zeigt dir die App den Weg Schritt für Schritt.',
  },
  {
    icon: 'pruefung',
    bereich: 'geschaeftsprozesse',
    titel: 'Probeprüfungen',
    text: 'Mit den echten Zeiten und dem Notenschlüssel der IHK.',
  },
]

/** Drei kurze Schritte beim ersten Start: Begrüßung, Termin und Tempo, Wahlqualifikation. */
export function Onboarding() {
  const { zustand, dispatch } = useStore()
  const [schritt, setSchritt] = useState(0)
  const [termin, setTermin] = useState(zustand.einstellungen.pruefungstermin ?? STANDARD_PRUEFUNGSTERMIN)
  const [ziel, setZiel] = useState(zustand.einstellungen.tagesziel)
  const [wq, setWq] = useState<string | null>(zustand.einstellungen.wahlqualifikation)

  const fertig = () => {
    dispatch({
      typ: 'einstellungenGeaendert',
      aenderung: {
        pruefungstermin: termin === '' ? null : termin,
        tagesziel: ziel,
        wahlqualifikation: wq,
        onboardingFertig: true,
      },
    })
  }

  return (
    <>
      <header className="willkommen">
        <p className="begruessung__datum">Schritt {schritt + 1} von 3</p>
        <h1>
          {schritt === 0
            ? KOSENAME === null
              ? `Willkommen bei ${APP_NAME}`
              : `Hallo ${KOSENAME}!`
            : schritt === 1
              ? 'Deine Prüfung'
              : 'Dein Fachgespräch'}
        </h1>
        <p className="untertitel">
          {schritt === 0
            ? 'Hier bereitest du dich auf die Abschlussprüfung vor.'
            : schritt === 1
              ? 'Damit der Lernplan zu deinem Termin passt.'
              : 'Es zählt 40 % der Note. Welche Wahlqualifikation steht in deinem Ausbildungsvertrag?'}
        </p>
      </header>

      {schritt === 0 && (
        <ul className="merkmale">
          {MERKMALE.map((m) => (
            <li key={m.titel}>
              <span className="symbol" style={bereichStil(m.bereich)}>
                <Icon name={m.icon} />
              </span>
              <span>
                <strong>{m.titel}</strong>
                <span className="untertitel">{m.text}</span>
              </span>
            </li>
          ))}
        </ul>
      )}

      {schritt === 1 && (
        <>
          <section className="abschnitt">
            <div className="liste">
              <label className="zeile">
                <span className="zeile__text">Schriftliche Prüfung</span>
                <input
                  className="feld-inline"
                  type="date"
                  value={termin}
                  onChange={(e) => setTermin(e.target.value)}
                />
              </label>
            </div>
            <p className="untertitel" style={{ fontSize: 13, padding: '0 4px' }}>
              Eingetragen ist Teil 2 bei der IHK Niederbayern am 28. April 2027. Im Winter wäre es der 25. November 2026.
            </p>
          </section>

          <section className="abschnitt">
            <p className="untertitel" style={{ padding: '0 4px' }}>
              Fragen am Tag
            </p>
            <div className="segmente" role="radiogroup" aria-label="Fragen am Tag">
              {TAGESZIELE.map((z) => (
                <button
                  key={z}
                  role="radio"
                  aria-checked={ziel === z}
                  className={ziel === z ? 'segment segment--aktiv' : 'segment'}
                  onClick={() => setZiel(z)}
                >
                  {z}
                </button>
              ))}
            </div>
          </section>
        </>
      )}

      {schritt === 2 && (
        <div className="liste">
          {WAHLQUALIFIKATIONEN.map((w) => (
            <button key={w.id} className="zeile" onClick={() => setWq(w.id)} aria-pressed={wq === w.id}>
              <span className="zeile__text">
                <span className="zeile__titel">{w.name}</span>
              </span>
              {wq === w.id && (
                <span style={{ color: 'var(--akzent)' }}>
                  <Icon name="haken" />
                </span>
              )}
            </button>
          ))}
          <button className="zeile" onClick={() => setWq(null)} aria-pressed={wq === null}>
            <span className="zeile__text">
              <span className="zeile__titel">Weiß ich noch nicht</span>
              <span className="zeile__info">Kannst du später in den Einstellungen ändern</span>
            </span>
            {wq === null && (
              <span style={{ color: 'var(--akzent)' }}>
                <Icon name="haken" />
              </span>
            )}
          </button>
        </div>
      )}

      <div className="aktionsleiste">
        {schritt < 2 ? (
          <button className="knopf knopf--breit" onClick={() => setSchritt((s) => Math.min(2, s + 1))}>
            Weiter
          </button>
        ) : (
          <button className="knopf knopf--breit" onClick={fertig}>
            Los geht&apos;s
          </button>
        )}
        {schritt > 0 && (
          <button className="knopf knopf--zweit knopf--breit" onClick={() => setSchritt((s) => Math.max(0, s - 1))}>
            Zurück
          </button>
        )}
      </div>
    </>
  )
}
