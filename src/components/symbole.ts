import type { CSSProperties } from 'react'
import type { BereichId, ThemaId } from '../domain/types'
import type { IconName } from './Icon'

/** Ein Symbol je Thema — so erkennt man Themen auch beim schnellen Scrollen. */
export const THEMA_ICON: Record<ThemaId, IconName> = {
  verkaufsgespraech: 'warenkorb',
  kundenkommunikation: 'sprechblase',
  warenpraesentation: 'stern',
  kasse: 'euro',
  warenannahme: 'paket',
  bestandsfuehrung: 'liste',
  beschaffung: 'lkw',
  kalkulation: 'prozent',
  lagerkennzahlen: 'lager',
  kaufvertrag: 'waage',
  wirtschaftsordnung: 'weltkugel',
  arbeitsrecht: 'aktenkoffer',
  arbeitsschutz: 'schild',
  geschaeftsprozesse: 'diagramm',
}

/** Setzt die Bereichsfarbe als CSS-Variablen; Komponenten nutzen --farbe und --farbe-weich. */
export function bereichStil(b: BereichId): CSSProperties {
  return { '--farbe': `var(--b-${b})`, '--farbe-weich': `var(--b-${b}-weich)` } as CSSProperties
}
