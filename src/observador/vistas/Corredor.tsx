import { useMemo, useState } from 'react';
import { ArrowLeft, ArrowRight, Check, Plus, Trash2, X } from 'lucide-react';
import {
  CAJONES,
  ESCALA_AUDITORIA,
  ESTRATOS,
  FILTROS,
  REGLA_CIERRE,
  type CajonId,
  type FiltroId,
} from '../protocolo';
import { evaluar, idNuevo, TEXTO_VEREDICTO } from '../logica';
import type { Almacen } from '../almacen';
import type { Evaluacion } from '../tipos';
import { Aviso, Boton, Campo, Interruptor, Opciones, TONO } from '../ui/basicos';
import TresSegundos from '../ui/TresSegundos';

const COLOR_CAJON: Record<CajonId, string> = {
  utilizable: 'border-emerald-800/70 bg-emerald-950/30 text-emerald-200',
  creencia: 'border-sky-800/70 bg-sky-950/30 text-sky-200',
  indemostrable: 'border-amber-800/70 bg-amber-950/30 text-amber-200',
  toxico: 'border-red-800/70 bg-red-950/30 text-red-200',
};

export default function Corredor({
  evaluacion,
  almacen,
  onSalir,
}: {
  evaluacion: Evaluacion;
  almacen: Almacen;
  onSalir: () => void;
}) {
  const [paso, setPaso] = useState<number>(() => {
    const r = evaluar(evaluacion);
    return r.pendientes.length ? r.pendientes[0] : 6;
  });

  const resultado = useMemo(() => evaluar(evaluacion), [evaluacion]);
  const editar = (cambio: (e: Evaluacion) => Evaluacion) => almacen.actualizar(evaluacion.id, cambio);

  const filtro = paso <= 5 ? FILTROS[paso] : null;
  const estadoActual = paso <= 5 ? resultado.estados[paso as FiltroId] : 'pendiente';

  return (
    <div className="pb-32">
      {/* Cabecera del material */}
      <div className="sticky top-0 z-20 -mx-4 border-b border-zinc-900 bg-zinc-950/95 px-4 pb-3 pt-3 backdrop-blur">
        <div className="flex items-start gap-3">
          <button
            type="button"
            onClick={onSalir}
            aria-label="Cerrar evaluación"
            className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg border border-zinc-800 text-zinc-400 active:bg-zinc-900"
          >
            <X size={16} />
          </button>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[15px] font-medium text-zinc-100">
              {evaluacion.titulo || 'Material sin título'}
            </p>
            {evaluacion.fuente && (
              <p className="truncate text-[12px] text-zinc-500">{evaluacion.fuente}</p>
            )}
          </div>
        </div>

        {/* Riel de filtros */}
        <div className="mt-3 flex items-center gap-1.5">
          {([0, 1, 2, 3, 4, 5] as FiltroId[]).map((i) => {
            const t = TONO[resultado.estados[i]];
            return (
              <button
                key={i}
                type="button"
                onClick={() => setPaso(i)}
                aria-label={`Filtro ${i}`}
                className={`h-1.5 flex-1 rounded-full ${t.punto} ${
                  paso === i ? 'opacity-100 ring-2 ring-amber-400/60 ring-offset-2 ring-offset-zinc-950' : 'opacity-60'
                }`}
              />
            );
          })}
          <button
            type="button"
            onClick={() => setPaso(6)}
            aria-label="Cierre"
            className={`h-1.5 w-6 rounded-full ${
              resultado.cierreCompleto ? 'bg-amber-400' : 'bg-zinc-600'
            } ${paso === 6 ? 'ring-2 ring-amber-400/60 ring-offset-2 ring-offset-zinc-950' : 'opacity-60'}`}
          />
        </div>
      </div>

      <div className="pt-5">
        {filtro && (
          <>
            <div className="mb-1 flex items-center gap-2">
              <span className="text-[12px] font-semibold uppercase tracking-widest text-amber-400/80">
                Filtro {filtro.numero}
              </span>
              <span className={`text-[12px] ${TONO[estadoActual].texto}`}>· {TONO[estadoActual].etiqueta}</span>
            </div>
            <h2 className="text-2xl font-semibold text-zinc-50">{filtro.nombre}</h2>
            <p className="mt-2 text-[17px] italic leading-snug text-amber-200/90">{filtro.gatillo}</p>
            {/* En el filtro 1 las tres líneas del cuerpo son las opciones de abajo. */}
            <div className="mt-3 space-y-1.5">
              {(filtro.id === 1 ? [] : filtro.cuerpo).map((linea, i) => (
                <p key={i} className="text-[13.5px] leading-relaxed text-zinc-400">
                  {linea}
                </p>
              ))}
            </div>
          </>
        )}

        <div className="mt-5 space-y-4">
          {paso === 0 && <Paso0 evaluacion={evaluacion} editar={editar} />}
          {paso === 1 && <Paso1 evaluacion={evaluacion} editar={editar} />}
          {paso === 2 && <Paso2 evaluacion={evaluacion} editar={editar} />}
          {paso === 3 && <Paso3 evaluacion={evaluacion} editar={editar} />}
          {paso === 4 && <Paso4 evaluacion={evaluacion} editar={editar} />}
          {paso === 5 && <Paso5 evaluacion={evaluacion} editar={editar} />}
          {paso === 6 && <PasoCierre evaluacion={evaluacion} editar={editar} />}
        </div>

        {filtro && estadoActual === 'alarma' && (
          <div className="mt-4 space-y-2">
            <Aviso tono="alarma">
              <span className="font-semibold">Alarma · </span>
              {filtro.alarma}
            </Aviso>
            <Aviso tono="nota">
              <span className="font-semibold text-zinc-300">Para resolver: </span>
              {filtro.resolver}
            </Aviso>
          </div>
        )}

        {filtro && (
          <div className="mt-4">
            <Campo
              etiqueta="Nota"
              valor={notaDe(evaluacion, paso as FiltroId)}
              onChange={(v) => editar((e) => conNota(e, paso as FiltroId, v))}
              placeholder="Lo que viste en este filtro."
              filas={2}
            />
          </div>
        )}
      </div>

      {/* Navegación */}
      <div className="fixed inset-x-0 bottom-0 z-20 border-t border-zinc-900 bg-zinc-950/95 px-4 py-3 backdrop-blur"
           style={{ paddingBottom: 'calc(0.75rem + env(safe-area-inset-bottom, 0px))' }}>
        <div className="mx-auto flex max-w-md items-center gap-2">
          <Boton variante="fantasma" onClick={() => setPaso((p) => Math.max(0, p - 1))} disabled={paso === 0}>
            <ArrowLeft size={16} className="inline" />
          </Boton>
          <div className="flex-1 text-center text-[12px] text-zinc-500">
            {paso <= 5 ? `${paso + 1} de 7` : 'Cierre'}
          </div>
          {paso < 6 ? (
            <Boton variante="principal" onClick={() => setPaso((p) => p + 1)}>
              Siguiente <ArrowRight size={16} className="ml-1 inline" />
            </Boton>
          ) : (
            <Boton variante="principal" onClick={onSalir}>
              <Check size={16} className="mr-1 inline" /> Guardar
            </Boton>
          )}
        </div>
      </div>
    </div>
  );
}

