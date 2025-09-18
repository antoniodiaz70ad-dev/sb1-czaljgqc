import React from 'react';
import { TrendingUp, Zap, Calendar, DollarSign, Users, Target } from 'lucide-react';

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

interface DashboardProps {
  config: ProjectConfig;
}

const Dashboard: React.FC<DashboardProps> = ({ config }) => {
  // Calculate dynamic values based on config
  const annualRevenue = config.annualGeneration * 1000 * config.ppaPrice;
  const annualNetCashFlow = annualRevenue - config.opexAnnual;
  const roi = (annualNetCashFlow / config.capex) * 100;
  const paybackPeriod = config.capex / annualNetCashFlow;
  const tokenizedRevenue = annualNetCashFlow * (config.investorShare / 100);
  const yieldPerToken = tokenizedRevenue / config.totalTokens;
  const yieldPercentage = (yieldPerToken / config.tokenPrice) * 100;

  const keyMetrics = [
    {
      title: 'Capacidad Instalada',
      value: `${config.capacity} MW`,
      subtitle: 'Potencia nominal',
      icon: Zap,
      color: 'from-blue-500 to-cyan-600',
    },
    {
      title: 'Inversión Total',
      value: `$${(config.capex / 1000000).toFixed(1)}M`,
      subtitle: 'CAPEX requerido',
      icon: DollarSign,
      color: 'from-green-500 to-emerald-600',
    },
    {
      title: 'IRR Proyecto',
      value: `${(roi - 2).toFixed(0)}-${(roi + 2).toFixed(0)}%`,
      subtitle: 'Retorno interno',
      icon: TrendingUp,
      color: 'from-purple-500 to-indigo-600',
    },
    {
      title: 'Operación Comercial',
      value: new Date(config.operationStart).toLocaleDateString('es-ES', { month: 'short', year: 'numeric' }),
      subtitle: 'Inicio actividades',
      icon: Calendar,
      color: 'from-orange-500 to-red-600',
    },
    {
      title: 'Generación Anual',
      value: `${(config.annualGeneration / 1000).toFixed(0)} GWh`,
      subtitle: 'Promedio esperado',
      icon: Target,
      color: 'from-teal-500 to-green-600',
    },
    {
      title: 'Tokens Disponibles',
      value: `${(config.totalTokens / 1000000).toFixed(1)}M`,
      subtitle: config.projectName,
      icon: Users,
      color: 'from-pink-500 to-rose-600',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Parque Solar <span className="gradient-text">{config.projectName}</span>
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Proyecto de energía renovable tokenizado en {config.location} con retornos garantizados por PPA a {config.ppaDuration} años
        </p>
        <div className="flex flex-wrap justify-center gap-4 pt-6">
          <div className="bg-green-100 text-green-800 px-6 py-3 rounded-full font-semibold shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300">
            ✓ Licencias Definitivas (40 años)
          </div>
          <div className="bg-blue-100 text-blue-800 px-6 py-3 rounded-full font-semibold shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300">
            ✓ Viabilidad Técnica Aprobada
          </div>
          <div className="bg-purple-100 text-purple-800 px-6 py-3 rounded-full font-semibold shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300">
            ✓ Contrato PPA Firmado
          </div>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {keyMetrics.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <div
              key={index}
              className="bg-white rounded-xl shadow-lg overflow-hidden group card-hover"
            >
              <div className={`h-2 bg-gradient-to-r ${metric.color}`}></div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${metric.color} flex items-center justify-center`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-right transform group-hover:scale-110 transition-transform duration-300">
                    <div className="text-2xl font-bold text-gray-900">{metric.value}</div>
                    <div className="text-sm text-gray-500">{metric.subtitle}</div>
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-gray-800 group-hover:text-green-600 transition-colors">
                  {metric.title}
                </h3>
              </div>
            </div>
          );
        })}
      </div>

      {/* Timeline */}
      <div className="bg-white rounded-xl shadow-lg p-8 card-hover">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Cronograma del Proyecto</h2>
        <div className="relative">
          <div className="absolute left-8 top-0 bottom-0 w-1 bg-gradient-to-b from-green-500 via-blue-500 to-purple-600 rounded-full"></div>
          <div className="space-y-6">
            {[
              { date: 'Q4 2024', title: 'Financiación Completada', status: 'current', description: 'Tokenización y captación de inversión' },
              { date: 'Q1 2025', title: 'Inicio de Construcción', status: 'upcoming', description: 'Construcción EPC con empresa local' },
              { date: 'Q4 2025', title: 'Finalización Construcción', status: 'upcoming', description: 'Pruebas y puesta en marcha' },
              { date: 'Mar 2026', title: 'Operación Comercial', status: 'upcoming', description: 'Inicio de generación y ingresos PPA' },
            ].map((phase, index) => (
              <div key={index} className="relative flex items-center space-x-4">
                <div className={`w-4 h-4 rounded-full z-10 ${
                  phase.status === 'current' 
                    ? 'bg-green-500 ring-4 ring-green-200 pulse-glow' 
                    : 'bg-gray-300 ring-4 ring-gray-100 hover:bg-green-400 hover:ring-green-100'
                }`}></div>
                <div className="flex-1 bg-gray-50 rounded-lg p-4 hover:bg-gradient-to-r hover:from-green-50 hover:to-blue-50 transition-all duration-300 hover:shadow-md">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-gray-900">{phase.title}</h3>
                      <p className="text-gray-600 text-sm mt-1">{phase.description}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      phase.status === 'current' 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {phase.date}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Investment Highlights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl shadow-lg p-8 text-white card-hover">
          <h3 className="text-2xl font-bold mb-4">Retornos Proyectados</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span>ROI Simple:</span>
              <span className="text-2xl font-bold transform hover:scale-110 transition-transform">23%</span>
            </div>
            <div className="flex justify-between items-center">
              <span>IRR:</span>
              <span className="text-2xl font-bold transform hover:scale-110 transition-transform">17-19%</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Payback:</span>
              <span className="text-2xl font-bold transform hover:scale-110 transition-transform">4.5 años</span>
            </div>
            <div className="flex justify-between items-center border-t border-green-400 pt-3 mt-4">
              <span>Yield por Token:</span>
              <span className="text-2xl font-bold text-yellow-200 transform hover:scale-110 transition-transform">~16% anual</span>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg p-8 text-white card-hover">
          <h3 className="text-2xl font-bold mb-4">Especificaciones Técnicas</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span>Capacidad:</span>
              <span className="text-2xl font-bold transform hover:scale-110 transition-transform">{config.capacity} MWp</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Generación:</span>
              <span className="text-2xl font-bold transform hover:scale-110 transition-transform">{(config.annualGeneration / 1000).toFixed(0)} GWh/año</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Conexión:</span>
              <span className="text-2xl font-bold transform hover:scale-110 transition-transform">{config.connectionVoltage} kV</span>
            </div>
            <div className="flex justify-between items-center border-t border-blue-400 pt-3 mt-4">
              <span>PPA:</span>
              <span className="text-2xl font-bold text-yellow-200 transform hover:scale-110 transition-transform">${config.ppaPrice.toFixed(3)}/kWh</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="bg-white rounded-xl shadow-lg p-8 card-hover">
        <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Impacto Ambiental Anual</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600 mb-2 transform hover:scale-110 transition-transform">{(config.co2Reduction * 0.9).toFixed(0)}-{(config.co2Reduction * 1.1).toFixed(0)}</div>
            <div className="text-gray-600">tCO₂ evitadas</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2 transform hover:scale-110 transition-transform">{config.annualGeneration.toLocaleString()}</div>
            <div className="text-gray-600">MWh limpios</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2 transform hover:scale-110 transition-transform">{config.homesSupplied.toLocaleString()}</div>
            <div className="text-gray-600">Hogares abastecidos</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;