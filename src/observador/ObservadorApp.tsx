import { useEffect, useState } from 'react';
import { BookOpen, Eye, History, X } from 'lucide-react';
import { useAlmacen } from './almacen';
import Corredor from './vistas/Corredor';
import Ficha from './vistas/Ficha';
import Hoy from './vistas/Hoy';
import Registro from './vistas/Registro';
import { Boton, Campo } from './ui/basicos';

type Pestana = 'hoy' | 'ficha' | 'registro';

const PESTANAS: { id: Pestana; nombre: string; Icono: typeof Eye }[] = [
  { id: 'hoy', nombre: 'Hoy', Icono: Eye },
  { id: 'ficha', nombre: 'Ficha', Icono: BookOpen },
  { id: 'registro', nombre: 'Registro', Icono: History },
];

export default function ObservadorApp() {
  const almacen = useAlmacen();
  const [pestana, setPestana] = useState<Pestana>('hoy');
  const [activa, setActiva] = useState<string | null>(null);
  const [nuevo, setNuevo] = useState(false);
  const [filtroRegistro, setFiltroRegistro] = useState<'todos' | 'retenido'>('todos');
  const [fichaInicial, setFichaInicial] = useState(0);

  const evaluacion = activa ? almacen.estado.evaluaciones.find((e) => e.id === activa) ?? null : null;

  // El botón atrás del teléfono cierra el corredor antes de salir de la app.
  useEffect(() => {
    if (!evaluacion) return;
    window.history.pushState({ corredor: true }, '');
    const alVolver = () => setActiva(null);
    window.addEventListener('popstate', alVolver);
    return () => window.removeEventListener('popstate', alVolver);
  }, [evaluacion?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pestana, activa]);

  return (
    <div className="obs-root min-h-[100dvh] bg-zinc-950 text-zinc-100 antialiased">
      <div
        className="mx-auto min-h-[100dvh] max-w-md px-4"
        style={{ paddingBottom: evaluacion ? '0' : 'calc(84px + env(safe-area-inset-bottom, 0px))' }}
      >
        {evaluacion ? (
          <Corredor evaluacion={evaluacion} almacen={almacen} onSalir={() => setActiva(null)} />
        ) : (
          <>
            {pestana === 'hoy' && (
              <Hoy
                almacen={almacen}
                onAbrir={setActiva}
                onNuevo={() => setNuevo(true)}
                onVerRetenidos={() => {
                  setFiltroRegistro('retenido');
                  setPestana('registro');
                }}
                onAbrirFicha={(filtro) => {
                  setFichaInicial(filtro);
                  setPestana('ficha');
                }}
              />
            )}
            {pestana === 'ficha' && <Ficha key={fichaInicial} abiertoInicial={fichaInicial} />}
            {pestana === 'registro' && (
              <Registro
                key={filtroRegistro}
                almacen={almacen}
                onAbrir={setActiva}
                filtroInicial={filtroRegistro}
              />
            )}
          </>
        )}
      </div>

      {!evaluacion && (
        <nav
          className="fixed inset-x-0 bottom-0 z-30 border-t border-zinc-900 bg-zinc-950/95 backdrop-blur"
          style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
        >
          <div className="mx-auto flex max-w-md">
            {PESTANAS.map(({ id, nombre, Icono }) => {
              const activo = pestana === id;
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => {
                    if (id === 'registro' && pestana !== 'registro') setFiltroRegistro('todos');
                    setPestana(id);
                  }}
                  className={`flex flex-1 flex-col items-center gap-1 py-2.5 text-[11px] ${
                    activo ? 'text-amber-300' : 'text-zinc-500'
                  }`}
                >
                  <Icono size={20} strokeWidth={activo ? 2.2 : 1.7} />
                  {nombre}
                </button>
              );
            })}
          </div>
        </nav>
      )}

      {nuevo && (
        <NuevoMaterial
          onCancelar={() => setNuevo(false)}
          onCrear={(titulo, fuente) => {
            const id = almacen.crear(titulo, fuente);
            almacen.marcarDia({});
            setNuevo(false);
            setActiva(id);
          }}
        />
      )}
    </div>
  );
}

function NuevoMaterial({
  onCrear,
  onCancelar,
}: {
  onCrear: (titulo: string, fuente: string) => void;
  onCancelar: () => void;
}) {
  const [titulo, setTitulo] = useState('');
  const [fuente, setFuente] = useState('');

  return (
    <div className="fixed inset-0 z-40 flex items-end bg-black/70" onClick={onCancelar}>
      <div
        className="w-full rounded-t-3xl border-t border-zinc-800 bg-zinc-900 p-5"
        style={{ paddingBottom: 'calc(1.25rem + env(safe-area-inset-bottom, 0px))' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-[18px] font-semibold text-zinc-50">¿Qué llegó?</h2>
          <button type="button" onClick={onCancelar} aria-label="Cancelar" className="text-zinc-500">
            <X size={18} />
          </button>
        </div>
        <div className="space-y-3">
          <Campo
            tipo="texto"
            etiqueta="Material"
            valor={titulo}
            onChange={setTitulo}
            autoFoco
            placeholder="Un libro, un video, un paper, una certeza propia…"
          />
          <Campo
            tipo="texto"
            etiqueta="Fuente"
            valor={fuente}
            onChange={setFuente}
            placeholder="Quién lo dice, dónde lo vi"
          />
          <Boton
            variante="principal"
            className="w-full"
            disabled={!titulo.trim()}
            onClick={() => onCrear(titulo.trim(), fuente.trim())}
          >
            Correr los cinco filtros
          </Boton>
        </div>
      </div>
    </div>
  );
}
