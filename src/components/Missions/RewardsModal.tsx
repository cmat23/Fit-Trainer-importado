import React from 'react';
import { X, Star, Gift, Crown, Award } from 'lucide-react';

interface RewardsModalProps {
  isOpen: boolean;
  onClose: () => void;
  rewards: any[];
  userPoints: number;
  onClaimReward: (rewardId: string) => void;
}

export function RewardsModal({ isOpen, onClose, rewards, userPoints, onClaimReward }: RewardsModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <Gift className="w-6 h-6 text-purple-600" />
            <h2 className="text-xl font-semibold text-gray-900">Tienda de Recompensas</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-2">
              <Star className="w-5 h-5 text-yellow-500" />
              <span className="text-lg font-semibold text-gray-900">
                Tienes {userPoints.toLocaleString()} puntos
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rewards.map((reward) => (
              <div key={reward.id} className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
                <div className="text-center">
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

                  {reward.restrictions?.minLevel && (
                    <p className="text-xs text-orange-600 mb-4">
                      Requiere nivel {reward.restrictions.minLevel}
                    </p>
                  )}

                  <button
                    onClick={() => onClaimReward(reward.id)}
                    disabled={userPoints < reward.cost}
                    className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
                      userPoints >= reward.cost
                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700'
                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    {userPoints >= reward.cost ? 'Reclamar' : 'Puntos insuficientes'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}