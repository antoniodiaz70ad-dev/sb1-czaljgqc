/*
 * Genera los iconos PNG de la PWA desde código, para no versionar binarios.
 * Se ejecuta solo en `npm run dev` y `npm run build` (hooks predev/prebuild).
 */
import { deflateSync } from 'node:zlib';
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const SALIDA = resolve(dirname(fileURLToPath(import.meta.url)), '..', 'public');
const FONDO = [0x09, 0x09, 0x0b];
const AMBAR = [0xfb, 0xbf, 0x24];
const TAMANOS = [180, 192, 512];

const TABLA_CRC = (() => {
  const t = new Uint32Array(256);
  for (let n = 0; n < 256; n += 1) {
    let c = n;
    for (let k = 0; k < 8; k += 1) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c >>> 0;
  }
  return t;
})();

function crc32(buf) {
  let c = 0xffffffff;
  for (const b of buf) c = TABLA_CRC[(c ^ b) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

function trozo(tipo, datos) {
  const largo = Buffer.alloc(4);
  largo.writeUInt32BE(datos.length);
  const cuerpo = Buffer.concat([Buffer.from(tipo, 'ascii'), datos]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(cuerpo));
  return Buffer.concat([largo, cuerpo, crc]);
}

function png(ancho, alto, pixeles) {
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(ancho, 0);
  ihdr.writeUInt32BE(alto, 4);
  ihdr[8] = 8; // bits por canal
  ihdr[9] = 2; // color RGB
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    trozo('IHDR', ihdr),
    trozo('IDAT', deflateSync(pixeles, { level: 9 })),
    trozo('IEND', Buffer.alloc(0)),
  ]);
}

/** El ojo: anillo exterior, iris y pupila, con antialiasing por supermuestreo 3×3. */
function dibujar(n) {
  const filas = Buffer.alloc(n * (n * 3 + 1));
  const centro = (n - 1) / 2;
  const rExterior = n * 0.36;
  const rIris = n * 0.265;
  const rPupila = n * 0.115;
  const grosor = n * 0.055;

  for (let y = 0; y < n; y += 1) {
    const base = y * (n * 3 + 1);
    filas[base] = 0; // filtro None
    for (let x = 0; x < n; x += 1) {
      let cobertura = 0;
      for (let sy = 0; sy < 3; sy += 1) {
        for (let sx = 0; sx < 3; sx += 1) {
          const d = Math.hypot(x + (sx + 0.5) / 3 - centro, y + (sy + 0.5) / 3 - centro);
          const anillo = d <= rExterior && d >= rExterior - grosor;
          const iris = d <= rIris && d >= rIris - grosor * 0.55;
          if (anillo || iris || d <= rPupila) cobertura += 1;
        }
      }
      const a = cobertura / 9;
      const o = base + 1 + x * 3;
      for (let k = 0; k < 3; k += 1) filas[o + k] = Math.round(FONDO[k] * (1 - a) + AMBAR[k] * a);
    }
  }
  return png(n, n, filas);
}

mkdirSync(SALIDA, { recursive: true });
for (const n of TAMANOS) {
  writeFileSync(resolve(SALIDA, `icono-${n}.png`), dibujar(n));
}
console.log(`iconos generados en public/: ${TAMANOS.map((n) => `icono-${n}.png`).join(', ')}`);
