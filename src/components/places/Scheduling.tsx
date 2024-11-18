import React, { useState } from 'react';
import { Calendar, Clock, User, Phone, MessageSquare } from 'lucide-react';
import { Button } from '../ui/Button';
import { toast } from 'react-toastify';

interface TimeSlot {
  time: string;
  available: boolean;
}

interface SchedulingProps {
  placeId: string;
  placeName: string;
}

const Scheduling = ({ placeId, placeName }: SchedulingProps) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    notes: ''
  });

  // Simula horários disponíveis
  const timeSlots: TimeSlot[] = [
    { time: '09:00', available: true },
    { time: '10:00', available: false },
    { time: '11:00', available: true },
    { time: '14:00', available: true },
    { time: '15:00', available: true },
    { time: '16:00', available: false },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedDate || !selectedTime) {
      toast.error('Selecione uma data e horário');
      return;
    }

    try {
      // Aqui você implementaria a lógica de agendamento
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
      <h2 className="text-2xl font-semibold mb-6">Agendar Consulta</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Data */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Calendar size={16} className="inline mr-2" />
            Selecione uma Data
          </label>
          <input
            type="date"
            min={new Date().toISOString().split('T')[0]}
            onChange={(e) => setSelectedDate(new Date(e.target.value))}
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
              {timeSlots.map(slot => (
                <button
                  key={slot.time}
                  type="button"
                  disabled={!slot.available}
                  onClick={() => setSelectedTime(slot.time)}
                  className={`p-2 rounded-md text-center ${
                    selectedTime === slot.time
                      ? 'bg-rose-500 text-white'
                      : slot.available
                      ? 'bg-gray-100 hover:bg-gray-200'
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  {slot.time}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Dados pessoais */}
        {selectedTime && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <User size={16} className="inline mr-2" />
                Nome Completo
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-rose-500 focus:border-rose-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Phone size={16} className="inline mr-2" />
                WhatsApp
              </label>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="(00) 00000-0000"
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-rose-500 focus:border-rose-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <MessageSquare size={16} className="inline mr-2" />
                Observações
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-rose-500 focus:border-rose-500"
                rows={3}
              />
            </div>
          </div>
        )}

        {selectedDate && selectedTime && (
          <Button type="submit" className="w-full">
            Confirmar Agendamento
          </Button>
        )}
      </form>
    </div>
  );
};

export default Scheduling;