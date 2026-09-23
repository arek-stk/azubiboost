import { Icon } from './Icon'

/** Deutsche Eingabe ("1.234,56" oder "1234,56") in eine Zahl umwandeln. */
export function eingabeAlsZahl(text: string): number | null {
  if (text.trim() === '' || text === ',') return null
  const n = Number(text.replace(/\./g, '').replace(',', '.'))
  return Number.isFinite(n) ? n : null
}

const MAX_STELLEN = 12
const MAX_NACHKOMMA = 3

/**
 * Eigener Ziffernblock statt Systemtastatur: kein Hineinzoomen, kein Springen
 * des Layouts, und das Komma sitzt da, wo man es auf einem deutschen
 * Taschenrechner erwartet.
 */
export function Ziffernblock({
  wert,
  onAendern,
  gesperrt = false,
}: {
  wert: string
  onAendern: (neu: string) => void
  gesperrt?: boolean
}) {
  const tippe = (zeichen: string) => {
    if (gesperrt) return
    if (zeichen === ',') {
      if (wert.includes(',')) return
      onAendern(wert === '' ? '0,' : `${wert},`)
      return
    }
    const [, nachkomma] = wert.split(',')
    if (nachkomma !== undefined && nachkomma.length >= MAX_NACHKOMMA) return
    if (wert.replace(',', '').length >= MAX_STELLEN) return
    onAendern(wert === '0' ? zeichen : wert + zeichen)
  }

  const loesche = () => {
    if (!gesperrt) onAendern(wert.slice(0, -1))
  }

  const tasten = ['1', '2', '3', '4', '5', '6', '7', '8', '9']

  return (
    <div className="ziffernblock" role="group" aria-label="Ziffernblock">
      {tasten.map((t) => (
        <button key={t} className="ziffer" onClick={() => tippe(t)} disabled={gesperrt}>
          {t}
        </button>
      ))}
      <button className="ziffer ziffer--neben" onClick={() => tippe(',')} disabled={gesperrt} aria-label="Komma">
        ,
      </button>
      <button className="ziffer" onClick={() => tippe('0')} disabled={gesperrt}>
        0
      </button>
      <button className="ziffer ziffer--neben" onClick={loesche} disabled={gesperrt} aria-label="Löschen">
        <Icon name="loeschen" />
      </button>
    </div>
  )
}

/** Eingabe mit Tausenderpunkten für die Anzeige formatieren. */
export function eingabeAnzeigen(text: string): string {
  const [ganz = '', nachkomma] = text.split(',')
  const mitPunkten = ganz.replace(/\B(?=(\d{3})+(?!\d))/g, '.')
  return nachkomma === undefined ? mitPunkten : `${mitPunkten},${nachkomma}`
}
