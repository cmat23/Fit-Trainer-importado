import React from 'react';
import { X, Crown, Award, TrendingUp, Users, Star } from 'lucide-react';

interface LeaderboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  leaderboard: any;
  currentUserId?: string;
}

export function LeaderboardModal({ isOpen, onClose, leaderboard, currentUserId }: LeaderboardModalProps) {
  if (!isOpen || !leaderboard) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <Crown className="w-6 h-6 text-yellow-600" />
            <h2 className="text-xl font-semibold text-gray-900">Ranking Semanal</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          <div className="text-center mb-6">
            <p className="text-sm text-gray-600">
              Compite con otros clientes y escala posiciones ganando puntos
            </p>
          </div>

          <div className="space-y-4">
            {leaderboard.rankings.map((entry: any, index: number) => (
              <div key={entry.clientId} className={`flex items-center space-x-4 p-4 rounded-xl border ${
                entry.clientId === currentUserId ? 'border-purple-200 bg-purple-50' : 'border-gray-200 bg-white'
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
                      {entry.clientId === currentUserId && (
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
                    {entry.badges.map((badge: string, badgeIndex: number) => (
                      <span key={badgeIndex} className="text-lg">{badge}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}