import { useMemo } from 'react';
import { ChevronRight, Plus } from 'lucide-react';
import { FILTROS } from '../protocolo';
import { evaluar, fechaCorta, hoyLocal, racha, ultimosDias } from '../logica';
import type { Almacen } from '../almacen';
import { Aviso, Boton, Campo, Interruptor, Tarjeta } from '../ui/basicos';

export default function Hoy({
  almacen,
  onAbrir,
  onNuevo,
  onVerRetenidos,
  onAbrirFicha,
}: {
  almacen: Almacen;
  onAbrir: (id: string) => void;
  onNuevo: () => void;
  onVerRetenidos: () => void;
  onAbrirFicha: (filtro: number) => void;
}) {
  const hoy = hoyLocal();
  const dia = almacen.estado.dias.find((d) => d.fecha === hoy);
  const dias = useMemo(() => ultimosDias(14), []);
  const activos = new Set(almacen.diasActivos);
  const n = racha(almacen.diasActivos);

  const enCurso = almacen.estado.evaluaciones
    .filter((e) => !e.archivada && evaluar(e).veredicto === 'en_curso')
    .slice(0, 4);

  const retenidos = almacen.estado.evaluaciones.filter((e) => evaluar(e).veredicto === 'retenido');

  // Un filtro distinto cada día, para releerlo de memoria.
  const indice = Math.abs(hashFecha(hoy)) % FILTROS.length;
  const delDia = FILTROS[indice];

  const fechaLarga = new Date().toLocaleDateString('es-MX', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });

  return (
    <div className="space-y-4 pb-4">
      <header className="pt-1">
        <p className="text-[13px] text-zinc-500 first-letter:uppercase">{fechaLarga}</p>
        <h1 className="mt-0.5 text-[26px] font-semibold leading-tight text-zinc-50">
          Protocolo del Observador
        </h1>
      </header>

      {/* Práctica diaria */}
      <Tarjeta>
        <div className="mb-3 flex items-baseline justify-between">
          <p className="text-[13px] font-medium uppercase tracking-wide text-zinc-400">Práctica diaria</p>
          <p className="text-[13px] text-zinc-400">
            <span className="text-lg font-semibold text-amber-300">{n}</span> {n === 1 ? 'día' : 'días'} seguidos
          </p>
        </div>

        <div className="mb-3 flex items-end gap-[3px]">
          {dias.map((f) => (
            <span
              key={f}
              title={f}
              className={`h-7 flex-1 rounded-[3px] ${
                activos.has(f) ? 'bg-amber-400/80' : f === hoy ? 'bg-zinc-700' : 'bg-zinc-800/70'
              }`}
            />
          ))}
        </div>

        <Interruptor
          activo={Boolean(dia?.interruptor)}
          onChange={(v) => almacen.marcarDia({ interruptor: v })}
          titulo="Hoy corrí el interruptor"
          detalle="Tres segundos de espacio antes de responder."
        />

        <div className="mt-3">
          <Campo
            etiqueta="¿Qué me aceleró el pulso hoy?"
            valor={dia?.nota ?? ''}
            onChange={(v) => almacen.marcarDia({ nota: v })}
            placeholder="Entusiasmo o rechazo. Una línea basta."
            filas={2}
          />
        </div>
      </Tarjeta>

      {/* Filtro del día: tocarlo abre la ficha en ese filtro */}
      <button type="button" onClick={() => onAbrirFicha(delDia.id)} className="block w-full text-left">
        <Tarjeta className="border-amber-900/40 bg-amber-950/15 active:bg-amber-950/30">
          <div className="flex items-center justify-between">
            <p className="text-[12px] font-semibold uppercase tracking-widest text-amber-400/80">
              Filtro {delDia.numero} · {delDia.nombre}
            </p>
            <span className="text-[12px] text-amber-400/60">ver ficha ›</span>
          </div>
          <p className="mt-2 text-[17px] italic leading-snug text-amber-100">{delDia.gatillo}</p>
          <p className="mt-2 text-[13px] leading-relaxed text-amber-100/60">{delDia.alarma}</p>
        </Tarjeta>
      </button>

      {almacen.estado.evaluaciones.length === 0 && (
        <Tarjeta>
          <p className="mb-2 text-[13px] font-medium uppercase tracking-wide text-zinc-400">Cómo se usa</p>
          <ol className="space-y-2 text-[14px] leading-relaxed text-zinc-300">
            <li>
              <span className="font-semibold text-amber-300">1.</span> Llega algo con pretensión de verdad —
              un video, un libro, una certeza propia.
            </li>
            <li>
              <span className="font-semibold text-amber-300">2.</span> Tocas{' '}
              <span className="text-zinc-100">Correr un material</span> y pasas los cinco filtros en orden.
            </li>
            <li>
              <span className="font-semibold text-amber-300">3.</span> Si un filtro dispara alarma, el
              material queda retenido hasta resolverse. Si no, sube de nivel de confianza.
            </li>
          </ol>
        </Tarjeta>
      )}

      <Boton variante="principal" onClick={onNuevo} className="w-full">
        <Plus size={17} className="mr-1.5 inline" /> Correr un material
      </Boton>

      {enCurso.length > 0 && (
        <section>
          <h2 className="mb-2 px-1 text-[13px] font-medium uppercase tracking-wide text-zinc-400">
            Sin terminar
          </h2>
          <div className="space-y-2">
            {enCurso.map((e) => {
              const r = evaluar(e);
              return (
                <button
                  key={e.id}
                  type="button"
                  onClick={() => onAbrir(e.id)}
                  className="flex w-full items-center gap-3 rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-3 text-left active:bg-zinc-900"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[15px] text-zinc-100">{e.titulo || 'Material sin título'}</p>
                    <p className="mt-0.5 text-[12px] text-zinc-500">
                      {r.nivelConfianza}/6 filtros · {fechaCorta(e.actualizada)}
                    </p>
                  </div>
                  <ChevronRight size={16} className="shrink-0 text-zinc-600" />
                </button>
              );
            })}
          </div>
        </section>
      )}

      {retenidos.length > 0 && (
        <button type="button" onClick={onVerRetenidos} className="block w-full text-left">
          <Aviso tono="alarma">
            <span className="font-semibold">{retenidos.length}</span>{' '}
            {retenidos.length === 1 ? 'material retenido' : 'materiales retenidos'} esperando resolución. Se
            quedan donde están hasta que el filtro se resuelva.
          </Aviso>
        </button>
      )}

      <p className="px-1 pt-2 text-[12px] leading-relaxed text-zinc-600">
        Todo se guarda solo en este teléfono. Nada sale de aquí.
      </p>
    </div>
  );
}

function hashFecha(f: string): number {
  let h = 0;
  for (let i = 0; i < f.length; i += 1) h = (h * 31 + f.charCodeAt(i)) | 0;
  return h;
}

