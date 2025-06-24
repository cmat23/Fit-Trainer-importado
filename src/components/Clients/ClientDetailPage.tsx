import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { mockClients, mockProgressEntries, mockWorkouts } from '../../data/mockData';
import { 
  ArrowLeft, 
  User, 
  Activity, 
  TrendingUp, 
  Calendar,
  Mail,
  Phone,
  Edit,
  Plus,
  Dumbbell,
  FileText
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { generateClientReport } from '../../utils/pdfExport';
import { AddProgressModal } from '../Progress/AddProgressModal';

export function ClientDetailPage() {
  const { clientId } = useParams();
  const [activeTab, setActiveTab] = useState<'overview' | 'progress' | 'workouts' | 'diet'>('overview');
  const [isAddProgressModalOpen, setIsAddProgressModalOpen] = useState(false);
  
  const client = mockClients.find(c => c.id === clientId);
  const clientProgress = mockProgressEntries.filter(entry => entry.clientId === clientId);
  const clientWorkouts = mockWorkouts.filter(workout => workout.clientId === clientId);

  if (!client) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Cliente no encontrado</p>
        <Link to="/clients" className="text-blue-600 hover:text-blue-500 mt-2 inline-block">
          Volver a clientes
        </Link>
      </div>
    );
  }

  // Datos para gráficos
  const weightData = clientProgress.map(entry => ({
    date: format(entry.date, 'dd/MM'),
    peso: entry.weight,
    grasa: entry.bodyFat || 0,
    musculo: entry.muscleMass || 0
  }));

  const latestProgress = clientProgress[clientProgress.length - 1];

  const tabs = [
    { id: 'overview', label: 'Resumen', icon: User },
    { id: 'progress', label: 'Progreso', icon: TrendingUp },
    { id: 'workouts', label: 'Entrenamientos', icon: Dumbbell },
    { id: 'diet', label: 'Dieta', icon: Activity },
  ];

  const handleExportPDF = () => {
    generateClientReport(client, clientProgress, clientWorkouts);
  };

  const handleAddProgress = (progressData: any) => {
    console.log('Adding progress for client:', client.id, progressData);
    alert('Medición agregada exitosamente (funcionalidad de demostración)');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Link 
          to="/clients"
          className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="flex-1">
          <div className="flex items-center space-x-4">
            <div className="flex-shrink-0">
              {client.avatar ? (
                <img 
                  src={client.avatar} 
                  alt={client.name}
                  className="w-20 h-20 rounded-full object-cover"
                />
              ) : (
                <div className="w-20 h-20 bg-gray-300 rounded-full flex items-center justify-center">
                  <User className="w-10 h-10 text-gray-600" />
                </div>
              )}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{client.name}</h1>
              <div className="flex items-center space-x-4 mt-1">
                <span className="text-sm text-gray-500">{client.email}</span>
                <span className="text-sm text-gray-500">•</span>
                <span className="text-sm text-gray-500">{client.age} años</span>
                <span className="text-sm text-gray-500">•</span>
                <span className="text-sm text-gray-500">{client.currentWeight} kg</span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex space-x-2">
          <button 
            onClick={handleExportPDF}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <FileText className="w-4 h-4 mr-2 inline" />
            Exportar PDF
          </button>
          <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            <Edit className="w-4 h-4 mr-2 inline" />
            Editar
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6" aria-label="Tabs">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="w-4 h-4 mr-2 inline" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Estadísticas básicas */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-gray-600">Peso Actual</p>
                  <p className="text-2xl font-bold text-blue-600">{client.currentWeight} kg</p>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <p className="text-sm text-gray-600">Altura</p>
                  <p className="text-2xl font-bold text-green-600">{client.height} cm</p>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <p className="text-sm text-gray-600">IMC</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {latestProgress?.bmi?.toFixed(1) || 'N/A'}
                  </p>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <p className="text-sm text-gray-600">% Grasa</p>
                  <p className="text-2xl font-bold text-orange-600">
                    {latestProgress?.bodyFat || 'N/A'}%
                  </p>
                </div>
              </div>

              {/* Objetivos */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Objetivos</h3>
                <div className="flex flex-wrap gap-2">
                  {client.goals.map((goal, index) => (
                    <span 
                      key={index}
                      className="px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded-full"
                    >
                      {goal}
                    </span>
                  ))}
                </div>
              </div>

              {/* Notas */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Notas del Entrenador</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-gray-700">{client.notes}</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'progress' && (
            <div className="space-y-6">
              {/* Gráfico de evolución */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Evolución de Peso</h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={weightData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Line 
                        type="monotone" 
                        dataKey="peso" 
                        stroke="#3B82F6" 
                        strokeWidth={2}
                        name="Peso (kg)"
                      />
                      <Line 
                        type="monotone" 
                        dataKey="grasa" 
                        stroke="#EF4444" 
                        strokeWidth={2}
                        name="% Grasa"
                      />
                      <Line 
                        type="monotone" 
                        dataKey="musculo" 
                        stroke="#10B981" 
                        strokeWidth={2}
                        name="Masa Muscular (kg)"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Tabla de progreso */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Historial de Mediciones</h3>
                  <button 
                    onClick={() => setIsAddProgressModalOpen(true)}
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                  >
                    <Plus className="w-4 h-4 mr-2 inline" />
                    Nueva Medición
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Fecha
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Peso
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          % Grasa
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Masa Muscular
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          IMC
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {clientProgress.map((entry) => (
                        <tr key={entry.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {format(entry.date, 'dd MMM yyyy', { locale: es })}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {entry.weight} kg
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {entry.bodyFat || 'N/A'}%
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {entry.muscleMass || 'N/A'} kg
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {entry.bmi?.toFixed(1) || 'N/A'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'workouts' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Entrenamientos</h3>
                <button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700">
                  <Plus className="w-4 h-4 mr-2 inline" />
                  Nueva Rutina
                </button>
              </div>
              
              <div className="grid gap-4">
                {clientWorkouts.map((workout) => (
                  <div key={workout.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900">{workout.name}</h4>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        workout.completed 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {workout.completed ? 'Completado' : 'Pendiente'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mb-2">
                      {format(workout.date, 'dd MMM yyyy', { locale: es })}
                    </p>
                    <div className="text-sm text-gray-600">
                      {workout.exercises.length} ejercicios
                      {workout.duration && ` • ${workout.duration} min`}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'diet' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Plan Nutricional</h3>
                <button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700">
                  <Plus className="w-4 h-4 mr-2 inline" />
                  Asignar Dieta
                </button>
              </div>
              
              <div className="text-center py-12">
                <Activity className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No hay plan nutricional asignado</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Crea un plan personalizado para este cliente
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      <AddProgressModal
        isOpen={isAddProgressModalOpen}
        onClose={() => setIsAddProgressModalOpen(false)}
        onSave={handleAddProgress}
      />
    </div>
  );
}