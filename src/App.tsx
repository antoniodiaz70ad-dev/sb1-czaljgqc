import React, { useState } from 'react';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import ProjectDetails from './components/ProjectDetails';
import FinancialAnalysis from './components/FinancialAnalysis';
import Tokenization from './components/Tokenization';
import ESGImpact from './components/ESGImpact';
import BusinessModel from './components/BusinessModel';
import Documents from './components/Documents';
import Monitoring from './components/Monitoring';
import AdminDashboard from './components/AdminDashboard';
import ProjectManager from './components/ProjectManager';

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

function App() {
  const [activeSection, setActiveSection] = useState<Section>('dashboard');
  const [allProjects, setAllProjects] = useState<ProjectConfig[]>([]);
  const [projectConfig, setProjectConfig] = useState<ProjectConfig>({
    id: 'levi-solar1',
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
    createdAt: '2024-01-01T00:00:00.000Z',
    status: 'construction',
  });

  // Load config from localStorage on mount
  React.useEffect(() => {
    const savedProjects = localStorage.getItem('solarProjects');
    if (savedProjects) {
      try {
        const projects = JSON.parse(savedProjects);
        setAllProjects(projects);
        if (projects.length > 0) {
          setProjectConfig(projects[0]);
        }
      } catch (error) {
        console.error('Error loading saved projects:', error);
      }
    } else {
      // Initialize with default project
      const defaultProjects = [projectConfig];
      setAllProjects(defaultProjects);
      localStorage.setItem('solarProjects', JSON.stringify(defaultProjects));
    }
  }, []);

  const handleConfigChange = (newConfig: ProjectConfig) => {
    setProjectConfig(newConfig);
    
    // Update in projects list
    const updatedProjects = allProjects.map(p => 
      p.id === newConfig.id ? newConfig : p
    );
    setAllProjects(updatedProjects);
    localStorage.setItem('solarProjects', JSON.stringify(updatedProjects));
  };

  const handleProjectsUpdate = (projects: ProjectConfig[]) => {
    setAllProjects(projects);
    localStorage.setItem('solarProjects', JSON.stringify(projects));
  };

  const renderSection = () => {
    switch (activeSection) {
      case 'dashboard':
        return <Dashboard config={projectConfig} />;
      case 'project':
        return <ProjectDetails config={projectConfig} />;
      case 'financial':
        return <FinancialAnalysis config={projectConfig} />;
      case 'tokenization':
        return <Tokenization config={projectConfig} />;
      case 'esg':
        return <ESGImpact config={projectConfig} />;
      case 'business':
        return <BusinessModel config={projectConfig} />;
      case 'documents':
        return <Documents config={projectConfig} />;
      case 'monitoring':
        return <Monitoring config={projectConfig} />;
      case 'admin':
        return <AdminDashboard onConfigChange={handleConfigChange} />;
      case 'projects':
        return (
          <ProjectManager 
            currentProject={projectConfig}
            onProjectChange={setProjectConfig}
            onProjectsUpdate={handleProjectsUpdate}
          />
        );
      default:
        return <Dashboard config={projectConfig} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-blue-50 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-green-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
        <div className="absolute top-40 right-20 w-40 h-40 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute bottom-20 left-20 w-36 h-36 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse" style={{animationDelay: '4s'}}></div>
      </div>
      
      <Header activeSection={activeSection} setActiveSection={setActiveSection} config={projectConfig} />
      <main className="container mx-auto px-4 py-8 relative z-10">
        {renderSection()}
      </main>
    </div>
  );
}

export default App;