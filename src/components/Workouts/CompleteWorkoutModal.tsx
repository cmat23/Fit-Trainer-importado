import React, { useState } from 'react';
import { X, Star, Zap, MessageSquare } from 'lucide-react';
import { useNotificationActions } from '../../hooks/useNotificationActions';
import { useAuth } from '../../contexts/AuthContext';
import { mockClients, mockUsers } from '../../data/mockData';

interface CompleteWorkoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (completionData: any) => void;
  workoutName: string;
  clientId?: string;
}

export function CompleteWorkoutModal({ isOpen, onClose, onComplete, workoutName, clientId }: CompleteWorkoutModalProps) {
  const [formData, setFormData] = useState({
    feeling: 0,
    energy: 0,
    notes: '',
    duration: ''
  });

  const { notifyWorkoutCompleted } = useNotificationActions();
  const { user } = useAuth();

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const completionData = {
      ...formData,
      duration: formData.duration ? parseInt(formData.duration) : undefined
    };
    
    onComplete(completionData);

    // Enviar notificación al entrenador si es un cliente quien completa
    if (user?.role === 'client' && user.trainerId && clientId) {
      const client = mockClients.find(c => c.id === clientId);
      if (client) {
        notifyWorkoutCompleted(client.name, workoutName, clientId);
      }
    }

    onClose();
    setFormData({
      feeling: 0,
      energy: 0,
      notes: '',
      duration: ''
    });
  };

  const StarRating = ({ value, onChange, label }: { value: number; onChange: (value: number) => void; label: string }) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onChange(star)}
            className={`p-1 rounded transition-colors ${
              star <= value ? 'text-yellow-500' : 'text-gray-300 hover:text-yellow-400'
            }`}
          >
            <Star className="w-6 h-6 fill-current" />
          </button>
        ))}
      </div>
    </div>
  );

  const EnergyRating = ({ value, onChange }: { value: number; onChange: (value: number) => void }) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">Nivel de energía</label>
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((level) => (
          <button
            key={level}
            type="button"
            onClick={() => onChange(level)}
            className={`p-1 rounded transition-colors ${
              level <= value ? 'text-blue-500' : 'text-gray-300 hover:text-blue-400'
            }`}
          >
            <Zap className="w-6 h-6 fill-current" />
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-md w-full">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Completar Entrenamiento</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">{workoutName}</h3>
            <p className="text-sm text-gray-600">¿Cómo te fue con este entrenamiento?</p>
          </div>

          <StarRating
            value={formData.feeling}
            onChange={(value) => setFormData(prev => ({ ...prev, feeling: value }))}
            label="¿Cómo te sentiste?"
          />

          <EnergyRating
            value={formData.energy}
            onChange={(value) => setFormData(prev => ({ ...prev, energy: value }))}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Duración (minutos)
            </label>
            <input
              type="number"
              min="10"
              max="180"
              value={formData.duration}
              onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="45"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <MessageSquare className="w-4 h-4 inline mr-2" />
              Notas y comentarios
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="¿Cómo te sentiste? ¿Algún ejercicio fue difícil? ¿Necesitas ajustes?"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Marcar como Completado
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}