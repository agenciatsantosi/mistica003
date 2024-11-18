import React, { useState, useEffect } from 'react';
import { Calendar, Clock, User, Phone, MessageSquare } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { fetchAvailableSlots, createAppointment } from '../../store/slices/schedulingSlice';
import { Button } from '../ui/Button';
import { toast } from 'react-toastify';

interface SchedulingProps {
  placeId: string;
  placeName: string;
}

const Scheduling = ({ placeId, placeName }: SchedulingProps) => {
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state: RootState) => state.user);
  const { availableSlots, loading } = useSelector((state: RootState) => state.scheduling);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    notes: ''
  });

  useEffect(() => {
    if (selectedDate) {
      dispatch(fetchAvailableSlots({ placeId, date: selectedDate }));
    }
  }, [selectedDate, placeId, dispatch]);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(e.target.value);
    setSelectedTime(null); // Reset selected time when date changes
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentUser?.uid) {
      toast.error('Você precisa estar logado para fazer um agendamento');
      return;
    }

    if (!selectedDate || !selectedTime) {
      toast.error('Selecione uma data e horário');
      return;
    }

    if (!formData.name || !formData.phone) {
      toast.error('Preencha seu nome e telefone');
      return;
    }

    try {
      await dispatch(createAppointment({
        userId: currentUser.uid,
        placeId,
        date: selectedDate,
        time: selectedTime,
        name: formData.name,
        phone: formData.phone,
        notes: formData.notes
      }));

      toast.success('Agendamento realizado com sucesso! Você receberá uma confirmação por WhatsApp.');
      
      // Limpar formulário
      setSelectedDate(null);
      setSelectedTime(null);
      setFormData({ name: '', phone: '', notes: '' });
    } catch (error) {
      toast.error('Erro ao realizar agendamento');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-semibold mb-6">Agendar Consulta em {placeName}</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Data */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Calendar size={16} className="inline mr-2" />
            Selecione uma Data
          </label>
          <input
            type="date"
            value={selectedDate || ''}
            min={new Date().toISOString().split('T')[0]}
            onChange={handleDateChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-rose-500 focus:border-rose-500"
          />
        </div>

        {/* Horários */}
        {selectedDate && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Clock size={16} className="inline mr-2" />
              Horários Disponíveis
            </label>
            <div className="grid grid-cols-3 gap-2">
              {loading ? (
                <div className="col-span-3 text-center py-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-rose-500 mx-auto"></div>
                </div>
              ) : (
                availableSlots.map(slot => (
                  <button
                    key={slot.time}
                    type="button"
                    disabled={!slot.available}
                    onClick={() => setSelectedTime(slot.time)}
                    className={`p-2 rounded-md text-center transition-colors ${
                      selectedTime === slot.time
                        ? 'bg-rose-500 text-white'
                        : slot.available
                        ? 'bg-gray-100 hover:bg-gray-200'
                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    {slot.time}
                  </button>
                ))
              )}
            </div>
          </div>
        )}

        {/* Informações pessoais */}
        {selectedTime && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <User size={16} className="inline mr-2" />
                Seu Nome
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Nome completo"
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-rose-500 focus:border-rose-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Phone size={16} className="inline mr-2" />
                Seu WhatsApp
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                placeholder="(00) 00000-0000"
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-rose-500 focus:border-rose-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <MessageSquare size={16} className="inline mr-2" />
                Observações (opcional)
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="Alguma observação importante?"
                rows={3}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-rose-500 focus:border-rose-500"
              />
            </div>
          </div>
        )}

        <Button
          type="submit"
          disabled={loading || !selectedDate || !selectedTime || !formData.name || !formData.phone}
          className="w-full"
        >
          {loading ? 'Agendando...' : 'Confirmar Agendamento'}
        </Button>
      </form>
    </div>
  );
};

export default Scheduling;