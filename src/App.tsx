import { FeierProvider } from './components/Feier'
import { TabBar } from './components/TabBar'
import { ErfolgMelder } from './store/ErfolgMelder'
import { NavigationProvider, istTabAnsicht, useNavigation } from './navigation'
import { StoreProvider, useStore } from './store/useStore'
import { Onboarding } from './screens/Onboarding'
import { Einstellungen } from './screens/Einstellungen'
import { Ergebnis } from './screens/Ergebnis'
import { Fachgespraech } from './screens/Fachgespraech'
import { Formeln } from './screens/Formeln'
import { Fortschritt } from './screens/Fortschritt'
import { Heute } from './screens/Heute'
import { Hilfe } from './screens/Hilfe'
import { Lernen } from './screens/Lernen'
import { Lernplan } from './screens/Lernplan'
import { Pruefung } from './screens/Pruefung'
import { Quiz } from './screens/Quiz'
import { RechenAufgabe } from './screens/RechenAufgabe'
import { Rechnen } from './screens/Rechnen'
import { Simulation } from './screens/Simulation'
import { ThemaSeite } from './screens/ThemaSeite'
import { Uebungszettel } from './screens/Uebungszettel'

function Ansicht() {
  const { aktuell } = useNavigation()

  switch (aktuell.name) {
    case 'heute':
      return <Heute />
    case 'lernen':
      return <Lernen />
    case 'rechnen':
      return <Rechnen />
    case 'pruefung':
      return <Pruefung />
    case 'fortschritt':
      return <Fortschritt />
    case 'thema':
      return <ThemaSeite thema={aktuell.thema} />
    case 'quiz':
      // key erzwingt einen frischen Zustand, wenn direkt ein neues Quiz startet
      return <Quiz key={aktuell.frageIds.join()} titel={aktuell.titel} frageIds={aktuell.frageIds} />
    case 'rechenaufgabe':
      return <RechenAufgabe key={aktuell.typId} typId={aktuell.typId} />
    case 'formeln':
      return <Formeln />
    case 'uebungszettel':
      return <Uebungszettel />
    case 'simulation':
      return <Simulation bereich={aktuell.bereich} />
    case 'ergebnis':
      return <Ergebnis versuchId={aktuell.versuchId} />
    case 'fachgespraech':
      return <Fachgespraech />
    case 'einstellungen':
      return <Einstellungen />
    case 'hilfe':
      return <Hilfe />
    case 'lernplan':
      return <Lernplan />
  }
}

function Rahmen() {
  const { aktuell } = useNavigation()
  const { zustand } = useStore()

  if (!zustand.einstellungen.onboardingFertig) {
    return (
      <main className="seite seite--ohne-tabbar">
        <Onboarding />
      </main>
    )
  }

  // Die Tab-Bar gehört zu den Hauptseiten; in Quiz, Simulation & Co. lenkt sie nur ab.
  const mitTabBar = istTabAnsicht(aktuell)
  return (
    <>
      <main className={mitTabBar ? 'seite' : 'seite seite--ohne-tabbar'}>
        <Ansicht />
      </main>
      {mitTabBar && <TabBar />}
    </>
  )
}

export function App() {
  return (
    <StoreProvider>
      <FeierProvider>
        <NavigationProvider>
          <Rahmen />
          <ErfolgMelder />
        </NavigationProvider>
      </FeierProvider>
    </StoreProvider>
  )
}
