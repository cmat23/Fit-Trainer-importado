import React, { useState, useEffect } from 'react';
import { X, Plus, Apple, Clock, Calculator, Target, Search, Trash2, Save } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface EditDietModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (dietData: any) => void;
  dietPlan: any;
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

export function EditDietModal({ isOpen, onClose, onSave, dietPlan }: EditDietModalProps) {
  const { user } = useAuth();
  const [formData, setFormData] = useState<DietPlan>({
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

  // Cargar datos del plan existente cuando se abre el modal
  useEffect(() => {
    if (isOpen && dietPlan) {
      setFormData({
        name: dietPlan.name || '',
        startDate: dietPlan.startDate ? new Date(dietPlan.startDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        endDate: dietPlan.endDate ? new Date(dietPlan.endDate).toISOString().split('T')[0] : '',
        targetCalories: dietPlan.targetCalories || 2000,
        targetProtein: dietPlan.targetProtein || 150,
        targetCarbs: dietPlan.targetCarbs || 200,
        targetFat: dietPlan.targetFat || 67,
        meals: dietPlan.meals || {
          breakfast: [],
          lunch: [],
          dinner: [],
          snacks: []
        },
        notes: dietPlan.notes || ''
      });
    }
  }, [isOpen, dietPlan]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const updatedDietData = {
      ...dietPlan,
      ...formData,
      startDate: new Date(formData.startDate),
      endDate: formData.endDate ? new Date(formData.endDate) : undefined,
      updatedAt: new Date()
    };
    
    onSave(updatedDietData);
    onClose();
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

    setFormData(prev => ({
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

  const removeMeal = (mealType: keyof typeof formData.meals, mealId: string) => {
    setFormData(prev => ({
      ...prev,
      meals: {
        ...prev.meals,
        [mealType]: prev.meals[mealType].filter(meal => meal.id !== mealId)
      }
    }));
  };

  const updateMeal = (mealType: keyof typeof formData.meals, mealId: string, field: keyof Meal, value: any) => {
    setFormData(prev => ({
      ...prev,
      meals: {
        ...prev.meals,
        [mealType]: prev.meals[mealType].map(meal => 
          meal.id === mealId ? { ...meal, [field]: value } : meal
        )
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
      ...formData.meals.breakfast,
      ...formData.meals.lunch,
      ...formData.meals.dinner,
      ...formData.meals.snacks
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
            <h2 className="text-xl font-semibold text-gray-900">Editar Plan Nutricional</h2>
            <p className="text-sm text-gray-600 mt-1">{dietPlan?.name}</p>
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
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
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
                  value={formData.startDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fecha fin
                </label>
                <input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
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
                  value={formData.targetCalories}
                  onChange={(e) => setFormData(prev => ({ ...prev, targetCalories: parseInt(e.target.value) }))}
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
                  value={formData.targetProtein}
                  onChange={(e) => setFormData(prev => ({ ...prev, targetProtein: parseInt(e.target.value) }))}
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
                  value={formData.targetCarbs}
                  onChange={(e) => setFormData(prev => ({ ...prev, targetCarbs: parseInt(e.target.value) }))}
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
                  value={formData.targetFat}
                  onChange={(e) => setFormData(prev => ({ ...prev, targetFat: parseInt(e.target.value) }))}
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

            {/* Lista de comidas existentes por tipo */}
            <div className="mb-6">
              <h4 className="text-md font-medium text-gray-700 mb-3">
                {mealTypeLabels[selectedMealType]} ({formData.meals[selectedMealType].length} alimentos)
              </h4>
              
              <div className="space-y-3">
                {formData.meals[selectedMealType].map((meal) => (
                  <div key={meal.id} className="bg-gray-50 rounded-lg p-4">
                    <div className="grid grid-cols-1 md:grid-cols-6 gap-3 items-center">
                      <div className="md:col-span-2">
                        <input
                          type="text"
                          value={meal.name}
                          onChange={(e) => updateMeal(selectedMealType, meal.id, 'name', e.target.value)}
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                          placeholder="Nombre del alimento"
                        />
                      </div>
                      
                      <div>
                        <input
                          type="number"
                          min="0"
                          value={meal.calories}
                          onChange={(e) => updateMeal(selectedMealType, meal.id, 'calories', parseInt(e.target.value) || 0)}
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                          placeholder="Cal"
                        />
                      </div>
                      
                      <div>
                        <input
                          type="number"
                          min="0"
                          step="0.1"
                          value={meal.protein}
                          onChange={(e) => updateMeal(selectedMealType, meal.id, 'protein', parseFloat(e.target.value) || 0)}
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                          placeholder="Prot"
                        />
                      </div>
                      
                      <div>
                        <input
                          type="time"
                          value={meal.time || ''}
                          onChange={(e) => updateMeal(selectedMealType, meal.id, 'time', e.target.value)}
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                      </div>
                      
                      <div className="flex justify-end">
                        <button
                          type="button"
                          onClick={() => removeMeal(selectedMealType, meal.id)}
                          className="p-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition-colors"
                          title="Eliminar alimento"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    
                    {meal.description && (
                      <div className="mt-2">
                        <input
                          type="text"
                          value={meal.description}
                          onChange={(e) => updateMeal(selectedMealType, meal.id, 'description', e.target.value)}
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                          placeholder="Descripción o preparación"
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Agregar nuevo alimento */}
            <div className="bg-blue-50 rounded-lg p-4">
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
                  Objetivo: {formData.targetCalories} ({totalNutrients.calories - formData.targetCalories > 0 ? '+' : ''}{totalNutrients.calories - formData.targetCalories})
                </p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">{totalNutrients.protein.toFixed(1)}g</p>
                <p className="text-sm text-green-800">Proteína</p>
                <p className="text-xs text-green-600">
                  Objetivo: {formData.targetProtein}g ({totalNutrients.protein - formData.targetProtein > 0 ? '+' : ''}{(totalNutrients.protein - formData.targetProtein).toFixed(1)}g)
                </p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-orange-600">{totalNutrients.carbs.toFixed(1)}g</p>
                <p className="text-sm text-orange-800">Carbohidratos</p>
                <p className="text-xs text-orange-600">
                  Objetivo: {formData.targetCarbs}g ({totalNutrients.carbs - formData.targetCarbs > 0 ? '+' : ''}{(totalNutrients.carbs - formData.targetCarbs).toFixed(1)}g)
                </p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-purple-600">{totalNutrients.fat.toFixed(1)}g</p>
                <p className="text-sm text-purple-800">Grasas</p>
                <p className="text-xs text-purple-600">
                  Objetivo: {formData.targetFat}g ({totalNutrients.fat - formData.targetFat > 0 ? '+' : ''}{(totalNutrients.fat - formData.targetFat).toFixed(1)}g)
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
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
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
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
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