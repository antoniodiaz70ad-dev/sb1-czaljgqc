import React from 'react';
import { Coins, Users, Lock, Zap, TrendingUp, Shield } from 'lucide-react';
import InvestmentCalculator from './InvestmentCalculator';

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

interface TokenizationProps {
  config: ProjectConfig;
}

const Tokenization: React.FC<TokenizationProps> = ({ config }) => {
  // Calculate dynamic values based on config
  const annualRevenue = config.annualGeneration * 1000 * config.ppaPrice;
  const annualNetCashFlow = annualRevenue - config.opexAnnual;
  const tokenizedRevenue = annualNetCashFlow * (config.investorShare / 100);
  const managerRevenue = annualNetCashFlow * (config.managerShare / 100);
  const yieldPerToken = tokenizedRevenue / config.totalTokens;
  const yieldPercentage = (yieldPerToken / config.tokenPrice) * 100;

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-gray-900">Tokenización {config.projectName}</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Acceso democratizado a inversión en energía renovable mediante tecnología blockchain
        </p>
      </div>

      {/* Token Overview */}
      <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-xl shadow-lg p-8 text-white">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
          <div>
            <div className="text-3xl font-bold mb-2">{(config.totalTokens / 1000000).toFixed(1)}M</div>
            <div className="text-indigo-100">Tokens Totales</div>
          </div>
          <div>
            <div className="text-3xl font-bold mb-2">${config.tokenPrice.toFixed(2)}</div>
            <div className="text-indigo-100">USD por Token</div>
          </div>
          <div>
            <div className="text-3xl font-bold mb-2">~{yieldPercentage.toFixed(1)}%</div>
            <div className="text-indigo-100">Yield Anual</div>
          </div>
          <div>
            <div className="text-3xl font-bold mb-2">{config.investorShare}%</div>
            <div className="text-indigo-100">Ingresos Tokenizados</div>
          </div>
        </div>
      </div>

      {/* Token Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
              <Coins className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Distribución de Ingresos</h2>
          </div>
          
          <div className="space-y-4">
            <div className="bg-gradient-to-r from-green-100 to-emerald-100 rounded-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="font-semibold text-green-800">Inversionistas Tokenizados</span>
                <span className="text-2xl font-bold text-green-700">{config.investorShare}%</span>
              </div>
              <div className="text-sm text-green-600">~${(tokenizedRevenue / 1000000).toFixed(2)}M anuales distribuidos</div>
            </div>
            
            <div className="bg-gradient-to-r from-blue-100 to-indigo-100 rounded-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="font-semibold text-blue-800">Leviathan (Gestor)</span>
                <span className="text-2xl font-bold text-blue-700">{config.managerShare}%</span>
              </div>
              <div className="text-sm text-blue-600">~${(managerRevenue / 1000).toFixed(0)}K anuales gestión/operación</div>
            </div>
          </div>
          
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="text-center">
              <div className="text-sm text-gray-600 mb-2">Rendimiento por token anual</div>
              <div className="text-3xl font-bold text-purple-600">${yieldPerToken.toFixed(3)}</div>
              <div className="text-sm text-gray-500">Por cada token de ${config.tokenPrice.toFixed(2)}</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Tecnología Blockchain</h2>
          </div>
          
          <div className="space-y-4">
            <div className="border-l-4 border-blue-500 pl-4">
              <h3 className="font-semibold text-gray-900">Plataforma</h3>
              <p className="text-gray-600">Ethereum con protocolo Tokeny para compliance</p>
            </div>
            <div className="border-l-4 border-green-500 pl-4">
              <h3 className="font-semibold text-gray-900">Seguridad</h3>
              <p className="text-gray-600">Smart contracts auditados y regulaciones KYC/AML</p>
            </div>
            <div className="border-l-4 border-purple-500 pl-4">
              <h3 className="font-semibold text-gray-900">Liquidez</h3>
              <p className="text-gray-600">Mercado secundario para trading de tokens</p>
            </div>
            <div className="border-l-4 border-orange-500 pl-4">
              <h3 className="font-semibold text-gray-900">Transparencia</h3>
              <p className="text-gray-600">Distribuciones automáticas y reportes en tiempo real</p>
            </div>
          </div>
        </div>
      </div>

      {/* Investment Benefits */}
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Beneficios de la Tokenización</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              icon: Users,
              title: 'Acceso Democratizado',
              description: `Inversión mínima desde $${config.minInvestment.toLocaleString()} USD`,
              benefits: ['Inversión institucional accesible', 'Diversificación de portafolio', 'Acceso a activos de energía renovable']
            },
            {
              icon: Lock,
              title: 'Seguridad Garantizada',
              description: 'Activo real respaldando cada token',
              benefits: ['PPA garantizado 15 años', 'Activo físico tangible', 'Ingresos predecibles']
            },
            {
              icon: Zap,
              title: 'Liquidez Inmediata',
              description: 'Trading 24/7 en mercado secundario',
              benefits: ['Sin periodos de lock-up', 'Salida flexible', 'Precio transparente']
            }
          ].map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{benefit.title}</h3>
                <p className="text-gray-600 mb-4">{benefit.description}</p>
                <ul className="space-y-1">
                  {benefit.benefits.map((item, idx) => (
                    <li key={idx} className="text-sm text-gray-500">• {item}</li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>

      {/* Investment Calculator */}
      <InvestmentCalculator config={config} />

      {/* Smart Contract Features */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-xl shadow-lg p-8 text-white">
        <h2 className="text-2xl font-bold mb-6 text-center">Características del Smart Contract</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-blue-300">Automatización</h3>
            <ul className="space-y-2 text-gray-300">
              <li>• Distribución automática mensual de dividendos</li>
              <li>• Cálculo transparente de retornos por token</li>
              <li>• Ejecución sin intermediarios</li>
              <li>• Auditabilidad completa on-chain</li>
            </ul>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-green-300">Compliance</h3>
            <ul className="space-y-2 text-gray-300">
              <li>• Integración KYC/AML obligatoria</li>
              <li>• Restricciones jurisdiccionales programables</li>
              <li>• Reporting regulatorio automatizado</li>
              <li>• Upgradeable para futuras regulaciones</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tokenization;