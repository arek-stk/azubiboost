import { useRef, useState } from 'react'
import { Kopf } from '../components/ui'
import { WAHLQUALIFIKATIONEN } from '../data/fachgespraech'
import { VORNAME_VORBELEGUNG } from '../data/persoenlich'
import { heute } from '../engine/datum'
import { alsBackup, ausBackup } from '../store/persist'
import { useStore } from '../store/useStore'

const TAGESZIELE = [10, 20, 30, 50]

/** Läuft die App als installierte Home-Bildschirm-App oder in einem Browser-Tab? */
function istInstalliert(): boolean {
  const iosStandalone = (navigator as Navigator & { standalone?: boolean }).standalone === true
  return iosStandalone || window.matchMedia('(display-mode: standalone)').matches
}

async function teileOderLadeHerunter(inhalt: string, dateiname: string) {
  const datei = new File([inhalt], dateiname, { type: 'application/json' })
  // Auf dem iPhone öffnet das Teilen-Menü — von dort in Dateien, Mail oder AirDrop.
  if (navigator.canShare?.({ files: [datei] })) {
    try {
      await navigator.share({ files: [datei], title: 'Lern-Backup' })
      return
    } catch {
      // Abgebrochen oder nicht erlaubt: auf Download ausweichen.
    }
  }
  const url = URL.createObjectURL(datei)
  const a = document.createElement('a')
  a.href = url
  a.download = dateiname
  a.click()
  URL.revokeObjectURL(url)
}

