import { useMemo, useState } from 'react'
import { Icon } from '../components/Icon'
import { Kopf } from '../components/ui'
import { APP_NAME } from '../data/persoenlich'
import { deutschesDatum, heute } from '../engine/datum'
import { eur, zahl } from '../engine/format'
import { AUFGABENTYPEN, type RechenAufgabe } from '../engine/rechenaufgaben'
import { mische, rngMitSeed } from '../engine/zufall'

const ANZAHL = 8

function erzeugeZettel(seed: number): RechenAufgabe[] {
  const rng = rngMitSeed(seed)
  return mische(rng, AUFGABENTYPEN)
    .slice(0, ANZAHL)
    .map((t) => t.erzeuge(rng))
}

function loesung(a: RechenAufgabe): string {
  return a.loesung.einheit === '€' ? eur(a.loesung.wert) : `${zahl(a.loesung.wert, 3)} ${a.loesung.einheit}`.trim()
}

/** Druckbarer Übungszettel: Seite 1 Aufgaben, Seite 2 Lösungen mit Rechenweg. */
export function Uebungszettel() {
  const [seed, setSeed] = useState(() => Date.now() % 2_147_483_647)
  const aufgaben = useMemo(() => erzeugeZettel(seed), [seed])

  return (
    <>
      <div className="nicht-drucken">
        <Kopf titel="Übungszettel" klein />
        <p className="untertitel">
          {ANZAHL} Aufgaben zum Rechnen am Tisch. Die Lösungen kommen beim Drucken auf eine eigene
          Seite. Dreh sie erst um, wenn alles gerechnet ist.
        </p>
        <div className="knopf-reihe" style={{ marginTop: 12 }}>
          <button className="knopf" onClick={() => window.print()}>
            <Icon name="drucker" groesse={20} /> Drucken
          </button>
          <button className="knopf knopf--zweit" onClick={() => setSeed((s) => (s * 48271) % 2_147_483_647)}>
            Neue Zahlen
          </button>
        </div>
      </div>

      <article className="zettel">
        <header className="zettel__kopf">
          <strong>{APP_NAME} · Übungszettel Kalkulation und Warenwirtschaft</strong>
          <span>{deutschesDatum(heute())} · Nr. {seed % 10000}</span>
        </header>
        <ol className="zettel__liste">
          {aufgaben.map((a, i) => (
            <li key={i} className="zettel__aufgabe">
              <p>
                <strong>{a.titel}.</strong> {a.frage}
              </p>
              <ul>
                {a.gegeben.map((g) => (
                  <li key={g.label}>
                    {g.label}: <strong>{g.wert}</strong>
                  </li>
                ))}
              </ul>
              <div className="zettel__platz" aria-hidden="true" />
            </li>
          ))}
        </ol>

        <section className="zettel__loesungen">
          <h2>Lösungen</h2>
          <ol className="zettel__liste">
            {aufgaben.map((a, i) => (
              <li key={i}>
                <p>
                  <strong>{a.titel}: {loesung(a)}</strong>
                </p>
                <ul>
                  {a.rechenweg.map((s, j) => (
                    <li key={j}>
                      {s.rechnung} → {s.ergebnis}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ol>
        </section>
      </article>
    </>
  )
}
