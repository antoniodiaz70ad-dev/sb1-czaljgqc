import React from 'react';
import { Sun, BarChart3, DollarSign, Coins, Leaf, Building } from 'lucide-react';
import { FileText, Activity, Settings, FolderOpen } from 'lucide-react';

type Section = 'dashboard' | 'project' | 'financial' | 'tokenization' | 'esg' | 'business' | 'documents' | 'monitoring' | 'admin' | 'projects';

interface ProjectConfig {
  id: string;
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
  createdAt: string;
  status: 'planning' | 'construction' | 'operational' | 'completed';
}

interface HeaderProps {
  activeSection: Section;
  setActiveSection: (section: Section) => void;
  config: ProjectConfig;
}

const Header: React.FC<HeaderProps> = ({ activeSection, setActiveSection, config }) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'projects', label: 'Proyectos', icon: FolderOpen },
    { id: 'project', label: 'Proyecto Solar', icon: Sun },
    { id: 'financial', label: 'Análisis Financiero', icon: DollarSign },
    { id: 'tokenization', label: 'Tokenización', icon: Coins },
    { id: 'esg', label: 'Impacto ESG', icon: Leaf },
    { id: 'business', label: 'Modelo de Negocio', icon: Building },
    { id: 'documents', label: 'Documentos', icon: FileText },
    { id: 'monitoring', label: 'Monitoreo', icon: Activity },
    { id: 'admin', label: 'Configuración', icon: Settings },
  ];

  return (
    <header className="bg-white/95 backdrop-blur-md shadow-lg border-b border-green-100 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-blue-600 rounded-lg flex items-center justify-center float-animation">
              <Sun className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold gradient-text">{config.projectName}</h1>
              <p className="text-sm text-gray-600">{config.location} - {config.capacity} MW</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-2 rounded-lg shadow-lg">
            <div className="w-2 h-2 bg-green-300 rounded-full pulse-glow"></div>
            <span className="text-sm font-medium">Proyecto Activo</span>
          </div>
        </div>
        
        <nav className="border-t border-gray-100">
          <ul className="flex space-x-8 overflow-x-auto py-4">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              
              return (
                <li key={item.id}>
                  <button
                    onClick={() => setActiveSection(item.id as Section)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 whitespace-nowrap transform hover:scale-105 ${
                      isActive
                        ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg'
                        : 'text-gray-600 hover:text-green-600 hover:bg-gradient-to-r hover:from-green-50 hover:to-emerald-50'
                    }`}
                  >
                    <Icon className={`w-4 h-4 transition-colors ${isActive ? 'text-white' : 'text-gray-500 group-hover:text-green-600'}`} />
                    <span className="font-medium">{item.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;