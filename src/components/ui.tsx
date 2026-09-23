import type { ReactNode } from 'react'
import { useNavigation } from '../navigation'
import { Icon } from './Icon'

export function Kopf({
  titel,
  klein = false,
  rechts,
}: {
  titel: string
  klein?: boolean
  rechts?: ReactNode
}) {
  const { kannZurueck, zurueck } = useNavigation()
  return (
    <header className={klein ? 'kopf kopf--klein' : 'kopf'}>
      {kannZurueck && (
        <button className="zurueck" onClick={zurueck} aria-label="Zurück">
          <Icon name="zurueck" />
        </button>
      )}
      <h1>{titel}</h1>
      {rechts}
    </header>
  )
}

/** Stufe für Farbgebung: ab 67 % befriedigend, ab 50 % ausreichend (IHK-Grenzen). */
export function stufe(quote: number | null): 'gut' | 'mittel' | 'schlecht' | null {
  if (quote === null) return null
  if (quote >= 0.67) return 'gut'
  if (quote >= 0.5) return 'mittel'
  return 'schlecht'
}

export function Balken({ wert, farbe }: { wert: number; farbe?: 'gut' | 'mittel' | 'schlecht' | null }) {
  const prozent = Math.round(Math.min(1, Math.max(0, wert)) * 100)
  return (
    <div className="balken" role="progressbar" aria-valuenow={prozent} aria-valuemin={0} aria-valuemax={100}>
      <div
        className={farbe ? `balken__fuellung balken__fuellung--${farbe}` : 'balken__fuellung'}
        style={{ width: `${prozent}%` }}
      />
    </div>
  )
}

export function Ring({
  wert,
  groesse = 120,
  dicke = 12,
  children,
}: {
  wert: number
  groesse?: number
  dicke?: number
  children?: ReactNode
}) {
  const r = (groesse - dicke) / 2
  const umfang = 2 * Math.PI * r
  const anteil = Math.min(1, Math.max(0, wert))
  return (
    <div style={{ position: 'relative', width: groesse, height: groesse, flexShrink: 0 }}>
      <svg className="ring" width={groesse} height={groesse} aria-hidden="true">
        <circle className="ring__spur" cx={groesse / 2} cy={groesse / 2} r={r} strokeWidth={dicke} fill="none" />
        <circle
          className="ring__wert"
          cx={groesse / 2}
          cy={groesse / 2}
          r={r}
          strokeWidth={dicke}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={umfang}
          strokeDashoffset={umfang * (1 - anteil)}
          transform={`rotate(-90 ${groesse / 2} ${groesse / 2})`}
        />
      </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', textAlign: 'center' }}>
        {children}
      </div>
    </div>
  )
}

export function Plakette({ children, art }: { children: ReactNode; art?: 'gut' | 'mittel' | 'schlecht' | null }) {
  return <span className={art ? `plakette plakette--${art}` : 'plakette'}>{children}</span>
}

export function prozentText(quote: number | null): string {
  return quote === null ? '–' : `${Math.round(quote * 100)} %`
}
