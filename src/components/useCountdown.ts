import { useEffect, useRef, useState } from 'react'

/**
 * Rückwärtszähler, der sich an der Wanduhr orientiert statt an setInterval-Ticks:
 * iOS drosselt Timer, sobald die App im Hintergrund liegt. So stimmt die
 * verbleibende Zeit auch nach dem Zurückkehren.
 */
export function useCountdown(sekunden: number, laeuft: boolean, onAbgelaufen?: () => void): number {
  const [rest, setRest] = useState(sekunden)
  const ende = useRef<number | null>(null)
  const callback = useRef(onAbgelaufen)

  useEffect(() => {
    callback.current = onAbgelaufen
  }, [onAbgelaufen])

  useEffect(() => {
    if (!laeuft) {
      ende.current = null
      return
    }
    if (ende.current === null) ende.current = Date.now() + rest * 1000

    const tick = () => {
      const verbleibend = Math.max(0, Math.round(((ende.current ?? 0) - Date.now()) / 1000))
      setRest(verbleibend)
      if (verbleibend === 0) {
        clearInterval(id)
        callback.current?.()
      }
    }
    const id = setInterval(tick, 500)
    document.addEventListener('visibilitychange', tick)
    return () => {
      clearInterval(id)
      document.removeEventListener('visibilitychange', tick)
    }
    // Nur beim Starten und Stoppen neu aufsetzen — `rest` ändert sich jede halbe Sekunde.
  }, [laeuft])

  return rest
}

export function uhrzeit(sekunden: number): string {
  const s = Math.max(0, sekunden)
  const h = Math.floor(s / 3600)
  const m = Math.floor((s % 3600) / 60)
  const sek = s % 60
  const mm = `${m}`.padStart(2, '0')
  const ss = `${sek}`.padStart(2, '0')
  return h > 0 ? `${h}:${mm}:${ss}` : `${mm}:${ss}`
}