// — Notas por filtro ————————————————————————————————————————————————————

const LLAVES = ['interruptor', 'estrato', 'genealogia', 'auditoria', 'separador', 'convergencia'] as const;

function notaDe(e: Evaluacion, i: FiltroId): string {
  return e[LLAVES[i]].nota;
}

function conNota(e: Evaluacion, i: FiltroId, nota: string): Evaluacion {
  const llave = LLAVES[i];
  return { ...e, [llave]: { ...e[llave], nota } } as Evaluacion;
}

interface PropsPaso {
  evaluacion: Evaluacion;
  editar: (cambio: (e: Evaluacion) => Evaluacion) => void;
}

// — 0 · Interruptor ————————————————————————————————————————————————————

function Paso0({ evaluacion, editar }: PropsPaso) {
  const p = evaluacion.interruptor;
  return (
    <>
      <Opciones
        valor={p.pulso}
        onChange={(v) => editar((e) => ({ ...e, interruptor: { ...e.interruptor, pulso: v } }))}
        opciones={[
          { id: 'entusiasmo', nombre: 'Se aceleró — entusiasmo', detalle: 'Quiero que sea verdad.' },
          { id: 'rechazo', nombre: 'Se aceleró — rechazo', detalle: 'Quiero que sea falso.' },
          { id: 'ninguno', nombre: 'Pulso quieto', detalle: 'Ni tirón ni empujón.' },
        ]}
      />
      <TresSegundos
        listo={p.espacioTomado}
        onListo={() => editar((e) => ({ ...e, interruptor: { ...e.interruptor, espacioTomado: true } }))}
      />
      {p.espacioTomado && (
        <Aviso tono="ok">¿Quién es el que está consciente de esto? Ese es el que corre los filtros.</Aviso>
      )}
    </>
  );
}

