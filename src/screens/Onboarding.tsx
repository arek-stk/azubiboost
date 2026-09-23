import { useState } from 'react'
import { Icon } from '../components/Icon'
import { WAHLQUALIFIKATIONEN } from '../data/fachgespraech'
import { APP_NAME, KOSENAME, VORNAME_VORBELEGUNG } from '../data/persoenlich'
import { STANDARD_PRUEFUNGSTERMIN } from '../store/persist'
import { useStore } from '../store/useStore'

const feld = {
  width: '100%',
  minHeight: 52,
  padding: '12px 14px',
  borderRadius: 12,
  border: '1px solid var(--linie)',
  background: 'var(--bg-erhoeht)',
} as const

/** Drei kurze Schritte beim ersten Start: Name, Termin und Tempo, Wahlqualifikation. */
export function Onboarding() {
  const { zustand, dispatch } = useStore()
  const [schritt, setSchritt] = useState(0)
  const [name, setName] = useState(zustand.einstellungen.name ?? VORNAME_VORBELEGUNG ?? '')
  const [termin, setTermin] = useState(zustand.einstellungen.pruefungstermin ?? STANDARD_PRUEFUNGSTERMIN)
  const [ziel, setZiel] = useState(zustand.einstellungen.tagesziel)
  const [wq, setWq] = useState<string | null>(zustand.einstellungen.wahlqualifikation)

  const fertig = () => {
    dispatch({
      typ: 'einstellungenGeaendert',
      aenderung: {
        name: name.trim() === '' ? null : name.trim(),
        pruefungstermin: termin === '' ? null : termin,
        tagesziel: ziel,
        wahlqualifikation: wq,
        onboardingFertig: true,
      },
    })
  }

  return (
    <>
      <div className="held" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: 8 }}>
        <span className="held__titel">Schritt {schritt + 1} von 3</span>
        <h1 style={{ fontSize: 28 }}>
          {schritt === 0 ? (KOSENAME === null ? `Willkommen bei ${APP_NAME}` : `Hallo ${KOSENAME}!`) : schritt === 1 ? 'Deine Prüfung' : 'Dein Fachgespräch'}
        </h1>
        <p style={{ opacity: 0.92 }}>
          {schritt === 0
            ? 'Deine Begleitung für die Abschlussprüfung Kauffrau im Einzelhandel.'
            : schritt === 1
              ? 'Damit dein Lernplan zum Termin passt.'
              : 'Es zählt 40 % — daher üben wir es gezielt.'}
        </p>
      </div>

      {schritt === 0 && (
        <section className="karte">
          <label className="abschnitt" style={{ gap: 6 }}>
            <span className="untertitel">Wie heißt du?</span>
            <input value={name} onChange={(e) => setName(e.target.value)} autoComplete="given-name" maxLength={30} style={feld} />
          </label>
          <ul style={{ margin: 0, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 6 }}>
            <li>Jeden Tag ein paar Fragen — mit Erklärung direkt nach jeder Antwort.</li>
            <li>Rechnen mit Blatt und Stift, mit Hilfe Schritt für Schritt, wenn es hakt.</li>
            <li>Prüfungssimulationen mit den echten Zeiten und dem IHK-Notenschlüssel.</li>
          </ul>
        </section>
      )}

      {schritt === 1 && (
        <section className="karte">
          <label className="abschnitt" style={{ gap: 6 }}>
            <span className="untertitel">Termin der schriftlichen Prüfung (Teil 2)</span>
            <input type="date" value={termin} onChange={(e) => setTermin(e.target.value)} style={feld} />
            <span className="untertitel" style={{ fontSize: 13 }}>
              Vorbelegt ist Teil 2 bei der IHK Niederbayern: 28. April 2027 (Winter wäre der 25. November 2026).
            </span>
          </label>
          <span className="untertitel">Wie viele Fragen am Tag?</span>
          <div className="kacheln" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
            {[10, 20, 30, 50].map((z) => (
              <button
                key={z}
                className="kachel"
                style={{ minHeight: 64, alignItems: 'center', outline: ziel === z ? '2px solid var(--akzent)' : 'none' }}
                onClick={() => setZiel(z)}
                aria-pressed={ziel === z}
              >
                <span className="kachel__titel">{z}</span>
              </button>
            ))}
          </div>
        </section>
      )}

      {schritt === 2 && (
        <section className="abschnitt">
          <p className="untertitel">Welche Wahlqualifikation steht in deinem Ausbildungsvertrag fürs Fachgespräch?</p>
          <div className="liste">
            {WAHLQUALIFIKATIONEN.map((w) => (
              <button key={w.id} className="zeile" onClick={() => setWq(w.id)} aria-pressed={wq === w.id}>
                <span className="zeile__text">
                  <span className="zeile__titel">{w.name}</span>
                </span>
                {wq === w.id && <Icon name="haken" />}
              </button>
            ))}
            <button className="zeile" onClick={() => setWq(null)} aria-pressed={wq === null}>
              <span className="zeile__text">
                <span className="zeile__titel">Weiß ich noch nicht</span>
                <span className="zeile__info">Kannst du später in den Einstellungen ändern</span>
              </span>
              {wq === null && <Icon name="haken" />}
            </button>
          </div>
        </section>
      )}

      <div className="aktionsleiste">
        {schritt < 2 ? (
          <button className="knopf knopf--gross knopf--breit" onClick={() => setSchritt((s) => Math.min(2, s + 1))}>
            Weiter
          </button>
        ) : (
          <button className="knopf knopf--gross knopf--breit" onClick={fertig}>
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
