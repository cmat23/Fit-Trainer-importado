import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { mockWorkouts, mockExercises, mockClients } from '../../data/mockData';
import { 
  Dumbbell, 
  Plus, 
  Calendar,
  Clock,
  CheckCircle,
  Circle,
  User,
  Activity,
  Eye,
  Edit,
  Copy,
  Trash2
} from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { AddWorkoutModal } from './AddWorkoutModal';
import { CompleteWorkoutModal } from './CompleteWorkoutModal';
import { WorkoutDetailModal } from './WorkoutDetailModal';
import { EditWorkoutModal } from './EditWorkoutModal';

export function WorkoutsPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'all' | 'completed' | 'pending'>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isCompleteModalOpen, setIsCompleteModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedWorkout, setSelectedWorkout] = useState<any>(null);

  const userWorkouts = user?.role === 'trainer' 
    ? mockWorkouts.filter(w => {
        const client = mockClients.find(c => c.id === w.clientId);
        return client?.trainerId === user.id;
      })
    : mockWorkouts.filter(w => w.clientId === user?.id);

  const filteredWorkouts = userWorkouts.filter(workout => {
    if (activeTab === 'completed') return workout.completed;
    if (activeTab === 'pending') return !workout.completed;
    return true;
  });

  const getExerciseName = (exerciseId: string) => {
    const exercise = mockExercises.find(e => e.id === exerciseId);
    return exercise?.name || 'Ejercicio desconocido';
  };

  const getClientName = (clientId: string) => {
    const client = mockClients.find(c => c.id === clientId);
    return client?.name || 'Cliente desconocido';
  };

  const handleAddWorkout = (workoutData: any) => {
    console.log('Adding new workout:', workoutData);
    alert('Rutina creada exitosamente (funcionalidad de demostración)');
  };

  const handleCompleteWorkout = (workout: any) => {
    setSelectedWorkout(workout);
    setIsCompleteModalOpen(true);
  };

  const handleWorkoutCompletion = (completionData: any) => {
    console.log('Completing workout:', selectedWorkout.id, completionData);
    alert('Entrenamiento marcado como completado (funcionalidad de demostración)');
  };

  const handleViewDetails = (workout: any) => {
    setSelectedWorkout(workout);
    setIsDetailModalOpen(true);
  };

  const handleEditWorkout = (workout: any) => {
    setSelectedWorkout(workout);
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = (workoutData: any) => {
    console.log('Saving edited workout:', workoutData);
    alert('Rutina actualizada exitosamente (funcionalidad de demostración)');
  };

  const handleDuplicateWorkout = (workout: any) => {
    const duplicatedWorkout = {
      ...workout,
      id: Date.now().toString(),
      name: `${workout.name} (Copia)`,
      date: new Date(),
      completed: false,
      duration: undefined,
      feeling: undefined,
      energy: undefined,
      notes: workout.notes
    };
    
    console.log('Duplicating workout:', duplicatedWorkout);
    alert('Rutina duplicada exitosamente (funcionalidad de demostración)');
  };

  const handleDeleteWorkout = (workout: any) => {
    if (window.confirm(`¿Estás seguro de que quieres eliminar "${workout.name}"?`)) {
      console.log('Deleting workout:', workout.id);
      alert('Rutina eliminada exitosamente (funcionalidad de demostración)');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {user?.role === 'trainer' ? 'Rutinas de Clientes' : 'Mis Rutinas'}
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            {user?.role === 'trainer' 
              ? 'Gestiona las rutinas de entrenamiento de tus clientes'
              : 'Sigue tus rutinas de entrenamiento asignadas'
            }
          </p>
        </div>
        {user?.role === 'trainer' && (
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
          >
            <Plus className="w-4 h-4 mr-2" />
            Nueva Rutina
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6" aria-label="Tabs">
            <button
              onClick={() => setActiveTab('all')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'all'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Todas ({userWorkouts.length})
            </button>
            <button
              onClick={() => setActiveTab('completed')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'completed'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Completadas ({userWorkouts.filter(w => w.completed).length})
            </button>
            <button
              onClick={() => setActiveTab('pending')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'pending'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Pendientes ({userWorkouts.filter(w => !w.completed).length})
            </button>
          </nav>
        </div>

        <div className="p-6">
          <div className="space-y-4">
            {filteredWorkouts.map((workout) => (
              <div key={workout.id} className="border border-gray-200 rounded-lg p-6 hover:border-gray-300 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <div className={`p-2 rounded-full ${workout.completed ? 'bg-green-100' : 'bg-gray-100'}`}>
                        {workout.completed ? (
                          <CheckCircle className="w-5 h-5 text-green-600" />
                        ) : (
                          <Circle className="w-5 h-5 text-gray-400" />
                        )}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{workout.name}</h3>
                        {user?.role === 'trainer' && (
                          <div className="flex items-center space-x-2 mt-1">
                            <User className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-600">{getClientName(workout.clientId)}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center space-x-6 text-sm text-gray-600 mb-4">
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
                      <div className="flex items-center space-x-1">
                        <Activity className="w-4 h-4" />
                        <span>{workout.exercises.length} ejercicios</span>
                      </div>
                    </div>

                    {/* Lista de ejercicios */}
                    <div className="space-y-2">
                      {workout.exercises.slice(0, 3).map((exercise: any, index: number) => (
                        <div key={index} className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
                          <div>
                            <span className="text-sm font-medium text-gray-900">
                              {getExerciseName(exercise.exerciseId)}
                            </span>
                          </div>
                          <div className="text-sm text-gray-600">
                            {exercise.sets} series × {exercise.reps} reps
                            {exercise.weight && ` • ${exercise.weight}kg`}
                          </div>
                        </div>
                      ))}
                      {workout.exercises.length > 3 && (
                        <div className="text-center py-2">
                          <span className="text-sm text-gray-500">
                            +{workout.exercises.length - 3} ejercicios más
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Notas y sensaciones */}
                    {workout.completed && (workout.feeling || workout.energy || workout.notes) && (
                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <div className="flex items-center space-x-6 text-sm text-gray-600">
                          {workout.feeling && (
                            <div>
                              <span className="font-medium">Sensación: </span>
                              <span className="text-yellow-600">{'★'.repeat(workout.feeling)}</span>
                            </div>
                          )}
                          {workout.energy && (
                            <div>
                              <span className="font-medium">Energía: </span>
                              <span className="text-blue-600">{'⚡'.repeat(workout.energy)}</span>
                            </div>
                          )}
                        </div>
                        {workout.notes && (
                          <p className="mt-2 text-sm text-gray-700 italic">"{workout.notes}"</p>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Acciones */}
                  <div className="flex flex-col space-y-2 ml-4">
                    {/* Botón principal según estado y rol */}
                    {!workout.completed && user?.role === 'client' && (
                      <button 
                        onClick={() => handleCompleteWorkout(workout)}
                        className="px-3 py-1 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors"
                      >
                        Marcar Completado
                      </button>
                    )}
                    
                    {/* Botones de acción */}
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => handleViewDetails(workout)}
                        className="px-3 py-1 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-1"
                        title="Ver detalles"
                      >
                        <Eye className="w-3 h-3" />
                        <span>Ver</span>
                      </button>
                      
                      {user?.role === 'trainer' && (
                        <>
                          <button 
                            onClick={() => handleEditWorkout(workout)}
                            className="px-3 py-1 text-sm font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors flex items-center space-x-1"
                            title="Editar rutina"
                          >
                            <Edit className="w-3 h-3" />
                            <span>Editar</span>
                          </button>
                          
                          <button 
                            onClick={() => handleDuplicateWorkout(workout)}
                            className="px-3 py-1 text-sm font-medium text-purple-700 bg-purple-50 border border-purple-200 rounded-lg hover:bg-purple-100 transition-colors flex items-center space-x-1"
                            title="Duplicar rutina"
                          >
                            <Copy className="w-3 h-3" />
                            <span>Duplicar</span>
                          </button>
                          
                          <button 
                            onClick={() => handleDeleteWorkout(workout)}
                            className="px-3 py-1 text-sm font-medium text-red-700 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors flex items-center space-x-1"
                            title="Eliminar rutina"
                          >
                            <Trash2 className="w-3 h-3" />
                            <span>Eliminar</span>
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredWorkouts.length === 0 && (
            <div className="text-center py-12">
              <Dumbbell className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                {activeTab === 'completed' ? 'No hay entrenamientos completados' :
                 activeTab === 'pending' ? 'No hay entrenamientos pendientes' :
                 'No hay entrenamientos'}
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                {user?.role === 'trainer' 
                  ? 'Crea una rutina para tus clientes'
                  : 'Tu entrenador te asignará rutinas pronto'
                }
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Modales */}
      <AddWorkoutModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleAddWorkout}
      />

      <CompleteWorkoutModal
        isOpen={isCompleteModalOpen}
        onClose={() => setIsCompleteModalOpen(false)}
        onComplete={handleWorkoutCompletion}
        workoutName={selectedWorkout?.name || ''}
        clientId={selectedWorkout?.clientId}
      />

      <WorkoutDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        workout={selectedWorkout}
        userRole={user?.role || 'client'}
      />

      <EditWorkoutModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleSaveEdit}
        workout={selectedWorkout}
      />
    </div>
  );
}