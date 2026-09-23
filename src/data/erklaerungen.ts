/**
 * „Kurz erklärt“: jedes Thema auf einem Bildschirm, in Alltagssprache.
 * Aufbau: worum es geht, ein Beispiel aus dem Markt, ein Merksatz und die typische Prüfungsfalle.
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
      'Ein Verkaufsgespräch läuft in Phasen ab: Kontakt aufnehmen, Bedarf ermitteln, Ware vorlegen, argumentieren, Einwände behandeln, Preis nennen, Kauf abschließen, Ergänzungsangebot machen, verabschieden.',
      'Am meisten hängt an der Bedarfsermittlung. Mit offenen Fragen, auch W-Fragen genannt („Für wie viele Personen soll es sein?“), findest du heraus, was die Kundin braucht.',
      'Beim Argumentieren sprichst du vom Nutzen für die Kundin und weniger von technischen Daten. Diese Art zu formulieren heißt Sie-Stil.',
    ],
    beispiel:
      'Merkmal: „Der Käse ist 12 Monate gereift.“ Nutzen im Sie-Stil: „Durch die lange Reifung schmeckt er kräftig und nussig. Damit haben Sie auf Ihrer Käseplatte etwas Würziges.“',
    merksatz: 'Wer zuerst fragt, muss hinterher weniger überreden.',
    falle: 'Auf geschlossene Fragen antwortet der Kunde mit Ja oder Nein. In der Bedarfsermittlung erfährst du damit zu wenig. Sie passen eher zum Abschluss, etwa „Darf ich Ihnen den Käse einpacken?“',
  },
  kundenkommunikation: {
    kern: [
      'Bei einer Reklamation hat die Ware einen Mangel, und der Kunde hat gesetzliche Rechte. Bei einer Beschwerde ärgert er sich über etwas anderes, zum Beispiel über lange Schlangen an der Kasse. Einen Rechtsanspruch hat er dann nicht.',
      'Will jemand einwandfreie Ware zurückgeben, ist ein Umtausch Kulanz. Ein gesetzliches Rückgaberecht für Käufe im Laden gibt es nicht.',
      'Im Gespräch hörst du zuerst zu und zeigst Verständnis. Rechtfertigungen bringen wenig. Biete lieber zügig eine Lösung an.',
    ],
    beispiel:
      'Eine Kundin bringt Erdbeeren zurück, die sie gestern gekauft hat. Sie sind verschimmelt, das ist ein Mangel. Du entschuldigst dich und gibst ihr frische Erdbeeren oder das Geld zurück, ohne lange zu diskutieren.',
    merksatz: 'Eine gut gelöste Reklamation macht aus einem verärgerten Kunden oft einen Stammkunden.',
    falle: 'Für die Gewährleistung braucht der Kunde keinen Kassenbon. Er kann den Kauf auch anders nachweisen, zum Beispiel mit dem Kontoauszug.',
  },
  warenpraesentation: {
    kern: [
      'Ein Regal hat vier Zonen. Ganz oben ist die Reckzone, auf Augenhöhe die Sichtzone, zwischen Hüfte und Brust die Griffzone und ganz unten die Bückzone.',
      'In der Sicht- und Griffzone verkauft sich am meisten. Dort platzierst du Artikel mit hoher Spanne und Impulsartikel.',
      'Artikel, die fast jeder kauft, heißen Mussartikel: Milch, Brot, Wasser. Sie stehen oft weit hinten im Markt. Auf dem Weg dorthin kommt der Kunde am übrigen Sortiment vorbei.',
    ],
    beispiel:
      'Die Eigenmarke mit der guten Spanne steht auf Augenhöhe. Wasserkisten und die Großpackung Toilettenpapier stehen unten in der Bückzone.',
    merksatz: 'Blickhöhe ist Kaufhöhe.',
    falle: 'Die Bückzone ist nicht wertlos. Dort stehen schwere Artikel und Waren, nach denen Kunden ohnehin gezielt suchen.',
  },
  kasse: {
    kern: [
      'Seit 2020 gilt die Belegausgabepflicht. Jeder Kunde bekommt einen Bon angeboten, auf Papier oder digital. Mitnehmen muss er ihn nicht.',
      'Beim Kassieren nennst du den Betrag laut. Den Geldschein legst du sichtbar ab, bis das Wechselgeld übergeben ist, und du zählst das Wechselgeld vor.',
      'Verdächtige Scheine prüfst du nach der Regel „Fühlen, Sehen, Kippen“. Einen Schein, der dir falsch vorkommt, gibst du nicht zurück. Du behältst ihn ein und informierst die Marktleitung und die Polizei.',
    ],
    beispiel:
      'Eine Kundin zahlt 13,40 € mit einem 20-€-Schein. Der Schein bleibt sichtbar liegen, und du zählst vor: „13,40, 10 Cent dazu macht 13,50, 50 Cent macht 14, ein Euro macht 15 und fünf Euro macht 20.“',
    merksatz: 'Der Schein bleibt liegen, bis das Wechselgeld übergeben ist.',
    falle: 'Brutto ist der Preis mit Steuer. Den Nettopreis bekommst du, indem du durch 1,19 oder 1,07 teilst. Wer 19 % oder 7 % abzieht, bekommt ein falsches Ergebnis.',
  },
  warenannahme: {
    kern: [
      'Die äußere Prüfung machst du, solange der Fahrer noch da ist. Stimmen Anschrift und Zahl der Packstücke? Gibt es sichtbare Schäden? Schäden lässt du dir vom Fahrer auf dem Lieferschein bestätigen.',
      'Danach folgt ohne Verzögerung die innere Prüfung. Du kontrollierst Menge, Art und Qualität der Ware, das Mindesthaltbarkeitsdatum und bei Kühlware die Temperatur.',
      'Unter Kaufleuten gilt die Rügepflicht nach § 377 HGB. Mängel musst du dem Lieferanten unverzüglich melden, sonst gilt die Ware als genehmigt.',
    ],
    beispiel:
      'Bei der Tiefkühllieferung misst du die Temperatur. Zeigt das Thermometer −12 °C statt −18 °C, nimmst du die Ware nicht an, weil die Kühlkette unterbrochen war.',
    merksatz: 'Äußere Prüfung sofort mit dem Fahrer, innere Prüfung unverzüglich danach.',
    falle: 'Beim zweiseitigen Handelskauf (beide Seiten sind Kaufleute) verliert der Käufer seine Rechte, wenn er einen offenen Mangel nicht unverzüglich rügt. Das gilt auch dann, wenn die Ware wirklich mangelhaft ist.',
  },
  bestandsfuehrung: {
    kern: [
      'Das Warenwirtschaftssystem führt den Sollbestand. Jeder gebuchte Wareneingang erhöht ihn, jeder Scan an der Kasse verringert ihn.',
      'Bei der Inventur zählst du, was wirklich da ist. Das ist der Istbestand. Weichen Soll und Ist voneinander ab, heißt das Inventurdifferenz. Ursachen sind Diebstahl, Bruch, Verderb oder Fehlbuchungen.',
      'Nach dem Handelsrecht muss mindestens einmal im Jahr eine Inventur stattfinden. Die Formen heißen Stichtagsinventur, verlegte Inventur und permanente Inventur.',
    ],
    beispiel:
      'Laut System stehen 48 Gläser Honig im Markt, im Regal zählst du 43. Es fehlen fünf Gläser. Vielleicht sind Gläser zerbrochen und wurden nicht ausgebucht.',
    merksatz: 'Das Soll steht im System, das Ist steht im Regal.',
    falle: 'Inventur und Inventar werden oft verwechselt. Die Inventur ist das Zählen. Das Inventar ist das Verzeichnis, das dabei entsteht.',
  },
  beschaffung: {
    kern: [
      'Beim Bestellpunktverfahren bestellst du, sobald der Meldebestand erreicht ist. Beim Bestellrhythmusverfahren bestellst du in festen Abständen, zum Beispiel jeden Montag.',
      'Meldebestand = Tagesverbrauch × Lieferzeit + Mindestbestand. Der Mindestbestand, auch eiserner Bestand genannt, ist die Reserve für Lieferverzug oder plötzlich hohe Nachfrage.',
      'Beim Angebotsvergleich zählen neben dem Preis auch Qualität, Lieferzeit, Zuverlässigkeit und Service des Lieferanten.',
    ],
    beispiel:
      'Vom Kaffee gehen täglich 40 Packungen weg. Die Lieferung dauert 3 Tage, als Reserve sollen 2 Tage reichen. Der Mindestbestand ist 40 × 2 = 80 Packungen, der Meldebestand 40 × 3 + 80 = 200 Packungen.',
    merksatz: 'Große Bestellungen sparen Bestellkosten, binden aber Lagerplatz und Geld. Die optimale Bestellmenge liegt dazwischen.',
    falle: 'Eine Anfrage ist unverbindlich, ein Angebot ist verbindlich. Das ändert sich nur durch eine Freizeichnungsklausel wie „freibleibend“ oder „solange der Vorrat reicht“.',
  },
  kalkulation: {
    kern: [
      'Bezugskalkulation: Listeneinkaufspreis − Rabatt = Zieleinkaufspreis − Skonto = Bareinkaufspreis + Bezugskosten = Bezugspreis.',
      'Verkaufskalkulation: Bezugspreis + Handlungskosten = Selbstkosten + Gewinn = Nettoverkaufspreis + Umsatzsteuer = Bruttoverkaufspreis.',
      'Steht der Verkaufspreis durch den Markt fest, rechnest du rückwärts (Rückwärtskalkulation). Stehen Einkaufs- und Verkaufspreis fest, zeigt die Differenzkalkulation, wie viel Gewinn übrig bleibt.',
    ],
    beispiel:
      'Ein Joghurt hat einen Bezugspreis von 0,50 €. Mit 40 % Handlungskosten kommst du auf 0,70 € Selbstkosten, mit 20 % Gewinn auf 0,84 € netto. Mit 7 % Umsatzsteuer sind das 0,8988 €, am Regal steht er für 0,90 €.',
    merksatz: 'Vom Hundert: Die 100 % sind bekannt. Im Hundert: Bekannt ist der Wert nach dem Abzug.',
    falle: 'Umsatzsteuer rausrechnen heißt durch 1,19 teilen, nicht 19 % abziehen. Und Skonto rechnest du vom Zieleinkaufspreis aus, nicht vom Listenpreis.',
  },
  lagerkennzahlen: {
    kern: [
      'Für den durchschnittlichen Lagerbestand zählst du den Anfangsbestand und die Endbestände der Quartale oder Monate zusammen. Die Summe teilst du durch die Anzahl der Werte.',
      'Umschlagshäufigkeit = Wareneinsatz ÷ Ø Lagerbestand. Sie gibt an, wie oft der durchschnittliche Lagerbestand im Jahr verkauft und wieder aufgefüllt wird.',
      'Lagerdauer = 360 ÷ Umschlagshäufigkeit. Lagerzinssatz = Marktzins × Lagerdauer ÷ 360.',
    ],
    beispiel:
      'Frische Milch ist oft nach ein, zwei Tagen verkauft, Grillkohle steht im Winter wochenlang im Regal. Das Molkereiregal hat deshalb eine viel höhere Umschlagshäufigkeit.',
    merksatz: 'Je schneller die Ware verkauft ist, desto weniger Geld steckt im Lager fest.',
    falle: 'Kaufmännisch hat das Jahr 360 Tage. Bei Quartalswerten teilst du für den Ø Lagerbestand durch 5, weil der Anfangsbestand mitzählt.',
  },
  kaufvertrag: {
    kern: [
      'Ein Kaufvertrag kommt durch zwei übereinstimmende Willenserklärungen zustande: Antrag und Annahme.',
      'Ware im Regal oder im Schaufenster ist rechtlich noch kein Angebot. Sie ist eine Aufforderung an den Kunden, selbst ein Angebot zu machen. Den Antrag stellt der Kunde an der Kasse.',
      'Hat die Ware einen Mangel, gilt die gesetzliche Gewährleistung von zwei Jahren. Zuerst kommt die Nacherfüllung: Der Kunde bekommt die Ware repariert oder neue Ware. Erst wenn das scheitert, kann er vom Vertrag zurücktreten oder den Preis mindern.',
    ],
    beispiel:
      'Am Regal steht aus Versehen 0,99 € statt 9,99 €. Der Markt muss den Artikel nicht zum falschen Preis verkaufen, weil das Preisschild kein verbindliches Angebot ist.',
    merksatz: 'Gewährleistung ist Pflicht, Garantie ist freiwillig, Umtausch ist Kulanz.',
    falle: 'Das 14-tägige Widerrufsrecht haben Verbraucher bei Käufen im Internet, am Telefon oder per Katalog und bei Verträgen außerhalb von Geschäftsräumen, etwa an der Haustür. Für Käufe im Laden gilt es nicht.',
  },
  wirtschaftsordnung: {
    kern: [
      'In Deutschland gilt die soziale Marktwirtschaft. Angebot und Nachfrage bestimmen die Preise. Der Staat schützt den Wettbewerb und sorgt für sozialen Ausgleich.',
      'Steigt die Nachfrage und das Angebot bleibt gleich, steigt der Preis. Steigt das Angebot und die Nachfrage bleibt gleich, sinkt der Preis.',
      'Nach der Zahl der Anbieter unterscheidet man Polypol (viele Anbieter), Oligopol (wenige Anbieter) und Monopol (ein Anbieter).',
    ],
    beispiel:
      'Nach einer schlechten Ernte gibt es weniger Spargel. Die Kunden wollen trotzdem so viel wie sonst, deshalb steigt der Preis.',
    merksatz: 'Bedürfnis + Kaufkraft = Bedarf. Bedarf, der am Markt auftritt, ist Nachfrage.',
    falle: 'Maximal- und Minimalprinzip werden gern vertauscht. Beim Maximalprinzip steht der Einsatz fest, und du willst damit so viel wie möglich erreichen. Beim Minimalprinzip steht das Ziel fest, und du willst es mit möglichst wenig Einsatz erreichen.',
  },
  arbeitsrecht: {
    kern: [
      'Die Probezeit in der Ausbildung dauert mindestens einen und höchstens vier Monate. In dieser Zeit können beide Seiten jederzeit ohne Kündigungsfrist kündigen.',
      'Nach der Probezeit kann der Betrieb nur noch aus wichtigem Grund kündigen. Du selbst kannst mit einer Frist von 4 Wochen kündigen, wenn du die Ausbildung aufgibst oder einen anderen Beruf lernen willst.',
      'Für Jugendliche unter 18 gilt das Jugendarbeitsschutzgesetz: höchstens 8 Stunden am Tag und 40 Stunden in der Woche, keine Arbeit zwischen 20 und 6 Uhr.',
    ],
    beispiel:
      'Wer die Abschlussprüfung vor dem Vertragsende besteht, ist mit der Bekanntgabe des Ergebnisses durch den Prüfungsausschuss fertig. Arbeitet sie danach im Betrieb weiter, ohne dass etwas anderes vereinbart wurde, gilt ein unbefristetes Arbeitsverhältnis als geschlossen.',
    merksatz: 'Eine Kündigung muss schriftlich sein. Per WhatsApp oder E-Mail ist sie unwirksam.',
    falle: 'Einen Betriebsrat können die Beschäftigten ab 5 ständigen wahlberechtigten Arbeitnehmern wählen. Eine Jugend- und Auszubildendenvertretung kann ab 5 Jugendlichen oder Azubis unter 25 gewählt werden, aber nur, wenn es im Betrieb einen Betriebsrat gibt.',
  },
  arbeitsschutz: {
    kern: [
      'HACCP ist ein Konzept für Lebensmittelsicherheit. Du stellst fest, an welchen Stellen Gefahren entstehen können, und kontrollierst diese kritischen Punkte regelmäßig. Ein Beispiel ist das Messen und Aufschreiben der Kühltemperaturen.',
      'Tiefkühlware muss bei −18 °C oder kälter bleiben, Hackfleisch bei höchstens +2 °C. Ist die Kühlkette unterbrochen, darf die Ware nicht verkauft werden.',
      'Nach Ablauf des Verbrauchsdatums („zu verbrauchen bis“) darf die Ware nicht mehr verkauft werden. Nach dem Mindesthaltbarkeitsdatum darf einwandfreie Ware weiter verkauft werden. Für die Qualität steht dann der Markt ein.',
    ],
    beispiel:
      'Ein Joghurt hat das MHD überschritten, ist aber einwandfrei: Er darf reduziert verkauft werden. Beim Hackfleisch ist das Verbrauchsdatum abgelaufen: Es muss sofort aus dem Verkauf.',
    merksatz: 'Nach dem MHD prüfen und reduzieren, nach dem Verbrauchsdatum aussortieren.',
    falle: 'Die Farben der Sicherheitszeichen werden oft verwechselt. Grün steht für Rettung und Erste Hilfe, Rot für Verbot und Brandschutz, Blau für Gebot, Gelb für Warnung.',
  },
  geschaeftsprozesse: {
    kern: [
      'Im Prüfungsbereich Geschäftsprozesse geht es um die Steuerung des ganzen Marktes: Sortiment, Marketing, Personal und Kennzahlen.',
      'Die Sortimentsbreite gibt an, wie viele verschiedene Warenarten der Markt führt. Die Sortimentstiefe gibt an, wie viel Auswahl es innerhalb einer Warenart gibt. Mit der ABC-Analyse findest du heraus, welche Artikel den größten Teil des Umsatzes bringen.',
      'Mit Kennzahlen begründest du Entscheidungen. Häufig gefragt sind Durchschnittsbon, Flächenproduktivität, Umsatz je Mitarbeiterstunde, Rohertrag und Deckungsbeitrag.',
    ],
    beispiel:
      'Die Auswertung zeigt, dass der Durchschnittsbon samstags zwischen 10 und 13 Uhr am höchsten ist. Der Markt plant deshalb in dieser Zeit mehr Personal an der Frischetheke ein.',
    merksatz: 'Rechne das Ergebnis aus und schreib dazu, was der Markt daraus machen sollte.',
    falle: 'Geschäftsprozesse ist ein Sperrfach. Mit weniger als 50 Punkten ist die ganze Prüfung nicht bestanden, auch wenn der Rest gut war. Dann kannst du eine mündliche Ergänzungsprüfung von etwa 15 Minuten beantragen, wenn sie für das Bestehen den Ausschlag geben kann.',
  },
}
