import { Icon } from '../components/Icon'
import { Kopf, Plakette } from '../components/ui'
import { QUELLEN } from '../data/lernquellen'

/** Gute Quellen und echte Hilfe außerhalb der App — alles kostenlos. */
export function Hilfe() {
  return (
    <>
      <Kopf titel="Hilfe & Lernquellen" klein />
      <p className="untertitel">
        Manchmal hilft eine andere Erklärung oder ein Mensch, der es dir zeigt. Die Links öffnen sich im Browser und
        brauchen Internet.
      </p>

      {QUELLEN.map((g) => (
        <section className="abschnitt" key={g.titel}>
          <h2>{g.titel}</h2>
          <p className="untertitel" style={{ padding: '0 4px', fontSize: 15 }}>
            {g.einleitung}
          </p>
          <div className="liste">
            {g.quellen.map((q) => (
              <a key={q.url} className="zeile" href={q.url} target="_blank" rel="noopener noreferrer">
                <span className="zeile__text">
                  <span className="zeile__titel">{q.titel}</span>
                  <span className="zeile__info">{q.wer}</span>
                  <span className="zeile__info" style={{ color: 'var(--text)' }}>
                    {q.warum}
                  </span>
                  <span>
                    <Plakette>{q.art}</Plakette>
                  </span>
                </span>
                <span className="pfeil">
                  <Icon name="weiter" />
                </span>
              </a>
            ))}
          </div>
        </section>
      ))}

      <section className="karte">
        <h3>Frag die Menschen um dich herum</h3>
        <p>
          Deine Ausbilderin oder dein Ausbilder und die Lehrkräfte in der Berufsschule wissen, was in der Prüfung
          drankommt, und dürfen dir helfen. Frag konkret: „Können wir die Kalkulation einmal gemeinsam an einem echten
          Artikel aus dem Markt durchrechnen?"
        </p>
      </section>
    </>
  )
}
