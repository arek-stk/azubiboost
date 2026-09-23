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
    einleitung: 'Prozentrechnung in Ruhe erklärt, mit vielen Übungen und Lösungen. Kostenlos und ohne Anmeldung.',
    quellen: [
      {
        titel: 'Einführung: Grundwert, Prozentwert, Prozentsatz',
        wer: 'Serlo (freie Lernplattform)',
        url: 'https://de.serlo.org/mathe/36750/einfuehrung-in-grundwert-prozentwert-und-prozentsatz',
        warum: 'Erklärt Schritt für Schritt, was Grundwert, Prozentwert und Prozentsatz bedeuten. Darauf baut jede Kalkulation auf.',
        art: 'Erklärung',
      },
      {
        titel: 'Aufgaben zur Prozentrechnung',
        wer: 'Serlo (freie Lernplattform)',
        url: 'https://de.serlo.org/mathe/80255/aufgaben-zur-prozentrechnung',
        warum: 'Viele Übungsaufgaben mit ausführlichen Lösungen, an denen du jeden Rechenschritt nachvollziehen kannst.',
        art: 'Übungen',
      },
    ],
  },
  {
    titel: 'Kalkulation als Video',
    einleitung: 'Kurze Videos, die das Kalkulationsschema an Beispielen durchrechnen. Gut zum Anschauen, bevor du selbst rechnest.',
    quellen: [
      {
        titel: 'Bezugskalkulation',
        wer: 'Studyflix',
        url: 'https://studyflix.de/wirtschaft/bezugskalkulation-1482',
        warum: 'Zeigt den Weg vom Listenpreis zum Bezugspreis mit Rabatt, Skonto und Bezugskosten.',
        art: 'Video',
      },
      {
        titel: 'Vorwärtskalkulation',
        wer: 'Studyflix',
        url: 'https://studyflix.de/wirtschaft/vorwartskalkulation-1474',
        warum: 'Zeigt, wie du vom Bezugspreis mit Handlungskosten und Gewinn zum Verkaufspreis kommst.',
        art: 'Video',
      },
      {
        titel: 'Handelskalkulation: Schema und Beispiele',
        wer: 'Studyflix',
        url: 'https://studyflix.de/wirtschaft/handelskalkulation-1470',
        warum: 'Das ganze Kalkulationsschema auf einen Blick, mit durchgerechneten Beispielen.',
        art: 'Video',
      },
      {
        titel: 'Kalkulationszuschlag',
        wer: 'Studyflix',
        url: 'https://studyflix.de/wirtschaft/kalkulationszuschlag-6297/video',
        warum: 'Erklärt an einem Beispiel, wie sich Kalkulationszuschlag und Handelsspanne unterscheiden.',
        art: 'Video',
      },
    ],
  },
  {
    titel: 'Hilfe, die dich nichts kostet',
    einleitung: 'Diese Angebote richten sich an Azubis und sind kostenlos.',
    quellen: [
      {
        titel: 'Assistierte Ausbildung (AsA flex)',
        wer: 'Bundesagentur für Arbeit',
        url: 'https://www.arbeitsagentur.de/bildung/ausbildung/assistierte-ausbildung-machen',
        warum:
          'Kostenlose Nachhilfe während der Ausbildung, auch in Mathe und zur Prüfungsvorbereitung. Ansprechpartner ist die Berufsberatung der Agentur für Arbeit. Du kannst jederzeit einsteigen.',
        art: 'Hilfe',
      },
      {
        titel: 'VerAplus: persönliche Ausbildungsbegleitung',
        wer: 'Senior Experten Service',
        url: 'https://vera.ses-bonn.de/ich-bin-azubi',
        warum:
          'Eine berufserfahrene Person begleitet dich ehrenamtlich und eins zu eins, zum Beispiel bei Lernproblemen, Prüfungsangst oder Stress im Betrieb. Das Angebot ist kostenlos.',
        art: 'Hilfe',
      },
    ],
  },
  {
    titel: 'Wenn Rechnen sehr schwerfällt',
    einleitung:
      'Wer eine ärztlich oder psychologisch festgestellte Rechenstörung (Dyskalkulie) hat, kann bei der IHK einen Nachteilsausgleich beantragen, zum Beispiel mehr Zeit in der Prüfung. Der Antrag muss spätestens mit der Anmeldung zur Prüfung gestellt werden. Dafür braucht es ein fachärztliches oder psychologisches Gutachten, ein Attest vom Hausarzt reicht nicht.',
    quellen: [
      {
        titel: 'Informationen zur Prüfung und Nachteilsausgleich',
        wer: 'IHK Niederbayern',
        url: 'https://www.ihk-niederbayern.de/berufliche-bildung/ausbildung/ausbildungspruefungen/informationen-zur-pruefung/',
        warum:
          'Die Seite deiner IHK. Den Antrag auf Nachteilsausgleich stellst du dort bei der Online-Anmeldung zur Prüfung, zusammen mit einem aktuellen Attest. Ein Antrag bei der Berufsschule gilt dafür nicht.',
        art: 'Offiziell',
      },
      {
        titel: 'Antrag auf Nachteilsausgleich (PDF)',
        wer: 'IHK Niederbayern',
        url: 'https://www.ihk-niederbayern.de/pdfs/antrag-nachteilsausgleich-data.pdf',
        warum: 'Das Antragsformular mit Hinweisen, welche Nachweise nötig sind. Ärztliche Unterlagen sollten nicht älter als ein Jahr sein.',
        art: 'Offiziell',
      },
    ],
  },
  {
    titel: 'Die Prüfung selbst',
    einleitung: 'Hier stehen die verbindlichen Regeln. Termine und Einzelheiten erfährst du bei deiner eigenen IHK.',
    quellen: [
      {
        titel: 'Ausbildungsverordnung (VerkEHKflAusbV)',
        wer: 'Bundesministerium der Justiz',
        url: 'https://www.gesetze-im-internet.de/verkehkflausbv/BJNR045800017.html',
        warum: 'Der Originaltext mit Prüfungsbereichen, Prüfungszeiten, Gewichtung und Bestehensregeln.',
        art: 'Offiziell',
      },
      {
        titel: 'Prüfungstermine Kaufleute im Einzelhandel',
        wer: 'IHK Niederbayern',
        url: 'https://www.ihk-niederbayern.de/berufliche-bildung/ausbildung/ausbildungspruefungen/pruefungstermine/kaufmann-frau-im-einzelhandel/',
        warum:
          'Teil 2 schriftlich: 28. April 2027 (Winterprüfung: 25. November 2026). Der mündliche Teil liegt zwischen Mitte Juni und Juli, bei der Winterprüfung im Januar.',
        art: 'Offiziell',
      },
      {
        titel: 'Zugelassene Hilfsmittel',
        wer: 'IHK-AkA, Aufgabenstelle der IHKs',
        url: 'https://www.ihk-aka.de/pruefungen/ap/hilfsmittel',
        warum:
          'Erlaubt ist ein nicht programmierbarer, netzunabhängiger Taschenrechner ohne Kommunikationsmöglichkeit. Übe mit dem Gerät, das du auch in die Prüfung mitnimmst.',
        art: 'Offiziell',
      },
    ],
  },
]
