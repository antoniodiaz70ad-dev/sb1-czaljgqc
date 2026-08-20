import { lazy, StrictMode, Suspense, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import ObservadorApp from './observador/ObservadorApp.tsx';
import './index.css';

/**
 * Dos aplicaciones en el mismo despliegue:
 *  - «/»        → Protocolo del Observador (uso diario en el teléfono)
 *  - «/#/solar» → plataforma LEVI-SOLAR1
 *
 * La plataforma solar se carga aparte para que abrir el Observador en datos
 * móviles no arrastre sus gráficas.
 */
const AppSolar = lazy(() => import('./App.tsx'));

function Raiz() {
  const [ruta, setRuta] = useState(() => window.location.hash);

  useEffect(() => {
    const alCambiar = () => setRuta(window.location.hash);
    window.addEventListener('hashchange', alCambiar);
    return () => window.removeEventListener('hashchange', alCambiar);
  }, []);

  if (ruta.startsWith('#/solar')) {
    return (
      <Suspense fallback={<div className="min-h-screen bg-slate-50" />}>
        <AppSolar />
      </Suspense>
    );
  }
  return <ObservadorApp />;
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Raiz />
  </StrictMode>,
);

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register(`${import.meta.env.BASE_URL}sw.js`).catch(() => {
      /* sin conexión o sin permisos: la app sigue funcionando en línea */
    });
  });
}
