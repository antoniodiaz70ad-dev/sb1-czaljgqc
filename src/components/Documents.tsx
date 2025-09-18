import React, { useState } from 'react';
import { FileText, Download, Eye, Shield, Award, Calendar, MapPin, DollarSign, TrendingUp } from 'lucide-react';

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

interface DocumentsProps {
  config: ProjectConfig;
}

const Documents: React.FC<DocumentsProps> = ({ config }) => {
  const [selectedCategory, setSelectedCategory] = useState<'legal' | 'technical' | 'financial' | 'regulatory'>('legal');

  const documentCategories = {
    legal: {
      title: 'Documentos Legales',
      icon: Shield,
      color: 'from-blue-500 to-indigo-600',
      documents: [
        {
          name: 'Licencia Definitiva de Generación',
          type: 'PDF',
          size: '2.4 MB',
          date: '2024-03-15',
          status: 'Vigente',
          description: 'Licencia por 40 años otorgada por ASEP'
        },
        {
          name: 'Contrato PPA',
          type: 'PDF',
          size: '1.8 MB',
          date: '2024-04-20',
          status: 'Firmado',
          description: 'Contrato de compra de energía a 15 años'
        },
        {
          name: 'Permiso de Construcción',
          type: 'PDF',
          size: '1.2 MB',
          date: '2024-05-10',
          status: 'Aprobado',
          description: 'Autorización municipal para construcción'
        },
        {
          name: 'Estudio de Impacto Ambiental',
          type: 'PDF',
          size: '5.6 MB',
          date: '2024-02-28',
          status: 'Aprobado',
          description: 'EIA aprobado por MiAMBIENTE'
        },
        {
          name: 'Servidumbre de Transmisión',
          type: 'PDF',
          size: '0.8 MB',
          date: '2024-06-05',
          status: 'Registrada',
          description: 'Derechos de paso para línea 34.5 kV'
        }
      ]
    },
    technical: {
      title: 'Documentación Técnica',
      icon: Award,
      color: 'from-green-500 to-emerald-600',
      documents: [
        {
          name: 'Estudio de Viabilidad Técnica',
          type: 'PDF',
          size: '3.2 MB',
          date: '2024-01-15',
          status: 'Aprobado',
          description: 'Análisis técnico completo del proyecto'
        },
        {
          name: 'Diseño de Ingeniería',
          type: 'PDF',
          size: '8.4 MB',
          date: '2024-07-20',
          status: 'Final',
          description: 'Planos y especificaciones técnicas'
        },
        {
          name: 'Estudio de Irradiación Solar',
          type: 'PDF',
          size: '2.1 MB',
          date: '2024-01-30',
          status: 'Completado',
          description: 'Análisis de recurso solar del sitio'
        },
        {
          name: 'Especificaciones de Equipos',
          type: 'PDF',
          size: '1.5 MB',
          date: '2024-08-10',
          status: 'Final',
          description: 'Datasheets de paneles e inversores'
        },
        {
          name: 'Plan de O&M',
          type: 'PDF',
          size: '1.9 MB',
          date: '2024-08-25',
          status: 'Aprobado',
          description: 'Plan de operación y mantenimiento'
        }
      ]
    },
    financial: {
      title: 'Documentos Financieros',
      icon: Calendar,
      color: 'from-purple-500 to-pink-600',
      documents: [
        {
          name: 'Modelo Financiero Completo',
          type: 'XLSX',
          size: '2.8 MB',
          date: '2024-09-15',
          status: 'Actualizado',
          description: 'Proyecciones financieras 15 años'
        },
        {
          name: 'Due Diligence Financiero',
          type: 'PDF',
          size: '4.2 MB',
          date: '2024-08-30',
          status: 'Completado',
          description: 'Análisis financiero independiente'
        },
        {
          name: 'Estructura de Tokenización',
          type: 'PDF',
          size: '1.6 MB',
          date: '2024-09-20',
          status: 'Final',
          description: 'Términos y condiciones de tokens'
        },
        {
          name: 'Análisis de Sensibilidad',
          type: 'PDF',
          size: '1.1 MB',
          date: '2024-09-10',
          status: 'Final',
          description: 'Escenarios de riesgo y retorno'
        }
      ]
    },
    regulatory: {
      title: 'Marco Regulatorio',
      icon: MapPin,
      color: 'from-orange-500 to-red-600',
      documents: [
        {
          name: 'Ley 45/2004 - Energías Renovables',
          type: 'PDF',
          size: '0.9 MB',
          date: '2004-08-10',
          status: 'Vigente',
          description: 'Marco legal para energías renovables en Panamá'
        },
        {
          name: 'Reglamento ASEP',
          type: 'PDF',
          size: '1.3 MB',
          date: '2024-01-01',
          status: 'Vigente',
          description: 'Regulaciones del sector eléctrico'
        },
        {
          name: 'Certificación Ambiental',
          type: 'PDF',
          size: '2.0 MB',
          date: '2024-03-01',
          status: 'Vigente',
          description: 'Certificación de cumplimiento ambiental'
        },
        {
          name: 'Registro de Tokens',
          type: 'PDF',
          size: '0.7 MB',
          date: '2024-09-25',
          status: 'En proceso',
          description: 'Registro ante autoridades financieras'
        }
      ]
    }
  };

  const currentCategory = documentCategories[selectedCategory];
  const CategoryIcon = currentCategory.icon;

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'vigente':
      case 'aprobado':
      case 'firmado':
      case 'completado':
      case 'final':
      case 'actualizado':
      case 'registrada':
        return 'bg-green-100 text-green-700';
      case 'en proceso':
        return 'bg-yellow-100 text-yellow-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-gray-900">Centro de Documentos</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Acceso completo a toda la documentación legal, técnica y financiera del proyecto
        </p>
      </div>

      {/* Category Navigation */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {Object.entries(documentCategories).map(([key, category]) => {
            const Icon = category.icon;
            const isActive = selectedCategory === key;
            
            return (
              <button
                key={key}
                onClick={() => setSelectedCategory(key as any)}
                className={`p-4 rounded-lg transition-all duration-300 transform hover:scale-105 ${
                  isActive
                    ? `bg-gradient-to-r ${category.color} text-white shadow-lg`
                    : 'bg-gray-50 text-gray-600 hover:bg-gradient-to-r hover:from-gray-100 hover:to-gray-50 hover:shadow-md'
                }`}
              >
                <Icon className={`w-6 h-6 mx-auto mb-2 ${isActive ? 'text-white' : 'text-gray-500'}`} />
                <div className="text-sm font-semibold">{category.title}</div>
                <div className={`text-xs mt-1 ${isActive ? 'text-white opacity-80' : 'text-gray-500'}`}>
                  {category.documents.length} documentos
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Document List */}
      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="flex items-center space-x-3 mb-6">
          <div className={`w-10 h-10 bg-gradient-to-r ${currentCategory.color} rounded-lg flex items-center justify-center`}>
            <CategoryIcon className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">{currentCategory.title}</h2>
        </div>

        <div className="space-y-4">
          {currentCategory.documents.map((doc, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-all duration-300 hover:border-gray-300 transform hover:scale-[1.02]">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4 flex-1">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                    <FileText className="w-6 h-6 text-gray-600" />
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">{doc.name}</h3>
                    <p className="text-gray-600 text-sm mb-3">{doc.description}</p>
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span>Tipo: {doc.type}</span>
                      <span>Tamaño: {doc.size}</span>
                      <span>Fecha: {new Date(doc.date).toLocaleDateString('es-ES')}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(doc.status)}`}>
                    {doc.status}
                  </span>
                  
                  <div className="flex space-x-2">
                    <button className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-all duration-300 transform hover:scale-110 hover:shadow-md">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-all duration-300 transform hover:scale-110 hover:shadow-md">
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Document Security Notice */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-xl shadow-lg p-8 text-white">
        <div className="flex items-center space-x-3 mb-4">
          <Shield className="w-8 h-8 text-blue-400" />
          <h2 className="text-2xl font-bold">Seguridad de Documentos</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-500 bg-opacity-20 rounded-lg flex items-center justify-center mx-auto mb-3">
              <Shield className="w-6 h-6 text-blue-400" />
            </div>
            <h3 className="font-semibold text-white mb-2">Acceso Controlado</h3>
            <p className="text-gray-300 text-sm">Solo inversionistas verificados pueden acceder a documentos sensibles</p>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 bg-green-500 bg-opacity-20 rounded-lg flex items-center justify-center mx-auto mb-3">
              <FileText className="w-6 h-6 text-green-400" />
            </div>
            <h3 className="font-semibold text-white mb-2">Versionado</h3>
            <p className="text-gray-300 text-sm">Historial completo de versiones y actualizaciones de documentos</p>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 bg-purple-500 bg-opacity-20 rounded-lg flex items-center justify-center mx-auto mb-3">
              <Award className="w-6 h-6 text-purple-400" />
            </div>
            <h3 className="font-semibold text-white mb-2">Autenticidad</h3>
            <p className="text-gray-300 text-sm">Documentos firmados digitalmente y verificados por terceros</p>
          </div>
        </div>
      </div>

      {/* Quick Access */}
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Acceso Rápido</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { name: 'Resumen Ejecutivo', icon: FileText, color: 'bg-blue-500' },
            { name: 'Términos de Inversión', icon: DollarSign, color: 'bg-green-500' },
            { name: 'Cronograma del Proyecto', icon: Calendar, color: 'bg-purple-500' },
            { name: 'Especificaciones Técnicas', icon: Award, color: 'bg-orange-500' },
            { name: 'Marco Legal', icon: Shield, color: 'bg-indigo-500' },
            { name: 'Análisis de Riesgos', icon: TrendingUp, color: 'bg-red-500' },
          ].map((item, index) => {
            const Icon = item.icon;
            return (
              <button
                key={index}
                className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:shadow-lg hover:border-gray-300 transition-all duration-300 text-left transform hover:scale-105"
              >
                <div className={`w-10 h-10 ${item.color} rounded-lg flex items-center justify-center`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="font-semibold text-gray-900">{item.name}</div>
                  <div className="text-sm text-gray-500">Ver documento</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Legal Disclaimer */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
        <h3 className="font-semibold text-yellow-800 mb-2">Aviso Legal</h3>
        <p className="text-yellow-700 text-sm">
          Los documentos aquí presentados son para fines informativos. Para acceso completo a documentos legales 
          y técnicos, los inversionistas deben completar el proceso de verificación KYC/AML. Algunos documentos 
          pueden contener información confidencial sujeta a acuerdos de no divulgación.
        </p>
      </div>
    </div>
  );
};

export default Documents;