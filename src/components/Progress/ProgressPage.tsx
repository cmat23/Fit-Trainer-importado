import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { mockProgressEntries } from '../../data/mockData';
import { 
  TrendingUp, 
  Plus, 
  Calendar,
  Weight,
  Activity,
  Target
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { AddProgressModal } from './AddProgressModal';

export function ProgressPage() {
  const { user } = useAuth();
  const [selectedMetric, setSelectedMetric] = useState<'weight' | 'bodyFat' | 'muscleMass'>('weight');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  
  const userProgress = mockProgressEntries.filter(entry => entry.clientId === user?.id);
  
  const chartData = userProgress.map(entry => ({
    date: format(entry.date, 'dd/MM'),
    peso: entry.weight,
    grasa: entry.bodyFat || 0,
    musculo: entry.muscleMass || 0,
    imc: entry.bmi || 0
  }));

  const latestProgress = userProgress[userProgress.length - 1];
  const previousProgress = userProgress[userProgress.length - 2];

  const getChange = (current?: number, previous?: number) => {
    if (!current || !previous) return null;
    const change = current - previous;
    return {
      value: Math.abs(change),
      isPositive: change > 0,
      percentage: ((change / previous) * 100).toFixed(1)
    };
  };

  const weightChange = getChange(latestProgress?.weight, previousProgress?.weight);
  const bodyFatChange = getChange(latestProgress?.bodyFat, previousProgress?.bodyFat);
  const muscleMassChange = getChange(latestProgress?.muscleMass, previousProgress?.muscleMass);

  const handleAddProgress = (progressData: any) => {
    console.log('Adding new progress entry:', progressData);
    alert('Medición agregada exitosamente (funcionalidad de demostración)');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Mi Progreso</h1>
          <p className="mt-1 text-sm text-gray-600">
            Sigue tu evolución física y objetivos
          </p>
        </div>
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nueva Medición
        </button>
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
              {weightChange && (
                <p className={`text-sm ${weightChange.isPositive ? 'text-red-600' : 'text-green-600'}`}>
                  {weightChange.isPositive ? '+' : '-'}{weightChange.value}kg ({weightChange.percentage}%)
                </p>
              )}
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <Weight className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">% Grasa Corporal</p>
              <p className="text-3xl font-bold text-gray-900">
                {latestProgress?.bodyFat || 0}
                <span className="text-lg font-normal text-gray-500">%</span>
              </p>
              {bodyFatChange && (
                <p className={`text-sm ${bodyFatChange.isPositive ? 'text-red-600' : 'text-green-600'}`}>
                  {bodyFatChange.isPositive ? '+' : '-'}{bodyFatChange.value}% ({bodyFatChange.percentage}%)
                </p>
              )}
            </div>
            <div className="p-3 bg-orange-100 rounded-full">
              <Activity className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Masa Muscular</p>
              <p className="text-3xl font-bold text-gray-900">
                {latestProgress?.muscleMass || 0}
                <span className="text-lg font-normal text-gray-500">kg</span>
              </p>
              {muscleMassChange && (
                <p className={`text-sm ${muscleMassChange.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                  {muscleMassChange.isPositive ? '+' : '-'}{muscleMassChange.value}kg ({muscleMassChange.percentage}%)
                </p>
              )}
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <TrendingUp className="w-6 h-6 text-green-600" />
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
              <p className="text-sm text-gray-500">
                {latestProgress?.bmi && latestProgress.bmi < 18.5 ? 'Bajo peso' :
                 latestProgress?.bmi && latestProgress.bmi < 25 ? 'Normal' :
                 latestProgress?.bmi && latestProgress.bmi < 30 ? 'Sobrepeso' : 'Obesidad'}
              </p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <Target className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Gráfico de evolución */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Evolución Temporal</h2>
          <div className="flex space-x-2">
            <button
              onClick={() => setSelectedMetric('weight')}
              className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                selectedMetric === 'weight'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Peso
            </button>
            <button
              onClick={() => setSelectedMetric('bodyFat')}
              className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                selectedMetric === 'bodyFat'
                  ? 'bg-orange-100 text-orange-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              % Grasa
            </button>
            <button
              onClick={() => setSelectedMetric('muscleMass')}
              className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                selectedMetric === 'muscleMass'
                  ? 'bg-green-100 text-green-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Masa Muscular
            </button>
          </div>
        </div>
        
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey={selectedMetric === 'weight' ? 'peso' : selectedMetric === 'bodyFat' ? 'grasa' : 'musculo'}
                stroke={selectedMetric === 'weight' ? '#3B82F6' : selectedMetric === 'bodyFat' ? '#F97316' : '#10B981'}
                strokeWidth={3}
                dot={{ fill: selectedMetric === 'weight' ? '#3B82F6' : selectedMetric === 'bodyFat' ? '#F97316' : '#10B981', strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Mediciones corporales */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Mediciones Corporales Actuales</h2>
        {latestProgress?.measurements && (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Pecho</p>
              <p className="text-2xl font-bold text-blue-600">{latestProgress.measurements.chest}</p>
              <p className="text-xs text-gray-500">cm</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Cintura</p>
              <p className="text-2xl font-bold text-green-600">{latestProgress.measurements.waist}</p>
              <p className="text-xs text-gray-500">cm</p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Caderas</p>
              <p className="text-2xl font-bold text-purple-600">{latestProgress.measurements.hips}</p>
              <p className="text-xs text-gray-500">cm</p>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Brazos</p>
              <p className="text-2xl font-bold text-orange-600">{latestProgress.measurements.arms}</p>
              <p className="text-xs text-gray-500">cm</p>
            </div>
            <div className="text-center p-4 bg-pink-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Piernas</p>
              <p className="text-2xl font-bold text-pink-600">{latestProgress.measurements.thighs}</p>
              <p className="text-xs text-gray-500">cm</p>
            </div>
          </div>
        )}
      </div>

      {/* Historial de mediciones */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Historial de Mediciones</h2>
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
              {userProgress.map((entry) => (
                <tr key={entry.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
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

      <AddProgressModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleAddProgress}
      />
    </div>
  );
}