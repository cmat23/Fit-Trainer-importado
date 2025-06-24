import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { mockProgressEntries, mockWorkouts, mockUsers } from '../../data/mockData';
import { Activity, Target, Calendar, TrendingUp, Dumbbell, Apple } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export function ClientDashboard() {
  const { user } = useAuth();
  const trainer = mockUsers.find(u => u.id === user?.trainerId);
  const clientProgress = mockProgressEntries.filter(entry => entry.clientId === user?.id);
  const clientWorkouts = mockWorkouts.filter(workout => workout.clientId === user?.id);
  
  // Datos para el gráfico de peso
  const weightData = clientProgress.map(entry => ({
    date: format(entry.date, 'dd/MM'),
    peso: entry.weight,
    grasa: entry.bodyFat || 0,
    musculo: entry.muscleMass || 0
  }));

  const latestProgress = clientProgress[clientProgress.length - 1];
  const completedWorkouts = clientWorkouts.filter(w => w.completed).length;
  const totalWorkouts = clientWorkouts.length;

  return (
    <div className="space-y-6">
      {/* Bienvenida */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">
          ¡Hola, {user?.name}!
        </h1>
        <p className="text-purple-100">
          {trainer ? `Tu entrenador: ${trainer.name}` : 'Continúa con tu progreso'}
        </p>
      </div>

      {/* Estadísticas principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Peso Actual</p>
              <p className="text-3xl font-bold text-gray-900">
                {latestProgress?.weight || 0}
                <span className="text-lg font-normal text-gray-500">kg</span>
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <Activity className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">IMC</p>
              <p className="text-3xl font-bold text-gray-900">
                {latestProgress?.bmi?.toFixed(1) || 0}
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <Target className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Entrenamientos</p>
              <p className="text-3xl font-bold text-gray-900">
                {completedWorkouts}/{totalWorkouts}
              </p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <Dumbbell className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">% Grasa</p>
              <p className="text-3xl font-bold text-gray-900">
                {latestProgress?.bodyFat || 0}
                <span className="text-lg font-normal text-gray-500">%</span>
              </p>
            </div>
            <div className="p-3 bg-orange-100 rounded-full">
              <TrendingUp className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico de evolución */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Evolución de Peso</h2>
          <div className="h-64">
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
                  dot={{ fill: '#3B82F6' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Entrenamientos recientes */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Entrenamientos Recientes</h2>
            <Dumbbell className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-3">
            {clientWorkouts.slice(-4).map((workout) => (
              <div key={workout.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className={`p-2 rounded-full ${workout.completed ? 'bg-green-100' : 'bg-gray-100'}`}>
                  <Dumbbell className={`w-4 h-4 ${workout.completed ? 'text-green-600' : 'text-gray-400'}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">{workout.name}</p>
                  <p className="text-sm text-gray-500">
                    {format(workout.date, 'dd MMM yyyy', { locale: es })}
                  </p>
                </div>
                <div className="text-right">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    workout.completed 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {workout.completed ? 'Completado' : 'Pendiente'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Objetivos y mediciones */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Mediciones Actuales</h2>
          {latestProgress?.measurements && (
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-gray-600">Pecho</p>
                <p className="text-xl font-bold text-blue-600">{latestProgress.measurements.chest}cm</p>
              </div>
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <p className="text-sm text-gray-600">Cintura</p>
                <p className="text-xl font-bold text-green-600">{latestProgress.measurements.waist}cm</p>
              </div>
              <div className="text-center p-3 bg-purple-50 rounded-lg">
                <p className="text-sm text-gray-600">Brazos</p>
                <p className="text-xl font-bold text-purple-600">{latestProgress.measurements.arms}cm</p>
              </div>
              <div className="text-center p-3 bg-orange-50 rounded-lg">
                <p className="text-sm text-gray-600">Piernas</p>
                <p className="text-xl font-bold text-orange-600">{latestProgress.measurements.thighs}cm</p>
              </div>
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Próximas Actividades</h2>
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-full">
                <Calendar className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Sesión de entrenamiento</p>
                <p className="text-xs text-gray-500">Mañana a las 16:00</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 rounded-full">
                <Activity className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Registro de peso</p>
                <p className="text-xs text-gray-500">Cada lunes</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-orange-100 rounded-full">
                <Apple className="w-4 h-4 text-orange-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Plan nutricional</p>
                <p className="text-xs text-gray-500">Revisar dieta semanal</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}