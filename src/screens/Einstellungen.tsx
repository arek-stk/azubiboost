import { useRef, useState } from 'react'
import { Kopf } from '../components/ui'
import { WAHLQUALIFIKATIONEN } from '../data/fachgespraech'
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
      await navigator.share({ files: [datei], title: 'AzubiBoost Backup' })
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
    void teileOderLadeHerunter(alsBackup(zustand), `azubiboost-backup-${heute()}.json`)
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
        <section className="karte" style={{ background: 'var(--mittel-weich)', boxShadow: 'none' }}>
          <h3>Zum Home-Bildschirm hinzufügen</h3>
          <p>
            In Safari unten auf <strong>Teilen</strong> tippen und <strong>„Zum Home-Bildschirm"</strong> wählen. Erst
            dann bleibt dein Fortschritt dauerhaft gespeichert — im normalen Browser-Tab löscht iOS die Daten nach
            einer Woche ohne Nutzung.
          </p>
        </section>
      )}

      <section className="abschnitt">
        <h2>Persönlich</h2>
        <div className="karte">
          <label className="abschnitt" style={{ gap: 4 }}>
            <span className="untertitel">Vorname (für den Lerncoach)</span>
            <input
              type="text"
              value={e.name ?? ''}
              autoComplete="given-name"
              maxLength={30}
              onChange={(ev) =>
                dispatch({
                  typ: 'einstellungenGeaendert',
                  aenderung: { name: ev.target.value.trim() === '' ? null : ev.target.value },
                })
              }
              style={feldStil}
            />
          </label>

          <label className="abschnitt" style={{ gap: 4 }}>
            <span className="untertitel">Termin der schriftlichen Prüfung</span>
            <input
              type="date"
              value={e.pruefungstermin ?? ''}
              onChange={(ev) =>
                dispatch({
                  typ: 'einstellungenGeaendert',
                  aenderung: { pruefungstermin: ev.target.value === '' ? null : ev.target.value },
                })
              }
              style={feldStil}
            />
            <span className="untertitel" style={{ fontSize: 13 }}>
              Voreingestellt ist Teil 2 bei der IHK Niederbayern: 28. April 2027. Die mündliche Prüfung folgt Mitte Juni bis Juli.
            </span>
          </label>

          <label className="abschnitt" style={{ gap: 4 }}>
            <span className="untertitel">Tagesziel</span>
            <select
              value={e.tagesziel}
              onChange={(ev) => dispatch({ typ: 'einstellungenGeaendert', aenderung: { tagesziel: Number(ev.target.value) } })}
              style={feldStil}
            >
              {TAGESZIELE.map((z) => (
                <option key={z} value={z}>
                  {z} Fragen am Tag
                </option>
              ))}
            </select>
          </label>

          <label className="abschnitt" style={{ gap: 4 }}>
            <span className="untertitel">Wahlqualifikation fürs Fachgespräch</span>
            <select
              value={e.wahlqualifikation ?? ''}
              onChange={(ev) =>
                dispatch({
                  typ: 'einstellungenGeaendert',
                  aenderung: { wahlqualifikation: ev.target.value === '' ? null : ev.target.value },
                })
              }
              style={feldStil}
            >
              <option value="">Noch nicht gewählt</option>
              {WAHLQUALIFIKATIONEN.map((w) => (
                <option key={w.id} value={w.id}>
                  {w.name}
                </option>
              ))}
            </select>
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
            (VerkEHKflAusbV 2017) — keine echten IHK-Prüfungsaufgaben. Prüfungszeiten, Gewichtung, Notenschlüssel und
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

const feldStil = {
  width: '100%',
  minHeight: 48,
  padding: '10px 12px',
  borderRadius: 10,
  border: '1px solid var(--linie)',
  background: 'var(--bg)',
} as const
