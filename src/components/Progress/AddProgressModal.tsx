import React, { useState } from 'react';
import { X, Weight, Activity, TrendingUp, Ruler } from 'lucide-react';
import { useNotificationActions } from '../../hooks/useNotificationActions';
import { useAuth } from '../../contexts/AuthContext';
import { mockClients } from '../../data/mockData';

interface AddProgressModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (progressData: any) => void;
}

export function AddProgressModal({ isOpen, onClose, onSave }: AddProgressModalProps) {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    weight: '',
    bodyFat: '',
    muscleMass: '',
    measurements: {
      chest: '',
      waist: '',
      hips: '',
      arms: '',
      thighs: ''
    },
    notes: ''
  });

  const { notifyProgressUpdate } = useNotificationActions();
  const { user } = useAuth();

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const progressData = {
      ...formData,
      weight: parseFloat(formData.weight),
      bodyFat: formData.bodyFat ? parseFloat(formData.bodyFat) : undefined,
      muscleMass: formData.muscleMass ? parseFloat(formData.muscleMass) : undefined,
      measurements: {
        chest: formData.measurements.chest ? parseInt(formData.measurements.chest) : undefined,
        waist: formData.measurements.waist ? parseInt(formData.measurements.waist) : undefined,
        hips: formData.measurements.hips ? parseInt(formData.measurements.hips) : undefined,
        arms: formData.measurements.arms ? parseInt(formData.measurements.arms) : undefined,
        thighs: formData.measurements.thighs ? parseInt(formData.measurements.thighs) : undefined,
      },
      date: new Date(formData.date)
    };
    
    onSave(progressData);

    // Notificar al entrenador si es un cliente quien registra progreso
    if (user?.role === 'client' && user.trainerId) {
      const client = mockClients.find(c => c.id === user.id);
      if (client) {
        notifyProgressUpdate(client.name, user.id);
      }
    }
    
    onClose();
    setFormData({
      date: new Date().toISOString().split('T')[0],
      weight: '',
      bodyFat: '',
      muscleMass: '',
      measurements: {
        chest: '',
        waist: '',
        hips: '',
        arms: '',
        thighs: ''
      },
      notes: ''
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Nueva Medición</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Fecha de medición
            </label>
            <input
              type="date"
              required
              value={formData.date}
              onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Weight className="w-4 h-4 inline mr-2" />
                Peso (kg) *
              </label>
              <input
                type="number"
                required
                step="0.1"
                min="30"
                max="300"
                value={formData.weight}
                onChange={(e) => setFormData(prev => ({ ...prev, weight: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="62.5"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Activity className="w-4 h-4 inline mr-2" />
                % Grasa corporal
              </label>
              <input
                type="number"
                step="0.1"
                min="5"
                max="50"
                value={formData.bodyFat}
                onChange={(e) => setFormData(prev => ({ ...prev, bodyFat: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="24.5"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <TrendingUp className="w-4 h-4 inline mr-2" />
                Masa muscular (kg)
              </label>
              <input
                type="number"
                step="0.1"
                min="20"
                max="100"
                value={formData.muscleMass}
                onChange={(e) => setFormData(prev => ({ ...prev, muscleMass: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="47.2"
              />
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              <Ruler className="w-5 h-5 inline mr-2" />
              Medidas corporales (cm)
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pecho
                </label>
                <input
                  type="number"
                  min="50"
                  max="200"
                  value={formData.measurements.chest}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    measurements: { ...prev.measurements, chest: e.target.value }
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="86"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cintura
                </label>
                <input
                  type="number"
                  min="50"
                  max="150"
                  value={formData.measurements.waist}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    measurements: { ...prev.measurements, waist: e.target.value }
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="71"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Caderas
                </label>
                <input
                  type="number"
                  min="60"
                  max="150"
                  value={formData.measurements.hips}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    measurements: { ...prev.measurements, hips: e.target.value }
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="92"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Brazos
                </label>
                <input
                  type="number"
                  min="20"
                  max="60"
                  value={formData.measurements.arms}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    measurements: { ...prev.measurements, arms: e.target.value }
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="29"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Piernas
                </label>
                <input
                  type="number"
                  min="40"
                  max="100"
                  value={formData.measurements.thighs}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    measurements: { ...prev.measurements, thighs: e.target.value }
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="56"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notas adicionales
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Observaciones sobre esta medición..."
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
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Guardar Medición
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}