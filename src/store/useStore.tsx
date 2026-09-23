import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  type Dispatch,
  type ReactNode,
} from 'react'
import { heute } from '../engine/datum'
import { VORNAME_VORBELEGUNG } from '../data/persoenlich'
import { laden, speichern, type AppZustand } from './persist'
import { reducer, type Aktion } from './reducer'

type StoreKontext = { zustand: AppZustand; dispatch: Dispatch<Aktion> }

const Kontext = createContext<StoreKontext | null>(null)

export function StoreProvider({ children }: { children: ReactNode }) {
  const [zustand, dispatch] = useReducer(reducer, undefined, () => {
    const z = laden()
    // Vorbelegung des Namens nur auf einem ganz neuen Gerät, nie über eine eigene Eingabe hinweg.
    if (!z.einstellungen.onboardingFertig && z.einstellungen.name === null && VORNAME_VORBELEGUNG !== null) {
      return { ...z, einstellungen: { ...z.einstellungen, name: VORNAME_VORBELEGUNG } }
    }
    return z
  })

  useEffect(() => {
    speichern(zustand)
  }, [zustand])

  return <Kontext.Provider value={{ zustand, dispatch }}>{children}</Kontext.Provider>
}

export function useStore(): StoreKontext {
  const k = useContext(Kontext)
  if (k === null) throw new Error('useStore außerhalb von StoreProvider')
  return k
}

/** Heute beantwortete Fragen — nach Mitternacht automatisch wieder 0. */
export function heuteBeantwortet(z: AppZustand): number {
  return z.heute.tag === heute() ? z.heute.beantwortet : 0
}
