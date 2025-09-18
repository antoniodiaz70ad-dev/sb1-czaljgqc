import React from 'react';
import { ArrowRight, Building, Zap, DollarSign, Users, Repeat, TrendingUp } from 'lucide-react';

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

interface BusinessModelProps {
  config: ProjectConfig;
}

const BusinessModel: React.FC<BusinessModelProps> = ({ config }) => {
  // Calculate dynamic values
  const annualRevenue = config.annualGeneration * 1000 * config.ppaPrice;
  const estimatedCarbonRevenue = config.co2Reduction * 10; // $10 per tCO2 estimate

  const businessFlow = [
    {
      phase: 'Financiación',
      icon: DollarSign,
      description: 'Leviathan financia CAPEX mediante tokenización',
      details: [`Emisión de ${(config.totalTokens / 1000000).toFixed(1)}M tokens ${config.projectName}`, `Captación de $${(config.capex / 1000000).toFixed(1)}M USD`, 'Estructura legal y compliance'],
      color: 'from-green-500 to-emerald-600'
    },
    {
      phase: 'Construcción',
      icon: Building,
      description: 'EPC local ejecuta proyecto llave en mano',
      details: [`${config.constructionDuration} meses de construcción`, 'Supervisión técnica continua', 'Pruebas y puesta en marcha'],
      color: 'from-blue-500 to-indigo-600'
    },
    {
      phase: 'Operación',
      icon: Zap,
      description: 'Generación y venta de energía bajo PPA',
      details: [`Venta garantizada ${config.ppaDuration} años`, 'O&M profesional', 'Monitoreo en tiempo real'],
      color: 'from-purple-500 to-pink-600'
    },
    {
      phase: 'Distribución',
      icon: Users,
      description: 'Distribución proporcional a token holders',
      details: [`${config.investorShare}% a inversionistas`, `${config.managerShare}% a Leviathan`, 'Pagos mensuales automáticos'],
      color: 'from-orange-500 to-red-600'
    }
  ];

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-gray-900">Modelo de Negocio</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Estructura operativa diseñada para maximizar retornos y minimizar riesgos
        </p>
      </div>

      {/* Business Flow */}
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Flujo Operativo</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {businessFlow.map((phase, index) => {
            const Icon = phase.icon;
            return (
              <div key={index} className="relative">
                {index < businessFlow.length - 1 && (
                  <div className="hidden lg:block absolute top-8 -right-3 z-10">
                    <ArrowRight className="w-6 h-6 text-gray-400 animate-pulse" />
                  </div>
                )}
                
                <div className="bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-xl p-6 h-full card-hover">
                  <div className={`w-16 h-16 rounded-xl bg-gradient-to-r ${phase.color} flex items-center justify-center mx-auto mb-4`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  
                  <h3 className="text-lg font-bold text-gray-900 text-center mb-3">{phase.phase}</h3>
                  <p className="text-sm text-gray-600 text-center mb-4">{phase.description}</p>
                  
                  <ul className="space-y-1">
                    {phase.details.map((detail, idx) => (
                      <li key={idx} className="text-xs text-gray-500">• {detail}</li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Revenue Streams */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-xl shadow-lg p-8 card-hover">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Fuentes de Ingresos</h2>
          </div>
          
          <div className="space-y-4">
            <div className="border border-green-200 rounded-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="font-semibold text-green-800">Venta de Energía (PPA)</span>
                <span className="text-xl font-bold text-green-700">95%</span>
              </div>
              <div className="text-sm text-green-600">${(annualRevenue / 1000000).toFixed(2)}M anuales garantizados por {config.ppaDuration} años</div>
            </div>
            
            <div className="border border-blue-200 rounded-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="font-semibold text-blue-800">Créditos de Carbono</span>
                <span className="text-xl font-bold text-blue-700">5%</span>
              </div>
              <div className="text-sm text-blue-600">Ingresos adicionales variables (~${(estimatedCarbonRevenue / 1000).toFixed(0)}K/año)</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8 card-hover">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
              <Repeat className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Estructura de Costos</h2>
          </div>
          
          <div className="space-y-4">
            <div className="border border-orange-200 rounded-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="font-semibold text-orange-800">O&M Operacional</span>
                <span className="text-xl font-bold text-orange-700">60%</span>
              </div>
              <div className="text-sm text-orange-600">${(config.opexAnnual * 0.6 / 1000).toFixed(0)}K anuales (mantenimiento, seguros)</div>
            </div>
            
            <div className="border border-purple-200 rounded-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="font-semibold text-purple-800">Administración</span>
                <span className="text-xl font-bold text-purple-700">25%</span>
              </div>
              <div className="text-sm text-purple-600">${(config.opexAnnual * 0.25 / 1000).toFixed(0)}K anuales (gestión, reportes)</div>
            </div>
            
            <div className="border border-red-200 rounded-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="font-semibold text-red-800">Reservas y Otros</span>
                <span className="text-xl font-bold text-red-700">15%</span>
              </div>
              <div className="text-sm text-red-600">${(config.opexAnnual * 0.15 / 1000).toFixed(0)}K anuales (contingencias, upgrades)</div>
            </div>
          </div>
        </div>
      </div>

      {/* Exit Strategies */}
      <div className="bg-white rounded-xl shadow-lg p-8 card-hover">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Estrategias de Salida</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="border border-green-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300 transform hover:scale-105">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4 transform hover:scale-110 transition-transform">
              <Repeat className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Renovación PPA</h3>
            <p className="text-gray-600 text-sm">
              Extensión del contrato de compra de energía por 10-15 años adicionales con términos renegociados.
            </p>
          </div>
          
          <div className="border border-blue-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300 transform hover:scale-105">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4 transform hover:scale-110 transition-transform">
              <Zap className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Mercado Spot</h3>
            <p className="text-gray-600 text-sm">
              Venta de energía en mercado libre con precios potencialmente superiores al PPA original.
            </p>
          </div>
          
          <div className="border border-purple-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300 transform hover:scale-105">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4 transform hover:scale-110 transition-transform">
              <Building className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Venta de Activo</h3>
            <p className="text-gray-600 text-sm">
              Venta del parque solar a operador energético con distribución de capital gain a token holders.
            </p>
          </div>
        </div>
      </div>

      {/* Value Proposition for Leviathan */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-xl shadow-lg p-8 text-white">
        <h2 className="text-2xl font-bold mb-6 text-center">Beneficios Estratégicos para Leviathan</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-lg font-semibold text-blue-300 mb-4">Expansión de Portafolio</h3>
            <ul className="space-y-2 text-gray-300">
              <li>• Diversificación a energías renovables</li>
              <li>• Posicionamiento como líder ESG</li>
              <li>• Narrativa "Real Assets, Real Returns"</li>
              <li>• Hub solar-financiero en Panamá</li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-green-300 mb-4">Sinergias Operativas</h3>
            <ul className="space-y-2 text-gray-300">
              <li>• Integración con vertical de créditos carbono</li>
              <li>• Cross-selling a inversionistas existentes</li>
              <li>• Expertise replicable en otros proyectos</li>
              <li>• Fortalecimiento de marca ESG</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessModel;