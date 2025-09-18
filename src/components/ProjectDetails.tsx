import React from 'react';
import { MapPin, Zap, Calendar, Award, Shield, Wrench } from 'lucide-react';

interface ProjectConfig {
  projectName: string;
  location: string;
  capacity: number;
  capex: number;
  ppaPrice: number;
  ppaDuration: number;
  opexAnnual: number;
  opexEscalation: number;
  annualGeneration: number;
  degradationRate: number;
  plantFactor: number;
  connectionVoltage: number;
  totalTokens: number;
  tokenPrice: number;
  investorShare: number;
  managerShare: number;
  minInvestment: number;
  constructionStart: string;
  operationStart: string;
  constructionDuration: number;
  co2Reduction: number;
  homesSupplied: number;
}

interface ProjectDetailsProps {
  config: ProjectConfig;
}

const ProjectDetails: React.FC<ProjectDetailsProps> = ({ config }) => {
  // Calculate dynamic values based on config
  const annualRevenue = config.annualGeneration * 1000 * config.ppaPrice;

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-gray-900">Detalles del Proyecto Solar</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Parque fotovoltaico de última generación ubicado en {config.location} con tecnología de punta
        </p>
      </div>

      {/* Location and Technical Specs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-xl shadow-lg p-8 card-hover">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
              <MapPin className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Ubicación y Conexión</h2>
          </div>
          
          <div className="space-y-4">
            <div className="border-l-4 border-green-500 pl-4">
              <h3 className="font-semibold text-gray-900">Ubicación</h3>
              <p className="text-gray-600">{config.location}</p>
            </div>
            <div className="border-l-4 border-blue-500 pl-4">
              <h3 className="font-semibold text-gray-900">Conexión a Red</h3>
              <p className="text-gray-600">Línea de transmisión {config.connectionVoltage} kV</p>
            </div>
            <div className="border-l-4 border-purple-500 pl-4">
              <h3 className="font-semibold text-gray-900">Terreno</h3>
              <p className="text-gray-600">Área optimizada para máxima irradiación solar</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8 card-hover">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Especificaciones Técnicas</h2>
          </div>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center py-2 border-b border-gray-100 hover:bg-gray-50 transition-colors px-2 rounded">
              <span className="text-gray-600">Capacidad Instalada:</span>
              <span className="font-semibold text-gray-900 transform hover:scale-110 transition-transform">{config.capacity} MWp</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-100 hover:bg-gray-50 transition-colors px-2 rounded">
              <span className="text-gray-600">Generación Anual:</span>
              <span className="font-semibold text-gray-900 transform hover:scale-110 transition-transform">{(config.annualGeneration * 0.9 / 1000).toFixed(0)}-{(config.annualGeneration * 1.1 / 1000).toFixed(0)} GWh</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-100 hover:bg-gray-50 transition-colors px-2 rounded">
              <span className="text-gray-600">Factor de Planta:</span>
              <span className="font-semibold text-gray-900 transform hover:scale-110 transition-transform">~{config.plantFactor}%</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-100 hover:bg-gray-50 transition-colors px-2 rounded">
              <span className="text-gray-600">Degradación Anual:</span>
              <span className="font-semibold text-gray-900 transform hover:scale-110 transition-transform">{config.degradationRate}%</span>
            </div>
            <div className="flex justify-between items-center py-2 hover:bg-gray-50 transition-colors px-2 rounded">
              <span className="text-gray-600">Vida Útil:</span>
              <span className="font-semibold text-gray-900 transform hover:scale-110 transition-transform">25+ años</span>
            </div>
          </div>
        </div>
      </div>

      {/* Legal and Regulatory */}
      <div className="bg-white rounded-xl shadow-lg p-8 card-hover">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Marco Legal y Regulatorio</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="font-semibold text-green-800 mb-2">Licencias Obtenidas</h3>
              <ul className="space-y-2 text-green-700">
                <li>✓ Licencia definitiva de generación (40 años)</li>
                <li>✓ Permiso de construcción</li>
                <li>✓ Estudio de impacto ambiental aprobado</li>
                <li>✓ Servidumbre de línea de transmisión</li>
              </ul>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-800 mb-2">Beneficios Fiscales</h3>
              <ul className="space-y-2 text-blue-700">
                <li>✓ Ley 45/2004 - Exoneración impuestos</li>
                <li>✓ Sin cargos de transmisión/distribución</li>
                <li>✓ Depreciación acelerada</li>
                <li>✓ Exención de importación equipos</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* EPC and Construction */}
      <div className="bg-white rounded-xl shadow-lg p-8 card-hover">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-600 rounded-lg flex items-center justify-center">
            <Wrench className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Construcción y EPC</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-orange-100 to-red-100 rounded-full flex items-center justify-center mx-auto mb-4 transform hover:scale-110 transition-transform">
              <Award className="w-8 h-8 text-orange-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Empresa EPC</h3>
            <p className="text-gray-600">Contratista local con 15 años de experiencia en proyectos solares</p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4 transform hover:scale-110 transition-transform">
              <Calendar className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Cronograma</h3>
            <p className="text-gray-600">12 meses de construcción con entrega llave en mano</p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-green-100 to-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4 transform hover:scale-110 transition-transform">
              <Shield className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Garantías</h3>
            <p className="text-gray-600">Garantía total del proyecto y equipos incluida en el contrato</p>
          </div>
        </div>
      </div>

      {/* PPA Details */}
      <div className="bg-gradient-to-r from-green-500 to-blue-600 rounded-xl shadow-lg p-8 text-white card-hover">
        <h2 className="text-2xl font-bold mb-6 text-center">Contrato de Compra de Energía (PPA)</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
          <div>
            <div className="text-3xl font-bold mb-2 transform hover:scale-110 transition-transform">{config.ppaDuration} años</div>
            <div className="text-green-100">Duración del contrato</div>
          </div>
          <div>
            <div className="text-3xl font-bold mb-2 transform hover:scale-110 transition-transform">${config.ppaPrice.toFixed(3)}</div>
            <div className="text-green-100">USD por kWh</div>
          </div>
          <div>
            <div className="text-3xl font-bold mb-2 transform hover:scale-110 transition-transform">${(annualRevenue / 1000000).toFixed(2)}M</div>
            <div className="text-green-100">Ingresos anuales</div>
          </div>
          <div>
            <div className="text-3xl font-bold mb-2 transform hover:scale-110 transition-transform">100%</div>
            <div className="text-green-100">Energía comprometida</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetails;