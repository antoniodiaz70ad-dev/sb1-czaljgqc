# Protocolo del Observador

Los cinco filtros del *Protocolo del Observador* — documento personal, agosto 2026 — como
aplicación de teléfono: la ficha siempre a la mano, un corredor para pasar cualquier material
por los filtros en orden, y un registro de lo que se corrió.

## Qué hace

- **Hoy** — la práctica del día: el interruptor marcado, la racha de días seguidos, un filtro
  distinto cada día para releerlo, los materiales sin terminar y los retenidos.
- **Correr un material** — siete pantallas en orden: el interruptor (con los tres segundos
  cronometrados, no se saltan), estrato, genealogía, auto-auditoría, separador, convergencia y
  la regla de cierre. Cada filtro dispara su alarma solo y dice qué hay que resolver.
- **Veredicto** — *pasa*, *retenido* o *en curso*, más un nivel de confianza de 0 a 6: los filtros
  superados en orden antes de la primera alarma. Un material retenido no avanza de nivel; se
  queda donde está hasta resolverse.
- **Ficha** — el documento completo, offline, para consultarlo sin correr nada.
- **Registro** — todo lo corrido, filtrable, con exportar/importar en JSON y copia en texto plano.

## En el teléfono

La aplicación es una PWA: se instala desde el navegador con *Añadir a la pantalla de inicio* y
abre a pantalla completa, sin barra de direcciones. Una vez abierta, funciona sin señal.

Todo se guarda en el `localStorage` del propio navegador. Nada se envía a ningún servidor —
por eso conviene exportar el respaldo antes de cambiar de teléfono o borrar datos del sitio.

## Rutas

| Ruta | Aplicación |
| --- | --- |
| `/` | Protocolo del Observador |
| `/#/solar` | Plataforma LEVI-SOLAR1 (se carga aparte, no pesa en el arranque) |

## Desarrollo

```bash
npm install
npm run dev      # servidor de desarrollo
npm run build    # compilación de producción
npm run preview  # sirve la compilación (necesario para probar el service worker)
npm run lint
```

## Estructura

```
src/observador/
  protocolo.ts        los cinco filtros, los cajones, la regla de cierre
  tipos.ts            forma de una evaluación
  logica.ts           cuándo dispara cada alarma, veredicto, nivel, racha
  almacen.ts          persistencia en localStorage
  ObservadorApp.tsx   pestañas y navegación
  vistas/             Hoy · Corredor · Ficha · Registro
  ui/                 piezas compartidas y el círculo de tres segundos
```

El estado de cada filtro nunca se guarda: se deriva siempre de las respuestas en `logica.ts`,
así que cambiar una regla recalcula el registro entero.