export function Einstellungen() {
  const { zustand, dispatch } = useStore()
  const e = zustand.einstellungen
  const [meldung, setMeldung] = useState<string | null>(null)
  const dateiEingabe = useRef<HTMLInputElement>(null)

  const exportieren = () => {
    void teileOderLadeHerunter(alsBackup(zustand), `lernapp-backup-${heute()}.json`)
  }

  const importieren = async (datei: File | undefined) => {
    if (datei === undefined) return
    try {
      const neu = ausBackup(await datei.text())
      if (!window.confirm('Backup einspielen? Der aktuelle Lernstand wird dadurch ersetzt.')) return
      dispatch({ typ: 'ersetzen', zustand: neu })
      setMeldung('Backup eingespielt.')
    } catch (fehler) {
      setMeldung(fehler instanceof Error ? fehler.message : 'Die Datei konnte nicht gelesen werden.')
    }
  }

  const zuruecksetzen = () => {
    if (window.confirm('Wirklich den gesamten Lernfortschritt löschen? Das lässt sich nicht rückgängig machen.')) {
      dispatch({ typ: 'zuruecksetzen', tag: heute() })
      setMeldung('Lernfortschritt zurückgesetzt. Name und Termin bleiben erhalten.')
    }
  }

  return (
    <>
      <Kopf titel="Einstellungen" klein />

      {!istInstalliert() && (
        <section className="karte">
          <h3>Zum Home-Bildschirm hinzufügen</h3>
          <p>
            In Safari unten auf <strong>Teilen</strong> tippen und <strong>„Zum Home-Bildschirm"</strong> wählen. Nur dann bleibt
            dein Fortschritt dauerhaft gespeichert. In einem normalen Browser-Tab löscht iOS die Daten nach einer Woche
            ohne Nutzung.
          </p>
        </section>
      )}

      <section className="abschnitt">
        <h2>Persönlich</h2>
        <div className="liste">
          {VORNAME_VORBELEGUNG === null && (
            <label className="zeile">
              <span className="zeile__text">Vorname</span>
              <input
                className="feld-inline"
                type="text"
                value={e.name ?? ''}
                placeholder="optional"
                autoComplete="given-name"
                maxLength={30}
                onChange={(ev) =>
                  dispatch({
                    typ: 'einstellungenGeaendert',
                    aenderung: { name: ev.target.value.trim() === '' ? null : ev.target.value },
                  })
                }
              />
            </label>
          )}

          <label className="zeile">
            <span className="zeile__text">Schriftliche Prüfung</span>
            <input
              className="feld-inline"
              type="date"
              value={e.pruefungstermin ?? ''}
              onChange={(ev) =>
                dispatch({
                  typ: 'einstellungenGeaendert',
                  aenderung: { pruefungstermin: ev.target.value === '' ? null : ev.target.value },
                })
              }
            />
          </label>

          <label className="zeile">
            <span className="zeile__text">Tagesziel</span>
            <select
              className="feld-inline"
              value={e.tagesziel}
              onChange={(ev) => dispatch({ typ: 'einstellungenGeaendert', aenderung: { tagesziel: Number(ev.target.value) } })}
            >
              {TAGESZIELE.map((z) => (
                <option key={z} value={z}>
                  {z} Fragen
                </option>
              ))}
            </select>
          </label>

          <label className="zeile">
            <span className="zeile__text">Wahlqualifikation</span>
            <select
              className="feld-inline"
              value={e.wahlqualifikation ?? ''}
              onChange={(ev) =>
                dispatch({
                  typ: 'einstellungenGeaendert',
                  aenderung: { wahlqualifikation: ev.target.value === '' ? null : ev.target.value },
                })
              }
            >
              <option value="">Nicht gewählt</option>
              {WAHLQUALIFIKATIONEN.map((w) => (
                <option key={w.id} value={w.id}>
                  {w.name}
                </option>
              ))}
            </select>
          </label>
        </div>
        <p className="untertitel" style={{ fontSize: 13, padding: '0 4px' }}>
          Teil 2 bei der IHK Niederbayern ist am 28. April 2027. Die mündliche Prüfung folgt zwischen Mitte Juni und Juli.
        </p>
      </section>

      <section className="abschnitt">
        <h2>Lernen</h2>
        <div className="liste">
          <label className="zeile">
            <span className="zeile__text">
              <span className="zeile__titel">Erst selbst überlegen</span>
              <span className="zeile__info">Im Quiz erscheinen die Antworten erst nach einem Tipp.</span>
            </span>
            <input
              className="schalter"
              type="checkbox"
              role="switch"
              checked={e.erstUeberlegen}
              onChange={(ev) => dispatch({ typ: 'einstellungenGeaendert', aenderung: { erstUeberlegen: ev.target.checked } })}
            />
          </label>
        </div>
      </section>

      <section className="abschnitt">
        <h2>Sicherung</h2>
        <div className="karte">
          <p className="untertitel">
            Alles bleibt auf diesem Gerät, es gibt keinen Server. Mit einem Backup nimmst du deinen Fortschritt auf ein
            neues Handy mit.
          </p>
          <button className="knopf knopf--zweit knopf--breit" onClick={exportieren}>
            Backup speichern
          </button>
          <button className="knopf knopf--zweit knopf--breit" onClick={() => dateiEingabe.current?.click()}>
            Backup einspielen
          </button>
          <input
            ref={dateiEingabe}
            type="file"
            accept="application/json,.json"
            hidden
            onChange={(ev) => void importieren(ev.target.files?.[0])}
          />
          {meldung !== null && <p aria-live="polite">{meldung}</p>}
        </div>
      </section>

      <section className="abschnitt">
        <h2>Über die App</h2>
        <div className="karte">
          <p>
            Die Fragen sind <strong>eigene Übungsaufgaben</strong>, ausgerichtet an der Ausbildungsordnung
            (VerkEHKflAusbV 2017). Echte IHK-Prüfungsaufgaben sind es nicht. Prüfungszeiten, Gewichtung, Notenschlüssel und
            Bestehensregeln entsprechen der Verordnung.
          </p>
          <p className="untertitel" style={{ fontSize: 13 }}>
            Verbindlich ist immer die Auskunft deiner IHK. Fehler gefunden? Die Frage-ID steht unter jeder Erklärung.
          </p>
        </div>
      </section>

      <button className="knopf knopf--gefahr knopf--breit" onClick={zuruecksetzen}>
        Lernfortschritt zurücksetzen
      </button>
    </>
  )
}
