# AzubiBoost Einzelhandel

Prüfungs-App für die **Abschlussprüfung Kauffrau/Kaufmann im Einzelhandel** — lernen,
rechnen, Prüfung simulieren, Fortschritt sehen. Läuft als PWA auf dem iPhone, offline,
ohne Konto und ohne Server: der Lernfortschritt bleibt auf dem Gerät.

[![CI](https://github.com/arek-stk/azubiboost/actions/workflows/ci.yml/badge.svg)](https://github.com/arek-stk/azubiboost/actions/workflows/ci.yml)
[![CodeQL](https://github.com/arek-stk/azubiboost/actions/workflows/codeql.yml/badge.svg)](https://github.com/arek-stk/azubiboost/actions/workflows/codeql.yml)
[![Lighthouse](https://github.com/arek-stk/azubiboost/actions/workflows/lighthouse.yml/badge.svg)](https://github.com/arek-stk/azubiboost/actions/workflows/lighthouse.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

## Aufs iPhone holen

1. Den Link der App in **Safari** öffnen (Chrome auf iOS kann das nicht).
2. Unten auf **Teilen** tippen.
3. **„Zum Home-Bildschirm"** wählen, dann **Hinzufügen**.

Danach liegt AzubiBoost mit eigenem Icon auf dem Home-Bildschirm, startet im Vollbild
ohne Browserleiste und funktioniert **ohne Internet**.

> **Wichtig:** Erst als installierte App bleibt der Lernfortschritt dauerhaft erhalten.
> In einem normalen Safari-Tab löscht iOS die Daten nach sieben Tagen ohne Nutzung.
> Zusätzlich gibt es unter Einstellungen einen **Backup-Export** als Datei.

## Was drin ist

- **Kurz erklärt** — jedes Thema auf einem Bildschirm in Alltagssprache, mit Beispiel
  aus dem Laden, Merksatz und der typischen Prüfungsfalle.
- **Quiz** mit sofortiger Erklärung nach jeder Antwort, statt erst am Ende.
- **Rechnen mit Blatt und Stift** — Aufgabe ohne Antwortauswahl, sie rechnet auf Papier,
  tippt nur das Ergebnis ein und bekommt danach den **Rechenweg Schritt für Schritt**.
  Die Zahlen werden neu erzeugt, Auswendiglernen funktioniert nicht.
- **Formelsammlung** — Kalkulationsschema vorwärts und rückwärts, Lagerkennzahlen,
  Handelsspanne, Meldebestand; offline nachschlagbar.
- **Druckbarer Übungszettel** mit Lösungsblatt für das Üben am Küchentisch.
- **Prüfungssimulation** mit den echten Zeiten und der echten Gewichtung, Auswertung
  nach IHK-Notenschlüssel und Ampel für die **Bestehensregel § 29**.
- **Fachgespräch-Trainer** — Wahlqualifikation wählen, zwei Aufgaben zur Auswahl wie in
  der Prüfung, 15 Minuten Vorbereitungs- und 20 Minuten Sprechtimer.
- **Lernplan** — falsch beantwortete Fragen kommen nach Leitner-Intervallen zurück, die
  App empfiehlt täglich das schwächste Thema.
- **Streak, Tagesziel und Countdown** bis zum Prüfungstermin.

## Prüfungsstruktur, die die App abbildet

Grundlage ist die **VerkEHKflAusbV (AO 2017)**, gestreckte Abschlussprüfung:

| Prüfungsbereich | Teil | Dauer | Gewicht |
|---|---|---|---|
| Verkauf und Werbemaßnahmen | 1 | 90 Min | 15 % |
| Warenwirtschaft und Kalkulation | 1 | 60 Min | 10 % |
| Wirtschafts- und Sozialkunde | 1 | 60 Min | 10 % |
| Geschäftsprozesse im Einzelhandel | 2 | 120 Min | 25 % |
| Fachgespräch in der Wahlqualifikation | 2 | max. 20 Min | 40 % |

Bestanden ist die Prüfung, wenn das Gesamtergebnis **und** Geschäftsprozesse **und** das
Fachgespräch jeweils mindestens „ausreichend" sind (§ 29 Abs. 2).

## Entwicklung

```bash
npm ci
npm run dev        # http://localhost:5173

npm run typecheck
npm run lint
npm test
npm run build
```

Stack: Vite, React, TypeScript, `vite-plugin-pwa` (Workbox), Vitest. Kein UI-Framework,
kein Backend. `src/domain` und `src/engine` sind React-frei und vollständig getestet.

### Deployment

Das Repo ist mit **Vercel** verbunden: Push auf `main` deployt, jeder Pull Request
bekommt eine Preview-URL, die sich direkt auf dem Handy testen lässt.

### KI im Repo

`@claude` in einem Issue oder PR-Kommentar erledigt Aufgaben direkt im Repo, und jeder
Pull Request bekommt automatisch ein KI-Review. Dafür muss einmal ein Secret gesetzt
sein (`CLAUDE_CODE_OAUTH_TOKEN` über `/install-github-app` in Claude Code, oder
`ANTHROPIC_API_KEY`). Ohne Secret bleiben diese Workflows inaktiv, CI und CodeQL laufen
trotzdem.

## Ehrlicher Hinweis zum Inhalt

Die Fragen sind **eigene Übungsaufgaben**, ausgerichtet an der Ausbildungsordnung und
den offiziellen Prüfungsbereichen — **keine echten IHK-Prüfungsaufgaben**, denn die sind
urheberrechtlich geschützt und nicht frei verfügbar. Struktur, Zeiten, Gewichtung und
Bestehensregeln entsprechen dagegen der Verordnung. Verbindlich ist immer die Auskunft
der zuständigen IHK.

## Quellen

- [VerkEHKflAusbV — Verordnung über die Berufsausbildungen zum Verkäufer und zur Kauffrau im Einzelhandel](https://www.gesetze-im-internet.de/verkehkflausbv/BJNR045800017.html)
- [IHK Köln — Broschüre zur gestreckten Abschlussprüfung (PDF)](https://www.ihk.de/blueprint/servlet/resource/blob/553040/2f97f60b5d61fef53270ca277396cd91/broschuere-zur-gestreckten-abschlusspruefung-data.pdf)
- [IHK München — Notenschlüssel (PDF)](https://www.ihk-muenchen.de/ihk/documents/Berufliche-Bildung/Pr%C3%BCfermanagement/05.1-Notenschl%C3%BCssel_15.09.20.pdf)
- [HDE — Info-Broschüre zur Neuordnung im Einzelhandel (PDF)](https://www.ihk.de/blueprint/servlet/resource/blob/3717850/ec01b68d8b72e93995e6df94e3bb24dc/info-broschuere-des-hde-zur-neuordnung-im-einzelhandel-data.pdf)

## Lizenz

[MIT](LICENSE)

## Persönliche Anpassung (privat, nicht im Repo)

Name, Anrede und persönliche Nachrichten stehen nicht im Code, sondern in
Umgebungsvariablen — lokal in `.env.local` (von git ignoriert), beim Hosting in
den Projekteinstellungen von Vercel:

| Variable | Wirkung |
|---|---|
| `VITE_APP_NAME` | Name der App im Titel |
| `VITE_APP_KURZNAME` | Name unter dem Icon auf dem Home-Bildschirm |
| `VITE_VORNAME` | Vorbelegung des Namens beim ersten Start |
| `VITE_KOSENAME` | Anrede in der Begrüßung |
| `VITE_NACHRICHT_VON` | Absender der persönlichen Nachricht |
| `VITE_NACHRICHTEN` | Eine oder mehrere Nachrichten, getrennt durch `\|` — jeden Tag eine andere |

Ohne diese Variablen läuft die App neutral als „AzubiBoost".
