import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { fetchAppointments } from '../../store/slices/schedulingSlice';
import { Calendar, Clock, MapPin, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const AppointmentHistory = () => {
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state: RootState) => state.user);
  const { appointments, loading } = useSelector((state: RootState) => state.scheduling);
  const places = useSelector((state: RootState) => state.places.items);

  useEffect(() => {
    if (currentUser?.uid) {
      dispatch(fetchAppointments(currentUser.uid));
    }
  }, [currentUser, dispatch]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'Confirmado';
      case 'pending':
        return 'Pendente';
      case 'cancelled':
        return 'Cancelado';
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (!appointments.length) {
    return (
      <div className="text-center py-12 bg-white rounded-lg shadow-md">
        <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Nenhum agendamento encontrado
        </h3>
        <p className="text-gray-500">
          Você ainda não tem nenhum agendamento. Que tal marcar uma consulta?
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-900">
        Meus Agendamentos
      </h2>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="divide-y divide-gray-200">
          {appointments.map((appointment) => {
            const place = places.find(p => p.id === appointment.placeId);

            return (
              <div key={appointment.id} className="p-6 hover:bg-gray-50">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <h3 className="text-lg font-medium text-gray-900 mr-3">
                        {place?.name || 'Local não encontrado'}
                      </h3>
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                          appointment.status
                        )}`}
                      >
                        {getStatusText(appointment.status)}
                      </span>
                    </div>

                    <div className="space-y-2 text-sm text-gray-500">
                      <div className="flex items-center">
                        <Calendar size={16} className="mr-2" />
                        {format(new Date(appointment.date), "dd 'de' MMMM 'de' yyyy", {
                          locale: ptBR,
                        })}
                      </div>
                      <div className="flex items-center">
                        <Clock size={16} className="mr-2" />
                        {appointment.time}
                      </div>
                      {place && (
                        <div className="flex items-center">
                          <MapPin size={16} className="mr-2" />
                          {place.address}
                        </div>
                      )}
                      {appointment.notes && (
                        <div className="flex items-start mt-3">
                          <AlertCircle size={16} className="mr-2 mt-0.5" />
                          <p className="text-gray-600">{appointment.notes}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AppointmentHistory;
