import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { mockClients, mockProgressEntries, mockWorkouts, mockAppointments } from '../../data/mockData';
import { Users, Calendar, Activity, TrendingUp, MessageSquare, Clock } from 'lucide-react';
import { format, isToday, isTomorrow } from 'date-fns';
import { es } from 'date-fns/locale';

export function TrainerDashboard() {
  const { user } = useAuth();
  const clients = mockClients.filter(client => client.trainerId === user?.id);
  const todayAppointments = mockAppointments.filter(apt => 
    apt.trainerId === user?.id && isToday(apt.date)
  );
  const tomorrowAppointments = mockAppointments.filter(apt => 
    apt.trainerId === user?.id && isTomorrow(apt.date)
  );

  // Calcular estadísticas
  const totalClients = clients.length;
  const activeClients = clients.length; // Simplificado
  const completedWorkouts = mockWorkouts.filter(w => w.completed).length;

  return (
    <div className="space-y-6">
      {/* Bienvenida */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">
          ¡Bienvenido de vuelta, {user?.name}!
        </h1>
        <p className="text-blue-100">
          Aquí tienes un resumen de tu actividad como entrenador
        </p>
      </div>

      {/* Estadísticas principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Clientes</p>
              <p className="text-3xl font-bold text-gray-900">{totalClients}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Clientes Activos</p>
              <p className="text-3xl font-bold text-gray-900">{activeClients}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <Activity className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Entrenamientos</p>
              <p className="text-3xl font-bold text-gray-900">{completedWorkouts}</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Citas de hoy */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Citas de Hoy</h2>
            <Calendar className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-3">
            {todayAppointments.length > 0 ? (
              todayAppointments.map((appointment) => {
                const client = clients.find(c => c.id === appointment.clientId);
                return (
                  <div key={appointment.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div className="flex-shrink-0">
                      {client?.avatar ? (
                        <img src={client.avatar} alt={client.name} className="w-10 h-10 rounded-full object-cover" />
                      ) : (
                        <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">{client?.name}</p>
                      <p className="text-sm text-gray-500">
                        {appointment.startTime} - {appointment.endTime}
                      </p>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-gray-500 text-center py-4">No tienes citas programadas para hoy</p>
            )}
          </div>
        </div>

        {/* Clientes recientes */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Clientes Recientes</h2>
            <Users className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-3">
            {clients.slice(0, 4).map((client) => (
              <div key={client.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                <div className="flex-shrink-0">
                  {client.avatar ? (
                    <img src={client.avatar} alt={client.name} className="w-10 h-10 rounded-full object-cover" />
                  ) : (
                    <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">{client.name}</p>
                  <p className="text-sm text-gray-500">
                    {client.currentWeight}kg • {client.age} años
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500">
                    {format(client.createdAt, 'dd MMM', { locale: es })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Actividad reciente */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Actividad Reciente</h2>
        <div className="space-y-4">
          <div className="flex items-start space-x-3">
            <div className="p-2 bg-green-100 rounded-full">
              <Activity className="w-4 h-4 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-900">Ana García completó su rutina de piernas</p>
              <p className="text-xs text-gray-500">Hace 2 horas</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="p-2 bg-blue-100 rounded-full">
              <MessageSquare className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-900">Nuevo mensaje de Miguel Rodríguez</p>
              <p className="text-xs text-gray-500">Hace 1 hora</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="p-2 bg-purple-100 rounded-full">
              <Calendar className="w-4 h-4 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-900">Cita programada con Ana García para mañana</p>
              <p className="text-xs text-gray-500">Hace 3 horas</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}