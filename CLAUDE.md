# Deine LernApp: Hinweise für Claude Code

## Was das ist

PWA zur Vorbereitung auf die Abschlussprüfung **Kauffrau/Kaufmann im Einzelhandel**.
Zielgerät ist ein **iPhone**, installiert über Safari → „Zum Home-Bildschirm".
Kein Backend, keine Accounts, alle Daten im `localStorage`.

## Fachliche Grundlagen — nicht raten, hier nachsehen

Rechtsgrundlage ist die **VerkEHKflAusbV (AO 2017)**. Diese Werte sind in
`src/domain/pruefung.ts` hinterlegt und dürfen nur mit Quelle geändert werden:

| Prüfungsbereich | Teil | Dauer | Gewicht |
|---|---|---|---|
| Verkauf und Werbemaßnahmen | 1 | 90 Min | 15 % |
| Warenwirtschaft und Kalkulation | 1 | 60 Min | 10 % |
| Wirtschafts- und Sozialkunde | 1 | 60 Min | 10 % |
| Geschäftsprozesse im Einzelhandel | 2 | 120 Min | 25 % |
| Fachgespräch in der Wahlqualifikation | 2 | max. 20 Min | 40 % |

**Bestehensregel (§ 29 Abs. 2):** Gesamtergebnis mindestens ausreichend **und**
Geschäftsprozesse mindestens ausreichend **und** Fachgespräch mindestens ausreichend.

**IHK-Notenschlüssel:** 100–92 = 1 · 91–81 = 2 · 80–67 = 3 · 66–50 = 4 · 49–30 = 5 · 29–0 = 6.

## Konventionen

- Sprache im Code, in Kommentaren und in der UI: **Deutsch**. Fachbegriffe wie in der
  Prüfung schreiben (Bezugspreis, Handelsspanne, Meldebestand).
- `src/domain` und `src/engine` sind **frei von React** — reine Funktionen, testbar.
  UI-Zustand nur in `src/store` und `src/screens`.
- Erklärtexte in Alltagssprache. Erst verständlich, dann Fachbegriff.
- Frage-`id`s sind stabil und werden nie neu belegt (Schlüssel des Lernfortschritts).
- Änderungen an der Speicherstruktur brauchen eine Migration in `src/store/persist.ts`.

## Befehle

```bash
npm run dev         # Entwicklungsserver
npm run typecheck   # tsc --noEmit
npm run lint        # ESLint
npm test            # Vitest (Engine)
npm run build       # typecheck + Produktionsbuild
npm run icons       # App-Icons neu erzeugen
```

## Worauf besonders achten

- **iPhone:** `safe-area-inset` für die Tab-Bar, Inputs mit `font-size: 16px` gegen den
  Fokus-Zoom, Touch-Ziele mindestens 44 × 44 px.
- **Offline:** Der Service Worker muss die App ohne Netz starten können.
- **Rechenaufgaben:** kaufmännisch runden, Toleranz pro Aufgabe, Rechenweg vollständig.
