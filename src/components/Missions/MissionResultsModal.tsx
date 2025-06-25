import React, { useState } from 'react';
import { X, Calendar, Trophy, Star, TrendingUp, Filter, Search, User, Target, Clock, CheckCircle, XCircle, Award } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface MissionResultsModalProps {
  isOpen: boolean;
  onClose: () => void;
  clientId?: string;
  clientName?: string;
}

// Datos mock de resultados históricos de misiones
const mockMissionResults = [
  {
    id: '1',
    clientId: '2',
    missionId: '3',
    missionTitle: 'Racha de 7 días',
    missionType: 'consistency',
    difficulty: 'hard',
    targetValue: 7,
    targetUnit: 'días',
    pointsEarned: 150,
    status: 'completed',
    progress: 100,
    startDate: new Date(Date.now() - 17 * 24 * 60 * 60 * 1000),
    endDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
    completedDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
    category: 'challenge',
    icon: '🔥',
    notes: 'Excelente consistencia durante toda la semana',
    performance: {
      averageDaily: 1,
      bestStreak: 7,
      totalDays: 7,
      efficiency: 100
    }
  },
  {
    id: '2',
    clientId: '2',
    missionId: '1',
    missionTitle: 'Camina 10,000 pasos diarios',
    missionType: 'steps',
    difficulty: 'easy',
    targetValue: 10000,
    targetUnit: 'pasos',
    pointsEarned: 37, // Parcial porque no se completó
    status: 'expired',
    progress: 75,
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    endDate: new Date(Date.now() - 23 * 24 * 60 * 60 * 1000),
    category: 'fitness',
    icon: '🚶‍♀️',
    notes: 'Buen progreso pero no logró mantener la consistencia los últimos días',
    performance: {
      averageDaily: 7500,
      bestDay: 12500,
      totalSteps: 52500,
      daysCompleted: 5,
      totalDays: 7,
      efficiency: 75
    }
  },
  {
    id: '3',
    clientId: '2',
    missionId: '2',
    missionTitle: 'Completa 5 entrenamientos',
    missionType: 'workout',
    difficulty: 'medium',
    targetValue: 5,
    targetUnit: 'entrenamientos',
    pointsEarned: 100,
    status: 'completed',
    progress: 100,
    startDate: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000),
    endDate: new Date(Date.now() - 31 * 24 * 60 * 60 * 1000),
    completedDate: new Date(Date.now() - 33 * 24 * 60 * 60 * 1000),
    category: 'fitness',
    icon: '💪',
    notes: 'Completó todos los entrenamientos con excelente forma',
    performance: {
      averageIntensity: 8.5,
      totalWorkouts: 5,
      averageDuration: 52,
      bestWorkout: 'Rutina de piernas - 65 min',
      efficiency: 100
    }
  },
  {
    id: '4',
    clientId: '3',
    missionId: '4',
    missionTitle: 'Quema 500 calorías',
    missionType: 'calories',
    difficulty: 'medium',
    targetValue: 500,
    targetUnit: 'calorías',
    pointsEarned: 75,
    status: 'completed',
    progress: 100,
    startDate: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
    endDate: new Date(Date.now() - 13 * 24 * 60 * 60 * 1000),
    completedDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
    category: 'fitness',
    icon: '🔥',
    notes: 'Superó el objetivo quemando 650 calorías en una sesión',
    performance: {
      averageDaily: 520,
      bestDay: 650,
      totalCalories: 3640,
      daysActive: 7,
      efficiency: 130
    }
  },
  {
    id: '5',
    clientId: '2',
    missionTitle: 'Hidratación diaria',
    missionType: 'custom',
    difficulty: 'easy',
    targetValue: 8,
    targetUnit: 'vasos de agua',
    pointsEarned: 0,
    status: 'failed',
    progress: 45,
    startDate: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
    endDate: new Date(Date.now() - 53 * 24 * 60 * 60 * 1000),
    category: 'lifestyle',
    icon: '💧',
    notes: 'Necesita mejorar el hábito de hidratación',
    performance: {
      averageDaily: 3.6,
      bestDay: 6,
      totalGlasses: 25,
      daysCompleted: 2,
      totalDays: 7,
      efficiency: 45
    }
  }
];

