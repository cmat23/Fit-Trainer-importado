import React from 'react';
import { X, Calendar, Clock, User, Activity, Dumbbell, Star, Zap } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { mockExercises, mockClients } from '../../data/mockData';

interface WorkoutDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  workout: any;
  userRole: 'trainer' | 'client';
}

export function WorkoutDetailModal({ isOpen, onClose, workout, userRole }: WorkoutDetailModalProps) {
  if (!isOpen || !workout) return null;

  const getExerciseName = (exerciseId: string) => {
    const exercise = mockExercises.find(e => e.id === exerciseId);
    return exercise?.name || 'Ejercicio desconocido';
  };

  const getExerciseDetails = (exerciseId: string) => {
    return mockExercises.find(e => e.id === exerciseId);
  };

  const getClientName = (clientId: string) => {
    const client = mockClients.find(c => c.id === clientId);
    return client?.name || 'Cliente desconocido';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">{workout.name}</h2>
            <div className="flex items-center space-x-4 mt-1 text-sm text-gray-600">
              <div className="flex items-center space-x-1">
                <Calendar className="w-4 h-4" />
                <span>{format(workout.date, 'dd MMM yyyy', { locale: es })}</span>
              </div>
              {workout.duration && (
                <div className="flex items-center space-x-1">
                  <Clock className="w-4 h-4" />
                  <span>{workout.duration} min</span>
                </div>
              )}
              {userRole === 'trainer' && (
                <div className="flex items-center space-x-1">
                  <User className="w-4 h-4" />
                  <span>{getClientName(workout.clientId)}</span>
                </div>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Estado del entrenamiento */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-full ${workout.completed ? 'bg-green-100' : 'bg-gray-100'}`}>
                <Activity className={`w-5 h-5 ${workout.completed ? 'text-green-600' : 'text-gray-400'}`} />
              </div>
              <div>
                <p className="font-medium text-gray-900">
                  {workout.completed ? 'Entrenamiento Completado' : 'Entrenamiento Pendiente'}
                </p>
                <p className="text-sm text-gray-600">
                  {workout.completed 
                    ? `Completado el ${format(workout.date, 'dd MMM yyyy', { locale: es })}`
                    : 'Aún no completado'
                  }
                </p>
              </div>
            </div>
            
            {workout.completed && (workout.feeling || workout.energy) && (
              <div className="flex items-center space-x-4">
                {workout.feeling && (
                  <div className="text-center">
                    <p className="text-xs text-gray-500 mb-1">Sensación</p>
                    <div className="flex space-x-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-4 h-4 ${
                            star <= workout.feeling ? 'text-yellow-500 fill-current' : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                )}
                
                {workout.energy && (
                  <div className="text-center">
                    <p className="text-xs text-gray-500 mb-1">Energía</p>
                    <div className="flex space-x-1">
                      {[1, 2, 3, 4, 5].map((level) => (
                        <Zap
                          key={level}
                          className={`w-4 h-4 ${
                            level <= workout.energy ? 'text-blue-500 fill-current' : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Lista de ejercicios */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Dumbbell className="w-5 h-5 mr-2" />
              Ejercicios ({workout.exercises.length})
            </h3>
            
            <div className="space-y-4">
              {workout.exercises.map((exercise: any, index: number) => {
                const exerciseDetails = getExerciseDetails(exercise.exerciseId);
                return (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-medium text-gray-900">
                          {index + 1}. {getExerciseName(exercise.exerciseId)}
                        </h4>
                        {exerciseDetails && (
                          <p className="text-sm text-gray-600 mt-1">
                            {exerciseDetails.description}
                          </p>
                        )}
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-gray-900">
                          {exercise.sets} series × {exercise.reps} reps
                        </div>
                        {exercise.weight && (
                          <div className="text-sm text-gray-600">
                            {exercise.weight} kg
                          </div>
                        )}
                        {exercise.rest && (
                          <div className="text-xs text-gray-500">
                            Descanso: {exercise.rest}s
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {exerciseDetails && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3 pt-3 border-t border-gray-100">
                        <div>
                          <p className="text-xs font-medium text-gray-700 mb-1">Músculos objetivo:</p>
                          <div className="flex flex-wrap gap-1">
                            {exerciseDetails.targetMuscles.map((muscle, idx) => (
                              <span
                                key={idx}
                                className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full"
                              >
                                {muscle}
                              </span>
                            ))}
                          </div>
                        </div>
                        
                        <div>
                          <p className="text-xs font-medium text-gray-700 mb-1">Categoría:</p>
                          <span className="px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded-full">
                            {exerciseDetails.category}
                          </span>
                        </div>
                      </div>
                    )}
                    
                    {exercise.notes && (
                      <div className="mt-3 pt-3 border-t border-gray-100">
                        <p className="text-xs font-medium text-gray-700 mb-1">Notas:</p>
                        <p className="text-sm text-gray-600 italic">"{exercise.notes}"</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Notas del entrenamiento */}
          {workout.notes && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Notas del Entrenamiento</h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-700">{workout.notes}</p>
              </div>
            </div>
          )}

          {/* Comentarios post-entrenamiento */}
          {workout.completed && workout.notes && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Comentarios Post-Entrenamiento</h3>
              <div className="bg-blue-50 rounded-lg p-4">
                <p className="text-blue-800 italic">"{workout.notes}"</p>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end space-x-3 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cerrar
          </button>
          {!workout.completed && userRole === 'client' && (
            <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
              Marcar como Completado
            </button>
          )}
          {userRole === 'trainer' && (
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Editar Rutina
            </button>
          )}
        </div>
      </div>
    </div>
  );
}