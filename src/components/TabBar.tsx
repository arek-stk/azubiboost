import { useNavigation, type Tab } from '../navigation'
import { Icon, type IconName } from './Icon'

const TABS: { tab: Tab; label: string; icon: IconName }[] = [
  { tab: 'heute', label: 'Heute', icon: 'heute' },
  { tab: 'lernen', label: 'Lernen', icon: 'lernen' },
  { tab: 'rechnen', label: 'Rechnen', icon: 'rechnen' },
  { tab: 'pruefung', label: 'Prüfung', icon: 'pruefung' },
  { tab: 'fortschritt', label: 'Fortschritt', icon: 'fortschritt' },
]

export function TabBar() {
  const { tab, wechsleTab } = useNavigation()
  return (
    <nav className="tabbar" aria-label="Hauptnavigation">
      <div className="tabbar__innen">
        {TABS.map((t) => (
          <button
            key={t.tab}
            className="tab"
            aria-current={tab === t.tab ? 'page' : undefined}
            onClick={() => wechsleTab(t.tab)}
          >
            <Icon name={t.icon} />
            {t.label}
          </button>
        ))}
      </div>
    </nav>
  )
}
