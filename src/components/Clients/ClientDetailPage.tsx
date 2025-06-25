import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { mockClients, mockProgressEntries, mockWorkouts, mockDailyActivity, mockDeviceConnections, mockFitnessData } from '../../data/mockData';
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
  FileText,
  MessageSquare,
  UserCheck,
  Settings,
  Smartphone,
  Heart,
  Footprints,
  Flame,
  Clock,
  Moon,
  Wifi,
  WifiOff,
  RefreshCw
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { generateClientReport } from '../../utils/pdfExport';
import { AddProgressModal } from '../Progress/AddProgressModal';

export function ClientDetailPage() {
  const { clientId } = useParams();
  const [activeTab, setActiveTab] = useState<'overview' | 'progress' | 'workouts' | 'diet' | 'fitness'>('overview');
  const [isAddProgressModalOpen, setIsAddProgressModalOpen] = useState(false);
  
  const client = mockClients.find(c => c.id === clientId);
  const clientProgress = mockProgressEntries.filter(entry => entry.clientId === clientId);
  const clientWorkouts = mockWorkouts.filter(workout => workout.clientId === clientId);
  const clientDailyActivity = mockDailyActivity.filter(activity => activity.clientId === clientId);
  const clientDevices = mockDeviceConnections.filter(device => device.clientId === clientId);
  const clientFitnessData = mockFitnessData.filter(data => data.clientId === clientId);

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

  // Datos de actividad para gráficos
  const activityData = clientDailyActivity.map(activity => ({
    date: format(activity.date, 'dd/MM'),
    pasos: activity.steps,
    calorias: activity.caloriesBurned,
    activos: activity.activeMinutes,
    distancia: activity.distance
  }));

  const latestProgress = clientProgress[clientProgress.length - 1];
  const latestActivity = clientDailyActivity[clientDailyActivity.length - 1];

  const tabs = [
    { id: 'overview', label: 'Resumen', icon: User },
    { id: 'progress', label: 'Progreso', icon: TrendingUp },
    { id: 'workouts', label: 'Entrenamientos', icon: Dumbbell },
    { id: 'fitness', label: 'Datos Fitness', icon: Smartphone },
    { id: 'diet', label: 'Dieta', icon: Activity },
  ];

  const handleExportPDF = () => {
    generateClientReport(client, clientProgress, clientWorkouts);
  };

  const handleAddProgress = (progressData: any) => {
    console.log('Adding progress for client:', client.id, progressData);
    alert('Medición agregada exitosamente (funcionalidad de demostración)');
  };

  const handleSendMessage = () => {
    alert('Redirigiendo a mensajes con el cliente (funcionalidad de demostración)');
  };

  const handleScheduleAppointment = () => {
    alert('Redirigiendo al calendario para programar cita (funcionalidad de demostración)');
  };

  const handleEditClient = () => {
    alert('Abrir modal de edición de cliente (funcionalidad de demostración)');
  };

  const handleClientSettings = () => {
    alert('Abrir configuración del cliente (funcionalidad de demostración)');
  };

  const handleSyncDevice = (deviceId: string) => {
    alert(`Sincronizando dispositivo ${deviceId} (funcionalidad de demostración)`);
  };

  const getDeviceIcon = (deviceType: string) => {
    const icons: { [key: string]: string } = {
      'apple_watch': '🍎',
      'fitbit': '⌚',
      'garmin': '🏔️',
      'samsung_watch': '📱',
      'google_fit': '🏃'
    };
    return icons[deviceType] || '⌚';
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
        
        {/* Botones de acción */}
        <div className="flex space-x-2">
          <button 
            onClick={handleSendMessage}
            className="px-4 py-2 text-sm font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors flex items-center space-x-2"
            title="Enviar mensaje"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Mensaje</span>
          </button>
          
          <button 
            onClick={handleScheduleAppointment}
            className="px-4 py-2 text-sm font-medium text-purple-700 bg-purple-50 border border-purple-200 rounded-lg hover:bg-purple-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors flex items-center space-x-2"
            title="Programar cita"
          >
            <Calendar className="w-4 h-4" />
            <span>Cita</span>
          </button>
          
          <button 
            onClick={handleExportPDF}
            className="px-4 py-2 text-sm font-medium text-green-700 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors flex items-center space-x-2"
            title="Exportar PDF"
          >
            <FileText className="w-4 h-4" />
            <span>PDF</span>
          </button>
          
          <button 
            onClick={handleEditClient}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors flex items-center space-x-2"
            title="Editar cliente"
          >
            <Edit className="w-4 h-4" />
            <span>Editar</span>
          </button>
          
          <button 
            onClick={handleClientSettings}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            title="Configuración"
          >
            <Settings className="w-4 h-4" />
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
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Nueva Medición</span>
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
                <button 
                  onClick={() => alert('Crear nueva rutina (funcionalidad de demostración)')}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Nueva Rutina</span>
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

          {activeTab === 'fitness' && (
            <div className="space-y-6">
              {/* Dispositivos conectados */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Dispositivos Conectados</h3>
                <div className="grid gap-4">
                  {clientDevices.map((device) => (
                    <div key={device.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="text-2xl">{getDeviceIcon(device.deviceType)}</div>
                        <div>
                          <h4 className="font-medium text-gray-900">{device.deviceName}</h4>
                          <div className="flex items-center space-x-2 mt-1">
                            {device.isConnected ? (
                              <>
                                <Wifi className="w-4 h-4 text-green-500" />
                                <span className="text-sm text-green-600">Conectado</span>
                              </>
                            ) : (
                              <>
                                <WifiOff className="w-4 h-4 text-red-500" />
                                <span className="text-sm text-red-600">Desconectado</span>
                              </>
                            )}
                            <span className="text-sm text-gray-500">•</span>
                            <span className="text-sm text-gray-500">
                              Última sync: {format(device.lastSync, 'dd/MM HH:mm', { locale: es })}
                            </span>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => handleSyncDevice(device.id)}
                        className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-full transition-colors"
                        title="Sincronizar datos"
                      >
                        <RefreshCw className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actividad reciente */}
              {latestActivity && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Actividad de Hoy</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="flex items-center justify-center mb-2">
                        <Footprints className="w-6 h-6 text-blue-600" />
                      </div>
                      <p className="text-2xl font-bold text-blue-600">{latestActivity.steps.toLocaleString()}</p>
                      <p className="text-sm text-gray-600">Pasos</p>
                    </div>

                    <div className="text-center p-4 bg-orange-50 rounded-lg">
                      <div className="flex items-center justify-center mb-2">
                        <Flame className="w-6 h-6 text-orange-600" />
                      </div>
                      <p className="text-2xl font-bold text-orange-600">{latestActivity.caloriesBurned}</p>
                      <p className="text-sm text-gray-600">Calorías</p>
                    </div>

                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="flex items-center justify-center mb-2">
                        <Clock className="w-6 h-6 text-green-600" />
                      </div>
                      <p className="text-2xl font-bold text-green-600">{latestActivity.activeMinutes}</p>
                      <p className="text-sm text-gray-600">Min Activos</p>
                    </div>

                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <div className="flex items-center justify-center mb-2">
                        <Activity className="w-6 h-6 text-purple-600" />
                      </div>
                      <p className="text-2xl font-bold text-purple-600">{latestActivity.distance}</p>
                      <p className="text-sm text-gray-600">km</p>
                    </div>
                  </div>

                  {/* Datos adicionales */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    {latestActivity.averageHeartRate && (
                      <div className="flex items-center space-x-3 p-3 bg-red-50 rounded-lg">
                        <Heart className="w-5 h-5 text-red-600" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">Frecuencia Cardíaca Promedio</p>
                          <p className="text-lg font-bold text-red-600">{latestActivity.averageHeartRate} bpm</p>
                        </div>
                      </div>
                    )}

                    {latestActivity.sleepHours && (
                      <div className="flex items-center space-x-3 p-3 bg-indigo-50 rounded-lg">
                        <Moon className="w-5 h-5 text-indigo-600" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">Horas de Sueño</p>
                          <p className="text-lg font-bold text-indigo-600">{latestActivity.sleepHours}h</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Entrenamientos del día */}
                  {latestActivity.workouts.length > 0 && (
                    <div>
                      <h4 className="text-md font-medium text-gray-900 mb-3">Entrenamientos de Hoy</h4>
                      <div className="space-y-2">
                        {latestActivity.workouts.map((workout, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div>
                              <p className="font-medium text-gray-900">{workout.type}</p>
                              <p className="text-sm text-gray-600">
                                {format(workout.startTime, 'HH:mm', { locale: es })} • {workout.duration} min
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-medium text-orange-600">{workout.calories} cal</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Gráfico de actividad semanal */}
              {activityData.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Actividad Semanal</h3>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={activityData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="pasos" fill="#3B82F6" name="Pasos" />
                        <Bar dataKey="calorias" fill="#F97316" name="Calorías" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}

              {/* Insights y recomendaciones */}
              <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
                <h3 className="text-md font-semibold text-blue-900 mb-3">Insights del Entrenador</h3>
                <div className="space-y-3 text-sm text-blue-800">
                  <div className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                    <p>El cliente mantiene una actividad constante fuera del gimnasio con un promedio de {latestActivity ? Math.round(latestActivity.steps / 1000) : 8}k pasos diarios.</p>
                  </div>
                  <div className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                    <p>La frecuencia cardíaca en reposo indica un buen nivel de condición cardiovascular.</p>
                  </div>
                  <div className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                    <p>Recomendar mantener el nivel actual de actividad y enfocarse en la intensidad de los entrenamientos.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'diet' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Plan Nutricional</h3>
                <button 
                  onClick={() => alert('Asignar dieta (funcionalidad de demostración)')}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Asignar Dieta</span>
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