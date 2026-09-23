import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'

type Meldung = { symbol: string; titel: string; text: string }
type FeierKontext = { feiere: (meldung?: Meldung) => void }

const Kontext = createContext<FeierKontext | null>(null)

const FARBEN = ['#c0396a', '#e0607a', '#f4a58a', '#e7a93b', '#b59bff', '#fbe6ed']
const ANZAHL = 70

function wenigerBewegung(): boolean {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

function Konfetti() {
  // Werte einmal beim Einblenden festlegen, damit nichts bei Re-Renders springt.
  const teile = useMemo(
    () =>
      Array.from({ length: ANZAHL }, (_, i) => ({
        links: `${Math.random() * 100}%`,
        farbe: FARBEN[i % FARBEN.length],
        stil: {
          '--dauer': `${1.8 + Math.random() * 1.4}s`,
          '--verzoegerung': `${Math.random() * 0.35}s`,
          '--drift': `${(Math.random() - 0.5) * 160}px`,
          '--drehung': `${Math.random() * 720 - 360}deg`,
        },
      })),
    [],
  )
  return (
    <div className="konfetti" aria-hidden="true">
      {teile.map((t, i) => (
        <span key={i} style={{ left: t.links, background: t.farbe, ...t.stil } as React.CSSProperties} />
      ))}
    </div>
  )
}

export function FeierProvider({ children }: { children: ReactNode }) {
  const [konfettiId, setKonfettiId] = useState(0)
  const [meldung, setMeldung] = useState<Meldung | null>(null)

  const feiere = useCallback((m?: Meldung) => {
    if (!wenigerBewegung()) setKonfettiId((n) => n + 1)
    if (m !== undefined) setMeldung(m)
  }, [])

  useEffect(() => {
    if (konfettiId === 0) return
    const t = setTimeout(() => setKonfettiId(0), 3500)
    return () => clearTimeout(t)
  }, [konfettiId])

  useEffect(() => {
    if (meldung === null) return
    const t = setTimeout(() => setMeldung(null), 4500)
    return () => clearTimeout(t)
  }, [meldung])

  return (
    <Kontext.Provider value={{ feiere }}>
      {children}
      {konfettiId > 0 && <Konfetti key={konfettiId} />}
      {meldung !== null && (
        <div className="toast" role="status" onClick={() => setMeldung(null)}>
          <span className="toast__symbol" aria-hidden="true">
            {meldung.symbol}
          </span>
          <span>
            <strong>{meldung.titel}</strong>
            <br />
            <span className="untertitel">{meldung.text}</span>
          </span>
        </div>
      )}
    </Kontext.Provider>
  )
}

export function useFeier(): FeierKontext {
  const k = useContext(Kontext)
  if (k === null) throw new Error('useFeier außerhalb von FeierProvider')
  return k
}
