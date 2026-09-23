import { useMemo } from 'react'
import { Icon, type IconName } from '../components/Icon'
import { Balken, Plakette, Ring, prozentText, stufe } from '../components/ui'
import { FRAGEN } from '../data/fragen'
import { BESTEHENSGRENZE, PRUEFUNGSBEREICHE, bereich } from '../domain/pruefung'
import { heute } from '../engine/datum'
import {
  bereichsStatistik,
  notenschaetzung,
  punkteProBereich,
  streak,
  themenStatistik,
  verlauf,
} from '../engine/statistik'
import { ERFOLGE } from '../engine/erfolge'
import { useNavigation } from '../navigation'
import { useStore } from '../store/useStore'

export function Fortschritt() {
  const { zustand } = useStore()
  const { gehe } = useNavigation()
  const tag = heute()

  const themen = useMemo(() => themenStatistik(FRAGEN, zustand.karten), [zustand.karten])
  const bereiche = useMemo(() => bereichsStatistik(themen), [themen])
  const prognose = useMemo(
    () => notenschaetzung(zustand.versuche, zustand.fachgespraechSelbst ?? undefined),
    [zustand.versuche, zustand.fachgespraechSelbst],
  )
  const simPunkte = useMemo(() => punkteProBereich(zustand.versuche), [zustand.versuche])
  const tage = useMemo(() => verlauf(zustand.versuche, 30, tag), [zustand.versuche, tag])

  const gesehen = Object.keys(zustand.karten).filter((id) => FRAGEN.some((f) => f.id === id)).length
  const antworten = themen.reduce((s, t) => s + t.beantwortet, 0)
  const gesamtFortschritt =
    FRAGEN.length === 0 ? 0 : themen.reduce((s, t) => s + t.fortschritt * t.anzahlFragen, 0) / FRAGEN.length
  const maxAnzahl = Math.max(1, ...tage.map((t) => t.anzahl))

  return (
    <>
      <header className="kopf">
        <h1>Fortschritt</h1>
      </header>

      <section className="karte" style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
        <Ring wert={gesamtFortschritt} groesse={110} dicke={11}>
          <div className="zahl" style={{ fontSize: 24, fontWeight: 750 }}>
            {Math.round(gesamtFortschritt * 100)} %
          </div>
        </Ring>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <strong>Prüfungsfortschritt</strong>
          <span className="untertitel">
            {gesehen} von {FRAGEN.length} Fragen geübt
          </span>
          <span className="untertitel">{antworten} Antworten insgesamt</span>
          <span className="untertitel">{streak(zustand.tageMitZiel, tag)} Tage Serie</span>
        </div>
      </section>

      <section className="abschnitt">
        <h2>
          Erfolge · {zustand.erfolge.length} von {ERFOLGE.length}
        </h2>
        <div className="abzeichen-raster">
          {ERFOLGE.map((e) => {
            const hat = zustand.erfolge.includes(e.id)
            return (
              <div key={e.id} className={hat ? 'abzeichen' : 'abzeichen abzeichen--gesperrt'} title={e.beschreibung}>
                <span className="abzeichen__symbol" aria-hidden="true">
                  <Icon name={e.symbol as IconName} groesse={30} />
                </span>
                <span className="abzeichen__titel">{e.titel}</span>
                <span className="nur-screenreader">{hat ? 'erreicht' : 'noch offen'}: {e.beschreibung}</span>
              </div>
            )
          })}
        </div>
      </section>

      <section className="abschnitt">
        <h2>Notenprognose</h2>
        <div className="karte">
          {prognose.abgedeckteGewichtung === 0 ? (
            <p>
              Noch keine Prognose möglich. Mach eine Prüfungssimulation — am besten zuerst Geschäftsprozesse, das ist
              dein Teil 2.
            </p>
          ) : (
            <>
              <p style={{ fontSize: 22, fontWeight: 700 }}>
                {prognose.punkte} Punkte · Note {prognose.note.note} ({prognose.note.wort})
              </p>
              <p className="untertitel">
                Grundlage: {prognose.abgedeckteGewichtung} % der Gesamtgewichtung
                {prognose.vollstaendig ? '' : ' — die übrigen Bereiche fehlen noch'}.
                {zustand.fachgespraechSelbst !== null ? ' Das Fachgespräch ist eine Selbsteinschätzung.' : ''}
              </p>
            </>
          )}
          <div className="liste" style={{ boxShadow: 'none', background: 'var(--bg)' }}>
            {PRUEFUNGSBEREICHE.map((b) => {
              const p =
                b.id === 'fachgespraech' ? (zustand.fachgespraechSelbst ?? undefined) : simPunkte[b.id as keyof typeof simPunkte]
              const ok = p !== undefined && p >= BESTEHENSGRENZE
              return (
                <div key={b.id} className="zeile">
                  <span className="zeile__text">
                    <span className="zeile__titel">
                      {b.kurz} {b.sperrfach && <Plakette art="mittel">Sperrfach</Plakette>}
                    </span>
                    <span className="zeile__info">
                      Teil {b.teil} · {b.gewicht} %
                    </span>
                  </span>
                  {p === undefined ? (
                    <Plakette>offen</Plakette>
                  ) : (
                    <Plakette art={ok ? 'gut' : 'schlecht'}>{p} Pkt</Plakette>
                  )}
                </div>
              )
            })}
          </div>
          <button className="knopf knopf--zweit knopf--breit" onClick={() => gehe({ name: 'simulation', bereich: 'geschaeftsprozesse' })}>
            Simulation Geschäftsprozesse
          </button>
        </div>
      </section>

      <section className="abschnitt">
        <h2>Letzte 30 Tage</h2>
        <div className="karte">
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 3, height: 80 }} aria-label="Übungseinheiten pro Tag">
            {tage.map((t) => (
              <div
                key={t.tag}
                title={`${t.tag}: ${t.anzahl} Einheiten${t.anzahl > 0 ? `, Ø ${t.punkte} %` : ''}`}
                style={{
                  flex: 1,
                  height: `${Math.max(4, (t.anzahl / maxAnzahl) * 100)}%`,
                  borderRadius: 3,
                  background:
                    t.anzahl === 0
                      ? 'var(--bg-gedrueckt)'
                      : t.punkte >= 67
                        ? 'var(--gut)'
                        : t.punkte >= 50
                          ? 'var(--mittel)'
                          : 'var(--schlecht)',
                }}
              />
            ))}
          </div>
          <p className="untertitel" style={{ fontSize: 13 }}>
            Höhe = Übungseinheiten, Farbe = Trefferquote. Grün ab 67 %, gelb ab 50 %.
          </p>
        </div>
      </section>

      <section className="abschnitt">
        <h2>Nach Prüfungsbereich</h2>
        <div className="liste">
          {bereiche.map((b) => (
            <div key={b.bereich} className="zeile">
              <span className="zeile__text">
                <span className="zeile__titel">{bereich(b.bereich).kurz}</span>
                <Balken wert={b.quote ?? 0} farbe={stufe(b.quote)} />
              </span>
              <Plakette art={stufe(b.quote)}>{prozentText(b.quote)}</Plakette>
            </div>
          ))}
        </div>
      </section>

      <section className="abschnitt">
        <h2>Alle Themen — schwächste zuerst</h2>
        <div className="liste">
          {[...themen]
            .sort((a, b) => (a.quote ?? 2) - (b.quote ?? 2))
            .map((t) => (
              <button key={t.thema} className="zeile" onClick={() => gehe({ name: 'thema', thema: t.thema })}>
                <span className="zeile__text">
                  <span className="zeile__titel">{t.name}</span>
                  <Balken wert={t.quote ?? 0} farbe={stufe(t.quote)} />
                </span>
                <Plakette art={stufe(t.quote)}>{prozentText(t.quote)}</Plakette>
              </button>
            ))}
        </div>
      </section>
    </>
  )
}
