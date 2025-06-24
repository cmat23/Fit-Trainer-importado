import React, { useState, useEffect } from 'react';
import { X, Plus, Dumbbell, Clock, User, Save } from 'lucide-react';
import { mockExercises, mockClients } from '../../data/mockData';
import { useAuth } from '../../contexts/AuthContext';

interface EditWorkoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (workoutData: any) => void;
  workout: any;
}

export function EditWorkoutModal({ isOpen, onClose, onSave, workout }: EditWorkoutModalProps) {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    clientId: '',
    date: '',
    exercises: [] as any[],
    notes: ''
  });

  const [currentExercise, setCurrentExercise] = useState({
    exerciseId: '',
    sets: '',
    reps: '',
    weight: '',
    rest: ''
  });

  const trainerClients = mockClients.filter(client => client.trainerId === user?.id);

  useEffect(() => {
    if (workout && isOpen) {
      setFormData({
        name: workout.name || '',
        clientId: workout.clientId || '',
        date: workout.date ? new Date(workout.date).toISOString().split('T')[0] : '',
        exercises: workout.exercises || [],
        notes: workout.notes || ''
      });
    }
  }, [workout, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const workoutData = {
      ...workout,
      ...formData,
      date: new Date(formData.date),
      exercises: formData.exercises.map(ex => ({
        ...ex,
        sets: parseInt(ex.sets),
        weight: ex.weight ? parseFloat(ex.weight) : undefined,
        rest: ex.rest ? parseInt(ex.rest) : undefined
      }))
    };
    
    onSave(workoutData);
    onClose();
  };

  const addExercise = () => {
    if (currentExercise.exerciseId && currentExercise.sets && currentExercise.reps) {
      setFormData(prev => ({
        ...prev,
        exercises: [...prev.exercises, { ...currentExercise }]
      }));
      setCurrentExercise({
        exerciseId: '',
        sets: '',
        reps: '',
        weight: '',
        rest: ''
      });
    }
  };

  const removeExercise = (index: number) => {
    setFormData(prev => ({
      ...prev,
      exercises: prev.exercises.filter((_, i) => i !== index)
    }));
  };

  const updateExercise = (index: number, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      exercises: prev.exercises.map((ex, i) => 
        i === index ? { ...ex, [field]: value } : ex
      )
    }));
  };

  const getExerciseName = (exerciseId: string) => {
    const exercise = mockExercises.find(e => e.id === exerciseId);
    return exercise?.name || 'Ejercicio desconocido';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Editar Rutina de Entrenamiento</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Dumbbell className="w-4 h-4 inline mr-2" />
                Nombre de la rutina *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Ej: Rutina de Fuerza - Día 1"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <User className="w-4 h-4 inline mr-2" />
                Cliente *
              </label>
              <select
                required
                value={formData.clientId}
                onChange={(e) => setFormData(prev => ({ ...prev, clientId: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Seleccionar cliente</option>
                {trainerClients.map(client => (
                  <option key={client.id} value={client.id}>{client.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Clock className="w-4 h-4 inline mr-2" />
                Fecha programada *
              </label>
              <input
                type="date"
                required
                value={formData.date}
                onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Ejercicios</h3>
            
            {/* Lista de ejercicios existentes */}
            <div className="space-y-3 mb-4">
              {formData.exercises.map((exercise, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium text-gray-900">
                      {getExerciseName(exercise.exerciseId)}
                    </h4>
                    <button
                      type="button"
                      onClick={() => removeExercise(index)}
                      className="p-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-4 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Series</label>
                      <input
                        type="number"
                        min="1"
                        max="10"
                        value={exercise.sets}
                        onChange={(e) => updateExercise(index, 'sets', e.target.value)}
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Reps</label>
                      <input
                        type="text"
                        value={exercise.reps}
                        onChange={(e) => updateExercise(index, 'reps', e.target.value)}
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                        placeholder="8-12"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Peso (kg)</label>
                      <input
                        type="number"
                        step="0.5"
                        min="0"
                        value={exercise.weight || ''}
                        onChange={(e) => updateExercise(index, 'weight', e.target.value)}
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Descanso (s)</label>
                      <input
                        type="number"
                        min="30"
                        max="300"
                        value={exercise.rest || ''}
                        onChange={(e) => updateExercise(index, 'rest', e.target.value)}
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Agregar nuevo ejercicio */}
            <div className="bg-blue-50 rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-700 mb-3">Agregar ejercicio</h4>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                <div>
                  <select
                    value={currentExercise.exerciseId}
                    onChange={(e) => setCurrentExercise(prev => ({ ...prev, exerciseId: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Seleccionar ejercicio</option>
                    {mockExercises.map(exercise => (
                      <option key={exercise.id} value={exercise.id}>{exercise.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={currentExercise.sets}
                    onChange={(e) => setCurrentExercise(prev => ({ ...prev, sets: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Series"
                  />
                </div>
                <div>
                  <input
                    type="text"
                    value={currentExercise.reps}
                    onChange={(e) => setCurrentExercise(prev => ({ ...prev, reps: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Reps (ej: 8-12)"
                  />
                </div>
                <div>
                  <input
                    type="number"
                    step="0.5"
                    min="0"
                    value={currentExercise.weight}
                    onChange={(e) => setCurrentExercise(prev => ({ ...prev, weight: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Peso (kg)"
                  />
                </div>
                <div className="flex space-x-2">
                  <input
                    type="number"
                    min="30"
                    max="300"
                    value={currentExercise.rest}
                    onChange={(e) => setCurrentExercise(prev => ({ ...prev, rest: e.target.value }))}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Descanso (seg)"
                  />
                  <button
                    type="button"
                    onClick={addExercise}
                    className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
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
              placeholder="Instrucciones especiales, objetivos de la sesión..."
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
              disabled={formData.exercises.length === 0}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
            >
              <Save className="w-4 h-4" />
              <span>Guardar Cambios</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}