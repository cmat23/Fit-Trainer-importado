import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { mockMissions, mockClientPoints, mockPointsTransactions, mockRewards, mockLeaderboard } from '../../data/mockData';
import { 
  Target, 
  Plus, 
  Trophy, 
  Star, 
  Flame, 
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  Pause,
  Play,
  Gift,
  Crown,
  TrendingUp,
  Award,
  Zap,
  Users
} from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { CreateMissionModal } from './CreateMissionModal';
import { RewardsModal } from './RewardsModal';
import { LeaderboardModal } from './LeaderboardModal';

export function MissionsPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'missions' | 'rewards' | 'leaderboard'>('missions');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isRewardsModalOpen, setIsRewardsModalOpen] = useState(false);
  const [isLeaderboardModalOpen, setIsLeaderboardModalOpen] = useState(false);

  // Filtrar datos según el rol del usuario
  const userMissions = user?.role === 'trainer' 
    ? mockMissions.filter(m => m.trainerId === user.id)
    : mockMissions.filter(m => m.clientId === user?.id);

  const userPoints = user?.role === 'client' 
    ? mockClientPoints.find(cp => cp.clientId === user.id)
    : null;

  const recentTransactions = user?.role === 'client'
    ? mockPointsTransactions.filter(t => t.clientId === user.id).slice(0, 5)
    : [];

  const availableRewards = mockRewards.filter(r => r.isActive);
  const weeklyLeaderboard = mockLeaderboard.find(l => l.type === 'weekly');

  const handleCreateMission = (missionData: any) => {
    console.log('Creating mission:', missionData);
    alert('Misión creada exitosamente (funcionalidad de demostración)');
  };

  const handleMissionAction = (missionId: string, action: 'pause' | 'resume' | 'complete' | 'delete') => {
    console.log(`Mission ${missionId} action: ${action}`);
    alert(`Misión ${action === 'pause' ? 'pausada' : action === 'resume' ? 'reanudada' : action === 'complete' ? 'completada' : 'eliminada'} (funcionalidad de demostración)`);
  };

  const handleClaimReward = (rewardId: string) => {
    console.log('Claiming reward:', rewardId);
    alert('Recompensa reclamada exitosamente (funcionalidad de demostración)');
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'expired': return 'bg-red-100 text-red-800';
      case 'paused': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <Play className="w-4 h-4" />;
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      case 'expired': return <XCircle className="w-4 h-4" />;
      case 'paused': return <Pause className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const calculateProgress = (mission: any) => {
    return Math.min(mission.progress, 100);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {user?.role === 'trainer' ? 'Sistema de Incentivos' : 'Mis Misiones y Recompensas'}
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            {user?.role === 'trainer' 
              ? 'Crea misiones y gestiona el sistema de puntos para motivar a tus clientes'
              : 'Completa misiones, gana puntos y desbloquea recompensas'
            }
          </p>
        </div>
        {user?.role === 'trainer' && (
          <button 
            onClick={() => setIsCreateModalOpen(true)}
            className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-200"
          >
            <Plus className="w-4 h-4 mr-2" />
            Nueva Misión
          </button>
        )}
      </div>

      {/* Stats para clientes */}
      {user?.role === 'client' && userPoints && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100">Puntos Totales</p>
                <p className="text-3xl font-bold">{userPoints.totalPoints.toLocaleString()}</p>
              </div>
              <Star className="w-8 h-8 text-purple-200" />
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100">Nivel Actual</p>
                <p className="text-3xl font-bold">{userPoints.currentLevel}</p>
                <p className="text-xs text-blue-200">{userPoints.pointsToNextLevel} pts al siguiente</p>
              </div>
              <Trophy className="w-8 h-8 text-blue-200" />
            </div>
          </div>

          <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100">Racha Actual</p>
                <p className="text-3xl font-bold">{userPoints.streak.current}</p>
                <p className="text-xs text-orange-200">Récord: {userPoints.streak.longest} días</p>
              </div>
              <Flame className="w-8 h-8 text-orange-200" />
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100">Esta Semana</p>
                <p className="text-3xl font-bold">{userPoints.weeklyPoints}</p>
                <p className="text-xs text-green-200">pts ganados</p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-200" />
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6" aria-label="Tabs">
            <button
              onClick={() => setActiveTab('missions')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'missions'
                  ? 'border-purple-500 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <Target className="w-4 h-4 mr-2 inline" />
              Misiones ({userMissions.length})
            </button>
            
            {user?.role === 'client' && (
              <>
                <button
                  onClick={() => setActiveTab('rewards')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === 'rewards'
                      ? 'border-purple-500 text-purple-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Gift className="w-4 h-4 mr-2 inline" />
                  Recompensas ({availableRewards.length})
                </button>
                
                <button
                  onClick={() => setActiveTab('leaderboard')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === 'leaderboard'
                      ? 'border-purple-500 text-purple-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Crown className="w-4 h-4 mr-2 inline" />
                  Ranking
                </button>
              </>
            )}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'missions' && (
            <div className="space-y-6">
              {/* Filtros para entrenadores */}
              {user?.role === 'trainer' && (
                <div className="flex items-center space-x-4">
                  <select className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500">
                    <option value="all">Todos los clientes</option>
                    <option value="ana">Ana García</option>
                    <option value="miguel">Miguel Rodríguez</option>
                  </select>
                  
                  <select className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500">
                    <option value="all">Todos los estados</option>
                    <option value="active">Activas</option>
                    <option value="completed">Completadas</option>
                    <option value="expired">Expiradas</option>
                  </select>
                </div>
              )}

              {/* Lista de misiones */}
              <div className="grid gap-6">
                {userMissions.map((mission) => (
                  <div key={mission.id} className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start space-x-4">
                        <div className="text-3xl">{mission.icon}</div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="text-lg font-semibold text-gray-900">{mission.title}</h3>
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getDifficultyColor(mission.difficulty)}`}>
                              {mission.difficulty === 'easy' ? 'Fácil' : 
                               mission.difficulty === 'medium' ? 'Medio' : 
                               mission.difficulty === 'hard' ? 'Difícil' : 'Extremo'}
                            </span>
                            <span className={`px-2 py-1 text-xs font-medium rounded-full flex items-center space-x-1 ${getStatusColor(mission.status)}`}>
                              {getStatusIcon(mission.status)}
                              <span>
                                {mission.status === 'active' ? 'Activa' :
                                 mission.status === 'completed' ? 'Completada' :
                                 mission.status === 'expired' ? 'Expirada' : 'Pausada'}
                              </span>
                            </span>
                          </div>
                          <p className="text-gray-600 mb-3">{mission.description}</p>
                          
                          <div className="flex items-center space-x-6 text-sm text-gray-500">
                            <div className="flex items-center space-x-1">
                              <Star className="w-4 h-4 text-yellow-500" />
                              <span className="font-medium text-yellow-600">{mission.points} puntos</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Target className="w-4 h-4" />
                              <span>{mission.target.value} {mission.target.unit}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Calendar className="w-4 h-4" />
                              <span>Hasta {format(mission.endDate, 'dd MMM', { locale: es })}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Acciones */}
                      <div className="flex items-center space-x-2">
                        {user?.role === 'trainer' && (
                          <>
                            {mission.status === 'active' && (
                              <button
                                onClick={() => handleMissionAction(mission.id, 'pause')}
                                className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-full transition-colors"
                                title="Pausar misión"
                              >
                                <Pause className="w-4 h-4" />
                              </button>
                            )}
                            {mission.status === 'paused' && (
                              <button
                                onClick={() => handleMissionAction(mission.id, 'resume')}
                                className="p-2 text-green-600 hover:text-green-800 hover:bg-green-100 rounded-full transition-colors"
                                title="Reanudar misión"
                              >
                                <Play className="w-4 h-4" />
                              </button>
                            )}
                            <button
                              onClick={() => handleMissionAction(mission.id, 'delete')}
                              className="p-2 text-red-600 hover:text-red-800 hover:bg-red-100 rounded-full transition-colors"
                              title="Eliminar misión"
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Barra de progreso */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700">Progreso</span>
                        <span className="text-sm font-medium text-gray-900">{calculateProgress(mission)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div 
                          className={`h-3 rounded-full transition-all duration-300 ${
                            mission.status === 'completed' ? 'bg-green-500' :
                            mission.status === 'expired' ? 'bg-red-500' :
                            'bg-gradient-to-r from-purple-500 to-pink-500'
                          }`}
                          style={{ width: `${calculateProgress(mission)}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Información adicional */}
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          mission.category === 'fitness' ? 'bg-blue-100 text-blue-800' :
                          mission.category === 'nutrition' ? 'bg-green-100 text-green-800' :
                          mission.category === 'lifestyle' ? 'bg-purple-100 text-purple-800' :
                          'bg-orange-100 text-orange-800'
                        }`}>
                          {mission.category === 'fitness' ? 'Fitness' :
                           mission.category === 'nutrition' ? 'Nutrición' :
                           mission.category === 'lifestyle' ? 'Estilo de vida' : 'Desafío'}
                        </span>
                        
                        {mission.completedAt && (
                          <span className="text-green-600 flex items-center space-x-1">
                            <CheckCircle className="w-4 h-4" />
                            <span>Completada el {format(mission.completedAt, 'dd MMM', { locale: es })}</span>
                          </span>
                        )}
                      </div>

                      <div className="text-gray-500">
                        Creada {format(mission.createdAt, 'dd MMM', { locale: es })}
                      </div>
                    </div>
                  </div>
                ))}

                {userMissions.length === 0 && (
                  <div className="text-center py-12">
                    <Target className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">
                      {user?.role === 'trainer' ? 'No hay misiones creadas' : 'No tienes misiones asignadas'}
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      {user?.role === 'trainer' 
                        ? 'Crea tu primera misión para motivar a tus clientes'
                        : 'Tu entrenador te asignará misiones pronto'
                      }
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'rewards' && user?.role === 'client' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Recompensas Disponibles</h3>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Star className="w-4 h-4 text-yellow-500" />
                  <span>Tienes {userPoints?.totalPoints || 0} puntos</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {availableRewards.map((reward) => (
                  <div key={reward.id} className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
                    <div className="text-center mb-4">
                      <div className="text-4xl mb-3">{reward.icon}</div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{reward.name}</h3>
                      <p className="text-sm text-gray-600 mb-4">{reward.description}</p>
                      
                      <div className="flex items-center justify-center space-x-2 mb-4">
                        <Star className="w-5 h-5 text-yellow-500" />
                        <span className="text-xl font-bold text-gray-900">{reward.cost}</span>
                        <span className="text-sm text-gray-500">puntos</span>
                      </div>

                      <div className="flex flex-wrap justify-center gap-2 mb-4">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          reward.type === 'physical' ? 'bg-blue-100 text-blue-800' :
                          reward.type === 'digital' ? 'bg-green-100 text-green-800' :
                          reward.type === 'experience' ? 'bg-purple-100 text-purple-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {reward.type === 'physical' ? 'Físico' :
                           reward.type === 'digital' ? 'Digital' :
                           reward.type === 'experience' ? 'Experiencia' : 'Privilegio'}
                        </span>
                        
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          reward.category === 'gear' ? 'bg-gray-100 text-gray-800' :
                          reward.category === 'nutrition' ? 'bg-green-100 text-green-800' :
                          reward.category === 'training' ? 'bg-blue-100 text-blue-800' :
                          'bg-purple-100 text-purple-800'
                        }`}>
                          {reward.category === 'gear' ? 'Equipo' :
                           reward.category === 'nutrition' ? 'Nutrición' :
                           reward.category === 'training' ? 'Entrenamiento' : 'Estilo de vida'}
                        </span>
                      </div>

                      {reward.stock && (
                        <p className="text-xs text-gray-500 mb-4">
                          Stock disponible: {reward.stock}
                        </p>
                      )}

                      <button
                        onClick={() => handleClaimReward(reward.id)}
                        disabled={!userPoints || userPoints.totalPoints < reward.cost}
                        className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
                          userPoints && userPoints.totalPoints >= reward.cost
                            ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700'
                            : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        }`}
                      >
                        {userPoints && userPoints.totalPoints >= reward.cost ? 'Reclamar' : 'Puntos insuficientes'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'leaderboard' && user?.role === 'client' && weeklyLeaderboard && (
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Ranking Semanal</h3>
                <p className="text-sm text-gray-600">Compite con otros clientes y escala posiciones</p>
              </div>

              <div className="space-y-4">
                {weeklyLeaderboard.rankings.map((entry, index) => (
                  <div key={entry.clientId} className={`flex items-center space-x-4 p-4 rounded-xl border ${
                    entry.clientId === user?.id ? 'border-purple-200 bg-purple-50' : 'border-gray-200 bg-white'
                  }`}>
                    <div className="flex-shrink-0">
                      {entry.rank === 1 ? (
                        <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center">
                          <Crown className="w-6 h-6 text-white" />
                        </div>
                      ) : entry.rank === 2 ? (
                        <div className="w-12 h-12 bg-gradient-to-r from-gray-300 to-gray-500 rounded-full flex items-center justify-center">
                          <Award className="w-6 h-6 text-white" />
                        </div>
                      ) : entry.rank === 3 ? (
                        <div className="w-12 h-12 bg-gradient-to-r from-orange-400 to-orange-600 rounded-full flex items-center justify-center">
                          <Award className="w-6 h-6 text-white" />
                        </div>
                      ) : (
                        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                          <span className="text-lg font-bold text-gray-600">#{entry.rank}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex-1 flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        {entry.clientAvatar ? (
                          <img 
                            src={entry.clientAvatar} 
                            alt={entry.clientName}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                            <Users className="w-5 h-5 text-gray-600" />
                          </div>
                        )}
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <h4 className="font-medium text-gray-900">{entry.clientName}</h4>
                          {entry.clientId === user?.id && (
                            <span className="px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded-full">Tú</span>
                          )}
                        </div>
                        <div className="flex items-center space-x-2 mt-1">
                          <Star className="w-4 h-4 text-yellow-500" />
                          <span className="text-sm font-medium text-gray-900">{entry.points} puntos</span>
                          {entry.change !== 0 && (
                            <span className={`text-xs flex items-center space-x-1 ${
                              entry.change > 0 ? 'text-green-600' : 'text-red-600'
                            }`}>
                              <TrendingUp className={`w-3 h-3 ${entry.change < 0 ? 'rotate-180' : ''}`} />
                              <span>{Math.abs(entry.change)}</span>
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center space-x-1">
                        {entry.badges.map((badge, badgeIndex) => (
                          <span key={badgeIndex} className="text-lg">{badge}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Transacciones recientes para clientes */}
              {user?.role === 'client' && recentTransactions.length > 0 && (
                <div className="mt-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Actividad Reciente</h3>
                  <div className="space-y-3">
                    {recentTransactions.map((transaction) => (
                      <div key={transaction.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className={`p-2 rounded-full ${
                            transaction.type === 'earned' ? 'bg-green-100' :
                            transaction.type === 'bonus' ? 'bg-blue-100' :
                            transaction.type === 'penalty' ? 'bg-red-100' :
                            'bg-purple-100'
                          }`}>
                            {transaction.type === 'earned' ? (
                              <Star className={`w-4 h-4 ${
                                transaction.type === 'earned' ? 'text-green-600' :
                                transaction.type === 'bonus' ? 'text-blue-600' :
                                transaction.type === 'penalty' ? 'text-red-600' :
                                'text-purple-600'
                              }`} />
                            ) : transaction.type === 'bonus' ? (
                              <Zap className="w-4 h-4 text-blue-600" />
                            ) : transaction.type === 'penalty' ? (
                              <XCircle className="w-4 h-4 text-red-600" />
                            ) : (
                              <Gift className="w-4 h-4 text-purple-600" />
                            )}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">{transaction.reason}</p>
                            <p className="text-xs text-gray-500">{transaction.description}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={`text-sm font-bold ${
                            transaction.type === 'penalty' ? 'text-red-600' : 'text-green-600'
                          }`}>
                            {transaction.type === 'penalty' ? '-' : '+'}{transaction.points} pts
                          </p>
                          <p className="text-xs text-gray-500">
                            {format(transaction.timestamp, 'dd MMM HH:mm', { locale: es })}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Modales */}
      <CreateMissionModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSave={handleCreateMission}
      />

      <RewardsModal
        isOpen={isRewardsModalOpen}
        onClose={() => setIsRewardsModalOpen(false)}
        rewards={availableRewards}
        userPoints={userPoints?.totalPoints || 0}
        onClaimReward={handleClaimReward}
      />

      <LeaderboardModal
        isOpen={isLeaderboardModalOpen}
        onClose={() => setIsLeaderboardModalOpen(false)}
        leaderboard={weeklyLeaderboard}
        currentUserId={user?.id}
      />
    </div>
  );
}