import type { CajonId, EscalaId, EstratoId, FiltroId } from './protocolo';

/** El estado de cada filtro no se guarda: se deriva siempre de las respuestas. */
export type EstadoFiltro = 'pendiente' | 'ok' | 'alarma';

export interface PasoInterruptor {
  espacioTomado: boolean;
  pulso: '' | 'entusiasmo' | 'rechazo' | 'ninguno';
  nota: string;
}

export interface PasoEstrato {
  estrato: EstratoId | '';
  conclusionGrande: boolean;
  nota: string;
}

export interface PasoGenealogia {
  ruta: '' | 'encontrada' | 'ausente';
  puerta: string;
  fecha: string;
  nota: string;
}

export interface PasoAuditoria {
  escala: EscalaId | '';
  hipotesisAlternativas: boolean;
  dudaDeclarada: boolean;
  cierreLogico: boolean;
  espejo: boolean;
  nota: string;
}

export interface PiezaSeparada {
  id: string;
  texto: string;
  cajon: CajonId;
}

export interface PasoSeparador {
  piezas: PiezaSeparada[];
  exigePaquete: boolean;
  nota: string;
}

export interface RutaConvergencia {
  id: string;
  texto: string;
  independiente: boolean;
  raiz: string;
}

export interface PasoConvergencia {
  rutas: RutaConvergencia[];
  sinConvergencia: boolean;
  escalofrio: boolean;
  nota: string;
}

export interface Cierre {
  hipotesisExpandidas: string;
  explicacionAburrida: string;
  salida: string;
}

export type Veredicto = 'en_curso' | 'pasa' | 'retenido';

export interface Evaluacion {
  id: string;
  titulo: string;
  fuente: string;
  creada: string;
  actualizada: string;
  archivada: boolean;
  interruptor: PasoInterruptor;
  estrato: PasoEstrato;
  genealogia: PasoGenealogia;
  auditoria: PasoAuditoria;
  separador: PasoSeparador;
  convergencia: PasoConvergencia;
  cierre: Cierre;
}

export interface Resultado {
  veredicto: Veredicto;
  estados: Record<FiltroId, EstadoFiltro>;
  /** Filtros superados en orden, sin saltarse ninguno, antes de la primera alarma o hueco. */
  nivelConfianza: number;
  retenidoEn: FiltroId | null;
  alarmas: FiltroId[];
  pendientes: FiltroId[];
  cierreCompleto: boolean;
}

export interface RegistroDia {
  /** AAAA-MM-DD en hora local. */
  fecha: string;
  interruptor: boolean;
  nota: string;
}

export interface EstadoApp {
  version: number;
  evaluaciones: Evaluacion[];
  dias: RegistroDia[];
}
