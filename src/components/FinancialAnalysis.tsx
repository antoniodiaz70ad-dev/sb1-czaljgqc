import React, { useState } from 'react';
import { TrendingUp, DollarSign, Calculator, PieChart, BarChart3, LineChart } from 'lucide-react';
import { LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart as RechartsPieChart, Cell } from 'recharts';

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

interface FinancialAnalysisProps {
  config: ProjectConfig;
}

const FinancialAnalysis: React.FC<FinancialAnalysisProps> = ({ config }) => {
  const [selectedMetric, setSelectedMetric] = useState<'revenue' | 'cashflow' | 'cumulative'>('revenue');

  // Generate financial data based on config
  const generateFinancialData = () => {
    const data = [];
    let cumulativeFlow = 0;
    
    for (let year = 1; year <= config.ppaDuration; year++) {
      const degradationFactor = Math.pow(1 - config.degradationRate / 100, year - 1);
      const generation = config.annualGeneration * degradationFactor;
      const revenue = generation * 1000 * config.ppaPrice; // Convert MWh to kWh
      const opex = config.opexAnnual * Math.pow(1 + config.opexEscalation / 100, year - 1);
      const netCashFlow = revenue - opex;
      cumulativeFlow += netCashFlow;
      
      data.push({
        year,
        revenue: Math.round(revenue),
        opex: Math.round(opex),
        netCashFlow: Math.round(netCashFlow),
        cumulative: Math.round(cumulativeFlow),
        generation: Math.round(generation)
      });
    }
    
    return data;
  };

  const financialData = generateFinancialData();
  
  // Calculate dynamic values
  const firstYearRevenue = financialData[0]?.revenue || 0;
  const firstYearOpex = financialData[0]?.opex || 0;
  const firstYearCashFlow = financialData[0]?.netCashFlow || 0;

  const costBreakdown = [
    { name: 'Paneles Solares', value: config.capex * 0.40, percentage: 40, color: '#10B981' },
    { name: 'Inversores', value: config.capex * 0.15, percentage: 15, color: '#3B82F6' },
    { name: 'Estructura y Montaje', value: config.capex * 0.20, percentage: 20, color: '#8B5CF6' },
    { name: 'Conexión Eléctrica', value: config.capex * 0.15, percentage: 15, color: '#F59E0B' },
    { name: 'Otros', value: config.capex * 0.10, percentage: 10, color: '#EF4444' },
  ];

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const formatMillions = (value: number) => {
    return `$${(value / 1000000).toFixed(2)}M`;
  };

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-gray-900">Análisis Financiero</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Proyecciones detalladas basadas en PPA garantizado y costos operativos conservadores
        </p>
      </div>

      {/* Key Financial Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { title: 'CAPEX Total', value: `$${(config.capex / 1000000).toFixed(1)}M`, subtitle: 'Inversión inicial', icon: DollarSign, color: 'from-green-500 to-emerald-600' },
          { title: 'Ingresos Anuales', value: `$${(firstYearRevenue / 1000000).toFixed(2)}M`, subtitle: 'Primer año', icon: TrendingUp, color: 'from-blue-500 to-indigo-600' },
          { title: 'OPEX Anual', value: `$${(firstYearOpex / 1000).toFixed(0)}K`, subtitle: 'Costos operativos', icon: Calculator, color: 'from-orange-500 to-red-600' },
          { title: 'Cash Flow Neto', value: `$${(firstYearCashFlow / 1000000).toFixed(2)}M`, subtitle: 'Primer año', icon: PieChart, color: 'from-purple-500 to-pink-600' },
        ].map((metric, index) => {
          const Icon = metric.icon;
          return (
            <div key={index} className="bg-white rounded-xl shadow-lg overflow-hidden card-hover">
              <div className={`h-2 bg-gradient-to-r ${metric.color}`}></div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${metric.color} flex items-center justify-center`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-1">{metric.title}</h3>
                <div className="text-2xl font-bold text-gray-900 mb-1 transform group-hover:scale-110 transition-transform">{metric.value}</div>
                <div className="text-sm text-gray-500">{metric.subtitle}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Interactive Charts */}
      <div className="bg-white rounded-xl shadow-lg p-8 card-hover">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Proyecciones Financieras (15 años)</h2>
          <div className="flex space-x-2">
            <button
              onClick={() => setSelectedMetric('revenue')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 transform hover:scale-105 ${
                selectedMetric === 'revenue'
                  ? 'bg-green-600 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-600 hover:bg-green-100 hover:text-green-700'
              }`}
            >
              Ingresos
            </button>
            <button
              onClick={() => setSelectedMetric('cashflow')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 transform hover:scale-105 ${
                selectedMetric === 'cashflow'
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-600 hover:bg-blue-100 hover:text-blue-700'
              }`}
            >
              Cash Flow
            </button>
            <button
              onClick={() => setSelectedMetric('cumulative')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 transform hover:scale-105 ${
                selectedMetric === 'cumulative'
                  ? 'bg-purple-600 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-600 hover:bg-purple-100 hover:text-purple-700'
              }`}
            >
              Acumulado
            </button>
          </div>
        </div>

        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <RechartsLineChart data={financialData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="year" 
                stroke="#6b7280"
                fontSize={12}
                tickFormatter={(value) => `Año ${value}`}
              />
              <YAxis 
                stroke="#6b7280"
                fontSize={12}
                tickFormatter={(value) => formatMillions(value)}
              />
              <Tooltip 
                formatter={(value: number) => [formatCurrency(value), 
                  selectedMetric === 'revenue' ? 'Ingresos' : 
                  selectedMetric === 'cashflow' ? 'Cash Flow Neto' : 'Acumulado'
                ]}
                labelFormatter={(label) => `Año ${label}`}
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Line 
                type="monotone" 
                dataKey={selectedMetric} 
                stroke={
                  selectedMetric === 'revenue' ? '#10B981' :
                  selectedMetric === 'cashflow' ? '#3B82F6' : '#8B5CF6'
                }
                strokeWidth={3}
                dot={{ fill: selectedMetric === 'revenue' ? '#10B981' : selectedMetric === 'cashflow' ? '#3B82F6' : '#8B5CF6', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: '#fff', strokeWidth: 2 }}
              />
            </RechartsLineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Cost Breakdown Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-xl shadow-lg p-8 card-hover">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Distribución de CAPEX</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsPieChart>
                <Tooltip 
                  formatter={(value: number) => [formatCurrency(value), 'Inversión']}
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <RechartsPieChart data={costBreakdown} cx="50%" cy="50%" outerRadius={80} dataKey="value">
                  {costBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </RechartsPieChart>
              </RechartsPieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-1 gap-2 mt-4">
            {costBreakdown.map((item, index) => (
              <div key={index} className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-lg hover:bg-gradient-to-r hover:from-gray-100 hover:to-gray-50 transition-all duration-300 hover:shadow-md">
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 rounded-full" style={{ backgroundColor: item.color }}></div>
                  <span className="text-sm font-medium text-gray-700">{item.name}</span>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold text-gray-900">{formatCurrency(item.value)}</div>
                  <div className="text-xs text-gray-500">{item.percentage}%</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8 card-hover">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Generación vs Ingresos</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={financialData.slice(0, 10)}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="year" 
                  stroke="#6b7280"
                  fontSize={12}
                  tickFormatter={(value) => `Año ${value}`}
                />
                <YAxis 
                  yAxisId="left"
                  stroke="#6b7280"
                  fontSize={12}
                  tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`}
                />
                <YAxis 
                  yAxisId="right"
                  orientation="right"
                  stroke="#6b7280"
                  fontSize={12}
                  tickFormatter={(value) => `${(value / 1000).toFixed(0)}K`}
                />
                <Tooltip 
                  formatter={(value: number, name: string) => [
                    name === 'revenue' ? formatCurrency(value) : `${(value / 1000).toFixed(0)}K MWh`,
                    name === 'revenue' ? 'Ingresos' : 'Generación'
                  ]}
                  labelFormatter={(label) => `Año ${label}`}
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Bar yAxisId="left" dataKey="revenue" fill="#10B981" radius={[4, 4, 0, 0]} />
                <Bar yAxisId="right" dataKey="generation" fill="#3B82F6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center space-x-6 mt-4">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-green-500 rounded"></div>
              <span className="text-sm text-gray-600">Ingresos (USD)</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-blue-500 rounded"></div>
              <span className="text-sm text-gray-600">Generación (MWh)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Financial Projections Table */}
      <div className="bg-white rounded-xl shadow-lg p-8 card-hover">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Tabla de Proyecciones Detalladas</h2>
        
        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Año</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-900">Generación (MWh)</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-900">Ingresos Brutos</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-900">OPEX</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-900">Cash Flow Neto</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-900">Acumulado</th>
              </tr>
            </thead>
            <tbody>
              {financialData.map((row, index) => (
                <tr 
                  key={row.year}
                  className="border-b border-gray-100 hover:bg-gradient-to-r hover:from-green-50 hover:to-blue-50 transition-all duration-300"
                >
                  <td className="py-3 px-4 font-medium text-gray-900">{row.year}</td>
                  <td className="py-3 px-4 text-right text-blue-600 font-semibold">
                    {(row.generation / 1000).toFixed(1)}K
                  </td>
                  <td className="py-3 px-4 text-right text-green-600 font-semibold">
                    {formatMillions(row.revenue)}
                  </td>
                  <td className="py-3 px-4 text-right text-red-600 font-semibold">
                    ${(row.opex / 1000).toFixed(0)}K
                  </td>
                  <td className="py-3 px-4 text-right text-blue-600 font-semibold">
                    {formatMillions(row.netCashFlow)}
                  </td>
                  <td className="py-3 px-4 text-right text-purple-600 font-semibold">
                    {formatMillions(row.cumulative)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ROI Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl shadow-lg p-8 text-white card-hover">
          <h3 className="text-2xl font-bold mb-6">Análisis de Retorno</h3>
          <div className="space-y-4">
            <div className="bg-white bg-opacity-20 rounded-lg p-4 hover:bg-opacity-30 transition-all duration-300">
              <div className="flex justify-between items-center mb-2">
                <span>ROI Simple:</span>
                <span className="text-2xl font-bold transform hover:scale-110 transition-transform">23%</span>
              </div>
              <div className="text-sm text-green-100">Retorno sobre inversión anual promedio</div>
            </div>
            
            <div className="bg-white bg-opacity-20 rounded-lg p-4 hover:bg-opacity-30 transition-all duration-300">
              <div className="flex justify-between items-center mb-2">
                <span>IRR (Tasa Interna):</span>
                <span className="text-2xl font-bold transform hover:scale-110 transition-transform">17-19%</span>
              </div>
              <div className="text-sm text-green-100">Tasa interna de retorno del proyecto</div>
            </div>
            
            <div className="bg-white bg-opacity-20 rounded-lg p-4 hover:bg-opacity-30 transition-all duration-300">
              <div className="flex justify-between items-center mb-2">
                <span>Payback Period:</span>
                <span className="text-2xl font-bold transform hover:scale-110 transition-transform">4.5 años</span>
              </div>
              <div className="text-sm text-green-100">Tiempo de recuperación de inversión</div>
            </div>

            <div className="bg-white bg-opacity-20 rounded-lg p-4 hover:bg-opacity-30 transition-all duration-300">
              <div className="flex justify-between items-center mb-2">
                <span>VPN (10% descuento):</span>
                <span className="text-2xl font-bold transform hover:scale-110 transition-transform">$5.2M</span>
              </div>
              <div className="text-sm text-green-100">Valor presente neto del proyecto</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8 card-hover">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Análisis de Sensibilidad</h3>
          
          <div className="space-y-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-semibold text-gray-800 mb-3">Variación de Ingresos (PPA)</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Escenario optimista (+10%):</span>
                  <span className="font-semibold text-green-600">IRR 21-23%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Caso base:</span>
                  <span className="font-semibold text-blue-600">IRR 17-19%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Escenario conservador (-10%):</span>
                  <span className="font-semibold text-orange-600">IRR 13-15%</span>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-semibold text-gray-800 mb-3">Variación de CAPEX</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Sobrecosto +15%:</span>
                  <span className="font-semibold text-orange-600">IRR 14-16%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Caso base:</span>
                  <span className="font-semibold text-blue-600">IRR 17-19%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Ahorro -15%:</span>
                  <span className="font-semibold text-green-600">IRR 22-24%</span>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-semibold text-gray-800 mb-3">Variación de OPEX</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Incremento +20%:</span>
                  <span className="font-semibold text-orange-600">IRR 15-17%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Caso base:</span>
                  <span className="font-semibold text-blue-600">IRR 17-19%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Optimización -20%:</span>
                  <span className="font-semibold text-green-600">IRR 19-21%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Risk Analysis */}
      <div className="bg-white rounded-xl shadow-lg p-8 card-hover">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Análisis de Riesgos Financieros</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Riesgos Mitigados</h3>
            <div className="space-y-3">
              {[
                { risk: 'Riesgo de Mercado', mitigation: 'PPA a 15 años con precio fijo $0.12/kWh', level: 'Bajo' },
                { risk: 'Riesgo Regulatorio', mitigation: 'Licencias definitivas por 40 años obtenidas', level: 'Bajo' },
                { risk: 'Riesgo de Construcción', mitigation: 'EPC con 15 años de experiencia local', level: 'Medio' },
                { risk: 'Riesgo Tecnológico', mitigation: 'Equipos tier-1 con garantías extendidas', level: 'Bajo' },
              ].map((item, index) => (
                <div key={index} className="bg-green-50 border-l-4 border-green-500 p-3">
                  <div className="flex justify-between items-start mb-1">
                    <div className="font-medium text-green-800">{item.risk}</div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      item.level === 'Bajo' ? 'bg-green-100 text-green-700' :
                      item.level === 'Medio' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {item.level}
                    </span>
                  </div>
                  <div className="text-sm text-green-700">{item.mitigation}</div>
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Factores de Éxito</h3>
            <div className="space-y-3">
              {[
                'Contrato PPA garantizado por 15 años',
                'Ubicación con alta irradiación solar (>1,600 kWh/m²/año)',
                'Marco regulatorio estable en Panamá',
                'Exoneración fiscal bajo Ley 45/2004',
                'Experiencia del equipo EPC local',
                'Tecnología probada y confiable'
              ].map((factor, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-blue-800 text-sm">{factor}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinancialAnalysis;