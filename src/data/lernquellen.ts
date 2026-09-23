/**
 * Geprüfte Lernquellen und Hilfsangebote außerhalb der App.
 * Nur kostenlose Angebote und offizielle Stellen; recherchiert im September 2026.
 */

export type Quelle = {
  titel: string
  wer: string
  url: string
  warum: string
  art: 'Erklärung' | 'Übungen' | 'Video' | 'Hilfe' | 'Offiziell'
}

export type QuellenGruppe = { titel: string; einleitung: string; quellen: Quelle[] }

export const QUELLEN: readonly QuellenGruppe[] = [
  {
    titel: 'Mathe von Anfang an',
    einleitung: 'Prozentrechnung in Ruhe erklärt, mit vielen Übungen und Lösungen — kostenlos und ohne Anmeldung.',
    quellen: [
      {
        titel: 'Einführung: Grundwert, Prozentwert, Prozentsatz',
        wer: 'Serlo — freie Lernplattform',
        url: 'https://de.serlo.org/mathe/36750/einfuehrung-in-grundwert-prozentwert-und-prozentsatz',
        warum: 'Erklärt Schritt für Schritt, was hinter Prozent steckt — die Basis für jede Kalkulation.',
        art: 'Erklärung',
      },
      {
        titel: 'Aufgaben zur Prozentrechnung',
        wer: 'Serlo — freie Lernplattform',
        url: 'https://de.serlo.org/mathe/80255/aufgaben-zur-prozentrechnung',
        warum: 'Viele Übungsaufgaben mit ausführlichen Lösungen zum Nachvollziehen.',
        art: 'Übungen',
      },
    ],
  },
  {
    titel: 'Kalkulation als Video',
    einleitung: 'Kurze Videos, die das Kalkulationsschema an Beispielen zeigen — gut zum Anschauen vor dem Rechnen.',
    quellen: [
      {
        titel: 'Bezugskalkulation',
        wer: 'Studyflix',
        url: 'https://studyflix.de/wirtschaft/bezugskalkulation-1482',
        warum: 'Vom Listenpreis zum Bezugspreis: Rabatt, Skonto, Bezugskosten.',
        art: 'Video',
      },
      {
        titel: 'Vorwärtskalkulation',
        wer: 'Studyflix',
        url: 'https://studyflix.de/wirtschaft/vorwartskalkulation-1474',
        warum: 'Vom Bezugspreis zum Verkaufspreis mit Handlungskosten und Gewinn.',
        art: 'Video',
      },
      {
        titel: 'Handelskalkulation: Schema und Beispiele',
        wer: 'Studyflix',
        url: 'https://studyflix.de/wirtschaft/handelskalkulation-1470',
        warum: 'Das ganze Schema auf einen Blick, mit Rechenbeispielen.',
        art: 'Video',
      },
      {
        titel: 'Kalkulationszuschlag',
        wer: 'Studyflix',
        url: 'https://studyflix.de/wirtschaft/kalkulationszuschlag-6297/video',
        warum: 'Der Unterschied zwischen Zuschlag und Spanne an einem Beispiel.',
        art: 'Video',
      },
    ],
  },
  {
    titel: 'Hilfe, die dich nichts kostet',
    einleitung: 'Du musst das nicht allein schaffen. Diese Angebote sind für Azubis gedacht und kostenlos.',
    quellen: [
      {
        titel: 'Assistierte Ausbildung (AsA flex)',
        wer: 'Bundesagentur für Arbeit',
        url: 'https://www.arbeitsagentur.de/bildung/ausbildung/assistierte-ausbildung-machen',
        warum:
          'Kostenlose Nachhilfe während der Ausbildung, auch für Mathe und Prüfungsvorbereitung. Anlaufstelle ist die Berufsberatung der Agentur für Arbeit; Einstieg jederzeit möglich.',
        art: 'Hilfe',
      },
      {
        titel: 'VerAplus — persönliche Ausbildungsbegleitung',
        wer: 'Senior Experten Service',
        url: 'https://vera.ses-bonn.de/ich-bin-azubi',
        warum:
          'Eine erfahrene Person aus dem Berufsleben begleitet dich ehrenamtlich eins zu eins — bei Lernproblemen, Prüfungsangst oder Stress im Betrieb. Kostenlos.',
        art: 'Hilfe',
      },
    ],
  },
  {
    titel: 'Wenn Rechnen sehr schwerfällt',
    einleitung:
      'Wer eine ärztlich oder psychologisch festgestellte Rechenstörung (Dyskalkulie) hat, kann bei der IHK einen Nachteilsausgleich beantragen — zum Beispiel mehr Zeit in der Prüfung. Der Antrag muss spätestens mit der Anmeldung zur Prüfung gestellt werden, und es braucht ein fachärztliches oder psychologisches Gutachten; ein Hausarztattest reicht nicht.',
    quellen: [
      {
        titel: 'Nachteilsausgleich bei der Prüfung',
        wer: 'IHK für München und Oberbayern',
        url: 'https://www.ihk-muenchen.de/de/berufsbildung-berufszugang/auszubildende/ausbildungspruefung/nachteilsausgleich/',
        warum: 'Erklärt Voraussetzungen und Antrag. Zuständig ist immer die eigene IHK — dort fragen.',
        art: 'Offiziell',
      },
    ],
  },
  {
    titel: 'Die Prüfung selbst',
    einleitung: 'Die verbindlichen Regeln. Termine und Details nennt immer deine eigene IHK.',
    quellen: [
      {
        titel: 'Ausbildungsverordnung (VerkEHKflAusbV)',
        wer: 'Bundesministerium der Justiz',
        url: 'https://www.gesetze-im-internet.de/verkehkflausbv/BJNR045800017.html',
        warum: 'Prüfungsbereiche, Zeiten, Gewichtung und Bestehensregeln im Original.',
        art: 'Offiziell',
      },
    ],
  },
]
