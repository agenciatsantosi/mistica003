import React, { useState } from 'react';
import { Calendar as CalendarIcon, Clock, MapPin, Users } from 'lucide-react';
import { format, addMonths, subMonths } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface Event {
  id: string;
  title: string;
  date: Date;
  time: string;
  location: string;
  description: string;
  maxParticipants?: number;
  currentParticipants?: number;
  type: 'ceremony' | 'consultation' | 'ritual' | 'class';
}

interface EventCalendarProps {
  events: Event[];
  onEventClick: (event: Event) => void;
}

const EventCalendar = ({ events, onEventClick }: EventCalendarProps) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const handlePreviousMonth = () => {
    setCurrentMonth(prev => subMonths(prev, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(prev => addMonths(prev, 1));
  };

  const eventsByDate = events.reduce((acc, event) => {
    const dateStr = format(event.date, 'yyyy-MM-dd');
    if (!acc[dateStr]) {
      acc[dateStr] = [];
    }
    acc[dateStr].push(event);
    return acc;
  }, {} as Record<string, Event[]>);

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold flex items-center">
          <CalendarIcon className="mr-2" /> Calendário de Eventos
        </h2>
        <div className="flex items-center space-x-4">
          <button
            onClick={handlePreviousMonth}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            ←
          </button>
          <span className="font-medium">
            {format(currentMonth, 'MMMM yyyy', { locale: ptBR })}
          </span>
          <button
            onClick={handleNextMonth}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            →
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {Object.entries(eventsByDate).map(([date, dayEvents]) => (
          <div key={date} className="border-b pb-4 last:border-0">
            <h3 className="font-medium mb-2">
              {format(new Date(date), "dd 'de' MMMM", { locale: ptBR })}
            </h3>
            <div className="space-y-2">
              {dayEvents.map(event => (
                <div
                  key={event.id}
                  onClick={() => onEventClick(event)}
                  className="bg-gray-50 p-4 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium">{event.title}</h4>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      event.type === 'ceremony' ? 'bg-blue-100 text-blue-700' :
                      event.type === 'consultation' ? 'bg-green-100 text-green-700' :
                      event.type === 'ritual' ? 'bg-purple-100 text-purple-700' :
                      'bg-yellow-100 text-yellow-700'
                    }`}>
                      {event.type === 'ceremony' ? 'Cerimônia' :
                       event.type === 'consultation' ? 'Consulta' :
                       event.type === 'ritual' ? 'Ritual' : 'Aula'}
                    </span>
                  </div>
                  
                  <div className="text-sm text-gray-600 space-y-1">
                    <div className="flex items-center">
                      <Clock size={16} className="mr-2" />
                      {event.time}
                    </div>
                    <div className="flex items-center">
                      <MapPin size={16} className="mr-2" />
                      {event.location}
                    </div>
                    {event.maxParticipants && (
                      <div className="flex items-center">
                        <Users size={16} className="mr-2" />
                        {event.currentParticipants}/{event.maxParticipants} vagas
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EventCalendar;