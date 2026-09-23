import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react'
import { Icon, type IconName } from './Icon'

/**
 * Kleine, ruhige Anerkennung: eine Meldung, die kurz einfährt und wieder geht.
 * Bewusst ohne Konfetti — wer Rechnen als stressig erlebt, soll nie das Gefühl
 * bekommen, dass gerade etwas Lautes oder Dringendes passiert.
 */

type Meldung = { symbol: string; titel: string; text: string }
type FeierKontext = { feiere: (meldung: Meldung) => void }

const Kontext = createContext<FeierKontext | null>(null)

export function FeierProvider({ children }: { children: ReactNode }) {
  const [meldung, setMeldung] = useState<Meldung | null>(null)
  const feiere = useCallback((m: Meldung) => setMeldung(m), [])

  useEffect(() => {
    if (meldung === null) return
    const t = setTimeout(() => setMeldung(null), 4500)
    return () => clearTimeout(t)
  }, [meldung])

  return (
    <Kontext.Provider value={{ feiere }}>
      {children}
      {meldung !== null && (
        <div className="toast" role="status" onClick={() => setMeldung(null)}>
          <span className="toast__symbol" aria-hidden="true">
            <Icon name={meldung.symbol as IconName} groesse={26} />
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
