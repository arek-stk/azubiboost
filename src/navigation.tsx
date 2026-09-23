import { createContext, useCallback, useContext, useState, type ReactNode } from 'react'
import type { BereichId, ThemaId } from './domain/types'
import type { AufgabentypId } from './engine/rechenaufgaben'

export type Tab = 'heute' | 'lernen' | 'rechnen' | 'pruefung' | 'fortschritt'

export type Ansicht =
  | { name: Tab }
  | { name: 'thema'; thema: ThemaId }
  | { name: 'quiz'; titel: string; frageIds: string[] }
  | { name: 'rechenaufgabe'; typId: AufgabentypId | 'gemischt' }
  | { name: 'formeln' }
  | { name: 'uebungszettel' }
  | { name: 'simulation'; bereich: BereichId }
  | { name: 'ergebnis'; versuchId: string }
  | { name: 'fachgespraech' }
  | { name: 'einstellungen' }
  | { name: 'hilfe' }
  | { name: 'lernplan' }

type NavKontext = {
  aktuell: Ansicht
  tab: Tab
  gehe: (a: Ansicht) => void
  zurueck: () => void
  /** Ersetzt die aktuelle Ansicht — Zurück führt dann nicht mehr dorthin. */
  ersetze: (a: Ansicht) => void
  wechsleTab: (t: Tab) => void
  kannZurueck: boolean
}

const Kontext = createContext<NavKontext | null>(null)

const TABS: readonly string[] = ['heute', 'lernen', 'rechnen', 'pruefung', 'fortschritt']
const istTab = (a: Ansicht): a is { name: Tab } => TABS.includes(a.name)

export function NavigationProvider({ children }: { children: ReactNode }) {
  const [stapel, setStapel] = useState<Ansicht[]>([{ name: 'heute' }])

  const nachOben = () => window.scrollTo({ top: 0 })

  const gehe = useCallback((a: Ansicht) => {
    setStapel((s) => [...s, a])
    nachOben()
  }, [])

  const zurueck = useCallback(() => {
    setStapel((s) => (s.length > 1 ? s.slice(0, -1) : s))
    nachOben()
  }, [])

  const ersetze = useCallback((a: Ansicht) => {
    setStapel((s) => [...s.slice(0, -1), a])
    nachOben()
  }, [])

  const wechsleTab = useCallback((t: Tab) => {
    setStapel([{ name: t }])
    nachOben()
  }, [])

  const aktuell = stapel[stapel.length - 1] ?? { name: 'heute' }
  const unterster = stapel[0]
  const tab: Tab = unterster !== undefined && istTab(unterster) ? unterster.name : 'heute'

  return (
    <Kontext.Provider
      value={{ aktuell, tab, gehe, zurueck, ersetze, wechsleTab, kannZurueck: stapel.length > 1 }}
    >
      {children}
    </Kontext.Provider>
  )
}

export function useNavigation(): NavKontext {
  const k = useContext(Kontext)
  if (k === null) throw new Error('useNavigation außerhalb von NavigationProvider')
  return k
}

export function istTabAnsicht(a: Ansicht): boolean {
  return istTab(a)
}
