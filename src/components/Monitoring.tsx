import React, { useState, useEffect } from 'react';
import { Activity, Zap, Sun, TrendingUp, AlertCircle, CheckCircle, Thermometer, Wind } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { motion } from 'framer-motion';

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

interface MonitoringProps {
  config: ProjectConfig;
}

const Monitoring: React.FC<MonitoringProps> = ({ config }) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isOperational, setIsOperational] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    // Simulate operational status based on config
    const operationalDate = new Date(config.operationStart);
    setIsOperational(new Date() >= operationalDate);

    return () => clearInterval(timer);
  }, [config.operationStart]);

  // Simulated real-time data
  const generateHourlyData = () => {
    const data = [];
    const now = new Date();
    for (let i = 23; i >= 0; i--) {
      const hour = new Date(now.getTime() - i * 60 * 60 * 1000);
      const hourOfDay = hour.getHours();
      
      // Solar generation pattern (peak at noon)
      let generation = 0;
      if (hourOfDay >= 6 && hourOfDay <= 18) {
        const solarCurve = Math.sin(((hourOfDay - 6) / 12) * Math.PI);
        generation = Math.max(0, solarCurve * (config.capacity * 1000) * (0.8 + Math.random() * 0.4));
      }
      
      data.push({
        time: hour.getHours(),
        generation: Math.round(generation),
        irradiance: hourOfDay >= 6 && hourOfDay <= 18 ? 
          Math.round(800 * Math.sin(((hourOfDay - 6) / 12) * Math.PI) * (0.8 + Math.random() * 0.4)) : 0,
        temperature: 25 + Math.sin((hourOfDay / 24) * 2 * Math.PI) * 8 + Math.random() * 3,
      });
    }
    return data;
  };

  const hourlyData = generateHourlyData();
  const currentGeneration = hourlyData[hourlyData.length - 1]?.generation || 0;
  const currentIrradiance = hourlyData[hourlyData.length - 1]?.irradiance || 0;
  const currentTemp = hourlyData[hourlyData.length - 1]?.temperature || 25;

  // Simulated daily data for the month
  const generateDailyData = () => {
    const data = [];
    for (let i = 29; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      
      const dailyGeneration = isOperational ? 
        Math.round(35000 + Math.random() * 10000) : 0; // 35-45 MWh per day
      
      data.push({
        date: date.getDate(),
        generation: dailyGeneration,
        revenue: dailyGeneration * 0.12, // $0.12 per kWh
        efficiency: 85 + Math.random() * 10,
      });
    }
    return data;
  };

  const dailyData = generateDailyData();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-gray-900">Monitoreo en Tiempo Real</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Dashboard operativo del parque solar {config.projectName}
        </p>
        <div className="flex justify-center items-center space-x-4">
          <div className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
            isOperational ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
          }`}>
            <div className={`w-2 h-2 rounded-full ${
              isOperational ? 'bg-green-500 animate-pulse' : 'bg-yellow-500'
            }`}></div>
            <span className="font-medium">
              {isOperational ? 'Operacional' : 'En Construcción'}
            </span>
          </div>
          <div className="text-gray-500 text-sm">
            Última actualización: {currentTime.toLocaleTimeString('es-ES')}
          </div>
        </div>
      </div>

      {/* Real-time Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            title: 'Generación Actual',
            value: isOperational ? `${(currentGeneration / 1000).toFixed(1)} MW` : '0 MW',
            subtitle: `Capacidad: ${((currentGeneration / (config.capacity * 1000)) * 100).toFixed(1)}%`,
            icon: Zap,
            color: 'from-yellow-500 to-orange-600',
            status: isOperational ? 'active' : 'inactive'
          },
          {
            title: 'Irradiancia Solar',
            value: isOperational ? `${currentIrradiance} W/m²` : '0 W/m²',
            subtitle: 'Condiciones actuales',
            icon: Sun,
            color: 'from-orange-500 to-red-600',
            status: isOperational ? 'active' : 'inactive'
          },
          {
            title: 'Temperatura',
            value: `${currentTemp.toFixed(1)}°C`,
            subtitle: 'Temperatura ambiente',
            icon: Thermometer,
            color: 'from-blue-500 to-indigo-600',
            status: 'active'
          },
          {
            title: 'Ingresos Hoy',
            value: isOperational ? formatCurrency((currentGeneration * 24 * config.ppaPrice) / 1000) : '$0',
            subtitle: 'Estimado diario',
            icon: TrendingUp,
            color: 'from-green-500 to-emerald-600',
            status: isOperational ? 'active' : 'inactive'
          },
        ].map((metric, index) => {
          const Icon = metric.icon;
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-lg overflow-hidden card-hover"
            >
              <div className={`h-2 bg-gradient-to-r ${metric.color}`}></div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${metric.color} flex items-center justify-center`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div className={`w-3 h-3 rounded-full ${
                    metric.status === 'active' ? 'bg-green-500 animate-pulse' : 'bg-gray-400'
                  }`}></div>
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-1 group-hover:text-green-600 transition-colors">{metric.title}</h3>
                <div className="text-2xl font-bold text-gray-900 mb-1 transform group-hover:scale-110 transition-transform">{metric.value}</div>
                <div className="text-sm text-gray-500">{metric.subtitle}</div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Generation Chart */}
      <div className="bg-white rounded-xl shadow-lg p-8 card-hover">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Generación en las Últimas 24 Horas</h2>
        
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={hourlyData}>
              <defs>
                <linearGradient id="generationGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="time" 
                stroke="#6b7280"
                fontSize={12}
                tickFormatter={(value) => `${value}:00`}
              />
              <YAxis 
                stroke="#6b7280"
                fontSize={12}
                tickFormatter={(value) => `${(value / 1000).toFixed(1)}MW`}
              />
              <Tooltip 
                formatter={(value: number) => [`${(value / 1000).toFixed(2)} MW`, 'Generación']}
                labelFormatter={(label) => `${label}:00 hrs`}
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Area 
                type="monotone" 
                dataKey="generation" 
                stroke="#10B981" 
                strokeWidth={2}
                fillOpacity={1} 
                fill="url(#generationGradient)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-xl shadow-lg p-8 card-hover">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Rendimiento Mensual</h3>
          
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dailyData.slice(-30)}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="date" 
                  stroke="#6b7280"
                  fontSize={12}
                  tickFormatter={(value) => `${value}`}
                />
                <YAxis 
                  stroke="#6b7280"
                  fontSize={12}
                  tickFormatter={(value) => `${(value / 1000).toFixed(0)}K`}
                />
                <Tooltip 
                  formatter={(value: number) => [`${(value / 1000).toFixed(1)}K MWh`, 'Generación Diaria']}
                  labelFormatter={(label) => `Día ${label}`}
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="generation" 
                  stroke="#3B82F6" 
                  strokeWidth={2}
                  dot={{ fill: '#3B82F6', strokeWidth: 2, r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8 card-hover">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Estado del Sistema</h3>
          
          <div className="space-y-4">
            {[
              { 
                component: 'Paneles Solares', 
                status: isOperational ? 'Operacional' : 'Instalación', 
                efficiency: isOperational ? '98.5%' : 'N/A',
                icon: Sun,
                color: isOperational ? 'text-green-600' : 'text-yellow-600'
              },
              { 
                component: 'Inversores', 
                status: isOperational ? 'Operacional' : 'Configuración', 
                efficiency: isOperational ? '97.2%' : 'N/A',
                icon: Zap,
                color: isOperational ? 'text-green-600' : 'text-yellow-600'
              },
              { 
                component: 'Sistema de Monitoreo', 
                status: 'Activo', 
                efficiency: '100%',
                icon: Activity,
                color: 'text-green-600'
              },
              { 
                component: 'Conexión a Red', 
                status: isOperational ? 'Conectado' : 'Preparación', 
                efficiency: isOperational ? '99.8%' : 'N/A',
                icon: TrendingUp,
                color: isOperational ? 'text-green-600' : 'text-yellow-600'
              },
            ].map((item, index) => {
              const Icon = item.icon;
              return (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gradient-to-r hover:from-green-50 hover:to-blue-50 transition-all duration-300 hover:shadow-md">
                  <div className="flex items-center space-x-3">
                    <Icon className={`w-5 h-5 ${item.color}`} />
                    <div>
                      <div className="font-semibold text-gray-900">{item.component}</div>
                      <div className="text-sm text-gray-500">{item.status}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`font-semibold ${item.color}`}>{item.efficiency}</div>
                    <div className="text-xs text-gray-500">Eficiencia</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Environmental Conditions */}
      <div className="bg-white rounded-xl shadow-lg p-8 card-hover">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Condiciones Ambientales</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center p-4 bg-gradient-to-br from-yellow-100 to-orange-100 rounded-xl transform hover:scale-105 transition-all duration-300 hover:shadow-lg">
            <Sun className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900 transform hover:scale-110 transition-transform">{currentIrradiance}</div>
            <div className="text-sm text-gray-600">W/m² Irradiancia</div>
          </div>
          
          <div className="text-center p-4 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl transform hover:scale-105 transition-all duration-300 hover:shadow-lg">
            <Thermometer className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900 transform hover:scale-110 transition-transform">{currentTemp.toFixed(1)}°C</div>
            <div className="text-sm text-gray-600">Temperatura</div>
          </div>
          
          <div className="text-center p-4 bg-gradient-to-br from-green-100 to-emerald-100 rounded-xl transform hover:scale-105 transition-all duration-300 hover:shadow-lg">
            <Wind className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900 transform hover:scale-110 transition-transform">{Math.round(5 + Math.random() * 10)}</div>
            <div className="text-sm text-gray-600">km/h Viento</div>
          </div>
          
          <div className="text-center p-4 bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl transform hover:scale-105 transition-all duration-300 hover:shadow-lg">
            <Activity className="w-8 h-8 text-purple-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900 transform hover:scale-110 transition-transform">{isOperational ? '99.2%' : 'N/A'}</div>
            <div className="text-sm text-gray-600">Disponibilidad</div>
          </div>
        </div>
      </div>

      {/* Project Status */}
      {!isOperational && (
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl shadow-lg p-8 text-white">
          <h2 className="text-2xl font-bold mb-6 text-center">Estado de Construcción</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { phase: 'Financiación', progress: 100, status: 'Completado' },
              { phase: 'Permisos', progress: 100, status: 'Completado' },
              { phase: 'Construcción', progress: 75, status: 'En Progreso' },
              { phase: 'Comisionado', progress: 0, status: 'Pendiente' },
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="relative w-20 h-20 mx-auto mb-3">
                  <svg className="w-20 h-20 transform -rotate-90">
                    <circle
                      cx="40"
                      cy="40"
                      r="36"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="transparent"
                      className="text-white text-opacity-20"
                    />
                    <circle
                      cx="40"
                      cy="40"
                      r="36"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="transparent"
                      strokeDasharray={`${2 * Math.PI * 36}`}
                      strokeDashoffset={`${2 * Math.PI * 36 * (1 - item.progress / 100)}`}
                      className="text-white transition-all duration-500"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-lg font-bold text-white">{item.progress}%</span>
                  </div>
                </div>
                <h3 className="font-semibold text-white mb-1">{item.phase}</h3>
                <div className="text-sm text-blue-100">{item.status}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Alerts and Notifications */}
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Alertas y Notificaciones</h2>
        
        <div className="space-y-4">
          {isOperational ? [
            {
              type: 'success',
              icon: CheckCircle,
              title: 'Sistema Operando Normalmente',
              message: 'Todos los sistemas funcionan dentro de parámetros normales',
              time: '2 min ago'
            },
            {
              type: 'info',
              icon: Activity,
              title: 'Mantenimiento Programado',
              message: 'Mantenimiento preventivo programado para el próximo domingo',
              time: '1 hora ago'
            }
          ] : [
            {
              type: 'warning',
              icon: AlertCircle,
              title: 'Proyecto en Construcción',
              message: 'El parque solar está actualmente en fase de construcción. Operación comercial prevista para marzo 2026.',
              time: 'Permanente'
            },
            {
              type: 'info',
              icon: Activity,
              title: 'Progreso de Construcción',
              message: 'Instalación de paneles solares completada al 75%. Conexión eléctrica en progreso.',
              time: '1 día ago'
            }
          ].map((alert, index) => {
            const Icon = alert.icon;
            const colorClasses = {
              success: 'bg-green-50 border-green-200 text-green-800',
              warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
              info: 'bg-blue-50 border-blue-200 text-blue-800',
              error: 'bg-red-50 border-red-200 text-red-800'
            };
            
            return (
              <div key={index} className={`border rounded-lg p-4 ${colorClasses[alert.type as keyof typeof colorClasses]}`}>
                <div className="flex items-start space-x-3">
                  <Icon className="w-5 h-5 mt-0.5" />
                  <div className="flex-1">
                    <h3 className="font-semibold mb-1">{alert.title}</h3>
                    <p className="text-sm opacity-90">{alert.message}</p>
                  </div>
                  <div className="text-xs opacity-75">{alert.time}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Performance Summary */}
      {isOperational && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl shadow-lg p-6 text-white text-center transform hover:scale-105 transition-all duration-300 hover:shadow-xl">
            <h3 className="text-lg font-semibold mb-2">Hoy</h3>
            <div className="text-3xl font-bold mb-1 transform hover:scale-110 transition-transform">42.5 MWh</div>
            <div className="text-sm text-green-100">Generación total</div>
            <div className="text-sm text-green-100 mt-2">{formatCurrency(42.5 * 120)}</div>
          </div>
          
          <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg p-6 text-white text-center transform hover:scale-105 transition-all duration-300 hover:shadow-xl">
            <h3 className="text-lg font-semibold mb-2">Este Mes</h3>
            <div className="text-3xl font-bold mb-1 transform hover:scale-110 transition-transform">1.28 GWh</div>
            <div className="text-sm text-blue-100">Generación acumulada</div>
            <div className="text-sm text-blue-100 mt-2">{formatCurrency(1280 * 120)}</div>
          </div>
          
          <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl shadow-lg p-6 text-white text-center transform hover:scale-105 transition-all duration-300 hover:shadow-xl">
            <h3 className="text-lg font-semibold mb-2">Este Año</h3>
            <div className="text-3xl font-bold mb-1 transform hover:scale-110 transition-transform">14.2 GWh</div>
            <div className="text-sm text-purple-100">Generación anual</div>
            <div className="text-sm text-purple-100 mt-2">{formatCurrency(14200 * 120)}</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Monitoring;