import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { mockAppointments, mockClients } from '../../data/mockData';
import { 
  Calendar as CalendarIcon, 
  Plus, 
  ChevronLeft, 
  ChevronRight,
  Clock,
  MapPin,
  User
} from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday, addMonths, subMonths } from 'date-fns';
import { es } from 'date-fns/locale';
import { AddAppointmentModal } from './AddAppointmentModal';

export function CalendarPage() {
  const { user } = useAuth();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Filtrar citas según el rol del usuario
  const userAppointments = user?.role === 'trainer'
    ? mockAppointments.filter(apt => apt.trainerId === user.id)
    : mockAppointments.filter(apt => apt.clientId === user.id);

  // Obtener días del mes actual
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Obtener citas para una fecha específica
  const getAppointmentsForDate = (date: Date) => {
    return userAppointments.filter(apt => isSameDay(apt.date, date));
  };

  // Obtener citas del día seleccionado
  const selectedDateAppointments = selectedDate 
    ? getAppointmentsForDate(selectedDate)
    : getAppointmentsForDate(new Date());

  const getClientName = (clientId: string) => {
    const client = mockClients.find(c => c.id === clientId);
    return client?.name || 'Cliente desconocido';
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(direction === 'prev' ? subMonths(currentDate, 1) : addMonths(currentDate, 1));
  };

  const handleAddAppointment = (appointmentData: any) => {
    console.log('Adding new appointment:', appointmentData);
    alert('Cita programada exitosamente (funcionalidad de demostración)');
  };

  const handleNewAppointment = () => {
    setIsAddModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Calendario</h1>
          <p className="mt-1 text-sm text-gray-600">
            Gestiona tus citas y entrenamientos
          </p>
        </div>
        {user?.role === 'trainer' && (
          <button 
            onClick={handleNewAppointment}
            className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
          >
            <Plus className="w-4 h-4 mr-2" />
            Nueva Cita
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendario */}
        <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          {/* Header del calendario */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">
              {format(currentDate, 'MMMM yyyy', { locale: es })}
            </h2>
            <div className="flex space-x-2">
              <button
                onClick={() => navigateMonth('prev')}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => navigateMonth('next')}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Días de la semana */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map((day) => (
              <div key={day} className="p-2 text-center text-sm font-medium text-gray-500">
                {day}
              </div>
            ))}
          </div>

          {/* Días del mes */}
          <div className="grid grid-cols-7 gap-1">
            {daysInMonth.map((day) => {
              const dayAppointments = getAppointmentsForDate(day);
              const isSelected = selectedDate && isSameDay(day, selectedDate);
              const isTodayDate = isToday(day);

              return (
                <button
                  key={day.toString()}
                  onClick={() => setSelectedDate(day)}
                  className={`p-2 text-center text-sm rounded-lg transition-colors relative ${
                    isSelected
                      ? 'bg-blue-600 text-white'
                      : isTodayDate
                      ? 'bg-blue-100 text-blue-700 font-semibold'
                      : dayAppointments.length > 0
                      ? 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {format(day, 'd')}
                  {dayAppointments.length > 0 && (
                    <div className={`absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 rounded-full ${
                      isSelected ? 'bg-white' : 'bg-blue-600'
                    }`} />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Panel de citas */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              {selectedDate ? format(selectedDate, 'dd MMMM', { locale: es }) : 'Hoy'}
            </h3>
            <CalendarIcon className="w-5 h-5 text-gray-400" />
          </div>

          <div className="space-y-3">
            {selectedDateAppointments.length > 0 ? (
              selectedDateAppointments.map((appointment) => (
                <div key={appointment.id} className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <Clock className="w-4 h-4 text-gray-400" />
                        <span className="text-sm font-medium text-gray-900">
                          {appointment.startTime} - {appointment.endTime}
                        </span>
                      </div>
                      
                      {user?.role === 'trainer' && (
                        <div className="flex items-center space-x-2 mb-1">
                          <User className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-600">
                            {getClientName(appointment.clientId)}
                          </span>
                        </div>
                      )}
                      
                      <div className="flex items-center space-x-2 mb-2">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600">
                          {appointment.location}
                        </span>
                      </div>
                      
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                        appointment.type === 'personal'
                          ? 'bg-blue-100 text-blue-800'
                          : appointment.type === 'group'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-purple-100 text-purple-800'
                      }`}>
                        {appointment.type === 'personal' ? 'Personal' :
                         appointment.type === 'group' ? 'Grupal' : 'Consulta'}
                      </span>
                      
                      {appointment.notes && (
                        <p className="text-xs text-gray-500 mt-2 italic">
                          "{appointment.notes}"
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <CalendarIcon className="mx-auto h-8 w-8 text-gray-400" />
                <p className="mt-2 text-sm text-gray-500">
                  No hay citas programadas para este día
                </p>
                {user?.role === 'trainer' && (
                  <button
                    onClick={handleNewAppointment}
                    className="mt-3 text-sm text-blue-600 hover:text-blue-500"
                  >
                    Programar nueva cita
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Próximas citas */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Próximas Citas</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {userAppointments
            .filter(apt => apt.date >= new Date())
            .slice(0, 6)
            .map((appointment) => (
              <div key={appointment.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-900">
                    {format(appointment.date, 'dd MMM', { locale: es })}
                  </span>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    appointment.status === 'scheduled'
                      ? 'bg-blue-100 text-blue-800'
                      : appointment.status === 'completed'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {appointment.status === 'scheduled' ? 'Programada' :
                     appointment.status === 'completed' ? 'Completada' : 'Cancelada'}
                  </span>
                </div>
                
                <div className="space-y-1 text-sm text-gray-600">
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4" />
                    <span>{appointment.startTime} - {appointment.endTime}</span>
                  </div>
                  
                  {user?.role === 'trainer' && (
                    <div className="flex items-center space-x-2">
                      <User className="w-4 h-4" />
                      <span>{getClientName(appointment.clientId)}</span>
                    </div>
                  )}
                  
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4" />
                    <span className="truncate">{appointment.location}</span>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>

      <AddAppointmentModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleAddAppointment}
        selectedDate={selectedDate || undefined}
      />
    </div>
  );
}