// — 1 · Estrato ————————————————————————————————————————————————————————

function Paso1({ evaluacion, editar }: PropsPaso) {
  const p = evaluacion.estrato;
  return (
    <>
      <Opciones
        valor={p.estrato}
        onChange={(v) => editar((e) => ({ ...e, estrato: { ...e.estrato, estrato: v } }))}
        opciones={ESTRATOS.map((s) => ({ id: s.id, nombre: s.nombre, detalle: s.detalle }))}
      />
      <Interruptor
        activo={p.conclusionGrande}
        peligro
        onChange={(v) => editar((e) => ({ ...e, estrato: { ...e.estrato, conclusionGrande: v } }))}
        titulo="La conclusión que sostiene es grande"
        detalle="Cambia cómo entiendo el mundo, no un dato suelto."
      />
    </>
  );
}

// — 2 · Genealogía ——————————————————————————————————————————————————————

function Paso2({ evaluacion, editar }: PropsPaso) {
  const p = evaluacion.genealogia;
  return (
    <>
      <Opciones
        valor={p.ruta}
        onChange={(v) => editar((e) => ({ ...e, genealogia: { ...e.genealogia, ruta: v } }))}
        opciones={[
          { id: 'encontrada', nombre: 'Encontré la puerta', detalle: 'Sé por dónde entró la idea y con qué fecha.' },
          { id: 'ausente', nombre: 'Se presenta sin genealogía', detalle: 'Revelación, intuición pura, «conocimiento antiguo».' },
        ]}
      />
      {p.ruta === 'encontrada' && (
        <div className="space-y-3">
          <Campo
            tipo="texto"
            etiqueta="¿Por qué puerta entró?"
            valor={p.puerta}
            onChange={(v) => editar((e) => ({ ...e, genealogia: { ...e.genealogia, puerta: v } }))}
            placeholder="Lectura, convención, elección humana…"
          />
          <Campo
            tipo="texto"
            etiqueta="Fecha"
            valor={p.fecha}
            onChange={(v) => editar((e) => ({ ...e, genealogia: { ...e.genealogia, fecha: v } }))}
            placeholder="1975 · tercer milenio a.C. · s/f"
          />
        </div>
      )}
    </>
  );
}

// — 3 · Auto-auditoría ——————————————————————————————————————————————————

function Paso3({ evaluacion, editar }: PropsPaso) {
  const p = evaluacion.auditoria;
  const set = (cambio: Partial<typeof p>) =>
    editar((e) => ({ ...e, auditoria: { ...e.auditoria, ...cambio } }));
  return (
    <>
      <Opciones
        valor={p.escala}
        onChange={(v) => set({ escala: v })}
        opciones={ESCALA_AUDITORIA.map((s) => ({ id: s.id, nombre: s.nombre, detalle: s.referencia }))}
      />
      <div className="space-y-2">
        <Interruptor
          activo={p.hipotesisAlternativas}
          onChange={(v) => set({ hipotesisAlternativas: v })}
          titulo="Incluye hipótesis alternativas"
        />
        <Interruptor
          activo={p.dudaDeclarada}
          onChange={(v) => set({ dudaDeclarada: v })}
          titulo="Declara su propia duda"
        />
        <Interruptor
          activo={p.cierreLogico}
          onChange={(v) => set({ cierreLogico: v })}
          titulo="Cierra con lógica, no con emoción"
        />
      </div>
      <div className="rounded-xl border border-amber-900/50 bg-amber-950/20 p-3">
        <p className="mb-2 text-[13px] italic text-amber-200/90">
          En espejo: ¿yo estoy incluyendo la hipótesis de que me equivoco?
        </p>
        <Interruptor
          activo={p.espejo}
          onChange={(v) => set({ espejo: v })}
          titulo="Sí — y sé cuál sería"
          detalle="Sin esto el filtro queda pendiente."
        />
      </div>
    </>
  );
}

// — 4 · Separador ————————————————————————————————————————————————————————

