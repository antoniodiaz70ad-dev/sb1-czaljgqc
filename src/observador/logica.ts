import type { FiltroId } from './protocolo';
import type {
  Cierre,
  Evaluacion,
  EstadoFiltro,
  PasoAuditoria,
  PasoConvergencia,
  PasoEstrato,
  PasoGenealogia,
  PasoInterruptor,
  PasoSeparador,
  Resultado,
} from './tipos';

export function idNuevo(): string {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

export function hoyLocal(d: Date = new Date()): string {
  const p = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

export function evaluacionVacia(titulo = '', fuente = ''): Evaluacion {
  const ahora = new Date().toISOString();
  return {
    id: idNuevo(),
    titulo,
    fuente,
    creada: ahora,
    actualizada: ahora,
    archivada: false,
    interruptor: { espacioTomado: false, pulso: '', nota: '' },
    estrato: { estrato: '', conclusionGrande: false, nota: '' },
    genealogia: { ruta: '', puerta: '', fecha: '', nota: '' },
    auditoria: {
      escala: '',
      hipotesisAlternativas: false,
      dudaDeclarada: false,
      cierreLogico: false,
      espejo: false,
      nota: '',
    },
    separador: { piezas: [], exigePaquete: false, nota: '' },
    convergencia: { rutas: [], sinConvergencia: false, escalofrio: false, nota: '' },
    cierre: { hipotesisExpandidas: '', explicacionAburrida: '', salida: '' },
  };
}

// — Estado de cada filtro ————————————————————————————————————————————————

export function estadoInterruptor(p: PasoInterruptor): EstadoFiltro {
  if (p.espacioTomado) return 'ok';
  if (p.pulso === 'entusiasmo' || p.pulso === 'rechazo') return 'alarma';
  return 'pendiente';
}

export function estadoEstrato(p: PasoEstrato): EstadoFiltro {
  if (!p.estrato) return 'pendiente';
  if (p.estrato === 'divulgativo' && p.conclusionGrande) return 'alarma';
  return 'ok';
}

export function estadoGenealogia(p: PasoGenealogia): EstadoFiltro {
  if (p.ruta === 'ausente') return 'alarma';
  if (p.ruta === 'encontrada' && p.puerta.trim()) return 'ok';
  return 'pendiente';
}

export function estadoAuditoria(p: PasoAuditoria): EstadoFiltro {
  if (!p.escala || !p.espejo) return 'pendiente';
  if (p.escala === 'vision') return 'alarma';
  if (!p.hipotesisAlternativas && !p.dudaDeclarada && !p.cierreLogico) return 'alarma';
  return 'ok';
}

export function estadoSeparador(p: PasoSeparador): EstadoFiltro {
  if (p.piezas.length === 0) return 'pendiente';
  if (p.exigePaquete) return 'alarma';
  if (p.piezas.some((x) => x.cajon === 'toxico')) return 'alarma';
  return 'ok';
}

export function estadoConvergencia(p: PasoConvergencia): EstadoFiltro {
  if (p.escalofrio) return 'alarma';
  if (p.sinConvergencia) return 'ok';
  if (p.rutas.length === 0) return 'pendiente';
  if (p.rutas.length >= 2 && p.rutas.filter((r) => r.independiente).length < 2) return 'alarma';
  return 'ok';
}

export function cierreCompleto(c: Cierre): boolean {
  return c.explicacionAburrida.trim().length > 0;
}

// — Resultado agregado ————————————————————————————————————————————————————

export function evaluar(e: Evaluacion): Resultado {
  const estados: Record<FiltroId, EstadoFiltro> = {
    0: estadoInterruptor(e.interruptor),
    1: estadoEstrato(e.estrato),
    2: estadoGenealogia(e.genealogia),
    3: estadoAuditoria(e.auditoria),
    4: estadoSeparador(e.separador),
    5: estadoConvergencia(e.convergencia),
  };

  const ids: FiltroId[] = [0, 1, 2, 3, 4, 5];
  const alarmas = ids.filter((i) => estados[i] === 'alarma');
  const pendientes = ids.filter((i) => estados[i] === 'pendiente');

  let nivelConfianza = 0;
  for (const i of ids) {
    if (estados[i] !== 'ok') break;
    nivelConfianza += 1;
  }

  const completo = cierreCompleto(e.cierre);
  const veredicto: Resultado['veredicto'] =
    alarmas.length > 0
      ? 'retenido'
      : pendientes.length === 0 && completo
        ? 'pasa'
        : 'en_curso';

  return {
    veredicto,
    estados,
    nivelConfianza,
    retenidoEn: alarmas.length ? alarmas[0] : null,
    alarmas,
    pendientes,
    cierreCompleto: completo,
  };
}

export const TEXTO_VEREDICTO: Record<Resultado['veredicto'], { etiqueta: string; frase: string }> = {
  en_curso: {
    etiqueta: 'En curso',
    frase: 'Todavía hay filtros sin correr. El material no tiene nivel asignado.',
  },
  pasa: {
    etiqueta: 'Pasa los cinco',
    frase: 'Ningún filtro disparó alarma. Avanza de nivel de confianza — no a certeza.',
  },
  retenido: {
    etiqueta: 'Retenido',
    frase: 'Un filtro disparó alarma. El material se queda donde está hasta resolverse.',
  },
};

// — Racha diaria ——————————————————————————————————————————————————————————

/** Días consecutivos con práctica, contando hacia atrás desde hoy (o ayer si hoy aún no). */
export function racha(fechas: string[], hoy = hoyLocal()): number {
  const set = new Set(fechas);
  const cursor = new Date(`${hoy}T12:00:00`);
  if (!set.has(hoyLocal(cursor))) cursor.setDate(cursor.getDate() - 1);
  let n = 0;
  while (set.has(hoyLocal(cursor))) {
    n += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return n;
}

/** Últimos `n` días, del más antiguo al más reciente. */
export function ultimosDias(n: number, hoy = hoyLocal()): string[] {
  const salida: string[] = [];
  const cursor = new Date(`${hoy}T12:00:00`);
  cursor.setDate(cursor.getDate() - (n - 1));
  for (let i = 0; i < n; i += 1) {
    salida.push(hoyLocal(cursor));
    cursor.setDate(cursor.getDate() + 1);
  }
  return salida;
}

export function fechaCorta(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString('es-MX', { day: '2-digit', month: 'short' }) +
    ' · ' + d.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' });
}
