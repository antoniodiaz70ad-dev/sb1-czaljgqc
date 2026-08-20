import { useEffect, useRef, useState } from 'react';

/**
 * El interruptor: tres segundos de espacio antes de responder.
 * No se puede saltar — el botón solo confirma cuando el conteo termina.
 */
export default function TresSegundos({
  listo,
  onListo,
}: {
  listo: boolean;
  onListo: () => void;
}) {
  const [contando, setContando] = useState(false);
  const [restante, setRestante] = useState(3);
  const ref = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (ref.current) window.clearInterval(ref.current);
    };
  }, []);

  const arrancar = () => {
    if (contando || listo) return;
    setContando(true);
    setRestante(3);
    const inicio = Date.now();
    ref.current = window.setInterval(() => {
      const pasado = (Date.now() - inicio) / 1000;
      const quedan = Math.max(0, 3 - pasado);
      setRestante(quedan);
      if (quedan <= 0) {
        if (ref.current) window.clearInterval(ref.current);
        ref.current = null;
        setContando(false);
        onListo();
      }
    }, 50);
  };

  const progreso = listo ? 1 : contando ? (3 - restante) / 3 : 0;
  const radio = 54;
  const circ = 2 * Math.PI * radio;

  return (
    <div className="flex flex-col items-center gap-3 py-2">
      <button
        type="button"
        onClick={arrancar}
        disabled={listo}
        aria-label="Tomar los tres segundos de espacio"
        className="relative grid h-[136px] w-[136px] place-items-center rounded-full active:scale-[0.98]"
      >
        <svg viewBox="0 0 136 136" className="absolute inset-0 h-full w-full -rotate-90">
          <circle cx="68" cy="68" r={radio} fill="none" stroke="#27272a" strokeWidth="6" />
          <circle
            cx="68"
            cy="68"
            r={radio}
            fill="none"
            stroke={listo ? '#34d399' : '#fbbf24'}
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={circ}
            strokeDashoffset={circ * (1 - progreso)}
          />
        </svg>
        <span className="relative text-center">
          {listo ? (
            <span className="px-8 text-[14px] font-medium leading-tight text-emerald-300">
              Espacio
              <br />
              tomado
            </span>
          ) : contando ? (
            <span className="text-4xl font-light tabular-nums text-amber-300">{Math.ceil(restante)}</span>
          ) : (
            <span className="px-6 text-[14px] leading-tight text-zinc-300">
              Mantén tres
              <br />
              segundos
            </span>
          )}
        </span>
      </button>
      <p className="max-w-[16rem] text-center text-[13px] leading-relaxed text-zinc-500">
        {listo
          ? 'El que evalúa ya está separado del que reacciona.'
          : 'Toca y no respondas nada hasta que el círculo cierre.'}
      </p>
    </div>
  );
}
