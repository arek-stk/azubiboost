# Sicherheit

## Was diese App speichert

Deine LernApp hat **kein Backend und keine Benutzerkonten**. Der gesamte Lernfortschritt
liegt ausschließlich im `localStorage` des Geräts, auf dem die App läuft. Es werden
keine Daten an einen Server gesendet, es gibt kein Tracking und keine Analytics.

Damit verlässt auch kein persönlicher Eintrag (Name, Prüfungstermin, Ergebnisse)
jemals das Handy.

## Lücke melden

Bitte **kein öffentliches Issue** für Sicherheitslücken. Nutze stattdessen
["Report a vulnerability"](../../security/advisories/new) im Security-Tab dieses Repos.

Eine Rückmeldung kommt in der Regel innerhalb von sieben Tagen.

## Automatische Prüfungen

- **CodeQL** (`security-and-quality`) bei jedem Push und PR sowie wöchentlich
- **Dependency Review** blockt PRs mit bekannt verwundbaren Abhängigkeiten
- **Dependabot** aktualisiert npm-Pakete und GitHub Actions wöchentlich
- **Secret Scanning** und **Push Protection** sind für dieses öffentliche Repo aktiv
