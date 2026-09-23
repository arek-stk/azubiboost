/** Kleine, einheitliche Linien-Icons (24er Raster, 1,8 Strichstärke). */

const PFADE = {
  heute: 'M3 11.5 12 4l9 7.5M5.5 9.5V20h13V9.5',
  lernen: 'M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5v-15ZM4 20.5A2.5 2.5 0 0 1 6.5 18H20',
  rechnen:
    'M6 3h12a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Zm2 4h8M8.5 12h.01M12 12h.01M15.5 12h.01M8.5 15.5h.01M12 15.5h.01M15.5 15.5h.01M8.5 18.5h.01M12 18.5h.01M15.5 18.5h.01',
  pruefung: 'M9 3h6v3H9zM7 5H5.5A1.5 1.5 0 0 0 4 6.5v13A1.5 1.5 0 0 0 5.5 21h13a1.5 1.5 0 0 0 1.5-1.5v-13A1.5 1.5 0 0 0 18.5 5H17M8.5 13.5l2.5 2.5 4.5-5',
  fortschritt: 'M4 20V10M10 20V4M16 20v-7M22 20H2',
  einstellungen:
    'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1Z',
  zurueck: 'M15 18l-6-6 6-6',
  weiter: 'M9 18l6-6-6-6',
  haken: 'M5 12.5l4.5 4.5L19 7.5',
  kreuz: 'M6 6l12 12M18 6 6 18',
  flamme:
    'M12 21c3.9 0 7-2.8 7-6.6 0-3.3-2.2-5.4-3.6-7.4-.4 1.9-1.4 3-2.6 3.4.2-2.8-.8-5.5-3.3-7.4.3 3.4-1.4 5.3-2.9 7C5.4 11.4 5 12.7 5 14.4 5 18.2 8.1 21 12 21Z',
  uhr: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18ZM12 7v5l3 2',
  drucker: 'M7 9V3h10v6M7 18H5a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2M7 14h10v7H7z',
  stift: 'M4 20h4L19 9l-4-4L4 16v4ZM13.5 6.5l4 4',
  formel: 'M5 4h14M5 20h14M8 4l7 8-7 8',
  sprechblase: 'M21 12a8 8 0 0 1-11.6 7.1L4 21l1.9-5.4A8 8 0 1 1 21 12Z',
  loeschen: 'M21 5H9l-6 7 6 7h12a1 1 0 0 0 1-1V6a1 1 0 0 0-1-1ZM17.5 9.5l-5 5M12.5 9.5l5 5',
} as const

export type IconName = keyof typeof PFADE

export function Icon({ name, groesse = 24, titel }: { name: IconName; groesse?: number; titel?: string }) {
  return (
    <svg
      width={groesse}
      height={groesse}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden={titel === undefined}
      role={titel === undefined ? undefined : 'img'}
    >
      {titel !== undefined && <title>{titel}</title>}
      <path d={PFADE[name]} />
    </svg>
  )
}
