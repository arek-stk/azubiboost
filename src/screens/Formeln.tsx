import { Kopf } from '../components/ui'

const ABSCHNITTE: { titel: string; formeln: { name: string; formel: string; hinweis?: string }[] }[] = [
  {
    titel: 'Bezugskalkulation',
    formeln: [
      {
        name: 'Vom Listenpreis zum Bezugspreis',
        formel:
          'Listeneinkaufspreis\n− Liefererrabatt\n= Zieleinkaufspreis\n− Liefererskonto\n= Bareinkaufspreis\n+ Bezugskosten\n= Bezugspreis',
        hinweis: 'Skonto vom Zieleinkaufspreis rechnen, nicht vom Listenpreis.',
      },
    ],
  },
  {
    titel: 'Verkaufskalkulation',
    formeln: [
      {
        name: 'Vorwärts',
        formel:
          'Bezugspreis\n+ Handlungskosten (vom Hundert)\n= Selbstkosten\n+ Gewinn (vom Hundert)\n= Barverkaufspreis\n+ Kundenskonto (im Hundert)\n= Zielverkaufspreis\n+ Kundenrabatt (im Hundert)\n= Nettoverkaufspreis\n+ Umsatzsteuer\n= Bruttoverkaufspreis',
      },
      {
        name: 'Im Hundert einrechnen',
        formel: 'Wert ÷ (100 − Prozentsatz) × 100',
        hinweis: 'Für Kundenskonto und Kundenrabatt — der bekannte Wert ist schon der verminderte.',
      },
      {
        name: 'Rückwärts',
        formel:
          'Bruttoverkaufspreis ÷ 1,19\n= Nettoverkaufspreis ÷ (100 + Gewinn) × 100\n= Selbstkosten ÷ (100 + Handlungskosten) × 100\n= höchster Bezugspreis',
      },
      { name: 'Differenzkalkulation', formel: 'Nettoverkaufspreis − Selbstkosten = Gewinn' },
    ],
  },
  {
    titel: 'Spanne, Zuschlag, Faktor',
    formeln: [
      { name: 'Handelsspanne', formel: '(Nettoverkaufspreis − Bezugspreis) ÷ Nettoverkaufspreis × 100' },
      { name: 'Kalkulationszuschlag', formel: '(Nettoverkaufspreis − Bezugspreis) ÷ Bezugspreis × 100' },
      { name: 'Kalkulationsfaktor', formel: 'Nettoverkaufspreis ÷ Bezugspreis' },
    ],
  },
  {
    titel: 'Umsatzsteuer',
    formeln: [
      { name: 'Netto → Brutto', formel: 'Netto × 1,19   (Lebensmittel: × 1,07)' },
      { name: 'Brutto → Netto', formel: 'Brutto ÷ 1,19   (Lebensmittel: ÷ 1,07)', hinweis: 'Nie 19 % vom Bruttopreis abziehen.' },
      { name: 'Zahllast', formel: 'Umsatzsteuer − Vorsteuer' },
    ],
  },
  {
    titel: 'Lager',
    formeln: [
      {
        name: 'Ø Lagerbestand',
        formel: '(Anfangsbestand + Endbestände) ÷ Anzahl der Werte',
        hinweis: 'Jahresanfang + 4 Quartale = 5 Werte. Jahresanfang + 12 Monate = 13 Werte.',
      },
      { name: 'Umschlagshäufigkeit', formel: 'Wareneinsatz ÷ Ø Lagerbestand' },
      { name: 'Ø Lagerdauer', formel: '360 ÷ Umschlagshäufigkeit' },
      { name: 'Lagerzinssatz', formel: 'Marktzinssatz × Ø Lagerdauer ÷ 360' },
      { name: 'Lagerzinsen', formel: 'Ø Lagerbestand × Lagerzinssatz ÷ 100' },
    ],
  },
  {
    titel: 'Bestellung',
    formeln: [
      { name: 'Mindestbestand', formel: 'Tagesverbrauch × Sicherheitstage' },
      { name: 'Meldebestand', formel: 'Tagesverbrauch × Lieferzeit + Mindestbestand' },
      { name: 'Skonto als Jahreszins', formel: 'Skontosatz × 360 ÷ (Zahlungsziel − Skontofrist)' },
    ],
  },
  {
    titel: 'Kennzahlen im Markt',
    formeln: [
      { name: 'Durchschnittsbon', formel: 'Umsatz ÷ Anzahl der Kunden' },
      { name: 'Flächenproduktivität', formel: 'Umsatz ÷ Verkaufsfläche in m²' },
      { name: 'Umsatz je Mitarbeiterstunde', formel: 'Umsatz ÷ geleistete Arbeitsstunden' },
      { name: 'Rohertrag', formel: 'Nettoumsatz − Wareneinsatz' },
      { name: 'Deckungsbeitrag', formel: 'Erlös − variable Kosten' },
      { name: 'Schwundquote', formel: 'Inventurdifferenz ÷ Umsatz × 100' },
    ],
  },
]

export function Formeln() {
  return (
    <>
      <Kopf titel="Formelsammlung" klein />
      {ABSCHNITTE.map((a) => (
        <section className="abschnitt" key={a.titel}>
          <h2>{a.titel}</h2>
          {a.formeln.map((f) => (
            <div className="karte" key={f.name} style={{ gap: 8 }}>
              <h3>{f.name}</h3>
              <p className="formel" style={{ whiteSpace: 'pre-line' }}>{f.formel}</p>
              {f.hinweis !== undefined && <p className="schritt__hinweis">{f.hinweis}</p>}
            </div>
          ))}
        </section>
      ))}
    </>
  )
}
