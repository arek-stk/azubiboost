/**
 * „Kurz erklärt“: jedes Thema auf einem Bildschirm, in Alltagssprache.
 * Aufbau immer gleich: Worum geht's → Beispiel aus dem Laden → Merksatz → Prüfungsfalle.
 */

import type { ThemaId } from '../domain/types'

export type Erklaerung = {
  kern: string[]
  beispiel: string
  merksatz: string
  falle: string
}

export const ERKLAERUNGEN: Record<ThemaId, Erklaerung> = {
  verkaufsgespraech: {
    kern: [
      'Ein gutes Verkaufsgespräch hat eine feste Reihenfolge: Kontakt aufnehmen, Bedarf ermitteln, Ware zeigen, argumentieren, Einwände klären, Preis nennen, Abschluss, Zusatzangebot, Verabschiedung.',
      'Der wichtigste Teil ist die Bedarfsermittlung. Mit offenen Fragen („Wofür brauchen Sie …?“) erfährst du, was der Kunde wirklich will.',
      'Argumentiere mit dem Nutzen für den Kunden, nicht mit technischen Merkmalen. Das nennt man Sie-Stil.',
    ],
    beispiel:
      'Statt „Der Käse ist 12 Monate gereift“ sagst du: „Durch die lange Reifung hat er dieses kräftige, nussige Aroma — genau richtig für Ihre Käseplatte.“',
    merksatz: 'Erst fragen, dann zeigen, dann überzeugen.',
    falle: 'Geschlossene Fragen (Ja/Nein) passen nicht zur Bedarfsermittlung — sie beenden das Gespräch, statt es zu öffnen.',
  },
  kundenkommunikation: {
    kern: [
      'Eine Reklamation ist ein Mangel an der Ware — dann hat der Kunde gesetzliche Rechte. Eine Beschwerde ist Unzufriedenheit ohne Rechtsanspruch, etwa über lange Schlangen.',
      'Ein Umtausch mangelfreier Ware ist freiwillige Kulanz. Im Laden gibt es kein gesetzliches Rückgaberecht.',
      'Bei jeder Reklamation gilt: zuhören, Verständnis zeigen, nicht rechtfertigen, schnell eine Lösung anbieten.',
    ],
    beispiel:
      'Eine Kundin bringt verschimmelte Erdbeeren zurück, gestern gekauft. Das ist ein Mangel. Du entschuldigst dich, tauschst sie sofort oder erstattest den Preis — ohne Diskussion.',
    merksatz: 'Ein zufrieden gelöster Ärger bindet stärker als ein Einkauf ohne Probleme.',
    falle: 'Der Kassenbon ist kein Pflichtbeleg für die Gewährleistung. Der Kauf kann auch anders nachgewiesen werden, zum Beispiel per Kontoauszug.',
  },
  warenpraesentation: {
    kern: [
      'Im Regal gibt es vier Zonen: Reckzone (ganz oben), Sichtzone (Augenhöhe), Griffzone (Hüfte bis Brust) und Bückzone (ganz unten).',
      'Sicht- und Griffzone verkaufen am besten. Dort stehen Artikel mit hoher Spanne und Impulsartikel.',
      'Mussartikel wie Milch, Brot oder Wasser stehen oft weiter hinten — auf dem Weg dorthin sieht der Kunde das restliche Sortiment.',
    ],
    beispiel:
      'Die Eigenmarke mit der guten Spanne steht auf Augenhöhe, der schwere Wasserkasten unten, die Großpackung Toilettenpapier in der Bückzone.',
    merksatz: 'Was verdienen soll, gehört in Augenhöhe.',
    falle: 'Die Bückzone ist nicht wertlos: dort stehen schwere Artikel und Waren, die Kunden ohnehin gezielt suchen.',
  },
  kasse: {
    kern: [
      'Seit 2020 gilt die Belegausgabepflicht: jeder Kunde muss einen Bon angeboten bekommen, auf Papier oder digital.',
      'Beim Kassieren: Betrag laut nennen, Geldschein bis zum Abschluss sichtbar ablegen, Wechselgeld vorzählen.',
      'Bei Verdacht auf Falschgeld: fühlen, sehen, kippen. Echtes Falschgeld wird nicht zurückgegeben, sondern einbehalten — dann Polizei oder Vorgesetzte informieren.',
    ],
    beispiel:
      'Eine Kundin zahlt 13,40 € mit einem 20-€-Schein. Du legst den Schein sichtbar ab und zählst vor: „13,40 — 50 macht 13,90, 10 macht 14, und 6 macht 20 Euro.“',
    merksatz: 'Schein liegen lassen, bis das Wechselgeld übergeben ist.',
    falle: 'Brutto ist der Preis mit Steuer. Netto rechnest du durch ÷ 1,19 oder ÷ 1,07 aus — nicht durch Abziehen von 19 % oder 7 %.',
  },
  warenannahme: {
    kern: [
      'Zuerst die äußere Prüfung, solange der Fahrer noch da ist: Anschrift, Anzahl der Packstücke, äußere Schäden. Schäden lässt du dir auf dem Lieferschein bestätigen.',
      'Danach, ohne Verzögerung, die innere Prüfung: Menge, Art, Qualität, Mindesthaltbarkeit, Kühltemperatur.',
      'Unter Kaufleuten gilt die Rügepflicht: Mängel müssen unverzüglich gemeldet werden, sonst gilt die Ware als angenommen.',
    ],
    beispiel:
      'Bei der Tiefkühllieferung misst du die Temperatur. Zeigt das Thermometer −12 °C statt −18 °C, verweigerst du die Annahme — die Kühlkette ist unterbrochen.',
    merksatz: 'Äußerlich sofort mit dem Fahrer, innerlich unverzüglich danach.',
    falle: 'Wer einen offensichtlichen Mangel beim zweiseitigen Handelskauf nicht unverzüglich rügt, verliert seine Rechte — auch wenn die Ware wirklich mangelhaft ist.',
  },
  bestandsfuehrung: {
    kern: [
      'Das Warenwirtschaftssystem kennt den Sollbestand: Wareneingänge werden gebucht, jeder Scan an der Kasse zieht ab.',
      'Bei der Inventur wird der Istbestand gezählt. Der Unterschied zwischen Soll und Ist ist die Inventurdifferenz — durch Diebstahl, Bruch, Verderb oder Fehlbuchungen.',
      'Eine Inventur ist nach Handelsrecht mindestens einmal im Jahr Pflicht. Es gibt Stichtagsinventur, verlegte Inventur und permanente Inventur.',
    ],
    beispiel:
      'Das System meldet 48 Gläser Honig, im Regal stehen 43. Fünf Gläser fehlen — vielleicht Bruch, der nicht ausgebucht wurde.',
    merksatz: 'Inventur ist das Zählen, das Inventar ist die Liste, die dabei entsteht.',
    falle: 'Inventur und Inventar werden gern verwechselt: Inventur = Tätigkeit, Inventar = Bestandsverzeichnis.',
  },
  beschaffung: {
    kern: [
      'Beim Bestellpunktverfahren wird bestellt, sobald der Meldebestand erreicht ist. Beim Bestellrhythmusverfahren in festen Abständen, etwa jeden Montag.',
      'Meldebestand = Tagesverbrauch × Lieferzeit + Mindestbestand. Der Mindestbestand ist der eiserne Puffer.',
      'Beim Angebotsvergleich zählt nicht nur der Preis: auch Qualität, Lieferzeit, Zuverlässigkeit und Service.',
    ],
    beispiel:
      'Täglich gehen 40 Packungen Kaffee weg, die Lieferung dauert 3 Tage, der Puffer sind 2 Tage. Meldebestand: 40 × 3 + 80 = 200 Packungen.',
    merksatz: 'Große Bestellungen sparen Bestellkosten, kosten aber Lagerplatz und Kapital — die optimale Menge liegt dazwischen.',
    falle: 'Eine Anfrage ist unverbindlich, ein Angebot ist verbindlich — außer es steht „freibleibend“ oder „solange Vorrat reicht“ dabei.',
  },
  kalkulation: {
    kern: [
      'Bezugskalkulation: Listeneinkaufspreis − Rabatt = Zieleinkaufspreis − Skonto = Bareinkaufspreis + Bezugskosten = Bezugspreis.',
      'Verkaufskalkulation: Bezugspreis + Handlungskosten = Selbstkosten + Gewinn = Nettoverkaufspreis + Umsatzsteuer = Bruttoverkaufspreis.',
      'Rückwärts rechnest du, wenn der Marktpreis feststeht. Differenzkalkulation zeigt den Gewinn, wenn Einkauf und Verkauf feststehen.',
    ],
    beispiel:
      'Joghurt kommt für 0,50 € an. Mit 40 % Handlungskosten sind es 0,70 €, mit 20 % Gewinn 0,84 € netto — plus 7 % Steuer steht er für 0,90 € am Regal.',
    merksatz: 'Vom Hundert, wenn der Grundwert bekannt ist. Im Hundert, wenn der verminderte Wert bekannt ist.',
    falle: 'Umsatzsteuer rausrechnen heißt ÷ 1,19 — nicht minus 19 %. Und Skonto kommt vom Zieleinkaufspreis, nicht vom Listenpreis.',
  },
  lagerkennzahlen: {
    kern: [
      'Der durchschnittliche Lagerbestand ist der Mittelwert aus Anfangsbestand und Zwischenbeständen, geteilt durch die Anzahl der Werte.',
      'Umschlagshäufigkeit = Wareneinsatz ÷ Ø Lagerbestand. Sie sagt, wie oft sich das Lager im Jahr komplett erneuert.',
      'Lagerdauer = 360 ÷ Umschlagshäufigkeit. Lagerzinssatz = Marktzins × Lagerdauer ÷ 360.',
    ],
    beispiel:
      'Frische Milch dreht sich fast jeden Tag, Grillkohle im Winter kaum. Deshalb hat das Molkereiregal eine viel höhere Umschlagshäufigkeit.',
    merksatz: 'Je schneller die Ware dreht, desto weniger Geld liegt im Regal fest.',
    falle: 'Kaufmännisch hat das Jahr 360 Tage. Und beim Ø Lagerbestand mit Quartalswerten teilst du durch 5, nicht durch 4.',
  },
  kaufvertrag: {
    kern: [
      'Ein Kaufvertrag entsteht durch zwei übereinstimmende Willenserklärungen: Antrag und Annahme.',
      'Ware im Regal oder Schaufenster ist noch kein Angebot, sondern eine Einladung. Den Antrag macht der Kunde an der Kasse.',
      'Bei einem Mangel hat der Kunde zwei Jahre Gewährleistung. Zuerst gibt es Nacherfüllung — Reparatur oder neue Ware —, erst danach Rücktritt oder Preisminderung.',
    ],
    beispiel:
      'Am Regal steht aus Versehen 0,99 € statt 9,99 €. Der Markt muss nicht zum falschen Preis verkaufen, weil das Preisschild kein verbindliches Angebot war.',
    merksatz: 'Gewährleistung ist Pflicht, Garantie ist freiwillig, Umtausch ist Kulanz.',
    falle: 'Das 14-tägige Widerrufsrecht gilt nur beim Onlinekauf und bei Haustürgeschäften — nicht im Laden.',
  },
  wirtschaftsordnung: {
    kern: [
      'In Deutschland gilt die soziale Marktwirtschaft: Angebot und Nachfrage bestimmen die Preise, der Staat sorgt für Wettbewerb und sozialen Ausgleich.',
      'Steigt die Nachfrage bei gleichem Angebot, steigt der Preis. Steigt das Angebot bei gleicher Nachfrage, sinkt er.',
      'Marktformen nach Zahl der Anbieter: viele (Polypol), wenige (Oligopol), einer (Monopol).',
    ],
    beispiel:
      'Nach einer schlechten Ernte gibt es weniger Spargel, die Nachfrage bleibt gleich — der Preis steigt.',
    merksatz: 'Bedürfnis + Kaufkraft = Bedarf. Bedarf, der am Markt auftritt, = Nachfrage.',
    falle: 'Beim Maximalprinzip ist der Einsatz fest und der Erfolg soll maximal sein. Beim Minimalprinzip ist das Ziel fest und der Einsatz soll minimal sein.',
  },
  arbeitsrecht: {
    kern: [
      'Die Probezeit in der Ausbildung dauert 1 bis 4 Monate. In dieser Zeit können beide Seiten jederzeit ohne Frist kündigen.',
      'Nach der Probezeit kann der Betrieb nur noch aus wichtigem Grund kündigen. Du selbst kannst mit 4 Wochen Frist kündigen, wenn du die Ausbildung aufgibst oder den Beruf wechselst.',
      'Für Jugendliche unter 18 gilt das Jugendarbeitsschutzgesetz: höchstens 8 Stunden am Tag, 40 in der Woche, keine Arbeit zwischen 20 und 6 Uhr.',
    ],
    beispiel:
      'Wer die Abschlussprüfung vor dem vertraglichen Ende besteht, ist ab Bekanntgabe des Ergebnisses fertig. Arbeitet sie danach einfach weiter, entsteht automatisch ein unbefristetes Arbeitsverhältnis.',
    merksatz: 'Kündigung immer schriftlich — per WhatsApp oder E-Mail ist sie unwirksam.',
    falle: 'Einen Betriebsrat gibt es ab 5 ständigen Beschäftigten, eine Jugend- und Auszubildendenvertretung ab 5 Jugendlichen oder Azubis unter 25 — aber nur, wenn es auch einen Betriebsrat gibt.',
  },
  arbeitsschutz: {
    kern: [
      'HACCP heißt: Gefahren für die Lebensmittelsicherheit erkennen und an kritischen Punkten kontrollieren — etwa Kühltemperaturen messen und dokumentieren.',
      'Tiefkühlware muss bei −18 °C oder kälter bleiben, Hackfleisch bei höchstens +2 °C. Wird die Kühlkette unterbrochen, darf die Ware nicht verkauft werden.',
      'Nach Ablauf des Verbrauchsdatums („zu verbrauchen bis“) ist der Verkauf verboten. Nach dem Mindesthaltbarkeitsdatum darf einwandfreie Ware noch verkauft werden.',
    ],
    beispiel:
      'Joghurt mit abgelaufenem MHD, aber einwandfrei: darf reduziert verkauft werden. Hackfleisch mit abgelaufenem Verbrauchsdatum: sofort raus aus dem Verkauf.',
    merksatz: 'MHD = „mindestens haltbar bis“. Verbrauchsdatum = „bis hier und nicht weiter“.',
    falle: 'Sicherheitszeichen: grün = Rettung, rot = Verbot oder Brandschutz, blau = Gebot, gelb = Warnung.',
  },
  geschaeftsprozesse: {
    kern: [
      'Im Prüfungsbereich Geschäftsprozesse geht es darum, wie der Markt als Ganzes gesteuert wird: Sortiment, Marketing, Personal und Kennzahlen.',
      'Sortimentsbreite = wie viele Warenarten. Sortimentstiefe = wie viel Auswahl je Warenart. Die ABC-Analyse zeigt, welche Artikel den meisten Umsatz bringen.',
      'Kennzahlen machen Entscheidungen begründbar: Durchschnittsbon, Flächenproduktivität, Umsatz je Mitarbeiterstunde, Rohertrag, Deckungsbeitrag.',
    ],
    beispiel:
      'Der Markt stellt fest, dass samstags zwischen 10 und 13 Uhr der Durchschnittsbon am höchsten ist. Er setzt dann mehr Personal an der Frischetheke ein.',
    merksatz: 'In Teil 2 musst du nicht nur rechnen, sondern Entscheidungen begründen können.',
    falle: 'Geschäftsprozesse ist ein Sperrfach: unter 50 Punkten fällst du durch — egal, wie gut der Rest ist.',
  },
}
