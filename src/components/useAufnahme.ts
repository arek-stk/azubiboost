import { useCallback, useEffect, useRef, useState } from 'react'

export type AufnahmeStatus = 'bereit' | 'nimmtAuf' | 'fertig' | 'gesperrt' | 'nichtMoeglich'

/**
 * Sprachaufnahme fürs Fachgespräch. Die Aufnahme bleibt im Arbeitsspeicher
 * dieses Geräts und verschwindet, sobald die Seite verlassen wird. Es wird
 * nichts gespeichert und nichts hochgeladen.
 */
export function useAufnahme() {
  const moeglich =
    typeof window !== 'undefined' &&
    typeof window.MediaRecorder !== 'undefined' &&
    typeof navigator.mediaDevices?.getUserMedia === 'function'

  const [status, setStatus] = useState<AufnahmeStatus>(moeglich ? 'bereit' : 'nichtMoeglich')
  const [sekunden, setSekunden] = useState(0)
  const [url, setUrl] = useState<string | null>(null)
  const rekorder = useRef<MediaRecorder | null>(null)
  const strom = useRef<MediaStream | null>(null)
  const teile = useRef<Blob[]>([])

  // Die alte Aufnahme freigeben, sobald eine neue da ist oder die Seite verlassen wird.
  useEffect(
    () => () => {
      if (url !== null) URL.revokeObjectURL(url)
    },
    [url],
  )

  // Beim Verlassen der Seite das Mikrofon sicher abschalten.
  useEffect(
    () => () => {
      if (rekorder.current?.state === 'recording') rekorder.current.stop()
      strom.current?.getTracks().forEach((t) => t.stop())
    },
    [],
  )

  useEffect(() => {
    if (status !== 'nimmtAuf') return
    const id = window.setInterval(() => setSekunden((s) => s + 1), 1000)
    return () => window.clearInterval(id)
  }, [status])

  const starte = useCallback(async () => {
    if (!moeglich) return
    try {
      const s = await navigator.mediaDevices.getUserMedia({ audio: true })
      strom.current = s
      const format = ['audio/mp4', 'audio/webm'].find((f) => MediaRecorder.isTypeSupported(f))
      const r = new MediaRecorder(s, format === undefined ? undefined : { mimeType: format })
      teile.current = []
      r.ondataavailable = (e) => {
        if (e.data.size > 0) teile.current.push(e.data)
      }
      r.onstop = () => {
        const blob = new Blob(teile.current, { type: r.mimeType || format || 'audio/mp4' })
        setUrl(URL.createObjectURL(blob))
        s.getTracks().forEach((t) => t.stop())
        setStatus('fertig')
      }
      r.start()
      rekorder.current = r
      setSekunden(0)
      setStatus('nimmtAuf')
    } catch {
      setStatus('gesperrt')
    }
  }, [moeglich])

  const stoppe = useCallback(() => {
    if (rekorder.current?.state === 'recording') rekorder.current.stop()
  }, [])

  const verwirf = useCallback(() => {
    setUrl(null)
    setSekunden(0)
    setStatus(moeglich ? 'bereit' : 'nichtMoeglich')
  }, [moeglich])

  return { status, sekunden, url, starte, stoppe, verwirf }
}
