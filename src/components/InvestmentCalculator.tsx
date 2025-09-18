import React, { useState, useEffect } from 'react';
import { Calculator, TrendingUp, DollarSign, Percent } from 'lucide-react';
import { Coins } from 'lucide-react';

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

interface InvestmentCalculatorProps {
  config: ProjectConfig;
}

const InvestmentCalculator: React.FC<InvestmentCalculatorProps> = ({ config }) => {
  const [investmentAmount, setInvestmentAmount] = useState(config.minInvestment);
  const [timeHorizon, setTimeHorizon] = useState(config.ppaDuration);
  const [results, setResults] = useState({
    tokens: 0,
    annualReturn: 0,
    totalReturn: 0,
    monthlyIncome: 0,
    totalValue: 0
  });

  // Calculate yield based on config
  const annualRevenue = config.annualGeneration * 1000 * config.ppaPrice;
  const annualNetCashFlow = annualRevenue - config.opexAnnual;
  const tokenizedRevenue = annualNetCashFlow * (config.investorShare / 100);
  const yieldPerToken = tokenizedRevenue / config.totalTokens;
  const annualYield = yieldPerToken / config.tokenPrice;

  useEffect(() => {
    const tokens = investmentAmount / config.tokenPrice;
    const annualReturn = investmentAmount * annualYield;
    const monthlyIncome = annualReturn / 12;
    const totalReturn = annualReturn * timeHorizon;
    const totalValue = investmentAmount + totalReturn;

    setResults({
      tokens,
      annualReturn,
      totalReturn,
      monthlyIncome,
      totalValue
    });
  }, [investmentAmount, timeHorizon, config]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(Math.round(num));
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-8 card-hover">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center float-animation">
          <Calculator className="w-5 h-5 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Calculadora de Inversión</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Controls */}
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Monto de Inversión (USD)
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="number"
                min="2500"
                step="500"
                value={investmentAmount}
                onChange={(e) => setInvestmentAmount(Number(e.target.value))}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-lg font-semibold transition-all duration-300 hover:border-indigo-400"
              />
            </div>
            <div className="mt-2 flex space-x-2">
              {[config.minInvestment, config.minInvestment * 2, config.minInvestment * 4, config.minInvestment * 10, config.minInvestment * 20].map((amount) => (
                <button
                  key={amount}
                  onClick={() => setInvestmentAmount(amount)}
                  className={`px-3 py-1 rounded-md text-sm font-medium transition-all duration-300 transform hover:scale-105 ${
                    investmentAmount === amount
                      ? 'bg-indigo-600 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-600 hover:bg-indigo-100 hover:text-indigo-700'
                  }`}
                >
                  {formatCurrency(amount)}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Horizonte de Inversión (años) - Máximo {config.ppaDuration}
            </label>
            <div className="relative">
              <input
                type="range"
                min="1"
                max={config.ppaDuration}
                value={timeHorizon}
                onChange={(e) => setTimeHorizon(Number(e.target.value))}
                className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
              />
              <div className="flex justify-between text-sm text-gray-500 mt-2">
                <span>1 año</span>
                <span className="font-semibold text-indigo-600">{timeHorizon} años</span>
                <span>{config.ppaDuration} años</span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-lg p-4">
            <h3 className="font-semibold text-indigo-800 mb-2">Parámetros del Proyecto</h3>
            <div className="space-y-1 text-sm text-indigo-700">
              <div className="flex justify-between">
                <span>Yield anual:</span>
                <span className="font-semibold">{(annualYield * 100).toFixed(1)}%</span>
              </div>
              <div className="flex justify-between">
                <span>Precio por token:</span>
                <span className="font-semibold">${config.tokenPrice.toFixed(2)} USD</span>
              </div>
              <div className="flex justify-between">
                <span>Inversión mínima:</span>
                <span className="font-semibold">${config.minInvestment.toLocaleString()} USD</span>
              </div>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl p-4 text-white transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl">
              <div className="flex items-center space-x-2 mb-2">
                <Coins className="w-5 h-5" />
                <span className="text-sm font-medium">Tokens</span>
              </div>
              <div className="text-2xl font-bold">{formatNumber(results.tokens)}</div>
              <div className="text-xs text-green-100">{config.projectName}</div>
            </div>

            <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl p-4 text-white transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl">
              <div className="flex items-center space-x-2 mb-2">
                <Percent className="w-5 h-5" />
                <span className="text-sm font-medium">Retorno Anual</span>
              </div>
              <div className="text-2xl font-bold">{formatCurrency(results.annualReturn)}</div>
              <div className="text-xs text-blue-100">{(annualYield * 100).toFixed(1)}% yield</div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl p-6 text-white transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl">
            <div className="flex items-center space-x-2 mb-3">
              <TrendingUp className="w-6 h-6" />
              <span className="text-lg font-semibold">Ingresos Mensuales</span>
            </div>
            <div className="text-3xl font-bold mb-1">{formatCurrency(results.monthlyIncome)}</div>
            <div className="text-sm text-purple-100">Distribución automática mensual</div>
          </div>

          <div className="bg-gradient-to-br from-orange-500 to-red-600 rounded-xl p-6 text-white transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl">
            <div className="flex items-center space-x-2 mb-3">
              <DollarSign className="w-6 h-6" />
              <span className="text-lg font-semibold">Valor Total en {timeHorizon} años</span>
            </div>
            <div className="text-3xl font-bold mb-1">{formatCurrency(results.totalValue)}</div>
            <div className="text-sm text-orange-100">
              Inversión inicial + {formatCurrency(results.totalReturn)} en retornos
            </div>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h4 className="font-semibold text-gray-800 mb-3">Resumen de Inversión</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Inversión inicial:</span>
                <span className="font-semibold text-gray-900">{formatCurrency(investmentAmount)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Retornos totales:</span>
                <span className="font-semibold text-green-600">{formatCurrency(results.totalReturn)}</span>
              </div>
              <div className="flex justify-between border-t border-gray-200 pt-2">
                <span className="text-gray-600">ROI total:</span>
                <span className="font-semibold text-purple-600">
                  {((results.totalReturn / investmentAmount) * 100).toFixed(1)}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <p className="text-sm text-yellow-800">
          <strong>Nota:</strong> Las proyecciones están basadas en el PPA garantizado de $0.12/kWh por 15 años. 
          Los retornos reales pueden variar según condiciones operativas y del mercado.
        </p>
      </div>
    </div>
  );
};

export default InvestmentCalculator;