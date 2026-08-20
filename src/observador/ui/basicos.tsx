import React from 'react';
import type { EstadoFiltro } from '../tipos';

export const TONO: Record<EstadoFiltro, { punto: string; texto: string; borde: string; fondo: string; etiqueta: string }> = {
  pendiente: {
    punto: 'bg-zinc-600',
    texto: 'text-zinc-400',
    borde: 'border-zinc-800',
    fondo: 'bg-zinc-900/40',
    etiqueta: 'Pendiente',
  },
  ok: {
    punto: 'bg-emerald-400',
    texto: 'text-emerald-300',
    borde: 'border-emerald-900/70',
    fondo: 'bg-emerald-950/30',
    etiqueta: 'Sin alarma',
  },
  alarma: {
    punto: 'bg-red-400',
    texto: 'text-red-300',
    borde: 'border-red-900/70',
    fondo: 'bg-red-950/30',
    etiqueta: 'Alarma',
  },
};

export function Tarjeta({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`rounded-2xl border border-zinc-800/80 bg-zinc-900/50 p-4 ${className}`}>
      {children}
    </div>
  );
}

export function Boton({
  children,
  onClick,
  variante = 'suave',
  className = '',
  disabled = false,
  type = 'button',
}: {
  children: React.ReactNode;
  onClick?: () => void;
  variante?: 'principal' | 'suave' | 'fantasma' | 'peligro';
  className?: string;
  disabled?: boolean;
  type?: 'button' | 'submit';
}) {
  const estilos: Record<string, string> = {
    principal: 'bg-amber-400 text-zinc-950 font-semibold active:bg-amber-300 disabled:bg-zinc-800 disabled:text-zinc-500',
    suave: 'bg-zinc-800 text-zinc-100 active:bg-zinc-700 disabled:text-zinc-600',
    fantasma: 'bg-transparent text-zinc-400 border border-zinc-800 active:bg-zinc-900',
    peligro: 'bg-transparent text-red-300 border border-red-900/70 active:bg-red-950/40',
  };
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`min-h-[44px] rounded-xl px-4 text-[15px] leading-none disabled:opacity-60 ${estilos[variante]} ${className}`}
    >
      {children}
    </button>
  );
}

export function Interruptor({
  activo,
  onChange,
  titulo,
  detalle,
  peligro = false,
}: {
  activo: boolean;
  onChange: (v: boolean) => void;
  titulo: React.ReactNode;
  detalle?: string;
  peligro?: boolean;
}) {
  const encendido = peligro ? 'bg-red-500' : 'bg-emerald-500';
  return (
    <button
      type="button"
      onClick={() => onChange(!activo)}
      className="flex w-full items-start gap-3 rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-3 text-left active:bg-zinc-900"
    >
      <span
        className={`mt-0.5 inline-flex h-6 w-10 shrink-0 items-center rounded-full p-0.5 ${
          activo ? encendido : 'bg-zinc-700'
        }`}
      >
        <span
          className={`h-5 w-5 rounded-full bg-white shadow transition-transform ${
            activo ? 'translate-x-4' : 'translate-x-0'
          }`}
        />
      </span>
      <span className="min-w-0">
        <span className="block text-[15px] text-zinc-100">{titulo}</span>
        {detalle && <span className="mt-0.5 block text-[13px] leading-snug text-zinc-500">{detalle}</span>}
      </span>
    </button>
  );
}

export function Opciones<T extends string>({
  valor,
  onChange,
  opciones,
}: {
  valor: T | '';
  onChange: (v: T) => void;
  opciones: { id: T; nombre: string; detalle?: string }[];
}) {
  return (
    <div className="grid gap-2">
      {opciones.map((o) => {
        const activo = valor === o.id;
        return (
          <button
            key={o.id}
            type="button"
            onClick={() => onChange(o.id)}
            className={`rounded-xl border p-3 text-left active:bg-zinc-900 ${
              activo ? 'border-amber-400/70 bg-amber-400/10' : 'border-zinc-800/80 bg-zinc-900/40'
            }`}
          >
            <div className={`text-[15px] ${activo ? 'text-amber-200' : 'text-zinc-100'}`}>{o.nombre}</div>
            {o.detalle && <div className="mt-0.5 text-[13px] leading-snug text-zinc-500">{o.detalle}</div>}
          </button>
        );
      })}
    </div>
  );
}

export function Campo({
  etiqueta,
  valor,
  onChange,
  placeholder,
  filas = 3,
  tipo = 'area',
  autoFoco = false,
}: {
  etiqueta?: string;
  valor: string;
  onChange: (v: string) => void;
  placeholder?: string;
  filas?: number;
  tipo?: 'area' | 'texto';
  autoFoco?: boolean;
}) {
  const clases =
    'w-full rounded-xl border border-zinc-800 bg-zinc-950/60 px-3 py-2.5 text-[15px] text-zinc-100 placeholder:text-zinc-600 focus:border-amber-400/60 focus:outline-none';
  return (
    <label className="block">
      {etiqueta && <span className="mb-1.5 block text-[13px] font-medium text-zinc-400">{etiqueta}</span>}
      {tipo === 'area' ? (
        <textarea
          value={valor}
          rows={filas}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`${clases} resize-y`}
        />
      ) : (
        <input
          value={valor}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          autoFocus={autoFoco}
          className={clases}
        />
      )}
    </label>
  );
}

export function Aviso({
  tono = 'alarma',
  children,
}: {
  tono?: 'alarma' | 'nota' | 'ok';
  children: React.ReactNode;
}) {
  const estilos = {
    alarma: 'border-red-900/70 bg-red-950/30 text-red-200',
    nota: 'border-zinc-800 bg-zinc-900/60 text-zinc-400',
    ok: 'border-emerald-900/70 bg-emerald-950/30 text-emerald-200',
  };
  return (
    <div className={`rounded-xl border px-3 py-2.5 text-[13px] leading-relaxed ${estilos[tono]}`}>
      {children}
    </div>
  );
}
