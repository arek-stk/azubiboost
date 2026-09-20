# Mitmachen

## Einrichten

```bash
npm ci
npm run dev
```

## Vor jedem Commit

```bash
npm run typecheck
npm run lint
npm test
```

## Neue Prüfungsfragen beitragen

Fragen liegen in `src/data/fragen/<thema>.ts`. Für jede Frage gilt:

- **`erklaerung` ist Pflicht** und in Alltagssprache geschrieben. Erst der Satz, der
  die Sache erklärt, danach die Fachbegriffe. Kein Behördendeutsch.
- **`rechtsbezug`** angeben, wo es einen gibt (z. B. `§ 434 BGB`, `§ 9 JArbSchG`).
- Bei `typ: 'zahl'` gehört ein **vollständiger `rechenweg`** dazu, Schritt für Schritt
  mit Zwischenergebnis — der Lerneffekt steckt im Weg, nicht im Ergebnis.
- Die `id` ist stabil und wird **nie wiederverwendet**: sie ist der Schlüssel für den
  gespeicherten Lernfortschritt. Eine Frage ändern ist in Ordnung, eine `id` neu zu
  belegen zerstört die Statistik.

Es werden **keine echten IHK-Prüfungsaufgaben** aufgenommen. Die sind urheberrechtlich
geschützt. Alle Fragen sind eigene Übungsaufgaben, ausgerichtet an der
Ausbildungsordnung VerkEHKflAusbV (2017).

## Gespeicherten Zustand ändern

`src/store/persist.ts` hat eine Schema-Version. Wer die Struktur ändert, schreibt eine
Migration dazu. Ein Update darf niemals den Lernfortschritt löschen.

## KI im Repo

Schreibe `@claude` in ein Issue oder einen PR-Kommentar, dann arbeitet Claude daran.
Jeder PR bekommt zusätzlich automatisch ein KI-Review.
