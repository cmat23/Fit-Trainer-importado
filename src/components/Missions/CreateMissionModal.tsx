import React, { useState } from 'react';
import { X, Target, Star, Calendar, Clock, Users, Search } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { mockClients } from '../../data/mockData';

interface CreateMissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (missionData: any) => void;
}

export function CreateMissionModal({ isOpen, onClose, onSave }: CreateMissionModalProps) {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    clientId: '',
    title: '',
    description: '',
    type: 'workout' as 'workout' | 'steps' | 'calories' | 'weight' | 'consistency' | 'custom',
    difficulty: 'medium' as 'easy' | 'medium' | 'hard' | 'extreme',
    category: 'fitness' as 'fitness' | 'nutrition' | 'lifestyle' | 'challenge',
    target: {
      value: 0,
      unit: '',
      timeframe: 'weekly' as 'daily' | 'weekly' | 'monthly' | 'total'
    },
    duration: 7, // días
    icon: '🎯',
    color: 'blue',
    requirements: {
      workoutType: '',
      exerciseId: '',
      minDuration: 0,
      specificDays: [] as string[]
    }
  });

  const [clientSearch, setClientSearch] = useState('');
  const [showClientDropdown, setShowClientDropdown] = useState(false);

  const trainerClients = mockClients.filter(client => client.trainerId === user?.id);
  const filteredClients = trainerClients.filter(client =>
    client.name.toLowerCase().includes(clientSearch.toLowerCase()) ||
    client.email.toLowerCase().includes(clientSearch.toLowerCase())
  );

  if (!isOpen) return null;

  const missionTypes = [
    { id: 'workout', label: 'Entrenamientos', icon: '💪', description: 'Completar entrenamientos específicos' },
    { id: 'steps', label: 'Pasos', icon: '🚶‍♀️', description: 'Caminar una cantidad específica de pasos' },
    { id: 'calories', label: 'Calorías', icon: '🔥', description: 'Quemar calorías durante ejercicios' },
    { id: 'weight', label: 'Peso', icon: '⚖️', description: 'Alcanzar objetivos de peso' },
    { id: 'consistency', label: 'Consistencia', icon: '📅', description: 'Mantener rachas de actividad' },
    { id: 'custom', label: 'Personalizada', icon: '🎯', description: 'Misión completamente personalizada' }
  ];

  const difficultyLevels = [
    { id: 'easy', label: 'Fácil', points: 25, color: 'green', description: 'Objetivos alcanzables para principiantes' },
    { id: 'medium', label: 'Medio', points: 50, color: 'yellow', description: 'Desafío moderado para usuarios regulares' },
    { id: 'hard', label: 'Difícil', points: 100, color: 'orange', description: 'Reto exigente para usuarios avanzados' },
    { id: 'extreme', label: 'Extremo', points: 200, color: 'red', description: 'Desafío épico para los más dedicados' }
  ];

  const categories = [
    { id: 'fitness', label: 'Fitness', icon: '💪', color: 'blue' },
    { id: 'nutrition', label: 'Nutrición', icon: '🥗', color: 'green' },
    { id: 'lifestyle', label: 'Estilo de vida', icon: '🌟', color: 'purple' },
    { id: 'challenge', label: 'Desafío', icon: '🏆', color: 'orange' }
  ];

  const timeframes = [
    { id: 'daily', label: 'Diario', description: 'Debe completarse cada día' },
    { id: 'weekly', label: 'Semanal', description: 'Debe completarse durante la semana' },
    { id: 'monthly', label: 'Mensual', description: 'Debe completarse durante el mes' },
    { id: 'total', label: 'Total', description: 'Debe completarse antes de la fecha límite' }
  ];

  const icons = ['🎯', '💪', '🔥', '⚡', '🏆', '🌟', '🚀', '💎', '👑', '🎖️', '🥇', '🎪'];
  const colors = ['blue', 'green', 'purple', 'orange', 'red', 'pink', 'indigo', 'yellow'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const selectedDifficulty = difficultyLevels.find(d => d.id === formData.difficulty);
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + formData.duration);

    const missionData = {
      ...formData,
      trainerId: user?.id,
      points: selectedDifficulty?.points || 50,
      status: 'active',
      progress: 0,
      startDate: new Date(),
      endDate,
      createdAt: new Date()
    };
    
    onSave(missionData);
    onClose();
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      clientId: '',
      title: '',
      description: '',
      type: 'workout',
      difficulty: 'medium',
      category: 'fitness',
      target: {
        value: 0,
        unit: '',
        timeframe: 'weekly'
      },
      duration: 7,
      icon: '🎯',
      color: 'blue',
      requirements: {
        workoutType: '',
        exerciseId: '',
        minDuration: 0,
        specificDays: []
      }
    });
    setClientSearch('');
  };

  const handleClientSelect = (client: any) => {
    setFormData(prev => ({ ...prev, clientId: client.id }));
    setClientSearch(client.name);
    setShowClientDropdown(false);
  };

  const handleTypeChange = (type: string) => {
    setFormData(prev => ({
      ...prev,
      type: type as any,
      target: {
        ...prev.target,
        unit: type === 'steps' ? 'pasos' :
              type === 'calories' ? 'calorías' :
              type === 'weight' ? 'kg' :
              type === 'workout' ? 'entrenamientos' :
              type === 'consistency' ? 'días' : ''
      }
    }));
  };

  const selectedDifficulty = difficultyLevels.find(d => d.id === formData.difficulty);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Crear Nueva Misión</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Selección de cliente */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Users className="w-4 h-4 inline mr-2" />
              Cliente *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                required
                value={clientSearch}
                onChange={(e) => {
                  setClientSearch(e.target.value);
                  setShowClientDropdown(true);
                }}
                onFocus={() => setShowClientDropdown(true)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                placeholder="Buscar cliente por nombre..."
              />
              
              {showClientDropdown && clientSearch && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  {filteredClients.length > 0 ? (
                    filteredClients.map(client => (
                      <button
                        key={client.id}
                        type="button"
                        onClick={() => handleClientSelect(client)}
                        className="w-full px-4 py-3 text-left hover:bg-gray-50 focus:bg-gray-50 focus:outline-none border-b border-gray-100 last:border-b-0"
                      >
                        <div className="flex items-center space-x-3">
                          {client.avatar ? (
                            <img 
                              src={client.avatar} 
                              alt={client.name}
                              className="w-8 h-8 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                              <Users className="w-4 h-4 text-gray-600" />
                            </div>
                          )}
                          <div>
                            <p className="text-sm font-medium text-gray-900">{client.name}</p>
                            <p className="text-xs text-gray-500">{client.email}</p>
                          </div>
                        </div>
                      </button>
                    ))
                  ) : (
                    <div className="px-4 py-3 text-sm text-gray-500 text-center">
                      No se encontraron clientes
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Información básica */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Título de la misión *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                placeholder="Ej: Camina 10,000 pasos diarios"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Duración (días)
              </label>
              <input
                type="number"
                min="1"
                max="365"
                value={formData.duration}
                onChange={(e) => setFormData(prev => ({ ...prev, duration: parseInt(e.target.value) }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descripción
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              placeholder="Describe los detalles de la misión..."
            />
          </div>

          {/* Tipo de misión */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Tipo de misión *
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {missionTypes.map((type) => (
                <button
                  key={type.id}
                  type="button"
                  onClick={() => handleTypeChange(type.id)}
                  className={`p-4 border-2 rounded-xl transition-all text-left ${
                    formData.type === type.id
                      ? 'border-purple-500 bg-purple-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="text-2xl mb-2">{type.icon}</div>
                  <h3 className="font-medium text-gray-900">{type.label}</h3>
                  <p className="text-xs text-gray-600 mt-1">{type.description}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Objetivo */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Objetivo *
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Cantidad</label>
                <input
                  type="number"
                  min="1"
                  required
                  value={formData.target.value}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    target: { ...prev.target, value: parseInt(e.target.value) }
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="Ej: 10000"
                />
              </div>
              
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Unidad</label>
                <input
                  type="text"
                  value={formData.target.unit}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    target: { ...prev.target, unit: e.target.value }
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="Ej: pasos, calorías, kg"
                />
              </div>
              
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Frecuencia</label>
                <select
                  value={formData.target.timeframe}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    target: { ...prev.target, timeframe: e.target.value as any }
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                >
                  {timeframes.map(tf => (
                    <option key={tf.id} value={tf.id}>{tf.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Dificultad */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Dificultad *
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {difficultyLevels.map((level) => (
                <button
                  key={level.id}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, difficulty: level.id as any }))}
                  className={`p-4 border-2 rounded-xl transition-all text-center ${
                    formData.difficulty === level.id
                      ? 'border-purple-500 bg-purple-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-center space-x-1 mb-2">
                    <Star className={`w-4 h-4 text-${level.color}-500`} />
                    <span className="font-medium text-gray-900">{level.label}</span>
                  </div>
                  <p className="text-sm font-bold text-purple-600">{level.points} pts</p>
                  <p className="text-xs text-gray-600 mt-1">{level.description}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Categoría */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Categoría
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {categories.map((category) => (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, category: category.id as any }))}
                  className={`p-3 border-2 rounded-lg transition-all text-center ${
                    formData.category === category.id
                      ? 'border-purple-500 bg-purple-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="text-xl mb-1">{category.icon}</div>
                  <span className="text-sm font-medium text-gray-900">{category.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Personalización visual */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Icono
              </label>
              <div className="grid grid-cols-6 gap-2">
                {icons.map((icon) => (
                  <button
                    key={icon}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, icon }))}
                    className={`p-3 border-2 rounded-lg transition-all text-center text-xl ${
                      formData.icon === icon
                        ? 'border-purple-500 bg-purple-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {icon}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Color
              </label>
              <div className="grid grid-cols-4 gap-2">
                {colors.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, color }))}
                    className={`p-3 border-2 rounded-lg transition-all ${
                      formData.color === color
                        ? 'border-purple-500'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className={`w-full h-6 bg-${color}-500 rounded`}></div>
                    <span className="text-xs text-gray-600 mt-1 block capitalize">{color}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Vista previa */}
          <div className="bg-gray-50 rounded-xl p-4">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Vista Previa</h3>
            <div className="border border-gray-200 rounded-xl p-4 bg-white">
              <div className="flex items-start space-x-4">
                <div className="text-2xl">{formData.icon}</div>
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h4 className="font-semibold text-gray-900">{formData.title || 'Título de la misión'}</h4>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      selectedDifficulty ? `bg-${selectedDifficulty.color}-100 text-${selectedDifficulty.color}-800` : 'bg-gray-100 text-gray-800'
                    }`}>
                      {selectedDifficulty?.label || 'Medio'}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm mb-3">{formData.description || 'Descripción de la misión'}</p>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-500" />
                      <span className="font-medium text-yellow-600">{selectedDifficulty?.points || 50} puntos</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Target className="w-4 h-4" />
                      <span>{formData.target.value || 0} {formData.target.unit || 'unidades'}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>{formData.duration} días</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
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
              disabled={!formData.clientId || !formData.title || !formData.target.value}
              className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Crear Misión
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}