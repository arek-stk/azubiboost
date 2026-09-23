import { useEffect } from 'react'
import { useFeier } from '../components/Feier'
import { FRAGEN } from '../data/fragen'
import { THEMEN } from '../domain/themen'
import { ERFOLGE, erreichteErfolge, laengsteSerie, type ErfolgKontext } from '../engine/erfolge'
import { ZIEL_BOX } from '../engine/statistik'
import type { AppZustand } from './persist'
import { useStore } from './useStore'

export function erfolgKontext(z: AppZustand): ErfolgKontext {
  const antworten = Object.values(z.karten).reduce((s, k) => s + k.richtig + k.falsch, 0)
  const themen = THEMEN.map((t) => {
    const eigene = FRAGEN.filter((f) => f.thema === t.id)
    return {
      geuebt: eigene.some((f) => (z.karten[f.id]?.richtig ?? 0) + (z.karten[f.id]?.falsch ?? 0) > 0),
      gemeistert: eigene.length > 0 && eigene.every((f) => (z.karten[f.id]?.box ?? 0) >= ZIEL_BOX),
    }
  })
  return {
    antworten,
    richtigeRechenaufgaben: Object.values(z.rechnen).reduce((s, r) => s + (r?.richtig ?? 0), 0),
    laengsteSerie: laengsteSerie(z.tageMitZiel),
    simulationen: z.versuche.filter((v) => v.art === 'simulation').map((v) => ({ bereich: v.bereich, punkte: v.punkte })),
    fachgespraechGeuebt: z.fachgespraechSelbst !== null,
    themenGeuebt: themen.filter((t) => t.geuebt).length,
    themenGesamt: themen.length,
    gemeisterteThemen: themen.filter((t) => t.gemeistert).length,
  }
}

/** Beobachtet den Lernstand und feiert neu erreichte Erfolge. Rendert selbst nichts. */
export function ErfolgMelder() {
  const { zustand, dispatch } = useStore()
  const { feiere } = useFeier()

  useEffect(() => {
    const neu = erreichteErfolge(erfolgKontext(zustand)).filter((id) => !zustand.erfolge.includes(id))
    if (neu.length === 0) return
    dispatch({ typ: 'erfolgeFreigeschaltet', ids: neu })
    const erster = ERFOLGE.find((e) => e.id === neu[0])
    if (erster === undefined) return
    feiere({
      symbol: erster.symbol,
      titel: neu.length === 1 ? `Neuer Erfolg: ${erster.titel}` : `${neu.length} neue Erfolge!`,
      text: neu.length === 1 ? erster.beschreibung : 'Schau sie dir unter Fortschritt an.',
    })
  }, [zustand, dispatch, feiere])

  return null
}
