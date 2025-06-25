import React, { useState } from 'react';
import { X, Plus, Apple, Clock, Calculator, Target, Search, Trash2 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface AssignDietModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (dietData: any) => void;
  clientId: string;
  clientName: string;
}

interface Meal {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  description?: string;
  time?: string;
}

interface DietPlan {
  name: string;
  startDate: string;
  endDate: string;
  targetCalories: number;
  targetProtein: number;
  targetCarbs: number;
  targetFat: number;
  meals: {
    breakfast: Meal[];
    lunch: Meal[];
    dinner: Meal[];
    snacks: Meal[];
  };
  notes: string;
}

const commonFoods = [
  { name: 'Pechuga de pollo (100g)', calories: 165, protein: 31, carbs: 0, fat: 3.6 },
  { name: 'Arroz integral (100g)', calories: 111, protein: 2.6, carbs: 23, fat: 0.9 },
  { name: 'Brócoli (100g)', calories: 34, protein: 2.8, carbs: 7, fat: 0.4 },
  { name: 'Salmón (100g)', calories: 208, protein: 20, carbs: 0, fat: 13 },
  { name: 'Avena (100g)', calories: 389, protein: 16.9, carbs: 66, fat: 6.9 },
  { name: 'Huevo entero (1 unidad)', calories: 70, protein: 6, carbs: 0.6, fat: 5 },
  { name: 'Plátano (1 unidad)', calories: 89, protein: 1.1, carbs: 23, fat: 0.3 },
  { name: 'Almendras (30g)', calories: 174, protein: 6.4, carbs: 6.1, fat: 15 },
  { name: 'Yogur griego (100g)', calories: 59, protein: 10, carbs: 3.6, fat: 0.4 },
  { name: 'Quinoa (100g)', calories: 120, protein: 4.4, carbs: 22, fat: 1.9 }
];

