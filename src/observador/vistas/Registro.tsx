import { useMemo, useRef, useState } from 'react';
import { ChevronRight, Download, Trash2, Upload } from 'lucide-react';
import { FILTROS } from '../protocolo';
import { evaluar, fechaCorta, TEXTO_VEREDICTO } from '../logica';
import type { Almacen } from '../almacen';
import type { EstadoApp, Evaluacion, Veredicto } from '../tipos';
import { Boton, Tarjeta } from '../ui/basicos';

const FILTROS_LISTA: { id: Veredicto | 'todos'; nombre: string }[] = [
  { id: 'todos', nombre: 'Todos' },
  { id: 'retenido', nombre: 'Retenidos' },
  { id: 'en_curso', nombre: 'En curso' },
  { id: 'pasa', nombre: 'Pasaron' },
];

const COLOR_VEREDICTO: Record<Veredicto, string> = {
  pasa: 'border-emerald-800/70 bg-emerald-950/40 text-emerald-300',
  retenido: 'border-red-800/70 bg-red-950/40 text-red-300',
  en_curso: 'border-zinc-700 bg-zinc-800/60 text-zinc-400',
};

export default function Registro({
  almacen,
  onAbrir,
  filtroInicial = 'todos',
}: {
  almacen: Almacen;
  onAbrir: (id: string) => void;
  filtroInicial?: Veredicto | 'todos';
}) {
  const [filtro, setFiltro] = useState<Veredicto | 'todos'>(filtroInicial);
  const [porBorrar, setPorBorrar] = useState<string | null>(null);
  const [aviso, setAviso] = useState('');
  const archivo = useRef<HTMLInputElement>(null);

  const lista = useMemo(() => {
    const todas = [...almacen.estado.evaluaciones].sort(
      (a, b) => +new Date(b.actualizada) - +new Date(a.actualizada),
    );
    return filtro === 'todos' ? todas : todas.filter((e) => evaluar(e).veredicto === filtro);
  }, [almacen.estado.evaluaciones, filtro]);

  const exportar = async () => {
    const contenido = JSON.stringify(almacen.estado, null, 2);
    const nombre = `observador-${new Date().toISOString().slice(0, 10)}.json`;
    setAviso(await guardarArchivo(nombre, contenido));
  };

  const importar = async (f: File) => {
    try {
      const datos = JSON.parse(await f.text()) as EstadoApp;
      if (!Array.isArray(datos.evaluaciones)) throw new Error('formato');
      almacen.importar(datos);
    } catch {
      window.alert('El archivo no tiene el formato del respaldo.');
    }
  };

  return (
    <div className="space-y-4 pb-4">
      <header className="pt-1">
        <h1 className="text-[26px] font-semibold leading-tight text-zinc-50">Registro</h1>
        <p className="mt-1 text-[13px] text-zinc-500">
          {almacen.estado.evaluaciones.length}{' '}
          {almacen.estado.evaluaciones.length === 1 ? 'material corrido' : 'materiales corridos'}
        </p>
      </header>

      <div className="flex gap-2 overflow-x-auto pb-1">
        {FILTROS_LISTA.map((f) => (
          <button
            key={f.id}
            type="button"
            onClick={() => setFiltro(f.id)}
            className={`shrink-0 rounded-full border px-3.5 py-1.5 text-[13px] ${
              filtro === f.id
                ? 'border-amber-400/70 bg-amber-400/10 text-amber-200'
                : 'border-zinc-800 bg-zinc-900/40 text-zinc-400'
            }`}
          >
            {f.nombre}
          </button>
        ))}
      </div>

      {lista.length === 0 ? (
        <Tarjeta className="text-center">
          <p className="text-[14px] text-zinc-500">Nada aquí todavía.</p>
        </Tarjeta>
      ) : (
        <div className="space-y-2">
          {lista.map((e) => {
            const r = evaluar(e);
            return (
              <div
                key={e.id}
                className="rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-3"
              >
                <button
                  type="button"
                  onClick={() => onAbrir(e.id)}
                  className="flex w-full items-start gap-3 text-left"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[15px] text-zinc-100">{e.titulo || 'Material sin título'}</p>
                    {e.fuente && <p className="truncate text-[12px] text-zinc-500">{e.fuente}</p>}
                    <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                      <span
                        className={`rounded-full border px-2 py-0.5 text-[11px] ${COLOR_VEREDICTO[r.veredicto]}`}
                      >
                        {TEXTO_VEREDICTO[r.veredicto].etiqueta}
                      </span>
                      {r.retenidoEn !== null && (
                        <span className="text-[11px] text-zinc-500">
                          filtro {r.retenidoEn} · {FILTROS[r.retenidoEn].nombre}
                        </span>
                      )}
                      <span className="text-[11px] text-zinc-600">{fechaCorta(e.actualizada)}</span>
                    </div>
                  </div>
                  <ChevronRight size={16} className="mt-1 shrink-0 text-zinc-600" />
                </button>

                <div className="mt-2 flex items-center gap-2 border-t border-zinc-800/70 pt-2">
                  <button
                    type="button"
                    onClick={async () => setAviso(await copiar(textoMarkdown(e)))}
                    className="text-[12px] text-zinc-500 active:text-zinc-300"
                  >
                    Copiar como texto
                  </button>
                  <span className="flex-1" />
                  {porBorrar === e.id ? (
                    <>
                      <button
                        type="button"
                        onClick={() => setPorBorrar(null)}
                        className="text-[12px] text-zinc-500"
                      >
                        Cancelar
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          almacen.borrar(e.id);
                          setPorBorrar(null);
                        }}
                        className="text-[12px] font-medium text-red-300"
                      >
                        Borrar
                      </button>
                    </>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setPorBorrar(e.id)}
                      aria-label="Borrar evaluación"
                      className="text-zinc-600"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <Tarjeta>
        <p className="mb-3 text-[13px] font-medium uppercase tracking-wide text-zinc-400">Respaldo</p>
        <div className="flex gap-2">
          <Boton variante="suave" onClick={() => void exportar()} className="flex-1">
            <Download size={15} className="mr-1.5 inline" /> Exportar
          </Boton>
          <Boton variante="fantasma" onClick={() => archivo.current?.click()} className="flex-1">
            <Upload size={15} className="mr-1.5 inline" /> Importar
          </Boton>
        </div>
        <input
          ref={archivo}
          type="file"
          accept="application/json"
          className="hidden"
          onChange={(ev) => {
            const f = ev.target.files?.[0];
            if (f) void importar(f);
            ev.target.value = '';
          }}
        />
        <p className="mt-2 text-[12px] leading-relaxed text-zinc-600">
          El registro vive en este navegador. Exporta antes de cambiar de teléfono o borrar datos del sitio.
        </p>
        {aviso && <p className="mt-2 text-[12px] text-amber-300">{aviso}</p>}
      </Tarjeta>

      <p className="pt-1 text-center text-[12px] text-zinc-700">
        <a href="#/solar" className="underline underline-offset-2">
          Plataforma LEVI-SOLAR1
        </a>
      </p>
    </div>
  );
}

/**
 * Guardar el respaldo. En un navegador normal es una descarga; dentro de una
 * página publicada de claude.ai la descarga directa está bloqueada y hay que
 * pedirla por la capacidad `downloads`, que confirma con quien la ve.
 */
async function guardarArchivo(nombre: string, contenido: string): Promise<string> {
  const anfitrion = (window as unknown as { claude?: AnfitrionClaude }).claude;
  if (anfitrion?.use) {
    try {
      const descargas = await anfitrion.use('downloads');
      if (descargas) {
        await descargas.save({ filename: nombre, data: contenido });
        return 'Respaldo guardado.';
      }
    } catch (error) {
      const codigo = (error as { code?: string })?.code;
      return codigo === 'declined' ? 'Guardado cancelado.' : 'No se pudo guardar el respaldo.';
    }
  }

  try {
    const url = URL.createObjectURL(new Blob([contenido], { type: 'application/json' }));
    const a = document.createElement('a');
    a.href = url;
    a.download = nombre;
    a.click();
    URL.revokeObjectURL(url);
    return 'Respaldo descargado.';
  } catch {
    return 'No se pudo guardar el respaldo.';
  }
}

interface AnfitrionClaude {
  use?: (nombre: string) => Promise<{ save: (peticion: { filename: string; data: string }) => Promise<unknown> } | null>;
}

async function copiar(texto: string): Promise<string> {
  try {
    await navigator.clipboard.writeText(texto);
    return 'Copiado al portapapeles.';
  } catch {
    return 'El navegador no dejó copiar.';
  }
}

export function textoMarkdown(e: Evaluacion): string {
  const r = evaluar(e);
  const l: string[] = [];
  l.push(`# ${e.titulo || 'Material sin título'}`);
  if (e.fuente) l.push(`Fuente: ${e.fuente}`);
  l.push(`Corrido: ${fechaCorta(e.creada)}`);
  l.push('');
  l.push(`**Veredicto:** ${TEXTO_VEREDICTO[r.veredicto].etiqueta} · nivel ${r.nivelConfianza}/6`);
  if (r.retenidoEn !== null) l.push(`Retenido en el filtro ${r.retenidoEn} — ${FILTROS[r.retenidoEn].nombre}.`);
  l.push('');
  l.push(`## 0 · Interruptor`);
  l.push(`Pulso: ${e.interruptor.pulso || '—'} · espacio tomado: ${e.interruptor.espacioTomado ? 'sí' : 'no'}`);
  if (e.interruptor.nota) l.push(e.interruptor.nota);
  l.push('');
  l.push(`## 1 · Estrato`);
  l.push(`${e.estrato.estrato || '—'}${e.estrato.conclusionGrande ? ' · conclusión grande' : ''}`);
  if (e.estrato.nota) l.push(e.estrato.nota);
  l.push('');
  l.push(`## 2 · Genealogía`);
  l.push(
    e.genealogia.ruta === 'encontrada'
      ? `Puerta: ${e.genealogia.puerta || '—'} (${e.genealogia.fecha || 's/f'})`
      : e.genealogia.ruta === 'ausente'
        ? 'Sin genealogía declarada.'
        : '—',
  );
  if (e.genealogia.nota) l.push(e.genealogia.nota);
  l.push('');
  l.push(`## 3 · Auto-auditoría`);
  l.push(
    `Escala: ${e.auditoria.escala || '—'} · alternativas: ${si(e.auditoria.hipotesisAlternativas)} · duda: ${si(
      e.auditoria.dudaDeclarada,
    )} · cierre lógico: ${si(e.auditoria.cierreLogico)} · espejo: ${si(e.auditoria.espejo)}`,
  );
  if (e.auditoria.nota) l.push(e.auditoria.nota);
  l.push('');
  l.push(`## 4 · Separador`);
  e.separador.piezas.forEach((p) => l.push(`- [${p.cajon}] ${p.texto}`));
  if (e.separador.exigePaquete) l.push('Exige el paquete completo.');
  if (e.separador.nota) l.push(e.separador.nota);
  l.push('');
  l.push(`## 5 · Convergencia`);
  e.convergencia.rutas.forEach((x) =>
    l.push(`- ${x.texto} — ${x.independiente ? 'independiente' : 'comparte raíz'}${x.raiz ? ` (${x.raiz})` : ''}`),
  );
  if (e.convergencia.escalofrio) l.push('Escalofrío de confirmación: sí.');
  if (e.convergencia.nota) l.push(e.convergencia.nota);
  l.push('');
  l.push(`## Cierre`);
  if (e.cierre.hipotesisExpandidas) l.push(`Hipótesis: ${e.cierre.hipotesisExpandidas}`);
  if (e.cierre.explicacionAburrida) l.push(`Explicación aburrida: ${e.cierre.explicacionAburrida}`);
  if (e.cierre.salida) l.push(`Salida: ${e.cierre.salida}`);
  return l.join('\n');
}

function si(v: boolean) {
  return v ? 'sí' : 'no';
}