function Paso4({ evaluacion, editar }: PropsPaso) {
  const p = evaluacion.separador;
  const [texto, setTexto] = useState('');
  const [cajon, setCajon] = useState<CajonId>('utilizable');

  const agregar = () => {
    const limpio = texto.trim();
    if (!limpio) return;
    editar((e) => ({
      ...e,
      separador: { ...e.separador, piezas: [...e.separador.piezas, { id: idNuevo(), texto: limpio, cajon }] },
    }));
    setTexto('');
  };

  const quitar = (id: string) =>
    editar((e) => ({
      ...e,
      separador: { ...e.separador, piezas: e.separador.piezas.filter((x) => x.id !== id) },
    }));

  return (
    <>
      <div className="space-y-2">
        <Campo
          etiqueta="Pieza del material"
          valor={texto}
          onChange={setTexto}
          filas={2}
          placeholder="Una afirmación, una técnica, una imagen…"
        />
        <div className="grid grid-cols-2 gap-2">
          {CAJONES.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setCajon(c.id)}
              className={`rounded-xl border px-3 py-2 text-left text-[13px] ${
                cajon === c.id ? COLOR_CAJON[c.id] : 'border-zinc-800 bg-zinc-900/40 text-zinc-400'
              }`}
            >
              {c.nombre}
            </button>
          ))}
        </div>
        <p className="text-[12px] leading-snug text-zinc-500">
          {CAJONES.find((c) => c.id === cajon)?.definicion}
        </p>
        <Boton variante="suave" onClick={agregar} className="w-full">
          <Plus size={16} className="mr-1 inline" /> Guardar en el cajón
        </Boton>
      </div>

      {CAJONES.map((c) => {
        const piezas = p.piezas.filter((x) => x.cajon === c.id);
        if (!piezas.length) return null;
        return (
          <div key={c.id} className={`rounded-xl border p-3 ${COLOR_CAJON[c.id]}`}>
            <p className="mb-2 text-[12px] font-semibold uppercase tracking-wide opacity-90">{c.nombre}</p>
            <ul className="space-y-1.5">
              {piezas.map((x) => (
                <li key={x.id} className="flex items-start gap-2 text-[14px] leading-snug">
                  <span className="flex-1">{x.texto}</span>
                  <button type="button" onClick={() => quitar(x.id)} aria-label="Quitar pieza" className="opacity-60">
                    <Trash2 size={14} />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        );
      })}

      <Interruptor
        activo={p.exigePaquete}
        peligro
        onChange={(v) => editar((e) => ({ ...e, separador: { ...e.separador, exigePaquete: v } }))}
        titulo="Siento que aceptar una pieza me obliga a comprar el sistema entero"
        detalle="Ningún material honesto exige el paquete completo."
      />
    </>
  );
}

// — 5 · Convergencia ————————————————————————————————————————————————————

function Paso5({ evaluacion, editar }: PropsPaso) {
  const p = evaluacion.convergencia;
  const [texto, setTexto] = useState('');

  const agregar = () => {
    const limpio = texto.trim();
    if (!limpio) return;
    editar((e) => ({
      ...e,
      convergencia: {
        ...e.convergencia,
        sinConvergencia: false,
        rutas: [...e.convergencia.rutas, { id: idNuevo(), texto: limpio, independiente: false, raiz: '' }],
      },
    }));
    setTexto('');
  };

  const cambiar = (id: string, cambio: Partial<{ independiente: boolean; raiz: string }>) =>
    editar((e) => ({
      ...e,
      convergencia: {
        ...e.convergencia,
        rutas: e.convergencia.rutas.map((r) => (r.id === id ? { ...r, ...cambio } : r)),
      },
    }));

  const quitar = (id: string) =>
    editar((e) => ({
      ...e,
      convergencia: { ...e.convergencia, rutas: e.convergencia.rutas.filter((r) => r.id !== id) },
    }));

  return (
    <>
      <div className="space-y-2">
        <Campo
          tipo="texto"
          etiqueta="Ruta que coincide"
          valor={texto}
          onChange={setTexto}
          placeholder="Fuente, tradición, autor, medición…"
        />
        <Boton variante="suave" onClick={agregar} className="w-full">
          <Plus size={16} className="mr-1 inline" /> Añadir ruta
        </Boton>
      </div>

      {p.rutas.map((r) => (
        <div key={r.id} className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-3">
          <div className="mb-2 flex items-start gap-2">
            <span className="flex-1 text-[15px] text-zinc-100">{r.texto}</span>
            <button type="button" onClick={() => quitar(r.id)} aria-label="Quitar ruta" className="text-zinc-500">
              <Trash2 size={14} />
            </button>
          </div>
          <Campo
            tipo="texto"
            etiqueta="¿De qué estanque bebe?"
            valor={r.raiz}
            onChange={(v) => cambiar(r.id, { raiz: v })}
            placeholder="Platón, un mismo paper, una medición propia…"
          />
          <div className="mt-2">
            <Interruptor
              activo={r.independiente}
              onChange={(v) => cambiar(r.id, { independiente: v })}
              titulo="Camino independiente"
              detalle="No toca a los otros. Termina en ecuación o medición."
            />
          </div>
        </div>
      ))}

      <Interruptor
        activo={p.sinConvergencia}
        onChange={(v) =>
          editar((e) => ({ ...e, convergencia: { ...e.convergencia, sinConvergencia: v } }))
        }
        titulo="El material no apela a coincidencias"
        detalle="No hay convergencia que auditar."
      />
      <Interruptor
        activo={p.escalofrio}
        peligro
        onChange={(v) => editar((e) => ({ ...e, convergencia: { ...e.convergencia, escalofrio: v } }))}
        titulo="Sentí el escalofrío de «esto confirma lo que ya sabía»"
        detalle="Ese escalofrío es el momento exacto de detenerse."
      />
    </>
  );
}

// — Cierre y veredicto ——————————————————————————————————————————————————

function PasoCierre({ evaluacion, editar }: PropsPaso) {
  const r = evaluar(evaluacion);
  const texto = TEXTO_VEREDICTO[r.veredicto];
  const tono =
    r.veredicto === 'pasa'
      ? 'border-emerald-900/70 bg-emerald-950/30'
      : r.veredicto === 'retenido'
        ? 'border-red-900/70 bg-red-950/30'
        : 'border-zinc-800 bg-zinc-900/50';

  return (
    <>
      <div className={`rounded-2xl border p-4 ${tono}`}>
        <p className="text-[12px] uppercase tracking-widest text-zinc-400">Veredicto</p>
        <p className="mt-1 text-2xl font-semibold text-zinc-50">{texto.etiqueta}</p>
        <p className="mt-1.5 text-[14px] leading-relaxed text-zinc-300">{texto.frase}</p>
        {r.retenidoEn !== null && (
          <p className="mt-2 text-[13px] text-red-200">
            Se detiene en el filtro {r.retenidoEn} · {FILTROS[r.retenidoEn].nombre}.
          </p>
        )}
        <p className="mt-3 text-[13px] text-zinc-400">
          Nivel de confianza: <span className="text-zinc-100">{r.nivelConfianza} de 6</span> filtros
          superados en orden.
        </p>
      </div>

      <div className="rounded-2xl border border-amber-900/50 bg-amber-950/20 p-4">
        <p className="text-[12px] font-semibold uppercase tracking-widest text-amber-400/80">
          {REGLA_CIERRE.titulo}
        </p>
        <p className="mt-2 text-[13.5px] leading-relaxed text-amber-100/80">{REGLA_CIERRE.texto}</p>
      </div>

      <Campo
        etiqueta="Espacio de hipótesis — antes de defender la favorita"
        valor={evaluacion.cierre.hipotesisExpandidas}
        onChange={(v) => editar((e) => ({ ...e, cierre: { ...e.cierre, hipotesisExpandidas: v } }))}
        placeholder="Qué más podría explicar esto."
      />
      <Campo
        etiqueta="La explicación aburrida (obligatoria)"
        valor={evaluacion.cierre.explicacionAburrida}
        onChange={(v) => editar((e) => ({ ...e, cierre: { ...e.cierre, explicacionAburrida: v } }))}
        placeholder="Coincidencia, sesgo, error de medición, lectura previa olvidada…"
        filas={2}
      />
      <Campo
        etiqueta="La salida — humor, amor y belleza"
        valor={evaluacion.cierre.salida}
        onChange={(v) => editar((e) => ({ ...e, cierre: { ...e.cierre, salida: v } }))}
        placeholder="Cuando el sistema entero falle."
        filas={2}
      />

      {r.pendientes.length > 0 && (
        <Aviso tono="nota">
          Filtros sin correr: {r.pendientes.join(', ')}. Sin ellos no hay nivel asignado.
        </Aviso>
      )}
    </>
  );
}
