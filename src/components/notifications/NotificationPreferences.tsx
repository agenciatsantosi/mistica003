import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { updateNotificationPreferences } from '../../store/slices/notificationsSlice';
import { Bell, Calendar, Clock, Users } from 'lucide-react';
import { Button } from '../ui/Button';
import { toast } from 'react-toastify';

interface NotificationPreferencesProps {
  placeId: string;
  placeName: string;
}

const NotificationPreferences = ({ placeId, placeName }: NotificationPreferencesProps) => {
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state: RootState) => state.user);
  const preferences = useSelector((state: RootState) => 
    state.notifications.preferences[placeId] || {
      events: false,
      rituals: false,
      consultations: false,
      frequency: 'important'
    }
  );

  const [loading, setLoading] = useState(false);
  const [localPrefs, setLocalPrefs] = useState(preferences);

  const handleToggle = (key: 'events' | 'rituals' | 'consultations') => {
    setLocalPrefs(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleFrequencyChange = (frequency: 'daily' | 'weekly' | 'important') => {
    setLocalPrefs(prev => ({
      ...prev,
      frequency
    }));
  };

  const handleSave = async () => {
    if (!currentUser) {
      toast.error('Você precisa estar logado para configurar notificações');
      return;
    }

    setLoading(true);
    try {
      await dispatch(updateNotificationPreferences({
        userId: currentUser.uid,
        placeId,
        preferences: localPrefs
      }));
      toast.success('Preferências de notificação atualizadas!');
    } catch (error) {
      toast.error('Erro ao salvar preferências');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold">Notificações para {placeName}</h3>
        <Bell className="text-gray-400" />
      </div>

      <div className="space-y-4">
        <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer">
          <div className="flex items-center">
            <Calendar className="text-rose-500 mr-3" size={20} />
            <span>Eventos Especiais</span>
          </div>
          <input
            type="checkbox"
            checked={localPrefs.events}
            onChange={() => handleToggle('events')}
            className="form-checkbox h-5 w-5 text-rose-500 rounded focus:ring-rose-500"
          />
        </label>

        <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer">
          <div className="flex items-center">
            <Users className="text-rose-500 mr-3" size={20} />
            <span>Rituais e Celebrações</span>
          </div>
          <input
            type="checkbox"
            checked={localPrefs.rituals}
            onChange={() => handleToggle('rituals')}
            className="form-checkbox h-5 w-5 text-rose-500 rounded focus:ring-rose-500"
          />
        </label>

        <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer">
          <div className="flex items-center">
            <Clock className="text-rose-500 mr-3" size={20} />
            <span>Horários de Consulta</span>
          </div>
          <input
            type="checkbox"
            checked={localPrefs.consultations}
            onChange={() => handleToggle('consultations')}
            className="form-checkbox h-5 w-5 text-rose-500 rounded focus:ring-rose-500"
          />
        </label>

        <div className="mt-6">
          <h4 className="text-sm font-medium text-gray-700 mb-3">
            Frequência das Notificações
          </h4>
          <div className="grid grid-cols-3 gap-3">
            <button
              onClick={() => handleFrequencyChange('daily')}
              className={`p-2 text-sm rounded-lg border ${
                localPrefs.frequency === 'daily'
                  ? 'bg-rose-500 text-white border-rose-500'
                  : 'border-gray-300 hover:border-rose-500'
              }`}
            >
              Diária
            </button>
            <button
              onClick={() => handleFrequencyChange('weekly')}
              className={`p-2 text-sm rounded-lg border ${
                localPrefs.frequency === 'weekly'
                  ? 'bg-rose-500 text-white border-rose-500'
                  : 'border-gray-300 hover:border-rose-500'
              }`}
            >
              Semanal
            </button>
            <button
              onClick={() => handleFrequencyChange('important')}
              className={`p-2 text-sm rounded-lg border ${
                localPrefs.frequency === 'important'
                  ? 'bg-rose-500 text-white border-rose-500'
                  : 'border-gray-300 hover:border-rose-500'
              }`}
            >
              Importantes
            </button>
          </div>
        </div>

        <div className="mt-6">
          <Button
            onClick={handleSave}
            loading={loading}
            className="w-full"
          >
            Salvar Preferências
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotificationPreferences;