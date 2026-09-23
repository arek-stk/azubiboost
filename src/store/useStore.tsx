import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  type Dispatch,
  type ReactNode,
} from 'react'
import { heute } from '../engine/datum'
import { laden, speichern, type AppZustand } from './persist'
import { reducer, type Aktion } from './reducer'

type StoreKontext = { zustand: AppZustand; dispatch: Dispatch<Aktion> }

const Kontext = createContext<StoreKontext | null>(null)

export function StoreProvider({ children }: { children: ReactNode }) {
  const [zustand, dispatch] = useReducer(reducer, undefined, () => laden())

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
