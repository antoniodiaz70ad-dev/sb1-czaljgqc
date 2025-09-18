import React, { useState, useEffect } from 'react';
import { Settings, Save, RotateCcw, Calculator, Zap, DollarSign, Calendar, MapPin, Building, FileText, AlertCircle } from 'lucide-react';

interface ProjectConfig {
  // Basic Project Info
  projectName: string;
  location: string;
  capacity: number; // MW
  
  // Financial Parameters
  capex: number; // USD
  ppaPrice: number; // USD/kWh
  ppaDuration: number; // years
  opexAnnual: number; // USD
  opexEscalation: number; // %
  
  // Technical Parameters
  annualGeneration: number; // MWh
  degradationRate: number; // %
  plantFactor: number; // %
  connectionVoltage: number; // kV
  
  // Tokenization
  totalTokens: number;
  tokenPrice: number; // USD
  investorShare: number; // %
  managerShare: number; // %
  minInvestment: number; // USD
  
  // Timeline
  constructionStart: string;
  operationStart: string;
  constructionDuration: number; // months
  
  // ESG Impact
  co2Reduction: number; // tCO2/year
  homesSupplied: number;
}

interface AdminDashboardProps {
  onConfigChange: (config: ProjectConfig) => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onConfigChange }) => {
  const [config, setConfig] = useState<ProjectConfig>({
    // LEVI-SOLAR1 Default Values
    projectName: 'LEVI-SOLAR1',
    location: 'Panamá Oeste, República de Panamá',
    capacity: 9.9,
    
    capex: 7500000,
    ppaPrice: 0.12,
    ppaDuration: 15,
    opexAnnual: 180000,
    opexEscalation: 2,
    
    annualGeneration: 16000,
    degradationRate: 0.5,
    plantFactor: 18.5,
    connectionVoltage: 34.5,
    
    totalTokens: 7500000,
    tokenPrice: 1.0,
    investorShare: 70,
    managerShare: 30,
    minInvestment: 2500,
    
    constructionStart: '2025-01-01',
    operationStart: '2026-03-01',
    constructionDuration: 12,
    
    co2Reduction: 10000,
    homesSupplied: 4500,
  });

  const [activeTab, setActiveTab] = useState<'basic' | 'financial' | 'technical' | 'tokenization' | 'timeline' | 'esg'>('basic');
  const [hasChanges, setHasChanges] = useState(false);

  // Calculate derived metrics
  const calculateMetrics = (cfg: ProjectConfig) => {
    const annualRevenue = cfg.annualGeneration * 1000 * cfg.ppaPrice; // Convert MWh to kWh
    const annualNetCashFlow = annualRevenue - cfg.opexAnnual;
    const tokenizedRevenue = annualNetCashFlow * (cfg.investorShare / 100);
    const yieldPerToken = tokenizedRevenue / cfg.totalTokens;
    const roi = (annualNetCashFlow / cfg.capex) * 100;
    const paybackPeriod = cfg.capex / annualNetCashFlow;
    
    return {
      annualRevenue,
      annualNetCashFlow,
      tokenizedRevenue,
      yieldPerToken,
      roi,
      paybackPeriod
    };
  };

  const metrics = calculateMetrics(config);

  const updateConfig = (field: keyof ProjectConfig, value: any) => {
    const newConfig = { ...config, [field]: value };
    setConfig(newConfig);
    setHasChanges(true);
  };

  const saveConfig = () => {
    onConfigChange(config);
    setHasChanges(false);
    // Here you could also save to localStorage or send to backend
    localStorage.setItem('leviSolarConfig', JSON.stringify(config));
  };

  const resetToDefaults = () => {
    // Reset to LEVI-SOLAR1 defaults
    setConfig({
      projectName: 'LEVI-SOLAR1',
      location: 'Panamá Oeste, República de Panamá',
      capacity: 9.9,
      capex: 7500000,
      ppaPrice: 0.12,
      ppaDuration: 15,
      opexAnnual: 180000,
      opexEscalation: 2,
      annualGeneration: 16000,
      degradationRate: 0.5,
      plantFactor: 18.5,
      connectionVoltage: 34.5,
      totalTokens: 7500000,
      tokenPrice: 1.0,
      investorShare: 70,
      managerShare: 30,
      minInvestment: 2500,
      constructionStart: '2025-01-01',
      operationStart: '2026-03-01',
      constructionDuration: 12,
      co2Reduction: 10000,
      homesSupplied: 4500,
    });
    setHasChanges(true);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const tabs = [
    { id: 'basic', label: 'Básico', icon: Building },
    { id: 'financial', label: 'Financiero', icon: DollarSign },
    { id: 'technical', label: 'Técnico', icon: Zap },
    { id: 'tokenization', label: 'Tokenización', icon: Calculator },
    { id: 'timeline', label: 'Cronograma', icon: Calendar },
    { id: 'esg', label: 'Impacto ESG', icon: MapPin },
  ];

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-gray-900">Panel de Administración</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Configura los parámetros del proyecto solar y todos los cálculos se actualizarán automáticamente
        </p>
      </div>

      {/* Save/Reset Controls */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Settings className="w-6 h-6 text-gray-600" />
            <h2 className="text-xl font-bold text-gray-900">Configuración del Proyecto</h2>
            {hasChanges && (
              <div className="flex items-center space-x-2 text-orange-600">
                <AlertCircle className="w-4 h-4" />
                <span className="text-sm font-medium">Cambios sin guardar</span>
              </div>
            )}
          </div>
          
          <div className="flex space-x-3">
            <button
              onClick={resetToDefaults}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all duration-300 transform hover:scale-105"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Restaurar</span>
            </button>
            <button
              onClick={saveConfig}
              disabled={!hasChanges}
              className={`flex items-center space-x-2 px-6 py-2 rounded-lg transition-all duration-300 transform hover:scale-105 ${
                hasChanges
                  ? 'bg-green-600 text-white hover:bg-green-700 shadow-lg'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              <Save className="w-4 h-4" />
              <span>Guardar Cambios</span>
            </button>
          </div>
        </div>
      </div>

      {/* Calculated Metrics Preview */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl shadow-lg p-8 text-white">
        <h3 className="text-2xl font-bold mb-6 text-center">Métricas Calculadas Automáticamente</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold mb-1">{formatCurrency(metrics.annualRevenue)}</div>
            <div className="text-blue-100 text-sm">Ingresos Anuales</div>
          </div>
          <div>
            <div className="text-2xl font-bold mb-1">{formatCurrency(metrics.annualNetCashFlow)}</div>
            <div className="text-blue-100 text-sm">Cash Flow Neto</div>
          </div>
          <div>
            <div className="text-2xl font-bold mb-1">{metrics.roi.toFixed(1)}%</div>
            <div className="text-blue-100 text-sm">ROI Anual</div>
          </div>
          <div>
            <div className="text-2xl font-bold mb-1">{metrics.paybackPeriod.toFixed(1)} años</div>
            <div className="text-blue-100 text-sm">Payback</div>
          </div>
          <div>
            <div className="text-2xl font-bold mb-1">${(metrics.yieldPerToken).toFixed(3)}</div>
            <div className="text-blue-100 text-sm">Yield/Token</div>
          </div>
          <div>
            <div className="text-2xl font-bold mb-1">{((metrics.yieldPerToken / config.tokenPrice) * 100).toFixed(1)}%</div>
            <div className="text-blue-100 text-sm">Yield %</div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex flex-wrap gap-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 px-4 py-3 rounded-lg transition-all duration-300 transform hover:scale-105 ${
                  isActive
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-600 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:text-blue-700'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="font-medium">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Configuration Forms */}
      <div className="bg-white rounded-xl shadow-lg p-8">
        {activeTab === 'basic' && (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Información Básica del Proyecto</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Nombre del Proyecto</label>
                <input
                  type="text"
                  value={config.projectName}
                  onChange={(e) => updateConfig('projectName', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                  placeholder="Ej: LEVI-SOLAR1"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Ubicación</label>
                <input
                  type="text"
                  value={config.location}
                  onChange={(e) => updateConfig('location', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                  placeholder="Ej: Panamá Oeste, República de Panamá"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Capacidad Instalada (MW)</label>
                <input
                  type="number"
                  step="0.1"
                  value={config.capacity}
                  onChange={(e) => updateConfig('capacity', parseFloat(e.target.value))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Voltaje de Conexión (kV)</label>
                <input
                  type="number"
                  step="0.1"
                  value={config.connectionVoltage}
                  onChange={(e) => updateConfig('connectionVoltage', parseFloat(e.target.value))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'financial' && (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Parámetros Financieros</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">CAPEX Total (USD)</label>
                <input
                  type="number"
                  value={config.capex}
                  onChange={(e) => updateConfig('capex', parseInt(e.target.value))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Precio PPA (USD/kWh)</label>
                <input
                  type="number"
                  step="0.001"
                  value={config.ppaPrice}
                  onChange={(e) => updateConfig('ppaPrice', parseFloat(e.target.value))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Duración PPA (años)</label>
                <input
                  type="number"
                  value={config.ppaDuration}
                  onChange={(e) => updateConfig('ppaDuration', parseInt(e.target.value))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">OPEX Anual (USD)</label>
                <input
                  type="number"
                  value={config.opexAnnual}
                  onChange={(e) => updateConfig('opexAnnual', parseInt(e.target.value))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Escalamiento OPEX (%)</label>
                <input
                  type="number"
                  step="0.1"
                  value={config.opexEscalation}
                  onChange={(e) => updateConfig('opexEscalation', parseFloat(e.target.value))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'technical' && (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Especificaciones Técnicas</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Generación Anual (MWh)</label>
                <input
                  type="number"
                  value={config.annualGeneration}
                  onChange={(e) => updateConfig('annualGeneration', parseInt(e.target.value))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Factor de Planta (%)</label>
                <input
                  type="number"
                  step="0.1"
                  value={config.plantFactor}
                  onChange={(e) => updateConfig('plantFactor', parseFloat(e.target.value))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Degradación Anual (%)</label>
                <input
                  type="number"
                  step="0.1"
                  value={config.degradationRate}
                  onChange={(e) => updateConfig('degradationRate', parseFloat(e.target.value))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'tokenization' && (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Configuración de Tokenización</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Total de Tokens</label>
                <input
                  type="number"
                  value={config.totalTokens}
                  onChange={(e) => updateConfig('totalTokens', parseInt(e.target.value))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Precio por Token (USD)</label>
                <input
                  type="number"
                  step="0.01"
                  value={config.tokenPrice}
                  onChange={(e) => updateConfig('tokenPrice', parseFloat(e.target.value))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">% para Inversionistas</label>
                <input
                  type="number"
                  value={config.investorShare}
                  onChange={(e) => updateConfig('investorShare', parseInt(e.target.value))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">% para Gestor</label>
                <input
                  type="number"
                  value={config.managerShare}
                  onChange={(e) => updateConfig('managerShare', parseInt(e.target.value))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Inversión Mínima (USD)</label>
                <input
                  type="number"
                  value={config.minInvestment}
                  onChange={(e) => updateConfig('minInvestment', parseInt(e.target.value))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'timeline' && (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Cronograma del Proyecto</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Inicio de Construcción</label>
                <input
                  type="date"
                  value={config.constructionStart}
                  onChange={(e) => updateConfig('constructionStart', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Inicio de Operación</label>
                <input
                  type="date"
                  value={config.operationStart}
                  onChange={(e) => updateConfig('operationStart', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Duración Construcción (meses)</label>
                <input
                  type="number"
                  value={config.constructionDuration}
                  onChange={(e) => updateConfig('constructionDuration', parseInt(e.target.value))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'esg' && (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Impacto Ambiental y Social</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Reducción CO₂ Anual (tCO₂)</label>
                <input
                  type="number"
                  value={config.co2Reduction}
                  onChange={(e) => updateConfig('co2Reduction', parseInt(e.target.value))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Hogares Abastecidos</label>
                <input
                  type="number"
                  value={config.homesSupplied}
                  onChange={(e) => updateConfig('homesSupplied', parseInt(e.target.value))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Configuration Templates */}
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">Plantillas de Proyecto</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              name: 'Proyecto Pequeño',
              description: '1-5 MW, ideal para comunidades',
              template: {
                capacity: 2.5,
                capex: 2000000,
                annualGeneration: 4000,
                totalTokens: 2000000,
                co2Reduction: 2500,
                homesSupplied: 1200
              }
            },
            {
              name: 'Proyecto Mediano',
              description: '5-15 MW, escala comercial',
              template: {
                capacity: 9.9,
                capex: 7500000,
                annualGeneration: 16000,
                totalTokens: 7500000,
                co2Reduction: 10000,
                homesSupplied: 4500
              }
            },
            {
              name: 'Proyecto Grande',
              description: '15+ MW, escala utility',
              template: {
                capacity: 25.0,
                capex: 18000000,
                annualGeneration: 40000,
                totalTokens: 18000000,
                co2Reduction: 25000,
                homesSupplied: 11000
              }
            }
          ].map((template, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-all duration-300 transform hover:scale-105">
              <h4 className="font-semibold text-gray-900 mb-2">{template.name}</h4>
              <p className="text-gray-600 text-sm mb-4">{template.description}</p>
              
              <div className="space-y-2 text-xs text-gray-500 mb-4">
                <div className="flex justify-between">
                  <span>Capacidad:</span>
                  <span>{template.template.capacity} MW</span>
                </div>
                <div className="flex justify-between">
                  <span>CAPEX:</span>
                  <span>{formatCurrency(template.template.capex)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Generación:</span>
                  <span>{template.template.annualGeneration.toLocaleString()} MWh</span>
                </div>
              </div>
              
              <button
                onClick={() => {
                  setConfig({ ...config, ...template.template });
                  setHasChanges(true);
                }}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300 transform hover:scale-105"
              >
                Aplicar Plantilla
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Export/Import Configuration */}
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">Gestión de Configuración</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-800">Exportar Configuración</h4>
            <p className="text-gray-600 text-sm">Descarga la configuración actual como archivo JSON para respaldo o compartir.</p>
            <button
              onClick={() => {
                const dataStr = JSON.stringify(config, null, 2);
                const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
                const exportFileDefaultName = `${config.projectName.toLowerCase().replace(/\s+/g, '-')}-config.json`;
                
                const linkElement = document.createElement('a');
                linkElement.setAttribute('href', dataUri);
                linkElement.setAttribute('download', exportFileDefaultName);
                linkElement.click();
              }}
              className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-300 transform hover:scale-105"
            >
              <FileText className="w-4 h-4" />
              <span>Exportar JSON</span>
            </button>
          </div>
          
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-800">Importar Configuración</h4>
            <p className="text-gray-600 text-sm">Carga una configuración desde un archivo JSON previamente exportado.</p>
            <input
              type="file"
              accept=".json"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onload = (event) => {
                    try {
                      const importedConfig = JSON.parse(event.target?.result as string);
                      setConfig(importedConfig);
                      setHasChanges(true);
                    } catch (error) {
                      alert('Error al importar configuración. Verifica que el archivo sea válido.');
                    }
                  };
                  reader.readAsText(file);
                }
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
            />
          </div>
        </div>
      </div>

      {/* Real-time Impact Preview */}
      <div className="bg-gradient-to-r from-green-500 to-blue-600 rounded-xl shadow-lg p-8 text-white">
        <h3 className="text-2xl font-bold mb-6 text-center">Vista Previa de Impacto</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
          <div>
            <div className="text-3xl font-bold mb-2">{formatCurrency(metrics.tokenizedRevenue)}</div>
            <div className="text-green-100">Ingresos Tokenizados/Año</div>
          </div>
          <div>
            <div className="text-3xl font-bold mb-2">${(metrics.yieldPerToken * 12).toFixed(2)}</div>
            <div className="text-green-100">Ingresos/Token/Año</div>
          </div>
          <div>
            <div className="text-3xl font-bold mb-2">{((metrics.yieldPerToken / config.tokenPrice) * 100).toFixed(1)}%</div>
            <div className="text-green-100">Yield Anual</div>
          </div>
          <div>
            <div className="text-3xl font-bold mb-2">{metrics.paybackPeriod.toFixed(1)} años</div>
            <div className="text-green-100">Período de Recuperación</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;