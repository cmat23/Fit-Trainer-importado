import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { mockDietPlans, mockClients } from '../../data/mockData';
import { 
  Apple, 
  Plus, 
  Calendar,
  Clock,
  Calculator,
  Target,
  ChefHat,
  Utensils,
  Coffee,
  Cookie,
  Edit,
  Trash2,
  CheckCircle,
  AlertCircle,
  User
} from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { AssignDietModal } from './AssignDietModal';

export function DietPage() {
  const { user } = useAuth();
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Filtrar planes de dieta según el rol del usuario
  const userDietPlans = user?.role === 'trainer' 
    ? mockDietPlans.filter(plan => plan.trainerId === user.id)
    : mockDietPlans.filter(plan => plan.clientId === user?.id);

  const activeDietPlan = userDietPlans.find(plan => {
    const now = new Date();
    return plan.startDate <= now && (!plan.endDate || plan.endDate >= now);
  });

  const handleAssignDiet = (dietData: any) => {
    console.log('Assigning diet:', dietData);
    alert('Plan nutricional asignado exitosamente (funcionalidad de demostración)');
  };

  const handleEditDiet = (planId: string) => {
    alert(`Editar plan ${planId} (funcionalidad de demostración)`);
  };

  const handleDeleteDiet = (planId: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este plan nutricional?')) {
      alert(`Plan ${planId} eliminado (funcionalidad de demostración)`);
    }
  };

  const calculateDailyTotals = (meals: any) => {
    const allMeals = [
      ...meals.breakfast,
      ...meals.lunch,
      ...meals.dinner,
      ...meals.snacks
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

  const getMealIcon = (mealType: string) => {
    switch (mealType) {
      case 'breakfast': return <Coffee className="w-5 h-5 text-orange-600" />;
      case 'lunch': return <Utensils className="w-5 h-5 text-green-600" />;
      case 'dinner': return <ChefHat className="w-5 h-5 text-blue-600" />;
      case 'snacks': return <Cookie className="w-5 h-5 text-purple-600" />;
      default: return <Apple className="w-5 h-5 text-gray-600" />;
    }
  };

  const getMealTypeLabel = (mealType: string) => {
    switch (mealType) {
      case 'breakfast': return 'Desayuno';
      case 'lunch': return 'Almuerzo';
      case 'dinner': return 'Cena';
      case 'snacks': return 'Snacks';
      default: return mealType;
    }
  };

  const getClientName = (clientId: string) => {
    const client = mockClients.find(c => c.id === clientId);
    return client?.name || 'Cliente desconocido';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {user?.role === 'trainer' ? 'Planes Nutricionales' : 'Mi Dieta'}
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            {user?.role === 'trainer' 
              ? 'Gestiona los planes nutricionales de tus clientes'
              : 'Sigue tu plan nutricional personalizado'
            }
          </p>
        </div>
        {user?.role === 'trainer' && (
          <button 
            onClick={() => setIsAssignModalOpen(true)}
            className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200"
          >
            <Plus className="w-4 h-4 mr-2" />
            Asignar Plan Nutricional
          </button>
        )}
      </div>

      {/* Vista para clientes - Plan activo */}
      {user?.role === 'client' && activeDietPlan && (
        <div className="space-y-6">
          {/* Información del plan */}
          <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold mb-2">{activeDietPlan.name}</h2>
                <p className="text-green-100">
                  Plan activo desde {format(activeDietPlan.startDate, 'dd MMM yyyy', { locale: es })}
                  {activeDietPlan.endDate && ` hasta ${format(activeDietPlan.endDate, 'dd MMM yyyy', { locale: es })}`}
                </p>
              </div>
              <Apple className="w-12 h-12 text-green-200" />
            </div>
          </div>

          {/* Objetivos nutricionales */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              <Target className="w-5 h-5 inline mr-2" />
              Objetivos Nutricionales Diarios
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-gray-600">Calorías</p>
                <p className="text-2xl font-bold text-blue-600">{activeDietPlan.targetCalories}</p>
                <p className="text-xs text-gray-500">kcal</p>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <p className="text-sm text-gray-600">Proteína</p>
                <p className="text-2xl font-bold text-green-600">{activeDietPlan.targetProtein}</p>
                <p className="text-xs text-gray-500">g</p>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <p className="text-sm text-gray-600">Carbohidratos</p>
                <p className="text-2xl font-bold text-orange-600">{activeDietPlan.targetCarbs}</p>
                <p className="text-xs text-gray-500">g</p>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <p className="text-sm text-gray-600">Grasas</p>
                <p className="text-2xl font-bold text-purple-600">{activeDietPlan.targetFat}</p>
                <p className="text-xs text-gray-500">g</p>
              </div>
            </div>
          </div>

          {/* Plan de comidas del día */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">
                <Calendar className="w-5 h-5 inline mr-2" />
                Plan de Comidas - {format(selectedDate, 'dd MMMM yyyy', { locale: es })}
              </h3>
              <input
                type="date"
                value={selectedDate.toISOString().split('T')[0]}
                onChange={(e) => setSelectedDate(new Date(e.target.value))}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {Object.entries(activeDietPlan.meals).map(([mealType, meals]) => (
                <div key={mealType} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-4">
                    {getMealIcon(mealType)}
                    <h4 className="font-semibold text-gray-900">{getMealTypeLabel(mealType)}</h4>
                    <span className="text-sm text-gray-500">({meals.length} alimentos)</span>
                  </div>

                  <div className="space-y-3">
                    {meals.map((meal, index) => (
                      <div key={index} className="bg-gray-50 rounded-lg p-3">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h5 className="font-medium text-gray-900">{meal.name}</h5>
                            {meal.time && (
                              <p className="text-sm text-gray-500 flex items-center mt-1">
                                <Clock className="w-3 h-3 mr-1" />
                                {meal.time}
                              </p>
                            )}
                            {meal.description && (
                              <p className="text-sm text-gray-600 mt-1 italic">{meal.description}</p>
                            )}
                            <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                              <span>{meal.calories} cal</span>
                              <span>{meal.protein}g prot</span>
                              <span>{meal.carbs}g carb</span>
                              <span>{meal.fat}g grasa</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}

                    {meals.length === 0 && (
                      <p className="text-sm text-gray-500 text-center py-4">
                        No hay alimentos programados
                      </p>
                    )}
                  </div>

                  {/* Totales por comida */}
                  {meals.length > 0 && (
                    <div className="mt-4 pt-3 border-t border-gray-200">
                      <div className="grid grid-cols-4 gap-2 text-xs">
                        <div className="text-center">
                          <p className="font-medium text-gray-900">
                            {meals.reduce((sum, meal) => sum + meal.calories, 0)}
                          </p>
                          <p className="text-gray-500">cal</p>
                        </div>
                        <div className="text-center">
                          <p className="font-medium text-gray-900">
                            {meals.reduce((sum, meal) => sum + meal.protein, 0).toFixed(1)}g
                          </p>
                          <p className="text-gray-500">prot</p>
                        </div>
                        <div className="text-center">
                          <p className="font-medium text-gray-900">
                            {meals.reduce((sum, meal) => sum + meal.carbs, 0).toFixed(1)}g
                          </p>
                          <p className="text-gray-500">carb</p>
                        </div>
                        <div className="text-center">
                          <p className="font-medium text-gray-900">
                            {meals.reduce((sum, meal) => sum + meal.fat, 0).toFixed(1)}g
                          </p>
                          <p className="text-gray-500">grasa</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Resumen nutricional del día */}
            <div className="mt-6 bg-green-50 rounded-xl p-4 border border-green-200">
              <h4 className="text-md font-semibold text-green-900 mb-3">
                <Calculator className="w-5 h-5 inline mr-2" />
                Resumen Nutricional del Día
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {(() => {
                  const dailyTotals = calculateDailyTotals(activeDietPlan.meals);
                  return (
                    <>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-green-600">{dailyTotals.calories}</p>
                        <p className="text-sm text-green-800">Calorías totales</p>
                        <p className="text-xs text-green-600">
                          Objetivo: {activeDietPlan.targetCalories} ({dailyTotals.calories - activeDietPlan.targetCalories > 0 ? '+' : ''}{dailyTotals.calories - activeDietPlan.targetCalories})
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-blue-600">{dailyTotals.protein.toFixed(1)}g</p>
                        <p className="text-sm text-blue-800">Proteína</p>
                        <p className="text-xs text-blue-600">
                          Objetivo: {activeDietPlan.targetProtein}g ({dailyTotals.protein - activeDietPlan.targetProtein > 0 ? '+' : ''}{(dailyTotals.protein - activeDietPlan.targetProtein).toFixed(1)}g)
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-orange-600">{dailyTotals.carbs.toFixed(1)}g</p>
                        <p className="text-sm text-orange-800">Carbohidratos</p>
                        <p className="text-xs text-orange-600">
                          Objetivo: {activeDietPlan.targetCarbs}g ({dailyTotals.carbs - activeDietPlan.targetCarbs > 0 ? '+' : ''}{(dailyTotals.carbs - activeDietPlan.targetCarbs).toFixed(1)}g)
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-purple-600">{dailyTotals.fat.toFixed(1)}g</p>
                        <p className="text-sm text-purple-800">Grasas</p>
                        <p className="text-xs text-purple-600">
                          Objetivo: {activeDietPlan.targetFat}g ({dailyTotals.fat - activeDietPlan.targetFat > 0 ? '+' : ''}{(dailyTotals.fat - activeDietPlan.targetFat).toFixed(1)}g)
                        </p>
                      </div>
                    </>
                  );
                })()}
              </div>
            </div>

            {/* Notas del plan */}
            {activeDietPlan.notes && (
              <div className="mt-6 bg-blue-50 rounded-lg p-4">
                <h4 className="text-sm font-medium text-blue-900 mb-2">Instrucciones del Entrenador:</h4>
                <p className="text-sm text-blue-800">{activeDietPlan.notes}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Vista para clientes sin plan activo */}
      {user?.role === 'client' && !activeDietPlan && (
        <div className="text-center py-12">
          <Apple className="mx-auto h-16 w-16 text-gray-400" />
          <h3 className="mt-4 text-lg font-medium text-gray-900">No tienes un plan nutricional activo</h3>
          <p className="mt-2 text-sm text-gray-500">
            Tu entrenador te asignará un plan nutricional personalizado pronto
          </p>
        </div>
      )}

      {/* Vista para entrenadores */}
      {user?.role === 'trainer' && (
        <div className="space-y-6">
          {/* Lista de planes nutricionales */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Planes Nutricionales Activos</h2>
              
              {userDietPlans.length > 0 ? (
                <div className="space-y-4">
                  {userDietPlans.map((plan) => {
                    const dailyTotals = calculateDailyTotals(plan.meals);
                    const isActive = plan.startDate <= new Date() && (!plan.endDate || plan.endDate >= new Date());
                    
                    return (
                      <div key={plan.id} className="border border-gray-200 rounded-lg p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <h3 className="text-lg font-semibold text-gray-900">{plan.name}</h3>
                              <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                              }`}>
                                {isActive ? 'Activo' : 'Inactivo'}
                              </span>
                            </div>
                            
                            <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                              <div className="flex items-center space-x-1">
                                <User className="w-4 h-4" />
                                <span>{getClientName(plan.clientId)}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Calendar className="w-4 h-4" />
                                <span>
                                  {format(plan.startDate, 'dd MMM', { locale: es })}
                                  {plan.endDate && ` - ${format(plan.endDate, 'dd MMM', { locale: es })}`}
                                </span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Calculator className="w-4 h-4" />
                                <span>{dailyTotals.calories} cal/día</span>
                              </div>
                            </div>

                            {/* Resumen nutricional */}
                            <div className="grid grid-cols-4 gap-4 mb-4">
                              <div className="text-center p-3 bg-blue-50 rounded-lg">
                                <p className="text-sm font-medium text-blue-900">{plan.targetCalories}</p>
                                <p className="text-xs text-blue-600">Calorías</p>
                              </div>
                              <div className="text-center p-3 bg-green-50 rounded-lg">
                                <p className="text-sm font-medium text-green-900">{plan.targetProtein}g</p>
                                <p className="text-xs text-green-600">Proteína</p>
                              </div>
                              <div className="text-center p-3 bg-orange-50 rounded-lg">
                                <p className="text-sm font-medium text-orange-900">{plan.targetCarbs}g</p>
                                <p className="text-xs text-orange-600">Carbohidratos</p>
                              </div>
                              <div className="text-center p-3 bg-purple-50 rounded-lg">
                                <p className="text-sm font-medium text-purple-900">{plan.targetFat}g</p>
                                <p className="text-xs text-purple-600">Grasas</p>
                              </div>
                            </div>

                            {/* Comidas programadas */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                              {Object.entries(plan.meals).map(([mealType, meals]) => (
                                <div key={mealType} className="text-center p-2 bg-gray-50 rounded-lg">
                                  <div className="flex items-center justify-center mb-1">
                                    {getMealIcon(mealType)}
                                  </div>
                                  <p className="text-xs font-medium text-gray-900">{getMealTypeLabel(mealType)}</p>
                                  <p className="text-xs text-gray-600">{meals.length} alimentos</p>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Acciones */}
                          <div className="flex items-center space-x-2 ml-4">
                            <button
                              onClick={() => handleEditDiet(plan.id)}
                              className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-full transition-colors"
                              title="Editar plan"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteDiet(plan.id)}
                              className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-full transition-colors"
                              title="Eliminar plan"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        {/* Notas */}
                        {plan.notes && (
                          <div className="bg-gray-50 rounded-lg p-3">
                            <p className="text-sm text-gray-700">{plan.notes}</p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Apple className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No hay planes nutricionales</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Crea tu primer plan nutricional para un cliente
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <AssignDietModal
        isOpen={isAssignModalOpen}
        onClose={() => setIsAssignModalOpen(false)}
        onSave={handleAssignDiet}
        clientId=""
        clientName=""
      />
    </div>
  );
}