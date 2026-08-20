import { useCallback, useEffect, useMemo, useState } from 'react';
import { evaluacionVacia, hoyLocal } from './logica';
import type { EstadoApp, Evaluacion, RegistroDia } from './tipos';

const CLAVE = 'observador:v1';
const VERSION = 1;

const VACIO: EstadoApp = { version: VERSION, evaluaciones: [], dias: [] };

function leer(): EstadoApp {
  try {
    const crudo = localStorage.getItem(CLAVE);
    if (!crudo) return VACIO;
    const datos = JSON.parse(crudo) as Partial<EstadoApp>;
    return {
      version: VERSION,
      evaluaciones: Array.isArray(datos.evaluaciones) ? datos.evaluaciones : [],
      dias: Array.isArray(datos.dias) ? datos.dias : [],
    };
  } catch {
    return VACIO;
  }
}

function escribir(estado: EstadoApp) {
  try {
    localStorage.setItem(CLAVE, JSON.stringify(estado));
  } catch {
    /* almacenamiento lleno o bloqueado: la sesión sigue en memoria */
  }
}

export function useAlmacen() {
  const [estado, setEstado] = useState<EstadoApp>(() => leer());

  useEffect(() => {
    escribir(estado);
  }, [estado]);

  // Otra pestaña del mismo teléfono editando lo mismo.
  useEffect(() => {
    const alCambiar = (ev: StorageEvent) => {
      if (ev.key === CLAVE) setEstado(leer());
    };
    window.addEventListener('storage', alCambiar);
    return () => window.removeEventListener('storage', alCambiar);
  }, []);

  const crear = useCallback((titulo: string, fuente: string) => {
    const nueva = evaluacionVacia(titulo, fuente);
    setEstado((s) => ({ ...s, evaluaciones: [nueva, ...s.evaluaciones] }));
    return nueva.id;
  }, []);

  const actualizar = useCallback((id: string, cambio: (e: Evaluacion) => Evaluacion) => {
    setEstado((s) => ({
      ...s,
      evaluaciones: s.evaluaciones.map((e) =>
        e.id === id ? { ...cambio(e), actualizada: new Date().toISOString() } : e,
      ),
    }));
  }, []);

  const borrar = useCallback((id: string) => {
    setEstado((s) => ({ ...s, evaluaciones: s.evaluaciones.filter((e) => e.id !== id) }));
  }, []);

  const marcarDia = useCallback((cambio: Partial<Omit<RegistroDia, 'fecha'>>, fecha = hoyLocal()) => {
    setEstado((s) => {
      const previo = s.dias.find((d) => d.fecha === fecha) ?? { fecha, interruptor: false, nota: '' };
      const nuevo: RegistroDia = { ...previo, ...cambio };
      return { ...s, dias: [nuevo, ...s.dias.filter((d) => d.fecha !== fecha)] };
    });
  }, []);

  const importar = useCallback((datos: EstadoApp) => {
    setEstado({
      version: VERSION,
      evaluaciones: Array.isArray(datos.evaluaciones) ? datos.evaluaciones : [],
      dias: Array.isArray(datos.dias) ? datos.dias : [],
    });
  }, []);

  const diasActivos = useMemo(() => {
    const set = new Set<string>();
    estado.dias.filter((d) => d.interruptor).forEach((d) => set.add(d.fecha));
    estado.evaluaciones.forEach((e) => set.add(hoyLocal(new Date(e.creada))));
    return [...set];
  }, [estado]);

  return { estado, crear, actualizar, borrar, marcarDia, importar, diasActivos };
}

export type Almacen = ReturnType<typeof useAlmacen>;
