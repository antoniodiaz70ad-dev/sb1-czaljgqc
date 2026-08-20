import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { CAJONES, ESCALA_AUDITORIA, ESTRATOS, FILTROS, ORIGEN, REGLA_CIERRE } from '../protocolo';
import { Tarjeta } from '../ui/basicos';

export default function Ficha() {
  const [abierto, setAbierto] = useState<number | null>(0);

  return (
    <div className="space-y-3 pb-4">
      <header className="pt-1">
        <h1 className="text-[26px] font-semibold leading-tight text-zinc-50">La ficha</h1>
        <p className="mt-1 text-[13px] text-zinc-500">Documento personal · una página · agosto 2026</p>
      </header>

      <Tarjeta className="border-zinc-800/60 bg-zinc-900/30">
        <p className="text-[13px] leading-relaxed text-zinc-400">{ORIGEN}</p>
      </Tarjeta>

      {FILTROS.map((f, i) => {
        const activo = abierto === i;
        return (
          <div key={f.id} className="overflow-hidden rounded-2xl border border-zinc-800/80 bg-zinc-900/40">
            <button
              type="button"
              onClick={() => setAbierto(activo ? null : i)}
              className="flex w-full items-center gap-3 p-4 text-left active:bg-zinc-900"
            >
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg border border-amber-900/60 bg-amber-950/30 text-[15px] font-semibold text-amber-300">
                {f.numero}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[16px] font-medium text-zinc-100">{f.nombre}</span>
                <span
                  className={`mt-0.5 block text-[13px] italic text-amber-200/70 ${activo ? '' : 'truncate'}`}
                >
                  {f.gatillo}
                </span>
              </span>
              <ChevronDown
                size={16}
                className={`shrink-0 text-zinc-600 ${activo ? 'rotate-180' : ''}`}
              />
            </button>

            {activo && (
              <div className="space-y-3 border-t border-zinc-800/80 px-4 pb-4 pt-3">
                {f.cuerpo.map((linea, k) => (
                  <p key={k} className="text-[14px] leading-relaxed text-zinc-300">
                    {linea}
                  </p>
                ))}

                {f.id === 1 && (
                  <ul className="space-y-1.5">
                    {ESTRATOS.map((s) => (
                      <li key={s.id} className="text-[13.5px] text-zinc-400">
                        <span className="text-zinc-200">{s.nombre}</span> — {s.detalle}
                      </li>
                    ))}
                  </ul>
                )}

                {f.id === 3 && (
                  <ol className="space-y-1.5">
                    {ESCALA_AUDITORIA.map((s, k) => (
                      <li key={s.id} className="text-[13.5px] text-zinc-400">
                        <span className="text-zinc-500">{k + 1}.</span>{' '}
                        <span className="text-zinc-200">{s.nombre}</span> — {s.referencia}
                      </li>
                    ))}
                  </ol>
                )}

                {f.id === 4 && (
                  <ul className="space-y-2">
                    {CAJONES.map((c) => (
                      <li key={c.id} className="rounded-lg border border-zinc-800 bg-zinc-950/50 p-2.5">
                        <span className="block text-[13.5px] font-medium text-zinc-200">{c.nombre}</span>
                        <span className="block text-[13px] leading-snug text-zinc-500">{c.definicion}</span>
                      </li>
                    ))}
                  </ul>
                )}

                <div className="rounded-xl border border-red-900/60 bg-red-950/25 p-3">
                  <p className="text-[12px] font-semibold uppercase tracking-wide text-red-300/90">Alarma</p>
                  <p className="mt-1 text-[13.5px] leading-relaxed text-red-100/80">{f.alarma}</p>
                </div>
              </div>
            )}
          </div>
        );
      })}

      <Tarjeta className="border-amber-900/50 bg-amber-950/20">
        <p className="text-[12px] font-semibold uppercase tracking-widest text-amber-400/80">
          {REGLA_CIERRE.titulo}
        </p>
        <p className="mt-2 text-[14px] leading-relaxed text-amber-100/85">{REGLA_CIERRE.texto}</p>
        <div className="mt-3 flex gap-2">
          {REGLA_CIERRE.salida.map((s) => (
            <span
              key={s}
              className="rounded-full border border-amber-800/60 px-3 py-1 text-[12px] text-amber-200/90"
            >
              {s}
            </span>
          ))}
        </div>
      </Tarjeta>
    </div>
  );
}
