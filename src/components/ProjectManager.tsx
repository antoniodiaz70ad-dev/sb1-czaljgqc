import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Copy, Sun, Building, MapPin, Zap, Save, X } from 'lucide-react';

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

interface ProjectManagerProps {
  currentProject: ProjectConfig;
  onProjectChange: (project: ProjectConfig) => void;
  onProjectsUpdate: (projects: ProjectConfig[]) => void;
}

const ProjectManager: React.FC<ProjectManagerProps> = ({ 
  currentProject, 
  onProjectChange, 
  onProjectsUpdate 
}) => {
  const [projects, setProjects] = useState<ProjectConfig[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingProject, setEditingProject] = useState<ProjectConfig | null>(null);
  const [newProject, setNewProject] = useState<Partial<ProjectConfig>>({
    projectName: '',
    location: '',
    capacity: 10,
    capex: 8000000,
    ppaPrice: 0.12,
    ppaDuration: 15,
    opexAnnual: 200000,
    opexEscalation: 2,
    annualGeneration: 18000,
    degradationRate: 0.5,
    plantFactor: 20,
    connectionVoltage: 34.5,
    totalTokens: 8000000,
    tokenPrice: 1.0,
    investorShare: 70,
    managerShare: 30,
    minInvestment: 2500,
    constructionStart: '2025-06-01',
    operationStart: '2026-09-01',
    constructionDuration: 12,
    co2Reduction: 12000,
    homesSupplied: 5000,
    status: 'planning'
  });

  // Load projects from localStorage
  useEffect(() => {
    const savedProjects = localStorage.getItem('solarProjects');
    if (savedProjects) {
      try {
        const parsedProjects = JSON.parse(savedProjects);
        setProjects(parsedProjects);
        onProjectsUpdate(parsedProjects);
      } catch (error) {
        console.error('Error loading projects:', error);
      }
    } else {
      // Initialize with current project if no projects exist
      const initialProjects = [currentProject];
      setProjects(initialProjects);
      saveProjects(initialProjects);
    }
  }, []);

  const saveProjects = (projectList: ProjectConfig[]) => {
    localStorage.setItem('solarProjects', JSON.stringify(projectList));
    setProjects(projectList);
    onProjectsUpdate(projectList);
  };

  const createProject = () => {
    if (!newProject.projectName || !newProject.location) {
      alert('Por favor completa el nombre del proyecto y la ubicación');
      return;
    }

    const project: ProjectConfig = {
      ...newProject as ProjectConfig,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };

    const updatedProjects = [...projects, project];
    saveProjects(updatedProjects);
    setShowCreateForm(false);
    setNewProject({
      projectName: '',
      location: '',
      capacity: 10,
      capex: 8000000,
      ppaPrice: 0.12,
      ppaDuration: 15,
      opexAnnual: 200000,
      opexEscalation: 2,
      annualGeneration: 18000,
      degradationRate: 0.5,
      plantFactor: 20,
      connectionVoltage: 34.5,
      totalTokens: 8000000,
      tokenPrice: 1.0,
      investorShare: 70,
      managerShare: 30,
      minInvestment: 2500,
      constructionStart: '2025-06-01',
      operationStart: '2026-09-01',
      constructionDuration: 12,
      co2Reduction: 12000,
      homesSupplied: 5000,
      status: 'planning'
    });
  };

  const duplicateProject = (project: ProjectConfig) => {
    const duplicated: ProjectConfig = {
      ...project,
      id: Date.now().toString(),
      projectName: `${project.projectName} - Copia`,
      createdAt: new Date().toISOString(),
      status: 'planning'
    };

    const updatedProjects = [...projects, duplicated];
    saveProjects(updatedProjects);
  };

  const deleteProject = (projectId: string) => {
    if (projects.length <= 1) {
      alert('No puedes eliminar el último proyecto');
      return;
    }

    if (confirm('¿Estás seguro de que quieres eliminar este proyecto?')) {
      const updatedProjects = projects.filter(p => p.id !== projectId);
      saveProjects(updatedProjects);
      
      // If deleting current project, switch to first available
      if (currentProject.id === projectId && updatedProjects.length > 0) {
        onProjectChange(updatedProjects[0]);
      }
    }
  };

  const updateProject = (updatedProject: ProjectConfig) => {
    const updatedProjects = projects.map(p => 
      p.id === updatedProject.id ? updatedProject : p
    );
    saveProjects(updatedProjects);
    
    // Update current project if it's the one being edited
    if (currentProject.id === updatedProject.id) {
      onProjectChange(updatedProject);
    }
    
    setEditingProject(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'planning': return 'bg-yellow-100 text-yellow-700';
      case 'construction': return 'bg-blue-100 text-blue-700';
      case 'operational': return 'bg-green-100 text-green-700';
      case 'completed': return 'bg-gray-100 text-gray-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'planning': return 'Planificación';
      case 'construction': return 'Construcción';
      case 'operational': return 'Operacional';
      case 'completed': return 'Completado';
      default: return 'Desconocido';
    }
  };

  const calculateMetrics = (project: ProjectConfig) => {
    const annualRevenue = project.annualGeneration * 1000 * project.ppaPrice;
    const annualNetCashFlow = annualRevenue - project.opexAnnual;
    const roi = (annualNetCashFlow / project.capex) * 100;
    const yieldPerToken = (annualNetCashFlow * (project.investorShare / 100)) / project.totalTokens;
    const yieldPercentage = (yieldPerToken / project.tokenPrice) * 100;
    
    return { annualRevenue, roi, yieldPercentage };
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-gray-900">Gestión de Proyectos Solares</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Administra múltiples proyectos solares tokenizados desde un solo dashboard
        </p>
      </div>

      {/* Current Project Header */}
      <div className="bg-gradient-to-r from-green-500 to-blue-600 rounded-xl shadow-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
              <Sun className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Proyecto Activo: {currentProject.projectName}</h2>
              <p className="text-green-100">{currentProject.location} - {currentProject.capacity} MW</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-green-100">ROI Proyectado</div>
            <div className="text-3xl font-bold">{calculateMetrics(currentProject).roi.toFixed(1)}%</div>
          </div>
        </div>
      </div>

      {/* Add New Project Button */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Todos los Proyectos ({projects.length})</h2>
        <button
          onClick={() => setShowCreateForm(true)}
          className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
        >
          <Plus className="w-5 h-5" />
          <span>Nuevo Proyecto</span>
        </button>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => {
          const metrics = calculateMetrics(project);
          const isActive = currentProject.id === project.id;
          
          return (
            <div
              key={project.id}
              className={`bg-white rounded-xl shadow-lg overflow-hidden card-hover cursor-pointer ${
                isActive ? 'ring-2 ring-green-500 ring-opacity-50' : ''
              }`}
              onClick={() => onProjectChange(project)}
            >
              <div className={`h-2 ${
                isActive ? 'bg-gradient-to-r from-green-500 to-emerald-600' : 'bg-gradient-to-r from-gray-400 to-gray-500'
              }`}></div>
              
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      isActive ? 'bg-gradient-to-r from-green-500 to-emerald-600' : 'bg-gray-100'
                    }`}>
                      <Sun className={`w-5 h-5 ${isActive ? 'text-white' : 'text-gray-600'}`} />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">{project.projectName}</h3>
                      <p className="text-sm text-gray-600">{project.capacity} MW</p>
                    </div>
                  </div>
                  
                  <div className="flex space-x-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingProject(project);
                      }}
                      className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-300"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        duplicateProject(project);
                      }}
                      className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all duration-300"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteProject(project.id);
                      }}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-300"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span>{project.location}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                      {getStatusLabel(project.status)}
                    </span>
                    <span className="text-sm font-semibold text-green-600">
                      ROI: {metrics.roi.toFixed(1)}%
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-3 border-t border-gray-100">
                    <div className="text-center">
                      <div className="text-lg font-bold text-gray-900">{formatCurrency(metrics.annualRevenue)}</div>
                      <div className="text-xs text-gray-500">Ingresos/año</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-purple-600">{metrics.yieldPercentage.toFixed(1)}%</div>
                      <div className="text-xs text-gray-500">Yield anual</div>
                    </div>
                  </div>
                </div>

                {isActive && (
                  <div className="mt-4 pt-4 border-t border-green-200">
                    <div className="flex items-center space-x-2 text-green-600">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-sm font-medium">Proyecto Activo</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Create Project Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold text-gray-900">Crear Nuevo Proyecto Solar</h3>
                <button
                  onClick={() => setShowCreateForm(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-300"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Nombre del Proyecto *</label>
                  <input
                    type="text"
                    value={newProject.projectName}
                    onChange={(e) => setNewProject({...newProject, projectName: e.target.value})}
                    placeholder="Ej: LEVI-SOLAR2"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Ubicación *</label>
                  <input
                    type="text"
                    value={newProject.location}
                    onChange={(e) => setNewProject({...newProject, location: e.target.value})}
                    placeholder="Ej: Chiriquí, Panamá"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Capacidad (MW)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={newProject.capacity}
                    onChange={(e) => setNewProject({...newProject, capacity: parseFloat(e.target.value)})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">CAPEX (USD)</label>
                  <input
                    type="number"
                    value={newProject.capex}
                    onChange={(e) => setNewProject({...newProject, capex: parseInt(e.target.value)})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Precio PPA (USD/kWh)</label>
                  <input
                    type="number"
                    step="0.001"
                    value={newProject.ppaPrice}
                    onChange={(e) => setNewProject({...newProject, ppaPrice: parseFloat(e.target.value)})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Estado del Proyecto</label>
                  <select
                    value={newProject.status}
                    onChange={(e) => setNewProject({...newProject, status: e.target.value as any})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  >
                    <option value="planning">Planificación</option>
                    <option value="construction">Construcción</option>
                    <option value="operational">Operacional</option>
                    <option value="completed">Completado</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                <button
                  onClick={() => setShowCreateForm(false)}
                  className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all duration-300"
                >
                  Cancelar
                </button>
                <button
                  onClick={createProject}
                  className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all duration-300 transform hover:scale-105"
                >
                  Crear Proyecto
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Project Modal */}
      {editingProject && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold text-gray-900">Editar {editingProject.projectName}</h3>
                <button
                  onClick={() => setEditingProject(null)}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-300"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Nombre del Proyecto</label>
                  <input
                    type="text"
                    value={editingProject.projectName}
                    onChange={(e) => setEditingProject({...editingProject, projectName: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Estado</label>
                  <select
                    value={editingProject.status}
                    onChange={(e) => setEditingProject({...editingProject, status: e.target.value as any})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="planning">Planificación</option>
                    <option value="construction">Construcción</option>
                    <option value="operational">Operacional</option>
                    <option value="completed">Completado</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                <button
                  onClick={() => setEditingProject(null)}
                  className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all duration-300"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => updateProject(editingProject)}
                  className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105"
                >
                  Guardar Cambios
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Project Templates */}
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">Plantillas de Proyecto</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              name: 'Proyecto Pequeño',
              description: '1-5 MW, ideal para comunidades',
              icon: Building,
              template: {
                capacity: 2.5,
                capex: 2000000,
                annualGeneration: 4000,
                totalTokens: 2000000,
                co2Reduction: 2500,
                homesSupplied: 1200,
                ppaPrice: 0.13,
                opexAnnual: 80000
              }
            },
            {
              name: 'Proyecto Mediano',
              description: '5-15 MW, escala comercial',
              icon: Zap,
              template: {
                capacity: 9.9,
                capex: 7500000,
                annualGeneration: 16000,
                totalTokens: 7500000,
                co2Reduction: 10000,
                homesSupplied: 4500,
                ppaPrice: 0.12,
                opexAnnual: 180000
              }
            },
            {
              name: 'Proyecto Grande',
              description: '15+ MW, escala utility',
              icon: Sun,
              template: {
                capacity: 25.0,
                capex: 18000000,
                annualGeneration: 40000,
                totalTokens: 18000000,
                co2Reduction: 25000,
                homesSupplied: 11000,
                ppaPrice: 0.11,
                opexAnnual: 400000
              }
            }
          ].map((template, index) => {
            const Icon = template.icon;
            return (
              <div key={index} className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-all duration-300 transform hover:scale-105">
                <div className="text-center mb-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-green-100 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Icon className="w-8 h-8 text-green-600" />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">{template.name}</h4>
                  <p className="text-gray-600 text-sm">{template.description}</p>
                </div>
                
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
                    <span>PPA:</span>
                    <span>${template.template.ppaPrice}/kWh</span>
                  </div>
                </div>
                
                <button
                  onClick={() => {
                    setNewProject({
                      ...newProject,
                      ...template.template,
                      projectName: `LEVI-SOLAR${projects.length + 1}`,
                      location: 'Panamá'
                    });
                    setShowCreateForm(true);
                  }}
                  className="w-full px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all duration-300 transform hover:scale-105"
                >
                  Usar Plantilla
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Portfolio Summary */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-xl shadow-lg p-8 text-white">
        <h3 className="text-2xl font-bold mb-6 text-center">Resumen del Portafolio</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
          <div>
            <div className="text-3xl font-bold mb-2">
              {projects.reduce((sum, p) => sum + p.capacity, 0).toFixed(1)} MW
            </div>
            <div className="text-gray-300">Capacidad Total</div>
          </div>
          <div>
            <div className="text-3xl font-bold mb-2">
              {formatCurrency(projects.reduce((sum, p) => sum + p.capex, 0))}
            </div>
            <div className="text-gray-300">CAPEX Total</div>
          </div>
          <div>
            <div className="text-3xl font-bold mb-2">
              {projects.reduce((sum, p) => sum + p.co2Reduction, 0).toLocaleString()}
            </div>
            <div className="text-gray-300">tCO₂ Evitadas/Año</div>
          </div>
          <div>
            <div className="text-3xl font-bold mb-2">
              {projects.reduce((sum, p) => sum + p.homesSupplied, 0).toLocaleString()}
            </div>
            <div className="text-gray-300">Hogares Abastecidos</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectManager;