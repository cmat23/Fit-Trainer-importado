import React, { useState } from 'react';
import { X, User, Dumbbell, CheckCircle } from 'lucide-react';

interface RoleSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRoleSelect: (role: 'trainer' | 'client', additionalInfo?: any) => void;
  userInfo: {
    name: string;
    email: string;
    picture: string;
  };
}

export function RoleSelectionModal({ isOpen, onClose, onRoleSelect, userInfo }: RoleSelectionModalProps) {
  const [selectedRole, setSelectedRole] = useState<'trainer' | 'client' | null>(null);
  const [additionalInfo, setAdditionalInfo] = useState({
    age: '',
    height: '',
    weight: '',
    goals: [] as string[],
    experience: '',
    specialization: '',
    certification: ''
  });

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (!selectedRole) return;
    
    const info = selectedRole === 'client' ? {
      age: parseInt(additionalInfo.age) || undefined,
      height: parseInt(additionalInfo.height) || undefined,
      weight: parseFloat(additionalInfo.weight) || undefined,
      goals: additionalInfo.goals
    } : {
      experience: additionalInfo.experience,
      specialization: additionalInfo.specialization,
      certification: additionalInfo.certification
    };

    onRoleSelect(selectedRole, info);
  };

  const addGoal = (goal: string) => {
    if (!additionalInfo.goals.includes(goal)) {
      setAdditionalInfo(prev => ({
        ...prev,
        goals: [...prev.goals, goal]
      }));
    }
  };

  const removeGoal = (goal: string) => {
    setAdditionalInfo(prev => ({
      ...prev,
      goals: prev.goals.filter(g => g !== goal)
    }));
  };

  const commonGoals = [
    'Perder peso',
    'Ganar músculo',
    'Mejorar resistencia',
    'Tonificar',
    'Mejorar fuerza',
    'Rehabilitación',
    'Mantener forma física'
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Completa tu perfil</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {/* User Info */}
          <div className="flex items-center space-x-4 mb-6 p-4 bg-gray-50 rounded-lg">
            <img 
              src={userInfo.picture} 
              alt={userInfo.name}
              className="w-16 h-16 rounded-full object-cover"
            />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{userInfo.name}</h3>
              <p className="text-sm text-gray-600">{userInfo.email}</p>
            </div>
          </div>

          {/* Role Selection */}
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">¿Cuál es tu rol?</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={() => setSelectedRole('client')}
                className={`p-6 border-2 rounded-xl transition-all ${
                  selectedRole === 'client'
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <User className="w-8 h-8 text-blue-600" />
                  {selectedRole === 'client' && (
                    <CheckCircle className="w-6 h-6 text-blue-600" />
                  )}
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">Cliente</h4>
                <p className="text-sm text-gray-600">
                  Busco un entrenador personal para alcanzar mis objetivos de fitness
                </p>
              </button>

              <button
                onClick={() => setSelectedRole('trainer')}
                className={`p-6 border-2 rounded-xl transition-all ${
                  selectedRole === 'trainer'
                    ? 'border-purple-500 bg-purple-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <Dumbbell className="w-8 h-8 text-purple-600" />
                  {selectedRole === 'trainer' && (
                    <CheckCircle className="w-6 h-6 text-purple-600" />
                  )}
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">Entrenador</h4>
                <p className="text-sm text-gray-600">
                  Soy un profesional del fitness que entrena y guía a clientes
                </p>
              </button>
            </div>
          </div>

          {/* Additional Information */}
          {selectedRole === 'client' && (
            <div className="space-y-4">
              <h4 className="text-lg font-medium text-gray-900">Información adicional</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Edad
                  </label>
                  <input
                    type="number"
                    min="16"
                    max="100"
                    value={additionalInfo.age}
                    onChange={(e) => setAdditionalInfo(prev => ({ ...prev, age: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="28"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Altura (cm)
                  </label>
                  <input
                    type="number"
                    min="100"
                    max="250"
                    value={additionalInfo.height}
                    onChange={(e) => setAdditionalInfo(prev => ({ ...prev, height: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="165"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Peso (kg)
                  </label>
                  <input
                    type="number"
                    min="30"
                    max="300"
                    step="0.1"
                    value={additionalInfo.weight}
                    onChange={(e) => setAdditionalInfo(prev => ({ ...prev, weight: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="62.5"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Objetivos de fitness
                </label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {commonGoals.map((goal) => (
                    <button
                      key={goal}
                      type="button"
                      onClick={() => addGoal(goal)}
                      className={`px-3 py-1 text-sm rounded-full transition-colors ${
                        additionalInfo.goals.includes(goal)
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {goal}
                    </button>
                  ))}
                </div>
                <div className="flex flex-wrap gap-2">
                  {additionalInfo.goals.map((goal) => (
                    <span
                      key={goal}
                      className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                    >
                      {goal}
                      <button
                        type="button"
                        onClick={() => removeGoal(goal)}
                        className="ml-2 text-blue-600 hover:text-blue-800"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {selectedRole === 'trainer' && (
            <div className="space-y-4">
              <h4 className="text-lg font-medium text-gray-900">Información profesional</h4>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Años de experiencia
                </label>
                <select
                  value={additionalInfo.experience}
                  onChange={(e) => setAdditionalInfo(prev => ({ ...prev, experience: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                >
                  <option value="">Seleccionar</option>
                  <option value="0-1">Menos de 1 año</option>
                  <option value="1-3">1-3 años</option>
                  <option value="3-5">3-5 años</option>
                  <option value="5-10">5-10 años</option>
                  <option value="10+">Más de 10 años</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Especialización
                </label>
                <select
                  value={additionalInfo.specialization}
                  onChange={(e) => setAdditionalInfo(prev => ({ ...prev, specialization: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                >
                  <option value="">Seleccionar</option>
                  <option value="general">Entrenamiento General</option>
                  <option value="strength">Entrenamiento de Fuerza</option>
                  <option value="cardio">Cardio y Resistencia</option>
                  <option value="weight-loss">Pérdida de Peso</option>
                  <option value="bodybuilding">Culturismo</option>
                  <option value="functional">Entrenamiento Funcional</option>
                  <option value="rehabilitation">Rehabilitación</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Certificaciones
                </label>
                <input
                  type="text"
                  value={additionalInfo.certification}
                  onChange={(e) => setAdditionalInfo(prev => ({ ...prev, certification: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="Ej: ACSM, NASM, ACE..."
                />
              </div>
            </div>
          )}

          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200 mt-6">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleSubmit}
              disabled={!selectedRole}
              className={`px-4 py-2 text-white rounded-lg transition-colors ${
                selectedRole
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'
                  : 'bg-gray-400 cursor-not-allowed'
              }`}
            >
              Completar Registro
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}