export function AssignDietModal({ isOpen, onClose, onSave, clientId, clientName }: AssignDietModalProps) {
  const { user } = useAuth();
  const [dietPlan, setDietPlan] = useState<DietPlan>({
    name: '',
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    targetCalories: 2000,
    targetProtein: 150,
    targetCarbs: 200,
    targetFat: 67,
    meals: {
      breakfast: [],
      lunch: [],
      dinner: [],
      snacks: []
    },
    notes: ''
  });

  const [currentMeal, setCurrentMeal] = useState<Partial<Meal>>({
    name: '',
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    description: '',
    time: ''
  });

  const [selectedMealType, setSelectedMealType] = useState<'breakfast' | 'lunch' | 'dinner' | 'snacks'>('breakfast');
  const [showFoodSearch, setShowFoodSearch] = useState(false);
  const [foodSearch, setFoodSearch] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const dietData = {
      ...dietPlan,
      clientId,
      trainerId: user?.id,
      startDate: new Date(dietPlan.startDate),
      endDate: dietPlan.endDate ? new Date(dietPlan.endDate) : undefined,
      createdAt: new Date()
    };
    
    onSave(dietData);
    onClose();
    resetForm();
  };

  const resetForm = () => {
    setDietPlan({
      name: '',
      startDate: new Date().toISOString().split('T')[0],
      endDate: '',
      targetCalories: 2000,
      targetProtein: 150,
      targetCarbs: 200,
      targetFat: 67,
      meals: {
        breakfast: [],
        lunch: [],
        dinner: [],
        snacks: []
      },
      notes: ''
    });
    setCurrentMeal({
      name: '',
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
      description: '',
      time: ''
    });
  };

  const addMeal = () => {
    if (!currentMeal.name || !currentMeal.calories) return;

    const newMeal: Meal = {
      id: Date.now().toString(),
      name: currentMeal.name!,
      calories: currentMeal.calories!,
      protein: currentMeal.protein!,
      carbs: currentMeal.carbs!,
      fat: currentMeal.fat!,
      description: currentMeal.description,
      time: currentMeal.time
    };

    setDietPlan(prev => ({
      ...prev,
      meals: {
        ...prev.meals,
        [selectedMealType]: [...prev.meals[selectedMealType], newMeal]
      }
    }));

    setCurrentMeal({
      name: '',
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
      description: '',
      time: ''
    });
  };

  const removeMeal = (mealType: keyof typeof dietPlan.meals, mealId: string) => {
    setDietPlan(prev => ({
      ...prev,
      meals: {
        ...prev.meals,
        [mealType]: prev.meals[mealType].filter(meal => meal.id !== mealId)
      }
    }));
  };

  const addCommonFood = (food: typeof commonFoods[0]) => {
    setCurrentMeal({
      name: food.name,
      calories: food.calories,
      protein: food.protein,
      carbs: food.carbs,
      fat: food.fat,
      description: '',
      time: ''
    });
    setShowFoodSearch(false);
    setFoodSearch('');
  };

  const calculateTotalNutrients = () => {
    const allMeals = [
      ...dietPlan.meals.breakfast,
      ...dietPlan.meals.lunch,
      ...dietPlan.meals.dinner,
      ...dietPlan.meals.snacks
    ];

    return allMeals.reduce(
      (total, meal) => ({
        calories: total.calories + meal.calories,
        protein: total.protein + meal.protein,
        carbs: total.carbs + meal.carbs,
        fat: total.fat + meal.fat
      }),
      { calories: 0, protein: 0, carbs: 0, fat: 0 }
    );
  };

  const totalNutrients = calculateTotalNutrients();
  const filteredFoods = commonFoods.filter(food =>
    food.name.toLowerCase().includes(foodSearch.toLowerCase())
  );

  const mealTypeLabels = {
    breakfast: 'Desayuno',
    lunch: 'Almuerzo',
    dinner: 'Cena',
    snacks: 'Snacks'
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Asignar Plan Nutricional</h2>
            <p className="text-sm text-gray-600 mt-1">Cliente: {clientName}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Información básica del plan */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Apple className="w-4 h-4 inline mr-2" />
                Nombre del plan *
              </label>
              <input
                type="text"
                required
                value={dietPlan.name}
                onChange={(e) => setDietPlan(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Ej: Plan de Definición - Marzo 2024"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fecha inicio *
                </label>
                <input
                  type="date"
                  required
                  value={dietPlan.startDate}
                  onChange={(e) => setDietPlan(prev => ({ ...prev, startDate: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fecha fin
                </label>
                <input
                  type="date"
                  value={dietPlan.endDate}
                  onChange={(e) => setDietPlan(prev => ({ ...prev, endDate: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Objetivos nutricionales */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              <Target className="w-5 h-5 inline mr-2" />
              Objetivos Nutricionales Diarios
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Calorías
                </label>
                <input
                  type="number"
                  min="1000"
                  max="5000"
                  value={dietPlan.targetCalories}
                  onChange={(e) => setDietPlan(prev => ({ ...prev, targetCalories: parseInt(e.target.value) }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Proteína (g)
                </label>
                <input
                  type="number"
                  min="50"
                  max="300"
                  value={dietPlan.targetProtein}
                  onChange={(e) => setDietPlan(prev => ({ ...prev, targetProtein: parseInt(e.target.value) }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Carbohidratos (g)
                </label>
                <input
                  type="number"
                  min="50"
                  max="500"
                  value={dietPlan.targetCarbs}
                  onChange={(e) => setDietPlan(prev => ({ ...prev, targetCarbs: parseInt(e.target.value) }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Grasas (g)
                </label>
                <input
                  type="number"
                  min="20"
                  max="200"
                  value={dietPlan.targetFat}
                  onChange={(e) => setDietPlan(prev => ({ ...prev, targetFat: parseInt(e.target.value) }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Planificación de comidas */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Planificación de Comidas</h3>
            
            {/* Selector de tipo de comida */}
            <div className="flex space-x-2 mb-4">
              {Object.entries(mealTypeLabels).map(([key, label]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setSelectedMealType(key as any)}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                    selectedMealType === key
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            {/* Agregar comida */}
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <h4 className="text-sm font-medium text-gray-700 mb-3">
                Agregar alimento a {mealTypeLabels[selectedMealType]}
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-6 gap-3 mb-3">
                <div className="md:col-span-2">
                  <div className="relative">
                    <input
                      type="text"
                      value={currentMeal.name}
                      onChange={(e) => setCurrentMeal(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Nombre del alimento"
                    />
                    <button
                      type="button"
                      onClick={() => setShowFoodSearch(!showFoodSearch)}
                      className="absolute right-2 top-2 p-1 text-gray-400 hover:text-gray-600"
                    >
                      <Search className="w-4 h-4" />
                    </button>
                  </div>
                  
                  {/* Búsqueda de alimentos comunes */}
                  {showFoodSearch && (
                    <div className="absolute z-10 w-64 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                      <div className="p-2">
                        <input
                          type="text"
                          value={foodSearch}
                          onChange={(e) => setFoodSearch(e.target.value)}
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                          placeholder="Buscar alimento..."
                        />
                      </div>
                      {filteredFoods.map((food, index) => (
                        <button
                          key={index}
                          type="button"
                          onClick={() => addCommonFood(food)}
                          className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 focus:bg-gray-50 focus:outline-none"
                        >
                          <div className="font-medium">{food.name}</div>
                          <div className="text-xs text-gray-500">
                            {food.calories} cal • {food.protein}g prot • {food.carbs}g carb • {food.fat}g grasa
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                
                <div>
                  <input
                    type="number"
                    min="0"
                    value={currentMeal.calories}
                    onChange={(e) => setCurrentMeal(prev => ({ ...prev, calories: parseInt(e.target.value) || 0 }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Calorías"
                  />
                </div>
                
                <div>
                  <input
                    type="number"
                    min="0"
                    step="0.1"
                    value={currentMeal.protein}
                    onChange={(e) => setCurrentMeal(prev => ({ ...prev, protein: parseFloat(e.target.value) || 0 }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Proteína (g)"
                  />
                </div>
                
                <div>
                  <input
                    type="number"
                    min="0"
                    step="0.1"
                    value={currentMeal.carbs}
                    onChange={(e) => setCurrentMeal(prev => ({ ...prev, carbs: parseFloat(e.target.value) || 0 }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Carbohidratos (g)"
                  />
                </div>
                
                <div>
                  <input
                    type="number"
                    min="0"
                    step="0.1"
                    value={currentMeal.fat}
                    onChange={(e) => setCurrentMeal(prev => ({ ...prev, fat: parseFloat(e.target.value) || 0 }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Grasas (g)"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                <div>
                  <input
                    type="time"
                    value={currentMeal.time}
                    onChange={(e) => setCurrentMeal(prev => ({ ...prev, time: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Hora sugerida"
                  />
                </div>
                <div>
                  <input
                    type="text"
                    value={currentMeal.description}
                    onChange={(e) => setCurrentMeal(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Descripción o preparación"
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={addMeal}
                disabled={!currentMeal.name || !currentMeal.calories}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Agregar a {mealTypeLabels[selectedMealType]}</span>
              </button>
            </div>

            {/* Lista de comidas por tipo */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {Object.entries(dietPlan.meals).map(([mealType, meals]) => (
                <div key={mealType} className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-3">
                    {mealTypeLabels[mealType as keyof typeof mealTypeLabels]} ({meals.length})
                  </h4>
                  <div className="space-y-2">
                    {meals.map((meal) => (
                      <div key={meal.id} className="bg-gray-50 rounded-lg p-3">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">{meal.name}</p>
                            {meal.time && (
                              <p className="text-xs text-gray-500 flex items-center mt-1">
                                <Clock className="w-3 h-3 mr-1" />
                                {meal.time}
                              </p>
                            )}
                            <div className="text-xs text-gray-600 mt-1">
                              {meal.calories} cal • {meal.protein}g prot
                            </div>
                            {meal.description && (
                              <p className="text-xs text-gray-500 mt-1 italic">{meal.description}</p>
                            )}
                          </div>
                          <button
                            type="button"
                            onClick={() => removeMeal(mealType as keyof typeof dietPlan.meals, meal.id)}
                            className="p-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition-colors"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    ))}
                    {meals.length === 0 && (
                      <p className="text-xs text-gray-500 text-center py-4">
                        No hay alimentos agregados
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Resumen nutricional */}
          <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
            <h3 className="text-md font-semibold text-blue-900 mb-4">
              <Calculator className="w-5 h-5 inline mr-2" />
              Resumen Nutricional del Plan
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">{totalNutrients.calories}</p>
                <p className="text-sm text-blue-800">Calorías totales</p>
                <p className="text-xs text-blue-600">
                  Objetivo: {dietPlan.targetCalories} ({totalNutrients.calories - dietPlan.targetCalories > 0 ? '+' : ''}{totalNutrients.calories - dietPlan.targetCalories})
                </p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">{totalNutrients.protein.toFixed(1)}g</p>
                <p className="text-sm text-green-800">Proteína</p>
                <p className="text-xs text-green-600">
                  Objetivo: {dietPlan.targetProtein}g ({totalNutrients.protein - dietPlan.targetProtein > 0 ? '+' : ''}{(totalNutrients.protein - dietPlan.targetProtein).toFixed(1)}g)
                </p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-orange-600">{totalNutrients.carbs.toFixed(1)}g</p>
                <p className="text-sm text-orange-800">Carbohidratos</p>
                <p className="text-xs text-orange-600">
                  Objetivo: {dietPlan.targetCarbs}g ({totalNutrients.carbs - dietPlan.targetCarbs > 0 ? '+' : ''}{(totalNutrients.carbs - dietPlan.targetCarbs).toFixed(1)}g)
                </p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-purple-600">{totalNutrients.fat.toFixed(1)}g</p>
                <p className="text-sm text-purple-800">Grasas</p>
                <p className="text-xs text-purple-600">
                  Objetivo: {dietPlan.targetFat}g ({totalNutrients.fat - dietPlan.targetFat > 0 ? '+' : ''}{(totalNutrients.fat - dietPlan.targetFat).toFixed(1)}g)
                </p>
              </div>
            </div>
          </div>

          {/* Notas adicionales */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notas e instrucciones adicionales
            </label>
            <textarea
              value={dietPlan.notes}
              onChange={(e) => setDietPlan(prev => ({ ...prev, notes: e.target.value }))}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Instrucciones especiales, suplementos recomendados, horarios de comida, etc..."
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
              Asignar Plan Nutricional
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}