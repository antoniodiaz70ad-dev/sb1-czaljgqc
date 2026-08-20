/**
 * Protocolo del Observador — cinco filtros.
 * Transcripción del documento personal (agosto 2026). Fuente única de verdad
 * para la ficha de consulta y para el corredor de evaluaciones.
 */

export type FiltroId = 0 | 1 | 2 | 3 | 4 | 5;

export interface Filtro {
  id: FiltroId;
  numero: string;
  nombre: string;
  gatillo: string;
  cuerpo: string[];
  alarma: string;
  /** Lo que hay que resolver para que el material avance de nivel. */
  resolver: string;
}

export const ORIGEN =
  'Destilado del estudio PKD/Grant/Kepler. Se aplica a cualquier material que llegue con ' +
  'pretensión de verdad — un libro, un video, un paper, una revelación, una certeza propia. ' +
  'Se corre en orden. Si un filtro dispara alarma, el material no avanza al siguiente nivel ' +
  'de confianza; se queda donde está hasta resolverse.';

export const FILTROS: Filtro[] = [
  {
    id: 0,
    numero: '0',
    nombre: 'El interruptor',
    gatillo: '¿Quién es el que está consciente de esto?',
    cuerpo: [
      'Ante cualquier material que acelere el pulso — entusiasmo o rechazo — tres segundos de espacio antes de responder.',
      'Función: separa al que evalúa del que reacciona. Ningún filtro funciona si lo corre el personaje en vez del observador.',
    ],
    alarma: 'Responder desde el pulso acelerado, sin los tres segundos.',
    resolver: 'Tomar el espacio. El filtro no se salta: se corre antes que todo lo demás.',
  },
  {
    id: 1,
    numero: '1',
    nombre: 'Estrato',
    gatillo: '¿Qué es esto, antes de qué dice?',
    cuerpo: [
      'Primario: fuente de primera mano, datos, texto original.',
      'Académico: revisión crítica, pares.',
      'Divulgativo: resumen, video, hilo, síntesis de IA.',
    ],
    alarma: 'Conclusiones grandes montadas solo sobre estrato divulgativo. Un solo ladrillo de estrato bajo no carga un edificio.',
    resolver: 'Bajar la conclusión al tamaño del estrato, o subir el estrato hasta la fuente primaria.',
  },
  {
    id: 2,
    numero: '2',
    nombre: 'Genealogía',
    gatillo: '¿Por qué puerta entró cada idea, y con qué fecha?',
    cuerpo: [
      'Toda afirmación tiene una ruta de llegada rastreable: una lectura, una convención, una elección humana fechable. Encontrarla es obligatorio antes de aceptar «descubrimiento».',
    ],
    alarma:
      'Una idea que se presenta sin genealogía — como revelación, intuición pura o «conocimiento antiguo» — casi siempre tiene una fuente libresca que el autor no declara o no conoce. (El holograma de Dick entró por los McKenna, 1975. El 6 de Grant entró por un escriba babilónico, tercer milenio a.C.)',
    resolver: 'Encontrar la puerta y la fecha. Sin ruta rastreable no hay descubrimiento, hay herencia sin declarar.',
  },
  {
    id: 3,
    numero: '3',
    nombre: 'Auto-auditoría',
    gatillo: '¿El autor incluye la hipótesis de que se equivoca?',
    cuerpo: [
      'La escala completa: visión sin filtro (Grant) → filtro sin datos (Dick: fracaso honroso) → filtro con datos (Kepler: una ley de la naturaleza).',
      'Aplica también en espejo: ¿yo estoy incluyendo la hipótesis de que me equivoco?',
    ],
    alarma:
      'Cero hipótesis alternativas, cero duda declarada, cierre emocional en lugar de cierre lógico. El que no se audita está vendiendo, no informando.',
    resolver: 'Escribir la hipótesis alternativa que el autor no escribió — y la propia.',
  },
  {
    id: 4,
    numero: '4',
    nombre: 'Separador',
    gatillo: '¿Qué parte puedo usar sin comprar la ontología completa?',
    cuerpo: [
      'Cuatro cajones, sin mezclar.',
    ],
    alarma: 'Sentir que aceptar una pieza obliga a aceptar el sistema entero. Ningún material honesto exige el paquete completo.',
    resolver: 'Separar pieza por pieza hasta que cada una sostenga sola, o descartar el marco.',
  },
  {
    id: 5,
    numero: '5',
    nombre: 'Convergencia',
    gatillo: '¿Las rutas que coinciden son independientes, o beben del mismo estanque?',
    cuerpo: [
      'Dos fuentes que heredan de Platón no son dos fuentes. La resonancia solo cuenta como evidencia cuando los caminos no se tocan — y los únicos caminos garantizadamente independientes son los que terminan en ecuación o medición.',
    ],
    alarma:
      'El escalofrío de «esto confirma lo que ya sabía». Ese escalofrío es el momento exacto de detenerse: la confirmación que se siente bien es la que exige más evidencia, no menos.',
    resolver: 'Rastrear cada ruta hasta su raíz. Si comparten raíz, cuentan como una sola.',
  },
];

export const CAJONES = [
  {
    id: 'utilizable' as const,
    nombre: 'Utilizable',
    definicion: 'Funciona aunque el marco sea falso.',
    color: 'esmeralda',
  },
  {
    id: 'creencia' as const,
    nombre: 'Creencia legítima',
    definicion: 'Mito personal que hace trabajo psicológico, declarado como tal.',
    color: 'azul',
  },
  {
    id: 'indemostrable' as const,
    nombre: 'Indemostrable',
    definicion: 'Se contempla, no se afirma.',
    color: 'ambar',
  },
  {
    id: 'toxico' as const,
    nombre: 'Tóxico',
    definicion: 'Estructura infalsable donde todo confirma — se descarta el marco, no solo la conclusión.',
    color: 'rojo',
  },
];

export type CajonId = (typeof CAJONES)[number]['id'];

export const ESTRATOS = [
  { id: 'primario' as const, nombre: 'Primario', detalle: 'Fuente de primera mano, datos, texto original.', peso: 3 },
  { id: 'academico' as const, nombre: 'Académico', detalle: 'Revisión crítica, pares.', peso: 2 },
  { id: 'divulgativo' as const, nombre: 'Divulgativo', detalle: 'Resumen, video, hilo, síntesis de IA.', peso: 1 },
];

export type EstratoId = (typeof ESTRATOS)[number]['id'];

export const ESCALA_AUDITORIA = [
  { id: 'vision' as const, nombre: 'Visión sin filtro', referencia: 'Grant', peso: 1 },
  { id: 'filtro' as const, nombre: 'Filtro sin datos', referencia: 'Dick — fracaso honroso', peso: 2 },
  { id: 'datos' as const, nombre: 'Filtro con datos', referencia: 'Kepler — una ley de la naturaleza', peso: 3 },
];

export type EscalaId = (typeof ESCALA_AUDITORIA)[number]['id'];

export const REGLA_CIERRE = {
  titulo: 'Regla de cierre',
  texto:
    'Ante lo anómalo: expandir el espacio de hipótesis antes de defender la favorita, mantener viva la ' +
    'explicación aburrida, y recordar la salida que dejó el que más lejos llegó sin datos: cuando el ' +
    'sistema entero falle — humor, amor y belleza.',
  salida: ['Humor', 'Amor', 'Belleza'],
};
