// Erzeugt die App-Icons als PNG — ohne externe Abhängigkeiten.
// Motiv: drei steigende Balken (Fortschritt), der höchste in Gold, auf Weinrot.
// Alle Icons sind vollflächig: iOS rundet die Ecken selbst ab und füllt
// Transparenz schwarz auf; die Android-Maske schneidet aus der Mitte.

import { writeFileSync } from 'node:fs'
import { deflateSync } from 'node:zlib'

const CRC_TABELLE = new Uint32Array(256).map((_, n) => {
  let c = n
  for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1
  return c >>> 0
})

function crc32(puffer) {
  let c = 0xffffffff
  for (const b of puffer) c = CRC_TABELLE[(c ^ b) & 0xff] ^ (c >>> 8)
  return (c ^ 0xffffffff) >>> 0
}

function chunk(typ, daten) {
  const laenge = Buffer.alloc(4)
  laenge.writeUInt32BE(daten.length)
  const typUndDaten = Buffer.concat([Buffer.from(typ, 'ascii'), daten])
  const crc = Buffer.alloc(4)
  crc.writeUInt32BE(crc32(typUndDaten))
  return Buffer.concat([laenge, typUndDaten, crc])
}

function png(breite, hoehe, rgba) {
  const ihdr = Buffer.alloc(13)
  ihdr.writeUInt32BE(breite, 0)
  ihdr.writeUInt32BE(hoehe, 4)
  ihdr[8] = 8 // Bittiefe
  ihdr[9] = 6 // RGBA
  const roh = Buffer.alloc((breite * 4 + 1) * hoehe)
  for (let y = 0; y < hoehe; y++) {
    roh[y * (breite * 4 + 1)] = 0 // Filter: keiner
    rgba.copy(roh, y * (breite * 4 + 1) + 1, y * breite * 4, (y + 1) * breite * 4)
  }
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', ihdr),
    chunk('IDAT', deflateSync(roh, { level: 9 })),
    chunk('IEND', Buffer.alloc(0)),
  ])
}

const OBEN = [0xa8, 0x43, 0x5a]
const UNTEN = [0x6e, 0x1f, 0x33]
const WEISS = [0xff, 0xff, 0xff]
const GOLD = [0xf2, 0xc2, 0x6b]

function inAbgerundetemRechteck(x, y, links, oben, rechts, unten, radius) {
  if (x < links || x > rechts || y < oben || y > unten) return false
  const cx = Math.min(Math.max(x, links + radius), rechts - radius)
  const cy = Math.min(Math.max(y, oben + radius), unten - radius)
  return (x - cx) ** 2 + (y - cy) ** 2 <= radius ** 2
}

// Balken in Einheitskoordinaten (0..1), innerhalb der sicheren Zone für maskierbare Icons.
function balken(massstab) {
  const breite = 0.14 * massstab
  const luecke = 0.07 * massstab
  const gesamt = 3 * breite + 2 * luecke
  const start = 0.5 - gesamt / 2
  const boden = 0.5 + 0.24 * massstab
  const hoehen = [0.22, 0.34, 0.48].map((h) => h * massstab)
  return hoehen.map((h, i) => ({
    links: start + i * (breite + luecke),
    rechts: start + i * (breite + luecke) + breite,
    oben: boden - h,
    unten: boden,
    farbe: i === 2 ? GOLD : WEISS,
  }))
}

function zeichne(groesse, massstab = 1) {
  const pixel = Buffer.alloc(groesse * groesse * 4)
  const formen = balken(massstab)
  const radius = 0.035 * massstab
  const UNTERPROBEN = 4

  for (let py = 0; py < groesse; py++) {
    for (let px = 0; px < groesse; px++) {
      const t = py / (groesse - 1)
      let r = 0
      let g = 0
      let b = 0
      for (let sy = 0; sy < UNTERPROBEN; sy++) {
        for (let sx = 0; sx < UNTERPROBEN; sx++) {
          const x = (px + (sx + 0.5) / UNTERPROBEN) / groesse
          const y = (py + (sy + 0.5) / UNTERPROBEN) / groesse
          let farbe = OBEN.map((o, k) => o + (UNTEN[k] - o) * t)
          for (const f of formen) {
            if (inAbgerundetemRechteck(x, y, f.links, f.oben, f.rechts, f.unten, radius)) farbe = f.farbe
          }
          r += farbe[0]
          g += farbe[1]
          b += farbe[2]
        }
      }
      const n = UNTERPROBEN * UNTERPROBEN
      const i = (py * groesse + px) * 4
      pixel[i] = Math.round(r / n)
      pixel[i + 1] = Math.round(g / n)
      pixel[i + 2] = Math.round(b / n)
      pixel[i + 3] = 255
    }
  }
  return png(groesse, groesse, pixel)
}

const ZIEL = new URL('../public/', import.meta.url)
const ausgabe = [
  ['icon-180.png', zeichne(180)],
  ['icon-192.png', zeichne(192)],
  ['icon-512.png', zeichne(512)],
  // Maskierbar: Motiv etwas kleiner, damit es in jeder Maskenform vollständig sichtbar bleibt.
  ['icon-maskable-512.png', zeichne(512, 0.8)],
]
for (const [name, daten] of ausgabe) {
  writeFileSync(new URL(name, ZIEL), daten)
  console.log(`${name}: ${daten.length} Bytes`)
}