export function MissionResultsModal({ isOpen, onClose, clientId, clientName }: MissionResultsModalProps) {
  const [filterStatus, setFilterStatus] = useState<'all' | 'completed' | 'expired' | 'failed'>('all');
  const [filterCategory, setFilterCategory] = useState<'all' | 'fitness' | 'nutrition' | 'lifestyle' | 'challenge'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'points' | 'performance'>('date');

  if (!isOpen) return null;

  // Filtrar resultados
  const filteredResults = mockMissionResults
    .filter(result => !clientId || result.clientId === clientId)
    .filter(result => filterStatus === 'all' || result.status === filterStatus)
    .filter(result => filterCategory === 'all' || result.category === filterCategory)
    .filter(result => result.missionTitle.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => {
      switch (sortBy) {
        case 'points':
          return b.pointsEarned - a.pointsEarned;
        case 'performance':
          return b.progress - a.progress;
        default:
          return b.startDate.getTime() - a.startDate.getTime();
      }
    });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'expired': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      case 'expired': return <Clock className="w-4 h-4" />;
      case 'failed': return <XCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-orange-100 text-orange-800';
      case 'extreme': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Estadísticas generales
  const totalMissions = filteredResults.length;
  const completedMissions = filteredResults.filter(r => r.status === 'completed').length;
  const totalPointsEarned = filteredResults.reduce((sum, r) => sum + r.pointsEarned, 0);
  const averagePerformance = filteredResults.reduce((sum, r) => sum + r.progress, 0) / totalMissions || 0;
  const successRate = totalMissions > 0 ? (completedMissions / totalMissions) * 100 : 0;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Historial de Misiones</h2>
            {clientName && (
              <p className="text-sm text-gray-600 mt-1">Cliente: {clientName}</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {/* Estadísticas generales */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <div className="bg-blue-50 rounded-xl p-4 text-center">
              <div className="flex items-center justify-center mb-2">
                <Target className="w-6 h-6 text-blue-600" />
              </div>
              <p className="text-2xl font-bold text-blue-600">{totalMissions}</p>
              <p className="text-sm text-blue-800">Total Misiones</p>
            </div>

            <div className="bg-green-50 rounded-xl p-4 text-center">
              <div className="flex items-center justify-center mb-2">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <p className="text-2xl font-bold text-green-600">{successRate.toFixed(1)}%</p>
              <p className="text-sm text-green-800">Tasa de Éxito</p>
            </div>

            <div className="bg-purple-50 rounded-xl p-4 text-center">
              <div className="flex items-center justify-center mb-2">
                <Star className="w-6 h-6 text-purple-600" />
              </div>
              <p className="text-2xl font-bold text-purple-600">{totalPointsEarned}</p>
              <p className="text-sm text-purple-800">Puntos Ganados</p>
            </div>

            <div className="bg-orange-50 rounded-xl p-4 text-center">
              <div className="flex items-center justify-center mb-2">
                <TrendingUp className="w-6 h-6 text-orange-600" />
              </div>
              <p className="text-2xl font-bold text-orange-600">{averagePerformance.toFixed(1)}%</p>
              <p className="text-sm text-orange-800">Rendimiento Promedio</p>
            </div>
          </div>

          {/* Filtros y búsqueda */}
          <div className="bg-gray-50 rounded-xl p-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Buscar misiones..."
                />
              </div>

              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as any)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">Todos los estados</option>
                <option value="completed">Completadas</option>
                <option value="expired">Expiradas</option>
                <option value="failed">Fallidas</option>
              </select>

              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value as any)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">Todas las categorías</option>
                <option value="fitness">Fitness</option>
                <option value="nutrition">Nutrición</option>
                <option value="lifestyle">Estilo de vida</option>
                <option value="challenge">Desafío</option>
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="date">Ordenar por fecha</option>
                <option value="points">Ordenar por puntos</option>
                <option value="performance">Ordenar por rendimiento</option>
              </select>
            </div>
          </div>

          {/* Lista de resultados */}
          <div className="space-y-4">
            {filteredResults.map((result) => (
              <div key={result.id} className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start space-x-4">
                    <div className="text-3xl">{result.icon}</div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{result.missionTitle}</h3>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getDifficultyColor(result.difficulty)}`}>
                          {result.difficulty === 'easy' ? 'Fácil' : 
                           result.difficulty === 'medium' ? 'Medio' : 
                           result.difficulty === 'hard' ? 'Difícil' : 'Extremo'}
                        </span>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full flex items-center space-x-1 ${getStatusColor(result.status)}`}>
                          {getStatusIcon(result.status)}
                          <span>
                            {result.status === 'completed' ? 'Completada' :
                             result.status === 'expired' ? 'Expirada' :
                             result.status === 'failed' ? 'Fallida' : result.status}
                          </span>
                        </span>
                      </div>
                      
                      <div className="flex items-center space-x-6 text-sm text-gray-500 mb-3">
                        <div className="flex items-center space-x-1">
                          <Star className="w-4 h-4 text-yellow-500" />
                          <span className="font-medium text-yellow-600">{result.pointsEarned} puntos</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Target className="w-4 h-4" />
                          <span>{result.targetValue} {result.targetUnit}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span>
                            {format(result.startDate, 'dd MMM', { locale: es })} - {format(result.endDate, 'dd MMM', { locale: es })}
                          </span>
                        </div>
                        {result.completedDate && (
                          <div className="flex items-center space-x-1">
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            <span className="text-green-600">
                              Completada {format(result.completedDate, 'dd MMM', { locale: es })}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Barra de progreso */}
                      <div className="mb-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-700">Progreso final</span>
                          <span className="text-sm font-medium text-gray-900">{result.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full transition-all duration-300 ${
                              result.status === 'completed' ? 'bg-green-500' :
                              result.status === 'failed' ? 'bg-red-500' :
                              'bg-yellow-500'
                            }`}
                            style={{ width: `${result.progress}%` }}
                          ></div>
                        </div>
                      </div>

                      {/* Métricas de rendimiento */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        {result.missionType === 'steps' && result.performance && (
                          <>
                            <div className="bg-blue-50 rounded-lg p-3 text-center">
                              <p className="text-sm text-blue-600 font-medium">Promedio Diario</p>
                              <p className="text-lg font-bold text-blue-800">{result.performance.averageDaily?.toLocaleString()}</p>
                              <p className="text-xs text-blue-600">pasos</p>
                            </div>
                            <div className="bg-green-50 rounded-lg p-3 text-center">
                              <p className="text-sm text-green-600 font-medium">Mejor Día</p>
                              <p className="text-lg font-bold text-green-800">{result.performance.bestDay?.toLocaleString()}</p>
                              <p className="text-xs text-green-600">pasos</p>
                            </div>
                            <div className="bg-purple-50 rounded-lg p-3 text-center">
                              <p className="text-sm text-purple-600 font-medium">Días Completados</p>
                              <p className="text-lg font-bold text-purple-800">{result.performance.daysCompleted}/{result.performance.totalDays}</p>
                              <p className="text-xs text-purple-600">días</p>
                            </div>
                          </>
                        )}

                        {result.missionType === 'workout' && result.performance && (
                          <>
                            <div className="bg-blue-50 rounded-lg p-3 text-center">
                              <p className="text-sm text-blue-600 font-medium">Intensidad Promedio</p>
                              <p className="text-lg font-bold text-blue-800">{result.performance.averageIntensity}/10</p>
                              <p className="text-xs text-blue-600">puntuación</p>
                            </div>
                            <div className="bg-green-50 rounded-lg p-3 text-center">
                              <p className="text-sm text-green-600 font-medium">Duración Promedio</p>
                              <p className="text-lg font-bold text-green-800">{result.performance.averageDuration}</p>
                              <p className="text-xs text-green-600">minutos</p>
                            </div>
                            <div className="bg-purple-50 rounded-lg p-3 text-center">
                              <p className="text-sm text-purple-600 font-medium">Entrenamientos</p>
                              <p className="text-lg font-bold text-purple-800">{result.performance.totalWorkouts}</p>
                              <p className="text-xs text-purple-600">completados</p>
                            </div>
                          </>
                        )}

                        {result.missionType === 'calories' && result.performance && (
                          <>
                            <div className="bg-orange-50 rounded-lg p-3 text-center">
                              <p className="text-sm text-orange-600 font-medium">Promedio Diario</p>
                              <p className="text-lg font-bold text-orange-800">{result.performance.averageDaily}</p>
                              <p className="text-xs text-orange-600">calorías</p>
                            </div>
                            <div className="bg-red-50 rounded-lg p-3 text-center">
                              <p className="text-sm text-red-600 font-medium">Mejor Día</p>
                              <p className="text-lg font-bold text-red-800">{result.performance.bestDay}</p>
                              <p className="text-xs text-red-600">calorías</p>
                            </div>
                            <div className="bg-green-50 rounded-lg p-3 text-center">
                              <p className="text-sm text-green-600 font-medium">Eficiencia</p>
                              <p className="text-lg font-bold text-green-800">{result.performance.efficiency}%</p>
                              <p className="text-xs text-green-600">del objetivo</p>
                            </div>
                          </>
                        )}

                        {result.missionType === 'consistency' && result.performance && (
                          <>
                            <div className="bg-orange-50 rounded-lg p-3 text-center">
                              <p className="text-sm text-orange-600 font-medium">Mejor Racha</p>
                              <p className="text-lg font-bold text-orange-800">{result.performance.bestStreak}</p>
                              <p className="text-xs text-orange-600">días consecutivos</p>
                            </div>
                            <div className="bg-green-50 rounded-lg p-3 text-center">
                              <p className="text-sm text-green-600 font-medium">Total Días</p>
                              <p className="text-lg font-bold text-green-800">{result.performance.totalDays}</p>
                              <p className="text-xs text-green-600">completados</p>
                            </div>
                            <div className="bg-blue-50 rounded-lg p-3 text-center">
                              <p className="text-sm text-blue-600 font-medium">Eficiencia</p>
                              <p className="text-lg font-bold text-blue-800">{result.performance.efficiency}%</p>
                              <p className="text-xs text-blue-600">consistencia</p>
                            </div>
                          </>
                        )}
                      </div>

                      {/* Notas del entrenador */}
                      {result.notes && (
                        <div className="bg-gray-50 rounded-lg p-3">
                          <p className="text-sm font-medium text-gray-700 mb-1">Notas del entrenador:</p>
                          <p className="text-sm text-gray-600 italic">"{result.notes}"</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Indicador de rendimiento */}
                  <div className="flex flex-col items-center space-y-2">
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
                      result.progress >= 90 ? 'bg-green-100' :
                      result.progress >= 70 ? 'bg-yellow-100' :
                      result.progress >= 50 ? 'bg-orange-100' : 'bg-red-100'
                    }`}>
                      {result.progress >= 90 ? (
                        <Trophy className={`w-8 h-8 ${
                          result.progress >= 90 ? 'text-green-600' :
                          result.progress >= 70 ? 'text-yellow-600' :
                          result.progress >= 50 ? 'text-orange-600' : 'text-red-600'
                        }`} />
                      ) : (
                        <span className={`text-xl font-bold ${
                          result.progress >= 90 ? 'text-green-600' :
                          result.progress >= 70 ? 'text-yellow-600' :
                          result.progress >= 50 ? 'text-orange-600' : 'text-red-600'
                        }`}>
                          {result.progress}%
                        </span>
                      )}
                    </div>
                    <span className={`text-xs font-medium ${
                      result.progress >= 90 ? 'text-green-600' :
                      result.progress >= 70 ? 'text-yellow-600' :
                      result.progress >= 50 ? 'text-orange-600' : 'text-red-600'
                    }`}>
                      {result.progress >= 90 ? 'Excelente' :
                       result.progress >= 70 ? 'Bueno' :
                       result.progress >= 50 ? 'Regular' : 'Necesita mejorar'}
                    </span>
                  </div>
                </div>
              </div>
            ))}

            {filteredResults.length === 0 && (
              <div className="text-center py-12">
                <Trophy className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No se encontraron resultados</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Intenta ajustar los filtros de búsqueda
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}