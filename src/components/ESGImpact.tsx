import React from 'react';
import { Leaf, Globe, Users, Award, TreePine, Droplets } from 'lucide-react';

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

interface ESGImpactProps {
  config: ProjectConfig;
}

const ESGImpact: React.FC<ESGImpactProps> = ({ config }) => {
  const impactMetrics = [
    {
      icon: Leaf,
      title: 'Reducción CO₂',
      value: `${(config.co2Reduction * 0.9).toFixed(0)}-${(config.co2Reduction * 1.1).toFixed(0)}`,
      unit: 'tCO₂/año',
      description: 'Toneladas de CO₂ evitadas anualmente',
      color: 'from-green-500 to-emerald-600'
    },
    {
      icon: Globe,
      title: 'Energía Limpia',
      value: config.annualGeneration.toLocaleString(),
      unit: 'MWh/año',
      description: 'Megavatios-hora de energía renovable',
      color: 'from-blue-500 to-cyan-600'
    },
    {
      icon: Users,
      title: 'Hogares Abastecidos',
      value: config.homesSupplied.toLocaleString(),
      unit: 'familias',
      description: 'Hogares equivalentes abastecidos',
      color: 'from-purple-500 to-indigo-600'
    },
    {
      icon: TreePine,
      title: 'Árboles Equivalentes',
      value: (config.co2Reduction * 24.5).toLocaleString(),
      unit: 'árboles',
      description: 'Árboles plantados equivalente en absorción CO₂',
      color: 'from-emerald-500 to-green-600'
    }
  ];

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-gray-900">Impacto ESG</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Generando valor sostenible para inversionistas y el medio ambiente
        </p>
      </div>

      {/* Impact Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {impactMetrics.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <div key={index} className="bg-white rounded-xl shadow-lg overflow-hidden group card-hover">
              <div className={`h-2 bg-gradient-to-r ${metric.color}`}></div>
              <div className="p-8">
                <div className="flex items-center space-x-4 mb-4">
                  <div className={`w-16 h-16 rounded-xl bg-gradient-to-r ${metric.color} flex items-center justify-center`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{metric.title}</h3>
                    <p className="text-gray-600">{metric.description}</p>
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-gray-900 mb-1 transform group-hover:scale-110 transition-transform">{metric.value}</div>
                  <div className="text-lg text-gray-500">{metric.unit}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ESG Categories */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Environmental */}
        <div className="bg-white rounded-xl shadow-lg p-8 card-hover">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
              <Leaf className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Ambiental</h2>
          </div>
          
          <div className="space-y-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="font-semibold text-green-800 mb-2">Beneficios Directos</h3>
              <ul className="space-y-1 text-green-700 text-sm">
                <li>• Cero emisiones durante operación</li>
                <li>• Reducción huella de carbono nacional</li>
                <li>• Contribución a metas climáticas de Panamá</li>
                <li>• Conservación de recursos hídricos</li>
              </ul>
            </div>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-800 mb-2">Certificaciones</h3>
              <ul className="space-y-1 text-blue-700 text-sm">
                <li>• Créditos de carbono elegibles</li>
                <li>• Certificados de energía renovable</li>
                <li>• Cumplimiento normativa ambiental</li>
                <li>• Evaluación de impacto aprobada</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Social */}
        <div className="bg-white rounded-xl shadow-lg p-8 card-hover">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Social</h2>
          </div>
          
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-800 mb-2">Impacto Comunitario</h3>
              <ul className="space-y-1 text-blue-700 text-sm">
                <li>• Empleos locales durante construcción</li>
                <li>• Capacitación técnica especializada</li>
                <li>• Energía limpia para comunidades</li>
                <li>• Desarrollo económico regional</li>
              </ul>
            </div>
            
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <h3 className="font-semibold text-purple-800 mb-2">Acceso Democratizado</h3>
              <ul className="space-y-1 text-purple-700 text-sm">
                <li>• Inversión desde $100 USD</li>
                <li>• Sin restricciones geográficas</li>
                <li>• Educación en energías renovables</li>
                <li>• Transparencia total de operaciones</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Governance */}
        <div className="bg-white rounded-xl shadow-lg p-8 card-hover">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
              <Award className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Gobernanza</h2>
          </div>
          
          <div className="space-y-4">
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <h3 className="font-semibold text-purple-800 mb-2">Transparencia</h3>
              <ul className="space-y-1 text-purple-700 text-sm">
                <li>• Reportes mensuales detallados</li>
                <li>• Auditorías independientes anuales</li>
                <li>• Dashboard en tiempo real</li>
                <li>• Comunicación directa con inversores</li>
              </ul>
            </div>
            
            <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
              <h3 className="font-semibold text-indigo-800 mb-2">Compliance</h3>
              <ul className="space-y-1 text-indigo-700 text-sm">
                <li>• Cumplimiento regulatorio completo</li>
                <li>• Gestión de riesgos profesional</li>
                <li>• Políticas ESG implementadas</li>
                <li>• Ética empresarial certificada</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Carbon Credits */}
      <div className="bg-gradient-to-r from-green-600 to-teal-700 rounded-xl shadow-lg p-8 text-white card-hover">
        <h2 className="text-2xl font-bold mb-6 text-center">Créditos de Carbono</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <div>
            <div className="text-3xl font-bold mb-2 transform hover:scale-110 transition-transform">{(config.co2Reduction * config.ppaDuration / 1000).toFixed(0)}K+</div>
            <div className="text-green-100">Créditos de carbono en {config.ppaDuration} años</div>
          </div>
          <div>
            <div className="text-3xl font-bold mb-2 transform hover:scale-110 transition-transform">$5-15</div>
            <div className="text-green-100">USD por crédito estimado</div>
          </div>
          <div>
            <div className="text-3xl font-bold mb-2 transform hover:scale-110 transition-transform">${((config.co2Reduction * config.ppaDuration * 10) / 1000000).toFixed(2)}M</div>
            <div className="text-green-100">Ingresos adicionales potenciales</div>
          </div>
        </div>
        
        <div className="mt-6 pt-6 border-t border-green-500 text-center">
          <p className="text-green-100">
            Los créditos de carbono generados pueden monetizarse como fuente de ingresos adicional,
            incrementando el retorno total del proyecto para los holders de tokens.
          </p>
        </div>
      </div>

      {/* UN SDGs Alignment */}
      <div className="bg-white rounded-xl shadow-lg p-8 card-hover">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Alineación con ODS de la ONU</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 border border-yellow-200 rounded-lg hover:shadow-lg transition-all duration-300 transform hover:scale-105">
            <div className="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center mx-auto mb-3 text-white font-bold text-lg transform hover:scale-110 transition-transform">7</div>
            <h3 className="font-semibold text-gray-900">Energía Asequible y No Contaminante</h3>
          </div>
          
          <div className="text-center p-4 border border-blue-200 rounded-lg hover:shadow-lg transition-all duration-300 transform hover:scale-105">
            <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-3 text-white font-bold text-lg transform hover:scale-110 transition-transform">13</div>
            <h3 className="font-semibold text-gray-900">Acción por el Clima</h3>
          </div>
          
          <div className="text-center p-4 border border-green-200 rounded-lg hover:shadow-lg transition-all duration-300 transform hover:scale-105">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-3 text-white font-bold text-lg transform hover:scale-110 transition-transform">8</div>
            <h3 className="font-semibold text-gray-900">Trabajo Decente y Crecimiento Económico</h3>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ESGImpact;